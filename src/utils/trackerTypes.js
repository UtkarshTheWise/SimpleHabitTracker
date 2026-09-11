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

export const DEFAULT_TRACKER_COLOR = '#171717';

export const COLOR_PRESETS = [
  '#171717', // neutral (default)
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
];
