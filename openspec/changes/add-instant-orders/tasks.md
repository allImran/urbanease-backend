# Tasks: Add Temporary Order System

## 1. Database Setup

- [x] 1.1 Create migration for `temp_users` table (global, no business_id)
- [x] 1.2 Create migration for `instant_orders` table with RLS policies
- [x] 1.3 Add GIN indexes on `instant_orders.customer_info` for JSONB search performance
- [x] 1.4 Add composite indexes on `(business_id, created_at)` for date-range queries
- [x] 1.5 Add composite indexes on `(business_id, status)` for status filtering
- [x] 1.6 Apply and verify all migrations in Supabase

## 2. Module Scaffolding - Temp Users

- [x] 2.1 Create `src/modules/temp-users/temp-user.types.ts`
- [x] 2.2 Create `src/modules/temp-users/temp-user.repo.ts`
- [x] 2.3 Create `src/modules/temp-users/temp-user.validation.ts`
- [x] 2.4 Create `src/modules/temp-users/temp-user.handlers.ts`
- [x] 2.5 Create `src/modules/temp-users/temp-user.routes.ts`

## 3. Module Scaffolding - Instant Orders

- [x] 3.1 Create `src/modules/instant-orders/instant-order.types.ts`
- [x] 3.2 Create `src/modules/instant-orders/instant-order.repo.ts`
- [x] 3.3 Create `src/modules/instant-orders/instant-order.validation.ts`
- [x] 3.4 Create `src/modules/instant-orders/instant-order.handlers.ts`
- [x] 3.5 Create `src/modules/instant-orders/instant-order.routes.ts`

## 4. Implementation - Temp Users API

- [x] 4.1 Implement `createTempUser` repo function (global, no business_id)
- [x] 4.2 Implement `updateTempUser` repo function
- [x] 4.3 Implement `searchTempUsers` repo function (global name/phone partial match)
- [x] 4.4 Implement POST /temp-users endpoint (create)
- [x] 4.5 Implement PATCH /temp-users/:id endpoint (update)
- [x] 4.6 Implement GET /temp-users/search endpoint with query params

## 5. Implementation - Instant Orders API

- [x] 5.1 Implement `resolveOrCreateTempUser` service function (global user resolution, no business check)
- [x] 5.2 Implement `createInstantOrder` repo function with customer snapshot
- [x] 5.3 Implement `updateInstantOrder` repo function (preserve customer_info unless explicit)
- [x] 5.4 Implement `fetchInstantOrders` with advanced filters (business, user, status, date range, pagination)
- [x] 5.5 Implement `fetchInstantOrderById` repo function
- [x] 5.6 Implement POST /instant-orders endpoint
- [x] 5.7 Implement PATCH /instant-orders/:id endpoint
- [x] 5.8 Implement GET /instant-orders with query params endpoint
- [x] 5.9 Implement GET /instant-orders/:id endpoint

## 6. Route Registration & Integration

- [x] 6.1 Register temp-users routes in `src/routes.ts`
- [x] 6.2 Register instant-orders routes in `src/routes.ts`
- [x] 6.3 Verify RBAC middleware is applied (Admin/Staff only)

## 7. Testing & Validation

- [ ] 7.1 Test temp user creation (global, unique phone enforcement)
- [ ] 7.2 Test temp user global search functionality
- [ ] 7.3 Test instant order creation with existing temp user
- [ ] 7.4 Test instant order creation with new temp user (auto-creation)
- [ ] 7.5 Test customer_info snapshot immutability on order updates
- [ ] 7.6 Test JSONB search performance with sample data
- [ ] 7.7 Test business isolation for orders (verify cross-business data leakage does not occur)
- [ ] 7.8 Test temp user sharing across businesses (global access)
- [ ] 7.9 Test validation rules (order_items schema, user_id vs name+phone)
- [ ] 7.10 Test pagination and date-range filtering
