import { useCallback, useEffect, useState } from 'react';
import * as data from '../lib/data';
import { todayKey } from '../utils/dateUtils';

export function useTrackers(userId) {
  const [trackers, setTrackers] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const [t, l] = await Promise.all([data.fetchTrackers(userId), data.fetchLogs(userId)]);
    setTrackers(t);
    setLogs(l);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTracker = async (tracker) => {
    const created = await data.createTracker(userId, tracker);
    setTrackers((prev) => [...prev, created]);
  };

  const removeTracker = async (trackerId) => {
    await data.deleteTracker(userId, trackerId);
    setTrackers((prev) => prev.filter((t) => t.id !== trackerId));
    setLogs((prev) => {
      const next = { ...prev };
      delete next[trackerId];
      return next;
    });
  };

  const logValue = async (trackerId, value, dateKey = todayKey()) => {
    await data.upsertLog(userId, trackerId, dateKey, value);
    setLogs((prev) => ({
      ...prev,
      [trackerId]: { ...prev[trackerId], [dateKey]: value },
    }));
  };

  return { trackers, logs, loading, addTracker, removeTracker, logValue, refresh };
}
