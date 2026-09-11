import { useEffect, useRef, useState } from "react";
import { starGuide } from "../data/star-guide";
import { FORK_AT, progressOf, stageAt, starStages, type StarPath, type StarRemnant } from "../lib/star-stages";
import type { StarViewer } from "../lib/star-viewer";

export type Journey = { path: StarPath | null; at: number; remnant: StarRemnant };

export function StarJourney({ value, onChange, easy, motion }: {
  value: Journey;
  onChange: (next: Journey) => void;
  easy: boolean;
  motion: boolean;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const viewer = useRef<StarViewer | null>(null);
  const initial = useRef({ value, motion });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const { path, at, remnant } = value;
  const stages = starStages(path, remnant);
  const { nearest } = stageAt(at, stages);
  const index = stages.indexOf(nearest);
  const guide = starGuide[nearest.name];
  const atFork = index >= FORK_AT;

  useEffect(() => {
    let cancelled = false;
    let instance: StarViewer | null = null;
    void import("../lib/star-viewer").then(({ StarViewer }) => {
      if (cancelled || !mount.current) return;
      const { value: start, motion: moving } = initial.current;
      instance = new StarViewer(mount.current, start.path, start.at, start.remnant, moving);
      viewer.current = instance;
      setReady(true);
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => {
      cancelled = true;
      viewer.current = null;
      instance?.dispose();
    };
  }, []);

  // ready covers controls used while the dynamic import is still loading.
  useEffect(() => {
    if (!ready) return;
    viewer.current?.setMotion(motion);
    viewer.current?.setStage(path, at, remnant);
  }, [ready, path, at, remnant, motion]);

  const move = (next: number) => onChange({ ...value, at: Math.min(1, Math.max(0, next)) });
  const choosePath = (next: StarPath) => onChange({
    ...value, path: next,
    at: progressOf(Math.max(index, FORK_AT), starStages(next, remnant)),
  });

  return (
    <div className="star-journey" style={{ "--stage-color": nearest.lens ? "#a8bdff" : nearest.color } as React.CSSProperties}>
      <div className="journey-heading">
        <div><span className="eyebrow">별의 일생 <span aria-hidden="true">/</span> {String(index + 1).padStart(2, "0")}</span>
          <h2>{nearest.name}</h2><p>{nearest.note}</p>
        </div>
        <div className="scene-toolbar"><span className="scene-badge">움직이는 우주 모형</span>
          <button aria-label="별 전체 모습 보기" onClick={() => viewer.current?.resetView()}>전체 모습</button>
        </div>
      </div>
      <div className="journey-view">
        <div ref={mount} className="star-mount" />
        {!ready && <div className="loader" role="status">{failed ? "이 기기에서 우주 모형을 열지 못했어요. 아래 단계와 설명으로 함께 살펴봐요." : "별빛을 모으고 있어요…"}</div>}
        <div className="observation"><span>여기를 보세요</span><p>{guide.observe}</p></div>
        {nearest.burst && motion && ready && <button className="burst-replay" onClick={() => viewer.current?.replayBurst()}>폭발 다시 보기</button>}
      </div>
      <div className="journey-console">
        <div className="journey-question" aria-live="polite" aria-atomic="true"><h3>{guide.question}</h3><p>{easy ? guide.easy : guide.detail}</p></div>
        {atFork && <div className="journey-choices">
          <div className="star-fork" role="group" aria-label="별의 질량에 따른 길">
            <button aria-pressed={path === "light"} className={path === "light" ? "active" : ""} onClick={() => choosePath("light")}>태양 같은 별<span>조용히 남는 중심</span></button>
            <button aria-pressed={path === "heavy"} className={path === "heavy" ? "active" : ""} onClick={() => choosePath("heavy")}>훨씬 무거운 별<span>폭발 뒤의 두 결말</span></button>
          </div>
          {path === "heavy" && index >= 4 && <div className="remnant-choice" role="group" aria-label="초신성 뒤의 서로 다른 결말">
            <span>어떤 중심이 남을까요?</span>
            <button aria-pressed={remnant === "neutron"} onClick={() => onChange({ ...value, remnant: "neutron", at: 1 })}>중성자별</button>
            <span aria-hidden="true">또는</span>
            <button aria-pressed={remnant === "blackhole"} onClick={() => onChange({ ...value, remnant: "blackhole", at: 1 })}>블랙홀</button>
          </div>}
        </div>}
        <div className="star-row">
          <button aria-label="앞 단계" disabled={index === 0} onClick={() => move(progressOf(index - 1, stages))}>‹</button>
          <input type="range" min={0} max={1} step={0.005} value={at} aria-label="별의 일생" aria-valuetext={`${nearest.name}, ${index + 1}번째 단계`} onChange={(event) => move(Number(event.target.value))} />
          <button aria-label="다음 단계" disabled={index === stages.length - 1} onClick={() => move(progressOf(index + 1, stages))}>›</button>
        </div>
        <ol className="journey-timeline" aria-label="별의 일생 단계 지도">
          {stages.map((stage, i) => <li key={stage.name}><button aria-current={i === index ? "step" : undefined} className={i === index ? "current" : i < index ? "visited" : ""} onClick={() => move(progressOf(i, stages))}><span className="timeline-stop">{String(i + 1).padStart(2, "0")}</span><span>{stage.name}</span></button></li>)}
        </ol>
        {!path && atFork && <p className="fork-hint">여기서 길이 갈려요. 위에서 별을 골라 다음 이야기를 열어보세요.</p>}
        <p className="model-note">크기·거리·색·시간은 이해를 돕도록 조정했어요. 단계마다 확대 배율이 달라요.</p>
      </div>
    </div>
  );
}
