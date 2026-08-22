import { useState } from 'react';
import { Plus } from 'lucide-react';
import TrackerCard from './TrackerCard';
import TrackerModal from './TrackerModal';

export default function Dashboard({ trackerState }) {
  const { trackers, logs, loading, addTracker, removeTracker, logValue } = trackerState;
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = (id) => {
    if (confirm('Delete this tracker and all its history?')) {
      removeTracker(id);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-neutral-500">Today</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-3 py-1.5 text-sm font-medium"
        >
          <Plus size={16} /> New Tracker
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400">Loading trackers…</p>
      ) : trackers.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p className="text-sm">No trackers yet.</p>
          <p className="text-xs mt-1">Tap the + button to create your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {trackers.map((t) => (
            <TrackerCard key={t.id} tracker={t} logs={logs} onLog={logValue} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <button
        onClick={() => setModalOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-lg flex items-center justify-center"
        aria-label="New tracker"
      >
        <Plus size={24} />
      </button>

      {modalOpen && <TrackerModal onCreate={addTracker} onClose={() => setModalOpen(false)} />}
    </main>
  );
}
