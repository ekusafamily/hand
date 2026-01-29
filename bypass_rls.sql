-- OPTIONAL: Run this if you want to allow ANYONE to upload without signing in (Not recommended for production)

-- 1. Drop existing secure policies
drop policy "Enable insert for authenticated users only" on products;
drop policy "Allow uploads for authenticated users" on storage.objects;

-- 2. Create public policies
create policy "Enable insert for everyone" 
on products for insert 
to public 
with check (true);

create policy "Allow uploads for everyone"
on storage.objects for insert
to public
with check ( bucket_id = 'product-images' );
