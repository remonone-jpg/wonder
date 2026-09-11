import * as THREE from "three";
import { ViewerBase } from "./viewer-base";
import { galaxyById, type GalaxyModel } from "./galaxy-stages";
import type { GalaxyId } from "../data/types";

const VERTEX = /* glsl */ `
  attribute float aRadius;
  attribute float aSeed;
  attribute float aDust;
  uniform float uMode;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSizeScale;
  varying float vRadius;
  varying float vSeed;
  varying float vDust;
  void main() {
    vec3 p = position;
    float breathing = sin(uTime * 0.25 + aSeed * 17.0) * 0.012;
    p *= 1.0 + breathing;
    float coreZoom = smoothstep(1.0, 2.0, uMode);
    p *= mix(1.0, 1.18, coreZoom);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp((aDust * 2.6 + 0.7) * uSizeScale * uPixelRatio * (48.0 / max(1.0, -mv.z)), 0.7, 13.0);
    vRadius = aRadius;
    vSeed = aSeed;
    vDust = aDust;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uMode;
  uniform float uDust;
  varying float vRadius;
  varying float vSeed;
  varying float vDust;
  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float distanceToCenter = length(point);
    if (distanceToCenter > 0.5) discard;
    float disc = smoothstep(0.5, 0.02, distanceToCenter);
    float core = exp(-vRadius * vRadius * 0.035);
    float structure = 0.55 + 0.45 * sin(vSeed * 42.0 + vRadius * 1.7);
    float dustLane = 1.0 - uDust * vDust * (0.32 + 0.68 * smoothstep(0.0, 10.0, vRadius));
    vec3 color = mix(uColor, uAccent, clamp(core * 0.55 + structure * 0.18, 0.0, 1.0));
    color = mix(color, vec3(1.0, 0.74, 0.46), core * 0.24);
    float modeBrightness = mix(0.78, 1.22, smoothstep(0.0, 3.0, uMode));
    gl_FragColor = vec4(color * modeBrightness, disc * dustLane * (0.16 + core * 0.55));
  }
`;

const CORE_VERTEX = /* glsl */ `
  uniform float uTime;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp((17.0 + sin(uTime * 1.8) * 2.0) * (28.0 / max(1.0, -mv.z)), 2.0, 42.0);
  }
`;

const CORE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if (distanceToCenter > 0.5) discard;
    float disc = smoothstep(0.5, 0.02, distanceToCenter);
    gl_FragColor = vec4(uColor * 1.7, disc * 0.8);
  }
`;

type DebugInfo = { galaxy: GalaxyId; mode: number; particles: number; fps: number; lowPower: boolean };

/** 여러 은하를 같은 파티클 언어로 비교하는 공통 무대. */
export class GalaxyViewer extends ViewerBase {
  private readonly particleMaterial: THREE.ShaderMaterial;
  private readonly coreMaterial: THREE.ShaderMaterial;
  private readonly markerMaterial: THREE.PointsMaterial;
  private readonly skyMaterial: THREE.MeshBasicMaterial | null;
  private particles: THREE.Points | null = null;
  private core: THREE.Points;
  private marker: THREE.Points;
  private jet: THREE.Points | null = null;
  private model: GalaxyModel = galaxyById["milky-way"];
  private mode = 0;
  private targetMode = 0;
  private particleCount: number;
  private progressSeconds = 0;
  private frameSamples = 0;
  private sampleSeconds = 0;
  private measuredFps = 0;

  constructor(container: HTMLElement, galaxyId: GalaxyId = "milky-way", mode = 0, motion = true) {
    super(container, {
      fov: 43,
      cameraAt: [0, 1.5, 24],
      minDistance: 5,
      maxDistance: 45,
      zoomSpeed: 0.32,
      bloom: { strength: 0.72, radius: 0.62, threshold: 0.28 },
      skyRadius: 1000,
      ariaLabel: "은하를 비교해 보는 3D 무대",
    });

    this.scene.background = new THREE.Color("#02040b");
    const sky = this.scene.getObjectByName("sky") as THREE.Mesh | undefined;
    this.skyMaterial = sky?.material instanceof THREE.MeshBasicMaterial ? sky.material : null;
    if (this.skyMaterial) {
      this.skyMaterial.transparent = true;
      this.skyMaterial.opacity = 0.16;
      this.skyMaterial.depthWrite = false;
    }

    this.particleCount = this.lowPower ? 9000 : 24000;
    this.particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("#9eb9ff") },
        uAccent: { value: new THREE.Color("#ffd18d") },
        uMode: { value: 0 },
        uDust: { value: 0.6 },
        uSizeScale: { value: 1 },
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, this.lowPower ? 1.5 : 2) },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.coreMaterial = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color("#ffe4b1") }, uTime: { value: 0 } },
      vertexShader: CORE_VERTEX,
      fragmentShader: CORE_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const coreGeometry = new THREE.BufferGeometry();
    coreGeometry.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3));
    this.core = new THREE.Points(coreGeometry, this.coreMaterial);
    this.scene.add(this.core);

    this.markerMaterial = new THREE.PointsMaterial({
      color: "#ffffff",
      size: 0.28,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const markerGeometry = new THREE.BufferGeometry();
    markerGeometry.setAttribute("position", new THREE.Float32BufferAttribute([3.9, 0.05, 1.7], 3));
    this.marker = new THREE.Points(markerGeometry, this.markerMaterial);
    this.scene.add(this.marker);

    this.setGalaxy(galaxyId, mode);
    super.setMotion(motion);
    this.start();
  }

  private random(state: { value: number }) {
    state.value = (state.value * 1664525 + 1013904223) >>> 0;
    return state.value / 4294967296;
  }

  private buildGeometry(model: GalaxyModel) {
    const positions = new Float32Array(this.particleCount * 3);
    const radii = new Float32Array(this.particleCount);
    const seeds = new Float32Array(this.particleCount);
    const dust = new Float32Array(this.particleCount);
    const state = { value: 0x42f00d + model.id.length * 991 };
    for (let i = 0; i < this.particleCount; i += 1) {
      const seed = this.random(state);
      let x = 0;
      let y = 0;
      let z = 0;
      let radius = 0;
      if (model.shape === "spiral") {
        radius = Math.pow(this.random(state), 0.55) * 10.2;
        const arm = Math.floor(this.random(state) * model.arms);
        const angle = (arm / model.arms) * Math.PI * 2 + radius * 0.74 + (this.random(state) - 0.5) * 0.62;
        const inner = Math.max(0.18, 1 - radius / 12);
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
        y = (this.random(state) - 0.5) * model.thickness * (0.45 + inner * 0.85);
        if (this.random(state) < 0.24) {
          const bulgeRadius = Math.pow(this.random(state), 0.7) * model.bulge;
          x *= bulgeRadius / Math.max(radius, 0.5);
          z *= bulgeRadius / Math.max(radius, 0.5);
          y *= 1.8;
          radius = bulgeRadius;
        }
      } else if (model.shape === "elliptical") {
        const theta = this.random(state) * Math.PI * 2;
        const phi = Math.acos(this.random(state) * 2 - 1);
        radius = Math.pow(this.random(state), 0.38) * 8.5;
        x = Math.sin(phi) * Math.cos(theta) * radius * 1.18;
        y = Math.cos(phi) * radius * 0.92;
        z = Math.sin(phi) * Math.sin(theta) * radius * 0.84;
      } else {
        const clump = Math.floor(this.random(state) * model.clusters);
        const clumpAngle = clump / model.clusters * Math.PI * 2;
        const clumpRadius = 3.1 + this.random(state) * 4.8;
        radius = Math.pow(this.random(state), 0.45) * 3.8;
        x = Math.cos(clumpAngle) * clumpRadius + (this.random(state) - 0.5) * radius * 2.1;
        y = (this.random(state) - 0.5) * model.thickness * 3.5 + (this.random(state) - 0.5) * 1.5;
        z = Math.sin(clumpAngle) * clumpRadius + (this.random(state) - 0.5) * radius * 2.1;
        radius += clumpRadius * 0.35;
      }
      const at = i * 3;
      positions[at] = x;
      positions[at + 1] = y;
      positions[at + 2] = z;
      radii[i] = radius;
      seeds[i] = seed;
      dust[i] = this.random(state);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aRadius", new THREE.BufferAttribute(radii, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute("aDust", new THREE.BufferAttribute(dust, 1));
    return geometry;
  }

  private buildJet() {
    const count = this.lowPower ? 420 : 1100;
    const positions = new Float32Array(count * 3);
    const state = { value: 0x9917 }; 
    for (let i = 0; i < count; i += 1) {
      const sign = i % 2 === 0 ? 1 : -1;
      const length = 1.0 + Math.pow(this.random(state), 0.55) * 11;
      const width = 0.05 + length * 0.035;
      const at = i * 3;
      positions[at] = (this.random(state) - 0.5) * width;
      positions[at + 1] = sign * length;
      positions[at + 2] = (this.random(state) - 0.5) * width;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: this.model.accent,
      size: 0.1,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    return new THREE.Points(geometry, material);
  }

  setGalaxy(galaxyId: GalaxyId, mode = this.targetMode) {
    this.model = galaxyById[galaxyId] ?? galaxyById["milky-way"];
    this.particleCount = this.particleBudget(this.model);
    this.applyRenderBudget();
    this.mode = Math.min(3, Math.max(0, mode));
    this.targetMode = this.mode;
    if (this.particles) {
      this.scene.remove(this.particles);
      this.particles.geometry.dispose();
    }
    this.particles = new THREE.Points(this.buildGeometry(this.model), this.particleMaterial);
    this.particles.frustumCulled = false;
    this.scene.add(this.particles);
    if (this.jet) {
      this.scene.remove(this.jet);
      this.jet.geometry.dispose();
      (this.jet.material as THREE.Material).dispose();
      this.jet = null;
    }
    if (this.model.jet) {
      this.jet = this.buildJet();
      this.scene.add(this.jet);
    }
    this.particleMaterial.uniforms.uColor.value.set(this.model.color);
    this.particleMaterial.uniforms.uAccent.value.set(this.model.accent);
    this.particleMaterial.uniforms.uDust.value = this.model.dust;
    this.particleMaterial.uniforms.uSizeScale.value = this.model.shape === "elliptical" ? 0.58 : this.model.shape === "irregular" ? 0.8 : 1;
    this.coreMaterial.uniforms.uColor.value.set(this.model.accent);
    this.marker.visible = this.model.id === "milky-way";
    this.applyView(this.mode);
  }

  private particleBudget(model: GalaxyModel) {
    if (model.shape === "elliptical") return this.lowPower ? 3500 : 5000;
    if (model.shape === "irregular") return this.lowPower ? 6500 : 12000;
    return this.lowPower ? 9000 : 24000;
  }

  private applyRenderBudget() {
    const dense = this.model.shape === "elliptical";
    const pixelRatio = Math.min(window.devicePixelRatio, dense ? 1 : this.lowPower ? 1.5 : 2);
    this.renderer.setPixelRatio(pixelRatio);
    this.bloomPass.strength = dense ? 0.48 : 0.72;
    this.resize();
  }

  setMode(mode: number) {
    this.targetMode = Math.min(3, Math.max(0, mode));
    if (!this.motion) {
      this.mode = this.targetMode;
      this.applyView(this.mode);
    }
  }

  override setMotion(enabled: boolean) {
    super.setMotion(enabled);
    if (!enabled) {
      this.mode = this.targetMode;
      this.applyView(this.mode);
    }
  }

  resetView() {
    this.camera.position.set(0, 1.5, 24);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  getDebugInfo(): DebugInfo {
    return { galaxy: this.model.id, mode: Math.round(this.mode), particles: this.particleCount, fps: this.measuredFps, lowPower: this.lowPower };
  }

  private applyView(mode: number) {
    const distances = [24, 20, 10, 17];
    const heights = [1.5, 0.8, 0.1, 1.1];
    const desiredZ = distances[Math.round(mode)];
    const desiredY = heights[Math.round(mode)];
    this.camera.position.z += (desiredZ - this.camera.position.z) * 0.08;
    this.camera.position.y += (desiredY - this.camera.position.y) * 0.08;
    this.particleMaterial.uniforms.uMode.value = mode;
    this.skyMaterial?.color.set(this.model.color);
  }

  protected onFrame(delta: number) {
    this.frameSamples += 1;
    this.sampleSeconds += delta;
    if (this.sampleSeconds >= 0.5) {
      this.measuredFps = this.frameSamples / this.sampleSeconds;
      this.frameSamples = 0;
      this.sampleSeconds = 0;
    }
    if (delta > 0) {
      this.progressSeconds += delta;
      this.mode += (this.targetMode - this.mode) * (1 - Math.exp(-delta * 8));
      if (this.particles) this.particles.rotation.y += delta * 0.008;
      if (this.jet) this.jet.rotation.y += delta * 0.008;
      if (this.particles) this.marker.rotation.y = this.particles.rotation.y;
    }
    this.particleMaterial.uniforms.uTime.value = this.progressSeconds;
    this.coreMaterial.uniforms.uTime.value = this.progressSeconds;
    this.applyView(this.mode);
  }

  override dispose() {
    this.particleMaterial.dispose();
    this.coreMaterial.dispose();
    this.markerMaterial.dispose();
    super.dispose();
  }
}
