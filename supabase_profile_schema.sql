-- Run this in your Supabase SQL Editor to support User Profiles

-- 1. Create the `profiles` table
create table public.profiles (
    id uuid references auth.users not null primary key,
    full_name text,
    dob date,
    gender text check (gender in ('Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other')),
    nationality text,
    occupation text,
    avatar_url text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS on profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
    on public.profiles for select
    using ( auth.uid() = id );

create policy "Users can insert their own profile"
    on public.profiles for insert
    with check ( auth.uid() = id );

create policy "Users can update their own profile"
    on public.profiles for update
    using ( auth.uid() = id );

-- 3. Create a trigger to automatically create a profile when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Optional: Insert profiles for existing users manually
insert into public.profiles (id)
select id from auth.users
where id not in (select id from public.profiles);

-- 4. Storage Bucket for Avatars
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Anyone can update an avatar."
  on storage.objects for update
  with check ( bucket_id = 'avatars' );
