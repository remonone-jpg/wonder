import { useCallback, useEffect, useRef, useState } from "react";
import { bodies, type BodyId } from "./data/planets";
import { bodyCopy, CHILD_NAME, ui } from "./data/copy";
import { layers } from "./data/layers";
import type { Layer } from "./data/layers";
import type { SolarViewer } from "./lib/solar-viewer";
import { speak, stopSpeaking } from "./lib/speech";
import "./App.css";

const LANG = "ko-KR";
const withChild = (text: string) => text.replaceAll("{child}", CHILD_NAME);

/** "6371km에서 6336km까지" means nothing to a child; a thickness does. */
function formatDepth(outerKm: number, innerKm: number) {
  const thickness = Math.round(outerKm - innerKm);
  return innerKm === 0 ? `가운데까지 ${thickness.toLocaleString()}km` : `두께 ${thickness.toLocaleString()}km`;
}

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<SolarViewer | null>(null);
  const selectRef = useRef<(id: BodyId) => void>(() => {});

  const [selected, setSelected] = useState<BodyId>("earth");
  const [hovered, setHovered] = useState<BodyId | null>(null);
  const [trueScale, setTrueScale] = useState(false);
  const [loading, setLoading] = useState(true);
  const [layer, setLayer] = useState<Layer | null>(null);

  const copy = bodyCopy[selected];
  const body = bodies.find((b) => b.id === selected)!;

  const select = useCallback((id: BodyId) => {
    setSelected(id);
    viewerRef.current?.setSelected(id);
    viewerRef.current?.frame(id);
    speak(bodyCopy[id].name, LANG);
  }, []);

  useEffect(() => {
    selectRef.current = select;
  }, [select]);

  useEffect(() => {
    let cancelled = false;
    let viewer: SolarViewer | null = null;
    void import("./lib/solar-viewer").then(({ SolarViewer: Viewer }) => {
      if (cancelled || !mountRef.current) return;
      viewer = new Viewer(mountRef.current, {
        // Routed through refs because the viewer captures its callbacks once.
        onPick: (id) => id && selectRef.current(id),
        onHover: setHovered,
        onReady: () => setLoading(false),
        onLayer: (next) => {
          setLayer(next);
          // The name of what has just come into view is the one thing a
          // pre-reader cannot get from the screen on their own.
          if (next) speak(`${next.name}. ${next.blurb}`, LANG);
        },
      });
      viewerRef.current = viewer;
      viewer.setSelected("earth");
      viewer.frame("earth");
    });
    return () => {
      cancelled = true;
      viewerRef.current = null;
      viewer?.dispose();
    };
  }, []);

  // Speech belongs to the browser, not to React.
  useEffect(() => stopSpeaking, []);

  const changeScale = (next: boolean) => {
    setTrueScale(next);
    viewerRef.current?.setTrueScale(next);
    if (next) speak(ui.scaleHint, LANG);
  };

  const readAloud = () => {
    speak(
      [copy.name, withChild(copy.description), withChild(copy.funFact), withChild(copy.lookUp)].join(" "),
      LANG,
    );
  };

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <strong>{ui.title}</strong>
          <em>{ui.tagline}</em>
        </div>
        <div className="scale-toggle" role="group" aria-label={ui.scaleNice}>
          <button className={!trueScale ? "active" : ""} onClick={() => changeScale(false)}>{ui.scaleNice}</button>
          <button className={trueScale ? "active" : ""} onClick={() => changeScale(true)}>{ui.scaleTrue}</button>
        </div>
      </header>

      <div className="workspace">
        <aside className="planet-list" aria-label={ui.hint}>
          {bodies.map((entry) => (
            <button
              key={entry.id}
              className={`planet-item ${selected === entry.id ? "active" : ""}`}
              style={{ "--tint": entry.tint } as React.CSSProperties}
              onClick={() => select(entry.id)}
            >
              <span className="dot" />
              <span>
                <b>{bodyCopy[entry.id].name}</b>
                <small>{bodyCopy[entry.id].poetic}</small>
              </span>
            </button>
          ))}
        </aside>

        <section className="stage">
          <div ref={mountRef} className="stage-mount" />
          <p className="stage-name" aria-live="polite">
            {bodyCopy[hovered ?? selected].name}
          </p>
          <small className="stage-hint">{layer ? ui.zoomHint : ui.hint}</small>
          {layer && (
            <div className="layer-card" style={{ "--layer": layer.color } as React.CSSProperties}>
              <b>{layer.name}</b>
              <p>{layer.blurb}</p>
              <small>{formatDepth(layer.outerKm, layer.innerKm)}</small>
            </div>
          )}
          <small className="stage-credit">{ui.credit}</small>
          {loading && <div className="loader" role="status">우주를 켜는 중이에요…</div>}
          {trueScale && <p className="scale-note">{ui.scaleHint}</p>}
        </section>

        <aside className="info">
          <h1 style={{ color: body.tint }}>{copy.name}</h1>
          <em>{copy.poetic}</em>
          <p className="description">{withChild(copy.description)}</p>

          <button className="listen" onClick={readAloud}>{ui.listen}</button>

          <div className="look-up">
            <b>{ui.lookUpTitle}</b>
            <p>{withChild(copy.lookUp)}</p>
          </div>

          <div className="layer-strip">
            <b>{ui.insideTitle}</b>
            <ol>
              {layers[selected].map((entry) => (
                <li key={entry.id} className={layer?.id === entry.id ? "active" : ""}>
                  <i style={{ background: entry.color }} />
                  {entry.name}
                </li>
              ))}
            </ol>
            <small>{layer ? ui.stretchNote : ui.insideHint}</small>
          </div>

          <dl className="facts">
            <div><dt>{ui.facts.size}</dt><dd>{copy.size}</dd></div>
            <div><dt>{ui.facts.day}</dt><dd>{copy.day}</dd></div>
            <div><dt>{ui.facts.year}</dt><dd>{copy.year}</dd></div>
            <div><dt>{ui.facts.moons}</dt><dd>{body.moons ? `${body.moons}${ui.moonsUnit}` : ui.noMoons}</dd></div>
          </dl>

          <div className="fun">
            <b>{ui.didYouKnow}</b>
            <span>{withChild(copy.funFact)}</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
