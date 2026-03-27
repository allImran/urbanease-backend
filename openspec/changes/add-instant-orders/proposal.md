# Change: Add Temporary Order System

## Why

The current order system requires authenticated users with Supabase accounts, which is too slow for admin-driven quick order workflows (e.g., phone orders, walk-in customers). Staff need a streamlined way to create orders without the overhead of full user account creation, while still maintaining customer data for future reference.

## What Changes

- Create `temp_users` table to store lightweight, globally accessible customer records (name, phone, address)
- Create `instant_orders` table for quick, admin-driven orders with business-level isolation
- Add Temp User module with CRUD and global search APIs
- Add Instant Orders module with creation, management, and retrieval APIs
- Implement automatic user resolution (use existing global temp user or create new one)
- Store customer snapshot in `customer_info` JSONB field for data immutability
- Add search capabilities for orders by customer name/phone within JSONB
- Implement business-level isolation for orders only (temp users are shared across businesses)

## Impact

- Affected specs: `temp-users`, `instant-orders`
- Affected code:
  - New: `src/modules/temp-users/`
  - New: `src/modules/instant-orders/`
  - Modified: `src/routes.ts`
- Database: New tables with RLS policies (orders only) and GIN indexes for JSONB search
