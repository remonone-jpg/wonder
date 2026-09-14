import { galaxyById } from "../../lib/galaxy-stages";
import { galaxyReading } from "./galaxy-reading";
import type { Cosmos } from "../types";

/** 설명과 심화는 `galaxy-stages.ts` 한 곳에서. 까닭은 `milky-way.ts` 참고. */
const model = galaxyById["andromeda"];

export const andromeda: Cosmos = {
  id: "andromeda",
  name: "안드로메다 은하",
  poetic: "250만 년 전 출발한 이웃의 빛",
  kind: "galaxy",
  tint: "#f2bf9b",
  scene: "galaxy",
  galaxyId: "andromeda",
  description: model.detail,
  descriptionEasy: model.easy,
  deepDive: galaxyReading["andromeda"],
  facts: [
    { label: "다른 이름", value: "M31" },
    { label: "거리", value: "약 250만 광년" },
    { label: "모양", value: "나선은하" },
    { label: "우리와의 관계", value: "가까운 주요 이웃" },
  ],
  lookUp: "아주 어둡고 맑은 가을 하늘에서 안드로메다를 찾아보세요. 맨눈에는 희미한 얼룩처럼 보일 수 있습니다.",
};
