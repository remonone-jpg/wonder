import type { BodyId, Layer } from "./types";

/**
 * What each body is made of, from the outside in.
 *
 * `outerKm` and `innerKm` are radii from the centre, in kilometres, and they
 * are the measured ones — which is the point. Drawn to scale they show things a
 * diagram usually flattens away: Earth's crust is too thin to see, and Mercury
 * turns out to be mostly a ball of iron.
 *
 * Depths come from NASA planetary fact sheets and standard interior models.
 */

export const layers: Record<BodyId, Layer[]> = {
  sun: [
    { id: "photosphere", name: "표면", outerKm: 696340, innerKm: 487438, color: "#ffb03a", material: "plasma", blurb: "우리가 보는 밝은 겉면이에요. 여기서 빛과 열이 나와요." },
    { id: "radiative", name: "빛이 지나는 층", outerKm: 487438, innerKm: 174085, color: "#ff7a2a", material: "plasma", blurb: "가운데서 만든 빛이 여길 빠져나오는 데 수만 년이 걸려요." },
    { id: "core", name: "핵", outerKm: 174085, innerKm: 0, color: "#fff2b0", material: "plasma", blurb: "여기서 빛이 만들어져요. 1500만 도예요." },
  ],
  mercury: [
    { id: "crust", name: "지각", outerKm: 2439.7, innerKm: 2399.7, color: "#9c8c7c", material: "rock", blurb: "구멍이 잔뜩 뚫린 돌 껍질이에요." },
    { id: "mantle", name: "맨틀", outerKm: 2399.7, innerKm: 2020, color: "#7a5f4a", material: "rock", blurb: "얇은 바위층이에요." },
    { id: "core", name: "핵", outerKm: 2020, innerKm: 0, color: "#ffc978", material: "metal", blurb: "수성은 거의 다 쇠공이에요. 몸의 대부분이 핵이에요." },
  ],
  venus: [
    { id: "air", name: "두꺼운 구름", outerKm: 6151.8, innerKm: 6051.8, color: "#f0cf85", material: "gas", blurb: "황산 구름이 아주 두껍게 덮고 있어요. 그래서 겉이 안 보여요." },
    { id: "crust", name: "지각", outerKm: 6051.8, innerKm: 6001.8, color: "#c9a05a", material: "rock", blurb: "화산이 아주 많은 돌 껍질이에요." },
    { id: "mantle", name: "윗맨틀", outerKm: 6001.8, innerKm: 4800, color: "#a8502c", material: "deeprock", blurb: "바위가 물렁해지는 곳이에요." },
    { id: "lower-mantle", name: "아랫맨틀", outerKm: 4800, innerKm: 3200, color: "#c0532a", material: "molten", blurb: "뜨거운 바위가 흐르는 곳이에요." },
    { id: "core", name: "핵", outerKm: 3200, innerKm: 0, color: "#ffdc96", material: "metal", blurb: "쇠로 된 가운데예요." },
  ],
  earth: [
    { id: "air", name: "하늘", outerKm: 6471, innerKm: 6371, color: "#8ec5ff", material: "gas", blurb: "숨 쉬는 공기예요. 100km만 올라가면 벌써 우주가 시작돼요." },
    { id: "ocean", name: "바다", outerKm: 6371, innerKm: 6367.3, color: "#1d5c94", material: "water", blurb: "지구의 3분의 2를 덮고 있어요. 제일 깊은 곳은 11km나 돼요." },
    { id: "seabed", name: "바다 밑바닥", outerKm: 6367.3, innerKm: 6364, color: "#8a7355", material: "sand", blurb: "아주 오래된 진흙과 모래가 쌓인 곳이에요. 여기에 옛날 생물들이 잠들어 있어요." },
    { id: "crust", name: "지각", outerKm: 6364, innerKm: 6336, color: "#6b6259", material: "rock", blurb: "딱딱한 바위 껍질이에요. 사과 껍질처럼 아주 얇아요." },
    { id: "upper-mantle", name: "윗맨틀", outerKm: 6336, innerKm: 5961, color: "#8a4a2e", material: "deeprock", blurb: "바위가 물렁물렁해지기 시작하는 곳이에요. 여기가 움직여서 지진이 나요." },
    { id: "transition", name: "가운데 층", outerKm: 5961, innerKm: 5711, color: "#a8502c", material: "deeprock", blurb: "돌이 꽉 눌려서 다른 돌로 바뀌는 곳이에요." },
    { id: "lower-mantle", name: "아랫맨틀", outerKm: 5711, innerKm: 3481, color: "#c0532a", material: "molten", blurb: "지구에서 제일 두꺼운 층이에요. 뜨거운 바위가 아주 천천히 돌고 있어요." },
    { id: "outer-core", name: "바깥 핵", outerKm: 3481, innerKm: 1221, color: "#ffb552", material: "molten", blurb: "녹은 쇠가 흐르는 바다예요. 이게 흐르면서 나침반이 가리키는 힘을 만들어요." },
    { id: "inner-core", name: "속 핵", outerKm: 1221, innerKm: 0, color: "#fff4d2", material: "metal", blurb: "쇠공이에요. 태양 겉면만큼 뜨거운데 꽉 눌려서 딱딱해요." },
  ],
  mars: [
    { id: "air", name: "얇은 하늘", outerKm: 3439.5, innerKm: 3389.5, color: "#e0a184", material: "gas", blurb: "공기가 아주 얇아요. 여기선 숨을 쉴 수 없어요." },
    { id: "dust", name: "붉은 모래", outerKm: 3389.5, innerKm: 3384.5, color: "#b5502c", material: "sand", blurb: "온 행성을 덮은 녹슨 모래예요. 화성이 빨간 건 이것 때문이에요." },
    { id: "crust", name: "지각", outerKm: 3384.5, innerKm: 3339.5, color: "#8a4630", material: "rock", blurb: "딱딱한 바위 껍질이에요. 지구보다 훨씬 두꺼워요." },
    { id: "mantle", name: "맨틀", outerKm: 3339.5, innerKm: 1830, color: "#8f4526", material: "deeprock", blurb: "옛날엔 여기서 화산이 터졌어요. 지금은 조용해요." },
    { id: "core", name: "핵", outerKm: 1830, innerKm: 0, color: "#ffc98a", material: "metal", blurb: "쇠와 황으로 된 가운데예요." },
  ],
  jupiter: [
    { id: "atmosphere", name: "구름층", outerKm: 69911, innerKm: 60000, color: "#d8ca9d", material: "gas", blurb: "밟을 땅이 없어요. 전부 구름과 가스예요." },
    { id: "metallic", name: "쇠처럼 된 수소", outerKm: 60000, innerKm: 10000, color: "#8f7fd8", material: "metal", blurb: "너무 꽉 눌려서 가스가 쇠처럼 변한 곳이에요." },
    { id: "core", name: "핵", outerKm: 10000, innerKm: 0, color: "#ffd28a", material: "rock", blurb: "가운데 작은 돌덩이가 숨어 있어요." },
  ],
  saturn: [
    { id: "atmosphere", name: "구름층", outerKm: 58232, innerKm: 50000, color: "#ead6b8", material: "gas", blurb: "노란 줄무늬 구름이에요." },
    { id: "metallic", name: "쇠처럼 된 수소", outerKm: 50000, innerKm: 12000, color: "#9a8ad6", material: "metal", blurb: "여기도 가스가 눌려서 쇠처럼 돼요." },
    { id: "core", name: "핵", outerKm: 12000, innerKm: 0, color: "#ffd28a", material: "rock", blurb: "가운데 돌과 얼음 덩어리가 있어요." },
  ],
  uranus: [
    { id: "atmosphere", name: "구름층", outerKm: 25362, innerKm: 18000, color: "#a8d8e8", material: "gas", blurb: "메탄 가스 때문에 하늘색이에요." },
    { id: "ice", name: "얼음 맨틀", outerKm: 18000, innerKm: 5000, color: "#5fa8c9", material: "ice", blurb: "물과 암모니아가 섞인 뜨거운 얼음이에요." },
    { id: "core", name: "핵", outerKm: 5000, innerKm: 0, color: "#ffcf9a", material: "rock", blurb: "가운데 작은 돌덩이가 있어요." },
  ],
  neptune: [
    { id: "atmosphere", name: "구름층", outerKm: 24622, innerKm: 18000, color: "#5b7ff5", material: "gas", blurb: "가장 빠른 바람이 부는 곳이에요." },
    { id: "ice", name: "얼음 맨틀", outerKm: 18000, innerKm: 5000, color: "#3f6fd0", material: "ice", blurb: "물과 얼음이 섞인 뜨거운 층이에요." },
    { id: "core", name: "핵", outerKm: 5000, innerKm: 0, color: "#ffcf9a", material: "rock", blurb: "가운데 돌덩이가 있어요." },
  ],
};
