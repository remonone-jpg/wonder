import type { Cosmos } from "../types";

/**
 * 임시 연결 항목.
 *
 * 본문 심화 카드와 도해는 콘텐츠 작업에서 채울 예정이고, 지금은 새 3D
 * 무대를 로컬에서 열어 검증할 수 있도록 최소한의 항목만 둔다.
 */
export const bigBang: Cosmos = {
  id: "big-bang",
  name: "우주의 시작",
  poetic: "뜨거운 한때에서 은하 가득한 지금까지",
  kind: "process",
  tint: "#ffb979",
  scene: "big-bang",
  description:
    "우주는 약 138억 년 전 아주 뜨겁고 빽빽한 상태에서 팽창하기 시작했습니다. 첫 원자핵, 빛이 풀려난 순간, 첫 별과 은하가 이어지는 시간을 한 장면씩 따라가 봅니다.",
  descriptionEasy:
    "우주가 뜨거운 점처럼 시작해 별과 은하가 가득한 하늘이 되기까지를 살펴봐요.",
  facts: [
    { label: "우주의 나이", value: "약 138억 년" },
    { label: "빛이 풀린 때", value: "약 38만 년 뒤" },
    { label: "첫 별의 시기", value: "약 2억 년 무렵으로 추정" },
    { label: "우리 태양계", value: "약 46억 년 전 형성" },
  ],
};

