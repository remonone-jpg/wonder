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
  wide: {
    name: "멀리서 보기",
    note: "은하 하나를 한눈에 바라봐요",
    easy: "은하는 별과 가스와 먼지가 중력으로 묶인 아주 큰 가족이에요.",
    detail:
      "은하는 별 하나가 아니라 별과 가스와 먼지, 그리고 빛으로 직접 보이지 않는 암흑물질이 중력으로 함께 묶인 거대한 계입니다. 화면의 점 하나가 실제 별 하나라는 뜻은 아니며, 수많은 별 무리를 한 점으로 줄여 그린 교육용 파티클입니다. 은하 사이의 거리는 은하 자체보다 훨씬 넓기 때문에, 장면을 멀리서 보면 각각의 섬처럼 보입니다.",
    observe: "먼저 전체 윤곽을 보고, 중심과 바깥의 밝기가 어떻게 다른지 찾아보세요.",
  },
  structure: {
    name: "구조 보기",
    note: "중심·원반·팔이 어떻게 나뉘는지 살펴봐요",
    easy: "나선은하는 가운데가 두껍고, 바깥으로 얇은 원반과 팔이 펼쳐져요.",
    detail:
      "나선은하의 팔은 별이 줄지어 붙은 단단한 실이 아니라, 가스와 별이 더 자주 모이는 밀도파에 가깝습니다. 그래서 팔을 따라 새 별이 태어나는 밝은 영역이 보이고, 오래된 별은 중심의 노란빛을 더합니다. 타원은하는 뚜렷한 원반과 팔 대신 별들이 여러 방향으로 움직이는 둥근 덩어리에 가깝고, 불규칙은하는 중력 상호작용이나 가스의 움직임 때문에 정돈된 모양을 갖지 못합니다.",
    observe: "밝은 중심에서 바깥으로 이어지는 팔, 또는 팔이 없는 둥근 덩어리를 비교해 보세요.",
  },
  core: {
    name: "중심으로 다가가기",
    note: "은하의 중심에는 무엇이 있을까요?",
    easy: "많은 큰 은하의 가운데에는 아주 무거운 블랙홀이 있어요.",
    detail:
      "큰 은하의 중심에는 태양보다 수백만 배에서 수십억 배 무거운 초대질량 블랙홀이 자리할 수 있습니다. 블랙홀이 은하의 모든 별을 빨아들이는 것은 아니에요. 멀리 있는 별들은 은하 전체의 중력장 속에서 궤도를 돌고, 중심 가까이 들어온 가스가 뜨거워질 때만 강한 빛과 제트가 나타날 수 있습니다. 우리 은하의 중심에도 궁수자리 A*라는 블랙홀이 있지만, 현재는 밝은 제트를 내는 활동은하핵으로 보이지 않습니다.",
    observe: "중심의 작은 밝은 점보다, 주변 별의 밀도가 어떻게 높아지는지 먼저 보세요.",
  },
  light: {
    name: "빛으로 보기",
    note: "같은 은하도 어떤 빛으로 보느냐에 따라 달라져요",
    easy: "눈에 보이는 빛, 적외선, 전파로 보면 같은 은하의 다른 모습이 보여요.",
    detail:
      "눈으로 보는 가시광선은 별과 먼지가 반사하고 내는 빛을 잘 보여 줍니다. 적외선은 차가운 먼지나 가려진 별 탄생 영역을 드러내고, 전파는 차가운 수소 가스와 블랙홀 제트의 흔적을 보여 줄 수 있습니다. X선은 뜨거운 가스와 폭발적인 중심 활동을 찾는 데 유용합니다. 이 무대의 색은 특정 망원경 사진을 그대로 복사한 색이 아니라, 여러 파장의 차이를 어린이가 한눈에 비교하도록 섞은 표현입니다.",
    observe: "색이 바뀔 때 중심, 먼지 띠, 제트 중 무엇이 가장 먼저 달라지는지 보세요.",
  },
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
    easy: "M87은 둥근 거대 은하예요. 가운데 블랙홀에서 아주 긴 제트가 뿜어져 나옵니다.",
    detail:
      "M87은 처녀자리 은하단 안에 있는 거대 타원은하입니다. 나선팔 대신 오래된 별들이 둥근 덩어리를 이루고, 중심의 초대질량 블랙홀은 주변의 뜨거운 물질과 자기장에 의해 밝은 제트를 만들 수 있습니다. 2019년 사건지평선망원경은 M87 중심 블랙홀 주변의 그림자를 처음으로 영상화했습니다. 사진 한 장에서 블랙홀 자체를 본 것이 아니라, 빛나는 뜨거운 가스와 그 안의 어두운 그림자 윤곽을 전파망원경 여러 대로 합성한 것입니다. 무대의 푸른 제트는 실제 길이와 밝기 비율을 줄인 교육용 표현입니다.",
    observe: "둥근 별 구름에서 한 방향으로 길게 뻗는 제트를 찾아보세요.",
    views: withViews({
      core: { note: "블랙홀 그림자가 남긴 중심의 빈틈을 봐요" },
      light: { note: "전파와 X선에서 더 강하게 드러나는 제트를 생각해 봐요" },
    }),
  },
];

export const galaxyById = Object.fromEntries(galaxyModels.map((model) => [model.id, model])) as Record<GalaxyId, GalaxyModel>;

