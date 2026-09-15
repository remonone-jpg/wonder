import { extraSolarDeep } from "./solar-reading";
import type { BodyCopy, BodyId } from "./types";
import { deepDive } from "./deep-dive";

/**
 * Korean copy for five-year-olds, in the same voice as the body app: short
 * sentences, sounds a child already makes, comparisons to things they have
 * held, and something to go and do. `{child}` is filled in by the app from
 * `lib/child-name`.
 */

export const bodyCopy: Record<BodyId, BodyCopy> = {
  sun: {
    name: "태양", poetic: "스스로 빛나는 우리의 별",
    description: "우리를 따뜻하게 해주는 커다란 별이에요. 태양계에서 제일 크고, 지구가 백만 개도 넘게 들어가요.",
    size: "지름이 지구의 약 109배", day: "적도에서 한 바퀴 도는 데 25일", year: "은하 안에서 움직여요",
    funFact: "태양 빛이 지구까지 오는 데 8분 20초가 걸려요. 지금 보는 햇빛은 8분 전에 출발한 거예요.",
    lookUp: "낮에 밖에 나가 손등을 햇빛에 대봐요. 따뜻하죠? 그게 태양이 보낸 거예요. 절대 태양을 직접 보면 안 돼요!",
  },
  mercury: {
    name: "수성", poetic: "제일 빠른 친구",
    description: "태양에서 가장 가까워요. 아주 빨리 돌아서 일 년이 88일밖에 안 돼요.",
    size: "지구의 3분의 1", day: "자전 약 59일", year: "일 년이 88일",
    funFact: "낮에는 아주 뜨겁고 밤에는 꽁꽁 얼어요. 하루 만에 여름과 겨울이 다 와요.",
    lookUp: "{child}가 수성에 살면 생일이 일 년에 네 번이나 와요!",
  },
  venus: {
    name: "금성", poetic: "반짝이는 샛별",
    description: "지구랑 크기가 거의 똑같아요. 두꺼운 구름에 덮여 있어서 아주 뜨거워요.",
    size: "지구와 거의 같아요", day: "자전 약 243일", year: "일 년이 225일",
    funFact: "금성은 거꾸로 돌아요. 여기선 해가 서쪽에서 떠서 동쪽으로 져요.",
    lookUp: "금성은 시기에 따라 저녁 서쪽이나 새벽 동쪽에서 밝게 보여요. 관측 날짜에 맞는 별자리 지도로 확인해요.",
  },
  earth: {
    name: "지구", poetic: "우리 집",
    description: "{child}가 살고 있는 곳이에요. 물이 있고 공기가 있어서 지금까지 생명이 사는 걸 아는 유일한 곳이에요.",
    size: "우리가 사는 크기", day: "자전 약 23시간 56분", year: "일 년이 365일",
    funFact: "우주에서 보면 지구는 파란 구슬처럼 보여요. 바다와 대기가 파란 모습에 기여해요.",
    lookUp: "발로 땅을 쿵쿵 굴러봐요. {child}는 지금 우주를 달리는 큰 공 위에 서 있는 거예요.",
    deepDive: deepDive.earth,
  },
  mars: {
    name: "화성", poetic: "빨간 별",
    description: "흙에 녹이 슬어서 온통 빨개요. 태양계에서 제일 높은 산이 여기 있어요.",
    size: "지구의 반쯤", day: "자전 약 24시간 37분", year: "일 년이 687일",
    funFact: "올림푸스 산은 높이가 22km예요. 백두산을 여덟 개 쌓은 것보다 높아요.",
    lookUp: "화성이 보이는 때에는 붉은빛이 단서가 돼요. 색만으로 확정하지 말고 날짜에 맞는 별자리 지도로 위치를 확인해요.",
    deepDive: deepDive.mars,
  },
  jupiter: {
    name: "목성", poetic: "제일 큰 행성",
    description: "돌덩이가 아니라 거의 다 가스예요. 발을 디딜 땅이 없어요.",
    size: "지구가 1300개 들어가요", day: "자전 약 10시간", year: "일 년이 12년",
    funFact: "커다란 빨간 점은 오랫동안 관측해 온 폭풍이에요. 그 안에 지구가 통째로 들어가요.",
    lookUp: "{child}가 목성에서 태어나면 첫 생일까지 12년을 기다려야 해요.",
    deepDive: deepDive.jupiter,
  },
  saturn: {
    name: "토성", poetic: "고리를 두른 별",
    description: "얼음과 돌 조각으로 만든 고리를 두르고 있어요. 평균 밀도는 물보다 작지만 몸 전체는 아주 무거워요.",
    size: "지름이 지구의 약 9배", day: "자전 약 11시간", year: "일 년이 29년",
    funFact: "고리는 통짜가 아니라 얼음 알갱이 수십억 개예요. 큰 건 집채만 하고 작은 건 모래알만 해요.",
    lookUp: "고리는 눈으로는 안 보여요. 작은 망원경만 있어도 보이니 언젠가 꼭 봐요.",
    deepDive: deepDive.saturn,
  },
  uranus: {
    name: "천왕성", poetic: "누워서 도는 별",
    description: "옆으로 완전히 누운 채로 굴러가요. 메탄 때문에 하늘색이에요.",
    size: "지름이 지구의 약 4배", day: "자전 약 17시간", year: "일 년이 84년",
    funFact: "누워 있어서 극지방에서는 수십 년씩 낮과 밤이 이어질 수 있어요.",
    lookUp: "공을 옆으로 눕혀서 굴려봐요. 천왕성이 딱 그렇게 돌아요.",
  },
  neptune: {
    name: "해왕성", poetic: "바람의 별",
    description: "태양에서 제일 멀어요. 아주 춥고 바람이 엄청나게 불어요.",
    size: "지름이 지구의 약 4배", day: "자전 약 16시간", year: "일 년이 165년",
    funFact: "바람이 시속 2000km로 불어요. 태양계에서 가장 빠른 바람이에요.",
    lookUp: "해왕성은 발견된 뒤로 아직 태양을 두 바퀴도 못 돌았어요. 한 바퀴에 165년이 걸리거든요.",
  },
};

for (const [id, entries] of Object.entries(extraSolarDeep)) bodyCopy[id as BodyId].deepDive = entries;
