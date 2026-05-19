import { useCallback, useState } from 'react';
import { DeskView } from './components/DeskView';
import { LoginGate } from './components/LoginGate';
import { PortraitLayer } from './components/PortraitLayer';
import { CVView } from './components/CVView';
import './App.css';

type Session = 'gate' | 'workspace' | 'cv';

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

  const handleSwitchToCv = useCallback(() => {
    setSession('cv');
  }, []);

  const handleSwitchToWorkspace = useCallback(() => {
    setSession('workspace');
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
      {session === 'workspace' && (
        <DeskView onLogout={handleLogout} onSwitchToCv={handleSwitchToCv} />
      )}
      {session === 'cv' && <CVView onLogout={handleSwitchToWorkspace} />}
    </div>
  );
}

export default App;
