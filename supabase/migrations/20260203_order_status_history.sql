-- Create order_status_history table
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  comment TEXT
);

-- Enable RLS on order_status_history
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON public.order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_changed_at ON public.order_status_history(changed_at DESC);

-- RLS Policies for order_status_history

-- Admin/Staff can read all history
CREATE POLICY "Admin and staff can read all order status history"
  ON public.order_status_history FOR SELECT
  USING ( auth.jwt() -> 'app_metadata' ->> 'role' IN ('admin', 'staff') );

-- Customers can read their own order history
CREATE POLICY "Customers can read their own order status history"
  ON public.order_status_history FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
  );

-- Only Admin/Staff can insert history (done via application logic)
CREATE POLICY "Only admin and staff can insert status history"
  ON public.order_status_history FOR INSERT
  WITH CHECK ( auth.jwt() -> 'app_metadata' ->> 'role' IN ('admin', 'staff') );
