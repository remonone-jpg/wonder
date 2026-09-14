import { galaxyById } from "../../lib/galaxy-stages";
import { galaxyReading } from "./galaxy-reading";
import type { Cosmos } from "../types";

/** 설명과 심화는 `galaxy-stages.ts` 한 곳에서. 까닭은 `milky-way.ts` 참고. */
const model = galaxyById["large-magellanic-cloud"];

export const largeMagellanicCloud: Cosmos = {
  id: "large-magellanic-cloud",
  name: "대마젤란운",
  poetic: "별이 태어나는 가까운 이웃",
  kind: "galaxy",
  tint: "#8ed9e3",
  scene: "galaxy",
  galaxyId: "large-magellanic-cloud",
  description: model.detail,
  descriptionEasy: model.easy,
  deepDive: galaxyReading["large-magellanic-cloud"],
  facts: [
    { label: "종류", value: "불규칙 왜소은하" },
    { label: "거리", value: "약 16만 광년" },
    { label: "자리", value: "우리 은하의 위성은하" },
    { label: "특징", value: "활발한 별 탄생" },
  ],
  lookUp: "남쪽에 가까운 지역의 어두운 하늘에서는 대마젤란운을 희미한 구름처럼 볼 수 있습니다.",
};
