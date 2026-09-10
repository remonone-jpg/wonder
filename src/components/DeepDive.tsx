import { useState } from "react";
import type { DeepDive as DeepDiveEntry, DeepDiveMedia } from "../data/types";
import type { DeepDiveGroups } from "./deep-dive-groups";
import { asset } from "../lib/asset";

/**
 * The figure's slot, in CSS pixels, matching the box `.deep-dive-figure img`
 * draws in a 420px panel — a little narrower in practice when the panel is
 * showing a scrollbar, which costs nothing here because the CSS width is a
 * percentage. The width is what the panel leaves after its own padding, the
 * group rule and the body indent: 420 − 40 − 18 − 10.
 *
 * These are written on the `<img>` so the space is reserved before the file
 * arrives — an entry opens and the passage must not jump. They are the slot's
 * size rather than any particular picture's: the type carries no dimensions,
 * and the CSS pins the height and letterboxes with `object-fit: contain`, so
 * one pair of numbers holds for every image whatever shape it is.
 */
const FIGURE_W = 352;
const FIGURE_H = 260;

/**
 * The picture or clip belonging to one entry.
 *
 * A clip plays by itself, muted, on a loop, with no controls: a five-year-old
 * should not have to find a play button, and there is no sound to miss —
 * `muted` is what makes autoplay allowed at all, and these sources are frame
 * sequences with no audio track to begin with. `playsInline` stops iOS taking
 * the clip fullscreen. `<video>` has no `alt`, so the same words go on
 * `aria-label`.
 *
 * An animated GIF is a `kind: "image"` — `<img>` plays it on its own.
 */
function Figure({ media }: { media: DeepDiveMedia }) {
  return (
    <figure className="deep-dive-figure">
      {media.kind === "video" ? (
        <video
          src={asset(media.src)}
          poster={media.poster ? asset(media.poster) : undefined}
          aria-label={media.alt}
          width={FIGURE_W}
          height={FIGURE_H}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img
          src={asset(media.src)}
          alt={media.alt}
          width={FIGURE_W}
          height={FIGURE_H}
          loading="lazy"
          decoding="async"
        />
      )}
      {media.caption && <figcaption>{media.caption}</figcaption>}
    </figure>
  );
}

/**
 * The deep layer, folded away until asked for.
 *
 * Twenty paragraphs shown at once read as one wall and get skipped; behind
 * headings they read as twenty things you can choose between. Closed by
 * default so the panel above it stays the main thing.
 */
export function DeepDive<C extends string>({
  entries,
  groups: layout,
  meta,
  easy,
}: {
  entries: DeepDiveEntry<C>[];
  /**
   * 묶음과 칩 이름을 밖에서 받는다. 아코디언이 하는 일은 두 층이 똑같고
   * 다른 것은 이 표 둘뿐이라, 컴포넌트를 하나 더 만드는 것보다 싸다.
   * 층이 셋이 되어도 여기는 안 바뀐다.
   */
  groups: DeepDiveGroups<C>;
  meta: Record<C, string>;
  /** The easy reading. Falls back per entry where no plain version exists. */
  easy?: boolean;
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openEntry, setOpenEntry] = useState<string | null>(null);

  const byCategory = new Map(entries.map((e) => [e.category, e]));
  // Groups with nothing behind them are dropped, so a body carrying only some
  // categories never shows an empty heading.
  const groups = layout
    .map((g) => ({
      title: g.title,
      items: g.categories.map((c) => byCategory.get(c)).filter(Boolean) as DeepDiveEntry<C>[],
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
                          <span className="deep-dive-label">{meta[entry.category]}</span>
                          <span className="deep-dive-title">{heading}</span>
                          <i className="deep-dive-chevron" aria-hidden />
                        </button>
                      </h4>
                      {isOpen && (
                        <div className="deep-dive-body">
                          {/* Above the passage, not under it: the longest entry
                              runs eleven lines in this panel, and a picture
                              below that is a picture nobody scrolls to. Inside
                              the open branch, so a closed entry has no <img> in
                              the document and fetches nothing. */}
                          {entry.media && <Figure media={entry.media} />}
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
