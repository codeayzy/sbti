import { useTest } from '../../context/TestContext';
import { QuestionCard } from './QuestionCard';
import { QuestionNav } from './QuestionNav';
import { shareSite } from '../../utils/share';

export function Test() {
  const { visibleQuestions, progress, submitTest, showToast, goToScreen } = useTest();
  const { done, total, percent } = progress;
  const isComplete = done === total && total > 0;

  return (
    <section className="test">
      <header className="test__header">
        <button className="btn btn--ghost btn--sm" onClick={() => goToScreen('intro')}>
          ← 返回
        </button>
        <div className="test__vine">
          <div className="test__vine-track">
            <div className="test__vine-fill" style={{ width: `${percent}%` }}>
              {Array.from({ length: Math.min(done, 8) }).map((_, i) => (
                <span key={i} className="test__leaf" style={{ left: `${(i + 1) * (100 / 8)}%` }}>
                  🌿
                </span>
              ))}
            </div>
          </div>
          <span className="test__progress-text">{done} / {total}</span>
        </div>
        <button className="btn btn--ghost btn--sm" onClick={() => shareSite(showToast)}>
          分享
        </button>
      </header>

      <div className="test__body">
        <QuestionNav />
        <div className="test__list">
          {visibleQuestions.map((q, i) => (
            <div id={`q-${i}`} key={q.id}>
              <QuestionCard question={q} index={i} />
            </div>
          ))}
        </div>
      </div>

      <footer className="test__footer">
        <p className="test__hint">
          {isComplete
            ? '都做完了。现在可以把你的电子魂魄交给结果页审判。'
            : '全选完才会放行。世界已经够乱的，起码把题做完整。'}
        </p>
        <button
          className="btn btn--primary"
          disabled={!isComplete}
          onClick={submitTest}
        >
          提交查看结果
        </button>
      </footer>
    </section>
  );
}
