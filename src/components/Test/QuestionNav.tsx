import { useState } from 'react';
import { useTest } from '../../context/TestContext';

export function QuestionNav() {
  const { visibleQuestions, answers, progress } = useTest();
  const { done, total } = progress;
  const [open, setOpen] = useState(false);

  const scrollTo = (index: number) => {
    const el = document.getElementById(`q-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setOpen(false);
  };

  return (
    <>
      <button
        className="q-nav__toggle"
        onClick={() => setOpen(!open)}
        aria-label="题目导航"
      >
        <span className="q-nav__toggle-icon">{open ? '✕' : '☰'}</span>
        <span className="q-nav__toggle-count">{done}/{total}</span>
      </button>

      {open && <div className="q-nav__overlay" onClick={() => setOpen(false)} />}

      {open && (
        <nav className="q-nav q-nav--open">
          <div className="q-nav__header">
            <span className="q-nav__title">题目导航</span>
            <span className="q-nav__progress">{done}/{total} 已完成</span>
          </div>
          <div className="q-nav__grid">
            {visibleQuestions.map((q, i) => {
              const answered = answers[q.id] !== undefined;
              return (
                <button
                  key={q.id}
                  className={`q-nav__item ${answered ? 'q-nav__item--done' : ''}`}
                  onClick={() => scrollTo(i)}
                  title={answered ? `第 ${i + 1} 题 ✓` : `第 ${i + 1} 题`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
