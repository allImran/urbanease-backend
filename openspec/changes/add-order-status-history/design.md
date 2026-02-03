# DESIGN: Order Status History Tracking

## Architecture

The Order Status History feature extends the existing Order module:

- `order.routes.ts`: Add new endpoint for fetching status history
- `order.handlers.ts`: Add handlers and modify existing status update logic
- `order.repo.ts`: Add repo functions for history operations
- `order.types.ts`: Add TypeScript interfaces for status history
- `order.validation.ts`: Add validation for new parameters

## Sequence: Update Order Status with History

When an order status is updated:

1. **Validate Input**: Ensure the new status is valid and comment (if provided) is a string
2. **Database Transaction**:
   - Update `orders.status` to the new value
   - Insert a record into `order_status_history` with:
     - `order_id`: The order being updated
     - `status`: The new status value
     - `changed_at`: Current timestamp
     - `comment`: Optional comment provided by the user
3. **Response**: Return the updated order

## Database Schema

```sql
CREATE TABLE order_status_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  comment TEXT
);

-- Index for efficient queries
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_changed_at ON order_status_history(changed_at DESC);

-- RLS Policies
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Admin/Staff can read all history
CREATE POLICY "Admin and staff can read all order status history"
ON order_status_history FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM auth.users
    WHERE app_metadata->>'role' IN ('admin', 'staff')
  )
);

-- Customers can read their own order history
CREATE POLICY "Customers can read their own order status history"
ON order_status_history FOR SELECT
TO authenticated
USING (
  order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid()
  )
);

-- Only Admin/Staff can insert history (done via application logic)
CREATE POLICY "Only admin and staff can insert status history"
ON order_status_history FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM auth.users
    WHERE app_metadata->>'role' IN ('admin', 'staff')
  )
);
```

## API Design

### New Endpoint

```
GET /orders/:id/history
- Auth: Required
- Roles: Admin/Staff (all), Customer (own orders only)
- Response: Array of status history entries ordered by changed_at DESC
```

### Modified Endpoint

```
PATCH /orders/:id/status
- Existing endpoint enhanced to accept optional `comment` field
- Request body: { status: string, comment?: string }
```

### Enhanced Order Detail Response

```
GET /orders/:id?include=history
- Optional query parameter to include status history in the response
- When included, adds a `history` array to the response
```

## TypeScript Interfaces

```typescript
export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  changed_at: string;
  comment: string | null;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  comment?: string;
}
```

## Trade-offs

1. **Atomicity**: Using Supabase client, we cannot guarantee true atomic transactions across two tables. The insert will happen after the update. If the insert fails, the status will still be updated. Mitigation: Use a PostgreSQL function/trigger for production if true atomicity is required.

2. **History in Detail Response**: Including history by default could make responses large. Design uses optional `include=history` query parameter.

3. **Comment Field**: Optional to maintain backward compatibility with existing status update flows.

4. **Cleanup Policy**: Not implemented in initial scope. Consider adding retention policies (e.g., keep history for 2 years) in future iterations.
