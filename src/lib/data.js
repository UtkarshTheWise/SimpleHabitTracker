// Data layer: reads/writes go to Supabase when configured, otherwise to
// localStorage so the app works fully offline (see supabaseClient.js).
import { supabase, isSupabaseConfigured } from './supabaseClient';

const LS_KEYS = {
  trackers: (uid) => `tracker_app_trackers_${uid}`,
  logs: (uid) => `tracker_app_logs_${uid}`,
  settings: (uid) => `tracker_app_settings_${uid}`,
  todos: (uid) => `tracker_app_todos_${uid}`,
};

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return crypto.randomUUID();
}

// ---------- Trackers ----------

export async function fetchTrackers(userId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('trackers').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  }
  return readLS(LS_KEYS.trackers(userId), []);
}

export async function createTracker(userId, tracker) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('trackers')
      .insert({ ...tracker, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  const trackers = readLS(LS_KEYS.trackers(userId), []);
  const newTracker = { ...tracker, id: uid(), user_id: userId, created_at: new Date().toISOString() };
  writeLS(LS_KEYS.trackers(userId), [...trackers, newTracker]);
  return newTracker;
}

export async function deleteTracker(userId, trackerId) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('trackers').delete().eq('id', trackerId);
    if (error) throw error;
    return;
  }
  const trackers = readLS(LS_KEYS.trackers(userId), []);
  writeLS(LS_KEYS.trackers(userId), trackers.filter((t) => t.id !== trackerId));
  const logs = readLS(LS_KEYS.logs(userId), {});
  delete logs[trackerId];
  writeLS(LS_KEYS.logs(userId), logs);
}

// ---------- Logs ----------
// Shape once fetched: { [trackerId]: { [dateKey]: value } }

export async function fetchLogs(userId) {
  if (isSupabaseConfigured) {
    // Full history (not just a recent window) so streaks — especially the
    // longest streak — are computed across all-time data, matching local mode.
    const { data, error } = await supabase.from('tracker_logs').select('*');
    if (error) throw error;
    const map = {};
    for (const row of data) {
      if (!map[row.tracker_id]) map[row.tracker_id] = {};
      map[row.tracker_id][row.log_date] = row.value;
    }
    return map;
  }
  return readLS(LS_KEYS.logs(userId), {});
}

export async function upsertLog(userId, trackerId, dateKey, value) {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('tracker_logs')
      .upsert({ tracker_id: trackerId, user_id: userId, log_date: dateKey, value }, { onConflict: 'tracker_id,log_date' });
    if (error) throw error;
    return;
  }
  const logs = readLS(LS_KEYS.logs(userId), {});
  if (!logs[trackerId]) logs[trackerId] = {};
  logs[trackerId][dateKey] = value;
  writeLS(LS_KEYS.logs(userId), logs);
}

// ---------- Settings ----------

const DEFAULT_SETTINGS = { reminder_enabled: false, reminder_time: '20:00', dark_mode: true };

export async function fetchSettings(userId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return data ? { ...DEFAULT_SETTINGS, ...data } : DEFAULT_SETTINGS;
  }
  return readLS(LS_KEYS.settings(userId), DEFAULT_SETTINGS);
}

export async function saveSettings(userId, settings) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('user_settings').upsert({ user_id: userId, ...settings });
    if (error) throw error;
    return;
  }
  writeLS(LS_KEYS.settings(userId), settings);
}

// ---------- To-do queue ----------
// Ordered by created_at, oldest first — the front of the queue.

export async function fetchTodos(userId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('todos').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  }
  return readLS(LS_KEYS.todos(userId), []);
}

export async function createTodo(userId, text) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('todos').insert({ text, user_id: userId }).select().single();
    if (error) throw error;
    return data;
  }
  const todos = readLS(LS_KEYS.todos(userId), []);
  const newTodo = { id: uid(), user_id: userId, text, created_at: new Date().toISOString() };
  writeLS(LS_KEYS.todos(userId), [...todos, newTodo]);
  return newTodo;
}

export async function deleteTodo(userId, todoId) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('todos').delete().eq('id', todoId);
    if (error) throw error;
    return;
  }
  const todos = readLS(LS_KEYS.todos(userId), []);
  writeLS(LS_KEYS.todos(userId), todos.filter((t) => t.id !== todoId));
}
