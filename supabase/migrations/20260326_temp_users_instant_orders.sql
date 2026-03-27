-- Migration: Temporary User and Instant Order System
-- Purpose: Enable admin-driven quick orders without Supabase Auth overhead

-- ============================================================================
-- 1. Temp Users Table (global, shared across all businesses)
-- ============================================================================
CREATE TABLE IF NOT EXISTS temp_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for temp users search
CREATE INDEX IF NOT EXISTS idx_temp_users_phone ON temp_users(phone);
CREATE INDEX IF NOT EXISTS idx_temp_users_name ON temp_users USING GIN (to_tsvector('english', name));

-- ============================================================================
-- 2. Instant Orders Table (business-isolated)
-- ============================================================================
CREATE TABLE IF NOT EXISTS instant_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES business(id) ON DELETE CASCADE,
  user_id UUID REFERENCES temp_users(id) ON DELETE SET NULL,
  temp_user_id UUID REFERENCES temp_users(id) ON DELETE SET NULL,
  customer_info JSONB NOT NULL DEFAULT '{"name":"","phone":"","address":""}'::jsonb,
  delivery_charge DECIMAL(10,2) DEFAULT 0,
  cod_reference TEXT,
  order_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Ensure either user_id or temp_user_id is set (but not both)
  CONSTRAINT check_user_reference CHECK (
    (user_id IS NOT NULL AND temp_user_id IS NULL) OR
    (user_id IS NULL AND temp_user_id IS NOT NULL)
  ),
  -- Valid order statuses
  CONSTRAINT valid_status CHECK (
    status IN ('pending', 'confirmed', 'canceled', 'returned', 'on_the_way', 'delivered')
  )
);

-- Indexes for performance and querying
CREATE INDEX IF NOT EXISTS idx_instant_orders_business_created ON instant_orders(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_instant_orders_business_status ON instant_orders(business_id, status);
CREATE INDEX IF NOT EXISTS idx_instant_orders_customer_info ON instant_orders USING GIN (customer_info);
CREATE INDEX IF NOT EXISTS idx_instant_orders_temp_user ON instant_orders(temp_user_id);
CREATE INDEX IF NOT EXISTS idx_instant_orders_user_id ON instant_orders(user_id);

-- ============================================================================
-- 3. Row Level Security (RLS) Policies
-- ============================================================================
ALTER TABLE instant_orders ENABLE ROW LEVEL SECURITY;

-- Business isolation policy: Users can only see orders from their business
CREATE POLICY instant_orders_business_isolation ON instant_orders
  FOR ALL
  USING (
    business_id IN (
      SELECT id FROM business WHERE id = business_id
    )
  );

-- Note: temp_users table has RLS disabled intentionally (global shared access)
ALTER TABLE temp_users FORCE ROW LEVEL SECURITY OFF;

-- ============================================================================
-- 4. Updated At Trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_temp_users_updated_at
  BEFORE UPDATE ON temp_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instant_orders_updated_at
  BEFORE UPDATE ON instant_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. Grant Permissions
-- ============================================================================
-- Grant access to service role (used by backend)
GRANT ALL ON temp_users TO service_role;
GRANT ALL ON instant_orders TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
