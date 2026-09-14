import { useState } from "react";
import { bodies, byId } from "../data/planets";
import { bodyCopy } from "../data/copy";
import { cosmos } from "../data/cosmos";
import { glossary, readingRoutes } from "../data/learning";
import { lightSeconds, solarDayHours } from "../lib/learning-math";
import { asset } from "../lib/asset";
import type { BodyId } from "../data/types";

export type HubPage = "explore" | "atlas" | "lab" | "dictionary";
const topicCards = [
  ...bodies.map(b => ({ id:b.id, name:bodyCopy[b.id].name, note:bodyCopy[b.id].poetic, group:"태양계", tint:b.tint, texture:b.texture, words:bodyCopy[b.id].description })),
  ...cosmos.map(c => ({id:c.id, name:c.name, note:c.poetic, group:c.kind==="galaxy" ? "은하" : c.scene ? "우주의 역사" : "우주 지식", tint:c.tint, texture:"", words:c.description})),
];
const nameOf = (id: string) => topicCards.find(t => t.id===id)?.name ?? id;

export function LearningHub({page, onPick}: {page: Exclude<HubPage,"explore">; onPick:(id:string)=>void}) {
  const [search,setSearch]=useState("");
  const [group,setGroup]=useState("전체");
  if (page==="lab") return <Lab/>;
  if (page==="dictionary") {
    const entries=glossary.filter(entry=>entry.slice(0,3).join(" ").includes(search.trim()));
    return <section className="hub dictionary"><header className="hub-intro"><span className="eyebrow">단어에서 원리로</span><h1>우주 사전</h1><p>어려운 단어를 만나면, 여기서 잠깐 쉬어 가세요.</p></header>
      <label className="search-field"><span>단어 찾기</span><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="광년, 자전, 블랙홀…"/></label>
      <p className="result-count" role="status">{entries.length}개의 낱말</p>
      <div className="dictionary-grid">{entries.map(([term,definition,example,id])=><details key={term}><summary>{term}<span>＋</span></summary><p>{definition}</p><p className="word-example">{example}</p><button onClick={()=>onPick(id)}>{nameOf(id)}에서 이어 읽기 ↗</button></details>)}</div>
      {!entries.length&&<p className="empty-results">아직 이 낱말은 없어요. 다른 단어나 설명 속 단어로 찾아보세요.</p>}
    </section>;
  }
  const filtered=topicCards.filter(t=>(group==="전체"||t.group===group)&&[t.name,t.note,t.words].join(" ").includes(search.trim()));
  return <section className="hub atlas">
    <header className="hub-intro"><span className="eyebrow">우리 집에서, 우주의 가장 먼 질문까지</span><h1>어떤 우주가 궁금한가요?</h1><p>눈으로 탐험하고, 손으로 실험하고, 한 장씩 깊이 읽어요.</p><div className="atlas-numbers"><span><b>{topicCards.length}</b>개의 탐험 주제</span><span><b>{glossary.length}</b>개의 우주 낱말</span><span>쉽게 · 자세히 두 가지 읽기</span></div></header>
    <div className="reading-routes">{readingRoutes.map((route,i)=><article key={route.title}><span className="route-number">0{i+1}</span><h2>{route.title}</h2><p>{route.note}</p><ol>{route.ids.map(id=><li key={id}><button onClick={()=>onPick(id)}>{nameOf(id)} <span>↗</span></button></li>)}</ol></article>)}</div>
    <div className="catalog-heading"><h2>우주 전체 목차</h2><label className="search-field"><span>주제 검색</span><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="이름이나 궁금한 내용으로 검색"/></label></div>
    <div className="filter-row" role="group" aria-label="목차 분류">{["전체","태양계","우주의 역사","은하","우주 지식"].map(g=><button key={g} aria-pressed={g===group} onClick={()=>setGroup(g)}>{g}</button>)}</div>
    <p className="result-count" role="status">{filtered.length}개의 주제</p>
    <div className="topic-grid">{filtered.map(t=><button key={t.id} className="topic-card" style={{"--tint":t.tint} as React.CSSProperties} onClick={()=>onPick(t.id)}>
      <div className={`topic-art ${t.group==="은하" ? "galaxy-art" : ""}`}>{t.texture?<img src={asset(t.texture)} alt="" loading="lazy"/>:<span aria-hidden="true">✧</span>}</div>
      <small>{t.group}</small><h3>{t.name}</h3><p>{t.note}</p><span className="card-arrow" aria-hidden="true">↗</span>
    </button>)}</div>
    {!filtered.length&&<p className="empty-results">찾은 주제가 없어요. 검색어를 짧게 하거나 ‘전체’를 골라 보세요.</p>}
  </section>;
}

function Lab() {
  const [mode,setMode]=useState<"size"|"distance"|"day">("size");
  const [first,setFirst]=useState<BodyId>("earth");
  const [second,setSecond]=useState<BodyId>("jupiter");
  const a=byId[first], b=byId[second];
  const largest=Math.max(a.radiusKm,b.radiusKm);
  const hourLabel=(h:number)=> h>=48 ? `약 ${(h/24).toLocaleString("ko-KR",{maximumFractionDigits:1})}일` : `약 ${h.toLocaleString("ko-KR",{maximumFractionDigits:2})}시간`;
  return <section className="hub lab"><header className="hub-intro"><span className="eyebrow">같은 눈금으로 보면 달라지는 것</span><h1>우주 비교 실험실</h1><p>숫자를 바꾸는 대신, 실제 측정값을 나란히 놓아 봅니다.</p></header>
    <div className="filter-row" role="group" aria-label="비교 실험">{([["size","크기 비교"],["distance","거리와 빛"],["day","두 가지 하루"]] as const).map(([id,name])=><button key={id} aria-pressed={mode===id} onClick={()=>setMode(id)}>{name}</button>)}</div>
    <div className="lab-selectors">{([["첫 번째 천체",first,setFirst],["두 번째 천체",second,setSecond]] as const).map(([label,value,setValue])=><label key={label}>{label}<select value={value} onChange={e=>setValue(e.target.value as BodyId)}>{bodies.map(body=><option key={body.id} value={body.id}>{bodyCopy[body.id].name}</option>)}</select></label>)}</div>
    {mode==="size" ? <div className="experiment"><h2>지름을 같은 비율로</h2>
      <svg viewBox="0 0 740 300" role="img" aria-label={`${bodyCopy[first].name}와 ${bodyCopy[second].name}의 실제 지름 비율`}>
        {[a,b].map((item,i)=><g key={i}><circle cx={i?540:200} cy={150} r={item.radiusKm/largest*110} fill={item.tint}/><text x={i?540:200} y="288" textAnchor="middle">{bodyCopy[item.id].name} · 지름 약 {(item.radiusKm*2).toLocaleString("ko-KR")} km</text></g>)}
      </svg><p><b>{bodyCopy[second].name}</b>의 지름은 <b>{bodyCopy[first].name}</b>의 약 <strong>{(b.radiusKm/a.radiusKm).toLocaleString("ko-KR",{maximumFractionDigits:3})}배</strong>입니다.</p><p className="experiment-note">평균 반지름으로 계산한 지름입니다. 원의 지름 비율은 실제와 같아요. 태양을 고르면 지구가 얼마나 작아지는지 확인해 보세요. 부피 비율은 지름 비율의 세제곱입니다.</p>
    </div> : mode==="distance" ? <div className="experiment"><h2>태양빛이 도착할 때까지</h2>
      <svg viewBox="0 0 740 210" role="img" aria-label="태양으로부터의 평균 거리, 같은 선형 눈금"><path d="M45 105H685" stroke="#61758e"/>{[0,5,10,15,20,25,30].map(n=><g key={n}><path d={`M${45+n/30.07*640} 95v20`} stroke="#7b8eaa"/><text x={45+n/30.07*640} y="170" textAnchor="middle">{n} AU</text></g>)}{[a,b].map((item,i)=><g key={i}><circle cx={45+item.orbitAu/30.07*640} cy={105} r="7" fill={item.tint}/><text x={Math.max(65,Math.min(660,45+item.orbitAu/30.07*640))} y={i?75:45} textAnchor="middle">{bodyCopy[item.id].name}</text></g>)}</svg>
      <div className="comparison-results">{[a,b].map((item,i)=><article key={i}><h3>{bodyCopy[item.id].name}</h3><strong>{item.orbitAu} AU</strong><p>태양에서 빛으로 약 {(lightSeconds(item.orbitAu)/60).toLocaleString("ko-KR",{maximumFractionDigits:1})}분</p></article>)}</div><p className="experiment-note">태양으로부터의 평균 거리입니다. 두 행성 사이의 실제 거리는 서로의 궤도 위치에 따라 달라져요. 행성 표시는 찾기 쉽게 키웠습니다.</p>
    </div> : <div className="experiment"><h2>몸이 한 바퀴 도는 시간, 해가 돌아오는 시간</h2><div className="comparison-results">{[a,b].map((item,i)=>{const solar=solarDayHours(item.dayHours,item.yearDays);return <article key={i}><h3>{bodyCopy[item.id].name}</h3><dl><dt>한 번 자전</dt><dd>{hourLabel(Math.abs(item.dayHours))}</dd><dt>태양일</dt><dd>{solar ? hourLabel(solar) : "태양 자체에는 적용하지 않아요"}</dd></dl></article>;})}</div><p className="experiment-note">일정한 자전과 원운동을 가정한 평균 주기입니다. 기체 행성은 위도와 측정 기준에 따라 자전 주기가 달라지며, 태양은 적도 부근의 근사값입니다. 수성과 금성을 골라 두 시계를 비교해 보세요.</p></div>}
  </section>;
}
