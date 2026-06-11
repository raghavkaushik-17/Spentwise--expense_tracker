-- ============================================================
-- Spendwise — Supabase Schema
-- Run this in your Supabase SQL editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable RLS
-- Transactions table
create table if not exists public.transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  merchant      text not null,
  amount        numeric(10, 2) not null check (amount > 0),
  date          date not null,
  category      text not null default 'other',
  payment_method text default 'UPI',
  notes         text,
  created_at    timestamptz default now()
);

alter table public.transactions enable row level security;

create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own transactions"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- Budgets table
create table if not exists public.budgets (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  category   text not null,
  amount     numeric(10, 2) not null check (amount > 0),
  created_at timestamptz default now(),
  unique (user_id, category)
);

alter table public.budgets enable row level security;

create policy "Users can view own budgets"
  on public.budgets for select
  using (auth.uid() = user_id);

create policy "Users can insert own budgets"
  on public.budgets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own budgets"
  on public.budgets for update
  using (auth.uid() = user_id);

create policy "Users can delete own budgets"
  on public.budgets for delete
  using (auth.uid() = user_id);

-- Index for fast lookups
create index if not exists transactions_user_date_idx on public.transactions (user_id, date desc);
create index if not exists budgets_user_idx on public.budgets (user_id);
