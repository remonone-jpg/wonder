import * as THREE from "three";
import { ViewerBase } from "./viewer-base";
import { STAR_STAGES, stageAt } from "./star-stages";

/**
 * 별 하나가 일생을 지나가는 무대.
 *
 * 천체를 여럿 놓고 고르게 하는 태양계 무대와 달리, 여기에는 **구체가
 * 하나뿐**이고 그것이 단계마다 크기와 색과 밝기를 바꾼다. 별의 일생은
 * 여러 개를 늘어놓고 비교하는 일이 아니라 하나가 변해 가는 일이라,
 * 같은 구체가 계속 남아 있는 것이 그 자체로 설명이 된다.
 *
 * 사진으로는 할 수 없는 것을 하려고 만든 무대다. 적색거성이 주계열성보다
 * 훨씬 크다는 것은 글로 읽는 것과 손으로 끌어 보는 것이 다르다.
 *
 * 단계 값 자체는 `star-stages.ts` 에 있다. 화면도 그 이름을 읽어야 하는데,
 * 이 파일에 두면 화면이 three.js 를 통째로 끌고 오기 때문이다.
 */

/** 뷰어의 세로 화각 절반의 탄젠트. `ViewerBase` 기본값 fov 38° 를 따른다. */
const TAN_HALF_FOV = Math.tan(THREE.MathUtils.degToRad(38) / 2);

/** 가장 큰 단계. 화면을 채우는 기준이 된다. */
const BIGGEST = Math.max(...STAR_STAGES.map((s) => s.size));

/** 가장 큰 단계가 세로 화면에서 차지할 몫. 1 이면 위아래가 잘린다. */
const FILL = 0.85;

/**
 * 카메라가 크기를 따라가는 정도. 0 이면 카메라가 고정이라 겉보기 크기가
 * 반지름에 정비례하고, 1 이면 정비례로 물러나 겉보기 크기가 늘 같다.
 *
 * 처음에 1 로 두었다가(`radius * 4.2`) 화면에서 재 보고 고쳤다. 주계열성이
 * 728px, 적색거성이 442px 로 **거성이 더 작게** 보였다. 크기를 보여 주려고
 * 만든 무대가 크기를 지우고 있었던 것이다.
 *
 * 0.15 는 겉보기 크기를 반지름의 0.85 제곱으로 자라게 한다 — 적색거성이
 * 주계열성의 12배가 아니라 8배쯤으로 보인다. 곧이곧대로 12배를 하려면
 * 카메라를 완전히 고정해야 하는데, 그러면 백색왜성이 한 픽셀이 되어
 * 사라진다. 8배는 둘을 한 화면에서 다 볼 수 있는 가장 큰 차이다.
 */
const PULL = 0.15;

export class StarViewer extends ViewerBase {
  private star: THREE.Mesh;
  private material: THREE.MeshStandardMaterial;
  private colorFrom = new THREE.Color();
  private colorTo = new THREE.Color();
  /** 카메라가 따라가야 할 거리. 크기가 바뀌면 여기가 먼저 움직인다. */
  private wantDistance = 6;

  /**
   * `at` 은 무대를 열면서 바로 설 자리다. 만들고 나서 `setProgress` 를
   * 부르는 것과 다르다 — 그러면 카메라가 성운 자리에서 감쇠해 들어와,
   * 층을 오갈 때마다 슬라이더를 놔둔 자리로 줌인하는 장면이 보인다.
   */
  constructor(container: HTMLElement, at = 0) {
    super(container, {
      cameraAt: [0, 8, 28],
      minDistance: 4,
      maxDistance: 120,
      // 태양계 무대보다 좁고 높게 잡은 발광. 기본값(0.5/0.72)으로 두었더니
      // 주계열성의 64px 구체 둘레로 205px 짜리 후광이 퍼져, 552px 인
      // 적색거성과의 차이가 눈으로는 세 배쯤으로 줄었다. 크기를 보여 주는
      // 무대에서 빛 번짐이 크기를 덮으면 안 된다. 대신 백색왜성은 발광이
      // 2.4 라 이 문턱도 가뿐히 넘어, 여전히 후광을 단 밝은 점으로 남는다.
      bloom: { strength: 0.7, radius: 0.25, threshold: 1.15 },
      ariaLabel: "3D star life",
    });

    // 별은 스스로 빛나므로 조명이 거의 필요 없다. 약한 환경광만 두어
    // 발광이 가장 낮은 성운 단계에서도 형체가 남게 한다.
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.15));

    this.material = new THREE.MeshStandardMaterial({
      color: STAR_STAGES[0].color,
      emissive: STAR_STAGES[0].color,
      emissiveIntensity: STAR_STAGES[0].glow,
      roughness: 1,
      metalness: 0,
    });
    this.star = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), this.material);
    this.scene.add(this.star);

    this.setProgress(at);
    this.snapDistance();
    this.start();
  }

  /**
   * 0~1 한 값이 다섯 단계를 지나간다.
   *
   * 단계 사이를 잇는 것이 요점이다. 뚝뚝 끊어 보여 주면 다섯 장의 그림이
   * 되지만, 이어서 보여 주면 하나가 변해 가는 일이 된다.
   */
  setProgress(progress: number) {
    const { index, fraction } = stageAt(progress);
    const a = STAR_STAGES[index];
    const b = STAR_STAGES[index + 1];

    // 크기는 로그로 잇는다. 0.12 에서 12 까지 백 배 범위라, 선형으로 이으면
    // 작은 쪽 변화가 통째로 뭉개진다.
    const radius = Math.exp(THREE.MathUtils.lerp(Math.log(a.size), Math.log(b.size), fraction));
    this.star.scale.setScalar(radius);

    this.colorFrom.set(a.color);
    this.colorTo.set(b.color);
    this.material.color.copy(this.colorFrom).lerp(this.colorTo, fraction);
    this.material.emissive.copy(this.material.color);
    this.material.emissiveIntensity = THREE.MathUtils.lerp(a.glow, b.glow, fraction);

    // 가장 큰 단계를 화면에 꼭 맞추는 거리에서 출발해, 작아질수록 `PULL`
    // 만큼만 다가간다. 적색거성은 화면을 뚫지 않고, 백색왜성은 점이 되지
    // 않으며, 그러면서도 둘의 크기 차이가 남는다.
    const fitBiggest = BIGGEST / (FILL * TAN_HALF_FOV);
    this.wantDistance = fitBiggest * Math.pow(radius / BIGGEST, PULL);
  }

  /** 거리를 감쇠 없이 지금 맞춘다. 무대가 열릴 때 줌아웃이 보이지 않게. */
  private snapDistance() {
    const target = this.controls.target;
    const offset = this.camera.position.clone().sub(target);
    this.camera.position.copy(target).add(offset.setLength(this.wantDistance));
  }

  protected onFrame(delta: number) {
    this.star.rotation.y += delta * 0.12;

    // 카메라를 목표 거리로 끌어당긴다. 단계를 훌쩍 건너뛰어도 화면이
    // 튀지 않고 따라간다.
    const target = this.controls.target;
    const offset = this.camera.position.clone().sub(target);
    const now = offset.length();
    if (Math.abs(now - this.wantDistance) > 0.001) {
      const next = THREE.MathUtils.damp(now, this.wantDistance, 3.5, delta);
      this.camera.position.copy(target).add(offset.setLength(next));
    }
  }
}
