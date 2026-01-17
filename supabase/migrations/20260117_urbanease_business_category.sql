-- Create updated_at trigger function if it doesn't exist
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create business table
create table public.business (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS on business
alter table public.business enable row level security;

-- Trigger for business updated_at
create trigger on_business_updated
  before update on public.business
  for each row
  execute procedure public.handle_updated_at();

-- Create category table
create table public.category (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  parent_id uuid references public.category(id),
  business_id uuid references public.business(id) not null,
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS on category
alter table public.category enable row level security;

-- Trigger for category updated_at
create trigger on_category_updated
  before update on public.category
  for each row
  execute procedure public.handle_updated_at();
