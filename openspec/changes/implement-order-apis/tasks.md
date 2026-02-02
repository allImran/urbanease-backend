# Tasks: Implement Order APIs

## 1. Database Setup

- [x] 1.1 Create migration for `orders` and `order_items` tables.
- [x] 1.2 Apply migration to Supabase.
- [x] 1.3 Verify RLS policies for `orders` and `order_items`.

## 2. Module Scaffolding

- [x] 2.1 Create `src/modules/orders/order.types.ts`.
- [x] 2.2 Create `src/modules/orders/order.repo.ts`.
- [x] 2.3 Create `src/modules/orders/order.validation.ts`.
- [x] 2.4 Create `src/modules/orders/order.handlers.ts`.
- [x] 2.5 Create `src/modules/orders/order.routes.ts`.
- [x] 2.6 Register order routes in `src/routes.ts`.

## 3. Implementation - Create Order

- [x] 3.1 Implement `createOrder` repo function (order + items).
- [x] 3.2 Implement user resolution logic (phone-based creation).
- [x] 3.3 Implement validation and handler for POST /orders.

## 4. Implementation - Management & Retrieval

- [x] 4.1 Implement `updateOrderStatus` handler (Admin/Staff).
- [x] 4.2 Implement `updateOrder` admin-only handler.
- [x] 4.3 Implement retrieval handlers (list, business-list, detail).

## 5. Testing & Validation

- [x] 5.1 Write integration tests for Order lifecycle.
- [x] 5.2 Validate RBAC for all endpoints.
