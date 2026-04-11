import { useTest } from '../../context/TestContext';

export function Toast() {
  const { toast } = useTest();
  return (
    <div className={`toast ${toast.visible ? 'toast--visible' : ''}`}>
      {toast.message}
    </div>
  );
}
