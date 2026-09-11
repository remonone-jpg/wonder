import { useEffect, useRef, useState } from "react";
import { cosmosStages, progressOf, stageAt } from "../lib/cosmos-stages";
import type { CosmosViewer } from "../lib/cosmos-viewer";

type DebugWindow = Window & { __wonderCosmosViewer?: CosmosViewer };

/** 우주의 시작 단계와 3D 무대를 한 화면에 묶는다. */
export function CosmosJourney({ at, onChange, easy, motion }: {
  at: number;
  onChange: (next: number) => void;
  easy: boolean;
  motion: boolean;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const viewer = useRef<CosmosViewer | null>(null);
  const initial = useRef({ at, motion });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [debug, setDebug] = useState<ReturnType<CosmosViewer["getDebugInfo"]> | null>(null);
  const { nearest } = stageAt(at);
  const index = cosmosStages.indexOf(nearest);

  useEffect(() => {
    let cancelled = false;
    let instance: CosmosViewer | null = null;
    void import("../lib/cosmos-viewer").then(({ CosmosViewer: Viewer }) => {
      if (cancelled || !mount.current) return;
      const { at: start, motion: moving } = initial.current;
      instance = new Viewer(mount.current, start, moving);
      viewer.current = instance;
      if (import.meta.env.DEV) (window as DebugWindow).__wonderCosmosViewer = instance;
      setReady(true);
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => {
      cancelled = true;
      viewer.current = null;
      if (import.meta.env.DEV && (window as DebugWindow).__wonderCosmosViewer === instance) {
        delete (window as DebugWindow).__wonderCosmosViewer;
      }
      instance?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    viewer.current?.setMotion(motion);
    viewer.current?.setStage(at);
  }, [ready, at, motion]);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setInterval(() => setDebug(viewer.current?.getDebugInfo() ?? null), 800);
    return () => window.clearInterval(timer);
  }, [ready]);

  const move = (next: number) => onChange(Math.min(1, Math.max(0, next)));

  return (
    <div className="star-journey cosmos-journey" style={{ "--stage-color": nearest.color } as React.CSSProperties}>
      <div className="journey-heading">
        <div>
          <span className="eyebrow">우주의 시작 <span aria-hidden="true">/</span> {String(index + 1).padStart(2, "0")}</span>
          <h2>{nearest.name}</h2>
          <p>{nearest.note}</p>
        </div>
        <div className="scene-toolbar">
          <span className="scene-badge">138억 년 시간 여행</span>
          <button aria-label="우주 전체 모습으로 돌아가기" onClick={() => viewer.current?.resetView()}>전체 모습</button>
        </div>
      </div>

      <div className="journey-view cosmos-view">
        <div ref={mount} className="star-mount" />
        {!ready && <div className="loader" role="status">{failed ? "이 기기에서 우주 모형을 열지 못했어요. 아래 단계와 설명으로 함께 살펴봐요." : "우주의 시간을 펼치는 중이에요…"}</div>}
        <div className="observation"><span>여기를 보세요</span><p>{nearest.observe}</p></div>
        {nearest.id === "big-bang" && motion && ready && <button className="burst-replay" onClick={() => viewer.current?.replayBigBang()}>섬광 다시 보기</button>}
      </div>

      <div className="journey-console cosmos-console">
        <div className="journey-question" aria-live="polite" aria-atomic="true">
          <h3>{nearest.ageLabel} — {nearest.note}</h3>
          <p>{easy ? nearest.easy : nearest.detail}</p>
        </div>
        {nearest.caveat && <p className="cosmos-caveat">참고 · {nearest.caveat}</p>}
        <div className="star-row">
          <button aria-label="앞 단계" disabled={index === 0} onClick={() => move(progressOf(index - 1))}>‹</button>
          <input type="range" min={0} max={1} step={0.005} value={at} aria-label="우주의 시작 단계" aria-valuetext={`${nearest.name}, ${index + 1}번째 단계`} onChange={(event) => move(Number(event.target.value))} />
          <button aria-label="다음 단계" disabled={index === cosmosStages.length - 1} onClick={() => move(progressOf(index + 1))}>›</button>
        </div>
        <ol className="journey-timeline cosmos-timeline" aria-label="우주의 시작 단계 지도">
          {cosmosStages.map((stage, i) => (
            <li key={stage.id}>
              <button aria-current={i === index ? "step" : undefined} className={i === index ? "current" : i < index ? "visited" : ""} onClick={() => move(progressOf(i))}>
                <span className="timeline-stop">{String(i + 1).padStart(2, "0")}</span>
                <span>{stage.name}</span>
                <small>{stage.ageLabel}</small>
              </button>
            </li>
          ))}
        </ol>
        <p className="model-note">시간 간격은 앞의 장면이 사라지지 않도록 교육용으로 넓혀 배치했어요. 빛의 색과 안개는 실제 관측을 바탕으로 만든 시각 모형입니다.</p>
        {debug && <p className="cosmos-debug" aria-label="렌더링 상태">모형 상태 · 파티클 {debug.particles.toLocaleString()}개 · 광자 {debug.photons.toLocaleString()}개 · {Math.round(debug.fps)}fps</p>}
      </div>
    </div>
  );
}
