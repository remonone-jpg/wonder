import * as THREE from "three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { ViewerBase } from "./viewer-base";
import {
  BIGGEST_FRAME,
  stageAt,
  starStages,
  type StarPath,
  type StarRemnant,
  type StarStage,
} from "./star-stages";
import {
  LENS_SHADER,
  churnOf,
  createCloudGeometry,
  createCloudMaterial,
  createShellMaterial,
  createStarMaterial,
  softDiscTexture,
} from "./star-materials";

/**
 * 별 하나가 일생을 지나가는 무대.
 *
 * 천체를 여럿 놓고 고르게 하는 태양계 무대와 달리 여기에는 **한 덩이**가
 * 있고 그것이 단계마다 모습을 바꾼다. 별의 일생은 여러 개를 늘어놓고
 * 비교하는 일이 아니라 하나가 변해 가는 일이라, 같은 것이 계속 남아 있는
 * 것이 그 자체로 설명이 된다.
 *
 * 그 한 덩이를 셋이 나눠 맡는다. 구름(파티클)은 성운과 잔해를, 구체는
 * 별 자체를, 껍질은 초신성의 폭풍을 맡는다. 단계 사이는 전부 이어서
 * 보간한다 — 뚝뚝 끊으면 그림 열 장이 되고, 이으면 한 생애가 된다.
 */

/** 알갱이 수. 저전력 기기에서 넷 중 하나로 줄인다. */
const CLOUD_COUNT = { low: 9_000, full: 34_000 };

/** 초신성이 터지는 데 걸리는 시간. */
const BURST_SECONDS = 1.5;

/** `lens` 1 을 실제 셰이더 세기로. 이보다 세면 화면이 엿가락처럼 늘어난다. */
const LENS_STRENGTH = 0.62;

/**
 * 은하수 배경을 돌려 놓는 회전.
 *
 * 블랙홀 단계를 위한 것이다. 빛이 휘는 것을 보여 주려면 뒤에 휠 것이 있어야
 * 하는데, 사진을 그대로 두면 은하 중심의 밝은 덩어리가 +X 쪽에 있어 시선
 * 뒤는 거의 빈 하늘이다. 첫 판이 그랬다 — 렌즈는 돌고 있는데 휠 것이 없어
 * 아무 일도 안 일어나는 것처럼 보였다.
 *
 * 각도는 눈대중이 아니라 계산이다. 텍스처를 96×48 로 줄여 가장 밝은 칸을
 * 찾고(그 자체가 흐리기 역할을 한다), `SphereGeometry` 의 uv 대응으로 그
 * 방향을 구한 뒤 — (0.995, 0.098, 0.033) — 카메라가 보는 방향
 * (0, -0.250, -0.968) 으로 옮기는 회전을 축·각으로 풀었다.
 */
const SKY_TURN = {
  axis: new THREE.Vector3(-0.0868, 0.9645, -0.2495).normalize(),
  angle: 1.627,
};

/** 뷰어의 세로 화각 절반의 탄젠트. `ViewerBase` 기본값 fov 38° 를 따른다. */
const TAN_HALF_FOV = Math.tan(THREE.MathUtils.degToRad(38) / 2);

/** 가장 큰 단계가 세로 화면에서 차지할 몫. 1 이면 위아래가 잘린다. */
const FILL = 0.72;

/** 최초 카메라 거리. 이후에는 각 단계의 관찰 범위에 맞춘다. */
const FIT = BIGGEST_FRAME / (FILL * TAN_HALF_FOV);

const lerp = THREE.MathUtils.lerp;

export class StarViewer extends ViewerBase {
  private star: THREE.Mesh;
  private starMaterial: THREE.ShaderMaterial;
  private cloud: THREE.Points;
  private cloudMaterial: THREE.ShaderMaterial;
  private cloudTexture: THREE.Texture;
  private shell: THREE.Mesh;
  private shellMaterial: THREE.ShaderMaterial;
  private lensPass: ShaderPass;

  private stages: StarStage[];
  private progress = 0;
  private targetProgress = 0;
  private autoFrame = true;
  private time = 0;
  private wantDistance = FIT;
  /** 지금 구체의 반지름. 렌즈의 검은 원이 이것을 따라간다. */
  private starSize = 1;

  // 프레임마다 새로 만들지 않으려고 쥐고 있는 것들.
  private colorFrom = new THREE.Color();
  private colorTo = new THREE.Color();
  private cloudFrom = new THREE.Color();
  private cloudTo = new THREE.Color();
  private scratch = new THREE.Vector3();
  private offset = new THREE.Vector3();
  private bufferSize = new THREE.Vector2();

  /** 터지는 중이면 0~1, 아니면 -1. */
  private burstAt = -1;
  /** 어느 단계에 서 있었는지. 바뀌는 순간이 초신성 방아쇠다. */
  private lastNearest = "";
  private baseBloom: { strength: number; threshold: number };

  /**
   * `path` 와 `at` 은 무대를 열면서 바로 설 자리다. 만들고 나서
   * `setStage` 를 부르는 것과 다르다 — 그러면 카메라가 성운 자리에서
   * 감쇠해 들어와, 층을 오갈 때마다 줌인하는 장면이 보인다.
   */
  constructor(container: HTMLElement, path: StarPath | null = null, at = 0, remnant: StarRemnant = "neutron", motion?: boolean) {
    super(container, {
      cameraAt: [0, 18, 70],
      minDistance: 0.1,
      maxDistance: 350,
      // 태양계 무대보다 좁고 높게 잡은 발광. 기본값(0.5/0.72)으로 두었더니
      // 주계열성의 64px 구체 둘레로 205px 짜리 후광이 퍼져, 552px 인
      // 적색거성과의 차이가 눈으로는 세 배쯤으로 줄었다. 크기를 보여 주는
      // 무대에서 빛 번짐이 크기를 덮으면 안 된다. 대신 백색왜성과
      // 중성자별은 발광이 2.4, 3.2 라 이 문턱도 가뿐히 넘어, 여전히 후광을
      // 단 밝은 점으로 남는다.
      bloom: { strength: 0.7, radius: 0.25, threshold: 1.15 },
      ariaLabel: "돌려 보는 별의 일생 모형",
    });

    this.baseBloom = { strength: this.bloomPass.strength, threshold: this.bloomPass.threshold };
    this.stages = starStages(path, remnant);
    if (motion !== undefined) this.motion = motion;
    this.controls.enablePan = false;
    this.controls.addEventListener("start", this.onExplore);
    this.scene.getObjectByName("sky")?.quaternion.setFromAxisAngle(SKY_TURN.axis, SKY_TURN.angle);

    this.starMaterial = createStarMaterial(this.lowPower);
    this.star = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 36), this.starMaterial);
    this.scene.add(this.star);

    this.cloudTexture = softDiscTexture();
    this.cloudMaterial = createCloudMaterial(this.cloudTexture);
    this.cloud = new THREE.Points(
      createCloudGeometry(this.lowPower ? CLOUD_COUNT.low : CLOUD_COUNT.full),
      this.cloudMaterial,
    );
    // 알갱이는 자기들끼리 순서를 다투지 않는다. 더하기로 겹치므로
    // 순서가 결과를 바꾸지 않고, 정렬을 끄면 프레임마다 드는 값이 없다.
    this.cloud.frustumCulled = false;
    this.scene.add(this.cloud);

    this.shellMaterial = createShellMaterial();
    this.shell = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), this.shellMaterial);
    this.shell.visible = false;
    this.scene.add(this.shell);

    this.lensPass = new ShaderPass(LENS_SHADER);
    this.lensPass.enabled = false;
    // RenderPass 바로 뒤. 발광보다 앞에 두어야 휜 배경이 그다음에 번져,
    // 고리가 빛나는 테로 보인다.
    this.composer.insertPass(this.lensPass, 1);

    this.progress = at;
    this.setStage(path, at, remnant);
    this.resize();
    this.snapDistance();
    this.start();
  }

  /**
   * 어느 길의 어디에 서 있는가.
   *
   * 길과 자리를 한 번에 받는 이유는 순서 때문이다. 따로 두면 길을 바꾼
   * 프레임과 자리를 옮긴 프레임 사이에 슬라이더 값이 없는 단계를 가리키는
   * 한 칸이 생긴다.
   */
  setStage(path: StarPath | null, progress: number, remnant: StarRemnant = "neutron") {
    const next = starStages(path, remnant);
    this.targetProgress = Math.min(1, Math.max(0, progress));
    const changedPath = next.some((stage, i) => stage.name !== this.stages[i]?.name) || next.length !== this.stages.length;
    if (changedPath || !this.motion) this.progress = this.targetProgress;
    this.stages = next;
    this.autoFrame = true;
    this.apply();
    if (!this.motion) this.snapDistance();
  }

  private onExplore = () => { this.autoFrame = false; };

  override setMotion(enabled: boolean) {
    super.setMotion(enabled);
    if (!enabled) {
      this.burstAt = -1;
      this.stepBurst(0);
      this.progress = this.targetProgress;
      this.apply();
      this.snapDistance();
    }
  }

  replayBurst() {
    if (this.motion && stageAt(this.targetProgress, this.stages).nearest.burst) this.burstAt = 0;
  }

  resetView() {
    this.autoFrame = true;
    if (!this.motion) this.snapDistance();
  }

  /** 지금 자리의 값들을 장면에 바른다. */
  private apply() {
    const { index, fraction } = stageAt(this.progress, this.stages);
    const a = this.stages[index];
    const b = this.stages[index + 1];

    // 단계에 들어서는 순간을 잡아 초신성을 터뜨린다. 지나쳐 갔다 돌아오면
    // 다시 터진다 — 다섯 살은 같은 것을 여러 번 본다.
    const nearest = this.stages[Math.round(this.progress * (this.stages.length - 1))];
    if (nearest.name !== this.lastNearest) {
      this.lastNearest = nearest.name;
      if (nearest.burst && this.motion) this.burstAt = 0;
      else if (this.burstAt >= 0) this.burstAt = -1;
    }

    // 크기는 로그로 잇는다. 0.05 에서 22 까지 440배 범위라, 선형으로 이으면
    // 작은 쪽 변화가 통째로 뭉개진다.
    const size = Math.exp(lerp(Math.log(a.size), Math.log(b.size), fraction));
    const frame = Math.exp(
      lerp(Math.log(a.frame ?? a.size), Math.log(b.frame ?? b.size), fraction),
    );
    this.star.scale.setScalar(size);
    this.starSize = size;

    const churn = churnOf(size);
    const u = this.starMaterial.uniforms;
    this.colorFrom.set(a.color);
    this.colorTo.set(b.color);
    (u.uColor.value as THREE.Color).copy(this.colorFrom).lerp(this.colorTo, fraction);
    u.uGlow.value = lerp(a.glow, b.glow, fraction);
    u.uCell.value = churn.cell;
    u.uSpeed.value = churn.speed;

    const lens = lerp(a.lens, b.lens, fraction);
    // 블랙홀로 갈수록 표면이 꺼진다. 렌즈가 서는 것과 같은 값으로 꺼져야
    // 검은 원과 휘는 테가 함께 나타난다.
    u.uDark.value = lens;

    const cu = this.cloudMaterial.uniforms;
    this.cloudFrom.set(a.cloudColor);
    this.cloudTo.set(b.cloudColor);
    (cu.uTint.value as THREE.Color).copy(this.cloudFrom).lerp(this.cloudTo, fraction);
    cu.uOpacity.value = lerp(a.cloud, b.cloud, fraction) * 0.32;
    cu.uRadius.value = Math.exp(
      lerp(Math.log(a.cloudRadius), Math.log(b.cloudRadius), fraction),
    );
    cu.uCollapse.value = lerp(a.collapse, b.collapse, fraction);
    cu.uShell.value = lerp(a.shell, b.shell, fraction);

    // 작은 잔해도 관찰할 수 있게 단계별로 확대한다. 화면에 모형의 배율이
    // 달라짐을 명시한다. 세로뿐 아니라 가로 화각도 고려해 좁은 화면에 맞춘다.
    this.wantDistance = frame / (FILL * TAN_HALF_FOV * Math.min(1, this.camera.aspect));
    this.controls.minDistance = Math.max(0.03, size * 1.4);

    this.lensPass.enabled = lens > 0.002;
    this.lensPass.uniforms.uStrength.value = lens * LENS_STRENGTH;
  }

  /** 거리를 감쇠 없이 지금 맞춘다. 무대가 열릴 때 줌아웃이 보이지 않게. */
  private snapDistance() {
    const target = this.controls.target;
    this.offset.copy(this.camera.position).sub(target);
    this.camera.position.copy(target).add(this.offset.setLength(this.wantDistance));
  }

  /**
   * 터지는 1.5초.
   *
   * 섬광은 두 곳에서 온다. 별 자체의 밝기를 서른 배 넘게 올리고, 동시에
   * 발광 문턱을 바닥까지 내려 그 빛이 화면 전체로 번지게 한다. 둘 중
   * 하나만으로는 "밝아졌다"까지고, 같이 해야 "터졌다"가 된다.
   */
  private stepBurst(delta: number) {
    if (this.burstAt < 0) {
      if (this.shell.visible) {
        this.shell.visible = false;
        this.starMaterial.uniforms.uFlash.value = 1;
        this.bloomPass.strength = this.baseBloom.strength;
        this.bloomPass.threshold = this.baseBloom.threshold;
      }
      return;
    }

    this.burstAt = Math.min(1, this.burstAt + delta / BURST_SECONDS);
    const t = this.burstAt;
    // 단번에 치솟고 천천히 꺼진다. 실제 초신성의 광도 곡선도 이 꼴이다.
    const flash = Math.exp(-t * 5.5);

    this.starMaterial.uniforms.uFlash.value = 1 + 28 * flash;
    this.bloomPass.strength = this.baseBloom.strength + 1.5 * flash;
    this.bloomPass.threshold = this.baseBloom.threshold * (1 - flash) + 0.04 * flash;

    this.shell.visible = true;
    this.shell.scale.setScalar(0.4 + 24 * Math.pow(t, 0.55));
    this.shellMaterial.uniforms.uOpacity.value = Math.pow(1 - t, 1.6);

    if (t >= 1) this.burstAt = -1;
  }

  protected onFrame(delta: number) {
    if (Math.abs(this.progress - this.targetProgress) > 0.00001) {
      this.progress = THREE.MathUtils.damp(this.progress, this.targetProgress, 6, delta);
      if (Math.abs(this.progress - this.targetProgress) < 0.0001) this.progress = this.targetProgress;
      this.apply();
    }
    this.time += delta;
    this.starMaterial.uniforms.uTime.value = this.time;
    // 구름은 아주 느리게 돈다. 빠르면 무엇이 도는지 보이고, 이만큼이면
    // 가만히 있지 않다는 것만 남는다.
    this.cloud.rotation.y += delta * 0.02;
    this.star.rotation.y += delta * 0.12;

    this.stepBurst(delta);

    // 잔해는 터진 자리에서 퍼져 나간다. 폭발이 끝나면 배수가 1 이라
    // 단계가 정한 반지름으로 자연스럽게 넘어간다 — 되돌아오지 않는다.
    const spread = this.burstAt >= 0 ? 0.25 + 0.75 * Math.pow(this.burstAt, 0.6) : 1;
    this.cloud.scale.setScalar(spread);

    // 카메라를 목표 거리로 끌어당긴다. 단계를 훌쩍 건너뛰어도 화면이
    // 튀지 않고 따라간다.
    const target = this.controls.target;
    this.offset.copy(this.camera.position).sub(target);
    const now = this.offset.length();
    if (this.autoFrame && Math.abs(now - this.wantDistance) > 0.001) {
      const next = Math.max(this.starSize * 1.4, THREE.MathUtils.damp(now, this.wantDistance, 5, delta));
      this.camera.position.copy(target).add(this.offset.setLength(next));
    }

    if (this.lensPass.enabled) {
      const lu = this.lensPass.uniforms;
      // 블랙홀은 원점에 있다. 궤도를 돌거나 화면을 밀면 중심이 옮겨 가므로
      // 매 프레임 다시 잡는다.
      this.scratch.set(0, 0, 0).project(this.camera);
      (lu.uCenter.value as THREE.Vector2).set(
        this.scratch.x * 0.5 + 0.5,
        this.scratch.y * 0.5 + 0.5,
      );
      lu.uAspect.value = this.camera.aspect;
      // 검은 원은 구체가 화면에서 차지하는 몫과 같다. UV 세로가 0~1 이라
      // 반화면이 0.5 다. 목표 거리가 아니라 **지금 거리**로 재야, 카메라가
      // 감쇠해 들어오는 동안에도 원과 구체가 겹쳐 있다.
      lu.uRadius.value = 0.5 * (this.starSize / Math.max(now, 1e-3)) / TAN_HALF_FOV;
    }
  }

  protected resize() {
    super.resize();
    // 알갱이 크기는 픽셀로 정해진다. 화면이 바뀌면 기준도 바뀌어야
    // 큰 화면에서 모래알이 되지 않는다.
    // base 의 생성자도 이것을 부른다. 그때는 아직 구름이 없다.
    if (!this.cloudMaterial) return;
    this.renderer.getDrawingBufferSize(this.bufferSize);
    this.cloudMaterial.uniforms.uHeight.value = this.bufferSize.y / 2;
    this.apply();
    this.autoFrame = true;
    if (!this.motion) this.snapDistance();
  }

  dispose() {
    // 셰이더 재질이 유니폼 안에 쥔 텍스처는 base 의 훑기에 걸리지 않는다.
    // 그것은 재질의 필드만 보고, 이 텍스처는 `uniforms.uMap.value` 에 있다.
    this.cloudTexture.dispose();
    this.controls.removeEventListener("start", this.onExplore);
    super.dispose();
  }
}
