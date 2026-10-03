-- iTECH Lost & Found — Supabase schema
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run

create table if not exists public.users (
  user_id        text primary key,
  name           text not null,
  email          text not null,
  password_hash  text not null,
  phone          text not null default '',
  role           text not null check (role in ('STUDENT','ADMIN')),
  account_status text not null check (account_status in ('ACTIVE','DISABLED')),
  university_id  text,
  department     text,
  access_level   integer,
  created_at     text not null
);
create unique index if not exists users_email_unique on public.users (lower(email));

create table if not exists public.posts (
  post_id          text primary key,
  owner_id         text not null,
  owner_name       text not null,
  owner_email      text not null,
  type             text not null check (type in ('LOST','FOUND')),
  item_name        text not null,
  image            text not null default '',
  location         text not null,
  incident_date    text not null default '',
  approximate_time text not null default '',
  contact_number   text not null default '',
  details          text not null default '',
  posted_at        text not null,
  status           text not null check (status in ('ACTIVE','RESOLVED'))
);

create table if not exists public.reports (
  report_id      text primary key,
  post_id        text not null,
  post_title     text not null,
  reporter_id    text not null,
  reporter_name  text not null,
  reporter_email text not null,
  reason         text not null,
  details        text,
  report_date    text not null,
  status         text not null check (status in ('PENDING','RESOLVED','DISMISSED'))
);

-- Row Level Security.
-- DEMO-GRADE: the app does its own login (not Supabase Auth), so the public
-- "anon" key must be allowed to read/write these tables. See notes in chat.
alter table public.users   enable row level security;
alter table public.posts   enable row level security;
alter table public.reports enable row level security;

do $$
declare t text;
begin
  foreach t in array array['users','posts','reports'] loop
    execute format('drop policy if exists "anon all" on public.%I', t);
    execute format('create policy "anon all" on public.%I for all to anon using (true) with check (true)', t);
  end loop;
end $$;

-- Public image bucket for uploaded item photos
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists "post-images read"   on storage.objects;
drop policy if exists "post-images insert" on storage.objects;
create policy "post-images read"   on storage.objects for select to anon using (bucket_id = 'post-images');
create policy "post-images insert" on storage.objects for insert to anon with check (bucket_id = 'post-images');
