import { useCallback, useState } from 'react';
import { DeskView } from './components/DeskView';
import { PortraitLayer } from './components/PortraitLayer';
import { CVView } from './components/CVView';
import './App.css';

type Session = 'workspace' | 'cv';

function App() {
  const [session, setSession] = useState<Session>('cv');

  const handleLogout = useCallback(() => {
    setSession('cv');
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
      {session === 'workspace' && (
        <DeskView onLogout={handleLogout} onSwitchToCv={handleSwitchToCv} />
      )}
      {session === 'cv' && <CVView onLogout={handleSwitchToWorkspace} />}
    </div>
  );
}

export default App;
