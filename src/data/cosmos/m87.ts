import { galaxyById } from "../../lib/galaxy-stages";
import { galaxyReading } from "./galaxy-reading";
import type { Cosmos } from "../types";

/** 설명과 심화는 `galaxy-stages.ts` 한 곳에서. 까닭은 `milky-way.ts` 참고. */
const model = galaxyById["m87"];

export const m87: Cosmos = {
  id: "m87",
  name: "M87",
  poetic: "블랙홀 그림자와 제트가 있는 거대 은하",
  kind: "galaxy",
  tint: "#e9c98f",
  scene: "galaxy",
  galaxyId: "m87",
  description: model.detail,
  descriptionEasy: model.easy,
  deepDive: galaxyReading["m87"],
  facts: [
    { label: "종류", value: "거대 타원은하" },
    { label: "거리", value: "약 5,500만 광년" },
    { label: "중심 블랙홀", value: "태양 질량의 약 65억 배" },
    { label: "특징", value: "블랙홀 그림자와 제트" },
  ],
  lookUp: "M87의 블랙홀 사진은 블랙홀 자체가 빛나는 사진이 아니라, 뜨거운 물질과 그 가운데의 어두운 그림자를 전파로 재구성한 영상입니다.",
};
