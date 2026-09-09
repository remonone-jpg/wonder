import { useState } from "react";
import type { DeepDive as DeepDiveEntry, DeepDiveCategory } from "../data/types";

/**
 * Fourteen headings in one column is a scroll, not a menu. Grouped, the panel
 * opens as four choices and the reader picks a direction first.
 *
 * The groups run outward: what the thing is, how it moves, whether anyone has
 * been, and what people have come to say about it. A body carrying fewer
 * categories simply shows fewer rows — and a group with nothing in it does not
 * appear at all.
 */
const GROUPS: { title: string; categories: DeepDiveCategory[] }[] = [
  { title: "무엇인가", categories: ["structure", "numbers", "weather"] },
  { title: "어떻게 도나", categories: ["mechanism", "scale", "moons", "origin"] },
  { title: "가 봤나요", categories: ["visit", "research", "see"] },
  { title: "사람들이 아는 것", categories: ["history", "etymology", "culture", "myths"] },
];

/** The chip in front of each heading — what angle this entry takes. */
const META: Record<DeepDiveCategory, string> = {
  structure: "구조",
  numbers: "숫자로 보면",
  weather: "날씨",
  mechanism: "작동 원리",
  scale: "얼마나 먼가",
  moons: "달들",
  origin: "태어난 이야기",
  visit: "가 본 것들",
  research: "지금 연구 중",
  see: "찾아보기",
  history: "발견의 역사",
  etymology: "이름의 유래",
  culture: "말 속의 흔적",
  myths: "오해와 진실",
};

/**
 * The deep layer, folded away until asked for.
 *
 * Fourteen paragraphs shown at once read as one wall and get skipped; behind
 * headings they read as fourteen things you can choose between. Closed by
 * default so the panel above it stays the main thing.
 */
export function DeepDive({
  entries,
  easy,
}: {
  entries: DeepDiveEntry[];
  /** The easy reading. Falls back per entry where no plain version exists. */
  easy?: boolean;
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openEntry, setOpenEntry] = useState<string | null>(null);

  const byCategory = new Map(entries.map((e) => [e.category, e]));
  // Groups with nothing behind them are dropped, so a body carrying only some
  // categories never shows an empty heading.
  const groups = GROUPS
    .map((g) => ({
      title: g.title,
      items: g.categories.map((c) => byCategory.get(c)).filter(Boolean) as DeepDiveEntry[],
    }))
    .filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  // No heading of its own: the tab above already says "더 깊이", and a title
  // here would say it twice. `aria-label` keeps the section named for a screen
  // reader, which has no tab to have read a moment ago.
  return (
    <section className="deep-dive" aria-label="더 깊이 보기">
      {groups.map((group) => {
        const groupOpen = openGroup === group.title;
        return (
          <div key={group.title} className={`deep-dive-group ${groupOpen ? "open" : ""}`}>
            <h3>
              <button
                type="button"
                aria-expanded={groupOpen}
                onClick={() => {
                  setOpenGroup(groupOpen ? null : group.title);
                  setOpenEntry(null);
                }}
              >
                <span className="deep-dive-group-title">{group.title}</span>
                <span className="deep-dive-count">{group.items.length}</span>
                <i className="deep-dive-chevron" aria-hidden />
              </button>
            </h3>

            {groupOpen && (
              <div className="deep-dive-items">
                {group.items.map((entry) => {
                  // `entry.title` stays the identity — the key and the
                  // open-state marker. Only what is drawn switches wording.
                  const isOpen = openEntry === entry.title;
                  const heading = easy && entry.titleEasy ? entry.titleEasy : entry.title;
                  const passage = easy && entry.bodyEasy ? entry.bodyEasy : entry.body;
                  return (
                    <article key={entry.title} className={isOpen ? "open" : ""}>
                      <h4>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenEntry(isOpen ? null : entry.title)}
                        >
                          <span className="deep-dive-label">{META[entry.category]}</span>
                          <span className="deep-dive-title">{heading}</span>
                          <i className="deep-dive-chevron" aria-hidden />
                        </button>
                      </h4>
                      {isOpen && (
                        <div className="deep-dive-body">
                          <p>{passage}</p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
