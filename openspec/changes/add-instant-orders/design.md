# DESIGN: Temporary Order System

## Context

The existing order system (`orders` table) is tightly coupled with Supabase Auth users, requiring full user account creation for every order. This creates friction for admin-driven quick orders (phone orders, walk-in customers) where speed is critical.

**Stakeholders**: Admin staff, customer service representatives
**Constraints**: Must maintain business isolation, must support future customer re-use

## Goals / Non-Goals

**Goals**:
- Enable rapid order creation without Supabase Auth overhead
- Provide searchable customer history for repeat customers
- Maintain data immutability (customer snapshot at order time)
- Support multi-business isolation
- Keep implementation simple and focused on admin workflow

**Non-Goals**:
- Customer-facing order management (use existing `orders` table)
- Payment integration (COD only, via `cod_reference`)
- Shipping calculations (manual `delivery_charge` input)
- User account migration from temp to full (future enhancement)

## Architecture

### Module Structure

Following project conventions (functional style, no classes):

```
src/modules/temp-users/
├── temp-user.routes.ts      # Route wiring
├── temp-user.handlers.ts    # HTTP handling
├── temp-user.repo.ts        # Database operations
└── temp-user.types.ts       # TypeScript types

src/modules/instant-orders/
├── instant-order.routes.ts  # Route wiring
├── instant-order.handlers.ts # HTTP handling
├── instant-order.repo.ts    # Database operations
└── instant-order.types.ts   # TypeScript types
```

### User Resolution Logic (Pseudo Code)

```typescript
async function resolveOrCreateTempUser(params: {
  user_id?: string
  name?: string
  phone?: string
  address?: string
}): Promise<{ temp_user_id: string, customer_info: CustomerInfo }> {

  // Path 1: user_id provided - fetch existing (global, no business check)
  if (params.user_id) {
    const user = await fetchTempUserById(params.user_id)
    if (!user) {
      throw new Error('Temp user not found')
    }
    return {
      temp_user_id: user.id,
      customer_info: {
        name: user.name,
        phone: user.phone,
        address: user.address
      }
    }
  }

  // Path 2: No user_id - create new temp user (global)
  if (!params.name || !params.phone) {
    throw new Error('name and phone required when user_id not provided')
  }

  const newUser = await createTempUser({
    name: params.name,
    phone: params.phone,
    address: params.address || ''
  })

  return {
    temp_user_id: newUser.id,
    customer_info: {
      name: newUser.name,
      phone: newUser.phone,
      address: newUser.address
    }
  }
}
```

### Order Creation Flow (Pseudo Code)

```typescript
async function createInstantOrderHandler(req, res) {
  const { business_id, user_id, name, phone, address, delivery_charge, cod_reference, order_items } = req.body

  // 1. Validate business_id from JWT
  if (req.user.business_id !== business_id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  // 2. Resolve or create temp user (global lookup)
  const { temp_user_id, customer_info } = await resolveOrCreateTempUser({
    user_id,
    name,
    phone,
    address
  })

  // 3. Validate order_items structure
  if (!validateOrderItems(order_items)) {
    return res.status(400).json({ error: 'Invalid order_items' })
  }

  // 4. Create order with customer snapshot
  const order = await createInstantOrder({
    business_id,
    temp_user_id,
    customer_info,  // JSONB snapshot - immutable
    delivery_charge,
    cod_reference,
    order_items,
    status: 'pending'
  })

  res.status(201).json(order)
}
```

## Database Schema

```sql
-- Temp Users Table (global, shared across all businesses)
CREATE TABLE temp_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Instant Orders Table
CREATE TABLE instant_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES business(id) ON DELETE CASCADE,
  user_id UUID REFERENCES temp_users(id) ON DELETE SET NULL,
  temp_user_id UUID REFERENCES temp_users(id) ON DELETE SET NULL,
  customer_info JSONB NOT NULL, -- Immutable snapshot: {name, phone, address}
  delivery_charge DECIMAL(10,2) DEFAULT 0,
  cod_reference TEXT,
  order_items JSONB NOT NULL, -- Array of objects
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  CONSTRAINT check_user_reference CHECK (
    (user_id IS NOT NULL AND temp_user_id IS NULL) OR
    (user_id IS NULL AND temp_user_id IS NOT NULL)
  ),
  CONSTRAINT valid_status CHECK (
    status IN ('pending', 'confirmed', 'canceled', 'returned', 'on_the_way', 'delivered')
  )
);

-- Indexes for Performance
CREATE INDEX idx_instant_orders_business_created ON instant_orders(business_id, created_at DESC);
CREATE INDEX idx_instant_orders_business_status ON instant_orders(business_id, status);
CREATE INDEX idx_instant_orders_customer_info ON instant_orders USING GIN (customer_info);

-- RLS Policies (Business Isolation for orders only)
-- Note: temp_users is global and shared across all businesses
ALTER TABLE instant_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY instant_orders_business_isolation ON instant_orders
  FOR ALL USING (business_id IN (SELECT id FROM business WHERE id = business_id));
```

## API Route Structure

### Temp Users
```
POST   /api/temp-users           - Create temp user (global)
PATCH  /api/temp-users/:id       - Update temp user
GET    /api/temp-users/search    - Search by name or phone (global)
```

### Instant Orders
```
POST   /api/instant-orders              - Create order
PATCH  /api/instant-orders/:id          - Update order (status, items, etc.)
GET    /api/instant-orders              - List orders (filters + pagination)
GET    /api/instant-orders/:id          - Get single order
```

## Request/Response Examples

### Create Temp User
```bash
POST /api/temp-users
{
  "name": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

### Create Instant Order (with existing user)
```bash
POST /api/instant-orders
{
  "business_id": "uuid-123",
  "user_id": "temp-user-uuid",
  "delivery_charge": 5.00,
  "cod_reference": "COD-12345",
  "order_items": [
    { "title": "Product A", "price": 10.00, "quantity": 2, "unit": "pcs" }
  ]
}
```

### Create Instant Order (with new customer)
```bash
POST /api/instant-orders
{
  "business_id": "uuid-123",
  "name": "Jane Smith",
  "phone": "+0987654321",
  "address": "456 Oak Ave",
  "delivery_charge": 5.00,
  "cod_reference": "COD-67890",
  "order_items": [
    { "title": "Product B", "price": 25.00, "quantity": 1, "unit": "kg" }
  ]
}
```

### Search Orders (customer name/phone)
```bash
GET /api/instant-orders?business_id=uuid-123&search=John&status=pending&from=2026-01-01&to=2026-03-31&page=1&limit=20
```

## Controller/Service Layer Responsibilities

### Temp Users
- **Routes**: Method/path definitions, middleware wiring
- **Handlers**: Request validation, response formatting, error handling
- **Repo**: Supabase queries, data transformation

### Instant Orders
- **Routes**: Method/path definitions, middleware wiring
- **Handlers**:
  - User resolution orchestration
  - Customer snapshot creation
  - Order item validation
  - Response formatting
- **Repo**:
  - Order CRUD operations
  - JSONB search queries
  - Filter/pagination logic

## Validation Logic

### Order Items Schema
```typescript
const orderItemSchema = {
  title: { type: 'string', required: true },
  price: { type: 'number', min: 0, required: true },
  quantity: { type: 'number', min: 1, integer: true, required: true },
  unit: { type: 'string', required: true }
}
```

### User Logic Validation
```typescript
// Either user_id OR (name + phone) must be provided
if (!user_id && (!name || !phone)) {
  throw new Error('Either user_id or (name + phone) is required')
}

// If user_id provided, it must exist (global lookup, no business check)
if (user_id) {
  const user = await fetchTempUserById(user_id)
  if (!user) {
    throw new Error('Invalid user_id')
  }
}
```

## Error Handling Strategy

- **400**: Validation errors (missing fields, invalid order_items, user not found)
- **403**: Business isolation violations
- **404**: Resource not found
- **500**: Database errors (logged, generic message to client)

All errors follow centralized error format:
```json
{
  "error": "Error type",
  "message": "Human-readable description",
  "details": {} // Optional additional context
}
```

## Risks / Trade-offs

### Data Duplication
- **Risk**: Customer info exists in both `temp_users` and `customer_info` snapshot
- **Mitigation**: This is intentional - `customer_info` preserves order-time data, `temp_users` maintains current info

### Search Performance
- **Risk**: JSONB search may be slower with large datasets
- **Mitigation**: GIN indexes on `customer_info`, consider full-text search if performance issues arise

### Temp User Proliferation
- **Risk**: Duplicate temp users for same customer (typos in phone/name)
- **Mitigation**: Search-before-create pattern in UI (future), unique constraint on `phone` (global)

## Migration Plan

**Steps**:
1. Deploy database migrations (tables, indexes, RLS)
2. Deploy new modules (temp-users, instant-orders)
3. Verify business isolation for instant_orders with test data
4. Verify temp users are globally accessible
5. Update admin UI to use new endpoints

**Rollback**:
1. Remove route registrations from `src/routes.ts`
2. Drop `instant_orders` and `temp_users` tables
3. No data loss (system is additive)

## Open Questions

- Should we support migration from `temp_users` to full Supabase Auth users? (Deferred)
- Should order status changes be audited in a history table? (Consider based on usage)
- Is `cod_reference` globally unique or per-business? (Assuming per-business)
