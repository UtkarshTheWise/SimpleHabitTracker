import { getHeatmapGrid } from '../utils/dateUtils';

// Tiny GitHub/LeetCode-style contribution map of the last `weeks` weeks.
export default function StreakHeatmap({ logsForTracker = {}, color, weeks = 10 }) {
  const grid = getHeatmapGrid(weeks);

  return (
    <div className="flex gap-[3px] overflow-x-auto">
      {grid.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((day, di) => {
            if (!day) return <span key={di} className="w-2.5 h-2.5" />;
            const met = (logsForTracker[day] || 0) > 0;
            return (
              <span
                key={di}
                title={day}
                className="w-2.5 h-2.5 rounded-sm bg-neutral-100 dark:bg-neutral-800"
                style={met ? { backgroundColor: color } : undefined}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
