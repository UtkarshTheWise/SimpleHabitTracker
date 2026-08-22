import { Settings, LogOut } from 'lucide-react';

export default function Header({ isLocal, onSignOut, onOpenSettings }) {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Daily Tracker</h1>
          {isLocal && <p className="text-xs text-neutral-400">Local mode — data saved on this device only</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
          {!isLocal && (
            <button
              onClick={onSignOut}
              className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
