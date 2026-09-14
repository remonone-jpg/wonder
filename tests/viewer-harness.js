// Dev-only entry. Vite's production build includes only index.html.
import { SolarViewer } from '../src/lib/solar-viewer';
import { GalaxyViewer } from '../src/lib/galaxy-viewer';
import { StarViewer } from '../src/lib/star-viewer';
import { CosmosViewer } from '../src/lib/cosmos-viewer';
const mount = document.querySelector('#mount');
const output = document.querySelector('#result');
let viewer;
const disposedContexts = [];
const frames = count => new Promise(resolve => {
  let remaining = count;
  const tick = () => { if (--remaining <= 0) resolve(); else requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
});
function dispose() {
  if (!viewer) return;
  const gl = viewer.renderer.getContext();
  viewer.dispose();
  disposedContexts.push(gl);
  viewer = null;
}
function create(kind, id) {
  dispose();
  if (kind === 'solar') viewer = new SolarViewer(mount, {onPick(){},onHover(){},onReady(){}});
  if (kind === 'star') viewer = new StarViewer(mount, 'heavy', .6);
  if (kind === 'cosmos') viewer = new CosmosViewer(mount, 2/7);
  if (kind === 'galaxy') viewer = new GalaxyViewer(mount, id);
  if (kind === 'solar') viewer.frame('saturn');
}
async function measure() {
  await frames(45);
  const timings = [];
  await new Promise(resolve => {
    let last;
    const sample = now => {
      if (last !== undefined) timings.push(now - last);
      last = now;
      if (timings.length >= 120) resolve();
      else requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  let points = 0;
  viewer.scene.traverse(object => {if (object.isPoints) points += object.geometry.getAttribute('position').count;});
  const elapsed = timings.reduce((a,b)=>a+b,0);
  const sorted = [...timings].sort((a,b)=>a-b);
  return { ...viewer.getDiagnostics(), fps:Number((120000/elapsed).toFixed(1)), p95FrameMs:Number(sorted[Math.floor(sorted.length*.95)].toFixed(1)),
    particles:points, viewport:[innerWidth,innerHeight], canvas:[mount.clientWidth,mount.clientHeight] };
}
async function run(task) {
  document.querySelectorAll('button').forEach(b=>b.disabled=true);
  try { await task(); }
  catch (error) { output.textContent = String(error.stack || error); }
  finally {document.querySelectorAll('button').forEach(b=>b.disabled=false);}
}
document.querySelector('#fps').onclick = () => run(async () => {
  const results=[];
  for (const id of ['milky-way','andromeda','large-magellanic-cloud','m87']) {
    output.textContent = '측정 중: '+id;
    create('galaxy',id);
    results.push({id,...await measure()});
  }
  for (const kind of ['solar','star','cosmos']) {
    output.textContent = '측정 중: '+kind;
    create(kind);
    results.push({id:kind,...await measure()});
  }
  dispose();
  output.textContent = JSON.stringify({type:'performance', results},null,2);
});
document.querySelector('#cycles').onclick = () => run(async () => {
  const failures=[];
  disposedContexts.length=0;
  let maximumLive=0;
  for (let i=0;i<20;i++) {
    // Each complete round trip returns to solar; all three other viewers get exercised.
    for (const kind of ['solar', ['galaxy','star','cosmos'][i%3]]) {
      create(kind,'m87');
      await frames(3);
      maximumLive=Math.max(maximumLive,disposedContexts.filter(gl=>!gl.isContextLost()).length+1);
      if (disposedContexts.some(gl=>!gl.isContextLost())) failures.push(i+': old live context');
    }
    output.textContent = (i+1)+'/20 왕복 검사';
  }
  create('solar');
  await frames(4);
  dispose();
  await frames(2);
  const result={type:'lifecycle',roundTrips:20,created:disposedContexts.length,allContextsLost:disposedContexts.every(gl=>gl.isContextLost()),maximumLive,canvasRemaining:mount.querySelectorAll('canvas').length,failures};
  disposedContexts.length=0;
  output.textContent=JSON.stringify(result,null,2);
});
document.querySelector('#dispose').onclick=()=>{dispose();output.textContent='무대 비움';};
addEventListener('pagehide',dispose);

document.querySelector('#pause').onclick = () => run(async () => {
  dispose();
  viewer = new CosmosViewer(mount, 0, false);
  await frames(5);
  const initialFlash = viewer.hazePass.uniforms.uFlash.value;
  viewer.setStage(1);
  await frames(3);
  viewer.setStage(0);
  await frames(3);
  const returnFlash = viewer.hazePass.uniforms.uFlash.value;
  viewer.setMotion(true);
  viewer.replayBigBang();
  viewer.setMotion(false);
  await frames(3);
  const pausedFlash = viewer.hazePass.uniforms.uFlash.value;
  viewer.controls.dispatchEvent({type:'start'});
  viewer.camera.position.set(8, 3, 20);
  viewer.controls.update();
  const before = viewer.camera.position.clone();
  await frames(5);
  const cameraDrift = before.distanceTo(viewer.camera.position);
  dispose();
  output.textContent = JSON.stringify({type:'pause-regression',initialFlash,returnFlash,pausedFlash,cameraDrift,passed:initialFlash===0&&returnFlash===0&&pausedFlash===0&&cameraDrift<.001},null,2);
});
