import * as THREE from "three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { ViewerBase } from "./viewer-base";
import { cosmosStages, stageAt, type CosmosStage } from "./cosmos-stages";

const PARTICLE_VERTEX = /* glsl */ `
  attribute vec3 aPartner;
  attribute vec3 aGalaxy;
  attribute float aSize;
  attribute float aSeed;
  uniform float uExpansion;
  uniform float uPairing;
  uniform float uGalaxy;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vTwinkle;
  varying float vSeed;
  void main() {
    vec3 paired = mix(position, aPartner, uPairing);
    vec3 formed = mix(paired, aGalaxy, uGalaxy);
    float breathing = 1.0 + sin(uTime * (0.7 + aSeed * 1.8) + aSeed * 21.0) * 0.025;
    vec3 p = formed * mix(0.16, 1.95, uExpansion) * breathing;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float depth = max(1.0, -mvPosition.z);
    gl_PointSize = clamp(aSize * uPixelRatio * (42.0 / depth), 0.65, 16.0);
    vTwinkle = 0.66 + 0.34 * sin(uTime * (1.2 + aSeed * 2.1) + aSeed * 19.0);
    vSeed = aSeed;
  }
`;

const PARTICLE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uRadiation;
  uniform float uStarLight;
  uniform float uStarDensity;
  uniform float uGalaxy;
  varying float vTwinkle;
  varying float vSeed;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float r = length(p);
    if (r > 0.5) discard;
    if (vSeed > uStarDensity) discard;
    float disc = smoothstep(0.5, 0.02, r);
    float glow = pow(disc, 1.8) * (0.42 + uStarLight * 1.4 + uRadiation * 0.38);
    vec3 warm = mix(vec3(1.0, 0.36, 0.16), vec3(1.0, 0.93, 0.72), uRadiation);
    vec3 color = mix(warm, uColor, 0.58 + uGalaxy * 0.3);
    color *= (0.45 + uStarLight * 0.8) * vTwinkle;
    gl_FragColor = vec4(color, disc * (0.1 + uStarLight * 0.72 + uGalaxy * 0.34));
  }
`;

const PHOTON_VERTEX = /* glsl */ `
  uniform float uRelease;
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vFade;
  void main() {
    vec3 p = position * (0.75 + uRelease * 1.7);
    p *= 1.0 + sin(uTime * 1.4 + aSeed * 18.0) * 0.04;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = clamp(uPixelRatio * (2.2 + 8.0 * uRelease) / max(1.0, -mvPosition.z * 0.08), 0.7, 7.0);
    vFade = 0.25 + 0.75 * uRelease;
  }
`;

const PHOTON_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor * 1.65, soft * vFade * 0.55);
  }
`;

/**
 * 재결합 시기의 화면 안개는 3D 부피를 샘플링하지 않고 화면 공간에서
 * 섞는다. 부피 셰이더는 태블릿에서 광선마다 여러 번 텍스처를 읽지만, 이
 * 모형은 RenderPass 뒤에 한 번만 얹어도 ‘앞이 뿌옇다가 투명해지는’ 핵심을
 * 전달한다. 빛이 풀리는 방향성은 별도의 Points 광자 구름으로 보탠다.
 */
const HAZE_SHADER = {
  uniforms: {
    tDiffuse: { value: null },
    uFog: { value: 0 },
    uRadiation: { value: 0 },
    uFlash: { value: 0 },
    uTime: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uFog;
    uniform float uRadiation;
    uniform float uFlash;
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vec4 base = texture2D(tDiffuse, vUv);
      vec2 centered = vUv - 0.5;
      float center = exp(-dot(centered, centered) * 5.2);
      vec3 mist = mix(vec3(0.015, 0.025, 0.07), vec3(0.95, 0.43, 0.2), uRadiation);
      float veil = uFog * (0.26 + 0.52 * center);
      vec3 color = mix(base.rgb, mist, veil);
      color += mist * center * uRadiation * 0.16;
      color += vec3(1.0, 0.93, 0.78) * uFlash * (0.58 + center * 0.42);
      float edge = smoothstep(0.85, 0.2, length(centered));
      gl_FragColor = vec4(color * (0.64 + edge * 0.36), 1.0);
    }
  `,
};

type DebugInfo = {
  particles: number;
  photons: number;
  lowPower: boolean;
  fps: number;
  stage: string;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 138억 년을 한 화면에서 지나가는 파티클 무대. */
export class CosmosViewer extends ViewerBase {
  private readonly particles: THREE.Points;
  private readonly photonField: THREE.Points;
  private readonly solarMarker: THREE.Points;
  private readonly particleMaterial: THREE.ShaderMaterial;
  private readonly photonMaterial: THREE.ShaderMaterial;
  private readonly markerMaterial: THREE.ShaderMaterial;
  private readonly hazePass: ShaderPass;
  private readonly skyMaterial: THREE.MeshBasicMaterial | null;
  private readonly particleCount: number;
  private readonly photonCount: number;
  private progress = 0;
  private targetProgress = 0;
  private flash = 1;
  private previousNearest = "big-bang";
  private frameSamples = 0;
  private sampleSeconds = 0;
  private measuredFps = 0;

  constructor(container: HTMLElement, at = 0, motion = true) {
    super(container, {
      fov: 48,
      cameraAt: [0, 0, 18],
      minDistance: 4,
      maxDistance: 52,
      zoomSpeed: 0.35,
      bloom: { strength: 0.78, radius: 0.64, threshold: 0.18 },
      skyRadius: 1000,
      ariaLabel: "우주의 시작을 보여 주는 3D 무대",
    });

    this.targetProgress = Math.min(1, Math.max(0, at));
    this.progress = this.targetProgress;
    this.previousNearest = stageAt(this.progress).nearest.id;
    this.flash = this.progress === 0 ? 1 : 0;

    const sky = this.scene.getObjectByName("sky") as THREE.Mesh | undefined;
    this.skyMaterial = sky?.material instanceof THREE.MeshBasicMaterial ? sky.material : null;
    if (this.skyMaterial) {
      this.skyMaterial.transparent = true;
      this.skyMaterial.opacity = 0.08;
      this.skyMaterial.depthWrite = false;
    }
    this.scene.background = new THREE.Color("#02030a");

    this.particleCount = this.lowPower ? 9000 : 28000;
    const particleGeometry = this.buildParticles(this.particleCount);
    this.particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uExpansion: { value: 0 },
        uPairing: { value: 0 },
        uGalaxy: { value: 0 },
        uRadiation: { value: 1 },
        uStarLight: { value: 0 },
        uStarDensity: { value: 0 },
        uColor: { value: new THREE.Color("#fff8e8") },
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, this.lowPower ? 1.5 : 2) },
      },
      vertexShader: PARTICLE_VERTEX,
      fragmentShader: PARTICLE_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.particles = new THREE.Points(particleGeometry, this.particleMaterial);
    this.particles.frustumCulled = false;
    this.scene.add(this.particles);

    this.photonCount = this.lowPower ? 1200 : 3200;
    const photonGeometry = this.buildPhotons(this.photonCount);
    this.photonMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uRelease: { value: 0 },
        uColor: { value: new THREE.Color("#ffd59e") },
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, this.lowPower ? 1.5 : 2) },
      },
      vertexShader: PHOTON_VERTEX,
      fragmentShader: PHOTON_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.photonField = new THREE.Points(photonGeometry, this.photonMaterial);
    this.photonField.frustumCulled = false;
    this.scene.add(this.photonField);

    const markerGeometry = new THREE.BufferGeometry();
    markerGeometry.setAttribute("position", new THREE.Float32BufferAttribute([5.2, 1.4, -2.6], 3));
    this.markerMaterial = new THREE.ShaderMaterial({
      uniforms: { uFocus: { value: 0 }, uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        uniform float uFocus;
        uniform float uTime;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp((8.0 + sin(uTime * 2.0) * 1.5) * uFocus * 24.0 / max(1.0, -mv.z), 0.0, 38.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uFocus;
        void main() {
          float r = length(gl_PointCoord - 0.5);
          if (r > 0.5) discard;
          gl_FragColor = vec4(0.77, 0.88, 1.0, smoothstep(0.5, 0.02, r) * uFocus);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.solarMarker = new THREE.Points(markerGeometry, this.markerMaterial);
    this.scene.add(this.solarMarker);

    this.hazePass = new ShaderPass(HAZE_SHADER);
    this.composer.insertPass(this.hazePass, 1);
    // `setMotion` is intentionally after every child field is ready. The base
    // constructor never starts the loop, but reduced-motion can still make
    // the override apply a stage immediately.
    super.setMotion(motion);
    this.applyStage(this.progress);
    this.start();
  }

  private random(seed: { value: number }) {
    seed.value = (seed.value * 1664525 + 1013904223) >>> 0;
    return seed.value / 4294967296;
  }

  private buildParticles(count: number) {
    const positions = new Float32Array(count * 3);
    const partners = new Float32Array(count * 3);
    const galaxies = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);
    const state = { value: 0x13579bdf };
    for (let i = 0; i < count; i += 1) {
      const seed = this.random(state);
      const theta = this.random(state) * Math.PI * 2;
      const z = this.random(state) * 2 - 1;
      const radius = 0.4 + Math.pow(this.random(state), 0.48) * 6.2;
      const xy = Math.sqrt(1 - z * z);
      const x = Math.cos(theta) * xy * radius;
      const y = z * radius;
      const zz = Math.sin(theta) * xy * radius;
      const at = i * 3;
      positions[at] = x;
      positions[at + 1] = y;
      positions[at + 2] = zz;
      const partnerRadius = radius * (0.18 + this.random(state) * 0.3);
      partners[at] = Math.cos(theta + 0.08) * xy * partnerRadius;
      partners[at + 1] = z * partnerRadius;
      partners[at + 2] = Math.sin(theta + 0.08) * xy * partnerRadius;

      // 여덟 개의 작은 은하를 만들고, 각 은하 안에 나선 팔을 굽힌다.
      const cluster = Math.floor(this.random(state) * 8);
      const clusterAngle = (cluster / 8) * Math.PI * 2;
      const clusterRadius = 5.8 + this.random(state) * 5.4;
      const arm = this.random(state) * Math.PI * 2;
      const armRadius = Math.sqrt(this.random(state)) * 3.3;
      const clusterX = Math.cos(clusterAngle) * clusterRadius;
      const clusterY = (this.random(state) - 0.5) * 3.4;
      const clusterZ = Math.sin(clusterAngle) * clusterRadius;
      galaxies[at] = clusterX + Math.cos(arm + armRadius * 0.55) * armRadius;
      galaxies[at + 1] = clusterY + (this.random(state) - 0.5) * (1.2 - armRadius * 0.15);
      galaxies[at + 2] = clusterZ + Math.sin(arm + armRadius * 0.55) * armRadius;
      sizes[i] = 0.7 + Math.pow(this.random(state), 3) * 2.8;
      seeds[i] = seed;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aPartner", new THREE.BufferAttribute(partners, 3));
    geometry.setAttribute("aGalaxy", new THREE.BufferAttribute(galaxies, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geometry;
  }

  private buildPhotons(count: number) {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const state = { value: 0x2468ace1 };
    for (let i = 0; i < count; i += 1) {
      const theta = this.random(state) * Math.PI * 2;
      const z = this.random(state) * 2 - 1;
      const radius = 1.2 + Math.pow(this.random(state), 0.55) * 16;
      const xy = Math.sqrt(1 - z * z);
      const at = i * 3;
      positions[at] = Math.cos(theta) * xy * radius;
      positions[at + 1] = z * radius;
      positions[at + 2] = Math.sin(theta) * xy * radius;
      seeds[i] = this.random(state);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geometry;
  }

  setStage(progress: number) {
    this.targetProgress = Math.min(1, Math.max(0, progress));
    if (!this.motion) this.progress = this.targetProgress;
    const nearest = stageAt(this.targetProgress).nearest.id;
    if (nearest !== this.previousNearest) {
      if (nearest === "big-bang") this.flash = 1;
      this.previousNearest = nearest;
    }
  }

  override setMotion(enabled: boolean) {
    super.setMotion(enabled);
    if (!enabled) {
      this.progress = this.targetProgress;
      this.applyStage(this.progress);
    }
  }

  replayBigBang() {
    if (this.motion) this.flash = 1;
  }

  resetView() {
    this.camera.position.set(0, 0, 18);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  getDebugInfo(): DebugInfo {
    return {
      particles: this.particleCount,
      photons: this.photonCount,
      lowPower: this.lowPower,
      fps: this.measuredFps,
      stage: stageAt(this.progress).nearest.id,
    };
  }

  private applyStage(progress: number) {
    const { index, fraction } = stageAt(progress);
    const left = cosmosStages[index];
    const right = cosmosStages[index + 1];
    const radiation = lerp(left.radiation, right.radiation, fraction);
    const fog = lerp(left.fog, right.fog, fraction);
    const color = new THREE.Color(left.color).lerp(new THREE.Color(right.color), fraction);
    this.particleMaterial.uniforms.uExpansion.value = lerp(left.expansion, right.expansion, fraction);
    this.particleMaterial.uniforms.uPairing.value = lerp(left.pairing, right.pairing, fraction);
    this.particleMaterial.uniforms.uGalaxy.value = lerp(left.galaxy, right.galaxy, fraction);
    this.particleMaterial.uniforms.uRadiation.value = radiation;
    this.particleMaterial.uniforms.uStarLight.value = lerp(left.starLight, right.starLight, fraction);
    this.particleMaterial.uniforms.uStarDensity.value = lerp(left.starDensity, right.starDensity, fraction);
    this.particleMaterial.uniforms.uColor.value.copy(color);
    this.photonMaterial.uniforms.uRelease.value = lerp(left.photonRelease, right.photonRelease, fraction);
    this.photonMaterial.uniforms.uColor.value.copy(color).lerp(new THREE.Color("#fff1bf"), 0.36);
    this.markerMaterial.uniforms.uFocus.value = lerp(left.solarFocus, right.solarFocus, fraction);
    this.hazePass.uniforms.uFog.value = fog;
    this.hazePass.uniforms.uRadiation.value = radiation;
    this.skyMaterial?.color.set(color);
    if (this.skyMaterial) this.skyMaterial.opacity = 0.04 + lerp(left.galaxy, right.galaxy, fraction) * 0.23;
    const focus = lerp(left.solarFocus, right.solarFocus, fraction);
    const desiredZ = 18 - focus * 7;
    this.camera.position.z += (desiredZ - this.camera.position.z) * 0.045;
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
      const easing = 1 - Math.exp(-delta * 8);
      this.progress += (this.targetProgress - this.progress) * easing;
      this.flash *= Math.exp(-delta * 4.2);
    }
    const time = this.particleMaterial.uniforms.uTime.value + delta;
    this.particleMaterial.uniforms.uTime.value = time;
    this.photonMaterial.uniforms.uTime.value = time;
    this.markerMaterial.uniforms.uTime.value = time;
    this.hazePass.uniforms.uTime.value = time;
    this.hazePass.uniforms.uFlash.value = this.flash;
    this.applyStage(this.progress);
  }

  override dispose() {
    this.hazePass.dispose?.();
    this.particleMaterial.dispose();
    this.photonMaterial.dispose();
    this.markerMaterial.dispose();
    super.dispose();
  }
}

export type { CosmosStage };
