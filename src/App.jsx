import { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTrackers } from './hooks/useTrackers';
import { useTodos } from './hooks/useTodos';
import { useNotifications } from './hooks/useNotifications';
import * as data from './lib/data';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';
import FunFact from './components/FunFact';

export default function App() {
  const { user, loading: authLoading, signInWithGoogle, signOut, isLocal } = useAuth();
  const [settings, setSettings] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const trackerState = useTrackers(user?.id);
  const todoState = useTodos(user?.id);
  useNotifications(settings);

  useEffect(() => {
    if (!user) return;
    data.fetchSettings(user.id).then(setSettings);
  }, [user]);

  useEffect(() => {
    if (!settings) return;
    document.documentElement.classList.toggle('dark', settings.dark_mode !== false);
  }, [settings]);

  const updateSettings = async (next) => {
    setSettings(next);
    await data.saveSettings(user.id, next);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 text-neutral-400">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Login onSignIn={signInWithGoogle} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Header isLocal={isLocal} onSignOut={signOut} onOpenSettings={() => setSettingsOpen(true)} />
      <Dashboard trackerState={trackerState} todoState={todoState} />
      <FunFact />
      {settingsOpen && settings && (
        <SettingsModal settings={settings} onSave={updateSettings} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
}
