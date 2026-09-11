import type { Cosmos } from "../types";
import { starLife } from "./star-life";
import { bigBang } from "./big-bang";

/**
 * 태양계 밖 — 별과 은하와 블랙홀과 우주의 시작.
 *
 * `planets.ts` 와 갈라 둔 이유는 아홉 천체와 성격이 다르기 때문이 아니라,
 * `Body` 타입이 요구하는 것을 이쪽이 하나도 갖지 못하기 때문이다. 블랙홀에는
 * 궤도(`orbitAu`)가 없고, 은하에는 하루(`dayHours`)가 없고, 별의 일생은
 * 애초에 천체가 아니라 시간축을 가진 과정이라 반지름을 물을 대상이 없다.
 * 억지로 0을 넣으면 3D 무대가 그것을 태양 자리에 겹쳐 놓고, 은하 반지름을
 * 넣으면 지구 반지름 단위로 환산하는 장면 전체가 무너진다.
 *
 * 그래서 `BodyId` 를 넓히지 않았다. 아홉 개짜리 그 유니온은 "3D 무대에
 * 구체로 떠 있는 것"이라는 뜻을 이미 지고 있어서, 은하를 거기 넣으면
 * 이름이 거짓말이 된다. 두 층은 id 체계도 타입도 따로 간다.
 *
 * 항목을 더하려면 `<id>.ts` 를 이 옆에 만들어 `Cosmos` 하나를 그 이름으로
 * export 하고, 여기에 import 해서 배열에 넣는다. `deep-dive/` 와 같은
 * 수순이다. 순서는 가까운 것에서 먼 것으로 — 별, 우리 은하, 다른 은하,
 * 그리고 우주 전체.
 *
 * 화면은 이 배열을 읽어 목록과 오른쪽 읽기 패널을 만든다. 각 항목의
 * 무거운 3D 무대만 `scene` 값에 따라 동적으로 가져온다.
 */
export const cosmos: Cosmos[] = [starLife, bigBang];

/** 이름으로 하나 꺼내기. 화면이 붙을 때 `planets.ts` 의 `byId` 자리를 맡는다. */
export const cosmosById = Object.fromEntries(cosmos.map((c) => [c.id, c])) as Record<string, Cosmos>;
