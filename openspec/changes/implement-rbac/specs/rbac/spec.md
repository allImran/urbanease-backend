## ADDED Requirements

### Requirement: Role-Based Access Control

The system MUST restrict access to sensitive endpoints based on the authenticated user's assigned role.

#### Scenario: Customer attempts changes

Given a user with the `customer` role
When they attempt to access an administrative endpoint (e.g., `POST /api/products`)
Then the system should return a 403 Forbidden error

#### Scenario: Staff manages orders

Given a user with the `staff` role
When they access the order management endpoint (e.g., `PATCH /api/orders/:id/status`)
Then the request should be successful

#### Scenario: Staff denied system settings

Given a user with the `staff` role
When they access a system setting endpoint (e.g., `POST /api/admin/settings`)
Then the system should return a 403 Forbidden error

#### Scenario: Admin full access

Given a user with the `admin` role
When they access any protected endpoint
Then the request should be successful

### Requirement: Role Management

Admins MUST be able to assign roles to other users.

#### Scenario: Admin promotes user

Given a user A with `admin` role
When user A sends a request to update user B's role to `staff`
Then user B's role is updated in the database
And user B's auth metadata is updated to reflect the `staff` role
