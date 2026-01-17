# Architecture Design: RBAC with Supabase Custom Claims

## Overview

We are implementing RBAC using Supabase Custom Claims. This avoids database lookups on every request for authorization, as the role is embedded in the JWT.

## Data Model

### Tables

- `public.profiles` (or `users`):
  - `id` (uuid, references `auth.users`)
  - `role` (enum: 'customer', 'staff', 'admin') - default 'customer'

### Functions & Triggers

1.  **`custom_access_token_hook`** (or simple trigger on update):
    - We will use a Postgres Trigger on the `public.profiles` table.
    - When `role` is updated, the trigger calls a function that updates `auth.users.raw_app_meta_data`.
    - Key: `app_metadata: { role: 'admin' }`

## Middleware Design (`role.middleware.ts`)

- Extracts JWT from `Authorization` header.
- Verifies token.
- Reads `user.app_metadata.role`.
- Compares against allowed roles for the route.

## API Design

- **No new API endpoints** are strictly required for _checking_ permissions (handled by middleware).
- **Admin APIs**:
  - `PATCH /users/:id/role`: Validates requester is Admin. Updates `public.profiles`.

## Constraints & Trade-offs

- **Latency**: Claims are updated in the JWT on the _next_ refresh. Force logout or token refresh might be needed for immediate effect, but for our use case (staff promotion), eventual consistency (minutes) is mostly acceptable, or we can force sign-out.
- **Complexity**: Requires SQL migrations for triggers/functions.
