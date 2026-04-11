import type { Question } from '../../data/questions';
import { useTest } from '../../context/TestContext';

interface Props {
  question: Question;
  index: number;
}

export function QuestionCard({ question, index }: Props) {
  const { answers, answerQuestion } = useTest();
  const selected = answers[question.id];

  return (
    <article className="q-card">
      <div className="q-card__meta">
        <span className="q-card__badge">第 {index + 1} 题</span>
      </div>
      <p className="q-card__text">{question.text}</p>
      <div className="q-card__options">
        {question.options.map((opt, i) => {
          const code = ['A', 'B', 'C', 'D'][i] ?? String(i + 1);
          const isSelected = selected === opt.value;
          return (
            <label
              key={opt.value}
              className={`q-card__option ${isSelected ? 'q-card__option--selected' : ''}`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={isSelected}
                onChange={() => answerQuestion(question.id, opt.value)}
                className="q-card__radio"
              />
              <span className="q-card__code">{code}</span>
              <span className="q-card__label">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </article>
  );
}
