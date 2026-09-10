const C=document.getElementById("fx"),x=C.getContext("2d");let W,H,dpr=devicePixelRatio||1;
function resize(){W=innerWidth;H=innerHeight;C.width=W*dpr;C.height=H*dpr;C.style.width=W+"px";C.style.height=H+"px";x.setTransform(dpr,0,0,dpr,0,0)}resize();addEventListener("resize",resize);
let m={x:W/2,y:H/2},webs=[],bits=[],rings=[],t0=performance.now();
addEventListener("pointermove",e=>{m.x=e.clientX;m.y=e.clientY;document.getElementById("mouse").textContent=`${String(m.x|0).padStart(3,"0")} : ${String(m.y|0).padStart(3,"0")}`;for(let i=0;i<2;i++)bits.push({x:m.x,y:m.y,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5,life:1})});
function blast(tx,ty,target){let sx=W/2,sy=H*.58;webs.push({sx,sy,tx,ty,p:0,target});for(let i=0;i<45;i++){let a=Math.random()*6.28,s=2+Math.random()*9;bits.push({x:sx,y:sy,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1})}rings.push({x:tx,y:ty,r:5,a:1});document.body.animate([{transform:"translate(0)"},{transform:"translate(8px,-5px)"},{transform:"translate(-7px,5px)"},{transform:"translate(0)"}],{duration:300})}
function webDraw(w){w.p=Math.min(1,w.p+.045);let p=w.p,tx=w.sx+(w.tx-w.sx)*p,ty=w.sy+(w.ty-w.sy)*p;x.strokeStyle="#fff";x.lineWidth=2;x.shadowBlur=14;x.shadowColor="#fff";x.beginPath();x.moveTo(w.sx,w.sy);let midx=(w.sx+tx)/2,midy=(w.sy+ty)/2; x.quadraticCurveTo(midx+Math.sin(p*12)*20,midy,tx,ty);x.stroke();x.shadowBlur=0;
if(p>.92){for(let r=15;r<130;r+=18){x.beginPath();x.arc(w.tx,w.ty,r*p,0,6.28);x.globalAlpha=.8-r/180;x.stroke()}x.globalAlpha=1}}
function frame(){x.clearRect(0,0,W,H);webs.forEach((w,i)=>{webDraw(w);if(w.p>=1){if(w.target)document.getElementById(w.target)?.scrollIntoView({behavior:"smooth"});webs.splice(i,1)}});bits.forEach((b,i)=>{b.x+=b.vx;b.y+=b.vy;b.vx*=.98;b.vy*=.98;b.life-=.025;x.globalAlpha=Math.max(0,b.life);x.fillStyle="#fff";x.beginPath();x.arc(b.x,b.y,1.7,0,6.28);x.fill();if(b.life<=0)bits.splice(i,1)});rings.forEach((r,i)=>{r.r+=8;r.a-=.04;x.globalAlpha=Math.max(0,r.a);x.strokeStyle="#fff";x.lineWidth=2;x.beginPath();x.arc(r.x,r.y,r.r,0,6.28);x.stroke();if(r.a<=0)rings.splice(i,1)});x.globalAlpha=1;requestAnimationFrame(frame)}requestAnimationFrame(frame);
function go(id){let e=document.getElementById(id);if(!e)return;let q=e.getBoundingClientRect();blast(q.left+q.width/2,Math.max(100,q.top+120),id)}
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
document.querySelectorAll(".links a").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();go(a.hash.slice(1))}));
addEventListener("pointerdown",e=>{if(e.target.closest("button,a"))return; if(document.getElementById("intro").getBoundingClientRect().top<0)blast(e.clientX,e.clientY,null)});
setTimeout(()=>document.getElementById("loader").classList.add("loader-hide"),1800);
let frames=0,last=performance.now();function stats(now){frames++;if(now-last>1000){document.getElementById("fps").textContent="SYSTEM "+Math.min(100,frames)+"%";frames=0;last=now}requestAnimationFrame(stats)}requestAnimationFrame(stats);
// ULTRA MOTION: web threads, sense pulse, shockwave and cinematic navigation
const impactText=document.getElementById("impactText");
const speedLines=document.querySelector(".speed-lines");
function cinematicImpact(word="WEB LOCKED"){
  if(!impactText)return;
  impactText.textContent=word;
  impactText.classList.remove("show"); void impactText.offsetWidth; impactText.classList.add("show");
  speedLines?.classList.remove("active"); void speedLines?.offsetWidth; speedLines?.classList.add("active");
}
function extraThreads(cx,cy){
  for(let a=0;a<Math.PI*2;a+=Math.PI/7){
    let len=80+Math.random()*180;
    webs.push({sx:cx,sy:cy,tx:cx+Math.cos(a)*len,ty:cy+Math.sin(a)*len,p:0.7,target:null});
  }
}
const oldBlast=blast;
blast=function(tx,ty,target){
  oldBlast(tx,ty,target);
  cinematicImpact(target ? "WEB LOCKED" : "WEB SHOT");
  extraThreads(tx,ty);
  for(let i=0;i<35;i++){
    let a=Math.random()*Math.PI*2;
    bits.push({x:tx,y:ty,vx:Math.cos(a)*(2+Math.random()*8),vy:Math.sin(a)*(2+Math.random()*8),life:1});
  }
};
// trailing web filament from pointer
let trail=[];
addEventListener("pointermove",e=>{
  trail.push({x:e.clientX,y:e.clientY,life:1});
  if(trail.length>22)trail.shift();
});
const oldFrame=frame;
function motionOverlay(){
  x.save(); x.lineWidth=1;
  for(let i=1;i<trail.length;i++){
    let a=trail[i-1],b=trail[i];
    x.globalAlpha=Math.min(a.life,b.life)*.28;
    x.strokeStyle="#fff"; x.beginPath(); x.moveTo(a.x,a.y); x.lineTo(b.x,b.y); x.stroke();
    a.life-=.035;
  }
  x.restore();
}
const originalRAF=requestAnimationFrame;
// Patch overlay by drawing continuously over existing canvas animation.
(function overlayLoop(){
  motionOverlay();
  requestAnimationFrame(overlayLoop);
})();

// keyboard shortcuts for dramatic navigation
addEventListener("keydown",e=>{
  const map={1:"home",2:"about",3:"skills",4:"projects",5:"contact"};
  if(map[e.key])go(map[e.key]);
});

// Small autonomous web sparks around the pointer
setInterval(()=>{
  if(Math.random()<.65){
    bits.push({x:m.x+(Math.random()-.5)*35,y:m.y+(Math.random()-.5)*35,
      vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,life:.65});
  }
},120);
