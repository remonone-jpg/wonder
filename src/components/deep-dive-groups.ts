import type { CosmosCategory, DeepDiveCategory } from "../data/types";

/**
 * 심화 패널이 쓰는 두 벌의 표 — 어떤 묶음으로 나눌지와, 각 편 앞에 붙는
 * 칩을 뭐라 부를지.
 *
 * 컴포넌트 파일이 아니라 여기 있는 이유는 Fast Refresh 다. 컴포넌트와 상수를
 * 한 파일에서 함께 export 하면 상수 한 글자를 고쳐도 모듈 전체가 다시
 * 평가되어 열어 둔 아코디언이 닫힌다. 린터가 잡아 주는 규칙이기도 하다.
 *
 * 층이 셋이 되면 여기에 세 번째 벌이 붙는다. 컴포넌트는 안 바뀐다.
 */

/** 한 층의 심화를 어떤 묶음으로 나눌지. */
export type DeepDiveGroups<C> = { title: string; categories: C[] }[];

/**
 * Twenty headings in one column is a scroll, not a menu. Grouped, the panel
 * opens as four choices and the reader picks a direction first.
 *
 * The groups run outward: what the thing is, how it moves, whether anyone has
 * been, and what people have come to say about it. A body carrying fewer
 * categories simply shows fewer rows — and a group with nothing in it does not
 * appear at all.
 */
export const PLANET_GROUPS: DeepDiveGroups<DeepDiveCategory> = [
  { title: "무엇인가", categories: ["structure", "numbers", "weather", "atmosphere", "magnetism"] },
  { title: "어떻게 도나", categories: ["mechanism", "scale", "moons", "origin", "orbit"] },
  { title: "가 봤나요", categories: ["visit", "research", "see", "future", "livehere"] },
  { title: "사람들이 아는 것", categories: ["history", "etymology", "culture", "myths", "art"] },
];

/**
 * 태양계 밖의 묶음. 행성의 넷과 이름도 순서도 다르다.
 *
 * 행성은 "무엇인가 → 어떻게 도나 → 가 봤나요 → 사람들이 아는 것"으로
 * 나가지만, 별이나 은하에는 가 본 적이 없고 도는 것이 요점도 아니다.
 * 대신 태어나 죽는 과정이 한 묶음을 통째로 차지하고, "어떻게 알았나"가
 * 가 본 이야기의 자리를 대신한다.
 */
export const COSMOS_GROUPS: DeepDiveGroups<CosmosCategory> = [
  { title: "무엇인가", categories: ["whatis", "size", "inside", "light"] },
  { title: "어떻게 되나", categories: ["birth", "life", "death", "change"] },
  { title: "어떻게 알았나", categories: ["discover", "observe", "unknown"] },
  { title: "우리와의 관계", categories: ["ushere", "imagine", "scale"] },
];

/** The chip in front of each heading — what angle this entry takes. */
export const PLANET_META: Record<DeepDiveCategory, string> = {
  structure: "구조",
  numbers: "숫자로 보면",
  weather: "날씨",
  atmosphere: "대기와 하늘",
  magnetism: "보이지 않는 껍질",
  mechanism: "작동 원리",
  scale: "얼마나 먼가",
  moons: "달들",
  origin: "태어난 이야기",
  orbit: "궤도와 이웃",
  visit: "가 본 것들",
  research: "지금 연구 중",
  see: "찾아보기",
  future: "앞으로의 계획",
  livehere: "사람이 산다면",
  history: "발견의 역사",
  etymology: "이름의 유래",
  culture: "말 속의 흔적",
  myths: "오해와 진실",
  art: "이야기 속에서",
};

/** 태양계 밖의 칩. 행성 것과 겹치는 이름(`scale`)도 뜻이 달라 따로 적는다. */
export const COSMOS_META: Record<CosmosCategory, string> = {
  whatis: "정체",
  size: "크기와 거리",
  inside: "속",
  light: "빛",
  birth: "태어남",
  life: "살아가는 동안",
  death: "끝",
  change: "시간이 지나면",
  discover: "어떻게 알았나",
  observe: "무엇으로 보나",
  unknown: "아직 모르는 것",
  ushere: "우리와 무슨 상관",
  imagine: "상상 속에서",
  scale: "얼마나 큰지",
};
