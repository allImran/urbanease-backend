-- Create an enum for user roles
create type public.app_role as enum ('customer', 'staff', 'admin');

-- Create a profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role public.app_role not null default 'customer'
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create a policy that allows users to view their own profile
create policy "Users can view their own profile."
  on public.profiles for select
  using ( auth.uid() = id );

-- Create a policy that allows admins to view all profiles
create policy "Admins can view all profiles."
  on public.profiles for select
  using ( auth.jwt() ->> 'role' = 'admin' );

-- Create a function to sync role updates to auth.users metadata
create or replace function public.sync_role_to_metadata()
returns trigger as $$
begin
  update auth.users
  set raw_app_meta_data = 
    jsonb_set(coalesce(raw_app_meta_data, '{}'::jsonb), '{role}', to_jsonb(new.role))
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to sync role updates from profiles to auth.users
create trigger on_profile_role_change
  after insert or update of role on public.profiles
  for each row
  execute procedure public.sync_role_to_metadata();

-- Create a function to handle new user signup (creates profile)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger on auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
