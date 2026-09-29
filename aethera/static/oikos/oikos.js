var mv=Object.defineProperty;var gv=(xi,yn,Sn)=>yn in xi?mv(xi,yn,{enumerable:!0,configurable:!0,writable:!0,value:Sn}):xi[yn]=Sn;var I=(xi,yn,Sn)=>gv(xi,typeof yn!="symbol"?yn+"":yn,Sn);(function(){"use strict";var Au;function xi(){const s=document.getElementById("oikos-data");try{const t=JSON.parse((s==null?void 0:s.textContent)??"{}");return{sites:t.sites??[],files:t.files??[],posts:t.posts??[]}}catch{return{sites:[],files:[],posts:[]}}}const yn=s=>/^https?:\/\//.test(s);class Sn{constructor(t){I(this,"listeners",new Set);this.value=t}set(t){this.value=t;for(const e of this.listeners)e(t)}on(t){return this.listeners.add(t),()=>this.listeners.delete(t)}}function Vl(){try{const s=localStorage.getItem("syrinx-creature-v1");if(!s)return null;const t=JSON.parse(s);if(typeof t.name!="string"||typeof t.bornAt!="number"||!t.state)return null;const e=Array.isArray(t.state.nodes)?t.state.nodes:[],n=Array.isArray(t.state.edges)?t.state.edges:[];return e.length?{name:t.name,bornAt:t.bornAt,lifetime:typeof t.state.lifetime=="number"?t.state.lifetime:0,nodes:e.map(i=>({id:i.id,x:i.x,y:i.y,z:i.z??500,age:i.age??0})),edges:n.map(i=>({a:i.a,b:i.b,age:i.age??0}))}:null}catch{return null}}function Wl(s){return new Promise((t,e)=>{const n=new Image;n.decoding="async",n.onload=()=>t(n),n.onerror=e,n.src=s})}async function Qs(s){try{const t=await fetch(s,{headers:{Accept:"application/json"}});return t.ok?await t.json():null}catch{return null}}class Ou{constructor(){I(this,"dreams",new Sn({known:!1,awake:!1,frame:0,fps:0,viewers:0,raw:null}));I(this,"chronicle",new Sn({known:!1,thumb:null,thumbAt:0,prompt:"",template:"",eras:[],eraCount:0,strata:[]}));I(this,"irc",new Sn({connected:!1,lines:[],collapse:null,fragments:0,version:0}));I(this,"creature",new Sn(Vl()));I(this,"apeiron",new Sn(null));I(this,"timers",[]);I(this,"ws",null);I(this,"wsBackoff",2e3);I(this,"wsTimer",0);I(this,"running",!1)}start(){if(this.running)return;this.running=!0;const t=(e,n)=>{e(),this.timers.push(window.setInterval(e,n))};t(()=>void this.pollDreams(),2e4),t(()=>void this.pollChronicle(),12e4),t(()=>this.creature.set(Vl()),15e3),this.openIrc(),this.apeiron.value||this.loadApeiron()}stop(){this.running=!1;for(const t of this.timers)clearInterval(t);this.timers=[],clearTimeout(this.wsTimer),this.ws&&(this.ws.onclose=null,this.ws.close(),this.ws=null),this.irc.set({...this.irc.value,connected:!1,version:this.irc.value.version+1})}async pollDreams(){var e,n,i,r,a;const t=await Qs("/api/dreams/status");if(!t){this.dreams.set({...this.dreams.value,known:!1});return}this.dreams.set({known:!0,awake:!!((e=t.gpu)!=null&&e.active),frame:((n=t.generation)==null?void 0:n.current_frame)??((i=t.generation)==null?void 0:i.frame_count)??0,fps:((r=t.generation)==null?void 0:r.fps)??0,viewers:((a=t.viewers)==null?void 0:a.websocket_count)??0,raw:t})}async pollChronicle(){var a,o,l,c;const t=await Qs("/api/dreams/chronicle/timeline?hours=3");if(!t)return;const e=this.chronicle.value;let n=e.thumb;(a=t.live)!=null&&a.thumb&&t.live.thumb!==(n==null?void 0:n.dataset.src)&&(n=await Wl(t.live.thumb).catch(()=>e.thumb),n&&(n.dataset.src=t.live.thumb));const i=(t.tiles??[]).slice(-3),r=(await Promise.all(i.map(u=>Wl(u.url).catch(()=>null)))).filter(u=>!!u);this.chronicle.set({known:!0,thumb:n,thumbAt:((o=t.live)==null?void 0:o.t)??0,prompt:((l=t.live)==null?void 0:l.prompt)??"",template:((c=t.live)==null?void 0:c.template)??"",eras:(t.eras??[]).map(u=>({title:u.title??"",t0:u.t0,t1:u.t1,open:!!u.open,kf:u.kf??0})),eraCount:t.era_count??0,strata:r.length?r:e.strata})}openIrc(){const t=location.protocol==="https:"?"wss":"ws";let e;try{e=new WebSocket(`${t}://${location.host}/ws/irc`)}catch{return}this.ws=e;const n=i=>{const r=this.irc.value;this.irc.set({...r,...i,version:r.version+1})};e.onopen=()=>{this.wsBackoff=2e3,n({connected:!0})},e.onmessage=i=>{let r;try{r=JSON.parse(String(i.data))}catch{return}if(r.type==="message"&&r.data){const a=r.data,o=a.meta??{},l={nick:String(a.nick??""),content:String(a.content??""),type:String(a.type??"message"),stamp:String(a.timestamp??""),at:performance.now()};typeof o.target=="string"&&(l.target=o.target),typeof o.reason=="string"&&(l.reason=o.reason),n({lines:[...this.irc.value.lines,l].slice(-60)})}else r.type==="collapse_start"?n({collapse:{type:r.collapseType??"collapse",at:performance.now()}}):r.type==="fragment_end"&&n({collapse:null,lines:this.irc.value.lines.slice(-6),fragments:this.irc.value.fragments+1})},e.onclose=()=>{n({connected:!1}),this.running&&(this.wsTimer=window.setTimeout(()=>this.openIrc(),this.wsBackoff),this.wsBackoff=Math.min(this.wsBackoff*2,6e4))}}async loadApeiron(){const[t,e]=await Promise.all([Qs("/static/apeiron/data/templates.json"),Qs("/static/apeiron/data/components.json")]);t&&e&&this.apeiron.set({templates:t,components:e})}}const Dt=512,Vt=384,qt='"Libertinus Mono", "LibertinusMono", ui-monospace, monospace';class bn{constructor(t,e){I(this,"canvas");I(this,"ctx");I(this,"fps",15);I(this,"acc",1);I(this,"version",0);this.site=t,this.env=e,this.canvas=document.createElement("canvas"),this.canvas.width=Dt,this.canvas.height=Vt;const n=this.canvas.getContext("2d",{alpha:!1});if(!n)throw new Error("oikos: no 2d context");this.ctx=n}tick(t,e,n,i=1){this.acc+=e;const r=n?Math.max(this.fps,30):this.fps*i;if(this.acc<1/r)return!1;const a=this.acc;return this.acc=0,this.draw(t,a),this.version++,!0}clear(t){this.ctx.fillStyle=t,this.ctx.fillRect(0,0,Dt,Vt)}wrap(t,e,n=1/0){const i=this.ctx,r=t.split(/\s+/).filter(Boolean),a=[];let o="";for(const l of r){const c=o?`${o} ${l}`:l;if(i.measureText(c).width>e&&o){if(a.push(o),o=l,a.length>=n)break}else o=c}if(o&&a.length<n&&a.push(o),a.length===n&&a.join(" ").length<r.join(" ").length){let l=a[n-1]??"";for(;l&&i.measureText(`${l}…`).width>e;)l=l.replace(/\s*\S*$/,"");a[n-1]=`${l}…`}return a}condensed(t,e,n,i=.72,r="left"){const a=this.ctx;a.save(),a.translate(e,n),a.scale(i,1),a.textAlign=r,a.fillText(t,0,0),a.restore()}spaced(t,e,n,i,r="left"){const a=this.ctx,o=[...t],l=o.map(h=>a.measureText(h).width),c=l.reduce((h,d)=>h+d,0)+i*(o.length-1);let u=r==="center"?e-c/2:e;a.save(),a.textAlign="left",o.forEach((h,d)=>{a.fillText(h,u,n),u+=(l[d]??0)+i}),a.restore()}}function oa(s){let t=2166136261;for(let e=0;e<s.length;e++)t^=s.charCodeAt(e),t=Math.imul(t,16777619);return(t>>>0)%1e5/1e5}function vi(s){let t=s>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function ku(s){return Math.round(s).toLocaleString("en-US")}const Kn=62,ws=21,Bu=Dt/Kn,zu=12.4,Hu=42,la=" .,:;-=+*#%@";function Gu(){const s=[];for(let e=0;e<16;e++)s.push([e&1?1:-1,e&2?1:-1,e&4?1:-1,e&8?1:-1]);const t=[];for(let e=0;e<16;e++)for(let n=0;n<4;n++){const i=e^1<<n;if(i<e)continue;const r=s[e],a=s[i];if(!(!r||!a))for(let o=0;o<=18;o++){const l=o/18;t.push([r[0]+(a[0]-r[0])*l,r[1]+(a[1]-r[1])*l,r[2]+(a[2]-r[2])*l,r[3]+(a[3]-r[3])*l])}}return t}function Vu(){const s=[];for(let e=0;e<44;e++)for(let n=0;n<44;n++){const i=e/44*Math.PI*2,r=n/44*Math.PI*2;s.push([Math.cos(i)*1.3,Math.sin(i)*1.3,Math.cos(r)*1.3,Math.sin(r)*1.3])}return s}const ca=[Gu(),Vu()];class Wu extends bn{constructor(e,n){super(e,n);I(this,"gen",null);I(this,"seq",0);I(this,"depth",new Float32Array(Kn*ws));I(this,"glyph",new Uint8Array(Kn*ws));this.fps=18}generate(e){const n=this.env.feeds.apeiron.value,i=Math.floor(Math.random()*2**31),r=vi(i),{prompt:a,template:o}=n?$u(n,r):{prompt:"",template:"waking"},l=(i>>>0).toString(16).padStart(8,"0").replace(/(....)(....)/,"$1·$2");return{prompt:a,template:o,coordinate:l,hue:n?Math.floor(oa(a)*360):135,figure:ca[this.seq++%ca.length]??ca[0]??[],bornAt:e}}draw(e){(!this.gen||e-this.gen.bornAt>9||!this.gen.prompt&&this.env.feeds.apeiron.value)&&(this.gen=this.generate(e));const n=this.gen,i=this.ctx,r=`hsl(${n.hue} 100% 58%)`,a=`hsl(${n.hue} 100% 76%)`,o=`hsl(${n.hue} 60% 22%)`,l=i.createRadialGradient(Dt/2,Vt*.4,20,Dt/2,Vt*.4,Dt*.7);l.addColorStop(0,`hsl(${n.hue} 60% 7%)`),l.addColorStop(1,"#030309"),i.fillStyle=l,i.fillRect(0,0,Dt,Vt),i.font=`12px ${qt}`,i.fillStyle=r,i.fillText("apeiron",14,22),i.fillStyle=o,i.fillText("·  æthera",76,22),i.textAlign="right",i.fillStyle=r,i.fillText(n.template.replace(/_/g," "),Dt-14,22),i.textAlign="left",this.raster(e,n.figure),i.font=`12px ${qt}`;for(let d=0;d<ws;d++)for(let f=0;f<Kn;f++){const p=this.glyph[d*Kn+f]??0;p&&(i.fillStyle=p>9?a:p>4?r:o,i.fillText(la[p]??".",f*Bu,Hu+d*zu+10))}const c=e-n.bornAt,u=n.prompt||"reading the grammar…";i.font=`12px ${qt}`;const h=this.wrap(u.slice(0,Math.floor(c*70)),Dt-28,4);i.fillStyle="rgba(3,3,9,0.7)",i.fillRect(0,Vt-98,Dt,98),i.fillStyle=o,i.fillRect(14,Vt-98,Dt-28,1),i.fillStyle=a,h.forEach((d,f)=>i.fillText(d,14,Vt-78+f*15)),i.fillStyle=r,i.font=`11px ${qt}`,i.fillText(`⌖ ${n.coordinate}`,14,Vt-12),i.fillStyle=o,i.textAlign="right",i.fillText("␣ generate   F keep   A auto",Dt-14,Vt-12),i.textAlign="left"}raster(e,n){this.depth.fill(-1/0),this.glyph.fill(0);const i=e*.45,r=e*.31,a=e*.23,[o,l,c,u,h,d]=[Math.cos(i),Math.sin(i),Math.cos(r),Math.sin(r),Math.cos(a),Math.sin(a)];for(const f of n){let[p,v,m,g]=f;[p,g]=[p*o-g*l,p*l+g*o],[v,m]=[v*c-m*u,v*u+m*c],[m,g]=[m*h-g*d,m*d+g*h];const w=2.6/(3.2-g);p*=w,v*=w,m*=w;const E=3.4/(4.6-m),M=Math.round(Kn/2+p*E*11.5),S=Math.round(ws/2+v*E*5.6);if(M<0||M>=Kn||S<0||S>=ws)continue;const b=S*Kn+M;m>(this.depth[b]??-1/0)&&(this.depth[b]=m,this.glyph[b]=Math.max(1,Math.min(la.length-1,Math.round((m+2.2)/4.4*(la.length-1)))))}}}function $u(s,t){const e=s.templates[Math.floor(t()*s.templates.length)];return e?{prompt:e.structure.replace(/\{(\w+)\}/g,(i,r)=>{var o;const a=s.components[r];return a!=null&&a.length?((o=a[Math.floor(t()*a.length)])==null?void 0:o.word)??r:r.replace(/_/g," ")}),template:e.id}:{prompt:"",template:""}}const ha="#e8e2d4",ua="#a39d90",$l="#5d5850",Mi=34,ki=250,yi=84,js=Vt-yi-22;class Xu extends bn{constructor(e,n){super(e,n);I(this,"standIn");this.fps=10,this.standIn=qu()}draw(e){const n=this.ctx;this.clear("#070707"),n.fillStyle=ha,n.font=`22px ${qt}`,this.spaced("chronicle",Dt/2,38,11,"center"),n.fillStyle=ua,n.font=`11px ${qt}`,this.spaced("what the dream remembers",Dt/2,60,2,"center");const r=[...this.env.feeds.chronicle.value.strata].reverse();if(n.fillStyle="#000",n.fillRect(Mi-1,yi-1,ki+2,js+2),n.imageSmoothingEnabled=!0,r.length){const l=r.map((h,d)=>Math.pow(.6,d)),c=l.reduce((h,d)=>h+d,0);let u=yi;r.forEach((h,d)=>{const f=js*(l[d]??0)/c;n.save(),n.translate(Mi,u+f),n.scale(1,-1),n.drawImage(h,0,0,ki,f),n.restore(),u+=f,n.fillStyle="rgba(232,226,212,0.08)",n.fillRect(Mi,u,ki,1)})}else n.globalAlpha=.75,n.drawImage(this.standIn,Mi,yi,ki,js),n.globalAlpha=1;const a=yi+e*14%js,o=n.createLinearGradient(0,a-16,0,a+2);o.addColorStop(0,"rgba(232,226,212,0)"),o.addColorStop(1,"rgba(232,226,212,0.22)"),n.fillStyle=o,n.fillRect(Mi,a-16,ki,18),n.fillStyle="rgba(232,226,212,0.5)",n.fillRect(Mi-6,a,4,1),this.log(e)}log(e){const n=this.ctx,i=this.env.feeds.chronicle.value,r=Mi+ki+24,a=Dt-r-18;n.font=`11px ${qt}`,n.fillStyle=$l,n.fillText(i.known?`${i.eraCount||i.eras.length} eras`:"reading the core…",r,yi+8);const o=[...i.eras].reverse().slice(0,7);let l=yi+34;if(!o.length){n.fillStyle=ua;for(const c of this.wrap("every fifteen seconds of the dream settles here as one line of its own colour.",a,6))n.fillText(c,r,l),l+=15;return}for(const c of o){if(l>Vt-30)break;const u=new Date(c.t0*1e3);n.fillStyle=c.open?ha:$l,n.font=`10px ${qt}`;const h=`${u.getHours().toString().padStart(2,"0")}:${u.getMinutes().toString().padStart(2,"0")}`;n.fillText(c.open?`${h}  now`:h,r,l),c.open&&(n.fillStyle=Math.sin(e*3)>0?"#d6c9a8":"#6d6555",n.fillRect(r-10,l-6,4,4)),n.font=`12px ${qt}`,n.fillStyle=c.open?ha:ua;const d=this.wrap(c.title||"untitled",a,2);d.forEach((f,p)=>n.fillText(f,r,l+15+p*14)),l+=22+d.length*14}}}function qu(){const s=document.createElement("canvas");s.width=64,s.height=240;const t=s.getContext("2d");if(!t)return s;const e=vi(1729),n=["#5c3b36","#7a4f45","#3f3a4c","#8a6f64","#2d4a4f","#6b2c3a","#a38a74","#40302c"];let i=n[0];for(let r=0;r<s.height;r++){e()<.12&&(i=n[Math.floor(e()*n.length)]??i),t.fillStyle=i,t.fillRect(0,r,s.width,1);for(let a=0;a<6;a++)t.fillStyle=`rgba(255,255,255,${e()*.08})`,t.fillRect(e()*s.width,r,e()*12,1)}return s}const Yu="#07050b",da="#d59bff",tr="#4d3a63",fa="#e9e0f5",Si="#8a7b9e",Zn={x:18,y:54,w:128,h:74,label:"KEYFRAME N-1"},He={x:192,y:54,w:128,h:74,label:"KEYFRAME N"},Jn={x:366,y:54,w:128,h:74,label:"FRESH FRAME"},bi={x:18,y:176,w:302,h:52,label:"INTERPOLATION"},er={x:340,y:150,w:154,h:104,label:"COLLAPSE PREVENTION"};class Ku extends bn{constructor(t,e){super(t,e),this.fps=15}box(t,e){const n=this.ctx;n.strokeStyle=e>0?da:tr,n.globalAlpha=.5+e*.5,n.lineWidth=1,n.strokeRect(t.x+.5,t.y+.5,t.w,t.h),n.globalAlpha=1,n.font=`10px ${qt}`,n.fillStyle=e>0?fa:Si,n.fillText(t.label,t.x+6,t.y+13)}arrow(t,e,n,i,r,a){const o=this.ctx;o.strokeStyle=tr,o.beginPath(),o.moveTo(t,e),o.lineTo(n,i),o.stroke();const l=Math.sign(n-t||i-e);if(o.fillStyle=tr,o.beginPath(),e===i?(o.moveTo(n,i),o.lineTo(n-6*l,i-4),o.lineTo(n-6*l,i+4)):(o.moveTo(n,i),o.lineTo(n-4,i-6*l),o.lineTo(n+4,i-6*l)),o.fill(),a>=0&&a<=1){const c=t+(n-t)*a,u=e+(i-e)*a,h=o.createRadialGradient(c,u,0,c,u,8);h.addColorStop(0,"rgba(213,155,255,1)"),h.addColorStop(1,"rgba(213,155,255,0)"),o.fillStyle=h,o.fillRect(c-8,u-8,16,16)}r&&(o.font=`9px ${qt}`,o.fillStyle=Si,o.textAlign="center",o.fillText(r,(t+n)/2,e===i?e-6:(e+i)/2),o.textAlign="left")}draw(t){const e=this.ctx;this.clear(Yu);const n=this.env.feeds.chronicle.value,i=6,r=t%i/i,a=400+Math.floor(t/i);if(e.font=`14px ${qt}`,e.fillStyle=da,e.fillText("dream_gen",18,28),e.font=`10px ${qt}`,e.fillStyle=Si,e.fillText("a truly infinite diffusion stream",110,28),e.textAlign="right",e.fillText(`kf ${String(a).padStart(5,"0")}`,Dt-18,28),e.textAlign="left",this.box(Zn,r<.25?1:0),this.box(He,r>=.25&&r<.5?1:.2),this.box(Jn,0),this.box(bi,r>=.5?1:0),this.box(er,Math.sin(t*.8)>.6?1:0),n.thumb)e.drawImage(n.thumb,He.x+6,He.y+18,He.w-12,(He.w-12)/2),e.globalAlpha=.35,e.drawImage(n.thumb,Zn.x+6,Zn.y+18,Zn.w-12,(Zn.w-12)/2),e.globalAlpha=1;else for(const h of[Zn,He]){const d=e.createLinearGradient(h.x,h.y,h.x+h.w,h.y+h.h);d.addColorStop(0,`hsl(${(t*8+h.x)%360} 40% 30%)`),d.addColorStop(1,`hsl(${(t*8+h.x+90)%360} 40% 18%)`),e.fillStyle=d,e.fillRect(h.x+6,h.y+18,h.w-12,(h.w-12)/2)}e.fillStyle="#1b1426",e.fillRect(Jn.x+6,Jn.y+18,Jn.w-12,(Jn.w-12)/2),e.fillStyle=Si,e.font=`9px ${qt}`,e.fillText("txt2img on swap",Jn.x+10,Jn.y+50),this.arrow(Zn.x+Zn.w,91,He.x,91,"img2img",r<.25?r/.25:-1),this.arrow(Jn.x,91,He.x+He.w,91,"",-1),this.arrow(He.x+He.w/2,He.y+He.h,He.x+He.w/2,bi.y,"",r>=.25&&r<.5?(r-.25)/.25:-1);const o=16,l=r>=.5?Math.floor((r-.5)/.5*o):0;for(let h=0;h<o;h++)e.fillStyle=h<l?da:"#1e1629",e.fillRect(bi.x+8+h*18,bi.y+22,14,18);e.fillStyle=Si,e.font=`9px ${qt}`,e.textAlign="right",e.fillText(`${l}/${o} → stream`,bi.x+bi.w-6,bi.y+13),e.textAlign="left",[["1 mutation","BEND 0.7"],["2 cache","blend ~60%"],["3 swap","fresh txt2img"]].forEach(([h,d],f)=>{const p=er.y+34+f*22;e.fillStyle=fa,e.font=`10px ${qt}`,e.fillText(h,er.x+8,p),e.fillStyle=Si,e.fillText(d,er.x+78,p)}),e.fillStyle="rgba(20,12,30,0.8)",e.fillRect(0,Vt-110,Dt,110),e.fillStyle=tr,e.fillRect(18,Vt-110,Dt-36,1),e.font=`10px ${qt}`,e.fillStyle=Si,e.fillText(n.prompt?`prompt${n.template?` · ${n.template}`:""}`:"prompt",18,Vt-92),e.font=`12px ${qt}`,e.fillStyle=fa;const u=n.prompt||"the dreamer is asleep; its last prompt will appear here when the chronicle has one.";this.wrap(u,Dt-36,5).forEach((h,d)=>e.fillText(h,18,Vt-72+d*15))}}const nr=new Image;nr.src="/static/oikos/stage.jpg";const nn=372,sn=186,Xl=(Dt-nn)/2,ql=118;class Zu extends bn{constructor(e,n){super(e,n);I(this,"frame",document.createElement("canvas"));I(this,"fctx");I(this,"prev",null);I(this,"cur",null);I(this,"swapAt",0);this.fps=20,this.frame.width=nn,this.frame.height=sn;const i=this.frame.getContext("2d");if(!i)throw new Error("oikos: no 2d context");this.fctx=i}draw(e){const n=this.ctx;this.clear("#120406"),nr.complete&&nr.naturalWidth&&(n.globalAlpha=.95,n.drawImage(nr,0,0,Dt,Vt),n.globalAlpha=1);const i=this.env.feeds.chronicle.value;i.thumb&&i.thumb!==this.cur&&(this.prev=this.cur,this.cur=i.thumb,this.swapAt=e);const r=this.fctx;if(r.globalCompositeOperation="source-over",r.globalAlpha=1,this.cur){const o=Math.min(1,(e-this.swapAt)/2.5);this.prev&&o<1&&this.kenBurns(this.prev,e-20),r.globalAlpha=this.prev?o:1,this.kenBurns(this.cur,e),r.globalAlpha=1}else this.standIn(e);const a=r.createRadialGradient(nn/2,sn/2,sn*.25,nn/2,sn/2,nn*.56);a.addColorStop(0,"rgba(0,0,0,1)"),a.addColorStop(.72,"rgba(0,0,0,0.9)"),a.addColorStop(1,"rgba(0,0,0,0)"),r.globalCompositeOperation="destination-in",r.fillStyle=a,r.fillRect(0,0,nn,sn),r.globalCompositeOperation="source-over",n.save(),n.globalCompositeOperation="lighter",n.globalAlpha=.18,n.drawImage(this.frame,Xl-30,ql+sn-20,nn+60,90),n.restore(),n.drawImage(this.frame,Xl,ql),this.status(e),n.fillStyle="rgba(8,4,4,0.72)",n.fillRect(0,Vt-34,Dt,34),n.fillStyle="#efe6d2",n.font=`12px ${qt}`,this.spaced("NOW SHOWING · A DREAM · ALL NIGHT",Dt/2,Vt-13,3,"center")}kenBurns(e,n){const i=1.06+.05*Math.sin(n*.07),r=Math.sin(n*.05)*10,a=Math.cos(n*.043)*5,o=nn*i,l=sn*i;this.fctx.drawImage(e,(nn-o)/2+r,(sn-l)/2+a,o,l)}standIn(e){const n=this.fctx,i=n.createLinearGradient(0,0,0,sn);i.addColorStop(0,"#3a2440"),i.addColorStop(1,"#170d1c"),n.fillStyle=i,n.fillRect(0,0,nn,sn);const r=[12,330,280,20,350];for(let a=0;a<5;a++){const o=e*(.11+a*.03)+a*1.7,l=nn/2+Math.cos(o)*(60+a*14)*(a%2?1:-1),c=sn/2+Math.sin(o*1.3)*30,u=52+22*Math.sin(o*.7+a),h=n.createRadialGradient(l,c,0,l,c,u);h.addColorStop(0,`hsla(${r[a]} 90% 66% / 0.75)`),h.addColorStop(1,`hsla(${r[a]} 90% 50% / 0)`),n.fillStyle=h,n.fillRect(0,0,nn,sn)}}status(e){const n=this.ctx,i=this.env.feeds.dreams.value,r=this.env.feeds.chronicle.value;n.font=`12px ${qt}`;let a,o;i.known&&i.awake?(o=Math.sin(e*4)>0?"#ff3b3b":"#6a1010",a=`LIVE  frame ${ku(i.frame)}${i.viewers?`  ·  ${i.viewers} watching`:""}`):i.known?(o="#5a5a5a",a=r.thumb?"asleep  ·  last remembered":"asleep  ·  wakes when watched"):(o="#3a3a3a",a=r.thumb?"last remembered":"no signal  ·  a stand-in");const l=n.measureText(a).width+34;n.fillStyle="rgba(0,0,0,0.55)",n.fillRect(14,14,l,24),n.fillStyle=o,n.beginPath(),n.arc(27,26,4.5,0,Math.PI*2),n.fill(),n.fillStyle="#f2e9dc",n.fillText(a,38,30)}}const Ju="#04060c",Yl="#9fc6ff",Es="#3d5378",Ts="#c9d1d9",Qu="#a5e3b5",pa="#ffc387",Kl=[["GET","/api/dreams/status","how it is (never wakes it)"],["WS ","/ws/dreams","the dream itself, h264"],["GET","/api/dreams/stream","MPEG-TS"],["SSE","/api/dreams/sse","events"],["GET","/api/dreams/embed","take it with you"]];class ju extends bn{constructor(e,n){super(e,n);I(this,"askedAt",-10);I(this,"lastRaw");this.fps=12}draw(e){const n=this.ctx;this.clear(Ju);const i=this.env.feeds.dreams.value.raw;i!==this.lastRaw&&(this.lastRaw=i,this.askedAt=e);const r=e-this.askedAt;n.font=`13px ${qt}`;const a=`curl -s ${location.host}/api/dreams/status`,o=a.slice(0,Math.floor(r*38));if(n.fillStyle=Es,n.fillText("$",16,28),n.fillStyle=Yl,n.fillText(o+(o.length<a.length||Math.floor(e*2)%2?"▌":""),32,28),o.length>=a.length){const c=i?td(i,11):[[{text:"curl: (52) the dream did not answer",color:"#e58a8a"}]],u=Math.floor((r-a.length/38)*30);c.slice(0,u).forEach((h,d)=>{let f=16;for(const p of h)n.fillStyle=p.color,n.fillText(p.text,f,52+d*17),f+=n.measureText(p.text).width})}const l=Vt-128;n.fillStyle="rgba(159,198,255,0.06)",n.fillRect(10,l-20,Dt-20,138),n.strokeStyle="rgba(159,198,255,0.25)",n.strokeRect(10.5,l-19.5,Dt-21,137),n.font=`11px ${qt}`,n.fillStyle=Es,n.fillText("ENDPOINTS",20,l-4),Kl.forEach(([c,u,h],d)=>{const f=l+16+d*19,p=Math.floor(e/2.5)%Kl.length===d;n.fillStyle=p?pa:Es,n.fillText(c,20,f),n.fillStyle=p?"#ffffff":Yl,n.fillText(u,58,f),n.fillStyle=Es,n.fillText(h,250,f)})}}function td(s,t){const e=[],n=(i,r,a,o)=>{if(e.length>=t)return;const l=[{text:r,color:Ts}];a!==null&&l.push({text:`"${a}": `,color:Ts});const c=o?"":",";if(i&&typeof i=="object"&&!Array.isArray(i)){const d=Object.entries(i);e.push([...l,{text:"{",color:Ts}]),d.forEach(([f,p],v)=>n(p,`${r}  `,f,v===d.length-1)),e.length<t&&e.push([{text:`${r}}${c}`,color:Ts}]);return}let u,h;typeof i=="string"?(u=`"${i}"`,h=Qu):Array.isArray(i)?(u=JSON.stringify(i),h=pa):(u=String(i),h=pa),e.push([...l,{text:u,color:h},{text:c,color:Ts}])};return n(s,"",null,!0),e.length>=t&&(e[t-1]=[{text:"  …",color:Es}]),e}const De={bg:"#181522",screen:"#231f36",fg:"#c9d1d9",dim:"#6e7681",sys:"#8b949e",quit:"#f85149",action:"#a371f7",join:"#3fb950"},Zl=["#58a6ff","#3fb950","#d29922","#a371f7","#f778ba","#39c5cf","#ff7b72","#7ee787","#ffa657","#79c0ff","#d2a8ff","#56d364"];function ed(s){let t=0;for(const e of s)t=t*31+e.charCodeAt(0)>>>0;return Zl[t%Zl.length]??De.fg}function nd(s){const t=[{text:`[${s.stamp}] `,color:De.dim}],e=s.nick,n=s.content;switch(s.type){case"message":t.push({text:`<${e}> `,color:ed(e)},{text:n,color:De.fg});break;case"action":t.push({text:`* ${e} ${n}`,color:De.action});break;case"quit":t.push({text:`⫫ ${e} has quit${n?` (${n})`:""}`,color:De.quit});break;case"part":t.push({text:`← ${e} has left${n?` (${n})`:""}`,color:De.sys});break;case"join":t.push({text:`→ ${e} has joined`,color:De.join});break;case"kick":{const i=s.reason||n;t.push({text:`⚠ ${s.target?`${s.target} was kicked by ${e}`:`${e} kicked someone`}${i?` (${i})`:""}`,color:De.quit})}break;default:t.push({text:`*** ${n||e}`,color:De.sys})}return t}const Jl=16,Bi=16,ma=50;class id extends bn{constructor(e,n){super(e,n);I(this,"laidOut",[]);I(this,"seen",-1);this.fps=15}layout(){const e=this.env.feeds.irc.value;e.version!==this.seen&&(this.seen=e.version,this.ctx.font=`12.5px ${qt}`,this.laidOut=e.lines.map(n=>({rows:this.wrapChunks(nd(n),Dt-Bi*2),at:n.at})))}wrapChunks(e,n){var o;const i=this.ctx,r=[[]];let a=0;for(const l of e)for(const c of l.text.split(/(\s+)/)){if(!c)continue;const u=i.measureText(c).width;a+u>n&&a>0&&c.trim()&&(r.push([{text:"    ",color:l.color}]),a=i.measureText("    ").width),(o=r[r.length-1])==null||o.push({text:c,color:l.color}),a+=u}return r}draw(e){this.layout();const n=this.ctx,i=this.env.feeds.irc.value;this.clear(De.bg),n.fillStyle=De.screen,n.fillRect(6,6,Dt-12,Vt-12),n.fillStyle="rgba(88,166,255,0.1)",n.fillRect(6,6,Dt-12,28),n.font=`13px ${qt}`,n.fillStyle="#58a6ff",n.fillText("#aethera",Bi,25),n.fillStyle=De.dim,n.font=`11px ${qt}`,n.textAlign="right";const r=i.connected?Math.sin(e*3)>-.3?"● live":"○ live":"○ connecting…";n.fillStyle=i.connected?De.join:De.dim,n.fillText(r,Dt-Bi,25),n.textAlign="left";const a=i.collapse?Math.min(1,(performance.now()-i.collapse.at)/1500):0;n.font=`12.5px ${qt}`;const o=[],l=performance.now();for(const h of this.laidOut)for(const d of h.rows)o.push({chunks:d,fresh:Math.max(0,1-(l-h.at)/600)});const c=Math.floor((Vt-ma-12)/Jl),u=o.slice(-c);u.length||(n.fillStyle=De.sys,n.fillText(i.connected?"*** the channel is quiet between fragments":"*** connecting to #aethera…",Bi,ma+12)),u.forEach((h,d)=>{let f=Bi;const p=ma+12+d*Jl,v=a?Math.sin(p*.3+e*40)*8*a*(Math.random()<.3?1:0):0;for(const m of h.chunks)n.fillStyle=a>.2&&Math.random()<a*.4?De.quit:m.color,n.globalAlpha=1-h.fresh*.6,n.fillText(m.text,f+v,p),f+=n.measureText(m.text).width;n.globalAlpha=1}),i.collapse&&(n.fillStyle=`rgba(248,81,73,${.08*a})`,n.fillRect(0,0,Dt,Vt),n.fillStyle=De.quit,n.font=`11px ${qt}`,n.textAlign="right",n.fillText(`*** ${i.collapse.type}`,Dt-Bi,Vt-14),n.textAlign="left")}}const sd={pelos:"#8c6a4f",halon:"#6fa8a0",keramai:"#c2803a",chalkis:"#7d4a86",pyrrha:"#d14e3c",elektra:"#e0b33a",daphnaia:"#4e8b4a",ouranis:"#3d5fa8"},Ql=[["Arche",null,0],["Ostrakon Row","pelos",60],["Grammateion",null,0],["Pelos Walk","pelos",60],["Eisphora",null,0],["Boreas Gate",null,200],["Halas Steps","halon",100],["Moira",null,0],["Tarichos Street","halon",100],["Limen Approach","halon",120],["Desmoterion",null,0],["Kerameikos Walk","keramai",140],["Pyrphoros",null,150],["Amphora Yard","keramai",140],["Pithos Street","keramai",160],["Eos Gate",null,200],["Chalkeion Gate","chalkis",180],["Grammateion",null,0],["Akmon Court","chalkis",180],["Orichalkon Row","chalkis",200],["Temenos",null,0],["Kaminos Way","pyrrha",220],["Moira",null,0],["Pyrrha Rise","pyrrha",220],["Phlox Avenue","pyrrha",240],["Notos Gate",null,200],["Elektron Quay","elektra",260],["Helios Terrace","elektra",260],["Krene",null,150],["Lampter Mile","elektra",280],["Kerux",null,0],["Daphne Green","daphnaia",300],["Myrtos Park","daphnaia",300],["Grammateion",null,0],["Kotinos Crown","daphnaia",320],["Zephyros Gate",null,200],["Moira",null,0],["Astron Hill","ouranis",350],["Choregia",null,0],["Ouranos Point","ouranis",400]],Qn=[{name:"ada",model:!1,color:"#f2efe6"},{name:"claude",model:!0,color:"#d97757"},{name:"tomas",model:!1,color:"#6fb3e0"},{name:"gemma",model:!0,color:"#9be07a"}];function ga(s){return s<=10?[10-s,10]:s<=20?[0,10-(s-10)]:s<=30?[s-20,0]:[10,s-30]}const jl=17,rd=Dt/2,_a=168;function hn(s,t){const e=(s-5.5)*jl,n=(t-5.5)*jl;return[rd+(e-n)*.72,_a+(e+n)*.42]}class ad extends bn{constructor(e,n){super(e,n);I(this,"pos",[0,0,0,0]);I(this,"hop",{seat:0,from:0,left:0,k:0});I(this,"dice",[3,4]);I(this,"owner",new Map);I(this,"log",["A new game begins with 4 players."]);I(this,"turn",0);I(this,"wait",1.2);I(this,"rand",vi(4242));this.fps=20}say(e){this.log=[...this.log,e].slice(-3)}step(e){var a;if(this.hop.left>0){this.hop.k+=e/.16,this.hop.k>=1&&(this.hop.k=0,this.hop.left--,this.pos[this.hop.seat]=((this.pos[this.hop.seat]??0)+1)%40,this.hop.left===0&&this.land(this.hop.seat));return}if(this.wait-=e,this.wait>0)return;const n=this.turn%Qn.length,i=1+Math.floor(this.rand()*6),r=1+Math.floor(this.rand()*6);this.dice=[i,r],this.say(`${(a=Qn[n])==null?void 0:a.name} rolls ${i} and ${r}.`),this.hop={seat:n,from:this.pos[n]??0,left:i+r,k:0},this.turn++,this.wait=1.6}land(e){var c,u;const n=this.pos[e]??0,[i,r,a]=Ql[n]??["",null,0],o=((c=Qn[e])==null?void 0:c.name)??"",l=this.owner.get(n);if(a&&l===void 0&&this.rand()<.75)this.owner.set(n,e),this.say(`${o} buys ${i} for ₯${a}.`);else if(l!==void 0&&l!==e){const h=Math.max(2,Math.round(a/(r?12:8)));this.say(`${o} pays ₯${h} to ${(u=Qn[l])==null?void 0:u.name} for ${i}.`)}else i==="Moira"||i==="Grammateion"?this.say(`${o} draws from ${i}.`):i==="Kerux"&&(this.say(`${o} is sent to the Desmoterion.`),this.pos[e]=10);this.owner.size>22&&this.owner.clear()}draw(e,n){var c;this.step(Math.min(n,.2));const i=this.ctx,r=i.createRadialGradient(Dt/2,_a,40,Dt/2,_a,Dt*.7);r.addColorStop(0,"#2a241f"),r.addColorStop(1,"#141210"),i.fillStyle=r,i.fillRect(0,0,Dt,Vt);const a=[hn(-.4,-.4),hn(11.4,-.4),hn(11.4,11.4),hn(-.4,11.4)];i.fillStyle="rgba(0,0,0,0.45)",i.beginPath(),a.forEach(([u,h],d)=>d?i.lineTo(u,h+8):i.moveTo(u,h+8)),i.fill(),i.fillStyle="#d9ccb2",i.beginPath(),a.forEach(([u,h],d)=>d?i.lineTo(u,h):i.moveTo(u,h)),i.fill();for(let u=0;u<40;u++){const[h,d]=ga(u),[,f]=Ql[u]??["",null,0],p=[hn(h,d),hn(h+1,d),hn(h+1,d+1),hn(h,d+1)];i.fillStyle=f?sd[f]??"#efe4cf":u%10===0?"#e6d6b6":"#efe4cf",i.strokeStyle="#7a6a52",i.lineWidth=.7,i.beginPath(),p.forEach(([m,g],w)=>w?i.lineTo(m,g):i.moveTo(m,g)),i.closePath(),i.fill(),i.stroke();const v=this.owner.get(u);if(v!==void 0){const[m,g]=hn(h+.5,d+.5);i.fillStyle=((c=Qn[v])==null?void 0:c.color)??"#fff",i.fillRect(m-2,g-5,4,5)}}const[o,l]=hn(5.5,5.5);i.fillStyle="#7a6a52",i.font=`15px ${qt}`,this.spaced("KLEROS",o,l+5,5,"center"),Qn.forEach((u,h)=>{let d=this.pos[h]??0,f=0,[p,v]=ga(d);if(this.hop.left>0&&this.hop.seat===h){const[E,M]=ga((d+1)%40);p+=(E-p)*this.hop.k,v+=(M-v)*this.hop.k,f=Math.sin(this.hop.k*Math.PI)*9,d=-1}const m=[[.3,.3],[.7,.3],[.3,.7],[.7,.7]][h]??[.5,.5],[g,w]=hn(p+(m[0]??.5),v+(m[1]??.5));i.fillStyle="rgba(0,0,0,0.35)",i.beginPath(),i.ellipse(g,w+1,5,2.5,0,0,Math.PI*2),i.fill(),i.fillStyle=u.color,i.beginPath(),i.arc(g,w-5-f,4.6,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(0,0,0,0.5)",i.stroke()}),this.dice.forEach((u,h)=>this.die(Dt-70+h*30,22,u,e)),i.font=`11px ${qt}`,Qn.forEach((u,h)=>{const d=26+h*16;i.fillStyle=u.color,i.fillRect(16,d-8,8,8),i.fillStyle=(this.turn-1)%Qn.length===h?"#f5ecd9":"#8c826f",i.fillText(`${u.name}${u.model?"  ◆ model":""}`,30,d)}),i.fillStyle="rgba(10,8,6,0.75)",i.fillRect(0,Vt-62,Dt,62),i.font=`12px ${qt}`,this.log.forEach((u,h)=>{i.fillStyle=h===this.log.length-1?"#f1e6cc":"#8a7f6a",i.fillText(u,16,Vt-42+h*16)})}die(e,n,i,r){const a=this.ctx,o=this.hop.left>0?Math.sin(r*30)*.15:0;a.save(),a.translate(e,n),a.rotate(o),a.fillStyle="#efe4cf",a.fillRect(-10,-10,20,20),a.fillStyle="#3a2f24";const l={1:[[0,0]],2:[[-5,-5],[5,5]],3:[[-5,-5],[0,0],[5,5]],4:[[-5,-5],[5,-5],[-5,5],[5,5]],5:[[-5,-5],[5,-5],[0,0],[-5,5],[5,5]],6:[[-5,-5],[5,-5],[-5,0],[5,0],[-5,5],[5,5]]};for(const[c,u]of l[i]??[])a.beginPath(),a.arc(c,u,1.8,0,Math.PI*2),a.fill();a.restore()}}class od extends bn{constructor(e,n){super(e,n);I(this,"body");I(this,"creatureRef");I(this,"stars");I(this,"breaths",[]);this.fps=24;const i=vi(33);this.stars=Array.from({length:90},()=>({x:i()*Dt,y:i()*Vt,a:i()*.5+.1})),this.body=ec()}sync(){const e=this.env.feeds.creature.value;e!==this.creatureRef&&(this.creatureRef=e,this.body=e?ld(e):ec(),this.breaths=Array.from({length:Math.min(4,this.body.edges.length)},(n,i)=>({edge:i*7%Math.max(1,this.body.edges.length),k:0,fwd:!0})))}draw(e,n){this.sync();const i=this.ctx,r=this.body,a=i.createLinearGradient(0,0,0,Vt);a.addColorStop(0,"#070b14"),a.addColorStop(1,"#02030a"),i.fillStyle=a,i.fillRect(0,0,Dt,Vt);for(const p of this.stars)i.fillStyle=`rgba(200,215,255,${p.a*(.7+.3*Math.sin(e+p.x))})`,i.fillRect(p.x,p.y,1,1);const o=r.born?1.4:.9,l=Math.min(n,.1),c=r.nodes.map((p,v)=>{var w;const m=r.adj[v]??[];let g=0;for(const E of m)g+=Math.sin((((w=r.nodes[E])==null?void 0:w.phase)??0)-p.phase);return p.phase+(p.omega+(m.length?o*g/m.length:0))*l});r.nodes.forEach((p,v)=>{const m=c[v]??p.phase;Math.floor(m/(Math.PI*2))>Math.floor(p.phase/(Math.PI*2))&&(p.flash=1),p.phase=m,p.flash=Math.max(0,p.flash-l*2.2)});const u=e*.18,h=Math.cos(u),d=Math.sin(u),f=r.nodes.map((p,v)=>{const m=Math.sin(e*.9+v)*.02,g=p.x*h-p.z*d,E=2.8/(3.6-(p.x*d+p.z*h));return{x:Dt/2+g*E*150,y:176+(p.y+m)*E*150,k:E}});i.lineCap="round";for(const p of r.edges){const v=f[p.a],m=f[p.b];!v||!m||(i.strokeStyle=p.elder?"rgba(160,200,235,0.55)":"rgba(140,170,210,0.28)",i.lineWidth=p.elder?1.4:.8,i.beginPath(),i.moveTo(v.x,v.y),i.lineTo(m.x,m.y),i.stroke())}for(const p of this.breaths){const v=r.edges[p.edge];if(!v)continue;if(p.k+=l/.75,p.k>=1){const S=p.fwd?v.b:v.a,b=(r.adj[S]??[]).map(T=>r.edges.findIndex(L=>L.a===S&&L.b===T||L.b===S&&L.a===T)),R=b[Math.floor(Math.random()*b.length)]??p.edge,x=r.edges[R];p.edge=R,p.fwd=x?x.a===S:!0,p.k=0;continue}const m=f[p.fwd?v.a:v.b],g=f[p.fwd?v.b:v.a];if(!m||!g)continue;const w=m.x+(g.x-m.x)*p.k,E=m.y+(g.y-m.y)*p.k,M=i.createRadialGradient(w,E,0,w,E,9);M.addColorStop(0,"rgba(235,245,255,0.95)"),M.addColorStop(1,"rgba(180,220,255,0)"),i.fillStyle=M,i.fillRect(w-9,E-9,18,18)}r.nodes.forEach((p,v)=>{const m=f[v];if(!m)return;const g=p.flash,w=2+m.k*1.2+g*3,E=g>.05?`rgba(255,${Math.round(210-g*40)},${Math.round(120-g*60)},${.6+g*.4})`:"rgba(200,225,255,0.85)";i.strokeStyle=E,i.lineWidth=.8,i.beginPath(),i.moveTo(m.x-w*3,m.y),i.lineTo(m.x+w*3,m.y),i.moveTo(m.x,m.y-w*3),i.lineTo(m.x,m.y+w*3),i.stroke();const M=i.createRadialGradient(m.x,m.y,0,m.x,m.y,w*2.4);M.addColorStop(0,E),M.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=M,i.fillRect(m.x-w*3,m.y-w*3,w*6,w*6)}),i.font=`15px ${qt}`,i.fillStyle=r.born?"#e6f1ff":"#8190a8",i.fillText(r.name,18,Vt-40),i.font=`11px ${qt}`,i.fillStyle="#6f7f99",i.fillText(r.age,18,Vt-20),i.textAlign="right",i.fillStyle="#4b5870",i.fillText(r.born?`${r.nodes.length} nodes · ${r.edges.length} strings`:"click to wake it",Dt-18,Vt-20),i.textAlign="left"}}function tc(s,t){var n,i;const e=Array.from({length:s},()=>[]);for(const r of t)(n=e[r.a])==null||n.push(r.b),(i=e[r.b])==null||i.push(r.a);return e}function ld(s){const t=new Map(s.nodes.map((c,u)=>[c.id,u])),e=s.nodes.reduce((c,u)=>c+u.x,0)/s.nodes.length,n=s.nodes.reduce((c,u)=>c+u.y,0)/s.nodes.length,i=s.nodes.reduce((c,u)=>c+u.z,0)/s.nodes.length,r=Math.max(1,...s.nodes.map(c=>Math.hypot(c.x-e,c.y-n,c.z-i))),a=s.nodes.map((c,u)=>({x:(c.x-e)/r,y:(c.y-n)/r,z:(c.z-i)/r,phase:u*1.3,omega:2.4+u%5*.21,flash:0})),o=s.edges.map(c=>({a:t.get(c.a)??-1,b:t.get(c.b)??-1,elder:c.age>150})).filter(c=>c.a>=0&&c.b>=0),l=Math.max(s.lifetime,(Date.now()-s.bornAt)/1e3);return{name:s.name,age:`${cd(l)} old · yours`,born:!0,nodes:a,edges:o,adj:tc(a.length,o)}}function ec(){const s=vi(9),t=9,e=Array.from({length:t},(i,r)=>{const a=r/t*Math.PI*2;return{x:Math.cos(a)*.8+(s()-.5)*.3,y:(s()-.5)*.9,z:Math.sin(a)*.8,phase:s()*6,omega:2.2+s()*.8,flash:0}}),n=[];for(let i=0;i<t;i++)n.push({a:i,b:(i+1)%t,elder:i%3===0});return n.push({a:0,b:4,elder:!1},{a:2,b:6,elder:!1},{a:3,b:8,elder:!0}),{name:"something stirs",age:"unborn in this browser",born:!1,nodes:e,edges:n,adj:tc(t,n)}}function cd(s){const t=Math.max(0,Math.floor(s)),e=Math.floor(t/86400),n=Math.floor(t%86400/3600),i=Math.floor(t%3600/60);return e>0?`${e}d ${n}h`:n>0?`${n}h ${i}m`:`${i}m`}const zi=new Image;zi.src="/static/uploads/aethera_trimmed.png";class hd extends bn{constructor(e,n){super(e,n);I(this,"specks");this.fps=12;const i=vi(7);this.specks=Array.from({length:70},()=>({x:i()*Dt,y:i()*Vt,r:i()*1.2+.3,red:i()<.35,v:i()*4+1}))}draw(e){const n=this.ctx;this.clear("#000");for(const c of this.specks){const u=(c.y-e*c.v+Vt)%Vt;n.fillStyle=c.red?"rgba(170,40,50,0.55)":"rgba(255,255,255,0.28)",n.fillRect(c.x,u,c.r,c.r)}if(zi.complete&&zi.naturalWidth){const u=210*zi.naturalHeight/zi.naturalWidth;n.globalAlpha=.92+.08*Math.sin(e*1.3),n.drawImage(zi,(Dt-210)/2,26,210,u),n.globalAlpha=1}n.fillStyle="#7d7d7d",n.font=`13px ${qt}`,this.spaced("transmissions",Dt/2,118,3,"center"),n.fillStyle="#262626",n.fillRect(40,132,Dt-80,1);const i=this.env.dir.posts.slice(0,6);if(!i.length){n.fillStyle="#9a9a9a",n.font=`16px ${qt}`,n.textAlign="center",n.fillText(`no transmissions yet${Math.floor(e*2)%2?"_":" "}`,Dt/2,230),n.textAlign="left";return}const r=3.6,a=Math.floor(e/r)%i.length,o=e%r/r;i.forEach((c,u)=>{const h=162+u*29,d=u===a;n.font=`11px ${qt}`,n.fillStyle=d?"#bdbdbd":"#555",n.fillText(c.date,46,h),n.font=`15px ${qt}`,n.fillStyle=d?"#ffffff":"#9a9a9a";const f=c.title.length>38?`${c.title.slice(0,37)}…`:c.title;n.fillText(f,132,h),d&&this.star(28,h-5,e)});const l=i[a];if(l!=null&&l.excerpt){n.font=`italic 12px ${qt}`,n.fillStyle="#8a8a8a";const c=Math.floor(Math.min(1,o*1.6)*l.excerpt.length);this.wrap(l.excerpt.slice(0,c),Dt-92,2).forEach((h,d)=>n.fillText(h,46,344+d*16))}}star(e,n,i){const r=this.ctx,a=7+Math.sin(i*5)*1.2;r.save(),r.translate(e,n),r.rotate(i*.8),r.fillStyle="#fff",r.shadowColor="#fff",r.shadowBlur=10,r.beginPath();for(let o=0;o<16;o++){const l=o/16*Math.PI*2,c=o%2?a*.28:o%4?a*.7:a;r.lineTo(Math.cos(l)*c,Math.sin(l)*c)}r.closePath(),r.fill(),r.restore()}}const ud={transmissions:hd,dreams:Zu,chronicle:Xu,"dreams-api":ju,apeiron:Wu,syrinx:od,irc:id,parlor:ad,dream_gen:Ku};class dd extends bn{draw(t){const e=this.ctx,n=["#c0c0c0","#c0c000","#00c0c0","#00c000","#c000c0","#c00000","#0000c0"];n.forEach((i,r)=>{e.fillStyle=i,e.fillRect(r*Dt/n.length,0,Dt/n.length+1,Vt*.66)}),e.fillStyle="#111",e.fillRect(0,Vt*.66,Dt,Vt*.34),e.fillStyle="#fff",e.font=`22px ${qt}`,e.textAlign="center",e.fillText(this.site.title,Dt/2,Vt*.82),e.font=`12px ${qt}`,e.fillStyle=Math.floor(t)%2?"#888":"#555",e.fillText("no programme yet",Dt/2,Vt*.92),e.textAlign="left"}}function fd(s,t){const e=ud[s.id]??dd;return new e(s,t)}const ir={dreams:{angle:0,r:4.9,y:.5,style:"tv",screenW:2,channel:1},transmissions:{angle:-27,r:4.5,y:.34,style:"beige",screenW:1.22,stand:!0,channel:2},chronicle:{angle:27,r:4.5,y:0,style:"black",screenW:1.3,channel:3},"dreams-api":{angle:27,r:4.5,y:0,style:"grey",screenW:.86,on:"chronicle",channel:4},apeiron:{angle:-54,r:4.2,y:0,style:"black",screenW:1.15,channel:5},irc:{angle:-54,r:4.2,y:0,style:"beige",screenW:.95,on:"apeiron",channel:6},syrinx:{angle:54,r:4.2,y:.28,style:"grey",screenW:1.08,channel:7},dream_gen:{angle:-20,r:7,y:4.35,style:"grey",screenW:1.02,hang:!0,feeds:"dreams",channel:8},parlor:{angle:20,r:6.5,y:3.6,style:"beige",screenW:1.1,hang:!0,channel:9}};function pd(s,t){const e=ir[s];if(e)return e;const n=Math.floor(t/2)+1;return{angle:(t%2?1:-1)*(68+n*10),r:5.4,y:0,style:"grey",screenW:1,channel:12+t}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const xa="185",Hi={ROTATE:0,DOLLY:1,PAN:2},Gi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},md=0,nc=1,gd=2,sr=1,_d=2,As=3,jn=0,Ge=1,Fn=2,wn=0,Vi=1,rr=2,ic=3,sc=4,xd=5,wi=100,vd=101,Md=102,yd=103,Sd=104,bd=200,wd=201,Ed=202,Td=203,va=204,Ma=205,Ad=206,Cd=207,Rd=208,Pd=209,Ld=210,Dd=211,Id=212,Nd=213,Ud=214,ya=0,Sa=1,ba=2,Wi=3,wa=4,Ea=5,Ta=6,Aa=7,rc=0,Fd=1,Od=2,En=0,Ca=1,Ra=2,Pa=3,ar=4,La=5,Da=6,Ia=7,ac=300,Ei=301,$i=302,Na=303,Ua=304,or=306,lr=1e3,On=1001,Fa=1002,Ie=1003,kd=1004,cr=1005,Ne=1006,Oa=1007,Ti=1008,Ze=1009,oc=1010,lc=1011,Cs=1012,ka=1013,Tn=1014,un=1015,Je=1016,Ba=1017,za=1018,Rs=1020,cc=35902,hc=35899,uc=1021,dc=1022,dn=1023,kn=1026,Ai=1027,Ha=1028,Ga=1029,Ci=1030,Va=1031,Wa=1033,hr=33776,ur=33777,dr=33778,fr=33779,$a=35840,Xa=35841,qa=35842,Ya=35843,Ka=36196,Za=37492,Ja=37496,Qa=37488,ja=37489,pr=37490,to=37491,eo=37808,no=37809,io=37810,so=37811,ro=37812,ao=37813,oo=37814,lo=37815,co=37816,ho=37817,uo=37818,fo=37819,po=37820,mo=37821,go=36492,_o=36494,xo=36495,vo=36283,Mo=36284,mr=36285,yo=36286,Bd=3200,So=0,zd=1,ti="",Se="srgb",Ps="srgb-linear",gr="linear",ne="srgb",Xi=7680,fc=519,Hd=512,Gd=513,Vd=514,bo=515,Wd=516,$d=517,wo=518,Xd=519,pc=35044,mc="300 es",An=2e3,Ls=2001;function qd(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function _r(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Yd(){const s=_r("canvas");return s.style.display="block",s}const gc={};function _c(...s){const t="THREE."+s.shift();console.log(t,...s)}function xc(s){const t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function It(...s){s=xc(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function Zt(...s){s=xc(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function qi(...s){const t=s.join(" ");t in gc||(gc[t]=!0,It(...s))}function Kd(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Zd={[ya]:Sa,[ba]:Ta,[wa]:Aa,[Wi]:Ea,[Sa]:ya,[Ta]:ba,[Aa]:wa,[Ea]:Wi};class ei{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,t);t.target=null}}}const Fe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let vc=1234567;const Ds=Math.PI/180,Yi=180/Math.PI;function Ki(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Fe[s&255]+Fe[s>>8&255]+Fe[s>>16&255]+Fe[s>>24&255]+"-"+Fe[t&255]+Fe[t>>8&255]+"-"+Fe[t>>16&15|64]+Fe[t>>24&255]+"-"+Fe[e&63|128]+Fe[e>>8&255]+"-"+Fe[e>>16&255]+Fe[e>>24&255]+Fe[n&255]+Fe[n>>8&255]+Fe[n>>16&255]+Fe[n>>24&255]).toLowerCase()}function Wt(s,t,e){return Math.max(t,Math.min(e,s))}function Eo(s,t){return(s%t+t)%t}function Jd(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Qd(s,t,e){return s!==t?(e-s)/(t-s):0}function Is(s,t,e){return(1-e)*s+e*t}function jd(s,t,e,n){return Is(s,t,1-Math.exp(-e*n))}function tf(s,t=1){return t-Math.abs(Eo(s,t*2)-t)}function ef(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function nf(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function sf(s,t){return s+Math.floor(Math.random()*(t-s+1))}function rf(s,t){return s+Math.random()*(t-s)}function af(s){return s*(.5-Math.random())}function of(s){s!==void 0&&(vc=s);let t=vc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function lf(s){return s*Ds}function cf(s){return s*Yi}function hf(s){return(s&s-1)===0&&s!==0}function uf(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function df(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function ff(s,t,e,n,i){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),u=a((t+n)/2),h=r((t-n)/2),d=a((t-n)/2),f=r((n-t)/2),p=a((n-t)/2);switch(i){case"XYX":s.set(o*u,l*h,l*d,o*c);break;case"YZY":s.set(l*d,o*u,l*h,o*c);break;case"ZXZ":s.set(l*h,l*d,o*u,o*c);break;case"XZX":s.set(o*u,l*p,l*f,o*c);break;case"YXY":s.set(l*f,o*u,l*p,o*c);break;case"ZYZ":s.set(l*p,l*f,o*u,o*c);break;default:It("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Zi(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ve(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const xr={DEG2RAD:Ds,RAD2DEG:Yi,generateUUID:Ki,clamp:Wt,euclideanModulo:Eo,mapLinear:Jd,inverseLerp:Qd,lerp:Is,damp:jd,pingpong:tf,smoothstep:ef,smootherstep:nf,randInt:sf,randFloat:rf,randFloatSpread:af,seededRandom:of,degToRad:lf,radToDeg:cf,isPowerOfTwo:hf,ceilPowerOfTwo:uf,floorPowerOfTwo:df,setQuaternionFromProperEuler:ff,normalize:Ve,denormalize:Zi},Fl=class Fl{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Wt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*i+t.x,this.y=r*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Fl.prototype.isVector2=!0;let lt=Fl;class Cn{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,a,o){let l=n[i+0],c=n[i+1],u=n[i+2],h=n[i+3],d=r[a+0],f=r[a+1],p=r[a+2],v=r[a+3];if(h!==v||l!==d||c!==f||u!==p){let m=l*d+c*f+u*p+h*v;m<0&&(d=-d,f=-f,p=-p,v=-v,m=-m);let g=1-o;if(m<.9995){const w=Math.acos(m),E=Math.sin(w);g=Math.sin(g*w)/E,o=Math.sin(o*w)/E,l=l*g+d*o,c=c*g+f*o,u=u*g+p*o,h=h*g+v*o}else{l=l*g+d*o,c=c*g+f*o,u=u*g+p*o,h=h*g+v*o;const w=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=w,c*=w,u*=w,h*=w}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],u=n[i+3],h=r[a],d=r[a+1],f=r[a+2],p=r[a+3];return t[e]=o*p+u*h+l*f-c*d,t[e+1]=l*p+u*d+c*h-o*f,t[e+2]=c*p+u*f+o*d-l*h,t[e+3]=u*p-o*h-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(i/2),h=o(r/2),d=l(n/2),f=l(i/2),p=l(r/2);switch(a){case"XYZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"YXZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"ZXY":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"ZYX":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"YZX":this._x=d*u*h+c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h-d*f*p;break;case"XZY":this._x=d*u*h-c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h+d*f*p;break;default:It("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=n+o+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(a-i)*f}else if(n>o&&n>h){const f=2*Math.sqrt(1+n-o-h);this._w=(u-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+c)/f}else if(o>h){const f=2*Math.sqrt(1+o-n-h);this._w=(r-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-n-o);this._w=(a-i)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Wt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+a*o+i*c-r*l,this._y=i*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-i*o,this._w=a*u-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,e=Math.sin(e*c)/u,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Ol=class Ol{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Mc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Mc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*i-o*n),u=2*(o*e-r*i),h=2*(r*n-a*e);return this.x=e+l*c+a*h-o*u,this.y=n+l*u+o*c-r*h,this.z=i+l*h+r*u-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this.z=Wt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this.z=Wt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return To.copy(this).projectOnVector(t),this.sub(To)}reflect(t){return this.sub(To.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Wt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Ol.prototype.isVector3=!0;let C=Ol;const To=new C,Mc=new Cn,kl=class kl{constructor(t,e,n,i,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c)}set(t,e,n,i,r,a,o,l,c){const u=this.elements;return u[0]=t,u[1]=i,u[2]=o,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],p=n[8],v=i[0],m=i[3],g=i[6],w=i[1],E=i[4],M=i[7],S=i[2],b=i[5],R=i[8];return r[0]=a*v+o*w+l*S,r[3]=a*m+o*E+l*b,r[6]=a*g+o*M+l*R,r[1]=c*v+u*w+h*S,r[4]=c*m+u*E+h*b,r[7]=c*g+u*M+h*R,r[2]=d*v+f*w+p*S,r[5]=d*m+f*E+p*b,r[8]=d*g+f*M+p*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return e*a*u-e*o*c-n*r*u+n*o*l+i*r*c-i*a*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],h=u*a-o*c,d=o*l-u*r,f=c*r-a*l,p=e*h+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return t[0]=h*v,t[1]=(i*c-u*n)*v,t[2]=(o*n-i*a)*v,t[3]=d*v,t[4]=(u*e-i*l)*v,t[5]=(i*r-o*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(a*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-i*c,i*l,-i*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return qi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ao.makeScale(t,e)),this}rotate(t){return qi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ao.makeRotation(-t)),this}translate(t,e){return qi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ao.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};kl.prototype.isMatrix3=!0;let zt=kl;const Ao=new zt,yc=new zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Sc=new zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function pf(){const s={enabled:!0,workingColorSpace:Ps,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ne&&(i.r=Bn(i.r),i.g=Bn(i.g),i.b=Bn(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ne&&(i.r=Ji(i.r),i.g=Ji(i.g),i.b=Ji(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ti?gr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return qi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return qi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Ps]:{primaries:t,whitePoint:n,transfer:gr,toXYZ:yc,fromXYZ:Sc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Se},outputColorSpaceConfig:{drawingBufferColorSpace:Se}},[Se]:{primaries:t,whitePoint:n,transfer:ne,toXYZ:yc,fromXYZ:Sc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Se}}}),s}const Kt=pf();function Bn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ji(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Qi;class mf{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Qi===void 0&&(Qi=_r("canvas")),Qi.width=t.width,Qi.height=t.height;const i=Qi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=Qi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=_r("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=Bn(r[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Bn(e[n]/255)*255):e[n]=Bn(e[n]);return{data:e,width:t.width,height:t.height}}else return It("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let gf=0;class Co{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:gf++}),this.uuid=Ki(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Ro(i[a].image)):r.push(Ro(i[a]))}else r=Ro(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function Ro(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?mf.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(It("Texture: Unable to serialize Texture."),{})}let _f=0;const Po=new C;class Oe extends ei{constructor(t=Oe.DEFAULT_IMAGE,e=Oe.DEFAULT_MAPPING,n=On,i=On,r=Ne,a=Ti,o=dn,l=Ze,c=Oe.DEFAULT_ANISOTROPY,u=ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_f++}),this.uuid=Ki(),this.name="",this.source=new Co(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new lt(0,0),this.repeat=new lt(1,1),this.center=new lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Po).x}get height(){return this.source.getSize(Po).y}get depth(){return this.source.getSize(Po).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){It(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){It(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ac)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case lr:t.x=t.x-Math.floor(t.x);break;case On:t.x=t.x<0?0:1;break;case Fa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case lr:t.y=t.y-Math.floor(t.y);break;case On:t.y=t.y<0?0:1;break;case Fa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Oe.DEFAULT_IMAGE=null,Oe.DEFAULT_MAPPING=ac,Oe.DEFAULT_ANISOTROPY=1;const Bl=class Bl{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],p=l[9],v=l[2],m=l[6],g=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-v)<.01&&Math.abs(p-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+v)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const E=(c+1)/2,M=(f+1)/2,S=(g+1)/2,b=(u+d)/4,R=(h+v)/4,x=(p+m)/4;return E>M&&E>S?E<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(E),i=b/n,r=R/n):M>S?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=b/i,r=x/i):S<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(S),n=R/r,i=x/r),this.set(n,i,r,e),this}let w=Math.sqrt((m-p)*(m-p)+(h-v)*(h-v)+(d-u)*(d-u));return Math.abs(w)<.001&&(w=1),this.x=(m-p)/w,this.y=(h-v)/w,this.z=(d-u)/w,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this.z=Wt(this.z,t.z,e.z),this.w=Wt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this.z=Wt(this.z,t,e),this.w=Wt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Bl.prototype.isVector4=!0;let pe=Bl;class xf extends ei{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ne,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new pe(0,0,t,e),this.scissorTest=!1,this.viewport=new pe(0,0,t,e),this.textures=[];const i={width:t,height:e,depth:n.depth},r=new Oe(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:Ne,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new Co(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Xe extends xf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class bc extends Oe{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ie,this.minFilter=Ie,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class vf extends Oe{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ie,this.minFilter=Ie,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const sa=class sa{constructor(t,e,n,i,r,a,o,l,c,u,h,d,f,p,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c,u,h,d,f,p,v,m)}set(t,e,n,i,r,a,o,l,c,u,h,d,f,p,v,m){const g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=i,g[1]=r,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=u,g[10]=h,g[14]=d,g[3]=f,g[7]=p,g[11]=v,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new sa().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,i=1/ji.setFromMatrixColumn(t,0).length(),r=1/ji.setFromMatrixColumn(t,1).length(),a=1/ji.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){const d=a*u,f=a*h,p=o*u,v=o*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=f+p*c,e[5]=d-v*c,e[9]=-o*l,e[2]=v-d*c,e[6]=p+f*c,e[10]=a*l}else if(t.order==="YXZ"){const d=l*u,f=l*h,p=c*u,v=c*h;e[0]=d+v*o,e[4]=p*o-f,e[8]=a*c,e[1]=a*h,e[5]=a*u,e[9]=-o,e[2]=f*o-p,e[6]=v+d*o,e[10]=a*l}else if(t.order==="ZXY"){const d=l*u,f=l*h,p=c*u,v=c*h;e[0]=d-v*o,e[4]=-a*h,e[8]=p+f*o,e[1]=f+p*o,e[5]=a*u,e[9]=v-d*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const d=a*u,f=a*h,p=o*u,v=o*h;e[0]=l*u,e[4]=p*c-f,e[8]=d*c+v,e[1]=l*h,e[5]=v*c+d,e[9]=f*c-p,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const d=a*l,f=a*c,p=o*l,v=o*c;e[0]=l*u,e[4]=v-d*h,e[8]=p*h+f,e[1]=h,e[5]=a*u,e[9]=-o*u,e[2]=-c*u,e[6]=f*h+p,e[10]=d-v*h}else if(t.order==="XZY"){const d=a*l,f=a*c,p=o*l,v=o*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+v,e[5]=a*u,e[9]=f*h-p,e[2]=p*h-f,e[6]=o*u,e[10]=v*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Mf,t,yf)}lookAt(t,e,n){const i=this.elements;return Qe.subVectors(t,e),Qe.lengthSq()===0&&(Qe.z=1),Qe.normalize(),ni.crossVectors(n,Qe),ni.lengthSq()===0&&(Math.abs(n.z)===1?Qe.x+=1e-4:Qe.z+=1e-4,Qe.normalize(),ni.crossVectors(n,Qe)),ni.normalize(),vr.crossVectors(Qe,ni),i[0]=ni.x,i[4]=vr.x,i[8]=Qe.x,i[1]=ni.y,i[5]=vr.y,i[9]=Qe.y,i[2]=ni.z,i[6]=vr.z,i[10]=Qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],p=n[2],v=n[6],m=n[10],g=n[14],w=n[3],E=n[7],M=n[11],S=n[15],b=i[0],R=i[4],x=i[8],T=i[12],L=i[1],D=i[5],F=i[9],Y=i[13],K=i[2],B=i[6],Z=i[10],X=i[14],j=i[3],it=i[7],pt=i[11],_t=i[15];return r[0]=a*b+o*L+l*K+c*j,r[4]=a*R+o*D+l*B+c*it,r[8]=a*x+o*F+l*Z+c*pt,r[12]=a*T+o*Y+l*X+c*_t,r[1]=u*b+h*L+d*K+f*j,r[5]=u*R+h*D+d*B+f*it,r[9]=u*x+h*F+d*Z+f*pt,r[13]=u*T+h*Y+d*X+f*_t,r[2]=p*b+v*L+m*K+g*j,r[6]=p*R+v*D+m*B+g*it,r[10]=p*x+v*F+m*Z+g*pt,r[14]=p*T+v*Y+m*X+g*_t,r[3]=w*b+E*L+M*K+S*j,r[7]=w*R+E*D+M*B+S*it,r[11]=w*x+E*F+M*Z+S*pt,r[15]=w*T+E*Y+M*X+S*_t,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],f=t[14],p=t[3],v=t[7],m=t[11],g=t[15],w=l*f-c*d,E=o*f-c*h,M=o*d-l*h,S=a*f-c*u,b=a*d-l*u,R=a*h-o*u;return e*(v*w-m*E+g*M)-n*(p*w-m*S+g*b)+i*(p*E-v*S+g*R)-r*(p*M-v*b+m*R)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],u=t[10];return e*(a*u-o*c)-n*(r*u-o*l)+i*(r*c-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],f=t[11],p=t[12],v=t[13],m=t[14],g=t[15],w=e*o-n*a,E=e*l-i*a,M=e*c-r*a,S=n*l-i*o,b=n*c-r*o,R=i*c-r*l,x=u*v-h*p,T=u*m-d*p,L=u*g-f*p,D=h*m-d*v,F=h*g-f*v,Y=d*g-f*m,K=w*Y-E*F+M*D+S*L-b*T+R*x;if(K===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/K;return t[0]=(o*Y-l*F+c*D)*B,t[1]=(i*F-n*Y-r*D)*B,t[2]=(v*R-m*b+g*S)*B,t[3]=(d*b-h*R-f*S)*B,t[4]=(l*L-a*Y-c*T)*B,t[5]=(e*Y-i*L+r*T)*B,t[6]=(m*M-p*R-g*E)*B,t[7]=(u*R-d*M+f*E)*B,t[8]=(a*F-o*L+c*x)*B,t[9]=(n*L-e*F-r*x)*B,t[10]=(p*b-v*M+g*w)*B,t[11]=(h*M-u*b-f*w)*B,t[12]=(o*T-a*D-l*x)*B,t[13]=(e*D-n*T+i*x)*B,t[14]=(v*E-p*S-m*w)*B,t[15]=(u*S-h*E+d*w)*B,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,u*o+n,u*l-i*a,0,c*l-i*o,u*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,a){return this.set(1,n,r,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,u=a+a,h=o+o,d=r*c,f=r*u,p=r*h,v=a*u,m=a*h,g=o*h,w=l*c,E=l*u,M=l*h,S=n.x,b=n.y,R=n.z;return i[0]=(1-(v+g))*S,i[1]=(f+M)*S,i[2]=(p-E)*S,i[3]=0,i[4]=(f-M)*b,i[5]=(1-(d+g))*b,i[6]=(m+w)*b,i[7]=0,i[8]=(p+E)*R,i[9]=(m-w)*R,i[10]=(1-(d+v))*R,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=ji.set(i[0],i[1],i[2]).length();const o=ji.set(i[4],i[5],i[6]).length(),l=ji.set(i[8],i[9],i[10]).length();r<0&&(a=-a),fn.copy(this);const c=1/a,u=1/o,h=1/l;return fn.elements[0]*=c,fn.elements[1]*=c,fn.elements[2]*=c,fn.elements[4]*=u,fn.elements[5]*=u,fn.elements[6]*=u,fn.elements[8]*=h,fn.elements[9]*=h,fn.elements[10]*=h,e.setFromRotationMatrix(fn),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,i,r,a,o=An,l=!1){const c=this.elements,u=2*r/(e-t),h=2*r/(n-i),d=(e+t)/(e-t),f=(n+i)/(n-i);let p,v;if(l)p=r/(a-r),v=a*r/(a-r);else if(o===An)p=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Ls)p=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,a,o=An,l=!1){const c=this.elements,u=2/(e-t),h=2/(n-i),d=-(e+t)/(e-t),f=-(n+i)/(n-i);let p,v;if(l)p=1/(a-r),v=a/(a-r);else if(o===An)p=-2/(a-r),v=-(a+r)/(a-r);else if(o===Ls)p=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};sa.prototype.isMatrix4=!0;let ie=sa;const ji=new C,fn=new ie,Mf=new C(0,0,0),yf=new C(1,1,1),ni=new C,vr=new C,Qe=new C,wc=new ie,Ec=new Cn;class zn{constructor(t=0,e=0,n=0,i=zn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],u=i[9],h=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Wt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Wt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Wt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Wt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Wt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:It("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return wc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(wc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ec.setFromEuler(this),this.setFromQuaternion(Ec,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}zn.DEFAULT_ORDER="XYZ";class Lo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Sf=0;const Tc=new C,ts=new Cn,Hn=new ie,Mr=new C,Ns=new C,bf=new C,wf=new Cn,Ac=new C(1,0,0),Cc=new C(0,1,0),Rc=new C(0,0,1),Pc={type:"added"},Ef={type:"removed"},es={type:"childadded",child:null},Do={type:"childremoved",child:null};class be extends ei{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Sf++}),this.uuid=Ki(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=be.DEFAULT_UP.clone();const t=new C,e=new zn,n=new Cn,i=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ie},normalMatrix:{value:new zt}}),this.matrix=new ie,this.matrixWorld=new ie,this.matrixAutoUpdate=be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Lo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ts.setFromAxisAngle(t,e),this.quaternion.multiply(ts),this}rotateOnWorldAxis(t,e){return ts.setFromAxisAngle(t,e),this.quaternion.premultiply(ts),this}rotateX(t){return this.rotateOnAxis(Ac,t)}rotateY(t){return this.rotateOnAxis(Cc,t)}rotateZ(t){return this.rotateOnAxis(Rc,t)}translateOnAxis(t,e){return Tc.copy(t).applyQuaternion(this.quaternion),this.position.add(Tc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ac,t)}translateY(t){return this.translateOnAxis(Cc,t)}translateZ(t){return this.translateOnAxis(Rc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Hn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Mr.copy(t):Mr.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Ns.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hn.lookAt(Ns,Mr,this.up):Hn.lookAt(Mr,Ns,this.up),this.quaternion.setFromRotationMatrix(Hn),i&&(Hn.extractRotation(i.matrixWorld),ts.setFromRotationMatrix(Hn),this.quaternion.premultiply(ts.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Zt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Pc),es.child=t,this.dispatchEvent(es),es.child=null):Zt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ef),Do.child=t,this.dispatchEvent(Do),Do.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Hn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Hn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Hn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Pc),es.child=t,this.dispatchEvent(es),es.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ns,t,bf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ns,wf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(t.shapes,h)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));i.material=o}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),u=a(t.images),h=a(t.shapes),d=a(t.skeletons),f=a(t.animations),p=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}be.DEFAULT_UP=new C(0,1,0),be.DEFAULT_MATRIX_AUTO_UPDATE=!0,be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class pn extends be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Tf={type:"move"};class Io{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new pn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new pn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new pn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),g=this._getHandJoint(c,v);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Tf)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new pn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Lc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ii={h:0,s:0,l:0},yr={h:0,s:0,l:0};function No(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Ot{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Se){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Kt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=Kt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Kt.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=Kt.workingColorSpace){if(t=Eo(t,1),e=Wt(e,0,1),n=Wt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=No(a,r,t+1/3),this.g=No(a,r,t),this.b=No(a,r,t-1/3)}return Kt.colorSpaceToWorking(this,i),this}setStyle(t,e=Se){function n(r){r!==void 0&&parseFloat(r)<1&&It("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:It("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);It("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Se){const n=Lc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):It("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Bn(t.r),this.g=Bn(t.g),this.b=Bn(t.b),this}copyLinearToSRGB(t){return this.r=Ji(t.r),this.g=Ji(t.g),this.b=Ji(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Se){return Kt.workingToColorSpace(ke.copy(this),t),Math.round(Wt(ke.r*255,0,255))*65536+Math.round(Wt(ke.g*255,0,255))*256+Math.round(Wt(ke.b*255,0,255))}getHexString(t=Se){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Kt.workingColorSpace){Kt.workingToColorSpace(ke.copy(this),e);const n=ke.r,i=ke.g,r=ke.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case n:l=(i-r)/h+(i<r?6:0);break;case i:l=(r-n)/h+2;break;case r:l=(n-i)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=Kt.workingColorSpace){return Kt.workingToColorSpace(ke.copy(this),e),t.r=ke.r,t.g=ke.g,t.b=ke.b,t}getStyle(t=Se){Kt.workingToColorSpace(ke.copy(this),t);const e=ke.r,n=ke.g,i=ke.b;return t!==Se?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(ii),this.setHSL(ii.h+t,ii.s+e,ii.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ii),t.getHSL(yr);const n=Is(ii.h,yr.h,e),i=Is(ii.s,yr.s,e),r=Is(ii.l,yr.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ke=new Ot;Ot.NAMES=Lc;class Uo{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ot(t),this.density=e}clone(){return new Uo(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Af extends be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new zn,this.environmentIntensity=1,this.environmentRotation=new zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const mn=new C,Gn=new C,Fo=new C,Vn=new C,ns=new C,is=new C,Dc=new C,Oo=new C,ko=new C,Bo=new C,zo=new pe,Ho=new pe,Go=new pe;class gn{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),mn.subVectors(t,e),i.cross(mn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){mn.subVectors(i,e),Gn.subVectors(n,e),Fo.subVectors(t,e);const a=mn.dot(mn),o=mn.dot(Gn),l=mn.dot(Fo),c=Gn.dot(Gn),u=Gn.dot(Fo),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(c*l-o*u)*d,p=(a*u-o*l)*d;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Vn)===null?!1:Vn.x>=0&&Vn.y>=0&&Vn.x+Vn.y<=1}static getInterpolation(t,e,n,i,r,a,o,l){return this.getBarycoord(t,e,n,i,Vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Vn.x),l.addScaledVector(a,Vn.y),l.addScaledVector(o,Vn.z),l)}static getInterpolatedAttribute(t,e,n,i,r,a){return zo.setScalar(0),Ho.setScalar(0),Go.setScalar(0),zo.fromBufferAttribute(t,e),Ho.fromBufferAttribute(t,n),Go.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(zo,r.x),a.addScaledVector(Ho,r.y),a.addScaledVector(Go,r.z),a}static isFrontFacing(t,e,n,i){return mn.subVectors(n,e),Gn.subVectors(t,e),mn.cross(Gn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return mn.subVectors(this.c,this.b),Gn.subVectors(this.a,this.b),mn.cross(Gn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return gn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return gn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return gn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return gn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return gn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let a,o;ns.subVectors(i,n),is.subVectors(r,n),Oo.subVectors(t,n);const l=ns.dot(Oo),c=is.dot(Oo);if(l<=0&&c<=0)return e.copy(n);ko.subVectors(t,i);const u=ns.dot(ko),h=is.dot(ko);if(u>=0&&h<=u)return e.copy(i);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),e.copy(n).addScaledVector(ns,a);Bo.subVectors(t,r);const f=ns.dot(Bo),p=is.dot(Bo);if(p>=0&&f<=p)return e.copy(r);const v=f*c-l*p;if(v<=0&&c>=0&&p<=0)return o=c/(c-p),e.copy(n).addScaledVector(is,o);const m=u*p-f*h;if(m<=0&&h-u>=0&&f-p>=0)return Dc.subVectors(r,i),o=(h-u)/(h-u+(f-p)),e.copy(i).addScaledVector(Dc,o);const g=1/(m+v+d);return a=v*g,o=d*g,e.copy(n).addScaledVector(ns,a).addScaledVector(is,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Ri{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(_n.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(_n.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=_n.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,_n):_n.fromBufferAttribute(r,a),_n.applyMatrix4(t.matrixWorld),this.expandByPoint(_n);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Sr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Sr.copy(n.boundingBox)),Sr.applyMatrix4(t.matrixWorld),this.union(Sr)}const i=t.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,_n),_n.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Us),br.subVectors(this.max,Us),ss.subVectors(t.a,Us),rs.subVectors(t.b,Us),as.subVectors(t.c,Us),si.subVectors(rs,ss),ri.subVectors(as,rs),Pi.subVectors(ss,as);let e=[0,-si.z,si.y,0,-ri.z,ri.y,0,-Pi.z,Pi.y,si.z,0,-si.x,ri.z,0,-ri.x,Pi.z,0,-Pi.x,-si.y,si.x,0,-ri.y,ri.x,0,-Pi.y,Pi.x,0];return!Vo(e,ss,rs,as,br)||(e=[1,0,0,0,1,0,0,0,1],!Vo(e,ss,rs,as,br))?!1:(wr.crossVectors(si,ri),e=[wr.x,wr.y,wr.z],Vo(e,ss,rs,as,br))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,_n).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(_n).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Wn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Wn=[new C,new C,new C,new C,new C,new C,new C,new C],_n=new C,Sr=new Ri,ss=new C,rs=new C,as=new C,si=new C,ri=new C,Pi=new C,Us=new C,br=new C,wr=new C,Li=new C;function Vo(s,t,e,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Li.fromArray(s,r);const o=i.x*Math.abs(Li.x)+i.y*Math.abs(Li.y)+i.z*Math.abs(Li.z),l=t.dot(Li),c=e.dot(Li),u=n.dot(Li);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const we=new C,Er=new lt;let Cf=0;class rn extends ei{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Cf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=pc,this.updateRanges=[],this.gpuType=un,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Er.fromBufferAttribute(this,e),Er.applyMatrix3(t),this.setXY(e,Er.x,Er.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix3(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix4(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyNormalMatrix(t),this.setXYZ(e,we.x,we.y,we.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.transformDirection(t),this.setXYZ(e,we.x,we.y,we.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Zi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ve(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Zi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Zi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Zi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Zi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),i=Ve(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),i=Ve(i,this.array),r=Ve(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==pc&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class Ic extends rn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Nc extends rn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class xe extends rn{constructor(t,e,n){super(new Float32Array(t),e,n)}}const Rf=new Ri,Fs=new C,Wo=new C;class os{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Rf.setFromPoints(t).getCenter(n);let i=0;for(let r=0,a=t.length;r<a;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Fs.subVectors(t,this.center);const e=Fs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Fs,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Wo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Fs.copy(t.center).add(Wo)),this.expandByPoint(Fs.copy(t.center).sub(Wo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let Pf=0;const an=new ie,$o=new be,ls=new C,je=new Ri,Os=new Ri,Le=new C;class Be extends ei{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Pf++}),this.uuid=Ki(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(qd(t)?Nc:Ic)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new zt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return an.makeRotationFromQuaternion(t),this.applyMatrix4(an),this}rotateX(t){return an.makeRotationX(t),this.applyMatrix4(an),this}rotateY(t){return an.makeRotationY(t),this.applyMatrix4(an),this}rotateZ(t){return an.makeRotationZ(t),this.applyMatrix4(an),this}translate(t,e,n){return an.makeTranslation(t,e,n),this.applyMatrix4(an),this}scale(t,e,n){return an.makeScale(t,e,n),this.applyMatrix4(an),this}lookAt(t){return $o.lookAt(t),$o.updateMatrix(),this.applyMatrix4($o.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ls).negate(),this.translate(ls.x,ls.y,ls.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new xe(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&It("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ri);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Zt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];je.setFromBufferAttribute(r),this.morphTargetsRelative?(Le.addVectors(this.boundingBox.min,je.min),this.boundingBox.expandByPoint(Le),Le.addVectors(this.boundingBox.max,je.max),this.boundingBox.expandByPoint(Le)):(this.boundingBox.expandByPoint(je.min),this.boundingBox.expandByPoint(je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Zt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new os);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Zt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(je.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Os.setFromBufferAttribute(o),this.morphTargetsRelative?(Le.addVectors(je.min,Os.min),je.expandByPoint(Le),Le.addVectors(je.max,Os.max),je.expandByPoint(Le)):(je.expandByPoint(Os.min),je.expandByPoint(Os.max))}je.getCenter(n);let i=0;for(let r=0,a=t.count;r<a;r++)Le.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Le));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Le.fromBufferAttribute(o,c),l&&(ls.fromBufferAttribute(t,c),Le.add(ls)),i=Math.max(i,n.distanceToSquared(Le))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Zt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Zt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new rn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new C,l[x]=new C;const c=new C,u=new C,h=new C,d=new lt,f=new lt,p=new lt,v=new C,m=new C;function g(x,T,L){c.fromBufferAttribute(n,x),u.fromBufferAttribute(n,T),h.fromBufferAttribute(n,L),d.fromBufferAttribute(r,x),f.fromBufferAttribute(r,T),p.fromBufferAttribute(r,L),u.sub(c),h.sub(c),f.sub(d),p.sub(d);const D=1/(f.x*p.y-p.x*f.y);isFinite(D)&&(v.copy(u).multiplyScalar(p.y).addScaledVector(h,-f.y).multiplyScalar(D),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(D),o[x].add(v),o[T].add(v),o[L].add(v),l[x].add(m),l[T].add(m),l[L].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let x=0,T=w.length;x<T;++x){const L=w[x],D=L.start,F=L.count;for(let Y=D,K=D+F;Y<K;Y+=3)g(t.getX(Y+0),t.getX(Y+1),t.getX(Y+2))}const E=new C,M=new C,S=new C,b=new C;function R(x){S.fromBufferAttribute(i,x),b.copy(S);const T=o[x];E.copy(T),E.sub(S.multiplyScalar(S.dot(T))).normalize(),M.crossVectors(b,T);const D=M.dot(l[x])<0?-1:1;a.setXYZW(x,E.x,E.y,E.z,D)}for(let x=0,T=w.length;x<T;++x){const L=w[x],D=L.start,F=L.count;for(let Y=D,K=D+F;Y<K;Y+=3)R(t.getX(Y+0)),R(t.getX(Y+1)),R(t.getX(Y+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new rn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new C,r=new C,a=new C,o=new C,l=new C,c=new C,u=new C,h=new C;if(t)for(let d=0,f=t.count;d<f;d+=3){const p=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,p),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),u.subVectors(a,r),h.subVectors(i,r),u.cross(h),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),o.add(u),l.add(u),c.add(u),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),u.subVectors(a,r),h.subVectors(i,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Le.fromBufferAttribute(t,e),Le.normalize(),t.setXYZ(e,Le.x,Le.y,Le.z)}toNonIndexed(){function t(o,l){const c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u);let f=0,p=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*u;for(let g=0;g<u;g++)d[p++]=c[f++]}return new rn(d,u,h)}if(this.index===null)return It("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Be,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=t(d,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(t.data))}u.length>0&&(i[l]=u,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const i=t.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(e))}const r=t.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let Lf=0;class cs extends ei{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Lf++}),this.uuid=Ki(),this.name="",this.type="Material",this.blending=Vi,this.side=jn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=va,this.blendDst=Ma,this.blendEquation=wi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ot(0,0,0),this.blendAlpha=0,this.depthFunc=Wi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xi,this.stencilZFail=Xi,this.stencilZPass=Xi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){It(`Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){It(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Vi&&(n.blending=this.blending),this.side!==jn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==va&&(n.blendSrc=this.blendSrc),this.blendDst!==Ma&&(n.blendDst=this.blendDst),this.blendEquation!==wi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Wi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==fc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Xi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Xi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=i(t.textures),a=i(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Ot().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new lt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new lt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const $n=new C,Xo=new C,Tr=new C,ai=new C,qo=new C,Ar=new C,Yo=new C;class Cr{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,$n)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=$n.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):($n.copy(this.origin).addScaledVector(this.direction,e),$n.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Xo.copy(t).add(e).multiplyScalar(.5),Tr.copy(e).sub(t).normalize(),ai.copy(this.origin).sub(Xo);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Tr),o=ai.dot(this.direction),l=-ai.dot(Tr),c=ai.lengthSq(),u=Math.abs(1-a*a);let h,d,f,p;if(u>0)if(h=a*l-o,d=a*o-l,p=r*u,h>=0)if(d>=-p)if(d<=p){const v=1/u;h*=v,d*=v,f=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d<=-p?(h=Math.max(0,-(-a*r+o)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=p?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(a*r+o)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=a>0?-r:r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy(Xo).addScaledVector(Tr,d),f}intersectSphere(t,e){$n.subVectors(t.center,this.origin);const n=$n.dot(this.direction),i=$n.dot($n)-n*n,r=t.radius*t.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),u>=0?(r=(t.min.y-d.y)*u,a=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,a=(t.min.y-d.y)*u),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),h>=0?(o=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(o=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,$n)!==null}intersectTriangle(t,e,n,i,r){qo.subVectors(e,t),Ar.subVectors(n,t),Yo.crossVectors(qo,Ar);let a=this.direction.dot(Yo),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ai.subVectors(this.origin,t);const l=o*this.direction.dot(Ar.crossVectors(ai,Ar));if(l<0)return null;const c=o*this.direction.dot(qo.cross(ai));if(c<0||l+c>a)return null;const u=-o*ai.dot(Yo);return u<0?null:this.at(u/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class xn extends cs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=rc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Uc=new ie,Di=new Cr,Rr=new os,Fc=new C,Pr=new C,Lr=new C,Dr=new C,Ko=new C,Ir=new C,Oc=new C,Nr=new C;class kt extends be{constructor(t=new Be,e=new xn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const o=this.morphTargetInfluences;if(r&&o){Ir.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],h=r[l];u!==0&&(Ko.fromBufferAttribute(h,t),a?Ir.addScaledVector(Ko,u):Ir.addScaledVector(Ko.sub(e),u))}e.add(Ir)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Rr.copy(n.boundingSphere),Rr.applyMatrix4(r),Di.copy(t.ray).recast(t.near),!(Rr.containsPoint(Di.origin)===!1&&(Di.intersectSphere(Rr,Fc)===null||Di.origin.distanceToSquared(Fc)>(t.far-t.near)**2))&&(Uc.copy(r).invert(),Di.copy(t.ray).applyMatrix4(Uc),!(n.boundingBox!==null&&Di.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Di)))}_computeIntersections(t,e,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,v=d.length;p<v;p++){const m=d[p],g=a[m.materialIndex],w=Math.max(m.start,f.start),E=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let M=w,S=E;M<S;M+=3){const b=o.getX(M),R=o.getX(M+1),x=o.getX(M+2);i=Ur(this,g,t,n,c,u,h,b,R,x),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const p=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=p,g=v;m<g;m+=3){const w=o.getX(m),E=o.getX(m+1),M=o.getX(m+2);i=Ur(this,a,t,n,c,u,h,w,E,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,v=d.length;p<v;p++){const m=d[p],g=a[m.materialIndex],w=Math.max(m.start,f.start),E=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let M=w,S=E;M<S;M+=3){const b=M,R=M+1,x=M+2;i=Ur(this,g,t,n,c,u,h,b,R,x),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const p=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=p,g=v;m<g;m+=3){const w=m,E=m+1,M=m+2;i=Ur(this,a,t,n,c,u,h,w,E,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function Df(s,t,e,n,i,r,a,o){let l;if(t.side===Ge?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,t.side===jn,o),l===null)return null;Nr.copy(o),Nr.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Nr);return c<e.near||c>e.far?null:{distance:c,point:Nr.clone(),object:s}}function Ur(s,t,e,n,i,r,a,o,l,c){s.getVertexPosition(o,Pr),s.getVertexPosition(l,Lr),s.getVertexPosition(c,Dr);const u=Df(s,t,e,n,Pr,Lr,Dr,Oc);if(u){const h=new C;gn.getBarycoord(Oc,Pr,Lr,Dr,h),i&&(u.uv=gn.getInterpolatedAttribute(i,o,l,c,h,new lt)),r&&(u.uv1=gn.getInterpolatedAttribute(r,o,l,c,h,new lt)),a&&(u.normal=gn.getInterpolatedAttribute(a,o,l,c,h,new C),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new C,materialIndex:0};gn.getNormal(Pr,Lr,Dr,d.normal),u.face=d,u.barycoord=h}return u}class kc extends Oe{constructor(t=null,e=1,n=1,i,r,a,o,l,c=Ie,u=Ie,h,d){super(null,a,o,l,c,u,i,r,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ks extends rn{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const hs=new ie,Bc=new ie,Fr=[],zc=new Ri,If=new ie,Bs=new kt,zs=new os;class Hc extends kt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ks(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,If)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ri),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,hs),zc.copy(t.boundingBox).applyMatrix4(hs),this.boundingBox.union(zc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new os),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,hs),zs.copy(t.boundingSphere).applyMatrix4(hs),this.boundingSphere.union(zs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(t,e){const n=this.matrixWorld,i=this.count;if(Bs.geometry=this.geometry,Bs.material=this.material,Bs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),zs.copy(this.boundingSphere),zs.applyMatrix4(n),t.ray.intersectsSphere(zs)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,hs),Bc.multiplyMatrices(n,hs),Bs.matrixWorld=Bc,Bs.raycast(t,Fr);for(let a=0,o=Fr.length;a<o;a++){const l=Fr[a];l.instanceId=r,l.object=this,e.push(l)}Fr.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new ks(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new kc(new Float32Array(i*this.count),i,this.count,Ha,un));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*t;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Zo=new C,Nf=new C,Uf=new zt;class oi{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Zo.subVectors(n,e).cross(Nf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const i=t.delta(Zo),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Uf.getNormalMatrix(t),i=this.coplanarPoint(Zo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ii=new os,Ff=new lt(.5,.5),Or=new C;class kr{constructor(t=new oi,e=new oi,n=new oi,i=new oi,r=new oi,a=new oi){this.planes=[t,e,n,i,r,a]}set(t,e,n,i,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=An,n=!1){const i=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],f=r[7],p=r[8],v=r[9],m=r[10],g=r[11],w=r[12],E=r[13],M=r[14],S=r[15];if(i[0].setComponents(c-a,f-u,g-p,S-w).normalize(),i[1].setComponents(c+a,f+u,g+p,S+w).normalize(),i[2].setComponents(c+o,f+h,g+v,S+E).normalize(),i[3].setComponents(c-o,f-h,g-v,S-E).normalize(),n)i[4].setComponents(l,d,m,M).normalize(),i[5].setComponents(c-l,f-d,g-m,S-M).normalize();else if(i[4].setComponents(c-l,f-d,g-m,S-M).normalize(),e===An)i[5].setComponents(c+l,f+d,g+m,S+M).normalize();else if(e===Ls)i[5].setComponents(l,d,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ii.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ii.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ii)}intersectsSprite(t){Ii.center.set(0,0,0);const e=Ff.distanceTo(t.center);return Ii.radius=.7071067811865476+e,Ii.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ii)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Or.x=i.normal.x>0?t.max.x:t.min.x,Or.y=i.normal.y>0?t.max.y:t.min.y,Or.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Or)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Gc extends cs{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ot(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Br=new C,zr=new C,Vc=new ie,Hs=new Cr,Hr=new os,Jo=new C,Wc=new C;class $c extends be{constructor(t=new Be,e=new Gc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)Br.fromBufferAttribute(e,i-1),zr.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=Br.distanceTo(zr);t.setAttribute("lineDistance",new xe(n,1))}else It("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Hr.copy(n.boundingSphere),Hr.applyMatrix4(i),Hr.radius+=r,t.ray.intersectsSphere(Hr)===!1)return;Vc.copy(i).invert(),Hs.copy(t.ray).applyMatrix4(Vc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let v=f,m=p-1;v<m;v+=c){const g=u.getX(v),w=u.getX(v+1),E=Gr(this,t,Hs,l,g,w,v);E&&e.push(E)}if(this.isLineLoop){const v=u.getX(p-1),m=u.getX(f),g=Gr(this,t,Hs,l,v,m,p-1);g&&e.push(g)}}else{const f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let v=f,m=p-1;v<m;v+=c){const g=Gr(this,t,Hs,l,v,v+1,v);g&&e.push(g)}if(this.isLineLoop){const v=Gr(this,t,Hs,l,p-1,f,p-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Gr(s,t,e,n,i,r,a){const o=s.geometry.attributes.position;if(Br.fromBufferAttribute(o,i),zr.fromBufferAttribute(o,r),e.distanceSqToSegment(Br,zr,Jo,Wc)>n)return;Jo.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Jo);if(!(c<t.near||c>t.far))return{distance:c,point:Wc.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}class Xc extends Oe{constructor(t=[],e=Ei,n,i,r,a,o,l,c,u){super(t,e,n,i,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class li extends Oe{constructor(t,e,n,i,r,a,o,l,c){super(t,e,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class us extends Oe{constructor(t,e,n=Tn,i,r,a,o=Ie,l=Ie,c,u=kn,h=1){if(u!==kn&&u!==Ai)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:h};super(d,i,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Co(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Of extends us{constructor(t,e=Tn,n=Ei,i,r,a=Ie,o=Ie,l,c=kn){const u={width:t,height:t,depth:1},h=[u,u,u,u,u,u];super(t,t,e,n,i,r,a,o,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class qc extends Oe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class tn extends Be{constructor(t=1,e=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],h=[];let d=0,f=0;p("z","y","x",-1,-1,n,e,t,a,r,0),p("z","y","x",1,-1,n,e,-t,a,r,1),p("x","z","y",1,1,t,n,e,i,a,2),p("x","z","y",1,-1,t,n,-e,i,a,3),p("x","y","z",1,-1,t,e,n,i,r,4),p("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new xe(c,3)),this.setAttribute("normal",new xe(u,3)),this.setAttribute("uv",new xe(h,2));function p(v,m,g,w,E,M,S,b,R,x,T){const L=M/R,D=S/x,F=M/2,Y=S/2,K=b/2,B=R+1,Z=x+1;let X=0,j=0;const it=new C;for(let pt=0;pt<Z;pt++){const _t=pt*D-Y;for(let bt=0;bt<B;bt++){const Qt=bt*L-F;it[v]=Qt*w,it[m]=_t*E,it[g]=K,c.push(it.x,it.y,it.z),it[v]=0,it[m]=0,it[g]=b>0?1:-1,u.push(it.x,it.y,it.z),h.push(bt/R),h.push(1-pt/x),X+=1}}for(let pt=0;pt<x;pt++)for(let _t=0;_t<R;_t++){const bt=d+_t+B*pt,Qt=d+_t+B*(pt+1),fe=d+(_t+1)+B*(pt+1),Jt=d+(_t+1)+B*pt;l.push(bt,Qt,Jt),l.push(Qt,fe,Jt),j+=6}o.addGroup(f,j,T),f+=j,d+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new tn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class ci extends Be{constructor(t=1,e=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const u=[],h=[],d=[],f=[];let p=0;const v=[],m=n/2;let g=0;w(),a===!1&&(t>0&&E(!0),e>0&&E(!1)),this.setIndex(u),this.setAttribute("position",new xe(h,3)),this.setAttribute("normal",new xe(d,3)),this.setAttribute("uv",new xe(f,2));function w(){const M=new C,S=new C;let b=0;const R=(e-t)/n;for(let x=0;x<=r;x++){const T=[],L=x/r,D=L*(e-t)+t;for(let F=0;F<=i;F++){const Y=F/i,K=Y*l+o,B=Math.sin(K),Z=Math.cos(K);S.x=D*B,S.y=-L*n+m,S.z=D*Z,h.push(S.x,S.y,S.z),M.set(B,R,Z).normalize(),d.push(M.x,M.y,M.z),f.push(Y,1-L),T.push(p++)}v.push(T)}for(let x=0;x<i;x++)for(let T=0;T<r;T++){const L=v[T][x],D=v[T+1][x],F=v[T+1][x+1],Y=v[T][x+1];(t>0||T!==0)&&(u.push(L,D,Y),b+=3),(e>0||T!==r-1)&&(u.push(D,F,Y),b+=3)}c.addGroup(g,b,0),g+=b}function E(M){const S=p,b=new lt,R=new C;let x=0;const T=M===!0?t:e,L=M===!0?1:-1;for(let F=1;F<=i;F++)h.push(0,m*L,0),d.push(0,L,0),f.push(.5,.5),p++;const D=p;for(let F=0;F<=i;F++){const K=F/i*l+o,B=Math.cos(K),Z=Math.sin(K);R.x=T*Z,R.y=m*L,R.z=T*B,h.push(R.x,R.y,R.z),d.push(0,L,0),b.x=B*.5+.5,b.y=Z*.5*L+.5,f.push(b.x,b.y),p++}for(let F=0;F<i;F++){const Y=S+F,K=D+F;M===!0?u.push(K,K+1,Y):u.push(K+1,K,Y),x+=3}c.addGroup(g,x,M===!0?1:2),g+=x}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ci(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Xn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){It("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let i=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const u=n[i],d=n[i+1]-u,f=(a-u)/d;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=e||(a.isVector2?new lt:new C);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new C,i=[],r=[],a=[],o=new C,l=new ie;for(let f=0;f<=t;f++){const p=f/t;i[f]=this.getTangentAt(p,new C)}r[0]=new C,a[0]=new C;let c=Number.MAX_VALUE;const u=Math.abs(i[0].x),h=Math.abs(i[0].y),d=Math.abs(i[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(Wt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,p))}a[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(Wt(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(i[p],f*p)),a[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Yc extends Xn{constructor(t=0,e=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new lt){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class kf extends Yc{constructor(t,e,n,i,r,a){super(t,e,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Qo(){let s=0,t=0,e=0,n=0;function i(r,a,o,l){s=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,h){let d=(a-r)/c-(o-r)/(c+u)+(o-a)/u,f=(o-a)/u-(l-a)/(u+h)+(l-o)/h;d*=u,f*=u,i(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return s+t*r+e*a+n*o}}}const Kc=new C,Zc=new C,jo=new Qo,tl=new Qo,el=new Qo;class Jc extends Xn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new C){const n=e,i=this.points,r=i.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=i[(o-1)%r]:(Zc.subVectors(i[0],i[1]).add(i[0]),c=Zc);const h=i[o%r],d=i[(o+1)%r];if(this.closed||o+2<r?u=i[(o+2)%r]:(Kc.subVectors(i[r-1],i[r-2]).add(i[r-1]),u=Kc),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(h),f),v=Math.pow(h.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f);v<1e-4&&(v=1),p<1e-4&&(p=v),m<1e-4&&(m=v),jo.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,p,v,m),tl.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,p,v,m),el.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,p,v,m)}else this.curveType==="catmullrom"&&(jo.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),tl.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),el.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(jo.calc(l),tl.calc(l),el.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new C().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Qc(s,t,e,n,i){const r=(n-t)*.5,a=(i-e)*.5,o=s*s,l=s*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*s+e}function Bf(s,t){const e=1-s;return e*e*t}function zf(s,t){return 2*(1-s)*s*t}function Hf(s,t){return s*s*t}function Gs(s,t,e,n){return Bf(s,t)+zf(s,e)+Hf(s,n)}function Gf(s,t){const e=1-s;return e*e*e*t}function Vf(s,t){const e=1-s;return 3*e*e*s*t}function Wf(s,t){return 3*(1-s)*s*s*t}function $f(s,t){return s*s*s*t}function Vs(s,t,e,n,i){return Gf(s,t)+Vf(s,e)+Wf(s,n)+$f(s,i)}class Xf extends Xn{constructor(t=new lt,e=new lt,n=new lt,i=new lt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new lt){const n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Vs(t,i.x,r.x,a.x,o.x),Vs(t,i.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class qf extends Xn{constructor(t=new C,e=new C,n=new C,i=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new C){const n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Vs(t,i.x,r.x,a.x,o.x),Vs(t,i.y,r.y,a.y,o.y),Vs(t,i.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Yf extends Xn{constructor(t=new lt,e=new lt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new lt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new lt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Kf extends Xn{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Zf extends Xn{constructor(t=new lt,e=new lt,n=new lt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new lt){const n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Gs(t,i.x,r.x,a.x),Gs(t,i.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class jc extends Xn{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Gs(t,i.x,r.x,a.x),Gs(t,i.y,r.y,a.y),Gs(t,i.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Jf extends Xn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new lt){const n=e,i=this.points,r=(i.length-1)*t,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],u=i[a>i.length-2?i.length-1:a+1],h=i[a>i.length-3?i.length-1:a+2];return n.set(Qc(o,l.x,c.x,u.x,h.x),Qc(o,l.y,c.y,u.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new lt().fromArray(i))}return this}}var Qf=Object.freeze({__proto__:null,ArcCurve:kf,CatmullRomCurve3:Jc,CubicBezierCurve:Xf,CubicBezierCurve3:qf,EllipseCurve:Yc,LineCurve:Yf,LineCurve3:Kf,QuadraticBezierCurve:Zf,QuadraticBezierCurve3:jc,SplineCurve:Jf});class We extends Be{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(i),c=o+1,u=l+1,h=t/o,d=e/l,f=[],p=[],v=[],m=[];for(let g=0;g<u;g++){const w=g*d-a;for(let E=0;E<c;E++){const M=E*h-r;p.push(M,-w,0),v.push(0,0,1),m.push(E/o),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let w=0;w<o;w++){const E=w+c*g,M=w+c*(g+1),S=w+1+c*(g+1),b=w+1+c*g;f.push(E,M,b),f.push(M,S,b)}this.setIndex(f),this.setAttribute("position",new xe(p,3)),this.setAttribute("normal",new xe(v,3)),this.setAttribute("uv",new xe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new We(t.width,t.height,t.widthSegments,t.heightSegments)}}class Ws extends Be{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],h=new C,d=new C,f=[],p=[],v=[],m=[];for(let g=0;g<=n;g++){const w=[],E=g/n,M=a+E*o,S=t*Math.cos(M),b=Math.sqrt(t*t-S*S);let R=0;g===0&&a===0?R=.5/e:g===n&&l===Math.PI&&(R=-.5/e);for(let x=0;x<=e;x++){const T=x/e,L=i+T*r;h.x=-b*Math.cos(L),h.y=S,h.z=b*Math.sin(L),p.push(h.x,h.y,h.z),d.copy(h).normalize(),v.push(d.x,d.y,d.z),m.push(T+R,1-E),w.push(c++)}u.push(w)}for(let g=0;g<n;g++)for(let w=0;w<e;w++){const E=u[g][w+1],M=u[g][w],S=u[g+1][w],b=u[g+1][w+1];(g!==0||a>0)&&f.push(E,M,b),(g!==n-1||l<Math.PI)&&f.push(M,S,b)}this.setIndex(f),this.setAttribute("position",new xe(p,3)),this.setAttribute("normal",new xe(v,3)),this.setAttribute("uv",new xe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ws(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class nl extends Be{constructor(t=new jc(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),e=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:i,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new C,l=new C,c=new lt;let u=new C;const h=[],d=[],f=[],p=[];v(),this.setIndex(p),this.setAttribute("position",new xe(h,3)),this.setAttribute("normal",new xe(d,3)),this.setAttribute("uv",new xe(f,2));function v(){for(let E=0;E<e;E++)m(E);m(r===!1?e:0),w(),g()}function m(E){u=t.getPointAt(E/e,u);const M=a.normals[E],S=a.binormals[E];for(let b=0;b<=i;b++){const R=b/i*Math.PI*2,x=Math.sin(R),T=-Math.cos(R);l.x=T*M.x+x*S.x,l.y=T*M.y+x*S.y,l.z=T*M.z+x*S.z,l.normalize(),d.push(l.x,l.y,l.z),o.x=u.x+n*l.x,o.y=u.y+n*l.y,o.z=u.z+n*l.z,h.push(o.x,o.y,o.z)}}function g(){for(let E=1;E<=e;E++)for(let M=1;M<=i;M++){const S=(i+1)*(E-1)+(M-1),b=(i+1)*E+(M-1),R=(i+1)*E+M,x=(i+1)*(E-1)+M;p.push(S,b,x),p.push(b,R,x)}}function w(){for(let E=0;E<=e;E++)for(let M=0;M<=i;M++)c.x=E/e,c.y=M/i,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new nl(new Qf[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}function ds(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];if(th(i))i.isRenderTargetTexture?(It("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(th(i[0])){const r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function $e(s){const t={};for(let e=0;e<s.length;e++){const n=ds(s[e]);for(const i in n)t[i]=n[i]}return t}function th(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function jf(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function eh(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Kt.workingColorSpace}const $s={clone:ds,merge:$e};var tp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ep=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ae extends cs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=tp,this.fragmentShader=ep,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ds(t.uniforms),this.uniformsGroups=jf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new Ot().setHex(i.value);break;case"v2":this.uniforms[n].value=new lt().fromArray(i.value);break;case"v3":this.uniforms[n].value=new C().fromArray(i.value);break;case"v4":this.uniforms[n].value=new pe().fromArray(i.value);break;case"m3":this.uniforms[n].value=new zt().fromArray(i.value);break;case"m4":this.uniforms[n].value=new ie().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class nh extends Ae{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ee extends cs{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ot(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ot(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=So,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class np extends cs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Bd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class ip extends cs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Vr extends be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ot(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class sp extends Vr{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ot(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const il=new ie,ih=new C,sh=new C;class sl{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new lt(512,512),this.mapType=Ze,this.map=null,this.mapPass=null,this.matrix=new ie,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new kr,this._frameExtents=new lt(1,1),this._viewportCount=1,this._viewports=[new pe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;ih.setFromMatrixPosition(t.matrixWorld),e.position.copy(ih),sh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(sh),e.updateMatrixWorld(),il.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(il,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===Ls||e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(il)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Wr=new C,$r=new Cn,Rn=new C;class rh extends be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ie,this.projectionMatrix=new ie,this.projectionMatrixInverse=new ie,this.coordinateSystem=An,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Wr,$r,Rn),Rn.x===1&&Rn.y===1&&Rn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Wr,$r,Rn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Wr,$r,Rn),Rn.x===1&&Rn.y===1&&Rn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Wr,$r,Rn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const hi=new C,ah=new lt,oh=new lt;class qe extends rh{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Yi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ds*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Yi*2*Math.atan(Math.tan(Ds*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){hi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(hi.x,hi.y).multiplyScalar(-t/hi.z),hi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(hi.x,hi.y).multiplyScalar(-t/hi.z)}getViewSize(t,e){return this.getViewBounds(t,ah,oh),e.subVectors(oh,ah)}setViewOffset(t,e,n,i,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ds*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,e-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class rp extends sl{constructor(){super(new qe(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=Yi*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||i!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=i,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class ap extends Vr{constructor(t,e,n=0,i=Math.PI/3,r=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new rp}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}}class op extends sl{constructor(){super(new qe(90,1,.5,500)),this.isPointLightShadow=!0}}class rl extends Vr{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new op}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class Xr extends rh{constructor(t=-1,e=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class lp extends sl{constructor(){super(new Xr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class cp extends Vr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.shadow=new lp}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}const fs=-90,ps=1;class hp extends be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new qe(fs,ps,t,e);i.layers=this.layers,this.add(i);const r=new qe(fs,ps,t,e);r.layers=this.layers,this.add(r);const a=new qe(fs,ps,t,e);a.layers=this.layers,this.add(a);const o=new qe(fs,ps,t,e);o.layers=this.layers,this.add(o);const l=new qe(fs,ps,t,e);l.layers=this.layers,this.add(l);const c=new qe(fs,ps,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===An)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ls)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,u),t.setRenderTarget(h,d,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class up extends qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class dp{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=fp.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function fp(){this._document.hidden===!1&&this.reset()}const lh=new ie;class pp{constructor(t,e,n=0,i=1/0){this.ray=new Cr(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new Lo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Zt("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return lh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(lh),this}intersectObject(t,e=!0,n=[]){return al(t,this,n,e),n.sort(ch),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)al(t[i],this,n,e);return n.sort(ch),n}}function ch(s,t){return s.distance-t.distance}function al(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)al(r[a],t,e,!0)}}class mp{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,It("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}class ol{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Wt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Wt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const zl=class zl{constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){const r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=i,this}};zl.prototype.isMatrix2=!0;let hh=zl;class gp extends ei{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){It("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function uh(s,t,e,n){const i=_p(n);switch(e){case uc:return s*t;case Ha:return s*t/i.components*i.byteLength;case Ga:return s*t/i.components*i.byteLength;case Ci:return s*t*2/i.components*i.byteLength;case Va:return s*t*2/i.components*i.byteLength;case dc:return s*t*3/i.components*i.byteLength;case dn:return s*t*4/i.components*i.byteLength;case Wa:return s*t*4/i.components*i.byteLength;case hr:case ur:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case dr:case fr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Xa:case Ya:return Math.max(s,16)*Math.max(t,8)/4;case $a:case qa:return Math.max(s,8)*Math.max(t,8)/2;case Ka:case Za:case Qa:case ja:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Ja:case pr:case to:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case eo:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case no:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case io:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case so:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case ro:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case ao:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case oo:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case lo:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case co:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case ho:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case uo:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case fo:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case po:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case mo:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case go:case _o:case xo:return Math.ceil(s/4)*Math.ceil(t/4)*16;case vo:case Mo:return Math.ceil(s/4)*Math.ceil(t/4)*8;case mr:case yo:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function _p(s){switch(s){case Ze:case oc:return{byteLength:1,components:1};case Cs:case lc:case Je:return{byteLength:2,components:1};case Ba:case za:return{byteLength:2,components:4};case Tn:case ka:case un:return{byteLength:4,components:1};case cc:case hc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:xa}})),typeof window<"u"&&(window.__THREE__?It("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=xa);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function dh(){let s=null,t=!1,e=null,n=null;function i(r,a){e(r,a),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function xp(s){const t=new WeakMap;function e(o,l){const c=o.array,u=o.usage,h=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){const u=l.array,h=l.updateRanges;if(s.bindBuffer(c,o),h.length===0)s.bufferSubData(c,0,u);else{h.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<h.length;f++){const p=h[d],v=h[f];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++d,h[d]=v)}h.length=d+1;for(let f=0,p=h.length;f<p;f++){const v=h[f];s.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var vp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mp=`#ifdef USE_ALPHAHASH
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
#endif`,yp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Sp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,wp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ep=`#ifdef USE_AOMAP
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
#endif`,Tp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ap=`#ifdef USE_BATCHING
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
#endif`,Cp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Rp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Pp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Lp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Dp=`#ifdef USE_IRIDESCENCE
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
#endif`,Ip=`#ifdef USE_BUMPMAP
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
#endif`,Np=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Up=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Fp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Op=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,kp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Bp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,zp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Hp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Gp=`#define PI 3.141592653589793
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
} // validated`,Vp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Wp=`vec3 transformedNormal = objectNormal;
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
#endif`,$p=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Xp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Yp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Kp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Jp=`#ifdef USE_ENVMAP
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
#endif`,Qp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,jp=`#ifdef USE_ENVMAP
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
#endif`,tm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,em=`#ifdef USE_ENVMAP
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
#endif`,nm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,im=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,sm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,rm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,am=`#ifdef USE_GRADIENTMAP
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
}`,om=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,cm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,hm=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,um=`#ifdef USE_ENVMAP
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
#endif`,dm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,pm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,mm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,gm=`PhysicalMaterial material;
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
#endif`,_m=`uniform sampler2D dfgLUT;
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
}`,xm=`
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
#endif`,vm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Mm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ym=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Sm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Em=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Tm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Am=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Cm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Rm=`#if defined( USE_POINTS_UV )
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
#endif`,Pm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Lm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Dm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Im=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Nm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Um=`#ifdef USE_MORPHTARGETS
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
#endif`,Fm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Om=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,km=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Bm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Gm=`#ifdef USE_NORMALMAP
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
#endif`,Vm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Wm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,$m=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Xm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ym=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Km=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Zm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Jm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Qm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,jm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,eg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ng=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ig=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,sg=`float getShadowMask() {
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
}`,rg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ag=`#ifdef USE_SKINNING
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
#endif`,og=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lg=`#ifdef USE_SKINNING
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
#endif`,cg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ug=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,dg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,fg=`#ifdef USE_TRANSMISSION
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
#endif`,pg=`#ifdef USE_TRANSMISSION
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
#endif`,mg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_g=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const $t={alphahash_fragment:vp,alphahash_pars_fragment:Mp,alphamap_fragment:yp,alphamap_pars_fragment:Sp,alphatest_fragment:bp,alphatest_pars_fragment:wp,aomap_fragment:Ep,aomap_pars_fragment:Tp,batching_pars_vertex:Ap,batching_vertex:Cp,begin_vertex:Rp,beginnormal_vertex:Pp,bsdfs:Lp,iridescence_fragment:Dp,bumpmap_pars_fragment:Ip,clipping_planes_fragment:Np,clipping_planes_pars_fragment:Up,clipping_planes_pars_vertex:Fp,clipping_planes_vertex:Op,color_fragment:kp,color_pars_fragment:Bp,color_pars_vertex:zp,color_vertex:Hp,common:Gp,cube_uv_reflection_fragment:Vp,defaultnormal_vertex:Wp,displacementmap_pars_vertex:$p,displacementmap_vertex:Xp,emissivemap_fragment:qp,emissivemap_pars_fragment:Yp,colorspace_fragment:Kp,colorspace_pars_fragment:Zp,envmap_fragment:Jp,envmap_common_pars_fragment:Qp,envmap_pars_fragment:jp,envmap_pars_vertex:tm,envmap_physical_pars_fragment:um,envmap_vertex:em,fog_vertex:nm,fog_pars_vertex:im,fog_fragment:sm,fog_pars_fragment:rm,gradientmap_pars_fragment:am,lightmap_pars_fragment:om,lights_lambert_fragment:lm,lights_lambert_pars_fragment:cm,lights_pars_begin:hm,lights_toon_fragment:dm,lights_toon_pars_fragment:fm,lights_phong_fragment:pm,lights_phong_pars_fragment:mm,lights_physical_fragment:gm,lights_physical_pars_fragment:_m,lights_fragment_begin:xm,lights_fragment_maps:vm,lights_fragment_end:Mm,lightprobes_pars_fragment:ym,logdepthbuf_fragment:Sm,logdepthbuf_pars_fragment:bm,logdepthbuf_pars_vertex:wm,logdepthbuf_vertex:Em,map_fragment:Tm,map_pars_fragment:Am,map_particle_fragment:Cm,map_particle_pars_fragment:Rm,metalnessmap_fragment:Pm,metalnessmap_pars_fragment:Lm,morphinstance_vertex:Dm,morphcolor_vertex:Im,morphnormal_vertex:Nm,morphtarget_pars_vertex:Um,morphtarget_vertex:Fm,normal_fragment_begin:Om,normal_fragment_maps:km,normal_pars_fragment:Bm,normal_pars_vertex:zm,normal_vertex:Hm,normalmap_pars_fragment:Gm,clearcoat_normal_fragment_begin:Vm,clearcoat_normal_fragment_maps:Wm,clearcoat_pars_fragment:$m,iridescence_pars_fragment:Xm,opaque_fragment:qm,packing:Ym,premultiplied_alpha_fragment:Km,project_vertex:Zm,dithering_fragment:Jm,dithering_pars_fragment:Qm,roughnessmap_fragment:jm,roughnessmap_pars_fragment:tg,shadowmap_pars_fragment:eg,shadowmap_pars_vertex:ng,shadowmap_vertex:ig,shadowmask_pars_fragment:sg,skinbase_vertex:rg,skinning_pars_vertex:ag,skinning_vertex:og,skinnormal_vertex:lg,specularmap_fragment:cg,specularmap_pars_fragment:hg,tonemapping_fragment:ug,tonemapping_pars_fragment:dg,transmission_fragment:fg,transmission_pars_fragment:pg,uv_pars_fragment:mg,uv_pars_vertex:gg,uv_vertex:_g,worldpos_vertex:xg,background_vert:`varying vec2 vUv;
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
}`},mt={common:{diffuse:{value:new Ot(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new zt}},envmap:{envMap:{value:null},envMapRotation:{value:new zt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new zt},normalScale:{value:new lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ot(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new C},probesMax:{value:new C},probesResolution:{value:new C}},points:{diffuse:{value:new Ot(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0},uvTransform:{value:new zt}},sprite:{diffuse:{value:new Ot(16777215)},opacity:{value:1},center:{value:new lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}}},Pn={basic:{uniforms:$e([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:$e([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new Ot(0)},envMapIntensity:{value:1}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:$e([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new Ot(0)},specular:{value:new Ot(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:$e([mt.common,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.roughnessmap,mt.metalnessmap,mt.fog,mt.lights,{emissive:{value:new Ot(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:$e([mt.common,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.gradientmap,mt.fog,mt.lights,{emissive:{value:new Ot(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:$e([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:$e([mt.points,mt.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:$e([mt.common,mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:$e([mt.common,mt.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:$e([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:$e([mt.sprite,mt.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new zt}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distance:{uniforms:$e([mt.common,mt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distance_vert,fragmentShader:$t.distance_frag},shadow:{uniforms:$e([mt.lights,mt.fog,{color:{value:new Ot(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};Pn.physical={uniforms:$e([Pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new zt},clearcoatNormalScale:{value:new lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new zt},sheen:{value:0},sheenColor:{value:new Ot(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new zt},transmissionSamplerSize:{value:new lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new zt},attenuationDistance:{value:0},attenuationColor:{value:new Ot(0)},specularColor:{value:new Ot(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new zt},anisotropyVector:{value:new lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new zt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const qr={r:0,b:0,g:0},vg=new ie,fh=new zt;fh.set(-1,0,0,0,1,0,0,0,1);function Mg(s,t,e,n,i,r){const a=new Ot(0);let o=i===!0?0:1,l,c,u=null,h=0,d=null;function f(w){let E=w.isScene===!0?w.background:null;if(E&&E.isTexture){const M=w.backgroundBlurriness>0;E=t.get(E,M)}return E}function p(w){let E=!1;const M=f(w);M===null?m(a,o):M&&M.isColor&&(m(M,1),E=!0);const S=s.xr.getEnvironmentBlendMode();S==="additive"?e.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||E)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function v(w,E){const M=f(E);M&&(M.isCubeTexture||M.mapping===or)?(c===void 0&&(c=new kt(new tn(1,1,1),new Ae({name:"BackgroundCubeMaterial",uniforms:ds(Pn.backgroundCube.uniforms),vertexShader:Pn.backgroundCube.vertexShader,fragmentShader:Pn.backgroundCube.fragmentShader,side:Ge,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,b,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(vg.makeRotationFromEuler(E.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(fh),c.material.toneMapped=Kt.getTransfer(M.colorSpace)!==ne,(u!==M||h!==M.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,u=M,h=M.version,d=s.toneMapping),c.layers.enableAll(),w.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new kt(new We(2,2),new Ae({name:"BackgroundMaterial",uniforms:ds(Pn.background.uniforms),vertexShader:Pn.background.vertexShader,fragmentShader:Pn.background.fragmentShader,side:jn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=Kt.getTransfer(M.colorSpace)!==ne,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||h!==M.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,u=M,h=M.version,d=s.toneMapping),l.layers.enableAll(),w.unshift(l,l.geometry,l.material,0,0,null))}function m(w,E){w.getRGB(qr,eh(s)),e.buffers.color.setClear(qr.r,qr.g,qr.b,E,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(w,E=1){a.set(w),o=E,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(w){o=w,m(a,o)},render:p,addToRenderList:v,dispose:g}}function yg(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,a=!1;function o(D,F,Y,K,B){let Z=!1;const X=h(D,K,Y,F);r!==X&&(r=X,c(r.object)),Z=f(D,K,Y,B),Z&&p(D,K,Y,B),B!==null&&t.update(B,s.ELEMENT_ARRAY_BUFFER),(Z||a)&&(a=!1,M(D,F,Y,K),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return s.createVertexArray()}function c(D){return s.bindVertexArray(D)}function u(D){return s.deleteVertexArray(D)}function h(D,F,Y,K){const B=K.wireframe===!0;let Z=n[F.id];Z===void 0&&(Z={},n[F.id]=Z);const X=D.isInstancedMesh===!0?D.id:0;let j=Z[X];j===void 0&&(j={},Z[X]=j);let it=j[Y.id];it===void 0&&(it={},j[Y.id]=it);let pt=it[B];return pt===void 0&&(pt=d(l()),it[B]=pt),pt}function d(D){const F=[],Y=[],K=[];for(let B=0;B<e;B++)F[B]=0,Y[B]=0,K[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:Y,attributeDivisors:K,object:D,attributes:{},index:null}}function f(D,F,Y,K){const B=r.attributes,Z=F.attributes;let X=0;const j=Y.getAttributes();for(const it in j)if(j[it].location>=0){const _t=B[it];let bt=Z[it];if(bt===void 0&&(it==="instanceMatrix"&&D.instanceMatrix&&(bt=D.instanceMatrix),it==="instanceColor"&&D.instanceColor&&(bt=D.instanceColor)),_t===void 0||_t.attribute!==bt||bt&&_t.data!==bt.data)return!0;X++}return r.attributesNum!==X||r.index!==K}function p(D,F,Y,K){const B={},Z=F.attributes;let X=0;const j=Y.getAttributes();for(const it in j)if(j[it].location>=0){let _t=Z[it];_t===void 0&&(it==="instanceMatrix"&&D.instanceMatrix&&(_t=D.instanceMatrix),it==="instanceColor"&&D.instanceColor&&(_t=D.instanceColor));const bt={};bt.attribute=_t,_t&&_t.data&&(bt.data=_t.data),B[it]=bt,X++}r.attributes=B,r.attributesNum=X,r.index=K}function v(){const D=r.newAttributes;for(let F=0,Y=D.length;F<Y;F++)D[F]=0}function m(D){g(D,0)}function g(D,F){const Y=r.newAttributes,K=r.enabledAttributes,B=r.attributeDivisors;Y[D]=1,K[D]===0&&(s.enableVertexAttribArray(D),K[D]=1),B[D]!==F&&(s.vertexAttribDivisor(D,F),B[D]=F)}function w(){const D=r.newAttributes,F=r.enabledAttributes;for(let Y=0,K=F.length;Y<K;Y++)F[Y]!==D[Y]&&(s.disableVertexAttribArray(Y),F[Y]=0)}function E(D,F,Y,K,B,Z,X){X===!0?s.vertexAttribIPointer(D,F,Y,B,Z):s.vertexAttribPointer(D,F,Y,K,B,Z)}function M(D,F,Y,K){v();const B=K.attributes,Z=Y.getAttributes(),X=F.defaultAttributeValues;for(const j in Z){const it=Z[j];if(it.location>=0){let pt=B[j];if(pt===void 0&&(j==="instanceMatrix"&&D.instanceMatrix&&(pt=D.instanceMatrix),j==="instanceColor"&&D.instanceColor&&(pt=D.instanceColor)),pt!==void 0){const _t=pt.normalized,bt=pt.itemSize,Qt=t.get(pt);if(Qt===void 0)continue;const fe=Qt.buffer,Jt=Qt.type,P=Qt.bytesPerElement,q=Jt===s.INT||Jt===s.UNSIGNED_INT||pt.gpuType===ka;if(pt.isInterleavedBufferAttribute){const $=pt.data,rt=$.stride,ct=pt.offset;if($.isInstancedInterleavedBuffer){for(let ht=0;ht<it.locationSize;ht++)g(it.location+ht,$.meshPerAttribute);D.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let ht=0;ht<it.locationSize;ht++)m(it.location+ht);s.bindBuffer(s.ARRAY_BUFFER,fe);for(let ht=0;ht<it.locationSize;ht++)E(it.location+ht,bt/it.locationSize,Jt,_t,rt*P,(ct+bt/it.locationSize*ht)*P,q)}else{if(pt.isInstancedBufferAttribute){for(let $=0;$<it.locationSize;$++)g(it.location+$,pt.meshPerAttribute);D.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=pt.meshPerAttribute*pt.count)}else for(let $=0;$<it.locationSize;$++)m(it.location+$);s.bindBuffer(s.ARRAY_BUFFER,fe);for(let $=0;$<it.locationSize;$++)E(it.location+$,bt/it.locationSize,Jt,_t,bt*P,bt/it.locationSize*$*P,q)}}else if(X!==void 0){const _t=X[j];if(_t!==void 0)switch(_t.length){case 2:s.vertexAttrib2fv(it.location,_t);break;case 3:s.vertexAttrib3fv(it.location,_t);break;case 4:s.vertexAttrib4fv(it.location,_t);break;default:s.vertexAttrib1fv(it.location,_t)}}}}w()}function S(){T();for(const D in n){const F=n[D];for(const Y in F){const K=F[Y];for(const B in K){const Z=K[B];for(const X in Z)u(Z[X].object),delete Z[X];delete K[B]}}delete n[D]}}function b(D){if(n[D.id]===void 0)return;const F=n[D.id];for(const Y in F){const K=F[Y];for(const B in K){const Z=K[B];for(const X in Z)u(Z[X].object),delete Z[X];delete K[B]}}delete n[D.id]}function R(D){for(const F in n){const Y=n[F];for(const K in Y){const B=Y[K];if(B[D.id]===void 0)continue;const Z=B[D.id];for(const X in Z)u(Z[X].object),delete Z[X];delete B[D.id]}}}function x(D){for(const F in n){const Y=n[F],K=D.isInstancedMesh===!0?D.id:0,B=Y[K];if(B!==void 0){for(const Z in B){const X=B[Z];for(const j in X)u(X[j].object),delete X[j];delete B[Z]}delete Y[K],Object.keys(Y).length===0&&delete n[F]}}}function T(){L(),a=!0,r!==i&&(r=i,c(r.object))}function L(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:T,resetDefaultState:L,dispose:S,releaseStatesOfGeometry:b,releaseStatesOfObject:x,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:m,disableUnusedAttributes:w}}function Sg(s,t,e){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,u){u!==0&&(s.drawArraysInstanced(n,l,c,u),e.update(c,n,u))}function o(l,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let d=0;for(let f=0;f<u;f++)d+=c[f];e.update(d,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function bg(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(R){return!(R!==dn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const x=R===Je&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==Ze&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==un&&!x)}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(It("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&d===!1&&It("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),w=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),E=s.getParameter(s.MAX_VARYING_VECTORS),M=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),S=s.getParameter(s.MAX_SAMPLES),b=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:w,maxVaryings:E,maxFragmentUniforms:M,maxSamples:S,samples:b}}function wg(s){const t=this;let e=null,n=0,i=!1,r=!1;const a=new oi,o=new zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||n!==0||i;return i=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,f){const p=h.clippingPlanes,v=h.clipIntersection,m=h.clipShadows,g=s.get(h);if(!i||p===null||p.length===0||r&&!m)r?u(null):c();else{const w=r?0:n,E=w*4;let M=g.clippingState||null;l.value=M,M=u(p,d,E,f);for(let S=0;S!==E;++S)M[S]=e[S];g.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=w}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,f,p){const v=h!==null?h.length:0;let m=null;if(v!==0){if(m=l.value,p!==!0||m===null){const g=f+v*4,w=d.matrixWorldInverse;o.getNormalMatrix(w),(m===null||m.length<g)&&(m=new Float32Array(g));for(let E=0,M=f;E!==v;++E,M+=4)a.copy(h[E]).applyMatrix4(w,o),a.normal.toArray(m,M),m[M+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}const ui=4,ph=[.125,.215,.35,.446,.526,.582],Ni=20,Eg=256,Xs=new Xr,mh=new Ot;let ll=null,cl=0,hl=0,ul=!1;const Tg=new C;class gh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){const{size:a=256,position:o=Tg}=r;ll=this._renderer.getRenderTarget(),cl=this._renderer.getActiveCubeFace(),hl=this._renderer.getActiveMipmapLevel(),ul=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=vh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(ll,cl,hl),this._renderer.xr.enabled=ul,t.scissorTest=!1,ms(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ei||t.mapping===$i?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ll=this._renderer.getRenderTarget(),cl=this._renderer.getActiveCubeFace(),hl=this._renderer.getActiveMipmapLevel(),ul=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ne,minFilter:Ne,generateMipmaps:!1,type:Je,format:dn,colorSpace:Ps,depthBuffer:!1},i=_h(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_h(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Ag(r)),this._blurMaterial=Rg(r,t,e),this._ggxMaterial=Cg(r,t,e)}return i}_compileMaterial(t){const e=new kt(new Be,t);this._renderer.compile(e,Xs)}_sceneToCubeUV(t,e,n,i,r){const l=new qe(90,1,e,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(mh),h.toneMapping=En,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(i),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new kt(new tn,new xn({name:"PMREM.Background",side:Ge,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,m=v.material;let g=!1;const w=t.background;w?w.isColor&&(m.color.copy(w),t.background=null,g=!0):(m.color.copy(mh),g=!0);for(let E=0;E<6;E++){const M=E%3;M===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[E],r.y,r.z)):M===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[E]));const S=this._cubeSize;ms(i,M*S,E>2?S:0,S,S),h.setRenderTarget(i),g&&h.render(v,l),h.render(t,l)}h.toneMapping=f,h.autoClear=d,t.background=w}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Ei||t.mapping===$i;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=vh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=xh());const r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;ms(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Xs)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),u=e/(this._lodMeshes.length-1),h=Math.sqrt(c*c-u*u),d=0+c*1.25,f=h*d,{_lodMax:p}=this,v=this._sizeLods[n],m=3*v*(n>p-ui?n-p+ui:0),g=4*(this._cubeSize-v);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=p-e,ms(r,m,g,3*v,2*v),i.setRenderTarget(r),i.render(o,Xs),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,ms(t,m,g,3*v,2*v),i.setRenderTarget(t),i.render(o,Xs)}_blur(t,e,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",r),this._halfBlur(a,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Zt("blur direction must be either latitudinal or longitudinal!");const u=3,h=this._lodMeshes[i];h.material=c;const d=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Ni-1),v=r/p,m=isFinite(r)?1+Math.floor(u*v):Ni;m>Ni&&It(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ni}`);const g=[];let w=0;for(let R=0;R<Ni;++R){const x=R/v,T=Math.exp(-x*x/2);g.push(T),R===0?w+=T:R<m&&(w+=2*T)}for(let R=0;R<g.length;R++)g[R]=g[R]/w;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:E}=this;d.dTheta.value=p,d.mipInt.value=E-n;const M=this._sizeLods[i],S=3*M*(i>E-ui?i-E+ui:0),b=4*(this._cubeSize-M);ms(e,S,b,3*M,2*M),l.setRenderTarget(e),l.render(h,Xs)}}function Ag(s){const t=[],e=[],n=[];let i=s;const r=s-ui+1+ph.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);t.push(o);let l=1/o;a>s-ui?l=ph[a-s+ui-1]:a===0&&(l=0),e.push(l);const c=1/(o-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,p=6,v=3,m=2,g=1,w=new Float32Array(v*p*f),E=new Float32Array(m*p*f),M=new Float32Array(g*p*f);for(let b=0;b<f;b++){const R=b%3*2/3-1,x=b>2?0:-1,T=[R,x,0,R+2/3,x,0,R+2/3,x+1,0,R,x,0,R+2/3,x+1,0,R,x+1,0];w.set(T,v*p*b),E.set(d,m*p*b);const L=[b,b,b,b,b,b];M.set(L,g*p*b)}const S=new Be;S.setAttribute("position",new rn(w,v)),S.setAttribute("uv",new rn(E,m)),S.setAttribute("faceIndex",new rn(M,g)),n.push(new kt(S,null)),i>ui&&i--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function _h(s,t,e){const n=new Xe(s,t,e);return n.texture.mapping=or,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ms(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function Cg(s,t,e){return new Ae({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Eg,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Yr(),fragmentShader:`

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
		`,blending:wn,depthTest:!1,depthWrite:!1})}function Rg(s,t,e){const n=new Float32Array(Ni),i=new C(0,1,0);return new Ae({name:"SphericalGaussianBlur",defines:{n:Ni,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Yr(),fragmentShader:`

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
		`,blending:wn,depthTest:!1,depthWrite:!1})}function xh(){return new Ae({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Yr(),fragmentShader:`

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
		`,blending:wn,depthTest:!1,depthWrite:!1})}function vh(){return new Ae({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Yr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:wn,depthTest:!1,depthWrite:!1})}function Yr(){return`

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
	`}class Mh extends Xe{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Xc(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new tn(5,5,5),r=new Ae({name:"CubemapFromEquirect",uniforms:ds(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ge,blending:wn});r.uniforms.tEquirect.value=e;const a=new kt(i,r),o=e.minFilter;return e.minFilter===Ti&&(e.minFilter=Ne),new hp(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(r)}}function Pg(s){let t=new WeakMap,e=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===Na||f===Ua)if(t.has(d)){const p=t.get(d).texture;return o(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const v=new Mh(p.height);return v.fromEquirectangularTexture(s,d),t.set(d,v),d.addEventListener("dispose",c),o(v.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,p=f===Na||f===Ua,v=f===Ei||f===$i;if(p||v){let m=e.get(d);const g=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return n===null&&(n=new gh(s)),m=p?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),m.texture;if(m!==void 0)return m.texture;{const w=d.image;return p&&w&&w.height>0||v&&w&&l(w)?(n===null&&(n=new gh(s)),m=p?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),d.addEventListener("dispose",u),m.texture):null}}}return d}function o(d,f){return f===Na?d.mapping=Ei:f===Ua&&(d.mapping=$i),d}function l(d){let f=0;const p=6;for(let v=0;v<p;v++)d[v]!==void 0&&f++;return f===p}function c(d){const f=d.target;f.removeEventListener("dispose",c);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function u(d){const f=d.target;f.removeEventListener("dispose",u);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:h}}function Lg(s){const t={};function e(n){if(t[n]!==void 0)return t[n];const i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&qi("WebGLRenderer: "+n+" extension not supported."),i}}}function Dg(s,t,e,n){const i={},r=new WeakMap;function a(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const p in d.attributes)t.remove(d.attributes[p]);d.removeEventListener("dispose",a),delete i[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(h,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,e.memory.geometries++),d}function l(h){const d=h.attributes;for(const f in d)t.update(d[f],s.ARRAY_BUFFER)}function c(h){const d=[],f=h.index,p=h.attributes.position;let v=0;if(p===void 0)return;if(f!==null){const w=f.array;v=f.version;for(let E=0,M=w.length;E<M;E+=3){const S=w[E+0],b=w[E+1],R=w[E+2];d.push(S,b,b,R,R,S)}}else{const w=p.array;v=p.version;for(let E=0,M=w.length/3-1;E<M;E+=3){const S=E+0,b=E+1,R=E+2;d.push(S,b,b,R,R,S)}}const m=new(p.count>=65535?Nc:Ic)(d,1);m.version=v;const g=r.get(h);g&&t.remove(g),r.set(h,m)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function Ig(s,t,e){let n;function i(h){n=h}let r,a;function o(h){r=h.type,a=h.bytesPerElement}function l(h,d){s.drawElements(n,d,r,h*a),e.update(d,n,1)}function c(h,d,f){f!==0&&(s.drawElementsInstanced(n,d,r,h*a,f),e.update(d,n,f))}function u(h,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,h,0,f);let v=0;for(let m=0;m<f;m++)v+=d[m];e.update(v,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function Ng(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:Zt("WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Ug(s,t,e){const n=new WeakMap,i=new pe;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(o);if(d===void 0||d.count!==h){let T=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",T)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let E=0;f===!0&&(E=1),p===!0&&(E=2),v===!0&&(E=3);let M=o.attributes.position.count*E,S=1;M>t.maxTextureSize&&(S=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const b=new Float32Array(M*S*4*h),R=new bc(b,M,S,h);R.type=un,R.needsUpdate=!0;const x=E*4;for(let L=0;L<h;L++){const D=m[L],F=g[L],Y=w[L],K=M*S*4*L;for(let B=0;B<D.count;B++){const Z=B*x;f===!0&&(i.fromBufferAttribute(D,B),b[K+Z+0]=i.x,b[K+Z+1]=i.y,b[K+Z+2]=i.z,b[K+Z+3]=0),p===!0&&(i.fromBufferAttribute(F,B),b[K+Z+4]=i.x,b[K+Z+5]=i.y,b[K+Z+6]=i.z,b[K+Z+7]=0),v===!0&&(i.fromBufferAttribute(Y,B),b[K+Z+8]=i.x,b[K+Z+9]=i.y,b[K+Z+10]=i.z,b[K+Z+11]=Y.itemSize===4?i.w:1)}}d={count:h,texture:R,size:new lt(M,S)},n.set(o,d),o.addEventListener("dispose",T)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const p=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",p),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function Fg(s,t,e,n,i){let r=new WeakMap;function a(c){const u=i.render.frame,h=c.geometry,d=t.get(c,h);if(r.get(d)!==u&&(t.update(d),r.set(d,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return d}function o(){r=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),e.remove(u.instanceMatrix),u.instanceColor!==null&&e.remove(u.instanceColor)}return{update:a,dispose:o}}const Og={[Ca]:"LINEAR_TONE_MAPPING",[Ra]:"REINHARD_TONE_MAPPING",[Pa]:"CINEON_TONE_MAPPING",[ar]:"ACES_FILMIC_TONE_MAPPING",[Da]:"AGX_TONE_MAPPING",[Ia]:"NEUTRAL_TONE_MAPPING",[La]:"CUSTOM_TONE_MAPPING"};function kg(s,t,e,n,i,r){const a=new Xe(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,depthTexture:i?new us(t,e):void 0}),o=new Xe(t,e,{type:Je,depthBuffer:!1,stencilBuffer:!1}),l=new Be;l.setAttribute("position",new xe([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new xe([0,2,0,0,2,0],2));const c=new nh({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new kt(l,c),h=new Xr(-1,1,1,-1,0,1);let d=null,f=null,p=!1,v,m=null,g=[],w=!1;this.setSize=function(E,M){a.setSize(E,M),o.setSize(E,M);for(let S=0;S<g.length;S++){const b=g[S];b.setSize&&b.setSize(E,M)}},this.setEffects=function(E){g=E,w=g.length>0&&g[0].isRenderPass===!0;const M=a.width,S=a.height;for(let b=0;b<g.length;b++){const R=g[b];R.setSize&&R.setSize(M,S)}},this.begin=function(E,M){if(p||E.toneMapping===En&&g.length===0)return!1;if(m=M,M!==null){const S=M.width,b=M.height;(a.width!==S||a.height!==b)&&this.setSize(S,b)}return w===!1&&E.setRenderTarget(a),v=E.toneMapping,E.toneMapping=En,!0},this.hasRenderPass=function(){return w},this.end=function(E,M){E.toneMapping=v,p=!0;let S=a,b=o;for(let R=0;R<g.length;R++){const x=g[R];if(x.enabled!==!1&&(x.render(E,b,S,M),x.needsSwap!==!1)){const T=S;S=b,b=T}}if(d!==E.outputColorSpace||f!==E.toneMapping){d=E.outputColorSpace,f=E.toneMapping,c.defines={},Kt.getTransfer(d)===ne&&(c.defines.SRGB_TRANSFER="");const R=Og[f];R&&(c.defines[R]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=S.texture,E.setRenderTarget(m),E.render(u,h),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const yh=new Oe,dl=new us(1,1),Sh=new bc,bh=new vf,wh=new Xc,Eh=[],Th=[],Ah=new Float32Array(16),Ch=new Float32Array(9),Rh=new Float32Array(4);function gs(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=Eh[i];if(r===void 0&&(r=new Float32Array(i),Eh[i]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function Ce(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Re(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Kr(s,t){let e=Th[t];e===void 0&&(e=new Int32Array(t),Th[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function Bg(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function zg(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;s.uniform2fv(this.addr,t),Re(e,t)}}function Hg(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ce(e,t))return;s.uniform3fv(this.addr,t),Re(e,t)}}function Gg(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;s.uniform4fv(this.addr,t),Re(e,t)}}function Vg(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Re(e,t)}else{if(Ce(e,n))return;Rh.set(n),s.uniformMatrix2fv(this.addr,!1,Rh),Re(e,n)}}function Wg(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Re(e,t)}else{if(Ce(e,n))return;Ch.set(n),s.uniformMatrix3fv(this.addr,!1,Ch),Re(e,n)}}function $g(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Re(e,t)}else{if(Ce(e,n))return;Ah.set(n),s.uniformMatrix4fv(this.addr,!1,Ah),Re(e,n)}}function Xg(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function qg(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;s.uniform2iv(this.addr,t),Re(e,t)}}function Yg(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;s.uniform3iv(this.addr,t),Re(e,t)}}function Kg(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;s.uniform4iv(this.addr,t),Re(e,t)}}function Zg(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Jg(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;s.uniform2uiv(this.addr,t),Re(e,t)}}function Qg(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;s.uniform3uiv(this.addr,t),Re(e,t)}}function jg(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;s.uniform4uiv(this.addr,t),Re(e,t)}}function t0(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(dl.compareFunction=e.isReversedDepthBuffer()?wo:bo,r=dl):r=yh,e.setTexture2D(t||r,i)}function e0(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||bh,i)}function n0(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||wh,i)}function i0(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Sh,i)}function s0(s){switch(s){case 5126:return Bg;case 35664:return zg;case 35665:return Hg;case 35666:return Gg;case 35674:return Vg;case 35675:return Wg;case 35676:return $g;case 5124:case 35670:return Xg;case 35667:case 35671:return qg;case 35668:case 35672:return Yg;case 35669:case 35673:return Kg;case 5125:return Zg;case 36294:return Jg;case 36295:return Qg;case 36296:return jg;case 35678:case 36198:case 36298:case 36306:case 35682:return t0;case 35679:case 36299:case 36307:return e0;case 35680:case 36300:case 36308:case 36293:return n0;case 36289:case 36303:case 36311:case 36292:return i0}}function r0(s,t){s.uniform1fv(this.addr,t)}function a0(s,t){const e=gs(t,this.size,2);s.uniform2fv(this.addr,e)}function o0(s,t){const e=gs(t,this.size,3);s.uniform3fv(this.addr,e)}function l0(s,t){const e=gs(t,this.size,4);s.uniform4fv(this.addr,e)}function c0(s,t){const e=gs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function h0(s,t){const e=gs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function u0(s,t){const e=gs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function d0(s,t){s.uniform1iv(this.addr,t)}function f0(s,t){s.uniform2iv(this.addr,t)}function p0(s,t){s.uniform3iv(this.addr,t)}function m0(s,t){s.uniform4iv(this.addr,t)}function g0(s,t){s.uniform1uiv(this.addr,t)}function _0(s,t){s.uniform2uiv(this.addr,t)}function x0(s,t){s.uniform3uiv(this.addr,t)}function v0(s,t){s.uniform4uiv(this.addr,t)}function M0(s,t,e){const n=this.cache,i=t.length,r=Kr(e,i);Ce(n,r)||(s.uniform1iv(this.addr,r),Re(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=dl:a=yh;for(let o=0;o!==i;++o)e.setTexture2D(t[o]||a,r[o])}function y0(s,t,e){const n=this.cache,i=t.length,r=Kr(e,i);Ce(n,r)||(s.uniform1iv(this.addr,r),Re(n,r));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||bh,r[a])}function S0(s,t,e){const n=this.cache,i=t.length,r=Kr(e,i);Ce(n,r)||(s.uniform1iv(this.addr,r),Re(n,r));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||wh,r[a])}function b0(s,t,e){const n=this.cache,i=t.length,r=Kr(e,i);Ce(n,r)||(s.uniform1iv(this.addr,r),Re(n,r));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||Sh,r[a])}function w0(s){switch(s){case 5126:return r0;case 35664:return a0;case 35665:return o0;case 35666:return l0;case 35674:return c0;case 35675:return h0;case 35676:return u0;case 5124:case 35670:return d0;case 35667:case 35671:return f0;case 35668:case 35672:return p0;case 35669:case 35673:return m0;case 5125:return g0;case 36294:return _0;case 36295:return x0;case 36296:return v0;case 35678:case 36198:case 36298:case 36306:case 35682:return M0;case 35679:case 36299:case 36307:return y0;case 35680:case 36300:case 36308:case 36293:return S0;case 36289:case 36303:case 36311:case 36292:return b0}}class E0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=s0(e.type)}}class T0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=w0(e.type)}}class A0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(t,e[o.id],n)}}}const fl=/(\w+)(\])?(\[|\.)?/g;function Ph(s,t){s.seq.push(t),s.map[t.id]=t}function C0(s,t,e){const n=s.name,i=n.length;for(fl.lastIndex=0;;){const r=fl.exec(n),a=fl.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){Ph(e,c===void 0?new E0(o,s,t):new T0(o,s,t));break}else{let h=e.map[o];h===void 0&&(h=new A0(o),Ph(e,h)),e=h}}}class Zr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);C0(o,l,this)}const i=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function Lh(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const R0=37297;let P0=0;function L0(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Dh=new zt;function D0(s){Kt._getMatrix(Dh,Kt.workingColorSpace,s);const t=`mat3( ${Dh.elements.map(e=>e.toFixed(4))} )`;switch(Kt.getTransfer(s)){case gr:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return It("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Ih(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+L0(s.getShaderSource(t),o)}else return r}function I0(s,t){const e=D0(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const N0={[Ca]:"Linear",[Ra]:"Reinhard",[Pa]:"Cineon",[ar]:"ACESFilmic",[Da]:"AgX",[Ia]:"Neutral",[La]:"Custom"};function U0(s,t){const e=N0[t];return e===void 0?(It("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Jr=new C;function F0(){Kt.getLuminanceCoefficients(Jr);const s=Jr.x.toFixed(4),t=Jr.y.toFixed(4),e=Jr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function O0(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qs).join(`
`)}function k0(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function B0(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function qs(s){return s!==""}function Nh(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Uh(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const z0=/^[ \t]*#include +<([\w\d./]+)>/gm;function pl(s){return s.replace(z0,G0)}const H0=new Map;function G0(s,t){let e=$t[t];if(e===void 0){const n=H0.get(t);if(n!==void 0)e=$t[n],It('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return pl(e)}const V0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fh(s){return s.replace(V0,W0)}function W0(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Oh(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}const $0={[sr]:"SHADOWMAP_TYPE_PCF",[As]:"SHADOWMAP_TYPE_VSM"};function X0(s){return $0[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const q0={[Ei]:"ENVMAP_TYPE_CUBE",[$i]:"ENVMAP_TYPE_CUBE",[or]:"ENVMAP_TYPE_CUBE_UV"};function Y0(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":q0[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const K0={[$i]:"ENVMAP_MODE_REFRACTION"};function Z0(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":K0[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const J0={[rc]:"ENVMAP_BLENDING_MULTIPLY",[Fd]:"ENVMAP_BLENDING_MIX",[Od]:"ENVMAP_BLENDING_ADD"};function Q0(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":J0[s.combine]||"ENVMAP_BLENDING_NONE"}function j0(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function t_(s,t,e,n){const i=s.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=X0(e),c=Y0(e),u=Z0(e),h=Q0(e),d=j0(e),f=O0(e),p=k0(r),v=i.createProgram();let m,g,w=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(qs).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(qs).join(`
`),g.length>0&&(g+=`
`)):(m=[Oh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qs).join(`
`),g=[Oh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==En?"#define TONE_MAPPING":"",e.toneMapping!==En?$t.tonemapping_pars_fragment:"",e.toneMapping!==En?U0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,I0("linearToOutputTexel",e.outputColorSpace),F0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(qs).join(`
`)),a=pl(a),a=Nh(a,e),a=Uh(a,e),o=pl(o),o=Nh(o,e),o=Uh(o,e),a=Fh(a),o=Fh(o),e.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===mc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===mc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const E=w+m+a,M=w+g+o,S=Lh(i,i.VERTEX_SHADER,E),b=Lh(i,i.FRAGMENT_SHADER,M);i.attachShader(v,S),i.attachShader(v,b),e.index0AttributeName!==void 0?i.bindAttribLocation(v,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function R(D){if(s.debug.checkShaderErrors){const F=i.getProgramInfoLog(v)||"",Y=i.getShaderInfoLog(S)||"",K=i.getShaderInfoLog(b)||"",B=F.trim(),Z=Y.trim(),X=K.trim();let j=!0,it=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(j=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,S,b);else{const pt=Ih(i,S,"vertex"),_t=Ih(i,b,"fragment");Zt("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+B+`
`+pt+`
`+_t)}else B!==""?It("WebGLProgram: Program Info Log:",B):(Z===""||X==="")&&(it=!1);it&&(D.diagnostics={runnable:j,programLog:B,vertexShader:{log:Z,prefix:m},fragmentShader:{log:X,prefix:g}})}i.deleteShader(S),i.deleteShader(b),x=new Zr(i,v),T=B0(i,v)}let x;this.getUniforms=function(){return x===void 0&&R(this),x};let T;this.getAttributes=function(){return T===void 0&&R(this),T};let L=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=i.getProgramParameter(v,R0)),L},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=P0++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=S,this.fragmentShader=b,this}let e_=0;class n_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new i_(t),e.set(t,n)),n}}class i_{constructor(t){this.id=e_++,this.code=t,this.usedTimes=0}}function s_(s){return s===Ci||s===pr||s===mr}function r_(s,t,e,n,i,r){const a=new Lo,o=new n_,l=new Set,c=[],u=new Map,h=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(x){return l.add(x),x===0?"uv":`uv${x}`}function v(x,T,L,D,F,Y){const K=D.fog,B=F.geometry,Z=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?D.environment:null,X=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,j=t.get(x.envMap||Z,X),it=j&&j.mapping===or?j.image.height:null,pt=f[x.type];x.precision!==null&&(d=n.getMaxPrecision(x.precision),d!==x.precision&&It("WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const _t=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,bt=_t!==void 0?_t.length:0;let Qt=0;B.morphAttributes.position!==void 0&&(Qt=1),B.morphAttributes.normal!==void 0&&(Qt=2),B.morphAttributes.color!==void 0&&(Qt=3);let fe,Jt,P,q;if(pt){const wt=Pn[pt];fe=wt.vertexShader,Jt=wt.fragmentShader}else{fe=x.vertexShader,Jt=x.fragmentShader;const wt=o.getVertexShaderStage(x),ge=o.getFragmentShaderStage(x);o.update(x,wt,ge),P=wt.id,q=ge.id}const $=s.getRenderTarget(),rt=s.state.buffers.depth.getReversed(),ct=F.isInstancedMesh===!0,ht=F.isBatchedMesh===!0,Xt=!!x.map,Nt=!!x.matcap,ee=!!j,jt=!!x.aoMap,Ft=!!x.lightMap,ae=!!x.bumpMap&&x.wireframe===!1,oe=!!x.normalMap,ve=!!x.displacementMap,Ue=!!x.emissiveMap,me=!!x.metalnessMap,Te=!!x.roughnessMap,U=x.anisotropy>0,Ke=x.clearcoat>0,se=x.dispersion>0,A=x.iridescence>0,_=x.sheen>0,k=x.transmission>0,V=U&&!!x.anisotropyMap,J=Ke&&!!x.clearcoatMap,st=Ke&&!!x.clearcoatNormalMap,ot=Ke&&!!x.clearcoatRoughnessMap,Q=A&&!!x.iridescenceMap,et=A&&!!x.iridescenceThicknessMap,ut=_&&!!x.sheenColorMap,At=_&&!!x.sheenRoughnessMap,gt=!!x.specularMap,dt=!!x.specularColorMap,Lt=!!x.specularIntensityMap,Ut=k&&!!x.transmissionMap,Ht=k&&!!x.thicknessMap,N=!!x.gradientMap,at=!!x.alphaMap,tt=x.alphaTest>0,ft=!!x.alphaHash,Mt=!!x.extensions;let nt=En;x.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(nt=s.toneMapping);const Tt={shaderID:pt,shaderType:x.type,shaderName:x.name,vertexShader:fe,fragmentShader:Jt,defines:x.defines,customVertexShaderID:P,customFragmentShaderID:q,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:ht,batchingColor:ht&&F._colorsTexture!==null,instancing:ct,instancingColor:ct&&F.instanceColor!==null,instancingMorph:ct&&F.morphTexture!==null,outputColorSpace:$===null?s.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:Kt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Xt,matcap:Nt,envMap:ee,envMapMode:ee&&j.mapping,envMapCubeUVHeight:it,aoMap:jt,lightMap:Ft,bumpMap:ae,normalMap:oe,displacementMap:ve,emissiveMap:Ue,normalMapObjectSpace:oe&&x.normalMapType===zd,normalMapTangentSpace:oe&&x.normalMapType===So,packedNormalMap:oe&&x.normalMapType===So&&s_(x.normalMap.format),metalnessMap:me,roughnessMap:Te,anisotropy:U,anisotropyMap:V,clearcoat:Ke,clearcoatMap:J,clearcoatNormalMap:st,clearcoatRoughnessMap:ot,dispersion:se,iridescence:A,iridescenceMap:Q,iridescenceThicknessMap:et,sheen:_,sheenColorMap:ut,sheenRoughnessMap:At,specularMap:gt,specularColorMap:dt,specularIntensityMap:Lt,transmission:k,transmissionMap:Ut,thicknessMap:Ht,gradientMap:N,opaque:x.transparent===!1&&x.blending===Vi&&x.alphaToCoverage===!1,alphaMap:at,alphaTest:tt,alphaHash:ft,combine:x.combine,mapUv:Xt&&p(x.map.channel),aoMapUv:jt&&p(x.aoMap.channel),lightMapUv:Ft&&p(x.lightMap.channel),bumpMapUv:ae&&p(x.bumpMap.channel),normalMapUv:oe&&p(x.normalMap.channel),displacementMapUv:ve&&p(x.displacementMap.channel),emissiveMapUv:Ue&&p(x.emissiveMap.channel),metalnessMapUv:me&&p(x.metalnessMap.channel),roughnessMapUv:Te&&p(x.roughnessMap.channel),anisotropyMapUv:V&&p(x.anisotropyMap.channel),clearcoatMapUv:J&&p(x.clearcoatMap.channel),clearcoatNormalMapUv:st&&p(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ot&&p(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Q&&p(x.iridescenceMap.channel),iridescenceThicknessMapUv:et&&p(x.iridescenceThicknessMap.channel),sheenColorMapUv:ut&&p(x.sheenColorMap.channel),sheenRoughnessMapUv:At&&p(x.sheenRoughnessMap.channel),specularMapUv:gt&&p(x.specularMap.channel),specularColorMapUv:dt&&p(x.specularColorMap.channel),specularIntensityMapUv:Lt&&p(x.specularIntensityMap.channel),transmissionMapUv:Ut&&p(x.transmissionMap.channel),thicknessMapUv:Ht&&p(x.thicknessMap.channel),alphaMapUv:at&&p(x.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(oe||U),vertexNormals:!!B.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!B.attributes.uv&&(Xt||at),fog:!!K,useFog:x.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||B.attributes.normal===void 0&&oe===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:rt,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:B.attributes.position!==void 0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:bt,morphTextureStride:Qt,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:Y.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:nt,decodeVideoTexture:Xt&&x.map.isVideoTexture===!0&&Kt.getTransfer(x.map.colorSpace)===ne,decodeVideoTextureEmissive:Ue&&x.emissiveMap.isVideoTexture===!0&&Kt.getTransfer(x.emissiveMap.colorSpace)===ne,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Fn,flipSided:x.side===Ge,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Mt&&x.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Mt&&x.extensions.multiDraw===!0||ht)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Tt.vertexUv1s=l.has(1),Tt.vertexUv2s=l.has(2),Tt.vertexUv3s=l.has(3),l.clear(),Tt}function m(x){const T=[];if(x.shaderID?T.push(x.shaderID):(T.push(x.customVertexShaderID),T.push(x.customFragmentShaderID)),x.defines!==void 0)for(const L in x.defines)T.push(L),T.push(x.defines[L]);return x.isRawShaderMaterial===!1&&(g(T,x),w(T,x),T.push(s.outputColorSpace)),T.push(x.customProgramCacheKey),T.join()}function g(x,T){x.push(T.precision),x.push(T.outputColorSpace),x.push(T.envMapMode),x.push(T.envMapCubeUVHeight),x.push(T.mapUv),x.push(T.alphaMapUv),x.push(T.lightMapUv),x.push(T.aoMapUv),x.push(T.bumpMapUv),x.push(T.normalMapUv),x.push(T.displacementMapUv),x.push(T.emissiveMapUv),x.push(T.metalnessMapUv),x.push(T.roughnessMapUv),x.push(T.anisotropyMapUv),x.push(T.clearcoatMapUv),x.push(T.clearcoatNormalMapUv),x.push(T.clearcoatRoughnessMapUv),x.push(T.iridescenceMapUv),x.push(T.iridescenceThicknessMapUv),x.push(T.sheenColorMapUv),x.push(T.sheenRoughnessMapUv),x.push(T.specularMapUv),x.push(T.specularColorMapUv),x.push(T.specularIntensityMapUv),x.push(T.transmissionMapUv),x.push(T.thicknessMapUv),x.push(T.combine),x.push(T.fogExp2),x.push(T.sizeAttenuation),x.push(T.morphTargetsCount),x.push(T.morphAttributeCount),x.push(T.numDirLights),x.push(T.numPointLights),x.push(T.numSpotLights),x.push(T.numSpotLightMaps),x.push(T.numHemiLights),x.push(T.numRectAreaLights),x.push(T.numDirLightShadows),x.push(T.numPointLightShadows),x.push(T.numSpotLightShadows),x.push(T.numSpotLightShadowsWithMaps),x.push(T.numLightProbes),x.push(T.shadowMapType),x.push(T.toneMapping),x.push(T.numClippingPlanes),x.push(T.numClipIntersection),x.push(T.depthPacking)}function w(x,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),T.packedNormalMap&&a.enable(22),T.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),T.numLightProbeGrids>0&&a.enable(22),T.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function E(x){const T=f[x.type];let L;if(T){const D=Pn[T];L=$s.clone(D.uniforms)}else L=x.uniforms;return L}function M(x,T){let L=u.get(T);return L!==void 0?++L.usedTimes:(L=new t_(s,T,x,i),c.push(L),u.set(T,L)),L}function S(x){if(--x.usedTimes===0){const T=c.indexOf(x);c[T]=c[c.length-1],c.pop(),u.delete(x.cacheKey),x.destroy()}}function b(x){o.remove(x)}function R(){o.dispose()}return{getParameters:v,getProgramCacheKey:m,getUniforms:E,acquireProgram:M,releaseProgram:S,releaseShaderCache:b,programs:c,dispose:R}}function a_(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function o_(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function kh(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Bh(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,p,v,m,g){let w=s[t];return w===void 0?(w={id:d.id,object:d,geometry:f,material:p,materialVariant:a(d),groupOrder:v,renderOrder:d.renderOrder,z:m,group:g},s[t]=w):(w.id=d.id,w.object=d,w.geometry=f,w.material=p,w.materialVariant=a(d),w.groupOrder=v,w.renderOrder=d.renderOrder,w.z=m,w.group=g),t++,w}function l(d,f,p,v,m,g){const w=o(d,f,p,v,m,g);p.transmission>0?n.push(w):p.transparent===!0?i.push(w):e.push(w)}function c(d,f,p,v,m,g){const w=o(d,f,p,v,m,g);p.transmission>0?n.unshift(w):p.transparent===!0?i.unshift(w):e.unshift(w)}function u(d,f,p){e.length>1&&e.sort(d||o_),n.length>1&&n.sort(f||kh),i.length>1&&i.sort(f||kh),p&&(e.reverse(),n.reverse(),i.reverse())}function h(){for(let d=t,f=s.length;d<f;d++){const p=s[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:h,sort:u}}function l_(){let s=new WeakMap;function t(n,i){const r=s.get(n);let a;return r===void 0?(a=new Bh,s.set(n,[a])):i>=r.length?(a=new Bh,r.push(a)):a=r[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function c_(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new Ot};break;case"SpotLight":e={position:new C,direction:new C,color:new Ot,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new Ot,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new Ot,groundColor:new Ot};break;case"RectAreaLight":e={color:new Ot,position:new C,halfWidth:new C,halfHeight:new C};break}return s[t.id]=e,e}}}function h_(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let u_=0;function d_(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function f_(s){const t=new c_,e=h_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new C);const i=new C,r=new ie,a=new ie;function o(c){let u=0,h=0,d=0;for(let T=0;T<9;T++)n.probe[T].set(0,0,0);let f=0,p=0,v=0,m=0,g=0,w=0,E=0,M=0,S=0,b=0,R=0;c.sort(d_);for(let T=0,L=c.length;T<L;T++){const D=c[T],F=D.color,Y=D.intensity,K=D.distance;let B=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Ci?B=D.shadow.map.texture:B=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)u+=F.r*Y,h+=F.g*Y,d+=F.b*Y;else if(D.isLightProbe){for(let Z=0;Z<9;Z++)n.probe[Z].addScaledVector(D.sh.coefficients[Z],Y);R++}else if(D.isDirectionalLight){const Z=t.get(D);if(Z.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const X=D.shadow,j=e.get(D);j.shadowIntensity=X.intensity,j.shadowBias=X.bias,j.shadowNormalBias=X.normalBias,j.shadowRadius=X.radius,j.shadowMapSize=X.mapSize,n.directionalShadow[f]=j,n.directionalShadowMap[f]=B,n.directionalShadowMatrix[f]=D.shadow.matrix,w++}n.directional[f]=Z,f++}else if(D.isSpotLight){const Z=t.get(D);Z.position.setFromMatrixPosition(D.matrixWorld),Z.color.copy(F).multiplyScalar(Y),Z.distance=K,Z.coneCos=Math.cos(D.angle),Z.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),Z.decay=D.decay,n.spot[v]=Z;const X=D.shadow;if(D.map&&(n.spotLightMap[S]=D.map,S++,X.updateMatrices(D),D.castShadow&&b++),n.spotLightMatrix[v]=X.matrix,D.castShadow){const j=e.get(D);j.shadowIntensity=X.intensity,j.shadowBias=X.bias,j.shadowNormalBias=X.normalBias,j.shadowRadius=X.radius,j.shadowMapSize=X.mapSize,n.spotShadow[v]=j,n.spotShadowMap[v]=B,M++}v++}else if(D.isRectAreaLight){const Z=t.get(D);Z.color.copy(F).multiplyScalar(Y),Z.halfWidth.set(D.width*.5,0,0),Z.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=Z,m++}else if(D.isPointLight){const Z=t.get(D);if(Z.color.copy(D.color).multiplyScalar(D.intensity),Z.distance=D.distance,Z.decay=D.decay,D.castShadow){const X=D.shadow,j=e.get(D);j.shadowIntensity=X.intensity,j.shadowBias=X.bias,j.shadowNormalBias=X.normalBias,j.shadowRadius=X.radius,j.shadowMapSize=X.mapSize,j.shadowCameraNear=X.camera.near,j.shadowCameraFar=X.camera.far,n.pointShadow[p]=j,n.pointShadowMap[p]=B,n.pointShadowMatrix[p]=D.shadow.matrix,E++}n.point[p]=Z,p++}else if(D.isHemisphereLight){const Z=t.get(D);Z.skyColor.copy(D.color).multiplyScalar(Y),Z.groundColor.copy(D.groundColor).multiplyScalar(Y),n.hemi[g]=Z,g++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=mt.LTC_FLOAT_1,n.rectAreaLTC2=mt.LTC_FLOAT_2):(n.rectAreaLTC1=mt.LTC_HALF_1,n.rectAreaLTC2=mt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const x=n.hash;(x.directionalLength!==f||x.pointLength!==p||x.spotLength!==v||x.rectAreaLength!==m||x.hemiLength!==g||x.numDirectionalShadows!==w||x.numPointShadows!==E||x.numSpotShadows!==M||x.numSpotMaps!==S||x.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=M+S-b,n.spotLightMap.length=S,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=R,x.directionalLength=f,x.pointLength=p,x.spotLength=v,x.rectAreaLength=m,x.hemiLength=g,x.numDirectionalShadows=w,x.numPointShadows=E,x.numSpotShadows=M,x.numSpotMaps=S,x.numLightProbes=R,n.version=u_++)}function l(c,u){let h=0,d=0,f=0,p=0,v=0;const m=u.matrixWorldInverse;for(let g=0,w=c.length;g<w;g++){const E=c[g];if(E.isDirectionalLight){const M=n.directional[h];M.direction.setFromMatrixPosition(E.matrixWorld),i.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),h++}else if(E.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(E.matrixWorld),i.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),f++}else if(E.isRectAreaLight){const M=n.rectArea[p];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),a.identity(),r.copy(E.matrixWorld),r.premultiply(m),a.extractRotation(r),M.halfWidth.set(E.width*.5,0,0),M.halfHeight.set(0,E.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),p++}else if(E.isPointLight){const M=n.point[d];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),d++}else if(E.isHemisphereLight){const M=n.hemi[v];M.direction.setFromMatrixPosition(E.matrixWorld),M.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:n}}function zh(s){const t=new f_(s),e=[],n=[],i=[];function r(d){h.camera=d,e.length=0,n.length=0,i.length=0}function a(d){e.push(d)}function o(d){n.push(d)}function l(d){i.push(d)}function c(){t.setup(e)}function u(d){t.setupView(e,d)}const h={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function p_(s){let t=new WeakMap;function e(i,r=0){const a=t.get(i);let o;return a===void 0?(o=new zh(s),t.set(i,[o])):r>=a.length?(o=new zh(s),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const m_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,g_=`uniform sampler2D shadow_pass;
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
}`,__=[new C(1,0,0),new C(-1,0,0),new C(0,1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1)],x_=[new C(0,-1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1),new C(0,-1,0),new C(0,-1,0)],Hh=new ie,Ys=new C,ml=new C;function v_(s,t,e){let n=new kr;const i=new lt,r=new lt,a=new pe,o=new np,l=new ip,c={},u=e.maxTextureSize,h={[jn]:Ge,[Ge]:jn,[Fn]:Fn},d=new Ae({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new lt},radius:{value:4}},vertexShader:m_,fragmentShader:g_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new Be;p.setAttribute("position",new rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new kt(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=sr;let g=this.type;this.render=function(b,R,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;this.type===_d&&(It("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=sr);const T=s.getRenderTarget(),L=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),F=s.state;F.setBlending(wn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const Y=g!==this.type;Y&&R.traverse(function(K){K.material&&(Array.isArray(K.material)?K.material.forEach(B=>B.needsUpdate=!0):K.material.needsUpdate=!0)});for(let K=0,B=b.length;K<B;K++){const Z=b[K],X=Z.shadow;if(X===void 0){It("WebGLShadowMap:",Z,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;i.copy(X.mapSize);const j=X.getFrameExtents();i.multiply(j),r.copy(X.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(r.x=Math.floor(u/j.x),i.x=r.x*j.x,X.mapSize.x=r.x),i.y>u&&(r.y=Math.floor(u/j.y),i.y=r.y*j.y,X.mapSize.y=r.y));const it=s.state.buffers.depth.getReversed();if(X.camera._reversedDepth=it,X.map===null||Y===!0){if(X.map!==null&&(X.map.depthTexture!==null&&(X.map.depthTexture.dispose(),X.map.depthTexture=null),X.map.dispose()),this.type===As){if(Z.isPointLight){It("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}X.map=new Xe(i.x,i.y,{format:Ci,type:Je,minFilter:Ne,magFilter:Ne,generateMipmaps:!1}),X.map.texture.name=Z.name+".shadowMap",X.map.depthTexture=new us(i.x,i.y,un),X.map.depthTexture.name=Z.name+".shadowMapDepth",X.map.depthTexture.format=kn,X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Ie,X.map.depthTexture.magFilter=Ie}else Z.isPointLight?(X.map=new Mh(i.x),X.map.depthTexture=new Of(i.x,Tn)):(X.map=new Xe(i.x,i.y),X.map.depthTexture=new us(i.x,i.y,Tn)),X.map.depthTexture.name=Z.name+".shadowMap",X.map.depthTexture.format=kn,this.type===sr?(X.map.depthTexture.compareFunction=it?wo:bo,X.map.depthTexture.minFilter=Ne,X.map.depthTexture.magFilter=Ne):(X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Ie,X.map.depthTexture.magFilter=Ie);X.camera.updateProjectionMatrix()}const pt=X.map.isWebGLCubeRenderTarget?6:1;for(let _t=0;_t<pt;_t++){if(X.map.isWebGLCubeRenderTarget)s.setRenderTarget(X.map,_t),s.clear();else{_t===0&&(s.setRenderTarget(X.map),s.clear());const bt=X.getViewport(_t);a.set(r.x*bt.x,r.y*bt.y,r.x*bt.z,r.y*bt.w),F.viewport(a)}if(Z.isPointLight){const bt=X.camera,Qt=X.matrix,fe=Z.distance||bt.far;fe!==bt.far&&(bt.far=fe,bt.updateProjectionMatrix()),Ys.setFromMatrixPosition(Z.matrixWorld),bt.position.copy(Ys),ml.copy(bt.position),ml.add(__[_t]),bt.up.copy(x_[_t]),bt.lookAt(ml),bt.updateMatrixWorld(),Qt.makeTranslation(-Ys.x,-Ys.y,-Ys.z),Hh.multiplyMatrices(bt.projectionMatrix,bt.matrixWorldInverse),X._frustum.setFromProjectionMatrix(Hh,bt.coordinateSystem,bt.reversedDepth)}else X.updateMatrices(Z);n=X.getFrustum(),M(R,x,X.camera,Z,this.type)}X.isPointLightShadow!==!0&&this.type===As&&w(X,x),X.needsUpdate=!1}g=this.type,m.needsUpdate=!1,s.setRenderTarget(T,L,D)};function w(b,R){const x=t.update(v);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Xe(i.x,i.y,{format:Ci,type:Je})),d.uniforms.shadow_pass.value=b.map.depthTexture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,s.setRenderTarget(b.mapPass),s.clear(),s.renderBufferDirect(R,null,x,d,v,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,s.setRenderTarget(b.map),s.clear(),s.renderBufferDirect(R,null,x,f,v,null)}function E(b,R,x,T){let L=null;const D=x.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(D!==void 0)L=D;else if(L=x.isPointLight===!0?l:o,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const F=L.uuid,Y=R.uuid;let K=c[F];K===void 0&&(K={},c[F]=K);let B=K[Y];B===void 0&&(B=L.clone(),K[Y]=B,R.addEventListener("dispose",S)),L=B}if(L.visible=R.visible,L.wireframe=R.wireframe,T===As?L.side=R.shadowSide!==null?R.shadowSide:R.side:L.side=R.shadowSide!==null?R.shadowSide:h[R.side],L.alphaMap=R.alphaMap,L.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,L.map=R.map,L.clipShadows=R.clipShadows,L.clippingPlanes=R.clippingPlanes,L.clipIntersection=R.clipIntersection,L.displacementMap=R.displacementMap,L.displacementScale=R.displacementScale,L.displacementBias=R.displacementBias,L.wireframeLinewidth=R.wireframeLinewidth,L.linewidth=R.linewidth,x.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const F=s.properties.get(L);F.light=x}return L}function M(b,R,x,T,L){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&L===As)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,b.matrixWorld);const Y=t.update(b),K=b.material;if(Array.isArray(K)){const B=Y.groups;for(let Z=0,X=B.length;Z<X;Z++){const j=B[Z],it=K[j.materialIndex];if(it&&it.visible){const pt=E(b,it,T,L);b.onBeforeShadow(s,b,R,x,Y,pt,j),s.renderBufferDirect(x,null,Y,pt,b,j),b.onAfterShadow(s,b,R,x,Y,pt,j)}}}else if(K.visible){const B=E(b,K,T,L);b.onBeforeShadow(s,b,R,x,Y,B,null),s.renderBufferDirect(x,null,Y,B,b,null),b.onAfterShadow(s,b,R,x,Y,B,null)}}const F=b.children;for(let Y=0,K=F.length;Y<K;Y++)M(F[Y],R,x,T,L)}function S(b){b.target.removeEventListener("dispose",S);for(const x in c){const T=c[x],L=b.target.uuid;L in T&&(T[L].dispose(),delete T[L])}}}function M_(s,t){function e(){let N=!1;const at=new pe;let tt=null;const ft=new pe(0,0,0,0);return{setMask:function(Mt){tt!==Mt&&!N&&(s.colorMask(Mt,Mt,Mt,Mt),tt=Mt)},setLocked:function(Mt){N=Mt},setClear:function(Mt,nt,Tt,wt,ge){ge===!0&&(Mt*=wt,nt*=wt,Tt*=wt),at.set(Mt,nt,Tt,wt),ft.equals(at)===!1&&(s.clearColor(Mt,nt,Tt,wt),ft.copy(at))},reset:function(){N=!1,tt=null,ft.set(-1,0,0,0)}}}function n(){let N=!1,at=!1,tt=null,ft=null,Mt=null;return{setReversed:function(nt){if(at!==nt){const Tt=t.get("EXT_clip_control");nt?Tt.clipControlEXT(Tt.LOWER_LEFT_EXT,Tt.ZERO_TO_ONE_EXT):Tt.clipControlEXT(Tt.LOWER_LEFT_EXT,Tt.NEGATIVE_ONE_TO_ONE_EXT),at=nt;const wt=Mt;Mt=null,this.setClear(wt)}},getReversed:function(){return at},setTest:function(nt){nt?$(s.DEPTH_TEST):rt(s.DEPTH_TEST)},setMask:function(nt){tt!==nt&&!N&&(s.depthMask(nt),tt=nt)},setFunc:function(nt){if(at&&(nt=Zd[nt]),ft!==nt){switch(nt){case ya:s.depthFunc(s.NEVER);break;case Sa:s.depthFunc(s.ALWAYS);break;case ba:s.depthFunc(s.LESS);break;case Wi:s.depthFunc(s.LEQUAL);break;case wa:s.depthFunc(s.EQUAL);break;case Ea:s.depthFunc(s.GEQUAL);break;case Ta:s.depthFunc(s.GREATER);break;case Aa:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ft=nt}},setLocked:function(nt){N=nt},setClear:function(nt){Mt!==nt&&(Mt=nt,at&&(nt=1-nt),s.clearDepth(nt))},reset:function(){N=!1,tt=null,ft=null,Mt=null,at=!1}}}function i(){let N=!1,at=null,tt=null,ft=null,Mt=null,nt=null,Tt=null,wt=null,ge=null;return{setTest:function(ue){N||(ue?$(s.STENCIL_TEST):rt(s.STENCIL_TEST))},setMask:function(ue){at!==ue&&!N&&(s.stencilMask(ue),at=ue)},setFunc:function(ue,In,Nn){(tt!==ue||ft!==In||Mt!==Nn)&&(s.stencilFunc(ue,In,Nn),tt=ue,ft=In,Mt=Nn)},setOp:function(ue,In,Nn){(nt!==ue||Tt!==In||wt!==Nn)&&(s.stencilOp(ue,In,Nn),nt=ue,Tt=In,wt=Nn)},setLocked:function(ue){N=ue},setClear:function(ue){ge!==ue&&(s.clearStencil(ue),ge=ue)},reset:function(){N=!1,at=null,tt=null,ft=null,Mt=null,nt=null,Tt=null,wt=null,ge=null}}}const r=new e,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let u={},h={},d={},f=new WeakMap,p=[],v=null,m=!1,g=null,w=null,E=null,M=null,S=null,b=null,R=null,x=new Ot(0,0,0),T=0,L=!1,D=null,F=null,Y=null,K=null,B=null;const Z=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,j=0;const it=s.getParameter(s.VERSION);it.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(it)[1]),X=j>=1):it.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(it)[1]),X=j>=2);let pt=null,_t={};const bt=s.getParameter(s.SCISSOR_BOX),Qt=s.getParameter(s.VIEWPORT),fe=new pe().fromArray(bt),Jt=new pe().fromArray(Qt);function P(N,at,tt,ft){const Mt=new Uint8Array(4),nt=s.createTexture();s.bindTexture(N,nt),s.texParameteri(N,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(N,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Tt=0;Tt<tt;Tt++)N===s.TEXTURE_3D||N===s.TEXTURE_2D_ARRAY?s.texImage3D(at,0,s.RGBA,1,1,ft,0,s.RGBA,s.UNSIGNED_BYTE,Mt):s.texImage2D(at+Tt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Mt);return nt}const q={};q[s.TEXTURE_2D]=P(s.TEXTURE_2D,s.TEXTURE_2D,1),q[s.TEXTURE_CUBE_MAP]=P(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[s.TEXTURE_2D_ARRAY]=P(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),q[s.TEXTURE_3D]=P(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),$(s.DEPTH_TEST),a.setFunc(Wi),ae(!1),oe(nc),$(s.CULL_FACE),jt(wn);function $(N){u[N]!==!0&&(s.enable(N),u[N]=!0)}function rt(N){u[N]!==!1&&(s.disable(N),u[N]=!1)}function ct(N,at){return d[N]!==at?(s.bindFramebuffer(N,at),d[N]=at,N===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=at),N===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=at),!0):!1}function ht(N,at){let tt=p,ft=!1;if(N){tt=f.get(at),tt===void 0&&(tt=[],f.set(at,tt));const Mt=N.textures;if(tt.length!==Mt.length||tt[0]!==s.COLOR_ATTACHMENT0){for(let nt=0,Tt=Mt.length;nt<Tt;nt++)tt[nt]=s.COLOR_ATTACHMENT0+nt;tt.length=Mt.length,ft=!0}}else tt[0]!==s.BACK&&(tt[0]=s.BACK,ft=!0);ft&&s.drawBuffers(tt)}function Xt(N){return v!==N?(s.useProgram(N),v=N,!0):!1}const Nt={[wi]:s.FUNC_ADD,[vd]:s.FUNC_SUBTRACT,[Md]:s.FUNC_REVERSE_SUBTRACT};Nt[yd]=s.MIN,Nt[Sd]=s.MAX;const ee={[bd]:s.ZERO,[wd]:s.ONE,[Ed]:s.SRC_COLOR,[va]:s.SRC_ALPHA,[Ld]:s.SRC_ALPHA_SATURATE,[Rd]:s.DST_COLOR,[Ad]:s.DST_ALPHA,[Td]:s.ONE_MINUS_SRC_COLOR,[Ma]:s.ONE_MINUS_SRC_ALPHA,[Pd]:s.ONE_MINUS_DST_COLOR,[Cd]:s.ONE_MINUS_DST_ALPHA,[Dd]:s.CONSTANT_COLOR,[Id]:s.ONE_MINUS_CONSTANT_COLOR,[Nd]:s.CONSTANT_ALPHA,[Ud]:s.ONE_MINUS_CONSTANT_ALPHA};function jt(N,at,tt,ft,Mt,nt,Tt,wt,ge,ue){if(N===wn){m===!0&&(rt(s.BLEND),m=!1);return}if(m===!1&&($(s.BLEND),m=!0),N!==xd){if(N!==g||ue!==L){if((w!==wi||S!==wi)&&(s.blendEquation(s.FUNC_ADD),w=wi,S=wi),ue)switch(N){case Vi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case rr:s.blendFunc(s.ONE,s.ONE);break;case ic:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case sc:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Zt("WebGLState: Invalid blending: ",N);break}else switch(N){case Vi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case rr:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case ic:Zt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case sc:Zt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Zt("WebGLState: Invalid blending: ",N);break}E=null,M=null,b=null,R=null,x.set(0,0,0),T=0,g=N,L=ue}return}Mt=Mt||at,nt=nt||tt,Tt=Tt||ft,(at!==w||Mt!==S)&&(s.blendEquationSeparate(Nt[at],Nt[Mt]),w=at,S=Mt),(tt!==E||ft!==M||nt!==b||Tt!==R)&&(s.blendFuncSeparate(ee[tt],ee[ft],ee[nt],ee[Tt]),E=tt,M=ft,b=nt,R=Tt),(wt.equals(x)===!1||ge!==T)&&(s.blendColor(wt.r,wt.g,wt.b,ge),x.copy(wt),T=ge),g=N,L=!1}function Ft(N,at){N.side===Fn?rt(s.CULL_FACE):$(s.CULL_FACE);let tt=N.side===Ge;at&&(tt=!tt),ae(tt),N.blending===Vi&&N.transparent===!1?jt(wn):jt(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);const ft=N.stencilWrite;o.setTest(ft),ft&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Ue(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?$(s.SAMPLE_ALPHA_TO_COVERAGE):rt(s.SAMPLE_ALPHA_TO_COVERAGE)}function ae(N){D!==N&&(N?s.frontFace(s.CW):s.frontFace(s.CCW),D=N)}function oe(N){N!==md?($(s.CULL_FACE),N!==F&&(N===nc?s.cullFace(s.BACK):N===gd?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):rt(s.CULL_FACE),F=N}function ve(N){N!==Y&&(X&&s.lineWidth(N),Y=N)}function Ue(N,at,tt){N?($(s.POLYGON_OFFSET_FILL),(K!==at||B!==tt)&&(K=at,B=tt,a.getReversed()&&(at=-at),s.polygonOffset(at,tt))):rt(s.POLYGON_OFFSET_FILL)}function me(N){N?$(s.SCISSOR_TEST):rt(s.SCISSOR_TEST)}function Te(N){N===void 0&&(N=s.TEXTURE0+Z-1),pt!==N&&(s.activeTexture(N),pt=N)}function U(N,at,tt){tt===void 0&&(pt===null?tt=s.TEXTURE0+Z-1:tt=pt);let ft=_t[tt];ft===void 0&&(ft={type:void 0,texture:void 0},_t[tt]=ft),(ft.type!==N||ft.texture!==at)&&(pt!==tt&&(s.activeTexture(tt),pt=tt),s.bindTexture(N,at||q[N]),ft.type=N,ft.texture=at)}function Ke(){const N=_t[pt];N!==void 0&&N.type!==void 0&&(s.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function se(){try{s.compressedTexImage2D(...arguments)}catch(N){Zt("WebGLState:",N)}}function A(){try{s.compressedTexImage3D(...arguments)}catch(N){Zt("WebGLState:",N)}}function _(){try{s.texSubImage2D(...arguments)}catch(N){Zt("WebGLState:",N)}}function k(){try{s.texSubImage3D(...arguments)}catch(N){Zt("WebGLState:",N)}}function V(){try{s.compressedTexSubImage2D(...arguments)}catch(N){Zt("WebGLState:",N)}}function J(){try{s.compressedTexSubImage3D(...arguments)}catch(N){Zt("WebGLState:",N)}}function st(){try{s.texStorage2D(...arguments)}catch(N){Zt("WebGLState:",N)}}function ot(){try{s.texStorage3D(...arguments)}catch(N){Zt("WebGLState:",N)}}function Q(){try{s.texImage2D(...arguments)}catch(N){Zt("WebGLState:",N)}}function et(){try{s.texImage3D(...arguments)}catch(N){Zt("WebGLState:",N)}}function ut(N){return h[N]!==void 0?h[N]:s.getParameter(N)}function At(N,at){h[N]!==at&&(s.pixelStorei(N,at),h[N]=at)}function gt(N){fe.equals(N)===!1&&(s.scissor(N.x,N.y,N.z,N.w),fe.copy(N))}function dt(N){Jt.equals(N)===!1&&(s.viewport(N.x,N.y,N.z,N.w),Jt.copy(N))}function Lt(N,at){let tt=c.get(at);tt===void 0&&(tt=new WeakMap,c.set(at,tt));let ft=tt.get(N);ft===void 0&&(ft=s.getUniformBlockIndex(at,N.name),tt.set(N,ft))}function Ut(N,at){const ft=c.get(at).get(N);l.get(at)!==ft&&(s.uniformBlockBinding(at,ft,N.__bindingPointIndex),l.set(at,ft))}function Ht(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),u={},h={},pt=null,_t={},d={},f=new WeakMap,p=[],v=null,m=!1,g=null,w=null,E=null,M=null,S=null,b=null,R=null,x=new Ot(0,0,0),T=0,L=!1,D=null,F=null,Y=null,K=null,B=null,fe.set(0,0,s.canvas.width,s.canvas.height),Jt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:$,disable:rt,bindFramebuffer:ct,drawBuffers:ht,useProgram:Xt,setBlending:jt,setMaterial:Ft,setFlipSided:ae,setCullFace:oe,setLineWidth:ve,setPolygonOffset:Ue,setScissorTest:me,activeTexture:Te,bindTexture:U,unbindTexture:Ke,compressedTexImage2D:se,compressedTexImage3D:A,texImage2D:Q,texImage3D:et,pixelStorei:At,getParameter:ut,updateUBOMapping:Lt,uniformBlockBinding:Ut,texStorage2D:st,texStorage3D:ot,texSubImage2D:_,texSubImage3D:k,compressedTexSubImage2D:V,compressedTexSubImage3D:J,scissor:gt,viewport:dt,reset:Ht}}function y_(s,t,e,n,i,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new lt,u=new WeakMap,h=new Set;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(A,_){return p?new OffscreenCanvas(A,_):_r("canvas")}function m(A,_,k){let V=1;const J=se(A);if((J.width>k||J.height>k)&&(V=k/Math.max(J.width,J.height)),V<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const st=Math.floor(V*J.width),ot=Math.floor(V*J.height);d===void 0&&(d=v(st,ot));const Q=_?v(st,ot):d;return Q.width=st,Q.height=ot,Q.getContext("2d").drawImage(A,0,0,st,ot),It("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+st+"x"+ot+")."),Q}else return"data"in A&&It("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),A;return A}function g(A){return A.generateMipmaps}function w(A){s.generateMipmap(A)}function E(A){return A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?s.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function M(A,_,k,V,J,st=!1){if(A!==null){if(s[A]!==void 0)return s[A];It("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let ot;V&&(ot=t.get("EXT_texture_norm16"),ot||It("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Q=_;if(_===s.RED&&(k===s.FLOAT&&(Q=s.R32F),k===s.HALF_FLOAT&&(Q=s.R16F),k===s.UNSIGNED_BYTE&&(Q=s.R8),k===s.UNSIGNED_SHORT&&ot&&(Q=ot.R16_EXT),k===s.SHORT&&ot&&(Q=ot.R16_SNORM_EXT)),_===s.RED_INTEGER&&(k===s.UNSIGNED_BYTE&&(Q=s.R8UI),k===s.UNSIGNED_SHORT&&(Q=s.R16UI),k===s.UNSIGNED_INT&&(Q=s.R32UI),k===s.BYTE&&(Q=s.R8I),k===s.SHORT&&(Q=s.R16I),k===s.INT&&(Q=s.R32I)),_===s.RG&&(k===s.FLOAT&&(Q=s.RG32F),k===s.HALF_FLOAT&&(Q=s.RG16F),k===s.UNSIGNED_BYTE&&(Q=s.RG8),k===s.UNSIGNED_SHORT&&ot&&(Q=ot.RG16_EXT),k===s.SHORT&&ot&&(Q=ot.RG16_SNORM_EXT)),_===s.RG_INTEGER&&(k===s.UNSIGNED_BYTE&&(Q=s.RG8UI),k===s.UNSIGNED_SHORT&&(Q=s.RG16UI),k===s.UNSIGNED_INT&&(Q=s.RG32UI),k===s.BYTE&&(Q=s.RG8I),k===s.SHORT&&(Q=s.RG16I),k===s.INT&&(Q=s.RG32I)),_===s.RGB_INTEGER&&(k===s.UNSIGNED_BYTE&&(Q=s.RGB8UI),k===s.UNSIGNED_SHORT&&(Q=s.RGB16UI),k===s.UNSIGNED_INT&&(Q=s.RGB32UI),k===s.BYTE&&(Q=s.RGB8I),k===s.SHORT&&(Q=s.RGB16I),k===s.INT&&(Q=s.RGB32I)),_===s.RGBA_INTEGER&&(k===s.UNSIGNED_BYTE&&(Q=s.RGBA8UI),k===s.UNSIGNED_SHORT&&(Q=s.RGBA16UI),k===s.UNSIGNED_INT&&(Q=s.RGBA32UI),k===s.BYTE&&(Q=s.RGBA8I),k===s.SHORT&&(Q=s.RGBA16I),k===s.INT&&(Q=s.RGBA32I)),_===s.RGB&&(k===s.UNSIGNED_SHORT&&ot&&(Q=ot.RGB16_EXT),k===s.SHORT&&ot&&(Q=ot.RGB16_SNORM_EXT),k===s.UNSIGNED_INT_5_9_9_9_REV&&(Q=s.RGB9_E5),k===s.UNSIGNED_INT_10F_11F_11F_REV&&(Q=s.R11F_G11F_B10F)),_===s.RGBA){const et=st?gr:Kt.getTransfer(J);k===s.FLOAT&&(Q=s.RGBA32F),k===s.HALF_FLOAT&&(Q=s.RGBA16F),k===s.UNSIGNED_BYTE&&(Q=et===ne?s.SRGB8_ALPHA8:s.RGBA8),k===s.UNSIGNED_SHORT&&ot&&(Q=ot.RGBA16_EXT),k===s.SHORT&&ot&&(Q=ot.RGBA16_SNORM_EXT),k===s.UNSIGNED_SHORT_4_4_4_4&&(Q=s.RGBA4),k===s.UNSIGNED_SHORT_5_5_5_1&&(Q=s.RGB5_A1)}return(Q===s.R16F||Q===s.R32F||Q===s.RG16F||Q===s.RG32F||Q===s.RGBA16F||Q===s.RGBA32F)&&t.get("EXT_color_buffer_float"),Q}function S(A,_){let k;return A?_===null||_===Tn||_===Rs?k=s.DEPTH24_STENCIL8:_===un?k=s.DEPTH32F_STENCIL8:_===Cs&&(k=s.DEPTH24_STENCIL8,It("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Tn||_===Rs?k=s.DEPTH_COMPONENT24:_===un?k=s.DEPTH_COMPONENT32F:_===Cs&&(k=s.DEPTH_COMPONENT16),k}function b(A,_){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==Ie&&A.minFilter!==Ne?Math.log2(Math.max(_.width,_.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?_.mipmaps.length:1}function R(A){const _=A.target;_.removeEventListener("dispose",R),T(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&h.delete(_)}function x(A){const _=A.target;_.removeEventListener("dispose",x),D(_)}function T(A){const _=n.get(A);if(_.__webglInit===void 0)return;const k=A.source,V=f.get(k);if(V){const J=V[_.__cacheKey];J.usedTimes--,J.usedTimes===0&&L(A),Object.keys(V).length===0&&f.delete(k)}n.remove(A)}function L(A){const _=n.get(A);s.deleteTexture(_.__webglTexture);const k=A.source,V=f.get(k);delete V[_.__cacheKey],a.memory.textures--}function D(A){const _=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(_.__webglFramebuffer[V]))for(let J=0;J<_.__webglFramebuffer[V].length;J++)s.deleteFramebuffer(_.__webglFramebuffer[V][J]);else s.deleteFramebuffer(_.__webglFramebuffer[V]);_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer[V])}else{if(Array.isArray(_.__webglFramebuffer))for(let V=0;V<_.__webglFramebuffer.length;V++)s.deleteFramebuffer(_.__webglFramebuffer[V]);else s.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&s.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let V=0;V<_.__webglColorRenderbuffer.length;V++)_.__webglColorRenderbuffer[V]&&s.deleteRenderbuffer(_.__webglColorRenderbuffer[V]);_.__webglDepthRenderbuffer&&s.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const k=A.textures;for(let V=0,J=k.length;V<J;V++){const st=n.get(k[V]);st.__webglTexture&&(s.deleteTexture(st.__webglTexture),a.memory.textures--),n.remove(k[V])}n.remove(A)}let F=0;function Y(){F=0}function K(){return F}function B(A){F=A}function Z(){const A=F;return A>=i.maxTextures&&It("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),F+=1,A}function X(A){const _=[];return _.push(A.wrapS),_.push(A.wrapT),_.push(A.wrapR||0),_.push(A.magFilter),_.push(A.minFilter),_.push(A.anisotropy),_.push(A.internalFormat),_.push(A.format),_.push(A.type),_.push(A.generateMipmaps),_.push(A.premultiplyAlpha),_.push(A.flipY),_.push(A.unpackAlignment),_.push(A.colorSpace),_.join()}function j(A,_){const k=n.get(A);if(A.isVideoTexture&&U(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&k.__version!==A.version){const V=A.image;if(V===null)It("WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)It("WebGLRenderer: Texture marked for update but image is incomplete");else{rt(k,A,_);return}}else A.isExternalTexture&&(k.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,k.__webglTexture,s.TEXTURE0+_)}function it(A,_){const k=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){rt(k,A,_);return}else A.isExternalTexture&&(k.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,k.__webglTexture,s.TEXTURE0+_)}function pt(A,_){const k=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){rt(k,A,_);return}e.bindTexture(s.TEXTURE_3D,k.__webglTexture,s.TEXTURE0+_)}function _t(A,_){const k=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&k.__version!==A.version){ct(k,A,_);return}e.bindTexture(s.TEXTURE_CUBE_MAP,k.__webglTexture,s.TEXTURE0+_)}const bt={[lr]:s.REPEAT,[On]:s.CLAMP_TO_EDGE,[Fa]:s.MIRRORED_REPEAT},Qt={[Ie]:s.NEAREST,[kd]:s.NEAREST_MIPMAP_NEAREST,[cr]:s.NEAREST_MIPMAP_LINEAR,[Ne]:s.LINEAR,[Oa]:s.LINEAR_MIPMAP_NEAREST,[Ti]:s.LINEAR_MIPMAP_LINEAR},fe={[Hd]:s.NEVER,[Xd]:s.ALWAYS,[Gd]:s.LESS,[bo]:s.LEQUAL,[Vd]:s.EQUAL,[wo]:s.GEQUAL,[Wd]:s.GREATER,[$d]:s.NOTEQUAL};function Jt(A,_){if(_.type===un&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===Ne||_.magFilter===Oa||_.magFilter===cr||_.magFilter===Ti||_.minFilter===Ne||_.minFilter===Oa||_.minFilter===cr||_.minFilter===Ti)&&It("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(A,s.TEXTURE_WRAP_S,bt[_.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,bt[_.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,bt[_.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,Qt[_.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,Qt[_.minFilter]),_.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,fe[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Ie||_.minFilter!==cr&&_.minFilter!==Ti||_.type===un&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const k=t.get("EXT_texture_filter_anisotropic");s.texParameterf(A,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,i.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function P(A,_){let k=!1;A.__webglInit===void 0&&(A.__webglInit=!0,_.addEventListener("dispose",R));const V=_.source;let J=f.get(V);J===void 0&&(J={},f.set(V,J));const st=X(_);if(st!==A.__cacheKey){J[st]===void 0&&(J[st]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,k=!0),J[st].usedTimes++;const ot=J[A.__cacheKey];ot!==void 0&&(J[A.__cacheKey].usedTimes--,ot.usedTimes===0&&L(_)),A.__cacheKey=st,A.__webglTexture=J[st].texture}return k}function q(A,_,k){return Math.floor(Math.floor(A/k)/_)}function $(A,_,k,V){const st=A.updateRanges;if(st.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,_.width,_.height,k,V,_.data);else{st.sort((At,gt)=>At.start-gt.start);let ot=0;for(let At=1;At<st.length;At++){const gt=st[ot],dt=st[At],Lt=gt.start+gt.count,Ut=q(dt.start,_.width,4),Ht=q(gt.start,_.width,4);dt.start<=Lt+1&&Ut===Ht&&q(dt.start+dt.count-1,_.width,4)===Ut?gt.count=Math.max(gt.count,dt.start+dt.count-gt.start):(++ot,st[ot]=dt)}st.length=ot+1;const Q=e.getParameter(s.UNPACK_ROW_LENGTH),et=e.getParameter(s.UNPACK_SKIP_PIXELS),ut=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,_.width);for(let At=0,gt=st.length;At<gt;At++){const dt=st[At],Lt=Math.floor(dt.start/4),Ut=Math.ceil(dt.count/4),Ht=Lt%_.width,N=Math.floor(Lt/_.width),at=Ut,tt=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,Ht),e.pixelStorei(s.UNPACK_SKIP_ROWS,N),e.texSubImage2D(s.TEXTURE_2D,0,Ht,N,at,tt,k,V,_.data)}A.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,Q),e.pixelStorei(s.UNPACK_SKIP_PIXELS,et),e.pixelStorei(s.UNPACK_SKIP_ROWS,ut)}}function rt(A,_,k){let V=s.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(V=s.TEXTURE_2D_ARRAY),_.isData3DTexture&&(V=s.TEXTURE_3D);const J=P(A,_),st=_.source;e.bindTexture(V,A.__webglTexture,s.TEXTURE0+k);const ot=n.get(st);if(st.version!==ot.__version||J===!0){if(e.activeTexture(s.TEXTURE0+k),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const tt=Kt.getPrimaries(Kt.workingColorSpace),ft=_.colorSpace===ti?null:Kt.getPrimaries(_.colorSpace),Mt=_.colorSpace===ti||tt===ft?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt)}e.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment);let et=m(_.image,!1,i.maxTextureSize);et=Ke(_,et);const ut=r.convert(_.format,_.colorSpace),At=r.convert(_.type);let gt=M(_.internalFormat,ut,At,_.normalized,_.colorSpace,_.isVideoTexture);Jt(V,_);let dt;const Lt=_.mipmaps,Ut=_.isVideoTexture!==!0,Ht=ot.__version===void 0||J===!0,N=st.dataReady,at=b(_,et);if(_.isDepthTexture)gt=S(_.format===Ai,_.type),Ht&&(Ut?e.texStorage2D(s.TEXTURE_2D,1,gt,et.width,et.height):e.texImage2D(s.TEXTURE_2D,0,gt,et.width,et.height,0,ut,At,null));else if(_.isDataTexture)if(Lt.length>0){Ut&&Ht&&e.texStorage2D(s.TEXTURE_2D,at,gt,Lt[0].width,Lt[0].height);for(let tt=0,ft=Lt.length;tt<ft;tt++)dt=Lt[tt],Ut?N&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,dt.width,dt.height,ut,At,dt.data):e.texImage2D(s.TEXTURE_2D,tt,gt,dt.width,dt.height,0,ut,At,dt.data);_.generateMipmaps=!1}else Ut?(Ht&&e.texStorage2D(s.TEXTURE_2D,at,gt,et.width,et.height),N&&$(_,et,ut,At)):e.texImage2D(s.TEXTURE_2D,0,gt,et.width,et.height,0,ut,At,et.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Ut&&Ht&&e.texStorage3D(s.TEXTURE_2D_ARRAY,at,gt,Lt[0].width,Lt[0].height,et.depth);for(let tt=0,ft=Lt.length;tt<ft;tt++)if(dt=Lt[tt],_.format!==dn)if(ut!==null)if(Ut){if(N)if(_.layerUpdates.size>0){const Mt=uh(dt.width,dt.height,_.format,_.type);for(const nt of _.layerUpdates){const Tt=dt.data.subarray(nt*Mt/dt.data.BYTES_PER_ELEMENT,(nt+1)*Mt/dt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,nt,dt.width,dt.height,1,ut,Tt)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,0,dt.width,dt.height,et.depth,ut,dt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,tt,gt,dt.width,dt.height,et.depth,0,dt.data,0,0);else It("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ut?N&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,0,dt.width,dt.height,et.depth,ut,At,dt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,tt,gt,dt.width,dt.height,et.depth,0,ut,At,dt.data)}else{Ut&&Ht&&e.texStorage2D(s.TEXTURE_2D,at,gt,Lt[0].width,Lt[0].height);for(let tt=0,ft=Lt.length;tt<ft;tt++)dt=Lt[tt],_.format!==dn?ut!==null?Ut?N&&e.compressedTexSubImage2D(s.TEXTURE_2D,tt,0,0,dt.width,dt.height,ut,dt.data):e.compressedTexImage2D(s.TEXTURE_2D,tt,gt,dt.width,dt.height,0,dt.data):It("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ut?N&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,dt.width,dt.height,ut,At,dt.data):e.texImage2D(s.TEXTURE_2D,tt,gt,dt.width,dt.height,0,ut,At,dt.data)}else if(_.isDataArrayTexture)if(Ut){if(Ht&&e.texStorage3D(s.TEXTURE_2D_ARRAY,at,gt,et.width,et.height,et.depth),N)if(_.layerUpdates.size>0){const tt=uh(et.width,et.height,_.format,_.type);for(const ft of _.layerUpdates){const Mt=et.data.subarray(ft*tt/et.data.BYTES_PER_ELEMENT,(ft+1)*tt/et.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ft,et.width,et.height,1,ut,At,Mt)}_.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,ut,At,et.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,gt,et.width,et.height,et.depth,0,ut,At,et.data);else if(_.isData3DTexture)Ut?(Ht&&e.texStorage3D(s.TEXTURE_3D,at,gt,et.width,et.height,et.depth),N&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,ut,At,et.data)):e.texImage3D(s.TEXTURE_3D,0,gt,et.width,et.height,et.depth,0,ut,At,et.data);else if(_.isFramebufferTexture){if(Ht)if(Ut)e.texStorage2D(s.TEXTURE_2D,at,gt,et.width,et.height);else{let tt=et.width,ft=et.height;for(let Mt=0;Mt<at;Mt++)e.texImage2D(s.TEXTURE_2D,Mt,gt,tt,ft,0,ut,At,null),tt>>=1,ft>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in s){const tt=s.canvas;if(tt.hasAttribute("layoutsubtree")||tt.setAttribute("layoutsubtree","true"),et.parentNode!==tt){tt.appendChild(et),h.add(_),tt.onpaint=ft=>{const Mt=ft.changedElements;for(const nt of h)Mt.includes(nt.image)&&(nt.needsUpdate=!0)},tt.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,et);else{const Mt=s.RGBA,nt=s.RGBA,Tt=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Mt,nt,Tt,et)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Lt.length>0){if(Ut&&Ht){const tt=se(Lt[0]);e.texStorage2D(s.TEXTURE_2D,at,gt,tt.width,tt.height)}for(let tt=0,ft=Lt.length;tt<ft;tt++)dt=Lt[tt],Ut?N&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,ut,At,dt):e.texImage2D(s.TEXTURE_2D,tt,gt,ut,At,dt);_.generateMipmaps=!1}else if(Ut){if(Ht){const tt=se(et);e.texStorage2D(s.TEXTURE_2D,at,gt,tt.width,tt.height)}N&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,ut,At,et)}else e.texImage2D(s.TEXTURE_2D,0,gt,ut,At,et);g(_)&&w(V),ot.__version=st.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function ct(A,_,k){if(_.image.length!==6)return;const V=P(A,_),J=_.source;e.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+k);const st=n.get(J);if(J.version!==st.__version||V===!0){e.activeTexture(s.TEXTURE0+k);const ot=Kt.getPrimaries(Kt.workingColorSpace),Q=_.colorSpace===ti?null:Kt.getPrimaries(_.colorSpace),et=_.colorSpace===ti||ot===Q?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,et);const ut=_.isCompressedTexture||_.image[0].isCompressedTexture,At=_.image[0]&&_.image[0].isDataTexture,gt=[];for(let nt=0;nt<6;nt++)!ut&&!At?gt[nt]=m(_.image[nt],!0,i.maxCubemapSize):gt[nt]=At?_.image[nt].image:_.image[nt],gt[nt]=Ke(_,gt[nt]);const dt=gt[0],Lt=r.convert(_.format,_.colorSpace),Ut=r.convert(_.type),Ht=M(_.internalFormat,Lt,Ut,_.normalized,_.colorSpace),N=_.isVideoTexture!==!0,at=st.__version===void 0||V===!0,tt=J.dataReady;let ft=b(_,dt);Jt(s.TEXTURE_CUBE_MAP,_);let Mt;if(ut){N&&at&&e.texStorage2D(s.TEXTURE_CUBE_MAP,ft,Ht,dt.width,dt.height);for(let nt=0;nt<6;nt++){Mt=gt[nt].mipmaps;for(let Tt=0;Tt<Mt.length;Tt++){const wt=Mt[Tt];_.format!==dn?Lt!==null?N?tt&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Tt,0,0,wt.width,wt.height,Lt,wt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Tt,Ht,wt.width,wt.height,0,wt.data):It("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Tt,0,0,wt.width,wt.height,Lt,Ut,wt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Tt,Ht,wt.width,wt.height,0,Lt,Ut,wt.data)}}}else{if(Mt=_.mipmaps,N&&at){Mt.length>0&&ft++;const nt=se(gt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,ft,Ht,nt.width,nt.height)}for(let nt=0;nt<6;nt++)if(At){N?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,gt[nt].width,gt[nt].height,Lt,Ut,gt[nt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,Ht,gt[nt].width,gt[nt].height,0,Lt,Ut,gt[nt].data);for(let Tt=0;Tt<Mt.length;Tt++){const ge=Mt[Tt].image[nt].image;N?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Tt+1,0,0,ge.width,ge.height,Lt,Ut,ge.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Tt+1,Ht,ge.width,ge.height,0,Lt,Ut,ge.data)}}else{N?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,Lt,Ut,gt[nt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,Ht,Lt,Ut,gt[nt]);for(let Tt=0;Tt<Mt.length;Tt++){const wt=Mt[Tt];N?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Tt+1,0,0,Lt,Ut,wt.image[nt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Tt+1,Ht,Lt,Ut,wt.image[nt])}}}g(_)&&w(s.TEXTURE_CUBE_MAP),st.__version=J.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function ht(A,_,k,V,J,st){const ot=r.convert(k.format,k.colorSpace),Q=r.convert(k.type),et=M(k.internalFormat,ot,Q,k.normalized,k.colorSpace),ut=n.get(_),At=n.get(k);if(At.__renderTarget=_,!ut.__hasExternalTextures){const gt=Math.max(1,_.width>>st),dt=Math.max(1,_.height>>st);J===s.TEXTURE_3D||J===s.TEXTURE_2D_ARRAY?e.texImage3D(J,st,et,gt,dt,_.depth,0,ot,Q,null):e.texImage2D(J,st,et,gt,dt,0,ot,Q,null)}e.bindFramebuffer(s.FRAMEBUFFER,A),Te(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,V,J,At.__webglTexture,0,me(_)):(J===s.TEXTURE_2D||J>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,V,J,At.__webglTexture,st),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Xt(A,_,k){if(s.bindRenderbuffer(s.RENDERBUFFER,A),_.depthBuffer){const V=_.depthTexture,J=V&&V.isDepthTexture?V.type:null,st=S(_.stencilBuffer,J),ot=_.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Te(_)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,me(_),st,_.width,_.height):k?s.renderbufferStorageMultisample(s.RENDERBUFFER,me(_),st,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,st,_.width,_.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ot,s.RENDERBUFFER,A)}else{const V=_.textures;for(let J=0;J<V.length;J++){const st=V[J],ot=r.convert(st.format,st.colorSpace),Q=r.convert(st.type),et=M(st.internalFormat,ot,Q,st.normalized,st.colorSpace);Te(_)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,me(_),et,_.width,_.height):k?s.renderbufferStorageMultisample(s.RENDERBUFFER,me(_),et,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,et,_.width,_.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Nt(A,_,k){const V=_.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,A),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const J=n.get(_.depthTexture);if(J.__renderTarget=_,(!J.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),V){if(J.__webglInit===void 0&&(J.__webglInit=!0,_.depthTexture.addEventListener("dispose",R)),J.__webglTexture===void 0){J.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,J.__webglTexture),Jt(s.TEXTURE_CUBE_MAP,_.depthTexture);const ut=r.convert(_.depthTexture.format),At=r.convert(_.depthTexture.type);let gt;_.depthTexture.format===kn?gt=s.DEPTH_COMPONENT24:_.depthTexture.format===Ai&&(gt=s.DEPTH24_STENCIL8);for(let dt=0;dt<6;dt++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,gt,_.width,_.height,0,ut,At,null)}}else j(_.depthTexture,0);const st=J.__webglTexture,ot=me(_),Q=V?s.TEXTURE_CUBE_MAP_POSITIVE_X+k:s.TEXTURE_2D,et=_.depthTexture.format===Ai?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(_.depthTexture.format===kn)Te(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,et,Q,st,0,ot):s.framebufferTexture2D(s.FRAMEBUFFER,et,Q,st,0);else if(_.depthTexture.format===Ai)Te(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,et,Q,st,0,ot):s.framebufferTexture2D(s.FRAMEBUFFER,et,Q,st,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ee(A){const _=n.get(A),k=A.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==A.depthTexture){const V=A.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),V){const J=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,V.removeEventListener("dispose",J)};V.addEventListener("dispose",J),_.__depthDisposeCallback=J}_.__boundDepthTexture=V}if(A.depthTexture&&!_.__autoAllocateDepthBuffer)if(k)for(let V=0;V<6;V++)Nt(_.__webglFramebuffer[V],A,V);else{const V=A.texture.mipmaps;V&&V.length>0?Nt(_.__webglFramebuffer[0],A,0):Nt(_.__webglFramebuffer,A,0)}else if(k){_.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[V]),_.__webglDepthbuffer[V]===void 0)_.__webglDepthbuffer[V]=s.createRenderbuffer(),Xt(_.__webglDepthbuffer[V],A,!1);else{const J=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,st=_.__webglDepthbuffer[V];s.bindRenderbuffer(s.RENDERBUFFER,st),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,st)}}else{const V=A.texture.mipmaps;if(V&&V.length>0?e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=s.createRenderbuffer(),Xt(_.__webglDepthbuffer,A,!1);else{const J=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,st=_.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,st),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,st)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function jt(A,_,k){const V=n.get(A);_!==void 0&&ht(V.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),k!==void 0&&ee(A)}function Ft(A){const _=A.texture,k=n.get(A),V=n.get(_);A.addEventListener("dispose",x);const J=A.textures,st=A.isWebGLCubeRenderTarget===!0,ot=J.length>1;if(ot||(V.__webglTexture===void 0&&(V.__webglTexture=s.createTexture()),V.__version=_.version,a.memory.textures++),st){k.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(_.mipmaps&&_.mipmaps.length>0){k.__webglFramebuffer[Q]=[];for(let et=0;et<_.mipmaps.length;et++)k.__webglFramebuffer[Q][et]=s.createFramebuffer()}else k.__webglFramebuffer[Q]=s.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){k.__webglFramebuffer=[];for(let Q=0;Q<_.mipmaps.length;Q++)k.__webglFramebuffer[Q]=s.createFramebuffer()}else k.__webglFramebuffer=s.createFramebuffer();if(ot)for(let Q=0,et=J.length;Q<et;Q++){const ut=n.get(J[Q]);ut.__webglTexture===void 0&&(ut.__webglTexture=s.createTexture(),a.memory.textures++)}if(A.samples>0&&Te(A)===!1){k.__webglMultisampledFramebuffer=s.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let Q=0;Q<J.length;Q++){const et=J[Q];k.__webglColorRenderbuffer[Q]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,k.__webglColorRenderbuffer[Q]);const ut=r.convert(et.format,et.colorSpace),At=r.convert(et.type),gt=M(et.internalFormat,ut,At,et.normalized,et.colorSpace,A.isXRRenderTarget===!0),dt=me(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,dt,gt,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Q,s.RENDERBUFFER,k.__webglColorRenderbuffer[Q])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(k.__webglDepthRenderbuffer=s.createRenderbuffer(),Xt(k.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(st){e.bindTexture(s.TEXTURE_CUBE_MAP,V.__webglTexture),Jt(s.TEXTURE_CUBE_MAP,_);for(let Q=0;Q<6;Q++)if(_.mipmaps&&_.mipmaps.length>0)for(let et=0;et<_.mipmaps.length;et++)ht(k.__webglFramebuffer[Q][et],A,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,et);else ht(k.__webglFramebuffer[Q],A,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);g(_)&&w(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ot){for(let Q=0,et=J.length;Q<et;Q++){const ut=J[Q],At=n.get(ut);let gt=s.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(gt=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(gt,At.__webglTexture),Jt(gt,ut),ht(k.__webglFramebuffer,A,ut,s.COLOR_ATTACHMENT0+Q,gt,0),g(ut)&&w(gt)}e.unbindTexture()}else{let Q=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Q=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(Q,V.__webglTexture),Jt(Q,_),_.mipmaps&&_.mipmaps.length>0)for(let et=0;et<_.mipmaps.length;et++)ht(k.__webglFramebuffer[et],A,_,s.COLOR_ATTACHMENT0,Q,et);else ht(k.__webglFramebuffer,A,_,s.COLOR_ATTACHMENT0,Q,0);g(_)&&w(Q),e.unbindTexture()}A.depthBuffer&&ee(A)}function ae(A){const _=A.textures;for(let k=0,V=_.length;k<V;k++){const J=_[k];if(g(J)){const st=E(A),ot=n.get(J).__webglTexture;e.bindTexture(st,ot),w(st),e.unbindTexture()}}}const oe=[],ve=[];function Ue(A){if(A.samples>0){if(Te(A)===!1){const _=A.textures,k=A.width,V=A.height;let J=s.COLOR_BUFFER_BIT;const st=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ot=n.get(A),Q=_.length>1;if(Q)for(let ut=0;ut<_.length;ut++)e.bindFramebuffer(s.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,ot.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,ot.__webglMultisampledFramebuffer);const et=A.texture.mipmaps;et&&et.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ot.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ot.__webglFramebuffer);for(let ut=0;ut<_.length;ut++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(J|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(J|=s.STENCIL_BUFFER_BIT)),Q){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ot.__webglColorRenderbuffer[ut]);const At=n.get(_[ut]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,At,0)}s.blitFramebuffer(0,0,k,V,0,0,k,V,J,s.NEAREST),l===!0&&(oe.length=0,ve.length=0,oe.push(s.COLOR_ATTACHMENT0+ut),A.depthBuffer&&A.resolveDepthBuffer===!1&&(oe.push(st),ve.push(st),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,ve)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,oe))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Q)for(let ut=0;ut<_.length;ut++){e.bindFramebuffer(s.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.RENDERBUFFER,ot.__webglColorRenderbuffer[ut]);const At=n.get(_[ut]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,ot.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.TEXTURE_2D,At,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ot.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const _=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[_])}}}function me(A){return Math.min(i.maxSamples,A.samples)}function Te(A){const _=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function U(A){const _=a.render.frame;u.get(A)!==_&&(u.set(A,_),A.update())}function Ke(A,_){const k=A.colorSpace,V=A.format,J=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||k!==Ps&&k!==ti&&(Kt.getTransfer(k)===ne?(V!==dn||J!==Ze)&&It("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Zt("WebGLTextures: Unsupported texture color space:",k)),_}function se(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=Z,this.resetTextureUnits=Y,this.getTextureUnits=K,this.setTextureUnits=B,this.setTexture2D=j,this.setTexture2DArray=it,this.setTexture3D=pt,this.setTextureCube=_t,this.rebindTextures=jt,this.setupRenderTarget=Ft,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=Ue,this.setupDepthRenderbuffer=ee,this.setupFrameBufferTexture=ht,this.useMultisampledRTT=Te,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function S_(s,t){function e(n,i=ti){let r;const a=Kt.getTransfer(i);if(n===Ze)return s.UNSIGNED_BYTE;if(n===Ba)return s.UNSIGNED_SHORT_4_4_4_4;if(n===za)return s.UNSIGNED_SHORT_5_5_5_1;if(n===cc)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===hc)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===oc)return s.BYTE;if(n===lc)return s.SHORT;if(n===Cs)return s.UNSIGNED_SHORT;if(n===ka)return s.INT;if(n===Tn)return s.UNSIGNED_INT;if(n===un)return s.FLOAT;if(n===Je)return s.HALF_FLOAT;if(n===uc)return s.ALPHA;if(n===dc)return s.RGB;if(n===dn)return s.RGBA;if(n===kn)return s.DEPTH_COMPONENT;if(n===Ai)return s.DEPTH_STENCIL;if(n===Ha)return s.RED;if(n===Ga)return s.RED_INTEGER;if(n===Ci)return s.RG;if(n===Va)return s.RG_INTEGER;if(n===Wa)return s.RGBA_INTEGER;if(n===hr||n===ur||n===dr||n===fr)if(a===ne)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===hr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ur)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===dr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===fr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===hr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ur)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===dr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===fr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===$a||n===Xa||n===qa||n===Ya)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===$a)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Xa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===qa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ya)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ka||n===Za||n===Ja||n===Qa||n===ja||n===pr||n===to)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ka||n===Za)return a===ne?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ja)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Qa)return r.COMPRESSED_R11_EAC;if(n===ja)return r.COMPRESSED_SIGNED_R11_EAC;if(n===pr)return r.COMPRESSED_RG11_EAC;if(n===to)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===eo||n===no||n===io||n===so||n===ro||n===ao||n===oo||n===lo||n===co||n===ho||n===uo||n===fo||n===po||n===mo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===eo)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===no)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===io)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===so)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ro)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ao)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===oo)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===lo)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===co)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ho)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===uo)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===fo)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===po)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===mo)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===go||n===_o||n===xo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===go)return a===ne?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===_o)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===xo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===vo||n===Mo||n===mr||n===yo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===vo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Mo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===mr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===yo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Rs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}const b_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,w_=`
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

}`;class E_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new qc(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Ae({vertexShader:b_,fragmentShader:w_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new kt(new We(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class T_ extends ei{constructor(t,e){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,p=null;const v=typeof XRWebGLBinding<"u",m=new E_,g={},w=e.getContextAttributes();let E=null,M=null;const S=[],b=[],R=new lt;let x=null;const T=new qe;T.viewport=new pe;const L=new qe;L.viewport=new pe;const D=[T,L],F=new up;let Y=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(P){let q=S[P];return q===void 0&&(q=new Io,S[P]=q),q.getTargetRaySpace()},this.getControllerGrip=function(P){let q=S[P];return q===void 0&&(q=new Io,S[P]=q),q.getGripSpace()},this.getHand=function(P){let q=S[P];return q===void 0&&(q=new Io,S[P]=q),q.getHandSpace()};function B(P){const q=b.indexOf(P.inputSource);if(q===-1)return;const $=S[q];$!==void 0&&($.update(P.inputSource,P.frame,c||a),$.dispatchEvent({type:P.type,data:P.inputSource}))}function Z(){i.removeEventListener("select",B),i.removeEventListener("selectstart",B),i.removeEventListener("selectend",B),i.removeEventListener("squeeze",B),i.removeEventListener("squeezestart",B),i.removeEventListener("squeezeend",B),i.removeEventListener("end",Z),i.removeEventListener("inputsourceschange",X);for(let P=0;P<S.length;P++){const q=b[P];q!==null&&(b[P]=null,S[P].disconnect(q))}Y=null,K=null,m.reset();for(const P in g)delete g[P];t.setRenderTarget(E),f=null,d=null,h=null,i=null,M=null,Jt.stop(),n.isPresenting=!1,t.setPixelRatio(x),t.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(P){r=P,n.isPresenting===!0&&It("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(P){o=P,n.isPresenting===!0&&It("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(P){c=P},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&v&&(h=new XRWebGLBinding(i,e)),h},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(P){if(i=P,i!==null){if(E=t.getRenderTarget(),i.addEventListener("select",B),i.addEventListener("selectstart",B),i.addEventListener("selectend",B),i.addEventListener("squeeze",B),i.addEventListener("squeezestart",B),i.addEventListener("squeezeend",B),i.addEventListener("end",Z),i.addEventListener("inputsourceschange",X),w.xrCompatible!==!0&&await e.makeXRCompatible(),x=t.getPixelRatio(),t.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let $=null,rt=null,ct=null;w.depth&&(ct=w.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,$=w.stencil?Ai:kn,rt=w.stencil?Rs:Tn);const ht={colorFormat:e.RGBA8,depthFormat:ct,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(ht),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),M=new Xe(d.textureWidth,d.textureHeight,{format:dn,type:Ze,depthTexture:new us(d.textureWidth,d.textureHeight,rt,void 0,void 0,void 0,void 0,void 0,void 0,$),stencilBuffer:w.stencil,colorSpace:t.outputColorSpace,samples:w.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const $={antialias:w.antialias,alpha:!0,depth:w.depth,stencil:w.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,$),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Xe(f.framebufferWidth,f.framebufferHeight,{format:dn,type:Ze,colorSpace:t.outputColorSpace,stencilBuffer:w.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Jt.setContext(i),Jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function X(P){for(let q=0;q<P.removed.length;q++){const $=P.removed[q],rt=b.indexOf($);rt>=0&&(b[rt]=null,S[rt].disconnect($))}for(let q=0;q<P.added.length;q++){const $=P.added[q];let rt=b.indexOf($);if(rt===-1){for(let ht=0;ht<S.length;ht++)if(ht>=b.length){b.push($),rt=ht;break}else if(b[ht]===null){b[ht]=$,rt=ht;break}if(rt===-1)break}const ct=S[rt];ct&&ct.connect($)}}const j=new C,it=new C;function pt(P,q,$){j.setFromMatrixPosition(q.matrixWorld),it.setFromMatrixPosition($.matrixWorld);const rt=j.distanceTo(it),ct=q.projectionMatrix.elements,ht=$.projectionMatrix.elements,Xt=ct[14]/(ct[10]-1),Nt=ct[14]/(ct[10]+1),ee=(ct[9]+1)/ct[5],jt=(ct[9]-1)/ct[5],Ft=(ct[8]-1)/ct[0],ae=(ht[8]+1)/ht[0],oe=Xt*Ft,ve=Xt*ae,Ue=rt/(-Ft+ae),me=Ue*-Ft;if(q.matrixWorld.decompose(P.position,P.quaternion,P.scale),P.translateX(me),P.translateZ(Ue),P.matrixWorld.compose(P.position,P.quaternion,P.scale),P.matrixWorldInverse.copy(P.matrixWorld).invert(),ct[10]===-1)P.projectionMatrix.copy(q.projectionMatrix),P.projectionMatrixInverse.copy(q.projectionMatrixInverse);else{const Te=Xt+Ue,U=Nt+Ue,Ke=oe-me,se=ve+(rt-me),A=ee*Nt/U*Te,_=jt*Nt/U*Te;P.projectionMatrix.makePerspective(Ke,se,A,_,Te,U),P.projectionMatrixInverse.copy(P.projectionMatrix).invert()}}function _t(P,q){q===null?P.matrixWorld.copy(P.matrix):P.matrixWorld.multiplyMatrices(q.matrixWorld,P.matrix),P.matrixWorldInverse.copy(P.matrixWorld).invert()}this.updateCamera=function(P){if(i===null)return;let q=P.near,$=P.far;m.texture!==null&&(m.depthNear>0&&(q=m.depthNear),m.depthFar>0&&($=m.depthFar)),F.near=L.near=T.near=q,F.far=L.far=T.far=$,(Y!==F.near||K!==F.far)&&(i.updateRenderState({depthNear:F.near,depthFar:F.far}),Y=F.near,K=F.far),F.layers.mask=P.layers.mask|6,T.layers.mask=F.layers.mask&-5,L.layers.mask=F.layers.mask&-3;const rt=P.parent,ct=F.cameras;_t(F,rt);for(let ht=0;ht<ct.length;ht++)_t(ct[ht],rt);ct.length===2?pt(F,T,L):F.projectionMatrix.copy(T.projectionMatrix),bt(P,F,rt)};function bt(P,q,$){$===null?P.matrix.copy(q.matrixWorld):(P.matrix.copy($.matrixWorld),P.matrix.invert(),P.matrix.multiply(q.matrixWorld)),P.matrix.decompose(P.position,P.quaternion,P.scale),P.updateMatrixWorld(!0),P.projectionMatrix.copy(q.projectionMatrix),P.projectionMatrixInverse.copy(q.projectionMatrixInverse),P.isPerspectiveCamera&&(P.fov=Yi*2*Math.atan(1/P.projectionMatrix.elements[5]),P.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(P){l=P,d!==null&&(d.fixedFoveation=P),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=P)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(P){return g[P]};let Qt=null;function fe(P,q){if(u=q.getViewerPose(c||a),p=q,u!==null){const $=u.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let rt=!1;$.length!==F.cameras.length&&(F.cameras.length=0,rt=!0);for(let Nt=0;Nt<$.length;Nt++){const ee=$[Nt];let jt=null;if(f!==null)jt=f.getViewport(ee);else{const ae=h.getViewSubImage(d,ee);jt=ae.viewport,Nt===0&&(t.setRenderTargetTextures(M,ae.colorTexture,ae.depthStencilTexture),t.setRenderTarget(M))}let Ft=D[Nt];Ft===void 0&&(Ft=new qe,Ft.layers.enable(Nt),Ft.viewport=new pe,D[Nt]=Ft),Ft.matrix.fromArray(ee.transform.matrix),Ft.matrix.decompose(Ft.position,Ft.quaternion,Ft.scale),Ft.projectionMatrix.fromArray(ee.projectionMatrix),Ft.projectionMatrixInverse.copy(Ft.projectionMatrix).invert(),Ft.viewport.set(jt.x,jt.y,jt.width,jt.height),Nt===0&&(F.matrix.copy(Ft.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),rt===!0&&F.cameras.push(Ft)}const ct=i.enabledFeatures;if(ct&&ct.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){h=n.getBinding();const Nt=h.getDepthInformation($[0]);Nt&&Nt.isValid&&Nt.texture&&m.init(Nt,i.renderState)}if(ct&&ct.includes("camera-access")&&v){t.state.unbindTexture(),h=n.getBinding();for(let Nt=0;Nt<$.length;Nt++){const ee=$[Nt].camera;if(ee){let jt=g[ee];jt||(jt=new qc,g[ee]=jt);const Ft=h.getCameraImage(ee);jt.sourceTexture=Ft}}}}for(let $=0;$<S.length;$++){const rt=b[$],ct=S[$];rt!==null&&ct!==void 0&&ct.update(rt,q,c||a)}Qt&&Qt(P,q),q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:q}),p=null}const Jt=new dh;Jt.setAnimationLoop(fe),this.setAnimationLoop=function(P){Qt=P},this.dispose=function(){}}}const A_=new ie,Gh=new zt;Gh.set(-1,0,0,0,1,0,0,0,1);function C_(s,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,eh(s)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,w,E,M){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),h(m,g)):g.isMeshPhongMaterial?(r(m,g),u(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,M)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),v(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?l(m,g,w,E):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===Ge&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===Ge&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const w=t.get(g),E=w.envMap,M=w.envMapRotation;E&&(m.envMap.value=E,m.envMapRotation.value.setFromMatrix4(A_.makeRotationFromEuler(M)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Gh),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,w,E){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*w,m.scale.value=E*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function u(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function h(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,w){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Ge&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=w.texture,m.transmissionSamplerSize.value.set(w.width,w.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function v(m,g){const w=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(w.matrixWorld),m.nearDistance.value=w.shadow.camera.near,m.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function R_(s,t,e,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,S){const b=S.program;n.uniformBlockBinding(M,b)}function c(M,S){let b=i[M.id];b===void 0&&(m(M),b=u(M),i[M.id]=b,M.addEventListener("dispose",w));const R=S.program;n.updateUBOMapping(M,R);const x=t.render.frame;r[M.id]!==x&&(d(M),r[M.id]=x)}function u(M){const S=h();M.__bindingPointIndex=S;const b=s.createBuffer(),R=M.__size,x=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,b),s.bufferData(s.UNIFORM_BUFFER,R,x),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,S,b),b}function h(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return Zt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const S=i[M.id],b=M.uniforms,R=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,S);for(let x=0,T=b.length;x<T;x++){const L=b[x];if(Array.isArray(L))for(let D=0,F=L.length;D<F;D++)f(L[D],x,D,R);else f(L,x,0,R)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,S,b,R){if(v(M,S,b,R)===!0){const x=M.__offset,T=M.value;if(Array.isArray(T)){let L=0;for(let D=0;D<T.length;D++){const F=T[D],Y=g(F);p(F,M.__data,L),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(L+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(T,M.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,x,M.__data)}}function p(M,S,b){typeof M=="number"||typeof M=="boolean"?S[0]=M:M.isMatrix3?(S[0]=M.elements[0],S[1]=M.elements[1],S[2]=M.elements[2],S[3]=0,S[4]=M.elements[3],S[5]=M.elements[4],S[6]=M.elements[5],S[7]=0,S[8]=M.elements[6],S[9]=M.elements[7],S[10]=M.elements[8],S[11]=0):ArrayBuffer.isView(M)?S.set(new M.constructor(M.buffer,M.byteOffset,S.length)):M.toArray(S,b)}function v(M,S,b,R){const x=M.value,T=S+"_"+b;if(R[T]===void 0)return typeof x=="number"||typeof x=="boolean"?R[T]=x:ArrayBuffer.isView(x)?R[T]=x.slice():R[T]=x.clone(),!0;{const L=R[T];if(typeof x=="number"||typeof x=="boolean"){if(L!==x)return R[T]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(L.equals(x)===!1)return L.copy(x),!0}}return!1}function m(M){const S=M.uniforms;let b=0;const R=16;for(let T=0,L=S.length;T<L;T++){const D=Array.isArray(S[T])?S[T]:[S[T]];for(let F=0,Y=D.length;F<Y;F++){const K=D[F],B=Array.isArray(K.value)?K.value:[K.value];for(let Z=0,X=B.length;Z<X;Z++){const j=B[Z],it=g(j),pt=b%R,_t=pt%it.boundary,bt=pt+_t;b+=_t,bt!==0&&R-bt<it.storage&&(b+=R-bt),K.__data=new Float32Array(it.storage/Float32Array.BYTES_PER_ELEMENT),K.__offset=b,b+=it.storage}}}const x=b%R;return x>0&&(b+=R-x),M.__size=b,M.__cache={},this}function g(M){const S={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(S.boundary=4,S.storage=4):M.isVector2?(S.boundary=8,S.storage=8):M.isVector3||M.isColor?(S.boundary=16,S.storage=12):M.isVector4?(S.boundary=16,S.storage=16):M.isMatrix3?(S.boundary=48,S.storage=48):M.isMatrix4?(S.boundary=64,S.storage=64):M.isTexture?It("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(S.boundary=16,S.storage=M.byteLength):It("WebGLRenderer: Unsupported uniform value type.",M),S}function w(M){const S=M.target;S.removeEventListener("dispose",w);const b=a.indexOf(S.__bindingPointIndex);a.splice(b,1),s.deleteBuffer(i[S.id]),delete i[S.id],delete r[S.id]}function E(){for(const M in i)s.deleteBuffer(i[M]);a=[],i={},r={}}return{bind:l,update:c,dispose:E}}const P_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ln=null;function L_(){return Ln===null&&(Ln=new kc(P_,16,16,Ci,Je),Ln.name="DFG_LUT",Ln.minFilter=Ne,Ln.magFilter=Ne,Ln.wrapS=On,Ln.wrapT=On,Ln.generateMipmaps=!1,Ln.needsUpdate=!0),Ln}class D_{constructor(t={}){const{canvas:e=Yd(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Ze}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const v=f,m=new Set([Wa,Va,Ga]),g=new Set([Ze,Tn,Cs,Rs,Ba,za]),w=new Uint32Array(4),E=new Int32Array(4),M=new C;let S=null,b=null;const R=[],x=[];let T=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=En,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let D=!1,F=null,Y=null,K=null,B=null;this._outputColorSpace=Se;let Z=0,X=0,j=null,it=-1,pt=null;const _t=new pe,bt=new pe;let Qt=null;const fe=new Ot(0);let Jt=0,P=e.width,q=e.height,$=1,rt=null,ct=null;const ht=new pe(0,0,P,q),Xt=new pe(0,0,P,q);let Nt=!1;const ee=new kr;let jt=!1,Ft=!1;const ae=new ie,oe=new C,ve=new pe,Ue={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let me=!1;function Te(){return j===null?$:1}let U=n;function Ke(y,O){return e.getContext(y,O)}try{const y={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${xa}`),e.addEventListener("webglcontextlost",ge,!1),e.addEventListener("webglcontextrestored",ue,!1),e.addEventListener("webglcontextcreationerror",In,!1),U===null){const O="webgl2";if(U=Ke(O,y),U===null)throw Ke(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(y){throw Zt("WebGLRenderer: "+y.message),y}let se,A,_,k,V,J,st,ot,Q,et,ut,At,gt,dt,Lt,Ut,Ht,N,at,tt,ft,Mt,nt;function Tt(){se=new Lg(U),se.init(),ft=new S_(U,se),A=new bg(U,se,t,ft),_=new M_(U,se),A.reversedDepthBuffer&&d&&_.buffers.depth.setReversed(!0),Y=U.createFramebuffer(),K=U.createFramebuffer(),B=U.createFramebuffer(),k=new Ng(U),V=new a_,J=new y_(U,se,_,V,A,ft,k),st=new Pg(L),ot=new xp(U),Mt=new yg(U,ot),Q=new Dg(U,ot,k,Mt),et=new Fg(U,Q,ot,Mt,k),N=new Ug(U,A,J),Lt=new wg(V),ut=new r_(L,st,se,A,Mt,Lt),At=new C_(L,V),gt=new l_,dt=new p_(se),Ht=new Mg(L,st,_,et,p,l),Ut=new v_(L,et,A),nt=new R_(U,k,A,_),at=new Sg(U,se,k),tt=new Ig(U,se,k),k.programs=ut.programs,L.capabilities=A,L.extensions=se,L.properties=V,L.renderLists=gt,L.shadowMap=Ut,L.state=_,L.info=k}Tt(),v!==Ze&&(T=new kg(v,e.width,e.height,o,i,r));const wt=new T_(L,U);this.xr=wt,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const y=se.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=se.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(y){y!==void 0&&($=y,this.setSize(P,q,!1))},this.getSize=function(y){return y.set(P,q)},this.setSize=function(y,O,W=!0){if(wt.isPresenting){It("WebGLRenderer: Can't change size while VR device is presenting.");return}P=y,q=O,e.width=Math.floor(y*$),e.height=Math.floor(O*$),W===!0&&(e.style.width=y+"px",e.style.height=O+"px"),T!==null&&T.setSize(e.width,e.height),this.setViewport(0,0,y,O)},this.getDrawingBufferSize=function(y){return y.set(P*$,q*$).floor()},this.setDrawingBufferSize=function(y,O,W){P=y,q=O,$=W,e.width=Math.floor(y*W),e.height=Math.floor(O*W),this.setViewport(0,0,y,O)},this.setEffects=function(y){if(v===Ze){Zt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let O=0;O<y.length;O++)if(y[O].isOutputPass===!0){It("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(_t)},this.getViewport=function(y){return y.copy(ht)},this.setViewport=function(y,O,W,z){y.isVector4?ht.set(y.x,y.y,y.z,y.w):ht.set(y,O,W,z),_.viewport(_t.copy(ht).multiplyScalar($).round())},this.getScissor=function(y){return y.copy(Xt)},this.setScissor=function(y,O,W,z){y.isVector4?Xt.set(y.x,y.y,y.z,y.w):Xt.set(y,O,W,z),_.scissor(bt.copy(Xt).multiplyScalar($).round())},this.getScissorTest=function(){return Nt},this.setScissorTest=function(y){_.setScissorTest(Nt=y)},this.setOpaqueSort=function(y){rt=y},this.setTransparentSort=function(y){ct=y},this.getClearColor=function(y){return y.copy(Ht.getClearColor())},this.setClearColor=function(){Ht.setClearColor(...arguments)},this.getClearAlpha=function(){return Ht.getClearAlpha()},this.setClearAlpha=function(){Ht.setClearAlpha(...arguments)},this.clear=function(y=!0,O=!0,W=!0){let z=0;if(y){let H=!1;if(j!==null){const vt=j.texture.format;H=m.has(vt)}if(H){const vt=j.texture.type,St=g.has(vt),xt=Ht.getClearColor(),Et=Ht.getClearAlpha(),Ct=xt.r,Gt=xt.g,Yt=xt.b;St?(w[0]=Ct,w[1]=Gt,w[2]=Yt,w[3]=Et,U.clearBufferuiv(U.COLOR,0,w)):(E[0]=Ct,E[1]=Gt,E[2]=Yt,E[3]=Et,U.clearBufferiv(U.COLOR,0,E))}else z|=U.COLOR_BUFFER_BIT}O&&(z|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(z|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&U.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),F=y},this.dispose=function(){e.removeEventListener("webglcontextlost",ge,!1),e.removeEventListener("webglcontextrestored",ue,!1),e.removeEventListener("webglcontextcreationerror",In,!1),Ht.dispose(),gt.dispose(),dt.dispose(),V.dispose(),st.dispose(),et.dispose(),Mt.dispose(),nt.dispose(),ut.dispose(),wt.dispose(),wt.removeEventListener("sessionstart",Ru),wt.removeEventListener("sessionend",Pu),Oi.stop()};function ge(y){y.preventDefault(),_c("WebGLRenderer: Context Lost."),D=!0}function ue(){_c("WebGLRenderer: Context Restored."),D=!1;const y=k.autoReset,O=Ut.enabled,W=Ut.autoUpdate,z=Ut.needsUpdate,H=Ut.type;Tt(),k.autoReset=y,Ut.enabled=O,Ut.autoUpdate=W,Ut.needsUpdate=z,Ut.type=H}function In(y){Zt("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Nn(y){const O=y.target;O.removeEventListener("dispose",Nn),lv(O)}function lv(y){cv(y),V.remove(y)}function cv(y){const O=V.get(y).programs;O!==void 0&&(O.forEach(function(W){ut.releaseProgram(W)}),y.isShaderMaterial&&ut.releaseShaderCache(y))}this.renderBufferDirect=function(y,O,W,z,H,vt){O===null&&(O=Ue);const St=H.isMesh&&H.matrixWorld.determinantAffine()<0,xt=dv(y,O,W,z,H);_.setMaterial(z,St);let Et=W.index,Ct=1;if(z.wireframe===!0){if(Et=Q.getWireframeAttribute(W),Et===void 0)return;Ct=2}const Gt=W.drawRange,Yt=W.attributes.position;let Rt=Gt.start*Ct,le=(Gt.start+Gt.count)*Ct;vt!==null&&(Rt=Math.max(Rt,vt.start*Ct),le=Math.min(le,(vt.start+vt.count)*Ct)),Et!==null?(Rt=Math.max(Rt,0),le=Math.min(le,Et.count)):Yt!=null&&(Rt=Math.max(Rt,0),le=Math.min(le,Yt.count));const Me=le-Rt;if(Me<0||Me===1/0)return;Mt.setup(H,z,xt,W,Et);let _e,ce=at;if(Et!==null&&(_e=ot.get(Et),ce=tt,ce.setIndex(_e)),H.isMesh)z.wireframe===!0?(_.setLineWidth(z.wireframeLinewidth*Te()),ce.setMode(U.LINES)):ce.setMode(U.TRIANGLES);else if(H.isLine){let ze=z.linewidth;ze===void 0&&(ze=1),_.setLineWidth(ze*Te()),H.isLineSegments?ce.setMode(U.LINES):H.isLineLoop?ce.setMode(U.LINE_LOOP):ce.setMode(U.LINE_STRIP)}else H.isPoints?ce.setMode(U.POINTS):H.isSprite&&ce.setMode(U.TRIANGLES);if(H.isBatchedMesh)if(se.get("WEBGL_multi_draw"))ce.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const ze=H._multiDrawStarts,yt=H._multiDrawCounts,en=H._multiDrawCount,te=Et?ot.get(Et).bytesPerElement:1,cn=V.get(z).currentProgram.getUniforms();for(let Un=0;Un<en;Un++)cn.setValue(U,"_gl_DrawID",Un),ce.render(ze[Un]/te,yt[Un])}else if(H.isInstancedMesh)ce.renderInstances(Rt,Me,H.count);else if(W.isInstancedBufferGeometry){const ze=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,yt=Math.min(W.instanceCount,ze);ce.renderInstances(Rt,Me,yt)}else ce.render(Rt,Me)};function Cu(y,O,W){y.transparent===!0&&y.side===Fn&&y.forceSinglePass===!1?(y.side=Ge,y.needsUpdate=!0,aa(y,O,W),y.side=jn,y.needsUpdate=!0,aa(y,O,W),y.side=Fn):aa(y,O,W)}this.compile=function(y,O,W=null){W===null&&(W=y),b=dt.get(W),b.init(O),x.push(b),W.traverseVisible(function(H){H.isLight&&H.layers.test(O.layers)&&(b.pushLight(H),H.castShadow&&b.pushShadow(H))}),y!==W&&y.traverseVisible(function(H){H.isLight&&H.layers.test(O.layers)&&(b.pushLight(H),H.castShadow&&b.pushShadow(H))}),b.setupLights();const z=new Set;return y.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const vt=H.material;if(vt)if(Array.isArray(vt))for(let St=0;St<vt.length;St++){const xt=vt[St];Cu(xt,W,H),z.add(xt)}else Cu(vt,W,H),z.add(vt)}),b=x.pop(),z},this.compileAsync=function(y,O,W=null){const z=this.compile(y,O,W);return new Promise(H=>{function vt(){if(z.forEach(function(St){V.get(St).currentProgram.isReady()&&z.delete(St)}),z.size===0){H(y);return}setTimeout(vt,10)}se.get("KHR_parallel_shader_compile")!==null?vt():setTimeout(vt,10)})};let Hl=null;function hv(y){Hl&&Hl(y)}function Ru(){Oi.stop()}function Pu(){Oi.start()}const Oi=new dh;Oi.setAnimationLoop(hv),typeof self<"u"&&Oi.setContext(self),this.setAnimationLoop=function(y){Hl=y,wt.setAnimationLoop(y),y===null?Oi.stop():Oi.start()},wt.addEventListener("sessionstart",Ru),wt.addEventListener("sessionend",Pu),this.render=function(y,O){if(O!==void 0&&O.isCamera!==!0){Zt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;F!==null&&F.renderStart(y,O);const W=wt.enabled===!0&&wt.isPresenting===!0,z=T!==null&&(j===null||W)&&T.begin(L,j);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),wt.enabled===!0&&wt.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(wt.cameraAutoUpdate===!0&&wt.updateCamera(O),O=wt.getCamera()),y.isScene===!0&&y.onBeforeRender(L,y,O,j),b=dt.get(y,x.length),b.init(O),b.state.textureUnits=J.getTextureUnits(),x.push(b),ae.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),ee.setFromProjectionMatrix(ae,An,O.reversedDepth),Ft=this.localClippingEnabled,jt=Lt.init(this.clippingPlanes,Ft),S=gt.get(y,R.length),S.init(),R.push(S),wt.enabled===!0&&wt.isPresenting===!0){const St=L.xr.getDepthSensingMesh();St!==null&&Gl(St,O,-1/0,L.sortObjects)}Gl(y,O,0,L.sortObjects),S.finish(),L.sortObjects===!0&&S.sort(rt,ct,O.reversedDepth),me=wt.enabled===!1||wt.isPresenting===!1||wt.hasDepthSensing()===!1,me&&Ht.addToRenderList(S,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),jt===!0&&Lt.beginShadows();const H=b.state.shadowsArray;if(Ut.render(H,y,O),jt===!0&&Lt.endShadows(),(z&&T.hasRenderPass())===!1){const St=S.opaque,xt=S.transmissive;if(b.setupLights(),O.isArrayCamera){const Et=O.cameras;if(xt.length>0)for(let Ct=0,Gt=Et.length;Ct<Gt;Ct++){const Yt=Et[Ct];Du(St,xt,y,Yt)}me&&Ht.render(y);for(let Ct=0,Gt=Et.length;Ct<Gt;Ct++){const Yt=Et[Ct];Lu(S,y,Yt,Yt.viewport)}}else xt.length>0&&Du(St,xt,y,O),me&&Ht.render(y),Lu(S,y,O)}j!==null&&X===0&&(J.updateMultisampleRenderTarget(j),J.updateRenderTargetMipmap(j)),z&&T.end(L),y.isScene===!0&&y.onAfterRender(L,y,O),Mt.resetDefaultState(),it=-1,pt=null,x.pop(),x.length>0?(b=x[x.length-1],J.setTextureUnits(b.state.textureUnits),jt===!0&&Lt.setGlobalState(L.clippingPlanes,b.state.camera)):b=null,R.pop(),R.length>0?S=R[R.length-1]:S=null,F!==null&&F.renderEnd()};function Gl(y,O,W,z){if(y.visible===!1)return;if(y.layers.test(O.layers)){if(y.isGroup)W=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(O);else if(y.isLightProbeGrid)b.pushLightProbeGrid(y);else if(y.isLight)b.pushLight(y),y.castShadow&&b.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||ee.intersectsSprite(y)){z&&ve.setFromMatrixPosition(y.matrixWorld).applyMatrix4(ae);const St=et.update(y),xt=y.material;xt.visible&&S.push(y,St,xt,W,ve.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||ee.intersectsObject(y))){const St=et.update(y),xt=y.material;if(z&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),ve.copy(y.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),ve.copy(St.boundingSphere.center)),ve.applyMatrix4(y.matrixWorld).applyMatrix4(ae)),Array.isArray(xt)){const Et=St.groups;for(let Ct=0,Gt=Et.length;Ct<Gt;Ct++){const Yt=Et[Ct],Rt=xt[Yt.materialIndex];Rt&&Rt.visible&&S.push(y,St,Rt,W,ve.z,Yt)}}else xt.visible&&S.push(y,St,xt,W,ve.z,null)}}const vt=y.children;for(let St=0,xt=vt.length;St<xt;St++)Gl(vt[St],O,W,z)}function Lu(y,O,W,z){const{opaque:H,transmissive:vt,transparent:St}=y;b.setupLightsView(W),jt===!0&&Lt.setGlobalState(L.clippingPlanes,W),z&&_.viewport(_t.copy(z)),H.length>0&&ra(H,O,W),vt.length>0&&ra(vt,O,W),St.length>0&&ra(St,O,W),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Du(y,O,W,z){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[z.id]===void 0){const Rt=se.has("EXT_color_buffer_half_float")||se.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[z.id]=new Xe(1,1,{generateMipmaps:!0,type:Rt?Je:Ze,minFilter:Ti,samples:Math.max(4,A.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Kt.workingColorSpace})}const vt=b.state.transmissionRenderTarget[z.id],St=z.viewport||_t;vt.setSize(St.z*L.transmissionResolutionScale,St.w*L.transmissionResolutionScale);const xt=L.getRenderTarget(),Et=L.getActiveCubeFace(),Ct=L.getActiveMipmapLevel();L.setRenderTarget(vt),L.getClearColor(fe),Jt=L.getClearAlpha(),Jt<1&&L.setClearColor(16777215,.5),L.clear(),me&&Ht.render(W);const Gt=L.toneMapping;L.toneMapping=En;const Yt=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),b.setupLightsView(z),jt===!0&&Lt.setGlobalState(L.clippingPlanes,z),ra(y,W,z),J.updateMultisampleRenderTarget(vt),J.updateRenderTargetMipmap(vt),se.has("WEBGL_multisampled_render_to_texture")===!1){let Rt=!1;for(let le=0,Me=O.length;le<Me;le++){const _e=O[le],{object:ce,geometry:ze,material:yt,group:en}=_e;if(yt.side===Fn&&ce.layers.test(z.layers)){const te=yt.side;yt.side=Ge,yt.needsUpdate=!0,Iu(ce,W,z,ze,yt,en),yt.side=te,yt.needsUpdate=!0,Rt=!0}}Rt===!0&&(J.updateMultisampleRenderTarget(vt),J.updateRenderTargetMipmap(vt))}L.setRenderTarget(xt,Et,Ct),L.setClearColor(fe,Jt),Yt!==void 0&&(z.viewport=Yt),L.toneMapping=Gt}function ra(y,O,W){const z=O.isScene===!0?O.overrideMaterial:null;for(let H=0,vt=y.length;H<vt;H++){const St=y[H],{object:xt,geometry:Et,group:Ct}=St;let Gt=St.material;Gt.allowOverride===!0&&z!==null&&(Gt=z),xt.layers.test(W.layers)&&Iu(xt,O,W,Et,Gt,Ct)}}function Iu(y,O,W,z,H,vt){y.onBeforeRender(L,O,W,z,H,vt),y.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),H.onBeforeRender(L,O,W,z,y,vt),H.transparent===!0&&H.side===Fn&&H.forceSinglePass===!1?(H.side=Ge,H.needsUpdate=!0,L.renderBufferDirect(W,O,z,H,y,vt),H.side=jn,H.needsUpdate=!0,L.renderBufferDirect(W,O,z,H,y,vt),H.side=Fn):L.renderBufferDirect(W,O,z,H,y,vt),y.onAfterRender(L,O,W,z,H,vt)}function aa(y,O,W){O.isScene!==!0&&(O=Ue);const z=V.get(y),H=b.state.lights,vt=b.state.shadowsArray,St=H.state.version,xt=ut.getParameters(y,H.state,vt,O,W,b.state.lightProbeGridArray),Et=ut.getProgramCacheKey(xt);let Ct=z.programs;z.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?O.environment:null,z.fog=O.fog;const Gt=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;z.envMap=st.get(y.envMap||z.environment,Gt),z.envMapRotation=z.environment!==null&&y.envMap===null?O.environmentRotation:y.envMapRotation,Ct===void 0&&(y.addEventListener("dispose",Nn),Ct=new Map,z.programs=Ct);let Yt=Ct.get(Et);if(Yt!==void 0){if(z.currentProgram===Yt&&z.lightsStateVersion===St)return Uu(y,xt),Yt}else xt.uniforms=ut.getUniforms(y),F!==null&&y.isNodeMaterial&&F.build(y,W,xt),y.onBeforeCompile(xt,L),Yt=ut.acquireProgram(xt,Et),Ct.set(Et,Yt),z.uniforms=xt.uniforms;const Rt=z.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Rt.clippingPlanes=Lt.uniform),Uu(y,xt),z.needsLights=pv(y),z.lightsStateVersion=St,z.needsLights&&(Rt.ambientLightColor.value=H.state.ambient,Rt.lightProbe.value=H.state.probe,Rt.directionalLights.value=H.state.directional,Rt.directionalLightShadows.value=H.state.directionalShadow,Rt.spotLights.value=H.state.spot,Rt.spotLightShadows.value=H.state.spotShadow,Rt.rectAreaLights.value=H.state.rectArea,Rt.ltc_1.value=H.state.rectAreaLTC1,Rt.ltc_2.value=H.state.rectAreaLTC2,Rt.pointLights.value=H.state.point,Rt.pointLightShadows.value=H.state.pointShadow,Rt.hemisphereLights.value=H.state.hemi,Rt.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Rt.spotLightMatrix.value=H.state.spotLightMatrix,Rt.spotLightMap.value=H.state.spotLightMap,Rt.pointShadowMatrix.value=H.state.pointShadowMatrix),z.lightProbeGrid=b.state.lightProbeGridArray.length>0,z.currentProgram=Yt,z.uniformsList=null,Yt}function Nu(y){if(y.uniformsList===null){const O=y.currentProgram.getUniforms();y.uniformsList=Zr.seqWithValue(O.seq,y.uniforms)}return y.uniformsList}function Uu(y,O){const W=V.get(y);W.outputColorSpace=O.outputColorSpace,W.batching=O.batching,W.batchingColor=O.batchingColor,W.instancing=O.instancing,W.instancingColor=O.instancingColor,W.instancingMorph=O.instancingMorph,W.skinning=O.skinning,W.morphTargets=O.morphTargets,W.morphNormals=O.morphNormals,W.morphColors=O.morphColors,W.morphTargetsCount=O.morphTargetsCount,W.numClippingPlanes=O.numClippingPlanes,W.numIntersection=O.numClipIntersection,W.vertexAlphas=O.vertexAlphas,W.vertexTangents=O.vertexTangents,W.toneMapping=O.toneMapping}function uv(y,O){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;M.setFromMatrixPosition(O.matrixWorld);for(let W=0,z=y.length;W<z;W++){const H=y[W];if(H.texture!==null&&H.boundingBox.containsPoint(M))return H}return null}function dv(y,O,W,z,H){O.isScene!==!0&&(O=Ue),J.resetTextureUnits();const vt=O.fog,St=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?O.environment:null,xt=j===null?L.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Kt.workingColorSpace,Et=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,Ct=st.get(z.envMap||St,Et),Gt=z.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Yt=!!W.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Rt=!!W.morphAttributes.position,le=!!W.morphAttributes.normal,Me=!!W.morphAttributes.color;let _e=En;z.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(_e=L.toneMapping);const ce=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ze=ce!==void 0?ce.length:0,yt=V.get(z),en=b.state.lights;if(jt===!0&&(Ft===!0||y!==pt)){const de=y===pt&&z.id===it;Lt.setState(z,y,de)}let te=!1;z.version===yt.__version?(yt.needsLights&&yt.lightsStateVersion!==en.state.version||yt.outputColorSpace!==xt||H.isBatchedMesh&&yt.batching===!1||!H.isBatchedMesh&&yt.batching===!0||H.isBatchedMesh&&yt.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&yt.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&yt.instancing===!1||!H.isInstancedMesh&&yt.instancing===!0||H.isSkinnedMesh&&yt.skinning===!1||!H.isSkinnedMesh&&yt.skinning===!0||H.isInstancedMesh&&yt.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&yt.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&yt.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&yt.instancingMorph===!1&&H.morphTexture!==null||yt.envMap!==Ct||z.fog===!0&&yt.fog!==vt||yt.numClippingPlanes!==void 0&&(yt.numClippingPlanes!==Lt.numPlanes||yt.numIntersection!==Lt.numIntersection)||yt.vertexAlphas!==Gt||yt.vertexTangents!==Yt||yt.morphTargets!==Rt||yt.morphNormals!==le||yt.morphColors!==Me||yt.toneMapping!==_e||yt.morphTargetsCount!==ze||!!yt.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(te=!0):(te=!0,yt.__version=z.version);let cn=yt.currentProgram;te===!0&&(cn=aa(z,O,H),F&&z.isNodeMaterial&&F.onUpdateProgram(z,cn,yt));let Un=!1,mi=!1,Ss=!1;const he=cn.getUniforms(),ye=yt.uniforms;if(_.useProgram(cn.program)&&(Un=!0,mi=!0,Ss=!0),z.id!==it&&(it=z.id,mi=!0),yt.needsLights){const de=uv(b.state.lightProbeGridArray,H);yt.lightProbeGrid!==de&&(yt.lightProbeGrid=de,mi=!0)}if(Un||pt!==y){_.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),he.setValue(U,"projectionMatrix",y.projectionMatrix),he.setValue(U,"viewMatrix",y.matrixWorldInverse);const _i=he.map.cameraPosition;_i!==void 0&&_i.setValue(U,oe.setFromMatrixPosition(y.matrixWorld)),A.logarithmicDepthBuffer&&he.setValue(U,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&he.setValue(U,"isOrthographic",y.isOrthographicCamera===!0),pt!==y&&(pt=y,mi=!0,Ss=!0)}if(yt.needsLights&&(en.state.directionalShadowMap.length>0&&he.setValue(U,"directionalShadowMap",en.state.directionalShadowMap,J),en.state.spotShadowMap.length>0&&he.setValue(U,"spotShadowMap",en.state.spotShadowMap,J),en.state.pointShadowMap.length>0&&he.setValue(U,"pointShadowMap",en.state.pointShadowMap,J)),H.isSkinnedMesh){he.setOptional(U,H,"bindMatrix"),he.setOptional(U,H,"bindMatrixInverse");const de=H.skeleton;de&&(de.boneTexture===null&&de.computeBoneTexture(),he.setValue(U,"boneTexture",de.boneTexture,J))}H.isBatchedMesh&&(he.setOptional(U,H,"batchingTexture"),he.setValue(U,"batchingTexture",H._matricesTexture,J),he.setOptional(U,H,"batchingIdTexture"),he.setValue(U,"batchingIdTexture",H._indirectTexture,J),he.setOptional(U,H,"batchingColorTexture"),H._colorsTexture!==null&&he.setValue(U,"batchingColorTexture",H._colorsTexture,J));const gi=W.morphAttributes;if((gi.position!==void 0||gi.normal!==void 0||gi.color!==void 0)&&N.update(H,W,cn),(mi||yt.receiveShadow!==H.receiveShadow)&&(yt.receiveShadow=H.receiveShadow,he.setValue(U,"receiveShadow",H.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&O.environment!==null&&(ye.envMapIntensity.value=O.environmentIntensity),ye.dfgLUT!==void 0&&(ye.dfgLUT.value=L_()),mi){if(he.setValue(U,"toneMappingExposure",L.toneMappingExposure),yt.needsLights&&fv(ye,Ss),vt&&z.fog===!0&&At.refreshFogUniforms(ye,vt),At.refreshMaterialUniforms(ye,z,$,q,b.state.transmissionRenderTarget[y.id]),yt.needsLights&&yt.lightProbeGrid){const de=yt.lightProbeGrid;ye.probesSH.value=de.texture,ye.probesMin.value.copy(de.boundingBox.min),ye.probesMax.value.copy(de.boundingBox.max),ye.probesResolution.value.copy(de.resolution)}Zr.upload(U,Nu(yt),ye,J)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(Zr.upload(U,Nu(yt),ye,J),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&he.setValue(U,"center",H.center),he.setValue(U,"modelViewMatrix",H.modelViewMatrix),he.setValue(U,"normalMatrix",H.normalMatrix),he.setValue(U,"modelMatrix",H.matrixWorld),z.uniformsGroups!==void 0){const de=z.uniformsGroups;for(let _i=0,bs=de.length;_i<bs;_i++){const Fu=de[_i];nt.update(Fu,cn),nt.bind(Fu,cn)}}return cn}function fv(y,O){y.ambientLightColor.needsUpdate=O,y.lightProbe.needsUpdate=O,y.directionalLights.needsUpdate=O,y.directionalLightShadows.needsUpdate=O,y.pointLights.needsUpdate=O,y.pointLightShadows.needsUpdate=O,y.spotLights.needsUpdate=O,y.spotLightShadows.needsUpdate=O,y.rectAreaLights.needsUpdate=O,y.hemisphereLights.needsUpdate=O}function pv(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return j},this.setRenderTargetTextures=function(y,O,W){const z=V.get(y);z.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),V.get(y.texture).__webglTexture=O,V.get(y.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:W,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,O){const W=V.get(y);W.__webglFramebuffer=O,W.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(y,O=0,W=0){j=y,Z=O,X=W;let z=null,H=!1,vt=!1;if(y){const xt=V.get(y);if(xt.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(U.FRAMEBUFFER,xt.__webglFramebuffer),_t.copy(y.viewport),bt.copy(y.scissor),Qt=y.scissorTest,_.viewport(_t),_.scissor(bt),_.setScissorTest(Qt),it=-1;return}else if(xt.__webglFramebuffer===void 0)J.setupRenderTarget(y);else if(xt.__hasExternalTextures)J.rebindTextures(y,V.get(y.texture).__webglTexture,V.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Gt=y.depthTexture;if(xt.__boundDepthTexture!==Gt){if(Gt!==null&&V.has(Gt)&&(y.width!==Gt.image.width||y.height!==Gt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");J.setupDepthRenderbuffer(y)}}const Et=y.texture;(Et.isData3DTexture||Et.isDataArrayTexture||Et.isCompressedArrayTexture)&&(vt=!0);const Ct=V.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ct[O])?z=Ct[O][W]:z=Ct[O],H=!0):y.samples>0&&J.useMultisampledRTT(y)===!1?z=V.get(y).__webglMultisampledFramebuffer:Array.isArray(Ct)?z=Ct[W]:z=Ct,_t.copy(y.viewport),bt.copy(y.scissor),Qt=y.scissorTest}else _t.copy(ht).multiplyScalar($).floor(),bt.copy(Xt).multiplyScalar($).floor(),Qt=Nt;if(W!==0&&(z=Y),_.bindFramebuffer(U.FRAMEBUFFER,z)&&_.drawBuffers(y,z),_.viewport(_t),_.scissor(bt),_.setScissorTest(Qt),H){const xt=V.get(y.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+O,xt.__webglTexture,W)}else if(vt){const xt=O;for(let Et=0;Et<y.textures.length;Et++){const Ct=V.get(y.textures[Et]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Et,Ct.__webglTexture,W,xt)}}else if(y!==null&&W!==0){const xt=V.get(y.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,xt.__webglTexture,W)}it=-1},this.readRenderTargetPixels=function(y,O,W,z,H,vt,St,xt=0){if(!(y&&y.isWebGLRenderTarget)){Zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Et=V.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&St!==void 0&&(Et=Et[St]),Et){_.bindFramebuffer(U.FRAMEBUFFER,Et);try{const Ct=y.textures[xt],Gt=Ct.format,Yt=Ct.type;if(y.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+xt),!A.textureFormatReadable(Gt)){Zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!A.textureTypeReadable(Yt)){Zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=y.width-z&&W>=0&&W<=y.height-H&&U.readPixels(O,W,z,H,ft.convert(Gt),ft.convert(Yt),vt)}finally{const Ct=j!==null?V.get(j).__webglFramebuffer:null;_.bindFramebuffer(U.FRAMEBUFFER,Ct)}}},this.readRenderTargetPixelsAsync=async function(y,O,W,z,H,vt,St,xt=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Et=V.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&St!==void 0&&(Et=Et[St]),Et)if(O>=0&&O<=y.width-z&&W>=0&&W<=y.height-H){_.bindFramebuffer(U.FRAMEBUFFER,Et);const Ct=y.textures[xt],Gt=Ct.format,Yt=Ct.type;if(y.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+xt),!A.textureFormatReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!A.textureTypeReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Rt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Rt),U.bufferData(U.PIXEL_PACK_BUFFER,vt.byteLength,U.STREAM_READ),U.readPixels(O,W,z,H,ft.convert(Gt),ft.convert(Yt),0);const le=j!==null?V.get(j).__webglFramebuffer:null;_.bindFramebuffer(U.FRAMEBUFFER,le);const Me=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Kd(U,Me,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Rt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,vt),U.deleteBuffer(Rt),U.deleteSync(Me),vt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,O=null,W=0){const z=Math.pow(2,-W),H=Math.floor(y.image.width*z),vt=Math.floor(y.image.height*z),St=O!==null?O.x:0,xt=O!==null?O.y:0;J.setTexture2D(y,0),U.copyTexSubImage2D(U.TEXTURE_2D,W,0,0,St,xt,H,vt),_.unbindTexture()},this.copyTextureToTexture=function(y,O,W=null,z=null,H=0,vt=0){let St,xt,Et,Ct,Gt,Yt,Rt,le,Me;const _e=y.isCompressedTexture?y.mipmaps[vt]:y.image;if(W!==null)St=W.max.x-W.min.x,xt=W.max.y-W.min.y,Et=W.isBox3?W.max.z-W.min.z:1,Ct=W.min.x,Gt=W.min.y,Yt=W.isBox3?W.min.z:0;else{const ye=Math.pow(2,-H);St=Math.floor(_e.width*ye),xt=Math.floor(_e.height*ye),y.isDataArrayTexture?Et=_e.depth:y.isData3DTexture?Et=Math.floor(_e.depth*ye):Et=1,Ct=0,Gt=0,Yt=0}z!==null?(Rt=z.x,le=z.y,Me=z.z):(Rt=0,le=0,Me=0);const ce=ft.convert(O.format),ze=ft.convert(O.type);let yt;O.isData3DTexture?(J.setTexture3D(O,0),yt=U.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(J.setTexture2DArray(O,0),yt=U.TEXTURE_2D_ARRAY):(J.setTexture2D(O,0),yt=U.TEXTURE_2D),_.activeTexture(U.TEXTURE0),_.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,O.flipY),_.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),_.pixelStorei(U.UNPACK_ALIGNMENT,O.unpackAlignment);const en=_.getParameter(U.UNPACK_ROW_LENGTH),te=_.getParameter(U.UNPACK_IMAGE_HEIGHT),cn=_.getParameter(U.UNPACK_SKIP_PIXELS),Un=_.getParameter(U.UNPACK_SKIP_ROWS),mi=_.getParameter(U.UNPACK_SKIP_IMAGES);_.pixelStorei(U.UNPACK_ROW_LENGTH,_e.width),_.pixelStorei(U.UNPACK_IMAGE_HEIGHT,_e.height),_.pixelStorei(U.UNPACK_SKIP_PIXELS,Ct),_.pixelStorei(U.UNPACK_SKIP_ROWS,Gt),_.pixelStorei(U.UNPACK_SKIP_IMAGES,Yt);const Ss=y.isDataArrayTexture||y.isData3DTexture,he=O.isDataArrayTexture||O.isData3DTexture;if(y.isDepthTexture){const ye=V.get(y),gi=V.get(O),de=V.get(ye.__renderTarget),_i=V.get(gi.__renderTarget);_.bindFramebuffer(U.READ_FRAMEBUFFER,de.__webglFramebuffer),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,_i.__webglFramebuffer);for(let bs=0;bs<Et;bs++)Ss&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,V.get(y).__webglTexture,H,Yt+bs),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,V.get(O).__webglTexture,vt,Me+bs)),U.blitFramebuffer(Ct,Gt,St,xt,Rt,le,St,xt,U.DEPTH_BUFFER_BIT,U.NEAREST);_.bindFramebuffer(U.READ_FRAMEBUFFER,null),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(H!==0||y.isRenderTargetTexture||V.has(y)){const ye=V.get(y),gi=V.get(O);_.bindFramebuffer(U.READ_FRAMEBUFFER,K),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,B);for(let de=0;de<Et;de++)Ss?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,ye.__webglTexture,H,Yt+de):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ye.__webglTexture,H),he?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,gi.__webglTexture,vt,Me+de):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,gi.__webglTexture,vt),H!==0?U.blitFramebuffer(Ct,Gt,St,xt,Rt,le,St,xt,U.COLOR_BUFFER_BIT,U.NEAREST):he?U.copyTexSubImage3D(yt,vt,Rt,le,Me+de,Ct,Gt,St,xt):U.copyTexSubImage2D(yt,vt,Rt,le,Ct,Gt,St,xt);_.bindFramebuffer(U.READ_FRAMEBUFFER,null),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else he?y.isDataTexture||y.isData3DTexture?U.texSubImage3D(yt,vt,Rt,le,Me,St,xt,Et,ce,ze,_e.data):O.isCompressedArrayTexture?U.compressedTexSubImage3D(yt,vt,Rt,le,Me,St,xt,Et,ce,_e.data):U.texSubImage3D(yt,vt,Rt,le,Me,St,xt,Et,ce,ze,_e):y.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,vt,Rt,le,St,xt,ce,ze,_e.data):y.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,vt,Rt,le,_e.width,_e.height,ce,_e.data):U.texSubImage2D(U.TEXTURE_2D,vt,Rt,le,St,xt,ce,ze,_e);_.pixelStorei(U.UNPACK_ROW_LENGTH,en),_.pixelStorei(U.UNPACK_IMAGE_HEIGHT,te),_.pixelStorei(U.UNPACK_SKIP_PIXELS,cn),_.pixelStorei(U.UNPACK_SKIP_ROWS,Un),_.pixelStorei(U.UNPACK_SKIP_IMAGES,mi),vt===0&&O.generateMipmaps&&U.generateMipmap(yt),_.unbindTexture()},this.initRenderTarget=function(y){V.get(y).__webglFramebuffer===void 0&&J.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?J.setTextureCube(y,0):y.isData3DTexture?J.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?J.setTexture2DArray(y,0):J.setTexture2D(y,0),_.unbindTexture()},this.resetState=function(){Z=0,X=0,j=null,_.reset(),Mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return An}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Kt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Kt._getUnpackColorSpace()}}const Vh={type:"change"},gl={type:"start"},Wh={type:"end"},Qr=new Cr,$h=new oi,I_=Math.cos(70*xr.DEG2RAD),Pe=new C,Ye=2*Math.PI,re={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},_l=1e-6;class N_ extends gp{constructor(t,e=null){super(t,e),this.state=re.NONE,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Hi.ROTATE,MIDDLE:Hi.DOLLY,RIGHT:Hi.PAN},this.touches={ONE:Gi.ROTATE,TWO:Gi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new C,this._lastQuaternion=new Cn,this._lastTargetPosition=new C,this._quat=new Cn().setFromUnitVectors(t.up,new C(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ol,this._sphericalDelta=new ol,this._scale=1,this._panOffset=new C,this._rotateStart=new lt,this._rotateEnd=new lt,this._rotateDelta=new lt,this._panStart=new lt,this._panEnd=new lt,this._panDelta=new lt,this._dollyStart=new lt,this._dollyEnd=new lt,this._dollyDelta=new lt,this._dollyDirection=new C,this._mouse=new lt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=F_.bind(this),this._onPointerDown=U_.bind(this),this._onPointerUp=O_.bind(this),this._onContextMenu=W_.bind(this),this._onMouseWheel=z_.bind(this),this._onKeyDown=H_.bind(this),this._onTouchStart=G_.bind(this),this._onTouchMove=V_.bind(this),this._onMouseDown=k_.bind(this),this._onMouseMove=B_.bind(this),this._interceptControlDown=$_.bind(this),this._interceptControlUp=X_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Vh),this.update(),this.state=re.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){const e=this.object.position;Pe.copy(e).sub(this.target),Pe.applyQuaternion(this._quat),this._spherical.setFromVector3(Pe),this.autoRotate&&this.state===re.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=Ye:n>Math.PI&&(n-=Ye),i<-Math.PI?i+=Ye:i>Math.PI&&(i-=Ye),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Pe.setFromSpherical(this._spherical),Pe.applyQuaternion(this._quatInverse),e.copy(this.target).add(Pe),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Pe.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new C(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new C(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Pe.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Qr.origin.copy(this.object.position),Qr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Qr.direction))<I_?this.object.lookAt(this.target):($h.setFromNormalAndCoplanarPoint(this.object.up,this.target),Qr.intersectPlane($h,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>_l||8*(1-this._lastQuaternion.dot(this.object.quaternion))>_l||this._lastTargetPosition.distanceToSquared(this.target)>_l?(this.dispatchEvent(Vh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Ye/60*this.autoRotateSpeed*t:Ye/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Pe.setFromMatrixColumn(e,0),Pe.multiplyScalar(-t),this._panOffset.add(Pe)}_panUp(t,e){this.screenSpacePanning===!0?Pe.setFromMatrixColumn(e,1):(Pe.setFromMatrixColumn(e,0),Pe.crossVectors(this.object.up,Pe)),Pe.multiplyScalar(t),this._panOffset.add(Pe)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const i=this.object.position;Pe.copy(i).sub(this.target);let r=Pe.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),i=t-n.left,r=e-n.top,a=n.width,o=n.height;this._mouse.x=i/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Ye*this._rotateDelta.x/e.clientHeight),this._rotateUp(Ye*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Ye*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Ye*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Ye*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Ye*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panStart.set(n,i)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(i,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Ye*this._rotateDelta.x/e.clientHeight),this._rotateUp(Ye*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new lt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function U_(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function F_(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function O_(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Wh),this.state=re.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function k_(s){let t;switch(s.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Hi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=re.DOLLY;break;case Hi.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=re.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=re.ROTATE}break;case Hi.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=re.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=re.PAN}break;default:this.state=re.NONE}this.state!==re.NONE&&this.dispatchEvent(gl)}function B_(s){switch(this.state){case re.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case re.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case re.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function z_(s){this.enabled===!1||this.enableZoom===!1||this.state!==re.NONE||(s.preventDefault(),this.dispatchEvent(gl),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(Wh))}function H_(s){this.enabled!==!1&&this._handleKeyDown(s)}function G_(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case Gi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=re.TOUCH_ROTATE;break;case Gi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=re.TOUCH_PAN;break;default:this.state=re.NONE}break;case 2:switch(this.touches.TWO){case Gi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=re.TOUCH_DOLLY_PAN;break;case Gi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=re.TOUCH_DOLLY_ROTATE;break;default:this.state=re.NONE}break;default:this.state=re.NONE}this.state!==re.NONE&&this.dispatchEvent(gl)}function V_(s){switch(this._trackPointer(s),this.state){case re.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case re.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case re.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case re.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=re.NONE}}function W_(s){this.enabled!==!1&&s.preventDefault()}function $_(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function X_(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Ks=new C;function on(s,t,e,n,i,r){const a=2*Math.PI*i/4,o=Math.max(r-2*i,0),l=Math.PI/4;Ks.copy(t),Ks[n]=0,Ks.normalize();const c=.5*a/(a+o),u=1-Ks.angleTo(s)/l;return Math.sign(Ks[e])===1?u*c:o/(a+o)+c+c*(1-u)}class Dn extends tn{constructor(t=1,e=1,n=1,i=2,r=.1){const a=i*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:i,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new C,c=new C,u=new C(t,e,n).divideScalar(2).subScalar(r),h=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=h.length/6,v=new C,m=.5/a;for(let g=0,w=0;g<h.length;g+=3,w+=2)switch(l.fromArray(h,g),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),h[g+0]=u.x*Math.sign(l.x)+c.x*r,h[g+1]=u.y*Math.sign(l.y)+c.y*r,h[g+2]=u.z*Math.sign(l.z)+c.z*r,d[g+0]=c.x,d[g+1]=c.y,d[g+2]=c.z,Math.floor(g/p)){case 0:v.set(1,0,0),f[w+0]=on(v,c,"z","y",r,n),f[w+1]=1-on(v,c,"y","z",r,e);break;case 1:v.set(-1,0,0),f[w+0]=1-on(v,c,"z","y",r,n),f[w+1]=1-on(v,c,"y","z",r,e);break;case 2:v.set(0,1,0),f[w+0]=1-on(v,c,"x","z",r,t),f[w+1]=on(v,c,"z","x",r,n);break;case 3:v.set(0,-1,0),f[w+0]=1-on(v,c,"x","z",r,t),f[w+1]=1-on(v,c,"z","x",r,n);break;case 4:v.set(0,0,1),f[w+0]=1-on(v,c,"x","y",r,t),f[w+1]=1-on(v,c,"y","x",r,e);break;case 5:v.set(0,0,-1),f[w+0]=on(v,c,"x","y",r,t),f[w+1]=1-on(v,c,"y","x",r,e);break}}static fromJSON(t){return new Dn(t.width,t.height,t.depth,t.segments,t.radius)}}const q_=8;function Y_(){const s=document.createElement("canvas");s.width=1024,s.height=384;const t=s.getContext("2d"),e=256,n=192;if(t){const r=o=>[o%4*e,Math.floor(o/4)*n],a=(o,l,c,u,h=26)=>{const[d,f]=r(o);t.fillStyle=u,t.fillRect(d,f,e,n),t.fillStyle=c,t.font=`${h}px "Libertinus Mono", ui-monospace, monospace`,t.textAlign="center",l.forEach((p,v)=>t.fillText(p,d+e/2,f+n/2+(v-(l.length-1)/2)*h*1.3+h*.35)),t.textAlign="left"};a(1,["NO SIGNAL"],"#ffffff","#1432c8",30);{const[o,l]=r(2);["#c0c0c0","#c0c000","#00c0c0","#00c000","#c000c0","#c00000","#0000c0"].forEach((c,u)=>{t.fillStyle=c,t.fillRect(o+u*e/7,l,e/7+1,n*.7)}),t.fillStyle="#0b0b0b",t.fillRect(o,l+n*.7,e,n*.3)}a(3,["PRESENT DAY","PRESENT TIME"],"#e8e8e8","#050505",22);{const[o,l]=r(4);t.fillStyle="#000",t.fillRect(o,l,e,n),t.fillStyle="#b8b8b8",t.font="18px ui-monospace, monospace",t.fillText("C:\\>_",o+16,l+34)}a(5,["▶ PLAY"],"#ffffff","#0a1a7a",30),a(6,["æ"],"#f4f1ea","#000000",110),a(7,["CLOSE THE WORLD","OPEN THE nExT"],"#ff4a4a","#070000",18)}const i=new li(s);return i.colorSpace=Se,i}class K_{constructor(t,e,n){I(this,"group",new pn);I(this,"screens");I(this,"uniforms",{uTime:{value:0},uAtlas:{value:null},uFogColor:{value:new Ot},uFogDensity:{value:0}});this.uniforms.uFogColor.value.copy(n.color),this.uniforms.uFogDensity.value=n.density;const i=new Dn(1.26,1.1,.95,2,.05);i.translate(0,.55,-.475);const r=new Hc(i,new Ee({roughness:.6,metalness:.05}),t),a=new We(1,.75);a.translate(0,.62,.004),this.uniforms.uAtlas.value=Y_();const o=new Ae({uniforms:this.uniforms,vertexShader:`
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
        }`});this.screens=new Hc(a,o,t);const l=new Float32Array(t),c=new Float32Array(t),u=new Float32Array(t),h=[12168852,1513242,7172214,855311,9407100],d=new ie,f=new Cn,p=new zn,v=new Ot;let m=0;for(;m<t;){const g=e()*Math.PI*2;if(-Math.cos(g)>.3)continue;const w=9+e()*13,E=Math.sin(g)*w,M=-Math.cos(g)*w,S=Math.atan2(-E,-M)+(e()-.5)*.9,b=e()<.14,R=Math.min(t-m,b?1:1+Math.floor(e()*4));let x=b?4+e()*5:0;for(let T=0;T<R;T++,m++){const L=.8+e()*.9,D=!b&&T===0&&e()<.12;p.set(D?-Math.PI/2+.1:(e()-.5)*.12,S+(e()-.5)*.35,D?0:(e()-.5)*.08),f.setFromEuler(p),d.compose(new C(E+(e()-.5)*.3,x,M+(e()-.5)*.3),f,new C(L,L,L)),r.setMatrixAt(m,d),this.screens.setMatrixAt(m,d),r.setColorAt(m,v.setHex(h[Math.floor(e()*h.length)]??3355443)),l[m]=e()<.45?0:1+Math.floor(e()*(q_-1)),c[m]=e(),u[m]=e()<.22?0:.35+e()*.65,x+=1.1*L*(D?.85:1)}}this.screens.geometry.setAttribute("aTile",new ks(l,1)),this.screens.geometry.setAttribute("aSeed",new ks(c,1)),this.screens.geometry.setAttribute("aOn",new ks(u,1)),this.group.add(r,this.screens)}update(t){this.uniforms.uTime.value=t}}const Z_=`
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
`,J_=`
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
`;function Q_(s,t){return new Ae({uniforms:{map:{value:s},uTime:{value:0},uPower:{value:0},uHover:{value:0},uStatic:{value:0},uSeed:{value:t},uGain:{value:1},uTint:{value:new Ot(1,1,1)}},vertexShader:Z_,fragmentShader:J_})}function j_(s,t,e){const n=new We(s,t,24,18),i=n.attributes.position;for(let r=0;r<i.count;r++){const a=i.getX(r)/(s/2),o=i.getY(r)/(t/2);i.setZ(r,e*(1-.5*a*a-.5*o*o))}return n.computeVertexNormals(),n}const Xh={beige:{color:12168852,rough:.62},tv:{color:1513242,rough:.42},grey:{color:7172214,rough:.55},black:{color:855311,rough:.5}},qh=new Map;function tx(s){let t=qh.get(s);return t||(t=new Ee({color:Xh[s].color,roughness:Xh[s].rough,metalness:.05}),qh.set(s,t)),t}const ex=new Ee({color:328966,roughness:.35,metalness:.2});function nx(s){const t=document.createElement("canvas");t.width=256,t.height=56;const e=t.getContext("2d");if(e){e.fillStyle="#d8cfae",e.fillRect(0,0,256,56),e.fillStyle="rgba(120,100,60,0.18)";for(let i=0;i<40;i++)e.fillRect(Math.random()*256,Math.random()*56,2,1);e.globalCompositeOperation="destination-out";for(let i=0;i<56;i+=4)e.fillRect(0,i,Math.random()*5,4),e.fillRect(256-Math.random()*5,i,5,4);e.globalCompositeOperation="source-over",e.fillStyle="#16161c",e.font='bold 30px "Libertinus Mono", "Comic Sans MS", "Marker Felt", cursive',e.textAlign="center",e.textBaseline="middle",e.save(),e.translate(128,30),e.rotate(-.02),e.fillText(s,0,0),e.restore()}const n=new li(t);return n.colorSpace=Se,n.anisotropy=4,n}class ix{constructor(t){I(this,"group",new pn);I(this,"texture");I(this,"crt");I(this,"glass");I(this,"hit");I(this,"height");I(this,"width");I(this,"depth");I(this,"screenH");I(this,"screenLocal");I(this,"portLocal");I(this,"topLocal");I(this,"led");const e=t.screenW,n=e*.75;this.screenH=n;const i=e*1.26,r=n+e*.34,a=e*.2;this.width=i,this.height=r+(t.stand?e*.08:0);const o=t.stand?e*.08:0,l=tx(t.style),c=new kt(new Dn(i,r,a,3,e*.045),l);c.position.set(0,o+r/2,-a/2),this.group.add(c);const u=e*.62,h=new kt(new Dn(i*.84,r*.86,u,3,e*.08),l);h.position.set(0,o+r*.52,-a-u/2+e*.04),this.group.add(h);const d=e*.3,f=new kt(new Dn(i*.46,r*.46,d,2,e*.05),l);if(f.position.set(0,o+r*.54,-a-u-d/2+e*.1),this.group.add(f),this.depth=a+u+d-e*.14,t.stand){const g=new kt(new ci(e*.34,e*.4,o,24),l);g.position.set(0,o/2,-a-u*.4),this.group.add(g)}const p=o+r/2+e*.07;this.screenLocal=new C(0,p,.02),this.portLocal=new C(e*.1,o+r*.25,-this.depth+e*.05),this.topLocal=new C(0,o+r,-a-u*.45);const v=new kt(new We(e*1.05,n*1.05),ex);v.position.set(0,p,.002),this.group.add(v),this.texture=new li(t.screen),this.texture.colorSpace=Se,this.texture.minFilter=Ne,this.texture.generateMipmaps=!1,this.crt=Q_(this.texture,t.seed),this.glass=new kt(j_(e,n,e*.035),this.crt),this.glass.position.set(0,p,.004),this.group.add(this.glass);const m=new kt(new We(e*.4,e*.088),new Ee({map:nx(t.label),transparent:!0,roughness:.9}));if(m.position.set(-e*.18,o+e*.075,.003),m.rotation.z=t.seed%7*.012-.03,this.group.add(m),this.led=new kt(new Ws(e*.014,8,6),new xn({color:1714714})),this.led.position.set(i/2-e*.12,o+e*.08,.004),this.group.add(this.led),t.style==="tv"||t.style==="grey"){const g=new Ee({color:2763310,roughness:.4});for(let w=0;w<2;w++){const E=new kt(new ci(e*.028,e*.028,e*.03,16),g);E.rotation.x=Math.PI/2,E.position.set(i/2-e*.24-w*e*.09,o+e*.08,.012),this.group.add(E)}}this.hit=new kt(new tn(i,r,this.depth),new xn({visible:!1})),this.hit.position.set(0,o+r/2,-this.depth/2),this.group.add(this.hit)}setLed(t,e){this.led.material.color.set(t?e:"#1a2a1a")}world(t){return this.group.updateMatrixWorld(!0),t.clone().applyMatrix4(this.group.matrixWorld)}normal(){const t=new Cn;return this.group.getWorldQuaternion(t),new C(0,0,1).applyQuaternion(t)}}const jr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class _s{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const sx=new Xr(-1,1,1,-1,0,1);class rx extends Be{constructor(){super(),this.setAttribute("position",new xe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new xe([0,2,0,0,2,0],2))}}const ax=new rx;class xl{constructor(t){this._mesh=new kt(ax,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,sx)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Yh extends _s{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Ae?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=$s.clone(t.uniforms),this.material=new Ae({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new xl(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Kh extends _s{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class ox extends _s{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class lx{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new lt);this._width=n.width,this._height=n.height,e=new Xe(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Je}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Yh(jr),this.copyPass.material.blending=wn,this.timer=new dp}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Kh!==void 0&&(a instanceof Kh?n=!0:a instanceof ox&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new lt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const ta={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class cx extends _s{constructor(){super(),this.isOutputPass=!0,this.uniforms=$s.clone(ta.uniforms),this.material=new nh({name:ta.name,uniforms:this.uniforms,vertexShader:ta.vertexShader,fragmentShader:ta.fragmentShader}),this._fsQuad=new xl(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Kt.getTransfer(this._outputColorSpace)===ne&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ca?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ra?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Pa?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ar?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Da?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ia?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===La&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class hx extends _s{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Ot}render(t,e,n){const i=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=i}}const ux={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ot(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class xs extends _s{constructor(t,e=1,n,i){super(),this.strength=e,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new lt(t.x,t.y):new lt(256,256),this.clearColor=new Ot(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Xe(r,a,{type:Je}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const h=new Xe(r,a,{type:Je});h.texture.name="UnrealBloomPass.h"+u,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);const d=new Xe(r,a,{type:Je});d.texture.name="UnrealBloomPass.v"+u,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),a=Math.round(a/2)}const o=ux;this.highPassUniforms=$s.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ae({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new lt(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=$s.clone(jr.uniforms),this.blendMaterial=new Ae({uniforms:this.copyUniforms,vertexShader:jr.vertexShader,fragmentShader:jr.fragmentShader,premultipliedAlpha:!0,blending:rr,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Ot,this._oldClearAlpha=1,this._basic=new xn,this._fsQuad=new xl(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new lt(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=xs.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=xs.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){const e=[],n=t/3;for(let i=0;i<t;i++)e.push(.39894*Math.exp(-.5*i*i/(n*n))/n);return new Ae({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new lt(.5,.5)},direction:{value:new lt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`

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

				}`})}_getCompositeMaterial(t){return new Ae({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}}xs.BlurDirectionX=new lt(1,0),xs.BlurDirectionY=new lt(0,1);const dx={uniforms:{tDiffuse:{value:null},uRes:{value:new lt(1,1)},uTime:{value:0},uTear:{value:0},uDot:{value:3},uHalftone:{value:1}},vertexShader:`
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
    }`};class fx{constructor(t,e,n){I(this,"composer");I(this,"bloom");I(this,"wired");I(this,"tear",0);this.composer=new lx(t),this.composer.addPass(new hx(e,n)),this.bloom=new xs(new lt(256,256),.7,.5,.78),this.composer.addPass(this.bloom),this.wired=new Yh(dx),this.composer.addPass(this.wired),this.composer.addPass(new cx)}get u(){return this.wired.uniforms}setSize(t,e,n){this.composer.setPixelRatio(n),this.composer.setSize(t,e),this.u.uRes.value.set(t*n,e*n),this.u.uDot.value=Math.max(2.5,3*n)}kick(t=1){this.tear=Math.max(this.tear,t)}setHalftone(t){this.u.uHalftone.value=t?1:0}render(t,e){this.tear=Math.max(0,this.tear-e*2.2),this.u.uTime.value=t,this.u.uTear.value=this.tear*this.tear,this.composer.render(e)}}const px={0:"abcdef",1:"bc",2:"abged",3:"abgcd",4:"fgbc",5:"afgcd",6:"afgedc",7:"abc",8:"abcdefg",9:"abcfgd","-":"g"," ":""};class mx{constructor(){I(this,"canvas",document.createElement("canvas"));I(this,"texture");I(this,"ctx");I(this,"mode","clock");I(this,"channel",0);I(this,"marquee","");I(this,"marqueeAt",0);I(this,"acc",1);I(this,"glow",1);this.canvas.width=512,this.canvas.height=112;const t=this.canvas.getContext("2d");if(!t)throw new Error("oikos: no 2d context");this.ctx=t,this.texture=new li(this.canvas),this.texture.colorSpace=Se}scroll(t,e){this.marquee=t,this.marqueeAt=e}play(t,e,n){this.mode="play",this.channel=t,this.scroll(e,n)}stop(){this.mode="clock"}update(t,e){if(this.acc+=e,this.acc<1/12)return;this.acc=0;const n=this.ctx;n.fillStyle="#020807",n.fillRect(0,0,512,112);const i=`rgba(127,245,225,${.85*this.glow+.15})`,r="rgba(127,245,225,0.07)";n.shadowColor="#7ff5e1",n.shadowBlur=10*this.glow,n.lineCap="round";const a=this.mode==="play";n.font="bold 15px ui-monospace, monospace";const o=(c,u,h)=>{n.fillStyle=h?i:r,n.fillText(c,u,24)};if(o("VHS",18,!0),o("HQ",62,!0),o("▶ PLAY",100,a),o("REC",180,!1),o("CH",226,a),o("PM",470,!a),this.marquee&&t-this.marqueeAt<2+this.marquee.length*.22){const c=512-(t-this.marqueeAt)*150;n.fillStyle=i,n.font='bold 50px ui-monospace, "Courier New", monospace',n.fillText(this.marquee.toUpperCase(),c,92)}else if(a)this.digits(String(this.channel).padStart(2,"0"),228,36,i,r),n.fillStyle=i,n.font="bold 40px ui-monospace, monospace",n.fillText("▶",360,88);else{const c=Math.floor(t*1.4)%2===0;this.digits("1200",150,36,c?i:r,r,!0,c)}n.shadowBlur=0,this.texture.needsUpdate=!0}digits(t,e,n,i,r,a=!1,o=!0){const l=this.ctx,c=34,u=60;if([...t].forEach((h,d)=>{const f=e+d*(c+16)+(a&&d>=2?22:0),p=px[h]??"",v=(m,g,w,E,M)=>{l.strokeStyle=p.includes(m)?i:r,l.lineWidth=7,l.beginPath(),l.moveTo(f+g,n+w),l.lineTo(f+E,n+M),l.stroke()};v("a",5,0,c-5,0),v("b",c,5,c,u/2-5),v("c",c,u/2+5,c,u-5),v("d",5,u,c-5,u),v("e",0,u/2+5,0,u-5),v("f",0,5,0,u/2-5),v("g",5,u/2,c-5,u/2)}),a){l.fillStyle=o?i:r;const h=e+2*(c+16)+2;l.fillRect(h,n+16,7,7),l.fillRect(h,n+40,7,7)}}}function Zh(s){const t=document.createElement("canvas");t.width=512,t.height=160;const e=t.getContext("2d");if(e){e.fillStyle="#f1ede2",e.fillRect(0,0,512,160),e.fillStyle="#c0392b",e.fillRect(0,0,512,16),e.fillStyle="#9aa1b0";for(let i=40;i<160;i+=30)e.fillRect(16,i+20,480,1);e.fillStyle="#15151a",e.font='bold 56px "Libertinus Mono", "Comic Sans MS", cursive',e.textBaseline="middle",e.fillText(s,26,92),e.font='18px "Libertinus Mono", monospace',e.fillStyle="#6b6f7a",e.textAlign="right",e.fillText("T-120  SP",496,142)}const n=new li(t);return n.colorSpace=Se,n.anisotropy=4,n}const vl=1.3,Ui=.27,ea=.95,ln=.66;class gx{constructor(){I(this,"group",new pn);I(this,"hit");I(this,"vfd",new mx);I(this,"rearZ");I(this,"rearY");I(this,"flap");I(this,"tape");I(this,"tapeLabel");I(this,"restPose",{pos:new C,rotY:0});I(this,"slotPose",{pos:new C,rotY:0});I(this,"insidePose",{pos:new C,rotY:0});I(this,"state","rest");I(this,"anim",null);I(this,"queue",[]);I(this,"currentLabel","~");const t=new Ee({color:723725,roughness:.7,metalness:.1}),e=new kt(new Dn(1.9,ln,1.6,2,.02),t);e.position.set(0,ln/2,.15),this.group.add(e);const n=new kt(new tn(1.92,.006,1.62),new xn({color:11735583}));n.position.set(0,ln-.03,.15),this.group.add(n);const i=new pn;i.position.set(0,ln+Ui/2+.012,-.12),this.group.add(i);const r=new Ee({color:2500396,roughness:.42,metalness:.12});i.add(new kt(new Dn(vl,Ui,ea,3,.018),r));const a=new Ee({color:6974837,roughness:.34,metalness:.2}),o=new kt(new tn(vl-.04,.004,ea-.04),a);o.position.y=Ui/2+.001,i.add(o);for(const[x,T]of[[-.55,.38],[.55,.38],[-.55,-.38],[.55,-.38]]){const L=new kt(new ci(.035,.04,.012,12),t);L.position.set(x,-Ui/2-.006,T),i.add(L)}const l=ea/2+.001,c=new kt(new We(vl-.03,Ui-.03),new Ee({map:this.panelTexture(),roughness:.5,metalness:.08}));c.position.z=l,i.add(c);const u=.58,h=.095,d=-.21,f=.035,p=new kt(new We(u,h),new xn({color:65793}));p.position.set(d,f,l+.001),i.add(p);const v=new pn;v.position.set(d,f+h/2,l+.004),i.add(v),this.flap=new kt(new tn(u-.01,h-.006,.006),new Ee({color:1710879,roughness:.35,metalness:.1})),this.flap.position.y=-h/2,v.add(this.flap);const m=new kt(new We(.4,.0875),new xn({map:this.vfd.texture,toneMapped:!1}));m.position.set(.36,.045,l+.002),i.add(m);const g=new Ee({color:3816258,roughness:.4,metalness:.1}),w=new Ee({color:9049376,roughness:.4});for(let x=0;x<6;x++){const T=new kt(new Dn(.058,.024,.02,2,.006),x===5?w:g);T.position.set(.19+x*.075,-.075,l+.006),i.add(T)}const E=new kt(new ci(.022,.022,.02,20),g);E.rotation.x=Math.PI/2,E.position.set(-.57,.04,l+.008),i.add(E);const M=new kt(new Ws(.006,8,6),new xn({color:16724016}));M.position.set(-.57,-.01,l+.004),i.add(M),this.rearZ=i.position.z-ea/2,this.rearY=i.position.y,this.tape=new pn;const S=new kt(new Dn(.54,.07,.3,2,.01),new Ee({color:789518,roughness:.45,metalness:.2}));this.tape.add(S);const b=new kt(new We(.2,.06),new Ee({color:2761504,roughness:.1,metalness:.3}));b.rotation.x=-Math.PI/2,b.position.set(0,.0355,-.05),this.tape.add(b),this.tapeLabel=new Ee({map:Zh("~"),roughness:.8});const R=new kt(new We(.46,.1),this.tapeLabel);R.rotation.x=-Math.PI/2,R.position.set(0,.036,.085),this.tape.add(R),this.group.add(this.tape),this.restPose={pos:new C(-.38,ln+.036,.66),rotY:.32},this.slotPose={pos:new C(d,i.position.y+f,i.position.z+l+.34),rotY:0},this.insidePose={pos:new C(d,i.position.y+f,i.position.z+l-.36),rotY:0},this.applyPose(this.restPose,this.restPose,0),this.hit=new kt(new tn(1.9,ln+Ui+.1,1.6),new xn({visible:!1})),this.hit.position.set(0,(ln+Ui+.1)/2,.15),this.group.add(this.hit)}panelTexture(){const t=document.createElement("canvas");t.width=1024,t.height=200;const e=t.getContext("2d");if(e){const i=e.createLinearGradient(0,0,0,200);i.addColorStop(0,"#1f2024"),i.addColorStop(1,"#131417"),e.fillStyle=i,e.fillRect(0,0,1024,200),e.fillStyle="#3a3c43";for(let a=0;a<1024;a+=3)e.fillRect(a,0,1,200);e.globalAlpha=.9,e.fillStyle="#c9ccd4",e.font='30px "Libertinus Mono", monospace',e.fillText("æthera",26,176),e.font="13px ui-monospace, monospace",e.fillStyle="#8b8f99",e.fillText("VIDEO CASSETTE RECORDER   ·   4 HEAD HI-FI   ·   HQ",150,172),e.fillText("POWER",16,26),["EJECT","REW","PLAY","FF","STOP","REC"].forEach((a,o)=>e.fillText(a,632+o*58.5,184))}const n=new li(t);return n.colorSpace=Se,n.anisotropy=4,n}applyPose(t,e,n){this.tape.position.lerpVectors(t.pos,e.pos,n),this.tape.rotation.y=t.rotY+(e.rotY-t.rotY)*n}load(t){var e;this.queue=[],(this.state==="in"||((e=this.anim)==null?void 0:e.to)==="in")&&this.queue.push({to:"rest",label:this.currentLabel}),t&&this.queue.push({to:"in",label:t})}update(t){var a;if(!this.anim&&this.queue.length){const o=this.queue.shift();if(o&&o.to!==this.state){if(o.to==="in"){this.currentLabel=o.label;const l=this.tapeLabel.map;this.tapeLabel.map=Zh(o.label),this.tapeLabel.needsUpdate=!0,l==null||l.dispose()}this.anim={from:this.state,to:o.to,k:0,label:o.label}}}const e=this.anim;if(!e)return;e.k=Math.min(1,e.k+t/(e.to==="in"?1.3:.9));const n=e.to==="in"?e.k:1-e.k,i=o=>o*o*(3-2*o);if(n<.45){const o=i(n/.45);this.applyPose(this.restPose,this.slotPose,o),this.tape.position.y+=Math.sin(o*Math.PI)*.18}else this.applyPose(this.slotPose,this.insidePose,i(Math.min(1,(n-.5)/.4))*(n>.5?1:0));const r=n<.4?0:n<.5?(n-.4)/.1:n<.85?1:1-(n-.85)/.15;(a=this.flap.parent)==null||a.rotation.set(r*1.25,0,0),e.k>=1&&(this.state=e.to,this.anim=null)}}const _x={color:723724,roughness:.55,metalness:0};class xx{constructor(t,e,n){I(this,"mesh");I(this,"uniforms",{uPulseColor:{value:new Ot},uPulseTime:{value:0},uPulseGain:{value:.35},uPulseCount:{value:3},uPulseSpeed:{value:.35}});I(this,"base",.35);I(this,"surgeLeft",0);I(this,"lit",0);const i=new Jc(t,!1,"centripetal",.5),r=i.getLength(),a=new nl(i,Math.max(40,Math.round(r*18)),e,6,!1),o=a.attributes.uv,l=new Float32Array(o.count);for(let u=0;u<o.count;u++)l[u]=o.getX(u);a.setAttribute("aAlong",new rn(l,1)),this.uniforms.uPulseColor.value.set(n),this.uniforms.uPulseCount.value=Math.max(1,Math.round(r/2.2)),this.uniforms.uPulseSpeed.value=.18+Math.random()*.12;const c=new Ee(_x);c.onBeforeCompile=u=>{Object.assign(u.uniforms,this.uniforms),u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
attribute float aAlong;
varying float vAlong;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vAlong = aAlong;`),u.fragmentShader=u.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uPulseColor;
uniform float uPulseTime, uPulseGain, uPulseCount, uPulseSpeed;
varying float vAlong;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
float ph = fract(vAlong * uPulseCount + uPulseTime * uPulseSpeed);
float pulse = smoothstep(0.0, 0.03, ph) * (1.0 - smoothstep(0.03, 0.14, ph));
totalEmissiveRadiance += uPulseColor * (pulse * uPulseGain + 0.012 * uPulseGain);`)},c.customProgramCacheKey=()=>"oikos-cable",this.mesh=new kt(a,c)}setLit(t){this.lit=t}surge(){this.surgeLeft=2.2}update(t,e){this.surgeLeft=Math.max(0,this.surgeLeft-e);const n=this.surgeLeft>0?Math.sin(this.surgeLeft/2.2*Math.PI)*5:0,i=this.base+this.lit*1.2+n;this.uniforms.uPulseGain.value+=(i-this.uniforms.uPulseGain.value)*Math.min(1,e*6),this.uniforms.uPulseTime.value=t*(1+this.lit*1.5+n*.8)}}function vx(s,t,e,n,i,r){const o=[s.clone()],l=s.clone().addScaledVector(t,.18);o.push(l);const c=new C(l.x,.022,l.z).addScaledVector(t,.22);s.y>.3&&o.push(new C(l.x,(s.y+.022)*.4,l.z).addScaledVector(t,.2)),o.push(c);const u=new C(e.x,.022,n-.14),h=Math.sign(c.x||1);c.z>n-.1&&o.push(new C(h*1.15,.022,n-.25));const d=2;for(let f=1;f<=d;f++){const p=f/(d+1),v=new C().lerpVectors(c,u,p),m=new C(u.z-c.z,0,c.x-u.x).normalize();v.addScaledVector(m,(r()-.5)*.9),v.y=.022,o.push(v)}return o.push(u),o.push(new C(e.x,i-.04,n-.035)),o.push(new C(e.x,i+.03,n+.01)),o.push(e.clone()),o}function Jh(s,t,e,n=32){const i=[];for(let r=0;r<=n;r++){const a=r/n,o=new C().lerpVectors(s,t,a);o.y-=e*4*a*(1-a),i.push(o)}return i}function Mx(){var o,l,c;const s=new pn,t=new Ee({color:854795,roughness:.9}),e=new Gc({color:328708}),n=[new C(-26,0,-18),new C(-9,0,-24),new C(8,0,-23),new C(24,0,-15),new C(33,0,2)],i=12.5,r=[];n.forEach((u,h)=>{const d=new kt(new ci(.12,.17,i,8),t);d.position.set(u.x,i/2,u.z),s.add(d);const f=n[h+1]??n[h-1]??u,p=new C().subVectors(f,u).setY(0).normalize(),v=new C(-p.z,0,p.x),m=[];for(const[g,w]of[[i-.4,1.9],[i-1.5,1.4]]){const E=new kt(new tn(w*2,.12,.12),t);E.position.set(u.x,g,u.z),E.rotation.y=Math.atan2(-v.z,v.x),s.add(E);for(const M of[-1,-.45,.45,1])m.push(new C(u.x,g+.08,u.z).addScaledVector(v,M*w*.95))}r.push(m)});for(let u=0;u<r.length-1;u++){const h=r[u]??[],d=r[u+1]??[];h.forEach((f,p)=>{const v=d[p];if(!v)return;const m=new Be().setFromPoints(Jh(f,v,1.4+p%3*.25));s.add(new $c(m,e))})}const a=[[(o=r[1])==null?void 0:o[0],new C(-2.4,9,-6.6)],[(l=r[2])==null?void 0:l[3],new C(2.2,9,-6.1)],[(c=r[3])==null?void 0:c[1],new C(6,8.5,-3)]];for(const[u,h]of a)u&&s.add(new $c(new Be().setFromPoints(Jh(u,h,2.2)),e));return s}function yx(){const s=new Ae({side:Ge,depthWrite:!1,fog:!1,uniforms:{uTime:{value:0}},vertexShader:`
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
      }`}),t=new kt(new Ws(70,32,16),s);return t.renderOrder=-1,t}const Sx=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2;function bx(){const s=document.createElement("canvas");s.width=s.height=128;const t=s.getContext("2d");if(t){const e=t.createRadialGradient(64,64,0,64,64,64);e.addColorStop(0,"rgba(255,255,255,0.9)"),e.addColorStop(.4,"rgba(255,255,255,0.3)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,128,128)}return new li(s)}class wx{constructor(t,e,n,i){I(this,"renderer");I(this,"scene",new Af);I(this,"camera",new qe(45,1,.05,160));I(this,"controls");I(this,"post");I(this,"vcr",new gx);I(this,"field");I(this,"sky");I(this,"stations",new Map);I(this,"pickables",[]);I(this,"raycaster",new pp);I(this,"pointer",new lt(-9,-9));I(this,"pointerPx",{x:0,y:0});I(this,"pointerDirty",!1);I(this,"hovered",null);I(this,"focused",null);I(this,"tween",null);I(this,"playing",null);I(this,"settlePlay",null);I(this,"tuneSeq",0);I(this,"lastAspect",0);I(this,"later",[]);I(this,"clock",new mp);I(this,"t",0);I(this,"running",!1);I(this,"raf",0);I(this,"lastInput",0);I(this,"swayDir",1);I(this,"pixelRatio");I(this,"maxPixelRatio");I(this,"frameTimes",[]);I(this,"qualityStep",0);I(this,"shift",{x:0,y:0});I(this,"tuned",null);I(this,"shiftTarget",{x:0,y:0});I(this,"reduced");I(this,"lowPower");I(this,"speed",Math.min(10,Math.max(1,Number(new URLSearchParams(location.search).get("speed"))||1)));I(this,"driven",new URLSearchParams(location.search).has("drive"));I(this,"perf",{frames:0,paint:0,render:0,uploads:0});I(this,"frustum",new kr);I(this,"viewProj",new ie);I(this,"kept",null);I(this,"calm",0);this.container=t,this.events=i,this.reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,this.lowPower=matchMedia("(pointer: coarse)").matches||Math.min(innerWidth,innerHeight)<600,this.maxPixelRatio=Math.min(devicePixelRatio||1,this.lowPower?1.25:1.6),this.pixelRatio=this.maxPixelRatio,this.renderer=new D_({antialias:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.toneMapping=ar,this.renderer.toneMappingExposure=1.1,this.renderer.outputColorSpace=Se,this.renderer.domElement.id="oikos-gl",t.prepend(this.renderer.domElement);try{this.build(e,n)}catch(r){throw this.renderer.domElement.remove(),this.renderer.dispose(),this.renderer.forceContextLoss(),r}}build(t,e){this.scene.background=new Ot(0),this.scene.fog=new Uo(new Ot().setRGB(.049,.0063,.0089,Ps),.042),this.sky=yx(),this.scene.add(this.sky),this.scene.add(new sp(4866648,393988,.8));const n=new cp(9082040,.35);n.position.set(-4,10,-6),this.scene.add(n);const i=new ap(14212351,9,7,.42,.65,1.6);i.position.set(.4,4.6,1.2),i.target.position.set(0,ln,.1),this.scene.add(i,i.target);const r=new rl(10466303,2.2,4.5,2);r.position.set(-.4,1.35,2.3),this.scene.add(r);const a=new rl(11735583,1.6,4,2);a.position.set(0,.25,1.4),this.scene.add(a),this.buildFloor(),this.scene.add(this.vcr.group),this.pickables.push(this.vcr.hit),this.vcr.hit.userData.pick="vcr",this.scene.add(Mx());const o=vi(1998);this.field=new K_(this.lowPower?40:90,o,this.scene.fog),this.scene.add(this.field.group),this.buildStations(t,e,o),this.controls=new N_(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.enablePan=!1,this.controls.rotateSpeed=.28,this.controls.zoomSpeed=.6,this.controls.addEventListener("start",()=>this.lastInput=this.t),this.post=new fx(this.renderer,this.scene,this.camera),this.resize();const l=this.homePose();this.camera.position.copy(l.pos),this.controls.target.copy(l.target),this.applyLimits(null),this.controls.update(),this.bindPointer(),addEventListener("resize",()=>this.resize())}buildFloor(){const t=document.createElement("canvas");t.width=t.height=512;const e=t.getContext("2d");if(e){e.fillStyle="#0c0b0d",e.fillRect(0,0,512,512),e.strokeStyle="rgba(120,110,130,0.10)",e.lineWidth=2;for(let r=0;r<=512;r+=128)e.beginPath(),e.moveTo(r,0),e.lineTo(r,512),e.moveTo(0,r),e.lineTo(512,r),e.stroke();for(let r=0;r<900;r++)e.fillStyle=`rgba(${Math.random()<.3?"120,20,30":"90,90,100"},${Math.random()*.12})`,e.fillRect(Math.random()*512,Math.random()*512,2,2)}const n=new li(t);n.wrapS=n.wrapT=lr,n.repeat.set(24,24),n.colorSpace=Se,n.anisotropy=8;const i=new kt(new We(96,96),new Ee({map:n,roughness:.82,metalness:.15}));i.rotation.x=-Math.PI/2,this.scene.add(i)}buildStations(t,e,n){const i=new Ee({color:1315086,roughness:.85}),r=new Ee({color:657930,roughness:.6}),a=bx(),o=new C,l=new Map,c=t.map((h,d)=>({site:h,i:d,p:pd(h.id,d)}));c.sort((h,d)=>+!!h.p.on-+!!d.p.on);let u=0;for(const{site:h,p:d}of c){const f=e.get(h.id);if(!f)continue;const p=new ix({style:d.style,screenW:d.screenW,screen:f.canvas,label:h.title,accent:h.accent,seed:Math.floor(n()*1e3),stand:d.stand}),v=xr.degToRad(d.angle),m=d.on?l.get(d.on):void 0;if(m)p.group.position.copy(m.group.position),p.group.position.y+=m.height,p.group.rotation.copy(m.group.rotation),p.group.rotateY((n()-.5)*.12),p.group.translateZ(-(m.depth-p.depth)*.3);else{p.group.position.set(Math.sin(v)*d.r,d.y,-Math.cos(v)*d.r);const D=new C(0,d.hang?1.3:p.group.position.y+.6,.6);p.group.lookAt(D),d.hang||(p.group.rotation.set(0,Math.atan2(-p.group.position.x,.6-p.group.position.z),0),p.group.rotateY((n()-.5)*.1))}if(this.scene.add(p.group),l.set(h.id,p),!d.hang&&!d.on&&d.y>.01){const D=new kt(new tn(p.width*.92,d.y,p.depth*.9),i);D.position.set(0,-d.y/2,-p.depth*.45),p.group.add(D)}if(d.hang){const D=p.world(p.topLocal),F=new kt(new ci(.008,.008,16,5),r);F.position.set(D.x,D.y+8,D.z),this.scene.add(F)}const g=-.5+u++*.37%1;o.set(g,this.vcr.rearY-.05,this.vcr.rearZ-.01);const w=p.world(p.portLocal),E=p.normal().multiplyScalar(-1).setY(0).normalize();let M;const S=d.feeds?l.get(d.feeds):void 0;if(S){const D=S.world(S.portLocal.clone().add(new C(-.25,.15,0))),F=new C().lerpVectors(w,D,.5);F.y=Math.min(w.y,D.y)-.6,M=[w,w.clone().addScaledVector(E,.3).setY(w.y-.2),F,D.clone().add(new C(0,.3,-.3)),D]}else M=vx(w,E,o,.15-.8,ln,n);const b=new xx(M,d.hang?.014:.02,h.accent);this.scene.add(b.mesh);const R=new kt(new We(d.screenW*2.6,d.screenW*2.2),new xn({map:a,color:h.accent,transparent:!0,opacity:0,depthWrite:!1,blending:rr,fog:!0})),x=p.normal().setY(0).normalize(),T=p.world(p.screenLocal).addScaledVector(x,d.screenW*.9);R.position.set(T.x,.012,T.z),R.rotation.x=-Math.PI/2,R.rotation.z=Math.atan2(x.x,x.z),d.hang||this.scene.add(R);let L=null;this.lowPower||(L=new rl(h.accent,0,3.2+d.screenW,2),L.position.copy(p.world(p.screenLocal).addScaledVector(p.normal(),1.1)),this.scene.add(L)),p.hit.userData.pick=h.id,this.pickables.push(p.hit),this.stations.set(h.id,{site:h,screen:f,monitor:p,placement:d,cable:b,glow:R,light:L,power:0,powerAt:1/0,staticLeft:0,hover:0})}}homePose(){const t=this.camera.aspect,e=t<1,n=e?7.2+(1-t)*2.4:7.8;return{pos:new C(0,e?2.5:2.4,n),target:new C(0,e?1.7:1.95,-1.6)}}posesFor(t){if(t==="vcr"){const c=this.camera.aspect<1;return{pos:new C(.3,1.75,c?3.9:2.9),target:new C(0,ln+.12,.2)}}const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.world(n.screenLocal),r=n.normal(),a=xr.degToRad(this.camera.fov),o=2*Math.atan(Math.tan(a/2)*this.camera.aspect),l=Math.max(n.screenH/2/Math.tan(a/2)/.46,n.screenH/.75/2/Math.tan(o/2)/.7);return{pos:i.clone().addScaledVector(r,l+.05),target:i}}applyLimits(t){const e=this.controls;if(!t){e.minDistance=3,e.maxDistance=15,e.minAzimuthAngle=-.8,e.maxAzimuthAngle=.8,e.minPolarAngle=.95,e.maxPolarAngle=1.56;return}const n=new C().subVectors(this.camera.position,e.target),i=new ol().setFromVector3(n);e.minDistance=i.radius*.45,e.maxDistance=i.radius*1.7,e.minAzimuthAngle=i.theta-.6,e.maxAzimuthAngle=i.theta+.6,e.minPolarAngle=Math.max(.3,i.phi-.45),e.maxPolarAngle=Math.min(1.6,i.phi+.35)}flyTo(t,e,n){this.controls.enabled=!1,this.controls.minAzimuthAngle=-1/0,this.controls.maxAzimuthAngle=1/0,this.tween={from:{pos:this.camera.position.clone(),target:this.controls.target.clone()},to:t,k:0,dur:this.reduced?.01:e,done:n}}focus(t){const e=t?this.posesFor(t):this.homePose();if(e){this.cancelPlay(),this.focused=t;for(const[n,i]of this.stations)i.cable.setLit(n===t?1:0);this.flyTo(e,t?1.15:1.3,()=>{this.applyLimits(t),this.controls.enabled=!this.tuned,this.controls.update()})}}get focusedId(){return this.focused}keepAlive(t){this.kept=t}get busy(){return this.playing!==null}cancelPlay(){this.playing=null;const t=this.settlePlay;this.settlePlay=null,t==null||t(!1)}play(t){const e=this.stations.get(t),n=this.posesFor(t);if(!e||!n)return Promise.resolve(!0);this.cancelPlay();const i=new Promise(c=>this.settlePlay=c);this.vcr.load(e.site.title),this.vcr.vfd.play(e.placement.channel,e.site.title,this.t),this.focused=t,this.playing=t;for(const[c,u]of this.stations)u.cable.setLit(c===t?1:0);const r=()=>{this.playing===t&&(e.staticLeft=.9,this.post.kick(.7),this.flyTo(n,1.15,()=>{if(this.playing!==t)return;this.playing=null,this.applyLimits(t),this.controls.enabled=!this.tuned,this.controls.update();const c=this.settlePlay;this.settlePlay=null,c==null||c(!0)}))};if(this.reduced)return r(),i;const a=Math.sign(e.monitor.group.position.x)||1,o=this.camera.aspect<1,l={pos:new C(a*.45,1.4,o?3.1:2.25),target:new C(a*.05,ln+.1,.25)};return this.flyTo(l,.8,()=>{this.playing===t&&(e.cable.surge(),this.after(.35,r))}),i}after(t,e){this.later.push({at:this.t+t,fn:e})}eject(){this.vcr.load(null),this.vcr.vfd.stop()}scroll(t){this.vcr.vfd.scroll(t,this.t)}dive(t){const e=this.stations.get(t);if(!e||this.reduced)return Promise.resolve();this.cancelPlay();const n=e.monitor,i=n.world(n.screenLocal),r=i.clone().addScaledVector(n.normal(),n.screenH*.16);return e.staticLeft=.8,this.post.kick(1),new Promise(a=>this.flyTo({pos:r,target:i},.75,a))}powerOn(){let t=0;const e=[...this.stations.values()].sort((n,i)=>n.placement.channel-i.placement.channel);for(const n of e)n.powerAt=this.t+.25+t++*(this.reduced?0:.14);this.vcr.vfd.scroll("present day  present time",this.t+.4)}anchor(t){let e;if(t==="vcr")e=new C(0,ln-.05,.95);else{const i=this.stations.get(t);if(!i)return null;e=i.monitor.world(i.monitor.screenLocal.clone().add(new C(0,i.monitor.screenH*.5,0)))}if(e.project(this.camera),e.z>1)return null;const n=this.renderer.domElement.getBoundingClientRect();return{x:n.left+(e.x+1)/2*n.width,y:n.top+(1-e.y)/2*n.height}}setShift(t,e){this.shiftTarget={x:t,y:e}}applyShift(t){this.tuned&&(this.shiftTarget={x:0,y:0});const e=this.reduced?1:Math.min(1,t*5),n=this.shift.x+(this.shiftTarget.x-this.shift.x)*e,i=this.shift.y+(this.shiftTarget.y-this.shift.y)*e;if(Math.abs(n-this.shift.x)<.05&&Math.abs(i-this.shift.y)<.05&&this.camera.view)return;this.shift={x:n,y:i};const r=this.container.clientWidth||innerWidth,a=this.container.clientHeight||innerHeight;this.camera.setViewOffset(r,a,n,i,r,a)}tuneIn(t,e){const n=this.stations.get(t),i=this.tunePose(t);if(!n||!i)return Promise.resolve();this.tuneOut(),this.cancelPlay();const r=this.tuneSeq;this.focused=t,this.shiftTarget={x:0,y:0};for(const[a,o]of this.stations)o.cable.setLit(a===t?1:0);return new Promise(a=>this.flyTo(i,1.1,()=>{if(r!==this.tuneSeq){this.applyLimits(t),this.controls.enabled=!0;return}this.tuned={id:t,place:e},n.staticLeft=0,this.resize(),a()}))}tunePose(t){const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.screenH/.75,r=n.world(n.screenLocal),a=xr.degToRad(this.camera.fov),o=2*Math.atan(Math.tan(a/2)*this.camera.aspect),l=Math.max(n.screenH/2/Math.tan(a/2)/.84,i/2/Math.tan(o/2)/.94);return{pos:r.clone().addScaledVector(n.normal(),l),target:r}}tuneOut(){this.tuneSeq++,this.tuned&&(this.tuned=null,this.tween||(this.applyLimits(this.focused),this.controls.enabled=!0))}reset(){this.tuneOut(),this.cancelPlay(),this.focus(null)}glassRect(t){const e=this.stations.get(t);if(!e)return null;const n=e.monitor,i=n.screenH/.75,r=this.renderer.domElement.getBoundingClientRect(),a=[],o=[];this.camera.updateMatrixWorld();for(const[u,h]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const d=n.world(n.screenLocal.clone().add(new C(u*i/2,h*n.screenH/2,i*.02)));d.project(this.camera),a.push(r.left+(d.x+1)/2*r.width),o.push(r.top+(1-d.y)/2*r.height)}const l=Math.min(...a),c=Math.min(...o);return new DOMRectReadOnly(l,c,Math.max(...a)-l,Math.max(...o)-c)}get tunedId(){var t;return((t=this.tuned)==null?void 0:t.id)??null}bindPointer(){const t=this.renderer.domElement;let e=null;t.addEventListener("pointermove",n=>{const i=t.getBoundingClientRect();this.pointer.set((n.clientX-i.left)/i.width*2-1,-((n.clientY-i.top)/i.height)*2+1),this.pointerPx={x:n.clientX,y:n.clientY},this.pointerDirty=!0,this.lastInput=this.t}),t.addEventListener("pointerleave",()=>{this.pointer.set(-9,-9),this.pointerDirty=!0}),t.addEventListener("pointerdown",n=>{if(n.button!==0||!n.isPrimary){e=null;return}e={x:n.clientX,y:n.clientY,t:performance.now()},this.lastInput=this.t}),t.addEventListener("pointerup",n=>{if(!e)return;const i=Math.hypot(n.clientX-e.x,n.clientY-e.y),r=performance.now()-e.t<600;if(e=null,i>7||!r||this.tuned)return;const a=t.getBoundingClientRect();this.pointer.set((n.clientX-a.left)/a.width*2-1,-((n.clientY-a.top)/a.height)*2+1),this.events.pick(this.pickAt())})}pickFromPoint(t,e){const n=this.renderer.domElement.getBoundingClientRect(),i=this.pointer.clone();this.pointer.set((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);const r=this.pickAt();return this.pointer.copy(i),r}pickAt(){this.raycaster.setFromCamera(this.pointer,this.camera);const t=this.raycaster.intersectObjects(this.pickables,!1)[0];return(t==null?void 0:t.object.userData.pick)??null}resize(){const t=this.container.clientWidth||innerWidth,e=this.container.clientHeight||innerHeight,n=Math.abs(t/e-this.lastAspect)>.02;if(this.lastAspect=t/e,this.camera.aspect=t/e,this.camera.fov=this.camera.aspect<1?58:45,this.camera.setViewOffset(t,e,this.shift.x,this.shift.y,t,e),this.renderer.setSize(t,e,!1),this.renderer.domElement.style.width=`${t}px`,this.renderer.domElement.style.height=`${e}px`,this.post.setSize(t,e,this.pixelRatio),this.tuned){this.shift={x:0,y:0},this.camera.setViewOffset(t,e,0,0,t,e);const i=this.tunePose(this.tuned.id);i&&(this.camera.position.copy(i.pos),this.controls.target.copy(i.target),this.camera.lookAt(i.target));const r=this.glassRect(this.tuned.id);r&&this.tuned.place(r)}if(n&&!this.tween&&!this.focused&&this.controls){const i=this.homePose();this.camera.position.copy(i.pos),this.controls.target.copy(i.target)}}async warm(t=5e3){try{await Promise.race([this.renderer.compileAsync(this.scene,this.camera),new Promise(e=>setTimeout(e,t))]),this.post.render(0,0)}catch(e){console.warn("oikos: warm-up skipped",e)}}start(){if(this.running)return;if(this.running=!0,this.clock.getDelta(),this.driven){const e=this.renderer.getContext();window.__oikos={step:(n=1,i=1/30)=>{var r;this.perf={frames:0,paint:0,render:0,uploads:0};for(let a=0;a<n;a++)this.frame(i),e.finish();return{...this.perf,t:this.t,focused:this.focused,hovered:this.hovered,tuned:((r=this.tuned)==null?void 0:r.id)??null}},anchor:n=>this.anchor(n),glass:n=>this.glassRect(n)};return}const t=()=>{this.running&&(this.raf=requestAnimationFrame(t),this.frame())};this.raf=requestAnimationFrame(t)}stop(){this.running=!1,cancelAnimationFrame(this.raf)}adapt(t){this.frameTimes.push(t);const e=this.frameTimes.reduce((i,r)=>i+r,0);if(this.frameTimes.length<90&&e<2)return;const n=this.frameTimes.reduce((i,r)=>i+r,0)/this.frameTimes.length;if(this.frameTimes=[],this.calm=n<1/50?this.calm+1:0,this.calm>=3&&this.qualityStep>0){this.calm=0,this.qualityStep--,this.pixelRatio=Math.min(this.maxPixelRatio,this.pixelRatio/.8),this.post.bloom.enabled=!0,this.applyPixelRatio();return}n>1/27&&this.qualityStep<3&&(this.qualityStep++,this.pixelRatio=Math.max(.6,this.pixelRatio*.8),this.qualityStep>=3&&(this.post.bloom.enabled=!1),this.applyPixelRatio())}applyPixelRatio(){this.renderer.setPixelRatio(this.pixelRatio);const t=this.container.clientWidth||innerWidth,e=this.container.clientHeight||innerHeight;this.renderer.setSize(t,e,!1),this.post.setSize(t,e,this.pixelRatio)}frame(t){var o;const e=t??this.clock.getDelta(),n=Math.min(e,.1)*this.speed;this.t+=n;const i=this.t;if(this.driven||this.adapt(Math.min(e,.5)),this.applyShift(n),this.later.length){const l=this.later.filter(c=>c.at<=i);this.later=this.later.filter(c=>c.at>i);for(const c of l)c.fn()}if(this.tween){const l=this.tween;l.k=Math.min(1,l.k+n/l.dur);const c=Sx(l.k);this.camera.position.lerpVectors(l.from.pos,l.to.pos,c),this.controls.target.lerpVectors(l.from.target,l.to.target,c),this.camera.lookAt(this.controls.target),l.k>=1&&(this.tween=null,(o=l.done)==null||o.call(l))}else{if(!this.focused&&!this.reduced&&i-this.lastInput>9){this.controls.autoRotate=!0;const l=this.controls.getAzimuthalAngle();l>.32&&(this.swayDir=1),l<-.32&&(this.swayDir=-1),this.controls.autoRotateSpeed=.18*this.swayDir}else this.controls.autoRotate=!1;this.controls.update(n)}if(this.pointerDirty&&!this.tween){this.pointerDirty=!1;const l=this.pickAt();l!==this.hovered&&(this.hovered=l,this.renderer.domElement.style.cursor=l?"pointer":""),this.events.hover(l,this.pointerPx.x,this.pointerPx.y)}const r=performance.now();this.camera.updateMatrixWorld(),this.viewProj.multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.viewProj);for(const[l,c]of this.stations){i>=c.powerAt&&(c.power=Math.min(1,c.power+n/(this.reduced?.01:.8))),c.staticLeft=Math.max(0,c.staticLeft-n),c.hover+=((l===this.hovered?1:0)-c.hover)*Math.min(1,n*8);const u=c.monitor.crt.uniforms;u.uTime.value=i,u.uPower.value=c.power,u.uHover.value=c.hover,u.uStatic.value=Math.min(1,c.staticLeft*1.6);const h=this.focused===l,d=h||l===this.kept||this.frustum.intersectsObject(c.monitor.glass),f=this.focused&&this.focused!=="vcr"&&!h&&l!==this.kept?.5:1;c.power>.2&&d&&c.screen.tick(i,n,h,f)&&(c.monitor.texture.needsUpdate=!0,this.perf.uploads++),c.monitor.setLed(c.power>.5,c.site.accent);const p=c.glow.material;p.opacity=c.power*(.16+c.hover*.12+(h?.1:0)),c.light&&(c.light.intensity=c.power*(2.2+c.hover*1.4+(h?.6:0))),c.cable.update(i,n)}this.vcr.vfd.glow=this.hovered==="vcr"?1:.8,this.vcr.vfd.update(i,n),this.vcr.update(n),this.field.update(i);const a=performance.now();if(this.post.render(i,n),this.driven){this.renderer.getContext().finish();const l=performance.now();this.perf.frames++,this.perf.paint+=a-r,this.perf.render+=l-a}}}let Ex=0;const di=s=>`${s}${++Ex}`,Tx="/static/oikos/mark.png";function vn(s,t=""){const e=di("tp"),n=t.length>9?`${t.slice(0,8)}…`:t;return`<svg viewBox="0 0 48 48" aria-hidden="true">
<defs><linearGradient id="${e}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a40"/><stop offset="1" stop-color="#0c0c0e"/></linearGradient></defs>
<rect x="2" y="9" width="44" height="30" rx="3" fill="url(#${e})" stroke="#000"/>
<rect x="6" y="12" width="36" height="12" rx="1.5" fill="#f4f1e8" stroke="#000" stroke-width=".6"/>
<rect x="6" y="12" width="36" height="3" fill="${s}"/>
<text x="24" y="22.3" font-size="6.2" font-family="Tahoma,Verdana,sans-serif" text-anchor="middle" fill="#111">${lu(n)}</text>
<rect x="12" y="27" width="24" height="8" rx="1" fill="#1d1a18" stroke="#555" stroke-width=".5"/>
<circle cx="17" cy="31" r="2.6" fill="#e9e5da"/><circle cx="31" cy="31" r="2.6" fill="#e9e5da"/>
<circle cx="17" cy="31" r="1" fill="#222"/><circle cx="31" cy="31" r="1" fill="#222"/>
<path d="M5 10h38" stroke="#fff" stroke-opacity=".18"/>
</svg>`}function Zs(){const s=di("fa"),t=di("fb");return`<svg viewBox="0 0 48 48" aria-hidden="true">
<defs><linearGradient id="${s}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset="1" stop-color="#e8b93a"/></linearGradient>
<linearGradient id="${t}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe98a"/><stop offset="1" stop-color="#d9a21b"/></linearGradient></defs>
<path d="M4 12h14l4 4h22v24H4z" fill="url(#${t})" stroke="#9c7412"/>
<path d="M4 19h40v21H4z" fill="url(#${s})" stroke="#9c7412"/>
<path d="M24 22l-8 7h2.5v7h11v-7H32z" fill="#fff" stroke="#6b5a2a" stroke-width=".8"/>
<text x="24" y="34.5" font-size="7" font-family="Tahoma,sans-serif" text-anchor="middle" fill="#6b5a2a">~</text>
</svg>`}function Qh(){const s=di("cs");return`<svg viewBox="0 0 48 48" aria-hidden="true">
<defs><linearGradient id="${s}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#58a4ff"/><stop offset="1" stop-color="#0b3fa8"/></linearGradient></defs>
<rect x="8" y="6" width="32" height="26" rx="2" fill="#d9d6cc" stroke="#6d6a60"/>
<rect x="11" y="9" width="26" height="19" fill="url(#${s})" stroke="#28344f"/>
<path d="M13 11h22" stroke="#fff" stroke-opacity=".4"/>
<rect x="18" y="32" width="12" height="4" fill="#bdb9ad"/>
<rect x="10" y="36" width="28" height="5" rx="1" fill="#d9d6cc" stroke="#6d6a60"/>
</svg>`}function jh(){const s=di("gl");return`<svg viewBox="0 0 48 48" aria-hidden="true">
<defs><radialGradient id="${s}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#bfe3ff"/><stop offset=".5" stop-color="#3b8de8"/><stop offset="1" stop-color="#0b3a8f"/></radialGradient></defs>
<circle cx="24" cy="24" r="18" fill="url(#${s})" stroke="#0b3a8f"/>
<path d="M13 16c4 2 7 1 9 4s-2 6 1 9 6 1 7 5M28 9c-2 3 1 5 4 6s5 4 4 7" fill="none" stroke="#5fbf4a" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="24" cy="24" rx="18" ry="7" fill="none" stroke="#fff" stroke-opacity=".35"/>
</svg>`}function Ax(){return`<svg viewBox="0 0 16 16" aria-hidden="true">
<rect x="1" y="3" width="7" height="6" fill="#d9d6cc" stroke="#333" stroke-width=".7"/><rect x="2" y="4" width="5" height="4" fill="#2c7ce0"/>
<rect x="8" y="7" width="7" height="6" fill="#d9d6cc" stroke="#333" stroke-width=".7"/><rect x="9" y="8" width="5" height="4" fill="#2c7ce0"/>
<path d="M4.5 9v3.5H8" stroke="#fff" stroke-width="1" fill="none"/>
</svg>`}function tu(s){return`<svg viewBox="0 0 16 16" aria-hidden="true">
<circle cx="8" cy="8" r="6.5" fill="${s?"#ff7a5c":"#5b6b8c"}" stroke="#fff" stroke-width=".8"/>
<circle cx="10.5" cy="6" r="5" fill="${s?"#ffd2c4":"#16305e"}"/>
${s?'<circle cx="12.6" cy="12.6" r="2" fill="#ff2a2a" stroke="#fff" stroke-width=".6"/>':""}
</svg>`}function eu(s){const t=di("ar");return`<svg viewBox="0 0 24 24" aria-hidden="true">
<defs><radialGradient id="${t}" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#bff5a8"/><stop offset=".6" stop-color="#3fae2a"/><stop offset="1" stop-color="#1e6e14"/></radialGradient></defs>
<circle cx="12" cy="12" r="10.5" fill="url(#${t})" stroke="#1e6e14"/>
<path d="${s==="back"?"M5 12l7-5.5V10h7v4h-7v3.5z":"M19 12l-7-5.5V10H5v4h7v3.5z"}" fill="#fff"/>
</svg>`}const Cx=()=>eu("back"),Rx=()=>eu("fwd");function Px(){return`<svg viewBox="0 0 24 24" aria-hidden="true">
<path d="M2 6h7l2 2h11v13H2z" fill="#f3cd55" stroke="#9c7412"/>
<path d="M12 9l-5 5h3v5h4v-5h3z" fill="#3fae2a" stroke="#1e6e14" stroke-width=".8"/>
</svg>`}function Lx(){return`<svg viewBox="0 0 24 24" aria-hidden="true">
<circle cx="10" cy="10" r="6.5" fill="#dff1ff" stroke="#2a4f80" stroke-width="2"/>
<path d="M15 15l6 6" stroke="#8a5a1c" stroke-width="3.5" stroke-linecap="round"/>
</svg>`}function Dx(){return`<svg viewBox="0 0 24 24" aria-hidden="true">
<path d="M1 4h6l2 2h8v8H1z" fill="#f3cd55" stroke="#9c7412"/>
<path d="M7 11h6l2 2h8v8H7z" fill="#ffe27a" stroke="#9c7412"/>
</svg>`}function Ix(){return`<svg viewBox="0 0 18 18" aria-hidden="true">
<rect x="1" y="1" width="16" height="16" rx="3" fill="#3fae2a" stroke="#1e6e14"/>
<path d="M5 9h7M9 5l4 4-4 4" stroke="#fff" stroke-width="2" fill="none"/>
</svg>`}function Ml(){return'<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="#3fae2a" stroke="#1e6e14"/><path d="M6 4.5v7l6-3.5z" fill="#fff"/></svg>'}function nu(){return'<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="2" width="11" height="9" rx="1" fill="#d9d6cc" stroke="#555"/><rect x="2.5" y="3.5" width="8" height="6" fill="#2c7ce0"/><circle cx="11" cy="11" r="3" fill="#fff" stroke="#2a4f80" stroke-width="1.4"/><path d="M13 13l2.5 2.5" stroke="#8a5a1c" stroke-width="2"/></svg>'}function Nx(){return'<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="3" width="14" height="10" rx="2" fill="#2a2a2e" stroke="#000"/><rect x="2.5" y="4.5" width="9" height="7" rx="1.5" fill="#3fae2a"/><path d="M5 1l3 2 3-2" stroke="#555" fill="none"/><circle cx="13" cy="6" r=".8" fill="#ddd"/><circle cx="13" cy="9" r=".8" fill="#ddd"/></svg>'}function Ux(){return'<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="1.5" width="8" height="10" fill="#fff" stroke="#555"/><rect x="6" y="4.5" width="8" height="10" fill="#fff" stroke="#555"/><path d="M7.5 7h5M7.5 9h5M7.5 11h4" stroke="#8aa"/></svg>'}function iu(){return'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2l6 7H2z" fill="#4a5a80"/><rect x="2" y="11" width="12" height="3" fill="#4a5a80"/></svg>'}function vs(s){return`<svg viewBox="0 0 48 48" aria-hidden="true">
<path d="M10 4h20l8 8v32H10z" fill="#fff" stroke="#7a7a7a"/><path d="M30 4v8h8" fill="#e6e6e6" stroke="#7a7a7a"/>
<path d="M15 18h18M15 23h18M15 28h14M15 33h18" stroke="#9fb3c8"/>
<rect x="12" y="36" width="24" height="9" rx="1" fill="${s==="xml"?"#e8742a":"#2c7ce0"}"/>
<text x="24" y="43" font-size="7" font-family="Tahoma,sans-serif" font-weight="bold" text-anchor="middle" fill="#fff">${lu(s.toUpperCase())}</text>
</svg>`}function su(){return'<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="#2c7ce0" stroke="#fff"/><rect x="7" y="7" width="2" height="5" fill="#fff"/><rect x="7" y="4" width="2" height="2" fill="#fff"/></svg>'}function ru(){return'<svg viewBox="0 0 22 22" aria-hidden="true"><rect x="1" y="1" width="20" height="20" rx="3" fill="#e0542e" stroke="#fff"/><path d="M11 5v6" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><path d="M7.5 7.5a5 5 0 107 0" fill="none" stroke="#fff" stroke-width="2"/></svg>'}function Fx(){return'<svg viewBox="0 0 22 22" aria-hidden="true"><rect x="1" y="1" width="20" height="20" rx="3" fill="#e5a117" stroke="#fff"/><path d="M13 5a6 6 0 104 9 6.5 6.5 0 01-4-9z" fill="#fff"/></svg>'}function au(){return'<svg viewBox="0 0 22 22" aria-hidden="true"><rect x="1" y="1" width="20" height="20" rx="3" fill="#e5a117" stroke="#fff"/><circle cx="8" cy="11" r="3.4" fill="none" stroke="#fff" stroke-width="2"/><path d="M11 11h7M15.5 11v3M17.5 11v2.2" stroke="#fff" stroke-width="2" stroke-linecap="square"/></svg>'}function Ox(){const s=di("ap");return`<svg viewBox="0 0 18 18" aria-hidden="true"><defs><linearGradient id="${s}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fe36a"/><stop offset="1" stop-color="#2c8c1a"/></linearGradient></defs><rect x="1" y="1" width="16" height="16" rx="3" fill="url(#${s})" stroke="#1e6e14"/><path d="M7 4.5l5.5 4.5L7 13.5z" fill="#fff"/></svg>`}function ou(){return'<svg viewBox="0 0 22 22" aria-hidden="true"><path d="M16 7a6 6 0 10.8 6" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M17.5 3v5h-5" fill="#fff"/></svg>'}function Js(s,t=!1){return`<img src="${Tx}" alt="" width="${s}" height="${s}" style="width:${s}px;height:${s}px;${t?"filter:invert(1);":""}">`}function lu(s){return s.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]??t)}function fi(s="app"){if(s==="status")return'<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="9" rx="1" fill="#d9d6cc" stroke="#555"/><rect x="3" y="4" width="10" height="6" fill="#0a246a"/><path d="M4 6h5M4 8h3" stroke="#9fc6ff"/><path d="M5 12.5h6v1.5H5z" fill="#888"/></svg>';if(s==="channel")return'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 2.5h10a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H6l-3 3v-3H1.5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z" fill="#fff" stroke="#2a4f80"/><path d="M4 5h3M4 7h5M8 4l-1 4M10 4l-1 4" stroke="#58a6ff" stroke-width=".9"/></svg>';const t=di("ch");return`<svg viewBox="0 0 24 24" aria-hidden="true">
<defs><linearGradient id="${t}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb4ff"/><stop offset="1" stop-color="#1f5fd1"/></linearGradient></defs>
<path d="M2 3h13a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 15 13H8l-4 4v-4H2A1.5 1.5 0 0 1 .5 11.5v-7A1.5 1.5 0 0 1 2 3z" fill="url(#${t})" stroke="#0b3a8f"/>
<path d="M10 9h11.5A1.5 1.5 0 0 1 23 10.5v6a1.5 1.5 0 0 1-1.5 1.5H20v4l-4-4h-6a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 10 9z" fill="#fff" stroke="#555"/>
<path d="M11.5 12.5h8M11.5 15h5.5" stroke="#c0392b" stroke-width="1.2"/>
<path d="M3 6h9M3 8.5h6" stroke="#fff" stroke-opacity=".85" stroke-width="1.2"/>
</svg>`}let Fi=null,Mn=null,yl=null;function kx(s){Fi=s,s.addEventListener("pointerdown",t=>{if(!Mn)return;const e=t.target;e.closest(".xp-menu")||e.closest("[data-menu-owner]")||pi()},!0)}function Bx(){return Mn!==null}function pi(){if(!Mn)return!1;let s=Mn;for(;s;)s.el.remove(),s=s.child;Mn=null;const t=yl;return yl=null,t==null||t(),!0}function cu(s,t){const e=G("div",{class:"xp-menu",role:"menu"}),n=[];for(const i of s){if(i==="sep"){e.append(G("div",{class:"xp-menu-sep",role:"separator"}));continue}const r=G("button",{type:"button",role:i.checked!==void 0?"menuitemcheckbox":"menuitem",class:`${i.bold?"bold ":""}${i.submenu?"has-sub":""}`.trim(),html:`<i class="ic">${i.icon??""}</i><span class="lb"></span><span class="sc"></span>`});r.querySelector(".lb").textContent=i.label,r.querySelector(".sc").textContent=i.shortcut??"",i.checked!==void 0&&(r.setAttribute("aria-checked",String(i.checked)),i.checked&&r.classList.add("checked")),i.disabled&&(r.setAttribute("aria-disabled","true"),r.tabIndex=-1);const a=()=>{var u;if(!i.submenu||i.disabled)return;const o=Sl(e);if(!o||((u=o.child)==null?void 0:u.el.dataset.for)===i.label)return;bl(o);const l=r.getBoundingClientRect(),c=hu(cu(i.submenu(),o),l.right-3,l.top-3,l.left+3);c.dataset.for=i.label,o.child={el:c,child:null}};r.addEventListener("pointerenter",()=>{const o=Sl(e);i.submenu?a():o&&bl(o)}),r.addEventListener("click",o=>{var l,c,u,h;if(o.stopPropagation(),!i.disabled){if(i.submenu){a(),(u=(c=(l=Sl(e))==null?void 0:l.child)==null?void 0:c.el.querySelector("button:not([aria-disabled])"))==null||u.focus();return}pi(),(h=i.run)==null||h.call(i)}}),e.append(r),n.push(r)}return e.addEventListener("keydown",i=>{var o,l,c;const r=n.filter(u=>u.getAttribute("aria-disabled")!=="true"),a=r.indexOf(document.activeElement);if(i.key==="ArrowDown"||i.key==="ArrowUp"){i.preventDefault(),i.stopPropagation();const u=r[(a+(i.key==="ArrowDown"?1:-1)+r.length)%r.length];u==null||u.focus()}else i.key==="ArrowRight"&&((o=r[a])!=null&&o.classList.contains("has-sub"))?(i.preventDefault(),i.stopPropagation(),(l=r[a])==null||l.click()):i.key==="ArrowLeft"&&t&&(i.preventDefault(),i.stopPropagation(),bl(t),(c=t.el.querySelector("button.has-sub"))==null||c.focus())}),e}function Sl(s){let t=Mn;for(;t;){if(t.el===s)return t;t=t.child}return null}function bl(s){let t=s.child;for(;t;)t.el.remove(),t=t.child;s.child=null}function hu(s,t,e,n=t){if(!Fi)throw new Error("menu host not set");s.style.left="0px",s.style.top="0px",Fi.append(s);const i=Fi.getBoundingClientRect(),r=s.offsetWidth,a=s.offsetHeight;let o=t-i.left,l=e-i.top;return o+r>i.width-2&&(o=Math.max(2,n-i.left-r)),l+a>i.height-32&&(l=Math.max(2,i.height-32-a)),s.style.left=`${Math.round(o)}px`,s.style.top=`${Math.round(l)}px`,s}function Ms(s,t,e,n,i=!1){var a;pi();const r=cu(s,null);Mn={el:r,child:null},hu(r,t,e),yl=n??null,i&&((a=r.querySelector("button:not([aria-disabled])"))==null||a.focus())}function uu(s,t,e){const n=t.getBoundingClientRect();if(Ms(s,n.right-2,n.top-3,e),Mn){const i=Fi==null?void 0:Fi.getBoundingClientRect();i&&n.right+Mn.el.offsetWidth>i.right&&(Mn.el.style.left=`${Math.max(2,n.left-i.left-Mn.el.offsetWidth+2)}px`)}}function zx(s,t){s.addEventListener("contextmenu",e=>{const n=e.target;if(n.closest("input, textarea, [contenteditable], .oikos-tube"))return;const i=t(n,e);if(i!==null){if(e.preventDefault(),!i.length){pi();return}Ms(i,e.clientX,e.clientY)}})}function G(s,t={},e=[]){const n=document.createElement(s);for(const[i,r]of Object.entries(t))i==="html"?n.innerHTML=r:n.setAttribute(i,r);for(const i of e)n.append(i);return n}function wl(s){const t=G("div",{class:"xp-menubar",role:"menubar"});let e=null;const n=(i,r,a)=>{var c;const o=(c=s[r])==null?void 0:c.call(s);if(!o)return;const l=i.getBoundingClientRect();Ms(o,l.left,l.bottom,()=>{i.classList.remove("open"),e===i&&(e=null)},a),i.classList.add("open"),e=i};for(const i of Object.keys(s)){const r=G("button",{type:"button",class:"xp-menutitle",role:"menuitem","aria-haspopup":"menu","data-menu-owner":""},[i]);r.addEventListener("click",()=>{e===r?pi():n(r,i,!1)}),r.addEventListener("pointerenter",()=>{e&&e!==r&&Bx()&&n(r,i,!1)}),r.addEventListener("keydown",a=>{(a.key==="ArrowDown"||a.key==="Enter"||a.key===" ")&&(a.preventDefault(),n(r,i,!0))}),t.append(r)}return t.append(G("span",{class:"xp-throbber",html:Js(18,!0)})),t}function du(s){const t=G("div",{class:"xp-toolbar"}),e=(a,o,l,c=!0)=>{const u=G("button",{class:"xp-tb",type:"button",title:o,html:`${a}${c?`<span>${o}</span>`:""}`});return l?u.addEventListener("click",l):u.disabled=!0,t.append(u),u},n=e(Cx(),"Back",s.back),i=e(Rx(),"Forward",s.forward,!1);e(Px(),"Up",s.up,!1),t.append(G("span",{class:"xp-tb-sep"})),e(Lx(),"Search",s.search),e(Dx(),"Folders",s.folders);const r=()=>{if(!s.can)return;const a=s.can();n.disabled=!s.back||!a.back,i.disabled=!s.forward||!a.forward};return r(),{el:t,refresh:r}}function fu(s,t,e,n){const i=G("div",{class:"xp-address"});i.append(G("span",{class:"lbl"},["Address"]));const r=G("label",{class:"field",html:s});let a=null;e?(a=G("input",{type:"text",value:t,"aria-label":"Address",spellcheck:"false"}),a.style.cssText="flex:1;min-width:0;border:0;outline:0;font:inherit;background:transparent;",r.append(a),a.addEventListener("keydown",l=>{l.key==="Enter"&&a&&(n==null||n(a.value)),l.stopPropagation()})):r.append(G("span",{},[t])),i.append(r);const o=G("button",{class:"go",type:"button",html:`${Ix()}<span>Go</span>`});return o.addEventListener("click",()=>n==null?void 0:n((a==null?void 0:a.value)??t)),i.append(o),{el:i,input:a}}function ys(s,t,e=!1){const n=G("section",{class:`xp-taskgroup${e?" primary":""}`}),i=G("header",{role:"button",tabindex:"0","aria-expanded":"true"},[s]),r=()=>{n.classList.toggle("collapsed"),i.setAttribute("aria-expanded",String(!n.classList.contains("collapsed")))};i.addEventListener("click",r),i.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),r())}),n.append(i);const a=G("div",{class:"xp-taskbody"});if(t instanceof HTMLElement)a.append(t);else{const o=G("ul");for(const l of t){const c=G("li");let u;if(l.href)u=G("a",{class:"xp-link",href:l.href,html:`${l.icon}<span></span>`}),l.external&&(u.setAttribute("target","_blank"),u.setAttribute("rel","noopener"));else{u=G("button",{class:"xp-link",type:"button",html:`${l.icon}<span></span>`});const d=l.run;d?u.addEventListener("click",d):u.setAttribute("aria-disabled","true")}const h=u.querySelector("span");h&&(h.textContent=l.label),c.append(u),o.append(c)}a.append(o)}return n.append(a),n}function pu(){const s=G("div",{class:"xp-statusbar",role:"status"}),t=G("span"),e=G("span",{class:"zone"});return s.append(t,e),{el:s,set(n,i){t.textContent=n;const[r,a]=i==="computer"?[Qh(),"My Computer"]:[jh(),"Internet"];e.innerHTML=`${r}<span>${a}</span>`}}}const Hx={dreams:["chronicle","dreams-api","dream_gen"],chronicle:["dreams","dream_gen"],"dreams-api":["dreams","chronicle"],dream_gen:["dreams","chronicle"],transmissions:["irc","syrinx"],apeiron:["dreams","syrinx"],syrinx:["apeiron","transmissions"],irc:["transmissions","parlor"],parlor:["irc","transmissions"]};function mu(s){return/^https?:/.test(s.href)?s.href:`${location.origin}${s.href}`}function gu(s){return s.group==="here"?"computer":"internet"}function El(s,t){var i;const e=mu(t),n=(i=navigator.clipboard)==null?void 0:i.writeText(e);if(!n){s.balloon("Could not copy",e);return}n.then(()=>s.balloon("Copied",e),()=>s.balloon("Could not copy",e))}function na(s,t,e=!1){const n=[];return e?n.push({label:`Open ${t.title}`,bold:!0,run:()=>s.open(t)}):(n.push({label:"Play",bold:!0,run:()=>s.play(t.id)}),n.push({label:`Go to ${t.title}`,run:()=>s.open(t)})),n.push({label:"Look at its screen",run:()=>s.look(t.id),disabled:!s.canTune}),t.tune&&n.push({label:"Watch it here",run:()=>s.tuneIn(t.id),disabled:!s.canTune}),t.id==="irc"&&n.push({label:"Join in mIRC",run:()=>s.chat()}),n.push("sep",{label:"Copy Address",run:()=>El(s,t)}),e||n.push("sep",{label:"Properties",run:()=>s.play(t.id)}),n}function _u(s,t){return[{label:"Undo",shortcut:"Ctrl+Z",disabled:!0},"sep",{label:"Cut",shortcut:"Ctrl+X",disabled:!0},{label:"Copy",shortcut:"Ctrl+C",disabled:!t,run:()=>t&&El(s,t)},{label:"Paste",shortcut:"Ctrl+V",disabled:!0},"sep",{label:"Select All",shortcut:"Ctrl+A",disabled:!0},{label:"Invert Selection",disabled:!0}]}function xu(s){return[{label:"Add to Favorites...",disabled:!0},{label:"Organize Favorites...",disabled:!0},"sep",...s.dir.sites.filter(t=>t.group==="here").map(t=>({label:t.title,icon:vn(t.accent),run:()=>s.play(t.id)}))]}function vu(){return[{label:"Map Network Drive...",disabled:!0},{label:"Disconnect Network Drive...",disabled:!0},{label:"Synchronize...",disabled:!0},"sep",{label:"Folder Options...",disabled:!0}]}function Mu(s){return[{label:"Help and Support Center",disabled:!0},"sep",{label:"About æthera",run:()=>s.about()}]}function Tl(s){s.hidden=!s.hidden}function yu(s,t){return[{label:"Toolbars",submenu:()=>[{label:"Standard Buttons",checked:!t.toolbar.hidden,run:()=>Tl(t.toolbar)},{label:"Address Bar",checked:!t.address.hidden,run:()=>Tl(t.address)}]},{label:"Status Bar",checked:!t.status.hidden,run:()=>Tl(t.status)},...t.views?["sep",...t.views]:[],"sep",{label:"Go To",submenu:()=>[{label:"Back",shortcut:"Alt+Left",disabled:!s.canBack,run:()=>s.back()},{label:"Forward",shortcut:"Alt+Right",disabled:!s.canForward,run:()=>s.forward()},{label:"Up One Level",disabled:!t.up,run:()=>{var e;return(e=t.up)==null?void 0:e.call(t)}},"sep",{label:"Home Page",shortcut:"Alt+Home",run:()=>s.home()}]},{label:"Refresh",shortcut:"F5",run:()=>t.refresh()}]}class Gx{constructor(t,e){I(this,"win",null);I(this,"selected",null);I(this,"tiles",new Map);I(this,"tasks",null);I(this,"status",null);I(this,"content",null);I(this,"view","tiles");this.shell=t,this.wm=e}get isOpen(){return!!this.win&&!this.win.closed}open(){var u;if(this.isOpen&&this.win){this.win.minimized?this.win.restore():this.win.focus();return}this.tiles.clear();const t=G("div");t.style.cssText="display:flex;flex-direction:column;min-height:0;flex:1;";const{dir:e}=this.shell,n=du({back:()=>this.shell.back(),forward:()=>this.shell.forward(),can:()=>({back:this.shell.canBack,forward:this.shell.canForward}),search:()=>{var h;return(h=i.input)==null?void 0:h.focus()},folders:()=>{var h;return(h=this.tasks)==null?void 0:h.toggleAttribute("hidden")}}),i=fu(Zs(),"~/æthera",!0,h=>this.go(h));(u=i.input)==null||u.addEventListener("input",()=>{var h;return this.filter(((h=i.input)==null?void 0:h.value)??"")}),this.status=pu();const r=()=>this.selected?this.shell.site(this.selected)??null:null;t.append(wl({File:()=>this.fileMenu(),Edit:()=>_u(this.shell,r()),View:()=>{var h;return yu(this.shell,{toolbar:n.el,address:i.el,status:((h=this.status)==null?void 0:h.el)??G("div"),views:this.viewItems(),refresh:()=>{i.input&&(i.input.value="~/æthera"),this.filter("")}})},Favorites:()=>xu(this.shell),Tools:()=>vu(),Help:()=>Mu(this.shell)}),n.el,i.el);const a=this.shell.onNav(()=>n.refresh()),o=G("div",{class:"xp-body"});this.tasks=G("aside",{class:"xp-tasks"}),o.append(this.tasks);const l=G("div",{class:`xp-content view-${this.view}`,role:"listbox","aria-label":"tapes"});this.content=l,l.addEventListener("pointerdown",h=>{h.button===0&&!h.target.closest(".xp-tile")&&this.select(null)});const c=(h,d)=>{if(!d.length)return;l.append(G("h3",{class:"xp-group-head"},[h]));const f=G("div",{class:"xp-tiles"});for(const p of d)f.append(this.tile(p));l.append(f)};if(c("Tapes Stored on This Server",e.sites.filter(h=>h.group==="here")),c("Other Places on the Wired",e.sites.filter(h=>h.group==="wired")),e.files.length){l.append(G("h3",{class:"xp-group-head"},["Files"]));const h=G("div",{class:"xp-tiles"});for(const d of e.files){const f=d.title.split(".").pop()??"txt",p=G("a",{class:"xp-tile",href:d.href,html:`${vs(f)}<span><span class="t"></span><span class="k"></span></span>`});p.querySelector(".t").textContent=d.title,p.querySelector(".k").textContent=d.about,h.append(p)}l.append(h)}o.append(l),t.append(o),t.append(this.status.el),this.win=this.wm.open({id:"home",title:"~  (home directory)",icon:Zs(),body:t,width:Math.round(Math.min(680,Math.max(420,innerWidth*.46))),dock:"left",onClose:()=>{a(),this.win=null,this.content=null,this.selected=null}}),this.win.el.style.height="min(560px, calc(100% - 40px))",this.renderTasks(),this.renderStatus()}close(){var t;(t=this.win)==null||t.close()}fileMenu(){const t=this.selected?this.shell.site(this.selected):void 0;return[...t?na(this.shell,t):[{label:"Play",bold:!0,disabled:!0}],"sep",{label:"New",disabled:!0,submenu:()=>[]},"sep",{label:"Create Shortcut",disabled:!0},{label:"Delete",disabled:!0},{label:"Rename",disabled:!0},"sep",{label:"Close",run:()=>this.close()}]}viewItems(){const t=e=>()=>{this.view=e,this.content&&(this.content.className=`xp-content view-${e}`)};return[{label:"Tiles",checked:this.view==="tiles",run:t("tiles")},{label:"Icons",checked:this.view==="icons",run:t("icons")},{label:"List",checked:this.view==="list",run:t("list")}]}contextFor(t){const e=this.shell.site(t);return e?(this.select(t,!0),na(this.shell,e)):null}blankMenu(){return[{label:"View",submenu:()=>this.viewItems()},{label:"Arrange Icons By",disabled:!0,submenu:()=>[]},"sep",{label:"Refresh",run:()=>this.filter("")},"sep",{label:"Paste",disabled:!0},{label:"Paste Shortcut",disabled:!0},"sep",{label:"New",disabled:!0,submenu:()=>[]},"sep",{label:"Properties",disabled:!0}]}tile(t){const e=G("button",{class:"xp-tile",type:"button",role:"option","data-id":t.id,html:`${vn(t.accent,t.title)}<span><span class="t"></span><span class="k"></span><span class="d"></span></span>`});return e.querySelector(".t").textContent=t.title,e.querySelector(".k").textContent=t.kind,e.querySelector(".d").textContent=t.tagline,e.title=t.tagline,e.addEventListener("click",()=>this.select(t.id,!0)),e.addEventListener("dblclick",()=>this.shell.play(t.id)),e.addEventListener("keydown",n=>{if(n.key==="Enter"&&this.shell.play(t.id),["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(n.key)){n.preventDefault(),n.stopPropagation();const i=[...this.tiles.values()].filter(o=>!o.hidden),r=i.indexOf(e),a=i[(r+(n.key==="ArrowRight"||n.key==="ArrowDown"?1:-1)+i.length)%i.length];a==null||a.focus(),a!=null&&a.dataset.id&&this.select(a.dataset.id,!0)}}),e.addEventListener("pointerup",n=>{n.pointerType==="touch"&&this.selected===t.id&&e.dataset.armed&&this.shell.play(t.id),e.dataset.armed="1"}),this.tiles.set(t.id,e),e}select(t,e=!1){if(t!==this.selected){this.selected=t;for(const[n,i]of this.tiles)i.classList.toggle("selected",n===t),i.setAttribute("aria-selected",String(n===t)),n!==t&&delete i.dataset.armed;e&&this.shell.select(t),this.renderTasks(),this.renderStatus()}}filter(t){const e=t.replace(/^~\/?(æthera)?\/?/i,"").trim().toLowerCase();for(const[n,i]of this.tiles){const r=this.shell.site(n);i.hidden=!!e&&!`${r==null?void 0:r.title} ${r==null?void 0:r.kind} ${r==null?void 0:r.tagline}`.toLowerCase().includes(e)}}go(t){const e=t.replace(/^~\/?(æthera)?\/?/i,"").trim().toLowerCase();if(!e)return;const n=this.shell.dir.sites.find(i=>i.title.toLowerCase()===e)??this.shell.dir.sites.find(i=>`${i.title} ${i.kind} ${i.tagline}`.toLowerCase().includes(e));n?this.shell.play(n.id):this.shell.balloon("Cannot find it",`There is no tape called “${t}” in ~.`)}renderTasks(){if(!this.tasks)return;const t=this.selected?this.shell.site(this.selected):void 0,e=t?[{icon:Ml(),label:"Play this tape",run:()=>this.shell.play(t.id)},{icon:nu(),label:"Look at its screen",run:()=>this.shell.look(t.id)},{icon:jh(),label:`Go to ${t.title}`,run:()=>this.shell.open(t)}]:[{icon:Ml(),label:"Select a tape to play it"},{icon:iu(),label:"Eject the tape",run:()=>this.shell.eject()}],n=[{icon:Qh(),label:"æthera",href:"/"},{icon:vs("xml"),label:"feed.xml",href:"/feed.xml"},{icon:vs("txt"),label:"llms.txt",href:"/llms.txt"}],i=G("div",{class:"xp-details"});if(t){i.append(G("b",{},[t.title]));const r=G("dl");for(const[a,o]of t.details)r.append(G("dt",{},[a]),G("dd",{},[o]));i.append(r)}else{const r=this.shell.dir.sites.filter(a=>a.group==="here").length;i.append(G("b",{},["~"]),G("span",{},[`home directory · ${r} tapes here, ${this.shell.dir.sites.length-r} elsewhere on the Wired`]))}this.tasks.replaceChildren(ys(t?"Tape Tasks":"System Tasks",e,!0),ys("Other Places",n),ys("Details",i))}renderStatus(){var n;const t=this.selected?this.shell.site(this.selected):void 0,e=this.shell.dir.sites.length+this.shell.dir.files.length;(n=this.status)==null||n.set(t?`${t.title} — ${t.tagline}`:`${e} objects`,t?gu(t):"computer")}}const Vx=4001,Wx=4002,$x=4;class Xx{constructor(t,e,n){I(this,"ws",null);I(this,"tries",0);I(this,"timer",0);I(this,"wanted",!1);I(this,"welcomed",!1);I(this,"refused",!1);this.nick=t,this.password=e,this.on=n}get open(){var t;return this.welcomed&&((t=this.ws)==null?void 0:t.readyState)===WebSocket.OPEN}connect(){this.wanted=!0,this.refused=!1,clearTimeout(this.timer);const t=location.protocol==="https:"?"wss":"ws";let e;try{e=new WebSocket(`${t}://${location.host}/ws/chat`)}catch{this.on.closed(!1,!1,!1);return}this.ws=e,this.welcomed=!1,e.onopen=()=>{e.send(JSON.stringify({type:"hello",nick:this.nick,password:this.password||null}))},e.onmessage=n=>{let i;try{i=JSON.parse(String(n.data))}catch{return}switch(i.type){case"welcome":{const r=i;this.welcomed=!0,this.tries=0,this.nick=r.nick,this.on.welcome(r);break}case"event":{const r=i.event;if(!r)break;r.kind==="nick"&&r.nick===this.nick&&r.target&&(this.nick=r.target),this.on.event(r);break}case"whois":this.on.whois(i);break;case"error":{this.welcomed||(this.refused=!0),this.on.error(String(i.code??""),String(i.text??""));break}}},e.onclose=n=>{if(this.ws!==e)return;this.ws=null;const i=n.code===Vx,r=n.code===Wx,a=this.wanted&&!i&&!r&&!this.refused&&this.tries<$x;if(this.welcomed=!1,this.on.closed(a,i,r),!a){this.wanted=!1;return}this.tries++,this.timer=window.setTimeout(()=>this.connect(),2e3*2**(this.tries-1))}}send(t){if(!this.open||!this.ws)return!1;try{return this.ws.send(JSON.stringify(t)),!0}catch{return!1}}close(){this.wanted=!1,clearTimeout(this.timer);const t=this.ws;if(this.ws=null,this.welcomed=!1,this.password=null,t){t.onclose=null;try{t.close()}catch{}}}}const Bt="#aethera",Pt="#oikos",qn="irc.aetherawi.red",Al=6667,Cl="guest",Su="always falling apart",qx=600,Yx=6e3,bu="oikos-mirc-nick",Kx=/^[A-Za-z[\]\\`_^{|}][A-Za-z0-9[\]\\`_^{|}-]{0,15}$/,Rl=["~","&","@","%","+"];function Zx(s){const t=new Date(s);return`[${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}]`}function Jx(s){return Date.now()-(performance.now()-s)}function Pl(s){const t=Yn(s)||"anon",e=oa(t),n=["dialup.wired.net","cable.aether.org","dsl.lain.jp","adsl.nowhere.nu","res.navi.co"],i=n[Math.floor(e*n.length)]??n[0],r=Math.floor(e*251)+2,a=Math.floor(oa(`${t}.`)*251)+2;return`~${t.slice(0,9).toLowerCase()}@ppp-${r}-${a}.${i}`}function Yn(s){return s.replace(/^[~&@%+]+/,"")}function wu(s){const t=s.charAt(0);return Rl.includes(t)?t:""}function Qx(){try{return localStorage.getItem(bu)??""}catch{return""}}function Eu(s){try{localStorage.setItem(bu,s)}catch{}}function Ll(s){s.addEventListener("keydown",t=>{t.key!=="Escape"&&t.stopPropagation()})}class Dl{constructor(t,e,n){I(this,"tab");I(this,"pane");I(this,"log");I(this,"nicksEl");I(this,"nicks",new Map);I(this,"topic","");I(this,"joined",!1);this.id=t,this.tab=G("button",{type:"button",role:"tab",html:`${e}<span></span>`}),this.tab.querySelector("span").textContent=t==="status"?"Status":t,this.log=G("div",{class:"mirc-log",role:"log","aria-label":t==="status"?"Status":t}),n?(this.log.setAttribute("aria-live","polite"),this.nicksEl=G("ul",{class:"mirc-nicks","aria-label":`Nicknames in ${t}`}),this.pane=G("div",{class:"mirc-pane"},[G("div",{class:"mirc-split"},[this.log,this.nicksEl])])):(this.nicksEl=null,this.pane=G("div",{class:"mirc-pane"},[this.log]))}setNick(t,e=wu(t)){const n=Yn(t);n&&this.nicks.set(n.toLowerCase(),{name:n,mode:e})}seen(t){const e=Yn(t);if(!e)return!1;const n=e.toLowerCase(),i=this.nicks.get(n),r=wu(t)||(i==null?void 0:i.mode)||"";return i&&i.mode===r&&i.name===e?!1:(this.nicks.set(n,{name:e,mode:r}),!0)}drop(t){return this.nicks.delete(Yn(t).toLowerCase())}rename(t,e){const n=this.nicks.get(Yn(t).toLowerCase());this.drop(t),this.setNick(e,(n==null?void 0:n.mode)??"")}render(){if(!this.nicksEl)return;const t=n=>n?Rl.indexOf(n):Rl.length,e=[...this.nicks.values()].sort((n,i)=>t(n.mode)-t(i.mode)||n.name.localeCompare(i.name,void 0,{sensitivity:"base"}));this.nicksEl.replaceChildren(...e.map(n=>G("li",{},[`${n.mode}${n.name}`])))}}class jx{constructor(t,e,n){I(this,"win");I(this,"wins");I(this,"view",Bt);I(this,"input");I(this,"me",Cl);I(this,"link",null);I(this,"hintedOikos",!1);I(this,"livingSeenAt",0);I(this,"livingOnce",!1);I(this,"hung",!1);I(this,"lastAt",-1);I(this,"seenFragments");I(this,"seenCollapse",null);I(this,"wasConnected",!1);I(this,"rejoinTimer",0);I(this,"off");var l;this.shell=t,this.wm=e;const i=G("div",{class:"mirc"});i.append(wl({File:()=>[{label:"Connect...",run:()=>this.joinLiving(),disabled:!!this.link},{label:"Disconnect",run:()=>this.partLiving(),disabled:!this.link},"sep",{label:"Select Server...",disabled:!0},"sep",{label:"Exit",run:()=>this.win.close()}],Tools:()=>[{label:"Address Book...",disabled:!0},{label:"Options...",shortcut:"Alt+O",disabled:!0}],Commands:()=>[{label:`Join ${Pt}`,run:()=>this.joinLiving()},{label:`Part ${Pt}`,run:()=>this.partLiving(),disabled:!this.link},"sep",{label:"Clear buffer",run:()=>this.wins[this.view].log.replaceChildren()}],Window:()=>["status",Bt,Pt].filter(c=>!this.wins[c].tab.hidden).map(c=>({label:c==="status"?"Status":c,checked:this.view===c,run:()=>this.show(c)})),Help:()=>[{label:"Commands",shortcut:"F1",run:()=>this.help()},"sep",{label:"About æthera",run:()=>this.shell.about()}]}));const r=G("div",{class:"mirc-switch",role:"tablist"});this.wins={status:new Dl("status",fi("status"),!1),[Bt]:new Dl(Bt,fi("channel"),!0),[Pt]:new Dl(Pt,fi("channel"),!0)},this.wins[Bt].topic=Su,this.wins[Pt].tab.hidden=!0;const a=G("div",{class:"mirc-mdi"});for(const c of Object.values(this.wins))c.tab.addEventListener("click",()=>this.show(c.id)),r.append(c.tab),a.append(c.pane);this.input=G("input",{class:"mirc-input",type:"text",spellcheck:"false",autocomplete:"off",maxlength:"400","aria-label":"Message"}),Ll(this.input),this.input.addEventListener("keydown",c=>{if(c.key!=="Enter")return;c.preventDefault();const u=this.input.value;this.input.value="",this.say(u)}),i.append(r,a,this.input),this.win=e.open({id:"mirc",title:"mIRC",icon:fi("app"),body:i,width:Math.round(Math.min(760,Math.max(460,innerWidth*.52))),dock:"center",onClose:()=>{var c,u;clearTimeout(this.rejoinTimer),this.off(),(c=this.link)==null||c.close(),this.link=null,(u=this.wm.get("mirc-connect"))==null||u.close(),n()},onFocus:()=>{innerWidth>720&&this.input.focus({preventScroll:!0})}}),this.win.el.classList.add("mirc-window"),this.win.el.style.height="min(540px, calc(100% - 24px))";const o=this.shell.feeds.irc.value;this.seenFragments=o.fragments,this.seenCollapse=((l=o.collapse)==null?void 0:l.at)??null,this.show(Bt),o.connected?this.connect(o):this.push("status","info",`* Connecting to ${qn} (${Al})`),this.off=this.shell.feeds.irc.on(c=>this.update(c))}focus(){this.win.minimized?this.win.restore():this.win.focus()}update(t){var n;if(t.connected&&!this.wasConnected?this.connect(t):!t.connected&&this.wasConnected&&this.disconnect(),!t.connected)return;for(const i of t.lines)i.at<=this.lastAt||(this.rejoinTimer&&this.rejoin(),this.lastAt=i.at,this.line(i));const e=((n=t.collapse)==null?void 0:n.at)??null;e!==null&&e!==this.seenCollapse&&t.collapse&&this.collapse(t.collapse.type),this.seenCollapse=e,t.fragments!==this.seenFragments&&(this.seenFragments=t.fragments,clearTimeout(this.rejoinTimer),this.hung?this.rejoinTimer=window.setTimeout(()=>this.rejoin(),Yx):this.rejoin())}connect(t){this.wasConnected=!0;const e=(i,r)=>this.push("status",i,r);e("info",`* Connecting to ${qn} (${Al})`),e("notice",`-${qn}- *** Looking up your hostname...`),e("notice",`-${qn}- *** Found your hostname`),e("text",`Welcome to the æthera IRC Network ${this.me}!${this.me}@oikos`),e("text",`Your host is ${qn}, running version hauntd-2.8.21`),e("text",`- ${qn} Message of the Day -`),e("text","- nobody here is who they were."),e("text","- every line is a replay; every replay is live."),e("text",`- ${Bt} is moderated: the living listen.`),e("text",`- the living talk in ${Pt}. /join ${Pt}`),e("text","End of /MOTD command."),e("mode",`* ${this.me} sets mode: +i`),this.joinHaunted();const n=t.lines.filter(i=>i.at>this.lastAt);if(n.length){this.push(Bt,"info","*** Buffer Playback...");for(const i of n)this.line(i);this.push(Bt,"info","*** Playback Complete.")}this.lastAt=Math.max(this.lastAt,...t.lines.map(i=>i.at)),t.collapse&&this.collapse(t.collapse.type)}joinHaunted(){const t=this.wins[Bt];t.joined=!0,t.nicks.clear(),t.setNick(this.me,""),this.push(Bt,"join",`* Now talking in ${Bt}`),this.push(Bt,"topic",`* Topic is '${t.topic}'`),this.push(Bt,"topic","* Set by ChanServ"),this.nicksChanged(Bt)}disconnect(){clearTimeout(this.rejoinTimer),this.rejoinTimer=0,this.wasConnected=!1;const t=this.wins[Bt];t.joined=!1,this.setHung(!1),this.push("status","info",`* Disconnected from ${Bt}`),this.push(Bt,"info","* Disconnected"),t.nicks.clear(),this.nicksChanged(Bt)}collapse(t){const e=t.replace(/_/g," ");this.push("status","notice",`-${qn}- *** Notice -- ${e} on ${Bt}`),this.setHung(!0)}rejoin(){clearTimeout(this.rejoinTimer),this.rejoinTimer=0,this.setHung(!1),this.push(Bt,"info",`* Attempting to rejoin channel ${Bt}`),this.wins[Bt].topic=Su,this.joinHaunted()}line(t){const e=this.wins[Bt],n=t.nick,i=Yn(n),r=t.content,a=Jx(t.at),o=(c,u)=>this.push(Bt,c,u,a);let l=!1;switch(t.type){case"message":l=e.seen(n),o("text",`<${n}> ${r}`);break;case"action":{const c=/^sets mode: ([+-])([a-z]+) (.+)$/i.exec(r);c?(e.seen(n),this.applyMode(c[1]??"+",c[2]??"",(c[3]??"").split(/\s+/)),l=!0,o("mode",`* ${n} ${r}`)):/^has quit\b/i.test(r)?(l=e.drop(n),o("quit",`* ${i} ${r.replace(/^has quit\b/i,"has quit IRC")}`)):(l=e.seen(n),o("action",`* ${n} ${r}`));break}case"join":l=e.seen(n),o("join",`* ${i} (${Pl(n)}) has joined ${Bt}`);break;case"part":l=e.drop(n),o("part",`* ${i} (${Pl(n)}) has left ${Bt}${r?` (${r})`:""}`);break;case"quit":l=e.drop(n),o("quit",`* ${i} (${Pl(n)}) Quit (${r||"Client exited"})`);break;case"kick":{const c=t.reason||r;t.target?(l=e.drop(t.target),o("kick",`* ${Yn(t.target)} was kicked by ${i}${c?` (${c})`:""}`)):o("kick",`* ${i} kicks${c?` (${c})`:""}`);break}default:{const c=/changes topic to '(.*)'$/i.exec(r);if(c){e.topic=c[1]??e.topic,o("topic",`* ${r}`),this.retitle();break}const u=r||n;o("info",/^[*<]/.test(u)||u.length<6?u:`* ${u}`)}}!e.nicks.has(this.me.toLowerCase())&&e.joined&&(e.setNick(this.me,""),l=!0),l&&this.nicksChanged(Bt)}applyMode(t,e,n){const i=this.wins[Bt],r={q:"~",a:"&",o:"@",h:"%",v:"+"};[...e].forEach((a,o)=>{const l=n[o],c=r[a];if(!l||!c)return;const u=i.nicks.get(Yn(l).toLowerCase());i.setNick((u==null?void 0:u.name)??Yn(l),t==="+"?c:(u==null?void 0:u.mode)===c?"":(u==null?void 0:u.mode)??"")})}joinLiving(){if(this.link&&this.wins[Pt].joined){this.show(Pt);return}if(this.link){this.push(this.view,"info",`* Still connecting to ${Pt}...`);return}this.connectDialog()}partLiving(){if(!this.link)return;this.link.close(),this.link=null;const t=this.wins[Pt];t.joined=!1,t.nicks.clear(),this.nicksChanged(Pt),this.push(Pt,"part",`* You have left ${Pt}`),this.push("status","info",`* Disconnected from ${Pt}`),this.livingSeenAt=0,this.livingOnce=!1,this.renameMe(Cl)}connectDialog(t){var u;(u=this.wm.get("mirc-connect"))==null||u.close();const e=G("form",{class:"mirc-connect"}),n=G("input",{type:"text",value:Qx(),maxlength:"16",spellcheck:"false",autocomplete:"nickname",required:""}),i=G("input",{type:"password",maxlength:"256",autocomplete:"current-password"});Ll(n),Ll(i);const r=G("p",{class:"err",role:"alert"});r.textContent=t??"",r.hidden=!t,e.append(G("div",{class:"xp-dialog-body"},[G("span",{html:fi("app")}),G("div",{},[G("p",{},[`Join ${Pt}, where the living talk.`]),G("label",{},["Nickname:",n]),G("label",{},["Password (optional):",i]),G("p",{class:"hint"},["A password gives you a tripcode, the same one your blog comments carry. It is never stored."]),r])]));const a=G("div",{class:"xp-actions"}),o=G("button",{class:"xp-btn default",type:"submit"},["Connect"]),l=G("button",{class:"xp-btn",type:"button"},["Cancel"]);a.append(o,l),e.append(a);const c=this.wm.open({id:"mirc-connect",title:"mIRC Connect",icon:fi("app"),body:e,width:360,dialog:!0});l.addEventListener("click",()=>c.close()),e.addEventListener("submit",h=>{h.preventDefault();const d=n.value.trim();if(!Kx.test(d)){r.textContent="A nickname starts with a letter and has at most 16 letters, digits or - _ [ ] { } | ^ `",r.hidden=!1,n.focus();return}Eu(d),c.close(),this.dial(d,i.value||null)}),n.focus(),n.select()}dial(t,e){this.push("status","info",`* Connecting to ${Pt} as ${t}${e?" (with a tripcode)":""}`);const n=new Xx(t,e,{welcome:i=>this.welcomed(i),event:i=>this.event(i),whois:i=>this.whoisReply(i),error:(i,r)=>this.chatError(i,r),closed:(i,r,a)=>this.dropped(i,r,a)});this.link=n,n.connect()}welcomed(t){const e=this.wins[Pt];e.tab.hidden=!1,e.joined=!0,e.topic=t.topic,e.nicks.clear();for(const r of t.names)e.setNick(r.nick,r.op?"@":"");this.renameMe(t.nick);const n=this.livingOnce;this.livingOnce=!0;const i=t.backlog.filter(r=>r.at>this.livingSeenAt);if(n?this.push(Pt,"join",`* Rejoined ${Pt}`):(this.push("status","text",`* You are now known as ${t.nick} (${t.mask})`),t.op&&this.push("status","mode",`* ${qn} sets mode: +o ${t.nick}`),this.push(Pt,"join",`* Now talking in ${Pt}`),this.push(Pt,"topic",`* Topic is '${t.topic}'`)),i.length){this.push(Pt,"info","*** Buffer Playback...");for(const r of i)this.event(r,!0);this.push(Pt,"info","*** Playback Complete.")}this.nicksChanged(Pt),this.show(Pt)}event(t,e=!1){const n=this.wins[Pt],i=(a,o)=>this.push(Pt,a,o,t.at),r=t.nick===this.me;switch(this.livingSeenAt=Math.max(this.livingSeenAt,t.at),t.kind){case"message":i(r?"own":"text",`<${t.nick}> ${t.text}`);return;case"action":i("action",`* ${t.nick} ${t.text}`);return;case"join":i("join",`* ${t.nick} (${t.mask??""}) has joined ${Pt}`),e||n.setNick(t.nick,"");break;case"part":case"quit":i("quit",`* ${t.nick} (${t.mask??""}) Quit (${t.text||"Client exited"})`),e||n.drop(t.nick);break;case"kick":t.target===this.me&&!e?(i("kick",`* You were kicked from ${Pt} by ${t.nick} (${t.text})`),n.joined=!1,n.nicks.clear()):(i("kick",`* ${t.target??"?"} was kicked by ${t.nick} (${t.text})`),!e&&t.target&&n.drop(t.target));break;case"nick":r&&!e&&t.target?(i("text",`* Your nick is now ${t.target}`),this.renameMe(t.target),Eu(t.target)):i("text",`* ${t.nick} is now known as ${t.target??"?"}`),!e&&t.target&&n.rename(t.nick,t.target);break;case"topic":i("topic",`* ${t.nick} changes topic to '${t.text}'`),e||(n.topic=t.text);break}e||this.nicksChanged(Pt)}whoisReply(t){const e=n=>this.push(this.view,"text",n);e(`${t.nick} is ${t.mask} * ${t.nick}`),t.trip&&e(`${t.nick} is identified by tripcode ${t.trip}`),t.op&&e(`${t.nick} is a channel operator on ${Pt}`),e(`${t.nick} signed on ${new Date(t.signon).toLocaleString()}`),e(`${t.nick} End of /WHOIS list.`)}chatError(t,e){var r;const n=this.wins[Pt],i=e.replace(/^(\S+) :/,"$1 ");this.push(n.joined?Pt:"status","error",`* ${i}`),!n.joined&&(t==="432"||t==="433")&&((r=this.link)==null||r.close(),this.link=null,this.connectDialog(e.replace(/^\S+ :/,"")))}dropped(t,e,n){const i=this.wins[Pt],r=i.joined;i.joined=!1,i.nicks.clear(),this.nicksChanged(Pt),n?this.push(Pt,"info",`* ${this.me} is connected from somewhere else now (another window?); this one let go`):r&&!e&&this.push(Pt,"info",`* Disconnected${t?" (reconnecting...)":""}`),this.push("status","info",`* Disconnected from ${Pt}${t?" (reconnecting...)":""}`),t||(this.link=null,this.renameMe(Cl))}renameMe(t){if(t===this.me)return;const e=this.wins[Bt];e.joined&&(e.rename(this.me,t),this.nicksChanged(Bt)),this.me=t,this.retitle()}say(t){var o,l,c,u,h,d;const e=t.trim();if(!e)return;const n=this.view,i=n===Pt&&this.wins[Pt].joined&&!!this.link,r=f=>this.push(n,"error",`* ${f}`);if(e.startsWith("/")&&!e.startsWith("//")){const[f="",...p]=e.slice(1).split(/\s+/),v=p.join(" ");switch(f.toLowerCase()){case"help":this.help();return;case"clear":this.wins[n].log.replaceChildren();return;case"quit":case"exit":this.win.close();return;case"join":{const m=(p[0]??"").toLowerCase().replace(/^#?/,"#");m===Pt||m==="#"&&n==="status"?this.joinLiving():m===Bt?(this.show(Bt),this.push(Bt,"error",`* You are already on ${Bt}`)):r(`${p[0]??"#"} Cannot join channel (this network has ${Bt} and ${Pt})`);return}case"part":case"leave":n===Pt&&this.link?this.partLiving():r(n===Bt?`${Bt} will not let you go`:"You are not on a channel");return;case"nick":p[0]?(o=this.link)!=null&&o.send({type:"nick",nick:p[0]})||r(`Join ${Pt} first to have a name (/join ${Pt})`):r("Usage: /nick <newnick>");return;case"whois":p[0]?(l=this.link)!=null&&l.send({type:"whois",nick:p[0]})||r(`${p[0]} :No such nick`):r("Usage: /whois <nick>");return;case"me":if(!v)return;i?(c=this.link)==null||c.send({type:"say",text:v,action:!0}):n===Bt?this.refused(`* ${this.me} ${v}`,"action"):r("You are not on a channel");return;case"topic":i&&v?(u=this.link)==null||u.send({type:"topic",text:v}):i?this.push(Pt,"topic",`* Topic is '${this.wins[Pt].topic}'`):r(`${n==="status"?"":`${n} `}You're not channel operator`);return;case"kick":i&&p[0]?(h=this.link)==null||h.send({type:"kick",nick:p[0],reason:p.slice(1).join(" ")}):r(i?"Usage: /kick <nick> [reason]":"You're not channel operator");return;default:r(`${f.toUpperCase()} Unknown command`);return}}const a=e.startsWith("//")?e.slice(1):e;i?(d=this.link)!=null&&d.send({type:"say",text:a})||r("Not connected"):n===Bt&&this.wins[Bt].joined?this.refused(`<${this.me}> ${a}`,"own"):r("You are not on a channel")}refused(t,e){this.push(Bt,e,t),this.push(Bt,"error",`* ${Bt} Cannot send to channel`),this.hintedOikos||(this.hintedOikos=!0,this.push(Bt,"info",`* (the living talk in ${Pt}: /join ${Pt})`))}help(){const t=e=>this.push(this.view,"info",e);t("* Commands:"),t(`*   /join ${Pt}           join the living (a nick, and a password for a tripcode if you like)`),t("*   /nick <name>           change your nick"),t("*   /me <does something>   an action"),t("*   /whois <nick>          who someone is (their tripcode, if they have one)"),t(`*   /part                  leave ${Pt}`),t("*   /topic, /kick          for channel operators"),t("*   /clear  /quit")}push(t,e,n,i=Date.now()){var c;const r=this.wins[t],a=r.log,o=a.scrollHeight-a.scrollTop-a.clientHeight<24,l=G("div",{class:`mirc-row t-${e}`});for(l.append(G("span",{class:"ts"},[Zx(i)]),` ${n}`),a.append(l);a.childElementCount>qx;)(c=a.firstElementChild)==null||c.remove();o&&(a.scrollTop=a.scrollHeight),t!==this.view&&(t!=="status"&&(e==="text"||e==="action"||e==="own")?r.tab.classList.add("said"):r.tab.classList.contains("said")||r.tab.classList.add("event"))}show(t){this.view=t;for(const n of Object.values(this.wins)){const i=n.id===t;n.pane.hidden=!i,n.tab.classList.toggle("on",i),n.tab.setAttribute("aria-selected",String(i)),i&&n.tab.classList.remove("said","event")}const e=this.wins[t].log;e.scrollTop=e.scrollHeight,this.input.setAttribute("aria-label",t==="status"?"Command":`Message ${t}`),this.retitle()}nicksChanged(t){this.wins[t].render(),this.retitle()}setHung(t){this.hung!==t&&(this.hung=t,this.win.el.classList.toggle("mirc-hung",t),this.retitle())}retitle(){const t=this.wins[this.view],e=t.id===Bt?"+mnt":"+nt",n=t.id==="status"?`mIRC - [Status: ${this.me} on ${qn} (${Al})]`:t.joined?`mIRC - [${t.id} [${t.nicks.size}] [${e}]: ${t.topic}]`:`mIRC - [${t.id} (not on channel)]`;this.win.setTitle(this.hung?`${n} (Not Responding)`:n)}}class tv{constructor(t,e,n,i){I(this,"win");I(this,"statusLine");I(this,"timer",0);this.site=t,this.shell=e;const r=G("div");r.style.cssText="display:flex;flex-direction:column;min-height:0;flex:1;";const a=du({back:()=>this.shell.back(),forward:()=>this.shell.forward(),can:()=>({back:this.shell.canBack,forward:this.shell.canForward}),up:()=>this.shell.home(),folders:()=>d.toggleAttribute("hidden")}),o=mu(t),l=fu(vn(t.accent),o,!1,()=>this.shell.open(t)).el,c=pu();r.append(wl({File:()=>[...na(this.shell,t,!0),"sep",{label:"Properties",disabled:!0},"sep",{label:"Close",run:()=>this.win.close()}],Edit:()=>_u(this.shell,t),View:()=>yu(this.shell,{toolbar:a.el,address:l,status:c.el,up:()=>this.shell.home(),refresh:()=>this.refresh()}),Favorites:()=>xu(this.shell),Tools:()=>vu(),Help:()=>Mu(this.shell)}),a.el,l);const u=this.shell.onNav(()=>a.refresh()),h=G("div",{class:"xp-body"}),d=G("aside",{class:"xp-tasks"});h.append(d);const f=G("div",{class:"xp-content"});h.append(f),r.append(h),c.set("Done",gu(t)),r.append(c.el);const p=G("div",{class:"xp-hero",html:vn(t.accent,t.title)}),v=G("div");v.append(G("h2",{},[t.title]),G("p",{},[t.tagline])),p.append(v),f.append(p);const m=G("button",{class:"xp-preview",type:"button","aria-label":`Open ${t.title}`}),g=this.shell.screens.get(t.id);g&&m.append(g.canvas),m.append(G("span",{class:"xp-play"},[`▶  open ${t.title}`])),m.addEventListener("click",L=>this.shell.open(t,L)),f.append(m),f.append(G("p",{class:"xp-about"},[t.about]));const w=this.note();w&&f.append(G("div",{class:"xp-note"},[w]));const E=G("div",{class:"xp-actions"}),M=G("button",{class:"xp-btn default",type:"button"},[`Open ${t.title}`]);M.addEventListener("click",L=>this.shell.open(t,L));const S=G("button",{class:"xp-btn",type:"button"},["~ Home directory"]);if(S.addEventListener("click",()=>this.shell.home()),E.append(M),t.tune&&this.shell.canTune){const L=G("button",{class:"xp-btn",type:"button"},["▣ Watch it here"]);L.title="the live page, on its own screen in the room",L.addEventListener("click",()=>this.shell.tuneIn(t.id)),E.append(L)}if(t.id==="irc"){const L=G("button",{class:"xp-btn",type:"button"},["Join #aethera"]);L.title="sit in the channel, in mIRC",L.addEventListener("click",()=>this.shell.chat()),E.append(L)}E.append(S),f.append(E);const b=[{icon:Ml(),label:`Open ${t.title}`,run:()=>this.shell.open(t)},{icon:nu(),label:"Look at its screen",run:()=>this.shell.look(t.id)}];t.tune&&this.shell.canTune&&b.splice(1,0,{icon:Nx(),label:"Watch it on its screen",run:()=>this.shell.tuneIn(t.id)}),t.id==="irc"&&b.splice(1,0,{icon:fi("channel"),label:"Join #aethera in mIRC",run:()=>this.shell.chat()}),b.push({icon:Ux(),label:"Copy address",run:()=>El(this.shell,t)}),b.push({icon:iu(),label:"Eject tape",run:()=>this.win.close()});const R=[{icon:Zs(),label:"~ (home directory)",run:()=>this.shell.home()}];for(const L of Hx[t.id]??[]){const D=this.shell.site(L);D&&R.push({icon:vn(D.accent),label:D.title,run:()=>this.shell.play(D.id)})}const x=G("div",{class:"xp-details"});x.append(G("b",{},[t.title]));const T=G("dl");for(const[L,D]of t.details)T.append(G("dt",{},[L]),G("dd",{},[D]));x.append(T),this.statusLine=G("div",{class:"status"}),x.append(this.statusLine),d.append(ys("Tape Tasks",b,!0),ys("Other Places",R),ys("Details",x)),this.win=n.open({id:`site:${t.id}`,title:`${t.title} — ${o.replace(/^https?:\/\//,"")}`,icon:vn(t.accent),body:r,width:Math.round(Math.min(760,Math.max(440,innerWidth*.5))),dock:"right",onClose:()=>{u(),clearInterval(this.timer),g==null||g.canvas.remove(),i()}}),this.win.el.style.height="min(640px, calc(100% - 24px))",this.refresh(),this.timer=window.setInterval(()=>this.refresh(),2e3)}note(){const t=this.site;return t.id==="dreams"?"Opening dreams wakes the dreamer: a GPU starts up while anyone is watching and goes back to sleep after. The frame here is the last one the chronicle kept.":t.id==="syrinx"?"Syrinx makes sound once you wake it. The creature here is read from this browser; nobody else sees yours.":t.group==="wired"?`${t.title} is not on this server; it opens in a new window.`:null}refresh(){const{feeds:t}=this.shell;let e=!1,n="";switch(this.site.id){case"dreams":case"dreams-api":{const r=t.dreams.value;e=r.known&&r.awake,n=r.known?r.awake?`awake · frame ${r.frame.toLocaleString("en-US")}${r.viewers?` · ${r.viewers} watching`:""}`:"asleep":"status unknown";break}case"chronicle":{const r=t.chronicle.value;e=r.known&&r.eras.some(a=>a.open),n=r.known?`${r.eraCount||r.eras.length} eras recorded`:"reading the core…";break}case"irc":{const r=t.irc.value;e=r.connected,n=r.connected?"live on #aethera":"connecting…";break}case"syrinx":{const r=t.creature.value;e=!!r,n=r?`yours: ${r.name}`:"not woken in this browser";break}default:return}this.statusLine.className=`status${e?" on":""}`,this.statusLine.innerHTML="<i></i><span></span>";const i=this.statusLine.querySelector("span");i&&(i.textContent=n)}}const Tu=2;class ev{constructor(t,e,n,i){I(this,"el");I(this,"menu");I(this,"buttons");I(this,"clock");I(this,"moonEl");I(this,"start");I(this,"tip");I(this,"balloonEl");I(this,"balloonTimer",0);I(this,"dialogEl",null);this.root=t,this.shell=e,this.wm=n,this.hooks=i,this.el=G("nav",{class:"xp-taskbar","aria-label":"taskbar"}),this.start=G("button",{class:"xp-start",type:"button","aria-haspopup":"menu","aria-expanded":"false",html:`${Js(22,!1)}<span>start</span>`}),this.buttons=G("div",{class:"xp-taskbuttons"});const r=G("div",{class:"xp-tray"}),a=G("span",{class:"tray-icon net",title:"Connected to the Wired",html:Ax()});this.moonEl=G("span",{class:"tray-icon dream",title:"dreams",html:tu(!1)}),this.clock=G("span",{class:"clock"}),r.append(a,this.moonEl,this.clock),this.el.append(this.start,this.buttons,r),t.append(this.el),this.menu=this.buildMenu(),t.append(this.menu),this.start.addEventListener("click",()=>this.toggleMenu()),t.addEventListener("pointerdown",o=>{const l=o.target;!this.menu.hidden&&!l.closest(".xp-startmenu")&&!l.closest(".xp-start")&&!l.closest(".xp-menu")&&this.toggleMenu(!1)}),this.el.addEventListener("contextmenu",o=>{o.preventDefault(),o.stopPropagation();const l=o.target.closest(".xp-taskbtn"),c=l?this.wm.list.find(u=>u.opts.id===l.dataset.win):void 0;Ms(c?c.systemMenu():this.barMenu(),o.clientX,o.clientY)}),a.addEventListener("click",()=>this.balloon("Connected to the Wired",`${e.dir.sites.length} screens · 1 VCR · signal: present day, present time`,this.trayAnchor())),this.tip=G("div",{class:"xp-tip",role:"tooltip",hidden:""}),this.balloonEl=G("div",{class:"xp-balloon",role:"status",hidden:""}),t.append(this.tip,this.balloonEl),n.on(()=>this.renderButtons()),e.feeds.dreams.on(o=>{this.moonEl.innerHTML=tu(o.awake),this.moonEl.title=o.known?o.awake?`dreams: awake · frame ${o.frame.toLocaleString("en-US")}`:"dreams: asleep":"dreams: no answer"}),this.tick(),setInterval(()=>this.tick(),15e3)}tick(){this.clock.textContent=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}trayAnchor(){const t=this.el.getBoundingClientRect();return{x:t.right-60,y:t.top}}toggleMenu(t){var n;const e=t??this.menu.hidden;e||pi(),this.menu.hidden=!e,this.start.classList.toggle("open",e),this.start.setAttribute("aria-expanded",String(e)),e&&((n=this.menu.querySelector("a,button"))==null||n.focus())}barMenu(){return[{label:"Toolbars",disabled:!0,submenu:()=>[]},"sep",{label:"Cascade Windows",disabled:!0},{label:"Tile Windows Horizontally",disabled:!0},{label:"Tile Windows Vertically",disabled:!0},{label:"Show the Desktop",run:()=>this.showDesktop(),disabled:!this.wm.list.some(t=>!t.minimized&&!t.opts.dialog)},"sep",{label:"Task Manager",disabled:!0},"sep",{label:"Lock the Taskbar",checked:!0,disabled:!0},{label:"Properties",disabled:!0}]}showDesktop(){for(const t of[...this.wm.list])!t.opts.dialog&&!t.minimized&&t.minimize()}buildMenu(){const t=G("div",{class:"xp-startmenu",role:"menu",hidden:""}),e=G("header");e.append(G("span",{class:"avatar",html:Js(40)}),G("span",{},["guest"])),t.append(e,G("div",{class:"orange","aria-hidden":"true"}));const n=G("div",{class:"cols"}),i=G("ul",{class:"left"}),r=G("ul",{class:"right"}),a=(S,b)=>{const R=G("li");return R.append(b),S.append(R),b},o=(S,b,R,x,T,L="")=>{const D=G("button",{type:"button",role:"menuitem",class:L,html:`${b}<span><span class="tt"></span>${x!==null?"<small></small>":""}</span>`});D.querySelector(".tt").textContent=R;const F=D.querySelector("small");return F&&x&&(F.textContent=x),D.addEventListener("click",()=>{this.toggleMenu(!1),T()}),a(S,D)},l=(S,b,R,x)=>{const T=G("a",{href:x,role:"menuitem",html:`${b}<span></span>`});T.querySelector("span").textContent=R,a(S,T)},c=(S,b,R,x,T)=>{const L=G("button",{type:"button",role:"menuitem",class:`cascade ${x}`,"aria-haspopup":"menu","data-menu-owner":"",html:`${b}<span class="tt"></span><i class="arrow"></i>`});L.querySelector(".tt").textContent=R;const D=()=>{L.classList.add("open"),uu(T(),L,()=>L.classList.remove("open"))};return L.addEventListener("click",D),L.addEventListener("pointerenter",D),a(S,L)},u=S=>S.append(G("li",{class:"sep",role:"separator"}));t.addEventListener("pointerover",S=>{const b=S.target.closest("li > a, li > button");b&&!b.classList.contains("cascade")&&pi()});const h=S=>({label:S.title,icon:vn(S.accent),run:()=>{this.toggleMenu(!1),this.shell.play(S.id)}});o(i,fi(),"mIRC","#aethera",()=>this.shell.chat(),"pinned");const d=this.shell.dir.sites.filter(S=>S.group==="here");d.slice(0,Tu).forEach(S=>o(i,vn(S.accent,S.title),S.title,S.kind,()=>this.shell.play(S.id),"pinned")),u(i),d.slice(Tu).forEach(S=>o(i,vn(S.accent,S.title),S.title,null,()=>this.shell.play(S.id)));const f=G("li",{class:"allprog"});i.append(G("li",{class:"sep",role:"separator"}),f);const p=G("button",{type:"button",role:"menuitem",class:"cascade","aria-haspopup":"menu","data-menu-owner":"",html:`<span class="tt">All Programs</span>${Ox()}`}),v=()=>{p.classList.add("open"),uu([...this.shell.dir.sites.filter(S=>S.group==="here").map(h),"sep",...this.shell.dir.sites.filter(S=>S.group==="wired").map(h),"sep",{label:"~ (home directory)",icon:Zs(),run:()=>{this.toggleMenu(!1),this.shell.home()}}],p,()=>p.classList.remove("open"))};p.addEventListener("click",v),p.addEventListener("pointerenter",v),f.append(p),o(r,Zs(),"My Tapes",null,()=>this.shell.home(),"strong");const m=this.shell.dir.posts.slice(0,8);m.length&&c(r,vs("txt"),"My Recent Transmissions","strong",()=>m.map(S=>({label:S.title,icon:vs("txt"),run:()=>location.assign(S.href)}))),u(r);const g=this.shell.dir.sites.filter(S=>S.group==="wired");for(const S of g)o(r,vn(S.accent),S.title,null,()=>this.shell.play(S.id));u(r);for(const S of this.shell.dir.files)l(r,vs(S.title.split(".").pop()??"txt"),S.title,S.href);n.append(i,r),t.append(n);const w=G("div",{class:"foot"}),E=G("button",{type:"button",html:`${au()}<span>Log Off</span>`});E.addEventListener("click",()=>{this.toggleMenu(!1),this.logOffDialog()});const M=G("button",{type:"button",html:`${ru()}<span>Turn Off Computer</span>`});return M.addEventListener("click",()=>{this.toggleMenu(!1),this.shutdownDialog()}),w.append(E,M),t.append(w),t}dismiss(){return this.dialogEl?(this.dialogEl.remove(),this.dialogEl=null,this.start.focus(),!0):!1}bigDialog(t,e){var l,c;(l=this.dialogEl)==null||l.remove();const n=G("div",{class:"xp-shutdown",role:"dialog","aria-modal":"true","aria-label":t});this.dialogEl=n;const i=G("div",{class:"panel"});i.append(G("header",{html:`<span></span>${Js(28,!1)}`})),i.querySelector("header span").textContent=t;const r=G("div",{class:"choices"});for(const u of e){const h=G("button",{type:"button",class:u.cls,html:`<i>${u.icon}</i><span>${u.label}</span>`}),d=u.run;d?h.addEventListener("click",()=>{n.remove(),this.dialogEl=null,d()}):h.disabled=!0,r.append(h)}i.append(r);const a=G("div",{class:"foot"}),o=G("button",{class:"xp-btn",type:"button"},["Cancel"]);o.addEventListener("click",()=>this.dismiss()),a.append(o),i.append(a),n.append(i),this.root.append(n),(c=r.querySelector("button:not(:disabled):last-of-type, button:not(:disabled)"))==null||c.focus()}logOffDialog(){this.bigDialog("Log Off æthera",[{cls:"switch",icon:ou(),label:"Switch User"},{cls:"logoff",icon:au(),label:"Log Off",run:()=>this.hooks.logOff()}])}shutdownDialog(){var t,e;this.bigDialog("Turn off computer",[{cls:"standby",icon:Fx(),label:"Stand By",run:()=>this.hooks.standby(!0)},{cls:"off",icon:ru(),label:"Turn Off",run:()=>this.hooks.turnOff()},{cls:"restart",icon:ou(),label:"Restart",run:()=>this.hooks.restart()}]),(e=(t=this.dialogEl)==null?void 0:t.querySelector(".off"))==null||e.focus()}renderButtons(){this.buttons.replaceChildren();for(const t of this.wm.list){if(t.opts.dialog)continue;const e=G("button",{class:`xp-taskbtn${this.wm.activeWindow===t&&!t.minimized?" active":""}`,type:"button","data-win":t.opts.id,html:`${t.opts.icon}<span></span>`});e.querySelector("span").textContent=t.opts.title,e.title=t.opts.title,e.addEventListener("click",()=>{t.minimized?t.restore():this.wm.activeWindow===t?t.minimize():t.focus()}),this.buttons.append(e)}}showTip(t,e,n,i){const r=t?{title:t.title,text:t.tagline}:e;if(!r){this.tip.hidden=!0;return}this.tip.innerHTML="<b></b><span></span>",this.tip.querySelector("b").textContent=r.title,this.tip.querySelector("span").textContent=r.text,this.tip.hidden=!1;const a=this.root.getBoundingClientRect(),o=this.tip.offsetWidth;this.tip.style.left=`${Math.min(n+14,a.width-o-6)}px`,this.tip.style.top=`${Math.min(i+20,a.height-70)}px`}balloon(t,e,n,i=7e3,r=!1){var f;const a=this.balloonEl;a.innerHTML=`<b>${su()}<span></span></b><span class="msg"></span><button class="x" type="button" aria-label="Close">✕</button>`,a.querySelector("b span").textContent=t,a.querySelector(".msg").textContent=e,(f=a.querySelector(".x"))==null||f.addEventListener("click",()=>a.hidden=!0),a.hidden=!1;const o=this.root.getBoundingClientRect(),l=n??this.trayAnchor(),c=a.offsetWidth,u=a.offsetHeight,h=Math.max(6,Math.min(l.x-30,o.width-c-6)),d=r?l.y+u+24>o.height-30:l.y-u-20>0;a.classList.toggle("above",d),a.classList.toggle("below",!d),a.style.left=`${h}px`,a.style.top=`${d?l.y-u-18:l.y+18}px`,a.style.setProperty("--tail",`${Math.max(12,Math.min(c-30,l.x-h))}px`),clearTimeout(this.balloonTimer),this.balloonTimer=window.setTimeout(()=>a.hidden=!0,i)}hideBalloon(){this.balloonEl.hidden=!0}}const Il=300,Nl=180,nv=["n","s","e","w","ne","nw","se","sw"];class iv{constructor(t,e){I(this,"el");I(this,"minimized",!1);I(this,"closed",!1);var a,o,l,c,u;this.opts=t,this.wm=e;const n=document.createElement("section");n.className=`xp-window${t.dialog?" xp-dialog":""}`,n.setAttribute("role",t.dialog?"alertdialog":"dialog"),n.setAttribute("aria-label",t.title),n.innerHTML=`
      <header class="xp-titlebar">
        <span class="xp-title-icon">${t.icon}</span>
        <span class="xp-title"></span>
        <span class="xp-controls">
          ${t.dialog?"":'<button class="xp-min" aria-label="Minimize" title="Minimize"></button><button class="xp-max" aria-label="Maximize" title="Maximize"></button>'}
          <button class="xp-close" aria-label="Close" title="Close"></button>
        </span>
      </header>`;const i=n.querySelector(".xp-title");i&&(i.textContent=t.title),n.append(t.body),n.style.width=`${t.width}px`,this.el=n,(a=n.querySelector(".xp-close"))==null||a.addEventListener("click",()=>this.close()),(o=n.querySelector(".xp-min"))==null||o.addEventListener("click",()=>this.minimize()),(l=n.querySelector(".xp-max"))==null||l.addEventListener("click",()=>this.toggleMax()),n.addEventListener("pointerdown",()=>this.focus(),!0),this.bindDrag(n.querySelector(".xp-titlebar")),t.dialog||this.bindResize(),(c=n.querySelector(".xp-titlebar"))==null||c.addEventListener("dblclick",h=>{const d=h.target;d.closest(".xp-controls")||t.dialog||(d.closest(".xp-title-icon")?this.close():this.toggleMax())});const r=n.querySelector(".xp-title-icon");r==null||r.setAttribute("data-menu-owner",""),r==null||r.addEventListener("click",h=>{h.stopPropagation();const d=n.getBoundingClientRect();Ms(this.systemMenu(),d.left+3,d.top+29)}),(u=n.querySelector(".xp-titlebar"))==null||u.addEventListener("contextmenu",h=>{const d=h;d.target.closest(".xp-controls")||(d.preventDefault(),d.stopPropagation(),Ms(this.systemMenu(),d.clientX,d.clientY))})}get maximized(){return this.el.classList.contains("maximized")}systemMenu(){const t=!!this.opts.dialog;return[{label:"Restore",run:()=>this.minimized?this.restore():this.toggleMax(),disabled:t||!this.maximized&&!this.minimized},{label:"Move",disabled:!0},{label:"Size",disabled:!0},{label:"Minimize",run:()=>this.minimize(),disabled:t||this.minimized},{label:"Maximize",run:()=>{this.minimized&&this.restore(),this.maximized||this.toggleMax()},disabled:t||this.maximized},"sep",{label:"Close",run:()=>this.close(),bold:!0,shortcut:"Alt+F4"}]}setTitle(t){const e=this.el.querySelector(".xp-title");e&&(e.textContent=t),this.el.setAttribute("aria-label",t)}place(t){const e=t.clientWidth,n=t.clientHeight,i=Math.min(this.opts.width,e-16);this.el.style.width=`${i}px`,t.append(this.el);const r=Math.min(this.el.offsetHeight,n-16);let a=this.opts.x??0,o=this.opts.y??0;this.opts.x===void 0&&(this.opts.dock==="left"?a=18:this.opts.dock==="right"?a=e-i-18:a=(e-i)/2),this.opts.y===void 0&&(o=this.opts.dialog?(n-r)/2.4:Math.max(8,Math.min(60,(n-r)/2))),this.moveTo(a,o)}moveTo(t,e){const n=this.el.parentElement;if(!n)return;const i=n.clientWidth-60,r=n.clientHeight-30;this.el.style.left=`${Math.round(Math.max(-this.el.offsetWidth+80,Math.min(i,t)))}px`,this.el.style.top=`${Math.round(Math.max(0,Math.min(r,e)))}px`}bindDrag(t){let e=null;t.addEventListener("pointerdown",i=>{i.target.closest(".xp-controls, .xp-title-icon")||i.button!==0||this.el.classList.contains("maximized")||innerWidth<=720||(e={x:i.clientX,y:i.clientY,left:this.el.offsetLeft,top:this.el.offsetTop},t.setPointerCapture(i.pointerId))}),t.addEventListener("pointermove",i=>{e&&this.moveTo(e.left+i.clientX-e.x,e.top+i.clientY-e.y)});const n=()=>{e&&this.wm.changed(),e=null};t.addEventListener("pointerup",n),t.addEventListener("pointercancel",n)}bindResize(){for(const t of nv){const e=document.createElement("div");e.className=`xp-grip xp-grip-${t}`,e.setAttribute("aria-hidden","true"),this.el.append(e);let n=null;e.addEventListener("pointerdown",r=>{r.button!==0||this.maximized||innerWidth<=720||(r.preventDefault(),n={x:r.clientX,y:r.clientY,left:this.el.offsetLeft,top:this.el.offsetTop,w:this.el.offsetWidth,h:this.el.offsetHeight},e.setPointerCapture(r.pointerId),this.focus())}),e.addEventListener("pointermove",r=>{if(!n)return;const a=this.el.parentElement;if(!a)return;const o=r.clientX-n.x,l=r.clientY-n.y;let{left:c,top:u,w:h,h:d}=n;t.includes("e")&&(h=Math.min(a.clientWidth-c,Math.max(Il,n.w+o))),t.includes("s")&&(d=Math.min(a.clientHeight-u,Math.max(Nl,n.h+l))),t.includes("w")&&(h=Math.max(Il,Math.min(n.left+n.w,n.w-o)),c=n.left+n.w-h),t.includes("n")&&(d=Math.max(Nl,Math.min(n.top+n.h,n.h-l)),u=n.top+n.h-d),this.el.style.left=`${Math.round(c)}px`,this.el.style.top=`${Math.round(u)}px`,this.el.style.width=`${Math.round(h)}px`,this.el.style.height=`${Math.round(d)}px`,this.el.style.maxHeight="none"});const i=()=>{n&&this.wm.changed(),n=null};e.addEventListener("pointerup",i),e.addEventListener("pointercancel",i)}}clamp(){if(this.maximized||this.minimized)return;const t=this.el.parentElement;t&&(this.el.offsetWidth>t.clientWidth&&(this.el.style.width=`${Math.max(Il,t.clientWidth-8)}px`),this.el.offsetHeight>t.clientHeight&&(this.el.style.height=`${Math.max(Nl,t.clientHeight-8)}px`),this.moveTo(this.el.offsetLeft,this.el.offsetTop))}focus(){this.wm.focus(this)}minimize(){this.minimized=!0,this.el.classList.add("minimized"),this.wm.focusTop(),this.wm.changed()}restore(){this.minimized=!1,this.el.classList.remove("minimized"),this.focus()}toggleMax(){const t=this.el.classList.toggle("maximized"),e=this.el.querySelector(".xp-max");e==null||e.setAttribute("aria-label",t?"Restore":"Maximize"),e==null||e.setAttribute("title",t?"Restore":"Maximize"),this.wm.changed()}close(){var t,e;this.closed||(this.closed=!0,this.el.remove(),this.wm.remove(this),(e=(t=this.opts).onClose)==null||e.call(t))}}class sv{constructor(t){I(this,"windows",[]);I(this,"active",null);I(this,"z",30);I(this,"listeners",new Set);this.desk=t,addEventListener("resize",()=>{for(const e of this.windows)e.clamp()})}get list(){return this.windows}get activeWindow(){return this.active}get(t){return this.windows.find(e=>e.opts.id===t)}open(t){const e=this.get(t.id);if(e)return e.minimized?e.restore():e.focus(),e;const n=new iv(t,this);return this.windows.push(n),n.place(this.desk),this.focus(n),n}focus(t){var n,i;if(t.closed)return;const e=this.active!==t;this.active=t,t.el.style.zIndex=String(++this.z);for(const r of this.windows)r.el.classList.toggle("inactive",r!==t);e&&((i=(n=t.opts).onFocus)==null||i.call(n)),this.changed()}deactivate(){if(this.active){this.active=null;for(const t of this.windows)t.el.classList.add("inactive");this.changed()}}focusTop(){const e=this.windows.filter(n=>!n.minimized).sort((n,i)=>Number(i.el.style.zIndex)-Number(n.el.style.zIndex))[0];e?this.focus(e):(this.active=null,this.changed())}remove(t){this.windows=this.windows.filter(e=>e!==t),this.active===t&&(this.active=null,this.focusTop()),this.changed()}closeTop(){const t=this.active&&!this.active.minimized?this.active:null;return t?(t.close(),!0):!1}on(t){return this.listeners.add(t),()=>this.listeners.delete(t)}changed(){for(const t of this.listeners)t()}}const Ul=document.getElementById("oikos");if(Ul)try{av(Ul)}catch(s){console.error("oikos: boot failed; falling back to the plain directory",s),Ul.classList.remove("oikos-live"),(Au=document.getElementById("oikos-boot"))==null||Au.remove()}function rv(){var s;try{const t=document.createElement("canvas").getContext("webgl2");return(s=t==null?void 0:t.getExtension("WEBGL_lose_context"))==null||s.loseContext(),!!t}catch{return!1}}function ia(){return location.pathname+location.search}function av(s){var Jt;s.classList.add("oikos-live");const t=matchMedia("(prefers-reduced-motion: reduce)").matches,e=xi(),n=new Ou,i=new Map(e.sites.map(P=>[P.id,fd(P,{dir:e,feeds:n})])),r=new Map(e.sites.map(P=>[P.id,P]));if(new URLSearchParams(location.search).has("contact")){ov(s,e.sites,i,n);return}const a=G("div",{id:"oikos-desktop"});s.append(a);const o=new sv(a);kx(s);const l={stack:[],i:-1,moving:!1,listeners:new Set},c=P=>{if(!(l.moving||l.stack[l.i]===P)){l.stack=l.stack.slice(0,l.i+1),l.stack.push(P),l.i=l.stack.length-1;for(const q of l.listeners)q()}},u=P=>{const q=l.stack[l.i+P];if(q!==void 0){l.i+=P,l.moving=!0;try{q==="~"?E.home():E.play(q)}finally{l.moving=!1}for(const $ of l.listeners)$()}};let h=null,d=null,f=null,p=null,v=!1,m=null,g=0,w=!1;const E={dir:e,feeds:n,screens:i,site:P=>r.get(P),select(P){b(!1),h==null||h.focus(P)},play(P){const q=r.get(P);if(!q)return;if(c(P),b(!1),M.select(P),f===P&&d){h==null||h.play(P),d.win.minimized?d.win.restore():d.win.focus();return}const $=d;d=null,f=null,$==null||$.win.close(),history.replaceState(null,"",`${ia()}#${P}`);const rt=o.get("home");rt&&!rt.minimized&&h&&(rt.minimize(),w=!0);const ct=++g,ht=Xt=>{if(ct===g){if(!Xt){h==null||h.eject(),history.replaceState(null,"",ia());const Nt=o.get("home");w&&(Nt!=null&&Nt.minimized)&&Nt.restore(),w=!1;return}f=P,h==null||h.keepAlive(P),d=new tv(q,E,o,()=>{if(f!==P)return;d=null,f=null,h==null||h.keepAlive(null),h==null||h.eject(),(h==null?void 0:h.focusedId)===P&&h.focus(null),history.replaceState(null,"",ia());const Nt=o.get("home");w&&(Nt!=null&&Nt.minimized)&&Nt.restore(),w=!1})}};h?h.play(P).then(ht):ht(!0)},open(P,q){if(q==null||q.preventDefault(),v)return;if(yn(P.href)){window.open(P.href,"_blank","noopener"),S.balloon(`${P.title} opened`,"It opened in a new window. The room is still here.");return}const $=P.href;v=!0,S.balloon(`Opening ${P.title}`,"tuning in…",void 0,2e3);let rt=!1;const ct=()=>{rt||(rt=!0,location.assign($))};h?h.dive(P.id).then(ct):ct(),setTimeout(ct,1500)},look(P){b(!1),h==null||h.focus(P)},get canTune(){return!!h},tuneIn(P){const q=r.get(P);if(!h||!(q!=null&&q.tune))return;const $=typeof q.tune=="string"?q.tune:q.href;b(!1);const rt=o.list.filter(Ft=>!Ft.minimized&&!Ft.opts.dialog);for(const Ft of rt)Ft.minimize();S.hideBalloon();const ct=G("div",{class:"oikos-tube"});ct.style.setProperty("--glow",q.accent);const ht=G("iframe",{src:$,title:`${q.title}, live`,allow:"autoplay; fullscreen; clipboard-write"});ct.append(ht,G("i",{class:"roll"}),G("i",{class:"glass"})),ht.addEventListener("load",()=>{var Ft;try{(Ft=ht.contentWindow)==null||Ft.addEventListener("keydown",ae=>{var ve;const oe=ae.target;ae.key!=="Escape"||ae.defaultPrevented||(ve=oe==null?void 0:oe.closest)!=null&&ve.call(oe,"input, textarea, [contenteditable]")||b(!0)})}catch{}});const Xt=G("div",{class:"oikos-tuned",role:"toolbar","aria-label":"tuned in"});Xt.innerHTML=`${vn(q.accent)}<b></b><span>tuned in · live on its screen</span>`,Xt.querySelector("b").textContent=q.title;const Nt=G("button",{class:"xp-btn",type:"button"},["⏏ Eject"]);Nt.addEventListener("click",()=>b(!0));const ee=G("a",{class:"xp-btn",href:q.href},["Open full ↗"]);yn(q.href)&&(ee.setAttribute("target","_blank"),ee.setAttribute("rel","noopener")),Xt.append(Nt,ee),m={id:P,bar:Xt,hidden:rt,tube:ct};const jt=Ft=>{const ae=Math.round(Math.min(1024,Math.max(420,Ft.width*1.15))),oe=Math.round(ae*.75);ct.style.width=`${ae}px`,ct.style.height=`${oe}px`,ct.style.transform=`translate(${Ft.left}px, ${Ft.top}px) scale(${Ft.width/ae}, ${Ft.height/oe})`};h.tuneIn(P,jt).then(()=>{(m==null?void 0:m.bar)===Xt&&(s.append(ct,Xt),ht.focus())})},chat(){b(!1),p?p.focus():p=new jx(E,o,()=>p=null)},home(){c("~"),b(!1),M.open(),h==null||h.scroll("~ home")},eject(){b(!1),d==null||d.win.close(),h==null||h.eject(),h==null||h.focus(null)},balloon(P,q,$){S.balloon(P,q,$)},back:()=>u(-1),forward:()=>u(1),get canBack(){return l.i>0},get canForward(){return l.i<l.stack.length-1},onNav(P){return l.listeners.add(P),()=>l.listeners.delete(P)},about:()=>R()},M=new Gx(E,o),S=new ev(s,E,o,{standby:P=>L(P),turnOff(){s.classList.add("off"),setTimeout(()=>location.assign("/"),t?50:750)},logOff(){b(!1);for(const P of[...o.list])P.close();h==null||h.eject(),h==null||h.focus(null),history.replaceState(null,"",ia()),S.balloon("Logged off","The desk is clear. Click the VCR to begin again.",(h==null?void 0:h.anchor("vcr"))??void 0)},restart(){try{sessionStorage.removeItem("oikos-booted")}catch{}location.reload()}});function b(P){if(!m)return;const{id:q,bar:$,hidden:rt,tube:ct}=m;if(m=null,$.remove(),ct.remove(),h==null||h.tuneOut(),!!P){for(const ht of rt)ht.closed||ht.restore();h==null||h.focus(q)}}function R(){var Nt;(Nt=o.get("about"))==null||Nt.close();const P=G("div",{class:"xp-about-box"}),q=G("div",{class:"band",html:Js(44,!0)});q.append(G("b",{},["æthera"]),G("span",{},["oikos"]));const $=G("div",{class:"xp-dialog-body"}),rt=G("div");rt.append(G("p",{},["æthera · the home directory"]),G("p",{},["Version 1998 (Build 2026.present_day)"]),G("p",{},["A room of screens wired to one VCR, and every part of the site playing at once."]),G("p",{class:"lic"},["This product is licensed under CC BY 4.0 to:"]),G("p",{},["guest"])),$.append(rt);const ct=G("div",{class:"xp-actions"}),ht=G("button",{class:"xp-btn default",type:"button"},["OK"]);ct.append(ht),P.append(q,$,ct);const Xt=o.open({id:"about",title:"About æthera",icon:su(),body:P,width:400,dialog:!0});ht.addEventListener("click",()=>Xt.close()),ht.focus()}if(rv())try{h=new wx(s,e.sites,i,{pick(P){D(),S.hideBalloon(),S.showTip(null,null,0,0),P==="vcr"?E.home():P?E.play(P):h!=null&&h.focusedId&&!d&&!h.busy&&h.focus(null)},hover(P,q,$){P==="vcr"?S.showTip(null,{title:"VCR",text:"your home directory · click to open ~"},q,$):S.showTip(P?r.get(P)??null:null,null,q,$)}})}catch(P){console.warn("oikos: the room would not build; running the desktop alone",P),h==null||h.stop(),h=null}if(h==null||h.renderer.domElement.addEventListener("pointerdown",()=>o.deactivate()),zx(s,(P,q)=>{var ht,Xt;const $=P.closest(".xp-tile");if($)return $.dataset.id?M.contextFor($.dataset.id):null;if(P.closest("a"))return null;if(P.closest(".xp-content")&&((Xt=(ht=P.closest(".xp-window"))==null?void 0:ht.getAttribute("aria-label"))!=null&&Xt.startsWith("~")))return M.blankMenu();if(P.closest(".xp-window, .xp-startmenu, .xp-shutdown, .xp-menu, .xp-balloon"))return[];if(!h||P!==h.renderer.domElement)return[];const rt=h.pickFromPoint(q.clientX,q.clientY);if(rt==="vcr")return[{label:"Open ~",bold:!0,run:()=>E.home()},{label:"Eject",run:()=>E.eject(),disabled:!f},"sep",{label:"Properties",disabled:!0}];const ct=rt?r.get(rt):void 0;return ct?na(E,ct):[{label:"Arrange Icons By",disabled:!0,submenu:()=>[]},{label:"Refresh",run:()=>h==null?void 0:h.focus(null)},"sep",{label:"Paste",disabled:!0},{label:"Paste Shortcut",disabled:!0},"sep",{label:"New",disabled:!0,submenu:()=>[]},"sep",{label:"~ Home directory",run:()=>E.home()},{label:"Properties",disabled:!0}]}),!h){let P=performance.now();const q=$=>{var ct;requestAnimationFrame(q);const rt=Math.min(.1,($-P)/1e3);P=$,f&&((ct=i.get(f))==null||ct.tick($/1e3,rt,!0))};requestAnimationFrame(q)}const x=()=>{if(!h)return;const P=innerWidth,q=innerHeight-30,$=o.list.filter(ht=>!ht.minimized&&!ht.opts.dialog&&!ht.el.classList.contains("maximized"));if(P<=720){h.setShift(0,$.length?q*.3:0);return}let rt=0,ct=P;for(const ht of $){const Xt=ht.el.getBoundingClientRect();Xt.left+Xt.width/2<P/2?rt=Math.max(rt,Xt.right):ct=Math.min(ct,Xt.left)}ct-rt<P*.22&&(rt=0,ct=P),h.setShift(P/2-(rt+ct)/2,0)};o.on(x),addEventListener("resize",x);let T=!1;function L(P){T=P,s==null||s.classList.toggle("standby",P),P&&(h==null||h.focus(null))}function D(){T&&L(!1)}s.addEventListener("pointerdown",D,!0);const F=new Map(Object.entries(ir).map(([P,q])=>[q.channel,P])),Y=e.sites.map(P=>P.id).sort((P,q)=>{var $,rt;return((($=ir[P])==null?void 0:$.channel)??99)-(((rt=ir[q])==null?void 0:rt.channel)??99)});let K="",B=0;addEventListener("keydown",P=>{if(T){D();return}const q=P.target;if(!q.closest("input, textarea")){if(P.key==="Escape"&&m){b(!0);return}if(!m){if(P.key==="Escape"){if(pi()||S.dismiss()||!Z())return;const $=o.activeWindow;if($!=null&&$.opts.dialog&&!$.minimized){$.close();return}h!=null&&h.focusedId&&h.focus(null);return}if(P.altKey&&(P.key==="ArrowLeft"||P.key==="ArrowRight")){P.preventDefault(),u(P.key==="ArrowLeft"?-1:1);return}if(!q.closest(".xp-window, .xp-startmenu, .xp-menu, .xp-shutdown")){if(P.key==="~"||P.key==="Home"){E.home();return}if((P.key==="ArrowRight"||P.key==="ArrowLeft")&&!(h!=null&&h.busy)){const $=h!=null&&h.focusedId&&h.focusedId!=="vcr"?Y.indexOf(h.focusedId):-1,rt=Y[($+(P.key==="ArrowRight"?1:-1)+Y.length)%Y.length];if(rt){h==null||h.focus(rt),M.select(rt);const ct=h==null?void 0:h.anchor(rt),ht=r.get(rt);ct&&ht&&S.showTip(ht,null,ct.x-40,ct.y-50)}return}if(P.key==="Enter"&&(h!=null&&h.focusedId)&&h.focusedId!=="vcr"){E.play(h.focusedId);return}/^[0-9]$/.test(P.key)&&(K=(K+P.key).slice(-2),clearTimeout(B),h==null||h.scroll(`ch ${K}`),B=window.setTimeout(()=>{const $=F.get(Number(K));K="",$&&r.has($)&&E.play($)},700))}}}});function Z(){const P=s==null?void 0:s.querySelector(".xp-startmenu");return P&&!P.hidden?(S.toggleMenu(!1),!1):!0}let X=!1;document.addEventListener("visibilitychange",()=>{document.hidden?(h==null||h.stop(),n.stop(),m&&b(!0)):X&&(h==null||h.start(),n.start())}),addEventListener("pageshow",P=>{P.persisted&&(v=!1,s.classList.remove("off"),h==null||h.reset())});const j=document.getElementById("oikos-boot");let it=!1;try{it=!!sessionStorage.getItem("oikos-booted"),sessionStorage.setItem("oikos-booted","1")}catch{}const pt=t||it?250:1900;let _t=()=>{};const bt=new Promise(P=>_t=P);j==null||j.addEventListener("click",()=>_t());const Qt=Promise.race([((Jt=document.fonts)==null?void 0:Jt.load('16px "Libertinus Mono"').then(()=>{}))??Promise.resolve(),new Promise(P=>setTimeout(P,1500))]),fe=(h==null?void 0:h.warm())??Promise.resolve();Promise.race([Promise.all([Qt,fe,new Promise(P=>setTimeout(P,pt))]),bt]).then(()=>{X=!0,document.hidden||(n.start(),h==null||h.start()),h==null||h.powerOn(),j==null||j.classList.add("gone"),setTimeout(()=>j==null?void 0:j.remove(),800);const P=new URLSearchParams(location.search).get("look");P&&h&&(P==="vcr"||r.has(P))&&setTimeout(()=>h==null?void 0:h.focus(P),300);let q="";try{q=decodeURIComponent(location.hash.slice(1))}catch{}if(q==="mirc"){setTimeout(()=>E.chat(),600);return}if(q&&r.has(q)){setTimeout(()=>E.play(q),900);return}if(!h){E.home(),S.balloon("No room tonight","This browser has no WebGL, so the room of screens is dark. The tapes all still play.");return}setTimeout(()=>{if(o.list.length)return;const $=(h==null?void 0:h.anchor("vcr"))??void 0;S.balloon("This is the way in",innerWidth<=720?"Tap the VCR for the home directory, or any screen to tune in. Drag to look around.":"Click the VCR for your home directory, or any screen to tune in. Drag to look around; ← → walk the screens.",$,11e3,!0)},it?900:2600)})}function ov(s,t,e,n){var o;(o=document.getElementById("oikos-boot"))==null||o.remove();const i=G("div");i.style.cssText="position:absolute;inset:0;overflow:auto;padding:16px;display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));background:#0a0a0a;";for(const l of t){const c=e.get(l.id);if(!c)continue;const u=G("figure");u.style.cssText="margin:0;color:#aaa;font:12px ui-monospace,monospace;",c.canvas.style.cssText="width:100%;display:block;border:1px solid #333;";const h=G("figcaption",{},[`${l.title} · ${l.kind}`]);h.style.padding="4px 0",u.append(c.canvas,h),i.append(u)}s.append(i),n.start();let r=performance.now();const a=l=>{requestAnimationFrame(a);const c=Math.min(.1,(l-r)/1e3);r=l;for(const u of e.values())u.tick(l/1e3,c,!1)};requestAnimationFrame(a)}})();
