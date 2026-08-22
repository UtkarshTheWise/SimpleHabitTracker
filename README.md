# Daily Tracker

A minimalist daily goal & habit tracker. React + Tailwind + Supabase (Google OAuth), with a localStorage fallback so it also runs fully offline with zero setup.

## Features

- Google sign-in via Supabase Auth (falls back to a local-only mode if Supabase isn't configured)
- Custom trackers: Streak Counter, Duration, Boolean Checkbox, Numeric Goal
- Optional daily target and deadline per tracker
- One-tap logging, streak badges, progress bars, 7-day history strip
- Dark mode
- Local browser notification reminder at a chosen time (see [Notifications](#notifications))

## 1. Run it locally (no setup required)

```bash
npm install
npm run dev
```

Open the printed localhost URL. Without Supabase env vars set, the app runs in **local mode**: it auto-signs you in and stores everything in your browser's localStorage. Good for trying it out or fully offline use — data stays on that device/browser only.

## 2. Connect Supabase (real accounts + Google sign-in + synced data)

### a. Create a project

1. Go to https://supabase.com → **New project**.
2. Once it's ready, open **Project Settings → API** and copy the **Project URL** and **anon public key**.

### b. Create the database tables

1. Open the **SQL Editor** in your Supabase project.
2. Paste the contents of `supabase/schema.sql` and run it. This creates `trackers`, `tracker_logs`, and `user_settings`, and locks them down with Row Level Security so each user can only see their own data.

### c. Enable Google sign-in

1. In Supabase: **Authentication → Providers → Google** → toggle it on.
2. In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an **OAuth Client ID** (type: Web application).
   - Authorized redirect URI: use the callback URL Supabase shows on the Google provider settings page (looks like `https://<your-project-ref>.supabase.co/auth/v1/callback`).
3. Copy the Google **Client ID** and **Client Secret** into the Supabase Google provider settings and save.
4. In **Authentication → URL Configuration**, set your **Site URL** (e.g. `http://localhost:5173` for local dev — you'll add your deployed URL later) and add it to **Redirect URLs**.

### d. Set environment variables

Copy `.env.example` to `.env` and fill in the values from step (a):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Restart `npm run dev`. The app now shows the Google sign-in screen and reads/writes from Supabase instead of localStorage.

## 3. Deploy — GitHub + Vercel (free)

### a. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### b. Deploy on Vercel

1. Go to https://vercel.com → **Add New → Project** → import your GitHub repo.
2. Framework preset: **Vite** (build command `npm run build`, output directory `dist` — Vercel usually detects these automatically).
3. Under **Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Deploy.
5. Back in Supabase **Authentication → URL Configuration**, add your new `https://your-app.vercel.app` URL to **Site URL** and **Redirect URLs** — otherwise Google login will redirect but Supabase will reject it.

Netlify works the same way: build command `npm run build`, publish directory `dist`, same two env vars.

## Notifications

The reminder feature uses the browser's local `Notification` API — it checks the current time every 30 seconds while the app tab is open and fires a notification once per day at your chosen time. It does **not** fire when the tab/browser is fully closed, because that requires a service worker + push server (VAPID keys, backend push infrastructure), which is out of scope for this minimal, backend-less build. If you need true background push later, that's the piece to add.

## Project structure

```
src/
  App.jsx
  main.jsx
  index.css
  components/   Login, Header, Dashboard, TrackerCard, TrackerModal, SettingsModal, ProgressBar, StreakBadge
  hooks/        useAuth, useTrackers, useNotifications
  lib/          supabaseClient.js, data.js (Supabase/localStorage data layer)
  utils/        dateUtils.js, trackerTypes.js
supabase/
  schema.sql    Tables + Row Level Security policies
```

## Notes / assumptions

- Data model: one log row per tracker per day (`value` — 0/1 for boolean & streak types, a number for duration/numeric types).
- Streak counts consecutive days with a logged value; today doesn't zero out an existing streak until the day ends without a log.
- No custom backend server — Supabase is used directly from the client, with Row Level Security enforcing per-user data isolation.
- Stack: Vite + React (JavaScript, not TypeScript) + Tailwind CSS + lucide-react, chosen for minimal build config.
