import { useCallback, useState } from 'react';
import { DeskView } from './components/DeskView';
import { PortraitLayer } from './components/PortraitLayer';
import { CVView } from './components/CVView';
import { LoginGate } from './components/LoginGate';

type Session = 'login' | 'workspace' | 'cv';

const LAST_QUESTION_ID_KEY = 'portfolio-last-security-question-id';

function App() {
  const [session, setSession] = useState<Session>('login');
  const [gateSession, setGateSession] = useState(0);

  const handleLoginPassed = useCallback(() => {
    setSession('workspace');
  }, []);

  const handleLogout = useCallback(() => {
    setGateSession((current) => current + 1);
    setSession('login');
  }, []);

  const handleSwitchToCv = useCallback(() => {
    setSession('cv');
  }, []);

  const handleSwitchToWorkspace = useCallback(() => {
    setSession('workspace');
  }, []);

  return (
    <div className="relative min-h-svh">
      <PortraitLayer position={session === 'login' ? 'login' : 'docked'} />
      {session === 'login' && (
        <LoginGate
          onPassed={handleLoginPassed}
          gateSession={gateSession}
          lastQuestionIdKey={LAST_QUESTION_ID_KEY}
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
