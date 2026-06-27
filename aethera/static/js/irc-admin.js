/**
 * IRC Admin Control Panel JavaScript
 * 
 * Handles session management, WebSocket communication, and UI updates.
 */

class IRCAdminPanel {
    constructor() {
        this.sessionId = null;
        this.ws = null;
        this.config = {};
        this.startTime = null;
        this.timerInterval = null;
        
        // Store API keys per provider (persisted in memory during session)
        this.apiKeys = {
            gen: {},    // { anthropic: 'sk-...', openai: 'sk-...', ... }
            judge: {}
        };
        
        // Store base URLs per provider (for local provider)
        this.baseUrls = {
            gen: {},
            judge: {}
        };
        
        // Store model slugs per provider
        this.modelSlugs = {
            gen: {},
            judge: {}
        };
        
        // Track previous provider to save values before switch
        this.previousProvider = {
            gen: null,
            judge: null
        };
        
        // Store default prompts
        this.defaultPrompts = null;
        
        // Profile management
        this.activeProfileName = null;
        this.PROFILES_STORAGE_KEY = 'ircAdminProfiles';
        
        // Track last prompts/responses for I/O panel
        this.lastIO = {
            gen: { prompt: null, response: null },
            judge: { prompt: null, response: null }
        };
        
        // Current candidates for modal navigation
        this.currentCandidates = [];
        this.currentCandidateIndex = 0;
        
        this.initElements();
        this.initEventListeners();
        this.loadProviders();
        this.loadDefaultPrompts();
        this.loadSavedProfiles();
        this.initConfigBarToggles();
        this.initExpandModals();
    }
    
    initElements() {
        // Session controls
        this.btnNewSession = document.getElementById('btn-new-session');
        this.btnDeleteSession = document.getElementById('btn-delete-session');
        this.btnStart = document.getElementById('btn-start');
        this.btnStop = document.getElementById('btn-stop');
        this.btnContinue = document.getElementById('btn-continue');
        this.btnExport = document.getElementById('btn-export');
        this.btnCopy = document.getElementById('btn-copy');
        
        // Status
        this.sessionStatus = document.getElementById('session-status');
        this.sessionIdSpan = document.getElementById('session-id');
        
        // Config inputs - Generation
        this.genProvider = document.getElementById('gen-provider');
        this.genModel = document.getElementById('gen-model');
        this.genApiKey = document.getElementById('gen-api-key');
        this.genApiKeyGroup = document.getElementById('gen-api-key-group');
        this.genApiKeyStatus = document.getElementById('gen-api-key-status');
        this.genBaseUrl = document.getElementById('gen-base-url');
        this.genBaseUrlGroup = document.getElementById('gen-base-url-group');
        this.genTemp = document.getElementById('gen-temp');
        this.genTempVal = document.getElementById('gen-temp-val');
        this.genTopP = document.getElementById('gen-top-p');
        this.genTopPVal = document.getElementById('gen-top-p-val');
        
        // Config inputs - Judge
        this.judgeProvider = document.getElementById('judge-provider');
        this.judgeModel = document.getElementById('judge-model');
        this.judgeApiKey = document.getElementById('judge-api-key');
        this.judgeApiKeyGroup = document.getElementById('judge-api-key-group');
        this.judgeApiKeyStatus = document.getElementById('judge-api-key-status');
        this.judgeBaseUrl = document.getElementById('judge-base-url');
        this.judgeBaseUrlGroup = document.getElementById('judge-base-url-group');
        this.judgeTemp = document.getElementById('judge-temp');
        this.judgeTempVal = document.getElementById('judge-temp-val');
        this.judgeTopP = document.getElementById('judge-top-p');
        this.judgeTopPVal = document.getElementById('judge-top-p-val');
        
        this.fragStyle = document.getElementById('frag-style');
        this.fragCollapse = document.getElementById('frag-collapse');
        this.fragTarget = document.getElementById('frag-target');
        this.fragTargetVal = document.getElementById('frag-target-val');
        
        this.loopBatch = document.getElementById('loop-batch');
        this.loopBatchVal = document.getElementById('loop-batch-val');
        this.loopThreshold = document.getElementById('loop-threshold');
        this.loopThresholdVal = document.getElementById('loop-threshold-val');
        
        this.dryRun = document.getElementById('dry-run');
        
        // Profiles
        this.profilesList = document.getElementById('profiles-list');
        this.profileNameInput = document.getElementById('profile-name');
        this.btnSaveProfile = document.getElementById('btn-save-profile');
        this.btnExportProfile = document.getElementById('btn-export-profile');
        this.btnImportProfile = document.getElementById('btn-import-profile');
        
        // Prompt customization
        this.promptGenSystem = document.getElementById('prompt-gen-system');
        this.promptJudgeSystem = document.getElementById('prompt-judge-system');
        this.promptJudgeUser = document.getElementById('prompt-judge-user');
        this.promptJudgeUserFirst = document.getElementById('prompt-judge-user-first');
        
        // Progress
        this.progressFill = document.getElementById('progress-fill');
        this.progressMessages = document.getElementById('progress-messages');
        this.progressChunks = document.getElementById('progress-chunks');
        this.progressPhase = document.getElementById('progress-phase');
        
        // Live view
        this.logStream = document.getElementById('log-stream');
        this.candidatesGrid = document.getElementById('candidates-grid');
        this.candidatesCount = document.getElementById('candidates-count');
        this.waitingIndicator = document.getElementById('waiting-indicator');
        this.transcript = document.getElementById('transcript');
        
        // Stats
        this.statTokens = document.getElementById('stat-tokens');
        this.statCost = document.getElementById('stat-cost');
        this.statTime = document.getElementById('stat-time');
        
        // I/O Panel elements
        this.genModelLabel = document.getElementById('gen-model-label');
        this.judgeModelLabel = document.getElementById('judge-model-label');
        this.genLastPrompt = document.getElementById('gen-last-prompt');
        this.genLastResponse = document.getElementById('gen-last-response');
        this.judgeLastPrompt = document.getElementById('judge-last-prompt');
        this.judgeLastResponse = document.getElementById('judge-last-response');
        
        // Expand modal elements
        this.expandModal = document.getElementById('expand-modal');
        this.expandModalTitle = document.getElementById('expand-modal-title');
        this.expandModalText = document.getElementById('expand-modal-text');
        
        // Candidate modal elements
        this.candidateModal = document.getElementById('candidate-modal');
        this.candidateModalTitle = document.getElementById('candidate-modal-title');
        this.candidateModalText = document.getElementById('candidate-modal-text');
        this.candidateModalPosition = document.getElementById('candidate-modal-position');
        this.candidateModalPrev = document.getElementById('candidate-modal-prev');
        this.candidateModalNext = document.getElementById('candidate-modal-next');
        this.candidateModalSelect = document.getElementById('candidate-modal-select');
    }
    
    initEventListeners() {
        // Session buttons
        this.btnNewSession.addEventListener('click', () => this.createSession());
        this.btnDeleteSession.addEventListener('click', () => this.deleteSession());
        this.btnStart.addEventListener('click', () => this.startGeneration());
        this.btnStop.addEventListener('click', () => this.stopGeneration());
        this.btnContinue.addEventListener('click', () => this.continueGeneration());
        this.btnExport.addEventListener('click', () => this.exportTranscript());
        this.btnCopy.addEventListener('click', () => this.copyTranscript());
        
        // Slider value updates
        this.genTemp.addEventListener('input', () => {
            this.genTempVal.textContent = this.genTemp.value;
        });
        this.genTopP.addEventListener('input', () => {
            this.genTopPVal.textContent = this.genTopP.value;
        });
        this.judgeTemp.addEventListener('input', () => {
            this.judgeTempVal.textContent = this.judgeTemp.value;
        });
        this.judgeTopP.addEventListener('input', () => {
            this.judgeTopPVal.textContent = this.judgeTopP.value;
        });
        this.fragTarget.addEventListener('input', () => {
            this.fragTargetVal.textContent = this.fragTarget.value;
        });
        this.loopBatch.addEventListener('input', () => {
            this.loopBatchVal.textContent = this.loopBatch.value;
        });
        this.loopThreshold.addEventListener('input', () => {
            this.loopThresholdVal.textContent = this.loopThreshold.value;
        });
        
        // Provider change - save previous provider's values, then update UI, then restore new provider's values
        this.genProvider.addEventListener('change', () => {
            this.saveProviderValues('gen', this.previousProvider.gen);
            this.previousProvider.gen = this.genProvider.value;
            this.updateProviderUI('gen');
            this.restoreProviderValues('gen');
            this.updateModelLabels();
        });
        this.judgeProvider.addEventListener('change', () => {
            this.saveProviderValues('judge', this.previousProvider.judge);
            this.previousProvider.judge = this.judgeProvider.value;
            this.updateProviderUI('judge');
            this.restoreProviderValues('judge');
            this.updateModelLabels();
        });
        
        // Model change - update labels
        this.genModel.addEventListener('input', () => {
            this.saveProviderValues('gen');
            this.updateModelLabels();
        });
        this.judgeModel.addEventListener('input', () => {
            this.saveProviderValues('judge');
            this.updateModelLabels();
        });
        
        // Save values when fields change (so they persist across provider switches)
        this.genApiKey.addEventListener('input', () => this.saveProviderValues('gen'));
        this.genBaseUrl.addEventListener('input', () => this.saveProviderValues('gen'));
        this.judgeApiKey.addEventListener('input', () => this.saveProviderValues('judge'));
        this.judgeBaseUrl.addEventListener('input', () => this.saveProviderValues('judge'));
        
        // Profiles
        this.btnSaveProfile.addEventListener('click', () => this.saveProfile());
        this.btnExportProfile.addEventListener('click', () => this.exportCurrentConfig());
        this.btnImportProfile.addEventListener('change', (e) => this.importConfig(e));
        this.profileNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveProfile();
        });
        
        // View default buttons
        document.querySelectorAll('.btn-view-default').forEach(btn => {
            btn.addEventListener('click', () => this.showDefaultPrompt(btn.dataset.view));
        });
        
        // Reset buttons
        document.querySelectorAll('.btn-reset').forEach(btn => {
            btn.addEventListener('click', () => this.resetPrompt(btn.dataset.reset));
        });
        
        // Candidate modal navigation
        this.candidateModalPrev.addEventListener('click', () => this.navigateCandidate(-1));
        this.candidateModalNext.addEventListener('click', () => this.navigateCandidate(1));
        this.candidateModalSelect.addEventListener('click', () => this.selectCandidateFromModal());
    }
    
    initConfigBarToggles() {
        // Config bar sections are now always visible (no collapsing)
        // This method is kept for backwards compatibility but does nothing
    }
    
    initExpandModals() {
        // Set up expand buttons
        document.querySelectorAll('.btn-expand').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetId = btn.dataset.expand;
                this.openExpandModal(targetId);
            });
        });
        
        // Close expand modal
        this.expandModal.querySelector('.expand-modal-close').addEventListener('click', () => {
            this.expandModal.classList.add('hidden');
        });
        
        this.expandModal.addEventListener('click', (e) => {
            if (e.target === this.expandModal) {
                this.expandModal.classList.add('hidden');
            }
        });
        
        // Close candidate modal
        this.candidateModal.querySelector('.expand-modal-close').addEventListener('click', () => {
            this.candidateModal.classList.add('hidden');
        });
        
        this.candidateModal.addEventListener('click', (e) => {
            if (e.target === this.candidateModal) {
                this.candidateModal.classList.add('hidden');
            }
        });
        
        // Keyboard navigation for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.expandModal.classList.add('hidden');
                this.candidateModal.classList.add('hidden');
            }
            
            // Candidate modal navigation
            if (!this.candidateModal.classList.contains('hidden')) {
                if (e.key === 'ArrowLeft') {
                    this.navigateCandidate(-1);
                } else if (e.key === 'ArrowRight') {
                    this.navigateCandidate(1);
                } else if (e.key === 'Enter') {
                    this.selectCandidateFromModal();
                }
            }
        });
    }
    
    openExpandModal(targetId) {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        const titleMap = {
            'log-stream': 'Log Stream',
            'candidates-grid': 'Candidates',
            'transcript': 'Accumulated Transcript',
            'gen-last-prompt': 'Generator Prompt',
            'gen-last-response': 'Generator Response (Selected)',
            'judge-last-prompt': 'Judge Prompt',
            'judge-last-response': 'Judge Response'
        };
        
        this.expandModalTitle.textContent = titleMap[targetId] || 'Expanded View';
        
        // Special handling for candidates grid - render properly formatted candidates
        if (targetId === 'candidates-grid') {
            if (this.currentCandidates && this.currentCandidates.length > 0) {
                // Format candidates nicely for the expand view
                const formattedCandidates = this.currentCandidates.map((c, idx) => {
                    const header = `═══════════════════════════════════════════════════════════════════════════════
#${idx + 1}  │  ${c.line_count} lines${c.has_collapse ? '  │  [COLLAPSE]' : ''}
═══════════════════════════════════════════════════════════════════════════════`;
                    return `${header}\n\n${c.content}\n`;
                }).join('\n\n');
                
                this.expandModalText.textContent = formattedCandidates;
            } else {
                this.expandModalText.textContent = 'No candidates yet';
            }
        } else {
            this.expandModalText.textContent = targetElement.textContent || 'No content yet';
        }
        
        this.expandModal.classList.remove('hidden');
    }
    
    openCandidateModal(index) {
        if (!this.currentCandidates || this.currentCandidates.length === 0) return;
        
        this.currentCandidateIndex = index;
        this.updateCandidateModalContent();
        this.candidateModal.classList.remove('hidden');
    }
    
    updateCandidateModalContent() {
        const candidate = this.currentCandidates[this.currentCandidateIndex];
        if (!candidate) return;
        
        this.candidateModalTitle.textContent = `Candidate #${this.currentCandidateIndex + 1}`;
        this.candidateModalText.textContent = candidate.content;
        this.candidateModalPosition.textContent = `${this.currentCandidateIndex + 1} / ${this.currentCandidates.length}`;
        
        // Update nav button states
        this.candidateModalPrev.disabled = this.currentCandidateIndex === 0;
        this.candidateModalNext.disabled = this.currentCandidateIndex === this.currentCandidates.length - 1;
    }
    
    navigateCandidate(direction) {
        const newIndex = this.currentCandidateIndex + direction;
        if (newIndex >= 0 && newIndex < this.currentCandidates.length) {
            this.currentCandidateIndex = newIndex;
            this.updateCandidateModalContent();
        }
    }
    
    selectCandidateFromModal() {
        this.selectCandidate(this.currentCandidateIndex);
        this.candidateModal.classList.add('hidden');
    }
    
    updateModelLabels() {
        const genModel = this.genModel.value || '-';
        const judgeModel = this.judgeModel.value || '-';
        
        this.genModelLabel.textContent = genModel;
        this.judgeModelLabel.textContent = judgeModel;
    }
    
    saveProviderValues(type, providerOverride = null) {
        const providerSelect = type === 'gen' ? this.genProvider : this.judgeProvider;
        const modelInput = type === 'gen' ? this.genModel : this.judgeModel;
        const apiKeyInput = type === 'gen' ? this.genApiKey : this.judgeApiKey;
        const baseUrlInput = type === 'gen' ? this.genBaseUrl : this.judgeBaseUrl;
        
        // Use override if provided (for saving before provider switch)
        const provider = providerOverride || providerSelect.value;
        if (!provider) return;
        
        // Save API key for this provider
        if (apiKeyInput.value.trim()) {
            this.apiKeys[type][provider] = apiKeyInput.value.trim();
        }
        
        // Save model slug for this provider
        if (modelInput.value.trim()) {
            this.modelSlugs[type][provider] = modelInput.value.trim();
        }
        
        // Save base URL for local provider
        if (provider === 'local' && baseUrlInput.value.trim()) {
            this.baseUrls[type][provider] = baseUrlInput.value.trim();
        }
    }
    
    restoreProviderValues(type) {
        const providerSelect = type === 'gen' ? this.genProvider : this.judgeProvider;
        const modelInput = type === 'gen' ? this.genModel : this.judgeModel;
        const apiKeyInput = type === 'gen' ? this.genApiKey : this.judgeApiKey;
        const baseUrlInput = type === 'gen' ? this.genBaseUrl : this.judgeBaseUrl;
        
        const provider = providerSelect.value;
        
        // Restore API key for this provider
        if (this.apiKeys[type][provider]) {
            apiKeyInput.value = this.apiKeys[type][provider];
        } else {
            apiKeyInput.value = '';
        }
        
        // Restore model slug for this provider
        if (this.modelSlugs[type][provider]) {
            modelInput.value = this.modelSlugs[type][provider];
        } else {
            // Set a reasonable placeholder based on provider
            modelInput.value = this.getDefaultModelForProvider(provider);
        }
        
        // Restore base URL for local provider
        if (provider === 'local' && this.baseUrls[type][provider]) {
            baseUrlInput.value = this.baseUrls[type][provider];
        } else {
            baseUrlInput.value = '';
        }
    }
    
    getDefaultModelForProvider(provider) {
        // Return a sensible default placeholder - user should override
        const defaults = {
            'anthropic': '',
            'openai': '',
            'openrouter': '',
            'local': ''
        };
        return defaults[provider] || '';
    }
    
    async loadProviders() {
        try {
            const response = await fetch('/irc/admin/providers');
            const data = await response.json();
            this.providers = data.providers;
            
            // Initialize previous provider values
            this.previousProvider.gen = this.genProvider.value;
            this.previousProvider.judge = this.judgeProvider.value;
            
            this.updateProviderUI('gen');
            this.updateProviderUI('judge');
            this.updateModelLabels();
        } catch (e) {
            console.error('Failed to load providers:', e);
        }
    }
    
    updateProviderUI(type) {
        const providerSelect = type === 'gen' ? this.genProvider : this.judgeProvider;
        const modelInput = type === 'gen' ? this.genModel : this.judgeModel;
        const apiKeyGroup = type === 'gen' ? this.genApiKeyGroup : this.judgeApiKeyGroup;
        const apiKeyStatus = type === 'gen' ? this.genApiKeyStatus : this.judgeApiKeyStatus;
        const baseUrlGroup = type === 'gen' ? this.genBaseUrlGroup : this.judgeBaseUrlGroup;
        
        const providerName = providerSelect.value;
        const provider = this.providers?.find(p => p.name === providerName);
        const isLocal = providerName === 'local';
        
        // Model is always a text input now - just update placeholder
        if (modelInput) {
            modelInput.placeholder = this.getModelPlaceholder(providerName);
        }
        
        // Update API key status
        if (provider) {
            if (provider.requires_api_key) {
                apiKeyGroup.style.display = 'block';
                if (provider.has_api_key) {
                    apiKeyStatus.textContent = '(env configured)';
                    apiKeyStatus.className = 'api-key-status configured';
                } else {
                    apiKeyStatus.textContent = '(not configured)';
                    apiKeyStatus.className = 'api-key-status missing';
                }
            } else {
                apiKeyGroup.style.display = isLocal ? 'block' : 'none';
                apiKeyStatus.textContent = '(optional)';
                apiKeyStatus.className = 'api-key-status not-required';
            }
        }
        
        // Show/hide base URL for local provider
        baseUrlGroup.style.display = isLocal ? 'block' : 'none';
    }
    
    getModelPlaceholder(provider) {
        const placeholders = {
            'anthropic': 'e.g., claude-3-5-sonnet-20241022',
            'openai': 'e.g., gpt-4o, o3, o3-mini',
            'openrouter': 'e.g., anthropic/claude-3-opus',
            'local': 'e.g., llama-3.2-3b'
        };
        return placeholders[provider] || 'Enter model name';
    }
    
    getConfig() {
        const controlMode = document.querySelector('input[name="control-mode"]:checked').value;
        
        // Get generation provider config
        const genProviderName = this.genProvider.value;
        const genModel = this.genModel.value.trim();
        const genApiKey = this.genApiKey.value.trim() || null;
        const genBaseUrl = genProviderName === 'local' ? (this.genBaseUrl.value.trim() || null) : null;
        
        // Get judge provider config
        const judgeProviderName = this.judgeProvider.value;
        const judgeModel = this.judgeModel.value.trim();
        const judgeApiKey = this.judgeApiKey.value.trim() || null;
        const judgeBaseUrl = judgeProviderName === 'local' ? (this.judgeBaseUrl.value.trim() || null) : null;
        
        return {
            generation: {
                provider: genProviderName,
                model: genModel,
                params: {
                    temperature: parseFloat(this.genTemp.value),
                    top_p: parseFloat(this.genTopP.value),
                    max_tokens: 100,
                },
                api_key: genApiKey,
                base_url: genBaseUrl,
            },
            judge: {
                provider: judgeProviderName,
                model: judgeModel,
                params: {
                    temperature: parseFloat(this.judgeTemp.value),
                    top_p: parseFloat(this.judgeTopP.value),
                    max_tokens: 800,
                },
                api_key: judgeApiKey,
                base_url: judgeBaseUrl,
            },
            style: this.fragStyle.value || null,
            collapse_type: this.fragCollapse.value || null,
            target_messages: parseInt(this.fragTarget.value),
            prompts: {
                generation_system_prompt: this.promptGenSystem.value.trim() || null,
                judge_system_prompt: this.promptJudgeSystem.value.trim() || null,
                judge_user_template: this.promptJudgeUser.value.trim() || null,
                judge_user_template_first: this.promptJudgeUserFirst.value.trim() || null,
            },
            candidates_per_batch: parseInt(this.loopBatch.value),
            autoloom_threshold: parseFloat(this.loopThreshold.value),
            control_mode: controlMode,
            dry_run: this.dryRun.checked,
        };
    }
    
    async createSession() {
        try {
            const config = this.getConfig();
            
            // Validate model names are provided
            if (!config.generation.model) {
                this.log('error', 'Please enter a generation model name');
                return;
            }
            if (!config.judge.model) {
                this.log('error', 'Please enter a judge model name');
                return;
            }
            
            const response = await fetch('/irc/admin/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ config }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            this.sessionId = data.session_id;
            this.sessionIdSpan.textContent = `Session: ${this.sessionId}`;
            
            this.connectWebSocket();
            this.updateStatus('idle');
            
            this.btnDeleteSession.disabled = false;
            this.btnStart.disabled = false;
            
            this.log('info', `Created session ${this.sessionId}`);
        } catch (e) {
            this.log('error', `Failed to create session: ${e.message}`);
        }
    }
    
    async deleteSession() {
        if (!this.sessionId) return;
        
        try {
            await fetch(`/irc/admin/sessions/${this.sessionId}`, {
                method: 'DELETE',
            });
            
            this.disconnectWebSocket();
            this.sessionId = null;
            this.sessionIdSpan.textContent = '';
            this.updateStatus('idle');
            
            this.btnDeleteSession.disabled = true;
            this.btnStart.disabled = true;
            this.btnStop.disabled = true;
            
            this.log('info', 'Session deleted');
        } catch (e) {
            this.log('error', `Failed to delete session: ${e.message}`);
        }
    }
    
    connectWebSocket() {
        if (this.ws) {
            this.ws.close();
        }
        
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const url = `${protocol}//${window.location.host}/irc/admin/ws/${this.sessionId}`;
        
        this.ws = new WebSocket(url);
        
        this.ws.onopen = () => {
            this.log('info', 'WebSocket connected');
        };
        
        this.ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            this.handleMessage(msg);
        };
        
        this.ws.onclose = () => {
            this.log('warning', 'WebSocket disconnected');
        };
        
        this.ws.onerror = (error) => {
            this.log('error', 'WebSocket error');
        };
    }
    
    disconnectWebSocket() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
    
    sendMessage(msg) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(msg));
        }
    }
    
    handleMessage(msg) {
        switch (msg.type) {
            case 'state':
                this.handleState(msg);
                break;
            case 'started':
                this.handleStarted();
                break;
            case 'candidates':
                this.handleCandidates(msg);
                break;
            case 'judgment':
                this.handleJudgment(msg);
                break;
            case 'progress':
                this.handleProgress(msg);
                break;
            case 'waiting':
                this.handleWaiting(msg);
                break;
            case 'transcript':
                this.handleTranscript(msg);
                break;
            case 'complete':
                this.handleComplete(msg);
                break;
            case 'error':
                this.handleError(msg);
                break;
            case 'log':
                this.log(msg.level, msg.message);
                break;
            case 'generator_io':
                this.handleGeneratorIO(msg);
                break;
            case 'judge_io':
                this.handleJudgeIO(msg);
                break;
        }
    }
    
    handleState(msg) {
        this.updateStatus(msg.status);
        if (msg.transcript_lines) {
            this.transcript.textContent = msg.transcript_lines.join('\n');
        }
    }
    
    handleStarted() {
        this.updateStatus('running');
        this.startTime = Date.now();
        this.startTimer();
        this.btnStart.disabled = true;
        this.btnStop.disabled = false;
        this.log('info', 'Generation started');
        
        // Reset I/O panel
        this.genLastPrompt.textContent = 'Generating...';
        this.genLastResponse.textContent = 'Waiting for response...';
        this.judgeLastPrompt.textContent = 'Waiting for candidates...';
        this.judgeLastResponse.textContent = 'Waiting for response...';
    }
    
    handleCandidates(msg) {
        this.candidatesCount.textContent = `(${msg.candidates.length})`;
        this.candidatesGrid.innerHTML = '';
        
        // Store candidates for later reference (e.g., scores, modal navigation)
        this.currentCandidates = msg.candidates;
        
        // Update generator I/O panel with prompt info if available
        if (msg.prompt) {
            this.lastIO.gen.prompt = msg.prompt;
            // Truncate very long prompts for display (keep full in lastIO)
            const displayPrompt = msg.prompt.length > 5000 
                ? msg.prompt.substring(0, 5000) + '\n\n... [truncated]'
                : msg.prompt;
            this.genLastPrompt.textContent = displayPrompt;
        }
        
        // Reset generator response (will be updated when winner is selected)
        this.genLastResponse.textContent = 'Awaiting judgment...';
        
        msg.candidates.forEach((c, listIndex) => {
            const card = document.createElement('div');
            card.className = 'candidate-card';
            // Store both the list position and original batch index
            card.dataset.listIndex = listIndex;
            card.dataset.batchIndex = c.index;
            
            card.innerHTML = `
                <div class="candidate-header">
                    <span class="candidate-number">#${listIndex + 1}</span>
                    <div class="candidate-badges">
                        <span class="candidate-badge">${c.line_count} lines</span>
                        ${c.has_collapse ? '<span class="candidate-badge collapse">COLLAPSE</span>' : ''}
                    </div>
                </div>
                <div class="candidate-content">${this.escapeHtml(c.content)}</div>
                <div class="candidate-score"></div>
            `;
            
            // Use list position for selection, not the internal batch index
            card.addEventListener('click', () => this.selectCandidate(listIndex));
            
            // Double-click to expand
            card.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                this.openCandidateModal(listIndex);
            });
            
            this.candidatesGrid.appendChild(card);
        });
    }
    
    handleJudgment(msg) {
        // Update scores on candidate cards
        const cards = this.candidatesGrid.querySelectorAll('.candidate-card');
        cards.forEach((card, listIndex) => {
            const scoreEl = card.querySelector('.candidate-score');
            if (msg.scores[listIndex] !== undefined) {
                scoreEl.textContent = `Score: ${msg.scores[listIndex].toFixed(2)}`;
            }
            
            // selected_index is now a list position
            if (listIndex === msg.selected_index) {
                card.classList.add('winner');
                
                // Update generator last response with selected candidate
                const candidate = this.currentCandidates[listIndex];
                if (candidate) {
                    this.lastIO.gen.response = candidate.content;
                    this.genLastResponse.textContent = candidate.content;
                }
            }
        });
        
        // Update judge I/O panel with prompt and response
        if (msg.judge_prompt) {
            this.lastIO.judge.prompt = msg.judge_prompt;
            // Truncate very long prompts for display (keep full in lastIO)
            const displayPrompt = msg.judge_prompt.length > 5000 
                ? msg.judge_prompt.substring(0, 5000) + '\n\n... [truncated]'
                : msg.judge_prompt;
            this.judgeLastPrompt.textContent = displayPrompt;
        }
        
        if (msg.reasoning) {
            this.lastIO.judge.response = msg.reasoning;
            this.judgeLastResponse.textContent = msg.reasoning;
        }
        
        const selectedDisplay = msg.selected_index !== null ? `#${msg.selected_index + 1}` : 'none';
        const reasoningPreview = msg.reasoning ? msg.reasoning.substring(0, 100) : 'none';
        this.log('info', `Judgment: selected ${selectedDisplay} - ${reasoningPreview}...`);
    }
    
    handleGeneratorIO(msg) {
        // Handle dedicated generator I/O event
        if (msg.prompt) {
            this.lastIO.gen.prompt = msg.prompt;
            this.genLastPrompt.textContent = msg.prompt;
        }
        if (msg.response) {
            this.lastIO.gen.response = msg.response;
            this.genLastResponse.textContent = msg.response;
        }
    }
    
    handleJudgeIO(msg) {
        // Handle dedicated judge I/O event
        if (msg.prompt) {
            this.lastIO.judge.prompt = msg.prompt;
            this.judgeLastPrompt.textContent = msg.prompt;
        }
        if (msg.response) {
            this.lastIO.judge.response = msg.response;
            this.judgeLastResponse.textContent = msg.response;
        }
    }
    
    handleProgress(msg) {
        const pct = (msg.messages / msg.target) * 100;
        this.progressFill.style.width = `${Math.min(pct, 100)}%`;
        this.progressMessages.textContent = `${msg.messages}/${msg.target} messages`;
        this.progressChunks.textContent = `Chunk ${msg.chunk}`;
        
        // Determine phase
        if (pct < 30) {
            this.progressPhase.textContent = 'Opening';
        } else if (pct < 70) {
            this.progressPhase.textContent = 'Middle';
        } else if (pct < 90) {
            this.progressPhase.textContent = 'Approaching End';
        } else {
            this.progressPhase.textContent = 'Ending';
        }
        
        this.statTokens.textContent = msg.tokens_used.toLocaleString();
        this.statCost.textContent = `$${msg.cost_usd.toFixed(4)}`;
    }
    
    handleWaiting(msg) {
        this.updateStatus('paused');
        this.waitingIndicator.classList.remove('hidden');
        
        if (msg.mode === 'select') {
            this.waitingIndicator.querySelector('.waiting-text').textContent = 'Click a candidate to select (double-click to expand)...';
            this.btnContinue.classList.add('hidden');
        } else if (msg.mode === 'confirm') {
            this.waitingIndicator.querySelector('.waiting-text').textContent = 'Review judgment and continue...';
            this.btnContinue.classList.remove('hidden');
        }
    }
    
    handleTranscript(msg) {
        this.transcript.textContent = msg.lines.join('\n');
        this.transcript.scrollTop = this.transcript.scrollHeight;
    }
    
    handleComplete(msg) {
        const wasStopped = msg.stopped || false;
        this.updateStatus(wasStopped ? 'stopped' : 'complete');
        this.stopTimer();
        this.btnStart.disabled = false;
        this.btnStop.disabled = true;
        this.btnExport.disabled = false;
        this.btnCopy.disabled = false;
        this.waitingIndicator.classList.add('hidden');
        
        if (msg.transcript) {
            this.transcript.textContent = msg.transcript;
        }
        
        if (wasStopped) {
            this.log('warning', `Generation stopped: ${msg.stats.messages} messages, ${msg.stats.chunks} chunks`);
        } else {
            this.log('info', `Generation complete: ${msg.stats.messages} messages, ${msg.stats.chunks} chunks`);
        }
        this.log('info', `Total: ${msg.stats.tokens} tokens, $${msg.stats.cost.toFixed(4)}, ${(msg.stats.duration_ms / 1000).toFixed(1)}s`);
    }
    
    handleError(msg) {
        this.updateStatus('error');
        this.log('error', msg.message);
        
        if (!msg.recoverable) {
            this.stopTimer();
            this.btnStart.disabled = false;
            this.btnStop.disabled = true;
        }
    }
    
    startGeneration() {
        // Send current config to update session before starting
        // This ensures control_mode, dry_run, etc. reflect current UI state
        const config = this.getConfig();
        this.sendMessage({ type: 'update_config', changes: config });
        
        this.sendMessage({ type: 'start' });
        this.transcript.textContent = '';
        this.candidatesGrid.innerHTML = '';
        this.progressFill.style.width = '0%';
    }
    
    stopGeneration() {
        this.sendMessage({ type: 'stop' });
        this.updateStatus('stopping');
        this.btnStop.disabled = true;
        this.log('warning', 'Stop requested - waiting for current operation to complete...');
    }
    
    continueGeneration() {
        this.sendMessage({ type: 'continue' });
        this.waitingIndicator.classList.add('hidden');
        this.updateStatus('running');
    }
    
    selectCandidate(listIndex) {
        // Highlight selected using list position
        const cards = this.candidatesGrid.querySelectorAll('.candidate-card');
        cards.forEach(card => card.classList.remove('selected'));
        cards[listIndex]?.classList.add('selected');
        
        // Update generator last response with selected candidate
        const candidate = this.currentCandidates[listIndex];
        if (candidate) {
            this.lastIO.gen.response = candidate.content;
            this.genLastResponse.textContent = candidate.content;
        }
        
        // Send list position as the selection index
        this.sendMessage({ type: 'select', candidate_index: listIndex });
        this.waitingIndicator.classList.add('hidden');
        this.updateStatus('running');
    }
    
    updateStatus(status) {
        this.sessionStatus.className = `status-badge ${status}`;
        this.sessionStatus.textContent = status === 'idle' ? 'no session' : status;
    }
    
    log(level, message) {
        const entry = document.createElement('div');
        entry.className = `log-entry ${level}`;
        
        const time = new Date().toLocaleTimeString();
        entry.textContent = `[${time}] ${message}`;
        
        this.logStream.appendChild(entry);
        this.logStream.scrollTop = this.logStream.scrollHeight;
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.startTime) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                this.statTime.textContent = `${elapsed}s`;
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    exportTranscript() {
        const content = this.transcript.textContent;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `irc_fragment_${Date.now()}.txt`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    copyTranscript() {
        const content = this.transcript.textContent;
        navigator.clipboard.writeText(content).then(() => {
            this.log('info', 'Copied to clipboard');
        }).catch(e => {
            this.log('error', 'Failed to copy');
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Escape text for safe insertion into HTML attributes.
     * Escapes quotes in addition to <, >, and & to prevent attribute breakout XSS.
     */
    escapeAttr(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    
    // ==================== Prompt Customization ====================
    
    async loadDefaultPrompts() {
        try {
            const response = await fetch('/irc/admin/prompts/defaults');
            this.defaultPrompts = await response.json();
        } catch (e) {
            console.error('Failed to load default prompts:', e);
        }
    }
    
    showDefaultPrompt(path) {
        if (!this.defaultPrompts) {
            this.log('error', 'Default prompts not loaded yet');
            return;
        }
        
        // Navigate the path (e.g., "generation.system_prompt" -> defaultPrompts.generation.system_prompt)
        const parts = path.split('.');
        let data = this.defaultPrompts;
        for (const part of parts) {
            data = data[part];
            if (!data) {
                this.log('error', `Unknown prompt path: ${path}`);
                return;
            }
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'prompt-modal';
        modal.innerHTML = `
            <div class="prompt-modal-content">
                <div class="prompt-modal-header">
                    <h3>${path.replace('.', ' → ')}</h3>
                    <button class="prompt-modal-close">&times;</button>
                </div>
                <div class="prompt-modal-body">
                    <pre>${this.escapeHtml(data.content)}</pre>
                </div>
                <div class="prompt-modal-footer">
                    <p style="flex: 1; margin: 0; font-size: 0.7rem; color: #666;">
                        ${data.description || ''}
                    </p>
                    <button class="btn btn-small btn-copy-prompt">copy</button>
                    <button class="btn btn-small btn-use-prompt">use this</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close handlers
        modal.querySelector('.prompt-modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Copy handler
        modal.querySelector('.btn-copy-prompt').addEventListener('click', () => {
            navigator.clipboard.writeText(data.content).then(() => {
                this.log('info', 'Copied to clipboard');
            });
        });
        
        // Use handler - copy content to the appropriate textarea
        modal.querySelector('.btn-use-prompt').addEventListener('click', () => {
            const textarea = this.getTextareaForPath(path);
            if (textarea) {
                textarea.value = data.content;
                this.log('info', 'Loaded default prompt');
            }
            modal.remove();
        });
    }
    
    getTextareaForPath(path) {
        const mapping = {
            'generation.system_prompt': this.promptGenSystem,
            'judge.system_prompt': this.promptJudgeSystem,
            'judge.user_template': this.promptJudgeUser,
            'judge.user_template_first': this.promptJudgeUserFirst,
        };
        return mapping[path];
    }
    
    resetPrompt(textareaId) {
        const textarea = document.getElementById(textareaId);
        if (textarea) {
            textarea.value = '';
            this.log('info', 'Prompt reset to default');
        }
    }
    
    // ==================== Settings Profiles ====================
    
    getStoredProfiles() {
        try {
            const stored = localStorage.getItem(this.PROFILES_STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Failed to load profiles from localStorage:', e);
            return {};
        }
    }
    
    saveStoredProfiles(profiles) {
        try {
            localStorage.setItem(this.PROFILES_STORAGE_KEY, JSON.stringify(profiles));
        } catch (e) {
            console.error('Failed to save profiles to localStorage:', e);
            this.log('error', 'Failed to save profiles (localStorage may be full)');
        }
    }
    
    loadSavedProfiles() {
        this.renderProfilesList();
    }
    
    renderProfilesList() {
        const profiles = this.getStoredProfiles();
        const names = Object.keys(profiles).sort((a, b) => {
            // Sort by most recently saved
            return (profiles[b].savedAt || 0) - (profiles[a].savedAt || 0);
        });
        
        this.profilesList.innerHTML = '';
        
        names.forEach(name => {
            const profile = profiles[name];
            const date = profile.savedAt ? new Date(profile.savedAt).toLocaleDateString() : '';
            const isActive = name === this.activeProfileName;
            
            const item = document.createElement('div');
            item.className = 'profile-item' + (isActive ? ' active' : '');
            // Use escapeAttr for attribute contexts to prevent XSS via quote breakout
            item.innerHTML = `
                <span class="profile-name" title="${this.escapeAttr(name)}">${this.escapeHtml(name)}</span>
                <span class="profile-date">${date}</span>
                <button class="btn btn-tiny btn-load-profile" data-name="${this.escapeAttr(name)}">load</button>
                <button class="btn btn-tiny btn-delete-profile" data-name="${this.escapeAttr(name)}">×</button>
            `;
            
            // Event listeners
            item.querySelector('.btn-load-profile').addEventListener('click', () => {
                this.loadProfile(name);
            });
            item.querySelector('.btn-delete-profile').addEventListener('click', () => {
                this.deleteProfile(name);
            });
            
            this.profilesList.appendChild(item);
        });
    }
    
    saveProfile() {
        const name = this.profileNameInput.value.trim();
        if (!name) {
            this.log('error', 'Please enter a profile name');
            return;
        }
        
        const profiles = this.getStoredProfiles();
        
        // Check if overwriting
        if (profiles[name]) {
            if (!confirm(`Overwrite existing profile "${name}"?`)) {
                return;
            }
        }
        
        // Get current config (but exclude API keys for security)
        const config = this.getConfigForProfile();
        
        profiles[name] = {
            config: config,
            savedAt: Date.now(),
            version: 1,
        };
        
        this.saveStoredProfiles(profiles);
        this.activeProfileName = name;
        this.profileNameInput.value = '';
        this.renderProfilesList();
        this.log('info', `Saved profile: ${name}`);
    }
    
    getConfigForProfile() {
        // Get full config but exclude API keys
        const config = this.getConfig();
        
        // Remove sensitive data
        if (config.generation) {
            delete config.generation.api_key;
        }
        if (config.judge) {
            delete config.judge.api_key;
        }
        
        return config;
    }
    
    loadProfile(name) {
        const profiles = this.getStoredProfiles();
        const profile = profiles[name];
        
        if (!profile || !profile.config) {
            this.log('error', `Profile "${name}" not found`);
            return;
        }
        
        this.applyConfig(profile.config);
        this.activeProfileName = name;
        this.renderProfilesList();
        this.updateModelLabels();
        this.log('info', `Loaded profile: ${name}`);
    }
    
    applyConfig(config) {
        // Apply generation provider settings
        if (config.generation) {
            if (config.generation.provider) {
                this.genProvider.value = config.generation.provider;
                // Update previousProvider to match the new provider value
                // This prevents corruption of per-provider storage when user changes providers later
                this.previousProvider.gen = config.generation.provider;
                this.updateProviderUI('gen');
            }
            if (config.generation.model) {
                this.genModel.value = config.generation.model;
            }
            if (config.generation.params) {
                if (config.generation.params.temperature !== undefined) {
                    this.genTemp.value = config.generation.params.temperature;
                    this.genTempVal.textContent = config.generation.params.temperature;
                }
                if (config.generation.params.top_p !== undefined) {
                    this.genTopP.value = config.generation.params.top_p;
                    this.genTopPVal.textContent = config.generation.params.top_p;
                }
            }
            if (config.generation.base_url) {
                this.genBaseUrl.value = config.generation.base_url;
            }
        }
        
        // Apply judge provider settings
        if (config.judge) {
            if (config.judge.provider) {
                this.judgeProvider.value = config.judge.provider;
                // Update previousProvider to match the new provider value
                // This prevents corruption of per-provider storage when user changes providers later
                this.previousProvider.judge = config.judge.provider;
                this.updateProviderUI('judge');
            }
            if (config.judge.model) {
                this.judgeModel.value = config.judge.model;
            }
            if (config.judge.params) {
                if (config.judge.params.temperature !== undefined) {
                    this.judgeTemp.value = config.judge.params.temperature;
                    this.judgeTempVal.textContent = config.judge.params.temperature;
                }
                if (config.judge.params.top_p !== undefined) {
                    this.judgeTopP.value = config.judge.params.top_p;
                    this.judgeTopPVal.textContent = config.judge.params.top_p;
                }
            }
            if (config.judge.base_url) {
                this.judgeBaseUrl.value = config.judge.base_url;
            }
        }
        
        // Apply fragment parameters
        if (config.style !== undefined) {
            this.fragStyle.value = config.style || '';
        }
        if (config.collapse_type !== undefined) {
            this.fragCollapse.value = config.collapse_type || '';
        }
        if (config.target_messages !== undefined) {
            this.fragTarget.value = config.target_messages;
            this.fragTargetVal.textContent = config.target_messages;
        }
        
        // Apply loop settings
        if (config.candidates_per_batch !== undefined) {
            this.loopBatch.value = config.candidates_per_batch;
            this.loopBatchVal.textContent = config.candidates_per_batch;
        }
        if (config.autoloom_threshold !== undefined) {
            this.loopThreshold.value = config.autoloom_threshold;
            this.loopThresholdVal.textContent = config.autoloom_threshold;
        }
        
        // Apply control mode
        if (config.control_mode) {
            const radio = document.querySelector(`input[name="control-mode"][value="${config.control_mode}"]`);
            if (radio) radio.checked = true;
        }
        
        // Apply dry run
        if (config.dry_run !== undefined) {
            this.dryRun.checked = config.dry_run;
        }
        
        // Apply prompts
        if (config.prompts) {
            if (config.prompts.generation_system_prompt !== undefined) {
                this.promptGenSystem.value = config.prompts.generation_system_prompt || '';
            }
            if (config.prompts.judge_system_prompt !== undefined) {
                this.promptJudgeSystem.value = config.prompts.judge_system_prompt || '';
            }
            if (config.prompts.judge_user_template !== undefined) {
                this.promptJudgeUser.value = config.prompts.judge_user_template || '';
            }
            if (config.prompts.judge_user_template_first !== undefined) {
                this.promptJudgeUserFirst.value = config.prompts.judge_user_template_first || '';
            }
        }
    }
    
    deleteProfile(name) {
        if (!confirm(`Delete profile "${name}"?`)) {
            return;
        }
        
        const profiles = this.getStoredProfiles();
        delete profiles[name];
        this.saveStoredProfiles(profiles);
        
        if (this.activeProfileName === name) {
            this.activeProfileName = null;
        }
        
        this.renderProfilesList();
        this.log('info', `Deleted profile: ${name}`);
    }
    
    exportCurrentConfig() {
        const config = this.getConfigForProfile();
        const exportData = {
            name: this.activeProfileName || 'untitled',
            config: config,
            exportedAt: new Date().toISOString(),
            version: 1,
        };
        
        const json = JSON.stringify(exportData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `irc-admin-profile-${exportData.name.replace(/[^a-z0-9]/gi, '_')}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.log('info', 'Exported configuration');
    }
    
    importConfig(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.config) {
                    throw new Error('Invalid profile format: missing config');
                }
                
                // Apply the imported config
                this.applyConfig(data.config);
                this.updateModelLabels();
                
                // Optionally save to profiles
                const profileName = data.name || 'imported';
                const shouldSave = confirm(`Import successful! Save as profile "${profileName}"?`);
                
                if (shouldSave) {
                    const profiles = this.getStoredProfiles();
                    profiles[profileName] = {
                        config: data.config,
                        savedAt: Date.now(),
                        importedFrom: data.exportedAt,
                        version: data.version || 1,
                    };
                    this.saveStoredProfiles(profiles);
                    this.activeProfileName = profileName;
                    this.renderProfilesList();
                }
                
                this.log('info', `Imported configuration${shouldSave ? ' and saved as ' + profileName : ''}`);
            } catch (err) {
                this.log('error', `Failed to import: ${err.message}`);
            }
        };
        
        reader.readAsText(file);
        
        // Reset file input so the same file can be imported again
        event.target.value = '';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ircAdmin = new IRCAdminPanel();
});
