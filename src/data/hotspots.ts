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
  /** 이 사실이 실린 심화 편의 카테고리. 2단계에서 쓴다. */
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
 */
export const LON_OFFSET_DEG: Partial<Record<BodyId, number>> = {
  mars: 0,
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
    lat: 18.65, lon: 226.20, entry: "structure",
    note: "높이는 약 22킬로미터로 에베레스트의 두 배 반입니다.",
  },
  {
    bodyId: "mars", id: "tharsis-montes", name: "타르시스 화산 셋",
    lat: 1.48, lon: 247.04, entry: "structure",
    note: "아르시아, 파보니스, 아스크라에우스라고 부르는 큰 화산 셋이 나란히 줄지어 서 있어요.",
  },
  {
    bodyId: "mars", id: "valles-marineris", name: "발레스 마리네리스",
    lat: -14.01, lon: 301.41, entry: "structure",
    note: "길이가 약 4,000킬로미터나 되는 협곡이에요.",
  },
  {
    bodyId: "mars", id: "hellas", name: "헬라스 분지",
    lat: -42.43, lon: 70.50, entry: "structure",
    note: "지름이 약 2,300킬로미터에 깊이가 7킬로미터를 넘는, 태양계에서 손꼽히는 충돌 자국이에요.",
  },
  {
    bodyId: "mars", id: "syrtis-major", name: "시르티스 메이저",
    lat: 9.20, lon: 67.10, entry: "see",
    note: "지구에서 망원경으로 볼 때 잡히는 어두운 무늬예요.",
  },
  {
    bodyId: "mars", id: "gale", name: "게일 크레이터",
    lat: -5.37, lon: 137.81, entry: "origin",
    note: "큐리오시티가 여기서 점토를 찾았어요.",
  },
  {
    bodyId: "mars", id: "jezero", name: "예제로 충돌구",
    lat: 18.41, lon: 77.69, entry: "origin",
    note: "2021년 퍼시비어런스가 내린 곳으로, 30억 년 전 호수였고 삼각주가 남아 있어요.",
  },
  {
    bodyId: "mars", id: "cydonia", name: "사이도니아",
    lat: 34.56, lon: 347.67, entry: "myths",
    note: "1976년 바이킹 1호가 찍은 사진에 사람 얼굴처럼 보이는 지형이 있던 곳이에요.",
  },
  {
    bodyId: "mars", id: "planum-boreum", name: "북극 극관",
    lat: 87.32, lon: 54.96, entry: "weather",
    note: "극관은 계절마다 커졌다 줄었다 해요.",
  },
  {
    bodyId: "mars", id: "planum-australe", name: "남극 극관",
    lat: -83.35, lon: 157.70, entry: "weather",
    note: "이 과정에서 화성 대기의 4분의 1쯤이 얼었다 녹기를 되풀이합니다.",
  },
];

export const hotspotsFor = (bodyId: BodyId) => hotspots.filter((spot) => spot.bodyId === bodyId);
