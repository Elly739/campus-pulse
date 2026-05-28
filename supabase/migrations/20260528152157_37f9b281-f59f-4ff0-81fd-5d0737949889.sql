
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create type public.event_status as enum ('pending', 'approved', 'rejected');
create type public.event_category as enum ('Tech','Sports','Career','Church','Entertainment','Business');

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  long_description text,
  category event_category not null,
  image text,
  location text not null,
  organizer text not null,
  starts_at timestamptz not null,
  deadline timestamptz,
  tags text[] not null default '{}',
  trending boolean not null default false,
  status event_status not null default 'pending',
  submitted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index events_status_starts_at_idx on public.events(status, starts_at);

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);
create index rsvps_event_id_idx on public.rsvps(event_id);
create index rsvps_user_id_idx on public.rsvps(user_id);

-- Grants (PostgREST needs these)
grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;
grant all on public.profiles to service_role;

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

grant select on public.events to anon, authenticated;
grant insert, update on public.events to authenticated;
grant all on public.events to service_role;

grant select, insert, delete on public.rsvps to authenticated;
grant all on public.rsvps to service_role;

-- has_role security definer
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- New user trigger: create profile + default role
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'user')
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.events enable row level security;
alter table public.rsvps enable row level security;

-- profiles
create policy "Profiles viewable by everyone" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- user_roles
create policy "Users view own roles" on public.user_roles for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

-- events
create policy "Anyone views approved events" on public.events for select
  using (status = 'approved' or auth.uid() = submitted_by or public.has_role(auth.uid(), 'admin'));
create policy "Authenticated users submit events" on public.events for insert to authenticated
  with check (auth.uid() = submitted_by and status = 'pending');
create policy "Admins update events" on public.events for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- rsvps
create policy "Users view own rsvps or admins all" on public.rsvps for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "Anyone counts rsvps" on public.rsvps for select to anon using (true);
create policy "Users create own rsvps" on public.rsvps for insert to authenticated
  with check (auth.uid() = user_id);
create policy "Users delete own rsvps" on public.rsvps for delete to authenticated
  using (auth.uid() = user_id);

-- Storage bucket for posters
insert into storage.buckets (id, name, public) values ('event-posters', 'event-posters', true)
on conflict (id) do nothing;

create policy "Posters publicly readable" on storage.objects for select using (bucket_id = 'event-posters');
create policy "Authenticated users upload posters" on storage.objects for insert to authenticated
  with check (bucket_id = 'event-posters');
create policy "Users delete own posters" on storage.objects for delete to authenticated
  using (bucket_id = 'event-posters' and owner = auth.uid());
