/**
 * æthera Comment System - 4chan-style interactions
 * 
 * Features:
 * - Hover previews for >>123 comment references
 * - Quote-on-selection (highlight text → quote button → modal with quoted text)
 * - Draggable reply modal with position memory
 * - Cross-post reference support
 */

(function() {
    'use strict';

    // ============================================
    // Configuration & State
    // ============================================
    
    const PREVIEW_DELAY = 150;      // ms before showing preview
    const PREVIEW_HIDE_DELAY = 100; // ms before hiding preview
    const MODAL_STORAGE_KEY = 'aethera_reply_modal_position';
    
    let previewTimeout = null;
    let hidePreviewTimeout = null;
    let currentPreview = null;
    let previewCache = {};  // Cache fetched previews
    let quoteButton = null;
    let replyModal = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let isResizing = false;
    let resizeStart = { x: 0, y: 0, width: 0, height: 0 };

    // ============================================
    // Hover Preview System
    // ============================================
    
    function createPreviewElement() {
        const preview = document.createElement('div');
        preview.id = 'comment-preview';
        preview.className = 'comment-preview';
        preview.style.display = 'none';
        document.body.appendChild(preview);
        return preview;
    }
    
    function getPreviewElement() {
        if (!currentPreview) {
            currentPreview = document.getElementById('comment-preview') || createPreviewElement();
        }
        return currentPreview;
    }
    
    async function fetchCommentPreview(commentId) {
        // Check cache first
        if (previewCache[commentId]) {
            return previewCache[commentId];
        }
        
        // Check if comment exists on current page (same-post reference)
        const localComment = document.getElementById(`comment-${commentId}`);
        if (localComment) {
            previewCache[commentId] = localComment.outerHTML;
            return previewCache[commentId];
        }
        
        // Fetch from API for cross-post references
        try {
            const response = await fetch(`/api/comments/${commentId}/preview`);
            if (response.ok) {
                const html = await response.text();
                previewCache[commentId] = html;
                return html;
            }
        } catch (e) {
            console.error('Failed to fetch comment preview:', e);
        }
        
        return null;
    }
    
    function positionPreview(preview, anchorElement) {
        const rect = anchorElement.getBoundingClientRect();
        const previewRect = preview.getBoundingClientRect();
        
        // Position below the link by default
        let top = rect.bottom + window.scrollY + 5;
        let left = rect.left + window.scrollX;
        
        // Adjust if preview would go off-screen right
        if (left + previewRect.width > window.innerWidth) {
            left = window.innerWidth - previewRect.width - 10;
        }
        
        // Adjust if preview would go off-screen bottom
        if (rect.bottom + previewRect.height > window.innerHeight) {
            // Position above instead
            top = rect.top + window.scrollY - previewRect.height - 5;
        }
        
        preview.style.top = `${top}px`;
        preview.style.left = `${Math.max(10, left)}px`;
    }
    
    async function showPreview(referenceLink) {
        const commentId = referenceLink.dataset.commentId;
        if (!commentId) return;
        
        const preview = getPreviewElement();
        const html = await fetchCommentPreview(commentId);
        
        if (html) {
            preview.innerHTML = html;
            preview.style.display = 'block';
            positionPreview(preview, referenceLink);
        }
    }
    
    function hidePreview() {
        const preview = getPreviewElement();
        preview.style.display = 'none';
    }
    
    function initPreviewListeners() {
        document.addEventListener('mouseenter', function(e) {
            // e.target can be a text node which doesn't have .matches()
            if (!e.target.matches || !e.target.matches('.comment-reference')) return;
            
            clearTimeout(hidePreviewTimeout);
            previewTimeout = setTimeout(() => showPreview(e.target), PREVIEW_DELAY);
        }, true);
        
        document.addEventListener('mouseleave', function(e) {
            if (!e.target.matches || !e.target.matches('.comment-reference')) return;
            
            clearTimeout(previewTimeout);
            hidePreviewTimeout = setTimeout(hidePreview, PREVIEW_HIDE_DELAY);
        }, true);
        
        // Keep preview visible when hovering over it
        document.addEventListener('mouseenter', function(e) {
            if (!e.target.closest) return;
            if (e.target.id === 'comment-preview' || e.target.closest('#comment-preview')) {
                clearTimeout(hidePreviewTimeout);
            }
        }, true);
        
        document.addEventListener('mouseleave', function(e) {
            if (e.target.id === 'comment-preview') {
                hidePreviewTimeout = setTimeout(hidePreview, PREVIEW_HIDE_DELAY);
            }
        }, true);
    }

    // ============================================
    // Quote-on-Selection System
    // ============================================
    
    function createQuoteButton() {
        const btn = document.createElement('button');
        btn.id = 'quote-selection-btn';
        btn.className = 'quote-selection-btn';
        btn.innerHTML = 'Quote';
        btn.style.display = 'none';
        document.body.appendChild(btn);
        return btn;
    }
    
    function getQuoteButton() {
        if (!quoteButton) {
            quoteButton = document.getElementById('quote-selection-btn') || createQuoteButton();
        }
        return quoteButton;
    }
    
    function getSelectedTextInfo() {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !selection.toString().trim()) {
            return null;
        }
        
        const text = selection.toString().trim();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Find if selection is within a comment
        const commentElement = selection.anchorNode.parentElement?.closest('.comment');
        const commentId = commentElement ? commentElement.id.replace('comment-', '') : null;
        
        // Check if selection is within post content
        const isInPostContent = selection.anchorNode.parentElement?.closest('.post-content') !== null;
        
        return {
            text,
            rect,
            commentId,
            isInPostContent
        };
    }
    
    function positionQuoteButton(rect) {
        const btn = getQuoteButton();
        const btnRect = btn.getBoundingClientRect();
        
        // Position above the selection
        let top = rect.top + window.scrollY - 35;
        let left = rect.left + window.scrollX + (rect.width / 2) - (btnRect.width / 2);
        
        // Ensure button stays on screen
        left = Math.max(10, Math.min(left, window.innerWidth - btnRect.width - 10));
        
        btn.style.top = `${top}px`;
        btn.style.left = `${left}px`;
    }
    
    function formatQuotedText(text, commentId) {
        // Split into lines and prefix each with >
        const lines = text.split('\n').map(line => `>${line}`);
        let quoted = lines.join('\n');
        
        // If quoting a comment, prepend the reference
        if (commentId) {
            quoted = `>>${commentId}\n${quoted}`;
        }
        
        return quoted + '\n';
    }
    
    function handleQuoteClick() {
        const info = getSelectedTextInfo();
        if (!info) return;
        
        const quoted = formatQuotedText(info.text, info.commentId);
        
        // Open modal and insert quoted text
        openReplyModal(quoted);
        
        // Clear selection and hide button
        window.getSelection().removeAllRanges();
        getQuoteButton().style.display = 'none';
    }
    
    function initQuoteListeners() {
        // Show quote button on text selection
        document.addEventListener('mouseup', function(e) {
            // Small delay to let selection complete
            setTimeout(() => {
                const info = getSelectedTextInfo();
                const btn = getQuoteButton();
                
                if (info && (info.isInPostContent || info.commentId)) {
                    positionQuoteButton(info.rect);
                    btn.style.display = 'block';
                } else {
                    btn.style.display = 'none';
                }
            }, 10);
        });
        
        // Hide on click elsewhere
        document.addEventListener('mousedown', function(e) {
            const btn = getQuoteButton();
            if (e.target !== btn && !btn.contains(e.target)) {
                btn.style.display = 'none';
            }
        });
        
        // Handle quote button click
        document.addEventListener('click', function(e) {
            if (e.target.id === 'quote-selection-btn') {
                e.preventDefault();
                handleQuoteClick();
            }
        });
    }

    // ============================================
    // Draggable Reply Modal
    // ============================================
    
    function createReplyModal() {
        const existingForm = document.querySelector('.comment-form form');
        if (!existingForm) return null;
        
        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'reply-modal';
        modal.className = 'reply-modal';
        modal.style.display = 'none';

        // Create WebGL canvas for frosted glass effect
        const canvas = document.createElement('canvas');
        canvas.className = 'reply-modal-bg-canvas';
        modal.appendChild(canvas);

        // Create header with drag handle and close button
        const header = document.createElement('div');
        header.className = 'reply-modal-header';
        header.innerHTML = `
            <span class="reply-modal-title">Reply</span>
            <button type="button" class="reply-modal-close" aria-label="Close">&times;</button>
        `;
        
        // Create body with cloned form
        const body = document.createElement('div');
        body.className = 'reply-modal-body';
        
        // Clone the form for the modal
        const formClone = existingForm.cloneNode(true);
        formClone.id = 'reply-modal-form';
        
        // Update HTMX attributes to close modal on success
        formClone.setAttribute('hx-on::after-request', `
            if(event.detail.successful) {
                this.reset();
                document.getElementById('no-comments-placeholder')?.remove();
                window.closeReplyModal();
            }
        `);
        
        body.appendChild(formClone);

        // Create resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'reply-modal-resize-handle';

        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(resizeHandle);

        document.body.appendChild(modal);

        // Process HTMX for the new form
        if (window.htmx) {
            htmx.process(formClone);
        }

        // Initialize WebGL for frosted glass background
        initReplyModalCanvas(canvas, modal);

        return modal;
    }

    function initReplyModalCanvas(canvas, modal) {
        const gl = canvas.getContext('webgl', { antialias: true });
        if (!gl) return;

        const vertexShaderSource = `
            attribute vec2 a_position;
            varying vec2 v_uv;
            void main() {
                v_uv = a_position * 0.5 + 0.5;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision highp float;
            varying vec2 v_uv;
            uniform vec2 u_resolution;

            void main() {
                vec2 uv = v_uv;
                // Soft fade at edges - 40px fade (absolute)
                float fadePixels = 40.0;
                float horizFade = smoothstep(0.0, fadePixels / u_resolution.x, uv.x) * smoothstep(1.0, 1.0 - fadePixels / u_resolution.x, uv.x);
                float vertFade = smoothstep(0.0, fadePixels / u_resolution.y, uv.y) * smoothstep(1.0, 1.0 - fadePixels / u_resolution.y, uv.y);
                float alpha = horizFade * vertFade * 0.7;
                gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
            }
        `;

        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        function createProgram(gl, vs, fs) {
            const program = gl.createProgram();
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                gl.deleteProgram(program);
                return null;
            }
            return program;
        }

        const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vs || !fs) return;

        const program = createProgram(gl, vs, fs);
        if (!program) return;

        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'a_position');
        const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

        function resize() {
            const rect = modal.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            // Canvas extends 30px beyond modal on each side
            canvas.width = (rect.width + 60) * dpr;
            canvas.height = (rect.height + 60) * dpr;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        function render() {
            if (modal.style.display === 'none') {
                requestAnimationFrame(render);
                return;
            }
            resize();
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(program);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            requestAnimationFrame(render);
        }

        render();
    }

    function getReplyModal() {
        if (!replyModal) {
            replyModal = document.getElementById('reply-modal') || createReplyModal();
        }
        return replyModal;
    }
    
    function getSavedModalPosition() {
        try {
            const saved = localStorage.getItem(MODAL_STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {}
        return null;
    }
    
    function saveModalPosition(x, y) {
        try {
            localStorage.setItem(MODAL_STORAGE_KEY, JSON.stringify({ x, y }));
        } catch (e) {}
    }
    
    function openReplyModal(prefillContent = '') {
        const modal = getReplyModal();
        if (!modal) return;
        
        // Restore saved position or center
        const saved = getSavedModalPosition();
        if (saved) {
            modal.style.left = `${saved.x}px`;
            modal.style.top = `${saved.y}px`;
        } else {
            // Center on screen
            modal.style.left = `${(window.innerWidth - 400) / 2}px`;
            modal.style.top = `${Math.max(100, window.innerHeight / 4)}px`;
        }
        
        modal.style.display = 'block';
        
        // Focus and optionally prefill the textarea
        const textarea = modal.querySelector('textarea[name="content"]');
        if (textarea) {
            if (prefillContent) {
                // Append to existing content
                textarea.value = textarea.value + prefillContent;
            }
            textarea.focus();
            // Move cursor to end
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    }
    
    function closeReplyModal() {
        const modal = getReplyModal();
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Expose globally for HTMX callback
    window.closeReplyModal = closeReplyModal;
    window.openReplyModal = openReplyModal;
    
    function initDragListeners() {
        document.addEventListener('mousedown', function(e) {
            if (!e.target.closest) return;
            const header = e.target.closest('.reply-modal-header');
            if (!header || e.target.closest('.reply-modal-close')) return;
            
            const modal = header.closest('.reply-modal');
            if (!modal) return;
            
            isDragging = true;
            const rect = modal.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            
            modal.classList.add('dragging');
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const modal = getReplyModal();
            if (!modal) return;
            
            let x = e.clientX - dragOffset.x;
            let y = e.clientY - dragOffset.y;
            
            // Keep modal on screen
            x = Math.max(0, Math.min(x, window.innerWidth - modal.offsetWidth));
            y = Math.max(0, Math.min(y, window.innerHeight - modal.offsetHeight));
            
            modal.style.left = `${x}px`;
            modal.style.top = `${y}px`;
        });
        
        document.addEventListener('mouseup', function(e) {
            if (!isDragging) return;
            
            isDragging = false;
            const modal = getReplyModal();
            if (modal) {
                modal.classList.remove('dragging');
                // Save position
                const rect = modal.getBoundingClientRect();
                saveModalPosition(rect.left, rect.top);
            }
        });
        
        // Close button
        document.addEventListener('click', function(e) {
            if (e.target.closest && e.target.closest('.reply-modal-close')) {
                closeReplyModal();
            }
        });
        
        // Resize handle
        document.addEventListener('mousedown', function(e) {
            if (!e.target.closest) return;
            const handle = e.target.closest('.reply-modal-resize-handle');
            if (!handle) return;

            const modal = handle.closest('.reply-modal');
            if (!modal) return;

            isResizing = true;
            resizeStart.x = e.clientX;
            resizeStart.y = e.clientY;
            resizeStart.width = modal.offsetWidth;
            resizeStart.height = modal.offsetHeight;
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;

            const modal = getReplyModal();
            if (!modal) return;

            const newWidth = Math.max(400, resizeStart.width + (e.clientX - resizeStart.x));
            const newHeight = Math.max(320, resizeStart.height + (e.clientY - resizeStart.y));

            modal.style.width = `${newWidth}px`;
            modal.style.height = `${newHeight}px`;
        });

        document.addEventListener('mouseup', function(e) {
            if (isResizing) {
                isResizing = false;
            }
        });

        // Escape key closes modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeReplyModal();
            }
        });
    }
    
    function initReplyButton() {
        // Hide the original inline form and add a Reply button
        const inlineForm = document.querySelector('.comment-form');
        if (!inlineForm) return;
        
        // Create reply button
        const replyBtn = document.createElement('button');
        replyBtn.id = 'open-reply-btn';
        replyBtn.className = 'open-reply-btn';
        replyBtn.textContent = 'Reply';
        replyBtn.type = 'button';
        
        // Insert button and hide form
        inlineForm.parentNode.insertBefore(replyBtn, inlineForm);
        inlineForm.style.display = 'none';
        
        // Open modal on click
        replyBtn.addEventListener('click', function() {
            openReplyModal();
        });
    }
    
    // ============================================
    // Comment Reference Quick-Reply
    // ============================================
    
    function initQuickReplyFromReference() {
        // Click on No.123 link to quick-reply with >>123
        document.addEventListener('click', function(e) {
            if (!e.target.closest) return;
            const noLink = e.target.closest('.comment-id a');
            if (!noLink) return;
            
            e.preventDefault();
            const commentId = noLink.closest('.comment')?.id.replace('comment-', '');
            if (commentId) {
                openReplyModal(`>>${commentId}\n`);
            }
        });
    }

    // ============================================
    // Initialization
    // ============================================
    
    function init() {
        initPreviewListeners();
        initQuoteListeners();
        initDragListeners();
        initReplyButton();
        initQuickReplyFromReference();
        
        // Create modal on load
        getReplyModal();
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

