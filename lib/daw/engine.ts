// @ts-nocheck
/* MOTOR MULTITRACK ("Por dentro do beat").
   Código portado do arquivo original com alterações mínimas, marcadas abaixo:
   (1) $ passou a buscar dentro da seção; (2) o preview do dock é pausado via pausePreview();
   (3) "LICENCIAR ESTE BEAT" chama onLicense(); (4) destroy() desfaz tudo (React Strict Mode / desmontagem).
   Continua imperativo de propósito, para preservar o comportamento exato. Tipagem pode ser feita depois. */
import { demoAudio } from "./demo";
import { fmt, setRange } from "../format";
import { ICON_PLAY_SVG as ICON_PLAY, ICON_PAUSE_SVG as ICON_PAUSE } from "../icons";

/* DAW: stems sincronizados via Web Audio (um BufferSource por track, todos iniciados no mesmo instante) */
const DAW_ICONS={
  drums:'<ellipse cx="12" cy="9" rx="8" ry="3"/><path d="M4 9v7c0 1.7 3.6 3 8 3s8-1.3 8-3V9M7 3l3 4.5M17 3l-3 4.5"/>',
  bass:'<path d="M20 4l-8.5 8.5"/><path d="M18 2l4 4"/><circle cx="8.5" cy="15.5" r="5"/><circle cx="8.5" cy="15.5" r="1.4"/>',
  guitar:'<path d="M20 4l-8.5 8.5"/><path d="M18 2l4 4"/><path d="M11 9.5c-2-1-4.5-.5-5.8 1.2-1 1.3-.6 2.3-1.8 3.5-1.6 1.6-.6 4.6 1.6 5.8 2.2 1.2 4.6.4 5.6-1.2.9-1.4 2-1.2 3-2.3 1.4-1.6 1.2-4.1-.6-5.4"/>',
  keys:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 6v7M12 6v7M16 6v7"/>',
  pad:'<rect x="3" y="7" width="18" height="10" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10v4M16.5 10v4"/>',
  lead:'<path d="M3 12c2.2-7 4.4-7 6 0s3.8 7 6 0 3.8-7 6 0"/>',
  vocal:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  fx:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>'
};
const dawIcon=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${DAW_ICONS[k]||DAW_ICONS.lead}</svg>`;


export function createDaw(section, { session: SESSION, beats: BEATS, toast, pausePreview, onLicense }) {
  const $ = (s) => section.querySelector(s);
  // registra os listeners criados durante a inicialização para poder removê-los em destroy()
  const added = [];
  const orig = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (t, f, o) { added.push([this, t, f, o]); return orig.call(this, t, f, o); };
  let api;
  try {
    api = (() => {
  const S=SESSION,root=$("#daw"),grid=$("#dawGrid"),ruler=$("#dawRuler"),rcv=ruler.querySelector("canvas"),ph=$("#dawPh"),msg=$("#dawMsg"),st=$("#dawSt");
  let ro=null,io=null;
  const AC=window.AudioContext||window.webkitAudioContext,ER=100; // ER = pontos de envelope por segundo
  const demo=S.stems.every(s=>!s.file);
  const FONT='"Familjen Grotesk",system-ui,sans-serif';
  let ctx=null,master=null,state="idle",pending=false,playing=false,offset=0,startAt=0,dur=0,drag=null;

  $("#dawTitle").textContent=S.title;$("#dawMeta").textContent=`${S.bpm} BPM · ${S.key}`;
  const beat=BEATS.find(b=>b.id===S.beatId&&b.status==="available");
  if(beat){const l=$("#dawLic");l.hidden=false;l.addEventListener("click",()=>{onLicense(beat)})}

  const tracks=S.stems.map((s,i)=>({cfg:s,i,mute:false,solo:false,vol:1,buffer:null,env:null,regions:[],norm:1,src:null,g:null}));
  const frag=document.createDocumentFragment();
  tracks.forEach(t=>{
    const s=t.cfg,th=document.createElement("div"),ln=document.createElement("div");
    th.className="th";th.style.setProperty("--c",s.color);
    th.innerHTML=`<span class="n">${t.i+1}</span><span class="ic">${dawIcon(s.kind)}</span>
      <span class="nm"><span>${s.name}</span><i class="dot"></i></span>
      <div class="ms"><button class="m" data-m="${t.i}" aria-pressed="false" aria-label="Mutar ${s.name}" title="Mute">M</button><button class="s" data-s="${t.i}" aria-pressed="false" aria-label="Solar ${s.name}" title="Solo">S</button></div>
      <input type="range" min="0" max="1" step="0.01" value="1" data-v="${t.i}" aria-label="Volume ${s.name}">`;
    ln.className="lane";ln.innerHTML="<canvas></canvas>";
    t.th=th;t.lane=ln;t.cv=ln.querySelector("canvas");t.dot=th.querySelector(".dot");t.slider=th.querySelector("input");
    setRange(t.slider);frag.append(th,ln);
  });
  grid.insertBefore(frag,ph);

  function ensureCtx(){
    if(ctx||!AC)return;
    try{if(navigator.audioSession)navigator.audioSession.type="playback"}catch(e){} // iPhone: toca mesmo no modo silencioso
    ctx=new AC();master=ctx.createGain();master.gain.value=+$("#dawVol").value;master.connect(ctx.destination);
    tracks.forEach(t=>{t.g=ctx.createGain();t.g.connect(master)});applyGains();
  }
  const setStatus=(txt,cls)=>{st.textContent=txt;st.className="daw-st"+(cls?" "+cls:"")};
  const decode=ab=>new Promise((res,rej)=>ctx.decodeAudioData(ab,res,rej));

  async function load(){
    if(state!=="idle")return;
    if(!AC){fail("Seu navegador não suporta o player multitrack.");return}
    state="loading";ensureCtx();
    let done=0;const n=tracks.length;setStatus(`CARREGANDO 0/${n}`);
    if(demo){
      const secs=16*240/S.bpm+1.5;
      for(const t of tracks){
        await new Promise(r=>setTimeout(r,0));
        const b=ctx.createBuffer(1,Math.ceil(secs*ctx.sampleRate),ctx.sampleRate);
        demoAudio(t.cfg.kind,b.getChannelData(0),ctx.sampleRate,S.bpm);t.buffer=b;
        setStatus(`CARREGANDO ${++done}/${n}`);
      }
    }else{
      await Promise.all(tracks.map(async t=>{
        if(!t.cfg.file)return;
        try{const r=await fetch(t.cfg.file);if(!r.ok)throw new Error(r.status);t.buffer=await decode(await r.arrayBuffer())}
        catch(e){t.err=true;console.warn("Stem não carregou:",t.cfg.file,e)}
        setStatus(`CARREGANDO ${++done}/${n}`);
      }));
      if(!tracks.some(t=>t.buffer)){
        fail(location.protocol==="file:"?"Os stems só carregam com o site num servidor (hospedagem ou servidor local). Aberto direto do arquivo, o navegador bloqueia.":"Não foi possível carregar os stems.");return;
      }
      if(tracks.some(t=>t.err))toast("Alguns stems não carregaram. Confira os caminhos em SESSION.");
    }
    tracks.forEach(t=>{if(t.buffer){analyze(t);dur=Math.max(dur,t.buffer.duration)}});
    state="ready";msg.hidden=true;setStatus(demo?"ÁUDIO DEMO":"",demo?"demo":"");
    if(demo)st.title="Áudio de demonstração. Os stems reais entram em SESSION.stems.";
    ruler.setAttribute("aria-valuemax",Math.round(dur));
    drawAll();render();
    if(pending)play();
  }
  function fail(text){state="error";pending=false;msg.textContent=text;msg.hidden=false;setStatus("ERRO");ui()}

  /* envelope de pico (para waveform e medidor) e regiões = trechos com som, separados por silêncio */
  function analyze(t){
    const b=t.buffer,hop=Math.max(1,Math.round(b.sampleRate/ER)),n=Math.ceil(b.length/hop),env=new Float32Array(n);
    for(let c=0;c<b.numberOfChannels;c++){const d=b.getChannelData(c);for(let i=0;i<d.length;i++){const v=d[i]<0?-d[i]:d[i],k=(i/hop)|0;if(v>env[k])env[k]=v}}
    let pk=0;for(let k=0;k<n;k++)if(env[k]>pk)pk=env[k];
    t.env=env;t.norm=.95/Math.max(pk,.02);
    const R=[];let s=-1,last=-1;
    for(let k=0;k<n;k++)if(env[k]>.004){if(s<0)s=k;else if(k-last>ER*.75){R.push([s,last+1]);s=k}last=k}
    if(s>=0)R.push([s,last+1]);
    t.regions=R.filter(([a,z])=>z-a>=5).map(([a,z])=>[a/ER,z/ER]);
  }

  function prep(c){const w=c.clientWidth,h=c.clientHeight,d=window.devicePixelRatio||1;c.width=Math.round(w*d);c.height=Math.round(h*d);const g=c.getContext("2d");g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,w,h);return[g,w,h]}
  const barSec=()=>240/S.bpm;
  function drawRuler(){
    const[g,w,h]=prep(rcv);if(!dur)return;
    const pps=w/dur,bw=barSec()*pps,bars=Math.ceil(dur/barSec()),every=[1,2,4,8,16,32].find(n=>n*bw>=30)||64;
    g.font=`500 10px ${FONT}`;g.textBaseline="top";
    for(let i=0;i<=bars;i++){
      const x=Math.round(i*bw)+.5;
      if(bw/4>=8)for(let q=1;q<4;q++){g.fillStyle="#ffffff22";g.fillRect(Math.round(x+q*bw/4),h-5,1,5)}
      const big=i%every===0;g.fillStyle=big?"#ffffff66":"#ffffff26";g.fillRect(x-.5,big?h-12:h-7,1,big?12:7);
      if(big&&i<bars){g.fillStyle="#aaa5b8";g.fillText(String(i+1),x+4,5)}
    }
  }
  function rr(g,x,y,w,h,r){g.beginPath();g.roundRect?g.roundRect(x,y,w,h,r):g.rect(x,y,w,h)}
  function drawLane(t){
    const[g,w,h]=prep(t.cv);if(!dur)return;
    const pps=w/dur,bw=barSec()*pps,bars=Math.ceil(dur/barSec());
    for(let i=1;i<bars;i++){g.fillStyle=i%4===0?"#ffffff14":"#ffffff08";g.fillRect(Math.round(i*bw),0,1,h)}
    if(!t.env){if(t.err){g.fillStyle="#ffb4a2";g.font=`500 11px ${FONT}`;g.fillText("arquivo não encontrado",8,h/2+4)}return}
    const lab=13,top=2,rh=h-4;
    for(const[a,z]of t.regions){
      const x0=Math.round(a*pps),x1=Math.max(x0+3,Math.round(z*pps)),rw=x1-x0;
      g.save();rr(g,x0+.5,top,rw-1,rh,3);g.clip();
      g.fillStyle=t.cfg.color;g.globalAlpha=.88;g.fillRect(x0,top,rw,rh);
      g.globalAlpha=1;g.fillStyle="rgba(0,0,0,.22)";g.fillRect(x0,top,rw,lab);
      g.fillStyle="#fff";g.font=`600 10px ${FONT}`;g.textBaseline="middle";g.fillText(t.cfg.name,x0+5,top+lab/2+1);
      const wt=top+lab+2,wh=rh-lab-4,mid=wt+wh/2;g.fillStyle="rgba(255,255,255,.85)";
      for(let x=x0;x<x1;x++){
        const b0=Math.floor(x/pps*ER),b1=Math.max(b0+1,Math.floor((x+1)/pps*ER));let m=0;
        for(let k=b0;k<b1&&k<t.env.length;k++)if(t.env[k]>m)m=t.env[k];
        const amp=Math.min(1,m*t.norm)*wh/2;if(amp>.4)g.fillRect(x,mid-amp,1,amp*2);
      }
      g.restore();
    }
  }
  function drawAll(){drawRuler();tracks.forEach(drawLane);render()}

  const anySolo=()=>tracks.some(t=>t.solo);
  const audible=(t,solo)=>!t.mute&&(!solo||t.solo);
  function applyGains(){
    const solo=anySolo();
    tracks.forEach(t=>{
      const on=audible(t,solo);
      t.th.classList.toggle("off",!on);t.lane.classList.toggle("off",!on);
      t.th.querySelector(".m").setAttribute("aria-pressed",t.mute);t.th.querySelector(".s").setAttribute("aria-pressed",t.solo);
      if(t.g)t.g.gain.setTargetAtTime(on?t.vol:0,ctx.currentTime,.015);
    });
  }

  const pos=()=>playing?Math.min(dur,Math.max(0,ctx.currentTime-startAt)):offset;
  function stopSources(){tracks.forEach(t=>{if(t.src){try{t.src.stop()}catch(e){}t.src.disconnect();t.src=null}})}
  function play(){
    if(state==="error")return;
    if(state!=="ready"){pending=true;ui();load();return}
    pending=false;pausePreview();
    if(offset>=dur-.05)offset=0;
    const when=ctx.currentTime+.03;
    tracks.forEach(t=>{if(!t.buffer||offset>=t.buffer.duration)return;const s=ctx.createBufferSource();s.buffer=t.buffer;s.connect(t.g);s.start(when,offset);t.src=s});
    startAt=when-offset;playing=true;ui();requestAnimationFrame(tick);
  }
  function pause(){if(pending){pending=false;ui()}if(!playing)return;offset=pos();stopSources();playing=false;ui();render()}
  function stop(){pause();offset=0;render()}
  function seek(t){const was=playing;if(was){stopSources();playing=false}offset=Math.min(Math.max(0,t),dur);if(was)play();else render()}
  function toggle(){ensureCtx();if(ctx&&ctx.state==="suspended")ctx.resume();(playing||pending)?pause():play()}
  function tick(){if(!playing)return;if(pos()>=dur){stopSources();playing=false;offset=0;ui();render();return}render();requestAnimationFrame(tick)}

  function ui(){const on=playing||pending;$("#dawPlay").innerHTML=on?ICON_PAUSE:ICON_PLAY;$("#dawPlay").setAttribute("aria-label",on?"Pausar":"Tocar")}
  function render(){
    const p=pos(),w=rcv.clientWidth;
    ph.style.transform=`translateX(${dur?p/dur*w:0}px)`;
    const bt=p/(60/S.bpm);
    $("#dawBar").textContent=`${Math.floor(bt/4)+1}.${Math.floor(bt%4)+1}.${Math.floor(bt*4%4)+1}`;
    $("#dawTime").textContent=`${fmt(p)} / ${fmt(dur)}`;
    ruler.setAttribute("aria-valuenow",Math.round(p));ruler.setAttribute("aria-valuetext",fmt(p));
    const k=(p*ER)|0,solo=anySolo();
    tracks.forEach(t=>{const lv=playing&&t.env&&audible(t,solo)?Math.min(1,(t.env[k]||0)*t.norm)*t.vol:0;t.dot.style.opacity=.18+.82*lv});
  }

  /* eventos */
  $("#dawPlay").addEventListener("click",toggle);
  $("#dawStop").addEventListener("click",stop);
  $("#dawReset").addEventListener("click",()=>{tracks.forEach(t=>{t.mute=t.solo=false;t.vol=1;t.slider.value=1;setRange(t.slider)});applyGains()});
  $("#dawVol").addEventListener("input",e=>{setRange(e.target);if(master)master.gain.setTargetAtTime(+e.target.value,ctx.currentTime,.015)});
  setRange($("#dawVol"));
  grid.addEventListener("click",e=>{
    const m=e.target.closest("[data-m]"),s=e.target.closest("[data-s]");
    if(m){const t=tracks[m.dataset.m];t.mute=!t.mute}
    else if(s){const t=tracks[s.dataset.s];if(e.altKey){const v=!t.solo;tracks.forEach(x=>x.solo=false);t.solo=v}else t.solo=!t.solo}
    else return;
    applyGains();
  });
  grid.addEventListener("input",e=>{const v=e.target.closest("[data-v]");if(!v)return;const t=tracks[v.dataset.v];t.vol=+v.value;setRange(v);applyGains()});

  const timeAt=e=>{const r=rcv.getBoundingClientRect();return Math.min(1,Math.max(0,(e.clientX-r.left)/r.width))*dur};
  grid.addEventListener("pointerdown",e=>{
    const tg=e.target.closest(".lane,.ruler");if(!tg||!dur||e.button>0)return;
    if(e.pointerType!=="mouse"&&tg.classList.contains("lane")){drag={tap:true,x:e.clientX,y:e.clientY};return} // no toque, lane só navega com tap (pra não atrapalhar a rolagem)
    drag={was:playing};if(playing){offset=pos();stopSources();playing=false}
    offset=timeAt(e);render();tg.setPointerCapture(e.pointerId);
  });
  grid.addEventListener("pointermove",e=>{if(drag&&!drag.tap){offset=timeAt(e);render()}});
  grid.addEventListener("pointerup",e=>{
    if(!drag)return;const d=drag;drag=null;
    if(d.tap){if(Math.hypot(e.clientX-d.x,e.clientY-d.y)<10)seek(timeAt(e));return}
    if(d.was)play();
  });
  grid.addEventListener("pointercancel",()=>{if(drag&&drag.was)play();drag=null});
  ruler.addEventListener("keydown",e=>{
    const k={ArrowRight:barSec(),ArrowLeft:-barSec()}[e.key];
    if(k!==undefined){e.preventDefault();seek(pos()+k)}else if(e.key==="Home"){e.preventDefault();seek(0)}
  });
  root.addEventListener("keydown",e=>{if(e.code==="Space"&&!e.target.closest("button,input")){e.preventDefault();toggle()}});

  if(window.ResizeObserver){ro=new ResizeObserver(()=>{if(state==="ready")drawAll()});ro.observe(rcv)}
  if(window.IntersectionObserver){io=new IntersectionObserver(es=>{if(es.some(x=>x.isIntersecting)){io.disconnect();load()}},{rootMargin:"400px"});io.observe(root)}
  ui();applyGains();
  return{pause,destroy(){if(ro)ro.disconnect();if(io)io.disconnect();playing=false;pending=false;stopSources();try{if(ctx)ctx.close()}catch(e){}grid.querySelectorAll(".th,.lane").forEach(n=>n.remove())}};
})();
  } finally {
    EventTarget.prototype.addEventListener = orig;
  }
  return {
    pause: api.pause,
    destroy() { added.forEach(([el, t, f, o]) => el.removeEventListener(t, f, o)); api.destroy(); },
  };
}
