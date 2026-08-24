import type { BodyId } from "./planets";

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

export type Layer = {
  id: string;
  name: string;
  outerKm: number;
  innerKm: number;
  color: string;
  /** One line, for a five-year-old. */
  blurb: string;
};

export const layers: Record<BodyId, Layer[]> = {
  sun: [
    { id: "photosphere", name: "표면", outerKm: 696340, innerKm: 487438, color: "#ffb03a", blurb: "우리가 보는 밝은 겉면이에요. 여기서 빛과 열이 나와요." },
    { id: "radiative", name: "빛이 지나는 층", outerKm: 487438, innerKm: 174085, color: "#ff7a2a", blurb: "가운데서 만든 빛이 여길 빠져나오는 데 수만 년이 걸려요." },
    { id: "core", name: "핵", outerKm: 174085, innerKm: 0, color: "#fff2b0", blurb: "여기서 빛이 만들어져요. 1500만 도예요." },
  ],
  mercury: [
    { id: "crust", name: "지각", outerKm: 2439.7, innerKm: 2399.7, color: "#9c8c7c", blurb: "구멍이 잔뜩 뚫린 돌 껍질이에요." },
    { id: "mantle", name: "맨틀", outerKm: 2399.7, innerKm: 2020, color: "#7a5f4a", blurb: "얇은 바위층이에요." },
    { id: "core", name: "핵", outerKm: 2020, innerKm: 0, color: "#ffae5c", blurb: "수성은 거의 다 쇠공이에요. 몸의 대부분이 핵이에요." },
  ],
  venus: [
    { id: "crust", name: "지각", outerKm: 6051.8, innerKm: 6001.8, color: "#c9a05a", blurb: "화산이 아주 많은 돌 껍질이에요." },
    { id: "mantle", name: "맨틀", outerKm: 6001.8, innerKm: 3200, color: "#c0532a", blurb: "뜨거운 바위가 흐르는 곳이에요." },
    { id: "core", name: "핵", outerKm: 3200, innerKm: 0, color: "#ffcf7a", blurb: "쇠로 된 가운데예요." },
  ],
  earth: [
    { id: "crust", name: "지각", outerKm: 6371, innerKm: 6336, color: "#4e7a3a", blurb: "우리가 사는 땅과 바다예요. 사과 껍질처럼 아주 얇아요." },
    { id: "mantle", name: "맨틀", outerKm: 6336, innerKm: 3481, color: "#c0532a", blurb: "뜨거운 바위가 아주 천천히 흐르는 곳이에요. 화산에서 나오는 용암이 여기서 와요." },
    { id: "outer-core", name: "바깥 핵", outerKm: 3481, innerKm: 1221, color: "#ff8a3d", blurb: "녹은 쇠가 흐르는 바다예요. 이게 흐르면서 나침반이 가리키는 힘을 만들어요." },
    { id: "inner-core", name: "속 핵", outerKm: 1221, innerKm: 0, color: "#ffe9a8", blurb: "쇠공이에요. 태양 겉면만큼 뜨거운데 꽉 눌려서 딱딱해요." },
  ],
  mars: [
    { id: "crust", name: "지각", outerKm: 3389.5, innerKm: 3339.5, color: "#a8482a", blurb: "녹슨 붉은 흙과 돌이에요." },
    { id: "mantle", name: "맨틀", outerKm: 3339.5, innerKm: 1830, color: "#8f4526", blurb: "옛날엔 여기서 화산이 터졌어요." },
    { id: "core", name: "핵", outerKm: 1830, innerKm: 0, color: "#ffb066", blurb: "쇠와 황으로 된 가운데예요." },
  ],
  jupiter: [
    { id: "atmosphere", name: "구름층", outerKm: 69911, innerKm: 60000, color: "#d8ca9d", blurb: "밟을 땅이 없어요. 전부 구름과 가스예요." },
    { id: "metallic", name: "쇠처럼 된 수소", outerKm: 60000, innerKm: 10000, color: "#8f7fd8", blurb: "너무 꽉 눌려서 가스가 쇠처럼 변한 곳이에요." },
    { id: "core", name: "핵", outerKm: 10000, innerKm: 0, color: "#ffd28a", blurb: "가운데 작은 돌덩이가 숨어 있어요." },
  ],
  saturn: [
    { id: "atmosphere", name: "구름층", outerKm: 58232, innerKm: 50000, color: "#ead6b8", blurb: "노란 줄무늬 구름이에요." },
    { id: "metallic", name: "쇠처럼 된 수소", outerKm: 50000, innerKm: 12000, color: "#9a8ad6", blurb: "여기도 가스가 눌려서 쇠처럼 돼요." },
    { id: "core", name: "핵", outerKm: 12000, innerKm: 0, color: "#ffd28a", blurb: "가운데 돌과 얼음 덩어리가 있어요." },
  ],
  uranus: [
    { id: "atmosphere", name: "구름층", outerKm: 25362, innerKm: 18000, color: "#a8d8e8", blurb: "메탄 가스 때문에 하늘색이에요." },
    { id: "ice", name: "얼음 맨틀", outerKm: 18000, innerKm: 5000, color: "#5fa8c9", blurb: "물과 암모니아가 섞인 뜨거운 얼음이에요." },
    { id: "core", name: "핵", outerKm: 5000, innerKm: 0, color: "#ffcf9a", blurb: "가운데 작은 돌덩이가 있어요." },
  ],
  neptune: [
    { id: "atmosphere", name: "구름층", outerKm: 24622, innerKm: 18000, color: "#5b7ff5", blurb: "가장 빠른 바람이 부는 곳이에요." },
    { id: "ice", name: "얼음 맨틀", outerKm: 18000, innerKm: 5000, color: "#3f6fd0", blurb: "물과 얼음이 섞인 뜨거운 층이에요." },
    { id: "core", name: "핵", outerKm: 5000, innerKm: 0, color: "#ffcf9a", blurb: "가운데 돌덩이가 있어요." },
  ],
};
