// ===== Utility =====
const ELEMENT_COLORS = ['#ff6b4a','#c4ff3d','#4ade80','#a78bfa','#fbbf24','#60a5fa','#f472b6','#34d399','#fb923c','#22d3ee','#facc15','#e879f9'];
function elemColor(name) { let h=0; for(let i=0;i<name.length;i++){h=((h<<5)-h)+name.charCodeAt(i);h|=0;} return ELEMENT_COLORS[Math.abs(h)%ELEMENT_COLORS.length]; }
function cssEscape(s) { return (window.CSS&&CSS.escape)?CSS.escape(s):String(s).replace(/[^a-zA-Z0-9_-]/g,'\\$&'); }

// ===== 60 Presets =====
const P = (id,name,cat,kf)=>({id,name,cat,keyframes:kf});
const PRESETS = {
  fade:P('fade','Fade In','entrance',{opacity:[0,1]}),
  fadeUp:P('fadeUp','Fade In Up','entrance',{opacity:[0,1],y:[40,0]}),
  fadeDown:P('fadeDown','Fade In Down','entrance',{opacity:[0,1],y:[-40,0]}),
  fadeLeft:P('fadeLeft','Fade In Left','entrance',{opacity:[0,1],x:[-60,0]}),
  fadeRight:P('fadeRight','Fade In Right','entrance',{opacity:[0,1],x:[60,0]}),
  fadeScale:P('fadeScale','Fade + Scale','entrance',{opacity:[0,1],scale:[0.5,1]}),
  slideUp:P('slideUp','Slide In Up','entrance',{y:[80,0]}),
  slideDown:P('slideDown','Slide In Down','entrance',{y:[-80,0]}),
  slideLeft:P('slideLeft','Slide In Left','entrance',{x:[-120,0]}),
  slideRight:P('slideRight','Slide In Right','entrance',{x:[120,0]}),
  zoomIn:P('zoomIn','Zoom In','entrance',{scale:[0,1],opacity:[0,1]}),
  zoomOut:P('zoomOut','Zoom Out Enter','entrance',{scale:[1.5,1],opacity:[0,1]}),
  flipInX:P('flipInX','Flip In X','entrance',{scaleX:[0,1],opacity:[0,1]}),
  flipInY:P('flipInY','Flip In Y','entrance',{scaleY:[0,1],opacity:[0,1]}),
  bounceIn:P('bounceIn','Bounce In','entrance',{scale:[0,1.15,0.9,1.05,1],opacity:[0,1,1,1,1]}),
  pulse:P('pulse','Pulse','emphasis',{scale:[1,1.08,1]}),
  bounce:P('bounce','Bounce','emphasis',{y:[0,-20,0]}),
  shake:P('shake','Shake','emphasis',{x:[0,-10,10,-10,10,0]}),
  headShake:P('headShake','Head Shake','emphasis',{x:[0,-6,6,-6,6,0],rotation:[0,-8,8,-8,8,0]}),
  swing:P('swing','Swing','emphasis',{rotation:[0,-10,10,-5,5,0]}),
  tada:P('tada','Tada','emphasis',{scale:[1,0.9,1.1,1],rotation:[0,-3,3,-3,3,0]}),
  wobble:P('wobble','Wobble','emphasis',{x:[0,-25,20,-15,10,-5,0],rotation:[0,-5,3,-3,2,-1,0]}),
  jello:P('jello','Jello','emphasis',{scaleX:[1,1.25,0.75,1.15,0.95,1.05,1],scaleY:[1,0.75,1.25,0.85,1.05,0.95,1]}),
  flash:P('flash','Flash','emphasis',{opacity:[1,0,1,0,1]}),
  heartBeat:P('heartBeat','Heart Beat','emphasis',{scale:[1,1.15,1,1.15,1]}),
  rubber:P('rubber','Rubber Band','emphasis',{scaleX:[1,1.25,0.75,1.15,0.95,1.05,1],scaleY:[1,0.75,1.25,0.85,1.05,0.95,1]}),
  glow:P('glow','Glow','emphasis',{opacity:[1,0.6,1]}),
  wave:P('wave','Wave','emphasis',{rotation:[0,8,-8,6,-6,3,-3,0]}),
  spin:P('spin','Spin','emphasis',{rotation:[0,360]}),
  spinHalf:P('spinHalf','Spin Half','emphasis',{rotation:[0,180]}),
  pulseQuick:P('pulseQuick','Pulse Quick','emphasis',{scale:[1,1.05,1]}),
  vibrate:P('vibrate','Vibrate','emphasis',{x:[0,-2,2,-2,2,-2,2,0]}),
  vertBounce:P('vertBounce','Vert Bounce','emphasis',{y:[0,-12,0]}),
  horizBounce:P('horizBounce','Horiz Bounce','emphasis',{x:[0,12,-12,0]}),
  rotateScale:P('rotateScale','Rotate + Scale','emphasis',{rotation:[0,360],scale:[1,1.2,1]}),
  blink:P('blink','Blink','emphasis',{opacity:[1,0,1,0,1,0,1]}),
  flip:P('flip','Flip','emphasis',{scaleX:[1,-1,1]}),
  wobbleV:P('wobbleV','Wobble Vert','emphasis',{y:[0,-8,6,-5,3,-2,0],rotation:[0,-3,2,-2,1,0,0]}),
  skew:P('skew','Skew','emphasis',{skewX:[0,-15,15,-10,10,0]}),
  fadeOut:P('fadeOut','Fade Out','exit',{opacity:[1,0]}),
  fadeOutUp:P('fadeOutUp','Fade Out Up','exit',{opacity:[1,0],y:[0,-40]}),
  fadeOutDown:P('fadeOutDown','Fade Out Down','exit',{opacity:[1,0],y:[0,40]}),
  fadeOutLeft:P('fadeOutLeft','Fade Out Left','exit',{opacity:[1,0],x:[0,-60]}),
  fadeOutRight:P('fadeOutRight','Fade Out Right','exit',{opacity:[1,0],x:[0,60]}),
  slideOutUp:P('slideOutUp','Slide Out Up','exit',{y:[0,-80]}),
  slideOutDown:P('slideOutDown','Slide Out Down','exit',{y:[0,80]}),
  slideOutLeft:P('slideOutLeft','Slide Out Left','exit',{x:[0,-120]}),
  slideOutRight:P('slideOutRight','Slide Out Right','exit',{x:[0,120]}),
  zoomOutExit:P('zoomOutExit','Zoom Out','exit',{scale:[1,0],opacity:[1,0]}),
  zoomOutBig:P('zoomOutBig','Zoom Out Big','exit',{scale:[1,2],opacity:[1,0]}),
  flipOutX:P('flipOutX','Flip Out X','exit',{scaleX:[1,0],opacity:[1,0]}),
  flipOutY:P('flipOutY','Flip Out Y','exit',{scaleY:[1,0],opacity:[1,0]}),
  bounceOut:P('bounceOut','Bounce Out','exit',{scale:[1,1.15,0.9,0],opacity:[1,1,1,0]}),
  collapse:P('collapse','Collapse','exit',{scaleY:[1,0],opacity:[1,0]}),
  fold:P('fold','Fold','exit',{scaleX:[1,0],opacity:[1,0],x:[0,60]}),
  dissolve:P('dissolve','Dissolve','exit',{opacity:[1,0.8,0.5,0.2,0]}),
  dropOut:P('dropOut','Drop Out','exit',{y:[0,120],opacity:[1,0],rotation:[0,20]}),
  wipeOut:P('wipeOut','Wipe Out','exit',{scaleX:[1,0]}),
  vanish:P('vanish','Vanish','exit',{opacity:[1,0],scale:[1,0.8]}),
};
const PRESET_LIST = Object.values(PRESETS);
const CATEGORIES = ['all','entrance','emphasis','exit'];

// ===== Default SVG =====
const DEFAULT_SVG = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a1c26"/><stop offset="100%" stop-color="#0a0b10"/>
    </linearGradient>
    <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffd84a"/><stop offset="50%" stop-color="#ff6b4a"/><stop offset="100%" stop-color="#c4ff3d"/>
    </linearGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f0f1f5"/><stop offset="100%" stop-color="#c0c2cc"/>
    </linearGradient>
  </defs>
  <rect id="background" x="0" y="0" width="400" height="400" fill="url(#skyGrad)"/>
  <g id="stars">
    <circle cx="50" cy="50" r="1.5" fill="#fff" opacity="0.8"/>
    <circle cx="120" cy="30" r="1" fill="#fff"/>
    <circle cx="280" cy="60" r="1.5" fill="#fff" opacity="0.6"/>
    <circle cx="350" cy="40" r="1" fill="#fff"/>
    <circle cx="200" cy="20" r="1" fill="#fff" opacity="0.7"/>
    <circle cx="80" cy="100" r="0.8" fill="#fff"/>
    <circle cx="320" cy="120" r="1" fill="#fff" opacity="0.5"/>
  </g>
  <circle id="planet" cx="340" cy="80" r="22" fill="#ff6b4a"/>
  <ellipse id="planetRing" cx="340" cy="80" rx="34" ry="8" fill="none" stroke="#c4ff3d" stroke-width="1.5" opacity="0.6" transform="rotate(-20 340 80)"/>
  <g id="rocket">
    <path id="body" d="M200,130 Q175,130 175,180 L175,270 Q175,290 200,290 Q225,290 225,270 L225,180 Q225,130 200,130 Z" fill="url(#bodyGrad)"/>
    <path id="bodyAccent" d="M175,240 L225,240 L225,260 Q225,270 215,270 L185,270 Q175,270 175,260 Z" fill="#ff6b4a"/>
    <circle id="window" cx="200" cy="200" r="16" fill="#1a1c26" stroke="#c4ff3d" stroke-width="2"/>
    <circle id="windowInner" cx="200" cy="200" r="9" fill="#c4ff3d"/>
    <path id="leftFin" d="M175,250 L150,290 L175,285 Z" fill="#ff6b4a"/>
    <path id="rightFin" d="M225,250 L250,290 L225,285 Z" fill="#ff6b4a"/>
    <path id="flame" d="M183,290 Q200,335 217,290 Q210,310 200,322 Q190,310 183,290 Z" fill="url(#flameGrad)"/>
  </g>
  <g id="clouds">
    <ellipse id="cloud1" cx="80" cy="340" rx="38" ry="9" fill="#f0f1f5" opacity="0.18"/>
    <ellipse id="cloud2" cx="320" cy="360" rx="48" ry="11" fill="#f0f1f5" opacity="0.12"/>
  </g>
  <rect id="ground" x="0" y="375" width="400" height="25" fill="#1a1c26"/>
</svg>`;

// ===== CSS keyframe gen =====
function presetToCSS(name, preset) {
  const kf = preset.keyframes;
  const maxLen = Math.max(...Object.values(kf).map(v=>v.length));
  const lines = [];
  for (let i=0; i<maxLen; i++) {
    const pct = Math.round(i/(maxLen-1)*100);
    const props = [];
    if (kf.opacity) props.push(`opacity:${kf.opacity[i]}`);
    const t = [];
    if (kf.scale) t.push(`scale(${kf.scale[i]})`);
    else { const sx=kf.scaleX?.[i]??1, sy=kf.scaleY?.[i]??1; if(sx!==1||sy!==1) t.push(`scale(${sx},${sy})`); }
    if (kf.x||kf.y) t.push(`translate(${kf.x?.[i]??0}px,${kf.y?.[i]??0}px)`);
    if (kf.rotation) t.push(`rotate(${kf.rotation[i]}deg)`);
    if (kf.skewX) t.push(`skewX(${kf.skewX[i]}deg)`);
    if (t.length) props.push(`transform:${t.join(' ')};transform-origin:center;transform-box:fill-box`);
    lines.push(`  ${pct}% { ${props.join('; ')} }`);
  }
  return `@keyframes ${name} {\n${lines.join('\n')}\n}`;
}
function easingVal(e) { return { ease:'ease', 'ease-in-out':'ease-in-out', bounce:'cubic-bezier(.68,-0.55,.27,1.55)', linear:'linear' }[e]||'ease'; }

// ===== Lottie color/bounds/path (kept from before) =====
function parseColor(v) {
  if(!v||v==='none')return[0,0,0,0];
  const named={red:[1,0,0,1],green:[0,0.5,0,1],blue:[0,0,1,1],white:[1,1,1,1],black:[0,0,0,1],yellow:[1,1,0,1],cyan:[0,1,1,1],magenta:[1,0,1,1],orange:[1,0.65,0,1],purple:[0.5,0,0.5,1],pink:[1,0.75,0.8,1],gray:[0.5,0.5,0.5,1],transparent:[0,0,0,0],currentcolor:[1,1,1,1]};
  const l=v.trim().toLowerCase(); if(named[l])return named[l];
  if(l.startsWith('url('))return[1,1,1,1];
  if(l.startsWith('rgb')){const m=l.match(/[\d.]+/g);if(m)return[+m[0]/255,+m[1]/255,+m[2]/255,1];}
  const h=v.replace('#',''); return [parseInt(h.substring(0,2),16)/255||0,parseInt(h.substring(2,4),16)/255||0,parseInt(h.substring(4,6),16)/255||0,1];
}
function getBounds(el){try{const b=el.getBBox();return{x:b.x,y:b.y,w:b.width,h:b.height,cx:b.x+b.width/2,cy:b.y+b.height/2};}catch{return{x:0,y:0,w:100,h:100,cx:50,cy:50};}}

function pathToShapes(d) {
  const shapes=[]; let cur={i:[],o:[],v:[],c:false}; let cx=0,cy=0,sx=0,sy=0;
  const close=()=>{if(cur.v.length){cur.c=true;shapes.push(cur);}cur={i:[],o:[],v:[],c:false};};
  const emit=()=>{if(cur.v.length){shapes.push(cur);cur={i:[],o:[],v:[],c:false};}};
  const addV=(x,y,ix,iy,ox,oy)=>{cur.v.push([x,y]);cur.i.push([ix,iy]);cur.o.push([ox,oy]);};
  const pN=(s,i)=>{const m=s.substring(i).match(/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/);return m?[parseFloat(m[0]),i+m[0].length]:[0,i];};
  const pC=(s,i,n)=>{const v=[];while(v.length<n&&i<s.length){const[r,ni]=pN(s,i);v.push(r);i=ni;while(i<s.length&&/[\s,]/.test(s[i]))i++;}return[v,i];};
  let i=0;
  while(i<d.length){
    while(i<d.length&&/[\s,]/.test(d[i]))i++;
    if(i>=d.length)break;
    const cmd=d[i];i++;
    while(i<d.length&&/[\s,]/.test(d[i]))i++;
    switch(cmd){
      case'M':{emit();const[v,ni]=pC(d,i,2);cx=v[0];cy=v[1];sx=cx;sy=cy;addV(cx,cy,0,0,0,0);i=ni;break;}
      case'm':{emit();const[v,ni]=pC(d,i,2);cx+=v[0];cy+=v[1];sx=cx;sy=cy;addV(cx,cy,0,0,0,0);i=ni;break;}
      case'L':{const[v,ni]=pC(d,i,2);cx=v[0];cy=v[1];addV(cx,cy,0,0,0,0);i=ni;break;}
      case'l':{const[v,ni]=pC(d,i,2);cx+=v[0];cy+=v[1];addV(cx,cy,0,0,0,0);i=ni;break;}
      case'H':{const[v,ni]=pC(d,i,1);cx=v[0];addV(cx,cy,0,0,0,0);i=ni;break;}
      case'h':{const[v,ni]=pC(d,i,1);cx+=v[0];addV(cx,cy,0,0,0,0);i=ni;break;}
      case'V':{const[v,ni]=pC(d,i,1);cy=v[0];addV(cx,cy,0,0,0,0);i=ni;break;}
      case'v':{const[v,ni]=pC(d,i,1);cy+=v[0];addV(cx,cy,0,0,0,0);i=ni;break;}
      case'C':{const[cv,ci]=pC(d,i,6);const x1=cv[0],y1=cv[1],x2=cv[2],y2=cv[3],x3=cv[4],y3=cv[5];const pv=cur.v.length?cur.v[cur.v.length-1]:[cx,cy];if(cur.o.length)cur.o[cur.o.length-1]=[x1-pv[0],y1-pv[1]];cx=x3;cy=y3;addV(cx,cy,pv[0]-x2,pv[1]-y2,0,0);i=ci;break;}
      case'c':{const[cv,ci]=pC(d,i,6);const x1=cx+cv[0],y1=cy+cv[1],x2=cx+cv[2],y2=cy+cv[3],x3=cx+cv[4],y3=cy+cv[5];const pv=cur.v.length?cur.v[cur.v.length-1]:[cx,cy];if(cur.o.length)cur.o[cur.o.length-1]=[x1-pv[0],y1-pv[1]];cx=x3;cy=y3;addV(cx,cy,pv[0]-x2,pv[1]-y2,0,0);i=ci;break;}
      case'S':{const[sv,si]=pC(d,i,4);const x2=sv[0],y2=sv[1],x3=sv[2],y3=sv[3];const pv=cur.v.length?cur.v[cur.v.length-1]:[cx,cy];const po=cur.o.length?cur.o[cur.o.length-1]:[0,0];const x1=pv[0]+(pv[0]-(pv[0]-po[0])),y1=pv[1]+(pv[1]-(pv[1]-po[1]));if(cur.o.length)cur.o[cur.o.length-1]=[x1-pv[0],y1-pv[1]];cx=x3;cy=y3;addV(cx,cy,pv[0]-x2,pv[1]-y2,0,0);i=si;break;}
      case's':{const[sv,si]=pC(d,i,4);const pv=cur.v.length?cur.v[cur.v.length-1]:[cx,cy];const po=cur.o.length?cur.o[cur.o.length-1]:[0,0];const x1=pv[0]+(pv[0]-(pv[0]-po[0])),y1=pv[1]+(pv[1]-(pv[1]-po[1]));const x2=pv[0]+sv[0],y2=pv[1]+sv[1],x3=pv[0]+sv[2],y3=pv[1]+sv[3];if(cur.o.length)cur.o[cur.o.length-1]=[x1-pv[0],y1-pv[1]];cx=x3;cy=y3;addV(cx,cy,pv[0]-x2,pv[1]-y2,0,0);i=si;break;}
      case'Q':{const[qv,qi]=pC(d,i,4);const p0=cur.v.length?cur.v[cur.v.length-1]:[cx,cy];const cx1=p0[0]+(qv[0]-p0[0])*2/3,cy1=p0[1]+(qv[1]-p0[1])*2/3;const cx2=qv[2]+(qv[0]-qv[2])*2/3,cy2=qv[3]+(qv[1]-qv[3])*2/3;if(cur.o.length)cur.o[cur.o.length-1]=[cx1-p0[0],cy1-p0[1]];cx=qv[2];cy=qv[3];addV(cx,cy,p0[0]-cx2,p0[1]-cy2,0,0);i=qi;break;}
      case'q':{const[qv,qi]=pC(d,i,4);const p0=cur.v.length?cur.v[cur.v.length-1]:[cx,cy];const qx1=p0[0]+qv[0],qy1=p0[1]+qv[1],qx2=p0[0]+qv[2],qy2=p0[1]+qv[3];const cx1=p0[0]+(qx1-p0[0])*2/3,cy1=p0[1]+(qy1-p0[1])*2/3;const cx2=qx2+(qx1-qx2)*2/3,cy2=qy2+(qy1-qy2)*2/3;if(cur.o.length)cur.o[cur.o.length-1]=[cx1-p0[0],cy1-p0[1]];cx=qx2;cy=qy2;addV(cx,cy,p0[0]-cx2,p0[1]-cy2,0,0);i=qi;break;}
      case'T':{const[tv,ti]=pC(d,i,2);const p0=cur.v.length?cur.v[cur.v.length-1]:[cx,cy];const po=cur.o.length>=2?cur.o[cur.o.length-2]:[0,0];const rfX=p0[0]+(p0[0]-(p0[0]-po[0])),rfY=p0[1]+(p0[1]-(p0[1]-po[1]));const qx1=p0[0]+(rfX-p0[0]),qy1=p0[1]+(rfY-p0[1]);const cx1=p0[0]+(qx1-p0[0])*2/3,cy1=p0[1]+(qy1-p0[1])*2/3;const cx2=tv[0]+(qx1-tv[0])*2/3,cy2=tv[1]+(qy1-tv[1])*2/3;if(cur.o.length)cur.o[cur.o.length-1]=[cx1-p0[0],cy1-p0[1]];cx=tv[0];cy=tv[1];addV(cx,cy,p0[0]-cx2,p0[1]-cy2,0,0);i=ti;break;}
      case't':{const[tv,ti]=pC(d,i,2);const p0=cur.v.length?cur.v[cur.v.length-1]:[cx,cy];const po=cur.o.length>=2?cur.o[cur.o.length-2]:[0,0];const rfX=p0[0]+(p0[0]-(p0[0]-po[0])),rfY=p0[1]+(p0[1]-(p0[1]-po[1]));const qx1=p0[0]+(rfX-p0[0]),qy1=p0[1]+(rfY-p0[1]);const cx1=p0[0]+(qx1-p0[0])*2/3,cy1=p0[1]+(qy1-p0[1])*2/3;const qx2=p0[0]+tv[0],qy2=p0[1]+tv[1];const cx2=qx2+(qx1-qx2)*2/3,cy2=qy2+(qy1-qy2)*2/3;if(cur.o.length)cur.o[cur.o.length-1]=[cx1-p0[0],cy1-p0[1]];cx=qx2;cy=qy2;addV(cx,cy,p0[0]-cx2,p0[1]-cy2,0,0);i=ti;break;}
      case'A':case'a':{const[av,ai]=pC(d,i,7);const rx=Math.abs(av[0]),ry=Math.abs(av[1]),xRot=av[2]*Math.PI/180;const laf=av[3],sf=av[4];let ex=av[5],ey=av[6];if(cmd==='a'){ex+=cx;ey+=cy;}if(rx<0.01||ry<0.01){addV(cx,cy,0,0,0,0);cx=ex;cy=ey;i=ai;break;}const dx=(cx-ex)/2,dy=(cy-ey)/2;const cosR=Math.cos(xRot),sinR=Math.sin(xRot);const x1p=cosR*dx+sinR*dy,y1p=-sinR*dx+cosR*dy;const rx2=rx*rx,ry2=ry*ry,x1p2=x1p*x1p,y1p2=y1p*y1p;let rad=Math.sqrt(Math.max(0,(rx2*ry2-rx2*y1p2-ry2*x1p2)/(rx2*y1p2+ry2*x1p2)));if(laf===sf)rad=-rad;const cxp=rad*rx*y1p/ry,cyp=-rad*ry*x1p/rx;const ccx=cosR*cxp-sinR*cyp+(cx+ex)/2,ccy=sinR*cxp+cosR*cyp+(cy+ey)/2;const startA=Math.atan2((y1p-cyp)/ry,(x1p-cxp)/rx),endA=Math.atan2((-y1p-cyp)/ry,(-x1p-cxp)/rx);let da=endA-startA;if(sf===0&&da>0)da-=2*Math.PI;if(sf===1&&da<0)da+=2*Math.PI;const segs=Math.max(4,Math.ceil(Math.abs(da)/(Math.PI/4)));for(let k=1;k<=segs;k++){const t=k/segs,a=startA+da*t;const px=ccx+rx*cosR*Math.cos(a)-ry*sinR*Math.sin(a);const py=ccy+rx*sinR*Math.cos(a)+ry*cosR*Math.sin(a);addV(px,py,0,0,0,0);}cx=ex;cy=ey;i=ai;break;}
      case'Z':case'z':{close();cx=sx;cy=sy;break;}
      default:i++;break;
    }
  }
  emit(); return shapes;
}

function buildShape(el) {
  const tag=el.tagName.toLowerCase(); const bounds=getBounds(el);
  const fill=parseColor(el.getAttribute('fill')); const stroke=parseColor(el.getAttribute('stroke'));
  const sw=parseFloat(el.getAttribute('stroke-width'))||0;
  let shapes;
  switch(tag){
    case'rect':{const x=+el.getAttribute('x')||0,y=+el.getAttribute('y')||0,w=+el.getAttribute('width')||100,h=+el.getAttribute('height')||100;const rx=+el.getAttribute('rx')||0,rr=Math.min(rx,w/2,h/2);const d=rr>0?`M${x+rr},${y} L${x+w-rr},${y} Q${x+w},${y} ${x+w},${y+rr} L${x+w},${y+h-rr} Q${x+w},${y+h} ${x+w-rr},${y+h} L${x+rr},${y+h} Q${x},${y+h} ${x},${y+h-rr} L${x},${y+rr} Q${x},${y} ${x+rr},${y} Z`:`M${x},${y} L${x+w},${y} L${x+w},${y+h} L${x},${y+h} Z`;shapes=pathToShapes(d);break;}
    case'circle':{const cx=+el.getAttribute('cx')||50,cy=+el.getAttribute('cy')||50,r=+el.getAttribute('r')||40;shapes=pathToShapes(`M${cx-r},${cy} A${r},${r} 0 1,1 ${cx+r},${cy} A${r},${r} 0 1,1 ${cx-r},${cy} Z`);break;}
    case'ellipse':{const cx=+el.getAttribute('cx')||50,cy=+el.getAttribute('cy')||50,rx=+el.getAttribute('rx')||40,ry=+el.getAttribute('ry')||30;shapes=pathToShapes(`M${cx-rx},${cy} A${rx},${ry} 0 1,1 ${cx+rx},${cy} A${rx},${ry} 0 1,1 ${cx-rx},${cy} Z`);break;}
    case'path':shapes=pathToShapes(el.getAttribute('d')||'');break;
    case'line':{const x1=+el.getAttribute('x1')||0,y1=+el.getAttribute('y1')||0,x2=+el.getAttribute('x2')||100,y2=+el.getAttribute('y2')||100;shapes=pathToShapes(`M${x1},${y1} L${x2},${y2}`);break;}
    case'polygon':case'polyline':{const pts=(el.getAttribute('points')||'').trim().split(/[\s,]+/).map(Number);let d='';for(let j=0;j<pts.length;j+=2)d+=(j===0?'M':'L')+pts[j]+','+pts[j+1];if(tag==='polygon')d+=' Z';shapes=pathToShapes(d);break;}
    default:{const b=bounds;shapes=pathToShapes(`M${b.x},${b.y} L${b.x+b.w},${b.y} L${b.x+b.w},${b.y+b.h} L${b.x},${b.y+b.h} Z`);break;}
  }
  return {shapes,fill,stroke,sw,bounds};
}

// ===== Interpolate keyframe value at time t =====
function interpKeyframe(kfArray, t01) {
  if (!kfArray || kfArray.length === 0) return 0;
  if (kfArray.length === 1) return kfArray[0];
  const scaled = t01 * (kfArray.length - 1);
  const i = Math.floor(scaled);
  const frac = scaled - i;
  if (i >= kfArray.length - 1) return kfArray[kfArray.length - 1];
  return kfArray[i] + (kfArray[i+1] - kfArray[i]) * frac;
}

// ===== Compute transform at a given time for an animation =====
function computeAnimState(anim, time) {
  const preset = PRESETS[anim.preset];
  if (!preset) return { opacity: 1, transform: '' };
  const start = anim.start || 0;
  const delay = anim.delay || 0;
  const dur = anim.duration || 0.6;
  const localTime = time - start - delay;
  if (localTime < 0) return { opacity: 1, transform: '' };
  const t01 = Math.min(localTime / dur, 1);
  const kf = preset.keyframes;
  const opacity = kf.opacity ? interpKeyframe(kf.opacity, t01) : 1;
  const transforms = [];
  if (kf.scale) transforms.push(`scale(${interpKeyframe(kf.scale, t01)})`);
  else {
    const sx = kf.scaleX ? interpKeyframe(kf.scaleX, t01) : 1;
    const sy = kf.scaleY ? interpKeyframe(kf.scaleY, t01) : 1;
    if (sx !== 1 || sy !== 1) transforms.push(`scale(${sx},${sy})`);
  }
  if (kf.x || kf.y) transforms.push(`translate(${interpKeyframe(kf.x||[0,0], t01)}px,${interpKeyframe(kf.y||[0,0], t01)}px)`);
  if (kf.rotation) transforms.push(`rotate(${interpKeyframe(kf.rotation, t01)}deg)`);
  if (kf.skewX) transforms.push(`skewX(${interpKeyframe(kf.skewX, t01)}deg)`);
  return { opacity, transform: transforms.join(' ') };
}

// ===== Vue App =====
const { createApp, nextTick } = Vue;

createApp({
  data() {
    return {
      theme: 'dark',
      svgHtml: '',
      svgEl: null,
      elements: [],
      selectedIndices: [],
      groups: [],
      selectedGroupId: null,
      animations: {},
      selectedPreset: null,
      currentCategory: 'all',
      // edit props
      editDuration: 0.6,
      editDelay: 0,
      editStart: 0,
      editStagger: 0,
      editEasing: 'ease',
      editRepeat: 1,
      // playback
      isPlaying: false,
      playhead: 0,
      duration: 5,
      rafId: null,
      lastFrameTime: 0,
      // scrub
      isScrubbing: false,
      // ui
      rightOpen: true,
      showPasteModal: false,
      showCssModal: false,
      pasteText: '',
      cssOutput: '',
      toasts: [],
      toastId: 0,
      // live style injection
      liveStyleEl: null,
    };
  },

  computed: {
    categories: () => CATEGORIES,
    catLabel() { return (c) => c === 'all' ? 'All' : c.charAt(0).toUpperCase()+c.slice(1); },
    repeatOptions: () => [{value:1,label:'1×'},{value:2,label:'2×'},{value:3,label:'3×'},{value:'infinite',label:'∞'}],
    easingOptions: () => [{value:'ease',label:'Ease'},{value:'ease-in-out',label:'E-I-O'},{value:'bounce',label:'Bounce'},{value:'linear',label:'Linear'}],
    filteredPresets() { return this.currentCategory==='all'?PRESET_LIST:PRESET_LIST.filter(p=>p.cat===this.currentCategory); },
    canvasInfo() { return this.svgEl ? `viewBox ${this.svgEl.getAttribute('viewBox')||''}` : 'No SVG'; },
    selectedInfo() {
      if (this.selectedIndices.length===0) return 'None';
      if (this.selectedIndices.length===1) { const e=this.elements[this.selectedIndices[0]]; return `${e.tag} · ${e.name}`; }
      return `${this.selectedIndices.length} elements`;
    },
    animatedElements() { return Object.keys(this.animations).map(Number).filter(i=>i<this.elements.length); },
    rulerTicks() {
      if (this.selectedIndices.length === 1 && this.animations[this.selectedIndices[0]]) {
        const a = this.animations[this.selectedIndices[0]];
        const rep = typeof a.repeat === 'number' ? a.repeat : 1;
        const animStart = a.start || 0;
        const delay = a.delay || 0;
        const dur = a.duration || 0.6;
        const totalEnd = animStart + delay + dur * rep;
        const ticks = [0];
        ticks.push(Math.round(animStart * 10) / 10);
        if (delay > 0) ticks.push(Math.round((animStart + delay) * 10) / 10);
        for (let r = 0; r < rep; r++) {
          const segEnd = animStart + delay + dur * (r + 1);
          ticks.push(Math.round(Math.min(segEnd, totalEnd) * 10) / 10);
        }
        const all = [...new Set(ticks)].sort((a, b) => a - b);
        const capped = all.filter(t => t <= this.duration + 0.01);
        return capped;
      }
      const ticks=[]; const step=this.duration<=3?0.5:1;
      for (let t=0; t<=this.duration+0.01; t+=step) ticks.push(Math.round(t*10)/10);
      return ticks;
    },
    timelineTracks() {
      return this.animatedElements.map(idx => {
        const a = this.animations[idx];
        const preset = PRESETS[a.preset];
        const el = this.elements[idx];
        return { idx, name: el.name, color: el.color, cat: preset.cat, presetName: preset.name, anim: a };
      });
    },
    selectedAnimStart() {
      if (this.selectedIndices.length === 1 && this.animations[this.selectedIndices[0]]) {
        const a = this.animations[this.selectedIndices[0]];
        return Math.round(((a.start || 0) + (a.delay || 0)) * 10) / 10;
      }
      return null;
    },
  },

  watch: {
    selectedIndices() { nextTick(() => this.updateSelectionBox()); },
    playhead(t) { this.applyLiveAnimations(t); },
  },

  methods: {
    // ===== SVG Loading =====
    loadSVG(text) {
      try {
        const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
        if (doc.querySelector('parsererror')) throw new Error('Invalid SVG');
        const svg = doc.querySelector('svg');
        if (!svg) throw new Error('No <svg> root');
        this.stopPlay();
        this.svgEl = svg.cloneNode(true);
        this.svgEl.querySelectorAll('*').forEach(e => { if (e.style) e.style.pointerEvents = 'auto'; });
        this.svgHtml = this.svgEl.outerHTML;
        this.parseElements();
        this.selectedIndices = [];
        this.animations = {};
        this.selectedPreset = null;
        this.playhead = 0;
        this.toast(`Loaded · ${this.elements.length} elements`, 'success');
        nextTick(() => { this.syncRefs(); this.updateDuration(); });
      } catch (err) { this.toast('Failed: '+err.message, 'error'); }
    },

    syncRefs() {
      const svg = this.$refs.svgStage?.querySelector('svg');
      if (!svg) return;
      this.svgEl = svg;
      this.elements.forEach(item => {
        const live = svg.querySelector(`#${cssEscape(item.id)}`);
        if (live) item.el = live;
      });
    },

    parseElements() {
      this.elements = [];
      const tags = ['rect','circle','ellipse','path','text','g','polygon','polyline','line','image','use'];
      const counters = {};
      this.svgEl.querySelectorAll('*').forEach(el => {
        const tag = el.tagName.toLowerCase();
        if (!tags.includes(tag)) return;
        let id = el.getAttribute('id');
        let name = id || el.getAttribute('data-name');
        let autoNamed = false;
        if (!name) {
          counters[tag] = (counters[tag]||0)+1;
          name = `${tag}-${counters[tag]}`;
          id = `sas-${tag}-${counters[tag]}`;
          while (this.svgEl.querySelector(`#${cssEscape(id)}`)) { counters[tag]++; id=`sas-${tag}-${counters[tag]}`; name=`${tag}-${counters[tag]}`; }
          el.setAttribute('id', id);
          autoNamed = true;
        }
        this.elements.push({ el, name, tag, id, color: elemColor(name), selector: `#${cssEscape(id)}`, autoNamed });
      });
    },

    onFileUpload(e) {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = (ev) => this.loadSVG(ev.target.result);
      r.readAsText(f);
      e.target.value = '';
    },

    confirmPaste() {
      const t = this.pasteText.trim();
      if (!t) { this.toast('Paste SVG first', 'error'); return; }
      this.loadSVG(t);
      this.showPasteModal = false;
      this.pasteText = '';
    },

    // ===== Selection =====
    onElemClick(idx, e) {
      if (e.ctrlKey || e.metaKey) this.toggleSelect(idx);
      else this.selectSingle(idx);
    },

    selectSingle(idx) {
      this.selectedIndices = [idx];
      this.selectedGroupId = null;
      this.loadEditProps(idx);
    },

    toggleSelect(idx) {
      this.selectedGroupId = null;
      const i = this.selectedIndices.indexOf(idx);
      if (i !== -1) this.selectedIndices.splice(i, 1);
      else this.selectedIndices.push(idx);
      if (this.selectedIndices.length === 1) this.loadEditProps(this.selectedIndices[0]);
    },

    selectAll() { this.selectedIndices = this.elements.map((_,i)=>i); },
    clearSelection() { this.selectedIndices = []; },

    loadEditProps(idx) {
      const a = this.animations[idx];
      if (a) {
        this.editDuration = a.duration; this.editDelay = a.delay; this.editStart = a.start;
        this.editEasing = a.easing; this.editRepeat = a.repeat;
        this.selectedPreset = a.preset;
      }
    },

    // ===== Canvas Interaction =====
    onCanvasClick(e) {
      const svg = this.$refs.svgStage?.querySelector('svg');
      if (!svg) return;
      let target = e.target;
      while (target && target !== svg && target !== this.$refs.svgStage) {
        const idx = this.elements.findIndex(item => item.el === target);
        if (idx !== -1) {
          if (e.ctrlKey || e.metaKey) this.toggleSelect(idx);
          else this.selectSingle(idx);
          return;
        }
        target = target.parentNode;
      }
      if (!e.ctrlKey && !e.metaKey) this.clearSelection();
    },

    onCanvasOver(e) {
      const svg = this.$refs.svgStage?.querySelector('svg'); if (!svg) return;
      let t = e.target;
      while (t && t !== svg) {
        const idx = this.elements.findIndex(item => item.el === t);
        if (idx !== -1) { if (!this.selectedIndices.includes(idx)) t.classList.add('hover-element'); return; }
        t = t.parentNode;
      }
    },

    onCanvasOut() {
      this.$refs.svgStage?.querySelectorAll('.hover-element').forEach(el => el.classList.remove('hover-element'));
    },

    // ===== Selection overlay =====
    updateSelectionBox() {
      const overlay = this.$refs.selectionOverlay;
      if (!overlay) return;
      overlay.innerHTML = '';
      const svg = this.$refs.svgStage?.querySelector('svg');
      if (!svg || this.selectedIndices.length === 0) return;
      const wrapRect = this.$refs.canvasWrap.getBoundingClientRect();
      this.selectedIndices.forEach(idx => {
        const el = this.elements[idx]?.el;
        if (!el || !el.getBBox) return;
        try {
          const bbox = el.getBBox();
          const pt = svg.createSVGPoint();
          pt.x = bbox.x; pt.y = bbox.y;
          const ctm = el.getCTM();
          if (ctm) {
            const screenPt = pt.matrixTransform(ctm);
            const screenPt2 = svg.createSVGPoint();
            screenPt2.x = bbox.x+bbox.width; screenPt2.y = bbox.y+bbox.height;
            const screenPt2T = screenPt2.matrixTransform(ctm);
            const svgRect = svg.getBoundingClientRect();
            const x = svgRect.left - wrapRect.left + Math.min(screenPt.x, screenPt2T.x);
            const y = svgRect.top - wrapRect.top + Math.min(screenPt.y, screenPt2T.y);
            const w = Math.abs(screenPt2T.x - screenPt.x);
            const h = Math.abs(screenPt2T.y - screenPt.y);
            const box = document.createElement('div');
            box.className = 'sel-box';
            box.style.left = x+'px'; box.style.top = y+'px';
            box.style.width = w+'px'; box.style.height = h+'px';
            overlay.appendChild(box);
          }
        } catch {}
      });
    },

    // ===== Groups =====
    createGroup() {
      if (this.selectedIndices.length < 2) return;
      const n = this.groups.length + 1;
      this.groups.push({ id:'g-'+Date.now(), name:`Group ${n}`, indices:[...this.selectedIndices] });
      this.toast(`Group ${n} created`, 'success');
    },

    // ===== Presets =====
    selectPreset(id) { this.selectedPreset = id; },
    getPresetName(id) { return PRESETS[id]?.name || id; },

    // ===== Assign =====
    assignAnimation() {
      if (this.selectedIndices.length === 0) { this.toast('Select element(s) first', 'error'); return; }
      if (!this.selectedPreset) { this.toast('Select a preset first', 'error'); return; }
      const stagger = this.editStagger;
      this.selectedIndices.forEach((idx, i) => {
        this.animations[idx] = {
          preset: this.selectedPreset,
          duration: this.editDuration,
          delay: this.editDelay,
          start: this.editStart + (stagger * i / 1000),
          easing: this.editEasing,
          repeat: this.editRepeat,
        };
      });
      this.updateDuration();
      this.toast(`Assigned ${PRESETS[this.selectedPreset].name}`, 'success');
      // preview
      this.playhead = this.editStart;
      this.applyLiveAnimations(this.playhead);
    },

    clearAnimation(idx) {
      delete this.animations[idx];
      this.updateDuration();
      this.toast('Animation removed', 'success');
    },

    // ===== Duration calc =====
    updateDuration() {
      let maxEnd = 3;
      Object.values(this.animations).forEach(a => {
        const rep = typeof a.repeat === 'number' ? a.repeat : 1;
        const end = (a.start||0) + (a.delay||0) + (a.duration||0.6) * rep;
        if (end > maxEnd) maxEnd = end;
      });
      this.duration = Math.ceil(maxEnd + 0.5);
    },

    // ===== Playback =====
    togglePlay() {
      if (this.isPlaying) this.stopPlay();
      else this.startPlay();
    },

    startPlay() {
      if (this.animatedElements.length === 0) { this.toast('No animations to play', 'error'); return; }
      if (this.playhead >= this.duration) this.playhead = 0;
      this.isPlaying = true;
      this.lastFrameTime = performance.now();
      const loop = (now) => {
        if (!this.isPlaying) return;
        const dt = (now - this.lastFrameTime) / 1000;
        this.lastFrameTime = now;
        this.playhead += dt;
        if (this.playhead >= this.duration) {
          this.playhead = this.duration;
          this.stopPlay();
          return;
        }
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    },

    stopPlay() {
      this.isPlaying = false;
      if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    },

    seekToStart() { this.stopPlay(); this.playhead = 0; },
    seekToEnd() { this.stopPlay(); this.playhead = this.duration; },

    formatTime(s) { return s.toFixed(1)+'s'; },

    // ===== Live animation application =====
    applyLiveAnimations(time) {
      const svg = this.$refs.svgStage?.querySelector('svg');
      if (!svg) return;
      this.animatedElements.forEach(idx => {
        const el = this.elements[idx]?.el;
        if (!el) return;
        const a = this.animations[idx];
        const state = computeAnimState(a, time);
        el.style.opacity = state.opacity;
        el.style.transform = state.transform;
        el.style.transformOrigin = 'center';
        el.style.transformBox = 'fill-box';
      });
      // reset non-animated
      this.elements.forEach((item, idx) => {
        if (!this.animations[idx] && item.el) {
          item.el.style.opacity = '';
          item.el.style.transform = '';
        }
      });
      if (time === 0) {
        // full reset
        this.elements.forEach(item => { if (item.el) { item.el.style.opacity=''; item.el.style.transform=''; } });
      }
    },

    // ===== Timeline interaction =====
    onTimelineClick(e) {
      const tl = this.$refs.timelineEl;
      const rect = tl.getBoundingClientRect();
      const labelW = 140;
      const x = e.clientX - rect.left - labelW;
      const w = rect.width - labelW;
      if (x < 0) return;
      const t = Math.max(0, Math.min(this.duration, (x / w) * this.duration));
      this.stopPlay();
      this.playhead = t;
    },

    startScrub(e) {
      e.preventDefault();
      this.isScrubbing = true;
      this.stopPlay();
      const move = (ev) => {
        const tl = this.$refs.timelineEl;
        const rect = tl.getBoundingClientRect();
        const labelW = 140;
        const x = ev.clientX - rect.left - labelW;
        const w = rect.width - labelW;
        this.playhead = Math.max(0, Math.min(this.duration, (x / w) * this.duration));
      };
      const up = () => { this.isScrubbing=false; document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },

    trackBarStyle(track) {
      const a = track.anim;
      const rep = typeof a.repeat === 'number' ? a.repeat : 1;
      const totalDur = a.duration * rep;
      const left = ((a.start||0) + (a.delay||0)) / this.duration * 100;
      const width = totalDur / this.duration * 100;
      return { left: left+'%', width: Math.max(width, 2)+'%' };
    },

    // ===== Export CSS =====
    exportCSS() {
      if (this.animatedElements.length === 0) { this.toast('Assign animations first', 'error'); return; }
      let css = '';
      this.animatedElements.forEach(idx => {
        const a = this.animations[idx];
        const preset = PRESETS[a.preset];
        const animName = `anim-${a.preset}-${idx}`;
        css += presetToCSS(animName, preset) + '\n';
        const rep = a.repeat === 'infinite' ? 'infinite' : a.repeat;
        css += `#svgCanvas ${this.elements[idx].selector} {\n  animation: ${animName} ${a.duration}s ${easingVal(a.easing)} ${a.delay}s ${rep} both;\n  animation-delay: ${(a.start||0)+(a.delay||0)}s;\n}\n\n`;
      });
      this.cssOutput = css;
      this.showCssModal = true;
    },

    async copyCSS() {
      try { await navigator.clipboard.writeText(this.cssOutput); this.toast('CSS copied', 'success'); this.showCssModal = false; }
      catch { const ta=document.createElement('textarea'); ta.value=this.cssOutput; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); this.toast('CSS copied', 'success'); this.showCssModal=false; }
    },

    // ===== Export Lottie =====
    exportLottie() {
      if (this.animatedElements.length === 0) { this.toast('Assign animations first', 'error'); return; }
      const fr = 60;
      const vb = this.svgEl?.getAttribute('viewBox') || '0 0 400 400';
      const parts = vb.split(/\s+/).map(Number);
      const w = parts[2]||400, h = parts[3]||400;
      const layers = [];
      let maxOp = 60;

      this.animatedElements.forEach((idx, layerIdx) => {
        const elInfo = this.elements[idx];
        const a = this.animations[idx];
        const preset = PRESETS[a.preset];
        if (!preset) return;
        const sd = buildShape(elInfo.el);
        const lottieShapes = [];
        sd.shapes.forEach(s => {
          const vd = s.v.map((p,vi) => ({
            i:{x:[s.i[vi]?.[0]||0],y:[s.i[vi]?.[1]||0]},
            o:{x:[s.o[vi]?.[0]||0],y:[s.o[vi]?.[1]||0]},
            c:s.c, v:[p[0],p[1]]
          }));
          lottieShapes.push({ty:'sh',d:1,ks:{a:0,k:{a:0,k:[{t:0,s:vd}]}}});
        });
        lottieShapes.push({ty:'fl',o:{a:0,k:100},c:{a:0,k:sd.fill},r:1,bm:0});
        if (sd.sw > 0) lottieShapes.push({ty:'st',o:{a:0,k:100},c:{a:0,k:sd.stroke},w:{a:0,k:sd.sw},lc:1,lj:1,bm:0});

        // Build transform keyframes from timeline
        const startFr = Math.round((a.start||0) * fr);
        const delayFr = Math.round((a.delay||0) * fr);
        const durFr = Math.round((a.duration||0.6) * fr);
        const rep = typeof a.repeat === 'number' ? a.repeat : 1;
        const kf = preset.keyframes;
        const b = sd.bounds;
        const hasX = kf.x?.some(v=>v!==0), hasY = kf.y?.some(v=>v!==0);
        const hasScale = kf.scale?.some(v=>v!==1);
        const hasScaleX = kf.scaleX?.some(v=>v!==1), hasScaleY = kf.scaleY?.some(v=>v!==1);
        const hasRot = kf.rotation?.some(v=>v!==0);
        const hasOpacity = kf.opacity?.some(v=>v!==1);
        const hasSkew = kf.skewX?.some(v=>v!==0);
        const ei = {x:[0.66],y:[0]}, eo = {x:[0.34],y:[1]};

        function mkKF(vals, mult) {
          return vals.map((v,i) => ({
            t: startFr + delayFr + Math.round(i/(vals.length-1||1)*durFr),
            s: [typeof v==='number'?v*(mult||1):v],
            i:{x:[ei.x[0]],y:[ei.y[0]]}, o:{x:[eo.x[0]],y:[eo.y[0]]}
          }));
        }

        function posKF(xV, yV) {
          const len = Math.max(xV.length, yV.length);
          return Array.from({length:len}, (_,i) => ({
            t: startFr + delayFr + Math.round(i/(len-1||1)*durFr),
            s: [(xV[i]??0)+b.cx, (yV[i]??0)+b.cy, 0],
            i:{x:[ei.x[0]],y:[ei.y[0]]}, o:{x:[eo.x[0]],y:[eo.y[0]]}, to:[0,0], ti:[0,0]
          }));
        }

        const transform = {
          anchor: [b.cx, b.cy, 0],
          position: hasX||hasY ? {a:1,k:posKF(kf.x||[0,0],kf.y||[0,0])} : {a:0,k:[b.cx,b.cy,0]},
          scale: hasScale ? {a:1,k:mkKF(kf.scale,100)} :
            hasScaleX||hasScaleY ? {a:1,k:(kf.scaleX||kf.scaleY).map((_,i)=>({
              t:startFr+delayFr+Math.round(i/((kf.scaleX||kf.scaleY).length-1||1)*durFr),
              s:[(kf.scaleX?.[i]??1)*100,(kf.scaleY?.[i]??1)*100,100],
              i:{x:[ei.x[0]],y:[ei.y[0]]}, o:{x:[eo.x[0]],y:[eo.y[0]]}
            }))} : {a:0,k:[100,100,100]},
          rotation: hasRot ? {a:1,k:mkKF(kf.rotation)} : {a:0,k:[0]},
          opacity: hasOpacity ? {a:1,k:mkKF(kf.opacity.map(v=>v*100))} : {a:0,k:[100]},
        };

        const layerFrames = startFr + delayFr + durFr * rep;
        if (layerFrames > maxOp) maxOp = layerFrames;

        const layer = {
          dd:0, ty:4, nm:elInfo.name, sr:1, st:0, ip:startFr, op:layerFrames,
          ks: { a:{a:0,k:transform.anchor}, p:transform.position, s:transform.scale, r:transform.rotation, o:transform.opacity },
          shapes: lottieShapes, ind: layerIdx+1
        };
        if (hasSkew) { layer.ks.sk = {a:1,k:mkKF(kf.skewX)}; layer.ks.sa = {a:0,k:[0]}; }
        layers.push(layer);
      });

      const lottie = { v:'5.5.2', fr, ip:0, op:maxOp, w, h, nm:'Animation', ddd:0, assets:[], layers, markers:[] };
      const blob = new Blob([JSON.stringify(lottie,null,2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a2 = document.createElement('a');
      a2.href = url; a2.download = `lottie-${Date.now()}.json`;
      document.body.appendChild(a2); a2.click(); document.body.removeChild(a2);
      URL.revokeObjectURL(url);
      this.toast('Lottie exported', 'success');
    },

    // ===== Toast =====
    toast(msg, type='info') {
      const id = ++this.toastId;
      this.toasts.push({id, message: msg, type});
      setTimeout(() => { this.toasts = this.toasts.filter(t=>t.id!==id); }, 3000);
    },
  },

  mounted() {
    this.loadSVG(DEFAULT_SVG);
    window.addEventListener('resize', () => this.updateSelectionBox());
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName==='TEXTAREA'||e.target.tagName==='INPUT') return;
      if (e.code==='Space') { e.preventDefault(); this.togglePlay(); }
      else if (e.code==='Escape') { this.stopPlay(); this.clearSelection(); }
      else if (e.code==='KeyA' && (e.ctrlKey||e.metaKey)) { e.preventDefault(); this.selectAll(); }
    });
  },
}).mount('#app');
