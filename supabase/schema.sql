-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  first_name text,
  last_name text,
  role text default 'user',
  is_pro boolean default false,
  deactivated_at timestamptz,
  created_at timestamptz default now()
);

-- Prompt categories
create table public.prompt_categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

-- Prompts
create table public.prompts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.prompt_categories(id),
  title text not null,
  description text,
  body text not null,
  is_premium boolean default true,
  created_at timestamptz default now()
);

-- Subscriptions
create table public.subscriptions (
  id text primary key,
  email text not null,
  price_id text not null,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.prompt_categories enable row level security;
alter table public.prompts enable row level security;
alter table public.subscriptions enable row level security;

-- Helper functions to avoid RLS recursion
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles 
    where user_id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

create or replace function public.is_pro_user()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles 
    where user_id = auth.uid() and is_pro = true
  );
end;
$$ language plpgsql security definer;

-- Profiles policies (non-recursive)
create policy "profiles_self_select" 
on public.profiles for select to authenticated 
using (auth.uid() = user_id);

create policy "profiles_self_update" 
on public.profiles for update to authenticated 
using (auth.uid() = user_id);

create policy "profiles_self_insert" 
on public.profiles for insert to authenticated 
with check (auth.uid() = user_id);

create policy "profiles_admin_select" 
on public.profiles for select to authenticated 
using (is_admin());

-- Categories policies
create policy "categories_read_public" 
on public.prompt_categories for select to anon 
using (true);

create policy "categories_read_auth" 
on public.prompt_categories for select to authenticated 
using (true);

create policy "categories_admin_all" 
on public.prompt_categories for all to authenticated
using (is_admin());


-- Prompts policies
create policy "prompts_read_public" 
on public.prompts for select to anon 
using (true);

create policy "prompts_read_all" 
on public.prompts for select to authenticated 
using (true);

create policy "prompts_admin_all" 
on public.prompts for all to authenticated
using (is_admin());


-- Subscriptions policies
create policy "subscriptions_self_select" 
on public.subscriptions for select to authenticated 
using (email = (select email from auth.users where id = auth.uid()));

create policy "subscriptions_admin_select" 
on public.subscriptions for select to authenticated 
using (is_admin());

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
