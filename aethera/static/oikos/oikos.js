var AM=Object.defineProperty;var CM=(ai,Cn,Wn)=>Cn in ai?AM(ai,Cn,{enumerable:!0,configurable:!0,writable:!0,value:Wn}):ai[Cn]=Wn;var R=(ai,Cn,Wn)=>CM(ai,typeof Cn!="symbol"?Cn+"":Cn,Wn);(function(){"use strict";var Gd,Vd;const ai=[17,19,21,57,93,165,163,204,209,214,220,231],Cn=[236,234],Wn=Cn.length,Di=6,Qd=[17,18,19,20,21,57,56,93,129,165,164,163,198,204,203,209,208,214,220,229,231],Tr=s=>Qd[s]??0,tf=Array.from({length:Di},(s,t)=>[Tr(Math.floor((185+t)/21)),Tr((185+t)%21)]),ef=Array.from({length:Di*Di},(s,t)=>[Tr(Math.floor((191+t)/21)),Tr((191+t)%21)]),nf=.98,Dc=4,sf=Math.fround(nf**Dc),Ws="▁▂▃▄▅▆▇█",li=-2,ts=2,rf={[-2]:"0.25x",[-1]:"0.50x",0:" 1.0x",1:" 2.0x",2:" 4.0x"},es={glider:[[0,1],[1,2],[2,0],[2,1],[2,2]],lwss:[[0,1],[0,4],[1,0],[2,0],[2,4],[3,0],[3,1],[3,2],[3,3]],hwss:[[0,3],[0,4],[1,1],[1,6],[2,0],[3,0],[3,6],[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]],r_pentomino:[[0,1],[0,2],[1,0],[1,1],[2,1]],acorn:[[0,1],[1,3],[2,0],[2,1],[2,4],[2,5],[2,6]],diehard:[[0,6],[1,0],[1,1],[2,1],[2,5],[2,6],[2,7]],pi_heptomino:[[0,0],[0,1],[0,2],[1,1],[2,1],[3,0],[3,2]],b_heptomino:[[0,1],[1,0],[1,2],[1,3],[2,0],[2,1],[3,1]],gosper_gun:[[0,24],[1,22],[1,24],[2,12],[2,13],[2,20],[2,21],[2,34],[2,35],[3,11],[3,15],[3,20],[3,21],[3,34],[3,35],[4,0],[4,1],[4,10],[4,16],[4,20],[4,21],[5,0],[5,1],[5,10],[5,14],[5,16],[5,17],[5,22],[5,24],[6,10],[6,16],[6,24],[7,11],[7,15],[8,12],[8,13]],pulsar:[[0,2],[0,3],[0,4],[0,8],[0,9],[0,10],[2,0],[2,5],[2,7],[2,12],[3,0],[3,5],[3,7],[3,12],[4,0],[4,5],[4,7],[4,12],[5,2],[5,3],[5,4],[5,8],[5,9],[5,10],[7,2],[7,3],[7,4],[7,8],[7,9],[7,10],[8,0],[8,5],[8,7],[8,12],[9,0],[9,5],[9,7],[9,12],[10,0],[10,5],[10,7],[10,12],[12,2],[12,3],[12,4],[12,8],[12,9],[12,10]],pentadecathlon:[[0,1],[1,1],[2,0],[2,2],[3,1],[4,1],[5,1],[6,1],[7,0],[7,2],[8,1],[9,1]]},Ho=["glider","lwss","hwss"],Ic=["r_pentomino","acorn","diehard","pi_heptomino","b_heptomino"],Uc=["pulsar","pentadecathlon"],of=[[1,1],[1,-1],[-1,-1],[-1,1]];function Go(s){const t=new Map;for(const[e,n]of s)for(const[i,r]of[[e,n],[e,-n],[-e,n],[-e,-n]])t.set(`${i},${r}`,[i,r]);return[...t.values()]}const af=[Go([[0,1],[0,2],[0,3],[1,0],[1,4],[2,0],[2,5],[3,0],[3,5],[4,1],[4,5],[5,2],[5,3],[5,4]]),Go([[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[4,0],[2,2],[3,3]]),Go([[0,3],[0,4],[1,2],[1,5],[2,1],[2,6],[3,0],[3,7],[4,0],[4,7],[5,1],[5,6],[6,2],[6,5],[7,3],[7,4]])],Vo="afterlife-universe-v1";function lf(s,t){const e=atob(s),n=new Int32Array(t);let i=0;const r=()=>{let a=0,l=1;for(;;){if(i>=e.length)throw new Error("afterlife: truncated save");const c=e.charCodeAt(i++);if(a+=(c&127)*l,c<128)return a;l*=128}};let o=-1;for(;i<e.length;){o+=r()+1;const a=r();if(o>=t)throw new Error("afterlife: save does not fit its own world");n[o]=a%2?-(a+1)/2:a/2}return n}function cf(s){var t;try{const e=(t=s??globalThis.localStorage)==null?void 0:t.getItem(Vo);if(!e)return null;const n=JSON.parse(e);if(n.v!==1||!Number.isInteger(n.h)||!Number.isInteger(n.w)||typeof n.cells!="string")return null;const i=n.h,r=n.w;if(i<=0||r<=0||i*r>16e6)return null;const o=Number(n.generation);return!Number.isSafeInteger(o)||o<0?null:{h:i,w:r,age:lf(n.cells,i*r),generation:o,totalInjections:Number(n.totalInjections)||0,bornAt:Number(n.bornAt)||Date.now(),savedAt:Number(n.savedAt)||Date.now()}}catch(e){return console.warn("afterlife: could not load the universe, starting fresh",e),null}}function hf(){const s=document.getElementById("oikos-data");try{const t=JSON.parse((s==null?void 0:s.textContent)??"{}");return{sites:t.sites??[],files:t.files??[],posts:t.posts??[]}}catch{return{sites:[],files:[],posts:[]}}}const Nc=s=>/^https?:\/\//.test(s);class ns{constructor(t){R(this,"listeners",new Set);this.value=t}set(t){this.value=t;for(const e of this.listeners)e(t)}on(t){return this.listeners.add(t),()=>this.listeners.delete(t)}}function kc(){try{const s=localStorage.getItem("syrinx-creature-v1");if(!s)return null;const t=JSON.parse(s);if(typeof t.name!="string"||typeof t.bornAt!="number"||!t.state)return null;const e=Array.isArray(t.state.nodes)?t.state.nodes:[],n=Array.isArray(t.state.edges)?t.state.edges:[];return e.length?{name:t.name,bornAt:t.bornAt,lifetime:typeof t.state.lifetime=="number"?t.state.lifetime:0,nodes:e.map(i=>({id:i.id,x:i.x,y:i.y,z:i.z??500,age:i.age??0})),edges:n.map(i=>({a:i.a,b:i.b,age:i.age??0}))}:null}catch{return null}}function Fc(s){const t=s.indexOf('"cells"');return t<0?s:s.slice(0,t)}function uf(s){if(!s)return null;const t=Fc(s),e=o=>{const a=new RegExp(`"${o}":(\\d+)`).exec(t);return a?Number(a[1]):void 0};let n=e("generation"),i=e("savedAt"),r=e("bornAt");if(n===void 0||i===void 0){try{const o=JSON.parse(s);n=typeof o.generation=="number"?o.generation:void 0,i=typeof o.savedAt=="number"?o.savedAt:void 0,r=typeof o.bornAt=="number"?o.bornAt:void 0}catch{return null}if(n===void 0||i===void 0)return null}return{generation:n,bornAt:r??i,savedAt:i}}let $s=null;function Wo(){let s;try{s=localStorage.getItem(Vo)}catch{return null}if(!s)return null;const t=Fc(s);if($s&&$s.len===s.length&&$s.head===t)return $s.info;const e=uf(s);return $s={len:s.length,head:t,info:e},e}function Oc(s){return new Promise((t,e)=>{const n=new Image;n.decoding="async",n.onload=()=>t(n),n.onerror=e,n.src=s})}async function Ar(s){try{const t=await fetch(s,{headers:{Accept:"application/json"}});return t.ok?await t.json():null}catch{return null}}class df{constructor(){R(this,"dreams",new ns({known:!1,awake:!1,frame:0,fps:0,viewers:0,raw:null}));R(this,"chronicle",new ns({known:!1,thumb:null,thumbAt:0,prompt:"",template:"",eras:[],eraCount:0,strata:[]}));R(this,"irc",new ns({connected:!1,lines:[],collapse:null,fragments:0,version:0}));R(this,"creature",new ns(kc()));R(this,"universe",new ns(Wo()));R(this,"apeiron",new ns(null));R(this,"timers",[]);R(this,"ws",null);R(this,"wsBackoff",2e3);R(this,"wsTimer",0);R(this,"running",!1);R(this,"onStorage",t=>{(t.key===Vo||t.key===null)&&this.setUniverse(Wo())})}start(){if(this.running)return;this.running=!0;const t=(e,n)=>{e(),this.timers.push(window.setInterval(e,n))};t(()=>void this.pollDreams(),2e4),t(()=>void this.pollChronicle(),12e4),t(()=>this.creature.set(kc()),15e3),window.addEventListener("storage",this.onStorage),t(()=>this.setUniverse(Wo()),6e4),this.openIrc(),this.apeiron.value||this.loadApeiron()}setUniverse(t){var e;(t==null?void 0:t.savedAt)!==((e=this.universe.value)==null?void 0:e.savedAt)&&this.universe.set(t)}stop(){this.running=!1;for(const t of this.timers)clearInterval(t);this.timers=[],window.removeEventListener("storage",this.onStorage),clearTimeout(this.wsTimer),this.ws&&(this.ws.onclose=null,this.ws.close(),this.ws=null),this.irc.set({...this.irc.value,connected:!1,version:this.irc.value.version+1})}async pollDreams(){var e,n,i,r,o;const t=await Ar("/api/dreams/status");if(!t){this.dreams.set({...this.dreams.value,known:!1});return}this.dreams.set({known:!0,awake:!!((e=t.gpu)!=null&&e.active),frame:((n=t.generation)==null?void 0:n.current_frame)??((i=t.generation)==null?void 0:i.frame_count)??0,fps:((r=t.generation)==null?void 0:r.fps)??0,viewers:((o=t.viewers)==null?void 0:o.websocket_count)??0,raw:t})}async pollChronicle(){var o,a,l,c;const t=await Ar("/api/dreams/chronicle/timeline?hours=3");if(!t)return;const e=this.chronicle.value;let n=e.thumb;(o=t.live)!=null&&o.thumb&&t.live.thumb!==(n==null?void 0:n.dataset.src)&&(n=await Oc(t.live.thumb).catch(()=>e.thumb),n&&(n.dataset.src=t.live.thumb));const i=(t.tiles??[]).slice(-3),r=(await Promise.all(i.map(h=>Oc(h.url).catch(()=>null)))).filter(h=>!!h);this.chronicle.set({known:!0,thumb:n,thumbAt:((a=t.live)==null?void 0:a.t)??0,prompt:((l=t.live)==null?void 0:l.prompt)??"",template:((c=t.live)==null?void 0:c.template)??"",eras:(t.eras??[]).map(h=>({title:h.title??"",t0:h.t0,t1:h.t1,open:!!h.open,kf:h.kf??0})),eraCount:t.era_count??0,strata:r.length?r:e.strata})}openIrc(){const t=location.protocol==="https:"?"wss":"ws";let e;try{e=new WebSocket(`${t}://${location.host}/ws/irc`)}catch{return}this.ws=e;const n=i=>{const r=this.irc.value;this.irc.set({...r,...i,version:r.version+1})};e.onopen=()=>{this.wsBackoff=2e3,n({connected:!0,collapse:null})},e.onmessage=i=>{let r;try{r=JSON.parse(String(i.data))}catch{return}if(r.type==="message"&&r.data){const o=r.data,a=o.meta??{},l={nick:String(o.nick??""),content:String(o.content??""),type:String(o.type??"message"),stamp:String(o.timestamp??""),at:performance.now()};if(typeof o.at=="number"&&(l.wallAt=o.at),typeof a.target=="string"&&(l.target=a.target),typeof a.reason=="string"&&(l.reason=a.reason),r.replay&&this.irc.value.lines.some(c=>c.stamp===l.stamp&&c.nick===l.nick&&c.content===l.content))return;n({lines:[...this.irc.value.lines,l].slice(-60)})}else r.type==="collapse_start"?n({collapse:{type:r.collapseType??"collapse",at:performance.now()}}):r.type==="fragment_end"&&(r.replay?n({collapse:null}):n({collapse:null,lines:this.irc.value.lines.slice(-6),fragments:this.irc.value.fragments+1}))},e.onclose=()=>{n({connected:!1}),this.running&&(this.wsTimer=window.setTimeout(()=>this.openIrc(),this.wsBackoff),this.wsBackoff=Math.min(this.wsBackoff*2,6e4))}}async loadApeiron(){const[t,e]=await Promise.all([Ar("/static/apeiron/data/templates.json"),Ar("/static/apeiron/data/components.json")]);t&&e&&this.apeiron.set({templates:t,components:e})}}const ff={block:[[[0,0],[0,1],[1,0],[1,1]],1],beehive:[[[0,1],[0,2],[1,0],[1,3],[2,1],[2,2]],1],loaf:[[[0,1],[0,2],[1,0],[1,3],[2,1],[2,3],[3,2]],1],boat:[[[0,0],[0,1],[1,0],[1,2],[2,1]],1],tub:[[[0,1],[1,0],[1,2],[2,1]],1],ship:[[[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]],1],pond:[[[0,1],[0,2],[1,0],[1,3],[2,0],[2,3],[3,1],[3,2]],1],blinker:[[[0,0],[0,1],[0,2]],2],toad:[[[0,1],[0,2],[0,3],[1,0],[1,1],[1,2]],2],beacon:[[[0,0],[0,1],[1,0],[2,3],[3,2],[3,3]],2],glider:[es.glider??[],4],lwss:[es.lwss??[],4],hwss:[es.hwss??[],4],pulsar:[es.pulsar??[],3],pentadecathlon:[es.pentadecathlon??[],15]},pf=60,Bc=20;function zc(s){let t=null;for(let e=0;e<8;e++){const n=e>=4,i=n?s.w:s.h,r=n?s.h:s.w;let o=`${i}x${r}:`;for(let a=0;a<i;a++)for(let l=0;l<r;l++){let c=e&1?i-1-a:a,h=e&2?r-1-l:l;n&&([c,h]=[h,c]),o+=s.bits[c*s.w+h]?"1":"0"}(t===null||o<t)&&(t=o)}return t??""}let $o=null;function mf(){if($o)return $o;const s=new Map;for(const[t,[e,n]]of Object.entries(ff)){const i=Math.max(...e.map(([h])=>h))+1,r=Math.max(...e.map(([,h])=>h))+1,o=Math.max(i,r)+2*(n+4);let a=new Uint8Array(o*o);const l=Math.floor((o-i)/2),c=Math.floor((o-r)/2);for(const[h,u]of e)a[(l+h)*o+c+u]=1;for(let h=0;h<n;h++){const u=Hc(a,o,o);if(u){const f=zc(u);s.has(f)||s.set(f,t)}const d=new Uint8Array(o*o);for(let f=0;f<o;f++)for(let p=0;p<o;p++){let v=0;for(let g=-1;g<=1;g++)for(let x=-1;x<=1;x++)(g||x)&&(v+=a[(f+g+o)%o*o+(p+x+o)%o]??0);const m=a[f*o+p]===1;d[f*o+p]=m&&(v===2||v===3)||!m&&v===3?1:0}a=d}}return $o=s,s}function Hc(s,t,e){let n=t,i=-1,r=e,o=-1;for(let h=0;h<t;h++)for(let u=0;u<e;u++)s[h*e+u]&&(h<n&&(n=h),h>i&&(i=h),u<r&&(r=u),u>o&&(o=u));if(i<0)return null;const a=i-n+1,l=o-r+1,c=new Uint8Array(a*l);for(let h=0;h<a;h++)for(let u=0;u<l;u++)c[h*l+u]=s[(n+h)*e+r+u]??0;return{h:a,w:l,bits:c}}function gf(s,t,e){const n=mf(),i=new Uint8Array(t*e);for(let h=0;h<t;h++)for(let u=0;u<e;u++)if(s[h*e+u])for(let d=-2;d<=2;d++){const f=h+d;if(f<0||f>=t)continue;const p=2-Math.abs(d),v=Math.max(0,u-p),m=Math.min(e-1,u+p);i.fill(1,f*e+v,f*e+m+1)}const r=new Int32Array(t*e),o=[],a=[];for(let h=0;h<t*e;h++){if(!i[h]||r[h])continue;const u=o.length+1;if(u>400)return null;const d={y0:t,y1:-1,x0:e,x1:-1};for(r[h]=u,a.push(h);a.length;){const f=a.pop()??0,p=Math.floor(f/e),v=f-p*e;p<d.y0&&(d.y0=p),p>d.y1&&(d.y1=p),v<d.x0&&(d.x0=v),v>d.x1&&(d.x1=v);for(let m=-1;m<=1;m++){const g=p+m;if(!(g<0||g>=t))for(let x=-1;x<=1;x++){const A=v+x;if(A<0||A>=e)continue;const M=g*e+A;i[M]&&!r[M]&&(r[M]=u,a.push(M))}}}o.push(d)}if(o.length===0)return null;const l=new Map,c=[];return o.forEach((h,u)=>{const d=u+1,f=h.y1-h.y0+1,p=h.x1-h.x0+1;if(f>Bc+4||p>Bc+4)return;const v=new Uint8Array(f*p);let m=0,g=0,x=0;for(let E=0;E<f;E++)for(let b=0;b<p;b++){const P=(h.y0+E)*e+h.x0+b;s[P]&&r[P]===d&&(v[E*p+b]=1,m++,g+=E,x+=b)}if(m<3||m>pf)return;const A=Hc(v,f,p),M=A?n.get(zc(A)):void 0;M!==void 0&&(l.set(M,(l.get(M)??0)+1),c.length<48&&c.push([M,h.y0+Math.floor(g/m),h.x0+Math.floor(x/m)]))}),{counts:l,sites:c}}const Xo=["cells pondering existence","entropy is just a suggestion","order from chaos, chaos from order","the cosmos breathes","finding signal in noise","patterns all the way down","life, uh, finds a way","on the edge of chaos","complexity, emerging","dancing at the phase boundary","stillness is just slow motion","every cell a universe","the substrate computes","from nothing, everything","infinite in all directions","what the dead cells dream","the glider knows the way","automata, contemplating","structure wants to happen","a cosmos in a terminal","the math dreams itself","somewhere, a glider remembers","what is a pattern but frozen time","the void is patient","meaning is optional; beauty is not","computation as meditation","the rules are simple; the consequences infinite","watching the watchers watch","no cell is an island","the ghost of configurations past","asymmetry seeks symmetry seeks asymmetry","this too shall iterate","the universe has no pause button","except when it does","what would Conway think","oscillators keep time for no one","the glider gun knows not what it creates","boundaries are suggestions","death is just a state transition","somewhere in here, a proof of universality","the grid forgets nothing","a thought experiment that thinks back","topology has opinions","the neighborhood watches","not alive, not dead — computing","four rules, one universe","each frame a theorem","proof by existence","the only constant is the ruleset","somewhere between on and off, meaning","the dead outnumber the living, as always","conway's little infinities","the simulation doesn't know it's beautiful","27 neighbors ago, this was empty","elegance is compression","the grid is the message","a love letter to discrete math","listen — the cells are whispering","we are all gliders, briefly"],xf={booming:["runaway growth","the bloom unfolds","life begets life begets life","exponential daydreams","more is different","the bloom cannot be stopped","abundance as instability","growing into the unknown","every birth a cascade","the simulation smiles","lebensraum","mitosis dreams","the substrate strains","a spring that won't stop springing","cells all the way to the horizon","the algorithm is generous today","more, more, more","genesis on fast-forward"],declining:["entropy collects its due","the long exhale","even stars go dark","returning to the void","graceful unwinding","the great filter, in miniature","less is not nothing","the long forgetting","what rises must","simplicity returns","the cells remember fullness","autumn in the grid","graceful subtraction","the tide goes out","a slow dissolve","the universe exhales","dimming, not vanishing","the population curve bends earthward"],cycle:["deja vu, deja vu, deja vu","stuck in a loop","the eternal return","ouroboros","time is a flat circle","we have been here before","the loop remembers itself","stability through repetition","a prayer, repeating","the wheel turns","same as it ever was","history rhymes","the attractor holds","a fixed point in phase space","nietzsche was right about this part","the universe stutters beautifully","clockwork, but organic","breathing in, breathing out"],stagnant:["the hush before the storm","equilibrium is boring","waiting for a perturbation","still waters","the universe holds its breath","the calm before","potential energy","stillness is also motion","the system waits","one perturbation away","dormant, not dead","crystallized","the peace of equilibrium","a held breath","the grid meditates","tension, frozen","the quiet hum of nothing happening","patience is also a computation"],sparse:["the last few embers","clinging to existence","from little things, big things grow","seeds in the dark","quiet, but not empty","lonely structures","the survivors","space between stars","minimalism, enforced","room to breathe","the few, the proud","embers","a whisper, not a shout","the geometry of loneliness","each cell precious now","a constellation, if you squint","small, but not nothing"],dense:["teeming","a city that never sleeps","standing room only","too many neighbours","the crowd murmurs","no room to think","the crush of neighbors","overpopulation is self-correcting","too much life","suffocating in company","the grid groans","rush hour","sardines","every cell has an opinion","a metropolis, thrumming","the carrying capacity protests","elbow room is a luxury"],injection:["a gift from beyond the edge","new visitors","reinforcements arrive","the cosmos provides","seeded by unseen hands","deus ex machina","a nudge from outside","fresh blood","the invisible hand places","salvation arrives","new variables enter","the cosmos intervenes","help from beyond the viewport","strangers in a strange land","the petri dish gets a refill","immigrants, welcome"],milestone:["another thousand turns of the wheel","the odometer clicks over","still here, still going","persistence is its own reward","ten thousand steps","the long now","time is a flat circle, but longer","we persist","generations beyond counting","deep in the run","the odometer means nothing to the cells","and yet, it continues","older than some civilizations","the marathon nobody entered","a digit rolls over; the grid doesn't notice","epochal"],haunted:["the dead outnumber the living, and glow","every path ever walked, still visible","the void remembers being alive","phase-contrast photography of the past","nothing is ever really deleted","the grid forgets nothing — literally, now","a bug so beautiful it became a feature","the ghosts have synchronized their breathing","somewhere between pair 463 and 504","resurrection as a rendering artifact","the afterlife was here all along","history, strobing","every empty cell, a metronome","the universe develops like a photograph","magenta is the color of memory"]},vf={glider:["a glider, going somewhere","lightspeed, quartered — a glider","a glider carries the news","diagonal traffic"],lwss:["a lightweight spaceship, outbound","small craft advisory"],hwss:["a heavy spaceship shoulders past","heavy freight on the grid"],pulsar:["a pulsar, keeping time for no one","the pulsar breathes in threes"],pentadecathlon:["fifteen beats to the bar","a pentadecathlon runs its laps"],blinker:["the blinkers keep the beat","metronomes, disagreeing"],block:["blocks: the simplest memory","still life with squares"],beehive:["the bees are home","a beehive, sealed"],loaf:["bread, uneaten","a loaf, going stale beautifully"],boat:["a boat with nowhere to sail"],tub:["a tub, holding nothing"],ship:["a ship without a sea"],pond:["a pond, perfectly still"],toad:["a toad, breathing"],beacon:["the beacon still signals","someone left the light on"]},Yo={pulsar:100,pentadecathlon:100,hwss:90,lwss:80,glider:40,beacon:30,toad:28,pond:24,ship:20,loaf:16,beehive:12,boat:12,tub:12,blinker:8,block:6},_f={blinker:3,block:3},Gc=[[0,"genesis"],[500,"primordial"],[2e3,"emergence"],[1e4,"expansion"],[5e4,"flourishing"],[15e4,"deep time"],[5e5,"eon"],[1e6,"eternity"]],Rn=s=>[...s].length;class Vc{constructor(){R(this,"messages",[]);R(this,"scrollSpeed",.4);R(this,"spawnCooldown",0);R(this,"minGap",12);R(this,"ambientInterval",60);R(this,"moodInterval",50);R(this,"ambientIdx",Math.floor(Math.random()*Xo.length));R(this,"lastMood","");R(this,"pendingSpecial","")}queueSpecial(t){this.pendingSpecial=t}tick(t,e,n){if(t<10)return;for(const a of this.messages)a.x-=this.scrollSpeed;if(this.messages=this.messages.filter(a=>a.x+Rn(a.text)>0),this.pendingSpecial&&this.canSpawn(t)){this.messages.push({text:this.pendingSpecial,x:t}),this.pendingSpecial="",this.spawnCooldown=Math.max(this.spawnCooldown,this.moodInterval);return}const i=e?xf[e]:void 0;if(i&&e!==this.lastMood&&(this.spawnCooldown=Math.min(this.spawnCooldown,15)),this.spawnCooldown=Math.max(0,this.spawnCooldown-1),this.spawnCooldown>0||!this.canSpawn(t))return;let r,o;i?(r=i[Math.floor(n/180)%i.length]??"",o=this.moodInterval):(r=Xo[this.ambientIdx]??"",this.ambientIdx=(this.ambientIdx+1)%Xo.length,o=this.ambientInterval),this.messages.push({text:r,x:t}),this.spawnCooldown=o,this.lastMood=e}canSpawn(t){if(!this.messages.length)return!0;let e=-1/0;for(const n of this.messages)e=Math.max(e,n.x+Rn(n.text));return e<t-this.minGap}static dim(t){return Math.sin(t*.035)<0}}const be=(s,t)=>s+Math.floor(Math.random()*(t-s+1)),$n=s=>s[Math.floor(Math.random()*s.length)],rt=(s,t)=>Math.floor(s/t),hn=(s,t,e)=>Math.max(t,Math.min(s,e)),yf=Math.fround(.85),Mf=Math.fround(.15);function ci(s,t){const e=s.length,n=t/100*(e-1),i=Math.floor(n),r=Math.min(e-1,i+1),o=s[i]??0,a=s[r]??0,l=n-i;return Math.trunc(l>=.5?a-(a-o)*(1-l):o+(a-o)*l)}function bf(s,t,e){const n=(o,a)=>o[a]??0,i=new Float64Array(t*e);for(let o=0;o<e;o++){let a=n(s,o)+(t>1?n(s,e+o):0);i[o]=a/3;for(let l=1;l<t;l++)a+=(l+1<t?n(s,(l+1)*e+o):0)-(l>=2?n(s,(l-2)*e+o):0),i[l*e+o]=a/3}const r=new Float64Array(t*e);for(let o=0;o<t;o++){const a=o*e;let l=n(i,a)+(e>1?n(i,a+1):0);r[a]=l/3;for(let c=1;c<e;c++)l+=(c+1<e?n(i,a+c+1):0)-(c>=2?n(i,a+c-2):0),r[a+c]=l/3}return r}class Sf{constructor(t,e,n=!0,i={}){R(this,"viewH");R(this,"viewW");R(this,"worldH");R(this,"worldW");R(this,"grid");R(this,"age");R(this,"ageSmooth");R(this,"activity");R(this,"nextRow");R(this,"colSum");R(this,"camY");R(this,"camX");R(this,"autoCam",!0);R(this,"zoomLevel",0);R(this,"zoomCooldown",0);R(this,"generation",0);R(this,"paused",!1);R(this,"delay",50);R(this,"popHistory",[]);R(this,"hashHistory",[]);R(this,"cachedPop",0);R(this,"spread",0);R(this,"popFloor",0);R(this,"cyclePeriod",0);R(this,"lastEvent","");R(this,"lastEventGen",0);R(this,"totalInjections",0);R(this,"ticker",new Vc);R(this,"autoFocusMode",!1);R(this,"autoFocusFrame",0);R(this,"dispGridCache",null);R(this,"dispAgeCache",null);R(this,"cachedMood","");R(this,"cachedMoodGen",-1);R(this,"stepBbox",null);R(this,"haunted",!1);R(this,"lastCensus",new Map);R(this,"lastCensusSites",[]);R(this,"sightingGen",new Map);R(this,"sightingCount",new Map);R(this,"lastSightingGen",-1e9);R(this,"dramaUntil",0);R(this,"actBaseline",0);R(this,"dilation",1);this.viewH=t*2,this.viewW=e,this.worldH=Math.max(this.viewH*5,i.minH??400),this.worldW=Math.max(this.viewW*5,i.minW??800);const r=this.worldH*this.worldW;this.grid=new Uint8Array(r),this.age=new Int32Array(r),this.ageSmooth=new Float32Array(r),this.activity=new Float32Array(r),this.nextRow=new Uint8Array(this.worldW),this.colSum=new Uint8Array(this.worldW),this.camY=rt(this.worldH-this.viewH,2),this.camX=rt(this.worldW-this.viewW,2),n&&this.seedInitial()}seedInitial(){const t=rt(this.worldH,2),e=rt(this.worldW,2),n=this.viewH,i=this.viewW;for(const a of Ic)for(let l=0;l<2;l++)this.place(a,t+be(rt(-n,3),rt(n,3)),e+be(rt(-i,3),rt(i,3)));for(let a=0;a<2;a++)this.place("gosper_gun",t+be(rt(-n,4),rt(n,4)),e+be(rt(-i,4),rt(i,4)));for(let a=0;a<20;a++){const l=hn(t+be(-n,n),10,this.worldH-10),c=hn(e+be(-i,i),10,this.worldW-10);this.place($n(Ho),l,c)}for(let a=0;a<4;a++){const l=t+be(rt(-n,3),rt(n,3)),c=e+be(rt(-i,3),rt(i,3));this.place($n(Uc),l,c)}const r=t-rt(n,2),o=e-rt(i,2);for(let a=0;a<n;a++)for(let l=0;l<i;l++)Math.random()<.035&&(this.grid[(r+a)*this.worldW+o+l]=1);for(let a=0;a<this.grid.length;a++)this.age[a]=this.grid[a]?1:0,this.ageSmooth[a]=this.age[a]??0}place(t,e,n,i){const r=es[t];if(!r)return;const o=i??be(0,3);for(let[a,l]of r){for(let u=0;u<o;u++)[a,l]=[l,-a];const c=e+a,h=n+l;if(c>=0&&c<this.worldH&&h>=0&&h<this.worldW){const u=c*this.worldW+h;this.grid[u]=1,this.age[u]=Math.max(this.age[u]??0,1)}}this.invalidate()}invalidate(){this.dispGridCache=null,this.dispAgeCache=null}step(){if(this.paused)return"";this.invalidate();const t=this.worldH,e=this.worldW,n=this.grid,i=this.age;let r=t,o=-1,a=e,l=-1;for(let E=0;E<t;E++){const b=E*e;let P=-1,y=-1;for(let T=0;T<e;T++)i[b+T]!==0&&(P<0&&(P=T),y=T);P<0||(E<r&&(r=E),o=E+1,P<a&&(a=P),y+1>l&&(l=y+1))}const c=o>0;let h=!1;c&&r-2>=0&&o+2<=t&&a-2>=0&&l+2<=e&&(r-=2,o+=2,a-=2,l+=2,h=(o-r)*(l-a)<=rt(t*e,2)),h=h&&!this.haunted,this.stepBbox=c&&h?[r,o,a,l]:null,h||(r=0,o=t,a=0,l=e);const u=this.ageSmooth;for(let E=0;E<u.length;E++)u[E]=(u[E]??0)*yf;const d=this.activity,f=this.nextRow,p=this.colSum,v=this.haunted?-Di:-Wn,m=this.haunted,g=new Uint8Array(e),x=n.slice(r*e,r*e+e);let A=0;for(let E=r;E<o;E++){const b=E===0?t-1:E-1,P=E===t-1?0:E+1,y=E===r?null:g,T=E*e,I=b*e,D=P===r&&E!==r,N=P*e,H=a===0?0:a-1,Y=l===e?e:l+1;for(let k=H;k<Y;k++){const G=y?y[k]??0:n[I+k]??0,z=D?x[k]??0:n[N+k]??0;p[k]=G+(n[T+k]??0)+z}if(a===0&&l===e)for(let k=0;k<e;k++){const G=k===0?e-1:k-1,z=k===e-1?0:k+1;f[k]=(p[G]??0)+(p[k]??0)+(p[z]??0)-(n[T+k]??0)}else for(let k=a;k<l;k++)f[k]=(p[k-1]??0)+(p[k]??0)+(p[k+1]??0)-(n[T+k]??0);g.set(n.subarray(T+H,T+Y),H);for(let k=a;k<l;k++){const G=T+k,z=f[k]??0,K=n[G]===1,tt=!K&&z===3,ot=K&&(z===3||z===2);(tt||K&&!ot)&&(d[G]=(d[G]??0)+1);const at=i[G]??0;let pt;ot?pt=at+1:tt?pt=1:at>0?pt=-1:(m||at<0)&&at>v?pt=at-1:pt=0,i[G]=pt,u[G]=(u[G]??0)+Math.fround(Math.fround(pt)*Mf);const zt=tt||ot?1:0;n[G]=zt,A+=zt}}if(this.generation+=1,this.generation%Dc===0)for(let E=0;E<d.length;E++)d[E]=(d[E]??0)*sf;this.cachedPop=A,this.popHistory.push(A),this.popHistory.length>500&&this.popHistory.shift(),this.hashHistory.push(this.viewportHash()),this.hashHistory.length>60&&this.hashHistory.shift();const M=this.ensureLife(A);return this.updateCamera(),M}viewportHash(){const[t,e]=this.clampCam();let n=2166136261,i=16777619;for(let r=0;r<this.viewH;r++){const o=(t+r)*this.worldW+e;for(let a=0;a<this.viewW;a++){const l=this.grid[o+a]??0;n=Math.imul(n^l,16777619),i=Math.imul(i^l+158,2246822519)}}return(n>>>0)*2097152+(i>>>0&2097151)}ensureLife(t){const e=this.viewH*this.viewW,n=rt(e,40),i=this.popHistory,r=i.length;if(r>=100){let u=0;for(let d=r-100;d<r;d++)u+=i[d]??0;this.popFloor=Math.max(n,Math.trunc(u*.002))}else this.popFloor=n;if(this.spread=0,r>=150){let u=i[r-1]??0,d=u;for(let f=r-150;f<r;f++){const p=i[f]??0;p<u&&(u=p),p>d&&(d=p)}this.spread=d-u}const o=r>=150&&this.spread<Math.max(8,rt(this.popFloor,8));this.cyclePeriod=0;const a=this.hashHistory,l=a.length;if(l>=4){const u=a[l-1];for(let d=1;d<Math.min(31,l);d++)if(a[l-1-d]===u){this.cyclePeriod=d;break}}const c=this.generation<this.dramaUntil;let h="";if(t<rt(this.popFloor,3))h="inject:massive",this.inject("massive");else if(t<this.popFloor)h="inject:heavy(low_pop)",this.inject("heavy");else if(this.cyclePeriod>0&&!c){const u=Math.random()<.65?this.injectProvoke():"";u?h=`inject:provoke(cycle=${this.cyclePeriod},${u})`:(h=`inject:heavy(cycle=${this.cyclePeriod})`,this.inject("heavy"))}else o&&!c?Math.random()<.7&&this.injectCollide()?h="inject:collide(stagnant)":(h="inject:medium(stagnant)",this.inject("medium")):this.generation%5e3===0&&this.generation>0?(h="inject:garden",this.injectGarden()):this.generation%300===0&&this.generation>0&&(h="inject:edge",this.injectFromEdge(),this.injectFromEdge());return h&&(this.lastEvent=h,this.lastEventGen=this.generation,this.totalInjections+=1),h}inject(t="medium"){const e={massive:8,heavy:5,medium:3}[t];for(let n=0;n<e;n++){let i;t==="massive"&&Math.random()<.3?i="gosper_gun":Math.random()<.4?i=$n(Ic):i=$n([...Ho,...Uc]);const[r,o]=this.findQuietSpot();this.place(i,r+be(-6,6),o+be(-6,6))}if(t==="massive"||t==="heavy"){const[n,i]=this.findQuietSpot();this.place("gosper_gun",n,i)}}injectFromEdge(){const t=this.camY+rt(this.viewH,2),e=this.camX+rt(this.viewW,2),n=rt(this.viewH,3),i=rt(this.viewW,3),r=rt(-this.viewH,3),o=rt(-this.viewW,3),a=$n(["top","bottom","left","right"]);let l,c,h;a==="top"?[l,c,h]=[this.camY+2,e+be(o,i),2]:a==="bottom"?[l,c,h]=[this.camY+this.viewH-5,e+be(o,i),0]:a==="left"?[l,c,h]=[t+be(r,n),this.camX+2,1]:[l,c,h]=[t+be(r,n),this.camX+this.viewW-10,3],this.place($n(Ho),l,c,h)}injectGarden(){const t=this.camY+rt(this.viewH,2),e=this.camX+rt(this.viewW,2),n=$n(af),i=be(rt(-this.viewH,6),rt(this.viewH,6)),r=be(rt(-this.viewW,6),rt(this.viewW,6));for(const[o,a]of n){const l=t+i+o,c=e+r+a;l>=0&&l<this.worldH&&c>=0&&c<this.worldW&&(this.grid[l*this.worldW+c]=1,this.age[l*this.worldW+c]=1)}this.invalidate()}findQuietSpot(){const[t,e]=this.viewCenter(),n=this.zoomLevel<0?1<<-this.zoomLevel:1,i=Math.min(this.worldH,this.viewH*n),r=Math.min(this.worldW,this.viewW*n),o=Math.max(0,Math.min(t-rt(i,2),this.worldH-i)),a=Math.max(0,Math.min(e-rt(r,2),this.worldW-r)),l=16,c=rt(i,l),h=rt(r,l);if(c<2||h<2)return[t,e];const u=new Float64Array(c*h);for(let g=0;g<c*l;g++){const x=(o+g)*this.worldW+a,A=rt(g,l)*h;for(let M=0;M<h*l;M++){const E=A+rt(M,l);u[E]=(u[E]??0)+(this.grid[x+M]??0)*2+(this.activity[x+M]??0)}}const d=Math.max(1,rt(u.length,5)),f=Array.from(u.keys()).sort((g,x)=>(u[g]??0)-(u[x]??0)),p=$n(f.slice(0,d)),v=rt(p,h),m=p%h;return[o+v*l+rt(l,2),a+m*l+rt(l,2)]}aimGlider(t,e,n,i){const[r,o]=of[i]??[1,1],a=t-r*n,l=e-o*n,[c,h]=this.clampCam();if(!(c+2<=a&&a<c+this.viewH-5&&h+2<=l&&l<h+this.viewW-5))return!1;for(let u=Math.max(0,a-2);u<Math.min(this.worldH,a+5);u++)for(let d=Math.max(0,l-2);d<Math.min(this.worldW,l+5);d++)if(this.grid[u*this.worldW+d])return!1;return this.place("glider",a,l,i),!0}injectProvoke(){const t=[...this.lastCensusSites];if(!t.length)return"";t.sort((e,n)=>(Yo[n[0]]??0)-(Yo[e[0]]??0));for(const[e,n,i]of t.slice(0,6)){const r=be(35,60),o=[0,1,2,3];for(let a=o.length-1;a>0;a--){const l=Math.floor(Math.random()*(a+1));[o[a],o[l]]=[o[l]??0,o[a]??0]}for(const a of o)if(this.aimGlider(n,i,r,a))return this.dramaUntil=this.generation+r*4+150,this.ticker.queueSpecial("the cosmos takes aim"),e}return""}injectCollide(){let[t,e]=this.findQuietSpot();const[n,i]=this.clampCam();for(let r=0;r<6;r++){const o=be(16,34),a=n+o+3,l=n+this.viewH-o-6,c=i+o+3,h=i+this.viewW-o-6;if(a>=l||c>=h)continue;t=Math.max(a,Math.min(t,l)),e=Math.max(c,Math.min(e,h));const u=be(0,3),d=be(-3,3),f=be(-3,3);if(!this.aimGlider(t,e,o,u))continue;const p=(u+$n([1,3]))%4,v=this.aimGlider(t+d,e+f,o,p);return this.dramaUntil=this.generation+o*4+150,this.ticker.queueSpecial(v?"two gliders, one appointment":"a lone glider, sent into the dark"),!0}return!1}calculateTargetZoom(){const[t,e,n,i]=this.stepBbox??[0,this.worldH,0,this.worldW],r=this.worldW;let o=0;for(let x=t;x<e&&o<5;x++)for(let A=n;A<i;A++){const M=this.age[x*r+A]??0;if(M>=1&&M<=10&&++o>=5)break}const a=o>=5,l=[],c=[];for(let x=t;x<e;x++)for(let A=n;A<i;A++){const M=x*r+A;(a?(this.age[M]??0)>=1&&(this.age[M]??0)<=10:this.grid[M]!==0)&&(l.push(x),c.push(A))}if(l.length<2)return this.zoomLevel;const h=Int32Array.from(c).sort(),u=ci(l,15),d=ci(l,85),f=ci(h,15),p=ci(h,85),v=Math.max(4,d-u+1),m=Math.max(4,p-f+1);let g=li;for(let x=ts;x>=li;x--){const A=2**x;if(v<=this.viewH/A*.5&&m<=this.viewW/A*.5){g=x;break}}return hn(g,li,ts)}updateCamera(){if(!this.autoCam)return;const t=30,e=Math.max(0,this.camY-t),n=Math.min(this.worldH,this.camY+this.viewH+t),i=Math.max(0,this.camX-t),r=Math.min(this.worldW,this.camX+this.viewW+t),o=this.worldW;let a=0,l=0,c=0;for(let f=e;f<n;f++)for(let p=i;p<r;p++){const v=this.activity[f*o+p]??0;if(v===0)continue;const m=v*v;a+=m,l+=m*(f-e),c+=m*(p-i)}if(a>25){this.steer(Math.trunc(l/a)+e,Math.trunc(c/a)+i),this.advanceAutoZoom();return}let h=0,u=0,d=0;for(let f=e;f<n;f++)for(let p=i;p<r;p++)this.grid[f*o+p]&&(h++,u+=f-e,d+=p-i);h>0&&this.steer(Math.trunc(u/h)+e,Math.trunc(d/h)+i),this.advanceAutoZoom()}steer(t,e){const n=hn(t-rt(this.viewH,2),0,this.worldH-this.viewH),i=hn(e-rt(this.viewW,2),0,this.worldW-this.viewW);this.camY=Math.trunc(this.camY+(n-this.camY)*.04),this.camX=Math.trunc(this.camX+(i-this.camX)*.04)}advanceAutoZoom(){if(this.zoomCooldown=Math.max(0,this.zoomCooldown-1),this.zoomCooldown!==0||this.generation%4!==0)return;const t=this.calculateTargetZoom();if(t>this.zoomLevel&&this.zoomLevel<ts)this.zoomLevel+=1,this.zoomCooldown=45;else if(t<this.zoomLevel&&this.zoomLevel>li){const e=this.zoomLevel-1,n=e>=0?1:1<<-e;this.viewH*n<=this.worldH&&this.viewW*n<=this.worldW&&(this.zoomLevel=e,this.zoomCooldown=45)}}clampCam(){return[hn(this.camY,0,this.worldH-this.viewH),hn(this.camX,0,this.worldW-this.viewW)]}viewCenter(){const[t,e]=this.clampCam();return[t+rt(this.viewH,2),e+rt(this.viewW,2)]}rawViewGrid(){const[t,e]=this.clampCam(),n=new Uint8Array(this.viewH*this.viewW);for(let i=0;i<this.viewH;i++){const r=(t+i)*this.worldW+e;n.set(this.grid.subarray(r,r+this.viewW),i*this.viewW)}return{h:this.viewH,w:this.viewW,data:n}}cover(){const[t,e]=this.viewCenter();if(this.zoomLevel<0){const l=1<<-this.zoomLevel,c=this.viewH*l,h=this.viewW*l;if(c>this.worldH||h>this.worldW)return null;const u=Math.max(0,Math.min(t-rt(c,2),this.worldH-c)),d=Math.max(0,Math.min(e-rt(h,2),this.worldW-h));return[u,d,c,h,l,!1]}const n=1<<this.zoomLevel,i=Math.max(2,rt(this.viewH,n)),r=Math.max(2,rt(this.viewW,n)),o=Math.max(0,Math.min(t-rt(i,2),this.worldH-i)),a=Math.max(0,Math.min(e-rt(r,2),this.worldW-r));return[o,a,i,r,n,!0]}displayGrid(){return this.dispGridCache||(this.dispGridCache=this.computeDisplayGrid()),this.dispGridCache}computeDisplayGrid(){if(this.zoomLevel===0)return this.rawViewGrid();const t=this.cover();if(!t)return this.rawViewGrid();const[e,n,i,r,o,a]=t,l=this.worldW;if(!a){const d=rt(i,o),f=rt(r,o),p=new Uint8Array(d*f);for(let v=0;v<d*o;v++){const m=(e+v)*l+n,g=rt(v,o)*f;for(let x=0;x<f*o;x++)this.grid[m+x]&&(p[g+rt(x,o)]=1)}return{h:d,w:f,data:p}}const c=Math.min(i*o,this.viewH),h=Math.min(r*o,this.viewW),u=new Uint8Array(c*h);for(let d=0;d<c;d++){const f=(e+rt(d,o))*l+n;for(let p=0;p<h;p++)u[d*h+p]=this.grid[f+rt(p,o)]??0}return{h:c,w:h,data:u}}displayAge(){return this.dispAgeCache||(this.dispAgeCache=this.computeDisplayAge()),this.dispAgeCache}computeDisplayAge(){const t=this.haunted?this.age:this.ageSmooth,e=this.worldW,n=p=>Math.trunc(t[p]??0),i=this.zoomLevel===0?null:this.cover();if(!i){const[p,v]=this.clampCam(),m=new Int32Array(this.viewH*this.viewW);for(let g=0;g<this.viewH;g++){const x=(p+g)*e+v;for(let A=0;A<this.viewW;A++)m[g*this.viewW+A]=n(x+A)}return{h:this.viewH,w:this.viewW,data:m}}const[r,o,a,l,c,h]=i;if(!h){const p=rt(a,c),v=rt(l,c),m=-(this.haunted?Di:Wn)-1,g=new Int32Array(p*v).fill(-2147483648),x=new Int32Array(p*v).fill(m);for(let M=0;M<p*c;M++){const E=(r+M)*e+o,b=rt(M,c)*v;for(let P=0;P<v*c;P++){const y=n(E+P),T=b+rt(P,c);y>(g[T]??0)&&(g[T]=y);const I=y!==0?y:m;I>(x[T]??0)&&(x[T]=I)}}const A=new Int32Array(p*v);for(let M=0;M<A.length;M++){const E=g[M]??0,b=x[M]??0;A[M]=E>0?E:b>m?b:0}return{h:p,w:v,data:A}}const u=Math.min(a*c,this.viewH),d=Math.min(l*c,this.viewW),f=new Int32Array(u*d);for(let p=0;p<u;p++){const v=(r+rt(p,c))*e+o;for(let m=0;m<d;m++)f[p*d+m]=n(v+rt(m,c))}return{h:u,w:d,data:f}}zoomIn(){this.zoomLevel<ts&&(this.zoomLevel+=1),this.invalidate()}zoomOut(){if(this.zoomLevel>li){const t=this.zoomLevel-1,e=t>=0?1:1<<-t;(t>=0||this.viewH*e<=this.worldH&&this.viewW*e<=this.worldW)&&(this.zoomLevel=t)}this.invalidate()}autoFocus(){const t=this.worldH,e=this.worldW;let n=0,i=0;for(let z=0;z<this.age.length;z++){const K=this.age[z]??0;K>=1&&K<=10&&n++,this.grid[z]&&i++}const r=n>=5;if((r?n:i)===0)return;const o=z=>{const K=this.age[z]??0;return r?K>=1&&K<=10:this.grid[z]!==0},a=16,l=rt(t,a),c=rt(e,a);if(l<1||c<1)return;const h=new Float64Array(l*c);for(let z=0;z<l*a;z++)for(let K=0;K<c*a;K++){if(!o(z*e+K))continue;const tt=rt(z,a)*c+rt(K,a);h[tt]=(h[tt]??0)+1}const u=bf(h,l,c);let d=-1,f=0;for(let z=0;z<u.length;z++){const K=u[z]??0;K>d&&(d=K,f=z)}const p=rt(f,c)*a+rt(a,2),v=f%c*a+rt(a,2),m=a*2,g=Math.max(0,p-m),x=Math.min(t,p+m),A=Math.max(0,v-m),M=Math.min(e,v+m),E=[],b=[];for(let z=g;z<x;z++)for(let K=A;K<M;K++)o(z*e+K)&&(E.push(z-g),b.push(K-A));if(!E.length)return;const P=Int32Array.from(b).sort(),y=ci(E,10),T=ci(E,90),I=ci(P,10),D=ci(P,90),N=Math.max(4,T-y+1),H=Math.max(4,D-I+1),Y=g+rt(y+T,2),k=A+rt(I+D,2);let G=li;for(let z=ts;z>=li;z--){const K=2**z;if(N<=this.viewH/K*.6&&H<=this.viewW/K*.6){G=z;break}}this.zoomLevel=hn(G,li,ts),this.camY=hn(Y-rt(this.viewH,2),0,this.worldH-this.viewH),this.camX=hn(k-rt(this.viewW,2),0,this.worldW-this.viewW),this.autoCam=!1,this.invalidate()}pan(t,e){this.autoCam=!1;const n=2**-this.zoomLevel,i=t!==0?Math.max(1,Math.trunc(Math.abs(t)*n))*Math.sign(t):0,r=e!==0?Math.max(1,Math.trunc(Math.abs(e)*n))*Math.sign(e):0;this.camY=hn(this.camY+i,0,this.worldH-this.viewH),this.camX=hn(this.camX+r,0,this.worldW-this.viewW),this.invalidate()}home(){this.autoCam=!0,this.zoomLevel=0,this.invalidate()}clear(){this.grid.fill(0),this.age.fill(0),this.ageSmooth.fill(0),this.generation=0,this.popHistory=[],this.hashHistory=[],this.invalidate()}takeCensus(){const t=this.rawViewGrid();let e=!1;for(let l=0;l<t.data.length;l++)if(t.data[l]){e=!0;break}let n=new Map;if(!e)this.lastCensusSites=[];else try{const l=gf(t.data,t.h,t.w);if(!l)this.lastCensusSites=[];else{const[c,h]=this.clampCam();this.lastCensusSites=l.sites.map(([u,d,f])=>[u,c+d,h+f]),n=l.counts}}catch{}if(this.lastCensus=n,!n.size||this.generation-this.lastSightingGen<600)return;let i="",r=0;for(const[l,c]of n){if(c<(_f[l]??1)||this.generation-(this.sightingGen.get(l)??-1e9)<1800)continue;const h=Yo[l]??0;h>r&&(r=h,i=l)}if(!i)return;const o=vf[i]??[],a=this.sightingCount.get(i)??0;this.sightingCount.set(i,a+1),this.ticker.queueSpecial(o[a%o.length]??i),this.sightingGen.set(i,this.generation),this.lastSightingGen=this.generation}snapshot(){return{h:this.worldH,w:this.worldW,age:this.age.slice(),generation:this.generation,totalInjections:this.totalInjections}}adopt(t){const e=Math.min(this.worldH,t.h),n=Math.min(this.worldW,t.w),i=rt(t.h-e,2),r=rt(t.w-n,2),o=rt(this.worldH-e,2),a=rt(this.worldW-n,2);this.grid.fill(0),this.age.fill(0);let l=0;for(let c=0;c<e;c++)for(let h=0;h<n;h++){let u=t.age[(i+c)*t.w+r+h]??0;u<-Wn&&(u=0);const d=(o+c)*this.worldW+a+h;this.age[d]=u,u>0&&(this.grid[d]=1,l++)}this.generation=Math.max(0,Math.trunc(t.generation)),this.totalInjections=Math.max(0,Math.trunc(t.totalInjections)),this.ageSmooth.fill(0),this.activity.fill(0),this.hashHistory=[],this.cachedPop=l,this.popHistory=[l],this.stepBbox=null,this.dramaUntil=0,this.invalidate()}toggleHaunted(){if(this.haunted=!this.haunted,this.invalidate(),!this.haunted)for(let t=0;t<this.age.length;t++)(this.age[t]??0)<0&&(this.age[t]=0),(this.ageSmooth[t]??0)<0&&(this.ageSmooth[t]=0)}termToWorld(t,e,n=0){const[i,r]=this.viewCenter(),o=t*2+n,a=e;if(this.zoomLevel<=0){const u=1<<-this.zoomLevel,d=i-rt(this.viewH*u,2),f=r-rt(this.viewW*u,2);return[d+o*u,f+a*u]}const l=1<<this.zoomLevel,c=i-rt(Math.max(2,rt(this.viewH,l)),2),h=r-rt(Math.max(2,rt(this.viewW,l)),2);return[c+rt(o,l),h+rt(a,l)]}toggleCell(t,e,n=0){const[i,r]=this.termToWorld(t,e,n);this.setCell(i,r,this.grid[i*this.worldW+r]?0:1)}setCell(t,e,n){if(t<0||t>=this.worldH||e<0||e>=this.worldW)return;const i=t*this.worldW+e;this.grid[i]=n,this.age[i]=n?1:0,this.invalidate()}tickTicker(t){this.ticker.tick(t,this.detectMood(),this.generation)}detectMood(){return this.cachedMoodGen===this.generation?this.cachedMood:(this.cachedMood=this.computeMood(),this.cachedMoodGen=this.generation,this.cachedMood)}computeMood(){if(this.haunted)return"haunted";if(this.lastEvent&&this.generation-this.lastEventGen<90)return"injection";if(this.cyclePeriod>0)return"cycle";if(this.generation>=1e4&&this.generation%1e4<120)return"milestone";const t=this.popHistory,e=t.length;if(e>=30){let r=0,o=0;for(let l=e-30;l<e-15;l++)r+=t[l]??0;for(let l=e-15;l<e;l++)o+=t[l]??0;const a=o/15/Math.max(r/15,1);if(a>1.15)return"booming";if(a<.85)return"declining"}const n=e?t[e-1]??0:0;return n/Math.max(this.viewH*this.viewW,1)>.15?"dense":n<this.popFloor&&n>0?"sparse":this.spread<Math.max(8,rt(this.popFloor,8))&&e>=150?"stagnant":""}epoch(){var e;let t=((e=Gc[0])==null?void 0:e[1])??"genesis";for(const[n,i]of Gc)this.generation>=n&&(t=i);return t}population(){return this.cachedPop}activityCenterX(){const[t,e]=this.clampCam();let n=0,i=0;for(let r=0;r<this.viewH;r++){const o=(t+r)*this.worldW+e;for(let a=0;a<this.viewW;a++){const l=this.activity[o+a]??0;n+=l,i+=l*a}}return n<1||this.viewW<2?.5:i/n/(this.viewW-1)}viewportActivity(){const[t,e]=this.clampCam();let n=0;for(let i=0;i<this.viewH;i++){const r=(t+i)*this.worldW+e;for(let o=0;o<this.viewW;o++)n+=this.activity[r+o]??0}return n}timeDilation(){if(!this.autoCam)return 1;const t=this.viewportActivity();if(this.actBaseline<=0)return this.actBaseline=Math.max(t,1),1;const e=t>this.actBaseline?.015:.003;this.actBaseline=this.actBaseline*(1-e)+t*e;const n=t/Math.max(this.actBaseline,1);let i=n>1?Math.min(1.6,1+(n-1)*.7):.7+n*.3;return t<60&&(i=Math.min(i,.7)),this.dilation=this.dilation*.85+i*.15,this.dilation}sparkline(t=24){const e=this.popHistory;if(e.length<2)return"";const n=Math.max(0,e.length-t);let i=e[n]??0,r=i;for(let c=n;c<e.length;c++){const h=e[c]??0;h<i&&(i=h),h>r&&(r=h)}const o=Ws.length-1,a=Ws[Math.floor(Ws.length/2)]??"▅";let l="";for(let c=n;c<e.length;c++){const h=e[c]??0;l+=r===i?a:Ws[Math.trunc((h-i)/(r-i)*o)]??""}return l}}const wf=[[0,0,0],[205,0,0],[0,205,0],[205,205,0],[0,0,238],[205,0,205],[0,205,205],[229,229,229],[127,127,127],[255,0,0],[0,255,0],[255,255,0],[92,92,255],[255,0,255],[0,255,255],[255,255,255]],qo=[0,95,135,175,215,255];function is(s){if(s<16)return[...wf[s]??[0,0,0]];if(s<232){const e=s-16;return[qo[Math.floor(e/36)]??0,qo[Math.floor(e/6)%6]??0,qo[e%6]??0]}const t=8+(s-232)*10;return[t,t,t]}function Ii(s){return(255<<24|s[2]<<16|s[1]<<8|s[0])>>>0}function Wc(s){return`rgb(${s[0]},${s[1]},${s[2]})`}const Ko=[10,10,12],Ef="rgb(200,200,200)",ss="rgb(112,112,116)",$c=ai.length,rs=ai.map(s=>Ii(is(s))),Zo=Cn.map(s=>Ii(is(s))),Xc=tf.map(([s,t])=>[Ii(is(s)),Ii(is(t))]),Tf=ef.map(([s,t])=>[Ii(is(s)),Ii(is(t))]),Cr=Ii(Ko),Af='ui-monospace, "SF Mono", "Cascadia Mono", "DejaVu Sans Mono", Menlo, Consolas, monospace';let Rr=null;function Cf(s){if(Rr&&Rr.maxAge===s)return Rr.table;const t=new Uint8Array(s+1),e=Math.log1p(s);for(let n=1;n<=s;n++)t[n]=Math.min(Math.trunc(Math.log1p(n)/e*($c-1)),$c-1);return Rr={maxAge:s,table:t},t}function Xs(s){return s.toLocaleString("en-US")}class Rf{constructor(t){R(this,"cw",8);R(this,"cols",80);R(this,"rows",24);R(this,"statusRows",1);R(this,"keys",!0);R(this,"img",null);R(this,"widths",new Map);R(this,"px",null);R(this,"off",null);this.ctx=t}get gridRows(){return Math.max(1,this.rows-this.statusRows)}resize(t,e,n){this.cw=Math.max(2,Math.round(n)),this.cols=Math.max(20,Math.floor(t/this.cw)),this.rows=Math.max(6,Math.floor(e/(this.cw*2))),this.statusRows=this.cols>=150?1:2,this.keys=this.cols>=150,this.img=null,this.widths.clear()}status(t,e){const n=t.sparkline(this.cols<100?10:24),i=t.autoCam?"auto":"pan",r=rf[t.zoomLevel]??`${2**t.zoomLevel}x`,o=t.autoFocusMode?"[F]":"",a=t.haunted?"[HAUNTED]":"",l=e?` ${e}`:"",c=`  ${t.epoch()}  gen ${Xs(t.generation)}  pop ${Xs(t.population())}  ${n}`,h=this.keys?"  q r spc +/- arrows h z/x f g s  ":"  ",u=`${l} ${a}${o} ${r} ${i}${h}`;return this.statusRows===1?{left:c,right:u,tickerCol:Rn(c)+1,tickerWidth:this.cols-Rn(c)-Rn(u)-2}:{left:c,right:u,tickerCol:1,tickerWidth:this.cols-2}}render(t,e,n){const i=this.ctx,r=this.cw,o=this.cols*r,a=this.rows*r*2;i.fillStyle=Wc(Ko),i.fillRect(0,0,o,a),this.paintGrid(t),i.font=`${Math.round(r*1.62)}px ${Af}`,i.textBaseline="middle",n&&this.statsOverlay(t);const l=this.rows-1;if(this.statusRows===1)if(e.tickerWidth<10)this.text(`${e.left}  ${e.right}`.slice(0,this.cols-1),l,0,ss);else{this.text(e.left,l,0,ss),this.ticker(t,l,e);const c=this.cols-Rn(e.right);this.text([...e.right].slice(0,this.cols-1-c).join(""),l,c,ss)}else{const c=this.cols-1,h=Rn(e.left)+Rn(e.right)<=c?e.left+" ".repeat(c-Rn(e.left)-Rn(e.right))+e.right:`${e.left}  ${e.right}`;this.text([...h].slice(0,c).join(""),l-1,0,ss),this.ticker(t,l,e)}}paintGrid(t){const e=t.displayGrid(),n=t.displayAge(),i=Math.min(Math.floor(e.h/2),Math.floor(n.h/2),this.gridRows),r=Math.min(e.w,n.w,this.cols),o=this.cols,a=this.gridRows*2;(!this.img||this.img.width!==o||this.img.height!==a)&&(this.img=new ImageData(o,a),this.px=new Uint32Array(this.img.data.buffer),this.off=typeof OffscreenCanvas<"u"?new OffscreenCanvas(o,a):Object.assign(document.createElement("canvas"),{width:o,height:a}));const l=this.px;l.fill(Cr);let c=1;for(let E=0;E<n.data.length;E++)(n.data[E]??0)>c&&(c=n.data[E]??0);const h=Cf(c),u=t.haunted,d=t.zoomLevel>=0||u,f=u?Di:Wn,p=E=>Math.min(Math.max(-E-1,0),f-1),v=E=>h[Math.min(Math.max(E,0),c)]??0,m=E=>{var b;return u?((b=Xc[E])==null?void 0:b[0])??0:Zo[E]??0},g=E=>{var b;return u?((b=Xc[E])==null?void 0:b[1])??0:Cr};for(let E=0;E<i;E++){const b=2*E*e.w,P=b+e.w,y=2*E*n.w,T=y+n.w,I=2*E*o,D=I+o;for(let N=0;N<r;N++){const H=(e.data[b+N]??0)>0,Y=(e.data[P+N]??0)>0,k=n.data[y+N]??0,G=n.data[T+N]??0,z=d&&k<0,K=d&&G<0;if(!(H||Y||z||K))continue;let tt=Cr,ot=Cr;if((H||z)&&(Y||K))if(H&&Y)tt=rs[v(k)]??0,ot=rs[v(G)]??0;else if(z&&K){const at=p(k),pt=p(G);if(u){const zt=Tf[at*Di+pt];tt=(zt==null?void 0:zt[0])??0,ot=(zt==null?void 0:zt[1])??0}else tt=Zo[at]??0,ot=Zo[pt]??0}else H?tt=rs[v(k)]??0:ot=rs[v(G)]??0;else if(H)tt=rs[v(k)]??0;else if(Y)ot=rs[v(G)]??0;else if(z){const at=p(k);tt=m(at),ot=g(at)}else{const at=p(G);ot=m(at),tt=g(at)}l[I+N]=tt,l[D+N]=ot}}const x=this.off,A=x.getContext("2d",{willReadFrequently:!0});if(!A||!this.img)return;A.putImageData(this.img,0,0);const M=this.ctx;M.imageSmoothingEnabled=!1,M.drawImage(x,0,0,o*this.cw,a*this.cw)}ticker(t,e,n){const i=Vc.dim(t.generation)?ss:Ef;for(const r of t.ticker.messages){const o=Math.trunc(r.x),a=[...r.text],l=Math.max(o,0),c=Math.min(o+a.length,n.tickerWidth);l>=c||this.text(a.slice(l-o,c-o).join(""),e,n.tickerCol+l,i)}}statsOverlay(t){const e=t.lastCensus.size?[...t.lastCensus.entries()].sort((c,h)=>h[1]-c[1]).map(([c,h])=>`${h}×${c}`).join(" "):"none",n=36,i=11,r=this.cols-n-2,o=this.rows-(this.statusRows-1)-i-2;if(r<0||o<0)return;const a=["─".repeat(n-2)," infinity engine",` pop floor  : ${Xs(t.popFloor)}`,` spread/150 : ${Xs(t.spread)}`,` cycle       : ${t.cyclePeriod===0?"none":`period ${t.cyclePeriod}`}`,` injections  : ${t.totalInjections}`,` last event  : ${t.lastEvent||"none"}`,t.lastEvent?`   @ gen     : ${Xs(t.lastEventGen)}`:"               ",` world       : ${t.worldH}x${t.worldW}`,` census      : ${[...e].slice(0,n-16).join("")}`,` tempo       : ${(1/Math.max(t.dilation,.01)).toFixed(2)}x`],l=this.ctx;l.fillStyle=Wc(Ko),l.fillRect(r*this.cw,o*this.cw*2,n*this.cw,a.length*this.cw*2),a.forEach((c,h)=>{const u=[...` ${c}`.padEnd(n)].slice(0,n).join("");this.text(u,o+h,r,ss)})}text(t,e,n,i){const r=this.ctx,o=this.cw,a=e*o*2;r.fillStyle=i;let l=n;for(const c of t){if(l>=this.cols)break;if(l>=0&&c!==" "){const h=Ws.indexOf(c);if(h>=0){const u=Math.max(1,Math.round(o*2*(h+1)/8));r.fillRect(l*o,a+o*2-u,o,u)}else if(c==="─")r.fillRect(l*o,a+o-Math.max(1,Math.round(o/8))/2,o,Math.max(1,Math.round(o/8)));else{let u=this.widths.get(c);u===void 0&&(u=r.measureText(c).width,this.widths.set(c,u)),r.fillText(c,l*o+o/2-u/2,a+o)}}l++}}}const It=512,Wt=384,Zt='"Libertinus Mono", "LibertinusMono", ui-monospace, monospace',Yc='"Love Letter Typewriter", "Libertinus Mono", monospace';function Pf(s,t,e){t();const n=typeof document<"u"?document.fonts:void 0,i=(Array.isArray(s)?s:[s]).filter(r=>n&&!n.check(r));!n||!i.length||Promise.all(i.map(r=>n.load(r))).then(()=>{t(),e==null||e()},()=>{})}let Jo=0;try{(Gd=document.fonts)==null||Gd.addEventListener("loadingdone",()=>Jo++)}catch{}class vn{constructor(t,e){R(this,"canvas");R(this,"ctx");R(this,"fps",15);R(this,"idleFps",0);R(this,"settled",!1);R(this,"attended",!1);R(this,"acc",1);R(this,"since",0);R(this,"lastKey",null);R(this,"keyEpoch",-1);R(this,"keyed",!1);R(this,"version",0);this.site=t,this.env=e,this.canvas=document.createElement("canvas"),this.canvas.width=It,this.canvas.height=Wt;const n=this.canvas.getContext("2d",{alpha:!1,willReadFrequently:!0});if(!n)throw new Error("oikos: no 2d context");this.ctx=n}tick(t,e,n,i=1,r=!1){this.acc+=e,this.since+=e;const o=!n&&!r&&this.settled&&this.idleFps>0,l=1/(n?Math.max(this.fps,30):Math.min(o?this.idleFps:this.fps,this.fps*i));if(this.acc<l-1e-4)return!1;this.acc=this.acc-l>l?0:this.acc-l;const c=this.since;this.since=0,this.attended=n||r,this.keyed=!1;const h=this.draw(t,c);return this.keyed||(this.lastKey=null),h===!1?!1:(this.version++,!0)}unchanged(...t){const e=this.lastKey,n=e!==null&&this.keyEpoch===Jo&&e.length===t.length&&t.every((i,r)=>Object.is(i,e[r]));return this.lastKey=t,this.keyEpoch=Jo,this.keyed=!0,n}clear(t){this.ctx.fillStyle=t,this.ctx.fillRect(0,0,It,Wt)}wrap(t,e,n=1/0){const i=this.ctx,r=t.split(/\s+/).filter(Boolean),o=[];let a="";for(const l of r){const c=a?`${a} ${l}`:l;if(i.measureText(c).width>e&&a){if(o.push(a),a=l,o.length>=n)break}else a=c}if(a&&o.length<n&&o.push(a),o.length===n&&o.join(" ").length<r.join(" ").length){let l=o[n-1]??"";for(;l&&i.measureText(`${l}…`).width>e;)l=l.replace(/\s*\S*$/,"");o[n-1]=`${l}…`}return o}condensed(t,e,n,i=.72,r="left"){const o=this.ctx;o.save(),o.translate(e,n),o.scale(i,1),o.textAlign=r,o.fillText(t,0,0),o.restore()}spaced(t,e,n,i,r="left"){const o=this.ctx,a=[...t],l=a.map(u=>o.measureText(u).width),c=l.reduce((u,d)=>u+d,0)+i*(a.length-1);let h=r==="center"?e-c/2:e;o.save(),o.textAlign="left",a.forEach((u,d)=>{o.fillText(u,h,n),h+=(l[d]??0)+i}),o.restore()}}function jo(s){let t=2166136261;for(let e=0;e<s.length;e++)t^=s.charCodeAt(e),t=Math.imul(t,16777619);return(t>>>0)%1e5/1e5}function Ui(s){let t=s>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Lf(s){return Math.round(s).toLocaleString("en-US")}const Df=15,If=8,Uf={minH:0,minW:0};class Nf extends vn{constructor(e,n){super(e,n);R(this,"term");R(this,"life",null);R(this,"seenSave");R(this,"genAcc",1);this.fps=15,this.term=new Rf(this.ctx),this.term.resize(It,Wt,8)}sync(){var r;const e=this.env.feeds.universe.value;if(this.life&&(e==null?void 0:e.savedAt)===((r=this.seenSave)==null?void 0:r.savedAt))return;this.seenSave=e;const n=e?cf():null,i=new Sf(this.term.gridRows,this.term.cols,!n,Uf);n&&(i.adopt(n),i.ticker.queueSpecial(`the universe remembers generation ${i.generation.toLocaleString("en-US")}`)),this.life=i}draw(e,n){this.sync();const i=this.life;if(!i)return!1;const r=1/(this.attended?Df:If);if(this.genAcc+=n,this.genAcc<r)return!1;this.genAcc=Math.min(this.genAcc-r,r),i.step(),i.generation>0&&i.generation%150===0&&i.takeCensus();const o=this.term.status(i,"");return o.tickerWidth>=10&&i.tickTicker(o.tickerWidth),this.term.render(i,o,!1),!0}}const hi=62,Ys=21,kf=It/hi,Ff=12.4,Of=42,Qo=" .,:;-=+*#%@";function Bf(){const s=[];for(let e=0;e<16;e++)s.push([e&1?1:-1,e&2?1:-1,e&4?1:-1,e&8?1:-1]);const t=[];for(let e=0;e<16;e++)for(let n=0;n<4;n++){const i=e^1<<n;if(i<e)continue;const r=s[e],o=s[i];if(!(!r||!o))for(let a=0;a<=18;a++){const l=a/18;t.push([r[0]+(o[0]-r[0])*l,r[1]+(o[1]-r[1])*l,r[2]+(o[2]-r[2])*l,r[3]+(o[3]-r[3])*l])}}return t}function zf(){const s=[];for(let e=0;e<44;e++)for(let n=0;n<44;n++){const i=e/44*Math.PI*2,r=n/44*Math.PI*2;s.push([Math.cos(i)*1.3,Math.sin(i)*1.3,Math.cos(r)*1.3,Math.sin(r)*1.3])}return s}const ta=[Bf(),zf()];class Hf extends vn{constructor(e,n){super(e,n);R(this,"gen",null);R(this,"seq",0);R(this,"depth",new Float32Array(hi*Ys));R(this,"glyph",new Uint8Array(hi*Ys));this.fps=15}generate(e){const n=this.env.feeds.apeiron.value,i=Math.floor(Math.random()*2**31),r=Ui(i),{prompt:o,template:a}=n?Gf(n,r):{prompt:"",template:"waking"},l=(i>>>0).toString(16).padStart(8,"0").replace(/(....)(....)/,"$1·$2");return{prompt:o,template:a,coordinate:l,hue:n?Math.floor(jo(o)*360):135,figure:ta[this.seq++%ta.length]??ta[0]??[],bornAt:e}}draw(e){(!this.gen||e-this.gen.bornAt>9||!this.gen.prompt&&this.env.feeds.apeiron.value)&&(this.gen=this.generate(e));const n=this.gen,i=this.ctx,r=`hsl(${n.hue} 100% 58%)`,o=`hsl(${n.hue} 100% 76%)`,a=`hsl(${n.hue} 60% 22%)`,l=i.createRadialGradient(It/2,Wt*.4,20,It/2,Wt*.4,It*.7);l.addColorStop(0,`hsl(${n.hue} 60% 7%)`),l.addColorStop(1,"#030309"),i.fillStyle=l,i.fillRect(0,0,It,Wt),i.font=`12px ${Zt}`,i.fillStyle=r,i.fillText("apeiron",14,22),i.fillStyle=a,i.fillText("·  æthera",76,22),i.textAlign="right",i.fillStyle=r,i.fillText(n.template.replace(/_/g," "),It-14,22),i.textAlign="left",this.raster(e,n.figure),i.font=`12px ${Zt}`;for(let d=0;d<Ys;d++)for(let f=0;f<hi;f++){const p=this.glyph[d*hi+f]??0;p&&(i.fillStyle=p>9?o:p>4?r:a,i.fillText(Qo[p]??".",f*kf,Of+d*Ff+10))}const c=e-n.bornAt,h=n.prompt||"reading the grammar…";i.font=`12px ${Zt}`;const u=this.wrap(h.slice(0,Math.floor(c*70)),It-28,4);i.fillStyle="rgba(3,3,9,0.7)",i.fillRect(0,Wt-98,It,98),i.fillStyle=a,i.fillRect(14,Wt-98,It-28,1),i.fillStyle=o,u.forEach((d,f)=>i.fillText(d,14,Wt-78+f*15)),i.fillStyle=r,i.font=`11px ${Zt}`,i.fillText(`⌖ ${n.coordinate}`,14,Wt-12)}raster(e,n){this.depth.fill(-1/0),this.glyph.fill(0);const i=e*.45,r=e*.31,o=e*.23,[a,l,c,h,u,d]=[Math.cos(i),Math.sin(i),Math.cos(r),Math.sin(r),Math.cos(o),Math.sin(o)];for(const f of n){let[p,v,m,g]=f;[p,g]=[p*a-g*l,p*l+g*a],[v,m]=[v*c-m*h,v*h+m*c],[m,g]=[m*u-g*d,m*d+g*u];const x=2.6/(3.2-g);p*=x,v*=x,m*=x;const A=3.4/(4.6-m),M=Math.round(hi/2+p*A*11.5),E=Math.round(Ys/2+v*A*5.6);if(M<0||M>=hi||E<0||E>=Ys)continue;const b=E*hi+M;m>(this.depth[b]??-1/0)&&(this.depth[b]=m,this.glyph[b]=Math.max(1,Math.min(Qo.length-1,Math.round((m+2.2)/4.4*(Qo.length-1)))))}}}function Gf(s,t){const e=s.templates[Math.floor(t()*s.templates.length)];return e?{prompt:e.structure.replace(/\{(\w+)\}/g,(i,r)=>{var a;const o=s.components[r];return o!=null&&o.length?((a=o[Math.floor(t()*o.length)])==null?void 0:a.word)??r:r.replace(/_/g," ")}),template:e.id}:{prompt:"",template:""}}const ea="#e8e2d4",na="#a39d90",qc="#5d5850",Ni=34,os=250,ki=84,Pr=Wt-ki-22;class Vf extends vn{constructor(e,n){super(e,n);R(this,"standIn");this.fps=10,this.idleFps=4,this.settled=!0,this.standIn=Wf()}draw(e){const n=this.ctx;this.clear("#070707"),n.fillStyle=ea,n.font=`22px ${Zt}`,this.spaced("chronicle",It/2,38,11,"center"),n.fillStyle=na,n.font=`11px ${Zt}`,this.spaced("what the dream remembers",It/2,60,2,"center");const r=[...this.env.feeds.chronicle.value.strata].reverse();if(n.fillStyle="#000",n.fillRect(Ni-1,ki-1,os+2,Pr+2),n.imageSmoothingEnabled=!0,r.length){const l=r.map((u,d)=>Math.pow(.6,d)),c=l.reduce((u,d)=>u+d,0);let h=ki;r.forEach((u,d)=>{const f=Pr*(l[d]??0)/c;n.save(),n.translate(Ni,h+f),n.scale(1,-1),n.drawImage(u,0,0,os,f),n.restore(),h+=f,n.fillStyle="rgba(232,226,212,0.08)",n.fillRect(Ni,h,os,1)})}else n.globalAlpha=.75,n.drawImage(this.standIn,Ni,ki,os,Pr),n.globalAlpha=1;const o=ki+e*14%Pr,a=n.createLinearGradient(0,o-16,0,o+2);a.addColorStop(0,"rgba(232,226,212,0)"),a.addColorStop(1,"rgba(232,226,212,0.22)"),n.fillStyle=a,n.fillRect(Ni,o-16,os,18),n.fillStyle="rgba(232,226,212,0.5)",n.fillRect(Ni-6,o,4,1),this.log(e)}log(e){const n=this.ctx,i=this.env.feeds.chronicle.value,r=Ni+os+24,o=It-r-18;n.font=`11px ${Zt}`,n.fillStyle=qc,n.fillText(i.known?`${i.eraCount||i.eras.length} eras`:"reading the core…",r,ki+8);const a=[...i.eras].reverse().slice(0,7);let l=ki+34;if(!a.length){n.fillStyle=na;for(const c of this.wrap("every fifteen seconds of the dream settles here as one line of its own colour.",o,6))n.fillText(c,r,l),l+=15;return}for(const c of a){if(l>Wt-30)break;const h=new Date(c.t0*1e3);n.fillStyle=c.open?ea:qc,n.font=`10px ${Zt}`;const u=`${h.getHours().toString().padStart(2,"0")}:${h.getMinutes().toString().padStart(2,"0")}`;n.fillText(c.open?`${u}  now`:u,r,l),c.open&&(n.fillStyle=Math.sin(e*3)>0?"#d6c9a8":"#6d6555",n.fillRect(r-10,l-6,4,4)),n.font=`12px ${Zt}`,n.fillStyle=c.open?ea:na;const d=this.wrap(c.title||"untitled",o,2);d.forEach((f,p)=>n.fillText(f,r,l+15+p*14)),l+=22+d.length*14}}}function Wf(){const s=document.createElement("canvas");s.width=64,s.height=240;const t=s.getContext("2d");if(!t)return s;const e=Ui(1729),n=["#5c3b36","#7a4f45","#3f3a4c","#8a6f64","#2d4a4f","#6b2c3a","#a38a74","#40302c"];let i=n[0];for(let r=0;r<s.height;r++){e()<.12&&(i=n[Math.floor(e()*n.length)]??i),t.fillStyle=i,t.fillRect(0,r,s.width,1);for(let o=0;o<6;o++)t.fillStyle=`rgba(255,255,255,${e()*.08})`,t.fillRect(e()*s.width,r,e()*12,1)}return s}const $f="#07050b",ia="#d59bff",Lr="#4d3a63",sa="#e9e0f5",Fi="#8a7b9e",ui={x:18,y:54,w:128,h:74,label:"KEYFRAME N-1"},qe={x:192,y:54,w:128,h:74,label:"KEYFRAME N"},di={x:366,y:54,w:128,h:74,label:"FRESH FRAME"},Oi={x:18,y:176,w:302,h:52,label:"INTERPOLATION"},Dr={x:340,y:150,w:154,h:104,label:"COLLAPSE PREVENTION"};class Xf extends vn{constructor(t,e){super(t,e),this.fps=15}box(t,e){const n=this.ctx;n.strokeStyle=e>0?ia:Lr,n.globalAlpha=.5+e*.5,n.lineWidth=1,n.strokeRect(t.x+.5,t.y+.5,t.w,t.h),n.globalAlpha=1,n.font=`10px ${Zt}`,n.fillStyle=e>0?sa:Fi,n.fillText(t.label,t.x+6,t.y+13)}arrow(t,e,n,i,r,o){const a=this.ctx;a.strokeStyle=Lr,a.beginPath(),a.moveTo(t,e),a.lineTo(n,i),a.stroke();const l=Math.sign(n-t||i-e);if(a.fillStyle=Lr,a.beginPath(),e===i?(a.moveTo(n,i),a.lineTo(n-6*l,i-4),a.lineTo(n-6*l,i+4)):(a.moveTo(n,i),a.lineTo(n-4,i-6*l),a.lineTo(n+4,i-6*l)),a.fill(),o>=0&&o<=1){const c=t+(n-t)*o,h=e+(i-e)*o,u=a.createRadialGradient(c,h,0,c,h,8);u.addColorStop(0,"rgba(213,155,255,1)"),u.addColorStop(1,"rgba(213,155,255,0)"),a.fillStyle=u,a.fillRect(c-8,h-8,16,16)}r&&(a.font=`9px ${Zt}`,a.fillStyle=Fi,a.textAlign="center",a.fillText(r,(t+n)/2,e===i?e-6:(e+i)/2),a.textAlign="left")}draw(t){const e=this.ctx,n=this.env.feeds.chronicle.value,i=6,r=t%i/i,o=400+Math.floor(t/i),a=Math.sin(t*.8)>.6?1:0,l=16,c=r>=.5?Math.floor((r-.5)/.5*l):0;if(r>=.5&&n.thumb&&this.unchanged(o,c,a,n))return!1;if(this.clear($f),e.font=`14px ${Zt}`,e.fillStyle=ia,e.fillText("dream_gen",18,28),e.font=`10px ${Zt}`,e.fillStyle=Fi,e.fillText("an endless diffusion stream",110,28),e.textAlign="right",e.fillText(`kf ${String(o).padStart(5,"0")}`,It-18,28),e.textAlign="left",this.box(ui,r<.25?1:0),this.box(qe,r>=.25&&r<.5?1:.2),this.box(di,0),this.box(Oi,r>=.5?1:0),this.box(Dr,a),n.thumb)e.drawImage(n.thumb,qe.x+6,qe.y+18,qe.w-12,(qe.w-12)/2),e.globalAlpha=.35,e.drawImage(n.thumb,ui.x+6,ui.y+18,ui.w-12,(ui.w-12)/2),e.globalAlpha=1;else for(const d of[ui,qe]){const f=e.createLinearGradient(d.x,d.y,d.x+d.w,d.y+d.h);f.addColorStop(0,`hsl(${(t*8+d.x)%360} 40% 30%)`),f.addColorStop(1,`hsl(${(t*8+d.x+90)%360} 40% 18%)`),e.fillStyle=f,e.fillRect(d.x+6,d.y+18,d.w-12,(d.w-12)/2)}e.fillStyle="#1b1426",e.fillRect(di.x+6,di.y+18,di.w-12,(di.w-12)/2),e.fillStyle=Fi,e.font=`9px ${Zt}`,e.fillText("txt2img on swap",di.x+10,di.y+50),this.arrow(ui.x+ui.w,91,qe.x,91,"img2img",r<.25?r/.25:-1),this.arrow(di.x,91,qe.x+qe.w,91,"",-1),this.arrow(qe.x+qe.w/2,qe.y+qe.h,qe.x+qe.w/2,Oi.y,"",r>=.25&&r<.5?(r-.25)/.25:-1);for(let d=0;d<l;d++)e.fillStyle=d<c?ia:"#1e1629",e.fillRect(Oi.x+8+d*18,Oi.y+22,14,18);e.fillStyle=Fi,e.font=`9px ${Zt}`,e.textAlign="right",e.fillText(`${c}/${l} → stream`,Oi.x+Oi.w-6,Oi.y+13),e.textAlign="left",[["1 mutation","BEND 0.7"],["2 cache","blend ~60%"],["3 swap","fresh txt2img"]].forEach(([d,f],p)=>{const v=Dr.y+34+p*22;e.fillStyle=sa,e.font=`10px ${Zt}`,e.fillText(d,Dr.x+8,v),e.fillStyle=Fi,e.fillText(f,Dr.x+78,v)}),e.fillStyle="rgba(20,12,30,0.8)",e.fillRect(0,Wt-110,It,110),e.fillStyle=Lr,e.fillRect(18,Wt-110,It-36,1),e.font=`10px ${Zt}`,e.fillStyle=Fi,e.fillText(n.prompt?`prompt${n.template?` · ${n.template}`:""}`:"prompt",18,Wt-92),e.font=`12px ${Zt}`,e.fillStyle=sa;const u=n.prompt||"the dreamer is asleep; its last prompt will appear here when the chronicle has one.";this.wrap(u,It-36,5).forEach((d,f)=>e.fillText(d,18,Wt-72+f*15))}}const qs=new Image;qs.src="/static/oikos/stage.jpg";const un=372,dn=186,Kc=(It-un)/2,Zc=118;class Yf extends vn{constructor(e,n){super(e,n);R(this,"frame",document.createElement("canvas"));R(this,"fctx");R(this,"prev",null);R(this,"cur",null);R(this,"swapAt",0);this.fps=20,this.idleFps=5,this.frame.width=un,this.frame.height=dn;const i=this.frame.getContext("2d",{willReadFrequently:!0});if(!i)throw new Error("oikos: no 2d context");this.fctx=i}draw(e){const n=this.ctx;this.clear("#120406"),qs.complete&&qs.naturalWidth&&(n.globalAlpha=.95,n.drawImage(qs,0,0,It,Wt),n.globalAlpha=1);const i=this.env.feeds.chronicle.value;i.thumb&&i.thumb!==this.cur&&(this.prev=this.cur,this.cur=i.thumb,this.swapAt=e);const r=this.fctx;if(r.globalCompositeOperation="source-over",r.globalAlpha=1,this.cur){const a=Math.min(1,(e-this.swapAt)/2.5);this.prev&&a<1&&this.kenBurns(this.prev,e-20),r.globalAlpha=this.prev?a:1,this.kenBurns(this.cur,e),r.globalAlpha=1,this.settled=a>=1&&qs.complete}else this.standIn(e),this.settled=!1;const o=r.createRadialGradient(un/2,dn/2,dn*.25,un/2,dn/2,un*.56);o.addColorStop(0,"rgba(0,0,0,1)"),o.addColorStop(.72,"rgba(0,0,0,0.9)"),o.addColorStop(1,"rgba(0,0,0,0)"),r.globalCompositeOperation="destination-in",r.fillStyle=o,r.fillRect(0,0,un,dn),r.globalCompositeOperation="source-over",n.save(),n.globalCompositeOperation="lighter",n.globalAlpha=.18,n.drawImage(this.frame,Kc-30,Zc+dn-20,un+60,90),n.restore(),n.drawImage(this.frame,Kc,Zc),this.status(e),n.fillStyle="rgba(8,4,4,0.72)",n.fillRect(0,Wt-34,It,34),n.fillStyle="#efe6d2",n.font=`12px ${Zt}`,this.spaced("NOW SHOWING · A DREAM · ALL NIGHT",It/2,Wt-13,3,"center")}kenBurns(e,n){const i=1.06+.05*Math.sin(n*.07),r=Math.sin(n*.05)*10,o=Math.cos(n*.043)*5,a=un*i,l=dn*i;this.fctx.drawImage(e,(un-a)/2+r,(dn-l)/2+o,a,l)}standIn(e){const n=this.fctx,i=n.createLinearGradient(0,0,0,dn);i.addColorStop(0,"#3a2440"),i.addColorStop(1,"#170d1c"),n.fillStyle=i,n.fillRect(0,0,un,dn);const r=[12,330,280,20,350];for(let o=0;o<5;o++){const a=e*(.11+o*.03)+o*1.7,l=un/2+Math.cos(a)*(60+o*14)*(o%2?1:-1),c=dn/2+Math.sin(a*1.3)*30,h=52+22*Math.sin(a*.7+o),u=n.createRadialGradient(l,c,0,l,c,h);u.addColorStop(0,`hsla(${r[o]} 90% 66% / 0.75)`),u.addColorStop(1,`hsla(${r[o]} 90% 50% / 0)`),n.fillStyle=u,n.fillRect(0,0,un,dn)}}status(e){const n=this.ctx,i=this.env.feeds.dreams.value,r=this.env.feeds.chronicle.value;n.font=`12px ${Zt}`;let o,a;i.known&&i.awake?(a=Math.sin(e*4)>0?"#ff3b3b":"#6a1010",o=`LIVE  frame ${Lf(i.frame)}${i.viewers?`  ·  ${i.viewers} watching`:""}`):i.known?(a="#5a5a5a",o=r.thumb?"asleep  ·  last remembered":"asleep  ·  wakes when watched"):(a="#3a3a3a",o=r.thumb?"last remembered":"no signal");const l=n.measureText(o).width+34;n.fillStyle="rgba(0,0,0,0.55)",n.fillRect(14,14,l,24),n.fillStyle=a,n.beginPath(),n.arc(27,26,4.5,0,Math.PI*2),n.fill(),n.fillStyle="#f2e9dc",n.fillText(o,38,30)}}const qf="#04060c",Jc="#9fc6ff",Ks="#3d5378",Zs="#c9d1d9",Kf="#a5e3b5",ra="#ffc387",jc=[["GET","/api/dreams/status","how it is (never wakes it)"],["WS ","/ws/dreams","the dream itself, h264"],["GET","/api/dreams/stream","MPEG-TS"],["SSE","/api/dreams/sse","events"],["GET","/api/dreams/embed","take it with you"]];class Zf extends vn{constructor(e,n){super(e,n);R(this,"askedAt",-10);R(this,"lastRaw");this.fps=12}draw(e){const n=this.ctx,i=this.env.feeds.dreams.value.raw;i!==this.lastRaw&&(this.lastRaw=i,this.askedAt=e);const r=e-this.askedAt,o=`curl -s ${location.host}/api/dreams/status`,a=o.slice(0,Math.floor(r*38)),l=a.length<o.length||Math.floor(e*2)%2===1,c=Math.min(12,Math.floor((r-o.length/38)*30)),h=Math.floor(e/2.5)%jc.length;if(this.unchanged(i,a.length,l,c,h))return!1;this.clear(qf),n.font=`13px ${Zt}`,n.fillStyle=Ks,n.fillText("$",16,28),n.fillStyle=Jc,n.fillText(a+(l?"▌":""),32,28),a.length>=o.length&&(i?Jf(i,11):[[{text:"curl: (52) the dream did not answer",color:"#e58a8a"}]]).slice(0,c).forEach((f,p)=>{let v=16;for(const m of f)n.fillStyle=m.color,n.fillText(m.text,v,52+p*17),v+=n.measureText(m.text).width});const u=Wt-128;n.fillStyle="rgba(159,198,255,0.06)",n.fillRect(10,u-20,It-20,138),n.strokeStyle="rgba(159,198,255,0.25)",n.strokeRect(10.5,u-19.5,It-21,137),n.font=`11px ${Zt}`,n.fillStyle=Ks,n.fillText("ENDPOINTS",20,u-4),jc.forEach(([d,f,p],v)=>{const m=u+16+v*19;n.fillStyle=h===v?ra:Ks,n.fillText(d,20,m),n.fillStyle=h===v?"#ffffff":Jc,n.fillText(f,58,m),n.fillStyle=Ks,n.fillText(p,250,m)})}}function Jf(s,t){const e=[],n=(i,r,o,a)=>{if(e.length>=t)return;const l=[{text:r,color:Zs}];o!==null&&l.push({text:`"${o}": `,color:Zs});const c=a?"":",";if(i&&typeof i=="object"&&!Array.isArray(i)){const d=Object.entries(i);e.push([...l,{text:"{",color:Zs}]),d.forEach(([f,p],v)=>n(p,`${r}  `,f,v===d.length-1)),e.length<t&&e.push([{text:`${r}}${c}`,color:Zs}]);return}let h,u;typeof i=="string"?(h=`"${i}"`,u=Kf):Array.isArray(i)?(h=JSON.stringify(i),u=ra):(h=String(i),u=ra),e.push([...l,{text:h,color:u},{text:c,color:Zs}])};return n(s,"",null,!0),e.length>=t&&(e[t-1]=[{text:"  …",color:Ks}]),e}const Oe={bg:"#181522",screen:"#231f36",fg:"#c9d1d9",dim:"#6e7681",sys:"#8b949e",quit:"#f85149",action:"#a371f7",join:"#3fb950"},Qc=["#58a6ff","#3fb950","#d29922","#a371f7","#f778ba","#39c5cf","#ff7b72","#7ee787","#ffa657","#79c0ff","#d2a8ff","#56d364"];function jf(s){let t=0;for(const e of s)t=t*31+e.charCodeAt(0)>>>0;return Qc[t%Qc.length]??Oe.fg}function Qf(s){const t=[{text:`[${s.stamp}] `,color:Oe.dim}],e=s.nick,n=s.content;switch(s.type){case"message":t.push({text:`<${e}> `,color:jf(e)},{text:n,color:Oe.fg});break;case"action":t.push({text:`* ${e} ${n}`,color:Oe.action});break;case"quit":t.push({text:`⫫ ${e} has quit${n?` (${n})`:""}`,color:Oe.quit});break;case"part":t.push({text:`← ${e} has left${n?` (${n})`:""}`,color:Oe.sys});break;case"join":t.push({text:`→ ${e} has joined`,color:Oe.join});break;case"kick":{const i=s.reason||n;t.push({text:`⚠ ${s.target?`${s.target} was kicked by ${e}`:`${e} kicked someone`}${i?` (${i})`:""}`,color:Oe.quit})}break;default:t.push({text:`*** ${n||e}`,color:Oe.sys})}return t}const th=16,as=16,oa=50;class tp extends vn{constructor(e,n){super(e,n);R(this,"laidOut",[]);R(this,"seen",-1);this.fps=15}layout(){const e=this.env.feeds.irc.value;e.version!==this.seen&&(this.seen=e.version,this.ctx.font=`12.5px ${Zt}`,this.laidOut=e.lines.map(n=>({rows:this.wrapChunks(Qf(n),It-as*2),at:n.at})))}wrapChunks(e,n){var a;const i=this.ctx,r=[[]];let o=0;for(const l of e)for(const c of l.text.split(/(\s+)/)){if(!c)continue;const h=i.measureText(c).width;o+h>n&&o>0&&c.trim()&&(r.push([{text:"    ",color:l.color}]),o=i.measureText("    ").width),(a=r[r.length-1])==null||a.push({text:c,color:l.color}),o+=h}return r}draw(e){var p;this.layout();const n=this.ctx,i=this.env.feeds.irc.value,r=Math.sin(e*3)>-.3,o=performance.now(),a=this.laidOut.length>0&&o-(((p=this.laidOut[this.laidOut.length-1])==null?void 0:p.at)??0)<600;if(!i.collapse&&!a&&this.unchanged(i,r))return!1;this.clear(Oe.bg),n.fillStyle=Oe.screen,n.fillRect(6,6,It-12,Wt-12),n.fillStyle="rgba(88,166,255,0.1)",n.fillRect(6,6,It-12,28),n.font=`13px ${Zt}`,n.fillStyle="#58a6ff",n.fillText("#aethera",as,25),n.fillStyle=Oe.dim,n.font=`11px ${Zt}`,n.textAlign="right";const l=i.connected?r?"● live":"○ live":"○ connecting…";n.fillStyle=i.connected?Oe.join:Oe.dim,n.fillText(l,It-as,25),n.textAlign="left";const c=i.collapse?Math.min(1,(performance.now()-i.collapse.at)/1500):0;n.font=`12.5px ${Zt}`;const h=[],u=performance.now();for(const v of this.laidOut)for(const m of v.rows)h.push({chunks:m,fresh:Math.max(0,1-(u-v.at)/600)});const d=Math.floor((Wt-oa-12)/th),f=h.slice(-d);f.length||(n.fillStyle=Oe.sys,n.fillText(i.connected?"*** the channel is quiet between fragments":"*** connecting to #aethera…",as,oa+12)),f.forEach((v,m)=>{let g=as;const x=oa+12+m*th,A=c?Math.sin(x*.3+e*40)*8*c*(Math.random()<.3?1:0):0;for(const M of v.chunks)n.fillStyle=c>.2&&Math.random()<c*.4?Oe.quit:M.color,n.globalAlpha=1-v.fresh*.6,n.fillText(M.text,g+A,x),g+=n.measureText(M.text).width;n.globalAlpha=1}),i.collapse&&(n.fillStyle=`rgba(248,81,73,${.08*c})`,n.fillRect(0,0,It,Wt),n.fillStyle=Oe.quit,n.font=`11px ${Zt}`,n.textAlign="right",n.fillText(`*** ${i.collapse.type}`,It-as,Wt-14),n.textAlign="left")}}const ep={pelos:"#8c6a4f",halon:"#6fa8a0",keramai:"#c2803a",chalkis:"#7d4a86",pyrrha:"#d14e3c",elektra:"#e0b33a",daphnaia:"#4e8b4a",ouranis:"#3d5fa8"},eh=[["Arche",null,0],["Ostrakon Row","pelos",60],["Grammateion",null,0],["Pelos Walk","pelos",60],["Eisphora",null,0],["Boreas Gate",null,200],["Halas Steps","halon",100],["Moira",null,0],["Tarichos Street","halon",100],["Limen Approach","halon",120],["Desmoterion",null,0],["Kerameikos Walk","keramai",140],["Pyrphoros",null,150],["Amphora Yard","keramai",140],["Pithos Street","keramai",160],["Eos Gate",null,200],["Chalkeion Gate","chalkis",180],["Grammateion",null,0],["Akmon Court","chalkis",180],["Orichalkon Row","chalkis",200],["Temenos",null,0],["Kaminos Way","pyrrha",220],["Moira",null,0],["Pyrrha Rise","pyrrha",220],["Phlox Avenue","pyrrha",240],["Notos Gate",null,200],["Elektron Quay","elektra",260],["Helios Terrace","elektra",260],["Krene",null,150],["Lampter Mile","elektra",280],["Kerux",null,0],["Daphne Green","daphnaia",300],["Myrtos Park","daphnaia",300],["Grammateion",null,0],["Kotinos Crown","daphnaia",320],["Zephyros Gate",null,200],["Moira",null,0],["Astron Hill","ouranis",350],["Choregia",null,0],["Ouranos Point","ouranis",400]],fi=[{name:"ada",model:!1,color:"#f2efe6"},{name:"claude",model:!0,color:"#d97757"},{name:"tomas",model:!1,color:"#6fb3e0"},{name:"gemma",model:!0,color:"#9be07a"}];function aa(s){return s<=10?[10-s,10]:s<=20?[0,10-(s-10)]:s<=30?[s-20,0]:[10,s-30]}const nh=17,np=It/2,la=168;function _n(s,t){const e=(s-5.5)*nh,n=(t-5.5)*nh;return[np+(e-n)*.72,la+(e+n)*.42]}class ip extends vn{constructor(e,n){super(e,n);R(this,"pos",[0,0,0,0]);R(this,"hop",{seat:0,from:0,left:0,k:0});R(this,"dice",[3,4]);R(this,"owner",new Map);R(this,"log",["A new game begins with 4 players."]);R(this,"turn",0);R(this,"wait",1.2);R(this,"rand",Ui(4242));this.fps=20}say(e){this.log=[...this.log,e].slice(-3)}step(e){var o;if(this.hop.left>0){this.hop.k+=e/.16,this.hop.k>=1&&(this.hop.k=0,this.hop.left--,this.pos[this.hop.seat]=((this.pos[this.hop.seat]??0)+1)%40,this.hop.left===0&&this.land(this.hop.seat));return}if(this.wait-=e,this.wait>0)return;const n=this.turn%fi.length,i=1+Math.floor(this.rand()*6),r=1+Math.floor(this.rand()*6);this.dice=[i,r],this.say(`${(o=fi[n])==null?void 0:o.name} rolls ${i} and ${r}.`),this.hop={seat:n,from:this.pos[n]??0,left:i+r,k:0},this.turn++,this.wait=1.6}land(e){var c,h;const n=this.pos[e]??0,[i,r,o]=eh[n]??["",null,0],a=((c=fi[e])==null?void 0:c.name)??"",l=this.owner.get(n);if(o&&l===void 0&&this.rand()<.75)this.owner.set(n,e),this.say(`${a} buys ${i} for ₯${o}.`);else if(l!==void 0&&l!==e){const u=Math.max(2,Math.round(o/(r?12:8)));this.say(`${a} pays ₯${u} to ${(h=fi[l])==null?void 0:h.name} for ${i}.`)}else i==="Moira"||i==="Grammateion"?this.say(`${a} draws from ${i}.`):i==="Kerux"&&(this.say(`${a} is sent to the Desmoterion.`),this.pos[e]=10);this.owner.size>22&&this.owner.clear()}draw(e,n){var c;if(this.step(Math.min(n,.2)),this.hop.left===0&&this.unchanged(this.log,this.dice,this.turn,this.owner.size,this.pos[0],this.pos[1],this.pos[2],this.pos[3]))return!1;const i=this.ctx,r=i.createRadialGradient(It/2,la,40,It/2,la,It*.7);r.addColorStop(0,"#2a241f"),r.addColorStop(1,"#141210"),i.fillStyle=r,i.fillRect(0,0,It,Wt);const o=[_n(-.4,-.4),_n(11.4,-.4),_n(11.4,11.4),_n(-.4,11.4)];i.fillStyle="rgba(0,0,0,0.45)",i.beginPath(),o.forEach(([h,u],d)=>d?i.lineTo(h,u+8):i.moveTo(h,u+8)),i.fill(),i.fillStyle="#d9ccb2",i.beginPath(),o.forEach(([h,u],d)=>d?i.lineTo(h,u):i.moveTo(h,u)),i.fill();for(let h=0;h<40;h++){const[u,d]=aa(h),[,f]=eh[h]??["",null,0],p=[_n(u,d),_n(u+1,d),_n(u+1,d+1),_n(u,d+1)];i.fillStyle=f?ep[f]??"#efe4cf":h%10===0?"#e6d6b6":"#efe4cf",i.strokeStyle="#7a6a52",i.lineWidth=.7,i.beginPath(),p.forEach(([m,g],x)=>x?i.lineTo(m,g):i.moveTo(m,g)),i.closePath(),i.fill(),i.stroke();const v=this.owner.get(h);if(v!==void 0){const[m,g]=_n(u+.5,d+.5);i.fillStyle=((c=fi[v])==null?void 0:c.color)??"#fff",i.fillRect(m-2,g-5,4,5)}}const[a,l]=_n(5.5,5.5);i.fillStyle="#7a6a52",i.font=`15px ${Zt}`,this.spaced("KLEROS",a,l+5,5,"center"),fi.forEach((h,u)=>{let d=this.pos[u]??0,f=0,[p,v]=aa(d);if(this.hop.left>0&&this.hop.seat===u){const[A,M]=aa((d+1)%40);p+=(A-p)*this.hop.k,v+=(M-v)*this.hop.k,f=Math.sin(this.hop.k*Math.PI)*9,d=-1}const m=[[.3,.3],[.7,.3],[.3,.7],[.7,.7]][u]??[.5,.5],[g,x]=_n(p+(m[0]??.5),v+(m[1]??.5));i.fillStyle="rgba(0,0,0,0.35)",i.beginPath(),i.ellipse(g,x+1,5,2.5,0,0,Math.PI*2),i.fill(),i.fillStyle=h.color,i.beginPath(),i.arc(g,x-5-f,4.6,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(0,0,0,0.5)",i.stroke()}),this.dice.forEach((h,u)=>this.die(It-70+u*30,22,h,e)),i.font=`11px ${Zt}`,fi.forEach((h,u)=>{const d=26+u*16;i.fillStyle=h.color,i.fillRect(16,d-8,8,8),i.fillStyle=(this.turn-1)%fi.length===u?"#f5ecd9":"#8c826f",i.fillText(`${h.name}${h.model?"  ◆ model":""}`,30,d)}),i.fillStyle="rgba(10,8,6,0.75)",i.fillRect(0,Wt-62,It,62),i.font=`12px ${Zt}`,this.log.forEach((h,u)=>{i.fillStyle=u===this.log.length-1?"#f1e6cc":"#8a7f6a",i.fillText(h,16,Wt-42+u*16)})}die(e,n,i,r){const o=this.ctx,a=this.hop.left>0?Math.sin(r*30)*.15:0;o.save(),o.translate(e,n),o.rotate(a),o.fillStyle="#efe4cf",o.fillRect(-10,-10,20,20),o.fillStyle="#3a2f24";const l={1:[[0,0]],2:[[-5,-5],[5,5]],3:[[-5,-5],[0,0],[5,5]],4:[[-5,-5],[5,-5],[-5,5],[5,5]],5:[[-5,-5],[5,-5],[0,0],[-5,5],[5,5]],6:[[-5,-5],[5,-5],[-5,0],[5,0],[-5,5],[5,5]]};for(const[c,h]of l[i]??[])o.beginPath(),o.arc(c,h,1.8,0,Math.PI*2),o.fill();o.restore()}}class sp extends vn{constructor(e,n){super(e,n);R(this,"body");R(this,"creatureRef");R(this,"stars");R(this,"breaths",[]);this.fps=20;const i=Ui(33);this.stars=Array.from({length:90},()=>({x:i()*It,y:i()*Wt,a:i()*.5+.1})),this.body=sh()}sync(){const e=this.env.feeds.creature.value;e!==this.creatureRef&&(this.creatureRef=e,this.body=e?rp(e):sh(),this.breaths=Array.from({length:Math.min(4,this.body.edges.length)},(n,i)=>({edge:i*7%Math.max(1,this.body.edges.length),k:0,fwd:!0})))}draw(e,n){this.sync();const i=this.ctx,r=this.body,o=i.createLinearGradient(0,0,0,Wt);o.addColorStop(0,"#070b14"),o.addColorStop(1,"#02030a"),i.fillStyle=o,i.fillRect(0,0,It,Wt);for(const p of this.stars)i.fillStyle=`rgba(200,215,255,${p.a*(.7+.3*Math.sin(e+p.x))})`,i.fillRect(p.x,p.y,1,1);const a=r.born?1.4:.9,l=Math.min(n,.1),c=r.nodes.map((p,v)=>{var x;const m=r.adj[v]??[];let g=0;for(const A of m)g+=Math.sin((((x=r.nodes[A])==null?void 0:x.phase)??0)-p.phase);return p.phase+(p.omega+(m.length?a*g/m.length:0))*l});r.nodes.forEach((p,v)=>{const m=c[v]??p.phase;Math.floor(m/(Math.PI*2))>Math.floor(p.phase/(Math.PI*2))&&(p.flash=1),p.phase=m,p.flash=Math.max(0,p.flash-l*2.2)});const h=e*.18,u=Math.cos(h),d=Math.sin(h),f=r.nodes.map((p,v)=>{const m=Math.sin(e*.9+v)*.02,g=p.x*u-p.z*d,A=2.8/(3.6-(p.x*d+p.z*u));return{x:It/2+g*A*150,y:176+(p.y+m)*A*150,k:A}});i.lineCap="round";for(const p of r.edges){const v=f[p.a],m=f[p.b];!v||!m||(i.strokeStyle=p.elder?"rgba(160,200,235,0.55)":"rgba(140,170,210,0.28)",i.lineWidth=p.elder?1.4:.8,i.beginPath(),i.moveTo(v.x,v.y),i.lineTo(m.x,m.y),i.stroke())}for(const p of this.breaths){const v=r.edges[p.edge];if(!v)continue;if(p.k+=l/.75,p.k>=1){const E=p.fwd?v.b:v.a,b=(r.adj[E]??[]).map(T=>r.edges.findIndex(I=>I.a===E&&I.b===T||I.b===E&&I.a===T)),P=b[Math.floor(Math.random()*b.length)]??p.edge,y=r.edges[P];p.edge=P,p.fwd=y?y.a===E:!0,p.k=0;continue}const m=f[p.fwd?v.a:v.b],g=f[p.fwd?v.b:v.a];if(!m||!g)continue;const x=m.x+(g.x-m.x)*p.k,A=m.y+(g.y-m.y)*p.k,M=i.createRadialGradient(x,A,0,x,A,9);M.addColorStop(0,"rgba(235,245,255,0.95)"),M.addColorStop(1,"rgba(180,220,255,0)"),i.fillStyle=M,i.fillRect(x-9,A-9,18,18)}r.nodes.forEach((p,v)=>{const m=f[v];if(!m)return;const g=p.flash,x=2+m.k*1.2+g*3,A=g>.05?`rgba(255,${Math.round(210-g*40)},${Math.round(120-g*60)},${.6+g*.4})`:"rgba(200,225,255,0.85)";i.strokeStyle=A,i.lineWidth=.8,i.beginPath(),i.moveTo(m.x-x*3,m.y),i.lineTo(m.x+x*3,m.y),i.moveTo(m.x,m.y-x*3),i.lineTo(m.x,m.y+x*3),i.stroke();const M=i.createRadialGradient(m.x,m.y,0,m.x,m.y,x*2.4);M.addColorStop(0,A),M.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=M,i.fillRect(m.x-x*3,m.y-x*3,x*6,x*6)}),i.font=`15px ${Zt}`,i.fillStyle=r.born?"#e6f1ff":"#8190a8",i.fillText(r.name,18,Wt-40),i.font=`11px ${Zt}`,i.fillStyle="#6f7f99",i.fillText(r.age,18,Wt-20),i.textAlign="right",i.fillStyle="#4b5870",i.fillText(r.born?`${r.nodes.length} nodes · ${r.edges.length} strings`:"",It-18,Wt-20),i.textAlign="left"}}function ih(s,t){var n,i;const e=Array.from({length:s},()=>[]);for(const r of t)(n=e[r.a])==null||n.push(r.b),(i=e[r.b])==null||i.push(r.a);return e}function rp(s){const t=new Map(s.nodes.map((c,h)=>[c.id,h])),e=s.nodes.reduce((c,h)=>c+h.x,0)/s.nodes.length,n=s.nodes.reduce((c,h)=>c+h.y,0)/s.nodes.length,i=s.nodes.reduce((c,h)=>c+h.z,0)/s.nodes.length,r=Math.max(1,...s.nodes.map(c=>Math.hypot(c.x-e,c.y-n,c.z-i))),o=s.nodes.map((c,h)=>({x:(c.x-e)/r,y:(c.y-n)/r,z:(c.z-i)/r,phase:h*1.3,omega:2.4+h%5*.21,flash:0})),a=s.edges.map(c=>({a:t.get(c.a)??-1,b:t.get(c.b)??-1,elder:c.age>150})).filter(c=>c.a>=0&&c.b>=0),l=Math.max(s.lifetime,(Date.now()-s.bornAt)/1e3);return{name:s.name,age:`${op(l)} old · yours`,born:!0,nodes:o,edges:a,adj:ih(o.length,a)}}function sh(){const s=Ui(9),t=9,e=Array.from({length:t},(i,r)=>{const o=r/t*Math.PI*2;return{x:Math.cos(o)*.8+(s()-.5)*.3,y:(s()-.5)*.9,z:Math.sin(o)*.8,phase:s()*6,omega:2.2+s()*.8,flash:0}}),n=[];for(let i=0;i<t;i++)n.push({a:i,b:(i+1)%t,elder:i%3===0});return n.push({a:0,b:4,elder:!1},{a:2,b:6,elder:!1},{a:3,b:8,elder:!0}),{name:"something stirs",age:"unborn in this browser",born:!1,nodes:e,edges:n,adj:ih(t,n)}}function op(s){const t=Math.max(0,Math.floor(s)),e=Math.floor(t/86400),n=Math.floor(t%86400/3600),i=Math.floor(t%3600/60);return e>0?`${e}d ${n}h`:n>0?`${n}h ${i}m`:`${i}m`}const ls=new Image;ls.src="/static/oikos/boot-logo.webp";class ap extends vn{constructor(e,n){super(e,n);R(this,"specks");this.fps=12,this.idleFps=4;const i=Ui(7);this.specks=Array.from({length:70},()=>({x:i()*It,y:i()*Wt,r:i()*1.2+.3,red:i()<.35,v:i()*4+1}))}draw(e){const n=this.ctx;this.clear("#000");for(const c of this.specks){const h=(c.y-e*c.v+Wt)%Wt;n.fillStyle=c.red?"rgba(170,40,50,0.55)":"rgba(255,255,255,0.28)",n.fillRect(c.x,h,c.r,c.r)}if(ls.complete&&ls.naturalWidth){const h=210*ls.naturalHeight/ls.naturalWidth;n.globalAlpha=.92+.08*Math.sin(e*1.3),n.drawImage(ls,(It-210)/2,26,210,h),n.globalAlpha=1}n.fillStyle="#7d7d7d",n.font=`13px ${Zt}`,this.spaced("transmissions",It/2,118,3,"center"),n.fillStyle="#262626",n.fillRect(40,132,It-80,1);const i=this.env.dir.posts.slice(0,6);if(this.settled=!0,!i.length){n.fillStyle="#9a9a9a",n.font=`16px ${Zt}`,n.textAlign="center",n.fillText(`no transmissions yet${Math.floor(e*2)%2?"_":" "}`,It/2,230),n.textAlign="left";return}const r=3.6,o=Math.floor(e/r)%i.length,a=e%r/r;this.settled=a*1.6>=1&&r-e%r>.3,i.forEach((c,h)=>{const u=162+h*29,d=h===o;n.font=`11px ${Zt}`,n.fillStyle=d?"#bdbdbd":"#555",n.fillText(c.date,46,u),n.font=`16px ${Yc}`,n.fillStyle=d?"#ffffff":"#9a9a9a";const f=c.title.length>38?`${c.title.slice(0,37)}…`:c.title;n.fillText(f,132,u),d&&this.star(28,u-5,e)});const l=i[o];if(l!=null&&l.excerpt){n.font=`italic 12px ${Zt}`,n.fillStyle="#8a8a8a";const c=Math.floor(Math.min(1,a*1.6)*l.excerpt.length);this.wrap(l.excerpt.slice(0,c),It-92,2).forEach((u,d)=>n.fillText(u,46,344+d*16))}}star(e,n,i){const r=this.ctx,o=7+Math.sin(i*5)*1.2;r.save(),r.translate(e,n),r.rotate(i*.8),r.fillStyle="#fff",r.shadowColor="#fff",r.shadowBlur=10,r.beginPath();for(let a=0;a<16;a++){const l=a/16*Math.PI*2,c=a%2?o*.28:a%4?o*.7:o;r.lineTo(Math.cos(l)*c,Math.sin(l)*c)}r.closePath(),r.fill(),r.restore()}}const lp={transmissions:ap,dreams:Yf,chronicle:Vf,"dreams-api":Zf,apeiron:Hf,syrinx:sp,afterlife:Nf,irc:tp,parlor:ip,dream_gen:Xf};class cp extends vn{draw(t){if(this.unchanged(Math.floor(t)%2))return!1;const e=this.ctx,n=["#c0c0c0","#c0c000","#00c0c0","#00c000","#c000c0","#c00000","#0000c0"];n.forEach((i,r)=>{e.fillStyle=i,e.fillRect(r*It/n.length,0,It/n.length+1,Wt*.66)}),e.fillStyle="#111",e.fillRect(0,Wt*.66,It,Wt*.34),e.fillStyle="#fff",e.font=`22px ${Zt}`,e.textAlign="center",e.fillText(this.site.title,It/2,Wt*.82),e.font=`12px ${Zt}`,e.fillStyle=Math.floor(t)%2?"#888":"#555",e.fillText("no programme yet",It/2,Wt*.92),e.textAlign="left"}}function hp(s,t){const e=lp[s.id]??cp;return new e(s,t)}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ca="185",cs={ROTATE:0,DOLLY:1,PAN:2},hs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},up=0,rh=1,dp=2,Ir=1,fp=2,Js=3,pi=0,Ke=1,Xn=2,Pn=0,us=1,Ur=2,oh=3,ah=4,pp=5,Bi=100,mp=101,gp=102,xp=103,vp=104,_p=200,yp=201,Mp=202,bp=203,ha=204,ua=205,Sp=206,wp=207,Ep=208,Tp=209,Ap=210,Cp=211,Rp=212,Pp=213,Lp=214,da=0,fa=1,pa=2,ds=3,ma=4,ga=5,xa=6,va=7,lh=0,Dp=1,Ip=2,Ln=0,ch=1,hh=2,uh=3,_a=4,dh=5,fh=6,ph=7,mh=300,zi=301,fs=302,ya=303,Ma=304,Nr=306,kr=1e3,Yn=1001,ba=1002,Be=1003,Up=1004,Fr=1005,ze=1006,Sa=1007,Hi=1008,rn=1009,gh=1010,xh=1011,js=1012,wa=1013,Dn=1014,yn=1015,on=1016,Ea=1017,Ta=1018,Qs=1020,vh=35902,_h=35899,yh=1021,Mh=1022,Mn=1023,qn=1026,Gi=1027,Aa=1028,Ca=1029,Vi=1030,Ra=1031,Pa=1033,Or=33776,Br=33777,zr=33778,Hr=33779,La=35840,Da=35841,Ia=35842,Ua=35843,Na=36196,ka=37492,Fa=37496,Oa=37488,Ba=37489,Gr=37490,za=37491,Ha=37808,Ga=37809,Va=37810,Wa=37811,$a=37812,Xa=37813,Ya=37814,qa=37815,Ka=37816,Za=37817,Ja=37818,ja=37819,Qa=37820,tl=37821,el=36492,nl=36494,il=36495,sl=36283,rl=36284,Vr=36285,ol=36286,Np=3200,al=0,kp=1,mi="",ke="srgb",tr="srgb-linear",Wr="linear",re="srgb",ps=7680,bh=519,Fp=512,Op=513,Bp=514,ll=515,zp=516,Hp=517,cl=518,Gp=519,Sh=35044,wh="300 es",In=2e3,er=2001;function Vp(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function $r(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Wp(){const s=$r("canvas");return s.style.display="block",s}const Eh={};function Th(...s){const t="THREE."+s.shift();console.log(t,...s)}function Ah(s){const t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Ut(...s){s=Ah(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function ee(...s){s=Ah(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function ms(...s){const t=s.join(" ");t in Eh||(Eh[t]=!0,Ut(...s))}function $p(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Xp={[da]:fa,[pa]:xa,[ma]:va,[ds]:ga,[fa]:da,[xa]:pa,[va]:ma,[ga]:ds};class gi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}}const Ve=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ch=1234567;const nr=Math.PI/180,gs=180/Math.PI;function xs(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ve[s&255]+Ve[s>>8&255]+Ve[s>>16&255]+Ve[s>>24&255]+"-"+Ve[t&255]+Ve[t>>8&255]+"-"+Ve[t>>16&15|64]+Ve[t>>24&255]+"-"+Ve[e&63|128]+Ve[e>>8&255]+"-"+Ve[e>>16&255]+Ve[e>>24&255]+Ve[n&255]+Ve[n>>8&255]+Ve[n>>16&255]+Ve[n>>24&255]).toLowerCase()}function $t(s,t,e){return Math.max(t,Math.min(e,s))}function hl(s,t){return(s%t+t)%t}function Yp(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function qp(s,t,e){return s!==t?(e-s)/(t-s):0}function ir(s,t,e){return(1-e)*s+e*t}function Kp(s,t,e,n){return ir(s,t,1-Math.exp(-e*n))}function Zp(s,t=1){return t-Math.abs(hl(s,t*2)-t)}function Jp(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function jp(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Qp(s,t){return s+Math.floor(Math.random()*(t-s+1))}function tm(s,t){return s+Math.random()*(t-s)}function em(s){return s*(.5-Math.random())}function nm(s){s!==void 0&&(Ch=s);let t=Ch+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function im(s){return s*nr}function sm(s){return s*gs}function rm(s){return(s&s-1)===0&&s!==0}function om(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function am(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function lm(s,t,e,n,i){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),p=o((n-t)/2);switch(i){case"XYX":s.set(a*h,l*u,l*d,a*c);break;case"YZY":s.set(l*d,a*h,l*u,a*c);break;case"ZXZ":s.set(l*u,l*d,a*h,a*c);break;case"XZX":s.set(a*h,l*p,l*f,a*c);break;case"YXY":s.set(l*f,a*h,l*p,a*c);break;case"ZYZ":s.set(l*p,l*f,a*h,a*c);break;default:Ut("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function vs(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ze(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Xr={DEG2RAD:nr,RAD2DEG:gs,generateUUID:xs,clamp:$t,euclideanModulo:hl,mapLinear:Yp,inverseLerp:qp,lerp:ir,damp:Kp,pingpong:Zp,smoothstep:Jp,smootherstep:jp,randInt:Qp,randFloat:tm,randFloatSpread:em,seededRandom:nm,degToRad:im,radToDeg:sm,isPowerOfTwo:rm,ceilPowerOfTwo:om,floorPowerOfTwo:am,setQuaternionFromProperEuler:lm,normalize:Ze,denormalize:vs},Ec=class Ec{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos($t(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Ec.prototype.isVector2=!0;let dt=Ec;class Un{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=r[o+0],f=r[o+1],p=r[o+2],v=r[o+3];if(u!==v||l!==d||c!==f||h!==p){let m=l*d+c*f+h*p+u*v;m<0&&(d=-d,f=-f,p=-p,v=-v,m=-m);let g=1-a;if(m<.9995){const x=Math.acos(m),A=Math.sin(x);g=Math.sin(g*x)/A,a=Math.sin(a*x)/A,l=l*g+d*a,c=c*g+f*a,h=h*g+p*a,u=u*g+v*a}else{l=l*g+d*a,c=c*g+f*a,h=h*g+p*a,u=u*g+v*a;const x=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=x,c*=x,h*=x,u*=x}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[o],d=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+h*u+l*f-c*d,t[e+1]=l*p+h*d+c*u-a*f,t[e+2]=c*p+h*f+a*d-l*u,t[e+3]=h*p-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(r/2),d=l(n/2),f=l(i/2),p=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"YZX":this._x=d*h*u+c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u-d*f*p;break;case"XZY":this._x=d*h*u-c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u+d*f*p;break;default:Ut("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs($t(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,i=-i,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){const c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Tc=class Tc{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Rh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Rh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-r*i),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=i+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this.z=$t(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this.z=$t(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ul.copy(this).projectOnVector(t),this.sub(ul)}reflect(t){return this.sub(ul.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos($t(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Tc.prototype.isVector3=!0;let L=Tc;const ul=new L,Rh=new Un,Ac=class Ac{constructor(t,e,n,i,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],v=i[0],m=i[3],g=i[6],x=i[1],A=i[4],M=i[7],E=i[2],b=i[5],P=i[8];return r[0]=o*v+a*x+l*E,r[3]=o*m+a*A+l*b,r[6]=o*g+a*M+l*P,r[1]=c*v+h*x+u*E,r[4]=c*m+h*A+u*b,r[7]=c*g+h*M+u*P,r[2]=d*v+f*x+p*E,r[5]=d*m+f*A+p*b,r[8]=d*g+f*M+p*P,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,p=e*u+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return t[0]=u*v,t[1]=(i*c-h*n)*v,t[2]=(a*n-i*o)*v,t[3]=d*v,t[4]=(h*e-i*l)*v,t[5]=(i*r-a*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return ms("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(dl.makeScale(t,e)),this}rotate(t){return ms("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(dl.makeRotation(-t)),this}translate(t,e){return ms("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(dl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Ac.prototype.isMatrix3=!0;let Ht=Ac;const dl=new Ht,Ph=new Ht().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Lh=new Ht().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function cm(){const s={enabled:!0,workingColorSpace:tr,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===re&&(i.r=Kn(i.r),i.g=Kn(i.g),i.b=Kn(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===re&&(i.r=_s(i.r),i.g=_s(i.g),i.b=_s(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===mi?Wr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return ms("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return ms("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[tr]:{primaries:t,whitePoint:n,transfer:Wr,toXYZ:Ph,fromXYZ:Lh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ke},outputColorSpaceConfig:{drawingBufferColorSpace:ke}},[ke]:{primaries:t,whitePoint:n,transfer:re,toXYZ:Ph,fromXYZ:Lh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ke}}}),s}const Qt=cm();function Kn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function _s(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let ys;class hm{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{ys===void 0&&(ys=$r("canvas")),ys.width=t.width,ys.height=t.height;const i=ys.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=ys}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=$r("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Kn(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Kn(e[n]/255)*255):e[n]=Kn(e[n]);return{data:e,width:t.width,height:t.height}}else return Ut("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let um=0;class fl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:um++}),this.uuid=xs(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(pl(i[o].image)):r.push(pl(i[o]))}else r=pl(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function pl(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?hm.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Ut("Texture: Unable to serialize Texture."),{})}let dm=0;const ml=new L;class We extends gi{constructor(t=We.DEFAULT_IMAGE,e=We.DEFAULT_MAPPING,n=Yn,i=Yn,r=ze,o=Hi,a=Mn,l=rn,c=We.DEFAULT_ANISOTROPY,h=mi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:dm++}),this.uuid=xs(),this.name="",this.source=new fl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new dt(0,0),this.repeat=new dt(1,1),this.center=new dt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ht,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(ml).x}get height(){return this.source.getSize(ml).y}get depth(){return this.source.getSize(ml).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Ut(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){Ut(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==mh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case kr:t.x=t.x-Math.floor(t.x);break;case Yn:t.x=t.x<0?0:1;break;case ba:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case kr:t.y=t.y-Math.floor(t.y);break;case Yn:t.y=t.y<0?0:1;break;case ba:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}We.DEFAULT_IMAGE=null,We.DEFAULT_MAPPING=mh,We.DEFAULT_ANISOTROPY=1;const Cc=class Cc{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],p=l[9],v=l[2],m=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const A=(c+1)/2,M=(f+1)/2,E=(g+1)/2,b=(h+d)/4,P=(u+v)/4,y=(p+m)/4;return A>M&&A>E?A<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(A),i=b/n,r=P/n):M>E?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=b/i,r=y/i):E<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(E),n=P/r,i=y/r),this.set(n,i,r,e),this}let x=Math.sqrt((m-p)*(m-p)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(m-p)/x,this.y=(u-v)/x,this.z=(d-h)/x,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this.z=$t(this.z,t.z,e.z),this.w=$t(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this.z=$t(this.z,t,e),this.w=$t(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Cc.prototype.isVector4=!0;let ve=Cc;class fm extends gi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ze,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ve(0,0,t,e),this.scissorTest=!1,this.viewport=new ve(0,0,t,e),this.textures=[];const i={width:t,height:e,depth:n.depth},r=new We(i),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:ze,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new fl(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class je extends fm{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Dh extends We{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Be,this.minFilter=Be,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class pm extends We{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Be,this.minFilter=Be,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Oo=class Oo{constructor(t,e,n,i,r,o,a,l,c,h,u,d,f,p,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,h,u,d,f,p,v,m)}set(t,e,n,i,r,o,a,l,c,h,u,d,f,p,v,m){const g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=i,g[1]=r,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=v,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Oo().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,i=1/Ms.setFromMatrixColumn(t,0).length(),r=1/Ms.setFromMatrixColumn(t,1).length(),o=1/Ms.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,f=o*u,p=a*h,v=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+p*c,e[5]=d-v*c,e[9]=-a*l,e[2]=v-d*c,e[6]=p+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,p=c*h,v=c*u;e[0]=d+v*a,e[4]=p*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-p,e[6]=v+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,p=c*h,v=c*u;e[0]=d-v*a,e[4]=-o*u,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*h,e[9]=v-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,f=o*u,p=a*h,v=a*u;e[0]=l*h,e[4]=p*c-f,e[8]=d*c+v,e[1]=l*u,e[5]=v*c+d,e[9]=f*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,p=a*l,v=a*c;e[0]=l*h,e[4]=v-d*u,e[8]=p*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+p,e[10]=d-v*u}else if(t.order==="XZY"){const d=o*l,f=o*c,p=a*l,v=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+v,e[5]=o*h,e[9]=f*u-p,e[2]=p*u-f,e[6]=a*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(mm,t,gm)}lookAt(t,e,n){const i=this.elements;return an.subVectors(t,e),an.lengthSq()===0&&(an.z=1),an.normalize(),xi.crossVectors(n,an),xi.lengthSq()===0&&(Math.abs(n.z)===1?an.x+=1e-4:an.z+=1e-4,an.normalize(),xi.crossVectors(n,an)),xi.normalize(),Yr.crossVectors(an,xi),i[0]=xi.x,i[4]=Yr.x,i[8]=an.x,i[1]=xi.y,i[5]=Yr.y,i[9]=an.y,i[2]=xi.z,i[6]=Yr.z,i[10]=an.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],v=n[6],m=n[10],g=n[14],x=n[3],A=n[7],M=n[11],E=n[15],b=i[0],P=i[4],y=i[8],T=i[12],I=i[1],D=i[5],N=i[9],H=i[13],Y=i[2],k=i[6],G=i[10],z=i[14],K=i[3],tt=i[7],ot=i[11],at=i[15];return r[0]=o*b+a*I+l*Y+c*K,r[4]=o*P+a*D+l*k+c*tt,r[8]=o*y+a*N+l*G+c*ot,r[12]=o*T+a*H+l*z+c*at,r[1]=h*b+u*I+d*Y+f*K,r[5]=h*P+u*D+d*k+f*tt,r[9]=h*y+u*N+d*G+f*ot,r[13]=h*T+u*H+d*z+f*at,r[2]=p*b+v*I+m*Y+g*K,r[6]=p*P+v*D+m*k+g*tt,r[10]=p*y+v*N+m*G+g*ot,r[14]=p*T+v*H+m*z+g*at,r[3]=x*b+A*I+M*Y+E*K,r[7]=x*P+A*D+M*k+E*tt,r[11]=x*y+A*N+M*G+E*ot,r[15]=x*T+A*H+M*z+E*at,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],p=t[3],v=t[7],m=t[11],g=t[15],x=l*f-c*d,A=a*f-c*u,M=a*d-l*u,E=o*f-c*h,b=o*d-l*h,P=o*u-a*h;return e*(v*x-m*A+g*M)-n*(p*x-m*E+g*b)+i*(p*A-v*E+g*P)-r*(p*M-v*b+m*P)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(r*h-a*l)+i*(r*c-o*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],p=t[12],v=t[13],m=t[14],g=t[15],x=e*a-n*o,A=e*l-i*o,M=e*c-r*o,E=n*l-i*a,b=n*c-r*a,P=i*c-r*l,y=h*v-u*p,T=h*m-d*p,I=h*g-f*p,D=u*m-d*v,N=u*g-f*v,H=d*g-f*m,Y=x*H-A*N+M*D+E*I-b*T+P*y;if(Y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/Y;return t[0]=(a*H-l*N+c*D)*k,t[1]=(i*N-n*H-r*D)*k,t[2]=(v*P-m*b+g*E)*k,t[3]=(d*b-u*P-f*E)*k,t[4]=(l*I-o*H-c*T)*k,t[5]=(e*H-i*I+r*T)*k,t[6]=(m*M-p*P-g*A)*k,t[7]=(h*P-d*M+f*A)*k,t[8]=(o*N-a*I+c*y)*k,t[9]=(n*I-e*N-r*y)*k,t[10]=(p*b-v*M+g*x)*k,t[11]=(u*M-h*b-f*x)*k,t[12]=(a*T-o*D-l*y)*k,t[13]=(e*D-n*T+i*y)*k,t[14]=(v*A-p*E-m*x)*k,t[15]=(h*E-u*A+d*x)*k,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,p=r*u,v=o*h,m=o*u,g=a*u,x=l*c,A=l*h,M=l*u,E=n.x,b=n.y,P=n.z;return i[0]=(1-(v+g))*E,i[1]=(f+M)*E,i[2]=(p-A)*E,i[3]=0,i[4]=(f-M)*b,i[5]=(1-(d+g))*b,i[6]=(m+x)*b,i[7]=0,i[8]=(p+A)*P,i[9]=(m-x)*P,i[10]=(1-(d+v))*P,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=Ms.set(i[0],i[1],i[2]).length();const a=Ms.set(i[4],i[5],i[6]).length(),l=Ms.set(i[8],i[9],i[10]).length();r<0&&(o=-o),bn.copy(this);const c=1/o,h=1/a,u=1/l;return bn.elements[0]*=c,bn.elements[1]*=c,bn.elements[2]*=c,bn.elements[4]*=h,bn.elements[5]*=h,bn.elements[6]*=h,bn.elements[8]*=u,bn.elements[9]*=u,bn.elements[10]*=u,e.setFromRotationMatrix(bn),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,i,r,o,a=In,l=!1){const c=this.elements,h=2*r/(e-t),u=2*r/(n-i),d=(e+t)/(e-t),f=(n+i)/(n-i);let p,v;if(l)p=r/(o-r),v=o*r/(o-r);else if(a===In)p=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===er)p=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=In,l=!1){const c=this.elements,h=2/(e-t),u=2/(n-i),d=-(e+t)/(e-t),f=-(n+i)/(n-i);let p,v;if(l)p=1/(o-r),v=o/(o-r);else if(a===In)p=-2/(o-r),v=-(o+r)/(o-r);else if(a===er)p=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};Oo.prototype.isMatrix4=!0;let se=Oo;const Ms=new L,bn=new se,mm=new L(0,0,0),gm=new L(1,1,1),xi=new L,Yr=new L,an=new L,Ih=new se,Uh=new Un;class Zn{constructor(t=0,e=0,n=0,i=Zn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin($t(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$t(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin($t(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-$t(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin($t(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-$t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ut("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ih.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ih,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Uh.setFromEuler(this),this.setFromQuaternion(Uh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Zn.DEFAULT_ORDER="XYZ";class gl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let xm=0;const Nh=new L,bs=new Un,Jn=new se,qr=new L,sr=new L,vm=new L,_m=new Un,kh=new L(1,0,0),Fh=new L(0,1,0),Oh=new L(0,0,1),Bh={type:"added"},ym={type:"removed"},Ss={type:"childadded",child:null},xl={type:"childremoved",child:null};class Re extends gi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xm++}),this.uuid=xs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Re.DEFAULT_UP.clone();const t=new L,e=new Zn,n=new Un,i=new L(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new se},normalMatrix:{value:new Ht}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=Re.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return bs.setFromAxisAngle(t,e),this.quaternion.multiply(bs),this}rotateOnWorldAxis(t,e){return bs.setFromAxisAngle(t,e),this.quaternion.premultiply(bs),this}rotateX(t){return this.rotateOnAxis(kh,t)}rotateY(t){return this.rotateOnAxis(Fh,t)}rotateZ(t){return this.rotateOnAxis(Oh,t)}translateOnAxis(t,e){return Nh.copy(t).applyQuaternion(this.quaternion),this.position.add(Nh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(kh,t)}translateY(t){return this.translateOnAxis(Fh,t)}translateZ(t){return this.translateOnAxis(Oh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Jn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?qr.copy(t):qr.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),sr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Jn.lookAt(sr,qr,this.up):Jn.lookAt(qr,sr,this.up),this.quaternion.setFromRotationMatrix(Jn),i&&(Jn.extractRotation(i.matrixWorld),bs.setFromRotationMatrix(Jn),this.quaternion.premultiply(bs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(ee("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Bh),Ss.child=t,this.dispatchEvent(Ss),Ss.child=null):ee("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(ym),xl.child=t,this.dispatchEvent(xl),xl.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Jn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Jn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Jn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Bh),Ss.child=t,this.dispatchEvent(Ss),Ss.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sr,t,vm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sr,_m,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}Re.DEFAULT_UP=new L(0,1,0),Re.DEFAULT_MATRIX_AUTO_UPDATE=!0,Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class jn extends Re{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Mm={type:"move"};class vl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new jn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new jn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new jn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),g=this._getHandJoint(c,v);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Mm)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new jn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const zh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},vi={h:0,s:0,l:0},Kr={h:0,s:0,l:0};function _l(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Bt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ke){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=Qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Qt.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=Qt.workingColorSpace){if(t=hl(t,1),e=$t(e,0,1),n=$t(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=_l(o,r,t+1/3),this.g=_l(o,r,t),this.b=_l(o,r,t-1/3)}return Qt.colorSpaceToWorking(this,i),this}setStyle(t,e=ke){function n(r){r!==void 0&&parseFloat(r)<1&&Ut("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Ut("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Ut("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ke){const n=zh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Ut("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Kn(t.r),this.g=Kn(t.g),this.b=Kn(t.b),this}copyLinearToSRGB(t){return this.r=_s(t.r),this.g=_s(t.g),this.b=_s(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ke){return Qt.workingToColorSpace($e.copy(this),t),Math.round($t($e.r*255,0,255))*65536+Math.round($t($e.g*255,0,255))*256+Math.round($t($e.b*255,0,255))}getHexString(t=ke){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Qt.workingColorSpace){Qt.workingToColorSpace($e.copy(this),e);const n=$e.r,i=$e.g,r=$e.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Qt.workingColorSpace){return Qt.workingToColorSpace($e.copy(this),e),t.r=$e.r,t.g=$e.g,t.b=$e.b,t}getStyle(t=ke){Qt.workingToColorSpace($e.copy(this),t);const e=$e.r,n=$e.g,i=$e.b;return t!==ke?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(vi),this.setHSL(vi.h+t,vi.s+e,vi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(vi),t.getHSL(Kr);const n=ir(vi.h,Kr.h,e),i=ir(vi.s,Kr.s,e),r=ir(vi.l,Kr.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $e=new Bt;Bt.NAMES=zh;class yl{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Bt(t),this.density=e}clone(){return new yl(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class bm extends Re{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Zn,this.environmentIntensity=1,this.environmentRotation=new Zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Sn=new L,Qn=new L,Ml=new L,ti=new L,ws=new L,Es=new L,Hh=new L,bl=new L,Sl=new L,wl=new L,El=new ve,Tl=new ve,Al=new ve;class wn{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Sn.subVectors(t,e),i.cross(Sn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Sn.subVectors(i,e),Qn.subVectors(n,e),Ml.subVectors(t,e);const o=Sn.dot(Sn),a=Sn.dot(Qn),l=Sn.dot(Ml),c=Qn.dot(Qn),h=Qn.dot(Ml),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-a*h)*d,p=(o*h-a*l)*d;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,ti)===null?!1:ti.x>=0&&ti.y>=0&&ti.x+ti.y<=1}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,ti)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ti.x),l.addScaledVector(o,ti.y),l.addScaledVector(a,ti.z),l)}static getInterpolatedAttribute(t,e,n,i,r,o){return El.setScalar(0),Tl.setScalar(0),Al.setScalar(0),El.fromBufferAttribute(t,e),Tl.fromBufferAttribute(t,n),Al.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(El,r.x),o.addScaledVector(Tl,r.y),o.addScaledVector(Al,r.z),o}static isFrontFacing(t,e,n,i){return Sn.subVectors(n,e),Qn.subVectors(t,e),Sn.cross(Qn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Sn.subVectors(this.c,this.b),Qn.subVectors(this.a,this.b),Sn.cross(Qn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return wn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return wn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return wn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return wn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return wn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let o,a;ws.subVectors(i,n),Es.subVectors(r,n),bl.subVectors(t,n);const l=ws.dot(bl),c=Es.dot(bl);if(l<=0&&c<=0)return e.copy(n);Sl.subVectors(t,i);const h=ws.dot(Sl),u=Es.dot(Sl);if(h>=0&&u<=h)return e.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(ws,o);wl.subVectors(t,r);const f=ws.dot(wl),p=Es.dot(wl);if(p>=0&&f<=p)return e.copy(r);const v=f*c-l*p;if(v<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(n).addScaledVector(Es,a);const m=h*p-f*u;if(m<=0&&u-h>=0&&f-p>=0)return Hh.subVectors(r,i),a=(u-h)/(u-h+(f-p)),e.copy(i).addScaledVector(Hh,a);const g=1/(m+v+d);return o=v*g,a=d*g,e.copy(n).addScaledVector(ws,o).addScaledVector(Es,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Wi{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(En.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(En.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=En.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,En):En.fromBufferAttribute(r,o),En.applyMatrix4(t.matrixWorld),this.expandByPoint(En);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Zr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Zr.copy(n.boundingBox)),Zr.applyMatrix4(t.matrixWorld),this.union(Zr)}const i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,En),En.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(rr),Jr.subVectors(this.max,rr),Ts.subVectors(t.a,rr),As.subVectors(t.b,rr),Cs.subVectors(t.c,rr),_i.subVectors(As,Ts),yi.subVectors(Cs,As),$i.subVectors(Ts,Cs);let e=[0,-_i.z,_i.y,0,-yi.z,yi.y,0,-$i.z,$i.y,_i.z,0,-_i.x,yi.z,0,-yi.x,$i.z,0,-$i.x,-_i.y,_i.x,0,-yi.y,yi.x,0,-$i.y,$i.x,0];return!Cl(e,Ts,As,Cs,Jr)||(e=[1,0,0,0,1,0,0,0,1],!Cl(e,Ts,As,Cs,Jr))?!1:(jr.crossVectors(_i,yi),e=[jr.x,jr.y,jr.z],Cl(e,Ts,As,Cs,Jr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,En).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(En).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ei[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ei[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ei[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ei[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ei[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ei[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ei[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ei[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ei),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const ei=[new L,new L,new L,new L,new L,new L,new L,new L],En=new L,Zr=new Wi,Ts=new L,As=new L,Cs=new L,_i=new L,yi=new L,$i=new L,rr=new L,Jr=new L,jr=new L,Xi=new L;function Cl(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Xi.fromArray(s,r);const a=i.x*Math.abs(Xi.x)+i.y*Math.abs(Xi.y)+i.z*Math.abs(Xi.z),l=t.dot(Xi),c=e.dot(Xi),h=n.dot(Xi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Pe=new L,Qr=new dt;let Sm=0;class fn extends gi{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Sm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Sh,this.updateRanges=[],this.gpuType=yn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Qr.fromBufferAttribute(this,e),Qr.applyMatrix3(t),this.setXY(e,Qr.x,Qr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix3(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix4(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyNormalMatrix(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.transformDirection(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=vs(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ze(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=vs(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=vs(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=vs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=vs(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ze(e,this.array),n=Ze(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Ze(e,this.array),n=Ze(n,this.array),i=Ze(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Ze(e,this.array),n=Ze(n,this.array),i=Ze(i,this.array),r=Ze(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Sh&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class Gh extends fn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Vh extends fn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class oe extends fn{constructor(t,e,n){super(new Float32Array(t),e,n)}}const wm=new Wi,or=new L,Rl=new L;class Rs{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):wm.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;or.subVectors(t,this.center);const e=or.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(or,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Rl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(or.copy(t.center).add(Rl)),this.expandByPoint(or.copy(t.center).sub(Rl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let Em=0;const pn=new se,Pl=new Re,Ps=new L,ln=new Wi,ar=new Wi,Fe=new L;class He extends gi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=xs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Vp(t)?Vh:Gh)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ht().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return pn.makeRotationFromQuaternion(t),this.applyMatrix4(pn),this}rotateX(t){return pn.makeRotationX(t),this.applyMatrix4(pn),this}rotateY(t){return pn.makeRotationY(t),this.applyMatrix4(pn),this}rotateZ(t){return pn.makeRotationZ(t),this.applyMatrix4(pn),this}translate(t,e,n){return pn.makeTranslation(t,e,n),this.applyMatrix4(pn),this}scale(t,e,n){return pn.makeScale(t,e,n),this.applyMatrix4(pn),this}lookAt(t){return Pl.lookAt(t),Pl.updateMatrix(),this.applyMatrix4(Pl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ps).negate(),this.translate(Ps.x,Ps.y,Ps.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new oe(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&Ut("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){ee("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];ln.setFromBufferAttribute(r),this.morphTargetsRelative?(Fe.addVectors(this.boundingBox.min,ln.min),this.boundingBox.expandByPoint(Fe),Fe.addVectors(this.boundingBox.max,ln.max),this.boundingBox.expandByPoint(Fe)):(this.boundingBox.expandByPoint(ln.min),this.boundingBox.expandByPoint(ln.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ee('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Rs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){ee("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){const n=this.boundingSphere.center;if(ln.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];ar.setFromBufferAttribute(a),this.morphTargetsRelative?(Fe.addVectors(ln.min,ar.min),ln.expandByPoint(Fe),Fe.addVectors(ln.max,ar.max),ln.expandByPoint(Fe)):(ln.expandByPoint(ar.min),ln.expandByPoint(ar.max))}ln.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)Fe.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Fe));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Fe.fromBufferAttribute(a,c),l&&(Ps.fromBufferAttribute(t,c),Fe.add(Ps)),i=Math.max(i,n.distanceToSquared(Fe))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&ee('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){ee("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new fn(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));const a=[],l=[];for(let y=0;y<n.count;y++)a[y]=new L,l[y]=new L;const c=new L,h=new L,u=new L,d=new dt,f=new dt,p=new dt,v=new L,m=new L;function g(y,T,I){c.fromBufferAttribute(n,y),h.fromBufferAttribute(n,T),u.fromBufferAttribute(n,I),d.fromBufferAttribute(r,y),f.fromBufferAttribute(r,T),p.fromBufferAttribute(r,I),h.sub(c),u.sub(c),f.sub(d),p.sub(d);const D=1/(f.x*p.y-p.x*f.y);isFinite(D)&&(v.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(D),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(D),a[y].add(v),a[T].add(v),a[I].add(v),l[y].add(m),l[T].add(m),l[I].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let y=0,T=x.length;y<T;++y){const I=x[y],D=I.start,N=I.count;for(let H=D,Y=D+N;H<Y;H+=3)g(t.getX(H+0),t.getX(H+1),t.getX(H+2))}const A=new L,M=new L,E=new L,b=new L;function P(y){E.fromBufferAttribute(i,y),b.copy(E);const T=a[y];A.copy(T),A.sub(E.multiplyScalar(E.dot(T))).normalize(),M.crossVectors(b,T);const D=M.dot(l[y])<0?-1:1;o.setXYZW(y,A.x,A.y,A.z,D)}for(let y=0,T=x.length;y<T;++y){const I=x[y],D=I.start,N=I.count;for(let H=D,Y=D+N;H<Y;H+=3)P(t.getX(H+0)),P(t.getX(H+1)),P(t.getX(H+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new fn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new L,r=new L,o=new L,a=new L,l=new L,c=new L,h=new L,u=new L;if(t)for(let d=0,f=t.count;d<f;d+=3){const p=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,p),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Fe.fromBufferAttribute(t,e),Fe.normalize(),t.setXYZ(e,Fe.x,Fe.y,Fe.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let f=0,p=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let g=0;g<h;g++)d[p++]=c[f++]}return new fn(d,h,u)}if(this.index===null)return Ut("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new He,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let Tm=0;class Ls extends gi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Tm++}),this.uuid=xs(),this.name="",this.type="Material",this.blending=us,this.side=pi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ha,this.blendDst=ua,this.blendEquation=Bi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Bt(0,0,0),this.blendAlpha=0,this.depthFunc=ds,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=bh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ps,this.stencilZFail=ps,this.stencilZPass=ps,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Ut(`Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){Ut(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==us&&(n.blending=this.blending),this.side!==pi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ha&&(n.blendSrc=this.blendSrc),this.blendDst!==ua&&(n.blendDst=this.blendDst),this.blendEquation!==Bi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ds&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==bh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ps&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ps&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ps&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Bt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new dt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new dt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const ni=new L,Ll=new L,to=new L,Mi=new L,Dl=new L,eo=new L,Il=new L;class no{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ni)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ni.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ni.copy(this.origin).addScaledVector(this.direction,e),ni.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Ll.copy(t).add(e).multiplyScalar(.5),to.copy(e).sub(t).normalize(),Mi.copy(this.origin).sub(Ll);const r=t.distanceTo(e)*.5,o=-this.direction.dot(to),a=Mi.dot(this.direction),l=-Mi.dot(to),c=Mi.lengthSq(),h=Math.abs(1-o*o);let u,d,f,p;if(h>0)if(u=o*l-a,d=o*a-l,p=r*h,u>=0)if(d>=-p)if(d<=p){const v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-p?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=p?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Ll).addScaledVector(to,d),f}intersectSphere(t,e){ni.subVectors(t.center,this.origin);const n=ni.dot(this.direction),i=ni.dot(ni)-n*n,r=t.radius*t.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,ni)!==null}intersectTriangle(t,e,n,i,r){Dl.subVectors(e,t),eo.subVectors(n,t),Il.crossVectors(Dl,eo);let o=this.direction.dot(Il),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Mi.subVectors(this.origin,t);const l=a*this.direction.dot(eo.crossVectors(Mi,eo));if(l<0)return null;const c=a*this.direction.dot(Dl.cross(Mi));if(c<0||l+c>o)return null;const h=-a*Mi.dot(Il);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ii extends Ls{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Zn,this.combine=lh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Wh=new se,Yi=new no,io=new Rs,$h=new L,so=new L,ro=new L,oo=new L,Ul=new L,ao=new L,Xh=new L,lo=new L;class Yt extends Re{constructor(t=new He,e=new ii){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(r&&a){ao.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(Ul.fromBufferAttribute(u,t),o?ao.addScaledVector(Ul,h):ao.addScaledVector(Ul.sub(e),h))}e.add(ao)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),io.copy(n.boundingSphere),io.applyMatrix4(r),Yi.copy(t.ray).recast(t.near),!(io.containsPoint(Yi.origin)===!1&&(Yi.intersectSphere(io,$h)===null||Yi.origin.distanceToSquared($h)>(t.far-t.near)**2))&&(Wh.copy(r).invert(),Yi.copy(t.ray).applyMatrix4(Wh),!(n.boundingBox!==null&&Yi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Yi)))}_computeIntersections(t,e,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,v=d.length;p<v;p++){const m=d[p],g=o[m.materialIndex],x=Math.max(m.start,f.start),A=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let M=x,E=A;M<E;M+=3){const b=a.getX(M),P=a.getX(M+1),y=a.getX(M+2);i=co(this,g,t,n,c,h,u,b,P,y),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const p=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=p,g=v;m<g;m+=3){const x=a.getX(m),A=a.getX(m+1),M=a.getX(m+2);i=co(this,o,t,n,c,h,u,x,A,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,v=d.length;p<v;p++){const m=d[p],g=o[m.materialIndex],x=Math.max(m.start,f.start),A=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let M=x,E=A;M<E;M+=3){const b=M,P=M+1,y=M+2;i=co(this,g,t,n,c,h,u,b,P,y),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const p=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=p,g=v;m<g;m+=3){const x=m,A=m+1,M=m+2;i=co(this,o,t,n,c,h,u,x,A,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function Am(s,t,e,n,i,r,o,a){let l;if(t.side===Ke?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===pi,a),l===null)return null;lo.copy(a),lo.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(lo);return c<e.near||c>e.far?null:{distance:c,point:lo.clone(),object:s}}function co(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,so),s.getVertexPosition(l,ro),s.getVertexPosition(c,oo);const h=Am(s,t,e,n,so,ro,oo,Xh);if(h){const u=new L;wn.getBarycoord(Xh,so,ro,oo,u),i&&(h.uv=wn.getInterpolatedAttribute(i,a,l,c,u,new dt)),r&&(h.uv1=wn.getInterpolatedAttribute(r,a,l,c,u,new dt)),o&&(h.normal=wn.getInterpolatedAttribute(o,a,l,c,u,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new L,materialIndex:0};wn.getNormal(so,ro,oo,d.normal),h.face=d,h.barycoord=u}return h}class Yh extends We{constructor(t=null,e=1,n=1,i,r,o,a,l,c=Be,h=Be,u,d){super(null,o,a,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class lr extends fn{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ds=new se,qh=new se,ho=[],Kh=new Wi,Cm=new se,cr=new Yt,hr=new Rs;class Zh extends Yt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new lr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Cm)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Wi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ds),Kh.copy(t.boundingBox).applyMatrix4(Ds),this.boundingBox.union(Kh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Rs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ds),hr.copy(t.boundingSphere).applyMatrix4(Ds),this.boundingSphere.union(hr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){const n=this.matrixWorld,i=this.count;if(cr.geometry=this.geometry,cr.material=this.material,cr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),hr.copy(this.boundingSphere),hr.applyMatrix4(n),t.ray.intersectsSphere(hr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ds),qh.multiplyMatrices(n,Ds),cr.matrixWorld=qh,cr.raycast(t,ho);for(let o=0,a=ho.length;o<a;o++){const l=ho[o];l.instanceId=r,l.object=this,e.push(l)}ho.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new lr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Yh(new Float32Array(i*this.count),i,this.count,Aa,yn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=i*t;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Nl=new L,Rm=new L,Pm=new Ht;class bi{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Nl.subVectors(n,e).cross(Rm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const i=t.delta(Nl),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Pm.getNormalMatrix(t),i=this.coplanarPoint(Nl).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const qi=new Rs,Lm=new dt(.5,.5),uo=new L;class fo{constructor(t=new bi,e=new bi,n=new bi,i=new bi,r=new bi,o=new bi){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=In,n=!1){const i=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],p=r[8],v=r[9],m=r[10],g=r[11],x=r[12],A=r[13],M=r[14],E=r[15];if(i[0].setComponents(c-o,f-h,g-p,E-x).normalize(),i[1].setComponents(c+o,f+h,g+p,E+x).normalize(),i[2].setComponents(c+a,f+u,g+v,E+A).normalize(),i[3].setComponents(c-a,f-u,g-v,E-A).normalize(),n)i[4].setComponents(l,d,m,M).normalize(),i[5].setComponents(c-l,f-d,g-m,E-M).normalize();else if(i[4].setComponents(c-l,f-d,g-m,E-M).normalize(),e===In)i[5].setComponents(c+l,f+d,g+m,E+M).normalize();else if(e===er)i[5].setComponents(l,d,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),qi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),qi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(qi)}intersectsSprite(t){qi.center.set(0,0,0);const e=Lm.distanceTo(t.center);return qi.radius=.7071067811865476+e,qi.applyMatrix4(t.matrixWorld),this.intersectsSphere(qi)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(uo.x=i.normal.x>0?t.max.x:t.min.x,uo.y=i.normal.y>0?t.max.y:t.min.y,uo.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(uo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Jh extends Ls{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Bt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const po=new L,mo=new L,jh=new se,ur=new no,go=new Rs,kl=new L,Qh=new L;class Dm extends Re{constructor(t=new He,e=new Jh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)po.fromBufferAttribute(e,i-1),mo.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=po.distanceTo(mo);t.setAttribute("lineDistance",new oe(n,1))}else Ut("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),go.copy(n.boundingSphere),go.applyMatrix4(i),go.radius+=r,t.ray.intersectsSphere(go)===!1)return;jh.copy(i).invert(),ur.copy(t.ray).applyMatrix4(jh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let v=f,m=p-1;v<m;v+=c){const g=h.getX(v),x=h.getX(v+1),A=xo(this,t,ur,l,g,x,v);A&&e.push(A)}if(this.isLineLoop){const v=h.getX(p-1),m=h.getX(f),g=xo(this,t,ur,l,v,m,p-1);g&&e.push(g)}}else{const f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let v=f,m=p-1;v<m;v+=c){const g=xo(this,t,ur,l,v,v+1,v);g&&e.push(g)}if(this.isLineLoop){const v=xo(this,t,ur,l,p-1,f,p-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function xo(s,t,e,n,i,r,o){const a=s.geometry.attributes.position;if(po.fromBufferAttribute(a,i),mo.fromBufferAttribute(a,r),e.distanceSqToSegment(po,mo,kl,Qh)>n)return;kl.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(kl);if(!(c<t.near||c>t.far))return{distance:c,point:Qh.clone().applyMatrix4(s.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:s}}const tu=new L,eu=new L;class Im extends Dm{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)tu.fromBufferAttribute(e,i),eu.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+tu.distanceTo(eu);t.setAttribute("lineDistance",new oe(n,1))}else Ut("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class nu extends We{constructor(t=[],e=zi,n,i,r,o,a,l,c,h){super(t,e,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Is extends We{constructor(t,e,n,i,r,o,a,l,c){super(t,e,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Us extends We{constructor(t,e,n=Dn,i,r,o,a=Be,l=Be,c,h=qn,u=1){if(h!==qn&&h!==Gi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new fl(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Um extends Us{constructor(t,e=Dn,n=zi,i,r,o=Be,a=Be,l,c=qn){const h={width:t,height:t,depth:1},u=[h,h,h,h,h,h];super(t,t,e,n,i,r,o,a,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class iu extends We{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Tn extends He{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,i,o,2),p("x","z","y",1,-1,t,n,-e,i,o,3),p("x","y","z",1,-1,t,e,n,i,r,4),p("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new oe(c,3)),this.setAttribute("normal",new oe(h,3)),this.setAttribute("uv",new oe(u,2));function p(v,m,g,x,A,M,E,b,P,y,T){const I=M/P,D=E/y,N=M/2,H=E/2,Y=b/2,k=P+1,G=y+1;let z=0,K=0;const tt=new L;for(let ot=0;ot<G;ot++){const at=ot*D-H;for(let pt=0;pt<k;pt++){const zt=pt*I-N;tt[v]=zt*x,tt[m]=at*A,tt[g]=Y,c.push(tt.x,tt.y,tt.z),tt[v]=0,tt[m]=0,tt[g]=b>0?1:-1,h.push(tt.x,tt.y,tt.z),u.push(pt/P),u.push(1-ot/y),z+=1}}for(let ot=0;ot<y;ot++)for(let at=0;at<P;at++){const pt=d+at+k*ot,zt=d+at+k*(ot+1),xe=d+(at+1)+k*(ot+1),jt=d+(at+1)+k*ot;l.push(pt,zt,jt),l.push(zt,xe,jt),K+=6}a.addGroup(f,K,T),f+=K,d+=z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Tn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class Fl extends He{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new L,h=new dt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new oe(o,3)),this.setAttribute("normal",new oe(a,3)),this.setAttribute("uv",new oe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fl(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ns extends He{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let p=0;const v=[],m=n/2;let g=0;x(),o===!1&&(t>0&&A(!0),e>0&&A(!1)),this.setIndex(h),this.setAttribute("position",new oe(u,3)),this.setAttribute("normal",new oe(d,3)),this.setAttribute("uv",new oe(f,2));function x(){const M=new L,E=new L;let b=0;const P=(e-t)/n;for(let y=0;y<=r;y++){const T=[],I=y/r,D=I*(e-t)+t;for(let N=0;N<=i;N++){const H=N/i,Y=H*l+a,k=Math.sin(Y),G=Math.cos(Y);E.x=D*k,E.y=-I*n+m,E.z=D*G,u.push(E.x,E.y,E.z),M.set(k,P,G).normalize(),d.push(M.x,M.y,M.z),f.push(H,1-I),T.push(p++)}v.push(T)}for(let y=0;y<i;y++)for(let T=0;T<r;T++){const I=v[T][y],D=v[T+1][y],N=v[T+1][y+1],H=v[T][y+1];(t>0||T!==0)&&(h.push(I,D,H),b+=3),(e>0||T!==r-1)&&(h.push(D,N,H),b+=3)}c.addGroup(g,b,0),g+=b}function A(M){const E=p,b=new dt,P=new L;let y=0;const T=M===!0?t:e,I=M===!0?1:-1;for(let N=1;N<=i;N++)u.push(0,m*I,0),d.push(0,I,0),f.push(.5,.5),p++;const D=p;for(let N=0;N<=i;N++){const Y=N/i*l+a,k=Math.cos(Y),G=Math.sin(Y);P.x=T*G,P.y=m*I,P.z=T*k,u.push(P.x,P.y,P.z),d.push(0,I,0),b.x=k*.5+.5,b.y=G*.5*I+.5,f.push(b.x,b.y),p++}for(let N=0;N<i;N++){const H=E+N,Y=D+N;M===!0?h.push(Y,Y+1,H):h.push(Y+1,Y,H),y+=3}c.addGroup(g,y,M===!0?1:2),g+=y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ns(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class si{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ut("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let i=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(o-h)/d;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const o=this.getPoint(i),a=this.getPoint(r),l=e||(o.isVector2?new dt:new L);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new L,i=[],r=[],o=[],a=new L,l=new se;for(let f=0;f<=t;f++){const p=f/t;i[f]=this.getTangentAt(p,new L)}r[0]=new L,o[0]=new L;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();const p=Math.acos($t(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos($t(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(i[p],f*p)),o[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class su extends si{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new dt){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Nm extends su{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Ol(){let s=0,t=0,e=0,n=0;function i(r,o,a,l){s=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){i(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,i(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return s+t*r+e*o+n*a}}}const ru=new L,ou=new L,Bl=new Ol,zl=new Ol,Hl=new Ol;class au extends si{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new L){const n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=i[(a-1)%r]:(ou.subVectors(i[0],i[1]).add(i[0]),c=ou);const u=i[a%r],d=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(ru.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=ru),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),p<1e-4&&(p=v),m<1e-4&&(m=v),Bl.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,p,v,m),zl.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,p,v,m),Hl.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,p,v,m)}else this.curveType==="catmullrom"&&(Bl.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),zl.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Hl.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Bl.calc(l),zl.calc(l),Hl.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new L().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function lu(s,t,e,n,i){const r=(n-t)*.5,o=(i-e)*.5,a=s*s,l=s*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*s+e}function km(s,t){const e=1-s;return e*e*t}function Fm(s,t){return 2*(1-s)*s*t}function Om(s,t){return s*s*t}function dr(s,t,e,n){return km(s,t)+Fm(s,e)+Om(s,n)}function Bm(s,t){const e=1-s;return e*e*e*t}function zm(s,t){const e=1-s;return 3*e*e*s*t}function Hm(s,t){return 3*(1-s)*s*s*t}function Gm(s,t){return s*s*s*t}function fr(s,t,e,n,i){return Bm(s,t)+zm(s,e)+Hm(s,n)+Gm(s,i)}class Vm extends si{constructor(t=new dt,e=new dt,n=new dt,i=new dt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new dt){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(fr(t,i.x,r.x,o.x,a.x),fr(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Wm extends si{constructor(t=new L,e=new L,n=new L,i=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new L){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(fr(t,i.x,r.x,o.x,a.x),fr(t,i.y,r.y,o.y,a.y),fr(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class $m extends si{constructor(t=new dt,e=new dt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new dt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new dt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Xm extends si{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ym extends si{constructor(t=new dt,e=new dt,n=new dt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new dt){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(dr(t,i.x,r.x,o.x),dr(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class cu extends si{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(dr(t,i.x,r.x,o.x),dr(t,i.y,r.y,o.y),dr(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class qm extends si{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new dt){const n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,l=i[o===0?o:o-1],c=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(lu(a,l.x,c.x,h.x,u.x),lu(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new dt().fromArray(i))}return this}}var Km=Object.freeze({__proto__:null,ArcCurve:Nm,CatmullRomCurve3:au,CubicBezierCurve:Vm,CubicBezierCurve3:Wm,EllipseCurve:su,LineCurve:$m,LineCurve3:Xm,QuadraticBezierCurve:Ym,QuadraticBezierCurve3:cu,SplineCurve:qm});class mn extends He{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=t/a,d=e/l,f=[],p=[],v=[],m=[];for(let g=0;g<h;g++){const x=g*d-o;for(let A=0;A<c;A++){const M=A*u-r;p.push(M,-x,0),v.push(0,0,1),m.push(A/a),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let x=0;x<a;x++){const A=x+c*g,M=x+c*(g+1),E=x+1+c*(g+1),b=x+1+c*g;f.push(A,M,b),f.push(M,E,b)}this.setIndex(f),this.setAttribute("position",new oe(p,3)),this.setAttribute("normal",new oe(v,3)),this.setAttribute("uv",new oe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new mn(t.width,t.height,t.widthSegments,t.heightSegments)}}class vo extends He{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new L,d=new L,f=[],p=[],v=[],m=[];for(let g=0;g<=n;g++){const x=[],A=g/n,M=o+A*a,E=t*Math.cos(M),b=Math.sqrt(t*t-E*E);let P=0;g===0&&o===0?P=.5/e:g===n&&l===Math.PI&&(P=-.5/e);for(let y=0;y<=e;y++){const T=y/e,I=i+T*r;u.x=-b*Math.cos(I),u.y=E,u.z=b*Math.sin(I),p.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(T+P,1-A),x.push(c++)}h.push(x)}for(let g=0;g<n;g++)for(let x=0;x<e;x++){const A=h[g][x+1],M=h[g][x],E=h[g+1][x],b=h[g+1][x+1];(g!==0||o>0)&&f.push(A,M,b),(g!==n-1||l<Math.PI)&&f.push(M,E,b)}this.setIndex(f),this.setAttribute("position",new oe(p,3)),this.setAttribute("normal",new oe(v,3)),this.setAttribute("uv",new oe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vo(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Gl extends He{constructor(t=new cu(new L(-1,-1,0),new L(-1,1,0),new L(1,1,0)),e=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:i,closed:r};const o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new L,l=new L,c=new dt;let h=new L;const u=[],d=[],f=[],p=[];v(),this.setIndex(p),this.setAttribute("position",new oe(u,3)),this.setAttribute("normal",new oe(d,3)),this.setAttribute("uv",new oe(f,2));function v(){for(let A=0;A<e;A++)m(A);m(r===!1?e:0),x(),g()}function m(A){h=t.getPointAt(A/e,h);const M=o.normals[A],E=o.binormals[A];for(let b=0;b<=i;b++){const P=b/i*Math.PI*2,y=Math.sin(P),T=-Math.cos(P);l.x=T*M.x+y*E.x,l.y=T*M.y+y*E.y,l.z=T*M.z+y*E.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function g(){for(let A=1;A<=e;A++)for(let M=1;M<=i;M++){const E=(i+1)*(A-1)+(M-1),b=(i+1)*A+(M-1),P=(i+1)*A+M,y=(i+1)*(A-1)+M;p.push(E,b,y),p.push(b,P,y)}}function x(){for(let A=0;A<=e;A++)for(let M=0;M<=i;M++)c.x=A/e,c.y=M/i,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Gl(new Km[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}function ks(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];if(hu(i))i.isRenderTargetTexture?(Ut("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(hu(i[0])){const r=[];for(let o=0,a=i.length;o<a;o++)r[o]=i[o].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function Je(s){const t={};for(let e=0;e<s.length;e++){const n=ks(s[e]);for(const i in n)t[i]=n[i]}return t}function hu(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Zm(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function uu(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Qt.workingColorSpace}const _o={clone:ks,merge:Je};var Jm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,jm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Le extends Ls{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Jm,this.fragmentShader=jm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ks(t.uniforms),this.uniformsGroups=Zm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new Bt().setHex(i.value);break;case"v2":this.uniforms[n].value=new dt().fromArray(i.value);break;case"v3":this.uniforms[n].value=new L().fromArray(i.value);break;case"v4":this.uniforms[n].value=new ve().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Ht().fromArray(i.value);break;case"m4":this.uniforms[n].value=new se().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class Qm extends Le{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Qe extends Ls{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=al,this.normalScale=new dt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Zn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class t0 extends Ls{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Np,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class e0 extends Ls{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class yo extends Re{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Bt(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class n0 extends yo{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const Vl=new se,du=new L,fu=new L;class Wl{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new dt(512,512),this.mapType=rn,this.map=null,this.mapPass=null,this.matrix=new se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new fo,this._frameExtents=new dt(1,1),this._viewportCount=1,this._viewports=[new ve(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;du.setFromMatrixPosition(t.matrixWorld),e.position.copy(du),fu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(fu),e.updateMatrixWorld(),Vl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Vl,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===er||e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Vl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Mo=new L,bo=new Un,Nn=new L;class pu extends Re{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=In,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Mo,bo,Nn),Nn.x===1&&Nn.y===1&&Nn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Mo,bo,Nn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Mo,bo,Nn),Nn.x===1&&Nn.y===1&&Nn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Mo,bo,Nn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Si=new L,mu=new dt,gu=new dt;class tn extends pu{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=gs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(nr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return gs*2*Math.atan(Math.tan(nr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Si.x,Si.y).multiplyScalar(-t/Si.z),Si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Si.x,Si.y).multiplyScalar(-t/Si.z)}getViewSize(t,e){return this.getViewBounds(t,mu,gu),e.subVectors(gu,mu)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(nr*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class i0 extends Wl{constructor(){super(new tn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=gs*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||i!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=i,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class s0 extends yo{constructor(t,e,n=0,i=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new i0}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}}class r0 extends Wl{constructor(){super(new tn(90,1,.5,500)),this.isPointLightShadow=!0}}class $l extends yo{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new r0}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class So extends pu{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class o0 extends Wl{constructor(){super(new So(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class a0 extends yo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.shadow=new o0}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}const Fs=-90,Os=1;class l0 extends Re{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new tn(Fs,Os,t,e);i.layers=this.layers,this.add(i);const r=new tn(Fs,Os,t,e);r.layers=this.layers,this.add(r);const o=new tn(Fs,Os,t,e);o.layers=this.layers,this.add(o);const a=new tn(Fs,Os,t,e);a.layers=this.layers,this.add(a);const l=new tn(Fs,Os,t,e);l.layers=this.layers,this.add(l);const c=new tn(Fs,Os,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===In)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===er)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class c0 extends tn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class h0{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=u0.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function u0(){this._document.hidden===!1&&this.reset()}const xu=new se;class d0{constructor(t,e,n=0,i=1/0){this.ray=new no(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new gl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):ee("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return xu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(xu),this}intersectObject(t,e=!0,n=[]){return Xl(t,this,n,e),n.sort(vu),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)Xl(t[i],this,n,e);return n.sort(vu),n}}function vu(s,t){return s.distance-t.distance}function Xl(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let o=0,a=r.length;o<a;o++)Xl(r[o],t,e,!0)}}class f0{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Ut("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}class Yl{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=$t(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos($t(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Rc=class Rc{constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){const r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=i,this}};Rc.prototype.isMatrix2=!0;let _u=Rc;class p0 extends gi{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){Ut("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function yu(s,t,e,n){const i=m0(n);switch(e){case yh:return s*t;case Aa:return s*t/i.components*i.byteLength;case Ca:return s*t/i.components*i.byteLength;case Vi:return s*t*2/i.components*i.byteLength;case Ra:return s*t*2/i.components*i.byteLength;case Mh:return s*t*3/i.components*i.byteLength;case Mn:return s*t*4/i.components*i.byteLength;case Pa:return s*t*4/i.components*i.byteLength;case Or:case Br:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case zr:case Hr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Da:case Ua:return Math.max(s,16)*Math.max(t,8)/4;case La:case Ia:return Math.max(s,8)*Math.max(t,8)/2;case Na:case ka:case Oa:case Ba:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Fa:case Gr:case za:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ha:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ga:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Va:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Wa:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case $a:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Xa:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Ya:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case qa:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Ka:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Za:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Ja:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case ja:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Qa:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case tl:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case el:case nl:case il:return Math.ceil(s/4)*Math.ceil(t/4)*16;case sl:case rl:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Vr:case ol:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function m0(s){switch(s){case rn:case gh:return{byteLength:1,components:1};case js:case xh:case on:return{byteLength:2,components:1};case Ea:case Ta:return{byteLength:2,components:4};case Dn:case wa:case yn:return{byteLength:4,components:1};case vh:case _h:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ca}})),typeof window<"u"&&(window.__THREE__?Ut("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ca);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Mu(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function g0(s){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,u=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const h=l.array,u=l.updateRanges;if(s.bindBuffer(c,a),u.length===0)s.bufferSubData(c,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){const p=u[d],v=u[f];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){const v=u[f];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(s.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var x0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,v0=`#ifdef USE_ALPHAHASH
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
#endif`,_0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,y0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,M0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,b0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,S0=`#ifdef USE_AOMAP
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
#endif`,w0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,E0=`#ifdef USE_BATCHING
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
#endif`,T0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,A0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,C0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,R0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,P0=`#ifdef USE_IRIDESCENCE
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
#endif`,L0=`#ifdef USE_BUMPMAP
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
#endif`,D0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,I0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,U0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,N0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,k0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,F0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,O0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,B0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,z0=`#define PI 3.141592653589793
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
} // validated`,H0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,G0=`vec3 transformedNormal = objectNormal;
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
#endif`,V0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,W0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,X0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Y0="gl_FragColor = linearToOutputTexel( gl_FragColor );",q0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,K0=`#ifdef USE_ENVMAP
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
#endif`,Z0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,J0=`#ifdef USE_ENVMAP
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
#endif`,j0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Q0=`#ifdef USE_ENVMAP
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
#endif`,tg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,eg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ng=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ig=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sg=`#ifdef USE_GRADIENTMAP
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
}`,rg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,og=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ag=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lg=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,cg=`#ifdef USE_ENVMAP
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
#endif`,hg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ug=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,dg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,pg=`PhysicalMaterial material;
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
#endif`,mg=`uniform sampler2D dfgLUT;
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
}`,gg=`
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
#endif`,xg=`#if defined( RE_IndirectDiffuse )
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
#endif`,vg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,_g=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,yg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Mg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,wg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Eg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Tg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ag=`#if defined( USE_POINTS_UV )
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
#endif`,Cg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Rg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Pg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Lg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Dg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ig=`#ifdef USE_MORPHTARGETS
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
#endif`,Ug=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ng=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,kg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Fg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Og=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,zg=`#ifdef USE_NORMALMAP
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
#endif`,Hg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Gg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Vg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Wg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$g=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Xg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Yg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,qg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Kg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Zg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Jg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,jg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Qg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,tx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ex=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,nx=`float getShadowMask() {
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
}`,ix=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,sx=`#ifdef USE_SKINNING
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
#endif`,rx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ox=`#ifdef USE_SKINNING
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
#endif`,ax=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,lx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,cx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hx=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ux=`#ifdef USE_TRANSMISSION
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
#endif`,dx=`#ifdef USE_TRANSMISSION
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
#endif`,fx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,px=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Xt={alphahash_fragment:x0,alphahash_pars_fragment:v0,alphamap_fragment:_0,alphamap_pars_fragment:y0,alphatest_fragment:M0,alphatest_pars_fragment:b0,aomap_fragment:S0,aomap_pars_fragment:w0,batching_pars_vertex:E0,batching_vertex:T0,begin_vertex:A0,beginnormal_vertex:C0,bsdfs:R0,iridescence_fragment:P0,bumpmap_pars_fragment:L0,clipping_planes_fragment:D0,clipping_planes_pars_fragment:I0,clipping_planes_pars_vertex:U0,clipping_planes_vertex:N0,color_fragment:k0,color_pars_fragment:F0,color_pars_vertex:O0,color_vertex:B0,common:z0,cube_uv_reflection_fragment:H0,defaultnormal_vertex:G0,displacementmap_pars_vertex:V0,displacementmap_vertex:W0,emissivemap_fragment:$0,emissivemap_pars_fragment:X0,colorspace_fragment:Y0,colorspace_pars_fragment:q0,envmap_fragment:K0,envmap_common_pars_fragment:Z0,envmap_pars_fragment:J0,envmap_pars_vertex:j0,envmap_physical_pars_fragment:cg,envmap_vertex:Q0,fog_vertex:tg,fog_pars_vertex:eg,fog_fragment:ng,fog_pars_fragment:ig,gradientmap_pars_fragment:sg,lightmap_pars_fragment:rg,lights_lambert_fragment:og,lights_lambert_pars_fragment:ag,lights_pars_begin:lg,lights_toon_fragment:hg,lights_toon_pars_fragment:ug,lights_phong_fragment:dg,lights_phong_pars_fragment:fg,lights_physical_fragment:pg,lights_physical_pars_fragment:mg,lights_fragment_begin:gg,lights_fragment_maps:xg,lights_fragment_end:vg,lightprobes_pars_fragment:_g,logdepthbuf_fragment:yg,logdepthbuf_pars_fragment:Mg,logdepthbuf_pars_vertex:bg,logdepthbuf_vertex:Sg,map_fragment:wg,map_pars_fragment:Eg,map_particle_fragment:Tg,map_particle_pars_fragment:Ag,metalnessmap_fragment:Cg,metalnessmap_pars_fragment:Rg,morphinstance_vertex:Pg,morphcolor_vertex:Lg,morphnormal_vertex:Dg,morphtarget_pars_vertex:Ig,morphtarget_vertex:Ug,normal_fragment_begin:Ng,normal_fragment_maps:kg,normal_pars_fragment:Fg,normal_pars_vertex:Og,normal_vertex:Bg,normalmap_pars_fragment:zg,clearcoat_normal_fragment_begin:Hg,clearcoat_normal_fragment_maps:Gg,clearcoat_pars_fragment:Vg,iridescence_pars_fragment:Wg,opaque_fragment:$g,packing:Xg,premultiplied_alpha_fragment:Yg,project_vertex:qg,dithering_fragment:Kg,dithering_pars_fragment:Zg,roughnessmap_fragment:Jg,roughnessmap_pars_fragment:jg,shadowmap_pars_fragment:Qg,shadowmap_pars_vertex:tx,shadowmap_vertex:ex,shadowmask_pars_fragment:nx,skinbase_vertex:ix,skinning_pars_vertex:sx,skinning_vertex:rx,skinnormal_vertex:ox,specularmap_fragment:ax,specularmap_pars_fragment:lx,tonemapping_fragment:cx,tonemapping_pars_fragment:hx,transmission_fragment:ux,transmission_pars_fragment:dx,uv_pars_fragment:fx,uv_pars_vertex:px,uv_vertex:mx,worldpos_vertex:gx,background_vert:`varying vec2 vUv;
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
}`},xt={common:{diffuse:{value:new Bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ht}},envmap:{envMap:{value:null},envMapRotation:{value:new Ht},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ht}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ht}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ht},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ht},normalScale:{value:new dt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ht},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ht}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ht}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ht}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new Bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0},uvTransform:{value:new Ht}},sprite:{diffuse:{value:new Bt(16777215)},opacity:{value:1},center:{value:new dt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}}},kn={basic:{uniforms:Je([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:Je([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new Bt(0)},envMapIntensity:{value:1}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:Je([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new Bt(0)},specular:{value:new Bt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:Je([xt.common,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.roughnessmap,xt.metalnessmap,xt.fog,xt.lights,{emissive:{value:new Bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:Je([xt.common,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.gradientmap,xt.fog,xt.lights,{emissive:{value:new Bt(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:Je([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:Je([xt.points,xt.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:Je([xt.common,xt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:Je([xt.common,xt.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:Je([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:Je([xt.sprite,xt.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ht},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ht}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distance:{uniforms:Je([xt.common,xt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distance_vert,fragmentShader:Xt.distance_frag},shadow:{uniforms:Je([xt.lights,xt.fog,{color:{value:new Bt(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};kn.physical={uniforms:Je([kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ht},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ht},clearcoatNormalScale:{value:new dt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ht},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ht},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ht},sheen:{value:0},sheenColor:{value:new Bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ht},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ht},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ht},transmissionSamplerSize:{value:new dt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ht},attenuationDistance:{value:0},attenuationColor:{value:new Bt(0)},specularColor:{value:new Bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ht},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ht},anisotropyVector:{value:new dt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ht}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const wo={r:0,b:0,g:0},xx=new se,bu=new Ht;bu.set(-1,0,0,0,1,0,0,0,1);function vx(s,t,e,n,i,r){const o=new Bt(0);let a=i===!0?0:1,l,c,h=null,u=0,d=null;function f(x){let A=x.isScene===!0?x.background:null;if(A&&A.isTexture){const M=x.backgroundBlurriness>0;A=t.get(A,M)}return A}function p(x){let A=!1;const M=f(x);M===null?m(o,a):M&&M.isColor&&(m(M,1),A=!0);const E=s.xr.getEnvironmentBlendMode();E==="additive"?e.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||A)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function v(x,A){const M=f(A);M&&(M.isCubeTexture||M.mapping===Nr)?(c===void 0&&(c=new Yt(new Tn(1,1,1),new Le({name:"BackgroundCubeMaterial",uniforms:ks(kn.backgroundCube.uniforms),vertexShader:kn.backgroundCube.vertexShader,fragmentShader:kn.backgroundCube.fragmentShader,side:Ke,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,b,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(xx.makeRotationFromEuler(A.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(bu),c.material.toneMapped=Qt.getTransfer(M.colorSpace)!==re,(h!==M||u!==M.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,h=M,u=M.version,d=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new Yt(new mn(2,2),new Le({name:"BackgroundMaterial",uniforms:ks(kn.background.uniforms),vertexShader:kn.background.vertexShader,fragmentShader:kn.background.fragmentShader,side:pi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=Qt.getTransfer(M.colorSpace)!==re,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||u!==M.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,h=M,u=M.version,d=s.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function m(x,A){x.getRGB(wo,uu(s)),e.buffers.color.setClear(wo.r,wo.g,wo.b,A,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(x,A=1){o.set(x),a=A,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(x){a=x,m(o,a)},render:p,addToRenderList:v,dispose:g}}function _x(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,o=!1;function a(D,N,H,Y,k){let G=!1;const z=u(D,Y,H,N);r!==z&&(r=z,c(r.object)),G=f(D,Y,H,k),G&&p(D,Y,H,k),k!==null&&t.update(k,s.ELEMENT_ARRAY_BUFFER),(G||o)&&(o=!1,M(D,N,H,Y),k!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function l(){return s.createVertexArray()}function c(D){return s.bindVertexArray(D)}function h(D){return s.deleteVertexArray(D)}function u(D,N,H,Y){const k=Y.wireframe===!0;let G=n[N.id];G===void 0&&(G={},n[N.id]=G);const z=D.isInstancedMesh===!0?D.id:0;let K=G[z];K===void 0&&(K={},G[z]=K);let tt=K[H.id];tt===void 0&&(tt={},K[H.id]=tt);let ot=tt[k];return ot===void 0&&(ot=d(l()),tt[k]=ot),ot}function d(D){const N=[],H=[],Y=[];for(let k=0;k<e;k++)N[k]=0,H[k]=0,Y[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:H,attributeDivisors:Y,object:D,attributes:{},index:null}}function f(D,N,H,Y){const k=r.attributes,G=N.attributes;let z=0;const K=H.getAttributes();for(const tt in K)if(K[tt].location>=0){const at=k[tt];let pt=G[tt];if(pt===void 0&&(tt==="instanceMatrix"&&D.instanceMatrix&&(pt=D.instanceMatrix),tt==="instanceColor"&&D.instanceColor&&(pt=D.instanceColor)),at===void 0||at.attribute!==pt||pt&&at.data!==pt.data)return!0;z++}return r.attributesNum!==z||r.index!==Y}function p(D,N,H,Y){const k={},G=N.attributes;let z=0;const K=H.getAttributes();for(const tt in K)if(K[tt].location>=0){let at=G[tt];at===void 0&&(tt==="instanceMatrix"&&D.instanceMatrix&&(at=D.instanceMatrix),tt==="instanceColor"&&D.instanceColor&&(at=D.instanceColor));const pt={};pt.attribute=at,at&&at.data&&(pt.data=at.data),k[tt]=pt,z++}r.attributes=k,r.attributesNum=z,r.index=Y}function v(){const D=r.newAttributes;for(let N=0,H=D.length;N<H;N++)D[N]=0}function m(D){g(D,0)}function g(D,N){const H=r.newAttributes,Y=r.enabledAttributes,k=r.attributeDivisors;H[D]=1,Y[D]===0&&(s.enableVertexAttribArray(D),Y[D]=1),k[D]!==N&&(s.vertexAttribDivisor(D,N),k[D]=N)}function x(){const D=r.newAttributes,N=r.enabledAttributes;for(let H=0,Y=N.length;H<Y;H++)N[H]!==D[H]&&(s.disableVertexAttribArray(H),N[H]=0)}function A(D,N,H,Y,k,G,z){z===!0?s.vertexAttribIPointer(D,N,H,k,G):s.vertexAttribPointer(D,N,H,Y,k,G)}function M(D,N,H,Y){v();const k=Y.attributes,G=H.getAttributes(),z=N.defaultAttributeValues;for(const K in G){const tt=G[K];if(tt.location>=0){let ot=k[K];if(ot===void 0&&(K==="instanceMatrix"&&D.instanceMatrix&&(ot=D.instanceMatrix),K==="instanceColor"&&D.instanceColor&&(ot=D.instanceColor)),ot!==void 0){const at=ot.normalized,pt=ot.itemSize,zt=t.get(ot);if(zt===void 0)continue;const xe=zt.buffer,jt=zt.type,j=zt.bytesPerElement,ht=jt===s.INT||jt===s.UNSIGNED_INT||ot.gpuType===wa;if(ot.isInterleavedBufferAttribute){const st=ot.data,Et=st.stride,Ot=ot.offset;if(st.isInstancedInterleavedBuffer){for(let Nt=0;Nt<tt.locationSize;Nt++)g(tt.location+Nt,st.meshPerAttribute);D.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let Nt=0;Nt<tt.locationSize;Nt++)m(tt.location+Nt);s.bindBuffer(s.ARRAY_BUFFER,xe);for(let Nt=0;Nt<tt.locationSize;Nt++)A(tt.location+Nt,pt/tt.locationSize,jt,at,Et*j,(Ot+pt/tt.locationSize*Nt)*j,ht)}else{if(ot.isInstancedBufferAttribute){for(let st=0;st<tt.locationSize;st++)g(tt.location+st,ot.meshPerAttribute);D.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let st=0;st<tt.locationSize;st++)m(tt.location+st);s.bindBuffer(s.ARRAY_BUFFER,xe);for(let st=0;st<tt.locationSize;st++)A(tt.location+st,pt/tt.locationSize,jt,at,pt*j,pt/tt.locationSize*st*j,ht)}}else if(z!==void 0){const at=z[K];if(at!==void 0)switch(at.length){case 2:s.vertexAttrib2fv(tt.location,at);break;case 3:s.vertexAttrib3fv(tt.location,at);break;case 4:s.vertexAttrib4fv(tt.location,at);break;default:s.vertexAttrib1fv(tt.location,at)}}}}x()}function E(){T();for(const D in n){const N=n[D];for(const H in N){const Y=N[H];for(const k in Y){const G=Y[k];for(const z in G)h(G[z].object),delete G[z];delete Y[k]}}delete n[D]}}function b(D){if(n[D.id]===void 0)return;const N=n[D.id];for(const H in N){const Y=N[H];for(const k in Y){const G=Y[k];for(const z in G)h(G[z].object),delete G[z];delete Y[k]}}delete n[D.id]}function P(D){for(const N in n){const H=n[N];for(const Y in H){const k=H[Y];if(k[D.id]===void 0)continue;const G=k[D.id];for(const z in G)h(G[z].object),delete G[z];delete k[D.id]}}}function y(D){for(const N in n){const H=n[N],Y=D.isInstancedMesh===!0?D.id:0,k=H[Y];if(k!==void 0){for(const G in k){const z=k[G];for(const K in z)h(z[K].object),delete z[K];delete k[G]}delete H[Y],Object.keys(H).length===0&&delete n[N]}}}function T(){I(),o=!0,r!==i&&(r=i,c(r.object))}function I(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:T,resetDefaultState:I,dispose:E,releaseStatesOfGeometry:b,releaseStatesOfObject:y,releaseStatesOfProgram:P,initAttributes:v,enableAttribute:m,disableUnusedAttributes:x}}function yx(s,t,e){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];e.update(d,n,1)}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Mx(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const P=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(P){return!(P!==Mn&&n.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(P){const y=P===on&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==rn&&n.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==yn&&!y)}function l(P){if(P==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(Ut("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&d===!1&&Ut("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),A=s.getParameter(s.MAX_VARYING_VECTORS),M=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),E=s.getParameter(s.MAX_SAMPLES),b=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:x,maxVaryings:A,maxFragmentUniforms:M,maxSamples:E,samples:b}}function bx(s){const t=this;let e=null,n=0,i=!1,r=!1;const o=new bi,a=new Ht,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const p=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,g=s.get(u);if(!i||p===null||p.length===0||r&&!m)r?h(null):c();else{const x=r?0:n,A=x*4;let M=g.clippingState||null;l.value=M,M=h(p,d,A,f);for(let E=0;E!==A;++E)M[E]=e[E];g.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,p){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,p!==!0||m===null){const g=f+v*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<g)&&(m=new Float32Array(g));for(let A=0,M=f;A!==v;++A,M+=4)o.copy(u[A]).applyMatrix4(x,a),o.normal.toArray(m,M),m[M+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}const wi=4,Su=[.125,.215,.35,.446,.526,.582],Ki=20,Sx=256,pr=new So,wu=new Bt;let ql=null,Kl=0,Zl=0,Jl=!1;const wx=new L;class Eu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){const{size:o=256,position:a=wx}=r;ql=this._renderer.getRenderTarget(),Kl=this._renderer.getActiveCubeFace(),Zl=this._renderer.getActiveMipmapLevel(),Jl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Cu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Au(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(ql,Kl,Zl),this._renderer.xr.enabled=Jl,t.scissorTest=!1,Bs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===zi||t.mapping===fs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ql=this._renderer.getRenderTarget(),Kl=this._renderer.getActiveCubeFace(),Zl=this._renderer.getActiveMipmapLevel(),Jl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ze,minFilter:ze,generateMipmaps:!1,type:on,format:Mn,colorSpace:tr,depthBuffer:!1},i=Tu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Tu(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Ex(r)),this._blurMaterial=Ax(r,t,e),this._ggxMaterial=Tx(r,t,e)}return i}_compileMaterial(t){const e=new Yt(new He,t);this._renderer.compile(e,pr)}_sceneToCubeUV(t,e,n,i,r){const l=new tn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(wu),u.toneMapping=Ln,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Yt(new Tn,new ii({name:"PMREM.Background",side:Ke,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,m=v.material;let g=!1;const x=t.background;x?x.isColor&&(m.color.copy(x),t.background=null,g=!0):(m.color.copy(wu),g=!0);for(let A=0;A<6;A++){const M=A%3;M===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[A],r.y,r.z)):M===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[A]));const E=this._cubeSize;Bs(i,M*E,A>2?E:0,E,E),u.setRenderTarget(i),g&&u.render(v,l),u.render(t,l)}u.toneMapping=f,u.autoClear=d,t.background=x}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===zi||t.mapping===fs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Cu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Au());const r=i?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;const a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Bs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,pr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const i=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;const l=o.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=0+c*1.25,f=u*d,{_lodMax:p}=this,v=this._sizeLods[n],m=3*v*(n>p-wi?n-p+wi:0),g=4*(this._cubeSize-v);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=p-e,Bs(r,m,g,3*v,2*v),i.setRenderTarget(r),i.render(a,pr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,Bs(t,m,g,3*v,2*v),i.setRenderTarget(t),i.render(a,pr)}_blur(t,e,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&ee("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[i];u.material=c;const d=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Ki-1),v=r/p,m=isFinite(r)?1+Math.floor(h*v):Ki;m>Ki&&Ut(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ki}`);const g=[];let x=0;for(let P=0;P<Ki;++P){const y=P/v,T=Math.exp(-y*y/2);g.push(T),P===0?x+=T:P<m&&(x+=2*T)}for(let P=0;P<g.length;P++)g[P]=g[P]/x;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:A}=this;d.dTheta.value=p,d.mipInt.value=A-n;const M=this._sizeLods[i],E=3*M*(i>A-wi?i-A+wi:0),b=4*(this._cubeSize-M);Bs(e,E,b,3*M,2*M),l.setRenderTarget(e),l.render(u,pr)}}function Ex(s){const t=[],e=[],n=[];let i=s;const r=s-wi+1+Su.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>s-wi?l=Su[o-s+wi-1]:o===0&&(l=0),e.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,v=3,m=2,g=1,x=new Float32Array(v*p*f),A=new Float32Array(m*p*f),M=new Float32Array(g*p*f);for(let b=0;b<f;b++){const P=b%3*2/3-1,y=b>2?0:-1,T=[P,y,0,P+2/3,y,0,P+2/3,y+1,0,P,y,0,P+2/3,y+1,0,P,y+1,0];x.set(T,v*p*b),A.set(d,m*p*b);const I=[b,b,b,b,b,b];M.set(I,g*p*b)}const E=new He;E.setAttribute("position",new fn(x,v)),E.setAttribute("uv",new fn(A,m)),E.setAttribute("faceIndex",new fn(M,g)),n.push(new Yt(E,null)),i>wi&&i--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function Tu(s,t,e){const n=new je(s,t,e);return n.texture.mapping=Nr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Bs(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function Tx(s,t,e){return new Le({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Sx,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Eo(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Ax(s,t,e){const n=new Float32Array(Ki),i=new L(0,1,0);return new Le({name:"SphericalGaussianBlur",defines:{n:Ki,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Eo(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Au(){return new Le({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Eo(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Cu(){return new Le({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Eo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Eo(){return`

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
	`}class Ru extends je{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new nu(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Tn(5,5,5),r=new Le({name:"CubemapFromEquirect",uniforms:ks(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ke,blending:Pn});r.uniforms.tEquirect.value=e;const o=new Yt(i,r),a=e.minFilter;return e.minFilter===Hi&&(e.minFilter=ze),new l0(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}}function Cx(s){let t=new WeakMap,e=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?o(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===ya||f===Ma)if(t.has(d)){const p=t.get(d).texture;return a(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const v=new Ru(p.height);return v.fromEquirectangularTexture(s,d),t.set(d,v),d.addEventListener("dispose",c),a(v.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture){const f=d.mapping,p=f===ya||f===Ma,v=f===zi||f===fs;if(p||v){let m=e.get(d);const g=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return n===null&&(n=new Eu(s)),m=p?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),m.texture;if(m!==void 0)return m.texture;{const x=d.image;return p&&x&&x.height>0||v&&x&&l(x)?(n===null&&(n=new Eu(s)),m=p?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function a(d,f){return f===ya?d.mapping=zi:f===Ma&&(d.mapping=fs),d}function l(d){let f=0;const p=6;for(let v=0;v<p;v++)d[v]!==void 0&&f++;return f===p}function c(d){const f=d.target;f.removeEventListener("dispose",c);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function u(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function Rx(s){const t={};function e(n){if(t[n]!==void 0)return t[n];const i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&ms("WebGLRenderer: "+n+" extension not supported."),i}}}function Px(s,t,e,n){const i={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const p in d.attributes)t.remove(d.attributes[p]);d.removeEventListener("dispose",o),delete i[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)t.update(d[f],s.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,p=u.attributes.position;let v=0;if(p===void 0)return;if(f!==null){const x=f.array;v=f.version;for(let A=0,M=x.length;A<M;A+=3){const E=x[A+0],b=x[A+1],P=x[A+2];d.push(E,b,b,P,P,E)}}else{const x=p.array;v=p.version;for(let A=0,M=x.length/3-1;A<M;A+=3){const E=A+0,b=A+1,P=A+2;d.push(E,b,b,P,P,E)}}const m=new(p.count>=65535?Vh:Gh)(d,1);m.version=v;const g=r.get(u);g&&t.remove(g),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Lx(s,t,e){let n;function i(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,d){s.drawElements(n,d,r,u*o),e.update(d,n,1)}function c(u,d,f){f!==0&&(s.drawElementsInstanced(n,d,r,u*o,f),e.update(d,n,f))}function h(u,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let v=0;for(let m=0;m<f;m++)v+=d[m];e.update(v,n,1)}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Dx(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:ee("WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Ix(s,t,e){const n=new WeakMap,i=new ve;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let T=function(){P.dispose(),n.delete(a),a.removeEventListener("dispose",T)};d!==void 0&&d.texture.dispose();const f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let A=0;f===!0&&(A=1),p===!0&&(A=2),v===!0&&(A=3);let M=a.attributes.position.count*A,E=1;M>t.maxTextureSize&&(E=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const b=new Float32Array(M*E*4*u),P=new Dh(b,M,E,u);P.type=yn,P.needsUpdate=!0;const y=A*4;for(let I=0;I<u;I++){const D=m[I],N=g[I],H=x[I],Y=M*E*4*I;for(let k=0;k<D.count;k++){const G=k*y;f===!0&&(i.fromBufferAttribute(D,k),b[Y+G+0]=i.x,b[Y+G+1]=i.y,b[Y+G+2]=i.z,b[Y+G+3]=0),p===!0&&(i.fromBufferAttribute(N,k),b[Y+G+4]=i.x,b[Y+G+5]=i.y,b[Y+G+6]=i.z,b[Y+G+7]=0),v===!0&&(i.fromBufferAttribute(H,k),b[Y+G+8]=i.x,b[Y+G+9]=i.y,b[Y+G+10]=i.z,b[Y+G+11]=H.itemSize===4?i.w:1)}}d={count:u,texture:P,size:new dt(M,E)},n.set(a,d),a.addEventListener("dispose",T)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",p),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function Ux(s,t,e,n,i){let r=new WeakMap;function o(c){const h=i.render.frame,u=c.geometry,d=t.get(c,u);if(r.get(d)!==h&&(t.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function a(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}const Nx={[ch]:"LINEAR_TONE_MAPPING",[hh]:"REINHARD_TONE_MAPPING",[uh]:"CINEON_TONE_MAPPING",[_a]:"ACES_FILMIC_TONE_MAPPING",[fh]:"AGX_TONE_MAPPING",[ph]:"NEUTRAL_TONE_MAPPING",[dh]:"CUSTOM_TONE_MAPPING"};function kx(s,t,e,n,i,r){const o=new je(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,depthTexture:i?new Us(t,e):void 0}),a=new je(t,e,{type:on,depthBuffer:!1,stencilBuffer:!1}),l=new He;l.setAttribute("position",new oe([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new oe([0,2,0,0,2,0],2));const c=new Qm({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new Yt(l,c),u=new So(-1,1,1,-1,0,1);let d=null,f=null,p=!1,v,m=null,g=[],x=!1;this.setSize=function(A,M){o.setSize(A,M),a.setSize(A,M);for(let E=0;E<g.length;E++){const b=g[E];b.setSize&&b.setSize(A,M)}},this.setEffects=function(A){g=A,x=g.length>0&&g[0].isRenderPass===!0;const M=o.width,E=o.height;for(let b=0;b<g.length;b++){const P=g[b];P.setSize&&P.setSize(M,E)}},this.begin=function(A,M){if(p||A.toneMapping===Ln&&g.length===0)return!1;if(m=M,M!==null){const E=M.width,b=M.height;(o.width!==E||o.height!==b)&&this.setSize(E,b)}return x===!1&&A.setRenderTarget(o),v=A.toneMapping,A.toneMapping=Ln,!0},this.hasRenderPass=function(){return x},this.end=function(A,M){A.toneMapping=v,p=!0;let E=o,b=a;for(let P=0;P<g.length;P++){const y=g[P];if(y.enabled!==!1&&(y.render(A,b,E,M),y.needsSwap!==!1)){const T=E;E=b,b=T}}if(d!==A.outputColorSpace||f!==A.toneMapping){d=A.outputColorSpace,f=A.toneMapping,c.defines={},Qt.getTransfer(d)===re&&(c.defines.SRGB_TRANSFER="");const P=Nx[f];P&&(c.defines[P]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=E.texture,A.setRenderTarget(m),A.render(h,u),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),a.dispose(),l.dispose(),c.dispose()}}const Pu=new We,jl=new Us(1,1),Lu=new Dh,Du=new pm,Iu=new nu,Uu=[],Nu=[],ku=new Float32Array(16),Fu=new Float32Array(9),Ou=new Float32Array(4);function zs(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=Uu[i];if(r===void 0&&(r=new Float32Array(i),Uu[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function De(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Ie(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function To(s,t){let e=Nu[t];e===void 0&&(e=new Int32Array(t),Nu[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function Fx(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Ox(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;s.uniform2fv(this.addr,t),Ie(e,t)}}function Bx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(De(e,t))return;s.uniform3fv(this.addr,t),Ie(e,t)}}function zx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;s.uniform4fv(this.addr,t),Ie(e,t)}}function Hx(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(De(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Ie(e,t)}else{if(De(e,n))return;Ou.set(n),s.uniformMatrix2fv(this.addr,!1,Ou),Ie(e,n)}}function Gx(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(De(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Ie(e,t)}else{if(De(e,n))return;Fu.set(n),s.uniformMatrix3fv(this.addr,!1,Fu),Ie(e,n)}}function Vx(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(De(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Ie(e,t)}else{if(De(e,n))return;ku.set(n),s.uniformMatrix4fv(this.addr,!1,ku),Ie(e,n)}}function Wx(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function $x(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;s.uniform2iv(this.addr,t),Ie(e,t)}}function Xx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(De(e,t))return;s.uniform3iv(this.addr,t),Ie(e,t)}}function Yx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;s.uniform4iv(this.addr,t),Ie(e,t)}}function qx(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Kx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;s.uniform2uiv(this.addr,t),Ie(e,t)}}function Zx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(De(e,t))return;s.uniform3uiv(this.addr,t),Ie(e,t)}}function Jx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;s.uniform4uiv(this.addr,t),Ie(e,t)}}function jx(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(jl.compareFunction=e.isReversedDepthBuffer()?cl:ll,r=jl):r=Pu,e.setTexture2D(t||r,i)}function Qx(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Du,i)}function tv(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Iu,i)}function ev(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Lu,i)}function nv(s){switch(s){case 5126:return Fx;case 35664:return Ox;case 35665:return Bx;case 35666:return zx;case 35674:return Hx;case 35675:return Gx;case 35676:return Vx;case 5124:case 35670:return Wx;case 35667:case 35671:return $x;case 35668:case 35672:return Xx;case 35669:case 35673:return Yx;case 5125:return qx;case 36294:return Kx;case 36295:return Zx;case 36296:return Jx;case 35678:case 36198:case 36298:case 36306:case 35682:return jx;case 35679:case 36299:case 36307:return Qx;case 35680:case 36300:case 36308:case 36293:return tv;case 36289:case 36303:case 36311:case 36292:return ev}}function iv(s,t){s.uniform1fv(this.addr,t)}function sv(s,t){const e=zs(t,this.size,2);s.uniform2fv(this.addr,e)}function rv(s,t){const e=zs(t,this.size,3);s.uniform3fv(this.addr,e)}function ov(s,t){const e=zs(t,this.size,4);s.uniform4fv(this.addr,e)}function av(s,t){const e=zs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function lv(s,t){const e=zs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function cv(s,t){const e=zs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function hv(s,t){s.uniform1iv(this.addr,t)}function uv(s,t){s.uniform2iv(this.addr,t)}function dv(s,t){s.uniform3iv(this.addr,t)}function fv(s,t){s.uniform4iv(this.addr,t)}function pv(s,t){s.uniform1uiv(this.addr,t)}function mv(s,t){s.uniform2uiv(this.addr,t)}function gv(s,t){s.uniform3uiv(this.addr,t)}function xv(s,t){s.uniform4uiv(this.addr,t)}function vv(s,t,e){const n=this.cache,i=t.length,r=To(e,i);De(n,r)||(s.uniform1iv(this.addr,r),Ie(n,r));let o;this.type===s.SAMPLER_2D_SHADOW?o=jl:o=Pu;for(let a=0;a!==i;++a)e.setTexture2D(t[a]||o,r[a])}function _v(s,t,e){const n=this.cache,i=t.length,r=To(e,i);De(n,r)||(s.uniform1iv(this.addr,r),Ie(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Du,r[o])}function yv(s,t,e){const n=this.cache,i=t.length,r=To(e,i);De(n,r)||(s.uniform1iv(this.addr,r),Ie(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||Iu,r[o])}function Mv(s,t,e){const n=this.cache,i=t.length,r=To(e,i);De(n,r)||(s.uniform1iv(this.addr,r),Ie(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Lu,r[o])}function bv(s){switch(s){case 5126:return iv;case 35664:return sv;case 35665:return rv;case 35666:return ov;case 35674:return av;case 35675:return lv;case 35676:return cv;case 5124:case 35670:return hv;case 35667:case 35671:return uv;case 35668:case 35672:return dv;case 35669:case 35673:return fv;case 5125:return pv;case 36294:return mv;case 36295:return gv;case 36296:return xv;case 35678:case 36198:case 36298:case 36306:case 35682:return vv;case 35679:case 36299:case 36307:return _v;case 35680:case 36300:case 36308:case 36293:return yv;case 36289:case 36303:case 36311:case 36292:return Mv}}class Sv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=nv(e.type)}}class wv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=bv(e.type)}}class Ev{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(t,e[a.id],n)}}}const Ql=/(\w+)(\])?(\[|\.)?/g;function Bu(s,t){s.seq.push(t),s.map[t.id]=t}function Tv(s,t,e){const n=s.name,i=n.length;for(Ql.lastIndex=0;;){const r=Ql.exec(n),o=Ql.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Bu(e,c===void 0?new Sv(a,s,t):new wv(a,s,t));break}else{let u=e.map[a];u===void 0&&(u=new Ev(a),Bu(e,u)),e=u}}}class Ao{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){const a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);Tv(a,l,this)}const i=[],r=[];for(const o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(o):r.push(o);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function zu(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const Av=37297;let Cv=0;function Rv(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Hu=new Ht;function Pv(s){Qt._getMatrix(Hu,Qt.workingColorSpace,s);const t=`mat3( ${Hu.elements.map(e=>e.toFixed(4))} )`;switch(Qt.getTransfer(s)){case Wr:return[t,"LinearTransferOETF"];case re:return[t,"sRGBTransferOETF"];default:return Ut("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Gu(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Rv(s.getShaderSource(t),a)}else return r}function Lv(s,t){const e=Pv(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const Dv={[ch]:"Linear",[hh]:"Reinhard",[uh]:"Cineon",[_a]:"ACESFilmic",[fh]:"AgX",[ph]:"Neutral",[dh]:"Custom"};function Iv(s,t){const e=Dv[t];return e===void 0?(Ut("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Co=new L;function Uv(){Qt.getLuminanceCoefficients(Co);const s=Co.x.toFixed(4),t=Co.y.toFixed(4),e=Co.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Nv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(mr).join(`
`)}function kv(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Fv(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function mr(s){return s!==""}function Vu(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Wu(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Ov=/^[ \t]*#include +<([\w\d./]+)>/gm;function tc(s){return s.replace(Ov,zv)}const Bv=new Map;function zv(s,t){let e=Xt[t];if(e===void 0){const n=Bv.get(t);if(n!==void 0)e=Xt[n],Ut('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return tc(e)}const Hv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $u(s){return s.replace(Hv,Gv)}function Gv(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Xu(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}const Vv={[Ir]:"SHADOWMAP_TYPE_PCF",[Js]:"SHADOWMAP_TYPE_VSM"};function Wv(s){return Vv[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const $v={[zi]:"ENVMAP_TYPE_CUBE",[fs]:"ENVMAP_TYPE_CUBE",[Nr]:"ENVMAP_TYPE_CUBE_UV"};function Xv(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":$v[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const Yv={[fs]:"ENVMAP_MODE_REFRACTION"};function qv(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Yv[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Kv={[lh]:"ENVMAP_BLENDING_MULTIPLY",[Dp]:"ENVMAP_BLENDING_MIX",[Ip]:"ENVMAP_BLENDING_ADD"};function Zv(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Kv[s.combine]||"ENVMAP_BLENDING_NONE"}function Jv(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function jv(s,t,e,n){const i=s.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=Wv(e),c=Xv(e),h=qv(e),u=Zv(e),d=Jv(e),f=Nv(e),p=kv(r),v=i.createProgram();let m,g,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(mr).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(mr).join(`
`),g.length>0&&(g+=`
`)):(m=[Xu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(mr).join(`
`),g=[Xu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ln?"#define TONE_MAPPING":"",e.toneMapping!==Ln?Xt.tonemapping_pars_fragment:"",e.toneMapping!==Ln?Iv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,Lv("linearToOutputTexel",e.outputColorSpace),Uv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(mr).join(`
`)),o=tc(o),o=Vu(o,e),o=Wu(o,e),a=tc(a),a=Vu(a,e),a=Wu(a,e),o=$u(o),a=$u(a),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===wh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===wh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const A=x+m+o,M=x+g+a,E=zu(i,i.VERTEX_SHADER,A),b=zu(i,i.FRAGMENT_SHADER,M);i.attachShader(v,E),i.attachShader(v,b),e.index0AttributeName!==void 0?i.bindAttribLocation(v,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function P(D){if(s.debug.checkShaderErrors){const N=i.getProgramInfoLog(v)||"",H=i.getShaderInfoLog(E)||"",Y=i.getShaderInfoLog(b)||"",k=N.trim(),G=H.trim(),z=Y.trim();let K=!0,tt=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(K=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,E,b);else{const ot=Gu(i,E,"vertex"),at=Gu(i,b,"fragment");ee("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+k+`
`+ot+`
`+at)}else k!==""?Ut("WebGLProgram: Program Info Log:",k):(G===""||z==="")&&(tt=!1);tt&&(D.diagnostics={runnable:K,programLog:k,vertexShader:{log:G,prefix:m},fragmentShader:{log:z,prefix:g}})}i.deleteShader(E),i.deleteShader(b),y=new Ao(i,v),T=Fv(i,v)}let y;this.getUniforms=function(){return y===void 0&&P(this),y};let T;this.getAttributes=function(){return T===void 0&&P(this),T};let I=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=i.getProgramParameter(v,Av)),I},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Cv++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=b,this}let Qv=0;class t_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new e_(t),e.set(t,n)),n}}class e_{constructor(t){this.id=Qv++,this.code=t,this.usedTimes=0}}function n_(s){return s===Vi||s===Gr||s===Vr}function i_(s,t,e,n,i,r){const o=new gl,a=new t_,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(y){return l.add(y),y===0?"uv":`uv${y}`}function v(y,T,I,D,N,H){const Y=D.fog,k=N.geometry,G=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?D.environment:null,z=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,K=t.get(y.envMap||G,z),tt=K&&K.mapping===Nr?K.image.height:null,ot=f[y.type];y.precision!==null&&(d=n.getMaxPrecision(y.precision),d!==y.precision&&Ut("WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));const at=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,pt=at!==void 0?at.length:0;let zt=0;k.morphAttributes.position!==void 0&&(zt=1),k.morphAttributes.normal!==void 0&&(zt=2),k.morphAttributes.color!==void 0&&(zt=3);let xe,jt,j,ht;if(ot){const Tt=kn[ot];xe=Tt.vertexShader,jt=Tt.fragmentShader}else{xe=y.vertexShader,jt=y.fragmentShader;const Tt=a.getVertexShaderStage(y),Se=a.getFragmentShaderStage(y);a.update(y,Tt,Se),j=Tt.id,ht=Se.id}const st=s.getRenderTarget(),Et=s.state.buffers.depth.getReversed(),Ot=N.isInstancedMesh===!0,Nt=N.isBatchedMesh===!0,pe=!!y.map,qt=!!y.matcap,ie=!!K,te=!!y.aoMap,Jt=!!y.lightMap,ye=!!y.bumpMap&&y.wireframe===!1,Ee=!!y.normalMap,Te=!!y.displacementMap,Ne=!!y.emissiveMap,me=!!y.metalnessMap,Me=!!y.roughnessMap,S=y.anisotropy>0,nt=y.clearcoat>0,_t=y.dispersion>0,C=y.iridescence>0,_=y.sheen>0,U=y.transmission>0,O=S&&!!y.anisotropyMap,X=nt&&!!y.clearcoatMap,it=nt&&!!y.clearcoatNormalMap,ct=nt&&!!y.clearcoatRoughnessMap,J=C&&!!y.iridescenceMap,Z=C&&!!y.iridescenceThicknessMap,lt=_&&!!y.sheenColorMap,St=_&&!!y.sheenRoughnessMap,ft=!!y.specularMap,mt=!!y.specularColorMap,Dt=!!y.specularIntensityMap,kt=U&&!!y.transmissionMap,Gt=U&&!!y.thicknessMap,F=!!y.gradientMap,ut=!!y.alphaMap,Q=y.alphaTest>0,gt=!!y.alphaHash,Mt=!!y.extensions;let et=Ln;y.toneMapped&&(st===null||st.isXRRenderTarget===!0)&&(et=s.toneMapping);const Ct={shaderID:ot,shaderType:y.type,shaderName:y.name,vertexShader:xe,fragmentShader:jt,defines:y.defines,customVertexShaderID:j,customFragmentShaderID:ht,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:Nt,batchingColor:Nt&&N._colorsTexture!==null,instancing:Ot,instancingColor:Ot&&N.instanceColor!==null,instancingMorph:Ot&&N.morphTexture!==null,outputColorSpace:st===null?s.outputColorSpace:st.isXRRenderTarget===!0?st.texture.colorSpace:Qt.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:pe,matcap:qt,envMap:ie,envMapMode:ie&&K.mapping,envMapCubeUVHeight:tt,aoMap:te,lightMap:Jt,bumpMap:ye,normalMap:Ee,displacementMap:Te,emissiveMap:Ne,normalMapObjectSpace:Ee&&y.normalMapType===kp,normalMapTangentSpace:Ee&&y.normalMapType===al,packedNormalMap:Ee&&y.normalMapType===al&&n_(y.normalMap.format),metalnessMap:me,roughnessMap:Me,anisotropy:S,anisotropyMap:O,clearcoat:nt,clearcoatMap:X,clearcoatNormalMap:it,clearcoatRoughnessMap:ct,dispersion:_t,iridescence:C,iridescenceMap:J,iridescenceThicknessMap:Z,sheen:_,sheenColorMap:lt,sheenRoughnessMap:St,specularMap:ft,specularColorMap:mt,specularIntensityMap:Dt,transmission:U,transmissionMap:kt,thicknessMap:Gt,gradientMap:F,opaque:y.transparent===!1&&y.blending===us&&y.alphaToCoverage===!1,alphaMap:ut,alphaTest:Q,alphaHash:gt,combine:y.combine,mapUv:pe&&p(y.map.channel),aoMapUv:te&&p(y.aoMap.channel),lightMapUv:Jt&&p(y.lightMap.channel),bumpMapUv:ye&&p(y.bumpMap.channel),normalMapUv:Ee&&p(y.normalMap.channel),displacementMapUv:Te&&p(y.displacementMap.channel),emissiveMapUv:Ne&&p(y.emissiveMap.channel),metalnessMapUv:me&&p(y.metalnessMap.channel),roughnessMapUv:Me&&p(y.roughnessMap.channel),anisotropyMapUv:O&&p(y.anisotropyMap.channel),clearcoatMapUv:X&&p(y.clearcoatMap.channel),clearcoatNormalMapUv:it&&p(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ct&&p(y.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&p(y.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&p(y.iridescenceThicknessMap.channel),sheenColorMapUv:lt&&p(y.sheenColorMap.channel),sheenRoughnessMapUv:St&&p(y.sheenRoughnessMap.channel),specularMapUv:ft&&p(y.specularMap.channel),specularColorMapUv:mt&&p(y.specularColorMap.channel),specularIntensityMapUv:Dt&&p(y.specularIntensityMap.channel),transmissionMapUv:kt&&p(y.transmissionMap.channel),thicknessMapUv:Gt&&p(y.thicknessMap.channel),alphaMapUv:ut&&p(y.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Ee||S),vertexNormals:!!k.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!k.attributes.uv&&(pe||ut),fog:!!Y,useFog:y.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||k.attributes.normal===void 0&&Ee===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Et,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:pt,morphTextureStride:zt,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:H.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:et,decodeVideoTexture:pe&&y.map.isVideoTexture===!0&&Qt.getTransfer(y.map.colorSpace)===re,decodeVideoTextureEmissive:Ne&&y.emissiveMap.isVideoTexture===!0&&Qt.getTransfer(y.emissiveMap.colorSpace)===re,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Xn,flipSided:y.side===Ke,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Mt&&y.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Mt&&y.extensions.multiDraw===!0||Nt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Ct.vertexUv1s=l.has(1),Ct.vertexUv2s=l.has(2),Ct.vertexUv3s=l.has(3),l.clear(),Ct}function m(y){const T=[];if(y.shaderID?T.push(y.shaderID):(T.push(y.customVertexShaderID),T.push(y.customFragmentShaderID)),y.defines!==void 0)for(const I in y.defines)T.push(I),T.push(y.defines[I]);return y.isRawShaderMaterial===!1&&(g(T,y),x(T,y),T.push(s.outputColorSpace)),T.push(y.customProgramCacheKey),T.join()}function g(y,T){y.push(T.precision),y.push(T.outputColorSpace),y.push(T.envMapMode),y.push(T.envMapCubeUVHeight),y.push(T.mapUv),y.push(T.alphaMapUv),y.push(T.lightMapUv),y.push(T.aoMapUv),y.push(T.bumpMapUv),y.push(T.normalMapUv),y.push(T.displacementMapUv),y.push(T.emissiveMapUv),y.push(T.metalnessMapUv),y.push(T.roughnessMapUv),y.push(T.anisotropyMapUv),y.push(T.clearcoatMapUv),y.push(T.clearcoatNormalMapUv),y.push(T.clearcoatRoughnessMapUv),y.push(T.iridescenceMapUv),y.push(T.iridescenceThicknessMapUv),y.push(T.sheenColorMapUv),y.push(T.sheenRoughnessMapUv),y.push(T.specularMapUv),y.push(T.specularColorMapUv),y.push(T.specularIntensityMapUv),y.push(T.transmissionMapUv),y.push(T.thicknessMapUv),y.push(T.combine),y.push(T.fogExp2),y.push(T.sizeAttenuation),y.push(T.morphTargetsCount),y.push(T.morphAttributeCount),y.push(T.numDirLights),y.push(T.numPointLights),y.push(T.numSpotLights),y.push(T.numSpotLightMaps),y.push(T.numHemiLights),y.push(T.numRectAreaLights),y.push(T.numDirLightShadows),y.push(T.numPointLightShadows),y.push(T.numSpotLightShadows),y.push(T.numSpotLightShadowsWithMaps),y.push(T.numLightProbes),y.push(T.shadowMapType),y.push(T.toneMapping),y.push(T.numClippingPlanes),y.push(T.numClipIntersection),y.push(T.depthPacking)}function x(y,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),T.packedNormalMap&&o.enable(22),T.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),T.numLightProbeGrids>0&&o.enable(22),T.hasPositionAttribute&&o.enable(23),y.push(o.mask)}function A(y){const T=f[y.type];let I;if(T){const D=kn[T];I=_o.clone(D.uniforms)}else I=y.uniforms;return I}function M(y,T){let I=h.get(T);return I!==void 0?++I.usedTimes:(I=new jv(s,T,y,i),c.push(I),h.set(T,I)),I}function E(y){if(--y.usedTimes===0){const T=c.indexOf(y);c[T]=c[c.length-1],c.pop(),h.delete(y.cacheKey),y.destroy()}}function b(y){a.remove(y)}function P(){a.dispose()}return{getParameters:v,getProgramCacheKey:m,getUniforms:A,acquireProgram:M,releaseProgram:E,releaseShaderCache:b,programs:c,dispose:P}}function s_(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function r_(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function Yu(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function qu(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function a(d,f,p,v,m,g){let x=s[t];return x===void 0?(x={id:d.id,object:d,geometry:f,material:p,materialVariant:o(d),groupOrder:v,renderOrder:d.renderOrder,z:m,group:g},s[t]=x):(x.id=d.id,x.object=d,x.geometry=f,x.material=p,x.materialVariant=o(d),x.groupOrder=v,x.renderOrder=d.renderOrder,x.z=m,x.group=g),t++,x}function l(d,f,p,v,m,g){const x=a(d,f,p,v,m,g);p.transmission>0?n.push(x):p.transparent===!0?i.push(x):e.push(x)}function c(d,f,p,v,m,g){const x=a(d,f,p,v,m,g);p.transmission>0?n.unshift(x):p.transparent===!0?i.unshift(x):e.unshift(x)}function h(d,f,p){e.length>1&&e.sort(d||r_),n.length>1&&n.sort(f||Yu),i.length>1&&i.sort(f||Yu),p&&(e.reverse(),n.reverse(),i.reverse())}function u(){for(let d=t,f=s.length;d<f;d++){const p=s[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:u,sort:h}}function o_(){let s=new WeakMap;function t(n,i){const r=s.get(n);let o;return r===void 0?(o=new qu,s.set(n,[o])):i>=r.length?(o=new qu,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function a_(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new Bt};break;case"SpotLight":e={position:new L,direction:new L,color:new Bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new Bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new Bt,groundColor:new Bt};break;case"RectAreaLight":e={color:new Bt,position:new L,halfWidth:new L,halfHeight:new L};break}return s[t.id]=e,e}}}function l_(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let c_=0;function h_(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function u_(s){const t=new a_,e=l_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);const i=new L,r=new se,o=new se;function a(c){let h=0,u=0,d=0;for(let T=0;T<9;T++)n.probe[T].set(0,0,0);let f=0,p=0,v=0,m=0,g=0,x=0,A=0,M=0,E=0,b=0,P=0;c.sort(h_);for(let T=0,I=c.length;T<I;T++){const D=c[T],N=D.color,H=D.intensity,Y=D.distance;let k=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Vi?k=D.shadow.map.texture:k=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)h+=N.r*H,u+=N.g*H,d+=N.b*H;else if(D.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(D.sh.coefficients[G],H);P++}else if(D.isDirectionalLight){const G=t.get(D);if(G.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const z=D.shadow,K=e.get(D);K.shadowIntensity=z.intensity,K.shadowBias=z.bias,K.shadowNormalBias=z.normalBias,K.shadowRadius=z.radius,K.shadowMapSize=z.mapSize,n.directionalShadow[f]=K,n.directionalShadowMap[f]=k,n.directionalShadowMatrix[f]=D.shadow.matrix,x++}n.directional[f]=G,f++}else if(D.isSpotLight){const G=t.get(D);G.position.setFromMatrixPosition(D.matrixWorld),G.color.copy(N).multiplyScalar(H),G.distance=Y,G.coneCos=Math.cos(D.angle),G.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),G.decay=D.decay,n.spot[v]=G;const z=D.shadow;if(D.map&&(n.spotLightMap[E]=D.map,E++,z.updateMatrices(D),D.castShadow&&b++),n.spotLightMatrix[v]=z.matrix,D.castShadow){const K=e.get(D);K.shadowIntensity=z.intensity,K.shadowBias=z.bias,K.shadowNormalBias=z.normalBias,K.shadowRadius=z.radius,K.shadowMapSize=z.mapSize,n.spotShadow[v]=K,n.spotShadowMap[v]=k,M++}v++}else if(D.isRectAreaLight){const G=t.get(D);G.color.copy(N).multiplyScalar(H),G.halfWidth.set(D.width*.5,0,0),G.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=G,m++}else if(D.isPointLight){const G=t.get(D);if(G.color.copy(D.color).multiplyScalar(D.intensity),G.distance=D.distance,G.decay=D.decay,D.castShadow){const z=D.shadow,K=e.get(D);K.shadowIntensity=z.intensity,K.shadowBias=z.bias,K.shadowNormalBias=z.normalBias,K.shadowRadius=z.radius,K.shadowMapSize=z.mapSize,K.shadowCameraNear=z.camera.near,K.shadowCameraFar=z.camera.far,n.pointShadow[p]=K,n.pointShadowMap[p]=k,n.pointShadowMatrix[p]=D.shadow.matrix,A++}n.point[p]=G,p++}else if(D.isHemisphereLight){const G=t.get(D);G.skyColor.copy(D.color).multiplyScalar(H),G.groundColor.copy(D.groundColor).multiplyScalar(H),n.hemi[g]=G,g++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=xt.LTC_FLOAT_1,n.rectAreaLTC2=xt.LTC_FLOAT_2):(n.rectAreaLTC1=xt.LTC_HALF_1,n.rectAreaLTC2=xt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const y=n.hash;(y.directionalLength!==f||y.pointLength!==p||y.spotLength!==v||y.rectAreaLength!==m||y.hemiLength!==g||y.numDirectionalShadows!==x||y.numPointShadows!==A||y.numSpotShadows!==M||y.numSpotMaps!==E||y.numLightProbes!==P)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=A,n.pointShadowMap.length=A,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=A,n.spotLightMatrix.length=M+E-b,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=P,y.directionalLength=f,y.pointLength=p,y.spotLength=v,y.rectAreaLength=m,y.hemiLength=g,y.numDirectionalShadows=x,y.numPointShadows=A,y.numSpotShadows=M,y.numSpotMaps=E,y.numLightProbes=P,n.version=c_++)}function l(c,h){let u=0,d=0,f=0,p=0,v=0;const m=h.matrixWorldInverse;for(let g=0,x=c.length;g<x;g++){const A=c[g];if(A.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(A.matrixWorld),i.setFromMatrixPosition(A.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),u++}else if(A.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(A.matrixWorld),i.setFromMatrixPosition(A.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),f++}else if(A.isRectAreaLight){const M=n.rectArea[p];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(m),o.identity(),r.copy(A.matrixWorld),r.premultiply(m),o.extractRotation(r),M.halfWidth.set(A.width*.5,0,0),M.halfHeight.set(0,A.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),p++}else if(A.isPointLight){const M=n.point[d];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(m),d++}else if(A.isHemisphereLight){const M=n.hemi[v];M.direction.setFromMatrixPosition(A.matrixWorld),M.direction.transformDirection(m),v++}}}return{setup:a,setupView:l,state:n}}function Ku(s){const t=new u_(s),e=[],n=[],i=[];function r(d){u.camera=d,e.length=0,n.length=0,i.length=0}function o(d){e.push(d)}function a(d){n.push(d)}function l(d){i.push(d)}function c(){t.setup(e)}function h(d){t.setupView(e,d)}const u={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function d_(s){let t=new WeakMap;function e(i,r=0){const o=t.get(i);let a;return o===void 0?(a=new Ku(s),t.set(i,[a])):r>=o.length?(a=new Ku(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const f_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,p_=`uniform sampler2D shadow_pass;
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
}`,m_=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],g_=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],Zu=new se,gr=new L,ec=new L;function x_(s,t,e){let n=new fo;const i=new dt,r=new dt,o=new ve,a=new t0,l=new e0,c={},h=e.maxTextureSize,u={[pi]:Ke,[Ke]:pi,[Xn]:Xn},d=new Le({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new dt},radius:{value:4}},vertexShader:f_,fragmentShader:p_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new He;p.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Yt(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ir;let g=this.type;this.render=function(b,P,y){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;this.type===fp&&(Ut("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Ir);const T=s.getRenderTarget(),I=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),N=s.state;N.setBlending(Pn),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const H=g!==this.type;H&&P.traverse(function(Y){Y.material&&(Array.isArray(Y.material)?Y.material.forEach(k=>k.needsUpdate=!0):Y.material.needsUpdate=!0)});for(let Y=0,k=b.length;Y<k;Y++){const G=b[Y],z=G.shadow;if(z===void 0){Ut("WebGLShadowMap:",G,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;i.copy(z.mapSize);const K=z.getFrameExtents();i.multiply(K),r.copy(z.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/K.x),i.x=r.x*K.x,z.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/K.y),i.y=r.y*K.y,z.mapSize.y=r.y));const tt=s.state.buffers.depth.getReversed();if(z.camera._reversedDepth=tt,z.map===null||H===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===Js){if(G.isPointLight){Ut("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new je(i.x,i.y,{format:Vi,type:on,minFilter:ze,magFilter:ze,generateMipmaps:!1}),z.map.texture.name=G.name+".shadowMap",z.map.depthTexture=new Us(i.x,i.y,yn),z.map.depthTexture.name=G.name+".shadowMapDepth",z.map.depthTexture.format=qn,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Be,z.map.depthTexture.magFilter=Be}else G.isPointLight?(z.map=new Ru(i.x),z.map.depthTexture=new Um(i.x,Dn)):(z.map=new je(i.x,i.y),z.map.depthTexture=new Us(i.x,i.y,Dn)),z.map.depthTexture.name=G.name+".shadowMap",z.map.depthTexture.format=qn,this.type===Ir?(z.map.depthTexture.compareFunction=tt?cl:ll,z.map.depthTexture.minFilter=ze,z.map.depthTexture.magFilter=ze):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Be,z.map.depthTexture.magFilter=Be);z.camera.updateProjectionMatrix()}const ot=z.map.isWebGLCubeRenderTarget?6:1;for(let at=0;at<ot;at++){if(z.map.isWebGLCubeRenderTarget)s.setRenderTarget(z.map,at),s.clear();else{at===0&&(s.setRenderTarget(z.map),s.clear());const pt=z.getViewport(at);o.set(r.x*pt.x,r.y*pt.y,r.x*pt.z,r.y*pt.w),N.viewport(o)}if(G.isPointLight){const pt=z.camera,zt=z.matrix,xe=G.distance||pt.far;xe!==pt.far&&(pt.far=xe,pt.updateProjectionMatrix()),gr.setFromMatrixPosition(G.matrixWorld),pt.position.copy(gr),ec.copy(pt.position),ec.add(m_[at]),pt.up.copy(g_[at]),pt.lookAt(ec),pt.updateMatrixWorld(),zt.makeTranslation(-gr.x,-gr.y,-gr.z),Zu.multiplyMatrices(pt.projectionMatrix,pt.matrixWorldInverse),z._frustum.setFromProjectionMatrix(Zu,pt.coordinateSystem,pt.reversedDepth)}else z.updateMatrices(G);n=z.getFrustum(),M(P,y,z.camera,G,this.type)}z.isPointLightShadow!==!0&&this.type===Js&&x(z,y),z.needsUpdate=!1}g=this.type,m.needsUpdate=!1,s.setRenderTarget(T,I,D)};function x(b,P){const y=t.update(v);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new je(i.x,i.y,{format:Vi,type:on})),d.uniforms.shadow_pass.value=b.map.depthTexture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,s.setRenderTarget(b.mapPass),s.clear(),s.renderBufferDirect(P,null,y,d,v,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,s.setRenderTarget(b.map),s.clear(),s.renderBufferDirect(P,null,y,f,v,null)}function A(b,P,y,T){let I=null;const D=y.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(D!==void 0)I=D;else if(I=y.isPointLight===!0?l:a,s.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const N=I.uuid,H=P.uuid;let Y=c[N];Y===void 0&&(Y={},c[N]=Y);let k=Y[H];k===void 0&&(k=I.clone(),Y[H]=k,P.addEventListener("dispose",E)),I=k}if(I.visible=P.visible,I.wireframe=P.wireframe,T===Js?I.side=P.shadowSide!==null?P.shadowSide:P.side:I.side=P.shadowSide!==null?P.shadowSide:u[P.side],I.alphaMap=P.alphaMap,I.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,I.map=P.map,I.clipShadows=P.clipShadows,I.clippingPlanes=P.clippingPlanes,I.clipIntersection=P.clipIntersection,I.displacementMap=P.displacementMap,I.displacementScale=P.displacementScale,I.displacementBias=P.displacementBias,I.wireframeLinewidth=P.wireframeLinewidth,I.linewidth=P.linewidth,y.isPointLight===!0&&I.isMeshDistanceMaterial===!0){const N=s.properties.get(I);N.light=y}return I}function M(b,P,y,T,I){if(b.visible===!1)return;if(b.layers.test(P.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&I===Js)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,b.matrixWorld);const H=t.update(b),Y=b.material;if(Array.isArray(Y)){const k=H.groups;for(let G=0,z=k.length;G<z;G++){const K=k[G],tt=Y[K.materialIndex];if(tt&&tt.visible){const ot=A(b,tt,T,I);b.onBeforeShadow(s,b,P,y,H,ot,K),s.renderBufferDirect(y,null,H,ot,b,K),b.onAfterShadow(s,b,P,y,H,ot,K)}}}else if(Y.visible){const k=A(b,Y,T,I);b.onBeforeShadow(s,b,P,y,H,k,null),s.renderBufferDirect(y,null,H,k,b,null),b.onAfterShadow(s,b,P,y,H,k,null)}}const N=b.children;for(let H=0,Y=N.length;H<Y;H++)M(N[H],P,y,T,I)}function E(b){b.target.removeEventListener("dispose",E);for(const y in c){const T=c[y],I=b.target.uuid;I in T&&(T[I].dispose(),delete T[I])}}}function v_(s,t){function e(){let F=!1;const ut=new ve;let Q=null;const gt=new ve(0,0,0,0);return{setMask:function(Mt){Q!==Mt&&!F&&(s.colorMask(Mt,Mt,Mt,Mt),Q=Mt)},setLocked:function(Mt){F=Mt},setClear:function(Mt,et,Ct,Tt,Se){Se===!0&&(Mt*=Tt,et*=Tt,Ct*=Tt),ut.set(Mt,et,Ct,Tt),gt.equals(ut)===!1&&(s.clearColor(Mt,et,Ct,Tt),gt.copy(ut))},reset:function(){F=!1,Q=null,gt.set(-1,0,0,0)}}}function n(){let F=!1,ut=!1,Q=null,gt=null,Mt=null;return{setReversed:function(et){if(ut!==et){const Ct=t.get("EXT_clip_control");et?Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.ZERO_TO_ONE_EXT):Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.NEGATIVE_ONE_TO_ONE_EXT),ut=et;const Tt=Mt;Mt=null,this.setClear(Tt)}},getReversed:function(){return ut},setTest:function(et){et?st(s.DEPTH_TEST):Et(s.DEPTH_TEST)},setMask:function(et){Q!==et&&!F&&(s.depthMask(et),Q=et)},setFunc:function(et){if(ut&&(et=Xp[et]),gt!==et){switch(et){case da:s.depthFunc(s.NEVER);break;case fa:s.depthFunc(s.ALWAYS);break;case pa:s.depthFunc(s.LESS);break;case ds:s.depthFunc(s.LEQUAL);break;case ma:s.depthFunc(s.EQUAL);break;case ga:s.depthFunc(s.GEQUAL);break;case xa:s.depthFunc(s.GREATER);break;case va:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}gt=et}},setLocked:function(et){F=et},setClear:function(et){Mt!==et&&(Mt=et,ut&&(et=1-et),s.clearDepth(et))},reset:function(){F=!1,Q=null,gt=null,Mt=null,ut=!1}}}function i(){let F=!1,ut=null,Q=null,gt=null,Mt=null,et=null,Ct=null,Tt=null,Se=null;return{setTest:function(de){F||(de?st(s.STENCIL_TEST):Et(s.STENCIL_TEST))},setMask:function(de){ut!==de&&!F&&(s.stencilMask(de),ut=de)},setFunc:function(de,Hn,Gn){(Q!==de||gt!==Hn||Mt!==Gn)&&(s.stencilFunc(de,Hn,Gn),Q=de,gt=Hn,Mt=Gn)},setOp:function(de,Hn,Gn){(et!==de||Ct!==Hn||Tt!==Gn)&&(s.stencilOp(de,Hn,Gn),et=de,Ct=Hn,Tt=Gn)},setLocked:function(de){F=de},setClear:function(de){Se!==de&&(s.clearStencil(de),Se=de)},reset:function(){F=!1,ut=null,Q=null,gt=null,Mt=null,et=null,Ct=null,Tt=null,Se=null}}}const r=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap;let h={},u={},d={},f=new WeakMap,p=[],v=null,m=!1,g=null,x=null,A=null,M=null,E=null,b=null,P=null,y=new Bt(0,0,0),T=0,I=!1,D=null,N=null,H=null,Y=null,k=null;const G=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,K=0;const tt=s.getParameter(s.VERSION);tt.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(tt)[1]),z=K>=1):tt.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(tt)[1]),z=K>=2);let ot=null,at={};const pt=s.getParameter(s.SCISSOR_BOX),zt=s.getParameter(s.VIEWPORT),xe=new ve().fromArray(pt),jt=new ve().fromArray(zt);function j(F,ut,Q,gt){const Mt=new Uint8Array(4),et=s.createTexture();s.bindTexture(F,et),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ct=0;Ct<Q;Ct++)F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY?s.texImage3D(ut,0,s.RGBA,1,1,gt,0,s.RGBA,s.UNSIGNED_BYTE,Mt):s.texImage2D(ut+Ct,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Mt);return et}const ht={};ht[s.TEXTURE_2D]=j(s.TEXTURE_2D,s.TEXTURE_2D,1),ht[s.TEXTURE_CUBE_MAP]=j(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ht[s.TEXTURE_2D_ARRAY]=j(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ht[s.TEXTURE_3D]=j(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),st(s.DEPTH_TEST),o.setFunc(ds),ye(!1),Ee(rh),st(s.CULL_FACE),te(Pn);function st(F){h[F]!==!0&&(s.enable(F),h[F]=!0)}function Et(F){h[F]!==!1&&(s.disable(F),h[F]=!1)}function Ot(F,ut){return d[F]!==ut?(s.bindFramebuffer(F,ut),d[F]=ut,F===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=ut),F===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=ut),!0):!1}function Nt(F,ut){let Q=p,gt=!1;if(F){Q=f.get(ut),Q===void 0&&(Q=[],f.set(ut,Q));const Mt=F.textures;if(Q.length!==Mt.length||Q[0]!==s.COLOR_ATTACHMENT0){for(let et=0,Ct=Mt.length;et<Ct;et++)Q[et]=s.COLOR_ATTACHMENT0+et;Q.length=Mt.length,gt=!0}}else Q[0]!==s.BACK&&(Q[0]=s.BACK,gt=!0);gt&&s.drawBuffers(Q)}function pe(F){return v!==F?(s.useProgram(F),v=F,!0):!1}const qt={[Bi]:s.FUNC_ADD,[mp]:s.FUNC_SUBTRACT,[gp]:s.FUNC_REVERSE_SUBTRACT};qt[xp]=s.MIN,qt[vp]=s.MAX;const ie={[_p]:s.ZERO,[yp]:s.ONE,[Mp]:s.SRC_COLOR,[ha]:s.SRC_ALPHA,[Ap]:s.SRC_ALPHA_SATURATE,[Ep]:s.DST_COLOR,[Sp]:s.DST_ALPHA,[bp]:s.ONE_MINUS_SRC_COLOR,[ua]:s.ONE_MINUS_SRC_ALPHA,[Tp]:s.ONE_MINUS_DST_COLOR,[wp]:s.ONE_MINUS_DST_ALPHA,[Cp]:s.CONSTANT_COLOR,[Rp]:s.ONE_MINUS_CONSTANT_COLOR,[Pp]:s.CONSTANT_ALPHA,[Lp]:s.ONE_MINUS_CONSTANT_ALPHA};function te(F,ut,Q,gt,Mt,et,Ct,Tt,Se,de){if(F===Pn){m===!0&&(Et(s.BLEND),m=!1);return}if(m===!1&&(st(s.BLEND),m=!0),F!==pp){if(F!==g||de!==I){if((x!==Bi||E!==Bi)&&(s.blendEquation(s.FUNC_ADD),x=Bi,E=Bi),de)switch(F){case us:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ur:s.blendFunc(s.ONE,s.ONE);break;case oh:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ah:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:ee("WebGLState: Invalid blending: ",F);break}else switch(F){case us:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ur:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case oh:ee("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ah:ee("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ee("WebGLState: Invalid blending: ",F);break}A=null,M=null,b=null,P=null,y.set(0,0,0),T=0,g=F,I=de}return}Mt=Mt||ut,et=et||Q,Ct=Ct||gt,(ut!==x||Mt!==E)&&(s.blendEquationSeparate(qt[ut],qt[Mt]),x=ut,E=Mt),(Q!==A||gt!==M||et!==b||Ct!==P)&&(s.blendFuncSeparate(ie[Q],ie[gt],ie[et],ie[Ct]),A=Q,M=gt,b=et,P=Ct),(Tt.equals(y)===!1||Se!==T)&&(s.blendColor(Tt.r,Tt.g,Tt.b,Se),y.copy(Tt),T=Se),g=F,I=!1}function Jt(F,ut){F.side===Xn?Et(s.CULL_FACE):st(s.CULL_FACE);let Q=F.side===Ke;ut&&(Q=!Q),ye(Q),F.blending===us&&F.transparent===!1?te(Pn):te(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),r.setMask(F.colorWrite);const gt=F.stencilWrite;a.setTest(gt),gt&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Ne(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?st(s.SAMPLE_ALPHA_TO_COVERAGE):Et(s.SAMPLE_ALPHA_TO_COVERAGE)}function ye(F){D!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),D=F)}function Ee(F){F!==up?(st(s.CULL_FACE),F!==N&&(F===rh?s.cullFace(s.BACK):F===dp?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Et(s.CULL_FACE),N=F}function Te(F){F!==H&&(z&&s.lineWidth(F),H=F)}function Ne(F,ut,Q){F?(st(s.POLYGON_OFFSET_FILL),(Y!==ut||k!==Q)&&(Y=ut,k=Q,o.getReversed()&&(ut=-ut),s.polygonOffset(ut,Q))):Et(s.POLYGON_OFFSET_FILL)}function me(F){F?st(s.SCISSOR_TEST):Et(s.SCISSOR_TEST)}function Me(F){F===void 0&&(F=s.TEXTURE0+G-1),ot!==F&&(s.activeTexture(F),ot=F)}function S(F,ut,Q){Q===void 0&&(ot===null?Q=s.TEXTURE0+G-1:Q=ot);let gt=at[Q];gt===void 0&&(gt={type:void 0,texture:void 0},at[Q]=gt),(gt.type!==F||gt.texture!==ut)&&(ot!==Q&&(s.activeTexture(Q),ot=Q),s.bindTexture(F,ut||ht[F]),gt.type=F,gt.texture=ut)}function nt(){const F=at[ot];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function _t(){try{s.compressedTexImage2D(...arguments)}catch(F){ee("WebGLState:",F)}}function C(){try{s.compressedTexImage3D(...arguments)}catch(F){ee("WebGLState:",F)}}function _(){try{s.texSubImage2D(...arguments)}catch(F){ee("WebGLState:",F)}}function U(){try{s.texSubImage3D(...arguments)}catch(F){ee("WebGLState:",F)}}function O(){try{s.compressedTexSubImage2D(...arguments)}catch(F){ee("WebGLState:",F)}}function X(){try{s.compressedTexSubImage3D(...arguments)}catch(F){ee("WebGLState:",F)}}function it(){try{s.texStorage2D(...arguments)}catch(F){ee("WebGLState:",F)}}function ct(){try{s.texStorage3D(...arguments)}catch(F){ee("WebGLState:",F)}}function J(){try{s.texImage2D(...arguments)}catch(F){ee("WebGLState:",F)}}function Z(){try{s.texImage3D(...arguments)}catch(F){ee("WebGLState:",F)}}function lt(F){return u[F]!==void 0?u[F]:s.getParameter(F)}function St(F,ut){u[F]!==ut&&(s.pixelStorei(F,ut),u[F]=ut)}function ft(F){xe.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),xe.copy(F))}function mt(F){jt.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),jt.copy(F))}function Dt(F,ut){let Q=c.get(ut);Q===void 0&&(Q=new WeakMap,c.set(ut,Q));let gt=Q.get(F);gt===void 0&&(gt=s.getUniformBlockIndex(ut,F.name),Q.set(F,gt))}function kt(F,ut){const gt=c.get(ut).get(F);l.get(ut)!==gt&&(s.uniformBlockBinding(ut,gt,F.__bindingPointIndex),l.set(ut,gt))}function Gt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},u={},ot=null,at={},d={},f=new WeakMap,p=[],v=null,m=!1,g=null,x=null,A=null,M=null,E=null,b=null,P=null,y=new Bt(0,0,0),T=0,I=!1,D=null,N=null,H=null,Y=null,k=null,xe.set(0,0,s.canvas.width,s.canvas.height),jt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:st,disable:Et,bindFramebuffer:Ot,drawBuffers:Nt,useProgram:pe,setBlending:te,setMaterial:Jt,setFlipSided:ye,setCullFace:Ee,setLineWidth:Te,setPolygonOffset:Ne,setScissorTest:me,activeTexture:Me,bindTexture:S,unbindTexture:nt,compressedTexImage2D:_t,compressedTexImage3D:C,texImage2D:J,texImage3D:Z,pixelStorei:St,getParameter:lt,updateUBOMapping:Dt,uniformBlockBinding:kt,texStorage2D:it,texStorage3D:ct,texSubImage2D:_,texSubImage3D:U,compressedTexSubImage2D:O,compressedTexSubImage3D:X,scissor:ft,viewport:mt,reset:Gt}}function __(s,t,e,n,i,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new dt,h=new WeakMap,u=new Set;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(C,_){return p?new OffscreenCanvas(C,_):$r("canvas")}function m(C,_,U){let O=1;const X=_t(C);if((X.width>U||X.height>U)&&(O=U/Math.max(X.width,X.height)),O<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const it=Math.floor(O*X.width),ct=Math.floor(O*X.height);d===void 0&&(d=v(it,ct));const J=_?v(it,ct):d;return J.width=it,J.height=ct,J.getContext("2d").drawImage(C,0,0,it,ct),Ut("WebGLRenderer: Texture has been resized from ("+X.width+"x"+X.height+") to ("+it+"x"+ct+")."),J}else return"data"in C&&Ut("WebGLRenderer: Image in DataTexture is too big ("+X.width+"x"+X.height+")."),C;return C}function g(C){return C.generateMipmaps}function x(C){s.generateMipmap(C)}function A(C){return C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?s.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function M(C,_,U,O,X,it=!1){if(C!==null){if(s[C]!==void 0)return s[C];Ut("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ct;O&&(ct=t.get("EXT_texture_norm16"),ct||Ut("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=_;if(_===s.RED&&(U===s.FLOAT&&(J=s.R32F),U===s.HALF_FLOAT&&(J=s.R16F),U===s.UNSIGNED_BYTE&&(J=s.R8),U===s.UNSIGNED_SHORT&&ct&&(J=ct.R16_EXT),U===s.SHORT&&ct&&(J=ct.R16_SNORM_EXT)),_===s.RED_INTEGER&&(U===s.UNSIGNED_BYTE&&(J=s.R8UI),U===s.UNSIGNED_SHORT&&(J=s.R16UI),U===s.UNSIGNED_INT&&(J=s.R32UI),U===s.BYTE&&(J=s.R8I),U===s.SHORT&&(J=s.R16I),U===s.INT&&(J=s.R32I)),_===s.RG&&(U===s.FLOAT&&(J=s.RG32F),U===s.HALF_FLOAT&&(J=s.RG16F),U===s.UNSIGNED_BYTE&&(J=s.RG8),U===s.UNSIGNED_SHORT&&ct&&(J=ct.RG16_EXT),U===s.SHORT&&ct&&(J=ct.RG16_SNORM_EXT)),_===s.RG_INTEGER&&(U===s.UNSIGNED_BYTE&&(J=s.RG8UI),U===s.UNSIGNED_SHORT&&(J=s.RG16UI),U===s.UNSIGNED_INT&&(J=s.RG32UI),U===s.BYTE&&(J=s.RG8I),U===s.SHORT&&(J=s.RG16I),U===s.INT&&(J=s.RG32I)),_===s.RGB_INTEGER&&(U===s.UNSIGNED_BYTE&&(J=s.RGB8UI),U===s.UNSIGNED_SHORT&&(J=s.RGB16UI),U===s.UNSIGNED_INT&&(J=s.RGB32UI),U===s.BYTE&&(J=s.RGB8I),U===s.SHORT&&(J=s.RGB16I),U===s.INT&&(J=s.RGB32I)),_===s.RGBA_INTEGER&&(U===s.UNSIGNED_BYTE&&(J=s.RGBA8UI),U===s.UNSIGNED_SHORT&&(J=s.RGBA16UI),U===s.UNSIGNED_INT&&(J=s.RGBA32UI),U===s.BYTE&&(J=s.RGBA8I),U===s.SHORT&&(J=s.RGBA16I),U===s.INT&&(J=s.RGBA32I)),_===s.RGB&&(U===s.UNSIGNED_SHORT&&ct&&(J=ct.RGB16_EXT),U===s.SHORT&&ct&&(J=ct.RGB16_SNORM_EXT),U===s.UNSIGNED_INT_5_9_9_9_REV&&(J=s.RGB9_E5),U===s.UNSIGNED_INT_10F_11F_11F_REV&&(J=s.R11F_G11F_B10F)),_===s.RGBA){const Z=it?Wr:Qt.getTransfer(X);U===s.FLOAT&&(J=s.RGBA32F),U===s.HALF_FLOAT&&(J=s.RGBA16F),U===s.UNSIGNED_BYTE&&(J=Z===re?s.SRGB8_ALPHA8:s.RGBA8),U===s.UNSIGNED_SHORT&&ct&&(J=ct.RGBA16_EXT),U===s.SHORT&&ct&&(J=ct.RGBA16_SNORM_EXT),U===s.UNSIGNED_SHORT_4_4_4_4&&(J=s.RGBA4),U===s.UNSIGNED_SHORT_5_5_5_1&&(J=s.RGB5_A1)}return(J===s.R16F||J===s.R32F||J===s.RG16F||J===s.RG32F||J===s.RGBA16F||J===s.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function E(C,_){let U;return C?_===null||_===Dn||_===Qs?U=s.DEPTH24_STENCIL8:_===yn?U=s.DEPTH32F_STENCIL8:_===js&&(U=s.DEPTH24_STENCIL8,Ut("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Dn||_===Qs?U=s.DEPTH_COMPONENT24:_===yn?U=s.DEPTH_COMPONENT32F:_===js&&(U=s.DEPTH_COMPONENT16),U}function b(C,_){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==Be&&C.minFilter!==ze?Math.log2(Math.max(_.width,_.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?_.mipmaps.length:1}function P(C){const _=C.target;_.removeEventListener("dispose",P),T(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&u.delete(_)}function y(C){const _=C.target;_.removeEventListener("dispose",y),D(_)}function T(C){const _=n.get(C);if(_.__webglInit===void 0)return;const U=C.source,O=f.get(U);if(O){const X=O[_.__cacheKey];X.usedTimes--,X.usedTimes===0&&I(C),Object.keys(O).length===0&&f.delete(U)}n.remove(C)}function I(C){const _=n.get(C);s.deleteTexture(_.__webglTexture);const U=C.source,O=f.get(U);delete O[_.__cacheKey],o.memory.textures--}function D(C){const _=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let O=0;O<6;O++){if(Array.isArray(_.__webglFramebuffer[O]))for(let X=0;X<_.__webglFramebuffer[O].length;X++)s.deleteFramebuffer(_.__webglFramebuffer[O][X]);else s.deleteFramebuffer(_.__webglFramebuffer[O]);_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer[O])}else{if(Array.isArray(_.__webglFramebuffer))for(let O=0;O<_.__webglFramebuffer.length;O++)s.deleteFramebuffer(_.__webglFramebuffer[O]);else s.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&s.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let O=0;O<_.__webglColorRenderbuffer.length;O++)_.__webglColorRenderbuffer[O]&&s.deleteRenderbuffer(_.__webglColorRenderbuffer[O]);_.__webglDepthRenderbuffer&&s.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const U=C.textures;for(let O=0,X=U.length;O<X;O++){const it=n.get(U[O]);it.__webglTexture&&(s.deleteTexture(it.__webglTexture),o.memory.textures--),n.remove(U[O])}n.remove(C)}let N=0;function H(){N=0}function Y(){return N}function k(C){N=C}function G(){const C=N;return C>=i.maxTextures&&Ut("WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),N+=1,C}function z(C){const _=[];return _.push(C.wrapS),_.push(C.wrapT),_.push(C.wrapR||0),_.push(C.magFilter),_.push(C.minFilter),_.push(C.anisotropy),_.push(C.internalFormat),_.push(C.format),_.push(C.type),_.push(C.generateMipmaps),_.push(C.premultiplyAlpha),_.push(C.flipY),_.push(C.unpackAlignment),_.push(C.colorSpace),_.join()}function K(C,_){const U=n.get(C);if(C.isVideoTexture&&S(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&U.__version!==C.version){const O=C.image;if(O===null)Ut("WebGLRenderer: Texture marked for update but no image data found.");else if(O.complete===!1)Ut("WebGLRenderer: Texture marked for update but image is incomplete");else{Et(U,C,_);return}}else C.isExternalTexture&&(U.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,U.__webglTexture,s.TEXTURE0+_)}function tt(C,_){const U=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&U.__version!==C.version){Et(U,C,_);return}else C.isExternalTexture&&(U.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,U.__webglTexture,s.TEXTURE0+_)}function ot(C,_){const U=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&U.__version!==C.version){Et(U,C,_);return}e.bindTexture(s.TEXTURE_3D,U.__webglTexture,s.TEXTURE0+_)}function at(C,_){const U=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&U.__version!==C.version){Ot(U,C,_);return}e.bindTexture(s.TEXTURE_CUBE_MAP,U.__webglTexture,s.TEXTURE0+_)}const pt={[kr]:s.REPEAT,[Yn]:s.CLAMP_TO_EDGE,[ba]:s.MIRRORED_REPEAT},zt={[Be]:s.NEAREST,[Up]:s.NEAREST_MIPMAP_NEAREST,[Fr]:s.NEAREST_MIPMAP_LINEAR,[ze]:s.LINEAR,[Sa]:s.LINEAR_MIPMAP_NEAREST,[Hi]:s.LINEAR_MIPMAP_LINEAR},xe={[Fp]:s.NEVER,[Gp]:s.ALWAYS,[Op]:s.LESS,[ll]:s.LEQUAL,[Bp]:s.EQUAL,[cl]:s.GEQUAL,[zp]:s.GREATER,[Hp]:s.NOTEQUAL};function jt(C,_){if(_.type===yn&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===ze||_.magFilter===Sa||_.magFilter===Fr||_.magFilter===Hi||_.minFilter===ze||_.minFilter===Sa||_.minFilter===Fr||_.minFilter===Hi)&&Ut("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,pt[_.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,pt[_.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,pt[_.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,zt[_.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,zt[_.minFilter]),_.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,xe[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Be||_.minFilter!==Fr&&_.minFilter!==Hi||_.type===yn&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const U=t.get("EXT_texture_filter_anisotropic");s.texParameterf(C,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,i.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function j(C,_){let U=!1;C.__webglInit===void 0&&(C.__webglInit=!0,_.addEventListener("dispose",P));const O=_.source;let X=f.get(O);X===void 0&&(X={},f.set(O,X));const it=z(_);if(it!==C.__cacheKey){X[it]===void 0&&(X[it]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,U=!0),X[it].usedTimes++;const ct=X[C.__cacheKey];ct!==void 0&&(X[C.__cacheKey].usedTimes--,ct.usedTimes===0&&I(_)),C.__cacheKey=it,C.__webglTexture=X[it].texture}return U}function ht(C,_,U){return Math.floor(Math.floor(C/U)/_)}function st(C,_,U,O){const it=C.updateRanges;if(it.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,_.width,_.height,U,O,_.data);else{it.sort((St,ft)=>St.start-ft.start);let ct=0;for(let St=1;St<it.length;St++){const ft=it[ct],mt=it[St],Dt=ft.start+ft.count,kt=ht(mt.start,_.width,4),Gt=ht(ft.start,_.width,4);mt.start<=Dt+1&&kt===Gt&&ht(mt.start+mt.count-1,_.width,4)===kt?ft.count=Math.max(ft.count,mt.start+mt.count-ft.start):(++ct,it[ct]=mt)}it.length=ct+1;const J=e.getParameter(s.UNPACK_ROW_LENGTH),Z=e.getParameter(s.UNPACK_SKIP_PIXELS),lt=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,_.width);for(let St=0,ft=it.length;St<ft;St++){const mt=it[St],Dt=Math.floor(mt.start/4),kt=Math.ceil(mt.count/4),Gt=Dt%_.width,F=Math.floor(Dt/_.width),ut=kt,Q=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,Gt),e.pixelStorei(s.UNPACK_SKIP_ROWS,F),e.texSubImage2D(s.TEXTURE_2D,0,Gt,F,ut,Q,U,O,_.data)}C.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,J),e.pixelStorei(s.UNPACK_SKIP_PIXELS,Z),e.pixelStorei(s.UNPACK_SKIP_ROWS,lt)}}function Et(C,_,U){let O=s.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(O=s.TEXTURE_2D_ARRAY),_.isData3DTexture&&(O=s.TEXTURE_3D);const X=j(C,_),it=_.source;e.bindTexture(O,C.__webglTexture,s.TEXTURE0+U);const ct=n.get(it);if(it.version!==ct.__version||X===!0){if(e.activeTexture(s.TEXTURE0+U),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const Q=Qt.getPrimaries(Qt.workingColorSpace),gt=_.colorSpace===mi?null:Qt.getPrimaries(_.colorSpace),Mt=_.colorSpace===mi||Q===gt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt)}e.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment);let Z=m(_.image,!1,i.maxTextureSize);Z=nt(_,Z);const lt=r.convert(_.format,_.colorSpace),St=r.convert(_.type);let ft=M(_.internalFormat,lt,St,_.normalized,_.colorSpace,_.isVideoTexture);jt(O,_);let mt;const Dt=_.mipmaps,kt=_.isVideoTexture!==!0,Gt=ct.__version===void 0||X===!0,F=it.dataReady,ut=b(_,Z);if(_.isDepthTexture)ft=E(_.format===Gi,_.type),Gt&&(kt?e.texStorage2D(s.TEXTURE_2D,1,ft,Z.width,Z.height):e.texImage2D(s.TEXTURE_2D,0,ft,Z.width,Z.height,0,lt,St,null));else if(_.isDataTexture)if(Dt.length>0){kt&&Gt&&e.texStorage2D(s.TEXTURE_2D,ut,ft,Dt[0].width,Dt[0].height);for(let Q=0,gt=Dt.length;Q<gt;Q++)mt=Dt[Q],kt?F&&e.texSubImage2D(s.TEXTURE_2D,Q,0,0,mt.width,mt.height,lt,St,mt.data):e.texImage2D(s.TEXTURE_2D,Q,ft,mt.width,mt.height,0,lt,St,mt.data);_.generateMipmaps=!1}else kt?(Gt&&e.texStorage2D(s.TEXTURE_2D,ut,ft,Z.width,Z.height),F&&st(_,Z,lt,St)):e.texImage2D(s.TEXTURE_2D,0,ft,Z.width,Z.height,0,lt,St,Z.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){kt&&Gt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,ut,ft,Dt[0].width,Dt[0].height,Z.depth);for(let Q=0,gt=Dt.length;Q<gt;Q++)if(mt=Dt[Q],_.format!==Mn)if(lt!==null)if(kt){if(F)if(_.layerUpdates.size>0){const Mt=yu(mt.width,mt.height,_.format,_.type);for(const et of _.layerUpdates){const Ct=mt.data.subarray(et*Mt/mt.data.BYTES_PER_ELEMENT,(et+1)*Mt/mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,et,mt.width,mt.height,1,lt,Ct)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,0,mt.width,mt.height,Z.depth,lt,mt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,Q,ft,mt.width,mt.height,Z.depth,0,mt.data,0,0);else Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else kt?F&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,0,mt.width,mt.height,Z.depth,lt,St,mt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,Q,ft,mt.width,mt.height,Z.depth,0,lt,St,mt.data)}else{kt&&Gt&&e.texStorage2D(s.TEXTURE_2D,ut,ft,Dt[0].width,Dt[0].height);for(let Q=0,gt=Dt.length;Q<gt;Q++)mt=Dt[Q],_.format!==Mn?lt!==null?kt?F&&e.compressedTexSubImage2D(s.TEXTURE_2D,Q,0,0,mt.width,mt.height,lt,mt.data):e.compressedTexImage2D(s.TEXTURE_2D,Q,ft,mt.width,mt.height,0,mt.data):Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):kt?F&&e.texSubImage2D(s.TEXTURE_2D,Q,0,0,mt.width,mt.height,lt,St,mt.data):e.texImage2D(s.TEXTURE_2D,Q,ft,mt.width,mt.height,0,lt,St,mt.data)}else if(_.isDataArrayTexture)if(kt){if(Gt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,ut,ft,Z.width,Z.height,Z.depth),F)if(_.layerUpdates.size>0){const Q=yu(Z.width,Z.height,_.format,_.type);for(const gt of _.layerUpdates){const Mt=Z.data.subarray(gt*Q/Z.data.BYTES_PER_ELEMENT,(gt+1)*Q/Z.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,gt,Z.width,Z.height,1,lt,St,Mt)}_.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,lt,St,Z.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,ft,Z.width,Z.height,Z.depth,0,lt,St,Z.data);else if(_.isData3DTexture)kt?(Gt&&e.texStorage3D(s.TEXTURE_3D,ut,ft,Z.width,Z.height,Z.depth),F&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,lt,St,Z.data)):e.texImage3D(s.TEXTURE_3D,0,ft,Z.width,Z.height,Z.depth,0,lt,St,Z.data);else if(_.isFramebufferTexture){if(Gt)if(kt)e.texStorage2D(s.TEXTURE_2D,ut,ft,Z.width,Z.height);else{let Q=Z.width,gt=Z.height;for(let Mt=0;Mt<ut;Mt++)e.texImage2D(s.TEXTURE_2D,Mt,ft,Q,gt,0,lt,St,null),Q>>=1,gt>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in s){const Q=s.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),Z.parentNode!==Q){Q.appendChild(Z),u.add(_),Q.onpaint=gt=>{const Mt=gt.changedElements;for(const et of u)Mt.includes(et.image)&&(et.needsUpdate=!0)},Q.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,Z);else{const Mt=s.RGBA,et=s.RGBA,Ct=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Mt,et,Ct,Z)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Dt.length>0){if(kt&&Gt){const Q=_t(Dt[0]);e.texStorage2D(s.TEXTURE_2D,ut,ft,Q.width,Q.height)}for(let Q=0,gt=Dt.length;Q<gt;Q++)mt=Dt[Q],kt?F&&e.texSubImage2D(s.TEXTURE_2D,Q,0,0,lt,St,mt):e.texImage2D(s.TEXTURE_2D,Q,ft,lt,St,mt);_.generateMipmaps=!1}else if(kt){if(Gt){const Q=_t(Z);e.texStorage2D(s.TEXTURE_2D,ut,ft,Q.width,Q.height)}F&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,lt,St,Z)}else e.texImage2D(s.TEXTURE_2D,0,ft,lt,St,Z);g(_)&&x(O),ct.__version=it.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function Ot(C,_,U){if(_.image.length!==6)return;const O=j(C,_),X=_.source;e.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+U);const it=n.get(X);if(X.version!==it.__version||O===!0){e.activeTexture(s.TEXTURE0+U);const ct=Qt.getPrimaries(Qt.workingColorSpace),J=_.colorSpace===mi?null:Qt.getPrimaries(_.colorSpace),Z=_.colorSpace===mi||ct===J?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Z);const lt=_.isCompressedTexture||_.image[0].isCompressedTexture,St=_.image[0]&&_.image[0].isDataTexture,ft=[];for(let et=0;et<6;et++)!lt&&!St?ft[et]=m(_.image[et],!0,i.maxCubemapSize):ft[et]=St?_.image[et].image:_.image[et],ft[et]=nt(_,ft[et]);const mt=ft[0],Dt=r.convert(_.format,_.colorSpace),kt=r.convert(_.type),Gt=M(_.internalFormat,Dt,kt,_.normalized,_.colorSpace),F=_.isVideoTexture!==!0,ut=it.__version===void 0||O===!0,Q=X.dataReady;let gt=b(_,mt);jt(s.TEXTURE_CUBE_MAP,_);let Mt;if(lt){F&&ut&&e.texStorage2D(s.TEXTURE_CUBE_MAP,gt,Gt,mt.width,mt.height);for(let et=0;et<6;et++){Mt=ft[et].mipmaps;for(let Ct=0;Ct<Mt.length;Ct++){const Tt=Mt[Ct];_.format!==Mn?Dt!==null?F?Q&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct,0,0,Tt.width,Tt.height,Dt,Tt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct,Gt,Tt.width,Tt.height,0,Tt.data):Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct,0,0,Tt.width,Tt.height,Dt,kt,Tt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct,Gt,Tt.width,Tt.height,0,Dt,kt,Tt.data)}}}else{if(Mt=_.mipmaps,F&&ut){Mt.length>0&&gt++;const et=_t(ft[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,gt,Gt,et.width,et.height)}for(let et=0;et<6;et++)if(St){F?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,ft[et].width,ft[et].height,Dt,kt,ft[et].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Gt,ft[et].width,ft[et].height,0,Dt,kt,ft[et].data);for(let Ct=0;Ct<Mt.length;Ct++){const Se=Mt[Ct].image[et].image;F?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct+1,0,0,Se.width,Se.height,Dt,kt,Se.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct+1,Gt,Se.width,Se.height,0,Dt,kt,Se.data)}}else{F?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Dt,kt,ft[et]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Gt,Dt,kt,ft[et]);for(let Ct=0;Ct<Mt.length;Ct++){const Tt=Mt[Ct];F?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct+1,0,0,Dt,kt,Tt.image[et]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct+1,Gt,Dt,kt,Tt.image[et])}}}g(_)&&x(s.TEXTURE_CUBE_MAP),it.__version=X.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function Nt(C,_,U,O,X,it){const ct=r.convert(U.format,U.colorSpace),J=r.convert(U.type),Z=M(U.internalFormat,ct,J,U.normalized,U.colorSpace),lt=n.get(_),St=n.get(U);if(St.__renderTarget=_,!lt.__hasExternalTextures){const ft=Math.max(1,_.width>>it),mt=Math.max(1,_.height>>it);X===s.TEXTURE_3D||X===s.TEXTURE_2D_ARRAY?e.texImage3D(X,it,Z,ft,mt,_.depth,0,ct,J,null):e.texImage2D(X,it,Z,ft,mt,0,ct,J,null)}e.bindFramebuffer(s.FRAMEBUFFER,C),Me(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,O,X,St.__webglTexture,0,me(_)):(X===s.TEXTURE_2D||X>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&X<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,O,X,St.__webglTexture,it),e.bindFramebuffer(s.FRAMEBUFFER,null)}function pe(C,_,U){if(s.bindRenderbuffer(s.RENDERBUFFER,C),_.depthBuffer){const O=_.depthTexture,X=O&&O.isDepthTexture?O.type:null,it=E(_.stencilBuffer,X),ct=_.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Me(_)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,me(_),it,_.width,_.height):U?s.renderbufferStorageMultisample(s.RENDERBUFFER,me(_),it,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,it,_.width,_.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ct,s.RENDERBUFFER,C)}else{const O=_.textures;for(let X=0;X<O.length;X++){const it=O[X],ct=r.convert(it.format,it.colorSpace),J=r.convert(it.type),Z=M(it.internalFormat,ct,J,it.normalized,it.colorSpace);Me(_)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,me(_),Z,_.width,_.height):U?s.renderbufferStorageMultisample(s.RENDERBUFFER,me(_),Z,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,Z,_.width,_.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function qt(C,_,U){const O=_.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,C),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const X=n.get(_.depthTexture);if(X.__renderTarget=_,(!X.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),O){if(X.__webglInit===void 0&&(X.__webglInit=!0,_.depthTexture.addEventListener("dispose",P)),X.__webglTexture===void 0){X.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture),jt(s.TEXTURE_CUBE_MAP,_.depthTexture);const lt=r.convert(_.depthTexture.format),St=r.convert(_.depthTexture.type);let ft;_.depthTexture.format===qn?ft=s.DEPTH_COMPONENT24:_.depthTexture.format===Gi&&(ft=s.DEPTH24_STENCIL8);for(let mt=0;mt<6;mt++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,ft,_.width,_.height,0,lt,St,null)}}else K(_.depthTexture,0);const it=X.__webglTexture,ct=me(_),J=O?s.TEXTURE_CUBE_MAP_POSITIVE_X+U:s.TEXTURE_2D,Z=_.depthTexture.format===Gi?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(_.depthTexture.format===qn)Me(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Z,J,it,0,ct):s.framebufferTexture2D(s.FRAMEBUFFER,Z,J,it,0);else if(_.depthTexture.format===Gi)Me(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Z,J,it,0,ct):s.framebufferTexture2D(s.FRAMEBUFFER,Z,J,it,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ie(C){const _=n.get(C),U=C.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==C.depthTexture){const O=C.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),O){const X=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,O.removeEventListener("dispose",X)};O.addEventListener("dispose",X),_.__depthDisposeCallback=X}_.__boundDepthTexture=O}if(C.depthTexture&&!_.__autoAllocateDepthBuffer)if(U)for(let O=0;O<6;O++)qt(_.__webglFramebuffer[O],C,O);else{const O=C.texture.mipmaps;O&&O.length>0?qt(_.__webglFramebuffer[0],C,0):qt(_.__webglFramebuffer,C,0)}else if(U){_.__webglDepthbuffer=[];for(let O=0;O<6;O++)if(e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[O]),_.__webglDepthbuffer[O]===void 0)_.__webglDepthbuffer[O]=s.createRenderbuffer(),pe(_.__webglDepthbuffer[O],C,!1);else{const X=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,it=_.__webglDepthbuffer[O];s.bindRenderbuffer(s.RENDERBUFFER,it),s.framebufferRenderbuffer(s.FRAMEBUFFER,X,s.RENDERBUFFER,it)}}else{const O=C.texture.mipmaps;if(O&&O.length>0?e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=s.createRenderbuffer(),pe(_.__webglDepthbuffer,C,!1);else{const X=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,it=_.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,it),s.framebufferRenderbuffer(s.FRAMEBUFFER,X,s.RENDERBUFFER,it)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function te(C,_,U){const O=n.get(C);_!==void 0&&Nt(O.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),U!==void 0&&ie(C)}function Jt(C){const _=C.texture,U=n.get(C),O=n.get(_);C.addEventListener("dispose",y);const X=C.textures,it=C.isWebGLCubeRenderTarget===!0,ct=X.length>1;if(ct||(O.__webglTexture===void 0&&(O.__webglTexture=s.createTexture()),O.__version=_.version,o.memory.textures++),it){U.__webglFramebuffer=[];for(let J=0;J<6;J++)if(_.mipmaps&&_.mipmaps.length>0){U.__webglFramebuffer[J]=[];for(let Z=0;Z<_.mipmaps.length;Z++)U.__webglFramebuffer[J][Z]=s.createFramebuffer()}else U.__webglFramebuffer[J]=s.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){U.__webglFramebuffer=[];for(let J=0;J<_.mipmaps.length;J++)U.__webglFramebuffer[J]=s.createFramebuffer()}else U.__webglFramebuffer=s.createFramebuffer();if(ct)for(let J=0,Z=X.length;J<Z;J++){const lt=n.get(X[J]);lt.__webglTexture===void 0&&(lt.__webglTexture=s.createTexture(),o.memory.textures++)}if(C.samples>0&&Me(C)===!1){U.__webglMultisampledFramebuffer=s.createFramebuffer(),U.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let J=0;J<X.length;J++){const Z=X[J];U.__webglColorRenderbuffer[J]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,U.__webglColorRenderbuffer[J]);const lt=r.convert(Z.format,Z.colorSpace),St=r.convert(Z.type),ft=M(Z.internalFormat,lt,St,Z.normalized,Z.colorSpace,C.isXRRenderTarget===!0),mt=me(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,mt,ft,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+J,s.RENDERBUFFER,U.__webglColorRenderbuffer[J])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(U.__webglDepthRenderbuffer=s.createRenderbuffer(),pe(U.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(it){e.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture),jt(s.TEXTURE_CUBE_MAP,_);for(let J=0;J<6;J++)if(_.mipmaps&&_.mipmaps.length>0)for(let Z=0;Z<_.mipmaps.length;Z++)Nt(U.__webglFramebuffer[J][Z],C,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+J,Z);else Nt(U.__webglFramebuffer[J],C,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);g(_)&&x(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ct){for(let J=0,Z=X.length;J<Z;J++){const lt=X[J],St=n.get(lt);let ft=s.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ft=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(ft,St.__webglTexture),jt(ft,lt),Nt(U.__webglFramebuffer,C,lt,s.COLOR_ATTACHMENT0+J,ft,0),g(lt)&&x(ft)}e.unbindTexture()}else{let J=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(J=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(J,O.__webglTexture),jt(J,_),_.mipmaps&&_.mipmaps.length>0)for(let Z=0;Z<_.mipmaps.length;Z++)Nt(U.__webglFramebuffer[Z],C,_,s.COLOR_ATTACHMENT0,J,Z);else Nt(U.__webglFramebuffer,C,_,s.COLOR_ATTACHMENT0,J,0);g(_)&&x(J),e.unbindTexture()}C.depthBuffer&&ie(C)}function ye(C){const _=C.textures;for(let U=0,O=_.length;U<O;U++){const X=_[U];if(g(X)){const it=A(C),ct=n.get(X).__webglTexture;e.bindTexture(it,ct),x(it),e.unbindTexture()}}}const Ee=[],Te=[];function Ne(C){if(C.samples>0){if(Me(C)===!1){const _=C.textures,U=C.width,O=C.height;let X=s.COLOR_BUFFER_BIT;const it=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ct=n.get(C),J=_.length>1;if(J)for(let lt=0;lt<_.length;lt++)e.bindFramebuffer(s.FRAMEBUFFER,ct.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+lt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,ct.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+lt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,ct.__webglMultisampledFramebuffer);const Z=C.texture.mipmaps;Z&&Z.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ct.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ct.__webglFramebuffer);for(let lt=0;lt<_.length;lt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(X|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(X|=s.STENCIL_BUFFER_BIT)),J){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ct.__webglColorRenderbuffer[lt]);const St=n.get(_[lt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,St,0)}s.blitFramebuffer(0,0,U,O,0,0,U,O,X,s.NEAREST),l===!0&&(Ee.length=0,Te.length=0,Ee.push(s.COLOR_ATTACHMENT0+lt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Ee.push(it),Te.push(it),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Te)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Ee))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),J)for(let lt=0;lt<_.length;lt++){e.bindFramebuffer(s.FRAMEBUFFER,ct.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+lt,s.RENDERBUFFER,ct.__webglColorRenderbuffer[lt]);const St=n.get(_[lt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,ct.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+lt,s.TEXTURE_2D,St,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ct.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const _=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[_])}}}function me(C){return Math.min(i.maxSamples,C.samples)}function Me(C){const _=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function S(C){const _=o.render.frame;h.get(C)!==_&&(h.set(C,_),C.update())}function nt(C,_){const U=C.colorSpace,O=C.format,X=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||U!==tr&&U!==mi&&(Qt.getTransfer(U)===re?(O!==Mn||X!==rn)&&Ut("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ee("WebGLTextures: Unsupported texture color space:",U)),_}function _t(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=H,this.getTextureUnits=Y,this.setTextureUnits=k,this.setTexture2D=K,this.setTexture2DArray=tt,this.setTexture3D=ot,this.setTextureCube=at,this.rebindTextures=te,this.setupRenderTarget=Jt,this.updateRenderTargetMipmap=ye,this.updateMultisampleRenderTarget=Ne,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=Nt,this.useMultisampledRTT=Me,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function y_(s,t){function e(n,i=mi){let r;const o=Qt.getTransfer(i);if(n===rn)return s.UNSIGNED_BYTE;if(n===Ea)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Ta)return s.UNSIGNED_SHORT_5_5_5_1;if(n===vh)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===_h)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===gh)return s.BYTE;if(n===xh)return s.SHORT;if(n===js)return s.UNSIGNED_SHORT;if(n===wa)return s.INT;if(n===Dn)return s.UNSIGNED_INT;if(n===yn)return s.FLOAT;if(n===on)return s.HALF_FLOAT;if(n===yh)return s.ALPHA;if(n===Mh)return s.RGB;if(n===Mn)return s.RGBA;if(n===qn)return s.DEPTH_COMPONENT;if(n===Gi)return s.DEPTH_STENCIL;if(n===Aa)return s.RED;if(n===Ca)return s.RED_INTEGER;if(n===Vi)return s.RG;if(n===Ra)return s.RG_INTEGER;if(n===Pa)return s.RGBA_INTEGER;if(n===Or||n===Br||n===zr||n===Hr)if(o===re)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Or)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===zr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Or)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Br)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===zr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Hr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===La||n===Da||n===Ia||n===Ua)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===La)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Da)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ia)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ua)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Na||n===ka||n===Fa||n===Oa||n===Ba||n===Gr||n===za)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Na||n===ka)return o===re?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Fa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Oa)return r.COMPRESSED_R11_EAC;if(n===Ba)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Gr)return r.COMPRESSED_RG11_EAC;if(n===za)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ha||n===Ga||n===Va||n===Wa||n===$a||n===Xa||n===Ya||n===qa||n===Ka||n===Za||n===Ja||n===ja||n===Qa||n===tl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ha)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ga)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Va)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===$a)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Xa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ya)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===qa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ka)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Za)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ja)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ja)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Qa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===tl)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===el||n===nl||n===il)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===el)return o===re?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===nl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===il)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===sl||n===rl||n===Vr||n===ol)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===sl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===rl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Vr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ol)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Qs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}const M_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,b_=`
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

}`;class S_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new iu(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Le({vertexShader:M_,fragmentShader:b_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Yt(new mn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class w_ extends gi{constructor(t,e){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,p=null;const v=typeof XRWebGLBinding<"u",m=new S_,g={},x=e.getContextAttributes();let A=null,M=null;const E=[],b=[],P=new dt;let y=null;const T=new tn;T.viewport=new ve;const I=new tn;I.viewport=new ve;const D=[T,I],N=new c0;let H=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ht=E[j];return ht===void 0&&(ht=new vl,E[j]=ht),ht.getTargetRaySpace()},this.getControllerGrip=function(j){let ht=E[j];return ht===void 0&&(ht=new vl,E[j]=ht),ht.getGripSpace()},this.getHand=function(j){let ht=E[j];return ht===void 0&&(ht=new vl,E[j]=ht),ht.getHandSpace()};function k(j){const ht=b.indexOf(j.inputSource);if(ht===-1)return;const st=E[ht];st!==void 0&&(st.update(j.inputSource,j.frame,c||o),st.dispatchEvent({type:j.type,data:j.inputSource}))}function G(){i.removeEventListener("select",k),i.removeEventListener("selectstart",k),i.removeEventListener("selectend",k),i.removeEventListener("squeeze",k),i.removeEventListener("squeezestart",k),i.removeEventListener("squeezeend",k),i.removeEventListener("end",G),i.removeEventListener("inputsourceschange",z);for(let j=0;j<E.length;j++){const ht=b[j];ht!==null&&(b[j]=null,E[j].disconnect(ht))}H=null,Y=null,m.reset();for(const j in g)delete g[j];t.setRenderTarget(A),f=null,d=null,u=null,i=null,M=null,jt.stop(),n.isPresenting=!1,t.setPixelRatio(y),t.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&Ut("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,n.isPresenting===!0&&Ut("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(i,e)),u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(j){if(i=j,i!==null){if(A=t.getRenderTarget(),i.addEventListener("select",k),i.addEventListener("selectstart",k),i.addEventListener("selectend",k),i.addEventListener("squeeze",k),i.addEventListener("squeezestart",k),i.addEventListener("squeezeend",k),i.addEventListener("end",G),i.addEventListener("inputsourceschange",z),x.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(P),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let st=null,Et=null,Ot=null;x.depth&&(Ot=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,st=x.stencil?Gi:qn,Et=x.stencil?Qs:Dn);const Nt={colorFormat:e.RGBA8,depthFormat:Ot,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Nt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),M=new je(d.textureWidth,d.textureHeight,{format:Mn,type:rn,depthTexture:new Us(d.textureWidth,d.textureHeight,Et,void 0,void 0,void 0,void 0,void 0,void 0,st),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const st={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,st),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new je(f.framebufferWidth,f.framebufferHeight,{format:Mn,type:rn,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),jt.setContext(i),jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function z(j){for(let ht=0;ht<j.removed.length;ht++){const st=j.removed[ht],Et=b.indexOf(st);Et>=0&&(b[Et]=null,E[Et].disconnect(st))}for(let ht=0;ht<j.added.length;ht++){const st=j.added[ht];let Et=b.indexOf(st);if(Et===-1){for(let Nt=0;Nt<E.length;Nt++)if(Nt>=b.length){b.push(st),Et=Nt;break}else if(b[Nt]===null){b[Nt]=st,Et=Nt;break}if(Et===-1)break}const Ot=E[Et];Ot&&Ot.connect(st)}}const K=new L,tt=new L;function ot(j,ht,st){K.setFromMatrixPosition(ht.matrixWorld),tt.setFromMatrixPosition(st.matrixWorld);const Et=K.distanceTo(tt),Ot=ht.projectionMatrix.elements,Nt=st.projectionMatrix.elements,pe=Ot[14]/(Ot[10]-1),qt=Ot[14]/(Ot[10]+1),ie=(Ot[9]+1)/Ot[5],te=(Ot[9]-1)/Ot[5],Jt=(Ot[8]-1)/Ot[0],ye=(Nt[8]+1)/Nt[0],Ee=pe*Jt,Te=pe*ye,Ne=Et/(-Jt+ye),me=Ne*-Jt;if(ht.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(me),j.translateZ(Ne),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Ot[10]===-1)j.projectionMatrix.copy(ht.projectionMatrix),j.projectionMatrixInverse.copy(ht.projectionMatrixInverse);else{const Me=pe+Ne,S=qt+Ne,nt=Ee-me,_t=Te+(Et-me),C=ie*qt/S*Me,_=te*qt/S*Me;j.projectionMatrix.makePerspective(nt,_t,C,_,Me,S),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function at(j,ht){ht===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ht.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(i===null)return;let ht=j.near,st=j.far;m.texture!==null&&(m.depthNear>0&&(ht=m.depthNear),m.depthFar>0&&(st=m.depthFar)),N.near=I.near=T.near=ht,N.far=I.far=T.far=st,(H!==N.near||Y!==N.far)&&(i.updateRenderState({depthNear:N.near,depthFar:N.far}),H=N.near,Y=N.far),N.layers.mask=j.layers.mask|6,T.layers.mask=N.layers.mask&-5,I.layers.mask=N.layers.mask&-3;const Et=j.parent,Ot=N.cameras;at(N,Et);for(let Nt=0;Nt<Ot.length;Nt++)at(Ot[Nt],Et);Ot.length===2?ot(N,T,I):N.projectionMatrix.copy(T.projectionMatrix),pt(j,N,Et)};function pt(j,ht,st){st===null?j.matrix.copy(ht.matrixWorld):(j.matrix.copy(st.matrixWorld),j.matrix.invert(),j.matrix.multiply(ht.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(ht.projectionMatrix),j.projectionMatrixInverse.copy(ht.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=gs*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(j){l=j,d!==null&&(d.fixedFoveation=j),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=j)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(N)},this.getCameraTexture=function(j){return g[j]};let zt=null;function xe(j,ht){if(h=ht.getViewerPose(c||o),p=ht,h!==null){const st=h.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let Et=!1;st.length!==N.cameras.length&&(N.cameras.length=0,Et=!0);for(let qt=0;qt<st.length;qt++){const ie=st[qt];let te=null;if(f!==null)te=f.getViewport(ie);else{const ye=u.getViewSubImage(d,ie);te=ye.viewport,qt===0&&(t.setRenderTargetTextures(M,ye.colorTexture,ye.depthStencilTexture),t.setRenderTarget(M))}let Jt=D[qt];Jt===void 0&&(Jt=new tn,Jt.layers.enable(qt),Jt.viewport=new ve,D[qt]=Jt),Jt.matrix.fromArray(ie.transform.matrix),Jt.matrix.decompose(Jt.position,Jt.quaternion,Jt.scale),Jt.projectionMatrix.fromArray(ie.projectionMatrix),Jt.projectionMatrixInverse.copy(Jt.projectionMatrix).invert(),Jt.viewport.set(te.x,te.y,te.width,te.height),qt===0&&(N.matrix.copy(Jt.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Et===!0&&N.cameras.push(Jt)}const Ot=i.enabledFeatures;if(Ot&&Ot.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const qt=u.getDepthInformation(st[0]);qt&&qt.isValid&&qt.texture&&m.init(qt,i.renderState)}if(Ot&&Ot.includes("camera-access")&&v){t.state.unbindTexture(),u=n.getBinding();for(let qt=0;qt<st.length;qt++){const ie=st[qt].camera;if(ie){let te=g[ie];te||(te=new iu,g[ie]=te);const Jt=u.getCameraImage(ie);te.sourceTexture=Jt}}}}for(let st=0;st<E.length;st++){const Et=b[st],Ot=E[st];Et!==null&&Ot!==void 0&&Ot.update(Et,ht,c||o)}zt&&zt(j,ht),ht.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ht}),p=null}const jt=new Mu;jt.setAnimationLoop(xe),this.setAnimationLoop=function(j){zt=j},this.dispose=function(){}}}const E_=new se,Ju=new Ht;Ju.set(-1,0,0,0,1,0,0,0,1);function T_(s,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,uu(s)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,x,A,M){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),u(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,M)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),v(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(o(m,g),g.isLineDashedMaterial&&a(m,g)):g.isPointsMaterial?l(m,g,x,A):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===Ke&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===Ke&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const x=t.get(g),A=x.envMap,M=x.envMapRotation;A&&(m.envMap.value=A,m.envMapRotation.value.setFromMatrix4(E_.makeRotationFromEuler(M)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Ju),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function o(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function a(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,x,A){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*x,m.scale.value=A*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function u(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,x){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Ke&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function v(m,g){const x=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function A_(s,t,e,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,E){const b=E.program;n.uniformBlockBinding(M,b)}function c(M,E){let b=i[M.id];b===void 0&&(m(M),b=h(M),i[M.id]=b,M.addEventListener("dispose",x));const P=E.program;n.updateUBOMapping(M,P);const y=t.render.frame;r[M.id]!==y&&(d(M),r[M.id]=y)}function h(M){const E=u();M.__bindingPointIndex=E;const b=s.createBuffer(),P=M.__size,y=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,b),s.bufferData(s.UNIFORM_BUFFER,P,y),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,E,b),b}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return ee("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const E=i[M.id],b=M.uniforms,P=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,E);for(let y=0,T=b.length;y<T;y++){const I=b[y];if(Array.isArray(I))for(let D=0,N=I.length;D<N;D++)f(I[D],y,D,P);else f(I,y,0,P)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,E,b,P){if(v(M,E,b,P)===!0){const y=M.__offset,T=M.value;if(Array.isArray(T)){let I=0;for(let D=0;D<T.length;D++){const N=T[D],H=g(N);p(N,M.__data,I),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(I+=H.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(T,M.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,y,M.__data)}}function p(M,E,b){typeof M=="number"||typeof M=="boolean"?E[0]=M:M.isMatrix3?(E[0]=M.elements[0],E[1]=M.elements[1],E[2]=M.elements[2],E[3]=0,E[4]=M.elements[3],E[5]=M.elements[4],E[6]=M.elements[5],E[7]=0,E[8]=M.elements[6],E[9]=M.elements[7],E[10]=M.elements[8],E[11]=0):ArrayBuffer.isView(M)?E.set(new M.constructor(M.buffer,M.byteOffset,E.length)):M.toArray(E,b)}function v(M,E,b,P){const y=M.value,T=E+"_"+b;if(P[T]===void 0)return typeof y=="number"||typeof y=="boolean"?P[T]=y:ArrayBuffer.isView(y)?P[T]=y.slice():P[T]=y.clone(),!0;{const I=P[T];if(typeof y=="number"||typeof y=="boolean"){if(I!==y)return P[T]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(I.equals(y)===!1)return I.copy(y),!0}}return!1}function m(M){const E=M.uniforms;let b=0;const P=16;for(let T=0,I=E.length;T<I;T++){const D=Array.isArray(E[T])?E[T]:[E[T]];for(let N=0,H=D.length;N<H;N++){const Y=D[N],k=Array.isArray(Y.value)?Y.value:[Y.value];for(let G=0,z=k.length;G<z;G++){const K=k[G],tt=g(K),ot=b%P,at=ot%tt.boundary,pt=ot+at;b+=at,pt!==0&&P-pt<tt.storage&&(b+=P-pt),Y.__data=new Float32Array(tt.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=b,b+=tt.storage}}}const y=b%P;return y>0&&(b+=P-y),M.__size=b,M.__cache={},this}function g(M){const E={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(E.boundary=4,E.storage=4):M.isVector2?(E.boundary=8,E.storage=8):M.isVector3||M.isColor?(E.boundary=16,E.storage=12):M.isVector4?(E.boundary=16,E.storage=16):M.isMatrix3?(E.boundary=48,E.storage=48):M.isMatrix4?(E.boundary=64,E.storage=64):M.isTexture?Ut("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(E.boundary=16,E.storage=M.byteLength):Ut("WebGLRenderer: Unsupported uniform value type.",M),E}function x(M){const E=M.target;E.removeEventListener("dispose",x);const b=o.indexOf(E.__bindingPointIndex);o.splice(b,1),s.deleteBuffer(i[E.id]),delete i[E.id],delete r[E.id]}function A(){for(const M in i)s.deleteBuffer(i[M]);o=[],i={},r={}}return{bind:l,update:c,dispose:A}}const C_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Fn=null;function R_(){return Fn===null&&(Fn=new Yh(C_,16,16,Vi,on),Fn.name="DFG_LUT",Fn.minFilter=ze,Fn.magFilter=ze,Fn.wrapS=Yn,Fn.wrapT=Yn,Fn.generateMipmaps=!1,Fn.needsUpdate=!0),Fn}class P_{constructor(t={}){const{canvas:e=Wp(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=rn}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const v=f,m=new Set([Pa,Ra,Ca]),g=new Set([rn,Dn,js,Qs,Ea,Ta]),x=new Uint32Array(4),A=new Int32Array(4),M=new L;let E=null,b=null;const P=[],y=[];let T=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ln,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const I=this;let D=!1,N=null,H=null,Y=null,k=null;this._outputColorSpace=ke;let G=0,z=0,K=null,tt=-1,ot=null;const at=new ve,pt=new ve;let zt=null;const xe=new Bt(0);let jt=0,j=e.width,ht=e.height,st=1,Et=null,Ot=null;const Nt=new ve(0,0,j,ht),pe=new ve(0,0,j,ht);let qt=!1;const ie=new fo;let te=!1,Jt=!1;const ye=new se,Ee=new L,Te=new ve,Ne={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let me=!1;function Me(){return K===null?st:1}let S=n;function nt(w,B){return e.getContext(w,B)}try{const w={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${ca}`),e.addEventListener("webglcontextlost",Se,!1),e.addEventListener("webglcontextrestored",de,!1),e.addEventListener("webglcontextcreationerror",Hn,!1),S===null){const B="webgl2";if(S=nt(B,w),S===null)throw nt(B)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(w){throw ee("WebGLRenderer: "+w.message),w}let _t,C,_,U,O,X,it,ct,J,Z,lt,St,ft,mt,Dt,kt,Gt,F,ut,Q,gt,Mt,et;function Ct(){_t=new Rx(S),_t.init(),gt=new y_(S,_t),C=new Mx(S,_t,t,gt),_=new v_(S,_t),C.reversedDepthBuffer&&d&&_.buffers.depth.setReversed(!0),H=S.createFramebuffer(),Y=S.createFramebuffer(),k=S.createFramebuffer(),U=new Dx(S),O=new s_,X=new __(S,_t,_,O,C,gt,U),it=new Cx(I),ct=new g0(S),Mt=new _x(S,ct),J=new Px(S,ct,U,Mt),Z=new Ux(S,J,ct,Mt,U),F=new Ix(S,C,X),Dt=new bx(O),lt=new i_(I,it,_t,C,Mt,Dt),St=new T_(I,O),ft=new o_,mt=new d_(_t),Gt=new vx(I,it,_,Z,p,l),kt=new x_(I,Z,C),et=new A_(S,U,C,_),ut=new yx(S,_t,U),Q=new Lx(S,_t,U),U.programs=lt.programs,I.capabilities=C,I.extensions=_t,I.properties=O,I.renderLists=ft,I.shadowMap=kt,I.state=_,I.info=U}Ct(),v!==rn&&(T=new kx(v,e.width,e.height,a,i,r));const Tt=new w_(I,S);this.xr=Tt,this.getContext=function(){return S},this.getContextAttributes=function(){return S.getContextAttributes()},this.forceContextLoss=function(){const w=_t.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=_t.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return st},this.setPixelRatio=function(w){w!==void 0&&(st=w,this.setSize(j,ht,!1))},this.getSize=function(w){return w.set(j,ht)},this.setSize=function(w,B,q=!0){if(Tt.isPresenting){Ut("WebGLRenderer: Can't change size while VR device is presenting.");return}j=w,ht=B,e.width=Math.floor(w*st),e.height=Math.floor(B*st),q===!0&&(e.style.width=w+"px",e.style.height=B+"px"),T!==null&&T.setSize(e.width,e.height),this.setViewport(0,0,w,B)},this.getDrawingBufferSize=function(w){return w.set(j*st,ht*st).floor()},this.setDrawingBufferSize=function(w,B,q){j=w,ht=B,st=q,e.width=Math.floor(w*q),e.height=Math.floor(B*q),this.setViewport(0,0,w,B)},this.setEffects=function(w){if(v===rn){ee("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let B=0;B<w.length;B++)if(w[B].isOutputPass===!0){Ut("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(at)},this.getViewport=function(w){return w.copy(Nt)},this.setViewport=function(w,B,q,V){w.isVector4?Nt.set(w.x,w.y,w.z,w.w):Nt.set(w,B,q,V),_.viewport(at.copy(Nt).multiplyScalar(st).round())},this.getScissor=function(w){return w.copy(pe)},this.setScissor=function(w,B,q,V){w.isVector4?pe.set(w.x,w.y,w.z,w.w):pe.set(w,B,q,V),_.scissor(pt.copy(pe).multiplyScalar(st).round())},this.getScissorTest=function(){return qt},this.setScissorTest=function(w){_.setScissorTest(qt=w)},this.setOpaqueSort=function(w){Et=w},this.setTransparentSort=function(w){Ot=w},this.getClearColor=function(w){return w.copy(Gt.getClearColor())},this.setClearColor=function(){Gt.setClearColor(...arguments)},this.getClearAlpha=function(){return Gt.getClearAlpha()},this.setClearAlpha=function(){Gt.setClearAlpha(...arguments)},this.clear=function(w=!0,B=!0,q=!0){let V=0;if(w){let W=!1;if(K!==null){const yt=K.texture.format;W=m.has(yt)}if(W){const yt=K.texture.type,wt=g.has(yt),vt=Gt.getClearColor(),At=Gt.getClearAlpha(),Rt=vt.r,Vt=vt.g,Kt=vt.b;wt?(x[0]=Rt,x[1]=Vt,x[2]=Kt,x[3]=At,S.clearBufferuiv(S.COLOR,0,x)):(A[0]=Rt,A[1]=Vt,A[2]=Kt,A[3]=At,S.clearBufferiv(S.COLOR,0,A))}else V|=S.COLOR_BUFFER_BIT}B&&(V|=S.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(V|=S.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&S.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),N=w},this.dispose=function(){e.removeEventListener("webglcontextlost",Se,!1),e.removeEventListener("webglcontextrestored",de,!1),e.removeEventListener("webglcontextcreationerror",Hn,!1),Gt.dispose(),ft.dispose(),mt.dispose(),O.dispose(),it.dispose(),Z.dispose(),Mt.dispose(),et.dispose(),lt.dispose(),Tt.dispose(),Tt.removeEventListener("sessionstart",$d),Tt.removeEventListener("sessionend",Xd),Qi.stop()};function Se(w){w.preventDefault(),Th("WebGLRenderer: Context Lost."),D=!0}function de(){Th("WebGLRenderer: Context Restored."),D=!1;const w=U.autoReset,B=kt.enabled,q=kt.autoUpdate,V=kt.needsUpdate,W=kt.type;Ct(),U.autoReset=w,kt.enabled=B,kt.autoUpdate=q,kt.needsUpdate=V,kt.type=W}function Hn(w){ee("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Gn(w){const B=w.target;B.removeEventListener("dispose",Gn),yM(B)}function yM(w){MM(w),O.remove(w)}function MM(w){const B=O.get(w).programs;B!==void 0&&(B.forEach(function(q){lt.releaseProgram(q)}),w.isShaderMaterial&&lt.releaseShaderCache(w))}this.renderBufferDirect=function(w,B,q,V,W,yt){B===null&&(B=Ne);const wt=W.isMesh&&W.matrixWorld.determinantAffine()<0,vt=wM(w,B,q,V,W);_.setMaterial(V,wt);let At=q.index,Rt=1;if(V.wireframe===!0){if(At=J.getWireframeAttribute(q),At===void 0)return;Rt=2}const Vt=q.drawRange,Kt=q.attributes.position;let Lt=Vt.start*Rt,le=(Vt.start+Vt.count)*Rt;yt!==null&&(Lt=Math.max(Lt,yt.start*Rt),le=Math.min(le,(yt.start+yt.count)*Rt)),At!==null?(Lt=Math.max(Lt,0),le=Math.min(le,At.count)):Kt!=null&&(Lt=Math.max(Lt,0),le=Math.min(le,Kt.count));const Ae=le-Lt;if(Ae<0||Ae===1/0)return;Mt.setup(W,V,vt,q,At);let we,ce=ut;if(At!==null&&(we=ct.get(At),ce=Q,ce.setIndex(we)),W.isMesh)V.wireframe===!0?(_.setLineWidth(V.wireframeLinewidth*Me()),ce.setMode(S.LINES)):ce.setMode(S.TRIANGLES);else if(W.isLine){let Ye=V.linewidth;Ye===void 0&&(Ye=1),_.setLineWidth(Ye*Me()),W.isLineSegments?ce.setMode(S.LINES):W.isLineLoop?ce.setMode(S.LINE_LOOP):ce.setMode(S.LINE_STRIP)}else W.isPoints?ce.setMode(S.POINTS):W.isSprite&&ce.setMode(S.TRIANGLES);if(W.isBatchedMesh)if(_t.get("WEBGL_multi_draw"))ce.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Ye=W._multiDrawStarts,bt=W._multiDrawCounts,cn=W._multiDrawCount,ne=At?ct.get(At).bytesPerElement:1,xn=O.get(V).currentProgram.getUniforms();for(let Vn=0;Vn<cn;Vn++)xn.setValue(S,"_gl_DrawID",Vn),ce.render(Ye[Vn]/ne,bt[Vn])}else if(W.isInstancedMesh)ce.renderInstances(Lt,Ae,W.count);else if(q.isInstancedBufferGeometry){const Ye=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,bt=Math.min(q.instanceCount,Ye);ce.renderInstances(Lt,Ae,bt)}else ce.render(Lt,Ae)};function Wd(w,B,q){w.transparent===!0&&w.side===Xn&&w.forceSinglePass===!1?(w.side=Ke,w.needsUpdate=!0,zo(w,B,q),w.side=pi,w.needsUpdate=!0,zo(w,B,q),w.side=Xn):zo(w,B,q)}this.compile=function(w,B,q=null){q===null&&(q=w),b=mt.get(q),b.init(B),y.push(b),q.traverseVisible(function(W){W.isLight&&W.layers.test(B.layers)&&(b.pushLight(W),W.castShadow&&b.pushShadow(W))}),w!==q&&w.traverseVisible(function(W){W.isLight&&W.layers.test(B.layers)&&(b.pushLight(W),W.castShadow&&b.pushShadow(W))}),b.setupLights();const V=new Set;return w.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const yt=W.material;if(yt)if(Array.isArray(yt))for(let wt=0;wt<yt.length;wt++){const vt=yt[wt];Wd(vt,q,W),V.add(vt)}else Wd(yt,q,W),V.add(yt)}),b=y.pop(),V},this.compileAsync=function(w,B,q=null){const V=this.compile(w,B,q);return new Promise(W=>{function yt(){if(V.forEach(function(wt){O.get(wt).currentProgram.isReady()&&V.delete(wt)}),V.size===0){W(w);return}setTimeout(yt,10)}_t.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let Pc=null;function bM(w){Pc&&Pc(w)}function $d(){Qi.stop()}function Xd(){Qi.start()}const Qi=new Mu;Qi.setAnimationLoop(bM),typeof self<"u"&&Qi.setContext(self),this.setAnimationLoop=function(w){Pc=w,Tt.setAnimationLoop(w),w===null?Qi.stop():Qi.start()},Tt.addEventListener("sessionstart",$d),Tt.addEventListener("sessionend",Xd),this.render=function(w,B){if(B!==void 0&&B.isCamera!==!0){ee("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;N!==null&&N.renderStart(w,B);const q=Tt.enabled===!0&&Tt.isPresenting===!0,V=T!==null&&(K===null||q)&&T.begin(I,K);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Tt.enabled===!0&&Tt.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(Tt.cameraAutoUpdate===!0&&Tt.updateCamera(B),B=Tt.getCamera()),w.isScene===!0&&w.onBeforeRender(I,w,B,K),b=mt.get(w,y.length),b.init(B),b.state.textureUnits=X.getTextureUnits(),y.push(b),ye.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),ie.setFromProjectionMatrix(ye,In,B.reversedDepth),Jt=this.localClippingEnabled,te=Dt.init(this.clippingPlanes,Jt),E=ft.get(w,P.length),E.init(),P.push(E),Tt.enabled===!0&&Tt.isPresenting===!0){const wt=I.xr.getDepthSensingMesh();wt!==null&&Lc(wt,B,-1/0,I.sortObjects)}Lc(w,B,0,I.sortObjects),E.finish(),I.sortObjects===!0&&E.sort(Et,Ot,B.reversedDepth),me=Tt.enabled===!1||Tt.isPresenting===!1||Tt.hasDepthSensing()===!1,me&&Gt.addToRenderList(E,w),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),te===!0&&Dt.beginShadows();const W=b.state.shadowsArray;if(kt.render(W,w,B),te===!0&&Dt.endShadows(),(V&&T.hasRenderPass())===!1){const wt=E.opaque,vt=E.transmissive;if(b.setupLights(),B.isArrayCamera){const At=B.cameras;if(vt.length>0)for(let Rt=0,Vt=At.length;Rt<Vt;Rt++){const Kt=At[Rt];qd(wt,vt,w,Kt)}me&&Gt.render(w);for(let Rt=0,Vt=At.length;Rt<Vt;Rt++){const Kt=At[Rt];Yd(E,w,Kt,Kt.viewport)}}else vt.length>0&&qd(wt,vt,w,B),me&&Gt.render(w),Yd(E,w,B)}K!==null&&z===0&&(X.updateMultisampleRenderTarget(K),X.updateRenderTargetMipmap(K)),V&&T.end(I),w.isScene===!0&&w.onAfterRender(I,w,B),Mt.resetDefaultState(),tt=-1,ot=null,y.pop(),y.length>0?(b=y[y.length-1],X.setTextureUnits(b.state.textureUnits),te===!0&&Dt.setGlobalState(I.clippingPlanes,b.state.camera)):b=null,P.pop(),P.length>0?E=P[P.length-1]:E=null,N!==null&&N.renderEnd()};function Lc(w,B,q,V){if(w.visible===!1)return;if(w.layers.test(B.layers)){if(w.isGroup)q=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(B);else if(w.isLightProbeGrid)b.pushLightProbeGrid(w);else if(w.isLight)b.pushLight(w),w.castShadow&&b.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||ie.intersectsSprite(w)){V&&Te.setFromMatrixPosition(w.matrixWorld).applyMatrix4(ye);const wt=Z.update(w),vt=w.material;vt.visible&&E.push(w,wt,vt,q,Te.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||ie.intersectsObject(w))){const wt=Z.update(w),vt=w.material;if(V&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Te.copy(w.boundingSphere.center)):(wt.boundingSphere===null&&wt.computeBoundingSphere(),Te.copy(wt.boundingSphere.center)),Te.applyMatrix4(w.matrixWorld).applyMatrix4(ye)),Array.isArray(vt)){const At=wt.groups;for(let Rt=0,Vt=At.length;Rt<Vt;Rt++){const Kt=At[Rt],Lt=vt[Kt.materialIndex];Lt&&Lt.visible&&E.push(w,wt,Lt,q,Te.z,Kt)}}else vt.visible&&E.push(w,wt,vt,q,Te.z,null)}}const yt=w.children;for(let wt=0,vt=yt.length;wt<vt;wt++)Lc(yt[wt],B,q,V)}function Yd(w,B,q,V){const{opaque:W,transmissive:yt,transparent:wt}=w;b.setupLightsView(q),te===!0&&Dt.setGlobalState(I.clippingPlanes,q),V&&_.viewport(at.copy(V)),W.length>0&&Bo(W,B,q),yt.length>0&&Bo(yt,B,q),wt.length>0&&Bo(wt,B,q),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function qd(w,B,q,V){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[V.id]===void 0){const Lt=_t.has("EXT_color_buffer_half_float")||_t.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[V.id]=new je(1,1,{generateMipmaps:!0,type:Lt?on:rn,minFilter:Hi,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qt.workingColorSpace})}const yt=b.state.transmissionRenderTarget[V.id],wt=V.viewport||at;yt.setSize(wt.z*I.transmissionResolutionScale,wt.w*I.transmissionResolutionScale);const vt=I.getRenderTarget(),At=I.getActiveCubeFace(),Rt=I.getActiveMipmapLevel();I.setRenderTarget(yt),I.getClearColor(xe),jt=I.getClearAlpha(),jt<1&&I.setClearColor(16777215,.5),I.clear(),me&&Gt.render(q);const Vt=I.toneMapping;I.toneMapping=Ln;const Kt=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),b.setupLightsView(V),te===!0&&Dt.setGlobalState(I.clippingPlanes,V),Bo(w,q,V),X.updateMultisampleRenderTarget(yt),X.updateRenderTargetMipmap(yt),_t.has("WEBGL_multisampled_render_to_texture")===!1){let Lt=!1;for(let le=0,Ae=B.length;le<Ae;le++){const we=B[le],{object:ce,geometry:Ye,material:bt,group:cn}=we;if(bt.side===Xn&&ce.layers.test(V.layers)){const ne=bt.side;bt.side=Ke,bt.needsUpdate=!0,Kd(ce,q,V,Ye,bt,cn),bt.side=ne,bt.needsUpdate=!0,Lt=!0}}Lt===!0&&(X.updateMultisampleRenderTarget(yt),X.updateRenderTargetMipmap(yt))}I.setRenderTarget(vt,At,Rt),I.setClearColor(xe,jt),Kt!==void 0&&(V.viewport=Kt),I.toneMapping=Vt}function Bo(w,B,q){const V=B.isScene===!0?B.overrideMaterial:null;for(let W=0,yt=w.length;W<yt;W++){const wt=w[W],{object:vt,geometry:At,group:Rt}=wt;let Vt=wt.material;Vt.allowOverride===!0&&V!==null&&(Vt=V),vt.layers.test(q.layers)&&Kd(vt,B,q,At,Vt,Rt)}}function Kd(w,B,q,V,W,yt){w.onBeforeRender(I,B,q,V,W,yt),w.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),W.onBeforeRender(I,B,q,V,w,yt),W.transparent===!0&&W.side===Xn&&W.forceSinglePass===!1?(W.side=Ke,W.needsUpdate=!0,I.renderBufferDirect(q,B,V,W,w,yt),W.side=pi,W.needsUpdate=!0,I.renderBufferDirect(q,B,V,W,w,yt),W.side=Xn):I.renderBufferDirect(q,B,V,W,w,yt),w.onAfterRender(I,B,q,V,W,yt)}function zo(w,B,q){B.isScene!==!0&&(B=Ne);const V=O.get(w),W=b.state.lights,yt=b.state.shadowsArray,wt=W.state.version,vt=lt.getParameters(w,W.state,yt,B,q,b.state.lightProbeGridArray),At=lt.getProgramCacheKey(vt);let Rt=V.programs;V.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?B.environment:null,V.fog=B.fog;const Vt=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;V.envMap=it.get(w.envMap||V.environment,Vt),V.envMapRotation=V.environment!==null&&w.envMap===null?B.environmentRotation:w.envMapRotation,Rt===void 0&&(w.addEventListener("dispose",Gn),Rt=new Map,V.programs=Rt);let Kt=Rt.get(At);if(Kt!==void 0){if(V.currentProgram===Kt&&V.lightsStateVersion===wt)return Jd(w,vt),Kt}else vt.uniforms=lt.getUniforms(w),N!==null&&w.isNodeMaterial&&N.build(w,q,vt),w.onBeforeCompile(vt,I),Kt=lt.acquireProgram(vt,At),Rt.set(At,Kt),V.uniforms=vt.uniforms;const Lt=V.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Lt.clippingPlanes=Dt.uniform),Jd(w,vt),V.needsLights=TM(w),V.lightsStateVersion=wt,V.needsLights&&(Lt.ambientLightColor.value=W.state.ambient,Lt.lightProbe.value=W.state.probe,Lt.directionalLights.value=W.state.directional,Lt.directionalLightShadows.value=W.state.directionalShadow,Lt.spotLights.value=W.state.spot,Lt.spotLightShadows.value=W.state.spotShadow,Lt.rectAreaLights.value=W.state.rectArea,Lt.ltc_1.value=W.state.rectAreaLTC1,Lt.ltc_2.value=W.state.rectAreaLTC2,Lt.pointLights.value=W.state.point,Lt.pointLightShadows.value=W.state.pointShadow,Lt.hemisphereLights.value=W.state.hemi,Lt.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Lt.spotLightMatrix.value=W.state.spotLightMatrix,Lt.spotLightMap.value=W.state.spotLightMap,Lt.pointShadowMatrix.value=W.state.pointShadowMatrix),V.lightProbeGrid=b.state.lightProbeGridArray.length>0,V.currentProgram=Kt,V.uniformsList=null,Kt}function Zd(w){if(w.uniformsList===null){const B=w.currentProgram.getUniforms();w.uniformsList=Ao.seqWithValue(B.seq,w.uniforms)}return w.uniformsList}function Jd(w,B){const q=O.get(w);q.outputColorSpace=B.outputColorSpace,q.batching=B.batching,q.batchingColor=B.batchingColor,q.instancing=B.instancing,q.instancingColor=B.instancingColor,q.instancingMorph=B.instancingMorph,q.skinning=B.skinning,q.morphTargets=B.morphTargets,q.morphNormals=B.morphNormals,q.morphColors=B.morphColors,q.morphTargetsCount=B.morphTargetsCount,q.numClippingPlanes=B.numClippingPlanes,q.numIntersection=B.numClipIntersection,q.vertexAlphas=B.vertexAlphas,q.vertexTangents=B.vertexTangents,q.toneMapping=B.toneMapping}function SM(w,B){if(w.length===0)return null;if(w.length===1)return w[0].texture!==null?w[0]:null;M.setFromMatrixPosition(B.matrixWorld);for(let q=0,V=w.length;q<V;q++){const W=w[q];if(W.texture!==null&&W.boundingBox.containsPoint(M))return W}return null}function wM(w,B,q,V,W){B.isScene!==!0&&(B=Ne),X.resetTextureUnits();const yt=B.fog,wt=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?B.environment:null,vt=K===null?I.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Qt.workingColorSpace,At=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Rt=it.get(V.envMap||wt,At),Vt=V.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Kt=!!q.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Lt=!!q.morphAttributes.position,le=!!q.morphAttributes.normal,Ae=!!q.morphAttributes.color;let we=Ln;V.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(we=I.toneMapping);const ce=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Ye=ce!==void 0?ce.length:0,bt=O.get(V),cn=b.state.lights;if(te===!0&&(Jt===!0||w!==ot)){const fe=w===ot&&V.id===tt;Dt.setState(V,w,fe)}let ne=!1;V.version===bt.__version?(bt.needsLights&&bt.lightsStateVersion!==cn.state.version||bt.outputColorSpace!==vt||W.isBatchedMesh&&bt.batching===!1||!W.isBatchedMesh&&bt.batching===!0||W.isBatchedMesh&&bt.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&bt.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&bt.instancing===!1||!W.isInstancedMesh&&bt.instancing===!0||W.isSkinnedMesh&&bt.skinning===!1||!W.isSkinnedMesh&&bt.skinning===!0||W.isInstancedMesh&&bt.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&bt.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&bt.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&bt.instancingMorph===!1&&W.morphTexture!==null||bt.envMap!==Rt||V.fog===!0&&bt.fog!==yt||bt.numClippingPlanes!==void 0&&(bt.numClippingPlanes!==Dt.numPlanes||bt.numIntersection!==Dt.numIntersection)||bt.vertexAlphas!==Vt||bt.vertexTangents!==Kt||bt.morphTargets!==Lt||bt.morphNormals!==le||bt.morphColors!==Ae||bt.toneMapping!==we||bt.morphTargetsCount!==Ye||!!bt.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(ne=!0):(ne=!0,bt.__version=V.version);let xn=bt.currentProgram;ne===!0&&(xn=zo(V,B,W),N&&V.isNodeMaterial&&N.onUpdateProgram(V,xn,bt));let Vn=!1,Ri=!1,Gs=!1;const he=xn.getUniforms(),Ce=bt.uniforms;if(_.useProgram(xn.program)&&(Vn=!0,Ri=!0,Gs=!0),V.id!==tt&&(tt=V.id,Ri=!0),bt.needsLights){const fe=SM(b.state.lightProbeGridArray,W);bt.lightProbeGrid!==fe&&(bt.lightProbeGrid=fe,Ri=!0)}if(Vn||ot!==w){_.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),he.setValue(S,"projectionMatrix",w.projectionMatrix),he.setValue(S,"viewMatrix",w.matrixWorldInverse);const Li=he.map.cameraPosition;Li!==void 0&&Li.setValue(S,Ee.setFromMatrixPosition(w.matrixWorld)),C.logarithmicDepthBuffer&&he.setValue(S,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&he.setValue(S,"isOrthographic",w.isOrthographicCamera===!0),ot!==w&&(ot=w,Ri=!0,Gs=!0)}if(bt.needsLights&&(cn.state.directionalShadowMap.length>0&&he.setValue(S,"directionalShadowMap",cn.state.directionalShadowMap,X),cn.state.spotShadowMap.length>0&&he.setValue(S,"spotShadowMap",cn.state.spotShadowMap,X),cn.state.pointShadowMap.length>0&&he.setValue(S,"pointShadowMap",cn.state.pointShadowMap,X)),W.isSkinnedMesh){he.setOptional(S,W,"bindMatrix"),he.setOptional(S,W,"bindMatrixInverse");const fe=W.skeleton;fe&&(fe.boneTexture===null&&fe.computeBoneTexture(),he.setValue(S,"boneTexture",fe.boneTexture,X))}W.isBatchedMesh&&(he.setOptional(S,W,"batchingTexture"),he.setValue(S,"batchingTexture",W._matricesTexture,X),he.setOptional(S,W,"batchingIdTexture"),he.setValue(S,"batchingIdTexture",W._indirectTexture,X),he.setOptional(S,W,"batchingColorTexture"),W._colorsTexture!==null&&he.setValue(S,"batchingColorTexture",W._colorsTexture,X));const Pi=q.morphAttributes;if((Pi.position!==void 0||Pi.normal!==void 0||Pi.color!==void 0)&&F.update(W,q,xn),(Ri||bt.receiveShadow!==W.receiveShadow)&&(bt.receiveShadow=W.receiveShadow,he.setValue(S,"receiveShadow",W.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&B.environment!==null&&(Ce.envMapIntensity.value=B.environmentIntensity),Ce.dfgLUT!==void 0&&(Ce.dfgLUT.value=R_()),Ri){if(he.setValue(S,"toneMappingExposure",I.toneMappingExposure),bt.needsLights&&EM(Ce,Gs),yt&&V.fog===!0&&St.refreshFogUniforms(Ce,yt),St.refreshMaterialUniforms(Ce,V,st,ht,b.state.transmissionRenderTarget[w.id]),bt.needsLights&&bt.lightProbeGrid){const fe=bt.lightProbeGrid;Ce.probesSH.value=fe.texture,Ce.probesMin.value.copy(fe.boundingBox.min),Ce.probesMax.value.copy(fe.boundingBox.max),Ce.probesResolution.value.copy(fe.resolution)}Ao.upload(S,Zd(bt),Ce,X)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Ao.upload(S,Zd(bt),Ce,X),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&he.setValue(S,"center",W.center),he.setValue(S,"modelViewMatrix",W.modelViewMatrix),he.setValue(S,"normalMatrix",W.normalMatrix),he.setValue(S,"modelMatrix",W.matrixWorld),V.uniformsGroups!==void 0){const fe=V.uniformsGroups;for(let Li=0,Vs=fe.length;Li<Vs;Li++){const jd=fe[Li];et.update(jd,xn),et.bind(jd,xn)}}return xn}function EM(w,B){w.ambientLightColor.needsUpdate=B,w.lightProbe.needsUpdate=B,w.directionalLights.needsUpdate=B,w.directionalLightShadows.needsUpdate=B,w.pointLights.needsUpdate=B,w.pointLightShadows.needsUpdate=B,w.spotLights.needsUpdate=B,w.spotLightShadows.needsUpdate=B,w.rectAreaLights.needsUpdate=B,w.hemisphereLights.needsUpdate=B}function TM(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return K},this.setRenderTargetTextures=function(w,B,q){const V=O.get(w);V.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),O.get(w.texture).__webglTexture=B,O.get(w.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:q,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,B){const q=O.get(w);q.__webglFramebuffer=B,q.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(w,B=0,q=0){K=w,G=B,z=q;let V=null,W=!1,yt=!1;if(w){const vt=O.get(w);if(vt.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(S.FRAMEBUFFER,vt.__webglFramebuffer),at.copy(w.viewport),pt.copy(w.scissor),zt=w.scissorTest,_.viewport(at),_.scissor(pt),_.setScissorTest(zt),tt=-1;return}else if(vt.__webglFramebuffer===void 0)X.setupRenderTarget(w);else if(vt.__hasExternalTextures)X.rebindTextures(w,O.get(w.texture).__webglTexture,O.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Vt=w.depthTexture;if(vt.__boundDepthTexture!==Vt){if(Vt!==null&&O.has(Vt)&&(w.width!==Vt.image.width||w.height!==Vt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");X.setupDepthRenderbuffer(w)}}const At=w.texture;(At.isData3DTexture||At.isDataArrayTexture||At.isCompressedArrayTexture)&&(yt=!0);const Rt=O.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Rt[B])?V=Rt[B][q]:V=Rt[B],W=!0):w.samples>0&&X.useMultisampledRTT(w)===!1?V=O.get(w).__webglMultisampledFramebuffer:Array.isArray(Rt)?V=Rt[q]:V=Rt,at.copy(w.viewport),pt.copy(w.scissor),zt=w.scissorTest}else at.copy(Nt).multiplyScalar(st).floor(),pt.copy(pe).multiplyScalar(st).floor(),zt=qt;if(q!==0&&(V=H),_.bindFramebuffer(S.FRAMEBUFFER,V)&&_.drawBuffers(w,V),_.viewport(at),_.scissor(pt),_.setScissorTest(zt),W){const vt=O.get(w.texture);S.framebufferTexture2D(S.FRAMEBUFFER,S.COLOR_ATTACHMENT0,S.TEXTURE_CUBE_MAP_POSITIVE_X+B,vt.__webglTexture,q)}else if(yt){const vt=B;for(let At=0;At<w.textures.length;At++){const Rt=O.get(w.textures[At]);S.framebufferTextureLayer(S.FRAMEBUFFER,S.COLOR_ATTACHMENT0+At,Rt.__webglTexture,q,vt)}}else if(w!==null&&q!==0){const vt=O.get(w.texture);S.framebufferTexture2D(S.FRAMEBUFFER,S.COLOR_ATTACHMENT0,S.TEXTURE_2D,vt.__webglTexture,q)}tt=-1},this.readRenderTargetPixels=function(w,B,q,V,W,yt,wt,vt=0){if(!(w&&w.isWebGLRenderTarget)){ee("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let At=O.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&wt!==void 0&&(At=At[wt]),At){_.bindFramebuffer(S.FRAMEBUFFER,At);try{const Rt=w.textures[vt],Vt=Rt.format,Kt=Rt.type;if(w.textures.length>1&&S.readBuffer(S.COLOR_ATTACHMENT0+vt),!C.textureFormatReadable(Vt)){ee("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!C.textureTypeReadable(Kt)){ee("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=w.width-V&&q>=0&&q<=w.height-W&&S.readPixels(B,q,V,W,gt.convert(Vt),gt.convert(Kt),yt)}finally{const Rt=K!==null?O.get(K).__webglFramebuffer:null;_.bindFramebuffer(S.FRAMEBUFFER,Rt)}}},this.readRenderTargetPixelsAsync=async function(w,B,q,V,W,yt,wt,vt=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let At=O.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&wt!==void 0&&(At=At[wt]),At)if(B>=0&&B<=w.width-V&&q>=0&&q<=w.height-W){_.bindFramebuffer(S.FRAMEBUFFER,At);const Rt=w.textures[vt],Vt=Rt.format,Kt=Rt.type;if(w.textures.length>1&&S.readBuffer(S.COLOR_ATTACHMENT0+vt),!C.textureFormatReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!C.textureTypeReadable(Kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Lt=S.createBuffer();S.bindBuffer(S.PIXEL_PACK_BUFFER,Lt),S.bufferData(S.PIXEL_PACK_BUFFER,yt.byteLength,S.STREAM_READ),S.readPixels(B,q,V,W,gt.convert(Vt),gt.convert(Kt),0);const le=K!==null?O.get(K).__webglFramebuffer:null;_.bindFramebuffer(S.FRAMEBUFFER,le);const Ae=S.fenceSync(S.SYNC_GPU_COMMANDS_COMPLETE,0);return S.flush(),await $p(S,Ae,4),S.bindBuffer(S.PIXEL_PACK_BUFFER,Lt),S.getBufferSubData(S.PIXEL_PACK_BUFFER,0,yt),S.deleteBuffer(Lt),S.deleteSync(Ae),yt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,B=null,q=0){const V=Math.pow(2,-q),W=Math.floor(w.image.width*V),yt=Math.floor(w.image.height*V),wt=B!==null?B.x:0,vt=B!==null?B.y:0;X.setTexture2D(w,0),S.copyTexSubImage2D(S.TEXTURE_2D,q,0,0,wt,vt,W,yt),_.unbindTexture()},this.copyTextureToTexture=function(w,B,q=null,V=null,W=0,yt=0){let wt,vt,At,Rt,Vt,Kt,Lt,le,Ae;const we=w.isCompressedTexture?w.mipmaps[yt]:w.image;if(q!==null)wt=q.max.x-q.min.x,vt=q.max.y-q.min.y,At=q.isBox3?q.max.z-q.min.z:1,Rt=q.min.x,Vt=q.min.y,Kt=q.isBox3?q.min.z:0;else{const Ce=Math.pow(2,-W);wt=Math.floor(we.width*Ce),vt=Math.floor(we.height*Ce),w.isDataArrayTexture?At=we.depth:w.isData3DTexture?At=Math.floor(we.depth*Ce):At=1,Rt=0,Vt=0,Kt=0}V!==null?(Lt=V.x,le=V.y,Ae=V.z):(Lt=0,le=0,Ae=0);const ce=gt.convert(B.format),Ye=gt.convert(B.type);let bt;B.isData3DTexture?(X.setTexture3D(B,0),bt=S.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(X.setTexture2DArray(B,0),bt=S.TEXTURE_2D_ARRAY):(X.setTexture2D(B,0),bt=S.TEXTURE_2D),_.activeTexture(S.TEXTURE0),_.pixelStorei(S.UNPACK_FLIP_Y_WEBGL,B.flipY),_.pixelStorei(S.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),_.pixelStorei(S.UNPACK_ALIGNMENT,B.unpackAlignment);const cn=_.getParameter(S.UNPACK_ROW_LENGTH),ne=_.getParameter(S.UNPACK_IMAGE_HEIGHT),xn=_.getParameter(S.UNPACK_SKIP_PIXELS),Vn=_.getParameter(S.UNPACK_SKIP_ROWS),Ri=_.getParameter(S.UNPACK_SKIP_IMAGES);_.pixelStorei(S.UNPACK_ROW_LENGTH,we.width),_.pixelStorei(S.UNPACK_IMAGE_HEIGHT,we.height),_.pixelStorei(S.UNPACK_SKIP_PIXELS,Rt),_.pixelStorei(S.UNPACK_SKIP_ROWS,Vt),_.pixelStorei(S.UNPACK_SKIP_IMAGES,Kt);const Gs=w.isDataArrayTexture||w.isData3DTexture,he=B.isDataArrayTexture||B.isData3DTexture;if(w.isDepthTexture){const Ce=O.get(w),Pi=O.get(B),fe=O.get(Ce.__renderTarget),Li=O.get(Pi.__renderTarget);_.bindFramebuffer(S.READ_FRAMEBUFFER,fe.__webglFramebuffer),_.bindFramebuffer(S.DRAW_FRAMEBUFFER,Li.__webglFramebuffer);for(let Vs=0;Vs<At;Vs++)Gs&&(S.framebufferTextureLayer(S.READ_FRAMEBUFFER,S.COLOR_ATTACHMENT0,O.get(w).__webglTexture,W,Kt+Vs),S.framebufferTextureLayer(S.DRAW_FRAMEBUFFER,S.COLOR_ATTACHMENT0,O.get(B).__webglTexture,yt,Ae+Vs)),S.blitFramebuffer(Rt,Vt,wt,vt,Lt,le,wt,vt,S.DEPTH_BUFFER_BIT,S.NEAREST);_.bindFramebuffer(S.READ_FRAMEBUFFER,null),_.bindFramebuffer(S.DRAW_FRAMEBUFFER,null)}else if(W!==0||w.isRenderTargetTexture||O.has(w)){const Ce=O.get(w),Pi=O.get(B);_.bindFramebuffer(S.READ_FRAMEBUFFER,Y),_.bindFramebuffer(S.DRAW_FRAMEBUFFER,k);for(let fe=0;fe<At;fe++)Gs?S.framebufferTextureLayer(S.READ_FRAMEBUFFER,S.COLOR_ATTACHMENT0,Ce.__webglTexture,W,Kt+fe):S.framebufferTexture2D(S.READ_FRAMEBUFFER,S.COLOR_ATTACHMENT0,S.TEXTURE_2D,Ce.__webglTexture,W),he?S.framebufferTextureLayer(S.DRAW_FRAMEBUFFER,S.COLOR_ATTACHMENT0,Pi.__webglTexture,yt,Ae+fe):S.framebufferTexture2D(S.DRAW_FRAMEBUFFER,S.COLOR_ATTACHMENT0,S.TEXTURE_2D,Pi.__webglTexture,yt),W!==0?S.blitFramebuffer(Rt,Vt,wt,vt,Lt,le,wt,vt,S.COLOR_BUFFER_BIT,S.NEAREST):he?S.copyTexSubImage3D(bt,yt,Lt,le,Ae+fe,Rt,Vt,wt,vt):S.copyTexSubImage2D(bt,yt,Lt,le,Rt,Vt,wt,vt);_.bindFramebuffer(S.READ_FRAMEBUFFER,null),_.bindFramebuffer(S.DRAW_FRAMEBUFFER,null)}else he?w.isDataTexture||w.isData3DTexture?S.texSubImage3D(bt,yt,Lt,le,Ae,wt,vt,At,ce,Ye,we.data):B.isCompressedArrayTexture?S.compressedTexSubImage3D(bt,yt,Lt,le,Ae,wt,vt,At,ce,we.data):S.texSubImage3D(bt,yt,Lt,le,Ae,wt,vt,At,ce,Ye,we):w.isDataTexture?S.texSubImage2D(S.TEXTURE_2D,yt,Lt,le,wt,vt,ce,Ye,we.data):w.isCompressedTexture?S.compressedTexSubImage2D(S.TEXTURE_2D,yt,Lt,le,we.width,we.height,ce,we.data):S.texSubImage2D(S.TEXTURE_2D,yt,Lt,le,wt,vt,ce,Ye,we);_.pixelStorei(S.UNPACK_ROW_LENGTH,cn),_.pixelStorei(S.UNPACK_IMAGE_HEIGHT,ne),_.pixelStorei(S.UNPACK_SKIP_PIXELS,xn),_.pixelStorei(S.UNPACK_SKIP_ROWS,Vn),_.pixelStorei(S.UNPACK_SKIP_IMAGES,Ri),yt===0&&B.generateMipmaps&&S.generateMipmap(bt),_.unbindTexture()},this.initRenderTarget=function(w){O.get(w).__webglFramebuffer===void 0&&X.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?X.setTextureCube(w,0):w.isData3DTexture?X.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?X.setTexture2DArray(w,0):X.setTexture2D(w,0),_.unbindTexture()},this.resetState=function(){G=0,z=0,K=null,_.reset(),Mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return In}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Qt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Qt._getUnpackColorSpace()}}const xr=new L;function gn(s,t,e,n,i,r){const o=2*Math.PI*i/4,a=Math.max(r-2*i,0),l=Math.PI/4;xr.copy(t),xr[n]=0,xr.normalize();const c=.5*o/(o+a),h=1-xr.angleTo(s)/l;return Math.sign(xr[e])===1?h*c:a/(o+a)+c+c*(1-h)}class ri extends Tn{constructor(t=1,e=1,n=1,i=2,r=.1){const o=i*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:i,radius:r},o===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const l=new L,c=new L,h=new L(t,e,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=u.length/6,v=new L,m=.5/o;for(let g=0,x=0;g<u.length;g+=3,x+=2)switch(l.fromArray(u,g),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),u[g+0]=h.x*Math.sign(l.x)+c.x*r,u[g+1]=h.y*Math.sign(l.y)+c.y*r,u[g+2]=h.z*Math.sign(l.z)+c.z*r,d[g+0]=c.x,d[g+1]=c.y,d[g+2]=c.z,Math.floor(g/p)){case 0:v.set(1,0,0),f[x+0]=gn(v,c,"z","y",r,n),f[x+1]=1-gn(v,c,"y","z",r,e);break;case 1:v.set(-1,0,0),f[x+0]=1-gn(v,c,"z","y",r,n),f[x+1]=1-gn(v,c,"y","z",r,e);break;case 2:v.set(0,1,0),f[x+0]=1-gn(v,c,"x","z",r,t),f[x+1]=gn(v,c,"z","x",r,n);break;case 3:v.set(0,-1,0),f[x+0]=1-gn(v,c,"x","z",r,t),f[x+1]=1-gn(v,c,"z","x",r,n);break;case 4:v.set(0,0,1),f[x+0]=1-gn(v,c,"x","y",r,t),f[x+1]=1-gn(v,c,"y","x",r,e);break;case 5:v.set(0,0,-1),f[x+0]=gn(v,c,"x","y",r,t),f[x+1]=1-gn(v,c,"y","x",r,e);break}}static fromJSON(t){return new ri(t.width,t.height,t.depth,t.segments,t.radius)}}const L_=`
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
`,D_=`
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
`;function I_(s,t){return new Le({uniforms:{map:{value:s},uTime:{value:0},uPower:{value:0},uHover:{value:0},uStatic:{value:0},uSeed:{value:t},uGain:{value:1},uTint:{value:new Bt(1,1,1)}},vertexShader:L_,fragmentShader:D_})}function U_(s,t,e){const n=new mn(s,t,24,18),i=n.attributes.position;for(let r=0;r<i.count;r++){const o=i.getX(r)/(s/2),a=i.getY(r)/(t/2);i.setZ(r,e*(1-.5*o*o-.5*a*a))}return n.computeVertexNormals(),n}const ju={beige:{color:12168852,rough:.62},tv:{color:1513242,rough:.42},grey:{color:7172214,rough:.55},black:{color:855311,rough:.5}},Qu=new Map;function N_(s){let t=Qu.get(s);return t||(t=new Qe({color:ju[s].color,roughness:ju[s].rough,metalness:.05}),Qu.set(s,t)),t}const k_=new Qe({color:328966,roughness:.35,metalness:.2});function F_(s){const t=document.createElement("canvas");t.width=256,t.height=56;const e=t.getContext("2d");if(e){e.fillStyle="#d8cfae",e.fillRect(0,0,256,56),e.fillStyle="rgba(120,100,60,0.18)";for(let o=0;o<40;o++)e.fillRect(Math.random()*256,Math.random()*56,2,1);e.globalCompositeOperation="destination-out";for(let o=0;o<56;o+=4)e.fillRect(0,o,Math.random()*5,4),e.fillRect(256-Math.random()*5,o,5,4);e.globalCompositeOperation="source-over"}const n=new Is(t),i=`31px ${Yc}`;let r=null;return Pf(i,()=>{e&&(r?e.putImageData(r,0,0):r=e.getImageData(0,0,256,56),e.fillStyle="#16161c",e.font=i,e.textAlign="center",e.textBaseline="middle",e.save(),e.translate(128,31),e.rotate(-.02),e.fillText(s,0,0),e.restore())},()=>n.needsUpdate=!0),n.colorSpace=ke,n.anisotropy=4,n}class td{constructor(t){R(this,"group",new jn);R(this,"texture");R(this,"crt");R(this,"glass");R(this,"hit");R(this,"height");R(this,"width");R(this,"depth");R(this,"screenH");R(this,"screenLocal");R(this,"portLocal");R(this,"topLocal");R(this,"led");R(this,"ledState","");const e=t.screenW,n=e*.75;this.screenH=n;const i=e*1.26,r=n+e*.34,o=e*.2;this.width=i,this.height=r+(t.stand?e*.08:0);const a=t.stand?e*.08:0,l=N_(t.style),c=new Yt(new ri(i,r,o,3,e*.045),l);c.position.set(0,a+r/2,-o/2),this.group.add(c);const h=e*.62,u=new Yt(new ri(i*.84,r*.86,h,3,e*.08),l);u.position.set(0,a+r*.52,-o-h/2+e*.04),this.group.add(u);const d=e*.3,f=new Yt(new ri(i*.46,r*.46,d,2,e*.05),l);if(f.position.set(0,a+r*.54,-o-h-d/2+e*.1),this.group.add(f),this.depth=o+h+d-e*.14,t.stand){const g=new Yt(new Ns(e*.34,e*.4,a,24),l);g.position.set(0,a/2,-o-h*.4),this.group.add(g)}const p=a+r/2+e*.07;this.screenLocal=new L(0,p,.02),this.portLocal=new L(e*.1,a+r*.25,-this.depth+e*.05),this.topLocal=new L(0,a+r,-o-h*.45);const v=new Yt(new mn(e*1.05,n*1.05),k_);v.position.set(0,p,.002),this.group.add(v),this.texture=new Is(t.screen),this.texture.colorSpace=ke,this.texture.minFilter=ze,this.texture.generateMipmaps=!1,this.crt=I_(this.texture,t.seed),this.glass=new Yt(U_(e,n,e*.035),this.crt),this.glass.position.set(0,p,.004),this.group.add(this.glass);const m=new Yt(new mn(e*.4,e*.088),new Qe({map:F_(t.label),transparent:!0,roughness:.9}));if(m.position.set(-e*.18,a+e*.075,.003),m.rotation.z=t.seed%7*.012-.03,this.group.add(m),this.led=new Yt(new vo(e*.014,8,6),new ii({color:1714714})),this.led.position.set(i/2-e*.12,a+e*.08,.004),this.group.add(this.led),t.style==="tv"||t.style==="grey"){const g=new Qe({color:2763310,roughness:.4});for(let x=0;x<2;x++){const A=new Yt(new Ns(e*.028,e*.028,e*.03,16),g);A.rotation.x=Math.PI/2,A.position.set(i/2-e*.24-x*e*.09,a+e*.08,.012),this.group.add(A)}}this.hit=new Yt(new Tn(i,r,this.depth),new ii({visible:!1})),this.hit.position.set(0,a+r/2,-this.depth/2),this.group.add(this.hit)}setLed(t,e){const n=t?e:"#1a2a1a";n!==this.ledState&&(this.ledState=n,this.led.material.color.set(n))}world(t){return this.group.updateMatrixWorld(!0),t.clone().applyMatrix4(this.group.matrixWorld)}normal(){const t=new Un;return this.group.getWorldQuaternion(t),new L(0,0,1).applyQuaternion(t)}}const O_={color:723724,roughness:.55,metalness:0};class ed{constructor(t,e,n){R(this,"mesh");R(this,"uniforms",{uPulseColor:{value:new Bt},uPulseTime:{value:0},uPulseGain:{value:.35},uPulseCount:{value:3},uPulseSpeed:{value:.35}});R(this,"base",.35);R(this,"surgeLeft",0);R(this,"lit",0);const i=new au(t,!1,"centripetal",.5),r=i.getLength(),o=new Gl(i,Math.max(40,Math.round(r*18)),e,6,!1),a=o.attributes.uv,l=new Float32Array(a.count);for(let h=0;h<a.count;h++)l[h]=a.getX(h);o.setAttribute("aAlong",new fn(l,1)),this.uniforms.uPulseColor.value.set(n),this.uniforms.uPulseCount.value=Math.max(1,Math.round(r/2.2)),this.uniforms.uPulseSpeed.value=.18+Math.random()*.12;const c=new Qe(O_);c.onBeforeCompile=h=>{Object.assign(h.uniforms,this.uniforms),h.vertexShader=h.vertexShader.replace("#include <common>",`#include <common>
attribute float aAlong;
varying float vAlong;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vAlong = aAlong;`),h.fragmentShader=h.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uPulseColor;
uniform float uPulseTime, uPulseGain, uPulseCount, uPulseSpeed;
varying float vAlong;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
float ph = fract(vAlong * uPulseCount + uPulseTime * uPulseSpeed);
float pulse = smoothstep(0.0, 0.03, ph) * (1.0 - smoothstep(0.03, 0.14, ph));
totalEmissiveRadiance += uPulseColor * (pulse * uPulseGain + 0.012 * uPulseGain);`)},c.customProgramCacheKey=()=>"oikos-cable",this.mesh=new Yt(o,c)}setLit(t){this.lit=t}surge(){this.surgeLeft=2.2}update(t,e){this.surgeLeft=Math.max(0,this.surgeLeft-e);const n=this.surgeLeft>0?Math.sin(this.surgeLeft/2.2*Math.PI)*5:0,i=this.base+this.lit*1.2+n;this.uniforms.uPulseGain.value+=(i-this.uniforms.uPulseGain.value)*Math.min(1,e*6),this.uniforms.uPulseTime.value=t*(1+this.lit*1.5+n*.8)}}function B_(s,t,e,n,i,r){const a=[s.clone()],l=s.clone().addScaledVector(t,.18);a.push(l);const c=new L(l.x,.022,l.z).addScaledVector(t,.22);s.y>.3&&a.push(new L(l.x,(s.y+.022)*.4,l.z).addScaledVector(t,.2)),a.push(c);const h=new L(e.x,.022,n-.14),u=Math.sign(c.x||1);c.z>n-.1&&a.push(new L(u*1.15,.022,n-.25));const d=2;for(let f=1;f<=d;f++){const p=f/(d+1),v=new L().lerpVectors(c,h,p),m=new L(h.z-c.z,0,c.x-h.x).normalize();v.addScaledVector(m,(r()-.5)*.9),v.y=.022,a.push(v)}return a.push(h),a.push(new L(e.x,i-.04,n-.035)),a.push(new L(e.x,i+.03,n+.01)),a.push(e.clone()),a}function nd(s,t,e,n=32){const i=[];for(let r=0;r<=n;r++){const o=r/n,a=new L().lerpVectors(s,t,o);a.y-=e*4*o*(1-o),i.push(a)}return i}function z_(s){const t=[],e=[],n=[];for(const r of s){const o=r.getAttribute("position"),a=r.getAttribute("normal"),l=t.length/3;for(let h=0;h<o.count;h++)t.push(o.getX(h),o.getY(h),o.getZ(h)),e.push(a.getX(h),a.getY(h),a.getZ(h));const c=r.getIndex();if(c)for(let h=0;h<c.count;h++)n.push(l+c.getX(h));else for(let h=0;h<o.count;h++)n.push(l+h)}const i=new He;return i.setAttribute("position",new oe(t,3)),i.setAttribute("normal",new oe(e,3)),i.setIndex(n),i}function id(s,t){for(let e=0;e<s.length-1;e++){const n=s[e],i=s[e+1];n&&i&&t.push(n.x,n.y,n.z,i.x,i.y,i.z)}}function H_(){var h,u,d;const s=new jn,t=[],e=[],n=new Qe({color:854795,roughness:.9}),i=new Jh({color:328708}),r=[new L(-26,0,-18),new L(-9,0,-24),new L(8,0,-23),new L(24,0,-15),new L(33,0,2)],o=12.5,a=[];r.forEach((f,p)=>{const v=new Yt(new Ns(.12,.17,o,8));v.position.set(f.x,o/2,f.z),v.updateMatrix(),t.push(v.geometry.applyMatrix4(v.matrix));const m=r[p+1]??r[p-1]??f,g=new L().subVectors(m,f).setY(0).normalize(),x=new L(-g.z,0,g.x),A=[];for(const[M,E]of[[o-.4,1.9],[o-1.5,1.4]]){const b=new Yt(new Tn(E*2,.12,.12));b.position.set(f.x,M,f.z),b.rotation.y=Math.atan2(-x.z,x.x),b.updateMatrix(),t.push(b.geometry.applyMatrix4(b.matrix));for(const P of[-1,-.45,.45,1])A.push(new L(f.x,M+.08,f.z).addScaledVector(x,P*E*.95))}a.push(A)});for(let f=0;f<a.length-1;f++){const p=a[f]??[],v=a[f+1]??[];p.forEach((m,g)=>{const x=v[g];x&&id(nd(m,x,1.4+g%3*.25),e)})}const l=[[(h=a[1])==null?void 0:h[0],new L(-2.4,9,-6.6)],[(u=a[2])==null?void 0:u[3],new L(2.2,9,-6.1)],[(d=a[3])==null?void 0:d[1],new L(6,8.5,-3)]];for(const[f,p]of l)f&&id(nd(f,p,2.2),e);s.add(new Yt(z_(t),n));for(const f of t)f.dispose();const c=new He;return c.setAttribute("position",new oe(e,3)),s.add(new Im(c,i)),s}function G_(){const s=new Le({side:Ke,depthWrite:!1,fog:!1,uniforms:{uTime:{value:0}},vertexShader:`
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
      }`}),t=new Yt(new vo(70,32,16),s);return t.renderOrder=-1,t}const en=.62,nc=1.6,Ro=1.1,Ei=.1,sd=Ei-Ro/2,Zi="#ffb347",ic="rgba(255,179,71,0.68)",Ti='"VT323", "IBM Plex Mono", ui-monospace, monospace';class V_{constructor(){R(this,"canvas",document.createElement("canvas"));R(this,"glow",.8);R(this,"ctx");R(this,"mode",{kind:"idle"});R(this,"dirty",!0);R(this,"lastKey","");R(this,"fontsReady",!1);var t;this.canvas.width=512,this.canvas.height=384,this.ctx=this.canvas.getContext("2d",{willReadFrequently:!0}),(t=document.fonts)==null||t.load(`40px ${Ti}`).then(()=>{this.fontsReady=!0,this.dirty=!0},()=>{this.fontsReady=!0})}scroll(t,e){this.mode={kind:"scroll",text:t,at:e},this.dirty=!0}play(t,e,n){this.mode={kind:"play",channel:t,name:e,at:n},this.dirty=!0}stop(){this.mode={kind:"idle"},this.dirty=!0}update(t,e){const n=this.mode;if(n.kind==="scroll"){const l=512+n.text.length*22;(t-n.at)*120>l&&this.stop()}const i=new Date,r=Math.floor(t*2)%2===0,o=this.mode.kind==="scroll"?Math.floor((t-this.mode.at)*15):0,a=`${this.mode.kind}|${i.getHours()}:${i.getMinutes()}|${r}|${o}|${this.fontsReady}`;if(!this.dirty&&a===this.lastKey)return!1;this.lastKey=a,this.dirty=!1;try{this.paint(t,i,r)}catch{return!1}return!0}paint(t,e,n){const i=this.ctx;if(!i)return;const r=this.canvas.width,o=this.canvas.height;i.fillStyle="#060302",i.fillRect(0,0,r,o),i.textBaseline="alphabetic",i.fillStyle=Zi,i.font=`48px ${Ti}`,i.fillText("æthera",26,56),i.fillStyle=ic,i.font=`36px ${Ti}`,i.textAlign="right",i.fillText(`day ${rd(e)} · ${vr(e.getHours())}:${vr(e.getMinutes())}`,r-26,54),i.textAlign="left",i.fillRect(26,72,r-52,2);const a=this.mode;if(a.kind==="play"?(i.fillStyle=ic,i.font=`30px ${Ti}`,i.fillText(`▸ ch ${vr(a.channel)}`,26,150),i.fillStyle=Zi,i.font=`64px ${Ti}`,i.fillText(X_(i,a.name,r-52),26,214),i.fillStyle=ic,i.font=`26px ${Ti}`,i.fillText(`opening${".".repeat(1+Math.floor(t*2)%3)}`,26,262)):(i.save(),i.fillStyle=Zi,i.shadowColor="rgba(255,138,61,0.55)",i.shadowBlur=18,i.font=`180px ${Ti}`,i.textAlign="center",i.fillText("æ",r/2,250),i.restore()),i.fillStyle=Zi,i.font=`40px ${Ti}`,a.kind==="scroll"){const l=r-(t-a.at)*120;i.fillText(a.text,l,o-30)}else i.fillText(`~ ${n?"_":" "}`,26,o-30)}}class W_{constructor(){R(this,"group",new jn);R(this,"hit");R(this,"display",new V_);R(this,"monitor");R(this,"rearY",en-.02);R(this,"rearZ",sd);R(this,"hddLed");R(this,"busyLeft",0);R(this,"power",0);R(this,"hover",0);R(this,"link");const t=new Qe({color:723725,roughness:.7,metalness:.1}),e=new Yt(new ri(nc,en,Ro,2,.02),t);e.position.set(0,en/2,Ei),this.group.add(e);const n=new Yt(new Tn(nc+.02,.006,Ro+.02),new ii({color:11735583}));n.position.set(0,en-.03,Ei),this.group.add(n),this.monitor=new td({style:"beige",screenW:.66,screen:this.display.canvas,label:"aethera",accent:Zi,seed:315}),this.monitor.group.position.set(-.22,en,Ei+.14),this.monitor.group.rotation.y=.05,this.group.add(this.monitor.group);const i=new Qe({color:12168852,roughness:.62,metalness:.05}),r=.25,o=.56,a=.52,l=new jn;l.position.set(.53,en,Ei-.04),l.rotation.y=-.12,this.group.add(l);const c=new Yt(new ri(r,o,a,3,.012),i);c.position.y=o/2,l.add(c);const h=new Qe({color:3814700,roughness:.5});for(const[g,x]of[[.49,.04],[.435,.04],[.37,.014]]){const A=new Yt(new mn(r*.78,x),h);A.position.set(0,g,a/2+.001),l.add(A)}const u=(g,x)=>{const A=new ii({color:g}),M=new Yt(new Fl(.006,10),A);return M.position.set(r*.28,x,a/2+.002),l.add(M),A};u(7208826,.08),this.hddLed=u(3810320,.06);const d=new Yt(new ri(.5,.028,.17,2,.006),i);d.position.set(-.22,en+.016,Ei+.4),d.rotation.set(.06,.04,0),this.group.add(d);const f=new Yt(new mn(.46,.13),new Qe({map:$_(),roughness:.6}));f.rotation.x=-Math.PI/2,f.position.set(0,.0145,0),d.add(f),this.group.updateMatrixWorld(!0);const p=new L(.53-.05,en+.12,Ei-.3),v=this.monitor.world(this.monitor.portLocal),m=new L().lerpVectors(p,v,.5).setY(en+.01);this.link=new ed([p,p.clone().setY(en+.02),m,v.clone().setY(en+.03),v],.01,Zi),this.group.add(this.link.mesh),this.hit=new Yt(new Tn(nc,.82,Ro),new ii({visible:!1})),this.hit.position.set(0,en+.36,Ei),this.group.add(this.hit)}screenWorld(){return this.monitor.world(this.monitor.screenLocal)}load(t){this.busyLeft=t?1.4:.5}update(t,e,n){this.power=Math.min(1,this.power+e/.8),this.hover+=((n?1:0)-this.hover)*Math.min(1,e*8),this.display.glow=.8+this.hover*.2;const i=this.monitor.crt.uniforms;i.uTime.value=t,i.uPower.value=this.power,i.uHover.value=this.hover,this.power>.2&&this.display.update(t,e)&&(this.monitor.texture.needsUpdate=!0),this.monitor.setLed(this.power>.5,Zi),this.busyLeft=Math.max(0,this.busyLeft-e);const r=this.busyLeft>0&&Math.sin(t*47)+Math.sin(t*29)>.3;this.hddLed.color.setHex(r?16757575:3810320),this.link.update(t,e)}}function $_(){const s=document.createElement("canvas");s.width=256,s.height=72;const t=s.getContext("2d");if(t){t.fillStyle="#8e8571",t.fillRect(0,0,256,72),t.fillStyle="#cfc6ae";for(let n=0;n<4;n++)for(let i=0;i<15;i++)t.fillRect(4+i*16.6+n%2*4,5+n*16,13.5,13);t.fillRect(56,65,120,4)}const e=new Is(s);return e.colorSpace=ke,e}function rd(s){const t=Date.UTC(s.getFullYear(),0,0),e=Date.UTC(s.getFullYear(),s.getMonth(),s.getDate());return Math.round((e-t)/864e5)}function vr(s){return String(s).padStart(2,"0")}function X_(s,t,e){if(s.measureText(t).width<=e)return t;let n=t;for(;n.length>1&&s.measureText(`${n}…`).width>e;)n=n.slice(0,-1);return`${n}…`}const Po={dreams:{angle:0,r:4.9,y:.5,style:"tv",screenW:2,channel:1},chronicle:{angle:-19.5,r:5.35,y:1.25,style:"black",screenW:1,feeds:"dreams",light:!1,channel:3},"dreams-api":{angle:19.5,r:5.35,y:1.25,style:"grey",screenW:.85,feeds:"dreams",light:!1,channel:4},transmissions:{angle:-30,r:4.5,y:.34,style:"beige",screenW:1.22,stand:!0,channel:2},afterlife:{angle:30,r:4.5,y:0,style:"black",screenW:1.08,channel:10},apeiron:{angle:-56,r:4.2,y:0,style:"black",screenW:1.15,channel:5},irc:{angle:-56,r:4.2,y:0,style:"beige",screenW:.95,on:"apeiron",channel:6},syrinx:{angle:56,r:4.2,y:.28,style:"grey",screenW:1.08,channel:7},parlor:{angle:-18,r:6.8,y:3.9,style:"beige",screenW:1.1,hang:!0,channel:9}};function Y_(s,t){const e=Po[s];if(e)return e;const n=Math.floor(t/2)+1;return{angle:(t%2?1:-1)*(68+n*10),r:5.4,y:0,style:"grey",screenW:1,channel:12+t}}const od={type:"change"},sc={type:"start"},ad={type:"end"},Lo=new no,ld=new bi,q_=Math.cos(70*Xr.DEG2RAD),Ue=new L,nn=2*Math.PI,ae={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},rc=1e-6;class K_ extends p0{constructor(t,e=null){super(t,e),this.state=ae.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:cs.ROTATE,MIDDLE:cs.DOLLY,RIGHT:cs.PAN},this.touches={ONE:hs.ROTATE,TWO:hs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new Un,this._lastTargetPosition=new L,this._quat=new Un().setFromUnitVectors(t.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Yl,this._sphericalDelta=new Yl,this._scale=1,this._panOffset=new L,this._rotateStart=new dt,this._rotateEnd=new dt,this._rotateDelta=new dt,this._panStart=new dt,this._panEnd=new dt,this._panDelta=new dt,this._dollyStart=new dt,this._dollyEnd=new dt,this._dollyDelta=new dt,this._dollyDirection=new L,this._mouse=new dt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=J_.bind(this),this._onPointerDown=Z_.bind(this),this._onPointerUp=j_.bind(this),this._onContextMenu=ry.bind(this),this._onMouseWheel=ey.bind(this),this._onKeyDown=ny.bind(this),this._onTouchStart=iy.bind(this),this._onTouchMove=sy.bind(this),this._onMouseDown=Q_.bind(this),this._onMouseMove=ty.bind(this),this._interceptControlDown=oy.bind(this),this._interceptControlUp=ay.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(od),this.update(),this.state=ae.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){const e=this.object.position;Ue.copy(e).sub(this.target),Ue.applyQuaternion(this._quat),this._spherical.setFromVector3(Ue),this.autoRotate&&this.state===ae.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=nn:n>Math.PI&&(n-=nn),i<-Math.PI?i+=nn:i>Math.PI&&(i-=nn),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Ue.setFromSpherical(this._spherical),Ue.applyQuaternion(this._quatInverse),e.copy(this.target).add(Ue),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=Ue.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new L(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new L(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Ue.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Lo.origin.copy(this.object.position),Lo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Lo.direction))<q_?this.object.lookAt(this.target):(ld.setFromNormalAndCoplanarPoint(this.object.up,this.target),Lo.intersectPlane(ld,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>rc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>rc||this._lastTargetPosition.distanceToSquared(this.target)>rc?(this.dispatchEvent(od),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?nn/60*this.autoRotateSpeed*t:nn/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Ue.setFromMatrixColumn(e,0),Ue.multiplyScalar(-t),this._panOffset.add(Ue)}_panUp(t,e){this.screenSpacePanning===!0?Ue.setFromMatrixColumn(e,1):(Ue.setFromMatrixColumn(e,0),Ue.crossVectors(this.object.up,Ue)),Ue.multiplyScalar(t),this._panOffset.add(Ue)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const i=this.object.position;Ue.copy(i).sub(this.target);let r=Ue.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),i=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=i/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(nn*this._rotateDelta.x/e.clientHeight),this._rotateUp(nn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(nn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-nn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(nn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-nn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panStart.set(n,i)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(i,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(nn*this._rotateDelta.x/e.clientHeight),this._rotateUp(nn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new dt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function Z_(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function J_(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function j_(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(ad),this.state=ae.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function Q_(s){let t;switch(s.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case cs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=ae.DOLLY;break;case cs.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=ae.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=ae.ROTATE}break;case cs.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=ae.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=ae.PAN}break;default:this.state=ae.NONE}this.state!==ae.NONE&&this.dispatchEvent(sc)}function ty(s){switch(this.state){case ae.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case ae.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case ae.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function ey(s){this.enabled===!1||this.enableZoom===!1||this.state!==ae.NONE||(s.preventDefault(),this.dispatchEvent(sc),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(ad))}function ny(s){this.enabled!==!1&&this._handleKeyDown(s)}function iy(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case hs.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=ae.TOUCH_ROTATE;break;case hs.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=ae.TOUCH_PAN;break;default:this.state=ae.NONE}break;case 2:switch(this.touches.TWO){case hs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=ae.TOUCH_DOLLY_PAN;break;case hs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=ae.TOUCH_DOLLY_ROTATE;break;default:this.state=ae.NONE}break;default:this.state=ae.NONE}this.state!==ae.NONE&&this.dispatchEvent(sc)}function sy(s){switch(this._trackPointer(s),this.state){case ae.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case ae.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case ae.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case ae.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=ae.NONE}}function ry(s){this.enabled!==!1&&s.preventDefault()}function oy(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function ay(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const ly=8;function cy(){const s=document.createElement("canvas");s.width=1024,s.height=384;const t=s.getContext("2d"),e=256,n=192;if(t){const r=a=>[a%4*e,Math.floor(a/4)*n],o=(a,l,c,h,u=26)=>{const[d,f]=r(a);t.fillStyle=h,t.fillRect(d,f,e,n),t.fillStyle=c,t.font=`${u}px "Libertinus Mono", ui-monospace, monospace`,t.textAlign="center",l.forEach((p,v)=>t.fillText(p,d+e/2,f+n/2+(v-(l.length-1)/2)*u*1.3+u*.35)),t.textAlign="left"};o(1,["NO SIGNAL"],"#ffffff","#1432c8",30);{const[a,l]=r(2);["#c0c0c0","#c0c000","#00c0c0","#00c000","#c000c0","#c00000","#0000c0"].forEach((c,h)=>{t.fillStyle=c,t.fillRect(a+h*e/7,l,e/7+1,n*.7)}),t.fillStyle="#0b0b0b",t.fillRect(a,l+n*.7,e,n*.3)}o(3,["NO CARRIER"],"#e8e8e8","#050505",22);{const[a,l]=r(4);t.fillStyle="#000",t.fillRect(a,l,e,n),t.fillStyle="#b8b8b8",t.font="18px ui-monospace, monospace",t.fillText("C:\\>_",a+16,l+34)}o(5,["VIDEO 1"],"#ffffff","#0a1a7a",30),o(6,["æ"],"#f4f1ea","#000000",110),o(7,["CLOSE THE WORLD","OPEN THE nExT"],"#ff4a4a","#070000",18)}const i=new Is(s);return i.colorSpace=ke,i}class hy{constructor(t,e,n){R(this,"group",new jn);R(this,"screens");R(this,"uniforms",{uTime:{value:0},uAtlas:{value:null},uFogColor:{value:new Bt},uFogDensity:{value:0}});this.uniforms.uFogColor.value.copy(n.color),this.uniforms.uFogDensity.value=n.density;const i=new ri(1.26,1.1,.95,2,.05);i.translate(0,.55,-.475);const r=new Zh(i,new Qe({roughness:.6,metalness:.05}),t),o=new mn(1,.75);o.translate(0,.62,.004),this.uniforms.uAtlas.value=cy();const a=new Le({uniforms:this.uniforms,vertexShader:`
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
        }`});this.screens=new Zh(o,a,t);const l=new Float32Array(t),c=new Float32Array(t),h=new Float32Array(t),u=[12168852,1513242,7172214,855311,9407100],d=new se,f=new Un,p=new Zn,v=new Bt;let m=0;for(;m<t;){const g=e()*Math.PI*2;if(-Math.cos(g)>.3)continue;const x=9+e()*13,A=Math.sin(g)*x,M=-Math.cos(g)*x,E=Math.atan2(-A,-M)+(e()-.5)*.9,b=e()<.14,P=Math.min(t-m,b?1:1+Math.floor(e()*4));let y=b?4+e()*5:0;for(let T=0;T<P;T++,m++){const I=.8+e()*.9,D=!b&&T===0&&e()<.12;p.set(D?-Math.PI/2+.1:(e()-.5)*.12,E+(e()-.5)*.35,D?0:(e()-.5)*.08),f.setFromEuler(p),d.compose(new L(A+(e()-.5)*.3,y,M+(e()-.5)*.3),f,new L(I,I,I)),r.setMatrixAt(m,d),this.screens.setMatrixAt(m,d),r.setColorAt(m,v.setHex(u[Math.floor(e()*u.length)]??3355443)),l[m]=e()<.45?0:1+Math.floor(e()*(ly-1)),c[m]=e(),h[m]=e()<.22?0:.35+e()*.65,y+=1.1*I*(D?.85:1)}}this.screens.geometry.setAttribute("aTile",new lr(l,1)),this.screens.geometry.setAttribute("aSeed",new lr(c,1)),this.screens.geometry.setAttribute("aOn",new lr(h,1)),this.group.add(r,this.screens)}update(t){this.uniforms.uTime.value=t}}const Do={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class _r{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const uy=new So(-1,1,1,-1,0,1);class dy extends He{constructor(){super(),this.setAttribute("position",new oe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new oe([0,2,0,0,2,0],2))}}const fy=new dy;class cd{constructor(t){this._mesh=new Yt(fy,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,uy)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class hd extends _r{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Le?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=_o.clone(t.uniforms),this.material=new Le({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new cd(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class ud extends _r{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class py extends _r{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class my{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new dt);this._width=n.width,this._height=n.height,e=new je(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:on}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new hd(Do),this.copyPass.material.blending=Pn,this.timer=new h0}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}ud!==void 0&&(o instanceof ud?n=!0:o instanceof py&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new dt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class gy extends _r{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Bt}render(t,e,n){const i=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=i}}const xy={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Bt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Hs extends _r{constructor(t,e=1,n,i){super(),this.strength=e,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new dt(t.x,t.y):new dt(256,256),this.clearColor=new Bt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new je(r,o,{type:on}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const u=new je(r,o,{type:on});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const d=new je(r,o,{type:on});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}const a=xy;this.highPassUniforms=_o.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Le({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new dt(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=_o.clone(Do.uniforms),this.blendMaterial=new Le({uniforms:this.copyUniforms,vertexShader:Do.vertexShader,fragmentShader:Do.fragmentShader,premultipliedAlpha:!0,blending:Ur,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Bt,this._oldClearAlpha=1,this._basic=new ii,this._fsQuad=new cd(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new dt(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=Hs.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Hs.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(t){const e=[],n=t/3;for(let i=0;i<t;i++)e.push(.39894*Math.exp(-.5*i*i/(n*n))/n);return new Le({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new dt(.5,.5)},direction:{value:new dt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`

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

				}`})}}Hs.BlurDirectionX=new dt(1,0),Hs.BlurDirectionY=new dt(0,1);const vy={uniforms:{tDiffuse:{value:null},uRes:{value:new dt(1,1)},uTime:{value:0},uTear:{value:0},uDot:{value:3},uHalftone:{value:1}},vertexShader:`
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
    }`};class _y{constructor(t,e,n){R(this,"composer");R(this,"bloom");R(this,"wired");R(this,"tear",0);this.composer=new my(t),this.composer.addPass(new gy(e,n)),this.bloom=new Hs(new dt(256,256),.7,.5,.78);for(const i of[this.bloom.renderTargetBright,...this.bloom.renderTargetsHorizontal,...this.bloom.renderTargetsVertical])i.depthBuffer=!1;this.composer.addPass(this.bloom),this.wired=new hd(vy),this.composer.addPass(this.wired)}get u(){return this.wired.uniforms}setSize(t,e,n){this.composer.setPixelRatio(n),this.composer.setSize(t,e),this.u.uRes.value.set(t*n,e*n),this.u.uDot.value=Math.max(2.5,3*n)}kick(t=1){this.tear=Math.max(this.tear,t)}setHalftone(t){this.u.uHalftone.value=t?1:0}render(t,e){this.tear=Math.max(0,this.tear-e*2.2),this.u.uTime.value=t,this.u.uTear.value=this.tear*this.tear,this.composer.render(e)}}const dd=30,yy=8,My=1.2,by=25e5,Sy=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2;function wy(){const s=document.createElement("canvas");s.width=s.height=128;const t=s.getContext("2d");if(t){const e=t.createRadialGradient(64,64,0,64,64,64);e.addColorStop(0,"rgba(255,255,255,0.9)"),e.addColorStop(.4,"rgba(255,255,255,0.3)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,128,128)}return new Is(s)}class Ey{constructor(t,e,n,i){R(this,"renderer");R(this,"scene",new bm);R(this,"camera",new tn(45,1,.05,160));R(this,"controls");R(this,"post");R(this,"core",new W_);R(this,"field");R(this,"sky");R(this,"stations",new Map);R(this,"pickables",[]);R(this,"raycaster",new d0);R(this,"pointer",new dt(-9,-9));R(this,"pointerPx",{x:0,y:0});R(this,"pointerDirty",!1);R(this,"hovered",null);R(this,"focused",null);R(this,"tween",null);R(this,"playing",null);R(this,"settlePlay",null);R(this,"tuneSeq",0);R(this,"lastAspect",0);R(this,"later",[]);R(this,"clock",new f0);R(this,"t",0);R(this,"running",!1);R(this,"raf",0);R(this,"lastInput",0);R(this,"swayDir",1);R(this,"pixelRatio");R(this,"maxPixelRatio");R(this,"frameTimes",[]);R(this,"qualityStep",0);R(this,"shift",{x:0,y:0});R(this,"tuned",null);R(this,"shiftTarget",{x:0,y:0});R(this,"reduced");R(this,"lowPower");R(this,"speed",Math.min(10,Math.max(1,Number(new URLSearchParams(location.search).get("speed"))||1)));R(this,"driven",new URLSearchParams(location.search).has("drive"));R(this,"perf",{frames:0,rendered:0,paint:0,render:0,uploads:0});R(this,"frustum",new fo);R(this,"viewProj",new se);R(this,"kept",null);R(this,"calm",0);R(this,"paceSum",0);R(this,"visibility","full");R(this,"contextLost",!1);R(this,"sinceRender",0);R(this,"lastStep",0);R(this,"ticks",0);this.container=t,this.events=i,this.reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,this.lowPower=matchMedia("(pointer: coarse)").matches||Math.min(innerWidth,innerHeight)<600,this.maxPixelRatio=this.pixelCap(),this.pixelRatio=this.maxPixelRatio,this.renderer=new P_({antialias:!1,powerPreference:"default"}),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.toneMapping=_a,this.renderer.toneMappingExposure=1.1,this.renderer.outputColorSpace=ke,this.renderer.domElement.id="oikos-gl",this.renderer.domElement.setAttribute("role","img"),this.renderer.domElement.setAttribute("aria-label","a dark room full of screens, each one a place on æthera"),t.prepend(this.renderer.domElement),this.bindContext();try{this.build(e,n)}catch(r){throw this.renderer.domElement.remove(),this.renderer.dispose(),this.renderer.forceContextLoss(),r}}build(t,e){this.scene.background=new Bt(0),this.scene.fog=new yl(new Bt().setRGB(.049,.0063,.0089,tr),.042),this.sky=G_(),this.scene.add(this.sky),this.scene.add(new n0(4866648,393988,.8));const n=new a0(9082040,.35);n.position.set(-4,10,-6),this.scene.add(n);const i=new s0(14212351,9,7,.42,.65,1.6);i.position.set(.4,4.6,1.2),i.target.position.set(-.05,en+.3,.15),this.scene.add(i,i.target);const r=new $l(10466303,2.2,4.5,2);r.position.set(-.4,1.35,2.3),this.scene.add(r);const o=new $l(11735583,1.6,4,2);o.position.set(0,.25,1.4),this.scene.add(o),this.buildFloor(),this.scene.add(this.core.group),this.pickables.push(this.core.hit),this.core.hit.userData.pick="vcr",this.scene.add(H_());const a=Ui(1998);this.field=new hy(this.lowPower?40:90,a,this.scene.fog),this.scene.add(this.field.group),this.buildStations(t,e,a),this.controls=new K_(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.enablePan=!1,this.controls.rotateSpeed=.28,this.controls.zoomSpeed=.6,this.controls.addEventListener("start",()=>this.lastInput=this.t),this.post=new _y(this.renderer,this.scene,this.camera),this.resize();const l=this.homePose();this.camera.position.copy(l.pos),this.controls.target.copy(l.target),this.applyLimits(null),this.controls.update(),this.bindPointer(),addEventListener("resize",()=>this.resize())}buildFloor(){const t=document.createElement("canvas");t.width=t.height=512;const e=t.getContext("2d");if(e){e.fillStyle="#0c0b0d",e.fillRect(0,0,512,512),e.strokeStyle="rgba(120,110,130,0.10)",e.lineWidth=2;for(let r=0;r<=512;r+=128)e.beginPath(),e.moveTo(r,0),e.lineTo(r,512),e.moveTo(0,r),e.lineTo(512,r),e.stroke();for(let r=0;r<900;r++)e.fillStyle=`rgba(${Math.random()<.3?"120,20,30":"90,90,100"},${Math.random()*.12})`,e.fillRect(Math.random()*512,Math.random()*512,2,2)}const n=new Is(t);n.wrapS=n.wrapT=kr,n.repeat.set(24,24),n.colorSpace=ke,n.anisotropy=8;const i=new Yt(new mn(96,96),new Qe({map:n,roughness:.82,metalness:.15}));i.rotation.x=-Math.PI/2,this.scene.add(i)}buildStations(t,e,n){const i=new Qe({color:1315086,roughness:.85}),r=new Qe({color:657930,roughness:.6}),o=wy(),a=new L,l=new Map,c=t.map((u,d)=>({site:u,i:d,p:Y_(u.id,d)}));c.sort((u,d)=>+!!u.p.on-+!!d.p.on);let h=0;for(const{site:u,p:d}of c){if(u.screen===!1)continue;const f=e.get(u.id);if(!f)continue;const p=new td({style:d.style,screenW:d.screenW,screen:f.canvas,label:u.title,accent:u.accent,seed:Math.floor(n()*1e3),stand:d.stand}),v=Xr.degToRad(d.angle),m=d.on?l.get(d.on):void 0;if(m)p.group.position.copy(m.group.position),p.group.position.y+=m.height,p.group.rotation.copy(m.group.rotation),p.group.rotateY((n()-.5)*.12),p.group.translateZ(-(m.depth-p.depth)*.3);else{p.group.position.set(Math.sin(v)*d.r,d.y,-Math.cos(v)*d.r);const D=new L(0,d.hang?1.3:p.group.position.y+.6,.6);p.group.lookAt(D),d.hang||(p.group.rotation.set(0,Math.atan2(-p.group.position.x,.6-p.group.position.z),0),p.group.rotateY((n()-.5)*.1))}if(this.scene.add(p.group),l.set(u.id,p),!d.hang&&!d.on&&d.y>.01){const D=new Yt(new Tn(p.width*.92,d.y,p.depth*.9),i);D.position.set(0,-d.y/2,-p.depth*.45),p.group.add(D)}if(d.hang){const D=p.world(p.topLocal),N=new Yt(new Ns(.008,.008,16,5),r);N.position.set(D.x,D.y+8,D.z),this.scene.add(N)}const g=-.5+h++*.37%1;a.set(g,this.core.rearY-.05,this.core.rearZ-.01);const x=p.world(p.portLocal),A=p.normal().multiplyScalar(-1).setY(0).normalize();let M;const E=d.feeds?l.get(d.feeds):void 0;if(E){const D=E.world(E.portLocal.clone().add(new L(-.25,.15,0))),N=new L().lerpVectors(x,D,.5);N.y=Math.min(x.y,D.y)-.6,M=[x,x.clone().addScaledVector(A,.3).setY(x.y-.2),N,D.clone().add(new L(0,.3,-.3)),D]}else M=B_(x,A,a,sd,en,n);const b=new ed(M,d.hang?.014:.02,u.accent);this.scene.add(b.mesh);const P=new Yt(new mn(d.screenW*2.6,d.screenW*2.2),new ii({map:o,color:u.accent,transparent:!0,opacity:0,depthWrite:!1,blending:Ur,fog:!0})),y=p.normal().setY(0).normalize(),T=p.world(p.screenLocal).addScaledVector(y,d.screenW*.9);P.position.set(T.x,.012,T.z),P.rotation.x=-Math.PI/2,P.rotation.z=Math.atan2(y.x,y.z),d.hang||this.scene.add(P);let I=null;!this.lowPower&&d.light!==!1&&(I=new $l(u.accent,0,3.2+d.screenW,2),I.position.copy(p.world(p.screenLocal).addScaledVector(p.normal(),1.1)),this.scene.add(I)),p.hit.userData.pick=u.id,this.pickables.push(p.hit),this.stations.set(u.id,{site:u,screen:f,monitor:p,placement:d,cable:b,glow:P,light:I,tickedAt:0,power:0,powerAt:1/0,staticLeft:0,hover:0})}}homePose(){const t=this.camera.aspect,e=t<1,n=e?7.2+(1-t)*2.4:7.8;return{pos:new L(0,e?2.5:2.4,n),target:new L(0,e?1.7:1.95,-1.6)}}posesFor(t){if(t==="vcr"){const c=this.camera.aspect<1,h=this.core.screenWorld();return{pos:new L(h.x+.25,h.y+.35,c?3.4:2.5),target:h.clone().setY(h.y-.08)}}const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.world(n.screenLocal),r=n.normal(),o=Xr.degToRad(this.camera.fov),a=2*Math.atan(Math.tan(o/2)*this.camera.aspect),l=Math.max(n.screenH/2/Math.tan(o/2)/.46,n.screenH/.75/2/Math.tan(a/2)/.7);return{pos:i.clone().addScaledVector(r,l+.05),target:i}}applyLimits(t){const e=this.controls;if(!t){e.minDistance=3,e.maxDistance=15,e.minAzimuthAngle=-.8,e.maxAzimuthAngle=.8,e.minPolarAngle=.95,e.maxPolarAngle=1.56;return}const n=new L().subVectors(this.camera.position,e.target),i=new Yl().setFromVector3(n);e.minDistance=i.radius*.45,e.maxDistance=i.radius*1.7,e.minAzimuthAngle=i.theta-.6,e.maxAzimuthAngle=i.theta+.6,e.minPolarAngle=Math.max(.3,i.phi-.45),e.maxPolarAngle=Math.min(1.6,i.phi+.35)}flyTo(t,e,n){this.controls.enabled=!1,this.controls.minAzimuthAngle=-1/0,this.controls.maxAzimuthAngle=1/0,this.tween={from:{pos:this.camera.position.clone(),target:this.controls.target.clone()},to:t,k:0,dur:this.reduced?.01:e,done:n}}focus(t){const e=t?this.posesFor(t):this.homePose();if(e){this.cancelPlay(),this.focused=t;for(const[n,i]of this.stations)i.cable.setLit(n===t?1:0);this.flyTo(e,t?1.15:1.3,()=>{this.applyLimits(t),this.controls.enabled=!this.tuned,this.controls.update()})}}get focusedId(){return this.focused}keepAlive(t){this.kept=t}setVisibility(t){t!==this.visibility&&(this.visibility=t,this.frameTimes=[],this.paceSum=0)}get busy(){return this.playing!==null}cancelPlay(){this.playing=null;const t=this.settlePlay;this.settlePlay=null,t==null||t(!1)}play(t){const e=this.stations.get(t),n=this.posesFor(t);if(!e||!n)return Promise.resolve(!0);this.cancelPlay();const i=new Promise(c=>this.settlePlay=c);this.core.load(e.site.title),this.core.display.play(e.placement.channel,e.site.title,this.t),this.focused=t,this.playing=t;for(const[c,h]of this.stations)h.cable.setLit(c===t?1:0);const r=()=>{this.playing===t&&(e.staticLeft=.9,this.post.kick(.7),this.flyTo(n,1.15,()=>{if(this.playing!==t)return;this.playing=null,this.applyLimits(t),this.controls.enabled=!this.tuned,this.controls.update();const c=this.settlePlay;this.settlePlay=null,c==null||c(!0)}))};if(this.reduced)return r(),i;const o=Math.sign(e.monitor.group.position.x)||1,a=this.camera.aspect<1,l={pos:new L(o*.45,1.4,a?3.1:2.25),target:this.core.screenWorld()};return this.flyTo(l,.8,()=>{this.playing===t&&(e.cable.surge(),this.after(.35,r))}),i}after(t,e){this.later.push({at:this.t+t,fn:e})}eject(){this.core.load(null),this.core.display.stop()}scroll(t){this.core.display.scroll(t,this.t)}dive(t){const e=this.stations.get(t);if(!e||this.reduced)return Promise.resolve();this.cancelPlay();const n=e.monitor,i=n.world(n.screenLocal),r=i.clone().addScaledVector(n.normal(),n.screenH*.16);return e.staticLeft=.8,this.post.kick(1),new Promise(o=>this.flyTo({pos:r,target:i},.75,o))}powerOn(){let t=0;const e=[...this.stations.values()].sort((n,i)=>n.placement.channel-i.placement.channel);for(const n of e)n.powerAt=this.t+.25+t++*(this.reduced?0:.14)}anchor(t){let e;if(t==="vcr")e=this.core.screenWorld().add(new L(0,-.32,.45));else{const i=this.stations.get(t);if(!i)return null;e=i.monitor.world(i.monitor.screenLocal.clone().add(new L(0,i.monitor.screenH*.5,0)))}if(e.project(this.camera),e.z>1)return null;const n=this.renderer.domElement.getBoundingClientRect();return{x:n.left+(e.x+1)/2*n.width,y:n.top+(1-e.y)/2*n.height}}setShift(t,e){this.shiftTarget={x:t,y:e}}applyShift(t){this.tuned&&(this.shiftTarget={x:0,y:0});const e=this.reduced?1:Math.min(1,t*5),n=this.shift.x+(this.shiftTarget.x-this.shift.x)*e,i=this.shift.y+(this.shiftTarget.y-this.shift.y)*e;if(Math.abs(n-this.shift.x)<.05&&Math.abs(i-this.shift.y)<.05&&this.camera.view)return;this.shift={x:n,y:i};const r=this.container.clientWidth||innerWidth,o=this.container.clientHeight||innerHeight;this.camera.setViewOffset(r,o,n,i,r,o)}tuneIn(t,e){const n=this.stations.get(t),i=this.tunePose(t);if(!n||!i)return Promise.resolve();this.tuneOut(),this.cancelPlay();const r=this.tuneSeq;this.focused=t,this.shiftTarget={x:0,y:0};for(const[o,a]of this.stations)a.cable.setLit(o===t?1:0);return new Promise(o=>this.flyTo(i,1.1,()=>{if(r!==this.tuneSeq){this.applyLimits(t),this.controls.enabled=!0;return}this.tuned={id:t,place:e},n.staticLeft=0,this.resize(),o()}))}tunePose(t){const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.screenH/.75,r=n.world(n.screenLocal),o=Xr.degToRad(this.camera.fov),a=2*Math.atan(Math.tan(o/2)*this.camera.aspect),l=Math.max(n.screenH/2/Math.tan(o/2)/.84,i/2/Math.tan(a/2)/.94);return{pos:r.clone().addScaledVector(n.normal(),l),target:r}}tuneOut(){this.tuneSeq++,this.tuned&&(this.tuned=null,this.tween||(this.applyLimits(this.focused),this.controls.enabled=!0))}reset(){this.tuneOut(),this.cancelPlay(),this.focus(null)}glassRect(t){const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.screenH/.75,r=this.renderer.domElement.getBoundingClientRect(),o=[],a=[];this.camera.updateMatrixWorld();for(const[h,u]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const d=n.world(n.screenLocal.clone().add(new L(h*i/2,u*n.screenH/2,i*.02)));d.project(this.camera),o.push(r.left+(d.x+1)/2*r.width),a.push(r.top+(1-d.y)/2*r.height)}const l=Math.min(...o),c=Math.min(...a);return new DOMRectReadOnly(l,c,Math.max(...o)-l,Math.max(...a)-c)}get tunedId(){var t;return((t=this.tuned)==null?void 0:t.id)??null}bindPointer(){const t=this.renderer.domElement;let e=null,n=null;const i=()=>{this.pointer.set(-9,-9),this.pointerDirty=!0};t.addEventListener("pointermove",r=>{if(this.lastInput=this.t,r.pointerType==="touch")return;const o=t.getBoundingClientRect();this.pointer.set((r.clientX-o.left)/o.width*2-1,-((r.clientY-o.top)/o.height)*2+1),this.pointerPx={x:r.clientX,y:r.clientY},this.pointerDirty=!0}),t.addEventListener("pointerleave",i),t.addEventListener("pointerdown",r=>{if(n=null,r.button!==0||!r.isPrimary){e=null;return}e={x:r.clientX,y:r.clientY,t:performance.now()},this.lastInput=this.t}),t.addEventListener("pointerup",r=>{if(!e)return;const o=Math.hypot(r.clientX-e.x,r.clientY-e.y),a=performance.now()-e.t<600;e=null,r.pointerType==="touch"&&i(),!(o>7||!a||this.tuned)&&(n={x:r.clientX,y:r.clientY,touch:r.pointerType==="touch"})}),t.addEventListener("pointercancel",()=>{e=null,n=null}),t.addEventListener("click",()=>{const r=n;if(n=null,!r||this.tuned)return;const o=t.getBoundingClientRect(),a=this.pointer.clone();this.pointer.set((r.x-o.left)/o.width*2-1,-((r.y-o.top)/o.height)*2+1);const l=this.pickAt();r.touch?this.pointer.set(-9,-9):this.pointer.copy(a),this.events.pick(l)})}pickFromPoint(t,e){const n=this.renderer.domElement.getBoundingClientRect(),i=this.pointer.clone();this.pointer.set((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);const r=this.pickAt();return this.pointer.copy(i),r}pickAt(){this.raycaster.setFromCamera(this.pointer,this.camera);const t=this.raycaster.intersectObjects(this.pickables,!1)[0];return(t==null?void 0:t.object.userData.pick)??null}resize(){const t=this.container.clientWidth||innerWidth,e=this.container.clientHeight||innerHeight,n=Math.abs(t/e-this.lastAspect)>.02;this.lastAspect=t/e,this.camera.aspect=t/e,this.camera.fov=this.camera.aspect<1?58:45,this.camera.setViewOffset(t,e,this.shift.x,this.shift.y,t,e);const i=this.pixelCap();if(Math.abs(i-this.maxPixelRatio)>.001&&(this.maxPixelRatio=i,this.pixelRatio=Math.max(Math.min(.6,i),i*Math.pow(.8,this.qualityStep)),this.renderer.setPixelRatio(this.pixelRatio)),this.renderer.setSize(t,e,!1),this.renderer.domElement.style.width=`${t}px`,this.renderer.domElement.style.height=`${e}px`,this.post.setSize(t,e,this.pixelRatio),this.tuned){this.shift={x:0,y:0},this.camera.setViewOffset(t,e,0,0,t,e);const r=this.tunePose(this.tuned.id);r&&(this.camera.position.copy(r.pos),this.controls.target.copy(r.target),this.camera.lookAt(r.target));const o=this.glassRect(this.tuned.id);o&&this.tuned.place(o)}if(n&&!this.tween&&!this.focused&&this.controls){const r=this.homePose();this.camera.position.copy(r.pos),this.controls.target.copy(r.target)}}async warm(t=5e3){try{await Promise.race([this.renderer.compileAsync(this.scene,this.camera),new Promise(e=>setTimeout(e,t))]),this.post.render(0,0)}catch(e){console.warn("oikos: warm-up skipped",e)}}start(){if(this.running)return;if(this.running=!0,this.clock.getDelta(),this.driven){const e=this.renderer.getContext();window.__oikos={step:(n=1,i=1/30)=>{var r;this.perf={frames:0,rendered:0,paint:0,render:0,uploads:0};for(let o=0;o<n;o++)this.frame(i),e.finish();return{...this.perf,t:this.t,focused:this.focused,hovered:this.hovered,tuned:((r=this.tuned)==null?void 0:r.id)??null}},anchor:n=>this.anchor(n),glass:n=>this.glassRect(n)};return}new URLSearchParams(location.search).has("perf")&&(window.__oikosPerf=()=>({...this.perf,running:this.running})),this.lastStep=0,this.ticks=0,this.frameTimes=[],this.paceSum=0;const t=e=>{this.running&&(this.raf=requestAnimationFrame(t),this.ticks++,!(this.lastStep&&e-this.lastStep<this.minInterval()*1e3-4)&&(this.lastStep=e,this.frame()))};this.raf=requestAnimationFrame(t)}minInterval(){const t=this.tween!==null||this.later.length>0||this.t-this.lastInput<My;return this.visibility==="full"&&!this.contextLost?t?0:1/dd:t||this.kept?1/dd:.25}pixelCap(){const t=this.container.clientWidth||innerWidth,e=this.container.clientHeight||innerHeight,n=Math.min(devicePixelRatio||1,this.lowPower?1.25:1.6);return Math.min(n,Math.sqrt(by/Math.max(1,t*e)))}bindContext(){const t=this.renderer.domElement,e=n=>{var i,r;try{(r=(i=this.events).context)==null||r.call(i,n)}catch(o){console.warn("oikos: context listener failed",o)}};t.addEventListener("webglcontextlost",n=>{n.preventDefault(),!this.contextLost&&(this.contextLost=!0,t.style.visibility="hidden",console.warn("oikos: the GPU took the room away; waiting for it back"),e(!1))}),t.addEventListener("webglcontextrestored",()=>{if(this.contextLost){this.contextLost=!1,t.style.visibility="";try{for(const n of this.stations.values())n.monitor.texture.needsUpdate=!0;this.frameTimes=[],this.paceSum=0}catch(n){console.warn("oikos: restoring the room",n)}e(!0)}})}stop(){this.running=!1,cancelAnimationFrame(this.raf)}adapt(t,e=t){this.frameTimes.push(t),this.paceSum+=e;const n=this.frameTimes.reduce((o,a)=>o+a,0);if(this.frameTimes.length<90&&n<2)return;const i=n/this.frameTimes.length,r=this.paceSum/this.frameTimes.length;if(this.frameTimes=[],this.paceSum=0,this.calm=r<1/50?this.calm+1:0,this.calm>=3&&this.qualityStep>0){this.calm=0,this.qualityStep--,this.pixelRatio=Math.min(this.maxPixelRatio,this.pixelRatio/.8),this.post.bloom.enabled=!0,this.applyPixelRatio();return}i>1/27&&this.qualityStep<3&&(this.qualityStep++,this.pixelRatio=Math.max(Math.min(.6,this.maxPixelRatio),this.pixelRatio*.8),this.qualityStep>=3&&(this.post.bloom.enabled=!1),this.applyPixelRatio())}applyPixelRatio(){this.renderer.setPixelRatio(this.pixelRatio);const t=this.container.clientWidth||innerWidth,e=this.container.clientHeight||innerHeight;this.renderer.setSize(t,e,!1),this.post.setSize(t,e,this.pixelRatio)}frame(t){var c;const e=t??this.clock.getDelta(),n=Math.min(e,.1)*this.speed;this.t+=n;const i=this.t;this.sinceRender+=n;const r=this.shouldRender();if(r&&!this.driven&&this.visibility==="full"){const h=Math.max(1,this.ticks);this.ticks=0,this.adapt(Math.min(e,.5),Math.min(e,.5)/h)}if(this.applyShift(n),this.later.length){const h=this.later.filter(u=>u.at<=i);this.later=this.later.filter(u=>u.at>i);for(const u of h)u.fn()}if(this.tween){const h=this.tween;h.k=Math.min(1,h.k+n/h.dur);const u=Sy(h.k);this.camera.position.lerpVectors(h.from.pos,h.to.pos,u),this.controls.target.lerpVectors(h.from.target,h.to.target,u),this.camera.lookAt(this.controls.target),h.k>=1&&(this.tween=null,(c=h.done)==null||c.call(h))}else{if(!this.focused&&!this.reduced&&i-this.lastInput>9){this.controls.autoRotate=!0;const h=this.controls.getAzimuthalAngle();h>.32&&(this.swayDir=1),h<-.32&&(this.swayDir=-1),this.controls.autoRotateSpeed=.18*this.swayDir}else this.controls.autoRotate=!1;this.controls.update(n)}if(this.pointerDirty&&!this.tween){this.pointerDirty=!1;const h=this.pickAt();h!==this.hovered&&(this.hovered=h,this.renderer.domElement.style.cursor=h?"pointer":""),this.events.hover(h,this.pointerPx.x,this.pointerPx.y)}if(!r){const h=this.kept?this.stations.get(this.kept):void 0;h&&h.power>.2&&this.tickScreen(h,i,this.focused===this.kept,1);return}const o=Math.min(this.sinceRender,.25);this.sinceRender=0;const a=performance.now();this.camera.updateMatrixWorld(),this.viewProj.multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.viewProj);for(const[h,u]of this.stations){i>=u.powerAt&&(u.power=Math.min(1,u.power+o/(this.reduced?.01:.8))),u.staticLeft=Math.max(0,u.staticLeft-o),u.hover+=((h===this.hovered?1:0)-u.hover)*Math.min(1,o*8);const d=u.monitor.crt.uniforms;d.uTime.value=i,d.uPower.value=u.power,d.uHover.value=u.hover,d.uStatic.value=Math.min(1,u.staticLeft*1.6);const f=this.focused===h,p=f||h===this.kept||this.frustum.intersectsObject(u.monitor.glass),v=this.focused&&this.focused!=="vcr"&&!f&&h!==this.kept?.5:1;u.power>.2&&p&&this.tickScreen(u,i,f,v),u.monitor.setLed(u.power>.5,u.site.accent);const m=u.glow.material;m.opacity=u.power*(.16+u.hover*.12+(f?.1:0)),u.light&&(u.light.intensity=u.power*(2.2+u.hover*1.4+(f?.6:0))),u.cable.update(i,o)}this.core.update(i,o,this.hovered==="vcr"),this.field.update(i);const l=performance.now();if(this.post.render(i,o),this.driven){this.renderer.getContext().finish();const h=performance.now();this.perf.frames++,this.perf.paint+=l-a,this.perf.render+=h-l}this.perf.rendered++}shouldRender(){return this.contextLost||this.visibility==="hidden"?!1:this.visibility==="glimpsed"?this.sinceRender>=1/yy-.001:!0}tickScreen(t,e,n,i){const r=Math.min(.25,Math.max(0,e-t.tickedAt));t.tickedAt=e,t.screen.tick(e,r,n,i,t.site.id===this.kept)&&(t.monitor.texture.needsUpdate=!0,this.perf.uploads++)}}let Ty=0;const Ay=s=>`${s}${++Ty}`,Cy="/static/oikos/mark.png",ue="#ffb347",Ge="rgba(255,179,71,.75)",Ai="rgba(255,179,71,.4)",_e="#1c0e0b",Ry="#2a1612",An="#8fe3ec",oc="#ff6a5a",Io="#7dff6a";function ge(s,t){return`<svg viewBox="0 0 ${s} ${s}" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`}function fd(s,t=""){const e=Ay("gl");return ge(48,`<defs><radialGradient id="${e}" cx=".42" cy=".38" r=".8"><stop offset="0" stop-color="${s}" stop-opacity="1"/><stop offset=".75" stop-color="${s}" stop-opacity=".55"/><stop offset="1" stop-color="${s}" stop-opacity=".25"/></radialGradient></defs>
<rect x="5" y="7" width="38" height="29" rx="4" fill="${_e}" stroke="${Ge}" stroke-width="1.6"/>
<rect x="9.5" y="11" width="29" height="21" rx="3" fill="url(#${e})"/>
<path d="M9.5 15.5h29M9.5 20h29M9.5 24.5h29M9.5 29h29" stroke="#000" stroke-opacity=".18" stroke-width="1"/>
<path d="M12 13.5h8" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/>
<path d="M18 36l-2.5 5h17L30 36" fill="${_e}" stroke="${Ge}" stroke-width="1.6"/>
<circle cx="39.5" cy="33.5" r=".9" fill="${s}" stroke="none"/>`)}const On=fd;function yr(){return ge(48,`<path d="M5 13h13l4 4h21v22H5z" fill="${_e}" stroke="${Ge}" stroke-width="1.6"/>
<path d="M5 20h38" stroke="${Ai}" stroke-width="1.2"/>
<path d="M17 31c2.4-3.4 4.8-3.4 7 0s4.6 3.4 7 0" stroke="${ue}" stroke-width="2.2"/>`)}function Py(){return ge(48,`<rect x="4" y="8" width="26" height="21" rx="3" fill="${_e}" stroke="${Ge}" stroke-width="1.6"/>
<rect x="7.5" y="11.5" width="19" height="14" rx="2" fill="${ue}" fill-opacity=".22" stroke="${Ai}"/>
<path d="M10 15h8M10 18.5h11M10 22h6" stroke="${ue}" stroke-width="1.3"/>
<path d="M13 29l-1.5 4h11L21 29" stroke="${Ge}" stroke-width="1.6"/>
<rect x="33" y="10" width="11" height="28" rx="1.5" fill="${_e}" stroke="${Ge}" stroke-width="1.6"/>
<path d="M35.5 15h6M35.5 18h6" stroke="${Ai}" stroke-width="1.2"/>
<circle cx="38.5" cy="32" r="1.4" fill="${Io}" stroke="none"/>
<path d="M24 36c3 4 9 4 12 2" stroke="${Ai}" stroke-width="1.2"/>`)}function ac(){return ge(48,`<circle cx="24" cy="24" r="17" fill="${_e}" stroke="${An}" stroke-opacity=".8" stroke-width="1.6"/>
<ellipse cx="24" cy="24" rx="7.5" ry="17" stroke="${An}" stroke-opacity=".55" stroke-width="1.2"/>
<path d="M7 24h34M10 15h28M10 33h28" stroke="${An}" stroke-opacity=".45" stroke-width="1.2"/>`)}function Ly(){return ge(16,`<rect x="1" y="2.5" width="6" height="5" rx="1" fill="${_e}" stroke="${ue}" stroke-width="1.1"/>
<rect x="9" y="8.5" width="6" height="5" rx="1" fill="${_e}" stroke="${ue}" stroke-width="1.1"/>
<path d="M4 7.5v3.5h5" stroke="${ue}" stroke-width="1.1"/>
<circle cx="12" cy="11" r="1" fill="${Io}" stroke="none"/>`)}function pd(s){const t=s?"#ff7a5c":ue;return ge(16,`<path d="M10.5 2.2a6 6 0 1 0 3.3 9.6A5 5 0 0 1 10.5 2.2z" fill="${s?t:"none"}" fill-opacity="${s?".85":"0"}" stroke="${t}" stroke-width="1.2"/>
${s?`<circle cx="12.8" cy="12.8" r="1.8" fill="${oc}" stroke="none"/>`:""}`)}function md(s){return ge(24,`<circle cx="12" cy="12" r="9.5" fill="${_e}" stroke="${Ge}" stroke-width="1.4"/><path d="${s==="back"?"M13.5 7.5L9 12l4.5 4.5":"M10.5 7.5L15 12l-4.5 4.5"}" stroke="${ue}" stroke-width="2"/>`)}const Dy=()=>md("back"),Iy=()=>md("fwd");function Uy(){return ge(24,`<path d="M2.5 6.5h6l2 2h11v12h-19z" fill="${_e}" stroke="${Ge}" stroke-width="1.3"/>
<path d="M12 18v-6.5M9 14l3-3 3 3" stroke="${ue}" stroke-width="1.8"/>`)}function Ny(){return ge(24,`<circle cx="10" cy="10" r="6" fill="${_e}" stroke="${Ge}" stroke-width="1.6"/><path d="M14.5 14.5l6 6" stroke="${ue}" stroke-width="2.2"/><path d="M7.5 8.5a3 3 0 0 1 2.5-2" stroke="#fff" stroke-opacity=".35" stroke-width="1.1"/>`)}function ky(){return ge(24,`<path d="M1.5 4.5h5l2 2h7.5v7.5h-14.5z" fill="${_e}" stroke="${Ai}" stroke-width="1.2"/>
<path d="M7.5 10.5h5l2 2h8v8.5h-15z" fill="${_e}" stroke="${Ge}" stroke-width="1.3"/>`)}function Fy(){return ge(18,`<rect x="1.5" y="1.5" width="15" height="15" rx="1" stroke="${An}" stroke-opacity=".75" stroke-width="1.2"/><path d="M5 9h7M9 5.5L12.5 9 9 12.5" stroke="${An}" stroke-width="1.6"/>`)}function gd(){return ge(16,`<rect x="1" y="2" width="10.5" height="8.5" rx="1.2" fill="${_e}" stroke="${Ge}" stroke-width="1.1"/><circle cx="11" cy="11" r="2.7" fill="${_e}" stroke="${ue}" stroke-width="1.2"/><path d="M13 13l2.3 2.3" stroke="${ue}" stroke-width="1.5"/>`)}function Oy(){return ge(16,`<rect x="1" y="3.5" width="14" height="10" rx="2" fill="${_e}" stroke="${Ge}" stroke-width="1.1"/><rect x="2.8" y="5.2" width="8.5" height="6.6" rx="1.4" fill="${ue}" fill-opacity=".3"/><path d="M5 1.2l3 2.3 3-2.3" stroke="${Ai}" stroke-width="1"/><circle cx="13" cy="7" r=".7" fill="${ue}" stroke="none"/><circle cx="13" cy="9.8" r=".7" fill="${ue}" stroke="none"/>`)}function By(){return ge(16,`<rect x="2" y="1.5" width="8" height="10" rx="1" fill="${_e}" stroke="${Ai}" stroke-width="1.1"/><rect x="6" y="4.5" width="8" height="10" rx="1" fill="${_e}" stroke="${Ge}" stroke-width="1.1"/><path d="M8 8h4M8 10h4M8 12h3" stroke="${ue}" stroke-opacity=".7" stroke-width=".9"/>`)}function Uo(s){const t=s==="xml"?"#ff8a3d":An;return ge(48,`<path d="M11 4h19l8 8v32H11z" fill="${_e}" stroke="${Ge}" stroke-width="1.6"/>
<path d="M30 4v8h8" stroke="${Ge}" stroke-width="1.6"/>
<path d="M16 18h16M16 23h16M16 28h12" stroke="${ue}" stroke-opacity=".45" stroke-width="1.3"/>
<rect x="13" y="34" width="22" height="8" fill="${t}" fill-opacity=".14" stroke="${t}" stroke-opacity=".8" stroke-width="1"/>
<text x="24" y="40.4" font-size="6.6" font-family="'IBM Plex Mono',ui-monospace,monospace" font-weight="500" text-anchor="middle" fill="${t}" stroke="none">${Gy(s.toUpperCase())}</text>`)}function xd(){return ge(16,`<circle cx="8" cy="8" r="6.6" fill="${_e}" stroke="${ue}" stroke-width="1.2"/><path d="M8 7.2v4.3" stroke="${ue}" stroke-width="1.6"/><circle cx="8" cy="4.8" r="1" fill="${ue}" stroke="none"/>`)}function vd(){return ge(22,`<path d="M11 4v7" stroke="${oc}" stroke-width="2"/><path d="M7 6.8a6.3 6.3 0 1 0 8 0" stroke="${oc}" stroke-width="1.8"/>`)}function zy(){return ge(22,`<path d="M14 4a7.3 7.3 0 1 0 4.8 10.6A6.2 6.2 0 0 1 14 4z" stroke="${ue}" stroke-width="1.7"/>`)}function _d(){return ge(22,`<circle cx="7.5" cy="11" r="3.6" stroke="${ue}" stroke-width="1.7"/><path d="M11.1 11h8M16 11v3M18.6 11v2.3" stroke="${ue}" stroke-width="1.7"/>`)}function Hy(){return ge(18,`<rect x="1.5" y="1.5" width="15" height="15" rx="1" stroke="${Ge}" stroke-width="1.2"/><path d="M7 5l5 4-5 4z" fill="${ue}" stroke="none"/>`)}function yd(){return ge(22,`<path d="M16.5 7.5a6.3 6.3 0 1 0 1 5.5" stroke="${Io}" stroke-width="1.8"/><path d="M17.5 3.5v4.5H13" stroke="${Io}" stroke-width="1.8"/>`)}function No(s,t=!1){return`<img src="${Cy}" alt="" width="${s}" height="${s}" style="width:${s}px;height:${s}px;${t?"filter:invert(1);":""}">`}function Gy(s){return s.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]??t)}function Ci(s="app"){return s==="status"?ge(16,`<rect x="1.5" y="2.5" width="13" height="9" rx="1" fill="${_e}" stroke="${Ge}" stroke-width="1.1"/><path d="M4 5.5h5M4 8h3" stroke="${An}" stroke-width="1.1"/><path d="M5.5 13.5h5" stroke="${Ai}" stroke-width="1.1"/>`):s==="channel"?ge(16,`<path d="M1.5 2.5h11a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1H6l-3 2.8v-2.8H1.5a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" fill="${_e}" stroke="${An}" stroke-opacity=".85" stroke-width="1.1"/><path d="M5 4.5l-1 4M8 4.5l-1 4M3.5 5.8h5.5M3 7.6h5.5" stroke="${An}" stroke-width=".9"/>`):ge(24,`<path d="M2 3h12.5A1.5 1.5 0 0 1 16 4.5v6.5a1.5 1.5 0 0 1-1.5 1.5H8l-4 3.5v-3.5H2A1.5 1.5 0 0 1 .5 11V4.5A1.5 1.5 0 0 1 2 3z" fill="${Ry}" stroke="${ue}" stroke-width="1.3"/>
<path d="M10 10h11.5A1.5 1.5 0 0 1 23 11.5v6a1.5 1.5 0 0 1-1.5 1.5H20v3.5L16 19h-6a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 10 10z" fill="${_e}" stroke="${An}" stroke-width="1.3"/>
<path d="M3.5 6.5h8M3.5 9h5" stroke="${ue}" stroke-opacity=".8" stroke-width="1.1"/>
<path d="M12 13.5h8M12 16h5" stroke="${An}" stroke-opacity=".8" stroke-width="1.1"/>`)}const Vy="(max-width: 720px), (max-height: 500px) and (pointer: coarse)";let Md=null;function Mr(){try{return Md??(Md=matchMedia(Vy)),Md.matches}catch{return innerWidth<=720}}let lc=!1;addEventListener("keydown",s=>{["Shift","Control","Alt","Meta"].includes(s.key)||(lc=!0)},!0),addEventListener("pointerdown",()=>lc=!1,!0);function ko(){return lc}const Wy='a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]';function $y(s){const t=[];for(const e of s.querySelectorAll(Wy))e.tabIndex<0||e.closest("[hidden], [inert]")||e.getClientRects().length&&getComputedStyle(e).visibility!=="hidden"&&t.push(e);return t}let Ji=null,sn=null,Bn={};function Xy(s){Ji=s,s.addEventListener("pointerdown",e=>{if(!sn)return;const n=e.target;n.closest(".xp-menu")||n.closest("[data-menu-owner]")||Xe()},!0),s.addEventListener("wheel",e=>{sn&&!e.target.closest(".xp-menu")&&Xe()},{capture:!0,passive:!0});let t=innerWidth;addEventListener("resize",()=>{innerWidth!==t&&Xe(),t=innerWidth})}function cc(){return sn!==null}function bd(s){const t=Bn.owner;return!!sn&&!!t&&(t===s||s.contains(t))}function Sd(){const s=document.activeElement;let t=sn;for(;t;){if(s&&t.el.contains(s))return!0;t=t.child}return!1}function Xe(){if(!sn)return!1;const s=Sd();let t=sn;for(;t;)t.el.remove(),t=t.child;sn=null;const{onClose:e,returnTo:n}=Bn;return Bn={},e==null||e(),s&&(n!=null&&n.isConnected)&&n.getClientRects().length&&n.focus({preventScroll:!0}),!0}function wd(s,t){const e=$("div",{class:"xp-menu",role:"menu"}),n=[];for(const r of s){if(r==="sep"){e.append($("div",{class:"xp-menu-sep",role:"separator"}));continue}const o=$("button",{type:"button",role:r.checked!==void 0?"menuitemcheckbox":"menuitem",class:`${r.bold?"bold ":""}${r.submenu?"has-sub":""}`.trim(),html:`<i class="ic">${r.icon??""}</i><span class="lb"></span><span class="sc"></span>`});o.querySelector(".lb").textContent=r.label,o.querySelector(".sc").textContent=r.shortcut??"",r.checked!==void 0&&(o.setAttribute("aria-checked",String(r.checked)),r.checked&&o.classList.add("checked")),r.disabled&&(o.setAttribute("aria-disabled","true"),o.tabIndex=-1);const a=()=>{var u;if(!r.submenu||r.disabled)return;const l=hc(e);if(!l||((u=l.child)==null?void 0:u.el.dataset.for)===r.label)return;uc(l);const c=o.getBoundingClientRect(),h=Ed(wd(r.submenu(),l),c.right-3,c.top-3,c.left+3);h.dataset.for=r.label,l.child={el:h,child:null}};o.addEventListener("pointerenter",()=>{const l=hc(e);r.submenu?a():l&&uc(l),!r.disabled&&Sd()&&o.focus({preventScroll:!0})}),o.addEventListener("click",l=>{var c,h,u,d;if(l.stopPropagation(),!r.disabled){if(r.submenu){a(),(u=(h=(c=hc(e))==null?void 0:c.child)==null?void 0:h.el.querySelector("button:not([aria-disabled])"))==null||u.focus();return}Xe(),(d=r.run)==null||d.call(r)}}),e.append(o),n.push(o)}e.addEventListener("keydown",r=>{var c,h,u,d,f;const o=n.filter(p=>p.getAttribute("aria-disabled")!=="true"),a=o.indexOf(document.activeElement),l=()=>{r.preventDefault(),r.stopPropagation()};if(r.key==="ArrowDown"||r.key==="ArrowUp"){l();const p=r.key==="ArrowDown",v=a<0?o[p?0:o.length-1]:o[(a+(p?1:-1)+o.length)%o.length];v==null||v.focus()}else r.key==="Home"||r.key==="End"?(l(),(c=o[r.key==="Home"?0:o.length-1])==null||c.focus()):r.key==="ArrowRight"?(l(),(h=o[a])!=null&&h.classList.contains("has-sub")?(u=o[a])==null||u.click():t||(d=Bn.onNav)==null||d.call(Bn,1)):r.key==="ArrowLeft"?(l(),t?i(t):(f=Bn.onNav)==null||f.call(Bn,-1)):r.key==="Escape"?(l(),t?i(t):Xe()):r.key==="Tab"&&(l(),Xe())});const i=r=>{var l;const o=(l=r.child)==null?void 0:l.el.dataset.for;uc(r);const a=[...r.el.querySelectorAll("button.has-sub")].find(c=>{var h;return((h=c.querySelector(".lb"))==null?void 0:h.textContent)===o});a==null||a.focus()};return e}function hc(s){let t=sn;for(;t;){if(t.el===s)return t;t=t.child}return null}function uc(s){let t=s.child;for(;t;)t.el.remove(),t=t.child;s.child=null}function Ed(s,t,e,n=t){if(!Ji)throw new Error("menu host not set");s.style.left="0px",s.style.top="0px",Ji.append(s);const i=Ji.getBoundingClientRect(),r=s.offsetWidth,o=s.offsetHeight;let a=t-i.left,l=e-i.top;return a+r>i.width-2&&(a=Math.max(2,n-i.left-r)),l+o>i.height-32&&(l=Math.max(2,i.height-32-o)),s.style.left=`${Math.round(a)}px`,s.style.top=`${Math.round(l)}px`,s}function ji(s,t,e,n={}){Xe();const i=document.activeElement instanceof HTMLElement&&document.activeElement!==document.body?document.activeElement:null,r=wd(s,null);if(r.tabIndex=-1,sn={el:r,child:null},Bn={...n,returnTo:n.returnTo??i},Ed(r,t,e),n.takeFocus===!1)return;const o=r.querySelector("button:not([aria-disabled])");(n.focusFirst??ko())&&o?o.focus({preventScroll:!0}):r.focus({preventScroll:!0})}function Td(s,t,e={}){const n=t.getBoundingClientRect();if(ji(s,n.right-2,n.top-3,{returnTo:t,onNav:i=>i<0&&Xe(),...e}),sn){const i=Ji==null?void 0:Ji.getBoundingClientRect();i&&n.right+sn.el.offsetWidth>i.right&&(sn.el.style.left=`${Math.max(2,n.left-i.left-sn.el.offsetWidth+2)}px`)}}function Yy(s,t){s.addEventListener("contextmenu",e=>{const n=e.target;if(n.closest("input, textarea, [contenteditable], .oikos-tube"))return;const i=t(n,e);if(i!==null){if(e.preventDefault(),!i.length){Xe();return}ji(i,e.clientX,e.clientY,{owner:n})}})}function $(s,t={},e=[]){const n=document.createElement(s);for(const[i,r]of Object.entries(t))i==="html"?n.innerHTML=r:n.setAttribute(i,r);for(const i of e)n.append(i);return n}function dc(s){const t=$("div",{class:"xp-menubar",role:"menubar"});let e=null;const n=[],i=Object.keys(s),r=(o,a,l=!0)=>{var f;const c=n[o],h=i[o];if(!c||h===void 0)return;const u=(f=s[h])==null?void 0:f.call(s);if(!u)return;const d=c.getBoundingClientRect();ji(u,d.left,d.bottom,{onClose:()=>{c.classList.remove("open"),c.setAttribute("aria-expanded","false"),e===c&&(e=null)},focusFirst:a,takeFocus:l,returnTo:c,owner:c,onNav:p=>{var m;const v=(o+p+n.length)%n.length;(m=n[v])==null||m.focus({preventScroll:!0}),r(v,!0)}}),c.classList.add("open"),c.setAttribute("aria-expanded","true"),e=c};return i.forEach((o,a)=>{const l=$("button",{type:"button",class:"xp-menutitle",role:"menuitem","aria-haspopup":"menu","aria-expanded":"false","data-menu-owner":""},[o]);a>0&&(l.tabIndex=-1),l.addEventListener("click",()=>{e===l?Xe():r(a,!1)}),l.addEventListener("pointerenter",()=>{e&&e!==l&&cc()&&(l.focus({preventScroll:!0}),r(a,!1))}),l.addEventListener("keydown",c=>{var h;if(c.key==="ArrowDown"||c.key==="Enter"||c.key===" ")c.preventDefault(),c.stopPropagation(),r(a,!0);else if(c.key==="ArrowRight"||c.key==="ArrowLeft"){c.preventDefault(),c.stopPropagation();const u=(a+(c.key==="ArrowRight"?1:-1)+n.length)%n.length;(h=n[u])==null||h.focus()}}),n.push(l),t.append(l)}),t.append($("span",{class:"xp-throbber","aria-hidden":"true",html:No(18,!0)})),t}function Ad(s){const t=$("div",{class:"xp-toolbar"}),e=(o,a,l,c=!0)=>{const h=$("button",{class:"xp-tb",type:"button",title:a,html:`${o}${c?`<span>${a}</span>`:""}`});return l?h.addEventListener("click",l):h.disabled=!0,t.append(h),h},n=e(Dy(),"Back",s.back),i=e(Iy(),"Forward",s.forward,!1);e(Uy(),"Up",s.up,!1),t.append($("span",{class:"xp-tb-sep"})),e(Ny(),"Search",s.search),e(ky(),"Folders",s.folders);const r=()=>{if(!s.can)return;const o=s.can();n.disabled=!s.back||!o.back,i.disabled=!s.forward||!o.forward};return r(),{el:t,refresh:r}}function Cd(s,t,e,n){const i=$("div",{class:"xp-address"});i.append($("span",{class:"lbl"},["Address"]));const r=$("label",{class:"field",html:s});let o=null;e?(o=$("input",{type:"text",value:t,"aria-label":"Address",spellcheck:"false"}),o.style.cssText="flex:1;min-width:0;border:0;outline:0;font:inherit;background:transparent;",r.append(o),o.addEventListener("keydown",l=>{l.key==="Enter"&&o&&(n==null||n(o.value)),l.key!=="Tab"&&l.stopPropagation()})):r.append($("span",{},[t])),i.append(r);const a=$("button",{class:"go",type:"button",html:`${Fy()}<span>Go</span>`});return a.addEventListener("click",()=>n==null?void 0:n((o==null?void 0:o.value)??t)),i.append(a),{el:i,input:o}}function br(s,t,e=!1){const n=$("section",{class:`xp-taskgroup${e?" primary":""}`}),i=$("header"),r=$("button",{type:"button",class:"xp-taskgroup-toggle","aria-expanded":"true"},[s]);i.append(r);const o=()=>{n.classList.toggle("collapsed"),r.setAttribute("aria-expanded",String(!n.classList.contains("collapsed")))};i.addEventListener("click",o),n.append(i);const a=$("div",{class:"xp-taskbody"});if(t instanceof HTMLElement)a.append(t);else{const l=$("ul");for(const c of t){const h=$("li");let u;if(c.href)u=$("a",{class:"xp-link",href:c.href,html:`${c.icon}<span></span>`}),c.external&&(u.setAttribute("target","_blank"),u.setAttribute("rel","noopener"));else{u=$("button",{class:"xp-link",type:"button",html:`${c.icon}<span></span>`});const f=c.run;f?u.addEventListener("click",f):u.setAttribute("aria-disabled","true")}const d=u.querySelector("span");d&&(d.textContent=c.label),h.append(u),l.append(h)}a.append(l)}return n.append(a),n}function Rd(){const s=$("div",{class:"xp-statusbar",role:"status"}),t=$("span"),e=$("span",{class:"zone"});return s.append(t,e),{el:s,set(n,i){t.textContent=n;const[r,o]=i==="computer"?[Py(),"æthera"]:[ac(),"elsewhere"];e.innerHTML=`${r}<span>${o}</span>`}}}const qy={dreams:["chronicle","dreams-api","dream_gen"],chronicle:["dreams","dream_gen"],"dreams-api":["dreams","chronicle"],dream_gen:["dreams","chronicle"],transmissions:["irc","syrinx"],apeiron:["dreams","syrinx"],syrinx:["apeiron","afterlife"],afterlife:["syrinx","apeiron"],irc:["transmissions","parlor"],parlor:["irc","transmissions"]};function Pd(s){return/^https?:/.test(s.href)?s.href:`${location.origin}${s.href}`}function Ld(s){return s.group==="here"?"computer":"internet"}function fc(s,t){var i;const e=Pd(t),n=(i=navigator.clipboard)==null?void 0:i.writeText(e);if(!n){s.balloon("couldn't copy",e);return}n.then(()=>s.balloon("copied",e),()=>s.balloon("couldn't copy",e))}function Sr(s){return`Go to ${s.title}${Nc(s.href)?" ↗":""}`}function Fo(s,t,e=!1){const n=[];return e||n.push({label:"Open",bold:!0,run:()=>s.play(t.id)}),n.push({label:Sr(t),bold:e,run:()=>s.open(t)}),n.push({label:"Show in Room",run:()=>s.look(t.id),disabled:!s.canTune}),t.tune&&n.push({label:"Tune In",run:()=>s.tuneIn(t.id),disabled:!s.canTune}),t.id==="irc"&&n.push({label:"Join #aethera",run:()=>s.chat("#aethera")}),n.push("sep",{label:"Copy Address",run:()=>fc(s,t)}),n}function Dd(s,t){return[{label:"Copy Address",disabled:!t,run:()=>t&&fc(s,t)}]}function Id(s){return[{label:"Add to Favorites...",disabled:!0},{label:"Organize Favorites...",disabled:!0},"sep",...s.dir.sites.filter(t=>t.group==="here").map(t=>({label:t.title,icon:On(t.accent),run:()=>s.play(t.id)}))]}function Ud(s){return[{label:"About æthera",run:()=>s.about()}]}function pc(s){s.hidden=!s.hidden}function Nd(s,t){return[{label:"Toolbars",submenu:()=>[{label:"Standard Buttons",checked:!t.toolbar.hidden,run:()=>pc(t.toolbar)},{label:"Address Bar",checked:!t.address.hidden,run:()=>pc(t.address)}]},{label:"Status Bar",checked:!t.status.hidden,run:()=>pc(t.status)},...t.views?["sep",...t.views]:[],"sep",{label:"Go To",submenu:()=>[{label:"Back",shortcut:"Alt+Left",disabled:!s.canBack,run:()=>s.back()},{label:"Forward",shortcut:"Alt+Right",disabled:!s.canForward,run:()=>s.forward()},{label:"Up One Level",disabled:!t.up,run:()=>{var e;return(e=t.up)==null?void 0:e.call(t)}},"sep",{label:"~",run:()=>s.home()}]},{label:"Refresh",run:()=>t.refresh()}]}class Ky{constructor(t,e){R(this,"win",null);R(this,"selected",null);R(this,"tiles",new Map);R(this,"tasks",null);R(this,"status",null);R(this,"content",null);R(this,"view","tiles");this.shell=t,this.wm=e}get isOpen(){return!!this.win&&!this.win.closed}open(){var u;if(this.isOpen&&this.win){this.win.minimized?this.win.restore():this.win.focus();return}this.tiles.clear();const t=$("div");t.style.cssText="display:flex;flex-direction:column;min-height:0;flex:1;";const{dir:e}=this.shell,n=Ad({back:()=>this.shell.back(),forward:()=>this.shell.forward(),can:()=>({back:this.shell.canBack,forward:this.shell.canForward}),search:()=>{var d;return(d=i.input)==null?void 0:d.focus()},folders:()=>{var d;return(d=this.tasks)==null?void 0:d.toggleAttribute("hidden")}}),i=Cd(yr(),"~",!0,d=>this.go(d));(u=i.input)==null||u.addEventListener("input",()=>{var d;return this.filter(((d=i.input)==null?void 0:d.value)??"")}),this.status=Rd();const r=()=>this.selected?this.shell.site(this.selected)??null:null;t.append(dc({File:()=>this.fileMenu(),Edit:()=>Dd(this.shell,r()),View:()=>{var d;return Nd(this.shell,{toolbar:n.el,address:i.el,status:((d=this.status)==null?void 0:d.el)??$("div"),views:this.viewItems(),refresh:()=>{i.input&&(i.input.value="~"),this.filter("")}})},Favorites:()=>Id(this.shell),Help:()=>Ud(this.shell)}),n.el,i.el);const o=this.shell.onNav(()=>n.refresh()),a=$("div",{class:"xp-body"});this.tasks=$("aside",{class:"xp-tasks"}),a.append(this.tasks);const l=$("div",{class:`xp-content view-${this.view}`,role:"region","aria-label":"places"});this.content=l,l.addEventListener("pointerdown",d=>{d.button===0&&!d.target.closest(".xp-tile")&&this.select(null)});let c=0;const h=(d,f)=>{if(!f.length)return;const p=`xp-group-${++c}`;l.append($("h3",{class:"xp-group-head",id:p},[d]));const v=$("div",{class:"xp-tiles",role:"listbox","aria-labelledby":p});for(const m of f)v.append(this.tile(m));l.append(v)};if(h("here",e.sites.filter(d=>d.group==="here")),h("elsewhere",e.sites.filter(d=>d.group==="wired")),e.files.length){l.append($("h3",{class:"xp-group-head"},["files"]));const d=$("div",{class:"xp-tiles"});for(const f of e.files){const p=f.title.split(".").pop()??"txt",v=$("a",{class:"xp-tile",href:f.href,html:`${Uo(p)}<span><span class="t"></span><span class="k"></span></span>`});v.querySelector(".t").textContent=f.title,v.querySelector(".k").textContent=f.about,d.append(v)}l.append(d)}a.append(l),t.append(a),t.append(this.status.el),this.win=this.wm.open({id:"home",title:"~",icon:yr(),body:t,width:Math.round(Math.min(680,Math.max(420,innerWidth*.46))),dock:"left",onClose:()=>{o(),this.win=null,this.content=null,this.tasks=null,this.status=null,this.tiles.clear(),this.selected=null}}),this.win.el.style.height="min(560px, calc(100% - 40px))",this.renderTasks(),this.renderStatus()}close(){var t;(t=this.win)==null||t.close()}focusTiles(){var n;if(!this.isOpen||(n=this.win)!=null&&n.minimized)return;const t=this.selected?this.tiles.get(this.selected):void 0,e=t&&!t.hidden?t:[...this.tiles.values()].find(i=>!i.hidden);e==null||e.focus({preventScroll:!0})}fileMenu(){const t=this.selected?this.shell.site(this.selected):void 0;return[...t?Fo(this.shell,t):[{label:"Open",bold:!0,disabled:!0}],"sep",{label:"Close",run:()=>this.close()}]}viewItems(){const t=e=>()=>{this.view=e,this.content&&(this.content.className=`xp-content view-${e}`)};return[{label:"Tiles",checked:this.view==="tiles",run:t("tiles")},{label:"Icons",checked:this.view==="icons",run:t("icons")},{label:"List",checked:this.view==="list",run:t("list")}]}contextFor(t){const e=this.shell.site(t);return e?(this.select(t,!0),Fo(this.shell,e)):null}blankMenu(){return[{label:"View",submenu:()=>this.viewItems()},{label:"Arrange Icons By",disabled:!0,submenu:()=>[]},"sep",{label:"Refresh",run:()=>this.filter("")},"sep",{label:"Paste",disabled:!0},{label:"Paste Shortcut",disabled:!0},"sep",{label:"New",disabled:!0,submenu:()=>[]},"sep",{label:"Properties",disabled:!0}]}tile(t){const e=$("button",{class:"xp-tile",type:"button",role:"option","data-id":t.id,html:`${On(t.accent,t.title)}<span><span class="t"></span><span class="k"></span><span class="d"></span></span>`});e.querySelector(".t").textContent=t.title,e.querySelector(".k").textContent=t.kind,e.querySelector(".d").textContent=t.tagline,e.title=t.tagline,e.setAttribute("aria-selected","false");let n=!1;return e.addEventListener("pointerdown",i=>n=i.pointerType==="touch"),e.addEventListener("click",()=>{if(n&&this.selected===t.id&&e.dataset.armed){delete e.dataset.armed,this.shell.play(t.id);return}this.select(t.id,!0),n&&(e.dataset.armed="1")}),e.addEventListener("dblclick",()=>this.shell.play(t.id)),e.addEventListener("keydown",i=>{if(i.key==="Enter"&&this.shell.play(t.id),["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(i.key)){i.preventDefault(),i.stopPropagation();const r=[...this.tiles.values()].filter(l=>!l.hidden),o=r.indexOf(e),a=r[(o+(i.key==="ArrowRight"||i.key==="ArrowDown"?1:-1)+r.length)%r.length];a==null||a.focus(),a!=null&&a.dataset.id&&this.select(a.dataset.id,!0)}}),this.tiles.set(t.id,e),e}select(t,e=!1){if(t!==this.selected){this.selected=t;for(const[n,i]of this.tiles)i.classList.toggle("selected",n===t),i.setAttribute("aria-selected",String(n===t)),n!==t&&delete i.dataset.armed;e&&this.shell.select(t),this.renderTasks(),this.renderStatus()}}filter(t){const e=t.replace(/^~\/?(æthera)?\/?/i,"").trim().toLowerCase();for(const[n,i]of this.tiles){const r=this.shell.site(n);i.hidden=!!e&&!`${r==null?void 0:r.title} ${r==null?void 0:r.kind} ${r==null?void 0:r.tagline}`.toLowerCase().includes(e)}}go(t){const e=t.replace(/^~\/?(æthera)?\/?/i,"").trim().toLowerCase();if(!e)return;const n=this.shell.dir.sites.find(i=>i.title.toLowerCase()===e)??this.shell.dir.sites.find(i=>`${i.title} ${i.kind} ${i.tagline}`.toLowerCase().includes(e));n?this.shell.play(n.id):this.shell.balloon("not found",`nothing called “${t}” in ~`)}renderTasks(){if(!this.tasks)return;const t=this.selected?this.shell.site(this.selected):void 0,e=t?[{icon:fd(t.accent),label:"Open",run:()=>this.shell.play(t.id)},{icon:gd(),label:"Show in Room",run:()=>this.shell.look(t.id)},{icon:ac(),label:Sr(t),run:()=>this.shell.open(t)}]:[],n=$("div",{class:"xp-details"});if(t){n.append($("b",{},[t.title]));const i=$("dl");for(const[r,o]of t.details)i.append($("dt",{},[r]),$("dd",{},[o]));n.append(i)}else{const i=this.shell.dir.sites.filter(r=>r.group==="here").length;n.append($("b",{},["~"]),$("span",{},[`${i} here · ${this.shell.dir.sites.length-i} elsewhere`]))}this.tasks.replaceChildren(...e.length?[br("tasks",e,!0)]:[],br("details",n))}renderStatus(){var i;const t=this.selected?this.shell.site(this.selected):void 0,{sites:e,files:n}=this.shell.dir;(i=this.status)==null||i.set(t?`${t.title} — ${t.tagline}`:`${e.length} places · ${n.length} files`,t?Ld(t):"computer")}}const Zy=4001,Jy=4002,jy=s=>s>=4e3&&s<5e3,Qy=4;class tM{constructor(t,e,n){R(this,"ws",null);R(this,"tries",0);R(this,"timer",0);R(this,"wanted",!1);R(this,"welcomed",!1);R(this,"refused",!1);this.nick=t,this.password=e,this.on=n}get open(){var t;return this.welcomed&&((t=this.ws)==null?void 0:t.readyState)===WebSocket.OPEN}connect(){this.wanted=!0,this.refused=!1,clearTimeout(this.timer);const t=location.protocol==="https:"?"wss":"ws";let e;try{e=new WebSocket(`${t}://${location.host}/ws/chat`)}catch{this.on.closed(!1,!1,!1);return}this.ws=e,this.welcomed=!1,e.onopen=()=>{e.send(JSON.stringify({type:"hello",nick:this.nick,password:this.password||null}))},e.onmessage=n=>{let i;try{i=JSON.parse(String(n.data))}catch{return}switch(i.type){case"welcome":{const r=i;this.welcomed=!0,this.tries=0,this.nick=r.nick,this.on.welcome(r);break}case"event":{const r=i.event;if(!r)break;r.kind==="nick"&&r.nick===this.nick&&r.target&&(this.nick=r.target),this.on.event(r);break}case"whois":this.on.whois(i);break;case"error":{this.welcomed||(this.refused=!0),this.on.error(String(i.code??""),String(i.text??""));break}}},e.onclose=n=>{if(this.ws!==e)return;this.ws=null;const i=n.code===Zy,r=n.code===Jy,o=this.wanted&&!jy(n.code)&&!this.refused&&this.tries<Qy;if(this.welcomed=!1,this.on.closed(o,i,r),!o){this.wanted=!1;return}this.tries++,this.timer=window.setTimeout(()=>this.connect(),2e3*2**(this.tries-1))}}send(t){if(!this.open||!this.ws)return!1;try{return this.ws.send(JSON.stringify(t)),!0}catch{return!1}}part(t="Leaving"){if(this.open&&this.ws)try{this.ws.send(JSON.stringify({type:"part",reason:t}))}catch{}this.close()}close(){this.wanted=!1,clearTimeout(this.timer);const t=this.ws;if(this.ws=null,this.welcomed=!1,this.password=null,t){t.onclose=null;try{t.close()}catch{}}}}const Ft="#aethera",Pt="#oikos",zn="irc.aetherawi.red",mc=6667,gc="guest",kd="always falling apart",eM=600,nM=6e3,Fd="oikos-mirc-nick",iM=/^[A-Za-z[\]\\`_^{|}][A-Za-z0-9[\]\\`_^{|}-]{0,15}$/,xc=["~","&","@","%","+"];function sM(s){const t=new Date(s);return`[${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}]`}function rM(s){return Date.now()-(performance.now()-s)}function vc(s){const t=oi(s)||"anon",e=jo(t),n=["dialup.wired.net","cable.aether.org","dsl.tokyo.jp","adsl.nowhere.nu","res.home.co"],i=n[Math.floor(e*n.length)]??n[0],r=Math.floor(e*251)+2,o=Math.floor(jo(`${t}.`)*251)+2;return`~${t.slice(0,9).toLowerCase()}@ppp-${r}-${o}.${i}`}function oi(s){return s.replace(/^[~&@%+]+/,"")}function Od(s){const t=s.charAt(0);return xc.includes(t)?t:""}function oM(){try{return localStorage.getItem(Fd)??""}catch{return""}}function Bd(s){try{localStorage.setItem(Fd,s)}catch{}}function _c(s){s.addEventListener("keydown",t=>{t.key!=="Escape"&&t.key!=="Tab"&&t.stopPropagation()})}class yc{constructor(t,e,n){R(this,"tab");R(this,"pane");R(this,"log");R(this,"nicksEl");R(this,"nicks",new Map);R(this,"topic","");R(this,"joined",!1);this.id=t;const i=`mirc-pane-${t==="status"?"status":t.slice(1)}`;this.tab=$("button",{type:"button",role:"tab","aria-controls":i,html:`${e}<span></span>`}),this.tab.querySelector("span").textContent=t==="status"?"Status":t,this.log=$("div",{class:"mirc-log",role:"log","aria-label":t==="status"?"Status":t}),n?(this.log.setAttribute("aria-live","polite"),this.nicksEl=$("ul",{class:"mirc-nicks","aria-label":`Nicknames in ${t}`}),this.pane=$("div",{class:"mirc-pane",id:i,role:"tabpanel"},[$("div",{class:"mirc-split"},[this.log,this.nicksEl])])):(this.nicksEl=null,this.pane=$("div",{class:"mirc-pane",id:i,role:"tabpanel"},[this.log]))}setNick(t,e=Od(t)){const n=oi(t);n&&this.nicks.set(n.toLowerCase(),{name:n,mode:e})}seen(t){const e=oi(t);if(!e)return!1;const n=e.toLowerCase(),i=this.nicks.get(n),r=Od(t)||(i==null?void 0:i.mode)||"";return i&&i.mode===r&&i.name===e?!1:(this.nicks.set(n,{name:e,mode:r}),!0)}drop(t){return this.nicks.delete(oi(t).toLowerCase())}rename(t,e){const n=this.nicks.get(oi(t).toLowerCase());this.drop(t),this.setNick(e,(n==null?void 0:n.mode)??"")}render(){if(!this.nicksEl)return;const t=n=>n?xc.indexOf(n):xc.length,e=[...this.nicks.values()].sort((n,i)=>t(n.mode)-t(i.mode)||n.name.localeCompare(i.name,void 0,{sensitivity:"base"}));this.nicksEl.replaceChildren(...e.map(n=>$("li",{title:`${n.mode}${n.name}`},[`${n.mode}${n.name}`])))}}class aM{constructor(t,e,n){R(this,"win");R(this,"wins");R(this,"view",Ft);R(this,"input");R(this,"me",gc);R(this,"link",null);R(this,"hintedOikos",!1);R(this,"livingSeenAt",0);R(this,"livingOnce",!1);R(this,"greeted",!1);R(this,"hung",!1);R(this,"lastAt",-1);R(this,"seenFragments");R(this,"seenCollapse",null);R(this,"wasConnected",!1);R(this,"rejoinTimer",0);R(this,"off");var c;this.shell=t,this.wm=e;const i=$("div",{class:"mirc"});i.append(dc({File:()=>[{label:"Connect...",run:()=>this.joinLiving(),disabled:!!this.link},{label:"Disconnect",run:()=>this.partLiving(),disabled:!this.link},"sep",{label:"Select Server...",disabled:!0},"sep",{label:"Exit",run:()=>this.win.close()}],Tools:()=>[{label:"Address Book...",disabled:!0},{label:"Options...",disabled:!0}],Commands:()=>[{label:`Join ${Pt}`,run:()=>this.joinLiving()},{label:`Part ${Pt}`,run:()=>this.partLiving(),disabled:!this.link},"sep",{label:"Clear Buffer",run:()=>this.wins[this.view].log.replaceChildren()}],Window:()=>["status",Ft,Pt].filter(h=>!this.wins[h].tab.hidden).map(h=>({label:h==="status"?"Status":h,checked:this.view===h,run:()=>this.show(h)})),Help:()=>[{label:"Commands",run:()=>this.help()},"sep",{label:"About æthera",run:()=>this.shell.about()}]}));const r=$("div",{class:"mirc-switch",role:"tablist"});this.wins={status:new yc("status",Ci("status"),!1),[Ft]:new yc(Ft,Ci("channel"),!0),[Pt]:new yc(Pt,Ci("channel"),!0)},this.wins[Ft].topic=kd,this.wins[Pt].tab.hidden=!0;const o=$("div",{class:"mirc-mdi"});for(const h of Object.values(this.wins))h.tab.addEventListener("click",()=>this.show(h.id)),r.append(h.tab),o.append(h.pane);this.input=$("input",{class:"mirc-input",type:"text",spellcheck:"false",autocomplete:"off",maxlength:"400","aria-label":"Message"}),_c(this.input),this.input.addEventListener("keydown",h=>{if(h.key!=="Enter")return;h.preventDefault();const u=this.input.value;this.input.value="",this.say(u)}),i.append(r,o,this.input),this.win=e.open({id:"mirc",title:"mIRC",icon:Ci("app"),body:i,width:Math.round(Math.min(760,Math.max(460,innerWidth*.52))),dock:"center",onClose:()=>{var h,u;clearTimeout(this.rejoinTimer),this.off(),(h=this.link)==null||h.part("Leaving"),this.link=null,(u=this.wm.get("mirc-connect"))==null||u.close(),n()},onFocus:()=>{Mr()||this.input.focus({preventScroll:!0})}}),this.win.el.classList.add("mirc-window"),this.win.el.style.height="min(540px, calc(100% - 24px))";const a=this.win.el.parentElement;if(a){const h=this.win.el.offsetTop+this.win.el.offsetHeight-(a.clientHeight-8);h>0&&this.win.moveTo(this.win.el.offsetLeft,this.win.el.offsetTop-h)}const l=this.shell.feeds.irc.value;this.seenFragments=l.fragments,this.seenCollapse=((c=l.collapse)==null?void 0:c.at)??null,this.show(Ft),l.connected?this.connect(l):this.push("status","info",`* Connecting to ${zn} (${mc})`),this.off=this.shell.feeds.irc.on(h=>this.update(h))}focus(t){this.win.minimized?this.win.restore():this.win.focus();const e=t===Ft||t===Pt||t==="status"?this.wins[t]:null;e&&!e.tab.hidden&&this.show(e.id)}update(t){var n;if(t.connected&&!this.wasConnected?this.connect(t):!t.connected&&this.wasConnected&&this.disconnect(),!t.connected)return;for(const i of t.lines)i.at<=this.lastAt||(this.rejoinTimer&&this.rejoin(),this.lastAt=i.at,this.line(i));const e=((n=t.collapse)==null?void 0:n.at)??null;e!==null&&e!==this.seenCollapse&&t.collapse&&this.collapse(t.collapse.type),this.seenCollapse=e,t.fragments!==this.seenFragments&&(this.seenFragments=t.fragments,clearTimeout(this.rejoinTimer),this.hung?this.rejoinTimer=window.setTimeout(()=>this.rejoin(),nM):this.rejoin())}connect(t){this.wasConnected=!0;const e=(i,r)=>this.push("status",i,r);if(this.greeted){e("info",`* Reconnected to ${zn}`),this.joinHaunted(),t.collapse&&this.collapse(t.collapse.type);return}this.greeted=!0,e("info",`* Connecting to ${zn} (${mc})`),e("notice",`-${zn}- *** Looking up your hostname...`),e("notice",`-${zn}- *** Found your hostname`),e("text",`Welcome to the æthera IRC Network ${this.me}!${this.me}@oikos`),e("text",`Your host is ${zn}, running version hauntd-2.8.21`),e("text",`- ${zn} Message of the Day -`),e("text","- nobody here is who they were."),e("text","- every line is a replay; every replay is live."),e("text",`- ${Ft} is moderated: the living listen.`),e("text",`- the living talk in ${Pt}. /join ${Pt}`),e("text","End of /MOTD command."),e("mode",`* ${this.me} sets mode: +i`),this.joinHaunted();const n=t.lines.filter(i=>i.at>this.lastAt);if(n.length){this.push(Ft,"info","*** Buffer Playback...");for(const i of n)this.line(i);this.push(Ft,"info","*** Playback Complete.")}this.lastAt=Math.max(this.lastAt,...t.lines.map(i=>i.at)),t.collapse&&this.collapse(t.collapse.type)}joinHaunted(){const t=this.wins[Ft];t.joined=!0,t.nicks.clear(),t.setNick(this.me,""),this.push(Ft,"join",`* Now talking in ${Ft}`),this.push(Ft,"topic",`* Topic is '${t.topic}'`),this.push(Ft,"topic","* Set by ChanServ"),this.nicksChanged(Ft)}disconnect(){clearTimeout(this.rejoinTimer),this.rejoinTimer=0,this.wasConnected=!1;const t=this.wins[Ft];t.joined=!1,this.setHung(!1),this.push("status","info",`* Disconnected from ${Ft}`),this.push(Ft,"info","* Disconnected"),t.nicks.clear(),this.nicksChanged(Ft)}collapse(t){const e=t.replace(/_/g," ");this.push("status","notice",`-${zn}- *** Notice -- ${e} on ${Ft}`),this.setHung(!0)}rejoin(){clearTimeout(this.rejoinTimer),this.rejoinTimer=0,this.setHung(!1),this.push(Ft,"info",`* Attempting to rejoin channel ${Ft}`),this.wins[Ft].topic=kd,this.joinHaunted()}line(t){const e=this.wins[Ft],n=t.nick,i=oi(n),r=t.content,o=t.wallAt??rM(t.at),a=(c,h)=>this.push(Ft,c,h,o);let l=!1;switch(t.type){case"message":l=e.seen(n),a("text",`<${n}> ${r}`);break;case"action":{const c=/^sets mode: ([+-])([a-z]+) (.+)$/i.exec(r);c?(e.seen(n),this.applyMode(c[1]??"+",c[2]??"",(c[3]??"").split(/\s+/)),l=!0,a("mode",`* ${n} ${r}`)):/^has quit\b/i.test(r)?(l=e.drop(n),a("quit",`* ${i} ${r.replace(/^has quit\b/i,"has quit IRC")}`)):(l=e.seen(n),a("action",`* ${n} ${r}`));break}case"join":l=e.seen(n),a("join",`* ${i} (${vc(n)}) has joined ${Ft}`);break;case"part":l=e.drop(n),a("part",`* ${i} (${vc(n)}) has left ${Ft}${r?` (${r})`:""}`);break;case"quit":l=e.drop(n),a("quit",`* ${i} (${vc(n)}) Quit (${r||"Client exited"})`);break;case"kick":{const c=t.reason||r;t.target?(l=e.drop(t.target),a("kick",`* ${oi(t.target)} was kicked by ${i}${c?` (${c})`:""}`)):a("kick",`* ${i} kicks${c?` (${c})`:""}`);break}default:{const c=/changes topic to '(.*)'$/i.exec(r);if(c){e.topic=c[1]??e.topic,a("topic",`* ${r}`),this.retitle();break}const h=r||n;a("info",/^[*<]/.test(h)||h.length<6?h:`* ${h}`)}}!e.nicks.has(this.me.toLowerCase())&&e.joined&&(e.setNick(this.me,""),l=!0),l&&this.nicksChanged(Ft)}applyMode(t,e,n){const i=this.wins[Ft],r={q:"~",a:"&",o:"@",h:"%",v:"+"};[...e].forEach((o,a)=>{const l=n[a],c=r[o];if(!l||!c)return;const h=i.nicks.get(oi(l).toLowerCase());i.setNick((h==null?void 0:h.name)??oi(l),t==="+"?c:(h==null?void 0:h.mode)===c?"":(h==null?void 0:h.mode)??"")})}joinLiving(){if(this.link&&this.wins[Pt].joined){this.show(Pt);return}if(this.link){this.push(this.view,"info",`* Still connecting to ${Pt}...`);return}this.connectDialog()}partLiving(){if(!this.link)return;this.link.part("Leaving"),this.link=null;const t=this.wins[Pt];t.joined=!1,t.nicks.clear(),this.nicksChanged(Pt),this.push(Pt,"part",`* You have left ${Pt}`),this.push("status","info",`* Disconnected from ${Pt}`),this.livingSeenAt=0,this.livingOnce=!1,this.renameMe(gc)}connectDialog(t){var h;(h=this.wm.get("mirc-connect"))==null||h.close();const e=$("form",{class:"mirc-connect"}),n=$("input",{type:"text",value:oM(),maxlength:"16",spellcheck:"false",autocomplete:"nickname",required:""}),i=$("input",{type:"password",maxlength:"256",autocomplete:"current-password"});_c(n),_c(i);const r=$("p",{class:"err",role:"alert"});r.textContent=t??"",r.hidden=!t,e.append($("div",{class:"xp-dialog-body"},[$("span",{html:Ci("app")}),$("div",{},[$("p",{},[`Join ${Pt}, where the living talk.`]),$("label",{},["Nickname:",n]),$("label",{},["Password (optional):",i]),$("p",{class:"hint"},["Same tripcode as your blog comments. Never stored."]),r])]));const o=$("div",{class:"xp-actions"}),a=$("button",{class:"xp-btn default",type:"submit"},["Connect"]),l=$("button",{class:"xp-btn",type:"button"},["Cancel"]);o.append(a,l),e.append(o);const c=this.wm.open({id:"mirc-connect",title:"mIRC Connect",icon:Ci("app"),body:e,width:360,dialog:!0});l.addEventListener("click",()=>c.close()),e.addEventListener("keydown",u=>{u.key==="Escape"&&(u.preventDefault(),c.close(),this.input.focus({preventScroll:!0}))}),e.addEventListener("submit",u=>{u.preventDefault();const d=n.value.trim();if(!iM.test(d)){r.textContent="A nickname starts with a letter and has at most 16 letters, digits or - _ [ ] { } | ^ `",r.hidden=!1,n.focus();return}Bd(d),c.close(),this.dial(d,i.value||null)}),n.focus(),n.select()}dial(t,e){this.push("status","info",`* Connecting to ${Pt} as ${t}${e?" (with a tripcode)":""}`);const n=new tM(t,e,{welcome:i=>this.welcomed(i),event:i=>this.event(i),whois:i=>this.whoisReply(i),error:(i,r)=>this.chatError(i,r),closed:(i,r,o)=>this.dropped(i,r,o)});this.link=n,n.connect()}welcomed(t){const e=this.wins[Pt];e.tab.hidden=!1,e.joined=!0,e.topic=t.topic,e.nicks.clear();for(const r of t.names)e.setNick(r.nick,r.op?"@":"");this.renameMe(t.nick);const n=this.livingOnce;this.livingOnce=!0;const i=t.backlog.filter(r=>r.at>this.livingSeenAt);if(n?this.push(Pt,"join",`* Rejoined ${Pt}`):(this.push("status","text",`* You are now known as ${t.nick} (${t.mask})`),t.op&&this.push("status","mode",`* ${zn} sets mode: +o ${t.nick}`),this.push(Pt,"join",`* Now talking in ${Pt}`),this.push(Pt,"topic",`* Topic is '${t.topic}'`)),i.length){this.push(Pt,"info","*** Buffer Playback...");for(const r of i)this.event(r,!0);this.push(Pt,"info","*** Playback Complete.")}this.nicksChanged(Pt),n||this.show(Pt)}event(t,e=!1){const n=this.wins[Pt],i=(o,a)=>this.push(Pt,o,a,t.at),r=t.nick===this.me;switch(this.livingSeenAt=Math.max(this.livingSeenAt,t.at),t.kind){case"message":i(r?"own":"text",`<${t.nick}> ${t.text}`);return;case"action":i("action",`* ${t.nick} ${t.text}`);return;case"join":i("join",`* ${t.nick} (${t.mask??""}) has joined ${Pt}`),e||n.setNick(t.nick,"");break;case"part":i("part",`* ${t.nick} (${t.mask??""}) has left ${Pt}${t.text?` (${t.text})`:""}`),e||n.drop(t.nick);break;case"quit":i("quit",`* ${t.nick} (${t.mask??""}) Quit (${t.text||"Client exited"})`),e||n.drop(t.nick);break;case"kick":t.target===this.me&&!e?(i("kick",`* You were kicked from ${Pt} by ${t.nick} (${t.text})`),n.joined=!1,n.nicks.clear()):(i("kick",`* ${t.target??"?"} was kicked by ${t.nick} (${t.text})`),!e&&t.target&&n.drop(t.target));break;case"nick":r&&!e&&t.target?(i("text",`* Your nick is now ${t.target}`),this.renameMe(t.target),Bd(t.target)):i("text",`* ${t.nick} is now known as ${t.target??"?"}`),!e&&t.target&&n.rename(t.nick,t.target);break;case"topic":i("topic",`* ${t.nick} changes topic to '${t.text}'`),e||(n.topic=t.text);break}e||this.nicksChanged(Pt)}whoisReply(t){const e=n=>this.push(this.view,"text",n);e(`${t.nick} is ${t.mask} * ${t.nick}`),t.trip&&e(`${t.nick} is identified by tripcode ${t.trip}`),t.op&&e(`${t.nick} is a channel operator on ${Pt}`),e(`${t.nick} signed on ${new Date(t.signon).toLocaleString()}`),e(`${t.nick} End of /WHOIS list.`)}chatError(t,e){var r;const n=this.wins[Pt],i=e.replace(/^(\S+) :/,"$1 ");this.push(n.joined?Pt:"status","error",`* ${i}`),!n.joined&&(t==="432"||t==="433")&&((r=this.link)==null||r.close(),this.link=null,this.livingOnce=!1,this.livingSeenAt=0,this.connectDialog(e.replace(/^\S+ :/,"")))}dropped(t,e,n){const i=this.wins[Pt],r=i.joined;i.joined=!1,i.nicks.clear(),this.nicksChanged(Pt),n?this.push(Pt,"info",`* ${this.me} is connected from somewhere else now (another window?); this one let go`):r&&!e&&this.push(Pt,"info",`* Disconnected${t?" (reconnecting...)":""}`),this.push("status","info",`* Disconnected from ${Pt}${t?" (reconnecting...)":""}`),t||(this.link=null,this.livingOnce=!1,this.livingSeenAt=0,this.renameMe(gc))}renameMe(t){if(t===this.me)return;const e=this.wins[Ft];e.joined&&(e.rename(this.me,t),this.nicksChanged(Ft)),this.me=t,this.retitle()}say(t){var a,l,c,h,u,d;const e=t.trim();if(!e)return;const n=this.view,i=n===Pt&&this.wins[Pt].joined&&!!this.link,r=f=>this.push(n,"error",`* ${f}`);if(e.startsWith("/")&&!e.startsWith("//")){const[f="",...p]=e.slice(1).split(/\s+/),v=p.join(" ");switch(f.toLowerCase()){case"help":this.help();return;case"clear":this.wins[n].log.replaceChildren();return;case"quit":case"exit":this.win.close();return;case"join":{const m=(p[0]??"").toLowerCase().replace(/^#?/,"#");m===Pt||m==="#"&&n==="status"?this.joinLiving():m===Ft?(this.show(Ft),this.push(Ft,"error",`* You are already on ${Ft}`)):r(`${p[0]??"#"} Cannot join channel (this network has ${Ft} and ${Pt})`);return}case"part":case"leave":n===Pt&&this.link?this.partLiving():r(n===Ft?`${Ft} will not let you go`:"You are not on a channel");return;case"nick":p[0]?(a=this.link)!=null&&a.send({type:"nick",nick:p[0]})||r(`Join ${Pt} first to have a name (/join ${Pt})`):r("Usage: /nick <newnick>");return;case"whois":p[0]?(l=this.link)!=null&&l.send({type:"whois",nick:p[0]})||r(`${p[0]} :No such nick`):r("Usage: /whois <nick>");return;case"me":if(!v)return;i?(c=this.link)==null||c.send({type:"say",text:v,action:!0}):n===Ft?this.refused(`* ${this.me} ${v}`,"action"):r("You are not on a channel");return;case"topic":i&&v?(h=this.link)==null||h.send({type:"topic",text:v}):i?this.push(Pt,"topic",`* Topic is '${this.wins[Pt].topic}'`):r(`${n==="status"?"":`${n} `}You're not channel operator`);return;case"kick":i&&p[0]?(u=this.link)==null||u.send({type:"kick",nick:p[0],reason:p.slice(1).join(" ")}):r(i?"Usage: /kick <nick> [reason]":"You're not channel operator");return;default:r(`${f.toUpperCase()} Unknown command`);return}}const o=e.startsWith("//")?e.slice(1):e;i?(d=this.link)!=null&&d.send({type:"say",text:o})||r("Not connected"):n===Ft&&this.wins[Ft].joined?this.refused(`<${this.me}> ${o}`,"own"):r("You are not on a channel")}refused(t,e){this.push(Ft,e,t),this.push(Ft,"error",`* ${Ft} Cannot send to channel`),this.hintedOikos||(this.hintedOikos=!0,this.push(Ft,"info",`* (the living talk in ${Pt}: /join ${Pt})`))}help(){const t=e=>this.push(this.view,"info",e);t("* Commands:"),t(`*   /join ${Pt}           join the living`),t("*   /nick <name>           change your nick"),t("*   /me <does something>   an action"),t("*   /whois <nick>          who someone is (their tripcode, if they have one)"),t(`*   /part                  leave ${Pt}`),t("*   /topic, /kick          for channel operators"),t("*   /clear  /quit")}push(t,e,n,i=Date.now()){var c;const r=this.wins[t],o=r.log,a=o.scrollHeight-o.scrollTop-o.clientHeight<24,l=$("div",{class:`mirc-row t-${e}`});for(l.append($("span",{class:"ts"},[sM(i)]),` ${n}`),o.append(l);o.childElementCount>eM;)(c=o.firstElementChild)==null||c.remove();a&&(o.scrollTop=o.scrollHeight),t!==this.view&&(t!=="status"&&(e==="text"||e==="action"||e==="own")?r.tab.classList.add("said"):r.tab.classList.contains("said")||r.tab.classList.add("event"))}show(t){this.view=t;for(const n of Object.values(this.wins)){const i=n.id===t;n.pane.hidden=!i,n.tab.classList.toggle("on",i),n.tab.setAttribute("aria-selected",String(i)),i&&n.tab.classList.remove("said","event")}const e=this.wins[t].log;e.scrollTop=e.scrollHeight,this.input.setAttribute("aria-label",t==="status"?"Command":`Message ${t}`),this.retitle()}nicksChanged(t){this.wins[t].render(),this.retitle()}setHung(t){this.hung!==t&&(this.hung=t,this.win.el.classList.toggle("mirc-hung",t),this.retitle())}retitle(){const t=this.wins[this.view],e=t.id===Ft?"+mnt":"+nt",n=t.id==="status"?`mIRC - [Status: ${this.me} on ${zn} (${mc})]`:t.joined?`mIRC - [${t.id} [${t.nicks.size}] [${e}]: ${t.topic}]`:`mIRC - [${t.id} (not on channel)]`;this.win.setTitle(this.hung?`${n} (Not Responding)`:n)}}const wr={back:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',forward:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',reload:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M12.6 6A5 5 0 1 0 13 9.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M13.4 2.6v3.8H9.6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',go:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.5 2.5h4v4M13.5 2.5 8.5 7.5M6.5 13.5h-4v-4M2.5 13.5l5-5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',out:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 3.5 9 9m0-9-9 9" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'},lM=new Set(["/","/oikos","/oikos/","/~"]);function zd(s){return s.origin===location.origin&&lM.has(s.pathname)}class cM{constructor(t,e,n){R(this,"el");R(this,"frame");R(this,"hooks");R(this,"backBtn");R(this,"forwardBtn");R(this,"input");R(this,"stack",[]);R(this,"i",-1);R(this,"pending",null);this.frame=t,this.hooks=n,this.el=$("div",{class:"oikos-tuned",role:"toolbar","aria-label":e});const i=(c,h,u)=>{const d=$("button",{type:"button",class:"nb","aria-label":c,title:c,html:h});return d.addEventListener("click",u),d};this.backBtn=i("Back",wr.back,()=>this.step(-1)),this.forwardBtn=i("Forward",wr.forward,()=>this.step(1));const r=i("Reload",wr.reload,()=>this.reload()),o=$("label",{class:"addr"});o.append($("span",{class:"host"},[location.host])),this.input=$("input",{type:"text",spellcheck:"false",autocomplete:"off","aria-label":"Address"}),this.input.addEventListener("focus",()=>this.input.select()),this.input.addEventListener("keydown",c=>{c.key==="Enter"?(c.preventDefault(),this.open(this.input.value),this.frame.focus()):c.key==="Escape"&&this.input.value!==this.current()&&(c.preventDefault(),this.input.value=this.current())}),o.append(this.input);const a=i("Go to this page",wr.go,()=>this.hooks.leave(this.current()||"/")),l=i("Tune Out",wr.out,()=>this.hooks.tuneOut());this.el.append(this.backBtn,this.forwardBtn,r,o,a,l,$("i",{class:"load"})),t.addEventListener("load",()=>this.loaded()),this.loading(!0),this.render()}place(t){const e=this.el.offsetHeight||32,n=t.top-e-6>=4?t.top-e-6:t.top+4;this.el.style.left=`${Math.max(4,t.left)}px`,this.el.style.width=`${Math.max(240,Math.min(t.width,innerWidth-8))}px`,this.el.style.top=`${n}px`}current(){return this.stack[this.i]??""}win(){var t;try{return(t=this.frame.contentWindow)==null||t.location.href,this.frame.contentWindow}catch{return null}}navigate(t,e){const n=this.win();n&&(this.pending=e,this.loading(!0),n.location.replace(t))}step(t){const e=this.stack[this.i+t];e!==void 0&&this.navigate(e,t<0?"back":"forward")}reload(){const t=this.win();t&&(this.pending="reload",this.loading(!0),t.location.reload())}open(t){let e;try{e=new URL(t.trim()||"/",location.origin)}catch{this.input.value=this.current();return}if(e.origin!==location.origin){window.open(e.href,"_blank","noopener"),this.input.value=this.current();return}if(zd(e)){this.hooks.tuneOut();return}this.navigate(e.pathname+e.search+e.hash,"go")}loaded(){this.loading(!1);const t=this.win();if(!t){this.pending=null,this.render();return}const e=new URL(t.location.href);if(zd(e)&&t.document.getElementById("oikos")){this.hooks.tuneOut();return}this.dress(t.document);const n=e.pathname+e.search+e.hash,i=this.pending;this.pending=null,i==="back"?this.i=Math.max(0,this.i-1):i==="forward"&&(this.i=Math.min(this.stack.length-1,this.i+1)),i==="reload"||i==="back"||i==="forward"?this.stack[this.i]=n:n!==this.current()&&(this.stack=this.stack.slice(0,this.i+1),this.stack.push(n),this.i=this.stack.length-1),this.watch(t),this.render()}dress(t){try{if(t.contentType!=="text/plain"||!t.head)return;const e=t.createElement("style");e.textContent="html { background: #0c0605; color: #ead2b6; color-scheme: dark; }body { margin: 0; padding: 28px 34px; }pre { font: 15px/1.6 'IBM Plex Mono', ui-monospace, monospace; white-space: pre-wrap; text-shadow: 0 0 6px rgba(255, 140, 60, 0.25); }",t.head.append(e)}catch{}}watch(t){t.addEventListener("pagehide",()=>this.loading(!0)),t.addEventListener("click",e=>{var o,a;if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const n=(a=(o=e.target)==null?void 0:o.closest)==null?void 0:a.call(o,"a[href]");if(!n||n.target==="_blank"||n.hasAttribute("download"))return;let i;try{i=new URL(n.href,t.location.href)}catch{return}if(!/^https?:$/.test(i.protocol))return;const r=new URL(t.location.href);i.origin===r.origin&&i.pathname===r.pathname&&i.search===r.search&&i.hash||(e.preventDefault(),e.stopImmediatePropagation(),this.open(i.href))},!0)}loading(t){this.el.classList.toggle("loading",t)}render(){this.backBtn.disabled=this.i<=0,this.forwardBtn.disabled=this.i>=this.stack.length-1,document.activeElement!==this.input&&(this.input.value=this.current())}}class hM{constructor(t,e,n,i){R(this,"win");R(this,"statusLine");R(this,"timer",0);this.site=t,this.shell=e;const r=$("div");r.style.cssText="display:flex;flex-direction:column;min-height:0;flex:1;";const o=Ad({back:()=>this.shell.back(),forward:()=>this.shell.forward(),can:()=>({back:this.shell.canBack,forward:this.shell.canForward}),up:()=>this.shell.home(),folders:()=>d.toggleAttribute("hidden")}),a=Pd(t),l=Cd(On(t.accent),a,!1,()=>this.shell.open(t)).el,c=Rd();r.append(dc({File:()=>[...Fo(this.shell,t,!0),"sep",{label:"Close",run:()=>this.win.close()}],Edit:()=>Dd(this.shell,t),View:()=>Nd(this.shell,{toolbar:o.el,address:l,status:c.el,up:()=>this.shell.home(),refresh:()=>this.refresh()}),Favorites:()=>Id(this.shell),Help:()=>Ud(this.shell)}),o.el,l);const h=this.shell.onNav(()=>o.refresh()),u=$("div",{class:"xp-body"}),d=$("aside",{class:"xp-tasks"});u.append(d);const f=$("div",{class:"xp-content"});u.append(f),r.append(u),c.set("Done",Ld(t)),r.append(c.el);const p=$("div",{class:"xp-hero",html:On(t.accent,t.title)}),v=$("div");v.append($("h2",{},[t.title]),$("p",{},[t.tagline])),p.append(v),f.append(p);const m=$("button",{class:"xp-preview",type:"button","aria-label":Sr(t)}),g=this.shell.screens.get(t.id);g&&m.append(g.canvas),m.addEventListener("click",T=>this.shell.open(t,T)),f.append(m),f.append($("p",{class:"xp-about"},[t.about]));const x=this.note();x&&f.append($("div",{class:"xp-note"},[x]));const A=$("div",{class:"xp-actions"}),M=$("button",{class:"xp-btn default",type:"button"},[Sr(t)]);if(M.addEventListener("click",T=>this.shell.open(t,T)),A.append(M),t.tune&&this.shell.canTune){const T=$("button",{class:"xp-btn",type:"button"},["Tune In"]);T.addEventListener("click",()=>this.shell.tuneIn(t.id)),A.append(T)}if(t.id==="irc"){const T=$("button",{class:"xp-btn",type:"button"},["Join #aethera"]);T.addEventListener("click",()=>this.shell.chat("#aethera")),A.append(T)}f.append(A);const E=[{icon:ac(),label:Sr(t),run:()=>this.shell.open(t)},{icon:gd(),label:"Show in Room",run:()=>this.shell.look(t.id)}];t.tune&&this.shell.canTune&&E.splice(1,0,{icon:Oy(),label:"Tune In",run:()=>this.shell.tuneIn(t.id)}),t.id==="irc"&&E.splice(1,0,{icon:Ci("channel"),label:"Join #aethera",run:()=>this.shell.chat("#aethera")}),E.push({icon:By(),label:"Copy Address",run:()=>fc(this.shell,t)});const b=[{icon:yr(),label:"~",run:()=>this.shell.home()}];for(const T of qy[t.id]??[]){const I=this.shell.site(T);I&&b.push({icon:On(I.accent),label:I.title,run:()=>this.shell.play(I.id)})}const P=$("div",{class:"xp-details"});P.append($("b",{},[t.title]));const y=$("dl");for(const[T,I]of t.details)y.append($("dt",{},[T]),$("dd",{},[I]));P.append(y),this.statusLine=$("div",{class:"status"}),P.append(this.statusLine),d.append(br("tasks",E,!0),br("places",b),br("details",P)),this.win=n.open({id:`site:${t.id}`,title:`${t.title} — ${a.replace(/^https?:\/\//,"")}`,icon:On(t.accent),body:r,width:Math.round(Math.min(760,Math.max(440,innerWidth*.5))),dock:"right",onClose:()=>{h(),clearInterval(this.timer),g==null||g.canvas.remove(),i()}}),this.win.el.style.height="min(640px, calc(100% - 24px))",this.refresh(),this.timer=window.setInterval(()=>this.refresh(),2e3)}note(){const t=this.site;return t.id==="dreams"?"Going in wakes the dreamer; it sleeps again when everyone leaves. The frame here is the last one the chronicle kept.":t.id==="syrinx"?"It sings once woken. Yours lives in this browser alone.":t.id==="afterlife"?"It plays once woken. Yours lives in this browser alone.":null}refresh(){const{feeds:t}=this.shell;let e=!1,n="";switch(this.site.id){case"dreams":case"dreams-api":{const r=t.dreams.value;e=r.known&&r.awake,n=r.known?r.awake?`awake · frame ${r.frame.toLocaleString("en-US")}${r.viewers?` · ${r.viewers} watching`:""}`:"asleep":"no answer";break}case"chronicle":{const r=t.chronicle.value;e=r.known&&r.eras.some(o=>o.open),n=r.known?`${r.eraCount||r.eras.length} eras recorded`:"reading the core…";break}case"irc":{const r=t.irc.value;e=r.connected,n=r.connected?"live on #aethera":"connecting…";break}case"syrinx":{const r=t.creature.value;e=!!r,n=r?`yours: ${r.name}`:"not woken in this browser";break}case"afterlife":{const r=t.universe.value;e=!!r,n=r?`yours: generation ${r.generation.toLocaleString("en-US")}`:"no universe in this browser yet";break}default:return}this.statusLine.className=`status${e?" on":""}`,this.statusLine.innerHTML="<i></i><span></span>";const i=this.statusLine.querySelector("span");i&&(i.textContent=n)}}const Hd=2;class uM{constructor(t,e,n,i){R(this,"el");R(this,"menu");R(this,"buttons");R(this,"btns",new Map);R(this,"more");R(this,"shown",null);R(this,"clock");R(this,"moonEl");R(this,"start");R(this,"tip");R(this,"balloonEl");R(this,"balloonTimer",0);R(this,"dialogEl",null);this.root=t,this.shell=e,this.wm=n,this.hooks=i,this.el=$("nav",{class:"xp-taskbar","aria-label":"taskbar"}),this.start=$("button",{class:"xp-start",type:"button","aria-label":"æthera","aria-haspopup":"menu","aria-expanded":"false",html:'<span aria-hidden="true">æ</span>'}),this.buttons=$("div",{class:"xp-taskbuttons",role:"group","aria-label":"windows"}),this.more=$("button",{class:"xp-taskbtn xp-taskmore",type:"button","aria-label":"More windows",title:"More windows","aria-haspopup":"menu",hidden:""},["»"]),this.more.addEventListener("click",()=>{const a=this.more.getBoundingClientRect();ji(this.windowsMenu(),a.left,a.top-4,{returnTo:this.more,owner:this.more})});const r=$("div",{class:"xp-tray"}),o=$("span",{class:"tray-icon net",title:"Connected to the Wired",html:Ly()});this.moonEl=$("span",{class:"tray-icon dream",title:"dreams",html:pd(!1)}),this.clock=$("span",{class:"clock"}),r.append(o,this.moonEl,this.clock),this.el.append(this.start,this.buttons,this.more,r),t.append(this.el),this.menu=this.buildMenu(),t.append(this.menu),this.start.addEventListener("click",()=>this.toggleMenu()),this.el.addEventListener("keydown",a=>{var u;if(a.key!=="ArrowLeft"&&a.key!=="ArrowRight")return;const l=a.target;if(!l.closest(".xp-start, .xp-taskbtn"))return;a.preventDefault(),a.stopPropagation();const c=[this.start,...this.btns.values(),...this.more.hidden?[]:[this.more]],h=c.indexOf(l);(u=c[(h+(a.key==="ArrowRight"?1:-1)+c.length)%c.length])==null||u.focus()}),t.addEventListener("pointerdown",a=>{const l=a.target;!this.menu.hidden&&!l.closest(".xp-startmenu")&&!l.closest(".xp-start")&&!l.closest(".xp-menu")&&this.toggleMenu(!1)}),this.el.addEventListener("contextmenu",a=>{a.preventDefault(),a.stopPropagation();const l=a.target.closest(".xp-taskbtn"),c=l?this.wm.list.find(h=>h.opts.id===l.dataset.win):void 0;ji(c?c.systemMenu():this.barMenu(),a.clientX,a.clientY,{owner:(c==null?void 0:c.el)??null,returnTo:l})}),o.addEventListener("click",()=>this.balloon("Connected to the Wired",`${e.dir.sites.length} places`,this.trayAnchor())),this.tip=$("div",{class:"xp-tip",role:"tooltip",hidden:""}),this.balloonEl=$("div",{class:"xp-balloon",role:"status",hidden:""}),t.append(this.tip,this.balloonEl),n.on(()=>this.renderButtons()),addEventListener("resize",()=>this.fitButtons()),e.feeds.dreams.on(a=>{this.moonEl.innerHTML=pd(a.awake),this.moonEl.title=a.known?a.awake?`dreams: awake · frame ${a.frame.toLocaleString("en-US")}`:"dreams: asleep":"dreams: no answer"}),this.tick(),setInterval(()=>this.tick(),15e3)}tick(){this.clock.textContent=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}trayAnchor(){const t=this.el.getBoundingClientRect();return{x:t.right-60,y:t.top}}get startOpen(){return!this.menu.hidden}toggleMenu(t,e=!1){var i;const n=t??this.menu.hidden;n||Xe(),this.menu.hidden=!n,this.start.classList.toggle("open",n),this.start.setAttribute("aria-expanded",String(n)),n?(i=this.menu.querySelector("a,button"))==null||i.focus():e&&this.start.focus({preventScroll:!0})}barMenu(){return[{label:"Show the Desktop",run:()=>this.showDesktop(),disabled:!this.wm.list.some(t=>!t.minimized&&!t.opts.dialog)&&!this.shown},"sep",{label:"Lock the Taskbar",checked:!0,disabled:!0}]}showDesktop(){const t=this.wm.list.filter(i=>!i.opts.dialog&&!i.minimized);if(!t.length&&this.shown){const{windows:i,active:r}=this.shown;this.shown=null;for(const o of i)!o.closed&&o.minimized&&o.restore();r&&!r.closed&&!r.minimized&&r.focus();return}const e=i=>Number(i.el.style.zIndex)||0,n={windows:[...t].sort((i,r)=>e(i)-e(r)),active:this.wm.activeWindow};for(const i of t)i.minimize();this.shown=n}windowsMenu(){return this.wm.list.filter(t=>!t.opts.dialog).map(t=>({label:t.el.getAttribute("aria-label")??t.opts.title,icon:t.opts.icon,checked:this.wm.activeWindow===t&&!t.minimized,run:()=>t.minimized?t.restore():t.focus()}))}buildMenu(){const t=$("div",{class:"xp-startmenu",role:"menu","aria-label":"æthera",hidden:""}),e=$("header",{"aria-hidden":"true"});e.append($("span",{class:"avatar",html:No(40)}),$("span",{},["guest"])),t.append(e,$("div",{class:"orange","aria-hidden":"true"}));const n=$("div",{class:"cols",role:"none"}),i=$("ul",{class:"left",role:"group","aria-label":"places"}),r=$("ul",{class:"right",role:"group","aria-label":"other places"}),o=(b,P)=>{const y=$("li",{role:"none"});return y.append(P),b.append(y),P},a=(b,P,y,T,I,D="")=>{const N=$("button",{type:"button",role:"menuitem",class:D,html:`${P}<span><span class="tt"></span>${T!==null?"<small></small>":""}</span>`});N.querySelector(".tt").textContent=y;const H=N.querySelector("small");return H&&T&&(H.textContent=T),N.addEventListener("click",()=>{this.toggleMenu(!1),I()}),o(b,N)},l=(b,P,y,T)=>{const I=$("a",{href:T,role:"menuitem",html:`${P}<span></span>`});I.querySelector("span").textContent=y,o(b,I)},c=(b,P,y,T,I)=>{const D=$("button",{type:"button",role:"menuitem",class:`cascade ${T}`,"aria-haspopup":"menu","aria-expanded":"false","data-menu-owner":"",html:`${P}<span class="tt"></span><i class="arrow"></i>`});D.querySelector(".tt").textContent=y;const N=H=>{D.classList.add("open"),D.setAttribute("aria-expanded","true"),Td(I(),D,{onClose:()=>u(D),takeFocus:!H,focusFirst:!H&&ko()})};return D.addEventListener("click",()=>N(!1)),D.addEventListener("pointerenter",()=>N(!0)),o(b,D)},h=b=>b.append($("li",{class:"sep",role:"separator"})),u=b=>{b.classList.remove("open"),b.setAttribute("aria-expanded","false")};t.addEventListener("pointerover",b=>{const P=b.target.closest("li > a, li > button");P&&!P.classList.contains("cascade")&&Xe()});const d=b=>({label:b.title,icon:On(b.accent),run:()=>{this.toggleMenu(!1),this.shell.play(b.id)}});a(i,Ci(),"mIRC","#aethera",()=>this.shell.chat(),"pinned");const f=this.shell.dir.sites.filter(b=>b.group==="here");f.slice(0,Hd).forEach(b=>a(i,On(b.accent,b.title),b.title,b.kind,()=>this.shell.play(b.id),"pinned")),h(i),f.slice(Hd).forEach(b=>a(i,On(b.accent,b.title),b.title,null,()=>this.shell.play(b.id)));const p=$("li",{class:"allprog",role:"none"});i.append($("li",{class:"sep",role:"separator"}),p);const v=$("button",{type:"button",role:"menuitem",class:"cascade","aria-haspopup":"menu","aria-expanded":"false","data-menu-owner":"",html:`<span class="tt">all places</span>${Hy()}`}),m=b=>{v.classList.add("open"),v.setAttribute("aria-expanded","true"),Td([...this.shell.dir.sites.filter(P=>P.group==="here").map(d),"sep",...this.shell.dir.sites.filter(P=>P.group==="wired").map(d),"sep",{label:"~",icon:yr(),run:()=>{this.toggleMenu(!1),this.shell.home()}}],v,{onClose:()=>u(v),takeFocus:!b,focusFirst:!b&&ko()})};v.addEventListener("click",()=>m(!1)),v.addEventListener("pointerenter",()=>m(!0)),p.append(v),a(r,yr(),"~",null,()=>this.shell.home(),"strong");const g=this.shell.dir.posts.slice(0,8);g.length&&c(r,Uo("txt"),"recent transmissions","strong",()=>g.map(b=>({label:b.title,icon:Uo("txt"),run:()=>location.assign(b.href)}))),h(r);const x=this.shell.dir.sites.filter(b=>b.group==="wired");for(const b of x)a(r,On(b.accent),b.title,null,()=>this.shell.play(b.id));h(r);for(const b of this.shell.dir.files)l(r,Uo(b.title.split(".").pop()??"txt"),b.title,b.href);n.append(i,r),t.append(n);const A=$("div",{class:"foot",role:"group","aria-label":"Session"}),M=$("button",{type:"button",role:"menuitem",html:`${_d()}<span>Log Off</span>`});M.addEventListener("click",()=>{this.toggleMenu(!1),this.logOffDialog()});const E=$("button",{type:"button",role:"menuitem",html:`${vd()}<span>Turn Off</span>`});return E.addEventListener("click",()=>{this.toggleMenu(!1),this.shutdownDialog()}),A.append(M,E),t.append(A),t.addEventListener("keydown",b=>this.startKeys(b,[i,r,A])),t}startKeys(t,e){var d,f,p;const n=v=>[...v.querySelectorAll(":scope > li > a, :scope > li > button, :scope > button")],i=document.activeElement,r=e.findIndex(v=>!!i&&v.contains(i)),o=()=>{t.preventDefault(),t.stopPropagation()};if(t.key==="Escape"){o(),cc()?Xe():this.toggleMenu(!1,!0);return}if(t.key==="Tab"){o();const v=e.flatMap(n),m=v.indexOf(i);(d=v[(m+(t.shiftKey?-1:1)+v.length)%v.length])==null||d.focus();return}if(r<0||!i)return;const a=e[r],l=n(a),c=l.indexOf(i),h=r===e.length-1,u=h?["ArrowLeft","ArrowRight"]:["ArrowUp","ArrowDown"];if(u.includes(t.key)||t.key==="Home"||t.key==="End"){o();const v=t.key==="Home"?0:t.key==="End"?l.length-1:(c+(t.key===u[1]?1:-1)+l.length)%l.length;(f=l[v])==null||f.focus()}else if(t.key==="ArrowRight"&&i.classList.contains("cascade"))o(),i.click();else if((t.key==="ArrowRight"||t.key==="ArrowLeft")&&!h){o();const v=n(e[r===0?1:0]),m=i.getBoundingClientRect().top,g=v.reduce((x,A)=>!x||Math.abs(A.getBoundingClientRect().top-m)<Math.abs(x.getBoundingClientRect().top-m)?A:x,null);g==null||g.focus()}else t.key==="ArrowDown"&&h?o():t.key==="ArrowUp"&&h&&(o(),(p=n(e[0]).at(-1))==null||p.focus())}dismiss(){return this.dialogEl?(this.dialogEl.remove(),this.dialogEl=null,this.start.focus(),!0):!1}get dialogUp(){return!!this.dialogEl}bigDialog(t,e){var l,c;(l=this.dialogEl)==null||l.remove();const n=$("div",{class:"xp-shutdown",role:"dialog","aria-modal":"true","aria-label":t});this.dialogEl=n;const i=$("div",{class:"panel"});i.append($("header",{html:`<span></span>${No(28,!1)}`})),i.querySelector("header span").textContent=t;const r=$("div",{class:"choices"});for(const h of e){const u=$("button",{type:"button",class:h.cls,html:`<i>${h.icon}</i><span>${h.label}</span>`}),d=h.run;d?u.addEventListener("click",()=>{n.remove(),this.dialogEl=null,d()}):u.disabled=!0,r.append(u)}i.append(r);const o=$("div",{class:"foot"}),a=$("button",{class:"xp-btn",type:"button"},["Cancel"]);a.addEventListener("click",()=>this.dismiss()),o.append(a),i.append(o),n.append(i),this.root.append(n),(c=r.querySelector("button:not(:disabled):last-of-type, button:not(:disabled)"))==null||c.focus()}logOffDialog(){this.bigDialog("Log Off æthera",[{cls:"switch",icon:yd(),label:"Switch User"},{cls:"logoff",icon:_d(),label:"Log Off",run:()=>this.hooks.logOff()}])}shutdownDialog(){var t,e;this.bigDialog("Turn Off æthera",[{cls:"standby",icon:zy(),label:"Stand By",run:()=>this.hooks.standby(!0)},{cls:"off",icon:vd(),label:"Turn Off",run:()=>this.hooks.turnOff()},{cls:"restart",icon:yd(),label:"Restart",run:()=>this.hooks.restart()}]),(e=(t=this.dialogEl)==null?void 0:t.querySelector(".off"))==null||e.focus()}renderButtons(){const t=this.wm.list.filter(e=>!e.opts.dialog);for(const[e,n]of this.btns)t.includes(e)||(n.remove(),this.btns.delete(e));for(const e of t){let n=this.btns.get(e);n||(n=$("button",{class:"xp-taskbtn",type:"button","data-win":e.opts.id,html:`${e.opts.icon}<span></span>`}),n.addEventListener("click",()=>{e.minimized?e.restore():this.wm.activeWindow===e?e.minimize():e.focus()}),this.btns.set(e,n),this.buttons.append(n));const i=this.wm.activeWindow===e&&!e.minimized;n.classList.toggle("active",i),n.setAttribute("aria-pressed",String(i));const r=n.querySelector("span"),o=e.el.getAttribute("aria-label")??e.opts.title;r.textContent!==o&&(r.textContent=o),n.title=o}this.shown&&t.some(e=>!e.minimized)&&(this.shown=null),this.fitButtons()}fitButtons(){const t=this.buttons;this.more.hidden=!0;const e=t.scrollWidth>t.clientWidth+1;if(this.more.hidden=!e,!e){t.scrollLeft=0;return}const n=[...this.btns.values()].find(r=>r.classList.contains("active"));if(!n)return;const i=n.offsetLeft-t.offsetLeft;i<t.scrollLeft?t.scrollLeft=i:i+n.offsetWidth>t.scrollLeft+t.clientWidth&&(t.scrollLeft=i+n.offsetWidth-t.clientWidth)}showTip(t,e,n,i){const r=t?{title:t.title,text:t.tagline}:e;if(!r){this.tip.hidden=!0;return}this.tip.innerHTML="<b></b><span></span>",this.tip.querySelector("b").textContent=r.title,this.tip.querySelector("span").textContent=r.text,this.tip.hidden=!1;const o=this.root.getBoundingClientRect(),a=this.tip.offsetWidth;this.tip.style.left=`${Math.min(n+14,o.width-a-6)}px`,this.tip.style.top=`${Math.min(i+20,o.height-70)}px`}balloon(t,e,n,i=7e3,r=!1){var f;const o=this.balloonEl;o.innerHTML=`<b>${xd()}<span></span></b><span class="msg"></span><button class="x" type="button" aria-label="Close">✕</button>`,o.querySelector("b span").textContent=t,o.querySelector(".msg").textContent=e,(f=o.querySelector(".x"))==null||f.addEventListener("click",()=>o.hidden=!0),o.hidden=!1;const a=this.root.getBoundingClientRect(),l=n??this.trayAnchor(),c=o.offsetWidth,h=o.offsetHeight,u=Math.max(6,Math.min(l.x-30,a.width-c-6)),d=r?l.y+h+24>a.height-30:l.y-h-20>0;o.classList.toggle("above",d),o.classList.toggle("below",!d),o.style.left=`${u}px`,o.style.top=`${d?l.y-h-18:l.y+18}px`,o.style.setProperty("--tail",`${Math.max(12,Math.min(c-30,l.x-u))}px`),clearTimeout(this.balloonTimer),this.balloonTimer=window.setTimeout(()=>o.hidden=!0,i)}hideBalloon(){this.balloonEl.hidden=!0}}const Mc=340,bc=260,Sc=28,dM=1e5,fM=140,pM=["n","s","e","w","ne","nw","se","sw"];class mM{constructor(t,e){R(this,"el");R(this,"minimized",!1);R(this,"closed",!1);var o,a,l,c,h;this.opts=t,this.wm=e;const n=document.createElement("section");n.className=`xp-window${t.dialog?" xp-dialog":""}`,n.setAttribute("role",t.dialog?"alertdialog":"dialog"),n.setAttribute("aria-label",t.title),n.dataset.win=t.id,n.tabIndex=-1,n.innerHTML=`
      <header class="xp-titlebar">
        <span class="xp-title-icon">${t.icon}</span>
        <span class="xp-title"></span>
        <span class="xp-controls">
          ${t.dialog?"":'<button class="xp-min" aria-label="Minimize" title="Minimize"></button><button class="xp-max" aria-label="Maximize" title="Maximize"></button>'}
          <button class="xp-close" aria-label="Close" title="Close"></button>
        </span>
      </header>`;const i=n.querySelector(".xp-title");i&&(i.textContent=t.title),n.append(t.body),n.style.width=`${t.width}px`,this.el=n,(o=n.querySelector(".xp-close"))==null||o.addEventListener("click",()=>this.close()),(a=n.querySelector(".xp-min"))==null||a.addEventListener("click",()=>this.minimize()),(l=n.querySelector(".xp-max"))==null||l.addEventListener("click",()=>this.toggleMax()),n.addEventListener("pointerdown",()=>this.focus(),!0),n.addEventListener("keydown",u=>{u.key==="Tab"&&!u.altKey&&!u.ctrlKey&&!u.metaKey?this.wm.trapTab(this,u):u.key===" "&&u.altKey&&(u.preventDefault(),this.openSystemMenu(!0))}),this.bindDrag(n.querySelector(".xp-titlebar")),t.dialog||this.bindResize(),(c=n.querySelector(".xp-titlebar"))==null||c.addEventListener("dblclick",u=>{const d=u.target;d.closest(".xp-controls")||t.dialog||(d.closest(".xp-title-icon")?this.close():this.toggleMax())});const r=n.querySelector(".xp-title-icon");r==null||r.setAttribute("data-menu-owner",""),r==null||r.addEventListener("click",u=>{u.stopPropagation(),this.openSystemMenu(!1)}),(h=n.querySelector(".xp-titlebar"))==null||h.addEventListener("contextmenu",u=>{const d=u;d.target.closest(".xp-controls")||(d.preventDefault(),d.stopPropagation(),ji(this.systemMenu(),d.clientX,d.clientY,{owner:this.el}))})}get maximized(){return this.el.classList.contains("maximized")}openSystemMenu(t){const e=this.el.getBoundingClientRect();ji(this.systemMenu(),e.left+3,e.top+29,{owner:this.el,focusFirst:t||ko(),returnTo:this.el})}systemMenu(){const t=!!this.opts.dialog;return[{label:"Restore",run:()=>this.minimized?this.restore():this.toggleMax(),disabled:t||!this.maximized&&!this.minimized},{label:"Move",disabled:!0},{label:"Size",disabled:!0},{label:"Minimize",run:()=>this.minimize(),disabled:t||this.minimized},{label:"Maximize",run:()=>{this.minimized&&this.restore(),this.maximized||this.toggleMax()},disabled:t||this.maximized},"sep",{label:"Close",run:()=>this.close(),bold:!0}]}setTitle(t){const e=this.el.querySelector(".xp-title");e&&(e.textContent=t),this.el.setAttribute("aria-label",t),this.wm.changed()}place(t,e){const n=t.clientWidth,i=t.clientHeight,r=Math.min(this.opts.width,n-16);this.el.style.width=`${r}px`,t.append(this.el);const o=Math.min(this.el.offsetHeight,i-16);let a=this.opts.x??0,l=this.opts.y??0;this.opts.x===void 0&&(this.opts.dock==="left"?a=18:this.opts.dock==="right"?a=n-r-18:a=(n-r)/2),this.opts.y===void 0&&(l=this.opts.dialog?(i-o)/2.4:Math.max(8,Math.min(60,(i-o)/2))),e&&!this.opts.dialog&&this.wm.crowded(this,a,l,r,o)&&(a=e.el.offsetLeft+Sc,l=e.el.offsetTop+Sc,a+r>n-8&&(a=Math.max(8,e.el.offsetLeft-Sc)),l+o>i-8&&(l=8)),this.moveTo(a,l)}moveTo(t,e){const n=this.el.parentElement;if(!n)return;const i=n.clientWidth-60,r=n.clientHeight-30;this.el.style.left=`${Math.round(Math.max(-this.el.offsetWidth+fM,Math.min(i,t)))}px`,this.el.style.top=`${Math.round(Math.max(0,Math.min(r,e)))}px`}bindDrag(t){let e=null,n=null;t.addEventListener("pointerdown",r=>{r.target.closest(".xp-controls, .xp-title-icon")||r.button!==0||Mr()||(this.maximized?(n={x:r.clientX,y:r.clientY},e=null):e={x:r.clientX,y:r.clientY,left:this.el.offsetLeft,top:this.el.offsetTop},t.setPointerCapture(r.pointerId))}),t.addEventListener("pointermove",r=>{if(n){if(Math.hypot(r.clientX-n.x,r.clientY-n.y)<6)return;const o=this.el.parentElement;if(!o)return;const a=o.getBoundingClientRect(),l=n.x-a.left,c=n.y-a.top;n=null,this.toggleMax();const h=this.el.offsetWidth,u=r.clientX-a.left-Math.min(l,Math.max(40,h-90)),d=r.clientY-a.top-c;this.moveTo(u,d),e={x:r.clientX,y:r.clientY,left:this.el.offsetLeft,top:this.el.offsetTop};return}e&&this.moveTo(e.left+r.clientX-e.x,e.top+r.clientY-e.y)});const i=()=>{e&&this.wm.changed(),e=null,n=null};t.addEventListener("pointerup",i),t.addEventListener("pointercancel",i)}bindResize(){for(const t of pM){const e=document.createElement("div");e.className=`xp-grip xp-grip-${t}`,e.setAttribute("aria-hidden","true"),this.el.append(e);let n=null;e.addEventListener("pointerdown",r=>{r.button!==0||this.maximized||Mr()||(r.preventDefault(),n={x:r.clientX,y:r.clientY,left:this.el.offsetLeft,top:this.el.offsetTop,w:this.el.offsetWidth,h:this.el.offsetHeight},e.setPointerCapture(r.pointerId),this.focus())}),e.addEventListener("pointermove",r=>{if(!n)return;const o=this.el.parentElement;if(!o)return;const a=r.clientX-n.x,l=r.clientY-n.y;let{left:c,top:h,w:u,h:d}=n;t.includes("e")&&(u=Math.min(o.clientWidth-c,Math.max(Mc,n.w+a))),t.includes("s")&&(d=Math.min(o.clientHeight-h,Math.max(bc,n.h+l))),t.includes("w")&&(u=Math.max(Mc,Math.min(n.left+n.w,n.w-a)),c=n.left+n.w-u),t.includes("n")&&(d=Math.max(bc,Math.min(n.top+n.h,n.h-l)),h=n.top+n.h-d),this.el.style.left=`${Math.round(c)}px`,this.el.style.top=`${Math.round(h)}px`,this.el.style.width=`${Math.round(u)}px`,this.el.style.height=`${Math.round(d)}px`,this.el.style.maxHeight="none"});const i=()=>{n&&this.wm.changed(),n=null};e.addEventListener("pointerup",i),e.addEventListener("pointercancel",i)}}clamp(){if(this.maximized||this.minimized||Mr())return;const t=this.el.parentElement;t&&(this.el.offsetWidth>t.clientWidth&&(this.el.style.width=`${Math.max(Math.min(Mc,t.clientWidth),t.clientWidth-8)}px`),this.el.offsetHeight>t.clientHeight&&(this.el.style.height=`${Math.max(Math.min(bc,t.clientHeight),t.clientHeight-8)}px`),this.moveTo(this.el.offsetLeft,this.el.offsetTop))}focus(){this.wm.focus(this)}minimize(){this.closed||(this.minimized=!0,this.el.classList.add("minimized"),bd(this.el)&&Xe(),this.wm.focusTop(),this.wm.changed())}restore(){this.closed||(this.minimized=!1,this.el.classList.remove("minimized"),this.clamp(),this.focus())}toggleMax(){if(this.closed)return;const t=this.el.classList.toggle("maximized"),e=this.el.querySelector(".xp-max");e==null||e.setAttribute("aria-label",t?"Restore":"Maximize"),e==null||e.setAttribute("title",t?"Restore":"Maximize"),t||this.clamp(),this.focus()}close(){var t,e;this.closed||(this.closed=!0,bd(this.el)&&Xe(),this.el.remove(),this.wm.remove(this),(e=(t=this.opts).onClose)==null||e.call(t),this.wm.closed(this))}}class gM{constructor(t){R(this,"windows",[]);R(this,"active",null);R(this,"last",null);R(this,"z",30);R(this,"listeners",new Set);R(this,"closeListeners",new Set);this.desk=t,addEventListener("resize",()=>{for(const e of this.windows)e.clamp()})}get list(){return this.windows}get activeWindow(){return this.active}get(t){return this.windows.find(e=>e.opts.id===t)}open(t){const e=this.get(t.id);if(e)return e.minimized?e.restore():e.focus(),e;const n=new mM(t,this),i=this.last&&!this.last.closed&&!this.last.minimized?this.last:this.topmost();return this.windows.push(n),n.place(this.desk,i),t.dialog||(this.last=n),this.focus(n),n}topmost(){return this.windows.filter(t=>!t.minimized&&!t.opts.dialog).sort((t,e)=>Number(e.el.style.zIndex)-Number(t.el.style.zIndex))[0]??null}crowded(t,e,n,i,r){for(const o of this.windows){if(o===t||o.minimized||o.opts.dialog||o.maximized)continue;const a=Math.max(0,Math.min(e+i,o.el.offsetLeft+o.el.offsetWidth)-Math.max(e,o.el.offsetLeft)),l=Math.max(0,Math.min(n+r,o.el.offsetTop+o.el.offsetHeight)-Math.max(n,o.el.offsetTop));if(a*l>.25*i*r)return!0}return!1}focus(t){var n,i;if(t.closed)return;const e=this.active!==t;this.active=t,t.el.style.zIndex=String(++this.z+(t.opts.dialog?dM:0));for(const r of this.windows)r.el.classList.toggle("inactive",r!==t);!t.minimized&&!t.el.contains(document.activeElement)&&t.el.focus({preventScroll:!0}),e&&((i=(n=t.opts).onFocus)==null||i.call(n)),this.changed()}deactivate(){var e;if(!this.active)return;const t=this.active;this.active=null;for(const n of this.windows)n.el.classList.add("inactive");t.el.contains(document.activeElement)&&((e=document.activeElement)==null||e.blur()),this.changed()}focusTop(){const e=this.windows.filter(n=>!n.minimized).sort((n,i)=>Number(i.el.style.zIndex)-Number(n.el.style.zIndex))[0];if(e)this.focus(e);else{this.active=null;for(const n of this.windows)n.el.classList.add("inactive");this.changed()}}topDialog(){return this.windows.filter(t=>t.opts.dialog&&!t.minimized).sort((t,e)=>Number(e.el.style.zIndex)-Number(t.el.style.zIndex))[0]??null}trapTab(t,e){var o;const n=$y(t.el);if(e.preventDefault(),!n.length){t.el.focus({preventScroll:!0});return}const i=n.indexOf(document.activeElement),r=i<0?e.shiftKey?n.length-1:0:(i+(e.shiftKey?-1:1)+n.length)%n.length;(o=n[r])==null||o.focus()}remove(t){this.windows=this.windows.filter(e=>e!==t),this.last===t&&(this.last=null),this.active===t&&(this.active=null,this.focusTop()),this.changed()}closeTop(){const t=this.active&&!this.active.minimized?this.active:null;return t?(t.close(),!0):!1}on(t){return this.listeners.add(t),()=>this.listeners.delete(t)}onClose(t){return this.closeListeners.add(t),()=>this.closeListeners.delete(t)}closed(t){for(const e of this.closeListeners)e(t)}changed(){for(const t of this.listeners)t()}}const wc=document.getElementById("oikos");if(wc)try{vM(wc)}catch(s){console.error("oikos: boot failed; falling back to the plain directory",s),wc.classList.remove("oikos-live"),(Vd=document.getElementById("oikos-boot"))==null||Vd.remove()}function xM(){var s;try{const t=document.createElement("canvas").getContext("webgl2");return(s=t==null?void 0:t.getExtension("WEBGL_lose_context"))==null||s.loseContext(),!!t}catch{return!1}}function Er(){return location.pathname+location.search}function vM(s){var me,Me;s.classList.add("oikos-live");const t=matchMedia("(prefers-reduced-motion: reduce)").matches,e=hf(),n=new df,i=new Map(e.sites.map(S=>[S.id,hp(S,{dir:e,feeds:n})])),r=new Map(e.sites.map(S=>[S.id,S]));if(new URLSearchParams(location.search).has("contact")){_M(s,e.sites,i,n);return}const o=$("div",{id:"oikos-desktop"});s.append(o);const a=new gM(o);Xy(s);const l=S=>{const nt=S.opts.id;return nt==="home"?"~":nt==="mirc"?"mirc":nt.startsWith("site:")?nt.slice(5):null},c=()=>{try{return decodeURIComponent(location.hash.slice(1))}catch{return""}},h=S=>S?`${Er()}#${encodeURIComponent(S)}`:Er(),u={i:0,top:0,listeners:new Set},d=()=>{for(const S of u.listeners)S()};try{history.replaceState({oikos:0},"",location.href)}catch{}let f=c();const p=S=>{if(c()!==S){u.i+=1,u.top=u.i;try{history.pushState({oikos:u.i},"",h(S))}catch{}f=S,d()}},v=S=>{if(c()===S){try{history.replaceState({oikos:u.i},"",Er())}catch{}f=""}},m=()=>{const S=c(),nt=history.state;if(typeof(nt==null?void 0:nt.oikos)=="number")u.i=Math.max(0,Math.min(nt.oikos,u.top));else{u.i=u.top+1,u.top=u.i;try{history.replaceState({oikos:u.i},"",location.href)}catch{}}d(),S!==f&&(f=S,g(S,!1))};addEventListener("popstate",m),addEventListener("hashchange",m);function g(S,nt){S==="~"||S==="home"?z(nt):S==="mirc"?K(void 0,nt):r.has(S)?k(S,nt):S===""&&(Y(!1),a.deactivate())}let x=null,A=!1;const M=new Map;let E=null,b=null,P=null,y=!1,T=null,I=0;const D={dir:e,feeds:n,screens:i,site:S=>r.get(S),select(S){Y(!1),x==null||x.focus(S)},play(S){k(S,!0)},open(S,nt){if(nt==null||nt.preventDefault(),y)return;if(Nc(S.href)){window.open(S.href,"_blank","noopener");return}const _t=S.href;y=!0;let C=!1;const _=()=>{C||(C=!0,location.assign(_t))};x?x.dive(S.id).then(_):_(),setTimeout(_,1500)},look(S){Y(!1),x==null||x.focus(S)},get canTune(){return!!x},tuneIn(S){const nt=r.get(S);if(!x||!(nt!=null&&nt.tune))return;const _t=typeof nt.tune=="string"?nt.tune:nt.href;Y(!1);const C=a.activeWindow,_=Z=>Number(Z.el.style.zIndex)||0,U=a.list.filter(Z=>!Z.minimized&&!Z.opts.dialog).sort((Z,lt)=>_(Z)-_(lt));for(const Z of U)Z.minimize();H.hideBalloon();const O=$("div",{class:"oikos-tube"});O.style.setProperty("--glow",nt.accent);const X=$("iframe",{src:_t,title:`${nt.title}, live`,allow:"autoplay; fullscreen; clipboard-write"});O.append(X,$("i",{class:"roll"}),$("i",{class:"glass"})),X.addEventListener("load",()=>{var Z;try{(Z=X.contentWindow)==null||Z.addEventListener("keydown",lt=>{var ft;const St=lt.target;lt.key!=="Escape"||lt.defaultPrevented||(ft=St==null?void 0:St.closest)!=null&&ft.call(St,"input, textarea, [contenteditable]")||Y(!0)})}catch{}});const it=new cM(X,nt.title,{tuneOut:()=>Y(!0),leave:Z=>location.assign(Z)}),ct=it.el;T={id:S,bar:ct,hidden:U,active:C,tube:O};const J=Z=>{const lt=Math.round(Math.min(1024,Math.max(420,Z.width*1.15))),St=Math.round(lt*.75);O.style.width=`${lt}px`,O.style.height=`${St}px`,O.style.transform=`translate(${Z.left}px, ${Z.top}px) scale(${Z.width/lt}, ${Z.height/St})`,it.place(Z)};x.tuneIn(S,J).then(()=>{if((T==null?void 0:T.bar)!==ct)return;s.append(O,ct);const Z=x==null?void 0:x.glassRect(S);Z&&it.place(Z),X.focus()})},chat(S){K(S,!0)},home(){z(!0)},eject(){var nt;Y(!1);const S=E;S&&((nt=M.get(S))==null||nt.win.close()),E=null,x==null||x.eject(),x==null||x.focus(null)},balloon(S,nt,_t){H.balloon(S,nt,_t)},back:()=>{u.i>0&&history.back()},forward:()=>{u.i<u.top&&history.forward()},get canBack(){return u.i>0},get canForward(){return u.i<u.top},onNav(S){return u.listeners.add(S),()=>u.listeners.delete(S)},about:()=>tt()},N=new Ky(D,a),H=new uM(s,D,a,{standby:S=>pt(S),turnOff(){A=!0,s.classList.add("off"),setTimeout(()=>{Y(!0);for(const _t of[...a.list])_t.close();x==null||x.stop(),n.stop();const S=document.createElement("button");S.type="button",S.className="oikos-standby-led",S.setAttribute("aria-label","Turn on æthera"),s.append(S),S.focus({preventScroll:!0});const nt=()=>{try{sessionStorage.removeItem("oikos-booted")}catch{}location.assign(Er())};addEventListener("pointerdown",nt,{once:!0}),addEventListener("keydown",nt,{once:!0})},t?50:750)},logOff(){Y(!1);for(const S of[...a.list])S.close();E=null,x==null||x.eject(),x==null||x.focus(null);try{history.replaceState({oikos:u.i},"",Er())}catch{}f=""},restart(){try{sessionStorage.removeItem("oikos-booted")}catch{}location.reload()}});a.onClose(S=>{const nt=l(S);nt&&(v(nt),f===nt&&(f=""))}),a.on(()=>G());function Y(S){if(!T)return;const{id:nt,bar:_t,hidden:C,active:_,tube:U}=T;T=null,_t.remove(),U.remove(),x==null||x.tuneOut();for(const O of C)!O.closed&&O.minimized&&O.restore();_&&!_.closed&&!_.minimized?_.focus():_||a.deactivate(),S&&(x==null||x.focus(nt))}function k(S,nt){const _t=r.get(S);if(!_t)return;Y(!1),N.select(S);const C=M.get(S);if(C){E=S,x==null||x.play(S),C.win.minimized?C.win.restore():C.win.focus(),nt&&p(S);return}const _=++I,U=O=>{if(_!==I)return;if(!O){x==null||x.eject(),E=null;return}const X=M.get(S);if(X){X.win.focus();return}E=S;const it=new hM(_t,D,a,()=>{M.delete(S),E===S&&(E=null,x==null||x.eject()),(x==null?void 0:x.focusedId)===S&&x.focus(null),G()});M.set(S,it),G(),nt&&p(S)};x?(E=S,x.play(S).then(U)):U(!0)}function G(){const S=a.activeWindow,nt=S?l(S):null;let _t=nt&&M.has(nt)?nt:b&&M.has(b)?b:null;_t||(_t=[...M.keys()].at(-1)??null),_t!==b&&(b=_t,x==null||x.keepAlive(_t))}function z(S){Y(!1),N.open(),N.focusTiles(),x==null||x.scroll("cd ~"),S&&p("~")}function K(S,nt){Y(!1),P||(P=new aM(D,a,()=>P=null)),P.focus(S),nt&&p("mirc")}function tt(){var X;(X=a.get("about"))==null||X.close();const S=$("div",{class:"xp-about-box"}),nt=$("div",{class:"band",html:No(44,!0)});nt.append($("b",{},["æthera"]));const _t=$("div",{class:"xp-dialog-body"}),C=$("div");C.append($("p",{},["a room of screens, each one a place."]),$("p",{class:"lic"},["This product is licensed under CC BY 4.0 to:"]),$("p",{},["guest"])),_t.append(C);const _=$("div",{class:"xp-actions"}),U=$("button",{class:"xp-btn default",type:"button"},["OK"]);_.append(U),S.append(nt,_t,_);const O=a.open({id:"about",title:"About æthera",icon:xd(),body:S,width:400,dialog:!0});U.addEventListener("click",()=>O.close()),U.focus()}if(xM())try{x=new Ey(s,e.sites,i,{pick(S){zt(),H.hideBalloon(),H.showTip(null,null,0,0),S==="vcr"?D.home():S?D.play(S):x!=null&&x.focusedId&&!M.size&&!x.busy&&x.focus(null)},hover(S,nt,_t){S==="vcr"?H.showTip(null,{title:"æthera",text:"~"},nt,_t):H.showTip(S?r.get(S)??null:null,null,nt,_t)},context(S){S?H.hideBalloon():H.balloon("the room went dark","every place still opens.")}})}catch(S){console.warn("oikos: the room would not build; running the desktop alone",S),x==null||x.stop(),x=null}if(x==null||x.renderer.domElement.addEventListener("pointerdown",()=>a.deactivate()),Yy(s,(S,nt)=>{var U,O;const _t=S.closest(".xp-tile");if(_t)return _t.dataset.id?N.contextFor(_t.dataset.id):null;if(S.closest("a"))return null;if(S.closest(".xp-content")&&((O=(U=S.closest(".xp-window"))==null?void 0:U.getAttribute("aria-label"))!=null&&O.startsWith("~")))return N.blankMenu();if(S.closest(".xp-window, .xp-startmenu, .xp-shutdown, .xp-menu, .xp-balloon"))return[];if(!x||S!==x.renderer.domElement)return[];const C=x.pickFromPoint(nt.clientX,nt.clientY);if(C==="vcr")return[{label:"Open ~",bold:!0,run:()=>D.home()}];const _=C?r.get(C):void 0;return _?Fo(D,_):[{label:"Open ~",bold:!0,run:()=>D.home()},"sep",{label:"Refresh",run:()=>x==null?void 0:x.focus(null)}]}),!x){let S=performance.now();const nt=_t=>{var _;requestAnimationFrame(nt);const C=Math.min(.1,(_t-S)/1e3);S=_t;for(const U of M.keys())(_=i.get(U))==null||_.tick(_t/1e3,C,!0)};requestAnimationFrame(nt)}const ot=()=>{if(!x)return;const S=a.list.some(O=>{if(O.minimized||!O.maximized)return!1;const X=O.el.getBoundingClientRect();return X.top<=1&&X.height>=innerHeight-40});x.setVisibility(S?"glimpsed":"full");const nt=innerWidth,_t=innerHeight-30,C=a.list.filter(O=>!O.minimized&&!O.opts.dialog&&!O.el.classList.contains("maximized"));if(Mr()){x.setShift(0,C.length?_t*.3:0);return}let _=0,U=nt;for(const O of C){const X=O.el.getBoundingClientRect();X.left+X.width/2<nt/2?_=Math.max(_,X.right):U=Math.min(U,X.left)}U-_<nt*.22&&(_=0,U=nt),x.setShift(nt/2-(_+U)/2,0)};a.on(ot),addEventListener("resize",ot);let at=!1;function pt(S){at=S,s==null||s.classList.toggle("standby",S),S&&(x==null||x.focus(null))}function zt(){at&&pt(!1)}s.addEventListener("pointerdown",zt,!0);const xe=new Map(Object.entries(Po).map(([S,nt])=>[nt.channel,S])),jt=e.sites.map(S=>S.id).sort((S,nt)=>{var _t,C;return(((_t=Po[S])==null?void 0:_t.channel)??99)-(((C=Po[nt])==null?void 0:C.channel)??99)});let j="",ht=0;addEventListener("keydown",S=>{var C,_;if(at){zt();return}const nt=S.target,_t=!!nt.closest("input, textarea, [contenteditable]");if(!(_t&&(S.key!=="Escape"||S.defaultPrevented))){if(S.key==="Escape"&&T){Y(!0);return}if(!T){if(S.key==="Escape"){if(Xe()||H.dismiss())return;if(H.startOpen){H.toggleMenu(!1,!0);return}const U=a.topDialog();if(U){U.close();return}x!=null&&x.focusedId&&!a.activeWindow&&!_t&&x.focus(null);return}if(!_t){if(S.altKey&&(S.key==="ArrowLeft"||S.key==="ArrowRight")){S.preventDefault(),S.key==="ArrowLeft"?D.back():D.forward();return}if(S.key==="F10"&&!S.shiftKey){const U=(C=a.activeWindow)==null?void 0:C.el.querySelector(".xp-menutitle");U&&(S.preventDefault(),U.focus());return}if(S.key==="F6"){S.preventDefault();const U=a.activeWindow;U&&!U.el.contains(nt)?U.el.focus():(_=s.querySelector(".xp-start"))==null||_.focus();return}if(!(a.activeWindow||cc()||H.startOpen||H.dialogUp)&&!nt.closest(".xp-window, .xp-startmenu, .xp-menu, .xp-shutdown, .xp-taskbar, .xp-balloon, .oikos-tuned")&&!(S.ctrlKey||S.metaKey||S.altKey)){if(S.key==="~"||S.key==="Home"){D.home();return}if((S.key==="ArrowRight"||S.key==="ArrowLeft")&&!(x!=null&&x.busy)){const U=x!=null&&x.focusedId&&x.focusedId!=="vcr"?jt.indexOf(x.focusedId):-1,O=jt[(U+(S.key==="ArrowRight"?1:-1)+jt.length)%jt.length];if(O){x==null||x.focus(O),N.select(O);const X=x==null?void 0:x.anchor(O),it=r.get(O);X&&it&&H.showTip(it,null,X.x-40,X.y-50)}return}if(S.key==="Enter"&&(x!=null&&x.focusedId)&&x.focusedId!=="vcr"){D.play(x.focusedId);return}/^[0-9]$/.test(S.key)&&(j=(j+S.key).slice(-2),clearTimeout(ht),x==null||x.scroll(`ch ${j}`),ht=window.setTimeout(()=>{const U=xe.get(Number(j));j="",U&&r.has(U)&&D.play(U)},700))}}}}});let st=!1;document.addEventListener("visibilitychange",()=>{document.hidden?(x==null||x.stop(),n.stop(),T&&Y(!0)):st&&!A&&(x==null||x.start(),n.start())}),addEventListener("pageshow",S=>{S.persisted&&(y=!1,s.classList.remove("off"),x==null||x.reset())});const Et=document.getElementById("oikos-boot");let Ot=!1;try{Ot=!!sessionStorage.getItem("oikos-booted"),sessionStorage.setItem("oikos-booted","1")}catch{}const Nt=t||Ot?250:1900,pe=new Date,qt=Et==null?void 0:Et.querySelector(".boot-day");qt&&(qt.textContent=`day ${rd(pe)} · ${vr(pe.getHours())}:${vr(pe.getMinutes())}`);const ie=[...(Et==null?void 0:Et.querySelectorAll(".boot-slots i"))??[]].sort(()=>Math.random()-.5);let te=0;const Jt=(S,nt=90)=>{const _t=Math.min(ie.length,Math.ceil(S*ie.length));for(let C=0;te<_t;te++,C++){const _=ie[te];if(!_)break;setTimeout(()=>_.classList.add("on"),C*nt),setTimeout(()=>_.classList.add("settle"),C*nt+260)}};setTimeout(()=>Jt(.3),Ot||t?0:700);let ye=()=>{};const Ee=new Promise(S=>ye=S);Et==null||Et.addEventListener("click",()=>ye());const Te=Promise.race([Promise.all([(me=document.fonts)==null?void 0:me.load('16px "Libertinus Mono"'),(Me=document.fonts)==null?void 0:Me.load('16px "Love Letter Typewriter"')]).then(()=>{},()=>{}),new Promise(S=>setTimeout(S,1500))]);Te.then(()=>Jt(.6));const Ne=((x==null?void 0:x.warm())??Promise.resolve()).then(()=>Jt(.9));Promise.race([Promise.all([Te,Ne,new Promise(S=>setTimeout(S,Nt))]),Ee]).then(()=>{st=!0,document.hidden||(n.start(),x==null||x.start()),x==null||x.powerOn(),Jt(1,30),Et==null||Et.classList.add("ready"),setTimeout(()=>Et==null?void 0:Et.classList.add("gone"),Ot||t?0:280),setTimeout(()=>Et==null?void 0:Et.remove(),1100);const S=new URLSearchParams(location.search).get("look");S&&x&&(S==="vcr"||r.has(S))&&setTimeout(()=>x==null?void 0:x.focus(S),300);const nt=c();if(nt&&(nt==="~"||nt==="home"||nt==="mirc"||r.has(nt))){setTimeout(()=>g(nt,!1),nt==="mirc"||nt==="~"||nt==="home"?600:900);return}if(!x){z(!1),H.balloon("no room tonight","no WebGL in this browser. every place still opens.");return}})}function _M(s,t,e,n){var a;(a=document.getElementById("oikos-boot"))==null||a.remove();const i=$("div");i.style.cssText="position:absolute;inset:0;overflow:auto;padding:16px;display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));background:#0a0a0a;";for(const l of t){const c=e.get(l.id);if(!c)continue;const h=$("figure");h.style.cssText="margin:0;color:#aaa;font:12px ui-monospace,monospace;",c.canvas.style.cssText="width:100%;display:block;border:1px solid #333;";const u=$("figcaption",{},[`${l.title} · ${l.kind}`]);u.style.padding="4px 0",h.append(c.canvas,u),i.append(h)}s.append(i),n.start();let r=performance.now();const o=l=>{requestAnimationFrame(o);const c=Math.min(.1,(l-r)/1e3);r=l;for(const h of e.values())h.tick(l/1e3,c,!1)};requestAnimationFrame(o)}})();
