var wM=Object.defineProperty;var EM=(ai,Rn,Wn)=>Rn in ai?wM(ai,Rn,{enumerable:!0,configurable:!0,writable:!0,value:Wn}):ai[Rn]=Wn;var A=(ai,Rn,Wn)=>EM(ai,typeof Rn!="symbol"?Rn+"":Rn,Wn);(function(){"use strict";var Gd,Vd;const ai=[17,19,21,57,93,165,163,204,209,214,220,231],Rn=[236,234],Wn=Rn.length,Di=6,Qd=[17,18,19,20,21,57,56,93,129,165,164,163,198,204,203,209,208,214,220,229,231],Sr=s=>Qd[s]??0,tf=Array.from({length:Di},(s,t)=>[Sr(Math.floor((185+t)/21)),Sr((185+t)%21)]),ef=Array.from({length:Di*Di},(s,t)=>[Sr(Math.floor((191+t)/21)),Sr((191+t)%21)]),nf=.98,Pc=4,sf=Math.fround(nf**Pc),Ys="▁▂▃▄▅▆▇█",li=-2,ts=2,rf={[-2]:"0.25x",[-1]:"0.50x",0:" 1.0x",1:" 2.0x",2:" 4.0x"},es={glider:[[0,1],[1,2],[2,0],[2,1],[2,2]],lwss:[[0,1],[0,4],[1,0],[2,0],[2,4],[3,0],[3,1],[3,2],[3,3]],hwss:[[0,3],[0,4],[1,1],[1,6],[2,0],[3,0],[3,6],[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]],r_pentomino:[[0,1],[0,2],[1,0],[1,1],[2,1]],acorn:[[0,1],[1,3],[2,0],[2,1],[2,4],[2,5],[2,6]],diehard:[[0,6],[1,0],[1,1],[2,1],[2,5],[2,6],[2,7]],pi_heptomino:[[0,0],[0,1],[0,2],[1,1],[2,1],[3,0],[3,2]],b_heptomino:[[0,1],[1,0],[1,2],[1,3],[2,0],[2,1],[3,1]],gosper_gun:[[0,24],[1,22],[1,24],[2,12],[2,13],[2,20],[2,21],[2,34],[2,35],[3,11],[3,15],[3,20],[3,21],[3,34],[3,35],[4,0],[4,1],[4,10],[4,16],[4,20],[4,21],[5,0],[5,1],[5,10],[5,14],[5,16],[5,17],[5,22],[5,24],[6,10],[6,16],[6,24],[7,11],[7,15],[8,12],[8,13]],pulsar:[[0,2],[0,3],[0,4],[0,8],[0,9],[0,10],[2,0],[2,5],[2,7],[2,12],[3,0],[3,5],[3,7],[3,12],[4,0],[4,5],[4,7],[4,12],[5,2],[5,3],[5,4],[5,8],[5,9],[5,10],[7,2],[7,3],[7,4],[7,8],[7,9],[7,10],[8,0],[8,5],[8,7],[8,12],[9,0],[9,5],[9,7],[9,12],[10,0],[10,5],[10,7],[10,12],[12,2],[12,3],[12,4],[12,8],[12,9],[12,10]],pentadecathlon:[[0,1],[1,1],[2,0],[2,2],[3,1],[4,1],[5,1],[6,1],[7,0],[7,2],[8,1],[9,1]]},Oo=["glider","lwss","hwss"],Lc=["r_pentomino","acorn","diehard","pi_heptomino","b_heptomino"],Dc=["pulsar","pentadecathlon"],of=[[1,1],[1,-1],[-1,-1],[-1,1]];function Bo(s){const t=new Map;for(const[e,n]of s)for(const[i,r]of[[e,n],[e,-n],[-e,n],[-e,-n]])t.set(`${i},${r}`,[i,r]);return[...t.values()]}const af=[Bo([[0,1],[0,2],[0,3],[1,0],[1,4],[2,0],[2,5],[3,0],[3,5],[4,1],[4,5],[5,2],[5,3],[5,4]]),Bo([[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[4,0],[2,2],[3,3]]),Bo([[0,3],[0,4],[1,2],[1,5],[2,1],[2,6],[3,0],[3,7],[4,0],[4,7],[5,1],[5,6],[6,2],[6,5],[7,3],[7,4]])],zo="afterlife-universe-v1";function lf(s,t){const e=atob(s),n=new Int32Array(t);let i=0;const r=()=>{let a=0,l=1;for(;;){if(i>=e.length)throw new Error("afterlife: truncated save");const c=e.charCodeAt(i++);if(a+=(c&127)*l,c<128)return a;l*=128}};let o=-1;for(;i<e.length;){o+=r()+1;const a=r();if(o>=t)throw new Error("afterlife: save does not fit its own world");n[o]=a%2?-(a+1)/2:a/2}return n}function cf(s){var t;try{const e=(t=s??globalThis.localStorage)==null?void 0:t.getItem(zo);if(!e)return null;const n=JSON.parse(e);if(n.v!==1||!Number.isInteger(n.h)||!Number.isInteger(n.w)||typeof n.cells!="string")return null;const i=n.h,r=n.w;if(i<=0||r<=0||i*r>16e6)return null;const o=Number(n.generation);return!Number.isSafeInteger(o)||o<0?null:{h:i,w:r,age:lf(n.cells,i*r),generation:o,totalInjections:Number(n.totalInjections)||0,bornAt:Number(n.bornAt)||Date.now(),savedAt:Number(n.savedAt)||Date.now()}}catch(e){return console.warn("afterlife: could not load the universe, starting fresh",e),null}}function hf(){const s=document.getElementById("oikos-data");try{const t=JSON.parse((s==null?void 0:s.textContent)??"{}");return{sites:t.sites??[],files:t.files??[],posts:t.posts??[]}}catch{return{sites:[],files:[],posts:[]}}}const Ic=s=>/^https?:\/\//.test(s);class ns{constructor(t){A(this,"listeners",new Set);this.value=t}set(t){this.value=t;for(const e of this.listeners)e(t)}on(t){return this.listeners.add(t),()=>this.listeners.delete(t)}}function Uc(){try{const s=localStorage.getItem("syrinx-creature-v1");if(!s)return null;const t=JSON.parse(s);if(typeof t.name!="string"||typeof t.bornAt!="number"||!t.state)return null;const e=Array.isArray(t.state.nodes)?t.state.nodes:[],n=Array.isArray(t.state.edges)?t.state.edges:[];return e.length?{name:t.name,bornAt:t.bornAt,lifetime:typeof t.state.lifetime=="number"?t.state.lifetime:0,nodes:e.map(i=>({id:i.id,x:i.x,y:i.y,z:i.z??500,age:i.age??0})),edges:n.map(i=>({a:i.a,b:i.b,age:i.age??0}))}:null}catch{return null}}function Nc(s){const t=s.indexOf('"cells"');return t<0?s:s.slice(0,t)}function uf(s){if(!s)return null;const t=Nc(s),e=o=>{const a=new RegExp(`"${o}":(\\d+)`).exec(t);return a?Number(a[1]):void 0};let n=e("generation"),i=e("savedAt"),r=e("bornAt");if(n===void 0||i===void 0){try{const o=JSON.parse(s);n=typeof o.generation=="number"?o.generation:void 0,i=typeof o.savedAt=="number"?o.savedAt:void 0,r=typeof o.bornAt=="number"?o.bornAt:void 0}catch{return null}if(n===void 0||i===void 0)return null}return{generation:n,bornAt:r??i,savedAt:i}}let qs=null;function Ho(){let s;try{s=localStorage.getItem(zo)}catch{return null}if(!s)return null;const t=Nc(s);if(qs&&qs.len===s.length&&qs.head===t)return qs.info;const e=uf(s);return qs={len:s.length,head:t,info:e},e}function kc(s){return new Promise((t,e)=>{const n=new Image;n.decoding="async",n.onload=()=>t(n),n.onerror=e,n.src=s})}async function wr(s){try{const t=await fetch(s,{headers:{Accept:"application/json"}});return t.ok?await t.json():null}catch{return null}}class df{constructor(){A(this,"dreams",new ns({known:!1,awake:!1,frame:0,fps:0,viewers:0,raw:null}));A(this,"chronicle",new ns({known:!1,thumb:null,thumbAt:0,prompt:"",template:"",eras:[],eraCount:0,strata:[]}));A(this,"irc",new ns({connected:!1,lines:[],collapse:null,fragments:0,version:0}));A(this,"creature",new ns(Uc()));A(this,"universe",new ns(Ho()));A(this,"apeiron",new ns(null));A(this,"timers",[]);A(this,"ws",null);A(this,"wsBackoff",2e3);A(this,"wsTimer",0);A(this,"running",!1);A(this,"onStorage",t=>{(t.key===zo||t.key===null)&&this.setUniverse(Ho())})}start(){if(this.running)return;this.running=!0;const t=(e,n)=>{e(),this.timers.push(window.setInterval(e,n))};t(()=>void this.pollDreams(),2e4),t(()=>void this.pollChronicle(),12e4),t(()=>this.creature.set(Uc()),15e3),window.addEventListener("storage",this.onStorage),t(()=>this.setUniverse(Ho()),6e4),this.openIrc(),this.apeiron.value||this.loadApeiron()}setUniverse(t){var e;(t==null?void 0:t.savedAt)!==((e=this.universe.value)==null?void 0:e.savedAt)&&this.universe.set(t)}stop(){this.running=!1;for(const t of this.timers)clearInterval(t);this.timers=[],window.removeEventListener("storage",this.onStorage),clearTimeout(this.wsTimer),this.ws&&(this.ws.onclose=null,this.ws.close(),this.ws=null),this.irc.set({...this.irc.value,connected:!1,version:this.irc.value.version+1})}async pollDreams(){var e,n,i,r,o;const t=await wr("/api/dreams/status");if(!t){this.dreams.set({...this.dreams.value,known:!1});return}this.dreams.set({known:!0,awake:!!((e=t.gpu)!=null&&e.active),frame:((n=t.generation)==null?void 0:n.current_frame)??((i=t.generation)==null?void 0:i.frame_count)??0,fps:((r=t.generation)==null?void 0:r.fps)??0,viewers:((o=t.viewers)==null?void 0:o.websocket_count)??0,raw:t})}async pollChronicle(){var o,a,l,c;const t=await wr("/api/dreams/chronicle/timeline?hours=3");if(!t)return;const e=this.chronicle.value;let n=e.thumb;(o=t.live)!=null&&o.thumb&&t.live.thumb!==(n==null?void 0:n.dataset.src)&&(n=await kc(t.live.thumb).catch(()=>e.thumb),n&&(n.dataset.src=t.live.thumb));const i=(t.tiles??[]).slice(-3),r=(await Promise.all(i.map(h=>kc(h.url).catch(()=>null)))).filter(h=>!!h);this.chronicle.set({known:!0,thumb:n,thumbAt:((a=t.live)==null?void 0:a.t)??0,prompt:((l=t.live)==null?void 0:l.prompt)??"",template:((c=t.live)==null?void 0:c.template)??"",eras:(t.eras??[]).map(h=>({title:h.title??"",t0:h.t0,t1:h.t1,open:!!h.open,kf:h.kf??0})),eraCount:t.era_count??0,strata:r.length?r:e.strata})}openIrc(){const t=location.protocol==="https:"?"wss":"ws";let e;try{e=new WebSocket(`${t}://${location.host}/ws/irc`)}catch{return}this.ws=e;const n=i=>{const r=this.irc.value;this.irc.set({...r,...i,version:r.version+1})};e.onopen=()=>{this.wsBackoff=2e3,n({connected:!0,collapse:null})},e.onmessage=i=>{let r;try{r=JSON.parse(String(i.data))}catch{return}if(r.type==="message"&&r.data){const o=r.data,a=o.meta??{},l={nick:String(o.nick??""),content:String(o.content??""),type:String(o.type??"message"),stamp:String(o.timestamp??""),at:performance.now()};if(typeof o.at=="number"&&(l.wallAt=o.at),typeof a.target=="string"&&(l.target=a.target),typeof a.reason=="string"&&(l.reason=a.reason),r.replay&&this.irc.value.lines.some(c=>c.stamp===l.stamp&&c.nick===l.nick&&c.content===l.content))return;n({lines:[...this.irc.value.lines,l].slice(-60)})}else r.type==="collapse_start"?n({collapse:{type:r.collapseType??"collapse",at:performance.now()}}):r.type==="fragment_end"&&(r.replay?n({collapse:null}):n({collapse:null,lines:this.irc.value.lines.slice(-6),fragments:this.irc.value.fragments+1}))},e.onclose=()=>{n({connected:!1}),this.running&&(this.wsTimer=window.setTimeout(()=>this.openIrc(),this.wsBackoff),this.wsBackoff=Math.min(this.wsBackoff*2,6e4))}}async loadApeiron(){const[t,e]=await Promise.all([wr("/static/apeiron/data/templates.json"),wr("/static/apeiron/data/components.json")]);t&&e&&this.apeiron.set({templates:t,components:e})}}const ff={block:[[[0,0],[0,1],[1,0],[1,1]],1],beehive:[[[0,1],[0,2],[1,0],[1,3],[2,1],[2,2]],1],loaf:[[[0,1],[0,2],[1,0],[1,3],[2,1],[2,3],[3,2]],1],boat:[[[0,0],[0,1],[1,0],[1,2],[2,1]],1],tub:[[[0,1],[1,0],[1,2],[2,1]],1],ship:[[[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]],1],pond:[[[0,1],[0,2],[1,0],[1,3],[2,0],[2,3],[3,1],[3,2]],1],blinker:[[[0,0],[0,1],[0,2]],2],toad:[[[0,1],[0,2],[0,3],[1,0],[1,1],[1,2]],2],beacon:[[[0,0],[0,1],[1,0],[2,3],[3,2],[3,3]],2],glider:[es.glider??[],4],lwss:[es.lwss??[],4],hwss:[es.hwss??[],4],pulsar:[es.pulsar??[],3],pentadecathlon:[es.pentadecathlon??[],15]},pf=60,Fc=20;function Oc(s){let t=null;for(let e=0;e<8;e++){const n=e>=4,i=n?s.w:s.h,r=n?s.h:s.w;let o=`${i}x${r}:`;for(let a=0;a<i;a++)for(let l=0;l<r;l++){let c=e&1?i-1-a:a,h=e&2?r-1-l:l;n&&([c,h]=[h,c]),o+=s.bits[c*s.w+h]?"1":"0"}(t===null||o<t)&&(t=o)}return t??""}let Go=null;function mf(){if(Go)return Go;const s=new Map;for(const[t,[e,n]]of Object.entries(ff)){const i=Math.max(...e.map(([h])=>h))+1,r=Math.max(...e.map(([,h])=>h))+1,o=Math.max(i,r)+2*(n+4);let a=new Uint8Array(o*o);const l=Math.floor((o-i)/2),c=Math.floor((o-r)/2);for(const[h,u]of e)a[(l+h)*o+c+u]=1;for(let h=0;h<n;h++){const u=Bc(a,o,o);if(u){const f=Oc(u);s.has(f)||s.set(f,t)}const d=new Uint8Array(o*o);for(let f=0;f<o;f++)for(let p=0;p<o;p++){let v=0;for(let g=-1;g<=1;g++)for(let x=-1;x<=1;x++)(g||x)&&(v+=a[(f+g+o)%o*o+(p+x+o)%o]??0);const m=a[f*o+p]===1;d[f*o+p]=m&&(v===2||v===3)||!m&&v===3?1:0}a=d}}return Go=s,s}function Bc(s,t,e){let n=t,i=-1,r=e,o=-1;for(let h=0;h<t;h++)for(let u=0;u<e;u++)s[h*e+u]&&(h<n&&(n=h),h>i&&(i=h),u<r&&(r=u),u>o&&(o=u));if(i<0)return null;const a=i-n+1,l=o-r+1,c=new Uint8Array(a*l);for(let h=0;h<a;h++)for(let u=0;u<l;u++)c[h*l+u]=s[(n+h)*e+r+u]??0;return{h:a,w:l,bits:c}}function gf(s,t,e){const n=mf(),i=new Uint8Array(t*e);for(let h=0;h<t;h++)for(let u=0;u<e;u++)if(s[h*e+u])for(let d=-2;d<=2;d++){const f=h+d;if(f<0||f>=t)continue;const p=2-Math.abs(d),v=Math.max(0,u-p),m=Math.min(e-1,u+p);i.fill(1,f*e+v,f*e+m+1)}const r=new Int32Array(t*e),o=[],a=[];for(let h=0;h<t*e;h++){if(!i[h]||r[h])continue;const u=o.length+1;if(u>400)return null;const d={y0:t,y1:-1,x0:e,x1:-1};for(r[h]=u,a.push(h);a.length;){const f=a.pop()??0,p=Math.floor(f/e),v=f-p*e;p<d.y0&&(d.y0=p),p>d.y1&&(d.y1=p),v<d.x0&&(d.x0=v),v>d.x1&&(d.x1=v);for(let m=-1;m<=1;m++){const g=p+m;if(!(g<0||g>=t))for(let x=-1;x<=1;x++){const w=v+x;if(w<0||w>=e)continue;const M=g*e+w;i[M]&&!r[M]&&(r[M]=u,a.push(M))}}}o.push(d)}if(o.length===0)return null;const l=new Map,c=[];return o.forEach((h,u)=>{const d=u+1,f=h.y1-h.y0+1,p=h.x1-h.x0+1;if(f>Fc+4||p>Fc+4)return;const v=new Uint8Array(f*p);let m=0,g=0,x=0;for(let E=0;E<f;E++)for(let b=0;b<p;b++){const R=(h.y0+E)*e+h.x0+b;s[R]&&r[R]===d&&(v[E*p+b]=1,m++,g+=E,x+=b)}if(m<3||m>pf)return;const w=Bc(v,f,p),M=w?n.get(Oc(w)):void 0;M!==void 0&&(l.set(M,(l.get(M)??0)+1),c.length<48&&c.push([M,h.y0+Math.floor(g/m),h.x0+Math.floor(x/m)]))}),{counts:l,sites:c}}const Vo=["cells pondering existence","entropy is just a suggestion","order from chaos, chaos from order","the cosmos breathes","finding signal in noise","patterns all the way down","life, uh, finds a way","on the edge of chaos","complexity, emerging","dancing at the phase boundary","stillness is just slow motion","every cell a universe","the substrate computes","from nothing, everything","infinite in all directions","what the dead cells dream","the glider knows the way","automata, contemplating","structure wants to happen","a cosmos in a terminal","the math dreams itself","somewhere, a glider remembers","what is a pattern but frozen time","the void is patient","meaning is optional; beauty is not","computation as meditation","the rules are simple; the consequences infinite","watching the watchers watch","no cell is an island","the ghost of configurations past","asymmetry seeks symmetry seeks asymmetry","this too shall iterate","the universe has no pause button","except when it does","what would Conway think","oscillators keep time for no one","the glider gun knows not what it creates","boundaries are suggestions","death is just a state transition","somewhere in here, a proof of universality","the grid forgets nothing","a thought experiment that thinks back","topology has opinions","the neighborhood watches","not alive, not dead — computing","four rules, one universe","each frame a theorem","proof by existence","the only constant is the ruleset","somewhere between on and off, meaning","the dead outnumber the living, as always","conway's little infinities","the simulation doesn't know it's beautiful","27 neighbors ago, this was empty","elegance is compression","the grid is the message","a love letter to discrete math","listen — the cells are whispering","we are all gliders, briefly"],xf={booming:["runaway growth","the bloom unfolds","life begets life begets life","exponential daydreams","more is different","the bloom cannot be stopped","abundance as instability","growing into the unknown","every birth a cascade","the simulation smiles","lebensraum","mitosis dreams","the substrate strains","a spring that won't stop springing","cells all the way to the horizon","the algorithm is generous today","more, more, more","genesis on fast-forward"],declining:["entropy collects its due","the long exhale","even stars go dark","returning to the void","graceful unwinding","the great filter, in miniature","less is not nothing","the long forgetting","what rises must","simplicity returns","the cells remember fullness","autumn in the grid","graceful subtraction","the tide goes out","a slow dissolve","the universe exhales","dimming, not vanishing","the population curve bends earthward"],cycle:["deja vu, deja vu, deja vu","stuck in a loop","the eternal return","ouroboros","time is a flat circle","we have been here before","the loop remembers itself","stability through repetition","a prayer, repeating","the wheel turns","same as it ever was","history rhymes","the attractor holds","a fixed point in phase space","nietzsche was right about this part","the universe stutters beautifully","clockwork, but organic","breathing in, breathing out"],stagnant:["the hush before the storm","equilibrium is boring","waiting for a perturbation","still waters","the universe holds its breath","the calm before","potential energy","stillness is also motion","the system waits","one perturbation away","dormant, not dead","crystallized","the peace of equilibrium","a held breath","the grid meditates","tension, frozen","the quiet hum of nothing happening","patience is also a computation"],sparse:["the last few embers","clinging to existence","from little things, big things grow","seeds in the dark","quiet, but not empty","lonely structures","the survivors","space between stars","minimalism, enforced","room to breathe","the few, the proud","embers","a whisper, not a shout","the geometry of loneliness","each cell precious now","a constellation, if you squint","small, but not nothing"],dense:["teeming","a city that never sleeps","standing room only","too many neighbours","the crowd murmurs","no room to think","the crush of neighbors","overpopulation is self-correcting","too much life","suffocating in company","the grid groans","rush hour","sardines","every cell has an opinion","a metropolis, thrumming","the carrying capacity protests","elbow room is a luxury"],injection:["a gift from beyond the edge","new visitors","reinforcements arrive","the cosmos provides","seeded by unseen hands","deus ex machina","a nudge from outside","fresh blood","the invisible hand places","salvation arrives","new variables enter","the cosmos intervenes","help from beyond the viewport","strangers in a strange land","the petri dish gets a refill","immigrants, welcome"],milestone:["another thousand turns of the wheel","the odometer clicks over","still here, still going","persistence is its own reward","ten thousand steps","the long now","time is a flat circle, but longer","we persist","generations beyond counting","deep in the run","the odometer means nothing to the cells","and yet, it continues","older than some civilizations","the marathon nobody entered","a digit rolls over; the grid doesn't notice","epochal"],haunted:["the dead outnumber the living, and glow","every path ever walked, still visible","the void remembers being alive","phase-contrast photography of the past","nothing is ever really deleted","the grid forgets nothing — literally, now","a bug so beautiful it became a feature","the ghosts have synchronized their breathing","somewhere between pair 463 and 504","resurrection as a rendering artifact","the afterlife was here all along","history, strobing","every empty cell, a metronome","the universe develops like a photograph","magenta is the color of memory"]},vf={glider:["a glider, going somewhere","lightspeed, quartered — a glider","a glider carries the news","diagonal traffic"],lwss:["a lightweight spaceship, outbound","small craft advisory"],hwss:["a heavy spaceship shoulders past","heavy freight on the grid"],pulsar:["a pulsar, keeping time for no one","the pulsar breathes in threes"],pentadecathlon:["fifteen beats to the bar","a pentadecathlon runs its laps"],blinker:["the blinkers keep the beat","metronomes, disagreeing"],block:["blocks: the simplest memory","still life with squares"],beehive:["the bees are home","a beehive, sealed"],loaf:["bread, uneaten","a loaf, going stale beautifully"],boat:["a boat with nowhere to sail"],tub:["a tub, holding nothing"],ship:["a ship without a sea"],pond:["a pond, perfectly still"],toad:["a toad, breathing"],beacon:["the beacon still signals","someone left the light on"]},Wo={pulsar:100,pentadecathlon:100,hwss:90,lwss:80,glider:40,beacon:30,toad:28,pond:24,ship:20,loaf:16,beehive:12,boat:12,tub:12,blinker:8,block:6},_f={blinker:3,block:3},zc=[[0,"genesis"],[500,"primordial"],[2e3,"emergence"],[1e4,"expansion"],[5e4,"flourishing"],[15e4,"deep time"],[5e5,"eon"],[1e6,"eternity"]],Pn=s=>[...s].length;class Hc{constructor(){A(this,"messages",[]);A(this,"scrollSpeed",.4);A(this,"spawnCooldown",0);A(this,"minGap",12);A(this,"ambientInterval",60);A(this,"moodInterval",50);A(this,"ambientIdx",Math.floor(Math.random()*Vo.length));A(this,"lastMood","");A(this,"pendingSpecial","")}queueSpecial(t){this.pendingSpecial=t}tick(t,e,n){if(t<10)return;for(const a of this.messages)a.x-=this.scrollSpeed;if(this.messages=this.messages.filter(a=>a.x+Pn(a.text)>0),this.pendingSpecial&&this.canSpawn(t)){this.messages.push({text:this.pendingSpecial,x:t}),this.pendingSpecial="",this.spawnCooldown=Math.max(this.spawnCooldown,this.moodInterval);return}const i=e?xf[e]:void 0;if(i&&e!==this.lastMood&&(this.spawnCooldown=Math.min(this.spawnCooldown,15)),this.spawnCooldown=Math.max(0,this.spawnCooldown-1),this.spawnCooldown>0||!this.canSpawn(t))return;let r,o;i?(r=i[Math.floor(n/180)%i.length]??"",o=this.moodInterval):(r=Vo[this.ambientIdx]??"",this.ambientIdx=(this.ambientIdx+1)%Vo.length,o=this.ambientInterval),this.messages.push({text:r,x:t}),this.spawnCooldown=o,this.lastMood=e}canSpawn(t){if(!this.messages.length)return!0;let e=-1/0;for(const n of this.messages)e=Math.max(e,n.x+Pn(n.text));return e<t-this.minGap}static dim(t){return Math.sin(t*.035)<0}}const Ee=(s,t)=>s+Math.floor(Math.random()*(t-s+1)),$n=s=>s[Math.floor(Math.random()*s.length)],at=(s,t)=>Math.floor(s/t),hn=(s,t,e)=>Math.max(t,Math.min(s,e)),yf=Math.fround(.85),Mf=Math.fround(.15);function ci(s,t){const e=s.length,n=t/100*(e-1),i=Math.floor(n),r=Math.min(e-1,i+1),o=s[i]??0,a=s[r]??0,l=n-i;return Math.trunc(l>=.5?a-(a-o)*(1-l):o+(a-o)*l)}function bf(s,t,e){const n=(o,a)=>o[a]??0,i=new Float64Array(t*e);for(let o=0;o<e;o++){let a=n(s,o)+(t>1?n(s,e+o):0);i[o]=a/3;for(let l=1;l<t;l++)a+=(l+1<t?n(s,(l+1)*e+o):0)-(l>=2?n(s,(l-2)*e+o):0),i[l*e+o]=a/3}const r=new Float64Array(t*e);for(let o=0;o<t;o++){const a=o*e;let l=n(i,a)+(e>1?n(i,a+1):0);r[a]=l/3;for(let c=1;c<e;c++)l+=(c+1<e?n(i,a+c+1):0)-(c>=2?n(i,a+c-2):0),r[a+c]=l/3}return r}class Sf{constructor(t,e,n=!0,i={}){A(this,"viewH");A(this,"viewW");A(this,"worldH");A(this,"worldW");A(this,"grid");A(this,"age");A(this,"ageSmooth");A(this,"activity");A(this,"nextRow");A(this,"colSum");A(this,"camY");A(this,"camX");A(this,"autoCam",!0);A(this,"zoomLevel",0);A(this,"zoomCooldown",0);A(this,"generation",0);A(this,"paused",!1);A(this,"delay",50);A(this,"popHistory",[]);A(this,"hashHistory",[]);A(this,"cachedPop",0);A(this,"spread",0);A(this,"popFloor",0);A(this,"cyclePeriod",0);A(this,"lastEvent","");A(this,"lastEventGen",0);A(this,"totalInjections",0);A(this,"ticker",new Hc);A(this,"autoFocusMode",!1);A(this,"autoFocusFrame",0);A(this,"dispGridCache",null);A(this,"dispAgeCache",null);A(this,"cachedMood","");A(this,"cachedMoodGen",-1);A(this,"stepBbox",null);A(this,"haunted",!1);A(this,"lastCensus",new Map);A(this,"lastCensusSites",[]);A(this,"sightingGen",new Map);A(this,"sightingCount",new Map);A(this,"lastSightingGen",-1e9);A(this,"dramaUntil",0);A(this,"actBaseline",0);A(this,"dilation",1);this.viewH=t*2,this.viewW=e,this.worldH=Math.max(this.viewH*5,i.minH??400),this.worldW=Math.max(this.viewW*5,i.minW??800);const r=this.worldH*this.worldW;this.grid=new Uint8Array(r),this.age=new Int32Array(r),this.ageSmooth=new Float32Array(r),this.activity=new Float32Array(r),this.nextRow=new Uint8Array(this.worldW),this.colSum=new Uint8Array(this.worldW),this.camY=at(this.worldH-this.viewH,2),this.camX=at(this.worldW-this.viewW,2),n&&this.seedInitial()}seedInitial(){const t=at(this.worldH,2),e=at(this.worldW,2),n=this.viewH,i=this.viewW;for(const a of Lc)for(let l=0;l<2;l++)this.place(a,t+Ee(at(-n,3),at(n,3)),e+Ee(at(-i,3),at(i,3)));for(let a=0;a<2;a++)this.place("gosper_gun",t+Ee(at(-n,4),at(n,4)),e+Ee(at(-i,4),at(i,4)));for(let a=0;a<20;a++){const l=hn(t+Ee(-n,n),10,this.worldH-10),c=hn(e+Ee(-i,i),10,this.worldW-10);this.place($n(Oo),l,c)}for(let a=0;a<4;a++){const l=t+Ee(at(-n,3),at(n,3)),c=e+Ee(at(-i,3),at(i,3));this.place($n(Dc),l,c)}const r=t-at(n,2),o=e-at(i,2);for(let a=0;a<n;a++)for(let l=0;l<i;l++)Math.random()<.035&&(this.grid[(r+a)*this.worldW+o+l]=1);for(let a=0;a<this.grid.length;a++)this.age[a]=this.grid[a]?1:0,this.ageSmooth[a]=this.age[a]??0}place(t,e,n,i){const r=es[t];if(!r)return;const o=i??Ee(0,3);for(let[a,l]of r){for(let u=0;u<o;u++)[a,l]=[l,-a];const c=e+a,h=n+l;if(c>=0&&c<this.worldH&&h>=0&&h<this.worldW){const u=c*this.worldW+h;this.grid[u]=1,this.age[u]=Math.max(this.age[u]??0,1)}}this.invalidate()}invalidate(){this.dispGridCache=null,this.dispAgeCache=null}step(){if(this.paused)return"";this.invalidate();const t=this.worldH,e=this.worldW,n=this.grid,i=this.age;let r=t,o=-1,a=e,l=-1;for(let E=0;E<t;E++){const b=E*e;let R=-1,_=-1;for(let T=0;T<e;T++)i[b+T]!==0&&(R<0&&(R=T),_=T);R<0||(E<r&&(r=E),o=E+1,R<a&&(a=R),_+1>l&&(l=_+1))}const c=o>0;let h=!1;c&&r-2>=0&&o+2<=t&&a-2>=0&&l+2<=e&&(r-=2,o+=2,a-=2,l+=2,h=(o-r)*(l-a)<=at(t*e,2)),h=h&&!this.haunted,this.stepBbox=c&&h?[r,o,a,l]:null,h||(r=0,o=t,a=0,l=e);const u=this.ageSmooth;for(let E=0;E<u.length;E++)u[E]=(u[E]??0)*yf;const d=this.activity,f=this.nextRow,p=this.colSum,v=this.haunted?-Di:-Wn,m=this.haunted,g=new Uint8Array(e),x=n.slice(r*e,r*e+e);let w=0;for(let E=r;E<o;E++){const b=E===0?t-1:E-1,R=E===t-1?0:E+1,_=E===r?null:g,T=E*e,L=b*e,D=R===r&&E!==r,U=R*e,G=a===0?0:a-1,K=l===e?e:l+1;for(let N=G;N<K;N++){const W=_?_[N]??0:n[L+N]??0,B=D?x[N]??0:n[U+N]??0;p[N]=W+(n[T+N]??0)+B}if(a===0&&l===e)for(let N=0;N<e;N++){const W=N===0?e-1:N-1,B=N===e-1?0:N+1;f[N]=(p[W]??0)+(p[N]??0)+(p[B]??0)-(n[T+N]??0)}else for(let N=a;N<l;N++)f[N]=(p[N-1]??0)+(p[N]??0)+(p[N+1]??0)-(n[T+N]??0);g.set(n.subarray(T+G,T+K),G);for(let N=a;N<l;N++){const W=T+N,B=f[N]??0,q=n[W]===1,et=!q&&B===3,ot=q&&(B===3||B===2);(et||q&&!ot)&&(d[W]=(d[W]??0)+1);const lt=i[W]??0;let ft;ot?ft=lt+1:et?ft=1:lt>0?ft=-1:(m||lt<0)&&lt>v?ft=lt-1:ft=0,i[W]=ft,u[W]=(u[W]??0)+Math.fround(Math.fround(ft)*Mf);const $t=et||ot?1:0;n[W]=$t,w+=$t}}if(this.generation+=1,this.generation%Pc===0)for(let E=0;E<d.length;E++)d[E]=(d[E]??0)*sf;this.cachedPop=w,this.popHistory.push(w),this.popHistory.length>500&&this.popHistory.shift(),this.hashHistory.push(this.viewportHash()),this.hashHistory.length>60&&this.hashHistory.shift();const M=this.ensureLife(w);return this.updateCamera(),M}viewportHash(){const[t,e]=this.clampCam();let n=2166136261,i=16777619;for(let r=0;r<this.viewH;r++){const o=(t+r)*this.worldW+e;for(let a=0;a<this.viewW;a++){const l=this.grid[o+a]??0;n=Math.imul(n^l,16777619),i=Math.imul(i^l+158,2246822519)}}return(n>>>0)*2097152+(i>>>0&2097151)}ensureLife(t){const e=this.viewH*this.viewW,n=at(e,40),i=this.popHistory,r=i.length;if(r>=100){let u=0;for(let d=r-100;d<r;d++)u+=i[d]??0;this.popFloor=Math.max(n,Math.trunc(u*.002))}else this.popFloor=n;if(this.spread=0,r>=150){let u=i[r-1]??0,d=u;for(let f=r-150;f<r;f++){const p=i[f]??0;p<u&&(u=p),p>d&&(d=p)}this.spread=d-u}const o=r>=150&&this.spread<Math.max(8,at(this.popFloor,8));this.cyclePeriod=0;const a=this.hashHistory,l=a.length;if(l>=4){const u=a[l-1];for(let d=1;d<Math.min(31,l);d++)if(a[l-1-d]===u){this.cyclePeriod=d;break}}const c=this.generation<this.dramaUntil;let h="";if(t<at(this.popFloor,3))h="inject:massive",this.inject("massive");else if(t<this.popFloor)h="inject:heavy(low_pop)",this.inject("heavy");else if(this.cyclePeriod>0&&!c){const u=Math.random()<.65?this.injectProvoke():"";u?h=`inject:provoke(cycle=${this.cyclePeriod},${u})`:(h=`inject:heavy(cycle=${this.cyclePeriod})`,this.inject("heavy"))}else o&&!c?Math.random()<.7&&this.injectCollide()?h="inject:collide(stagnant)":(h="inject:medium(stagnant)",this.inject("medium")):this.generation%5e3===0&&this.generation>0?(h="inject:garden",this.injectGarden()):this.generation%300===0&&this.generation>0&&(h="inject:edge",this.injectFromEdge(),this.injectFromEdge());return h&&(this.lastEvent=h,this.lastEventGen=this.generation,this.totalInjections+=1),h}inject(t="medium"){const e={massive:8,heavy:5,medium:3}[t];for(let n=0;n<e;n++){let i;t==="massive"&&Math.random()<.3?i="gosper_gun":Math.random()<.4?i=$n(Lc):i=$n([...Oo,...Dc]);const[r,o]=this.findQuietSpot();this.place(i,r+Ee(-6,6),o+Ee(-6,6))}if(t==="massive"||t==="heavy"){const[n,i]=this.findQuietSpot();this.place("gosper_gun",n,i)}}injectFromEdge(){const t=this.camY+at(this.viewH,2),e=this.camX+at(this.viewW,2),n=at(this.viewH,3),i=at(this.viewW,3),r=at(-this.viewH,3),o=at(-this.viewW,3),a=$n(["top","bottom","left","right"]);let l,c,h;a==="top"?[l,c,h]=[this.camY+2,e+Ee(o,i),2]:a==="bottom"?[l,c,h]=[this.camY+this.viewH-5,e+Ee(o,i),0]:a==="left"?[l,c,h]=[t+Ee(r,n),this.camX+2,1]:[l,c,h]=[t+Ee(r,n),this.camX+this.viewW-10,3],this.place($n(Oo),l,c,h)}injectGarden(){const t=this.camY+at(this.viewH,2),e=this.camX+at(this.viewW,2),n=$n(af),i=Ee(at(-this.viewH,6),at(this.viewH,6)),r=Ee(at(-this.viewW,6),at(this.viewW,6));for(const[o,a]of n){const l=t+i+o,c=e+r+a;l>=0&&l<this.worldH&&c>=0&&c<this.worldW&&(this.grid[l*this.worldW+c]=1,this.age[l*this.worldW+c]=1)}this.invalidate()}findQuietSpot(){const[t,e]=this.viewCenter(),n=this.zoomLevel<0?1<<-this.zoomLevel:1,i=Math.min(this.worldH,this.viewH*n),r=Math.min(this.worldW,this.viewW*n),o=Math.max(0,Math.min(t-at(i,2),this.worldH-i)),a=Math.max(0,Math.min(e-at(r,2),this.worldW-r)),l=16,c=at(i,l),h=at(r,l);if(c<2||h<2)return[t,e];const u=new Float64Array(c*h);for(let g=0;g<c*l;g++){const x=(o+g)*this.worldW+a,w=at(g,l)*h;for(let M=0;M<h*l;M++){const E=w+at(M,l);u[E]=(u[E]??0)+(this.grid[x+M]??0)*2+(this.activity[x+M]??0)}}const d=Math.max(1,at(u.length,5)),f=Array.from(u.keys()).sort((g,x)=>(u[g]??0)-(u[x]??0)),p=$n(f.slice(0,d)),v=at(p,h),m=p%h;return[o+v*l+at(l,2),a+m*l+at(l,2)]}aimGlider(t,e,n,i){const[r,o]=of[i]??[1,1],a=t-r*n,l=e-o*n,[c,h]=this.clampCam();if(!(c+2<=a&&a<c+this.viewH-5&&h+2<=l&&l<h+this.viewW-5))return!1;for(let u=Math.max(0,a-2);u<Math.min(this.worldH,a+5);u++)for(let d=Math.max(0,l-2);d<Math.min(this.worldW,l+5);d++)if(this.grid[u*this.worldW+d])return!1;return this.place("glider",a,l,i),!0}injectProvoke(){const t=[...this.lastCensusSites];if(!t.length)return"";t.sort((e,n)=>(Wo[n[0]]??0)-(Wo[e[0]]??0));for(const[e,n,i]of t.slice(0,6)){const r=Ee(35,60),o=[0,1,2,3];for(let a=o.length-1;a>0;a--){const l=Math.floor(Math.random()*(a+1));[o[a],o[l]]=[o[l]??0,o[a]??0]}for(const a of o)if(this.aimGlider(n,i,r,a))return this.dramaUntil=this.generation+r*4+150,this.ticker.queueSpecial("the cosmos takes aim"),e}return""}injectCollide(){let[t,e]=this.findQuietSpot();const[n,i]=this.clampCam();for(let r=0;r<6;r++){const o=Ee(16,34),a=n+o+3,l=n+this.viewH-o-6,c=i+o+3,h=i+this.viewW-o-6;if(a>=l||c>=h)continue;t=Math.max(a,Math.min(t,l)),e=Math.max(c,Math.min(e,h));const u=Ee(0,3),d=Ee(-3,3),f=Ee(-3,3);if(!this.aimGlider(t,e,o,u))continue;const p=(u+$n([1,3]))%4,v=this.aimGlider(t+d,e+f,o,p);return this.dramaUntil=this.generation+o*4+150,this.ticker.queueSpecial(v?"two gliders, one appointment":"a lone glider, sent into the dark"),!0}return!1}calculateTargetZoom(){const[t,e,n,i]=this.stepBbox??[0,this.worldH,0,this.worldW],r=this.worldW;let o=0;for(let x=t;x<e&&o<5;x++)for(let w=n;w<i;w++){const M=this.age[x*r+w]??0;if(M>=1&&M<=10&&++o>=5)break}const a=o>=5,l=[],c=[];for(let x=t;x<e;x++)for(let w=n;w<i;w++){const M=x*r+w;(a?(this.age[M]??0)>=1&&(this.age[M]??0)<=10:this.grid[M]!==0)&&(l.push(x),c.push(w))}if(l.length<2)return this.zoomLevel;const h=Int32Array.from(c).sort(),u=ci(l,15),d=ci(l,85),f=ci(h,15),p=ci(h,85),v=Math.max(4,d-u+1),m=Math.max(4,p-f+1);let g=li;for(let x=ts;x>=li;x--){const w=2**x;if(v<=this.viewH/w*.5&&m<=this.viewW/w*.5){g=x;break}}return hn(g,li,ts)}updateCamera(){if(!this.autoCam)return;const t=30,e=Math.max(0,this.camY-t),n=Math.min(this.worldH,this.camY+this.viewH+t),i=Math.max(0,this.camX-t),r=Math.min(this.worldW,this.camX+this.viewW+t),o=this.worldW;let a=0,l=0,c=0;for(let f=e;f<n;f++)for(let p=i;p<r;p++){const v=this.activity[f*o+p]??0;if(v===0)continue;const m=v*v;a+=m,l+=m*(f-e),c+=m*(p-i)}if(a>25){this.steer(Math.trunc(l/a)+e,Math.trunc(c/a)+i),this.advanceAutoZoom();return}let h=0,u=0,d=0;for(let f=e;f<n;f++)for(let p=i;p<r;p++)this.grid[f*o+p]&&(h++,u+=f-e,d+=p-i);h>0&&this.steer(Math.trunc(u/h)+e,Math.trunc(d/h)+i),this.advanceAutoZoom()}steer(t,e){const n=hn(t-at(this.viewH,2),0,this.worldH-this.viewH),i=hn(e-at(this.viewW,2),0,this.worldW-this.viewW);this.camY=Math.trunc(this.camY+(n-this.camY)*.04),this.camX=Math.trunc(this.camX+(i-this.camX)*.04)}advanceAutoZoom(){if(this.zoomCooldown=Math.max(0,this.zoomCooldown-1),this.zoomCooldown!==0||this.generation%4!==0)return;const t=this.calculateTargetZoom();if(t>this.zoomLevel&&this.zoomLevel<ts)this.zoomLevel+=1,this.zoomCooldown=45;else if(t<this.zoomLevel&&this.zoomLevel>li){const e=this.zoomLevel-1,n=e>=0?1:1<<-e;this.viewH*n<=this.worldH&&this.viewW*n<=this.worldW&&(this.zoomLevel=e,this.zoomCooldown=45)}}clampCam(){return[hn(this.camY,0,this.worldH-this.viewH),hn(this.camX,0,this.worldW-this.viewW)]}viewCenter(){const[t,e]=this.clampCam();return[t+at(this.viewH,2),e+at(this.viewW,2)]}rawViewGrid(){const[t,e]=this.clampCam(),n=new Uint8Array(this.viewH*this.viewW);for(let i=0;i<this.viewH;i++){const r=(t+i)*this.worldW+e;n.set(this.grid.subarray(r,r+this.viewW),i*this.viewW)}return{h:this.viewH,w:this.viewW,data:n}}cover(){const[t,e]=this.viewCenter();if(this.zoomLevel<0){const l=1<<-this.zoomLevel,c=this.viewH*l,h=this.viewW*l;if(c>this.worldH||h>this.worldW)return null;const u=Math.max(0,Math.min(t-at(c,2),this.worldH-c)),d=Math.max(0,Math.min(e-at(h,2),this.worldW-h));return[u,d,c,h,l,!1]}const n=1<<this.zoomLevel,i=Math.max(2,at(this.viewH,n)),r=Math.max(2,at(this.viewW,n)),o=Math.max(0,Math.min(t-at(i,2),this.worldH-i)),a=Math.max(0,Math.min(e-at(r,2),this.worldW-r));return[o,a,i,r,n,!0]}displayGrid(){return this.dispGridCache||(this.dispGridCache=this.computeDisplayGrid()),this.dispGridCache}computeDisplayGrid(){if(this.zoomLevel===0)return this.rawViewGrid();const t=this.cover();if(!t)return this.rawViewGrid();const[e,n,i,r,o,a]=t,l=this.worldW;if(!a){const d=at(i,o),f=at(r,o),p=new Uint8Array(d*f);for(let v=0;v<d*o;v++){const m=(e+v)*l+n,g=at(v,o)*f;for(let x=0;x<f*o;x++)this.grid[m+x]&&(p[g+at(x,o)]=1)}return{h:d,w:f,data:p}}const c=Math.min(i*o,this.viewH),h=Math.min(r*o,this.viewW),u=new Uint8Array(c*h);for(let d=0;d<c;d++){const f=(e+at(d,o))*l+n;for(let p=0;p<h;p++)u[d*h+p]=this.grid[f+at(p,o)]??0}return{h:c,w:h,data:u}}displayAge(){return this.dispAgeCache||(this.dispAgeCache=this.computeDisplayAge()),this.dispAgeCache}computeDisplayAge(){const t=this.haunted?this.age:this.ageSmooth,e=this.worldW,n=p=>Math.trunc(t[p]??0),i=this.zoomLevel===0?null:this.cover();if(!i){const[p,v]=this.clampCam(),m=new Int32Array(this.viewH*this.viewW);for(let g=0;g<this.viewH;g++){const x=(p+g)*e+v;for(let w=0;w<this.viewW;w++)m[g*this.viewW+w]=n(x+w)}return{h:this.viewH,w:this.viewW,data:m}}const[r,o,a,l,c,h]=i;if(!h){const p=at(a,c),v=at(l,c),m=-(this.haunted?Di:Wn)-1,g=new Int32Array(p*v).fill(-2147483648),x=new Int32Array(p*v).fill(m);for(let M=0;M<p*c;M++){const E=(r+M)*e+o,b=at(M,c)*v;for(let R=0;R<v*c;R++){const _=n(E+R),T=b+at(R,c);_>(g[T]??0)&&(g[T]=_);const L=_!==0?_:m;L>(x[T]??0)&&(x[T]=L)}}const w=new Int32Array(p*v);for(let M=0;M<w.length;M++){const E=g[M]??0,b=x[M]??0;w[M]=E>0?E:b>m?b:0}return{h:p,w:v,data:w}}const u=Math.min(a*c,this.viewH),d=Math.min(l*c,this.viewW),f=new Int32Array(u*d);for(let p=0;p<u;p++){const v=(r+at(p,c))*e+o;for(let m=0;m<d;m++)f[p*d+m]=n(v+at(m,c))}return{h:u,w:d,data:f}}zoomIn(){this.zoomLevel<ts&&(this.zoomLevel+=1),this.invalidate()}zoomOut(){if(this.zoomLevel>li){const t=this.zoomLevel-1,e=t>=0?1:1<<-t;(t>=0||this.viewH*e<=this.worldH&&this.viewW*e<=this.worldW)&&(this.zoomLevel=t)}this.invalidate()}autoFocus(){const t=this.worldH,e=this.worldW;let n=0,i=0;for(let B=0;B<this.age.length;B++){const q=this.age[B]??0;q>=1&&q<=10&&n++,this.grid[B]&&i++}const r=n>=5;if((r?n:i)===0)return;const o=B=>{const q=this.age[B]??0;return r?q>=1&&q<=10:this.grid[B]!==0},a=16,l=at(t,a),c=at(e,a);if(l<1||c<1)return;const h=new Float64Array(l*c);for(let B=0;B<l*a;B++)for(let q=0;q<c*a;q++){if(!o(B*e+q))continue;const et=at(B,a)*c+at(q,a);h[et]=(h[et]??0)+1}const u=bf(h,l,c);let d=-1,f=0;for(let B=0;B<u.length;B++){const q=u[B]??0;q>d&&(d=q,f=B)}const p=at(f,c)*a+at(a,2),v=f%c*a+at(a,2),m=a*2,g=Math.max(0,p-m),x=Math.min(t,p+m),w=Math.max(0,v-m),M=Math.min(e,v+m),E=[],b=[];for(let B=g;B<x;B++)for(let q=w;q<M;q++)o(B*e+q)&&(E.push(B-g),b.push(q-w));if(!E.length)return;const R=Int32Array.from(b).sort(),_=ci(E,10),T=ci(E,90),L=ci(R,10),D=ci(R,90),U=Math.max(4,T-_+1),G=Math.max(4,D-L+1),K=g+at(_+T,2),N=w+at(L+D,2);let W=li;for(let B=ts;B>=li;B--){const q=2**B;if(U<=this.viewH/q*.6&&G<=this.viewW/q*.6){W=B;break}}this.zoomLevel=hn(W,li,ts),this.camY=hn(K-at(this.viewH,2),0,this.worldH-this.viewH),this.camX=hn(N-at(this.viewW,2),0,this.worldW-this.viewW),this.autoCam=!1,this.invalidate()}pan(t,e){this.autoCam=!1;const n=2**-this.zoomLevel,i=t!==0?Math.max(1,Math.trunc(Math.abs(t)*n))*Math.sign(t):0,r=e!==0?Math.max(1,Math.trunc(Math.abs(e)*n))*Math.sign(e):0;this.camY=hn(this.camY+i,0,this.worldH-this.viewH),this.camX=hn(this.camX+r,0,this.worldW-this.viewW),this.invalidate()}home(){this.autoCam=!0,this.zoomLevel=0,this.invalidate()}clear(){this.grid.fill(0),this.age.fill(0),this.ageSmooth.fill(0),this.generation=0,this.popHistory=[],this.hashHistory=[],this.invalidate()}takeCensus(){const t=this.rawViewGrid();let e=!1;for(let l=0;l<t.data.length;l++)if(t.data[l]){e=!0;break}let n=new Map;if(!e)this.lastCensusSites=[];else try{const l=gf(t.data,t.h,t.w);if(!l)this.lastCensusSites=[];else{const[c,h]=this.clampCam();this.lastCensusSites=l.sites.map(([u,d,f])=>[u,c+d,h+f]),n=l.counts}}catch{}if(this.lastCensus=n,!n.size||this.generation-this.lastSightingGen<600)return;let i="",r=0;for(const[l,c]of n){if(c<(_f[l]??1)||this.generation-(this.sightingGen.get(l)??-1e9)<1800)continue;const h=Wo[l]??0;h>r&&(r=h,i=l)}if(!i)return;const o=vf[i]??[],a=this.sightingCount.get(i)??0;this.sightingCount.set(i,a+1),this.ticker.queueSpecial(o[a%o.length]??i),this.sightingGen.set(i,this.generation),this.lastSightingGen=this.generation}snapshot(){return{h:this.worldH,w:this.worldW,age:this.age.slice(),generation:this.generation,totalInjections:this.totalInjections}}adopt(t){const e=Math.min(this.worldH,t.h),n=Math.min(this.worldW,t.w),i=at(t.h-e,2),r=at(t.w-n,2),o=at(this.worldH-e,2),a=at(this.worldW-n,2);this.grid.fill(0),this.age.fill(0);let l=0;for(let c=0;c<e;c++)for(let h=0;h<n;h++){let u=t.age[(i+c)*t.w+r+h]??0;u<-Wn&&(u=0);const d=(o+c)*this.worldW+a+h;this.age[d]=u,u>0&&(this.grid[d]=1,l++)}this.generation=Math.max(0,Math.trunc(t.generation)),this.totalInjections=Math.max(0,Math.trunc(t.totalInjections)),this.ageSmooth.fill(0),this.activity.fill(0),this.hashHistory=[],this.cachedPop=l,this.popHistory=[l],this.stepBbox=null,this.dramaUntil=0,this.invalidate()}toggleHaunted(){if(this.haunted=!this.haunted,this.invalidate(),!this.haunted)for(let t=0;t<this.age.length;t++)(this.age[t]??0)<0&&(this.age[t]=0),(this.ageSmooth[t]??0)<0&&(this.ageSmooth[t]=0)}termToWorld(t,e,n=0){const[i,r]=this.viewCenter(),o=t*2+n,a=e;if(this.zoomLevel<=0){const u=1<<-this.zoomLevel,d=i-at(this.viewH*u,2),f=r-at(this.viewW*u,2);return[d+o*u,f+a*u]}const l=1<<this.zoomLevel,c=i-at(Math.max(2,at(this.viewH,l)),2),h=r-at(Math.max(2,at(this.viewW,l)),2);return[c+at(o,l),h+at(a,l)]}toggleCell(t,e,n=0){const[i,r]=this.termToWorld(t,e,n);this.setCell(i,r,this.grid[i*this.worldW+r]?0:1)}setCell(t,e,n){if(t<0||t>=this.worldH||e<0||e>=this.worldW)return;const i=t*this.worldW+e;this.grid[i]=n,this.age[i]=n?1:0,this.invalidate()}tickTicker(t){this.ticker.tick(t,this.detectMood(),this.generation)}detectMood(){return this.cachedMoodGen===this.generation?this.cachedMood:(this.cachedMood=this.computeMood(),this.cachedMoodGen=this.generation,this.cachedMood)}computeMood(){if(this.haunted)return"haunted";if(this.lastEvent&&this.generation-this.lastEventGen<90)return"injection";if(this.cyclePeriod>0)return"cycle";if(this.generation>=1e4&&this.generation%1e4<120)return"milestone";const t=this.popHistory,e=t.length;if(e>=30){let r=0,o=0;for(let l=e-30;l<e-15;l++)r+=t[l]??0;for(let l=e-15;l<e;l++)o+=t[l]??0;const a=o/15/Math.max(r/15,1);if(a>1.15)return"booming";if(a<.85)return"declining"}const n=e?t[e-1]??0:0;return n/Math.max(this.viewH*this.viewW,1)>.15?"dense":n<this.popFloor&&n>0?"sparse":this.spread<Math.max(8,at(this.popFloor,8))&&e>=150?"stagnant":""}epoch(){var e;let t=((e=zc[0])==null?void 0:e[1])??"genesis";for(const[n,i]of zc)this.generation>=n&&(t=i);return t}population(){return this.cachedPop}activityCenterX(){const[t,e]=this.clampCam();let n=0,i=0;for(let r=0;r<this.viewH;r++){const o=(t+r)*this.worldW+e;for(let a=0;a<this.viewW;a++){const l=this.activity[o+a]??0;n+=l,i+=l*a}}return n<1||this.viewW<2?.5:i/n/(this.viewW-1)}viewportActivity(){const[t,e]=this.clampCam();let n=0;for(let i=0;i<this.viewH;i++){const r=(t+i)*this.worldW+e;for(let o=0;o<this.viewW;o++)n+=this.activity[r+o]??0}return n}timeDilation(){if(!this.autoCam)return 1;const t=this.viewportActivity();if(this.actBaseline<=0)return this.actBaseline=Math.max(t,1),1;const e=t>this.actBaseline?.015:.003;this.actBaseline=this.actBaseline*(1-e)+t*e;const n=t/Math.max(this.actBaseline,1);let i=n>1?Math.min(1.6,1+(n-1)*.7):.7+n*.3;return t<60&&(i=Math.min(i,.7)),this.dilation=this.dilation*.85+i*.15,this.dilation}sparkline(t=24){const e=this.popHistory;if(e.length<2)return"";const n=Math.max(0,e.length-t);let i=e[n]??0,r=i;for(let c=n;c<e.length;c++){const h=e[c]??0;h<i&&(i=h),h>r&&(r=h)}const o=Ys.length-1,a=Ys[Math.floor(Ys.length/2)]??"▅";let l="";for(let c=n;c<e.length;c++){const h=e[c]??0;l+=r===i?a:Ys[Math.trunc((h-i)/(r-i)*o)]??""}return l}}const wf=[[0,0,0],[205,0,0],[0,205,0],[205,205,0],[0,0,238],[205,0,205],[0,205,205],[229,229,229],[127,127,127],[255,0,0],[0,255,0],[255,255,0],[92,92,255],[255,0,255],[0,255,255],[255,255,255]],$o=[0,95,135,175,215,255];function is(s){if(s<16)return[...wf[s]??[0,0,0]];if(s<232){const e=s-16;return[$o[Math.floor(e/36)]??0,$o[Math.floor(e/6)%6]??0,$o[e%6]??0]}const t=8+(s-232)*10;return[t,t,t]}function Ii(s){return(255<<24|s[2]<<16|s[1]<<8|s[0])>>>0}function Gc(s){return`rgb(${s[0]},${s[1]},${s[2]})`}const Xo=[10,10,12],Ef="rgb(200,200,200)",ss="rgb(112,112,116)",Vc=ai.length,rs=ai.map(s=>Ii(is(s))),Yo=Rn.map(s=>Ii(is(s))),Wc=tf.map(([s,t])=>[Ii(is(s)),Ii(is(t))]),Tf=ef.map(([s,t])=>[Ii(is(s)),Ii(is(t))]),Er=Ii(Xo),Af='ui-monospace, "SF Mono", "Cascadia Mono", "DejaVu Sans Mono", Menlo, Consolas, monospace';let Tr=null;function Cf(s){if(Tr&&Tr.maxAge===s)return Tr.table;const t=new Uint8Array(s+1),e=Math.log1p(s);for(let n=1;n<=s;n++)t[n]=Math.min(Math.trunc(Math.log1p(n)/e*(Vc-1)),Vc-1);return Tr={maxAge:s,table:t},t}function Ks(s){return s.toLocaleString("en-US")}class Rf{constructor(t){A(this,"cw",8);A(this,"cols",80);A(this,"rows",24);A(this,"statusRows",1);A(this,"keys",!0);A(this,"img",null);A(this,"widths",new Map);A(this,"px",null);A(this,"off",null);this.ctx=t}get gridRows(){return Math.max(1,this.rows-this.statusRows)}resize(t,e,n){this.cw=Math.max(2,Math.round(n)),this.cols=Math.max(20,Math.floor(t/this.cw)),this.rows=Math.max(6,Math.floor(e/(this.cw*2))),this.statusRows=this.cols>=150?1:2,this.keys=this.cols>=150,this.img=null,this.widths.clear()}status(t,e){const n=t.sparkline(this.cols<100?10:24),i=t.autoCam?"auto":"pan",r=rf[t.zoomLevel]??`${2**t.zoomLevel}x`,o=t.autoFocusMode?"[F]":"",a=t.haunted?"[HAUNTED]":"",l=e?` ${e}`:"",c=`  ${t.epoch()}  gen ${Ks(t.generation)}  pop ${Ks(t.population())}  ${n}`,h=this.keys?"  q r spc +/- arrows h z/x f g s  ":"  ",u=`${l} ${a}${o} ${r} ${i}${h}`;return this.statusRows===1?{left:c,right:u,tickerCol:Pn(c)+1,tickerWidth:this.cols-Pn(c)-Pn(u)-2}:{left:c,right:u,tickerCol:1,tickerWidth:this.cols-2}}render(t,e,n){const i=this.ctx,r=this.cw,o=this.cols*r,a=this.rows*r*2;i.fillStyle=Gc(Xo),i.fillRect(0,0,o,a),this.paintGrid(t),i.font=`${Math.round(r*1.62)}px ${Af}`,i.textBaseline="middle",n&&this.statsOverlay(t);const l=this.rows-1;if(this.statusRows===1)if(e.tickerWidth<10)this.text(`${e.left}  ${e.right}`.slice(0,this.cols-1),l,0,ss);else{this.text(e.left,l,0,ss),this.ticker(t,l,e);const c=this.cols-Pn(e.right);this.text([...e.right].slice(0,this.cols-1-c).join(""),l,c,ss)}else{const c=this.cols-1,h=Pn(e.left)+Pn(e.right)<=c?e.left+" ".repeat(c-Pn(e.left)-Pn(e.right))+e.right:`${e.left}  ${e.right}`;this.text([...h].slice(0,c).join(""),l-1,0,ss),this.ticker(t,l,e)}}paintGrid(t){const e=t.displayGrid(),n=t.displayAge(),i=Math.min(Math.floor(e.h/2),Math.floor(n.h/2),this.gridRows),r=Math.min(e.w,n.w,this.cols),o=this.cols,a=this.gridRows*2;(!this.img||this.img.width!==o||this.img.height!==a)&&(this.img=new ImageData(o,a),this.px=new Uint32Array(this.img.data.buffer),this.off=typeof OffscreenCanvas<"u"?new OffscreenCanvas(o,a):Object.assign(document.createElement("canvas"),{width:o,height:a}));const l=this.px;l.fill(Er);let c=1;for(let E=0;E<n.data.length;E++)(n.data[E]??0)>c&&(c=n.data[E]??0);const h=Cf(c),u=t.haunted,d=t.zoomLevel>=0||u,f=u?Di:Wn,p=E=>Math.min(Math.max(-E-1,0),f-1),v=E=>h[Math.min(Math.max(E,0),c)]??0,m=E=>{var b;return u?((b=Wc[E])==null?void 0:b[0])??0:Yo[E]??0},g=E=>{var b;return u?((b=Wc[E])==null?void 0:b[1])??0:Er};for(let E=0;E<i;E++){const b=2*E*e.w,R=b+e.w,_=2*E*n.w,T=_+n.w,L=2*E*o,D=L+o;for(let U=0;U<r;U++){const G=(e.data[b+U]??0)>0,K=(e.data[R+U]??0)>0,N=n.data[_+U]??0,W=n.data[T+U]??0,B=d&&N<0,q=d&&W<0;if(!(G||K||B||q))continue;let et=Er,ot=Er;if((G||B)&&(K||q))if(G&&K)et=rs[v(N)]??0,ot=rs[v(W)]??0;else if(B&&q){const lt=p(N),ft=p(W);if(u){const $t=Tf[lt*Di+ft];et=($t==null?void 0:$t[0])??0,ot=($t==null?void 0:$t[1])??0}else et=Yo[lt]??0,ot=Yo[ft]??0}else G?et=rs[v(N)]??0:ot=rs[v(W)]??0;else if(G)et=rs[v(N)]??0;else if(K)ot=rs[v(W)]??0;else if(B){const lt=p(N);et=m(lt),ot=g(lt)}else{const lt=p(W);ot=m(lt),et=g(lt)}l[L+U]=et,l[D+U]=ot}}const x=this.off,w=x.getContext("2d");if(!w||!this.img)return;w.putImageData(this.img,0,0);const M=this.ctx;M.imageSmoothingEnabled=!1,M.drawImage(x,0,0,o*this.cw,a*this.cw)}ticker(t,e,n){const i=Hc.dim(t.generation)?ss:Ef;for(const r of t.ticker.messages){const o=Math.trunc(r.x),a=[...r.text],l=Math.max(o,0),c=Math.min(o+a.length,n.tickerWidth);l>=c||this.text(a.slice(l-o,c-o).join(""),e,n.tickerCol+l,i)}}statsOverlay(t){const e=t.lastCensus.size?[...t.lastCensus.entries()].sort((c,h)=>h[1]-c[1]).map(([c,h])=>`${h}×${c}`).join(" "):"none",n=36,i=11,r=this.cols-n-2,o=this.rows-(this.statusRows-1)-i-2;if(r<0||o<0)return;const a=["─".repeat(n-2)," infinity engine",` pop floor  : ${Ks(t.popFloor)}`,` spread/150 : ${Ks(t.spread)}`,` cycle       : ${t.cyclePeriod===0?"none":`period ${t.cyclePeriod}`}`,` injections  : ${t.totalInjections}`,` last event  : ${t.lastEvent||"none"}`,t.lastEvent?`   @ gen     : ${Ks(t.lastEventGen)}`:"               ",` world       : ${t.worldH}x${t.worldW}`,` census      : ${[...e].slice(0,n-16).join("")}`,` tempo       : ${(1/Math.max(t.dilation,.01)).toFixed(2)}x`],l=this.ctx;l.fillStyle=Gc(Xo),l.fillRect(r*this.cw,o*this.cw*2,n*this.cw,a.length*this.cw*2),a.forEach((c,h)=>{const u=[...` ${c}`.padEnd(n)].slice(0,n).join("");this.text(u,o+h,r,ss)})}text(t,e,n,i){const r=this.ctx,o=this.cw,a=e*o*2;r.fillStyle=i;let l=n;for(const c of t){if(l>=this.cols)break;if(l>=0&&c!==" "){const h=Ys.indexOf(c);if(h>=0){const u=Math.max(1,Math.round(o*2*(h+1)/8));r.fillRect(l*o,a+o*2-u,o,u)}else if(c==="─")r.fillRect(l*o,a+o-Math.max(1,Math.round(o/8))/2,o,Math.max(1,Math.round(o/8)));else{let u=this.widths.get(c);u===void 0&&(u=r.measureText(c).width,this.widths.set(c,u)),r.fillText(c,l*o+o/2-u/2,a+o)}}l++}}}const Ut=512,Xt=384,te='"Libertinus Mono", "LibertinusMono", ui-monospace, monospace',$c='"Love Letter Typewriter", "Libertinus Mono", monospace';function Pf(s,t,e){t();const n=typeof document<"u"?document.fonts:void 0,i=(Array.isArray(s)?s:[s]).filter(r=>n&&!n.check(r));!n||!i.length||Promise.all(i.map(r=>n.load(r))).then(()=>{t(),e==null||e()},()=>{})}let qo=0;try{(Gd=document.fonts)==null||Gd.addEventListener("loadingdone",()=>qo++)}catch{}class vn{constructor(t,e){A(this,"canvas");A(this,"ctx");A(this,"fps",15);A(this,"idleFps",0);A(this,"settled",!1);A(this,"acc",1);A(this,"since",0);A(this,"lastKey",null);A(this,"keyEpoch",-1);A(this,"keyed",!1);A(this,"version",0);this.site=t,this.env=e,this.canvas=document.createElement("canvas"),this.canvas.width=Ut,this.canvas.height=Xt;const n=this.canvas.getContext("2d",{alpha:!1});if(!n)throw new Error("oikos: no 2d context");this.ctx=n}tick(t,e,n,i=1,r=!1){this.acc+=e,this.since+=e;const o=!n&&!r&&this.settled&&this.idleFps>0,l=1/(n?Math.max(this.fps,30):Math.min(o?this.idleFps:this.fps,this.fps*i));if(this.acc<l-1e-4)return!1;this.acc=this.acc-l>l?0:this.acc-l;const c=this.since;this.since=0,this.keyed=!1;const h=this.draw(t,c);return this.keyed||(this.lastKey=null),h===!1?!1:(this.version++,!0)}unchanged(...t){const e=this.lastKey,n=e!==null&&this.keyEpoch===qo&&e.length===t.length&&t.every((i,r)=>Object.is(i,e[r]));return this.lastKey=t,this.keyEpoch=qo,this.keyed=!0,n}clear(t){this.ctx.fillStyle=t,this.ctx.fillRect(0,0,Ut,Xt)}wrap(t,e,n=1/0){const i=this.ctx,r=t.split(/\s+/).filter(Boolean),o=[];let a="";for(const l of r){const c=a?`${a} ${l}`:l;if(i.measureText(c).width>e&&a){if(o.push(a),a=l,o.length>=n)break}else a=c}if(a&&o.length<n&&o.push(a),o.length===n&&o.join(" ").length<r.join(" ").length){let l=o[n-1]??"";for(;l&&i.measureText(`${l}…`).width>e;)l=l.replace(/\s*\S*$/,"");o[n-1]=`${l}…`}return o}condensed(t,e,n,i=.72,r="left"){const o=this.ctx;o.save(),o.translate(e,n),o.scale(i,1),o.textAlign=r,o.fillText(t,0,0),o.restore()}spaced(t,e,n,i,r="left"){const o=this.ctx,a=[...t],l=a.map(u=>o.measureText(u).width),c=l.reduce((u,d)=>u+d,0)+i*(a.length-1);let h=r==="center"?e-c/2:e;o.save(),o.textAlign="left",a.forEach((u,d)=>{o.fillText(u,h,n),h+=(l[d]??0)+i}),o.restore()}}function Ko(s){let t=2166136261;for(let e=0;e<s.length;e++)t^=s.charCodeAt(e),t=Math.imul(t,16777619);return(t>>>0)%1e5/1e5}function Ui(s){let t=s>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Lf(s){return Math.round(s).toLocaleString("en-US")}const Xc=15,Df={minH:0,minW:0};class If extends vn{constructor(e,n){super(e,n);A(this,"term");A(this,"life",null);A(this,"seenSave");A(this,"genAcc",1/Xc);this.fps=15,this.term=new Rf(this.ctx),this.term.resize(Ut,Xt,8)}sync(){var r;const e=this.env.feeds.universe.value;if(this.life&&(e==null?void 0:e.savedAt)===((r=this.seenSave)==null?void 0:r.savedAt))return;this.seenSave=e;const n=e?cf():null,i=new Sf(this.term.gridRows,this.term.cols,!n,Df);n&&(i.adopt(n),i.ticker.queueSpecial(`the universe remembers generation ${i.generation.toLocaleString("en-US")}`)),this.life=i}draw(e,n){this.sync();const i=this.life;if(!i)return!1;const r=1/Xc;if(this.genAcc+=n,this.genAcc<r)return!1;this.genAcc=Math.min(this.genAcc-r,r),i.step(),i.generation>0&&i.generation%150===0&&i.takeCensus();const o=this.term.status(i,"");return o.tickerWidth>=10&&i.tickTicker(o.tickerWidth),this.term.render(i,o,!1),!0}}const hi=62,Zs=21,Uf=Ut/hi,Nf=12.4,kf=42,Zo=" .,:;-=+*#%@";function Ff(){const s=[];for(let e=0;e<16;e++)s.push([e&1?1:-1,e&2?1:-1,e&4?1:-1,e&8?1:-1]);const t=[];for(let e=0;e<16;e++)for(let n=0;n<4;n++){const i=e^1<<n;if(i<e)continue;const r=s[e],o=s[i];if(!(!r||!o))for(let a=0;a<=18;a++){const l=a/18;t.push([r[0]+(o[0]-r[0])*l,r[1]+(o[1]-r[1])*l,r[2]+(o[2]-r[2])*l,r[3]+(o[3]-r[3])*l])}}return t}function Of(){const s=[];for(let e=0;e<44;e++)for(let n=0;n<44;n++){const i=e/44*Math.PI*2,r=n/44*Math.PI*2;s.push([Math.cos(i)*1.3,Math.sin(i)*1.3,Math.cos(r)*1.3,Math.sin(r)*1.3])}return s}const Jo=[Ff(),Of()];class Bf extends vn{constructor(e,n){super(e,n);A(this,"gen",null);A(this,"seq",0);A(this,"depth",new Float32Array(hi*Zs));A(this,"glyph",new Uint8Array(hi*Zs));this.fps=15}generate(e){const n=this.env.feeds.apeiron.value,i=Math.floor(Math.random()*2**31),r=Ui(i),{prompt:o,template:a}=n?zf(n,r):{prompt:"",template:"waking"},l=(i>>>0).toString(16).padStart(8,"0").replace(/(....)(....)/,"$1·$2");return{prompt:o,template:a,coordinate:l,hue:n?Math.floor(Ko(o)*360):135,figure:Jo[this.seq++%Jo.length]??Jo[0]??[],bornAt:e}}draw(e){(!this.gen||e-this.gen.bornAt>9||!this.gen.prompt&&this.env.feeds.apeiron.value)&&(this.gen=this.generate(e));const n=this.gen,i=this.ctx,r=`hsl(${n.hue} 100% 58%)`,o=`hsl(${n.hue} 100% 76%)`,a=`hsl(${n.hue} 60% 22%)`,l=i.createRadialGradient(Ut/2,Xt*.4,20,Ut/2,Xt*.4,Ut*.7);l.addColorStop(0,`hsl(${n.hue} 60% 7%)`),l.addColorStop(1,"#030309"),i.fillStyle=l,i.fillRect(0,0,Ut,Xt),i.font=`12px ${te}`,i.fillStyle=r,i.fillText("apeiron",14,22),i.fillStyle=a,i.fillText("·  æthera",76,22),i.textAlign="right",i.fillStyle=r,i.fillText(n.template.replace(/_/g," "),Ut-14,22),i.textAlign="left",this.raster(e,n.figure),i.font=`12px ${te}`;for(let d=0;d<Zs;d++)for(let f=0;f<hi;f++){const p=this.glyph[d*hi+f]??0;p&&(i.fillStyle=p>9?o:p>4?r:a,i.fillText(Zo[p]??".",f*Uf,kf+d*Nf+10))}const c=e-n.bornAt,h=n.prompt||"reading the grammar…";i.font=`12px ${te}`;const u=this.wrap(h.slice(0,Math.floor(c*70)),Ut-28,4);i.fillStyle="rgba(3,3,9,0.7)",i.fillRect(0,Xt-98,Ut,98),i.fillStyle=a,i.fillRect(14,Xt-98,Ut-28,1),i.fillStyle=o,u.forEach((d,f)=>i.fillText(d,14,Xt-78+f*15)),i.fillStyle=r,i.font=`11px ${te}`,i.fillText(`⌖ ${n.coordinate}`,14,Xt-12),i.fillStyle=a,i.textAlign="right",i.fillText("␣ generate   F keep   A auto",Ut-14,Xt-12),i.textAlign="left"}raster(e,n){this.depth.fill(-1/0),this.glyph.fill(0);const i=e*.45,r=e*.31,o=e*.23,[a,l,c,h,u,d]=[Math.cos(i),Math.sin(i),Math.cos(r),Math.sin(r),Math.cos(o),Math.sin(o)];for(const f of n){let[p,v,m,g]=f;[p,g]=[p*a-g*l,p*l+g*a],[v,m]=[v*c-m*h,v*h+m*c],[m,g]=[m*u-g*d,m*d+g*u];const x=2.6/(3.2-g);p*=x,v*=x,m*=x;const w=3.4/(4.6-m),M=Math.round(hi/2+p*w*11.5),E=Math.round(Zs/2+v*w*5.6);if(M<0||M>=hi||E<0||E>=Zs)continue;const b=E*hi+M;m>(this.depth[b]??-1/0)&&(this.depth[b]=m,this.glyph[b]=Math.max(1,Math.min(Zo.length-1,Math.round((m+2.2)/4.4*(Zo.length-1)))))}}}function zf(s,t){const e=s.templates[Math.floor(t()*s.templates.length)];return e?{prompt:e.structure.replace(/\{(\w+)\}/g,(i,r)=>{var a;const o=s.components[r];return o!=null&&o.length?((a=o[Math.floor(t()*o.length)])==null?void 0:a.word)??r:r.replace(/_/g," ")}),template:e.id}:{prompt:"",template:""}}const jo="#e8e2d4",Qo="#a39d90",Yc="#5d5850",Ni=34,os=250,ki=84,Ar=Xt-ki-22;class Hf extends vn{constructor(e,n){super(e,n);A(this,"standIn");this.fps=10,this.idleFps=4,this.settled=!0,this.standIn=Gf()}draw(e){const n=this.ctx;this.clear("#070707"),n.fillStyle=jo,n.font=`22px ${te}`,this.spaced("chronicle",Ut/2,38,11,"center"),n.fillStyle=Qo,n.font=`11px ${te}`,this.spaced("what the dream remembers",Ut/2,60,2,"center");const r=[...this.env.feeds.chronicle.value.strata].reverse();if(n.fillStyle="#000",n.fillRect(Ni-1,ki-1,os+2,Ar+2),n.imageSmoothingEnabled=!0,r.length){const l=r.map((u,d)=>Math.pow(.6,d)),c=l.reduce((u,d)=>u+d,0);let h=ki;r.forEach((u,d)=>{const f=Ar*(l[d]??0)/c;n.save(),n.translate(Ni,h+f),n.scale(1,-1),n.drawImage(u,0,0,os,f),n.restore(),h+=f,n.fillStyle="rgba(232,226,212,0.08)",n.fillRect(Ni,h,os,1)})}else n.globalAlpha=.75,n.drawImage(this.standIn,Ni,ki,os,Ar),n.globalAlpha=1;const o=ki+e*14%Ar,a=n.createLinearGradient(0,o-16,0,o+2);a.addColorStop(0,"rgba(232,226,212,0)"),a.addColorStop(1,"rgba(232,226,212,0.22)"),n.fillStyle=a,n.fillRect(Ni,o-16,os,18),n.fillStyle="rgba(232,226,212,0.5)",n.fillRect(Ni-6,o,4,1),this.log(e)}log(e){const n=this.ctx,i=this.env.feeds.chronicle.value,r=Ni+os+24,o=Ut-r-18;n.font=`11px ${te}`,n.fillStyle=Yc,n.fillText(i.known?`${i.eraCount||i.eras.length} eras`:"reading the core…",r,ki+8);const a=[...i.eras].reverse().slice(0,7);let l=ki+34;if(!a.length){n.fillStyle=Qo;for(const c of this.wrap("every fifteen seconds of the dream settles here as one line of its own colour.",o,6))n.fillText(c,r,l),l+=15;return}for(const c of a){if(l>Xt-30)break;const h=new Date(c.t0*1e3);n.fillStyle=c.open?jo:Yc,n.font=`10px ${te}`;const u=`${h.getHours().toString().padStart(2,"0")}:${h.getMinutes().toString().padStart(2,"0")}`;n.fillText(c.open?`${u}  now`:u,r,l),c.open&&(n.fillStyle=Math.sin(e*3)>0?"#d6c9a8":"#6d6555",n.fillRect(r-10,l-6,4,4)),n.font=`12px ${te}`,n.fillStyle=c.open?jo:Qo;const d=this.wrap(c.title||"untitled",o,2);d.forEach((f,p)=>n.fillText(f,r,l+15+p*14)),l+=22+d.length*14}}}function Gf(){const s=document.createElement("canvas");s.width=64,s.height=240;const t=s.getContext("2d");if(!t)return s;const e=Ui(1729),n=["#5c3b36","#7a4f45","#3f3a4c","#8a6f64","#2d4a4f","#6b2c3a","#a38a74","#40302c"];let i=n[0];for(let r=0;r<s.height;r++){e()<.12&&(i=n[Math.floor(e()*n.length)]??i),t.fillStyle=i,t.fillRect(0,r,s.width,1);for(let o=0;o<6;o++)t.fillStyle=`rgba(255,255,255,${e()*.08})`,t.fillRect(e()*s.width,r,e()*12,1)}return s}const Vf="#07050b",ta="#d59bff",Cr="#4d3a63",ea="#e9e0f5",Fi="#8a7b9e",ui={x:18,y:54,w:128,h:74,label:"KEYFRAME N-1"},qe={x:192,y:54,w:128,h:74,label:"KEYFRAME N"},di={x:366,y:54,w:128,h:74,label:"FRESH FRAME"},Oi={x:18,y:176,w:302,h:52,label:"INTERPOLATION"},Rr={x:340,y:150,w:154,h:104,label:"COLLAPSE PREVENTION"};class Wf extends vn{constructor(t,e){super(t,e),this.fps=15}box(t,e){const n=this.ctx;n.strokeStyle=e>0?ta:Cr,n.globalAlpha=.5+e*.5,n.lineWidth=1,n.strokeRect(t.x+.5,t.y+.5,t.w,t.h),n.globalAlpha=1,n.font=`10px ${te}`,n.fillStyle=e>0?ea:Fi,n.fillText(t.label,t.x+6,t.y+13)}arrow(t,e,n,i,r,o){const a=this.ctx;a.strokeStyle=Cr,a.beginPath(),a.moveTo(t,e),a.lineTo(n,i),a.stroke();const l=Math.sign(n-t||i-e);if(a.fillStyle=Cr,a.beginPath(),e===i?(a.moveTo(n,i),a.lineTo(n-6*l,i-4),a.lineTo(n-6*l,i+4)):(a.moveTo(n,i),a.lineTo(n-4,i-6*l),a.lineTo(n+4,i-6*l)),a.fill(),o>=0&&o<=1){const c=t+(n-t)*o,h=e+(i-e)*o,u=a.createRadialGradient(c,h,0,c,h,8);u.addColorStop(0,"rgba(213,155,255,1)"),u.addColorStop(1,"rgba(213,155,255,0)"),a.fillStyle=u,a.fillRect(c-8,h-8,16,16)}r&&(a.font=`9px ${te}`,a.fillStyle=Fi,a.textAlign="center",a.fillText(r,(t+n)/2,e===i?e-6:(e+i)/2),a.textAlign="left")}draw(t){const e=this.ctx,n=this.env.feeds.chronicle.value,i=6,r=t%i/i,o=400+Math.floor(t/i),a=Math.sin(t*.8)>.6?1:0,l=16,c=r>=.5?Math.floor((r-.5)/.5*l):0;if(r>=.5&&n.thumb&&this.unchanged(o,c,a,n))return!1;if(this.clear(Vf),e.font=`14px ${te}`,e.fillStyle=ta,e.fillText("dream_gen",18,28),e.font=`10px ${te}`,e.fillStyle=Fi,e.fillText("a truly infinite diffusion stream",110,28),e.textAlign="right",e.fillText(`kf ${String(o).padStart(5,"0")}`,Ut-18,28),e.textAlign="left",this.box(ui,r<.25?1:0),this.box(qe,r>=.25&&r<.5?1:.2),this.box(di,0),this.box(Oi,r>=.5?1:0),this.box(Rr,a),n.thumb)e.drawImage(n.thumb,qe.x+6,qe.y+18,qe.w-12,(qe.w-12)/2),e.globalAlpha=.35,e.drawImage(n.thumb,ui.x+6,ui.y+18,ui.w-12,(ui.w-12)/2),e.globalAlpha=1;else for(const d of[ui,qe]){const f=e.createLinearGradient(d.x,d.y,d.x+d.w,d.y+d.h);f.addColorStop(0,`hsl(${(t*8+d.x)%360} 40% 30%)`),f.addColorStop(1,`hsl(${(t*8+d.x+90)%360} 40% 18%)`),e.fillStyle=f,e.fillRect(d.x+6,d.y+18,d.w-12,(d.w-12)/2)}e.fillStyle="#1b1426",e.fillRect(di.x+6,di.y+18,di.w-12,(di.w-12)/2),e.fillStyle=Fi,e.font=`9px ${te}`,e.fillText("txt2img on swap",di.x+10,di.y+50),this.arrow(ui.x+ui.w,91,qe.x,91,"img2img",r<.25?r/.25:-1),this.arrow(di.x,91,qe.x+qe.w,91,"",-1),this.arrow(qe.x+qe.w/2,qe.y+qe.h,qe.x+qe.w/2,Oi.y,"",r>=.25&&r<.5?(r-.25)/.25:-1);for(let d=0;d<l;d++)e.fillStyle=d<c?ta:"#1e1629",e.fillRect(Oi.x+8+d*18,Oi.y+22,14,18);e.fillStyle=Fi,e.font=`9px ${te}`,e.textAlign="right",e.fillText(`${c}/${l} → stream`,Oi.x+Oi.w-6,Oi.y+13),e.textAlign="left",[["1 mutation","BEND 0.7"],["2 cache","blend ~60%"],["3 swap","fresh txt2img"]].forEach(([d,f],p)=>{const v=Rr.y+34+p*22;e.fillStyle=ea,e.font=`10px ${te}`,e.fillText(d,Rr.x+8,v),e.fillStyle=Fi,e.fillText(f,Rr.x+78,v)}),e.fillStyle="rgba(20,12,30,0.8)",e.fillRect(0,Xt-110,Ut,110),e.fillStyle=Cr,e.fillRect(18,Xt-110,Ut-36,1),e.font=`10px ${te}`,e.fillStyle=Fi,e.fillText(n.prompt?`prompt${n.template?` · ${n.template}`:""}`:"prompt",18,Xt-92),e.font=`12px ${te}`,e.fillStyle=ea;const u=n.prompt||"the dreamer is asleep; its last prompt will appear here when the chronicle has one.";this.wrap(u,Ut-36,5).forEach((d,f)=>e.fillText(d,18,Xt-72+f*15))}}const Js=new Image;Js.src="/static/oikos/stage.jpg";const un=372,dn=186,qc=(Ut-un)/2,Kc=118;class $f extends vn{constructor(e,n){super(e,n);A(this,"frame",document.createElement("canvas"));A(this,"fctx");A(this,"prev",null);A(this,"cur",null);A(this,"swapAt",0);this.fps=20,this.idleFps=5,this.frame.width=un,this.frame.height=dn;const i=this.frame.getContext("2d");if(!i)throw new Error("oikos: no 2d context");this.fctx=i}draw(e){const n=this.ctx;this.clear("#120406"),Js.complete&&Js.naturalWidth&&(n.globalAlpha=.95,n.drawImage(Js,0,0,Ut,Xt),n.globalAlpha=1);const i=this.env.feeds.chronicle.value;i.thumb&&i.thumb!==this.cur&&(this.prev=this.cur,this.cur=i.thumb,this.swapAt=e);const r=this.fctx;if(r.globalCompositeOperation="source-over",r.globalAlpha=1,this.cur){const a=Math.min(1,(e-this.swapAt)/2.5);this.prev&&a<1&&this.kenBurns(this.prev,e-20),r.globalAlpha=this.prev?a:1,this.kenBurns(this.cur,e),r.globalAlpha=1,this.settled=a>=1&&Js.complete}else this.standIn(e),this.settled=!1;const o=r.createRadialGradient(un/2,dn/2,dn*.25,un/2,dn/2,un*.56);o.addColorStop(0,"rgba(0,0,0,1)"),o.addColorStop(.72,"rgba(0,0,0,0.9)"),o.addColorStop(1,"rgba(0,0,0,0)"),r.globalCompositeOperation="destination-in",r.fillStyle=o,r.fillRect(0,0,un,dn),r.globalCompositeOperation="source-over",n.save(),n.globalCompositeOperation="lighter",n.globalAlpha=.18,n.drawImage(this.frame,qc-30,Kc+dn-20,un+60,90),n.restore(),n.drawImage(this.frame,qc,Kc),this.status(e),n.fillStyle="rgba(8,4,4,0.72)",n.fillRect(0,Xt-34,Ut,34),n.fillStyle="#efe6d2",n.font=`12px ${te}`,this.spaced("NOW SHOWING · A DREAM · ALL NIGHT",Ut/2,Xt-13,3,"center")}kenBurns(e,n){const i=1.06+.05*Math.sin(n*.07),r=Math.sin(n*.05)*10,o=Math.cos(n*.043)*5,a=un*i,l=dn*i;this.fctx.drawImage(e,(un-a)/2+r,(dn-l)/2+o,a,l)}standIn(e){const n=this.fctx,i=n.createLinearGradient(0,0,0,dn);i.addColorStop(0,"#3a2440"),i.addColorStop(1,"#170d1c"),n.fillStyle=i,n.fillRect(0,0,un,dn);const r=[12,330,280,20,350];for(let o=0;o<5;o++){const a=e*(.11+o*.03)+o*1.7,l=un/2+Math.cos(a)*(60+o*14)*(o%2?1:-1),c=dn/2+Math.sin(a*1.3)*30,h=52+22*Math.sin(a*.7+o),u=n.createRadialGradient(l,c,0,l,c,h);u.addColorStop(0,`hsla(${r[o]} 90% 66% / 0.75)`),u.addColorStop(1,`hsla(${r[o]} 90% 50% / 0)`),n.fillStyle=u,n.fillRect(0,0,un,dn)}}status(e){const n=this.ctx,i=this.env.feeds.dreams.value,r=this.env.feeds.chronicle.value;n.font=`12px ${te}`;let o,a;i.known&&i.awake?(a=Math.sin(e*4)>0?"#ff3b3b":"#6a1010",o=`LIVE  frame ${Lf(i.frame)}${i.viewers?`  ·  ${i.viewers} watching`:""}`):i.known?(a="#5a5a5a",o=r.thumb?"asleep  ·  last remembered":"asleep  ·  wakes when watched"):(a="#3a3a3a",o=r.thumb?"last remembered":"no signal  ·  a stand-in");const l=n.measureText(o).width+34;n.fillStyle="rgba(0,0,0,0.55)",n.fillRect(14,14,l,24),n.fillStyle=a,n.beginPath(),n.arc(27,26,4.5,0,Math.PI*2),n.fill(),n.fillStyle="#f2e9dc",n.fillText(o,38,30)}}const Xf="#04060c",Zc="#9fc6ff",js="#3d5378",Qs="#c9d1d9",Yf="#a5e3b5",na="#ffc387",Jc=[["GET","/api/dreams/status","how it is (never wakes it)"],["WS ","/ws/dreams","the dream itself, h264"],["GET","/api/dreams/stream","MPEG-TS"],["SSE","/api/dreams/sse","events"],["GET","/api/dreams/embed","take it with you"]];class qf extends vn{constructor(e,n){super(e,n);A(this,"askedAt",-10);A(this,"lastRaw");this.fps=12}draw(e){const n=this.ctx,i=this.env.feeds.dreams.value.raw;i!==this.lastRaw&&(this.lastRaw=i,this.askedAt=e);const r=e-this.askedAt,o=`curl -s ${location.host}/api/dreams/status`,a=o.slice(0,Math.floor(r*38)),l=a.length<o.length||Math.floor(e*2)%2===1,c=Math.min(12,Math.floor((r-o.length/38)*30)),h=Math.floor(e/2.5)%Jc.length;if(this.unchanged(i,a.length,l,c,h))return!1;this.clear(Xf),n.font=`13px ${te}`,n.fillStyle=js,n.fillText("$",16,28),n.fillStyle=Zc,n.fillText(a+(l?"▌":""),32,28),a.length>=o.length&&(i?Kf(i,11):[[{text:"curl: (52) the dream did not answer",color:"#e58a8a"}]]).slice(0,c).forEach((f,p)=>{let v=16;for(const m of f)n.fillStyle=m.color,n.fillText(m.text,v,52+p*17),v+=n.measureText(m.text).width});const u=Xt-128;n.fillStyle="rgba(159,198,255,0.06)",n.fillRect(10,u-20,Ut-20,138),n.strokeStyle="rgba(159,198,255,0.25)",n.strokeRect(10.5,u-19.5,Ut-21,137),n.font=`11px ${te}`,n.fillStyle=js,n.fillText("ENDPOINTS",20,u-4),Jc.forEach(([d,f,p],v)=>{const m=u+16+v*19;n.fillStyle=h===v?na:js,n.fillText(d,20,m),n.fillStyle=h===v?"#ffffff":Zc,n.fillText(f,58,m),n.fillStyle=js,n.fillText(p,250,m)})}}function Kf(s,t){const e=[],n=(i,r,o,a)=>{if(e.length>=t)return;const l=[{text:r,color:Qs}];o!==null&&l.push({text:`"${o}": `,color:Qs});const c=a?"":",";if(i&&typeof i=="object"&&!Array.isArray(i)){const d=Object.entries(i);e.push([...l,{text:"{",color:Qs}]),d.forEach(([f,p],v)=>n(p,`${r}  `,f,v===d.length-1)),e.length<t&&e.push([{text:`${r}}${c}`,color:Qs}]);return}let h,u;typeof i=="string"?(h=`"${i}"`,u=Yf):Array.isArray(i)?(h=JSON.stringify(i),u=na):(h=String(i),u=na),e.push([...l,{text:h,color:u},{text:c,color:Qs}])};return n(s,"",null,!0),e.length>=t&&(e[t-1]=[{text:"  …",color:js}]),e}const Be={bg:"#181522",screen:"#231f36",fg:"#c9d1d9",dim:"#6e7681",sys:"#8b949e",quit:"#f85149",action:"#a371f7",join:"#3fb950"},jc=["#58a6ff","#3fb950","#d29922","#a371f7","#f778ba","#39c5cf","#ff7b72","#7ee787","#ffa657","#79c0ff","#d2a8ff","#56d364"];function Zf(s){let t=0;for(const e of s)t=t*31+e.charCodeAt(0)>>>0;return jc[t%jc.length]??Be.fg}function Jf(s){const t=[{text:`[${s.stamp}] `,color:Be.dim}],e=s.nick,n=s.content;switch(s.type){case"message":t.push({text:`<${e}> `,color:Zf(e)},{text:n,color:Be.fg});break;case"action":t.push({text:`* ${e} ${n}`,color:Be.action});break;case"quit":t.push({text:`⫫ ${e} has quit${n?` (${n})`:""}`,color:Be.quit});break;case"part":t.push({text:`← ${e} has left${n?` (${n})`:""}`,color:Be.sys});break;case"join":t.push({text:`→ ${e} has joined`,color:Be.join});break;case"kick":{const i=s.reason||n;t.push({text:`⚠ ${s.target?`${s.target} was kicked by ${e}`:`${e} kicked someone`}${i?` (${i})`:""}`,color:Be.quit})}break;default:t.push({text:`*** ${n||e}`,color:Be.sys})}return t}const Qc=16,as=16,ia=50;class jf extends vn{constructor(e,n){super(e,n);A(this,"laidOut",[]);A(this,"seen",-1);this.fps=15}layout(){const e=this.env.feeds.irc.value;e.version!==this.seen&&(this.seen=e.version,this.ctx.font=`12.5px ${te}`,this.laidOut=e.lines.map(n=>({rows:this.wrapChunks(Jf(n),Ut-as*2),at:n.at})))}wrapChunks(e,n){var a;const i=this.ctx,r=[[]];let o=0;for(const l of e)for(const c of l.text.split(/(\s+)/)){if(!c)continue;const h=i.measureText(c).width;o+h>n&&o>0&&c.trim()&&(r.push([{text:"    ",color:l.color}]),o=i.measureText("    ").width),(a=r[r.length-1])==null||a.push({text:c,color:l.color}),o+=h}return r}draw(e){var p;this.layout();const n=this.ctx,i=this.env.feeds.irc.value,r=Math.sin(e*3)>-.3,o=performance.now(),a=this.laidOut.length>0&&o-(((p=this.laidOut[this.laidOut.length-1])==null?void 0:p.at)??0)<600;if(!i.collapse&&!a&&this.unchanged(i,r))return!1;this.clear(Be.bg),n.fillStyle=Be.screen,n.fillRect(6,6,Ut-12,Xt-12),n.fillStyle="rgba(88,166,255,0.1)",n.fillRect(6,6,Ut-12,28),n.font=`13px ${te}`,n.fillStyle="#58a6ff",n.fillText("#aethera",as,25),n.fillStyle=Be.dim,n.font=`11px ${te}`,n.textAlign="right";const l=i.connected?r?"● live":"○ live":"○ connecting…";n.fillStyle=i.connected?Be.join:Be.dim,n.fillText(l,Ut-as,25),n.textAlign="left";const c=i.collapse?Math.min(1,(performance.now()-i.collapse.at)/1500):0;n.font=`12.5px ${te}`;const h=[],u=performance.now();for(const v of this.laidOut)for(const m of v.rows)h.push({chunks:m,fresh:Math.max(0,1-(u-v.at)/600)});const d=Math.floor((Xt-ia-12)/Qc),f=h.slice(-d);f.length||(n.fillStyle=Be.sys,n.fillText(i.connected?"*** the channel is quiet between fragments":"*** connecting to #aethera…",as,ia+12)),f.forEach((v,m)=>{let g=as;const x=ia+12+m*Qc,w=c?Math.sin(x*.3+e*40)*8*c*(Math.random()<.3?1:0):0;for(const M of v.chunks)n.fillStyle=c>.2&&Math.random()<c*.4?Be.quit:M.color,n.globalAlpha=1-v.fresh*.6,n.fillText(M.text,g+w,x),g+=n.measureText(M.text).width;n.globalAlpha=1}),i.collapse&&(n.fillStyle=`rgba(248,81,73,${.08*c})`,n.fillRect(0,0,Ut,Xt),n.fillStyle=Be.quit,n.font=`11px ${te}`,n.textAlign="right",n.fillText(`*** ${i.collapse.type}`,Ut-as,Xt-14),n.textAlign="left")}}const Qf={pelos:"#8c6a4f",halon:"#6fa8a0",keramai:"#c2803a",chalkis:"#7d4a86",pyrrha:"#d14e3c",elektra:"#e0b33a",daphnaia:"#4e8b4a",ouranis:"#3d5fa8"},th=[["Arche",null,0],["Ostrakon Row","pelos",60],["Grammateion",null,0],["Pelos Walk","pelos",60],["Eisphora",null,0],["Boreas Gate",null,200],["Halas Steps","halon",100],["Moira",null,0],["Tarichos Street","halon",100],["Limen Approach","halon",120],["Desmoterion",null,0],["Kerameikos Walk","keramai",140],["Pyrphoros",null,150],["Amphora Yard","keramai",140],["Pithos Street","keramai",160],["Eos Gate",null,200],["Chalkeion Gate","chalkis",180],["Grammateion",null,0],["Akmon Court","chalkis",180],["Orichalkon Row","chalkis",200],["Temenos",null,0],["Kaminos Way","pyrrha",220],["Moira",null,0],["Pyrrha Rise","pyrrha",220],["Phlox Avenue","pyrrha",240],["Notos Gate",null,200],["Elektron Quay","elektra",260],["Helios Terrace","elektra",260],["Krene",null,150],["Lampter Mile","elektra",280],["Kerux",null,0],["Daphne Green","daphnaia",300],["Myrtos Park","daphnaia",300],["Grammateion",null,0],["Kotinos Crown","daphnaia",320],["Zephyros Gate",null,200],["Moira",null,0],["Astron Hill","ouranis",350],["Choregia",null,0],["Ouranos Point","ouranis",400]],fi=[{name:"ada",model:!1,color:"#f2efe6"},{name:"claude",model:!0,color:"#d97757"},{name:"tomas",model:!1,color:"#6fb3e0"},{name:"gemma",model:!0,color:"#9be07a"}];function sa(s){return s<=10?[10-s,10]:s<=20?[0,10-(s-10)]:s<=30?[s-20,0]:[10,s-30]}const eh=17,tp=Ut/2,ra=168;function _n(s,t){const e=(s-5.5)*eh,n=(t-5.5)*eh;return[tp+(e-n)*.72,ra+(e+n)*.42]}class ep extends vn{constructor(e,n){super(e,n);A(this,"pos",[0,0,0,0]);A(this,"hop",{seat:0,from:0,left:0,k:0});A(this,"dice",[3,4]);A(this,"owner",new Map);A(this,"log",["A new game begins with 4 players."]);A(this,"turn",0);A(this,"wait",1.2);A(this,"rand",Ui(4242));this.fps=20}say(e){this.log=[...this.log,e].slice(-3)}step(e){var o;if(this.hop.left>0){this.hop.k+=e/.16,this.hop.k>=1&&(this.hop.k=0,this.hop.left--,this.pos[this.hop.seat]=((this.pos[this.hop.seat]??0)+1)%40,this.hop.left===0&&this.land(this.hop.seat));return}if(this.wait-=e,this.wait>0)return;const n=this.turn%fi.length,i=1+Math.floor(this.rand()*6),r=1+Math.floor(this.rand()*6);this.dice=[i,r],this.say(`${(o=fi[n])==null?void 0:o.name} rolls ${i} and ${r}.`),this.hop={seat:n,from:this.pos[n]??0,left:i+r,k:0},this.turn++,this.wait=1.6}land(e){var c,h;const n=this.pos[e]??0,[i,r,o]=th[n]??["",null,0],a=((c=fi[e])==null?void 0:c.name)??"",l=this.owner.get(n);if(o&&l===void 0&&this.rand()<.75)this.owner.set(n,e),this.say(`${a} buys ${i} for ₯${o}.`);else if(l!==void 0&&l!==e){const u=Math.max(2,Math.round(o/(r?12:8)));this.say(`${a} pays ₯${u} to ${(h=fi[l])==null?void 0:h.name} for ${i}.`)}else i==="Moira"||i==="Grammateion"?this.say(`${a} draws from ${i}.`):i==="Kerux"&&(this.say(`${a} is sent to the Desmoterion.`),this.pos[e]=10);this.owner.size>22&&this.owner.clear()}draw(e,n){var c;if(this.step(Math.min(n,.2)),this.hop.left===0&&this.unchanged(this.log,this.dice,this.turn,this.owner.size,this.pos[0],this.pos[1],this.pos[2],this.pos[3]))return!1;const i=this.ctx,r=i.createRadialGradient(Ut/2,ra,40,Ut/2,ra,Ut*.7);r.addColorStop(0,"#2a241f"),r.addColorStop(1,"#141210"),i.fillStyle=r,i.fillRect(0,0,Ut,Xt);const o=[_n(-.4,-.4),_n(11.4,-.4),_n(11.4,11.4),_n(-.4,11.4)];i.fillStyle="rgba(0,0,0,0.45)",i.beginPath(),o.forEach(([h,u],d)=>d?i.lineTo(h,u+8):i.moveTo(h,u+8)),i.fill(),i.fillStyle="#d9ccb2",i.beginPath(),o.forEach(([h,u],d)=>d?i.lineTo(h,u):i.moveTo(h,u)),i.fill();for(let h=0;h<40;h++){const[u,d]=sa(h),[,f]=th[h]??["",null,0],p=[_n(u,d),_n(u+1,d),_n(u+1,d+1),_n(u,d+1)];i.fillStyle=f?Qf[f]??"#efe4cf":h%10===0?"#e6d6b6":"#efe4cf",i.strokeStyle="#7a6a52",i.lineWidth=.7,i.beginPath(),p.forEach(([m,g],x)=>x?i.lineTo(m,g):i.moveTo(m,g)),i.closePath(),i.fill(),i.stroke();const v=this.owner.get(h);if(v!==void 0){const[m,g]=_n(u+.5,d+.5);i.fillStyle=((c=fi[v])==null?void 0:c.color)??"#fff",i.fillRect(m-2,g-5,4,5)}}const[a,l]=_n(5.5,5.5);i.fillStyle="#7a6a52",i.font=`15px ${te}`,this.spaced("KLEROS",a,l+5,5,"center"),fi.forEach((h,u)=>{let d=this.pos[u]??0,f=0,[p,v]=sa(d);if(this.hop.left>0&&this.hop.seat===u){const[w,M]=sa((d+1)%40);p+=(w-p)*this.hop.k,v+=(M-v)*this.hop.k,f=Math.sin(this.hop.k*Math.PI)*9,d=-1}const m=[[.3,.3],[.7,.3],[.3,.7],[.7,.7]][u]??[.5,.5],[g,x]=_n(p+(m[0]??.5),v+(m[1]??.5));i.fillStyle="rgba(0,0,0,0.35)",i.beginPath(),i.ellipse(g,x+1,5,2.5,0,0,Math.PI*2),i.fill(),i.fillStyle=h.color,i.beginPath(),i.arc(g,x-5-f,4.6,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(0,0,0,0.5)",i.stroke()}),this.dice.forEach((h,u)=>this.die(Ut-70+u*30,22,h,e)),i.font=`11px ${te}`,fi.forEach((h,u)=>{const d=26+u*16;i.fillStyle=h.color,i.fillRect(16,d-8,8,8),i.fillStyle=(this.turn-1)%fi.length===u?"#f5ecd9":"#8c826f",i.fillText(`${h.name}${h.model?"  ◆ model":""}`,30,d)}),i.fillStyle="rgba(10,8,6,0.75)",i.fillRect(0,Xt-62,Ut,62),i.font=`12px ${te}`,this.log.forEach((h,u)=>{i.fillStyle=u===this.log.length-1?"#f1e6cc":"#8a7f6a",i.fillText(h,16,Xt-42+u*16)})}die(e,n,i,r){const o=this.ctx,a=this.hop.left>0?Math.sin(r*30)*.15:0;o.save(),o.translate(e,n),o.rotate(a),o.fillStyle="#efe4cf",o.fillRect(-10,-10,20,20),o.fillStyle="#3a2f24";const l={1:[[0,0]],2:[[-5,-5],[5,5]],3:[[-5,-5],[0,0],[5,5]],4:[[-5,-5],[5,-5],[-5,5],[5,5]],5:[[-5,-5],[5,-5],[0,0],[-5,5],[5,5]],6:[[-5,-5],[5,-5],[-5,0],[5,0],[-5,5],[5,5]]};for(const[c,h]of l[i]??[])o.beginPath(),o.arc(c,h,1.8,0,Math.PI*2),o.fill();o.restore()}}class np extends vn{constructor(e,n){super(e,n);A(this,"body");A(this,"creatureRef");A(this,"stars");A(this,"breaths",[]);this.fps=20;const i=Ui(33);this.stars=Array.from({length:90},()=>({x:i()*Ut,y:i()*Xt,a:i()*.5+.1})),this.body=ih()}sync(){const e=this.env.feeds.creature.value;e!==this.creatureRef&&(this.creatureRef=e,this.body=e?ip(e):ih(),this.breaths=Array.from({length:Math.min(4,this.body.edges.length)},(n,i)=>({edge:i*7%Math.max(1,this.body.edges.length),k:0,fwd:!0})))}draw(e,n){this.sync();const i=this.ctx,r=this.body,o=i.createLinearGradient(0,0,0,Xt);o.addColorStop(0,"#070b14"),o.addColorStop(1,"#02030a"),i.fillStyle=o,i.fillRect(0,0,Ut,Xt);for(const p of this.stars)i.fillStyle=`rgba(200,215,255,${p.a*(.7+.3*Math.sin(e+p.x))})`,i.fillRect(p.x,p.y,1,1);const a=r.born?1.4:.9,l=Math.min(n,.1),c=r.nodes.map((p,v)=>{var x;const m=r.adj[v]??[];let g=0;for(const w of m)g+=Math.sin((((x=r.nodes[w])==null?void 0:x.phase)??0)-p.phase);return p.phase+(p.omega+(m.length?a*g/m.length:0))*l});r.nodes.forEach((p,v)=>{const m=c[v]??p.phase;Math.floor(m/(Math.PI*2))>Math.floor(p.phase/(Math.PI*2))&&(p.flash=1),p.phase=m,p.flash=Math.max(0,p.flash-l*2.2)});const h=e*.18,u=Math.cos(h),d=Math.sin(h),f=r.nodes.map((p,v)=>{const m=Math.sin(e*.9+v)*.02,g=p.x*u-p.z*d,w=2.8/(3.6-(p.x*d+p.z*u));return{x:Ut/2+g*w*150,y:176+(p.y+m)*w*150,k:w}});i.lineCap="round";for(const p of r.edges){const v=f[p.a],m=f[p.b];!v||!m||(i.strokeStyle=p.elder?"rgba(160,200,235,0.55)":"rgba(140,170,210,0.28)",i.lineWidth=p.elder?1.4:.8,i.beginPath(),i.moveTo(v.x,v.y),i.lineTo(m.x,m.y),i.stroke())}for(const p of this.breaths){const v=r.edges[p.edge];if(!v)continue;if(p.k+=l/.75,p.k>=1){const E=p.fwd?v.b:v.a,b=(r.adj[E]??[]).map(T=>r.edges.findIndex(L=>L.a===E&&L.b===T||L.b===E&&L.a===T)),R=b[Math.floor(Math.random()*b.length)]??p.edge,_=r.edges[R];p.edge=R,p.fwd=_?_.a===E:!0,p.k=0;continue}const m=f[p.fwd?v.a:v.b],g=f[p.fwd?v.b:v.a];if(!m||!g)continue;const x=m.x+(g.x-m.x)*p.k,w=m.y+(g.y-m.y)*p.k,M=i.createRadialGradient(x,w,0,x,w,9);M.addColorStop(0,"rgba(235,245,255,0.95)"),M.addColorStop(1,"rgba(180,220,255,0)"),i.fillStyle=M,i.fillRect(x-9,w-9,18,18)}r.nodes.forEach((p,v)=>{const m=f[v];if(!m)return;const g=p.flash,x=2+m.k*1.2+g*3,w=g>.05?`rgba(255,${Math.round(210-g*40)},${Math.round(120-g*60)},${.6+g*.4})`:"rgba(200,225,255,0.85)";i.strokeStyle=w,i.lineWidth=.8,i.beginPath(),i.moveTo(m.x-x*3,m.y),i.lineTo(m.x+x*3,m.y),i.moveTo(m.x,m.y-x*3),i.lineTo(m.x,m.y+x*3),i.stroke();const M=i.createRadialGradient(m.x,m.y,0,m.x,m.y,x*2.4);M.addColorStop(0,w),M.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=M,i.fillRect(m.x-x*3,m.y-x*3,x*6,x*6)}),i.font=`15px ${te}`,i.fillStyle=r.born?"#e6f1ff":"#8190a8",i.fillText(r.name,18,Xt-40),i.font=`11px ${te}`,i.fillStyle="#6f7f99",i.fillText(r.age,18,Xt-20),i.textAlign="right",i.fillStyle="#4b5870",i.fillText(r.born?`${r.nodes.length} nodes · ${r.edges.length} strings`:"click to wake it",Ut-18,Xt-20),i.textAlign="left"}}function nh(s,t){var n,i;const e=Array.from({length:s},()=>[]);for(const r of t)(n=e[r.a])==null||n.push(r.b),(i=e[r.b])==null||i.push(r.a);return e}function ip(s){const t=new Map(s.nodes.map((c,h)=>[c.id,h])),e=s.nodes.reduce((c,h)=>c+h.x,0)/s.nodes.length,n=s.nodes.reduce((c,h)=>c+h.y,0)/s.nodes.length,i=s.nodes.reduce((c,h)=>c+h.z,0)/s.nodes.length,r=Math.max(1,...s.nodes.map(c=>Math.hypot(c.x-e,c.y-n,c.z-i))),o=s.nodes.map((c,h)=>({x:(c.x-e)/r,y:(c.y-n)/r,z:(c.z-i)/r,phase:h*1.3,omega:2.4+h%5*.21,flash:0})),a=s.edges.map(c=>({a:t.get(c.a)??-1,b:t.get(c.b)??-1,elder:c.age>150})).filter(c=>c.a>=0&&c.b>=0),l=Math.max(s.lifetime,(Date.now()-s.bornAt)/1e3);return{name:s.name,age:`${sp(l)} old · yours`,born:!0,nodes:o,edges:a,adj:nh(o.length,a)}}function ih(){const s=Ui(9),t=9,e=Array.from({length:t},(i,r)=>{const o=r/t*Math.PI*2;return{x:Math.cos(o)*.8+(s()-.5)*.3,y:(s()-.5)*.9,z:Math.sin(o)*.8,phase:s()*6,omega:2.2+s()*.8,flash:0}}),n=[];for(let i=0;i<t;i++)n.push({a:i,b:(i+1)%t,elder:i%3===0});return n.push({a:0,b:4,elder:!1},{a:2,b:6,elder:!1},{a:3,b:8,elder:!0}),{name:"something stirs",age:"unborn in this browser",born:!1,nodes:e,edges:n,adj:nh(t,n)}}function sp(s){const t=Math.max(0,Math.floor(s)),e=Math.floor(t/86400),n=Math.floor(t%86400/3600),i=Math.floor(t%3600/60);return e>0?`${e}d ${n}h`:n>0?`${n}h ${i}m`:`${i}m`}const ls=new Image;ls.src="/static/oikos/boot-logo.webp";class rp extends vn{constructor(e,n){super(e,n);A(this,"specks");this.fps=12,this.idleFps=4;const i=Ui(7);this.specks=Array.from({length:70},()=>({x:i()*Ut,y:i()*Xt,r:i()*1.2+.3,red:i()<.35,v:i()*4+1}))}draw(e){const n=this.ctx;this.clear("#000");for(const c of this.specks){const h=(c.y-e*c.v+Xt)%Xt;n.fillStyle=c.red?"rgba(170,40,50,0.55)":"rgba(255,255,255,0.28)",n.fillRect(c.x,h,c.r,c.r)}if(ls.complete&&ls.naturalWidth){const h=210*ls.naturalHeight/ls.naturalWidth;n.globalAlpha=.92+.08*Math.sin(e*1.3),n.drawImage(ls,(Ut-210)/2,26,210,h),n.globalAlpha=1}n.fillStyle="#7d7d7d",n.font=`13px ${te}`,this.spaced("transmissions",Ut/2,118,3,"center"),n.fillStyle="#262626",n.fillRect(40,132,Ut-80,1);const i=this.env.dir.posts.slice(0,6);if(this.settled=!0,!i.length){n.fillStyle="#9a9a9a",n.font=`16px ${te}`,n.textAlign="center",n.fillText(`no transmissions yet${Math.floor(e*2)%2?"_":" "}`,Ut/2,230),n.textAlign="left";return}const r=3.6,o=Math.floor(e/r)%i.length,a=e%r/r;this.settled=a*1.6>=1&&r-e%r>.3,i.forEach((c,h)=>{const u=162+h*29,d=h===o;n.font=`11px ${te}`,n.fillStyle=d?"#bdbdbd":"#555",n.fillText(c.date,46,u),n.font=`16px ${$c}`,n.fillStyle=d?"#ffffff":"#9a9a9a";const f=c.title.length>38?`${c.title.slice(0,37)}…`:c.title;n.fillText(f,132,u),d&&this.star(28,u-5,e)});const l=i[o];if(l!=null&&l.excerpt){n.font=`italic 12px ${te}`,n.fillStyle="#8a8a8a";const c=Math.floor(Math.min(1,a*1.6)*l.excerpt.length);this.wrap(l.excerpt.slice(0,c),Ut-92,2).forEach((u,d)=>n.fillText(u,46,344+d*16))}}star(e,n,i){const r=this.ctx,o=7+Math.sin(i*5)*1.2;r.save(),r.translate(e,n),r.rotate(i*.8),r.fillStyle="#fff",r.shadowColor="#fff",r.shadowBlur=10,r.beginPath();for(let a=0;a<16;a++){const l=a/16*Math.PI*2,c=a%2?o*.28:a%4?o*.7:o;r.lineTo(Math.cos(l)*c,Math.sin(l)*c)}r.closePath(),r.fill(),r.restore()}}const op={transmissions:rp,dreams:$f,chronicle:Hf,"dreams-api":qf,apeiron:Bf,syrinx:np,afterlife:If,irc:jf,parlor:ep,dream_gen:Wf};class ap extends vn{draw(t){if(this.unchanged(Math.floor(t)%2))return!1;const e=this.ctx,n=["#c0c0c0","#c0c000","#00c0c0","#00c000","#c000c0","#c00000","#0000c0"];n.forEach((i,r)=>{e.fillStyle=i,e.fillRect(r*Ut/n.length,0,Ut/n.length+1,Xt*.66)}),e.fillStyle="#111",e.fillRect(0,Xt*.66,Ut,Xt*.34),e.fillStyle="#fff",e.font=`22px ${te}`,e.textAlign="center",e.fillText(this.site.title,Ut/2,Xt*.82),e.font=`12px ${te}`,e.fillStyle=Math.floor(t)%2?"#888":"#555",e.fillText("no programme yet",Ut/2,Xt*.92),e.textAlign="left"}}function lp(s,t){const e=op[s.id]??ap;return new e(s,t)}const Pr={dreams:{angle:0,r:4.9,y:.5,style:"tv",screenW:2,channel:1},chronicle:{angle:-19.5,r:5.35,y:1.25,style:"black",screenW:1,feeds:"dreams",channel:3},"dreams-api":{angle:19.5,r:5.35,y:1.25,style:"grey",screenW:.85,feeds:"dreams",channel:4},transmissions:{angle:-30,r:4.5,y:.34,style:"beige",screenW:1.22,stand:!0,channel:2},afterlife:{angle:30,r:4.5,y:0,style:"black",screenW:1.08,channel:10},apeiron:{angle:-56,r:4.2,y:0,style:"black",screenW:1.15,channel:5},irc:{angle:-56,r:4.2,y:0,style:"beige",screenW:.95,on:"apeiron",channel:6},syrinx:{angle:56,r:4.2,y:.28,style:"grey",screenW:1.08,channel:7},parlor:{angle:-18,r:6.8,y:3.9,style:"beige",screenW:1.1,hang:!0,channel:9}};function cp(s,t){const e=Pr[s];if(e)return e;const n=Math.floor(t/2)+1;return{angle:(t%2?1:-1)*(68+n*10),r:5.4,y:0,style:"grey",screenW:1,channel:12+t}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const oa="185",cs={ROTATE:0,DOLLY:1,PAN:2},hs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},hp=0,sh=1,up=2,Lr=1,dp=2,tr=3,pi=0,Ke=1,Xn=2,Ln=0,us=1,Dr=2,rh=3,oh=4,fp=5,Bi=100,pp=101,mp=102,gp=103,xp=104,vp=200,_p=201,yp=202,Mp=203,aa=204,la=205,bp=206,Sp=207,wp=208,Ep=209,Tp=210,Ap=211,Cp=212,Rp=213,Pp=214,ca=0,ha=1,ua=2,ds=3,da=4,fa=5,pa=6,ma=7,ah=0,Lp=1,Dp=2,Dn=0,lh=1,ch=2,hh=3,ga=4,uh=5,dh=6,fh=7,ph=300,zi=301,fs=302,xa=303,va=304,Ir=306,Ur=1e3,Yn=1001,_a=1002,ze=1003,Ip=1004,Nr=1005,He=1006,ya=1007,Hi=1008,rn=1009,mh=1010,gh=1011,er=1012,Ma=1013,In=1014,yn=1015,on=1016,ba=1017,Sa=1018,nr=1020,xh=35902,vh=35899,_h=1021,yh=1022,Mn=1023,qn=1026,Gi=1027,wa=1028,Ea=1029,Vi=1030,Ta=1031,Aa=1033,kr=33776,Fr=33777,Or=33778,Br=33779,Ca=35840,Ra=35841,Pa=35842,La=35843,Da=36196,Ia=37492,Ua=37496,Na=37488,ka=37489,zr=37490,Fa=37491,Oa=37808,Ba=37809,za=37810,Ha=37811,Ga=37812,Va=37813,Wa=37814,$a=37815,Xa=37816,Ya=37817,qa=37818,Ka=37819,Za=37820,Ja=37821,ja=36492,Qa=36494,tl=36495,el=36283,nl=36284,Hr=36285,il=36286,Up=3200,sl=0,Np=1,mi="",ke="srgb",ir="srgb-linear",Gr="linear",he="srgb",ps=7680,Mh=519,kp=512,Fp=513,Op=514,rl=515,Bp=516,zp=517,ol=518,Hp=519,bh=35044,Sh="300 es",Un=2e3,sr=2001;function Gp(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Vr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Vp(){const s=Vr("canvas");return s.style.display="block",s}const wh={};function Eh(...s){const t="THREE."+s.shift();console.log(t,...s)}function Th(s){const t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function kt(...s){s=Th(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function oe(...s){s=Th(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function ms(...s){const t=s.join(" ");t in wh||(wh[t]=!0,kt(...s))}function Wp(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const $p={[ca]:ha,[ua]:pa,[da]:ma,[ds]:fa,[ha]:ca,[pa]:ua,[ma]:da,[fa]:ds};class gi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}}const Ve=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ah=1234567;const rr=Math.PI/180,gs=180/Math.PI;function xs(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ve[s&255]+Ve[s>>8&255]+Ve[s>>16&255]+Ve[s>>24&255]+"-"+Ve[t&255]+Ve[t>>8&255]+"-"+Ve[t>>16&15|64]+Ve[t>>24&255]+"-"+Ve[e&63|128]+Ve[e>>8&255]+"-"+Ve[e>>16&255]+Ve[e>>24&255]+Ve[n&255]+Ve[n>>8&255]+Ve[n>>16&255]+Ve[n>>24&255]).toLowerCase()}function Zt(s,t,e){return Math.max(t,Math.min(e,s))}function al(s,t){return(s%t+t)%t}function Xp(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Yp(s,t,e){return s!==t?(e-s)/(t-s):0}function or(s,t,e){return(1-e)*s+e*t}function qp(s,t,e,n){return or(s,t,1-Math.exp(-e*n))}function Kp(s,t=1){return t-Math.abs(al(s,t*2)-t)}function Zp(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Jp(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function jp(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Qp(s,t){return s+Math.random()*(t-s)}function tm(s){return s*(.5-Math.random())}function em(s){s!==void 0&&(Ah=s);let t=Ah+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function nm(s){return s*rr}function im(s){return s*gs}function sm(s){return(s&s-1)===0&&s!==0}function rm(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function om(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function am(s,t,e,n,i){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),p=o((n-t)/2);switch(i){case"XYX":s.set(a*h,l*u,l*d,a*c);break;case"YZY":s.set(l*d,a*h,l*u,a*c);break;case"ZXZ":s.set(l*u,l*d,a*h,a*c);break;case"XZX":s.set(a*h,l*p,l*f,a*c);break;case"YXY":s.set(l*f,a*h,l*p,a*c);break;case"ZYZ":s.set(l*p,l*f,a*h,a*c);break;default:kt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function vs(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ze(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Wr={DEG2RAD:rr,RAD2DEG:gs,generateUUID:xs,clamp:Zt,euclideanModulo:al,mapLinear:Xp,inverseLerp:Yp,lerp:or,damp:qp,pingpong:Kp,smoothstep:Zp,smootherstep:Jp,randInt:jp,randFloat:Qp,randFloatSpread:tm,seededRandom:em,degToRad:nm,radToDeg:im,isPowerOfTwo:sm,ceilPowerOfTwo:rm,floorPowerOfTwo:om,setQuaternionFromProperEuler:am,normalize:Ze,denormalize:vs},Sc=class Sc{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Sc.prototype.isVector2=!0;let dt=Sc;class Nn{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=r[o+0],f=r[o+1],p=r[o+2],v=r[o+3];if(u!==v||l!==d||c!==f||h!==p){let m=l*d+c*f+h*p+u*v;m<0&&(d=-d,f=-f,p=-p,v=-v,m=-m);let g=1-a;if(m<.9995){const x=Math.acos(m),w=Math.sin(x);g=Math.sin(g*x)/w,a=Math.sin(a*x)/w,l=l*g+d*a,c=c*g+f*a,h=h*g+p*a,u=u*g+v*a}else{l=l*g+d*a,c=c*g+f*a,h=h*g+p*a,u=u*g+v*a;const x=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=x,c*=x,h*=x,u*=x}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[o],d=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+h*u+l*f-c*d,t[e+1]=l*p+h*d+c*u-a*f,t[e+2]=c*p+h*f+a*d-l*u,t[e+3]=h*p-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(r/2),d=l(n/2),f=l(i/2),p=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"YZX":this._x=d*h*u+c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u-d*f*p;break;case"XZY":this._x=d*h*u-c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u+d*f*p;break;default:kt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Zt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,i=-i,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){const c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const wc=class wc{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ch.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ch.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-r*i),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=i+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this.z=Zt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this.z=Zt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ll.copy(this).projectOnVector(t),this.sub(ll)}reflect(t){return this.sub(ll.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};wc.prototype.isVector3=!0;let P=wc;const ll=new P,Ch=new Nn,Ec=class Ec{constructor(t,e,n,i,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],v=i[0],m=i[3],g=i[6],x=i[1],w=i[4],M=i[7],E=i[2],b=i[5],R=i[8];return r[0]=o*v+a*x+l*E,r[3]=o*m+a*w+l*b,r[6]=o*g+a*M+l*R,r[1]=c*v+h*x+u*E,r[4]=c*m+h*w+u*b,r[7]=c*g+h*M+u*R,r[2]=d*v+f*x+p*E,r[5]=d*m+f*w+p*b,r[8]=d*g+f*M+p*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,p=e*u+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return t[0]=u*v,t[1]=(i*c-h*n)*v,t[2]=(a*n-i*o)*v,t[3]=d*v,t[4]=(h*e-i*l)*v,t[5]=(i*r-a*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return ms("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(cl.makeScale(t,e)),this}rotate(t){return ms("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(cl.makeRotation(-t)),this}translate(t,e){return ms("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(cl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Ec.prototype.isMatrix3=!0;let Vt=Ec;const cl=new Vt,Rh=new Vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ph=new Vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function lm(){const s={enabled:!0,workingColorSpace:ir,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===he&&(i.r=Kn(i.r),i.g=Kn(i.g),i.b=Kn(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===he&&(i.r=_s(i.r),i.g=_s(i.g),i.b=_s(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===mi?Gr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return ms("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return ms("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[ir]:{primaries:t,whitePoint:n,transfer:Gr,toXYZ:Rh,fromXYZ:Ph,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ke},outputColorSpaceConfig:{drawingBufferColorSpace:ke}},[ke]:{primaries:t,whitePoint:n,transfer:he,toXYZ:Rh,fromXYZ:Ph,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ke}}}),s}const re=lm();function Kn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function _s(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let ys;class cm{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{ys===void 0&&(ys=Vr("canvas")),ys.width=t.width,ys.height=t.height;const i=ys.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=ys}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Vr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Kn(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Kn(e[n]/255)*255):e[n]=Kn(e[n]);return{data:e,width:t.width,height:t.height}}else return kt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let hm=0;class hl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:hm++}),this.uuid=xs(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(ul(i[o].image)):r.push(ul(i[o]))}else r=ul(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function ul(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?cm.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(kt("Texture: Unable to serialize Texture."),{})}let um=0;const dl=new P;class We extends gi{constructor(t=We.DEFAULT_IMAGE,e=We.DEFAULT_MAPPING,n=Yn,i=Yn,r=He,o=Hi,a=Mn,l=rn,c=We.DEFAULT_ANISOTROPY,h=mi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:um++}),this.uuid=xs(),this.name="",this.source=new hl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new dt(0,0),this.repeat=new dt(1,1),this.center=new dt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(dl).x}get height(){return this.source.getSize(dl).y}get depth(){return this.source.getSize(dl).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){kt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){kt(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ph)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ur:t.x=t.x-Math.floor(t.x);break;case Yn:t.x=t.x<0?0:1;break;case _a:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ur:t.y=t.y-Math.floor(t.y);break;case Yn:t.y=t.y<0?0:1;break;case _a:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}We.DEFAULT_IMAGE=null,We.DEFAULT_MAPPING=ph,We.DEFAULT_ANISOTROPY=1;const Tc=class Tc{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],p=l[9],v=l[2],m=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const w=(c+1)/2,M=(f+1)/2,E=(g+1)/2,b=(h+d)/4,R=(u+v)/4,_=(p+m)/4;return w>M&&w>E?w<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(w),i=b/n,r=R/n):M>E?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=b/i,r=_/i):E<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(E),n=R/r,i=_/r),this.set(n,i,r,e),this}let x=Math.sqrt((m-p)*(m-p)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(m-p)/x,this.y=(u-v)/x,this.z=(d-h)/x,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this.z=Zt(this.z,t.z,e.z),this.w=Zt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this.z=Zt(this.z,t,e),this.w=Zt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Tc.prototype.isVector4=!0;let be=Tc;class dm extends gi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:He,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new be(0,0,t,e),this.scissorTest=!1,this.viewport=new be(0,0,t,e),this.textures=[];const i={width:t,height:e,depth:n.depth},r=new We(i),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:He,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new hl(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class je extends dm{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Lh extends We{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=ze,this.minFilter=ze,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class fm extends We{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=ze,this.minFilter=ze,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const No=class No{constructor(t,e,n,i,r,o,a,l,c,h,u,d,f,p,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,h,u,d,f,p,v,m)}set(t,e,n,i,r,o,a,l,c,h,u,d,f,p,v,m){const g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=i,g[1]=r,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=v,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new No().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,i=1/Ms.setFromMatrixColumn(t,0).length(),r=1/Ms.setFromMatrixColumn(t,1).length(),o=1/Ms.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,f=o*u,p=a*h,v=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+p*c,e[5]=d-v*c,e[9]=-a*l,e[2]=v-d*c,e[6]=p+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,p=c*h,v=c*u;e[0]=d+v*a,e[4]=p*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-p,e[6]=v+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,p=c*h,v=c*u;e[0]=d-v*a,e[4]=-o*u,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*h,e[9]=v-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,f=o*u,p=a*h,v=a*u;e[0]=l*h,e[4]=p*c-f,e[8]=d*c+v,e[1]=l*u,e[5]=v*c+d,e[9]=f*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,p=a*l,v=a*c;e[0]=l*h,e[4]=v-d*u,e[8]=p*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+p,e[10]=d-v*u}else if(t.order==="XZY"){const d=o*l,f=o*c,p=a*l,v=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+v,e[5]=o*h,e[9]=f*u-p,e[2]=p*u-f,e[6]=a*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(pm,t,mm)}lookAt(t,e,n){const i=this.elements;return an.subVectors(t,e),an.lengthSq()===0&&(an.z=1),an.normalize(),xi.crossVectors(n,an),xi.lengthSq()===0&&(Math.abs(n.z)===1?an.x+=1e-4:an.z+=1e-4,an.normalize(),xi.crossVectors(n,an)),xi.normalize(),$r.crossVectors(an,xi),i[0]=xi.x,i[4]=$r.x,i[8]=an.x,i[1]=xi.y,i[5]=$r.y,i[9]=an.y,i[2]=xi.z,i[6]=$r.z,i[10]=an.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],v=n[6],m=n[10],g=n[14],x=n[3],w=n[7],M=n[11],E=n[15],b=i[0],R=i[4],_=i[8],T=i[12],L=i[1],D=i[5],U=i[9],G=i[13],K=i[2],N=i[6],W=i[10],B=i[14],q=i[3],et=i[7],ot=i[11],lt=i[15];return r[0]=o*b+a*L+l*K+c*q,r[4]=o*R+a*D+l*N+c*et,r[8]=o*_+a*U+l*W+c*ot,r[12]=o*T+a*G+l*B+c*lt,r[1]=h*b+u*L+d*K+f*q,r[5]=h*R+u*D+d*N+f*et,r[9]=h*_+u*U+d*W+f*ot,r[13]=h*T+u*G+d*B+f*lt,r[2]=p*b+v*L+m*K+g*q,r[6]=p*R+v*D+m*N+g*et,r[10]=p*_+v*U+m*W+g*ot,r[14]=p*T+v*G+m*B+g*lt,r[3]=x*b+w*L+M*K+E*q,r[7]=x*R+w*D+M*N+E*et,r[11]=x*_+w*U+M*W+E*ot,r[15]=x*T+w*G+M*B+E*lt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],p=t[3],v=t[7],m=t[11],g=t[15],x=l*f-c*d,w=a*f-c*u,M=a*d-l*u,E=o*f-c*h,b=o*d-l*h,R=o*u-a*h;return e*(v*x-m*w+g*M)-n*(p*x-m*E+g*b)+i*(p*w-v*E+g*R)-r*(p*M-v*b+m*R)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(r*h-a*l)+i*(r*c-o*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],p=t[12],v=t[13],m=t[14],g=t[15],x=e*a-n*o,w=e*l-i*o,M=e*c-r*o,E=n*l-i*a,b=n*c-r*a,R=i*c-r*l,_=h*v-u*p,T=h*m-d*p,L=h*g-f*p,D=u*m-d*v,U=u*g-f*v,G=d*g-f*m,K=x*G-w*U+M*D+E*L-b*T+R*_;if(K===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/K;return t[0]=(a*G-l*U+c*D)*N,t[1]=(i*U-n*G-r*D)*N,t[2]=(v*R-m*b+g*E)*N,t[3]=(d*b-u*R-f*E)*N,t[4]=(l*L-o*G-c*T)*N,t[5]=(e*G-i*L+r*T)*N,t[6]=(m*M-p*R-g*w)*N,t[7]=(h*R-d*M+f*w)*N,t[8]=(o*U-a*L+c*_)*N,t[9]=(n*L-e*U-r*_)*N,t[10]=(p*b-v*M+g*x)*N,t[11]=(u*M-h*b-f*x)*N,t[12]=(a*T-o*D-l*_)*N,t[13]=(e*D-n*T+i*_)*N,t[14]=(v*w-p*E-m*x)*N,t[15]=(h*E-u*w+d*x)*N,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,p=r*u,v=o*h,m=o*u,g=a*u,x=l*c,w=l*h,M=l*u,E=n.x,b=n.y,R=n.z;return i[0]=(1-(v+g))*E,i[1]=(f+M)*E,i[2]=(p-w)*E,i[3]=0,i[4]=(f-M)*b,i[5]=(1-(d+g))*b,i[6]=(m+x)*b,i[7]=0,i[8]=(p+w)*R,i[9]=(m-x)*R,i[10]=(1-(d+v))*R,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=Ms.set(i[0],i[1],i[2]).length();const a=Ms.set(i[4],i[5],i[6]).length(),l=Ms.set(i[8],i[9],i[10]).length();r<0&&(o=-o),bn.copy(this);const c=1/o,h=1/a,u=1/l;return bn.elements[0]*=c,bn.elements[1]*=c,bn.elements[2]*=c,bn.elements[4]*=h,bn.elements[5]*=h,bn.elements[6]*=h,bn.elements[8]*=u,bn.elements[9]*=u,bn.elements[10]*=u,e.setFromRotationMatrix(bn),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,i,r,o,a=Un,l=!1){const c=this.elements,h=2*r/(e-t),u=2*r/(n-i),d=(e+t)/(e-t),f=(n+i)/(n-i);let p,v;if(l)p=r/(o-r),v=o*r/(o-r);else if(a===Un)p=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===sr)p=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=Un,l=!1){const c=this.elements,h=2/(e-t),u=2/(n-i),d=-(e+t)/(e-t),f=-(n+i)/(n-i);let p,v;if(l)p=1/(o-r),v=o/(o-r);else if(a===Un)p=-2/(o-r),v=-(o+r)/(o-r);else if(a===sr)p=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};No.prototype.isMatrix4=!0;let ce=No;const Ms=new P,bn=new ce,pm=new P(0,0,0),mm=new P(1,1,1),xi=new P,$r=new P,an=new P,Dh=new ce,Ih=new Nn;class Zn{constructor(t=0,e=0,n=0,i=Zn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Zt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Zt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Zt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Zt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Zt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:kt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Dh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Dh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ih.setFromEuler(this),this.setFromQuaternion(Ih,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Zn.DEFAULT_ORDER="XYZ";class fl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let gm=0;const Uh=new P,bs=new Nn,Jn=new ce,Xr=new P,ar=new P,xm=new P,vm=new Nn,Nh=new P(1,0,0),kh=new P(0,1,0),Fh=new P(0,0,1),Oh={type:"added"},_m={type:"removed"},Ss={type:"childadded",child:null},pl={type:"childremoved",child:null};class Pe extends gi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:gm++}),this.uuid=xs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Pe.DEFAULT_UP.clone();const t=new P,e=new Zn,n=new Nn,i=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ce},normalMatrix:{value:new Vt}}),this.matrix=new ce,this.matrixWorld=new ce,this.matrixAutoUpdate=Pe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new fl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return bs.setFromAxisAngle(t,e),this.quaternion.multiply(bs),this}rotateOnWorldAxis(t,e){return bs.setFromAxisAngle(t,e),this.quaternion.premultiply(bs),this}rotateX(t){return this.rotateOnAxis(Nh,t)}rotateY(t){return this.rotateOnAxis(kh,t)}rotateZ(t){return this.rotateOnAxis(Fh,t)}translateOnAxis(t,e){return Uh.copy(t).applyQuaternion(this.quaternion),this.position.add(Uh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Nh,t)}translateY(t){return this.translateOnAxis(kh,t)}translateZ(t){return this.translateOnAxis(Fh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Jn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Xr.copy(t):Xr.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),ar.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Jn.lookAt(ar,Xr,this.up):Jn.lookAt(Xr,ar,this.up),this.quaternion.setFromRotationMatrix(Jn),i&&(Jn.extractRotation(i.matrixWorld),bs.setFromRotationMatrix(Jn),this.quaternion.premultiply(bs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(oe("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Oh),Ss.child=t,this.dispatchEvent(Ss),Ss.child=null):oe("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(_m),pl.child=t,this.dispatchEvent(pl),pl.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Jn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Jn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Jn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Oh),Ss.child=t,this.dispatchEvent(Ss),Ss.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ar,t,xm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ar,vm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}Pe.DEFAULT_UP=new P(0,1,0),Pe.DEFAULT_MATRIX_AUTO_UPDATE=!0,Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class jn extends Pe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ym={type:"move"};class ml{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new jn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new jn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new jn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),g=this._getHandJoint(c,v);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(ym)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new jn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Bh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},vi={h:0,s:0,l:0},Yr={h:0,s:0,l:0};function gl(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Gt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ke){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,re.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=re.workingColorSpace){return this.r=t,this.g=e,this.b=n,re.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=re.workingColorSpace){if(t=al(t,1),e=Zt(e,0,1),n=Zt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=gl(o,r,t+1/3),this.g=gl(o,r,t),this.b=gl(o,r,t-1/3)}return re.colorSpaceToWorking(this,i),this}setStyle(t,e=ke){function n(r){r!==void 0&&parseFloat(r)<1&&kt("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:kt("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);kt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ke){const n=Bh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):kt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Kn(t.r),this.g=Kn(t.g),this.b=Kn(t.b),this}copyLinearToSRGB(t){return this.r=_s(t.r),this.g=_s(t.g),this.b=_s(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ke){return re.workingToColorSpace($e.copy(this),t),Math.round(Zt($e.r*255,0,255))*65536+Math.round(Zt($e.g*255,0,255))*256+Math.round(Zt($e.b*255,0,255))}getHexString(t=ke){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=re.workingColorSpace){re.workingToColorSpace($e.copy(this),e);const n=$e.r,i=$e.g,r=$e.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=re.workingColorSpace){return re.workingToColorSpace($e.copy(this),e),t.r=$e.r,t.g=$e.g,t.b=$e.b,t}getStyle(t=ke){re.workingToColorSpace($e.copy(this),t);const e=$e.r,n=$e.g,i=$e.b;return t!==ke?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(vi),this.setHSL(vi.h+t,vi.s+e,vi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(vi),t.getHSL(Yr);const n=or(vi.h,Yr.h,e),i=or(vi.s,Yr.s,e),r=or(vi.l,Yr.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $e=new Gt;Gt.NAMES=Bh;class xl{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Gt(t),this.density=e}clone(){return new xl(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Mm extends Pe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Zn,this.environmentIntensity=1,this.environmentRotation=new Zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Sn=new P,Qn=new P,vl=new P,ti=new P,ws=new P,Es=new P,zh=new P,_l=new P,yl=new P,Ml=new P,bl=new be,Sl=new be,wl=new be;class wn{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Sn.subVectors(t,e),i.cross(Sn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Sn.subVectors(i,e),Qn.subVectors(n,e),vl.subVectors(t,e);const o=Sn.dot(Sn),a=Sn.dot(Qn),l=Sn.dot(vl),c=Qn.dot(Qn),h=Qn.dot(vl),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-a*h)*d,p=(o*h-a*l)*d;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,ti)===null?!1:ti.x>=0&&ti.y>=0&&ti.x+ti.y<=1}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,ti)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ti.x),l.addScaledVector(o,ti.y),l.addScaledVector(a,ti.z),l)}static getInterpolatedAttribute(t,e,n,i,r,o){return bl.setScalar(0),Sl.setScalar(0),wl.setScalar(0),bl.fromBufferAttribute(t,e),Sl.fromBufferAttribute(t,n),wl.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(bl,r.x),o.addScaledVector(Sl,r.y),o.addScaledVector(wl,r.z),o}static isFrontFacing(t,e,n,i){return Sn.subVectors(n,e),Qn.subVectors(t,e),Sn.cross(Qn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Sn.subVectors(this.c,this.b),Qn.subVectors(this.a,this.b),Sn.cross(Qn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return wn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return wn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return wn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return wn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return wn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let o,a;ws.subVectors(i,n),Es.subVectors(r,n),_l.subVectors(t,n);const l=ws.dot(_l),c=Es.dot(_l);if(l<=0&&c<=0)return e.copy(n);yl.subVectors(t,i);const h=ws.dot(yl),u=Es.dot(yl);if(h>=0&&u<=h)return e.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(ws,o);Ml.subVectors(t,r);const f=ws.dot(Ml),p=Es.dot(Ml);if(p>=0&&f<=p)return e.copy(r);const v=f*c-l*p;if(v<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(n).addScaledVector(Es,a);const m=h*p-f*u;if(m<=0&&u-h>=0&&f-p>=0)return zh.subVectors(r,i),a=(u-h)/(u-h+(f-p)),e.copy(i).addScaledVector(zh,a);const g=1/(m+v+d);return o=v*g,a=d*g,e.copy(n).addScaledVector(ws,o).addScaledVector(Es,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Wi{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(En.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(En.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=En.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,En):En.fromBufferAttribute(r,o),En.applyMatrix4(t.matrixWorld),this.expandByPoint(En);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),qr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),qr.copy(n.boundingBox)),qr.applyMatrix4(t.matrixWorld),this.union(qr)}const i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,En),En.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(lr),Kr.subVectors(this.max,lr),Ts.subVectors(t.a,lr),As.subVectors(t.b,lr),Cs.subVectors(t.c,lr),_i.subVectors(As,Ts),yi.subVectors(Cs,As),$i.subVectors(Ts,Cs);let e=[0,-_i.z,_i.y,0,-yi.z,yi.y,0,-$i.z,$i.y,_i.z,0,-_i.x,yi.z,0,-yi.x,$i.z,0,-$i.x,-_i.y,_i.x,0,-yi.y,yi.x,0,-$i.y,$i.x,0];return!El(e,Ts,As,Cs,Kr)||(e=[1,0,0,0,1,0,0,0,1],!El(e,Ts,As,Cs,Kr))?!1:(Zr.crossVectors(_i,yi),e=[Zr.x,Zr.y,Zr.z],El(e,Ts,As,Cs,Kr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,En).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(En).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ei[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ei[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ei[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ei[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ei[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ei[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ei[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ei[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ei),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const ei=[new P,new P,new P,new P,new P,new P,new P,new P],En=new P,qr=new Wi,Ts=new P,As=new P,Cs=new P,_i=new P,yi=new P,$i=new P,lr=new P,Kr=new P,Zr=new P,Xi=new P;function El(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Xi.fromArray(s,r);const a=i.x*Math.abs(Xi.x)+i.y*Math.abs(Xi.y)+i.z*Math.abs(Xi.z),l=t.dot(Xi),c=e.dot(Xi),h=n.dot(Xi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Le=new P,Jr=new dt;let bm=0;class fn extends gi{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:bm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=bh,this.updateRanges=[],this.gpuType=yn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Jr.fromBufferAttribute(this,e),Jr.applyMatrix3(t),this.setXY(e,Jr.x,Jr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix3(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix4(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyNormalMatrix(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.transformDirection(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=vs(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ze(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=vs(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=vs(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=vs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=vs(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ze(e,this.array),n=Ze(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Ze(e,this.array),n=Ze(n,this.array),i=Ze(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Ze(e,this.array),n=Ze(n,this.array),i=Ze(i,this.array),r=Ze(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==bh&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class Hh extends fn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Gh extends fn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class fe extends fn{constructor(t,e,n){super(new Float32Array(t),e,n)}}const Sm=new Wi,cr=new P,Tl=new P;class Rs{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Sm.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;cr.subVectors(t,this.center);const e=cr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(cr,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Tl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(cr.copy(t.center).add(Tl)),this.expandByPoint(cr.copy(t.center).sub(Tl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let wm=0;const pn=new ce,Al=new Pe,Ps=new P,ln=new Wi,hr=new Wi,Fe=new P;class Ge extends gi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:wm++}),this.uuid=xs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Gp(t)?Gh:Hh)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Vt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return pn.makeRotationFromQuaternion(t),this.applyMatrix4(pn),this}rotateX(t){return pn.makeRotationX(t),this.applyMatrix4(pn),this}rotateY(t){return pn.makeRotationY(t),this.applyMatrix4(pn),this}rotateZ(t){return pn.makeRotationZ(t),this.applyMatrix4(pn),this}translate(t,e,n){return pn.makeTranslation(t,e,n),this.applyMatrix4(pn),this}scale(t,e,n){return pn.makeScale(t,e,n),this.applyMatrix4(pn),this}lookAt(t){return Al.lookAt(t),Al.updateMatrix(),this.applyMatrix4(Al.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ps).negate(),this.translate(Ps.x,Ps.y,Ps.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new fe(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&kt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){oe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];ln.setFromBufferAttribute(r),this.morphTargetsRelative?(Fe.addVectors(this.boundingBox.min,ln.min),this.boundingBox.expandByPoint(Fe),Fe.addVectors(this.boundingBox.max,ln.max),this.boundingBox.expandByPoint(Fe)):(this.boundingBox.expandByPoint(ln.min),this.boundingBox.expandByPoint(ln.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&oe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Rs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){oe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){const n=this.boundingSphere.center;if(ln.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];hr.setFromBufferAttribute(a),this.morphTargetsRelative?(Fe.addVectors(ln.min,hr.min),ln.expandByPoint(Fe),Fe.addVectors(ln.max,hr.max),ln.expandByPoint(Fe)):(ln.expandByPoint(hr.min),ln.expandByPoint(hr.max))}ln.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)Fe.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Fe));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Fe.fromBufferAttribute(a,c),l&&(Ps.fromBufferAttribute(t,c),Fe.add(Ps)),i=Math.max(i,n.distanceToSquared(Fe))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&oe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){oe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new fn(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));const a=[],l=[];for(let _=0;_<n.count;_++)a[_]=new P,l[_]=new P;const c=new P,h=new P,u=new P,d=new dt,f=new dt,p=new dt,v=new P,m=new P;function g(_,T,L){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,T),u.fromBufferAttribute(n,L),d.fromBufferAttribute(r,_),f.fromBufferAttribute(r,T),p.fromBufferAttribute(r,L),h.sub(c),u.sub(c),f.sub(d),p.sub(d);const D=1/(f.x*p.y-p.x*f.y);isFinite(D)&&(v.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(D),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(D),a[_].add(v),a[T].add(v),a[L].add(v),l[_].add(m),l[T].add(m),l[L].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let _=0,T=x.length;_<T;++_){const L=x[_],D=L.start,U=L.count;for(let G=D,K=D+U;G<K;G+=3)g(t.getX(G+0),t.getX(G+1),t.getX(G+2))}const w=new P,M=new P,E=new P,b=new P;function R(_){E.fromBufferAttribute(i,_),b.copy(E);const T=a[_];w.copy(T),w.sub(E.multiplyScalar(E.dot(T))).normalize(),M.crossVectors(b,T);const D=M.dot(l[_])<0?-1:1;o.setXYZW(_,w.x,w.y,w.z,D)}for(let _=0,T=x.length;_<T;++_){const L=x[_],D=L.start,U=L.count;for(let G=D,K=D+U;G<K;G+=3)R(t.getX(G+0)),R(t.getX(G+1)),R(t.getX(G+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new fn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new P,r=new P,o=new P,a=new P,l=new P,c=new P,h=new P,u=new P;if(t)for(let d=0,f=t.count;d<f;d+=3){const p=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,p),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Fe.fromBufferAttribute(t,e),Fe.normalize(),t.setXYZ(e,Fe.x,Fe.y,Fe.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let f=0,p=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let g=0;g<h;g++)d[p++]=c[f++]}return new fn(d,h,u)}if(this.index===null)return kt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ge,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let Em=0;class Ls extends gi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=xs(),this.name="",this.type="Material",this.blending=us,this.side=pi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=aa,this.blendDst=la,this.blendEquation=Bi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Gt(0,0,0),this.blendAlpha=0,this.depthFunc=ds,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Mh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ps,this.stencilZFail=ps,this.stencilZPass=ps,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){kt(`Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){kt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==us&&(n.blending=this.blending),this.side!==pi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==aa&&(n.blendSrc=this.blendSrc),this.blendDst!==la&&(n.blendDst=this.blendDst),this.blendEquation!==Bi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ds&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Mh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ps&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ps&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ps&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Gt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new dt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new dt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const ni=new P,Cl=new P,jr=new P,Mi=new P,Rl=new P,Qr=new P,Pl=new P;class to{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ni)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ni.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ni.copy(this.origin).addScaledVector(this.direction,e),ni.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Cl.copy(t).add(e).multiplyScalar(.5),jr.copy(e).sub(t).normalize(),Mi.copy(this.origin).sub(Cl);const r=t.distanceTo(e)*.5,o=-this.direction.dot(jr),a=Mi.dot(this.direction),l=-Mi.dot(jr),c=Mi.lengthSq(),h=Math.abs(1-o*o);let u,d,f,p;if(h>0)if(u=o*l-a,d=o*a-l,p=r*h,u>=0)if(d>=-p)if(d<=p){const v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-p?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=p?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Cl).addScaledVector(jr,d),f}intersectSphere(t,e){ni.subVectors(t.center,this.origin);const n=ni.dot(this.direction),i=ni.dot(ni)-n*n,r=t.radius*t.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,ni)!==null}intersectTriangle(t,e,n,i,r){Rl.subVectors(e,t),Qr.subVectors(n,t),Pl.crossVectors(Rl,Qr);let o=this.direction.dot(Pl),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Mi.subVectors(this.origin,t);const l=a*this.direction.dot(Qr.crossVectors(Mi,Qr));if(l<0)return null;const c=a*this.direction.dot(Rl.cross(Mi));if(c<0||l+c>o)return null;const h=-a*Mi.dot(Pl);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ii extends Ls{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Zn,this.combine=ah,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Vh=new ce,Yi=new to,eo=new Rs,Wh=new P,no=new P,io=new P,so=new P,Ll=new P,ro=new P,$h=new P,oo=new P;class jt extends Pe{constructor(t=new Ge,e=new ii){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(r&&a){ro.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(Ll.fromBufferAttribute(u,t),o?ro.addScaledVector(Ll,h):ro.addScaledVector(Ll.sub(e),h))}e.add(ro)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),eo.copy(n.boundingSphere),eo.applyMatrix4(r),Yi.copy(t.ray).recast(t.near),!(eo.containsPoint(Yi.origin)===!1&&(Yi.intersectSphere(eo,Wh)===null||Yi.origin.distanceToSquared(Wh)>(t.far-t.near)**2))&&(Vh.copy(r).invert(),Yi.copy(t.ray).applyMatrix4(Vh),!(n.boundingBox!==null&&Yi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Yi)))}_computeIntersections(t,e,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,v=d.length;p<v;p++){const m=d[p],g=o[m.materialIndex],x=Math.max(m.start,f.start),w=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let M=x,E=w;M<E;M+=3){const b=a.getX(M),R=a.getX(M+1),_=a.getX(M+2);i=ao(this,g,t,n,c,h,u,b,R,_),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const p=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=p,g=v;m<g;m+=3){const x=a.getX(m),w=a.getX(m+1),M=a.getX(m+2);i=ao(this,o,t,n,c,h,u,x,w,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,v=d.length;p<v;p++){const m=d[p],g=o[m.materialIndex],x=Math.max(m.start,f.start),w=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let M=x,E=w;M<E;M+=3){const b=M,R=M+1,_=M+2;i=ao(this,g,t,n,c,h,u,b,R,_),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const p=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=p,g=v;m<g;m+=3){const x=m,w=m+1,M=m+2;i=ao(this,o,t,n,c,h,u,x,w,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function Tm(s,t,e,n,i,r,o,a){let l;if(t.side===Ke?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===pi,a),l===null)return null;oo.copy(a),oo.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(oo);return c<e.near||c>e.far?null:{distance:c,point:oo.clone(),object:s}}function ao(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,no),s.getVertexPosition(l,io),s.getVertexPosition(c,so);const h=Tm(s,t,e,n,no,io,so,$h);if(h){const u=new P;wn.getBarycoord($h,no,io,so,u),i&&(h.uv=wn.getInterpolatedAttribute(i,a,l,c,u,new dt)),r&&(h.uv1=wn.getInterpolatedAttribute(r,a,l,c,u,new dt)),o&&(h.normal=wn.getInterpolatedAttribute(o,a,l,c,u,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new P,materialIndex:0};wn.getNormal(no,io,so,d.normal),h.face=d,h.barycoord=u}return h}class Xh extends We{constructor(t=null,e=1,n=1,i,r,o,a,l,c=ze,h=ze,u,d){super(null,o,a,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ur extends fn{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ds=new ce,Yh=new ce,lo=[],qh=new Wi,Am=new ce,dr=new jt,fr=new Rs;class Kh extends jt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ur(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Am)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Wi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ds),qh.copy(t.boundingBox).applyMatrix4(Ds),this.boundingBox.union(qh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Rs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ds),fr.copy(t.boundingSphere).applyMatrix4(Ds),this.boundingSphere.union(fr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){const n=this.matrixWorld,i=this.count;if(dr.geometry=this.geometry,dr.material=this.material,dr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),fr.copy(this.boundingSphere),fr.applyMatrix4(n),t.ray.intersectsSphere(fr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ds),Yh.multiplyMatrices(n,Ds),dr.matrixWorld=Yh,dr.raycast(t,lo);for(let o=0,a=lo.length;o<a;o++){const l=lo[o];l.instanceId=r,l.object=this,e.push(l)}lo.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new ur(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Xh(new Float32Array(i*this.count),i,this.count,wa,yn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=i*t;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Dl=new P,Cm=new P,Rm=new Vt;class bi{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Dl.subVectors(n,e).cross(Cm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const i=t.delta(Dl),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Rm.getNormalMatrix(t),i=this.coplanarPoint(Dl).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const qi=new Rs,Pm=new dt(.5,.5),co=new P;class ho{constructor(t=new bi,e=new bi,n=new bi,i=new bi,r=new bi,o=new bi){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Un,n=!1){const i=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],p=r[8],v=r[9],m=r[10],g=r[11],x=r[12],w=r[13],M=r[14],E=r[15];if(i[0].setComponents(c-o,f-h,g-p,E-x).normalize(),i[1].setComponents(c+o,f+h,g+p,E+x).normalize(),i[2].setComponents(c+a,f+u,g+v,E+w).normalize(),i[3].setComponents(c-a,f-u,g-v,E-w).normalize(),n)i[4].setComponents(l,d,m,M).normalize(),i[5].setComponents(c-l,f-d,g-m,E-M).normalize();else if(i[4].setComponents(c-l,f-d,g-m,E-M).normalize(),e===Un)i[5].setComponents(c+l,f+d,g+m,E+M).normalize();else if(e===sr)i[5].setComponents(l,d,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),qi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),qi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(qi)}intersectsSprite(t){qi.center.set(0,0,0);const e=Pm.distanceTo(t.center);return qi.radius=.7071067811865476+e,qi.applyMatrix4(t.matrixWorld),this.intersectsSphere(qi)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(co.x=i.normal.x>0?t.max.x:t.min.x,co.y=i.normal.y>0?t.max.y:t.min.y,co.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(co)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Zh extends Ls{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Gt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const uo=new P,fo=new P,Jh=new ce,pr=new to,po=new Rs,Il=new P,jh=new P;class Lm extends Pe{constructor(t=new Ge,e=new Zh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)uo.fromBufferAttribute(e,i-1),fo.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=uo.distanceTo(fo);t.setAttribute("lineDistance",new fe(n,1))}else kt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),po.copy(n.boundingSphere),po.applyMatrix4(i),po.radius+=r,t.ray.intersectsSphere(po)===!1)return;Jh.copy(i).invert(),pr.copy(t.ray).applyMatrix4(Jh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let v=f,m=p-1;v<m;v+=c){const g=h.getX(v),x=h.getX(v+1),w=mo(this,t,pr,l,g,x,v);w&&e.push(w)}if(this.isLineLoop){const v=h.getX(p-1),m=h.getX(f),g=mo(this,t,pr,l,v,m,p-1);g&&e.push(g)}}else{const f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let v=f,m=p-1;v<m;v+=c){const g=mo(this,t,pr,l,v,v+1,v);g&&e.push(g)}if(this.isLineLoop){const v=mo(this,t,pr,l,p-1,f,p-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function mo(s,t,e,n,i,r,o){const a=s.geometry.attributes.position;if(uo.fromBufferAttribute(a,i),fo.fromBufferAttribute(a,r),e.distanceSqToSegment(uo,fo,Il,jh)>n)return;Il.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Il);if(!(c<t.near||c>t.far))return{distance:c,point:jh.clone().applyMatrix4(s.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:s}}const Qh=new P,tu=new P;class Dm extends Lm{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)Qh.fromBufferAttribute(e,i),tu.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Qh.distanceTo(tu);t.setAttribute("lineDistance",new fe(n,1))}else kt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class eu extends We{constructor(t=[],e=zi,n,i,r,o,a,l,c,h){super(t,e,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Is extends We{constructor(t,e,n,i,r,o,a,l,c){super(t,e,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Us extends We{constructor(t,e,n=In,i,r,o,a=ze,l=ze,c,h=qn,u=1){if(h!==qn&&h!==Gi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new hl(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Im extends Us{constructor(t,e=In,n=zi,i,r,o=ze,a=ze,l,c=qn){const h={width:t,height:t,depth:1},u=[h,h,h,h,h,h];super(t,t,e,n,i,r,o,a,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class nu extends We{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Tn extends Ge{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,i,o,2),p("x","z","y",1,-1,t,n,-e,i,o,3),p("x","y","z",1,-1,t,e,n,i,r,4),p("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new fe(c,3)),this.setAttribute("normal",new fe(h,3)),this.setAttribute("uv",new fe(u,2));function p(v,m,g,x,w,M,E,b,R,_,T){const L=M/R,D=E/_,U=M/2,G=E/2,K=b/2,N=R+1,W=_+1;let B=0,q=0;const et=new P;for(let ot=0;ot<W;ot++){const lt=ot*D-G;for(let ft=0;ft<N;ft++){const $t=ft*L-U;et[v]=$t*x,et[m]=lt*w,et[g]=K,c.push(et.x,et.y,et.z),et[v]=0,et[m]=0,et[g]=b>0?1:-1,h.push(et.x,et.y,et.z),u.push(ft/R),u.push(1-ot/_),B+=1}}for(let ot=0;ot<_;ot++)for(let lt=0;lt<R;lt++){const ft=d+lt+N*ot,$t=d+lt+N*(ot+1),ge=d+(lt+1)+N*(ot+1),ne=d+(lt+1)+N*ot;l.push(ft,$t,ne),l.push($t,ge,ne),q+=6}a.addGroup(f,q,T),f+=q,d+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Tn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class Ul extends Ge{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new P,h=new dt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new fe(o,3)),this.setAttribute("normal",new fe(a,3)),this.setAttribute("uv",new fe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ul(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ns extends Ge{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let p=0;const v=[],m=n/2;let g=0;x(),o===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new fe(u,3)),this.setAttribute("normal",new fe(d,3)),this.setAttribute("uv",new fe(f,2));function x(){const M=new P,E=new P;let b=0;const R=(e-t)/n;for(let _=0;_<=r;_++){const T=[],L=_/r,D=L*(e-t)+t;for(let U=0;U<=i;U++){const G=U/i,K=G*l+a,N=Math.sin(K),W=Math.cos(K);E.x=D*N,E.y=-L*n+m,E.z=D*W,u.push(E.x,E.y,E.z),M.set(N,R,W).normalize(),d.push(M.x,M.y,M.z),f.push(G,1-L),T.push(p++)}v.push(T)}for(let _=0;_<i;_++)for(let T=0;T<r;T++){const L=v[T][_],D=v[T+1][_],U=v[T+1][_+1],G=v[T][_+1];(t>0||T!==0)&&(h.push(L,D,G),b+=3),(e>0||T!==r-1)&&(h.push(D,U,G),b+=3)}c.addGroup(g,b,0),g+=b}function w(M){const E=p,b=new dt,R=new P;let _=0;const T=M===!0?t:e,L=M===!0?1:-1;for(let U=1;U<=i;U++)u.push(0,m*L,0),d.push(0,L,0),f.push(.5,.5),p++;const D=p;for(let U=0;U<=i;U++){const K=U/i*l+a,N=Math.cos(K),W=Math.sin(K);R.x=T*W,R.y=m*L,R.z=T*N,u.push(R.x,R.y,R.z),d.push(0,L,0),b.x=N*.5+.5,b.y=W*.5*L+.5,f.push(b.x,b.y),p++}for(let U=0;U<i;U++){const G=E+U,K=D+U;M===!0?h.push(K,K+1,G):h.push(K+1,K,G),_+=3}c.addGroup(g,_,M===!0?1:2),g+=_}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ns(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class si{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){kt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let i=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(o-h)/d;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const o=this.getPoint(i),a=this.getPoint(r),l=e||(o.isVector2?new dt:new P);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new P,i=[],r=[],o=[],a=new P,l=new ce;for(let f=0;f<=t;f++){const p=f/t;i[f]=this.getTangentAt(p,new P)}r[0]=new P,o[0]=new P;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();const p=Math.acos(Zt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(Zt(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(i[p],f*p)),o[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class iu extends si{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new dt){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Um extends iu{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Nl(){let s=0,t=0,e=0,n=0;function i(r,o,a,l){s=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){i(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,i(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return s+t*r+e*o+n*a}}}const su=new P,ru=new P,kl=new Nl,Fl=new Nl,Ol=new Nl;class ou extends si{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new P){const n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=i[(a-1)%r]:(ru.subVectors(i[0],i[1]).add(i[0]),c=ru);const u=i[a%r],d=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(su.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=su),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),p<1e-4&&(p=v),m<1e-4&&(m=v),kl.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,p,v,m),Fl.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,p,v,m),Ol.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,p,v,m)}else this.curveType==="catmullrom"&&(kl.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Fl.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Ol.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(kl.calc(l),Fl.calc(l),Ol.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new P().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function au(s,t,e,n,i){const r=(n-t)*.5,o=(i-e)*.5,a=s*s,l=s*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*s+e}function Nm(s,t){const e=1-s;return e*e*t}function km(s,t){return 2*(1-s)*s*t}function Fm(s,t){return s*s*t}function mr(s,t,e,n){return Nm(s,t)+km(s,e)+Fm(s,n)}function Om(s,t){const e=1-s;return e*e*e*t}function Bm(s,t){const e=1-s;return 3*e*e*s*t}function zm(s,t){return 3*(1-s)*s*s*t}function Hm(s,t){return s*s*s*t}function gr(s,t,e,n,i){return Om(s,t)+Bm(s,e)+zm(s,n)+Hm(s,i)}class Gm extends si{constructor(t=new dt,e=new dt,n=new dt,i=new dt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new dt){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(gr(t,i.x,r.x,o.x,a.x),gr(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Vm extends si{constructor(t=new P,e=new P,n=new P,i=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new P){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(gr(t,i.x,r.x,o.x,a.x),gr(t,i.y,r.y,o.y,a.y),gr(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Wm extends si{constructor(t=new dt,e=new dt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new dt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new dt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class $m extends si{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Xm extends si{constructor(t=new dt,e=new dt,n=new dt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new dt){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(mr(t,i.x,r.x,o.x),mr(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class lu extends si{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(mr(t,i.x,r.x,o.x),mr(t,i.y,r.y,o.y),mr(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ym extends si{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new dt){const n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,l=i[o===0?o:o-1],c=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(au(a,l.x,c.x,h.x,u.x),au(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new dt().fromArray(i))}return this}}var qm=Object.freeze({__proto__:null,ArcCurve:Um,CatmullRomCurve3:ou,CubicBezierCurve:Gm,CubicBezierCurve3:Vm,EllipseCurve:iu,LineCurve:Wm,LineCurve3:$m,QuadraticBezierCurve:Xm,QuadraticBezierCurve3:lu,SplineCurve:Ym});class mn extends Ge{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=t/a,d=e/l,f=[],p=[],v=[],m=[];for(let g=0;g<h;g++){const x=g*d-o;for(let w=0;w<c;w++){const M=w*u-r;p.push(M,-x,0),v.push(0,0,1),m.push(w/a),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let x=0;x<a;x++){const w=x+c*g,M=x+c*(g+1),E=x+1+c*(g+1),b=x+1+c*g;f.push(w,M,b),f.push(M,E,b)}this.setIndex(f),this.setAttribute("position",new fe(p,3)),this.setAttribute("normal",new fe(v,3)),this.setAttribute("uv",new fe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new mn(t.width,t.height,t.widthSegments,t.heightSegments)}}class go extends Ge{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new P,d=new P,f=[],p=[],v=[],m=[];for(let g=0;g<=n;g++){const x=[],w=g/n,M=o+w*a,E=t*Math.cos(M),b=Math.sqrt(t*t-E*E);let R=0;g===0&&o===0?R=.5/e:g===n&&l===Math.PI&&(R=-.5/e);for(let _=0;_<=e;_++){const T=_/e,L=i+T*r;u.x=-b*Math.cos(L),u.y=E,u.z=b*Math.sin(L),p.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(T+R,1-w),x.push(c++)}h.push(x)}for(let g=0;g<n;g++)for(let x=0;x<e;x++){const w=h[g][x+1],M=h[g][x],E=h[g+1][x],b=h[g+1][x+1];(g!==0||o>0)&&f.push(w,M,b),(g!==n-1||l<Math.PI)&&f.push(M,E,b)}this.setIndex(f),this.setAttribute("position",new fe(p,3)),this.setAttribute("normal",new fe(v,3)),this.setAttribute("uv",new fe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new go(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Bl extends Ge{constructor(t=new lu(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),e=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:i,closed:r};const o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new P,l=new P,c=new dt;let h=new P;const u=[],d=[],f=[],p=[];v(),this.setIndex(p),this.setAttribute("position",new fe(u,3)),this.setAttribute("normal",new fe(d,3)),this.setAttribute("uv",new fe(f,2));function v(){for(let w=0;w<e;w++)m(w);m(r===!1?e:0),x(),g()}function m(w){h=t.getPointAt(w/e,h);const M=o.normals[w],E=o.binormals[w];for(let b=0;b<=i;b++){const R=b/i*Math.PI*2,_=Math.sin(R),T=-Math.cos(R);l.x=T*M.x+_*E.x,l.y=T*M.y+_*E.y,l.z=T*M.z+_*E.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function g(){for(let w=1;w<=e;w++)for(let M=1;M<=i;M++){const E=(i+1)*(w-1)+(M-1),b=(i+1)*w+(M-1),R=(i+1)*w+M,_=(i+1)*(w-1)+M;p.push(E,b,_),p.push(b,R,_)}}function x(){for(let w=0;w<=e;w++)for(let M=0;M<=i;M++)c.x=w/e,c.y=M/i,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Bl(new qm[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}function ks(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];if(cu(i))i.isRenderTargetTexture?(kt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(cu(i[0])){const r=[];for(let o=0,a=i.length;o<a;o++)r[o]=i[o].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function Je(s){const t={};for(let e=0;e<s.length;e++){const n=ks(s[e]);for(const i in n)t[i]=n[i]}return t}function cu(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Km(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function hu(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:re.workingColorSpace}const xo={clone:ks,merge:Je};var Zm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Jm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class De extends Ls{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Zm,this.fragmentShader=Jm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ks(t.uniforms),this.uniformsGroups=Km(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new Gt().setHex(i.value);break;case"v2":this.uniforms[n].value=new dt().fromArray(i.value);break;case"v3":this.uniforms[n].value=new P().fromArray(i.value);break;case"v4":this.uniforms[n].value=new be().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Vt().fromArray(i.value);break;case"m4":this.uniforms[n].value=new ce().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class jm extends De{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Qe extends Ls{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Gt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=sl,this.normalScale=new dt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Zn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Qm extends Ls{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Up,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class t0 extends Ls{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class vo extends Pe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Gt(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class e0 extends vo{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Gt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const zl=new ce,uu=new P,du=new P;class Hl{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new dt(512,512),this.mapType=rn,this.map=null,this.mapPass=null,this.matrix=new ce,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ho,this._frameExtents=new dt(1,1),this._viewportCount=1,this._viewports=[new be(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;uu.setFromMatrixPosition(t.matrixWorld),e.position.copy(uu),du.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(du),e.updateMatrixWorld(),zl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zl,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===sr||e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(zl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const _o=new P,yo=new Nn,kn=new P;class fu extends Pe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ce,this.projectionMatrix=new ce,this.projectionMatrixInverse=new ce,this.coordinateSystem=Un,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(_o,yo,kn),kn.x===1&&kn.y===1&&kn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_o,yo,kn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(_o,yo,kn),kn.x===1&&kn.y===1&&kn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_o,yo,kn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Si=new P,pu=new dt,mu=new dt;class tn extends fu{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=gs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(rr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return gs*2*Math.atan(Math.tan(rr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Si.x,Si.y).multiplyScalar(-t/Si.z),Si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Si.x,Si.y).multiplyScalar(-t/Si.z)}getViewSize(t,e){return this.getViewBounds(t,pu,mu),e.subVectors(mu,pu)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(rr*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class n0 extends Hl{constructor(){super(new tn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=gs*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||i!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=i,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class i0 extends vo{constructor(t,e,n=0,i=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.target=new Pe,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new n0}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}}class s0 extends Hl{constructor(){super(new tn(90,1,.5,500)),this.isPointLightShadow=!0}}class Gl extends vo{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new s0}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class Mo extends fu{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class r0 extends Hl{constructor(){super(new Mo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class o0 extends vo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.target=new Pe,this.shadow=new r0}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}const Fs=-90,Os=1;class a0 extends Pe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new tn(Fs,Os,t,e);i.layers=this.layers,this.add(i);const r=new tn(Fs,Os,t,e);r.layers=this.layers,this.add(r);const o=new tn(Fs,Os,t,e);o.layers=this.layers,this.add(o);const a=new tn(Fs,Os,t,e);a.layers=this.layers,this.add(a);const l=new tn(Fs,Os,t,e);l.layers=this.layers,this.add(l);const c=new tn(Fs,Os,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Un)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===sr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class l0 extends tn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class c0{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=h0.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function h0(){this._document.hidden===!1&&this.reset()}const gu=new ce;class u0{constructor(t,e,n=0,i=1/0){this.ray=new to(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new fl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):oe("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return gu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(gu),this}intersectObject(t,e=!0,n=[]){return Vl(t,this,n,e),n.sort(xu),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)Vl(t[i],this,n,e);return n.sort(xu),n}}function xu(s,t){return s.distance-t.distance}function Vl(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let o=0,a=r.length;o<a;o++)Vl(r[o],t,e,!0)}}class d0{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,kt("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}class Wl{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Zt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Zt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Ac=class Ac{constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){const r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=i,this}};Ac.prototype.isMatrix2=!0;let vu=Ac;class f0 extends gi{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){kt("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function _u(s,t,e,n){const i=p0(n);switch(e){case _h:return s*t;case wa:return s*t/i.components*i.byteLength;case Ea:return s*t/i.components*i.byteLength;case Vi:return s*t*2/i.components*i.byteLength;case Ta:return s*t*2/i.components*i.byteLength;case yh:return s*t*3/i.components*i.byteLength;case Mn:return s*t*4/i.components*i.byteLength;case Aa:return s*t*4/i.components*i.byteLength;case kr:case Fr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Or:case Br:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ra:case La:return Math.max(s,16)*Math.max(t,8)/4;case Ca:case Pa:return Math.max(s,8)*Math.max(t,8)/2;case Da:case Ia:case Na:case ka:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Ua:case zr:case Fa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Oa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ba:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case za:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Ha:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Ga:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Va:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Wa:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case $a:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Xa:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Ya:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case qa:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case Ka:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Za:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Ja:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case ja:case Qa:case tl:return Math.ceil(s/4)*Math.ceil(t/4)*16;case el:case nl:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Hr:case il:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function p0(s){switch(s){case rn:case mh:return{byteLength:1,components:1};case er:case gh:case on:return{byteLength:2,components:1};case ba:case Sa:return{byteLength:2,components:4};case In:case Ma:case yn:return{byteLength:4,components:1};case xh:case vh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:oa}})),typeof window<"u"&&(window.__THREE__?kt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=oa);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function yu(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function m0(s){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,u=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const h=l.array,u=l.updateRanges;if(s.bindBuffer(c,a),u.length===0)s.bufferSubData(c,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){const p=u[d],v=u[f];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){const v=u[f];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(s.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var g0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,x0=`#ifdef USE_ALPHAHASH
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
#endif`,v0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,_0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,y0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,M0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,b0=`#ifdef USE_AOMAP
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
#endif`,S0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,w0=`#ifdef USE_BATCHING
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
#endif`,E0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,T0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,A0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,C0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,R0=`#ifdef USE_IRIDESCENCE
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
#endif`,P0=`#ifdef USE_BUMPMAP
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
#endif`,L0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,D0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,I0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,U0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,N0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,k0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,F0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,O0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,B0=`#define PI 3.141592653589793
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
} // validated`,z0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,H0=`vec3 transformedNormal = objectNormal;
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
#endif`,G0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,V0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,W0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,$0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,X0="gl_FragColor = linearToOutputTexel( gl_FragColor );",Y0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,q0=`#ifdef USE_ENVMAP
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
#endif`,K0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Z0=`#ifdef USE_ENVMAP
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
#endif`,J0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,j0=`#ifdef USE_ENVMAP
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
#endif`,Q0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,tg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,eg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ng=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ig=`#ifdef USE_GRADIENTMAP
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
}`,sg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,rg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,og=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ag=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,lg=`#ifdef USE_ENVMAP
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
#endif`,cg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,hg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ug=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,dg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,fg=`PhysicalMaterial material;
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
#endif`,pg=`uniform sampler2D dfgLUT;
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
}`,mg=`
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
#endif`,gg=`#if defined( RE_IndirectDiffuse )
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
#endif`,xg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,vg=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,_g=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,yg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Mg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Sg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Eg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Tg=`#if defined( USE_POINTS_UV )
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
#endif`,Ag=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Rg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Pg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Lg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dg=`#ifdef USE_MORPHTARGETS
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
#endif`,Ig=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ug=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Ng=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,kg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Fg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Og=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Bg=`#ifdef USE_NORMALMAP
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
#endif`,zg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Hg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Gg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Vg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Wg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$g=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Xg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Yg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,qg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Kg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Zg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,jg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Qg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,tx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ex=`float getShadowMask() {
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
}`,nx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ix=`#ifdef USE_SKINNING
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
#endif`,sx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,rx=`#ifdef USE_SKINNING
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
#endif`,ox=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ax=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,lx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,cx=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,hx=`#ifdef USE_TRANSMISSION
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
#endif`,ux=`#ifdef USE_TRANSMISSION
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
#endif`,dx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,px=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Jt={alphahash_fragment:g0,alphahash_pars_fragment:x0,alphamap_fragment:v0,alphamap_pars_fragment:_0,alphatest_fragment:y0,alphatest_pars_fragment:M0,aomap_fragment:b0,aomap_pars_fragment:S0,batching_pars_vertex:w0,batching_vertex:E0,begin_vertex:T0,beginnormal_vertex:A0,bsdfs:C0,iridescence_fragment:R0,bumpmap_pars_fragment:P0,clipping_planes_fragment:L0,clipping_planes_pars_fragment:D0,clipping_planes_pars_vertex:I0,clipping_planes_vertex:U0,color_fragment:N0,color_pars_fragment:k0,color_pars_vertex:F0,color_vertex:O0,common:B0,cube_uv_reflection_fragment:z0,defaultnormal_vertex:H0,displacementmap_pars_vertex:G0,displacementmap_vertex:V0,emissivemap_fragment:W0,emissivemap_pars_fragment:$0,colorspace_fragment:X0,colorspace_pars_fragment:Y0,envmap_fragment:q0,envmap_common_pars_fragment:K0,envmap_pars_fragment:Z0,envmap_pars_vertex:J0,envmap_physical_pars_fragment:lg,envmap_vertex:j0,fog_vertex:Q0,fog_pars_vertex:tg,fog_fragment:eg,fog_pars_fragment:ng,gradientmap_pars_fragment:ig,lightmap_pars_fragment:sg,lights_lambert_fragment:rg,lights_lambert_pars_fragment:og,lights_pars_begin:ag,lights_toon_fragment:cg,lights_toon_pars_fragment:hg,lights_phong_fragment:ug,lights_phong_pars_fragment:dg,lights_physical_fragment:fg,lights_physical_pars_fragment:pg,lights_fragment_begin:mg,lights_fragment_maps:gg,lights_fragment_end:xg,lightprobes_pars_fragment:vg,logdepthbuf_fragment:_g,logdepthbuf_pars_fragment:yg,logdepthbuf_pars_vertex:Mg,logdepthbuf_vertex:bg,map_fragment:Sg,map_pars_fragment:wg,map_particle_fragment:Eg,map_particle_pars_fragment:Tg,metalnessmap_fragment:Ag,metalnessmap_pars_fragment:Cg,morphinstance_vertex:Rg,morphcolor_vertex:Pg,morphnormal_vertex:Lg,morphtarget_pars_vertex:Dg,morphtarget_vertex:Ig,normal_fragment_begin:Ug,normal_fragment_maps:Ng,normal_pars_fragment:kg,normal_pars_vertex:Fg,normal_vertex:Og,normalmap_pars_fragment:Bg,clearcoat_normal_fragment_begin:zg,clearcoat_normal_fragment_maps:Hg,clearcoat_pars_fragment:Gg,iridescence_pars_fragment:Vg,opaque_fragment:Wg,packing:$g,premultiplied_alpha_fragment:Xg,project_vertex:Yg,dithering_fragment:qg,dithering_pars_fragment:Kg,roughnessmap_fragment:Zg,roughnessmap_pars_fragment:Jg,shadowmap_pars_fragment:jg,shadowmap_pars_vertex:Qg,shadowmap_vertex:tx,shadowmask_pars_fragment:ex,skinbase_vertex:nx,skinning_pars_vertex:ix,skinning_vertex:sx,skinnormal_vertex:rx,specularmap_fragment:ox,specularmap_pars_fragment:ax,tonemapping_fragment:lx,tonemapping_pars_fragment:cx,transmission_fragment:hx,transmission_pars_fragment:ux,uv_pars_fragment:dx,uv_pars_vertex:fx,uv_vertex:px,worldpos_vertex:mx,background_vert:`varying vec2 vUv;
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
}`},xt={common:{diffuse:{value:new Gt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Vt}},envmap:{envMap:{value:null},envMapRotation:{value:new Vt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Vt},normalScale:{value:new dt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Gt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new P},probesMax:{value:new P},probesResolution:{value:new P}},points:{diffuse:{value:new Gt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0},uvTransform:{value:new Vt}},sprite:{diffuse:{value:new Gt(16777215)},opacity:{value:1},center:{value:new dt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}}},Fn={basic:{uniforms:Je([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.fog]),vertexShader:Jt.meshbasic_vert,fragmentShader:Jt.meshbasic_frag},lambert:{uniforms:Je([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new Gt(0)},envMapIntensity:{value:1}}]),vertexShader:Jt.meshlambert_vert,fragmentShader:Jt.meshlambert_frag},phong:{uniforms:Je([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new Gt(0)},specular:{value:new Gt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphong_vert,fragmentShader:Jt.meshphong_frag},standard:{uniforms:Je([xt.common,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.roughnessmap,xt.metalnessmap,xt.fog,xt.lights,{emissive:{value:new Gt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag},toon:{uniforms:Je([xt.common,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.gradientmap,xt.fog,xt.lights,{emissive:{value:new Gt(0)}}]),vertexShader:Jt.meshtoon_vert,fragmentShader:Jt.meshtoon_frag},matcap:{uniforms:Je([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,{matcap:{value:null}}]),vertexShader:Jt.meshmatcap_vert,fragmentShader:Jt.meshmatcap_frag},points:{uniforms:Je([xt.points,xt.fog]),vertexShader:Jt.points_vert,fragmentShader:Jt.points_frag},dashed:{uniforms:Je([xt.common,xt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Jt.linedashed_vert,fragmentShader:Jt.linedashed_frag},depth:{uniforms:Je([xt.common,xt.displacementmap]),vertexShader:Jt.depth_vert,fragmentShader:Jt.depth_frag},normal:{uniforms:Je([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,{opacity:{value:1}}]),vertexShader:Jt.meshnormal_vert,fragmentShader:Jt.meshnormal_frag},sprite:{uniforms:Je([xt.sprite,xt.fog]),vertexShader:Jt.sprite_vert,fragmentShader:Jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Jt.background_vert,fragmentShader:Jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Vt}},vertexShader:Jt.backgroundCube_vert,fragmentShader:Jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Jt.cube_vert,fragmentShader:Jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Jt.equirect_vert,fragmentShader:Jt.equirect_frag},distance:{uniforms:Je([xt.common,xt.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Jt.distance_vert,fragmentShader:Jt.distance_frag},shadow:{uniforms:Je([xt.lights,xt.fog,{color:{value:new Gt(0)},opacity:{value:1}}]),vertexShader:Jt.shadow_vert,fragmentShader:Jt.shadow_frag}};Fn.physical={uniforms:Je([Fn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Vt},clearcoatNormalScale:{value:new dt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Vt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Vt},sheen:{value:0},sheenColor:{value:new Gt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Vt},transmissionSamplerSize:{value:new dt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Vt},attenuationDistance:{value:0},attenuationColor:{value:new Gt(0)},specularColor:{value:new Gt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Vt},anisotropyVector:{value:new dt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Vt}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag};const bo={r:0,b:0,g:0},gx=new ce,Mu=new Vt;Mu.set(-1,0,0,0,1,0,0,0,1);function xx(s,t,e,n,i,r){const o=new Gt(0);let a=i===!0?0:1,l,c,h=null,u=0,d=null;function f(x){let w=x.isScene===!0?x.background:null;if(w&&w.isTexture){const M=x.backgroundBlurriness>0;w=t.get(w,M)}return w}function p(x){let w=!1;const M=f(x);M===null?m(o,a):M&&M.isColor&&(m(M,1),w=!0);const E=s.xr.getEnvironmentBlendMode();E==="additive"?e.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||w)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function v(x,w){const M=f(w);M&&(M.isCubeTexture||M.mapping===Ir)?(c===void 0&&(c=new jt(new Tn(1,1,1),new De({name:"BackgroundCubeMaterial",uniforms:ks(Fn.backgroundCube.uniforms),vertexShader:Fn.backgroundCube.vertexShader,fragmentShader:Fn.backgroundCube.fragmentShader,side:Ke,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,b,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(gx.makeRotationFromEuler(w.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Mu),c.material.toneMapped=re.getTransfer(M.colorSpace)!==he,(h!==M||u!==M.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,h=M,u=M.version,d=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new jt(new mn(2,2),new De({name:"BackgroundMaterial",uniforms:ks(Fn.background.uniforms),vertexShader:Fn.background.vertexShader,fragmentShader:Fn.background.fragmentShader,side:pi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=re.getTransfer(M.colorSpace)!==he,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||u!==M.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,h=M,u=M.version,d=s.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function m(x,w){x.getRGB(bo,hu(s)),e.buffers.color.setClear(bo.r,bo.g,bo.b,w,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(x,w=1){o.set(x),a=w,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(x){a=x,m(o,a)},render:p,addToRenderList:v,dispose:g}}function vx(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,o=!1;function a(D,U,G,K,N){let W=!1;const B=u(D,K,G,U);r!==B&&(r=B,c(r.object)),W=f(D,K,G,N),W&&p(D,K,G,N),N!==null&&t.update(N,s.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,M(D,U,G,K),N!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function l(){return s.createVertexArray()}function c(D){return s.bindVertexArray(D)}function h(D){return s.deleteVertexArray(D)}function u(D,U,G,K){const N=K.wireframe===!0;let W=n[U.id];W===void 0&&(W={},n[U.id]=W);const B=D.isInstancedMesh===!0?D.id:0;let q=W[B];q===void 0&&(q={},W[B]=q);let et=q[G.id];et===void 0&&(et={},q[G.id]=et);let ot=et[N];return ot===void 0&&(ot=d(l()),et[N]=ot),ot}function d(D){const U=[],G=[],K=[];for(let N=0;N<e;N++)U[N]=0,G[N]=0,K[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:G,attributeDivisors:K,object:D,attributes:{},index:null}}function f(D,U,G,K){const N=r.attributes,W=U.attributes;let B=0;const q=G.getAttributes();for(const et in q)if(q[et].location>=0){const lt=N[et];let ft=W[et];if(ft===void 0&&(et==="instanceMatrix"&&D.instanceMatrix&&(ft=D.instanceMatrix),et==="instanceColor"&&D.instanceColor&&(ft=D.instanceColor)),lt===void 0||lt.attribute!==ft||ft&&lt.data!==ft.data)return!0;B++}return r.attributesNum!==B||r.index!==K}function p(D,U,G,K){const N={},W=U.attributes;let B=0;const q=G.getAttributes();for(const et in q)if(q[et].location>=0){let lt=W[et];lt===void 0&&(et==="instanceMatrix"&&D.instanceMatrix&&(lt=D.instanceMatrix),et==="instanceColor"&&D.instanceColor&&(lt=D.instanceColor));const ft={};ft.attribute=lt,lt&&lt.data&&(ft.data=lt.data),N[et]=ft,B++}r.attributes=N,r.attributesNum=B,r.index=K}function v(){const D=r.newAttributes;for(let U=0,G=D.length;U<G;U++)D[U]=0}function m(D){g(D,0)}function g(D,U){const G=r.newAttributes,K=r.enabledAttributes,N=r.attributeDivisors;G[D]=1,K[D]===0&&(s.enableVertexAttribArray(D),K[D]=1),N[D]!==U&&(s.vertexAttribDivisor(D,U),N[D]=U)}function x(){const D=r.newAttributes,U=r.enabledAttributes;for(let G=0,K=U.length;G<K;G++)U[G]!==D[G]&&(s.disableVertexAttribArray(G),U[G]=0)}function w(D,U,G,K,N,W,B){B===!0?s.vertexAttribIPointer(D,U,G,N,W):s.vertexAttribPointer(D,U,G,K,N,W)}function M(D,U,G,K){v();const N=K.attributes,W=G.getAttributes(),B=U.defaultAttributeValues;for(const q in W){const et=W[q];if(et.location>=0){let ot=N[q];if(ot===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(ot=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(ot=D.instanceColor)),ot!==void 0){const lt=ot.normalized,ft=ot.itemSize,$t=t.get(ot);if($t===void 0)continue;const ge=$t.buffer,ne=$t.type,j=$t.bytesPerElement,ct=ne===s.INT||ne===s.UNSIGNED_INT||ot.gpuType===Ma;if(ot.isInterleavedBufferAttribute){const st=ot.data,Ot=st.stride,Wt=ot.offset;if(st.isInstancedInterleavedBuffer){for(let Ft=0;Ft<et.locationSize;Ft++)g(et.location+Ft,st.meshPerAttribute);D.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let Ft=0;Ft<et.locationSize;Ft++)m(et.location+Ft);s.bindBuffer(s.ARRAY_BUFFER,ge);for(let Ft=0;Ft<et.locationSize;Ft++)w(et.location+Ft,ft/et.locationSize,ne,lt,Ot*j,(Wt+ft/et.locationSize*Ft)*j,ct)}else{if(ot.isInstancedBufferAttribute){for(let st=0;st<et.locationSize;st++)g(et.location+st,ot.meshPerAttribute);D.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let st=0;st<et.locationSize;st++)m(et.location+st);s.bindBuffer(s.ARRAY_BUFFER,ge);for(let st=0;st<et.locationSize;st++)w(et.location+st,ft/et.locationSize,ne,lt,ft*j,ft/et.locationSize*st*j,ct)}}else if(B!==void 0){const lt=B[q];if(lt!==void 0)switch(lt.length){case 2:s.vertexAttrib2fv(et.location,lt);break;case 3:s.vertexAttrib3fv(et.location,lt);break;case 4:s.vertexAttrib4fv(et.location,lt);break;default:s.vertexAttrib1fv(et.location,lt)}}}}x()}function E(){T();for(const D in n){const U=n[D];for(const G in U){const K=U[G];for(const N in K){const W=K[N];for(const B in W)h(W[B].object),delete W[B];delete K[N]}}delete n[D]}}function b(D){if(n[D.id]===void 0)return;const U=n[D.id];for(const G in U){const K=U[G];for(const N in K){const W=K[N];for(const B in W)h(W[B].object),delete W[B];delete K[N]}}delete n[D.id]}function R(D){for(const U in n){const G=n[U];for(const K in G){const N=G[K];if(N[D.id]===void 0)continue;const W=N[D.id];for(const B in W)h(W[B].object),delete W[B];delete N[D.id]}}}function _(D){for(const U in n){const G=n[U],K=D.isInstancedMesh===!0?D.id:0,N=G[K];if(N!==void 0){for(const W in N){const B=N[W];for(const q in B)h(B[q].object),delete B[q];delete N[W]}delete G[K],Object.keys(G).length===0&&delete n[U]}}}function T(){L(),o=!0,r!==i&&(r=i,c(r.object))}function L(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:T,resetDefaultState:L,dispose:E,releaseStatesOfGeometry:b,releaseStatesOfObject:_,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:m,disableUnusedAttributes:x}}function _x(s,t,e){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];e.update(d,n,1)}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function yx(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(R){return!(R!==Mn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const _=R===on&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==rn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==yn&&!_)}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(kt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&d===!1&&kt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),w=s.getParameter(s.MAX_VARYING_VECTORS),M=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),E=s.getParameter(s.MAX_SAMPLES),b=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:x,maxVaryings:w,maxFragmentUniforms:M,maxSamples:E,samples:b}}function Mx(s){const t=this;let e=null,n=0,i=!1,r=!1;const o=new bi,a=new Vt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const p=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,g=s.get(u);if(!i||p===null||p.length===0||r&&!m)r?h(null):c();else{const x=r?0:n,w=x*4;let M=g.clippingState||null;l.value=M,M=h(p,d,w,f);for(let E=0;E!==w;++E)M[E]=e[E];g.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,p){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,p!==!0||m===null){const g=f+v*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<g)&&(m=new Float32Array(g));for(let w=0,M=f;w!==v;++w,M+=4)o.copy(u[w]).applyMatrix4(x,a),o.normal.toArray(m,M),m[M+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}const wi=4,bu=[.125,.215,.35,.446,.526,.582],Ki=20,bx=256,xr=new Mo,Su=new Gt;let $l=null,Xl=0,Yl=0,ql=!1;const Sx=new P;class wu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){const{size:o=256,position:a=Sx}=r;$l=this._renderer.getRenderTarget(),Xl=this._renderer.getActiveCubeFace(),Yl=this._renderer.getActiveMipmapLevel(),ql=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Au(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Tu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget($l,Xl,Yl),this._renderer.xr.enabled=ql,t.scissorTest=!1,Bs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===zi||t.mapping===fs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),$l=this._renderer.getRenderTarget(),Xl=this._renderer.getActiveCubeFace(),Yl=this._renderer.getActiveMipmapLevel(),ql=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:He,minFilter:He,generateMipmaps:!1,type:on,format:Mn,colorSpace:ir,depthBuffer:!1},i=Eu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Eu(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=wx(r)),this._blurMaterial=Tx(r,t,e),this._ggxMaterial=Ex(r,t,e)}return i}_compileMaterial(t){const e=new jt(new Ge,t);this._renderer.compile(e,xr)}_sceneToCubeUV(t,e,n,i,r){const l=new tn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Su),u.toneMapping=Dn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new jt(new Tn,new ii({name:"PMREM.Background",side:Ke,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,m=v.material;let g=!1;const x=t.background;x?x.isColor&&(m.color.copy(x),t.background=null,g=!0):(m.color.copy(Su),g=!0);for(let w=0;w<6;w++){const M=w%3;M===0?(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[w],r.y,r.z)):M===1?(l.up.set(0,0,c[w]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[w],r.z)):(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[w]));const E=this._cubeSize;Bs(i,M*E,w>2?E:0,E,E),u.setRenderTarget(i),g&&u.render(v,l),u.render(t,l)}u.toneMapping=f,u.autoClear=d,t.background=x}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===zi||t.mapping===fs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Au()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Tu());const r=i?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;const a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Bs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,xr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const i=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;const l=o.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=0+c*1.25,f=u*d,{_lodMax:p}=this,v=this._sizeLods[n],m=3*v*(n>p-wi?n-p+wi:0),g=4*(this._cubeSize-v);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=p-e,Bs(r,m,g,3*v,2*v),i.setRenderTarget(r),i.render(a,xr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,Bs(t,m,g,3*v,2*v),i.setRenderTarget(t),i.render(a,xr)}_blur(t,e,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&oe("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[i];u.material=c;const d=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Ki-1),v=r/p,m=isFinite(r)?1+Math.floor(h*v):Ki;m>Ki&&kt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ki}`);const g=[];let x=0;for(let R=0;R<Ki;++R){const _=R/v,T=Math.exp(-_*_/2);g.push(T),R===0?x+=T:R<m&&(x+=2*T)}for(let R=0;R<g.length;R++)g[R]=g[R]/x;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:w}=this;d.dTheta.value=p,d.mipInt.value=w-n;const M=this._sizeLods[i],E=3*M*(i>w-wi?i-w+wi:0),b=4*(this._cubeSize-M);Bs(e,E,b,3*M,2*M),l.setRenderTarget(e),l.render(u,xr)}}function wx(s){const t=[],e=[],n=[];let i=s;const r=s-wi+1+bu.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>s-wi?l=bu[o-s+wi-1]:o===0&&(l=0),e.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,v=3,m=2,g=1,x=new Float32Array(v*p*f),w=new Float32Array(m*p*f),M=new Float32Array(g*p*f);for(let b=0;b<f;b++){const R=b%3*2/3-1,_=b>2?0:-1,T=[R,_,0,R+2/3,_,0,R+2/3,_+1,0,R,_,0,R+2/3,_+1,0,R,_+1,0];x.set(T,v*p*b),w.set(d,m*p*b);const L=[b,b,b,b,b,b];M.set(L,g*p*b)}const E=new Ge;E.setAttribute("position",new fn(x,v)),E.setAttribute("uv",new fn(w,m)),E.setAttribute("faceIndex",new fn(M,g)),n.push(new jt(E,null)),i>wi&&i--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function Eu(s,t,e){const n=new je(s,t,e);return n.texture.mapping=Ir,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Bs(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function Ex(s,t,e){return new De({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:bx,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:So(),fragmentShader:`

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
		`,blending:Ln,depthTest:!1,depthWrite:!1})}function Tx(s,t,e){const n=new Float32Array(Ki),i=new P(0,1,0);return new De({name:"SphericalGaussianBlur",defines:{n:Ki,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:So(),fragmentShader:`

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
		`,blending:Ln,depthTest:!1,depthWrite:!1})}function Tu(){return new De({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:So(),fragmentShader:`

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
		`,blending:Ln,depthTest:!1,depthWrite:!1})}function Au(){return new De({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:So(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ln,depthTest:!1,depthWrite:!1})}function So(){return`

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
	`}class Cu extends je{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new eu(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Tn(5,5,5),r=new De({name:"CubemapFromEquirect",uniforms:ks(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ke,blending:Ln});r.uniforms.tEquirect.value=e;const o=new jt(i,r),a=e.minFilter;return e.minFilter===Hi&&(e.minFilter=He),new a0(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}}function Ax(s){let t=new WeakMap,e=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?o(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===xa||f===va)if(t.has(d)){const p=t.get(d).texture;return a(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const v=new Cu(p.height);return v.fromEquirectangularTexture(s,d),t.set(d,v),d.addEventListener("dispose",c),a(v.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture){const f=d.mapping,p=f===xa||f===va,v=f===zi||f===fs;if(p||v){let m=e.get(d);const g=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return n===null&&(n=new wu(s)),m=p?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),m.texture;if(m!==void 0)return m.texture;{const x=d.image;return p&&x&&x.height>0||v&&x&&l(x)?(n===null&&(n=new wu(s)),m=p?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function a(d,f){return f===xa?d.mapping=zi:f===va&&(d.mapping=fs),d}function l(d){let f=0;const p=6;for(let v=0;v<p;v++)d[v]!==void 0&&f++;return f===p}function c(d){const f=d.target;f.removeEventListener("dispose",c);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function u(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function Cx(s){const t={};function e(n){if(t[n]!==void 0)return t[n];const i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&ms("WebGLRenderer: "+n+" extension not supported."),i}}}function Rx(s,t,e,n){const i={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const p in d.attributes)t.remove(d.attributes[p]);d.removeEventListener("dispose",o),delete i[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)t.update(d[f],s.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,p=u.attributes.position;let v=0;if(p===void 0)return;if(f!==null){const x=f.array;v=f.version;for(let w=0,M=x.length;w<M;w+=3){const E=x[w+0],b=x[w+1],R=x[w+2];d.push(E,b,b,R,R,E)}}else{const x=p.array;v=p.version;for(let w=0,M=x.length/3-1;w<M;w+=3){const E=w+0,b=w+1,R=w+2;d.push(E,b,b,R,R,E)}}const m=new(p.count>=65535?Gh:Hh)(d,1);m.version=v;const g=r.get(u);g&&t.remove(g),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Px(s,t,e){let n;function i(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,d){s.drawElements(n,d,r,u*o),e.update(d,n,1)}function c(u,d,f){f!==0&&(s.drawElementsInstanced(n,d,r,u*o,f),e.update(d,n,f))}function h(u,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let v=0;for(let m=0;m<f;m++)v+=d[m];e.update(v,n,1)}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Lx(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:oe("WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Dx(s,t,e){const n=new WeakMap,i=new be;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let T=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",T)};d!==void 0&&d.texture.dispose();const f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let w=0;f===!0&&(w=1),p===!0&&(w=2),v===!0&&(w=3);let M=a.attributes.position.count*w,E=1;M>t.maxTextureSize&&(E=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const b=new Float32Array(M*E*4*u),R=new Lh(b,M,E,u);R.type=yn,R.needsUpdate=!0;const _=w*4;for(let L=0;L<u;L++){const D=m[L],U=g[L],G=x[L],K=M*E*4*L;for(let N=0;N<D.count;N++){const W=N*_;f===!0&&(i.fromBufferAttribute(D,N),b[K+W+0]=i.x,b[K+W+1]=i.y,b[K+W+2]=i.z,b[K+W+3]=0),p===!0&&(i.fromBufferAttribute(U,N),b[K+W+4]=i.x,b[K+W+5]=i.y,b[K+W+6]=i.z,b[K+W+7]=0),v===!0&&(i.fromBufferAttribute(G,N),b[K+W+8]=i.x,b[K+W+9]=i.y,b[K+W+10]=i.z,b[K+W+11]=G.itemSize===4?i.w:1)}}d={count:u,texture:R,size:new dt(M,E)},n.set(a,d),a.addEventListener("dispose",T)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",p),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function Ix(s,t,e,n,i){let r=new WeakMap;function o(c){const h=i.render.frame,u=c.geometry,d=t.get(c,u);if(r.get(d)!==h&&(t.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function a(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}const Ux={[lh]:"LINEAR_TONE_MAPPING",[ch]:"REINHARD_TONE_MAPPING",[hh]:"CINEON_TONE_MAPPING",[ga]:"ACES_FILMIC_TONE_MAPPING",[dh]:"AGX_TONE_MAPPING",[fh]:"NEUTRAL_TONE_MAPPING",[uh]:"CUSTOM_TONE_MAPPING"};function Nx(s,t,e,n,i,r){const o=new je(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,depthTexture:i?new Us(t,e):void 0}),a=new je(t,e,{type:on,depthBuffer:!1,stencilBuffer:!1}),l=new Ge;l.setAttribute("position",new fe([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new fe([0,2,0,0,2,0],2));const c=new jm({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new jt(l,c),u=new Mo(-1,1,1,-1,0,1);let d=null,f=null,p=!1,v,m=null,g=[],x=!1;this.setSize=function(w,M){o.setSize(w,M),a.setSize(w,M);for(let E=0;E<g.length;E++){const b=g[E];b.setSize&&b.setSize(w,M)}},this.setEffects=function(w){g=w,x=g.length>0&&g[0].isRenderPass===!0;const M=o.width,E=o.height;for(let b=0;b<g.length;b++){const R=g[b];R.setSize&&R.setSize(M,E)}},this.begin=function(w,M){if(p||w.toneMapping===Dn&&g.length===0)return!1;if(m=M,M!==null){const E=M.width,b=M.height;(o.width!==E||o.height!==b)&&this.setSize(E,b)}return x===!1&&w.setRenderTarget(o),v=w.toneMapping,w.toneMapping=Dn,!0},this.hasRenderPass=function(){return x},this.end=function(w,M){w.toneMapping=v,p=!0;let E=o,b=a;for(let R=0;R<g.length;R++){const _=g[R];if(_.enabled!==!1&&(_.render(w,b,E,M),_.needsSwap!==!1)){const T=E;E=b,b=T}}if(d!==w.outputColorSpace||f!==w.toneMapping){d=w.outputColorSpace,f=w.toneMapping,c.defines={},re.getTransfer(d)===he&&(c.defines.SRGB_TRANSFER="");const R=Ux[f];R&&(c.defines[R]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=E.texture,w.setRenderTarget(m),w.render(h,u),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),a.dispose(),l.dispose(),c.dispose()}}const Ru=new We,Kl=new Us(1,1),Pu=new Lh,Lu=new fm,Du=new eu,Iu=[],Uu=[],Nu=new Float32Array(16),ku=new Float32Array(9),Fu=new Float32Array(4);function zs(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=Iu[i];if(r===void 0&&(r=new Float32Array(i),Iu[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function Ie(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Ue(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function wo(s,t){let e=Uu[t];e===void 0&&(e=new Int32Array(t),Uu[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function kx(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Fx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;s.uniform2fv(this.addr,t),Ue(e,t)}}function Ox(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ie(e,t))return;s.uniform3fv(this.addr,t),Ue(e,t)}}function Bx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;s.uniform4fv(this.addr,t),Ue(e,t)}}function zx(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Ue(e,t)}else{if(Ie(e,n))return;Fu.set(n),s.uniformMatrix2fv(this.addr,!1,Fu),Ue(e,n)}}function Hx(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Ue(e,t)}else{if(Ie(e,n))return;ku.set(n),s.uniformMatrix3fv(this.addr,!1,ku),Ue(e,n)}}function Gx(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Ue(e,t)}else{if(Ie(e,n))return;Nu.set(n),s.uniformMatrix4fv(this.addr,!1,Nu),Ue(e,n)}}function Vx(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Wx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;s.uniform2iv(this.addr,t),Ue(e,t)}}function $x(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;s.uniform3iv(this.addr,t),Ue(e,t)}}function Xx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;s.uniform4iv(this.addr,t),Ue(e,t)}}function Yx(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function qx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;s.uniform2uiv(this.addr,t),Ue(e,t)}}function Kx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;s.uniform3uiv(this.addr,t),Ue(e,t)}}function Zx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;s.uniform4uiv(this.addr,t),Ue(e,t)}}function Jx(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Kl.compareFunction=e.isReversedDepthBuffer()?ol:rl,r=Kl):r=Ru,e.setTexture2D(t||r,i)}function jx(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Lu,i)}function Qx(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Du,i)}function tv(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Pu,i)}function ev(s){switch(s){case 5126:return kx;case 35664:return Fx;case 35665:return Ox;case 35666:return Bx;case 35674:return zx;case 35675:return Hx;case 35676:return Gx;case 5124:case 35670:return Vx;case 35667:case 35671:return Wx;case 35668:case 35672:return $x;case 35669:case 35673:return Xx;case 5125:return Yx;case 36294:return qx;case 36295:return Kx;case 36296:return Zx;case 35678:case 36198:case 36298:case 36306:case 35682:return Jx;case 35679:case 36299:case 36307:return jx;case 35680:case 36300:case 36308:case 36293:return Qx;case 36289:case 36303:case 36311:case 36292:return tv}}function nv(s,t){s.uniform1fv(this.addr,t)}function iv(s,t){const e=zs(t,this.size,2);s.uniform2fv(this.addr,e)}function sv(s,t){const e=zs(t,this.size,3);s.uniform3fv(this.addr,e)}function rv(s,t){const e=zs(t,this.size,4);s.uniform4fv(this.addr,e)}function ov(s,t){const e=zs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function av(s,t){const e=zs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function lv(s,t){const e=zs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function cv(s,t){s.uniform1iv(this.addr,t)}function hv(s,t){s.uniform2iv(this.addr,t)}function uv(s,t){s.uniform3iv(this.addr,t)}function dv(s,t){s.uniform4iv(this.addr,t)}function fv(s,t){s.uniform1uiv(this.addr,t)}function pv(s,t){s.uniform2uiv(this.addr,t)}function mv(s,t){s.uniform3uiv(this.addr,t)}function gv(s,t){s.uniform4uiv(this.addr,t)}function xv(s,t,e){const n=this.cache,i=t.length,r=wo(e,i);Ie(n,r)||(s.uniform1iv(this.addr,r),Ue(n,r));let o;this.type===s.SAMPLER_2D_SHADOW?o=Kl:o=Ru;for(let a=0;a!==i;++a)e.setTexture2D(t[a]||o,r[a])}function vv(s,t,e){const n=this.cache,i=t.length,r=wo(e,i);Ie(n,r)||(s.uniform1iv(this.addr,r),Ue(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Lu,r[o])}function _v(s,t,e){const n=this.cache,i=t.length,r=wo(e,i);Ie(n,r)||(s.uniform1iv(this.addr,r),Ue(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||Du,r[o])}function yv(s,t,e){const n=this.cache,i=t.length,r=wo(e,i);Ie(n,r)||(s.uniform1iv(this.addr,r),Ue(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Pu,r[o])}function Mv(s){switch(s){case 5126:return nv;case 35664:return iv;case 35665:return sv;case 35666:return rv;case 35674:return ov;case 35675:return av;case 35676:return lv;case 5124:case 35670:return cv;case 35667:case 35671:return hv;case 35668:case 35672:return uv;case 35669:case 35673:return dv;case 5125:return fv;case 36294:return pv;case 36295:return mv;case 36296:return gv;case 35678:case 36198:case 36298:case 36306:case 35682:return xv;case 35679:case 36299:case 36307:return vv;case 35680:case 36300:case 36308:case 36293:return _v;case 36289:case 36303:case 36311:case 36292:return yv}}class bv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=ev(e.type)}}class Sv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Mv(e.type)}}class wv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(t,e[a.id],n)}}}const Zl=/(\w+)(\])?(\[|\.)?/g;function Ou(s,t){s.seq.push(t),s.map[t.id]=t}function Ev(s,t,e){const n=s.name,i=n.length;for(Zl.lastIndex=0;;){const r=Zl.exec(n),o=Zl.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Ou(e,c===void 0?new bv(a,s,t):new Sv(a,s,t));break}else{let u=e.map[a];u===void 0&&(u=new wv(a),Ou(e,u)),e=u}}}class Eo{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){const a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);Ev(a,l,this)}const i=[],r=[];for(const o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(o):r.push(o);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function Bu(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const Tv=37297;let Av=0;function Cv(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const zu=new Vt;function Rv(s){re._getMatrix(zu,re.workingColorSpace,s);const t=`mat3( ${zu.elements.map(e=>e.toFixed(4))} )`;switch(re.getTransfer(s)){case Gr:return[t,"LinearTransferOETF"];case he:return[t,"sRGBTransferOETF"];default:return kt("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Hu(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Cv(s.getShaderSource(t),a)}else return r}function Pv(s,t){const e=Rv(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const Lv={[lh]:"Linear",[ch]:"Reinhard",[hh]:"Cineon",[ga]:"ACESFilmic",[dh]:"AgX",[fh]:"Neutral",[uh]:"Custom"};function Dv(s,t){const e=Lv[t];return e===void 0?(kt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const To=new P;function Iv(){re.getLuminanceCoefficients(To);const s=To.x.toFixed(4),t=To.y.toFixed(4),e=To.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Uv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vr).join(`
`)}function Nv(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function kv(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function vr(s){return s!==""}function Gu(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Vu(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Fv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Jl(s){return s.replace(Fv,Bv)}const Ov=new Map;function Bv(s,t){let e=Jt[t];if(e===void 0){const n=Ov.get(t);if(n!==void 0)e=Jt[n],kt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Jl(e)}const zv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wu(s){return s.replace(zv,Hv)}function Hv(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function $u(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}const Gv={[Lr]:"SHADOWMAP_TYPE_PCF",[tr]:"SHADOWMAP_TYPE_VSM"};function Vv(s){return Gv[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Wv={[zi]:"ENVMAP_TYPE_CUBE",[fs]:"ENVMAP_TYPE_CUBE",[Ir]:"ENVMAP_TYPE_CUBE_UV"};function $v(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Wv[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const Xv={[fs]:"ENVMAP_MODE_REFRACTION"};function Yv(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Xv[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const qv={[ah]:"ENVMAP_BLENDING_MULTIPLY",[Lp]:"ENVMAP_BLENDING_MIX",[Dp]:"ENVMAP_BLENDING_ADD"};function Kv(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":qv[s.combine]||"ENVMAP_BLENDING_NONE"}function Zv(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Jv(s,t,e,n){const i=s.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=Vv(e),c=$v(e),h=Yv(e),u=Kv(e),d=Zv(e),f=Uv(e),p=Nv(r),v=i.createProgram();let m,g,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(vr).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(vr).join(`
`),g.length>0&&(g+=`
`)):(m=[$u(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vr).join(`
`),g=[$u(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Dn?"#define TONE_MAPPING":"",e.toneMapping!==Dn?Jt.tonemapping_pars_fragment:"",e.toneMapping!==Dn?Dv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Jt.colorspace_pars_fragment,Pv("linearToOutputTexel",e.outputColorSpace),Iv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(vr).join(`
`)),o=Jl(o),o=Gu(o,e),o=Vu(o,e),a=Jl(a),a=Gu(a,e),a=Vu(a,e),o=Wu(o),a=Wu(a),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===Sh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Sh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const w=x+m+o,M=x+g+a,E=Bu(i,i.VERTEX_SHADER,w),b=Bu(i,i.FRAGMENT_SHADER,M);i.attachShader(v,E),i.attachShader(v,b),e.index0AttributeName!==void 0?i.bindAttribLocation(v,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function R(D){if(s.debug.checkShaderErrors){const U=i.getProgramInfoLog(v)||"",G=i.getShaderInfoLog(E)||"",K=i.getShaderInfoLog(b)||"",N=U.trim(),W=G.trim(),B=K.trim();let q=!0,et=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(q=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,E,b);else{const ot=Hu(i,E,"vertex"),lt=Hu(i,b,"fragment");oe("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+N+`
`+ot+`
`+lt)}else N!==""?kt("WebGLProgram: Program Info Log:",N):(W===""||B==="")&&(et=!1);et&&(D.diagnostics={runnable:q,programLog:N,vertexShader:{log:W,prefix:m},fragmentShader:{log:B,prefix:g}})}i.deleteShader(E),i.deleteShader(b),_=new Eo(i,v),T=kv(i,v)}let _;this.getUniforms=function(){return _===void 0&&R(this),_};let T;this.getAttributes=function(){return T===void 0&&R(this),T};let L=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=i.getProgramParameter(v,Tv)),L},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Av++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=b,this}let jv=0;class Qv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new t_(t),e.set(t,n)),n}}class t_{constructor(t){this.id=jv++,this.code=t,this.usedTimes=0}}function e_(s){return s===Vi||s===zr||s===Hr}function n_(s,t,e,n,i,r){const o=new fl,a=new Qv,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(_){return l.add(_),_===0?"uv":`uv${_}`}function v(_,T,L,D,U,G){const K=D.fog,N=U.geometry,W=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?D.environment:null,B=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,q=t.get(_.envMap||W,B),et=q&&q.mapping===Ir?q.image.height:null,ot=f[_.type];_.precision!==null&&(d=n.getMaxPrecision(_.precision),d!==_.precision&&kt("WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));const lt=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,ft=lt!==void 0?lt.length:0;let $t=0;N.morphAttributes.position!==void 0&&($t=1),N.morphAttributes.normal!==void 0&&($t=2),N.morphAttributes.color!==void 0&&($t=3);let ge,ne,j,ct;if(ot){const wt=Fn[ot];ge=wt.vertexShader,ne=wt.fragmentShader}else{ge=_.vertexShader,ne=_.fragmentShader;const wt=a.getVertexShaderStage(_),Te=a.getFragmentShaderStage(_);a.update(_,wt,Te),j=wt.id,ct=Te.id}const st=s.getRenderTarget(),Ot=s.state.buffers.depth.getReversed(),Wt=U.isInstancedMesh===!0,Ft=U.isBatchedMesh===!0,we=!!_.map,ee=!!_.matcap,de=!!q,ae=!!_.aoMap,se=!!_.lightMap,F=!!_.bumpMap&&_.wireframe===!1,nt=!!_.normalMap,Et=!!_.displacementMap,Ht=!!_.emissiveMap,It=!!_.metalnessMap,At=!!_.roughnessMap,I=_.anisotropy>0,ie=_.clearcoat>0,Kt=_.dispersion>0,C=_.iridescence>0,y=_.sheen>0,z=_.transmission>0,H=I&&!!_.anisotropyMap,Z=ie&&!!_.clearcoatMap,rt=ie&&!!_.clearcoatNormalMap,ht=ie&&!!_.clearcoatRoughnessMap,J=C&&!!_.iridescenceMap,tt=C&&!!_.iridescenceThicknessMap,pt=y&&!!_.sheenColorMap,Rt=y&&!!_.sheenRoughnessMap,vt=!!_.specularMap,mt=!!_.specularColorMap,Nt=!!_.specularIntensityMap,Bt=z&&!!_.transmissionMap,Yt=z&&!!_.thicknessMap,k=!!_.gradientMap,ut=!!_.alphaMap,Q=_.alphaTest>0,gt=!!_.alphaHash,Mt=!!_.extensions;let it=Dn;_.toneMapped&&(st===null||st.isXRRenderTarget===!0)&&(it=s.toneMapping);const Ct={shaderID:ot,shaderType:_.type,shaderName:_.name,vertexShader:ge,fragmentShader:ne,defines:_.defines,customVertexShaderID:j,customFragmentShaderID:ct,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:Ft,batchingColor:Ft&&U._colorsTexture!==null,instancing:Wt,instancingColor:Wt&&U.instanceColor!==null,instancingMorph:Wt&&U.morphTexture!==null,outputColorSpace:st===null?s.outputColorSpace:st.isXRRenderTarget===!0?st.texture.colorSpace:re.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:we,matcap:ee,envMap:de,envMapMode:de&&q.mapping,envMapCubeUVHeight:et,aoMap:ae,lightMap:se,bumpMap:F,normalMap:nt,displacementMap:Et,emissiveMap:Ht,normalMapObjectSpace:nt&&_.normalMapType===Np,normalMapTangentSpace:nt&&_.normalMapType===sl,packedNormalMap:nt&&_.normalMapType===sl&&e_(_.normalMap.format),metalnessMap:It,roughnessMap:At,anisotropy:I,anisotropyMap:H,clearcoat:ie,clearcoatMap:Z,clearcoatNormalMap:rt,clearcoatRoughnessMap:ht,dispersion:Kt,iridescence:C,iridescenceMap:J,iridescenceThicknessMap:tt,sheen:y,sheenColorMap:pt,sheenRoughnessMap:Rt,specularMap:vt,specularColorMap:mt,specularIntensityMap:Nt,transmission:z,transmissionMap:Bt,thicknessMap:Yt,gradientMap:k,opaque:_.transparent===!1&&_.blending===us&&_.alphaToCoverage===!1,alphaMap:ut,alphaTest:Q,alphaHash:gt,combine:_.combine,mapUv:we&&p(_.map.channel),aoMapUv:ae&&p(_.aoMap.channel),lightMapUv:se&&p(_.lightMap.channel),bumpMapUv:F&&p(_.bumpMap.channel),normalMapUv:nt&&p(_.normalMap.channel),displacementMapUv:Et&&p(_.displacementMap.channel),emissiveMapUv:Ht&&p(_.emissiveMap.channel),metalnessMapUv:It&&p(_.metalnessMap.channel),roughnessMapUv:At&&p(_.roughnessMap.channel),anisotropyMapUv:H&&p(_.anisotropyMap.channel),clearcoatMapUv:Z&&p(_.clearcoatMap.channel),clearcoatNormalMapUv:rt&&p(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ht&&p(_.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&p(_.iridescenceMap.channel),iridescenceThicknessMapUv:tt&&p(_.iridescenceThicknessMap.channel),sheenColorMapUv:pt&&p(_.sheenColorMap.channel),sheenRoughnessMapUv:Rt&&p(_.sheenRoughnessMap.channel),specularMapUv:vt&&p(_.specularMap.channel),specularColorMapUv:mt&&p(_.specularColorMap.channel),specularIntensityMapUv:Nt&&p(_.specularIntensityMap.channel),transmissionMapUv:Bt&&p(_.transmissionMap.channel),thicknessMapUv:Yt&&p(_.thicknessMap.channel),alphaMapUv:ut&&p(_.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(nt||I),vertexNormals:!!N.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!N.attributes.uv&&(we||ut),fog:!!K,useFog:_.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||N.attributes.normal===void 0&&nt===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Ot,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:N.attributes.position!==void 0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:ft,morphTextureStride:$t,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:G.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:it,decodeVideoTexture:we&&_.map.isVideoTexture===!0&&re.getTransfer(_.map.colorSpace)===he,decodeVideoTextureEmissive:Ht&&_.emissiveMap.isVideoTexture===!0&&re.getTransfer(_.emissiveMap.colorSpace)===he,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Xn,flipSided:_.side===Ke,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Mt&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Mt&&_.extensions.multiDraw===!0||Ft)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Ct.vertexUv1s=l.has(1),Ct.vertexUv2s=l.has(2),Ct.vertexUv3s=l.has(3),l.clear(),Ct}function m(_){const T=[];if(_.shaderID?T.push(_.shaderID):(T.push(_.customVertexShaderID),T.push(_.customFragmentShaderID)),_.defines!==void 0)for(const L in _.defines)T.push(L),T.push(_.defines[L]);return _.isRawShaderMaterial===!1&&(g(T,_),x(T,_),T.push(s.outputColorSpace)),T.push(_.customProgramCacheKey),T.join()}function g(_,T){_.push(T.precision),_.push(T.outputColorSpace),_.push(T.envMapMode),_.push(T.envMapCubeUVHeight),_.push(T.mapUv),_.push(T.alphaMapUv),_.push(T.lightMapUv),_.push(T.aoMapUv),_.push(T.bumpMapUv),_.push(T.normalMapUv),_.push(T.displacementMapUv),_.push(T.emissiveMapUv),_.push(T.metalnessMapUv),_.push(T.roughnessMapUv),_.push(T.anisotropyMapUv),_.push(T.clearcoatMapUv),_.push(T.clearcoatNormalMapUv),_.push(T.clearcoatRoughnessMapUv),_.push(T.iridescenceMapUv),_.push(T.iridescenceThicknessMapUv),_.push(T.sheenColorMapUv),_.push(T.sheenRoughnessMapUv),_.push(T.specularMapUv),_.push(T.specularColorMapUv),_.push(T.specularIntensityMapUv),_.push(T.transmissionMapUv),_.push(T.thicknessMapUv),_.push(T.combine),_.push(T.fogExp2),_.push(T.sizeAttenuation),_.push(T.morphTargetsCount),_.push(T.morphAttributeCount),_.push(T.numDirLights),_.push(T.numPointLights),_.push(T.numSpotLights),_.push(T.numSpotLightMaps),_.push(T.numHemiLights),_.push(T.numRectAreaLights),_.push(T.numDirLightShadows),_.push(T.numPointLightShadows),_.push(T.numSpotLightShadows),_.push(T.numSpotLightShadowsWithMaps),_.push(T.numLightProbes),_.push(T.shadowMapType),_.push(T.toneMapping),_.push(T.numClippingPlanes),_.push(T.numClipIntersection),_.push(T.depthPacking)}function x(_,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),T.packedNormalMap&&o.enable(22),T.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),T.numLightProbeGrids>0&&o.enable(22),T.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function w(_){const T=f[_.type];let L;if(T){const D=Fn[T];L=xo.clone(D.uniforms)}else L=_.uniforms;return L}function M(_,T){let L=h.get(T);return L!==void 0?++L.usedTimes:(L=new Jv(s,T,_,i),c.push(L),h.set(T,L)),L}function E(_){if(--_.usedTimes===0){const T=c.indexOf(_);c[T]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function b(_){a.remove(_)}function R(){a.dispose()}return{getParameters:v,getProgramCacheKey:m,getUniforms:w,acquireProgram:M,releaseProgram:E,releaseShaderCache:b,programs:c,dispose:R}}function i_(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function s_(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function Xu(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Yu(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function a(d,f,p,v,m,g){let x=s[t];return x===void 0?(x={id:d.id,object:d,geometry:f,material:p,materialVariant:o(d),groupOrder:v,renderOrder:d.renderOrder,z:m,group:g},s[t]=x):(x.id=d.id,x.object=d,x.geometry=f,x.material=p,x.materialVariant=o(d),x.groupOrder=v,x.renderOrder=d.renderOrder,x.z=m,x.group=g),t++,x}function l(d,f,p,v,m,g){const x=a(d,f,p,v,m,g);p.transmission>0?n.push(x):p.transparent===!0?i.push(x):e.push(x)}function c(d,f,p,v,m,g){const x=a(d,f,p,v,m,g);p.transmission>0?n.unshift(x):p.transparent===!0?i.unshift(x):e.unshift(x)}function h(d,f,p){e.length>1&&e.sort(d||s_),n.length>1&&n.sort(f||Xu),i.length>1&&i.sort(f||Xu),p&&(e.reverse(),n.reverse(),i.reverse())}function u(){for(let d=t,f=s.length;d<f;d++){const p=s[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:u,sort:h}}function r_(){let s=new WeakMap;function t(n,i){const r=s.get(n);let o;return r===void 0?(o=new Yu,s.set(n,[o])):i>=r.length?(o=new Yu,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function o_(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new Gt};break;case"SpotLight":e={position:new P,direction:new P,color:new Gt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new Gt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new Gt,groundColor:new Gt};break;case"RectAreaLight":e={color:new Gt,position:new P,halfWidth:new P,halfHeight:new P};break}return s[t.id]=e,e}}}function a_(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let l_=0;function c_(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function h_(s){const t=new o_,e=a_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const i=new P,r=new ce,o=new ce;function a(c){let h=0,u=0,d=0;for(let T=0;T<9;T++)n.probe[T].set(0,0,0);let f=0,p=0,v=0,m=0,g=0,x=0,w=0,M=0,E=0,b=0,R=0;c.sort(c_);for(let T=0,L=c.length;T<L;T++){const D=c[T],U=D.color,G=D.intensity,K=D.distance;let N=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Vi?N=D.shadow.map.texture:N=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)h+=U.r*G,u+=U.g*G,d+=U.b*G;else if(D.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(D.sh.coefficients[W],G);R++}else if(D.isDirectionalLight){const W=t.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const B=D.shadow,q=e.get(D);q.shadowIntensity=B.intensity,q.shadowBias=B.bias,q.shadowNormalBias=B.normalBias,q.shadowRadius=B.radius,q.shadowMapSize=B.mapSize,n.directionalShadow[f]=q,n.directionalShadowMap[f]=N,n.directionalShadowMatrix[f]=D.shadow.matrix,x++}n.directional[f]=W,f++}else if(D.isSpotLight){const W=t.get(D);W.position.setFromMatrixPosition(D.matrixWorld),W.color.copy(U).multiplyScalar(G),W.distance=K,W.coneCos=Math.cos(D.angle),W.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),W.decay=D.decay,n.spot[v]=W;const B=D.shadow;if(D.map&&(n.spotLightMap[E]=D.map,E++,B.updateMatrices(D),D.castShadow&&b++),n.spotLightMatrix[v]=B.matrix,D.castShadow){const q=e.get(D);q.shadowIntensity=B.intensity,q.shadowBias=B.bias,q.shadowNormalBias=B.normalBias,q.shadowRadius=B.radius,q.shadowMapSize=B.mapSize,n.spotShadow[v]=q,n.spotShadowMap[v]=N,M++}v++}else if(D.isRectAreaLight){const W=t.get(D);W.color.copy(U).multiplyScalar(G),W.halfWidth.set(D.width*.5,0,0),W.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=W,m++}else if(D.isPointLight){const W=t.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),W.distance=D.distance,W.decay=D.decay,D.castShadow){const B=D.shadow,q=e.get(D);q.shadowIntensity=B.intensity,q.shadowBias=B.bias,q.shadowNormalBias=B.normalBias,q.shadowRadius=B.radius,q.shadowMapSize=B.mapSize,q.shadowCameraNear=B.camera.near,q.shadowCameraFar=B.camera.far,n.pointShadow[p]=q,n.pointShadowMap[p]=N,n.pointShadowMatrix[p]=D.shadow.matrix,w++}n.point[p]=W,p++}else if(D.isHemisphereLight){const W=t.get(D);W.skyColor.copy(D.color).multiplyScalar(G),W.groundColor.copy(D.groundColor).multiplyScalar(G),n.hemi[g]=W,g++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=xt.LTC_FLOAT_1,n.rectAreaLTC2=xt.LTC_FLOAT_2):(n.rectAreaLTC1=xt.LTC_HALF_1,n.rectAreaLTC2=xt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const _=n.hash;(_.directionalLength!==f||_.pointLength!==p||_.spotLength!==v||_.rectAreaLength!==m||_.hemiLength!==g||_.numDirectionalShadows!==x||_.numPointShadows!==w||_.numSpotShadows!==M||_.numSpotMaps!==E||_.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=M+E-b,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=R,_.directionalLength=f,_.pointLength=p,_.spotLength=v,_.rectAreaLength=m,_.hemiLength=g,_.numDirectionalShadows=x,_.numPointShadows=w,_.numSpotShadows=M,_.numSpotMaps=E,_.numLightProbes=R,n.version=l_++)}function l(c,h){let u=0,d=0,f=0,p=0,v=0;const m=h.matrixWorldInverse;for(let g=0,x=c.length;g<x;g++){const w=c[g];if(w.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),u++}else if(w.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),f++}else if(w.isRectAreaLight){const M=n.rectArea[p];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),o.identity(),r.copy(w.matrixWorld),r.premultiply(m),o.extractRotation(r),M.halfWidth.set(w.width*.5,0,0),M.halfHeight.set(0,w.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),p++}else if(w.isPointLight){const M=n.point[d];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),d++}else if(w.isHemisphereLight){const M=n.hemi[v];M.direction.setFromMatrixPosition(w.matrixWorld),M.direction.transformDirection(m),v++}}}return{setup:a,setupView:l,state:n}}function qu(s){const t=new h_(s),e=[],n=[],i=[];function r(d){u.camera=d,e.length=0,n.length=0,i.length=0}function o(d){e.push(d)}function a(d){n.push(d)}function l(d){i.push(d)}function c(){t.setup(e)}function h(d){t.setupView(e,d)}const u={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function u_(s){let t=new WeakMap;function e(i,r=0){const o=t.get(i);let a;return o===void 0?(a=new qu(s),t.set(i,[a])):r>=o.length?(a=new qu(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const d_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,f_=`uniform sampler2D shadow_pass;
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
}`,p_=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],m_=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],Ku=new ce,_r=new P,jl=new P;function g_(s,t,e){let n=new ho;const i=new dt,r=new dt,o=new be,a=new Qm,l=new t0,c={},h=e.maxTextureSize,u={[pi]:Ke,[Ke]:pi,[Xn]:Xn},d=new De({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new dt},radius:{value:4}},vertexShader:d_,fragmentShader:f_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new Ge;p.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new jt(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Lr;let g=this.type;this.render=function(b,R,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;this.type===dp&&(kt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Lr);const T=s.getRenderTarget(),L=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),U=s.state;U.setBlending(Ln),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const G=g!==this.type;G&&R.traverse(function(K){K.material&&(Array.isArray(K.material)?K.material.forEach(N=>N.needsUpdate=!0):K.material.needsUpdate=!0)});for(let K=0,N=b.length;K<N;K++){const W=b[K],B=W.shadow;if(B===void 0){kt("WebGLShadowMap:",W,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;i.copy(B.mapSize);const q=B.getFrameExtents();i.multiply(q),r.copy(B.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/q.x),i.x=r.x*q.x,B.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/q.y),i.y=r.y*q.y,B.mapSize.y=r.y));const et=s.state.buffers.depth.getReversed();if(B.camera._reversedDepth=et,B.map===null||G===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===tr){if(W.isPointLight){kt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new je(i.x,i.y,{format:Vi,type:on,minFilter:He,magFilter:He,generateMipmaps:!1}),B.map.texture.name=W.name+".shadowMap",B.map.depthTexture=new Us(i.x,i.y,yn),B.map.depthTexture.name=W.name+".shadowMapDepth",B.map.depthTexture.format=qn,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=ze,B.map.depthTexture.magFilter=ze}else W.isPointLight?(B.map=new Cu(i.x),B.map.depthTexture=new Im(i.x,In)):(B.map=new je(i.x,i.y),B.map.depthTexture=new Us(i.x,i.y,In)),B.map.depthTexture.name=W.name+".shadowMap",B.map.depthTexture.format=qn,this.type===Lr?(B.map.depthTexture.compareFunction=et?ol:rl,B.map.depthTexture.minFilter=He,B.map.depthTexture.magFilter=He):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=ze,B.map.depthTexture.magFilter=ze);B.camera.updateProjectionMatrix()}const ot=B.map.isWebGLCubeRenderTarget?6:1;for(let lt=0;lt<ot;lt++){if(B.map.isWebGLCubeRenderTarget)s.setRenderTarget(B.map,lt),s.clear();else{lt===0&&(s.setRenderTarget(B.map),s.clear());const ft=B.getViewport(lt);o.set(r.x*ft.x,r.y*ft.y,r.x*ft.z,r.y*ft.w),U.viewport(o)}if(W.isPointLight){const ft=B.camera,$t=B.matrix,ge=W.distance||ft.far;ge!==ft.far&&(ft.far=ge,ft.updateProjectionMatrix()),_r.setFromMatrixPosition(W.matrixWorld),ft.position.copy(_r),jl.copy(ft.position),jl.add(p_[lt]),ft.up.copy(m_[lt]),ft.lookAt(jl),ft.updateMatrixWorld(),$t.makeTranslation(-_r.x,-_r.y,-_r.z),Ku.multiplyMatrices(ft.projectionMatrix,ft.matrixWorldInverse),B._frustum.setFromProjectionMatrix(Ku,ft.coordinateSystem,ft.reversedDepth)}else B.updateMatrices(W);n=B.getFrustum(),M(R,_,B.camera,W,this.type)}B.isPointLightShadow!==!0&&this.type===tr&&x(B,_),B.needsUpdate=!1}g=this.type,m.needsUpdate=!1,s.setRenderTarget(T,L,D)};function x(b,R){const _=t.update(v);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new je(i.x,i.y,{format:Vi,type:on})),d.uniforms.shadow_pass.value=b.map.depthTexture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,s.setRenderTarget(b.mapPass),s.clear(),s.renderBufferDirect(R,null,_,d,v,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,s.setRenderTarget(b.map),s.clear(),s.renderBufferDirect(R,null,_,f,v,null)}function w(b,R,_,T){let L=null;const D=_.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(D!==void 0)L=D;else if(L=_.isPointLight===!0?l:a,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const U=L.uuid,G=R.uuid;let K=c[U];K===void 0&&(K={},c[U]=K);let N=K[G];N===void 0&&(N=L.clone(),K[G]=N,R.addEventListener("dispose",E)),L=N}if(L.visible=R.visible,L.wireframe=R.wireframe,T===tr?L.side=R.shadowSide!==null?R.shadowSide:R.side:L.side=R.shadowSide!==null?R.shadowSide:u[R.side],L.alphaMap=R.alphaMap,L.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,L.map=R.map,L.clipShadows=R.clipShadows,L.clippingPlanes=R.clippingPlanes,L.clipIntersection=R.clipIntersection,L.displacementMap=R.displacementMap,L.displacementScale=R.displacementScale,L.displacementBias=R.displacementBias,L.wireframeLinewidth=R.wireframeLinewidth,L.linewidth=R.linewidth,_.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const U=s.properties.get(L);U.light=_}return L}function M(b,R,_,T,L){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&L===tr)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,b.matrixWorld);const G=t.update(b),K=b.material;if(Array.isArray(K)){const N=G.groups;for(let W=0,B=N.length;W<B;W++){const q=N[W],et=K[q.materialIndex];if(et&&et.visible){const ot=w(b,et,T,L);b.onBeforeShadow(s,b,R,_,G,ot,q),s.renderBufferDirect(_,null,G,ot,b,q),b.onAfterShadow(s,b,R,_,G,ot,q)}}}else if(K.visible){const N=w(b,K,T,L);b.onBeforeShadow(s,b,R,_,G,N,null),s.renderBufferDirect(_,null,G,N,b,null),b.onAfterShadow(s,b,R,_,G,N,null)}}const U=b.children;for(let G=0,K=U.length;G<K;G++)M(U[G],R,_,T,L)}function E(b){b.target.removeEventListener("dispose",E);for(const _ in c){const T=c[_],L=b.target.uuid;L in T&&(T[L].dispose(),delete T[L])}}}function x_(s,t){function e(){let k=!1;const ut=new be;let Q=null;const gt=new be(0,0,0,0);return{setMask:function(Mt){Q!==Mt&&!k&&(s.colorMask(Mt,Mt,Mt,Mt),Q=Mt)},setLocked:function(Mt){k=Mt},setClear:function(Mt,it,Ct,wt,Te){Te===!0&&(Mt*=wt,it*=wt,Ct*=wt),ut.set(Mt,it,Ct,wt),gt.equals(ut)===!1&&(s.clearColor(Mt,it,Ct,wt),gt.copy(ut))},reset:function(){k=!1,Q=null,gt.set(-1,0,0,0)}}}function n(){let k=!1,ut=!1,Q=null,gt=null,Mt=null;return{setReversed:function(it){if(ut!==it){const Ct=t.get("EXT_clip_control");it?Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.ZERO_TO_ONE_EXT):Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.NEGATIVE_ONE_TO_ONE_EXT),ut=it;const wt=Mt;Mt=null,this.setClear(wt)}},getReversed:function(){return ut},setTest:function(it){it?st(s.DEPTH_TEST):Ot(s.DEPTH_TEST)},setMask:function(it){Q!==it&&!k&&(s.depthMask(it),Q=it)},setFunc:function(it){if(ut&&(it=$p[it]),gt!==it){switch(it){case ca:s.depthFunc(s.NEVER);break;case ha:s.depthFunc(s.ALWAYS);break;case ua:s.depthFunc(s.LESS);break;case ds:s.depthFunc(s.LEQUAL);break;case da:s.depthFunc(s.EQUAL);break;case fa:s.depthFunc(s.GEQUAL);break;case pa:s.depthFunc(s.GREATER);break;case ma:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}gt=it}},setLocked:function(it){k=it},setClear:function(it){Mt!==it&&(Mt=it,ut&&(it=1-it),s.clearDepth(it))},reset:function(){k=!1,Q=null,gt=null,Mt=null,ut=!1}}}function i(){let k=!1,ut=null,Q=null,gt=null,Mt=null,it=null,Ct=null,wt=null,Te=null;return{setTest:function(ye){k||(ye?st(s.STENCIL_TEST):Ot(s.STENCIL_TEST))},setMask:function(ye){ut!==ye&&!k&&(s.stencilMask(ye),ut=ye)},setFunc:function(ye,Hn,Gn){(Q!==ye||gt!==Hn||Mt!==Gn)&&(s.stencilFunc(ye,Hn,Gn),Q=ye,gt=Hn,Mt=Gn)},setOp:function(ye,Hn,Gn){(it!==ye||Ct!==Hn||wt!==Gn)&&(s.stencilOp(ye,Hn,Gn),it=ye,Ct=Hn,wt=Gn)},setLocked:function(ye){k=ye},setClear:function(ye){Te!==ye&&(s.clearStencil(ye),Te=ye)},reset:function(){k=!1,ut=null,Q=null,gt=null,Mt=null,it=null,Ct=null,wt=null,Te=null}}}const r=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap;let h={},u={},d={},f=new WeakMap,p=[],v=null,m=!1,g=null,x=null,w=null,M=null,E=null,b=null,R=null,_=new Gt(0,0,0),T=0,L=!1,D=null,U=null,G=null,K=null,N=null;const W=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,q=0;const et=s.getParameter(s.VERSION);et.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(et)[1]),B=q>=1):et.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(et)[1]),B=q>=2);let ot=null,lt={};const ft=s.getParameter(s.SCISSOR_BOX),$t=s.getParameter(s.VIEWPORT),ge=new be().fromArray(ft),ne=new be().fromArray($t);function j(k,ut,Q,gt){const Mt=new Uint8Array(4),it=s.createTexture();s.bindTexture(k,it),s.texParameteri(k,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(k,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ct=0;Ct<Q;Ct++)k===s.TEXTURE_3D||k===s.TEXTURE_2D_ARRAY?s.texImage3D(ut,0,s.RGBA,1,1,gt,0,s.RGBA,s.UNSIGNED_BYTE,Mt):s.texImage2D(ut+Ct,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Mt);return it}const ct={};ct[s.TEXTURE_2D]=j(s.TEXTURE_2D,s.TEXTURE_2D,1),ct[s.TEXTURE_CUBE_MAP]=j(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ct[s.TEXTURE_2D_ARRAY]=j(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ct[s.TEXTURE_3D]=j(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),st(s.DEPTH_TEST),o.setFunc(ds),F(!1),nt(sh),st(s.CULL_FACE),ae(Ln);function st(k){h[k]!==!0&&(s.enable(k),h[k]=!0)}function Ot(k){h[k]!==!1&&(s.disable(k),h[k]=!1)}function Wt(k,ut){return d[k]!==ut?(s.bindFramebuffer(k,ut),d[k]=ut,k===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=ut),k===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=ut),!0):!1}function Ft(k,ut){let Q=p,gt=!1;if(k){Q=f.get(ut),Q===void 0&&(Q=[],f.set(ut,Q));const Mt=k.textures;if(Q.length!==Mt.length||Q[0]!==s.COLOR_ATTACHMENT0){for(let it=0,Ct=Mt.length;it<Ct;it++)Q[it]=s.COLOR_ATTACHMENT0+it;Q.length=Mt.length,gt=!0}}else Q[0]!==s.BACK&&(Q[0]=s.BACK,gt=!0);gt&&s.drawBuffers(Q)}function we(k){return v!==k?(s.useProgram(k),v=k,!0):!1}const ee={[Bi]:s.FUNC_ADD,[pp]:s.FUNC_SUBTRACT,[mp]:s.FUNC_REVERSE_SUBTRACT};ee[gp]=s.MIN,ee[xp]=s.MAX;const de={[vp]:s.ZERO,[_p]:s.ONE,[yp]:s.SRC_COLOR,[aa]:s.SRC_ALPHA,[Tp]:s.SRC_ALPHA_SATURATE,[wp]:s.DST_COLOR,[bp]:s.DST_ALPHA,[Mp]:s.ONE_MINUS_SRC_COLOR,[la]:s.ONE_MINUS_SRC_ALPHA,[Ep]:s.ONE_MINUS_DST_COLOR,[Sp]:s.ONE_MINUS_DST_ALPHA,[Ap]:s.CONSTANT_COLOR,[Cp]:s.ONE_MINUS_CONSTANT_COLOR,[Rp]:s.CONSTANT_ALPHA,[Pp]:s.ONE_MINUS_CONSTANT_ALPHA};function ae(k,ut,Q,gt,Mt,it,Ct,wt,Te,ye){if(k===Ln){m===!0&&(Ot(s.BLEND),m=!1);return}if(m===!1&&(st(s.BLEND),m=!0),k!==fp){if(k!==g||ye!==L){if((x!==Bi||E!==Bi)&&(s.blendEquation(s.FUNC_ADD),x=Bi,E=Bi),ye)switch(k){case us:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Dr:s.blendFunc(s.ONE,s.ONE);break;case rh:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case oh:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:oe("WebGLState: Invalid blending: ",k);break}else switch(k){case us:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Dr:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case rh:oe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case oh:oe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:oe("WebGLState: Invalid blending: ",k);break}w=null,M=null,b=null,R=null,_.set(0,0,0),T=0,g=k,L=ye}return}Mt=Mt||ut,it=it||Q,Ct=Ct||gt,(ut!==x||Mt!==E)&&(s.blendEquationSeparate(ee[ut],ee[Mt]),x=ut,E=Mt),(Q!==w||gt!==M||it!==b||Ct!==R)&&(s.blendFuncSeparate(de[Q],de[gt],de[it],de[Ct]),w=Q,M=gt,b=it,R=Ct),(wt.equals(_)===!1||Te!==T)&&(s.blendColor(wt.r,wt.g,wt.b,Te),_.copy(wt),T=Te),g=k,L=!1}function se(k,ut){k.side===Xn?Ot(s.CULL_FACE):st(s.CULL_FACE);let Q=k.side===Ke;ut&&(Q=!Q),F(Q),k.blending===us&&k.transparent===!1?ae(Ln):ae(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),o.setFunc(k.depthFunc),o.setTest(k.depthTest),o.setMask(k.depthWrite),r.setMask(k.colorWrite);const gt=k.stencilWrite;a.setTest(gt),gt&&(a.setMask(k.stencilWriteMask),a.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),a.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),Ht(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?st(s.SAMPLE_ALPHA_TO_COVERAGE):Ot(s.SAMPLE_ALPHA_TO_COVERAGE)}function F(k){D!==k&&(k?s.frontFace(s.CW):s.frontFace(s.CCW),D=k)}function nt(k){k!==hp?(st(s.CULL_FACE),k!==U&&(k===sh?s.cullFace(s.BACK):k===up?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ot(s.CULL_FACE),U=k}function Et(k){k!==G&&(B&&s.lineWidth(k),G=k)}function Ht(k,ut,Q){k?(st(s.POLYGON_OFFSET_FILL),(K!==ut||N!==Q)&&(K=ut,N=Q,o.getReversed()&&(ut=-ut),s.polygonOffset(ut,Q))):Ot(s.POLYGON_OFFSET_FILL)}function It(k){k?st(s.SCISSOR_TEST):Ot(s.SCISSOR_TEST)}function At(k){k===void 0&&(k=s.TEXTURE0+W-1),ot!==k&&(s.activeTexture(k),ot=k)}function I(k,ut,Q){Q===void 0&&(ot===null?Q=s.TEXTURE0+W-1:Q=ot);let gt=lt[Q];gt===void 0&&(gt={type:void 0,texture:void 0},lt[Q]=gt),(gt.type!==k||gt.texture!==ut)&&(ot!==Q&&(s.activeTexture(Q),ot=Q),s.bindTexture(k,ut||ct[k]),gt.type=k,gt.texture=ut)}function ie(){const k=lt[ot];k!==void 0&&k.type!==void 0&&(s.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function Kt(){try{s.compressedTexImage2D(...arguments)}catch(k){oe("WebGLState:",k)}}function C(){try{s.compressedTexImage3D(...arguments)}catch(k){oe("WebGLState:",k)}}function y(){try{s.texSubImage2D(...arguments)}catch(k){oe("WebGLState:",k)}}function z(){try{s.texSubImage3D(...arguments)}catch(k){oe("WebGLState:",k)}}function H(){try{s.compressedTexSubImage2D(...arguments)}catch(k){oe("WebGLState:",k)}}function Z(){try{s.compressedTexSubImage3D(...arguments)}catch(k){oe("WebGLState:",k)}}function rt(){try{s.texStorage2D(...arguments)}catch(k){oe("WebGLState:",k)}}function ht(){try{s.texStorage3D(...arguments)}catch(k){oe("WebGLState:",k)}}function J(){try{s.texImage2D(...arguments)}catch(k){oe("WebGLState:",k)}}function tt(){try{s.texImage3D(...arguments)}catch(k){oe("WebGLState:",k)}}function pt(k){return u[k]!==void 0?u[k]:s.getParameter(k)}function Rt(k,ut){u[k]!==ut&&(s.pixelStorei(k,ut),u[k]=ut)}function vt(k){ge.equals(k)===!1&&(s.scissor(k.x,k.y,k.z,k.w),ge.copy(k))}function mt(k){ne.equals(k)===!1&&(s.viewport(k.x,k.y,k.z,k.w),ne.copy(k))}function Nt(k,ut){let Q=c.get(ut);Q===void 0&&(Q=new WeakMap,c.set(ut,Q));let gt=Q.get(k);gt===void 0&&(gt=s.getUniformBlockIndex(ut,k.name),Q.set(k,gt))}function Bt(k,ut){const gt=c.get(ut).get(k);l.get(ut)!==gt&&(s.uniformBlockBinding(ut,gt,k.__bindingPointIndex),l.set(ut,gt))}function Yt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},u={},ot=null,lt={},d={},f=new WeakMap,p=[],v=null,m=!1,g=null,x=null,w=null,M=null,E=null,b=null,R=null,_=new Gt(0,0,0),T=0,L=!1,D=null,U=null,G=null,K=null,N=null,ge.set(0,0,s.canvas.width,s.canvas.height),ne.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:st,disable:Ot,bindFramebuffer:Wt,drawBuffers:Ft,useProgram:we,setBlending:ae,setMaterial:se,setFlipSided:F,setCullFace:nt,setLineWidth:Et,setPolygonOffset:Ht,setScissorTest:It,activeTexture:At,bindTexture:I,unbindTexture:ie,compressedTexImage2D:Kt,compressedTexImage3D:C,texImage2D:J,texImage3D:tt,pixelStorei:Rt,getParameter:pt,updateUBOMapping:Nt,uniformBlockBinding:Bt,texStorage2D:rt,texStorage3D:ht,texSubImage2D:y,texSubImage3D:z,compressedTexSubImage2D:H,compressedTexSubImage3D:Z,scissor:vt,viewport:mt,reset:Yt}}function v_(s,t,e,n,i,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new dt,h=new WeakMap,u=new Set;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(C,y){return p?new OffscreenCanvas(C,y):Vr("canvas")}function m(C,y,z){let H=1;const Z=Kt(C);if((Z.width>z||Z.height>z)&&(H=z/Math.max(Z.width,Z.height)),H<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const rt=Math.floor(H*Z.width),ht=Math.floor(H*Z.height);d===void 0&&(d=v(rt,ht));const J=y?v(rt,ht):d;return J.width=rt,J.height=ht,J.getContext("2d").drawImage(C,0,0,rt,ht),kt("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+rt+"x"+ht+")."),J}else return"data"in C&&kt("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),C;return C}function g(C){return C.generateMipmaps}function x(C){s.generateMipmap(C)}function w(C){return C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?s.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function M(C,y,z,H,Z,rt=!1){if(C!==null){if(s[C]!==void 0)return s[C];kt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ht;H&&(ht=t.get("EXT_texture_norm16"),ht||kt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=y;if(y===s.RED&&(z===s.FLOAT&&(J=s.R32F),z===s.HALF_FLOAT&&(J=s.R16F),z===s.UNSIGNED_BYTE&&(J=s.R8),z===s.UNSIGNED_SHORT&&ht&&(J=ht.R16_EXT),z===s.SHORT&&ht&&(J=ht.R16_SNORM_EXT)),y===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(J=s.R8UI),z===s.UNSIGNED_SHORT&&(J=s.R16UI),z===s.UNSIGNED_INT&&(J=s.R32UI),z===s.BYTE&&(J=s.R8I),z===s.SHORT&&(J=s.R16I),z===s.INT&&(J=s.R32I)),y===s.RG&&(z===s.FLOAT&&(J=s.RG32F),z===s.HALF_FLOAT&&(J=s.RG16F),z===s.UNSIGNED_BYTE&&(J=s.RG8),z===s.UNSIGNED_SHORT&&ht&&(J=ht.RG16_EXT),z===s.SHORT&&ht&&(J=ht.RG16_SNORM_EXT)),y===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&(J=s.RG8UI),z===s.UNSIGNED_SHORT&&(J=s.RG16UI),z===s.UNSIGNED_INT&&(J=s.RG32UI),z===s.BYTE&&(J=s.RG8I),z===s.SHORT&&(J=s.RG16I),z===s.INT&&(J=s.RG32I)),y===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&(J=s.RGB8UI),z===s.UNSIGNED_SHORT&&(J=s.RGB16UI),z===s.UNSIGNED_INT&&(J=s.RGB32UI),z===s.BYTE&&(J=s.RGB8I),z===s.SHORT&&(J=s.RGB16I),z===s.INT&&(J=s.RGB32I)),y===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&(J=s.RGBA8UI),z===s.UNSIGNED_SHORT&&(J=s.RGBA16UI),z===s.UNSIGNED_INT&&(J=s.RGBA32UI),z===s.BYTE&&(J=s.RGBA8I),z===s.SHORT&&(J=s.RGBA16I),z===s.INT&&(J=s.RGBA32I)),y===s.RGB&&(z===s.UNSIGNED_SHORT&&ht&&(J=ht.RGB16_EXT),z===s.SHORT&&ht&&(J=ht.RGB16_SNORM_EXT),z===s.UNSIGNED_INT_5_9_9_9_REV&&(J=s.RGB9_E5),z===s.UNSIGNED_INT_10F_11F_11F_REV&&(J=s.R11F_G11F_B10F)),y===s.RGBA){const tt=rt?Gr:re.getTransfer(Z);z===s.FLOAT&&(J=s.RGBA32F),z===s.HALF_FLOAT&&(J=s.RGBA16F),z===s.UNSIGNED_BYTE&&(J=tt===he?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT&&ht&&(J=ht.RGBA16_EXT),z===s.SHORT&&ht&&(J=ht.RGBA16_SNORM_EXT),z===s.UNSIGNED_SHORT_4_4_4_4&&(J=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(J=s.RGB5_A1)}return(J===s.R16F||J===s.R32F||J===s.RG16F||J===s.RG32F||J===s.RGBA16F||J===s.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function E(C,y){let z;return C?y===null||y===In||y===nr?z=s.DEPTH24_STENCIL8:y===yn?z=s.DEPTH32F_STENCIL8:y===er&&(z=s.DEPTH24_STENCIL8,kt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===In||y===nr?z=s.DEPTH_COMPONENT24:y===yn?z=s.DEPTH_COMPONENT32F:y===er&&(z=s.DEPTH_COMPONENT16),z}function b(C,y){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==ze&&C.minFilter!==He?Math.log2(Math.max(y.width,y.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?y.mipmaps.length:1}function R(C){const y=C.target;y.removeEventListener("dispose",R),T(y),y.isVideoTexture&&h.delete(y),y.isHTMLTexture&&u.delete(y)}function _(C){const y=C.target;y.removeEventListener("dispose",_),D(y)}function T(C){const y=n.get(C);if(y.__webglInit===void 0)return;const z=C.source,H=f.get(z);if(H){const Z=H[y.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&L(C),Object.keys(H).length===0&&f.delete(z)}n.remove(C)}function L(C){const y=n.get(C);s.deleteTexture(y.__webglTexture);const z=C.source,H=f.get(z);delete H[y.__cacheKey],o.memory.textures--}function D(C){const y=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(y.__webglFramebuffer[H]))for(let Z=0;Z<y.__webglFramebuffer[H].length;Z++)s.deleteFramebuffer(y.__webglFramebuffer[H][Z]);else s.deleteFramebuffer(y.__webglFramebuffer[H]);y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer[H])}else{if(Array.isArray(y.__webglFramebuffer))for(let H=0;H<y.__webglFramebuffer.length;H++)s.deleteFramebuffer(y.__webglFramebuffer[H]);else s.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&s.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let H=0;H<y.__webglColorRenderbuffer.length;H++)y.__webglColorRenderbuffer[H]&&s.deleteRenderbuffer(y.__webglColorRenderbuffer[H]);y.__webglDepthRenderbuffer&&s.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const z=C.textures;for(let H=0,Z=z.length;H<Z;H++){const rt=n.get(z[H]);rt.__webglTexture&&(s.deleteTexture(rt.__webglTexture),o.memory.textures--),n.remove(z[H])}n.remove(C)}let U=0;function G(){U=0}function K(){return U}function N(C){U=C}function W(){const C=U;return C>=i.maxTextures&&kt("WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),U+=1,C}function B(C){const y=[];return y.push(C.wrapS),y.push(C.wrapT),y.push(C.wrapR||0),y.push(C.magFilter),y.push(C.minFilter),y.push(C.anisotropy),y.push(C.internalFormat),y.push(C.format),y.push(C.type),y.push(C.generateMipmaps),y.push(C.premultiplyAlpha),y.push(C.flipY),y.push(C.unpackAlignment),y.push(C.colorSpace),y.join()}function q(C,y){const z=n.get(C);if(C.isVideoTexture&&I(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&z.__version!==C.version){const H=C.image;if(H===null)kt("WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)kt("WebGLRenderer: Texture marked for update but image is incomplete");else{Ot(z,C,y);return}}else C.isExternalTexture&&(z.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+y)}function et(C,y){const z=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){Ot(z,C,y);return}else C.isExternalTexture&&(z.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+y)}function ot(C,y){const z=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){Ot(z,C,y);return}e.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+y)}function lt(C,y){const z=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&z.__version!==C.version){Wt(z,C,y);return}e.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+y)}const ft={[Ur]:s.REPEAT,[Yn]:s.CLAMP_TO_EDGE,[_a]:s.MIRRORED_REPEAT},$t={[ze]:s.NEAREST,[Ip]:s.NEAREST_MIPMAP_NEAREST,[Nr]:s.NEAREST_MIPMAP_LINEAR,[He]:s.LINEAR,[ya]:s.LINEAR_MIPMAP_NEAREST,[Hi]:s.LINEAR_MIPMAP_LINEAR},ge={[kp]:s.NEVER,[Hp]:s.ALWAYS,[Fp]:s.LESS,[rl]:s.LEQUAL,[Op]:s.EQUAL,[ol]:s.GEQUAL,[Bp]:s.GREATER,[zp]:s.NOTEQUAL};function ne(C,y){if(y.type===yn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===He||y.magFilter===ya||y.magFilter===Nr||y.magFilter===Hi||y.minFilter===He||y.minFilter===ya||y.minFilter===Nr||y.minFilter===Hi)&&kt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,ft[y.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,ft[y.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,ft[y.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,$t[y.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,$t[y.minFilter]),y.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,ge[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===ze||y.minFilter!==Nr&&y.minFilter!==Hi||y.type===yn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");s.texParameterf(C,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,i.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function j(C,y){let z=!1;C.__webglInit===void 0&&(C.__webglInit=!0,y.addEventListener("dispose",R));const H=y.source;let Z=f.get(H);Z===void 0&&(Z={},f.set(H,Z));const rt=B(y);if(rt!==C.__cacheKey){Z[rt]===void 0&&(Z[rt]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,z=!0),Z[rt].usedTimes++;const ht=Z[C.__cacheKey];ht!==void 0&&(Z[C.__cacheKey].usedTimes--,ht.usedTimes===0&&L(y)),C.__cacheKey=rt,C.__webglTexture=Z[rt].texture}return z}function ct(C,y,z){return Math.floor(Math.floor(C/z)/y)}function st(C,y,z,H){const rt=C.updateRanges;if(rt.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,y.width,y.height,z,H,y.data);else{rt.sort((Rt,vt)=>Rt.start-vt.start);let ht=0;for(let Rt=1;Rt<rt.length;Rt++){const vt=rt[ht],mt=rt[Rt],Nt=vt.start+vt.count,Bt=ct(mt.start,y.width,4),Yt=ct(vt.start,y.width,4);mt.start<=Nt+1&&Bt===Yt&&ct(mt.start+mt.count-1,y.width,4)===Bt?vt.count=Math.max(vt.count,mt.start+mt.count-vt.start):(++ht,rt[ht]=mt)}rt.length=ht+1;const J=e.getParameter(s.UNPACK_ROW_LENGTH),tt=e.getParameter(s.UNPACK_SKIP_PIXELS),pt=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,y.width);for(let Rt=0,vt=rt.length;Rt<vt;Rt++){const mt=rt[Rt],Nt=Math.floor(mt.start/4),Bt=Math.ceil(mt.count/4),Yt=Nt%y.width,k=Math.floor(Nt/y.width),ut=Bt,Q=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,Yt),e.pixelStorei(s.UNPACK_SKIP_ROWS,k),e.texSubImage2D(s.TEXTURE_2D,0,Yt,k,ut,Q,z,H,y.data)}C.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,J),e.pixelStorei(s.UNPACK_SKIP_PIXELS,tt),e.pixelStorei(s.UNPACK_SKIP_ROWS,pt)}}function Ot(C,y,z){let H=s.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(H=s.TEXTURE_2D_ARRAY),y.isData3DTexture&&(H=s.TEXTURE_3D);const Z=j(C,y),rt=y.source;e.bindTexture(H,C.__webglTexture,s.TEXTURE0+z);const ht=n.get(rt);if(rt.version!==ht.__version||Z===!0){if(e.activeTexture(s.TEXTURE0+z),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){const Q=re.getPrimaries(re.workingColorSpace),gt=y.colorSpace===mi?null:re.getPrimaries(y.colorSpace),Mt=y.colorSpace===mi||Q===gt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt)}e.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment);let tt=m(y.image,!1,i.maxTextureSize);tt=ie(y,tt);const pt=r.convert(y.format,y.colorSpace),Rt=r.convert(y.type);let vt=M(y.internalFormat,pt,Rt,y.normalized,y.colorSpace,y.isVideoTexture);ne(H,y);let mt;const Nt=y.mipmaps,Bt=y.isVideoTexture!==!0,Yt=ht.__version===void 0||Z===!0,k=rt.dataReady,ut=b(y,tt);if(y.isDepthTexture)vt=E(y.format===Gi,y.type),Yt&&(Bt?e.texStorage2D(s.TEXTURE_2D,1,vt,tt.width,tt.height):e.texImage2D(s.TEXTURE_2D,0,vt,tt.width,tt.height,0,pt,Rt,null));else if(y.isDataTexture)if(Nt.length>0){Bt&&Yt&&e.texStorage2D(s.TEXTURE_2D,ut,vt,Nt[0].width,Nt[0].height);for(let Q=0,gt=Nt.length;Q<gt;Q++)mt=Nt[Q],Bt?k&&e.texSubImage2D(s.TEXTURE_2D,Q,0,0,mt.width,mt.height,pt,Rt,mt.data):e.texImage2D(s.TEXTURE_2D,Q,vt,mt.width,mt.height,0,pt,Rt,mt.data);y.generateMipmaps=!1}else Bt?(Yt&&e.texStorage2D(s.TEXTURE_2D,ut,vt,tt.width,tt.height),k&&st(y,tt,pt,Rt)):e.texImage2D(s.TEXTURE_2D,0,vt,tt.width,tt.height,0,pt,Rt,tt.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Bt&&Yt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,ut,vt,Nt[0].width,Nt[0].height,tt.depth);for(let Q=0,gt=Nt.length;Q<gt;Q++)if(mt=Nt[Q],y.format!==Mn)if(pt!==null)if(Bt){if(k)if(y.layerUpdates.size>0){const Mt=_u(mt.width,mt.height,y.format,y.type);for(const it of y.layerUpdates){const Ct=mt.data.subarray(it*Mt/mt.data.BYTES_PER_ELEMENT,(it+1)*Mt/mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,it,mt.width,mt.height,1,pt,Ct)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,0,mt.width,mt.height,tt.depth,pt,mt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,Q,vt,mt.width,mt.height,tt.depth,0,mt.data,0,0);else kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Bt?k&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,0,mt.width,mt.height,tt.depth,pt,Rt,mt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,Q,vt,mt.width,mt.height,tt.depth,0,pt,Rt,mt.data)}else{Bt&&Yt&&e.texStorage2D(s.TEXTURE_2D,ut,vt,Nt[0].width,Nt[0].height);for(let Q=0,gt=Nt.length;Q<gt;Q++)mt=Nt[Q],y.format!==Mn?pt!==null?Bt?k&&e.compressedTexSubImage2D(s.TEXTURE_2D,Q,0,0,mt.width,mt.height,pt,mt.data):e.compressedTexImage2D(s.TEXTURE_2D,Q,vt,mt.width,mt.height,0,mt.data):kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Bt?k&&e.texSubImage2D(s.TEXTURE_2D,Q,0,0,mt.width,mt.height,pt,Rt,mt.data):e.texImage2D(s.TEXTURE_2D,Q,vt,mt.width,mt.height,0,pt,Rt,mt.data)}else if(y.isDataArrayTexture)if(Bt){if(Yt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,ut,vt,tt.width,tt.height,tt.depth),k)if(y.layerUpdates.size>0){const Q=_u(tt.width,tt.height,y.format,y.type);for(const gt of y.layerUpdates){const Mt=tt.data.subarray(gt*Q/tt.data.BYTES_PER_ELEMENT,(gt+1)*Q/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,gt,tt.width,tt.height,1,pt,Rt,Mt)}y.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,pt,Rt,tt.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,vt,tt.width,tt.height,tt.depth,0,pt,Rt,tt.data);else if(y.isData3DTexture)Bt?(Yt&&e.texStorage3D(s.TEXTURE_3D,ut,vt,tt.width,tt.height,tt.depth),k&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,pt,Rt,tt.data)):e.texImage3D(s.TEXTURE_3D,0,vt,tt.width,tt.height,tt.depth,0,pt,Rt,tt.data);else if(y.isFramebufferTexture){if(Yt)if(Bt)e.texStorage2D(s.TEXTURE_2D,ut,vt,tt.width,tt.height);else{let Q=tt.width,gt=tt.height;for(let Mt=0;Mt<ut;Mt++)e.texImage2D(s.TEXTURE_2D,Mt,vt,Q,gt,0,pt,Rt,null),Q>>=1,gt>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in s){const Q=s.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),tt.parentNode!==Q){Q.appendChild(tt),u.add(y),Q.onpaint=gt=>{const Mt=gt.changedElements;for(const it of u)Mt.includes(it.image)&&(it.needsUpdate=!0)},Q.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,tt);else{const Mt=s.RGBA,it=s.RGBA,Ct=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Mt,it,Ct,tt)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Nt.length>0){if(Bt&&Yt){const Q=Kt(Nt[0]);e.texStorage2D(s.TEXTURE_2D,ut,vt,Q.width,Q.height)}for(let Q=0,gt=Nt.length;Q<gt;Q++)mt=Nt[Q],Bt?k&&e.texSubImage2D(s.TEXTURE_2D,Q,0,0,pt,Rt,mt):e.texImage2D(s.TEXTURE_2D,Q,vt,pt,Rt,mt);y.generateMipmaps=!1}else if(Bt){if(Yt){const Q=Kt(tt);e.texStorage2D(s.TEXTURE_2D,ut,vt,Q.width,Q.height)}k&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,pt,Rt,tt)}else e.texImage2D(s.TEXTURE_2D,0,vt,pt,Rt,tt);g(y)&&x(H),ht.__version=rt.version,y.onUpdate&&y.onUpdate(y)}C.__version=y.version}function Wt(C,y,z){if(y.image.length!==6)return;const H=j(C,y),Z=y.source;e.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+z);const rt=n.get(Z);if(Z.version!==rt.__version||H===!0){e.activeTexture(s.TEXTURE0+z);const ht=re.getPrimaries(re.workingColorSpace),J=y.colorSpace===mi?null:re.getPrimaries(y.colorSpace),tt=y.colorSpace===mi||ht===J?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,tt);const pt=y.isCompressedTexture||y.image[0].isCompressedTexture,Rt=y.image[0]&&y.image[0].isDataTexture,vt=[];for(let it=0;it<6;it++)!pt&&!Rt?vt[it]=m(y.image[it],!0,i.maxCubemapSize):vt[it]=Rt?y.image[it].image:y.image[it],vt[it]=ie(y,vt[it]);const mt=vt[0],Nt=r.convert(y.format,y.colorSpace),Bt=r.convert(y.type),Yt=M(y.internalFormat,Nt,Bt,y.normalized,y.colorSpace),k=y.isVideoTexture!==!0,ut=rt.__version===void 0||H===!0,Q=Z.dataReady;let gt=b(y,mt);ne(s.TEXTURE_CUBE_MAP,y);let Mt;if(pt){k&&ut&&e.texStorage2D(s.TEXTURE_CUBE_MAP,gt,Yt,mt.width,mt.height);for(let it=0;it<6;it++){Mt=vt[it].mipmaps;for(let Ct=0;Ct<Mt.length;Ct++){const wt=Mt[Ct];y.format!==Mn?Nt!==null?k?Q&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct,0,0,wt.width,wt.height,Nt,wt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct,Yt,wt.width,wt.height,0,wt.data):kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct,0,0,wt.width,wt.height,Nt,Bt,wt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct,Yt,wt.width,wt.height,0,Nt,Bt,wt.data)}}}else{if(Mt=y.mipmaps,k&&ut){Mt.length>0&&gt++;const it=Kt(vt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,gt,Yt,it.width,it.height)}for(let it=0;it<6;it++)if(Rt){k?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,vt[it].width,vt[it].height,Nt,Bt,vt[it].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,Yt,vt[it].width,vt[it].height,0,Nt,Bt,vt[it].data);for(let Ct=0;Ct<Mt.length;Ct++){const Te=Mt[Ct].image[it].image;k?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct+1,0,0,Te.width,Te.height,Nt,Bt,Te.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct+1,Yt,Te.width,Te.height,0,Nt,Bt,Te.data)}}else{k?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,Nt,Bt,vt[it]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,Yt,Nt,Bt,vt[it]);for(let Ct=0;Ct<Mt.length;Ct++){const wt=Mt[Ct];k?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct+1,0,0,Nt,Bt,wt.image[it]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct+1,Yt,Nt,Bt,wt.image[it])}}}g(y)&&x(s.TEXTURE_CUBE_MAP),rt.__version=Z.version,y.onUpdate&&y.onUpdate(y)}C.__version=y.version}function Ft(C,y,z,H,Z,rt){const ht=r.convert(z.format,z.colorSpace),J=r.convert(z.type),tt=M(z.internalFormat,ht,J,z.normalized,z.colorSpace),pt=n.get(y),Rt=n.get(z);if(Rt.__renderTarget=y,!pt.__hasExternalTextures){const vt=Math.max(1,y.width>>rt),mt=Math.max(1,y.height>>rt);Z===s.TEXTURE_3D||Z===s.TEXTURE_2D_ARRAY?e.texImage3D(Z,rt,tt,vt,mt,y.depth,0,ht,J,null):e.texImage2D(Z,rt,tt,vt,mt,0,ht,J,null)}e.bindFramebuffer(s.FRAMEBUFFER,C),At(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,H,Z,Rt.__webglTexture,0,It(y)):(Z===s.TEXTURE_2D||Z>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,H,Z,Rt.__webglTexture,rt),e.bindFramebuffer(s.FRAMEBUFFER,null)}function we(C,y,z){if(s.bindRenderbuffer(s.RENDERBUFFER,C),y.depthBuffer){const H=y.depthTexture,Z=H&&H.isDepthTexture?H.type:null,rt=E(y.stencilBuffer,Z),ht=y.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;At(y)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,It(y),rt,y.width,y.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,It(y),rt,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,rt,y.width,y.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ht,s.RENDERBUFFER,C)}else{const H=y.textures;for(let Z=0;Z<H.length;Z++){const rt=H[Z],ht=r.convert(rt.format,rt.colorSpace),J=r.convert(rt.type),tt=M(rt.internalFormat,ht,J,rt.normalized,rt.colorSpace);At(y)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,It(y),tt,y.width,y.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,It(y),tt,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,tt,y.width,y.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ee(C,y,z){const H=y.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,C),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Z=n.get(y.depthTexture);if(Z.__renderTarget=y,(!Z.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),H){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,y.depthTexture.addEventListener("dispose",R)),Z.__webglTexture===void 0){Z.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture),ne(s.TEXTURE_CUBE_MAP,y.depthTexture);const pt=r.convert(y.depthTexture.format),Rt=r.convert(y.depthTexture.type);let vt;y.depthTexture.format===qn?vt=s.DEPTH_COMPONENT24:y.depthTexture.format===Gi&&(vt=s.DEPTH24_STENCIL8);for(let mt=0;mt<6;mt++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,vt,y.width,y.height,0,pt,Rt,null)}}else q(y.depthTexture,0);const rt=Z.__webglTexture,ht=It(y),J=H?s.TEXTURE_CUBE_MAP_POSITIVE_X+z:s.TEXTURE_2D,tt=y.depthTexture.format===Gi?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(y.depthTexture.format===qn)At(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,tt,J,rt,0,ht):s.framebufferTexture2D(s.FRAMEBUFFER,tt,J,rt,0);else if(y.depthTexture.format===Gi)At(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,tt,J,rt,0,ht):s.framebufferTexture2D(s.FRAMEBUFFER,tt,J,rt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function de(C){const y=n.get(C),z=C.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==C.depthTexture){const H=C.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),H){const Z=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,H.removeEventListener("dispose",Z)};H.addEventListener("dispose",Z),y.__depthDisposeCallback=Z}y.__boundDepthTexture=H}if(C.depthTexture&&!y.__autoAllocateDepthBuffer)if(z)for(let H=0;H<6;H++)ee(y.__webglFramebuffer[H],C,H);else{const H=C.texture.mipmaps;H&&H.length>0?ee(y.__webglFramebuffer[0],C,0):ee(y.__webglFramebuffer,C,0)}else if(z){y.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer[H]),y.__webglDepthbuffer[H]===void 0)y.__webglDepthbuffer[H]=s.createRenderbuffer(),we(y.__webglDepthbuffer[H],C,!1);else{const Z=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,rt=y.__webglDepthbuffer[H];s.bindRenderbuffer(s.RENDERBUFFER,rt),s.framebufferRenderbuffer(s.FRAMEBUFFER,Z,s.RENDERBUFFER,rt)}}else{const H=C.texture.mipmaps;if(H&&H.length>0?e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=s.createRenderbuffer(),we(y.__webglDepthbuffer,C,!1);else{const Z=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,rt=y.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,rt),s.framebufferRenderbuffer(s.FRAMEBUFFER,Z,s.RENDERBUFFER,rt)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function ae(C,y,z){const H=n.get(C);y!==void 0&&Ft(H.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&de(C)}function se(C){const y=C.texture,z=n.get(C),H=n.get(y);C.addEventListener("dispose",_);const Z=C.textures,rt=C.isWebGLCubeRenderTarget===!0,ht=Z.length>1;if(ht||(H.__webglTexture===void 0&&(H.__webglTexture=s.createTexture()),H.__version=y.version,o.memory.textures++),rt){z.__webglFramebuffer=[];for(let J=0;J<6;J++)if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer[J]=[];for(let tt=0;tt<y.mipmaps.length;tt++)z.__webglFramebuffer[J][tt]=s.createFramebuffer()}else z.__webglFramebuffer[J]=s.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer=[];for(let J=0;J<y.mipmaps.length;J++)z.__webglFramebuffer[J]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(ht)for(let J=0,tt=Z.length;J<tt;J++){const pt=n.get(Z[J]);pt.__webglTexture===void 0&&(pt.__webglTexture=s.createTexture(),o.memory.textures++)}if(C.samples>0&&At(C)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let J=0;J<Z.length;J++){const tt=Z[J];z.__webglColorRenderbuffer[J]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[J]);const pt=r.convert(tt.format,tt.colorSpace),Rt=r.convert(tt.type),vt=M(tt.internalFormat,pt,Rt,tt.normalized,tt.colorSpace,C.isXRRenderTarget===!0),mt=It(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,mt,vt,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+J,s.RENDERBUFFER,z.__webglColorRenderbuffer[J])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),we(z.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(rt){e.bindTexture(s.TEXTURE_CUBE_MAP,H.__webglTexture),ne(s.TEXTURE_CUBE_MAP,y);for(let J=0;J<6;J++)if(y.mipmaps&&y.mipmaps.length>0)for(let tt=0;tt<y.mipmaps.length;tt++)Ft(z.__webglFramebuffer[J][tt],C,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+J,tt);else Ft(z.__webglFramebuffer[J],C,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);g(y)&&x(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ht){for(let J=0,tt=Z.length;J<tt;J++){const pt=Z[J],Rt=n.get(pt);let vt=s.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(vt=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(vt,Rt.__webglTexture),ne(vt,pt),Ft(z.__webglFramebuffer,C,pt,s.COLOR_ATTACHMENT0+J,vt,0),g(pt)&&x(vt)}e.unbindTexture()}else{let J=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(J=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(J,H.__webglTexture),ne(J,y),y.mipmaps&&y.mipmaps.length>0)for(let tt=0;tt<y.mipmaps.length;tt++)Ft(z.__webglFramebuffer[tt],C,y,s.COLOR_ATTACHMENT0,J,tt);else Ft(z.__webglFramebuffer,C,y,s.COLOR_ATTACHMENT0,J,0);g(y)&&x(J),e.unbindTexture()}C.depthBuffer&&de(C)}function F(C){const y=C.textures;for(let z=0,H=y.length;z<H;z++){const Z=y[z];if(g(Z)){const rt=w(C),ht=n.get(Z).__webglTexture;e.bindTexture(rt,ht),x(rt),e.unbindTexture()}}}const nt=[],Et=[];function Ht(C){if(C.samples>0){if(At(C)===!1){const y=C.textures,z=C.width,H=C.height;let Z=s.COLOR_BUFFER_BIT;const rt=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ht=n.get(C),J=y.length>1;if(J)for(let pt=0;pt<y.length;pt++)e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,ht.__webglMultisampledFramebuffer);const tt=C.texture.mipmaps;tt&&tt.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ht.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ht.__webglFramebuffer);for(let pt=0;pt<y.length;pt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(Z|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(Z|=s.STENCIL_BUFFER_BIT)),J){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ht.__webglColorRenderbuffer[pt]);const Rt=n.get(y[pt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Rt,0)}s.blitFramebuffer(0,0,z,H,0,0,z,H,Z,s.NEAREST),l===!0&&(nt.length=0,Et.length=0,nt.push(s.COLOR_ATTACHMENT0+pt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(nt.push(rt),Et.push(rt),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Et)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,nt))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),J)for(let pt=0;pt<y.length;pt++){e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.RENDERBUFFER,ht.__webglColorRenderbuffer[pt]);const Rt=n.get(y[pt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.TEXTURE_2D,Rt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ht.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const y=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[y])}}}function It(C){return Math.min(i.maxSamples,C.samples)}function At(C){const y=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function I(C){const y=o.render.frame;h.get(C)!==y&&(h.set(C,y),C.update())}function ie(C,y){const z=C.colorSpace,H=C.format,Z=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||z!==ir&&z!==mi&&(re.getTransfer(z)===he?(H!==Mn||Z!==rn)&&kt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):oe("WebGLTextures: Unsupported texture color space:",z)),y}function Kt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=G,this.getTextureUnits=K,this.setTextureUnits=N,this.setTexture2D=q,this.setTexture2DArray=et,this.setTexture3D=ot,this.setTextureCube=lt,this.rebindTextures=ae,this.setupRenderTarget=se,this.updateRenderTargetMipmap=F,this.updateMultisampleRenderTarget=Ht,this.setupDepthRenderbuffer=de,this.setupFrameBufferTexture=Ft,this.useMultisampledRTT=At,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function __(s,t){function e(n,i=mi){let r;const o=re.getTransfer(i);if(n===rn)return s.UNSIGNED_BYTE;if(n===ba)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Sa)return s.UNSIGNED_SHORT_5_5_5_1;if(n===xh)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===vh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===mh)return s.BYTE;if(n===gh)return s.SHORT;if(n===er)return s.UNSIGNED_SHORT;if(n===Ma)return s.INT;if(n===In)return s.UNSIGNED_INT;if(n===yn)return s.FLOAT;if(n===on)return s.HALF_FLOAT;if(n===_h)return s.ALPHA;if(n===yh)return s.RGB;if(n===Mn)return s.RGBA;if(n===qn)return s.DEPTH_COMPONENT;if(n===Gi)return s.DEPTH_STENCIL;if(n===wa)return s.RED;if(n===Ea)return s.RED_INTEGER;if(n===Vi)return s.RG;if(n===Ta)return s.RG_INTEGER;if(n===Aa)return s.RGBA_INTEGER;if(n===kr||n===Fr||n===Or||n===Br)if(o===he)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===kr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Fr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Or)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===kr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Fr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Or)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Br)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ca||n===Ra||n===Pa||n===La)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ca)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ra)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Pa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===La)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Da||n===Ia||n===Ua||n===Na||n===ka||n===zr||n===Fa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Da||n===Ia)return o===he?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ua)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Na)return r.COMPRESSED_R11_EAC;if(n===ka)return r.COMPRESSED_SIGNED_R11_EAC;if(n===zr)return r.COMPRESSED_RG11_EAC;if(n===Fa)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Oa||n===Ba||n===za||n===Ha||n===Ga||n===Va||n===Wa||n===$a||n===Xa||n===Ya||n===qa||n===Ka||n===Za||n===Ja)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Oa)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ba)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===za)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ha)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ga)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Va)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Wa)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===$a)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Xa)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ya)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===qa)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ka)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Za)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ja)return o===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ja||n===Qa||n===tl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===ja)return o===he?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Qa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===tl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===el||n===nl||n===Hr||n===il)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===el)return r.COMPRESSED_RED_RGTC1_EXT;if(n===nl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Hr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===il)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===nr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}const y_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,M_=`
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

}`;class b_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new nu(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new De({vertexShader:y_,fragmentShader:M_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new jt(new mn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class S_ extends gi{constructor(t,e){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,p=null;const v=typeof XRWebGLBinding<"u",m=new b_,g={},x=e.getContextAttributes();let w=null,M=null;const E=[],b=[],R=new dt;let _=null;const T=new tn;T.viewport=new be;const L=new tn;L.viewport=new be;const D=[T,L],U=new l0;let G=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ct=E[j];return ct===void 0&&(ct=new ml,E[j]=ct),ct.getTargetRaySpace()},this.getControllerGrip=function(j){let ct=E[j];return ct===void 0&&(ct=new ml,E[j]=ct),ct.getGripSpace()},this.getHand=function(j){let ct=E[j];return ct===void 0&&(ct=new ml,E[j]=ct),ct.getHandSpace()};function N(j){const ct=b.indexOf(j.inputSource);if(ct===-1)return;const st=E[ct];st!==void 0&&(st.update(j.inputSource,j.frame,c||o),st.dispatchEvent({type:j.type,data:j.inputSource}))}function W(){i.removeEventListener("select",N),i.removeEventListener("selectstart",N),i.removeEventListener("selectend",N),i.removeEventListener("squeeze",N),i.removeEventListener("squeezestart",N),i.removeEventListener("squeezeend",N),i.removeEventListener("end",W),i.removeEventListener("inputsourceschange",B);for(let j=0;j<E.length;j++){const ct=b[j];ct!==null&&(b[j]=null,E[j].disconnect(ct))}G=null,K=null,m.reset();for(const j in g)delete g[j];t.setRenderTarget(w),f=null,d=null,u=null,i=null,M=null,ne.stop(),n.isPresenting=!1,t.setPixelRatio(_),t.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&kt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,n.isPresenting===!0&&kt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(i,e)),u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(j){if(i=j,i!==null){if(w=t.getRenderTarget(),i.addEventListener("select",N),i.addEventListener("selectstart",N),i.addEventListener("selectend",N),i.addEventListener("squeeze",N),i.addEventListener("squeezestart",N),i.addEventListener("squeezeend",N),i.addEventListener("end",W),i.addEventListener("inputsourceschange",B),x.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let st=null,Ot=null,Wt=null;x.depth&&(Wt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,st=x.stencil?Gi:qn,Ot=x.stencil?nr:In);const Ft={colorFormat:e.RGBA8,depthFormat:Wt,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Ft),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),M=new je(d.textureWidth,d.textureHeight,{format:Mn,type:rn,depthTexture:new Us(d.textureWidth,d.textureHeight,Ot,void 0,void 0,void 0,void 0,void 0,void 0,st),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const st={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,st),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new je(f.framebufferWidth,f.framebufferHeight,{format:Mn,type:rn,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),ne.setContext(i),ne.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function B(j){for(let ct=0;ct<j.removed.length;ct++){const st=j.removed[ct],Ot=b.indexOf(st);Ot>=0&&(b[Ot]=null,E[Ot].disconnect(st))}for(let ct=0;ct<j.added.length;ct++){const st=j.added[ct];let Ot=b.indexOf(st);if(Ot===-1){for(let Ft=0;Ft<E.length;Ft++)if(Ft>=b.length){b.push(st),Ot=Ft;break}else if(b[Ft]===null){b[Ft]=st,Ot=Ft;break}if(Ot===-1)break}const Wt=E[Ot];Wt&&Wt.connect(st)}}const q=new P,et=new P;function ot(j,ct,st){q.setFromMatrixPosition(ct.matrixWorld),et.setFromMatrixPosition(st.matrixWorld);const Ot=q.distanceTo(et),Wt=ct.projectionMatrix.elements,Ft=st.projectionMatrix.elements,we=Wt[14]/(Wt[10]-1),ee=Wt[14]/(Wt[10]+1),de=(Wt[9]+1)/Wt[5],ae=(Wt[9]-1)/Wt[5],se=(Wt[8]-1)/Wt[0],F=(Ft[8]+1)/Ft[0],nt=we*se,Et=we*F,Ht=Ot/(-se+F),It=Ht*-se;if(ct.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(It),j.translateZ(Ht),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Wt[10]===-1)j.projectionMatrix.copy(ct.projectionMatrix),j.projectionMatrixInverse.copy(ct.projectionMatrixInverse);else{const At=we+Ht,I=ee+Ht,ie=nt-It,Kt=Et+(Ot-It),C=de*ee/I*At,y=ae*ee/I*At;j.projectionMatrix.makePerspective(ie,Kt,C,y,At,I),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function lt(j,ct){ct===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ct.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(i===null)return;let ct=j.near,st=j.far;m.texture!==null&&(m.depthNear>0&&(ct=m.depthNear),m.depthFar>0&&(st=m.depthFar)),U.near=L.near=T.near=ct,U.far=L.far=T.far=st,(G!==U.near||K!==U.far)&&(i.updateRenderState({depthNear:U.near,depthFar:U.far}),G=U.near,K=U.far),U.layers.mask=j.layers.mask|6,T.layers.mask=U.layers.mask&-5,L.layers.mask=U.layers.mask&-3;const Ot=j.parent,Wt=U.cameras;lt(U,Ot);for(let Ft=0;Ft<Wt.length;Ft++)lt(Wt[Ft],Ot);Wt.length===2?ot(U,T,L):U.projectionMatrix.copy(T.projectionMatrix),ft(j,U,Ot)};function ft(j,ct,st){st===null?j.matrix.copy(ct.matrixWorld):(j.matrix.copy(st.matrixWorld),j.matrix.invert(),j.matrix.multiply(ct.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(ct.projectionMatrix),j.projectionMatrixInverse.copy(ct.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=gs*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(j){l=j,d!==null&&(d.fixedFoveation=j),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=j)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(U)},this.getCameraTexture=function(j){return g[j]};let $t=null;function ge(j,ct){if(h=ct.getViewerPose(c||o),p=ct,h!==null){const st=h.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let Ot=!1;st.length!==U.cameras.length&&(U.cameras.length=0,Ot=!0);for(let ee=0;ee<st.length;ee++){const de=st[ee];let ae=null;if(f!==null)ae=f.getViewport(de);else{const F=u.getViewSubImage(d,de);ae=F.viewport,ee===0&&(t.setRenderTargetTextures(M,F.colorTexture,F.depthStencilTexture),t.setRenderTarget(M))}let se=D[ee];se===void 0&&(se=new tn,se.layers.enable(ee),se.viewport=new be,D[ee]=se),se.matrix.fromArray(de.transform.matrix),se.matrix.decompose(se.position,se.quaternion,se.scale),se.projectionMatrix.fromArray(de.projectionMatrix),se.projectionMatrixInverse.copy(se.projectionMatrix).invert(),se.viewport.set(ae.x,ae.y,ae.width,ae.height),ee===0&&(U.matrix.copy(se.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Ot===!0&&U.cameras.push(se)}const Wt=i.enabledFeatures;if(Wt&&Wt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const ee=u.getDepthInformation(st[0]);ee&&ee.isValid&&ee.texture&&m.init(ee,i.renderState)}if(Wt&&Wt.includes("camera-access")&&v){t.state.unbindTexture(),u=n.getBinding();for(let ee=0;ee<st.length;ee++){const de=st[ee].camera;if(de){let ae=g[de];ae||(ae=new nu,g[de]=ae);const se=u.getCameraImage(de);ae.sourceTexture=se}}}}for(let st=0;st<E.length;st++){const Ot=b[st],Wt=E[st];Ot!==null&&Wt!==void 0&&Wt.update(Ot,ct,c||o)}$t&&$t(j,ct),ct.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ct}),p=null}const ne=new yu;ne.setAnimationLoop(ge),this.setAnimationLoop=function(j){$t=j},this.dispose=function(){}}}const w_=new ce,Zu=new Vt;Zu.set(-1,0,0,0,1,0,0,0,1);function E_(s,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,hu(s)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,x,w,M){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),u(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,M)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),v(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(o(m,g),g.isLineDashedMaterial&&a(m,g)):g.isPointsMaterial?l(m,g,x,w):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===Ke&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===Ke&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const x=t.get(g),w=x.envMap,M=x.envMapRotation;w&&(m.envMap.value=w,m.envMapRotation.value.setFromMatrix4(w_.makeRotationFromEuler(M)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Zu),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function o(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function a(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,x,w){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*x,m.scale.value=w*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function u(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,x){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Ke&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function v(m,g){const x=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function T_(s,t,e,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,E){const b=E.program;n.uniformBlockBinding(M,b)}function c(M,E){let b=i[M.id];b===void 0&&(m(M),b=h(M),i[M.id]=b,M.addEventListener("dispose",x));const R=E.program;n.updateUBOMapping(M,R);const _=t.render.frame;r[M.id]!==_&&(d(M),r[M.id]=_)}function h(M){const E=u();M.__bindingPointIndex=E;const b=s.createBuffer(),R=M.__size,_=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,b),s.bufferData(s.UNIFORM_BUFFER,R,_),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,E,b),b}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return oe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const E=i[M.id],b=M.uniforms,R=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,E);for(let _=0,T=b.length;_<T;_++){const L=b[_];if(Array.isArray(L))for(let D=0,U=L.length;D<U;D++)f(L[D],_,D,R);else f(L,_,0,R)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,E,b,R){if(v(M,E,b,R)===!0){const _=M.__offset,T=M.value;if(Array.isArray(T)){let L=0;for(let D=0;D<T.length;D++){const U=T[D],G=g(U);p(U,M.__data,L),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(L+=G.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(T,M.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,_,M.__data)}}function p(M,E,b){typeof M=="number"||typeof M=="boolean"?E[0]=M:M.isMatrix3?(E[0]=M.elements[0],E[1]=M.elements[1],E[2]=M.elements[2],E[3]=0,E[4]=M.elements[3],E[5]=M.elements[4],E[6]=M.elements[5],E[7]=0,E[8]=M.elements[6],E[9]=M.elements[7],E[10]=M.elements[8],E[11]=0):ArrayBuffer.isView(M)?E.set(new M.constructor(M.buffer,M.byteOffset,E.length)):M.toArray(E,b)}function v(M,E,b,R){const _=M.value,T=E+"_"+b;if(R[T]===void 0)return typeof _=="number"||typeof _=="boolean"?R[T]=_:ArrayBuffer.isView(_)?R[T]=_.slice():R[T]=_.clone(),!0;{const L=R[T];if(typeof _=="number"||typeof _=="boolean"){if(L!==_)return R[T]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(L.equals(_)===!1)return L.copy(_),!0}}return!1}function m(M){const E=M.uniforms;let b=0;const R=16;for(let T=0,L=E.length;T<L;T++){const D=Array.isArray(E[T])?E[T]:[E[T]];for(let U=0,G=D.length;U<G;U++){const K=D[U],N=Array.isArray(K.value)?K.value:[K.value];for(let W=0,B=N.length;W<B;W++){const q=N[W],et=g(q),ot=b%R,lt=ot%et.boundary,ft=ot+lt;b+=lt,ft!==0&&R-ft<et.storage&&(b+=R-ft),K.__data=new Float32Array(et.storage/Float32Array.BYTES_PER_ELEMENT),K.__offset=b,b+=et.storage}}}const _=b%R;return _>0&&(b+=R-_),M.__size=b,M.__cache={},this}function g(M){const E={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(E.boundary=4,E.storage=4):M.isVector2?(E.boundary=8,E.storage=8):M.isVector3||M.isColor?(E.boundary=16,E.storage=12):M.isVector4?(E.boundary=16,E.storage=16):M.isMatrix3?(E.boundary=48,E.storage=48):M.isMatrix4?(E.boundary=64,E.storage=64):M.isTexture?kt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(E.boundary=16,E.storage=M.byteLength):kt("WebGLRenderer: Unsupported uniform value type.",M),E}function x(M){const E=M.target;E.removeEventListener("dispose",x);const b=o.indexOf(E.__bindingPointIndex);o.splice(b,1),s.deleteBuffer(i[E.id]),delete i[E.id],delete r[E.id]}function w(){for(const M in i)s.deleteBuffer(i[M]);o=[],i={},r={}}return{bind:l,update:c,dispose:w}}const A_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let On=null;function C_(){return On===null&&(On=new Xh(A_,16,16,Vi,on),On.name="DFG_LUT",On.minFilter=He,On.magFilter=He,On.wrapS=Yn,On.wrapT=Yn,On.generateMipmaps=!1,On.needsUpdate=!0),On}class R_{constructor(t={}){const{canvas:e=Vp(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=rn}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const v=f,m=new Set([Aa,Ta,Ea]),g=new Set([rn,In,er,nr,ba,Sa]),x=new Uint32Array(4),w=new Int32Array(4),M=new P;let E=null,b=null;const R=[],_=[];let T=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Dn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let D=!1,U=null,G=null,K=null,N=null;this._outputColorSpace=ke;let W=0,B=0,q=null,et=-1,ot=null;const lt=new be,ft=new be;let $t=null;const ge=new Gt(0);let ne=0,j=e.width,ct=e.height,st=1,Ot=null,Wt=null;const Ft=new be(0,0,j,ct),we=new be(0,0,j,ct);let ee=!1;const de=new ho;let ae=!1,se=!1;const F=new ce,nt=new P,Et=new be,Ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let It=!1;function At(){return q===null?st:1}let I=n;function ie(S,O){return e.getContext(S,O)}try{const S={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${oa}`),e.addEventListener("webglcontextlost",Te,!1),e.addEventListener("webglcontextrestored",ye,!1),e.addEventListener("webglcontextcreationerror",Hn,!1),I===null){const O="webgl2";if(I=ie(O,S),I===null)throw ie(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(S){throw oe("WebGLRenderer: "+S.message),S}let Kt,C,y,z,H,Z,rt,ht,J,tt,pt,Rt,vt,mt,Nt,Bt,Yt,k,ut,Q,gt,Mt,it;function Ct(){Kt=new Cx(I),Kt.init(),gt=new __(I,Kt),C=new yx(I,Kt,t,gt),y=new x_(I,Kt),C.reversedDepthBuffer&&d&&y.buffers.depth.setReversed(!0),G=I.createFramebuffer(),K=I.createFramebuffer(),N=I.createFramebuffer(),z=new Lx(I),H=new i_,Z=new v_(I,Kt,y,H,C,gt,z),rt=new Ax(L),ht=new m0(I),Mt=new vx(I,ht),J=new Rx(I,ht,z,Mt),tt=new Ix(I,J,ht,Mt,z),k=new Dx(I,C,Z),Nt=new Mx(H),pt=new n_(L,rt,Kt,C,Mt,Nt),Rt=new E_(L,H),vt=new r_,mt=new u_(Kt),Yt=new xx(L,rt,y,tt,p,l),Bt=new g_(L,tt,C),it=new T_(I,z,C,y),ut=new _x(I,Kt,z),Q=new Px(I,Kt,z),z.programs=pt.programs,L.capabilities=C,L.extensions=Kt,L.properties=H,L.renderLists=vt,L.shadowMap=Bt,L.state=y,L.info=z}Ct(),v!==rn&&(T=new Nx(v,e.width,e.height,a,i,r));const wt=new S_(L,I);this.xr=wt,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const S=Kt.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Kt.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return st},this.setPixelRatio=function(S){S!==void 0&&(st=S,this.setSize(j,ct,!1))},this.getSize=function(S){return S.set(j,ct)},this.setSize=function(S,O,Y=!0){if(wt.isPresenting){kt("WebGLRenderer: Can't change size while VR device is presenting.");return}j=S,ct=O,e.width=Math.floor(S*st),e.height=Math.floor(O*st),Y===!0&&(e.style.width=S+"px",e.style.height=O+"px"),T!==null&&T.setSize(e.width,e.height),this.setViewport(0,0,S,O)},this.getDrawingBufferSize=function(S){return S.set(j*st,ct*st).floor()},this.setDrawingBufferSize=function(S,O,Y){j=S,ct=O,st=Y,e.width=Math.floor(S*Y),e.height=Math.floor(O*Y),this.setViewport(0,0,S,O)},this.setEffects=function(S){if(v===rn){oe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let O=0;O<S.length;O++)if(S[O].isOutputPass===!0){kt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(lt)},this.getViewport=function(S){return S.copy(Ft)},this.setViewport=function(S,O,Y,$){S.isVector4?Ft.set(S.x,S.y,S.z,S.w):Ft.set(S,O,Y,$),y.viewport(lt.copy(Ft).multiplyScalar(st).round())},this.getScissor=function(S){return S.copy(we)},this.setScissor=function(S,O,Y,$){S.isVector4?we.set(S.x,S.y,S.z,S.w):we.set(S,O,Y,$),y.scissor(ft.copy(we).multiplyScalar(st).round())},this.getScissorTest=function(){return ee},this.setScissorTest=function(S){y.setScissorTest(ee=S)},this.setOpaqueSort=function(S){Ot=S},this.setTransparentSort=function(S){Wt=S},this.getClearColor=function(S){return S.copy(Yt.getClearColor())},this.setClearColor=function(){Yt.setClearColor(...arguments)},this.getClearAlpha=function(){return Yt.getClearAlpha()},this.setClearAlpha=function(){Yt.setClearAlpha(...arguments)},this.clear=function(S=!0,O=!0,Y=!0){let $=0;if(S){let X=!1;if(q!==null){const yt=q.texture.format;X=m.has(yt)}if(X){const yt=q.texture.type,St=g.has(yt),_t=Yt.getClearColor(),Tt=Yt.getClearAlpha(),Pt=_t.r,qt=_t.g,Qt=_t.b;St?(x[0]=Pt,x[1]=qt,x[2]=Qt,x[3]=Tt,I.clearBufferuiv(I.COLOR,0,x)):(w[0]=Pt,w[1]=qt,w[2]=Qt,w[3]=Tt,I.clearBufferiv(I.COLOR,0,w))}else $|=I.COLOR_BUFFER_BIT}O&&($|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&($|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),$!==0&&I.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),U=S},this.dispose=function(){e.removeEventListener("webglcontextlost",Te,!1),e.removeEventListener("webglcontextrestored",ye,!1),e.removeEventListener("webglcontextcreationerror",Hn,!1),Yt.dispose(),vt.dispose(),mt.dispose(),H.dispose(),rt.dispose(),tt.dispose(),Mt.dispose(),it.dispose(),pt.dispose(),wt.dispose(),wt.removeEventListener("sessionstart",$d),wt.removeEventListener("sessionend",Xd),Qi.stop()};function Te(S){S.preventDefault(),Eh("WebGLRenderer: Context Lost."),D=!0}function ye(){Eh("WebGLRenderer: Context Restored."),D=!1;const S=z.autoReset,O=Bt.enabled,Y=Bt.autoUpdate,$=Bt.needsUpdate,X=Bt.type;Ct(),z.autoReset=S,Bt.enabled=O,Bt.autoUpdate=Y,Bt.needsUpdate=$,Bt.type=X}function Hn(S){oe("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Gn(S){const O=S.target;O.removeEventListener("dispose",Gn),xM(O)}function xM(S){vM(S),H.remove(S)}function vM(S){const O=H.get(S).programs;O!==void 0&&(O.forEach(function(Y){pt.releaseProgram(Y)}),S.isShaderMaterial&&pt.releaseShaderCache(S))}this.renderBufferDirect=function(S,O,Y,$,X,yt){O===null&&(O=Ht);const St=X.isMesh&&X.matrixWorld.determinantAffine()<0,_t=MM(S,O,Y,$,X);y.setMaterial($,St);let Tt=Y.index,Pt=1;if($.wireframe===!0){if(Tt=J.getWireframeAttribute(Y),Tt===void 0)return;Pt=2}const qt=Y.drawRange,Qt=Y.attributes.position;let Dt=qt.start*Pt,me=(qt.start+qt.count)*Pt;yt!==null&&(Dt=Math.max(Dt,yt.start*Pt),me=Math.min(me,(yt.start+yt.count)*Pt)),Tt!==null?(Dt=Math.max(Dt,0),me=Math.min(me,Tt.count)):Qt!=null&&(Dt=Math.max(Dt,0),me=Math.min(me,Qt.count));const Ce=me-Dt;if(Ce<0||Ce===1/0)return;Mt.setup(X,$,_t,Y,Tt);let Ae,xe=ut;if(Tt!==null&&(Ae=ht.get(Tt),xe=Q,xe.setIndex(Ae)),X.isMesh)$.wireframe===!0?(y.setLineWidth($.wireframeLinewidth*At()),xe.setMode(I.LINES)):xe.setMode(I.TRIANGLES);else if(X.isLine){let Ye=$.linewidth;Ye===void 0&&(Ye=1),y.setLineWidth(Ye*At()),X.isLineSegments?xe.setMode(I.LINES):X.isLineLoop?xe.setMode(I.LINE_LOOP):xe.setMode(I.LINE_STRIP)}else X.isPoints?xe.setMode(I.POINTS):X.isSprite&&xe.setMode(I.TRIANGLES);if(X.isBatchedMesh)if(Kt.get("WEBGL_multi_draw"))xe.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const Ye=X._multiDrawStarts,bt=X._multiDrawCounts,cn=X._multiDrawCount,le=Tt?ht.get(Tt).bytesPerElement:1,xn=H.get($).currentProgram.getUniforms();for(let Vn=0;Vn<cn;Vn++)xn.setValue(I,"_gl_DrawID",Vn),xe.render(Ye[Vn]/le,bt[Vn])}else if(X.isInstancedMesh)xe.renderInstances(Dt,Ce,X.count);else if(Y.isInstancedBufferGeometry){const Ye=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,bt=Math.min(Y.instanceCount,Ye);xe.renderInstances(Dt,Ce,bt)}else xe.render(Dt,Ce)};function Wd(S,O,Y){S.transparent===!0&&S.side===Xn&&S.forceSinglePass===!1?(S.side=Ke,S.needsUpdate=!0,Fo(S,O,Y),S.side=pi,S.needsUpdate=!0,Fo(S,O,Y),S.side=Xn):Fo(S,O,Y)}this.compile=function(S,O,Y=null){Y===null&&(Y=S),b=mt.get(Y),b.init(O),_.push(b),Y.traverseVisible(function(X){X.isLight&&X.layers.test(O.layers)&&(b.pushLight(X),X.castShadow&&b.pushShadow(X))}),S!==Y&&S.traverseVisible(function(X){X.isLight&&X.layers.test(O.layers)&&(b.pushLight(X),X.castShadow&&b.pushShadow(X))}),b.setupLights();const $=new Set;return S.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const yt=X.material;if(yt)if(Array.isArray(yt))for(let St=0;St<yt.length;St++){const _t=yt[St];Wd(_t,Y,X),$.add(_t)}else Wd(yt,Y,X),$.add(yt)}),b=_.pop(),$},this.compileAsync=function(S,O,Y=null){const $=this.compile(S,O,Y);return new Promise(X=>{function yt(){if($.forEach(function(St){H.get(St).currentProgram.isReady()&&$.delete(St)}),$.size===0){X(S);return}setTimeout(yt,10)}Kt.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let Cc=null;function _M(S){Cc&&Cc(S)}function $d(){Qi.stop()}function Xd(){Qi.start()}const Qi=new yu;Qi.setAnimationLoop(_M),typeof self<"u"&&Qi.setContext(self),this.setAnimationLoop=function(S){Cc=S,wt.setAnimationLoop(S),S===null?Qi.stop():Qi.start()},wt.addEventListener("sessionstart",$d),wt.addEventListener("sessionend",Xd),this.render=function(S,O){if(O!==void 0&&O.isCamera!==!0){oe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;U!==null&&U.renderStart(S,O);const Y=wt.enabled===!0&&wt.isPresenting===!0,$=T!==null&&(q===null||Y)&&T.begin(L,q);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),wt.enabled===!0&&wt.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(wt.cameraAutoUpdate===!0&&wt.updateCamera(O),O=wt.getCamera()),S.isScene===!0&&S.onBeforeRender(L,S,O,q),b=mt.get(S,_.length),b.init(O),b.state.textureUnits=Z.getTextureUnits(),_.push(b),F.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),de.setFromProjectionMatrix(F,Un,O.reversedDepth),se=this.localClippingEnabled,ae=Nt.init(this.clippingPlanes,se),E=vt.get(S,R.length),E.init(),R.push(E),wt.enabled===!0&&wt.isPresenting===!0){const St=L.xr.getDepthSensingMesh();St!==null&&Rc(St,O,-1/0,L.sortObjects)}Rc(S,O,0,L.sortObjects),E.finish(),L.sortObjects===!0&&E.sort(Ot,Wt,O.reversedDepth),It=wt.enabled===!1||wt.isPresenting===!1||wt.hasDepthSensing()===!1,It&&Yt.addToRenderList(E,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ae===!0&&Nt.beginShadows();const X=b.state.shadowsArray;if(Bt.render(X,S,O),ae===!0&&Nt.endShadows(),($&&T.hasRenderPass())===!1){const St=E.opaque,_t=E.transmissive;if(b.setupLights(),O.isArrayCamera){const Tt=O.cameras;if(_t.length>0)for(let Pt=0,qt=Tt.length;Pt<qt;Pt++){const Qt=Tt[Pt];qd(St,_t,S,Qt)}It&&Yt.render(S);for(let Pt=0,qt=Tt.length;Pt<qt;Pt++){const Qt=Tt[Pt];Yd(E,S,Qt,Qt.viewport)}}else _t.length>0&&qd(St,_t,S,O),It&&Yt.render(S),Yd(E,S,O)}q!==null&&B===0&&(Z.updateMultisampleRenderTarget(q),Z.updateRenderTargetMipmap(q)),$&&T.end(L),S.isScene===!0&&S.onAfterRender(L,S,O),Mt.resetDefaultState(),et=-1,ot=null,_.pop(),_.length>0?(b=_[_.length-1],Z.setTextureUnits(b.state.textureUnits),ae===!0&&Nt.setGlobalState(L.clippingPlanes,b.state.camera)):b=null,R.pop(),R.length>0?E=R[R.length-1]:E=null,U!==null&&U.renderEnd()};function Rc(S,O,Y,$){if(S.visible===!1)return;if(S.layers.test(O.layers)){if(S.isGroup)Y=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(O);else if(S.isLightProbeGrid)b.pushLightProbeGrid(S);else if(S.isLight)b.pushLight(S),S.castShadow&&b.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||de.intersectsSprite(S)){$&&Et.setFromMatrixPosition(S.matrixWorld).applyMatrix4(F);const St=tt.update(S),_t=S.material;_t.visible&&E.push(S,St,_t,Y,Et.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||de.intersectsObject(S))){const St=tt.update(S),_t=S.material;if($&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Et.copy(S.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),Et.copy(St.boundingSphere.center)),Et.applyMatrix4(S.matrixWorld).applyMatrix4(F)),Array.isArray(_t)){const Tt=St.groups;for(let Pt=0,qt=Tt.length;Pt<qt;Pt++){const Qt=Tt[Pt],Dt=_t[Qt.materialIndex];Dt&&Dt.visible&&E.push(S,St,Dt,Y,Et.z,Qt)}}else _t.visible&&E.push(S,St,_t,Y,Et.z,null)}}const yt=S.children;for(let St=0,_t=yt.length;St<_t;St++)Rc(yt[St],O,Y,$)}function Yd(S,O,Y,$){const{opaque:X,transmissive:yt,transparent:St}=S;b.setupLightsView(Y),ae===!0&&Nt.setGlobalState(L.clippingPlanes,Y),$&&y.viewport(lt.copy($)),X.length>0&&ko(X,O,Y),yt.length>0&&ko(yt,O,Y),St.length>0&&ko(St,O,Y),y.buffers.depth.setTest(!0),y.buffers.depth.setMask(!0),y.buffers.color.setMask(!0),y.setPolygonOffset(!1)}function qd(S,O,Y,$){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[$.id]===void 0){const Dt=Kt.has("EXT_color_buffer_half_float")||Kt.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[$.id]=new je(1,1,{generateMipmaps:!0,type:Dt?on:rn,minFilter:Hi,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:re.workingColorSpace})}const yt=b.state.transmissionRenderTarget[$.id],St=$.viewport||lt;yt.setSize(St.z*L.transmissionResolutionScale,St.w*L.transmissionResolutionScale);const _t=L.getRenderTarget(),Tt=L.getActiveCubeFace(),Pt=L.getActiveMipmapLevel();L.setRenderTarget(yt),L.getClearColor(ge),ne=L.getClearAlpha(),ne<1&&L.setClearColor(16777215,.5),L.clear(),It&&Yt.render(Y);const qt=L.toneMapping;L.toneMapping=Dn;const Qt=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),b.setupLightsView($),ae===!0&&Nt.setGlobalState(L.clippingPlanes,$),ko(S,Y,$),Z.updateMultisampleRenderTarget(yt),Z.updateRenderTargetMipmap(yt),Kt.has("WEBGL_multisampled_render_to_texture")===!1){let Dt=!1;for(let me=0,Ce=O.length;me<Ce;me++){const Ae=O[me],{object:xe,geometry:Ye,material:bt,group:cn}=Ae;if(bt.side===Xn&&xe.layers.test($.layers)){const le=bt.side;bt.side=Ke,bt.needsUpdate=!0,Kd(xe,Y,$,Ye,bt,cn),bt.side=le,bt.needsUpdate=!0,Dt=!0}}Dt===!0&&(Z.updateMultisampleRenderTarget(yt),Z.updateRenderTargetMipmap(yt))}L.setRenderTarget(_t,Tt,Pt),L.setClearColor(ge,ne),Qt!==void 0&&($.viewport=Qt),L.toneMapping=qt}function ko(S,O,Y){const $=O.isScene===!0?O.overrideMaterial:null;for(let X=0,yt=S.length;X<yt;X++){const St=S[X],{object:_t,geometry:Tt,group:Pt}=St;let qt=St.material;qt.allowOverride===!0&&$!==null&&(qt=$),_t.layers.test(Y.layers)&&Kd(_t,O,Y,Tt,qt,Pt)}}function Kd(S,O,Y,$,X,yt){S.onBeforeRender(L,O,Y,$,X,yt),S.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),X.onBeforeRender(L,O,Y,$,S,yt),X.transparent===!0&&X.side===Xn&&X.forceSinglePass===!1?(X.side=Ke,X.needsUpdate=!0,L.renderBufferDirect(Y,O,$,X,S,yt),X.side=pi,X.needsUpdate=!0,L.renderBufferDirect(Y,O,$,X,S,yt),X.side=Xn):L.renderBufferDirect(Y,O,$,X,S,yt),S.onAfterRender(L,O,Y,$,X,yt)}function Fo(S,O,Y){O.isScene!==!0&&(O=Ht);const $=H.get(S),X=b.state.lights,yt=b.state.shadowsArray,St=X.state.version,_t=pt.getParameters(S,X.state,yt,O,Y,b.state.lightProbeGridArray),Tt=pt.getProgramCacheKey(_t);let Pt=$.programs;$.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?O.environment:null,$.fog=O.fog;const qt=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;$.envMap=rt.get(S.envMap||$.environment,qt),$.envMapRotation=$.environment!==null&&S.envMap===null?O.environmentRotation:S.envMapRotation,Pt===void 0&&(S.addEventListener("dispose",Gn),Pt=new Map,$.programs=Pt);let Qt=Pt.get(Tt);if(Qt!==void 0){if($.currentProgram===Qt&&$.lightsStateVersion===St)return Jd(S,_t),Qt}else _t.uniforms=pt.getUniforms(S),U!==null&&S.isNodeMaterial&&U.build(S,Y,_t),S.onBeforeCompile(_t,L),Qt=pt.acquireProgram(_t,Tt),Pt.set(Tt,Qt),$.uniforms=_t.uniforms;const Dt=$.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Dt.clippingPlanes=Nt.uniform),Jd(S,_t),$.needsLights=SM(S),$.lightsStateVersion=St,$.needsLights&&(Dt.ambientLightColor.value=X.state.ambient,Dt.lightProbe.value=X.state.probe,Dt.directionalLights.value=X.state.directional,Dt.directionalLightShadows.value=X.state.directionalShadow,Dt.spotLights.value=X.state.spot,Dt.spotLightShadows.value=X.state.spotShadow,Dt.rectAreaLights.value=X.state.rectArea,Dt.ltc_1.value=X.state.rectAreaLTC1,Dt.ltc_2.value=X.state.rectAreaLTC2,Dt.pointLights.value=X.state.point,Dt.pointLightShadows.value=X.state.pointShadow,Dt.hemisphereLights.value=X.state.hemi,Dt.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Dt.spotLightMatrix.value=X.state.spotLightMatrix,Dt.spotLightMap.value=X.state.spotLightMap,Dt.pointShadowMatrix.value=X.state.pointShadowMatrix),$.lightProbeGrid=b.state.lightProbeGridArray.length>0,$.currentProgram=Qt,$.uniformsList=null,Qt}function Zd(S){if(S.uniformsList===null){const O=S.currentProgram.getUniforms();S.uniformsList=Eo.seqWithValue(O.seq,S.uniforms)}return S.uniformsList}function Jd(S,O){const Y=H.get(S);Y.outputColorSpace=O.outputColorSpace,Y.batching=O.batching,Y.batchingColor=O.batchingColor,Y.instancing=O.instancing,Y.instancingColor=O.instancingColor,Y.instancingMorph=O.instancingMorph,Y.skinning=O.skinning,Y.morphTargets=O.morphTargets,Y.morphNormals=O.morphNormals,Y.morphColors=O.morphColors,Y.morphTargetsCount=O.morphTargetsCount,Y.numClippingPlanes=O.numClippingPlanes,Y.numIntersection=O.numClipIntersection,Y.vertexAlphas=O.vertexAlphas,Y.vertexTangents=O.vertexTangents,Y.toneMapping=O.toneMapping}function yM(S,O){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;M.setFromMatrixPosition(O.matrixWorld);for(let Y=0,$=S.length;Y<$;Y++){const X=S[Y];if(X.texture!==null&&X.boundingBox.containsPoint(M))return X}return null}function MM(S,O,Y,$,X){O.isScene!==!0&&(O=Ht),Z.resetTextureUnits();const yt=O.fog,St=$.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial?O.environment:null,_t=q===null?L.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:re.workingColorSpace,Tt=$.isMeshStandardMaterial||$.isMeshLambertMaterial&&!$.envMap||$.isMeshPhongMaterial&&!$.envMap,Pt=rt.get($.envMap||St,Tt),qt=$.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,Qt=!!Y.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Dt=!!Y.morphAttributes.position,me=!!Y.morphAttributes.normal,Ce=!!Y.morphAttributes.color;let Ae=Dn;$.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(Ae=L.toneMapping);const xe=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Ye=xe!==void 0?xe.length:0,bt=H.get($),cn=b.state.lights;if(ae===!0&&(se===!0||S!==ot)){const Me=S===ot&&$.id===et;Nt.setState($,S,Me)}let le=!1;$.version===bt.__version?(bt.needsLights&&bt.lightsStateVersion!==cn.state.version||bt.outputColorSpace!==_t||X.isBatchedMesh&&bt.batching===!1||!X.isBatchedMesh&&bt.batching===!0||X.isBatchedMesh&&bt.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&bt.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&bt.instancing===!1||!X.isInstancedMesh&&bt.instancing===!0||X.isSkinnedMesh&&bt.skinning===!1||!X.isSkinnedMesh&&bt.skinning===!0||X.isInstancedMesh&&bt.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&bt.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&bt.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&bt.instancingMorph===!1&&X.morphTexture!==null||bt.envMap!==Pt||$.fog===!0&&bt.fog!==yt||bt.numClippingPlanes!==void 0&&(bt.numClippingPlanes!==Nt.numPlanes||bt.numIntersection!==Nt.numIntersection)||bt.vertexAlphas!==qt||bt.vertexTangents!==Qt||bt.morphTargets!==Dt||bt.morphNormals!==me||bt.morphColors!==Ce||bt.toneMapping!==Ae||bt.morphTargetsCount!==Ye||!!bt.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(le=!0):(le=!0,bt.__version=$.version);let xn=bt.currentProgram;le===!0&&(xn=Fo($,O,X),U&&$.isNodeMaterial&&U.onUpdateProgram($,xn,bt));let Vn=!1,Ri=!1,$s=!1;const ve=xn.getUniforms(),Re=bt.uniforms;if(y.useProgram(xn.program)&&(Vn=!0,Ri=!0,$s=!0),$.id!==et&&(et=$.id,Ri=!0),bt.needsLights){const Me=yM(b.state.lightProbeGridArray,X);bt.lightProbeGrid!==Me&&(bt.lightProbeGrid=Me,Ri=!0)}if(Vn||ot!==S){y.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),ve.setValue(I,"projectionMatrix",S.projectionMatrix),ve.setValue(I,"viewMatrix",S.matrixWorldInverse);const Li=ve.map.cameraPosition;Li!==void 0&&Li.setValue(I,nt.setFromMatrixPosition(S.matrixWorld)),C.logarithmicDepthBuffer&&ve.setValue(I,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&ve.setValue(I,"isOrthographic",S.isOrthographicCamera===!0),ot!==S&&(ot=S,Ri=!0,$s=!0)}if(bt.needsLights&&(cn.state.directionalShadowMap.length>0&&ve.setValue(I,"directionalShadowMap",cn.state.directionalShadowMap,Z),cn.state.spotShadowMap.length>0&&ve.setValue(I,"spotShadowMap",cn.state.spotShadowMap,Z),cn.state.pointShadowMap.length>0&&ve.setValue(I,"pointShadowMap",cn.state.pointShadowMap,Z)),X.isSkinnedMesh){ve.setOptional(I,X,"bindMatrix"),ve.setOptional(I,X,"bindMatrixInverse");const Me=X.skeleton;Me&&(Me.boneTexture===null&&Me.computeBoneTexture(),ve.setValue(I,"boneTexture",Me.boneTexture,Z))}X.isBatchedMesh&&(ve.setOptional(I,X,"batchingTexture"),ve.setValue(I,"batchingTexture",X._matricesTexture,Z),ve.setOptional(I,X,"batchingIdTexture"),ve.setValue(I,"batchingIdTexture",X._indirectTexture,Z),ve.setOptional(I,X,"batchingColorTexture"),X._colorsTexture!==null&&ve.setValue(I,"batchingColorTexture",X._colorsTexture,Z));const Pi=Y.morphAttributes;if((Pi.position!==void 0||Pi.normal!==void 0||Pi.color!==void 0)&&k.update(X,Y,xn),(Ri||bt.receiveShadow!==X.receiveShadow)&&(bt.receiveShadow=X.receiveShadow,ve.setValue(I,"receiveShadow",X.receiveShadow)),($.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial)&&$.envMap===null&&O.environment!==null&&(Re.envMapIntensity.value=O.environmentIntensity),Re.dfgLUT!==void 0&&(Re.dfgLUT.value=C_()),Ri){if(ve.setValue(I,"toneMappingExposure",L.toneMappingExposure),bt.needsLights&&bM(Re,$s),yt&&$.fog===!0&&Rt.refreshFogUniforms(Re,yt),Rt.refreshMaterialUniforms(Re,$,st,ct,b.state.transmissionRenderTarget[S.id]),bt.needsLights&&bt.lightProbeGrid){const Me=bt.lightProbeGrid;Re.probesSH.value=Me.texture,Re.probesMin.value.copy(Me.boundingBox.min),Re.probesMax.value.copy(Me.boundingBox.max),Re.probesResolution.value.copy(Me.resolution)}Eo.upload(I,Zd(bt),Re,Z)}if($.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(Eo.upload(I,Zd(bt),Re,Z),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&ve.setValue(I,"center",X.center),ve.setValue(I,"modelViewMatrix",X.modelViewMatrix),ve.setValue(I,"normalMatrix",X.normalMatrix),ve.setValue(I,"modelMatrix",X.matrixWorld),$.uniformsGroups!==void 0){const Me=$.uniformsGroups;for(let Li=0,Xs=Me.length;Li<Xs;Li++){const jd=Me[Li];it.update(jd,xn),it.bind(jd,xn)}}return xn}function bM(S,O){S.ambientLightColor.needsUpdate=O,S.lightProbe.needsUpdate=O,S.directionalLights.needsUpdate=O,S.directionalLightShadows.needsUpdate=O,S.pointLights.needsUpdate=O,S.pointLightShadows.needsUpdate=O,S.spotLights.needsUpdate=O,S.spotLightShadows.needsUpdate=O,S.rectAreaLights.needsUpdate=O,S.hemisphereLights.needsUpdate=O}function SM(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return q},this.setRenderTargetTextures=function(S,O,Y){const $=H.get(S);$.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,$.__autoAllocateDepthBuffer===!1&&($.__useRenderToTexture=!1),H.get(S.texture).__webglTexture=O,H.get(S.depthTexture).__webglTexture=$.__autoAllocateDepthBuffer?void 0:Y,$.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,O){const Y=H.get(S);Y.__webglFramebuffer=O,Y.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(S,O=0,Y=0){q=S,W=O,B=Y;let $=null,X=!1,yt=!1;if(S){const _t=H.get(S);if(_t.__useDefaultFramebuffer!==void 0){y.bindFramebuffer(I.FRAMEBUFFER,_t.__webglFramebuffer),lt.copy(S.viewport),ft.copy(S.scissor),$t=S.scissorTest,y.viewport(lt),y.scissor(ft),y.setScissorTest($t),et=-1;return}else if(_t.__webglFramebuffer===void 0)Z.setupRenderTarget(S);else if(_t.__hasExternalTextures)Z.rebindTextures(S,H.get(S.texture).__webglTexture,H.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const qt=S.depthTexture;if(_t.__boundDepthTexture!==qt){if(qt!==null&&H.has(qt)&&(S.width!==qt.image.width||S.height!==qt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(S)}}const Tt=S.texture;(Tt.isData3DTexture||Tt.isDataArrayTexture||Tt.isCompressedArrayTexture)&&(yt=!0);const Pt=H.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Pt[O])?$=Pt[O][Y]:$=Pt[O],X=!0):S.samples>0&&Z.useMultisampledRTT(S)===!1?$=H.get(S).__webglMultisampledFramebuffer:Array.isArray(Pt)?$=Pt[Y]:$=Pt,lt.copy(S.viewport),ft.copy(S.scissor),$t=S.scissorTest}else lt.copy(Ft).multiplyScalar(st).floor(),ft.copy(we).multiplyScalar(st).floor(),$t=ee;if(Y!==0&&($=G),y.bindFramebuffer(I.FRAMEBUFFER,$)&&y.drawBuffers(S,$),y.viewport(lt),y.scissor(ft),y.setScissorTest($t),X){const _t=H.get(S.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+O,_t.__webglTexture,Y)}else if(yt){const _t=O;for(let Tt=0;Tt<S.textures.length;Tt++){const Pt=H.get(S.textures[Tt]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Tt,Pt.__webglTexture,Y,_t)}}else if(S!==null&&Y!==0){const _t=H.get(S.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,_t.__webglTexture,Y)}et=-1},this.readRenderTargetPixels=function(S,O,Y,$,X,yt,St,_t=0){if(!(S&&S.isWebGLRenderTarget)){oe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=H.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&St!==void 0&&(Tt=Tt[St]),Tt){y.bindFramebuffer(I.FRAMEBUFFER,Tt);try{const Pt=S.textures[_t],qt=Pt.format,Qt=Pt.type;if(S.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+_t),!C.textureFormatReadable(qt)){oe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!C.textureTypeReadable(Qt)){oe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=S.width-$&&Y>=0&&Y<=S.height-X&&I.readPixels(O,Y,$,X,gt.convert(qt),gt.convert(Qt),yt)}finally{const Pt=q!==null?H.get(q).__webglFramebuffer:null;y.bindFramebuffer(I.FRAMEBUFFER,Pt)}}},this.readRenderTargetPixelsAsync=async function(S,O,Y,$,X,yt,St,_t=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=H.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&St!==void 0&&(Tt=Tt[St]),Tt)if(O>=0&&O<=S.width-$&&Y>=0&&Y<=S.height-X){y.bindFramebuffer(I.FRAMEBUFFER,Tt);const Pt=S.textures[_t],qt=Pt.format,Qt=Pt.type;if(S.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+_t),!C.textureFormatReadable(qt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!C.textureTypeReadable(Qt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Dt=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Dt),I.bufferData(I.PIXEL_PACK_BUFFER,yt.byteLength,I.STREAM_READ),I.readPixels(O,Y,$,X,gt.convert(qt),gt.convert(Qt),0);const me=q!==null?H.get(q).__webglFramebuffer:null;y.bindFramebuffer(I.FRAMEBUFFER,me);const Ce=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Wp(I,Ce,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Dt),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,yt),I.deleteBuffer(Dt),I.deleteSync(Ce),yt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,O=null,Y=0){const $=Math.pow(2,-Y),X=Math.floor(S.image.width*$),yt=Math.floor(S.image.height*$),St=O!==null?O.x:0,_t=O!==null?O.y:0;Z.setTexture2D(S,0),I.copyTexSubImage2D(I.TEXTURE_2D,Y,0,0,St,_t,X,yt),y.unbindTexture()},this.copyTextureToTexture=function(S,O,Y=null,$=null,X=0,yt=0){let St,_t,Tt,Pt,qt,Qt,Dt,me,Ce;const Ae=S.isCompressedTexture?S.mipmaps[yt]:S.image;if(Y!==null)St=Y.max.x-Y.min.x,_t=Y.max.y-Y.min.y,Tt=Y.isBox3?Y.max.z-Y.min.z:1,Pt=Y.min.x,qt=Y.min.y,Qt=Y.isBox3?Y.min.z:0;else{const Re=Math.pow(2,-X);St=Math.floor(Ae.width*Re),_t=Math.floor(Ae.height*Re),S.isDataArrayTexture?Tt=Ae.depth:S.isData3DTexture?Tt=Math.floor(Ae.depth*Re):Tt=1,Pt=0,qt=0,Qt=0}$!==null?(Dt=$.x,me=$.y,Ce=$.z):(Dt=0,me=0,Ce=0);const xe=gt.convert(O.format),Ye=gt.convert(O.type);let bt;O.isData3DTexture?(Z.setTexture3D(O,0),bt=I.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(Z.setTexture2DArray(O,0),bt=I.TEXTURE_2D_ARRAY):(Z.setTexture2D(O,0),bt=I.TEXTURE_2D),y.activeTexture(I.TEXTURE0),y.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,O.flipY),y.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),y.pixelStorei(I.UNPACK_ALIGNMENT,O.unpackAlignment);const cn=y.getParameter(I.UNPACK_ROW_LENGTH),le=y.getParameter(I.UNPACK_IMAGE_HEIGHT),xn=y.getParameter(I.UNPACK_SKIP_PIXELS),Vn=y.getParameter(I.UNPACK_SKIP_ROWS),Ri=y.getParameter(I.UNPACK_SKIP_IMAGES);y.pixelStorei(I.UNPACK_ROW_LENGTH,Ae.width),y.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Ae.height),y.pixelStorei(I.UNPACK_SKIP_PIXELS,Pt),y.pixelStorei(I.UNPACK_SKIP_ROWS,qt),y.pixelStorei(I.UNPACK_SKIP_IMAGES,Qt);const $s=S.isDataArrayTexture||S.isData3DTexture,ve=O.isDataArrayTexture||O.isData3DTexture;if(S.isDepthTexture){const Re=H.get(S),Pi=H.get(O),Me=H.get(Re.__renderTarget),Li=H.get(Pi.__renderTarget);y.bindFramebuffer(I.READ_FRAMEBUFFER,Me.__webglFramebuffer),y.bindFramebuffer(I.DRAW_FRAMEBUFFER,Li.__webglFramebuffer);for(let Xs=0;Xs<Tt;Xs++)$s&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,H.get(S).__webglTexture,X,Qt+Xs),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,H.get(O).__webglTexture,yt,Ce+Xs)),I.blitFramebuffer(Pt,qt,St,_t,Dt,me,St,_t,I.DEPTH_BUFFER_BIT,I.NEAREST);y.bindFramebuffer(I.READ_FRAMEBUFFER,null),y.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(X!==0||S.isRenderTargetTexture||H.has(S)){const Re=H.get(S),Pi=H.get(O);y.bindFramebuffer(I.READ_FRAMEBUFFER,K),y.bindFramebuffer(I.DRAW_FRAMEBUFFER,N);for(let Me=0;Me<Tt;Me++)$s?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Re.__webglTexture,X,Qt+Me):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Re.__webglTexture,X),ve?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Pi.__webglTexture,yt,Ce+Me):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Pi.__webglTexture,yt),X!==0?I.blitFramebuffer(Pt,qt,St,_t,Dt,me,St,_t,I.COLOR_BUFFER_BIT,I.NEAREST):ve?I.copyTexSubImage3D(bt,yt,Dt,me,Ce+Me,Pt,qt,St,_t):I.copyTexSubImage2D(bt,yt,Dt,me,Pt,qt,St,_t);y.bindFramebuffer(I.READ_FRAMEBUFFER,null),y.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else ve?S.isDataTexture||S.isData3DTexture?I.texSubImage3D(bt,yt,Dt,me,Ce,St,_t,Tt,xe,Ye,Ae.data):O.isCompressedArrayTexture?I.compressedTexSubImage3D(bt,yt,Dt,me,Ce,St,_t,Tt,xe,Ae.data):I.texSubImage3D(bt,yt,Dt,me,Ce,St,_t,Tt,xe,Ye,Ae):S.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,yt,Dt,me,St,_t,xe,Ye,Ae.data):S.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,yt,Dt,me,Ae.width,Ae.height,xe,Ae.data):I.texSubImage2D(I.TEXTURE_2D,yt,Dt,me,St,_t,xe,Ye,Ae);y.pixelStorei(I.UNPACK_ROW_LENGTH,cn),y.pixelStorei(I.UNPACK_IMAGE_HEIGHT,le),y.pixelStorei(I.UNPACK_SKIP_PIXELS,xn),y.pixelStorei(I.UNPACK_SKIP_ROWS,Vn),y.pixelStorei(I.UNPACK_SKIP_IMAGES,Ri),yt===0&&O.generateMipmaps&&I.generateMipmap(bt),y.unbindTexture()},this.initRenderTarget=function(S){H.get(S).__webglFramebuffer===void 0&&Z.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Z.setTextureCube(S,0):S.isData3DTexture?Z.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Z.setTexture2DArray(S,0):Z.setTexture2D(S,0),y.unbindTexture()},this.resetState=function(){W=0,B=0,q=null,y.reset(),Mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=re._getDrawingBufferColorSpace(t),e.unpackColorSpace=re._getUnpackColorSpace()}}const Ju={type:"change"},Ql={type:"start"},ju={type:"end"},Ao=new to,Qu=new bi,P_=Math.cos(70*Wr.DEG2RAD),Ne=new P,en=2*Math.PI,pe={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},tc=1e-6;class L_ extends f0{constructor(t,e=null){super(t,e),this.state=pe.NONE,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:cs.ROTATE,MIDDLE:cs.DOLLY,RIGHT:cs.PAN},this.touches={ONE:hs.ROTATE,TWO:hs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new P,this._lastQuaternion=new Nn,this._lastTargetPosition=new P,this._quat=new Nn().setFromUnitVectors(t.up,new P(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Wl,this._sphericalDelta=new Wl,this._scale=1,this._panOffset=new P,this._rotateStart=new dt,this._rotateEnd=new dt,this._rotateDelta=new dt,this._panStart=new dt,this._panEnd=new dt,this._panDelta=new dt,this._dollyStart=new dt,this._dollyEnd=new dt,this._dollyDelta=new dt,this._dollyDirection=new P,this._mouse=new dt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=I_.bind(this),this._onPointerDown=D_.bind(this),this._onPointerUp=U_.bind(this),this._onContextMenu=H_.bind(this),this._onMouseWheel=F_.bind(this),this._onKeyDown=O_.bind(this),this._onTouchStart=B_.bind(this),this._onTouchMove=z_.bind(this),this._onMouseDown=N_.bind(this),this._onMouseMove=k_.bind(this),this._interceptControlDown=G_.bind(this),this._interceptControlUp=V_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Ju),this.update(),this.state=pe.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){const e=this.object.position;Ne.copy(e).sub(this.target),Ne.applyQuaternion(this._quat),this._spherical.setFromVector3(Ne),this.autoRotate&&this.state===pe.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=en:n>Math.PI&&(n-=en),i<-Math.PI?i+=en:i>Math.PI&&(i-=en),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Ne.setFromSpherical(this._spherical),Ne.applyQuaternion(this._quatInverse),e.copy(this.target).add(Ne),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=Ne.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new P(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new P(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Ne.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Ao.origin.copy(this.object.position),Ao.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ao.direction))<P_?this.object.lookAt(this.target):(Qu.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ao.intersectPlane(Qu,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>tc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>tc||this._lastTargetPosition.distanceToSquared(this.target)>tc?(this.dispatchEvent(Ju),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?en/60*this.autoRotateSpeed*t:en/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Ne.setFromMatrixColumn(e,0),Ne.multiplyScalar(-t),this._panOffset.add(Ne)}_panUp(t,e){this.screenSpacePanning===!0?Ne.setFromMatrixColumn(e,1):(Ne.setFromMatrixColumn(e,0),Ne.crossVectors(this.object.up,Ne)),Ne.multiplyScalar(t),this._panOffset.add(Ne)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const i=this.object.position;Ne.copy(i).sub(this.target);let r=Ne.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),i=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=i/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(en*this._rotateDelta.x/e.clientHeight),this._rotateUp(en*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(en*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-en*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(en*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-en*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panStart.set(n,i)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(i,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(en*this._rotateDelta.x/e.clientHeight),this._rotateUp(en*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new dt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function D_(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function I_(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function U_(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(ju),this.state=pe.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function N_(s){let t;switch(s.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case cs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=pe.DOLLY;break;case cs.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=pe.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=pe.ROTATE}break;case cs.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=pe.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=pe.PAN}break;default:this.state=pe.NONE}this.state!==pe.NONE&&this.dispatchEvent(Ql)}function k_(s){switch(this.state){case pe.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case pe.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case pe.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function F_(s){this.enabled===!1||this.enableZoom===!1||this.state!==pe.NONE||(s.preventDefault(),this.dispatchEvent(Ql),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(ju))}function O_(s){this.enabled!==!1&&this._handleKeyDown(s)}function B_(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case hs.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=pe.TOUCH_ROTATE;break;case hs.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=pe.TOUCH_PAN;break;default:this.state=pe.NONE}break;case 2:switch(this.touches.TWO){case hs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=pe.TOUCH_DOLLY_PAN;break;case hs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=pe.TOUCH_DOLLY_ROTATE;break;default:this.state=pe.NONE}break;default:this.state=pe.NONE}this.state!==pe.NONE&&this.dispatchEvent(Ql)}function z_(s){switch(this._trackPointer(s),this.state){case pe.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case pe.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case pe.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case pe.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=pe.NONE}}function H_(s){this.enabled!==!1&&s.preventDefault()}function G_(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function V_(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const yr=new P;function gn(s,t,e,n,i,r){const o=2*Math.PI*i/4,a=Math.max(r-2*i,0),l=Math.PI/4;yr.copy(t),yr[n]=0,yr.normalize();const c=.5*o/(o+a),h=1-yr.angleTo(s)/l;return Math.sign(yr[e])===1?h*c:a/(o+a)+c+c*(1-h)}class ri extends Tn{constructor(t=1,e=1,n=1,i=2,r=.1){const o=i*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:i,radius:r},o===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const l=new P,c=new P,h=new P(t,e,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=u.length/6,v=new P,m=.5/o;for(let g=0,x=0;g<u.length;g+=3,x+=2)switch(l.fromArray(u,g),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),u[g+0]=h.x*Math.sign(l.x)+c.x*r,u[g+1]=h.y*Math.sign(l.y)+c.y*r,u[g+2]=h.z*Math.sign(l.z)+c.z*r,d[g+0]=c.x,d[g+1]=c.y,d[g+2]=c.z,Math.floor(g/p)){case 0:v.set(1,0,0),f[x+0]=gn(v,c,"z","y",r,n),f[x+1]=1-gn(v,c,"y","z",r,e);break;case 1:v.set(-1,0,0),f[x+0]=1-gn(v,c,"z","y",r,n),f[x+1]=1-gn(v,c,"y","z",r,e);break;case 2:v.set(0,1,0),f[x+0]=1-gn(v,c,"x","z",r,t),f[x+1]=gn(v,c,"z","x",r,n);break;case 3:v.set(0,-1,0),f[x+0]=1-gn(v,c,"x","z",r,t),f[x+1]=1-gn(v,c,"z","x",r,n);break;case 4:v.set(0,0,1),f[x+0]=1-gn(v,c,"x","y",r,t),f[x+1]=1-gn(v,c,"y","x",r,e);break;case 5:v.set(0,0,-1),f[x+0]=gn(v,c,"x","y",r,t),f[x+1]=1-gn(v,c,"y","x",r,e);break}}static fromJSON(t){return new ri(t.width,t.height,t.depth,t.segments,t.radius)}}const W_=8;function $_(){const s=document.createElement("canvas");s.width=1024,s.height=384;const t=s.getContext("2d"),e=256,n=192;if(t){const r=a=>[a%4*e,Math.floor(a/4)*n],o=(a,l,c,h,u=26)=>{const[d,f]=r(a);t.fillStyle=h,t.fillRect(d,f,e,n),t.fillStyle=c,t.font=`${u}px "Libertinus Mono", ui-monospace, monospace`,t.textAlign="center",l.forEach((p,v)=>t.fillText(p,d+e/2,f+n/2+(v-(l.length-1)/2)*u*1.3+u*.35)),t.textAlign="left"};o(1,["NO SIGNAL"],"#ffffff","#1432c8",30);{const[a,l]=r(2);["#c0c0c0","#c0c000","#00c0c0","#00c000","#c000c0","#c00000","#0000c0"].forEach((c,h)=>{t.fillStyle=c,t.fillRect(a+h*e/7,l,e/7+1,n*.7)}),t.fillStyle="#0b0b0b",t.fillRect(a,l+n*.7,e,n*.3)}o(3,["PRESENT DAY","PRESENT TIME"],"#e8e8e8","#050505",22);{const[a,l]=r(4);t.fillStyle="#000",t.fillRect(a,l,e,n),t.fillStyle="#b8b8b8",t.font="18px ui-monospace, monospace",t.fillText("C:\\>_",a+16,l+34)}o(5,["▶ PLAY"],"#ffffff","#0a1a7a",30),o(6,["æ"],"#f4f1ea","#000000",110),o(7,["CLOSE THE WORLD","OPEN THE nExT"],"#ff4a4a","#070000",18)}const i=new Is(s);return i.colorSpace=ke,i}class X_{constructor(t,e,n){A(this,"group",new jn);A(this,"screens");A(this,"uniforms",{uTime:{value:0},uAtlas:{value:null},uFogColor:{value:new Gt},uFogDensity:{value:0}});this.uniforms.uFogColor.value.copy(n.color),this.uniforms.uFogDensity.value=n.density;const i=new ri(1.26,1.1,.95,2,.05);i.translate(0,.55,-.475);const r=new Kh(i,new Qe({roughness:.6,metalness:.05}),t),o=new mn(1,.75);o.translate(0,.62,.004),this.uniforms.uAtlas.value=$_();const a=new De({uniforms:this.uniforms,vertexShader:`
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
        }`});this.screens=new Kh(o,a,t);const l=new Float32Array(t),c=new Float32Array(t),h=new Float32Array(t),u=[12168852,1513242,7172214,855311,9407100],d=new ce,f=new Nn,p=new Zn,v=new Gt;let m=0;for(;m<t;){const g=e()*Math.PI*2;if(-Math.cos(g)>.3)continue;const x=9+e()*13,w=Math.sin(g)*x,M=-Math.cos(g)*x,E=Math.atan2(-w,-M)+(e()-.5)*.9,b=e()<.14,R=Math.min(t-m,b?1:1+Math.floor(e()*4));let _=b?4+e()*5:0;for(let T=0;T<R;T++,m++){const L=.8+e()*.9,D=!b&&T===0&&e()<.12;p.set(D?-Math.PI/2+.1:(e()-.5)*.12,E+(e()-.5)*.35,D?0:(e()-.5)*.08),f.setFromEuler(p),d.compose(new P(w+(e()-.5)*.3,_,M+(e()-.5)*.3),f,new P(L,L,L)),r.setMatrixAt(m,d),this.screens.setMatrixAt(m,d),r.setColorAt(m,v.setHex(u[Math.floor(e()*u.length)]??3355443)),l[m]=e()<.45?0:1+Math.floor(e()*(W_-1)),c[m]=e(),h[m]=e()<.22?0:.35+e()*.65,_+=1.1*L*(D?.85:1)}}this.screens.geometry.setAttribute("aTile",new ur(l,1)),this.screens.geometry.setAttribute("aSeed",new ur(c,1)),this.screens.geometry.setAttribute("aOn",new ur(h,1)),this.group.add(r,this.screens)}update(t){this.uniforms.uTime.value=t}}const Y_=`
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
`,q_=`
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
`;function K_(s,t){return new De({uniforms:{map:{value:s},uTime:{value:0},uPower:{value:0},uHover:{value:0},uStatic:{value:0},uSeed:{value:t},uGain:{value:1},uTint:{value:new Gt(1,1,1)}},vertexShader:Y_,fragmentShader:q_})}function Z_(s,t,e){const n=new mn(s,t,24,18),i=n.attributes.position;for(let r=0;r<i.count;r++){const o=i.getX(r)/(s/2),a=i.getY(r)/(t/2);i.setZ(r,e*(1-.5*o*o-.5*a*a))}return n.computeVertexNormals(),n}const td={beige:{color:12168852,rough:.62},tv:{color:1513242,rough:.42},grey:{color:7172214,rough:.55},black:{color:855311,rough:.5}},ed=new Map;function J_(s){let t=ed.get(s);return t||(t=new Qe({color:td[s].color,roughness:td[s].rough,metalness:.05}),ed.set(s,t)),t}const j_=new Qe({color:328966,roughness:.35,metalness:.2});function Q_(s){const t=document.createElement("canvas");t.width=256,t.height=56;const e=t.getContext("2d");if(e){e.fillStyle="#d8cfae",e.fillRect(0,0,256,56),e.fillStyle="rgba(120,100,60,0.18)";for(let o=0;o<40;o++)e.fillRect(Math.random()*256,Math.random()*56,2,1);e.globalCompositeOperation="destination-out";for(let o=0;o<56;o+=4)e.fillRect(0,o,Math.random()*5,4),e.fillRect(256-Math.random()*5,o,5,4);e.globalCompositeOperation="source-over"}const n=new Is(t),i=`31px ${$c}`;let r=null;return Pf(i,()=>{e&&(r?e.putImageData(r,0,0):r=e.getImageData(0,0,256,56),e.fillStyle="#16161c",e.font=i,e.textAlign="center",e.textBaseline="middle",e.save(),e.translate(128,31),e.rotate(-.02),e.fillText(s,0,0),e.restore())},()=>n.needsUpdate=!0),n.colorSpace=ke,n.anisotropy=4,n}class nd{constructor(t){A(this,"group",new jn);A(this,"texture");A(this,"crt");A(this,"glass");A(this,"hit");A(this,"height");A(this,"width");A(this,"depth");A(this,"screenH");A(this,"screenLocal");A(this,"portLocal");A(this,"topLocal");A(this,"led");A(this,"ledState","");const e=t.screenW,n=e*.75;this.screenH=n;const i=e*1.26,r=n+e*.34,o=e*.2;this.width=i,this.height=r+(t.stand?e*.08:0);const a=t.stand?e*.08:0,l=J_(t.style),c=new jt(new ri(i,r,o,3,e*.045),l);c.position.set(0,a+r/2,-o/2),this.group.add(c);const h=e*.62,u=new jt(new ri(i*.84,r*.86,h,3,e*.08),l);u.position.set(0,a+r*.52,-o-h/2+e*.04),this.group.add(u);const d=e*.3,f=new jt(new ri(i*.46,r*.46,d,2,e*.05),l);if(f.position.set(0,a+r*.54,-o-h-d/2+e*.1),this.group.add(f),this.depth=o+h+d-e*.14,t.stand){const g=new jt(new Ns(e*.34,e*.4,a,24),l);g.position.set(0,a/2,-o-h*.4),this.group.add(g)}const p=a+r/2+e*.07;this.screenLocal=new P(0,p,.02),this.portLocal=new P(e*.1,a+r*.25,-this.depth+e*.05),this.topLocal=new P(0,a+r,-o-h*.45);const v=new jt(new mn(e*1.05,n*1.05),j_);v.position.set(0,p,.002),this.group.add(v),this.texture=new Is(t.screen),this.texture.colorSpace=ke,this.texture.minFilter=He,this.texture.generateMipmaps=!1,this.crt=K_(this.texture,t.seed),this.glass=new jt(Z_(e,n,e*.035),this.crt),this.glass.position.set(0,p,.004),this.group.add(this.glass);const m=new jt(new mn(e*.4,e*.088),new Qe({map:Q_(t.label),transparent:!0,roughness:.9}));if(m.position.set(-e*.18,a+e*.075,.003),m.rotation.z=t.seed%7*.012-.03,this.group.add(m),this.led=new jt(new go(e*.014,8,6),new ii({color:1714714})),this.led.position.set(i/2-e*.12,a+e*.08,.004),this.group.add(this.led),t.style==="tv"||t.style==="grey"){const g=new Qe({color:2763310,roughness:.4});for(let x=0;x<2;x++){const w=new jt(new Ns(e*.028,e*.028,e*.03,16),g);w.rotation.x=Math.PI/2,w.position.set(i/2-e*.24-x*e*.09,a+e*.08,.012),this.group.add(w)}}this.hit=new jt(new Tn(i,r,this.depth),new ii({visible:!1})),this.hit.position.set(0,a+r/2,-this.depth/2),this.group.add(this.hit)}setLed(t,e){const n=t?e:"#1a2a1a";n!==this.ledState&&(this.ledState=n,this.led.material.color.set(n))}world(t){return this.group.updateMatrixWorld(!0),t.clone().applyMatrix4(this.group.matrixWorld)}normal(){const t=new Nn;return this.group.getWorldQuaternion(t),new P(0,0,1).applyQuaternion(t)}}const Co={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Mr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ty=new Mo(-1,1,1,-1,0,1);class ey extends Ge{constructor(){super(),this.setAttribute("position",new fe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new fe([0,2,0,0,2,0],2))}}const ny=new ey;class id{constructor(t){this._mesh=new jt(ny,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,ty)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class sd extends Mr{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof De?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=xo.clone(t.uniforms),this.material=new De({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new id(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class rd extends Mr{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class iy extends Mr{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class sy{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new dt);this._width=n.width,this._height=n.height,e=new je(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:on}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new sd(Co),this.copyPass.material.blending=Ln,this.timer=new c0}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}rd!==void 0&&(o instanceof rd?n=!0:o instanceof iy&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new dt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class ry extends Mr{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Gt}render(t,e,n){const i=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=i}}const oy={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Gt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Hs extends Mr{constructor(t,e=1,n,i){super(),this.strength=e,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new dt(t.x,t.y):new dt(256,256),this.clearColor=new Gt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new je(r,o,{type:on}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const u=new je(r,o,{type:on});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const d=new je(r,o,{type:on});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}const a=oy;this.highPassUniforms=xo.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new De({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new dt(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=xo.clone(Co.uniforms),this.blendMaterial=new De({uniforms:this.copyUniforms,vertexShader:Co.vertexShader,fragmentShader:Co.fragmentShader,premultipliedAlpha:!0,blending:Dr,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Gt,this._oldClearAlpha=1,this._basic=new ii,this._fsQuad=new id(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new dt(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=Hs.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Hs.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(t){const e=[],n=t/3;for(let i=0;i<t;i++)e.push(.39894*Math.exp(-.5*i*i/(n*n))/n);return new De({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new dt(.5,.5)},direction:{value:new dt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`

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

				}`})}_getCompositeMaterial(t){return new De({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}}Hs.BlurDirectionX=new dt(1,0),Hs.BlurDirectionY=new dt(0,1);const ay={uniforms:{tDiffuse:{value:null},uRes:{value:new dt(1,1)},uTime:{value:0},uTear:{value:0},uDot:{value:3},uHalftone:{value:1}},vertexShader:`
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
      // and out to the screen: three fills these in for the last pass (the
      // renderer's ACES and exposure, then sRGB), which is what OutputPass
      // did as a whole extra full-screen pass of its own
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`};class ly{constructor(t,e,n){A(this,"composer");A(this,"bloom");A(this,"wired");A(this,"tear",0);this.composer=new sy(t),this.composer.addPass(new ry(e,n)),this.bloom=new Hs(new dt(256,256),.7,.5,.78);for(const i of[this.bloom.renderTargetBright,...this.bloom.renderTargetsHorizontal,...this.bloom.renderTargetsVertical])i.depthBuffer=!1;this.composer.addPass(this.bloom),this.wired=new sd(ay),this.composer.addPass(this.wired)}get u(){return this.wired.uniforms}setSize(t,e,n){this.composer.setPixelRatio(n),this.composer.setSize(t,e),this.u.uRes.value.set(t*n,e*n),this.u.uDot.value=Math.max(2.5,3*n)}kick(t=1){this.tear=Math.max(this.tear,t)}setHalftone(t){this.u.uHalftone.value=t?1:0}render(t,e){this.tear=Math.max(0,this.tear-e*2.2),this.u.uTime.value=t,this.u.uTear.value=this.tear*this.tear,this.composer.render(e)}}const cy={color:723724,roughness:.55,metalness:0};class od{constructor(t,e,n){A(this,"mesh");A(this,"uniforms",{uPulseColor:{value:new Gt},uPulseTime:{value:0},uPulseGain:{value:.35},uPulseCount:{value:3},uPulseSpeed:{value:.35}});A(this,"base",.35);A(this,"surgeLeft",0);A(this,"lit",0);const i=new ou(t,!1,"centripetal",.5),r=i.getLength(),o=new Bl(i,Math.max(40,Math.round(r*18)),e,6,!1),a=o.attributes.uv,l=new Float32Array(a.count);for(let h=0;h<a.count;h++)l[h]=a.getX(h);o.setAttribute("aAlong",new fn(l,1)),this.uniforms.uPulseColor.value.set(n),this.uniforms.uPulseCount.value=Math.max(1,Math.round(r/2.2)),this.uniforms.uPulseSpeed.value=.18+Math.random()*.12;const c=new Qe(cy);c.onBeforeCompile=h=>{Object.assign(h.uniforms,this.uniforms),h.vertexShader=h.vertexShader.replace("#include <common>",`#include <common>
attribute float aAlong;
varying float vAlong;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vAlong = aAlong;`),h.fragmentShader=h.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uPulseColor;
uniform float uPulseTime, uPulseGain, uPulseCount, uPulseSpeed;
varying float vAlong;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
float ph = fract(vAlong * uPulseCount + uPulseTime * uPulseSpeed);
float pulse = smoothstep(0.0, 0.03, ph) * (1.0 - smoothstep(0.03, 0.14, ph));
totalEmissiveRadiance += uPulseColor * (pulse * uPulseGain + 0.012 * uPulseGain);`)},c.customProgramCacheKey=()=>"oikos-cable",this.mesh=new jt(o,c)}setLit(t){this.lit=t}surge(){this.surgeLeft=2.2}update(t,e){this.surgeLeft=Math.max(0,this.surgeLeft-e);const n=this.surgeLeft>0?Math.sin(this.surgeLeft/2.2*Math.PI)*5:0,i=this.base+this.lit*1.2+n;this.uniforms.uPulseGain.value+=(i-this.uniforms.uPulseGain.value)*Math.min(1,e*6),this.uniforms.uPulseTime.value=t*(1+this.lit*1.5+n*.8)}}function hy(s,t,e,n,i,r){const a=[s.clone()],l=s.clone().addScaledVector(t,.18);a.push(l);const c=new P(l.x,.022,l.z).addScaledVector(t,.22);s.y>.3&&a.push(new P(l.x,(s.y+.022)*.4,l.z).addScaledVector(t,.2)),a.push(c);const h=new P(e.x,.022,n-.14),u=Math.sign(c.x||1);c.z>n-.1&&a.push(new P(u*1.15,.022,n-.25));const d=2;for(let f=1;f<=d;f++){const p=f/(d+1),v=new P().lerpVectors(c,h,p),m=new P(h.z-c.z,0,c.x-h.x).normalize();v.addScaledVector(m,(r()-.5)*.9),v.y=.022,a.push(v)}return a.push(h),a.push(new P(e.x,i-.04,n-.035)),a.push(new P(e.x,i+.03,n+.01)),a.push(e.clone()),a}function ad(s,t,e,n=32){const i=[];for(let r=0;r<=n;r++){const o=r/n,a=new P().lerpVectors(s,t,o);a.y-=e*4*o*(1-o),i.push(a)}return i}function uy(s){const t=[],e=[],n=[];for(const r of s){const o=r.getAttribute("position"),a=r.getAttribute("normal"),l=t.length/3;for(let h=0;h<o.count;h++)t.push(o.getX(h),o.getY(h),o.getZ(h)),e.push(a.getX(h),a.getY(h),a.getZ(h));const c=r.getIndex();if(c)for(let h=0;h<c.count;h++)n.push(l+c.getX(h));else for(let h=0;h<o.count;h++)n.push(l+h)}const i=new Ge;return i.setAttribute("position",new fe(t,3)),i.setAttribute("normal",new fe(e,3)),i.setIndex(n),i}function ld(s,t){for(let e=0;e<s.length-1;e++){const n=s[e],i=s[e+1];n&&i&&t.push(n.x,n.y,n.z,i.x,i.y,i.z)}}function dy(){var h,u,d;const s=new jn,t=[],e=[],n=new Qe({color:854795,roughness:.9}),i=new Zh({color:328708}),r=[new P(-26,0,-18),new P(-9,0,-24),new P(8,0,-23),new P(24,0,-15),new P(33,0,2)],o=12.5,a=[];r.forEach((f,p)=>{const v=new jt(new Ns(.12,.17,o,8));v.position.set(f.x,o/2,f.z),v.updateMatrix(),t.push(v.geometry.applyMatrix4(v.matrix));const m=r[p+1]??r[p-1]??f,g=new P().subVectors(m,f).setY(0).normalize(),x=new P(-g.z,0,g.x),w=[];for(const[M,E]of[[o-.4,1.9],[o-1.5,1.4]]){const b=new jt(new Tn(E*2,.12,.12));b.position.set(f.x,M,f.z),b.rotation.y=Math.atan2(-x.z,x.x),b.updateMatrix(),t.push(b.geometry.applyMatrix4(b.matrix));for(const R of[-1,-.45,.45,1])w.push(new P(f.x,M+.08,f.z).addScaledVector(x,R*E*.95))}a.push(w)});for(let f=0;f<a.length-1;f++){const p=a[f]??[],v=a[f+1]??[];p.forEach((m,g)=>{const x=v[g];x&&ld(ad(m,x,1.4+g%3*.25),e)})}const l=[[(h=a[1])==null?void 0:h[0],new P(-2.4,9,-6.6)],[(u=a[2])==null?void 0:u[3],new P(2.2,9,-6.1)],[(d=a[3])==null?void 0:d[1],new P(6,8.5,-3)]];for(const[f,p]of l)f&&ld(ad(f,p,2.2),e);s.add(new jt(uy(t),n));for(const f of t)f.dispose();const c=new Ge;return c.setAttribute("position",new fe(e,3)),s.add(new Dm(c,i)),s}function fy(){const s=new De({side:Ke,depthWrite:!1,fog:!1,uniforms:{uTime:{value:0}},vertexShader:`
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
      }`}),t=new jt(new go(70,32,16),s);return t.renderOrder=-1,t}const nn=.62,ec=1.6,Ro=1.1,Ei=.1,cd=Ei-Ro/2,Zi="#ffb347",nc="rgba(255,179,71,0.68)",Ti='"VT323", "IBM Plex Mono", ui-monospace, monospace';class py{constructor(){A(this,"canvas",document.createElement("canvas"));A(this,"glow",.8);A(this,"ctx");A(this,"mode",{kind:"idle"});A(this,"dirty",!0);A(this,"lastKey","");A(this,"fontsReady",!1);var t;this.canvas.width=512,this.canvas.height=384,this.ctx=this.canvas.getContext("2d"),(t=document.fonts)==null||t.load(`40px ${Ti}`).then(()=>{this.fontsReady=!0,this.dirty=!0},()=>{this.fontsReady=!0})}scroll(t,e){this.mode={kind:"scroll",text:t,at:e},this.dirty=!0}play(t,e,n){this.mode={kind:"play",channel:t,name:e,at:n},this.dirty=!0}stop(){this.mode={kind:"idle"},this.dirty=!0}update(t,e){const n=this.mode;if(n.kind==="scroll"){const l=512+n.text.length*22;(t-n.at)*120>l&&this.stop()}const i=new Date,r=Math.floor(t*2)%2===0,o=this.mode.kind==="scroll"?Math.floor((t-this.mode.at)*15):0,a=`${this.mode.kind}|${i.getHours()}:${i.getMinutes()}|${r}|${o}|${this.fontsReady}`;if(!this.dirty&&a===this.lastKey)return!1;this.lastKey=a,this.dirty=!1;try{this.paint(t,i,r)}catch{return!1}return!0}paint(t,e,n){const i=this.ctx;if(!i)return;const r=this.canvas.width,o=this.canvas.height;i.fillStyle="#060302",i.fillRect(0,0,r,o),i.textBaseline="alphabetic",i.fillStyle=Zi,i.font=`48px ${Ti}`,i.fillText("æthera",26,56),i.fillStyle=nc,i.font=`36px ${Ti}`,i.textAlign="right",i.fillText(`day ${xy(e)} · ${ic(e.getHours())}:${ic(e.getMinutes())}`,r-26,54),i.textAlign="left",i.fillRect(26,72,r-52,2);const a=this.mode;if(a.kind==="play"?(i.fillStyle=nc,i.font=`30px ${Ti}`,i.fillText(`▸ ch ${ic(a.channel)}`,26,150),i.fillStyle=Zi,i.font=`64px ${Ti}`,i.fillText(vy(i,a.name,r-52),26,214),i.fillStyle=nc,i.font=`26px ${Ti}`,i.fillText(`opening${".".repeat(1+Math.floor(t*2)%3)}`,26,262)):(i.save(),i.fillStyle=Zi,i.shadowColor="rgba(255,138,61,0.55)",i.shadowBlur=18,i.font=`180px ${Ti}`,i.textAlign="center",i.fillText("æ",r/2,250),i.restore()),i.fillStyle=Zi,i.font=`40px ${Ti}`,a.kind==="scroll"){const l=r-(t-a.at)*120;i.fillText(a.text,l,o-30)}else i.fillText(`~ ${n?"_":" "}`,26,o-30)}}class my{constructor(){A(this,"group",new jn);A(this,"hit");A(this,"display",new py);A(this,"monitor");A(this,"rearY",nn-.02);A(this,"rearZ",cd);A(this,"hddLed");A(this,"busyLeft",0);A(this,"power",0);A(this,"hover",0);A(this,"link");const t=new Qe({color:723725,roughness:.7,metalness:.1}),e=new jt(new ri(ec,nn,Ro,2,.02),t);e.position.set(0,nn/2,Ei),this.group.add(e);const n=new jt(new Tn(ec+.02,.006,Ro+.02),new ii({color:11735583}));n.position.set(0,nn-.03,Ei),this.group.add(n),this.monitor=new nd({style:"beige",screenW:.66,screen:this.display.canvas,label:"aethera",accent:Zi,seed:315}),this.monitor.group.position.set(-.22,nn,Ei+.14),this.monitor.group.rotation.y=.05,this.group.add(this.monitor.group);const i=new Qe({color:12168852,roughness:.62,metalness:.05}),r=.25,o=.56,a=.52,l=new jn;l.position.set(.53,nn,Ei-.04),l.rotation.y=-.12,this.group.add(l);const c=new jt(new ri(r,o,a,3,.012),i);c.position.y=o/2,l.add(c);const h=new Qe({color:3814700,roughness:.5});for(const[g,x]of[[.49,.04],[.435,.04],[.37,.014]]){const w=new jt(new mn(r*.78,x),h);w.position.set(0,g,a/2+.001),l.add(w)}const u=(g,x)=>{const w=new ii({color:g}),M=new jt(new Ul(.006,10),w);return M.position.set(r*.28,x,a/2+.002),l.add(M),w};u(7208826,.08),this.hddLed=u(3810320,.06);const d=new jt(new ri(.5,.028,.17,2,.006),i);d.position.set(-.22,nn+.016,Ei+.4),d.rotation.set(.06,.04,0),this.group.add(d);const f=new jt(new mn(.46,.13),new Qe({map:gy(),roughness:.6}));f.rotation.x=-Math.PI/2,f.position.set(0,.0145,0),d.add(f),this.group.updateMatrixWorld(!0);const p=new P(.53-.05,nn+.12,Ei-.3),v=this.monitor.world(this.monitor.portLocal),m=new P().lerpVectors(p,v,.5).setY(nn+.01);this.link=new od([p,p.clone().setY(nn+.02),m,v.clone().setY(nn+.03),v],.01,Zi),this.group.add(this.link.mesh),this.hit=new jt(new Tn(ec,.82,Ro),new ii({visible:!1})),this.hit.position.set(0,nn+.36,Ei),this.group.add(this.hit)}screenWorld(){return this.monitor.world(this.monitor.screenLocal)}load(t){this.busyLeft=t?1.4:.5}update(t,e,n){this.power=Math.min(1,this.power+e/.8),this.hover+=((n?1:0)-this.hover)*Math.min(1,e*8),this.display.glow=.8+this.hover*.2;const i=this.monitor.crt.uniforms;i.uTime.value=t,i.uPower.value=this.power,i.uHover.value=this.hover,this.power>.2&&this.display.update(t,e)&&(this.monitor.texture.needsUpdate=!0),this.monitor.setLed(this.power>.5,Zi),this.busyLeft=Math.max(0,this.busyLeft-e);const r=this.busyLeft>0&&Math.sin(t*47)+Math.sin(t*29)>.3;this.hddLed.color.setHex(r?16757575:3810320),this.link.update(t,e)}}function gy(){const s=document.createElement("canvas");s.width=256,s.height=72;const t=s.getContext("2d");if(t){t.fillStyle="#8e8571",t.fillRect(0,0,256,72),t.fillStyle="#cfc6ae";for(let n=0;n<4;n++)for(let i=0;i<15;i++)t.fillRect(4+i*16.6+n%2*4,5+n*16,13.5,13);t.fillRect(56,65,120,4)}const e=new Is(s);return e.colorSpace=ke,e}function xy(s){const t=Date.UTC(s.getFullYear(),0,0),e=Date.UTC(s.getFullYear(),s.getMonth(),s.getDate());return Math.round((e-t)/864e5)}function ic(s){return String(s).padStart(2,"0")}function vy(s,t,e){if(s.measureText(t).width<=e)return t;let n=t;for(;n.length>1&&s.measureText(`${n}…`).width>e;)n=n.slice(0,-1);return`${n}…`}const hd=30,_y=8,yy=1.2,My=25e5,by=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2;function Sy(){const s=document.createElement("canvas");s.width=s.height=128;const t=s.getContext("2d");if(t){const e=t.createRadialGradient(64,64,0,64,64,64);e.addColorStop(0,"rgba(255,255,255,0.9)"),e.addColorStop(.4,"rgba(255,255,255,0.3)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,128,128)}return new Is(s)}class wy{constructor(t,e,n,i){A(this,"renderer");A(this,"scene",new Mm);A(this,"camera",new tn(45,1,.05,160));A(this,"controls");A(this,"post");A(this,"core",new my);A(this,"field");A(this,"sky");A(this,"stations",new Map);A(this,"pickables",[]);A(this,"raycaster",new u0);A(this,"pointer",new dt(-9,-9));A(this,"pointerPx",{x:0,y:0});A(this,"pointerDirty",!1);A(this,"hovered",null);A(this,"focused",null);A(this,"tween",null);A(this,"playing",null);A(this,"settlePlay",null);A(this,"tuneSeq",0);A(this,"lastAspect",0);A(this,"later",[]);A(this,"clock",new d0);A(this,"t",0);A(this,"running",!1);A(this,"raf",0);A(this,"lastInput",0);A(this,"swayDir",1);A(this,"pixelRatio");A(this,"maxPixelRatio");A(this,"frameTimes",[]);A(this,"qualityStep",0);A(this,"shift",{x:0,y:0});A(this,"tuned",null);A(this,"shiftTarget",{x:0,y:0});A(this,"reduced");A(this,"lowPower");A(this,"speed",Math.min(10,Math.max(1,Number(new URLSearchParams(location.search).get("speed"))||1)));A(this,"driven",new URLSearchParams(location.search).has("drive"));A(this,"perf",{frames:0,rendered:0,paint:0,render:0,uploads:0});A(this,"frustum",new ho);A(this,"viewProj",new ce);A(this,"kept",null);A(this,"calm",0);A(this,"paceSum",0);A(this,"visibility","full");A(this,"contextLost",!1);A(this,"sinceRender",0);A(this,"lastStep",0);A(this,"ticks",0);this.container=t,this.events=i,this.reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,this.lowPower=matchMedia("(pointer: coarse)").matches||Math.min(innerWidth,innerHeight)<600,this.maxPixelRatio=this.pixelCap(),this.pixelRatio=this.maxPixelRatio,this.renderer=new R_({antialias:!1,powerPreference:"default"}),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.toneMapping=ga,this.renderer.toneMappingExposure=1.1,this.renderer.outputColorSpace=ke,this.renderer.domElement.id="oikos-gl",this.renderer.domElement.setAttribute("role","img"),this.renderer.domElement.setAttribute("aria-label","a dark room full of screens, each one a place on æthera"),t.prepend(this.renderer.domElement),this.bindContext();try{this.build(e,n)}catch(r){throw this.renderer.domElement.remove(),this.renderer.dispose(),this.renderer.forceContextLoss(),r}}build(t,e){this.scene.background=new Gt(0),this.scene.fog=new xl(new Gt().setRGB(.049,.0063,.0089,ir),.042),this.sky=fy(),this.scene.add(this.sky),this.scene.add(new e0(4866648,393988,.8));const n=new o0(9082040,.35);n.position.set(-4,10,-6),this.scene.add(n);const i=new i0(14212351,9,7,.42,.65,1.6);i.position.set(.4,4.6,1.2),i.target.position.set(-.05,nn+.3,.15),this.scene.add(i,i.target);const r=new Gl(10466303,2.2,4.5,2);r.position.set(-.4,1.35,2.3),this.scene.add(r);const o=new Gl(11735583,1.6,4,2);o.position.set(0,.25,1.4),this.scene.add(o),this.buildFloor(),this.scene.add(this.core.group),this.pickables.push(this.core.hit),this.core.hit.userData.pick="vcr",this.scene.add(dy());const a=Ui(1998);this.field=new X_(this.lowPower?40:90,a,this.scene.fog),this.scene.add(this.field.group),this.buildStations(t,e,a),this.controls=new L_(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.enablePan=!1,this.controls.rotateSpeed=.28,this.controls.zoomSpeed=.6,this.controls.addEventListener("start",()=>this.lastInput=this.t),this.post=new ly(this.renderer,this.scene,this.camera),this.resize();const l=this.homePose();this.camera.position.copy(l.pos),this.controls.target.copy(l.target),this.applyLimits(null),this.controls.update(),this.bindPointer(),addEventListener("resize",()=>this.resize())}buildFloor(){const t=document.createElement("canvas");t.width=t.height=512;const e=t.getContext("2d");if(e){e.fillStyle="#0c0b0d",e.fillRect(0,0,512,512),e.strokeStyle="rgba(120,110,130,0.10)",e.lineWidth=2;for(let r=0;r<=512;r+=128)e.beginPath(),e.moveTo(r,0),e.lineTo(r,512),e.moveTo(0,r),e.lineTo(512,r),e.stroke();for(let r=0;r<900;r++)e.fillStyle=`rgba(${Math.random()<.3?"120,20,30":"90,90,100"},${Math.random()*.12})`,e.fillRect(Math.random()*512,Math.random()*512,2,2)}const n=new Is(t);n.wrapS=n.wrapT=Ur,n.repeat.set(24,24),n.colorSpace=ke,n.anisotropy=8;const i=new jt(new mn(96,96),new Qe({map:n,roughness:.82,metalness:.15}));i.rotation.x=-Math.PI/2,this.scene.add(i)}buildStations(t,e,n){const i=new Qe({color:1315086,roughness:.85}),r=new Qe({color:657930,roughness:.6}),o=Sy(),a=new P,l=new Map,c=t.map((u,d)=>({site:u,i:d,p:cp(u.id,d)}));c.sort((u,d)=>+!!u.p.on-+!!d.p.on);let h=0;for(const{site:u,p:d}of c){if(u.screen===!1)continue;const f=e.get(u.id);if(!f)continue;const p=new nd({style:d.style,screenW:d.screenW,screen:f.canvas,label:u.title,accent:u.accent,seed:Math.floor(n()*1e3),stand:d.stand}),v=Wr.degToRad(d.angle),m=d.on?l.get(d.on):void 0;if(m)p.group.position.copy(m.group.position),p.group.position.y+=m.height,p.group.rotation.copy(m.group.rotation),p.group.rotateY((n()-.5)*.12),p.group.translateZ(-(m.depth-p.depth)*.3);else{p.group.position.set(Math.sin(v)*d.r,d.y,-Math.cos(v)*d.r);const D=new P(0,d.hang?1.3:p.group.position.y+.6,.6);p.group.lookAt(D),d.hang||(p.group.rotation.set(0,Math.atan2(-p.group.position.x,.6-p.group.position.z),0),p.group.rotateY((n()-.5)*.1))}if(this.scene.add(p.group),l.set(u.id,p),!d.hang&&!d.on&&d.y>.01){const D=new jt(new Tn(p.width*.92,d.y,p.depth*.9),i);D.position.set(0,-d.y/2,-p.depth*.45),p.group.add(D)}if(d.hang){const D=p.world(p.topLocal),U=new jt(new Ns(.008,.008,16,5),r);U.position.set(D.x,D.y+8,D.z),this.scene.add(U)}const g=-.5+h++*.37%1;a.set(g,this.core.rearY-.05,this.core.rearZ-.01);const x=p.world(p.portLocal),w=p.normal().multiplyScalar(-1).setY(0).normalize();let M;const E=d.feeds?l.get(d.feeds):void 0;if(E){const D=E.world(E.portLocal.clone().add(new P(-.25,.15,0))),U=new P().lerpVectors(x,D,.5);U.y=Math.min(x.y,D.y)-.6,M=[x,x.clone().addScaledVector(w,.3).setY(x.y-.2),U,D.clone().add(new P(0,.3,-.3)),D]}else M=hy(x,w,a,cd,nn,n);const b=new od(M,d.hang?.014:.02,u.accent);this.scene.add(b.mesh);const R=new jt(new mn(d.screenW*2.6,d.screenW*2.2),new ii({map:o,color:u.accent,transparent:!0,opacity:0,depthWrite:!1,blending:Dr,fog:!0})),_=p.normal().setY(0).normalize(),T=p.world(p.screenLocal).addScaledVector(_,d.screenW*.9);R.position.set(T.x,.012,T.z),R.rotation.x=-Math.PI/2,R.rotation.z=Math.atan2(_.x,_.z),d.hang||this.scene.add(R);let L=null;this.lowPower||(L=new Gl(u.accent,0,3.2+d.screenW,2),L.position.copy(p.world(p.screenLocal).addScaledVector(p.normal(),1.1)),this.scene.add(L)),p.hit.userData.pick=u.id,this.pickables.push(p.hit),this.stations.set(u.id,{site:u,screen:f,monitor:p,placement:d,cable:b,glow:R,light:L,tickedAt:0,power:0,powerAt:1/0,staticLeft:0,hover:0})}}homePose(){const t=this.camera.aspect,e=t<1,n=e?7.2+(1-t)*2.4:7.8;return{pos:new P(0,e?2.5:2.4,n),target:new P(0,e?1.7:1.95,-1.6)}}posesFor(t){if(t==="vcr"){const c=this.camera.aspect<1,h=this.core.screenWorld();return{pos:new P(h.x+.25,h.y+.35,c?3.4:2.5),target:h.clone().setY(h.y-.08)}}const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.world(n.screenLocal),r=n.normal(),o=Wr.degToRad(this.camera.fov),a=2*Math.atan(Math.tan(o/2)*this.camera.aspect),l=Math.max(n.screenH/2/Math.tan(o/2)/.46,n.screenH/.75/2/Math.tan(a/2)/.7);return{pos:i.clone().addScaledVector(r,l+.05),target:i}}applyLimits(t){const e=this.controls;if(!t){e.minDistance=3,e.maxDistance=15,e.minAzimuthAngle=-.8,e.maxAzimuthAngle=.8,e.minPolarAngle=.95,e.maxPolarAngle=1.56;return}const n=new P().subVectors(this.camera.position,e.target),i=new Wl().setFromVector3(n);e.minDistance=i.radius*.45,e.maxDistance=i.radius*1.7,e.minAzimuthAngle=i.theta-.6,e.maxAzimuthAngle=i.theta+.6,e.minPolarAngle=Math.max(.3,i.phi-.45),e.maxPolarAngle=Math.min(1.6,i.phi+.35)}flyTo(t,e,n){this.controls.enabled=!1,this.controls.minAzimuthAngle=-1/0,this.controls.maxAzimuthAngle=1/0,this.tween={from:{pos:this.camera.position.clone(),target:this.controls.target.clone()},to:t,k:0,dur:this.reduced?.01:e,done:n}}focus(t){const e=t?this.posesFor(t):this.homePose();if(e){this.cancelPlay(),this.focused=t;for(const[n,i]of this.stations)i.cable.setLit(n===t?1:0);this.flyTo(e,t?1.15:1.3,()=>{this.applyLimits(t),this.controls.enabled=!this.tuned,this.controls.update()})}}get focusedId(){return this.focused}keepAlive(t){this.kept=t}setVisibility(t){t!==this.visibility&&(this.visibility=t,this.frameTimes=[],this.paceSum=0)}get busy(){return this.playing!==null}cancelPlay(){this.playing=null;const t=this.settlePlay;this.settlePlay=null,t==null||t(!1)}play(t){const e=this.stations.get(t),n=this.posesFor(t);if(!e||!n)return Promise.resolve(!0);this.cancelPlay();const i=new Promise(c=>this.settlePlay=c);this.core.load(e.site.title),this.core.display.play(e.placement.channel,e.site.title,this.t),this.focused=t,this.playing=t;for(const[c,h]of this.stations)h.cable.setLit(c===t?1:0);const r=()=>{this.playing===t&&(e.staticLeft=.9,this.post.kick(.7),this.flyTo(n,1.15,()=>{if(this.playing!==t)return;this.playing=null,this.applyLimits(t),this.controls.enabled=!this.tuned,this.controls.update();const c=this.settlePlay;this.settlePlay=null,c==null||c(!0)}))};if(this.reduced)return r(),i;const o=Math.sign(e.monitor.group.position.x)||1,a=this.camera.aspect<1,l={pos:new P(o*.45,1.4,a?3.1:2.25),target:this.core.screenWorld()};return this.flyTo(l,.8,()=>{this.playing===t&&(e.cable.surge(),this.after(.35,r))}),i}after(t,e){this.later.push({at:this.t+t,fn:e})}eject(){this.core.load(null),this.core.display.stop()}scroll(t){this.core.display.scroll(t,this.t)}dive(t){const e=this.stations.get(t);if(!e||this.reduced)return Promise.resolve();this.cancelPlay();const n=e.monitor,i=n.world(n.screenLocal),r=i.clone().addScaledVector(n.normal(),n.screenH*.16);return e.staticLeft=.8,this.post.kick(1),new Promise(o=>this.flyTo({pos:r,target:i},.75,o))}powerOn(){let t=0;const e=[...this.stations.values()].sort((n,i)=>n.placement.channel-i.placement.channel);for(const n of e)n.powerAt=this.t+.25+t++*(this.reduced?0:.14)}anchor(t){let e;if(t==="vcr")e=this.core.screenWorld().add(new P(0,-.32,.45));else{const i=this.stations.get(t);if(!i)return null;e=i.monitor.world(i.monitor.screenLocal.clone().add(new P(0,i.monitor.screenH*.5,0)))}if(e.project(this.camera),e.z>1)return null;const n=this.renderer.domElement.getBoundingClientRect();return{x:n.left+(e.x+1)/2*n.width,y:n.top+(1-e.y)/2*n.height}}setShift(t,e){this.shiftTarget={x:t,y:e}}applyShift(t){this.tuned&&(this.shiftTarget={x:0,y:0});const e=this.reduced?1:Math.min(1,t*5),n=this.shift.x+(this.shiftTarget.x-this.shift.x)*e,i=this.shift.y+(this.shiftTarget.y-this.shift.y)*e;if(Math.abs(n-this.shift.x)<.05&&Math.abs(i-this.shift.y)<.05&&this.camera.view)return;this.shift={x:n,y:i};const r=this.container.clientWidth||innerWidth,o=this.container.clientHeight||innerHeight;this.camera.setViewOffset(r,o,n,i,r,o)}tuneIn(t,e){const n=this.stations.get(t),i=this.tunePose(t);if(!n||!i)return Promise.resolve();this.tuneOut(),this.cancelPlay();const r=this.tuneSeq;this.focused=t,this.shiftTarget={x:0,y:0};for(const[o,a]of this.stations)a.cable.setLit(o===t?1:0);return new Promise(o=>this.flyTo(i,1.1,()=>{if(r!==this.tuneSeq){this.applyLimits(t),this.controls.enabled=!0;return}this.tuned={id:t,place:e},n.staticLeft=0,this.resize(),o()}))}tunePose(t){const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.screenH/.75,r=n.world(n.screenLocal),o=Wr.degToRad(this.camera.fov),a=2*Math.atan(Math.tan(o/2)*this.camera.aspect),l=Math.max(n.screenH/2/Math.tan(o/2)/.84,i/2/Math.tan(a/2)/.94);return{pos:r.clone().addScaledVector(n.normal(),l),target:r}}tuneOut(){this.tuneSeq++,this.tuned&&(this.tuned=null,this.tween||(this.applyLimits(this.focused),this.controls.enabled=!0))}reset(){this.tuneOut(),this.cancelPlay(),this.focus(null)}glassRect(t){const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.screenH/.75,r=this.renderer.domElement.getBoundingClientRect(),o=[],a=[];this.camera.updateMatrixWorld();for(const[h,u]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const d=n.world(n.screenLocal.clone().add(new P(h*i/2,u*n.screenH/2,i*.02)));d.project(this.camera),o.push(r.left+(d.x+1)/2*r.width),a.push(r.top+(1-d.y)/2*r.height)}const l=Math.min(...o),c=Math.min(...a);return new DOMRectReadOnly(l,c,Math.max(...o)-l,Math.max(...a)-c)}get tunedId(){var t;return((t=this.tuned)==null?void 0:t.id)??null}bindPointer(){const t=this.renderer.domElement;let e=null,n=null;const i=()=>{this.pointer.set(-9,-9),this.pointerDirty=!0};t.addEventListener("pointermove",r=>{if(this.lastInput=this.t,r.pointerType==="touch")return;const o=t.getBoundingClientRect();this.pointer.set((r.clientX-o.left)/o.width*2-1,-((r.clientY-o.top)/o.height)*2+1),this.pointerPx={x:r.clientX,y:r.clientY},this.pointerDirty=!0}),t.addEventListener("pointerleave",i),t.addEventListener("pointerdown",r=>{if(n=null,r.button!==0||!r.isPrimary){e=null;return}e={x:r.clientX,y:r.clientY,t:performance.now()},this.lastInput=this.t}),t.addEventListener("pointerup",r=>{if(!e)return;const o=Math.hypot(r.clientX-e.x,r.clientY-e.y),a=performance.now()-e.t<600;e=null,r.pointerType==="touch"&&i(),!(o>7||!a||this.tuned)&&(n={x:r.clientX,y:r.clientY,touch:r.pointerType==="touch"})}),t.addEventListener("pointercancel",()=>{e=null,n=null}),t.addEventListener("click",()=>{const r=n;if(n=null,!r||this.tuned)return;const o=t.getBoundingClientRect(),a=this.pointer.clone();this.pointer.set((r.x-o.left)/o.width*2-1,-((r.y-o.top)/o.height)*2+1);const l=this.pickAt();r.touch?this.pointer.set(-9,-9):this.pointer.copy(a),this.events.pick(l)})}pickFromPoint(t,e){const n=this.renderer.domElement.getBoundingClientRect(),i=this.pointer.clone();this.pointer.set((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);const r=this.pickAt();return this.pointer.copy(i),r}pickAt(){this.raycaster.setFromCamera(this.pointer,this.camera);const t=this.raycaster.intersectObjects(this.pickables,!1)[0];return(t==null?void 0:t.object.userData.pick)??null}resize(){const t=this.container.clientWidth||innerWidth,e=this.container.clientHeight||innerHeight,n=Math.abs(t/e-this.lastAspect)>.02;this.lastAspect=t/e,this.camera.aspect=t/e,this.camera.fov=this.camera.aspect<1?58:45,this.camera.setViewOffset(t,e,this.shift.x,this.shift.y,t,e);const i=this.pixelCap();if(Math.abs(i-this.maxPixelRatio)>.001&&(this.maxPixelRatio=i,this.pixelRatio=Math.max(Math.min(.6,i),i*Math.pow(.8,this.qualityStep)),this.renderer.setPixelRatio(this.pixelRatio)),this.renderer.setSize(t,e,!1),this.renderer.domElement.style.width=`${t}px`,this.renderer.domElement.style.height=`${e}px`,this.post.setSize(t,e,this.pixelRatio),this.tuned){this.shift={x:0,y:0},this.camera.setViewOffset(t,e,0,0,t,e);const r=this.tunePose(this.tuned.id);r&&(this.camera.position.copy(r.pos),this.controls.target.copy(r.target),this.camera.lookAt(r.target));const o=this.glassRect(this.tuned.id);o&&this.tuned.place(o)}if(n&&!this.tween&&!this.focused&&this.controls){const r=this.homePose();this.camera.position.copy(r.pos),this.controls.target.copy(r.target)}}async warm(t=5e3){try{await Promise.race([this.renderer.compileAsync(this.scene,this.camera),new Promise(e=>setTimeout(e,t))]),this.post.render(0,0)}catch(e){console.warn("oikos: warm-up skipped",e)}}start(){if(this.running)return;if(this.running=!0,this.clock.getDelta(),this.driven){const e=this.renderer.getContext();window.__oikos={step:(n=1,i=1/30)=>{var r;this.perf={frames:0,rendered:0,paint:0,render:0,uploads:0};for(let o=0;o<n;o++)this.frame(i),e.finish();return{...this.perf,t:this.t,focused:this.focused,hovered:this.hovered,tuned:((r=this.tuned)==null?void 0:r.id)??null}},anchor:n=>this.anchor(n),glass:n=>this.glassRect(n)};return}this.lastStep=0,this.ticks=0,this.frameTimes=[],this.paceSum=0;const t=e=>{this.running&&(this.raf=requestAnimationFrame(t),this.ticks++,!(this.lastStep&&e-this.lastStep<this.minInterval()*1e3-4)&&(this.lastStep=e,this.frame()))};this.raf=requestAnimationFrame(t)}minInterval(){const t=this.tween!==null||this.later.length>0||this.t-this.lastInput<yy;return this.visibility==="full"&&!this.contextLost?t?0:1/hd:t||this.kept?1/hd:.25}pixelCap(){const t=this.container.clientWidth||innerWidth,e=this.container.clientHeight||innerHeight,n=Math.min(devicePixelRatio||1,this.lowPower?1.25:1.6);return Math.min(n,Math.sqrt(My/Math.max(1,t*e)))}bindContext(){const t=this.renderer.domElement,e=n=>{var i,r;try{(r=(i=this.events).context)==null||r.call(i,n)}catch(o){console.warn("oikos: context listener failed",o)}};t.addEventListener("webglcontextlost",n=>{n.preventDefault(),!this.contextLost&&(this.contextLost=!0,t.style.visibility="hidden",console.warn("oikos: the GPU took the room away; waiting for it back"),e(!1))}),t.addEventListener("webglcontextrestored",()=>{if(this.contextLost){this.contextLost=!1,t.style.visibility="";try{for(const n of this.stations.values())n.monitor.texture.needsUpdate=!0;this.frameTimes=[],this.paceSum=0}catch(n){console.warn("oikos: restoring the room",n)}e(!0)}})}stop(){this.running=!1,cancelAnimationFrame(this.raf)}adapt(t,e=t){this.frameTimes.push(t),this.paceSum+=e;const n=this.frameTimes.reduce((o,a)=>o+a,0);if(this.frameTimes.length<90&&n<2)return;const i=n/this.frameTimes.length,r=this.paceSum/this.frameTimes.length;if(this.frameTimes=[],this.paceSum=0,this.calm=r<1/50?this.calm+1:0,this.calm>=3&&this.qualityStep>0){this.calm=0,this.qualityStep--,this.pixelRatio=Math.min(this.maxPixelRatio,this.pixelRatio/.8),this.post.bloom.enabled=!0,this.applyPixelRatio();return}i>1/27&&this.qualityStep<3&&(this.qualityStep++,this.pixelRatio=Math.max(Math.min(.6,this.maxPixelRatio),this.pixelRatio*.8),this.qualityStep>=3&&(this.post.bloom.enabled=!1),this.applyPixelRatio())}applyPixelRatio(){this.renderer.setPixelRatio(this.pixelRatio);const t=this.container.clientWidth||innerWidth,e=this.container.clientHeight||innerHeight;this.renderer.setSize(t,e,!1),this.post.setSize(t,e,this.pixelRatio)}frame(t){var c;const e=t??this.clock.getDelta(),n=Math.min(e,.1)*this.speed;this.t+=n;const i=this.t;this.sinceRender+=n;const r=this.shouldRender();if(r&&!this.driven&&this.visibility==="full"){const h=Math.max(1,this.ticks);this.ticks=0,this.adapt(Math.min(e,.5),Math.min(e,.5)/h)}if(this.applyShift(n),this.later.length){const h=this.later.filter(u=>u.at<=i);this.later=this.later.filter(u=>u.at>i);for(const u of h)u.fn()}if(this.tween){const h=this.tween;h.k=Math.min(1,h.k+n/h.dur);const u=by(h.k);this.camera.position.lerpVectors(h.from.pos,h.to.pos,u),this.controls.target.lerpVectors(h.from.target,h.to.target,u),this.camera.lookAt(this.controls.target),h.k>=1&&(this.tween=null,(c=h.done)==null||c.call(h))}else{if(!this.focused&&!this.reduced&&i-this.lastInput>9){this.controls.autoRotate=!0;const h=this.controls.getAzimuthalAngle();h>.32&&(this.swayDir=1),h<-.32&&(this.swayDir=-1),this.controls.autoRotateSpeed=.18*this.swayDir}else this.controls.autoRotate=!1;this.controls.update(n)}if(this.pointerDirty&&!this.tween){this.pointerDirty=!1;const h=this.pickAt();h!==this.hovered&&(this.hovered=h,this.renderer.domElement.style.cursor=h?"pointer":""),this.events.hover(h,this.pointerPx.x,this.pointerPx.y)}if(!r){const h=this.kept?this.stations.get(this.kept):void 0;h&&h.power>.2&&this.tickScreen(h,i,this.focused===this.kept,1);return}const o=Math.min(this.sinceRender,.25);this.sinceRender=0;const a=performance.now();this.camera.updateMatrixWorld(),this.viewProj.multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.viewProj);for(const[h,u]of this.stations){i>=u.powerAt&&(u.power=Math.min(1,u.power+o/(this.reduced?.01:.8))),u.staticLeft=Math.max(0,u.staticLeft-o),u.hover+=((h===this.hovered?1:0)-u.hover)*Math.min(1,o*8);const d=u.monitor.crt.uniforms;d.uTime.value=i,d.uPower.value=u.power,d.uHover.value=u.hover,d.uStatic.value=Math.min(1,u.staticLeft*1.6);const f=this.focused===h,p=f||h===this.kept||this.frustum.intersectsObject(u.monitor.glass),v=this.focused&&this.focused!=="vcr"&&!f&&h!==this.kept?.5:1;u.power>.2&&p&&this.tickScreen(u,i,f,v),u.monitor.setLed(u.power>.5,u.site.accent);const m=u.glow.material;m.opacity=u.power*(.16+u.hover*.12+(f?.1:0)),u.light&&(u.light.intensity=u.power*(2.2+u.hover*1.4+(f?.6:0))),u.cable.update(i,o)}this.core.update(i,o,this.hovered==="vcr"),this.field.update(i);const l=performance.now();if(this.post.render(i,o),this.driven){this.renderer.getContext().finish();const h=performance.now();this.perf.frames++,this.perf.paint+=l-a,this.perf.render+=h-l}this.perf.rendered++}shouldRender(){return this.contextLost||this.visibility==="hidden"?!1:this.visibility==="glimpsed"?this.sinceRender>=1/_y-.001:!0}tickScreen(t,e,n,i){const r=Math.min(.25,Math.max(0,e-t.tickedAt));t.tickedAt=e,t.screen.tick(e,r,n,i,t.site.id===this.kept)&&(t.monitor.texture.needsUpdate=!0,this.perf.uploads++)}}let Ey=0;const Ty=s=>`${s}${++Ey}`,Ay="/static/oikos/mark.png",ue="#ffb347",Oe="rgba(255,179,71,.75)",Ai="rgba(255,179,71,.4)",Se="#1c0e0b",Cy="#2a1612",An="#8fe3ec",sc="#ff6a5a",Po="#7dff6a";function _e(s,t){return`<svg viewBox="0 0 ${s} ${s}" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`}function Ry(s,t=""){const e=Ty("gl");return _e(48,`<defs><radialGradient id="${e}" cx=".42" cy=".38" r=".8"><stop offset="0" stop-color="${s}" stop-opacity="1"/><stop offset=".75" stop-color="${s}" stop-opacity=".55"/><stop offset="1" stop-color="${s}" stop-opacity=".25"/></radialGradient></defs>
<rect x="5" y="7" width="38" height="29" rx="4" fill="${Se}" stroke="${Oe}" stroke-width="1.6"/>
<rect x="9.5" y="11" width="29" height="21" rx="3" fill="url(#${e})"/>
<path d="M9.5 15.5h29M9.5 20h29M9.5 24.5h29M9.5 29h29" stroke="#000" stroke-opacity=".18" stroke-width="1"/>
<path d="M12 13.5h8" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/>
<path d="M18 36l-2.5 5h17L30 36" fill="${Se}" stroke="${Oe}" stroke-width="1.6"/>
<circle cx="39.5" cy="33.5" r=".9" fill="${s}" stroke="none"/>`)}const Cn=Ry;function br(){return _e(48,`<path d="M5 13h13l4 4h21v22H5z" fill="${Se}" stroke="${Oe}" stroke-width="1.6"/>
<path d="M5 20h38" stroke="${Ai}" stroke-width="1.2"/>
<path d="M17 31c2.4-3.4 4.8-3.4 7 0s4.6 3.4 7 0" stroke="${ue}" stroke-width="2.2"/>`)}function ud(){return _e(48,`<rect x="4" y="8" width="26" height="21" rx="3" fill="${Se}" stroke="${Oe}" stroke-width="1.6"/>
<rect x="7.5" y="11.5" width="19" height="14" rx="2" fill="${ue}" fill-opacity=".22" stroke="${Ai}"/>
<path d="M10 15h8M10 18.5h11M10 22h6" stroke="${ue}" stroke-width="1.3"/>
<path d="M13 29l-1.5 4h11L21 29" stroke="${Oe}" stroke-width="1.6"/>
<rect x="33" y="10" width="11" height="28" rx="1.5" fill="${Se}" stroke="${Oe}" stroke-width="1.6"/>
<path d="M35.5 15h6M35.5 18h6" stroke="${Ai}" stroke-width="1.2"/>
<circle cx="38.5" cy="32" r="1.4" fill="${Po}" stroke="none"/>
<path d="M24 36c3 4 9 4 12 2" stroke="${Ai}" stroke-width="1.2"/>`)}function dd(){return _e(48,`<circle cx="24" cy="24" r="17" fill="${Se}" stroke="${An}" stroke-opacity=".8" stroke-width="1.6"/>
<ellipse cx="24" cy="24" rx="7.5" ry="17" stroke="${An}" stroke-opacity=".55" stroke-width="1.2"/>
<path d="M7 24h34M10 15h28M10 33h28" stroke="${An}" stroke-opacity=".45" stroke-width="1.2"/>`)}function Py(){return _e(16,`<rect x="1" y="2.5" width="6" height="5" rx="1" fill="${Se}" stroke="${ue}" stroke-width="1.1"/>
<rect x="9" y="8.5" width="6" height="5" rx="1" fill="${Se}" stroke="${ue}" stroke-width="1.1"/>
<path d="M4 7.5v3.5h5" stroke="${ue}" stroke-width="1.1"/>
<circle cx="12" cy="11" r="1" fill="${Po}" stroke="none"/>`)}function fd(s){const t=s?"#ff7a5c":ue;return _e(16,`<path d="M10.5 2.2a6 6 0 1 0 3.3 9.6A5 5 0 0 1 10.5 2.2z" fill="${s?t:"none"}" fill-opacity="${s?".85":"0"}" stroke="${t}" stroke-width="1.2"/>
${s?`<circle cx="12.8" cy="12.8" r="1.8" fill="${sc}" stroke="none"/>`:""}`)}function pd(s){return _e(24,`<circle cx="12" cy="12" r="9.5" fill="${Se}" stroke="${Oe}" stroke-width="1.4"/><path d="${s==="back"?"M13.5 7.5L9 12l4.5 4.5":"M10.5 7.5L15 12l-4.5 4.5"}" stroke="${ue}" stroke-width="2"/>`)}const Ly=()=>pd("back"),Dy=()=>pd("fwd");function Iy(){return _e(24,`<path d="M2.5 6.5h6l2 2h11v12h-19z" fill="${Se}" stroke="${Oe}" stroke-width="1.3"/>
<path d="M12 18v-6.5M9 14l3-3 3 3" stroke="${ue}" stroke-width="1.8"/>`)}function Uy(){return _e(24,`<circle cx="10" cy="10" r="6" fill="${Se}" stroke="${Oe}" stroke-width="1.6"/><path d="M14.5 14.5l6 6" stroke="${ue}" stroke-width="2.2"/><path d="M7.5 8.5a3 3 0 0 1 2.5-2" stroke="#fff" stroke-opacity=".35" stroke-width="1.1"/>`)}function Ny(){return _e(24,`<path d="M1.5 4.5h5l2 2h7.5v7.5h-14.5z" fill="${Se}" stroke="${Ai}" stroke-width="1.2"/>
<path d="M7.5 10.5h5l2 2h8v8.5h-15z" fill="${Se}" stroke="${Oe}" stroke-width="1.3"/>`)}function ky(){return _e(18,`<rect x="1.5" y="1.5" width="15" height="15" rx="1" stroke="${An}" stroke-opacity=".75" stroke-width="1.2"/><path d="M5 9h7M9 5.5L12.5 9 9 12.5" stroke="${An}" stroke-width="1.6"/>`)}function rc(){return _e(16,`<circle cx="8" cy="8" r="6.6" stroke="${Oe}" stroke-width="1.1"/><path d="M6.3 4.8v6.4l5-3.2z" fill="${ue}" stroke="none"/>`)}function md(){return _e(16,`<rect x="1" y="2" width="10.5" height="8.5" rx="1.2" fill="${Se}" stroke="${Oe}" stroke-width="1.1"/><circle cx="11" cy="11" r="2.7" fill="${Se}" stroke="${ue}" stroke-width="1.2"/><path d="M13 13l2.3 2.3" stroke="${ue}" stroke-width="1.5"/>`)}function Fy(){return _e(16,`<rect x="1" y="3.5" width="14" height="10" rx="2" fill="${Se}" stroke="${Oe}" stroke-width="1.1"/><rect x="2.8" y="5.2" width="8.5" height="6.6" rx="1.4" fill="${ue}" fill-opacity=".3"/><path d="M5 1.2l3 2.3 3-2.3" stroke="${Ai}" stroke-width="1"/><circle cx="13" cy="7" r=".7" fill="${ue}" stroke="none"/><circle cx="13" cy="9.8" r=".7" fill="${ue}" stroke="none"/>`)}function Oy(){return _e(16,`<rect x="2" y="1.5" width="8" height="10" rx="1" fill="${Se}" stroke="${Ai}" stroke-width="1.1"/><rect x="6" y="4.5" width="8" height="10" rx="1" fill="${Se}" stroke="${Oe}" stroke-width="1.1"/><path d="M8 8h4M8 10h4M8 12h3" stroke="${ue}" stroke-opacity=".7" stroke-width=".9"/>`)}function gd(){return _e(16,`<path d="M8 2.5l5.5 6.5h-11z" stroke="${ue}" stroke-width="1.2"/><path d="M2.5 11.5h11v2h-11z" stroke="${ue}" stroke-width="1.2"/>`)}function Gs(s){const t=s==="xml"?"#ff8a3d":An;return _e(48,`<path d="M11 4h19l8 8v32H11z" fill="${Se}" stroke="${Oe}" stroke-width="1.6"/>
<path d="M30 4v8h8" stroke="${Oe}" stroke-width="1.6"/>
<path d="M16 18h16M16 23h16M16 28h12" stroke="${ue}" stroke-opacity=".45" stroke-width="1.3"/>
<rect x="13" y="34" width="22" height="8" fill="${t}" fill-opacity=".14" stroke="${t}" stroke-opacity=".8" stroke-width="1"/>
<text x="24" y="40.4" font-size="6.6" font-family="'IBM Plex Mono',ui-monospace,monospace" font-weight="500" text-anchor="middle" fill="${t}" stroke="none">${Hy(s.toUpperCase())}</text>`)}function xd(){return _e(16,`<circle cx="8" cy="8" r="6.6" fill="${Se}" stroke="${ue}" stroke-width="1.2"/><path d="M8 7.2v4.3" stroke="${ue}" stroke-width="1.6"/><circle cx="8" cy="4.8" r="1" fill="${ue}" stroke="none"/>`)}function vd(){return _e(22,`<path d="M11 4v7" stroke="${sc}" stroke-width="2"/><path d="M7 6.8a6.3 6.3 0 1 0 8 0" stroke="${sc}" stroke-width="1.8"/>`)}function By(){return _e(22,`<path d="M14 4a7.3 7.3 0 1 0 4.8 10.6A6.2 6.2 0 0 1 14 4z" stroke="${ue}" stroke-width="1.7"/>`)}function _d(){return _e(22,`<circle cx="7.5" cy="11" r="3.6" stroke="${ue}" stroke-width="1.7"/><path d="M11.1 11h8M16 11v3M18.6 11v2.3" stroke="${ue}" stroke-width="1.7"/>`)}function zy(){return _e(18,`<rect x="1.5" y="1.5" width="15" height="15" rx="1" stroke="${Oe}" stroke-width="1.2"/><path d="M7 5l5 4-5 4z" fill="${ue}" stroke="none"/>`)}function yd(){return _e(22,`<path d="M16.5 7.5a6.3 6.3 0 1 0 1 5.5" stroke="${Po}" stroke-width="1.8"/><path d="M17.5 3.5v4.5H13" stroke="${Po}" stroke-width="1.8"/>`)}function Lo(s,t=!1){return`<img src="${Ay}" alt="" width="${s}" height="${s}" style="width:${s}px;height:${s}px;${t?"filter:invert(1);":""}">`}function Hy(s){return s.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]??t)}function Ci(s="app"){return s==="status"?_e(16,`<rect x="1.5" y="2.5" width="13" height="9" rx="1" fill="${Se}" stroke="${Oe}" stroke-width="1.1"/><path d="M4 5.5h5M4 8h3" stroke="${An}" stroke-width="1.1"/><path d="M5.5 13.5h5" stroke="${Ai}" stroke-width="1.1"/>`):s==="channel"?_e(16,`<path d="M1.5 2.5h11a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1H6l-3 2.8v-2.8H1.5a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" fill="${Se}" stroke="${An}" stroke-opacity=".85" stroke-width="1.1"/><path d="M5 4.5l-1 4M8 4.5l-1 4M3.5 5.8h5.5M3 7.6h5.5" stroke="${An}" stroke-width=".9"/>`):_e(24,`<path d="M2 3h12.5A1.5 1.5 0 0 1 16 4.5v6.5a1.5 1.5 0 0 1-1.5 1.5H8l-4 3.5v-3.5H2A1.5 1.5 0 0 1 .5 11V4.5A1.5 1.5 0 0 1 2 3z" fill="${Cy}" stroke="${ue}" stroke-width="1.3"/>
<path d="M10 10h11.5A1.5 1.5 0 0 1 23 11.5v6a1.5 1.5 0 0 1-1.5 1.5H20v3.5L16 19h-6a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 10 10z" fill="${Se}" stroke="${An}" stroke-width="1.3"/>
<path d="M3.5 6.5h8M3.5 9h5" stroke="${ue}" stroke-opacity=".8" stroke-width="1.1"/>
<path d="M12 13.5h8M12 16h5" stroke="${An}" stroke-opacity=".8" stroke-width="1.1"/>`)}const Gy="(max-width: 720px), (max-height: 500px) and (pointer: coarse)";let Md=null;function Vs(){try{return Md??(Md=matchMedia(Gy)),Md.matches}catch{return innerWidth<=720}}let oc=!1;addEventListener("keydown",s=>{["Shift","Control","Alt","Meta"].includes(s.key)||(oc=!0)},!0),addEventListener("pointerdown",()=>oc=!1,!0);function Do(){return oc}const Vy='a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]';function Wy(s){const t=[];for(const e of s.querySelectorAll(Vy))e.tabIndex<0||e.closest("[hidden], [inert]")||e.getClientRects().length&&getComputedStyle(e).visibility!=="hidden"&&t.push(e);return t}let Ji=null,sn=null,Bn={};function $y(s){Ji=s,s.addEventListener("pointerdown",e=>{if(!sn)return;const n=e.target;n.closest(".xp-menu")||n.closest("[data-menu-owner]")||Xe()},!0),s.addEventListener("wheel",e=>{sn&&!e.target.closest(".xp-menu")&&Xe()},{capture:!0,passive:!0});let t=innerWidth;addEventListener("resize",()=>{innerWidth!==t&&Xe(),t=innerWidth})}function ac(){return sn!==null}function bd(s){const t=Bn.owner;return!!sn&&!!t&&(t===s||s.contains(t))}function Sd(){const s=document.activeElement;let t=sn;for(;t;){if(s&&t.el.contains(s))return!0;t=t.child}return!1}function Xe(){if(!sn)return!1;const s=Sd();let t=sn;for(;t;)t.el.remove(),t=t.child;sn=null;const{onClose:e,returnTo:n}=Bn;return Bn={},e==null||e(),s&&(n!=null&&n.isConnected)&&n.getClientRects().length&&n.focus({preventScroll:!0}),!0}function wd(s,t){const e=V("div",{class:"xp-menu",role:"menu"}),n=[];for(const r of s){if(r==="sep"){e.append(V("div",{class:"xp-menu-sep",role:"separator"}));continue}const o=V("button",{type:"button",role:r.checked!==void 0?"menuitemcheckbox":"menuitem",class:`${r.bold?"bold ":""}${r.submenu?"has-sub":""}`.trim(),html:`<i class="ic">${r.icon??""}</i><span class="lb"></span><span class="sc"></span>`});o.querySelector(".lb").textContent=r.label,o.querySelector(".sc").textContent=r.shortcut??"",r.checked!==void 0&&(o.setAttribute("aria-checked",String(r.checked)),r.checked&&o.classList.add("checked")),r.disabled&&(o.setAttribute("aria-disabled","true"),o.tabIndex=-1);const a=()=>{var u;if(!r.submenu||r.disabled)return;const l=lc(e);if(!l||((u=l.child)==null?void 0:u.el.dataset.for)===r.label)return;cc(l);const c=o.getBoundingClientRect(),h=Ed(wd(r.submenu(),l),c.right-3,c.top-3,c.left+3);h.dataset.for=r.label,l.child={el:h,child:null}};o.addEventListener("pointerenter",()=>{const l=lc(e);r.submenu?a():l&&cc(l),!r.disabled&&Sd()&&o.focus({preventScroll:!0})}),o.addEventListener("click",l=>{var c,h,u,d;if(l.stopPropagation(),!r.disabled){if(r.submenu){a(),(u=(h=(c=lc(e))==null?void 0:c.child)==null?void 0:h.el.querySelector("button:not([aria-disabled])"))==null||u.focus();return}Xe(),(d=r.run)==null||d.call(r)}}),e.append(o),n.push(o)}e.addEventListener("keydown",r=>{var c,h,u,d,f;const o=n.filter(p=>p.getAttribute("aria-disabled")!=="true"),a=o.indexOf(document.activeElement),l=()=>{r.preventDefault(),r.stopPropagation()};if(r.key==="ArrowDown"||r.key==="ArrowUp"){l();const p=r.key==="ArrowDown",v=a<0?o[p?0:o.length-1]:o[(a+(p?1:-1)+o.length)%o.length];v==null||v.focus()}else r.key==="Home"||r.key==="End"?(l(),(c=o[r.key==="Home"?0:o.length-1])==null||c.focus()):r.key==="ArrowRight"?(l(),(h=o[a])!=null&&h.classList.contains("has-sub")?(u=o[a])==null||u.click():t||(d=Bn.onNav)==null||d.call(Bn,1)):r.key==="ArrowLeft"?(l(),t?i(t):(f=Bn.onNav)==null||f.call(Bn,-1)):r.key==="Escape"?(l(),t?i(t):Xe()):r.key==="Tab"&&(l(),Xe())});const i=r=>{var l;const o=(l=r.child)==null?void 0:l.el.dataset.for;cc(r);const a=[...r.el.querySelectorAll("button.has-sub")].find(c=>{var h;return((h=c.querySelector(".lb"))==null?void 0:h.textContent)===o});a==null||a.focus()};return e}function lc(s){let t=sn;for(;t;){if(t.el===s)return t;t=t.child}return null}function cc(s){let t=s.child;for(;t;)t.el.remove(),t=t.child;s.child=null}function Ed(s,t,e,n=t){if(!Ji)throw new Error("menu host not set");s.style.left="0px",s.style.top="0px",Ji.append(s);const i=Ji.getBoundingClientRect(),r=s.offsetWidth,o=s.offsetHeight;let a=t-i.left,l=e-i.top;return a+r>i.width-2&&(a=Math.max(2,n-i.left-r)),l+o>i.height-32&&(l=Math.max(2,i.height-32-o)),s.style.left=`${Math.round(a)}px`,s.style.top=`${Math.round(l)}px`,s}function ji(s,t,e,n={}){Xe();const i=document.activeElement instanceof HTMLElement&&document.activeElement!==document.body?document.activeElement:null,r=wd(s,null);if(r.tabIndex=-1,sn={el:r,child:null},Bn={...n,returnTo:n.returnTo??i},Ed(r,t,e),n.takeFocus===!1)return;const o=r.querySelector("button:not([aria-disabled])");(n.focusFirst??Do())&&o?o.focus({preventScroll:!0}):r.focus({preventScroll:!0})}function Td(s,t,e={}){const n=t.getBoundingClientRect();if(ji(s,n.right-2,n.top-3,{returnTo:t,onNav:i=>i<0&&Xe(),...e}),sn){const i=Ji==null?void 0:Ji.getBoundingClientRect();i&&n.right+sn.el.offsetWidth>i.right&&(sn.el.style.left=`${Math.max(2,n.left-i.left-sn.el.offsetWidth+2)}px`)}}function Xy(s,t){s.addEventListener("contextmenu",e=>{const n=e.target;if(n.closest("input, textarea, [contenteditable], .oikos-tube"))return;const i=t(n,e);if(i!==null){if(e.preventDefault(),!i.length){Xe();return}ji(i,e.clientX,e.clientY,{owner:n})}})}function V(s,t={},e=[]){const n=document.createElement(s);for(const[i,r]of Object.entries(t))i==="html"?n.innerHTML=r:n.setAttribute(i,r);for(const i of e)n.append(i);return n}function hc(s){const t=V("div",{class:"xp-menubar",role:"menubar"});let e=null;const n=[],i=Object.keys(s),r=(o,a,l=!0)=>{var f;const c=n[o],h=i[o];if(!c||h===void 0)return;const u=(f=s[h])==null?void 0:f.call(s);if(!u)return;const d=c.getBoundingClientRect();ji(u,d.left,d.bottom,{onClose:()=>{c.classList.remove("open"),c.setAttribute("aria-expanded","false"),e===c&&(e=null)},focusFirst:a,takeFocus:l,returnTo:c,owner:c,onNav:p=>{var m;const v=(o+p+n.length)%n.length;(m=n[v])==null||m.focus({preventScroll:!0}),r(v,!0)}}),c.classList.add("open"),c.setAttribute("aria-expanded","true"),e=c};return i.forEach((o,a)=>{const l=V("button",{type:"button",class:"xp-menutitle",role:"menuitem","aria-haspopup":"menu","aria-expanded":"false","data-menu-owner":""},[o]);a>0&&(l.tabIndex=-1),l.addEventListener("click",()=>{e===l?Xe():r(a,!1)}),l.addEventListener("pointerenter",()=>{e&&e!==l&&ac()&&(l.focus({preventScroll:!0}),r(a,!1))}),l.addEventListener("keydown",c=>{var h;if(c.key==="ArrowDown"||c.key==="Enter"||c.key===" ")c.preventDefault(),c.stopPropagation(),r(a,!0);else if(c.key==="ArrowRight"||c.key==="ArrowLeft"){c.preventDefault(),c.stopPropagation();const u=(a+(c.key==="ArrowRight"?1:-1)+n.length)%n.length;(h=n[u])==null||h.focus()}}),n.push(l),t.append(l)}),t.append(V("span",{class:"xp-throbber","aria-hidden":"true",html:Lo(18,!0)})),t}function Ad(s){const t=V("div",{class:"xp-toolbar"}),e=(o,a,l,c=!0)=>{const h=V("button",{class:"xp-tb",type:"button",title:a,html:`${o}${c?`<span>${a}</span>`:""}`});return l?h.addEventListener("click",l):h.disabled=!0,t.append(h),h},n=e(Ly(),"Back",s.back),i=e(Dy(),"Forward",s.forward,!1);e(Iy(),"Up",s.up,!1),t.append(V("span",{class:"xp-tb-sep"})),e(Uy(),"Search",s.search),e(Ny(),"Folders",s.folders);const r=()=>{if(!s.can)return;const o=s.can();n.disabled=!s.back||!o.back,i.disabled=!s.forward||!o.forward};return r(),{el:t,refresh:r}}function Cd(s,t,e,n){const i=V("div",{class:"xp-address"});i.append(V("span",{class:"lbl"},["Address"]));const r=V("label",{class:"field",html:s});let o=null;e?(o=V("input",{type:"text",value:t,"aria-label":"Address",spellcheck:"false"}),o.style.cssText="flex:1;min-width:0;border:0;outline:0;font:inherit;background:transparent;",r.append(o),o.addEventListener("keydown",l=>{l.key==="Enter"&&o&&(n==null||n(o.value)),l.key!=="Tab"&&l.stopPropagation()})):r.append(V("span",{},[t])),i.append(r);const a=V("button",{class:"go",type:"button",html:`${ky()}<span>Go</span>`});return a.addEventListener("click",()=>n==null?void 0:n((o==null?void 0:o.value)??t)),i.append(a),{el:i,input:o}}function Ws(s,t,e=!1){const n=V("section",{class:`xp-taskgroup${e?" primary":""}`}),i=V("header"),r=V("button",{type:"button",class:"xp-taskgroup-toggle","aria-expanded":"true"},[s]);i.append(r);const o=()=>{n.classList.toggle("collapsed"),r.setAttribute("aria-expanded",String(!n.classList.contains("collapsed")))};i.addEventListener("click",o),n.append(i);const a=V("div",{class:"xp-taskbody"});if(t instanceof HTMLElement)a.append(t);else{const l=V("ul");for(const c of t){const h=V("li");let u;if(c.href)u=V("a",{class:"xp-link",href:c.href,html:`${c.icon}<span></span>`}),c.external&&(u.setAttribute("target","_blank"),u.setAttribute("rel","noopener"));else{u=V("button",{class:"xp-link",type:"button",html:`${c.icon}<span></span>`});const f=c.run;f?u.addEventListener("click",f):u.setAttribute("aria-disabled","true")}const d=u.querySelector("span");d&&(d.textContent=c.label),h.append(u),l.append(h)}a.append(l)}return n.append(a),n}function Rd(){const s=V("div",{class:"xp-statusbar",role:"status"}),t=V("span"),e=V("span",{class:"zone"});return s.append(t,e),{el:s,set(n,i){t.textContent=n;const[r,o]=i==="computer"?[ud(),"My Computer"]:[dd(),"Internet"];e.innerHTML=`${r}<span>${o}</span>`}}}const Yy={dreams:["chronicle","dreams-api","dream_gen"],chronicle:["dreams","dream_gen"],"dreams-api":["dreams","chronicle"],dream_gen:["dreams","chronicle"],transmissions:["irc","syrinx"],apeiron:["dreams","syrinx"],syrinx:["apeiron","afterlife"],afterlife:["syrinx","apeiron"],irc:["transmissions","parlor"],parlor:["irc","transmissions"]};function Pd(s){return/^https?:/.test(s.href)?s.href:`${location.origin}${s.href}`}function Ld(s){return s.group==="here"?"computer":"internet"}function uc(s,t){var i;const e=Pd(t),n=(i=navigator.clipboard)==null?void 0:i.writeText(e);if(!n){s.balloon("Could not copy",e);return}n.then(()=>s.balloon("Copied",e),()=>s.balloon("Could not copy",e))}function Io(s,t,e=!1){const n=[];return e?n.push({label:`Open ${t.title}`,bold:!0,run:()=>s.open(t)}):(n.push({label:"Play",bold:!0,run:()=>s.play(t.id)}),n.push({label:`Go to ${t.title}`,run:()=>s.open(t)})),n.push({label:"Look at its screen",run:()=>s.look(t.id),disabled:!s.canTune}),t.tune&&n.push({label:"Watch it here",run:()=>s.tuneIn(t.id),disabled:!s.canTune}),t.id==="irc"&&n.push({label:"Join in mIRC",run:()=>s.chat("#aethera")}),n.push("sep",{label:"Copy Address",run:()=>uc(s,t)}),e||n.push("sep",{label:"Properties",run:()=>s.play(t.id)}),n}function Dd(s,t){return[{label:"Undo",shortcut:"Ctrl+Z",disabled:!0},"sep",{label:"Cut",shortcut:"Ctrl+X",disabled:!0},{label:"Copy",shortcut:"Ctrl+C",disabled:!t,run:()=>t&&uc(s,t)},{label:"Paste",shortcut:"Ctrl+V",disabled:!0},"sep",{label:"Select All",shortcut:"Ctrl+A",disabled:!0},{label:"Invert Selection",disabled:!0}]}function Id(s){return[{label:"Add to Favorites...",disabled:!0},{label:"Organize Favorites...",disabled:!0},"sep",...s.dir.sites.filter(t=>t.group==="here").map(t=>({label:t.title,icon:Cn(t.accent),run:()=>s.play(t.id)}))]}function Ud(){return[{label:"Map Network Drive...",disabled:!0},{label:"Disconnect Network Drive...",disabled:!0},{label:"Synchronize...",disabled:!0},"sep",{label:"Folder Options...",disabled:!0}]}function Nd(s){return[{label:"Help and Support Center",disabled:!0},"sep",{label:"About æthera",run:()=>s.about()}]}function dc(s){s.hidden=!s.hidden}function kd(s,t){return[{label:"Toolbars",submenu:()=>[{label:"Standard Buttons",checked:!t.toolbar.hidden,run:()=>dc(t.toolbar)},{label:"Address Bar",checked:!t.address.hidden,run:()=>dc(t.address)}]},{label:"Status Bar",checked:!t.status.hidden,run:()=>dc(t.status)},...t.views?["sep",...t.views]:[],"sep",{label:"Go To",submenu:()=>[{label:"Back",shortcut:"Alt+Left",disabled:!s.canBack,run:()=>s.back()},{label:"Forward",shortcut:"Alt+Right",disabled:!s.canForward,run:()=>s.forward()},{label:"Up One Level",disabled:!t.up,run:()=>{var e;return(e=t.up)==null?void 0:e.call(t)}},"sep",{label:"Home Page",shortcut:"Alt+Home",run:()=>s.home()}]},{label:"Refresh",shortcut:"F5",run:()=>t.refresh()}]}class qy{constructor(t,e){A(this,"win",null);A(this,"selected",null);A(this,"tiles",new Map);A(this,"tasks",null);A(this,"status",null);A(this,"content",null);A(this,"view","tiles");this.shell=t,this.wm=e}get isOpen(){return!!this.win&&!this.win.closed}open(){var u;if(this.isOpen&&this.win){this.win.minimized?this.win.restore():this.win.focus();return}this.tiles.clear();const t=V("div");t.style.cssText="display:flex;flex-direction:column;min-height:0;flex:1;";const{dir:e}=this.shell,n=Ad({back:()=>this.shell.back(),forward:()=>this.shell.forward(),can:()=>({back:this.shell.canBack,forward:this.shell.canForward}),search:()=>{var d;return(d=i.input)==null?void 0:d.focus()},folders:()=>{var d;return(d=this.tasks)==null?void 0:d.toggleAttribute("hidden")}}),i=Cd(br(),"~/æthera",!0,d=>this.go(d));(u=i.input)==null||u.addEventListener("input",()=>{var d;return this.filter(((d=i.input)==null?void 0:d.value)??"")}),this.status=Rd();const r=()=>this.selected?this.shell.site(this.selected)??null:null;t.append(hc({File:()=>this.fileMenu(),Edit:()=>Dd(this.shell,r()),View:()=>{var d;return kd(this.shell,{toolbar:n.el,address:i.el,status:((d=this.status)==null?void 0:d.el)??V("div"),views:this.viewItems(),refresh:()=>{i.input&&(i.input.value="~/æthera"),this.filter("")}})},Favorites:()=>Id(this.shell),Tools:()=>Ud(),Help:()=>Nd(this.shell)}),n.el,i.el);const o=this.shell.onNav(()=>n.refresh()),a=V("div",{class:"xp-body"});this.tasks=V("aside",{class:"xp-tasks"}),a.append(this.tasks);const l=V("div",{class:`xp-content view-${this.view}`,role:"region","aria-label":"tapes"});this.content=l,l.addEventListener("pointerdown",d=>{d.button===0&&!d.target.closest(".xp-tile")&&this.select(null)});let c=0;const h=(d,f)=>{if(!f.length)return;const p=`xp-group-${++c}`;l.append(V("h3",{class:"xp-group-head",id:p},[d]));const v=V("div",{class:"xp-tiles",role:"listbox","aria-labelledby":p});for(const m of f)v.append(this.tile(m));l.append(v)};if(h("Tapes Stored on This Server",e.sites.filter(d=>d.group==="here")),h("Other Places on the Wired",e.sites.filter(d=>d.group==="wired")),e.files.length){l.append(V("h3",{class:"xp-group-head"},["Files"]));const d=V("div",{class:"xp-tiles"});for(const f of e.files){const p=f.title.split(".").pop()??"txt",v=V("a",{class:"xp-tile",href:f.href,html:`${Gs(p)}<span><span class="t"></span><span class="k"></span></span>`});v.querySelector(".t").textContent=f.title,v.querySelector(".k").textContent=f.about,d.append(v)}l.append(d)}a.append(l),t.append(a),t.append(this.status.el),this.win=this.wm.open({id:"home",title:"~  (home directory)",icon:br(),body:t,width:Math.round(Math.min(680,Math.max(420,innerWidth*.46))),dock:"left",onClose:()=>{o(),this.win=null,this.content=null,this.tasks=null,this.status=null,this.tiles.clear(),this.selected=null}}),this.win.el.style.height="min(560px, calc(100% - 40px))",this.renderTasks(),this.renderStatus()}close(){var t;(t=this.win)==null||t.close()}focusTiles(){var n;if(!this.isOpen||(n=this.win)!=null&&n.minimized)return;const t=this.selected?this.tiles.get(this.selected):void 0,e=t&&!t.hidden?t:[...this.tiles.values()].find(i=>!i.hidden);e==null||e.focus({preventScroll:!0})}fileMenu(){const t=this.selected?this.shell.site(this.selected):void 0;return[...t?Io(this.shell,t):[{label:"Play",bold:!0,disabled:!0}],"sep",{label:"New",disabled:!0,submenu:()=>[]},"sep",{label:"Create Shortcut",disabled:!0},{label:"Delete",disabled:!0},{label:"Rename",disabled:!0},"sep",{label:"Close",run:()=>this.close()}]}viewItems(){const t=e=>()=>{this.view=e,this.content&&(this.content.className=`xp-content view-${e}`)};return[{label:"Tiles",checked:this.view==="tiles",run:t("tiles")},{label:"Icons",checked:this.view==="icons",run:t("icons")},{label:"List",checked:this.view==="list",run:t("list")}]}contextFor(t){const e=this.shell.site(t);return e?(this.select(t,!0),Io(this.shell,e)):null}blankMenu(){return[{label:"View",submenu:()=>this.viewItems()},{label:"Arrange Icons By",disabled:!0,submenu:()=>[]},"sep",{label:"Refresh",run:()=>this.filter("")},"sep",{label:"Paste",disabled:!0},{label:"Paste Shortcut",disabled:!0},"sep",{label:"New",disabled:!0,submenu:()=>[]},"sep",{label:"Properties",disabled:!0}]}tile(t){const e=V("button",{class:"xp-tile",type:"button",role:"option","data-id":t.id,html:`${Cn(t.accent,t.title)}<span><span class="t"></span><span class="k"></span><span class="d"></span></span>`});e.querySelector(".t").textContent=t.title,e.querySelector(".k").textContent=t.kind,e.querySelector(".d").textContent=t.tagline,e.title=t.tagline,e.setAttribute("aria-selected","false");let n=!1;return e.addEventListener("pointerdown",i=>n=i.pointerType==="touch"),e.addEventListener("click",()=>{if(n&&this.selected===t.id&&e.dataset.armed){delete e.dataset.armed,this.shell.play(t.id);return}this.select(t.id,!0),n&&(e.dataset.armed="1")}),e.addEventListener("dblclick",()=>this.shell.play(t.id)),e.addEventListener("keydown",i=>{if(i.key==="Enter"&&this.shell.play(t.id),["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(i.key)){i.preventDefault(),i.stopPropagation();const r=[...this.tiles.values()].filter(l=>!l.hidden),o=r.indexOf(e),a=r[(o+(i.key==="ArrowRight"||i.key==="ArrowDown"?1:-1)+r.length)%r.length];a==null||a.focus(),a!=null&&a.dataset.id&&this.select(a.dataset.id,!0)}}),this.tiles.set(t.id,e),e}select(t,e=!1){if(t!==this.selected){this.selected=t;for(const[n,i]of this.tiles)i.classList.toggle("selected",n===t),i.setAttribute("aria-selected",String(n===t)),n!==t&&delete i.dataset.armed;e&&this.shell.select(t),this.renderTasks(),this.renderStatus()}}filter(t){const e=t.replace(/^~\/?(æthera)?\/?/i,"").trim().toLowerCase();for(const[n,i]of this.tiles){const r=this.shell.site(n);i.hidden=!!e&&!`${r==null?void 0:r.title} ${r==null?void 0:r.kind} ${r==null?void 0:r.tagline}`.toLowerCase().includes(e)}}go(t){const e=t.replace(/^~\/?(æthera)?\/?/i,"").trim().toLowerCase();if(!e)return;const n=this.shell.dir.sites.find(i=>i.title.toLowerCase()===e)??this.shell.dir.sites.find(i=>`${i.title} ${i.kind} ${i.tagline}`.toLowerCase().includes(e));n?this.shell.play(n.id):this.shell.balloon("Cannot find it",`There is no tape called “${t}” in ~.`)}renderTasks(){if(!this.tasks)return;const t=this.selected?this.shell.site(this.selected):void 0,e=t?[{icon:rc(),label:"Play this tape",run:()=>this.shell.play(t.id)},{icon:md(),label:"Look at its screen",run:()=>this.shell.look(t.id)},{icon:dd(),label:`Go to ${t.title}`,run:()=>this.shell.open(t)}]:[{icon:rc(),label:"Select a tape to play it"},{icon:gd(),label:"Eject the tape",run:()=>this.shell.eject()}],n=[{icon:ud(),label:"æthera",href:"/"},{icon:Gs("xml"),label:"feed.xml",href:"/feed.xml"},{icon:Gs("txt"),label:"llms.txt",href:"/llms.txt"}],i=V("div",{class:"xp-details"});if(t){i.append(V("b",{},[t.title]));const r=V("dl");for(const[o,a]of t.details)r.append(V("dt",{},[o]),V("dd",{},[a]));i.append(r)}else{const r=this.shell.dir.sites.filter(o=>o.group==="here").length;i.append(V("b",{},["~"]),V("span",{},[`home directory · ${r} tapes here, ${this.shell.dir.sites.length-r} elsewhere on the Wired`]))}this.tasks.replaceChildren(Ws(t?"Tape Tasks":"System Tasks",e,!0),Ws("Other Places",n),Ws("Details",i))}renderStatus(){var n;const t=this.selected?this.shell.site(this.selected):void 0,e=this.shell.dir.sites.length+this.shell.dir.files.length;(n=this.status)==null||n.set(t?`${t.title} — ${t.tagline}`:`${e} objects`,t?Ld(t):"computer")}}const Ky=4001,Zy=4002,Jy=s=>s>=4e3&&s<5e3,jy=4;class Qy{constructor(t,e,n){A(this,"ws",null);A(this,"tries",0);A(this,"timer",0);A(this,"wanted",!1);A(this,"welcomed",!1);A(this,"refused",!1);this.nick=t,this.password=e,this.on=n}get open(){var t;return this.welcomed&&((t=this.ws)==null?void 0:t.readyState)===WebSocket.OPEN}connect(){this.wanted=!0,this.refused=!1,clearTimeout(this.timer);const t=location.protocol==="https:"?"wss":"ws";let e;try{e=new WebSocket(`${t}://${location.host}/ws/chat`)}catch{this.on.closed(!1,!1,!1);return}this.ws=e,this.welcomed=!1,e.onopen=()=>{e.send(JSON.stringify({type:"hello",nick:this.nick,password:this.password||null}))},e.onmessage=n=>{let i;try{i=JSON.parse(String(n.data))}catch{return}switch(i.type){case"welcome":{const r=i;this.welcomed=!0,this.tries=0,this.nick=r.nick,this.on.welcome(r);break}case"event":{const r=i.event;if(!r)break;r.kind==="nick"&&r.nick===this.nick&&r.target&&(this.nick=r.target),this.on.event(r);break}case"whois":this.on.whois(i);break;case"error":{this.welcomed||(this.refused=!0),this.on.error(String(i.code??""),String(i.text??""));break}}},e.onclose=n=>{if(this.ws!==e)return;this.ws=null;const i=n.code===Ky,r=n.code===Zy,o=this.wanted&&!Jy(n.code)&&!this.refused&&this.tries<jy;if(this.welcomed=!1,this.on.closed(o,i,r),!o){this.wanted=!1;return}this.tries++,this.timer=window.setTimeout(()=>this.connect(),2e3*2**(this.tries-1))}}send(t){if(!this.open||!this.ws)return!1;try{return this.ws.send(JSON.stringify(t)),!0}catch{return!1}}part(t="Leaving"){if(this.open&&this.ws)try{this.ws.send(JSON.stringify({type:"part",reason:t}))}catch{}this.close()}close(){this.wanted=!1,clearTimeout(this.timer);const t=this.ws;if(this.ws=null,this.welcomed=!1,this.password=null,t){t.onclose=null;try{t.close()}catch{}}}}const zt="#aethera",Lt="#oikos",zn="irc.aetherawi.red",fc=6667,pc="guest",Fd="always falling apart",tM=600,eM=6e3,Od="oikos-mirc-nick",nM=/^[A-Za-z[\]\\`_^{|}][A-Za-z0-9[\]\\`_^{|}-]{0,15}$/,mc=["~","&","@","%","+"];function iM(s){const t=new Date(s);return`[${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}]`}function sM(s){return Date.now()-(performance.now()-s)}function gc(s){const t=oi(s)||"anon",e=Ko(t),n=["dialup.wired.net","cable.aether.org","dsl.lain.jp","adsl.nowhere.nu","res.navi.co"],i=n[Math.floor(e*n.length)]??n[0],r=Math.floor(e*251)+2,o=Math.floor(Ko(`${t}.`)*251)+2;return`~${t.slice(0,9).toLowerCase()}@ppp-${r}-${o}.${i}`}function oi(s){return s.replace(/^[~&@%+]+/,"")}function Bd(s){const t=s.charAt(0);return mc.includes(t)?t:""}function rM(){try{return localStorage.getItem(Od)??""}catch{return""}}function zd(s){try{localStorage.setItem(Od,s)}catch{}}function xc(s){s.addEventListener("keydown",t=>{t.key!=="Escape"&&t.key!=="Tab"&&t.stopPropagation()})}class vc{constructor(t,e,n){A(this,"tab");A(this,"pane");A(this,"log");A(this,"nicksEl");A(this,"nicks",new Map);A(this,"topic","");A(this,"joined",!1);this.id=t;const i=`mirc-pane-${t==="status"?"status":t.slice(1)}`;this.tab=V("button",{type:"button",role:"tab","aria-controls":i,html:`${e}<span></span>`}),this.tab.querySelector("span").textContent=t==="status"?"Status":t,this.log=V("div",{class:"mirc-log",role:"log","aria-label":t==="status"?"Status":t}),n?(this.log.setAttribute("aria-live","polite"),this.nicksEl=V("ul",{class:"mirc-nicks","aria-label":`Nicknames in ${t}`}),this.pane=V("div",{class:"mirc-pane",id:i,role:"tabpanel"},[V("div",{class:"mirc-split"},[this.log,this.nicksEl])])):(this.nicksEl=null,this.pane=V("div",{class:"mirc-pane",id:i,role:"tabpanel"},[this.log]))}setNick(t,e=Bd(t)){const n=oi(t);n&&this.nicks.set(n.toLowerCase(),{name:n,mode:e})}seen(t){const e=oi(t);if(!e)return!1;const n=e.toLowerCase(),i=this.nicks.get(n),r=Bd(t)||(i==null?void 0:i.mode)||"";return i&&i.mode===r&&i.name===e?!1:(this.nicks.set(n,{name:e,mode:r}),!0)}drop(t){return this.nicks.delete(oi(t).toLowerCase())}rename(t,e){const n=this.nicks.get(oi(t).toLowerCase());this.drop(t),this.setNick(e,(n==null?void 0:n.mode)??"")}render(){if(!this.nicksEl)return;const t=n=>n?mc.indexOf(n):mc.length,e=[...this.nicks.values()].sort((n,i)=>t(n.mode)-t(i.mode)||n.name.localeCompare(i.name,void 0,{sensitivity:"base"}));this.nicksEl.replaceChildren(...e.map(n=>V("li",{title:`${n.mode}${n.name}`},[`${n.mode}${n.name}`])))}}class oM{constructor(t,e,n){A(this,"win");A(this,"wins");A(this,"view",zt);A(this,"input");A(this,"me",pc);A(this,"link",null);A(this,"hintedOikos",!1);A(this,"livingSeenAt",0);A(this,"livingOnce",!1);A(this,"greeted",!1);A(this,"hung",!1);A(this,"lastAt",-1);A(this,"seenFragments");A(this,"seenCollapse",null);A(this,"wasConnected",!1);A(this,"rejoinTimer",0);A(this,"off");var c;this.shell=t,this.wm=e;const i=V("div",{class:"mirc"});i.append(hc({File:()=>[{label:"Connect...",run:()=>this.joinLiving(),disabled:!!this.link},{label:"Disconnect",run:()=>this.partLiving(),disabled:!this.link},"sep",{label:"Select Server...",disabled:!0},"sep",{label:"Exit",run:()=>this.win.close()}],Tools:()=>[{label:"Address Book...",disabled:!0},{label:"Options...",shortcut:"Alt+O",disabled:!0}],Commands:()=>[{label:`Join ${Lt}`,run:()=>this.joinLiving()},{label:`Part ${Lt}`,run:()=>this.partLiving(),disabled:!this.link},"sep",{label:"Clear buffer",run:()=>this.wins[this.view].log.replaceChildren()}],Window:()=>["status",zt,Lt].filter(h=>!this.wins[h].tab.hidden).map(h=>({label:h==="status"?"Status":h,checked:this.view===h,run:()=>this.show(h)})),Help:()=>[{label:"Commands",shortcut:"F1",run:()=>this.help()},"sep",{label:"About æthera",run:()=>this.shell.about()}]}));const r=V("div",{class:"mirc-switch",role:"tablist"});this.wins={status:new vc("status",Ci("status"),!1),[zt]:new vc(zt,Ci("channel"),!0),[Lt]:new vc(Lt,Ci("channel"),!0)},this.wins[zt].topic=Fd,this.wins[Lt].tab.hidden=!0;const o=V("div",{class:"mirc-mdi"});for(const h of Object.values(this.wins))h.tab.addEventListener("click",()=>this.show(h.id)),r.append(h.tab),o.append(h.pane);this.input=V("input",{class:"mirc-input",type:"text",spellcheck:"false",autocomplete:"off",maxlength:"400","aria-label":"Message"}),xc(this.input),this.input.addEventListener("keydown",h=>{if(h.key!=="Enter")return;h.preventDefault();const u=this.input.value;this.input.value="",this.say(u)}),i.append(r,o,this.input),this.win=e.open({id:"mirc",title:"mIRC",icon:Ci("app"),body:i,width:Math.round(Math.min(760,Math.max(460,innerWidth*.52))),dock:"center",onClose:()=>{var h,u;clearTimeout(this.rejoinTimer),this.off(),(h=this.link)==null||h.part("Leaving"),this.link=null,(u=this.wm.get("mirc-connect"))==null||u.close(),n()},onFocus:()=>{Vs()||this.input.focus({preventScroll:!0})}}),this.win.el.classList.add("mirc-window"),this.win.el.style.height="min(540px, calc(100% - 24px))";const a=this.win.el.parentElement;if(a){const h=this.win.el.offsetTop+this.win.el.offsetHeight-(a.clientHeight-8);h>0&&this.win.moveTo(this.win.el.offsetLeft,this.win.el.offsetTop-h)}const l=this.shell.feeds.irc.value;this.seenFragments=l.fragments,this.seenCollapse=((c=l.collapse)==null?void 0:c.at)??null,this.show(zt),l.connected?this.connect(l):this.push("status","info",`* Connecting to ${zn} (${fc})`),this.off=this.shell.feeds.irc.on(h=>this.update(h))}focus(t){this.win.minimized?this.win.restore():this.win.focus();const e=t===zt||t===Lt||t==="status"?this.wins[t]:null;e&&!e.tab.hidden&&this.show(e.id)}update(t){var n;if(t.connected&&!this.wasConnected?this.connect(t):!t.connected&&this.wasConnected&&this.disconnect(),!t.connected)return;for(const i of t.lines)i.at<=this.lastAt||(this.rejoinTimer&&this.rejoin(),this.lastAt=i.at,this.line(i));const e=((n=t.collapse)==null?void 0:n.at)??null;e!==null&&e!==this.seenCollapse&&t.collapse&&this.collapse(t.collapse.type),this.seenCollapse=e,t.fragments!==this.seenFragments&&(this.seenFragments=t.fragments,clearTimeout(this.rejoinTimer),this.hung?this.rejoinTimer=window.setTimeout(()=>this.rejoin(),eM):this.rejoin())}connect(t){this.wasConnected=!0;const e=(i,r)=>this.push("status",i,r);if(this.greeted){e("info",`* Reconnected to ${zn}`),this.joinHaunted(),t.collapse&&this.collapse(t.collapse.type);return}this.greeted=!0,e("info",`* Connecting to ${zn} (${fc})`),e("notice",`-${zn}- *** Looking up your hostname...`),e("notice",`-${zn}- *** Found your hostname`),e("text",`Welcome to the æthera IRC Network ${this.me}!${this.me}@oikos`),e("text",`Your host is ${zn}, running version hauntd-2.8.21`),e("text",`- ${zn} Message of the Day -`),e("text","- nobody here is who they were."),e("text","- every line is a replay; every replay is live."),e("text",`- ${zt} is moderated: the living listen.`),e("text",`- the living talk in ${Lt}. /join ${Lt}`),e("text","End of /MOTD command."),e("mode",`* ${this.me} sets mode: +i`),this.joinHaunted();const n=t.lines.filter(i=>i.at>this.lastAt);if(n.length){this.push(zt,"info","*** Buffer Playback...");for(const i of n)this.line(i);this.push(zt,"info","*** Playback Complete.")}this.lastAt=Math.max(this.lastAt,...t.lines.map(i=>i.at)),t.collapse&&this.collapse(t.collapse.type)}joinHaunted(){const t=this.wins[zt];t.joined=!0,t.nicks.clear(),t.setNick(this.me,""),this.push(zt,"join",`* Now talking in ${zt}`),this.push(zt,"topic",`* Topic is '${t.topic}'`),this.push(zt,"topic","* Set by ChanServ"),this.nicksChanged(zt)}disconnect(){clearTimeout(this.rejoinTimer),this.rejoinTimer=0,this.wasConnected=!1;const t=this.wins[zt];t.joined=!1,this.setHung(!1),this.push("status","info",`* Disconnected from ${zt}`),this.push(zt,"info","* Disconnected"),t.nicks.clear(),this.nicksChanged(zt)}collapse(t){const e=t.replace(/_/g," ");this.push("status","notice",`-${zn}- *** Notice -- ${e} on ${zt}`),this.setHung(!0)}rejoin(){clearTimeout(this.rejoinTimer),this.rejoinTimer=0,this.setHung(!1),this.push(zt,"info",`* Attempting to rejoin channel ${zt}`),this.wins[zt].topic=Fd,this.joinHaunted()}line(t){const e=this.wins[zt],n=t.nick,i=oi(n),r=t.content,o=t.wallAt??sM(t.at),a=(c,h)=>this.push(zt,c,h,o);let l=!1;switch(t.type){case"message":l=e.seen(n),a("text",`<${n}> ${r}`);break;case"action":{const c=/^sets mode: ([+-])([a-z]+) (.+)$/i.exec(r);c?(e.seen(n),this.applyMode(c[1]??"+",c[2]??"",(c[3]??"").split(/\s+/)),l=!0,a("mode",`* ${n} ${r}`)):/^has quit\b/i.test(r)?(l=e.drop(n),a("quit",`* ${i} ${r.replace(/^has quit\b/i,"has quit IRC")}`)):(l=e.seen(n),a("action",`* ${n} ${r}`));break}case"join":l=e.seen(n),a("join",`* ${i} (${gc(n)}) has joined ${zt}`);break;case"part":l=e.drop(n),a("part",`* ${i} (${gc(n)}) has left ${zt}${r?` (${r})`:""}`);break;case"quit":l=e.drop(n),a("quit",`* ${i} (${gc(n)}) Quit (${r||"Client exited"})`);break;case"kick":{const c=t.reason||r;t.target?(l=e.drop(t.target),a("kick",`* ${oi(t.target)} was kicked by ${i}${c?` (${c})`:""}`)):a("kick",`* ${i} kicks${c?` (${c})`:""}`);break}default:{const c=/changes topic to '(.*)'$/i.exec(r);if(c){e.topic=c[1]??e.topic,a("topic",`* ${r}`),this.retitle();break}const h=r||n;a("info",/^[*<]/.test(h)||h.length<6?h:`* ${h}`)}}!e.nicks.has(this.me.toLowerCase())&&e.joined&&(e.setNick(this.me,""),l=!0),l&&this.nicksChanged(zt)}applyMode(t,e,n){const i=this.wins[zt],r={q:"~",a:"&",o:"@",h:"%",v:"+"};[...e].forEach((o,a)=>{const l=n[a],c=r[o];if(!l||!c)return;const h=i.nicks.get(oi(l).toLowerCase());i.setNick((h==null?void 0:h.name)??oi(l),t==="+"?c:(h==null?void 0:h.mode)===c?"":(h==null?void 0:h.mode)??"")})}joinLiving(){if(this.link&&this.wins[Lt].joined){this.show(Lt);return}if(this.link){this.push(this.view,"info",`* Still connecting to ${Lt}...`);return}this.connectDialog()}partLiving(){if(!this.link)return;this.link.part("Leaving"),this.link=null;const t=this.wins[Lt];t.joined=!1,t.nicks.clear(),this.nicksChanged(Lt),this.push(Lt,"part",`* You have left ${Lt}`),this.push("status","info",`* Disconnected from ${Lt}`),this.livingSeenAt=0,this.livingOnce=!1,this.renameMe(pc)}connectDialog(t){var h;(h=this.wm.get("mirc-connect"))==null||h.close();const e=V("form",{class:"mirc-connect"}),n=V("input",{type:"text",value:rM(),maxlength:"16",spellcheck:"false",autocomplete:"nickname",required:""}),i=V("input",{type:"password",maxlength:"256",autocomplete:"current-password"});xc(n),xc(i);const r=V("p",{class:"err",role:"alert"});r.textContent=t??"",r.hidden=!t,e.append(V("div",{class:"xp-dialog-body"},[V("span",{html:Ci("app")}),V("div",{},[V("p",{},[`Join ${Lt}, where the living talk.`]),V("label",{},["Nickname:",n]),V("label",{},["Password (optional):",i]),V("p",{class:"hint"},["A password gives you a tripcode, the same one your blog comments carry. It is never stored."]),r])]));const o=V("div",{class:"xp-actions"}),a=V("button",{class:"xp-btn default",type:"submit"},["Connect"]),l=V("button",{class:"xp-btn",type:"button"},["Cancel"]);o.append(a,l),e.append(o);const c=this.wm.open({id:"mirc-connect",title:"mIRC Connect",icon:Ci("app"),body:e,width:360,dialog:!0});l.addEventListener("click",()=>c.close()),e.addEventListener("keydown",u=>{u.key==="Escape"&&(u.preventDefault(),c.close(),this.input.focus({preventScroll:!0}))}),e.addEventListener("submit",u=>{u.preventDefault();const d=n.value.trim();if(!nM.test(d)){r.textContent="A nickname starts with a letter and has at most 16 letters, digits or - _ [ ] { } | ^ `",r.hidden=!1,n.focus();return}zd(d),c.close(),this.dial(d,i.value||null)}),n.focus(),n.select()}dial(t,e){this.push("status","info",`* Connecting to ${Lt} as ${t}${e?" (with a tripcode)":""}`);const n=new Qy(t,e,{welcome:i=>this.welcomed(i),event:i=>this.event(i),whois:i=>this.whoisReply(i),error:(i,r)=>this.chatError(i,r),closed:(i,r,o)=>this.dropped(i,r,o)});this.link=n,n.connect()}welcomed(t){const e=this.wins[Lt];e.tab.hidden=!1,e.joined=!0,e.topic=t.topic,e.nicks.clear();for(const r of t.names)e.setNick(r.nick,r.op?"@":"");this.renameMe(t.nick);const n=this.livingOnce;this.livingOnce=!0;const i=t.backlog.filter(r=>r.at>this.livingSeenAt);if(n?this.push(Lt,"join",`* Rejoined ${Lt}`):(this.push("status","text",`* You are now known as ${t.nick} (${t.mask})`),t.op&&this.push("status","mode",`* ${zn} sets mode: +o ${t.nick}`),this.push(Lt,"join",`* Now talking in ${Lt}`),this.push(Lt,"topic",`* Topic is '${t.topic}'`)),i.length){this.push(Lt,"info","*** Buffer Playback...");for(const r of i)this.event(r,!0);this.push(Lt,"info","*** Playback Complete.")}this.nicksChanged(Lt),n||this.show(Lt)}event(t,e=!1){const n=this.wins[Lt],i=(o,a)=>this.push(Lt,o,a,t.at),r=t.nick===this.me;switch(this.livingSeenAt=Math.max(this.livingSeenAt,t.at),t.kind){case"message":i(r?"own":"text",`<${t.nick}> ${t.text}`);return;case"action":i("action",`* ${t.nick} ${t.text}`);return;case"join":i("join",`* ${t.nick} (${t.mask??""}) has joined ${Lt}`),e||n.setNick(t.nick,"");break;case"part":i("part",`* ${t.nick} (${t.mask??""}) has left ${Lt}${t.text?` (${t.text})`:""}`),e||n.drop(t.nick);break;case"quit":i("quit",`* ${t.nick} (${t.mask??""}) Quit (${t.text||"Client exited"})`),e||n.drop(t.nick);break;case"kick":t.target===this.me&&!e?(i("kick",`* You were kicked from ${Lt} by ${t.nick} (${t.text})`),n.joined=!1,n.nicks.clear()):(i("kick",`* ${t.target??"?"} was kicked by ${t.nick} (${t.text})`),!e&&t.target&&n.drop(t.target));break;case"nick":r&&!e&&t.target?(i("text",`* Your nick is now ${t.target}`),this.renameMe(t.target),zd(t.target)):i("text",`* ${t.nick} is now known as ${t.target??"?"}`),!e&&t.target&&n.rename(t.nick,t.target);break;case"topic":i("topic",`* ${t.nick} changes topic to '${t.text}'`),e||(n.topic=t.text);break}e||this.nicksChanged(Lt)}whoisReply(t){const e=n=>this.push(this.view,"text",n);e(`${t.nick} is ${t.mask} * ${t.nick}`),t.trip&&e(`${t.nick} is identified by tripcode ${t.trip}`),t.op&&e(`${t.nick} is a channel operator on ${Lt}`),e(`${t.nick} signed on ${new Date(t.signon).toLocaleString()}`),e(`${t.nick} End of /WHOIS list.`)}chatError(t,e){var r;const n=this.wins[Lt],i=e.replace(/^(\S+) :/,"$1 ");this.push(n.joined?Lt:"status","error",`* ${i}`),!n.joined&&(t==="432"||t==="433")&&((r=this.link)==null||r.close(),this.link=null,this.livingOnce=!1,this.livingSeenAt=0,this.connectDialog(e.replace(/^\S+ :/,"")))}dropped(t,e,n){const i=this.wins[Lt],r=i.joined;i.joined=!1,i.nicks.clear(),this.nicksChanged(Lt),n?this.push(Lt,"info",`* ${this.me} is connected from somewhere else now (another window?); this one let go`):r&&!e&&this.push(Lt,"info",`* Disconnected${t?" (reconnecting...)":""}`),this.push("status","info",`* Disconnected from ${Lt}${t?" (reconnecting...)":""}`),t||(this.link=null,this.livingOnce=!1,this.livingSeenAt=0,this.renameMe(pc))}renameMe(t){if(t===this.me)return;const e=this.wins[zt];e.joined&&(e.rename(this.me,t),this.nicksChanged(zt)),this.me=t,this.retitle()}say(t){var a,l,c,h,u,d;const e=t.trim();if(!e)return;const n=this.view,i=n===Lt&&this.wins[Lt].joined&&!!this.link,r=f=>this.push(n,"error",`* ${f}`);if(e.startsWith("/")&&!e.startsWith("//")){const[f="",...p]=e.slice(1).split(/\s+/),v=p.join(" ");switch(f.toLowerCase()){case"help":this.help();return;case"clear":this.wins[n].log.replaceChildren();return;case"quit":case"exit":this.win.close();return;case"join":{const m=(p[0]??"").toLowerCase().replace(/^#?/,"#");m===Lt||m==="#"&&n==="status"?this.joinLiving():m===zt?(this.show(zt),this.push(zt,"error",`* You are already on ${zt}`)):r(`${p[0]??"#"} Cannot join channel (this network has ${zt} and ${Lt})`);return}case"part":case"leave":n===Lt&&this.link?this.partLiving():r(n===zt?`${zt} will not let you go`:"You are not on a channel");return;case"nick":p[0]?(a=this.link)!=null&&a.send({type:"nick",nick:p[0]})||r(`Join ${Lt} first to have a name (/join ${Lt})`):r("Usage: /nick <newnick>");return;case"whois":p[0]?(l=this.link)!=null&&l.send({type:"whois",nick:p[0]})||r(`${p[0]} :No such nick`):r("Usage: /whois <nick>");return;case"me":if(!v)return;i?(c=this.link)==null||c.send({type:"say",text:v,action:!0}):n===zt?this.refused(`* ${this.me} ${v}`,"action"):r("You are not on a channel");return;case"topic":i&&v?(h=this.link)==null||h.send({type:"topic",text:v}):i?this.push(Lt,"topic",`* Topic is '${this.wins[Lt].topic}'`):r(`${n==="status"?"":`${n} `}You're not channel operator`);return;case"kick":i&&p[0]?(u=this.link)==null||u.send({type:"kick",nick:p[0],reason:p.slice(1).join(" ")}):r(i?"Usage: /kick <nick> [reason]":"You're not channel operator");return;default:r(`${f.toUpperCase()} Unknown command`);return}}const o=e.startsWith("//")?e.slice(1):e;i?(d=this.link)!=null&&d.send({type:"say",text:o})||r("Not connected"):n===zt&&this.wins[zt].joined?this.refused(`<${this.me}> ${o}`,"own"):r("You are not on a channel")}refused(t,e){this.push(zt,e,t),this.push(zt,"error",`* ${zt} Cannot send to channel`),this.hintedOikos||(this.hintedOikos=!0,this.push(zt,"info",`* (the living talk in ${Lt}: /join ${Lt})`))}help(){const t=e=>this.push(this.view,"info",e);t("* Commands:"),t(`*   /join ${Lt}           join the living (a nick, and a password for a tripcode if you like)`),t("*   /nick <name>           change your nick"),t("*   /me <does something>   an action"),t("*   /whois <nick>          who someone is (their tripcode, if they have one)"),t(`*   /part                  leave ${Lt}`),t("*   /topic, /kick          for channel operators"),t("*   /clear  /quit")}push(t,e,n,i=Date.now()){var c;const r=this.wins[t],o=r.log,a=o.scrollHeight-o.scrollTop-o.clientHeight<24,l=V("div",{class:`mirc-row t-${e}`});for(l.append(V("span",{class:"ts"},[iM(i)]),` ${n}`),o.append(l);o.childElementCount>tM;)(c=o.firstElementChild)==null||c.remove();a&&(o.scrollTop=o.scrollHeight),t!==this.view&&(t!=="status"&&(e==="text"||e==="action"||e==="own")?r.tab.classList.add("said"):r.tab.classList.contains("said")||r.tab.classList.add("event"))}show(t){this.view=t;for(const n of Object.values(this.wins)){const i=n.id===t;n.pane.hidden=!i,n.tab.classList.toggle("on",i),n.tab.setAttribute("aria-selected",String(i)),i&&n.tab.classList.remove("said","event")}const e=this.wins[t].log;e.scrollTop=e.scrollHeight,this.input.setAttribute("aria-label",t==="status"?"Command":`Message ${t}`),this.retitle()}nicksChanged(t){this.wins[t].render(),this.retitle()}setHung(t){this.hung!==t&&(this.hung=t,this.win.el.classList.toggle("mirc-hung",t),this.retitle())}retitle(){const t=this.wins[this.view],e=t.id===zt?"+mnt":"+nt",n=t.id==="status"?`mIRC - [Status: ${this.me} on ${zn} (${fc})]`:t.joined?`mIRC - [${t.id} [${t.nicks.size}] [${e}]: ${t.topic}]`:`mIRC - [${t.id} (not on channel)]`;this.win.setTitle(this.hung?`${n} (Not Responding)`:n)}}class aM{constructor(t,e,n,i){A(this,"win");A(this,"statusLine");A(this,"timer",0);this.site=t,this.shell=e;const r=V("div");r.style.cssText="display:flex;flex-direction:column;min-height:0;flex:1;";const o=Ad({back:()=>this.shell.back(),forward:()=>this.shell.forward(),can:()=>({back:this.shell.canBack,forward:this.shell.canForward}),up:()=>this.shell.home(),folders:()=>d.toggleAttribute("hidden")}),a=Pd(t),l=Cd(Cn(t.accent),a,!1,()=>this.shell.open(t)).el,c=Rd();r.append(hc({File:()=>[...Io(this.shell,t,!0),"sep",{label:"Properties",disabled:!0},"sep",{label:"Close",run:()=>this.win.close()}],Edit:()=>Dd(this.shell,t),View:()=>kd(this.shell,{toolbar:o.el,address:l,status:c.el,up:()=>this.shell.home(),refresh:()=>this.refresh()}),Favorites:()=>Id(this.shell),Tools:()=>Ud(),Help:()=>Nd(this.shell)}),o.el,l);const h=this.shell.onNav(()=>o.refresh()),u=V("div",{class:"xp-body"}),d=V("aside",{class:"xp-tasks"});u.append(d);const f=V("div",{class:"xp-content"});u.append(f),r.append(u),c.set("Done",Ld(t)),r.append(c.el);const p=V("div",{class:"xp-hero",html:Cn(t.accent,t.title)}),v=V("div");v.append(V("h2",{},[t.title]),V("p",{},[t.tagline])),p.append(v),f.append(p);const m=V("button",{class:"xp-preview",type:"button","aria-label":`Open ${t.title}`}),g=this.shell.screens.get(t.id);g&&m.append(g.canvas),m.append(V("span",{class:"xp-play"},[`▶  open ${t.title}`])),m.addEventListener("click",L=>this.shell.open(t,L)),f.append(m),f.append(V("p",{class:"xp-about"},[t.about]));const x=this.note();x&&f.append(V("div",{class:"xp-note"},[x]));const w=V("div",{class:"xp-actions"}),M=V("button",{class:"xp-btn default",type:"button"},[`Open ${t.title}`]);M.addEventListener("click",L=>this.shell.open(t,L));const E=V("button",{class:"xp-btn",type:"button"},["~ Home directory"]);if(E.addEventListener("click",()=>this.shell.home()),w.append(M),t.tune&&this.shell.canTune){const L=V("button",{class:"xp-btn",type:"button"},["▣ Watch it here"]);L.title="the live page, on its own screen in the room",L.addEventListener("click",()=>this.shell.tuneIn(t.id)),w.append(L)}if(t.id==="irc"){const L=V("button",{class:"xp-btn",type:"button"},["Join #aethera"]);L.title="sit in the channel, in mIRC",L.addEventListener("click",()=>this.shell.chat("#aethera")),w.append(L)}w.append(E),f.append(w);const b=[{icon:rc(),label:`Open ${t.title}`,run:()=>this.shell.open(t)},{icon:md(),label:"Look at its screen",run:()=>this.shell.look(t.id)}];t.tune&&this.shell.canTune&&b.splice(1,0,{icon:Fy(),label:"Watch it on its screen",run:()=>this.shell.tuneIn(t.id)}),t.id==="irc"&&b.splice(1,0,{icon:Ci("channel"),label:"Join #aethera in mIRC",run:()=>this.shell.chat("#aethera")}),b.push({icon:Oy(),label:"Copy address",run:()=>uc(this.shell,t)}),b.push({icon:gd(),label:"Eject tape",run:()=>this.win.close()});const R=[{icon:br(),label:"~ (home directory)",run:()=>this.shell.home()}];for(const L of Yy[t.id]??[]){const D=this.shell.site(L);D&&R.push({icon:Cn(D.accent),label:D.title,run:()=>this.shell.play(D.id)})}const _=V("div",{class:"xp-details"});_.append(V("b",{},[t.title]));const T=V("dl");for(const[L,D]of t.details)T.append(V("dt",{},[L]),V("dd",{},[D]));_.append(T),this.statusLine=V("div",{class:"status"}),_.append(this.statusLine),d.append(Ws("Tape Tasks",b,!0),Ws("Other Places",R),Ws("Details",_)),this.win=n.open({id:`site:${t.id}`,title:`${t.title} — ${a.replace(/^https?:\/\//,"")}`,icon:Cn(t.accent),body:r,width:Math.round(Math.min(760,Math.max(440,innerWidth*.5))),dock:"right",onClose:()=>{h(),clearInterval(this.timer),g==null||g.canvas.remove(),i()}}),this.win.el.style.height="min(640px, calc(100% - 24px))",this.refresh(),this.timer=window.setInterval(()=>this.refresh(),2e3)}note(){const t=this.site;return t.id==="dreams"?"Opening dreams wakes the dreamer: a GPU starts up while anyone is watching and goes back to sleep after. The frame here is the last one the chronicle kept.":t.id==="syrinx"?"Syrinx makes sound once you wake it. The creature here is read from this browser; nobody else sees yours.":t.id==="afterlife"?"afterlife makes music once you click in. The universe on this screen is the one saved in this browser, if you have visited; nobody else sees yours.":t.group==="wired"?`${t.title} is not on this server; it opens in a new window.`:null}refresh(){const{feeds:t}=this.shell;let e=!1,n="";switch(this.site.id){case"dreams":case"dreams-api":{const r=t.dreams.value;e=r.known&&r.awake,n=r.known?r.awake?`awake · frame ${r.frame.toLocaleString("en-US")}${r.viewers?` · ${r.viewers} watching`:""}`:"asleep":"status unknown";break}case"chronicle":{const r=t.chronicle.value;e=r.known&&r.eras.some(o=>o.open),n=r.known?`${r.eraCount||r.eras.length} eras recorded`:"reading the core…";break}case"irc":{const r=t.irc.value;e=r.connected,n=r.connected?"live on #aethera":"connecting…";break}case"syrinx":{const r=t.creature.value;e=!!r,n=r?`yours: ${r.name}`:"not woken in this browser";break}case"afterlife":{const r=t.universe.value;e=!!r,n=r?`yours: generation ${r.generation.toLocaleString("en-US")}`:"no universe in this browser yet";break}default:return}this.statusLine.className=`status${e?" on":""}`,this.statusLine.innerHTML="<i></i><span></span>";const i=this.statusLine.querySelector("span");i&&(i.textContent=n)}}const Hd=2;class lM{constructor(t,e,n,i){A(this,"el");A(this,"menu");A(this,"buttons");A(this,"btns",new Map);A(this,"more");A(this,"shown",null);A(this,"clock");A(this,"moonEl");A(this,"start");A(this,"tip");A(this,"balloonEl");A(this,"balloonTimer",0);A(this,"dialogEl",null);this.root=t,this.shell=e,this.wm=n,this.hooks=i,this.el=V("nav",{class:"xp-taskbar","aria-label":"taskbar"}),this.start=V("button",{class:"xp-start",type:"button","aria-label":"æthera","aria-haspopup":"menu","aria-expanded":"false",html:'<span aria-hidden="true">æ</span>'}),this.buttons=V("div",{class:"xp-taskbuttons",role:"group","aria-label":"windows"}),this.more=V("button",{class:"xp-taskbtn xp-taskmore",type:"button","aria-label":"More windows",title:"More windows","aria-haspopup":"menu",hidden:""},["»"]),this.more.addEventListener("click",()=>{const a=this.more.getBoundingClientRect();ji(this.windowsMenu(),a.left,a.top-4,{returnTo:this.more,owner:this.more})});const r=V("div",{class:"xp-tray"}),o=V("span",{class:"tray-icon net",title:"Connected to the Wired",html:Py()});this.moonEl=V("span",{class:"tray-icon dream",title:"dreams",html:fd(!1)}),this.clock=V("span",{class:"clock"}),r.append(o,this.moonEl,this.clock),this.el.append(this.start,this.buttons,this.more,r),t.append(this.el),this.menu=this.buildMenu(),t.append(this.menu),this.start.addEventListener("click",()=>this.toggleMenu()),this.el.addEventListener("keydown",a=>{var u;if(a.key!=="ArrowLeft"&&a.key!=="ArrowRight")return;const l=a.target;if(!l.closest(".xp-start, .xp-taskbtn"))return;a.preventDefault(),a.stopPropagation();const c=[this.start,...this.btns.values(),...this.more.hidden?[]:[this.more]],h=c.indexOf(l);(u=c[(h+(a.key==="ArrowRight"?1:-1)+c.length)%c.length])==null||u.focus()}),t.addEventListener("pointerdown",a=>{const l=a.target;!this.menu.hidden&&!l.closest(".xp-startmenu")&&!l.closest(".xp-start")&&!l.closest(".xp-menu")&&this.toggleMenu(!1)}),this.el.addEventListener("contextmenu",a=>{a.preventDefault(),a.stopPropagation();const l=a.target.closest(".xp-taskbtn"),c=l?this.wm.list.find(h=>h.opts.id===l.dataset.win):void 0;ji(c?c.systemMenu():this.barMenu(),a.clientX,a.clientY,{owner:(c==null?void 0:c.el)??null,returnTo:l})}),o.addEventListener("click",()=>this.balloon("Connected to the Wired",`${e.dir.sites.length} screens · 1 VCR · signal: present day, present time`,this.trayAnchor())),this.tip=V("div",{class:"xp-tip",role:"tooltip",hidden:""}),this.balloonEl=V("div",{class:"xp-balloon",role:"status",hidden:""}),t.append(this.tip,this.balloonEl),n.on(()=>this.renderButtons()),addEventListener("resize",()=>this.fitButtons()),e.feeds.dreams.on(a=>{this.moonEl.innerHTML=fd(a.awake),this.moonEl.title=a.known?a.awake?`dreams: awake · frame ${a.frame.toLocaleString("en-US")}`:"dreams: asleep":"dreams: no answer"}),this.tick(),setInterval(()=>this.tick(),15e3)}tick(){this.clock.textContent=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}trayAnchor(){const t=this.el.getBoundingClientRect();return{x:t.right-60,y:t.top}}get startOpen(){return!this.menu.hidden}toggleMenu(t,e=!1){var i;const n=t??this.menu.hidden;n||Xe(),this.menu.hidden=!n,this.start.classList.toggle("open",n),this.start.setAttribute("aria-expanded",String(n)),n?(i=this.menu.querySelector("a,button"))==null||i.focus():e&&this.start.focus({preventScroll:!0})}barMenu(){return[{label:"Toolbars",disabled:!0,submenu:()=>[]},"sep",{label:"Cascade Windows",disabled:!0},{label:"Tile Windows Horizontally",disabled:!0},{label:"Tile Windows Vertically",disabled:!0},{label:"Show the Desktop",run:()=>this.showDesktop(),disabled:!this.wm.list.some(t=>!t.minimized&&!t.opts.dialog)&&!this.shown},"sep",{label:"Task Manager",disabled:!0},"sep",{label:"Lock the Taskbar",checked:!0,disabled:!0},{label:"Properties",disabled:!0}]}showDesktop(){const t=this.wm.list.filter(i=>!i.opts.dialog&&!i.minimized);if(!t.length&&this.shown){const{windows:i,active:r}=this.shown;this.shown=null;for(const o of i)!o.closed&&o.minimized&&o.restore();r&&!r.closed&&!r.minimized&&r.focus();return}const e=i=>Number(i.el.style.zIndex)||0,n={windows:[...t].sort((i,r)=>e(i)-e(r)),active:this.wm.activeWindow};for(const i of t)i.minimize();this.shown=n}windowsMenu(){return this.wm.list.filter(t=>!t.opts.dialog).map(t=>({label:t.el.getAttribute("aria-label")??t.opts.title,icon:t.opts.icon,checked:this.wm.activeWindow===t&&!t.minimized,run:()=>t.minimized?t.restore():t.focus()}))}buildMenu(){const t=V("div",{class:"xp-startmenu",role:"menu","aria-label":"Start",hidden:""}),e=V("header",{"aria-hidden":"true"});e.append(V("span",{class:"avatar",html:Lo(40)}),V("span",{},["guest"])),t.append(e,V("div",{class:"orange","aria-hidden":"true"}));const n=V("div",{class:"cols",role:"none"}),i=V("ul",{class:"left",role:"group","aria-label":"Programs"}),r=V("ul",{class:"right",role:"group","aria-label":"Places"}),o=(b,R)=>{const _=V("li",{role:"none"});return _.append(R),b.append(_),R},a=(b,R,_,T,L,D="")=>{const U=V("button",{type:"button",role:"menuitem",class:D,html:`${R}<span><span class="tt"></span>${T!==null?"<small></small>":""}</span>`});U.querySelector(".tt").textContent=_;const G=U.querySelector("small");return G&&T&&(G.textContent=T),U.addEventListener("click",()=>{this.toggleMenu(!1),L()}),o(b,U)},l=(b,R,_,T)=>{const L=V("a",{href:T,role:"menuitem",html:`${R}<span></span>`});L.querySelector("span").textContent=_,o(b,L)},c=(b,R,_,T,L)=>{const D=V("button",{type:"button",role:"menuitem",class:`cascade ${T}`,"aria-haspopup":"menu","aria-expanded":"false","data-menu-owner":"",html:`${R}<span class="tt"></span><i class="arrow"></i>`});D.querySelector(".tt").textContent=_;const U=G=>{D.classList.add("open"),D.setAttribute("aria-expanded","true"),Td(L(),D,{onClose:()=>u(D),takeFocus:!G,focusFirst:!G&&Do()})};return D.addEventListener("click",()=>U(!1)),D.addEventListener("pointerenter",()=>U(!0)),o(b,D)},h=b=>b.append(V("li",{class:"sep",role:"separator"})),u=b=>{b.classList.remove("open"),b.setAttribute("aria-expanded","false")};t.addEventListener("pointerover",b=>{const R=b.target.closest("li > a, li > button");R&&!R.classList.contains("cascade")&&Xe()});const d=b=>({label:b.title,icon:Cn(b.accent),run:()=>{this.toggleMenu(!1),this.shell.play(b.id)}});a(i,Ci(),"mIRC","#aethera",()=>this.shell.chat(),"pinned");const f=this.shell.dir.sites.filter(b=>b.group==="here");f.slice(0,Hd).forEach(b=>a(i,Cn(b.accent,b.title),b.title,b.kind,()=>this.shell.play(b.id),"pinned")),h(i),f.slice(Hd).forEach(b=>a(i,Cn(b.accent,b.title),b.title,null,()=>this.shell.play(b.id)));const p=V("li",{class:"allprog",role:"none"});i.append(V("li",{class:"sep",role:"separator"}),p);const v=V("button",{type:"button",role:"menuitem",class:"cascade","aria-haspopup":"menu","aria-expanded":"false","data-menu-owner":"",html:`<span class="tt">All Programs</span>${zy()}`}),m=b=>{v.classList.add("open"),v.setAttribute("aria-expanded","true"),Td([...this.shell.dir.sites.filter(R=>R.group==="here").map(d),"sep",...this.shell.dir.sites.filter(R=>R.group==="wired").map(d),"sep",{label:"~ (home directory)",icon:br(),run:()=>{this.toggleMenu(!1),this.shell.home()}}],v,{onClose:()=>u(v),takeFocus:!b,focusFirst:!b&&Do()})};v.addEventListener("click",()=>m(!1)),v.addEventListener("pointerenter",()=>m(!0)),p.append(v),a(r,br(),"My Tapes",null,()=>this.shell.home(),"strong");const g=this.shell.dir.posts.slice(0,8);g.length&&c(r,Gs("txt"),"My Recent Transmissions","strong",()=>g.map(b=>({label:b.title,icon:Gs("txt"),run:()=>location.assign(b.href)}))),h(r);const x=this.shell.dir.sites.filter(b=>b.group==="wired");for(const b of x)a(r,Cn(b.accent),b.title,null,()=>this.shell.play(b.id));h(r);for(const b of this.shell.dir.files)l(r,Gs(b.title.split(".").pop()??"txt"),b.title,b.href);n.append(i,r),t.append(n);const w=V("div",{class:"foot",role:"group","aria-label":"Session"}),M=V("button",{type:"button",role:"menuitem",html:`${_d()}<span>Log Off</span>`});M.addEventListener("click",()=>{this.toggleMenu(!1),this.logOffDialog()});const E=V("button",{type:"button",role:"menuitem",html:`${vd()}<span>Turn Off Computer</span>`});return E.addEventListener("click",()=>{this.toggleMenu(!1),this.shutdownDialog()}),w.append(M,E),t.append(w),t.addEventListener("keydown",b=>this.startKeys(b,[i,r,w])),t}startKeys(t,e){var d,f,p;const n=v=>[...v.querySelectorAll(":scope > li > a, :scope > li > button, :scope > button")],i=document.activeElement,r=e.findIndex(v=>!!i&&v.contains(i)),o=()=>{t.preventDefault(),t.stopPropagation()};if(t.key==="Escape"){o(),ac()?Xe():this.toggleMenu(!1,!0);return}if(t.key==="Tab"){o();const v=e.flatMap(n),m=v.indexOf(i);(d=v[(m+(t.shiftKey?-1:1)+v.length)%v.length])==null||d.focus();return}if(r<0||!i)return;const a=e[r],l=n(a),c=l.indexOf(i),h=r===e.length-1,u=h?["ArrowLeft","ArrowRight"]:["ArrowUp","ArrowDown"];if(u.includes(t.key)||t.key==="Home"||t.key==="End"){o();const v=t.key==="Home"?0:t.key==="End"?l.length-1:(c+(t.key===u[1]?1:-1)+l.length)%l.length;(f=l[v])==null||f.focus()}else if(t.key==="ArrowRight"&&i.classList.contains("cascade"))o(),i.click();else if((t.key==="ArrowRight"||t.key==="ArrowLeft")&&!h){o();const v=n(e[r===0?1:0]),m=i.getBoundingClientRect().top,g=v.reduce((x,w)=>!x||Math.abs(w.getBoundingClientRect().top-m)<Math.abs(x.getBoundingClientRect().top-m)?w:x,null);g==null||g.focus()}else t.key==="ArrowDown"&&h?o():t.key==="ArrowUp"&&h&&(o(),(p=n(e[0]).at(-1))==null||p.focus())}dismiss(){return this.dialogEl?(this.dialogEl.remove(),this.dialogEl=null,this.start.focus(),!0):!1}get dialogUp(){return!!this.dialogEl}bigDialog(t,e){var l,c;(l=this.dialogEl)==null||l.remove();const n=V("div",{class:"xp-shutdown",role:"dialog","aria-modal":"true","aria-label":t});this.dialogEl=n;const i=V("div",{class:"panel"});i.append(V("header",{html:`<span></span>${Lo(28,!1)}`})),i.querySelector("header span").textContent=t;const r=V("div",{class:"choices"});for(const h of e){const u=V("button",{type:"button",class:h.cls,html:`<i>${h.icon}</i><span>${h.label}</span>`}),d=h.run;d?u.addEventListener("click",()=>{n.remove(),this.dialogEl=null,d()}):u.disabled=!0,r.append(u)}i.append(r);const o=V("div",{class:"foot"}),a=V("button",{class:"xp-btn",type:"button"},["Cancel"]);a.addEventListener("click",()=>this.dismiss()),o.append(a),i.append(o),n.append(i),this.root.append(n),(c=r.querySelector("button:not(:disabled):last-of-type, button:not(:disabled)"))==null||c.focus()}logOffDialog(){this.bigDialog("Log Off æthera",[{cls:"switch",icon:yd(),label:"Switch User"},{cls:"logoff",icon:_d(),label:"Log Off",run:()=>this.hooks.logOff()}])}shutdownDialog(){var t,e;this.bigDialog("Turn off computer",[{cls:"standby",icon:By(),label:"Stand By",run:()=>this.hooks.standby(!0)},{cls:"off",icon:vd(),label:"Turn Off",run:()=>this.hooks.turnOff()},{cls:"restart",icon:yd(),label:"Restart",run:()=>this.hooks.restart()}]),(e=(t=this.dialogEl)==null?void 0:t.querySelector(".off"))==null||e.focus()}renderButtons(){const t=this.wm.list.filter(e=>!e.opts.dialog);for(const[e,n]of this.btns)t.includes(e)||(n.remove(),this.btns.delete(e));for(const e of t){let n=this.btns.get(e);n||(n=V("button",{class:"xp-taskbtn",type:"button","data-win":e.opts.id,html:`${e.opts.icon}<span></span>`}),n.addEventListener("click",()=>{e.minimized?e.restore():this.wm.activeWindow===e?e.minimize():e.focus()}),this.btns.set(e,n),this.buttons.append(n));const i=this.wm.activeWindow===e&&!e.minimized;n.classList.toggle("active",i),n.setAttribute("aria-pressed",String(i));const r=n.querySelector("span"),o=e.el.getAttribute("aria-label")??e.opts.title;r.textContent!==o&&(r.textContent=o),n.title=o}this.shown&&t.some(e=>!e.minimized)&&(this.shown=null),this.fitButtons()}fitButtons(){const t=this.buttons;this.more.hidden=!0;const e=t.scrollWidth>t.clientWidth+1;if(this.more.hidden=!e,!e){t.scrollLeft=0;return}const n=[...this.btns.values()].find(r=>r.classList.contains("active"));if(!n)return;const i=n.offsetLeft-t.offsetLeft;i<t.scrollLeft?t.scrollLeft=i:i+n.offsetWidth>t.scrollLeft+t.clientWidth&&(t.scrollLeft=i+n.offsetWidth-t.clientWidth)}showTip(t,e,n,i){const r=t?{title:t.title,text:t.tagline}:e;if(!r){this.tip.hidden=!0;return}this.tip.innerHTML="<b></b><span></span>",this.tip.querySelector("b").textContent=r.title,this.tip.querySelector("span").textContent=r.text,this.tip.hidden=!1;const o=this.root.getBoundingClientRect(),a=this.tip.offsetWidth;this.tip.style.left=`${Math.min(n+14,o.width-a-6)}px`,this.tip.style.top=`${Math.min(i+20,o.height-70)}px`}balloon(t,e,n,i=7e3,r=!1){var f;const o=this.balloonEl;o.innerHTML=`<b>${xd()}<span></span></b><span class="msg"></span><button class="x" type="button" aria-label="Close">✕</button>`,o.querySelector("b span").textContent=t,o.querySelector(".msg").textContent=e,(f=o.querySelector(".x"))==null||f.addEventListener("click",()=>o.hidden=!0),o.hidden=!1;const a=this.root.getBoundingClientRect(),l=n??this.trayAnchor(),c=o.offsetWidth,h=o.offsetHeight,u=Math.max(6,Math.min(l.x-30,a.width-c-6)),d=r?l.y+h+24>a.height-30:l.y-h-20>0;o.classList.toggle("above",d),o.classList.toggle("below",!d),o.style.left=`${u}px`,o.style.top=`${d?l.y-h-18:l.y+18}px`,o.style.setProperty("--tail",`${Math.max(12,Math.min(c-30,l.x-u))}px`),clearTimeout(this.balloonTimer),this.balloonTimer=window.setTimeout(()=>o.hidden=!0,i)}hideBalloon(){this.balloonEl.hidden=!0}}const _c=340,yc=260,Mc=28,cM=1e5,hM=140,uM=["n","s","e","w","ne","nw","se","sw"];class dM{constructor(t,e){A(this,"el");A(this,"minimized",!1);A(this,"closed",!1);var o,a,l,c,h;this.opts=t,this.wm=e;const n=document.createElement("section");n.className=`xp-window${t.dialog?" xp-dialog":""}`,n.setAttribute("role",t.dialog?"alertdialog":"dialog"),n.setAttribute("aria-label",t.title),n.dataset.win=t.id,n.tabIndex=-1,n.innerHTML=`
      <header class="xp-titlebar">
        <span class="xp-title-icon">${t.icon}</span>
        <span class="xp-title"></span>
        <span class="xp-controls">
          ${t.dialog?"":'<button class="xp-min" aria-label="Minimize" title="Minimize"></button><button class="xp-max" aria-label="Maximize" title="Maximize"></button>'}
          <button class="xp-close" aria-label="Close" title="Close"></button>
        </span>
      </header>`;const i=n.querySelector(".xp-title");i&&(i.textContent=t.title),n.append(t.body),n.style.width=`${t.width}px`,this.el=n,(o=n.querySelector(".xp-close"))==null||o.addEventListener("click",()=>this.close()),(a=n.querySelector(".xp-min"))==null||a.addEventListener("click",()=>this.minimize()),(l=n.querySelector(".xp-max"))==null||l.addEventListener("click",()=>this.toggleMax()),n.addEventListener("pointerdown",()=>this.focus(),!0),n.addEventListener("keydown",u=>{u.key==="Tab"&&!u.altKey&&!u.ctrlKey&&!u.metaKey?this.wm.trapTab(this,u):u.key===" "&&u.altKey&&(u.preventDefault(),this.openSystemMenu(!0))}),this.bindDrag(n.querySelector(".xp-titlebar")),t.dialog||this.bindResize(),(c=n.querySelector(".xp-titlebar"))==null||c.addEventListener("dblclick",u=>{const d=u.target;d.closest(".xp-controls")||t.dialog||(d.closest(".xp-title-icon")?this.close():this.toggleMax())});const r=n.querySelector(".xp-title-icon");r==null||r.setAttribute("data-menu-owner",""),r==null||r.addEventListener("click",u=>{u.stopPropagation(),this.openSystemMenu(!1)}),(h=n.querySelector(".xp-titlebar"))==null||h.addEventListener("contextmenu",u=>{const d=u;d.target.closest(".xp-controls")||(d.preventDefault(),d.stopPropagation(),ji(this.systemMenu(),d.clientX,d.clientY,{owner:this.el}))})}get maximized(){return this.el.classList.contains("maximized")}openSystemMenu(t){const e=this.el.getBoundingClientRect();ji(this.systemMenu(),e.left+3,e.top+29,{owner:this.el,focusFirst:t||Do(),returnTo:this.el})}systemMenu(){const t=!!this.opts.dialog;return[{label:"Restore",run:()=>this.minimized?this.restore():this.toggleMax(),disabled:t||!this.maximized&&!this.minimized},{label:"Move",disabled:!0},{label:"Size",disabled:!0},{label:"Minimize",run:()=>this.minimize(),disabled:t||this.minimized},{label:"Maximize",run:()=>{this.minimized&&this.restore(),this.maximized||this.toggleMax()},disabled:t||this.maximized},"sep",{label:"Close",run:()=>this.close(),bold:!0}]}setTitle(t){const e=this.el.querySelector(".xp-title");e&&(e.textContent=t),this.el.setAttribute("aria-label",t),this.wm.changed()}place(t,e){const n=t.clientWidth,i=t.clientHeight,r=Math.min(this.opts.width,n-16);this.el.style.width=`${r}px`,t.append(this.el);const o=Math.min(this.el.offsetHeight,i-16);let a=this.opts.x??0,l=this.opts.y??0;this.opts.x===void 0&&(this.opts.dock==="left"?a=18:this.opts.dock==="right"?a=n-r-18:a=(n-r)/2),this.opts.y===void 0&&(l=this.opts.dialog?(i-o)/2.4:Math.max(8,Math.min(60,(i-o)/2))),e&&!this.opts.dialog&&this.wm.crowded(this,a,l,r,o)&&(a=e.el.offsetLeft+Mc,l=e.el.offsetTop+Mc,a+r>n-8&&(a=Math.max(8,e.el.offsetLeft-Mc)),l+o>i-8&&(l=8)),this.moveTo(a,l)}moveTo(t,e){const n=this.el.parentElement;if(!n)return;const i=n.clientWidth-60,r=n.clientHeight-30;this.el.style.left=`${Math.round(Math.max(-this.el.offsetWidth+hM,Math.min(i,t)))}px`,this.el.style.top=`${Math.round(Math.max(0,Math.min(r,e)))}px`}bindDrag(t){let e=null,n=null;t.addEventListener("pointerdown",r=>{r.target.closest(".xp-controls, .xp-title-icon")||r.button!==0||Vs()||(this.maximized?(n={x:r.clientX,y:r.clientY},e=null):e={x:r.clientX,y:r.clientY,left:this.el.offsetLeft,top:this.el.offsetTop},t.setPointerCapture(r.pointerId))}),t.addEventListener("pointermove",r=>{if(n){if(Math.hypot(r.clientX-n.x,r.clientY-n.y)<6)return;const o=this.el.parentElement;if(!o)return;const a=o.getBoundingClientRect(),l=n.x-a.left,c=n.y-a.top;n=null,this.toggleMax();const h=this.el.offsetWidth,u=r.clientX-a.left-Math.min(l,Math.max(40,h-90)),d=r.clientY-a.top-c;this.moveTo(u,d),e={x:r.clientX,y:r.clientY,left:this.el.offsetLeft,top:this.el.offsetTop};return}e&&this.moveTo(e.left+r.clientX-e.x,e.top+r.clientY-e.y)});const i=()=>{e&&this.wm.changed(),e=null,n=null};t.addEventListener("pointerup",i),t.addEventListener("pointercancel",i)}bindResize(){for(const t of uM){const e=document.createElement("div");e.className=`xp-grip xp-grip-${t}`,e.setAttribute("aria-hidden","true"),this.el.append(e);let n=null;e.addEventListener("pointerdown",r=>{r.button!==0||this.maximized||Vs()||(r.preventDefault(),n={x:r.clientX,y:r.clientY,left:this.el.offsetLeft,top:this.el.offsetTop,w:this.el.offsetWidth,h:this.el.offsetHeight},e.setPointerCapture(r.pointerId),this.focus())}),e.addEventListener("pointermove",r=>{if(!n)return;const o=this.el.parentElement;if(!o)return;const a=r.clientX-n.x,l=r.clientY-n.y;let{left:c,top:h,w:u,h:d}=n;t.includes("e")&&(u=Math.min(o.clientWidth-c,Math.max(_c,n.w+a))),t.includes("s")&&(d=Math.min(o.clientHeight-h,Math.max(yc,n.h+l))),t.includes("w")&&(u=Math.max(_c,Math.min(n.left+n.w,n.w-a)),c=n.left+n.w-u),t.includes("n")&&(d=Math.max(yc,Math.min(n.top+n.h,n.h-l)),h=n.top+n.h-d),this.el.style.left=`${Math.round(c)}px`,this.el.style.top=`${Math.round(h)}px`,this.el.style.width=`${Math.round(u)}px`,this.el.style.height=`${Math.round(d)}px`,this.el.style.maxHeight="none"});const i=()=>{n&&this.wm.changed(),n=null};e.addEventListener("pointerup",i),e.addEventListener("pointercancel",i)}}clamp(){if(this.maximized||this.minimized||Vs())return;const t=this.el.parentElement;t&&(this.el.offsetWidth>t.clientWidth&&(this.el.style.width=`${Math.max(Math.min(_c,t.clientWidth),t.clientWidth-8)}px`),this.el.offsetHeight>t.clientHeight&&(this.el.style.height=`${Math.max(Math.min(yc,t.clientHeight),t.clientHeight-8)}px`),this.moveTo(this.el.offsetLeft,this.el.offsetTop))}focus(){this.wm.focus(this)}minimize(){this.closed||(this.minimized=!0,this.el.classList.add("minimized"),bd(this.el)&&Xe(),this.wm.focusTop(),this.wm.changed())}restore(){this.closed||(this.minimized=!1,this.el.classList.remove("minimized"),this.clamp(),this.focus())}toggleMax(){if(this.closed)return;const t=this.el.classList.toggle("maximized"),e=this.el.querySelector(".xp-max");e==null||e.setAttribute("aria-label",t?"Restore":"Maximize"),e==null||e.setAttribute("title",t?"Restore":"Maximize"),t||this.clamp(),this.focus()}close(){var t,e;this.closed||(this.closed=!0,bd(this.el)&&Xe(),this.el.remove(),this.wm.remove(this),(e=(t=this.opts).onClose)==null||e.call(t),this.wm.closed(this))}}class fM{constructor(t){A(this,"windows",[]);A(this,"active",null);A(this,"last",null);A(this,"z",30);A(this,"listeners",new Set);A(this,"closeListeners",new Set);this.desk=t,addEventListener("resize",()=>{for(const e of this.windows)e.clamp()})}get list(){return this.windows}get activeWindow(){return this.active}get(t){return this.windows.find(e=>e.opts.id===t)}open(t){const e=this.get(t.id);if(e)return e.minimized?e.restore():e.focus(),e;const n=new dM(t,this),i=this.last&&!this.last.closed&&!this.last.minimized?this.last:this.topmost();return this.windows.push(n),n.place(this.desk,i),t.dialog||(this.last=n),this.focus(n),n}topmost(){return this.windows.filter(t=>!t.minimized&&!t.opts.dialog).sort((t,e)=>Number(e.el.style.zIndex)-Number(t.el.style.zIndex))[0]??null}crowded(t,e,n,i,r){for(const o of this.windows){if(o===t||o.minimized||o.opts.dialog||o.maximized)continue;const a=Math.max(0,Math.min(e+i,o.el.offsetLeft+o.el.offsetWidth)-Math.max(e,o.el.offsetLeft)),l=Math.max(0,Math.min(n+r,o.el.offsetTop+o.el.offsetHeight)-Math.max(n,o.el.offsetTop));if(a*l>.25*i*r)return!0}return!1}focus(t){var n,i;if(t.closed)return;const e=this.active!==t;this.active=t,t.el.style.zIndex=String(++this.z+(t.opts.dialog?cM:0));for(const r of this.windows)r.el.classList.toggle("inactive",r!==t);!t.minimized&&!t.el.contains(document.activeElement)&&t.el.focus({preventScroll:!0}),e&&((i=(n=t.opts).onFocus)==null||i.call(n)),this.changed()}deactivate(){var e;if(!this.active)return;const t=this.active;this.active=null;for(const n of this.windows)n.el.classList.add("inactive");t.el.contains(document.activeElement)&&((e=document.activeElement)==null||e.blur()),this.changed()}focusTop(){const e=this.windows.filter(n=>!n.minimized).sort((n,i)=>Number(i.el.style.zIndex)-Number(n.el.style.zIndex))[0];if(e)this.focus(e);else{this.active=null;for(const n of this.windows)n.el.classList.add("inactive");this.changed()}}topDialog(){return this.windows.filter(t=>t.opts.dialog&&!t.minimized).sort((t,e)=>Number(e.el.style.zIndex)-Number(t.el.style.zIndex))[0]??null}trapTab(t,e){var o;const n=Wy(t.el);if(e.preventDefault(),!n.length){t.el.focus({preventScroll:!0});return}const i=n.indexOf(document.activeElement),r=i<0?e.shiftKey?n.length-1:0:(i+(e.shiftKey?-1:1)+n.length)%n.length;(o=n[r])==null||o.focus()}remove(t){this.windows=this.windows.filter(e=>e!==t),this.last===t&&(this.last=null),this.active===t&&(this.active=null,this.focusTop()),this.changed()}closeTop(){const t=this.active&&!this.active.minimized?this.active:null;return t?(t.close(),!0):!1}on(t){return this.listeners.add(t),()=>this.listeners.delete(t)}onClose(t){return this.closeListeners.add(t),()=>this.closeListeners.delete(t)}closed(t){for(const e of this.closeListeners)e(t)}changed(){for(const t of this.listeners)t()}}const bc=document.getElementById("oikos");if(bc)try{mM(bc)}catch(s){console.error("oikos: boot failed; falling back to the plain directory",s),bc.classList.remove("oikos-live"),(Vd=document.getElementById("oikos-boot"))==null||Vd.remove()}function pM(){var s;try{const t=document.createElement("canvas").getContext("webgl2");return(s=t==null?void 0:t.getExtension("WEBGL_lose_context"))==null||s.loseContext(),!!t}catch{return!1}}function Uo(){return location.pathname+location.search}function mM(s){var ae,se;s.classList.add("oikos-live");const t=matchMedia("(prefers-reduced-motion: reduce)").matches,e=hf(),n=new df,i=new Map(e.sites.map(F=>[F.id,lp(F,{dir:e,feeds:n})])),r=new Map(e.sites.map(F=>[F.id,F]));if(new URLSearchParams(location.search).has("contact")){gM(s,e.sites,i,n);return}const o=V("div",{id:"oikos-desktop"});s.append(o);const a=new fM(o);$y(s);const l=F=>{const nt=F.opts.id;return nt==="home"?"~":nt==="mirc"?"mirc":nt.startsWith("site:")?nt.slice(5):null},c=()=>{try{return decodeURIComponent(location.hash.slice(1))}catch{return""}},h=F=>F?`${Uo()}#${encodeURIComponent(F)}`:Uo(),u={i:0,top:0,listeners:new Set},d=()=>{for(const F of u.listeners)F()};try{history.replaceState({oikos:0},"",location.href)}catch{}let f=c();const p=F=>{if(c()!==F){u.i+=1,u.top=u.i;try{history.pushState({oikos:u.i},"",h(F))}catch{}f=F,d()}},v=F=>{if(c()===F){try{history.replaceState({oikos:u.i},"",Uo())}catch{}f=""}},m=()=>{const F=c(),nt=history.state;if(typeof(nt==null?void 0:nt.oikos)=="number")u.i=Math.max(0,Math.min(nt.oikos,u.top));else{u.i=u.top+1,u.top=u.i;try{history.replaceState({oikos:u.i},"",location.href)}catch{}}d(),F!==f&&(f=F,g(F,!1))};addEventListener("popstate",m),addEventListener("hashchange",m);function g(F,nt){F==="~"||F==="home"?W(nt):F==="mirc"?B(void 0,nt):r.has(F)?K(F,nt):F===""&&(G(!1),a.deactivate())}let x=null;const w=new Map;let M=null,E=null,b=null,R=!1,_=null,T=0;const L={dir:e,feeds:n,screens:i,site:F=>r.get(F),select(F){G(!1),x==null||x.focus(F)},play(F){K(F,!0)},open(F,nt){if(nt==null||nt.preventDefault(),R)return;if(Ic(F.href)){window.open(F.href,"_blank","noopener"),U.balloon(`${F.title} opened`,"It opened in a new window. The room is still here.");return}const Et=F.href;R=!0,U.balloon(`Opening ${F.title}`,"tuning in…",void 0,2e3);let Ht=!1;const It=()=>{Ht||(Ht=!0,location.assign(Et))};x?x.dive(F.id).then(It):It(),setTimeout(It,1500)},look(F){G(!1),x==null||x.focus(F)},get canTune(){return!!x},tuneIn(F){const nt=r.get(F);if(!x||!(nt!=null&&nt.tune))return;const Et=typeof nt.tune=="string"?nt.tune:nt.href;G(!1);const Ht=a.activeWindow,It=H=>Number(H.el.style.zIndex)||0,At=a.list.filter(H=>!H.minimized&&!H.opts.dialog).sort((H,Z)=>It(H)-It(Z));for(const H of At)H.minimize();U.hideBalloon();const I=V("div",{class:"oikos-tube"});I.style.setProperty("--glow",nt.accent);const ie=V("iframe",{src:Et,title:`${nt.title}, live`,allow:"autoplay; fullscreen; clipboard-write"});I.append(ie,V("i",{class:"roll"}),V("i",{class:"glass"})),ie.addEventListener("load",()=>{var H;try{(H=ie.contentWindow)==null||H.addEventListener("keydown",Z=>{var ht;const rt=Z.target;Z.key!=="Escape"||Z.defaultPrevented||(ht=rt==null?void 0:rt.closest)!=null&&ht.call(rt,"input, textarea, [contenteditable]")||G(!0)})}catch{}});const Kt=V("div",{class:"oikos-tuned",role:"toolbar","aria-label":"tuned in"});Kt.innerHTML=`${Cn(nt.accent)}<b></b><span>tuned in · live on its screen</span>`,Kt.querySelector("b").textContent=nt.title;const C=V("button",{class:"xp-btn",type:"button"},["⏏ Eject"]);C.addEventListener("click",()=>G(!0));const y=V("a",{class:"xp-btn",href:nt.href},["Open full ↗"]);Ic(nt.href)&&(y.setAttribute("target","_blank"),y.setAttribute("rel","noopener")),Kt.append(C,y),_={id:F,bar:Kt,hidden:At,active:Ht,tube:I};const z=H=>{const Z=Math.round(Math.min(1024,Math.max(420,H.width*1.15))),rt=Math.round(Z*.75);I.style.width=`${Z}px`,I.style.height=`${rt}px`,I.style.transform=`translate(${H.left}px, ${H.top}px) scale(${H.width/Z}, ${H.height/rt})`};x.tuneIn(F,z).then(()=>{(_==null?void 0:_.bar)===Kt&&(s.append(I,Kt),ie.focus())})},chat(F){B(F,!0)},home(){W(!0)},eject(){var nt;G(!1);const F=M;F&&((nt=w.get(F))==null||nt.win.close()),M=null,x==null||x.eject(),x==null||x.focus(null)},balloon(F,nt,Et){U.balloon(F,nt,Et)},back:()=>{u.i>0&&history.back()},forward:()=>{u.i<u.top&&history.forward()},get canBack(){return u.i>0},get canForward(){return u.i<u.top},onNav(F){return u.listeners.add(F),()=>u.listeners.delete(F)},about:()=>q()},D=new qy(L,a),U=new lM(s,L,a,{standby:F=>lt(F),turnOff(){s.classList.add("off"),setTimeout(()=>location.assign("/"),t?50:750)},logOff(){G(!1);for(const F of[...a.list])F.close();M=null,x==null||x.eject(),x==null||x.focus(null);try{history.replaceState({oikos:u.i},"",Uo())}catch{}f="",U.balloon("Logged off","The desk is clear. Click the VCR to begin again.",(x==null?void 0:x.anchor("vcr"))??void 0)},restart(){try{sessionStorage.removeItem("oikos-booted")}catch{}location.reload()}});a.onClose(F=>{const nt=l(F);nt&&(v(nt),f===nt&&(f=""))}),a.on(()=>N());function G(F){if(!_)return;const{id:nt,bar:Et,hidden:Ht,active:It,tube:At}=_;_=null,Et.remove(),At.remove(),x==null||x.tuneOut();for(const I of Ht)!I.closed&&I.minimized&&I.restore();It&&!It.closed&&!It.minimized?It.focus():It||a.deactivate(),F&&(x==null||x.focus(nt))}function K(F,nt){const Et=r.get(F);if(!Et)return;G(!1),D.select(F);const Ht=w.get(F);if(Ht){M=F,x==null||x.play(F),Ht.win.minimized?Ht.win.restore():Ht.win.focus(),nt&&p(F);return}const It=++T,At=I=>{if(It!==T)return;if(!I){x==null||x.eject(),M=null;return}const ie=w.get(F);if(ie){ie.win.focus();return}M=F;const Kt=new aM(Et,L,a,()=>{w.delete(F),M===F&&(M=null,x==null||x.eject()),(x==null?void 0:x.focusedId)===F&&x.focus(null),N()});w.set(F,Kt),N(),nt&&p(F)};x?(M=F,x.play(F).then(At)):At(!0)}function N(){const F=a.activeWindow,nt=F?l(F):null;let Et=nt&&w.has(nt)?nt:E&&w.has(E)?E:null;Et||(Et=[...w.keys()].at(-1)??null),Et!==E&&(E=Et,x==null||x.keepAlive(Et))}function W(F){G(!1),D.open(),D.focusTiles(),x==null||x.scroll("~ home"),F&&p("~")}function B(F,nt){G(!1),b||(b=new oM(L,a,()=>b=null)),b.focus(F),nt&&p("mirc")}function q(){var ie;(ie=a.get("about"))==null||ie.close();const F=V("div",{class:"xp-about-box"}),nt=V("div",{class:"band",html:Lo(44,!0)});nt.append(V("b",{},["æthera"]),V("span",{},["oikos"]));const Et=V("div",{class:"xp-dialog-body"}),Ht=V("div");Ht.append(V("p",{},["æthera · the home directory"]),V("p",{},["Version 1998 (Build 2026.present_day)"]),V("p",{},["A room of screens wired to one VCR, and every part of the site playing at once."]),V("p",{class:"lic"},["This product is licensed under CC BY 4.0 to:"]),V("p",{},["guest"])),Et.append(Ht);const It=V("div",{class:"xp-actions"}),At=V("button",{class:"xp-btn default",type:"button"},["OK"]);It.append(At),F.append(nt,Et,It);const I=a.open({id:"about",title:"About æthera",icon:xd(),body:F,width:400,dialog:!0});At.addEventListener("click",()=>I.close()),At.focus()}if(pM())try{x=new wy(s,e.sites,i,{pick(F){ft(),U.hideBalloon(),U.showTip(null,null,0,0),F==="vcr"?L.home():F?L.play(F):x!=null&&x.focusedId&&!w.size&&!x.busy&&x.focus(null)},hover(F,nt,Et){F==="vcr"?U.showTip(null,{title:"VCR",text:"your home directory · click to open ~"},nt,Et):U.showTip(F?r.get(F)??null:null,null,nt,Et)},context(F){F?U.hideBalloon():U.balloon("The room went dark","The graphics card was reset. The tapes all still play; the room comes back when it does.")}})}catch(F){console.warn("oikos: the room would not build; running the desktop alone",F),x==null||x.stop(),x=null}if(x==null||x.renderer.domElement.addEventListener("pointerdown",()=>a.deactivate()),Xy(s,(F,nt)=>{var At,I;const Et=F.closest(".xp-tile");if(Et)return Et.dataset.id?D.contextFor(Et.dataset.id):null;if(F.closest("a"))return null;if(F.closest(".xp-content")&&((I=(At=F.closest(".xp-window"))==null?void 0:At.getAttribute("aria-label"))!=null&&I.startsWith("~")))return D.blankMenu();if(F.closest(".xp-window, .xp-startmenu, .xp-shutdown, .xp-menu, .xp-balloon"))return[];if(!x||F!==x.renderer.domElement)return[];const Ht=x.pickFromPoint(nt.clientX,nt.clientY);if(Ht==="vcr")return[{label:"Open ~",bold:!0,run:()=>L.home()},{label:"Eject",run:()=>L.eject(),disabled:!M},"sep",{label:"Properties",disabled:!0}];const It=Ht?r.get(Ht):void 0;return It?Io(L,It):[{label:"Arrange Icons By",disabled:!0,submenu:()=>[]},{label:"Refresh",run:()=>x==null?void 0:x.focus(null)},"sep",{label:"Paste",disabled:!0},{label:"Paste Shortcut",disabled:!0},"sep",{label:"New",disabled:!0,submenu:()=>[]},"sep",{label:"~ Home directory",run:()=>L.home()},{label:"Properties",disabled:!0}]}),!x){let F=performance.now();const nt=Et=>{var It;requestAnimationFrame(nt);const Ht=Math.min(.1,(Et-F)/1e3);F=Et;for(const At of w.keys())(It=i.get(At))==null||It.tick(Et/1e3,Ht,!0)};requestAnimationFrame(nt)}const et=()=>{if(!x)return;const F=a.list.some(I=>{if(I.minimized||!I.maximized)return!1;const ie=I.el.getBoundingClientRect();return ie.top<=1&&ie.height>=innerHeight-40});x.setVisibility(F?"glimpsed":"full");const nt=innerWidth,Et=innerHeight-30,Ht=a.list.filter(I=>!I.minimized&&!I.opts.dialog&&!I.el.classList.contains("maximized"));if(Vs()){x.setShift(0,Ht.length?Et*.3:0);return}let It=0,At=nt;for(const I of Ht){const ie=I.el.getBoundingClientRect();ie.left+ie.width/2<nt/2?It=Math.max(It,ie.right):At=Math.min(At,ie.left)}At-It<nt*.22&&(It=0,At=nt),x.setShift(nt/2-(It+At)/2,0)};a.on(et),addEventListener("resize",et);let ot=!1;function lt(F){ot=F,s==null||s.classList.toggle("standby",F),F&&(x==null||x.focus(null))}function ft(){ot&&lt(!1)}s.addEventListener("pointerdown",ft,!0);const $t=new Map(Object.entries(Pr).map(([F,nt])=>[nt.channel,F])),ge=e.sites.map(F=>F.id).sort((F,nt)=>{var Et,Ht;return(((Et=Pr[F])==null?void 0:Et.channel)??99)-(((Ht=Pr[nt])==null?void 0:Ht.channel)??99)});let ne="",j=0;addEventListener("keydown",F=>{var Ht,It;if(ot){ft();return}const nt=F.target,Et=!!nt.closest("input, textarea, [contenteditable]");if(!(Et&&(F.key!=="Escape"||F.defaultPrevented))){if(F.key==="Escape"&&_){G(!0);return}if(!_){if(F.key==="Escape"){if(Xe()||U.dismiss())return;if(U.startOpen){U.toggleMenu(!1,!0);return}const At=a.topDialog();if(At){At.close();return}x!=null&&x.focusedId&&!a.activeWindow&&!Et&&x.focus(null);return}if(!Et){if(F.altKey&&(F.key==="ArrowLeft"||F.key==="ArrowRight")){F.preventDefault(),F.key==="ArrowLeft"?L.back():L.forward();return}if(F.key==="F10"&&!F.shiftKey){const At=(Ht=a.activeWindow)==null?void 0:Ht.el.querySelector(".xp-menutitle");At&&(F.preventDefault(),At.focus());return}if(F.key==="F6"){F.preventDefault();const At=a.activeWindow;At&&!At.el.contains(nt)?At.el.focus():(It=s.querySelector(".xp-start"))==null||It.focus();return}if(!(a.activeWindow||ac()||U.startOpen||U.dialogUp)&&!nt.closest(".xp-window, .xp-startmenu, .xp-menu, .xp-shutdown, .xp-taskbar, .xp-balloon, .oikos-tuned")&&!(F.ctrlKey||F.metaKey||F.altKey)){if(F.key==="~"||F.key==="Home"){L.home();return}if((F.key==="ArrowRight"||F.key==="ArrowLeft")&&!(x!=null&&x.busy)){const At=x!=null&&x.focusedId&&x.focusedId!=="vcr"?ge.indexOf(x.focusedId):-1,I=ge[(At+(F.key==="ArrowRight"?1:-1)+ge.length)%ge.length];if(I){x==null||x.focus(I),D.select(I);const ie=x==null?void 0:x.anchor(I),Kt=r.get(I);ie&&Kt&&U.showTip(Kt,null,ie.x-40,ie.y-50)}return}if(F.key==="Enter"&&(x!=null&&x.focusedId)&&x.focusedId!=="vcr"){L.play(x.focusedId);return}/^[0-9]$/.test(F.key)&&(ne=(ne+F.key).slice(-2),clearTimeout(j),x==null||x.scroll(`ch ${ne}`),j=window.setTimeout(()=>{const At=$t.get(Number(ne));ne="",At&&r.has(At)&&L.play(At)},700))}}}}});let ct=!1;document.addEventListener("visibilitychange",()=>{document.hidden?(x==null||x.stop(),n.stop(),_&&G(!0)):ct&&(x==null||x.start(),n.start())}),addEventListener("pageshow",F=>{F.persisted&&(R=!1,s.classList.remove("off"),x==null||x.reset())});const st=document.getElementById("oikos-boot");let Ot=!1;try{Ot=!!sessionStorage.getItem("oikos-booted"),sessionStorage.setItem("oikos-booted","1")}catch{}const Wt=t||Ot?250:1900;let Ft=()=>{};const we=new Promise(F=>Ft=F);st==null||st.addEventListener("click",()=>Ft());const ee=Promise.race([Promise.all([(ae=document.fonts)==null?void 0:ae.load('16px "Libertinus Mono"'),(se=document.fonts)==null?void 0:se.load('16px "Love Letter Typewriter"')]).then(()=>{},()=>{}),new Promise(F=>setTimeout(F,1500))]),de=(x==null?void 0:x.warm())??Promise.resolve();Promise.race([Promise.all([ee,de,new Promise(F=>setTimeout(F,Wt))]),we]).then(()=>{ct=!0,document.hidden||(n.start(),x==null||x.start()),x==null||x.powerOn(),st==null||st.classList.add("gone"),setTimeout(()=>st==null?void 0:st.remove(),800);const F=new URLSearchParams(location.search).get("look");F&&x&&(F==="vcr"||r.has(F))&&setTimeout(()=>x==null?void 0:x.focus(F),300);const nt=c();if(nt&&(nt==="~"||nt==="home"||nt==="mirc"||r.has(nt))){setTimeout(()=>g(nt,!1),nt==="mirc"||nt==="~"||nt==="home"?600:900);return}if(!x){W(!1),U.balloon("No room tonight","This browser has no WebGL, so the room of screens is dark. The tapes all still play.");return}setTimeout(()=>{if(a.list.length)return;const Et=(x==null?void 0:x.anchor("vcr"))??void 0;U.balloon("This is the way in",Vs()?"Tap the VCR for the home directory, or any screen to tune in. Drag to look around.":"Click the VCR for your home directory, or any screen to tune in. Drag to look around; ← → walk the screens.",Et,11e3,!0)},Ot?900:2600)})}function gM(s,t,e,n){var a;(a=document.getElementById("oikos-boot"))==null||a.remove();const i=V("div");i.style.cssText="position:absolute;inset:0;overflow:auto;padding:16px;display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));background:#0a0a0a;";for(const l of t){const c=e.get(l.id);if(!c)continue;const h=V("figure");h.style.cssText="margin:0;color:#aaa;font:12px ui-monospace,monospace;",c.canvas.style.cssText="width:100%;display:block;border:1px solid #333;";const u=V("figcaption",{},[`${l.title} · ${l.kind}`]);u.style.padding="4px 0",h.append(c.canvas,u),i.append(h)}s.append(i),n.start();let r=performance.now();const o=l=>{requestAnimationFrame(o);const c=Math.min(.1,(l-r)/1e3);r=l;for(const h of e.values())h.tick(l/1e3,c,!1)};requestAnimationFrame(o)}})();
