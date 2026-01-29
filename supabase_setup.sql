
-- 1. Create Products Table
create table products (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  price decimal not null,
  category text, -- 'handbag' or 'household'
  image_url text,
  stock integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Storage Bucket for Images
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

-- 3. Security Policies (RLS)
-- Enable RLS
alter table products enable row level security;

-- Allow everyone to view products
create policy "Public products are viewable by everyone" 
on products for select 
using (true);

-- Allow authenticated users (members/admins) to insert products 
create policy "Enable insert for authenticated users only" 
on products for insert 
to authenticated 
with check (true);

-- Allow authenticated users to update products (stock management)
create policy "Enable update for authenticated users only" 
on products for update 
to authenticated 
using (true)
with check (true);

-- Allow authenticated users to delete products
create policy "Enable delete for authenticated users only" 
on products for delete 
to authenticated 
using (true);

-- Storage Policies
create policy "Give public access to product images"
on storage.objects for select
using ( bucket_id = 'product-images' );

create policy "Allow uploads for authenticated users"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'product-images' );

-- Orders Table
create table orders (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_name text,
  phone_number text,
  total_amount numeric,
  items jsonb, -- Stores the cart items as a snapshot
  payment_status text default 'pending', -- pending, paid, failed
  delivery_status text default 'pending', -- pending, delivered
  mpesa_receipt text, -- To store the transaction code (e.g., QBH...)
  user_id uuid references auth.users(id) -- Optional: link to signed-in user
);

-- RLS Object for Orders
alter table orders enable row level security;

-- Allow anyone to create an order (for checkout)
create policy "Enable insert for everyone" 
on orders for insert 
with check (true);

-- Allow authenticated users (likely Admin) to view all orders
create policy "Enable select for authenticated users" 
on orders for select 
to authenticated 
using (true);

-- Allow authenticated users (Admin) to update orders (e.g. mark delivered)
create policy "Enable update for authenticated users" 
on orders for update 
to authenticated 
using (true);
