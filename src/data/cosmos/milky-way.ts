import { galaxyById } from "../../lib/galaxy-stages";
import { galaxyReading } from "./galaxy-reading";
import type { Cosmos } from "../types";

/**
 * 설명과 심화를 여기 적지 않고 가져오는 이유.
 *
 * 오른쪽 읽기 패널의 설명과 3D 무대 1단계의 글은 같은 문장이다. 두 곳에
 * 나눠 적었더니 실제로 어긋났다 — 이 파일이 들고 있던 157자짜리 설명은
 * `cosmos/index.ts` 가 모듈을 읽는 자리에서 모델의 것으로 덮어써 한 번도
 * 화면에 나오지 않았고, 반대로 `descriptionEasy` 는 덮이지 않아 같은 은하에
 * 쉬운 글이 두 벌 생겼다. 무대와 패널이 서로 다른 쉬운 글을 보여 주고
 * 있었다.
 *
 * 그래서 은하의 글은 `galaxy-stages.ts` 한 곳에 두고, 이 파일은 이름·색점·
 * 수치·찾아보기만 맡는다. 가져오는 자리를 눈에 보이게 적어 두면 덮어쓰기
 * 같은 숨은 동작이 필요 없다.
 */
const model = galaxyById["milky-way"];

export const milkyWay: Cosmos = {
  id: "milky-way",
  name: "우리 은하",
  poetic: "우리가 사는 별의 섬",
  kind: "galaxy",
  tint: "#9eb9ff",
  scene: "galaxy",
  galaxyId: "milky-way",
  description: model.detail,
  descriptionEasy: model.easy,
  deepDive: galaxyReading["milky-way"],
  facts: [
    { label: "모양", value: "막대나선은하" },
    { label: "너비", value: "약 10만 광년" },
    { label: "우리의 자리", value: "오리온자리 팔 근처" },
    { label: "중심", value: "궁수자리 A*" },
  ],
  lookUp: "도시 불빛이 적은 곳에서 밤하늘의 뿌연 은하수 띠를 찾아보세요. 그 빛은 우리 은하 안쪽의 수많은 별을 한꺼번에 본 모습입니다.",
};
