# Tasks: Implement RBAC

- [x] Create SQL migration for `user_roles` handling <!-- id: 0 -->
  - Create `user_types` enum (`customer`, `staff`, `admin`).
  - Add `role` column to `profiles` table (default `customer`).
  - Create Postgres function to update `auth.users` metadata when `profiles.role` changes.
  - Create trigger on `profiles`.
- [x] Implement `role.middleware.ts` <!-- id: 1 -->
  - Decode JWT.
  - Verify array of allowed roles.
  - Deny access if role doesn't match.
- [x] Update `auth.middleware.ts` to attach user commands/claims to request <!-- id: 2 -->
- [x] Create Admin API to manage roles <!-- id: 3 -->
  - `PATCH /api/users/:userId/role`
  - Validator to ensure role is valid.
  - Handler to update `profiles` table.
- [x] Verify RBAC with tests/manual checks <!-- id: 4 -->
  - Test Customer accessing Admin route (Should fail).
  - Test Admin accessing Admin route (Should pass).
