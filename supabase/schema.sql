-- Daily Tracker — Supabase schema
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query).

create extension if not exists "pgcrypto";

-- Trackers ------------------------------------------------------------

create table if not exists trackers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  category text,
  type text not null check (type in ('streak', 'duration', 'boolean', 'numeric')),
  target_value numeric,
  unit text,
  deadline date,
  created_at timestamptz default now()
);

-- Daily log entries (one row per tracker per day) ---------------------

create table if not exists tracker_logs (
  id uuid primary key default gen_random_uuid(),
  tracker_id uuid references trackers(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  log_date date not null,
  value numeric not null default 0,
  created_at timestamptz default now(),
  unique (tracker_id, log_date)
);

-- Per-user app settings -------------------------------------------------

create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  reminder_enabled boolean default false,
  reminder_time time default '20:00',
  dark_mode boolean default true
);

-- Row Level Security: each user can only see/edit their own rows -------

alter table trackers enable row level security;
alter table tracker_logs enable row level security;
alter table user_settings enable row level security;

create policy "Users manage their own trackers"
  on trackers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own logs"
  on tracker_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own settings"
  on user_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
