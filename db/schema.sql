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
create table if not exists user_docs (
  user_id    text not null references users(id) on delete cascade,
  doc        text not null,
  data       jsonb not null,
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

-- AI calls per user per day, for plan limits.
create table if not exists ai_usage (
  user_id text not null references users(id) on delete cascade,
  day     date not null,
  count   integer not null default 0,
  primary key (user_id, day)
);
