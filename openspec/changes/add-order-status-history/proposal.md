# Change: Add Order Status History Tracking

## Why

The current order system only stores the current status of an order. There is no audit trail to track when and why status changes occurred. This limits visibility into the order lifecycle and makes it difficult to:

- Debug order processing issues
- Provide customers with detailed order progress information
- Audit staff/admin actions on orders
- Analyze order fulfillment patterns and delays

## What Changes

- Create a new `order_status_history` table to store all status transitions
- Modify existing order status update logic to automatically record history entries
- Add a new API endpoint to retrieve status history for an order
- Update the order detail response to optionally include status history
- Add optional comment field for status changes (e.g., "Package left warehouse", "Customer requested cancellation")

## Impact

- Affected specs: `order-status-history` (new), `order-management` (modified)
- Affected code: `src/modules/orders/order.repo.ts`, `src/modules/orders/order.handlers.ts`, `src/modules/orders/order.types.ts`, `src/modules/orders/order.routes.ts`, `src/modules/orders/order.validation.ts`
- Database: New `order_status_history` table with foreign key to `orders`

## Considerations

- History entries must be created atomically with status updates to ensure consistency
- The comment field should be optional for backward compatibility
- Consider whether to include history in the default order detail response or require an explicit query parameter/include flag
- RBAC: Admin/Staff can view all history; customers can only view their own order history
