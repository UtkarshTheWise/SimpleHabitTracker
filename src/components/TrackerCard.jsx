import { useState } from 'react';
import { CheckCircle2, Circle, Minus, Plus, Trash2, Trophy } from 'lucide-react';
import ProgressBar from './ProgressBar';
import StreakBadge from './StreakBadge';
import StreakHeatmap from './StreakHeatmap';
import { DEFAULT_TRACKER_COLOR, TRACKER_TYPES } from '../utils/trackerTypes';
import { computeLongestStreak, computeStreak, daysUntil, getLastNDays, todayKey } from '../utils/dateUtils';

export default function TrackerCard({ tracker, logs, onLog, onDelete }) {
  const [busy, setBusy] = useState(false);
  const today = todayKey();
  const trackerLogs = logs[tracker.id] || {};
  const todayValue = trackerLogs[today] || 0;
  const streak = computeStreak(trackerLogs);
  const longestStreak = computeLongestStreak(trackerLogs);
  const days = daysUntil(tracker.deadline);
  const isDone = todayValue > 0;
  const step = tracker.type === TRACKER_TYPES.DURATION ? 5 : 1;
  const color = tracker.color || DEFAULT_TRACKER_COLOR;

  const handleLog = async (value) => {
    setBusy(true);
    await onLog(tracker.id, Math.max(0, value));
    setBusy(false);
  };

  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-3"
      style={{ backgroundColor: `${color}1a`, borderColor: `${color}66` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-sm">{tracker.title}</h3>
          {tracker.category && <span className="text-xs text-neutral-400">{tracker.category}</span>}
        </div>
        <button
          onClick={() => onDelete(tracker.id)}
          className="text-neutral-300 hover:text-red-500 transition-colors"
          aria-label="Delete tracker"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {(tracker.type === TRACKER_TYPES.BOOLEAN || tracker.type === TRACKER_TYPES.STREAK) && (
        <div className="flex items-center justify-between">
          <button
            disabled={busy}
            onClick={() => handleLog(isDone ? 0 : 1)}
            className="flex items-center gap-2 text-sm font-medium disabled:opacity-50"
          >
            {isDone ? (
              <CheckCircle2 size={22} style={{ color }} />
            ) : (
              <Circle size={22} className="text-neutral-300 dark:text-neutral-700" />
            )}
            {isDone ? 'Done today' : 'Mark done'}
          </button>
          {tracker.type === TRACKER_TYPES.STREAK && (
            <div className="flex items-center gap-1.5">
              <StreakBadge count={streak} color={color} />
              {longestStreak > streak && (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  <Trophy size={12} /> {longestStreak} best
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {(tracker.type === TRACKER_TYPES.DURATION || tracker.type === TRACKER_TYPES.NUMERIC) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                disabled={busy}
                onClick={() => handleLog(todayValue - step)}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-700 disabled:opacity-50"
                aria-label="Decrease"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-medium tabular-nums w-16 text-center">
                {todayValue}
                {tracker.unit ? ` ${tracker.unit}` : ''}
              </span>
              <button
                disabled={busy}
                onClick={() => handleLog(todayValue + step)}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-700 disabled:opacity-50"
                aria-label="Increase"
              >
                <Plus size={14} />
              </button>
            </div>
            {tracker.target_value > 0 && (
              <span className="text-xs text-neutral-400">
                / {tracker.target_value}
                {tracker.unit ? ` ${tracker.unit}` : ''}
              </span>
            )}
          </div>
          {tracker.target_value > 0 && (
            <ProgressBar value={todayValue} target={tracker.target_value} color={color} />
          )}
        </div>
      )}

      <div className="flex items-center gap-1 pt-1">
        {getLastNDays(7).map((day) => {
          const val = trackerLogs[day] || 0;
          const met = tracker.target_value > 0 ? val >= tracker.target_value : val > 0;
          return (
            <span
              key={day}
              title={`${day}: ${val}${tracker.unit ? ` ${tracker.unit}` : ''}`}
              className={`h-2 flex-1 rounded-sm transition-colors ${met ? '' : 'bg-neutral-100 dark:bg-neutral-800'}`}
              style={met ? { backgroundColor: color } : undefined}
            />
          );
        })}
      </div>

      {tracker.type === TRACKER_TYPES.STREAK && (
        <StreakHeatmap logsForTracker={trackerLogs} color={color} />
      )}

      {days !== null && (
        <p className="text-xs text-neutral-400">
          {days > 0 ? `${days} day${days === 1 ? '' : 's'} left` : days === 0 ? 'Due today' : 'Deadline passed'}
        </p>
      )}
    </div>
  );
}
