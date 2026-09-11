import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function TodoQueue({ todos, onAdd, onRemove }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 mb-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task to the queue…"
          className="flex-1 min-w-0 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
        />
        <button
          type="submit"
          className="shrink-0 flex items-center gap-1 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-3 py-1.5 text-sm font-medium"
        >
          <Plus size={14} /> Add
        </button>
      </form>

      {todos.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {todos.map((t, i) => (
            <span
              key={t.id}
              title={i === 0 ? 'Up next' : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full pl-3 pr-1.5 py-1 text-xs ${
                i === 0
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              {t.text}
              <button
                onClick={() => onRemove(t.id)}
                className="rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5"
                aria-label="Remove task"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
