# Implement RBAC using Supabase Custom Claims

## Summary

Implement Role-Based Access Control (RBAC) using Supabase Custom Claims to secure API endpoints based on user roles (Customer, Staff, Admin).

## Motivation

The current system lacks granular access control. We need to distinguish between Customers, Staff, and Admins to ensure users can only access resources appropriate for their role. Supabase Custom Claims provides a secure and efficient way to handle this by embedding roles directly into the JWT.

## Proposed Changes

1.  **Database Migration**:
    - Create a `user_roles` table (or similar) to store the authoritative role for each user.
    - Create a database function and trigger to sync this role into the user's `app_metadata` (Custom Claims) in Supabase Auth.
2.  **API/Middleware**:
    - Update `src/middlewares/role.middleware.ts` to read roles from the JWT `app_metadata`.
    - Create endpoints/logic to assign roles (Admin only).
3.  **Roles**:
    - **Customer**: Default role.
    - **Staff**: Operational access.
    - **Admin**: Full access.

## Detailed Explanation

We will use Supabase Auth hooks (triggers) to manage custom claims. When a user's role changes in our public schema (e.g., in a `profiles` or `user_roles` table), a Postgres trigger will call a function that updates the `raw_app_meta_data` field in the `auth.users` table. This ensures the JWT issued by Supabase always contains the current role.

Our Express middleware will then simply decode the JWT (without needing a DB lookup) to check specific permissions.
