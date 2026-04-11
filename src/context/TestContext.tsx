import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { TestResult } from '../utils/scoring';
import { buildQuestionList, computeResult, getVisibleQuestions } from '../utils/scoring';
import type { Question } from '../data/questions';
import { loadSavedResultFromStorage, saveResultToStorage, type SavedResult } from '../utils/share';
import { TYPE_IMAGES } from '../data/types';

export type Screen = 'intro' | 'test' | 'result';

interface ToastState {
  message: string;
  visible: boolean;
}

interface TestState {
  screen: Screen;
  answers: Record<string, number>;
  result: TestResult | null;
  baseQuestions: Question[];
  savedResult: SavedResult | null;
  toast: ToastState;
}

interface TestContextValue extends TestState {
  startTest: () => void;
  answerQuestion: (id: string, value: number) => void;
  submitTest: () => void;
  goToScreen: (screen: Screen) => void;
  showToast: (message: string) => void;
  viewSavedResult: () => void;
  visibleQuestions: ReturnType<typeof getVisibleQuestions>;
  progress: { done: number; total: number; percent: number };
}

const TestContext = createContext<TestContextValue | null>(null);

export function TestProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('intro');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<TestResult | null>(null);
  const [baseQuestions, setBaseQuestions] = useState<Question[]>([]);
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false });
  const [savedResult, setSavedResult] = useState<SavedResult | null>(() => loadSavedResultFromStorage());

  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2200);
  }, []);

  const startTest = useCallback(() => {
    setAnswers({});
    setResult(null);
    setBaseQuestions(buildQuestionList());
    setScreen('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const answerQuestion = useCallback((id: string, value: number) => {
    setAnswers(prev => {
      const next = { ...prev, [id]: value };
      // If gate question changed to non-drink, remove trigger answer
      if (id === 'drink_gate_q1' && value !== 3) {
        delete next['drink_gate_q2'];
      }
      return next;
    });
  }, []);

  const submitTest = useCallback(() => {
    const computed = computeResult(answers);
    setResult(computed);
    const imageSrc = TYPE_IMAGES[computed.finalType.code] ?? '';
    const saved: SavedResult = {
      savedAt: Date.now(),
      imageSrc,
      result: {
        finalType: computed.finalType,
        modeKicker: computed.modeKicker,
        badge: computed.badge,
        sub: computed.sub,
        special: computed.special,
        rawScores: computed.rawScores,
        levels: computed.levels,
      },
    };
    saveResultToStorage(saved);
    setSavedResult(saved);
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [answers]);

  const viewSavedResult = useCallback(() => {
    if (!savedResult) return;
    const { result: saved } = savedResult;
    setResult({
      rawScores: saved.rawScores,
      levels: saved.levels,
      ranked: [],
      bestNormal: { code: '', cn: '', intro: '', desc: '', pattern: '', distance: 0, exact: 0, similarity: 0 },
      finalType: saved.finalType,
      modeKicker: saved.modeKicker,
      badge: saved.badge,
      sub: saved.sub,
      special: saved.special,
      secondaryType: null,
    });
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [savedResult]);

  const goToScreen = useCallback((s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const visibleQuestions = getVisibleQuestions(baseQuestions, answers);

  const done = visibleQuestions.filter(q => answers[q.id] !== undefined).length;
  const total = visibleQuestions.length;
  const percent = total ? (done / total) * 100 : 0;

  return (
    <TestContext.Provider
      value={{
        screen,
        answers,
        result,
        baseQuestions,
        savedResult,
        toast,
        startTest,
        answerQuestion,
        submitTest,
        goToScreen,
        viewSavedResult,
        showToast,
        visibleQuestions,
        progress: { done, total, percent },
      }}
    >
      {children}
    </TestContext.Provider>
  );
}

export function useTest(): TestContextValue {
  const ctx = useContext(TestContext);
  if (!ctx) throw new Error('useTest must be used within TestProvider');
  return ctx;
}
