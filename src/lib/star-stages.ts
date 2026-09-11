/**
 * 별의 일생 — 단계 값과 갈림길.
 *
 * 뷰어가 아니라 여기 있는 이유는 코드 분할이다. `star-viewer.ts` 는
 * three.js 를 끌고 오는 무거운 모듈이라 동적으로만 불러야 하는데, 화면이
 * 단계 이름을 그리려고 그 파일에서 상수를 정적으로 가져가는 순간 번들러가
 * 분할을 포기한다 — 실제로 그렇게 했더니 메인 번들이 291 KB 에서 866 KB 로
 * 뛰었다. 그래서 이 파일은 three.js 를 쓰지 않는다.
 */

/** 주계열성 다음에 갈리는 두 길. 무엇이 갈랐느냐면 태어날 때의 무게다. */
export type StarPath = "light" | "heavy";

export type StarStage = {
  name: string;
  note: string;
  /** 구체의 반지름. 장면 단위. */
  size: number;
  /** 구체의 색. 표면 셰이더가 이 색을 밝기로 곱해 쓴다. */
  color: string;
  /** 스스로 내는 빛의 세기. */
  glow: number;
  /**
   * 카메라가 화면에 맞출 크기. 대개 `size` 와 같지만 다를 때가 있다 —
   * 성운은 구체가 거의 없고 구름이 본체이고, 초신성은 잔해가 날아가는
   * 폭을 조금 보여 줘야 한다. 없으면 `size` 를 쓴다.
   */
  frame?: number;
  /** 파티클 구름의 진하기. 0 이면 구름이 없다. */
  cloud: number;
  /** 구름이 퍼진 반지름. */
  cloudRadius: number;
  cloudColor: string;
  /** 0 이면 구름이 퍼져 있고, 1 이면 중심으로 빨려들어 사라진다. */
  collapse: number;
  /** 0 이면 속이 찬 뭉치, 1 이면 속이 빈 껍질. */
  shell: number;
  /** 중력렌즈 세기. 블랙홀만 0 이 아니다. */
  lens: number;
  /** 이 단계에 들어서면 한 번 터진다. */
  burst?: true;
};

/** 두 길이 함께 쓰는 앞부분. */
const TRUNK: StarStage[] = [
  {
    name: "성운", note: "먼지구름",
    // 구체는 거의 없다. 여기서 보이는 것은 전부 파티클 구름이고, 구체는
    // 그 속에서 원시별로 자라날 씨앗으로만 남아 있다.
    size: 0.05, color: "#8a6bb0", glow: 0, frame: 18,
    cloud: 1, cloudRadius: 18, cloudColor: "#9a7ad0", collapse: 0, shell: 0, lens: 0,
  },
  {
    name: "원시별", note: "뭉치는 중",
    size: 0.6, color: "#ffb060", glow: 0.8, frame: 4,
    cloud: 0.3, cloudRadius: 5, cloudColor: "#b08ad0", collapse: 1, shell: 0, lens: 0,
  },
  {
    name: "주계열성", note: "지금의 태양",
    size: 1, color: "#fff4d0", glow: 1.2,
    cloud: 0, cloudRadius: 4, cloudColor: "#b08ad0", collapse: 1, shell: 0, lens: 0,
  },
];

/** 태양만 한 별이 가는 길. 조용히 껍질을 벗고 식어 간다. */
const LIGHT: StarStage[] = [
  {
    name: "적색거성", note: "100배로 부푼다",
    size: 12, color: "#ff6b3d", glow: 1.6,
    cloud: 0, cloudRadius: 4, cloudColor: "#ffb080", collapse: 1, shell: 0, lens: 0,
  },
  {
    // `frame` 을 `cloudRadius` 와 같이 둔다. 카메라가 구체가 아니라 껍질에
    // 맞춰야 하는 단계라서다 — 구체(0.9)에 맞추면 카메라가 껍질 **안쪽**에
    // 들어가 화면이 통째로 알갱이로 덮인다. 실제로 그렇게 두고 찍어 보고
    // 알았다.
    name: "행성상성운", note: "껍질을 벗는다",
    size: 0.9, color: "#dff2ff", glow: 2.2, frame: 14,
    cloud: 0.85, cloudRadius: 14, cloudColor: "#6ee0c8", collapse: 0, shell: 1, lens: 0,
  },
  {
    name: "백색왜성", note: "지구만 한 크기",
    size: 0.12, color: "#cfe4ff", glow: 2.4,
    cloud: 0, cloudRadius: 30, cloudColor: "#6ee0c8", collapse: 0, shell: 1, lens: 0,
  },
];

/** 태양보다 여덟 배 넘게 무거운 별이 가는 길. 터지고 뭉개진다. */
const HEAVY: StarStage[] = [
  {
    name: "초거성", note: "태양의 1000배",
    size: 22, color: "#ff8a5c", glow: 1.5,
    cloud: 0, cloudRadius: 4, cloudColor: "#ffb080", collapse: 1, shell: 0, lens: 0,
  },
  {
    name: "초신성", note: "한 달 동안 은하보다 밝다",
    size: 0.9, color: "#ffffff", glow: 7, frame: 16, burst: true,
    cloud: 1, cloudRadius: 16, cloudColor: "#ffd9a0", collapse: 0, shell: 1, lens: 0,
  },
  {
    // 카메라가 중성자별에 바싹 붙으므로 잔해 껍질은 이미 카메라 바깥이다.
    // 그래서 진하기를 거의 0 으로 떨어뜨린다 — 안쪽에서 올려다보는 옅은
    // 잔광만 남고, 화면이 알갱이로 덮이지 않는다.
    name: "중성자별", note: "각설탕 하나가 산만큼",
    size: 0.06, color: "#e8f4ff", glow: 3.2, frame: 0.08,
    cloud: 0.1, cloudRadius: 30, cloudColor: "#ff9a70", collapse: 0, shell: 1, lens: 0,
  },
  {
    name: "블랙홀", note: "빛도 못 빠져나온다",
    // 중성자별보다 스무 배 넘게 크게 그렸다. 실제 사건의 지평선은
    // 중성자별과 비슷한 크기지만, 눈에 보이는 검은 원 — 블랙홀 그림자 — 은
    // 지평선 지름의 5.2배이고 그 둘레로 빛이 휘어 고리가 선다. 작게 그리면
    // 휘는 것이 아예 안 보여 이 단계의 요점이 사라진다.
    // 잔해를 0 으로 지운다. 이 단계의 요점은 **배경이 휘는 것**인데,
    // 알갱이가 앞에 떠 있으면 휜 것이 무엇인지 알아볼 수가 없다.
    size: 2.6, color: "#000000", glow: 0,
    cloud: 0, cloudRadius: 40, cloudColor: "#ff8060", collapse: 0, shell: 1, lens: 1,
  },
];

/** 갈림길이 서는 자리. 이 단계에 닿으면 화면에 두 버튼이 뜬다. */
export const FORK_AT = TRUNK.length - 1;

/**
 * 지금 지나갈 단계들.
 *
 * 길을 고르기 전에는 앞부분만 돈다. 슬라이더가 주계열성에서 끝나고,
 * 길을 고르면 그만큼 늘어난다 — 손잡이 자체가 "여기서 갈린다"를 말한다.
 */
export function starStages(path: StarPath | null): StarStage[] {
  if (path === "light") return [...TRUNK, ...LIGHT];
  if (path === "heavy") return [...TRUNK, ...HEAVY];
  return TRUNK;
}

/** 가장 긴 길에서 가장 크게 보이는 단계. 카메라 거리의 기준이 된다. */
export const BIGGEST_FRAME = Math.max(
  ...[...TRUNK, ...LIGHT, ...HEAVY].map((s) => s.frame ?? s.size),
);

/** 0~1 을 단계 사이의 자리로 옮긴다. */
export function stageAt(progress: number, stages: StarStage[]) {
  const clamped = Math.min(1, Math.max(0, progress));
  const pos = clamped * (stages.length - 1);
  const index = Math.min(Math.floor(pos), stages.length - 2);
  return { index, fraction: pos - index, nearest: stages[Math.round(pos)] };
}

/** 단계 번호를 슬라이더 값으로. 길이 바뀌면 칸 수가 바뀌므로 매번 다시 센다. */
export function progressOf(index: number, stages: StarStage[]) {
  const i = Math.min(Math.max(index, 0), stages.length - 1);
  return i / (stages.length - 1);
}
