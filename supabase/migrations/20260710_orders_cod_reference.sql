-- Add COD/courier reference to regular orders (parity with instant_orders.cod_reference)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS cod_reference TEXT;
