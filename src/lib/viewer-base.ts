import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { asset } from "./asset";

/**
 * 3D 무대 하나가 공통으로 지고 있는 것 — 렌더러, 카메라, 조작, 발광,
 * 배경, 크기 맞춤, 그리고 정리.
 *
 * 상속으로 만든 이유는 이 클래스가 **루프를 소유**하기 때문이다. 매 프레임
 * `onFrame` 을 부르고 화면을 그리는 일은 base 가 하고, 그 안에서 무엇을
 * 움직일지만 각 무대가 채운다. 조합으로 짜면 각 무대가 `this.base.scene`,
 * `this.base.camera` 를 앞에 달고 다녀야 하고, base 는 프레임마다 주인에게
 * 되돌아 부를 콜백을 따로 받아야 한다 — 상속이 이미 공짜로 주는 것을
 * 손으로 배선하는 셈이다.
 *
 * 대신 규칙이 하나 있다. base 의 생성자는 루프를 시작하지 않는다. 자바스크립트
 * 클래스는 부모 생성자가 자식 필드 초기화보다 먼저 도는데, 루프가 거기서
 * 시작되면 `onFrame` 이 아직 만들어지지 않은 자식 필드를 본다. 그래서 각
 * 무대가 장면을 다 세운 뒤 마지막에 `this.start()` 를 부른다.
 */
export type ViewerOptions = {
  /** 세로 화각. 도 단위. */
  fov?: number;
  near?: number;
  far?: number;
  /** 카메라의 첫 자리. */
  cameraAt?: [number, number, number];
  minDistance?: number;
  maxDistance?: number;
  /**
   * 느린 것이 기본이다. 거리 범위가 넓은 무대에서 기본 속도로는 휠 한 번에
   * 아이가 따라갈 수 없다.
   */
  zoomSpeed?: number;
  dampingFactor?: number;
  /**
   * 블룸. 세 번째 값인 문턱이 요점이다 — 높게 잡아야 진짜로 밝은 것만
   * 번지고, 낮추면 장면 전체가 화면보호기처럼 된다.
   */
  bloom?: { strength: number; radius: number; threshold: number };
  /** 은하수 사진을 아주 큰 구체 안쪽에 바를지. */
  sky?: boolean;
  skyRadius?: number;
  ariaLabel?: string;
};

const DEFAULTS = {
  fov: 38,
  near: 0.01,
  far: 5e7,
  cameraAt: [0, 90, 210] as [number, number, number],
  minDistance: 3,
  maxDistance: 4e6,
  zoomSpeed: 0.25,
  dampingFactor: 0.06,
  bloom: { strength: 0.62, radius: 0.5, threshold: 0.72 },
  sky: true,
  skyRadius: 2e6,
  ariaLabel: "3D scene",
};

export abstract class ViewerBase {
  protected renderer: THREE.WebGLRenderer;
  protected scene = new THREE.Scene();
  protected camera: THREE.PerspectiveCamera;
  protected controls: OrbitControls;
  protected composer: EffectComposer;
  protected loader = new THREE.TextureLoader();
  protected container: HTMLElement;
  protected clock = new THREE.Clock();
  /**
   * 손에 쥔 기기인가. base 는 이것으로 픽셀비와 안티앨리어싱을 정하고,
   * 무대는 자기가 뿌리는 것의 양 — 파티클 수, 노이즈 옥타브 — 을 정한다.
   */
  protected lowPower: boolean;
  /** 초신성처럼 한순간 문턱을 내려야 하는 무대를 위해 열어 둔다. */
  protected bloomPass: UnrealBloomPass;

  private raf = 0;
  private resizeObserver: ResizeObserver;
  protected disposed = false;
  protected motion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  constructor(container: HTMLElement, options: ViewerOptions = {}) {
    const o = { ...DEFAULTS, ...options };
    this.container = container;

    // 좁은 화면은 대개 손에 쥔 기기다. 안티앨리어싱을 끄고 픽셀비를 눌러
    // 같은 장면을 더 적은 픽셀로 그린다.
    const lowPower = window.matchMedia("(max-width: 780px)").matches;
    this.lowPower = lowPower;
    this.renderer = new THREE.WebGLRenderer({ antialias: !lowPower, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.domElement.setAttribute("aria-label", o.ariaLabel);
    this.renderer.domElement.tabIndex = 0;
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(o.fov, 1, o.near, o.far);
    this.camera.position.set(...o.cameraAt);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = o.dampingFactor;
    this.controls.zoomSpeed = o.zoomSpeed;
    this.controls.minDistance = o.minDistance;
    this.controls.maxDistance = o.maxDistance;

    if (o.sky) this.buildSky(o.skyRadius);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(1, 1), o.bloom.strength, o.bloom.radius, o.bloom.threshold,
    );
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
  }

  /** The real Milky Way, on the inside of a very large sphere. */
  private buildSky(radius: number) {
    const texture = this.loader.load(asset("/textures/stars_milky_way.jpg"));
    texture.colorSpace = THREE.SRGBColorSpace;
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 48, 32),
      new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide, depthWrite: false }),
    );
    sky.name = "sky";
    this.scene.add(sky);
  }

  /** 무대가 장면을 다 세운 뒤 마지막에 부른다. */
  protected start() {
    this.animate();
  }

  /** 한 프레임 동안 무엇이 움직이는가. 무대마다 다른 유일한 부분이다. */
  protected abstract onFrame(delta: number): void;

  setMotion(enabled: boolean) {
    this.motion = enabled;
  }

  private animate = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.05);
    this.onFrame(this.motion && !document.hidden ? delta : 0);
    this.controls.update();
    this.composer.render();
  };

  protected resize() {
    const rect = this.container.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    this.renderer.setSize(width, height, false);
    this.composer?.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  /**
   * 이 무대가 잡고 있던 것을 전부 놓는다.
   *
   * `renderer.dispose()` 만으로는 부족하다. 그것은 렌더러가 만든 프로그램과
   * 렌더 목록을 비울 뿐, WebGL 컨텍스트 자체도 장면에 매달린 지오메트리와
   * 텍스처도 그대로 남는다. 층을 스무 번 오가며 재 봤더니 브라우저가
   * "Too many active WebGL contexts. Oldest context will be lost." 를
   * 되풀이해 찍었다 — 컨텍스트가 쌓이다 가장 오래된 것부터 강제로 끊기고
   * 있었다는 뜻이다.
   *
   * 그래서 둘을 더한다. 장면을 훑어 지오메트리·재질·텍스처를 하나씩 놓고
   * (태양계 무대는 텍스처만 6 MB 다), 마지막에 `forceContextLoss()` 로
   * 컨텍스트를 실제로 반납한다.
   *
   * 무대가 자기 몫으로 붙인 것 — 캔버스 이벤트 같은 것 — 이 있으면 이것을
   * 덮어쓰고 먼저 치운 뒤 `super.dispose()` 를 부른다.
   */
  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.controls.dispose();

    this.scene.traverse((object) => {
      const mesh = object as Partial<THREE.Mesh>;
      mesh.geometry?.dispose();
      for (const material of [mesh.material].flat()) {
        if (!material) continue;
        // 재질이 들고 있는 맵은 재질을 놓는다고 함께 놓이지 않는다.
        for (const value of Object.values(material)) {
          if (value instanceof THREE.Texture) value.dispose();
        }
        material.dispose();
      }
    });
    this.scene.clear();

    for (const pass of this.composer.passes) pass.dispose();
    this.composer.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
