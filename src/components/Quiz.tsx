import { useMemo, useState } from "react";
import { questions, type Question } from "../data/learning";

/**
 * 문제 풀기 탭.
 *
 * 한 주제에 스무 문항까지 들어가니 한 줄로 늘어놓으면 끝이 안 보인다.
 * 그래서 다섯 문항짜리 묶음을 먼저 고르게 하고, 고른 묶음만 끝까지 푼 뒤
 * 몇 개 맞혔는지 알려 준다. 다섯이면 아이가 앉은자리에서 끝낼 수 있다.
 *
 * 문항 순서는 섞지 않는다. 쓸 때 쉬운 것을 앞에 둔 순서가 있고, 같은
 * 묶음을 다시 풀 때 같은 차례로 나와야 무엇을 틀렸는지 되짚을 수 있다.
 * 점수는 어디에도 저장하지 않는다 — 탭을 옮기면 그냥 사라진다.
 */
export function Quiz({ topicId }: { topicId: string }) {
  /**
   * 묶음 이름과 그 묶음의 문항. 데이터에 나온 순서를 그대로 지킨다.
   *
   * `questions[topicId]` 를 밖에서 꺼내지 않고 안에서 꺼내는 것은, 주제에
   * 문항이 없을 때 `?? []` 가 렌더마다 새 배열을 만들어 의존성이 매번
   * 달라지기 때문이다. 바뀌는 것은 `topicId` 하나뿐이다.
   */
  const sets = useMemo(() => {
    const byName = new Map<string, Question[]>();
    for (const q of questions[topicId] ?? []) {
      const name = q.group ?? "";
      const list = byName.get(name);
      if (list) list.push(q);
      else byName.set(name, [q]);
    }
    return [...byName].map(([name, list]) => ({ name, list }));
  }, [topicId]);

  /**
   * 묶음이 하나뿐이면 고르게 할 것이 없으니 바로 문제로 들어간다.
   * 묶음 필드가 없던 예전 데이터도 이 길로 돈다.
   */
  const single = sets.length === 1;
  const [picked, setPicked] = useState<number | null>(single ? 0 : null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [right, setRight] = useState(0);
  const [done, setDone] = useState(false);

  if (sets.length === 0) return null;

  const restart = (at: number | null) => {
    setPicked(at);
    setIndex(0);
    setAnswer(null);
    setRight(0);
    setDone(false);
  };

  if (picked === null) {
    return (
      <section className="quiz">
        <span className="eyebrow">생각을 확인하는 질문</span>
        <h2>어떤 묶음을 풀어 볼까요?</h2>
        <div className="quiz-sets">
          {sets.map((s, i) => (
            <button key={s.name} onClick={() => restart(i)}>
              <strong>{s.name}</strong>
              <small>{s.list.length}문제</small>
            </button>
          ))}
        </div>
      </section>
    );
  }

  const set = sets[picked];
  const total = set.list.length;

  if (done) {
    return (
      <section className="quiz">
        <span className="eyebrow">{set.name}</span>
        <h2>{total}문제 중 {right}개 맞혔어요</h2>
        <p className="quiz-close">
          {right === total
            ? "전부 맞혔네요. 해설을 한 번 더 읽어 보면 더 오래 남아요."
            : "틀린 문제가 더 재미있는 문제예요. 해설을 읽고 다시 풀어 보면 금세 알게 됩니다."}
        </p>
        <div className="quiz-again">
          {sets.length > 1 && <button onClick={() => restart(null)}>다른 묶음 풀기</button>}
          <button onClick={() => restart(picked)}>다시 풀어 보기</button>
        </div>
      </section>
    );
  }

  const question = set.list[index];
  const last = index === total - 1;

  return (
    <section className="quiz">
      <span className="eyebrow">{set.name}</span>
      <p className="quiz-progress">{index + 1}/{total}</p>
      <h2>{question.ask}</h2>
      <div className="quiz-choices">
        {question.choices.map((choice, i) => (
          <button
            key={choice}
            aria-pressed={answer === i}
            disabled={answer !== null}
            className={answer !== null && i === question.answer ? "correct" : ""}
            onClick={() => {
              setAnswer(i);
              if (i === question.answer) setRight(right + 1);
            }}
          >
            <span>{i + 1}</span>
            {choice}
          </button>
        ))}
      </div>
      {answer !== null && (
        <div className="quiz-feedback" role="status">
          <h3>{answer === question.answer ? "이유까지 알아보아요!" : "다시 생각해 볼까요?"}</h3>
          <p>{question.why}</p>
          <button
            onClick={() => {
              if (last) setDone(true);
              else setIndex(index + 1);
              setAnswer(null);
            }}
          >
            {last ? "결과 보기" : "다음 문제"}
          </button>
        </div>
      )}
    </section>
  );
}
