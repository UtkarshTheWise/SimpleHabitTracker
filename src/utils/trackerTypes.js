export const TRACKER_TYPES = {
  STREAK: 'streak',
  DURATION: 'duration',
  BOOLEAN: 'boolean',
  NUMERIC: 'numeric',
};

export const TRACKER_TYPE_META = {
  streak: { label: 'Streak Counter', description: 'Consecutive days (e.g. days without X)' },
  duration: { label: 'Duration', description: 'Time spent (e.g. study minutes)' },
  boolean: { label: 'Checkbox', description: 'Simple did-you-do-it today' },
  numeric: { label: 'Numeric Goal', description: 'A daily count (e.g. pages, glasses)' },
};

export const CATEGORY_OPTIONS = ['Health', 'Fitness', 'Productivity', 'Learning', 'Mindfulness', 'Finance', 'Other'];
