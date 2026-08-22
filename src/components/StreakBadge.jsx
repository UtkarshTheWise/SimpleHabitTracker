import { Flame } from 'lucide-react';

export default function StreakBadge({ count }) {
  const active = count > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
        active
          ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400'
          : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'
      }`}
    >
      <Flame size={12} className={active ? 'fill-orange-500 text-orange-500' : ''} />
      {count} {count === 1 ? 'day' : 'days'}
    </span>
  );
}
