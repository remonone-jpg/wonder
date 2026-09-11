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
export type StarRemnant = "neutron" | "blackhole";

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
    name: "성운", note: "별이 태어나는 구름",
    // 구체는 거의 없다. 여기서 보이는 것은 전부 파티클 구름이고, 구체는
    // 그 속에서 원시별로 자라날 씨앗으로만 남아 있다.
    size: 0.05, color: "#8a6bb0", glow: 0, frame: 18,
    cloud: 1, cloudRadius: 18, cloudColor: "#ffffff", collapse: 0, shell: 0, lens: 0,
  },
  {
    name: "원시별", note: "중력이 모으는 빛",
    size: 0.6, color: "#ffb060", glow: 0.8, frame: 4,
    cloud: 0.4, cloudRadius: 5, cloudColor: "#edb9ad", collapse: 0.72, shell: 0, lens: 0,
  },
  {
    name: "주계열성", note: "스스로 빛나는 시간",
    size: 1, color: "#fff4d0", glow: 1.2, frame: 2.6,
    cloud: 0, cloudRadius: 4, cloudColor: "#b08ad0", collapse: 1, shell: 0, lens: 0,
  },
];

/** 태양만 한 별이 가는 길. 조용히 껍질을 벗고 식어 간다. */
const LIGHT: StarStage[] = [
  {
    name: "적색거성", note: "중심은 줄고, 바깥은 부풀고",
    size: 12, color: "#ff6b3d", glow: 1.6,
    cloud: 0, cloudRadius: 4, cloudColor: "#ffb080", collapse: 1, shell: 0, lens: 0,
  },
  {
    // `frame` 을 `cloudRadius` 와 같이 둔다. 카메라가 구체가 아니라 껍질에
    // 맞춰야 하는 단계라서다 — 구체(0.9)에 맞추면 카메라가 껍질 **안쪽**에
    // 들어가 화면이 통째로 알갱이로 덮인다. 실제로 그렇게 두고 찍어 보고
    // 알았다.
    name: "행성상성운", note: "우주로 돌아가는 겉껍질",
    size: 0.9, color: "#dff2ff", glow: 2.2, frame: 14,
    cloud: 0.85, cloudRadius: 14, cloudColor: "#6ee0c8", collapse: 0, shell: 1, lens: 0,
  },
  {
    name: "백색왜성", note: "지구만 한 크기",
    size: 0.12, color: "#cfe4ff", glow: 1.8, frame: 0.5,
    cloud: 0, cloudRadius: 30, cloudColor: "#6ee0c8", collapse: 0, shell: 1, lens: 0,
  },
];

/** 태양보다 여덟 배 넘게 무거운 별이 가는 길. 터지고 뭉개진다. */
const HEAVY: StarStage[] = [
  {
    name: "초거성", note: "별 속에 쌓이는 여러 층",
    size: 22, color: "#ff8a5c", glow: 1.5,
    cloud: 0, cloudRadius: 4, cloudColor: "#ffb080", collapse: 1, shell: 0, lens: 0,
  },
  {
    name: "초신성", note: "무너진 중심, 퍼져 나가는 물질",
    size: 0.9, color: "#ffffff", glow: 7, frame: 16, burst: true,
    cloud: 1, cloudRadius: 16, cloudColor: "#ffd9a0", collapse: 0, shell: 1, lens: 0,
  },
];

/** 서로 다른 결말이다. 중성자별 다음에 블랙홀이 되는 시간 순서가 아니다. */
const REMNANTS: Record<StarRemnant, StarStage> = {
  neutron: {
    // 중심 잔해를 확대하는 단계에서는 훨씬 바깥의 성운을 생략한다.
    name: "중성자별", note: "도시만 한 별의 중심",
    size: 0.06, color: "#e8f4ff", glow: 1.8, frame: 0.26,
    cloud: 0, cloudRadius: 30, cloudColor: "#ff9a70", collapse: 0, shell: 1, lens: 0,
  },
  blackhole: {
    name: "블랙홀", note: "빛도 못 빠져나온다",
    // 장면 단위이며 실제 크기 비율이 아니다. 비회전 블랙홀의 그림자 지름은
    // 지평선 지름의 약 2.6배(지평선 반지름의 약 5.2배)다.
    // 잔해를 0 으로 지운다. 이 단계의 요점은 **배경이 휘는 것**인데,
    // 알갱이가 앞에 떠 있으면 휜 것이 무엇인지 알아볼 수가 없다.
    size: 2.6, color: "#000000", glow: 0, frame: 5.8,
    cloud: 0, cloudRadius: 40, cloudColor: "#ff8060", collapse: 0, shell: 1, lens: 1,
  },
};

/** 갈림길이 서는 자리. 이 단계에 닿으면 화면에 두 버튼이 뜬다. */
export const FORK_AT = TRUNK.length - 1;

/**
 * 지금 지나갈 단계들.
 *
 * 길을 고르기 전에는 앞부분만 돈다. 슬라이더가 주계열성에서 끝나고,
 * 길을 고르면 그만큼 늘어난다 — 손잡이 자체가 "여기서 갈린다"를 말한다.
 */
export function starStages(path: StarPath | null, remnant: StarRemnant = "neutron"): StarStage[] {
  if (path === "light") return [...TRUNK, ...LIGHT];
  if (path === "heavy") return [...TRUNK, ...HEAVY, REMNANTS[remnant]];
  return TRUNK;
}

/** 가장 긴 길에서 가장 크게 보이는 단계. 카메라 거리의 기준이 된다. */
export const BIGGEST_FRAME = Math.max(
  ...[...TRUNK, ...LIGHT, ...HEAVY, ...Object.values(REMNANTS)].map((s) => s.frame ?? s.size),
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
