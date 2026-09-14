import * as THREE from "three";
import { ViewerBase } from "./viewer-base";
import { galaxyById, type GalaxyModel } from "./galaxy-stages";
import type { GalaxyId } from "../data/types";

const vertex = /* glsl */ `
  attribute vec3 color;
  attribute float aSize;
  attribute float aYoung;
  uniform float uDpr;
  uniform float uPopulation;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(aSize * uDpr * 38. / max(1., -mv.z), 1., 22.);
    vColor = color;
    vAlpha = mix(1., mix(.08, 1.7, aYoung), uPopulation);
  }
`;
const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - .5) * 2.;
    if (r > 1.) discard;
    float glow = exp(-r*r*5.) * (1. - smoothstep(.7, 1., r));
    gl_FragColor = vec4(vColor, glow * .52 * vAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/** Positions represent populations, never an individual star catalogue. */
export class GalaxyViewer extends ViewerBase {
  private galaxy = new THREE.Group();
  private material: THREE.ShaderMaterial;
  private model: GalaxyModel = galaxyById["milky-way"];
  private particleCount = 0;
  private mode = 0;
  private aim = new THREE.Vector3();
  private cameraGoal = new THREE.Vector3();
  private transitioning = false;
  private lastTime = performance.now();
  private labels: { element: HTMLSpanElement; position: THREE.Vector3 }[] = [];

  constructor(container: HTMLElement, id: GalaxyId = "milky-way", mode = 0, motion = true) {
    super(container, { fov: 44, cameraAt: [0, 20, 25], minDistance: 5, maxDistance: 65,
      far: 2000, sky: false, ariaLabel: "돌려 보는 은하의 구조" });
    // Soft sprites provide their own glow without full-screen bloom passes.
    this.bloomPass.enabled = false;
    this.setPixelRatio(Math.min(window.devicePixelRatio, this.lowPower ? 1.5 : 1.75));
    this.scene.background = new THREE.Color("#030711");
    this.material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment,
      uniforms: { uDpr: { value: this.renderer.getPixelRatio() }, uPopulation: { value: 0 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    this.scene.add(this.galaxy);
    this.controls.enablePan = false;
    this.controls.addEventListener("start", this.stopTransition);
    this.setMotion(motion);
    this.setGalaxy(id, mode);
    this.start();
  }

  private stopTransition = () => { this.transitioning = false; };

  private clearGalaxy() {
    this.galaxy.traverse(object => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();
      if (mesh.material && mesh.material !== this.material) {
        for (const mat of [mesh.material].flat()) mat.dispose();
      }
    });
    this.galaxy.clear();
    this.labels.forEach(label => label.element.remove());
    this.labels = [];
  }

  setGalaxy(id: GalaxyId, mode = 0) {
    this.clearGalaxy();
    this.model = galaxyById[id];
    let seed = [...id].reduce((n, c) => n * 31 + c.charCodeAt(0), 17) >>> 0;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return (seed + 1) / 4294967297; };
    const normal = () => Math.sqrt(-2 * Math.log(random())) * Math.cos(2 * Math.PI * random());
    const count = this.lowPower ? 24000 : 58000;
    const positions: number[] = [], colors: number[] = [], sizes: number[] = [], young: number[] = [];
    const gold = new THREE.Color("#efd1a1"), blue = new THREE.Color("#9cbbff"), pink = new THREE.Color("#ff82b4");
    const add = (x: number, y: number, z: number, color: THREE.Color, size: number, population: number) => {
      positions.push(x, y, z); colors.push(color.r, color.g, color.b); sizes.push(size); young.push(population);
    };
    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number, population = 0;
      const color = gold.clone();
      if (this.model.shape === "elliptical") {
        // Centrally concentrated volume, without an artificial empty shell.
        const r = Math.min(13, -Math.log(random() * random()) * 1.65);
        const a = random() * Math.PI * 2, cos = random() * 2 - 1, sin = Math.sqrt(1 - cos * cos);
        x = r * sin * Math.cos(a); y = r * cos * .8; z = r * sin * Math.sin(a) * .85;
        color.lerp(blue, random() * .18);
      } else if (this.model.shape === "irregular") {
        const clumps = [[-2, 0], [0, .5], [2.3, 1], [4.3, -.9], [-3.5, -2.5]];
        const c = clumps[Math.floor(random() * clumps.length)];
        const bar = random() < .46;
        x = bar ? normal() * 3.2 : c[0] + normal() * 1.25;
        z = bar ? normal() * .8 : c[1] + normal() * 1.2;
        y = normal() * .45;
        population = bar ? .15 : .9;
        color.lerp(blue, bar ? .25 : .88);
      } else {
        const r = Math.min(11.5, -Math.log(random() * random()) * 2.1);
        const bulge = random() < (id === "andromeda" ? .22 : .11);
        const bar = id === "milky-way" && !bulge && random() < .10;
        if (bulge) { x = normal() * .82; y = normal() * .55; z = normal() * .82; }
        else if (bar) { x = normal() * 1.8; y = normal() * .19; z = normal() * .35; }
        else {
          const arms = id === "andromeda" ? 2 : 4;
          const arm = Math.floor(random() * arms);
          const winding = Math.log(1 + r) * 2.7;
          const diffuse = random() < .35;
          const a = diffuse ? random() * Math.PI * 2 : winding + arm * Math.PI * 2 / arms + normal() * .16;
          x = Math.cos(a) * r; z = Math.sin(a) * r; y = normal() * (.09 + r * .015);
          population = diffuse ? .15 : .85;
          color.lerp(blue, population * Math.min(1, r / 3));
          if (!diffuse && Math.sin(a * 2 - winding * 2 + .45) > .91) color.multiplyScalar(.22);
        }
      }
      const gas = population > .6 && random() < .014;
      if (gas) color.copy(pink);
      color.multiplyScalar(.65 + random() * .45);
      add(x, y, z, color, gas ? 7 + random() * 4 : .85 + random() * 1.7, gas ? 1 : population);
    }
    if (this.model.jet) {
      for (let i = 0; i < 1300; i++) {
        const t = random() * 9, w = .04 + t * .025;
        add(t * .75, t * .64, normal() * w, blue, 1.3 + random() * 2.2, 1);
      }
      this.addLabel("블랙홀 주변에서 나온 제트", [4.5, 3.8, 0]);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute("aYoung", new THREE.Float32BufferAttribute(young, 1));
    this.particleCount = positions.length / 3;
    this.galaxy.add(new THREE.Points(geometry, this.material));
    if (id === "milky-way") this.addLabel("태양계 · 오리온자리 팔 부근", [-4.3, .15, 3.1]);
    if (id === "andromeda") this.addLabel("별이 빽빽한 중심부", [0, 0, 0]);
    if (id === "large-magellanic-cloud") this.addLabel("별 탄생 영역 · 위치는 개략적", [4.3, .1, -.9]);
    this.setMode(mode);
    this.camera.position.copy(this.cameraGoal);
    this.controls.target.copy(this.aim);
    this.controls.update();
    this.transitioning = false;
  }

  private addLabel(text: string, at: [number, number, number]) {
    const element = document.createElement("span");
    element.className = "galaxy-pin";
    element.textContent = text;
    this.container.appendChild(element);
    this.labels.push({ element, position: new THREE.Vector3(...at) });
  }

  setMode(mode: number) {
    this.mode = Math.max(0, Math.min(3, Math.round(Number.isFinite(mode) ? mode : 0)));
    const elliptical = this.model.shape === "elliptical";
    const radius = this.model.shape === "irregular" ? 23 : 31;
    this.aim.set(0, 0, 0);
    if (this.mode === 1) this.cameraGoal.set(0, elliptical ? 12 : 2, radius);
    else if (this.mode === 2) this.cameraGoal.set(0, 5, elliptical ? 13 : 11);
    else this.cameraGoal.set(0, this.model.id === "andromeda" ? 12 : 22, radius * .77);
    if (this.camera.aspect < 1) this.cameraGoal.multiplyScalar(1 / Math.sqrt(this.camera.aspect));
    this.material.uniforms.uPopulation.value = this.mode === 3 ? 1 : 0;
    this.transitioning = true;
  }

  resetView() { this.setMode(this.mode); }

  getDebugInfo() { return { galaxy: this.model.id, mode: this.mode, particles: this.particleCount, ...this.getDiagnostics() }; }

  protected onFrame(_delta: number) {
    const now = performance.now(), elapsed = Math.min((now - this.lastTime) / 1000, .05);
    this.lastTime = now;
    if (this.transitioning) {
      const factor = this.motion ? 1 - Math.exp(-elapsed * 5) : 1;
      this.camera.position.lerp(this.cameraGoal, factor);
      this.controls.target.lerp(this.aim, factor);
      if (this.camera.position.distanceTo(this.cameraGoal) < .015) this.transitioning = false;
    }
    this.camera.updateMatrixWorld();
    for (const label of this.labels) {
      const p = label.position.clone().project(this.camera);
      label.element.style.left = `${(p.x * .5 + .5) * 100}%`;
      label.element.style.top = `${(-p.y * .5 + .5) * 100}%`;
      label.element.hidden = Math.abs(p.x) > .85 || Math.abs(p.y) > .9 || p.z > 1 || this.mode === 3;
    }
  }

  override dispose() {
    this.controls.removeEventListener("start", this.stopTransition);
    this.clearGalaxy();
    this.material.dispose();
    super.dispose();
  }
}
