# Change: Implement Order APIs

## Why

The system currently lacks order processing capabilities. Implementing these APIs will enable customers to place orders and administrators to manage them.

## What Changes

- Create `orders` and `order_items` tables in the database.
- Implement the Order module with creation, management, and retrieval functionalities.
- Add automatic user creation during order placement if `user_id` is missing.
- Implement RBAC for order status updates and modifications.

## Impact

- Affected specs: `order-creation`, `order-management`, `order-retrieval`
- Affected code: `src/modules/orders/`, `src/routes.ts`
