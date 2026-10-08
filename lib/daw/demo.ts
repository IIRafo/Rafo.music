// @ts-nocheck
/* Trecho extraído sem alterações do arquivo original. */
/* áudio demo: 16 compassos em Fm gerados no navegador (só usado enquanto não houver stems reais) */
export function demoAudio(kind,out,sr,bpm){
  const beat=60/bpm,bar=beat*4,st=beat/4,N=out.length;
  let seed=7+kind.charCodeAt(0)*131;const rnd=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296)*2-1;
  const hz=m=>440*Math.pow(2,(m-69)/12),TAU=2*Math.PI;
  const CH=[[53,56,60],[49,53,56],[56,60,63],[51,55,58]]; // Fm Db Ab Eb
  const on=(b,l)=>l.some(([a,z])=>b>=a&&b<=z);
  const put=(t0,len,fn)=>{const s=Math.floor(t0*sr),n=Math.floor(len*sr);for(let i=0;i<n&&s+i<N;i++)out[s+i]+=fn(i/sr)*Math.min(1,(len-i/sr)/.02)};
  const hat=()=>{let p=0;return x=>{const n=rnd(),h=n-p;p=n;return h*Math.exp(-70*x)*.14}};
  const ks=(t0,f,len,g)=>{const p=Math.max(2,Math.round(sr/f)),d=new Float32Array(p),s=Math.floor(t0*sr),n=Math.floor(len*sr);
    for(let i=0;i<p;i++)d[i]=rnd();let k=0;for(let i=0;i<n&&s+i<N;i++){const j=(k+1)%p,v=d[k];out[s+i]+=v*g*Math.min(1,(n-i)/(sr*.03));d[k]=(v+d[j])*.4985;k=j}};
  const MEL=[[0,3,72],[3,3,70],[6,2,68],[8,6,65],[16,3,68],[19,3,70],[22,2,72],[24,8,75]];
  for(let b=1;b<=16;b++){
    const T=(b-1)*bar,ch=CH[(b-1)%4];
    if(kind==="drums"&&on(b,[[1,8],[11,16]]))for(let s=0;s<16;s++){
      const t=T+s*st;
      if(b>2&&(s===0||s===10||(b%2===0&&s===7)))put(t,.4,x=>Math.sin(TAU*(45*x+110/14*(1-Math.exp(-14*x))))*Math.exp(-7*x)*.75);
      if(b>2&&s===8)put(t,.3,x=>(rnd()*.6+Math.sin(TAU*190*x)*.4)*Math.exp(-16*x)*.6);
      if(s%2===0)put(t,.06,hat());
      if(b%4===0&&s>=12){put(t+st/2,.05,hat())}
    }
    if(kind==="bass"&&on(b,[[5,8],[11,16]])){
      const f=hz(ch[0]-12);
      put(T,beat*1.6,x=>Math.tanh(2.5*Math.sin(TAU*f*x))*Math.min(1,x/.005)*Math.exp(-1.2*x)*.4);
      put(T+10*st,beat*.6,x=>Math.tanh(2.5*Math.sin(TAU*f*x))*Math.min(1,x/.005)*Math.exp(-2*x)*.4);
    }
    if(kind==="pad"&&on(b,[[1,10],[13,16]]))for(const m of ch){
      const f=hz(m);put(T,bar+.15,x=>(Math.sin(TAU*f*x)+.5*Math.sin(TAU*2.003*f*x)+.25*Math.sin(TAU*2.997*f*x))*Math.min(1,x/.35)*.05);
    }
    if(kind==="keys"&&on(b,[[1,10]])){
      const arp=[ch[0]+12,ch[1]+12,ch[2]+12,ch[0]+24];
      [0,1,2,3,2,1,2,3].forEach((a,k)=>{const w=TAU*hz(arp[a]);put(T+k*beat/2,.7,x=>(Math.sin(w*x)+.3*Math.sin(2*w*x)*Math.exp(-6*x))*Math.exp(-3.5*x)*.11)});
    }
    if(kind==="guitar"&&on(b,[[3,6],[13,16]]))for(const s of [0,10])
      [ch[0],ch[1],ch[2],ch[0]+12].forEach((m,k)=>ks(T+s*st+k*.018,hz(m),1.1,.09));
    if(kind==="lead"&&on(b,[[9,16]])){
      const half=(b-9)%2;
      MEL.filter(([s])=>Math.floor(s/16)===half).forEach(([s,l,m])=>{const f=hz(m);
        put(T+(s%16)*st,l*st,x=>{const ph=TAU*f*x+.25*Math.sin(TAU*5.5*x)*Math.min(1,x/.2);return(Math.sin(ph)+.3*Math.sin(3*ph)+.12*Math.sin(5*ph))*Math.min(1,x/.01)*.09})});
    }
    if(kind==="fx"){
      const riser=(len)=>{let y=0;return x=>{const r=x/len;y+=(.01+.4*r*r)*(rnd()-y);return(y*1.6+Math.sin(TAU*(200*x+400*x*r))*.08)*Math.pow(r,1.5)*.6}};
      if(b===7)put(T,bar*2,riser(bar*2));
      if(b===10)put(T,bar,riser(bar));
      if(b===9||b===11)put(T,1.4,x=>Math.sin(TAU*(40*x+60/6*(1-Math.exp(-6*x))))*Math.exp(-2.5*x)*.55+rnd()*Math.exp(-12*x)*.12);
    }
  }
  for(let i=0;i<N;i++)out[i]=Math.tanh(out[i])*.75;
}

