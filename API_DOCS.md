# API Documentation

Base URL: `https://urbanease-backend.vercel.app/api`

## Authentication

- **Public**: `GET` requests for Businesses and Categories.
- **Protected**: `POST`, `PUT`, `DELETE` requests require a Bearer Token.
- **Header**: `Authorization: Bearer <token>`

---

## Business API

### Business Object Structure

```typescript
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "logo": "string | null",        // URL to business logo image
  "slogan": "string | null",      // Business slogan/tagline
  "primary_color": "string | null", // Hex color code (e.g., "#FFFFFF")
  "email": "string | null",       // Contact email
  "social": {                     // Social media links object
    "facebook": "string | undefined",
    "instagram": "string | undefined",
    "twitter": "string | undefined",
    "linkedin": "string | undefined",
    "website": "string | undefined"
  },
  "address": "string | null",     // Business address
  "is_active": true,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

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
    "slug": "business-slug",
    "logo": "https://example.com/logo.png",
    "slogan": "Your trusted partner",
    "primary_color": "#FF5733",
    "email": "contact@business.com",
    "social": {
      "facebook": "https://facebook.com/business",
      "instagram": "https://instagram.com/business",
      "twitter": "https://twitter.com/business",
      "linkedin": "https://linkedin.com/company/business",
      "website": "https://business.com"
    },
    "address": "123 Main St, City, State 12345"
  }
  ```
- **Validation**:
  - `name` (required): Non-empty string
  - `slug` (required): Non-empty string
  - `logo` (optional): Valid URL
  - `slogan` (optional): String
  - `primary_color` (optional): Hex color code (format: `#XXXXXX`)
  - `email` (optional): Valid email address
  - `social` (optional): Object with social media links
  - `address` (optional): String
- **Response**: Created Business object.

### Update Business

`PUT /businesses/:id`

- **Auth**: Admin only
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "slug": "updated-slug",
    "logo": "https://example.com/new-logo.png",
    "slogan": "New slogan",
    "primary_color": "#123456",
    "email": "newemail@business.com",
    "social": {
      "facebook": "https://facebook.com/new-business",
      "instagram": "https://instagram.com/new-business"
    },
    "address": "456 New Address, City, State 67890"
  }
  ```
- **Validation**: Same as Create Business (all fields optional)
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

---

## Product API

### Product Object Structure

```typescript
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "image_urls": ["string"],        // Array of image URLs
  "sections": [],                   // JSONB - flexible sections for content layout
  "category_id": "uuid | null",     // Reference to category
  "business_id": "uuid",            // Reference to business (required)
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Get All Products

`GET /products`

- **Auth**: Public
- **Response**: Array of Product objects with nested Category.

### Get Product by ID

`GET /products/:id`

- **Auth**: Public
- **Response**: Product object with nested Category and Variants.

### Create Product

`POST /products`

- **Auth**: Admin, Staff
- **Body**:
  ```json
  {
    "name": "Product Name",
    "slug": "product-slug",
    "image_urls": ["url1", "url2"],
    "sections": [{ "type": "text", "content": "..." }],
    "category_id": "uuid",
    "business_id": "uuid"
  }
  ```
- **Validation**:
  - `name` (required): Non-empty string
  - `slug` (required): Non-empty string
  - `category_id` (required): Valid UUID
  - `business_id` (required): Valid UUID
  - `image_urls` (optional): Array of image URLs
  - `sections` (optional): JSONB array for content layout
- **Response**: Created Product object.

### Update Product

`PUT /products/:id`

- **Auth**: Admin, Staff
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "slug": "updated-slug",
    "image_urls": ["url1"],
    "sections": [],
    "category_id": "uuid",
    "business_id": "uuid"
  }
  ```
- **Validation**: All fields optional, must be valid if provided
- **Response**: Updated Product object.

### Delete Product

`DELETE /products/:id`

- **Auth**: Admin only
- **Response**: 204 No Content

---

## Product Variant API

### Get Variants by Product ID

`GET /products/:id/variants`

- **Auth**: Public
- **Response**: Array of Variant objects.

### Create Variant

`POST /products/:id/variants`

- **Auth**: Admin, Staff
- **Body**:
  ```json
  {
    "sku": "SKU-123",
    "price": 99.99,
    "attributes": { "color": "blue", "size": "M" },
    "product_id": "uuid" // included in body validation but url param used for association
  }
  ```
- **Response**: Created Variant object.

### Update Variant

`PUT /products/variants/:id`

- **Auth**: Admin, Staff
- **Body**:
  ```json
  {
    "sku": "NEW-SKU",
    "price": 89.99,
    "attributes": { "color": "red" }
  }
  ```
- **Response**: Updated Variant object.

### Delete Variant

`DELETE /products/variants/:id`

- **Auth**: Admin only
- **Response**: 204 No Content

---

## File API

### Upload File

`POST /files/upload`

- **Auth**: Admin, Staff
- **Body**: `multipart/form-data`
  - `file`: The file to upload.
- **Response**:
  ```json
  {
    "url": "https://...",
    "path": "uploads/...",
    "size": 12345,
    "mimetype": "image/jpeg",
    "filename": "..."
  }
  ```

### Delete File

`DELETE /files/:path`

- **Auth**: Admin only
- **Description**: Deletes a file by its path (e.g., `uploads/image.jpg`). The path parameter can contain slashes.
- **Response**:
  ```json
  {
    "message": "File deleted successfully",
    "path": "uploads/..."
  }
  ```

---

## Order API

### Create Order

`POST /orders`

- **Auth**: Optional (Guest or Authenticated)
- **Description**: Creates a new order. If phone number is provided and user doesn't exist, a new customer account is automatically created. The order calculates total amount based on current variant prices and stores price snapshots. Initial status "pending" is recorded in the status history.
- **Body**:
  ```json
  {
    "business_id": "uuid",
    "shipping_address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "USA"
    },
    "phone": "+1234567890",
    "items": [
      {
        "product_id": "uuid",
        "variant_id": "uuid",
        "quantity": 2
      }
    ]
  }
  ```
- **Response**: Created Order object with nested Order Items. The `status` field is derived from the latest history entry.
  ```json
  {
    "id": "uuid",
    "user_id": "uuid",
    "total_amount": 199.98,
    "business_id": "uuid",
    "shipping_address": { ... },
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z",
    "order_items": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "variant_id": "uuid",
        "quantity": 2,
        "price_at_purchase": 99.99,
        "snapshot_name": "Product Name (SKU-123)"
      }
    ]
  }
  ```

### Get Order by ID

`GET /orders/:id`

- **Auth**: Public
- **Description**: Retrieves a specific order with its status history and full product details for each order item. No authentication required. The `status` field is derived from the latest status history entry.
- **Response**: Order object with nested Order Items (including full product details) and status history.
  ```json
  {
    "id": "uuid",
    "user_id": "uuid",
    "total_amount": 199.98,
    "business_id": "uuid",
    "shipping_address": { ... },
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z",
    "order_items": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "variant_id": "uuid",
        "quantity": 2,
        "price_at_purchase": 99.99,
        "snapshot_name": "Product Name (SKU-123)",
        "product": {
          "id": "uuid",
          "name": "Product Name",
          "slug": "product-slug",
          "image_urls": ["url1", "url2"],
          "category": { ... },
          "variants": [ ... ]
        }
      }
    ],
    "history": [
      {
        "id": "uuid",
        "order_id": "uuid",
        "status": "pending",
        "comment": null,
        "changed_at": "2025-01-15T10:30:00Z"
      }
    ],
    "status": "pending"
  }
  ```

### Get Order Status History

`GET /orders/:id/history`

- **Auth**: Required
- **Description**: Retrieves the status history for a specific order. Customers can only view their own order history; Admin/Staff can view any order's history.
- **Response**: Array of status history entries ordered by most recent first.
  ```json
  [
    {
      "id": "uuid",
      "order_id": "uuid",
      "status": "confirmed",
      "comment": "Order confirmed by staff",
      "changed_at": "2025-01-15T11:00:00Z"
    },
    {
      "id": "uuid",
      "order_id": "uuid",
      "status": "pending",
      "comment": null,
      "changed_at": "2025-01-15T10:30:00Z"
    }
  ]
  ```

### Get All Orders

`GET /orders`

- **Auth**: Admin, Staff only
- **Description**: Retrieves all orders with their status history included. The `status` field is derived from the latest status history entry for each order.
- **Response**: Array of Order objects with nested status history.
  ```json
  [
    {
      "id": "uuid",
      "user_id": "uuid",
      "total_amount": 199.98,
      "business_id": "uuid",
      "shipping_address": { ... },
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z",
      "order_items": [ ... ],
      "history": [
        {
          "id": "uuid",
          "order_id": "uuid",
          "status": "pending",
          "comment": null,
          "changed_at": "2025-01-15T10:30:00Z"
        }
      ],
      "status": "pending"
    }
  ]
  ```

### Get Orders by Business

`GET /orders/business/:id`

- **Auth**: Admin, Staff only
- **Description**: Retrieves all orders for a specific business with their status history included. The `status` field is derived from the latest status history entry for each order.
- **Query Params**:
  - `id`: Business UUID
- **Response**: Array of Order objects for the specified business with nested status history.
  ```json
  [
    {
      "id": "uuid",
      "user_id": "uuid",
      "total_amount": 199.98,
      "business_id": "uuid",
      "shipping_address": { ... },
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z",
      "order_items": [ ... ],
      "history": [
        {
          "id": "uuid",
          "order_id": "uuid",
          "status": "pending",
          "comment": null,
          "changed_at": "2025-01-15T10:30:00Z"
        }
      ],
      "status": "pending"
    }
  ]
  ```

### Update Order Status

`PATCH /orders/:id/status`

- **Auth**: Admin, Staff only
- **Description**: Updates the order status by adding a new entry to the status history. The `status` field is derived from the latest history entry.
- **Body**:
  ```json
  {
    "status": "confirmed",
    "comment": "Order confirmed by staff"
  }
  ```
- **Valid Status Values**: `pending`, `conducted`, `confirmed`, `paid`, `shipped`, `delivered`, `cancelled`, `returned`, `partially_returned`
- **Response**: Updated Order object with derived status.

### Update Order

`PATCH /orders/:id`

- **Auth**: Admin only
- **Description**: Full order update (all fields optional except validation constraints). Note: `status` cannot be updated directly via this endpoint - use `PATCH /orders/:id/status` instead. Status is derived from the status history.
- **Body**:
  ```json
  {
    "total_amount": 149.99,
    "shipping_address": { ... },
    "payment_intent_id": "pi_1234567890"
  }
  ```
- **Response**: Updated Order object.
