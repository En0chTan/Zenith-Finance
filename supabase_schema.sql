-- Run this in your Supabase SQL Editor

-- Create the unified transactions table
create table public.transactions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    date date not null,
    amount decimal(12,2) not null,
    transaction_type text not null check (transaction_type in ('Income', 'Expense')),
    category text not null,
    method text,
    entity text,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.transactions enable row level security;

-- Create policies
create policy "Users can view their own transactions"
    on public.transactions for select
    using ( auth.uid() = user_id );

create policy "Users can insert their own transactions"
    on public.transactions for insert
    with check ( auth.uid() = user_id );

create policy "Users can update their own transactions"
    on public.transactions for update
    using ( auth.uid() = user_id );

create policy "Users can delete their own transactions"
    on public.transactions for delete
    using ( auth.uid() = user_id );

-- Create trigger for updated_at
create function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger set_transactions_updated_at
    before update on public.transactions
    for each row
    execute procedure public.handle_updated_at();

-- Disable real-time for transactions (if not absolutely needed, good for performance)
-- Or enable it if you plan to use it:
-- alter publication supabase_realtime add table public.transactions;
