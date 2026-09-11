import { Flame } from 'lucide-react';

export default function StreakBadge({ count, color }) {
  const active = count > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
        active ? '' : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'
      }`}
      style={active ? { backgroundColor: `${color}1a`, color } : undefined}
    >
      <Flame size={12} style={active ? { fill: color, color } : undefined} />
      {count} {count === 1 ? 'day' : 'days'}
    </span>
  );
}
