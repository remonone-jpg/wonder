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
    description: "산소로 타는 불이 아니라 스스로 빛을 내는 별이에요. 중심에서 수소가 헬륨이 되면서 나온 에너지가 바깥으로 전해져 햇빛이 됩니다. 사진에 보이는 표면도 단단한 땅이 아니라 빛이 빠져나오는 광구예요. 어둡게 보이는 흑점은 둘레보다 온도가 낮은 자리랍니다.",
    size: "지름이 지구의 약 109배", day: "적도에서 한 바퀴 도는 데 25일", year: "은하 안에서 움직여요",
    funFact: "태양 빛이 지구까지 오는 데 8분 20초가 걸려요. 지금 보는 햇빛은 8분 전에 출발한 거예요.",
    lookUp: "낮에 밖에 나가 손등을 햇빛에 대봐요. 따뜻하죠? 그게 태양이 보낸 거예요. 절대 태양을 직접 보면 안 돼요!",
    deepDive: deepDive.sun,
  },
  mercury: {
    name: "수성", poetic: "제일 빠른 친구",
    description: "태양에서 가장 가까운 작은 암석 행성이에요. 몸집에 비해 속의 금속 핵이 크고, 겉에는 오래전 작은 천체와 부딪힌 충돌구가 남아 있어요. 열을 옮겨 줄 두꺼운 대기도 없답니다. 그런데 가장 가깝다고 가장 뜨거운 건 아니어서, 평균으로 제일 뜨거운 행성은 금성이에요.",
    size: "지구의 3분의 1", day: "자전 약 59일", year: "일 년이 88일",
    funFact: "낮에는 아주 뜨겁고 밤에는 꽁꽁 얼어요. 하루 만에 여름과 겨울이 다 와요.",
    lookUp: "{child}가 수성에 살면 생일이 일 년에 네 번이나 와요!",
    deepDive: deepDive.mercury,
  },
  venus: {
    name: "금성", poetic: "반짝이는 샛별",
    description: "지구와 크기가 비슷한 암석 행성이에요. 그런데 두꺼운 이산화탄소 대기와 구름 아래는 지구와 아주 달라요. 밖으로 나가려던 열이 대기에 붙들렸다 다시 나오면서 지표가 뜨겁게 유지되거든요. 태양과의 거리만으로는 행성의 기후를 알 수 없다는 좋은 예랍니다.",
    size: "지구와 거의 같아요", day: "자전 약 243일", year: "일 년이 225일",
    funFact: "금성은 거꾸로 돌아요. 여기선 해가 서쪽에서 떠서 동쪽으로 져요.",
    lookUp: "금성은 시기에 따라 저녁 서쪽이나 새벽 동쪽에서 밝게 보여요. 관측 날짜에 맞는 별자리 지도로 확인해요.",
    deepDive: deepDive.venus,
  },
  earth: {
    name: "지구", poetic: "우리 집",
    description: "{child}가 살고 있는 곳이에요. 암석으로 이루어진 행성인데 표면에 넓은 바다가 있고, 우리가 아는 생명이 사는 유일한 세계이기도 해요. 물 하나로 다 설명되지는 않아요. 대기는 열과 물을 옮기고, 생명은 다시 그 대기와 환경을 바꾸어 놓거든요.",
    size: "우리가 사는 크기", day: "자전 약 23시간 56분", year: "일 년이 365일",
    funFact: "우주에서 보면 지구는 파란 구슬처럼 보여요. 바다와 대기가 파란 모습에 기여해요.",
    lookUp: "발로 땅을 쿵쿵 굴러봐요. {child}는 지금 우주를 달리는 큰 공 위에 서 있는 거예요.",
    deepDive: deepDive.earth,
  },
  mars: {
    name: "화성", poetic: "빨간 별",
    description: "온통 붉은 까닭은 표면의 철이 든 광물에 녹 같은 산화물이 생겼기 때문이에요. 암석 지표와 극지방의 얼음, 아주 얇은 대기가 있어요. 옛 강바닥처럼 보이는 지형은 예전에 물이 흘렀다는 증거랍니다. 그렇다고 화성에 생명이 있었다는 뜻은 아니에요.",
    size: "지구의 반쯤", day: "자전 약 24시간 37분", year: "일 년이 687일",
    funFact: "올림푸스 산은 높이가 22km예요. 백두산을 여덟 개 쌓은 것보다 높아요.",
    lookUp: "화성이 보이는 때에는 붉은빛이 단서가 돼요. 색만으로 확정하지 말고 날짜에 맞는 별자리 지도로 위치를 확인해요.",
    deepDive: deepDive.mars,
  },
  jupiter: {
    name: "목성", poetic: "제일 큰 행성",
    description: "태양계에서 가장 큰 행성이에요. 주로 수소와 헬륨이라 발을 디딜 땅이 없어요. 그렇다고 속까지 성긴 기체인 것은 아니고, 깊이 들어갈수록 압력과 온도가 올라가 물질의 상태가 달라져요. 보이는 줄무늬도 지표의 무늬가 아니라 대기의 구름과 흐름이랍니다.",
    size: "지구가 1300개 들어가요", day: "자전 약 10시간", year: "일 년이 12년",
    funFact: "커다란 빨간 점은 오랫동안 관측해 온 폭풍이에요. 그 안에 지구가 통째로 들어가요.",
    lookUp: "{child}가 목성에서 태어나면 첫 생일까지 12년을 기다려야 해요.",
    deepDive: deepDive.jupiter,
  },
  saturn: {
    name: "토성", poetic: "고리를 두른 별",
    description: "수소와 헬륨이 주성분인 거대 행성이에요. 고리의 틈과 물결에는 토성과 위성의 중력이 남긴 흔적이 있어요. 평균 밀도는 물보다 작지만, 토성을 담아 띄울 욕조가 있다는 뜻은 아니에요. 같은 부피의 물과 견준 비유일 뿐, 토성의 질량은 지구보다 훨씬 크거든요.",
    size: "지름이 지구의 약 9배", day: "자전 약 11시간", year: "일 년이 29년",
    funFact: "고리는 통짜가 아니라 얼음 알갱이 수십억 개예요. 큰 건 집채만 하고 작은 건 모래알만 해요.",
    lookUp: "고리는 눈으로는 안 보여요. 작은 망원경만 있어도 보이니 언젠가 꼭 봐요.",
    deepDive: deepDive.saturn,
  },
  uranus: {
    name: "천왕성", poetic: "누워서 도는 별",
    description: "자전축이 크게 기울어 옆으로 누운 듯 도는 얼음 거대 행성이에요. 여기서 얼음은 표면이 단단한 얼음판이라는 뜻이 아니라, 물과 암모니아와 메탄이 속을 이룬다는 뜻이에요. 깊은 속은 높은 압력과 온도 아래 있어요. 대기의 메탄이 붉은 빛을 흡수해 청록빛으로 보인답니다.",
    size: "지름이 지구의 약 4배", day: "자전 약 17시간", year: "일 년이 84년",
    funFact: "누워 있어서 극지방에서는 수십 년씩 낮과 밤이 이어질 수 있어요.",
    lookUp: "공을 옆으로 눕혀서 굴려봐요. 천왕성이 딱 그렇게 돌아요.",
    deepDive: deepDive.uranus,
  },
  neptune: {
    name: "해왕성", poetic: "바람의 별",
    description: "여덟 행성 가운데 태양에서 가장 멀리 있어요. 햇빛은 약한데 대기는 조금도 고요하지 않아요. 밝은 구름과, 나타났다 사라지는 어두운 소용돌이가 관측되거든요. 안에서 나오는 열도 날씨를 움직이는 힘이에요. 천왕성과 재료는 비슷해도 모습은 서로 다르답니다.",
    size: "지름이 지구의 약 4배", day: "자전 약 16시간", year: "일 년이 165년",
    funFact: "바람이 시속 2000km로 불어요. 태양계에서 가장 빠른 바람이에요.",
    lookUp: "해왕성은 발견된 뒤로 아직 태양을 두 바퀴도 못 돌았어요. 한 바퀴에 165년이 걸리거든요.",
    deepDive: deepDive.neptune,
  },
};

/**
 * A fallback, not an override.
 *
 * `solar-reading.ts` keeps three chapters for each body that has no file of
 * its own under `deep-dive/`, so that every body shows *something* under the
 * deep tab. This loop used to assign them unconditionally, which meant a body
 * written properly — twenty entries, named above as `deepDive.venus` — had its
 * twenty silently replaced by the three as soon as this line ran. The guard is
 * what makes writing a body actually take effect; drop it and the next body
 * written will look like it did nothing.
 *
 * `chapters` keeps its Venus entry on purpose: the second of the three reuses
 * `solarReading.venus`, which the basic tab still reads. Removing Venus from
 * `chapters` would be removing the panel copy with it.
 *
 * Nothing currently falls through. Every one of the nine bodies names its own
 * twenty above, so this loop assigns nothing on the way past — as of the Sun
 * being written, it is a guard with no one left to catch. It stays because a
 * tenth body would arrive the way all nine did: named here before its file
 * exists, or written over several commits. Deleting the loop, or the chapters
 * it reads, would take that landing away and would also take `solarReading`
 * uses out from under the basic tab.
 */
for (const [id, entries] of Object.entries(extraSolarDeep)) {
  const body = bodyCopy[id as BodyId];
  if (!body.deepDive) body.deepDive = entries;
}
