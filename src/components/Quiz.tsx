import { useState } from "react";
import { questions } from "../data/learning";

export function Quiz({topicId}: {topicId:string}) {
  const items=questions[topicId] ?? [];
  const [index,setIndex]=useState(0);
  const [answer,setAnswer]=useState<number|null>(null);
  const question=items[index];
  if (!question) return null;
  return <section className="quiz"><span className="eyebrow">생각을 확인하는 질문</span><h2>{question.ask}</h2>
    <div className="quiz-choices">{question.choices.map((choice,i)=><button key={choice} aria-pressed={answer===i} className={answer!==null&&i===question.answer?"correct":""} onClick={()=>setAnswer(i)}><span>{i+1}</span>{choice}</button>)}</div>
    {answer!==null&&<div className="quiz-feedback" role="status"><h3>{answer===question.answer?"이유까지 알아보아요!":"다시 생각해 볼까요?"}</h3><p>{question.why}</p><button onClick={()=>{setAnswer(null);setIndex((index+1)%items.length);}}>다시 풀어 보기</button></div>}
  </section>;
}
