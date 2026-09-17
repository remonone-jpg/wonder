import type { BodyId } from "./types";

/**
 * 천체 표면에 찍는 점.
 *
 * 글은 심화 본문에 이미 있는 사실만 옮겨 적는다. `entry` 는 그 사실이
 * 어느 심화 편에서 왔는지를 가리키는 카테고리로, 2단계에서 점을 누르면
 * 그 편을 펼치는 데 쓸 자리다. 지금은 아무도 읽지 않는다.
 *
 * 위도와 경도는 본문에 없는 새 사실이라 따로 확인했다. 출처는 IAU
 * 행성 지명목록(planetarynames.wr.usgs.gov)이고, 위도는 planetocentric,
 * 경도는 동경 0~360도다. 목록이 주는 값은 지형의 **중심**이라, 넓은
 * 지형일수록 점 하나가 그 넓이를 대표하지 못한다는 점은 감수한다 —
 * 발레스 마리네리스는 4천 킬로미터에 걸쳐 있다.
 */
export type Hotspot = {
  readonly bodyId: BodyId;
  readonly id: string;
  readonly name: string;
  /** 북위가 양수. planetocentric. */
  readonly lat: number;
  /** 동경 0~360. */
  readonly lon: number;
  /** 말풍선에 뜨는 한 문장. 심화 본문에 있는 사실만. */
  readonly note: string;
  /**
   * 이 점을 눌렀을 때 펼칠 심화 편의 **제목**.
   *
   * 전에는 카테고리를 적었는데, 한 카테고리에 여러 편이 들어가게 되면서
   * 더는 편 하나를 가리키지 못한다. 아코디언이 편을 여는 열쇠도 제목이라,
   * 열쇠를 그대로 적어 두는 편이 한 단계 덜 거친다. 제목을 고치면 여기도
   * 같이 고쳐야 하고, 어긋나면 대조 스크립트가 잡는다.
   */
  readonly entry: string;
};

/**
 * 텍스처마다 경도의 기준선이 다르다.
 *
 * 등장방형도법 이미지는 대개 본초자오선을 한가운데(u=0.5)에 두고 동쪽으로
 * 경도가 는다. 이 책이 쓰는 그림들이 정말 그런지는 재 봐야 알 수 있어서,
 * `?calib=1` 로 구를 눌러 나온 값과 지명목록의 값을 견주어 차이를 여기
 * 적는다. 0 이면 표준 그대로라는 뜻이다.
 *
 * 화성은 시르티스 메이저로 쟀다 — 맨눈으로도 잡히는 어두운 무늬라
 * 텍스처에서 바로 찾을 수 있는 몇 안 되는 기준점이다.
 *
 * 지구는 섬 셋으로 쟀다. 해안선은 바다와 땅이 딱 갈리는 경계라 화성의
 * 흐릿한 얼룩보다 훨씬 또렷하고, 섬은 양쪽 가장자리의 한가운데를 잡으면
 * 해안선이 들쭉날쭉한 것에도 흔들리지 않는다. earth_daymap.jpg 를 직접
 * 읽어 위도별로 훑은 결과가 이렇다.
 *
 *   섬            잰 값(동경)        실제와의 차이
 *   스리랑카 7.5°N  79.80~81.56 (가운데 80.68)  +0.03°
 *   마다가스카르 20°S 44.30~48.52 (가운데 46.41)  +0.01°
 *   태즈메이니아 42°S 145.37~148.01 (가운데 146.69) −0.06°
 *
 * 셋 다 ±0.1° 안이고 부호도 엇갈린다. 이 그림의 한 픽셀이 0.176°(2048px
 * ÷ 360°)이니 차이가 한 픽셀에도 못 미친다 — 돌릴 만한 계통 차가 없다.
 */
export const LON_OFFSET_DEG: Partial<Record<BodyId, number>> = {
  mars: 0,
  earth: 0,
};

/**
 * 화성 열 곳.
 *
 * 타르시스의 화산 셋은 점 하나로 묶었다. 아르시아(남위 8.26·동경 239.91),
 * 파보니스(북위 1.48·동경 247.04), 아스크라에우스(북위 11.92·동경 255.92)가
 * 비스듬히 줄지어 서 있어서, 가운데인 파보니스에 점을 두고 셋을 함께
 * 이야기한다. 점 셋을 따로 찍으면 이 배율에서 서로 겹친다.
 */
export const hotspots: readonly Hotspot[] = [
  {
    bodyId: "mars", id: "olympus-mons", name: "올림푸스산",
    lat: 18.65, lon: 226.20, entry: "태양계에서 가장 높은 산",
    note: "높이는 약 22킬로미터로 에베레스트의 두 배 반입니다.",
  },
  {
    bodyId: "mars", id: "tharsis-montes", name: "타르시스 화산 셋",
    lat: 1.48, lon: 247.04, entry: "나란히 선 화산 셋",
    note: "아르시아, 파보니스, 아스크라에우스라고 부르는 큰 화산 셋이 나란히 줄지어 서 있어요.",
  },
  {
    bodyId: "mars", id: "valles-marineris", name: "발레스 마리네리스",
    lat: -14.01, lon: 301.41, entry: "행성을 가로지르는 협곡",
    note: "길이가 약 4,000킬로미터나 되는 협곡이에요.",
  },
  {
    bodyId: "mars", id: "hellas", name: "헬라스 분지",
    lat: -42.43, lon: 70.50, entry: "남쪽과 북쪽이 딴판인 행성",
    note: "지름이 약 2,300킬로미터에 깊이가 7킬로미터를 넘는, 태양계에서 손꼽히는 충돌 자국이에요.",
  },
  {
    bodyId: "mars", id: "syrtis-major", name: "시르티스 메이저",
    lat: 9.20, lon: 67.10, entry: "지구에서 보이는 어두운 무늬",
    note: "지구에서 망원경으로 볼 때 잡히는 어두운 무늬예요.",
  },
  {
    bodyId: "mars", id: "gale", name: "게일 크레이터",
    lat: -5.37, lon: 137.81, entry: "점토를 찾아낸 구덩이",
    note: "큐리오시티가 여기서 점토를 찾았어요.",
  },
  {
    bodyId: "mars", id: "jezero", name: "예제로 충돌구",
    lat: 18.41, lon: 77.69, entry: "호수였던 충돌구",
    note: "2021년 퍼시비어런스가 내린 곳으로, 30억 년 전 호수였고 삼각주가 남아 있어요.",
  },
  {
    bodyId: "mars", id: "cydonia", name: "사이도니아",
    lat: 34.56, lon: 347.67, entry: "얼굴 모양 바위",
    note: "1976년 바이킹 1호가 찍은 사진에 사람 얼굴처럼 보이는 지형이 있던 곳이에요.",
  },
  {
    bodyId: "mars", id: "planum-boreum", name: "북극 극관",
    lat: 87.32, lon: 54.96, entry: "공기가 눈으로 내리는 북극",
    note: "극관은 계절마다 커졌다 줄었다 해요.",
  },
  {
    bodyId: "mars", id: "planum-australe", name: "남극 극관",
    lat: -83.35, lon: 157.70, entry: "여름에도 얼음이 남는 남극",
    note: "이 과정에서 화성 대기의 4분의 1쯤이 얼었다 녹기를 되풀이합니다.",
  },
];

/**
 * 지구 아홉 곳.
 *
 * 위도·경도는 본문에 없는 새 사실이라 따로 확인했다. 지형이 아니라 사람이
 * 이름 붙인 자리라서 IAU 지명목록이 아니라 일반 지리 좌표를 썼고, 출처는
 * 위키백과 좌표 API(action=query&prop=coordinates)다. 서경은 동경 0~360 으로
 * 바꿔 적었다 — 변환식이 동경 하나로만 도니까.
 */
export const earthSpots: readonly Hotspot[] = [
  {
    bodyId: "earth", id: "kola", name: "콜라 시추공",
    lat: 69.3965, lon: 30.6100, entry: "사람이 가장 깊이 판 구멍",
    note: "소련이 1970년부터 20년 넘게 뚫은 가장 깊은 구멍이에요. 12킬로미터가 조금 넘습니다.",
  },
  {
    bodyId: "earth", id: "mariana", name: "마리아나 해구",
    lat: 11.3733, lon: 142.5917, entry: "바다에서 가장 깊은 곳",
    note: "바다에서 가장 깊은 곳이에요. 바닥이 약 11킬로미터입니다.",
  },
  {
    bodyId: "earth", id: "jack-hills", name: "잭힐스",
    lat: -26.1167, lon: 117.1500, entry: "44억 년을 버틴 알갱이",
    note: "지구에서 가장 오래된 물질인 44억 년짜리 알갱이가 나온 곳이에요.",
  },
  {
    bodyId: "earth", id: "acasta", name: "아카스타",
    lat: 65.1666, lon: 244.4183, entry: "가장 오래된 바위",
    note: "지금까지 찾은 가장 오래된 암석이 있는 곳이에요. 약 40억 년 됐습니다.",
  },
  {
    bodyId: "earth", id: "yellowstone", name: "옐로스톤",
    lat: 44.4000, lon: 249.3000, entry: "다음이 언제일지 모르는 화산",
    note: "아주 큰 화산이 있어요. 마지막으로 크게 터진 것이 64만 년쯤 전입니다.",
  },
  {
    bodyId: "earth", id: "alexandria", name: "알렉산드리아",
    lat: 31.1975, lon: 29.8925, entry: "막대 하나로 지구를 잰 사람",
    note: "에라토스테네스가 막대 그림자 각도를 재어 지구 둘레를 계산한 곳이에요.",
  },
  {
    bodyId: "earth", id: "pantheon", name: "파리 판테온",
    lat: 48.8461, lon: 2.3458, entry: "지구가 돈다는 것을 보여 준 추",
    note: "1851년에 푸코가 천장에 긴 줄로 추를 매달아 지구가 도는 것을 보여 준 곳이에요.",
  },
  {
    bodyId: "earth", id: "seoul", name: "서울",
    lat: 37.5600, lon: 126.9900, entry: "밤에 더 잘 보이는 것",
    note: "밤에는 인공물이 낮보다 훨씬 잘 보여요. 궤도에서는 도시 불빛이 눈에 띕니다.",
  },
  {
    bodyId: "earth", id: "great-wall", name: "만리장성",
    lat: 40.3542, lon: 116.0069, entry: "우주에서 만리장성이 보일까",
    note: "폭이 5미터에서 9미터라 우주에서 맨눈으로 쉽게 보이지는 않아요.",
  },
];

const all: readonly Hotspot[] = [...hotspots, ...earthSpots];

export const hotspotsFor = (bodyId: BodyId) => all.filter((spot) => spot.bodyId === bodyId);
