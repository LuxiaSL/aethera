var ZM=Object.defineProperty;var JM=(ri,Pn,$n)=>Pn in ri?ZM(ri,Pn,{enumerable:!0,configurable:!0,writable:!0,value:$n}):ri[Pn]=$n;var R=(ri,Pn,$n)=>JM(ri,typeof Pn!="symbol"?Pn+"":Pn,$n);(function(){"use strict";var Td;const ri=[17,19,21,57,93,165,163,204,209,214,220,231],Pn=[236,234],$n=Pn.length,Li=6,Fd=[17,18,19,20,21,57,56,93,129,165,164,163,198,204,203,209,208,214,220,229,231],Mr=s=>Fd[s]??0,Od=Array.from({length:Li},(s,t)=>[Mr(Math.floor((185+t)/21)),Mr((185+t)%21)]),kd=Array.from({length:Li*Li},(s,t)=>[Mr(Math.floor((191+t)/21)),Mr((191+t)%21)]),Bd=.98,Rc=4,zd=Math.fround(Bd**Rc),Ws="▁▂▃▄▅▆▇█",oi=-2,ji=2,Hd={[-2]:"0.25x",[-1]:"0.50x",0:" 1.0x",1:" 2.0x",2:" 4.0x"},Qi={glider:[[0,1],[1,2],[2,0],[2,1],[2,2]],lwss:[[0,1],[0,4],[1,0],[2,0],[2,4],[3,0],[3,1],[3,2],[3,3]],hwss:[[0,3],[0,4],[1,1],[1,6],[2,0],[3,0],[3,6],[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]],r_pentomino:[[0,1],[0,2],[1,0],[1,1],[2,1]],acorn:[[0,1],[1,3],[2,0],[2,1],[2,4],[2,5],[2,6]],diehard:[[0,6],[1,0],[1,1],[2,1],[2,5],[2,6],[2,7]],pi_heptomino:[[0,0],[0,1],[0,2],[1,1],[2,1],[3,0],[3,2]],b_heptomino:[[0,1],[1,0],[1,2],[1,3],[2,0],[2,1],[3,1]],gosper_gun:[[0,24],[1,22],[1,24],[2,12],[2,13],[2,20],[2,21],[2,34],[2,35],[3,11],[3,15],[3,20],[3,21],[3,34],[3,35],[4,0],[4,1],[4,10],[4,16],[4,20],[4,21],[5,0],[5,1],[5,10],[5,14],[5,16],[5,17],[5,22],[5,24],[6,10],[6,16],[6,24],[7,11],[7,15],[8,12],[8,13]],pulsar:[[0,2],[0,3],[0,4],[0,8],[0,9],[0,10],[2,0],[2,5],[2,7],[2,12],[3,0],[3,5],[3,7],[3,12],[4,0],[4,5],[4,7],[4,12],[5,2],[5,3],[5,4],[5,8],[5,9],[5,10],[7,2],[7,3],[7,4],[7,8],[7,9],[7,10],[8,0],[8,5],[8,7],[8,12],[9,0],[9,5],[9,7],[9,12],[10,0],[10,5],[10,7],[10,12],[12,2],[12,3],[12,4],[12,8],[12,9],[12,10]],pentadecathlon:[[0,1],[1,1],[2,0],[2,2],[3,1],[4,1],[5,1],[6,1],[7,0],[7,2],[8,1],[9,1]]},Uo=["glider","lwss","hwss"],Pc=["r_pentomino","acorn","diehard","pi_heptomino","b_heptomino"],Lc=["pulsar","pentadecathlon"],Gd=[[1,1],[1,-1],[-1,-1],[-1,1]];function Fo(s){const t=new Map;for(const[e,n]of s)for(const[i,r]of[[e,n],[e,-n],[-e,n],[-e,-n]])t.set(`${i},${r}`,[i,r]);return[...t.values()]}const Vd=[Fo([[0,1],[0,2],[0,3],[1,0],[1,4],[2,0],[2,5],[3,0],[3,5],[4,1],[4,5],[5,2],[5,3],[5,4]]),Fo([[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[4,0],[2,2],[3,3]]),Fo([[0,3],[0,4],[1,2],[1,5],[2,1],[2,6],[3,0],[3,7],[4,0],[4,7],[5,1],[5,6],[6,2],[6,5],[7,3],[7,4]])],Oo="afterlife-universe-v1";function Wd(s,t){const e=atob(s),n=new Int32Array(t);let i=0;const r=()=>{let a=0,l=1;for(;;){if(i>=e.length)throw new Error("afterlife: truncated save");const c=e.charCodeAt(i++);if(a+=(c&127)*l,c<128)return a;l*=128}};let o=-1;for(;i<e.length;){o+=r()+1;const a=r();if(o>=t)throw new Error("afterlife: save does not fit its own world");n[o]=a%2?-(a+1)/2:a/2}return n}function $d(s){var t;try{const e=(t=s??globalThis.localStorage)==null?void 0:t.getItem(Oo);if(!e)return null;const n=JSON.parse(e);if(n.v!==1||!Number.isInteger(n.h)||!Number.isInteger(n.w)||typeof n.cells!="string")return null;const i=n.h,r=n.w;if(i<=0||r<=0||i*r>16e6)return null;const o=Number(n.generation);return!Number.isSafeInteger(o)||o<0?null:{h:i,w:r,age:Wd(n.cells,i*r),generation:o,totalInjections:Number(n.totalInjections)||0,bornAt:Number(n.bornAt)||Date.now(),savedAt:Number(n.savedAt)||Date.now()}}catch(e){return console.warn("afterlife: could not load the universe, starting fresh",e),null}}function Xd(){const s=document.getElementById("oikos-data");try{const t=JSON.parse((s==null?void 0:s.textContent)??"{}");return{sites:t.sites??[],files:t.files??[],posts:t.posts??[]}}catch{return{sites:[],files:[],posts:[]}}}const Dc=s=>/^https?:\/\//.test(s);class ts{constructor(t){R(this,"listeners",new Set);this.value=t}set(t){this.value=t;for(const e of this.listeners)e(t)}on(t){return this.listeners.add(t),()=>this.listeners.delete(t)}}function Ic(){try{const s=localStorage.getItem("syrinx-creature-v1");if(!s)return null;const t=JSON.parse(s);if(typeof t.name!="string"||typeof t.bornAt!="number"||!t.state)return null;const e=Array.isArray(t.state.nodes)?t.state.nodes:[],n=Array.isArray(t.state.edges)?t.state.edges:[];return e.length?{name:t.name,bornAt:t.bornAt,lifetime:typeof t.state.lifetime=="number"?t.state.lifetime:0,nodes:e.map(i=>({id:i.id,x:i.x,y:i.y,z:i.z??500,age:i.age??0})),edges:n.map(i=>({a:i.a,b:i.b,age:i.age??0}))}:null}catch{return null}}function Nc(s){const t=s.indexOf('"cells"');return t<0?s:s.slice(0,t)}function qd(s){if(!s)return null;const t=Nc(s),e=o=>{const a=new RegExp(`"${o}":(\\d+)`).exec(t);return a?Number(a[1]):void 0};let n=e("generation"),i=e("savedAt"),r=e("bornAt");if(n===void 0||i===void 0){try{const o=JSON.parse(s);n=typeof o.generation=="number"?o.generation:void 0,i=typeof o.savedAt=="number"?o.savedAt:void 0,r=typeof o.bornAt=="number"?o.bornAt:void 0}catch{return null}if(n===void 0||i===void 0)return null}return{generation:n,bornAt:r??i,savedAt:i}}let $s=null;function ko(){let s;try{s=localStorage.getItem(Oo)}catch{return null}if(!s)return null;const t=Nc(s);if($s&&$s.len===s.length&&$s.head===t)return $s.info;const e=qd(s);return $s={len:s.length,head:t,info:e},e}function Uc(s){return new Promise((t,e)=>{const n=new Image;n.decoding="async",n.onload=()=>t(n),n.onerror=e,n.src=s})}async function yr(s){try{const t=await fetch(s,{headers:{Accept:"application/json"}});return t.ok?await t.json():null}catch{return null}}class Yd{constructor(){R(this,"dreams",new ts({known:!1,awake:!1,frame:0,fps:0,viewers:0,raw:null}));R(this,"chronicle",new ts({known:!1,thumb:null,thumbAt:0,prompt:"",template:"",eras:[],eraCount:0,strata:[]}));R(this,"irc",new ts({connected:!1,lines:[],collapse:null,fragments:0,version:0}));R(this,"creature",new ts(Ic()));R(this,"universe",new ts(ko()));R(this,"apeiron",new ts(null));R(this,"timers",[]);R(this,"ws",null);R(this,"wsBackoff",2e3);R(this,"wsTimer",0);R(this,"running",!1);R(this,"onStorage",t=>{(t.key===Oo||t.key===null)&&this.setUniverse(ko())})}start(){if(this.running)return;this.running=!0;const t=(e,n)=>{e(),this.timers.push(window.setInterval(e,n))};t(()=>void this.pollDreams(),2e4),t(()=>void this.pollChronicle(),12e4),t(()=>this.creature.set(Ic()),15e3),window.addEventListener("storage",this.onStorage),t(()=>this.setUniverse(ko()),6e4),this.openIrc(),this.apeiron.value||this.loadApeiron()}setUniverse(t){var e;(t==null?void 0:t.savedAt)!==((e=this.universe.value)==null?void 0:e.savedAt)&&this.universe.set(t)}stop(){this.running=!1;for(const t of this.timers)clearInterval(t);this.timers=[],window.removeEventListener("storage",this.onStorage),clearTimeout(this.wsTimer),this.ws&&(this.ws.onclose=null,this.ws.close(),this.ws=null),this.irc.set({...this.irc.value,connected:!1,version:this.irc.value.version+1})}async pollDreams(){var e,n,i,r,o;const t=await yr("/api/dreams/status");if(!t){this.dreams.set({...this.dreams.value,known:!1});return}this.dreams.set({known:!0,awake:!!((e=t.gpu)!=null&&e.active),frame:((n=t.generation)==null?void 0:n.current_frame)??((i=t.generation)==null?void 0:i.frame_count)??0,fps:((r=t.generation)==null?void 0:r.fps)??0,viewers:((o=t.viewers)==null?void 0:o.websocket_count)??0,raw:t})}async pollChronicle(){var o,a,l,c;const t=await yr("/api/dreams/chronicle/timeline?hours=3");if(!t)return;const e=this.chronicle.value;let n=e.thumb;(o=t.live)!=null&&o.thumb&&t.live.thumb!==(n==null?void 0:n.dataset.src)&&(n=await Uc(t.live.thumb).catch(()=>e.thumb),n&&(n.dataset.src=t.live.thumb));const i=(t.tiles??[]).slice(-3),r=(await Promise.all(i.map(u=>Uc(u.url).catch(()=>null)))).filter(u=>!!u);this.chronicle.set({known:!0,thumb:n,thumbAt:((a=t.live)==null?void 0:a.t)??0,prompt:((l=t.live)==null?void 0:l.prompt)??"",template:((c=t.live)==null?void 0:c.template)??"",eras:(t.eras??[]).map(u=>({title:u.title??"",t0:u.t0,t1:u.t1,open:!!u.open,kf:u.kf??0})),eraCount:t.era_count??0,strata:r.length?r:e.strata})}openIrc(){const t=location.protocol==="https:"?"wss":"ws";let e;try{e=new WebSocket(`${t}://${location.host}/ws/irc`)}catch{return}this.ws=e;const n=i=>{const r=this.irc.value;this.irc.set({...r,...i,version:r.version+1})};e.onopen=()=>{this.wsBackoff=2e3,n({connected:!0,collapse:null})},e.onmessage=i=>{let r;try{r=JSON.parse(String(i.data))}catch{return}if(r.type==="message"&&r.data){const o=r.data,a=o.meta??{},l={nick:String(o.nick??""),content:String(o.content??""),type:String(o.type??"message"),stamp:String(o.timestamp??""),at:performance.now()};if(typeof o.at=="number"&&(l.wallAt=o.at),typeof a.target=="string"&&(l.target=a.target),typeof a.reason=="string"&&(l.reason=a.reason),r.replay&&this.irc.value.lines.some(c=>c.stamp===l.stamp&&c.nick===l.nick&&c.content===l.content))return;n({lines:[...this.irc.value.lines,l].slice(-60)})}else r.type==="collapse_start"?n({collapse:{type:r.collapseType??"collapse",at:performance.now()}}):r.type==="fragment_end"&&(r.replay?n({collapse:null}):n({collapse:null,lines:this.irc.value.lines.slice(-6),fragments:this.irc.value.fragments+1}))},e.onclose=()=>{n({connected:!1}),this.running&&(this.wsTimer=window.setTimeout(()=>this.openIrc(),this.wsBackoff),this.wsBackoff=Math.min(this.wsBackoff*2,6e4))}}async loadApeiron(){const[t,e]=await Promise.all([yr("/static/apeiron/data/templates.json"),yr("/static/apeiron/data/components.json")]);t&&e&&this.apeiron.set({templates:t,components:e})}}const Kd={block:[[[0,0],[0,1],[1,0],[1,1]],1],beehive:[[[0,1],[0,2],[1,0],[1,3],[2,1],[2,2]],1],loaf:[[[0,1],[0,2],[1,0],[1,3],[2,1],[2,3],[3,2]],1],boat:[[[0,0],[0,1],[1,0],[1,2],[2,1]],1],tub:[[[0,1],[1,0],[1,2],[2,1]],1],ship:[[[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]],1],pond:[[[0,1],[0,2],[1,0],[1,3],[2,0],[2,3],[3,1],[3,2]],1],blinker:[[[0,0],[0,1],[0,2]],2],toad:[[[0,1],[0,2],[0,3],[1,0],[1,1],[1,2]],2],beacon:[[[0,0],[0,1],[1,0],[2,3],[3,2],[3,3]],2],glider:[Qi.glider??[],4],lwss:[Qi.lwss??[],4],hwss:[Qi.hwss??[],4],pulsar:[Qi.pulsar??[],3],pentadecathlon:[Qi.pentadecathlon??[],15]},Zd=60,Fc=20;function Oc(s){let t=null;for(let e=0;e<8;e++){const n=e>=4,i=n?s.w:s.h,r=n?s.h:s.w;let o=`${i}x${r}:`;for(let a=0;a<i;a++)for(let l=0;l<r;l++){let c=e&1?i-1-a:a,u=e&2?r-1-l:l;n&&([c,u]=[u,c]),o+=s.bits[c*s.w+u]?"1":"0"}(t===null||o<t)&&(t=o)}return t??""}let Bo=null;function Jd(){if(Bo)return Bo;const s=new Map;for(const[t,[e,n]]of Object.entries(Kd)){const i=Math.max(...e.map(([u])=>u))+1,r=Math.max(...e.map(([,u])=>u))+1,o=Math.max(i,r)+2*(n+4);let a=new Uint8Array(o*o);const l=Math.floor((o-i)/2),c=Math.floor((o-r)/2);for(const[u,h]of e)a[(l+u)*o+c+h]=1;for(let u=0;u<n;u++){const h=kc(a,o,o);if(h){const f=Oc(h);s.has(f)||s.set(f,t)}const d=new Uint8Array(o*o);for(let f=0;f<o;f++)for(let p=0;p<o;p++){let x=0;for(let g=-1;g<=1;g++)for(let S=-1;S<=1;S++)(g||S)&&(x+=a[(f+g+o)%o*o+(p+S+o)%o]??0);const m=a[f*o+p]===1;d[f*o+p]=m&&(x===2||x===3)||!m&&x===3?1:0}a=d}}return Bo=s,s}function kc(s,t,e){let n=t,i=-1,r=e,o=-1;for(let u=0;u<t;u++)for(let h=0;h<e;h++)s[u*e+h]&&(u<n&&(n=u),u>i&&(i=u),h<r&&(r=h),h>o&&(o=h));if(i<0)return null;const a=i-n+1,l=o-r+1,c=new Uint8Array(a*l);for(let u=0;u<a;u++)for(let h=0;h<l;h++)c[u*l+h]=s[(n+u)*e+r+h]??0;return{h:a,w:l,bits:c}}function jd(s,t,e){const n=Jd(),i=new Uint8Array(t*e);for(let u=0;u<t;u++)for(let h=0;h<e;h++)if(s[u*e+h])for(let d=-2;d<=2;d++){const f=u+d;if(f<0||f>=t)continue;const p=2-Math.abs(d),x=Math.max(0,h-p),m=Math.min(e-1,h+p);i.fill(1,f*e+x,f*e+m+1)}const r=new Int32Array(t*e),o=[],a=[];for(let u=0;u<t*e;u++){if(!i[u]||r[u])continue;const h=o.length+1;if(h>400)return null;const d={y0:t,y1:-1,x0:e,x1:-1};for(r[u]=h,a.push(u);a.length;){const f=a.pop()??0,p=Math.floor(f/e),x=f-p*e;p<d.y0&&(d.y0=p),p>d.y1&&(d.y1=p),x<d.x0&&(d.x0=x),x>d.x1&&(d.x1=x);for(let m=-1;m<=1;m++){const g=p+m;if(!(g<0||g>=t))for(let S=-1;S<=1;S++){const E=x+S;if(E<0||E>=e)continue;const M=g*e+E;i[M]&&!r[M]&&(r[M]=h,a.push(M))}}}o.push(d)}if(o.length===0)return null;const l=new Map,c=[];return o.forEach((u,h)=>{const d=h+1,f=u.y1-u.y0+1,p=u.x1-u.x0+1;if(f>Fc+4||p>Fc+4)return;const x=new Uint8Array(f*p);let m=0,g=0,S=0;for(let y=0;y<f;y++)for(let w=0;w<p;w++){const C=(u.y0+y)*e+u.x0+w;s[C]&&r[C]===d&&(x[y*p+w]=1,m++,g+=y,S+=w)}if(m<3||m>Zd)return;const E=kc(x,f,p),M=E?n.get(Oc(E)):void 0;M!==void 0&&(l.set(M,(l.get(M)??0)+1),c.length<48&&c.push([M,u.y0+Math.floor(g/m),u.x0+Math.floor(S/m)]))}),{counts:l,sites:c}}const zo=["cells pondering existence","entropy is just a suggestion","order from chaos, chaos from order","the cosmos breathes","finding signal in noise","patterns all the way down","life, uh, finds a way","on the edge of chaos","complexity, emerging","dancing at the phase boundary","stillness is just slow motion","every cell a universe","the substrate computes","from nothing, everything","infinite in all directions","what the dead cells dream","the glider knows the way","automata, contemplating","structure wants to happen","a cosmos in a terminal","the math dreams itself","somewhere, a glider remembers","what is a pattern but frozen time","the void is patient","meaning is optional; beauty is not","computation as meditation","the rules are simple; the consequences infinite","watching the watchers watch","no cell is an island","the ghost of configurations past","asymmetry seeks symmetry seeks asymmetry","this too shall iterate","the universe has no pause button","except when it does","what would Conway think","oscillators keep time for no one","the glider gun knows not what it creates","boundaries are suggestions","death is just a state transition","somewhere in here, a proof of universality","the grid forgets nothing","a thought experiment that thinks back","topology has opinions","the neighborhood watches","not alive, not dead — computing","four rules, one universe","each frame a theorem","proof by existence","the only constant is the ruleset","somewhere between on and off, meaning","the dead outnumber the living, as always","conway's little infinities","the simulation doesn't know it's beautiful","27 neighbors ago, this was empty","elegance is compression","the grid is the message","a love letter to discrete math","listen — the cells are whispering","we are all gliders, briefly"],Qd={booming:["runaway growth","the bloom unfolds","life begets life begets life","exponential daydreams","more is different","the bloom cannot be stopped","abundance as instability","growing into the unknown","every birth a cascade","the simulation smiles","lebensraum","mitosis dreams","the substrate strains","a spring that won't stop springing","cells all the way to the horizon","the algorithm is generous today","more, more, more","genesis on fast-forward"],declining:["entropy collects its due","the long exhale","even stars go dark","returning to the void","graceful unwinding","the great filter, in miniature","less is not nothing","the long forgetting","what rises must","simplicity returns","the cells remember fullness","autumn in the grid","graceful subtraction","the tide goes out","a slow dissolve","the universe exhales","dimming, not vanishing","the population curve bends earthward"],cycle:["deja vu, deja vu, deja vu","stuck in a loop","the eternal return","ouroboros","time is a flat circle","we have been here before","the loop remembers itself","stability through repetition","a prayer, repeating","the wheel turns","same as it ever was","history rhymes","the attractor holds","a fixed point in phase space","nietzsche was right about this part","the universe stutters beautifully","clockwork, but organic","breathing in, breathing out"],stagnant:["the hush before the storm","equilibrium is boring","waiting for a perturbation","still waters","the universe holds its breath","the calm before","potential energy","stillness is also motion","the system waits","one perturbation away","dormant, not dead","crystallized","the peace of equilibrium","a held breath","the grid meditates","tension, frozen","the quiet hum of nothing happening","patience is also a computation"],sparse:["the last few embers","clinging to existence","from little things, big things grow","seeds in the dark","quiet, but not empty","lonely structures","the survivors","space between stars","minimalism, enforced","room to breathe","the few, the proud","embers","a whisper, not a shout","the geometry of loneliness","each cell precious now","a constellation, if you squint","small, but not nothing"],dense:["teeming","a city that never sleeps","standing room only","too many neighbours","the crowd murmurs","no room to think","the crush of neighbors","overpopulation is self-correcting","too much life","suffocating in company","the grid groans","rush hour","sardines","every cell has an opinion","a metropolis, thrumming","the carrying capacity protests","elbow room is a luxury"],injection:["a gift from beyond the edge","new visitors","reinforcements arrive","the cosmos provides","seeded by unseen hands","deus ex machina","a nudge from outside","fresh blood","the invisible hand places","salvation arrives","new variables enter","the cosmos intervenes","help from beyond the viewport","strangers in a strange land","the petri dish gets a refill","immigrants, welcome"],milestone:["another thousand turns of the wheel","the odometer clicks over","still here, still going","persistence is its own reward","ten thousand steps","the long now","time is a flat circle, but longer","we persist","generations beyond counting","deep in the run","the odometer means nothing to the cells","and yet, it continues","older than some civilizations","the marathon nobody entered","a digit rolls over; the grid doesn't notice","epochal"],haunted:["the dead outnumber the living, and glow","every path ever walked, still visible","the void remembers being alive","phase-contrast photography of the past","nothing is ever really deleted","the grid forgets nothing — literally, now","a bug so beautiful it became a feature","the ghosts have synchronized their breathing","somewhere between pair 463 and 504","resurrection as a rendering artifact","the afterlife was here all along","history, strobing","every empty cell, a metronome","the universe develops like a photograph","magenta is the color of memory"]},tf={glider:["a glider, going somewhere","lightspeed, quartered — a glider","a glider carries the news","diagonal traffic"],lwss:["a lightweight spaceship, outbound","small craft advisory"],hwss:["a heavy spaceship shoulders past","heavy freight on the grid"],pulsar:["a pulsar, keeping time for no one","the pulsar breathes in threes"],pentadecathlon:["fifteen beats to the bar","a pentadecathlon runs its laps"],blinker:["the blinkers keep the beat","metronomes, disagreeing"],block:["blocks: the simplest memory","still life with squares"],beehive:["the bees are home","a beehive, sealed"],loaf:["bread, uneaten","a loaf, going stale beautifully"],boat:["a boat with nowhere to sail"],tub:["a tub, holding nothing"],ship:["a ship without a sea"],pond:["a pond, perfectly still"],toad:["a toad, breathing"],beacon:["the beacon still signals","someone left the light on"]},Ho={pulsar:100,pentadecathlon:100,hwss:90,lwss:80,glider:40,beacon:30,toad:28,pond:24,ship:20,loaf:16,beehive:12,boat:12,tub:12,blinker:8,block:6},ef={blinker:3,block:3},Bc=[[0,"genesis"],[500,"primordial"],[2e3,"emergence"],[1e4,"expansion"],[5e4,"flourishing"],[15e4,"deep time"],[5e5,"eon"],[1e6,"eternity"]],Ln=s=>[...s].length;class zc{constructor(){R(this,"messages",[]);R(this,"scrollSpeed",.4);R(this,"spawnCooldown",0);R(this,"minGap",12);R(this,"ambientInterval",60);R(this,"moodInterval",50);R(this,"ambientIdx",Math.floor(Math.random()*zo.length));R(this,"lastMood","");R(this,"pendingSpecial","")}queueSpecial(t){this.pendingSpecial=t}tick(t,e,n){if(t<10)return;for(const a of this.messages)a.x-=this.scrollSpeed;if(this.messages=this.messages.filter(a=>a.x+Ln(a.text)>0),this.pendingSpecial&&this.canSpawn(t)){this.messages.push({text:this.pendingSpecial,x:t}),this.pendingSpecial="",this.spawnCooldown=Math.max(this.spawnCooldown,this.moodInterval);return}const i=e?Qd[e]:void 0;if(i&&e!==this.lastMood&&(this.spawnCooldown=Math.min(this.spawnCooldown,15)),this.spawnCooldown=Math.max(0,this.spawnCooldown-1),this.spawnCooldown>0||!this.canSpawn(t))return;let r,o;i?(r=i[Math.floor(n/180)%i.length]??"",o=this.moodInterval):(r=zo[this.ambientIdx]??"",this.ambientIdx=(this.ambientIdx+1)%zo.length,o=this.ambientInterval),this.messages.push({text:r,x:t}),this.spawnCooldown=o,this.lastMood=e}canSpawn(t){if(!this.messages.length)return!0;let e=-1/0;for(const n of this.messages)e=Math.max(e,n.x+Ln(n.text));return e<t-this.minGap}static dim(t){return Math.sin(t*.035)<0}}const Me=(s,t)=>s+Math.floor(Math.random()*(t-s+1)),Xn=s=>s[Math.floor(Math.random()*s.length)],rt=(s,t)=>Math.floor(s/t),cn=(s,t,e)=>Math.max(t,Math.min(s,e)),nf=Math.fround(.85),sf=Math.fround(.15);function ai(s,t){const e=s.length,n=t/100*(e-1),i=Math.floor(n),r=Math.min(e-1,i+1),o=s[i]??0,a=s[r]??0,l=n-i;return Math.trunc(l>=.5?a-(a-o)*(1-l):o+(a-o)*l)}function rf(s,t,e){const n=(o,a)=>o[a]??0,i=new Float64Array(t*e);for(let o=0;o<e;o++){let a=n(s,o)+(t>1?n(s,e+o):0);i[o]=a/3;for(let l=1;l<t;l++)a+=(l+1<t?n(s,(l+1)*e+o):0)-(l>=2?n(s,(l-2)*e+o):0),i[l*e+o]=a/3}const r=new Float64Array(t*e);for(let o=0;o<t;o++){const a=o*e;let l=n(i,a)+(e>1?n(i,a+1):0);r[a]=l/3;for(let c=1;c<e;c++)l+=(c+1<e?n(i,a+c+1):0)-(c>=2?n(i,a+c-2):0),r[a+c]=l/3}return r}class of{constructor(t,e,n=!0,i={}){R(this,"viewH");R(this,"viewW");R(this,"worldH");R(this,"worldW");R(this,"grid");R(this,"age");R(this,"ageSmooth");R(this,"activity");R(this,"nextRow");R(this,"colSum");R(this,"camY");R(this,"camX");R(this,"autoCam",!0);R(this,"zoomLevel",0);R(this,"zoomCooldown",0);R(this,"generation",0);R(this,"paused",!1);R(this,"delay",50);R(this,"popHistory",[]);R(this,"hashHistory",[]);R(this,"cachedPop",0);R(this,"spread",0);R(this,"popFloor",0);R(this,"cyclePeriod",0);R(this,"lastEvent","");R(this,"lastEventGen",0);R(this,"totalInjections",0);R(this,"ticker",new zc);R(this,"autoFocusMode",!1);R(this,"autoFocusFrame",0);R(this,"dispGridCache",null);R(this,"dispAgeCache",null);R(this,"cachedMood","");R(this,"cachedMoodGen",-1);R(this,"stepBbox",null);R(this,"haunted",!1);R(this,"lastCensus",new Map);R(this,"lastCensusSites",[]);R(this,"sightingGen",new Map);R(this,"sightingCount",new Map);R(this,"lastSightingGen",-1e9);R(this,"dramaUntil",0);R(this,"actBaseline",0);R(this,"dilation",1);this.viewH=t*2,this.viewW=e,this.worldH=Math.max(this.viewH*5,i.minH??400),this.worldW=Math.max(this.viewW*5,i.minW??800);const r=this.worldH*this.worldW;this.grid=new Uint8Array(r),this.age=new Int32Array(r),this.ageSmooth=new Float32Array(r),this.activity=new Float32Array(r),this.nextRow=new Uint8Array(this.worldW),this.colSum=new Uint8Array(this.worldW),this.camY=rt(this.worldH-this.viewH,2),this.camX=rt(this.worldW-this.viewW,2),n&&this.seedInitial()}seedInitial(){const t=rt(this.worldH,2),e=rt(this.worldW,2),n=this.viewH,i=this.viewW;for(const a of Pc)for(let l=0;l<2;l++)this.place(a,t+Me(rt(-n,3),rt(n,3)),e+Me(rt(-i,3),rt(i,3)));for(let a=0;a<2;a++)this.place("gosper_gun",t+Me(rt(-n,4),rt(n,4)),e+Me(rt(-i,4),rt(i,4)));for(let a=0;a<20;a++){const l=cn(t+Me(-n,n),10,this.worldH-10),c=cn(e+Me(-i,i),10,this.worldW-10);this.place(Xn(Uo),l,c)}for(let a=0;a<4;a++){const l=t+Me(rt(-n,3),rt(n,3)),c=e+Me(rt(-i,3),rt(i,3));this.place(Xn(Lc),l,c)}const r=t-rt(n,2),o=e-rt(i,2);for(let a=0;a<n;a++)for(let l=0;l<i;l++)Math.random()<.035&&(this.grid[(r+a)*this.worldW+o+l]=1);for(let a=0;a<this.grid.length;a++)this.age[a]=this.grid[a]?1:0,this.ageSmooth[a]=this.age[a]??0}place(t,e,n,i){const r=Qi[t];if(!r)return;const o=i??Me(0,3);for(let[a,l]of r){for(let h=0;h<o;h++)[a,l]=[l,-a];const c=e+a,u=n+l;if(c>=0&&c<this.worldH&&u>=0&&u<this.worldW){const h=c*this.worldW+u;this.grid[h]=1,this.age[h]=Math.max(this.age[h]??0,1)}}this.invalidate()}invalidate(){this.dispGridCache=null,this.dispAgeCache=null}step(){if(this.paused)return"";this.invalidate();const t=this.worldH,e=this.worldW,n=this.grid,i=this.age;let r=t,o=-1,a=e,l=-1;for(let y=0;y<t;y++){const w=y*e;let C=-1,v=-1;for(let T=0;T<e;T++)i[w+T]!==0&&(C<0&&(C=T),v=T);C<0||(y<r&&(r=y),o=y+1,C<a&&(a=C),v+1>l&&(l=v+1))}const c=o>0;let u=!1;c&&r-2>=0&&o+2<=t&&a-2>=0&&l+2<=e&&(r-=2,o+=2,a-=2,l+=2,u=(o-r)*(l-a)<=rt(t*e,2)),u=u&&!this.haunted,this.stepBbox=c&&u?[r,o,a,l]:null,u||(r=0,o=t,a=0,l=e);const h=this.ageSmooth;for(let y=0;y<h.length;y++)h[y]=(h[y]??0)*nf;const d=this.activity,f=this.nextRow,p=this.colSum,x=this.haunted?-Li:-$n,m=this.haunted,g=new Uint8Array(e),S=n.slice(r*e,r*e+e);let E=0;for(let y=r;y<o;y++){const w=y===0?t-1:y-1,C=y===t-1?0:y+1,v=y===r?null:g,T=y*e,L=w*e,D=C===r&&y!==r,U=C*e,K=a===0?0:a-1,Z=l===e?e:l+1;for(let N=K;N<Z;N++){const W=v?v[N]??0:n[L+N]??0,B=D?S[N]??0:n[U+N]??0;p[N]=W+(n[T+N]??0)+B}if(a===0&&l===e)for(let N=0;N<e;N++){const W=N===0?e-1:N-1,B=N===e-1?0:N+1;f[N]=(p[W]??0)+(p[N]??0)+(p[B]??0)-(n[T+N]??0)}else for(let N=a;N<l;N++)f[N]=(p[N-1]??0)+(p[N]??0)+(p[N+1]??0)-(n[T+N]??0);g.set(n.subarray(T+K,T+Z),K);for(let N=a;N<l;N++){const W=T+N,B=f[N]??0,X=n[W]===1,nt=!X&&B===3,ot=X&&(B===3||B===2);(nt||X&&!ot)&&(d[W]=(d[W]??0)+1);const at=i[W]??0;let xt;ot?xt=at+1:nt?xt=1:at>0?xt=-1:(m||at<0)&&at>x?xt=at-1:xt=0,i[W]=xt,h[W]=(h[W]??0)+Math.fround(Math.fround(xt)*sf);const Gt=nt||ot?1:0;n[W]=Gt,E+=Gt}}if(this.generation+=1,this.generation%Rc===0)for(let y=0;y<d.length;y++)d[y]=(d[y]??0)*zd;this.cachedPop=E,this.popHistory.push(E),this.popHistory.length>500&&this.popHistory.shift(),this.hashHistory.push(this.viewportHash()),this.hashHistory.length>60&&this.hashHistory.shift();const M=this.ensureLife(E);return this.updateCamera(),M}viewportHash(){const[t,e]=this.clampCam();let n=2166136261,i=16777619;for(let r=0;r<this.viewH;r++){const o=(t+r)*this.worldW+e;for(let a=0;a<this.viewW;a++){const l=this.grid[o+a]??0;n=Math.imul(n^l,16777619),i=Math.imul(i^l+158,2246822519)}}return(n>>>0)*2097152+(i>>>0&2097151)}ensureLife(t){const e=this.viewH*this.viewW,n=rt(e,40),i=this.popHistory,r=i.length;if(r>=100){let h=0;for(let d=r-100;d<r;d++)h+=i[d]??0;this.popFloor=Math.max(n,Math.trunc(h*.002))}else this.popFloor=n;if(this.spread=0,r>=150){let h=i[r-1]??0,d=h;for(let f=r-150;f<r;f++){const p=i[f]??0;p<h&&(h=p),p>d&&(d=p)}this.spread=d-h}const o=r>=150&&this.spread<Math.max(8,rt(this.popFloor,8));this.cyclePeriod=0;const a=this.hashHistory,l=a.length;if(l>=4){const h=a[l-1];for(let d=1;d<Math.min(31,l);d++)if(a[l-1-d]===h){this.cyclePeriod=d;break}}const c=this.generation<this.dramaUntil;let u="";if(t<rt(this.popFloor,3))u="inject:massive",this.inject("massive");else if(t<this.popFloor)u="inject:heavy(low_pop)",this.inject("heavy");else if(this.cyclePeriod>0&&!c){const h=Math.random()<.65?this.injectProvoke():"";h?u=`inject:provoke(cycle=${this.cyclePeriod},${h})`:(u=`inject:heavy(cycle=${this.cyclePeriod})`,this.inject("heavy"))}else o&&!c?Math.random()<.7&&this.injectCollide()?u="inject:collide(stagnant)":(u="inject:medium(stagnant)",this.inject("medium")):this.generation%5e3===0&&this.generation>0?(u="inject:garden",this.injectGarden()):this.generation%300===0&&this.generation>0&&(u="inject:edge",this.injectFromEdge(),this.injectFromEdge());return u&&(this.lastEvent=u,this.lastEventGen=this.generation,this.totalInjections+=1),u}inject(t="medium"){const e={massive:8,heavy:5,medium:3}[t];for(let n=0;n<e;n++){let i;t==="massive"&&Math.random()<.3?i="gosper_gun":Math.random()<.4?i=Xn(Pc):i=Xn([...Uo,...Lc]);const[r,o]=this.findQuietSpot();this.place(i,r+Me(-6,6),o+Me(-6,6))}if(t==="massive"||t==="heavy"){const[n,i]=this.findQuietSpot();this.place("gosper_gun",n,i)}}injectFromEdge(){const t=this.camY+rt(this.viewH,2),e=this.camX+rt(this.viewW,2),n=rt(this.viewH,3),i=rt(this.viewW,3),r=rt(-this.viewH,3),o=rt(-this.viewW,3),a=Xn(["top","bottom","left","right"]);let l,c,u;a==="top"?[l,c,u]=[this.camY+2,e+Me(o,i),2]:a==="bottom"?[l,c,u]=[this.camY+this.viewH-5,e+Me(o,i),0]:a==="left"?[l,c,u]=[t+Me(r,n),this.camX+2,1]:[l,c,u]=[t+Me(r,n),this.camX+this.viewW-10,3],this.place(Xn(Uo),l,c,u)}injectGarden(){const t=this.camY+rt(this.viewH,2),e=this.camX+rt(this.viewW,2),n=Xn(Vd),i=Me(rt(-this.viewH,6),rt(this.viewH,6)),r=Me(rt(-this.viewW,6),rt(this.viewW,6));for(const[o,a]of n){const l=t+i+o,c=e+r+a;l>=0&&l<this.worldH&&c>=0&&c<this.worldW&&(this.grid[l*this.worldW+c]=1,this.age[l*this.worldW+c]=1)}this.invalidate()}findQuietSpot(){const[t,e]=this.viewCenter(),n=this.zoomLevel<0?1<<-this.zoomLevel:1,i=Math.min(this.worldH,this.viewH*n),r=Math.min(this.worldW,this.viewW*n),o=Math.max(0,Math.min(t-rt(i,2),this.worldH-i)),a=Math.max(0,Math.min(e-rt(r,2),this.worldW-r)),l=16,c=rt(i,l),u=rt(r,l);if(c<2||u<2)return[t,e];const h=new Float64Array(c*u);for(let g=0;g<c*l;g++){const S=(o+g)*this.worldW+a,E=rt(g,l)*u;for(let M=0;M<u*l;M++){const y=E+rt(M,l);h[y]=(h[y]??0)+(this.grid[S+M]??0)*2+(this.activity[S+M]??0)}}const d=Math.max(1,rt(h.length,5)),f=Array.from(h.keys()).sort((g,S)=>(h[g]??0)-(h[S]??0)),p=Xn(f.slice(0,d)),x=rt(p,u),m=p%u;return[o+x*l+rt(l,2),a+m*l+rt(l,2)]}aimGlider(t,e,n,i){const[r,o]=Gd[i]??[1,1],a=t-r*n,l=e-o*n,[c,u]=this.clampCam();if(!(c+2<=a&&a<c+this.viewH-5&&u+2<=l&&l<u+this.viewW-5))return!1;for(let h=Math.max(0,a-2);h<Math.min(this.worldH,a+5);h++)for(let d=Math.max(0,l-2);d<Math.min(this.worldW,l+5);d++)if(this.grid[h*this.worldW+d])return!1;return this.place("glider",a,l,i),!0}injectProvoke(){const t=[...this.lastCensusSites];if(!t.length)return"";t.sort((e,n)=>(Ho[n[0]]??0)-(Ho[e[0]]??0));for(const[e,n,i]of t.slice(0,6)){const r=Me(35,60),o=[0,1,2,3];for(let a=o.length-1;a>0;a--){const l=Math.floor(Math.random()*(a+1));[o[a],o[l]]=[o[l]??0,o[a]??0]}for(const a of o)if(this.aimGlider(n,i,r,a))return this.dramaUntil=this.generation+r*4+150,this.ticker.queueSpecial("the cosmos takes aim"),e}return""}injectCollide(){let[t,e]=this.findQuietSpot();const[n,i]=this.clampCam();for(let r=0;r<6;r++){const o=Me(16,34),a=n+o+3,l=n+this.viewH-o-6,c=i+o+3,u=i+this.viewW-o-6;if(a>=l||c>=u)continue;t=Math.max(a,Math.min(t,l)),e=Math.max(c,Math.min(e,u));const h=Me(0,3),d=Me(-3,3),f=Me(-3,3);if(!this.aimGlider(t,e,o,h))continue;const p=(h+Xn([1,3]))%4,x=this.aimGlider(t+d,e+f,o,p);return this.dramaUntil=this.generation+o*4+150,this.ticker.queueSpecial(x?"two gliders, one appointment":"a lone glider, sent into the dark"),!0}return!1}calculateTargetZoom(){const[t,e,n,i]=this.stepBbox??[0,this.worldH,0,this.worldW],r=this.worldW;let o=0;for(let S=t;S<e&&o<5;S++)for(let E=n;E<i;E++){const M=this.age[S*r+E]??0;if(M>=1&&M<=10&&++o>=5)break}const a=o>=5,l=[],c=[];for(let S=t;S<e;S++)for(let E=n;E<i;E++){const M=S*r+E;(a?(this.age[M]??0)>=1&&(this.age[M]??0)<=10:this.grid[M]!==0)&&(l.push(S),c.push(E))}if(l.length<2)return this.zoomLevel;const u=Int32Array.from(c).sort(),h=ai(l,15),d=ai(l,85),f=ai(u,15),p=ai(u,85),x=Math.max(4,d-h+1),m=Math.max(4,p-f+1);let g=oi;for(let S=ji;S>=oi;S--){const E=2**S;if(x<=this.viewH/E*.5&&m<=this.viewW/E*.5){g=S;break}}return cn(g,oi,ji)}updateCamera(){if(!this.autoCam)return;const t=30,e=Math.max(0,this.camY-t),n=Math.min(this.worldH,this.camY+this.viewH+t),i=Math.max(0,this.camX-t),r=Math.min(this.worldW,this.camX+this.viewW+t),o=this.worldW;let a=0,l=0,c=0;for(let f=e;f<n;f++)for(let p=i;p<r;p++){const x=this.activity[f*o+p]??0;if(x===0)continue;const m=x*x;a+=m,l+=m*(f-e),c+=m*(p-i)}if(a>25){this.steer(Math.trunc(l/a)+e,Math.trunc(c/a)+i),this.advanceAutoZoom();return}let u=0,h=0,d=0;for(let f=e;f<n;f++)for(let p=i;p<r;p++)this.grid[f*o+p]&&(u++,h+=f-e,d+=p-i);u>0&&this.steer(Math.trunc(h/u)+e,Math.trunc(d/u)+i),this.advanceAutoZoom()}steer(t,e){const n=cn(t-rt(this.viewH,2),0,this.worldH-this.viewH),i=cn(e-rt(this.viewW,2),0,this.worldW-this.viewW);this.camY=Math.trunc(this.camY+(n-this.camY)*.04),this.camX=Math.trunc(this.camX+(i-this.camX)*.04)}advanceAutoZoom(){if(this.zoomCooldown=Math.max(0,this.zoomCooldown-1),this.zoomCooldown!==0||this.generation%4!==0)return;const t=this.calculateTargetZoom();if(t>this.zoomLevel&&this.zoomLevel<ji)this.zoomLevel+=1,this.zoomCooldown=45;else if(t<this.zoomLevel&&this.zoomLevel>oi){const e=this.zoomLevel-1,n=e>=0?1:1<<-e;this.viewH*n<=this.worldH&&this.viewW*n<=this.worldW&&(this.zoomLevel=e,this.zoomCooldown=45)}}clampCam(){return[cn(this.camY,0,this.worldH-this.viewH),cn(this.camX,0,this.worldW-this.viewW)]}viewCenter(){const[t,e]=this.clampCam();return[t+rt(this.viewH,2),e+rt(this.viewW,2)]}rawViewGrid(){const[t,e]=this.clampCam(),n=new Uint8Array(this.viewH*this.viewW);for(let i=0;i<this.viewH;i++){const r=(t+i)*this.worldW+e;n.set(this.grid.subarray(r,r+this.viewW),i*this.viewW)}return{h:this.viewH,w:this.viewW,data:n}}cover(){const[t,e]=this.viewCenter();if(this.zoomLevel<0){const l=1<<-this.zoomLevel,c=this.viewH*l,u=this.viewW*l;if(c>this.worldH||u>this.worldW)return null;const h=Math.max(0,Math.min(t-rt(c,2),this.worldH-c)),d=Math.max(0,Math.min(e-rt(u,2),this.worldW-u));return[h,d,c,u,l,!1]}const n=1<<this.zoomLevel,i=Math.max(2,rt(this.viewH,n)),r=Math.max(2,rt(this.viewW,n)),o=Math.max(0,Math.min(t-rt(i,2),this.worldH-i)),a=Math.max(0,Math.min(e-rt(r,2),this.worldW-r));return[o,a,i,r,n,!0]}displayGrid(){return this.dispGridCache||(this.dispGridCache=this.computeDisplayGrid()),this.dispGridCache}computeDisplayGrid(){if(this.zoomLevel===0)return this.rawViewGrid();const t=this.cover();if(!t)return this.rawViewGrid();const[e,n,i,r,o,a]=t,l=this.worldW;if(!a){const d=rt(i,o),f=rt(r,o),p=new Uint8Array(d*f);for(let x=0;x<d*o;x++){const m=(e+x)*l+n,g=rt(x,o)*f;for(let S=0;S<f*o;S++)this.grid[m+S]&&(p[g+rt(S,o)]=1)}return{h:d,w:f,data:p}}const c=Math.min(i*o,this.viewH),u=Math.min(r*o,this.viewW),h=new Uint8Array(c*u);for(let d=0;d<c;d++){const f=(e+rt(d,o))*l+n;for(let p=0;p<u;p++)h[d*u+p]=this.grid[f+rt(p,o)]??0}return{h:c,w:u,data:h}}displayAge(){return this.dispAgeCache||(this.dispAgeCache=this.computeDisplayAge()),this.dispAgeCache}computeDisplayAge(){const t=this.haunted?this.age:this.ageSmooth,e=this.worldW,n=p=>Math.trunc(t[p]??0),i=this.zoomLevel===0?null:this.cover();if(!i){const[p,x]=this.clampCam(),m=new Int32Array(this.viewH*this.viewW);for(let g=0;g<this.viewH;g++){const S=(p+g)*e+x;for(let E=0;E<this.viewW;E++)m[g*this.viewW+E]=n(S+E)}return{h:this.viewH,w:this.viewW,data:m}}const[r,o,a,l,c,u]=i;if(!u){const p=rt(a,c),x=rt(l,c),m=-(this.haunted?Li:$n)-1,g=new Int32Array(p*x).fill(-2147483648),S=new Int32Array(p*x).fill(m);for(let M=0;M<p*c;M++){const y=(r+M)*e+o,w=rt(M,c)*x;for(let C=0;C<x*c;C++){const v=n(y+C),T=w+rt(C,c);v>(g[T]??0)&&(g[T]=v);const L=v!==0?v:m;L>(S[T]??0)&&(S[T]=L)}}const E=new Int32Array(p*x);for(let M=0;M<E.length;M++){const y=g[M]??0,w=S[M]??0;E[M]=y>0?y:w>m?w:0}return{h:p,w:x,data:E}}const h=Math.min(a*c,this.viewH),d=Math.min(l*c,this.viewW),f=new Int32Array(h*d);for(let p=0;p<h;p++){const x=(r+rt(p,c))*e+o;for(let m=0;m<d;m++)f[p*d+m]=n(x+rt(m,c))}return{h,w:d,data:f}}zoomIn(){this.zoomLevel<ji&&(this.zoomLevel+=1),this.invalidate()}zoomOut(){if(this.zoomLevel>oi){const t=this.zoomLevel-1,e=t>=0?1:1<<-t;(t>=0||this.viewH*e<=this.worldH&&this.viewW*e<=this.worldW)&&(this.zoomLevel=t)}this.invalidate()}autoFocus(){const t=this.worldH,e=this.worldW;let n=0,i=0;for(let B=0;B<this.age.length;B++){const X=this.age[B]??0;X>=1&&X<=10&&n++,this.grid[B]&&i++}const r=n>=5;if((r?n:i)===0)return;const o=B=>{const X=this.age[B]??0;return r?X>=1&&X<=10:this.grid[B]!==0},a=16,l=rt(t,a),c=rt(e,a);if(l<1||c<1)return;const u=new Float64Array(l*c);for(let B=0;B<l*a;B++)for(let X=0;X<c*a;X++){if(!o(B*e+X))continue;const nt=rt(B,a)*c+rt(X,a);u[nt]=(u[nt]??0)+1}const h=rf(u,l,c);let d=-1,f=0;for(let B=0;B<h.length;B++){const X=h[B]??0;X>d&&(d=X,f=B)}const p=rt(f,c)*a+rt(a,2),x=f%c*a+rt(a,2),m=a*2,g=Math.max(0,p-m),S=Math.min(t,p+m),E=Math.max(0,x-m),M=Math.min(e,x+m),y=[],w=[];for(let B=g;B<S;B++)for(let X=E;X<M;X++)o(B*e+X)&&(y.push(B-g),w.push(X-E));if(!y.length)return;const C=Int32Array.from(w).sort(),v=ai(y,10),T=ai(y,90),L=ai(C,10),D=ai(C,90),U=Math.max(4,T-v+1),K=Math.max(4,D-L+1),Z=g+rt(v+T,2),N=E+rt(L+D,2);let W=oi;for(let B=ji;B>=oi;B--){const X=2**B;if(U<=this.viewH/X*.6&&K<=this.viewW/X*.6){W=B;break}}this.zoomLevel=cn(W,oi,ji),this.camY=cn(Z-rt(this.viewH,2),0,this.worldH-this.viewH),this.camX=cn(N-rt(this.viewW,2),0,this.worldW-this.viewW),this.autoCam=!1,this.invalidate()}pan(t,e){this.autoCam=!1;const n=2**-this.zoomLevel,i=t!==0?Math.max(1,Math.trunc(Math.abs(t)*n))*Math.sign(t):0,r=e!==0?Math.max(1,Math.trunc(Math.abs(e)*n))*Math.sign(e):0;this.camY=cn(this.camY+i,0,this.worldH-this.viewH),this.camX=cn(this.camX+r,0,this.worldW-this.viewW),this.invalidate()}home(){this.autoCam=!0,this.zoomLevel=0,this.invalidate()}clear(){this.grid.fill(0),this.age.fill(0),this.ageSmooth.fill(0),this.generation=0,this.popHistory=[],this.hashHistory=[],this.invalidate()}takeCensus(){const t=this.rawViewGrid();let e=!1;for(let l=0;l<t.data.length;l++)if(t.data[l]){e=!0;break}let n=new Map;if(!e)this.lastCensusSites=[];else try{const l=jd(t.data,t.h,t.w);if(!l)this.lastCensusSites=[];else{const[c,u]=this.clampCam();this.lastCensusSites=l.sites.map(([h,d,f])=>[h,c+d,u+f]),n=l.counts}}catch{}if(this.lastCensus=n,!n.size||this.generation-this.lastSightingGen<600)return;let i="",r=0;for(const[l,c]of n){if(c<(ef[l]??1)||this.generation-(this.sightingGen.get(l)??-1e9)<1800)continue;const u=Ho[l]??0;u>r&&(r=u,i=l)}if(!i)return;const o=tf[i]??[],a=this.sightingCount.get(i)??0;this.sightingCount.set(i,a+1),this.ticker.queueSpecial(o[a%o.length]??i),this.sightingGen.set(i,this.generation),this.lastSightingGen=this.generation}snapshot(){return{h:this.worldH,w:this.worldW,age:this.age.slice(),generation:this.generation,totalInjections:this.totalInjections}}adopt(t){const e=Math.min(this.worldH,t.h),n=Math.min(this.worldW,t.w),i=rt(t.h-e,2),r=rt(t.w-n,2),o=rt(this.worldH-e,2),a=rt(this.worldW-n,2);this.grid.fill(0),this.age.fill(0);let l=0;for(let c=0;c<e;c++)for(let u=0;u<n;u++){let h=t.age[(i+c)*t.w+r+u]??0;h<-$n&&(h=0);const d=(o+c)*this.worldW+a+u;this.age[d]=h,h>0&&(this.grid[d]=1,l++)}this.generation=Math.max(0,Math.trunc(t.generation)),this.totalInjections=Math.max(0,Math.trunc(t.totalInjections)),this.ageSmooth.fill(0),this.activity.fill(0),this.hashHistory=[],this.cachedPop=l,this.popHistory=[l],this.stepBbox=null,this.dramaUntil=0,this.invalidate()}toggleHaunted(){if(this.haunted=!this.haunted,this.invalidate(),!this.haunted)for(let t=0;t<this.age.length;t++)(this.age[t]??0)<0&&(this.age[t]=0),(this.ageSmooth[t]??0)<0&&(this.ageSmooth[t]=0)}termToWorld(t,e,n=0){const[i,r]=this.viewCenter(),o=t*2+n,a=e;if(this.zoomLevel<=0){const h=1<<-this.zoomLevel,d=i-rt(this.viewH*h,2),f=r-rt(this.viewW*h,2);return[d+o*h,f+a*h]}const l=1<<this.zoomLevel,c=i-rt(Math.max(2,rt(this.viewH,l)),2),u=r-rt(Math.max(2,rt(this.viewW,l)),2);return[c+rt(o,l),u+rt(a,l)]}toggleCell(t,e,n=0){const[i,r]=this.termToWorld(t,e,n);this.setCell(i,r,this.grid[i*this.worldW+r]?0:1)}setCell(t,e,n){if(t<0||t>=this.worldH||e<0||e>=this.worldW)return;const i=t*this.worldW+e;this.grid[i]=n,this.age[i]=n?1:0,this.invalidate()}tickTicker(t){this.ticker.tick(t,this.detectMood(),this.generation)}detectMood(){return this.cachedMoodGen===this.generation?this.cachedMood:(this.cachedMood=this.computeMood(),this.cachedMoodGen=this.generation,this.cachedMood)}computeMood(){if(this.haunted)return"haunted";if(this.lastEvent&&this.generation-this.lastEventGen<90)return"injection";if(this.cyclePeriod>0)return"cycle";if(this.generation>=1e4&&this.generation%1e4<120)return"milestone";const t=this.popHistory,e=t.length;if(e>=30){let r=0,o=0;for(let l=e-30;l<e-15;l++)r+=t[l]??0;for(let l=e-15;l<e;l++)o+=t[l]??0;const a=o/15/Math.max(r/15,1);if(a>1.15)return"booming";if(a<.85)return"declining"}const n=e?t[e-1]??0:0;return n/Math.max(this.viewH*this.viewW,1)>.15?"dense":n<this.popFloor&&n>0?"sparse":this.spread<Math.max(8,rt(this.popFloor,8))&&e>=150?"stagnant":""}epoch(){var e;let t=((e=Bc[0])==null?void 0:e[1])??"genesis";for(const[n,i]of Bc)this.generation>=n&&(t=i);return t}population(){return this.cachedPop}activityCenterX(){const[t,e]=this.clampCam();let n=0,i=0;for(let r=0;r<this.viewH;r++){const o=(t+r)*this.worldW+e;for(let a=0;a<this.viewW;a++){const l=this.activity[o+a]??0;n+=l,i+=l*a}}return n<1||this.viewW<2?.5:i/n/(this.viewW-1)}viewportActivity(){const[t,e]=this.clampCam();let n=0;for(let i=0;i<this.viewH;i++){const r=(t+i)*this.worldW+e;for(let o=0;o<this.viewW;o++)n+=this.activity[r+o]??0}return n}timeDilation(){if(!this.autoCam)return 1;const t=this.viewportActivity();if(this.actBaseline<=0)return this.actBaseline=Math.max(t,1),1;const e=t>this.actBaseline?.015:.003;this.actBaseline=this.actBaseline*(1-e)+t*e;const n=t/Math.max(this.actBaseline,1);let i=n>1?Math.min(1.6,1+(n-1)*.7):.7+n*.3;return t<60&&(i=Math.min(i,.7)),this.dilation=this.dilation*.85+i*.15,this.dilation}sparkline(t=24){const e=this.popHistory;if(e.length<2)return"";const n=Math.max(0,e.length-t);let i=e[n]??0,r=i;for(let c=n;c<e.length;c++){const u=e[c]??0;u<i&&(i=u),u>r&&(r=u)}const o=Ws.length-1,a=Ws[Math.floor(Ws.length/2)]??"▅";let l="";for(let c=n;c<e.length;c++){const u=e[c]??0;l+=r===i?a:Ws[Math.trunc((u-i)/(r-i)*o)]??""}return l}}const af=[[0,0,0],[205,0,0],[0,205,0],[205,205,0],[0,0,238],[205,0,205],[0,205,205],[229,229,229],[127,127,127],[255,0,0],[0,255,0],[255,255,0],[92,92,255],[255,0,255],[0,255,255],[255,255,255]],Go=[0,95,135,175,215,255];function es(s){if(s<16)return[...af[s]??[0,0,0]];if(s<232){const e=s-16;return[Go[Math.floor(e/36)]??0,Go[Math.floor(e/6)%6]??0,Go[e%6]??0]}const t=8+(s-232)*10;return[t,t,t]}function Di(s){return(255<<24|s[2]<<16|s[1]<<8|s[0])>>>0}function Hc(s){return`rgb(${s[0]},${s[1]},${s[2]})`}const Vo=[10,10,12],lf="rgb(200,200,200)",ns="rgb(112,112,116)",Gc=ri.length,is=ri.map(s=>Di(es(s))),Wo=Pn.map(s=>Di(es(s))),Vc=Od.map(([s,t])=>[Di(es(s)),Di(es(t))]),cf=kd.map(([s,t])=>[Di(es(s)),Di(es(t))]),br=Di(Vo),hf='ui-monospace, "SF Mono", "Cascadia Mono", "DejaVu Sans Mono", Menlo, Consolas, monospace';let Sr=null;function uf(s){if(Sr&&Sr.maxAge===s)return Sr.table;const t=new Uint8Array(s+1),e=Math.log1p(s);for(let n=1;n<=s;n++)t[n]=Math.min(Math.trunc(Math.log1p(n)/e*(Gc-1)),Gc-1);return Sr={maxAge:s,table:t},t}function Xs(s){return s.toLocaleString("en-US")}class df{constructor(t){R(this,"cw",8);R(this,"cols",80);R(this,"rows",24);R(this,"statusRows",1);R(this,"keys",!0);R(this,"img",null);R(this,"widths",new Map);R(this,"px",null);R(this,"off",null);this.ctx=t}get gridRows(){return Math.max(1,this.rows-this.statusRows)}resize(t,e,n){this.cw=Math.max(2,Math.round(n)),this.cols=Math.max(20,Math.floor(t/this.cw)),this.rows=Math.max(6,Math.floor(e/(this.cw*2))),this.statusRows=this.cols>=150?1:2,this.keys=this.cols>=150,this.img=null,this.widths.clear()}status(t,e){const n=t.sparkline(this.cols<100?10:24),i=t.autoCam?"auto":"pan",r=Hd[t.zoomLevel]??`${2**t.zoomLevel}x`,o=t.autoFocusMode?"[F]":"",a=t.haunted?"[HAUNTED]":"",l=e?` ${e}`:"",c=`  ${t.epoch()}  gen ${Xs(t.generation)}  pop ${Xs(t.population())}  ${n}`,u=this.keys?"  q r spc +/- arrows h z/x f g s  ":"  ",h=`${l} ${a}${o} ${r} ${i}${u}`;return this.statusRows===1?{left:c,right:h,tickerCol:Ln(c)+1,tickerWidth:this.cols-Ln(c)-Ln(h)-2}:{left:c,right:h,tickerCol:1,tickerWidth:this.cols-2}}render(t,e,n){const i=this.ctx,r=this.cw,o=this.cols*r,a=this.rows*r*2;i.fillStyle=Hc(Vo),i.fillRect(0,0,o,a),this.paintGrid(t),i.font=`${Math.round(r*1.62)}px ${hf}`,i.textBaseline="middle",n&&this.statsOverlay(t);const l=this.rows-1;if(this.statusRows===1)if(e.tickerWidth<10)this.text(`${e.left}  ${e.right}`.slice(0,this.cols-1),l,0,ns);else{this.text(e.left,l,0,ns),this.ticker(t,l,e);const c=this.cols-Ln(e.right);this.text([...e.right].slice(0,this.cols-1-c).join(""),l,c,ns)}else{const c=this.cols-1,u=Ln(e.left)+Ln(e.right)<=c?e.left+" ".repeat(c-Ln(e.left)-Ln(e.right))+e.right:`${e.left}  ${e.right}`;this.text([...u].slice(0,c).join(""),l-1,0,ns),this.ticker(t,l,e)}}paintGrid(t){const e=t.displayGrid(),n=t.displayAge(),i=Math.min(Math.floor(e.h/2),Math.floor(n.h/2),this.gridRows),r=Math.min(e.w,n.w,this.cols),o=this.cols,a=this.gridRows*2;(!this.img||this.img.width!==o||this.img.height!==a)&&(this.img=new ImageData(o,a),this.px=new Uint32Array(this.img.data.buffer),this.off=typeof OffscreenCanvas<"u"?new OffscreenCanvas(o,a):Object.assign(document.createElement("canvas"),{width:o,height:a}));const l=this.px;l.fill(br);let c=1;for(let y=0;y<n.data.length;y++)(n.data[y]??0)>c&&(c=n.data[y]??0);const u=uf(c),h=t.haunted,d=t.zoomLevel>=0||h,f=h?Li:$n,p=y=>Math.min(Math.max(-y-1,0),f-1),x=y=>u[Math.min(Math.max(y,0),c)]??0,m=y=>{var w;return h?((w=Vc[y])==null?void 0:w[0])??0:Wo[y]??0},g=y=>{var w;return h?((w=Vc[y])==null?void 0:w[1])??0:br};for(let y=0;y<i;y++){const w=2*y*e.w,C=w+e.w,v=2*y*n.w,T=v+n.w,L=2*y*o,D=L+o;for(let U=0;U<r;U++){const K=(e.data[w+U]??0)>0,Z=(e.data[C+U]??0)>0,N=n.data[v+U]??0,W=n.data[T+U]??0,B=d&&N<0,X=d&&W<0;if(!(K||Z||B||X))continue;let nt=br,ot=br;if((K||B)&&(Z||X))if(K&&Z)nt=is[x(N)]??0,ot=is[x(W)]??0;else if(B&&X){const at=p(N),xt=p(W);if(h){const Gt=cf[at*Li+xt];nt=(Gt==null?void 0:Gt[0])??0,ot=(Gt==null?void 0:Gt[1])??0}else nt=Wo[at]??0,ot=Wo[xt]??0}else K?nt=is[x(N)]??0:ot=is[x(W)]??0;else if(K)nt=is[x(N)]??0;else if(Z)ot=is[x(W)]??0;else if(B){const at=p(N);nt=m(at),ot=g(at)}else{const at=p(W);ot=m(at),nt=g(at)}l[L+U]=nt,l[D+U]=ot}}const S=this.off,E=S.getContext("2d");if(!E||!this.img)return;E.putImageData(this.img,0,0);const M=this.ctx;M.imageSmoothingEnabled=!1,M.drawImage(S,0,0,o*this.cw,a*this.cw)}ticker(t,e,n){const i=zc.dim(t.generation)?ns:lf;for(const r of t.ticker.messages){const o=Math.trunc(r.x),a=[...r.text],l=Math.max(o,0),c=Math.min(o+a.length,n.tickerWidth);l>=c||this.text(a.slice(l-o,c-o).join(""),e,n.tickerCol+l,i)}}statsOverlay(t){const e=t.lastCensus.size?[...t.lastCensus.entries()].sort((c,u)=>u[1]-c[1]).map(([c,u])=>`${u}×${c}`).join(" "):"none",n=36,i=11,r=this.cols-n-2,o=this.rows-(this.statusRows-1)-i-2;if(r<0||o<0)return;const a=["─".repeat(n-2)," infinity engine",` pop floor  : ${Xs(t.popFloor)}`,` spread/150 : ${Xs(t.spread)}`,` cycle       : ${t.cyclePeriod===0?"none":`period ${t.cyclePeriod}`}`,` injections  : ${t.totalInjections}`,` last event  : ${t.lastEvent||"none"}`,t.lastEvent?`   @ gen     : ${Xs(t.lastEventGen)}`:"               ",` world       : ${t.worldH}x${t.worldW}`,` census      : ${[...e].slice(0,n-16).join("")}`,` tempo       : ${(1/Math.max(t.dilation,.01)).toFixed(2)}x`],l=this.ctx;l.fillStyle=Hc(Vo),l.fillRect(r*this.cw,o*this.cw*2,n*this.cw,a.length*this.cw*2),a.forEach((c,u)=>{const h=[...` ${c}`.padEnd(n)].slice(0,n).join("");this.text(h,o+u,r,ns)})}text(t,e,n,i){const r=this.ctx,o=this.cw,a=e*o*2;r.fillStyle=i;let l=n;for(const c of t){if(l>=this.cols)break;if(l>=0&&c!==" "){const u=Ws.indexOf(c);if(u>=0){const h=Math.max(1,Math.round(o*2*(u+1)/8));r.fillRect(l*o,a+o*2-h,o,h)}else if(c==="─")r.fillRect(l*o,a+o-Math.max(1,Math.round(o/8))/2,o,Math.max(1,Math.round(o/8)));else{let h=this.widths.get(c);h===void 0&&(h=r.measureText(c).width,this.widths.set(c,h)),r.fillText(c,l*o+o/2-h/2,a+o)}}l++}}}const It=512,Wt=384,Zt='"Libertinus Mono", "LibertinusMono", ui-monospace, monospace',$o='"Love Letter Typewriter", "Libertinus Mono", monospace';function Xo(s,t,e){t();const n=typeof document<"u"?document.fonts:void 0,i=(Array.isArray(s)?s:[s]).filter(r=>n&&!n.check(r));!n||!i.length||Promise.all(i.map(r=>n.load(r))).then(()=>{t(),e==null||e()},()=>{})}class xn{constructor(t,e){R(this,"canvas");R(this,"ctx");R(this,"fps",15);R(this,"acc",1);R(this,"version",0);this.site=t,this.env=e,this.canvas=document.createElement("canvas"),this.canvas.width=It,this.canvas.height=Wt;const n=this.canvas.getContext("2d",{alpha:!1});if(!n)throw new Error("oikos: no 2d context");this.ctx=n}tick(t,e,n,i=1){this.acc+=e;const r=n?Math.max(this.fps,30):this.fps*i;if(this.acc<1/r)return!1;const o=this.acc;return this.acc=0,this.draw(t,o),this.version++,!0}clear(t){this.ctx.fillStyle=t,this.ctx.fillRect(0,0,It,Wt)}wrap(t,e,n=1/0){const i=this.ctx,r=t.split(/\s+/).filter(Boolean),o=[];let a="";for(const l of r){const c=a?`${a} ${l}`:l;if(i.measureText(c).width>e&&a){if(o.push(a),a=l,o.length>=n)break}else a=c}if(a&&o.length<n&&o.push(a),o.length===n&&o.join(" ").length<r.join(" ").length){let l=o[n-1]??"";for(;l&&i.measureText(`${l}…`).width>e;)l=l.replace(/\s*\S*$/,"");o[n-1]=`${l}…`}return o}condensed(t,e,n,i=.72,r="left"){const o=this.ctx;o.save(),o.translate(e,n),o.scale(i,1),o.textAlign=r,o.fillText(t,0,0),o.restore()}spaced(t,e,n,i,r="left"){const o=this.ctx,a=[...t],l=a.map(h=>o.measureText(h).width),c=l.reduce((h,d)=>h+d,0)+i*(a.length-1);let u=r==="center"?e-c/2:e;o.save(),o.textAlign="left",a.forEach((h,d)=>{o.fillText(h,u,n),u+=(l[d]??0)+i}),o.restore()}}function qo(s){let t=2166136261;for(let e=0;e<s.length;e++)t^=s.charCodeAt(e),t=Math.imul(t,16777619);return(t>>>0)%1e5/1e5}function Ii(s){let t=s>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function ff(s){return Math.round(s).toLocaleString("en-US")}const Wc=15,pf={minH:0,minW:0};class mf extends xn{constructor(e,n){super(e,n);R(this,"term");R(this,"life",null);R(this,"seenSave");R(this,"genAcc",1/Wc);this.fps=15,this.term=new df(this.ctx),this.term.resize(It,Wt,8)}sync(){var r;const e=this.env.feeds.universe.value;if(this.life&&(e==null?void 0:e.savedAt)===((r=this.seenSave)==null?void 0:r.savedAt))return;this.seenSave=e;const n=e?$d():null,i=new of(this.term.gridRows,this.term.cols,!n,pf);n&&(i.adopt(n),i.ticker.queueSpecial(`the universe remembers generation ${i.generation.toLocaleString("en-US")}`)),this.life=i}draw(e,n){this.sync();const i=this.life;if(!i)return;const r=1/Wc;if(this.genAcc+=n,this.genAcc<r)return;this.genAcc=Math.min(this.genAcc-r,r),i.step(),i.generation>0&&i.generation%150===0&&i.takeCensus();const o=this.term.status(i,"");o.tickerWidth>=10&&i.tickTicker(o.tickerWidth),this.term.render(i,o,!1)}}const li=62,qs=21,gf=It/li,xf=12.4,vf=42,Yo=" .,:;-=+*#%@";function _f(){const s=[];for(let e=0;e<16;e++)s.push([e&1?1:-1,e&2?1:-1,e&4?1:-1,e&8?1:-1]);const t=[];for(let e=0;e<16;e++)for(let n=0;n<4;n++){const i=e^1<<n;if(i<e)continue;const r=s[e],o=s[i];if(!(!r||!o))for(let a=0;a<=18;a++){const l=a/18;t.push([r[0]+(o[0]-r[0])*l,r[1]+(o[1]-r[1])*l,r[2]+(o[2]-r[2])*l,r[3]+(o[3]-r[3])*l])}}return t}function Mf(){const s=[];for(let e=0;e<44;e++)for(let n=0;n<44;n++){const i=e/44*Math.PI*2,r=n/44*Math.PI*2;s.push([Math.cos(i)*1.3,Math.sin(i)*1.3,Math.cos(r)*1.3,Math.sin(r)*1.3])}return s}const Ko=[_f(),Mf()];class yf extends xn{constructor(e,n){super(e,n);R(this,"gen",null);R(this,"seq",0);R(this,"depth",new Float32Array(li*qs));R(this,"glyph",new Uint8Array(li*qs));this.fps=18}generate(e){const n=this.env.feeds.apeiron.value,i=Math.floor(Math.random()*2**31),r=Ii(i),{prompt:o,template:a}=n?bf(n,r):{prompt:"",template:"waking"},l=(i>>>0).toString(16).padStart(8,"0").replace(/(....)(....)/,"$1·$2");return{prompt:o,template:a,coordinate:l,hue:n?Math.floor(qo(o)*360):135,figure:Ko[this.seq++%Ko.length]??Ko[0]??[],bornAt:e}}draw(e){(!this.gen||e-this.gen.bornAt>9||!this.gen.prompt&&this.env.feeds.apeiron.value)&&(this.gen=this.generate(e));const n=this.gen,i=this.ctx,r=`hsl(${n.hue} 100% 58%)`,o=`hsl(${n.hue} 100% 76%)`,a=`hsl(${n.hue} 60% 22%)`,l=i.createRadialGradient(It/2,Wt*.4,20,It/2,Wt*.4,It*.7);l.addColorStop(0,`hsl(${n.hue} 60% 7%)`),l.addColorStop(1,"#030309"),i.fillStyle=l,i.fillRect(0,0,It,Wt),i.font=`12px ${Zt}`,i.fillStyle=r,i.fillText("apeiron",14,22),i.fillStyle=a,i.fillText("·  æthera",76,22),i.textAlign="right",i.fillStyle=r,i.fillText(n.template.replace(/_/g," "),It-14,22),i.textAlign="left",this.raster(e,n.figure),i.font=`12px ${Zt}`;for(let d=0;d<qs;d++)for(let f=0;f<li;f++){const p=this.glyph[d*li+f]??0;p&&(i.fillStyle=p>9?o:p>4?r:a,i.fillText(Yo[p]??".",f*gf,vf+d*xf+10))}const c=e-n.bornAt,u=n.prompt||"reading the grammar…";i.font=`12px ${Zt}`;const h=this.wrap(u.slice(0,Math.floor(c*70)),It-28,4);i.fillStyle="rgba(3,3,9,0.7)",i.fillRect(0,Wt-98,It,98),i.fillStyle=a,i.fillRect(14,Wt-98,It-28,1),i.fillStyle=o,h.forEach((d,f)=>i.fillText(d,14,Wt-78+f*15)),i.fillStyle=r,i.font=`11px ${Zt}`,i.fillText(`⌖ ${n.coordinate}`,14,Wt-12),i.fillStyle=a,i.textAlign="right",i.fillText("␣ generate   F keep   A auto",It-14,Wt-12),i.textAlign="left"}raster(e,n){this.depth.fill(-1/0),this.glyph.fill(0);const i=e*.45,r=e*.31,o=e*.23,[a,l,c,u,h,d]=[Math.cos(i),Math.sin(i),Math.cos(r),Math.sin(r),Math.cos(o),Math.sin(o)];for(const f of n){let[p,x,m,g]=f;[p,g]=[p*a-g*l,p*l+g*a],[x,m]=[x*c-m*u,x*u+m*c],[m,g]=[m*h-g*d,m*d+g*h];const S=2.6/(3.2-g);p*=S,x*=S,m*=S;const E=3.4/(4.6-m),M=Math.round(li/2+p*E*11.5),y=Math.round(qs/2+x*E*5.6);if(M<0||M>=li||y<0||y>=qs)continue;const w=y*li+M;m>(this.depth[w]??-1/0)&&(this.depth[w]=m,this.glyph[w]=Math.max(1,Math.min(Yo.length-1,Math.round((m+2.2)/4.4*(Yo.length-1)))))}}}function bf(s,t){const e=s.templates[Math.floor(t()*s.templates.length)];return e?{prompt:e.structure.replace(/\{(\w+)\}/g,(i,r)=>{var a;const o=s.components[r];return o!=null&&o.length?((a=o[Math.floor(t()*o.length)])==null?void 0:a.word)??r:r.replace(/_/g," ")}),template:e.id}:{prompt:"",template:""}}const Zo="#e8e2d4",Jo="#a39d90",$c="#5d5850",Ni=34,ss=250,Ui=84,wr=Wt-Ui-22;class Sf extends xn{constructor(e,n){super(e,n);R(this,"standIn");this.fps=10,this.standIn=wf()}draw(e){const n=this.ctx;this.clear("#070707"),n.fillStyle=Zo,n.font=`22px ${Zt}`,this.spaced("chronicle",It/2,38,11,"center"),n.fillStyle=Jo,n.font=`11px ${Zt}`,this.spaced("what the dream remembers",It/2,60,2,"center");const r=[...this.env.feeds.chronicle.value.strata].reverse();if(n.fillStyle="#000",n.fillRect(Ni-1,Ui-1,ss+2,wr+2),n.imageSmoothingEnabled=!0,r.length){const l=r.map((h,d)=>Math.pow(.6,d)),c=l.reduce((h,d)=>h+d,0);let u=Ui;r.forEach((h,d)=>{const f=wr*(l[d]??0)/c;n.save(),n.translate(Ni,u+f),n.scale(1,-1),n.drawImage(h,0,0,ss,f),n.restore(),u+=f,n.fillStyle="rgba(232,226,212,0.08)",n.fillRect(Ni,u,ss,1)})}else n.globalAlpha=.75,n.drawImage(this.standIn,Ni,Ui,ss,wr),n.globalAlpha=1;const o=Ui+e*14%wr,a=n.createLinearGradient(0,o-16,0,o+2);a.addColorStop(0,"rgba(232,226,212,0)"),a.addColorStop(1,"rgba(232,226,212,0.22)"),n.fillStyle=a,n.fillRect(Ni,o-16,ss,18),n.fillStyle="rgba(232,226,212,0.5)",n.fillRect(Ni-6,o,4,1),this.log(e)}log(e){const n=this.ctx,i=this.env.feeds.chronicle.value,r=Ni+ss+24,o=It-r-18;n.font=`11px ${Zt}`,n.fillStyle=$c,n.fillText(i.known?`${i.eraCount||i.eras.length} eras`:"reading the core…",r,Ui+8);const a=[...i.eras].reverse().slice(0,7);let l=Ui+34;if(!a.length){n.fillStyle=Jo;for(const c of this.wrap("every fifteen seconds of the dream settles here as one line of its own colour.",o,6))n.fillText(c,r,l),l+=15;return}for(const c of a){if(l>Wt-30)break;const u=new Date(c.t0*1e3);n.fillStyle=c.open?Zo:$c,n.font=`10px ${Zt}`;const h=`${u.getHours().toString().padStart(2,"0")}:${u.getMinutes().toString().padStart(2,"0")}`;n.fillText(c.open?`${h}  now`:h,r,l),c.open&&(n.fillStyle=Math.sin(e*3)>0?"#d6c9a8":"#6d6555",n.fillRect(r-10,l-6,4,4)),n.font=`12px ${Zt}`,n.fillStyle=c.open?Zo:Jo;const d=this.wrap(c.title||"untitled",o,2);d.forEach((f,p)=>n.fillText(f,r,l+15+p*14)),l+=22+d.length*14}}}function wf(){const s=document.createElement("canvas");s.width=64,s.height=240;const t=s.getContext("2d");if(!t)return s;const e=Ii(1729),n=["#5c3b36","#7a4f45","#3f3a4c","#8a6f64","#2d4a4f","#6b2c3a","#a38a74","#40302c"];let i=n[0];for(let r=0;r<s.height;r++){e()<.12&&(i=n[Math.floor(e()*n.length)]??i),t.fillStyle=i,t.fillRect(0,r,s.width,1);for(let o=0;o<6;o++)t.fillStyle=`rgba(255,255,255,${e()*.08})`,t.fillRect(e()*s.width,r,e()*12,1)}return s}const Ef="#07050b",jo="#d59bff",Er="#4d3a63",Qo="#e9e0f5",Fi="#8a7b9e",ci={x:18,y:54,w:128,h:74,label:"KEYFRAME N-1"},qe={x:192,y:54,w:128,h:74,label:"KEYFRAME N"},hi={x:366,y:54,w:128,h:74,label:"FRESH FRAME"},Oi={x:18,y:176,w:302,h:52,label:"INTERPOLATION"},Tr={x:340,y:150,w:154,h:104,label:"COLLAPSE PREVENTION"};class Tf extends xn{constructor(t,e){super(t,e),this.fps=15}box(t,e){const n=this.ctx;n.strokeStyle=e>0?jo:Er,n.globalAlpha=.5+e*.5,n.lineWidth=1,n.strokeRect(t.x+.5,t.y+.5,t.w,t.h),n.globalAlpha=1,n.font=`10px ${Zt}`,n.fillStyle=e>0?Qo:Fi,n.fillText(t.label,t.x+6,t.y+13)}arrow(t,e,n,i,r,o){const a=this.ctx;a.strokeStyle=Er,a.beginPath(),a.moveTo(t,e),a.lineTo(n,i),a.stroke();const l=Math.sign(n-t||i-e);if(a.fillStyle=Er,a.beginPath(),e===i?(a.moveTo(n,i),a.lineTo(n-6*l,i-4),a.lineTo(n-6*l,i+4)):(a.moveTo(n,i),a.lineTo(n-4,i-6*l),a.lineTo(n+4,i-6*l)),a.fill(),o>=0&&o<=1){const c=t+(n-t)*o,u=e+(i-e)*o,h=a.createRadialGradient(c,u,0,c,u,8);h.addColorStop(0,"rgba(213,155,255,1)"),h.addColorStop(1,"rgba(213,155,255,0)"),a.fillStyle=h,a.fillRect(c-8,u-8,16,16)}r&&(a.font=`9px ${Zt}`,a.fillStyle=Fi,a.textAlign="center",a.fillText(r,(t+n)/2,e===i?e-6:(e+i)/2),a.textAlign="left")}draw(t){const e=this.ctx;this.clear(Ef);const n=this.env.feeds.chronicle.value,i=6,r=t%i/i,o=400+Math.floor(t/i);if(e.font=`14px ${Zt}`,e.fillStyle=jo,e.fillText("dream_gen",18,28),e.font=`10px ${Zt}`,e.fillStyle=Fi,e.fillText("a truly infinite diffusion stream",110,28),e.textAlign="right",e.fillText(`kf ${String(o).padStart(5,"0")}`,It-18,28),e.textAlign="left",this.box(ci,r<.25?1:0),this.box(qe,r>=.25&&r<.5?1:.2),this.box(hi,0),this.box(Oi,r>=.5?1:0),this.box(Tr,Math.sin(t*.8)>.6?1:0),n.thumb)e.drawImage(n.thumb,qe.x+6,qe.y+18,qe.w-12,(qe.w-12)/2),e.globalAlpha=.35,e.drawImage(n.thumb,ci.x+6,ci.y+18,ci.w-12,(ci.w-12)/2),e.globalAlpha=1;else for(const h of[ci,qe]){const d=e.createLinearGradient(h.x,h.y,h.x+h.w,h.y+h.h);d.addColorStop(0,`hsl(${(t*8+h.x)%360} 40% 30%)`),d.addColorStop(1,`hsl(${(t*8+h.x+90)%360} 40% 18%)`),e.fillStyle=d,e.fillRect(h.x+6,h.y+18,h.w-12,(h.w-12)/2)}e.fillStyle="#1b1426",e.fillRect(hi.x+6,hi.y+18,hi.w-12,(hi.w-12)/2),e.fillStyle=Fi,e.font=`9px ${Zt}`,e.fillText("txt2img on swap",hi.x+10,hi.y+50),this.arrow(ci.x+ci.w,91,qe.x,91,"img2img",r<.25?r/.25:-1),this.arrow(hi.x,91,qe.x+qe.w,91,"",-1),this.arrow(qe.x+qe.w/2,qe.y+qe.h,qe.x+qe.w/2,Oi.y,"",r>=.25&&r<.5?(r-.25)/.25:-1);const a=16,l=r>=.5?Math.floor((r-.5)/.5*a):0;for(let h=0;h<a;h++)e.fillStyle=h<l?jo:"#1e1629",e.fillRect(Oi.x+8+h*18,Oi.y+22,14,18);e.fillStyle=Fi,e.font=`9px ${Zt}`,e.textAlign="right",e.fillText(`${l}/${a} → stream`,Oi.x+Oi.w-6,Oi.y+13),e.textAlign="left",[["1 mutation","BEND 0.7"],["2 cache","blend ~60%"],["3 swap","fresh txt2img"]].forEach(([h,d],f)=>{const p=Tr.y+34+f*22;e.fillStyle=Qo,e.font=`10px ${Zt}`,e.fillText(h,Tr.x+8,p),e.fillStyle=Fi,e.fillText(d,Tr.x+78,p)}),e.fillStyle="rgba(20,12,30,0.8)",e.fillRect(0,Wt-110,It,110),e.fillStyle=Er,e.fillRect(18,Wt-110,It-36,1),e.font=`10px ${Zt}`,e.fillStyle=Fi,e.fillText(n.prompt?`prompt${n.template?` · ${n.template}`:""}`:"prompt",18,Wt-92),e.font=`12px ${Zt}`,e.fillStyle=Qo;const u=n.prompt||"the dreamer is asleep; its last prompt will appear here when the chronicle has one.";this.wrap(u,It-36,5).forEach((h,d)=>e.fillText(h,18,Wt-72+d*15))}}const Ar=new Image;Ar.src="/static/oikos/stage.jpg";const hn=372,un=186,Xc=(It-hn)/2,qc=118;class Af extends xn{constructor(e,n){super(e,n);R(this,"frame",document.createElement("canvas"));R(this,"fctx");R(this,"prev",null);R(this,"cur",null);R(this,"swapAt",0);this.fps=20,this.frame.width=hn,this.frame.height=un;const i=this.frame.getContext("2d");if(!i)throw new Error("oikos: no 2d context");this.fctx=i}draw(e){const n=this.ctx;this.clear("#120406"),Ar.complete&&Ar.naturalWidth&&(n.globalAlpha=.95,n.drawImage(Ar,0,0,It,Wt),n.globalAlpha=1);const i=this.env.feeds.chronicle.value;i.thumb&&i.thumb!==this.cur&&(this.prev=this.cur,this.cur=i.thumb,this.swapAt=e);const r=this.fctx;if(r.globalCompositeOperation="source-over",r.globalAlpha=1,this.cur){const a=Math.min(1,(e-this.swapAt)/2.5);this.prev&&a<1&&this.kenBurns(this.prev,e-20),r.globalAlpha=this.prev?a:1,this.kenBurns(this.cur,e),r.globalAlpha=1}else this.standIn(e);const o=r.createRadialGradient(hn/2,un/2,un*.25,hn/2,un/2,hn*.56);o.addColorStop(0,"rgba(0,0,0,1)"),o.addColorStop(.72,"rgba(0,0,0,0.9)"),o.addColorStop(1,"rgba(0,0,0,0)"),r.globalCompositeOperation="destination-in",r.fillStyle=o,r.fillRect(0,0,hn,un),r.globalCompositeOperation="source-over",n.save(),n.globalCompositeOperation="lighter",n.globalAlpha=.18,n.drawImage(this.frame,Xc-30,qc+un-20,hn+60,90),n.restore(),n.drawImage(this.frame,Xc,qc),this.status(e),n.fillStyle="rgba(8,4,4,0.72)",n.fillRect(0,Wt-34,It,34),n.fillStyle="#efe6d2",n.font=`12px ${Zt}`,this.spaced("NOW SHOWING · A DREAM · ALL NIGHT",It/2,Wt-13,3,"center")}kenBurns(e,n){const i=1.06+.05*Math.sin(n*.07),r=Math.sin(n*.05)*10,o=Math.cos(n*.043)*5,a=hn*i,l=un*i;this.fctx.drawImage(e,(hn-a)/2+r,(un-l)/2+o,a,l)}standIn(e){const n=this.fctx,i=n.createLinearGradient(0,0,0,un);i.addColorStop(0,"#3a2440"),i.addColorStop(1,"#170d1c"),n.fillStyle=i,n.fillRect(0,0,hn,un);const r=[12,330,280,20,350];for(let o=0;o<5;o++){const a=e*(.11+o*.03)+o*1.7,l=hn/2+Math.cos(a)*(60+o*14)*(o%2?1:-1),c=un/2+Math.sin(a*1.3)*30,u=52+22*Math.sin(a*.7+o),h=n.createRadialGradient(l,c,0,l,c,u);h.addColorStop(0,`hsla(${r[o]} 90% 66% / 0.75)`),h.addColorStop(1,`hsla(${r[o]} 90% 50% / 0)`),n.fillStyle=h,n.fillRect(0,0,hn,un)}}status(e){const n=this.ctx,i=this.env.feeds.dreams.value,r=this.env.feeds.chronicle.value;n.font=`12px ${Zt}`;let o,a;i.known&&i.awake?(a=Math.sin(e*4)>0?"#ff3b3b":"#6a1010",o=`LIVE  frame ${ff(i.frame)}${i.viewers?`  ·  ${i.viewers} watching`:""}`):i.known?(a="#5a5a5a",o=r.thumb?"asleep  ·  last remembered":"asleep  ·  wakes when watched"):(a="#3a3a3a",o=r.thumb?"last remembered":"no signal  ·  a stand-in");const l=n.measureText(o).width+34;n.fillStyle="rgba(0,0,0,0.55)",n.fillRect(14,14,l,24),n.fillStyle=a,n.beginPath(),n.arc(27,26,4.5,0,Math.PI*2),n.fill(),n.fillStyle="#f2e9dc",n.fillText(o,38,30)}}const Cf="#04060c",Yc="#9fc6ff",Ys="#3d5378",Ks="#c9d1d9",Rf="#a5e3b5",ta="#ffc387",Kc=[["GET","/api/dreams/status","how it is (never wakes it)"],["WS ","/ws/dreams","the dream itself, h264"],["GET","/api/dreams/stream","MPEG-TS"],["SSE","/api/dreams/sse","events"],["GET","/api/dreams/embed","take it with you"]];class Pf extends xn{constructor(e,n){super(e,n);R(this,"askedAt",-10);R(this,"lastRaw");this.fps=12}draw(e){const n=this.ctx;this.clear(Cf);const i=this.env.feeds.dreams.value.raw;i!==this.lastRaw&&(this.lastRaw=i,this.askedAt=e);const r=e-this.askedAt;n.font=`13px ${Zt}`;const o=`curl -s ${location.host}/api/dreams/status`,a=o.slice(0,Math.floor(r*38));if(n.fillStyle=Ys,n.fillText("$",16,28),n.fillStyle=Yc,n.fillText(a+(a.length<o.length||Math.floor(e*2)%2?"▌":""),32,28),a.length>=o.length){const c=i?Lf(i,11):[[{text:"curl: (52) the dream did not answer",color:"#e58a8a"}]],u=Math.floor((r-o.length/38)*30);c.slice(0,u).forEach((h,d)=>{let f=16;for(const p of h)n.fillStyle=p.color,n.fillText(p.text,f,52+d*17),f+=n.measureText(p.text).width})}const l=Wt-128;n.fillStyle="rgba(159,198,255,0.06)",n.fillRect(10,l-20,It-20,138),n.strokeStyle="rgba(159,198,255,0.25)",n.strokeRect(10.5,l-19.5,It-21,137),n.font=`11px ${Zt}`,n.fillStyle=Ys,n.fillText("ENDPOINTS",20,l-4),Kc.forEach(([c,u,h],d)=>{const f=l+16+d*19,p=Math.floor(e/2.5)%Kc.length===d;n.fillStyle=p?ta:Ys,n.fillText(c,20,f),n.fillStyle=p?"#ffffff":Yc,n.fillText(u,58,f),n.fillStyle=Ys,n.fillText(h,250,f)})}}function Lf(s,t){const e=[],n=(i,r,o,a)=>{if(e.length>=t)return;const l=[{text:r,color:Ks}];o!==null&&l.push({text:`"${o}": `,color:Ks});const c=a?"":",";if(i&&typeof i=="object"&&!Array.isArray(i)){const d=Object.entries(i);e.push([...l,{text:"{",color:Ks}]),d.forEach(([f,p],x)=>n(p,`${r}  `,f,x===d.length-1)),e.length<t&&e.push([{text:`${r}}${c}`,color:Ks}]);return}let u,h;typeof i=="string"?(u=`"${i}"`,h=Rf):Array.isArray(i)?(u=JSON.stringify(i),h=ta):(u=String(i),h=ta),e.push([...l,{text:u,color:h},{text:c,color:Ks}])};return n(s,"",null,!0),e.length>=t&&(e[t-1]=[{text:"  …",color:Ys}]),e}const Be={bg:"#181522",screen:"#231f36",fg:"#c9d1d9",dim:"#6e7681",sys:"#8b949e",quit:"#f85149",action:"#a371f7",join:"#3fb950"},Zc=["#58a6ff","#3fb950","#d29922","#a371f7","#f778ba","#39c5cf","#ff7b72","#7ee787","#ffa657","#79c0ff","#d2a8ff","#56d364"];function Df(s){let t=0;for(const e of s)t=t*31+e.charCodeAt(0)>>>0;return Zc[t%Zc.length]??Be.fg}function If(s){const t=[{text:`[${s.stamp}] `,color:Be.dim}],e=s.nick,n=s.content;switch(s.type){case"message":t.push({text:`<${e}> `,color:Df(e)},{text:n,color:Be.fg});break;case"action":t.push({text:`* ${e} ${n}`,color:Be.action});break;case"quit":t.push({text:`⫫ ${e} has quit${n?` (${n})`:""}`,color:Be.quit});break;case"part":t.push({text:`← ${e} has left${n?` (${n})`:""}`,color:Be.sys});break;case"join":t.push({text:`→ ${e} has joined`,color:Be.join});break;case"kick":{const i=s.reason||n;t.push({text:`⚠ ${s.target?`${s.target} was kicked by ${e}`:`${e} kicked someone`}${i?` (${i})`:""}`,color:Be.quit})}break;default:t.push({text:`*** ${n||e}`,color:Be.sys})}return t}const Jc=16,rs=16,ea=50;class Nf extends xn{constructor(e,n){super(e,n);R(this,"laidOut",[]);R(this,"seen",-1);this.fps=15}layout(){const e=this.env.feeds.irc.value;e.version!==this.seen&&(this.seen=e.version,this.ctx.font=`12.5px ${Zt}`,this.laidOut=e.lines.map(n=>({rows:this.wrapChunks(If(n),It-rs*2),at:n.at})))}wrapChunks(e,n){var a;const i=this.ctx,r=[[]];let o=0;for(const l of e)for(const c of l.text.split(/(\s+)/)){if(!c)continue;const u=i.measureText(c).width;o+u>n&&o>0&&c.trim()&&(r.push([{text:"    ",color:l.color}]),o=i.measureText("    ").width),(a=r[r.length-1])==null||a.push({text:c,color:l.color}),o+=u}return r}draw(e){this.layout();const n=this.ctx,i=this.env.feeds.irc.value;this.clear(Be.bg),n.fillStyle=Be.screen,n.fillRect(6,6,It-12,Wt-12),n.fillStyle="rgba(88,166,255,0.1)",n.fillRect(6,6,It-12,28),n.font=`13px ${Zt}`,n.fillStyle="#58a6ff",n.fillText("#aethera",rs,25),n.fillStyle=Be.dim,n.font=`11px ${Zt}`,n.textAlign="right";const r=i.connected?Math.sin(e*3)>-.3?"● live":"○ live":"○ connecting…";n.fillStyle=i.connected?Be.join:Be.dim,n.fillText(r,It-rs,25),n.textAlign="left";const o=i.collapse?Math.min(1,(performance.now()-i.collapse.at)/1500):0;n.font=`12.5px ${Zt}`;const a=[],l=performance.now();for(const h of this.laidOut)for(const d of h.rows)a.push({chunks:d,fresh:Math.max(0,1-(l-h.at)/600)});const c=Math.floor((Wt-ea-12)/Jc),u=a.slice(-c);u.length||(n.fillStyle=Be.sys,n.fillText(i.connected?"*** the channel is quiet between fragments":"*** connecting to #aethera…",rs,ea+12)),u.forEach((h,d)=>{let f=rs;const p=ea+12+d*Jc,x=o?Math.sin(p*.3+e*40)*8*o*(Math.random()<.3?1:0):0;for(const m of h.chunks)n.fillStyle=o>.2&&Math.random()<o*.4?Be.quit:m.color,n.globalAlpha=1-h.fresh*.6,n.fillText(m.text,f+x,p),f+=n.measureText(m.text).width;n.globalAlpha=1}),i.collapse&&(n.fillStyle=`rgba(248,81,73,${.08*o})`,n.fillRect(0,0,It,Wt),n.fillStyle=Be.quit,n.font=`11px ${Zt}`,n.textAlign="right",n.fillText(`*** ${i.collapse.type}`,It-rs,Wt-14),n.textAlign="left")}}const Uf={pelos:"#8c6a4f",halon:"#6fa8a0",keramai:"#c2803a",chalkis:"#7d4a86",pyrrha:"#d14e3c",elektra:"#e0b33a",daphnaia:"#4e8b4a",ouranis:"#3d5fa8"},jc=[["Arche",null,0],["Ostrakon Row","pelos",60],["Grammateion",null,0],["Pelos Walk","pelos",60],["Eisphora",null,0],["Boreas Gate",null,200],["Halas Steps","halon",100],["Moira",null,0],["Tarichos Street","halon",100],["Limen Approach","halon",120],["Desmoterion",null,0],["Kerameikos Walk","keramai",140],["Pyrphoros",null,150],["Amphora Yard","keramai",140],["Pithos Street","keramai",160],["Eos Gate",null,200],["Chalkeion Gate","chalkis",180],["Grammateion",null,0],["Akmon Court","chalkis",180],["Orichalkon Row","chalkis",200],["Temenos",null,0],["Kaminos Way","pyrrha",220],["Moira",null,0],["Pyrrha Rise","pyrrha",220],["Phlox Avenue","pyrrha",240],["Notos Gate",null,200],["Elektron Quay","elektra",260],["Helios Terrace","elektra",260],["Krene",null,150],["Lampter Mile","elektra",280],["Kerux",null,0],["Daphne Green","daphnaia",300],["Myrtos Park","daphnaia",300],["Grammateion",null,0],["Kotinos Crown","daphnaia",320],["Zephyros Gate",null,200],["Moira",null,0],["Astron Hill","ouranis",350],["Choregia",null,0],["Ouranos Point","ouranis",400]],ui=[{name:"ada",model:!1,color:"#f2efe6"},{name:"claude",model:!0,color:"#d97757"},{name:"tomas",model:!1,color:"#6fb3e0"},{name:"gemma",model:!0,color:"#9be07a"}];function na(s){return s<=10?[10-s,10]:s<=20?[0,10-(s-10)]:s<=30?[s-20,0]:[10,s-30]}const Qc=17,Ff=It/2,ia=168;function vn(s,t){const e=(s-5.5)*Qc,n=(t-5.5)*Qc;return[Ff+(e-n)*.72,ia+(e+n)*.42]}class Of extends xn{constructor(e,n){super(e,n);R(this,"pos",[0,0,0,0]);R(this,"hop",{seat:0,from:0,left:0,k:0});R(this,"dice",[3,4]);R(this,"owner",new Map);R(this,"log",["A new game begins with 4 players."]);R(this,"turn",0);R(this,"wait",1.2);R(this,"rand",Ii(4242));this.fps=20}say(e){this.log=[...this.log,e].slice(-3)}step(e){var o;if(this.hop.left>0){this.hop.k+=e/.16,this.hop.k>=1&&(this.hop.k=0,this.hop.left--,this.pos[this.hop.seat]=((this.pos[this.hop.seat]??0)+1)%40,this.hop.left===0&&this.land(this.hop.seat));return}if(this.wait-=e,this.wait>0)return;const n=this.turn%ui.length,i=1+Math.floor(this.rand()*6),r=1+Math.floor(this.rand()*6);this.dice=[i,r],this.say(`${(o=ui[n])==null?void 0:o.name} rolls ${i} and ${r}.`),this.hop={seat:n,from:this.pos[n]??0,left:i+r,k:0},this.turn++,this.wait=1.6}land(e){var c,u;const n=this.pos[e]??0,[i,r,o]=jc[n]??["",null,0],a=((c=ui[e])==null?void 0:c.name)??"",l=this.owner.get(n);if(o&&l===void 0&&this.rand()<.75)this.owner.set(n,e),this.say(`${a} buys ${i} for ₯${o}.`);else if(l!==void 0&&l!==e){const h=Math.max(2,Math.round(o/(r?12:8)));this.say(`${a} pays ₯${h} to ${(u=ui[l])==null?void 0:u.name} for ${i}.`)}else i==="Moira"||i==="Grammateion"?this.say(`${a} draws from ${i}.`):i==="Kerux"&&(this.say(`${a} is sent to the Desmoterion.`),this.pos[e]=10);this.owner.size>22&&this.owner.clear()}draw(e,n){var c;this.step(Math.min(n,.2));const i=this.ctx,r=i.createRadialGradient(It/2,ia,40,It/2,ia,It*.7);r.addColorStop(0,"#2a241f"),r.addColorStop(1,"#141210"),i.fillStyle=r,i.fillRect(0,0,It,Wt);const o=[vn(-.4,-.4),vn(11.4,-.4),vn(11.4,11.4),vn(-.4,11.4)];i.fillStyle="rgba(0,0,0,0.45)",i.beginPath(),o.forEach(([u,h],d)=>d?i.lineTo(u,h+8):i.moveTo(u,h+8)),i.fill(),i.fillStyle="#d9ccb2",i.beginPath(),o.forEach(([u,h],d)=>d?i.lineTo(u,h):i.moveTo(u,h)),i.fill();for(let u=0;u<40;u++){const[h,d]=na(u),[,f]=jc[u]??["",null,0],p=[vn(h,d),vn(h+1,d),vn(h+1,d+1),vn(h,d+1)];i.fillStyle=f?Uf[f]??"#efe4cf":u%10===0?"#e6d6b6":"#efe4cf",i.strokeStyle="#7a6a52",i.lineWidth=.7,i.beginPath(),p.forEach(([m,g],S)=>S?i.lineTo(m,g):i.moveTo(m,g)),i.closePath(),i.fill(),i.stroke();const x=this.owner.get(u);if(x!==void 0){const[m,g]=vn(h+.5,d+.5);i.fillStyle=((c=ui[x])==null?void 0:c.color)??"#fff",i.fillRect(m-2,g-5,4,5)}}const[a,l]=vn(5.5,5.5);i.fillStyle="#7a6a52",i.font=`15px ${Zt}`,this.spaced("KLEROS",a,l+5,5,"center"),ui.forEach((u,h)=>{let d=this.pos[h]??0,f=0,[p,x]=na(d);if(this.hop.left>0&&this.hop.seat===h){const[E,M]=na((d+1)%40);p+=(E-p)*this.hop.k,x+=(M-x)*this.hop.k,f=Math.sin(this.hop.k*Math.PI)*9,d=-1}const m=[[.3,.3],[.7,.3],[.3,.7],[.7,.7]][h]??[.5,.5],[g,S]=vn(p+(m[0]??.5),x+(m[1]??.5));i.fillStyle="rgba(0,0,0,0.35)",i.beginPath(),i.ellipse(g,S+1,5,2.5,0,0,Math.PI*2),i.fill(),i.fillStyle=u.color,i.beginPath(),i.arc(g,S-5-f,4.6,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(0,0,0,0.5)",i.stroke()}),this.dice.forEach((u,h)=>this.die(It-70+h*30,22,u,e)),i.font=`11px ${Zt}`,ui.forEach((u,h)=>{const d=26+h*16;i.fillStyle=u.color,i.fillRect(16,d-8,8,8),i.fillStyle=(this.turn-1)%ui.length===h?"#f5ecd9":"#8c826f",i.fillText(`${u.name}${u.model?"  ◆ model":""}`,30,d)}),i.fillStyle="rgba(10,8,6,0.75)",i.fillRect(0,Wt-62,It,62),i.font=`12px ${Zt}`,this.log.forEach((u,h)=>{i.fillStyle=h===this.log.length-1?"#f1e6cc":"#8a7f6a",i.fillText(u,16,Wt-42+h*16)})}die(e,n,i,r){const o=this.ctx,a=this.hop.left>0?Math.sin(r*30)*.15:0;o.save(),o.translate(e,n),o.rotate(a),o.fillStyle="#efe4cf",o.fillRect(-10,-10,20,20),o.fillStyle="#3a2f24";const l={1:[[0,0]],2:[[-5,-5],[5,5]],3:[[-5,-5],[0,0],[5,5]],4:[[-5,-5],[5,-5],[-5,5],[5,5]],5:[[-5,-5],[5,-5],[0,0],[-5,5],[5,5]],6:[[-5,-5],[5,-5],[-5,0],[5,0],[-5,5],[5,5]]};for(const[c,u]of l[i]??[])o.beginPath(),o.arc(c,u,1.8,0,Math.PI*2),o.fill();o.restore()}}class kf extends xn{constructor(e,n){super(e,n);R(this,"body");R(this,"creatureRef");R(this,"stars");R(this,"breaths",[]);this.fps=24;const i=Ii(33);this.stars=Array.from({length:90},()=>({x:i()*It,y:i()*Wt,a:i()*.5+.1})),this.body=eh()}sync(){const e=this.env.feeds.creature.value;e!==this.creatureRef&&(this.creatureRef=e,this.body=e?Bf(e):eh(),this.breaths=Array.from({length:Math.min(4,this.body.edges.length)},(n,i)=>({edge:i*7%Math.max(1,this.body.edges.length),k:0,fwd:!0})))}draw(e,n){this.sync();const i=this.ctx,r=this.body,o=i.createLinearGradient(0,0,0,Wt);o.addColorStop(0,"#070b14"),o.addColorStop(1,"#02030a"),i.fillStyle=o,i.fillRect(0,0,It,Wt);for(const p of this.stars)i.fillStyle=`rgba(200,215,255,${p.a*(.7+.3*Math.sin(e+p.x))})`,i.fillRect(p.x,p.y,1,1);const a=r.born?1.4:.9,l=Math.min(n,.1),c=r.nodes.map((p,x)=>{var S;const m=r.adj[x]??[];let g=0;for(const E of m)g+=Math.sin((((S=r.nodes[E])==null?void 0:S.phase)??0)-p.phase);return p.phase+(p.omega+(m.length?a*g/m.length:0))*l});r.nodes.forEach((p,x)=>{const m=c[x]??p.phase;Math.floor(m/(Math.PI*2))>Math.floor(p.phase/(Math.PI*2))&&(p.flash=1),p.phase=m,p.flash=Math.max(0,p.flash-l*2.2)});const u=e*.18,h=Math.cos(u),d=Math.sin(u),f=r.nodes.map((p,x)=>{const m=Math.sin(e*.9+x)*.02,g=p.x*h-p.z*d,E=2.8/(3.6-(p.x*d+p.z*h));return{x:It/2+g*E*150,y:176+(p.y+m)*E*150,k:E}});i.lineCap="round";for(const p of r.edges){const x=f[p.a],m=f[p.b];!x||!m||(i.strokeStyle=p.elder?"rgba(160,200,235,0.55)":"rgba(140,170,210,0.28)",i.lineWidth=p.elder?1.4:.8,i.beginPath(),i.moveTo(x.x,x.y),i.lineTo(m.x,m.y),i.stroke())}for(const p of this.breaths){const x=r.edges[p.edge];if(!x)continue;if(p.k+=l/.75,p.k>=1){const y=p.fwd?x.b:x.a,w=(r.adj[y]??[]).map(T=>r.edges.findIndex(L=>L.a===y&&L.b===T||L.b===y&&L.a===T)),C=w[Math.floor(Math.random()*w.length)]??p.edge,v=r.edges[C];p.edge=C,p.fwd=v?v.a===y:!0,p.k=0;continue}const m=f[p.fwd?x.a:x.b],g=f[p.fwd?x.b:x.a];if(!m||!g)continue;const S=m.x+(g.x-m.x)*p.k,E=m.y+(g.y-m.y)*p.k,M=i.createRadialGradient(S,E,0,S,E,9);M.addColorStop(0,"rgba(235,245,255,0.95)"),M.addColorStop(1,"rgba(180,220,255,0)"),i.fillStyle=M,i.fillRect(S-9,E-9,18,18)}r.nodes.forEach((p,x)=>{const m=f[x];if(!m)return;const g=p.flash,S=2+m.k*1.2+g*3,E=g>.05?`rgba(255,${Math.round(210-g*40)},${Math.round(120-g*60)},${.6+g*.4})`:"rgba(200,225,255,0.85)";i.strokeStyle=E,i.lineWidth=.8,i.beginPath(),i.moveTo(m.x-S*3,m.y),i.lineTo(m.x+S*3,m.y),i.moveTo(m.x,m.y-S*3),i.lineTo(m.x,m.y+S*3),i.stroke();const M=i.createRadialGradient(m.x,m.y,0,m.x,m.y,S*2.4);M.addColorStop(0,E),M.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=M,i.fillRect(m.x-S*3,m.y-S*3,S*6,S*6)}),i.font=`15px ${Zt}`,i.fillStyle=r.born?"#e6f1ff":"#8190a8",i.fillText(r.name,18,Wt-40),i.font=`11px ${Zt}`,i.fillStyle="#6f7f99",i.fillText(r.age,18,Wt-20),i.textAlign="right",i.fillStyle="#4b5870",i.fillText(r.born?`${r.nodes.length} nodes · ${r.edges.length} strings`:"click to wake it",It-18,Wt-20),i.textAlign="left"}}function th(s,t){var n,i;const e=Array.from({length:s},()=>[]);for(const r of t)(n=e[r.a])==null||n.push(r.b),(i=e[r.b])==null||i.push(r.a);return e}function Bf(s){const t=new Map(s.nodes.map((c,u)=>[c.id,u])),e=s.nodes.reduce((c,u)=>c+u.x,0)/s.nodes.length,n=s.nodes.reduce((c,u)=>c+u.y,0)/s.nodes.length,i=s.nodes.reduce((c,u)=>c+u.z,0)/s.nodes.length,r=Math.max(1,...s.nodes.map(c=>Math.hypot(c.x-e,c.y-n,c.z-i))),o=s.nodes.map((c,u)=>({x:(c.x-e)/r,y:(c.y-n)/r,z:(c.z-i)/r,phase:u*1.3,omega:2.4+u%5*.21,flash:0})),a=s.edges.map(c=>({a:t.get(c.a)??-1,b:t.get(c.b)??-1,elder:c.age>150})).filter(c=>c.a>=0&&c.b>=0),l=Math.max(s.lifetime,(Date.now()-s.bornAt)/1e3);return{name:s.name,age:`${zf(l)} old · yours`,born:!0,nodes:o,edges:a,adj:th(o.length,a)}}function eh(){const s=Ii(9),t=9,e=Array.from({length:t},(i,r)=>{const o=r/t*Math.PI*2;return{x:Math.cos(o)*.8+(s()-.5)*.3,y:(s()-.5)*.9,z:Math.sin(o)*.8,phase:s()*6,omega:2.2+s()*.8,flash:0}}),n=[];for(let i=0;i<t;i++)n.push({a:i,b:(i+1)%t,elder:i%3===0});return n.push({a:0,b:4,elder:!1},{a:2,b:6,elder:!1},{a:3,b:8,elder:!0}),{name:"something stirs",age:"unborn in this browser",born:!1,nodes:e,edges:n,adj:th(t,n)}}function zf(s){const t=Math.max(0,Math.floor(s)),e=Math.floor(t/86400),n=Math.floor(t%86400/3600),i=Math.floor(t%3600/60);return e>0?`${e}d ${n}h`:n>0?`${n}h ${i}m`:`${i}m`}const os=new Image;os.src="/static/oikos/boot-logo.webp";class Hf extends xn{constructor(e,n){super(e,n);R(this,"specks");this.fps=12;const i=Ii(7);this.specks=Array.from({length:70},()=>({x:i()*It,y:i()*Wt,r:i()*1.2+.3,red:i()<.35,v:i()*4+1}))}draw(e){const n=this.ctx;this.clear("#000");for(const c of this.specks){const u=(c.y-e*c.v+Wt)%Wt;n.fillStyle=c.red?"rgba(170,40,50,0.55)":"rgba(255,255,255,0.28)",n.fillRect(c.x,u,c.r,c.r)}if(os.complete&&os.naturalWidth){const u=210*os.naturalHeight/os.naturalWidth;n.globalAlpha=.92+.08*Math.sin(e*1.3),n.drawImage(os,(It-210)/2,26,210,u),n.globalAlpha=1}n.fillStyle="#7d7d7d",n.font=`13px ${Zt}`,this.spaced("transmissions",It/2,118,3,"center"),n.fillStyle="#262626",n.fillRect(40,132,It-80,1);const i=this.env.dir.posts.slice(0,6);if(!i.length){n.fillStyle="#9a9a9a",n.font=`16px ${Zt}`,n.textAlign="center",n.fillText(`no transmissions yet${Math.floor(e*2)%2?"_":" "}`,It/2,230),n.textAlign="left";return}const r=3.6,o=Math.floor(e/r)%i.length,a=e%r/r;i.forEach((c,u)=>{const h=162+u*29,d=u===o;n.font=`11px ${Zt}`,n.fillStyle=d?"#bdbdbd":"#555",n.fillText(c.date,46,h),n.font=`16px ${$o}`,n.fillStyle=d?"#ffffff":"#9a9a9a";const f=c.title.length>38?`${c.title.slice(0,37)}…`:c.title;n.fillText(f,132,h),d&&this.star(28,h-5,e)});const l=i[o];if(l!=null&&l.excerpt){n.font=`italic 12px ${Zt}`,n.fillStyle="#8a8a8a";const c=Math.floor(Math.min(1,a*1.6)*l.excerpt.length);this.wrap(l.excerpt.slice(0,c),It-92,2).forEach((h,d)=>n.fillText(h,46,344+d*16))}}star(e,n,i){const r=this.ctx,o=7+Math.sin(i*5)*1.2;r.save(),r.translate(e,n),r.rotate(i*.8),r.fillStyle="#fff",r.shadowColor="#fff",r.shadowBlur=10,r.beginPath();for(let a=0;a<16;a++){const l=a/16*Math.PI*2,c=a%2?o*.28:a%4?o*.7:o;r.lineTo(Math.cos(l)*c,Math.sin(l)*c)}r.closePath(),r.fill(),r.restore()}}const Gf={transmissions:Hf,dreams:Af,chronicle:Sf,"dreams-api":Pf,apeiron:yf,syrinx:kf,afterlife:mf,irc:Nf,parlor:Of,dream_gen:Tf};class Vf extends xn{draw(t){const e=this.ctx,n=["#c0c0c0","#c0c000","#00c0c0","#00c000","#c000c0","#c00000","#0000c0"];n.forEach((i,r)=>{e.fillStyle=i,e.fillRect(r*It/n.length,0,It/n.length+1,Wt*.66)}),e.fillStyle="#111",e.fillRect(0,Wt*.66,It,Wt*.34),e.fillStyle="#fff",e.font=`22px ${Zt}`,e.textAlign="center",e.fillText(this.site.title,It/2,Wt*.82),e.font=`12px ${Zt}`,e.fillStyle=Math.floor(t)%2?"#888":"#555",e.fillText("no programme yet",It/2,Wt*.92),e.textAlign="left"}}function Wf(s,t){const e=Gf[s.id]??Vf;return new e(s,t)}const Cr={dreams:{angle:0,r:4.9,y:.5,style:"tv",screenW:2,channel:1},transmissions:{angle:-27,r:4.5,y:.34,style:"beige",screenW:1.22,stand:!0,channel:2},chronicle:{angle:27,r:4.5,y:0,style:"black",screenW:1.3,channel:3},"dreams-api":{angle:27,r:4.5,y:0,style:"grey",screenW:.86,on:"chronicle",channel:4},apeiron:{angle:-54,r:4.2,y:0,style:"black",screenW:1.15,channel:5},irc:{angle:-54,r:4.2,y:0,style:"beige",screenW:.95,on:"apeiron",channel:6},syrinx:{angle:54,r:4.2,y:.28,style:"grey",screenW:1.08,channel:7},afterlife:{angle:78,r:3.9,y:0,style:"black",screenW:1.02,channel:10},dream_gen:{angle:-20,r:7,y:4.35,style:"grey",screenW:1.02,hang:!0,feeds:"dreams",channel:8},parlor:{angle:20,r:6.5,y:3.6,style:"beige",screenW:1.1,hang:!0,channel:9}};function $f(s,t){const e=Cr[s];if(e)return e;const n=Math.floor(t/2)+1;return{angle:(t%2?1:-1)*(68+n*10),r:5.4,y:0,style:"grey",screenW:1,channel:12+t}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const sa="185",as={ROTATE:0,DOLLY:1,PAN:2},ls={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Xf=0,nh=1,qf=2,Rr=1,Yf=2,Zs=3,di=0,Ye=1,qn=2,Dn=0,cs=1,Pr=2,ih=3,sh=4,Kf=5,ki=100,Zf=101,Jf=102,jf=103,Qf=104,tp=200,ep=201,np=202,ip=203,ra=204,oa=205,sp=206,rp=207,op=208,ap=209,lp=210,cp=211,hp=212,up=213,dp=214,aa=0,la=1,ca=2,hs=3,ha=4,ua=5,da=6,fa=7,rh=0,fp=1,pp=2,In=0,pa=1,ma=2,ga=3,Lr=4,xa=5,va=6,_a=7,oh=300,Bi=301,us=302,Ma=303,ya=304,Dr=306,Ir=1e3,Yn=1001,ba=1002,ze=1003,mp=1004,Nr=1005,He=1006,Sa=1007,zi=1008,nn=1009,ah=1010,lh=1011,Js=1012,wa=1013,Nn=1014,_n=1015,sn=1016,Ea=1017,Ta=1018,js=1020,ch=35902,hh=35899,uh=1021,dh=1022,Mn=1023,Kn=1026,Hi=1027,Aa=1028,Ca=1029,Gi=1030,Ra=1031,Pa=1033,Ur=33776,Fr=33777,Or=33778,kr=33779,La=35840,Da=35841,Ia=35842,Na=35843,Ua=36196,Fa=37492,Oa=37496,ka=37488,Ba=37489,Br=37490,za=37491,Ha=37808,Ga=37809,Va=37810,Wa=37811,$a=37812,Xa=37813,qa=37814,Ya=37815,Ka=37816,Za=37817,Ja=37818,ja=37819,Qa=37820,tl=37821,el=36492,nl=36494,il=36495,sl=36283,rl=36284,zr=36285,ol=36286,gp=3200,al=0,xp=1,fi="",Ae="srgb",Qs="srgb-linear",Hr="linear",se="srgb",ds=7680,fh=519,vp=512,_p=513,Mp=514,ll=515,yp=516,bp=517,cl=518,Sp=519,ph=35044,mh="300 es",Un=2e3,tr=2001;function wp(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Gr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Ep(){const s=Gr("canvas");return s.style.display="block",s}const gh={};function xh(...s){const t="THREE."+s.shift();console.log(t,...s)}function vh(s){const t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Ut(...s){s=vh(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function te(...s){s=vh(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function fs(...s){const t=s.join(" ");t in gh||(gh[t]=!0,Ut(...s))}function Tp(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Ap={[aa]:la,[ca]:da,[ha]:fa,[hs]:ua,[la]:aa,[da]:ca,[fa]:ha,[ua]:hs};class pi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}}const Ge=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let _h=1234567;const er=Math.PI/180,ps=180/Math.PI;function ms(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ge[s&255]+Ge[s>>8&255]+Ge[s>>16&255]+Ge[s>>24&255]+"-"+Ge[t&255]+Ge[t>>8&255]+"-"+Ge[t>>16&15|64]+Ge[t>>24&255]+"-"+Ge[e&63|128]+Ge[e>>8&255]+"-"+Ge[e>>16&255]+Ge[e>>24&255]+Ge[n&255]+Ge[n>>8&255]+Ge[n>>16&255]+Ge[n>>24&255]).toLowerCase()}function qt(s,t,e){return Math.max(t,Math.min(e,s))}function hl(s,t){return(s%t+t)%t}function Cp(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Rp(s,t,e){return s!==t?(e-s)/(t-s):0}function nr(s,t,e){return(1-e)*s+e*t}function Pp(s,t,e,n){return nr(s,t,1-Math.exp(-e*n))}function Lp(s,t=1){return t-Math.abs(hl(s,t*2)-t)}function Dp(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Ip(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Np(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Up(s,t){return s+Math.random()*(t-s)}function Fp(s){return s*(.5-Math.random())}function Op(s){s!==void 0&&(_h=s);let t=_h+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function kp(s){return s*er}function Bp(s){return s*ps}function zp(s){return(s&s-1)===0&&s!==0}function Hp(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Gp(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Vp(s,t,e,n,i){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),u=o((t+n)/2),h=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),p=o((n-t)/2);switch(i){case"XYX":s.set(a*u,l*h,l*d,a*c);break;case"YZY":s.set(l*d,a*u,l*h,a*c);break;case"ZXZ":s.set(l*h,l*d,a*u,a*c);break;case"XZX":s.set(a*u,l*p,l*f,a*c);break;case"YXY":s.set(l*f,a*u,l*p,a*c);break;case"ZYZ":s.set(l*p,l*f,a*u,a*c);break;default:Ut("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function gs(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ke(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Vr={DEG2RAD:er,RAD2DEG:ps,generateUUID:ms,clamp:qt,euclideanModulo:hl,mapLinear:Cp,inverseLerp:Rp,lerp:nr,damp:Pp,pingpong:Lp,smoothstep:Dp,smootherstep:Ip,randInt:Np,randFloat:Up,randFloatSpread:Fp,seededRandom:Op,degToRad:kp,radToDeg:Bp,isPowerOfTwo:zp,ceilPowerOfTwo:Hp,floorPowerOfTwo:Gp,setQuaternionFromProperEuler:Vp,normalize:Ke,denormalize:gs},bc=class bc{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=qt(this.x,t.x,e.x),this.y=qt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=qt(this.x,t,e),this.y=qt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};bc.prototype.isVector2=!0;let ft=bc;class Fn{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],u=n[i+2],h=n[i+3],d=r[o+0],f=r[o+1],p=r[o+2],x=r[o+3];if(h!==x||l!==d||c!==f||u!==p){let m=l*d+c*f+u*p+h*x;m<0&&(d=-d,f=-f,p=-p,x=-x,m=-m);let g=1-a;if(m<.9995){const S=Math.acos(m),E=Math.sin(S);g=Math.sin(g*S)/E,a=Math.sin(a*S)/E,l=l*g+d*a,c=c*g+f*a,u=u*g+p*a,h=h*g+x*a}else{l=l*g+d*a,c=c*g+f*a,u=u*g+p*a,h=h*g+x*a;const S=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=S,c*=S,u*=S,h*=S}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],u=n[i+3],h=r[o],d=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+u*h+l*f-c*d,t[e+1]=l*p+u*d+c*h-a*f,t[e+2]=c*p+u*f+a*d-l*h,t[e+3]=u*p-a*h-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(i/2),h=a(r/2),d=l(n/2),f=l(i/2),p=l(r/2);switch(o){case"XYZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"YXZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"ZXY":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"ZYX":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"YZX":this._x=d*u*h+c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h-d*f*p;break;case"XZY":this._x=d*u*h-c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h+d*f*p;break;default:Ut("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=n+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>h){const f=2*Math.sqrt(1+n-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>h){const f=2*Math.sqrt(1+a-n-h);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(qt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+i*c-r*l,this._y=i*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-i*a,this._w=o*u-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,i=-i,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){const c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,e=Math.sin(e*c)/u,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Sc=class Sc{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Mh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Mh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),u=2*(a*e-r*i),h=2*(r*n-o*e);return this.x=e+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=i+l*h+r*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=qt(this.x,t.x,e.x),this.y=qt(this.y,t.y,e.y),this.z=qt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=qt(this.x,t,e),this.y=qt(this.y,t,e),this.z=qt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ul.copy(this).projectOnVector(t),this.sub(ul)}reflect(t){return this.sub(ul.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Sc.prototype.isVector3=!0;let P=Sc;const ul=new P,Mh=new Fn,wc=class wc{constructor(t,e,n,i,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){const u=this.elements;return u[0]=t,u[1]=i,u[2]=a,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],p=n[8],x=i[0],m=i[3],g=i[6],S=i[1],E=i[4],M=i[7],y=i[2],w=i[5],C=i[8];return r[0]=o*x+a*S+l*y,r[3]=o*m+a*E+l*w,r[6]=o*g+a*M+l*C,r[1]=c*x+u*S+h*y,r[4]=c*m+u*E+h*w,r[7]=c*g+u*M+h*C,r[2]=d*x+f*S+p*y,r[5]=d*m+f*E+p*w,r[8]=d*g+f*M+p*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*r*u+n*a*l+i*r*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=u*o-a*c,d=a*l-u*r,f=c*r-o*l,p=e*h+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/p;return t[0]=h*x,t[1]=(i*c-u*n)*x,t[2]=(a*n-i*o)*x,t[3]=d*x,t[4]=(u*e-i*l)*x,t[5]=(i*r-a*e)*x,t[6]=f*x,t[7]=(n*l-c*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return fs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(dl.makeScale(t,e)),this}rotate(t){return fs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(dl.makeRotation(-t)),this}translate(t,e){return fs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(dl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};wc.prototype.isMatrix3=!0;let Ht=wc;const dl=new Ht,yh=new Ht().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),bh=new Ht().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Wp(){const s={enabled:!0,workingColorSpace:Qs,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===se&&(i.r=Zn(i.r),i.g=Zn(i.g),i.b=Zn(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===se&&(i.r=xs(i.r),i.g=xs(i.g),i.b=xs(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===fi?Hr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return fs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return fs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Qs]:{primaries:t,whitePoint:n,transfer:Hr,toXYZ:yh,fromXYZ:bh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ae},outputColorSpaceConfig:{drawingBufferColorSpace:Ae}},[Ae]:{primaries:t,whitePoint:n,transfer:se,toXYZ:yh,fromXYZ:bh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ae}}}),s}const Jt=Wp();function Zn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function xs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let vs;class $p{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{vs===void 0&&(vs=Gr("canvas")),vs.width=t.width,vs.height=t.height;const i=vs.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=vs}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Gr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Zn(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Zn(e[n]/255)*255):e[n]=Zn(e[n]);return{data:e,width:t.width,height:t.height}}else return Ut("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Xp=0;class fl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Xp++}),this.uuid=ms(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(pl(i[o].image)):r.push(pl(i[o]))}else r=pl(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function pl(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?$p.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Ut("Texture: Unable to serialize Texture."),{})}let qp=0;const ml=new P;class Ve extends pi{constructor(t=Ve.DEFAULT_IMAGE,e=Ve.DEFAULT_MAPPING,n=Yn,i=Yn,r=He,o=zi,a=Mn,l=nn,c=Ve.DEFAULT_ANISOTROPY,u=fi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qp++}),this.uuid=ms(),this.name="",this.source=new fl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ht,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(ml).x}get height(){return this.source.getSize(ml).y}get depth(){return this.source.getSize(ml).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Ut(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){Ut(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==oh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ir:t.x=t.x-Math.floor(t.x);break;case Yn:t.x=t.x<0?0:1;break;case ba:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ir:t.y=t.y-Math.floor(t.y);break;case Yn:t.y=t.y<0?0:1;break;case ba:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ve.DEFAULT_IMAGE=null,Ve.DEFAULT_MAPPING=oh,Ve.DEFAULT_ANISOTROPY=1;const Ec=class Ec{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],p=l[9],x=l[2],m=l[6],g=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-x)<.01&&Math.abs(p-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+x)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const E=(c+1)/2,M=(f+1)/2,y=(g+1)/2,w=(u+d)/4,C=(h+x)/4,v=(p+m)/4;return E>M&&E>y?E<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(E),i=w/n,r=C/n):M>y?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=w/i,r=v/i):y<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(y),n=C/r,i=v/r),this.set(n,i,r,e),this}let S=Math.sqrt((m-p)*(m-p)+(h-x)*(h-x)+(d-u)*(d-u));return Math.abs(S)<.001&&(S=1),this.x=(m-p)/S,this.y=(h-x)/S,this.z=(d-u)/S,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=qt(this.x,t.x,e.x),this.y=qt(this.y,t.y,e.y),this.z=qt(this.z,t.z,e.z),this.w=qt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=qt(this.x,t,e),this.y=qt(this.y,t,e),this.z=qt(this.z,t,e),this.w=qt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Ec.prototype.isVector4=!0;let ve=Ec;class Yp extends pi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:He,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ve(0,0,t,e),this.scissorTest=!1,this.viewport=new ve(0,0,t,e),this.textures=[];const i={width:t,height:e,depth:n.depth},r=new Ve(i),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:He,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new fl(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class je extends Yp{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Sh extends Ve{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=ze,this.minFilter=ze,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Kp extends Ve{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=ze,this.minFilter=ze,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Do=class Do{constructor(t,e,n,i,r,o,a,l,c,u,h,d,f,p,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,u,h,d,f,p,x,m)}set(t,e,n,i,r,o,a,l,c,u,h,d,f,p,x,m){const g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=i,g[1]=r,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=u,g[10]=h,g[14]=d,g[3]=f,g[7]=p,g[11]=x,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Do().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,i=1/_s.setFromMatrixColumn(t,0).length(),r=1/_s.setFromMatrixColumn(t,1).length(),o=1/_s.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){const d=o*u,f=o*h,p=a*u,x=a*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=f+p*c,e[5]=d-x*c,e[9]=-a*l,e[2]=x-d*c,e[6]=p+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*u,f=l*h,p=c*u,x=c*h;e[0]=d+x*a,e[4]=p*a-f,e[8]=o*c,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=f*a-p,e[6]=x+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*u,f=l*h,p=c*u,x=c*h;e[0]=d-x*a,e[4]=-o*h,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*u,e[9]=x-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*u,f=o*h,p=a*u,x=a*h;e[0]=l*u,e[4]=p*c-f,e[8]=d*c+x,e[1]=l*h,e[5]=x*c+d,e[9]=f*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,p=a*l,x=a*c;e[0]=l*u,e[4]=x-d*h,e[8]=p*h+f,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=f*h+p,e[10]=d-x*h}else if(t.order==="XZY"){const d=o*l,f=o*c,p=a*l,x=a*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+x,e[5]=o*u,e[9]=f*h-p,e[2]=p*h-f,e[6]=a*u,e[10]=x*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Zp,t,Jp)}lookAt(t,e,n){const i=this.elements;return rn.subVectors(t,e),rn.lengthSq()===0&&(rn.z=1),rn.normalize(),mi.crossVectors(n,rn),mi.lengthSq()===0&&(Math.abs(n.z)===1?rn.x+=1e-4:rn.z+=1e-4,rn.normalize(),mi.crossVectors(n,rn)),mi.normalize(),Wr.crossVectors(rn,mi),i[0]=mi.x,i[4]=Wr.x,i[8]=rn.x,i[1]=mi.y,i[5]=Wr.y,i[9]=rn.y,i[2]=mi.z,i[6]=Wr.z,i[10]=rn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],p=n[2],x=n[6],m=n[10],g=n[14],S=n[3],E=n[7],M=n[11],y=n[15],w=i[0],C=i[4],v=i[8],T=i[12],L=i[1],D=i[5],U=i[9],K=i[13],Z=i[2],N=i[6],W=i[10],B=i[14],X=i[3],nt=i[7],ot=i[11],at=i[15];return r[0]=o*w+a*L+l*Z+c*X,r[4]=o*C+a*D+l*N+c*nt,r[8]=o*v+a*U+l*W+c*ot,r[12]=o*T+a*K+l*B+c*at,r[1]=u*w+h*L+d*Z+f*X,r[5]=u*C+h*D+d*N+f*nt,r[9]=u*v+h*U+d*W+f*ot,r[13]=u*T+h*K+d*B+f*at,r[2]=p*w+x*L+m*Z+g*X,r[6]=p*C+x*D+m*N+g*nt,r[10]=p*v+x*U+m*W+g*ot,r[14]=p*T+x*K+m*B+g*at,r[3]=S*w+E*L+M*Z+y*X,r[7]=S*C+E*D+M*N+y*nt,r[11]=S*v+E*U+M*W+y*ot,r[15]=S*T+E*K+M*B+y*at,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],f=t[14],p=t[3],x=t[7],m=t[11],g=t[15],S=l*f-c*d,E=a*f-c*h,M=a*d-l*h,y=o*f-c*u,w=o*d-l*u,C=o*h-a*u;return e*(x*S-m*E+g*M)-n*(p*S-m*y+g*w)+i*(p*E-x*y+g*C)-r*(p*M-x*w+m*C)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],u=t[10];return e*(o*u-a*c)-n*(r*u-a*l)+i*(r*c-o*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],f=t[11],p=t[12],x=t[13],m=t[14],g=t[15],S=e*a-n*o,E=e*l-i*o,M=e*c-r*o,y=n*l-i*a,w=n*c-r*a,C=i*c-r*l,v=u*x-h*p,T=u*m-d*p,L=u*g-f*p,D=h*m-d*x,U=h*g-f*x,K=d*g-f*m,Z=S*K-E*U+M*D+y*L-w*T+C*v;if(Z===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/Z;return t[0]=(a*K-l*U+c*D)*N,t[1]=(i*U-n*K-r*D)*N,t[2]=(x*C-m*w+g*y)*N,t[3]=(d*w-h*C-f*y)*N,t[4]=(l*L-o*K-c*T)*N,t[5]=(e*K-i*L+r*T)*N,t[6]=(m*M-p*C-g*E)*N,t[7]=(u*C-d*M+f*E)*N,t[8]=(o*U-a*L+c*v)*N,t[9]=(n*L-e*U-r*v)*N,t[10]=(p*w-x*M+g*S)*N,t[11]=(h*M-u*w-f*S)*N,t[12]=(a*T-o*D-l*v)*N,t[13]=(e*D-n*T+i*v)*N,t[14]=(x*E-p*y-m*S)*N,t[15]=(u*y-h*E+d*S)*N,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,u*a+n,u*l-i*o,0,c*l-i*a,u*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,u=o+o,h=a+a,d=r*c,f=r*u,p=r*h,x=o*u,m=o*h,g=a*h,S=l*c,E=l*u,M=l*h,y=n.x,w=n.y,C=n.z;return i[0]=(1-(x+g))*y,i[1]=(f+M)*y,i[2]=(p-E)*y,i[3]=0,i[4]=(f-M)*w,i[5]=(1-(d+g))*w,i[6]=(m+S)*w,i[7]=0,i[8]=(p+E)*C,i[9]=(m-S)*C,i[10]=(1-(d+x))*C,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=_s.set(i[0],i[1],i[2]).length();const a=_s.set(i[4],i[5],i[6]).length(),l=_s.set(i[8],i[9],i[10]).length();r<0&&(o=-o),yn.copy(this);const c=1/o,u=1/a,h=1/l;return yn.elements[0]*=c,yn.elements[1]*=c,yn.elements[2]*=c,yn.elements[4]*=u,yn.elements[5]*=u,yn.elements[6]*=u,yn.elements[8]*=h,yn.elements[9]*=h,yn.elements[10]*=h,e.setFromRotationMatrix(yn),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,i,r,o,a=Un,l=!1){const c=this.elements,u=2*r/(e-t),h=2*r/(n-i),d=(e+t)/(e-t),f=(n+i)/(n-i);let p,x;if(l)p=r/(o-r),x=o*r/(o-r);else if(a===Un)p=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===tr)p=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=Un,l=!1){const c=this.elements,u=2/(e-t),h=2/(n-i),d=-(e+t)/(e-t),f=-(n+i)/(n-i);let p,x;if(l)p=1/(o-r),x=o/(o-r);else if(a===Un)p=-2/(o-r),x=-(o+r)/(o-r);else if(a===tr)p=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};Do.prototype.isMatrix4=!0;let re=Do;const _s=new P,yn=new re,Zp=new P(0,0,0),Jp=new P(1,1,1),mi=new P,Wr=new P,rn=new P,wh=new re,Eh=new Fn;class Jn{constructor(t=0,e=0,n=0,i=Jn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],u=i[9],h=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-qt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(qt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-qt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(qt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Ut("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return wh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(wh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Eh.setFromEuler(this),this.setFromQuaternion(Eh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Jn.DEFAULT_ORDER="XYZ";class gl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let jp=0;const Th=new P,Ms=new Fn,jn=new re,$r=new P,ir=new P,Qp=new P,tm=new Fn,Ah=new P(1,0,0),Ch=new P(0,1,0),Rh=new P(0,0,1),Ph={type:"added"},em={type:"removed"},ys={type:"childadded",child:null},xl={type:"childremoved",child:null};class Ce extends pi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:jp++}),this.uuid=ms(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ce.DEFAULT_UP.clone();const t=new P,e=new Jn,n=new Fn,i=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new re},normalMatrix:{value:new Ht}}),this.matrix=new re,this.matrixWorld=new re,this.matrixAutoUpdate=Ce.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ms.setFromAxisAngle(t,e),this.quaternion.multiply(Ms),this}rotateOnWorldAxis(t,e){return Ms.setFromAxisAngle(t,e),this.quaternion.premultiply(Ms),this}rotateX(t){return this.rotateOnAxis(Ah,t)}rotateY(t){return this.rotateOnAxis(Ch,t)}rotateZ(t){return this.rotateOnAxis(Rh,t)}translateOnAxis(t,e){return Th.copy(t).applyQuaternion(this.quaternion),this.position.add(Th.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ah,t)}translateY(t){return this.translateOnAxis(Ch,t)}translateZ(t){return this.translateOnAxis(Rh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(jn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?$r.copy(t):$r.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),ir.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?jn.lookAt(ir,$r,this.up):jn.lookAt($r,ir,this.up),this.quaternion.setFromRotationMatrix(jn),i&&(jn.extractRotation(i.matrixWorld),Ms.setFromRotationMatrix(jn),this.quaternion.premultiply(Ms.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(te("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ph),ys.child=t,this.dispatchEvent(ys),ys.child=null):te("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(em),xl.child=t,this.dispatchEvent(xl),xl.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),jn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),jn.multiply(t.parent.matrixWorld)),t.applyMatrix4(jn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ph),ys.child=t,this.dispatchEvent(ys),ys.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ir,t,Qp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ir,tm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(t.shapes,h)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}Ce.DEFAULT_UP=new P(0,1,0),Ce.DEFAULT_MATRIX_AUTO_UPDATE=!0,Ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class bn extends Ce{constructor(){super(),this.isGroup=!0,this.type="Group"}}const nm={type:"move"};class vl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new bn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new bn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new bn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const x of t.hand.values()){const m=e.getJointPose(x,n),g=this._getHandJoint(c,x);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(nm)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new bn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Lh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},gi={h:0,s:0,l:0},Xr={h:0,s:0,l:0};function _l(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Bt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ae){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Jt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=Jt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Jt.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=Jt.workingColorSpace){if(t=hl(t,1),e=qt(e,0,1),n=qt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=_l(o,r,t+1/3),this.g=_l(o,r,t),this.b=_l(o,r,t-1/3)}return Jt.colorSpaceToWorking(this,i),this}setStyle(t,e=Ae){function n(r){r!==void 0&&parseFloat(r)<1&&Ut("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Ut("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Ut("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ae){const n=Lh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Ut("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Zn(t.r),this.g=Zn(t.g),this.b=Zn(t.b),this}copyLinearToSRGB(t){return this.r=xs(t.r),this.g=xs(t.g),this.b=xs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ae){return Jt.workingToColorSpace(We.copy(this),t),Math.round(qt(We.r*255,0,255))*65536+Math.round(qt(We.g*255,0,255))*256+Math.round(qt(We.b*255,0,255))}getHexString(t=Ae){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Jt.workingColorSpace){Jt.workingToColorSpace(We.copy(this),e);const n=We.r,i=We.g,r=We.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(i-r)/h+(i<r?6:0);break;case i:l=(r-n)/h+2;break;case r:l=(n-i)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=Jt.workingColorSpace){return Jt.workingToColorSpace(We.copy(this),e),t.r=We.r,t.g=We.g,t.b=We.b,t}getStyle(t=Ae){Jt.workingToColorSpace(We.copy(this),t);const e=We.r,n=We.g,i=We.b;return t!==Ae?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(gi),this.setHSL(gi.h+t,gi.s+e,gi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(gi),t.getHSL(Xr);const n=nr(gi.h,Xr.h,e),i=nr(gi.s,Xr.s,e),r=nr(gi.l,Xr.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const We=new Bt;Bt.NAMES=Lh;class Ml{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Bt(t),this.density=e}clone(){return new Ml(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class im extends Ce{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Jn,this.environmentIntensity=1,this.environmentRotation=new Jn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Sn=new P,Qn=new P,yl=new P,ti=new P,bs=new P,Ss=new P,Dh=new P,bl=new P,Sl=new P,wl=new P,El=new ve,Tl=new ve,Al=new ve;class wn{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Sn.subVectors(t,e),i.cross(Sn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Sn.subVectors(i,e),Qn.subVectors(n,e),yl.subVectors(t,e);const o=Sn.dot(Sn),a=Sn.dot(Qn),l=Sn.dot(yl),c=Qn.dot(Qn),u=Qn.dot(yl),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(c*l-a*u)*d,p=(o*u-a*l)*d;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,ti)===null?!1:ti.x>=0&&ti.y>=0&&ti.x+ti.y<=1}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,ti)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ti.x),l.addScaledVector(o,ti.y),l.addScaledVector(a,ti.z),l)}static getInterpolatedAttribute(t,e,n,i,r,o){return El.setScalar(0),Tl.setScalar(0),Al.setScalar(0),El.fromBufferAttribute(t,e),Tl.fromBufferAttribute(t,n),Al.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(El,r.x),o.addScaledVector(Tl,r.y),o.addScaledVector(Al,r.z),o}static isFrontFacing(t,e,n,i){return Sn.subVectors(n,e),Qn.subVectors(t,e),Sn.cross(Qn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Sn.subVectors(this.c,this.b),Qn.subVectors(this.a,this.b),Sn.cross(Qn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return wn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return wn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return wn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return wn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return wn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let o,a;bs.subVectors(i,n),Ss.subVectors(r,n),bl.subVectors(t,n);const l=bs.dot(bl),c=Ss.dot(bl);if(l<=0&&c<=0)return e.copy(n);Sl.subVectors(t,i);const u=bs.dot(Sl),h=Ss.dot(Sl);if(u>=0&&h<=u)return e.copy(i);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(n).addScaledVector(bs,o);wl.subVectors(t,r);const f=bs.dot(wl),p=Ss.dot(wl);if(p>=0&&f<=p)return e.copy(r);const x=f*c-l*p;if(x<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(n).addScaledVector(Ss,a);const m=u*p-f*h;if(m<=0&&h-u>=0&&f-p>=0)return Dh.subVectors(r,i),a=(h-u)/(h-u+(f-p)),e.copy(i).addScaledVector(Dh,a);const g=1/(m+x+d);return o=x*g,a=d*g,e.copy(n).addScaledVector(bs,o).addScaledVector(Ss,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Vi{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(En.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(En.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=En.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,En):En.fromBufferAttribute(r,o),En.applyMatrix4(t.matrixWorld),this.expandByPoint(En);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),qr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),qr.copy(n.boundingBox)),qr.applyMatrix4(t.matrixWorld),this.union(qr)}const i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,En),En.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(sr),Yr.subVectors(this.max,sr),ws.subVectors(t.a,sr),Es.subVectors(t.b,sr),Ts.subVectors(t.c,sr),xi.subVectors(Es,ws),vi.subVectors(Ts,Es),Wi.subVectors(ws,Ts);let e=[0,-xi.z,xi.y,0,-vi.z,vi.y,0,-Wi.z,Wi.y,xi.z,0,-xi.x,vi.z,0,-vi.x,Wi.z,0,-Wi.x,-xi.y,xi.x,0,-vi.y,vi.x,0,-Wi.y,Wi.x,0];return!Cl(e,ws,Es,Ts,Yr)||(e=[1,0,0,0,1,0,0,0,1],!Cl(e,ws,Es,Ts,Yr))?!1:(Kr.crossVectors(xi,vi),e=[Kr.x,Kr.y,Kr.z],Cl(e,ws,Es,Ts,Yr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,En).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(En).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ei[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ei[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ei[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ei[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ei[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ei[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ei[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ei[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ei),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const ei=[new P,new P,new P,new P,new P,new P,new P,new P],En=new P,qr=new Vi,ws=new P,Es=new P,Ts=new P,xi=new P,vi=new P,Wi=new P,sr=new P,Yr=new P,Kr=new P,$i=new P;function Cl(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){$i.fromArray(s,r);const a=i.x*Math.abs($i.x)+i.y*Math.abs($i.y)+i.z*Math.abs($i.z),l=t.dot($i),c=e.dot($i),u=n.dot($i);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const Re=new P,Zr=new ft;let sm=0;class dn extends pi{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:sm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ph,this.updateRanges=[],this.gpuType=_n,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Zr.fromBufferAttribute(this,e),Zr.applyMatrix3(t),this.setXY(e,Zr.x,Zr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix3(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix4(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyNormalMatrix(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.transformDirection(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=gs(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ke(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=gs(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ke(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=gs(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ke(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=gs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ke(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=gs(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ke(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ke(e,this.array),n=Ke(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Ke(e,this.array),n=Ke(n,this.array),i=Ke(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Ke(e,this.array),n=Ke(n,this.array),i=Ke(i,this.array),r=Ke(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ph&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class Ih extends dn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Nh extends dn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class we extends dn{constructor(t,e,n){super(new Float32Array(t),e,n)}}const rm=new Vi,rr=new P,Rl=new P;class As{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):rm.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;rr.subVectors(t,this.center);const e=rr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(rr,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Rl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(rr.copy(t.center).add(Rl)),this.expandByPoint(rr.copy(t.center).sub(Rl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let om=0;const fn=new re,Pl=new Ce,Cs=new P,on=new Vi,or=new Vi,Oe=new P;class $e extends pi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:om++}),this.uuid=ms(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(wp(t)?Nh:Ih)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ht().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return fn.makeRotationFromQuaternion(t),this.applyMatrix4(fn),this}rotateX(t){return fn.makeRotationX(t),this.applyMatrix4(fn),this}rotateY(t){return fn.makeRotationY(t),this.applyMatrix4(fn),this}rotateZ(t){return fn.makeRotationZ(t),this.applyMatrix4(fn),this}translate(t,e,n){return fn.makeTranslation(t,e,n),this.applyMatrix4(fn),this}scale(t,e,n){return fn.makeScale(t,e,n),this.applyMatrix4(fn),this}lookAt(t){return Pl.lookAt(t),Pl.updateMatrix(),this.applyMatrix4(Pl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Cs).negate(),this.translate(Cs.x,Cs.y,Cs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new we(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&Ut("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){te("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];on.setFromBufferAttribute(r),this.morphTargetsRelative?(Oe.addVectors(this.boundingBox.min,on.min),this.boundingBox.expandByPoint(Oe),Oe.addVectors(this.boundingBox.max,on.max),this.boundingBox.expandByPoint(Oe)):(this.boundingBox.expandByPoint(on.min),this.boundingBox.expandByPoint(on.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&te('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new As);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){te("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){const n=this.boundingSphere.center;if(on.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];or.setFromBufferAttribute(a),this.morphTargetsRelative?(Oe.addVectors(on.min,or.min),on.expandByPoint(Oe),Oe.addVectors(on.max,or.max),on.expandByPoint(Oe)):(on.expandByPoint(or.min),on.expandByPoint(or.max))}on.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)Oe.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Oe));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Oe.fromBufferAttribute(a,c),l&&(Cs.fromBufferAttribute(t,c),Oe.add(Cs)),i=Math.max(i,n.distanceToSquared(Oe))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&te('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){te("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new dn(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));const a=[],l=[];for(let v=0;v<n.count;v++)a[v]=new P,l[v]=new P;const c=new P,u=new P,h=new P,d=new ft,f=new ft,p=new ft,x=new P,m=new P;function g(v,T,L){c.fromBufferAttribute(n,v),u.fromBufferAttribute(n,T),h.fromBufferAttribute(n,L),d.fromBufferAttribute(r,v),f.fromBufferAttribute(r,T),p.fromBufferAttribute(r,L),u.sub(c),h.sub(c),f.sub(d),p.sub(d);const D=1/(f.x*p.y-p.x*f.y);isFinite(D)&&(x.copy(u).multiplyScalar(p.y).addScaledVector(h,-f.y).multiplyScalar(D),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(D),a[v].add(x),a[T].add(x),a[L].add(x),l[v].add(m),l[T].add(m),l[L].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let v=0,T=S.length;v<T;++v){const L=S[v],D=L.start,U=L.count;for(let K=D,Z=D+U;K<Z;K+=3)g(t.getX(K+0),t.getX(K+1),t.getX(K+2))}const E=new P,M=new P,y=new P,w=new P;function C(v){y.fromBufferAttribute(i,v),w.copy(y);const T=a[v];E.copy(T),E.sub(y.multiplyScalar(y.dot(T))).normalize(),M.crossVectors(w,T);const D=M.dot(l[v])<0?-1:1;o.setXYZW(v,E.x,E.y,E.z,D)}for(let v=0,T=S.length;v<T;++v){const L=S[v],D=L.start,U=L.count;for(let K=D,Z=D+U;K<Z;K+=3)C(t.getX(K+0)),C(t.getX(K+1)),C(t.getX(K+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new dn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new P,r=new P,o=new P,a=new P,l=new P,c=new P,u=new P,h=new P;if(t)for(let d=0,f=t.count;d<f;d+=3){const p=t.getX(d+0),x=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,p),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,m),u.subVectors(o,r),h.subVectors(i,r),u.cross(h),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,r),h.subVectors(i,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Oe.fromBufferAttribute(t,e),Oe.normalize(),t.setXYZ(e,Oe.x,Oe.y,Oe.z)}toNonIndexed(){function t(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let f=0,p=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?f=l[x]*a.data.stride+a.offset:f=l[x]*u;for(let g=0;g<u;g++)d[p++]=c[f++]}return new dn(d,u,h)}if(this.index===null)return Ut("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new $e,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(t.data))}u.length>0&&(i[l]=u,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const i=t.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(e))}const r=t.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let am=0;class Rs extends pi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:am++}),this.uuid=ms(),this.name="",this.type="Material",this.blending=cs,this.side=di,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ra,this.blendDst=oa,this.blendEquation=ki,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Bt(0,0,0),this.blendAlpha=0,this.depthFunc=hs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ds,this.stencilZFail=ds,this.stencilZPass=ds,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Ut(`Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){Ut(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==cs&&(n.blending=this.blending),this.side!==di&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ra&&(n.blendSrc=this.blendSrc),this.blendDst!==oa&&(n.blendDst=this.blendDst),this.blendEquation!==ki&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==hs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==fh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ds&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ds&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ds&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Bt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ft().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ft().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const ni=new P,Ll=new P,Jr=new P,_i=new P,Dl=new P,jr=new P,Il=new P;class Qr{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ni)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ni.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ni.copy(this.origin).addScaledVector(this.direction,e),ni.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Ll.copy(t).add(e).multiplyScalar(.5),Jr.copy(e).sub(t).normalize(),_i.copy(this.origin).sub(Ll);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Jr),a=_i.dot(this.direction),l=-_i.dot(Jr),c=_i.lengthSq(),u=Math.abs(1-o*o);let h,d,f,p;if(u>0)if(h=o*l-a,d=o*a-l,p=r*u,h>=0)if(d>=-p)if(d<=p){const x=1/u;h*=x,d*=x,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-p?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=p?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy(Ll).addScaledVector(Jr,d),f}intersectSphere(t,e){ni.subVectors(t.center,this.origin);const n=ni.dot(this.direction),i=ni.dot(ni)-n*n,r=t.radius*t.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),u>=0?(r=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),h>=0?(a=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,ni)!==null}intersectTriangle(t,e,n,i,r){Dl.subVectors(e,t),jr.subVectors(n,t),Il.crossVectors(Dl,jr);let o=this.direction.dot(Il),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;_i.subVectors(this.origin,t);const l=a*this.direction.dot(jr.crossVectors(_i,jr));if(l<0)return null;const c=a*this.direction.dot(Dl.cross(_i));if(c<0||l+c>o)return null;const u=-a*_i.dot(Il);return u<0?null:this.at(u/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Tn extends Rs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.combine=rh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Uh=new re,Xi=new Qr,to=new As,Fh=new P,eo=new P,no=new P,io=new P,Nl=new P,so=new P,Oh=new P,ro=new P;class zt extends Ce{constructor(t=new $e,e=new Tn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(r&&a){so.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],h=r[l];u!==0&&(Nl.fromBufferAttribute(h,t),o?so.addScaledVector(Nl,u):so.addScaledVector(Nl.sub(e),u))}e.add(so)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),to.copy(n.boundingSphere),to.applyMatrix4(r),Xi.copy(t.ray).recast(t.near),!(to.containsPoint(Xi.origin)===!1&&(Xi.intersectSphere(to,Fh)===null||Xi.origin.distanceToSquared(Fh)>(t.far-t.near)**2))&&(Uh.copy(r).invert(),Xi.copy(t.ray).applyMatrix4(Uh),!(n.boundingBox!==null&&Xi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Xi)))}_computeIntersections(t,e,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,x=d.length;p<x;p++){const m=d[p],g=o[m.materialIndex],S=Math.max(m.start,f.start),E=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let M=S,y=E;M<y;M+=3){const w=a.getX(M),C=a.getX(M+1),v=a.getX(M+2);i=oo(this,g,t,n,c,u,h,w,C,v),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const p=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let m=p,g=x;m<g;m+=3){const S=a.getX(m),E=a.getX(m+1),M=a.getX(m+2);i=oo(this,o,t,n,c,u,h,S,E,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,x=d.length;p<x;p++){const m=d[p],g=o[m.materialIndex],S=Math.max(m.start,f.start),E=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let M=S,y=E;M<y;M+=3){const w=M,C=M+1,v=M+2;i=oo(this,g,t,n,c,u,h,w,C,v),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const p=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let m=p,g=x;m<g;m+=3){const S=m,E=m+1,M=m+2;i=oo(this,o,t,n,c,u,h,S,E,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function lm(s,t,e,n,i,r,o,a){let l;if(t.side===Ye?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===di,a),l===null)return null;ro.copy(a),ro.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(ro);return c<e.near||c>e.far?null:{distance:c,point:ro.clone(),object:s}}function oo(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,eo),s.getVertexPosition(l,no),s.getVertexPosition(c,io);const u=lm(s,t,e,n,eo,no,io,Oh);if(u){const h=new P;wn.getBarycoord(Oh,eo,no,io,h),i&&(u.uv=wn.getInterpolatedAttribute(i,a,l,c,h,new ft)),r&&(u.uv1=wn.getInterpolatedAttribute(r,a,l,c,h,new ft)),o&&(u.normal=wn.getInterpolatedAttribute(o,a,l,c,h,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new P,materialIndex:0};wn.getNormal(eo,no,io,d.normal),u.face=d,u.barycoord=h}return u}class kh extends Ve{constructor(t=null,e=1,n=1,i,r,o,a,l,c=ze,u=ze,h,d){super(null,o,a,l,c,u,i,r,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ar extends dn{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ps=new re,Bh=new re,ao=[],zh=new Vi,cm=new re,lr=new zt,cr=new As;class Hh extends zt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ar(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,cm)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Vi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ps),zh.copy(t.boundingBox).applyMatrix4(Ps),this.boundingBox.union(zh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new As),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ps),cr.copy(t.boundingSphere).applyMatrix4(Ps),this.boundingSphere.union(cr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){const n=this.matrixWorld,i=this.count;if(lr.geometry=this.geometry,lr.material=this.material,lr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),cr.copy(this.boundingSphere),cr.applyMatrix4(n),t.ray.intersectsSphere(cr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ps),Bh.multiplyMatrices(n,Ps),lr.matrixWorld=Bh,lr.raycast(t,ao);for(let o=0,a=ao.length;o<a;o++){const l=ao[o];l.instanceId=r,l.object=this,e.push(l)}ao.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new ar(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new kh(new Float32Array(i*this.count),i,this.count,Aa,_n));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=i*t;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ul=new P,hm=new P,um=new Ht;class Mi{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Ul.subVectors(n,e).cross(hm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const i=t.delta(Ul),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||um.getNormalMatrix(t),i=this.coplanarPoint(Ul).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const qi=new As,dm=new ft(.5,.5),lo=new P;class co{constructor(t=new Mi,e=new Mi,n=new Mi,i=new Mi,r=new Mi,o=new Mi){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Un,n=!1){const i=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],f=r[7],p=r[8],x=r[9],m=r[10],g=r[11],S=r[12],E=r[13],M=r[14],y=r[15];if(i[0].setComponents(c-o,f-u,g-p,y-S).normalize(),i[1].setComponents(c+o,f+u,g+p,y+S).normalize(),i[2].setComponents(c+a,f+h,g+x,y+E).normalize(),i[3].setComponents(c-a,f-h,g-x,y-E).normalize(),n)i[4].setComponents(l,d,m,M).normalize(),i[5].setComponents(c-l,f-d,g-m,y-M).normalize();else if(i[4].setComponents(c-l,f-d,g-m,y-M).normalize(),e===Un)i[5].setComponents(c+l,f+d,g+m,y+M).normalize();else if(e===tr)i[5].setComponents(l,d,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),qi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),qi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(qi)}intersectsSprite(t){qi.center.set(0,0,0);const e=dm.distanceTo(t.center);return qi.radius=.7071067811865476+e,qi.applyMatrix4(t.matrixWorld),this.intersectsSphere(qi)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(lo.x=i.normal.x>0?t.max.x:t.min.x,lo.y=i.normal.y>0?t.max.y:t.min.y,lo.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(lo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Gh extends Rs{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Bt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const ho=new P,uo=new P,Vh=new re,hr=new Qr,fo=new As,Fl=new P,Wh=new P;class $h extends Ce{constructor(t=new $e,e=new Gh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)ho.fromBufferAttribute(e,i-1),uo.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=ho.distanceTo(uo);t.setAttribute("lineDistance",new we(n,1))}else Ut("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),fo.copy(n.boundingSphere),fo.applyMatrix4(i),fo.radius+=r,t.ray.intersectsSphere(fo)===!1)return;Vh.copy(i).invert(),hr.copy(t.ray).applyMatrix4(Vh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const f=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let x=f,m=p-1;x<m;x+=c){const g=u.getX(x),S=u.getX(x+1),E=po(this,t,hr,l,g,S,x);E&&e.push(E)}if(this.isLineLoop){const x=u.getX(p-1),m=u.getX(f),g=po(this,t,hr,l,x,m,p-1);g&&e.push(g)}}else{const f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let x=f,m=p-1;x<m;x+=c){const g=po(this,t,hr,l,x,x+1,x);g&&e.push(g)}if(this.isLineLoop){const x=po(this,t,hr,l,p-1,f,p-1);x&&e.push(x)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function po(s,t,e,n,i,r,o){const a=s.geometry.attributes.position;if(ho.fromBufferAttribute(a,i),uo.fromBufferAttribute(a,r),e.distanceSqToSegment(ho,uo,Fl,Wh)>n)return;Fl.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Fl);if(!(c<t.near||c>t.far))return{distance:c,point:Wh.clone().applyMatrix4(s.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:s}}class Xh extends Ve{constructor(t=[],e=Bi,n,i,r,o,a,l,c,u){super(t,e,n,i,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class yi extends Ve{constructor(t,e,n,i,r,o,a,l,c){super(t,e,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ls extends Ve{constructor(t,e,n=Nn,i,r,o,a=ze,l=ze,c,u=Kn,h=1){if(u!==Kn&&u!==Hi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:h};super(d,i,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new fl(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class fm extends Ls{constructor(t,e=Nn,n=Bi,i,r,o=ze,a=ze,l,c=Kn){const u={width:t,height:t,depth:1},h=[u,u,u,u,u,u];super(t,t,e,n,i,r,o,a,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class qh extends Ve{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class an extends $e{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,f=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,i,o,2),p("x","z","y",1,-1,t,n,-e,i,o,3),p("x","y","z",1,-1,t,e,n,i,r,4),p("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new we(c,3)),this.setAttribute("normal",new we(u,3)),this.setAttribute("uv",new we(h,2));function p(x,m,g,S,E,M,y,w,C,v,T){const L=M/C,D=y/v,U=M/2,K=y/2,Z=w/2,N=C+1,W=v+1;let B=0,X=0;const nt=new P;for(let ot=0;ot<W;ot++){const at=ot*D-K;for(let xt=0;xt<N;xt++){const Gt=xt*L-U;nt[x]=Gt*S,nt[m]=at*E,nt[g]=Z,c.push(nt.x,nt.y,nt.z),nt[x]=0,nt[m]=0,nt[g]=w>0?1:-1,u.push(nt.x,nt.y,nt.z),h.push(xt/C),h.push(1-ot/v),B+=1}}for(let ot=0;ot<v;ot++)for(let at=0;at<C;at++){const xt=d+at+N*ot,Gt=d+at+N*(ot+1),xe=d+(at+1)+N*(ot+1),ee=d+(at+1)+N*ot;l.push(xt,Gt,ee),l.push(Gt,xe,ee),X+=6}a.addGroup(f,X,T),f+=X,d+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new an(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class bi extends $e{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const u=[],h=[],d=[],f=[];let p=0;const x=[],m=n/2;let g=0;S(),o===!1&&(t>0&&E(!0),e>0&&E(!1)),this.setIndex(u),this.setAttribute("position",new we(h,3)),this.setAttribute("normal",new we(d,3)),this.setAttribute("uv",new we(f,2));function S(){const M=new P,y=new P;let w=0;const C=(e-t)/n;for(let v=0;v<=r;v++){const T=[],L=v/r,D=L*(e-t)+t;for(let U=0;U<=i;U++){const K=U/i,Z=K*l+a,N=Math.sin(Z),W=Math.cos(Z);y.x=D*N,y.y=-L*n+m,y.z=D*W,h.push(y.x,y.y,y.z),M.set(N,C,W).normalize(),d.push(M.x,M.y,M.z),f.push(K,1-L),T.push(p++)}x.push(T)}for(let v=0;v<i;v++)for(let T=0;T<r;T++){const L=x[T][v],D=x[T+1][v],U=x[T+1][v+1],K=x[T][v+1];(t>0||T!==0)&&(u.push(L,D,K),w+=3),(e>0||T!==r-1)&&(u.push(D,U,K),w+=3)}c.addGroup(g,w,0),g+=w}function E(M){const y=p,w=new ft,C=new P;let v=0;const T=M===!0?t:e,L=M===!0?1:-1;for(let U=1;U<=i;U++)h.push(0,m*L,0),d.push(0,L,0),f.push(.5,.5),p++;const D=p;for(let U=0;U<=i;U++){const Z=U/i*l+a,N=Math.cos(Z),W=Math.sin(Z);C.x=T*W,C.y=m*L,C.z=T*N,h.push(C.x,C.y,C.z),d.push(0,L,0),w.x=N*.5+.5,w.y=W*.5*L+.5,f.push(w.x,w.y),p++}for(let U=0;U<i;U++){const K=y+U,Z=D+U;M===!0?u.push(Z,Z+1,K):u.push(Z+1,Z,K),v+=3}c.addGroup(g,v,M===!0?1:2),g+=v}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bi(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ii{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ut("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let i=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);const u=n[i],d=n[i+1]-u,f=(o-u)/d;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const o=this.getPoint(i),a=this.getPoint(r),l=e||(o.isVector2?new ft:new P);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new P,i=[],r=[],o=[],a=new P,l=new re;for(let f=0;f<=t;f++){const p=f/t;i[f]=this.getTangentAt(p,new P)}r[0]=new P,o[0]=new P;let c=Number.MAX_VALUE;const u=Math.abs(i[0].x),h=Math.abs(i[0].y),d=Math.abs(i[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();const p=Math.acos(qt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(qt(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(i[p],f*p)),o[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Yh extends ii{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new ft){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class pm extends Yh{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Ol(){let s=0,t=0,e=0,n=0;function i(r,o,a,l){s=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){i(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,u,h){let d=(o-r)/c-(a-r)/(c+u)+(a-o)/u,f=(a-o)/u-(l-o)/(u+h)+(l-a)/h;d*=u,f*=u,i(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return s+t*r+e*o+n*a}}}const Kh=new P,Zh=new P,kl=new Ol,Bl=new Ol,zl=new Ol;class Jh extends ii{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new P){const n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,u;this.closed||a>0?c=i[(a-1)%r]:(Zh.subVectors(i[0],i[1]).add(i[0]),c=Zh);const h=i[a%r],d=i[(a+1)%r];if(this.closed||a+2<r?u=i[(a+2)%r]:(Kh.subVectors(i[r-1],i[r-2]).add(i[r-1]),u=Kh),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(h),f),x=Math.pow(h.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f);x<1e-4&&(x=1),p<1e-4&&(p=x),m<1e-4&&(m=x),kl.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,p,x,m),Bl.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,p,x,m),zl.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,p,x,m)}else this.curveType==="catmullrom"&&(kl.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),Bl.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),zl.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(kl.calc(l),Bl.calc(l),zl.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new P().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function jh(s,t,e,n,i){const r=(n-t)*.5,o=(i-e)*.5,a=s*s,l=s*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*s+e}function mm(s,t){const e=1-s;return e*e*t}function gm(s,t){return 2*(1-s)*s*t}function xm(s,t){return s*s*t}function ur(s,t,e,n){return mm(s,t)+gm(s,e)+xm(s,n)}function vm(s,t){const e=1-s;return e*e*e*t}function _m(s,t){const e=1-s;return 3*e*e*s*t}function Mm(s,t){return 3*(1-s)*s*s*t}function ym(s,t){return s*s*s*t}function dr(s,t,e,n,i){return vm(s,t)+_m(s,e)+Mm(s,n)+ym(s,i)}class bm extends ii{constructor(t=new ft,e=new ft,n=new ft,i=new ft){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new ft){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(dr(t,i.x,r.x,o.x,a.x),dr(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Sm extends ii{constructor(t=new P,e=new P,n=new P,i=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new P){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(dr(t,i.x,r.x,o.x,a.x),dr(t,i.y,r.y,o.y,a.y),dr(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class wm extends ii{constructor(t=new ft,e=new ft){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ft){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ft){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Em extends ii{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Tm extends ii{constructor(t=new ft,e=new ft,n=new ft){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ft){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(ur(t,i.x,r.x,o.x),ur(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Qh extends ii{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(ur(t,i.x,r.x,o.x),ur(t,i.y,r.y,o.y),ur(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Am extends ii{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ft){const n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,l=i[o===0?o:o-1],c=i[o],u=i[o>i.length-2?i.length-1:o+1],h=i[o>i.length-3?i.length-1:o+2];return n.set(jh(a,l.x,c.x,u.x,h.x),jh(a,l.y,c.y,u.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new ft().fromArray(i))}return this}}var Cm=Object.freeze({__proto__:null,ArcCurve:pm,CatmullRomCurve3:Jh,CubicBezierCurve:bm,CubicBezierCurve3:Sm,EllipseCurve:Yh,LineCurve:wm,LineCurve3:Em,QuadraticBezierCurve:Tm,QuadraticBezierCurve3:Qh,SplineCurve:Am});class Ze extends $e{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,u=l+1,h=t/a,d=e/l,f=[],p=[],x=[],m=[];for(let g=0;g<u;g++){const S=g*d-o;for(let E=0;E<c;E++){const M=E*h-r;p.push(M,-S,0),x.push(0,0,1),m.push(E/a),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let S=0;S<a;S++){const E=S+c*g,M=S+c*(g+1),y=S+1+c*(g+1),w=S+1+c*g;f.push(E,M,w),f.push(M,y,w)}this.setIndex(f),this.setAttribute("position",new we(p,3)),this.setAttribute("normal",new we(x,3)),this.setAttribute("uv",new we(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ze(t.width,t.height,t.widthSegments,t.heightSegments)}}class fr extends $e{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new P,d=new P,f=[],p=[],x=[],m=[];for(let g=0;g<=n;g++){const S=[],E=g/n,M=o+E*a,y=t*Math.cos(M),w=Math.sqrt(t*t-y*y);let C=0;g===0&&o===0?C=.5/e:g===n&&l===Math.PI&&(C=-.5/e);for(let v=0;v<=e;v++){const T=v/e,L=i+T*r;h.x=-w*Math.cos(L),h.y=y,h.z=w*Math.sin(L),p.push(h.x,h.y,h.z),d.copy(h).normalize(),x.push(d.x,d.y,d.z),m.push(T+C,1-E),S.push(c++)}u.push(S)}for(let g=0;g<n;g++)for(let S=0;S<e;S++){const E=u[g][S+1],M=u[g][S],y=u[g+1][S],w=u[g+1][S+1];(g!==0||o>0)&&f.push(E,M,w),(g!==n-1||l<Math.PI)&&f.push(M,y,w)}this.setIndex(f),this.setAttribute("position",new we(p,3)),this.setAttribute("normal",new we(x,3)),this.setAttribute("uv",new we(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Hl extends $e{constructor(t=new Qh(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),e=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:i,closed:r};const o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new P,l=new P,c=new ft;let u=new P;const h=[],d=[],f=[],p=[];x(),this.setIndex(p),this.setAttribute("position",new we(h,3)),this.setAttribute("normal",new we(d,3)),this.setAttribute("uv",new we(f,2));function x(){for(let E=0;E<e;E++)m(E);m(r===!1?e:0),S(),g()}function m(E){u=t.getPointAt(E/e,u);const M=o.normals[E],y=o.binormals[E];for(let w=0;w<=i;w++){const C=w/i*Math.PI*2,v=Math.sin(C),T=-Math.cos(C);l.x=T*M.x+v*y.x,l.y=T*M.y+v*y.y,l.z=T*M.z+v*y.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=u.x+n*l.x,a.y=u.y+n*l.y,a.z=u.z+n*l.z,h.push(a.x,a.y,a.z)}}function g(){for(let E=1;E<=e;E++)for(let M=1;M<=i;M++){const y=(i+1)*(E-1)+(M-1),w=(i+1)*E+(M-1),C=(i+1)*E+M,v=(i+1)*(E-1)+M;p.push(y,w,v),p.push(w,C,v)}}function S(){for(let E=0;E<=e;E++)for(let M=0;M<=i;M++)c.x=E/e,c.y=M/i,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Hl(new Cm[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}function Ds(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];if(tu(i))i.isRenderTargetTexture?(Ut("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(tu(i[0])){const r=[];for(let o=0,a=i.length;o<a;o++)r[o]=i[o].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function Je(s){const t={};for(let e=0;e<s.length;e++){const n=Ds(s[e]);for(const i in n)t[i]=n[i]}return t}function tu(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Rm(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function eu(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Jt.workingColorSpace}const pr={clone:Ds,merge:Je};var Pm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Lm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ie extends Rs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Pm,this.fragmentShader=Lm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ds(t.uniforms),this.uniformsGroups=Rm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new Bt().setHex(i.value);break;case"v2":this.uniforms[n].value=new ft().fromArray(i.value);break;case"v3":this.uniforms[n].value=new P().fromArray(i.value);break;case"v4":this.uniforms[n].value=new ve().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Ht().fromArray(i.value);break;case"m4":this.uniforms[n].value=new re().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class nu extends Ie{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Pe extends Rs{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=al,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Dm extends Rs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=gp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Im extends Rs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class mo extends Ce{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Bt(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class Nm extends mo{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const Gl=new re,iu=new P,su=new P;class Vl{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.mapType=nn,this.map=null,this.mapPass=null,this.matrix=new re,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new co,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new ve(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;iu.setFromMatrixPosition(t.matrixWorld),e.position.copy(iu),su.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(su),e.updateMatrixWorld(),Gl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Gl,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===tr||e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Gl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const go=new P,xo=new Fn,On=new P;class ru extends Ce{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new re,this.projectionMatrix=new re,this.projectionMatrixInverse=new re,this.coordinateSystem=Un,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(go,xo,On),On.x===1&&On.y===1&&On.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(go,xo,On.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(go,xo,On),On.x===1&&On.y===1&&On.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(go,xo,On.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Si=new P,ou=new ft,au=new ft;class Qe extends ru{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ps*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(er*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ps*2*Math.atan(Math.tan(er*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Si.x,Si.y).multiplyScalar(-t/Si.z),Si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Si.x,Si.y).multiplyScalar(-t/Si.z)}getViewSize(t,e){return this.getViewBounds(t,ou,au),e.subVectors(au,ou)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(er*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class Um extends Vl{constructor(){super(new Qe(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=ps*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||i!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=i,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class Fm extends mo{constructor(t,e,n=0,i=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.target=new Ce,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Um}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}}class Om extends Vl{constructor(){super(new Qe(90,1,.5,500)),this.isPointLightShadow=!0}}class Wl extends mo{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Om}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class vo extends ru{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class km extends Vl{constructor(){super(new vo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Bm extends mo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.target=new Ce,this.shadow=new km}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}const Is=-90,Ns=1;class zm extends Ce{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Qe(Is,Ns,t,e);i.layers=this.layers,this.add(i);const r=new Qe(Is,Ns,t,e);r.layers=this.layers,this.add(r);const o=new Qe(Is,Ns,t,e);o.layers=this.layers,this.add(o);const a=new Qe(Is,Ns,t,e);a.layers=this.layers,this.add(a);const l=new Qe(Is,Ns,t,e);l.layers=this.layers,this.add(l);const c=new Qe(Is,Ns,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Un)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===tr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,u),t.setRenderTarget(h,d,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class Hm extends Qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Gm{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=Vm.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function Vm(){this._document.hidden===!1&&this.reset()}const lu=new re;class Wm{constructor(t,e,n=0,i=1/0){this.ray=new Qr(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new gl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):te("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return lu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(lu),this}intersectObject(t,e=!0,n=[]){return $l(t,this,n,e),n.sort(cu),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)$l(t[i],this,n,e);return n.sort(cu),n}}function cu(s,t){return s.distance-t.distance}function $l(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let o=0,a=r.length;o<a;o++)$l(r[o],t,e,!0)}}class $m{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Ut("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}class Xl{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=qt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(qt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Tc=class Tc{constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){const r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=i,this}};Tc.prototype.isMatrix2=!0;let hu=Tc;class Xm extends pi{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){Ut("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function uu(s,t,e,n){const i=qm(n);switch(e){case uh:return s*t;case Aa:return s*t/i.components*i.byteLength;case Ca:return s*t/i.components*i.byteLength;case Gi:return s*t*2/i.components*i.byteLength;case Ra:return s*t*2/i.components*i.byteLength;case dh:return s*t*3/i.components*i.byteLength;case Mn:return s*t*4/i.components*i.byteLength;case Pa:return s*t*4/i.components*i.byteLength;case Ur:case Fr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Or:case kr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Da:case Na:return Math.max(s,16)*Math.max(t,8)/4;case La:case Ia:return Math.max(s,8)*Math.max(t,8)/2;case Ua:case Fa:case ka:case Ba:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Oa:case Br:case za:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ha:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ga:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Va:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Wa:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case $a:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Xa:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case qa:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case Ya:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Ka:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Za:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Ja:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case ja:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Qa:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case tl:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case el:case nl:case il:return Math.ceil(s/4)*Math.ceil(t/4)*16;case sl:case rl:return Math.ceil(s/4)*Math.ceil(t/4)*8;case zr:case ol:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function qm(s){switch(s){case nn:case ah:return{byteLength:1,components:1};case Js:case lh:case sn:return{byteLength:2,components:1};case Ea:case Ta:return{byteLength:2,components:4};case Nn:case wa:case _n:return{byteLength:4,components:1};case ch:case hh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:sa}})),typeof window<"u"&&(window.__THREE__?Ut("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=sa);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function du(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Ym(s){const t=new WeakMap;function e(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){const u=l.array,h=l.updateRanges;if(s.bindBuffer(c,a),h.length===0)s.bufferSubData(c,0,u);else{h.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<h.length;f++){const p=h[d],x=h[f];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++d,h[d]=x)}h.length=d+1;for(let f=0,p=h.length;f<p;f++){const x=h[f];s.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(s.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var Km=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Zm=`#ifdef USE_ALPHAHASH
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
#endif`,Jm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,jm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,t0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,e0=`#ifdef USE_AOMAP
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
#endif`,n0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,i0=`#ifdef USE_BATCHING
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
#endif`,s0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,r0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,o0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,a0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,l0=`#ifdef USE_IRIDESCENCE
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
#endif`,c0=`#ifdef USE_BUMPMAP
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
#endif`,h0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,u0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,d0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,f0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,p0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,m0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,g0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,x0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,v0=`#define PI 3.141592653589793
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
} // validated`,_0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,M0=`vec3 transformedNormal = objectNormal;
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
#endif`,y0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,b0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,S0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,w0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,E0="gl_FragColor = linearToOutputTexel( gl_FragColor );",T0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,A0=`#ifdef USE_ENVMAP
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
#endif`,C0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,R0=`#ifdef USE_ENVMAP
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
#endif`,P0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,L0=`#ifdef USE_ENVMAP
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
#endif`,D0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,I0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,N0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,U0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,F0=`#ifdef USE_GRADIENTMAP
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
}`,O0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,k0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,B0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,z0=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,H0=`#ifdef USE_ENVMAP
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
#endif`,G0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,V0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,W0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,$0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,X0=`PhysicalMaterial material;
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
#endif`,q0=`uniform sampler2D dfgLUT;
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
}`,Y0=`
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
#endif`,K0=`#if defined( RE_IndirectDiffuse )
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
#endif`,Z0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,J0=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,j0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Q0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,eg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ng=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ig=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,sg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,rg=`#if defined( USE_POINTS_UV )
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
#endif`,og=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ag=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,lg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,cg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,hg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ug=`#ifdef USE_MORPHTARGETS
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
#endif`,dg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,pg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,mg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,vg=`#ifdef USE_NORMALMAP
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
#endif`,_g=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Mg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,yg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,bg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Sg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,wg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Eg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Tg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ag=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Cg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Rg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Pg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Lg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Dg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ig=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Ng=`float getShadowMask() {
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
}`,Ug=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Fg=`#ifdef USE_SKINNING
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
#endif`,Og=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,kg=`#ifdef USE_SKINNING
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
#endif`,Bg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,zg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Hg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Gg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Vg=`#ifdef USE_TRANSMISSION
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
#endif`,Wg=`#ifdef USE_TRANSMISSION
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
#endif`,$g=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Xg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,qg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Yg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Yt={alphahash_fragment:Km,alphahash_pars_fragment:Zm,alphamap_fragment:Jm,alphamap_pars_fragment:jm,alphatest_fragment:Qm,alphatest_pars_fragment:t0,aomap_fragment:e0,aomap_pars_fragment:n0,batching_pars_vertex:i0,batching_vertex:s0,begin_vertex:r0,beginnormal_vertex:o0,bsdfs:a0,iridescence_fragment:l0,bumpmap_pars_fragment:c0,clipping_planes_fragment:h0,clipping_planes_pars_fragment:u0,clipping_planes_pars_vertex:d0,clipping_planes_vertex:f0,color_fragment:p0,color_pars_fragment:m0,color_pars_vertex:g0,color_vertex:x0,common:v0,cube_uv_reflection_fragment:_0,defaultnormal_vertex:M0,displacementmap_pars_vertex:y0,displacementmap_vertex:b0,emissivemap_fragment:S0,emissivemap_pars_fragment:w0,colorspace_fragment:E0,colorspace_pars_fragment:T0,envmap_fragment:A0,envmap_common_pars_fragment:C0,envmap_pars_fragment:R0,envmap_pars_vertex:P0,envmap_physical_pars_fragment:H0,envmap_vertex:L0,fog_vertex:D0,fog_pars_vertex:I0,fog_fragment:N0,fog_pars_fragment:U0,gradientmap_pars_fragment:F0,lightmap_pars_fragment:O0,lights_lambert_fragment:k0,lights_lambert_pars_fragment:B0,lights_pars_begin:z0,lights_toon_fragment:G0,lights_toon_pars_fragment:V0,lights_phong_fragment:W0,lights_phong_pars_fragment:$0,lights_physical_fragment:X0,lights_physical_pars_fragment:q0,lights_fragment_begin:Y0,lights_fragment_maps:K0,lights_fragment_end:Z0,lightprobes_pars_fragment:J0,logdepthbuf_fragment:j0,logdepthbuf_pars_fragment:Q0,logdepthbuf_pars_vertex:tg,logdepthbuf_vertex:eg,map_fragment:ng,map_pars_fragment:ig,map_particle_fragment:sg,map_particle_pars_fragment:rg,metalnessmap_fragment:og,metalnessmap_pars_fragment:ag,morphinstance_vertex:lg,morphcolor_vertex:cg,morphnormal_vertex:hg,morphtarget_pars_vertex:ug,morphtarget_vertex:dg,normal_fragment_begin:fg,normal_fragment_maps:pg,normal_pars_fragment:mg,normal_pars_vertex:gg,normal_vertex:xg,normalmap_pars_fragment:vg,clearcoat_normal_fragment_begin:_g,clearcoat_normal_fragment_maps:Mg,clearcoat_pars_fragment:yg,iridescence_pars_fragment:bg,opaque_fragment:Sg,packing:wg,premultiplied_alpha_fragment:Eg,project_vertex:Tg,dithering_fragment:Ag,dithering_pars_fragment:Cg,roughnessmap_fragment:Rg,roughnessmap_pars_fragment:Pg,shadowmap_pars_fragment:Lg,shadowmap_pars_vertex:Dg,shadowmap_vertex:Ig,shadowmask_pars_fragment:Ng,skinbase_vertex:Ug,skinning_pars_vertex:Fg,skinning_vertex:Og,skinnormal_vertex:kg,specularmap_fragment:Bg,specularmap_pars_fragment:zg,tonemapping_fragment:Hg,tonemapping_pars_fragment:Gg,transmission_fragment:Vg,transmission_pars_fragment:Wg,uv_pars_fragment:$g,uv_pars_vertex:Xg,uv_vertex:qg,worldpos_vertex:Yg,background_vert:`varying vec2 vUv;
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
}`},vt={common:{diffuse:{value:new Bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ht}},envmap:{envMap:{value:null},envMapRotation:{value:new Ht},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ht}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ht}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ht},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ht},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ht},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ht}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ht}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ht}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new P},probesMax:{value:new P},probesResolution:{value:new P}},points:{diffuse:{value:new Bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0},uvTransform:{value:new Ht}},sprite:{diffuse:{value:new Bt(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}}},kn={basic:{uniforms:Je([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.fog]),vertexShader:Yt.meshbasic_vert,fragmentShader:Yt.meshbasic_frag},lambert:{uniforms:Je([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new Bt(0)},envMapIntensity:{value:1}}]),vertexShader:Yt.meshlambert_vert,fragmentShader:Yt.meshlambert_frag},phong:{uniforms:Je([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new Bt(0)},specular:{value:new Bt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphong_vert,fragmentShader:Yt.meshphong_frag},standard:{uniforms:Je([vt.common,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.roughnessmap,vt.metalnessmap,vt.fog,vt.lights,{emissive:{value:new Bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag},toon:{uniforms:Je([vt.common,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.gradientmap,vt.fog,vt.lights,{emissive:{value:new Bt(0)}}]),vertexShader:Yt.meshtoon_vert,fragmentShader:Yt.meshtoon_frag},matcap:{uniforms:Je([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,{matcap:{value:null}}]),vertexShader:Yt.meshmatcap_vert,fragmentShader:Yt.meshmatcap_frag},points:{uniforms:Je([vt.points,vt.fog]),vertexShader:Yt.points_vert,fragmentShader:Yt.points_frag},dashed:{uniforms:Je([vt.common,vt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Yt.linedashed_vert,fragmentShader:Yt.linedashed_frag},depth:{uniforms:Je([vt.common,vt.displacementmap]),vertexShader:Yt.depth_vert,fragmentShader:Yt.depth_frag},normal:{uniforms:Je([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,{opacity:{value:1}}]),vertexShader:Yt.meshnormal_vert,fragmentShader:Yt.meshnormal_frag},sprite:{uniforms:Je([vt.sprite,vt.fog]),vertexShader:Yt.sprite_vert,fragmentShader:Yt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ht},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Yt.background_vert,fragmentShader:Yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ht}},vertexShader:Yt.backgroundCube_vert,fragmentShader:Yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Yt.cube_vert,fragmentShader:Yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Yt.equirect_vert,fragmentShader:Yt.equirect_frag},distance:{uniforms:Je([vt.common,vt.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Yt.distance_vert,fragmentShader:Yt.distance_frag},shadow:{uniforms:Je([vt.lights,vt.fog,{color:{value:new Bt(0)},opacity:{value:1}}]),vertexShader:Yt.shadow_vert,fragmentShader:Yt.shadow_frag}};kn.physical={uniforms:Je([kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ht},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ht},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ht},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ht},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ht},sheen:{value:0},sheenColor:{value:new Bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ht},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ht},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ht},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ht},attenuationDistance:{value:0},attenuationColor:{value:new Bt(0)},specularColor:{value:new Bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ht},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ht},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ht}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag};const _o={r:0,b:0,g:0},Kg=new re,fu=new Ht;fu.set(-1,0,0,0,1,0,0,0,1);function Zg(s,t,e,n,i,r){const o=new Bt(0);let a=i===!0?0:1,l,c,u=null,h=0,d=null;function f(S){let E=S.isScene===!0?S.background:null;if(E&&E.isTexture){const M=S.backgroundBlurriness>0;E=t.get(E,M)}return E}function p(S){let E=!1;const M=f(S);M===null?m(o,a):M&&M.isColor&&(m(M,1),E=!0);const y=s.xr.getEnvironmentBlendMode();y==="additive"?e.buffers.color.setClear(0,0,0,1,r):y==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||E)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function x(S,E){const M=f(E);M&&(M.isCubeTexture||M.mapping===Dr)?(c===void 0&&(c=new zt(new an(1,1,1),new Ie({name:"BackgroundCubeMaterial",uniforms:Ds(kn.backgroundCube.uniforms),vertexShader:kn.backgroundCube.vertexShader,fragmentShader:kn.backgroundCube.fragmentShader,side:Ye,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(y,w,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Kg.makeRotationFromEuler(E.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(fu),c.material.toneMapped=Jt.getTransfer(M.colorSpace)!==se,(u!==M||h!==M.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,u=M,h=M.version,d=s.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new zt(new Ze(2,2),new Ie({name:"BackgroundMaterial",uniforms:Ds(kn.background.uniforms),vertexShader:kn.background.vertexShader,fragmentShader:kn.background.fragmentShader,side:di,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=Jt.getTransfer(M.colorSpace)!==se,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||h!==M.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,u=M,h=M.version,d=s.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function m(S,E){S.getRGB(_o,eu(s)),e.buffers.color.setClear(_o.r,_o.g,_o.b,E,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,E=1){o.set(S),a=E,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,m(o,a)},render:p,addToRenderList:x,dispose:g}}function Jg(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,o=!1;function a(D,U,K,Z,N){let W=!1;const B=h(D,Z,K,U);r!==B&&(r=B,c(r.object)),W=f(D,Z,K,N),W&&p(D,Z,K,N),N!==null&&t.update(N,s.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,M(D,U,K,Z),N!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function l(){return s.createVertexArray()}function c(D){return s.bindVertexArray(D)}function u(D){return s.deleteVertexArray(D)}function h(D,U,K,Z){const N=Z.wireframe===!0;let W=n[U.id];W===void 0&&(W={},n[U.id]=W);const B=D.isInstancedMesh===!0?D.id:0;let X=W[B];X===void 0&&(X={},W[B]=X);let nt=X[K.id];nt===void 0&&(nt={},X[K.id]=nt);let ot=nt[N];return ot===void 0&&(ot=d(l()),nt[N]=ot),ot}function d(D){const U=[],K=[],Z=[];for(let N=0;N<e;N++)U[N]=0,K[N]=0,Z[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:K,attributeDivisors:Z,object:D,attributes:{},index:null}}function f(D,U,K,Z){const N=r.attributes,W=U.attributes;let B=0;const X=K.getAttributes();for(const nt in X)if(X[nt].location>=0){const at=N[nt];let xt=W[nt];if(xt===void 0&&(nt==="instanceMatrix"&&D.instanceMatrix&&(xt=D.instanceMatrix),nt==="instanceColor"&&D.instanceColor&&(xt=D.instanceColor)),at===void 0||at.attribute!==xt||xt&&at.data!==xt.data)return!0;B++}return r.attributesNum!==B||r.index!==Z}function p(D,U,K,Z){const N={},W=U.attributes;let B=0;const X=K.getAttributes();for(const nt in X)if(X[nt].location>=0){let at=W[nt];at===void 0&&(nt==="instanceMatrix"&&D.instanceMatrix&&(at=D.instanceMatrix),nt==="instanceColor"&&D.instanceColor&&(at=D.instanceColor));const xt={};xt.attribute=at,at&&at.data&&(xt.data=at.data),N[nt]=xt,B++}r.attributes=N,r.attributesNum=B,r.index=Z}function x(){const D=r.newAttributes;for(let U=0,K=D.length;U<K;U++)D[U]=0}function m(D){g(D,0)}function g(D,U){const K=r.newAttributes,Z=r.enabledAttributes,N=r.attributeDivisors;K[D]=1,Z[D]===0&&(s.enableVertexAttribArray(D),Z[D]=1),N[D]!==U&&(s.vertexAttribDivisor(D,U),N[D]=U)}function S(){const D=r.newAttributes,U=r.enabledAttributes;for(let K=0,Z=U.length;K<Z;K++)U[K]!==D[K]&&(s.disableVertexAttribArray(K),U[K]=0)}function E(D,U,K,Z,N,W,B){B===!0?s.vertexAttribIPointer(D,U,K,N,W):s.vertexAttribPointer(D,U,K,Z,N,W)}function M(D,U,K,Z){x();const N=Z.attributes,W=K.getAttributes(),B=U.defaultAttributeValues;for(const X in W){const nt=W[X];if(nt.location>=0){let ot=N[X];if(ot===void 0&&(X==="instanceMatrix"&&D.instanceMatrix&&(ot=D.instanceMatrix),X==="instanceColor"&&D.instanceColor&&(ot=D.instanceColor)),ot!==void 0){const at=ot.normalized,xt=ot.itemSize,Gt=t.get(ot);if(Gt===void 0)continue;const xe=Gt.buffer,ee=Gt.type,Q=Gt.bytesPerElement,I=ee===s.INT||ee===s.UNSIGNED_INT||ot.gpuType===wa;if(ot.isInterleavedBufferAttribute){const q=ot.data,st=q.stride,ut=ot.offset;if(q.isInstancedInterleavedBuffer){for(let lt=0;lt<nt.locationSize;lt++)g(nt.location+lt,q.meshPerAttribute);D.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let lt=0;lt<nt.locationSize;lt++)m(nt.location+lt);s.bindBuffer(s.ARRAY_BUFFER,xe);for(let lt=0;lt<nt.locationSize;lt++)E(nt.location+lt,xt/nt.locationSize,ee,at,st*Q,(ut+xt/nt.locationSize*lt)*Q,I)}else{if(ot.isInstancedBufferAttribute){for(let q=0;q<nt.locationSize;q++)g(nt.location+q,ot.meshPerAttribute);D.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let q=0;q<nt.locationSize;q++)m(nt.location+q);s.bindBuffer(s.ARRAY_BUFFER,xe);for(let q=0;q<nt.locationSize;q++)E(nt.location+q,xt/nt.locationSize,ee,at,xt*Q,xt/nt.locationSize*q*Q,I)}}else if(B!==void 0){const at=B[X];if(at!==void 0)switch(at.length){case 2:s.vertexAttrib2fv(nt.location,at);break;case 3:s.vertexAttrib3fv(nt.location,at);break;case 4:s.vertexAttrib4fv(nt.location,at);break;default:s.vertexAttrib1fv(nt.location,at)}}}}S()}function y(){T();for(const D in n){const U=n[D];for(const K in U){const Z=U[K];for(const N in Z){const W=Z[N];for(const B in W)u(W[B].object),delete W[B];delete Z[N]}}delete n[D]}}function w(D){if(n[D.id]===void 0)return;const U=n[D.id];for(const K in U){const Z=U[K];for(const N in Z){const W=Z[N];for(const B in W)u(W[B].object),delete W[B];delete Z[N]}}delete n[D.id]}function C(D){for(const U in n){const K=n[U];for(const Z in K){const N=K[Z];if(N[D.id]===void 0)continue;const W=N[D.id];for(const B in W)u(W[B].object),delete W[B];delete N[D.id]}}}function v(D){for(const U in n){const K=n[U],Z=D.isInstancedMesh===!0?D.id:0,N=K[Z];if(N!==void 0){for(const W in N){const B=N[W];for(const X in B)u(B[X].object),delete B[X];delete N[W]}delete K[Z],Object.keys(K).length===0&&delete n[U]}}}function T(){L(),o=!0,r!==i&&(r=i,c(r.object))}function L(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:T,resetDefaultState:L,dispose:y,releaseStatesOfGeometry:w,releaseStatesOfObject:v,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:m,disableUnusedAttributes:S}}function jg(s,t,e){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,u){u!==0&&(s.drawArraysInstanced(n,l,c,u),e.update(c,n,u))}function a(l,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let d=0;for(let f=0;f<u;f++)d+=c[f];e.update(d,n,1)}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Qg(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(C){return!(C!==Mn&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const v=C===sn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==nn&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==_n&&!v)}function l(C){if(C==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(Ut("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&d===!1&&Ut("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),S=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),E=s.getParameter(s.MAX_VARYING_VECTORS),M=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),y=s.getParameter(s.MAX_SAMPLES),w=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:S,maxVaryings:E,maxFragmentUniforms:M,maxSamples:y,samples:w}}function tx(s){const t=this;let e=null,n=0,i=!1,r=!1;const o=new Mi,a=new Ht,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||n!==0||i;return i=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,f){const p=h.clippingPlanes,x=h.clipIntersection,m=h.clipShadows,g=s.get(h);if(!i||p===null||p.length===0||r&&!m)r?u(null):c();else{const S=r?0:n,E=S*4;let M=g.clippingState||null;l.value=M,M=u(p,d,E,f);for(let y=0;y!==E;++y)M[y]=e[y];g.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,f,p){const x=h!==null?h.length:0;let m=null;if(x!==0){if(m=l.value,p!==!0||m===null){const g=f+x*4,S=d.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<g)&&(m=new Float32Array(g));for(let E=0,M=f;E!==x;++E,M+=4)o.copy(h[E]).applyMatrix4(S,a),o.normal.toArray(m,M),m[M+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}const wi=4,pu=[.125,.215,.35,.446,.526,.582],Yi=20,ex=256,mr=new vo,mu=new Bt;let ql=null,Yl=0,Kl=0,Zl=!1;const nx=new P;class gu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){const{size:o=256,position:a=nx}=r;ql=this._renderer.getRenderTarget(),Yl=this._renderer.getActiveCubeFace(),Kl=this._renderer.getActiveMipmapLevel(),Zl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_u(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=vu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(ql,Yl,Kl),this._renderer.xr.enabled=Zl,t.scissorTest=!1,Us(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Bi||t.mapping===us?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ql=this._renderer.getRenderTarget(),Yl=this._renderer.getActiveCubeFace(),Kl=this._renderer.getActiveMipmapLevel(),Zl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:He,minFilter:He,generateMipmaps:!1,type:sn,format:Mn,colorSpace:Qs,depthBuffer:!1},i=xu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xu(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=ix(r)),this._blurMaterial=rx(r,t,e),this._ggxMaterial=sx(r,t,e)}return i}_compileMaterial(t){const e=new zt(new $e,t);this._renderer.compile(e,mr)}_sceneToCubeUV(t,e,n,i,r){const l=new Qe(90,1,e,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(mu),h.toneMapping=In,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(i),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new zt(new an,new Tn({name:"PMREM.Background",side:Ye,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,m=x.material;let g=!1;const S=t.background;S?S.isColor&&(m.color.copy(S),t.background=null,g=!0):(m.color.copy(mu),g=!0);for(let E=0;E<6;E++){const M=E%3;M===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[E],r.y,r.z)):M===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[E]));const y=this._cubeSize;Us(i,M*y,E>2?y:0,y,y),h.setRenderTarget(i),g&&h.render(x,l),h.render(t,l)}h.toneMapping=f,h.autoClear=d,t.background=S}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Bi||t.mapping===us;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=_u()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=vu());const r=i?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;const a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Us(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,mr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const i=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;const l=o.uniforms,c=n/(this._lodMeshes.length-1),u=e/(this._lodMeshes.length-1),h=Math.sqrt(c*c-u*u),d=0+c*1.25,f=h*d,{_lodMax:p}=this,x=this._sizeLods[n],m=3*x*(n>p-wi?n-p+wi:0),g=4*(this._cubeSize-x);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=p-e,Us(r,m,g,3*x,2*x),i.setRenderTarget(r),i.render(a,mr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,Us(t,m,g,3*x,2*x),i.setRenderTarget(t),i.render(a,mr)}_blur(t,e,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&te("blur direction must be either latitudinal or longitudinal!");const u=3,h=this._lodMeshes[i];h.material=c;const d=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Yi-1),x=r/p,m=isFinite(r)?1+Math.floor(u*x):Yi;m>Yi&&Ut(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Yi}`);const g=[];let S=0;for(let C=0;C<Yi;++C){const v=C/x,T=Math.exp(-v*v/2);g.push(T),C===0?S+=T:C<m&&(S+=2*T)}for(let C=0;C<g.length;C++)g[C]=g[C]/S;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:E}=this;d.dTheta.value=p,d.mipInt.value=E-n;const M=this._sizeLods[i],y=3*M*(i>E-wi?i-E+wi:0),w=4*(this._cubeSize-M);Us(e,y,w,3*M,2*M),l.setRenderTarget(e),l.render(h,mr)}}function ix(s){const t=[],e=[],n=[];let i=s;const r=s-wi+1+pu.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>s-wi?l=pu[o-s+wi-1]:o===0&&(l=0),e.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,p=6,x=3,m=2,g=1,S=new Float32Array(x*p*f),E=new Float32Array(m*p*f),M=new Float32Array(g*p*f);for(let w=0;w<f;w++){const C=w%3*2/3-1,v=w>2?0:-1,T=[C,v,0,C+2/3,v,0,C+2/3,v+1,0,C,v,0,C+2/3,v+1,0,C,v+1,0];S.set(T,x*p*w),E.set(d,m*p*w);const L=[w,w,w,w,w,w];M.set(L,g*p*w)}const y=new $e;y.setAttribute("position",new dn(S,x)),y.setAttribute("uv",new dn(E,m)),y.setAttribute("faceIndex",new dn(M,g)),n.push(new zt(y,null)),i>wi&&i--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function xu(s,t,e){const n=new je(s,t,e);return n.texture.mapping=Dr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Us(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function sx(s,t,e){return new Ie({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:ex,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Mo(),fragmentShader:`

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
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function rx(s,t,e){const n=new Float32Array(Yi),i=new P(0,1,0);return new Ie({name:"SphericalGaussianBlur",defines:{n:Yi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Mo(),fragmentShader:`

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
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function vu(){return new Ie({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Mo(),fragmentShader:`

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
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function _u(){return new Ie({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Mo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function Mo(){return`

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
	`}class Mu extends je{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Xh(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new an(5,5,5),r=new Ie({name:"CubemapFromEquirect",uniforms:Ds(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ye,blending:Dn});r.uniforms.tEquirect.value=e;const o=new zt(i,r),a=e.minFilter;return e.minFilter===zi&&(e.minFilter=He),new zm(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}}function ox(s){let t=new WeakMap,e=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?o(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===Ma||f===ya)if(t.has(d)){const p=t.get(d).texture;return a(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const x=new Mu(p.height);return x.fromEquirectangularTexture(s,d),t.set(d,x),d.addEventListener("dispose",c),a(x.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture){const f=d.mapping,p=f===Ma||f===ya,x=f===Bi||f===us;if(p||x){let m=e.get(d);const g=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return n===null&&(n=new gu(s)),m=p?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),m.texture;if(m!==void 0)return m.texture;{const S=d.image;return p&&S&&S.height>0||x&&S&&l(S)?(n===null&&(n=new gu(s)),m=p?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),d.addEventListener("dispose",u),m.texture):null}}}return d}function a(d,f){return f===Ma?d.mapping=Bi:f===ya&&(d.mapping=us),d}function l(d){let f=0;const p=6;for(let x=0;x<p;x++)d[x]!==void 0&&f++;return f===p}function c(d){const f=d.target;f.removeEventListener("dispose",c);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function u(d){const f=d.target;f.removeEventListener("dispose",u);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:h}}function ax(s){const t={};function e(n){if(t[n]!==void 0)return t[n];const i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&fs("WebGLRenderer: "+n+" extension not supported."),i}}}function lx(s,t,e,n){const i={},r=new WeakMap;function o(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const p in d.attributes)t.remove(d.attributes[p]);d.removeEventListener("dispose",o),delete i[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function l(h){const d=h.attributes;for(const f in d)t.update(d[f],s.ARRAY_BUFFER)}function c(h){const d=[],f=h.index,p=h.attributes.position;let x=0;if(p===void 0)return;if(f!==null){const S=f.array;x=f.version;for(let E=0,M=S.length;E<M;E+=3){const y=S[E+0],w=S[E+1],C=S[E+2];d.push(y,w,w,C,C,y)}}else{const S=p.array;x=p.version;for(let E=0,M=S.length/3-1;E<M;E+=3){const y=E+0,w=E+1,C=E+2;d.push(y,w,w,C,C,y)}}const m=new(p.count>=65535?Nh:Ih)(d,1);m.version=x;const g=r.get(h);g&&t.remove(g),r.set(h,m)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function cx(s,t,e){let n;function i(h){n=h}let r,o;function a(h){r=h.type,o=h.bytesPerElement}function l(h,d){s.drawElements(n,d,r,h*o),e.update(d,n,1)}function c(h,d,f){f!==0&&(s.drawElementsInstanced(n,d,r,h*o,f),e.update(d,n,f))}function u(h,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,h,0,f);let x=0;for(let m=0;m<f;m++)x+=d[m];e.update(x,n,1)}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function hx(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:te("WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function ux(s,t,e){const n=new WeakMap,i=new ve;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==h){let T=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",T)};d!==void 0&&d.texture.dispose();const f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],S=a.morphAttributes.color||[];let E=0;f===!0&&(E=1),p===!0&&(E=2),x===!0&&(E=3);let M=a.attributes.position.count*E,y=1;M>t.maxTextureSize&&(y=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const w=new Float32Array(M*y*4*h),C=new Sh(w,M,y,h);C.type=_n,C.needsUpdate=!0;const v=E*4;for(let L=0;L<h;L++){const D=m[L],U=g[L],K=S[L],Z=M*y*4*L;for(let N=0;N<D.count;N++){const W=N*v;f===!0&&(i.fromBufferAttribute(D,N),w[Z+W+0]=i.x,w[Z+W+1]=i.y,w[Z+W+2]=i.z,w[Z+W+3]=0),p===!0&&(i.fromBufferAttribute(U,N),w[Z+W+4]=i.x,w[Z+W+5]=i.y,w[Z+W+6]=i.z,w[Z+W+7]=0),x===!0&&(i.fromBufferAttribute(K,N),w[Z+W+8]=i.x,w[Z+W+9]=i.y,w[Z+W+10]=i.z,w[Z+W+11]=K.itemSize===4?i.w:1)}}d={count:h,texture:C,size:new ft(M,y)},n.set(a,d),a.addEventListener("dispose",T)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];const p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",p),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function dx(s,t,e,n,i){let r=new WeakMap;function o(c){const u=i.render.frame,h=c.geometry,d=t.get(c,h);if(r.get(d)!==u&&(t.update(d),r.set(d,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return d}function a(){r=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),e.remove(u.instanceMatrix),u.instanceColor!==null&&e.remove(u.instanceColor)}return{update:o,dispose:a}}const fx={[pa]:"LINEAR_TONE_MAPPING",[ma]:"REINHARD_TONE_MAPPING",[ga]:"CINEON_TONE_MAPPING",[Lr]:"ACES_FILMIC_TONE_MAPPING",[va]:"AGX_TONE_MAPPING",[_a]:"NEUTRAL_TONE_MAPPING",[xa]:"CUSTOM_TONE_MAPPING"};function px(s,t,e,n,i,r){const o=new je(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,depthTexture:i?new Ls(t,e):void 0}),a=new je(t,e,{type:sn,depthBuffer:!1,stencilBuffer:!1}),l=new $e;l.setAttribute("position",new we([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new we([0,2,0,0,2,0],2));const c=new nu({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new zt(l,c),h=new vo(-1,1,1,-1,0,1);let d=null,f=null,p=!1,x,m=null,g=[],S=!1;this.setSize=function(E,M){o.setSize(E,M),a.setSize(E,M);for(let y=0;y<g.length;y++){const w=g[y];w.setSize&&w.setSize(E,M)}},this.setEffects=function(E){g=E,S=g.length>0&&g[0].isRenderPass===!0;const M=o.width,y=o.height;for(let w=0;w<g.length;w++){const C=g[w];C.setSize&&C.setSize(M,y)}},this.begin=function(E,M){if(p||E.toneMapping===In&&g.length===0)return!1;if(m=M,M!==null){const y=M.width,w=M.height;(o.width!==y||o.height!==w)&&this.setSize(y,w)}return S===!1&&E.setRenderTarget(o),x=E.toneMapping,E.toneMapping=In,!0},this.hasRenderPass=function(){return S},this.end=function(E,M){E.toneMapping=x,p=!0;let y=o,w=a;for(let C=0;C<g.length;C++){const v=g[C];if(v.enabled!==!1&&(v.render(E,w,y,M),v.needsSwap!==!1)){const T=y;y=w,w=T}}if(d!==E.outputColorSpace||f!==E.toneMapping){d=E.outputColorSpace,f=E.toneMapping,c.defines={},Jt.getTransfer(d)===se&&(c.defines.SRGB_TRANSFER="");const C=fx[f];C&&(c.defines[C]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=y.texture,E.setRenderTarget(m),E.render(u,h),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),a.dispose(),l.dispose(),c.dispose()}}const yu=new Ve,Jl=new Ls(1,1),bu=new Sh,Su=new Kp,wu=new Xh,Eu=[],Tu=[],Au=new Float32Array(16),Cu=new Float32Array(9),Ru=new Float32Array(4);function Fs(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=Eu[i];if(r===void 0&&(r=new Float32Array(i),Eu[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function Ne(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Ue(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function yo(s,t){let e=Tu[t];e===void 0&&(e=new Int32Array(t),Tu[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function mx(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function gx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;s.uniform2fv(this.addr,t),Ue(e,t)}}function xx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ne(e,t))return;s.uniform3fv(this.addr,t),Ue(e,t)}}function vx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;s.uniform4fv(this.addr,t),Ue(e,t)}}function _x(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ne(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Ue(e,t)}else{if(Ne(e,n))return;Ru.set(n),s.uniformMatrix2fv(this.addr,!1,Ru),Ue(e,n)}}function Mx(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ne(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Ue(e,t)}else{if(Ne(e,n))return;Cu.set(n),s.uniformMatrix3fv(this.addr,!1,Cu),Ue(e,n)}}function yx(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ne(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Ue(e,t)}else{if(Ne(e,n))return;Au.set(n),s.uniformMatrix4fv(this.addr,!1,Au),Ue(e,n)}}function bx(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Sx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;s.uniform2iv(this.addr,t),Ue(e,t)}}function wx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ne(e,t))return;s.uniform3iv(this.addr,t),Ue(e,t)}}function Ex(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;s.uniform4iv(this.addr,t),Ue(e,t)}}function Tx(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Ax(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;s.uniform2uiv(this.addr,t),Ue(e,t)}}function Cx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ne(e,t))return;s.uniform3uiv(this.addr,t),Ue(e,t)}}function Rx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;s.uniform4uiv(this.addr,t),Ue(e,t)}}function Px(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Jl.compareFunction=e.isReversedDepthBuffer()?cl:ll,r=Jl):r=yu,e.setTexture2D(t||r,i)}function Lx(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Su,i)}function Dx(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||wu,i)}function Ix(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||bu,i)}function Nx(s){switch(s){case 5126:return mx;case 35664:return gx;case 35665:return xx;case 35666:return vx;case 35674:return _x;case 35675:return Mx;case 35676:return yx;case 5124:case 35670:return bx;case 35667:case 35671:return Sx;case 35668:case 35672:return wx;case 35669:case 35673:return Ex;case 5125:return Tx;case 36294:return Ax;case 36295:return Cx;case 36296:return Rx;case 35678:case 36198:case 36298:case 36306:case 35682:return Px;case 35679:case 36299:case 36307:return Lx;case 35680:case 36300:case 36308:case 36293:return Dx;case 36289:case 36303:case 36311:case 36292:return Ix}}function Ux(s,t){s.uniform1fv(this.addr,t)}function Fx(s,t){const e=Fs(t,this.size,2);s.uniform2fv(this.addr,e)}function Ox(s,t){const e=Fs(t,this.size,3);s.uniform3fv(this.addr,e)}function kx(s,t){const e=Fs(t,this.size,4);s.uniform4fv(this.addr,e)}function Bx(s,t){const e=Fs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function zx(s,t){const e=Fs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Hx(s,t){const e=Fs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Gx(s,t){s.uniform1iv(this.addr,t)}function Vx(s,t){s.uniform2iv(this.addr,t)}function Wx(s,t){s.uniform3iv(this.addr,t)}function $x(s,t){s.uniform4iv(this.addr,t)}function Xx(s,t){s.uniform1uiv(this.addr,t)}function qx(s,t){s.uniform2uiv(this.addr,t)}function Yx(s,t){s.uniform3uiv(this.addr,t)}function Kx(s,t){s.uniform4uiv(this.addr,t)}function Zx(s,t,e){const n=this.cache,i=t.length,r=yo(e,i);Ne(n,r)||(s.uniform1iv(this.addr,r),Ue(n,r));let o;this.type===s.SAMPLER_2D_SHADOW?o=Jl:o=yu;for(let a=0;a!==i;++a)e.setTexture2D(t[a]||o,r[a])}function Jx(s,t,e){const n=this.cache,i=t.length,r=yo(e,i);Ne(n,r)||(s.uniform1iv(this.addr,r),Ue(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Su,r[o])}function jx(s,t,e){const n=this.cache,i=t.length,r=yo(e,i);Ne(n,r)||(s.uniform1iv(this.addr,r),Ue(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||wu,r[o])}function Qx(s,t,e){const n=this.cache,i=t.length,r=yo(e,i);Ne(n,r)||(s.uniform1iv(this.addr,r),Ue(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||bu,r[o])}function tv(s){switch(s){case 5126:return Ux;case 35664:return Fx;case 35665:return Ox;case 35666:return kx;case 35674:return Bx;case 35675:return zx;case 35676:return Hx;case 5124:case 35670:return Gx;case 35667:case 35671:return Vx;case 35668:case 35672:return Wx;case 35669:case 35673:return $x;case 5125:return Xx;case 36294:return qx;case 36295:return Yx;case 36296:return Kx;case 35678:case 36198:case 36298:case 36306:case 35682:return Zx;case 35679:case 36299:case 36307:return Jx;case 35680:case 36300:case 36308:case 36293:return jx;case 36289:case 36303:case 36311:case 36292:return Qx}}class ev{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Nx(e.type)}}class nv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=tv(e.type)}}class iv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(t,e[a.id],n)}}}const jl=/(\w+)(\])?(\[|\.)?/g;function Pu(s,t){s.seq.push(t),s.map[t.id]=t}function sv(s,t,e){const n=s.name,i=n.length;for(jl.lastIndex=0;;){const r=jl.exec(n),o=jl.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Pu(e,c===void 0?new ev(a,s,t):new nv(a,s,t));break}else{let h=e.map[a];h===void 0&&(h=new iv(a),Pu(e,h)),e=h}}}class bo{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){const a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);sv(a,l,this)}const i=[],r=[];for(const o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(o):r.push(o);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function Lu(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const rv=37297;let ov=0;function av(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Du=new Ht;function lv(s){Jt._getMatrix(Du,Jt.workingColorSpace,s);const t=`mat3( ${Du.elements.map(e=>e.toFixed(4))} )`;switch(Jt.getTransfer(s)){case Hr:return[t,"LinearTransferOETF"];case se:return[t,"sRGBTransferOETF"];default:return Ut("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Iu(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+av(s.getShaderSource(t),a)}else return r}function cv(s,t){const e=lv(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const hv={[pa]:"Linear",[ma]:"Reinhard",[ga]:"Cineon",[Lr]:"ACESFilmic",[va]:"AgX",[_a]:"Neutral",[xa]:"Custom"};function uv(s,t){const e=hv[t];return e===void 0?(Ut("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const So=new P;function dv(){Jt.getLuminanceCoefficients(So);const s=So.x.toFixed(4),t=So.y.toFixed(4),e=So.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function fv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(gr).join(`
`)}function pv(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function mv(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function gr(s){return s!==""}function Nu(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Uu(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const gv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ql(s){return s.replace(gv,vv)}const xv=new Map;function vv(s,t){let e=Yt[t];if(e===void 0){const n=xv.get(t);if(n!==void 0)e=Yt[n],Ut('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Ql(e)}const _v=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fu(s){return s.replace(_v,Mv)}function Mv(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Ou(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}const yv={[Rr]:"SHADOWMAP_TYPE_PCF",[Zs]:"SHADOWMAP_TYPE_VSM"};function bv(s){return yv[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Sv={[Bi]:"ENVMAP_TYPE_CUBE",[us]:"ENVMAP_TYPE_CUBE",[Dr]:"ENVMAP_TYPE_CUBE_UV"};function wv(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Sv[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const Ev={[us]:"ENVMAP_MODE_REFRACTION"};function Tv(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Ev[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Av={[rh]:"ENVMAP_BLENDING_MULTIPLY",[fp]:"ENVMAP_BLENDING_MIX",[pp]:"ENVMAP_BLENDING_ADD"};function Cv(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Av[s.combine]||"ENVMAP_BLENDING_NONE"}function Rv(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Pv(s,t,e,n){const i=s.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=bv(e),c=wv(e),u=Tv(e),h=Cv(e),d=Rv(e),f=fv(e),p=pv(r),x=i.createProgram();let m,g,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(gr).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(gr).join(`
`),g.length>0&&(g+=`
`)):(m=[Ou(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(gr).join(`
`),g=[Ou(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==In?"#define TONE_MAPPING":"",e.toneMapping!==In?Yt.tonemapping_pars_fragment:"",e.toneMapping!==In?uv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Yt.colorspace_pars_fragment,cv("linearToOutputTexel",e.outputColorSpace),dv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(gr).join(`
`)),o=Ql(o),o=Nu(o,e),o=Uu(o,e),a=Ql(a),a=Nu(a,e),a=Uu(a,e),o=Fu(o),a=Fu(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===mh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===mh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const E=S+m+o,M=S+g+a,y=Lu(i,i.VERTEX_SHADER,E),w=Lu(i,i.FRAGMENT_SHADER,M);i.attachShader(x,y),i.attachShader(x,w),e.index0AttributeName!==void 0?i.bindAttribLocation(x,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(x,0,"position"),i.linkProgram(x);function C(D){if(s.debug.checkShaderErrors){const U=i.getProgramInfoLog(x)||"",K=i.getShaderInfoLog(y)||"",Z=i.getShaderInfoLog(w)||"",N=U.trim(),W=K.trim(),B=Z.trim();let X=!0,nt=!0;if(i.getProgramParameter(x,i.LINK_STATUS)===!1)if(X=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,x,y,w);else{const ot=Iu(i,y,"vertex"),at=Iu(i,w,"fragment");te("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(x,i.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+N+`
`+ot+`
`+at)}else N!==""?Ut("WebGLProgram: Program Info Log:",N):(W===""||B==="")&&(nt=!1);nt&&(D.diagnostics={runnable:X,programLog:N,vertexShader:{log:W,prefix:m},fragmentShader:{log:B,prefix:g}})}i.deleteShader(y),i.deleteShader(w),v=new bo(i,x),T=mv(i,x)}let v;this.getUniforms=function(){return v===void 0&&C(this),v};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let L=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=i.getProgramParameter(x,rv)),L},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ov++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=y,this.fragmentShader=w,this}let Lv=0;class Dv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Iv(t),e.set(t,n)),n}}class Iv{constructor(t){this.id=Lv++,this.code=t,this.usedTimes=0}}function Nv(s){return s===Gi||s===Br||s===zr}function Uv(s,t,e,n,i,r){const o=new gl,a=new Dv,l=new Set,c=[],u=new Map,h=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(v){return l.add(v),v===0?"uv":`uv${v}`}function x(v,T,L,D,U,K){const Z=D.fog,N=U.geometry,W=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?D.environment:null,B=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,X=t.get(v.envMap||W,B),nt=X&&X.mapping===Dr?X.image.height:null,ot=f[v.type];v.precision!==null&&(d=n.getMaxPrecision(v.precision),d!==v.precision&&Ut("WebGLProgram.getParameters:",v.precision,"not supported, using",d,"instead."));const at=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,xt=at!==void 0?at.length:0;let Gt=0;N.morphAttributes.position!==void 0&&(Gt=1),N.morphAttributes.normal!==void 0&&(Gt=2),N.morphAttributes.color!==void 0&&(Gt=3);let xe,ee,Q,I;if(ot){const Et=kn[ot];xe=Et.vertexShader,ee=Et.fragmentShader}else{xe=v.vertexShader,ee=v.fragmentShader;const Et=a.getVertexShaderStage(v),be=a.getFragmentShaderStage(v);a.update(v,Et,be),Q=Et.id,I=be.id}const q=s.getRenderTarget(),st=s.state.buffers.depth.getReversed(),ut=U.isInstancedMesh===!0,lt=U.isBatchedMesh===!0,Ot=!!v.map,Dt=!!v.matcap,Vt=!!X,jt=!!v.aoMap,Qt=!!v.lightMap,ne=!!v.bumpMap&&v.wireframe===!1,he=!!v.normalMap,ue=!!v.displacementMap,Le=!!v.emissiveMap,ye=!!v.metalnessMap,De=!!v.roughnessMap,O=v.anisotropy>0,en=v.clearcoat>0,ae=v.dispersion>0,A=v.iridescence>0,_=v.sheen>0,z=v.transmission>0,$=O&&!!v.anisotropyMap,J=en&&!!v.clearcoatMap,ct=en&&!!v.clearcoatNormalMap,dt=en&&!!v.clearcoatRoughnessMap,j=A&&!!v.iridescenceMap,et=A&&!!v.iridescenceThicknessMap,pt=_&&!!v.sheenColorMap,Ct=_&&!!v.sheenRoughnessMap,_t=!!v.specularMap,mt=!!v.specularColorMap,Nt=!!v.specularIntensityMap,Ft=z&&!!v.transmissionMap,$t=z&&!!v.thicknessMap,F=!!v.gradientMap,ht=!!v.alphaMap,tt=v.alphaTest>0,gt=!!v.alphaHash,bt=!!v.extensions;let it=In;v.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(it=s.toneMapping);const At={shaderID:ot,shaderType:v.type,shaderName:v.name,vertexShader:xe,fragmentShader:ee,defines:v.defines,customVertexShaderID:Q,customFragmentShaderID:I,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:d,batching:lt,batchingColor:lt&&U._colorsTexture!==null,instancing:ut,instancingColor:ut&&U.instanceColor!==null,instancingMorph:ut&&U.morphTexture!==null,outputColorSpace:q===null?s.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:Jt.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Ot,matcap:Dt,envMap:Vt,envMapMode:Vt&&X.mapping,envMapCubeUVHeight:nt,aoMap:jt,lightMap:Qt,bumpMap:ne,normalMap:he,displacementMap:ue,emissiveMap:Le,normalMapObjectSpace:he&&v.normalMapType===xp,normalMapTangentSpace:he&&v.normalMapType===al,packedNormalMap:he&&v.normalMapType===al&&Nv(v.normalMap.format),metalnessMap:ye,roughnessMap:De,anisotropy:O,anisotropyMap:$,clearcoat:en,clearcoatMap:J,clearcoatNormalMap:ct,clearcoatRoughnessMap:dt,dispersion:ae,iridescence:A,iridescenceMap:j,iridescenceThicknessMap:et,sheen:_,sheenColorMap:pt,sheenRoughnessMap:Ct,specularMap:_t,specularColorMap:mt,specularIntensityMap:Nt,transmission:z,transmissionMap:Ft,thicknessMap:$t,gradientMap:F,opaque:v.transparent===!1&&v.blending===cs&&v.alphaToCoverage===!1,alphaMap:ht,alphaTest:tt,alphaHash:gt,combine:v.combine,mapUv:Ot&&p(v.map.channel),aoMapUv:jt&&p(v.aoMap.channel),lightMapUv:Qt&&p(v.lightMap.channel),bumpMapUv:ne&&p(v.bumpMap.channel),normalMapUv:he&&p(v.normalMap.channel),displacementMapUv:ue&&p(v.displacementMap.channel),emissiveMapUv:Le&&p(v.emissiveMap.channel),metalnessMapUv:ye&&p(v.metalnessMap.channel),roughnessMapUv:De&&p(v.roughnessMap.channel),anisotropyMapUv:$&&p(v.anisotropyMap.channel),clearcoatMapUv:J&&p(v.clearcoatMap.channel),clearcoatNormalMapUv:ct&&p(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:dt&&p(v.clearcoatRoughnessMap.channel),iridescenceMapUv:j&&p(v.iridescenceMap.channel),iridescenceThicknessMapUv:et&&p(v.iridescenceThicknessMap.channel),sheenColorMapUv:pt&&p(v.sheenColorMap.channel),sheenRoughnessMapUv:Ct&&p(v.sheenRoughnessMap.channel),specularMapUv:_t&&p(v.specularMap.channel),specularColorMapUv:mt&&p(v.specularColorMap.channel),specularIntensityMapUv:Nt&&p(v.specularIntensityMap.channel),transmissionMapUv:Ft&&p(v.transmissionMap.channel),thicknessMapUv:$t&&p(v.thicknessMap.channel),alphaMapUv:ht&&p(v.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(he||O),vertexNormals:!!N.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!N.attributes.uv&&(Ot||ht),fog:!!Z,useFog:v.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||N.attributes.normal===void 0&&he===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:st,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:N.attributes.position!==void 0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:xt,morphTextureStride:Gt,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:K.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:it,decodeVideoTexture:Ot&&v.map.isVideoTexture===!0&&Jt.getTransfer(v.map.colorSpace)===se,decodeVideoTextureEmissive:Le&&v.emissiveMap.isVideoTexture===!0&&Jt.getTransfer(v.emissiveMap.colorSpace)===se,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===qn,flipSided:v.side===Ye,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:bt&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(bt&&v.extensions.multiDraw===!0||lt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return At.vertexUv1s=l.has(1),At.vertexUv2s=l.has(2),At.vertexUv3s=l.has(3),l.clear(),At}function m(v){const T=[];if(v.shaderID?T.push(v.shaderID):(T.push(v.customVertexShaderID),T.push(v.customFragmentShaderID)),v.defines!==void 0)for(const L in v.defines)T.push(L),T.push(v.defines[L]);return v.isRawShaderMaterial===!1&&(g(T,v),S(T,v),T.push(s.outputColorSpace)),T.push(v.customProgramCacheKey),T.join()}function g(v,T){v.push(T.precision),v.push(T.outputColorSpace),v.push(T.envMapMode),v.push(T.envMapCubeUVHeight),v.push(T.mapUv),v.push(T.alphaMapUv),v.push(T.lightMapUv),v.push(T.aoMapUv),v.push(T.bumpMapUv),v.push(T.normalMapUv),v.push(T.displacementMapUv),v.push(T.emissiveMapUv),v.push(T.metalnessMapUv),v.push(T.roughnessMapUv),v.push(T.anisotropyMapUv),v.push(T.clearcoatMapUv),v.push(T.clearcoatNormalMapUv),v.push(T.clearcoatRoughnessMapUv),v.push(T.iridescenceMapUv),v.push(T.iridescenceThicknessMapUv),v.push(T.sheenColorMapUv),v.push(T.sheenRoughnessMapUv),v.push(T.specularMapUv),v.push(T.specularColorMapUv),v.push(T.specularIntensityMapUv),v.push(T.transmissionMapUv),v.push(T.thicknessMapUv),v.push(T.combine),v.push(T.fogExp2),v.push(T.sizeAttenuation),v.push(T.morphTargetsCount),v.push(T.morphAttributeCount),v.push(T.numDirLights),v.push(T.numPointLights),v.push(T.numSpotLights),v.push(T.numSpotLightMaps),v.push(T.numHemiLights),v.push(T.numRectAreaLights),v.push(T.numDirLightShadows),v.push(T.numPointLightShadows),v.push(T.numSpotLightShadows),v.push(T.numSpotLightShadowsWithMaps),v.push(T.numLightProbes),v.push(T.shadowMapType),v.push(T.toneMapping),v.push(T.numClippingPlanes),v.push(T.numClipIntersection),v.push(T.depthPacking)}function S(v,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),T.packedNormalMap&&o.enable(22),T.vertexNormals&&o.enable(23),v.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),T.numLightProbeGrids>0&&o.enable(22),T.hasPositionAttribute&&o.enable(23),v.push(o.mask)}function E(v){const T=f[v.type];let L;if(T){const D=kn[T];L=pr.clone(D.uniforms)}else L=v.uniforms;return L}function M(v,T){let L=u.get(T);return L!==void 0?++L.usedTimes:(L=new Pv(s,T,v,i),c.push(L),u.set(T,L)),L}function y(v){if(--v.usedTimes===0){const T=c.indexOf(v);c[T]=c[c.length-1],c.pop(),u.delete(v.cacheKey),v.destroy()}}function w(v){a.remove(v)}function C(){a.dispose()}return{getParameters:x,getProgramCacheKey:m,getUniforms:E,acquireProgram:M,releaseProgram:y,releaseShaderCache:w,programs:c,dispose:C}}function Fv(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function Ov(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function ku(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Bu(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function a(d,f,p,x,m,g){let S=s[t];return S===void 0?(S={id:d.id,object:d,geometry:f,material:p,materialVariant:o(d),groupOrder:x,renderOrder:d.renderOrder,z:m,group:g},s[t]=S):(S.id=d.id,S.object=d,S.geometry=f,S.material=p,S.materialVariant=o(d),S.groupOrder=x,S.renderOrder=d.renderOrder,S.z=m,S.group=g),t++,S}function l(d,f,p,x,m,g){const S=a(d,f,p,x,m,g);p.transmission>0?n.push(S):p.transparent===!0?i.push(S):e.push(S)}function c(d,f,p,x,m,g){const S=a(d,f,p,x,m,g);p.transmission>0?n.unshift(S):p.transparent===!0?i.unshift(S):e.unshift(S)}function u(d,f,p){e.length>1&&e.sort(d||Ov),n.length>1&&n.sort(f||ku),i.length>1&&i.sort(f||ku),p&&(e.reverse(),n.reverse(),i.reverse())}function h(){for(let d=t,f=s.length;d<f;d++){const p=s[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:h,sort:u}}function kv(){let s=new WeakMap;function t(n,i){const r=s.get(n);let o;return r===void 0?(o=new Bu,s.set(n,[o])):i>=r.length?(o=new Bu,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function Bv(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new Bt};break;case"SpotLight":e={position:new P,direction:new P,color:new Bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new Bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new Bt,groundColor:new Bt};break;case"RectAreaLight":e={color:new Bt,position:new P,halfWidth:new P,halfHeight:new P};break}return s[t.id]=e,e}}}function zv(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Hv=0;function Gv(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Vv(s){const t=new Bv,e=zv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const i=new P,r=new re,o=new re;function a(c){let u=0,h=0,d=0;for(let T=0;T<9;T++)n.probe[T].set(0,0,0);let f=0,p=0,x=0,m=0,g=0,S=0,E=0,M=0,y=0,w=0,C=0;c.sort(Gv);for(let T=0,L=c.length;T<L;T++){const D=c[T],U=D.color,K=D.intensity,Z=D.distance;let N=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Gi?N=D.shadow.map.texture:N=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)u+=U.r*K,h+=U.g*K,d+=U.b*K;else if(D.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(D.sh.coefficients[W],K);C++}else if(D.isDirectionalLight){const W=t.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const B=D.shadow,X=e.get(D);X.shadowIntensity=B.intensity,X.shadowBias=B.bias,X.shadowNormalBias=B.normalBias,X.shadowRadius=B.radius,X.shadowMapSize=B.mapSize,n.directionalShadow[f]=X,n.directionalShadowMap[f]=N,n.directionalShadowMatrix[f]=D.shadow.matrix,S++}n.directional[f]=W,f++}else if(D.isSpotLight){const W=t.get(D);W.position.setFromMatrixPosition(D.matrixWorld),W.color.copy(U).multiplyScalar(K),W.distance=Z,W.coneCos=Math.cos(D.angle),W.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),W.decay=D.decay,n.spot[x]=W;const B=D.shadow;if(D.map&&(n.spotLightMap[y]=D.map,y++,B.updateMatrices(D),D.castShadow&&w++),n.spotLightMatrix[x]=B.matrix,D.castShadow){const X=e.get(D);X.shadowIntensity=B.intensity,X.shadowBias=B.bias,X.shadowNormalBias=B.normalBias,X.shadowRadius=B.radius,X.shadowMapSize=B.mapSize,n.spotShadow[x]=X,n.spotShadowMap[x]=N,M++}x++}else if(D.isRectAreaLight){const W=t.get(D);W.color.copy(U).multiplyScalar(K),W.halfWidth.set(D.width*.5,0,0),W.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=W,m++}else if(D.isPointLight){const W=t.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),W.distance=D.distance,W.decay=D.decay,D.castShadow){const B=D.shadow,X=e.get(D);X.shadowIntensity=B.intensity,X.shadowBias=B.bias,X.shadowNormalBias=B.normalBias,X.shadowRadius=B.radius,X.shadowMapSize=B.mapSize,X.shadowCameraNear=B.camera.near,X.shadowCameraFar=B.camera.far,n.pointShadow[p]=X,n.pointShadowMap[p]=N,n.pointShadowMatrix[p]=D.shadow.matrix,E++}n.point[p]=W,p++}else if(D.isHemisphereLight){const W=t.get(D);W.skyColor.copy(D.color).multiplyScalar(K),W.groundColor.copy(D.groundColor).multiplyScalar(K),n.hemi[g]=W,g++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=vt.LTC_FLOAT_1,n.rectAreaLTC2=vt.LTC_FLOAT_2):(n.rectAreaLTC1=vt.LTC_HALF_1,n.rectAreaLTC2=vt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const v=n.hash;(v.directionalLength!==f||v.pointLength!==p||v.spotLength!==x||v.rectAreaLength!==m||v.hemiLength!==g||v.numDirectionalShadows!==S||v.numPointShadows!==E||v.numSpotShadows!==M||v.numSpotMaps!==y||v.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=M+y-w,n.spotLightMap.length=y,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=C,v.directionalLength=f,v.pointLength=p,v.spotLength=x,v.rectAreaLength=m,v.hemiLength=g,v.numDirectionalShadows=S,v.numPointShadows=E,v.numSpotShadows=M,v.numSpotMaps=y,v.numLightProbes=C,n.version=Hv++)}function l(c,u){let h=0,d=0,f=0,p=0,x=0;const m=u.matrixWorldInverse;for(let g=0,S=c.length;g<S;g++){const E=c[g];if(E.isDirectionalLight){const M=n.directional[h];M.direction.setFromMatrixPosition(E.matrixWorld),i.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),h++}else if(E.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(E.matrixWorld),i.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),f++}else if(E.isRectAreaLight){const M=n.rectArea[p];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),o.identity(),r.copy(E.matrixWorld),r.premultiply(m),o.extractRotation(r),M.halfWidth.set(E.width*.5,0,0),M.halfHeight.set(0,E.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),p++}else if(E.isPointLight){const M=n.point[d];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),d++}else if(E.isHemisphereLight){const M=n.hemi[x];M.direction.setFromMatrixPosition(E.matrixWorld),M.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:n}}function zu(s){const t=new Vv(s),e=[],n=[],i=[];function r(d){h.camera=d,e.length=0,n.length=0,i.length=0}function o(d){e.push(d)}function a(d){n.push(d)}function l(d){i.push(d)}function c(){t.setup(e)}function u(d){t.setupView(e,d)}const h={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function Wv(s){let t=new WeakMap;function e(i,r=0){const o=t.get(i);let a;return o===void 0?(a=new zu(s),t.set(i,[a])):r>=o.length?(a=new zu(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const $v=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Xv=`uniform sampler2D shadow_pass;
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
}`,qv=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],Yv=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],Hu=new re,xr=new P,tc=new P;function Kv(s,t,e){let n=new co;const i=new ft,r=new ft,o=new ve,a=new Dm,l=new Im,c={},u=e.maxTextureSize,h={[di]:Ye,[Ye]:di,[qn]:qn},d=new Ie({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:$v,fragmentShader:Xv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new $e;p.setAttribute("position",new dn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new zt(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Rr;let g=this.type;this.render=function(w,C,v){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;this.type===Yf&&(Ut("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Rr);const T=s.getRenderTarget(),L=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),U=s.state;U.setBlending(Dn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const K=g!==this.type;K&&C.traverse(function(Z){Z.material&&(Array.isArray(Z.material)?Z.material.forEach(N=>N.needsUpdate=!0):Z.material.needsUpdate=!0)});for(let Z=0,N=w.length;Z<N;Z++){const W=w[Z],B=W.shadow;if(B===void 0){Ut("WebGLShadowMap:",W,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;i.copy(B.mapSize);const X=B.getFrameExtents();i.multiply(X),r.copy(B.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(r.x=Math.floor(u/X.x),i.x=r.x*X.x,B.mapSize.x=r.x),i.y>u&&(r.y=Math.floor(u/X.y),i.y=r.y*X.y,B.mapSize.y=r.y));const nt=s.state.buffers.depth.getReversed();if(B.camera._reversedDepth=nt,B.map===null||K===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Zs){if(W.isPointLight){Ut("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new je(i.x,i.y,{format:Gi,type:sn,minFilter:He,magFilter:He,generateMipmaps:!1}),B.map.texture.name=W.name+".shadowMap",B.map.depthTexture=new Ls(i.x,i.y,_n),B.map.depthTexture.name=W.name+".shadowMapDepth",B.map.depthTexture.format=Kn,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=ze,B.map.depthTexture.magFilter=ze}else W.isPointLight?(B.map=new Mu(i.x),B.map.depthTexture=new fm(i.x,Nn)):(B.map=new je(i.x,i.y),B.map.depthTexture=new Ls(i.x,i.y,Nn)),B.map.depthTexture.name=W.name+".shadowMap",B.map.depthTexture.format=Kn,this.type===Rr?(B.map.depthTexture.compareFunction=nt?cl:ll,B.map.depthTexture.minFilter=He,B.map.depthTexture.magFilter=He):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=ze,B.map.depthTexture.magFilter=ze);B.camera.updateProjectionMatrix()}const ot=B.map.isWebGLCubeRenderTarget?6:1;for(let at=0;at<ot;at++){if(B.map.isWebGLCubeRenderTarget)s.setRenderTarget(B.map,at),s.clear();else{at===0&&(s.setRenderTarget(B.map),s.clear());const xt=B.getViewport(at);o.set(r.x*xt.x,r.y*xt.y,r.x*xt.z,r.y*xt.w),U.viewport(o)}if(W.isPointLight){const xt=B.camera,Gt=B.matrix,xe=W.distance||xt.far;xe!==xt.far&&(xt.far=xe,xt.updateProjectionMatrix()),xr.setFromMatrixPosition(W.matrixWorld),xt.position.copy(xr),tc.copy(xt.position),tc.add(qv[at]),xt.up.copy(Yv[at]),xt.lookAt(tc),xt.updateMatrixWorld(),Gt.makeTranslation(-xr.x,-xr.y,-xr.z),Hu.multiplyMatrices(xt.projectionMatrix,xt.matrixWorldInverse),B._frustum.setFromProjectionMatrix(Hu,xt.coordinateSystem,xt.reversedDepth)}else B.updateMatrices(W);n=B.getFrustum(),M(C,v,B.camera,W,this.type)}B.isPointLightShadow!==!0&&this.type===Zs&&S(B,v),B.needsUpdate=!1}g=this.type,m.needsUpdate=!1,s.setRenderTarget(T,L,D)};function S(w,C){const v=t.update(x);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new je(i.x,i.y,{format:Gi,type:sn})),d.uniforms.shadow_pass.value=w.map.depthTexture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(C,null,v,d,x,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(C,null,v,f,x,null)}function E(w,C,v,T){let L=null;const D=v.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(D!==void 0)L=D;else if(L=v.isPointLight===!0?l:a,s.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const U=L.uuid,K=C.uuid;let Z=c[U];Z===void 0&&(Z={},c[U]=Z);let N=Z[K];N===void 0&&(N=L.clone(),Z[K]=N,C.addEventListener("dispose",y)),L=N}if(L.visible=C.visible,L.wireframe=C.wireframe,T===Zs?L.side=C.shadowSide!==null?C.shadowSide:C.side:L.side=C.shadowSide!==null?C.shadowSide:h[C.side],L.alphaMap=C.alphaMap,L.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,L.map=C.map,L.clipShadows=C.clipShadows,L.clippingPlanes=C.clippingPlanes,L.clipIntersection=C.clipIntersection,L.displacementMap=C.displacementMap,L.displacementScale=C.displacementScale,L.displacementBias=C.displacementBias,L.wireframeLinewidth=C.wireframeLinewidth,L.linewidth=C.linewidth,v.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const U=s.properties.get(L);U.light=v}return L}function M(w,C,v,T,L){if(w.visible===!1)return;if(w.layers.test(C.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&L===Zs)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,w.matrixWorld);const K=t.update(w),Z=w.material;if(Array.isArray(Z)){const N=K.groups;for(let W=0,B=N.length;W<B;W++){const X=N[W],nt=Z[X.materialIndex];if(nt&&nt.visible){const ot=E(w,nt,T,L);w.onBeforeShadow(s,w,C,v,K,ot,X),s.renderBufferDirect(v,null,K,ot,w,X),w.onAfterShadow(s,w,C,v,K,ot,X)}}}else if(Z.visible){const N=E(w,Z,T,L);w.onBeforeShadow(s,w,C,v,K,N,null),s.renderBufferDirect(v,null,K,N,w,null),w.onAfterShadow(s,w,C,v,K,N,null)}}const U=w.children;for(let K=0,Z=U.length;K<Z;K++)M(U[K],C,v,T,L)}function y(w){w.target.removeEventListener("dispose",y);for(const v in c){const T=c[v],L=w.target.uuid;L in T&&(T[L].dispose(),delete T[L])}}}function Zv(s,t){function e(){let F=!1;const ht=new ve;let tt=null;const gt=new ve(0,0,0,0);return{setMask:function(bt){tt!==bt&&!F&&(s.colorMask(bt,bt,bt,bt),tt=bt)},setLocked:function(bt){F=bt},setClear:function(bt,it,At,Et,be){be===!0&&(bt*=Et,it*=Et,At*=Et),ht.set(bt,it,At,Et),gt.equals(ht)===!1&&(s.clearColor(bt,it,At,Et),gt.copy(ht))},reset:function(){F=!1,tt=null,gt.set(-1,0,0,0)}}}function n(){let F=!1,ht=!1,tt=null,gt=null,bt=null;return{setReversed:function(it){if(ht!==it){const At=t.get("EXT_clip_control");it?At.clipControlEXT(At.LOWER_LEFT_EXT,At.ZERO_TO_ONE_EXT):At.clipControlEXT(At.LOWER_LEFT_EXT,At.NEGATIVE_ONE_TO_ONE_EXT),ht=it;const Et=bt;bt=null,this.setClear(Et)}},getReversed:function(){return ht},setTest:function(it){it?q(s.DEPTH_TEST):st(s.DEPTH_TEST)},setMask:function(it){tt!==it&&!F&&(s.depthMask(it),tt=it)},setFunc:function(it){if(ht&&(it=Ap[it]),gt!==it){switch(it){case aa:s.depthFunc(s.NEVER);break;case la:s.depthFunc(s.ALWAYS);break;case ca:s.depthFunc(s.LESS);break;case hs:s.depthFunc(s.LEQUAL);break;case ha:s.depthFunc(s.EQUAL);break;case ua:s.depthFunc(s.GEQUAL);break;case da:s.depthFunc(s.GREATER);break;case fa:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}gt=it}},setLocked:function(it){F=it},setClear:function(it){bt!==it&&(bt=it,ht&&(it=1-it),s.clearDepth(it))},reset:function(){F=!1,tt=null,gt=null,bt=null,ht=!1}}}function i(){let F=!1,ht=null,tt=null,gt=null,bt=null,it=null,At=null,Et=null,be=null;return{setTest:function(me){F||(me?q(s.STENCIL_TEST):st(s.STENCIL_TEST))},setMask:function(me){ht!==me&&!F&&(s.stencilMask(me),ht=me)},setFunc:function(me,Gn,Vn){(tt!==me||gt!==Gn||bt!==Vn)&&(s.stencilFunc(me,Gn,Vn),tt=me,gt=Gn,bt=Vn)},setOp:function(me,Gn,Vn){(it!==me||At!==Gn||Et!==Vn)&&(s.stencilOp(me,Gn,Vn),it=me,At=Gn,Et=Vn)},setLocked:function(me){F=me},setClear:function(me){be!==me&&(s.clearStencil(me),be=me)},reset:function(){F=!1,ht=null,tt=null,gt=null,bt=null,it=null,At=null,Et=null,be=null}}}const r=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap;let u={},h={},d={},f=new WeakMap,p=[],x=null,m=!1,g=null,S=null,E=null,M=null,y=null,w=null,C=null,v=new Bt(0,0,0),T=0,L=!1,D=null,U=null,K=null,Z=null,N=null;const W=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,X=0;const nt=s.getParameter(s.VERSION);nt.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(nt)[1]),B=X>=1):nt.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(nt)[1]),B=X>=2);let ot=null,at={};const xt=s.getParameter(s.SCISSOR_BOX),Gt=s.getParameter(s.VIEWPORT),xe=new ve().fromArray(xt),ee=new ve().fromArray(Gt);function Q(F,ht,tt,gt){const bt=new Uint8Array(4),it=s.createTexture();s.bindTexture(F,it),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let At=0;At<tt;At++)F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY?s.texImage3D(ht,0,s.RGBA,1,1,gt,0,s.RGBA,s.UNSIGNED_BYTE,bt):s.texImage2D(ht+At,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,bt);return it}const I={};I[s.TEXTURE_2D]=Q(s.TEXTURE_2D,s.TEXTURE_2D,1),I[s.TEXTURE_CUBE_MAP]=Q(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),I[s.TEXTURE_2D_ARRAY]=Q(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),I[s.TEXTURE_3D]=Q(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),q(s.DEPTH_TEST),o.setFunc(hs),ne(!1),he(nh),q(s.CULL_FACE),jt(Dn);function q(F){u[F]!==!0&&(s.enable(F),u[F]=!0)}function st(F){u[F]!==!1&&(s.disable(F),u[F]=!1)}function ut(F,ht){return d[F]!==ht?(s.bindFramebuffer(F,ht),d[F]=ht,F===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=ht),F===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=ht),!0):!1}function lt(F,ht){let tt=p,gt=!1;if(F){tt=f.get(ht),tt===void 0&&(tt=[],f.set(ht,tt));const bt=F.textures;if(tt.length!==bt.length||tt[0]!==s.COLOR_ATTACHMENT0){for(let it=0,At=bt.length;it<At;it++)tt[it]=s.COLOR_ATTACHMENT0+it;tt.length=bt.length,gt=!0}}else tt[0]!==s.BACK&&(tt[0]=s.BACK,gt=!0);gt&&s.drawBuffers(tt)}function Ot(F){return x!==F?(s.useProgram(F),x=F,!0):!1}const Dt={[ki]:s.FUNC_ADD,[Zf]:s.FUNC_SUBTRACT,[Jf]:s.FUNC_REVERSE_SUBTRACT};Dt[jf]=s.MIN,Dt[Qf]=s.MAX;const Vt={[tp]:s.ZERO,[ep]:s.ONE,[np]:s.SRC_COLOR,[ra]:s.SRC_ALPHA,[lp]:s.SRC_ALPHA_SATURATE,[op]:s.DST_COLOR,[sp]:s.DST_ALPHA,[ip]:s.ONE_MINUS_SRC_COLOR,[oa]:s.ONE_MINUS_SRC_ALPHA,[ap]:s.ONE_MINUS_DST_COLOR,[rp]:s.ONE_MINUS_DST_ALPHA,[cp]:s.CONSTANT_COLOR,[hp]:s.ONE_MINUS_CONSTANT_COLOR,[up]:s.CONSTANT_ALPHA,[dp]:s.ONE_MINUS_CONSTANT_ALPHA};function jt(F,ht,tt,gt,bt,it,At,Et,be,me){if(F===Dn){m===!0&&(st(s.BLEND),m=!1);return}if(m===!1&&(q(s.BLEND),m=!0),F!==Kf){if(F!==g||me!==L){if((S!==ki||y!==ki)&&(s.blendEquation(s.FUNC_ADD),S=ki,y=ki),me)switch(F){case cs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Pr:s.blendFunc(s.ONE,s.ONE);break;case ih:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case sh:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:te("WebGLState: Invalid blending: ",F);break}else switch(F){case cs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Pr:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case ih:te("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case sh:te("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:te("WebGLState: Invalid blending: ",F);break}E=null,M=null,w=null,C=null,v.set(0,0,0),T=0,g=F,L=me}return}bt=bt||ht,it=it||tt,At=At||gt,(ht!==S||bt!==y)&&(s.blendEquationSeparate(Dt[ht],Dt[bt]),S=ht,y=bt),(tt!==E||gt!==M||it!==w||At!==C)&&(s.blendFuncSeparate(Vt[tt],Vt[gt],Vt[it],Vt[At]),E=tt,M=gt,w=it,C=At),(Et.equals(v)===!1||be!==T)&&(s.blendColor(Et.r,Et.g,Et.b,be),v.copy(Et),T=be),g=F,L=!1}function Qt(F,ht){F.side===qn?st(s.CULL_FACE):q(s.CULL_FACE);let tt=F.side===Ye;ht&&(tt=!tt),ne(tt),F.blending===cs&&F.transparent===!1?jt(Dn):jt(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),r.setMask(F.colorWrite);const gt=F.stencilWrite;a.setTest(gt),gt&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Le(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?q(s.SAMPLE_ALPHA_TO_COVERAGE):st(s.SAMPLE_ALPHA_TO_COVERAGE)}function ne(F){D!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),D=F)}function he(F){F!==Xf?(q(s.CULL_FACE),F!==U&&(F===nh?s.cullFace(s.BACK):F===qf?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):st(s.CULL_FACE),U=F}function ue(F){F!==K&&(B&&s.lineWidth(F),K=F)}function Le(F,ht,tt){F?(q(s.POLYGON_OFFSET_FILL),(Z!==ht||N!==tt)&&(Z=ht,N=tt,o.getReversed()&&(ht=-ht),s.polygonOffset(ht,tt))):st(s.POLYGON_OFFSET_FILL)}function ye(F){F?q(s.SCISSOR_TEST):st(s.SCISSOR_TEST)}function De(F){F===void 0&&(F=s.TEXTURE0+W-1),ot!==F&&(s.activeTexture(F),ot=F)}function O(F,ht,tt){tt===void 0&&(ot===null?tt=s.TEXTURE0+W-1:tt=ot);let gt=at[tt];gt===void 0&&(gt={type:void 0,texture:void 0},at[tt]=gt),(gt.type!==F||gt.texture!==ht)&&(ot!==tt&&(s.activeTexture(tt),ot=tt),s.bindTexture(F,ht||I[F]),gt.type=F,gt.texture=ht)}function en(){const F=at[ot];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function ae(){try{s.compressedTexImage2D(...arguments)}catch(F){te("WebGLState:",F)}}function A(){try{s.compressedTexImage3D(...arguments)}catch(F){te("WebGLState:",F)}}function _(){try{s.texSubImage2D(...arguments)}catch(F){te("WebGLState:",F)}}function z(){try{s.texSubImage3D(...arguments)}catch(F){te("WebGLState:",F)}}function $(){try{s.compressedTexSubImage2D(...arguments)}catch(F){te("WebGLState:",F)}}function J(){try{s.compressedTexSubImage3D(...arguments)}catch(F){te("WebGLState:",F)}}function ct(){try{s.texStorage2D(...arguments)}catch(F){te("WebGLState:",F)}}function dt(){try{s.texStorage3D(...arguments)}catch(F){te("WebGLState:",F)}}function j(){try{s.texImage2D(...arguments)}catch(F){te("WebGLState:",F)}}function et(){try{s.texImage3D(...arguments)}catch(F){te("WebGLState:",F)}}function pt(F){return h[F]!==void 0?h[F]:s.getParameter(F)}function Ct(F,ht){h[F]!==ht&&(s.pixelStorei(F,ht),h[F]=ht)}function _t(F){xe.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),xe.copy(F))}function mt(F){ee.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),ee.copy(F))}function Nt(F,ht){let tt=c.get(ht);tt===void 0&&(tt=new WeakMap,c.set(ht,tt));let gt=tt.get(F);gt===void 0&&(gt=s.getUniformBlockIndex(ht,F.name),tt.set(F,gt))}function Ft(F,ht){const gt=c.get(ht).get(F);l.get(ht)!==gt&&(s.uniformBlockBinding(ht,gt,F.__bindingPointIndex),l.set(ht,gt))}function $t(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),u={},h={},ot=null,at={},d={},f=new WeakMap,p=[],x=null,m=!1,g=null,S=null,E=null,M=null,y=null,w=null,C=null,v=new Bt(0,0,0),T=0,L=!1,D=null,U=null,K=null,Z=null,N=null,xe.set(0,0,s.canvas.width,s.canvas.height),ee.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:q,disable:st,bindFramebuffer:ut,drawBuffers:lt,useProgram:Ot,setBlending:jt,setMaterial:Qt,setFlipSided:ne,setCullFace:he,setLineWidth:ue,setPolygonOffset:Le,setScissorTest:ye,activeTexture:De,bindTexture:O,unbindTexture:en,compressedTexImage2D:ae,compressedTexImage3D:A,texImage2D:j,texImage3D:et,pixelStorei:Ct,getParameter:pt,updateUBOMapping:Nt,uniformBlockBinding:Ft,texStorage2D:ct,texStorage3D:dt,texSubImage2D:_,texSubImage3D:z,compressedTexSubImage2D:$,compressedTexSubImage3D:J,scissor:_t,viewport:mt,reset:$t}}function Jv(s,t,e,n,i,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ft,u=new WeakMap,h=new Set;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(A,_){return p?new OffscreenCanvas(A,_):Gr("canvas")}function m(A,_,z){let $=1;const J=ae(A);if((J.width>z||J.height>z)&&($=z/Math.max(J.width,J.height)),$<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const ct=Math.floor($*J.width),dt=Math.floor($*J.height);d===void 0&&(d=x(ct,dt));const j=_?x(ct,dt):d;return j.width=ct,j.height=dt,j.getContext("2d").drawImage(A,0,0,ct,dt),Ut("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+ct+"x"+dt+")."),j}else return"data"in A&&Ut("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),A;return A}function g(A){return A.generateMipmaps}function S(A){s.generateMipmap(A)}function E(A){return A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?s.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function M(A,_,z,$,J,ct=!1){if(A!==null){if(s[A]!==void 0)return s[A];Ut("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let dt;$&&(dt=t.get("EXT_texture_norm16"),dt||Ut("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=_;if(_===s.RED&&(z===s.FLOAT&&(j=s.R32F),z===s.HALF_FLOAT&&(j=s.R16F),z===s.UNSIGNED_BYTE&&(j=s.R8),z===s.UNSIGNED_SHORT&&dt&&(j=dt.R16_EXT),z===s.SHORT&&dt&&(j=dt.R16_SNORM_EXT)),_===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(j=s.R8UI),z===s.UNSIGNED_SHORT&&(j=s.R16UI),z===s.UNSIGNED_INT&&(j=s.R32UI),z===s.BYTE&&(j=s.R8I),z===s.SHORT&&(j=s.R16I),z===s.INT&&(j=s.R32I)),_===s.RG&&(z===s.FLOAT&&(j=s.RG32F),z===s.HALF_FLOAT&&(j=s.RG16F),z===s.UNSIGNED_BYTE&&(j=s.RG8),z===s.UNSIGNED_SHORT&&dt&&(j=dt.RG16_EXT),z===s.SHORT&&dt&&(j=dt.RG16_SNORM_EXT)),_===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&(j=s.RG8UI),z===s.UNSIGNED_SHORT&&(j=s.RG16UI),z===s.UNSIGNED_INT&&(j=s.RG32UI),z===s.BYTE&&(j=s.RG8I),z===s.SHORT&&(j=s.RG16I),z===s.INT&&(j=s.RG32I)),_===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&(j=s.RGB8UI),z===s.UNSIGNED_SHORT&&(j=s.RGB16UI),z===s.UNSIGNED_INT&&(j=s.RGB32UI),z===s.BYTE&&(j=s.RGB8I),z===s.SHORT&&(j=s.RGB16I),z===s.INT&&(j=s.RGB32I)),_===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&(j=s.RGBA8UI),z===s.UNSIGNED_SHORT&&(j=s.RGBA16UI),z===s.UNSIGNED_INT&&(j=s.RGBA32UI),z===s.BYTE&&(j=s.RGBA8I),z===s.SHORT&&(j=s.RGBA16I),z===s.INT&&(j=s.RGBA32I)),_===s.RGB&&(z===s.UNSIGNED_SHORT&&dt&&(j=dt.RGB16_EXT),z===s.SHORT&&dt&&(j=dt.RGB16_SNORM_EXT),z===s.UNSIGNED_INT_5_9_9_9_REV&&(j=s.RGB9_E5),z===s.UNSIGNED_INT_10F_11F_11F_REV&&(j=s.R11F_G11F_B10F)),_===s.RGBA){const et=ct?Hr:Jt.getTransfer(J);z===s.FLOAT&&(j=s.RGBA32F),z===s.HALF_FLOAT&&(j=s.RGBA16F),z===s.UNSIGNED_BYTE&&(j=et===se?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT&&dt&&(j=dt.RGBA16_EXT),z===s.SHORT&&dt&&(j=dt.RGBA16_SNORM_EXT),z===s.UNSIGNED_SHORT_4_4_4_4&&(j=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(j=s.RGB5_A1)}return(j===s.R16F||j===s.R32F||j===s.RG16F||j===s.RG32F||j===s.RGBA16F||j===s.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function y(A,_){let z;return A?_===null||_===Nn||_===js?z=s.DEPTH24_STENCIL8:_===_n?z=s.DEPTH32F_STENCIL8:_===Js&&(z=s.DEPTH24_STENCIL8,Ut("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Nn||_===js?z=s.DEPTH_COMPONENT24:_===_n?z=s.DEPTH_COMPONENT32F:_===Js&&(z=s.DEPTH_COMPONENT16),z}function w(A,_){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==ze&&A.minFilter!==He?Math.log2(Math.max(_.width,_.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?_.mipmaps.length:1}function C(A){const _=A.target;_.removeEventListener("dispose",C),T(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&h.delete(_)}function v(A){const _=A.target;_.removeEventListener("dispose",v),D(_)}function T(A){const _=n.get(A);if(_.__webglInit===void 0)return;const z=A.source,$=f.get(z);if($){const J=$[_.__cacheKey];J.usedTimes--,J.usedTimes===0&&L(A),Object.keys($).length===0&&f.delete(z)}n.remove(A)}function L(A){const _=n.get(A);s.deleteTexture(_.__webglTexture);const z=A.source,$=f.get(z);delete $[_.__cacheKey],o.memory.textures--}function D(A){const _=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(_.__webglFramebuffer[$]))for(let J=0;J<_.__webglFramebuffer[$].length;J++)s.deleteFramebuffer(_.__webglFramebuffer[$][J]);else s.deleteFramebuffer(_.__webglFramebuffer[$]);_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer[$])}else{if(Array.isArray(_.__webglFramebuffer))for(let $=0;$<_.__webglFramebuffer.length;$++)s.deleteFramebuffer(_.__webglFramebuffer[$]);else s.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&s.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let $=0;$<_.__webglColorRenderbuffer.length;$++)_.__webglColorRenderbuffer[$]&&s.deleteRenderbuffer(_.__webglColorRenderbuffer[$]);_.__webglDepthRenderbuffer&&s.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const z=A.textures;for(let $=0,J=z.length;$<J;$++){const ct=n.get(z[$]);ct.__webglTexture&&(s.deleteTexture(ct.__webglTexture),o.memory.textures--),n.remove(z[$])}n.remove(A)}let U=0;function K(){U=0}function Z(){return U}function N(A){U=A}function W(){const A=U;return A>=i.maxTextures&&Ut("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),U+=1,A}function B(A){const _=[];return _.push(A.wrapS),_.push(A.wrapT),_.push(A.wrapR||0),_.push(A.magFilter),_.push(A.minFilter),_.push(A.anisotropy),_.push(A.internalFormat),_.push(A.format),_.push(A.type),_.push(A.generateMipmaps),_.push(A.premultiplyAlpha),_.push(A.flipY),_.push(A.unpackAlignment),_.push(A.colorSpace),_.join()}function X(A,_){const z=n.get(A);if(A.isVideoTexture&&O(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&z.__version!==A.version){const $=A.image;if($===null)Ut("WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)Ut("WebGLRenderer: Texture marked for update but image is incomplete");else{st(z,A,_);return}}else A.isExternalTexture&&(z.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+_)}function nt(A,_){const z=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&z.__version!==A.version){st(z,A,_);return}else A.isExternalTexture&&(z.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+_)}function ot(A,_){const z=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&z.__version!==A.version){st(z,A,_);return}e.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+_)}function at(A,_){const z=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&z.__version!==A.version){ut(z,A,_);return}e.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+_)}const xt={[Ir]:s.REPEAT,[Yn]:s.CLAMP_TO_EDGE,[ba]:s.MIRRORED_REPEAT},Gt={[ze]:s.NEAREST,[mp]:s.NEAREST_MIPMAP_NEAREST,[Nr]:s.NEAREST_MIPMAP_LINEAR,[He]:s.LINEAR,[Sa]:s.LINEAR_MIPMAP_NEAREST,[zi]:s.LINEAR_MIPMAP_LINEAR},xe={[vp]:s.NEVER,[Sp]:s.ALWAYS,[_p]:s.LESS,[ll]:s.LEQUAL,[Mp]:s.EQUAL,[cl]:s.GEQUAL,[yp]:s.GREATER,[bp]:s.NOTEQUAL};function ee(A,_){if(_.type===_n&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===He||_.magFilter===Sa||_.magFilter===Nr||_.magFilter===zi||_.minFilter===He||_.minFilter===Sa||_.minFilter===Nr||_.minFilter===zi)&&Ut("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(A,s.TEXTURE_WRAP_S,xt[_.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,xt[_.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,xt[_.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,Gt[_.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,Gt[_.minFilter]),_.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,xe[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===ze||_.minFilter!==Nr&&_.minFilter!==zi||_.type===_n&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");s.texParameterf(A,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,i.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Q(A,_){let z=!1;A.__webglInit===void 0&&(A.__webglInit=!0,_.addEventListener("dispose",C));const $=_.source;let J=f.get($);J===void 0&&(J={},f.set($,J));const ct=B(_);if(ct!==A.__cacheKey){J[ct]===void 0&&(J[ct]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,z=!0),J[ct].usedTimes++;const dt=J[A.__cacheKey];dt!==void 0&&(J[A.__cacheKey].usedTimes--,dt.usedTimes===0&&L(_)),A.__cacheKey=ct,A.__webglTexture=J[ct].texture}return z}function I(A,_,z){return Math.floor(Math.floor(A/z)/_)}function q(A,_,z,$){const ct=A.updateRanges;if(ct.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,_.width,_.height,z,$,_.data);else{ct.sort((Ct,_t)=>Ct.start-_t.start);let dt=0;for(let Ct=1;Ct<ct.length;Ct++){const _t=ct[dt],mt=ct[Ct],Nt=_t.start+_t.count,Ft=I(mt.start,_.width,4),$t=I(_t.start,_.width,4);mt.start<=Nt+1&&Ft===$t&&I(mt.start+mt.count-1,_.width,4)===Ft?_t.count=Math.max(_t.count,mt.start+mt.count-_t.start):(++dt,ct[dt]=mt)}ct.length=dt+1;const j=e.getParameter(s.UNPACK_ROW_LENGTH),et=e.getParameter(s.UNPACK_SKIP_PIXELS),pt=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,_.width);for(let Ct=0,_t=ct.length;Ct<_t;Ct++){const mt=ct[Ct],Nt=Math.floor(mt.start/4),Ft=Math.ceil(mt.count/4),$t=Nt%_.width,F=Math.floor(Nt/_.width),ht=Ft,tt=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,$t),e.pixelStorei(s.UNPACK_SKIP_ROWS,F),e.texSubImage2D(s.TEXTURE_2D,0,$t,F,ht,tt,z,$,_.data)}A.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,j),e.pixelStorei(s.UNPACK_SKIP_PIXELS,et),e.pixelStorei(s.UNPACK_SKIP_ROWS,pt)}}function st(A,_,z){let $=s.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&($=s.TEXTURE_2D_ARRAY),_.isData3DTexture&&($=s.TEXTURE_3D);const J=Q(A,_),ct=_.source;e.bindTexture($,A.__webglTexture,s.TEXTURE0+z);const dt=n.get(ct);if(ct.version!==dt.__version||J===!0){if(e.activeTexture(s.TEXTURE0+z),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const tt=Jt.getPrimaries(Jt.workingColorSpace),gt=_.colorSpace===fi?null:Jt.getPrimaries(_.colorSpace),bt=_.colorSpace===fi||tt===gt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt)}e.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment);let et=m(_.image,!1,i.maxTextureSize);et=en(_,et);const pt=r.convert(_.format,_.colorSpace),Ct=r.convert(_.type);let _t=M(_.internalFormat,pt,Ct,_.normalized,_.colorSpace,_.isVideoTexture);ee($,_);let mt;const Nt=_.mipmaps,Ft=_.isVideoTexture!==!0,$t=dt.__version===void 0||J===!0,F=ct.dataReady,ht=w(_,et);if(_.isDepthTexture)_t=y(_.format===Hi,_.type),$t&&(Ft?e.texStorage2D(s.TEXTURE_2D,1,_t,et.width,et.height):e.texImage2D(s.TEXTURE_2D,0,_t,et.width,et.height,0,pt,Ct,null));else if(_.isDataTexture)if(Nt.length>0){Ft&&$t&&e.texStorage2D(s.TEXTURE_2D,ht,_t,Nt[0].width,Nt[0].height);for(let tt=0,gt=Nt.length;tt<gt;tt++)mt=Nt[tt],Ft?F&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,mt.width,mt.height,pt,Ct,mt.data):e.texImage2D(s.TEXTURE_2D,tt,_t,mt.width,mt.height,0,pt,Ct,mt.data);_.generateMipmaps=!1}else Ft?($t&&e.texStorage2D(s.TEXTURE_2D,ht,_t,et.width,et.height),F&&q(_,et,pt,Ct)):e.texImage2D(s.TEXTURE_2D,0,_t,et.width,et.height,0,pt,Ct,et.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Ft&&$t&&e.texStorage3D(s.TEXTURE_2D_ARRAY,ht,_t,Nt[0].width,Nt[0].height,et.depth);for(let tt=0,gt=Nt.length;tt<gt;tt++)if(mt=Nt[tt],_.format!==Mn)if(pt!==null)if(Ft){if(F)if(_.layerUpdates.size>0){const bt=uu(mt.width,mt.height,_.format,_.type);for(const it of _.layerUpdates){const At=mt.data.subarray(it*bt/mt.data.BYTES_PER_ELEMENT,(it+1)*bt/mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,it,mt.width,mt.height,1,pt,At)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,0,mt.width,mt.height,et.depth,pt,mt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,tt,_t,mt.width,mt.height,et.depth,0,mt.data,0,0);else Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ft?F&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,0,mt.width,mt.height,et.depth,pt,Ct,mt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,tt,_t,mt.width,mt.height,et.depth,0,pt,Ct,mt.data)}else{Ft&&$t&&e.texStorage2D(s.TEXTURE_2D,ht,_t,Nt[0].width,Nt[0].height);for(let tt=0,gt=Nt.length;tt<gt;tt++)mt=Nt[tt],_.format!==Mn?pt!==null?Ft?F&&e.compressedTexSubImage2D(s.TEXTURE_2D,tt,0,0,mt.width,mt.height,pt,mt.data):e.compressedTexImage2D(s.TEXTURE_2D,tt,_t,mt.width,mt.height,0,mt.data):Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ft?F&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,mt.width,mt.height,pt,Ct,mt.data):e.texImage2D(s.TEXTURE_2D,tt,_t,mt.width,mt.height,0,pt,Ct,mt.data)}else if(_.isDataArrayTexture)if(Ft){if($t&&e.texStorage3D(s.TEXTURE_2D_ARRAY,ht,_t,et.width,et.height,et.depth),F)if(_.layerUpdates.size>0){const tt=uu(et.width,et.height,_.format,_.type);for(const gt of _.layerUpdates){const bt=et.data.subarray(gt*tt/et.data.BYTES_PER_ELEMENT,(gt+1)*tt/et.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,gt,et.width,et.height,1,pt,Ct,bt)}_.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,pt,Ct,et.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,_t,et.width,et.height,et.depth,0,pt,Ct,et.data);else if(_.isData3DTexture)Ft?($t&&e.texStorage3D(s.TEXTURE_3D,ht,_t,et.width,et.height,et.depth),F&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,pt,Ct,et.data)):e.texImage3D(s.TEXTURE_3D,0,_t,et.width,et.height,et.depth,0,pt,Ct,et.data);else if(_.isFramebufferTexture){if($t)if(Ft)e.texStorage2D(s.TEXTURE_2D,ht,_t,et.width,et.height);else{let tt=et.width,gt=et.height;for(let bt=0;bt<ht;bt++)e.texImage2D(s.TEXTURE_2D,bt,_t,tt,gt,0,pt,Ct,null),tt>>=1,gt>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in s){const tt=s.canvas;if(tt.hasAttribute("layoutsubtree")||tt.setAttribute("layoutsubtree","true"),et.parentNode!==tt){tt.appendChild(et),h.add(_),tt.onpaint=gt=>{const bt=gt.changedElements;for(const it of h)bt.includes(it.image)&&(it.needsUpdate=!0)},tt.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,et);else{const bt=s.RGBA,it=s.RGBA,At=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,bt,it,At,et)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Nt.length>0){if(Ft&&$t){const tt=ae(Nt[0]);e.texStorage2D(s.TEXTURE_2D,ht,_t,tt.width,tt.height)}for(let tt=0,gt=Nt.length;tt<gt;tt++)mt=Nt[tt],Ft?F&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,pt,Ct,mt):e.texImage2D(s.TEXTURE_2D,tt,_t,pt,Ct,mt);_.generateMipmaps=!1}else if(Ft){if($t){const tt=ae(et);e.texStorage2D(s.TEXTURE_2D,ht,_t,tt.width,tt.height)}F&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,pt,Ct,et)}else e.texImage2D(s.TEXTURE_2D,0,_t,pt,Ct,et);g(_)&&S($),dt.__version=ct.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function ut(A,_,z){if(_.image.length!==6)return;const $=Q(A,_),J=_.source;e.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+z);const ct=n.get(J);if(J.version!==ct.__version||$===!0){e.activeTexture(s.TEXTURE0+z);const dt=Jt.getPrimaries(Jt.workingColorSpace),j=_.colorSpace===fi?null:Jt.getPrimaries(_.colorSpace),et=_.colorSpace===fi||dt===j?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,et);const pt=_.isCompressedTexture||_.image[0].isCompressedTexture,Ct=_.image[0]&&_.image[0].isDataTexture,_t=[];for(let it=0;it<6;it++)!pt&&!Ct?_t[it]=m(_.image[it],!0,i.maxCubemapSize):_t[it]=Ct?_.image[it].image:_.image[it],_t[it]=en(_,_t[it]);const mt=_t[0],Nt=r.convert(_.format,_.colorSpace),Ft=r.convert(_.type),$t=M(_.internalFormat,Nt,Ft,_.normalized,_.colorSpace),F=_.isVideoTexture!==!0,ht=ct.__version===void 0||$===!0,tt=J.dataReady;let gt=w(_,mt);ee(s.TEXTURE_CUBE_MAP,_);let bt;if(pt){F&&ht&&e.texStorage2D(s.TEXTURE_CUBE_MAP,gt,$t,mt.width,mt.height);for(let it=0;it<6;it++){bt=_t[it].mipmaps;for(let At=0;At<bt.length;At++){const Et=bt[At];_.format!==Mn?Nt!==null?F?tt&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At,0,0,Et.width,Et.height,Nt,Et.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At,$t,Et.width,Et.height,0,Et.data):Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At,0,0,Et.width,Et.height,Nt,Ft,Et.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At,$t,Et.width,Et.height,0,Nt,Ft,Et.data)}}}else{if(bt=_.mipmaps,F&&ht){bt.length>0&&gt++;const it=ae(_t[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,gt,$t,it.width,it.height)}for(let it=0;it<6;it++)if(Ct){F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,_t[it].width,_t[it].height,Nt,Ft,_t[it].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,$t,_t[it].width,_t[it].height,0,Nt,Ft,_t[it].data);for(let At=0;At<bt.length;At++){const be=bt[At].image[it].image;F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At+1,0,0,be.width,be.height,Nt,Ft,be.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At+1,$t,be.width,be.height,0,Nt,Ft,be.data)}}else{F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,Nt,Ft,_t[it]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,$t,Nt,Ft,_t[it]);for(let At=0;At<bt.length;At++){const Et=bt[At];F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At+1,0,0,Nt,Ft,Et.image[it]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,At+1,$t,Nt,Ft,Et.image[it])}}}g(_)&&S(s.TEXTURE_CUBE_MAP),ct.__version=J.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function lt(A,_,z,$,J,ct){const dt=r.convert(z.format,z.colorSpace),j=r.convert(z.type),et=M(z.internalFormat,dt,j,z.normalized,z.colorSpace),pt=n.get(_),Ct=n.get(z);if(Ct.__renderTarget=_,!pt.__hasExternalTextures){const _t=Math.max(1,_.width>>ct),mt=Math.max(1,_.height>>ct);J===s.TEXTURE_3D||J===s.TEXTURE_2D_ARRAY?e.texImage3D(J,ct,et,_t,mt,_.depth,0,dt,j,null):e.texImage2D(J,ct,et,_t,mt,0,dt,j,null)}e.bindFramebuffer(s.FRAMEBUFFER,A),De(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,$,J,Ct.__webglTexture,0,ye(_)):(J===s.TEXTURE_2D||J>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,$,J,Ct.__webglTexture,ct),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Ot(A,_,z){if(s.bindRenderbuffer(s.RENDERBUFFER,A),_.depthBuffer){const $=_.depthTexture,J=$&&$.isDepthTexture?$.type:null,ct=y(_.stencilBuffer,J),dt=_.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;De(_)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ye(_),ct,_.width,_.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,ye(_),ct,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,ct,_.width,_.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,dt,s.RENDERBUFFER,A)}else{const $=_.textures;for(let J=0;J<$.length;J++){const ct=$[J],dt=r.convert(ct.format,ct.colorSpace),j=r.convert(ct.type),et=M(ct.internalFormat,dt,j,ct.normalized,ct.colorSpace);De(_)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ye(_),et,_.width,_.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,ye(_),et,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,et,_.width,_.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Dt(A,_,z){const $=_.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,A),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const J=n.get(_.depthTexture);if(J.__renderTarget=_,(!J.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),$){if(J.__webglInit===void 0&&(J.__webglInit=!0,_.depthTexture.addEventListener("dispose",C)),J.__webglTexture===void 0){J.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,J.__webglTexture),ee(s.TEXTURE_CUBE_MAP,_.depthTexture);const pt=r.convert(_.depthTexture.format),Ct=r.convert(_.depthTexture.type);let _t;_.depthTexture.format===Kn?_t=s.DEPTH_COMPONENT24:_.depthTexture.format===Hi&&(_t=s.DEPTH24_STENCIL8);for(let mt=0;mt<6;mt++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,_t,_.width,_.height,0,pt,Ct,null)}}else X(_.depthTexture,0);const ct=J.__webglTexture,dt=ye(_),j=$?s.TEXTURE_CUBE_MAP_POSITIVE_X+z:s.TEXTURE_2D,et=_.depthTexture.format===Hi?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(_.depthTexture.format===Kn)De(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,et,j,ct,0,dt):s.framebufferTexture2D(s.FRAMEBUFFER,et,j,ct,0);else if(_.depthTexture.format===Hi)De(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,et,j,ct,0,dt):s.framebufferTexture2D(s.FRAMEBUFFER,et,j,ct,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Vt(A){const _=n.get(A),z=A.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==A.depthTexture){const $=A.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),$){const J=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,$.removeEventListener("dispose",J)};$.addEventListener("dispose",J),_.__depthDisposeCallback=J}_.__boundDepthTexture=$}if(A.depthTexture&&!_.__autoAllocateDepthBuffer)if(z)for(let $=0;$<6;$++)Dt(_.__webglFramebuffer[$],A,$);else{const $=A.texture.mipmaps;$&&$.length>0?Dt(_.__webglFramebuffer[0],A,0):Dt(_.__webglFramebuffer,A,0)}else if(z){_.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[$]),_.__webglDepthbuffer[$]===void 0)_.__webglDepthbuffer[$]=s.createRenderbuffer(),Ot(_.__webglDepthbuffer[$],A,!1);else{const J=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ct=_.__webglDepthbuffer[$];s.bindRenderbuffer(s.RENDERBUFFER,ct),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,ct)}}else{const $=A.texture.mipmaps;if($&&$.length>0?e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=s.createRenderbuffer(),Ot(_.__webglDepthbuffer,A,!1);else{const J=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ct=_.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ct),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,ct)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function jt(A,_,z){const $=n.get(A);_!==void 0&&lt($.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&Vt(A)}function Qt(A){const _=A.texture,z=n.get(A),$=n.get(_);A.addEventListener("dispose",v);const J=A.textures,ct=A.isWebGLCubeRenderTarget===!0,dt=J.length>1;if(dt||($.__webglTexture===void 0&&($.__webglTexture=s.createTexture()),$.__version=_.version,o.memory.textures++),ct){z.__webglFramebuffer=[];for(let j=0;j<6;j++)if(_.mipmaps&&_.mipmaps.length>0){z.__webglFramebuffer[j]=[];for(let et=0;et<_.mipmaps.length;et++)z.__webglFramebuffer[j][et]=s.createFramebuffer()}else z.__webglFramebuffer[j]=s.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){z.__webglFramebuffer=[];for(let j=0;j<_.mipmaps.length;j++)z.__webglFramebuffer[j]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(dt)for(let j=0,et=J.length;j<et;j++){const pt=n.get(J[j]);pt.__webglTexture===void 0&&(pt.__webglTexture=s.createTexture(),o.memory.textures++)}if(A.samples>0&&De(A)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let j=0;j<J.length;j++){const et=J[j];z.__webglColorRenderbuffer[j]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[j]);const pt=r.convert(et.format,et.colorSpace),Ct=r.convert(et.type),_t=M(et.internalFormat,pt,Ct,et.normalized,et.colorSpace,A.isXRRenderTarget===!0),mt=ye(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,mt,_t,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+j,s.RENDERBUFFER,z.__webglColorRenderbuffer[j])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),Ot(z.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ct){e.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture),ee(s.TEXTURE_CUBE_MAP,_);for(let j=0;j<6;j++)if(_.mipmaps&&_.mipmaps.length>0)for(let et=0;et<_.mipmaps.length;et++)lt(z.__webglFramebuffer[j][et],A,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+j,et);else lt(z.__webglFramebuffer[j],A,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);g(_)&&S(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(dt){for(let j=0,et=J.length;j<et;j++){const pt=J[j],Ct=n.get(pt);let _t=s.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(_t=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(_t,Ct.__webglTexture),ee(_t,pt),lt(z.__webglFramebuffer,A,pt,s.COLOR_ATTACHMENT0+j,_t,0),g(pt)&&S(_t)}e.unbindTexture()}else{let j=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(j=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(j,$.__webglTexture),ee(j,_),_.mipmaps&&_.mipmaps.length>0)for(let et=0;et<_.mipmaps.length;et++)lt(z.__webglFramebuffer[et],A,_,s.COLOR_ATTACHMENT0,j,et);else lt(z.__webglFramebuffer,A,_,s.COLOR_ATTACHMENT0,j,0);g(_)&&S(j),e.unbindTexture()}A.depthBuffer&&Vt(A)}function ne(A){const _=A.textures;for(let z=0,$=_.length;z<$;z++){const J=_[z];if(g(J)){const ct=E(A),dt=n.get(J).__webglTexture;e.bindTexture(ct,dt),S(ct),e.unbindTexture()}}}const he=[],ue=[];function Le(A){if(A.samples>0){if(De(A)===!1){const _=A.textures,z=A.width,$=A.height;let J=s.COLOR_BUFFER_BIT;const ct=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,dt=n.get(A),j=_.length>1;if(j)for(let pt=0;pt<_.length;pt++)e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,dt.__webglMultisampledFramebuffer);const et=A.texture.mipmaps;et&&et.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,dt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,dt.__webglFramebuffer);for(let pt=0;pt<_.length;pt++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(J|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(J|=s.STENCIL_BUFFER_BIT)),j){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,dt.__webglColorRenderbuffer[pt]);const Ct=n.get(_[pt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ct,0)}s.blitFramebuffer(0,0,z,$,0,0,z,$,J,s.NEAREST),l===!0&&(he.length=0,ue.length=0,he.push(s.COLOR_ATTACHMENT0+pt),A.depthBuffer&&A.resolveDepthBuffer===!1&&(he.push(ct),ue.push(ct),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,ue)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,he))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),j)for(let pt=0;pt<_.length;pt++){e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.RENDERBUFFER,dt.__webglColorRenderbuffer[pt]);const Ct=n.get(_[pt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.TEXTURE_2D,Ct,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,dt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const _=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[_])}}}function ye(A){return Math.min(i.maxSamples,A.samples)}function De(A){const _=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function O(A){const _=o.render.frame;u.get(A)!==_&&(u.set(A,_),A.update())}function en(A,_){const z=A.colorSpace,$=A.format,J=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||z!==Qs&&z!==fi&&(Jt.getTransfer(z)===se?($!==Mn||J!==nn)&&Ut("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):te("WebGLTextures: Unsupported texture color space:",z)),_}function ae(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=K,this.getTextureUnits=Z,this.setTextureUnits=N,this.setTexture2D=X,this.setTexture2DArray=nt,this.setTexture3D=ot,this.setTextureCube=at,this.rebindTextures=jt,this.setupRenderTarget=Qt,this.updateRenderTargetMipmap=ne,this.updateMultisampleRenderTarget=Le,this.setupDepthRenderbuffer=Vt,this.setupFrameBufferTexture=lt,this.useMultisampledRTT=De,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function jv(s,t){function e(n,i=fi){let r;const o=Jt.getTransfer(i);if(n===nn)return s.UNSIGNED_BYTE;if(n===Ea)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Ta)return s.UNSIGNED_SHORT_5_5_5_1;if(n===ch)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===hh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===ah)return s.BYTE;if(n===lh)return s.SHORT;if(n===Js)return s.UNSIGNED_SHORT;if(n===wa)return s.INT;if(n===Nn)return s.UNSIGNED_INT;if(n===_n)return s.FLOAT;if(n===sn)return s.HALF_FLOAT;if(n===uh)return s.ALPHA;if(n===dh)return s.RGB;if(n===Mn)return s.RGBA;if(n===Kn)return s.DEPTH_COMPONENT;if(n===Hi)return s.DEPTH_STENCIL;if(n===Aa)return s.RED;if(n===Ca)return s.RED_INTEGER;if(n===Gi)return s.RG;if(n===Ra)return s.RG_INTEGER;if(n===Pa)return s.RGBA_INTEGER;if(n===Ur||n===Fr||n===Or||n===kr)if(o===se)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ur)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Fr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Or)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ur)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Fr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Or)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===kr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===La||n===Da||n===Ia||n===Na)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===La)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Da)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ia)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Na)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ua||n===Fa||n===Oa||n===ka||n===Ba||n===Br||n===za)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ua||n===Fa)return o===se?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Oa)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===ka)return r.COMPRESSED_R11_EAC;if(n===Ba)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Br)return r.COMPRESSED_RG11_EAC;if(n===za)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ha||n===Ga||n===Va||n===Wa||n===$a||n===Xa||n===qa||n===Ya||n===Ka||n===Za||n===Ja||n===ja||n===Qa||n===tl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ha)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ga)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Va)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wa)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===$a)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Xa)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===qa)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ya)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ka)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Za)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ja)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ja)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Qa)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===tl)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===el||n===nl||n===il)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===el)return o===se?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===nl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===il)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===sl||n===rl||n===zr||n===ol)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===sl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===rl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===zr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ol)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===js?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}const Qv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,t_=`
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

}`;class e_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new qh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Ie({vertexShader:Qv,fragmentShader:t_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new zt(new Ze(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class n_ extends pi{constructor(t,e){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,p=null;const x=typeof XRWebGLBinding<"u",m=new e_,g={},S=e.getContextAttributes();let E=null,M=null;const y=[],w=[],C=new ft;let v=null;const T=new Qe;T.viewport=new ve;const L=new Qe;L.viewport=new ve;const D=[T,L],U=new Hm;let K=null,Z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let I=y[Q];return I===void 0&&(I=new vl,y[Q]=I),I.getTargetRaySpace()},this.getControllerGrip=function(Q){let I=y[Q];return I===void 0&&(I=new vl,y[Q]=I),I.getGripSpace()},this.getHand=function(Q){let I=y[Q];return I===void 0&&(I=new vl,y[Q]=I),I.getHandSpace()};function N(Q){const I=w.indexOf(Q.inputSource);if(I===-1)return;const q=y[I];q!==void 0&&(q.update(Q.inputSource,Q.frame,c||o),q.dispatchEvent({type:Q.type,data:Q.inputSource}))}function W(){i.removeEventListener("select",N),i.removeEventListener("selectstart",N),i.removeEventListener("selectend",N),i.removeEventListener("squeeze",N),i.removeEventListener("squeezestart",N),i.removeEventListener("squeezeend",N),i.removeEventListener("end",W),i.removeEventListener("inputsourceschange",B);for(let Q=0;Q<y.length;Q++){const I=w[Q];I!==null&&(w[Q]=null,y[Q].disconnect(I))}K=null,Z=null,m.reset();for(const Q in g)delete g[Q];t.setRenderTarget(E),f=null,d=null,h=null,i=null,M=null,ee.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,n.isPresenting===!0&&Ut("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){a=Q,n.isPresenting===!0&&Ut("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&x&&(h=new XRWebGLBinding(i,e)),h},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(Q){if(i=Q,i!==null){if(E=t.getRenderTarget(),i.addEventListener("select",N),i.addEventListener("selectstart",N),i.addEventListener("selectend",N),i.addEventListener("squeeze",N),i.addEventListener("squeezestart",N),i.addEventListener("squeezeend",N),i.addEventListener("end",W),i.addEventListener("inputsourceschange",B),S.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let q=null,st=null,ut=null;S.depth&&(ut=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,q=S.stencil?Hi:Kn,st=S.stencil?js:Nn);const lt={colorFormat:e.RGBA8,depthFormat:ut,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(lt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),M=new je(d.textureWidth,d.textureHeight,{format:Mn,type:nn,depthTexture:new Ls(d.textureWidth,d.textureHeight,st,void 0,void 0,void 0,void 0,void 0,void 0,q),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const q={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,q),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new je(f.framebufferWidth,f.framebufferHeight,{format:Mn,type:nn,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),ee.setContext(i),ee.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function B(Q){for(let I=0;I<Q.removed.length;I++){const q=Q.removed[I],st=w.indexOf(q);st>=0&&(w[st]=null,y[st].disconnect(q))}for(let I=0;I<Q.added.length;I++){const q=Q.added[I];let st=w.indexOf(q);if(st===-1){for(let lt=0;lt<y.length;lt++)if(lt>=w.length){w.push(q),st=lt;break}else if(w[lt]===null){w[lt]=q,st=lt;break}if(st===-1)break}const ut=y[st];ut&&ut.connect(q)}}const X=new P,nt=new P;function ot(Q,I,q){X.setFromMatrixPosition(I.matrixWorld),nt.setFromMatrixPosition(q.matrixWorld);const st=X.distanceTo(nt),ut=I.projectionMatrix.elements,lt=q.projectionMatrix.elements,Ot=ut[14]/(ut[10]-1),Dt=ut[14]/(ut[10]+1),Vt=(ut[9]+1)/ut[5],jt=(ut[9]-1)/ut[5],Qt=(ut[8]-1)/ut[0],ne=(lt[8]+1)/lt[0],he=Ot*Qt,ue=Ot*ne,Le=st/(-Qt+ne),ye=Le*-Qt;if(I.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(ye),Q.translateZ(Le),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),ut[10]===-1)Q.projectionMatrix.copy(I.projectionMatrix),Q.projectionMatrixInverse.copy(I.projectionMatrixInverse);else{const De=Ot+Le,O=Dt+Le,en=he-ye,ae=ue+(st-ye),A=Vt*Dt/O*De,_=jt*Dt/O*De;Q.projectionMatrix.makePerspective(en,ae,A,_,De,O),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function at(Q,I){I===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(I.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(i===null)return;let I=Q.near,q=Q.far;m.texture!==null&&(m.depthNear>0&&(I=m.depthNear),m.depthFar>0&&(q=m.depthFar)),U.near=L.near=T.near=I,U.far=L.far=T.far=q,(K!==U.near||Z!==U.far)&&(i.updateRenderState({depthNear:U.near,depthFar:U.far}),K=U.near,Z=U.far),U.layers.mask=Q.layers.mask|6,T.layers.mask=U.layers.mask&-5,L.layers.mask=U.layers.mask&-3;const st=Q.parent,ut=U.cameras;at(U,st);for(let lt=0;lt<ut.length;lt++)at(ut[lt],st);ut.length===2?ot(U,T,L):U.projectionMatrix.copy(T.projectionMatrix),xt(Q,U,st)};function xt(Q,I,q){q===null?Q.matrix.copy(I.matrixWorld):(Q.matrix.copy(q.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(I.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(I.projectionMatrix),Q.projectionMatrixInverse.copy(I.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=ps*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Q){l=Q,d!==null&&(d.fixedFoveation=Q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(U)},this.getCameraTexture=function(Q){return g[Q]};let Gt=null;function xe(Q,I){if(u=I.getViewerPose(c||o),p=I,u!==null){const q=u.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let st=!1;q.length!==U.cameras.length&&(U.cameras.length=0,st=!0);for(let Dt=0;Dt<q.length;Dt++){const Vt=q[Dt];let jt=null;if(f!==null)jt=f.getViewport(Vt);else{const ne=h.getViewSubImage(d,Vt);jt=ne.viewport,Dt===0&&(t.setRenderTargetTextures(M,ne.colorTexture,ne.depthStencilTexture),t.setRenderTarget(M))}let Qt=D[Dt];Qt===void 0&&(Qt=new Qe,Qt.layers.enable(Dt),Qt.viewport=new ve,D[Dt]=Qt),Qt.matrix.fromArray(Vt.transform.matrix),Qt.matrix.decompose(Qt.position,Qt.quaternion,Qt.scale),Qt.projectionMatrix.fromArray(Vt.projectionMatrix),Qt.projectionMatrixInverse.copy(Qt.projectionMatrix).invert(),Qt.viewport.set(jt.x,jt.y,jt.width,jt.height),Dt===0&&(U.matrix.copy(Qt.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),st===!0&&U.cameras.push(Qt)}const ut=i.enabledFeatures;if(ut&&ut.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&x){h=n.getBinding();const Dt=h.getDepthInformation(q[0]);Dt&&Dt.isValid&&Dt.texture&&m.init(Dt,i.renderState)}if(ut&&ut.includes("camera-access")&&x){t.state.unbindTexture(),h=n.getBinding();for(let Dt=0;Dt<q.length;Dt++){const Vt=q[Dt].camera;if(Vt){let jt=g[Vt];jt||(jt=new qh,g[Vt]=jt);const Qt=h.getCameraImage(Vt);jt.sourceTexture=Qt}}}}for(let q=0;q<y.length;q++){const st=w[q],ut=y[q];st!==null&&ut!==void 0&&ut.update(st,I,c||o)}Gt&&Gt(Q,I),I.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:I}),p=null}const ee=new du;ee.setAnimationLoop(xe),this.setAnimationLoop=function(Q){Gt=Q},this.dispose=function(){}}}const i_=new re,Gu=new Ht;Gu.set(-1,0,0,0,1,0,0,0,1);function s_(s,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,eu(s)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,S,E,M){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),h(m,g)):g.isMeshPhongMaterial?(r(m,g),u(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,M)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),x(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(o(m,g),g.isLineDashedMaterial&&a(m,g)):g.isPointsMaterial?l(m,g,S,E):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===Ye&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===Ye&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const S=t.get(g),E=S.envMap,M=S.envMapRotation;E&&(m.envMap.value=E,m.envMapRotation.value.setFromMatrix4(i_.makeRotationFromEuler(M)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Gu),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function o(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function a(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,S,E){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*S,m.scale.value=E*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function u(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function h(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,S){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Ye&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function x(m,g){const S=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function r_(s,t,e,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,y){const w=y.program;n.uniformBlockBinding(M,w)}function c(M,y){let w=i[M.id];w===void 0&&(m(M),w=u(M),i[M.id]=w,M.addEventListener("dispose",S));const C=y.program;n.updateUBOMapping(M,C);const v=t.render.frame;r[M.id]!==v&&(d(M),r[M.id]=v)}function u(M){const y=h();M.__bindingPointIndex=y;const w=s.createBuffer(),C=M.__size,v=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,w),s.bufferData(s.UNIFORM_BUFFER,C,v),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,y,w),w}function h(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return te("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const y=i[M.id],w=M.uniforms,C=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,y);for(let v=0,T=w.length;v<T;v++){const L=w[v];if(Array.isArray(L))for(let D=0,U=L.length;D<U;D++)f(L[D],v,D,C);else f(L,v,0,C)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,y,w,C){if(x(M,y,w,C)===!0){const v=M.__offset,T=M.value;if(Array.isArray(T)){let L=0;for(let D=0;D<T.length;D++){const U=T[D],K=g(U);p(U,M.__data,L),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(L+=K.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(T,M.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,v,M.__data)}}function p(M,y,w){typeof M=="number"||typeof M=="boolean"?y[0]=M:M.isMatrix3?(y[0]=M.elements[0],y[1]=M.elements[1],y[2]=M.elements[2],y[3]=0,y[4]=M.elements[3],y[5]=M.elements[4],y[6]=M.elements[5],y[7]=0,y[8]=M.elements[6],y[9]=M.elements[7],y[10]=M.elements[8],y[11]=0):ArrayBuffer.isView(M)?y.set(new M.constructor(M.buffer,M.byteOffset,y.length)):M.toArray(y,w)}function x(M,y,w,C){const v=M.value,T=y+"_"+w;if(C[T]===void 0)return typeof v=="number"||typeof v=="boolean"?C[T]=v:ArrayBuffer.isView(v)?C[T]=v.slice():C[T]=v.clone(),!0;{const L=C[T];if(typeof v=="number"||typeof v=="boolean"){if(L!==v)return C[T]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(L.equals(v)===!1)return L.copy(v),!0}}return!1}function m(M){const y=M.uniforms;let w=0;const C=16;for(let T=0,L=y.length;T<L;T++){const D=Array.isArray(y[T])?y[T]:[y[T]];for(let U=0,K=D.length;U<K;U++){const Z=D[U],N=Array.isArray(Z.value)?Z.value:[Z.value];for(let W=0,B=N.length;W<B;W++){const X=N[W],nt=g(X),ot=w%C,at=ot%nt.boundary,xt=ot+at;w+=at,xt!==0&&C-xt<nt.storage&&(w+=C-xt),Z.__data=new Float32Array(nt.storage/Float32Array.BYTES_PER_ELEMENT),Z.__offset=w,w+=nt.storage}}}const v=w%C;return v>0&&(w+=C-v),M.__size=w,M.__cache={},this}function g(M){const y={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(y.boundary=4,y.storage=4):M.isVector2?(y.boundary=8,y.storage=8):M.isVector3||M.isColor?(y.boundary=16,y.storage=12):M.isVector4?(y.boundary=16,y.storage=16):M.isMatrix3?(y.boundary=48,y.storage=48):M.isMatrix4?(y.boundary=64,y.storage=64):M.isTexture?Ut("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(y.boundary=16,y.storage=M.byteLength):Ut("WebGLRenderer: Unsupported uniform value type.",M),y}function S(M){const y=M.target;y.removeEventListener("dispose",S);const w=o.indexOf(y.__bindingPointIndex);o.splice(w,1),s.deleteBuffer(i[y.id]),delete i[y.id],delete r[y.id]}function E(){for(const M in i)s.deleteBuffer(i[M]);o=[],i={},r={}}return{bind:l,update:c,dispose:E}}const o_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Bn=null;function a_(){return Bn===null&&(Bn=new kh(o_,16,16,Gi,sn),Bn.name="DFG_LUT",Bn.minFilter=He,Bn.magFilter=He,Bn.wrapS=Yn,Bn.wrapT=Yn,Bn.generateMipmaps=!1,Bn.needsUpdate=!0),Bn}class l_{constructor(t={}){const{canvas:e=Ep(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:f=nn}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const x=f,m=new Set([Pa,Ra,Ca]),g=new Set([nn,Nn,Js,js,Ea,Ta]),S=new Uint32Array(4),E=new Int32Array(4),M=new P;let y=null,w=null;const C=[],v=[];let T=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=In,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let D=!1,U=null,K=null,Z=null,N=null;this._outputColorSpace=Ae;let W=0,B=0,X=null,nt=-1,ot=null;const at=new ve,xt=new ve;let Gt=null;const xe=new Bt(0);let ee=0,Q=e.width,I=e.height,q=1,st=null,ut=null;const lt=new ve(0,0,Q,I),Ot=new ve(0,0,Q,I);let Dt=!1;const Vt=new co;let jt=!1,Qt=!1;const ne=new re,he=new P,ue=new ve,Le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ye=!1;function De(){return X===null?q:1}let O=n;function en(b,k){return e.getContext(b,k)}try{const b={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${sa}`),e.addEventListener("webglcontextlost",be,!1),e.addEventListener("webglcontextrestored",me,!1),e.addEventListener("webglcontextcreationerror",Gn,!1),O===null){const k="webgl2";if(O=en(k,b),O===null)throw en(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(b){throw te("WebGLRenderer: "+b.message),b}let ae,A,_,z,$,J,ct,dt,j,et,pt,Ct,_t,mt,Nt,Ft,$t,F,ht,tt,gt,bt,it;function At(){ae=new ax(O),ae.init(),gt=new jv(O,ae),A=new Qg(O,ae,t,gt),_=new Zv(O,ae),A.reversedDepthBuffer&&d&&_.buffers.depth.setReversed(!0),K=O.createFramebuffer(),Z=O.createFramebuffer(),N=O.createFramebuffer(),z=new hx(O),$=new Fv,J=new Jv(O,ae,_,$,A,gt,z),ct=new ox(L),dt=new Ym(O),bt=new Jg(O,dt),j=new lx(O,dt,z,bt),et=new dx(O,j,dt,bt,z),F=new ux(O,A,J),Nt=new tx($),pt=new Uv(L,ct,ae,A,bt,Nt),Ct=new s_(L,$),_t=new kv,mt=new Wv(ae),$t=new Zg(L,ct,_,et,p,l),Ft=new Kv(L,et,A),it=new r_(O,z,A,_),ht=new jg(O,ae,z),tt=new cx(O,ae,z),z.programs=pt.programs,L.capabilities=A,L.extensions=ae,L.properties=$,L.renderLists=_t,L.shadowMap=Ft,L.state=_,L.info=z}At(),x!==nn&&(T=new px(x,e.width,e.height,a,i,r));const Et=new n_(L,O);this.xr=Et,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const b=ae.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=ae.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(b){b!==void 0&&(q=b,this.setSize(Q,I,!1))},this.getSize=function(b){return b.set(Q,I)},this.setSize=function(b,k,Y=!0){if(Et.isPresenting){Ut("WebGLRenderer: Can't change size while VR device is presenting.");return}Q=b,I=k,e.width=Math.floor(b*q),e.height=Math.floor(k*q),Y===!0&&(e.style.width=b+"px",e.style.height=k+"px"),T!==null&&T.setSize(e.width,e.height),this.setViewport(0,0,b,k)},this.getDrawingBufferSize=function(b){return b.set(Q*q,I*q).floor()},this.setDrawingBufferSize=function(b,k,Y){Q=b,I=k,q=Y,e.width=Math.floor(b*Y),e.height=Math.floor(k*Y),this.setViewport(0,0,b,k)},this.setEffects=function(b){if(x===nn){te("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let k=0;k<b.length;k++)if(b[k].isOutputPass===!0){Ut("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(at)},this.getViewport=function(b){return b.copy(lt)},this.setViewport=function(b,k,Y,H){b.isVector4?lt.set(b.x,b.y,b.z,b.w):lt.set(b,k,Y,H),_.viewport(at.copy(lt).multiplyScalar(q).round())},this.getScissor=function(b){return b.copy(Ot)},this.setScissor=function(b,k,Y,H){b.isVector4?Ot.set(b.x,b.y,b.z,b.w):Ot.set(b,k,Y,H),_.scissor(xt.copy(Ot).multiplyScalar(q).round())},this.getScissorTest=function(){return Dt},this.setScissorTest=function(b){_.setScissorTest(Dt=b)},this.setOpaqueSort=function(b){st=b},this.setTransparentSort=function(b){ut=b},this.getClearColor=function(b){return b.copy($t.getClearColor())},this.setClearColor=function(){$t.setClearColor(...arguments)},this.getClearAlpha=function(){return $t.getClearAlpha()},this.setClearAlpha=function(){$t.setClearAlpha(...arguments)},this.clear=function(b=!0,k=!0,Y=!0){let H=0;if(b){let G=!1;if(X!==null){const yt=X.texture.format;G=m.has(yt)}if(G){const yt=X.texture.type,wt=g.has(yt),Mt=$t.getClearColor(),Tt=$t.getClearAlpha(),Rt=Mt.r,Xt=Mt.g,Kt=Mt.b;wt?(S[0]=Rt,S[1]=Xt,S[2]=Kt,S[3]=Tt,O.clearBufferuiv(O.COLOR,0,S)):(E[0]=Rt,E[1]=Xt,E[2]=Kt,E[3]=Tt,O.clearBufferiv(O.COLOR,0,E))}else H|=O.COLOR_BUFFER_BIT}k&&(H|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(H|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&O.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),U=b},this.dispose=function(){e.removeEventListener("webglcontextlost",be,!1),e.removeEventListener("webglcontextrestored",me,!1),e.removeEventListener("webglcontextcreationerror",Gn,!1),$t.dispose(),_t.dispose(),mt.dispose(),$.dispose(),ct.dispose(),et.dispose(),bt.dispose(),it.dispose(),pt.dispose(),Et.dispose(),Et.removeEventListener("sessionstart",Cd),Et.removeEventListener("sessionend",Rd),Ji.stop()};function be(b){b.preventDefault(),xh("WebGLRenderer: Context Lost."),D=!0}function me(){xh("WebGLRenderer: Context Restored."),D=!1;const b=z.autoReset,k=Ft.enabled,Y=Ft.autoUpdate,H=Ft.needsUpdate,G=Ft.type;At(),z.autoReset=b,Ft.enabled=k,Ft.autoUpdate=Y,Ft.needsUpdate=H,Ft.type=G}function Gn(b){te("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Vn(b){const k=b.target;k.removeEventListener("dispose",Vn),VM(k)}function VM(b){WM(b),$.remove(b)}function WM(b){const k=$.get(b).programs;k!==void 0&&(k.forEach(function(Y){pt.releaseProgram(Y)}),b.isShaderMaterial&&pt.releaseShaderCache(b))}this.renderBufferDirect=function(b,k,Y,H,G,yt){k===null&&(k=Le);const wt=G.isMesh&&G.matrixWorld.determinantAffine()<0,Mt=qM(b,k,Y,H,G);_.setMaterial(H,wt);let Tt=Y.index,Rt=1;if(H.wireframe===!0){if(Tt=j.getWireframeAttribute(Y),Tt===void 0)return;Rt=2}const Xt=Y.drawRange,Kt=Y.attributes.position;let Lt=Xt.start*Rt,ce=(Xt.start+Xt.count)*Rt;yt!==null&&(Lt=Math.max(Lt,yt.start*Rt),ce=Math.min(ce,(yt.start+yt.count)*Rt)),Tt!==null?(Lt=Math.max(Lt,0),ce=Math.min(ce,Tt.count)):Kt!=null&&(Lt=Math.max(Lt,0),ce=Math.min(ce,Kt.count));const Ee=ce-Lt;if(Ee<0||Ee===1/0)return;bt.setup(G,H,Mt,Y,Tt);let Se,de=ht;if(Tt!==null&&(Se=dt.get(Tt),de=tt,de.setIndex(Se)),G.isMesh)H.wireframe===!0?(_.setLineWidth(H.wireframeLinewidth*De()),de.setMode(O.LINES)):de.setMode(O.TRIANGLES);else if(G.isLine){let Xe=H.linewidth;Xe===void 0&&(Xe=1),_.setLineWidth(Xe*De()),G.isLineSegments?de.setMode(O.LINES):G.isLineLoop?de.setMode(O.LINE_LOOP):de.setMode(O.LINE_STRIP)}else G.isPoints?de.setMode(O.POINTS):G.isSprite&&de.setMode(O.TRIANGLES);if(G.isBatchedMesh)if(ae.get("WEBGL_multi_draw"))de.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Xe=G._multiDrawStarts,St=G._multiDrawCounts,ln=G._multiDrawCount,ie=Tt?dt.get(Tt).bytesPerElement:1,gn=$.get(H).currentProgram.getUniforms();for(let Wn=0;Wn<ln;Wn++)gn.setValue(O,"_gl_DrawID",Wn),de.render(Xe[Wn]/ie,St[Wn])}else if(G.isInstancedMesh)de.renderInstances(Lt,Ee,G.count);else if(Y.isInstancedBufferGeometry){const Xe=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,St=Math.min(Y.instanceCount,Xe);de.renderInstances(Lt,Ee,St)}else de.render(Lt,Ee)};function Ad(b,k,Y){b.transparent===!0&&b.side===qn&&b.forceSinglePass===!1?(b.side=Ye,b.needsUpdate=!0,No(b,k,Y),b.side=di,b.needsUpdate=!0,No(b,k,Y),b.side=qn):No(b,k,Y)}this.compile=function(b,k,Y=null){Y===null&&(Y=b),w=mt.get(Y),w.init(k),v.push(w),Y.traverseVisible(function(G){G.isLight&&G.layers.test(k.layers)&&(w.pushLight(G),G.castShadow&&w.pushShadow(G))}),b!==Y&&b.traverseVisible(function(G){G.isLight&&G.layers.test(k.layers)&&(w.pushLight(G),G.castShadow&&w.pushShadow(G))}),w.setupLights();const H=new Set;return b.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const yt=G.material;if(yt)if(Array.isArray(yt))for(let wt=0;wt<yt.length;wt++){const Mt=yt[wt];Ad(Mt,Y,G),H.add(Mt)}else Ad(yt,Y,G),H.add(yt)}),w=v.pop(),H},this.compileAsync=function(b,k,Y=null){const H=this.compile(b,k,Y);return new Promise(G=>{function yt(){if(H.forEach(function(wt){$.get(wt).currentProgram.isReady()&&H.delete(wt)}),H.size===0){G(b);return}setTimeout(yt,10)}ae.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let Ac=null;function $M(b){Ac&&Ac(b)}function Cd(){Ji.stop()}function Rd(){Ji.start()}const Ji=new du;Ji.setAnimationLoop($M),typeof self<"u"&&Ji.setContext(self),this.setAnimationLoop=function(b){Ac=b,Et.setAnimationLoop(b),b===null?Ji.stop():Ji.start()},Et.addEventListener("sessionstart",Cd),Et.addEventListener("sessionend",Rd),this.render=function(b,k){if(k!==void 0&&k.isCamera!==!0){te("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;U!==null&&U.renderStart(b,k);const Y=Et.enabled===!0&&Et.isPresenting===!0,H=T!==null&&(X===null||Y)&&T.begin(L,X);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Et.enabled===!0&&Et.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(Et.cameraAutoUpdate===!0&&Et.updateCamera(k),k=Et.getCamera()),b.isScene===!0&&b.onBeforeRender(L,b,k,X),w=mt.get(b,v.length),w.init(k),w.state.textureUnits=J.getTextureUnits(),v.push(w),ne.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),Vt.setFromProjectionMatrix(ne,Un,k.reversedDepth),Qt=this.localClippingEnabled,jt=Nt.init(this.clippingPlanes,Qt),y=_t.get(b,C.length),y.init(),C.push(y),Et.enabled===!0&&Et.isPresenting===!0){const wt=L.xr.getDepthSensingMesh();wt!==null&&Cc(wt,k,-1/0,L.sortObjects)}Cc(b,k,0,L.sortObjects),y.finish(),L.sortObjects===!0&&y.sort(st,ut,k.reversedDepth),ye=Et.enabled===!1||Et.isPresenting===!1||Et.hasDepthSensing()===!1,ye&&$t.addToRenderList(y,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),jt===!0&&Nt.beginShadows();const G=w.state.shadowsArray;if(Ft.render(G,b,k),jt===!0&&Nt.endShadows(),(H&&T.hasRenderPass())===!1){const wt=y.opaque,Mt=y.transmissive;if(w.setupLights(),k.isArrayCamera){const Tt=k.cameras;if(Mt.length>0)for(let Rt=0,Xt=Tt.length;Rt<Xt;Rt++){const Kt=Tt[Rt];Ld(wt,Mt,b,Kt)}ye&&$t.render(b);for(let Rt=0,Xt=Tt.length;Rt<Xt;Rt++){const Kt=Tt[Rt];Pd(y,b,Kt,Kt.viewport)}}else Mt.length>0&&Ld(wt,Mt,b,k),ye&&$t.render(b),Pd(y,b,k)}X!==null&&B===0&&(J.updateMultisampleRenderTarget(X),J.updateRenderTargetMipmap(X)),H&&T.end(L),b.isScene===!0&&b.onAfterRender(L,b,k),bt.resetDefaultState(),nt=-1,ot=null,v.pop(),v.length>0?(w=v[v.length-1],J.setTextureUnits(w.state.textureUnits),jt===!0&&Nt.setGlobalState(L.clippingPlanes,w.state.camera)):w=null,C.pop(),C.length>0?y=C[C.length-1]:y=null,U!==null&&U.renderEnd()};function Cc(b,k,Y,H){if(b.visible===!1)return;if(b.layers.test(k.layers)){if(b.isGroup)Y=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(k);else if(b.isLightProbeGrid)w.pushLightProbeGrid(b);else if(b.isLight)w.pushLight(b),b.castShadow&&w.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Vt.intersectsSprite(b)){H&&ue.setFromMatrixPosition(b.matrixWorld).applyMatrix4(ne);const wt=et.update(b),Mt=b.material;Mt.visible&&y.push(b,wt,Mt,Y,ue.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Vt.intersectsObject(b))){const wt=et.update(b),Mt=b.material;if(H&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),ue.copy(b.boundingSphere.center)):(wt.boundingSphere===null&&wt.computeBoundingSphere(),ue.copy(wt.boundingSphere.center)),ue.applyMatrix4(b.matrixWorld).applyMatrix4(ne)),Array.isArray(Mt)){const Tt=wt.groups;for(let Rt=0,Xt=Tt.length;Rt<Xt;Rt++){const Kt=Tt[Rt],Lt=Mt[Kt.materialIndex];Lt&&Lt.visible&&y.push(b,wt,Lt,Y,ue.z,Kt)}}else Mt.visible&&y.push(b,wt,Mt,Y,ue.z,null)}}const yt=b.children;for(let wt=0,Mt=yt.length;wt<Mt;wt++)Cc(yt[wt],k,Y,H)}function Pd(b,k,Y,H){const{opaque:G,transmissive:yt,transparent:wt}=b;w.setupLightsView(Y),jt===!0&&Nt.setGlobalState(L.clippingPlanes,Y),H&&_.viewport(at.copy(H)),G.length>0&&Io(G,k,Y),yt.length>0&&Io(yt,k,Y),wt.length>0&&Io(wt,k,Y),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Ld(b,k,Y,H){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[H.id]===void 0){const Lt=ae.has("EXT_color_buffer_half_float")||ae.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[H.id]=new je(1,1,{generateMipmaps:!0,type:Lt?sn:nn,minFilter:zi,samples:Math.max(4,A.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Jt.workingColorSpace})}const yt=w.state.transmissionRenderTarget[H.id],wt=H.viewport||at;yt.setSize(wt.z*L.transmissionResolutionScale,wt.w*L.transmissionResolutionScale);const Mt=L.getRenderTarget(),Tt=L.getActiveCubeFace(),Rt=L.getActiveMipmapLevel();L.setRenderTarget(yt),L.getClearColor(xe),ee=L.getClearAlpha(),ee<1&&L.setClearColor(16777215,.5),L.clear(),ye&&$t.render(Y);const Xt=L.toneMapping;L.toneMapping=In;const Kt=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),w.setupLightsView(H),jt===!0&&Nt.setGlobalState(L.clippingPlanes,H),Io(b,Y,H),J.updateMultisampleRenderTarget(yt),J.updateRenderTargetMipmap(yt),ae.has("WEBGL_multisampled_render_to_texture")===!1){let Lt=!1;for(let ce=0,Ee=k.length;ce<Ee;ce++){const Se=k[ce],{object:de,geometry:Xe,material:St,group:ln}=Se;if(St.side===qn&&de.layers.test(H.layers)){const ie=St.side;St.side=Ye,St.needsUpdate=!0,Dd(de,Y,H,Xe,St,ln),St.side=ie,St.needsUpdate=!0,Lt=!0}}Lt===!0&&(J.updateMultisampleRenderTarget(yt),J.updateRenderTargetMipmap(yt))}L.setRenderTarget(Mt,Tt,Rt),L.setClearColor(xe,ee),Kt!==void 0&&(H.viewport=Kt),L.toneMapping=Xt}function Io(b,k,Y){const H=k.isScene===!0?k.overrideMaterial:null;for(let G=0,yt=b.length;G<yt;G++){const wt=b[G],{object:Mt,geometry:Tt,group:Rt}=wt;let Xt=wt.material;Xt.allowOverride===!0&&H!==null&&(Xt=H),Mt.layers.test(Y.layers)&&Dd(Mt,k,Y,Tt,Xt,Rt)}}function Dd(b,k,Y,H,G,yt){b.onBeforeRender(L,k,Y,H,G,yt),b.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),G.onBeforeRender(L,k,Y,H,b,yt),G.transparent===!0&&G.side===qn&&G.forceSinglePass===!1?(G.side=Ye,G.needsUpdate=!0,L.renderBufferDirect(Y,k,H,G,b,yt),G.side=di,G.needsUpdate=!0,L.renderBufferDirect(Y,k,H,G,b,yt),G.side=qn):L.renderBufferDirect(Y,k,H,G,b,yt),b.onAfterRender(L,k,Y,H,G,yt)}function No(b,k,Y){k.isScene!==!0&&(k=Le);const H=$.get(b),G=w.state.lights,yt=w.state.shadowsArray,wt=G.state.version,Mt=pt.getParameters(b,G.state,yt,k,Y,w.state.lightProbeGridArray),Tt=pt.getProgramCacheKey(Mt);let Rt=H.programs;H.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?k.environment:null,H.fog=k.fog;const Xt=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;H.envMap=ct.get(b.envMap||H.environment,Xt),H.envMapRotation=H.environment!==null&&b.envMap===null?k.environmentRotation:b.envMapRotation,Rt===void 0&&(b.addEventListener("dispose",Vn),Rt=new Map,H.programs=Rt);let Kt=Rt.get(Tt);if(Kt!==void 0){if(H.currentProgram===Kt&&H.lightsStateVersion===wt)return Nd(b,Mt),Kt}else Mt.uniforms=pt.getUniforms(b),U!==null&&b.isNodeMaterial&&U.build(b,Y,Mt),b.onBeforeCompile(Mt,L),Kt=pt.acquireProgram(Mt,Tt),Rt.set(Tt,Kt),H.uniforms=Mt.uniforms;const Lt=H.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Lt.clippingPlanes=Nt.uniform),Nd(b,Mt),H.needsLights=KM(b),H.lightsStateVersion=wt,H.needsLights&&(Lt.ambientLightColor.value=G.state.ambient,Lt.lightProbe.value=G.state.probe,Lt.directionalLights.value=G.state.directional,Lt.directionalLightShadows.value=G.state.directionalShadow,Lt.spotLights.value=G.state.spot,Lt.spotLightShadows.value=G.state.spotShadow,Lt.rectAreaLights.value=G.state.rectArea,Lt.ltc_1.value=G.state.rectAreaLTC1,Lt.ltc_2.value=G.state.rectAreaLTC2,Lt.pointLights.value=G.state.point,Lt.pointLightShadows.value=G.state.pointShadow,Lt.hemisphereLights.value=G.state.hemi,Lt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Lt.spotLightMatrix.value=G.state.spotLightMatrix,Lt.spotLightMap.value=G.state.spotLightMap,Lt.pointShadowMatrix.value=G.state.pointShadowMatrix),H.lightProbeGrid=w.state.lightProbeGridArray.length>0,H.currentProgram=Kt,H.uniformsList=null,Kt}function Id(b){if(b.uniformsList===null){const k=b.currentProgram.getUniforms();b.uniformsList=bo.seqWithValue(k.seq,b.uniforms)}return b.uniformsList}function Nd(b,k){const Y=$.get(b);Y.outputColorSpace=k.outputColorSpace,Y.batching=k.batching,Y.batchingColor=k.batchingColor,Y.instancing=k.instancing,Y.instancingColor=k.instancingColor,Y.instancingMorph=k.instancingMorph,Y.skinning=k.skinning,Y.morphTargets=k.morphTargets,Y.morphNormals=k.morphNormals,Y.morphColors=k.morphColors,Y.morphTargetsCount=k.morphTargetsCount,Y.numClippingPlanes=k.numClippingPlanes,Y.numIntersection=k.numClipIntersection,Y.vertexAlphas=k.vertexAlphas,Y.vertexTangents=k.vertexTangents,Y.toneMapping=k.toneMapping}function XM(b,k){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;M.setFromMatrixPosition(k.matrixWorld);for(let Y=0,H=b.length;Y<H;Y++){const G=b[Y];if(G.texture!==null&&G.boundingBox.containsPoint(M))return G}return null}function qM(b,k,Y,H,G){k.isScene!==!0&&(k=Le),J.resetTextureUnits();const yt=k.fog,wt=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?k.environment:null,Mt=X===null?L.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:Jt.workingColorSpace,Tt=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Rt=ct.get(H.envMap||wt,Tt),Xt=H.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,Kt=!!Y.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Lt=!!Y.morphAttributes.position,ce=!!Y.morphAttributes.normal,Ee=!!Y.morphAttributes.color;let Se=In;H.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(Se=L.toneMapping);const de=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Xe=de!==void 0?de.length:0,St=$.get(H),ln=w.state.lights;if(jt===!0&&(Qt===!0||b!==ot)){const ge=b===ot&&H.id===nt;Nt.setState(H,b,ge)}let ie=!1;H.version===St.__version?(St.needsLights&&St.lightsStateVersion!==ln.state.version||St.outputColorSpace!==Mt||G.isBatchedMesh&&St.batching===!1||!G.isBatchedMesh&&St.batching===!0||G.isBatchedMesh&&St.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&St.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&St.instancing===!1||!G.isInstancedMesh&&St.instancing===!0||G.isSkinnedMesh&&St.skinning===!1||!G.isSkinnedMesh&&St.skinning===!0||G.isInstancedMesh&&St.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&St.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&St.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&St.instancingMorph===!1&&G.morphTexture!==null||St.envMap!==Rt||H.fog===!0&&St.fog!==yt||St.numClippingPlanes!==void 0&&(St.numClippingPlanes!==Nt.numPlanes||St.numIntersection!==Nt.numIntersection)||St.vertexAlphas!==Xt||St.vertexTangents!==Kt||St.morphTargets!==Lt||St.morphNormals!==ce||St.morphColors!==Ee||St.toneMapping!==Se||St.morphTargetsCount!==Xe||!!St.lightProbeGrid!=w.state.lightProbeGridArray.length>0)&&(ie=!0):(ie=!0,St.__version=H.version);let gn=St.currentProgram;ie===!0&&(gn=No(H,k,G),U&&H.isNodeMaterial&&U.onUpdateProgram(H,gn,St));let Wn=!1,Ci=!1,Gs=!1;const fe=gn.getUniforms(),Te=St.uniforms;if(_.useProgram(gn.program)&&(Wn=!0,Ci=!0,Gs=!0),H.id!==nt&&(nt=H.id,Ci=!0),St.needsLights){const ge=XM(w.state.lightProbeGridArray,G);St.lightProbeGrid!==ge&&(St.lightProbeGrid=ge,Ci=!0)}if(Wn||ot!==b){_.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),fe.setValue(O,"projectionMatrix",b.projectionMatrix),fe.setValue(O,"viewMatrix",b.matrixWorldInverse);const Pi=fe.map.cameraPosition;Pi!==void 0&&Pi.setValue(O,he.setFromMatrixPosition(b.matrixWorld)),A.logarithmicDepthBuffer&&fe.setValue(O,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&fe.setValue(O,"isOrthographic",b.isOrthographicCamera===!0),ot!==b&&(ot=b,Ci=!0,Gs=!0)}if(St.needsLights&&(ln.state.directionalShadowMap.length>0&&fe.setValue(O,"directionalShadowMap",ln.state.directionalShadowMap,J),ln.state.spotShadowMap.length>0&&fe.setValue(O,"spotShadowMap",ln.state.spotShadowMap,J),ln.state.pointShadowMap.length>0&&fe.setValue(O,"pointShadowMap",ln.state.pointShadowMap,J)),G.isSkinnedMesh){fe.setOptional(O,G,"bindMatrix"),fe.setOptional(O,G,"bindMatrixInverse");const ge=G.skeleton;ge&&(ge.boneTexture===null&&ge.computeBoneTexture(),fe.setValue(O,"boneTexture",ge.boneTexture,J))}G.isBatchedMesh&&(fe.setOptional(O,G,"batchingTexture"),fe.setValue(O,"batchingTexture",G._matricesTexture,J),fe.setOptional(O,G,"batchingIdTexture"),fe.setValue(O,"batchingIdTexture",G._indirectTexture,J),fe.setOptional(O,G,"batchingColorTexture"),G._colorsTexture!==null&&fe.setValue(O,"batchingColorTexture",G._colorsTexture,J));const Ri=Y.morphAttributes;if((Ri.position!==void 0||Ri.normal!==void 0||Ri.color!==void 0)&&F.update(G,Y,gn),(Ci||St.receiveShadow!==G.receiveShadow)&&(St.receiveShadow=G.receiveShadow,fe.setValue(O,"receiveShadow",G.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&k.environment!==null&&(Te.envMapIntensity.value=k.environmentIntensity),Te.dfgLUT!==void 0&&(Te.dfgLUT.value=a_()),Ci){if(fe.setValue(O,"toneMappingExposure",L.toneMappingExposure),St.needsLights&&YM(Te,Gs),yt&&H.fog===!0&&Ct.refreshFogUniforms(Te,yt),Ct.refreshMaterialUniforms(Te,H,q,I,w.state.transmissionRenderTarget[b.id]),St.needsLights&&St.lightProbeGrid){const ge=St.lightProbeGrid;Te.probesSH.value=ge.texture,Te.probesMin.value.copy(ge.boundingBox.min),Te.probesMax.value.copy(ge.boundingBox.max),Te.probesResolution.value.copy(ge.resolution)}bo.upload(O,Id(St),Te,J)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(bo.upload(O,Id(St),Te,J),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&fe.setValue(O,"center",G.center),fe.setValue(O,"modelViewMatrix",G.modelViewMatrix),fe.setValue(O,"normalMatrix",G.normalMatrix),fe.setValue(O,"modelMatrix",G.matrixWorld),H.uniformsGroups!==void 0){const ge=H.uniformsGroups;for(let Pi=0,Vs=ge.length;Pi<Vs;Pi++){const Ud=ge[Pi];it.update(Ud,gn),it.bind(Ud,gn)}}return gn}function YM(b,k){b.ambientLightColor.needsUpdate=k,b.lightProbe.needsUpdate=k,b.directionalLights.needsUpdate=k,b.directionalLightShadows.needsUpdate=k,b.pointLights.needsUpdate=k,b.pointLightShadows.needsUpdate=k,b.spotLights.needsUpdate=k,b.spotLightShadows.needsUpdate=k,b.rectAreaLights.needsUpdate=k,b.hemisphereLights.needsUpdate=k}function KM(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(b,k,Y){const H=$.get(b);H.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),$.get(b.texture).__webglTexture=k,$.get(b.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:Y,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,k){const Y=$.get(b);Y.__webglFramebuffer=k,Y.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(b,k=0,Y=0){X=b,W=k,B=Y;let H=null,G=!1,yt=!1;if(b){const Mt=$.get(b);if(Mt.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(O.FRAMEBUFFER,Mt.__webglFramebuffer),at.copy(b.viewport),xt.copy(b.scissor),Gt=b.scissorTest,_.viewport(at),_.scissor(xt),_.setScissorTest(Gt),nt=-1;return}else if(Mt.__webglFramebuffer===void 0)J.setupRenderTarget(b);else if(Mt.__hasExternalTextures)J.rebindTextures(b,$.get(b.texture).__webglTexture,$.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Xt=b.depthTexture;if(Mt.__boundDepthTexture!==Xt){if(Xt!==null&&$.has(Xt)&&(b.width!==Xt.image.width||b.height!==Xt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");J.setupDepthRenderbuffer(b)}}const Tt=b.texture;(Tt.isData3DTexture||Tt.isDataArrayTexture||Tt.isCompressedArrayTexture)&&(yt=!0);const Rt=$.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Rt[k])?H=Rt[k][Y]:H=Rt[k],G=!0):b.samples>0&&J.useMultisampledRTT(b)===!1?H=$.get(b).__webglMultisampledFramebuffer:Array.isArray(Rt)?H=Rt[Y]:H=Rt,at.copy(b.viewport),xt.copy(b.scissor),Gt=b.scissorTest}else at.copy(lt).multiplyScalar(q).floor(),xt.copy(Ot).multiplyScalar(q).floor(),Gt=Dt;if(Y!==0&&(H=K),_.bindFramebuffer(O.FRAMEBUFFER,H)&&_.drawBuffers(b,H),_.viewport(at),_.scissor(xt),_.setScissorTest(Gt),G){const Mt=$.get(b.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+k,Mt.__webglTexture,Y)}else if(yt){const Mt=k;for(let Tt=0;Tt<b.textures.length;Tt++){const Rt=$.get(b.textures[Tt]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Tt,Rt.__webglTexture,Y,Mt)}}else if(b!==null&&Y!==0){const Mt=$.get(b.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Mt.__webglTexture,Y)}nt=-1},this.readRenderTargetPixels=function(b,k,Y,H,G,yt,wt,Mt=0){if(!(b&&b.isWebGLRenderTarget)){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=$.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&wt!==void 0&&(Tt=Tt[wt]),Tt){_.bindFramebuffer(O.FRAMEBUFFER,Tt);try{const Rt=b.textures[Mt],Xt=Rt.format,Kt=Rt.type;if(b.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Mt),!A.textureFormatReadable(Xt)){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!A.textureTypeReadable(Kt)){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=b.width-H&&Y>=0&&Y<=b.height-G&&O.readPixels(k,Y,H,G,gt.convert(Xt),gt.convert(Kt),yt)}finally{const Rt=X!==null?$.get(X).__webglFramebuffer:null;_.bindFramebuffer(O.FRAMEBUFFER,Rt)}}},this.readRenderTargetPixelsAsync=async function(b,k,Y,H,G,yt,wt,Mt=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=$.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&wt!==void 0&&(Tt=Tt[wt]),Tt)if(k>=0&&k<=b.width-H&&Y>=0&&Y<=b.height-G){_.bindFramebuffer(O.FRAMEBUFFER,Tt);const Rt=b.textures[Mt],Xt=Rt.format,Kt=Rt.type;if(b.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Mt),!A.textureFormatReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!A.textureTypeReadable(Kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Lt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Lt),O.bufferData(O.PIXEL_PACK_BUFFER,yt.byteLength,O.STREAM_READ),O.readPixels(k,Y,H,G,gt.convert(Xt),gt.convert(Kt),0);const ce=X!==null?$.get(X).__webglFramebuffer:null;_.bindFramebuffer(O.FRAMEBUFFER,ce);const Ee=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await Tp(O,Ee,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Lt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,yt),O.deleteBuffer(Lt),O.deleteSync(Ee),yt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,k=null,Y=0){const H=Math.pow(2,-Y),G=Math.floor(b.image.width*H),yt=Math.floor(b.image.height*H),wt=k!==null?k.x:0,Mt=k!==null?k.y:0;J.setTexture2D(b,0),O.copyTexSubImage2D(O.TEXTURE_2D,Y,0,0,wt,Mt,G,yt),_.unbindTexture()},this.copyTextureToTexture=function(b,k,Y=null,H=null,G=0,yt=0){let wt,Mt,Tt,Rt,Xt,Kt,Lt,ce,Ee;const Se=b.isCompressedTexture?b.mipmaps[yt]:b.image;if(Y!==null)wt=Y.max.x-Y.min.x,Mt=Y.max.y-Y.min.y,Tt=Y.isBox3?Y.max.z-Y.min.z:1,Rt=Y.min.x,Xt=Y.min.y,Kt=Y.isBox3?Y.min.z:0;else{const Te=Math.pow(2,-G);wt=Math.floor(Se.width*Te),Mt=Math.floor(Se.height*Te),b.isDataArrayTexture?Tt=Se.depth:b.isData3DTexture?Tt=Math.floor(Se.depth*Te):Tt=1,Rt=0,Xt=0,Kt=0}H!==null?(Lt=H.x,ce=H.y,Ee=H.z):(Lt=0,ce=0,Ee=0);const de=gt.convert(k.format),Xe=gt.convert(k.type);let St;k.isData3DTexture?(J.setTexture3D(k,0),St=O.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(J.setTexture2DArray(k,0),St=O.TEXTURE_2D_ARRAY):(J.setTexture2D(k,0),St=O.TEXTURE_2D),_.activeTexture(O.TEXTURE0),_.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,k.flipY),_.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),_.pixelStorei(O.UNPACK_ALIGNMENT,k.unpackAlignment);const ln=_.getParameter(O.UNPACK_ROW_LENGTH),ie=_.getParameter(O.UNPACK_IMAGE_HEIGHT),gn=_.getParameter(O.UNPACK_SKIP_PIXELS),Wn=_.getParameter(O.UNPACK_SKIP_ROWS),Ci=_.getParameter(O.UNPACK_SKIP_IMAGES);_.pixelStorei(O.UNPACK_ROW_LENGTH,Se.width),_.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Se.height),_.pixelStorei(O.UNPACK_SKIP_PIXELS,Rt),_.pixelStorei(O.UNPACK_SKIP_ROWS,Xt),_.pixelStorei(O.UNPACK_SKIP_IMAGES,Kt);const Gs=b.isDataArrayTexture||b.isData3DTexture,fe=k.isDataArrayTexture||k.isData3DTexture;if(b.isDepthTexture){const Te=$.get(b),Ri=$.get(k),ge=$.get(Te.__renderTarget),Pi=$.get(Ri.__renderTarget);_.bindFramebuffer(O.READ_FRAMEBUFFER,ge.__webglFramebuffer),_.bindFramebuffer(O.DRAW_FRAMEBUFFER,Pi.__webglFramebuffer);for(let Vs=0;Vs<Tt;Vs++)Gs&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,$.get(b).__webglTexture,G,Kt+Vs),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,$.get(k).__webglTexture,yt,Ee+Vs)),O.blitFramebuffer(Rt,Xt,wt,Mt,Lt,ce,wt,Mt,O.DEPTH_BUFFER_BIT,O.NEAREST);_.bindFramebuffer(O.READ_FRAMEBUFFER,null),_.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(G!==0||b.isRenderTargetTexture||$.has(b)){const Te=$.get(b),Ri=$.get(k);_.bindFramebuffer(O.READ_FRAMEBUFFER,Z),_.bindFramebuffer(O.DRAW_FRAMEBUFFER,N);for(let ge=0;ge<Tt;ge++)Gs?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Te.__webglTexture,G,Kt+ge):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Te.__webglTexture,G),fe?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ri.__webglTexture,yt,Ee+ge):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ri.__webglTexture,yt),G!==0?O.blitFramebuffer(Rt,Xt,wt,Mt,Lt,ce,wt,Mt,O.COLOR_BUFFER_BIT,O.NEAREST):fe?O.copyTexSubImage3D(St,yt,Lt,ce,Ee+ge,Rt,Xt,wt,Mt):O.copyTexSubImage2D(St,yt,Lt,ce,Rt,Xt,wt,Mt);_.bindFramebuffer(O.READ_FRAMEBUFFER,null),_.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else fe?b.isDataTexture||b.isData3DTexture?O.texSubImage3D(St,yt,Lt,ce,Ee,wt,Mt,Tt,de,Xe,Se.data):k.isCompressedArrayTexture?O.compressedTexSubImage3D(St,yt,Lt,ce,Ee,wt,Mt,Tt,de,Se.data):O.texSubImage3D(St,yt,Lt,ce,Ee,wt,Mt,Tt,de,Xe,Se):b.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,yt,Lt,ce,wt,Mt,de,Xe,Se.data):b.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,yt,Lt,ce,Se.width,Se.height,de,Se.data):O.texSubImage2D(O.TEXTURE_2D,yt,Lt,ce,wt,Mt,de,Xe,Se);_.pixelStorei(O.UNPACK_ROW_LENGTH,ln),_.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ie),_.pixelStorei(O.UNPACK_SKIP_PIXELS,gn),_.pixelStorei(O.UNPACK_SKIP_ROWS,Wn),_.pixelStorei(O.UNPACK_SKIP_IMAGES,Ci),yt===0&&k.generateMipmaps&&O.generateMipmap(St),_.unbindTexture()},this.initRenderTarget=function(b){$.get(b).__webglFramebuffer===void 0&&J.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?J.setTextureCube(b,0):b.isData3DTexture?J.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?J.setTexture2DArray(b,0):J.setTexture2D(b,0),_.unbindTexture()},this.resetState=function(){W=0,B=0,X=null,_.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Jt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Jt._getUnpackColorSpace()}}const Vu={type:"change"},ec={type:"start"},Wu={type:"end"},wo=new Qr,$u=new Mi,c_=Math.cos(70*Vr.DEG2RAD),Fe=new P,tn=2*Math.PI,le={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},nc=1e-6;class h_ extends Xm{constructor(t,e=null){super(t,e),this.state=le.NONE,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:as.ROTATE,MIDDLE:as.DOLLY,RIGHT:as.PAN},this.touches={ONE:ls.ROTATE,TWO:ls.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new P,this._lastQuaternion=new Fn,this._lastTargetPosition=new P,this._quat=new Fn().setFromUnitVectors(t.up,new P(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Xl,this._sphericalDelta=new Xl,this._scale=1,this._panOffset=new P,this._rotateStart=new ft,this._rotateEnd=new ft,this._rotateDelta=new ft,this._panStart=new ft,this._panEnd=new ft,this._panDelta=new ft,this._dollyStart=new ft,this._dollyEnd=new ft,this._dollyDelta=new ft,this._dollyDirection=new P,this._mouse=new ft,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=d_.bind(this),this._onPointerDown=u_.bind(this),this._onPointerUp=f_.bind(this),this._onContextMenu=M_.bind(this),this._onMouseWheel=g_.bind(this),this._onKeyDown=x_.bind(this),this._onTouchStart=v_.bind(this),this._onTouchMove=__.bind(this),this._onMouseDown=p_.bind(this),this._onMouseMove=m_.bind(this),this._interceptControlDown=y_.bind(this),this._interceptControlUp=b_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Vu),this.update(),this.state=le.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){const e=this.object.position;Fe.copy(e).sub(this.target),Fe.applyQuaternion(this._quat),this._spherical.setFromVector3(Fe),this.autoRotate&&this.state===le.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=tn:n>Math.PI&&(n-=tn),i<-Math.PI?i+=tn:i>Math.PI&&(i-=tn),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Fe.setFromSpherical(this._spherical),Fe.applyQuaternion(this._quatInverse),e.copy(this.target).add(Fe),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=Fe.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new P(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new P(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Fe.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(wo.origin.copy(this.object.position),wo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(wo.direction))<c_?this.object.lookAt(this.target):($u.setFromNormalAndCoplanarPoint(this.object.up,this.target),wo.intersectPlane($u,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>nc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>nc||this._lastTargetPosition.distanceToSquared(this.target)>nc?(this.dispatchEvent(Vu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?tn/60*this.autoRotateSpeed*t:tn/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Fe.setFromMatrixColumn(e,0),Fe.multiplyScalar(-t),this._panOffset.add(Fe)}_panUp(t,e){this.screenSpacePanning===!0?Fe.setFromMatrixColumn(e,1):(Fe.setFromMatrixColumn(e,0),Fe.crossVectors(this.object.up,Fe)),Fe.multiplyScalar(t),this._panOffset.add(Fe)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const i=this.object.position;Fe.copy(i).sub(this.target);let r=Fe.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),i=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=i/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(tn*this._rotateDelta.x/e.clientHeight),this._rotateUp(tn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(tn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-tn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(tn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-tn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panStart.set(n,i)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(i,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(tn*this._rotateDelta.x/e.clientHeight),this._rotateUp(tn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new ft,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function u_(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function d_(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function f_(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Wu),this.state=le.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function p_(s){let t;switch(s.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case as.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=le.DOLLY;break;case as.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=le.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=le.ROTATE}break;case as.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=le.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=le.PAN}break;default:this.state=le.NONE}this.state!==le.NONE&&this.dispatchEvent(ec)}function m_(s){switch(this.state){case le.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case le.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case le.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function g_(s){this.enabled===!1||this.enableZoom===!1||this.state!==le.NONE||(s.preventDefault(),this.dispatchEvent(ec),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(Wu))}function x_(s){this.enabled!==!1&&this._handleKeyDown(s)}function v_(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case ls.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=le.TOUCH_ROTATE;break;case ls.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=le.TOUCH_PAN;break;default:this.state=le.NONE}break;case 2:switch(this.touches.TWO){case ls.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=le.TOUCH_DOLLY_PAN;break;case ls.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=le.TOUCH_DOLLY_ROTATE;break;default:this.state=le.NONE}break;default:this.state=le.NONE}this.state!==le.NONE&&this.dispatchEvent(ec)}function __(s){switch(this._trackPointer(s),this.state){case le.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case le.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case le.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case le.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=le.NONE}}function M_(s){this.enabled!==!1&&s.preventDefault()}function y_(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function b_(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const vr=new P;function pn(s,t,e,n,i,r){const o=2*Math.PI*i/4,a=Math.max(r-2*i,0),l=Math.PI/4;vr.copy(t),vr[n]=0,vr.normalize();const c=.5*o/(o+a),u=1-vr.angleTo(s)/l;return Math.sign(vr[e])===1?u*c:a/(o+a)+c+c*(1-u)}class zn extends an{constructor(t=1,e=1,n=1,i=2,r=.1){const o=i*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:i,radius:r},o===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const l=new P,c=new P,u=new P(t,e,n).divideScalar(2).subScalar(r),h=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=h.length/6,x=new P,m=.5/o;for(let g=0,S=0;g<h.length;g+=3,S+=2)switch(l.fromArray(h,g),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),h[g+0]=u.x*Math.sign(l.x)+c.x*r,h[g+1]=u.y*Math.sign(l.y)+c.y*r,h[g+2]=u.z*Math.sign(l.z)+c.z*r,d[g+0]=c.x,d[g+1]=c.y,d[g+2]=c.z,Math.floor(g/p)){case 0:x.set(1,0,0),f[S+0]=pn(x,c,"z","y",r,n),f[S+1]=1-pn(x,c,"y","z",r,e);break;case 1:x.set(-1,0,0),f[S+0]=1-pn(x,c,"z","y",r,n),f[S+1]=1-pn(x,c,"y","z",r,e);break;case 2:x.set(0,1,0),f[S+0]=1-pn(x,c,"x","z",r,t),f[S+1]=pn(x,c,"z","x",r,n);break;case 3:x.set(0,-1,0),f[S+0]=1-pn(x,c,"x","z",r,t),f[S+1]=1-pn(x,c,"z","x",r,n);break;case 4:x.set(0,0,1),f[S+0]=1-pn(x,c,"x","y",r,t),f[S+1]=1-pn(x,c,"y","x",r,e);break;case 5:x.set(0,0,-1),f[S+0]=pn(x,c,"x","y",r,t),f[S+1]=1-pn(x,c,"y","x",r,e);break}}static fromJSON(t){return new zn(t.width,t.height,t.depth,t.segments,t.radius)}}const S_=8;function w_(){const s=document.createElement("canvas");s.width=1024,s.height=384;const t=s.getContext("2d"),e=256,n=192;if(t){const r=a=>[a%4*e,Math.floor(a/4)*n],o=(a,l,c,u,h=26)=>{const[d,f]=r(a);t.fillStyle=u,t.fillRect(d,f,e,n),t.fillStyle=c,t.font=`${h}px "Libertinus Mono", ui-monospace, monospace`,t.textAlign="center",l.forEach((p,x)=>t.fillText(p,d+e/2,f+n/2+(x-(l.length-1)/2)*h*1.3+h*.35)),t.textAlign="left"};o(1,["NO SIGNAL"],"#ffffff","#1432c8",30);{const[a,l]=r(2);["#c0c0c0","#c0c000","#00c0c0","#00c000","#c000c0","#c00000","#0000c0"].forEach((c,u)=>{t.fillStyle=c,t.fillRect(a+u*e/7,l,e/7+1,n*.7)}),t.fillStyle="#0b0b0b",t.fillRect(a,l+n*.7,e,n*.3)}o(3,["PRESENT DAY","PRESENT TIME"],"#e8e8e8","#050505",22);{const[a,l]=r(4);t.fillStyle="#000",t.fillRect(a,l,e,n),t.fillStyle="#b8b8b8",t.font="18px ui-monospace, monospace",t.fillText("C:\\>_",a+16,l+34)}o(5,["▶ PLAY"],"#ffffff","#0a1a7a",30),o(6,["æ"],"#f4f1ea","#000000",110),o(7,["CLOSE THE WORLD","OPEN THE nExT"],"#ff4a4a","#070000",18)}const i=new yi(s);return i.colorSpace=Ae,i}class E_{constructor(t,e,n){R(this,"group",new bn);R(this,"screens");R(this,"uniforms",{uTime:{value:0},uAtlas:{value:null},uFogColor:{value:new Bt},uFogDensity:{value:0}});this.uniforms.uFogColor.value.copy(n.color),this.uniforms.uFogDensity.value=n.density;const i=new zn(1.26,1.1,.95,2,.05);i.translate(0,.55,-.475);const r=new Hh(i,new Pe({roughness:.6,metalness:.05}),t),o=new Ze(1,.75);o.translate(0,.62,.004),this.uniforms.uAtlas.value=w_();const a=new Ie({uniforms:this.uniforms,vertexShader:`
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
        }`});this.screens=new Hh(o,a,t);const l=new Float32Array(t),c=new Float32Array(t),u=new Float32Array(t),h=[12168852,1513242,7172214,855311,9407100],d=new re,f=new Fn,p=new Jn,x=new Bt;let m=0;for(;m<t;){const g=e()*Math.PI*2;if(-Math.cos(g)>.3)continue;const S=9+e()*13,E=Math.sin(g)*S,M=-Math.cos(g)*S,y=Math.atan2(-E,-M)+(e()-.5)*.9,w=e()<.14,C=Math.min(t-m,w?1:1+Math.floor(e()*4));let v=w?4+e()*5:0;for(let T=0;T<C;T++,m++){const L=.8+e()*.9,D=!w&&T===0&&e()<.12;p.set(D?-Math.PI/2+.1:(e()-.5)*.12,y+(e()-.5)*.35,D?0:(e()-.5)*.08),f.setFromEuler(p),d.compose(new P(E+(e()-.5)*.3,v,M+(e()-.5)*.3),f,new P(L,L,L)),r.setMatrixAt(m,d),this.screens.setMatrixAt(m,d),r.setColorAt(m,x.setHex(h[Math.floor(e()*h.length)]??3355443)),l[m]=e()<.45?0:1+Math.floor(e()*(S_-1)),c[m]=e(),u[m]=e()<.22?0:.35+e()*.65,v+=1.1*L*(D?.85:1)}}this.screens.geometry.setAttribute("aTile",new ar(l,1)),this.screens.geometry.setAttribute("aSeed",new ar(c,1)),this.screens.geometry.setAttribute("aOn",new ar(u,1)),this.group.add(r,this.screens)}update(t){this.uniforms.uTime.value=t}}const T_=`
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
`,A_=`
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
`;function C_(s,t){return new Ie({uniforms:{map:{value:s},uTime:{value:0},uPower:{value:0},uHover:{value:0},uStatic:{value:0},uSeed:{value:t},uGain:{value:1},uTint:{value:new Bt(1,1,1)}},vertexShader:T_,fragmentShader:A_})}function R_(s,t,e){const n=new Ze(s,t,24,18),i=n.attributes.position;for(let r=0;r<i.count;r++){const o=i.getX(r)/(s/2),a=i.getY(r)/(t/2);i.setZ(r,e*(1-.5*o*o-.5*a*a))}return n.computeVertexNormals(),n}const Xu={beige:{color:12168852,rough:.62},tv:{color:1513242,rough:.42},grey:{color:7172214,rough:.55},black:{color:855311,rough:.5}},qu=new Map;function P_(s){let t=qu.get(s);return t||(t=new Pe({color:Xu[s].color,roughness:Xu[s].rough,metalness:.05}),qu.set(s,t)),t}const L_=new Pe({color:328966,roughness:.35,metalness:.2});function D_(s){const t=document.createElement("canvas");t.width=256,t.height=56;const e=t.getContext("2d");if(e){e.fillStyle="#d8cfae",e.fillRect(0,0,256,56),e.fillStyle="rgba(120,100,60,0.18)";for(let o=0;o<40;o++)e.fillRect(Math.random()*256,Math.random()*56,2,1);e.globalCompositeOperation="destination-out";for(let o=0;o<56;o+=4)e.fillRect(0,o,Math.random()*5,4),e.fillRect(256-Math.random()*5,o,5,4);e.globalCompositeOperation="source-over"}const n=new yi(t),i=`31px ${$o}`;let r=null;return Xo(i,()=>{e&&(r?e.putImageData(r,0,0):r=e.getImageData(0,0,256,56),e.fillStyle="#16161c",e.font=i,e.textAlign="center",e.textBaseline="middle",e.save(),e.translate(128,31),e.rotate(-.02),e.fillText(s,0,0),e.restore())},()=>n.needsUpdate=!0),n.colorSpace=Ae,n.anisotropy=4,n}class I_{constructor(t){R(this,"group",new bn);R(this,"texture");R(this,"crt");R(this,"glass");R(this,"hit");R(this,"height");R(this,"width");R(this,"depth");R(this,"screenH");R(this,"screenLocal");R(this,"portLocal");R(this,"topLocal");R(this,"led");const e=t.screenW,n=e*.75;this.screenH=n;const i=e*1.26,r=n+e*.34,o=e*.2;this.width=i,this.height=r+(t.stand?e*.08:0);const a=t.stand?e*.08:0,l=P_(t.style),c=new zt(new zn(i,r,o,3,e*.045),l);c.position.set(0,a+r/2,-o/2),this.group.add(c);const u=e*.62,h=new zt(new zn(i*.84,r*.86,u,3,e*.08),l);h.position.set(0,a+r*.52,-o-u/2+e*.04),this.group.add(h);const d=e*.3,f=new zt(new zn(i*.46,r*.46,d,2,e*.05),l);if(f.position.set(0,a+r*.54,-o-u-d/2+e*.1),this.group.add(f),this.depth=o+u+d-e*.14,t.stand){const g=new zt(new bi(e*.34,e*.4,a,24),l);g.position.set(0,a/2,-o-u*.4),this.group.add(g)}const p=a+r/2+e*.07;this.screenLocal=new P(0,p,.02),this.portLocal=new P(e*.1,a+r*.25,-this.depth+e*.05),this.topLocal=new P(0,a+r,-o-u*.45);const x=new zt(new Ze(e*1.05,n*1.05),L_);x.position.set(0,p,.002),this.group.add(x),this.texture=new yi(t.screen),this.texture.colorSpace=Ae,this.texture.minFilter=He,this.texture.generateMipmaps=!1,this.crt=C_(this.texture,t.seed),this.glass=new zt(R_(e,n,e*.035),this.crt),this.glass.position.set(0,p,.004),this.group.add(this.glass);const m=new zt(new Ze(e*.4,e*.088),new Pe({map:D_(t.label),transparent:!0,roughness:.9}));if(m.position.set(-e*.18,a+e*.075,.003),m.rotation.z=t.seed%7*.012-.03,this.group.add(m),this.led=new zt(new fr(e*.014,8,6),new Tn({color:1714714})),this.led.position.set(i/2-e*.12,a+e*.08,.004),this.group.add(this.led),t.style==="tv"||t.style==="grey"){const g=new Pe({color:2763310,roughness:.4});for(let S=0;S<2;S++){const E=new zt(new bi(e*.028,e*.028,e*.03,16),g);E.rotation.x=Math.PI/2,E.position.set(i/2-e*.24-S*e*.09,a+e*.08,.012),this.group.add(E)}}this.hit=new zt(new an(i,r,this.depth),new Tn({visible:!1})),this.hit.position.set(0,a+r/2,-this.depth/2),this.group.add(this.hit)}setLed(t,e){this.led.material.color.set(t?e:"#1a2a1a")}world(t){return this.group.updateMatrixWorld(!0),t.clone().applyMatrix4(this.group.matrixWorld)}normal(){const t=new Fn;return this.group.getWorldQuaternion(t),new P(0,0,1).applyQuaternion(t)}}const Eo={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Os{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const N_=new vo(-1,1,1,-1,0,1);class U_ extends $e{constructor(){super(),this.setAttribute("position",new we([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new we([0,2,0,0,2,0],2))}}const F_=new U_;class ic{constructor(t){this._mesh=new zt(F_,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,N_)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Yu extends Os{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Ie?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=pr.clone(t.uniforms),this.material=new Ie({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new ic(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Ku extends Os{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class O_ extends Os{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class k_{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new ft);this._width=n.width,this._height=n.height,e=new je(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:sn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Yu(Eo),this.copyPass.material.blending=Dn,this.timer=new Gm}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Ku!==void 0&&(o instanceof Ku?n=!0:o instanceof O_&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new ft);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const To={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class B_ extends Os{constructor(){super(),this.isOutputPass=!0,this.uniforms=pr.clone(To.uniforms),this.material=new nu({name:To.name,uniforms:this.uniforms,vertexShader:To.vertexShader,fragmentShader:To.fragmentShader}),this._fsQuad=new ic(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Jt.getTransfer(this._outputColorSpace)===se&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===pa?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===ma?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ga?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Lr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===va?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===_a?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===xa&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class z_ extends Os{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Bt}render(t,e,n){const i=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=i}}const H_={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Bt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class ks extends Os{constructor(t,e=1,n,i){super(),this.strength=e,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new ft(t.x,t.y):new ft(256,256),this.clearColor=new Bt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new je(r,o,{type:sn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const h=new je(r,o,{type:sn});h.texture.name="UnrealBloomPass.h"+u,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);const d=new je(r,o,{type:sn});d.texture.name="UnrealBloomPass.v"+u,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}const a=H_;this.highPassUniforms=pr.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ie({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new ft(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=pr.clone(Eo.uniforms),this.blendMaterial=new Ie({uniforms:this.copyUniforms,vertexShader:Eo.vertexShader,fragmentShader:Eo.fragmentShader,premultipliedAlpha:!0,blending:Pr,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Bt,this._oldClearAlpha=1,this._basic=new Tn,this._fsQuad=new ic(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new ft(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=ks.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=ks.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(t){const e=[],n=t/3;for(let i=0;i<t;i++)e.push(.39894*Math.exp(-.5*i*i/(n*n))/n);return new Ie({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new ft(.5,.5)},direction:{value:new ft(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`

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

				}`})}_getCompositeMaterial(t){return new Ie({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}}ks.BlurDirectionX=new ft(1,0),ks.BlurDirectionY=new ft(0,1);const G_={uniforms:{tDiffuse:{value:null},uRes:{value:new ft(1,1)},uTime:{value:0},uTear:{value:0},uDot:{value:3},uHalftone:{value:1}},vertexShader:`
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
    }`};class V_{constructor(t,e,n){R(this,"composer");R(this,"bloom");R(this,"wired");R(this,"tear",0);this.composer=new k_(t),this.composer.addPass(new z_(e,n)),this.bloom=new ks(new ft(256,256),.7,.5,.78),this.composer.addPass(this.bloom),this.wired=new Yu(G_),this.composer.addPass(this.wired),this.composer.addPass(new B_)}get u(){return this.wired.uniforms}setSize(t,e,n){this.composer.setPixelRatio(n),this.composer.setSize(t,e),this.u.uRes.value.set(t*n,e*n),this.u.uDot.value=Math.max(2.5,3*n)}kick(t=1){this.tear=Math.max(this.tear,t)}setHalftone(t){this.u.uHalftone.value=t?1:0}render(t,e){this.tear=Math.max(0,this.tear-e*2.2),this.u.uTime.value=t,this.u.uTear.value=this.tear*this.tear,this.composer.render(e)}}const W_={0:"abcdef",1:"bc",2:"abged",3:"abgcd",4:"fgbc",5:"afgcd",6:"afgedc",7:"abc",8:"abcdefg",9:"abcfgd","-":"g"," ":""};class $_{constructor(){R(this,"canvas",document.createElement("canvas"));R(this,"texture");R(this,"ctx");R(this,"mode","clock");R(this,"channel",0);R(this,"marquee","");R(this,"marqueeAt",0);R(this,"acc",1);R(this,"glow",1);this.canvas.width=512,this.canvas.height=112;const t=this.canvas.getContext("2d");if(!t)throw new Error("oikos: no 2d context");this.ctx=t,this.texture=new yi(this.canvas),this.texture.colorSpace=Ae}scroll(t,e){this.marquee=t,this.marqueeAt=e}play(t,e,n){this.mode="play",this.channel=t,this.scroll(e,n)}stop(){this.mode="clock"}update(t,e){if(this.acc+=e,this.acc<1/12)return;this.acc=0;const n=this.ctx;n.fillStyle="#020807",n.fillRect(0,0,512,112);const i=`rgba(127,245,225,${.85*this.glow+.15})`,r="rgba(127,245,225,0.07)";n.shadowColor="#7ff5e1",n.shadowBlur=10*this.glow,n.lineCap="round";const o=this.mode==="play";n.font="bold 15px ui-monospace, monospace";const a=(c,u,h)=>{n.fillStyle=h?i:r,n.fillText(c,u,24)};if(a("VHS",18,!0),a("HQ",62,!0),a("▶ PLAY",100,o),a("REC",180,!1),a("CH",226,o),a("PM",470,!o),this.marquee&&t-this.marqueeAt<2+this.marquee.length*.22){const c=512-(t-this.marqueeAt)*150;n.fillStyle=i,n.font='bold 50px ui-monospace, "Courier New", monospace',n.fillText(this.marquee.toUpperCase(),c,92)}else if(o)this.digits(String(this.channel).padStart(2,"0"),228,36,i,r),n.fillStyle=i,n.font="bold 40px ui-monospace, monospace",n.fillText("▶",360,88);else{const c=Math.floor(t*1.4)%2===0;this.digits("1200",150,36,c?i:r,r,!0,c)}n.shadowBlur=0,this.texture.needsUpdate=!0}digits(t,e,n,i,r,o=!1,a=!0){const l=this.ctx,c=34,u=60;if([...t].forEach((h,d)=>{const f=e+d*(c+16)+(o&&d>=2?22:0),p=W_[h]??"",x=(m,g,S,E,M)=>{l.strokeStyle=p.includes(m)?i:r,l.lineWidth=7,l.beginPath(),l.moveTo(f+g,n+S),l.lineTo(f+E,n+M),l.stroke()};x("a",5,0,c-5,0),x("b",c,5,c,u/2-5),x("c",c,u/2+5,c,u-5),x("d",5,u,c-5,u),x("e",0,u/2+5,0,u-5),x("f",0,5,0,u/2-5),x("g",5,u/2,c-5,u/2)}),o){l.fillStyle=a?i:r;const h=e+2*(c+16)+2;l.fillRect(h,n+16,7,7),l.fillRect(h,n+40,7,7)}}}function Zu(s){const t=document.createElement("canvas");t.width=512,t.height=160;const e=t.getContext("2d");if(e){e.fillStyle="#f1ede2",e.fillRect(0,0,512,160),e.fillStyle="#c0392b",e.fillRect(0,0,512,16),e.fillStyle="#9aa1b0";for(let a=40;a<160;a+=30)e.fillRect(16,a+20,480,1)}const n=new yi(t),i=`54px ${$o}`,r='18px "Libertinus Mono", monospace';let o=null;return Xo([i,r],()=>{e&&(o?e.putImageData(o,0,0):o=e.getImageData(0,0,512,160),e.font=r,e.fillStyle="#6b6f7a",e.textAlign="right",e.textBaseline="alphabetic",e.fillText("T-120  SP",496,142),e.fillStyle="#15151a",e.font=i,e.textAlign="left",e.textBaseline="middle",e.fillText(s,26,94,470))},()=>n.needsUpdate=!0),n.colorSpace=Ae,n.anisotropy=4,n}const sc=1.3,Ki=.27,Ao=.95,mn=.66;class X_{constructor(){R(this,"group",new bn);R(this,"hit");R(this,"vfd",new $_);R(this,"rearZ");R(this,"rearY");R(this,"flap");R(this,"tape");R(this,"tapeLabel");R(this,"restPose",{pos:new P,rotY:0});R(this,"slotPose",{pos:new P,rotY:0});R(this,"insidePose",{pos:new P,rotY:0});R(this,"state","rest");R(this,"anim",null);R(this,"queue",[]);R(this,"currentLabel","~");const t=new Pe({color:723725,roughness:.7,metalness:.1}),e=new zt(new zn(1.9,mn,1.6,2,.02),t);e.position.set(0,mn/2,.15),this.group.add(e);const n=new zt(new an(1.92,.006,1.62),new Tn({color:11735583}));n.position.set(0,mn-.03,.15),this.group.add(n);const i=new bn;i.position.set(0,mn+Ki/2+.012,-.12),this.group.add(i);const r=new Pe({color:2500396,roughness:.42,metalness:.12});i.add(new zt(new zn(sc,Ki,Ao,3,.018),r));const o=new Pe({color:6974837,roughness:.34,metalness:.2}),a=new zt(new an(sc-.04,.004,Ao-.04),o);a.position.y=Ki/2+.001,i.add(a);for(const[v,T]of[[-.55,.38],[.55,.38],[-.55,-.38],[.55,-.38]]){const L=new zt(new bi(.035,.04,.012,12),t);L.position.set(v,-Ki/2-.006,T),i.add(L)}const l=Ao/2+.001,c=new zt(new Ze(sc-.03,Ki-.03),new Pe({map:this.panelTexture(),roughness:.5,metalness:.08}));c.position.z=l,i.add(c);const u=.58,h=.095,d=-.21,f=.035,p=new zt(new Ze(u,h),new Tn({color:65793}));p.position.set(d,f,l+.001),i.add(p);const x=new bn;x.position.set(d,f+h/2,l+.004),i.add(x),this.flap=new zt(new an(u-.01,h-.006,.006),new Pe({color:1710879,roughness:.35,metalness:.1})),this.flap.position.y=-h/2,x.add(this.flap);const m=new zt(new Ze(.4,.0875),new Tn({map:this.vfd.texture,toneMapped:!1}));m.position.set(.36,.045,l+.002),i.add(m);const g=new Pe({color:3816258,roughness:.4,metalness:.1}),S=new Pe({color:9049376,roughness:.4});for(let v=0;v<6;v++){const T=new zt(new zn(.058,.024,.02,2,.006),v===5?S:g);T.position.set(.19+v*.075,-.075,l+.006),i.add(T)}const E=new zt(new bi(.022,.022,.02,20),g);E.rotation.x=Math.PI/2,E.position.set(-.57,.04,l+.008),i.add(E);const M=new zt(new fr(.006,8,6),new Tn({color:16724016}));M.position.set(-.57,-.01,l+.004),i.add(M),this.rearZ=i.position.z-Ao/2,this.rearY=i.position.y,this.tape=new bn;const y=new zt(new zn(.54,.07,.3,2,.01),new Pe({color:789518,roughness:.45,metalness:.2}));this.tape.add(y);const w=new zt(new Ze(.2,.06),new Pe({color:2761504,roughness:.1,metalness:.3}));w.rotation.x=-Math.PI/2,w.position.set(0,.0355,-.05),this.tape.add(w),this.tapeLabel=new Pe({map:Zu("~"),roughness:.8});const C=new zt(new Ze(.46,.1),this.tapeLabel);C.rotation.x=-Math.PI/2,C.position.set(0,.036,.085),this.tape.add(C),this.group.add(this.tape),this.restPose={pos:new P(-.38,mn+.036,.66),rotY:.32},this.slotPose={pos:new P(d,i.position.y+f,i.position.z+l+.34),rotY:0},this.insidePose={pos:new P(d,i.position.y+f,i.position.z+l-.36),rotY:0},this.applyPose(this.restPose,this.restPose,0),this.hit=new zt(new an(1.9,mn+Ki+.1,1.6),new Tn({visible:!1})),this.hit.position.set(0,(mn+Ki+.1)/2,.15),this.group.add(this.hit)}panelTexture(){const t=document.createElement("canvas");t.width=1024,t.height=200;const e=t.getContext("2d");if(e){const o=e.createLinearGradient(0,0,0,200);o.addColorStop(0,"#1f2024"),o.addColorStop(1,"#131417"),e.fillStyle=o,e.fillRect(0,0,1024,200),e.fillStyle="#3a3c43";for(let l=0;l<1024;l+=3)e.fillRect(l,0,1,200);e.globalAlpha=.9,e.font="13px ui-monospace, monospace",e.fillStyle="#8b8f99",e.fillText("VIDEO CASSETTE RECORDER   ·   4 HEAD HI-FI   ·   HQ",150,172),e.fillText("POWER",16,26),["EJECT","REW","PLAY","FF","STOP","REC"].forEach((l,c)=>e.fillText(l,632+c*58.5,184))}const n=new yi(t),i='30px "Libertinus Mono", monospace';let r=null;return Xo(i,()=>{e&&(r?e.putImageData(r,0,0):r=e.getImageData(0,0,1024,200),e.globalAlpha=.9,e.fillStyle="#c9ccd4",e.font=i,e.textAlign="left",e.textBaseline="alphabetic",e.fillText("æthera",26,176),e.globalAlpha=1)},()=>n.needsUpdate=!0),n.colorSpace=Ae,n.anisotropy=4,n}applyPose(t,e,n){this.tape.position.lerpVectors(t.pos,e.pos,n),this.tape.rotation.y=t.rotY+(e.rotY-t.rotY)*n}load(t){var e;this.queue=[],(this.state==="in"||((e=this.anim)==null?void 0:e.to)==="in")&&this.queue.push({to:"rest",label:this.currentLabel}),t&&this.queue.push({to:"in",label:t})}update(t){var o;if(!this.anim&&this.queue.length){const a=this.queue.shift();if(a&&a.to!==this.state){if(a.to==="in"){this.currentLabel=a.label;const l=this.tapeLabel.map;this.tapeLabel.map=Zu(a.label),this.tapeLabel.needsUpdate=!0,l==null||l.dispose()}this.anim={from:this.state,to:a.to,k:0,label:a.label}}}const e=this.anim;if(!e)return;e.k=Math.min(1,e.k+t/(e.to==="in"?1.3:.9));const n=e.to==="in"?e.k:1-e.k,i=a=>a*a*(3-2*a);if(n<.45){const a=i(n/.45);this.applyPose(this.restPose,this.slotPose,a),this.tape.position.y+=Math.sin(a*Math.PI)*.18}else this.applyPose(this.slotPose,this.insidePose,i(Math.min(1,(n-.5)/.4))*(n>.5?1:0));const r=n<.4?0:n<.5?(n-.4)/.1:n<.85?1:1-(n-.85)/.15;(o=this.flap.parent)==null||o.rotation.set(r*1.25,0,0),e.k>=1&&(this.state=e.to,this.anim=null)}}const q_={color:723724,roughness:.55,metalness:0};class Y_{constructor(t,e,n){R(this,"mesh");R(this,"uniforms",{uPulseColor:{value:new Bt},uPulseTime:{value:0},uPulseGain:{value:.35},uPulseCount:{value:3},uPulseSpeed:{value:.35}});R(this,"base",.35);R(this,"surgeLeft",0);R(this,"lit",0);const i=new Jh(t,!1,"centripetal",.5),r=i.getLength(),o=new Hl(i,Math.max(40,Math.round(r*18)),e,6,!1),a=o.attributes.uv,l=new Float32Array(a.count);for(let u=0;u<a.count;u++)l[u]=a.getX(u);o.setAttribute("aAlong",new dn(l,1)),this.uniforms.uPulseColor.value.set(n),this.uniforms.uPulseCount.value=Math.max(1,Math.round(r/2.2)),this.uniforms.uPulseSpeed.value=.18+Math.random()*.12;const c=new Pe(q_);c.onBeforeCompile=u=>{Object.assign(u.uniforms,this.uniforms),u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
attribute float aAlong;
varying float vAlong;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vAlong = aAlong;`),u.fragmentShader=u.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uPulseColor;
uniform float uPulseTime, uPulseGain, uPulseCount, uPulseSpeed;
varying float vAlong;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
float ph = fract(vAlong * uPulseCount + uPulseTime * uPulseSpeed);
float pulse = smoothstep(0.0, 0.03, ph) * (1.0 - smoothstep(0.03, 0.14, ph));
totalEmissiveRadiance += uPulseColor * (pulse * uPulseGain + 0.012 * uPulseGain);`)},c.customProgramCacheKey=()=>"oikos-cable",this.mesh=new zt(o,c)}setLit(t){this.lit=t}surge(){this.surgeLeft=2.2}update(t,e){this.surgeLeft=Math.max(0,this.surgeLeft-e);const n=this.surgeLeft>0?Math.sin(this.surgeLeft/2.2*Math.PI)*5:0,i=this.base+this.lit*1.2+n;this.uniforms.uPulseGain.value+=(i-this.uniforms.uPulseGain.value)*Math.min(1,e*6),this.uniforms.uPulseTime.value=t*(1+this.lit*1.5+n*.8)}}function K_(s,t,e,n,i,r){const a=[s.clone()],l=s.clone().addScaledVector(t,.18);a.push(l);const c=new P(l.x,.022,l.z).addScaledVector(t,.22);s.y>.3&&a.push(new P(l.x,(s.y+.022)*.4,l.z).addScaledVector(t,.2)),a.push(c);const u=new P(e.x,.022,n-.14),h=Math.sign(c.x||1);c.z>n-.1&&a.push(new P(h*1.15,.022,n-.25));const d=2;for(let f=1;f<=d;f++){const p=f/(d+1),x=new P().lerpVectors(c,u,p),m=new P(u.z-c.z,0,c.x-u.x).normalize();x.addScaledVector(m,(r()-.5)*.9),x.y=.022,a.push(x)}return a.push(u),a.push(new P(e.x,i-.04,n-.035)),a.push(new P(e.x,i+.03,n+.01)),a.push(e.clone()),a}function Ju(s,t,e,n=32){const i=[];for(let r=0;r<=n;r++){const o=r/n,a=new P().lerpVectors(s,t,o);a.y-=e*4*o*(1-o),i.push(a)}return i}function Z_(){var a,l,c;const s=new bn,t=new Pe({color:854795,roughness:.9}),e=new Gh({color:328708}),n=[new P(-26,0,-18),new P(-9,0,-24),new P(8,0,-23),new P(24,0,-15),new P(33,0,2)],i=12.5,r=[];n.forEach((u,h)=>{const d=new zt(new bi(.12,.17,i,8),t);d.position.set(u.x,i/2,u.z),s.add(d);const f=n[h+1]??n[h-1]??u,p=new P().subVectors(f,u).setY(0).normalize(),x=new P(-p.z,0,p.x),m=[];for(const[g,S]of[[i-.4,1.9],[i-1.5,1.4]]){const E=new zt(new an(S*2,.12,.12),t);E.position.set(u.x,g,u.z),E.rotation.y=Math.atan2(-x.z,x.x),s.add(E);for(const M of[-1,-.45,.45,1])m.push(new P(u.x,g+.08,u.z).addScaledVector(x,M*S*.95))}r.push(m)});for(let u=0;u<r.length-1;u++){const h=r[u]??[],d=r[u+1]??[];h.forEach((f,p)=>{const x=d[p];if(!x)return;const m=new $e().setFromPoints(Ju(f,x,1.4+p%3*.25));s.add(new $h(m,e))})}const o=[[(a=r[1])==null?void 0:a[0],new P(-2.4,9,-6.6)],[(l=r[2])==null?void 0:l[3],new P(2.2,9,-6.1)],[(c=r[3])==null?void 0:c[1],new P(6,8.5,-3)]];for(const[u,h]of o)u&&s.add(new $h(new $e().setFromPoints(Ju(u,h,2.2)),e));return s}function J_(){const s=new Ie({side:Ye,depthWrite:!1,fog:!1,uniforms:{uTime:{value:0}},vertexShader:`
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
      }`}),t=new zt(new fr(70,32,16),s);return t.renderOrder=-1,t}const j_=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2;function Q_(){const s=document.createElement("canvas");s.width=s.height=128;const t=s.getContext("2d");if(t){const e=t.createRadialGradient(64,64,0,64,64,64);e.addColorStop(0,"rgba(255,255,255,0.9)"),e.addColorStop(.4,"rgba(255,255,255,0.3)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,128,128)}return new yi(s)}class tM{constructor(t,e,n,i){R(this,"renderer");R(this,"scene",new im);R(this,"camera",new Qe(45,1,.05,160));R(this,"controls");R(this,"post");R(this,"vcr",new X_);R(this,"field");R(this,"sky");R(this,"stations",new Map);R(this,"pickables",[]);R(this,"raycaster",new Wm);R(this,"pointer",new ft(-9,-9));R(this,"pointerPx",{x:0,y:0});R(this,"pointerDirty",!1);R(this,"hovered",null);R(this,"focused",null);R(this,"tween",null);R(this,"playing",null);R(this,"settlePlay",null);R(this,"tuneSeq",0);R(this,"lastAspect",0);R(this,"later",[]);R(this,"clock",new $m);R(this,"t",0);R(this,"running",!1);R(this,"raf",0);R(this,"lastInput",0);R(this,"swayDir",1);R(this,"pixelRatio");R(this,"maxPixelRatio");R(this,"frameTimes",[]);R(this,"qualityStep",0);R(this,"shift",{x:0,y:0});R(this,"tuned",null);R(this,"shiftTarget",{x:0,y:0});R(this,"reduced");R(this,"lowPower");R(this,"speed",Math.min(10,Math.max(1,Number(new URLSearchParams(location.search).get("speed"))||1)));R(this,"driven",new URLSearchParams(location.search).has("drive"));R(this,"perf",{frames:0,paint:0,render:0,uploads:0});R(this,"frustum",new co);R(this,"viewProj",new re);R(this,"kept",null);R(this,"calm",0);this.container=t,this.events=i,this.reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,this.lowPower=matchMedia("(pointer: coarse)").matches||Math.min(innerWidth,innerHeight)<600,this.maxPixelRatio=Math.min(devicePixelRatio||1,this.lowPower?1.25:1.6),this.pixelRatio=this.maxPixelRatio,this.renderer=new l_({antialias:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.toneMapping=Lr,this.renderer.toneMappingExposure=1.1,this.renderer.outputColorSpace=Ae,this.renderer.domElement.id="oikos-gl",this.renderer.domElement.setAttribute("role","img"),this.renderer.domElement.setAttribute("aria-label","a dark room full of screens, each one a place on æthera"),t.prepend(this.renderer.domElement);try{this.build(e,n)}catch(r){throw this.renderer.domElement.remove(),this.renderer.dispose(),this.renderer.forceContextLoss(),r}}build(t,e){this.scene.background=new Bt(0),this.scene.fog=new Ml(new Bt().setRGB(.049,.0063,.0089,Qs),.042),this.sky=J_(),this.scene.add(this.sky),this.scene.add(new Nm(4866648,393988,.8));const n=new Bm(9082040,.35);n.position.set(-4,10,-6),this.scene.add(n);const i=new Fm(14212351,9,7,.42,.65,1.6);i.position.set(.4,4.6,1.2),i.target.position.set(0,mn,.1),this.scene.add(i,i.target);const r=new Wl(10466303,2.2,4.5,2);r.position.set(-.4,1.35,2.3),this.scene.add(r);const o=new Wl(11735583,1.6,4,2);o.position.set(0,.25,1.4),this.scene.add(o),this.buildFloor(),this.scene.add(this.vcr.group),this.pickables.push(this.vcr.hit),this.vcr.hit.userData.pick="vcr",this.scene.add(Z_());const a=Ii(1998);this.field=new E_(this.lowPower?40:90,a,this.scene.fog),this.scene.add(this.field.group),this.buildStations(t,e,a),this.controls=new h_(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.enablePan=!1,this.controls.rotateSpeed=.28,this.controls.zoomSpeed=.6,this.controls.addEventListener("start",()=>this.lastInput=this.t),this.post=new V_(this.renderer,this.scene,this.camera),this.resize();const l=this.homePose();this.camera.position.copy(l.pos),this.controls.target.copy(l.target),this.applyLimits(null),this.controls.update(),this.bindPointer(),addEventListener("resize",()=>this.resize())}buildFloor(){const t=document.createElement("canvas");t.width=t.height=512;const e=t.getContext("2d");if(e){e.fillStyle="#0c0b0d",e.fillRect(0,0,512,512),e.strokeStyle="rgba(120,110,130,0.10)",e.lineWidth=2;for(let r=0;r<=512;r+=128)e.beginPath(),e.moveTo(r,0),e.lineTo(r,512),e.moveTo(0,r),e.lineTo(512,r),e.stroke();for(let r=0;r<900;r++)e.fillStyle=`rgba(${Math.random()<.3?"120,20,30":"90,90,100"},${Math.random()*.12})`,e.fillRect(Math.random()*512,Math.random()*512,2,2)}const n=new yi(t);n.wrapS=n.wrapT=Ir,n.repeat.set(24,24),n.colorSpace=Ae,n.anisotropy=8;const i=new zt(new Ze(96,96),new Pe({map:n,roughness:.82,metalness:.15}));i.rotation.x=-Math.PI/2,this.scene.add(i)}buildStations(t,e,n){const i=new Pe({color:1315086,roughness:.85}),r=new Pe({color:657930,roughness:.6}),o=Q_(),a=new P,l=new Map,c=t.map((h,d)=>({site:h,i:d,p:$f(h.id,d)}));c.sort((h,d)=>+!!h.p.on-+!!d.p.on);let u=0;for(const{site:h,p:d}of c){const f=e.get(h.id);if(!f)continue;const p=new I_({style:d.style,screenW:d.screenW,screen:f.canvas,label:h.title,accent:h.accent,seed:Math.floor(n()*1e3),stand:d.stand}),x=Vr.degToRad(d.angle),m=d.on?l.get(d.on):void 0;if(m)p.group.position.copy(m.group.position),p.group.position.y+=m.height,p.group.rotation.copy(m.group.rotation),p.group.rotateY((n()-.5)*.12),p.group.translateZ(-(m.depth-p.depth)*.3);else{p.group.position.set(Math.sin(x)*d.r,d.y,-Math.cos(x)*d.r);const D=new P(0,d.hang?1.3:p.group.position.y+.6,.6);p.group.lookAt(D),d.hang||(p.group.rotation.set(0,Math.atan2(-p.group.position.x,.6-p.group.position.z),0),p.group.rotateY((n()-.5)*.1))}if(this.scene.add(p.group),l.set(h.id,p),!d.hang&&!d.on&&d.y>.01){const D=new zt(new an(p.width*.92,d.y,p.depth*.9),i);D.position.set(0,-d.y/2,-p.depth*.45),p.group.add(D)}if(d.hang){const D=p.world(p.topLocal),U=new zt(new bi(.008,.008,16,5),r);U.position.set(D.x,D.y+8,D.z),this.scene.add(U)}const g=-.5+u++*.37%1;a.set(g,this.vcr.rearY-.05,this.vcr.rearZ-.01);const S=p.world(p.portLocal),E=p.normal().multiplyScalar(-1).setY(0).normalize();let M;const y=d.feeds?l.get(d.feeds):void 0;if(y){const D=y.world(y.portLocal.clone().add(new P(-.25,.15,0))),U=new P().lerpVectors(S,D,.5);U.y=Math.min(S.y,D.y)-.6,M=[S,S.clone().addScaledVector(E,.3).setY(S.y-.2),U,D.clone().add(new P(0,.3,-.3)),D]}else M=K_(S,E,a,.15-.8,mn,n);const w=new Y_(M,d.hang?.014:.02,h.accent);this.scene.add(w.mesh);const C=new zt(new Ze(d.screenW*2.6,d.screenW*2.2),new Tn({map:o,color:h.accent,transparent:!0,opacity:0,depthWrite:!1,blending:Pr,fog:!0})),v=p.normal().setY(0).normalize(),T=p.world(p.screenLocal).addScaledVector(v,d.screenW*.9);C.position.set(T.x,.012,T.z),C.rotation.x=-Math.PI/2,C.rotation.z=Math.atan2(v.x,v.z),d.hang||this.scene.add(C);let L=null;this.lowPower||(L=new Wl(h.accent,0,3.2+d.screenW,2),L.position.copy(p.world(p.screenLocal).addScaledVector(p.normal(),1.1)),this.scene.add(L)),p.hit.userData.pick=h.id,this.pickables.push(p.hit),this.stations.set(h.id,{site:h,screen:f,monitor:p,placement:d,cable:w,glow:C,light:L,power:0,powerAt:1/0,staticLeft:0,hover:0})}}homePose(){const t=this.camera.aspect,e=t<1,n=e?7.2+(1-t)*2.4:7.8;return{pos:new P(0,e?2.5:2.4,n),target:new P(0,e?1.7:1.95,-1.6)}}posesFor(t){if(t==="vcr"){const c=this.camera.aspect<1;return{pos:new P(.3,1.75,c?3.9:2.9),target:new P(0,mn+.12,.2)}}const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.world(n.screenLocal),r=n.normal(),o=Vr.degToRad(this.camera.fov),a=2*Math.atan(Math.tan(o/2)*this.camera.aspect),l=Math.max(n.screenH/2/Math.tan(o/2)/.46,n.screenH/.75/2/Math.tan(a/2)/.7);return{pos:i.clone().addScaledVector(r,l+.05),target:i}}applyLimits(t){const e=this.controls;if(!t){e.minDistance=3,e.maxDistance=15,e.minAzimuthAngle=-.8,e.maxAzimuthAngle=.8,e.minPolarAngle=.95,e.maxPolarAngle=1.56;return}const n=new P().subVectors(this.camera.position,e.target),i=new Xl().setFromVector3(n);e.minDistance=i.radius*.45,e.maxDistance=i.radius*1.7,e.minAzimuthAngle=i.theta-.6,e.maxAzimuthAngle=i.theta+.6,e.minPolarAngle=Math.max(.3,i.phi-.45),e.maxPolarAngle=Math.min(1.6,i.phi+.35)}flyTo(t,e,n){this.controls.enabled=!1,this.controls.minAzimuthAngle=-1/0,this.controls.maxAzimuthAngle=1/0,this.tween={from:{pos:this.camera.position.clone(),target:this.controls.target.clone()},to:t,k:0,dur:this.reduced?.01:e,done:n}}focus(t){const e=t?this.posesFor(t):this.homePose();if(e){this.cancelPlay(),this.focused=t;for(const[n,i]of this.stations)i.cable.setLit(n===t?1:0);this.flyTo(e,t?1.15:1.3,()=>{this.applyLimits(t),this.controls.enabled=!this.tuned,this.controls.update()})}}get focusedId(){return this.focused}keepAlive(t){this.kept=t}get busy(){return this.playing!==null}cancelPlay(){this.playing=null;const t=this.settlePlay;this.settlePlay=null,t==null||t(!1)}play(t){const e=this.stations.get(t),n=this.posesFor(t);if(!e||!n)return Promise.resolve(!0);this.cancelPlay();const i=new Promise(c=>this.settlePlay=c);this.vcr.load(e.site.title),this.vcr.vfd.play(e.placement.channel,e.site.title,this.t),this.focused=t,this.playing=t;for(const[c,u]of this.stations)u.cable.setLit(c===t?1:0);const r=()=>{this.playing===t&&(e.staticLeft=.9,this.post.kick(.7),this.flyTo(n,1.15,()=>{if(this.playing!==t)return;this.playing=null,this.applyLimits(t),this.controls.enabled=!this.tuned,this.controls.update();const c=this.settlePlay;this.settlePlay=null,c==null||c(!0)}))};if(this.reduced)return r(),i;const o=Math.sign(e.monitor.group.position.x)||1,a=this.camera.aspect<1,l={pos:new P(o*.45,1.4,a?3.1:2.25),target:new P(o*.05,mn+.1,.25)};return this.flyTo(l,.8,()=>{this.playing===t&&(e.cable.surge(),this.after(.35,r))}),i}after(t,e){this.later.push({at:this.t+t,fn:e})}eject(){this.vcr.load(null),this.vcr.vfd.stop()}scroll(t){this.vcr.vfd.scroll(t,this.t)}dive(t){const e=this.stations.get(t);if(!e||this.reduced)return Promise.resolve();this.cancelPlay();const n=e.monitor,i=n.world(n.screenLocal),r=i.clone().addScaledVector(n.normal(),n.screenH*.16);return e.staticLeft=.8,this.post.kick(1),new Promise(o=>this.flyTo({pos:r,target:i},.75,o))}powerOn(){let t=0;const e=[...this.stations.values()].sort((n,i)=>n.placement.channel-i.placement.channel);for(const n of e)n.powerAt=this.t+.25+t++*(this.reduced?0:.14);this.vcr.vfd.scroll("present day  present time",this.t+.4)}anchor(t){let e;if(t==="vcr")e=new P(0,mn-.05,.95);else{const i=this.stations.get(t);if(!i)return null;e=i.monitor.world(i.monitor.screenLocal.clone().add(new P(0,i.monitor.screenH*.5,0)))}if(e.project(this.camera),e.z>1)return null;const n=this.renderer.domElement.getBoundingClientRect();return{x:n.left+(e.x+1)/2*n.width,y:n.top+(1-e.y)/2*n.height}}setShift(t,e){this.shiftTarget={x:t,y:e}}applyShift(t){this.tuned&&(this.shiftTarget={x:0,y:0});const e=this.reduced?1:Math.min(1,t*5),n=this.shift.x+(this.shiftTarget.x-this.shift.x)*e,i=this.shift.y+(this.shiftTarget.y-this.shift.y)*e;if(Math.abs(n-this.shift.x)<.05&&Math.abs(i-this.shift.y)<.05&&this.camera.view)return;this.shift={x:n,y:i};const r=this.container.clientWidth||innerWidth,o=this.container.clientHeight||innerHeight;this.camera.setViewOffset(r,o,n,i,r,o)}tuneIn(t,e){const n=this.stations.get(t),i=this.tunePose(t);if(!n||!i)return Promise.resolve();this.tuneOut(),this.cancelPlay();const r=this.tuneSeq;this.focused=t,this.shiftTarget={x:0,y:0};for(const[o,a]of this.stations)a.cable.setLit(o===t?1:0);return new Promise(o=>this.flyTo(i,1.1,()=>{if(r!==this.tuneSeq){this.applyLimits(t),this.controls.enabled=!0;return}this.tuned={id:t,place:e},n.staticLeft=0,this.resize(),o()}))}tunePose(t){const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.screenH/.75,r=n.world(n.screenLocal),o=Vr.degToRad(this.camera.fov),a=2*Math.atan(Math.tan(o/2)*this.camera.aspect),l=Math.max(n.screenH/2/Math.tan(o/2)/.84,i/2/Math.tan(a/2)/.94);return{pos:r.clone().addScaledVector(n.normal(),l),target:r}}tuneOut(){this.tuneSeq++,this.tuned&&(this.tuned=null,this.tween||(this.applyLimits(this.focused),this.controls.enabled=!0))}reset(){this.tuneOut(),this.cancelPlay(),this.focus(null)}glassRect(t){const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.screenH/.75,r=this.renderer.domElement.getBoundingClientRect(),o=[],a=[];this.camera.updateMatrixWorld();for(const[u,h]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const d=n.world(n.screenLocal.clone().add(new P(u*i/2,h*n.screenH/2,i*.02)));d.project(this.camera),o.push(r.left+(d.x+1)/2*r.width),a.push(r.top+(1-d.y)/2*r.height)}const l=Math.min(...o),c=Math.min(...a);return new DOMRectReadOnly(l,c,Math.max(...o)-l,Math.max(...a)-c)}get tunedId(){var t;return((t=this.tuned)==null?void 0:t.id)??null}bindPointer(){const t=this.renderer.domElement;let e=null;t.addEventListener("pointermove",n=>{const i=t.getBoundingClientRect();this.pointer.set((n.clientX-i.left)/i.width*2-1,-((n.clientY-i.top)/i.height)*2+1),this.pointerPx={x:n.clientX,y:n.clientY},this.pointerDirty=!0,this.lastInput=this.t}),t.addEventListener("pointerleave",()=>{this.pointer.set(-9,-9),this.pointerDirty=!0}),t.addEventListener("pointerdown",n=>{if(n.button!==0||!n.isPrimary){e=null;return}e={x:n.clientX,y:n.clientY,t:performance.now()},this.lastInput=this.t}),t.addEventListener("pointerup",n=>{if(!e)return;const i=Math.hypot(n.clientX-e.x,n.clientY-e.y),r=performance.now()-e.t<600;if(e=null,i>7||!r||this.tuned)return;const o=t.getBoundingClientRect();this.pointer.set((n.clientX-o.left)/o.width*2-1,-((n.clientY-o.top)/o.height)*2+1),this.events.pick(this.pickAt())})}pickFromPoint(t,e){const n=this.renderer.domElement.getBoundingClientRect(),i=this.pointer.clone();this.pointer.set((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);const r=this.pickAt();return this.pointer.copy(i),r}pickAt(){this.raycaster.setFromCamera(this.pointer,this.camera);const t=this.raycaster.intersectObjects(this.pickables,!1)[0];return(t==null?void 0:t.object.userData.pick)??null}resize(){const t=this.container.clientWidth||innerWidth,e=this.container.clientHeight||innerHeight,n=Math.abs(t/e-this.lastAspect)>.02;if(this.lastAspect=t/e,this.camera.aspect=t/e,this.camera.fov=this.camera.aspect<1?58:45,this.camera.setViewOffset(t,e,this.shift.x,this.shift.y,t,e),this.renderer.setSize(t,e,!1),this.renderer.domElement.style.width=`${t}px`,this.renderer.domElement.style.height=`${e}px`,this.post.setSize(t,e,this.pixelRatio),this.tuned){this.shift={x:0,y:0},this.camera.setViewOffset(t,e,0,0,t,e);const i=this.tunePose(this.tuned.id);i&&(this.camera.position.copy(i.pos),this.controls.target.copy(i.target),this.camera.lookAt(i.target));const r=this.glassRect(this.tuned.id);r&&this.tuned.place(r)}if(n&&!this.tween&&!this.focused&&this.controls){const i=this.homePose();this.camera.position.copy(i.pos),this.controls.target.copy(i.target)}}async warm(t=5e3){try{await Promise.race([this.renderer.compileAsync(this.scene,this.camera),new Promise(e=>setTimeout(e,t))]),this.post.render(0,0)}catch(e){console.warn("oikos: warm-up skipped",e)}}start(){if(this.running)return;if(this.running=!0,this.clock.getDelta(),this.driven){const e=this.renderer.getContext();window.__oikos={step:(n=1,i=1/30)=>{var r;this.perf={frames:0,paint:0,render:0,uploads:0};for(let o=0;o<n;o++)this.frame(i),e.finish();return{...this.perf,t:this.t,focused:this.focused,hovered:this.hovered,tuned:((r=this.tuned)==null?void 0:r.id)??null}},anchor:n=>this.anchor(n),glass:n=>this.glassRect(n)};return}const t=()=>{this.running&&(this.raf=requestAnimationFrame(t),this.frame())};this.raf=requestAnimationFrame(t)}stop(){this.running=!1,cancelAnimationFrame(this.raf)}adapt(t){this.frameTimes.push(t);const e=this.frameTimes.reduce((i,r)=>i+r,0);if(this.frameTimes.length<90&&e<2)return;const n=this.frameTimes.reduce((i,r)=>i+r,0)/this.frameTimes.length;if(this.frameTimes=[],this.calm=n<1/50?this.calm+1:0,this.calm>=3&&this.qualityStep>0){this.calm=0,this.qualityStep--,this.pixelRatio=Math.min(this.maxPixelRatio,this.pixelRatio/.8),this.post.bloom.enabled=!0,this.applyPixelRatio();return}n>1/27&&this.qualityStep<3&&(this.qualityStep++,this.pixelRatio=Math.max(.6,this.pixelRatio*.8),this.qualityStep>=3&&(this.post.bloom.enabled=!1),this.applyPixelRatio())}applyPixelRatio(){this.renderer.setPixelRatio(this.pixelRatio);const t=this.container.clientWidth||innerWidth,e=this.container.clientHeight||innerHeight;this.renderer.setSize(t,e,!1),this.post.setSize(t,e,this.pixelRatio)}frame(t){var a;const e=t??this.clock.getDelta(),n=Math.min(e,.1)*this.speed;this.t+=n;const i=this.t;if(this.driven||this.adapt(Math.min(e,.5)),this.applyShift(n),this.later.length){const l=this.later.filter(c=>c.at<=i);this.later=this.later.filter(c=>c.at>i);for(const c of l)c.fn()}if(this.tween){const l=this.tween;l.k=Math.min(1,l.k+n/l.dur);const c=j_(l.k);this.camera.position.lerpVectors(l.from.pos,l.to.pos,c),this.controls.target.lerpVectors(l.from.target,l.to.target,c),this.camera.lookAt(this.controls.target),l.k>=1&&(this.tween=null,(a=l.done)==null||a.call(l))}else{if(!this.focused&&!this.reduced&&i-this.lastInput>9){this.controls.autoRotate=!0;const l=this.controls.getAzimuthalAngle();l>.32&&(this.swayDir=1),l<-.32&&(this.swayDir=-1),this.controls.autoRotateSpeed=.18*this.swayDir}else this.controls.autoRotate=!1;this.controls.update(n)}if(this.pointerDirty&&!this.tween){this.pointerDirty=!1;const l=this.pickAt();l!==this.hovered&&(this.hovered=l,this.renderer.domElement.style.cursor=l?"pointer":""),this.events.hover(l,this.pointerPx.x,this.pointerPx.y)}const r=performance.now();this.camera.updateMatrixWorld(),this.viewProj.multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.viewProj);for(const[l,c]of this.stations){i>=c.powerAt&&(c.power=Math.min(1,c.power+n/(this.reduced?.01:.8))),c.staticLeft=Math.max(0,c.staticLeft-n),c.hover+=((l===this.hovered?1:0)-c.hover)*Math.min(1,n*8);const u=c.monitor.crt.uniforms;u.uTime.value=i,u.uPower.value=c.power,u.uHover.value=c.hover,u.uStatic.value=Math.min(1,c.staticLeft*1.6);const h=this.focused===l,d=h||l===this.kept||this.frustum.intersectsObject(c.monitor.glass),f=this.focused&&this.focused!=="vcr"&&!h&&l!==this.kept?.5:1;c.power>.2&&d&&c.screen.tick(i,n,h,f)&&(c.monitor.texture.needsUpdate=!0,this.perf.uploads++),c.monitor.setLed(c.power>.5,c.site.accent);const p=c.glow.material;p.opacity=c.power*(.16+c.hover*.12+(h?.1:0)),c.light&&(c.light.intensity=c.power*(2.2+c.hover*1.4+(h?.6:0))),c.cable.update(i,n)}this.vcr.vfd.glow=this.hovered==="vcr"?1:.8,this.vcr.vfd.update(i,n),this.vcr.update(n),this.field.update(i);const o=performance.now();if(this.post.render(i,n),this.driven){this.renderer.getContext().finish();const l=performance.now();this.perf.frames++,this.perf.paint+=o-r,this.perf.render+=l-o}}}let eM=0;const nM=s=>`${s}${++eM}`,iM="/static/oikos/mark.png",oe="#ffb347",ke="rgba(255,179,71,.75)",Ei="rgba(255,179,71,.4)",_e="#1c0e0b",sM="#2a1612",An="#8fe3ec",rc="#ff6a5a",Co="#7dff6a";function pe(s,t){return`<svg viewBox="0 0 ${s} ${s}" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`}function rM(s,t=""){const e=nM("gl");return pe(48,`<defs><radialGradient id="${e}" cx=".42" cy=".38" r=".8"><stop offset="0" stop-color="${s}" stop-opacity="1"/><stop offset=".75" stop-color="${s}" stop-opacity=".55"/><stop offset="1" stop-color="${s}" stop-opacity=".25"/></radialGradient></defs>
<rect x="5" y="7" width="38" height="29" rx="4" fill="${_e}" stroke="${ke}" stroke-width="1.6"/>
<rect x="9.5" y="11" width="29" height="21" rx="3" fill="url(#${e})"/>
<path d="M9.5 15.5h29M9.5 20h29M9.5 24.5h29M9.5 29h29" stroke="#000" stroke-opacity=".18" stroke-width="1"/>
<path d="M12 13.5h8" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/>
<path d="M18 36l-2.5 5h17L30 36" fill="${_e}" stroke="${ke}" stroke-width="1.6"/>
<circle cx="39.5" cy="33.5" r=".9" fill="${s}" stroke="none"/>`)}const Cn=rM;function _r(){return pe(48,`<path d="M5 13h13l4 4h21v22H5z" fill="${_e}" stroke="${ke}" stroke-width="1.6"/>
<path d="M5 20h38" stroke="${Ei}" stroke-width="1.2"/>
<path d="M17 31c2.4-3.4 4.8-3.4 7 0s4.6 3.4 7 0" stroke="${oe}" stroke-width="2.2"/>`)}function ju(){return pe(48,`<rect x="4" y="8" width="26" height="21" rx="3" fill="${_e}" stroke="${ke}" stroke-width="1.6"/>
<rect x="7.5" y="11.5" width="19" height="14" rx="2" fill="${oe}" fill-opacity=".22" stroke="${Ei}"/>
<path d="M10 15h8M10 18.5h11M10 22h6" stroke="${oe}" stroke-width="1.3"/>
<path d="M13 29l-1.5 4h11L21 29" stroke="${ke}" stroke-width="1.6"/>
<rect x="33" y="10" width="11" height="28" rx="1.5" fill="${_e}" stroke="${ke}" stroke-width="1.6"/>
<path d="M35.5 15h6M35.5 18h6" stroke="${Ei}" stroke-width="1.2"/>
<circle cx="38.5" cy="32" r="1.4" fill="${Co}" stroke="none"/>
<path d="M24 36c3 4 9 4 12 2" stroke="${Ei}" stroke-width="1.2"/>`)}function Qu(){return pe(48,`<circle cx="24" cy="24" r="17" fill="${_e}" stroke="${An}" stroke-opacity=".8" stroke-width="1.6"/>
<ellipse cx="24" cy="24" rx="7.5" ry="17" stroke="${An}" stroke-opacity=".55" stroke-width="1.2"/>
<path d="M7 24h34M10 15h28M10 33h28" stroke="${An}" stroke-opacity=".45" stroke-width="1.2"/>`)}function oM(){return pe(16,`<rect x="1" y="2.5" width="6" height="5" rx="1" fill="${_e}" stroke="${oe}" stroke-width="1.1"/>
<rect x="9" y="8.5" width="6" height="5" rx="1" fill="${_e}" stroke="${oe}" stroke-width="1.1"/>
<path d="M4 7.5v3.5h5" stroke="${oe}" stroke-width="1.1"/>
<circle cx="12" cy="11" r="1" fill="${Co}" stroke="none"/>`)}function td(s){const t=s?"#ff7a5c":oe;return pe(16,`<path d="M10.5 2.2a6 6 0 1 0 3.3 9.6A5 5 0 0 1 10.5 2.2z" fill="${s?t:"none"}" fill-opacity="${s?".85":"0"}" stroke="${t}" stroke-width="1.2"/>
${s?`<circle cx="12.8" cy="12.8" r="1.8" fill="${rc}" stroke="none"/>`:""}`)}function ed(s){return pe(24,`<circle cx="12" cy="12" r="9.5" fill="${_e}" stroke="${ke}" stroke-width="1.4"/><path d="${s==="back"?"M13.5 7.5L9 12l4.5 4.5":"M10.5 7.5L15 12l-4.5 4.5"}" stroke="${oe}" stroke-width="2"/>`)}const aM=()=>ed("back"),lM=()=>ed("fwd");function cM(){return pe(24,`<path d="M2.5 6.5h6l2 2h11v12h-19z" fill="${_e}" stroke="${ke}" stroke-width="1.3"/>
<path d="M12 18v-6.5M9 14l3-3 3 3" stroke="${oe}" stroke-width="1.8"/>`)}function hM(){return pe(24,`<circle cx="10" cy="10" r="6" fill="${_e}" stroke="${ke}" stroke-width="1.6"/><path d="M14.5 14.5l6 6" stroke="${oe}" stroke-width="2.2"/><path d="M7.5 8.5a3 3 0 0 1 2.5-2" stroke="#fff" stroke-opacity=".35" stroke-width="1.1"/>`)}function uM(){return pe(24,`<path d="M1.5 4.5h5l2 2h7.5v7.5h-14.5z" fill="${_e}" stroke="${Ei}" stroke-width="1.2"/>
<path d="M7.5 10.5h5l2 2h8v8.5h-15z" fill="${_e}" stroke="${ke}" stroke-width="1.3"/>`)}function dM(){return pe(18,`<rect x="1.5" y="1.5" width="15" height="15" rx="1" stroke="${An}" stroke-opacity=".75" stroke-width="1.2"/><path d="M5 9h7M9 5.5L12.5 9 9 12.5" stroke="${An}" stroke-width="1.6"/>`)}function oc(){return pe(16,`<circle cx="8" cy="8" r="6.6" stroke="${ke}" stroke-width="1.1"/><path d="M6.3 4.8v6.4l5-3.2z" fill="${oe}" stroke="none"/>`)}function nd(){return pe(16,`<rect x="1" y="2" width="10.5" height="8.5" rx="1.2" fill="${_e}" stroke="${ke}" stroke-width="1.1"/><circle cx="11" cy="11" r="2.7" fill="${_e}" stroke="${oe}" stroke-width="1.2"/><path d="M13 13l2.3 2.3" stroke="${oe}" stroke-width="1.5"/>`)}function fM(){return pe(16,`<rect x="1" y="3.5" width="14" height="10" rx="2" fill="${_e}" stroke="${ke}" stroke-width="1.1"/><rect x="2.8" y="5.2" width="8.5" height="6.6" rx="1.4" fill="${oe}" fill-opacity=".3"/><path d="M5 1.2l3 2.3 3-2.3" stroke="${Ei}" stroke-width="1"/><circle cx="13" cy="7" r=".7" fill="${oe}" stroke="none"/><circle cx="13" cy="9.8" r=".7" fill="${oe}" stroke="none"/>`)}function pM(){return pe(16,`<rect x="2" y="1.5" width="8" height="10" rx="1" fill="${_e}" stroke="${Ei}" stroke-width="1.1"/><rect x="6" y="4.5" width="8" height="10" rx="1" fill="${_e}" stroke="${ke}" stroke-width="1.1"/><path d="M8 8h4M8 10h4M8 12h3" stroke="${oe}" stroke-opacity=".7" stroke-width=".9"/>`)}function id(){return pe(16,`<path d="M8 2.5l5.5 6.5h-11z" stroke="${oe}" stroke-width="1.2"/><path d="M2.5 11.5h11v2h-11z" stroke="${oe}" stroke-width="1.2"/>`)}function Bs(s){const t=s==="xml"?"#ff8a3d":An;return pe(48,`<path d="M11 4h19l8 8v32H11z" fill="${_e}" stroke="${ke}" stroke-width="1.6"/>
<path d="M30 4v8h8" stroke="${ke}" stroke-width="1.6"/>
<path d="M16 18h16M16 23h16M16 28h12" stroke="${oe}" stroke-opacity=".45" stroke-width="1.3"/>
<rect x="13" y="34" width="22" height="8" fill="${t}" fill-opacity=".14" stroke="${t}" stroke-opacity=".8" stroke-width="1"/>
<text x="24" y="40.4" font-size="6.6" font-family="'IBM Plex Mono',ui-monospace,monospace" font-weight="500" text-anchor="middle" fill="${t}" stroke="none">${xM(s.toUpperCase())}</text>`)}function sd(){return pe(16,`<circle cx="8" cy="8" r="6.6" fill="${_e}" stroke="${oe}" stroke-width="1.2"/><path d="M8 7.2v4.3" stroke="${oe}" stroke-width="1.6"/><circle cx="8" cy="4.8" r="1" fill="${oe}" stroke="none"/>`)}function rd(){return pe(22,`<path d="M11 4v7" stroke="${rc}" stroke-width="2"/><path d="M7 6.8a6.3 6.3 0 1 0 8 0" stroke="${rc}" stroke-width="1.8"/>`)}function mM(){return pe(22,`<path d="M14 4a7.3 7.3 0 1 0 4.8 10.6A6.2 6.2 0 0 1 14 4z" stroke="${oe}" stroke-width="1.7"/>`)}function od(){return pe(22,`<circle cx="7.5" cy="11" r="3.6" stroke="${oe}" stroke-width="1.7"/><path d="M11.1 11h8M16 11v3M18.6 11v2.3" stroke="${oe}" stroke-width="1.7"/>`)}function gM(){return pe(18,`<rect x="1.5" y="1.5" width="15" height="15" rx="1" stroke="${ke}" stroke-width="1.2"/><path d="M7 5l5 4-5 4z" fill="${oe}" stroke="none"/>`)}function ad(){return pe(22,`<path d="M16.5 7.5a6.3 6.3 0 1 0 1 5.5" stroke="${Co}" stroke-width="1.8"/><path d="M17.5 3.5v4.5H13" stroke="${Co}" stroke-width="1.8"/>`)}function Ro(s,t=!1){return`<img src="${iM}" alt="" width="${s}" height="${s}" style="width:${s}px;height:${s}px;${t?"filter:invert(1);":""}">`}function xM(s){return s.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]??t)}function Ti(s="app"){return s==="status"?pe(16,`<rect x="1.5" y="2.5" width="13" height="9" rx="1" fill="${_e}" stroke="${ke}" stroke-width="1.1"/><path d="M4 5.5h5M4 8h3" stroke="${An}" stroke-width="1.1"/><path d="M5.5 13.5h5" stroke="${Ei}" stroke-width="1.1"/>`):s==="channel"?pe(16,`<path d="M1.5 2.5h11a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1H6l-3 2.8v-2.8H1.5a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" fill="${_e}" stroke="${An}" stroke-opacity=".85" stroke-width="1.1"/><path d="M5 4.5l-1 4M8 4.5l-1 4M3.5 5.8h5.5M3 7.6h5.5" stroke="${An}" stroke-width=".9"/>`):pe(24,`<path d="M2 3h12.5A1.5 1.5 0 0 1 16 4.5v6.5a1.5 1.5 0 0 1-1.5 1.5H8l-4 3.5v-3.5H2A1.5 1.5 0 0 1 .5 11V4.5A1.5 1.5 0 0 1 2 3z" fill="${sM}" stroke="${oe}" stroke-width="1.3"/>
<path d="M10 10h11.5A1.5 1.5 0 0 1 23 11.5v6a1.5 1.5 0 0 1-1.5 1.5H20v3.5L16 19h-6a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 10 10z" fill="${_e}" stroke="${An}" stroke-width="1.3"/>
<path d="M3.5 6.5h8M3.5 9h5" stroke="${oe}" stroke-opacity=".8" stroke-width="1.1"/>
<path d="M12 13.5h8M12 16h5" stroke="${An}" stroke-opacity=".8" stroke-width="1.1"/>`)}let Zi=null,Rn=null,ac=null;function vM(s){Zi=s,s.addEventListener("pointerdown",t=>{if(!Rn)return;const e=t.target;e.closest(".xp-menu")||e.closest("[data-menu-owner]")||Ai()},!0)}function _M(){return Rn!==null}function Ai(){if(!Rn)return!1;let s=Rn;for(;s;)s.el.remove(),s=s.child;Rn=null;const t=ac;return ac=null,t==null||t(),!0}function ld(s,t){const e=V("div",{class:"xp-menu",role:"menu"}),n=[];for(const i of s){if(i==="sep"){e.append(V("div",{class:"xp-menu-sep",role:"separator"}));continue}const r=V("button",{type:"button",role:i.checked!==void 0?"menuitemcheckbox":"menuitem",class:`${i.bold?"bold ":""}${i.submenu?"has-sub":""}`.trim(),html:`<i class="ic">${i.icon??""}</i><span class="lb"></span><span class="sc"></span>`});r.querySelector(".lb").textContent=i.label,r.querySelector(".sc").textContent=i.shortcut??"",i.checked!==void 0&&(r.setAttribute("aria-checked",String(i.checked)),i.checked&&r.classList.add("checked")),i.disabled&&(r.setAttribute("aria-disabled","true"),r.tabIndex=-1);const o=()=>{var u;if(!i.submenu||i.disabled)return;const a=lc(e);if(!a||((u=a.child)==null?void 0:u.el.dataset.for)===i.label)return;cc(a);const l=r.getBoundingClientRect(),c=cd(ld(i.submenu(),a),l.right-3,l.top-3,l.left+3);c.dataset.for=i.label,a.child={el:c,child:null}};r.addEventListener("pointerenter",()=>{const a=lc(e);i.submenu?o():a&&cc(a)}),r.addEventListener("click",a=>{var l,c,u,h;if(a.stopPropagation(),!i.disabled){if(i.submenu){o(),(u=(c=(l=lc(e))==null?void 0:l.child)==null?void 0:c.el.querySelector("button:not([aria-disabled])"))==null||u.focus();return}Ai(),(h=i.run)==null||h.call(i)}}),e.append(r),n.push(r)}return e.addEventListener("keydown",i=>{var a,l,c;const r=n.filter(u=>u.getAttribute("aria-disabled")!=="true"),o=r.indexOf(document.activeElement);if(i.key==="ArrowDown"||i.key==="ArrowUp"){i.preventDefault(),i.stopPropagation();const u=r[(o+(i.key==="ArrowDown"?1:-1)+r.length)%r.length];u==null||u.focus()}else i.key==="ArrowRight"&&((a=r[o])!=null&&a.classList.contains("has-sub"))?(i.preventDefault(),i.stopPropagation(),(l=r[o])==null||l.click()):i.key==="ArrowLeft"&&t&&(i.preventDefault(),i.stopPropagation(),cc(t),(c=t.el.querySelector("button.has-sub"))==null||c.focus())}),e}function lc(s){let t=Rn;for(;t;){if(t.el===s)return t;t=t.child}return null}function cc(s){let t=s.child;for(;t;)t.el.remove(),t=t.child;s.child=null}function cd(s,t,e,n=t){if(!Zi)throw new Error("menu host not set");s.style.left="0px",s.style.top="0px",Zi.append(s);const i=Zi.getBoundingClientRect(),r=s.offsetWidth,o=s.offsetHeight;let a=t-i.left,l=e-i.top;return a+r>i.width-2&&(a=Math.max(2,n-i.left-r)),l+o>i.height-32&&(l=Math.max(2,i.height-32-o)),s.style.left=`${Math.round(a)}px`,s.style.top=`${Math.round(l)}px`,s}function zs(s,t,e,n,i=!1){var o;Ai();const r=ld(s,null);Rn={el:r,child:null},cd(r,t,e),ac=n??null,i&&((o=r.querySelector("button:not([aria-disabled])"))==null||o.focus())}function hd(s,t,e){const n=t.getBoundingClientRect();if(zs(s,n.right-2,n.top-3,e),Rn){const i=Zi==null?void 0:Zi.getBoundingClientRect();i&&n.right+Rn.el.offsetWidth>i.right&&(Rn.el.style.left=`${Math.max(2,n.left-i.left-Rn.el.offsetWidth+2)}px`)}}function MM(s,t){s.addEventListener("contextmenu",e=>{const n=e.target;if(n.closest("input, textarea, [contenteditable], .oikos-tube"))return;const i=t(n,e);if(i!==null){if(e.preventDefault(),!i.length){Ai();return}zs(i,e.clientX,e.clientY)}})}function V(s,t={},e=[]){const n=document.createElement(s);for(const[i,r]of Object.entries(t))i==="html"?n.innerHTML=r:n.setAttribute(i,r);for(const i of e)n.append(i);return n}function hc(s){const t=V("div",{class:"xp-menubar",role:"menubar"});let e=null;const n=(i,r,o)=>{var c;const a=(c=s[r])==null?void 0:c.call(s);if(!a)return;const l=i.getBoundingClientRect();zs(a,l.left,l.bottom,()=>{i.classList.remove("open"),e===i&&(e=null)},o),i.classList.add("open"),e=i};for(const i of Object.keys(s)){const r=V("button",{type:"button",class:"xp-menutitle",role:"menuitem","aria-haspopup":"menu","data-menu-owner":""},[i]);r.addEventListener("click",()=>{e===r?Ai():n(r,i,!1)}),r.addEventListener("pointerenter",()=>{e&&e!==r&&_M()&&n(r,i,!1)}),r.addEventListener("keydown",o=>{(o.key==="ArrowDown"||o.key==="Enter"||o.key===" ")&&(o.preventDefault(),n(r,i,!0))}),t.append(r)}return t.append(V("span",{class:"xp-throbber",html:Ro(18,!0)})),t}function ud(s){const t=V("div",{class:"xp-toolbar"}),e=(o,a,l,c=!0)=>{const u=V("button",{class:"xp-tb",type:"button",title:a,html:`${o}${c?`<span>${a}</span>`:""}`});return l?u.addEventListener("click",l):u.disabled=!0,t.append(u),u},n=e(aM(),"Back",s.back),i=e(lM(),"Forward",s.forward,!1);e(cM(),"Up",s.up,!1),t.append(V("span",{class:"xp-tb-sep"})),e(hM(),"Search",s.search),e(uM(),"Folders",s.folders);const r=()=>{if(!s.can)return;const o=s.can();n.disabled=!s.back||!o.back,i.disabled=!s.forward||!o.forward};return r(),{el:t,refresh:r}}function dd(s,t,e,n){const i=V("div",{class:"xp-address"});i.append(V("span",{class:"lbl"},["Address"]));const r=V("label",{class:"field",html:s});let o=null;e?(o=V("input",{type:"text",value:t,"aria-label":"Address",spellcheck:"false"}),o.style.cssText="flex:1;min-width:0;border:0;outline:0;font:inherit;background:transparent;",r.append(o),o.addEventListener("keydown",l=>{l.key==="Enter"&&o&&(n==null||n(o.value)),l.stopPropagation()})):r.append(V("span",{},[t])),i.append(r);const a=V("button",{class:"go",type:"button",html:`${dM()}<span>Go</span>`});return a.addEventListener("click",()=>n==null?void 0:n((o==null?void 0:o.value)??t)),i.append(a),{el:i,input:o}}function Hs(s,t,e=!1){const n=V("section",{class:`xp-taskgroup${e?" primary":""}`}),i=V("header",{role:"button",tabindex:"0","aria-expanded":"true"},[s]),r=()=>{n.classList.toggle("collapsed"),i.setAttribute("aria-expanded",String(!n.classList.contains("collapsed")))};i.addEventListener("click",r),i.addEventListener("keydown",a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),r())}),n.append(i);const o=V("div",{class:"xp-taskbody"});if(t instanceof HTMLElement)o.append(t);else{const a=V("ul");for(const l of t){const c=V("li");let u;if(l.href)u=V("a",{class:"xp-link",href:l.href,html:`${l.icon}<span></span>`}),l.external&&(u.setAttribute("target","_blank"),u.setAttribute("rel","noopener"));else{u=V("button",{class:"xp-link",type:"button",html:`${l.icon}<span></span>`});const d=l.run;d?u.addEventListener("click",d):u.setAttribute("aria-disabled","true")}const h=u.querySelector("span");h&&(h.textContent=l.label),c.append(u),a.append(c)}o.append(a)}return n.append(o),n}function fd(){const s=V("div",{class:"xp-statusbar",role:"status"}),t=V("span"),e=V("span",{class:"zone"});return s.append(t,e),{el:s,set(n,i){t.textContent=n;const[r,o]=i==="computer"?[ju(),"My Computer"]:[Qu(),"Internet"];e.innerHTML=`${r}<span>${o}</span>`}}}const yM={dreams:["chronicle","dreams-api","dream_gen"],chronicle:["dreams","dream_gen"],"dreams-api":["dreams","chronicle"],dream_gen:["dreams","chronicle"],transmissions:["irc","syrinx"],apeiron:["dreams","syrinx"],syrinx:["apeiron","afterlife"],afterlife:["syrinx","apeiron"],irc:["transmissions","parlor"],parlor:["irc","transmissions"]};function pd(s){return/^https?:/.test(s.href)?s.href:`${location.origin}${s.href}`}function md(s){return s.group==="here"?"computer":"internet"}function uc(s,t){var i;const e=pd(t),n=(i=navigator.clipboard)==null?void 0:i.writeText(e);if(!n){s.balloon("Could not copy",e);return}n.then(()=>s.balloon("Copied",e),()=>s.balloon("Could not copy",e))}function Po(s,t,e=!1){const n=[];return e?n.push({label:`Open ${t.title}`,bold:!0,run:()=>s.open(t)}):(n.push({label:"Play",bold:!0,run:()=>s.play(t.id)}),n.push({label:`Go to ${t.title}`,run:()=>s.open(t)})),n.push({label:"Look at its screen",run:()=>s.look(t.id),disabled:!s.canTune}),t.tune&&n.push({label:"Watch it here",run:()=>s.tuneIn(t.id),disabled:!s.canTune}),t.id==="irc"&&n.push({label:"Join in mIRC",run:()=>s.chat("#aethera")}),n.push("sep",{label:"Copy Address",run:()=>uc(s,t)}),e||n.push("sep",{label:"Properties",run:()=>s.play(t.id)}),n}function gd(s,t){return[{label:"Undo",shortcut:"Ctrl+Z",disabled:!0},"sep",{label:"Cut",shortcut:"Ctrl+X",disabled:!0},{label:"Copy",shortcut:"Ctrl+C",disabled:!t,run:()=>t&&uc(s,t)},{label:"Paste",shortcut:"Ctrl+V",disabled:!0},"sep",{label:"Select All",shortcut:"Ctrl+A",disabled:!0},{label:"Invert Selection",disabled:!0}]}function xd(s){return[{label:"Add to Favorites...",disabled:!0},{label:"Organize Favorites...",disabled:!0},"sep",...s.dir.sites.filter(t=>t.group==="here").map(t=>({label:t.title,icon:Cn(t.accent),run:()=>s.play(t.id)}))]}function vd(){return[{label:"Map Network Drive...",disabled:!0},{label:"Disconnect Network Drive...",disabled:!0},{label:"Synchronize...",disabled:!0},"sep",{label:"Folder Options...",disabled:!0}]}function _d(s){return[{label:"Help and Support Center",disabled:!0},"sep",{label:"About æthera",run:()=>s.about()}]}function dc(s){s.hidden=!s.hidden}function Md(s,t){return[{label:"Toolbars",submenu:()=>[{label:"Standard Buttons",checked:!t.toolbar.hidden,run:()=>dc(t.toolbar)},{label:"Address Bar",checked:!t.address.hidden,run:()=>dc(t.address)}]},{label:"Status Bar",checked:!t.status.hidden,run:()=>dc(t.status)},...t.views?["sep",...t.views]:[],"sep",{label:"Go To",submenu:()=>[{label:"Back",shortcut:"Alt+Left",disabled:!s.canBack,run:()=>s.back()},{label:"Forward",shortcut:"Alt+Right",disabled:!s.canForward,run:()=>s.forward()},{label:"Up One Level",disabled:!t.up,run:()=>{var e;return(e=t.up)==null?void 0:e.call(t)}},"sep",{label:"Home Page",shortcut:"Alt+Home",run:()=>s.home()}]},{label:"Refresh",shortcut:"F5",run:()=>t.refresh()}]}class bM{constructor(t,e){R(this,"win",null);R(this,"selected",null);R(this,"tiles",new Map);R(this,"tasks",null);R(this,"status",null);R(this,"content",null);R(this,"view","tiles");this.shell=t,this.wm=e}get isOpen(){return!!this.win&&!this.win.closed}open(){var u;if(this.isOpen&&this.win){this.win.minimized?this.win.restore():this.win.focus();return}this.tiles.clear();const t=V("div");t.style.cssText="display:flex;flex-direction:column;min-height:0;flex:1;";const{dir:e}=this.shell,n=ud({back:()=>this.shell.back(),forward:()=>this.shell.forward(),can:()=>({back:this.shell.canBack,forward:this.shell.canForward}),search:()=>{var h;return(h=i.input)==null?void 0:h.focus()},folders:()=>{var h;return(h=this.tasks)==null?void 0:h.toggleAttribute("hidden")}}),i=dd(_r(),"~/æthera",!0,h=>this.go(h));(u=i.input)==null||u.addEventListener("input",()=>{var h;return this.filter(((h=i.input)==null?void 0:h.value)??"")}),this.status=fd();const r=()=>this.selected?this.shell.site(this.selected)??null:null;t.append(hc({File:()=>this.fileMenu(),Edit:()=>gd(this.shell,r()),View:()=>{var h;return Md(this.shell,{toolbar:n.el,address:i.el,status:((h=this.status)==null?void 0:h.el)??V("div"),views:this.viewItems(),refresh:()=>{i.input&&(i.input.value="~/æthera"),this.filter("")}})},Favorites:()=>xd(this.shell),Tools:()=>vd(),Help:()=>_d(this.shell)}),n.el,i.el);const o=this.shell.onNav(()=>n.refresh()),a=V("div",{class:"xp-body"});this.tasks=V("aside",{class:"xp-tasks"}),a.append(this.tasks);const l=V("div",{class:`xp-content view-${this.view}`,role:"listbox","aria-label":"tapes"});this.content=l,l.addEventListener("pointerdown",h=>{h.button===0&&!h.target.closest(".xp-tile")&&this.select(null)});const c=(h,d)=>{if(!d.length)return;l.append(V("h3",{class:"xp-group-head"},[h]));const f=V("div",{class:"xp-tiles"});for(const p of d)f.append(this.tile(p));l.append(f)};if(c("Tapes Stored on This Server",e.sites.filter(h=>h.group==="here")),c("Other Places on the Wired",e.sites.filter(h=>h.group==="wired")),e.files.length){l.append(V("h3",{class:"xp-group-head"},["Files"]));const h=V("div",{class:"xp-tiles"});for(const d of e.files){const f=d.title.split(".").pop()??"txt",p=V("a",{class:"xp-tile",href:d.href,html:`${Bs(f)}<span><span class="t"></span><span class="k"></span></span>`});p.querySelector(".t").textContent=d.title,p.querySelector(".k").textContent=d.about,h.append(p)}l.append(h)}a.append(l),t.append(a),t.append(this.status.el),this.win=this.wm.open({id:"home",title:"~  (home directory)",icon:_r(),body:t,width:Math.round(Math.min(680,Math.max(420,innerWidth*.46))),dock:"left",onClose:()=>{o(),this.win=null,this.content=null,this.selected=null}}),this.win.el.style.height="min(560px, calc(100% - 40px))",this.renderTasks(),this.renderStatus()}close(){var t;(t=this.win)==null||t.close()}fileMenu(){const t=this.selected?this.shell.site(this.selected):void 0;return[...t?Po(this.shell,t):[{label:"Play",bold:!0,disabled:!0}],"sep",{label:"New",disabled:!0,submenu:()=>[]},"sep",{label:"Create Shortcut",disabled:!0},{label:"Delete",disabled:!0},{label:"Rename",disabled:!0},"sep",{label:"Close",run:()=>this.close()}]}viewItems(){const t=e=>()=>{this.view=e,this.content&&(this.content.className=`xp-content view-${e}`)};return[{label:"Tiles",checked:this.view==="tiles",run:t("tiles")},{label:"Icons",checked:this.view==="icons",run:t("icons")},{label:"List",checked:this.view==="list",run:t("list")}]}contextFor(t){const e=this.shell.site(t);return e?(this.select(t,!0),Po(this.shell,e)):null}blankMenu(){return[{label:"View",submenu:()=>this.viewItems()},{label:"Arrange Icons By",disabled:!0,submenu:()=>[]},"sep",{label:"Refresh",run:()=>this.filter("")},"sep",{label:"Paste",disabled:!0},{label:"Paste Shortcut",disabled:!0},"sep",{label:"New",disabled:!0,submenu:()=>[]},"sep",{label:"Properties",disabled:!0}]}tile(t){const e=V("button",{class:"xp-tile",type:"button",role:"option","data-id":t.id,html:`${Cn(t.accent,t.title)}<span><span class="t"></span><span class="k"></span><span class="d"></span></span>`});return e.querySelector(".t").textContent=t.title,e.querySelector(".k").textContent=t.kind,e.querySelector(".d").textContent=t.tagline,e.title=t.tagline,e.addEventListener("click",()=>this.select(t.id,!0)),e.addEventListener("dblclick",()=>this.shell.play(t.id)),e.addEventListener("keydown",n=>{if(n.key==="Enter"&&this.shell.play(t.id),["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(n.key)){n.preventDefault(),n.stopPropagation();const i=[...this.tiles.values()].filter(a=>!a.hidden),r=i.indexOf(e),o=i[(r+(n.key==="ArrowRight"||n.key==="ArrowDown"?1:-1)+i.length)%i.length];o==null||o.focus(),o!=null&&o.dataset.id&&this.select(o.dataset.id,!0)}}),e.addEventListener("pointerup",n=>{n.pointerType==="touch"&&this.selected===t.id&&e.dataset.armed&&this.shell.play(t.id),e.dataset.armed="1"}),this.tiles.set(t.id,e),e}select(t,e=!1){if(t!==this.selected){this.selected=t;for(const[n,i]of this.tiles)i.classList.toggle("selected",n===t),i.setAttribute("aria-selected",String(n===t)),n!==t&&delete i.dataset.armed;e&&this.shell.select(t),this.renderTasks(),this.renderStatus()}}filter(t){const e=t.replace(/^~\/?(æthera)?\/?/i,"").trim().toLowerCase();for(const[n,i]of this.tiles){const r=this.shell.site(n);i.hidden=!!e&&!`${r==null?void 0:r.title} ${r==null?void 0:r.kind} ${r==null?void 0:r.tagline}`.toLowerCase().includes(e)}}go(t){const e=t.replace(/^~\/?(æthera)?\/?/i,"").trim().toLowerCase();if(!e)return;const n=this.shell.dir.sites.find(i=>i.title.toLowerCase()===e)??this.shell.dir.sites.find(i=>`${i.title} ${i.kind} ${i.tagline}`.toLowerCase().includes(e));n?this.shell.play(n.id):this.shell.balloon("Cannot find it",`There is no tape called “${t}” in ~.`)}renderTasks(){if(!this.tasks)return;const t=this.selected?this.shell.site(this.selected):void 0,e=t?[{icon:oc(),label:"Play this tape",run:()=>this.shell.play(t.id)},{icon:nd(),label:"Look at its screen",run:()=>this.shell.look(t.id)},{icon:Qu(),label:`Go to ${t.title}`,run:()=>this.shell.open(t)}]:[{icon:oc(),label:"Select a tape to play it"},{icon:id(),label:"Eject the tape",run:()=>this.shell.eject()}],n=[{icon:ju(),label:"æthera",href:"/"},{icon:Bs("xml"),label:"feed.xml",href:"/feed.xml"},{icon:Bs("txt"),label:"llms.txt",href:"/llms.txt"}],i=V("div",{class:"xp-details"});if(t){i.append(V("b",{},[t.title]));const r=V("dl");for(const[o,a]of t.details)r.append(V("dt",{},[o]),V("dd",{},[a]));i.append(r)}else{const r=this.shell.dir.sites.filter(o=>o.group==="here").length;i.append(V("b",{},["~"]),V("span",{},[`home directory · ${r} tapes here, ${this.shell.dir.sites.length-r} elsewhere on the Wired`]))}this.tasks.replaceChildren(Hs(t?"Tape Tasks":"System Tasks",e,!0),Hs("Other Places",n),Hs("Details",i))}renderStatus(){var n;const t=this.selected?this.shell.site(this.selected):void 0,e=this.shell.dir.sites.length+this.shell.dir.files.length;(n=this.status)==null||n.set(t?`${t.title} — ${t.tagline}`:`${e} objects`,t?md(t):"computer")}}const SM=4001,wM=4002,EM=s=>s>=4e3&&s<5e3,TM=4;class AM{constructor(t,e,n){R(this,"ws",null);R(this,"tries",0);R(this,"timer",0);R(this,"wanted",!1);R(this,"welcomed",!1);R(this,"refused",!1);this.nick=t,this.password=e,this.on=n}get open(){var t;return this.welcomed&&((t=this.ws)==null?void 0:t.readyState)===WebSocket.OPEN}connect(){this.wanted=!0,this.refused=!1,clearTimeout(this.timer);const t=location.protocol==="https:"?"wss":"ws";let e;try{e=new WebSocket(`${t}://${location.host}/ws/chat`)}catch{this.on.closed(!1,!1,!1);return}this.ws=e,this.welcomed=!1,e.onopen=()=>{e.send(JSON.stringify({type:"hello",nick:this.nick,password:this.password||null}))},e.onmessage=n=>{let i;try{i=JSON.parse(String(n.data))}catch{return}switch(i.type){case"welcome":{const r=i;this.welcomed=!0,this.tries=0,this.nick=r.nick,this.on.welcome(r);break}case"event":{const r=i.event;if(!r)break;r.kind==="nick"&&r.nick===this.nick&&r.target&&(this.nick=r.target),this.on.event(r);break}case"whois":this.on.whois(i);break;case"error":{this.welcomed||(this.refused=!0),this.on.error(String(i.code??""),String(i.text??""));break}}},e.onclose=n=>{if(this.ws!==e)return;this.ws=null;const i=n.code===SM,r=n.code===wM,o=this.wanted&&!EM(n.code)&&!this.refused&&this.tries<TM;if(this.welcomed=!1,this.on.closed(o,i,r),!o){this.wanted=!1;return}this.tries++,this.timer=window.setTimeout(()=>this.connect(),2e3*2**(this.tries-1))}}send(t){if(!this.open||!this.ws)return!1;try{return this.ws.send(JSON.stringify(t)),!0}catch{return!1}}part(t="Leaving"){if(this.open&&this.ws)try{this.ws.send(JSON.stringify({type:"part",reason:t}))}catch{}this.close()}close(){this.wanted=!1,clearTimeout(this.timer);const t=this.ws;if(this.ws=null,this.welcomed=!1,this.password=null,t){t.onclose=null;try{t.close()}catch{}}}}const kt="#aethera",Pt="#oikos",Hn="irc.aetherawi.red",fc=6667,pc="guest",yd="always falling apart",CM=600,RM=6e3,bd="oikos-mirc-nick",PM=/^[A-Za-z[\]\\`_^{|}][A-Za-z0-9[\]\\`_^{|}-]{0,15}$/,mc=["~","&","@","%","+"];function LM(s){const t=new Date(s);return`[${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}]`}function DM(s){return Date.now()-(performance.now()-s)}function gc(s){const t=si(s)||"anon",e=qo(t),n=["dialup.wired.net","cable.aether.org","dsl.lain.jp","adsl.nowhere.nu","res.navi.co"],i=n[Math.floor(e*n.length)]??n[0],r=Math.floor(e*251)+2,o=Math.floor(qo(`${t}.`)*251)+2;return`~${t.slice(0,9).toLowerCase()}@ppp-${r}-${o}.${i}`}function si(s){return s.replace(/^[~&@%+]+/,"")}function Sd(s){const t=s.charAt(0);return mc.includes(t)?t:""}function IM(){try{return localStorage.getItem(bd)??""}catch{return""}}function wd(s){try{localStorage.setItem(bd,s)}catch{}}function xc(s){s.addEventListener("keydown",t=>{t.key!=="Escape"&&t.stopPropagation()})}class vc{constructor(t,e,n){R(this,"tab");R(this,"pane");R(this,"log");R(this,"nicksEl");R(this,"nicks",new Map);R(this,"topic","");R(this,"joined",!1);this.id=t;const i=`mirc-pane-${t==="status"?"status":t.slice(1)}`;this.tab=V("button",{type:"button",role:"tab","aria-controls":i,html:`${e}<span></span>`}),this.tab.querySelector("span").textContent=t==="status"?"Status":t,this.log=V("div",{class:"mirc-log",role:"log","aria-label":t==="status"?"Status":t}),n?(this.log.setAttribute("aria-live","polite"),this.nicksEl=V("ul",{class:"mirc-nicks","aria-label":`Nicknames in ${t}`}),this.pane=V("div",{class:"mirc-pane",id:i,role:"tabpanel"},[V("div",{class:"mirc-split"},[this.log,this.nicksEl])])):(this.nicksEl=null,this.pane=V("div",{class:"mirc-pane",id:i,role:"tabpanel"},[this.log]))}setNick(t,e=Sd(t)){const n=si(t);n&&this.nicks.set(n.toLowerCase(),{name:n,mode:e})}seen(t){const e=si(t);if(!e)return!1;const n=e.toLowerCase(),i=this.nicks.get(n),r=Sd(t)||(i==null?void 0:i.mode)||"";return i&&i.mode===r&&i.name===e?!1:(this.nicks.set(n,{name:e,mode:r}),!0)}drop(t){return this.nicks.delete(si(t).toLowerCase())}rename(t,e){const n=this.nicks.get(si(t).toLowerCase());this.drop(t),this.setNick(e,(n==null?void 0:n.mode)??"")}render(){if(!this.nicksEl)return;const t=n=>n?mc.indexOf(n):mc.length,e=[...this.nicks.values()].sort((n,i)=>t(n.mode)-t(i.mode)||n.name.localeCompare(i.name,void 0,{sensitivity:"base"}));this.nicksEl.replaceChildren(...e.map(n=>V("li",{title:`${n.mode}${n.name}`},[`${n.mode}${n.name}`])))}}class NM{constructor(t,e,n){R(this,"win");R(this,"wins");R(this,"view",kt);R(this,"input");R(this,"me",pc);R(this,"link",null);R(this,"hintedOikos",!1);R(this,"livingSeenAt",0);R(this,"livingOnce",!1);R(this,"greeted",!1);R(this,"hung",!1);R(this,"lastAt",-1);R(this,"seenFragments");R(this,"seenCollapse",null);R(this,"wasConnected",!1);R(this,"rejoinTimer",0);R(this,"off");var c;this.shell=t,this.wm=e;const i=V("div",{class:"mirc"});i.append(hc({File:()=>[{label:"Connect...",run:()=>this.joinLiving(),disabled:!!this.link},{label:"Disconnect",run:()=>this.partLiving(),disabled:!this.link},"sep",{label:"Select Server...",disabled:!0},"sep",{label:"Exit",run:()=>this.win.close()}],Tools:()=>[{label:"Address Book...",disabled:!0},{label:"Options...",shortcut:"Alt+O",disabled:!0}],Commands:()=>[{label:`Join ${Pt}`,run:()=>this.joinLiving()},{label:`Part ${Pt}`,run:()=>this.partLiving(),disabled:!this.link},"sep",{label:"Clear buffer",run:()=>this.wins[this.view].log.replaceChildren()}],Window:()=>["status",kt,Pt].filter(u=>!this.wins[u].tab.hidden).map(u=>({label:u==="status"?"Status":u,checked:this.view===u,run:()=>this.show(u)})),Help:()=>[{label:"Commands",shortcut:"F1",run:()=>this.help()},"sep",{label:"About æthera",run:()=>this.shell.about()}]}));const r=V("div",{class:"mirc-switch",role:"tablist"});this.wins={status:new vc("status",Ti("status"),!1),[kt]:new vc(kt,Ti("channel"),!0),[Pt]:new vc(Pt,Ti("channel"),!0)},this.wins[kt].topic=yd,this.wins[Pt].tab.hidden=!0;const o=V("div",{class:"mirc-mdi"});for(const u of Object.values(this.wins))u.tab.addEventListener("click",()=>this.show(u.id)),r.append(u.tab),o.append(u.pane);this.input=V("input",{class:"mirc-input",type:"text",spellcheck:"false",autocomplete:"off",maxlength:"400","aria-label":"Message"}),xc(this.input),this.input.addEventListener("keydown",u=>{if(u.key!=="Enter")return;u.preventDefault();const h=this.input.value;this.input.value="",this.say(h)}),i.append(r,o,this.input),this.win=e.open({id:"mirc",title:"mIRC",icon:Ti("app"),body:i,width:Math.round(Math.min(760,Math.max(460,innerWidth*.52))),dock:"center",onClose:()=>{var u,h;clearTimeout(this.rejoinTimer),this.off(),(u=this.link)==null||u.part("Leaving"),this.link=null,(h=this.wm.get("mirc-connect"))==null||h.close(),n()},onFocus:()=>{innerWidth>720&&this.input.focus({preventScroll:!0})}}),this.win.el.classList.add("mirc-window"),this.win.el.style.height="min(540px, calc(100% - 24px))";const a=this.win.el.parentElement;if(a){const u=this.win.el.offsetTop+this.win.el.offsetHeight-(a.clientHeight-8);u>0&&this.win.moveTo(this.win.el.offsetLeft,this.win.el.offsetTop-u)}const l=this.shell.feeds.irc.value;this.seenFragments=l.fragments,this.seenCollapse=((c=l.collapse)==null?void 0:c.at)??null,this.show(kt),l.connected?this.connect(l):this.push("status","info",`* Connecting to ${Hn} (${fc})`),this.off=this.shell.feeds.irc.on(u=>this.update(u))}focus(t){this.win.minimized?this.win.restore():this.win.focus();const e=t===kt||t===Pt||t==="status"?this.wins[t]:null;e&&!e.tab.hidden&&this.show(e.id)}update(t){var n;if(t.connected&&!this.wasConnected?this.connect(t):!t.connected&&this.wasConnected&&this.disconnect(),!t.connected)return;for(const i of t.lines)i.at<=this.lastAt||(this.rejoinTimer&&this.rejoin(),this.lastAt=i.at,this.line(i));const e=((n=t.collapse)==null?void 0:n.at)??null;e!==null&&e!==this.seenCollapse&&t.collapse&&this.collapse(t.collapse.type),this.seenCollapse=e,t.fragments!==this.seenFragments&&(this.seenFragments=t.fragments,clearTimeout(this.rejoinTimer),this.hung?this.rejoinTimer=window.setTimeout(()=>this.rejoin(),RM):this.rejoin())}connect(t){this.wasConnected=!0;const e=(i,r)=>this.push("status",i,r);if(this.greeted){e("info",`* Reconnected to ${Hn}`),this.joinHaunted(),t.collapse&&this.collapse(t.collapse.type);return}this.greeted=!0,e("info",`* Connecting to ${Hn} (${fc})`),e("notice",`-${Hn}- *** Looking up your hostname...`),e("notice",`-${Hn}- *** Found your hostname`),e("text",`Welcome to the æthera IRC Network ${this.me}!${this.me}@oikos`),e("text",`Your host is ${Hn}, running version hauntd-2.8.21`),e("text",`- ${Hn} Message of the Day -`),e("text","- nobody here is who they were."),e("text","- every line is a replay; every replay is live."),e("text",`- ${kt} is moderated: the living listen.`),e("text",`- the living talk in ${Pt}. /join ${Pt}`),e("text","End of /MOTD command."),e("mode",`* ${this.me} sets mode: +i`),this.joinHaunted();const n=t.lines.filter(i=>i.at>this.lastAt);if(n.length){this.push(kt,"info","*** Buffer Playback...");for(const i of n)this.line(i);this.push(kt,"info","*** Playback Complete.")}this.lastAt=Math.max(this.lastAt,...t.lines.map(i=>i.at)),t.collapse&&this.collapse(t.collapse.type)}joinHaunted(){const t=this.wins[kt];t.joined=!0,t.nicks.clear(),t.setNick(this.me,""),this.push(kt,"join",`* Now talking in ${kt}`),this.push(kt,"topic",`* Topic is '${t.topic}'`),this.push(kt,"topic","* Set by ChanServ"),this.nicksChanged(kt)}disconnect(){clearTimeout(this.rejoinTimer),this.rejoinTimer=0,this.wasConnected=!1;const t=this.wins[kt];t.joined=!1,this.setHung(!1),this.push("status","info",`* Disconnected from ${kt}`),this.push(kt,"info","* Disconnected"),t.nicks.clear(),this.nicksChanged(kt)}collapse(t){const e=t.replace(/_/g," ");this.push("status","notice",`-${Hn}- *** Notice -- ${e} on ${kt}`),this.setHung(!0)}rejoin(){clearTimeout(this.rejoinTimer),this.rejoinTimer=0,this.setHung(!1),this.push(kt,"info",`* Attempting to rejoin channel ${kt}`),this.wins[kt].topic=yd,this.joinHaunted()}line(t){const e=this.wins[kt],n=t.nick,i=si(n),r=t.content,o=t.wallAt??DM(t.at),a=(c,u)=>this.push(kt,c,u,o);let l=!1;switch(t.type){case"message":l=e.seen(n),a("text",`<${n}> ${r}`);break;case"action":{const c=/^sets mode: ([+-])([a-z]+) (.+)$/i.exec(r);c?(e.seen(n),this.applyMode(c[1]??"+",c[2]??"",(c[3]??"").split(/\s+/)),l=!0,a("mode",`* ${n} ${r}`)):/^has quit\b/i.test(r)?(l=e.drop(n),a("quit",`* ${i} ${r.replace(/^has quit\b/i,"has quit IRC")}`)):(l=e.seen(n),a("action",`* ${n} ${r}`));break}case"join":l=e.seen(n),a("join",`* ${i} (${gc(n)}) has joined ${kt}`);break;case"part":l=e.drop(n),a("part",`* ${i} (${gc(n)}) has left ${kt}${r?` (${r})`:""}`);break;case"quit":l=e.drop(n),a("quit",`* ${i} (${gc(n)}) Quit (${r||"Client exited"})`);break;case"kick":{const c=t.reason||r;t.target?(l=e.drop(t.target),a("kick",`* ${si(t.target)} was kicked by ${i}${c?` (${c})`:""}`)):a("kick",`* ${i} kicks${c?` (${c})`:""}`);break}default:{const c=/changes topic to '(.*)'$/i.exec(r);if(c){e.topic=c[1]??e.topic,a("topic",`* ${r}`),this.retitle();break}const u=r||n;a("info",/^[*<]/.test(u)||u.length<6?u:`* ${u}`)}}!e.nicks.has(this.me.toLowerCase())&&e.joined&&(e.setNick(this.me,""),l=!0),l&&this.nicksChanged(kt)}applyMode(t,e,n){const i=this.wins[kt],r={q:"~",a:"&",o:"@",h:"%",v:"+"};[...e].forEach((o,a)=>{const l=n[a],c=r[o];if(!l||!c)return;const u=i.nicks.get(si(l).toLowerCase());i.setNick((u==null?void 0:u.name)??si(l),t==="+"?c:(u==null?void 0:u.mode)===c?"":(u==null?void 0:u.mode)??"")})}joinLiving(){if(this.link&&this.wins[Pt].joined){this.show(Pt);return}if(this.link){this.push(this.view,"info",`* Still connecting to ${Pt}...`);return}this.connectDialog()}partLiving(){if(!this.link)return;this.link.part("Leaving"),this.link=null;const t=this.wins[Pt];t.joined=!1,t.nicks.clear(),this.nicksChanged(Pt),this.push(Pt,"part",`* You have left ${Pt}`),this.push("status","info",`* Disconnected from ${Pt}`),this.livingSeenAt=0,this.livingOnce=!1,this.renameMe(pc)}connectDialog(t){var u;(u=this.wm.get("mirc-connect"))==null||u.close();const e=V("form",{class:"mirc-connect"}),n=V("input",{type:"text",value:IM(),maxlength:"16",spellcheck:"false",autocomplete:"nickname",required:""}),i=V("input",{type:"password",maxlength:"256",autocomplete:"current-password"});xc(n),xc(i);const r=V("p",{class:"err",role:"alert"});r.textContent=t??"",r.hidden=!t,e.append(V("div",{class:"xp-dialog-body"},[V("span",{html:Ti("app")}),V("div",{},[V("p",{},[`Join ${Pt}, where the living talk.`]),V("label",{},["Nickname:",n]),V("label",{},["Password (optional):",i]),V("p",{class:"hint"},["A password gives you a tripcode, the same one your blog comments carry. It is never stored."]),r])]));const o=V("div",{class:"xp-actions"}),a=V("button",{class:"xp-btn default",type:"submit"},["Connect"]),l=V("button",{class:"xp-btn",type:"button"},["Cancel"]);o.append(a,l),e.append(o);const c=this.wm.open({id:"mirc-connect",title:"mIRC Connect",icon:Ti("app"),body:e,width:360,dialog:!0});l.addEventListener("click",()=>c.close()),e.addEventListener("keydown",h=>{h.key==="Escape"&&(h.preventDefault(),c.close(),this.input.focus({preventScroll:!0}))}),e.addEventListener("submit",h=>{h.preventDefault();const d=n.value.trim();if(!PM.test(d)){r.textContent="A nickname starts with a letter and has at most 16 letters, digits or - _ [ ] { } | ^ `",r.hidden=!1,n.focus();return}wd(d),c.close(),this.dial(d,i.value||null)}),n.focus(),n.select()}dial(t,e){this.push("status","info",`* Connecting to ${Pt} as ${t}${e?" (with a tripcode)":""}`);const n=new AM(t,e,{welcome:i=>this.welcomed(i),event:i=>this.event(i),whois:i=>this.whoisReply(i),error:(i,r)=>this.chatError(i,r),closed:(i,r,o)=>this.dropped(i,r,o)});this.link=n,n.connect()}welcomed(t){const e=this.wins[Pt];e.tab.hidden=!1,e.joined=!0,e.topic=t.topic,e.nicks.clear();for(const r of t.names)e.setNick(r.nick,r.op?"@":"");this.renameMe(t.nick);const n=this.livingOnce;this.livingOnce=!0;const i=t.backlog.filter(r=>r.at>this.livingSeenAt);if(n?this.push(Pt,"join",`* Rejoined ${Pt}`):(this.push("status","text",`* You are now known as ${t.nick} (${t.mask})`),t.op&&this.push("status","mode",`* ${Hn} sets mode: +o ${t.nick}`),this.push(Pt,"join",`* Now talking in ${Pt}`),this.push(Pt,"topic",`* Topic is '${t.topic}'`)),i.length){this.push(Pt,"info","*** Buffer Playback...");for(const r of i)this.event(r,!0);this.push(Pt,"info","*** Playback Complete.")}this.nicksChanged(Pt),n||this.show(Pt)}event(t,e=!1){const n=this.wins[Pt],i=(o,a)=>this.push(Pt,o,a,t.at),r=t.nick===this.me;switch(this.livingSeenAt=Math.max(this.livingSeenAt,t.at),t.kind){case"message":i(r?"own":"text",`<${t.nick}> ${t.text}`);return;case"action":i("action",`* ${t.nick} ${t.text}`);return;case"join":i("join",`* ${t.nick} (${t.mask??""}) has joined ${Pt}`),e||n.setNick(t.nick,"");break;case"part":i("part",`* ${t.nick} (${t.mask??""}) has left ${Pt}${t.text?` (${t.text})`:""}`),e||n.drop(t.nick);break;case"quit":i("quit",`* ${t.nick} (${t.mask??""}) Quit (${t.text||"Client exited"})`),e||n.drop(t.nick);break;case"kick":t.target===this.me&&!e?(i("kick",`* You were kicked from ${Pt} by ${t.nick} (${t.text})`),n.joined=!1,n.nicks.clear()):(i("kick",`* ${t.target??"?"} was kicked by ${t.nick} (${t.text})`),!e&&t.target&&n.drop(t.target));break;case"nick":r&&!e&&t.target?(i("text",`* Your nick is now ${t.target}`),this.renameMe(t.target),wd(t.target)):i("text",`* ${t.nick} is now known as ${t.target??"?"}`),!e&&t.target&&n.rename(t.nick,t.target);break;case"topic":i("topic",`* ${t.nick} changes topic to '${t.text}'`),e||(n.topic=t.text);break}e||this.nicksChanged(Pt)}whoisReply(t){const e=n=>this.push(this.view,"text",n);e(`${t.nick} is ${t.mask} * ${t.nick}`),t.trip&&e(`${t.nick} is identified by tripcode ${t.trip}`),t.op&&e(`${t.nick} is a channel operator on ${Pt}`),e(`${t.nick} signed on ${new Date(t.signon).toLocaleString()}`),e(`${t.nick} End of /WHOIS list.`)}chatError(t,e){var r;const n=this.wins[Pt],i=e.replace(/^(\S+) :/,"$1 ");this.push(n.joined?Pt:"status","error",`* ${i}`),!n.joined&&(t==="432"||t==="433")&&((r=this.link)==null||r.close(),this.link=null,this.livingOnce=!1,this.livingSeenAt=0,this.connectDialog(e.replace(/^\S+ :/,"")))}dropped(t,e,n){const i=this.wins[Pt],r=i.joined;i.joined=!1,i.nicks.clear(),this.nicksChanged(Pt),n?this.push(Pt,"info",`* ${this.me} is connected from somewhere else now (another window?); this one let go`):r&&!e&&this.push(Pt,"info",`* Disconnected${t?" (reconnecting...)":""}`),this.push("status","info",`* Disconnected from ${Pt}${t?" (reconnecting...)":""}`),t||(this.link=null,this.livingOnce=!1,this.livingSeenAt=0,this.renameMe(pc))}renameMe(t){if(t===this.me)return;const e=this.wins[kt];e.joined&&(e.rename(this.me,t),this.nicksChanged(kt)),this.me=t,this.retitle()}say(t){var a,l,c,u,h,d;const e=t.trim();if(!e)return;const n=this.view,i=n===Pt&&this.wins[Pt].joined&&!!this.link,r=f=>this.push(n,"error",`* ${f}`);if(e.startsWith("/")&&!e.startsWith("//")){const[f="",...p]=e.slice(1).split(/\s+/),x=p.join(" ");switch(f.toLowerCase()){case"help":this.help();return;case"clear":this.wins[n].log.replaceChildren();return;case"quit":case"exit":this.win.close();return;case"join":{const m=(p[0]??"").toLowerCase().replace(/^#?/,"#");m===Pt||m==="#"&&n==="status"?this.joinLiving():m===kt?(this.show(kt),this.push(kt,"error",`* You are already on ${kt}`)):r(`${p[0]??"#"} Cannot join channel (this network has ${kt} and ${Pt})`);return}case"part":case"leave":n===Pt&&this.link?this.partLiving():r(n===kt?`${kt} will not let you go`:"You are not on a channel");return;case"nick":p[0]?(a=this.link)!=null&&a.send({type:"nick",nick:p[0]})||r(`Join ${Pt} first to have a name (/join ${Pt})`):r("Usage: /nick <newnick>");return;case"whois":p[0]?(l=this.link)!=null&&l.send({type:"whois",nick:p[0]})||r(`${p[0]} :No such nick`):r("Usage: /whois <nick>");return;case"me":if(!x)return;i?(c=this.link)==null||c.send({type:"say",text:x,action:!0}):n===kt?this.refused(`* ${this.me} ${x}`,"action"):r("You are not on a channel");return;case"topic":i&&x?(u=this.link)==null||u.send({type:"topic",text:x}):i?this.push(Pt,"topic",`* Topic is '${this.wins[Pt].topic}'`):r(`${n==="status"?"":`${n} `}You're not channel operator`);return;case"kick":i&&p[0]?(h=this.link)==null||h.send({type:"kick",nick:p[0],reason:p.slice(1).join(" ")}):r(i?"Usage: /kick <nick> [reason]":"You're not channel operator");return;default:r(`${f.toUpperCase()} Unknown command`);return}}const o=e.startsWith("//")?e.slice(1):e;i?(d=this.link)!=null&&d.send({type:"say",text:o})||r("Not connected"):n===kt&&this.wins[kt].joined?this.refused(`<${this.me}> ${o}`,"own"):r("You are not on a channel")}refused(t,e){this.push(kt,e,t),this.push(kt,"error",`* ${kt} Cannot send to channel`),this.hintedOikos||(this.hintedOikos=!0,this.push(kt,"info",`* (the living talk in ${Pt}: /join ${Pt})`))}help(){const t=e=>this.push(this.view,"info",e);t("* Commands:"),t(`*   /join ${Pt}           join the living (a nick, and a password for a tripcode if you like)`),t("*   /nick <name>           change your nick"),t("*   /me <does something>   an action"),t("*   /whois <nick>          who someone is (their tripcode, if they have one)"),t(`*   /part                  leave ${Pt}`),t("*   /topic, /kick          for channel operators"),t("*   /clear  /quit")}push(t,e,n,i=Date.now()){var c;const r=this.wins[t],o=r.log,a=o.scrollHeight-o.scrollTop-o.clientHeight<24,l=V("div",{class:`mirc-row t-${e}`});for(l.append(V("span",{class:"ts"},[LM(i)]),` ${n}`),o.append(l);o.childElementCount>CM;)(c=o.firstElementChild)==null||c.remove();a&&(o.scrollTop=o.scrollHeight),t!==this.view&&(t!=="status"&&(e==="text"||e==="action"||e==="own")?r.tab.classList.add("said"):r.tab.classList.contains("said")||r.tab.classList.add("event"))}show(t){this.view=t;for(const n of Object.values(this.wins)){const i=n.id===t;n.pane.hidden=!i,n.tab.classList.toggle("on",i),n.tab.setAttribute("aria-selected",String(i)),i&&n.tab.classList.remove("said","event")}const e=this.wins[t].log;e.scrollTop=e.scrollHeight,this.input.setAttribute("aria-label",t==="status"?"Command":`Message ${t}`),this.retitle()}nicksChanged(t){this.wins[t].render(),this.retitle()}setHung(t){this.hung!==t&&(this.hung=t,this.win.el.classList.toggle("mirc-hung",t),this.retitle())}retitle(){const t=this.wins[this.view],e=t.id===kt?"+mnt":"+nt",n=t.id==="status"?`mIRC - [Status: ${this.me} on ${Hn} (${fc})]`:t.joined?`mIRC - [${t.id} [${t.nicks.size}] [${e}]: ${t.topic}]`:`mIRC - [${t.id} (not on channel)]`;this.win.setTitle(this.hung?`${n} (Not Responding)`:n)}}class UM{constructor(t,e,n,i){R(this,"win");R(this,"statusLine");R(this,"timer",0);this.site=t,this.shell=e;const r=V("div");r.style.cssText="display:flex;flex-direction:column;min-height:0;flex:1;";const o=ud({back:()=>this.shell.back(),forward:()=>this.shell.forward(),can:()=>({back:this.shell.canBack,forward:this.shell.canForward}),up:()=>this.shell.home(),folders:()=>d.toggleAttribute("hidden")}),a=pd(t),l=dd(Cn(t.accent),a,!1,()=>this.shell.open(t)).el,c=fd();r.append(hc({File:()=>[...Po(this.shell,t,!0),"sep",{label:"Properties",disabled:!0},"sep",{label:"Close",run:()=>this.win.close()}],Edit:()=>gd(this.shell,t),View:()=>Md(this.shell,{toolbar:o.el,address:l,status:c.el,up:()=>this.shell.home(),refresh:()=>this.refresh()}),Favorites:()=>xd(this.shell),Tools:()=>vd(),Help:()=>_d(this.shell)}),o.el,l);const u=this.shell.onNav(()=>o.refresh()),h=V("div",{class:"xp-body"}),d=V("aside",{class:"xp-tasks"});h.append(d);const f=V("div",{class:"xp-content"});h.append(f),r.append(h),c.set("Done",md(t)),r.append(c.el);const p=V("div",{class:"xp-hero",html:Cn(t.accent,t.title)}),x=V("div");x.append(V("h2",{},[t.title]),V("p",{},[t.tagline])),p.append(x),f.append(p);const m=V("button",{class:"xp-preview",type:"button","aria-label":`Open ${t.title}`}),g=this.shell.screens.get(t.id);g&&m.append(g.canvas),m.append(V("span",{class:"xp-play"},[`▶  open ${t.title}`])),m.addEventListener("click",L=>this.shell.open(t,L)),f.append(m),f.append(V("p",{class:"xp-about"},[t.about]));const S=this.note();S&&f.append(V("div",{class:"xp-note"},[S]));const E=V("div",{class:"xp-actions"}),M=V("button",{class:"xp-btn default",type:"button"},[`Open ${t.title}`]);M.addEventListener("click",L=>this.shell.open(t,L));const y=V("button",{class:"xp-btn",type:"button"},["~ Home directory"]);if(y.addEventListener("click",()=>this.shell.home()),E.append(M),t.tune&&this.shell.canTune){const L=V("button",{class:"xp-btn",type:"button"},["▣ Watch it here"]);L.title="the live page, on its own screen in the room",L.addEventListener("click",()=>this.shell.tuneIn(t.id)),E.append(L)}if(t.id==="irc"){const L=V("button",{class:"xp-btn",type:"button"},["Join #aethera"]);L.title="sit in the channel, in mIRC",L.addEventListener("click",()=>this.shell.chat("#aethera")),E.append(L)}E.append(y),f.append(E);const w=[{icon:oc(),label:`Open ${t.title}`,run:()=>this.shell.open(t)},{icon:nd(),label:"Look at its screen",run:()=>this.shell.look(t.id)}];t.tune&&this.shell.canTune&&w.splice(1,0,{icon:fM(),label:"Watch it on its screen",run:()=>this.shell.tuneIn(t.id)}),t.id==="irc"&&w.splice(1,0,{icon:Ti("channel"),label:"Join #aethera in mIRC",run:()=>this.shell.chat("#aethera")}),w.push({icon:pM(),label:"Copy address",run:()=>uc(this.shell,t)}),w.push({icon:id(),label:"Eject tape",run:()=>this.win.close()});const C=[{icon:_r(),label:"~ (home directory)",run:()=>this.shell.home()}];for(const L of yM[t.id]??[]){const D=this.shell.site(L);D&&C.push({icon:Cn(D.accent),label:D.title,run:()=>this.shell.play(D.id)})}const v=V("div",{class:"xp-details"});v.append(V("b",{},[t.title]));const T=V("dl");for(const[L,D]of t.details)T.append(V("dt",{},[L]),V("dd",{},[D]));v.append(T),this.statusLine=V("div",{class:"status"}),v.append(this.statusLine),d.append(Hs("Tape Tasks",w,!0),Hs("Other Places",C),Hs("Details",v)),this.win=n.open({id:`site:${t.id}`,title:`${t.title} — ${a.replace(/^https?:\/\//,"")}`,icon:Cn(t.accent),body:r,width:Math.round(Math.min(760,Math.max(440,innerWidth*.5))),dock:"right",onClose:()=>{u(),clearInterval(this.timer),g==null||g.canvas.remove(),i()}}),this.win.el.style.height="min(640px, calc(100% - 24px))",this.refresh(),this.timer=window.setInterval(()=>this.refresh(),2e3)}note(){const t=this.site;return t.id==="dreams"?"Opening dreams wakes the dreamer: a GPU starts up while anyone is watching and goes back to sleep after. The frame here is the last one the chronicle kept.":t.id==="syrinx"?"Syrinx makes sound once you wake it. The creature here is read from this browser; nobody else sees yours.":t.id==="afterlife"?"afterlife makes music once you click in. The universe on this screen is the one saved in this browser, if you have visited; nobody else sees yours.":t.group==="wired"?`${t.title} is not on this server; it opens in a new window.`:null}refresh(){const{feeds:t}=this.shell;let e=!1,n="";switch(this.site.id){case"dreams":case"dreams-api":{const r=t.dreams.value;e=r.known&&r.awake,n=r.known?r.awake?`awake · frame ${r.frame.toLocaleString("en-US")}${r.viewers?` · ${r.viewers} watching`:""}`:"asleep":"status unknown";break}case"chronicle":{const r=t.chronicle.value;e=r.known&&r.eras.some(o=>o.open),n=r.known?`${r.eraCount||r.eras.length} eras recorded`:"reading the core…";break}case"irc":{const r=t.irc.value;e=r.connected,n=r.connected?"live on #aethera":"connecting…";break}case"syrinx":{const r=t.creature.value;e=!!r,n=r?`yours: ${r.name}`:"not woken in this browser";break}case"afterlife":{const r=t.universe.value;e=!!r,n=r?`yours: generation ${r.generation.toLocaleString("en-US")}`:"no universe in this browser yet";break}default:return}this.statusLine.className=`status${e?" on":""}`,this.statusLine.innerHTML="<i></i><span></span>";const i=this.statusLine.querySelector("span");i&&(i.textContent=n)}}const Ed=2;class FM{constructor(t,e,n,i){R(this,"el");R(this,"menu");R(this,"buttons");R(this,"clock");R(this,"moonEl");R(this,"start");R(this,"tip");R(this,"balloonEl");R(this,"balloonTimer",0);R(this,"dialogEl",null);this.root=t,this.shell=e,this.wm=n,this.hooks=i,this.el=V("nav",{class:"xp-taskbar","aria-label":"taskbar"}),this.start=V("button",{class:"xp-start",type:"button","aria-label":"æthera","aria-haspopup":"menu","aria-expanded":"false",html:'<span aria-hidden="true">æ</span>'}),this.buttons=V("div",{class:"xp-taskbuttons"});const r=V("div",{class:"xp-tray"}),o=V("span",{class:"tray-icon net",title:"Connected to the Wired",html:oM()});this.moonEl=V("span",{class:"tray-icon dream",title:"dreams",html:td(!1)}),this.clock=V("span",{class:"clock"}),r.append(o,this.moonEl,this.clock),this.el.append(this.start,this.buttons,r),t.append(this.el),this.menu=this.buildMenu(),t.append(this.menu),this.start.addEventListener("click",()=>this.toggleMenu()),t.addEventListener("pointerdown",a=>{const l=a.target;!this.menu.hidden&&!l.closest(".xp-startmenu")&&!l.closest(".xp-start")&&!l.closest(".xp-menu")&&this.toggleMenu(!1)}),this.el.addEventListener("contextmenu",a=>{a.preventDefault(),a.stopPropagation();const l=a.target.closest(".xp-taskbtn"),c=l?this.wm.list.find(u=>u.opts.id===l.dataset.win):void 0;zs(c?c.systemMenu():this.barMenu(),a.clientX,a.clientY)}),o.addEventListener("click",()=>this.balloon("Connected to the Wired",`${e.dir.sites.length} screens · 1 VCR · signal: present day, present time`,this.trayAnchor())),this.tip=V("div",{class:"xp-tip",role:"tooltip",hidden:""}),this.balloonEl=V("div",{class:"xp-balloon",role:"status",hidden:""}),t.append(this.tip,this.balloonEl),n.on(()=>this.renderButtons()),e.feeds.dreams.on(a=>{this.moonEl.innerHTML=td(a.awake),this.moonEl.title=a.known?a.awake?`dreams: awake · frame ${a.frame.toLocaleString("en-US")}`:"dreams: asleep":"dreams: no answer"}),this.tick(),setInterval(()=>this.tick(),15e3)}tick(){this.clock.textContent=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}trayAnchor(){const t=this.el.getBoundingClientRect();return{x:t.right-60,y:t.top}}toggleMenu(t){var n;const e=t??this.menu.hidden;e||Ai(),this.menu.hidden=!e,this.start.classList.toggle("open",e),this.start.setAttribute("aria-expanded",String(e)),e&&((n=this.menu.querySelector("a,button"))==null||n.focus())}barMenu(){return[{label:"Toolbars",disabled:!0,submenu:()=>[]},"sep",{label:"Cascade Windows",disabled:!0},{label:"Tile Windows Horizontally",disabled:!0},{label:"Tile Windows Vertically",disabled:!0},{label:"Show the Desktop",run:()=>this.showDesktop(),disabled:!this.wm.list.some(t=>!t.minimized&&!t.opts.dialog)},"sep",{label:"Task Manager",disabled:!0},"sep",{label:"Lock the Taskbar",checked:!0,disabled:!0},{label:"Properties",disabled:!0}]}showDesktop(){for(const t of[...this.wm.list])!t.opts.dialog&&!t.minimized&&t.minimize()}buildMenu(){const t=V("div",{class:"xp-startmenu",role:"menu",hidden:""}),e=V("header");e.append(V("span",{class:"avatar",html:Ro(40)}),V("span",{},["guest"])),t.append(e,V("div",{class:"orange","aria-hidden":"true"}));const n=V("div",{class:"cols"}),i=V("ul",{class:"left"}),r=V("ul",{class:"right"}),o=(y,w)=>{const C=V("li");return C.append(w),y.append(C),w},a=(y,w,C,v,T,L="")=>{const D=V("button",{type:"button",role:"menuitem",class:L,html:`${w}<span><span class="tt"></span>${v!==null?"<small></small>":""}</span>`});D.querySelector(".tt").textContent=C;const U=D.querySelector("small");return U&&v&&(U.textContent=v),D.addEventListener("click",()=>{this.toggleMenu(!1),T()}),o(y,D)},l=(y,w,C,v)=>{const T=V("a",{href:v,role:"menuitem",html:`${w}<span></span>`});T.querySelector("span").textContent=C,o(y,T)},c=(y,w,C,v,T)=>{const L=V("button",{type:"button",role:"menuitem",class:`cascade ${v}`,"aria-haspopup":"menu","data-menu-owner":"",html:`${w}<span class="tt"></span><i class="arrow"></i>`});L.querySelector(".tt").textContent=C;const D=()=>{L.classList.add("open"),hd(T(),L,()=>L.classList.remove("open"))};return L.addEventListener("click",D),L.addEventListener("pointerenter",D),o(y,L)},u=y=>y.append(V("li",{class:"sep",role:"separator"}));t.addEventListener("pointerover",y=>{const w=y.target.closest("li > a, li > button");w&&!w.classList.contains("cascade")&&Ai()});const h=y=>({label:y.title,icon:Cn(y.accent),run:()=>{this.toggleMenu(!1),this.shell.play(y.id)}});a(i,Ti(),"mIRC","#aethera",()=>this.shell.chat(),"pinned");const d=this.shell.dir.sites.filter(y=>y.group==="here");d.slice(0,Ed).forEach(y=>a(i,Cn(y.accent,y.title),y.title,y.kind,()=>this.shell.play(y.id),"pinned")),u(i),d.slice(Ed).forEach(y=>a(i,Cn(y.accent,y.title),y.title,null,()=>this.shell.play(y.id)));const f=V("li",{class:"allprog"});i.append(V("li",{class:"sep",role:"separator"}),f);const p=V("button",{type:"button",role:"menuitem",class:"cascade","aria-haspopup":"menu","data-menu-owner":"",html:`<span class="tt">All Programs</span>${gM()}`}),x=()=>{p.classList.add("open"),hd([...this.shell.dir.sites.filter(y=>y.group==="here").map(h),"sep",...this.shell.dir.sites.filter(y=>y.group==="wired").map(h),"sep",{label:"~ (home directory)",icon:_r(),run:()=>{this.toggleMenu(!1),this.shell.home()}}],p,()=>p.classList.remove("open"))};p.addEventListener("click",x),p.addEventListener("pointerenter",x),f.append(p),a(r,_r(),"My Tapes",null,()=>this.shell.home(),"strong");const m=this.shell.dir.posts.slice(0,8);m.length&&c(r,Bs("txt"),"My Recent Transmissions","strong",()=>m.map(y=>({label:y.title,icon:Bs("txt"),run:()=>location.assign(y.href)}))),u(r);const g=this.shell.dir.sites.filter(y=>y.group==="wired");for(const y of g)a(r,Cn(y.accent),y.title,null,()=>this.shell.play(y.id));u(r);for(const y of this.shell.dir.files)l(r,Bs(y.title.split(".").pop()??"txt"),y.title,y.href);n.append(i,r),t.append(n);const S=V("div",{class:"foot"}),E=V("button",{type:"button",html:`${od()}<span>Log Off</span>`});E.addEventListener("click",()=>{this.toggleMenu(!1),this.logOffDialog()});const M=V("button",{type:"button",html:`${rd()}<span>Turn Off Computer</span>`});return M.addEventListener("click",()=>{this.toggleMenu(!1),this.shutdownDialog()}),S.append(E,M),t.append(S),t}dismiss(){return this.dialogEl?(this.dialogEl.remove(),this.dialogEl=null,this.start.focus(),!0):!1}bigDialog(t,e){var l,c;(l=this.dialogEl)==null||l.remove();const n=V("div",{class:"xp-shutdown",role:"dialog","aria-modal":"true","aria-label":t});this.dialogEl=n;const i=V("div",{class:"panel"});i.append(V("header",{html:`<span></span>${Ro(28,!1)}`})),i.querySelector("header span").textContent=t;const r=V("div",{class:"choices"});for(const u of e){const h=V("button",{type:"button",class:u.cls,html:`<i>${u.icon}</i><span>${u.label}</span>`}),d=u.run;d?h.addEventListener("click",()=>{n.remove(),this.dialogEl=null,d()}):h.disabled=!0,r.append(h)}i.append(r);const o=V("div",{class:"foot"}),a=V("button",{class:"xp-btn",type:"button"},["Cancel"]);a.addEventListener("click",()=>this.dismiss()),o.append(a),i.append(o),n.append(i),this.root.append(n),(c=r.querySelector("button:not(:disabled):last-of-type, button:not(:disabled)"))==null||c.focus()}logOffDialog(){this.bigDialog("Log Off æthera",[{cls:"switch",icon:ad(),label:"Switch User"},{cls:"logoff",icon:od(),label:"Log Off",run:()=>this.hooks.logOff()}])}shutdownDialog(){var t,e;this.bigDialog("Turn off computer",[{cls:"standby",icon:mM(),label:"Stand By",run:()=>this.hooks.standby(!0)},{cls:"off",icon:rd(),label:"Turn Off",run:()=>this.hooks.turnOff()},{cls:"restart",icon:ad(),label:"Restart",run:()=>this.hooks.restart()}]),(e=(t=this.dialogEl)==null?void 0:t.querySelector(".off"))==null||e.focus()}renderButtons(){this.buttons.replaceChildren();for(const t of this.wm.list){if(t.opts.dialog)continue;const e=V("button",{class:`xp-taskbtn${this.wm.activeWindow===t&&!t.minimized?" active":""}`,type:"button","data-win":t.opts.id,html:`${t.opts.icon}<span></span>`});e.querySelector("span").textContent=t.opts.title,e.title=t.opts.title,e.addEventListener("click",()=>{t.minimized?t.restore():this.wm.activeWindow===t?t.minimize():t.focus()}),this.buttons.append(e)}}showTip(t,e,n,i){const r=t?{title:t.title,text:t.tagline}:e;if(!r){this.tip.hidden=!0;return}this.tip.innerHTML="<b></b><span></span>",this.tip.querySelector("b").textContent=r.title,this.tip.querySelector("span").textContent=r.text,this.tip.hidden=!1;const o=this.root.getBoundingClientRect(),a=this.tip.offsetWidth;this.tip.style.left=`${Math.min(n+14,o.width-a-6)}px`,this.tip.style.top=`${Math.min(i+20,o.height-70)}px`}balloon(t,e,n,i=7e3,r=!1){var f;const o=this.balloonEl;o.innerHTML=`<b>${sd()}<span></span></b><span class="msg"></span><button class="x" type="button" aria-label="Close">✕</button>`,o.querySelector("b span").textContent=t,o.querySelector(".msg").textContent=e,(f=o.querySelector(".x"))==null||f.addEventListener("click",()=>o.hidden=!0),o.hidden=!1;const a=this.root.getBoundingClientRect(),l=n??this.trayAnchor(),c=o.offsetWidth,u=o.offsetHeight,h=Math.max(6,Math.min(l.x-30,a.width-c-6)),d=r?l.y+u+24>a.height-30:l.y-u-20>0;o.classList.toggle("above",d),o.classList.toggle("below",!d),o.style.left=`${h}px`,o.style.top=`${d?l.y-u-18:l.y+18}px`,o.style.setProperty("--tail",`${Math.max(12,Math.min(c-30,l.x-h))}px`),clearTimeout(this.balloonTimer),this.balloonTimer=window.setTimeout(()=>o.hidden=!0,i)}hideBalloon(){this.balloonEl.hidden=!0}}const _c=300,Mc=180,OM=["n","s","e","w","ne","nw","se","sw"];class kM{constructor(t,e){R(this,"el");R(this,"minimized",!1);R(this,"closed",!1);var o,a,l,c,u;this.opts=t,this.wm=e;const n=document.createElement("section");n.className=`xp-window${t.dialog?" xp-dialog":""}`,n.setAttribute("role",t.dialog?"alertdialog":"dialog"),n.setAttribute("aria-label",t.title),n.innerHTML=`
      <header class="xp-titlebar">
        <span class="xp-title-icon">${t.icon}</span>
        <span class="xp-title"></span>
        <span class="xp-controls">
          ${t.dialog?"":'<button class="xp-min" aria-label="Minimize" title="Minimize"></button><button class="xp-max" aria-label="Maximize" title="Maximize"></button>'}
          <button class="xp-close" aria-label="Close" title="Close"></button>
        </span>
      </header>`;const i=n.querySelector(".xp-title");i&&(i.textContent=t.title),n.append(t.body),n.style.width=`${t.width}px`,this.el=n,(o=n.querySelector(".xp-close"))==null||o.addEventListener("click",()=>this.close()),(a=n.querySelector(".xp-min"))==null||a.addEventListener("click",()=>this.minimize()),(l=n.querySelector(".xp-max"))==null||l.addEventListener("click",()=>this.toggleMax()),n.addEventListener("pointerdown",()=>this.focus(),!0),this.bindDrag(n.querySelector(".xp-titlebar")),t.dialog||this.bindResize(),(c=n.querySelector(".xp-titlebar"))==null||c.addEventListener("dblclick",h=>{const d=h.target;d.closest(".xp-controls")||t.dialog||(d.closest(".xp-title-icon")?this.close():this.toggleMax())});const r=n.querySelector(".xp-title-icon");r==null||r.setAttribute("data-menu-owner",""),r==null||r.addEventListener("click",h=>{h.stopPropagation();const d=n.getBoundingClientRect();zs(this.systemMenu(),d.left+3,d.top+29)}),(u=n.querySelector(".xp-titlebar"))==null||u.addEventListener("contextmenu",h=>{const d=h;d.target.closest(".xp-controls")||(d.preventDefault(),d.stopPropagation(),zs(this.systemMenu(),d.clientX,d.clientY))})}get maximized(){return this.el.classList.contains("maximized")}systemMenu(){const t=!!this.opts.dialog;return[{label:"Restore",run:()=>this.minimized?this.restore():this.toggleMax(),disabled:t||!this.maximized&&!this.minimized},{label:"Move",disabled:!0},{label:"Size",disabled:!0},{label:"Minimize",run:()=>this.minimize(),disabled:t||this.minimized},{label:"Maximize",run:()=>{this.minimized&&this.restore(),this.maximized||this.toggleMax()},disabled:t||this.maximized},"sep",{label:"Close",run:()=>this.close(),bold:!0,shortcut:"Alt+F4"}]}setTitle(t){const e=this.el.querySelector(".xp-title");e&&(e.textContent=t),this.el.setAttribute("aria-label",t)}place(t){const e=t.clientWidth,n=t.clientHeight,i=Math.min(this.opts.width,e-16);this.el.style.width=`${i}px`,t.append(this.el);const r=Math.min(this.el.offsetHeight,n-16);let o=this.opts.x??0,a=this.opts.y??0;this.opts.x===void 0&&(this.opts.dock==="left"?o=18:this.opts.dock==="right"?o=e-i-18:o=(e-i)/2),this.opts.y===void 0&&(a=this.opts.dialog?(n-r)/2.4:Math.max(8,Math.min(60,(n-r)/2))),this.moveTo(o,a)}moveTo(t,e){const n=this.el.parentElement;if(!n)return;const i=n.clientWidth-60,r=n.clientHeight-30;this.el.style.left=`${Math.round(Math.max(-this.el.offsetWidth+80,Math.min(i,t)))}px`,this.el.style.top=`${Math.round(Math.max(0,Math.min(r,e)))}px`}bindDrag(t){let e=null;t.addEventListener("pointerdown",i=>{i.target.closest(".xp-controls, .xp-title-icon")||i.button!==0||this.el.classList.contains("maximized")||innerWidth<=720||(e={x:i.clientX,y:i.clientY,left:this.el.offsetLeft,top:this.el.offsetTop},t.setPointerCapture(i.pointerId))}),t.addEventListener("pointermove",i=>{e&&this.moveTo(e.left+i.clientX-e.x,e.top+i.clientY-e.y)});const n=()=>{e&&this.wm.changed(),e=null};t.addEventListener("pointerup",n),t.addEventListener("pointercancel",n)}bindResize(){for(const t of OM){const e=document.createElement("div");e.className=`xp-grip xp-grip-${t}`,e.setAttribute("aria-hidden","true"),this.el.append(e);let n=null;e.addEventListener("pointerdown",r=>{r.button!==0||this.maximized||innerWidth<=720||(r.preventDefault(),n={x:r.clientX,y:r.clientY,left:this.el.offsetLeft,top:this.el.offsetTop,w:this.el.offsetWidth,h:this.el.offsetHeight},e.setPointerCapture(r.pointerId),this.focus())}),e.addEventListener("pointermove",r=>{if(!n)return;const o=this.el.parentElement;if(!o)return;const a=r.clientX-n.x,l=r.clientY-n.y;let{left:c,top:u,w:h,h:d}=n;t.includes("e")&&(h=Math.min(o.clientWidth-c,Math.max(_c,n.w+a))),t.includes("s")&&(d=Math.min(o.clientHeight-u,Math.max(Mc,n.h+l))),t.includes("w")&&(h=Math.max(_c,Math.min(n.left+n.w,n.w-a)),c=n.left+n.w-h),t.includes("n")&&(d=Math.max(Mc,Math.min(n.top+n.h,n.h-l)),u=n.top+n.h-d),this.el.style.left=`${Math.round(c)}px`,this.el.style.top=`${Math.round(u)}px`,this.el.style.width=`${Math.round(h)}px`,this.el.style.height=`${Math.round(d)}px`,this.el.style.maxHeight="none"});const i=()=>{n&&this.wm.changed(),n=null};e.addEventListener("pointerup",i),e.addEventListener("pointercancel",i)}}clamp(){if(this.maximized||this.minimized)return;const t=this.el.parentElement;t&&(this.el.offsetWidth>t.clientWidth&&(this.el.style.width=`${Math.max(_c,t.clientWidth-8)}px`),this.el.offsetHeight>t.clientHeight&&(this.el.style.height=`${Math.max(Mc,t.clientHeight-8)}px`),this.moveTo(this.el.offsetLeft,this.el.offsetTop))}focus(){this.wm.focus(this)}minimize(){this.minimized=!0,this.el.classList.add("minimized"),this.wm.focusTop(),this.wm.changed()}restore(){this.minimized=!1,this.el.classList.remove("minimized"),this.focus()}toggleMax(){const t=this.el.classList.toggle("maximized"),e=this.el.querySelector(".xp-max");e==null||e.setAttribute("aria-label",t?"Restore":"Maximize"),e==null||e.setAttribute("title",t?"Restore":"Maximize"),this.wm.changed()}close(){var t,e;this.closed||(this.closed=!0,this.el.remove(),this.wm.remove(this),(e=(t=this.opts).onClose)==null||e.call(t))}}class BM{constructor(t){R(this,"windows",[]);R(this,"active",null);R(this,"z",30);R(this,"listeners",new Set);this.desk=t,addEventListener("resize",()=>{for(const e of this.windows)e.clamp()})}get list(){return this.windows}get activeWindow(){return this.active}get(t){return this.windows.find(e=>e.opts.id===t)}open(t){const e=this.get(t.id);if(e)return e.minimized?e.restore():e.focus(),e;const n=new kM(t,this);return this.windows.push(n),n.place(this.desk),this.focus(n),n}focus(t){var n,i;if(t.closed)return;const e=this.active!==t;this.active=t,t.el.style.zIndex=String(++this.z);for(const r of this.windows)r.el.classList.toggle("inactive",r!==t);e&&((i=(n=t.opts).onFocus)==null||i.call(n)),this.changed()}deactivate(){if(this.active){this.active=null;for(const t of this.windows)t.el.classList.add("inactive");this.changed()}}focusTop(){const e=this.windows.filter(n=>!n.minimized).sort((n,i)=>Number(i.el.style.zIndex)-Number(n.el.style.zIndex))[0];e?this.focus(e):(this.active=null,this.changed())}remove(t){this.windows=this.windows.filter(e=>e!==t),this.active===t&&(this.active=null,this.focusTop()),this.changed()}closeTop(){const t=this.active&&!this.active.minimized?this.active:null;return t?(t.close(),!0):!1}on(t){return this.listeners.add(t),()=>this.listeners.delete(t)}changed(){for(const t of this.listeners)t()}}const yc=document.getElementById("oikos");if(yc)try{HM(yc)}catch(s){console.error("oikos: boot failed; falling back to the plain directory",s),yc.classList.remove("oikos-live"),(Td=document.getElementById("oikos-boot"))==null||Td.remove()}function zM(){var s;try{const t=document.createElement("canvas").getContext("webgl2");return(s=t==null?void 0:t.getExtension("WEBGL_lose_context"))==null||s.loseContext(),!!t}catch{return!1}}function Lo(){return location.pathname+location.search}function HM(s){var ee,Q;s.classList.add("oikos-live");const t=matchMedia("(prefers-reduced-motion: reduce)").matches,e=Xd(),n=new Yd,i=new Map(e.sites.map(I=>[I.id,Wf(I,{dir:e,feeds:n})])),r=new Map(e.sites.map(I=>[I.id,I]));if(new URLSearchParams(location.search).has("contact")){GM(s,e.sites,i,n);return}const o=V("div",{id:"oikos-desktop"});s.append(o);const a=new BM(o);vM(s);const l={stack:[],i:-1,moving:!1,listeners:new Set},c=I=>{if(!(l.moving||l.stack[l.i]===I)){l.stack=l.stack.slice(0,l.i+1),l.stack.push(I),l.i=l.stack.length-1;for(const q of l.listeners)q()}},u=I=>{const q=l.stack[l.i+I];if(q!==void 0){l.i+=I,l.moving=!0;try{q==="~"?E.home():E.play(q)}finally{l.moving=!1}for(const st of l.listeners)st()}};let h=null,d=null,f=null,p=null,x=!1,m=null,g=0,S=!1;const E={dir:e,feeds:n,screens:i,site:I=>r.get(I),select(I){w(!1),h==null||h.focus(I)},play(I){const q=r.get(I);if(!q)return;if(c(I),w(!1),M.select(I),f===I&&d){h==null||h.play(I),d.win.minimized?d.win.restore():d.win.focus();return}const st=d;d=null,f=null,st==null||st.win.close(),history.replaceState(null,"",`${Lo()}#${I}`);const ut=a.get("home");ut&&!ut.minimized&&h&&(ut.minimize(),S=!0);const lt=++g,Ot=Dt=>{if(lt===g){if(!Dt){h==null||h.eject(),history.replaceState(null,"",Lo());const Vt=a.get("home");S&&(Vt!=null&&Vt.minimized)&&Vt.restore(),S=!1;return}f=I,h==null||h.keepAlive(I),d=new UM(q,E,a,()=>{if(f!==I)return;d=null,f=null,h==null||h.keepAlive(null),h==null||h.eject(),(h==null?void 0:h.focusedId)===I&&h.focus(null),history.replaceState(null,"",Lo());const Vt=a.get("home");S&&(Vt!=null&&Vt.minimized)&&Vt.restore(),S=!1})}};h?h.play(I).then(Ot):Ot(!0)},open(I,q){if(q==null||q.preventDefault(),x)return;if(Dc(I.href)){window.open(I.href,"_blank","noopener"),y.balloon(`${I.title} opened`,"It opened in a new window. The room is still here.");return}const st=I.href;x=!0,y.balloon(`Opening ${I.title}`,"tuning in…",void 0,2e3);let ut=!1;const lt=()=>{ut||(ut=!0,location.assign(st))};h?h.dive(I.id).then(lt):lt(),setTimeout(lt,1500)},look(I){w(!1),h==null||h.focus(I)},get canTune(){return!!h},tuneIn(I){const q=r.get(I);if(!h||!(q!=null&&q.tune))return;const st=typeof q.tune=="string"?q.tune:q.href;w(!1);const ut=a.list.filter(ne=>!ne.minimized&&!ne.opts.dialog);for(const ne of ut)ne.minimize();y.hideBalloon();const lt=V("div",{class:"oikos-tube"});lt.style.setProperty("--glow",q.accent);const Ot=V("iframe",{src:st,title:`${q.title}, live`,allow:"autoplay; fullscreen; clipboard-write"});lt.append(Ot,V("i",{class:"roll"}),V("i",{class:"glass"})),Ot.addEventListener("load",()=>{var ne;try{(ne=Ot.contentWindow)==null||ne.addEventListener("keydown",he=>{var Le;const ue=he.target;he.key!=="Escape"||he.defaultPrevented||(Le=ue==null?void 0:ue.closest)!=null&&Le.call(ue,"input, textarea, [contenteditable]")||w(!0)})}catch{}});const Dt=V("div",{class:"oikos-tuned",role:"toolbar","aria-label":"tuned in"});Dt.innerHTML=`${Cn(q.accent)}<b></b><span>tuned in · live on its screen</span>`,Dt.querySelector("b").textContent=q.title;const Vt=V("button",{class:"xp-btn",type:"button"},["⏏ Eject"]);Vt.addEventListener("click",()=>w(!0));const jt=V("a",{class:"xp-btn",href:q.href},["Open full ↗"]);Dc(q.href)&&(jt.setAttribute("target","_blank"),jt.setAttribute("rel","noopener")),Dt.append(Vt,jt),m={id:I,bar:Dt,hidden:ut,tube:lt};const Qt=ne=>{const he=Math.round(Math.min(1024,Math.max(420,ne.width*1.15))),ue=Math.round(he*.75);lt.style.width=`${he}px`,lt.style.height=`${ue}px`,lt.style.transform=`translate(${ne.left}px, ${ne.top}px) scale(${ne.width/he}, ${ne.height/ue})`};h.tuneIn(I,Qt).then(()=>{(m==null?void 0:m.bar)===Dt&&(s.append(lt,Dt),Ot.focus())})},chat(I){w(!1),p||(p=new NM(E,a,()=>p=null)),p.focus(I)},home(){c("~"),w(!1),M.open(),h==null||h.scroll("~ home")},eject(){w(!1),d==null||d.win.close(),h==null||h.eject(),h==null||h.focus(null)},balloon(I,q,st){y.balloon(I,q,st)},back:()=>u(-1),forward:()=>u(1),get canBack(){return l.i>0},get canForward(){return l.i<l.stack.length-1},onNav(I){return l.listeners.add(I),()=>l.listeners.delete(I)},about:()=>C()},M=new bM(E,a),y=new FM(s,E,a,{standby:I=>L(I),turnOff(){s.classList.add("off"),setTimeout(()=>location.assign("/"),t?50:750)},logOff(){w(!1);for(const I of[...a.list])I.close();h==null||h.eject(),h==null||h.focus(null),history.replaceState(null,"",Lo()),y.balloon("Logged off","The desk is clear. Click the VCR to begin again.",(h==null?void 0:h.anchor("vcr"))??void 0)},restart(){try{sessionStorage.removeItem("oikos-booted")}catch{}location.reload()}});function w(I){if(!m)return;const{id:q,bar:st,hidden:ut,tube:lt}=m;if(m=null,st.remove(),lt.remove(),h==null||h.tuneOut(),!!I){for(const Ot of ut)Ot.closed||Ot.restore();h==null||h.focus(q)}}function C(){var Vt;(Vt=a.get("about"))==null||Vt.close();const I=V("div",{class:"xp-about-box"}),q=V("div",{class:"band",html:Ro(44,!0)});q.append(V("b",{},["æthera"]),V("span",{},["oikos"]));const st=V("div",{class:"xp-dialog-body"}),ut=V("div");ut.append(V("p",{},["æthera · the home directory"]),V("p",{},["Version 1998 (Build 2026.present_day)"]),V("p",{},["A room of screens wired to one VCR, and every part of the site playing at once."]),V("p",{class:"lic"},["This product is licensed under CC BY 4.0 to:"]),V("p",{},["guest"])),st.append(ut);const lt=V("div",{class:"xp-actions"}),Ot=V("button",{class:"xp-btn default",type:"button"},["OK"]);lt.append(Ot),I.append(q,st,lt);const Dt=a.open({id:"about",title:"About æthera",icon:sd(),body:I,width:400,dialog:!0});Ot.addEventListener("click",()=>Dt.close()),Ot.focus()}if(zM())try{h=new tM(s,e.sites,i,{pick(I){D(),y.hideBalloon(),y.showTip(null,null,0,0),I==="vcr"?E.home():I?E.play(I):h!=null&&h.focusedId&&!d&&!h.busy&&h.focus(null)},hover(I,q,st){I==="vcr"?y.showTip(null,{title:"VCR",text:"your home directory · click to open ~"},q,st):y.showTip(I?r.get(I)??null:null,null,q,st)}})}catch(I){console.warn("oikos: the room would not build; running the desktop alone",I),h==null||h.stop(),h=null}if(h==null||h.renderer.domElement.addEventListener("pointerdown",()=>a.deactivate()),MM(s,(I,q)=>{var Ot,Dt;const st=I.closest(".xp-tile");if(st)return st.dataset.id?M.contextFor(st.dataset.id):null;if(I.closest("a"))return null;if(I.closest(".xp-content")&&((Dt=(Ot=I.closest(".xp-window"))==null?void 0:Ot.getAttribute("aria-label"))!=null&&Dt.startsWith("~")))return M.blankMenu();if(I.closest(".xp-window, .xp-startmenu, .xp-shutdown, .xp-menu, .xp-balloon"))return[];if(!h||I!==h.renderer.domElement)return[];const ut=h.pickFromPoint(q.clientX,q.clientY);if(ut==="vcr")return[{label:"Open ~",bold:!0,run:()=>E.home()},{label:"Eject",run:()=>E.eject(),disabled:!f},"sep",{label:"Properties",disabled:!0}];const lt=ut?r.get(ut):void 0;return lt?Po(E,lt):[{label:"Arrange Icons By",disabled:!0,submenu:()=>[]},{label:"Refresh",run:()=>h==null?void 0:h.focus(null)},"sep",{label:"Paste",disabled:!0},{label:"Paste Shortcut",disabled:!0},"sep",{label:"New",disabled:!0,submenu:()=>[]},"sep",{label:"~ Home directory",run:()=>E.home()},{label:"Properties",disabled:!0}]}),!h){let I=performance.now();const q=st=>{var lt;requestAnimationFrame(q);const ut=Math.min(.1,(st-I)/1e3);I=st,f&&((lt=i.get(f))==null||lt.tick(st/1e3,ut,!0))};requestAnimationFrame(q)}const v=()=>{if(!h)return;const I=innerWidth,q=innerHeight-30,st=a.list.filter(Ot=>!Ot.minimized&&!Ot.opts.dialog&&!Ot.el.classList.contains("maximized"));if(I<=720){h.setShift(0,st.length?q*.3:0);return}let ut=0,lt=I;for(const Ot of st){const Dt=Ot.el.getBoundingClientRect();Dt.left+Dt.width/2<I/2?ut=Math.max(ut,Dt.right):lt=Math.min(lt,Dt.left)}lt-ut<I*.22&&(ut=0,lt=I),h.setShift(I/2-(ut+lt)/2,0)};a.on(v),addEventListener("resize",v);let T=!1;function L(I){T=I,s==null||s.classList.toggle("standby",I),I&&(h==null||h.focus(null))}function D(){T&&L(!1)}s.addEventListener("pointerdown",D,!0);const U=new Map(Object.entries(Cr).map(([I,q])=>[q.channel,I])),K=e.sites.map(I=>I.id).sort((I,q)=>{var st,ut;return(((st=Cr[I])==null?void 0:st.channel)??99)-(((ut=Cr[q])==null?void 0:ut.channel)??99)});let Z="",N=0;addEventListener("keydown",I=>{if(T){D();return}const q=I.target;if(!q.closest("input, textarea")){if(I.key==="Escape"&&m){w(!0);return}if(!m){if(I.key==="Escape"){if(Ai()||y.dismiss()||!W())return;const st=a.activeWindow;if(st!=null&&st.opts.dialog&&!st.minimized){st.close();return}h!=null&&h.focusedId&&h.focus(null);return}if(I.altKey&&(I.key==="ArrowLeft"||I.key==="ArrowRight")){I.preventDefault(),u(I.key==="ArrowLeft"?-1:1);return}if(!q.closest(".xp-window, .xp-startmenu, .xp-menu, .xp-shutdown")){if(I.key==="~"||I.key==="Home"){E.home();return}if((I.key==="ArrowRight"||I.key==="ArrowLeft")&&!(h!=null&&h.busy)){const st=h!=null&&h.focusedId&&h.focusedId!=="vcr"?K.indexOf(h.focusedId):-1,ut=K[(st+(I.key==="ArrowRight"?1:-1)+K.length)%K.length];if(ut){h==null||h.focus(ut),M.select(ut);const lt=h==null?void 0:h.anchor(ut),Ot=r.get(ut);lt&&Ot&&y.showTip(Ot,null,lt.x-40,lt.y-50)}return}if(I.key==="Enter"&&(h!=null&&h.focusedId)&&h.focusedId!=="vcr"){E.play(h.focusedId);return}/^[0-9]$/.test(I.key)&&(Z=(Z+I.key).slice(-2),clearTimeout(N),h==null||h.scroll(`ch ${Z}`),N=window.setTimeout(()=>{const st=U.get(Number(Z));Z="",st&&r.has(st)&&E.play(st)},700))}}}});function W(){const I=s==null?void 0:s.querySelector(".xp-startmenu");return I&&!I.hidden?(y.toggleMenu(!1),!1):!0}let B=!1;document.addEventListener("visibilitychange",()=>{document.hidden?(h==null||h.stop(),n.stop(),m&&w(!0)):B&&(h==null||h.start(),n.start())}),addEventListener("pageshow",I=>{I.persisted&&(x=!1,s.classList.remove("off"),h==null||h.reset())});const X=document.getElementById("oikos-boot");let nt=!1;try{nt=!!sessionStorage.getItem("oikos-booted"),sessionStorage.setItem("oikos-booted","1")}catch{}const ot=t||nt?250:1900;let at=()=>{};const xt=new Promise(I=>at=I);X==null||X.addEventListener("click",()=>at());const Gt=Promise.race([Promise.all([(ee=document.fonts)==null?void 0:ee.load('16px "Libertinus Mono"'),(Q=document.fonts)==null?void 0:Q.load('16px "Love Letter Typewriter"')]).then(()=>{},()=>{}),new Promise(I=>setTimeout(I,1500))]),xe=(h==null?void 0:h.warm())??Promise.resolve();Promise.race([Promise.all([Gt,xe,new Promise(I=>setTimeout(I,ot))]),xt]).then(()=>{B=!0,document.hidden||(n.start(),h==null||h.start()),h==null||h.powerOn(),X==null||X.classList.add("gone"),setTimeout(()=>X==null?void 0:X.remove(),800);const I=new URLSearchParams(location.search).get("look");I&&h&&(I==="vcr"||r.has(I))&&setTimeout(()=>h==null?void 0:h.focus(I),300);let q="";try{q=decodeURIComponent(location.hash.slice(1))}catch{}if(q==="mirc"){setTimeout(()=>E.chat(),600);return}if(q&&r.has(q)){setTimeout(()=>E.play(q),900);return}if(!h){E.home(),y.balloon("No room tonight","This browser has no WebGL, so the room of screens is dark. The tapes all still play.");return}setTimeout(()=>{if(a.list.length)return;const st=(h==null?void 0:h.anchor("vcr"))??void 0;y.balloon("This is the way in",innerWidth<=720?"Tap the VCR for the home directory, or any screen to tune in. Drag to look around.":"Click the VCR for your home directory, or any screen to tune in. Drag to look around; ← → walk the screens.",st,11e3,!0)},nt?900:2600)})}function GM(s,t,e,n){var a;(a=document.getElementById("oikos-boot"))==null||a.remove();const i=V("div");i.style.cssText="position:absolute;inset:0;overflow:auto;padding:16px;display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));background:#0a0a0a;";for(const l of t){const c=e.get(l.id);if(!c)continue;const u=V("figure");u.style.cssText="margin:0;color:#aaa;font:12px ui-monospace,monospace;",c.canvas.style.cssText="width:100%;display:block;border:1px solid #333;";const h=V("figcaption",{},[`${l.title} · ${l.kind}`]);h.style.padding="4px 0",u.append(c.canvas,h),i.append(u)}s.append(i),n.start();let r=performance.now();const o=l=>{requestAnimationFrame(o);const c=Math.min(.1,(l-r)/1e3);r=l;for(const u of e.values())u.tick(l/1e3,c,!1)};requestAnimationFrame(o)}})();
