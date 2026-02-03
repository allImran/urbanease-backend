# Tasks: Add Order Status History Tracking

## 1. Database Setup

- [x] 1.1 Create migration for `order_status_history` table with indexes
- [ ] 1.2 Apply migration to Supabase
- [ ] 1.3 Configure RLS policies for `order_status_history`
- [ ] 1.4 Verify foreign key constraint to `orders` table

## 2. Module Type Definitions

- [x] 2.1 Add `OrderStatusHistory` interface to `order.types.ts`
- [x] 2.2 Extend `UpdateOrderStatusDTO` to include optional `comment` field
- [x] 2.3 Update `Order` interface to optionally include `history` array

## 3. Repository Layer

- [x] 3.1 Implement `insertStatusHistory` repo function
- [x] 3.2 Implement `fetchOrderStatusHistory` repo function with ordering
- [x] 3.3 Modify `updateOrder` to optionally record status history
- [x] 3.4 Implement `updateOrderWithHistory` function for atomic status + history operations

## 4. Validation Layer

- [x] 4.1 Update `updateOrderStatusValidation` to accept optional `comment` field
- [x] 4.2 Add validation for `include` query parameter (if implementing include flag)

## 5. Handler Layer

- [x] 5.1 Modify `updateOrderStatusHandler` to accept and record optional comment
- [x] 5.2 Implement `getOrderStatusHistoryHandler` for GET /orders/:id/history
- [x] 5.3 Modify `getOrderHandler` to optionally include history when `include=history` query param is provided

## 6. Routing Layer

- [x] 6.1 Add GET /orders/:id/history route with auth and RBAC middleware
- [x] 6.2 Verify existing PATCH /orders/:id/status route supports new comment field

## 7. Testing & Validation

- [ ] 7.1 Test automatic history creation on status updates
- [ ] 7.2 Test history retrieval endpoint (admin, staff, customer own orders)
- [ ] 7.3 Test optional comment field behavior
- [ ] 7.4 Verify RBAC: customers cannot see other customers' order history
- [ ] 7.5 Test that history is ordered by `changed_at` DESC (most recent first)
- [ ] 7.6 Test include=history query parameter on order detail endpoint
