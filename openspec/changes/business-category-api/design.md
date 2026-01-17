# Design: Business and Category APIs

## Data Model

### Business

- `id`: UUID (Primary Key)
- `name`: string
- `slug`: string (unique)
- `is_active`: boolean (default true)
- `created_at`: timestamp
- `updated_at`: timestamp

### Category

- `id`: UUID (Primary Key)
- `name`: string
- `parent_id`: UUID (foreign key to Category.id, nullable)
- `business_id`: UUID (foreign key to Business.id) -> _Assumed based on "business has many categories"_
- `is_active`: boolean (default true)
- `created_at`: timestamp
- `updated_at`: timestamp

## Relationships

- Business 1:N Category (or M:N? Request says "business has many categories". Usually implies categories belong to a business. If categories are shared, it's M:N. I will assume 1:N for now as it's simpler and standard for "business specific categories").

## API Endpoints

### Business

- `GET /businesses`
- `GET /businesses/:id`
- `POST /businesses`
- `PUT /businesses/:id`
- `DELETE /businesses/:id`: Soft delete (sets `is_active` to false).

### Category

- `GET /categories`
- `GET /categories/:id`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`: Soft delete (sets `is_active` to false).
- `GET /categories/roots`: Returns categories where `parent_id` is null.
