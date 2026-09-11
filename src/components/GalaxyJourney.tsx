import { useEffect, useRef, useState } from "react";
import { cosmos } from "../data/cosmos";
import type { GalaxyId } from "../data/types";
import { galaxyById } from "../lib/galaxy-stages";
import type { GalaxyViewer } from "../lib/galaxy-viewer";

type DebugWindow = Window & { __wonderGalaxyViewer?: GalaxyViewer };

const galaxyEntries = cosmos.filter((entry) => entry.galaxyId);

/** 여러 은하를 같은 조작법으로 비교하는 3D 읽기 무대. */
export function GalaxyJourney({ galaxyId, mode, onModeChange, easy, motion }: {
  galaxyId: GalaxyId;
  mode: number;
  onModeChange: (next: number) => void;
  easy: boolean;
  motion: boolean;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const viewer = useRef<GalaxyViewer | null>(null);
  const initial = useRef({ galaxyId, mode, motion });
  const loadedGalaxy = useRef(galaxyId);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [debug, setDebug] = useState<ReturnType<GalaxyViewer["getDebugInfo"]> | null>(null);
  const model = galaxyById[galaxyId] ?? galaxyById["milky-way"];
  const currentMode = Math.min(3, Math.max(0, Math.round(mode)));
  const view = model.views[currentMode] ?? model.views[0];
  const galaxyNumber = Math.max(1, galaxyEntries.findIndex((entry) => entry.galaxyId === galaxyId) + 1);

  useEffect(() => {
    let cancelled = false;
    let instance: GalaxyViewer | null = null;
    void import("../lib/galaxy-viewer").then(({ GalaxyViewer: Viewer }) => {
      if (cancelled || !mount.current) return;
      const { galaxyId: startGalaxy, mode: startMode, motion: moving } = initial.current;
      instance = new Viewer(mount.current, startGalaxy, startMode, moving);
      viewer.current = instance;
      if (import.meta.env.DEV) (window as DebugWindow).__wonderGalaxyViewer = instance;
      setReady(true);
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => {
      cancelled = true;
      viewer.current = null;
      if (import.meta.env.DEV && (window as DebugWindow).__wonderGalaxyViewer === instance) {
        delete (window as DebugWindow).__wonderGalaxyViewer;
      }
      instance?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (loadedGalaxy.current === galaxyId) return;
    viewer.current?.setGalaxy(galaxyId, currentMode);
    loadedGalaxy.current = galaxyId;
  }, [ready, galaxyId, currentMode]);

  useEffect(() => {
    if (!ready) return;
    viewer.current?.setMotion(motion);
    viewer.current?.setMode(currentMode);
  }, [ready, currentMode, motion]);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setInterval(() => setDebug(viewer.current?.getDebugInfo() ?? null), 800);
    return () => window.clearInterval(timer);
  }, [ready]);

  const move = (next: number) => onModeChange(Math.min(3, Math.max(0, next)));

  return (
    <div className="star-journey galaxy-journey" style={{ "--stage-color": model.color } as React.CSSProperties}>
      <div className="journey-heading">
        <div>
          <span className="eyebrow">은하 비교 <span aria-hidden="true">/</span> {String(galaxyNumber).padStart(2, "0")}</span>
          <h2>{model.name}</h2>
          <p>{model.type} · {model.distance}</p>
        </div>
        <div className="scene-toolbar">
          <span className="scene-badge">파티클로 그린 은하</span>
          <button aria-label="은하 전체 모습으로 돌아가기" onClick={() => viewer.current?.resetView()}>전체 모습</button>
        </div>
      </div>

      <div className="journey-view galaxy-view">
        <div ref={mount} className="star-mount" />
        {!ready && <div className="loader" role="status">{failed ? "이 기기에서 은하 모형을 열지 못했어요. 아래 설명으로 함께 살펴봐요." : "은하를 펼치는 중이에요…"}</div>}
        <div className="observation"><span>여기를 보세요</span><p>{view.observe}</p></div>
      </div>

      <div className="journey-console galaxy-console">
        <div className="journey-question" aria-live="polite" aria-atomic="true">
          <h3>{view.name} — {view.note}</h3>
          <p>{easy ? view.easy : view.detail}</p>
        </div>
        <div className="star-row">
          <button aria-label="앞 장면" disabled={currentMode === 0} onClick={() => move(currentMode - 1)}>‹</button>
          <input type="range" min={0} max={3} step={1} value={currentMode} aria-label={`${model.name} 관찰 장면`} aria-valuetext={`${view.name}, ${currentMode + 1}번째 장면`} onChange={(event) => move(Number(event.target.value))} />
          <button aria-label="다음 장면" disabled={currentMode === model.views.length - 1} onClick={() => move(currentMode + 1)}>›</button>
        </div>
        <ol className="journey-timeline galaxy-timeline" aria-label={`${model.name} 관찰 장면 지도`}>
          {model.views.map((item, index) => (
            <li key={item.id}>
              <button aria-current={index === currentMode ? "step" : undefined} className={index === currentMode ? "current" : index < currentMode ? "visited" : ""} onClick={() => move(index)}>
                <span className="timeline-stop">{String(index + 1).padStart(2, "0")}</span>
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="model-note">은하의 모양·색·크기·제트는 실제 자료를 바탕으로 한 교육용 파티클 모형이에요. 점 하나가 별 하나를 뜻하지는 않아요.</p>
        {debug && <p className="cosmos-debug" aria-label="렌더링 상태">모형 상태 · 파티클 {debug.particles.toLocaleString()}개 · {Math.round(debug.fps)}fps{debug.lowPower ? " · 절전 모드" : ""}</p>}
      </div>
    </div>
  );
}
