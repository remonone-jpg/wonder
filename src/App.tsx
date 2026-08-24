import { useCallback, useEffect, useRef, useState } from "react";
import { bodies, type BodyId } from "./data/planets";
import { bodyCopy, CHILD_NAME, ui } from "./data/copy";
import type { SolarViewer } from "./lib/solar-viewer";
import { speak, stopSpeaking } from "./lib/speech";
import "./App.css";

const LANG = "ko-KR";
const withChild = (text: string) => text.replaceAll("{child}", CHILD_NAME);

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<SolarViewer | null>(null);
  const selectRef = useRef<(id: BodyId) => void>(() => {});

  const [selected, setSelected] = useState<BodyId>("earth");
  const [hovered, setHovered] = useState<BodyId | null>(null);
  const [trueScale, setTrueScale] = useState(false);
  const [loading, setLoading] = useState(true);

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
          <small className="stage-hint">{ui.hint}</small>
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
