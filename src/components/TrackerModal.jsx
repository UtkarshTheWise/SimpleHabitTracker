import { useState } from 'react';
import { CheckSquare, Clock, Flame, Hash, X } from 'lucide-react';
import { CATEGORY_OPTIONS, COLOR_PRESETS, DEFAULT_TRACKER_COLOR, TRACKER_TYPE_META, TRACKER_TYPES } from '../utils/trackerTypes';

const TYPE_ICONS = {
  [TRACKER_TYPES.STREAK]: Flame,
  [TRACKER_TYPES.DURATION]: Clock,
  [TRACKER_TYPES.BOOLEAN]: CheckSquare,
  [TRACKER_TYPES.NUMERIC]: Hash,
};

export default function TrackerModal({ onCreate, onClose }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [type, setType] = useState(TRACKER_TYPES.BOOLEAN);
  const [targetValue, setTargetValue] = useState('');
  const [unit, setUnit] = useState('');
  const [deadline, setDeadline] = useState('');
  const [color, setColor] = useState(DEFAULT_TRACKER_COLOR);
  const [saving, setSaving] = useState(false);

  const needsTarget = type === TRACKER_TYPES.DURATION || type === TRACKER_TYPES.NUMERIC;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await onCreate({
      title: title.trim(),
      category,
      type,
      target_value: needsTarget && targetValue ? Number(targetValue) : null,
      unit: needsTarget ? unit.trim() || null : null,
      deadline: deadline || null,
      color,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-20 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:max-w-md bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">New Tracker</h2>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X size={18} />
          </button>
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-500">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Read 10 pages"
            required
            className="mt-1 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-500">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-500">Type</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {Object.entries(TRACKER_TYPE_META).map(([key, meta]) => {
              const Icon = TYPE_ICONS[key];
              const active = type === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key)}
                  className={`text-left rounded-lg border p-2.5 text-xs transition-colors ${
                    active
                      ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-800'
                      : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <Icon size={14} className="mb-1" />
                  <div className="font-medium">{meta.label}</div>
                  <div className="text-neutral-400 leading-tight">{meta.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {needsTarget && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-neutral-500">Daily target</label>
              <input
                type="number"
                min="0"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="e.g. 30"
                className="mt-1 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500">Unit</label>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="minutes, pages..."
                className="mt-1 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-neutral-500">Color</label>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 ${
                  color === c ? 'border-neutral-900 dark:border-neutral-100' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
                aria-label={c}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-6 h-6 rounded-full border-none cursor-pointer bg-transparent p-0"
              aria-label="Custom color"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-500">Target deadline (optional)</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {saving ? 'Creating…' : 'Create Tracker'}
        </button>
      </form>
    </div>
  );
}
