import { useId, useState } from "react";
import type { Cosmos } from "../data/types";
import { transitDepth } from "../lib/learning-math";

/** Lightweight interactive diagrams keep new reading topics useful without a second WebGL context. */
export function ConceptScene({ topic }: { topic: Cosmos }) {
  const [value, setValue] = useState(50);
  const uid = useId().replaceAll(":", "");
  const type = topic.diagram;
  const phase = value / 100 * Math.PI * 2;
  const sunX = 315 - Math.sqrt(140 ** 2 - 80 ** 2);
  const mass = 1 + value / 100 * 3;
  const x = (value - 50) / 100 * 3;
  const mode = Math.min(2, Math.floor(value / 34));
  const prompts: Record<NonNullable<Cosmos["diagram"]>, [string, string]> = {
    blackhole: ["질량을 바꾸면 경계는?", "회전하지 않는 단순한 블랙홀에서는 질량이 커질수록 사건지평선 반지름도 같은 비율로 커져요."],
    nebula: ["구름을 세 가지 빛으로 읽어요", ["별빛을 흩어 보여 주는 반사성운", "뒤쪽 별빛을 가리는 암흑성운", "에너지를 받은 가스가 빛나는 방출성운"][mode]],
    transit: ["행성을 별 앞으로 옮겨 보세요", "행성이 별빛을 가리는 동안 밝기가 줄어요. 여기서는 별 표면의 밝기가 균일하다고 가정했어요."],
    moon: ["밝은 반쪽을 얼마나 볼까요?", "지구에서 본 달의 위상이에요. 보통의 위상 변화는 지구 그림자가 달을 가려 생기는 것이 아니에요."],
    orbits: ["혜성이 어디에 있어도 꼬리는?", "이온 꼬리는 대체로 태양의 반대쪽으로 향해요. 먼지 꼬리는 휘어질 수 있어요."],
    spectrum: ["빛의 물결을 늘려 보세요", "우주가 팽창하면서 빛의 파장이 길어지는 관계예요. 색은 파장 변화를 구별하기 위한 표시예요."],
    dark: ["보이는 별 너머에는?", "보랏빛은 암흑물질의 개념 표시예요. 실제 색이나 날카로운 경계를 본 것이 아니에요."],
    telescope: ["거울을 넓히면 어떻게 될까요?", "같은 조건에서 원형 거울의 지름이 두 배면 빛을 모으는 면적은 네 배가 돼요."],
  };
  if (!type) return null;
  const [title, explanation] = prompts[type];
  const glowColor = type === "nebula" ? (mode === 0 ? "#80bbf5" : "#ef8dac") : topic.tint;
  const stars = Array.from({ length: 90 }, (_, i) => ({ x: 20 + (i * 137.51) % 580, y: 30 + (i * 71.29) % 300, r: .7 + i % 3 * .4 }));
  const wavelength = 28 + value * 1.2;
  const wave = Array.from({ length: 241 }, (_, i) => `${i ? "L" : "M"}${70+i*2},${175+Math.sin(i*2/wavelength*Math.PI*2)*36}`).join(" ");
  const cometX = 315 + Math.cos(phase) * 140, cometY = 175 + Math.sin(phase) * 80;
  const dx = cometX - sunX, dy = cometY - 175, len = Math.hypot(dx, dy);
  return <div className="concept-scene" style={{ "--stage-color": topic.tint } as React.CSSProperties}>
    <header><span className="eyebrow">손으로 이해하는 우주</span><h2>{topic.name}</h2><p>{topic.poetic}</p></header>
    <svg viewBox="0 0 620 350" role="img" aria-label={title}>
      <defs><radialGradient id={uid}><stop stopColor={glowColor} stopOpacity=".85"/><stop offset="1" stopColor={glowColor} stopOpacity="0"/></radialGradient></defs>
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#bfd4ef" opacity=".35"/>)}
      {type === "blackhole" && <g>
        <ellipse cx="310" cy="175" rx="180" ry="55" fill="none" stroke="#efb86c" strokeWidth="18" opacity=".65"/>
        <circle cx="310" cy="175" r={mass*19+9} fill={`url(#${uid})`}/>
        <circle cx="310" cy="175" r={mass*19} fill="#010207" stroke="#eed4a7" strokeWidth="1.5"/>
        <path d={`M${310+mass*19} 175 H505`} stroke="#efd2a3" strokeDasharray="4 5"/>
        <text x="455" y="155">사건지평선</text><text x="310" y="300" textAnchor="middle">질량 · {mass.toFixed(1)}배</text>
      </g>}
      {type === "nebula" && <g>
        {Array.from({length: 20}, (_, i) => <ellipse key={i} cx={205 + (i*53)%200} cy={130+(i*41)%95} rx={50+i%4*12} ry={35+i%3*13} fill={mode === 1 ? "#080c17" : `url(#${uid})`} opacity={mode===1 ? .9 : .22}/>)}
        {mode !== 1 && <><circle cx="340" cy="142" r="5" fill="white"/><path d="M340 120V164M318 142H362" stroke="white" opacity=".6"/></>}
        <text x="310" y="310" textAnchor="middle">{["반사성운", "암흑성운", "방출성운"][mode]}</text>
      </g>}
      {type === "transit" && <g>
        <circle cx="310" cy="125" r="75" fill="#f1d398"/>
        <circle cx={310+x*75} cy="125" r="15" fill="#142135" stroke="#9edcd7"/>
        <path d="M105 255H515M105 255V315" fill="none" stroke="#63758d"/>
        <path d={Array.from({length:121}, (_, i) => `${i ? "L":"M"}${105+i*410/120},${263+transitDepth(.2,(i-60)/40)*900}`).join(" ")} fill="none" stroke={topic.tint} strokeWidth="2"/>
        <circle cx={105+value/100*410} cy={263+transitDepth(.2,x)*900} r="5" fill="white"/>
        <text x="310" y="230" textAnchor="middle">남은 별빛 · {(100-transitDepth(.2,x)*100).toFixed(2)}%</text>
        <text x="520" y="277">시간</text>
      </g>}
      {type === "moon" && <g>
        <circle cx="310" cy="166" r="86" fill="#182233"/>
        {Array.from({length:172},(_,i)=>{
          const y=i-85.5, width=Math.sqrt(Math.max(0,86*86-y*y));
          const edge=Math.cos(phase)*width;
          return <path key={i} d={Math.sin(phase)>=0 ? `M${310+edge} ${166+y} H${310+width}` : `M${310-width} ${166+y} H${310-edge}`} stroke="#e2e1d2" strokeWidth="1.1"/>;
        })}
        <text x="310" y="300" textAnchor="middle">보이는 면 중 밝은 비율 · {Math.round((1-Math.cos(phase))*50)}%</text>
      </g>}
      {type === "orbits" && <g>
        <ellipse cx="315" cy="175" rx="140" ry="80" fill="none" stroke="#74879d" strokeDasharray="4 5"/>
        <circle cx={sunX} cy="175" r="22" fill="#f7cf83"/><text x={sunX} y="224" textAnchor="middle">태양</text>
        <path d={`M${cometX} ${cometY} L${cometX+dx/len*90} ${cometY+dy/len*90}`} stroke="#99dbe3" strokeWidth="8" opacity=".65"/>
        <circle cx={cometX} cy={cometY} r="7" fill="#f0fbff"/>
        <text x="310" y="314" textAnchor="middle">궤도와 꼬리 방향을 비교해요 · 크기와 거리는 개략적</text>
      </g>}
      {type === "spectrum" && <g>
        <path d={wave} fill="none" stroke={`hsl(${250-value*2.5} 80% 72%)`} strokeWidth="4"/>
        <path d={`M70 248H${70+wavelength}`} stroke="#d0d4f5" strokeWidth="2"/>
        <text x={70+wavelength/2} y="278" textAnchor="middle">한 파장</text>
        <text x="310" y="65" textAnchor="middle">늘어난 파장 · {(wavelength/28).toFixed(1)}배</text>
      </g>}
      {type === "dark" && <g>
        <ellipse cx="310" cy="165" rx="210" ry="128" fill={`url(#${uid})`} opacity={value/100*.6} stroke="#ada5e2" strokeDasharray="4 8"/>
        <ellipse cx="310" cy="165" rx="113" ry="23" fill="#f1d99c" opacity=".8"/>
        <text x="310" y="305" textAnchor="middle">별의 원반과 더 넓게 퍼진 암흑물질 헤일로의 개념도</text>
      </g>}
      {type === "telescope" && <g>
        <path d={`M430 ${175-(30+value*.7)} Q485 175 430 ${175+(30+value*.7)}`} stroke="#bddef3" strokeWidth="9" fill="none"/>
        {Array.from({length:9},(_,i)=>{const y=175+(i-4)*(30+value*.7)/4;return <path key={i} d={`M100 ${y} H430 L315 175`} stroke="#f5d794" fill="none" opacity=".65"/>;})}
        <circle cx="315" cy="175" r="6" fill="#fff"/>
        <text x="215" y="320">평행하게 들어온 빛 → 초점</text>
      </g>}
    </svg>
    <div className="concept-console"><h3>{title}</h3><p>{explanation}</p>
      <label className="concept-slider">{type==="moon" ? "달의 위치" : type==="transit" ? "행성의 위치" : type==="nebula" ? "성운의 종류" : "모형 바꾸기"}
        <input type="range" min="0" max="100" value={value} onChange={e=>setValue(Number(e.target.value))} aria-valuetext={type==="transit" ? `남은 별빛 ${(100-transitDepth(.2,x)*100).toFixed(2)}%` : `${value}%`}/>
      </label>
      <p className="model-note">관계를 이해하기 위한 도해입니다. 실제 관측 사진이나 천체의 실제 크기 비율은 아닙니다.</p>
    </div>
  </div>;
}
