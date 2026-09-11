/**
 * 별의 일생 다섯 단계 — 무대가 그리는 값이자 손잡이가 읽는 이름.
 *
 * 뷰어가 아니라 여기 있는 이유는 코드 분할이다. `star-viewer.ts` 는
 * three.js 를 끌고 오는 무거운 모듈이라 동적으로만 불러야 하는데, 화면이
 * 단계 이름을 그리려고 그 파일에서 상수를 정적으로 가져가는 순간 번들러가
 * 분할을 포기한다 — 실제로 그렇게 했더니 메인 번들이 291 KB 에서 866 KB 로
 * 뛰고 뷰어 청크가 3.78 KB 로 쪼그라들었다. three.js 가 통째로 첫 화면에
 * 실려 온 것이다.
 *
 * 그래서 이 파일은 three.js 를 쓰지 않는다. 화면은 여기서 이름을 읽고,
 * 뷰어는 여기서 숫자를 읽는다.
 */

export type StarStage = {
  name: string;
  /** 화면상의 반지름. 장면 단위. */
  size: number;
  color: string;
  /** 스스로 내는 빛의 세기. 블룸이 이 값을 타고 번진다. */
  glow: number;
  note: string;
};

/**
 * 크기는 실제 비율이 아니라 **압축한 비율**이다. 적색거성은 주계열성의
 * 100배쯤 되는데 그대로 놓으면 화면에 안 들어가고, 백색왜성은 100분의 1이
 * 아니라 100만분의 1이라 점조차 안 보인다. 12배와 0.12배는 한 화면에서
 * 셋을 다 볼 수 있는 가장 큰 비율이다. 실제 숫자는 심화 글이 말한다.
 */
export const STAR_STAGES: StarStage[] = [
  { name: "성운", size: 8.0, color: "#6b5b8a", glow: 0.1, note: "먼지구름" },
  { name: "원시별", size: 0.6, color: "#ffb060", glow: 0.8, note: "뭉치는 중" },
  { name: "주계열성", size: 1.0, color: "#fff4d0", glow: 1.2, note: "지금의 태양" },
  { name: "적색거성", size: 12.0, color: "#ff6b3d", glow: 1.6, note: "100배로 부푼다" },
  { name: "백색왜성", size: 0.12, color: "#cfe4ff", glow: 2.4, note: "지구만 한 크기" },
];

/** 0~1 을 단계 사이의 자리로 옮긴다. */
export function stageAt(progress: number) {
  const clamped = Math.min(1, Math.max(0, progress));
  const pos = clamped * (STAR_STAGES.length - 1);
  const index = Math.min(Math.floor(pos), STAR_STAGES.length - 2);
  return { index, fraction: pos - index, nearest: STAR_STAGES[Math.round(pos)] };
}
