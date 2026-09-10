import type { BodyId, DeepDive } from "../types";
import { earth } from "./earth";
import { jupiter } from "./jupiter";
import { saturn } from "./saturn";

/**
 * The layer under the panel copy: twenty angles on one body, folded away
 * until asked for.
 *
 * One file per body. This was a single file until three bodies took it past
 * 490 lines, and nine are planned — the whole of it would have run to some
 * 1,900, which is nobody's idea of a place to go looking for one paragraph.
 * Splitting cost nothing at the call site: `copy.ts` still writes
 * `deepDive.earth`, because a directory with an `index.ts` answers to the
 * same path the file did.
 *
 * `Partial` because these are written a body at a time. Earth, Jupiter and
 * Saturn are written; the six others carry no entry at all rather than an
 * empty array — a body with nothing written shows nothing, which is what
 * `deepDive?` on `BodyCopy` is for. They are kept in the order the bodies
 * themselves run, outward from the Sun.
 *
 * To add one: write `<body>.ts` beside this file, exporting a `DeepDive[]`
 * under the body's own name, then import it above and name it below. Nothing
 * else moves — `copy.ts` reaches it by name, and the panel lays the entries
 * out from `GROUPS` in `components/DeepDive.tsx`, which is where a new
 * *category* goes instead.
 *
 * The full reading is written to be worth a grown-up's time; `bodyEasy` says
 * the same thing to a five-year-old rather than saying less of it. Where the
 * panel copy already covers a fact, these come at it from the side the short
 * lines had no room for — the panel says Jupiter has no ground to stand on,
 * and `structure` there asks where the planet is agreed to begin.
 */
export const deepDive: Partial<Record<BodyId, DeepDive[]>> = {
  earth,
  jupiter,
  saturn,
};
