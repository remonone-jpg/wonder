/**
 * 은하 파티클 무대의 가벼운 데이터 층.
 *
 * 이 파일에는 three.js가 없다. 목록과 설명을 읽는 동안에도 무거운 WebGL
 * 모듈이 메인 번들에 섞이지 않게 하고, `galaxy-viewer.ts`가 선택된 모델만
 * 동적으로 그린다.
 */
import type { GalaxyId } from "../data/types";

export type GalaxyShape = "spiral" | "irregular" | "elliptical";

export type GalaxyView = {
  id: "wide" | "structure" | "core" | "light";
  name: string;
  note: string;
  easy: string;
  detail: string;
  observe: string;
};

export type GalaxyModel = {
  id: GalaxyId;
  name: string;
  type: string;
  shape: GalaxyShape;
  distance: string;
  color: string;
  accent: string;
  arms: number;
  thickness: number;
  bulge: number;
  dust: number;
  clusters: number;
  jet: boolean;
  easy: string;
  detail: string;
  observe: string;
  views: readonly GalaxyView[];
};

const COMMON_VIEWS: Record<GalaxyView["id"], Omit<GalaxyView, "id">> = {
  wide: { name: "전체 모습", note: "별들이 만든 윤곽", easy: "은하마다 별이 모인 모양이 달라요.", detail: "은하는 별·가스·먼지와 암흑물질이 중력으로 묶인 계입니다. 드래그해서 입체적인 분포를 살펴보세요.", observe: "중심과 가장자리의 밝기를 비교해 보세요." },
  structure: { name: "옆에서 보기", note: "납작한가요, 둥근가요?", easy: "같은 은하라도 옆에서 보면 모양이 달라져요.", detail: "얇은 원반과 두꺼운 중심부를 구별해 보세요. 별들이 도는 길이 질서 있게 정렬된 원반은 옆에서 보면 가느다란 띠처럼 보입니다. 타원은하에서는 별의 궤도가 여러 방향으로 섞여 있어 둥근 분포가 남습니다.", observe: "시점을 바꾸며 원반의 두께를 찾아보세요." },
  core: { name: "중심 가까이", note: "별이 빽빽해지는 곳", easy: "가운데 밝은 빛은 아주 많은 별이 모여 보이는 거예요.", detail: "확대되는 것은 은하의 중심 영역입니다. 별의 밀도가 높아져 빛이 겹쳐 보입니다. 이 은하 전체 모형에서는 블랙홀의 사건지평선이나 그림자를 구별할 수 없습니다. 블랙홀이 은하의 모든 별을 끌어당기는 유일한 주인도 아닙니다. 바깥 별의 운동에는 은하 전체에 퍼진 질량이 중요합니다.", observe: "밝은 중심을 별 하나로 오해하지 마세요." },
  light: { name: "별 탄생의 흔적", note: "관찰할 무리만 남겨요", easy: "오래된 별빛을 줄이면 푸른 별 무리와 분홍빛 가스가 잘 보여요.", detail: "이 장면은 모형의 오래된 별 무리를 어둡게 하고, 젊은 별 무리와 가스 영역을 강조한 분류 지도입니다. 실제 망원경의 적외선이나 전파 사진은 아닙니다. 푸른 무거운 별은 수명이 짧기 때문에 이런 별이 모인 곳은 비교적 최근 별 탄생의 단서가 됩니다. 오래된 별도 같은 영역에 섞여 있을 수 있습니다.", observe: "어느 영역이 남고 어느 영역이 어두워졌나요?" },
};

const withViews = (extra?: Partial<Record<GalaxyView["id"], Partial<GalaxyView>>>): GalaxyView[] =>
  (Object.keys(COMMON_VIEWS) as GalaxyView["id"][]).map((id) => ({
    id,
    ...COMMON_VIEWS[id],
    ...extra?.[id],
  }));

export const galaxyModels: readonly GalaxyModel[] = [
  {
    id: "milky-way",
    name: "우리 은하",
    type: "막대나선은하",
    shape: "spiral",
    distance: "우리가 그 안에 있어요",
    color: "#9eb9ff",
    accent: "#ffd18d",
    arms: 4,
    thickness: 0.38,
    bulge: 1.5,
    dust: 0.68,
    clusters: 7,
    jet: false,
    easy: "우리는 우리 은하의 한 나선팔, 오리온자리 팔에 있는 작은 태양계에 살아요.",
    detail:
      "우리 은하는 약 10만 광년 너비의 막대나선은하로, 태양은 중심에서 꽤 떨어진 나선팔의 한 부분에 있습니다. 우리는 은하 바깥에서 사진을 찍을 수 없기 때문에, 하늘을 가로지르는 은하수의 띠와 별의 거리·운동을 합쳐 전체 구조를 추정합니다. 중심에는 궁수자리 A*라는 초대질량 블랙홀이 있지만, 우리가 사는 곳의 밤하늘은 중심에서 멀리 떨어져 있어 비교적 조용합니다. 화면은 실제 위에서 내려다본 사진이 아니라, 안에서 살고 있는 관측자가 자료를 모아 재구성한 지도입니다.",
    observe: "한 팔 위의 작은 표시를 찾아보세요. 그 점이 태양계의 위치입니다.",
    views: withViews({
      wide: { note: "우리의 주소가 들어 있는 은하를 한눈에 봐요" },
      core: { note: "중심의 궁수자리 A*까지 거리를 느껴봐요" },
    }),
  },
  {
    id: "andromeda",
    name: "안드로메다 은하",
    type: "나선은하",
    shape: "spiral",
    distance: "약 250만 광년",
    color: "#f2bf9b",
    accent: "#8fb8ff",
    arms: 3,
    thickness: 0.44,
    bulge: 1.9,
    dust: 0.82,
    clusters: 9,
    jet: false,
    easy: "안드로메다는 우리 은하에서 가장 가까운 큰 이웃 은하예요. 우리가 보는 빛은 250만 년 전 출발했어요.",
    detail:
      "안드로메다 은하, M31은 우리 은하에서 약 250만 광년 떨어진 가장 가까운 주요 은하입니다. 사진에서는 타원처럼 보일 때도 있지만, 실제로는 원반과 나선 구조를 가진 은하가 기울어져 보이는 것입니다. 먼지 띠와 위성은하의 흔적은 이 은하가 과거에 작은 은하들과 상호작용했음을 알려 줍니다. 우리 은하와의 미래 만남은 오랫동안 약 40억 년 뒤 충돌로 소개됐지만, 2025년의 새 분석은 장기 궤도와 측정 오차 때문에 결과가 확정적이지 않다고 봅니다. 여기서는 ‘다가오는 이웃’으로 설명하고, 충돌은 가능성이 있는 시나리오로 남겨 둡니다.",
    observe: "붉은 중심과 푸른 바깥팔, 그리고 팔을 가로지르는 어두운 먼지 띠를 찾아보세요.",
    views: withViews({
      wide: { note: "250만 년 전의 이웃을 지금의 하늘에서 봐요" },
      light: { note: "적외선에서 더 선명해지는 먼지 고리를 상상해 봐요" },
    }),
  },
  {
    id: "large-magellanic-cloud",
    name: "대마젤란운",
    type: "불규칙 왜소은하",
    shape: "irregular",
    distance: "약 16만 광년",
    color: "#8ed9e3",
    accent: "#ff9e78",
    arms: 0,
    thickness: 0.85,
    bulge: 0.85,
    dust: 0.48,
    clusters: 12,
    jet: false,
    easy: "작고 모양이 가지런하지 않지만 별이 활발히 태어나는 우리 은하의 이웃이에요.",
    detail:
      "대마젤란운은 우리 은하를 도는 불규칙 왜소은하로, 약 16만 광년 떨어져 있습니다. 나선팔처럼 정돈된 모양은 없지만 가스가 풍부해 별 탄생 영역과 초신성 잔해를 연구하기 좋습니다. 남쪽 하늘에서는 어두운 곳에서 맨눈으로도 희미한 얼룩처럼 보일 수 있어요. 작은 은하라는 말은 별이 몇 개 없다는 뜻이 아니라, 큰 나선은하보다 질량과 구조가 작다는 뜻입니다. 우리 은하의 중력이 모양과 가스 흐름을 바꾸고 있어 위성은하가 어떻게 자라는지 살펴볼 수 있는 가까운 실험실입니다.",
    observe: "정돈된 팔 대신 밝은 별 탄생 덩어리들이 흩어져 있는 모습을 찾아보세요.",
    views: withViews({
      wide: { note: "작은 이웃 은하가 남쪽 하늘에 남긴 얼룩을 봐요" },
      structure: { note: "왜소은하의 흐트러진 구조를 살펴봐요" },
    }),
  },
  {
    id: "m87",
    name: "M87",
    type: "거대 타원은하",
    shape: "elliptical",
    distance: "약 5,500만 광년",
    color: "#e9c98f",
    accent: "#7fc7ff",
    arms: 0,
    thickness: 1.25,
    bulge: 2.4,
    dust: 0.18,
    clusters: 6,
    jet: true,
    easy: "M87은 둥근 거대 은하예요. 가운데 블랙홀 주변에서 아주 긴 제트가 뻗어요.",
    detail:
      "M87은 처녀자리 은하단 안에 있는 거대 타원은하입니다. 나선팔 대신 오래된 별들이 둥근 덩어리를 이루고, 중심의 초대질량 블랙홀은 주변의 뜨거운 물질과 자기장에 의해 밝은 제트를 만들 수 있습니다. 2019년 사건지평선망원경은 M87 중심 블랙홀 주변의 그림자를 처음으로 영상화했습니다. 사진 한 장에서 블랙홀 자체를 본 것이 아니라, 빛나는 뜨거운 가스와 그 안의 어두운 그림자 윤곽을 전파망원경 여러 대로 합성한 것입니다. 무대의 푸른 제트는 실제 길이와 밝기 비율을 줄인 교육용 표현입니다.",
    observe: "둥근 별 구름에서 한 방향으로 길게 뻗는 제트를 찾아보세요.",
    views: withViews({
      core: { note: "블랙홀 그림자가 남긴 중심의 빈틈을 봐요" },
      light: { note: "전파와 X선에서 더 강하게 드러나는 제트를 생각해 봐요" },
    }),
  },
];

// The descriptions must describe the selected object and the action on screen.
for (const model of galaxyModels) {
  model.views = withViews({
    wide: { easy: model.easy, detail: model.detail, observe: model.observe },
    ...(model.shape === "irregular" ? {
      structure: { note: "비대칭 원반과 막대", easy: "반듯한 나선팔은 없지만 길쭉한 별의 막대가 보여요.", detail: "대마젤란운은 불규칙한 외곽과 중심에서 어긋난 막대 구조를 갖습니다. 아무 질서도 없는 구름이라는 뜻은 아니에요. 이 모형에서는 막대와 비대칭 별 탄생 영역을 단순화했으며, 개별 영역의 정확한 위치나 은하의 실제 기울기를 재현한 것은 아닙니다.", observe: "완벽한 공이나 고리와 다른 윤곽을 보세요." },
      core: { note: "중심에서 어긋난 막대", easy: "가운데에는 길쭉하게 모인 별들이 있어요.", detail: "대마젤란운의 막대는 바깥 원반의 중심과 정확히 겹치지 않습니다. 이웃 은하와의 상호작용과 내부 운동이 구조에 흔적을 남깁니다. 이 장면의 밝은 중심은 별의 분포를 그린 것이며, 블랙홀의 관측 증거를 나타내지 않습니다.", observe: "밝은 부분이 전체 윤곽의 한가운데에 있나요?" },
    } : {}),
    ...(model.jet ? {
      structure: { note: "팔이 없는 입체적인 별 구름", easy: "옆으로 돌려도 얇은 띠가 되지 않아요.", observe: "우리 은하의 얇은 원반과 비교해 보세요." },
      core: { note: "블랙홀 주변 물질의 제트", observe: "중심에서 뻗는 푸른 줄기를 찾아보세요." },
      light: { name: "제트의 흔적", note: "별빛 뒤에 숨은 활동", easy: "별빛을 줄이면 중심에서 뻗는 제트가 잘 보여요.", detail: "M87에서는 오래된 별빛을 줄이고 제트를 강조합니다. 제트는 사건지평선 안에서 탈출한 물질이 아니라, 블랙홀 주변의 물질과 자기장에 관계된 흐름입니다. 실제 제트는 전파·가시광선·X선으로 연구하며, 이 푸른 선은 그 방향을 단순화한 도해입니다. 관측에서 한쪽이 특히 밝은 데에는 우리 쪽으로 움직이는 물질의 상대론적 밝기 증가도 관여합니다.", observe: "둥근 별 무리가 흐려지고 제트가 남아요." },
    } : {}),
  });
}

export const galaxyById = Object.fromEntries(galaxyModels.map((model) => [model.id, model])) as Record<GalaxyId, GalaxyModel>;

