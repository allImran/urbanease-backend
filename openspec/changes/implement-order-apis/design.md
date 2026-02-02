# DESIGN: Order Management System

## Architecture

The Order module will follow the standard project architecture:

- `order.routes.ts`: Route definitions and middleware wiring.
- `order.handlers.ts`: HTTP request handling and orchestration.
- `order.repo.ts`: Database interactions using Supabase client.
- `order.types.ts`: TypeScript interfaces for database records and DTOs.
- `order.validation.ts`: Request validation using `express-validator`.

## Sequence: Create Order

1. **Validate Input**: Ensure products exist, variants are valid, and required fields (shipping address, phone/user_id) are present.
2. **User Resolution**:
   - If `user_id` provided, verify user existence.
   - If `user_id` null, check if a user with the given `phone` already exists.
   - If no user exists, create one via `supabase.auth.admin.createUser`.
3. **Price Calculation**: Fetch current prices for all variants and calculate the total.
4. **Transaction (via Supabase/PostgreSQL)**:
   - Insert into `orders` table.
   - Insert into `order_items` table with snapshots.
5. **Response**: Return the completed order object.

## Database Schema (Incremental)

```sql
-- Existing migrations will be supplemented
CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending', -- pending, conducted, confirmed, paid, shipped, delivered, cancelled, returned, partially_returned.
  total_amount DECIMAL(12,2) NOT NULL,
  business_id uuid REFERENCES business(id),
  shipping_address JSONB,
  payment_intent_id TEXT, -- For Stripe/LemonSqueezy
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(12,2) NOT NULL,
  snapshot_name TEXT, -- Store "Product Name (Variant)" here
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## RBAC Matrix

| Endpoint                 | Admin | Staff | User (Customer) |
| :----------------------- | :---: | :---: | :-------------: |
| POST /orders             |  ✅   |  ✅   |       ✅        |
| PATCH /orders/:id/status |  ✅   |  ✅   |       ❌        |
| PATCH /orders/:id        |  ✅   |  ❌   |       ❌        |
| GET /orders              |  ✅   |  ✅   |       ❌        |
| GET /orders/business/:id |  ✅   |  ✅   |       ❌        |
| GET /orders/:id          |  ✅   |  ✅   |    ✅ (Own)     |
