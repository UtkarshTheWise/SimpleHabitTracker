export default function ProgressBar({ value, target }) {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return (
    <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
      <div
        className="h-full rounded-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
