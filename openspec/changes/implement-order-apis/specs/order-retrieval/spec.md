# SPEC: Order Retrieval

## ADDED Requirements

### Requirement: Business-Specific Order List

The system MUST provide a way to filter orders by business ID.

- **Role**: admin, staff

#### Scenario: Fetch orders for business X

- **WHEN** request is made for `business_id: "X"`
- **THEN** only orders belonging to business X are returned

### Requirement: Detailed Order View

Fetching a single order MUST include related business, user, product, and variant details.

- **Role**: authenticated

#### Scenario: View order details

- **WHEN** a valid order ID is requested
- **THEN** response includes nested objects for `user`, `business`, and `items`
