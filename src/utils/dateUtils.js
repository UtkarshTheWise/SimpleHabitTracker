export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayKey() {
  return toDateKey(new Date());
}

export function getLastNDays(n) {
  const days = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - (n - 1));
  for (let i = 0; i < n; i++) {
    days.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

// Consecutive days (ending today, or yesterday if today isn't logged yet)
// with a value > 0.
export function computeStreak(logsForTracker = {}) {
  const today = todayKey();
  const cursor = new Date();
  if (!(logsForTracker[today] > 0)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (logsForTracker[toDateKey(cursor)] > 0) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Longest run of consecutive logged days (value > 0) found anywhere in the
// given logs — not just the run ending today/yesterday.
export function computeLongestStreak(logsForTracker = {}) {
  const dates = Object.keys(logsForTracker)
    .filter((d) => logsForTracker[d] > 0)
    .sort();
  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const diffDays = Math.round((new Date(dates[i]) - new Date(dates[i - 1])) / 86400000);
    current = diffDays === 1 ? current + 1 : 1;
    longest = Math.max(longest, current);
  }
  return longest;
}

// Grid of date keys for a small GitHub/LeetCode-style contribution map:
// an array of `weeks` columns, each a 7-entry array (Sun–Sat), padded with
// `null` for days beyond today.
export function getHeatmapGrid(weeks = 10) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - (weeks * 7 - 1));
  start.setDate(start.getDate() - start.getDay()); // back up to the preceding Sunday

  const grid = [];
  const cursor = new Date(start);
  while (cursor <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(cursor <= today ? toDateKey(cursor) : null);
      cursor.setDate(cursor.getDate() + 1);
    }
    grid.push(week);
  }
  return grid;
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
}
