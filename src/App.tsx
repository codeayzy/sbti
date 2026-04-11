import { TestProvider, useTest } from './context/TestContext';
import { Intro } from './components/Intro/Intro';
import { Test } from './components/Test/Test';
import { Result } from './components/Result/Result';
import { Toast } from './components/common/Toast';

function AppContent() {
  const { screen } = useTest();

  return (
    <div className="app">
      <Toast />
      <main className={`screen screen--${screen}`}>
        {screen === 'intro' && <Intro />}
        {screen === 'test' && <Test />}
        {screen === 'result' && <Result />}
      </main>
    </div>
  );
}

export function App() {
  return (
    <TestProvider>
      <AppContent />
    </TestProvider>
  );
}

export default App;
