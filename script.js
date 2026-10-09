/* ======== PERSONALIZE ======== */
const NAME = "";   // e.g. "Priya" — leave empty for a generic message
if (NAME) {
  document.getElementById("signoff").textContent = "Happy Birthday, " + NAME + "! ❤️";
}

/* ======== THREE.JS BACKGROUND ======== */
const bgBox = document.getElementById("bg");
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
bgBox.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, innerWidth/innerHeight, 0.1, 200);
camera.position.z = 30;

// heart geometry
const hs = new THREE.Shape();
hs.moveTo(5,5);
hs.bezierCurveTo(5,5,4,0,0,0);
hs.bezierCurveTo(-6,0,-6,7,-6,7);
hs.bezierCurveTo(-6,11,-3,15.4,5,19);
hs.bezierCurveTo(13,15.4,16,11,16,7);
hs.bezierCurveTo(16,7,16,0,10,0);
hs.bezierCurveTo(7,0,5,5,5,5);
const heartGeo = new THREE.ExtrudeGeometry(hs,{depth:4,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:1.2,bevelThickness:1.2});
heartGeo.center();

const world = new THREE.Group(); scene.add(world);
const palette = [0xff4d8d,0xff7eb3,0xff9ec4,0xf472b6,0xa855f7,0xc084fc,0xfbbf24,0xff6b6b];
const hearts = [];
for (let i=0;i<46;i++){
  const mat = new THREE.MeshStandardMaterial({
    color: palette[i%palette.length], roughness:.25, metalness:.35,
    emissive: palette[i%palette.length], emissiveIntensity:.18, transparent:true, opacity:.92
  });
  const m = new THREE.Mesh(heartGeo, mat);
  const s = (0.035 + Math.random()*0.06);
  m.scale.setScalar(s);
  m.position.set((Math.random()-.5)*70,(Math.random()-.5)*50,(Math.random()-.5)*50-5);
  m.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
  m.userData = {
    base:m.position.clone(), s, ph:Math.random()*6.28, sp:.3+Math.random()*.6,
    amp:1.5+Math.random()*3, rx:(Math.random()-.5)*.01, ry:(Math.random()-.5)*.015
  };
  world.add(m); hearts.push(m);
}

// glitter particles
const N = 700, pos = new Float32Array(N*3);
for (let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*120;pos[i*3+1]=(Math.random()-.5)*90;pos[i*3+2]=(Math.random()-.5)*80;}
const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos,3));
const dust = new THREE.Points(pg, new THREE.PointsMaterial({color:0xffd6ec,size:.35,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));
scene.add(dust);

// lights
scene.add(new THREE.AmbientLight(0xffffff,.55));
const dl = new THREE.DirectionalLight(0xffffff,.8); dl.position.set(1,1,1); scene.add(dl);
const p1 = new THREE.PointLight(0xff4d8d,1.6,90); p1.position.set(-20,10,15); scene.add(p1);
const p2 = new THREE.PointLight(0xa855f7,1.6,90); p2.position.set(20,-10,15); scene.add(p2);

// mouse parallax
const mouse = {x:0,y:0}, look = {x:0,y:0};
addEventListener("mousemove", e=>{mouse.x=(e.clientX/innerWidth-.5)*2; mouse.y=(e.clientY/innerHeight-.5)*2;});
addEventListener("deviceorientation", e=>{ if(e.gamma!=null){mouse.x=Math.max(-1,Math.min(1,e.gamma/30)); mouse.y=Math.max(-1,Math.min(1,(e.beta-45)/30));} });

const clock = new THREE.Clock();
function loop(){
  requestAnimationFrame(loop);
  const t = clock.getElapsedTime();
  hearts.forEach(h=>{
    const d=h.userData;
    h.position.x = d.base.x + Math.sin(t*d.sp+d.ph)*d.amp;
    h.position.y = d.base.y + Math.cos(t*d.sp*.9+d.ph)*d.amp;
    h.rotation.x += d.rx; h.rotation.y += d.ry;
  });
  dust.rotation.y = t*.015; dust.rotation.x = Math.sin(t*.1)*.05;
  look.x += (mouse.x-look.x)*.05; look.y += (mouse.y-look.y)*.05;
  camera.position.x = look.x*4; camera.position.y = -look.y*3;
  camera.lookAt(0,0,0);
  p1.position.x = -20+Math.sin(t*.6)*10; p2.position.y = -10+Math.cos(t*.5)*10;
  renderer.render(scene,camera);
}
loop();
addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});

// per-step camera / mood
const moods = [
  {z:30,rot:0,   a:0xff4d8d,b:0xa855f7},
  {z:25,rot:.5,  a:0xfbbf24,b:0xff4d8d},
  {z:32,rot:1.0, a:0xa855f7,b:0xff7eb3},
  {z:27,rot:1.5, a:0xff7eb3,b:0xfbbf24},
  {z:23,rot:2.0, a:0xff4d8d,b:0xfbbf24},
];
function applyMood(i){
  const m = moods[i];
  gsap.to(camera.position,{z:m.z,duration:2,ease:"power2.inOut"});
  gsap.to(world.rotation,{y:m.rot,duration:2.2,ease:"power2.inOut"});
  const ca=new THREE.Color(m.a), cb=new THREE.Color(m.b);
  gsap.to(p1.color,{r:ca.r,g:ca.g,b:ca.b,duration:1.5});
  gsap.to(p2.color,{r:cb.r,g:cb.g,b:cb.b,duration:1.5});
}

/* ======== STEPS ======== */
const steps = [...document.querySelectorAll("[data-step]")];
const bar = document.getElementById("bar");
const dotsBox = document.getElementById("dots");
let cur = -1, busy = false;

steps.forEach((_,i)=>{
  const b=document.createElement("button"); b.setAttribute("aria-label","Go to step "+(i+1));
  b.onclick=()=>goTo(i); dotsBox.appendChild(b);
});

// split titles into letters
document.querySelectorAll("[data-split]").forEach(el=>{
  const walk = node=>{
    [...node.childNodes].forEach(n=>{
      if(n.nodeType===3){
        const frag=document.createDocumentFragment();
        [...n.textContent].forEach(ch=>{
          const s=document.createElement("span"); s.className="char";
          s.textContent = ch===" " ? "\u00A0" : ch; frag.appendChild(s);
        });
        n.replaceWith(frag);
      } else if(n.nodeType===1 && !n.classList.contains("accent")) walk(n);
    });
  };
  walk(el);
});

let typeTimer;
function typeText(el){
  clearInterval(typeTimer);
  const txt = el.dataset.text; let i=0; el.textContent=""; el.classList.add("caret");
  typeTimer = setInterval(()=>{
    el.textContent = txt.slice(0,++i);
    if(i>=txt.length){clearInterval(typeTimer);el.classList.remove("caret");}
  }, 28);
}

function enter(i){
  const s = steps[i];
  gsap.set(s,{visibility:"visible"});
  s.scrollTop = 0;
  const tl = gsap.timeline();
  tl.fromTo(s,{opacity:0},{opacity:1,duration:.5});
  tl.fromTo(s.querySelector(".panel"),{y:70,scale:.92,rotationX:12},{y:0,scale:1,rotationX:0,duration:.9,ease:"back.out(1.4)"},0);
  const chars = s.querySelectorAll(".char");
  if(chars.length) tl.fromTo(chars,{y:50,opacity:0,rotation:()=>gsap.utils.random(-25,25)},{y:0,opacity:1,rotation:0,duration:.7,stagger:.035,ease:"back.out(2)"},.25);
  const rs = s.querySelectorAll(".r");
  if(rs.length) tl.fromTo(rs,{y:30,opacity:0},{y:0,opacity:1,duration:.7,stagger:.12,ease:"power3.out"},.5);
  const tp = s.querySelector("#typed"); if(tp) setTimeout(()=>typeText(tp),700);
  if(i===steps.length-1) setTimeout(()=>{ balloons(14); burstHearts(); },900);
}

function goTo(i){
  if(busy||i===cur||i<0||i>=steps.length) return;
  busy = true;
  const prev = cur; cur = i;
  [...dotsBox.children].forEach((d,k)=>d.classList.toggle("on",k===i));
  bar.style.width = (i/(steps.length-1))*100+"%";
  applyMood(i);
  if(prev>=0){
    gsap.to(steps[prev],{opacity:0,duration:.45,onComplete:()=>{gsap.set(steps[prev],{visibility:"hidden"});enter(i);busy=false;}});
    gsap.to(steps[prev].querySelector(".panel"),{y:-50,scale:.94,duration:.45});
  } else { enter(i); busy=false; }
}
document.querySelectorAll("[data-go=next]").forEach(b=>b.addEventListener("click",()=>goTo(cur+1)));
addEventListener("keydown",e=>{
  if(e.key==="ArrowRight"||e.key==="ArrowDown") goTo(cur+1);
  if(e.key==="ArrowLeft"||e.key==="ArrowUp") goTo(cur-1);
});

/* flip cards on touch */
document.querySelectorAll(".flip").forEach(f=>{
  f.addEventListener("click",()=>f.classList.toggle("open"));
  f.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();f.classList.toggle("open");}});
});

/* photo 3D tilt */
document.querySelectorAll(".photo").forEach(p=>{
  const base = p.style.transform;
  p.addEventListener("mousemove",e=>{
    const r=p.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    p.style.transform=`perspective(700px) rotateY(${x*22}deg) rotateX(${-y*22}deg) scale(1.06)`;
  });
  p.addEventListener("mouseleave",()=>p.style.transform=base);
});

/* heart burst in 3D bg */
function burstHearts(){
  hearts.forEach(h=>{
    gsap.fromTo(h.scale,{x:h.userData.s*2.2,y:h.userData.s*2.2,z:h.userData.s*2.2},
      {x:h.userData.s,y:h.userData.s,z:h.userData.s,duration:1.6,ease:"elastic.out(1,.4)"});
  });
}

/* balloons */
function balloons(n){
  const cols=["#ff4d8d","#a855f7","#fbbf24","#ff7eb3","#60a5fa","#34d399"];
  for(let i=0;i<n;i++){
    const b=document.createElement("div"); b.className="balloon";
    b.style.left=Math.random()*95+"vw"; b.style.background=cols[i%cols.length];
    document.body.appendChild(b);
    gsap.to(b,{y:-(innerHeight+250),x:gsap.utils.random(-60,60),duration:gsap.utils.random(6,11),delay:i*.25,ease:"none",onComplete:()=>b.remove()});
  }
}

/* confetti */
let heartShape=null;
try{ heartShape = confetti.shapeFromText({text:"❤️",scalar:2}); }catch(e){}
function fire(origin){
  confetti({particleCount:90,spread:80,origin,colors:["#ff4d8d","#fbbf24","#a855f7","#ffffff"]});
  if(heartShape) confetti({particleCount:20,spread:90,origin,shapes:[heartShape],scalar:2});
}
document.getElementById("celebrate").addEventListener("click",()=>{
  fire({x:.3,y:.6}); setTimeout(()=>fire({x:.7,y:.5}),250); setTimeout(()=>fire({x:.5,y:.35}),500);
  const end=Date.now()+2200;
  (function frame(){
    confetti({particleCount:4,angle:60,spread:60,origin:{x:0,y:.8}});
    confetti({particleCount:4,angle:120,spread:60,origin:{x:1,y:.8}});
    if(Date.now()<end) requestAnimationFrame(frame);
  })();
  balloons(20); burstHearts();
  gsap.fromTo(camera.position,{z:camera.position.z},{z:camera.position.z-8,duration:.6,yoyo:true,repeat:1,ease:"power2.inOut"});
});

/* sparkle trail */
const sBox=document.getElementById("sparkles"), sCols=["#ff4d8d","#a855f7","#fbbf24","#ff9ec4","#fff"];
let lastS=0;
function sparkle(x,y){
  const n=Date.now(); if(n-lastS<50) return; lastS=n;
  const s=document.createElement("div"); s.className="sparkle";
  const c=sCols[Math.floor(Math.random()*sCols.length)], z=3+Math.random()*6;
  Object.assign(s.style,{left:x+"px",top:y+"px",width:z+"px",height:z+"px",background:c,boxShadow:`0 0 8px ${c}`});
  sBox.appendChild(s); setTimeout(()=>s.remove(),900);
}
addEventListener("mousemove",e=>sparkle(e.clientX,e.clientY));
addEventListener("touchmove",e=>{const t=e.touches[0]; if(t) sparkle(t.clientX,t.clientY);},{passive:true});

/* start */
goTo(0);
