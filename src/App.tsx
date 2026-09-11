import { useCallback, useEffect, useRef, useState } from "react";
import { bodies } from "./data/planets";
import { bodyCopy } from "./data/copy";
import { cosmos as cosmosList } from "./data/cosmos";
import { ui } from "./data/ui";
import type { BodyId, CosmosId } from "./data/types";
import { CHILD_NAME } from "./lib/child-name";
import { asset } from "./lib/asset";
import type { SolarViewer } from "./lib/solar-viewer";
import { StarJourney, type Journey } from "./components/StarJourney";
import { CosmosJourney } from "./components/CosmosJourney";
import { DeepDive } from "./components/DeepDive";
import { COSMOS_GROUPS, COSMOS_META, PLANET_GROUPS, PLANET_META } from "./components/deep-dive-groups";
import "./App.css";

const withChild = (text: string) => text.replaceAll("{child}", CHILD_NAME);

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<SolarViewer | null>(null);
  const selectRef = useRef<(id: BodyId) => void>(() => {});

  const [selected, setSelected] = useState<BodyId>("earth");
  /**
   * 태양계 밖에서 무엇을 보고 있는가. `null` 이면 1층이다.
   *
   * 층을 가리키는 깃발을 따로 두지 않았다. 2층 대상이 골라졌는지가 곧
   * 층이라, 깃발을 두면 선택을 지우는 자리마다 깃발도 함께 지워야 하고
   * 하나를 잊으면 어긋난다. anatomy 가 systemId 로 층을 가르는 것과 같다.
   */
  const [cosmosId, setCosmosId] = useState<CosmosId | null>(null);
  // Which face of the reading panel is showing. Reset on every pick: a body
  // with nothing written has no deep face to land on.
  const [panelTab, setPanelTab] = useState<"basic" | "deep">("basic");
  const [hovered, setHovered] = useState<BodyId | null>(null);
  const [trueScale, setTrueScale] = useState(false);
  const [loading, setLoading] = useState(true);
  const [journey, setJourney] = useState<Journey>({ path: null, at: 0, remnant: "neutron" });
  const [cosmosAt, setCosmosAt] = useState(0);
  const [easy, setEasy] = useState(true);
  const [motion, setMotion] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [viewerFailed, setViewerFailed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotion(!preference.matches);
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  const cosmos = cosmosId ? cosmosList.find((c) => c.id === cosmosId) ?? null : null;
  const copy = bodyCopy[selected];
  const body = bodies.find((b) => b.id === selected)!;

  const select = useCallback((id: BodyId) => {
    setSelected(id);
    setPanelTab("basic");
  }, []);

  useEffect(() => {
    selectRef.current = select;
  }, [select]);

  /**
   * 3D 는 1층에서만 산다.
   *
   * `cosmos` 를 의존성에 두는 것이 요점이다. 2층으로 가면 정리 함수가 돌아
   * `dispose()` 가 불리고, 돌아오면 다시 만들어진다. 의존성이 비어 있으면
   * 마운트 지점이 화면에서 사라져도 뷰어는 살아 있어, WebGL 컨텍스트와
   * 텍스처 6 MB 를 2층 내내 붙들고 있게 된다.
   */
  useEffect(() => {
    if (cosmos) return;
    let cancelled = false;
    let viewer: SolarViewer | null = null;
    setLoading(true);
    setViewerFailed(false);
    void import("./lib/solar-viewer").then(({ SolarViewer: Viewer }) => {
      if (cancelled || !mountRef.current) return;
      viewer = new Viewer(mountRef.current, {
        // Routed through refs because the viewer captures its callbacks once.
        onPick: (id) => id && selectRef.current(id),
        onHover: setHovered,
        onReady: () => setLoading(false),
      });
      viewerRef.current = viewer;
      viewer.setTrueScale(trueScale);
      viewer.setSelected(selected);
      viewer.frame(selected);
    }).catch(() => { if (!cancelled) { setViewerFailed(true); setLoading(false); } });
    return () => {
      cancelled = true;
      viewerRef.current = null;
      viewer?.dispose();
    };
    // `selected` 는 첫 조준에만 쓰이고, 그 뒤의 선택은 select() 가 뷰어에
    // 직접 알린다. 의존성에 넣으면 행성을 고를 때마다 3D 를 다시 만든다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cosmos]);

  useEffect(() => {
    viewerRef.current?.setMotion(motion);
  }, [motion, loading, cosmos]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.setTrueScale(trueScale);
    viewer.setSelected(selected);
    viewer.frame(selected);
  }, [selected, trueScale, loading, cosmos]);

  const changeScale = (next: boolean) => {
    setTrueScale(next);
  };

  /** 층을 옮긴다. 상대편 선택은 그 자리에서 지운다. */
  const goSolar = () => {
    setCosmosId(null);
    setHovered(null);
    setPanelTab("basic");
  };
  const goCosmos = () => {
    setCosmosId(cosmosId ?? cosmosList[0]?.id ?? null);
    setPanelTab("basic");
  };

  // 패널의 네 줄 수치. 행성은 고정 넷, 태양계 밖은 항목이 들고 있는 목록.
  const factRows = cosmos
    ? cosmos.facts
    : [
        { label: ui.facts.size, value: copy.size },
        { label: ui.facts.day, value: copy.day },
        { label: ui.facts.year, value: copy.year },
        { label: ui.facts.moons, value: body.moons ? `${body.moons}${ui.moonsUnit}` : ui.noMoons },
      ];

  const deep = cosmos ? cosmos.deepDive : copy.deepDive;
  const lookUp = cosmos ? cosmos.lookUp : copy.lookUp;

  return (
    <main className={`app ${cosmos ? "app-cosmos" : ""}`}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <div><strong>{ui.title}</strong><em>{ui.tagline}</em></div>
        </div>
        <div className="topbar-controls">
          <div className="reading-toggle" role="group" aria-label="설명 난이도">
            <button aria-pressed={easy} className={easy ? "active" : ""} onClick={() => setEasy(true)}>쉽게</button>
            <button aria-pressed={!easy} className={!easy ? "active" : ""} onClick={() => setEasy(false)}>자세히</button>
          </div>
          <button className="motion-toggle" aria-pressed={motion} onClick={() => setMotion(!motion)}>{motion ? "움직임 멈추기" : "움직임 켜기"}</button>
          <div className="layer-toggle" role="group" aria-label={ui.layerSolar}>
            <button aria-pressed={!cosmos} className={!cosmos ? "active" : ""} onClick={goSolar}>{ui.layerSolar}</button>
            <button aria-pressed={!!cosmos} className={cosmos ? "active" : ""} onClick={goCosmos}>{ui.layerCosmos}</button>
          </div>
          {/* 1층에만 뜻이 있다. 은하를 "진짜 크기"로 놓을 자리가 없다. */}
          {!cosmos && (
            <div className="scale-toggle" role="group" aria-label={ui.scaleNice}>
              <button aria-pressed={!trueScale} className={!trueScale ? "active" : ""} onClick={() => changeScale(false)}>{ui.scaleNice}</button>
              <button aria-pressed={trueScale} className={trueScale ? "active" : ""} onClick={() => changeScale(true)}>{ui.scaleTrue}</button>
            </div>
          )}
        </div>
      </header>

      <div className={`workspace ${cosmos ? "workspace-cosmos" : ""}`}>
        <aside className="planet-list" aria-label={cosmos ? ui.listCosmos : ui.listSolar}>
          <div className="list-heading"><span className="eyebrow">{cosmos ? "태양계 너머" : "우리의 태양계"}</span><p>{cosmos ? "별의 시간을 따라가요" : "어디로 떠나볼까요?"}</p></div>
          {cosmos
            ? cosmosList.map((entry) => (
                <button
                  key={entry.id}
                  aria-pressed={cosmosId === entry.id}
                  className={`planet-item ${cosmosId === entry.id ? "active" : ""}`}
                  style={{ "--tint": entry.tint } as React.CSSProperties}
                  onClick={() => { setCosmosId(entry.id); setPanelTab("basic"); }}
                >
                  <span className="dot" />
                  <span>
                    <b>{entry.name}</b>
                    <small>{entry.poetic}</small>
                  </span>
                </button>
              ))
            : bodies.map((entry) => (
                <button
                  key={entry.id}
                  aria-pressed={selected === entry.id}
                  className={`planet-item ${selected === entry.id ? "active" : ""}`}
                  style={{ "--tint": entry.tint } as React.CSSProperties}
                  onClick={() => select(entry.id)}
                >
                  <img className="planet-thumb" src={asset(entry.texture)} alt="" width={36} height={36} />
                  <span>
                    <b>{bodyCopy[entry.id].name}</b>
                    <small>{bodyCopy[entry.id].poetic}</small>
                  </span>
                </button>
              ))}
        </aside>

        <section className="stage">
          {cosmos ? (
            cosmos.scene ? (
              // 3D 무대가 준비된 항목. 사진보다 앞선다 — 사진은 한 순간을
              // 보여 주지만 이쪽은 변해 가는 것 자체를 보여 준다.
              cosmos.scene === "star-life" ? (
                <StarJourney value={journey} onChange={setJourney} easy={easy} motion={motion} />
              ) : (
                <CosmosJourney at={cosmosAt} onChange={setCosmosAt} easy={easy} motion={motion} />
              )
            ) : cosmos.image ? (
              <figure className="cosmos-stage">
                <img src={asset(cosmos.image.src)} alt={cosmos.image.alt} decoding="async" />
                {cosmos.image.caption && <figcaption>{cosmos.image.caption}</figcaption>}
              </figure>
            ) : (
              // 아직 도해가 없는 `process` 항목. 그림이 없다고 자리를 비워
              // 두기보다, 어디를 보면 되는지 일러 준다.
              <div className="cosmos-stage-empty">
                <h2 style={{ color: cosmos.tint }}>{cosmos.name}</h2>
                <p>{cosmos.poetic}</p>
                <small>{ui.cosmosNoImage}</small>
              </div>
            )
          ) : (
            <>
              <div ref={mountRef} className="stage-mount" />
              <p className="stage-name" aria-live="polite">
                {bodyCopy[hovered ?? selected].name}
              </p>
              <small className="stage-hint">{ui.hint}</small>
              <div className="solar-stage-header"><span className="eyebrow">태양계</span><span>{trueScale ? "실제 비율" : "탐사선의 사진으로 만나는 세계"}</span></div>
              <small className="stage-credit">{ui.credit}</small>
              {(loading || viewerFailed) && <div className="loader" role="status">{viewerFailed ? "이 기기에서 우주 모형을 열지 못했어요. 천체를 고르면 설명을 읽을 수 있어요." : "우주를 켜는 중이에요…"}</div>}
              {trueScale && <p className="scale-note">{ui.scaleHint}</p>}
            </>
          )}
        </section>

        <aside className={`info tab-${panelTab}`}>
          <h1 style={{ color: cosmos ? cosmos.tint : body.tint }}>{cosmos ? cosmos.name : copy.name}</h1>
          <em>{cosmos ? cosmos.poetic : copy.poetic}</em>

          {/* 심화 글이 있는 항목에만 두 번째 읽기 화면을 연다. */}
          {deep && (
            <div className="info-tabs" role="group" aria-label={ui.tabDeep}>
              <button
                aria-pressed={panelTab === "basic"}
                className={panelTab === "basic" ? "active" : ""}
                onClick={() => setPanelTab("basic")}
              >
                {ui.tabBasic}
              </button>
              <button
                aria-pressed={panelTab === "deep"}
                className={panelTab === "deep" ? "active" : ""}
                onClick={() => setPanelTab("deep")}
              >
                {ui.tabDeep}
              </button>
            </div>
          )}

          <p className="description">
            {cosmos ? (easy ? cosmos.descriptionEasy ?? cosmos.description : cosmos.description) : withChild(copy.description)}
          </p>

          {cosmos?.image && <figure className="reference-photo">
            <img src={asset(cosmos.image.src)} alt={cosmos.image.alt} width={420} height={260} loading="lazy" />
            <figcaption>관측 사진 · {cosmos.image.caption}</figcaption>
          </figure>}

          {/* 태양계 밖에는 하늘에서 찾을 수 없는 것도 있다. 빅뱅에는 이 칸이
              없고, 없으면 통째로 건너뛴다. */}
          {lookUp && (
            <div className="look-up">
              <b>{ui.lookUpTitle}</b>
              <p>{withChild(lookUp)}</p>
            </div>
          )}

          <dl className="facts">
            {factRows.map((row) => (
              <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>
            ))}
          </dl>

          {/* 행성만 가진 칸. 태양계 밖에는 대응하는 글이 없다. */}
          {!cosmos && (
            <div className="fun">
              <b>{ui.didYouKnow}</b>
              <span>{withChild(copy.funFact)}</span>
            </div>
          )}

          {/* Always mounted, hidden by CSS on the basic face, so an open group
              survives a look back at the panel above. 묶음과 칩 이름만 층에
              따라 바꿔 넘긴다. */}
          {cosmos
            ? cosmos.deepDive && (
                <DeepDive entries={cosmos.deepDive} groups={COSMOS_GROUPS} meta={COSMOS_META} easy={easy} />
              )
            : copy.deepDive && (
                <DeepDive entries={copy.deepDive} groups={PLANET_GROUPS} meta={PLANET_META} easy={easy} />
              )}
        </aside>
      </div>
    </main>
  );
}
