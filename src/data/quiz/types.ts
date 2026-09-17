/**
 * 문제 한 문항의 모양과, 문항을 묶음으로 짓는 도구.
 *
 * 타입이 `learning.ts` 가 아니라 여기 있는 이유는 순환 참조 때문이다.
 * `learning.ts` 가 `quiz/index.ts` 에서 `questions` 를 가져오는데, 문항
 * 파일들이 다시 `learning.ts` 에서 타입을 가져오면 서로를 부른다. 타입만
 * 이쪽으로 내리고 `learning.ts` 가 그대로 다시 export 하면, 밖에서 보기에
 * `learning.ts` 의 API 는 한 글자도 바뀌지 않는다.
 */

export type Question = {
  ask: string;
  /** 두 개에서 네 개. 길어지면 보기를 쪼개 개수를 늘린다. */
  choices: string[];
  /** `choices` 의 인덱스. */
  answer: number;
  /** 왜 맞는지와, 왜 다른 보기가 아닌지. 두세 문장. */
  why: string;
  /**
   * 어느 묶음의 문제인지. 화면은 이 이름으로 묶음 고르기를 만든다.
   *
   * 선택 필드인 것은 호환을 위해서다. 묶음이 없는 문항만 있는 주제는
   * 묶음 고르기 없이 한 벌로 푼다 — 예전 데이터도 그대로 돈다.
   */
  group?: string;
};

/** 1층 아홉 천체의 묶음. 심화 패널의 네 묶음과 이름이 같다. */
export const PLANET_SETS = ["무엇인가", "어떻게 도나", "가 봤나요", "사람들이 아는 것"] as const;

/**
 * 2층 열네 항목의 묶음.
 *
 * 심화 패널은 넷으로 나누지만(무엇인가·어떻게 되나·어떻게 알았나·우리와의
 * 관계) 문제는 둘로 묶는다. 항목당 열 문항이라 넷으로 쪼개면 묶음 하나가
 * 두세 문항이 되어 고르는 값이 없어진다. 앞의 둘과 뒤의 둘을 각각 합쳤다.
 */
export const COSMOS_SETS = ["무엇인가", "어떻게 알았나"] as const;

type Row = [ask: string, choices: string[], answer: number, why: string];

/** 한 묶음의 문항들을 한 번에 짓는다. 묶음 이름을 줄마다 되풀이하지 않으려고. */
export const set = (group: string, rows: Row[]): Question[] =>
  rows.map(([ask, choices, answer, why]) => ({ ask, choices, answer, why, group }));
