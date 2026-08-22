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

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
}
