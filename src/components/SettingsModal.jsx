import { useState } from 'react';
import { X } from 'lucide-react';

export default function SettingsModal({ settings, onSave, onClose }) {
  const [reminderEnabled, setReminderEnabled] = useState(settings.reminder_enabled);
  const [reminderTime, setReminderTime] = useState(settings.reminder_time);
  const [darkMode, setDarkMode] = useState(settings.dark_mode !== false);

  const handleSave = () => {
    if (reminderEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    onSave({ reminder_enabled: reminderEnabled, reminder_time: reminderTime, dark_mode: darkMode });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-20 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-sm bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Settings</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Dark mode</span>
          <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} className="w-4 h-4" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Daily reminder</span>
          <input
            type="checkbox"
            checked={reminderEnabled}
            onChange={(e) => setReminderEnabled(e.target.checked)}
            className="w-4 h-4"
          />
        </div>

        {reminderEnabled && (
          <div>
            <label className="text-xs font-medium text-neutral-500">Reminder time</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
            <p className="mt-1 text-xs text-neutral-400">
              Requires this browser tab to be open and notification permission granted.
            </p>
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 py-2.5 text-sm font-medium"
        >
          Save
        </button>
      </div>
    </div>
  );
}
