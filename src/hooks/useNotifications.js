import { useEffect } from 'react';

// Local, in-tab reminder: polls the clock every 30s while this tab is open
// and fires a Notification once per day at the chosen time. This is not
// background push (that needs a service worker + VAPID keys + a push
// server) — see README "Notifications" section.
export function useNotifications(settings) {
  useEffect(() => {
    if (!settings?.reminder_enabled) return;
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const check = () => {
      if (Notification.permission !== 'granted') return;
      const now = new Date();
      const current = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (current !== settings.reminder_time) return;

      const today = now.toDateString();
      const lastNotified = localStorage.getItem('tracker_app_last_notified');
      if (lastNotified === today) return;

      new Notification('Daily Tracker', {
        body: "Don't forget to log today's habits!",
      });
      localStorage.setItem('tracker_app_last_notified', today);
    };

    const interval = setInterval(check, 30000);
    check();
    return () => clearInterval(interval);
  }, [settings?.reminder_enabled, settings?.reminder_time]);
}
