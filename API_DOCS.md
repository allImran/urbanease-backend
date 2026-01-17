# API Documentation

Base URL: `https://urbanease-backend.vercel.app/api`

## Authentication

- **Public**: `GET` requests for Businesses and Categories.
- **Protected**: `POST`, `PUT`, `DELETE` requests require a Bearer Token.
- **Header**: `Authorization: Bearer <token>`

---

## Business API

### Get All Businesses

`GET /businesses`

- **Auth**: Public
- **Response**: Array of Business objects.

### Get Business by ID

`GET /businesses/:id`

- **Auth**: Public
- **Response**: Business object.

### Create Business

`POST /businesses`

- **Auth**: Admin only
- **Body**:
  ```json
  {
    "name": "Business Name",
    "slug": "business-slug"
  }
  ```
- **Response**: Created Business object.

### Update Business

`PUT /businesses/:id`

- **Auth**: Admin only
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "slug": "updated-slug"
  }
  ```
- **Response**: Updated Business object.

### Delete Business

`DELETE /businesses/:id`

- **Auth**: Admin only
- **Description**: Soft deletes the business (sets `is_active` to false).

---

## Category API

### Get Root Categories

`GET /categories/roots`

- **Auth**: Public
- **Query Params**:
  - `business_id` (optional): Filter roots by business.
- **Response**: Array of root Category objects.

### Get All Categories

`GET /categories`

- **Auth**: Public
- **Query Params**:
  - `business_id` (optional): Filter by business.
- **Response**: Array of Category objects.

### Get Category by ID

`GET /categories/:id`

- **Auth**: Public
- **Response**: Category object.

### Create Category

`POST /categories`

- **Auth**: Admin, Staff
- **Body**:
  ```json
  {
    "name": "Category Name",
    "business_id": "uuid",
    "parent_id": "uuid" // optional
  }
  ```
- **Response**: Created Category object.

### Update Category

`PUT /categories/:id`

- **Auth**: Admin, Staff
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "parent_id": "uuid" // optional
  }
  ```
- **Response**: Updated Category object.

### Delete Category

`DELETE /categories/:id`

- **Auth**: Admin only
- **Description**: Soft deletes the category (sets `is_active` to false).
