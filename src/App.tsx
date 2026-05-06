import { useCallback, useState } from 'react';
import { DeskView } from './components/DeskView';
import { LoginGate } from './components/LoginGate';
import { PortraitLayer } from './components/PortraitLayer';
import './App.css';

type Session = 'gate' | 'workspace';

const LAST_GATE_Q_KEY = 'portfolio:last-gate-question';

function App() {
  const [session, setSession] = useState<Session>('gate');
  const [gateEpoch, setGateEpoch] = useState(0);

  const handlePassed = useCallback(() => {
    setSession('workspace');
  }, []);

  const handleLogout = useCallback(() => {
    setSession('gate');
    setGateEpoch((e) => e + 1);
  }, []);

  return (
    <div className="relative min-h-svh">
      <PortraitLayer docked={session === 'workspace'} />
      {session === 'gate' && (
        <LoginGate
          key={gateEpoch}
          gateSession={gateEpoch}
          onPassed={handlePassed}
          lastQuestionIdKey={LAST_GATE_Q_KEY}
        />
      )}
      {session === 'workspace' && <DeskView onLogout={handleLogout} />}
    </div>
  );
}

export default App;
