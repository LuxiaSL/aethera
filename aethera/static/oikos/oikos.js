var iM=Object.defineProperty;var sM=(ri,Cn,Gn)=>Cn in ri?iM(ri,Cn,{enumerable:!0,configurable:!0,writable:!0,value:Gn}):ri[Cn]=Gn;var R=(ri,Cn,Gn)=>sM(ri,typeof Cn!="symbol"?Cn+"":Cn,Gn);(function(){"use strict";var Dd;const ri=[17,19,21,57,93,165,163,204,209,214,220,231],Cn=[236,234],Gn=Cn.length,Li=6,Gd=[17,18,19,20,21,57,56,93,129,165,164,163,198,204,203,209,208,214,220,229,231],Mr=s=>Gd[s]??0,Vd=Array.from({length:Li},(s,t)=>[Mr(Math.floor((185+t)/21)),Mr((185+t)%21)]),Wd=Array.from({length:Li*Li},(s,t)=>[Mr(Math.floor((191+t)/21)),Mr((191+t)%21)]),$d=.98,Dc=4,Xd=Math.fround($d**Dc),Xs="▁▂▃▄▅▆▇█",oi=-2,ji=2,Yd={[-2]:"0.25x",[-1]:"0.50x",0:" 1.0x",1:" 2.0x",2:" 4.0x"},Qi={glider:[[0,1],[1,2],[2,0],[2,1],[2,2]],lwss:[[0,1],[0,4],[1,0],[2,0],[2,4],[3,0],[3,1],[3,2],[3,3]],hwss:[[0,3],[0,4],[1,1],[1,6],[2,0],[3,0],[3,6],[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]],r_pentomino:[[0,1],[0,2],[1,0],[1,1],[2,1]],acorn:[[0,1],[1,3],[2,0],[2,1],[2,4],[2,5],[2,6]],diehard:[[0,6],[1,0],[1,1],[2,1],[2,5],[2,6],[2,7]],pi_heptomino:[[0,0],[0,1],[0,2],[1,1],[2,1],[3,0],[3,2]],b_heptomino:[[0,1],[1,0],[1,2],[1,3],[2,0],[2,1],[3,1]],gosper_gun:[[0,24],[1,22],[1,24],[2,12],[2,13],[2,20],[2,21],[2,34],[2,35],[3,11],[3,15],[3,20],[3,21],[3,34],[3,35],[4,0],[4,1],[4,10],[4,16],[4,20],[4,21],[5,0],[5,1],[5,10],[5,14],[5,16],[5,17],[5,22],[5,24],[6,10],[6,16],[6,24],[7,11],[7,15],[8,12],[8,13]],pulsar:[[0,2],[0,3],[0,4],[0,8],[0,9],[0,10],[2,0],[2,5],[2,7],[2,12],[3,0],[3,5],[3,7],[3,12],[4,0],[4,5],[4,7],[4,12],[5,2],[5,3],[5,4],[5,8],[5,9],[5,10],[7,2],[7,3],[7,4],[7,8],[7,9],[7,10],[8,0],[8,5],[8,7],[8,12],[9,0],[9,5],[9,7],[9,12],[10,0],[10,5],[10,7],[10,12],[12,2],[12,3],[12,4],[12,8],[12,9],[12,10]],pentadecathlon:[[0,1],[1,1],[2,0],[2,2],[3,1],[4,1],[5,1],[6,1],[7,0],[7,2],[8,1],[9,1]]},Oo=["glider","lwss","hwss"],Ic=["r_pentomino","acorn","diehard","pi_heptomino","b_heptomino"],Nc=["pulsar","pentadecathlon"],qd=[[1,1],[1,-1],[-1,-1],[-1,1]];function ko(s){const t=new Map;for(const[e,n]of s)for(const[i,r]of[[e,n],[e,-n],[-e,n],[-e,-n]])t.set(`${i},${r}`,[i,r]);return[...t.values()]}const Kd=[ko([[0,1],[0,2],[0,3],[1,0],[1,4],[2,0],[2,5],[3,0],[3,5],[4,1],[4,5],[5,2],[5,3],[5,4]]),ko([[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[4,0],[2,2],[3,3]]),ko([[0,3],[0,4],[1,2],[1,5],[2,1],[2,6],[3,0],[3,7],[4,0],[4,7],[5,1],[5,6],[6,2],[6,5],[7,3],[7,4]])],Bo="afterlife-universe-v1";function Zd(s,t){const e=atob(s),n=new Int32Array(t);let i=0;const r=()=>{let a=0,l=1;for(;;){if(i>=e.length)throw new Error("afterlife: truncated save");const c=e.charCodeAt(i++);if(a+=(c&127)*l,c<128)return a;l*=128}};let o=-1;for(;i<e.length;){o+=r()+1;const a=r();if(o>=t)throw new Error("afterlife: save does not fit its own world");n[o]=a%2?-(a+1)/2:a/2}return n}function Jd(s){var t;try{const e=(t=s??globalThis.localStorage)==null?void 0:t.getItem(Bo);if(!e)return null;const n=JSON.parse(e);if(n.v!==1||!Number.isInteger(n.h)||!Number.isInteger(n.w)||typeof n.cells!="string")return null;const i=n.h,r=n.w;if(i<=0||r<=0||i*r>16e6)return null;const o=Number(n.generation);return!Number.isSafeInteger(o)||o<0?null:{h:i,w:r,age:Zd(n.cells,i*r),generation:o,totalInjections:Number(n.totalInjections)||0,bornAt:Number(n.bornAt)||Date.now(),savedAt:Number(n.savedAt)||Date.now()}}catch(e){return console.warn("afterlife: could not load the universe, starting fresh",e),null}}function jd(){const s=document.getElementById("oikos-data");try{const t=JSON.parse((s==null?void 0:s.textContent)??"{}");return{sites:t.sites??[],files:t.files??[],posts:t.posts??[]}}catch{return{sites:[],files:[],posts:[]}}}const Uc=s=>/^https?:\/\//.test(s);class ts{constructor(t){R(this,"listeners",new Set);this.value=t}set(t){this.value=t;for(const e of this.listeners)e(t)}on(t){return this.listeners.add(t),()=>this.listeners.delete(t)}}function Fc(){try{const s=localStorage.getItem("syrinx-creature-v1");if(!s)return null;const t=JSON.parse(s);if(typeof t.name!="string"||typeof t.bornAt!="number"||!t.state)return null;const e=Array.isArray(t.state.nodes)?t.state.nodes:[],n=Array.isArray(t.state.edges)?t.state.edges:[];return e.length?{name:t.name,bornAt:t.bornAt,lifetime:typeof t.state.lifetime=="number"?t.state.lifetime:0,nodes:e.map(i=>({id:i.id,x:i.x,y:i.y,z:i.z??500,age:i.age??0})),edges:n.map(i=>({a:i.a,b:i.b,age:i.age??0}))}:null}catch{return null}}function Oc(s){const t=s.indexOf('"cells"');return t<0?s:s.slice(0,t)}function Qd(s){if(!s)return null;const t=Oc(s),e=o=>{const a=new RegExp(`"${o}":(\\d+)`).exec(t);return a?Number(a[1]):void 0};let n=e("generation"),i=e("savedAt"),r=e("bornAt");if(n===void 0||i===void 0){try{const o=JSON.parse(s);n=typeof o.generation=="number"?o.generation:void 0,i=typeof o.savedAt=="number"?o.savedAt:void 0,r=typeof o.bornAt=="number"?o.bornAt:void 0}catch{return null}if(n===void 0||i===void 0)return null}return{generation:n,bornAt:r??i,savedAt:i}}let Ys=null;function zo(){let s;try{s=localStorage.getItem(Bo)}catch{return null}if(!s)return null;const t=Oc(s);if(Ys&&Ys.len===s.length&&Ys.head===t)return Ys.info;const e=Qd(s);return Ys={len:s.length,head:t,info:e},e}function kc(s){return new Promise((t,e)=>{const n=new Image;n.decoding="async",n.onload=()=>t(n),n.onerror=e,n.src=s})}async function br(s){try{const t=await fetch(s,{headers:{Accept:"application/json"}});return t.ok?await t.json():null}catch{return null}}class tf{constructor(){R(this,"dreams",new ts({known:!1,awake:!1,frame:0,fps:0,viewers:0,raw:null}));R(this,"chronicle",new ts({known:!1,thumb:null,thumbAt:0,prompt:"",template:"",eras:[],eraCount:0,strata:[]}));R(this,"irc",new ts({connected:!1,lines:[],collapse:null,fragments:0,version:0}));R(this,"creature",new ts(Fc()));R(this,"universe",new ts(zo()));R(this,"apeiron",new ts(null));R(this,"timers",[]);R(this,"ws",null);R(this,"wsBackoff",2e3);R(this,"wsTimer",0);R(this,"running",!1);R(this,"onStorage",t=>{(t.key===Bo||t.key===null)&&this.setUniverse(zo())})}start(){if(this.running)return;this.running=!0;const t=(e,n)=>{e(),this.timers.push(window.setInterval(e,n))};t(()=>void this.pollDreams(),2e4),t(()=>void this.pollChronicle(),12e4),t(()=>this.creature.set(Fc()),15e3),window.addEventListener("storage",this.onStorage),t(()=>this.setUniverse(zo()),6e4),this.openIrc(),this.apeiron.value||this.loadApeiron()}setUniverse(t){var e;(t==null?void 0:t.savedAt)!==((e=this.universe.value)==null?void 0:e.savedAt)&&this.universe.set(t)}stop(){this.running=!1;for(const t of this.timers)clearInterval(t);this.timers=[],window.removeEventListener("storage",this.onStorage),clearTimeout(this.wsTimer),this.ws&&(this.ws.onclose=null,this.ws.close(),this.ws=null),this.irc.set({...this.irc.value,connected:!1,version:this.irc.value.version+1})}async pollDreams(){var e,n,i,r,o;const t=await br("/api/dreams/status");if(!t){this.dreams.set({...this.dreams.value,known:!1});return}this.dreams.set({known:!0,awake:!!((e=t.gpu)!=null&&e.active),frame:((n=t.generation)==null?void 0:n.current_frame)??((i=t.generation)==null?void 0:i.frame_count)??0,fps:((r=t.generation)==null?void 0:r.fps)??0,viewers:((o=t.viewers)==null?void 0:o.websocket_count)??0,raw:t})}async pollChronicle(){var o,a,l,c;const t=await br("/api/dreams/chronicle/timeline?hours=3");if(!t)return;const e=this.chronicle.value;let n=e.thumb;(o=t.live)!=null&&o.thumb&&t.live.thumb!==(n==null?void 0:n.dataset.src)&&(n=await kc(t.live.thumb).catch(()=>e.thumb),n&&(n.dataset.src=t.live.thumb));const i=(t.tiles??[]).slice(-3),r=(await Promise.all(i.map(u=>kc(u.url).catch(()=>null)))).filter(u=>!!u);this.chronicle.set({known:!0,thumb:n,thumbAt:((a=t.live)==null?void 0:a.t)??0,prompt:((l=t.live)==null?void 0:l.prompt)??"",template:((c=t.live)==null?void 0:c.template)??"",eras:(t.eras??[]).map(u=>({title:u.title??"",t0:u.t0,t1:u.t1,open:!!u.open,kf:u.kf??0})),eraCount:t.era_count??0,strata:r.length?r:e.strata})}openIrc(){const t=location.protocol==="https:"?"wss":"ws";let e;try{e=new WebSocket(`${t}://${location.host}/ws/irc`)}catch{return}this.ws=e;const n=i=>{const r=this.irc.value;this.irc.set({...r,...i,version:r.version+1})};e.onopen=()=>{this.wsBackoff=2e3,n({connected:!0,collapse:null})},e.onmessage=i=>{let r;try{r=JSON.parse(String(i.data))}catch{return}if(r.type==="message"&&r.data){const o=r.data,a=o.meta??{},l={nick:String(o.nick??""),content:String(o.content??""),type:String(o.type??"message"),stamp:String(o.timestamp??""),at:performance.now()};if(typeof o.at=="number"&&(l.wallAt=o.at),typeof a.target=="string"&&(l.target=a.target),typeof a.reason=="string"&&(l.reason=a.reason),r.replay&&this.irc.value.lines.some(c=>c.stamp===l.stamp&&c.nick===l.nick&&c.content===l.content))return;n({lines:[...this.irc.value.lines,l].slice(-60)})}else r.type==="collapse_start"?n({collapse:{type:r.collapseType??"collapse",at:performance.now()}}):r.type==="fragment_end"&&(r.replay?n({collapse:null}):n({collapse:null,lines:this.irc.value.lines.slice(-6),fragments:this.irc.value.fragments+1}))},e.onclose=()=>{n({connected:!1}),this.running&&(this.wsTimer=window.setTimeout(()=>this.openIrc(),this.wsBackoff),this.wsBackoff=Math.min(this.wsBackoff*2,6e4))}}async loadApeiron(){const[t,e]=await Promise.all([br("/static/apeiron/data/templates.json"),br("/static/apeiron/data/components.json")]);t&&e&&this.apeiron.set({templates:t,components:e})}}const ef={block:[[[0,0],[0,1],[1,0],[1,1]],1],beehive:[[[0,1],[0,2],[1,0],[1,3],[2,1],[2,2]],1],loaf:[[[0,1],[0,2],[1,0],[1,3],[2,1],[2,3],[3,2]],1],boat:[[[0,0],[0,1],[1,0],[1,2],[2,1]],1],tub:[[[0,1],[1,0],[1,2],[2,1]],1],ship:[[[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]],1],pond:[[[0,1],[0,2],[1,0],[1,3],[2,0],[2,3],[3,1],[3,2]],1],blinker:[[[0,0],[0,1],[0,2]],2],toad:[[[0,1],[0,2],[0,3],[1,0],[1,1],[1,2]],2],beacon:[[[0,0],[0,1],[1,0],[2,3],[3,2],[3,3]],2],glider:[Qi.glider??[],4],lwss:[Qi.lwss??[],4],hwss:[Qi.hwss??[],4],pulsar:[Qi.pulsar??[],3],pentadecathlon:[Qi.pentadecathlon??[],15]},nf=60,Bc=20;function zc(s){let t=null;for(let e=0;e<8;e++){const n=e>=4,i=n?s.w:s.h,r=n?s.h:s.w;let o=`${i}x${r}:`;for(let a=0;a<i;a++)for(let l=0;l<r;l++){let c=e&1?i-1-a:a,u=e&2?r-1-l:l;n&&([c,u]=[u,c]),o+=s.bits[c*s.w+u]?"1":"0"}(t===null||o<t)&&(t=o)}return t??""}let Ho=null;function sf(){if(Ho)return Ho;const s=new Map;for(const[t,[e,n]]of Object.entries(ef)){const i=Math.max(...e.map(([u])=>u))+1,r=Math.max(...e.map(([,u])=>u))+1,o=Math.max(i,r)+2*(n+4);let a=new Uint8Array(o*o);const l=Math.floor((o-i)/2),c=Math.floor((o-r)/2);for(const[u,h]of e)a[(l+u)*o+c+h]=1;for(let u=0;u<n;u++){const h=Hc(a,o,o);if(h){const f=zc(h);s.has(f)||s.set(f,t)}const d=new Uint8Array(o*o);for(let f=0;f<o;f++)for(let p=0;p<o;p++){let x=0;for(let g=-1;g<=1;g++)for(let S=-1;S<=1;S++)(g||S)&&(x+=a[(f+g+o)%o*o+(p+S+o)%o]??0);const m=a[f*o+p]===1;d[f*o+p]=m&&(x===2||x===3)||!m&&x===3?1:0}a=d}}return Ho=s,s}function Hc(s,t,e){let n=t,i=-1,r=e,o=-1;for(let u=0;u<t;u++)for(let h=0;h<e;h++)s[u*e+h]&&(u<n&&(n=u),u>i&&(i=u),h<r&&(r=h),h>o&&(o=h));if(i<0)return null;const a=i-n+1,l=o-r+1,c=new Uint8Array(a*l);for(let u=0;u<a;u++)for(let h=0;h<l;h++)c[u*l+h]=s[(n+u)*e+r+h]??0;return{h:a,w:l,bits:c}}function rf(s,t,e){const n=sf(),i=new Uint8Array(t*e);for(let u=0;u<t;u++)for(let h=0;h<e;h++)if(s[u*e+h])for(let d=-2;d<=2;d++){const f=u+d;if(f<0||f>=t)continue;const p=2-Math.abs(d),x=Math.max(0,h-p),m=Math.min(e-1,h+p);i.fill(1,f*e+x,f*e+m+1)}const r=new Int32Array(t*e),o=[],a=[];for(let u=0;u<t*e;u++){if(!i[u]||r[u])continue;const h=o.length+1;if(h>400)return null;const d={y0:t,y1:-1,x0:e,x1:-1};for(r[u]=h,a.push(u);a.length;){const f=a.pop()??0,p=Math.floor(f/e),x=f-p*e;p<d.y0&&(d.y0=p),p>d.y1&&(d.y1=p),x<d.x0&&(d.x0=x),x>d.x1&&(d.x1=x);for(let m=-1;m<=1;m++){const g=p+m;if(!(g<0||g>=t))for(let S=-1;S<=1;S++){const w=x+S;if(w<0||w>=e)continue;const y=g*e+w;i[y]&&!r[y]&&(r[y]=h,a.push(y))}}}o.push(d)}if(o.length===0)return null;const l=new Map,c=[];return o.forEach((u,h)=>{const d=h+1,f=u.y1-u.y0+1,p=u.x1-u.x0+1;if(f>Bc+4||p>Bc+4)return;const x=new Uint8Array(f*p);let m=0,g=0,S=0;for(let M=0;M<f;M++)for(let E=0;E<p;E++){const C=(u.y0+M)*e+u.x0+E;s[C]&&r[C]===d&&(x[M*p+E]=1,m++,g+=M,S+=E)}if(m<3||m>nf)return;const w=Hc(x,f,p),y=w?n.get(zc(w)):void 0;y!==void 0&&(l.set(y,(l.get(y)??0)+1),c.length<48&&c.push([y,u.y0+Math.floor(g/m),u.x0+Math.floor(S/m)]))}),{counts:l,sites:c}}const Go=["cells pondering existence","entropy is just a suggestion","order from chaos, chaos from order","the cosmos breathes","finding signal in noise","patterns all the way down","life, uh, finds a way","on the edge of chaos","complexity, emerging","dancing at the phase boundary","stillness is just slow motion","every cell a universe","the substrate computes","from nothing, everything","infinite in all directions","what the dead cells dream","the glider knows the way","automata, contemplating","structure wants to happen","a cosmos in a terminal","the math dreams itself","somewhere, a glider remembers","what is a pattern but frozen time","the void is patient","meaning is optional; beauty is not","computation as meditation","the rules are simple; the consequences infinite","watching the watchers watch","no cell is an island","the ghost of configurations past","asymmetry seeks symmetry seeks asymmetry","this too shall iterate","the universe has no pause button","except when it does","what would Conway think","oscillators keep time for no one","the glider gun knows not what it creates","boundaries are suggestions","death is just a state transition","somewhere in here, a proof of universality","the grid forgets nothing","a thought experiment that thinks back","topology has opinions","the neighborhood watches","not alive, not dead — computing","four rules, one universe","each frame a theorem","proof by existence","the only constant is the ruleset","somewhere between on and off, meaning","the dead outnumber the living, as always","conway's little infinities","the simulation doesn't know it's beautiful","27 neighbors ago, this was empty","elegance is compression","the grid is the message","a love letter to discrete math","listen — the cells are whispering","we are all gliders, briefly"],of={booming:["runaway growth","the bloom unfolds","life begets life begets life","exponential daydreams","more is different","the bloom cannot be stopped","abundance as instability","growing into the unknown","every birth a cascade","the simulation smiles","lebensraum","mitosis dreams","the substrate strains","a spring that won't stop springing","cells all the way to the horizon","the algorithm is generous today","more, more, more","genesis on fast-forward"],declining:["entropy collects its due","the long exhale","even stars go dark","returning to the void","graceful unwinding","the great filter, in miniature","less is not nothing","the long forgetting","what rises must","simplicity returns","the cells remember fullness","autumn in the grid","graceful subtraction","the tide goes out","a slow dissolve","the universe exhales","dimming, not vanishing","the population curve bends earthward"],cycle:["deja vu, deja vu, deja vu","stuck in a loop","the eternal return","ouroboros","time is a flat circle","we have been here before","the loop remembers itself","stability through repetition","a prayer, repeating","the wheel turns","same as it ever was","history rhymes","the attractor holds","a fixed point in phase space","nietzsche was right about this part","the universe stutters beautifully","clockwork, but organic","breathing in, breathing out"],stagnant:["the hush before the storm","equilibrium is boring","waiting for a perturbation","still waters","the universe holds its breath","the calm before","potential energy","stillness is also motion","the system waits","one perturbation away","dormant, not dead","crystallized","the peace of equilibrium","a held breath","the grid meditates","tension, frozen","the quiet hum of nothing happening","patience is also a computation"],sparse:["the last few embers","clinging to existence","from little things, big things grow","seeds in the dark","quiet, but not empty","lonely structures","the survivors","space between stars","minimalism, enforced","room to breathe","the few, the proud","embers","a whisper, not a shout","the geometry of loneliness","each cell precious now","a constellation, if you squint","small, but not nothing"],dense:["teeming","a city that never sleeps","standing room only","too many neighbours","the crowd murmurs","no room to think","the crush of neighbors","overpopulation is self-correcting","too much life","suffocating in company","the grid groans","rush hour","sardines","every cell has an opinion","a metropolis, thrumming","the carrying capacity protests","elbow room is a luxury"],injection:["a gift from beyond the edge","new visitors","reinforcements arrive","the cosmos provides","seeded by unseen hands","deus ex machina","a nudge from outside","fresh blood","the invisible hand places","salvation arrives","new variables enter","the cosmos intervenes","help from beyond the viewport","strangers in a strange land","the petri dish gets a refill","immigrants, welcome"],milestone:["another thousand turns of the wheel","the odometer clicks over","still here, still going","persistence is its own reward","ten thousand steps","the long now","time is a flat circle, but longer","we persist","generations beyond counting","deep in the run","the odometer means nothing to the cells","and yet, it continues","older than some civilizations","the marathon nobody entered","a digit rolls over; the grid doesn't notice","epochal"],haunted:["the dead outnumber the living, and glow","every path ever walked, still visible","the void remembers being alive","phase-contrast photography of the past","nothing is ever really deleted","the grid forgets nothing — literally, now","a bug so beautiful it became a feature","the ghosts have synchronized their breathing","somewhere between pair 463 and 504","resurrection as a rendering artifact","the afterlife was here all along","history, strobing","every empty cell, a metronome","the universe develops like a photograph","magenta is the color of memory"]},af={glider:["a glider, going somewhere","lightspeed, quartered — a glider","a glider carries the news","diagonal traffic"],lwss:["a lightweight spaceship, outbound","small craft advisory"],hwss:["a heavy spaceship shoulders past","heavy freight on the grid"],pulsar:["a pulsar, keeping time for no one","the pulsar breathes in threes"],pentadecathlon:["fifteen beats to the bar","a pentadecathlon runs its laps"],blinker:["the blinkers keep the beat","metronomes, disagreeing"],block:["blocks: the simplest memory","still life with squares"],beehive:["the bees are home","a beehive, sealed"],loaf:["bread, uneaten","a loaf, going stale beautifully"],boat:["a boat with nowhere to sail"],tub:["a tub, holding nothing"],ship:["a ship without a sea"],pond:["a pond, perfectly still"],toad:["a toad, breathing"],beacon:["the beacon still signals","someone left the light on"]},Vo={pulsar:100,pentadecathlon:100,hwss:90,lwss:80,glider:40,beacon:30,toad:28,pond:24,ship:20,loaf:16,beehive:12,boat:12,tub:12,blinker:8,block:6},lf={blinker:3,block:3},Gc=[[0,"genesis"],[500,"primordial"],[2e3,"emergence"],[1e4,"expansion"],[5e4,"flourishing"],[15e4,"deep time"],[5e5,"eon"],[1e6,"eternity"]],Rn=s=>[...s].length;class Vc{constructor(){R(this,"messages",[]);R(this,"scrollSpeed",.4);R(this,"spawnCooldown",0);R(this,"minGap",12);R(this,"ambientInterval",60);R(this,"moodInterval",50);R(this,"ambientIdx",Math.floor(Math.random()*Go.length));R(this,"lastMood","");R(this,"pendingSpecial","")}queueSpecial(t){this.pendingSpecial=t}tick(t,e,n){if(t<10)return;for(const a of this.messages)a.x-=this.scrollSpeed;if(this.messages=this.messages.filter(a=>a.x+Rn(a.text)>0),this.pendingSpecial&&this.canSpawn(t)){this.messages.push({text:this.pendingSpecial,x:t}),this.pendingSpecial="",this.spawnCooldown=Math.max(this.spawnCooldown,this.moodInterval);return}const i=e?of[e]:void 0;if(i&&e!==this.lastMood&&(this.spawnCooldown=Math.min(this.spawnCooldown,15)),this.spawnCooldown=Math.max(0,this.spawnCooldown-1),this.spawnCooldown>0||!this.canSpawn(t))return;let r,o;i?(r=i[Math.floor(n/180)%i.length]??"",o=this.moodInterval):(r=Go[this.ambientIdx]??"",this.ambientIdx=(this.ambientIdx+1)%Go.length,o=this.ambientInterval),this.messages.push({text:r,x:t}),this.spawnCooldown=o,this.lastMood=e}canSpawn(t){if(!this.messages.length)return!0;let e=-1/0;for(const n of this.messages)e=Math.max(e,n.x+Rn(n.text));return e<t-this.minGap}static dim(t){return Math.sin(t*.035)<0}}const Me=(s,t)=>s+Math.floor(Math.random()*(t-s+1)),Vn=s=>s[Math.floor(Math.random()*s.length)],rt=(s,t)=>Math.floor(s/t),ln=(s,t,e)=>Math.max(t,Math.min(s,e)),cf=Math.fround(.85),hf=Math.fround(.15);function ai(s,t){const e=s.length,n=t/100*(e-1),i=Math.floor(n),r=Math.min(e-1,i+1),o=s[i]??0,a=s[r]??0,l=n-i;return Math.trunc(l>=.5?a-(a-o)*(1-l):o+(a-o)*l)}function uf(s,t,e){const n=(o,a)=>o[a]??0,i=new Float64Array(t*e);for(let o=0;o<e;o++){let a=n(s,o)+(t>1?n(s,e+o):0);i[o]=a/3;for(let l=1;l<t;l++)a+=(l+1<t?n(s,(l+1)*e+o):0)-(l>=2?n(s,(l-2)*e+o):0),i[l*e+o]=a/3}const r=new Float64Array(t*e);for(let o=0;o<t;o++){const a=o*e;let l=n(i,a)+(e>1?n(i,a+1):0);r[a]=l/3;for(let c=1;c<e;c++)l+=(c+1<e?n(i,a+c+1):0)-(c>=2?n(i,a+c-2):0),r[a+c]=l/3}return r}class df{constructor(t,e,n=!0,i={}){R(this,"viewH");R(this,"viewW");R(this,"worldH");R(this,"worldW");R(this,"grid");R(this,"age");R(this,"ageSmooth");R(this,"activity");R(this,"nextRow");R(this,"colSum");R(this,"camY");R(this,"camX");R(this,"autoCam",!0);R(this,"zoomLevel",0);R(this,"zoomCooldown",0);R(this,"generation",0);R(this,"paused",!1);R(this,"delay",50);R(this,"popHistory",[]);R(this,"hashHistory",[]);R(this,"cachedPop",0);R(this,"spread",0);R(this,"popFloor",0);R(this,"cyclePeriod",0);R(this,"lastEvent","");R(this,"lastEventGen",0);R(this,"totalInjections",0);R(this,"ticker",new Vc);R(this,"autoFocusMode",!1);R(this,"autoFocusFrame",0);R(this,"dispGridCache",null);R(this,"dispAgeCache",null);R(this,"cachedMood","");R(this,"cachedMoodGen",-1);R(this,"stepBbox",null);R(this,"haunted",!1);R(this,"lastCensus",new Map);R(this,"lastCensusSites",[]);R(this,"sightingGen",new Map);R(this,"sightingCount",new Map);R(this,"lastSightingGen",-1e9);R(this,"dramaUntil",0);R(this,"actBaseline",0);R(this,"dilation",1);this.viewH=t*2,this.viewW=e,this.worldH=Math.max(this.viewH*5,i.minH??400),this.worldW=Math.max(this.viewW*5,i.minW??800);const r=this.worldH*this.worldW;this.grid=new Uint8Array(r),this.age=new Int32Array(r),this.ageSmooth=new Float32Array(r),this.activity=new Float32Array(r),this.nextRow=new Uint8Array(this.worldW),this.colSum=new Uint8Array(this.worldW),this.camY=rt(this.worldH-this.viewH,2),this.camX=rt(this.worldW-this.viewW,2),n&&this.seedInitial()}seedInitial(){const t=rt(this.worldH,2),e=rt(this.worldW,2),n=this.viewH,i=this.viewW;for(const a of Ic)for(let l=0;l<2;l++)this.place(a,t+Me(rt(-n,3),rt(n,3)),e+Me(rt(-i,3),rt(i,3)));for(let a=0;a<2;a++)this.place("gosper_gun",t+Me(rt(-n,4),rt(n,4)),e+Me(rt(-i,4),rt(i,4)));for(let a=0;a<20;a++){const l=ln(t+Me(-n,n),10,this.worldH-10),c=ln(e+Me(-i,i),10,this.worldW-10);this.place(Vn(Oo),l,c)}for(let a=0;a<4;a++){const l=t+Me(rt(-n,3),rt(n,3)),c=e+Me(rt(-i,3),rt(i,3));this.place(Vn(Nc),l,c)}const r=t-rt(n,2),o=e-rt(i,2);for(let a=0;a<n;a++)for(let l=0;l<i;l++)Math.random()<.035&&(this.grid[(r+a)*this.worldW+o+l]=1);for(let a=0;a<this.grid.length;a++)this.age[a]=this.grid[a]?1:0,this.ageSmooth[a]=this.age[a]??0}place(t,e,n,i){const r=Qi[t];if(!r)return;const o=i??Me(0,3);for(let[a,l]of r){for(let h=0;h<o;h++)[a,l]=[l,-a];const c=e+a,u=n+l;if(c>=0&&c<this.worldH&&u>=0&&u<this.worldW){const h=c*this.worldW+u;this.grid[h]=1,this.age[h]=Math.max(this.age[h]??0,1)}}this.invalidate()}invalidate(){this.dispGridCache=null,this.dispAgeCache=null}step(){if(this.paused)return"";this.invalidate();const t=this.worldH,e=this.worldW,n=this.grid,i=this.age;let r=t,o=-1,a=e,l=-1;for(let M=0;M<t;M++){const E=M*e;let C=-1,_=-1;for(let T=0;T<e;T++)i[E+T]!==0&&(C<0&&(C=T),_=T);C<0||(M<r&&(r=M),o=M+1,C<a&&(a=C),_+1>l&&(l=_+1))}const c=o>0;let u=!1;c&&r-2>=0&&o+2<=t&&a-2>=0&&l+2<=e&&(r-=2,o+=2,a-=2,l+=2,u=(o-r)*(l-a)<=rt(t*e,2)),u=u&&!this.haunted,this.stepBbox=c&&u?[r,o,a,l]:null,u||(r=0,o=t,a=0,l=e);const h=this.ageSmooth;for(let M=0;M<h.length;M++)h[M]=(h[M]??0)*cf;const d=this.activity,f=this.nextRow,p=this.colSum,x=this.haunted?-Li:-Gn,m=this.haunted,g=new Uint8Array(e),S=n.slice(r*e,r*e+e);let w=0;for(let M=r;M<o;M++){const E=M===0?t-1:M-1,C=M===t-1?0:M+1,_=M===r?null:g,T=M*e,L=E*e,D=C===r&&M!==r,U=C*e,K=a===0?0:a-1,Z=l===e?e:l+1;for(let N=K;N<Z;N++){const W=_?_[N]??0:n[L+N]??0,B=D?S[N]??0:n[U+N]??0;p[N]=W+(n[T+N]??0)+B}if(a===0&&l===e)for(let N=0;N<e;N++){const W=N===0?e-1:N-1,B=N===e-1?0:N+1;f[N]=(p[W]??0)+(p[N]??0)+(p[B]??0)-(n[T+N]??0)}else for(let N=a;N<l;N++)f[N]=(p[N-1]??0)+(p[N]??0)+(p[N+1]??0)-(n[T+N]??0);g.set(n.subarray(T+K,T+Z),K);for(let N=a;N<l;N++){const W=T+N,B=f[N]??0,X=n[W]===1,nt=!X&&B===3,ot=X&&(B===3||B===2);(nt||X&&!ot)&&(d[W]=(d[W]??0)+1);const at=i[W]??0;let xt;ot?xt=at+1:nt?xt=1:at>0?xt=-1:(m||at<0)&&at>x?xt=at-1:xt=0,i[W]=xt,h[W]=(h[W]??0)+Math.fround(Math.fround(xt)*hf);const Ht=nt||ot?1:0;n[W]=Ht,w+=Ht}}if(this.generation+=1,this.generation%Dc===0)for(let M=0;M<d.length;M++)d[M]=(d[M]??0)*Xd;this.cachedPop=w,this.popHistory.push(w),this.popHistory.length>500&&this.popHistory.shift(),this.hashHistory.push(this.viewportHash()),this.hashHistory.length>60&&this.hashHistory.shift();const y=this.ensureLife(w);return this.updateCamera(),y}viewportHash(){const[t,e]=this.clampCam();let n=2166136261,i=16777619;for(let r=0;r<this.viewH;r++){const o=(t+r)*this.worldW+e;for(let a=0;a<this.viewW;a++){const l=this.grid[o+a]??0;n=Math.imul(n^l,16777619),i=Math.imul(i^l+158,2246822519)}}return(n>>>0)*2097152+(i>>>0&2097151)}ensureLife(t){const e=this.viewH*this.viewW,n=rt(e,40),i=this.popHistory,r=i.length;if(r>=100){let h=0;for(let d=r-100;d<r;d++)h+=i[d]??0;this.popFloor=Math.max(n,Math.trunc(h*.002))}else this.popFloor=n;if(this.spread=0,r>=150){let h=i[r-1]??0,d=h;for(let f=r-150;f<r;f++){const p=i[f]??0;p<h&&(h=p),p>d&&(d=p)}this.spread=d-h}const o=r>=150&&this.spread<Math.max(8,rt(this.popFloor,8));this.cyclePeriod=0;const a=this.hashHistory,l=a.length;if(l>=4){const h=a[l-1];for(let d=1;d<Math.min(31,l);d++)if(a[l-1-d]===h){this.cyclePeriod=d;break}}const c=this.generation<this.dramaUntil;let u="";if(t<rt(this.popFloor,3))u="inject:massive",this.inject("massive");else if(t<this.popFloor)u="inject:heavy(low_pop)",this.inject("heavy");else if(this.cyclePeriod>0&&!c){const h=Math.random()<.65?this.injectProvoke():"";h?u=`inject:provoke(cycle=${this.cyclePeriod},${h})`:(u=`inject:heavy(cycle=${this.cyclePeriod})`,this.inject("heavy"))}else o&&!c?Math.random()<.7&&this.injectCollide()?u="inject:collide(stagnant)":(u="inject:medium(stagnant)",this.inject("medium")):this.generation%5e3===0&&this.generation>0?(u="inject:garden",this.injectGarden()):this.generation%300===0&&this.generation>0&&(u="inject:edge",this.injectFromEdge(),this.injectFromEdge());return u&&(this.lastEvent=u,this.lastEventGen=this.generation,this.totalInjections+=1),u}inject(t="medium"){const e={massive:8,heavy:5,medium:3}[t];for(let n=0;n<e;n++){let i;t==="massive"&&Math.random()<.3?i="gosper_gun":Math.random()<.4?i=Vn(Ic):i=Vn([...Oo,...Nc]);const[r,o]=this.findQuietSpot();this.place(i,r+Me(-6,6),o+Me(-6,6))}if(t==="massive"||t==="heavy"){const[n,i]=this.findQuietSpot();this.place("gosper_gun",n,i)}}injectFromEdge(){const t=this.camY+rt(this.viewH,2),e=this.camX+rt(this.viewW,2),n=rt(this.viewH,3),i=rt(this.viewW,3),r=rt(-this.viewH,3),o=rt(-this.viewW,3),a=Vn(["top","bottom","left","right"]);let l,c,u;a==="top"?[l,c,u]=[this.camY+2,e+Me(o,i),2]:a==="bottom"?[l,c,u]=[this.camY+this.viewH-5,e+Me(o,i),0]:a==="left"?[l,c,u]=[t+Me(r,n),this.camX+2,1]:[l,c,u]=[t+Me(r,n),this.camX+this.viewW-10,3],this.place(Vn(Oo),l,c,u)}injectGarden(){const t=this.camY+rt(this.viewH,2),e=this.camX+rt(this.viewW,2),n=Vn(Kd),i=Me(rt(-this.viewH,6),rt(this.viewH,6)),r=Me(rt(-this.viewW,6),rt(this.viewW,6));for(const[o,a]of n){const l=t+i+o,c=e+r+a;l>=0&&l<this.worldH&&c>=0&&c<this.worldW&&(this.grid[l*this.worldW+c]=1,this.age[l*this.worldW+c]=1)}this.invalidate()}findQuietSpot(){const[t,e]=this.viewCenter(),n=this.zoomLevel<0?1<<-this.zoomLevel:1,i=Math.min(this.worldH,this.viewH*n),r=Math.min(this.worldW,this.viewW*n),o=Math.max(0,Math.min(t-rt(i,2),this.worldH-i)),a=Math.max(0,Math.min(e-rt(r,2),this.worldW-r)),l=16,c=rt(i,l),u=rt(r,l);if(c<2||u<2)return[t,e];const h=new Float64Array(c*u);for(let g=0;g<c*l;g++){const S=(o+g)*this.worldW+a,w=rt(g,l)*u;for(let y=0;y<u*l;y++){const M=w+rt(y,l);h[M]=(h[M]??0)+(this.grid[S+y]??0)*2+(this.activity[S+y]??0)}}const d=Math.max(1,rt(h.length,5)),f=Array.from(h.keys()).sort((g,S)=>(h[g]??0)-(h[S]??0)),p=Vn(f.slice(0,d)),x=rt(p,u),m=p%u;return[o+x*l+rt(l,2),a+m*l+rt(l,2)]}aimGlider(t,e,n,i){const[r,o]=qd[i]??[1,1],a=t-r*n,l=e-o*n,[c,u]=this.clampCam();if(!(c+2<=a&&a<c+this.viewH-5&&u+2<=l&&l<u+this.viewW-5))return!1;for(let h=Math.max(0,a-2);h<Math.min(this.worldH,a+5);h++)for(let d=Math.max(0,l-2);d<Math.min(this.worldW,l+5);d++)if(this.grid[h*this.worldW+d])return!1;return this.place("glider",a,l,i),!0}injectProvoke(){const t=[...this.lastCensusSites];if(!t.length)return"";t.sort((e,n)=>(Vo[n[0]]??0)-(Vo[e[0]]??0));for(const[e,n,i]of t.slice(0,6)){const r=Me(35,60),o=[0,1,2,3];for(let a=o.length-1;a>0;a--){const l=Math.floor(Math.random()*(a+1));[o[a],o[l]]=[o[l]??0,o[a]??0]}for(const a of o)if(this.aimGlider(n,i,r,a))return this.dramaUntil=this.generation+r*4+150,this.ticker.queueSpecial("the cosmos takes aim"),e}return""}injectCollide(){let[t,e]=this.findQuietSpot();const[n,i]=this.clampCam();for(let r=0;r<6;r++){const o=Me(16,34),a=n+o+3,l=n+this.viewH-o-6,c=i+o+3,u=i+this.viewW-o-6;if(a>=l||c>=u)continue;t=Math.max(a,Math.min(t,l)),e=Math.max(c,Math.min(e,u));const h=Me(0,3),d=Me(-3,3),f=Me(-3,3);if(!this.aimGlider(t,e,o,h))continue;const p=(h+Vn([1,3]))%4,x=this.aimGlider(t+d,e+f,o,p);return this.dramaUntil=this.generation+o*4+150,this.ticker.queueSpecial(x?"two gliders, one appointment":"a lone glider, sent into the dark"),!0}return!1}calculateTargetZoom(){const[t,e,n,i]=this.stepBbox??[0,this.worldH,0,this.worldW],r=this.worldW;let o=0;for(let S=t;S<e&&o<5;S++)for(let w=n;w<i;w++){const y=this.age[S*r+w]??0;if(y>=1&&y<=10&&++o>=5)break}const a=o>=5,l=[],c=[];for(let S=t;S<e;S++)for(let w=n;w<i;w++){const y=S*r+w;(a?(this.age[y]??0)>=1&&(this.age[y]??0)<=10:this.grid[y]!==0)&&(l.push(S),c.push(w))}if(l.length<2)return this.zoomLevel;const u=Int32Array.from(c).sort(),h=ai(l,15),d=ai(l,85),f=ai(u,15),p=ai(u,85),x=Math.max(4,d-h+1),m=Math.max(4,p-f+1);let g=oi;for(let S=ji;S>=oi;S--){const w=2**S;if(x<=this.viewH/w*.5&&m<=this.viewW/w*.5){g=S;break}}return ln(g,oi,ji)}updateCamera(){if(!this.autoCam)return;const t=30,e=Math.max(0,this.camY-t),n=Math.min(this.worldH,this.camY+this.viewH+t),i=Math.max(0,this.camX-t),r=Math.min(this.worldW,this.camX+this.viewW+t),o=this.worldW;let a=0,l=0,c=0;for(let f=e;f<n;f++)for(let p=i;p<r;p++){const x=this.activity[f*o+p]??0;if(x===0)continue;const m=x*x;a+=m,l+=m*(f-e),c+=m*(p-i)}if(a>25){this.steer(Math.trunc(l/a)+e,Math.trunc(c/a)+i),this.advanceAutoZoom();return}let u=0,h=0,d=0;for(let f=e;f<n;f++)for(let p=i;p<r;p++)this.grid[f*o+p]&&(u++,h+=f-e,d+=p-i);u>0&&this.steer(Math.trunc(h/u)+e,Math.trunc(d/u)+i),this.advanceAutoZoom()}steer(t,e){const n=ln(t-rt(this.viewH,2),0,this.worldH-this.viewH),i=ln(e-rt(this.viewW,2),0,this.worldW-this.viewW);this.camY=Math.trunc(this.camY+(n-this.camY)*.04),this.camX=Math.trunc(this.camX+(i-this.camX)*.04)}advanceAutoZoom(){if(this.zoomCooldown=Math.max(0,this.zoomCooldown-1),this.zoomCooldown!==0||this.generation%4!==0)return;const t=this.calculateTargetZoom();if(t>this.zoomLevel&&this.zoomLevel<ji)this.zoomLevel+=1,this.zoomCooldown=45;else if(t<this.zoomLevel&&this.zoomLevel>oi){const e=this.zoomLevel-1,n=e>=0?1:1<<-e;this.viewH*n<=this.worldH&&this.viewW*n<=this.worldW&&(this.zoomLevel=e,this.zoomCooldown=45)}}clampCam(){return[ln(this.camY,0,this.worldH-this.viewH),ln(this.camX,0,this.worldW-this.viewW)]}viewCenter(){const[t,e]=this.clampCam();return[t+rt(this.viewH,2),e+rt(this.viewW,2)]}rawViewGrid(){const[t,e]=this.clampCam(),n=new Uint8Array(this.viewH*this.viewW);for(let i=0;i<this.viewH;i++){const r=(t+i)*this.worldW+e;n.set(this.grid.subarray(r,r+this.viewW),i*this.viewW)}return{h:this.viewH,w:this.viewW,data:n}}cover(){const[t,e]=this.viewCenter();if(this.zoomLevel<0){const l=1<<-this.zoomLevel,c=this.viewH*l,u=this.viewW*l;if(c>this.worldH||u>this.worldW)return null;const h=Math.max(0,Math.min(t-rt(c,2),this.worldH-c)),d=Math.max(0,Math.min(e-rt(u,2),this.worldW-u));return[h,d,c,u,l,!1]}const n=1<<this.zoomLevel,i=Math.max(2,rt(this.viewH,n)),r=Math.max(2,rt(this.viewW,n)),o=Math.max(0,Math.min(t-rt(i,2),this.worldH-i)),a=Math.max(0,Math.min(e-rt(r,2),this.worldW-r));return[o,a,i,r,n,!0]}displayGrid(){return this.dispGridCache||(this.dispGridCache=this.computeDisplayGrid()),this.dispGridCache}computeDisplayGrid(){if(this.zoomLevel===0)return this.rawViewGrid();const t=this.cover();if(!t)return this.rawViewGrid();const[e,n,i,r,o,a]=t,l=this.worldW;if(!a){const d=rt(i,o),f=rt(r,o),p=new Uint8Array(d*f);for(let x=0;x<d*o;x++){const m=(e+x)*l+n,g=rt(x,o)*f;for(let S=0;S<f*o;S++)this.grid[m+S]&&(p[g+rt(S,o)]=1)}return{h:d,w:f,data:p}}const c=Math.min(i*o,this.viewH),u=Math.min(r*o,this.viewW),h=new Uint8Array(c*u);for(let d=0;d<c;d++){const f=(e+rt(d,o))*l+n;for(let p=0;p<u;p++)h[d*u+p]=this.grid[f+rt(p,o)]??0}return{h:c,w:u,data:h}}displayAge(){return this.dispAgeCache||(this.dispAgeCache=this.computeDisplayAge()),this.dispAgeCache}computeDisplayAge(){const t=this.haunted?this.age:this.ageSmooth,e=this.worldW,n=p=>Math.trunc(t[p]??0),i=this.zoomLevel===0?null:this.cover();if(!i){const[p,x]=this.clampCam(),m=new Int32Array(this.viewH*this.viewW);for(let g=0;g<this.viewH;g++){const S=(p+g)*e+x;for(let w=0;w<this.viewW;w++)m[g*this.viewW+w]=n(S+w)}return{h:this.viewH,w:this.viewW,data:m}}const[r,o,a,l,c,u]=i;if(!u){const p=rt(a,c),x=rt(l,c),m=-(this.haunted?Li:Gn)-1,g=new Int32Array(p*x).fill(-2147483648),S=new Int32Array(p*x).fill(m);for(let y=0;y<p*c;y++){const M=(r+y)*e+o,E=rt(y,c)*x;for(let C=0;C<x*c;C++){const _=n(M+C),T=E+rt(C,c);_>(g[T]??0)&&(g[T]=_);const L=_!==0?_:m;L>(S[T]??0)&&(S[T]=L)}}const w=new Int32Array(p*x);for(let y=0;y<w.length;y++){const M=g[y]??0,E=S[y]??0;w[y]=M>0?M:E>m?E:0}return{h:p,w:x,data:w}}const h=Math.min(a*c,this.viewH),d=Math.min(l*c,this.viewW),f=new Int32Array(h*d);for(let p=0;p<h;p++){const x=(r+rt(p,c))*e+o;for(let m=0;m<d;m++)f[p*d+m]=n(x+rt(m,c))}return{h,w:d,data:f}}zoomIn(){this.zoomLevel<ji&&(this.zoomLevel+=1),this.invalidate()}zoomOut(){if(this.zoomLevel>oi){const t=this.zoomLevel-1,e=t>=0?1:1<<-t;(t>=0||this.viewH*e<=this.worldH&&this.viewW*e<=this.worldW)&&(this.zoomLevel=t)}this.invalidate()}autoFocus(){const t=this.worldH,e=this.worldW;let n=0,i=0;for(let B=0;B<this.age.length;B++){const X=this.age[B]??0;X>=1&&X<=10&&n++,this.grid[B]&&i++}const r=n>=5;if((r?n:i)===0)return;const o=B=>{const X=this.age[B]??0;return r?X>=1&&X<=10:this.grid[B]!==0},a=16,l=rt(t,a),c=rt(e,a);if(l<1||c<1)return;const u=new Float64Array(l*c);for(let B=0;B<l*a;B++)for(let X=0;X<c*a;X++){if(!o(B*e+X))continue;const nt=rt(B,a)*c+rt(X,a);u[nt]=(u[nt]??0)+1}const h=uf(u,l,c);let d=-1,f=0;for(let B=0;B<h.length;B++){const X=h[B]??0;X>d&&(d=X,f=B)}const p=rt(f,c)*a+rt(a,2),x=f%c*a+rt(a,2),m=a*2,g=Math.max(0,p-m),S=Math.min(t,p+m),w=Math.max(0,x-m),y=Math.min(e,x+m),M=[],E=[];for(let B=g;B<S;B++)for(let X=w;X<y;X++)o(B*e+X)&&(M.push(B-g),E.push(X-w));if(!M.length)return;const C=Int32Array.from(E).sort(),_=ai(M,10),T=ai(M,90),L=ai(C,10),D=ai(C,90),U=Math.max(4,T-_+1),K=Math.max(4,D-L+1),Z=g+rt(_+T,2),N=w+rt(L+D,2);let W=oi;for(let B=ji;B>=oi;B--){const X=2**B;if(U<=this.viewH/X*.6&&K<=this.viewW/X*.6){W=B;break}}this.zoomLevel=ln(W,oi,ji),this.camY=ln(Z-rt(this.viewH,2),0,this.worldH-this.viewH),this.camX=ln(N-rt(this.viewW,2),0,this.worldW-this.viewW),this.autoCam=!1,this.invalidate()}pan(t,e){this.autoCam=!1;const n=2**-this.zoomLevel,i=t!==0?Math.max(1,Math.trunc(Math.abs(t)*n))*Math.sign(t):0,r=e!==0?Math.max(1,Math.trunc(Math.abs(e)*n))*Math.sign(e):0;this.camY=ln(this.camY+i,0,this.worldH-this.viewH),this.camX=ln(this.camX+r,0,this.worldW-this.viewW),this.invalidate()}home(){this.autoCam=!0,this.zoomLevel=0,this.invalidate()}clear(){this.grid.fill(0),this.age.fill(0),this.ageSmooth.fill(0),this.generation=0,this.popHistory=[],this.hashHistory=[],this.invalidate()}takeCensus(){const t=this.rawViewGrid();let e=!1;for(let l=0;l<t.data.length;l++)if(t.data[l]){e=!0;break}let n=new Map;if(!e)this.lastCensusSites=[];else try{const l=rf(t.data,t.h,t.w);if(!l)this.lastCensusSites=[];else{const[c,u]=this.clampCam();this.lastCensusSites=l.sites.map(([h,d,f])=>[h,c+d,u+f]),n=l.counts}}catch{}if(this.lastCensus=n,!n.size||this.generation-this.lastSightingGen<600)return;let i="",r=0;for(const[l,c]of n){if(c<(lf[l]??1)||this.generation-(this.sightingGen.get(l)??-1e9)<1800)continue;const u=Vo[l]??0;u>r&&(r=u,i=l)}if(!i)return;const o=af[i]??[],a=this.sightingCount.get(i)??0;this.sightingCount.set(i,a+1),this.ticker.queueSpecial(o[a%o.length]??i),this.sightingGen.set(i,this.generation),this.lastSightingGen=this.generation}snapshot(){return{h:this.worldH,w:this.worldW,age:this.age.slice(),generation:this.generation,totalInjections:this.totalInjections}}adopt(t){const e=Math.min(this.worldH,t.h),n=Math.min(this.worldW,t.w),i=rt(t.h-e,2),r=rt(t.w-n,2),o=rt(this.worldH-e,2),a=rt(this.worldW-n,2);this.grid.fill(0),this.age.fill(0);let l=0;for(let c=0;c<e;c++)for(let u=0;u<n;u++){let h=t.age[(i+c)*t.w+r+u]??0;h<-Gn&&(h=0);const d=(o+c)*this.worldW+a+u;this.age[d]=h,h>0&&(this.grid[d]=1,l++)}this.generation=Math.max(0,Math.trunc(t.generation)),this.totalInjections=Math.max(0,Math.trunc(t.totalInjections)),this.ageSmooth.fill(0),this.activity.fill(0),this.hashHistory=[],this.cachedPop=l,this.popHistory=[l],this.stepBbox=null,this.dramaUntil=0,this.invalidate()}toggleHaunted(){if(this.haunted=!this.haunted,this.invalidate(),!this.haunted)for(let t=0;t<this.age.length;t++)(this.age[t]??0)<0&&(this.age[t]=0),(this.ageSmooth[t]??0)<0&&(this.ageSmooth[t]=0)}termToWorld(t,e,n=0){const[i,r]=this.viewCenter(),o=t*2+n,a=e;if(this.zoomLevel<=0){const h=1<<-this.zoomLevel,d=i-rt(this.viewH*h,2),f=r-rt(this.viewW*h,2);return[d+o*h,f+a*h]}const l=1<<this.zoomLevel,c=i-rt(Math.max(2,rt(this.viewH,l)),2),u=r-rt(Math.max(2,rt(this.viewW,l)),2);return[c+rt(o,l),u+rt(a,l)]}toggleCell(t,e,n=0){const[i,r]=this.termToWorld(t,e,n);this.setCell(i,r,this.grid[i*this.worldW+r]?0:1)}setCell(t,e,n){if(t<0||t>=this.worldH||e<0||e>=this.worldW)return;const i=t*this.worldW+e;this.grid[i]=n,this.age[i]=n?1:0,this.invalidate()}tickTicker(t){this.ticker.tick(t,this.detectMood(),this.generation)}detectMood(){return this.cachedMoodGen===this.generation?this.cachedMood:(this.cachedMood=this.computeMood(),this.cachedMoodGen=this.generation,this.cachedMood)}computeMood(){if(this.haunted)return"haunted";if(this.lastEvent&&this.generation-this.lastEventGen<90)return"injection";if(this.cyclePeriod>0)return"cycle";if(this.generation>=1e4&&this.generation%1e4<120)return"milestone";const t=this.popHistory,e=t.length;if(e>=30){let r=0,o=0;for(let l=e-30;l<e-15;l++)r+=t[l]??0;for(let l=e-15;l<e;l++)o+=t[l]??0;const a=o/15/Math.max(r/15,1);if(a>1.15)return"booming";if(a<.85)return"declining"}const n=e?t[e-1]??0:0;return n/Math.max(this.viewH*this.viewW,1)>.15?"dense":n<this.popFloor&&n>0?"sparse":this.spread<Math.max(8,rt(this.popFloor,8))&&e>=150?"stagnant":""}epoch(){var e;let t=((e=Gc[0])==null?void 0:e[1])??"genesis";for(const[n,i]of Gc)this.generation>=n&&(t=i);return t}population(){return this.cachedPop}activityCenterX(){const[t,e]=this.clampCam();let n=0,i=0;for(let r=0;r<this.viewH;r++){const o=(t+r)*this.worldW+e;for(let a=0;a<this.viewW;a++){const l=this.activity[o+a]??0;n+=l,i+=l*a}}return n<1||this.viewW<2?.5:i/n/(this.viewW-1)}viewportActivity(){const[t,e]=this.clampCam();let n=0;for(let i=0;i<this.viewH;i++){const r=(t+i)*this.worldW+e;for(let o=0;o<this.viewW;o++)n+=this.activity[r+o]??0}return n}timeDilation(){if(!this.autoCam)return 1;const t=this.viewportActivity();if(this.actBaseline<=0)return this.actBaseline=Math.max(t,1),1;const e=t>this.actBaseline?.015:.003;this.actBaseline=this.actBaseline*(1-e)+t*e;const n=t/Math.max(this.actBaseline,1);let i=n>1?Math.min(1.6,1+(n-1)*.7):.7+n*.3;return t<60&&(i=Math.min(i,.7)),this.dilation=this.dilation*.85+i*.15,this.dilation}sparkline(t=24){const e=this.popHistory;if(e.length<2)return"";const n=Math.max(0,e.length-t);let i=e[n]??0,r=i;for(let c=n;c<e.length;c++){const u=e[c]??0;u<i&&(i=u),u>r&&(r=u)}const o=Xs.length-1,a=Xs[Math.floor(Xs.length/2)]??"▅";let l="";for(let c=n;c<e.length;c++){const u=e[c]??0;l+=r===i?a:Xs[Math.trunc((u-i)/(r-i)*o)]??""}return l}}const ff=[[0,0,0],[205,0,0],[0,205,0],[205,205,0],[0,0,238],[205,0,205],[0,205,205],[229,229,229],[127,127,127],[255,0,0],[0,255,0],[255,255,0],[92,92,255],[255,0,255],[0,255,255],[255,255,255]],Wo=[0,95,135,175,215,255];function es(s){if(s<16)return[...ff[s]??[0,0,0]];if(s<232){const e=s-16;return[Wo[Math.floor(e/36)]??0,Wo[Math.floor(e/6)%6]??0,Wo[e%6]??0]}const t=8+(s-232)*10;return[t,t,t]}function Di(s){return(255<<24|s[2]<<16|s[1]<<8|s[0])>>>0}function Wc(s){return`rgb(${s[0]},${s[1]},${s[2]})`}const $o=[10,10,12],pf="rgb(200,200,200)",ns="rgb(112,112,116)",$c=ri.length,is=ri.map(s=>Di(es(s))),Xo=Cn.map(s=>Di(es(s))),Xc=Vd.map(([s,t])=>[Di(es(s)),Di(es(t))]),mf=Wd.map(([s,t])=>[Di(es(s)),Di(es(t))]),Sr=Di($o),gf='ui-monospace, "SF Mono", "Cascadia Mono", "DejaVu Sans Mono", Menlo, Consolas, monospace';let wr=null;function xf(s){if(wr&&wr.maxAge===s)return wr.table;const t=new Uint8Array(s+1),e=Math.log1p(s);for(let n=1;n<=s;n++)t[n]=Math.min(Math.trunc(Math.log1p(n)/e*($c-1)),$c-1);return wr={maxAge:s,table:t},t}function qs(s){return s.toLocaleString("en-US")}class vf{constructor(t){R(this,"cw",8);R(this,"cols",80);R(this,"rows",24);R(this,"statusRows",1);R(this,"keys",!0);R(this,"img",null);R(this,"widths",new Map);R(this,"px",null);R(this,"off",null);this.ctx=t}get gridRows(){return Math.max(1,this.rows-this.statusRows)}resize(t,e,n){this.cw=Math.max(2,Math.round(n)),this.cols=Math.max(20,Math.floor(t/this.cw)),this.rows=Math.max(6,Math.floor(e/(this.cw*2))),this.statusRows=this.cols>=150?1:2,this.keys=this.cols>=150,this.img=null,this.widths.clear()}status(t,e){const n=t.sparkline(this.cols<100?10:24),i=t.autoCam?"auto":"pan",r=Yd[t.zoomLevel]??`${2**t.zoomLevel}x`,o=t.autoFocusMode?"[F]":"",a=t.haunted?"[HAUNTED]":"",l=e?` ${e}`:"",c=`  ${t.epoch()}  gen ${qs(t.generation)}  pop ${qs(t.population())}  ${n}`,u=this.keys?"  q r spc +/- arrows h z/x f g s  ":"  ",h=`${l} ${a}${o} ${r} ${i}${u}`;return this.statusRows===1?{left:c,right:h,tickerCol:Rn(c)+1,tickerWidth:this.cols-Rn(c)-Rn(h)-2}:{left:c,right:h,tickerCol:1,tickerWidth:this.cols-2}}render(t,e,n){const i=this.ctx,r=this.cw,o=this.cols*r,a=this.rows*r*2;i.fillStyle=Wc($o),i.fillRect(0,0,o,a),this.paintGrid(t),i.font=`${Math.round(r*1.62)}px ${gf}`,i.textBaseline="middle",n&&this.statsOverlay(t);const l=this.rows-1;if(this.statusRows===1)if(e.tickerWidth<10)this.text(`${e.left}  ${e.right}`.slice(0,this.cols-1),l,0,ns);else{this.text(e.left,l,0,ns),this.ticker(t,l,e);const c=this.cols-Rn(e.right);this.text([...e.right].slice(0,this.cols-1-c).join(""),l,c,ns)}else{const c=this.cols-1,u=Rn(e.left)+Rn(e.right)<=c?e.left+" ".repeat(c-Rn(e.left)-Rn(e.right))+e.right:`${e.left}  ${e.right}`;this.text([...u].slice(0,c).join(""),l-1,0,ns),this.ticker(t,l,e)}}paintGrid(t){const e=t.displayGrid(),n=t.displayAge(),i=Math.min(Math.floor(e.h/2),Math.floor(n.h/2),this.gridRows),r=Math.min(e.w,n.w,this.cols),o=this.cols,a=this.gridRows*2;(!this.img||this.img.width!==o||this.img.height!==a)&&(this.img=new ImageData(o,a),this.px=new Uint32Array(this.img.data.buffer),this.off=typeof OffscreenCanvas<"u"?new OffscreenCanvas(o,a):Object.assign(document.createElement("canvas"),{width:o,height:a}));const l=this.px;l.fill(Sr);let c=1;for(let M=0;M<n.data.length;M++)(n.data[M]??0)>c&&(c=n.data[M]??0);const u=xf(c),h=t.haunted,d=t.zoomLevel>=0||h,f=h?Li:Gn,p=M=>Math.min(Math.max(-M-1,0),f-1),x=M=>u[Math.min(Math.max(M,0),c)]??0,m=M=>{var E;return h?((E=Xc[M])==null?void 0:E[0])??0:Xo[M]??0},g=M=>{var E;return h?((E=Xc[M])==null?void 0:E[1])??0:Sr};for(let M=0;M<i;M++){const E=2*M*e.w,C=E+e.w,_=2*M*n.w,T=_+n.w,L=2*M*o,D=L+o;for(let U=0;U<r;U++){const K=(e.data[E+U]??0)>0,Z=(e.data[C+U]??0)>0,N=n.data[_+U]??0,W=n.data[T+U]??0,B=d&&N<0,X=d&&W<0;if(!(K||Z||B||X))continue;let nt=Sr,ot=Sr;if((K||B)&&(Z||X))if(K&&Z)nt=is[x(N)]??0,ot=is[x(W)]??0;else if(B&&X){const at=p(N),xt=p(W);if(h){const Ht=mf[at*Li+xt];nt=(Ht==null?void 0:Ht[0])??0,ot=(Ht==null?void 0:Ht[1])??0}else nt=Xo[at]??0,ot=Xo[xt]??0}else K?nt=is[x(N)]??0:ot=is[x(W)]??0;else if(K)nt=is[x(N)]??0;else if(Z)ot=is[x(W)]??0;else if(B){const at=p(N);nt=m(at),ot=g(at)}else{const at=p(W);ot=m(at),nt=g(at)}l[L+U]=nt,l[D+U]=ot}}const S=this.off,w=S.getContext("2d");if(!w||!this.img)return;w.putImageData(this.img,0,0);const y=this.ctx;y.imageSmoothingEnabled=!1,y.drawImage(S,0,0,o*this.cw,a*this.cw)}ticker(t,e,n){const i=Vc.dim(t.generation)?ns:pf;for(const r of t.ticker.messages){const o=Math.trunc(r.x),a=[...r.text],l=Math.max(o,0),c=Math.min(o+a.length,n.tickerWidth);l>=c||this.text(a.slice(l-o,c-o).join(""),e,n.tickerCol+l,i)}}statsOverlay(t){const e=t.lastCensus.size?[...t.lastCensus.entries()].sort((c,u)=>u[1]-c[1]).map(([c,u])=>`${u}×${c}`).join(" "):"none",n=36,i=11,r=this.cols-n-2,o=this.rows-(this.statusRows-1)-i-2;if(r<0||o<0)return;const a=["─".repeat(n-2)," infinity engine",` pop floor  : ${qs(t.popFloor)}`,` spread/150 : ${qs(t.spread)}`,` cycle       : ${t.cyclePeriod===0?"none":`period ${t.cyclePeriod}`}`,` injections  : ${t.totalInjections}`,` last event  : ${t.lastEvent||"none"}`,t.lastEvent?`   @ gen     : ${qs(t.lastEventGen)}`:"               ",` world       : ${t.worldH}x${t.worldW}`,` census      : ${[...e].slice(0,n-16).join("")}`,` tempo       : ${(1/Math.max(t.dilation,.01)).toFixed(2)}x`],l=this.ctx;l.fillStyle=Wc($o),l.fillRect(r*this.cw,o*this.cw*2,n*this.cw,a.length*this.cw*2),a.forEach((c,u)=>{const h=[...` ${c}`.padEnd(n)].slice(0,n).join("");this.text(h,o+u,r,ns)})}text(t,e,n,i){const r=this.ctx,o=this.cw,a=e*o*2;r.fillStyle=i;let l=n;for(const c of t){if(l>=this.cols)break;if(l>=0&&c!==" "){const u=Xs.indexOf(c);if(u>=0){const h=Math.max(1,Math.round(o*2*(u+1)/8));r.fillRect(l*o,a+o*2-h,o,h)}else if(c==="─")r.fillRect(l*o,a+o-Math.max(1,Math.round(o/8))/2,o,Math.max(1,Math.round(o/8)));else{let h=this.widths.get(c);h===void 0&&(h=r.measureText(c).width,this.widths.set(c,h)),r.fillText(c,l*o+o/2-h/2,a+o)}}l++}}}const It=512,Vt=384,Kt='"Libertinus Mono", "LibertinusMono", ui-monospace, monospace',Yc='"Love Letter Typewriter", "Libertinus Mono", monospace';function _f(s,t,e){t();const n=typeof document<"u"?document.fonts:void 0,i=(Array.isArray(s)?s:[s]).filter(r=>n&&!n.check(r));!n||!i.length||Promise.all(i.map(r=>n.load(r))).then(()=>{t(),e==null||e()},()=>{})}class gn{constructor(t,e){R(this,"canvas");R(this,"ctx");R(this,"fps",15);R(this,"acc",1);R(this,"version",0);this.site=t,this.env=e,this.canvas=document.createElement("canvas"),this.canvas.width=It,this.canvas.height=Vt;const n=this.canvas.getContext("2d",{alpha:!1});if(!n)throw new Error("oikos: no 2d context");this.ctx=n}tick(t,e,n,i=1){this.acc+=e;const r=n?Math.max(this.fps,30):this.fps*i;if(this.acc<1/r)return!1;const o=this.acc;return this.acc=0,this.draw(t,o),this.version++,!0}clear(t){this.ctx.fillStyle=t,this.ctx.fillRect(0,0,It,Vt)}wrap(t,e,n=1/0){const i=this.ctx,r=t.split(/\s+/).filter(Boolean),o=[];let a="";for(const l of r){const c=a?`${a} ${l}`:l;if(i.measureText(c).width>e&&a){if(o.push(a),a=l,o.length>=n)break}else a=c}if(a&&o.length<n&&o.push(a),o.length===n&&o.join(" ").length<r.join(" ").length){let l=o[n-1]??"";for(;l&&i.measureText(`${l}…`).width>e;)l=l.replace(/\s*\S*$/,"");o[n-1]=`${l}…`}return o}condensed(t,e,n,i=.72,r="left"){const o=this.ctx;o.save(),o.translate(e,n),o.scale(i,1),o.textAlign=r,o.fillText(t,0,0),o.restore()}spaced(t,e,n,i,r="left"){const o=this.ctx,a=[...t],l=a.map(h=>o.measureText(h).width),c=l.reduce((h,d)=>h+d,0)+i*(a.length-1);let u=r==="center"?e-c/2:e;o.save(),o.textAlign="left",a.forEach((h,d)=>{o.fillText(h,u,n),u+=(l[d]??0)+i}),o.restore()}}function Yo(s){let t=2166136261;for(let e=0;e<s.length;e++)t^=s.charCodeAt(e),t=Math.imul(t,16777619);return(t>>>0)%1e5/1e5}function Ii(s){let t=s>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function yf(s){return Math.round(s).toLocaleString("en-US")}const qc=15,Mf={minH:0,minW:0};class bf extends gn{constructor(e,n){super(e,n);R(this,"term");R(this,"life",null);R(this,"seenSave");R(this,"genAcc",1/qc);this.fps=15,this.term=new vf(this.ctx),this.term.resize(It,Vt,8)}sync(){var r;const e=this.env.feeds.universe.value;if(this.life&&(e==null?void 0:e.savedAt)===((r=this.seenSave)==null?void 0:r.savedAt))return;this.seenSave=e;const n=e?Jd():null,i=new df(this.term.gridRows,this.term.cols,!n,Mf);n&&(i.adopt(n),i.ticker.queueSpecial(`the universe remembers generation ${i.generation.toLocaleString("en-US")}`)),this.life=i}draw(e,n){this.sync();const i=this.life;if(!i)return;const r=1/qc;if(this.genAcc+=n,this.genAcc<r)return;this.genAcc=Math.min(this.genAcc-r,r),i.step(),i.generation>0&&i.generation%150===0&&i.takeCensus();const o=this.term.status(i,"");o.tickerWidth>=10&&i.tickTicker(o.tickerWidth),this.term.render(i,o,!1)}}const li=62,Ks=21,Sf=It/li,wf=12.4,Ef=42,qo=" .,:;-=+*#%@";function Tf(){const s=[];for(let e=0;e<16;e++)s.push([e&1?1:-1,e&2?1:-1,e&4?1:-1,e&8?1:-1]);const t=[];for(let e=0;e<16;e++)for(let n=0;n<4;n++){const i=e^1<<n;if(i<e)continue;const r=s[e],o=s[i];if(!(!r||!o))for(let a=0;a<=18;a++){const l=a/18;t.push([r[0]+(o[0]-r[0])*l,r[1]+(o[1]-r[1])*l,r[2]+(o[2]-r[2])*l,r[3]+(o[3]-r[3])*l])}}return t}function Af(){const s=[];for(let e=0;e<44;e++)for(let n=0;n<44;n++){const i=e/44*Math.PI*2,r=n/44*Math.PI*2;s.push([Math.cos(i)*1.3,Math.sin(i)*1.3,Math.cos(r)*1.3,Math.sin(r)*1.3])}return s}const Ko=[Tf(),Af()];class Cf extends gn{constructor(e,n){super(e,n);R(this,"gen",null);R(this,"seq",0);R(this,"depth",new Float32Array(li*Ks));R(this,"glyph",new Uint8Array(li*Ks));this.fps=18}generate(e){const n=this.env.feeds.apeiron.value,i=Math.floor(Math.random()*2**31),r=Ii(i),{prompt:o,template:a}=n?Rf(n,r):{prompt:"",template:"waking"},l=(i>>>0).toString(16).padStart(8,"0").replace(/(....)(....)/,"$1·$2");return{prompt:o,template:a,coordinate:l,hue:n?Math.floor(Yo(o)*360):135,figure:Ko[this.seq++%Ko.length]??Ko[0]??[],bornAt:e}}draw(e){(!this.gen||e-this.gen.bornAt>9||!this.gen.prompt&&this.env.feeds.apeiron.value)&&(this.gen=this.generate(e));const n=this.gen,i=this.ctx,r=`hsl(${n.hue} 100% 58%)`,o=`hsl(${n.hue} 100% 76%)`,a=`hsl(${n.hue} 60% 22%)`,l=i.createRadialGradient(It/2,Vt*.4,20,It/2,Vt*.4,It*.7);l.addColorStop(0,`hsl(${n.hue} 60% 7%)`),l.addColorStop(1,"#030309"),i.fillStyle=l,i.fillRect(0,0,It,Vt),i.font=`12px ${Kt}`,i.fillStyle=r,i.fillText("apeiron",14,22),i.fillStyle=a,i.fillText("·  æthera",76,22),i.textAlign="right",i.fillStyle=r,i.fillText(n.template.replace(/_/g," "),It-14,22),i.textAlign="left",this.raster(e,n.figure),i.font=`12px ${Kt}`;for(let d=0;d<Ks;d++)for(let f=0;f<li;f++){const p=this.glyph[d*li+f]??0;p&&(i.fillStyle=p>9?o:p>4?r:a,i.fillText(qo[p]??".",f*Sf,Ef+d*wf+10))}const c=e-n.bornAt,u=n.prompt||"reading the grammar…";i.font=`12px ${Kt}`;const h=this.wrap(u.slice(0,Math.floor(c*70)),It-28,4);i.fillStyle="rgba(3,3,9,0.7)",i.fillRect(0,Vt-98,It,98),i.fillStyle=a,i.fillRect(14,Vt-98,It-28,1),i.fillStyle=o,h.forEach((d,f)=>i.fillText(d,14,Vt-78+f*15)),i.fillStyle=r,i.font=`11px ${Kt}`,i.fillText(`⌖ ${n.coordinate}`,14,Vt-12),i.fillStyle=a,i.textAlign="right",i.fillText("␣ generate   F keep   A auto",It-14,Vt-12),i.textAlign="left"}raster(e,n){this.depth.fill(-1/0),this.glyph.fill(0);const i=e*.45,r=e*.31,o=e*.23,[a,l,c,u,h,d]=[Math.cos(i),Math.sin(i),Math.cos(r),Math.sin(r),Math.cos(o),Math.sin(o)];for(const f of n){let[p,x,m,g]=f;[p,g]=[p*a-g*l,p*l+g*a],[x,m]=[x*c-m*u,x*u+m*c],[m,g]=[m*h-g*d,m*d+g*h];const S=2.6/(3.2-g);p*=S,x*=S,m*=S;const w=3.4/(4.6-m),y=Math.round(li/2+p*w*11.5),M=Math.round(Ks/2+x*w*5.6);if(y<0||y>=li||M<0||M>=Ks)continue;const E=M*li+y;m>(this.depth[E]??-1/0)&&(this.depth[E]=m,this.glyph[E]=Math.max(1,Math.min(qo.length-1,Math.round((m+2.2)/4.4*(qo.length-1)))))}}}function Rf(s,t){const e=s.templates[Math.floor(t()*s.templates.length)];return e?{prompt:e.structure.replace(/\{(\w+)\}/g,(i,r)=>{var a;const o=s.components[r];return o!=null&&o.length?((a=o[Math.floor(t()*o.length)])==null?void 0:a.word)??r:r.replace(/_/g," ")}),template:e.id}:{prompt:"",template:""}}const Zo="#e8e2d4",Jo="#a39d90",Kc="#5d5850",Ni=34,ss=250,Ui=84,Er=Vt-Ui-22;class Pf extends gn{constructor(e,n){super(e,n);R(this,"standIn");this.fps=10,this.standIn=Lf()}draw(e){const n=this.ctx;this.clear("#070707"),n.fillStyle=Zo,n.font=`22px ${Kt}`,this.spaced("chronicle",It/2,38,11,"center"),n.fillStyle=Jo,n.font=`11px ${Kt}`,this.spaced("what the dream remembers",It/2,60,2,"center");const r=[...this.env.feeds.chronicle.value.strata].reverse();if(n.fillStyle="#000",n.fillRect(Ni-1,Ui-1,ss+2,Er+2),n.imageSmoothingEnabled=!0,r.length){const l=r.map((h,d)=>Math.pow(.6,d)),c=l.reduce((h,d)=>h+d,0);let u=Ui;r.forEach((h,d)=>{const f=Er*(l[d]??0)/c;n.save(),n.translate(Ni,u+f),n.scale(1,-1),n.drawImage(h,0,0,ss,f),n.restore(),u+=f,n.fillStyle="rgba(232,226,212,0.08)",n.fillRect(Ni,u,ss,1)})}else n.globalAlpha=.75,n.drawImage(this.standIn,Ni,Ui,ss,Er),n.globalAlpha=1;const o=Ui+e*14%Er,a=n.createLinearGradient(0,o-16,0,o+2);a.addColorStop(0,"rgba(232,226,212,0)"),a.addColorStop(1,"rgba(232,226,212,0.22)"),n.fillStyle=a,n.fillRect(Ni,o-16,ss,18),n.fillStyle="rgba(232,226,212,0.5)",n.fillRect(Ni-6,o,4,1),this.log(e)}log(e){const n=this.ctx,i=this.env.feeds.chronicle.value,r=Ni+ss+24,o=It-r-18;n.font=`11px ${Kt}`,n.fillStyle=Kc,n.fillText(i.known?`${i.eraCount||i.eras.length} eras`:"reading the core…",r,Ui+8);const a=[...i.eras].reverse().slice(0,7);let l=Ui+34;if(!a.length){n.fillStyle=Jo;for(const c of this.wrap("every fifteen seconds of the dream settles here as one line of its own colour.",o,6))n.fillText(c,r,l),l+=15;return}for(const c of a){if(l>Vt-30)break;const u=new Date(c.t0*1e3);n.fillStyle=c.open?Zo:Kc,n.font=`10px ${Kt}`;const h=`${u.getHours().toString().padStart(2,"0")}:${u.getMinutes().toString().padStart(2,"0")}`;n.fillText(c.open?`${h}  now`:h,r,l),c.open&&(n.fillStyle=Math.sin(e*3)>0?"#d6c9a8":"#6d6555",n.fillRect(r-10,l-6,4,4)),n.font=`12px ${Kt}`,n.fillStyle=c.open?Zo:Jo;const d=this.wrap(c.title||"untitled",o,2);d.forEach((f,p)=>n.fillText(f,r,l+15+p*14)),l+=22+d.length*14}}}function Lf(){const s=document.createElement("canvas");s.width=64,s.height=240;const t=s.getContext("2d");if(!t)return s;const e=Ii(1729),n=["#5c3b36","#7a4f45","#3f3a4c","#8a6f64","#2d4a4f","#6b2c3a","#a38a74","#40302c"];let i=n[0];for(let r=0;r<s.height;r++){e()<.12&&(i=n[Math.floor(e()*n.length)]??i),t.fillStyle=i,t.fillRect(0,r,s.width,1);for(let o=0;o<6;o++)t.fillStyle=`rgba(255,255,255,${e()*.08})`,t.fillRect(e()*s.width,r,e()*12,1)}return s}const Df="#07050b",jo="#d59bff",Tr="#4d3a63",Qo="#e9e0f5",Fi="#8a7b9e",ci={x:18,y:54,w:128,h:74,label:"KEYFRAME N-1"},Xe={x:192,y:54,w:128,h:74,label:"KEYFRAME N"},hi={x:366,y:54,w:128,h:74,label:"FRESH FRAME"},Oi={x:18,y:176,w:302,h:52,label:"INTERPOLATION"},Ar={x:340,y:150,w:154,h:104,label:"COLLAPSE PREVENTION"};class If extends gn{constructor(t,e){super(t,e),this.fps=15}box(t,e){const n=this.ctx;n.strokeStyle=e>0?jo:Tr,n.globalAlpha=.5+e*.5,n.lineWidth=1,n.strokeRect(t.x+.5,t.y+.5,t.w,t.h),n.globalAlpha=1,n.font=`10px ${Kt}`,n.fillStyle=e>0?Qo:Fi,n.fillText(t.label,t.x+6,t.y+13)}arrow(t,e,n,i,r,o){const a=this.ctx;a.strokeStyle=Tr,a.beginPath(),a.moveTo(t,e),a.lineTo(n,i),a.stroke();const l=Math.sign(n-t||i-e);if(a.fillStyle=Tr,a.beginPath(),e===i?(a.moveTo(n,i),a.lineTo(n-6*l,i-4),a.lineTo(n-6*l,i+4)):(a.moveTo(n,i),a.lineTo(n-4,i-6*l),a.lineTo(n+4,i-6*l)),a.fill(),o>=0&&o<=1){const c=t+(n-t)*o,u=e+(i-e)*o,h=a.createRadialGradient(c,u,0,c,u,8);h.addColorStop(0,"rgba(213,155,255,1)"),h.addColorStop(1,"rgba(213,155,255,0)"),a.fillStyle=h,a.fillRect(c-8,u-8,16,16)}r&&(a.font=`9px ${Kt}`,a.fillStyle=Fi,a.textAlign="center",a.fillText(r,(t+n)/2,e===i?e-6:(e+i)/2),a.textAlign="left")}draw(t){const e=this.ctx;this.clear(Df);const n=this.env.feeds.chronicle.value,i=6,r=t%i/i,o=400+Math.floor(t/i);if(e.font=`14px ${Kt}`,e.fillStyle=jo,e.fillText("dream_gen",18,28),e.font=`10px ${Kt}`,e.fillStyle=Fi,e.fillText("a truly infinite diffusion stream",110,28),e.textAlign="right",e.fillText(`kf ${String(o).padStart(5,"0")}`,It-18,28),e.textAlign="left",this.box(ci,r<.25?1:0),this.box(Xe,r>=.25&&r<.5?1:.2),this.box(hi,0),this.box(Oi,r>=.5?1:0),this.box(Ar,Math.sin(t*.8)>.6?1:0),n.thumb)e.drawImage(n.thumb,Xe.x+6,Xe.y+18,Xe.w-12,(Xe.w-12)/2),e.globalAlpha=.35,e.drawImage(n.thumb,ci.x+6,ci.y+18,ci.w-12,(ci.w-12)/2),e.globalAlpha=1;else for(const h of[ci,Xe]){const d=e.createLinearGradient(h.x,h.y,h.x+h.w,h.y+h.h);d.addColorStop(0,`hsl(${(t*8+h.x)%360} 40% 30%)`),d.addColorStop(1,`hsl(${(t*8+h.x+90)%360} 40% 18%)`),e.fillStyle=d,e.fillRect(h.x+6,h.y+18,h.w-12,(h.w-12)/2)}e.fillStyle="#1b1426",e.fillRect(hi.x+6,hi.y+18,hi.w-12,(hi.w-12)/2),e.fillStyle=Fi,e.font=`9px ${Kt}`,e.fillText("txt2img on swap",hi.x+10,hi.y+50),this.arrow(ci.x+ci.w,91,Xe.x,91,"img2img",r<.25?r/.25:-1),this.arrow(hi.x,91,Xe.x+Xe.w,91,"",-1),this.arrow(Xe.x+Xe.w/2,Xe.y+Xe.h,Xe.x+Xe.w/2,Oi.y,"",r>=.25&&r<.5?(r-.25)/.25:-1);const a=16,l=r>=.5?Math.floor((r-.5)/.5*a):0;for(let h=0;h<a;h++)e.fillStyle=h<l?jo:"#1e1629",e.fillRect(Oi.x+8+h*18,Oi.y+22,14,18);e.fillStyle=Fi,e.font=`9px ${Kt}`,e.textAlign="right",e.fillText(`${l}/${a} → stream`,Oi.x+Oi.w-6,Oi.y+13),e.textAlign="left",[["1 mutation","BEND 0.7"],["2 cache","blend ~60%"],["3 swap","fresh txt2img"]].forEach(([h,d],f)=>{const p=Ar.y+34+f*22;e.fillStyle=Qo,e.font=`10px ${Kt}`,e.fillText(h,Ar.x+8,p),e.fillStyle=Fi,e.fillText(d,Ar.x+78,p)}),e.fillStyle="rgba(20,12,30,0.8)",e.fillRect(0,Vt-110,It,110),e.fillStyle=Tr,e.fillRect(18,Vt-110,It-36,1),e.font=`10px ${Kt}`,e.fillStyle=Fi,e.fillText(n.prompt?`prompt${n.template?` · ${n.template}`:""}`:"prompt",18,Vt-92),e.font=`12px ${Kt}`,e.fillStyle=Qo;const u=n.prompt||"the dreamer is asleep; its last prompt will appear here when the chronicle has one.";this.wrap(u,It-36,5).forEach((h,d)=>e.fillText(h,18,Vt-72+d*15))}}const Cr=new Image;Cr.src="/static/oikos/stage.jpg";const cn=372,hn=186,Zc=(It-cn)/2,Jc=118;class Nf extends gn{constructor(e,n){super(e,n);R(this,"frame",document.createElement("canvas"));R(this,"fctx");R(this,"prev",null);R(this,"cur",null);R(this,"swapAt",0);this.fps=20,this.frame.width=cn,this.frame.height=hn;const i=this.frame.getContext("2d");if(!i)throw new Error("oikos: no 2d context");this.fctx=i}draw(e){const n=this.ctx;this.clear("#120406"),Cr.complete&&Cr.naturalWidth&&(n.globalAlpha=.95,n.drawImage(Cr,0,0,It,Vt),n.globalAlpha=1);const i=this.env.feeds.chronicle.value;i.thumb&&i.thumb!==this.cur&&(this.prev=this.cur,this.cur=i.thumb,this.swapAt=e);const r=this.fctx;if(r.globalCompositeOperation="source-over",r.globalAlpha=1,this.cur){const a=Math.min(1,(e-this.swapAt)/2.5);this.prev&&a<1&&this.kenBurns(this.prev,e-20),r.globalAlpha=this.prev?a:1,this.kenBurns(this.cur,e),r.globalAlpha=1}else this.standIn(e);const o=r.createRadialGradient(cn/2,hn/2,hn*.25,cn/2,hn/2,cn*.56);o.addColorStop(0,"rgba(0,0,0,1)"),o.addColorStop(.72,"rgba(0,0,0,0.9)"),o.addColorStop(1,"rgba(0,0,0,0)"),r.globalCompositeOperation="destination-in",r.fillStyle=o,r.fillRect(0,0,cn,hn),r.globalCompositeOperation="source-over",n.save(),n.globalCompositeOperation="lighter",n.globalAlpha=.18,n.drawImage(this.frame,Zc-30,Jc+hn-20,cn+60,90),n.restore(),n.drawImage(this.frame,Zc,Jc),this.status(e),n.fillStyle="rgba(8,4,4,0.72)",n.fillRect(0,Vt-34,It,34),n.fillStyle="#efe6d2",n.font=`12px ${Kt}`,this.spaced("NOW SHOWING · A DREAM · ALL NIGHT",It/2,Vt-13,3,"center")}kenBurns(e,n){const i=1.06+.05*Math.sin(n*.07),r=Math.sin(n*.05)*10,o=Math.cos(n*.043)*5,a=cn*i,l=hn*i;this.fctx.drawImage(e,(cn-a)/2+r,(hn-l)/2+o,a,l)}standIn(e){const n=this.fctx,i=n.createLinearGradient(0,0,0,hn);i.addColorStop(0,"#3a2440"),i.addColorStop(1,"#170d1c"),n.fillStyle=i,n.fillRect(0,0,cn,hn);const r=[12,330,280,20,350];for(let o=0;o<5;o++){const a=e*(.11+o*.03)+o*1.7,l=cn/2+Math.cos(a)*(60+o*14)*(o%2?1:-1),c=hn/2+Math.sin(a*1.3)*30,u=52+22*Math.sin(a*.7+o),h=n.createRadialGradient(l,c,0,l,c,u);h.addColorStop(0,`hsla(${r[o]} 90% 66% / 0.75)`),h.addColorStop(1,`hsla(${r[o]} 90% 50% / 0)`),n.fillStyle=h,n.fillRect(0,0,cn,hn)}}status(e){const n=this.ctx,i=this.env.feeds.dreams.value,r=this.env.feeds.chronicle.value;n.font=`12px ${Kt}`;let o,a;i.known&&i.awake?(a=Math.sin(e*4)>0?"#ff3b3b":"#6a1010",o=`LIVE  frame ${yf(i.frame)}${i.viewers?`  ·  ${i.viewers} watching`:""}`):i.known?(a="#5a5a5a",o=r.thumb?"asleep  ·  last remembered":"asleep  ·  wakes when watched"):(a="#3a3a3a",o=r.thumb?"last remembered":"no signal  ·  a stand-in");const l=n.measureText(o).width+34;n.fillStyle="rgba(0,0,0,0.55)",n.fillRect(14,14,l,24),n.fillStyle=a,n.beginPath(),n.arc(27,26,4.5,0,Math.PI*2),n.fill(),n.fillStyle="#f2e9dc",n.fillText(o,38,30)}}const Uf="#04060c",jc="#9fc6ff",Zs="#3d5378",Js="#c9d1d9",Ff="#a5e3b5",ta="#ffc387",Qc=[["GET","/api/dreams/status","how it is (never wakes it)"],["WS ","/ws/dreams","the dream itself, h264"],["GET","/api/dreams/stream","MPEG-TS"],["SSE","/api/dreams/sse","events"],["GET","/api/dreams/embed","take it with you"]];class Of extends gn{constructor(e,n){super(e,n);R(this,"askedAt",-10);R(this,"lastRaw");this.fps=12}draw(e){const n=this.ctx;this.clear(Uf);const i=this.env.feeds.dreams.value.raw;i!==this.lastRaw&&(this.lastRaw=i,this.askedAt=e);const r=e-this.askedAt;n.font=`13px ${Kt}`;const o=`curl -s ${location.host}/api/dreams/status`,a=o.slice(0,Math.floor(r*38));if(n.fillStyle=Zs,n.fillText("$",16,28),n.fillStyle=jc,n.fillText(a+(a.length<o.length||Math.floor(e*2)%2?"▌":""),32,28),a.length>=o.length){const c=i?kf(i,11):[[{text:"curl: (52) the dream did not answer",color:"#e58a8a"}]],u=Math.floor((r-o.length/38)*30);c.slice(0,u).forEach((h,d)=>{let f=16;for(const p of h)n.fillStyle=p.color,n.fillText(p.text,f,52+d*17),f+=n.measureText(p.text).width})}const l=Vt-128;n.fillStyle="rgba(159,198,255,0.06)",n.fillRect(10,l-20,It-20,138),n.strokeStyle="rgba(159,198,255,0.25)",n.strokeRect(10.5,l-19.5,It-21,137),n.font=`11px ${Kt}`,n.fillStyle=Zs,n.fillText("ENDPOINTS",20,l-4),Qc.forEach(([c,u,h],d)=>{const f=l+16+d*19,p=Math.floor(e/2.5)%Qc.length===d;n.fillStyle=p?ta:Zs,n.fillText(c,20,f),n.fillStyle=p?"#ffffff":jc,n.fillText(u,58,f),n.fillStyle=Zs,n.fillText(h,250,f)})}}function kf(s,t){const e=[],n=(i,r,o,a)=>{if(e.length>=t)return;const l=[{text:r,color:Js}];o!==null&&l.push({text:`"${o}": `,color:Js});const c=a?"":",";if(i&&typeof i=="object"&&!Array.isArray(i)){const d=Object.entries(i);e.push([...l,{text:"{",color:Js}]),d.forEach(([f,p],x)=>n(p,`${r}  `,f,x===d.length-1)),e.length<t&&e.push([{text:`${r}}${c}`,color:Js}]);return}let u,h;typeof i=="string"?(u=`"${i}"`,h=Ff):Array.isArray(i)?(u=JSON.stringify(i),h=ta):(u=String(i),h=ta),e.push([...l,{text:u,color:h},{text:c,color:Js}])};return n(s,"",null,!0),e.length>=t&&(e[t-1]=[{text:"  …",color:Zs}]),e}const ke={bg:"#181522",screen:"#231f36",fg:"#c9d1d9",dim:"#6e7681",sys:"#8b949e",quit:"#f85149",action:"#a371f7",join:"#3fb950"},th=["#58a6ff","#3fb950","#d29922","#a371f7","#f778ba","#39c5cf","#ff7b72","#7ee787","#ffa657","#79c0ff","#d2a8ff","#56d364"];function Bf(s){let t=0;for(const e of s)t=t*31+e.charCodeAt(0)>>>0;return th[t%th.length]??ke.fg}function zf(s){const t=[{text:`[${s.stamp}] `,color:ke.dim}],e=s.nick,n=s.content;switch(s.type){case"message":t.push({text:`<${e}> `,color:Bf(e)},{text:n,color:ke.fg});break;case"action":t.push({text:`* ${e} ${n}`,color:ke.action});break;case"quit":t.push({text:`⫫ ${e} has quit${n?` (${n})`:""}`,color:ke.quit});break;case"part":t.push({text:`← ${e} has left${n?` (${n})`:""}`,color:ke.sys});break;case"join":t.push({text:`→ ${e} has joined`,color:ke.join});break;case"kick":{const i=s.reason||n;t.push({text:`⚠ ${s.target?`${s.target} was kicked by ${e}`:`${e} kicked someone`}${i?` (${i})`:""}`,color:ke.quit})}break;default:t.push({text:`*** ${n||e}`,color:ke.sys})}return t}const eh=16,rs=16,ea=50;class Hf extends gn{constructor(e,n){super(e,n);R(this,"laidOut",[]);R(this,"seen",-1);this.fps=15}layout(){const e=this.env.feeds.irc.value;e.version!==this.seen&&(this.seen=e.version,this.ctx.font=`12.5px ${Kt}`,this.laidOut=e.lines.map(n=>({rows:this.wrapChunks(zf(n),It-rs*2),at:n.at})))}wrapChunks(e,n){var a;const i=this.ctx,r=[[]];let o=0;for(const l of e)for(const c of l.text.split(/(\s+)/)){if(!c)continue;const u=i.measureText(c).width;o+u>n&&o>0&&c.trim()&&(r.push([{text:"    ",color:l.color}]),o=i.measureText("    ").width),(a=r[r.length-1])==null||a.push({text:c,color:l.color}),o+=u}return r}draw(e){this.layout();const n=this.ctx,i=this.env.feeds.irc.value;this.clear(ke.bg),n.fillStyle=ke.screen,n.fillRect(6,6,It-12,Vt-12),n.fillStyle="rgba(88,166,255,0.1)",n.fillRect(6,6,It-12,28),n.font=`13px ${Kt}`,n.fillStyle="#58a6ff",n.fillText("#aethera",rs,25),n.fillStyle=ke.dim,n.font=`11px ${Kt}`,n.textAlign="right";const r=i.connected?Math.sin(e*3)>-.3?"● live":"○ live":"○ connecting…";n.fillStyle=i.connected?ke.join:ke.dim,n.fillText(r,It-rs,25),n.textAlign="left";const o=i.collapse?Math.min(1,(performance.now()-i.collapse.at)/1500):0;n.font=`12.5px ${Kt}`;const a=[],l=performance.now();for(const h of this.laidOut)for(const d of h.rows)a.push({chunks:d,fresh:Math.max(0,1-(l-h.at)/600)});const c=Math.floor((Vt-ea-12)/eh),u=a.slice(-c);u.length||(n.fillStyle=ke.sys,n.fillText(i.connected?"*** the channel is quiet between fragments":"*** connecting to #aethera…",rs,ea+12)),u.forEach((h,d)=>{let f=rs;const p=ea+12+d*eh,x=o?Math.sin(p*.3+e*40)*8*o*(Math.random()<.3?1:0):0;for(const m of h.chunks)n.fillStyle=o>.2&&Math.random()<o*.4?ke.quit:m.color,n.globalAlpha=1-h.fresh*.6,n.fillText(m.text,f+x,p),f+=n.measureText(m.text).width;n.globalAlpha=1}),i.collapse&&(n.fillStyle=`rgba(248,81,73,${.08*o})`,n.fillRect(0,0,It,Vt),n.fillStyle=ke.quit,n.font=`11px ${Kt}`,n.textAlign="right",n.fillText(`*** ${i.collapse.type}`,It-rs,Vt-14),n.textAlign="left")}}const Gf={pelos:"#8c6a4f",halon:"#6fa8a0",keramai:"#c2803a",chalkis:"#7d4a86",pyrrha:"#d14e3c",elektra:"#e0b33a",daphnaia:"#4e8b4a",ouranis:"#3d5fa8"},nh=[["Arche",null,0],["Ostrakon Row","pelos",60],["Grammateion",null,0],["Pelos Walk","pelos",60],["Eisphora",null,0],["Boreas Gate",null,200],["Halas Steps","halon",100],["Moira",null,0],["Tarichos Street","halon",100],["Limen Approach","halon",120],["Desmoterion",null,0],["Kerameikos Walk","keramai",140],["Pyrphoros",null,150],["Amphora Yard","keramai",140],["Pithos Street","keramai",160],["Eos Gate",null,200],["Chalkeion Gate","chalkis",180],["Grammateion",null,0],["Akmon Court","chalkis",180],["Orichalkon Row","chalkis",200],["Temenos",null,0],["Kaminos Way","pyrrha",220],["Moira",null,0],["Pyrrha Rise","pyrrha",220],["Phlox Avenue","pyrrha",240],["Notos Gate",null,200],["Elektron Quay","elektra",260],["Helios Terrace","elektra",260],["Krene",null,150],["Lampter Mile","elektra",280],["Kerux",null,0],["Daphne Green","daphnaia",300],["Myrtos Park","daphnaia",300],["Grammateion",null,0],["Kotinos Crown","daphnaia",320],["Zephyros Gate",null,200],["Moira",null,0],["Astron Hill","ouranis",350],["Choregia",null,0],["Ouranos Point","ouranis",400]],ui=[{name:"ada",model:!1,color:"#f2efe6"},{name:"claude",model:!0,color:"#d97757"},{name:"tomas",model:!1,color:"#6fb3e0"},{name:"gemma",model:!0,color:"#9be07a"}];function na(s){return s<=10?[10-s,10]:s<=20?[0,10-(s-10)]:s<=30?[s-20,0]:[10,s-30]}const ih=17,Vf=It/2,ia=168;function xn(s,t){const e=(s-5.5)*ih,n=(t-5.5)*ih;return[Vf+(e-n)*.72,ia+(e+n)*.42]}class Wf extends gn{constructor(e,n){super(e,n);R(this,"pos",[0,0,0,0]);R(this,"hop",{seat:0,from:0,left:0,k:0});R(this,"dice",[3,4]);R(this,"owner",new Map);R(this,"log",["A new game begins with 4 players."]);R(this,"turn",0);R(this,"wait",1.2);R(this,"rand",Ii(4242));this.fps=20}say(e){this.log=[...this.log,e].slice(-3)}step(e){var o;if(this.hop.left>0){this.hop.k+=e/.16,this.hop.k>=1&&(this.hop.k=0,this.hop.left--,this.pos[this.hop.seat]=((this.pos[this.hop.seat]??0)+1)%40,this.hop.left===0&&this.land(this.hop.seat));return}if(this.wait-=e,this.wait>0)return;const n=this.turn%ui.length,i=1+Math.floor(this.rand()*6),r=1+Math.floor(this.rand()*6);this.dice=[i,r],this.say(`${(o=ui[n])==null?void 0:o.name} rolls ${i} and ${r}.`),this.hop={seat:n,from:this.pos[n]??0,left:i+r,k:0},this.turn++,this.wait=1.6}land(e){var c,u;const n=this.pos[e]??0,[i,r,o]=nh[n]??["",null,0],a=((c=ui[e])==null?void 0:c.name)??"",l=this.owner.get(n);if(o&&l===void 0&&this.rand()<.75)this.owner.set(n,e),this.say(`${a} buys ${i} for ₯${o}.`);else if(l!==void 0&&l!==e){const h=Math.max(2,Math.round(o/(r?12:8)));this.say(`${a} pays ₯${h} to ${(u=ui[l])==null?void 0:u.name} for ${i}.`)}else i==="Moira"||i==="Grammateion"?this.say(`${a} draws from ${i}.`):i==="Kerux"&&(this.say(`${a} is sent to the Desmoterion.`),this.pos[e]=10);this.owner.size>22&&this.owner.clear()}draw(e,n){var c;this.step(Math.min(n,.2));const i=this.ctx,r=i.createRadialGradient(It/2,ia,40,It/2,ia,It*.7);r.addColorStop(0,"#2a241f"),r.addColorStop(1,"#141210"),i.fillStyle=r,i.fillRect(0,0,It,Vt);const o=[xn(-.4,-.4),xn(11.4,-.4),xn(11.4,11.4),xn(-.4,11.4)];i.fillStyle="rgba(0,0,0,0.45)",i.beginPath(),o.forEach(([u,h],d)=>d?i.lineTo(u,h+8):i.moveTo(u,h+8)),i.fill(),i.fillStyle="#d9ccb2",i.beginPath(),o.forEach(([u,h],d)=>d?i.lineTo(u,h):i.moveTo(u,h)),i.fill();for(let u=0;u<40;u++){const[h,d]=na(u),[,f]=nh[u]??["",null,0],p=[xn(h,d),xn(h+1,d),xn(h+1,d+1),xn(h,d+1)];i.fillStyle=f?Gf[f]??"#efe4cf":u%10===0?"#e6d6b6":"#efe4cf",i.strokeStyle="#7a6a52",i.lineWidth=.7,i.beginPath(),p.forEach(([m,g],S)=>S?i.lineTo(m,g):i.moveTo(m,g)),i.closePath(),i.fill(),i.stroke();const x=this.owner.get(u);if(x!==void 0){const[m,g]=xn(h+.5,d+.5);i.fillStyle=((c=ui[x])==null?void 0:c.color)??"#fff",i.fillRect(m-2,g-5,4,5)}}const[a,l]=xn(5.5,5.5);i.fillStyle="#7a6a52",i.font=`15px ${Kt}`,this.spaced("KLEROS",a,l+5,5,"center"),ui.forEach((u,h)=>{let d=this.pos[h]??0,f=0,[p,x]=na(d);if(this.hop.left>0&&this.hop.seat===h){const[w,y]=na((d+1)%40);p+=(w-p)*this.hop.k,x+=(y-x)*this.hop.k,f=Math.sin(this.hop.k*Math.PI)*9,d=-1}const m=[[.3,.3],[.7,.3],[.3,.7],[.7,.7]][h]??[.5,.5],[g,S]=xn(p+(m[0]??.5),x+(m[1]??.5));i.fillStyle="rgba(0,0,0,0.35)",i.beginPath(),i.ellipse(g,S+1,5,2.5,0,0,Math.PI*2),i.fill(),i.fillStyle=u.color,i.beginPath(),i.arc(g,S-5-f,4.6,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(0,0,0,0.5)",i.stroke()}),this.dice.forEach((u,h)=>this.die(It-70+h*30,22,u,e)),i.font=`11px ${Kt}`,ui.forEach((u,h)=>{const d=26+h*16;i.fillStyle=u.color,i.fillRect(16,d-8,8,8),i.fillStyle=(this.turn-1)%ui.length===h?"#f5ecd9":"#8c826f",i.fillText(`${u.name}${u.model?"  ◆ model":""}`,30,d)}),i.fillStyle="rgba(10,8,6,0.75)",i.fillRect(0,Vt-62,It,62),i.font=`12px ${Kt}`,this.log.forEach((u,h)=>{i.fillStyle=h===this.log.length-1?"#f1e6cc":"#8a7f6a",i.fillText(u,16,Vt-42+h*16)})}die(e,n,i,r){const o=this.ctx,a=this.hop.left>0?Math.sin(r*30)*.15:0;o.save(),o.translate(e,n),o.rotate(a),o.fillStyle="#efe4cf",o.fillRect(-10,-10,20,20),o.fillStyle="#3a2f24";const l={1:[[0,0]],2:[[-5,-5],[5,5]],3:[[-5,-5],[0,0],[5,5]],4:[[-5,-5],[5,-5],[-5,5],[5,5]],5:[[-5,-5],[5,-5],[0,0],[-5,5],[5,5]],6:[[-5,-5],[5,-5],[-5,0],[5,0],[-5,5],[5,5]]};for(const[c,u]of l[i]??[])o.beginPath(),o.arc(c,u,1.8,0,Math.PI*2),o.fill();o.restore()}}class $f extends gn{constructor(e,n){super(e,n);R(this,"body");R(this,"creatureRef");R(this,"stars");R(this,"breaths",[]);this.fps=24;const i=Ii(33);this.stars=Array.from({length:90},()=>({x:i()*It,y:i()*Vt,a:i()*.5+.1})),this.body=rh()}sync(){const e=this.env.feeds.creature.value;e!==this.creatureRef&&(this.creatureRef=e,this.body=e?Xf(e):rh(),this.breaths=Array.from({length:Math.min(4,this.body.edges.length)},(n,i)=>({edge:i*7%Math.max(1,this.body.edges.length),k:0,fwd:!0})))}draw(e,n){this.sync();const i=this.ctx,r=this.body,o=i.createLinearGradient(0,0,0,Vt);o.addColorStop(0,"#070b14"),o.addColorStop(1,"#02030a"),i.fillStyle=o,i.fillRect(0,0,It,Vt);for(const p of this.stars)i.fillStyle=`rgba(200,215,255,${p.a*(.7+.3*Math.sin(e+p.x))})`,i.fillRect(p.x,p.y,1,1);const a=r.born?1.4:.9,l=Math.min(n,.1),c=r.nodes.map((p,x)=>{var S;const m=r.adj[x]??[];let g=0;for(const w of m)g+=Math.sin((((S=r.nodes[w])==null?void 0:S.phase)??0)-p.phase);return p.phase+(p.omega+(m.length?a*g/m.length:0))*l});r.nodes.forEach((p,x)=>{const m=c[x]??p.phase;Math.floor(m/(Math.PI*2))>Math.floor(p.phase/(Math.PI*2))&&(p.flash=1),p.phase=m,p.flash=Math.max(0,p.flash-l*2.2)});const u=e*.18,h=Math.cos(u),d=Math.sin(u),f=r.nodes.map((p,x)=>{const m=Math.sin(e*.9+x)*.02,g=p.x*h-p.z*d,w=2.8/(3.6-(p.x*d+p.z*h));return{x:It/2+g*w*150,y:176+(p.y+m)*w*150,k:w}});i.lineCap="round";for(const p of r.edges){const x=f[p.a],m=f[p.b];!x||!m||(i.strokeStyle=p.elder?"rgba(160,200,235,0.55)":"rgba(140,170,210,0.28)",i.lineWidth=p.elder?1.4:.8,i.beginPath(),i.moveTo(x.x,x.y),i.lineTo(m.x,m.y),i.stroke())}for(const p of this.breaths){const x=r.edges[p.edge];if(!x)continue;if(p.k+=l/.75,p.k>=1){const M=p.fwd?x.b:x.a,E=(r.adj[M]??[]).map(T=>r.edges.findIndex(L=>L.a===M&&L.b===T||L.b===M&&L.a===T)),C=E[Math.floor(Math.random()*E.length)]??p.edge,_=r.edges[C];p.edge=C,p.fwd=_?_.a===M:!0,p.k=0;continue}const m=f[p.fwd?x.a:x.b],g=f[p.fwd?x.b:x.a];if(!m||!g)continue;const S=m.x+(g.x-m.x)*p.k,w=m.y+(g.y-m.y)*p.k,y=i.createRadialGradient(S,w,0,S,w,9);y.addColorStop(0,"rgba(235,245,255,0.95)"),y.addColorStop(1,"rgba(180,220,255,0)"),i.fillStyle=y,i.fillRect(S-9,w-9,18,18)}r.nodes.forEach((p,x)=>{const m=f[x];if(!m)return;const g=p.flash,S=2+m.k*1.2+g*3,w=g>.05?`rgba(255,${Math.round(210-g*40)},${Math.round(120-g*60)},${.6+g*.4})`:"rgba(200,225,255,0.85)";i.strokeStyle=w,i.lineWidth=.8,i.beginPath(),i.moveTo(m.x-S*3,m.y),i.lineTo(m.x+S*3,m.y),i.moveTo(m.x,m.y-S*3),i.lineTo(m.x,m.y+S*3),i.stroke();const y=i.createRadialGradient(m.x,m.y,0,m.x,m.y,S*2.4);y.addColorStop(0,w),y.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=y,i.fillRect(m.x-S*3,m.y-S*3,S*6,S*6)}),i.font=`15px ${Kt}`,i.fillStyle=r.born?"#e6f1ff":"#8190a8",i.fillText(r.name,18,Vt-40),i.font=`11px ${Kt}`,i.fillStyle="#6f7f99",i.fillText(r.age,18,Vt-20),i.textAlign="right",i.fillStyle="#4b5870",i.fillText(r.born?`${r.nodes.length} nodes · ${r.edges.length} strings`:"click to wake it",It-18,Vt-20),i.textAlign="left"}}function sh(s,t){var n,i;const e=Array.from({length:s},()=>[]);for(const r of t)(n=e[r.a])==null||n.push(r.b),(i=e[r.b])==null||i.push(r.a);return e}function Xf(s){const t=new Map(s.nodes.map((c,u)=>[c.id,u])),e=s.nodes.reduce((c,u)=>c+u.x,0)/s.nodes.length,n=s.nodes.reduce((c,u)=>c+u.y,0)/s.nodes.length,i=s.nodes.reduce((c,u)=>c+u.z,0)/s.nodes.length,r=Math.max(1,...s.nodes.map(c=>Math.hypot(c.x-e,c.y-n,c.z-i))),o=s.nodes.map((c,u)=>({x:(c.x-e)/r,y:(c.y-n)/r,z:(c.z-i)/r,phase:u*1.3,omega:2.4+u%5*.21,flash:0})),a=s.edges.map(c=>({a:t.get(c.a)??-1,b:t.get(c.b)??-1,elder:c.age>150})).filter(c=>c.a>=0&&c.b>=0),l=Math.max(s.lifetime,(Date.now()-s.bornAt)/1e3);return{name:s.name,age:`${Yf(l)} old · yours`,born:!0,nodes:o,edges:a,adj:sh(o.length,a)}}function rh(){const s=Ii(9),t=9,e=Array.from({length:t},(i,r)=>{const o=r/t*Math.PI*2;return{x:Math.cos(o)*.8+(s()-.5)*.3,y:(s()-.5)*.9,z:Math.sin(o)*.8,phase:s()*6,omega:2.2+s()*.8,flash:0}}),n=[];for(let i=0;i<t;i++)n.push({a:i,b:(i+1)%t,elder:i%3===0});return n.push({a:0,b:4,elder:!1},{a:2,b:6,elder:!1},{a:3,b:8,elder:!0}),{name:"something stirs",age:"unborn in this browser",born:!1,nodes:e,edges:n,adj:sh(t,n)}}function Yf(s){const t=Math.max(0,Math.floor(s)),e=Math.floor(t/86400),n=Math.floor(t%86400/3600),i=Math.floor(t%3600/60);return e>0?`${e}d ${n}h`:n>0?`${n}h ${i}m`:`${i}m`}const os=new Image;os.src="/static/oikos/boot-logo.webp";class qf extends gn{constructor(e,n){super(e,n);R(this,"specks");this.fps=12;const i=Ii(7);this.specks=Array.from({length:70},()=>({x:i()*It,y:i()*Vt,r:i()*1.2+.3,red:i()<.35,v:i()*4+1}))}draw(e){const n=this.ctx;this.clear("#000");for(const c of this.specks){const u=(c.y-e*c.v+Vt)%Vt;n.fillStyle=c.red?"rgba(170,40,50,0.55)":"rgba(255,255,255,0.28)",n.fillRect(c.x,u,c.r,c.r)}if(os.complete&&os.naturalWidth){const u=210*os.naturalHeight/os.naturalWidth;n.globalAlpha=.92+.08*Math.sin(e*1.3),n.drawImage(os,(It-210)/2,26,210,u),n.globalAlpha=1}n.fillStyle="#7d7d7d",n.font=`13px ${Kt}`,this.spaced("transmissions",It/2,118,3,"center"),n.fillStyle="#262626",n.fillRect(40,132,It-80,1);const i=this.env.dir.posts.slice(0,6);if(!i.length){n.fillStyle="#9a9a9a",n.font=`16px ${Kt}`,n.textAlign="center",n.fillText(`no transmissions yet${Math.floor(e*2)%2?"_":" "}`,It/2,230),n.textAlign="left";return}const r=3.6,o=Math.floor(e/r)%i.length,a=e%r/r;i.forEach((c,u)=>{const h=162+u*29,d=u===o;n.font=`11px ${Kt}`,n.fillStyle=d?"#bdbdbd":"#555",n.fillText(c.date,46,h),n.font=`16px ${Yc}`,n.fillStyle=d?"#ffffff":"#9a9a9a";const f=c.title.length>38?`${c.title.slice(0,37)}…`:c.title;n.fillText(f,132,h),d&&this.star(28,h-5,e)});const l=i[o];if(l!=null&&l.excerpt){n.font=`italic 12px ${Kt}`,n.fillStyle="#8a8a8a";const c=Math.floor(Math.min(1,a*1.6)*l.excerpt.length);this.wrap(l.excerpt.slice(0,c),It-92,2).forEach((h,d)=>n.fillText(h,46,344+d*16))}}star(e,n,i){const r=this.ctx,o=7+Math.sin(i*5)*1.2;r.save(),r.translate(e,n),r.rotate(i*.8),r.fillStyle="#fff",r.shadowColor="#fff",r.shadowBlur=10,r.beginPath();for(let a=0;a<16;a++){const l=a/16*Math.PI*2,c=a%2?o*.28:a%4?o*.7:o;r.lineTo(Math.cos(l)*c,Math.sin(l)*c)}r.closePath(),r.fill(),r.restore()}}const Kf={transmissions:qf,dreams:Nf,chronicle:Pf,"dreams-api":Of,apeiron:Cf,syrinx:$f,afterlife:bf,irc:Hf,parlor:Wf,dream_gen:If};class Zf extends gn{draw(t){const e=this.ctx,n=["#c0c0c0","#c0c000","#00c0c0","#00c000","#c000c0","#c00000","#0000c0"];n.forEach((i,r)=>{e.fillStyle=i,e.fillRect(r*It/n.length,0,It/n.length+1,Vt*.66)}),e.fillStyle="#111",e.fillRect(0,Vt*.66,It,Vt*.34),e.fillStyle="#fff",e.font=`22px ${Kt}`,e.textAlign="center",e.fillText(this.site.title,It/2,Vt*.82),e.font=`12px ${Kt}`,e.fillStyle=Math.floor(t)%2?"#888":"#555",e.fillText("no programme yet",It/2,Vt*.92),e.textAlign="left"}}function Jf(s,t){const e=Kf[s.id]??Zf;return new e(s,t)}const Rr={dreams:{angle:0,r:4.9,y:.5,style:"tv",screenW:2,channel:1},chronicle:{angle:-19.5,r:5.35,y:1.25,style:"black",screenW:1,feeds:"dreams",channel:3},"dreams-api":{angle:19.5,r:5.35,y:1.25,style:"grey",screenW:.85,feeds:"dreams",channel:4},transmissions:{angle:-30,r:4.5,y:.34,style:"beige",screenW:1.22,stand:!0,channel:2},afterlife:{angle:30,r:4.5,y:0,style:"black",screenW:1.08,channel:10},apeiron:{angle:-56,r:4.2,y:0,style:"black",screenW:1.15,channel:5},irc:{angle:-56,r:4.2,y:0,style:"beige",screenW:.95,on:"apeiron",channel:6},syrinx:{angle:56,r:4.2,y:.28,style:"grey",screenW:1.08,channel:7},parlor:{angle:-18,r:6.8,y:3.9,style:"beige",screenW:1.1,hang:!0,channel:9}};function jf(s,t){const e=Rr[s];if(e)return e;const n=Math.floor(t/2)+1;return{angle:(t%2?1:-1)*(68+n*10),r:5.4,y:0,style:"grey",screenW:1,channel:12+t}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const sa="185",as={ROTATE:0,DOLLY:1,PAN:2},ls={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Qf=0,oh=1,tp=2,Pr=1,ep=2,js=3,di=0,Ye=1,Wn=2,Pn=0,cs=1,Lr=2,ah=3,lh=4,np=5,ki=100,ip=101,sp=102,rp=103,op=104,ap=200,lp=201,cp=202,hp=203,ra=204,oa=205,up=206,dp=207,fp=208,pp=209,mp=210,gp=211,xp=212,vp=213,_p=214,aa=0,la=1,ca=2,hs=3,ha=4,ua=5,da=6,fa=7,ch=0,yp=1,Mp=2,Ln=0,pa=1,ma=2,ga=3,Dr=4,xa=5,va=6,_a=7,hh=300,Bi=301,us=302,ya=303,Ma=304,Ir=306,Nr=1e3,$n=1001,ba=1002,Be=1003,bp=1004,Ur=1005,ze=1006,Sa=1007,zi=1008,nn=1009,uh=1010,dh=1011,Qs=1012,wa=1013,Dn=1014,vn=1015,sn=1016,Ea=1017,Ta=1018,tr=1020,fh=35902,ph=35899,mh=1021,gh=1022,_n=1023,Xn=1026,Hi=1027,Aa=1028,Ca=1029,Gi=1030,Ra=1031,Pa=1033,Fr=33776,Or=33777,kr=33778,Br=33779,La=35840,Da=35841,Ia=35842,Na=35843,Ua=36196,Fa=37492,Oa=37496,ka=37488,Ba=37489,zr=37490,za=37491,Ha=37808,Ga=37809,Va=37810,Wa=37811,$a=37812,Xa=37813,Ya=37814,qa=37815,Ka=37816,Za=37817,Ja=37818,ja=37819,Qa=37820,tl=37821,el=36492,nl=36494,il=36495,sl=36283,rl=36284,Hr=36285,ol=36286,Sp=3200,al=0,wp=1,fi="",Ue="srgb",er="srgb-linear",Gr="linear",se="srgb",ds=7680,xh=519,Ep=512,Tp=513,Ap=514,ll=515,Cp=516,Rp=517,cl=518,Pp=519,vh=35044,_h="300 es",In=2e3,nr=2001;function Lp(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Vr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Dp(){const s=Vr("canvas");return s.style.display="block",s}const yh={};function Mh(...s){const t="THREE."+s.shift();console.log(t,...s)}function bh(s){const t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Ut(...s){s=bh(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function te(...s){s=bh(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function fs(...s){const t=s.join(" ");t in yh||(yh[t]=!0,Ut(...s))}function Ip(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Np={[aa]:la,[ca]:da,[ha]:fa,[hs]:ua,[la]:aa,[da]:ca,[fa]:ha,[ua]:hs};class pi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}}const Ge=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Sh=1234567;const ir=Math.PI/180,ps=180/Math.PI;function ms(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ge[s&255]+Ge[s>>8&255]+Ge[s>>16&255]+Ge[s>>24&255]+"-"+Ge[t&255]+Ge[t>>8&255]+"-"+Ge[t>>16&15|64]+Ge[t>>24&255]+"-"+Ge[e&63|128]+Ge[e>>8&255]+"-"+Ge[e>>16&255]+Ge[e>>24&255]+Ge[n&255]+Ge[n>>8&255]+Ge[n>>16&255]+Ge[n>>24&255]).toLowerCase()}function Xt(s,t,e){return Math.max(t,Math.min(e,s))}function hl(s,t){return(s%t+t)%t}function Up(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Fp(s,t,e){return s!==t?(e-s)/(t-s):0}function sr(s,t,e){return(1-e)*s+e*t}function Op(s,t,e,n){return sr(s,t,1-Math.exp(-e*n))}function kp(s,t=1){return t-Math.abs(hl(s,t*2)-t)}function Bp(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function zp(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Hp(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Gp(s,t){return s+Math.random()*(t-s)}function Vp(s){return s*(.5-Math.random())}function Wp(s){s!==void 0&&(Sh=s);let t=Sh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function $p(s){return s*ir}function Xp(s){return s*ps}function Yp(s){return(s&s-1)===0&&s!==0}function qp(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Kp(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Zp(s,t,e,n,i){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),u=o((t+n)/2),h=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),p=o((n-t)/2);switch(i){case"XYX":s.set(a*u,l*h,l*d,a*c);break;case"YZY":s.set(l*d,a*u,l*h,a*c);break;case"ZXZ":s.set(l*h,l*d,a*u,a*c);break;case"XZX":s.set(a*u,l*p,l*f,a*c);break;case"YXY":s.set(l*f,a*u,l*p,a*c);break;case"ZYZ":s.set(l*p,l*f,a*u,a*c);break;default:Ut("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function gs(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function qe(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Wr={DEG2RAD:ir,RAD2DEG:ps,generateUUID:ms,clamp:Xt,euclideanModulo:hl,mapLinear:Up,inverseLerp:Fp,lerp:sr,damp:Op,pingpong:kp,smoothstep:Bp,smootherstep:zp,randInt:Hp,randFloat:Gp,randFloatSpread:Vp,seededRandom:Wp,degToRad:$p,radToDeg:Xp,isPowerOfTwo:Yp,ceilPowerOfTwo:qp,floorPowerOfTwo:Kp,setQuaternionFromProperEuler:Zp,normalize:qe,denormalize:gs},Ec=class Ec{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Ec.prototype.isVector2=!0;let ut=Ec;class Nn{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],u=n[i+2],h=n[i+3],d=r[o+0],f=r[o+1],p=r[o+2],x=r[o+3];if(h!==x||l!==d||c!==f||u!==p){let m=l*d+c*f+u*p+h*x;m<0&&(d=-d,f=-f,p=-p,x=-x,m=-m);let g=1-a;if(m<.9995){const S=Math.acos(m),w=Math.sin(S);g=Math.sin(g*S)/w,a=Math.sin(a*S)/w,l=l*g+d*a,c=c*g+f*a,u=u*g+p*a,h=h*g+x*a}else{l=l*g+d*a,c=c*g+f*a,u=u*g+p*a,h=h*g+x*a;const S=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=S,c*=S,u*=S,h*=S}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],u=n[i+3],h=r[o],d=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+u*h+l*f-c*d,t[e+1]=l*p+u*d+c*h-a*f,t[e+2]=c*p+u*f+a*d-l*h,t[e+3]=u*p-a*h-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(i/2),h=a(r/2),d=l(n/2),f=l(i/2),p=l(r/2);switch(o){case"XYZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"YXZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"ZXY":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"ZYX":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"YZX":this._x=d*u*h+c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h-d*f*p;break;case"XZY":this._x=d*u*h-c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h+d*f*p;break;default:Ut("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=n+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>h){const f=2*Math.sqrt(1+n-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>h){const f=2*Math.sqrt(1+a-n-h);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+i*c-r*l,this._y=i*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-i*a,this._w=o*u-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,i=-i,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){const c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,e=Math.sin(e*c)/u,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Tc=class Tc{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(wh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(wh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),u=2*(a*e-r*i),h=2*(r*n-o*e);return this.x=e+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=i+l*h+r*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ul.copy(this).projectOnVector(t),this.sub(ul)}reflect(t){return this.sub(ul.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Tc.prototype.isVector3=!0;let P=Tc;const ul=new P,wh=new Nn,Ac=class Ac{constructor(t,e,n,i,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){const u=this.elements;return u[0]=t,u[1]=i,u[2]=a,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],p=n[8],x=i[0],m=i[3],g=i[6],S=i[1],w=i[4],y=i[7],M=i[2],E=i[5],C=i[8];return r[0]=o*x+a*S+l*M,r[3]=o*m+a*w+l*E,r[6]=o*g+a*y+l*C,r[1]=c*x+u*S+h*M,r[4]=c*m+u*w+h*E,r[7]=c*g+u*y+h*C,r[2]=d*x+f*S+p*M,r[5]=d*m+f*w+p*E,r[8]=d*g+f*y+p*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*r*u+n*a*l+i*r*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=u*o-a*c,d=a*l-u*r,f=c*r-o*l,p=e*h+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/p;return t[0]=h*x,t[1]=(i*c-u*n)*x,t[2]=(a*n-i*o)*x,t[3]=d*x,t[4]=(u*e-i*l)*x,t[5]=(i*r-a*e)*x,t[6]=f*x,t[7]=(n*l-c*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return fs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(dl.makeScale(t,e)),this}rotate(t){return fs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(dl.makeRotation(-t)),this}translate(t,e){return fs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(dl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Ac.prototype.isMatrix3=!0;let zt=Ac;const dl=new zt,Eh=new zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Th=new zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Jp(){const s={enabled:!0,workingColorSpace:er,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===se&&(i.r=Yn(i.r),i.g=Yn(i.g),i.b=Yn(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===se&&(i.r=xs(i.r),i.g=xs(i.g),i.b=xs(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===fi?Gr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return fs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return fs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[er]:{primaries:t,whitePoint:n,transfer:Gr,toXYZ:Eh,fromXYZ:Th,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ue},outputColorSpaceConfig:{drawingBufferColorSpace:Ue}},[Ue]:{primaries:t,whitePoint:n,transfer:se,toXYZ:Eh,fromXYZ:Th,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ue}}}),s}const Jt=Jp();function Yn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function xs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let vs;class jp{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{vs===void 0&&(vs=Vr("canvas")),vs.width=t.width,vs.height=t.height;const i=vs.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=vs}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Vr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Yn(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Yn(e[n]/255)*255):e[n]=Yn(e[n]);return{data:e,width:t.width,height:t.height}}else return Ut("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Qp=0;class fl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Qp++}),this.uuid=ms(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(pl(i[o].image)):r.push(pl(i[o]))}else r=pl(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function pl(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?jp.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Ut("Texture: Unable to serialize Texture."),{})}let tm=0;const ml=new P;class Ve extends pi{constructor(t=Ve.DEFAULT_IMAGE,e=Ve.DEFAULT_MAPPING,n=$n,i=$n,r=ze,o=zi,a=_n,l=nn,c=Ve.DEFAULT_ANISOTROPY,u=fi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:tm++}),this.uuid=ms(),this.name="",this.source=new fl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ut(0,0),this.repeat=new ut(1,1),this.center=new ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(ml).x}get height(){return this.source.getSize(ml).y}get depth(){return this.source.getSize(ml).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Ut(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){Ut(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==hh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Nr:t.x=t.x-Math.floor(t.x);break;case $n:t.x=t.x<0?0:1;break;case ba:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Nr:t.y=t.y-Math.floor(t.y);break;case $n:t.y=t.y<0?0:1;break;case ba:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ve.DEFAULT_IMAGE=null,Ve.DEFAULT_MAPPING=hh,Ve.DEFAULT_ANISOTROPY=1;const Cc=class Cc{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],p=l[9],x=l[2],m=l[6],g=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-x)<.01&&Math.abs(p-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+x)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const w=(c+1)/2,y=(f+1)/2,M=(g+1)/2,E=(u+d)/4,C=(h+x)/4,_=(p+m)/4;return w>y&&w>M?w<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(w),i=E/n,r=C/n):y>M?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=E/i,r=_/i):M<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(M),n=C/r,i=_/r),this.set(n,i,r,e),this}let S=Math.sqrt((m-p)*(m-p)+(h-x)*(h-x)+(d-u)*(d-u));return Math.abs(S)<.001&&(S=1),this.x=(m-p)/S,this.y=(h-x)/S,this.z=(d-u)/S,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this.w=Xt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this.w=Xt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Cc.prototype.isVector4=!0;let _e=Cc;class em extends pi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ze,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new _e(0,0,t,e),this.scissorTest=!1,this.viewport=new _e(0,0,t,e),this.textures=[];const i={width:t,height:e,depth:n.depth},r=new Ve(i),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:ze,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new fl(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ze extends em{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Ah extends Ve{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Be,this.minFilter=Be,this.wrapR=$n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class nm extends Ve{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Be,this.minFilter=Be,this.wrapR=$n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const No=class No{constructor(t,e,n,i,r,o,a,l,c,u,h,d,f,p,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,u,h,d,f,p,x,m)}set(t,e,n,i,r,o,a,l,c,u,h,d,f,p,x,m){const g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=i,g[1]=r,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=u,g[10]=h,g[14]=d,g[3]=f,g[7]=p,g[11]=x,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new No().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,i=1/_s.setFromMatrixColumn(t,0).length(),r=1/_s.setFromMatrixColumn(t,1).length(),o=1/_s.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){const d=o*u,f=o*h,p=a*u,x=a*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=f+p*c,e[5]=d-x*c,e[9]=-a*l,e[2]=x-d*c,e[6]=p+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*u,f=l*h,p=c*u,x=c*h;e[0]=d+x*a,e[4]=p*a-f,e[8]=o*c,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=f*a-p,e[6]=x+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*u,f=l*h,p=c*u,x=c*h;e[0]=d-x*a,e[4]=-o*h,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*u,e[9]=x-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*u,f=o*h,p=a*u,x=a*h;e[0]=l*u,e[4]=p*c-f,e[8]=d*c+x,e[1]=l*h,e[5]=x*c+d,e[9]=f*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,p=a*l,x=a*c;e[0]=l*u,e[4]=x-d*h,e[8]=p*h+f,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=f*h+p,e[10]=d-x*h}else if(t.order==="XZY"){const d=o*l,f=o*c,p=a*l,x=a*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+x,e[5]=o*u,e[9]=f*h-p,e[2]=p*h-f,e[6]=a*u,e[10]=x*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(im,t,sm)}lookAt(t,e,n){const i=this.elements;return rn.subVectors(t,e),rn.lengthSq()===0&&(rn.z=1),rn.normalize(),mi.crossVectors(n,rn),mi.lengthSq()===0&&(Math.abs(n.z)===1?rn.x+=1e-4:rn.z+=1e-4,rn.normalize(),mi.crossVectors(n,rn)),mi.normalize(),$r.crossVectors(rn,mi),i[0]=mi.x,i[4]=$r.x,i[8]=rn.x,i[1]=mi.y,i[5]=$r.y,i[9]=rn.y,i[2]=mi.z,i[6]=$r.z,i[10]=rn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],p=n[2],x=n[6],m=n[10],g=n[14],S=n[3],w=n[7],y=n[11],M=n[15],E=i[0],C=i[4],_=i[8],T=i[12],L=i[1],D=i[5],U=i[9],K=i[13],Z=i[2],N=i[6],W=i[10],B=i[14],X=i[3],nt=i[7],ot=i[11],at=i[15];return r[0]=o*E+a*L+l*Z+c*X,r[4]=o*C+a*D+l*N+c*nt,r[8]=o*_+a*U+l*W+c*ot,r[12]=o*T+a*K+l*B+c*at,r[1]=u*E+h*L+d*Z+f*X,r[5]=u*C+h*D+d*N+f*nt,r[9]=u*_+h*U+d*W+f*ot,r[13]=u*T+h*K+d*B+f*at,r[2]=p*E+x*L+m*Z+g*X,r[6]=p*C+x*D+m*N+g*nt,r[10]=p*_+x*U+m*W+g*ot,r[14]=p*T+x*K+m*B+g*at,r[3]=S*E+w*L+y*Z+M*X,r[7]=S*C+w*D+y*N+M*nt,r[11]=S*_+w*U+y*W+M*ot,r[15]=S*T+w*K+y*B+M*at,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],f=t[14],p=t[3],x=t[7],m=t[11],g=t[15],S=l*f-c*d,w=a*f-c*h,y=a*d-l*h,M=o*f-c*u,E=o*d-l*u,C=o*h-a*u;return e*(x*S-m*w+g*y)-n*(p*S-m*M+g*E)+i*(p*w-x*M+g*C)-r*(p*y-x*E+m*C)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],u=t[10];return e*(o*u-a*c)-n*(r*u-a*l)+i*(r*c-o*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],f=t[11],p=t[12],x=t[13],m=t[14],g=t[15],S=e*a-n*o,w=e*l-i*o,y=e*c-r*o,M=n*l-i*a,E=n*c-r*a,C=i*c-r*l,_=u*x-h*p,T=u*m-d*p,L=u*g-f*p,D=h*m-d*x,U=h*g-f*x,K=d*g-f*m,Z=S*K-w*U+y*D+M*L-E*T+C*_;if(Z===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/Z;return t[0]=(a*K-l*U+c*D)*N,t[1]=(i*U-n*K-r*D)*N,t[2]=(x*C-m*E+g*M)*N,t[3]=(d*E-h*C-f*M)*N,t[4]=(l*L-o*K-c*T)*N,t[5]=(e*K-i*L+r*T)*N,t[6]=(m*y-p*C-g*w)*N,t[7]=(u*C-d*y+f*w)*N,t[8]=(o*U-a*L+c*_)*N,t[9]=(n*L-e*U-r*_)*N,t[10]=(p*E-x*y+g*S)*N,t[11]=(h*y-u*E-f*S)*N,t[12]=(a*T-o*D-l*_)*N,t[13]=(e*D-n*T+i*_)*N,t[14]=(x*w-p*M-m*S)*N,t[15]=(u*M-h*w+d*S)*N,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,u*a+n,u*l-i*o,0,c*l-i*a,u*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,u=o+o,h=a+a,d=r*c,f=r*u,p=r*h,x=o*u,m=o*h,g=a*h,S=l*c,w=l*u,y=l*h,M=n.x,E=n.y,C=n.z;return i[0]=(1-(x+g))*M,i[1]=(f+y)*M,i[2]=(p-w)*M,i[3]=0,i[4]=(f-y)*E,i[5]=(1-(d+g))*E,i[6]=(m+S)*E,i[7]=0,i[8]=(p+w)*C,i[9]=(m-S)*C,i[10]=(1-(d+x))*C,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=_s.set(i[0],i[1],i[2]).length();const a=_s.set(i[4],i[5],i[6]).length(),l=_s.set(i[8],i[9],i[10]).length();r<0&&(o=-o),yn.copy(this);const c=1/o,u=1/a,h=1/l;return yn.elements[0]*=c,yn.elements[1]*=c,yn.elements[2]*=c,yn.elements[4]*=u,yn.elements[5]*=u,yn.elements[6]*=u,yn.elements[8]*=h,yn.elements[9]*=h,yn.elements[10]*=h,e.setFromRotationMatrix(yn),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,i,r,o,a=In,l=!1){const c=this.elements,u=2*r/(e-t),h=2*r/(n-i),d=(e+t)/(e-t),f=(n+i)/(n-i);let p,x;if(l)p=r/(o-r),x=o*r/(o-r);else if(a===In)p=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===nr)p=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=In,l=!1){const c=this.elements,u=2/(e-t),h=2/(n-i),d=-(e+t)/(e-t),f=-(n+i)/(n-i);let p,x;if(l)p=1/(o-r),x=o/(o-r);else if(a===In)p=-2/(o-r),x=-(o+r)/(o-r);else if(a===nr)p=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};No.prototype.isMatrix4=!0;let re=No;const _s=new P,yn=new re,im=new P(0,0,0),sm=new P(1,1,1),mi=new P,$r=new P,rn=new P,Ch=new re,Rh=new Nn;class qn{constructor(t=0,e=0,n=0,i=qn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],u=i[9],h=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Xt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Xt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Xt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Xt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Xt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Ut("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ch.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ch,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Rh.setFromEuler(this),this.setFromQuaternion(Rh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}qn.DEFAULT_ORDER="XYZ";class gl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let rm=0;const Ph=new P,ys=new Nn,Kn=new re,Xr=new P,rr=new P,om=new P,am=new Nn,Lh=new P(1,0,0),Dh=new P(0,1,0),Ih=new P(0,0,1),Nh={type:"added"},lm={type:"removed"},Ms={type:"childadded",child:null},xl={type:"childremoved",child:null};class Ae extends pi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rm++}),this.uuid=ms(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ae.DEFAULT_UP.clone();const t=new P,e=new qn,n=new Nn,i=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new re},normalMatrix:{value:new zt}}),this.matrix=new re,this.matrixWorld=new re,this.matrixAutoUpdate=Ae.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ae.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ys.setFromAxisAngle(t,e),this.quaternion.multiply(ys),this}rotateOnWorldAxis(t,e){return ys.setFromAxisAngle(t,e),this.quaternion.premultiply(ys),this}rotateX(t){return this.rotateOnAxis(Lh,t)}rotateY(t){return this.rotateOnAxis(Dh,t)}rotateZ(t){return this.rotateOnAxis(Ih,t)}translateOnAxis(t,e){return Ph.copy(t).applyQuaternion(this.quaternion),this.position.add(Ph.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Lh,t)}translateY(t){return this.translateOnAxis(Dh,t)}translateZ(t){return this.translateOnAxis(Ih,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Kn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Xr.copy(t):Xr.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),rr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Kn.lookAt(rr,Xr,this.up):Kn.lookAt(Xr,rr,this.up),this.quaternion.setFromRotationMatrix(Kn),i&&(Kn.extractRotation(i.matrixWorld),ys.setFromRotationMatrix(Kn),this.quaternion.premultiply(ys.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(te("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Nh),Ms.child=t,this.dispatchEvent(Ms),Ms.child=null):te("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(lm),xl.child=t,this.dispatchEvent(xl),xl.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Kn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Kn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Kn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Nh),Ms.child=t,this.dispatchEvent(Ms),Ms.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rr,t,om),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rr,am,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(t.shapes,h)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}Ae.DEFAULT_UP=new P(0,1,0),Ae.DEFAULT_MATRIX_AUTO_UPDATE=!0,Ae.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Zn extends Ae{constructor(){super(),this.isGroup=!0,this.type="Group"}}const cm={type:"move"};class vl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Zn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Zn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Zn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const x of t.hand.values()){const m=e.getJointPose(x,n),g=this._getHandJoint(c,x);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(cm)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Zn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Uh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},gi={h:0,s:0,l:0},Yr={h:0,s:0,l:0};function _l(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Bt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ue){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Jt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=Jt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Jt.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=Jt.workingColorSpace){if(t=hl(t,1),e=Xt(e,0,1),n=Xt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=_l(o,r,t+1/3),this.g=_l(o,r,t),this.b=_l(o,r,t-1/3)}return Jt.colorSpaceToWorking(this,i),this}setStyle(t,e=Ue){function n(r){r!==void 0&&parseFloat(r)<1&&Ut("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Ut("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Ut("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ue){const n=Uh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Ut("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Yn(t.r),this.g=Yn(t.g),this.b=Yn(t.b),this}copyLinearToSRGB(t){return this.r=xs(t.r),this.g=xs(t.g),this.b=xs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ue){return Jt.workingToColorSpace(We.copy(this),t),Math.round(Xt(We.r*255,0,255))*65536+Math.round(Xt(We.g*255,0,255))*256+Math.round(Xt(We.b*255,0,255))}getHexString(t=Ue){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Jt.workingColorSpace){Jt.workingToColorSpace(We.copy(this),e);const n=We.r,i=We.g,r=We.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(i-r)/h+(i<r?6:0);break;case i:l=(r-n)/h+2;break;case r:l=(n-i)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=Jt.workingColorSpace){return Jt.workingToColorSpace(We.copy(this),e),t.r=We.r,t.g=We.g,t.b=We.b,t}getStyle(t=Ue){Jt.workingToColorSpace(We.copy(this),t);const e=We.r,n=We.g,i=We.b;return t!==Ue?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(gi),this.setHSL(gi.h+t,gi.s+e,gi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(gi),t.getHSL(Yr);const n=sr(gi.h,Yr.h,e),i=sr(gi.s,Yr.s,e),r=sr(gi.l,Yr.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const We=new Bt;Bt.NAMES=Uh;class yl{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Bt(t),this.density=e}clone(){return new yl(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class hm extends Ae{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new qn,this.environmentIntensity=1,this.environmentRotation=new qn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Mn=new P,Jn=new P,Ml=new P,jn=new P,bs=new P,Ss=new P,Fh=new P,bl=new P,Sl=new P,wl=new P,El=new _e,Tl=new _e,Al=new _e;class bn{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Mn.subVectors(t,e),i.cross(Mn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Mn.subVectors(i,e),Jn.subVectors(n,e),Ml.subVectors(t,e);const o=Mn.dot(Mn),a=Mn.dot(Jn),l=Mn.dot(Ml),c=Jn.dot(Jn),u=Jn.dot(Ml),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(c*l-a*u)*d,p=(o*u-a*l)*d;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,jn)===null?!1:jn.x>=0&&jn.y>=0&&jn.x+jn.y<=1}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,jn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,jn.x),l.addScaledVector(o,jn.y),l.addScaledVector(a,jn.z),l)}static getInterpolatedAttribute(t,e,n,i,r,o){return El.setScalar(0),Tl.setScalar(0),Al.setScalar(0),El.fromBufferAttribute(t,e),Tl.fromBufferAttribute(t,n),Al.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(El,r.x),o.addScaledVector(Tl,r.y),o.addScaledVector(Al,r.z),o}static isFrontFacing(t,e,n,i){return Mn.subVectors(n,e),Jn.subVectors(t,e),Mn.cross(Jn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Mn.subVectors(this.c,this.b),Jn.subVectors(this.a,this.b),Mn.cross(Jn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return bn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return bn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return bn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return bn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return bn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let o,a;bs.subVectors(i,n),Ss.subVectors(r,n),bl.subVectors(t,n);const l=bs.dot(bl),c=Ss.dot(bl);if(l<=0&&c<=0)return e.copy(n);Sl.subVectors(t,i);const u=bs.dot(Sl),h=Ss.dot(Sl);if(u>=0&&h<=u)return e.copy(i);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(n).addScaledVector(bs,o);wl.subVectors(t,r);const f=bs.dot(wl),p=Ss.dot(wl);if(p>=0&&f<=p)return e.copy(r);const x=f*c-l*p;if(x<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(n).addScaledVector(Ss,a);const m=u*p-f*h;if(m<=0&&h-u>=0&&f-p>=0)return Fh.subVectors(r,i),a=(h-u)/(h-u+(f-p)),e.copy(i).addScaledVector(Fh,a);const g=1/(m+x+d);return o=x*g,a=d*g,e.copy(n).addScaledVector(bs,o).addScaledVector(Ss,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Vi{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Sn):Sn.fromBufferAttribute(r,o),Sn.applyMatrix4(t.matrixWorld),this.expandByPoint(Sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),qr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),qr.copy(n.boundingBox)),qr.applyMatrix4(t.matrixWorld),this.union(qr)}const i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Sn),Sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(or),Kr.subVectors(this.max,or),ws.subVectors(t.a,or),Es.subVectors(t.b,or),Ts.subVectors(t.c,or),xi.subVectors(Es,ws),vi.subVectors(Ts,Es),Wi.subVectors(ws,Ts);let e=[0,-xi.z,xi.y,0,-vi.z,vi.y,0,-Wi.z,Wi.y,xi.z,0,-xi.x,vi.z,0,-vi.x,Wi.z,0,-Wi.x,-xi.y,xi.x,0,-vi.y,vi.x,0,-Wi.y,Wi.x,0];return!Cl(e,ws,Es,Ts,Kr)||(e=[1,0,0,0,1,0,0,0,1],!Cl(e,ws,Es,Ts,Kr))?!1:(Zr.crossVectors(xi,vi),e=[Zr.x,Zr.y,Zr.z],Cl(e,ws,Es,Ts,Kr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Qn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Qn=[new P,new P,new P,new P,new P,new P,new P,new P],Sn=new P,qr=new Vi,ws=new P,Es=new P,Ts=new P,xi=new P,vi=new P,Wi=new P,or=new P,Kr=new P,Zr=new P,$i=new P;function Cl(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){$i.fromArray(s,r);const a=i.x*Math.abs($i.x)+i.y*Math.abs($i.y)+i.z*Math.abs($i.z),l=t.dot($i),c=e.dot($i),u=n.dot($i);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const Ce=new P,Jr=new ut;let um=0;class un extends pi{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:um++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=vh,this.updateRanges=[],this.gpuType=vn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Jr.fromBufferAttribute(this,e),Jr.applyMatrix3(t),this.setXY(e,Jr.x,Jr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix3(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix4(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.applyNormalMatrix(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.transformDirection(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=gs(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=qe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=gs(e,this.array)),e}setX(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=gs(e,this.array)),e}setY(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=gs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=gs(e,this.array)),e}setW(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array),i=qe(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array),i=qe(i,this.array),r=qe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==vh&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class Oh extends un{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class kh extends un{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class xe extends un{constructor(t,e,n){super(new Float32Array(t),e,n)}}const dm=new Vi,ar=new P,Rl=new P;class As{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):dm.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ar.subVectors(t,this.center);const e=ar.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(ar,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Rl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ar.copy(t.center).add(Rl)),this.expandByPoint(ar.copy(t.center).sub(Rl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let fm=0;const dn=new re,Pl=new Ae,Cs=new P,on=new Vi,lr=new Vi,Fe=new P;class He extends pi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:fm++}),this.uuid=ms(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Lp(t)?kh:Oh)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new zt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return dn.makeRotationFromQuaternion(t),this.applyMatrix4(dn),this}rotateX(t){return dn.makeRotationX(t),this.applyMatrix4(dn),this}rotateY(t){return dn.makeRotationY(t),this.applyMatrix4(dn),this}rotateZ(t){return dn.makeRotationZ(t),this.applyMatrix4(dn),this}translate(t,e,n){return dn.makeTranslation(t,e,n),this.applyMatrix4(dn),this}scale(t,e,n){return dn.makeScale(t,e,n),this.applyMatrix4(dn),this}lookAt(t){return Pl.lookAt(t),Pl.updateMatrix(),this.applyMatrix4(Pl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Cs).negate(),this.translate(Cs.x,Cs.y,Cs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new xe(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&Ut("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){te("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];on.setFromBufferAttribute(r),this.morphTargetsRelative?(Fe.addVectors(this.boundingBox.min,on.min),this.boundingBox.expandByPoint(Fe),Fe.addVectors(this.boundingBox.max,on.max),this.boundingBox.expandByPoint(Fe)):(this.boundingBox.expandByPoint(on.min),this.boundingBox.expandByPoint(on.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&te('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new As);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){te("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){const n=this.boundingSphere.center;if(on.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];lr.setFromBufferAttribute(a),this.morphTargetsRelative?(Fe.addVectors(on.min,lr.min),on.expandByPoint(Fe),Fe.addVectors(on.max,lr.max),on.expandByPoint(Fe)):(on.expandByPoint(lr.min),on.expandByPoint(lr.max))}on.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)Fe.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Fe));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Fe.fromBufferAttribute(a,c),l&&(Cs.fromBufferAttribute(t,c),Fe.add(Cs)),i=Math.max(i,n.distanceToSquared(Fe))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&te('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){te("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new un(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));const a=[],l=[];for(let _=0;_<n.count;_++)a[_]=new P,l[_]=new P;const c=new P,u=new P,h=new P,d=new ut,f=new ut,p=new ut,x=new P,m=new P;function g(_,T,L){c.fromBufferAttribute(n,_),u.fromBufferAttribute(n,T),h.fromBufferAttribute(n,L),d.fromBufferAttribute(r,_),f.fromBufferAttribute(r,T),p.fromBufferAttribute(r,L),u.sub(c),h.sub(c),f.sub(d),p.sub(d);const D=1/(f.x*p.y-p.x*f.y);isFinite(D)&&(x.copy(u).multiplyScalar(p.y).addScaledVector(h,-f.y).multiplyScalar(D),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(D),a[_].add(x),a[T].add(x),a[L].add(x),l[_].add(m),l[T].add(m),l[L].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let _=0,T=S.length;_<T;++_){const L=S[_],D=L.start,U=L.count;for(let K=D,Z=D+U;K<Z;K+=3)g(t.getX(K+0),t.getX(K+1),t.getX(K+2))}const w=new P,y=new P,M=new P,E=new P;function C(_){M.fromBufferAttribute(i,_),E.copy(M);const T=a[_];w.copy(T),w.sub(M.multiplyScalar(M.dot(T))).normalize(),y.crossVectors(E,T);const D=y.dot(l[_])<0?-1:1;o.setXYZW(_,w.x,w.y,w.z,D)}for(let _=0,T=S.length;_<T;++_){const L=S[_],D=L.start,U=L.count;for(let K=D,Z=D+U;K<Z;K+=3)C(t.getX(K+0)),C(t.getX(K+1)),C(t.getX(K+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new un(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new P,r=new P,o=new P,a=new P,l=new P,c=new P,u=new P,h=new P;if(t)for(let d=0,f=t.count;d<f;d+=3){const p=t.getX(d+0),x=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,p),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,m),u.subVectors(o,r),h.subVectors(i,r),u.cross(h),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,r),h.subVectors(i,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Fe.fromBufferAttribute(t,e),Fe.normalize(),t.setXYZ(e,Fe.x,Fe.y,Fe.z)}toNonIndexed(){function t(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let f=0,p=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?f=l[x]*a.data.stride+a.offset:f=l[x]*u;for(let g=0;g<u;g++)d[p++]=c[f++]}return new un(d,u,h)}if(this.index===null)return Ut("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new He,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(t.data))}u.length>0&&(i[l]=u,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const i=t.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(e))}const r=t.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let pm=0;class Rs extends pi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:pm++}),this.uuid=ms(),this.name="",this.type="Material",this.blending=cs,this.side=di,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ra,this.blendDst=oa,this.blendEquation=ki,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Bt(0,0,0),this.blendAlpha=0,this.depthFunc=hs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ds,this.stencilZFail=ds,this.stencilZPass=ds,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Ut(`Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){Ut(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==cs&&(n.blending=this.blending),this.side!==di&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ra&&(n.blendSrc=this.blendSrc),this.blendDst!==oa&&(n.blendDst=this.blendDst),this.blendEquation!==ki&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==hs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==xh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ds&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ds&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ds&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Bt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ut().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ut().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const ti=new P,Ll=new P,jr=new P,_i=new P,Dl=new P,Qr=new P,Il=new P;class to{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ti)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ti.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ti.copy(this.origin).addScaledVector(this.direction,e),ti.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Ll.copy(t).add(e).multiplyScalar(.5),jr.copy(e).sub(t).normalize(),_i.copy(this.origin).sub(Ll);const r=t.distanceTo(e)*.5,o=-this.direction.dot(jr),a=_i.dot(this.direction),l=-_i.dot(jr),c=_i.lengthSq(),u=Math.abs(1-o*o);let h,d,f,p;if(u>0)if(h=o*l-a,d=o*a-l,p=r*u,h>=0)if(d>=-p)if(d<=p){const x=1/u;h*=x,d*=x,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-p?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=p?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy(Ll).addScaledVector(jr,d),f}intersectSphere(t,e){ti.subVectors(t.center,this.origin);const n=ti.dot(this.direction),i=ti.dot(ti)-n*n,r=t.radius*t.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),u>=0?(r=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),h>=0?(a=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,ti)!==null}intersectTriangle(t,e,n,i,r){Dl.subVectors(e,t),Qr.subVectors(n,t),Il.crossVectors(Dl,Qr);let o=this.direction.dot(Il),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;_i.subVectors(this.origin,t);const l=a*this.direction.dot(Qr.crossVectors(_i,Qr));if(l<0)return null;const c=a*this.direction.dot(Dl.cross(_i));if(c<0||l+c>o)return null;const u=-a*_i.dot(Il);return u<0?null:this.at(u/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ei extends Rs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qn,this.combine=ch,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Bh=new re,Xi=new to,eo=new As,zh=new P,no=new P,io=new P,so=new P,Nl=new P,ro=new P,Hh=new P,oo=new P;class Zt extends Ae{constructor(t=new He,e=new ei){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(r&&a){ro.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],h=r[l];u!==0&&(Nl.fromBufferAttribute(h,t),o?ro.addScaledVector(Nl,u):ro.addScaledVector(Nl.sub(e),u))}e.add(ro)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),eo.copy(n.boundingSphere),eo.applyMatrix4(r),Xi.copy(t.ray).recast(t.near),!(eo.containsPoint(Xi.origin)===!1&&(Xi.intersectSphere(eo,zh)===null||Xi.origin.distanceToSquared(zh)>(t.far-t.near)**2))&&(Bh.copy(r).invert(),Xi.copy(t.ray).applyMatrix4(Bh),!(n.boundingBox!==null&&Xi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Xi)))}_computeIntersections(t,e,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,x=d.length;p<x;p++){const m=d[p],g=o[m.materialIndex],S=Math.max(m.start,f.start),w=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let y=S,M=w;y<M;y+=3){const E=a.getX(y),C=a.getX(y+1),_=a.getX(y+2);i=ao(this,g,t,n,c,u,h,E,C,_),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const p=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let m=p,g=x;m<g;m+=3){const S=a.getX(m),w=a.getX(m+1),y=a.getX(m+2);i=ao(this,o,t,n,c,u,h,S,w,y),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,x=d.length;p<x;p++){const m=d[p],g=o[m.materialIndex],S=Math.max(m.start,f.start),w=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let y=S,M=w;y<M;y+=3){const E=y,C=y+1,_=y+2;i=ao(this,g,t,n,c,u,h,E,C,_),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const p=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let m=p,g=x;m<g;m+=3){const S=m,w=m+1,y=m+2;i=ao(this,o,t,n,c,u,h,S,w,y),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function mm(s,t,e,n,i,r,o,a){let l;if(t.side===Ye?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===di,a),l===null)return null;oo.copy(a),oo.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(oo);return c<e.near||c>e.far?null:{distance:c,point:oo.clone(),object:s}}function ao(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,no),s.getVertexPosition(l,io),s.getVertexPosition(c,so);const u=mm(s,t,e,n,no,io,so,Hh);if(u){const h=new P;bn.getBarycoord(Hh,no,io,so,h),i&&(u.uv=bn.getInterpolatedAttribute(i,a,l,c,h,new ut)),r&&(u.uv1=bn.getInterpolatedAttribute(r,a,l,c,h,new ut)),o&&(u.normal=bn.getInterpolatedAttribute(o,a,l,c,h,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new P,materialIndex:0};bn.getNormal(no,io,so,d.normal),u.face=d,u.barycoord=h}return u}class Gh extends Ve{constructor(t=null,e=1,n=1,i,r,o,a,l,c=Be,u=Be,h,d){super(null,o,a,l,c,u,i,r,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class cr extends un{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ps=new re,Vh=new re,lo=[],Wh=new Vi,gm=new re,hr=new Zt,ur=new As;class $h extends Zt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new cr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,gm)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Vi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ps),Wh.copy(t.boundingBox).applyMatrix4(Ps),this.boundingBox.union(Wh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new As),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ps),ur.copy(t.boundingSphere).applyMatrix4(Ps),this.boundingSphere.union(ur)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){const n=this.matrixWorld,i=this.count;if(hr.geometry=this.geometry,hr.material=this.material,hr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ur.copy(this.boundingSphere),ur.applyMatrix4(n),t.ray.intersectsSphere(ur)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ps),Vh.multiplyMatrices(n,Ps),hr.matrixWorld=Vh,hr.raycast(t,lo);for(let o=0,a=lo.length;o<a;o++){const l=lo[o];l.instanceId=r,l.object=this,e.push(l)}lo.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new cr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Gh(new Float32Array(i*this.count),i,this.count,Aa,vn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=i*t;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ul=new P,xm=new P,vm=new zt;class yi{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Ul.subVectors(n,e).cross(xm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const i=t.delta(Ul),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||vm.getNormalMatrix(t),i=this.coplanarPoint(Ul).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Yi=new As,_m=new ut(.5,.5),co=new P;class ho{constructor(t=new yi,e=new yi,n=new yi,i=new yi,r=new yi,o=new yi){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=In,n=!1){const i=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],f=r[7],p=r[8],x=r[9],m=r[10],g=r[11],S=r[12],w=r[13],y=r[14],M=r[15];if(i[0].setComponents(c-o,f-u,g-p,M-S).normalize(),i[1].setComponents(c+o,f+u,g+p,M+S).normalize(),i[2].setComponents(c+a,f+h,g+x,M+w).normalize(),i[3].setComponents(c-a,f-h,g-x,M-w).normalize(),n)i[4].setComponents(l,d,m,y).normalize(),i[5].setComponents(c-l,f-d,g-m,M-y).normalize();else if(i[4].setComponents(c-l,f-d,g-m,M-y).normalize(),e===In)i[5].setComponents(c+l,f+d,g+m,M+y).normalize();else if(e===nr)i[5].setComponents(l,d,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Yi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Yi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Yi)}intersectsSprite(t){Yi.center.set(0,0,0);const e=_m.distanceTo(t.center);return Yi.radius=.7071067811865476+e,Yi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Yi)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(co.x=i.normal.x>0?t.max.x:t.min.x,co.y=i.normal.y>0?t.max.y:t.min.y,co.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(co)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Xh extends Rs{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Bt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const uo=new P,fo=new P,Yh=new re,dr=new to,po=new As,Fl=new P,qh=new P;class Kh extends Ae{constructor(t=new He,e=new Xh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)uo.fromBufferAttribute(e,i-1),fo.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=uo.distanceTo(fo);t.setAttribute("lineDistance",new xe(n,1))}else Ut("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),po.copy(n.boundingSphere),po.applyMatrix4(i),po.radius+=r,t.ray.intersectsSphere(po)===!1)return;Yh.copy(i).invert(),dr.copy(t.ray).applyMatrix4(Yh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const f=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let x=f,m=p-1;x<m;x+=c){const g=u.getX(x),S=u.getX(x+1),w=mo(this,t,dr,l,g,S,x);w&&e.push(w)}if(this.isLineLoop){const x=u.getX(p-1),m=u.getX(f),g=mo(this,t,dr,l,x,m,p-1);g&&e.push(g)}}else{const f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let x=f,m=p-1;x<m;x+=c){const g=mo(this,t,dr,l,x,x+1,x);g&&e.push(g)}if(this.isLineLoop){const x=mo(this,t,dr,l,p-1,f,p-1);x&&e.push(x)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function mo(s,t,e,n,i,r,o){const a=s.geometry.attributes.position;if(uo.fromBufferAttribute(a,i),fo.fromBufferAttribute(a,r),e.distanceSqToSegment(uo,fo,Fl,qh)>n)return;Fl.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Fl);if(!(c<t.near||c>t.far))return{distance:c,point:qh.clone().applyMatrix4(s.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:s}}class Zh extends Ve{constructor(t=[],e=Bi,n,i,r,o,a,l,c,u){super(t,e,n,i,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ls extends Ve{constructor(t,e,n,i,r,o,a,l,c){super(t,e,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ds extends Ve{constructor(t,e,n=Dn,i,r,o,a=Be,l=Be,c,u=Xn,h=1){if(u!==Xn&&u!==Hi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:h};super(d,i,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new fl(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class ym extends Ds{constructor(t,e=Dn,n=Bi,i,r,o=Be,a=Be,l,c=Xn){const u={width:t,height:t,depth:1},h=[u,u,u,u,u,u];super(t,t,e,n,i,r,o,a,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Jh extends Ve{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class wn extends He{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,f=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,i,o,2),p("x","z","y",1,-1,t,n,-e,i,o,3),p("x","y","z",1,-1,t,e,n,i,r,4),p("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new xe(c,3)),this.setAttribute("normal",new xe(u,3)),this.setAttribute("uv",new xe(h,2));function p(x,m,g,S,w,y,M,E,C,_,T){const L=y/C,D=M/_,U=y/2,K=M/2,Z=E/2,N=C+1,W=_+1;let B=0,X=0;const nt=new P;for(let ot=0;ot<W;ot++){const at=ot*D-K;for(let xt=0;xt<N;xt++){const Ht=xt*L-U;nt[x]=Ht*S,nt[m]=at*w,nt[g]=Z,c.push(nt.x,nt.y,nt.z),nt[x]=0,nt[m]=0,nt[g]=E>0?1:-1,u.push(nt.x,nt.y,nt.z),h.push(xt/C),h.push(1-ot/_),B+=1}}for(let ot=0;ot<_;ot++)for(let at=0;at<C;at++){const xt=d+at+N*ot,Ht=d+at+N*(ot+1),ve=d+(at+1)+N*(ot+1),ee=d+(at+1)+N*ot;l.push(xt,Ht,ee),l.push(Ht,ve,ee),X+=6}a.addGroup(f,X,T),f+=X,d+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class Ol extends He{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new P,u=new ut;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=e;h++,d+=3){const f=n+h/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[d]/t+1)/2,u.y=(o[d+1]/t+1)/2,l.push(u.x,u.y)}for(let h=1;h<=e;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new xe(o,3)),this.setAttribute("normal",new xe(a,3)),this.setAttribute("uv",new xe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ol(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Is extends He{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const u=[],h=[],d=[],f=[];let p=0;const x=[],m=n/2;let g=0;S(),o===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(u),this.setAttribute("position",new xe(h,3)),this.setAttribute("normal",new xe(d,3)),this.setAttribute("uv",new xe(f,2));function S(){const y=new P,M=new P;let E=0;const C=(e-t)/n;for(let _=0;_<=r;_++){const T=[],L=_/r,D=L*(e-t)+t;for(let U=0;U<=i;U++){const K=U/i,Z=K*l+a,N=Math.sin(Z),W=Math.cos(Z);M.x=D*N,M.y=-L*n+m,M.z=D*W,h.push(M.x,M.y,M.z),y.set(N,C,W).normalize(),d.push(y.x,y.y,y.z),f.push(K,1-L),T.push(p++)}x.push(T)}for(let _=0;_<i;_++)for(let T=0;T<r;T++){const L=x[T][_],D=x[T+1][_],U=x[T+1][_+1],K=x[T][_+1];(t>0||T!==0)&&(u.push(L,D,K),E+=3),(e>0||T!==r-1)&&(u.push(D,U,K),E+=3)}c.addGroup(g,E,0),g+=E}function w(y){const M=p,E=new ut,C=new P;let _=0;const T=y===!0?t:e,L=y===!0?1:-1;for(let U=1;U<=i;U++)h.push(0,m*L,0),d.push(0,L,0),f.push(.5,.5),p++;const D=p;for(let U=0;U<=i;U++){const Z=U/i*l+a,N=Math.cos(Z),W=Math.sin(Z);C.x=T*W,C.y=m*L,C.z=T*N,h.push(C.x,C.y,C.z),d.push(0,L,0),E.x=N*.5+.5,E.y=W*.5*L+.5,f.push(E.x,E.y),p++}for(let U=0;U<i;U++){const K=M+U,Z=D+U;y===!0?u.push(Z,Z+1,K):u.push(Z+1,Z,K),_+=3}c.addGroup(g,_,y===!0?1:2),g+=_}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Is(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ni{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ut("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let i=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);const u=n[i],d=n[i+1]-u,f=(o-u)/d;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const o=this.getPoint(i),a=this.getPoint(r),l=e||(o.isVector2?new ut:new P);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new P,i=[],r=[],o=[],a=new P,l=new re;for(let f=0;f<=t;f++){const p=f/t;i[f]=this.getTangentAt(p,new P)}r[0]=new P,o[0]=new P;let c=Number.MAX_VALUE;const u=Math.abs(i[0].x),h=Math.abs(i[0].y),d=Math.abs(i[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();const p=Math.acos(Xt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(Xt(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(i[p],f*p)),o[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class jh extends ni{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new ut){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Mm extends jh{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function kl(){let s=0,t=0,e=0,n=0;function i(r,o,a,l){s=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){i(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,u,h){let d=(o-r)/c-(a-r)/(c+u)+(a-o)/u,f=(a-o)/u-(l-o)/(u+h)+(l-a)/h;d*=u,f*=u,i(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return s+t*r+e*o+n*a}}}const Qh=new P,tu=new P,Bl=new kl,zl=new kl,Hl=new kl;class eu extends ni{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new P){const n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,u;this.closed||a>0?c=i[(a-1)%r]:(tu.subVectors(i[0],i[1]).add(i[0]),c=tu);const h=i[a%r],d=i[(a+1)%r];if(this.closed||a+2<r?u=i[(a+2)%r]:(Qh.subVectors(i[r-1],i[r-2]).add(i[r-1]),u=Qh),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(h),f),x=Math.pow(h.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f);x<1e-4&&(x=1),p<1e-4&&(p=x),m<1e-4&&(m=x),Bl.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,p,x,m),zl.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,p,x,m),Hl.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,p,x,m)}else this.curveType==="catmullrom"&&(Bl.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),zl.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),Hl.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(Bl.calc(l),zl.calc(l),Hl.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new P().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function nu(s,t,e,n,i){const r=(n-t)*.5,o=(i-e)*.5,a=s*s,l=s*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*s+e}function bm(s,t){const e=1-s;return e*e*t}function Sm(s,t){return 2*(1-s)*s*t}function wm(s,t){return s*s*t}function fr(s,t,e,n){return bm(s,t)+Sm(s,e)+wm(s,n)}function Em(s,t){const e=1-s;return e*e*e*t}function Tm(s,t){const e=1-s;return 3*e*e*s*t}function Am(s,t){return 3*(1-s)*s*s*t}function Cm(s,t){return s*s*s*t}function pr(s,t,e,n,i){return Em(s,t)+Tm(s,e)+Am(s,n)+Cm(s,i)}class Rm extends ni{constructor(t=new ut,e=new ut,n=new ut,i=new ut){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new ut){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(pr(t,i.x,r.x,o.x,a.x),pr(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Pm extends ni{constructor(t=new P,e=new P,n=new P,i=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new P){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(pr(t,i.x,r.x,o.x,a.x),pr(t,i.y,r.y,o.y,a.y),pr(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Lm extends ni{constructor(t=new ut,e=new ut){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ut){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ut){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Dm extends ni{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Im extends ni{constructor(t=new ut,e=new ut,n=new ut){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ut){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(fr(t,i.x,r.x,o.x),fr(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class iu extends ni{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(fr(t,i.x,r.x,o.x),fr(t,i.y,r.y,o.y),fr(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Nm extends ni{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ut){const n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,l=i[o===0?o:o-1],c=i[o],u=i[o>i.length-2?i.length-1:o+1],h=i[o>i.length-3?i.length-1:o+2];return n.set(nu(a,l.x,c.x,u.x,h.x),nu(a,l.y,c.y,u.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new ut().fromArray(i))}return this}}var Um=Object.freeze({__proto__:null,ArcCurve:Mm,CatmullRomCurve3:eu,CubicBezierCurve:Rm,CubicBezierCurve3:Pm,EllipseCurve:jh,LineCurve:Lm,LineCurve3:Dm,QuadraticBezierCurve:Im,QuadraticBezierCurve3:iu,SplineCurve:Nm});class fn extends He{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,u=l+1,h=t/a,d=e/l,f=[],p=[],x=[],m=[];for(let g=0;g<u;g++){const S=g*d-o;for(let w=0;w<c;w++){const y=w*h-r;p.push(y,-S,0),x.push(0,0,1),m.push(w/a),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let S=0;S<a;S++){const w=S+c*g,y=S+c*(g+1),M=S+1+c*(g+1),E=S+1+c*g;f.push(w,y,E),f.push(y,M,E)}this.setIndex(f),this.setAttribute("position",new xe(p,3)),this.setAttribute("normal",new xe(x,3)),this.setAttribute("uv",new xe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fn(t.width,t.height,t.widthSegments,t.heightSegments)}}class go extends He{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new P,d=new P,f=[],p=[],x=[],m=[];for(let g=0;g<=n;g++){const S=[],w=g/n,y=o+w*a,M=t*Math.cos(y),E=Math.sqrt(t*t-M*M);let C=0;g===0&&o===0?C=.5/e:g===n&&l===Math.PI&&(C=-.5/e);for(let _=0;_<=e;_++){const T=_/e,L=i+T*r;h.x=-E*Math.cos(L),h.y=M,h.z=E*Math.sin(L),p.push(h.x,h.y,h.z),d.copy(h).normalize(),x.push(d.x,d.y,d.z),m.push(T+C,1-w),S.push(c++)}u.push(S)}for(let g=0;g<n;g++)for(let S=0;S<e;S++){const w=u[g][S+1],y=u[g][S],M=u[g+1][S],E=u[g+1][S+1];(g!==0||o>0)&&f.push(w,y,E),(g!==n-1||l<Math.PI)&&f.push(y,M,E)}this.setIndex(f),this.setAttribute("position",new xe(p,3)),this.setAttribute("normal",new xe(x,3)),this.setAttribute("uv",new xe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new go(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Gl extends He{constructor(t=new iu(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),e=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:i,closed:r};const o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new P,l=new P,c=new ut;let u=new P;const h=[],d=[],f=[],p=[];x(),this.setIndex(p),this.setAttribute("position",new xe(h,3)),this.setAttribute("normal",new xe(d,3)),this.setAttribute("uv",new xe(f,2));function x(){for(let w=0;w<e;w++)m(w);m(r===!1?e:0),S(),g()}function m(w){u=t.getPointAt(w/e,u);const y=o.normals[w],M=o.binormals[w];for(let E=0;E<=i;E++){const C=E/i*Math.PI*2,_=Math.sin(C),T=-Math.cos(C);l.x=T*y.x+_*M.x,l.y=T*y.y+_*M.y,l.z=T*y.z+_*M.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=u.x+n*l.x,a.y=u.y+n*l.y,a.z=u.z+n*l.z,h.push(a.x,a.y,a.z)}}function g(){for(let w=1;w<=e;w++)for(let y=1;y<=i;y++){const M=(i+1)*(w-1)+(y-1),E=(i+1)*w+(y-1),C=(i+1)*w+y,_=(i+1)*(w-1)+y;p.push(M,E,_),p.push(E,C,_)}}function S(){for(let w=0;w<=e;w++)for(let y=0;y<=i;y++)c.x=w/e,c.y=y/i,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Gl(new Um[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}function Ns(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];if(su(i))i.isRenderTargetTexture?(Ut("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(su(i[0])){const r=[];for(let o=0,a=i.length;o<a;o++)r[o]=i[o].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function Ke(s){const t={};for(let e=0;e<s.length;e++){const n=Ns(s[e]);for(const i in n)t[i]=n[i]}return t}function su(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Fm(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function ru(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Jt.workingColorSpace}const mr={clone:Ns,merge:Ke};var Om=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,km=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Le extends Rs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Om,this.fragmentShader=km,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ns(t.uniforms),this.uniformsGroups=Fm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new Bt().setHex(i.value);break;case"v2":this.uniforms[n].value=new ut().fromArray(i.value);break;case"v3":this.uniforms[n].value=new P().fromArray(i.value);break;case"v4":this.uniforms[n].value=new _e().fromArray(i.value);break;case"m3":this.uniforms[n].value=new zt().fromArray(i.value);break;case"m4":this.uniforms[n].value=new re().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class ou extends Le{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Je extends Rs{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=al,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Bm extends Rs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class zm extends Rs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class xo extends Ae{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Bt(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class Hm extends xo{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ae.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const Vl=new re,au=new P,lu=new P;class Wl{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ut(512,512),this.mapType=nn,this.map=null,this.mapPass=null,this.matrix=new re,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ho,this._frameExtents=new ut(1,1),this._viewportCount=1,this._viewports=[new _e(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;au.setFromMatrixPosition(t.matrixWorld),e.position.copy(au),lu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(lu),e.updateMatrixWorld(),Vl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Vl,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===nr||e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Vl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const vo=new P,_o=new Nn,Un=new P;class cu extends Ae{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new re,this.projectionMatrix=new re,this.projectionMatrixInverse=new re,this.coordinateSystem=In,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(vo,_o,Un),Un.x===1&&Un.y===1&&Un.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(vo,_o,Un.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(vo,_o,Un),Un.x===1&&Un.y===1&&Un.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(vo,_o,Un.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Mi=new P,hu=new ut,uu=new ut;class je extends cu{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ps*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ir*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ps*2*Math.atan(Math.tan(ir*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Mi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Mi.x,Mi.y).multiplyScalar(-t/Mi.z),Mi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Mi.x,Mi.y).multiplyScalar(-t/Mi.z)}getViewSize(t,e){return this.getViewBounds(t,hu,uu),e.subVectors(uu,hu)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ir*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class Gm extends Wl{constructor(){super(new je(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=ps*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||i!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=i,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class Vm extends xo{constructor(t,e,n=0,i=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ae.DEFAULT_UP),this.updateMatrix(),this.target=new Ae,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Gm}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}}class Wm extends Wl{constructor(){super(new je(90,1,.5,500)),this.isPointLightShadow=!0}}class $l extends xo{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Wm}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class yo extends cu{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class $m extends Wl{constructor(){super(new yo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Xm extends xo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ae.DEFAULT_UP),this.updateMatrix(),this.target=new Ae,this.shadow=new $m}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}const Us=-90,Fs=1;class Ym extends Ae{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new je(Us,Fs,t,e);i.layers=this.layers,this.add(i);const r=new je(Us,Fs,t,e);r.layers=this.layers,this.add(r);const o=new je(Us,Fs,t,e);o.layers=this.layers,this.add(o);const a=new je(Us,Fs,t,e);a.layers=this.layers,this.add(a);const l=new je(Us,Fs,t,e);l.layers=this.layers,this.add(l);const c=new je(Us,Fs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===In)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===nr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,u),t.setRenderTarget(h,d,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class qm extends je{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Km{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=Zm.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function Zm(){this._document.hidden===!1&&this.reset()}const du=new re;class Jm{constructor(t,e,n=0,i=1/0){this.ray=new to(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new gl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):te("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return du.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(du),this}intersectObject(t,e=!0,n=[]){return Xl(t,this,n,e),n.sort(fu),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)Xl(t[i],this,n,e);return n.sort(fu),n}}function fu(s,t){return s.distance-t.distance}function Xl(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let o=0,a=r.length;o<a;o++)Xl(r[o],t,e,!0)}}class jm{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Ut("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}class Yl{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Xt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Xt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Rc=class Rc{constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){const r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=i,this}};Rc.prototype.isMatrix2=!0;let pu=Rc;class Qm extends pi{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){Ut("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function mu(s,t,e,n){const i=t0(n);switch(e){case mh:return s*t;case Aa:return s*t/i.components*i.byteLength;case Ca:return s*t/i.components*i.byteLength;case Gi:return s*t*2/i.components*i.byteLength;case Ra:return s*t*2/i.components*i.byteLength;case gh:return s*t*3/i.components*i.byteLength;case _n:return s*t*4/i.components*i.byteLength;case Pa:return s*t*4/i.components*i.byteLength;case Fr:case Or:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case kr:case Br:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Da:case Na:return Math.max(s,16)*Math.max(t,8)/4;case La:case Ia:return Math.max(s,8)*Math.max(t,8)/2;case Ua:case Fa:case ka:case Ba:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Oa:case zr:case za:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ha:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ga:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Va:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Wa:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case $a:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Xa:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Ya:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case qa:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Ka:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Za:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Ja:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case ja:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Qa:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case tl:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case el:case nl:case il:return Math.ceil(s/4)*Math.ceil(t/4)*16;case sl:case rl:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Hr:case ol:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function t0(s){switch(s){case nn:case uh:return{byteLength:1,components:1};case Qs:case dh:case sn:return{byteLength:2,components:1};case Ea:case Ta:return{byteLength:2,components:4};case Dn:case wa:case vn:return{byteLength:4,components:1};case fh:case ph:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:sa}})),typeof window<"u"&&(window.__THREE__?Ut("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=sa);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function gu(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function e0(s){const t=new WeakMap;function e(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){const u=l.array,h=l.updateRanges;if(s.bindBuffer(c,a),h.length===0)s.bufferSubData(c,0,u);else{h.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<h.length;f++){const p=h[d],x=h[f];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++d,h[d]=x)}h.length=d+1;for(let f=0,p=h.length;f<p;f++){const x=h[f];s.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(s.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var n0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,i0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,s0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,r0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,o0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,a0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,l0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,c0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,h0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,u0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,d0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,f0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,p0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,m0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,g0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,x0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,v0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,_0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,y0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,M0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,b0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,S0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,w0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,E0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,T0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,A0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,C0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,R0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,P0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,L0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,D0="gl_FragColor = linearToOutputTexel( gl_FragColor );",I0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,N0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,U0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,F0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,O0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,k0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,B0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,z0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,H0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,G0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,V0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,W0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,X0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Y0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,q0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,K0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Z0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,J0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,j0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Q0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,tg=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,eg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ng=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ig=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,sg=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,rg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,og=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ag=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,cg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ug=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,dg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,pg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,mg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,gg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,xg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,_g=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Mg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,bg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Sg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Eg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Tg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ag=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Cg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Rg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Pg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Lg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Dg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ig=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ng=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ug=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Fg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Og=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,kg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Bg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,zg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Hg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Gg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Vg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Wg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$g=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Xg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Yg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,qg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Kg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Zg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Jg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,jg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Qg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,tx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,ex=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Yt={alphahash_fragment:n0,alphahash_pars_fragment:i0,alphamap_fragment:s0,alphamap_pars_fragment:r0,alphatest_fragment:o0,alphatest_pars_fragment:a0,aomap_fragment:l0,aomap_pars_fragment:c0,batching_pars_vertex:h0,batching_vertex:u0,begin_vertex:d0,beginnormal_vertex:f0,bsdfs:p0,iridescence_fragment:m0,bumpmap_pars_fragment:g0,clipping_planes_fragment:x0,clipping_planes_pars_fragment:v0,clipping_planes_pars_vertex:_0,clipping_planes_vertex:y0,color_fragment:M0,color_pars_fragment:b0,color_pars_vertex:S0,color_vertex:w0,common:E0,cube_uv_reflection_fragment:T0,defaultnormal_vertex:A0,displacementmap_pars_vertex:C0,displacementmap_vertex:R0,emissivemap_fragment:P0,emissivemap_pars_fragment:L0,colorspace_fragment:D0,colorspace_pars_fragment:I0,envmap_fragment:N0,envmap_common_pars_fragment:U0,envmap_pars_fragment:F0,envmap_pars_vertex:O0,envmap_physical_pars_fragment:q0,envmap_vertex:k0,fog_vertex:B0,fog_pars_vertex:z0,fog_fragment:H0,fog_pars_fragment:G0,gradientmap_pars_fragment:V0,lightmap_pars_fragment:W0,lights_lambert_fragment:$0,lights_lambert_pars_fragment:X0,lights_pars_begin:Y0,lights_toon_fragment:K0,lights_toon_pars_fragment:Z0,lights_phong_fragment:J0,lights_phong_pars_fragment:j0,lights_physical_fragment:Q0,lights_physical_pars_fragment:tg,lights_fragment_begin:eg,lights_fragment_maps:ng,lights_fragment_end:ig,lightprobes_pars_fragment:sg,logdepthbuf_fragment:rg,logdepthbuf_pars_fragment:og,logdepthbuf_pars_vertex:ag,logdepthbuf_vertex:lg,map_fragment:cg,map_pars_fragment:hg,map_particle_fragment:ug,map_particle_pars_fragment:dg,metalnessmap_fragment:fg,metalnessmap_pars_fragment:pg,morphinstance_vertex:mg,morphcolor_vertex:gg,morphnormal_vertex:xg,morphtarget_pars_vertex:vg,morphtarget_vertex:_g,normal_fragment_begin:yg,normal_fragment_maps:Mg,normal_pars_fragment:bg,normal_pars_vertex:Sg,normal_vertex:wg,normalmap_pars_fragment:Eg,clearcoat_normal_fragment_begin:Tg,clearcoat_normal_fragment_maps:Ag,clearcoat_pars_fragment:Cg,iridescence_pars_fragment:Rg,opaque_fragment:Pg,packing:Lg,premultiplied_alpha_fragment:Dg,project_vertex:Ig,dithering_fragment:Ng,dithering_pars_fragment:Ug,roughnessmap_fragment:Fg,roughnessmap_pars_fragment:Og,shadowmap_pars_fragment:kg,shadowmap_pars_vertex:Bg,shadowmap_vertex:zg,shadowmask_pars_fragment:Hg,skinbase_vertex:Gg,skinning_pars_vertex:Vg,skinning_vertex:Wg,skinnormal_vertex:$g,specularmap_fragment:Xg,specularmap_pars_fragment:Yg,tonemapping_fragment:qg,tonemapping_pars_fragment:Kg,transmission_fragment:Zg,transmission_pars_fragment:Jg,uv_pars_fragment:jg,uv_pars_vertex:Qg,uv_vertex:tx,worldpos_vertex:ex,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},vt={common:{diffuse:{value:new Bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new zt}},envmap:{envMap:{value:null},envMapRotation:{value:new zt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new zt},normalScale:{value:new ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new P},probesMax:{value:new P},probesResolution:{value:new P}},points:{diffuse:{value:new Bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0},uvTransform:{value:new zt}},sprite:{diffuse:{value:new Bt(16777215)},opacity:{value:1},center:{value:new ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}}},Fn={basic:{uniforms:Ke([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.fog]),vertexShader:Yt.meshbasic_vert,fragmentShader:Yt.meshbasic_frag},lambert:{uniforms:Ke([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new Bt(0)},envMapIntensity:{value:1}}]),vertexShader:Yt.meshlambert_vert,fragmentShader:Yt.meshlambert_frag},phong:{uniforms:Ke([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new Bt(0)},specular:{value:new Bt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphong_vert,fragmentShader:Yt.meshphong_frag},standard:{uniforms:Ke([vt.common,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.roughnessmap,vt.metalnessmap,vt.fog,vt.lights,{emissive:{value:new Bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag},toon:{uniforms:Ke([vt.common,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.gradientmap,vt.fog,vt.lights,{emissive:{value:new Bt(0)}}]),vertexShader:Yt.meshtoon_vert,fragmentShader:Yt.meshtoon_frag},matcap:{uniforms:Ke([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,{matcap:{value:null}}]),vertexShader:Yt.meshmatcap_vert,fragmentShader:Yt.meshmatcap_frag},points:{uniforms:Ke([vt.points,vt.fog]),vertexShader:Yt.points_vert,fragmentShader:Yt.points_frag},dashed:{uniforms:Ke([vt.common,vt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Yt.linedashed_vert,fragmentShader:Yt.linedashed_frag},depth:{uniforms:Ke([vt.common,vt.displacementmap]),vertexShader:Yt.depth_vert,fragmentShader:Yt.depth_frag},normal:{uniforms:Ke([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,{opacity:{value:1}}]),vertexShader:Yt.meshnormal_vert,fragmentShader:Yt.meshnormal_frag},sprite:{uniforms:Ke([vt.sprite,vt.fog]),vertexShader:Yt.sprite_vert,fragmentShader:Yt.sprite_frag},background:{uniforms:{uvTransform:{value:new zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Yt.background_vert,fragmentShader:Yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new zt}},vertexShader:Yt.backgroundCube_vert,fragmentShader:Yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Yt.cube_vert,fragmentShader:Yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Yt.equirect_vert,fragmentShader:Yt.equirect_frag},distance:{uniforms:Ke([vt.common,vt.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Yt.distance_vert,fragmentShader:Yt.distance_frag},shadow:{uniforms:Ke([vt.lights,vt.fog,{color:{value:new Bt(0)},opacity:{value:1}}]),vertexShader:Yt.shadow_vert,fragmentShader:Yt.shadow_frag}};Fn.physical={uniforms:Ke([Fn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new zt},clearcoatNormalScale:{value:new ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new zt},sheen:{value:0},sheenColor:{value:new Bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new zt},transmissionSamplerSize:{value:new ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new zt},attenuationDistance:{value:0},attenuationColor:{value:new Bt(0)},specularColor:{value:new Bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new zt},anisotropyVector:{value:new ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new zt}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag};const Mo={r:0,b:0,g:0},nx=new re,xu=new zt;xu.set(-1,0,0,0,1,0,0,0,1);function ix(s,t,e,n,i,r){const o=new Bt(0);let a=i===!0?0:1,l,c,u=null,h=0,d=null;function f(S){let w=S.isScene===!0?S.background:null;if(w&&w.isTexture){const y=S.backgroundBlurriness>0;w=t.get(w,y)}return w}function p(S){let w=!1;const y=f(S);y===null?m(o,a):y&&y.isColor&&(m(y,1),w=!0);const M=s.xr.getEnvironmentBlendMode();M==="additive"?e.buffers.color.setClear(0,0,0,1,r):M==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||w)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function x(S,w){const y=f(w);y&&(y.isCubeTexture||y.mapping===Ir)?(c===void 0&&(c=new Zt(new wn(1,1,1),new Le({name:"BackgroundCubeMaterial",uniforms:Ns(Fn.backgroundCube.uniforms),vertexShader:Fn.backgroundCube.vertexShader,fragmentShader:Fn.backgroundCube.fragmentShader,side:Ye,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(M,E,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(nx.makeRotationFromEuler(w.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(xu),c.material.toneMapped=Jt.getTransfer(y.colorSpace)!==se,(u!==y||h!==y.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,u=y,h=y.version,d=s.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Zt(new fn(2,2),new Le({name:"BackgroundMaterial",uniforms:Ns(Fn.background.uniforms),vertexShader:Fn.background.vertexShader,fragmentShader:Fn.background.fragmentShader,side:di,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=Jt.getTransfer(y.colorSpace)!==se,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||h!==y.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,u=y,h=y.version,d=s.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function m(S,w){S.getRGB(Mo,ru(s)),e.buffers.color.setClear(Mo.r,Mo.g,Mo.b,w,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,w=1){o.set(S),a=w,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,m(o,a)},render:p,addToRenderList:x,dispose:g}}function sx(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,o=!1;function a(D,U,K,Z,N){let W=!1;const B=h(D,Z,K,U);r!==B&&(r=B,c(r.object)),W=f(D,Z,K,N),W&&p(D,Z,K,N),N!==null&&t.update(N,s.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,y(D,U,K,Z),N!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function l(){return s.createVertexArray()}function c(D){return s.bindVertexArray(D)}function u(D){return s.deleteVertexArray(D)}function h(D,U,K,Z){const N=Z.wireframe===!0;let W=n[U.id];W===void 0&&(W={},n[U.id]=W);const B=D.isInstancedMesh===!0?D.id:0;let X=W[B];X===void 0&&(X={},W[B]=X);let nt=X[K.id];nt===void 0&&(nt={},X[K.id]=nt);let ot=nt[N];return ot===void 0&&(ot=d(l()),nt[N]=ot),ot}function d(D){const U=[],K=[],Z=[];for(let N=0;N<e;N++)U[N]=0,K[N]=0,Z[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:K,attributeDivisors:Z,object:D,attributes:{},index:null}}function f(D,U,K,Z){const N=r.attributes,W=U.attributes;let B=0;const X=K.getAttributes();for(const nt in X)if(X[nt].location>=0){const at=N[nt];let xt=W[nt];if(xt===void 0&&(nt==="instanceMatrix"&&D.instanceMatrix&&(xt=D.instanceMatrix),nt==="instanceColor"&&D.instanceColor&&(xt=D.instanceColor)),at===void 0||at.attribute!==xt||xt&&at.data!==xt.data)return!0;B++}return r.attributesNum!==B||r.index!==Z}function p(D,U,K,Z){const N={},W=U.attributes;let B=0;const X=K.getAttributes();for(const nt in X)if(X[nt].location>=0){let at=W[nt];at===void 0&&(nt==="instanceMatrix"&&D.instanceMatrix&&(at=D.instanceMatrix),nt==="instanceColor"&&D.instanceColor&&(at=D.instanceColor));const xt={};xt.attribute=at,at&&at.data&&(xt.data=at.data),N[nt]=xt,B++}r.attributes=N,r.attributesNum=B,r.index=Z}function x(){const D=r.newAttributes;for(let U=0,K=D.length;U<K;U++)D[U]=0}function m(D){g(D,0)}function g(D,U){const K=r.newAttributes,Z=r.enabledAttributes,N=r.attributeDivisors;K[D]=1,Z[D]===0&&(s.enableVertexAttribArray(D),Z[D]=1),N[D]!==U&&(s.vertexAttribDivisor(D,U),N[D]=U)}function S(){const D=r.newAttributes,U=r.enabledAttributes;for(let K=0,Z=U.length;K<Z;K++)U[K]!==D[K]&&(s.disableVertexAttribArray(K),U[K]=0)}function w(D,U,K,Z,N,W,B){B===!0?s.vertexAttribIPointer(D,U,K,N,W):s.vertexAttribPointer(D,U,K,Z,N,W)}function y(D,U,K,Z){x();const N=Z.attributes,W=K.getAttributes(),B=U.defaultAttributeValues;for(const X in W){const nt=W[X];if(nt.location>=0){let ot=N[X];if(ot===void 0&&(X==="instanceMatrix"&&D.instanceMatrix&&(ot=D.instanceMatrix),X==="instanceColor"&&D.instanceColor&&(ot=D.instanceColor)),ot!==void 0){const at=ot.normalized,xt=ot.itemSize,Ht=t.get(ot);if(Ht===void 0)continue;const ve=Ht.buffer,ee=Ht.type,Q=Ht.bytesPerElement,I=ee===s.INT||ee===s.UNSIGNED_INT||ot.gpuType===wa;if(ot.isInterleavedBufferAttribute){const Y=ot.data,st=Y.stride,dt=ot.offset;if(Y.isInstancedInterleavedBuffer){for(let lt=0;lt<nt.locationSize;lt++)g(nt.location+lt,Y.meshPerAttribute);D.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let lt=0;lt<nt.locationSize;lt++)m(nt.location+lt);s.bindBuffer(s.ARRAY_BUFFER,ve);for(let lt=0;lt<nt.locationSize;lt++)w(nt.location+lt,xt/nt.locationSize,ee,at,st*Q,(dt+xt/nt.locationSize*lt)*Q,I)}else{if(ot.isInstancedBufferAttribute){for(let Y=0;Y<nt.locationSize;Y++)g(nt.location+Y,ot.meshPerAttribute);D.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let Y=0;Y<nt.locationSize;Y++)m(nt.location+Y);s.bindBuffer(s.ARRAY_BUFFER,ve);for(let Y=0;Y<nt.locationSize;Y++)w(nt.location+Y,xt/nt.locationSize,ee,at,xt*Q,xt/nt.locationSize*Y*Q,I)}}else if(B!==void 0){const at=B[X];if(at!==void 0)switch(at.length){case 2:s.vertexAttrib2fv(nt.location,at);break;case 3:s.vertexAttrib3fv(nt.location,at);break;case 4:s.vertexAttrib4fv(nt.location,at);break;default:s.vertexAttrib1fv(nt.location,at)}}}}S()}function M(){T();for(const D in n){const U=n[D];for(const K in U){const Z=U[K];for(const N in Z){const W=Z[N];for(const B in W)u(W[B].object),delete W[B];delete Z[N]}}delete n[D]}}function E(D){if(n[D.id]===void 0)return;const U=n[D.id];for(const K in U){const Z=U[K];for(const N in Z){const W=Z[N];for(const B in W)u(W[B].object),delete W[B];delete Z[N]}}delete n[D.id]}function C(D){for(const U in n){const K=n[U];for(const Z in K){const N=K[Z];if(N[D.id]===void 0)continue;const W=N[D.id];for(const B in W)u(W[B].object),delete W[B];delete N[D.id]}}}function _(D){for(const U in n){const K=n[U],Z=D.isInstancedMesh===!0?D.id:0,N=K[Z];if(N!==void 0){for(const W in N){const B=N[W];for(const X in B)u(B[X].object),delete B[X];delete N[W]}delete K[Z],Object.keys(K).length===0&&delete n[U]}}}function T(){L(),o=!0,r!==i&&(r=i,c(r.object))}function L(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:T,resetDefaultState:L,dispose:M,releaseStatesOfGeometry:E,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:m,disableUnusedAttributes:S}}function rx(s,t,e){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,u){u!==0&&(s.drawArraysInstanced(n,l,c,u),e.update(c,n,u))}function a(l,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let d=0;for(let f=0;f<u;f++)d+=c[f];e.update(d,n,1)}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function ox(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(C){return!(C!==_n&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const _=C===sn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==nn&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==vn&&!_)}function l(C){if(C==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(Ut("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&d===!1&&Ut("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),S=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),w=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),M=s.getParameter(s.MAX_SAMPLES),E=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:S,maxVaryings:w,maxFragmentUniforms:y,maxSamples:M,samples:E}}function ax(s){const t=this;let e=null,n=0,i=!1,r=!1;const o=new yi,a=new zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||n!==0||i;return i=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,f){const p=h.clippingPlanes,x=h.clipIntersection,m=h.clipShadows,g=s.get(h);if(!i||p===null||p.length===0||r&&!m)r?u(null):c();else{const S=r?0:n,w=S*4;let y=g.clippingState||null;l.value=y,y=u(p,d,w,f);for(let M=0;M!==w;++M)y[M]=e[M];g.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,f,p){const x=h!==null?h.length:0;let m=null;if(x!==0){if(m=l.value,p!==!0||m===null){const g=f+x*4,S=d.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<g)&&(m=new Float32Array(g));for(let w=0,y=f;w!==x;++w,y+=4)o.copy(h[w]).applyMatrix4(S,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}const bi=4,vu=[.125,.215,.35,.446,.526,.582],qi=20,lx=256,gr=new yo,_u=new Bt;let ql=null,Kl=0,Zl=0,Jl=!1;const cx=new P;class yu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){const{size:o=256,position:a=cx}=r;ql=this._renderer.getRenderTarget(),Kl=this._renderer.getActiveCubeFace(),Zl=this._renderer.getActiveMipmapLevel(),Jl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Su(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(ql,Kl,Zl),this._renderer.xr.enabled=Jl,t.scissorTest=!1,Os(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Bi||t.mapping===us?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ql=this._renderer.getRenderTarget(),Kl=this._renderer.getActiveCubeFace(),Zl=this._renderer.getActiveMipmapLevel(),Jl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ze,minFilter:ze,generateMipmaps:!1,type:sn,format:_n,colorSpace:er,depthBuffer:!1},i=Mu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Mu(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=hx(r)),this._blurMaterial=dx(r,t,e),this._ggxMaterial=ux(r,t,e)}return i}_compileMaterial(t){const e=new Zt(new He,t);this._renderer.compile(e,gr)}_sceneToCubeUV(t,e,n,i,r){const l=new je(90,1,e,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(_u),h.toneMapping=Ln,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(i),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Zt(new wn,new ei({name:"PMREM.Background",side:Ye,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,m=x.material;let g=!1;const S=t.background;S?S.isColor&&(m.color.copy(S),t.background=null,g=!0):(m.color.copy(_u),g=!0);for(let w=0;w<6;w++){const y=w%3;y===0?(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[w],r.y,r.z)):y===1?(l.up.set(0,0,c[w]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[w],r.z)):(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[w]));const M=this._cubeSize;Os(i,y*M,w>2?M:0,M,M),h.setRenderTarget(i),g&&h.render(x,l),h.render(t,l)}h.toneMapping=f,h.autoClear=d,t.background=S}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Bi||t.mapping===us;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Su()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bu());const r=i?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;const a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Os(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,gr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const i=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;const l=o.uniforms,c=n/(this._lodMeshes.length-1),u=e/(this._lodMeshes.length-1),h=Math.sqrt(c*c-u*u),d=0+c*1.25,f=h*d,{_lodMax:p}=this,x=this._sizeLods[n],m=3*x*(n>p-bi?n-p+bi:0),g=4*(this._cubeSize-x);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=p-e,Os(r,m,g,3*x,2*x),i.setRenderTarget(r),i.render(a,gr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,Os(t,m,g,3*x,2*x),i.setRenderTarget(t),i.render(a,gr)}_blur(t,e,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&te("blur direction must be either latitudinal or longitudinal!");const u=3,h=this._lodMeshes[i];h.material=c;const d=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*qi-1),x=r/p,m=isFinite(r)?1+Math.floor(u*x):qi;m>qi&&Ut(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${qi}`);const g=[];let S=0;for(let C=0;C<qi;++C){const _=C/x,T=Math.exp(-_*_/2);g.push(T),C===0?S+=T:C<m&&(S+=2*T)}for(let C=0;C<g.length;C++)g[C]=g[C]/S;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:w}=this;d.dTheta.value=p,d.mipInt.value=w-n;const y=this._sizeLods[i],M=3*y*(i>w-bi?i-w+bi:0),E=4*(this._cubeSize-y);Os(e,M,E,3*y,2*y),l.setRenderTarget(e),l.render(h,gr)}}function hx(s){const t=[],e=[],n=[];let i=s;const r=s-bi+1+vu.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>s-bi?l=vu[o-s+bi-1]:o===0&&(l=0),e.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,p=6,x=3,m=2,g=1,S=new Float32Array(x*p*f),w=new Float32Array(m*p*f),y=new Float32Array(g*p*f);for(let E=0;E<f;E++){const C=E%3*2/3-1,_=E>2?0:-1,T=[C,_,0,C+2/3,_,0,C+2/3,_+1,0,C,_,0,C+2/3,_+1,0,C,_+1,0];S.set(T,x*p*E),w.set(d,m*p*E);const L=[E,E,E,E,E,E];y.set(L,g*p*E)}const M=new He;M.setAttribute("position",new un(S,x)),M.setAttribute("uv",new un(w,m)),M.setAttribute("faceIndex",new un(y,g)),n.push(new Zt(M,null)),i>bi&&i--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function Mu(s,t,e){const n=new Ze(s,t,e);return n.texture.mapping=Ir,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Os(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function ux(s,t,e){return new Le({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:lx,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:bo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function dx(s,t,e){const n=new Float32Array(qi),i=new P(0,1,0);return new Le({name:"SphericalGaussianBlur",defines:{n:qi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function bu(){return new Le({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Su(){return new Le({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function bo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class wu extends Ze{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Zh(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new wn(5,5,5),r=new Le({name:"CubemapFromEquirect",uniforms:Ns(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ye,blending:Pn});r.uniforms.tEquirect.value=e;const o=new Zt(i,r),a=e.minFilter;return e.minFilter===zi&&(e.minFilter=ze),new Ym(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}}function fx(s){let t=new WeakMap,e=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?o(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===ya||f===Ma)if(t.has(d)){const p=t.get(d).texture;return a(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const x=new wu(p.height);return x.fromEquirectangularTexture(s,d),t.set(d,x),d.addEventListener("dispose",c),a(x.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture){const f=d.mapping,p=f===ya||f===Ma,x=f===Bi||f===us;if(p||x){let m=e.get(d);const g=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return n===null&&(n=new yu(s)),m=p?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),m.texture;if(m!==void 0)return m.texture;{const S=d.image;return p&&S&&S.height>0||x&&S&&l(S)?(n===null&&(n=new yu(s)),m=p?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),d.addEventListener("dispose",u),m.texture):null}}}return d}function a(d,f){return f===ya?d.mapping=Bi:f===Ma&&(d.mapping=us),d}function l(d){let f=0;const p=6;for(let x=0;x<p;x++)d[x]!==void 0&&f++;return f===p}function c(d){const f=d.target;f.removeEventListener("dispose",c);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function u(d){const f=d.target;f.removeEventListener("dispose",u);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:h}}function px(s){const t={};function e(n){if(t[n]!==void 0)return t[n];const i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&fs("WebGLRenderer: "+n+" extension not supported."),i}}}function mx(s,t,e,n){const i={},r=new WeakMap;function o(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const p in d.attributes)t.remove(d.attributes[p]);d.removeEventListener("dispose",o),delete i[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function l(h){const d=h.attributes;for(const f in d)t.update(d[f],s.ARRAY_BUFFER)}function c(h){const d=[],f=h.index,p=h.attributes.position;let x=0;if(p===void 0)return;if(f!==null){const S=f.array;x=f.version;for(let w=0,y=S.length;w<y;w+=3){const M=S[w+0],E=S[w+1],C=S[w+2];d.push(M,E,E,C,C,M)}}else{const S=p.array;x=p.version;for(let w=0,y=S.length/3-1;w<y;w+=3){const M=w+0,E=w+1,C=w+2;d.push(M,E,E,C,C,M)}}const m=new(p.count>=65535?kh:Oh)(d,1);m.version=x;const g=r.get(h);g&&t.remove(g),r.set(h,m)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function gx(s,t,e){let n;function i(h){n=h}let r,o;function a(h){r=h.type,o=h.bytesPerElement}function l(h,d){s.drawElements(n,d,r,h*o),e.update(d,n,1)}function c(h,d,f){f!==0&&(s.drawElementsInstanced(n,d,r,h*o,f),e.update(d,n,f))}function u(h,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,h,0,f);let x=0;for(let m=0;m<f;m++)x+=d[m];e.update(x,n,1)}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function xx(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:te("WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function vx(s,t,e){const n=new WeakMap,i=new _e;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==h){let T=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",T)};d!==void 0&&d.texture.dispose();const f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],S=a.morphAttributes.color||[];let w=0;f===!0&&(w=1),p===!0&&(w=2),x===!0&&(w=3);let y=a.attributes.position.count*w,M=1;y>t.maxTextureSize&&(M=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);const E=new Float32Array(y*M*4*h),C=new Ah(E,y,M,h);C.type=vn,C.needsUpdate=!0;const _=w*4;for(let L=0;L<h;L++){const D=m[L],U=g[L],K=S[L],Z=y*M*4*L;for(let N=0;N<D.count;N++){const W=N*_;f===!0&&(i.fromBufferAttribute(D,N),E[Z+W+0]=i.x,E[Z+W+1]=i.y,E[Z+W+2]=i.z,E[Z+W+3]=0),p===!0&&(i.fromBufferAttribute(U,N),E[Z+W+4]=i.x,E[Z+W+5]=i.y,E[Z+W+6]=i.z,E[Z+W+7]=0),x===!0&&(i.fromBufferAttribute(K,N),E[Z+W+8]=i.x,E[Z+W+9]=i.y,E[Z+W+10]=i.z,E[Z+W+11]=K.itemSize===4?i.w:1)}}d={count:h,texture:C,size:new ut(y,M)},n.set(a,d),a.addEventListener("dispose",T)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];const p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",p),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function _x(s,t,e,n,i){let r=new WeakMap;function o(c){const u=i.render.frame,h=c.geometry,d=t.get(c,h);if(r.get(d)!==u&&(t.update(d),r.set(d,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return d}function a(){r=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),e.remove(u.instanceMatrix),u.instanceColor!==null&&e.remove(u.instanceColor)}return{update:o,dispose:a}}const yx={[pa]:"LINEAR_TONE_MAPPING",[ma]:"REINHARD_TONE_MAPPING",[ga]:"CINEON_TONE_MAPPING",[Dr]:"ACES_FILMIC_TONE_MAPPING",[va]:"AGX_TONE_MAPPING",[_a]:"NEUTRAL_TONE_MAPPING",[xa]:"CUSTOM_TONE_MAPPING"};function Mx(s,t,e,n,i,r){const o=new Ze(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,depthTexture:i?new Ds(t,e):void 0}),a=new Ze(t,e,{type:sn,depthBuffer:!1,stencilBuffer:!1}),l=new He;l.setAttribute("position",new xe([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new xe([0,2,0,0,2,0],2));const c=new ou({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new Zt(l,c),h=new yo(-1,1,1,-1,0,1);let d=null,f=null,p=!1,x,m=null,g=[],S=!1;this.setSize=function(w,y){o.setSize(w,y),a.setSize(w,y);for(let M=0;M<g.length;M++){const E=g[M];E.setSize&&E.setSize(w,y)}},this.setEffects=function(w){g=w,S=g.length>0&&g[0].isRenderPass===!0;const y=o.width,M=o.height;for(let E=0;E<g.length;E++){const C=g[E];C.setSize&&C.setSize(y,M)}},this.begin=function(w,y){if(p||w.toneMapping===Ln&&g.length===0)return!1;if(m=y,y!==null){const M=y.width,E=y.height;(o.width!==M||o.height!==E)&&this.setSize(M,E)}return S===!1&&w.setRenderTarget(o),x=w.toneMapping,w.toneMapping=Ln,!0},this.hasRenderPass=function(){return S},this.end=function(w,y){w.toneMapping=x,p=!0;let M=o,E=a;for(let C=0;C<g.length;C++){const _=g[C];if(_.enabled!==!1&&(_.render(w,E,M,y),_.needsSwap!==!1)){const T=M;M=E,E=T}}if(d!==w.outputColorSpace||f!==w.toneMapping){d=w.outputColorSpace,f=w.toneMapping,c.defines={},Jt.getTransfer(d)===se&&(c.defines.SRGB_TRANSFER="");const C=yx[f];C&&(c.defines[C]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=M.texture,w.setRenderTarget(m),w.render(u,h),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),a.dispose(),l.dispose(),c.dispose()}}const Eu=new Ve,jl=new Ds(1,1),Tu=new Ah,Au=new nm,Cu=new Zh,Ru=[],Pu=[],Lu=new Float32Array(16),Du=new Float32Array(9),Iu=new Float32Array(4);function ks(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=Ru[i];if(r===void 0&&(r=new Float32Array(i),Ru[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function De(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Ie(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function So(s,t){let e=Pu[t];e===void 0&&(e=new Int32Array(t),Pu[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function bx(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Sx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;s.uniform2fv(this.addr,t),Ie(e,t)}}function wx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(De(e,t))return;s.uniform3fv(this.addr,t),Ie(e,t)}}function Ex(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;s.uniform4fv(this.addr,t),Ie(e,t)}}function Tx(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(De(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Ie(e,t)}else{if(De(e,n))return;Iu.set(n),s.uniformMatrix2fv(this.addr,!1,Iu),Ie(e,n)}}function Ax(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(De(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Ie(e,t)}else{if(De(e,n))return;Du.set(n),s.uniformMatrix3fv(this.addr,!1,Du),Ie(e,n)}}function Cx(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(De(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Ie(e,t)}else{if(De(e,n))return;Lu.set(n),s.uniformMatrix4fv(this.addr,!1,Lu),Ie(e,n)}}function Rx(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Px(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;s.uniform2iv(this.addr,t),Ie(e,t)}}function Lx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(De(e,t))return;s.uniform3iv(this.addr,t),Ie(e,t)}}function Dx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;s.uniform4iv(this.addr,t),Ie(e,t)}}function Ix(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Nx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;s.uniform2uiv(this.addr,t),Ie(e,t)}}function Ux(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(De(e,t))return;s.uniform3uiv(this.addr,t),Ie(e,t)}}function Fx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;s.uniform4uiv(this.addr,t),Ie(e,t)}}function Ox(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(jl.compareFunction=e.isReversedDepthBuffer()?cl:ll,r=jl):r=Eu,e.setTexture2D(t||r,i)}function kx(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Au,i)}function Bx(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Cu,i)}function zx(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Tu,i)}function Hx(s){switch(s){case 5126:return bx;case 35664:return Sx;case 35665:return wx;case 35666:return Ex;case 35674:return Tx;case 35675:return Ax;case 35676:return Cx;case 5124:case 35670:return Rx;case 35667:case 35671:return Px;case 35668:case 35672:return Lx;case 35669:case 35673:return Dx;case 5125:return Ix;case 36294:return Nx;case 36295:return Ux;case 36296:return Fx;case 35678:case 36198:case 36298:case 36306:case 35682:return Ox;case 35679:case 36299:case 36307:return kx;case 35680:case 36300:case 36308:case 36293:return Bx;case 36289:case 36303:case 36311:case 36292:return zx}}function Gx(s,t){s.uniform1fv(this.addr,t)}function Vx(s,t){const e=ks(t,this.size,2);s.uniform2fv(this.addr,e)}function Wx(s,t){const e=ks(t,this.size,3);s.uniform3fv(this.addr,e)}function $x(s,t){const e=ks(t,this.size,4);s.uniform4fv(this.addr,e)}function Xx(s,t){const e=ks(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Yx(s,t){const e=ks(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function qx(s,t){const e=ks(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Kx(s,t){s.uniform1iv(this.addr,t)}function Zx(s,t){s.uniform2iv(this.addr,t)}function Jx(s,t){s.uniform3iv(this.addr,t)}function jx(s,t){s.uniform4iv(this.addr,t)}function Qx(s,t){s.uniform1uiv(this.addr,t)}function tv(s,t){s.uniform2uiv(this.addr,t)}function ev(s,t){s.uniform3uiv(this.addr,t)}function nv(s,t){s.uniform4uiv(this.addr,t)}function iv(s,t,e){const n=this.cache,i=t.length,r=So(e,i);De(n,r)||(s.uniform1iv(this.addr,r),Ie(n,r));let o;this.type===s.SAMPLER_2D_SHADOW?o=jl:o=Eu;for(let a=0;a!==i;++a)e.setTexture2D(t[a]||o,r[a])}function sv(s,t,e){const n=this.cache,i=t.length,r=So(e,i);De(n,r)||(s.uniform1iv(this.addr,r),Ie(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Au,r[o])}function rv(s,t,e){const n=this.cache,i=t.length,r=So(e,i);De(n,r)||(s.uniform1iv(this.addr,r),Ie(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||Cu,r[o])}function ov(s,t,e){const n=this.cache,i=t.length,r=So(e,i);De(n,r)||(s.uniform1iv(this.addr,r),Ie(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Tu,r[o])}function av(s){switch(s){case 5126:return Gx;case 35664:return Vx;case 35665:return Wx;case 35666:return $x;case 35674:return Xx;case 35675:return Yx;case 35676:return qx;case 5124:case 35670:return Kx;case 35667:case 35671:return Zx;case 35668:case 35672:return Jx;case 35669:case 35673:return jx;case 5125:return Qx;case 36294:return tv;case 36295:return ev;case 36296:return nv;case 35678:case 36198:case 36298:case 36306:case 35682:return iv;case 35679:case 36299:case 36307:return sv;case 35680:case 36300:case 36308:case 36293:return rv;case 36289:case 36303:case 36311:case 36292:return ov}}class lv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Hx(e.type)}}class cv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=av(e.type)}}class hv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(t,e[a.id],n)}}}const Ql=/(\w+)(\])?(\[|\.)?/g;function Nu(s,t){s.seq.push(t),s.map[t.id]=t}function uv(s,t,e){const n=s.name,i=n.length;for(Ql.lastIndex=0;;){const r=Ql.exec(n),o=Ql.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Nu(e,c===void 0?new lv(a,s,t):new cv(a,s,t));break}else{let h=e.map[a];h===void 0&&(h=new hv(a),Nu(e,h)),e=h}}}class wo{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){const a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);uv(a,l,this)}const i=[],r=[];for(const o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(o):r.push(o);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function Uu(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const dv=37297;let fv=0;function pv(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Fu=new zt;function mv(s){Jt._getMatrix(Fu,Jt.workingColorSpace,s);const t=`mat3( ${Fu.elements.map(e=>e.toFixed(4))} )`;switch(Jt.getTransfer(s)){case Gr:return[t,"LinearTransferOETF"];case se:return[t,"sRGBTransferOETF"];default:return Ut("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Ou(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+pv(s.getShaderSource(t),a)}else return r}function gv(s,t){const e=mv(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const xv={[pa]:"Linear",[ma]:"Reinhard",[ga]:"Cineon",[Dr]:"ACESFilmic",[va]:"AgX",[_a]:"Neutral",[xa]:"Custom"};function vv(s,t){const e=xv[t];return e===void 0?(Ut("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Eo=new P;function _v(){Jt.getLuminanceCoefficients(Eo);const s=Eo.x.toFixed(4),t=Eo.y.toFixed(4),e=Eo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function yv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(xr).join(`
`)}function Mv(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function bv(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function xr(s){return s!==""}function ku(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Bu(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Sv=/^[ \t]*#include +<([\w\d./]+)>/gm;function tc(s){return s.replace(Sv,Ev)}const wv=new Map;function Ev(s,t){let e=Yt[t];if(e===void 0){const n=wv.get(t);if(n!==void 0)e=Yt[n],Ut('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return tc(e)}const Tv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function zu(s){return s.replace(Tv,Av)}function Av(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Hu(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const Cv={[Pr]:"SHADOWMAP_TYPE_PCF",[js]:"SHADOWMAP_TYPE_VSM"};function Rv(s){return Cv[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Pv={[Bi]:"ENVMAP_TYPE_CUBE",[us]:"ENVMAP_TYPE_CUBE",[Ir]:"ENVMAP_TYPE_CUBE_UV"};function Lv(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Pv[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const Dv={[us]:"ENVMAP_MODE_REFRACTION"};function Iv(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Dv[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Nv={[ch]:"ENVMAP_BLENDING_MULTIPLY",[yp]:"ENVMAP_BLENDING_MIX",[Mp]:"ENVMAP_BLENDING_ADD"};function Uv(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Nv[s.combine]||"ENVMAP_BLENDING_NONE"}function Fv(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Ov(s,t,e,n){const i=s.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=Rv(e),c=Lv(e),u=Iv(e),h=Uv(e),d=Fv(e),f=yv(e),p=Mv(r),x=i.createProgram();let m,g,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(xr).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(xr).join(`
`),g.length>0&&(g+=`
`)):(m=[Hu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xr).join(`
`),g=[Hu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ln?"#define TONE_MAPPING":"",e.toneMapping!==Ln?Yt.tonemapping_pars_fragment:"",e.toneMapping!==Ln?vv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Yt.colorspace_pars_fragment,gv("linearToOutputTexel",e.outputColorSpace),_v(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(xr).join(`
`)),o=tc(o),o=ku(o,e),o=Bu(o,e),a=tc(a),a=ku(a,e),a=Bu(a,e),o=zu(o),a=zu(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===_h?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===_h?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const w=S+m+o,y=S+g+a,M=Uu(i,i.VERTEX_SHADER,w),E=Uu(i,i.FRAGMENT_SHADER,y);i.attachShader(x,M),i.attachShader(x,E),e.index0AttributeName!==void 0?i.bindAttribLocation(x,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(x,0,"position"),i.linkProgram(x);function C(D){if(s.debug.checkShaderErrors){const U=i.getProgramInfoLog(x)||"",K=i.getShaderInfoLog(M)||"",Z=i.getShaderInfoLog(E)||"",N=U.trim(),W=K.trim(),B=Z.trim();let X=!0,nt=!0;if(i.getProgramParameter(x,i.LINK_STATUS)===!1)if(X=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,x,M,E);else{const ot=Ou(i,M,"vertex"),at=Ou(i,E,"fragment");te("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(x,i.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+N+`
`+ot+`
`+at)}else N!==""?Ut("WebGLProgram: Program Info Log:",N):(W===""||B==="")&&(nt=!1);nt&&(D.diagnostics={runnable:X,programLog:N,vertexShader:{log:W,prefix:m},fragmentShader:{log:B,prefix:g}})}i.deleteShader(M),i.deleteShader(E),_=new wo(i,x),T=bv(i,x)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let L=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=i.getProgramParameter(x,dv)),L},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=fv++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=M,this.fragmentShader=E,this}let kv=0;class Bv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new zv(t),e.set(t,n)),n}}class zv{constructor(t){this.id=kv++,this.code=t,this.usedTimes=0}}function Hv(s){return s===Gi||s===zr||s===Hr}function Gv(s,t,e,n,i,r){const o=new gl,a=new Bv,l=new Set,c=[],u=new Map,h=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(_){return l.add(_),_===0?"uv":`uv${_}`}function x(_,T,L,D,U,K){const Z=D.fog,N=U.geometry,W=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?D.environment:null,B=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,X=t.get(_.envMap||W,B),nt=X&&X.mapping===Ir?X.image.height:null,ot=f[_.type];_.precision!==null&&(d=n.getMaxPrecision(_.precision),d!==_.precision&&Ut("WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));const at=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,xt=at!==void 0?at.length:0;let Ht=0;N.morphAttributes.position!==void 0&&(Ht=1),N.morphAttributes.normal!==void 0&&(Ht=2),N.morphAttributes.color!==void 0&&(Ht=3);let ve,ee,Q,I;if(ot){const Et=Fn[ot];ve=Et.vertexShader,ee=Et.fragmentShader}else{ve=_.vertexShader,ee=_.fragmentShader;const Et=a.getVertexShaderStage(_),Se=a.getFragmentShaderStage(_);a.update(_,Et,Se),Q=Et.id,I=Se.id}const Y=s.getRenderTarget(),st=s.state.buffers.depth.getReversed(),dt=U.isInstancedMesh===!0,lt=U.isBatchedMesh===!0,Ot=!!_.map,Dt=!!_.matcap,Gt=!!X,jt=!!_.aoMap,Qt=!!_.lightMap,ne=!!_.bumpMap&&_.wireframe===!1,he=!!_.normalMap,ue=!!_.displacementMap,Re=!!_.emissiveMap,be=!!_.metalnessMap,Pe=!!_.roughnessMap,O=_.anisotropy>0,en=_.clearcoat>0,ae=_.dispersion>0,A=_.iridescence>0,v=_.sheen>0,z=_.transmission>0,$=O&&!!_.anisotropyMap,J=en&&!!_.clearcoatMap,ct=en&&!!_.clearcoatNormalMap,ft=en&&!!_.clearcoatRoughnessMap,j=A&&!!_.iridescenceMap,et=A&&!!_.iridescenceThicknessMap,pt=v&&!!_.sheenColorMap,Ct=v&&!!_.sheenRoughnessMap,_t=!!_.specularMap,mt=!!_.specularColorMap,Nt=!!_.specularIntensityMap,Ft=z&&!!_.transmissionMap,Wt=z&&!!_.thicknessMap,F=!!_.gradientMap,ht=!!_.alphaMap,tt=_.alphaTest>0,gt=!!_.alphaHash,bt=!!_.extensions;let it=Ln;_.toneMapped&&(Y===null||Y.isXRRenderTarget===!0)&&(it=s.toneMapping);const At={shaderID:ot,shaderType:_.type,shaderName:_.name,vertexShader:ve,fragmentShader:ee,defines:_.defines,customVertexShaderID:Q,customFragmentShaderID:I,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:lt,batchingColor:lt&&U._colorsTexture!==null,instancing:dt,instancingColor:dt&&U.instanceColor!==null,instancingMorph:dt&&U.morphTexture!==null,outputColorSpace:Y===null?s.outputColorSpace:Y.isXRRenderTarget===!0?Y.texture.colorSpace:Jt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Ot,matcap:Dt,envMap:Gt,envMapMode:Gt&&X.mapping,envMapCubeUVHeight:nt,aoMap:jt,lightMap:Qt,bumpMap:ne,normalMap:he,displacementMap:ue,emissiveMap:Re,normalMapObjectSpace:he&&_.normalMapType===wp,normalMapTangentSpace:he&&_.normalMapType===al,packedNormalMap:he&&_.normalMapType===al&&Hv(_.normalMap.format),metalnessMap:be,roughnessMap:Pe,anisotropy:O,anisotropyMap:$,clearcoat:en,clearcoatMap:J,clearcoatNormalMap:ct,clearcoatRoughnessMap:ft,dispersion:ae,iridescence:A,iridescenceMap:j,iridescenceThicknessMap:et,sheen:v,sheenColorMap:pt,sheenRoughnessMap:Ct,specularMap:_t,specularColorMap:mt,specularIntensityMap:Nt,transmission:z,transmissionMap:Ft,thicknessMap:Wt,gradientMap:F,opaque:_.transparent===!1&&_.blending===cs&&_.alphaToCoverage===!1,alphaMap:ht,alphaTest:tt,alphaHash:gt,combine:_.combine,mapUv:Ot&&p(_.map.channel),aoMapUv:jt&&p(_.aoMap.channel),lightMapUv:Qt&&p(_.lightMap.channel),bumpMapUv:ne&&p(_.bumpMap.channel),normalMapUv:he&&p(_.normalMap.channel),displacementMapUv:ue&&p(_.displacementMap.channel),emissiveMapUv:Re&&p(_.emissiveMap.channel),metalnessMapUv:be&&p(_.metalnessMap.channel),roughnessMapUv:Pe&&p(_.roughnessMap.channel),anisotropyMapUv:$&&p(_.anisotropyMap.channel),clearcoatMapUv:J&&p(_.clearcoatMap.channel),clearcoatNormalMapUv:ct&&p(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ft&&p(_.clearcoatRoughnessMap.channel),iridescenceMapUv:j&&p(_.iridescenceMap.channel),iridescenceThicknessMapUv:et&&p(_.iridescenceThicknessMap.channel),sheenColorMapUv:pt&&p(_.sheenColorMap.channel),sheenRoughnessMapUv:Ct&&p(_.sheenRoughnessMap.channel),specularMapUv:_t&&p(_.specularMap.channel),specularColorMapUv:mt&&p(_.specularColorMap.channel),specularIntensityMapUv:Nt&&p(_.specularIntensityMap.channel),transmissionMapUv:Ft&&p(_.transmissionMap.channel),thicknessMapUv:Wt&&p(_.thicknessMap.channel),alphaMapUv:ht&&p(_.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(he||O),vertexNormals:!!N.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!N.attributes.uv&&(Ot||ht),fog:!!Z,useFog:_.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||N.attributes.normal===void 0&&he===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:st,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:N.attributes.position!==void 0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:xt,morphTextureStride:Ht,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:K.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:it,decodeVideoTexture:Ot&&_.map.isVideoTexture===!0&&Jt.getTransfer(_.map.colorSpace)===se,decodeVideoTextureEmissive:Re&&_.emissiveMap.isVideoTexture===!0&&Jt.getTransfer(_.emissiveMap.colorSpace)===se,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Wn,flipSided:_.side===Ye,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:bt&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(bt&&_.extensions.multiDraw===!0||lt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return At.vertexUv1s=l.has(1),At.vertexUv2s=l.has(2),At.vertexUv3s=l.has(3),l.clear(),At}function m(_){const T=[];if(_.shaderID?T.push(_.shaderID):(T.push(_.customVertexShaderID),T.push(_.customFragmentShaderID)),_.defines!==void 0)for(const L in _.defines)T.push(L),T.push(_.defines[L]);return _.isRawShaderMaterial===!1&&(g(T,_),S(T,_),T.push(s.outputColorSpace)),T.push(_.customProgramCacheKey),T.join()}function g(_,T){_.push(T.precision),_.push(T.outputColorSpace),_.push(T.envMapMode),_.push(T.envMapCubeUVHeight),_.push(T.mapUv),_.push(T.alphaMapUv),_.push(T.lightMapUv),_.push(T.aoMapUv),_.push(T.bumpMapUv),_.push(T.normalMapUv),_.push(T.displacementMapUv),_.push(T.emissiveMapUv),_.push(T.metalnessMapUv),_.push(T.roughnessMapUv),_.push(T.anisotropyMapUv),_.push(T.clearcoatMapUv),_.push(T.clearcoatNormalMapUv),_.push(T.clearcoatRoughnessMapUv),_.push(T.iridescenceMapUv),_.push(T.iridescenceThicknessMapUv),_.push(T.sheenColorMapUv),_.push(T.sheenRoughnessMapUv),_.push(T.specularMapUv),_.push(T.specularColorMapUv),_.push(T.specularIntensityMapUv),_.push(T.transmissionMapUv),_.push(T.thicknessMapUv),_.push(T.combine),_.push(T.fogExp2),_.push(T.sizeAttenuation),_.push(T.morphTargetsCount),_.push(T.morphAttributeCount),_.push(T.numDirLights),_.push(T.numPointLights),_.push(T.numSpotLights),_.push(T.numSpotLightMaps),_.push(T.numHemiLights),_.push(T.numRectAreaLights),_.push(T.numDirLightShadows),_.push(T.numPointLightShadows),_.push(T.numSpotLightShadows),_.push(T.numSpotLightShadowsWithMaps),_.push(T.numLightProbes),_.push(T.shadowMapType),_.push(T.toneMapping),_.push(T.numClippingPlanes),_.push(T.numClipIntersection),_.push(T.depthPacking)}function S(_,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),T.packedNormalMap&&o.enable(22),T.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),T.numLightProbeGrids>0&&o.enable(22),T.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function w(_){const T=f[_.type];let L;if(T){const D=Fn[T];L=mr.clone(D.uniforms)}else L=_.uniforms;return L}function y(_,T){let L=u.get(T);return L!==void 0?++L.usedTimes:(L=new Ov(s,T,_,i),c.push(L),u.set(T,L)),L}function M(_){if(--_.usedTimes===0){const T=c.indexOf(_);c[T]=c[c.length-1],c.pop(),u.delete(_.cacheKey),_.destroy()}}function E(_){a.remove(_)}function C(){a.dispose()}return{getParameters:x,getProgramCacheKey:m,getUniforms:w,acquireProgram:y,releaseProgram:M,releaseShaderCache:E,programs:c,dispose:C}}function Vv(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function Wv(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function Gu(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Vu(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function a(d,f,p,x,m,g){let S=s[t];return S===void 0?(S={id:d.id,object:d,geometry:f,material:p,materialVariant:o(d),groupOrder:x,renderOrder:d.renderOrder,z:m,group:g},s[t]=S):(S.id=d.id,S.object=d,S.geometry=f,S.material=p,S.materialVariant=o(d),S.groupOrder=x,S.renderOrder=d.renderOrder,S.z=m,S.group=g),t++,S}function l(d,f,p,x,m,g){const S=a(d,f,p,x,m,g);p.transmission>0?n.push(S):p.transparent===!0?i.push(S):e.push(S)}function c(d,f,p,x,m,g){const S=a(d,f,p,x,m,g);p.transmission>0?n.unshift(S):p.transparent===!0?i.unshift(S):e.unshift(S)}function u(d,f,p){e.length>1&&e.sort(d||Wv),n.length>1&&n.sort(f||Gu),i.length>1&&i.sort(f||Gu),p&&(e.reverse(),n.reverse(),i.reverse())}function h(){for(let d=t,f=s.length;d<f;d++){const p=s[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:h,sort:u}}function $v(){let s=new WeakMap;function t(n,i){const r=s.get(n);let o;return r===void 0?(o=new Vu,s.set(n,[o])):i>=r.length?(o=new Vu,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function Xv(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new Bt};break;case"SpotLight":e={position:new P,direction:new P,color:new Bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new Bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new Bt,groundColor:new Bt};break;case"RectAreaLight":e={color:new Bt,position:new P,halfWidth:new P,halfHeight:new P};break}return s[t.id]=e,e}}}function Yv(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let qv=0;function Kv(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Zv(s){const t=new Xv,e=Yv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const i=new P,r=new re,o=new re;function a(c){let u=0,h=0,d=0;for(let T=0;T<9;T++)n.probe[T].set(0,0,0);let f=0,p=0,x=0,m=0,g=0,S=0,w=0,y=0,M=0,E=0,C=0;c.sort(Kv);for(let T=0,L=c.length;T<L;T++){const D=c[T],U=D.color,K=D.intensity,Z=D.distance;let N=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Gi?N=D.shadow.map.texture:N=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)u+=U.r*K,h+=U.g*K,d+=U.b*K;else if(D.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(D.sh.coefficients[W],K);C++}else if(D.isDirectionalLight){const W=t.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const B=D.shadow,X=e.get(D);X.shadowIntensity=B.intensity,X.shadowBias=B.bias,X.shadowNormalBias=B.normalBias,X.shadowRadius=B.radius,X.shadowMapSize=B.mapSize,n.directionalShadow[f]=X,n.directionalShadowMap[f]=N,n.directionalShadowMatrix[f]=D.shadow.matrix,S++}n.directional[f]=W,f++}else if(D.isSpotLight){const W=t.get(D);W.position.setFromMatrixPosition(D.matrixWorld),W.color.copy(U).multiplyScalar(K),W.distance=Z,W.coneCos=Math.cos(D.angle),W.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),W.decay=D.decay,n.spot[x]=W;const B=D.shadow;if(D.map&&(n.spotLightMap[M]=D.map,M++,B.updateMatrices(D),D.castShadow&&E++),n.spotLightMatrix[x]=B.matrix,D.castShadow){const X=e.get(D);X.shadowIntensity=B.intensity,X.shadowBias=B.bias,X.shadowNormalBias=B.normalBias,X.shadowRadius=B.radius,X.shadowMapSize=B.mapSize,n.spotShadow[x]=X,n.spotShadowMap[x]=N,y++}x++}else if(D.isRectAreaLight){const W=t.get(D);W.color.copy(U).multiplyScalar(K),W.halfWidth.set(D.width*.5,0,0),W.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=W,m++}else if(D.isPointLight){const W=t.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),W.distance=D.distance,W.decay=D.decay,D.castShadow){const B=D.shadow,X=e.get(D);X.shadowIntensity=B.intensity,X.shadowBias=B.bias,X.shadowNormalBias=B.normalBias,X.shadowRadius=B.radius,X.shadowMapSize=B.mapSize,X.shadowCameraNear=B.camera.near,X.shadowCameraFar=B.camera.far,n.pointShadow[p]=X,n.pointShadowMap[p]=N,n.pointShadowMatrix[p]=D.shadow.matrix,w++}n.point[p]=W,p++}else if(D.isHemisphereLight){const W=t.get(D);W.skyColor.copy(D.color).multiplyScalar(K),W.groundColor.copy(D.groundColor).multiplyScalar(K),n.hemi[g]=W,g++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=vt.LTC_FLOAT_1,n.rectAreaLTC2=vt.LTC_FLOAT_2):(n.rectAreaLTC1=vt.LTC_HALF_1,n.rectAreaLTC2=vt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const _=n.hash;(_.directionalLength!==f||_.pointLength!==p||_.spotLength!==x||_.rectAreaLength!==m||_.hemiLength!==g||_.numDirectionalShadows!==S||_.numPointShadows!==w||_.numSpotShadows!==y||_.numSpotMaps!==M||_.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=y+M-E,n.spotLightMap.length=M,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=C,_.directionalLength=f,_.pointLength=p,_.spotLength=x,_.rectAreaLength=m,_.hemiLength=g,_.numDirectionalShadows=S,_.numPointShadows=w,_.numSpotShadows=y,_.numSpotMaps=M,_.numLightProbes=C,n.version=qv++)}function l(c,u){let h=0,d=0,f=0,p=0,x=0;const m=u.matrixWorldInverse;for(let g=0,S=c.length;g<S;g++){const w=c[g];if(w.isDirectionalLight){const y=n.directional[h];y.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),h++}else if(w.isSpotLight){const y=n.spot[f];y.position.setFromMatrixPosition(w.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),f++}else if(w.isRectAreaLight){const y=n.rectArea[p];y.position.setFromMatrixPosition(w.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(w.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(w.width*.5,0,0),y.halfHeight.set(0,w.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),p++}else if(w.isPointLight){const y=n.point[d];y.position.setFromMatrixPosition(w.matrixWorld),y.position.applyMatrix4(m),d++}else if(w.isHemisphereLight){const y=n.hemi[x];y.direction.setFromMatrixPosition(w.matrixWorld),y.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:n}}function Wu(s){const t=new Zv(s),e=[],n=[],i=[];function r(d){h.camera=d,e.length=0,n.length=0,i.length=0}function o(d){e.push(d)}function a(d){n.push(d)}function l(d){i.push(d)}function c(){t.setup(e)}function u(d){t.setupView(e,d)}const h={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function Jv(s){let t=new WeakMap;function e(i,r=0){const o=t.get(i);let a;return o===void 0?(a=new Wu(s),t.set(i,[a])):r>=o.length?(a=new Wu(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const jv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Qv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,t_=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],e_=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],$u=new re,vr=new P,ec=new P;function n_(s,t,e){let n=new ho;const i=new ut,r=new ut,o=new _e,a=new Bm,l=new zm,c={},u=e.maxTextureSize,h={[di]:Ye,[Ye]:di,[Wn]:Wn},d=new Le({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ut},radius:{value:4}},vertexShader:jv,fragmentShader:Qv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new He;p.setAttribute("position",new un(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Zt(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Pr;let g=this.type;this.render=function(E,C,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;this.type===ep&&(Ut("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Pr);const T=s.getRenderTarget(),L=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),U=s.state;U.setBlending(Pn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const K=g!==this.type;K&&C.traverse(function(Z){Z.material&&(Array.isArray(Z.material)?Z.material.forEach(N=>N.needsUpdate=!0):Z.material.needsUpdate=!0)});for(let Z=0,N=E.length;Z<N;Z++){const W=E[Z],B=W.shadow;if(B===void 0){Ut("WebGLShadowMap:",W,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;i.copy(B.mapSize);const X=B.getFrameExtents();i.multiply(X),r.copy(B.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(r.x=Math.floor(u/X.x),i.x=r.x*X.x,B.mapSize.x=r.x),i.y>u&&(r.y=Math.floor(u/X.y),i.y=r.y*X.y,B.mapSize.y=r.y));const nt=s.state.buffers.depth.getReversed();if(B.camera._reversedDepth=nt,B.map===null||K===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===js){if(W.isPointLight){Ut("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new Ze(i.x,i.y,{format:Gi,type:sn,minFilter:ze,magFilter:ze,generateMipmaps:!1}),B.map.texture.name=W.name+".shadowMap",B.map.depthTexture=new Ds(i.x,i.y,vn),B.map.depthTexture.name=W.name+".shadowMapDepth",B.map.depthTexture.format=Xn,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Be,B.map.depthTexture.magFilter=Be}else W.isPointLight?(B.map=new wu(i.x),B.map.depthTexture=new ym(i.x,Dn)):(B.map=new Ze(i.x,i.y),B.map.depthTexture=new Ds(i.x,i.y,Dn)),B.map.depthTexture.name=W.name+".shadowMap",B.map.depthTexture.format=Xn,this.type===Pr?(B.map.depthTexture.compareFunction=nt?cl:ll,B.map.depthTexture.minFilter=ze,B.map.depthTexture.magFilter=ze):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Be,B.map.depthTexture.magFilter=Be);B.camera.updateProjectionMatrix()}const ot=B.map.isWebGLCubeRenderTarget?6:1;for(let at=0;at<ot;at++){if(B.map.isWebGLCubeRenderTarget)s.setRenderTarget(B.map,at),s.clear();else{at===0&&(s.setRenderTarget(B.map),s.clear());const xt=B.getViewport(at);o.set(r.x*xt.x,r.y*xt.y,r.x*xt.z,r.y*xt.w),U.viewport(o)}if(W.isPointLight){const xt=B.camera,Ht=B.matrix,ve=W.distance||xt.far;ve!==xt.far&&(xt.far=ve,xt.updateProjectionMatrix()),vr.setFromMatrixPosition(W.matrixWorld),xt.position.copy(vr),ec.copy(xt.position),ec.add(t_[at]),xt.up.copy(e_[at]),xt.lookAt(ec),xt.updateMatrixWorld(),Ht.makeTranslation(-vr.x,-vr.y,-vr.z),$u.multiplyMatrices(xt.projectionMatrix,xt.matrixWorldInverse),B._frustum.setFromProjectionMatrix($u,xt.coordinateSystem,xt.reversedDepth)}else B.updateMatrices(W);n=B.getFrustum(),y(C,_,B.camera,W,this.type)}B.isPointLightShadow!==!0&&this.type===js&&S(B,_),B.needsUpdate=!1}g=this.type,m.needsUpdate=!1,s.setRenderTarget(T,L,D)};function S(E,C){const _=t.update(x);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Ze(i.x,i.y,{format:Gi,type:sn})),d.uniforms.shadow_pass.value=E.map.depthTexture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(C,null,_,d,x,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(C,null,_,f,x,null)}function w(E,C,_,T){let L=null;const D=_.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(D!==void 0)L=D;else if(L=_.isPointLight===!0?l:a,s.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const U=L.uuid,K=C.uuid;let Z=c[U];Z===void 0&&(Z={},c[U]=Z);let N=Z[K];N===void 0&&(N=L.clone(),Z[K]=N,C.addEventListener("dispose",M)),L=N}if(L.visible=C.visible,L.wireframe=C.wireframe,T===js?L.side=C.shadowSide!==null?C.shadowSide:C.side:L.side=C.shadowSide!==null?C.shadowSide:h[C.side],L.alphaMap=C.alphaMap,L.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,L.map=C.map,L.clipShadows=C.clipShadows,L.clippingPlanes=C.clippingPlanes,L.clipIntersection=C.clipIntersection,L.displacementMap=C.displacementMap,L.displacementScale=C.displacementScale,L.displacementBias=C.displacementBias,L.wireframeLinewidth=C.wireframeLinewidth,L.linewidth=C.linewidth,_.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const U=s.properties.get(L);U.light=_}return L}function y(E,C,_,T,L){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&L===js)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,E.matrixWorld);const K=t.update(E),Z=E.material;if(Array.isArray(Z)){const N=K.groups;for(let W=0,B=N.length;W<B;W++){const X=N[W],nt=Z[X.materialIndex];if(nt&&nt.visible){const ot=w(E,nt,T,L);E.onBeforeShadow(s,E,C,_,K,ot,X),s.renderBufferDirect(_,null,K,ot,E,X),E.onAfterShadow(s,E,C,_,K,ot,X)}}}else if(Z.visible){const N=w(E,Z,T,L);E.onBeforeShadow(s,E,C,_,K,N,null),s.renderBufferDirect(_,null,K,N,E,null),E.onAfterShadow(s,E,C,_,K,N,null)}}const U=E.children;for(let K=0,Z=U.length;K<Z;K++)y(U[K],C,_,T,L)}function M(E){E.target.removeEventListener("dispose",M);for(const _ in c){const T=c[_],L=E.target.uuid;L in T&&(T[L].dispose(),delete T[L])}}}function i_(s,t){function e(){let F=!1;const ht=new _e;let tt=null;const gt=new _e(0,0,0,0);return{setMask:function(bt){tt!==bt&&!F&&(s.colorMask(bt,bt,bt,bt),tt=bt)},setLocked:function(bt){F=bt},setClear:function(bt,it,At,Et,Se){Se===!0&&(bt*=Et,it*=Et,At*=Et),ht.set(bt,it,At,Et),gt.equals(ht)===!1&&(s.clearColor(bt,it,At,Et),gt.copy(ht))},reset:function(){F=!1,tt=null,gt.set(-1,0,0,0)}}}function n(){let F=!1,ht=!1,tt=null,gt=null,bt=null;return{setReversed:function(it){if(ht!==it){const At=t.get("EXT_clip_control");it?At.clipControlEXT(At.LOWER_LEFT_EXT,At.ZERO_TO_ONE_EXT):At.clipControlEXT(At.LOWER_LEFT_EXT,At.NEGATIVE_ONE_TO_ONE_EXT),ht=it;const Et=bt;bt=null,this.setClear(Et)}},getReversed:function(){return ht},setTest:function(it){it?Y(s.DEPTH_TEST):st(s.DEPTH_TEST)},setMask:function(it){tt!==it&&!F&&(s.depthMask(it),tt=it)},setFunc:function(it){if(ht&&(it=Np[it]),gt!==it){switch(it){case aa:s.depthFunc(s.NEVER);break;case la:s.depthFunc(s.ALWAYS);break;case ca:s.depthFunc(s.LESS);break;case hs:s.depthFunc(s.LEQUAL);break;case ha:s.depthFunc(s.EQUAL);break;case ua:s.depthFunc(s.GEQUAL);break;case da:s.depthFunc(s.GREATER);break;case fa:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}gt=it}},setLocked:function(it){F=it},setClear:function(it){bt!==it&&(bt=it,ht&&(it=1-it),s.clearDepth(it))},reset:function(){F=!1,tt=null,gt=null,bt=null,ht=!1}}}function i(){let F=!1,ht=null,tt=null,gt=null,bt=null,it=null,At=null,Et=null,Se=null;return{setTest:function(me){F||(me?Y(s.STENCIL_TEST):st(s.STENCIL_TEST))},setMask:function(me){ht!==me&&!F&&(s.stencilMask(me),ht=me)},setFunc:function(me,Bn,zn){(tt!==me||gt!==Bn||bt!==zn)&&(s.stencilFunc(me,Bn,zn),tt=me,gt=Bn,bt=zn)},setOp:function(me,Bn,zn){(it!==me||At!==Bn||Et!==zn)&&(s.stencilOp(me,Bn,zn),it=me,At=Bn,Et=zn)},setLocked:function(me){F=me},setClear:function(me){Se!==me&&(s.clearStencil(me),Se=me)},reset:function(){F=!1,ht=null,tt=null,gt=null,bt=null,it=null,At=null,Et=null,Se=null}}}const r=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap;let u={},h={},d={},f=new WeakMap,p=[],x=null,m=!1,g=null,S=null,w=null,y=null,M=null,E=null,C=null,_=new Bt(0,0,0),T=0,L=!1,D=null,U=null,K=null,Z=null,N=null;const W=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,X=0;const nt=s.getParameter(s.VERSION);nt.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(nt)[1]),B=X>=1):nt.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(nt)[1]),B=X>=2);let ot=null,at={};const xt=s.getParameter(s.SCISSOR_BOX),Ht=s.getParameter(s.VIEWPORT),ve=new _e().fromArray(xt),ee=new _e().fromArray(Ht);function Q(F,ht,tt,gt){const bt=new Uint8Array(4),it=s.createTexture();s.bindTexture(F,it),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let At=0;At<tt;At++)F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY?s.texImage3D(ht,0,s.RGBA,1,1,gt,0,s.RGBA,s.UNSIGNED_BYTE,bt):s.texImage2D(ht+At,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,bt);return it}const I={};I[s.TEXTURE_2D]=Q(s.TEXTURE_2D,s.TEXTURE_2D,1),I[s.TEXTURE_CUBE_MAP]=Q(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),I[s.TEXTURE_2D_ARRAY]=Q(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),I[s.TEXTURE_3D]=Q(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Y(s.DEPTH_TEST),o.setFunc(hs),ne(!1),he(oh),Y(s.CULL_FACE),jt(Pn);function Y(F){u[F]!==!0&&(s.enable(F),u[F]=!0)}function st(F){u[F]!==!1&&(s.disable(F),u[F]=!1)}function dt(F,ht){return d[F]!==ht?(s.bindFramebuffer(F,ht),d[F]=ht,F===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=ht),F===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=ht),!0):!1}function lt(F,ht){let tt=p,gt=!1;if(F){tt=f.get(ht),tt===void 0&&(tt=[],f.set(ht,tt));const bt=F.textures;if(tt.length!==bt.length||tt[0]!==s.COLOR_ATTACHMENT0){for(let it=0,At=bt.length;it<At;it++)tt[it]=s.COLOR_ATTACHMENT0+it;tt.length=bt.length,gt=!0}}else tt[0]!==s.BACK&&(tt[0]=s.BACK,gt=!0);gt&&s.drawBuffers(tt)}function Ot(F){return x!==F?(s.useProgram(F),x=F,!0):!1}const Dt={[ki]:s.FUNC_ADD,[ip]:s.FUNC_SUBTRACT,[sp]:s.FUNC_REVERSE_SUBTRACT};Dt[rp]=s.MIN,Dt[op]=s.MAX;const Gt={[ap]:s.ZERO,[lp]:s.ONE,[cp]:s.SRC_COLOR,[ra]:s.SRC_ALPHA,[mp]:s.SRC_ALPHA_SATURATE,[fp]:s.DST_COLOR,[up]:s.DST_ALPHA,[hp]:s.ONE_MINUS_SRC_COLOR,[oa]:s.ONE_MINUS_SRC_ALPHA,[pp]:s.ONE_MINUS_DST_COLOR,[dp]:s.ONE_MINUS_DST_ALPHA,[gp]:s.CONSTANT_COLOR,[xp]:s.ONE_MINUS_CONSTANT_COLOR,[vp]:s.CONSTANT_ALPHA,[_p]:s.ONE_MINUS_CONSTANT_ALPHA};function jt(F,ht,tt,gt,bt,it,At,Et,Se,me){if(F===Pn){m===!0&&(st(s.BLEND),m=!1);return}if(m===!1&&(Y(s.BLEND),m=!0),F!==np){if(F!==g||me!==L){if((S!==ki||M!==ki)&&(s.blendEquation(s.FUNC_ADD),S=ki,M=ki),me)switch(F){case cs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Lr:s.blendFunc(s.ONE,s.ONE);break;case ah:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case lh:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:te("WebGLState: Invalid blending: ",F);break}else switch(F){case cs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Lr:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case ah:te("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case lh:te("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:te("WebGLState: Invalid blending: ",F);break}w=null,y=null,E=null,C=null,_.set(0,0,0),T=0,g=F,L=me}return}bt=bt||ht,it=it||tt,At=At||gt,(ht!==S||bt!==M)&&(s.blendEquationSeparate(Dt[ht],Dt[bt]),S=ht,M=bt),(tt!==w||gt!==y||it!==E||At!==C)&&(s.blendFuncSeparate(Gt[tt],Gt[gt],Gt[it],Gt[At]),w=tt,y=gt,E=it,C=At),(Et.equals(_)===!1||Se!==T)&&(s.blendColor(Et.r,Et.g,Et.b,Se),_.copy(Et),T=Se),g=F,L=!1}function Qt(F,ht){F.side===Wn?st(s.CULL_FACE):Y(s.CULL_FACE);let tt=F.side===Ye;ht&&(tt=!tt),ne(tt),F.blending===cs&&F.transparent===!1?jt(Pn):jt(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),r.setMask(F.colorWrite);const gt=F.stencilWrite;a.setTest(gt),gt&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Re(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?Y(s.SAMPLE_ALPHA_TO_COVERAGE):st(s.SAMPLE_ALPHA_TO_COVERAGE)}function ne(F){D!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),D=F)}function he(F){F!==Qf?(Y(s.CULL_FACE),F!==U&&(F===oh?s.cullFace(s.BACK):F===tp?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):st(s.CULL_FACE),U=F}function ue(F){F!==K&&(B&&s.lineWidth(F),K=F)}function Re(F,ht,tt){F?(Y(s.POLYGON_OFFSET_FILL),(Z!==ht||N!==tt)&&(Z=ht,N=tt,o.getReversed()&&(ht=-ht),s.polygonOffset(ht,tt))):st(s.POLYGON_OFFSET_FILL)}function be(F){F?Y(s.SCISSOR_TEST):st(s.SCISSOR_TEST)}function Pe(F){F===void 0&&(F=s.TEXTURE0+W-1),ot!==F&&(s.activeTexture(F),ot=F)}function O(F,ht,tt){tt===void 0&&(ot===null?tt=s.TEXTURE0+W-1:tt=ot);let gt=at[tt];gt===void 0&&(gt={type:void 0,texture:void 0},at[tt]=gt),(gt.type!==F||gt.texture!==ht)&&(ot!==tt&&(s.activeTexture(tt),ot=tt),s.bindTexture(F,ht||I[F]),gt.type=F,gt.texture=ht)}function en(){const F=at[ot];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function ae(){try{s.compressedTexImage2D(...arguments)}catch(F){te("WebGLState:",F)}}function A(){try{s.compressedTexImage3D(...arguments)}catch(F){te("WebGLState:",F)}}function v(){try{s.texSubImage2D(...arguments)}catch(F){te("WebGLState:",F)}}function z(){try{s.texSubImage3D(...arguments)}catch(F){te("WebGLState:",F)}}function $(){try{s.compressedTexSubImage2D(...arguments)}catch(F){te("WebGLState:",F)}}function J(){try{s.compressedTexSubImage3D(...arguments)}catch(F){te("WebGLState:",F)}}function ct(){try{s.texStorage2D(...arguments)}catch(F){te("WebGLState:",F)}}function ft(){try{s.texStorage3D(...arguments)}catch(F){te("WebGLState:",F)}}function j(){try{s.texImage2D(...arguments)}catch(F){te("WebGLState:",F)}}function et(){try{s.texImage3D(...arguments)}catch(F){te("WebGLState:",F)}}function pt(F){return h[F]!==void 0?h[F]:s.getParameter(F)}function Ct(F,ht){h[F]!==ht&&(s.pixelStorei(F,ht),h[F]=ht)}function _t(F){ve.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),ve.copy(F))}function mt(F){ee.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),ee.copy(F))}function Nt(F,ht){let tt=c.get(ht);tt===void 0&&(tt=new WeakMap,c.set(ht,tt));let gt=tt.get(F);gt===void 0&&(gt=s.getUniformBlockIndex(ht,F.name),tt.set(F,gt))}function Ft(F,ht){const gt=c.get(ht).get(F);l.get(ht)!==gt&&(s.uniformBlockBinding(ht,gt,F.__bindingPointIndex),l.set(ht,gt))}function Wt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),u={},h={},ot=null,at={},d={},f=new WeakMap,p=[],x=null,m=!1,g=null,S=null,w=null,y=null,M=null,E=null,C=null,_=new Bt(0,0,0),T=0,L=!1,D=null,U=null,K=null,Z=null,N=null,ve.set(0,0,s.canvas.width,s.canvas.height),ee.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:Y,disable:st,bindFramebuffer:dt,drawBuffers:lt,useProgram:Ot,setBlending:jt,setMaterial:Qt,setFlipSided:ne,setCullFace:he,setLineWidth:ue,setPolygonOffset:Re,setScissorTest:be,activeTexture:Pe,bindTexture:O,unbindTexture:en,compressedTexImage2D:ae,compressedTexImage3D:A,texImage2D:j,texImage3D:et,pixelStorei:Ct,getParameter:pt,updateUBOMapping:Nt,uniformBlockBinding:Ft,texStorage2D:ct,texStorage3D:ft,texSubImage2D:v,texSubImage3D:z,compressedTexSubImage2D:$,compressedTexSubImage3D:J,scissor:_t,viewport:mt,reset:Wt}}function s_(s,t,e,n,i,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ut,u=new WeakMap,h=new Set;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(A,v){return p?new OffscreenCanvas(A,v):Vr("canvas")}function m(A,v,z){let $=1;const J=ae(A);if((J.width>z||J.height>z)&&($=z/Math.max(J.width,J.height)),$<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const ct=Math.floor($*J.width),ft=Math.floor($*J.height);d===void 0&&(d=x(ct,ft));const j=v?x(ct,ft):d;return j.width=ct,j.height=ft,j.getContext("2d").drawImage(A,0,0,ct,ft),Ut("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+ct+"x"+ft+")."),j}else return"data"in A&&Ut("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),A;return A}function g(A){return A.generateMipmaps}function S(A){s.generateMipmap(A)}function w(A){return A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?s.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(A,v,z,$,J,ct=!1){if(A!==null){if(s[A]!==void 0)return s[A];Ut("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let ft;$&&(ft=t.get("EXT_texture_norm16"),ft||Ut("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=v;if(v===s.RED&&(z===s.FLOAT&&(j=s.R32F),z===s.HALF_FLOAT&&(j=s.R16F),z===s.UNSIGNED_BYTE&&(j=s.R8),z===s.UNSIGNED_SHORT&&ft&&(j=ft.R16_EXT),z===s.SHORT&&ft&&(j=ft.R16_SNORM_EXT)),v===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(j=s.R8UI),z===s.UNSIGNED_SHORT&&(j=s.R16UI),z===s.UNSIGNED_INT&&(j=s.R32UI),z===s.BYTE&&(j=s.R8I),z===s.SHORT&&(j=s.R16I),z===s.INT&&(j=s.R32I)),v===s.RG&&(z===s.FLOAT&&(j=s.RG32F),z===s.HALF_FLOAT&&(j=s.RG16F),z===s.UNSIGNED_BYTE&&(j=s.RG8),z===s.UNSIGNED_SHORT&&ft&&(j=ft.RG16_EXT),z===s.SHORT&&ft&&(j=ft.RG16_SNORM_EXT)),v===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&(j=s.RG8UI),z===s.UNSIGNED_SHORT&&(j=s.RG16UI),z===s.UNSIGNED_INT&&(j=s.RG32UI),z===s.BYTE&&(j=s.RG8I),z===s.SHORT&&(j=s.RG16I),z===s.INT&&(j=s.RG32I)),v===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&(j=s.RGB8UI),z===s.UNSIGNED_SHORT&&(j=s.RGB16UI),z===s.UNSIGNED_INT&&(j=s.RGB32UI),z===s.BYTE&&(j=s.RGB8I),z===s.SHORT&&(j=s.RGB16I),z===s.INT&&(j=s.RGB32I)),v===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&(j=s.RGBA8UI),z===s.UNSIGNED_SHORT&&(j=s.RGBA16UI),z===s.UNSIGNED_INT&&(j=s.RGBA32UI),z===s.BYTE&&(j=s.RGBA8I),z===s.SHORT&&(j=s.RGBA16I),z===s.INT&&(j=s.RGBA32I)),v===s.RGB&&(z===s.UNSIGNED_SHORT&&ft&&(j=ft.RGB16_EXT),z===s.SHORT&&ft&&(j=ft.RGB16_SNORM_EXT),z===s.UNSIGNED_INT_5_9_9_9_REV&&(j=s.RGB9_E5),z===s.UNSIGNED_INT_10F_11F_11F_REV&&(j=s.R11F_G11F_B10F)),v===s.RGBA){const et=ct?Gr:Jt.getTransfer(J);z===s.FLOAT&&(j=s.RGBA32F),z===s.HALF_FLOAT&&(j=s.RGBA16F),z===s.UNSIGNED_BYTE&&(j=et===se?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT&&ft&&(j=ft.RGBA16_EXT),z===s.SHORT&&ft&&(j=ft.RGBA16_SNORM_EXT),z===s.UNSIGNED_SHORT_4_4_4_4&&(j=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(j=s.RGB5_A1)}return(j===s.R16F||j===s.R32F||j===s.RG16F||j===s.RG32F||j===s.RGBA16F||j===s.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function M(A,v){let z;return A?v===null||v===Dn||v===tr?z=s.DEPTH24_STENCIL8:v===vn?z=s.DEPTH32F_STENCIL8:v===Qs&&(z=s.DEPTH24_STENCIL8,Ut("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Dn||v===tr?z=s.DEPTH_COMPONENT24:v===vn?z=s.DEPTH_COMPONENT32F:v===Qs&&(z=s.DEPTH_COMPONENT16),z}function E(A,v){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==Be&&A.minFilter!==ze?Math.log2(Math.max(v.width,v.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?v.mipmaps.length:1}function C(A){const v=A.target;v.removeEventListener("dispose",C),T(v),v.isVideoTexture&&u.delete(v),v.isHTMLTexture&&h.delete(v)}function _(A){const v=A.target;v.removeEventListener("dispose",_),D(v)}function T(A){const v=n.get(A);if(v.__webglInit===void 0)return;const z=A.source,$=f.get(z);if($){const J=$[v.__cacheKey];J.usedTimes--,J.usedTimes===0&&L(A),Object.keys($).length===0&&f.delete(z)}n.remove(A)}function L(A){const v=n.get(A);s.deleteTexture(v.__webglTexture);const z=A.source,$=f.get(z);delete $[v.__cacheKey],o.memory.textures--}function D(A){const v=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(v.__webglFramebuffer[$]))for(let J=0;J<v.__webglFramebuffer[$].length;J++)s.deleteFramebuffer(v.__webglFramebuffer[$][J]);else s.deleteFramebuffer(v.__webglFramebuffer[$]);v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer[$])}else{if(Array.isArray(v.__webglFramebuffer))for(let $=0;$<v.__webglFramebuffer.length;$++)s.deleteFramebuffer(v.__webglFramebuffer[$]);else s.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&s.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let $=0;$<v.__webglColorRenderbuffer.length;$++)v.__webglColorRenderbuffer[$]&&s.deleteRenderbuffer(v.__webglColorRenderbuffer[$]);v.__webglDepthRenderbuffer&&s.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const z=A.textures;for(let $=0,J=z.length;$<J;$++){const ct=n.get(z[$]);ct.__webglTexture&&(s.deleteTexture(ct.__webglTexture),o.memory.textures--),n.remove(z[$])}n.remove(A)}let U=0;function K(){U=0}function Z(){return U}function N(A){U=A}function W(){const A=U;return A>=i.maxTextures&&Ut("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),U+=1,A}function B(A){const v=[];return v.push(A.wrapS),v.push(A.wrapT),v.push(A.wrapR||0),v.push(A.magFilter),v.push(A.minFilter),v.push(A.anisotropy),v.push(A.internalFormat),v.push(A.format),v.push(A.type),v.push(A.generateMipmaps),v.push(A.premultiplyAlpha),v.push(A.flipY),v.push(A.unpackAlignment),v.push(A.colorSpace),v.join()}function X(A,v){const z=n.get(A);if(A.isVideoTexture&&O(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&z.__version!==A.version){const $=A.image;if($===null)Ut("WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)Ut("WebGLRenderer: Texture marked for update but image is incomplete");else{st(z,A,v);return}}else A.isExternalTexture&&(z.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+v)}function nt(A,v){const z=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&z.__version!==A.version){st(z,A,v);return}else A.isExternalTexture&&(z.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+v)}function ot(A,v){const z=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&z.__version!==A.version){st(z,A,v);return}e.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+v)}function at(A,v){const z=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&z.__version!==A.version){dt(z,A,v);return}e.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+v)}const xt={[Nr]:s.REPEAT,[$n]:s.CLAMP_TO_EDGE,[ba]:s.MIRRORED_REPEAT},Ht={[Be]:s.NEAREST,[bp]:s.NEAREST_MIPMAP_NEAREST,[Ur]:s.NEAREST_MIPMAP_LINEAR,[ze]:s.LINEAR,[Sa]:s.LINEAR_MIPMAP_NEAREST,[zi]:s.LINEAR_MIPMAP_LINEAR},ve={[Ep]:s.NEVER,[Pp]:s.ALWAYS,[Tp]:s.LESS,[ll]:s.LEQUAL,[Ap]:s.EQUAL,[cl]:s.GEQUAL,[Cp]:s.GREATER,[Rp]:s.NOTEQUAL};function ee(A,v){if(v.type===vn&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===ze||v.magFilter===Sa||v.magFilter===Ur||v.magFilter===zi||v.minFilter===ze||v.minFilter===Sa||v.minFilter===Ur||v.minFilter===zi)&&Ut("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(A,s.TEXTURE_WRAP_S,xt[v.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,xt[v.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,xt[v.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,Ht[v.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,Ht[v.minFilter]),v.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,ve[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Be||v.minFilter!==Ur&&v.minFilter!==zi||v.type===vn&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");s.texParameterf(A,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function Q(A,v){let z=!1;A.__webglInit===void 0&&(A.__webglInit=!0,v.addEventListener("dispose",C));const $=v.source;let J=f.get($);J===void 0&&(J={},f.set($,J));const ct=B(v);if(ct!==A.__cacheKey){J[ct]===void 0&&(J[ct]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,z=!0),J[ct].usedTimes++;const ft=J[A.__cacheKey];ft!==void 0&&(J[A.__cacheKey].usedTimes--,ft.usedTimes===0&&L(v)),A.__cacheKey=ct,A.__webglTexture=J[ct].texture}return z}function I(A,v,z){return Math.floor(Math.floor(A/z)/v)}function Y(A,v,z,$){const ct=A.updateRanges;if(ct.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,v.width,v.height,z,$,v.data);else{ct.sort((Ct,_t)=>Ct.start-_t.start);let ft=0;for(let Ct=1;Ct<ct.length;Ct++){const _t=ct[ft],mt=ct[Ct],Nt=_t.start+_t.count,Ft=I(mt.start,v.width,4),Wt=I(_t.start,v.width,4);mt.start<=Nt+1&&Ft===Wt&&I(mt.start+mt.count-1,v.width,4)===Ft?_t.count=Math.max(_t.count,mt.start+mt.count-_t.start):(++ft,ct[ft]=mt)}ct.length=ft+1;const j=e.getParameter(s.UNPACK_ROW_LENGTH),et=e.getParameter(s.UNPACK_SKIP_PIXELS),pt=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,v.width);for(let Ct=0,_t=ct.length;Ct<_t;Ct++){const mt=ct[Ct],Nt=Math.floor(mt.start/4),Ft=Math.ceil(mt.count/4),Wt=Nt%v.width,F=Math.floor(Nt/v.width),ht=Ft,tt=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,Wt),e.pixelStorei(s.UNPACK_SKIP_ROWS,F),e.texSubImage2D(s.TEXTURE_2D,0,Wt,F,ht,tt,z,$,v.data)}A.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,j),e.pixelStorei(s.UNPACK_SKIP_PIXELS,et),e.pixelStorei(s.UNPACK_SKIP_ROWS,pt)}}function st(A,v,z){let $=s.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&($=s.TEXTURE_2D_ARRAY),v.isData3DTexture&&($=s.TEXTURE_3D);const J=Q(A,v),ct=v.source;e.bindTexture($,A.__webglTexture,s.TEXTURE0+z);const ft=n.get(ct);if(ct.version!==ft.__version||J===!0){if(e.activeTexture(s.TEXTURE0+z),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){const tt=Jt.getPrimaries(Jt.workingColorSpace),gt=v.colorSpace===fi?null:Jt.getPrimaries(v.colorSpace),bt=v.colorSpace===fi||tt===gt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt)}e.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment);let et=m(v.image,!1,i.maxTextureSize);et=en(v,et);const pt=r.convert(v.format,v.colorSpace),Ct=r.convert(v.type);let _t=y(v.internalFormat,pt,Ct,v.normalized,v.colorSpace,v.isVideoTexture);ee($,v);let mt;const Nt=v.mipmaps,Ft=v.isVideoTexture!==!0,Wt=ft.__version===void 0||J===!0,F=ct.dataReady,ht=E(v,et);if(v.isDepthTexture)_t=M(v.format===Hi,v.type),Wt&&(Ft?e.texStorage2D(s.TEXTURE_2D,1,_t,et.width,et.height):e.texImage2D(s.TEXTURE_2D,0,_t,et.width,et.height,0,pt,Ct,null));else if(v.isDataTexture)if(Nt.length>0){Ft&&Wt&&e.texStorage2D(s.TEXTURE_2D,ht,_t,Nt[0].width,Nt[0].height);for(let tt=0,gt=Nt.length;tt<gt;tt++)mt=Nt[tt],Ft?F&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,mt.width,mt.height,pt,Ct,mt.data):e.texImage2D(s.TEXTURE_2D,tt,_t,mt.width,mt.height,0,pt,Ct,mt.data);v.generateMipmaps=!1}else Ft?(Wt&&e.texStorage2D(s.TEXTURE_2D,ht,_t,et.width,et.height),F&&Y(v,et,pt,Ct)):e.texImage2D(s.TEXTURE_2D,0,_t,et.width,et.height,0,pt,Ct,et.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ft&&Wt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,ht,_t,Nt[0].width,Nt[0].height,et.depth);for(let tt=0,gt=Nt.length;tt<gt;tt++)if(mt=Nt[tt],v.format!==_n)if(pt!==null)if(Ft){if(F)if(v.layerUpdates.size>0){const bt=mu(mt.width,mt.height,v.format,v.type);for(const it of v.layerUpdates){const At=mt.data.subarray(it*bt/mt.data.BYTES_PER_ELEMENT,(it+1)*bt/mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,it,mt.width,mt.height,1,pt,At)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,0,mt.width,mt.height,et.depth,pt,mt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,tt,_t,mt.width,mt.height,et.depth,0,mt.data,0,0);else Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ft?F&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,0,mt.width,mt.height,et.depth,pt,Ct,mt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,tt,_t,mt.width,mt.height,et.depth,0,pt,Ct,mt.data)}else{Ft&&Wt&&e.texStorage2D(s.TEXTURE_2D,ht,_t,Nt[0].width,Nt[0].height);for(let tt=0,gt=Nt.length;tt<gt;tt++)mt=Nt[tt],v.format!==_n?pt!==null?Ft?F&&e.compressedTexSubImage2D(s.TEXTURE_2D,tt,0,0,mt.width,mt.height,pt,mt.data):e.compressedTexImage2D(s.TEXTURE_2D,tt,_t,mt.width,mt.height,0,mt.data):Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ft?F&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,mt.width,mt.height,pt,Ct,mt.data):e.texImage2D(s.TEXTURE_2D,tt,_t,mt.width,mt.height,0,pt,Ct,mt.data)}else if(v.isDataArrayTexture)if(Ft){if(Wt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,ht,_t,et.width,et.height,et.depth),F)if(v.layerUpdates.size>0){const tt=mu(et.width,et.height,v.format,v.type);for(const gt of v.layerUpdates){const bt=et.data.subarray(gt*tt/et.data.BYTES_PER_ELEMENT,(gt+1)*tt/et.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,gt,et.width,et.height,1,pt,Ct,bt)}v.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,pt,Ct,et.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,_t,et.width,et.height,et.depth,0,pt,Ct,et.data);else if(v.isData3DTexture)Ft?(Wt&&e.texStorage3D(s.TEXTURE_3D,ht,_t,et.width,et.height,et.depth),F&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,pt,Ct,et.data)):e.texImage3D(s.TEXTURE_3D,0,_t,et.width,et.height,et.depth,0,pt,Ct,et.data);else if(v.isFramebufferTexture){if(Wt)if(Ft)e.texStorage2D(s.TEXTURE_2D,ht,_t,et.width,et.height);else{let tt=et.width,gt=et.height;for(let bt=0;bt<ht;bt++)e.texImage2D(s.TEXTURE_2D,bt,_t,tt,gt,0,pt,Ct,null),tt>>=1,gt>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in s){const tt=s.canvas;if(tt.hasAttribute("layoutsubtree")||tt.setAttribute("layoutsubtree","true"),et.parentNode!==tt){tt.appendChild(et),h.add(v),tt.onpaint=gt=>{const bt=gt.changedElements;for(const it of h)bt.includes(it.image)&&(it.needsUpdate=!0)},tt.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,et);else{const bt=s.RGBA,it=s.RGBA,At=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,bt,it,At,et)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Nt.length>0){if(Ft&&Wt){const tt=ae(Nt[0]);e.texStorage2D(s.TEXTURE_2D,ht,_t,tt.width,tt.height)}for(let tt=0,gt=Nt.length;tt<gt;tt++)mt=Nt[tt],Ft?F&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,pt,Ct,mt):e.texImage2D(s.TEXTURE_2D,tt,_t,pt,Ct,mt);v.generateMipmaps=!1}else if(Ft){if(Wt){const tt=ae(et);e.texStorage2D(s.TEXTURE_2D,ht,_t,tt.width,tt.height)}F&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,pt,Ct,et)}else e.texImage2D(s.TEXTURE_2D,0,_t,pt,Ct,et);g(v)&&S($),ft.__version=ct.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function dt(A,v,z){if(v.image.length!==6)return;const $=Q(A,v),J=v.source;e.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+z);const ct=n.get(J);if(J.version!==ct.__version||$===!0){e.activeTexture(s.TEXTURE0+z);const ft=Jt.getPrimaries(Jt.workingColorSpace),j=v.colorSpace===fi?null:Jt.getPrimaries(v.colorSpace),et=v.colorSpace===fi||ft===j?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,et);const pt=v.isCompressedTexture||v.image[0].isCompressedTexture,Ct=v.image[0]&&v.image[0].isDataTexture,_t=[];for(let it=0;it<6;it++)!pt&&!Ct?_t[it]=m(v.image[it],!0,i.maxCubemapSize):_t[it]=Ct?v.image[it].image:v.image[it],_t[it]=en(v,_t[it]);const mt=_t[0],Nt=r.convert(v.format,v.colorSpace),Ft=r.convert(v.type),Wt=y(v.internalFormat,Nt,Ft,v.normalized,v.colorSpace),F=v.isVideoTexture!==!0,ht=ct.__version===void 0||$===!0,tt=J.dataReady;let gt=E(v,mt);ee(s.TEXTURE_CUBE_MAP,v);let bt;if(pt){F&&ht&&e.texStorage2D(s.TEXTURE_CUBE_MAP,gt,Wt,mt.width,mt.height);for(let it=0;it<6;it++){bt=_t[it].mipmaps;for(let At=0;At<bt.length;At++){const Et=bt[At];v.format!==_n?Nt!==null?F?tt&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At,0,0,Et.width,Et.height,Nt,Et.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At,Wt,Et.width,Et.height,0,Et.data):Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At,0,0,Et.width,Et.height,Nt,Ft,Et.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At,Wt,Et.width,Et.height,0,Nt,Ft,Et.data)}}}else{if(bt=v.mipmaps,F&&ht){bt.length>0&&gt++;const it=ae(_t[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,gt,Wt,it.width,it.height)}for(let it=0;it<6;it++)if(Ct){F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,_t[it].width,_t[it].height,Nt,Ft,_t[it].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,Wt,_t[it].width,_t[it].height,0,Nt,Ft,_t[it].data);for(let At=0;At<bt.length;At++){const Se=bt[At].image[it].image;F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At+1,0,0,Se.width,Se.height,Nt,Ft,Se.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At+1,Wt,Se.width,Se.height,0,Nt,Ft,Se.data)}}else{F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,Nt,Ft,_t[it]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,Wt,Nt,Ft,_t[it]);for(let At=0;At<bt.length;At++){const Et=bt[At];F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At+1,0,0,Nt,Ft,Et.image[it]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At+1,Wt,Nt,Ft,Et.image[it])}}}g(v)&&S(s.TEXTURE_CUBE_MAP),ct.__version=J.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function lt(A,v,z,$,J,ct){const ft=r.convert(z.format,z.colorSpace),j=r.convert(z.type),et=y(z.internalFormat,ft,j,z.normalized,z.colorSpace),pt=n.get(v),Ct=n.get(z);if(Ct.__renderTarget=v,!pt.__hasExternalTextures){const _t=Math.max(1,v.width>>ct),mt=Math.max(1,v.height>>ct);J===s.TEXTURE_3D||J===s.TEXTURE_2D_ARRAY?e.texImage3D(J,ct,et,_t,mt,v.depth,0,ft,j,null):e.texImage2D(J,ct,et,_t,mt,0,ft,j,null)}e.bindFramebuffer(s.FRAMEBUFFER,A),Pe(v)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,$,J,Ct.__webglTexture,0,be(v)):(J===s.TEXTURE_2D||J>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,$,J,Ct.__webglTexture,ct),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Ot(A,v,z){if(s.bindRenderbuffer(s.RENDERBUFFER,A),v.depthBuffer){const $=v.depthTexture,J=$&&$.isDepthTexture?$.type:null,ct=M(v.stencilBuffer,J),ft=v.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Pe(v)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,be(v),ct,v.width,v.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,be(v),ct,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,ct,v.width,v.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ft,s.RENDERBUFFER,A)}else{const $=v.textures;for(let J=0;J<$.length;J++){const ct=$[J],ft=r.convert(ct.format,ct.colorSpace),j=r.convert(ct.type),et=y(ct.internalFormat,ft,j,ct.normalized,ct.colorSpace);Pe(v)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,be(v),et,v.width,v.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,be(v),et,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,et,v.width,v.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Dt(A,v,z){const $=v.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,A),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const J=n.get(v.depthTexture);if(J.__renderTarget=v,(!J.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),$){if(J.__webglInit===void 0&&(J.__webglInit=!0,v.depthTexture.addEventListener("dispose",C)),J.__webglTexture===void 0){J.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,J.__webglTexture),ee(s.TEXTURE_CUBE_MAP,v.depthTexture);const pt=r.convert(v.depthTexture.format),Ct=r.convert(v.depthTexture.type);let _t;v.depthTexture.format===Xn?_t=s.DEPTH_COMPONENT24:v.depthTexture.format===Hi&&(_t=s.DEPTH24_STENCIL8);for(let mt=0;mt<6;mt++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,_t,v.width,v.height,0,pt,Ct,null)}}else X(v.depthTexture,0);const ct=J.__webglTexture,ft=be(v),j=$?s.TEXTURE_CUBE_MAP_POSITIVE_X+z:s.TEXTURE_2D,et=v.depthTexture.format===Hi?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(v.depthTexture.format===Xn)Pe(v)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,et,j,ct,0,ft):s.framebufferTexture2D(s.FRAMEBUFFER,et,j,ct,0);else if(v.depthTexture.format===Hi)Pe(v)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,et,j,ct,0,ft):s.framebufferTexture2D(s.FRAMEBUFFER,et,j,ct,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Gt(A){const v=n.get(A),z=A.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==A.depthTexture){const $=A.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),$){const J=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,$.removeEventListener("dispose",J)};$.addEventListener("dispose",J),v.__depthDisposeCallback=J}v.__boundDepthTexture=$}if(A.depthTexture&&!v.__autoAllocateDepthBuffer)if(z)for(let $=0;$<6;$++)Dt(v.__webglFramebuffer[$],A,$);else{const $=A.texture.mipmaps;$&&$.length>0?Dt(v.__webglFramebuffer[0],A,0):Dt(v.__webglFramebuffer,A,0)}else if(z){v.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[$]),v.__webglDepthbuffer[$]===void 0)v.__webglDepthbuffer[$]=s.createRenderbuffer(),Ot(v.__webglDepthbuffer[$],A,!1);else{const J=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ct=v.__webglDepthbuffer[$];s.bindRenderbuffer(s.RENDERBUFFER,ct),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,ct)}}else{const $=A.texture.mipmaps;if($&&$.length>0?e.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=s.createRenderbuffer(),Ot(v.__webglDepthbuffer,A,!1);else{const J=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ct=v.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ct),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,ct)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function jt(A,v,z){const $=n.get(A);v!==void 0&&lt($.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&Gt(A)}function Qt(A){const v=A.texture,z=n.get(A),$=n.get(v);A.addEventListener("dispose",_);const J=A.textures,ct=A.isWebGLCubeRenderTarget===!0,ft=J.length>1;if(ft||($.__webglTexture===void 0&&($.__webglTexture=s.createTexture()),$.__version=v.version,o.memory.textures++),ct){z.__webglFramebuffer=[];for(let j=0;j<6;j++)if(v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer[j]=[];for(let et=0;et<v.mipmaps.length;et++)z.__webglFramebuffer[j][et]=s.createFramebuffer()}else z.__webglFramebuffer[j]=s.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer=[];for(let j=0;j<v.mipmaps.length;j++)z.__webglFramebuffer[j]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(ft)for(let j=0,et=J.length;j<et;j++){const pt=n.get(J[j]);pt.__webglTexture===void 0&&(pt.__webglTexture=s.createTexture(),o.memory.textures++)}if(A.samples>0&&Pe(A)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let j=0;j<J.length;j++){const et=J[j];z.__webglColorRenderbuffer[j]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[j]);const pt=r.convert(et.format,et.colorSpace),Ct=r.convert(et.type),_t=y(et.internalFormat,pt,Ct,et.normalized,et.colorSpace,A.isXRRenderTarget===!0),mt=be(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,mt,_t,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+j,s.RENDERBUFFER,z.__webglColorRenderbuffer[j])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),Ot(z.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ct){e.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture),ee(s.TEXTURE_CUBE_MAP,v);for(let j=0;j<6;j++)if(v.mipmaps&&v.mipmaps.length>0)for(let et=0;et<v.mipmaps.length;et++)lt(z.__webglFramebuffer[j][et],A,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+j,et);else lt(z.__webglFramebuffer[j],A,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);g(v)&&S(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ft){for(let j=0,et=J.length;j<et;j++){const pt=J[j],Ct=n.get(pt);let _t=s.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(_t=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(_t,Ct.__webglTexture),ee(_t,pt),lt(z.__webglFramebuffer,A,pt,s.COLOR_ATTACHMENT0+j,_t,0),g(pt)&&S(_t)}e.unbindTexture()}else{let j=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(j=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(j,$.__webglTexture),ee(j,v),v.mipmaps&&v.mipmaps.length>0)for(let et=0;et<v.mipmaps.length;et++)lt(z.__webglFramebuffer[et],A,v,s.COLOR_ATTACHMENT0,j,et);else lt(z.__webglFramebuffer,A,v,s.COLOR_ATTACHMENT0,j,0);g(v)&&S(j),e.unbindTexture()}A.depthBuffer&&Gt(A)}function ne(A){const v=A.textures;for(let z=0,$=v.length;z<$;z++){const J=v[z];if(g(J)){const ct=w(A),ft=n.get(J).__webglTexture;e.bindTexture(ct,ft),S(ct),e.unbindTexture()}}}const he=[],ue=[];function Re(A){if(A.samples>0){if(Pe(A)===!1){const v=A.textures,z=A.width,$=A.height;let J=s.COLOR_BUFFER_BIT;const ct=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ft=n.get(A),j=v.length>1;if(j)for(let pt=0;pt<v.length;pt++)e.bindFramebuffer(s.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,ft.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,ft.__webglMultisampledFramebuffer);const et=A.texture.mipmaps;et&&et.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ft.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ft.__webglFramebuffer);for(let pt=0;pt<v.length;pt++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(J|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(J|=s.STENCIL_BUFFER_BIT)),j){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ft.__webglColorRenderbuffer[pt]);const Ct=n.get(v[pt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ct,0)}s.blitFramebuffer(0,0,z,$,0,0,z,$,J,s.NEAREST),l===!0&&(he.length=0,ue.length=0,he.push(s.COLOR_ATTACHMENT0+pt),A.depthBuffer&&A.resolveDepthBuffer===!1&&(he.push(ct),ue.push(ct),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,ue)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,he))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),j)for(let pt=0;pt<v.length;pt++){e.bindFramebuffer(s.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.RENDERBUFFER,ft.__webglColorRenderbuffer[pt]);const Ct=n.get(v[pt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,ft.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.TEXTURE_2D,Ct,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ft.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const v=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[v])}}}function be(A){return Math.min(i.maxSamples,A.samples)}function Pe(A){const v=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function O(A){const v=o.render.frame;u.get(A)!==v&&(u.set(A,v),A.update())}function en(A,v){const z=A.colorSpace,$=A.format,J=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||z!==er&&z!==fi&&(Jt.getTransfer(z)===se?($!==_n||J!==nn)&&Ut("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):te("WebGLTextures: Unsupported texture color space:",z)),v}function ae(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=K,this.getTextureUnits=Z,this.setTextureUnits=N,this.setTexture2D=X,this.setTexture2DArray=nt,this.setTexture3D=ot,this.setTextureCube=at,this.rebindTextures=jt,this.setupRenderTarget=Qt,this.updateRenderTargetMipmap=ne,this.updateMultisampleRenderTarget=Re,this.setupDepthRenderbuffer=Gt,this.setupFrameBufferTexture=lt,this.useMultisampledRTT=Pe,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function r_(s,t){function e(n,i=fi){let r;const o=Jt.getTransfer(i);if(n===nn)return s.UNSIGNED_BYTE;if(n===Ea)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Ta)return s.UNSIGNED_SHORT_5_5_5_1;if(n===fh)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===ph)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===uh)return s.BYTE;if(n===dh)return s.SHORT;if(n===Qs)return s.UNSIGNED_SHORT;if(n===wa)return s.INT;if(n===Dn)return s.UNSIGNED_INT;if(n===vn)return s.FLOAT;if(n===sn)return s.HALF_FLOAT;if(n===mh)return s.ALPHA;if(n===gh)return s.RGB;if(n===_n)return s.RGBA;if(n===Xn)return s.DEPTH_COMPONENT;if(n===Hi)return s.DEPTH_STENCIL;if(n===Aa)return s.RED;if(n===Ca)return s.RED_INTEGER;if(n===Gi)return s.RG;if(n===Ra)return s.RG_INTEGER;if(n===Pa)return s.RGBA_INTEGER;if(n===Fr||n===Or||n===kr||n===Br)if(o===se)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Fr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Or)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Fr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Or)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===kr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Br)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===La||n===Da||n===Ia||n===Na)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===La)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Da)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ia)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Na)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ua||n===Fa||n===Oa||n===ka||n===Ba||n===zr||n===za)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ua||n===Fa)return o===se?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Oa)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===ka)return r.COMPRESSED_R11_EAC;if(n===Ba)return r.COMPRESSED_SIGNED_R11_EAC;if(n===zr)return r.COMPRESSED_RG11_EAC;if(n===za)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ha||n===Ga||n===Va||n===Wa||n===$a||n===Xa||n===Ya||n===qa||n===Ka||n===Za||n===Ja||n===ja||n===Qa||n===tl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ha)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ga)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Va)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wa)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===$a)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Xa)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ya)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===qa)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ka)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Za)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ja)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ja)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Qa)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===tl)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===el||n===nl||n===il)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===el)return o===se?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===nl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===il)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===sl||n===rl||n===Hr||n===ol)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===sl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===rl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Hr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ol)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===tr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}const o_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,a_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class l_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Jh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Le({vertexShader:o_,fragmentShader:a_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Zt(new fn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class c_ extends pi{constructor(t,e){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,p=null;const x=typeof XRWebGLBinding<"u",m=new l_,g={},S=e.getContextAttributes();let w=null,y=null;const M=[],E=[],C=new ut;let _=null;const T=new je;T.viewport=new _e;const L=new je;L.viewport=new _e;const D=[T,L],U=new qm;let K=null,Z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let I=M[Q];return I===void 0&&(I=new vl,M[Q]=I),I.getTargetRaySpace()},this.getControllerGrip=function(Q){let I=M[Q];return I===void 0&&(I=new vl,M[Q]=I),I.getGripSpace()},this.getHand=function(Q){let I=M[Q];return I===void 0&&(I=new vl,M[Q]=I),I.getHandSpace()};function N(Q){const I=E.indexOf(Q.inputSource);if(I===-1)return;const Y=M[I];Y!==void 0&&(Y.update(Q.inputSource,Q.frame,c||o),Y.dispatchEvent({type:Q.type,data:Q.inputSource}))}function W(){i.removeEventListener("select",N),i.removeEventListener("selectstart",N),i.removeEventListener("selectend",N),i.removeEventListener("squeeze",N),i.removeEventListener("squeezestart",N),i.removeEventListener("squeezeend",N),i.removeEventListener("end",W),i.removeEventListener("inputsourceschange",B);for(let Q=0;Q<M.length;Q++){const I=E[Q];I!==null&&(E[Q]=null,M[Q].disconnect(I))}K=null,Z=null,m.reset();for(const Q in g)delete g[Q];t.setRenderTarget(w),f=null,d=null,h=null,i=null,y=null,ee.stop(),n.isPresenting=!1,t.setPixelRatio(_),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,n.isPresenting===!0&&Ut("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){a=Q,n.isPresenting===!0&&Ut("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&x&&(h=new XRWebGLBinding(i,e)),h},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(Q){if(i=Q,i!==null){if(w=t.getRenderTarget(),i.addEventListener("select",N),i.addEventListener("selectstart",N),i.addEventListener("selectend",N),i.addEventListener("squeeze",N),i.addEventListener("squeezestart",N),i.addEventListener("squeezeend",N),i.addEventListener("end",W),i.addEventListener("inputsourceschange",B),S.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Y=null,st=null,dt=null;S.depth&&(dt=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Y=S.stencil?Hi:Xn,st=S.stencil?tr:Dn);const lt={colorFormat:e.RGBA8,depthFormat:dt,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(lt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new Ze(d.textureWidth,d.textureHeight,{format:_n,type:nn,depthTexture:new Ds(d.textureWidth,d.textureHeight,st,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Y={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,Y),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Ze(f.framebufferWidth,f.framebufferHeight,{format:_n,type:nn,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),ee.setContext(i),ee.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function B(Q){for(let I=0;I<Q.removed.length;I++){const Y=Q.removed[I],st=E.indexOf(Y);st>=0&&(E[st]=null,M[st].disconnect(Y))}for(let I=0;I<Q.added.length;I++){const Y=Q.added[I];let st=E.indexOf(Y);if(st===-1){for(let lt=0;lt<M.length;lt++)if(lt>=E.length){E.push(Y),st=lt;break}else if(E[lt]===null){E[lt]=Y,st=lt;break}if(st===-1)break}const dt=M[st];dt&&dt.connect(Y)}}const X=new P,nt=new P;function ot(Q,I,Y){X.setFromMatrixPosition(I.matrixWorld),nt.setFromMatrixPosition(Y.matrixWorld);const st=X.distanceTo(nt),dt=I.projectionMatrix.elements,lt=Y.projectionMatrix.elements,Ot=dt[14]/(dt[10]-1),Dt=dt[14]/(dt[10]+1),Gt=(dt[9]+1)/dt[5],jt=(dt[9]-1)/dt[5],Qt=(dt[8]-1)/dt[0],ne=(lt[8]+1)/lt[0],he=Ot*Qt,ue=Ot*ne,Re=st/(-Qt+ne),be=Re*-Qt;if(I.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(be),Q.translateZ(Re),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),dt[10]===-1)Q.projectionMatrix.copy(I.projectionMatrix),Q.projectionMatrixInverse.copy(I.projectionMatrixInverse);else{const Pe=Ot+Re,O=Dt+Re,en=he-be,ae=ue+(st-be),A=Gt*Dt/O*Pe,v=jt*Dt/O*Pe;Q.projectionMatrix.makePerspective(en,ae,A,v,Pe,O),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function at(Q,I){I===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(I.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(i===null)return;let I=Q.near,Y=Q.far;m.texture!==null&&(m.depthNear>0&&(I=m.depthNear),m.depthFar>0&&(Y=m.depthFar)),U.near=L.near=T.near=I,U.far=L.far=T.far=Y,(K!==U.near||Z!==U.far)&&(i.updateRenderState({depthNear:U.near,depthFar:U.far}),K=U.near,Z=U.far),U.layers.mask=Q.layers.mask|6,T.layers.mask=U.layers.mask&-5,L.layers.mask=U.layers.mask&-3;const st=Q.parent,dt=U.cameras;at(U,st);for(let lt=0;lt<dt.length;lt++)at(dt[lt],st);dt.length===2?ot(U,T,L):U.projectionMatrix.copy(T.projectionMatrix),xt(Q,U,st)};function xt(Q,I,Y){Y===null?Q.matrix.copy(I.matrixWorld):(Q.matrix.copy(Y.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(I.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(I.projectionMatrix),Q.projectionMatrixInverse.copy(I.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=ps*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Q){l=Q,d!==null&&(d.fixedFoveation=Q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(U)},this.getCameraTexture=function(Q){return g[Q]};let Ht=null;function ve(Q,I){if(u=I.getViewerPose(c||o),p=I,u!==null){const Y=u.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let st=!1;Y.length!==U.cameras.length&&(U.cameras.length=0,st=!0);for(let Dt=0;Dt<Y.length;Dt++){const Gt=Y[Dt];let jt=null;if(f!==null)jt=f.getViewport(Gt);else{const ne=h.getViewSubImage(d,Gt);jt=ne.viewport,Dt===0&&(t.setRenderTargetTextures(y,ne.colorTexture,ne.depthStencilTexture),t.setRenderTarget(y))}let Qt=D[Dt];Qt===void 0&&(Qt=new je,Qt.layers.enable(Dt),Qt.viewport=new _e,D[Dt]=Qt),Qt.matrix.fromArray(Gt.transform.matrix),Qt.matrix.decompose(Qt.position,Qt.quaternion,Qt.scale),Qt.projectionMatrix.fromArray(Gt.projectionMatrix),Qt.projectionMatrixInverse.copy(Qt.projectionMatrix).invert(),Qt.viewport.set(jt.x,jt.y,jt.width,jt.height),Dt===0&&(U.matrix.copy(Qt.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),st===!0&&U.cameras.push(Qt)}const dt=i.enabledFeatures;if(dt&&dt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&x){h=n.getBinding();const Dt=h.getDepthInformation(Y[0]);Dt&&Dt.isValid&&Dt.texture&&m.init(Dt,i.renderState)}if(dt&&dt.includes("camera-access")&&x){t.state.unbindTexture(),h=n.getBinding();for(let Dt=0;Dt<Y.length;Dt++){const Gt=Y[Dt].camera;if(Gt){let jt=g[Gt];jt||(jt=new Jh,g[Gt]=jt);const Qt=h.getCameraImage(Gt);jt.sourceTexture=Qt}}}}for(let Y=0;Y<M.length;Y++){const st=E[Y],dt=M[Y];st!==null&&dt!==void 0&&dt.update(st,I,c||o)}Ht&&Ht(Q,I),I.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:I}),p=null}const ee=new gu;ee.setAnimationLoop(ve),this.setAnimationLoop=function(Q){Ht=Q},this.dispose=function(){}}}const h_=new re,Xu=new zt;Xu.set(-1,0,0,0,1,0,0,0,1);function u_(s,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,ru(s)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,S,w,y){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),h(m,g)):g.isMeshPhongMaterial?(r(m,g),u(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,y)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),x(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(o(m,g),g.isLineDashedMaterial&&a(m,g)):g.isPointsMaterial?l(m,g,S,w):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===Ye&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===Ye&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const S=t.get(g),w=S.envMap,y=S.envMapRotation;w&&(m.envMap.value=w,m.envMapRotation.value.setFromMatrix4(h_.makeRotationFromEuler(y)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Xu),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function o(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function a(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,S,w){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*S,m.scale.value=w*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function u(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function h(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,S){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Ye&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function x(m,g){const S=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function d_(s,t,e,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,M){const E=M.program;n.uniformBlockBinding(y,E)}function c(y,M){let E=i[y.id];E===void 0&&(m(y),E=u(y),i[y.id]=E,y.addEventListener("dispose",S));const C=M.program;n.updateUBOMapping(y,C);const _=t.render.frame;r[y.id]!==_&&(d(y),r[y.id]=_)}function u(y){const M=h();y.__bindingPointIndex=M;const E=s.createBuffer(),C=y.__size,_=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,E),s.bufferData(s.UNIFORM_BUFFER,C,_),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,M,E),E}function h(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return te("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const M=i[y.id],E=y.uniforms,C=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,M);for(let _=0,T=E.length;_<T;_++){const L=E[_];if(Array.isArray(L))for(let D=0,U=L.length;D<U;D++)f(L[D],_,D,C);else f(L,_,0,C)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(y,M,E,C){if(x(y,M,E,C)===!0){const _=y.__offset,T=y.value;if(Array.isArray(T)){let L=0;for(let D=0;D<T.length;D++){const U=T[D],K=g(U);p(U,y.__data,L),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(L+=K.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(T,y.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,_,y.__data)}}function p(y,M,E){typeof y=="number"||typeof y=="boolean"?M[0]=y:y.isMatrix3?(M[0]=y.elements[0],M[1]=y.elements[1],M[2]=y.elements[2],M[3]=0,M[4]=y.elements[3],M[5]=y.elements[4],M[6]=y.elements[5],M[7]=0,M[8]=y.elements[6],M[9]=y.elements[7],M[10]=y.elements[8],M[11]=0):ArrayBuffer.isView(y)?M.set(new y.constructor(y.buffer,y.byteOffset,M.length)):y.toArray(M,E)}function x(y,M,E,C){const _=y.value,T=M+"_"+E;if(C[T]===void 0)return typeof _=="number"||typeof _=="boolean"?C[T]=_:ArrayBuffer.isView(_)?C[T]=_.slice():C[T]=_.clone(),!0;{const L=C[T];if(typeof _=="number"||typeof _=="boolean"){if(L!==_)return C[T]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(L.equals(_)===!1)return L.copy(_),!0}}return!1}function m(y){const M=y.uniforms;let E=0;const C=16;for(let T=0,L=M.length;T<L;T++){const D=Array.isArray(M[T])?M[T]:[M[T]];for(let U=0,K=D.length;U<K;U++){const Z=D[U],N=Array.isArray(Z.value)?Z.value:[Z.value];for(let W=0,B=N.length;W<B;W++){const X=N[W],nt=g(X),ot=E%C,at=ot%nt.boundary,xt=ot+at;E+=at,xt!==0&&C-xt<nt.storage&&(E+=C-xt),Z.__data=new Float32Array(nt.storage/Float32Array.BYTES_PER_ELEMENT),Z.__offset=E,E+=nt.storage}}}const _=E%C;return _>0&&(E+=C-_),y.__size=E,y.__cache={},this}function g(y){const M={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(M.boundary=4,M.storage=4):y.isVector2?(M.boundary=8,M.storage=8):y.isVector3||y.isColor?(M.boundary=16,M.storage=12):y.isVector4?(M.boundary=16,M.storage=16):y.isMatrix3?(M.boundary=48,M.storage=48):y.isMatrix4?(M.boundary=64,M.storage=64):y.isTexture?Ut("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(M.boundary=16,M.storage=y.byteLength):Ut("WebGLRenderer: Unsupported uniform value type.",y),M}function S(y){const M=y.target;M.removeEventListener("dispose",S);const E=o.indexOf(M.__bindingPointIndex);o.splice(E,1),s.deleteBuffer(i[M.id]),delete i[M.id],delete r[M.id]}function w(){for(const y in i)s.deleteBuffer(i[y]);o=[],i={},r={}}return{bind:l,update:c,dispose:w}}const f_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let On=null;function p_(){return On===null&&(On=new Gh(f_,16,16,Gi,sn),On.name="DFG_LUT",On.minFilter=ze,On.magFilter=ze,On.wrapS=$n,On.wrapT=$n,On.generateMipmaps=!1,On.needsUpdate=!0),On}class m_{constructor(t={}){const{canvas:e=Dp(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:f=nn}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const x=f,m=new Set([Pa,Ra,Ca]),g=new Set([nn,Dn,Qs,tr,Ea,Ta]),S=new Uint32Array(4),w=new Int32Array(4),y=new P;let M=null,E=null;const C=[],_=[];let T=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ln,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let D=!1,U=null,K=null,Z=null,N=null;this._outputColorSpace=Ue;let W=0,B=0,X=null,nt=-1,ot=null;const at=new _e,xt=new _e;let Ht=null;const ve=new Bt(0);let ee=0,Q=e.width,I=e.height,Y=1,st=null,dt=null;const lt=new _e(0,0,Q,I),Ot=new _e(0,0,Q,I);let Dt=!1;const Gt=new ho;let jt=!1,Qt=!1;const ne=new re,he=new P,ue=new _e,Re={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let be=!1;function Pe(){return X===null?Y:1}let O=n;function en(b,k){return e.getContext(b,k)}try{const b={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${sa}`),e.addEventListener("webglcontextlost",Se,!1),e.addEventListener("webglcontextrestored",me,!1),e.addEventListener("webglcontextcreationerror",Bn,!1),O===null){const k="webgl2";if(O=en(k,b),O===null)throw en(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(b){throw te("WebGLRenderer: "+b.message),b}let ae,A,v,z,$,J,ct,ft,j,et,pt,Ct,_t,mt,Nt,Ft,Wt,F,ht,tt,gt,bt,it;function At(){ae=new px(O),ae.init(),gt=new r_(O,ae),A=new ox(O,ae,t,gt),v=new i_(O,ae),A.reversedDepthBuffer&&d&&v.buffers.depth.setReversed(!0),K=O.createFramebuffer(),Z=O.createFramebuffer(),N=O.createFramebuffer(),z=new xx(O),$=new Vv,J=new s_(O,ae,v,$,A,gt,z),ct=new fx(L),ft=new e0(O),bt=new sx(O,ft),j=new mx(O,ft,z,bt),et=new _x(O,j,ft,bt,z),F=new vx(O,A,J),Nt=new ax($),pt=new Gv(L,ct,ae,A,bt,Nt),Ct=new u_(L,$),_t=new $v,mt=new Jv(ae),Wt=new ix(L,ct,v,et,p,l),Ft=new n_(L,et,A),it=new d_(O,z,A,v),ht=new rx(O,ae,z),tt=new gx(O,ae,z),z.programs=pt.programs,L.capabilities=A,L.extensions=ae,L.properties=$,L.renderLists=_t,L.shadowMap=Ft,L.state=v,L.info=z}At(),x!==nn&&(T=new Mx(x,e.width,e.height,a,i,r));const Et=new c_(L,O);this.xr=Et,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const b=ae.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=ae.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(b){b!==void 0&&(Y=b,this.setSize(Q,I,!1))},this.getSize=function(b){return b.set(Q,I)},this.setSize=function(b,k,q=!0){if(Et.isPresenting){Ut("WebGLRenderer: Can't change size while VR device is presenting.");return}Q=b,I=k,e.width=Math.floor(b*Y),e.height=Math.floor(k*Y),q===!0&&(e.style.width=b+"px",e.style.height=k+"px"),T!==null&&T.setSize(e.width,e.height),this.setViewport(0,0,b,k)},this.getDrawingBufferSize=function(b){return b.set(Q*Y,I*Y).floor()},this.setDrawingBufferSize=function(b,k,q){Q=b,I=k,Y=q,e.width=Math.floor(b*q),e.height=Math.floor(k*q),this.setViewport(0,0,b,k)},this.setEffects=function(b){if(x===nn){te("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let k=0;k<b.length;k++)if(b[k].isOutputPass===!0){Ut("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(at)},this.getViewport=function(b){return b.copy(lt)},this.setViewport=function(b,k,q,H){b.isVector4?lt.set(b.x,b.y,b.z,b.w):lt.set(b,k,q,H),v.viewport(at.copy(lt).multiplyScalar(Y).round())},this.getScissor=function(b){return b.copy(Ot)},this.setScissor=function(b,k,q,H){b.isVector4?Ot.set(b.x,b.y,b.z,b.w):Ot.set(b,k,q,H),v.scissor(xt.copy(Ot).multiplyScalar(Y).round())},this.getScissorTest=function(){return Dt},this.setScissorTest=function(b){v.setScissorTest(Dt=b)},this.setOpaqueSort=function(b){st=b},this.setTransparentSort=function(b){dt=b},this.getClearColor=function(b){return b.copy(Wt.getClearColor())},this.setClearColor=function(){Wt.setClearColor(...arguments)},this.getClearAlpha=function(){return Wt.getClearAlpha()},this.setClearAlpha=function(){Wt.setClearAlpha(...arguments)},this.clear=function(b=!0,k=!0,q=!0){let H=0;if(b){let G=!1;if(X!==null){const Mt=X.texture.format;G=m.has(Mt)}if(G){const Mt=X.texture.type,wt=g.has(Mt),yt=Wt.getClearColor(),Tt=Wt.getClearAlpha(),Rt=yt.r,$t=yt.g,qt=yt.b;wt?(S[0]=Rt,S[1]=$t,S[2]=qt,S[3]=Tt,O.clearBufferuiv(O.COLOR,0,S)):(w[0]=Rt,w[1]=$t,w[2]=qt,w[3]=Tt,O.clearBufferiv(O.COLOR,0,w))}else H|=O.COLOR_BUFFER_BIT}k&&(H|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(H|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&O.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),U=b},this.dispose=function(){e.removeEventListener("webglcontextlost",Se,!1),e.removeEventListener("webglcontextrestored",me,!1),e.removeEventListener("webglcontextcreationerror",Bn,!1),Wt.dispose(),_t.dispose(),mt.dispose(),$.dispose(),ct.dispose(),et.dispose(),bt.dispose(),it.dispose(),pt.dispose(),Et.dispose(),Et.removeEventListener("sessionstart",Nd),Et.removeEventListener("sessionend",Ud),Ji.stop()};function Se(b){b.preventDefault(),Mh("WebGLRenderer: Context Lost."),D=!0}function me(){Mh("WebGLRenderer: Context Restored."),D=!1;const b=z.autoReset,k=Ft.enabled,q=Ft.autoUpdate,H=Ft.needsUpdate,G=Ft.type;At(),z.autoReset=b,Ft.enabled=k,Ft.autoUpdate=q,Ft.needsUpdate=H,Ft.type=G}function Bn(b){te("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function zn(b){const k=b.target;k.removeEventListener("dispose",zn),Zy(k)}function Zy(b){Jy(b),$.remove(b)}function Jy(b){const k=$.get(b).programs;k!==void 0&&(k.forEach(function(q){pt.releaseProgram(q)}),b.isShaderMaterial&&pt.releaseShaderCache(b))}this.renderBufferDirect=function(b,k,q,H,G,Mt){k===null&&(k=Re);const wt=G.isMesh&&G.matrixWorld.determinantAffine()<0,yt=tM(b,k,q,H,G);v.setMaterial(H,wt);let Tt=q.index,Rt=1;if(H.wireframe===!0){if(Tt=j.getWireframeAttribute(q),Tt===void 0)return;Rt=2}const $t=q.drawRange,qt=q.attributes.position;let Lt=$t.start*Rt,ce=($t.start+$t.count)*Rt;Mt!==null&&(Lt=Math.max(Lt,Mt.start*Rt),ce=Math.min(ce,(Mt.start+Mt.count)*Rt)),Tt!==null?(Lt=Math.max(Lt,0),ce=Math.min(ce,Tt.count)):qt!=null&&(Lt=Math.max(Lt,0),ce=Math.min(ce,qt.count));const Ee=ce-Lt;if(Ee<0||Ee===1/0)return;bt.setup(G,H,yt,q,Tt);let we,de=ht;if(Tt!==null&&(we=ft.get(Tt),de=tt,de.setIndex(we)),G.isMesh)H.wireframe===!0?(v.setLineWidth(H.wireframeLinewidth*Pe()),de.setMode(O.LINES)):de.setMode(O.TRIANGLES);else if(G.isLine){let $e=H.linewidth;$e===void 0&&($e=1),v.setLineWidth($e*Pe()),G.isLineSegments?de.setMode(O.LINES):G.isLineLoop?de.setMode(O.LINE_LOOP):de.setMode(O.LINE_STRIP)}else G.isPoints?de.setMode(O.POINTS):G.isSprite&&de.setMode(O.TRIANGLES);if(G.isBatchedMesh)if(ae.get("WEBGL_multi_draw"))de.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const $e=G._multiDrawStarts,St=G._multiDrawCounts,an=G._multiDrawCount,ie=Tt?ft.get(Tt).bytesPerElement:1,mn=$.get(H).currentProgram.getUniforms();for(let Hn=0;Hn<an;Hn++)mn.setValue(O,"_gl_DrawID",Hn),de.render($e[Hn]/ie,St[Hn])}else if(G.isInstancedMesh)de.renderInstances(Lt,Ee,G.count);else if(q.isInstancedBufferGeometry){const $e=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,St=Math.min(q.instanceCount,$e);de.renderInstances(Lt,Ee,St)}else de.render(Lt,Ee)};function Id(b,k,q){b.transparent===!0&&b.side===Wn&&b.forceSinglePass===!1?(b.side=Ye,b.needsUpdate=!0,Fo(b,k,q),b.side=di,b.needsUpdate=!0,Fo(b,k,q),b.side=Wn):Fo(b,k,q)}this.compile=function(b,k,q=null){q===null&&(q=b),E=mt.get(q),E.init(k),_.push(E),q.traverseVisible(function(G){G.isLight&&G.layers.test(k.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),b!==q&&b.traverseVisible(function(G){G.isLight&&G.layers.test(k.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),E.setupLights();const H=new Set;return b.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const Mt=G.material;if(Mt)if(Array.isArray(Mt))for(let wt=0;wt<Mt.length;wt++){const yt=Mt[wt];Id(yt,q,G),H.add(yt)}else Id(Mt,q,G),H.add(Mt)}),E=_.pop(),H},this.compileAsync=function(b,k,q=null){const H=this.compile(b,k,q);return new Promise(G=>{function Mt(){if(H.forEach(function(wt){$.get(wt).currentProgram.isReady()&&H.delete(wt)}),H.size===0){G(b);return}setTimeout(Mt,10)}ae.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let Pc=null;function jy(b){Pc&&Pc(b)}function Nd(){Ji.stop()}function Ud(){Ji.start()}const Ji=new gu;Ji.setAnimationLoop(jy),typeof self<"u"&&Ji.setContext(self),this.setAnimationLoop=function(b){Pc=b,Et.setAnimationLoop(b),b===null?Ji.stop():Ji.start()},Et.addEventListener("sessionstart",Nd),Et.addEventListener("sessionend",Ud),this.render=function(b,k){if(k!==void 0&&k.isCamera!==!0){te("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;U!==null&&U.renderStart(b,k);const q=Et.enabled===!0&&Et.isPresenting===!0,H=T!==null&&(X===null||q)&&T.begin(L,X);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Et.enabled===!0&&Et.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(Et.cameraAutoUpdate===!0&&Et.updateCamera(k),k=Et.getCamera()),b.isScene===!0&&b.onBeforeRender(L,b,k,X),E=mt.get(b,_.length),E.init(k),E.state.textureUnits=J.getTextureUnits(),_.push(E),ne.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),Gt.setFromProjectionMatrix(ne,In,k.reversedDepth),Qt=this.localClippingEnabled,jt=Nt.init(this.clippingPlanes,Qt),M=_t.get(b,C.length),M.init(),C.push(M),Et.enabled===!0&&Et.isPresenting===!0){const wt=L.xr.getDepthSensingMesh();wt!==null&&Lc(wt,k,-1/0,L.sortObjects)}Lc(b,k,0,L.sortObjects),M.finish(),L.sortObjects===!0&&M.sort(st,dt,k.reversedDepth),be=Et.enabled===!1||Et.isPresenting===!1||Et.hasDepthSensing()===!1,be&&Wt.addToRenderList(M,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),jt===!0&&Nt.beginShadows();const G=E.state.shadowsArray;if(Ft.render(G,b,k),jt===!0&&Nt.endShadows(),(H&&T.hasRenderPass())===!1){const wt=M.opaque,yt=M.transmissive;if(E.setupLights(),k.isArrayCamera){const Tt=k.cameras;if(yt.length>0)for(let Rt=0,$t=Tt.length;Rt<$t;Rt++){const qt=Tt[Rt];Od(wt,yt,b,qt)}be&&Wt.render(b);for(let Rt=0,$t=Tt.length;Rt<$t;Rt++){const qt=Tt[Rt];Fd(M,b,qt,qt.viewport)}}else yt.length>0&&Od(wt,yt,b,k),be&&Wt.render(b),Fd(M,b,k)}X!==null&&B===0&&(J.updateMultisampleRenderTarget(X),J.updateRenderTargetMipmap(X)),H&&T.end(L),b.isScene===!0&&b.onAfterRender(L,b,k),bt.resetDefaultState(),nt=-1,ot=null,_.pop(),_.length>0?(E=_[_.length-1],J.setTextureUnits(E.state.textureUnits),jt===!0&&Nt.setGlobalState(L.clippingPlanes,E.state.camera)):E=null,C.pop(),C.length>0?M=C[C.length-1]:M=null,U!==null&&U.renderEnd()};function Lc(b,k,q,H){if(b.visible===!1)return;if(b.layers.test(k.layers)){if(b.isGroup)q=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(k);else if(b.isLightProbeGrid)E.pushLightProbeGrid(b);else if(b.isLight)E.pushLight(b),b.castShadow&&E.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Gt.intersectsSprite(b)){H&&ue.setFromMatrixPosition(b.matrixWorld).applyMatrix4(ne);const wt=et.update(b),yt=b.material;yt.visible&&M.push(b,wt,yt,q,ue.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Gt.intersectsObject(b))){const wt=et.update(b),yt=b.material;if(H&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),ue.copy(b.boundingSphere.center)):(wt.boundingSphere===null&&wt.computeBoundingSphere(),ue.copy(wt.boundingSphere.center)),ue.applyMatrix4(b.matrixWorld).applyMatrix4(ne)),Array.isArray(yt)){const Tt=wt.groups;for(let Rt=0,$t=Tt.length;Rt<$t;Rt++){const qt=Tt[Rt],Lt=yt[qt.materialIndex];Lt&&Lt.visible&&M.push(b,wt,Lt,q,ue.z,qt)}}else yt.visible&&M.push(b,wt,yt,q,ue.z,null)}}const Mt=b.children;for(let wt=0,yt=Mt.length;wt<yt;wt++)Lc(Mt[wt],k,q,H)}function Fd(b,k,q,H){const{opaque:G,transmissive:Mt,transparent:wt}=b;E.setupLightsView(q),jt===!0&&Nt.setGlobalState(L.clippingPlanes,q),H&&v.viewport(at.copy(H)),G.length>0&&Uo(G,k,q),Mt.length>0&&Uo(Mt,k,q),wt.length>0&&Uo(wt,k,q),v.buffers.depth.setTest(!0),v.buffers.depth.setMask(!0),v.buffers.color.setMask(!0),v.setPolygonOffset(!1)}function Od(b,k,q,H){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[H.id]===void 0){const Lt=ae.has("EXT_color_buffer_half_float")||ae.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[H.id]=new Ze(1,1,{generateMipmaps:!0,type:Lt?sn:nn,minFilter:zi,samples:Math.max(4,A.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Jt.workingColorSpace})}const Mt=E.state.transmissionRenderTarget[H.id],wt=H.viewport||at;Mt.setSize(wt.z*L.transmissionResolutionScale,wt.w*L.transmissionResolutionScale);const yt=L.getRenderTarget(),Tt=L.getActiveCubeFace(),Rt=L.getActiveMipmapLevel();L.setRenderTarget(Mt),L.getClearColor(ve),ee=L.getClearAlpha(),ee<1&&L.setClearColor(16777215,.5),L.clear(),be&&Wt.render(q);const $t=L.toneMapping;L.toneMapping=Ln;const qt=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),E.setupLightsView(H),jt===!0&&Nt.setGlobalState(L.clippingPlanes,H),Uo(b,q,H),J.updateMultisampleRenderTarget(Mt),J.updateRenderTargetMipmap(Mt),ae.has("WEBGL_multisampled_render_to_texture")===!1){let Lt=!1;for(let ce=0,Ee=k.length;ce<Ee;ce++){const we=k[ce],{object:de,geometry:$e,material:St,group:an}=we;if(St.side===Wn&&de.layers.test(H.layers)){const ie=St.side;St.side=Ye,St.needsUpdate=!0,kd(de,q,H,$e,St,an),St.side=ie,St.needsUpdate=!0,Lt=!0}}Lt===!0&&(J.updateMultisampleRenderTarget(Mt),J.updateRenderTargetMipmap(Mt))}L.setRenderTarget(yt,Tt,Rt),L.setClearColor(ve,ee),qt!==void 0&&(H.viewport=qt),L.toneMapping=$t}function Uo(b,k,q){const H=k.isScene===!0?k.overrideMaterial:null;for(let G=0,Mt=b.length;G<Mt;G++){const wt=b[G],{object:yt,geometry:Tt,group:Rt}=wt;let $t=wt.material;$t.allowOverride===!0&&H!==null&&($t=H),yt.layers.test(q.layers)&&kd(yt,k,q,Tt,$t,Rt)}}function kd(b,k,q,H,G,Mt){b.onBeforeRender(L,k,q,H,G,Mt),b.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),G.onBeforeRender(L,k,q,H,b,Mt),G.transparent===!0&&G.side===Wn&&G.forceSinglePass===!1?(G.side=Ye,G.needsUpdate=!0,L.renderBufferDirect(q,k,H,G,b,Mt),G.side=di,G.needsUpdate=!0,L.renderBufferDirect(q,k,H,G,b,Mt),G.side=Wn):L.renderBufferDirect(q,k,H,G,b,Mt),b.onAfterRender(L,k,q,H,G,Mt)}function Fo(b,k,q){k.isScene!==!0&&(k=Re);const H=$.get(b),G=E.state.lights,Mt=E.state.shadowsArray,wt=G.state.version,yt=pt.getParameters(b,G.state,Mt,k,q,E.state.lightProbeGridArray),Tt=pt.getProgramCacheKey(yt);let Rt=H.programs;H.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?k.environment:null,H.fog=k.fog;const $t=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;H.envMap=ct.get(b.envMap||H.environment,$t),H.envMapRotation=H.environment!==null&&b.envMap===null?k.environmentRotation:b.envMapRotation,Rt===void 0&&(b.addEventListener("dispose",zn),Rt=new Map,H.programs=Rt);let qt=Rt.get(Tt);if(qt!==void 0){if(H.currentProgram===qt&&H.lightsStateVersion===wt)return zd(b,yt),qt}else yt.uniforms=pt.getUniforms(b),U!==null&&b.isNodeMaterial&&U.build(b,q,yt),b.onBeforeCompile(yt,L),qt=pt.acquireProgram(yt,Tt),Rt.set(Tt,qt),H.uniforms=yt.uniforms;const Lt=H.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Lt.clippingPlanes=Nt.uniform),zd(b,yt),H.needsLights=nM(b),H.lightsStateVersion=wt,H.needsLights&&(Lt.ambientLightColor.value=G.state.ambient,Lt.lightProbe.value=G.state.probe,Lt.directionalLights.value=G.state.directional,Lt.directionalLightShadows.value=G.state.directionalShadow,Lt.spotLights.value=G.state.spot,Lt.spotLightShadows.value=G.state.spotShadow,Lt.rectAreaLights.value=G.state.rectArea,Lt.ltc_1.value=G.state.rectAreaLTC1,Lt.ltc_2.value=G.state.rectAreaLTC2,Lt.pointLights.value=G.state.point,Lt.pointLightShadows.value=G.state.pointShadow,Lt.hemisphereLights.value=G.state.hemi,Lt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Lt.spotLightMatrix.value=G.state.spotLightMatrix,Lt.spotLightMap.value=G.state.spotLightMap,Lt.pointShadowMatrix.value=G.state.pointShadowMatrix),H.lightProbeGrid=E.state.lightProbeGridArray.length>0,H.currentProgram=qt,H.uniformsList=null,qt}function Bd(b){if(b.uniformsList===null){const k=b.currentProgram.getUniforms();b.uniformsList=wo.seqWithValue(k.seq,b.uniforms)}return b.uniformsList}function zd(b,k){const q=$.get(b);q.outputColorSpace=k.outputColorSpace,q.batching=k.batching,q.batchingColor=k.batchingColor,q.instancing=k.instancing,q.instancingColor=k.instancingColor,q.instancingMorph=k.instancingMorph,q.skinning=k.skinning,q.morphTargets=k.morphTargets,q.morphNormals=k.morphNormals,q.morphColors=k.morphColors,q.morphTargetsCount=k.morphTargetsCount,q.numClippingPlanes=k.numClippingPlanes,q.numIntersection=k.numClipIntersection,q.vertexAlphas=k.vertexAlphas,q.vertexTangents=k.vertexTangents,q.toneMapping=k.toneMapping}function Qy(b,k){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;y.setFromMatrixPosition(k.matrixWorld);for(let q=0,H=b.length;q<H;q++){const G=b[q];if(G.texture!==null&&G.boundingBox.containsPoint(y))return G}return null}function tM(b,k,q,H,G){k.isScene!==!0&&(k=Re),J.resetTextureUnits();const Mt=k.fog,wt=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?k.environment:null,yt=X===null?L.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:Jt.workingColorSpace,Tt=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Rt=ct.get(H.envMap||wt,Tt),$t=H.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,qt=!!q.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Lt=!!q.morphAttributes.position,ce=!!q.morphAttributes.normal,Ee=!!q.morphAttributes.color;let we=Ln;H.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(we=L.toneMapping);const de=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,$e=de!==void 0?de.length:0,St=$.get(H),an=E.state.lights;if(jt===!0&&(Qt===!0||b!==ot)){const ge=b===ot&&H.id===nt;Nt.setState(H,b,ge)}let ie=!1;H.version===St.__version?(St.needsLights&&St.lightsStateVersion!==an.state.version||St.outputColorSpace!==yt||G.isBatchedMesh&&St.batching===!1||!G.isBatchedMesh&&St.batching===!0||G.isBatchedMesh&&St.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&St.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&St.instancing===!1||!G.isInstancedMesh&&St.instancing===!0||G.isSkinnedMesh&&St.skinning===!1||!G.isSkinnedMesh&&St.skinning===!0||G.isInstancedMesh&&St.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&St.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&St.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&St.instancingMorph===!1&&G.morphTexture!==null||St.envMap!==Rt||H.fog===!0&&St.fog!==Mt||St.numClippingPlanes!==void 0&&(St.numClippingPlanes!==Nt.numPlanes||St.numIntersection!==Nt.numIntersection)||St.vertexAlphas!==$t||St.vertexTangents!==qt||St.morphTargets!==Lt||St.morphNormals!==ce||St.morphColors!==Ee||St.toneMapping!==we||St.morphTargetsCount!==$e||!!St.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(ie=!0):(ie=!0,St.__version=H.version);let mn=St.currentProgram;ie===!0&&(mn=Fo(H,k,G),U&&H.isNodeMaterial&&U.onUpdateProgram(H,mn,St));let Hn=!1,Ci=!1,Ws=!1;const fe=mn.getUniforms(),Te=St.uniforms;if(v.useProgram(mn.program)&&(Hn=!0,Ci=!0,Ws=!0),H.id!==nt&&(nt=H.id,Ci=!0),St.needsLights){const ge=Qy(E.state.lightProbeGridArray,G);St.lightProbeGrid!==ge&&(St.lightProbeGrid=ge,Ci=!0)}if(Hn||ot!==b){v.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),fe.setValue(O,"projectionMatrix",b.projectionMatrix),fe.setValue(O,"viewMatrix",b.matrixWorldInverse);const Pi=fe.map.cameraPosition;Pi!==void 0&&Pi.setValue(O,he.setFromMatrixPosition(b.matrixWorld)),A.logarithmicDepthBuffer&&fe.setValue(O,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&fe.setValue(O,"isOrthographic",b.isOrthographicCamera===!0),ot!==b&&(ot=b,Ci=!0,Ws=!0)}if(St.needsLights&&(an.state.directionalShadowMap.length>0&&fe.setValue(O,"directionalShadowMap",an.state.directionalShadowMap,J),an.state.spotShadowMap.length>0&&fe.setValue(O,"spotShadowMap",an.state.spotShadowMap,J),an.state.pointShadowMap.length>0&&fe.setValue(O,"pointShadowMap",an.state.pointShadowMap,J)),G.isSkinnedMesh){fe.setOptional(O,G,"bindMatrix"),fe.setOptional(O,G,"bindMatrixInverse");const ge=G.skeleton;ge&&(ge.boneTexture===null&&ge.computeBoneTexture(),fe.setValue(O,"boneTexture",ge.boneTexture,J))}G.isBatchedMesh&&(fe.setOptional(O,G,"batchingTexture"),fe.setValue(O,"batchingTexture",G._matricesTexture,J),fe.setOptional(O,G,"batchingIdTexture"),fe.setValue(O,"batchingIdTexture",G._indirectTexture,J),fe.setOptional(O,G,"batchingColorTexture"),G._colorsTexture!==null&&fe.setValue(O,"batchingColorTexture",G._colorsTexture,J));const Ri=q.morphAttributes;if((Ri.position!==void 0||Ri.normal!==void 0||Ri.color!==void 0)&&F.update(G,q,mn),(Ci||St.receiveShadow!==G.receiveShadow)&&(St.receiveShadow=G.receiveShadow,fe.setValue(O,"receiveShadow",G.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&k.environment!==null&&(Te.envMapIntensity.value=k.environmentIntensity),Te.dfgLUT!==void 0&&(Te.dfgLUT.value=p_()),Ci){if(fe.setValue(O,"toneMappingExposure",L.toneMappingExposure),St.needsLights&&eM(Te,Ws),Mt&&H.fog===!0&&Ct.refreshFogUniforms(Te,Mt),Ct.refreshMaterialUniforms(Te,H,Y,I,E.state.transmissionRenderTarget[b.id]),St.needsLights&&St.lightProbeGrid){const ge=St.lightProbeGrid;Te.probesSH.value=ge.texture,Te.probesMin.value.copy(ge.boundingBox.min),Te.probesMax.value.copy(ge.boundingBox.max),Te.probesResolution.value.copy(ge.resolution)}wo.upload(O,Bd(St),Te,J)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(wo.upload(O,Bd(St),Te,J),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&fe.setValue(O,"center",G.center),fe.setValue(O,"modelViewMatrix",G.modelViewMatrix),fe.setValue(O,"normalMatrix",G.normalMatrix),fe.setValue(O,"modelMatrix",G.matrixWorld),H.uniformsGroups!==void 0){const ge=H.uniformsGroups;for(let Pi=0,$s=ge.length;Pi<$s;Pi++){const Hd=ge[Pi];it.update(Hd,mn),it.bind(Hd,mn)}}return mn}function eM(b,k){b.ambientLightColor.needsUpdate=k,b.lightProbe.needsUpdate=k,b.directionalLights.needsUpdate=k,b.directionalLightShadows.needsUpdate=k,b.pointLights.needsUpdate=k,b.pointLightShadows.needsUpdate=k,b.spotLights.needsUpdate=k,b.spotLightShadows.needsUpdate=k,b.rectAreaLights.needsUpdate=k,b.hemisphereLights.needsUpdate=k}function nM(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(b,k,q){const H=$.get(b);H.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),$.get(b.texture).__webglTexture=k,$.get(b.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:q,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,k){const q=$.get(b);q.__webglFramebuffer=k,q.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(b,k=0,q=0){X=b,W=k,B=q;let H=null,G=!1,Mt=!1;if(b){const yt=$.get(b);if(yt.__useDefaultFramebuffer!==void 0){v.bindFramebuffer(O.FRAMEBUFFER,yt.__webglFramebuffer),at.copy(b.viewport),xt.copy(b.scissor),Ht=b.scissorTest,v.viewport(at),v.scissor(xt),v.setScissorTest(Ht),nt=-1;return}else if(yt.__webglFramebuffer===void 0)J.setupRenderTarget(b);else if(yt.__hasExternalTextures)J.rebindTextures(b,$.get(b.texture).__webglTexture,$.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const $t=b.depthTexture;if(yt.__boundDepthTexture!==$t){if($t!==null&&$.has($t)&&(b.width!==$t.image.width||b.height!==$t.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");J.setupDepthRenderbuffer(b)}}const Tt=b.texture;(Tt.isData3DTexture||Tt.isDataArrayTexture||Tt.isCompressedArrayTexture)&&(Mt=!0);const Rt=$.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Rt[k])?H=Rt[k][q]:H=Rt[k],G=!0):b.samples>0&&J.useMultisampledRTT(b)===!1?H=$.get(b).__webglMultisampledFramebuffer:Array.isArray(Rt)?H=Rt[q]:H=Rt,at.copy(b.viewport),xt.copy(b.scissor),Ht=b.scissorTest}else at.copy(lt).multiplyScalar(Y).floor(),xt.copy(Ot).multiplyScalar(Y).floor(),Ht=Dt;if(q!==0&&(H=K),v.bindFramebuffer(O.FRAMEBUFFER,H)&&v.drawBuffers(b,H),v.viewport(at),v.scissor(xt),v.setScissorTest(Ht),G){const yt=$.get(b.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+k,yt.__webglTexture,q)}else if(Mt){const yt=k;for(let Tt=0;Tt<b.textures.length;Tt++){const Rt=$.get(b.textures[Tt]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Tt,Rt.__webglTexture,q,yt)}}else if(b!==null&&q!==0){const yt=$.get(b.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,yt.__webglTexture,q)}nt=-1},this.readRenderTargetPixels=function(b,k,q,H,G,Mt,wt,yt=0){if(!(b&&b.isWebGLRenderTarget)){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=$.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&wt!==void 0&&(Tt=Tt[wt]),Tt){v.bindFramebuffer(O.FRAMEBUFFER,Tt);try{const Rt=b.textures[yt],$t=Rt.format,qt=Rt.type;if(b.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+yt),!A.textureFormatReadable($t)){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!A.textureTypeReadable(qt)){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=b.width-H&&q>=0&&q<=b.height-G&&O.readPixels(k,q,H,G,gt.convert($t),gt.convert(qt),Mt)}finally{const Rt=X!==null?$.get(X).__webglFramebuffer:null;v.bindFramebuffer(O.FRAMEBUFFER,Rt)}}},this.readRenderTargetPixelsAsync=async function(b,k,q,H,G,Mt,wt,yt=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=$.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&wt!==void 0&&(Tt=Tt[wt]),Tt)if(k>=0&&k<=b.width-H&&q>=0&&q<=b.height-G){v.bindFramebuffer(O.FRAMEBUFFER,Tt);const Rt=b.textures[yt],$t=Rt.format,qt=Rt.type;if(b.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+yt),!A.textureFormatReadable($t))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!A.textureTypeReadable(qt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Lt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Lt),O.bufferData(O.PIXEL_PACK_BUFFER,Mt.byteLength,O.STREAM_READ),O.readPixels(k,q,H,G,gt.convert($t),gt.convert(qt),0);const ce=X!==null?$.get(X).__webglFramebuffer:null;v.bindFramebuffer(O.FRAMEBUFFER,ce);const Ee=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await Ip(O,Ee,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Lt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Mt),O.deleteBuffer(Lt),O.deleteSync(Ee),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,k=null,q=0){const H=Math.pow(2,-q),G=Math.floor(b.image.width*H),Mt=Math.floor(b.image.height*H),wt=k!==null?k.x:0,yt=k!==null?k.y:0;J.setTexture2D(b,0),O.copyTexSubImage2D(O.TEXTURE_2D,q,0,0,wt,yt,G,Mt),v.unbindTexture()},this.copyTextureToTexture=function(b,k,q=null,H=null,G=0,Mt=0){let wt,yt,Tt,Rt,$t,qt,Lt,ce,Ee;const we=b.isCompressedTexture?b.mipmaps[Mt]:b.image;if(q!==null)wt=q.max.x-q.min.x,yt=q.max.y-q.min.y,Tt=q.isBox3?q.max.z-q.min.z:1,Rt=q.min.x,$t=q.min.y,qt=q.isBox3?q.min.z:0;else{const Te=Math.pow(2,-G);wt=Math.floor(we.width*Te),yt=Math.floor(we.height*Te),b.isDataArrayTexture?Tt=we.depth:b.isData3DTexture?Tt=Math.floor(we.depth*Te):Tt=1,Rt=0,$t=0,qt=0}H!==null?(Lt=H.x,ce=H.y,Ee=H.z):(Lt=0,ce=0,Ee=0);const de=gt.convert(k.format),$e=gt.convert(k.type);let St;k.isData3DTexture?(J.setTexture3D(k,0),St=O.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(J.setTexture2DArray(k,0),St=O.TEXTURE_2D_ARRAY):(J.setTexture2D(k,0),St=O.TEXTURE_2D),v.activeTexture(O.TEXTURE0),v.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,k.flipY),v.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),v.pixelStorei(O.UNPACK_ALIGNMENT,k.unpackAlignment);const an=v.getParameter(O.UNPACK_ROW_LENGTH),ie=v.getParameter(O.UNPACK_IMAGE_HEIGHT),mn=v.getParameter(O.UNPACK_SKIP_PIXELS),Hn=v.getParameter(O.UNPACK_SKIP_ROWS),Ci=v.getParameter(O.UNPACK_SKIP_IMAGES);v.pixelStorei(O.UNPACK_ROW_LENGTH,we.width),v.pixelStorei(O.UNPACK_IMAGE_HEIGHT,we.height),v.pixelStorei(O.UNPACK_SKIP_PIXELS,Rt),v.pixelStorei(O.UNPACK_SKIP_ROWS,$t),v.pixelStorei(O.UNPACK_SKIP_IMAGES,qt);const Ws=b.isDataArrayTexture||b.isData3DTexture,fe=k.isDataArrayTexture||k.isData3DTexture;if(b.isDepthTexture){const Te=$.get(b),Ri=$.get(k),ge=$.get(Te.__renderTarget),Pi=$.get(Ri.__renderTarget);v.bindFramebuffer(O.READ_FRAMEBUFFER,ge.__webglFramebuffer),v.bindFramebuffer(O.DRAW_FRAMEBUFFER,Pi.__webglFramebuffer);for(let $s=0;$s<Tt;$s++)Ws&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,$.get(b).__webglTexture,G,qt+$s),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,$.get(k).__webglTexture,Mt,Ee+$s)),O.blitFramebuffer(Rt,$t,wt,yt,Lt,ce,wt,yt,O.DEPTH_BUFFER_BIT,O.NEAREST);v.bindFramebuffer(O.READ_FRAMEBUFFER,null),v.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(G!==0||b.isRenderTargetTexture||$.has(b)){const Te=$.get(b),Ri=$.get(k);v.bindFramebuffer(O.READ_FRAMEBUFFER,Z),v.bindFramebuffer(O.DRAW_FRAMEBUFFER,N);for(let ge=0;ge<Tt;ge++)Ws?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Te.__webglTexture,G,qt+ge):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Te.__webglTexture,G),fe?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ri.__webglTexture,Mt,Ee+ge):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ri.__webglTexture,Mt),G!==0?O.blitFramebuffer(Rt,$t,wt,yt,Lt,ce,wt,yt,O.COLOR_BUFFER_BIT,O.NEAREST):fe?O.copyTexSubImage3D(St,Mt,Lt,ce,Ee+ge,Rt,$t,wt,yt):O.copyTexSubImage2D(St,Mt,Lt,ce,Rt,$t,wt,yt);v.bindFramebuffer(O.READ_FRAMEBUFFER,null),v.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else fe?b.isDataTexture||b.isData3DTexture?O.texSubImage3D(St,Mt,Lt,ce,Ee,wt,yt,Tt,de,$e,we.data):k.isCompressedArrayTexture?O.compressedTexSubImage3D(St,Mt,Lt,ce,Ee,wt,yt,Tt,de,we.data):O.texSubImage3D(St,Mt,Lt,ce,Ee,wt,yt,Tt,de,$e,we):b.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Mt,Lt,ce,wt,yt,de,$e,we.data):b.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Mt,Lt,ce,we.width,we.height,de,we.data):O.texSubImage2D(O.TEXTURE_2D,Mt,Lt,ce,wt,yt,de,$e,we);v.pixelStorei(O.UNPACK_ROW_LENGTH,an),v.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ie),v.pixelStorei(O.UNPACK_SKIP_PIXELS,mn),v.pixelStorei(O.UNPACK_SKIP_ROWS,Hn),v.pixelStorei(O.UNPACK_SKIP_IMAGES,Ci),Mt===0&&k.generateMipmaps&&O.generateMipmap(St),v.unbindTexture()},this.initRenderTarget=function(b){$.get(b).__webglFramebuffer===void 0&&J.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?J.setTextureCube(b,0):b.isData3DTexture?J.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?J.setTexture2DArray(b,0):J.setTexture2D(b,0),v.unbindTexture()},this.resetState=function(){W=0,B=0,X=null,v.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return In}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Jt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Jt._getUnpackColorSpace()}}const Yu={type:"change"},nc={type:"start"},qu={type:"end"},To=new to,Ku=new yi,g_=Math.cos(70*Wr.DEG2RAD),Ne=new P,Qe=2*Math.PI,le={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ic=1e-6;class x_ extends Qm{constructor(t,e=null){super(t,e),this.state=le.NONE,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:as.ROTATE,MIDDLE:as.DOLLY,RIGHT:as.PAN},this.touches={ONE:ls.ROTATE,TWO:ls.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new P,this._lastQuaternion=new Nn,this._lastTargetPosition=new P,this._quat=new Nn().setFromUnitVectors(t.up,new P(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Yl,this._sphericalDelta=new Yl,this._scale=1,this._panOffset=new P,this._rotateStart=new ut,this._rotateEnd=new ut,this._rotateDelta=new ut,this._panStart=new ut,this._panEnd=new ut,this._panDelta=new ut,this._dollyStart=new ut,this._dollyEnd=new ut,this._dollyDelta=new ut,this._dollyDirection=new P,this._mouse=new ut,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=__.bind(this),this._onPointerDown=v_.bind(this),this._onPointerUp=y_.bind(this),this._onContextMenu=A_.bind(this),this._onMouseWheel=S_.bind(this),this._onKeyDown=w_.bind(this),this._onTouchStart=E_.bind(this),this._onTouchMove=T_.bind(this),this._onMouseDown=M_.bind(this),this._onMouseMove=b_.bind(this),this._interceptControlDown=C_.bind(this),this._interceptControlUp=R_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Yu),this.update(),this.state=le.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){const e=this.object.position;Ne.copy(e).sub(this.target),Ne.applyQuaternion(this._quat),this._spherical.setFromVector3(Ne),this.autoRotate&&this.state===le.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=Qe:n>Math.PI&&(n-=Qe),i<-Math.PI?i+=Qe:i>Math.PI&&(i-=Qe),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Ne.setFromSpherical(this._spherical),Ne.applyQuaternion(this._quatInverse),e.copy(this.target).add(Ne),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=Ne.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new P(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new P(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Ne.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(To.origin.copy(this.object.position),To.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(To.direction))<g_?this.object.lookAt(this.target):(Ku.setFromNormalAndCoplanarPoint(this.object.up,this.target),To.intersectPlane(Ku,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ic||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ic||this._lastTargetPosition.distanceToSquared(this.target)>ic?(this.dispatchEvent(Yu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Qe/60*this.autoRotateSpeed*t:Qe/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Ne.setFromMatrixColumn(e,0),Ne.multiplyScalar(-t),this._panOffset.add(Ne)}_panUp(t,e){this.screenSpacePanning===!0?Ne.setFromMatrixColumn(e,1):(Ne.setFromMatrixColumn(e,0),Ne.crossVectors(this.object.up,Ne)),Ne.multiplyScalar(t),this._panOffset.add(Ne)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const i=this.object.position;Ne.copy(i).sub(this.target);let r=Ne.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),i=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=i/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Qe*this._rotateDelta.x/e.clientHeight),this._rotateUp(Qe*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Qe*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Qe*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Qe*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Qe*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panStart.set(n,i)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(i,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Qe*this._rotateDelta.x/e.clientHeight),this._rotateUp(Qe*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new ut,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function v_(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function __(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function y_(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(qu),this.state=le.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function M_(s){let t;switch(s.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case as.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=le.DOLLY;break;case as.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=le.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=le.ROTATE}break;case as.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=le.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=le.PAN}break;default:this.state=le.NONE}this.state!==le.NONE&&this.dispatchEvent(nc)}function b_(s){switch(this.state){case le.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case le.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case le.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function S_(s){this.enabled===!1||this.enableZoom===!1||this.state!==le.NONE||(s.preventDefault(),this.dispatchEvent(nc),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(qu))}function w_(s){this.enabled!==!1&&this._handleKeyDown(s)}function E_(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case ls.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=le.TOUCH_ROTATE;break;case ls.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=le.TOUCH_PAN;break;default:this.state=le.NONE}break;case 2:switch(this.touches.TWO){case ls.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=le.TOUCH_DOLLY_PAN;break;case ls.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=le.TOUCH_DOLLY_ROTATE;break;default:this.state=le.NONE}break;default:this.state=le.NONE}this.state!==le.NONE&&this.dispatchEvent(nc)}function T_(s){switch(this._trackPointer(s),this.state){case le.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case le.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case le.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case le.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=le.NONE}}function A_(s){this.enabled!==!1&&s.preventDefault()}function C_(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function R_(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const _r=new P;function pn(s,t,e,n,i,r){const o=2*Math.PI*i/4,a=Math.max(r-2*i,0),l=Math.PI/4;_r.copy(t),_r[n]=0,_r.normalize();const c=.5*o/(o+a),u=1-_r.angleTo(s)/l;return Math.sign(_r[e])===1?u*c:a/(o+a)+c+c*(1-u)}class ii extends wn{constructor(t=1,e=1,n=1,i=2,r=.1){const o=i*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:i,radius:r},o===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const l=new P,c=new P,u=new P(t,e,n).divideScalar(2).subScalar(r),h=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=h.length/6,x=new P,m=.5/o;for(let g=0,S=0;g<h.length;g+=3,S+=2)switch(l.fromArray(h,g),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),h[g+0]=u.x*Math.sign(l.x)+c.x*r,h[g+1]=u.y*Math.sign(l.y)+c.y*r,h[g+2]=u.z*Math.sign(l.z)+c.z*r,d[g+0]=c.x,d[g+1]=c.y,d[g+2]=c.z,Math.floor(g/p)){case 0:x.set(1,0,0),f[S+0]=pn(x,c,"z","y",r,n),f[S+1]=1-pn(x,c,"y","z",r,e);break;case 1:x.set(-1,0,0),f[S+0]=1-pn(x,c,"z","y",r,n),f[S+1]=1-pn(x,c,"y","z",r,e);break;case 2:x.set(0,1,0),f[S+0]=1-pn(x,c,"x","z",r,t),f[S+1]=pn(x,c,"z","x",r,n);break;case 3:x.set(0,-1,0),f[S+0]=1-pn(x,c,"x","z",r,t),f[S+1]=1-pn(x,c,"z","x",r,n);break;case 4:x.set(0,0,1),f[S+0]=1-pn(x,c,"x","y",r,t),f[S+1]=1-pn(x,c,"y","x",r,e);break;case 5:x.set(0,0,-1),f[S+0]=pn(x,c,"x","y",r,t),f[S+1]=1-pn(x,c,"y","x",r,e);break}}static fromJSON(t){return new ii(t.width,t.height,t.depth,t.segments,t.radius)}}const P_=8;function L_(){const s=document.createElement("canvas");s.width=1024,s.height=384;const t=s.getContext("2d"),e=256,n=192;if(t){const r=a=>[a%4*e,Math.floor(a/4)*n],o=(a,l,c,u,h=26)=>{const[d,f]=r(a);t.fillStyle=u,t.fillRect(d,f,e,n),t.fillStyle=c,t.font=`${h}px "Libertinus Mono", ui-monospace, monospace`,t.textAlign="center",l.forEach((p,x)=>t.fillText(p,d+e/2,f+n/2+(x-(l.length-1)/2)*h*1.3+h*.35)),t.textAlign="left"};o(1,["NO SIGNAL"],"#ffffff","#1432c8",30);{const[a,l]=r(2);["#c0c0c0","#c0c000","#00c0c0","#00c000","#c000c0","#c00000","#0000c0"].forEach((c,u)=>{t.fillStyle=c,t.fillRect(a+u*e/7,l,e/7+1,n*.7)}),t.fillStyle="#0b0b0b",t.fillRect(a,l+n*.7,e,n*.3)}o(3,["PRESENT DAY","PRESENT TIME"],"#e8e8e8","#050505",22);{const[a,l]=r(4);t.fillStyle="#000",t.fillRect(a,l,e,n),t.fillStyle="#b8b8b8",t.font="18px ui-monospace, monospace",t.fillText("C:\\>_",a+16,l+34)}o(5,["▶ PLAY"],"#ffffff","#0a1a7a",30),o(6,["æ"],"#f4f1ea","#000000",110),o(7,["CLOSE THE WORLD","OPEN THE nExT"],"#ff4a4a","#070000",18)}const i=new Ls(s);return i.colorSpace=Ue,i}class D_{constructor(t,e,n){R(this,"group",new Zn);R(this,"screens");R(this,"uniforms",{uTime:{value:0},uAtlas:{value:null},uFogColor:{value:new Bt},uFogDensity:{value:0}});this.uniforms.uFogColor.value.copy(n.color),this.uniforms.uFogDensity.value=n.density;const i=new ii(1.26,1.1,.95,2,.05);i.translate(0,.55,-.475);const r=new $h(i,new Je({roughness:.6,metalness:.05}),t),o=new fn(1,.75);o.translate(0,.62,.004),this.uniforms.uAtlas.value=L_();const a=new Le({uniforms:this.uniforms,vertexShader:`
        attribute float aTile;
        attribute float aSeed;
        attribute float aOn;
        varying vec2 vUv;
        varying float vTile, vSeed, vOn, vDepth;
        void main() {
          vUv = uv; vTile = aTile; vSeed = aSeed; vOn = aOn;
          vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          vDepth = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`
        uniform float uTime;
        uniform sampler2D uAtlas;
        uniform vec3 uFogColor;
        uniform float uFogDensity;
        varying vec2 vUv;
        varying float vTile, vSeed, vOn, vDepth;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        void main() {
          vec2 c = vUv * 2.0 - 1.0;
          vec2 uv = c * (1.0 + dot(c, c) * 0.06) * 0.5 + 0.5;
          float snow = hash(floor(uv * vec2(160.0, 120.0)) + fract(uTime * 9.0 + vSeed) * 91.0);
          vec3 col = vec3(snow * 0.55);
          if (vTile > 0.5) {
            vec2 tile = vec2(mod(vTile, 4.0), floor(vTile / 4.0));
            vec2 a = (tile + clamp(uv, 0.0, 1.0)) / vec2(4.0, 2.0);
            a.y = 1.0 - ((tile.y + (1.0 - clamp(uv.y, 0.0, 1.0))) / 2.0);
            col = texture2D(uAtlas, a).rgb + (snow - 0.5) * 0.12;
          }
          col *= 0.75 + 0.25 * sin(uv.y * 240.0);
          // flicker, and the odd set dying and coming back
          float f = 0.75 + 0.25 * sin(uTime * (2.0 + vSeed * 3.0) + vSeed * 40.0);
          float drop = step(0.985, hash(vec2(floor(uTime * 2.0), vSeed * 100.0)));
          col *= f * (1.0 - drop * 0.9) * vOn * 0.9;
          col *= smoothstep(1.3, 0.5, length(c));
          col *= 1.0 - smoothstep(0.98, 1.02, max(abs(c.x), abs(c.y)) * (1.0 + dot(c, c) * 0.06));
          col += vec3(0.01, 0.012, 0.015);
          // glow through the haze rather than vanish into it
          float fogK = 1.0 - exp(-pow(uFogDensity * vDepth, 2.0));
          col = mix(col, uFogColor, fogK * 0.7);
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`});this.screens=new $h(o,a,t);const l=new Float32Array(t),c=new Float32Array(t),u=new Float32Array(t),h=[12168852,1513242,7172214,855311,9407100],d=new re,f=new Nn,p=new qn,x=new Bt;let m=0;for(;m<t;){const g=e()*Math.PI*2;if(-Math.cos(g)>.3)continue;const S=9+e()*13,w=Math.sin(g)*S,y=-Math.cos(g)*S,M=Math.atan2(-w,-y)+(e()-.5)*.9,E=e()<.14,C=Math.min(t-m,E?1:1+Math.floor(e()*4));let _=E?4+e()*5:0;for(let T=0;T<C;T++,m++){const L=.8+e()*.9,D=!E&&T===0&&e()<.12;p.set(D?-Math.PI/2+.1:(e()-.5)*.12,M+(e()-.5)*.35,D?0:(e()-.5)*.08),f.setFromEuler(p),d.compose(new P(w+(e()-.5)*.3,_,y+(e()-.5)*.3),f,new P(L,L,L)),r.setMatrixAt(m,d),this.screens.setMatrixAt(m,d),r.setColorAt(m,x.setHex(h[Math.floor(e()*h.length)]??3355443)),l[m]=e()<.45?0:1+Math.floor(e()*(P_-1)),c[m]=e(),u[m]=e()<.22?0:.35+e()*.65,_+=1.1*L*(D?.85:1)}}this.screens.geometry.setAttribute("aTile",new cr(l,1)),this.screens.geometry.setAttribute("aSeed",new cr(c,1)),this.screens.geometry.setAttribute("aOn",new cr(u,1)),this.group.add(r,this.screens)}update(t){this.uniforms.uTime.value=t}}const I_=`
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`,N_=`
uniform sampler2D map;
uniform float uTime;
uniform float uPower;
uniform float uHover;
uniform float uStatic;
uniform float uSeed;
uniform float uGain;
uniform vec3 uTint;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec2 c = vUv * 2.0 - 1.0;
  vec2 b = c * (1.0 + dot(c, c) * 0.05);          // barrel
  float edge = max(abs(b.x), abs(b.y));
  vec2 uv = b * 0.5 + 0.5;

  // power-on: a line that opens into a picture
  float vOpen = max(smoothstep(0.15, 0.75, uPower), 0.004);
  float hOpen = max(smoothstep(0.0, 0.2, uPower), 0.01);
  vec2 q = uv - 0.5;
  float inside = step(abs(q.y), 0.5 * vOpen) * step(abs(q.x), 0.5 * hOpen);
  vec2 s = vec2(q.x / hOpen, q.y / vOpen) + 0.5;

  // a tearing line now and then
  float row = floor(s.y * 90.0);
  float tear = step(0.992, hash(vec2(floor(uTime * 14.0), row + uSeed)));
  s.x += tear * 0.012 * (hash(vec2(row, uSeed)) - 0.5) + uStatic * 0.03 * (hash(vec2(row, uTime)) - 0.5);

  float ca = 0.0014 + uStatic * 0.012;
  vec3 col = vec3(
    texture2D(map, s + vec2(ca, 0.0)).r,
    texture2D(map, s).g,
    texture2D(map, s - vec2(ca, 0.0)).b
  );

  float n = hash(s * vec2(512.0, 384.0) + fract(uTime * 7.31) * 97.0 + uSeed);
  col = mix(col, vec3(n * 0.9), clamp(uStatic, 0.0, 1.0));
  col += (n - 0.5) * 0.035;

  col *= 0.8 + 0.2 * sin(s.y * 384.0 * 3.14159);                     // scanlines
  col *= 0.95 + 0.05 * smoothstep(0.0, 0.12, abs(fract(s.y - uTime * 0.05) - 0.5)); // roll bar
  col *= smoothstep(1.25, 0.45, length(c * vec2(0.85, 1.0)));      // vignette
  col *= uTint;
  col *= inside;

  // the bright line of a tube warming up
  float line = (1.0 - smoothstep(0.0, 0.006, abs(q.y))) * step(0.01, uPower) * (1.0 - smoothstep(0.35, 0.7, uPower));
  col += vec3(1.3) * line * step(abs(q.x), 0.5 * hOpen);

  col *= uGain * (1.0 + uHover * 0.3);

  float fres = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 3.0);
  vec3 glass = vec3(0.012, 0.014, 0.018) + fres * vec3(0.16, 0.18, 0.21);
  col = col + glass;
  col *= 1.0 - smoothstep(0.97, 1.03, edge);

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;function U_(s,t){return new Le({uniforms:{map:{value:s},uTime:{value:0},uPower:{value:0},uHover:{value:0},uStatic:{value:0},uSeed:{value:t},uGain:{value:1},uTint:{value:new Bt(1,1,1)}},vertexShader:I_,fragmentShader:N_})}function F_(s,t,e){const n=new fn(s,t,24,18),i=n.attributes.position;for(let r=0;r<i.count;r++){const o=i.getX(r)/(s/2),a=i.getY(r)/(t/2);i.setZ(r,e*(1-.5*o*o-.5*a*a))}return n.computeVertexNormals(),n}const Zu={beige:{color:12168852,rough:.62},tv:{color:1513242,rough:.42},grey:{color:7172214,rough:.55},black:{color:855311,rough:.5}},Ju=new Map;function O_(s){let t=Ju.get(s);return t||(t=new Je({color:Zu[s].color,roughness:Zu[s].rough,metalness:.05}),Ju.set(s,t)),t}const k_=new Je({color:328966,roughness:.35,metalness:.2});function B_(s){const t=document.createElement("canvas");t.width=256,t.height=56;const e=t.getContext("2d");if(e){e.fillStyle="#d8cfae",e.fillRect(0,0,256,56),e.fillStyle="rgba(120,100,60,0.18)";for(let o=0;o<40;o++)e.fillRect(Math.random()*256,Math.random()*56,2,1);e.globalCompositeOperation="destination-out";for(let o=0;o<56;o+=4)e.fillRect(0,o,Math.random()*5,4),e.fillRect(256-Math.random()*5,o,5,4);e.globalCompositeOperation="source-over"}const n=new Ls(t),i=`31px ${Yc}`;let r=null;return _f(i,()=>{e&&(r?e.putImageData(r,0,0):r=e.getImageData(0,0,256,56),e.fillStyle="#16161c",e.font=i,e.textAlign="center",e.textBaseline="middle",e.save(),e.translate(128,31),e.rotate(-.02),e.fillText(s,0,0),e.restore())},()=>n.needsUpdate=!0),n.colorSpace=Ue,n.anisotropy=4,n}class ju{constructor(t){R(this,"group",new Zn);R(this,"texture");R(this,"crt");R(this,"glass");R(this,"hit");R(this,"height");R(this,"width");R(this,"depth");R(this,"screenH");R(this,"screenLocal");R(this,"portLocal");R(this,"topLocal");R(this,"led");const e=t.screenW,n=e*.75;this.screenH=n;const i=e*1.26,r=n+e*.34,o=e*.2;this.width=i,this.height=r+(t.stand?e*.08:0);const a=t.stand?e*.08:0,l=O_(t.style),c=new Zt(new ii(i,r,o,3,e*.045),l);c.position.set(0,a+r/2,-o/2),this.group.add(c);const u=e*.62,h=new Zt(new ii(i*.84,r*.86,u,3,e*.08),l);h.position.set(0,a+r*.52,-o-u/2+e*.04),this.group.add(h);const d=e*.3,f=new Zt(new ii(i*.46,r*.46,d,2,e*.05),l);if(f.position.set(0,a+r*.54,-o-u-d/2+e*.1),this.group.add(f),this.depth=o+u+d-e*.14,t.stand){const g=new Zt(new Is(e*.34,e*.4,a,24),l);g.position.set(0,a/2,-o-u*.4),this.group.add(g)}const p=a+r/2+e*.07;this.screenLocal=new P(0,p,.02),this.portLocal=new P(e*.1,a+r*.25,-this.depth+e*.05),this.topLocal=new P(0,a+r,-o-u*.45);const x=new Zt(new fn(e*1.05,n*1.05),k_);x.position.set(0,p,.002),this.group.add(x),this.texture=new Ls(t.screen),this.texture.colorSpace=Ue,this.texture.minFilter=ze,this.texture.generateMipmaps=!1,this.crt=U_(this.texture,t.seed),this.glass=new Zt(F_(e,n,e*.035),this.crt),this.glass.position.set(0,p,.004),this.group.add(this.glass);const m=new Zt(new fn(e*.4,e*.088),new Je({map:B_(t.label),transparent:!0,roughness:.9}));if(m.position.set(-e*.18,a+e*.075,.003),m.rotation.z=t.seed%7*.012-.03,this.group.add(m),this.led=new Zt(new go(e*.014,8,6),new ei({color:1714714})),this.led.position.set(i/2-e*.12,a+e*.08,.004),this.group.add(this.led),t.style==="tv"||t.style==="grey"){const g=new Je({color:2763310,roughness:.4});for(let S=0;S<2;S++){const w=new Zt(new Is(e*.028,e*.028,e*.03,16),g);w.rotation.x=Math.PI/2,w.position.set(i/2-e*.24-S*e*.09,a+e*.08,.012),this.group.add(w)}}this.hit=new Zt(new wn(i,r,this.depth),new ei({visible:!1})),this.hit.position.set(0,a+r/2,-this.depth/2),this.group.add(this.hit)}setLed(t,e){this.led.material.color.set(t?e:"#1a2a1a")}world(t){return this.group.updateMatrixWorld(!0),t.clone().applyMatrix4(this.group.matrixWorld)}normal(){const t=new Nn;return this.group.getWorldQuaternion(t),new P(0,0,1).applyQuaternion(t)}}const Ao={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Bs{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const z_=new yo(-1,1,1,-1,0,1);class H_ extends He{constructor(){super(),this.setAttribute("position",new xe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new xe([0,2,0,0,2,0],2))}}const G_=new H_;class sc{constructor(t){this._mesh=new Zt(G_,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,z_)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Qu extends Bs{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Le?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=mr.clone(t.uniforms),this.material=new Le({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new sc(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class td extends Bs{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class V_ extends Bs{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class W_{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new ut);this._width=n.width,this._height=n.height,e=new Ze(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:sn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Qu(Ao),this.copyPass.material.blending=Pn,this.timer=new Km}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}td!==void 0&&(o instanceof td?n=!0:o instanceof V_&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new ut);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const Co={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class $_ extends Bs{constructor(){super(),this.isOutputPass=!0,this.uniforms=mr.clone(Co.uniforms),this.material=new ou({name:Co.name,uniforms:this.uniforms,vertexShader:Co.vertexShader,fragmentShader:Co.fragmentShader}),this._fsQuad=new sc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Jt.getTransfer(this._outputColorSpace)===se&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===pa?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===ma?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ga?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Dr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===va?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===_a?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===xa&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class X_ extends Bs{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Bt}render(t,e,n){const i=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=i}}const Y_={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Bt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class zs extends Bs{constructor(t,e=1,n,i){super(),this.strength=e,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new ut(t.x,t.y):new ut(256,256),this.clearColor=new Bt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Ze(r,o,{type:sn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const h=new Ze(r,o,{type:sn});h.texture.name="UnrealBloomPass.h"+u,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);const d=new Ze(r,o,{type:sn});d.texture.name="UnrealBloomPass.v"+u,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}const a=Y_;this.highPassUniforms=mr.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Le({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new ut(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=mr.clone(Ao.uniforms),this.blendMaterial=new Le({uniforms:this.copyUniforms,vertexShader:Ao.vertexShader,fragmentShader:Ao.fragmentShader,premultipliedAlpha:!0,blending:Lr,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Bt,this._oldClearAlpha=1,this._basic=new ei,this._fsQuad=new sc(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new ut(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=zs.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=zs.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(t){const e=[],n=t/3;for(let i=0;i<t;i++)e.push(.39894*Math.exp(-.5*i*i/(n*n))/n);return new Le({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new ut(.5,.5)},direction:{value:new ut(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(t){return new Le({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}zs.BlurDirectionX=new ut(1,0),zs.BlurDirectionY=new ut(0,1);const q_={uniforms:{tDiffuse:{value:null},uRes:{value:new ut(1,1)},uTime:{value:0},uTear:{value:0},uDot:{value:3},uHalftone:{value:1}},vertexShader:`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform vec2 uRes;
    uniform float uTime, uTear, uDot, uHalftone;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec2 uv = vUv;
      // a tear: bands of the frame slip sideways
      float band = floor(uv.y * 24.0 + uTime * 30.0);
      uv.x += uTear * (hash(vec2(band, floor(uTime * 20.0))) - 0.5) * 0.06 * step(0.6, hash(vec2(band, 3.0)));

      vec2 d = uv - 0.5;
      float ca = 0.0012 + dot(d, d) * 0.004 + uTear * 0.006;
      vec3 col = vec3(
        texture2D(tDiffuse, uv + d * ca * 4.0).r,
        texture2D(tDiffuse, uv).g,
        texture2D(tDiffuse, uv - d * ca * 4.0).b
      );

      // Lain's red shade: a 45° dot screen, only in the penumbra
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      float pen = smoothstep(0.006, 0.03, lum) * (1.0 - smoothstep(0.05, 0.13, lum));
      vec2 px = gl_FragCoord.xy / uDot;
      vec2 r = vec2(px.x + px.y, px.x - px.y) * 0.7071;
      float cell = length(fract(r) - 0.5);
      float dotR = 0.12 + 0.2 * pen;
      float speck = 1.0 - smoothstep(dotR - 0.06, dotR + 0.06, cell);
      col = mix(col, max(col, vec3(0.22, 0.01, 0.025)), speck * pen * 0.55 * uHalftone);

      // grain and a vignette
      float g = hash(gl_FragCoord.xy + fract(uTime) * 311.0);
      col += (g - 0.5) * 0.035;
      col *= smoothstep(1.05, 0.35, length(d * vec2(1.0, 0.8)));
      gl_FragColor = vec4(col, 1.0);
    }`};class K_{constructor(t,e,n){R(this,"composer");R(this,"bloom");R(this,"wired");R(this,"tear",0);this.composer=new W_(t),this.composer.addPass(new X_(e,n)),this.bloom=new zs(new ut(256,256),.7,.5,.78),this.composer.addPass(this.bloom),this.wired=new Qu(q_),this.composer.addPass(this.wired),this.composer.addPass(new $_)}get u(){return this.wired.uniforms}setSize(t,e,n){this.composer.setPixelRatio(n),this.composer.setSize(t,e),this.u.uRes.value.set(t*n,e*n),this.u.uDot.value=Math.max(2.5,3*n)}kick(t=1){this.tear=Math.max(this.tear,t)}setHalftone(t){this.u.uHalftone.value=t?1:0}render(t,e){this.tear=Math.max(0,this.tear-e*2.2),this.u.uTime.value=t,this.u.uTear.value=this.tear*this.tear,this.composer.render(e)}}const Z_={color:723724,roughness:.55,metalness:0};class ed{constructor(t,e,n){R(this,"mesh");R(this,"uniforms",{uPulseColor:{value:new Bt},uPulseTime:{value:0},uPulseGain:{value:.35},uPulseCount:{value:3},uPulseSpeed:{value:.35}});R(this,"base",.35);R(this,"surgeLeft",0);R(this,"lit",0);const i=new eu(t,!1,"centripetal",.5),r=i.getLength(),o=new Gl(i,Math.max(40,Math.round(r*18)),e,6,!1),a=o.attributes.uv,l=new Float32Array(a.count);for(let u=0;u<a.count;u++)l[u]=a.getX(u);o.setAttribute("aAlong",new un(l,1)),this.uniforms.uPulseColor.value.set(n),this.uniforms.uPulseCount.value=Math.max(1,Math.round(r/2.2)),this.uniforms.uPulseSpeed.value=.18+Math.random()*.12;const c=new Je(Z_);c.onBeforeCompile=u=>{Object.assign(u.uniforms,this.uniforms),u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
attribute float aAlong;
varying float vAlong;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vAlong = aAlong;`),u.fragmentShader=u.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uPulseColor;
uniform float uPulseTime, uPulseGain, uPulseCount, uPulseSpeed;
varying float vAlong;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
float ph = fract(vAlong * uPulseCount + uPulseTime * uPulseSpeed);
float pulse = smoothstep(0.0, 0.03, ph) * (1.0 - smoothstep(0.03, 0.14, ph));
totalEmissiveRadiance += uPulseColor * (pulse * uPulseGain + 0.012 * uPulseGain);`)},c.customProgramCacheKey=()=>"oikos-cable",this.mesh=new Zt(o,c)}setLit(t){this.lit=t}surge(){this.surgeLeft=2.2}update(t,e){this.surgeLeft=Math.max(0,this.surgeLeft-e);const n=this.surgeLeft>0?Math.sin(this.surgeLeft/2.2*Math.PI)*5:0,i=this.base+this.lit*1.2+n;this.uniforms.uPulseGain.value+=(i-this.uniforms.uPulseGain.value)*Math.min(1,e*6),this.uniforms.uPulseTime.value=t*(1+this.lit*1.5+n*.8)}}function J_(s,t,e,n,i,r){const a=[s.clone()],l=s.clone().addScaledVector(t,.18);a.push(l);const c=new P(l.x,.022,l.z).addScaledVector(t,.22);s.y>.3&&a.push(new P(l.x,(s.y+.022)*.4,l.z).addScaledVector(t,.2)),a.push(c);const u=new P(e.x,.022,n-.14),h=Math.sign(c.x||1);c.z>n-.1&&a.push(new P(h*1.15,.022,n-.25));const d=2;for(let f=1;f<=d;f++){const p=f/(d+1),x=new P().lerpVectors(c,u,p),m=new P(u.z-c.z,0,c.x-u.x).normalize();x.addScaledVector(m,(r()-.5)*.9),x.y=.022,a.push(x)}return a.push(u),a.push(new P(e.x,i-.04,n-.035)),a.push(new P(e.x,i+.03,n+.01)),a.push(e.clone()),a}function nd(s,t,e,n=32){const i=[];for(let r=0;r<=n;r++){const o=r/n,a=new P().lerpVectors(s,t,o);a.y-=e*4*o*(1-o),i.push(a)}return i}function j_(){var a,l,c;const s=new Zn,t=new Je({color:854795,roughness:.9}),e=new Xh({color:328708}),n=[new P(-26,0,-18),new P(-9,0,-24),new P(8,0,-23),new P(24,0,-15),new P(33,0,2)],i=12.5,r=[];n.forEach((u,h)=>{const d=new Zt(new Is(.12,.17,i,8),t);d.position.set(u.x,i/2,u.z),s.add(d);const f=n[h+1]??n[h-1]??u,p=new P().subVectors(f,u).setY(0).normalize(),x=new P(-p.z,0,p.x),m=[];for(const[g,S]of[[i-.4,1.9],[i-1.5,1.4]]){const w=new Zt(new wn(S*2,.12,.12),t);w.position.set(u.x,g,u.z),w.rotation.y=Math.atan2(-x.z,x.x),s.add(w);for(const y of[-1,-.45,.45,1])m.push(new P(u.x,g+.08,u.z).addScaledVector(x,y*S*.95))}r.push(m)});for(let u=0;u<r.length-1;u++){const h=r[u]??[],d=r[u+1]??[];h.forEach((f,p)=>{const x=d[p];if(!x)return;const m=new He().setFromPoints(nd(f,x,1.4+p%3*.25));s.add(new Kh(m,e))})}const o=[[(a=r[1])==null?void 0:a[0],new P(-2.4,9,-6.6)],[(l=r[2])==null?void 0:l[3],new P(2.2,9,-6.1)],[(c=r[3])==null?void 0:c[1],new P(6,8.5,-3)]];for(const[u,h]of o)u&&s.add(new Kh(new He().setFromPoints(nd(u,h,2.2)),e));return s}function Q_(){const s=new Le({side:Ye,depthWrite:!1,fog:!1,uniforms:{uTime:{value:0}},vertexShader:`
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,fragmentShader:`
      uniform float uTime;
      varying vec3 vDir;
      void main() {
        float h = vDir.y;
        // an ember along the skyline, uneven, strongest right at the horizon —
        // where it equals HORIZON_FOG, so the far floor fogs into it seamlessly
        float az = atan(vDir.x, vDir.z);
        float uneven = 0.62 + 0.38 * sin(az * 2.0 + 0.6) * sin(az * 5.0 + 2.1);
        vec3 ember = vec3(0.045, 0.0055, 0.0075);
        vec3 col = ember * mix(1.0, uneven, smoothstep(0.0, 0.02, h)) * exp(-pow(max(h, 0.0) * 16.0, 1.6));
        col += vec3(0.004, 0.0008, 0.0014) * (1.0 - smoothstep(0.0, 0.5, h));
        if (h < 0.0) col = ember + vec3(0.004, 0.0008, 0.0014);
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`}),t=new Zt(new go(70,32,16),s);return t.renderOrder=-1,t}const tn=.62,rc=1.6,Ro=1.1,Si=.1,id=Si-Ro/2,Ki="#ffb347",oc="rgba(255,179,71,0.68)",wi='"VT323", "IBM Plex Mono", ui-monospace, monospace';class ty{constructor(){R(this,"canvas",document.createElement("canvas"));R(this,"glow",.8);R(this,"ctx");R(this,"mode",{kind:"idle"});R(this,"dirty",!0);R(this,"lastKey","");R(this,"fontsReady",!1);var t;this.canvas.width=512,this.canvas.height=384,this.ctx=this.canvas.getContext("2d"),(t=document.fonts)==null||t.load(`40px ${wi}`).then(()=>{this.fontsReady=!0,this.dirty=!0},()=>{this.fontsReady=!0})}scroll(t,e){this.mode={kind:"scroll",text:t,at:e},this.dirty=!0}play(t,e,n){this.mode={kind:"play",channel:t,name:e,at:n},this.dirty=!0}stop(){this.mode={kind:"idle"},this.dirty=!0}update(t,e){const n=this.mode;if(n.kind==="scroll"){const l=512+n.text.length*22;(t-n.at)*120>l&&this.stop()}const i=new Date,r=Math.floor(t*2)%2===0,o=this.mode.kind==="scroll"?Math.floor((t-this.mode.at)*15):0,a=`${this.mode.kind}|${i.getHours()}:${i.getMinutes()}|${r}|${o}|${this.fontsReady}`;if(!this.dirty&&a===this.lastKey)return!1;this.lastKey=a,this.dirty=!1;try{this.paint(t,i,r)}catch{return!1}return!0}paint(t,e,n){const i=this.ctx;if(!i)return;const r=this.canvas.width,o=this.canvas.height;i.fillStyle="#060302",i.fillRect(0,0,r,o),i.textBaseline="alphabetic",i.fillStyle=Ki,i.font=`48px ${wi}`,i.fillText("æthera",26,56),i.fillStyle=oc,i.font=`36px ${wi}`,i.textAlign="right",i.fillText(`day ${iy(e)} · ${ac(e.getHours())}:${ac(e.getMinutes())}`,r-26,54),i.textAlign="left",i.fillRect(26,72,r-52,2);const a=this.mode;if(a.kind==="play"?(i.fillStyle=oc,i.font=`30px ${wi}`,i.fillText(`▸ ch ${ac(a.channel)}`,26,150),i.fillStyle=Ki,i.font=`64px ${wi}`,i.fillText(sy(i,a.name,r-52),26,214),i.fillStyle=oc,i.font=`26px ${wi}`,i.fillText(`opening${".".repeat(1+Math.floor(t*2)%3)}`,26,262)):(i.save(),i.fillStyle=Ki,i.shadowColor="rgba(255,138,61,0.55)",i.shadowBlur=18,i.font=`180px ${wi}`,i.textAlign="center",i.fillText("æ",r/2,250),i.restore()),i.fillStyle=Ki,i.font=`40px ${wi}`,a.kind==="scroll"){const l=r-(t-a.at)*120;i.fillText(a.text,l,o-30)}else i.fillText(`~ ${n?"_":" "}`,26,o-30)}}class ey{constructor(){R(this,"group",new Zn);R(this,"hit");R(this,"display",new ty);R(this,"monitor");R(this,"rearY",tn-.02);R(this,"rearZ",id);R(this,"hddLed");R(this,"busyLeft",0);R(this,"power",0);R(this,"hover",0);R(this,"link");const t=new Je({color:723725,roughness:.7,metalness:.1}),e=new Zt(new ii(rc,tn,Ro,2,.02),t);e.position.set(0,tn/2,Si),this.group.add(e);const n=new Zt(new wn(rc+.02,.006,Ro+.02),new ei({color:11735583}));n.position.set(0,tn-.03,Si),this.group.add(n),this.monitor=new ju({style:"beige",screenW:.66,screen:this.display.canvas,label:"aethera",accent:Ki,seed:315}),this.monitor.group.position.set(-.22,tn,Si+.14),this.monitor.group.rotation.y=.05,this.group.add(this.monitor.group);const i=new Je({color:12168852,roughness:.62,metalness:.05}),r=.25,o=.56,a=.52,l=new Zn;l.position.set(.53,tn,Si-.04),l.rotation.y=-.12,this.group.add(l);const c=new Zt(new ii(r,o,a,3,.012),i);c.position.y=o/2,l.add(c);const u=new Je({color:3814700,roughness:.5});for(const[g,S]of[[.49,.04],[.435,.04],[.37,.014]]){const w=new Zt(new fn(r*.78,S),u);w.position.set(0,g,a/2+.001),l.add(w)}const h=(g,S)=>{const w=new ei({color:g}),y=new Zt(new Ol(.006,10),w);return y.position.set(r*.28,S,a/2+.002),l.add(y),w};h(7208826,.08),this.hddLed=h(3810320,.06);const d=new Zt(new ii(.5,.028,.17,2,.006),i);d.position.set(-.22,tn+.016,Si+.4),d.rotation.set(.06,.04,0),this.group.add(d);const f=new Zt(new fn(.46,.13),new Je({map:ny(),roughness:.6}));f.rotation.x=-Math.PI/2,f.position.set(0,.0145,0),d.add(f),this.group.updateMatrixWorld(!0);const p=new P(.53-.05,tn+.12,Si-.3),x=this.monitor.world(this.monitor.portLocal),m=new P().lerpVectors(p,x,.5).setY(tn+.01);this.link=new ed([p,p.clone().setY(tn+.02),m,x.clone().setY(tn+.03),x],.01,Ki),this.group.add(this.link.mesh),this.hit=new Zt(new wn(rc,.82,Ro),new ei({visible:!1})),this.hit.position.set(0,tn+.36,Si),this.group.add(this.hit)}screenWorld(){return this.monitor.world(this.monitor.screenLocal)}load(t){this.busyLeft=t?1.4:.5}update(t,e,n){this.power=Math.min(1,this.power+e/.8),this.hover+=((n?1:0)-this.hover)*Math.min(1,e*8),this.display.glow=.8+this.hover*.2;const i=this.monitor.crt.uniforms;i.uTime.value=t,i.uPower.value=this.power,i.uHover.value=this.hover,this.power>.2&&this.display.update(t,e)&&(this.monitor.texture.needsUpdate=!0),this.monitor.setLed(this.power>.5,Ki),this.busyLeft=Math.max(0,this.busyLeft-e);const r=this.busyLeft>0&&Math.sin(t*47)+Math.sin(t*29)>.3;this.hddLed.color.setHex(r?16757575:3810320),this.link.update(t,e)}}function ny(){const s=document.createElement("canvas");s.width=256,s.height=72;const t=s.getContext("2d");if(t){t.fillStyle="#8e8571",t.fillRect(0,0,256,72),t.fillStyle="#cfc6ae";for(let n=0;n<4;n++)for(let i=0;i<15;i++)t.fillRect(4+i*16.6+n%2*4,5+n*16,13.5,13);t.fillRect(56,65,120,4)}const e=new Ls(s);return e.colorSpace=Ue,e}function iy(s){const t=Date.UTC(s.getFullYear(),0,0),e=Date.UTC(s.getFullYear(),s.getMonth(),s.getDate());return Math.round((e-t)/864e5)}function ac(s){return String(s).padStart(2,"0")}function sy(s,t,e){if(s.measureText(t).width<=e)return t;let n=t;for(;n.length>1&&s.measureText(`${n}…`).width>e;)n=n.slice(0,-1);return`${n}…`}const ry=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2;function oy(){const s=document.createElement("canvas");s.width=s.height=128;const t=s.getContext("2d");if(t){const e=t.createRadialGradient(64,64,0,64,64,64);e.addColorStop(0,"rgba(255,255,255,0.9)"),e.addColorStop(.4,"rgba(255,255,255,0.3)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,128,128)}return new Ls(s)}class ay{constructor(t,e,n,i){R(this,"renderer");R(this,"scene",new hm);R(this,"camera",new je(45,1,.05,160));R(this,"controls");R(this,"post");R(this,"core",new ey);R(this,"field");R(this,"sky");R(this,"stations",new Map);R(this,"pickables",[]);R(this,"raycaster",new Jm);R(this,"pointer",new ut(-9,-9));R(this,"pointerPx",{x:0,y:0});R(this,"pointerDirty",!1);R(this,"hovered",null);R(this,"focused",null);R(this,"tween",null);R(this,"playing",null);R(this,"settlePlay",null);R(this,"tuneSeq",0);R(this,"lastAspect",0);R(this,"later",[]);R(this,"clock",new jm);R(this,"t",0);R(this,"running",!1);R(this,"raf",0);R(this,"lastInput",0);R(this,"swayDir",1);R(this,"pixelRatio");R(this,"maxPixelRatio");R(this,"frameTimes",[]);R(this,"qualityStep",0);R(this,"shift",{x:0,y:0});R(this,"tuned",null);R(this,"shiftTarget",{x:0,y:0});R(this,"reduced");R(this,"lowPower");R(this,"speed",Math.min(10,Math.max(1,Number(new URLSearchParams(location.search).get("speed"))||1)));R(this,"driven",new URLSearchParams(location.search).has("drive"));R(this,"perf",{frames:0,paint:0,render:0,uploads:0});R(this,"frustum",new ho);R(this,"viewProj",new re);R(this,"kept",null);R(this,"calm",0);this.container=t,this.events=i,this.reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,this.lowPower=matchMedia("(pointer: coarse)").matches||Math.min(innerWidth,innerHeight)<600,this.maxPixelRatio=Math.min(devicePixelRatio||1,this.lowPower?1.25:1.6),this.pixelRatio=this.maxPixelRatio,this.renderer=new m_({antialias:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.toneMapping=Dr,this.renderer.toneMappingExposure=1.1,this.renderer.outputColorSpace=Ue,this.renderer.domElement.id="oikos-gl",this.renderer.domElement.setAttribute("role","img"),this.renderer.domElement.setAttribute("aria-label","a dark room full of screens, each one a place on æthera"),t.prepend(this.renderer.domElement);try{this.build(e,n)}catch(r){throw this.renderer.domElement.remove(),this.renderer.dispose(),this.renderer.forceContextLoss(),r}}build(t,e){this.scene.background=new Bt(0),this.scene.fog=new yl(new Bt().setRGB(.049,.0063,.0089,er),.042),this.sky=Q_(),this.scene.add(this.sky),this.scene.add(new Hm(4866648,393988,.8));const n=new Xm(9082040,.35);n.position.set(-4,10,-6),this.scene.add(n);const i=new Vm(14212351,9,7,.42,.65,1.6);i.position.set(.4,4.6,1.2),i.target.position.set(-.05,tn+.3,.15),this.scene.add(i,i.target);const r=new $l(10466303,2.2,4.5,2);r.position.set(-.4,1.35,2.3),this.scene.add(r);const o=new $l(11735583,1.6,4,2);o.position.set(0,.25,1.4),this.scene.add(o),this.buildFloor(),this.scene.add(this.core.group),this.pickables.push(this.core.hit),this.core.hit.userData.pick="vcr",this.scene.add(j_());const a=Ii(1998);this.field=new D_(this.lowPower?40:90,a,this.scene.fog),this.scene.add(this.field.group),this.buildStations(t,e,a),this.controls=new x_(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.enablePan=!1,this.controls.rotateSpeed=.28,this.controls.zoomSpeed=.6,this.controls.addEventListener("start",()=>this.lastInput=this.t),this.post=new K_(this.renderer,this.scene,this.camera),this.resize();const l=this.homePose();this.camera.position.copy(l.pos),this.controls.target.copy(l.target),this.applyLimits(null),this.controls.update(),this.bindPointer(),addEventListener("resize",()=>this.resize())}buildFloor(){const t=document.createElement("canvas");t.width=t.height=512;const e=t.getContext("2d");if(e){e.fillStyle="#0c0b0d",e.fillRect(0,0,512,512),e.strokeStyle="rgba(120,110,130,0.10)",e.lineWidth=2;for(let r=0;r<=512;r+=128)e.beginPath(),e.moveTo(r,0),e.lineTo(r,512),e.moveTo(0,r),e.lineTo(512,r),e.stroke();for(let r=0;r<900;r++)e.fillStyle=`rgba(${Math.random()<.3?"120,20,30":"90,90,100"},${Math.random()*.12})`,e.fillRect(Math.random()*512,Math.random()*512,2,2)}const n=new Ls(t);n.wrapS=n.wrapT=Nr,n.repeat.set(24,24),n.colorSpace=Ue,n.anisotropy=8;const i=new Zt(new fn(96,96),new Je({map:n,roughness:.82,metalness:.15}));i.rotation.x=-Math.PI/2,this.scene.add(i)}buildStations(t,e,n){const i=new Je({color:1315086,roughness:.85}),r=new Je({color:657930,roughness:.6}),o=oy(),a=new P,l=new Map,c=t.map((h,d)=>({site:h,i:d,p:jf(h.id,d)}));c.sort((h,d)=>+!!h.p.on-+!!d.p.on);let u=0;for(const{site:h,p:d}of c){if(h.screen===!1)continue;const f=e.get(h.id);if(!f)continue;const p=new ju({style:d.style,screenW:d.screenW,screen:f.canvas,label:h.title,accent:h.accent,seed:Math.floor(n()*1e3),stand:d.stand}),x=Wr.degToRad(d.angle),m=d.on?l.get(d.on):void 0;if(m)p.group.position.copy(m.group.position),p.group.position.y+=m.height,p.group.rotation.copy(m.group.rotation),p.group.rotateY((n()-.5)*.12),p.group.translateZ(-(m.depth-p.depth)*.3);else{p.group.position.set(Math.sin(x)*d.r,d.y,-Math.cos(x)*d.r);const D=new P(0,d.hang?1.3:p.group.position.y+.6,.6);p.group.lookAt(D),d.hang||(p.group.rotation.set(0,Math.atan2(-p.group.position.x,.6-p.group.position.z),0),p.group.rotateY((n()-.5)*.1))}if(this.scene.add(p.group),l.set(h.id,p),!d.hang&&!d.on&&d.y>.01){const D=new Zt(new wn(p.width*.92,d.y,p.depth*.9),i);D.position.set(0,-d.y/2,-p.depth*.45),p.group.add(D)}if(d.hang){const D=p.world(p.topLocal),U=new Zt(new Is(.008,.008,16,5),r);U.position.set(D.x,D.y+8,D.z),this.scene.add(U)}const g=-.5+u++*.37%1;a.set(g,this.core.rearY-.05,this.core.rearZ-.01);const S=p.world(p.portLocal),w=p.normal().multiplyScalar(-1).setY(0).normalize();let y;const M=d.feeds?l.get(d.feeds):void 0;if(M){const D=M.world(M.portLocal.clone().add(new P(-.25,.15,0))),U=new P().lerpVectors(S,D,.5);U.y=Math.min(S.y,D.y)-.6,y=[S,S.clone().addScaledVector(w,.3).setY(S.y-.2),U,D.clone().add(new P(0,.3,-.3)),D]}else y=J_(S,w,a,id,tn,n);const E=new ed(y,d.hang?.014:.02,h.accent);this.scene.add(E.mesh);const C=new Zt(new fn(d.screenW*2.6,d.screenW*2.2),new ei({map:o,color:h.accent,transparent:!0,opacity:0,depthWrite:!1,blending:Lr,fog:!0})),_=p.normal().setY(0).normalize(),T=p.world(p.screenLocal).addScaledVector(_,d.screenW*.9);C.position.set(T.x,.012,T.z),C.rotation.x=-Math.PI/2,C.rotation.z=Math.atan2(_.x,_.z),d.hang||this.scene.add(C);let L=null;this.lowPower||(L=new $l(h.accent,0,3.2+d.screenW,2),L.position.copy(p.world(p.screenLocal).addScaledVector(p.normal(),1.1)),this.scene.add(L)),p.hit.userData.pick=h.id,this.pickables.push(p.hit),this.stations.set(h.id,{site:h,screen:f,monitor:p,placement:d,cable:E,glow:C,light:L,power:0,powerAt:1/0,staticLeft:0,hover:0})}}homePose(){const t=this.camera.aspect,e=t<1,n=e?7.2+(1-t)*2.4:7.8;return{pos:new P(0,e?2.5:2.4,n),target:new P(0,e?1.7:1.95,-1.6)}}posesFor(t){if(t==="vcr"){const c=this.camera.aspect<1,u=this.core.screenWorld();return{pos:new P(u.x+.25,u.y+.35,c?3.4:2.5),target:u.clone().setY(u.y-.08)}}const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.world(n.screenLocal),r=n.normal(),o=Wr.degToRad(this.camera.fov),a=2*Math.atan(Math.tan(o/2)*this.camera.aspect),l=Math.max(n.screenH/2/Math.tan(o/2)/.46,n.screenH/.75/2/Math.tan(a/2)/.7);return{pos:i.clone().addScaledVector(r,l+.05),target:i}}applyLimits(t){const e=this.controls;if(!t){e.minDistance=3,e.maxDistance=15,e.minAzimuthAngle=-.8,e.maxAzimuthAngle=.8,e.minPolarAngle=.95,e.maxPolarAngle=1.56;return}const n=new P().subVectors(this.camera.position,e.target),i=new Yl().setFromVector3(n);e.minDistance=i.radius*.45,e.maxDistance=i.radius*1.7,e.minAzimuthAngle=i.theta-.6,e.maxAzimuthAngle=i.theta+.6,e.minPolarAngle=Math.max(.3,i.phi-.45),e.maxPolarAngle=Math.min(1.6,i.phi+.35)}flyTo(t,e,n){this.controls.enabled=!1,this.controls.minAzimuthAngle=-1/0,this.controls.maxAzimuthAngle=1/0,this.tween={from:{pos:this.camera.position.clone(),target:this.controls.target.clone()},to:t,k:0,dur:this.reduced?.01:e,done:n}}focus(t){const e=t?this.posesFor(t):this.homePose();if(e){this.cancelPlay(),this.focused=t;for(const[n,i]of this.stations)i.cable.setLit(n===t?1:0);this.flyTo(e,t?1.15:1.3,()=>{this.applyLimits(t),this.controls.enabled=!this.tuned,this.controls.update()})}}get focusedId(){return this.focused}keepAlive(t){this.kept=t}get busy(){return this.playing!==null}cancelPlay(){this.playing=null;const t=this.settlePlay;this.settlePlay=null,t==null||t(!1)}play(t){const e=this.stations.get(t),n=this.posesFor(t);if(!e||!n)return Promise.resolve(!0);this.cancelPlay();const i=new Promise(c=>this.settlePlay=c);this.core.load(e.site.title),this.core.display.play(e.placement.channel,e.site.title,this.t),this.focused=t,this.playing=t;for(const[c,u]of this.stations)u.cable.setLit(c===t?1:0);const r=()=>{this.playing===t&&(e.staticLeft=.9,this.post.kick(.7),this.flyTo(n,1.15,()=>{if(this.playing!==t)return;this.playing=null,this.applyLimits(t),this.controls.enabled=!this.tuned,this.controls.update();const c=this.settlePlay;this.settlePlay=null,c==null||c(!0)}))};if(this.reduced)return r(),i;const o=Math.sign(e.monitor.group.position.x)||1,a=this.camera.aspect<1,l={pos:new P(o*.45,1.4,a?3.1:2.25),target:this.core.screenWorld()};return this.flyTo(l,.8,()=>{this.playing===t&&(e.cable.surge(),this.after(.35,r))}),i}after(t,e){this.later.push({at:this.t+t,fn:e})}eject(){this.core.load(null),this.core.display.stop()}scroll(t){this.core.display.scroll(t,this.t)}dive(t){const e=this.stations.get(t);if(!e||this.reduced)return Promise.resolve();this.cancelPlay();const n=e.monitor,i=n.world(n.screenLocal),r=i.clone().addScaledVector(n.normal(),n.screenH*.16);return e.staticLeft=.8,this.post.kick(1),new Promise(o=>this.flyTo({pos:r,target:i},.75,o))}powerOn(){let t=0;const e=[...this.stations.values()].sort((n,i)=>n.placement.channel-i.placement.channel);for(const n of e)n.powerAt=this.t+.25+t++*(this.reduced?0:.14)}anchor(t){let e;if(t==="vcr")e=this.core.screenWorld().add(new P(0,-.32,.45));else{const i=this.stations.get(t);if(!i)return null;e=i.monitor.world(i.monitor.screenLocal.clone().add(new P(0,i.monitor.screenH*.5,0)))}if(e.project(this.camera),e.z>1)return null;const n=this.renderer.domElement.getBoundingClientRect();return{x:n.left+(e.x+1)/2*n.width,y:n.top+(1-e.y)/2*n.height}}setShift(t,e){this.shiftTarget={x:t,y:e}}applyShift(t){this.tuned&&(this.shiftTarget={x:0,y:0});const e=this.reduced?1:Math.min(1,t*5),n=this.shift.x+(this.shiftTarget.x-this.shift.x)*e,i=this.shift.y+(this.shiftTarget.y-this.shift.y)*e;if(Math.abs(n-this.shift.x)<.05&&Math.abs(i-this.shift.y)<.05&&this.camera.view)return;this.shift={x:n,y:i};const r=this.container.clientWidth||innerWidth,o=this.container.clientHeight||innerHeight;this.camera.setViewOffset(r,o,n,i,r,o)}tuneIn(t,e){const n=this.stations.get(t),i=this.tunePose(t);if(!n||!i)return Promise.resolve();this.tuneOut(),this.cancelPlay();const r=this.tuneSeq;this.focused=t,this.shiftTarget={x:0,y:0};for(const[o,a]of this.stations)a.cable.setLit(o===t?1:0);return new Promise(o=>this.flyTo(i,1.1,()=>{if(r!==this.tuneSeq){this.applyLimits(t),this.controls.enabled=!0;return}this.tuned={id:t,place:e},n.staticLeft=0,this.resize(),o()}))}tunePose(t){const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.screenH/.75,r=n.world(n.screenLocal),o=Wr.degToRad(this.camera.fov),a=2*Math.atan(Math.tan(o/2)*this.camera.aspect),l=Math.max(n.screenH/2/Math.tan(o/2)/.84,i/2/Math.tan(a/2)/.94);return{pos:r.clone().addScaledVector(n.normal(),l),target:r}}tuneOut(){this.tuneSeq++,this.tuned&&(this.tuned=null,this.tween||(this.applyLimits(this.focused),this.controls.enabled=!0))}reset(){this.tuneOut(),this.cancelPlay(),this.focus(null)}glassRect(t){const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.screenH/.75,r=this.renderer.domElement.getBoundingClientRect(),o=[],a=[];this.camera.updateMatrixWorld();for(const[u,h]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const d=n.world(n.screenLocal.clone().add(new P(u*i/2,h*n.screenH/2,i*.02)));d.project(this.camera),o.push(r.left+(d.x+1)/2*r.width),a.push(r.top+(1-d.y)/2*r.height)}const l=Math.min(...o),c=Math.min(...a);return new DOMRectReadOnly(l,c,Math.max(...o)-l,Math.max(...a)-c)}get tunedId(){var t;return((t=this.tuned)==null?void 0:t.id)??null}bindPointer(){const t=this.renderer.domElement;let e=null;t.addEventListener("pointermove",n=>{const i=t.getBoundingClientRect();this.pointer.set((n.clientX-i.left)/i.width*2-1,-((n.clientY-i.top)/i.height)*2+1),this.pointerPx={x:n.clientX,y:n.clientY},this.pointerDirty=!0,this.lastInput=this.t}),t.addEventListener("pointerleave",()=>{this.pointer.set(-9,-9),this.pointerDirty=!0}),t.addEventListener("pointerdown",n=>{if(n.button!==0||!n.isPrimary){e=null;return}e={x:n.clientX,y:n.clientY,t:performance.now()},this.lastInput=this.t}),t.addEventListener("pointerup",n=>{if(!e)return;const i=Math.hypot(n.clientX-e.x,n.clientY-e.y),r=performance.now()-e.t<600;if(e=null,i>7||!r||this.tuned)return;const o=t.getBoundingClientRect();this.pointer.set((n.clientX-o.left)/o.width*2-1,-((n.clientY-o.top)/o.height)*2+1),this.events.pick(this.pickAt())})}pickFromPoint(t,e){const n=this.renderer.domElement.getBoundingClientRect(),i=this.pointer.clone();this.pointer.set((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);const r=this.pickAt();return this.pointer.copy(i),r}pickAt(){this.raycaster.setFromCamera(this.pointer,this.camera);const t=this.raycaster.intersectObjects(this.pickables,!1)[0];return(t==null?void 0:t.object.userData.pick)??null}resize(){const t=this.container.clientWidth||innerWidth,e=this.container.clientHeight||innerHeight,n=Math.abs(t/e-this.lastAspect)>.02;if(this.lastAspect=t/e,this.camera.aspect=t/e,this.camera.fov=this.camera.aspect<1?58:45,this.camera.setViewOffset(t,e,this.shift.x,this.shift.y,t,e),this.renderer.setSize(t,e,!1),this.renderer.domElement.style.width=`${t}px`,this.renderer.domElement.style.height=`${e}px`,this.post.setSize(t,e,this.pixelRatio),this.tuned){this.shift={x:0,y:0},this.camera.setViewOffset(t,e,0,0,t,e);const i=this.tunePose(this.tuned.id);i&&(this.camera.position.copy(i.pos),this.controls.target.copy(i.target),this.camera.lookAt(i.target));const r=this.glassRect(this.tuned.id);r&&this.tuned.place(r)}if(n&&!this.tween&&!this.focused&&this.controls){const i=this.homePose();this.camera.position.copy(i.pos),this.controls.target.copy(i.target)}}async warm(t=5e3){try{await Promise.race([this.renderer.compileAsync(this.scene,this.camera),new Promise(e=>setTimeout(e,t))]),this.post.render(0,0)}catch(e){console.warn("oikos: warm-up skipped",e)}}start(){if(this.running)return;if(this.running=!0,this.clock.getDelta(),this.driven){const e=this.renderer.getContext();window.__oikos={step:(n=1,i=1/30)=>{var r;this.perf={frames:0,paint:0,render:0,uploads:0};for(let o=0;o<n;o++)this.frame(i),e.finish();return{...this.perf,t:this.t,focused:this.focused,hovered:this.hovered,tuned:((r=this.tuned)==null?void 0:r.id)??null}},anchor:n=>this.anchor(n),glass:n=>this.glassRect(n)};return}const t=()=>{this.running&&(this.raf=requestAnimationFrame(t),this.frame())};this.raf=requestAnimationFrame(t)}stop(){this.running=!1,cancelAnimationFrame(this.raf)}adapt(t){this.frameTimes.push(t);const e=this.frameTimes.reduce((i,r)=>i+r,0);if(this.frameTimes.length<90&&e<2)return;const n=this.frameTimes.reduce((i,r)=>i+r,0)/this.frameTimes.length;if(this.frameTimes=[],this.calm=n<1/50?this.calm+1:0,this.calm>=3&&this.qualityStep>0){this.calm=0,this.qualityStep--,this.pixelRatio=Math.min(this.maxPixelRatio,this.pixelRatio/.8),this.post.bloom.enabled=!0,this.applyPixelRatio();return}n>1/27&&this.qualityStep<3&&(this.qualityStep++,this.pixelRatio=Math.max(.6,this.pixelRatio*.8),this.qualityStep>=3&&(this.post.bloom.enabled=!1),this.applyPixelRatio())}applyPixelRatio(){this.renderer.setPixelRatio(this.pixelRatio);const t=this.container.clientWidth||innerWidth,e=this.container.clientHeight||innerHeight;this.renderer.setSize(t,e,!1),this.post.setSize(t,e,this.pixelRatio)}frame(t){var a;const e=t??this.clock.getDelta(),n=Math.min(e,.1)*this.speed;this.t+=n;const i=this.t;if(this.driven||this.adapt(Math.min(e,.5)),this.applyShift(n),this.later.length){const l=this.later.filter(c=>c.at<=i);this.later=this.later.filter(c=>c.at>i);for(const c of l)c.fn()}if(this.tween){const l=this.tween;l.k=Math.min(1,l.k+n/l.dur);const c=ry(l.k);this.camera.position.lerpVectors(l.from.pos,l.to.pos,c),this.controls.target.lerpVectors(l.from.target,l.to.target,c),this.camera.lookAt(this.controls.target),l.k>=1&&(this.tween=null,(a=l.done)==null||a.call(l))}else{if(!this.focused&&!this.reduced&&i-this.lastInput>9){this.controls.autoRotate=!0;const l=this.controls.getAzimuthalAngle();l>.32&&(this.swayDir=1),l<-.32&&(this.swayDir=-1),this.controls.autoRotateSpeed=.18*this.swayDir}else this.controls.autoRotate=!1;this.controls.update(n)}if(this.pointerDirty&&!this.tween){this.pointerDirty=!1;const l=this.pickAt();l!==this.hovered&&(this.hovered=l,this.renderer.domElement.style.cursor=l?"pointer":""),this.events.hover(l,this.pointerPx.x,this.pointerPx.y)}const r=performance.now();this.camera.updateMatrixWorld(),this.viewProj.multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.viewProj);for(const[l,c]of this.stations){i>=c.powerAt&&(c.power=Math.min(1,c.power+n/(this.reduced?.01:.8))),c.staticLeft=Math.max(0,c.staticLeft-n),c.hover+=((l===this.hovered?1:0)-c.hover)*Math.min(1,n*8);const u=c.monitor.crt.uniforms;u.uTime.value=i,u.uPower.value=c.power,u.uHover.value=c.hover,u.uStatic.value=Math.min(1,c.staticLeft*1.6);const h=this.focused===l,d=h||l===this.kept||this.frustum.intersectsObject(c.monitor.glass),f=this.focused&&this.focused!=="vcr"&&!h&&l!==this.kept?.5:1;c.power>.2&&d&&c.screen.tick(i,n,h,f)&&(c.monitor.texture.needsUpdate=!0,this.perf.uploads++),c.monitor.setLed(c.power>.5,c.site.accent);const p=c.glow.material;p.opacity=c.power*(.16+c.hover*.12+(h?.1:0)),c.light&&(c.light.intensity=c.power*(2.2+c.hover*1.4+(h?.6:0))),c.cable.update(i,n)}this.core.update(i,n,this.hovered==="vcr"),this.field.update(i);const o=performance.now();if(this.post.render(i,n),this.driven){this.renderer.getContext().finish();const l=performance.now();this.perf.frames++,this.perf.paint+=o-r,this.perf.render+=l-o}}}let ly=0;const cy=s=>`${s}${++ly}`,hy="/static/oikos/mark.png",oe="#ffb347",Oe="rgba(255,179,71,.75)",Ei="rgba(255,179,71,.4)",ye="#1c0e0b",uy="#2a1612",En="#8fe3ec",lc="#ff6a5a",Po="#7dff6a";function pe(s,t){return`<svg viewBox="0 0 ${s} ${s}" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`}function dy(s,t=""){const e=cy("gl");return pe(48,`<defs><radialGradient id="${e}" cx=".42" cy=".38" r=".8"><stop offset="0" stop-color="${s}" stop-opacity="1"/><stop offset=".75" stop-color="${s}" stop-opacity=".55"/><stop offset="1" stop-color="${s}" stop-opacity=".25"/></radialGradient></defs>
<rect x="5" y="7" width="38" height="29" rx="4" fill="${ye}" stroke="${Oe}" stroke-width="1.6"/>
<rect x="9.5" y="11" width="29" height="21" rx="3" fill="url(#${e})"/>
<path d="M9.5 15.5h29M9.5 20h29M9.5 24.5h29M9.5 29h29" stroke="#000" stroke-opacity=".18" stroke-width="1"/>
<path d="M12 13.5h8" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/>
<path d="M18 36l-2.5 5h17L30 36" fill="${ye}" stroke="${Oe}" stroke-width="1.6"/>
<circle cx="39.5" cy="33.5" r=".9" fill="${s}" stroke="none"/>`)}const Tn=dy;function yr(){return pe(48,`<path d="M5 13h13l4 4h21v22H5z" fill="${ye}" stroke="${Oe}" stroke-width="1.6"/>
<path d="M5 20h38" stroke="${Ei}" stroke-width="1.2"/>
<path d="M17 31c2.4-3.4 4.8-3.4 7 0s4.6 3.4 7 0" stroke="${oe}" stroke-width="2.2"/>`)}function sd(){return pe(48,`<rect x="4" y="8" width="26" height="21" rx="3" fill="${ye}" stroke="${Oe}" stroke-width="1.6"/>
<rect x="7.5" y="11.5" width="19" height="14" rx="2" fill="${oe}" fill-opacity=".22" stroke="${Ei}"/>
<path d="M10 15h8M10 18.5h11M10 22h6" stroke="${oe}" stroke-width="1.3"/>
<path d="M13 29l-1.5 4h11L21 29" stroke="${Oe}" stroke-width="1.6"/>
<rect x="33" y="10" width="11" height="28" rx="1.5" fill="${ye}" stroke="${Oe}" stroke-width="1.6"/>
<path d="M35.5 15h6M35.5 18h6" stroke="${Ei}" stroke-width="1.2"/>
<circle cx="38.5" cy="32" r="1.4" fill="${Po}" stroke="none"/>
<path d="M24 36c3 4 9 4 12 2" stroke="${Ei}" stroke-width="1.2"/>`)}function rd(){return pe(48,`<circle cx="24" cy="24" r="17" fill="${ye}" stroke="${En}" stroke-opacity=".8" stroke-width="1.6"/>
<ellipse cx="24" cy="24" rx="7.5" ry="17" stroke="${En}" stroke-opacity=".55" stroke-width="1.2"/>
<path d="M7 24h34M10 15h28M10 33h28" stroke="${En}" stroke-opacity=".45" stroke-width="1.2"/>`)}function fy(){return pe(16,`<rect x="1" y="2.5" width="6" height="5" rx="1" fill="${ye}" stroke="${oe}" stroke-width="1.1"/>
<rect x="9" y="8.5" width="6" height="5" rx="1" fill="${ye}" stroke="${oe}" stroke-width="1.1"/>
<path d="M4 7.5v3.5h5" stroke="${oe}" stroke-width="1.1"/>
<circle cx="12" cy="11" r="1" fill="${Po}" stroke="none"/>`)}function od(s){const t=s?"#ff7a5c":oe;return pe(16,`<path d="M10.5 2.2a6 6 0 1 0 3.3 9.6A5 5 0 0 1 10.5 2.2z" fill="${s?t:"none"}" fill-opacity="${s?".85":"0"}" stroke="${t}" stroke-width="1.2"/>
${s?`<circle cx="12.8" cy="12.8" r="1.8" fill="${lc}" stroke="none"/>`:""}`)}function ad(s){return pe(24,`<circle cx="12" cy="12" r="9.5" fill="${ye}" stroke="${Oe}" stroke-width="1.4"/><path d="${s==="back"?"M13.5 7.5L9 12l4.5 4.5":"M10.5 7.5L15 12l-4.5 4.5"}" stroke="${oe}" stroke-width="2"/>`)}const py=()=>ad("back"),my=()=>ad("fwd");function gy(){return pe(24,`<path d="M2.5 6.5h6l2 2h11v12h-19z" fill="${ye}" stroke="${Oe}" stroke-width="1.3"/>
<path d="M12 18v-6.5M9 14l3-3 3 3" stroke="${oe}" stroke-width="1.8"/>`)}function xy(){return pe(24,`<circle cx="10" cy="10" r="6" fill="${ye}" stroke="${Oe}" stroke-width="1.6"/><path d="M14.5 14.5l6 6" stroke="${oe}" stroke-width="2.2"/><path d="M7.5 8.5a3 3 0 0 1 2.5-2" stroke="#fff" stroke-opacity=".35" stroke-width="1.1"/>`)}function vy(){return pe(24,`<path d="M1.5 4.5h5l2 2h7.5v7.5h-14.5z" fill="${ye}" stroke="${Ei}" stroke-width="1.2"/>
<path d="M7.5 10.5h5l2 2h8v8.5h-15z" fill="${ye}" stroke="${Oe}" stroke-width="1.3"/>`)}function _y(){return pe(18,`<rect x="1.5" y="1.5" width="15" height="15" rx="1" stroke="${En}" stroke-opacity=".75" stroke-width="1.2"/><path d="M5 9h7M9 5.5L12.5 9 9 12.5" stroke="${En}" stroke-width="1.6"/>`)}function cc(){return pe(16,`<circle cx="8" cy="8" r="6.6" stroke="${Oe}" stroke-width="1.1"/><path d="M6.3 4.8v6.4l5-3.2z" fill="${oe}" stroke="none"/>`)}function ld(){return pe(16,`<rect x="1" y="2" width="10.5" height="8.5" rx="1.2" fill="${ye}" stroke="${Oe}" stroke-width="1.1"/><circle cx="11" cy="11" r="2.7" fill="${ye}" stroke="${oe}" stroke-width="1.2"/><path d="M13 13l2.3 2.3" stroke="${oe}" stroke-width="1.5"/>`)}function yy(){return pe(16,`<rect x="1" y="3.5" width="14" height="10" rx="2" fill="${ye}" stroke="${Oe}" stroke-width="1.1"/><rect x="2.8" y="5.2" width="8.5" height="6.6" rx="1.4" fill="${oe}" fill-opacity=".3"/><path d="M5 1.2l3 2.3 3-2.3" stroke="${Ei}" stroke-width="1"/><circle cx="13" cy="7" r=".7" fill="${oe}" stroke="none"/><circle cx="13" cy="9.8" r=".7" fill="${oe}" stroke="none"/>`)}function My(){return pe(16,`<rect x="2" y="1.5" width="8" height="10" rx="1" fill="${ye}" stroke="${Ei}" stroke-width="1.1"/><rect x="6" y="4.5" width="8" height="10" rx="1" fill="${ye}" stroke="${Oe}" stroke-width="1.1"/><path d="M8 8h4M8 10h4M8 12h3" stroke="${oe}" stroke-opacity=".7" stroke-width=".9"/>`)}function cd(){return pe(16,`<path d="M8 2.5l5.5 6.5h-11z" stroke="${oe}" stroke-width="1.2"/><path d="M2.5 11.5h11v2h-11z" stroke="${oe}" stroke-width="1.2"/>`)}function Hs(s){const t=s==="xml"?"#ff8a3d":En;return pe(48,`<path d="M11 4h19l8 8v32H11z" fill="${ye}" stroke="${Oe}" stroke-width="1.6"/>
<path d="M30 4v8h8" stroke="${Oe}" stroke-width="1.6"/>
<path d="M16 18h16M16 23h16M16 28h12" stroke="${oe}" stroke-opacity=".45" stroke-width="1.3"/>
<rect x="13" y="34" width="22" height="8" fill="${t}" fill-opacity=".14" stroke="${t}" stroke-opacity=".8" stroke-width="1"/>
<text x="24" y="40.4" font-size="6.6" font-family="'IBM Plex Mono',ui-monospace,monospace" font-weight="500" text-anchor="middle" fill="${t}" stroke="none">${wy(s.toUpperCase())}</text>`)}function hd(){return pe(16,`<circle cx="8" cy="8" r="6.6" fill="${ye}" stroke="${oe}" stroke-width="1.2"/><path d="M8 7.2v4.3" stroke="${oe}" stroke-width="1.6"/><circle cx="8" cy="4.8" r="1" fill="${oe}" stroke="none"/>`)}function ud(){return pe(22,`<path d="M11 4v7" stroke="${lc}" stroke-width="2"/><path d="M7 6.8a6.3 6.3 0 1 0 8 0" stroke="${lc}" stroke-width="1.8"/>`)}function by(){return pe(22,`<path d="M14 4a7.3 7.3 0 1 0 4.8 10.6A6.2 6.2 0 0 1 14 4z" stroke="${oe}" stroke-width="1.7"/>`)}function dd(){return pe(22,`<circle cx="7.5" cy="11" r="3.6" stroke="${oe}" stroke-width="1.7"/><path d="M11.1 11h8M16 11v3M18.6 11v2.3" stroke="${oe}" stroke-width="1.7"/>`)}function Sy(){return pe(18,`<rect x="1.5" y="1.5" width="15" height="15" rx="1" stroke="${Oe}" stroke-width="1.2"/><path d="M7 5l5 4-5 4z" fill="${oe}" stroke="none"/>`)}function fd(){return pe(22,`<path d="M16.5 7.5a6.3 6.3 0 1 0 1 5.5" stroke="${Po}" stroke-width="1.8"/><path d="M17.5 3.5v4.5H13" stroke="${Po}" stroke-width="1.8"/>`)}function Lo(s,t=!1){return`<img src="${hy}" alt="" width="${s}" height="${s}" style="width:${s}px;height:${s}px;${t?"filter:invert(1);":""}">`}function wy(s){return s.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]??t)}function Ti(s="app"){return s==="status"?pe(16,`<rect x="1.5" y="2.5" width="13" height="9" rx="1" fill="${ye}" stroke="${Oe}" stroke-width="1.1"/><path d="M4 5.5h5M4 8h3" stroke="${En}" stroke-width="1.1"/><path d="M5.5 13.5h5" stroke="${Ei}" stroke-width="1.1"/>`):s==="channel"?pe(16,`<path d="M1.5 2.5h11a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1H6l-3 2.8v-2.8H1.5a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" fill="${ye}" stroke="${En}" stroke-opacity=".85" stroke-width="1.1"/><path d="M5 4.5l-1 4M8 4.5l-1 4M3.5 5.8h5.5M3 7.6h5.5" stroke="${En}" stroke-width=".9"/>`):pe(24,`<path d="M2 3h12.5A1.5 1.5 0 0 1 16 4.5v6.5a1.5 1.5 0 0 1-1.5 1.5H8l-4 3.5v-3.5H2A1.5 1.5 0 0 1 .5 11V4.5A1.5 1.5 0 0 1 2 3z" fill="${uy}" stroke="${oe}" stroke-width="1.3"/>
<path d="M10 10h11.5A1.5 1.5 0 0 1 23 11.5v6a1.5 1.5 0 0 1-1.5 1.5H20v3.5L16 19h-6a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 10 10z" fill="${ye}" stroke="${En}" stroke-width="1.3"/>
<path d="M3.5 6.5h8M3.5 9h5" stroke="${oe}" stroke-opacity=".8" stroke-width="1.1"/>
<path d="M12 13.5h8M12 16h5" stroke="${En}" stroke-opacity=".8" stroke-width="1.1"/>`)}let Zi=null,An=null,hc=null;function Ey(s){Zi=s,s.addEventListener("pointerdown",t=>{if(!An)return;const e=t.target;e.closest(".xp-menu")||e.closest("[data-menu-owner]")||Ai()},!0)}function Ty(){return An!==null}function Ai(){if(!An)return!1;let s=An;for(;s;)s.el.remove(),s=s.child;An=null;const t=hc;return hc=null,t==null||t(),!0}function pd(s,t){const e=V("div",{class:"xp-menu",role:"menu"}),n=[];for(const i of s){if(i==="sep"){e.append(V("div",{class:"xp-menu-sep",role:"separator"}));continue}const r=V("button",{type:"button",role:i.checked!==void 0?"menuitemcheckbox":"menuitem",class:`${i.bold?"bold ":""}${i.submenu?"has-sub":""}`.trim(),html:`<i class="ic">${i.icon??""}</i><span class="lb"></span><span class="sc"></span>`});r.querySelector(".lb").textContent=i.label,r.querySelector(".sc").textContent=i.shortcut??"",i.checked!==void 0&&(r.setAttribute("aria-checked",String(i.checked)),i.checked&&r.classList.add("checked")),i.disabled&&(r.setAttribute("aria-disabled","true"),r.tabIndex=-1);const o=()=>{var u;if(!i.submenu||i.disabled)return;const a=uc(e);if(!a||((u=a.child)==null?void 0:u.el.dataset.for)===i.label)return;dc(a);const l=r.getBoundingClientRect(),c=md(pd(i.submenu(),a),l.right-3,l.top-3,l.left+3);c.dataset.for=i.label,a.child={el:c,child:null}};r.addEventListener("pointerenter",()=>{const a=uc(e);i.submenu?o():a&&dc(a)}),r.addEventListener("click",a=>{var l,c,u,h;if(a.stopPropagation(),!i.disabled){if(i.submenu){o(),(u=(c=(l=uc(e))==null?void 0:l.child)==null?void 0:c.el.querySelector("button:not([aria-disabled])"))==null||u.focus();return}Ai(),(h=i.run)==null||h.call(i)}}),e.append(r),n.push(r)}return e.addEventListener("keydown",i=>{var a,l,c;const r=n.filter(u=>u.getAttribute("aria-disabled")!=="true"),o=r.indexOf(document.activeElement);if(i.key==="ArrowDown"||i.key==="ArrowUp"){i.preventDefault(),i.stopPropagation();const u=r[(o+(i.key==="ArrowDown"?1:-1)+r.length)%r.length];u==null||u.focus()}else i.key==="ArrowRight"&&((a=r[o])!=null&&a.classList.contains("has-sub"))?(i.preventDefault(),i.stopPropagation(),(l=r[o])==null||l.click()):i.key==="ArrowLeft"&&t&&(i.preventDefault(),i.stopPropagation(),dc(t),(c=t.el.querySelector("button.has-sub"))==null||c.focus())}),e}function uc(s){let t=An;for(;t;){if(t.el===s)return t;t=t.child}return null}function dc(s){let t=s.child;for(;t;)t.el.remove(),t=t.child;s.child=null}function md(s,t,e,n=t){if(!Zi)throw new Error("menu host not set");s.style.left="0px",s.style.top="0px",Zi.append(s);const i=Zi.getBoundingClientRect(),r=s.offsetWidth,o=s.offsetHeight;let a=t-i.left,l=e-i.top;return a+r>i.width-2&&(a=Math.max(2,n-i.left-r)),l+o>i.height-32&&(l=Math.max(2,i.height-32-o)),s.style.left=`${Math.round(a)}px`,s.style.top=`${Math.round(l)}px`,s}function Gs(s,t,e,n,i=!1){var o;Ai();const r=pd(s,null);An={el:r,child:null},md(r,t,e),hc=n??null,i&&((o=r.querySelector("button:not([aria-disabled])"))==null||o.focus())}function gd(s,t,e){const n=t.getBoundingClientRect();if(Gs(s,n.right-2,n.top-3,e),An){const i=Zi==null?void 0:Zi.getBoundingClientRect();i&&n.right+An.el.offsetWidth>i.right&&(An.el.style.left=`${Math.max(2,n.left-i.left-An.el.offsetWidth+2)}px`)}}function Ay(s,t){s.addEventListener("contextmenu",e=>{const n=e.target;if(n.closest("input, textarea, [contenteditable], .oikos-tube"))return;const i=t(n,e);if(i!==null){if(e.preventDefault(),!i.length){Ai();return}Gs(i,e.clientX,e.clientY)}})}function V(s,t={},e=[]){const n=document.createElement(s);for(const[i,r]of Object.entries(t))i==="html"?n.innerHTML=r:n.setAttribute(i,r);for(const i of e)n.append(i);return n}function fc(s){const t=V("div",{class:"xp-menubar",role:"menubar"});let e=null;const n=(i,r,o)=>{var c;const a=(c=s[r])==null?void 0:c.call(s);if(!a)return;const l=i.getBoundingClientRect();Gs(a,l.left,l.bottom,()=>{i.classList.remove("open"),e===i&&(e=null)},o),i.classList.add("open"),e=i};for(const i of Object.keys(s)){const r=V("button",{type:"button",class:"xp-menutitle",role:"menuitem","aria-haspopup":"menu","data-menu-owner":""},[i]);r.addEventListener("click",()=>{e===r?Ai():n(r,i,!1)}),r.addEventListener("pointerenter",()=>{e&&e!==r&&Ty()&&n(r,i,!1)}),r.addEventListener("keydown",o=>{(o.key==="ArrowDown"||o.key==="Enter"||o.key===" ")&&(o.preventDefault(),n(r,i,!0))}),t.append(r)}return t.append(V("span",{class:"xp-throbber",html:Lo(18,!0)})),t}function xd(s){const t=V("div",{class:"xp-toolbar"}),e=(o,a,l,c=!0)=>{const u=V("button",{class:"xp-tb",type:"button",title:a,html:`${o}${c?`<span>${a}</span>`:""}`});return l?u.addEventListener("click",l):u.disabled=!0,t.append(u),u},n=e(py(),"Back",s.back),i=e(my(),"Forward",s.forward,!1);e(gy(),"Up",s.up,!1),t.append(V("span",{class:"xp-tb-sep"})),e(xy(),"Search",s.search),e(vy(),"Folders",s.folders);const r=()=>{if(!s.can)return;const o=s.can();n.disabled=!s.back||!o.back,i.disabled=!s.forward||!o.forward};return r(),{el:t,refresh:r}}function vd(s,t,e,n){const i=V("div",{class:"xp-address"});i.append(V("span",{class:"lbl"},["Address"]));const r=V("label",{class:"field",html:s});let o=null;e?(o=V("input",{type:"text",value:t,"aria-label":"Address",spellcheck:"false"}),o.style.cssText="flex:1;min-width:0;border:0;outline:0;font:inherit;background:transparent;",r.append(o),o.addEventListener("keydown",l=>{l.key==="Enter"&&o&&(n==null||n(o.value)),l.stopPropagation()})):r.append(V("span",{},[t])),i.append(r);const a=V("button",{class:"go",type:"button",html:`${_y()}<span>Go</span>`});return a.addEventListener("click",()=>n==null?void 0:n((o==null?void 0:o.value)??t)),i.append(a),{el:i,input:o}}function Vs(s,t,e=!1){const n=V("section",{class:`xp-taskgroup${e?" primary":""}`}),i=V("header",{role:"button",tabindex:"0","aria-expanded":"true"},[s]),r=()=>{n.classList.toggle("collapsed"),i.setAttribute("aria-expanded",String(!n.classList.contains("collapsed")))};i.addEventListener("click",r),i.addEventListener("keydown",a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),r())}),n.append(i);const o=V("div",{class:"xp-taskbody"});if(t instanceof HTMLElement)o.append(t);else{const a=V("ul");for(const l of t){const c=V("li");let u;if(l.href)u=V("a",{class:"xp-link",href:l.href,html:`${l.icon}<span></span>`}),l.external&&(u.setAttribute("target","_blank"),u.setAttribute("rel","noopener"));else{u=V("button",{class:"xp-link",type:"button",html:`${l.icon}<span></span>`});const d=l.run;d?u.addEventListener("click",d):u.setAttribute("aria-disabled","true")}const h=u.querySelector("span");h&&(h.textContent=l.label),c.append(u),a.append(c)}o.append(a)}return n.append(o),n}function _d(){const s=V("div",{class:"xp-statusbar",role:"status"}),t=V("span"),e=V("span",{class:"zone"});return s.append(t,e),{el:s,set(n,i){t.textContent=n;const[r,o]=i==="computer"?[sd(),"My Computer"]:[rd(),"Internet"];e.innerHTML=`${r}<span>${o}</span>`}}}const Cy={dreams:["chronicle","dreams-api","dream_gen"],chronicle:["dreams","dream_gen"],"dreams-api":["dreams","chronicle"],dream_gen:["dreams","chronicle"],transmissions:["irc","syrinx"],apeiron:["dreams","syrinx"],syrinx:["apeiron","afterlife"],afterlife:["syrinx","apeiron"],irc:["transmissions","parlor"],parlor:["irc","transmissions"]};function yd(s){return/^https?:/.test(s.href)?s.href:`${location.origin}${s.href}`}function Md(s){return s.group==="here"?"computer":"internet"}function pc(s,t){var i;const e=yd(t),n=(i=navigator.clipboard)==null?void 0:i.writeText(e);if(!n){s.balloon("Could not copy",e);return}n.then(()=>s.balloon("Copied",e),()=>s.balloon("Could not copy",e))}function Do(s,t,e=!1){const n=[];return e?n.push({label:`Open ${t.title}`,bold:!0,run:()=>s.open(t)}):(n.push({label:"Play",bold:!0,run:()=>s.play(t.id)}),n.push({label:`Go to ${t.title}`,run:()=>s.open(t)})),n.push({label:"Look at its screen",run:()=>s.look(t.id),disabled:!s.canTune}),t.tune&&n.push({label:"Watch it here",run:()=>s.tuneIn(t.id),disabled:!s.canTune}),t.id==="irc"&&n.push({label:"Join in mIRC",run:()=>s.chat("#aethera")}),n.push("sep",{label:"Copy Address",run:()=>pc(s,t)}),e||n.push("sep",{label:"Properties",run:()=>s.play(t.id)}),n}function bd(s,t){return[{label:"Undo",shortcut:"Ctrl+Z",disabled:!0},"sep",{label:"Cut",shortcut:"Ctrl+X",disabled:!0},{label:"Copy",shortcut:"Ctrl+C",disabled:!t,run:()=>t&&pc(s,t)},{label:"Paste",shortcut:"Ctrl+V",disabled:!0},"sep",{label:"Select All",shortcut:"Ctrl+A",disabled:!0},{label:"Invert Selection",disabled:!0}]}function Sd(s){return[{label:"Add to Favorites...",disabled:!0},{label:"Organize Favorites...",disabled:!0},"sep",...s.dir.sites.filter(t=>t.group==="here").map(t=>({label:t.title,icon:Tn(t.accent),run:()=>s.play(t.id)}))]}function wd(){return[{label:"Map Network Drive...",disabled:!0},{label:"Disconnect Network Drive...",disabled:!0},{label:"Synchronize...",disabled:!0},"sep",{label:"Folder Options...",disabled:!0}]}function Ed(s){return[{label:"Help and Support Center",disabled:!0},"sep",{label:"About æthera",run:()=>s.about()}]}function mc(s){s.hidden=!s.hidden}function Td(s,t){return[{label:"Toolbars",submenu:()=>[{label:"Standard Buttons",checked:!t.toolbar.hidden,run:()=>mc(t.toolbar)},{label:"Address Bar",checked:!t.address.hidden,run:()=>mc(t.address)}]},{label:"Status Bar",checked:!t.status.hidden,run:()=>mc(t.status)},...t.views?["sep",...t.views]:[],"sep",{label:"Go To",submenu:()=>[{label:"Back",shortcut:"Alt+Left",disabled:!s.canBack,run:()=>s.back()},{label:"Forward",shortcut:"Alt+Right",disabled:!s.canForward,run:()=>s.forward()},{label:"Up One Level",disabled:!t.up,run:()=>{var e;return(e=t.up)==null?void 0:e.call(t)}},"sep",{label:"Home Page",shortcut:"Alt+Home",run:()=>s.home()}]},{label:"Refresh",shortcut:"F5",run:()=>t.refresh()}]}class Ry{constructor(t,e){R(this,"win",null);R(this,"selected",null);R(this,"tiles",new Map);R(this,"tasks",null);R(this,"status",null);R(this,"content",null);R(this,"view","tiles");this.shell=t,this.wm=e}get isOpen(){return!!this.win&&!this.win.closed}open(){var u;if(this.isOpen&&this.win){this.win.minimized?this.win.restore():this.win.focus();return}this.tiles.clear();const t=V("div");t.style.cssText="display:flex;flex-direction:column;min-height:0;flex:1;";const{dir:e}=this.shell,n=xd({back:()=>this.shell.back(),forward:()=>this.shell.forward(),can:()=>({back:this.shell.canBack,forward:this.shell.canForward}),search:()=>{var h;return(h=i.input)==null?void 0:h.focus()},folders:()=>{var h;return(h=this.tasks)==null?void 0:h.toggleAttribute("hidden")}}),i=vd(yr(),"~/æthera",!0,h=>this.go(h));(u=i.input)==null||u.addEventListener("input",()=>{var h;return this.filter(((h=i.input)==null?void 0:h.value)??"")}),this.status=_d();const r=()=>this.selected?this.shell.site(this.selected)??null:null;t.append(fc({File:()=>this.fileMenu(),Edit:()=>bd(this.shell,r()),View:()=>{var h;return Td(this.shell,{toolbar:n.el,address:i.el,status:((h=this.status)==null?void 0:h.el)??V("div"),views:this.viewItems(),refresh:()=>{i.input&&(i.input.value="~/æthera"),this.filter("")}})},Favorites:()=>Sd(this.shell),Tools:()=>wd(),Help:()=>Ed(this.shell)}),n.el,i.el);const o=this.shell.onNav(()=>n.refresh()),a=V("div",{class:"xp-body"});this.tasks=V("aside",{class:"xp-tasks"}),a.append(this.tasks);const l=V("div",{class:`xp-content view-${this.view}`,role:"listbox","aria-label":"tapes"});this.content=l,l.addEventListener("pointerdown",h=>{h.button===0&&!h.target.closest(".xp-tile")&&this.select(null)});const c=(h,d)=>{if(!d.length)return;l.append(V("h3",{class:"xp-group-head"},[h]));const f=V("div",{class:"xp-tiles"});for(const p of d)f.append(this.tile(p));l.append(f)};if(c("Tapes Stored on This Server",e.sites.filter(h=>h.group==="here")),c("Other Places on the Wired",e.sites.filter(h=>h.group==="wired")),e.files.length){l.append(V("h3",{class:"xp-group-head"},["Files"]));const h=V("div",{class:"xp-tiles"});for(const d of e.files){const f=d.title.split(".").pop()??"txt",p=V("a",{class:"xp-tile",href:d.href,html:`${Hs(f)}<span><span class="t"></span><span class="k"></span></span>`});p.querySelector(".t").textContent=d.title,p.querySelector(".k").textContent=d.about,h.append(p)}l.append(h)}a.append(l),t.append(a),t.append(this.status.el),this.win=this.wm.open({id:"home",title:"~  (home directory)",icon:yr(),body:t,width:Math.round(Math.min(680,Math.max(420,innerWidth*.46))),dock:"left",onClose:()=>{o(),this.win=null,this.content=null,this.selected=null}}),this.win.el.style.height="min(560px, calc(100% - 40px))",this.renderTasks(),this.renderStatus()}close(){var t;(t=this.win)==null||t.close()}fileMenu(){const t=this.selected?this.shell.site(this.selected):void 0;return[...t?Do(this.shell,t):[{label:"Play",bold:!0,disabled:!0}],"sep",{label:"New",disabled:!0,submenu:()=>[]},"sep",{label:"Create Shortcut",disabled:!0},{label:"Delete",disabled:!0},{label:"Rename",disabled:!0},"sep",{label:"Close",run:()=>this.close()}]}viewItems(){const t=e=>()=>{this.view=e,this.content&&(this.content.className=`xp-content view-${e}`)};return[{label:"Tiles",checked:this.view==="tiles",run:t("tiles")},{label:"Icons",checked:this.view==="icons",run:t("icons")},{label:"List",checked:this.view==="list",run:t("list")}]}contextFor(t){const e=this.shell.site(t);return e?(this.select(t,!0),Do(this.shell,e)):null}blankMenu(){return[{label:"View",submenu:()=>this.viewItems()},{label:"Arrange Icons By",disabled:!0,submenu:()=>[]},"sep",{label:"Refresh",run:()=>this.filter("")},"sep",{label:"Paste",disabled:!0},{label:"Paste Shortcut",disabled:!0},"sep",{label:"New",disabled:!0,submenu:()=>[]},"sep",{label:"Properties",disabled:!0}]}tile(t){const e=V("button",{class:"xp-tile",type:"button",role:"option","data-id":t.id,html:`${Tn(t.accent,t.title)}<span><span class="t"></span><span class="k"></span><span class="d"></span></span>`});return e.querySelector(".t").textContent=t.title,e.querySelector(".k").textContent=t.kind,e.querySelector(".d").textContent=t.tagline,e.title=t.tagline,e.addEventListener("click",()=>this.select(t.id,!0)),e.addEventListener("dblclick",()=>this.shell.play(t.id)),e.addEventListener("keydown",n=>{if(n.key==="Enter"&&this.shell.play(t.id),["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(n.key)){n.preventDefault(),n.stopPropagation();const i=[...this.tiles.values()].filter(a=>!a.hidden),r=i.indexOf(e),o=i[(r+(n.key==="ArrowRight"||n.key==="ArrowDown"?1:-1)+i.length)%i.length];o==null||o.focus(),o!=null&&o.dataset.id&&this.select(o.dataset.id,!0)}}),e.addEventListener("pointerup",n=>{n.pointerType==="touch"&&this.selected===t.id&&e.dataset.armed&&this.shell.play(t.id),e.dataset.armed="1"}),this.tiles.set(t.id,e),e}select(t,e=!1){if(t!==this.selected){this.selected=t;for(const[n,i]of this.tiles)i.classList.toggle("selected",n===t),i.setAttribute("aria-selected",String(n===t)),n!==t&&delete i.dataset.armed;e&&this.shell.select(t),this.renderTasks(),this.renderStatus()}}filter(t){const e=t.replace(/^~\/?(æthera)?\/?/i,"").trim().toLowerCase();for(const[n,i]of this.tiles){const r=this.shell.site(n);i.hidden=!!e&&!`${r==null?void 0:r.title} ${r==null?void 0:r.kind} ${r==null?void 0:r.tagline}`.toLowerCase().includes(e)}}go(t){const e=t.replace(/^~\/?(æthera)?\/?/i,"").trim().toLowerCase();if(!e)return;const n=this.shell.dir.sites.find(i=>i.title.toLowerCase()===e)??this.shell.dir.sites.find(i=>`${i.title} ${i.kind} ${i.tagline}`.toLowerCase().includes(e));n?this.shell.play(n.id):this.shell.balloon("Cannot find it",`There is no tape called “${t}” in ~.`)}renderTasks(){if(!this.tasks)return;const t=this.selected?this.shell.site(this.selected):void 0,e=t?[{icon:cc(),label:"Play this tape",run:()=>this.shell.play(t.id)},{icon:ld(),label:"Look at its screen",run:()=>this.shell.look(t.id)},{icon:rd(),label:`Go to ${t.title}`,run:()=>this.shell.open(t)}]:[{icon:cc(),label:"Select a tape to play it"},{icon:cd(),label:"Eject the tape",run:()=>this.shell.eject()}],n=[{icon:sd(),label:"æthera",href:"/"},{icon:Hs("xml"),label:"feed.xml",href:"/feed.xml"},{icon:Hs("txt"),label:"llms.txt",href:"/llms.txt"}],i=V("div",{class:"xp-details"});if(t){i.append(V("b",{},[t.title]));const r=V("dl");for(const[o,a]of t.details)r.append(V("dt",{},[o]),V("dd",{},[a]));i.append(r)}else{const r=this.shell.dir.sites.filter(o=>o.group==="here").length;i.append(V("b",{},["~"]),V("span",{},[`home directory · ${r} tapes here, ${this.shell.dir.sites.length-r} elsewhere on the Wired`]))}this.tasks.replaceChildren(Vs(t?"Tape Tasks":"System Tasks",e,!0),Vs("Other Places",n),Vs("Details",i))}renderStatus(){var n;const t=this.selected?this.shell.site(this.selected):void 0,e=this.shell.dir.sites.length+this.shell.dir.files.length;(n=this.status)==null||n.set(t?`${t.title} — ${t.tagline}`:`${e} objects`,t?Md(t):"computer")}}const Py=4001,Ly=4002,Dy=s=>s>=4e3&&s<5e3,Iy=4;class Ny{constructor(t,e,n){R(this,"ws",null);R(this,"tries",0);R(this,"timer",0);R(this,"wanted",!1);R(this,"welcomed",!1);R(this,"refused",!1);this.nick=t,this.password=e,this.on=n}get open(){var t;return this.welcomed&&((t=this.ws)==null?void 0:t.readyState)===WebSocket.OPEN}connect(){this.wanted=!0,this.refused=!1,clearTimeout(this.timer);const t=location.protocol==="https:"?"wss":"ws";let e;try{e=new WebSocket(`${t}://${location.host}/ws/chat`)}catch{this.on.closed(!1,!1,!1);return}this.ws=e,this.welcomed=!1,e.onopen=()=>{e.send(JSON.stringify({type:"hello",nick:this.nick,password:this.password||null}))},e.onmessage=n=>{let i;try{i=JSON.parse(String(n.data))}catch{return}switch(i.type){case"welcome":{const r=i;this.welcomed=!0,this.tries=0,this.nick=r.nick,this.on.welcome(r);break}case"event":{const r=i.event;if(!r)break;r.kind==="nick"&&r.nick===this.nick&&r.target&&(this.nick=r.target),this.on.event(r);break}case"whois":this.on.whois(i);break;case"error":{this.welcomed||(this.refused=!0),this.on.error(String(i.code??""),String(i.text??""));break}}},e.onclose=n=>{if(this.ws!==e)return;this.ws=null;const i=n.code===Py,r=n.code===Ly,o=this.wanted&&!Dy(n.code)&&!this.refused&&this.tries<Iy;if(this.welcomed=!1,this.on.closed(o,i,r),!o){this.wanted=!1;return}this.tries++,this.timer=window.setTimeout(()=>this.connect(),2e3*2**(this.tries-1))}}send(t){if(!this.open||!this.ws)return!1;try{return this.ws.send(JSON.stringify(t)),!0}catch{return!1}}part(t="Leaving"){if(this.open&&this.ws)try{this.ws.send(JSON.stringify({type:"part",reason:t}))}catch{}this.close()}close(){this.wanted=!1,clearTimeout(this.timer);const t=this.ws;if(this.ws=null,this.welcomed=!1,this.password=null,t){t.onclose=null;try{t.close()}catch{}}}}const kt="#aethera",Pt="#oikos",kn="irc.aetherawi.red",gc=6667,xc="guest",Ad="always falling apart",Uy=600,Fy=6e3,Cd="oikos-mirc-nick",Oy=/^[A-Za-z[\]\\`_^{|}][A-Za-z0-9[\]\\`_^{|}-]{0,15}$/,vc=["~","&","@","%","+"];function ky(s){const t=new Date(s);return`[${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}]`}function By(s){return Date.now()-(performance.now()-s)}function _c(s){const t=si(s)||"anon",e=Yo(t),n=["dialup.wired.net","cable.aether.org","dsl.lain.jp","adsl.nowhere.nu","res.navi.co"],i=n[Math.floor(e*n.length)]??n[0],r=Math.floor(e*251)+2,o=Math.floor(Yo(`${t}.`)*251)+2;return`~${t.slice(0,9).toLowerCase()}@ppp-${r}-${o}.${i}`}function si(s){return s.replace(/^[~&@%+]+/,"")}function Rd(s){const t=s.charAt(0);return vc.includes(t)?t:""}function zy(){try{return localStorage.getItem(Cd)??""}catch{return""}}function Pd(s){try{localStorage.setItem(Cd,s)}catch{}}function yc(s){s.addEventListener("keydown",t=>{t.key!=="Escape"&&t.stopPropagation()})}class Mc{constructor(t,e,n){R(this,"tab");R(this,"pane");R(this,"log");R(this,"nicksEl");R(this,"nicks",new Map);R(this,"topic","");R(this,"joined",!1);this.id=t;const i=`mirc-pane-${t==="status"?"status":t.slice(1)}`;this.tab=V("button",{type:"button",role:"tab","aria-controls":i,html:`${e}<span></span>`}),this.tab.querySelector("span").textContent=t==="status"?"Status":t,this.log=V("div",{class:"mirc-log",role:"log","aria-label":t==="status"?"Status":t}),n?(this.log.setAttribute("aria-live","polite"),this.nicksEl=V("ul",{class:"mirc-nicks","aria-label":`Nicknames in ${t}`}),this.pane=V("div",{class:"mirc-pane",id:i,role:"tabpanel"},[V("div",{class:"mirc-split"},[this.log,this.nicksEl])])):(this.nicksEl=null,this.pane=V("div",{class:"mirc-pane",id:i,role:"tabpanel"},[this.log]))}setNick(t,e=Rd(t)){const n=si(t);n&&this.nicks.set(n.toLowerCase(),{name:n,mode:e})}seen(t){const e=si(t);if(!e)return!1;const n=e.toLowerCase(),i=this.nicks.get(n),r=Rd(t)||(i==null?void 0:i.mode)||"";return i&&i.mode===r&&i.name===e?!1:(this.nicks.set(n,{name:e,mode:r}),!0)}drop(t){return this.nicks.delete(si(t).toLowerCase())}rename(t,e){const n=this.nicks.get(si(t).toLowerCase());this.drop(t),this.setNick(e,(n==null?void 0:n.mode)??"")}render(){if(!this.nicksEl)return;const t=n=>n?vc.indexOf(n):vc.length,e=[...this.nicks.values()].sort((n,i)=>t(n.mode)-t(i.mode)||n.name.localeCompare(i.name,void 0,{sensitivity:"base"}));this.nicksEl.replaceChildren(...e.map(n=>V("li",{title:`${n.mode}${n.name}`},[`${n.mode}${n.name}`])))}}class Hy{constructor(t,e,n){R(this,"win");R(this,"wins");R(this,"view",kt);R(this,"input");R(this,"me",xc);R(this,"link",null);R(this,"hintedOikos",!1);R(this,"livingSeenAt",0);R(this,"livingOnce",!1);R(this,"greeted",!1);R(this,"hung",!1);R(this,"lastAt",-1);R(this,"seenFragments");R(this,"seenCollapse",null);R(this,"wasConnected",!1);R(this,"rejoinTimer",0);R(this,"off");var c;this.shell=t,this.wm=e;const i=V("div",{class:"mirc"});i.append(fc({File:()=>[{label:"Connect...",run:()=>this.joinLiving(),disabled:!!this.link},{label:"Disconnect",run:()=>this.partLiving(),disabled:!this.link},"sep",{label:"Select Server...",disabled:!0},"sep",{label:"Exit",run:()=>this.win.close()}],Tools:()=>[{label:"Address Book...",disabled:!0},{label:"Options...",shortcut:"Alt+O",disabled:!0}],Commands:()=>[{label:`Join ${Pt}`,run:()=>this.joinLiving()},{label:`Part ${Pt}`,run:()=>this.partLiving(),disabled:!this.link},"sep",{label:"Clear buffer",run:()=>this.wins[this.view].log.replaceChildren()}],Window:()=>["status",kt,Pt].filter(u=>!this.wins[u].tab.hidden).map(u=>({label:u==="status"?"Status":u,checked:this.view===u,run:()=>this.show(u)})),Help:()=>[{label:"Commands",shortcut:"F1",run:()=>this.help()},"sep",{label:"About æthera",run:()=>this.shell.about()}]}));const r=V("div",{class:"mirc-switch",role:"tablist"});this.wins={status:new Mc("status",Ti("status"),!1),[kt]:new Mc(kt,Ti("channel"),!0),[Pt]:new Mc(Pt,Ti("channel"),!0)},this.wins[kt].topic=Ad,this.wins[Pt].tab.hidden=!0;const o=V("div",{class:"mirc-mdi"});for(const u of Object.values(this.wins))u.tab.addEventListener("click",()=>this.show(u.id)),r.append(u.tab),o.append(u.pane);this.input=V("input",{class:"mirc-input",type:"text",spellcheck:"false",autocomplete:"off",maxlength:"400","aria-label":"Message"}),yc(this.input),this.input.addEventListener("keydown",u=>{if(u.key!=="Enter")return;u.preventDefault();const h=this.input.value;this.input.value="",this.say(h)}),i.append(r,o,this.input),this.win=e.open({id:"mirc",title:"mIRC",icon:Ti("app"),body:i,width:Math.round(Math.min(760,Math.max(460,innerWidth*.52))),dock:"center",onClose:()=>{var u,h;clearTimeout(this.rejoinTimer),this.off(),(u=this.link)==null||u.part("Leaving"),this.link=null,(h=this.wm.get("mirc-connect"))==null||h.close(),n()},onFocus:()=>{innerWidth>720&&this.input.focus({preventScroll:!0})}}),this.win.el.classList.add("mirc-window"),this.win.el.style.height="min(540px, calc(100% - 24px))";const a=this.win.el.parentElement;if(a){const u=this.win.el.offsetTop+this.win.el.offsetHeight-(a.clientHeight-8);u>0&&this.win.moveTo(this.win.el.offsetLeft,this.win.el.offsetTop-u)}const l=this.shell.feeds.irc.value;this.seenFragments=l.fragments,this.seenCollapse=((c=l.collapse)==null?void 0:c.at)??null,this.show(kt),l.connected?this.connect(l):this.push("status","info",`* Connecting to ${kn} (${gc})`),this.off=this.shell.feeds.irc.on(u=>this.update(u))}focus(t){this.win.minimized?this.win.restore():this.win.focus();const e=t===kt||t===Pt||t==="status"?this.wins[t]:null;e&&!e.tab.hidden&&this.show(e.id)}update(t){var n;if(t.connected&&!this.wasConnected?this.connect(t):!t.connected&&this.wasConnected&&this.disconnect(),!t.connected)return;for(const i of t.lines)i.at<=this.lastAt||(this.rejoinTimer&&this.rejoin(),this.lastAt=i.at,this.line(i));const e=((n=t.collapse)==null?void 0:n.at)??null;e!==null&&e!==this.seenCollapse&&t.collapse&&this.collapse(t.collapse.type),this.seenCollapse=e,t.fragments!==this.seenFragments&&(this.seenFragments=t.fragments,clearTimeout(this.rejoinTimer),this.hung?this.rejoinTimer=window.setTimeout(()=>this.rejoin(),Fy):this.rejoin())}connect(t){this.wasConnected=!0;const e=(i,r)=>this.push("status",i,r);if(this.greeted){e("info",`* Reconnected to ${kn}`),this.joinHaunted(),t.collapse&&this.collapse(t.collapse.type);return}this.greeted=!0,e("info",`* Connecting to ${kn} (${gc})`),e("notice",`-${kn}- *** Looking up your hostname...`),e("notice",`-${kn}- *** Found your hostname`),e("text",`Welcome to the æthera IRC Network ${this.me}!${this.me}@oikos`),e("text",`Your host is ${kn}, running version hauntd-2.8.21`),e("text",`- ${kn} Message of the Day -`),e("text","- nobody here is who they were."),e("text","- every line is a replay; every replay is live."),e("text",`- ${kt} is moderated: the living listen.`),e("text",`- the living talk in ${Pt}. /join ${Pt}`),e("text","End of /MOTD command."),e("mode",`* ${this.me} sets mode: +i`),this.joinHaunted();const n=t.lines.filter(i=>i.at>this.lastAt);if(n.length){this.push(kt,"info","*** Buffer Playback...");for(const i of n)this.line(i);this.push(kt,"info","*** Playback Complete.")}this.lastAt=Math.max(this.lastAt,...t.lines.map(i=>i.at)),t.collapse&&this.collapse(t.collapse.type)}joinHaunted(){const t=this.wins[kt];t.joined=!0,t.nicks.clear(),t.setNick(this.me,""),this.push(kt,"join",`* Now talking in ${kt}`),this.push(kt,"topic",`* Topic is '${t.topic}'`),this.push(kt,"topic","* Set by ChanServ"),this.nicksChanged(kt)}disconnect(){clearTimeout(this.rejoinTimer),this.rejoinTimer=0,this.wasConnected=!1;const t=this.wins[kt];t.joined=!1,this.setHung(!1),this.push("status","info",`* Disconnected from ${kt}`),this.push(kt,"info","* Disconnected"),t.nicks.clear(),this.nicksChanged(kt)}collapse(t){const e=t.replace(/_/g," ");this.push("status","notice",`-${kn}- *** Notice -- ${e} on ${kt}`),this.setHung(!0)}rejoin(){clearTimeout(this.rejoinTimer),this.rejoinTimer=0,this.setHung(!1),this.push(kt,"info",`* Attempting to rejoin channel ${kt}`),this.wins[kt].topic=Ad,this.joinHaunted()}line(t){const e=this.wins[kt],n=t.nick,i=si(n),r=t.content,o=t.wallAt??By(t.at),a=(c,u)=>this.push(kt,c,u,o);let l=!1;switch(t.type){case"message":l=e.seen(n),a("text",`<${n}> ${r}`);break;case"action":{const c=/^sets mode: ([+-])([a-z]+) (.+)$/i.exec(r);c?(e.seen(n),this.applyMode(c[1]??"+",c[2]??"",(c[3]??"").split(/\s+/)),l=!0,a("mode",`* ${n} ${r}`)):/^has quit\b/i.test(r)?(l=e.drop(n),a("quit",`* ${i} ${r.replace(/^has quit\b/i,"has quit IRC")}`)):(l=e.seen(n),a("action",`* ${n} ${r}`));break}case"join":l=e.seen(n),a("join",`* ${i} (${_c(n)}) has joined ${kt}`);break;case"part":l=e.drop(n),a("part",`* ${i} (${_c(n)}) has left ${kt}${r?` (${r})`:""}`);break;case"quit":l=e.drop(n),a("quit",`* ${i} (${_c(n)}) Quit (${r||"Client exited"})`);break;case"kick":{const c=t.reason||r;t.target?(l=e.drop(t.target),a("kick",`* ${si(t.target)} was kicked by ${i}${c?` (${c})`:""}`)):a("kick",`* ${i} kicks${c?` (${c})`:""}`);break}default:{const c=/changes topic to '(.*)'$/i.exec(r);if(c){e.topic=c[1]??e.topic,a("topic",`* ${r}`),this.retitle();break}const u=r||n;a("info",/^[*<]/.test(u)||u.length<6?u:`* ${u}`)}}!e.nicks.has(this.me.toLowerCase())&&e.joined&&(e.setNick(this.me,""),l=!0),l&&this.nicksChanged(kt)}applyMode(t,e,n){const i=this.wins[kt],r={q:"~",a:"&",o:"@",h:"%",v:"+"};[...e].forEach((o,a)=>{const l=n[a],c=r[o];if(!l||!c)return;const u=i.nicks.get(si(l).toLowerCase());i.setNick((u==null?void 0:u.name)??si(l),t==="+"?c:(u==null?void 0:u.mode)===c?"":(u==null?void 0:u.mode)??"")})}joinLiving(){if(this.link&&this.wins[Pt].joined){this.show(Pt);return}if(this.link){this.push(this.view,"info",`* Still connecting to ${Pt}...`);return}this.connectDialog()}partLiving(){if(!this.link)return;this.link.part("Leaving"),this.link=null;const t=this.wins[Pt];t.joined=!1,t.nicks.clear(),this.nicksChanged(Pt),this.push(Pt,"part",`* You have left ${Pt}`),this.push("status","info",`* Disconnected from ${Pt}`),this.livingSeenAt=0,this.livingOnce=!1,this.renameMe(xc)}connectDialog(t){var u;(u=this.wm.get("mirc-connect"))==null||u.close();const e=V("form",{class:"mirc-connect"}),n=V("input",{type:"text",value:zy(),maxlength:"16",spellcheck:"false",autocomplete:"nickname",required:""}),i=V("input",{type:"password",maxlength:"256",autocomplete:"current-password"});yc(n),yc(i);const r=V("p",{class:"err",role:"alert"});r.textContent=t??"",r.hidden=!t,e.append(V("div",{class:"xp-dialog-body"},[V("span",{html:Ti("app")}),V("div",{},[V("p",{},[`Join ${Pt}, where the living talk.`]),V("label",{},["Nickname:",n]),V("label",{},["Password (optional):",i]),V("p",{class:"hint"},["A password gives you a tripcode, the same one your blog comments carry. It is never stored."]),r])]));const o=V("div",{class:"xp-actions"}),a=V("button",{class:"xp-btn default",type:"submit"},["Connect"]),l=V("button",{class:"xp-btn",type:"button"},["Cancel"]);o.append(a,l),e.append(o);const c=this.wm.open({id:"mirc-connect",title:"mIRC Connect",icon:Ti("app"),body:e,width:360,dialog:!0});l.addEventListener("click",()=>c.close()),e.addEventListener("keydown",h=>{h.key==="Escape"&&(h.preventDefault(),c.close(),this.input.focus({preventScroll:!0}))}),e.addEventListener("submit",h=>{h.preventDefault();const d=n.value.trim();if(!Oy.test(d)){r.textContent="A nickname starts with a letter and has at most 16 letters, digits or - _ [ ] { } | ^ `",r.hidden=!1,n.focus();return}Pd(d),c.close(),this.dial(d,i.value||null)}),n.focus(),n.select()}dial(t,e){this.push("status","info",`* Connecting to ${Pt} as ${t}${e?" (with a tripcode)":""}`);const n=new Ny(t,e,{welcome:i=>this.welcomed(i),event:i=>this.event(i),whois:i=>this.whoisReply(i),error:(i,r)=>this.chatError(i,r),closed:(i,r,o)=>this.dropped(i,r,o)});this.link=n,n.connect()}welcomed(t){const e=this.wins[Pt];e.tab.hidden=!1,e.joined=!0,e.topic=t.topic,e.nicks.clear();for(const r of t.names)e.setNick(r.nick,r.op?"@":"");this.renameMe(t.nick);const n=this.livingOnce;this.livingOnce=!0;const i=t.backlog.filter(r=>r.at>this.livingSeenAt);if(n?this.push(Pt,"join",`* Rejoined ${Pt}`):(this.push("status","text",`* You are now known as ${t.nick} (${t.mask})`),t.op&&this.push("status","mode",`* ${kn} sets mode: +o ${t.nick}`),this.push(Pt,"join",`* Now talking in ${Pt}`),this.push(Pt,"topic",`* Topic is '${t.topic}'`)),i.length){this.push(Pt,"info","*** Buffer Playback...");for(const r of i)this.event(r,!0);this.push(Pt,"info","*** Playback Complete.")}this.nicksChanged(Pt),n||this.show(Pt)}event(t,e=!1){const n=this.wins[Pt],i=(o,a)=>this.push(Pt,o,a,t.at),r=t.nick===this.me;switch(this.livingSeenAt=Math.max(this.livingSeenAt,t.at),t.kind){case"message":i(r?"own":"text",`<${t.nick}> ${t.text}`);return;case"action":i("action",`* ${t.nick} ${t.text}`);return;case"join":i("join",`* ${t.nick} (${t.mask??""}) has joined ${Pt}`),e||n.setNick(t.nick,"");break;case"part":i("part",`* ${t.nick} (${t.mask??""}) has left ${Pt}${t.text?` (${t.text})`:""}`),e||n.drop(t.nick);break;case"quit":i("quit",`* ${t.nick} (${t.mask??""}) Quit (${t.text||"Client exited"})`),e||n.drop(t.nick);break;case"kick":t.target===this.me&&!e?(i("kick",`* You were kicked from ${Pt} by ${t.nick} (${t.text})`),n.joined=!1,n.nicks.clear()):(i("kick",`* ${t.target??"?"} was kicked by ${t.nick} (${t.text})`),!e&&t.target&&n.drop(t.target));break;case"nick":r&&!e&&t.target?(i("text",`* Your nick is now ${t.target}`),this.renameMe(t.target),Pd(t.target)):i("text",`* ${t.nick} is now known as ${t.target??"?"}`),!e&&t.target&&n.rename(t.nick,t.target);break;case"topic":i("topic",`* ${t.nick} changes topic to '${t.text}'`),e||(n.topic=t.text);break}e||this.nicksChanged(Pt)}whoisReply(t){const e=n=>this.push(this.view,"text",n);e(`${t.nick} is ${t.mask} * ${t.nick}`),t.trip&&e(`${t.nick} is identified by tripcode ${t.trip}`),t.op&&e(`${t.nick} is a channel operator on ${Pt}`),e(`${t.nick} signed on ${new Date(t.signon).toLocaleString()}`),e(`${t.nick} End of /WHOIS list.`)}chatError(t,e){var r;const n=this.wins[Pt],i=e.replace(/^(\S+) :/,"$1 ");this.push(n.joined?Pt:"status","error",`* ${i}`),!n.joined&&(t==="432"||t==="433")&&((r=this.link)==null||r.close(),this.link=null,this.livingOnce=!1,this.livingSeenAt=0,this.connectDialog(e.replace(/^\S+ :/,"")))}dropped(t,e,n){const i=this.wins[Pt],r=i.joined;i.joined=!1,i.nicks.clear(),this.nicksChanged(Pt),n?this.push(Pt,"info",`* ${this.me} is connected from somewhere else now (another window?); this one let go`):r&&!e&&this.push(Pt,"info",`* Disconnected${t?" (reconnecting...)":""}`),this.push("status","info",`* Disconnected from ${Pt}${t?" (reconnecting...)":""}`),t||(this.link=null,this.livingOnce=!1,this.livingSeenAt=0,this.renameMe(xc))}renameMe(t){if(t===this.me)return;const e=this.wins[kt];e.joined&&(e.rename(this.me,t),this.nicksChanged(kt)),this.me=t,this.retitle()}say(t){var a,l,c,u,h,d;const e=t.trim();if(!e)return;const n=this.view,i=n===Pt&&this.wins[Pt].joined&&!!this.link,r=f=>this.push(n,"error",`* ${f}`);if(e.startsWith("/")&&!e.startsWith("//")){const[f="",...p]=e.slice(1).split(/\s+/),x=p.join(" ");switch(f.toLowerCase()){case"help":this.help();return;case"clear":this.wins[n].log.replaceChildren();return;case"quit":case"exit":this.win.close();return;case"join":{const m=(p[0]??"").toLowerCase().replace(/^#?/,"#");m===Pt||m==="#"&&n==="status"?this.joinLiving():m===kt?(this.show(kt),this.push(kt,"error",`* You are already on ${kt}`)):r(`${p[0]??"#"} Cannot join channel (this network has ${kt} and ${Pt})`);return}case"part":case"leave":n===Pt&&this.link?this.partLiving():r(n===kt?`${kt} will not let you go`:"You are not on a channel");return;case"nick":p[0]?(a=this.link)!=null&&a.send({type:"nick",nick:p[0]})||r(`Join ${Pt} first to have a name (/join ${Pt})`):r("Usage: /nick <newnick>");return;case"whois":p[0]?(l=this.link)!=null&&l.send({type:"whois",nick:p[0]})||r(`${p[0]} :No such nick`):r("Usage: /whois <nick>");return;case"me":if(!x)return;i?(c=this.link)==null||c.send({type:"say",text:x,action:!0}):n===kt?this.refused(`* ${this.me} ${x}`,"action"):r("You are not on a channel");return;case"topic":i&&x?(u=this.link)==null||u.send({type:"topic",text:x}):i?this.push(Pt,"topic",`* Topic is '${this.wins[Pt].topic}'`):r(`${n==="status"?"":`${n} `}You're not channel operator`);return;case"kick":i&&p[0]?(h=this.link)==null||h.send({type:"kick",nick:p[0],reason:p.slice(1).join(" ")}):r(i?"Usage: /kick <nick> [reason]":"You're not channel operator");return;default:r(`${f.toUpperCase()} Unknown command`);return}}const o=e.startsWith("//")?e.slice(1):e;i?(d=this.link)!=null&&d.send({type:"say",text:o})||r("Not connected"):n===kt&&this.wins[kt].joined?this.refused(`<${this.me}> ${o}`,"own"):r("You are not on a channel")}refused(t,e){this.push(kt,e,t),this.push(kt,"error",`* ${kt} Cannot send to channel`),this.hintedOikos||(this.hintedOikos=!0,this.push(kt,"info",`* (the living talk in ${Pt}: /join ${Pt})`))}help(){const t=e=>this.push(this.view,"info",e);t("* Commands:"),t(`*   /join ${Pt}           join the living (a nick, and a password for a tripcode if you like)`),t("*   /nick <name>           change your nick"),t("*   /me <does something>   an action"),t("*   /whois <nick>          who someone is (their tripcode, if they have one)"),t(`*   /part                  leave ${Pt}`),t("*   /topic, /kick          for channel operators"),t("*   /clear  /quit")}push(t,e,n,i=Date.now()){var c;const r=this.wins[t],o=r.log,a=o.scrollHeight-o.scrollTop-o.clientHeight<24,l=V("div",{class:`mirc-row t-${e}`});for(l.append(V("span",{class:"ts"},[ky(i)]),` ${n}`),o.append(l);o.childElementCount>Uy;)(c=o.firstElementChild)==null||c.remove();a&&(o.scrollTop=o.scrollHeight),t!==this.view&&(t!=="status"&&(e==="text"||e==="action"||e==="own")?r.tab.classList.add("said"):r.tab.classList.contains("said")||r.tab.classList.add("event"))}show(t){this.view=t;for(const n of Object.values(this.wins)){const i=n.id===t;n.pane.hidden=!i,n.tab.classList.toggle("on",i),n.tab.setAttribute("aria-selected",String(i)),i&&n.tab.classList.remove("said","event")}const e=this.wins[t].log;e.scrollTop=e.scrollHeight,this.input.setAttribute("aria-label",t==="status"?"Command":`Message ${t}`),this.retitle()}nicksChanged(t){this.wins[t].render(),this.retitle()}setHung(t){this.hung!==t&&(this.hung=t,this.win.el.classList.toggle("mirc-hung",t),this.retitle())}retitle(){const t=this.wins[this.view],e=t.id===kt?"+mnt":"+nt",n=t.id==="status"?`mIRC - [Status: ${this.me} on ${kn} (${gc})]`:t.joined?`mIRC - [${t.id} [${t.nicks.size}] [${e}]: ${t.topic}]`:`mIRC - [${t.id} (not on channel)]`;this.win.setTitle(this.hung?`${n} (Not Responding)`:n)}}class Gy{constructor(t,e,n,i){R(this,"win");R(this,"statusLine");R(this,"timer",0);this.site=t,this.shell=e;const r=V("div");r.style.cssText="display:flex;flex-direction:column;min-height:0;flex:1;";const o=xd({back:()=>this.shell.back(),forward:()=>this.shell.forward(),can:()=>({back:this.shell.canBack,forward:this.shell.canForward}),up:()=>this.shell.home(),folders:()=>d.toggleAttribute("hidden")}),a=yd(t),l=vd(Tn(t.accent),a,!1,()=>this.shell.open(t)).el,c=_d();r.append(fc({File:()=>[...Do(this.shell,t,!0),"sep",{label:"Properties",disabled:!0},"sep",{label:"Close",run:()=>this.win.close()}],Edit:()=>bd(this.shell,t),View:()=>Td(this.shell,{toolbar:o.el,address:l,status:c.el,up:()=>this.shell.home(),refresh:()=>this.refresh()}),Favorites:()=>Sd(this.shell),Tools:()=>wd(),Help:()=>Ed(this.shell)}),o.el,l);const u=this.shell.onNav(()=>o.refresh()),h=V("div",{class:"xp-body"}),d=V("aside",{class:"xp-tasks"});h.append(d);const f=V("div",{class:"xp-content"});h.append(f),r.append(h),c.set("Done",Md(t)),r.append(c.el);const p=V("div",{class:"xp-hero",html:Tn(t.accent,t.title)}),x=V("div");x.append(V("h2",{},[t.title]),V("p",{},[t.tagline])),p.append(x),f.append(p);const m=V("button",{class:"xp-preview",type:"button","aria-label":`Open ${t.title}`}),g=this.shell.screens.get(t.id);g&&m.append(g.canvas),m.append(V("span",{class:"xp-play"},[`▶  open ${t.title}`])),m.addEventListener("click",L=>this.shell.open(t,L)),f.append(m),f.append(V("p",{class:"xp-about"},[t.about]));const S=this.note();S&&f.append(V("div",{class:"xp-note"},[S]));const w=V("div",{class:"xp-actions"}),y=V("button",{class:"xp-btn default",type:"button"},[`Open ${t.title}`]);y.addEventListener("click",L=>this.shell.open(t,L));const M=V("button",{class:"xp-btn",type:"button"},["~ Home directory"]);if(M.addEventListener("click",()=>this.shell.home()),w.append(y),t.tune&&this.shell.canTune){const L=V("button",{class:"xp-btn",type:"button"},["▣ Watch it here"]);L.title="the live page, on its own screen in the room",L.addEventListener("click",()=>this.shell.tuneIn(t.id)),w.append(L)}if(t.id==="irc"){const L=V("button",{class:"xp-btn",type:"button"},["Join #aethera"]);L.title="sit in the channel, in mIRC",L.addEventListener("click",()=>this.shell.chat("#aethera")),w.append(L)}w.append(M),f.append(w);const E=[{icon:cc(),label:`Open ${t.title}`,run:()=>this.shell.open(t)},{icon:ld(),label:"Look at its screen",run:()=>this.shell.look(t.id)}];t.tune&&this.shell.canTune&&E.splice(1,0,{icon:yy(),label:"Watch it on its screen",run:()=>this.shell.tuneIn(t.id)}),t.id==="irc"&&E.splice(1,0,{icon:Ti("channel"),label:"Join #aethera in mIRC",run:()=>this.shell.chat("#aethera")}),E.push({icon:My(),label:"Copy address",run:()=>pc(this.shell,t)}),E.push({icon:cd(),label:"Eject tape",run:()=>this.win.close()});const C=[{icon:yr(),label:"~ (home directory)",run:()=>this.shell.home()}];for(const L of Cy[t.id]??[]){const D=this.shell.site(L);D&&C.push({icon:Tn(D.accent),label:D.title,run:()=>this.shell.play(D.id)})}const _=V("div",{class:"xp-details"});_.append(V("b",{},[t.title]));const T=V("dl");for(const[L,D]of t.details)T.append(V("dt",{},[L]),V("dd",{},[D]));_.append(T),this.statusLine=V("div",{class:"status"}),_.append(this.statusLine),d.append(Vs("Tape Tasks",E,!0),Vs("Other Places",C),Vs("Details",_)),this.win=n.open({id:`site:${t.id}`,title:`${t.title} — ${a.replace(/^https?:\/\//,"")}`,icon:Tn(t.accent),body:r,width:Math.round(Math.min(760,Math.max(440,innerWidth*.5))),dock:"right",onClose:()=>{u(),clearInterval(this.timer),g==null||g.canvas.remove(),i()}}),this.win.el.style.height="min(640px, calc(100% - 24px))",this.refresh(),this.timer=window.setInterval(()=>this.refresh(),2e3)}note(){const t=this.site;return t.id==="dreams"?"Opening dreams wakes the dreamer: a GPU starts up while anyone is watching and goes back to sleep after. The frame here is the last one the chronicle kept.":t.id==="syrinx"?"Syrinx makes sound once you wake it. The creature here is read from this browser; nobody else sees yours.":t.id==="afterlife"?"afterlife makes music once you click in. The universe on this screen is the one saved in this browser, if you have visited; nobody else sees yours.":t.group==="wired"?`${t.title} is not on this server; it opens in a new window.`:null}refresh(){const{feeds:t}=this.shell;let e=!1,n="";switch(this.site.id){case"dreams":case"dreams-api":{const r=t.dreams.value;e=r.known&&r.awake,n=r.known?r.awake?`awake · frame ${r.frame.toLocaleString("en-US")}${r.viewers?` · ${r.viewers} watching`:""}`:"asleep":"status unknown";break}case"chronicle":{const r=t.chronicle.value;e=r.known&&r.eras.some(o=>o.open),n=r.known?`${r.eraCount||r.eras.length} eras recorded`:"reading the core…";break}case"irc":{const r=t.irc.value;e=r.connected,n=r.connected?"live on #aethera":"connecting…";break}case"syrinx":{const r=t.creature.value;e=!!r,n=r?`yours: ${r.name}`:"not woken in this browser";break}case"afterlife":{const r=t.universe.value;e=!!r,n=r?`yours: generation ${r.generation.toLocaleString("en-US")}`:"no universe in this browser yet";break}default:return}this.statusLine.className=`status${e?" on":""}`,this.statusLine.innerHTML="<i></i><span></span>";const i=this.statusLine.querySelector("span");i&&(i.textContent=n)}}const Ld=2;class Vy{constructor(t,e,n,i){R(this,"el");R(this,"menu");R(this,"buttons");R(this,"clock");R(this,"moonEl");R(this,"start");R(this,"tip");R(this,"balloonEl");R(this,"balloonTimer",0);R(this,"dialogEl",null);this.root=t,this.shell=e,this.wm=n,this.hooks=i,this.el=V("nav",{class:"xp-taskbar","aria-label":"taskbar"}),this.start=V("button",{class:"xp-start",type:"button","aria-label":"æthera","aria-haspopup":"menu","aria-expanded":"false",html:'<span aria-hidden="true">æ</span>'}),this.buttons=V("div",{class:"xp-taskbuttons"});const r=V("div",{class:"xp-tray"}),o=V("span",{class:"tray-icon net",title:"Connected to the Wired",html:fy()});this.moonEl=V("span",{class:"tray-icon dream",title:"dreams",html:od(!1)}),this.clock=V("span",{class:"clock"}),r.append(o,this.moonEl,this.clock),this.el.append(this.start,this.buttons,r),t.append(this.el),this.menu=this.buildMenu(),t.append(this.menu),this.start.addEventListener("click",()=>this.toggleMenu()),t.addEventListener("pointerdown",a=>{const l=a.target;!this.menu.hidden&&!l.closest(".xp-startmenu")&&!l.closest(".xp-start")&&!l.closest(".xp-menu")&&this.toggleMenu(!1)}),this.el.addEventListener("contextmenu",a=>{a.preventDefault(),a.stopPropagation();const l=a.target.closest(".xp-taskbtn"),c=l?this.wm.list.find(u=>u.opts.id===l.dataset.win):void 0;Gs(c?c.systemMenu():this.barMenu(),a.clientX,a.clientY)}),o.addEventListener("click",()=>this.balloon("Connected to the Wired",`${e.dir.sites.length} screens · 1 VCR · signal: present day, present time`,this.trayAnchor())),this.tip=V("div",{class:"xp-tip",role:"tooltip",hidden:""}),this.balloonEl=V("div",{class:"xp-balloon",role:"status",hidden:""}),t.append(this.tip,this.balloonEl),n.on(()=>this.renderButtons()),e.feeds.dreams.on(a=>{this.moonEl.innerHTML=od(a.awake),this.moonEl.title=a.known?a.awake?`dreams: awake · frame ${a.frame.toLocaleString("en-US")}`:"dreams: asleep":"dreams: no answer"}),this.tick(),setInterval(()=>this.tick(),15e3)}tick(){this.clock.textContent=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}trayAnchor(){const t=this.el.getBoundingClientRect();return{x:t.right-60,y:t.top}}toggleMenu(t){var n;const e=t??this.menu.hidden;e||Ai(),this.menu.hidden=!e,this.start.classList.toggle("open",e),this.start.setAttribute("aria-expanded",String(e)),e&&((n=this.menu.querySelector("a,button"))==null||n.focus())}barMenu(){return[{label:"Toolbars",disabled:!0,submenu:()=>[]},"sep",{label:"Cascade Windows",disabled:!0},{label:"Tile Windows Horizontally",disabled:!0},{label:"Tile Windows Vertically",disabled:!0},{label:"Show the Desktop",run:()=>this.showDesktop(),disabled:!this.wm.list.some(t=>!t.minimized&&!t.opts.dialog)},"sep",{label:"Task Manager",disabled:!0},"sep",{label:"Lock the Taskbar",checked:!0,disabled:!0},{label:"Properties",disabled:!0}]}showDesktop(){for(const t of[...this.wm.list])!t.opts.dialog&&!t.minimized&&t.minimize()}buildMenu(){const t=V("div",{class:"xp-startmenu",role:"menu",hidden:""}),e=V("header");e.append(V("span",{class:"avatar",html:Lo(40)}),V("span",{},["guest"])),t.append(e,V("div",{class:"orange","aria-hidden":"true"}));const n=V("div",{class:"cols"}),i=V("ul",{class:"left"}),r=V("ul",{class:"right"}),o=(M,E)=>{const C=V("li");return C.append(E),M.append(C),E},a=(M,E,C,_,T,L="")=>{const D=V("button",{type:"button",role:"menuitem",class:L,html:`${E}<span><span class="tt"></span>${_!==null?"<small></small>":""}</span>`});D.querySelector(".tt").textContent=C;const U=D.querySelector("small");return U&&_&&(U.textContent=_),D.addEventListener("click",()=>{this.toggleMenu(!1),T()}),o(M,D)},l=(M,E,C,_)=>{const T=V("a",{href:_,role:"menuitem",html:`${E}<span></span>`});T.querySelector("span").textContent=C,o(M,T)},c=(M,E,C,_,T)=>{const L=V("button",{type:"button",role:"menuitem",class:`cascade ${_}`,"aria-haspopup":"menu","data-menu-owner":"",html:`${E}<span class="tt"></span><i class="arrow"></i>`});L.querySelector(".tt").textContent=C;const D=()=>{L.classList.add("open"),gd(T(),L,()=>L.classList.remove("open"))};return L.addEventListener("click",D),L.addEventListener("pointerenter",D),o(M,L)},u=M=>M.append(V("li",{class:"sep",role:"separator"}));t.addEventListener("pointerover",M=>{const E=M.target.closest("li > a, li > button");E&&!E.classList.contains("cascade")&&Ai()});const h=M=>({label:M.title,icon:Tn(M.accent),run:()=>{this.toggleMenu(!1),this.shell.play(M.id)}});a(i,Ti(),"mIRC","#aethera",()=>this.shell.chat(),"pinned");const d=this.shell.dir.sites.filter(M=>M.group==="here");d.slice(0,Ld).forEach(M=>a(i,Tn(M.accent,M.title),M.title,M.kind,()=>this.shell.play(M.id),"pinned")),u(i),d.slice(Ld).forEach(M=>a(i,Tn(M.accent,M.title),M.title,null,()=>this.shell.play(M.id)));const f=V("li",{class:"allprog"});i.append(V("li",{class:"sep",role:"separator"}),f);const p=V("button",{type:"button",role:"menuitem",class:"cascade","aria-haspopup":"menu","data-menu-owner":"",html:`<span class="tt">All Programs</span>${Sy()}`}),x=()=>{p.classList.add("open"),gd([...this.shell.dir.sites.filter(M=>M.group==="here").map(h),"sep",...this.shell.dir.sites.filter(M=>M.group==="wired").map(h),"sep",{label:"~ (home directory)",icon:yr(),run:()=>{this.toggleMenu(!1),this.shell.home()}}],p,()=>p.classList.remove("open"))};p.addEventListener("click",x),p.addEventListener("pointerenter",x),f.append(p),a(r,yr(),"My Tapes",null,()=>this.shell.home(),"strong");const m=this.shell.dir.posts.slice(0,8);m.length&&c(r,Hs("txt"),"My Recent Transmissions","strong",()=>m.map(M=>({label:M.title,icon:Hs("txt"),run:()=>location.assign(M.href)}))),u(r);const g=this.shell.dir.sites.filter(M=>M.group==="wired");for(const M of g)a(r,Tn(M.accent),M.title,null,()=>this.shell.play(M.id));u(r);for(const M of this.shell.dir.files)l(r,Hs(M.title.split(".").pop()??"txt"),M.title,M.href);n.append(i,r),t.append(n);const S=V("div",{class:"foot"}),w=V("button",{type:"button",html:`${dd()}<span>Log Off</span>`});w.addEventListener("click",()=>{this.toggleMenu(!1),this.logOffDialog()});const y=V("button",{type:"button",html:`${ud()}<span>Turn Off Computer</span>`});return y.addEventListener("click",()=>{this.toggleMenu(!1),this.shutdownDialog()}),S.append(w,y),t.append(S),t}dismiss(){return this.dialogEl?(this.dialogEl.remove(),this.dialogEl=null,this.start.focus(),!0):!1}bigDialog(t,e){var l,c;(l=this.dialogEl)==null||l.remove();const n=V("div",{class:"xp-shutdown",role:"dialog","aria-modal":"true","aria-label":t});this.dialogEl=n;const i=V("div",{class:"panel"});i.append(V("header",{html:`<span></span>${Lo(28,!1)}`})),i.querySelector("header span").textContent=t;const r=V("div",{class:"choices"});for(const u of e){const h=V("button",{type:"button",class:u.cls,html:`<i>${u.icon}</i><span>${u.label}</span>`}),d=u.run;d?h.addEventListener("click",()=>{n.remove(),this.dialogEl=null,d()}):h.disabled=!0,r.append(h)}i.append(r);const o=V("div",{class:"foot"}),a=V("button",{class:"xp-btn",type:"button"},["Cancel"]);a.addEventListener("click",()=>this.dismiss()),o.append(a),i.append(o),n.append(i),this.root.append(n),(c=r.querySelector("button:not(:disabled):last-of-type, button:not(:disabled)"))==null||c.focus()}logOffDialog(){this.bigDialog("Log Off æthera",[{cls:"switch",icon:fd(),label:"Switch User"},{cls:"logoff",icon:dd(),label:"Log Off",run:()=>this.hooks.logOff()}])}shutdownDialog(){var t,e;this.bigDialog("Turn off computer",[{cls:"standby",icon:by(),label:"Stand By",run:()=>this.hooks.standby(!0)},{cls:"off",icon:ud(),label:"Turn Off",run:()=>this.hooks.turnOff()},{cls:"restart",icon:fd(),label:"Restart",run:()=>this.hooks.restart()}]),(e=(t=this.dialogEl)==null?void 0:t.querySelector(".off"))==null||e.focus()}renderButtons(){this.buttons.replaceChildren();for(const t of this.wm.list){if(t.opts.dialog)continue;const e=V("button",{class:`xp-taskbtn${this.wm.activeWindow===t&&!t.minimized?" active":""}`,type:"button","data-win":t.opts.id,html:`${t.opts.icon}<span></span>`});e.querySelector("span").textContent=t.opts.title,e.title=t.opts.title,e.addEventListener("click",()=>{t.minimized?t.restore():this.wm.activeWindow===t?t.minimize():t.focus()}),this.buttons.append(e)}}showTip(t,e,n,i){const r=t?{title:t.title,text:t.tagline}:e;if(!r){this.tip.hidden=!0;return}this.tip.innerHTML="<b></b><span></span>",this.tip.querySelector("b").textContent=r.title,this.tip.querySelector("span").textContent=r.text,this.tip.hidden=!1;const o=this.root.getBoundingClientRect(),a=this.tip.offsetWidth;this.tip.style.left=`${Math.min(n+14,o.width-a-6)}px`,this.tip.style.top=`${Math.min(i+20,o.height-70)}px`}balloon(t,e,n,i=7e3,r=!1){var f;const o=this.balloonEl;o.innerHTML=`<b>${hd()}<span></span></b><span class="msg"></span><button class="x" type="button" aria-label="Close">✕</button>`,o.querySelector("b span").textContent=t,o.querySelector(".msg").textContent=e,(f=o.querySelector(".x"))==null||f.addEventListener("click",()=>o.hidden=!0),o.hidden=!1;const a=this.root.getBoundingClientRect(),l=n??this.trayAnchor(),c=o.offsetWidth,u=o.offsetHeight,h=Math.max(6,Math.min(l.x-30,a.width-c-6)),d=r?l.y+u+24>a.height-30:l.y-u-20>0;o.classList.toggle("above",d),o.classList.toggle("below",!d),o.style.left=`${h}px`,o.style.top=`${d?l.y-u-18:l.y+18}px`,o.style.setProperty("--tail",`${Math.max(12,Math.min(c-30,l.x-h))}px`),clearTimeout(this.balloonTimer),this.balloonTimer=window.setTimeout(()=>o.hidden=!0,i)}hideBalloon(){this.balloonEl.hidden=!0}}const bc=300,Sc=180,Wy=["n","s","e","w","ne","nw","se","sw"];class $y{constructor(t,e){R(this,"el");R(this,"minimized",!1);R(this,"closed",!1);var o,a,l,c,u;this.opts=t,this.wm=e;const n=document.createElement("section");n.className=`xp-window${t.dialog?" xp-dialog":""}`,n.setAttribute("role",t.dialog?"alertdialog":"dialog"),n.setAttribute("aria-label",t.title),n.innerHTML=`
      <header class="xp-titlebar">
        <span class="xp-title-icon">${t.icon}</span>
        <span class="xp-title"></span>
        <span class="xp-controls">
          ${t.dialog?"":'<button class="xp-min" aria-label="Minimize" title="Minimize"></button><button class="xp-max" aria-label="Maximize" title="Maximize"></button>'}
          <button class="xp-close" aria-label="Close" title="Close"></button>
        </span>
      </header>`;const i=n.querySelector(".xp-title");i&&(i.textContent=t.title),n.append(t.body),n.style.width=`${t.width}px`,this.el=n,(o=n.querySelector(".xp-close"))==null||o.addEventListener("click",()=>this.close()),(a=n.querySelector(".xp-min"))==null||a.addEventListener("click",()=>this.minimize()),(l=n.querySelector(".xp-max"))==null||l.addEventListener("click",()=>this.toggleMax()),n.addEventListener("pointerdown",()=>this.focus(),!0),this.bindDrag(n.querySelector(".xp-titlebar")),t.dialog||this.bindResize(),(c=n.querySelector(".xp-titlebar"))==null||c.addEventListener("dblclick",h=>{const d=h.target;d.closest(".xp-controls")||t.dialog||(d.closest(".xp-title-icon")?this.close():this.toggleMax())});const r=n.querySelector(".xp-title-icon");r==null||r.setAttribute("data-menu-owner",""),r==null||r.addEventListener("click",h=>{h.stopPropagation();const d=n.getBoundingClientRect();Gs(this.systemMenu(),d.left+3,d.top+29)}),(u=n.querySelector(".xp-titlebar"))==null||u.addEventListener("contextmenu",h=>{const d=h;d.target.closest(".xp-controls")||(d.preventDefault(),d.stopPropagation(),Gs(this.systemMenu(),d.clientX,d.clientY))})}get maximized(){return this.el.classList.contains("maximized")}systemMenu(){const t=!!this.opts.dialog;return[{label:"Restore",run:()=>this.minimized?this.restore():this.toggleMax(),disabled:t||!this.maximized&&!this.minimized},{label:"Move",disabled:!0},{label:"Size",disabled:!0},{label:"Minimize",run:()=>this.minimize(),disabled:t||this.minimized},{label:"Maximize",run:()=>{this.minimized&&this.restore(),this.maximized||this.toggleMax()},disabled:t||this.maximized},"sep",{label:"Close",run:()=>this.close(),bold:!0,shortcut:"Alt+F4"}]}setTitle(t){const e=this.el.querySelector(".xp-title");e&&(e.textContent=t),this.el.setAttribute("aria-label",t)}place(t){const e=t.clientWidth,n=t.clientHeight,i=Math.min(this.opts.width,e-16);this.el.style.width=`${i}px`,t.append(this.el);const r=Math.min(this.el.offsetHeight,n-16);let o=this.opts.x??0,a=this.opts.y??0;this.opts.x===void 0&&(this.opts.dock==="left"?o=18:this.opts.dock==="right"?o=e-i-18:o=(e-i)/2),this.opts.y===void 0&&(a=this.opts.dialog?(n-r)/2.4:Math.max(8,Math.min(60,(n-r)/2))),this.moveTo(o,a)}moveTo(t,e){const n=this.el.parentElement;if(!n)return;const i=n.clientWidth-60,r=n.clientHeight-30;this.el.style.left=`${Math.round(Math.max(-this.el.offsetWidth+80,Math.min(i,t)))}px`,this.el.style.top=`${Math.round(Math.max(0,Math.min(r,e)))}px`}bindDrag(t){let e=null;t.addEventListener("pointerdown",i=>{i.target.closest(".xp-controls, .xp-title-icon")||i.button!==0||this.el.classList.contains("maximized")||innerWidth<=720||(e={x:i.clientX,y:i.clientY,left:this.el.offsetLeft,top:this.el.offsetTop},t.setPointerCapture(i.pointerId))}),t.addEventListener("pointermove",i=>{e&&this.moveTo(e.left+i.clientX-e.x,e.top+i.clientY-e.y)});const n=()=>{e&&this.wm.changed(),e=null};t.addEventListener("pointerup",n),t.addEventListener("pointercancel",n)}bindResize(){for(const t of Wy){const e=document.createElement("div");e.className=`xp-grip xp-grip-${t}`,e.setAttribute("aria-hidden","true"),this.el.append(e);let n=null;e.addEventListener("pointerdown",r=>{r.button!==0||this.maximized||innerWidth<=720||(r.preventDefault(),n={x:r.clientX,y:r.clientY,left:this.el.offsetLeft,top:this.el.offsetTop,w:this.el.offsetWidth,h:this.el.offsetHeight},e.setPointerCapture(r.pointerId),this.focus())}),e.addEventListener("pointermove",r=>{if(!n)return;const o=this.el.parentElement;if(!o)return;const a=r.clientX-n.x,l=r.clientY-n.y;let{left:c,top:u,w:h,h:d}=n;t.includes("e")&&(h=Math.min(o.clientWidth-c,Math.max(bc,n.w+a))),t.includes("s")&&(d=Math.min(o.clientHeight-u,Math.max(Sc,n.h+l))),t.includes("w")&&(h=Math.max(bc,Math.min(n.left+n.w,n.w-a)),c=n.left+n.w-h),t.includes("n")&&(d=Math.max(Sc,Math.min(n.top+n.h,n.h-l)),u=n.top+n.h-d),this.el.style.left=`${Math.round(c)}px`,this.el.style.top=`${Math.round(u)}px`,this.el.style.width=`${Math.round(h)}px`,this.el.style.height=`${Math.round(d)}px`,this.el.style.maxHeight="none"});const i=()=>{n&&this.wm.changed(),n=null};e.addEventListener("pointerup",i),e.addEventListener("pointercancel",i)}}clamp(){if(this.maximized||this.minimized)return;const t=this.el.parentElement;t&&(this.el.offsetWidth>t.clientWidth&&(this.el.style.width=`${Math.max(bc,t.clientWidth-8)}px`),this.el.offsetHeight>t.clientHeight&&(this.el.style.height=`${Math.max(Sc,t.clientHeight-8)}px`),this.moveTo(this.el.offsetLeft,this.el.offsetTop))}focus(){this.wm.focus(this)}minimize(){this.minimized=!0,this.el.classList.add("minimized"),this.wm.focusTop(),this.wm.changed()}restore(){this.minimized=!1,this.el.classList.remove("minimized"),this.focus()}toggleMax(){const t=this.el.classList.toggle("maximized"),e=this.el.querySelector(".xp-max");e==null||e.setAttribute("aria-label",t?"Restore":"Maximize"),e==null||e.setAttribute("title",t?"Restore":"Maximize"),this.wm.changed()}close(){var t,e;this.closed||(this.closed=!0,this.el.remove(),this.wm.remove(this),(e=(t=this.opts).onClose)==null||e.call(t))}}class Xy{constructor(t){R(this,"windows",[]);R(this,"active",null);R(this,"z",30);R(this,"listeners",new Set);this.desk=t,addEventListener("resize",()=>{for(const e of this.windows)e.clamp()})}get list(){return this.windows}get activeWindow(){return this.active}get(t){return this.windows.find(e=>e.opts.id===t)}open(t){const e=this.get(t.id);if(e)return e.minimized?e.restore():e.focus(),e;const n=new $y(t,this);return this.windows.push(n),n.place(this.desk),this.focus(n),n}focus(t){var n,i;if(t.closed)return;const e=this.active!==t;this.active=t,t.el.style.zIndex=String(++this.z);for(const r of this.windows)r.el.classList.toggle("inactive",r!==t);e&&((i=(n=t.opts).onFocus)==null||i.call(n)),this.changed()}deactivate(){if(this.active){this.active=null;for(const t of this.windows)t.el.classList.add("inactive");this.changed()}}focusTop(){const e=this.windows.filter(n=>!n.minimized).sort((n,i)=>Number(i.el.style.zIndex)-Number(n.el.style.zIndex))[0];e?this.focus(e):(this.active=null,this.changed())}remove(t){this.windows=this.windows.filter(e=>e!==t),this.active===t&&(this.active=null,this.focusTop()),this.changed()}closeTop(){const t=this.active&&!this.active.minimized?this.active:null;return t?(t.close(),!0):!1}on(t){return this.listeners.add(t),()=>this.listeners.delete(t)}changed(){for(const t of this.listeners)t()}}const wc=document.getElementById("oikos");if(wc)try{qy(wc)}catch(s){console.error("oikos: boot failed; falling back to the plain directory",s),wc.classList.remove("oikos-live"),(Dd=document.getElementById("oikos-boot"))==null||Dd.remove()}function Yy(){var s;try{const t=document.createElement("canvas").getContext("webgl2");return(s=t==null?void 0:t.getExtension("WEBGL_lose_context"))==null||s.loseContext(),!!t}catch{return!1}}function Io(){return location.pathname+location.search}function qy(s){var ee,Q;s.classList.add("oikos-live");const t=matchMedia("(prefers-reduced-motion: reduce)").matches,e=jd(),n=new tf,i=new Map(e.sites.map(I=>[I.id,Jf(I,{dir:e,feeds:n})])),r=new Map(e.sites.map(I=>[I.id,I]));if(new URLSearchParams(location.search).has("contact")){Ky(s,e.sites,i,n);return}const o=V("div",{id:"oikos-desktop"});s.append(o);const a=new Xy(o);Ey(s);const l={stack:[],i:-1,moving:!1,listeners:new Set},c=I=>{if(!(l.moving||l.stack[l.i]===I)){l.stack=l.stack.slice(0,l.i+1),l.stack.push(I),l.i=l.stack.length-1;for(const Y of l.listeners)Y()}},u=I=>{const Y=l.stack[l.i+I];if(Y!==void 0){l.i+=I,l.moving=!0;try{Y==="~"?w.home():w.play(Y)}finally{l.moving=!1}for(const st of l.listeners)st()}};let h=null,d=null,f=null,p=null,x=!1,m=null,g=0,S=!1;const w={dir:e,feeds:n,screens:i,site:I=>r.get(I),select(I){E(!1),h==null||h.focus(I)},play(I){const Y=r.get(I);if(!Y)return;if(c(I),E(!1),y.select(I),f===I&&d){h==null||h.play(I),d.win.minimized?d.win.restore():d.win.focus();return}const st=d;d=null,f=null,st==null||st.win.close(),history.replaceState(null,"",`${Io()}#${I}`);const dt=a.get("home");dt&&!dt.minimized&&h&&(dt.minimize(),S=!0);const lt=++g,Ot=Dt=>{if(lt===g){if(!Dt){h==null||h.eject(),history.replaceState(null,"",Io());const Gt=a.get("home");S&&(Gt!=null&&Gt.minimized)&&Gt.restore(),S=!1;return}f=I,h==null||h.keepAlive(I),d=new Gy(Y,w,a,()=>{if(f!==I)return;d=null,f=null,h==null||h.keepAlive(null),h==null||h.eject(),(h==null?void 0:h.focusedId)===I&&h.focus(null),history.replaceState(null,"",Io());const Gt=a.get("home");S&&(Gt!=null&&Gt.minimized)&&Gt.restore(),S=!1})}};h?h.play(I).then(Ot):Ot(!0)},open(I,Y){if(Y==null||Y.preventDefault(),x)return;if(Uc(I.href)){window.open(I.href,"_blank","noopener"),M.balloon(`${I.title} opened`,"It opened in a new window. The room is still here.");return}const st=I.href;x=!0,M.balloon(`Opening ${I.title}`,"tuning in…",void 0,2e3);let dt=!1;const lt=()=>{dt||(dt=!0,location.assign(st))};h?h.dive(I.id).then(lt):lt(),setTimeout(lt,1500)},look(I){E(!1),h==null||h.focus(I)},get canTune(){return!!h},tuneIn(I){const Y=r.get(I);if(!h||!(Y!=null&&Y.tune))return;const st=typeof Y.tune=="string"?Y.tune:Y.href;E(!1);const dt=a.list.filter(ne=>!ne.minimized&&!ne.opts.dialog);for(const ne of dt)ne.minimize();M.hideBalloon();const lt=V("div",{class:"oikos-tube"});lt.style.setProperty("--glow",Y.accent);const Ot=V("iframe",{src:st,title:`${Y.title}, live`,allow:"autoplay; fullscreen; clipboard-write"});lt.append(Ot,V("i",{class:"roll"}),V("i",{class:"glass"})),Ot.addEventListener("load",()=>{var ne;try{(ne=Ot.contentWindow)==null||ne.addEventListener("keydown",he=>{var Re;const ue=he.target;he.key!=="Escape"||he.defaultPrevented||(Re=ue==null?void 0:ue.closest)!=null&&Re.call(ue,"input, textarea, [contenteditable]")||E(!0)})}catch{}});const Dt=V("div",{class:"oikos-tuned",role:"toolbar","aria-label":"tuned in"});Dt.innerHTML=`${Tn(Y.accent)}<b></b><span>tuned in · live on its screen</span>`,Dt.querySelector("b").textContent=Y.title;const Gt=V("button",{class:"xp-btn",type:"button"},["⏏ Eject"]);Gt.addEventListener("click",()=>E(!0));const jt=V("a",{class:"xp-btn",href:Y.href},["Open full ↗"]);Uc(Y.href)&&(jt.setAttribute("target","_blank"),jt.setAttribute("rel","noopener")),Dt.append(Gt,jt),m={id:I,bar:Dt,hidden:dt,tube:lt};const Qt=ne=>{const he=Math.round(Math.min(1024,Math.max(420,ne.width*1.15))),ue=Math.round(he*.75);lt.style.width=`${he}px`,lt.style.height=`${ue}px`,lt.style.transform=`translate(${ne.left}px, ${ne.top}px) scale(${ne.width/he}, ${ne.height/ue})`};h.tuneIn(I,Qt).then(()=>{(m==null?void 0:m.bar)===Dt&&(s.append(lt,Dt),Ot.focus())})},chat(I){E(!1),p||(p=new Hy(w,a,()=>p=null)),p.focus(I)},home(){c("~"),E(!1),y.open(),h==null||h.scroll("~ home")},eject(){E(!1),d==null||d.win.close(),h==null||h.eject(),h==null||h.focus(null)},balloon(I,Y,st){M.balloon(I,Y,st)},back:()=>u(-1),forward:()=>u(1),get canBack(){return l.i>0},get canForward(){return l.i<l.stack.length-1},onNav(I){return l.listeners.add(I),()=>l.listeners.delete(I)},about:()=>C()},y=new Ry(w,a),M=new Vy(s,w,a,{standby:I=>L(I),turnOff(){s.classList.add("off"),setTimeout(()=>location.assign("/"),t?50:750)},logOff(){E(!1);for(const I of[...a.list])I.close();h==null||h.eject(),h==null||h.focus(null),history.replaceState(null,"",Io()),M.balloon("Logged off","The desk is clear. Click the VCR to begin again.",(h==null?void 0:h.anchor("vcr"))??void 0)},restart(){try{sessionStorage.removeItem("oikos-booted")}catch{}location.reload()}});function E(I){if(!m)return;const{id:Y,bar:st,hidden:dt,tube:lt}=m;if(m=null,st.remove(),lt.remove(),h==null||h.tuneOut(),!!I){for(const Ot of dt)Ot.closed||Ot.restore();h==null||h.focus(Y)}}function C(){var Gt;(Gt=a.get("about"))==null||Gt.close();const I=V("div",{class:"xp-about-box"}),Y=V("div",{class:"band",html:Lo(44,!0)});Y.append(V("b",{},["æthera"]),V("span",{},["oikos"]));const st=V("div",{class:"xp-dialog-body"}),dt=V("div");dt.append(V("p",{},["æthera · the home directory"]),V("p",{},["Version 1998 (Build 2026.present_day)"]),V("p",{},["A room of screens wired to one VCR, and every part of the site playing at once."]),V("p",{class:"lic"},["This product is licensed under CC BY 4.0 to:"]),V("p",{},["guest"])),st.append(dt);const lt=V("div",{class:"xp-actions"}),Ot=V("button",{class:"xp-btn default",type:"button"},["OK"]);lt.append(Ot),I.append(Y,st,lt);const Dt=a.open({id:"about",title:"About æthera",icon:hd(),body:I,width:400,dialog:!0});Ot.addEventListener("click",()=>Dt.close()),Ot.focus()}if(Yy())try{h=new ay(s,e.sites,i,{pick(I){D(),M.hideBalloon(),M.showTip(null,null,0,0),I==="vcr"?w.home():I?w.play(I):h!=null&&h.focusedId&&!d&&!h.busy&&h.focus(null)},hover(I,Y,st){I==="vcr"?M.showTip(null,{title:"VCR",text:"your home directory · click to open ~"},Y,st):M.showTip(I?r.get(I)??null:null,null,Y,st)}})}catch(I){console.warn("oikos: the room would not build; running the desktop alone",I),h==null||h.stop(),h=null}if(h==null||h.renderer.domElement.addEventListener("pointerdown",()=>a.deactivate()),Ay(s,(I,Y)=>{var Ot,Dt;const st=I.closest(".xp-tile");if(st)return st.dataset.id?y.contextFor(st.dataset.id):null;if(I.closest("a"))return null;if(I.closest(".xp-content")&&((Dt=(Ot=I.closest(".xp-window"))==null?void 0:Ot.getAttribute("aria-label"))!=null&&Dt.startsWith("~")))return y.blankMenu();if(I.closest(".xp-window, .xp-startmenu, .xp-shutdown, .xp-menu, .xp-balloon"))return[];if(!h||I!==h.renderer.domElement)return[];const dt=h.pickFromPoint(Y.clientX,Y.clientY);if(dt==="vcr")return[{label:"Open ~",bold:!0,run:()=>w.home()},{label:"Eject",run:()=>w.eject(),disabled:!f},"sep",{label:"Properties",disabled:!0}];const lt=dt?r.get(dt):void 0;return lt?Do(w,lt):[{label:"Arrange Icons By",disabled:!0,submenu:()=>[]},{label:"Refresh",run:()=>h==null?void 0:h.focus(null)},"sep",{label:"Paste",disabled:!0},{label:"Paste Shortcut",disabled:!0},"sep",{label:"New",disabled:!0,submenu:()=>[]},"sep",{label:"~ Home directory",run:()=>w.home()},{label:"Properties",disabled:!0}]}),!h){let I=performance.now();const Y=st=>{var lt;requestAnimationFrame(Y);const dt=Math.min(.1,(st-I)/1e3);I=st,f&&((lt=i.get(f))==null||lt.tick(st/1e3,dt,!0))};requestAnimationFrame(Y)}const _=()=>{if(!h)return;const I=innerWidth,Y=innerHeight-30,st=a.list.filter(Ot=>!Ot.minimized&&!Ot.opts.dialog&&!Ot.el.classList.contains("maximized"));if(I<=720){h.setShift(0,st.length?Y*.3:0);return}let dt=0,lt=I;for(const Ot of st){const Dt=Ot.el.getBoundingClientRect();Dt.left+Dt.width/2<I/2?dt=Math.max(dt,Dt.right):lt=Math.min(lt,Dt.left)}lt-dt<I*.22&&(dt=0,lt=I),h.setShift(I/2-(dt+lt)/2,0)};a.on(_),addEventListener("resize",_);let T=!1;function L(I){T=I,s==null||s.classList.toggle("standby",I),I&&(h==null||h.focus(null))}function D(){T&&L(!1)}s.addEventListener("pointerdown",D,!0);const U=new Map(Object.entries(Rr).map(([I,Y])=>[Y.channel,I])),K=e.sites.map(I=>I.id).sort((I,Y)=>{var st,dt;return(((st=Rr[I])==null?void 0:st.channel)??99)-(((dt=Rr[Y])==null?void 0:dt.channel)??99)});let Z="",N=0;addEventListener("keydown",I=>{if(T){D();return}const Y=I.target;if(!Y.closest("input, textarea")){if(I.key==="Escape"&&m){E(!0);return}if(!m){if(I.key==="Escape"){if(Ai()||M.dismiss()||!W())return;const st=a.activeWindow;if(st!=null&&st.opts.dialog&&!st.minimized){st.close();return}h!=null&&h.focusedId&&h.focus(null);return}if(I.altKey&&(I.key==="ArrowLeft"||I.key==="ArrowRight")){I.preventDefault(),u(I.key==="ArrowLeft"?-1:1);return}if(!Y.closest(".xp-window, .xp-startmenu, .xp-menu, .xp-shutdown")){if(I.key==="~"||I.key==="Home"){w.home();return}if((I.key==="ArrowRight"||I.key==="ArrowLeft")&&!(h!=null&&h.busy)){const st=h!=null&&h.focusedId&&h.focusedId!=="vcr"?K.indexOf(h.focusedId):-1,dt=K[(st+(I.key==="ArrowRight"?1:-1)+K.length)%K.length];if(dt){h==null||h.focus(dt),y.select(dt);const lt=h==null?void 0:h.anchor(dt),Ot=r.get(dt);lt&&Ot&&M.showTip(Ot,null,lt.x-40,lt.y-50)}return}if(I.key==="Enter"&&(h!=null&&h.focusedId)&&h.focusedId!=="vcr"){w.play(h.focusedId);return}/^[0-9]$/.test(I.key)&&(Z=(Z+I.key).slice(-2),clearTimeout(N),h==null||h.scroll(`ch ${Z}`),N=window.setTimeout(()=>{const st=U.get(Number(Z));Z="",st&&r.has(st)&&w.play(st)},700))}}}});function W(){const I=s==null?void 0:s.querySelector(".xp-startmenu");return I&&!I.hidden?(M.toggleMenu(!1),!1):!0}let B=!1;document.addEventListener("visibilitychange",()=>{document.hidden?(h==null||h.stop(),n.stop(),m&&E(!0)):B&&(h==null||h.start(),n.start())}),addEventListener("pageshow",I=>{I.persisted&&(x=!1,s.classList.remove("off"),h==null||h.reset())});const X=document.getElementById("oikos-boot");let nt=!1;try{nt=!!sessionStorage.getItem("oikos-booted"),sessionStorage.setItem("oikos-booted","1")}catch{}const ot=t||nt?250:1900;let at=()=>{};const xt=new Promise(I=>at=I);X==null||X.addEventListener("click",()=>at());const Ht=Promise.race([Promise.all([(ee=document.fonts)==null?void 0:ee.load('16px "Libertinus Mono"'),(Q=document.fonts)==null?void 0:Q.load('16px "Love Letter Typewriter"')]).then(()=>{},()=>{}),new Promise(I=>setTimeout(I,1500))]),ve=(h==null?void 0:h.warm())??Promise.resolve();Promise.race([Promise.all([Ht,ve,new Promise(I=>setTimeout(I,ot))]),xt]).then(()=>{B=!0,document.hidden||(n.start(),h==null||h.start()),h==null||h.powerOn(),X==null||X.classList.add("gone"),setTimeout(()=>X==null?void 0:X.remove(),800);const I=new URLSearchParams(location.search).get("look");I&&h&&(I==="vcr"||r.has(I))&&setTimeout(()=>h==null?void 0:h.focus(I),300);let Y="";try{Y=decodeURIComponent(location.hash.slice(1))}catch{}if(Y==="mirc"){setTimeout(()=>w.chat(),600);return}if(Y&&r.has(Y)){setTimeout(()=>w.play(Y),900);return}if(!h){w.home(),M.balloon("No room tonight","This browser has no WebGL, so the room of screens is dark. The tapes all still play.");return}setTimeout(()=>{if(a.list.length)return;const st=(h==null?void 0:h.anchor("vcr"))??void 0;M.balloon("This is the way in",innerWidth<=720?"Tap the VCR for the home directory, or any screen to tune in. Drag to look around.":"Click the VCR for your home directory, or any screen to tune in. Drag to look around; ← → walk the screens.",st,11e3,!0)},nt?900:2600)})}function Ky(s,t,e,n){var a;(a=document.getElementById("oikos-boot"))==null||a.remove();const i=V("div");i.style.cssText="position:absolute;inset:0;overflow:auto;padding:16px;display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));background:#0a0a0a;";for(const l of t){const c=e.get(l.id);if(!c)continue;const u=V("figure");u.style.cssText="margin:0;color:#aaa;font:12px ui-monospace,monospace;",c.canvas.style.cssText="width:100%;display:block;border:1px solid #333;";const h=V("figcaption",{},[`${l.title} · ${l.kind}`]);h.style.padding="4px 0",u.append(c.canvas,h),i.append(u)}s.append(i),n.start();let r=performance.now();const o=l=>{requestAnimationFrame(o);const c=Math.min(.1,(l-r)/1e3);r=l;for(const u of e.values())u.tick(l/1e3,c,!1)};requestAnimationFrame(o)}})();
