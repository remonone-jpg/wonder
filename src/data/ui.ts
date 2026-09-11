/**
 * Every string the interface itself says — headings, buttons, the labels around
 * the figures. The prose about the bodies lives in `copy.ts`; these are the
 * words the app uses to talk about itself.
 */

export const ui = {
  title: "우주 구경하기",
  tagline: "별을 만지고, 우주를 이해하는 시간",
  tabBasic: "기본",
  tabDeep: "더 깊이",
  scaleNice: "보기 좋게",
  scaleTrue: "진짜 크기",
  scaleHint: "진짜 크기로 하면 행성이 아주 작아져요. 우주가 그만큼 넓거든요.",
  lookUpTitle: "찾아봐요",
  facts: { size: "크기는요", day: "하루는", year: "일 년은", moons: "달이" },
  didYouKnow: "신기해요! ",
  moonsUnit: "개",
  noMoons: "없어요",
  credit: "행성 사진: NASA · Solar System Scope (CC BY 4.0)",
  hint: "행성을 눌러보세요",

  /** 층 전환. 1층은 3D 태양계, 2층은 사진으로 보는 태양계 밖. */
  layerSolar: "태양계",
  layerCosmos: "더 먼 곳",
  /** 왼쪽 목록의 제목. 무엇을 고르는 자리인지 층마다 다르다. */
  listSolar: "행성을 눌러보세요",
  listCosmos: "무엇을 볼까요",
  /** 그림이 아직 없는 항목의 무대에 뜨는 안내. */
  cosmosNoImage: "그림은 아래 '더 깊이'에 있어요",
};
