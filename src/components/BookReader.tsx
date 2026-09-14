import { useEffect, useRef } from "react";
import type { DeepDive } from "../data/types";

export function BookReader({title,description,entries,sources,easy,onClose}: {title:string; description:string; entries?:DeepDive<string>[]; sources:{title:string;url:string}[]; easy:boolean; onClose:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const element=dialog.current;
    element?.focus();
    const onKeyDown=(event: KeyboardEvent)=>{ if (event.key === "Escape") onClose(); };
    element?.addEventListener("keydown", onKeyDown);
    return ()=>element?.removeEventListener("keydown", onKeyDown);
  },[onClose]);
  return <dialog ref={dialog} open className="book-reader" aria-labelledby="book-title">
    <div className="book-toolbar"><span>우주 구경하기 · {easy?"쉬운 글":"자세한 글"}</span><button onClick={onClose}>읽기 닫기 ✕</button></div>
    <article><span className="eyebrow">한 장씩 깊이 읽기</span><h1 id="book-title">{title}</h1><p>{description}</p>
      {entries?.map((entry,i)=><section key={entry.category}><span className="chapter-index">{String(i+1).padStart(2,"0")}</span><h2>{easy ? entry.titleEasy??entry.title : entry.title}</h2><p>{easy?entry.bodyEasy??entry.body:entry.body}</p></section>)}
      {sources.length > 0 && <section className="book-sources"><h2>근거와 더 읽을 자료</h2><ul>{sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></li>)}</ul></section>}
    </article>
  </dialog>;
}
