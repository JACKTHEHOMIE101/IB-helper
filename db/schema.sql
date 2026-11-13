-- Superday Prep schema. Safe to run repeatedly: every statement is idempotent.

create table if not exists users (
  id                 text primary key,          -- the Supabase auth user id
  email              text,
  display_name       text,
  plan               text not null default 'free',  -- 'free' or 'pro'
  stripe_customer_id text,
  created_at         timestamptz not null default now()
);

-- Each user's private app state: 'prep' (drill, simulations, readiness) and 'network' (contacts, firms, story, settings).
-- version goes up on every save, so a save from a stale copy on another device is rejected instead of overwriting.
create table if not exists user_docs (
  user_id    text not null references users(id) on delete cascade,
  doc        text not null,
  data       jsonb not null,
  version    integer not null default 1,
  updated_at timestamptz not null default now(),
  primary key (user_id, doc)
);

create table if not exists clubs (
  code       text primary key,
  name       text,
  owner_id   text references users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- One leaderboard row per user (a user is in at most one club at a time). Holds counts and scores only.
create table if not exists board (
  user_id    text primary key references users(id) on delete cascade,
  club_code  text not null,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists board_club_idx on board (club_code);

-- One row per AI call: which feature, which model, what it used and what it cost. Drives plan limits and cost reports.
create table if not exists ai_calls (
  id            bigserial primary key,
  user_id       text not null references users(id) on delete cascade,
  feature       text not null,
  model         text not null,
  input_tokens  integer not null default 0,
  output_tokens integer not null default 0,
  cost_usd      numeric(10, 5) not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists ai_calls_user_idx on ai_calls (user_id, created_at);

-- One row per user per day they used the app. Drives daily, weekly and monthly active user counts.
create table if not exists activity (
  user_id text not null references users(id) on delete cascade,
  day     date not null,
  primary key (user_id, day)
);

-- Lock every table. Supabase exposes tables in this schema through its public web API; with row-level security on
-- and no policies, that API can read and write nothing. This server connects as the database owner, which is not
-- restricted, and does its own permission checks.
alter table users enable row level security;
alter table user_docs enable row level security;
alter table clubs enable row level security;
alter table board enable row level security;
alter table ai_calls enable row level security;
alter table activity enable row level security;
