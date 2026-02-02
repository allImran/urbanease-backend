-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending', -- pending, conducted, confirmed, paid, shipped, delivered, cancelled, returned, partially_returned.
  total_amount DECIMAL(12,2) NOT NULL,
  business_id uuid REFERENCES public.business(id),
  shipping_address JSONB,
  payment_intent_id TEXT, -- For Stripe/LemonSqueezy
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  variant_id uuid REFERENCES public.product_variants(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(12,2) NOT NULL,
  snapshot_name TEXT, -- Store "Product Name (Variant)" here
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_order_updated') THEN
    CREATE TRIGGER on_order_updated
      BEFORE UPDATE ON public.orders
      FOR EACH ROW
      EXECUTE PROCEDURE public.handle_updated_at();
  END IF;
END $$;

-- Policies for orders table

-- Read: Admin/Staff can see all, Users can see their own
CREATE POLICY "Admin and Staff can view all orders"
  ON public.orders FOR SELECT
  USING ( auth.jwt() -> 'app_metadata' ->> 'role' IN ('admin', 'staff') );

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING ( auth.uid() = user_id );

-- Create: Public (anyone can create an order, user resolution happens in backend)
CREATE POLICY "Public can create orders"
  ON public.orders FOR INSERT
  WITH CHECK ( true );

-- Update: Admin/Staff can update any order (status, etc.)
CREATE POLICY "Admin and Staff can update orders"
  ON public.orders FOR UPDATE
  USING ( auth.jwt() -> 'app_metadata' ->> 'role' IN ('admin', 'staff') );

-- Delete: Admin only
CREATE POLICY "Admin can delete orders"
  ON public.orders FOR DELETE
  USING ( auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' );

-- Policies for order_items table

-- Read: Inherit from order access
CREATE POLICY "Users can view items of their own orders"
  ON public.order_items FOR SELECT
  USING ( EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND (auth.uid() = orders.user_id OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'staff'))
  ));

-- Create: Same as order
CREATE POLICY "Public can create order items"
  ON public.order_items FOR INSERT
  WITH CHECK ( true );

-- Delete: Admin only
CREATE POLICY "Admin can delete order items"
  ON public.order_items FOR DELETE
  USING ( auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' );
