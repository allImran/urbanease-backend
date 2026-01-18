-- 2. Create Products with Flexible Sections and Image Array
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  sections JSONB DEFAULT '[]', -- The "Flexible Blocks" live here
  category_id uuid REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Variants
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE,
  price DECIMAL,
  attributes JSONB, -- e.g. {"color": "blue", "size": "XL"}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
