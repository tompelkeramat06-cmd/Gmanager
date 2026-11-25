-- Supabase SQL Editor: jalankan seluruh script ini.
create table if not exists public.transactions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 type text not null check (type in ('income','expense','savings','emergency')),
 title text not null,
 category text default '',
 amount numeric not null check (amount > 0),
 currency text not null check (currency in ('IDR','EGP')),
 amount_idr numeric not null,
 date date not null default current_date,
 created_at timestamptz not null default now()
);
alter table public.transactions enable row level security;
drop policy if exists "Users can view own transactions" on public.transactions;
create policy "Users can view own transactions" on public.transactions for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own transactions" on public.transactions;
create policy "Users can insert own transactions" on public.transactions for insert with check (auth.uid() = user_id);
drop policy if exists "Users can delete own transactions" on public.transactions;
create policy "Users can delete own transactions" on public.transactions for delete using (auth.uid() = user_id);
drop policy if exists "Users can update own transactions" on public.transactions;
create policy "Users can update own transactions" on public.transactions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);