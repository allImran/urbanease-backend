# Category Spec

## ADDED Requirements

### Requirement: Category Management

The system MUST provide capabilities to manage categories, including hierarchy and business association.

#### Scenario: Category Resource

The system MUST support a `Category` resource with the following fields:

- `id`: Unique identifier (UUID).
- `name`: String, required.
- `parent_id`: UUID, nullable (self-referencing for hierarchy).
- `business_id`: UUID, required (foreign key to Business).
- `is_active`: Boolean, default true.
- `created_at`: Datetime.
- `updated_at`: Datetime.

#### Scenario: List Categories

`GET /categories`

- MUST return a paginated list of categories.
- Optional query param `business_id` to filter by business.

#### Scenario: Get Category

`GET /categories/:id`

- MUST return the category details.

#### Scenario: Create Category

`POST /categories`

- MUST create a new category.
- Request body: `name`, `parent_id` (optional), `business_id`.
- Response 201: Created Category object.

#### Scenario: Update Category

`PUT /categories/:id`

- MUST update the category.
- Request body: `name`, `parent_id`.

#### Scenario: Delete Category

`DELETE /categories/:id`

- MUST soft delete the category (set `is_active` to false).

#### Scenario: Get Root Categories

`GET /categories/roots`

- MUST return all categories where `parent_id` is null.
- Optional query param `business_id` to filter roots by business.
