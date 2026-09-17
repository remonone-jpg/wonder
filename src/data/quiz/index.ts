/**
 * 주제별 문항을 한 표로 모은다.
 *
 * 파일을 주제마다 가른 이유는 길이다. 한 주제가 스무 문항이고 문항마다
 * 질문·보기·해설이 붙으니, 한 파일에 몰면 천 줄을 훌쩍 넘어 한 천체를
 * 고치러 들어갈 때마다 나머지 전부를 스크롤하게 된다. `deep-dive/` 와
 * `cosmos/` 가 이미 같은 방식으로 나뉘어 있다.
 *
 * 키는 1층 `BodyId` 와 2층 `CosmosId` 를 한 공간에서 쓴다. 화면이
 * `cosmos?.id ?? selected` 하나로 넘겨 주기 때문이다.
 */
import type { Question } from "./types";
import { sun } from "./sun";
import { mercury } from "./mercury";
import { venus } from "./venus";
import { earth } from "./earth";
import { mars } from "./mars";
import { jupiter } from "./jupiter";

export const questions: Record<string, Question[]> = {
  sun,
  mercury,
  venus,
  earth,
  mars,
  jupiter,
};
