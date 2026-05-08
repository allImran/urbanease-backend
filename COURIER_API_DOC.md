# Courier API Documentation (Steadfast Courier Integration)

This document outlines the API endpoints for the Courier module, which integrates with Steadfast Courier service.

## Base URL
`/api/steadfast`

---

## 1. Create Single Order
Create a single delivery order in Steadfast.

- **URL:** `/create-order`
- **Method:** `POST`
- **Auth Required:** Yes (Role: `admin`, `staff`)
- **Validation:** Yes

### Request Body
```json
{
  "invoice": "INV-12345",         // Optional, max 100 chars (alphanumeric, -, _)
  "recipient_name": "John Doe",    // Required, max 100 chars
  "recipient_phone": "017XXXXXXXX", // Required, 11 digits numeric
  "recipient_address": "Dhaka, BD", // Required, max 250 chars
  "cod_amount": 500,               // Required, number (min 0)
  "alternative_phone": "018XXXXXXXX", // Optional, 11 digits numeric
  "recipient_email": "john@example.com", // Optional, valid email
  "note": "Handle with care",      // Optional, string
  "item_description": "Electronics", // Optional, string
  "total_lot": 1,                  // Optional, non-negative integer
  "delivery_type": 0               // Optional, 0 = home delivery, 1 = point delivery
}
```

### Success Response
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "consignment": {
    "consignment_id": 123456,
    "invoice": "INV-12345",
    "tracking_code": "SF-XXXXXXX",
    "recipient_name": "John Doe",
    "recipient_phone": "017XXXXXXXX",
    "recipient_address": "Dhaka, BD",
    "cod_amount": 500,
    "status": "pending",
    "note": "Handle with care",
    "created_at": "2026-05-07T13:31:54Z",
    "updated_at": "2026-05-07T13:31:54Z"
  }
}
```

### Error Responses
- **Code:** 400 Bad Request (Validation or API error)
- **Code:** 401 Unauthorized (Missing or invalid token)
- **Code:** 403 Forbidden (Insufficient permissions)
- **Code:** 503 Service Unavailable (Steadfast API unreachable)

---

## 2. Create Bulk Orders
Create multiple delivery orders at once (up to 500).

- **URL:** `/create-order/bulk`
- **Method:** `POST`
- **Auth Required:** Yes (Role: `admin`, `staff`)
- **Validation:** Yes

### Request Body
```json
{
  "data": [
    {
      "recipient_name": "User 1",
      "recipient_phone": "01711111111",
      "recipient_address": "Address 1",
      "cod_amount": 100
    },
    {
      "recipient_name": "User 2",
      "recipient_phone": "01722222222",
      "recipient_address": "Address 2",
      "cod_amount": 200
    }
  ]
}
```

### Success Response
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "results": [
    {
      "invoice": "...",
      "recipient_name": "User 1",
      "recipient_address": "Address 1",
      "recipient_phone": "01711111111",
      "cod_amount": "100",
      "note": null,
      "consignment_id": 123457,
      "tracking_code": "SF-YYYYYYY",
      "status": "success"
    },
    ...
  ]
}
```

---

## 3. Get Delivery Status by Consignment ID
Check the current status of a delivery using the Consignment ID.

- **URL:** `/delivery-status/cid/:cid`
- **Method:** `GET`
- **Auth Required:** No (Public)

### URL Params
- `cid`: The unique consignment ID provided by Steadfast.

### Success Response
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "delivery_status": "pending"
}
```

---

## 4. Get Delivery Status by Invoice
Check the current status of a delivery using your local Invoice number.

- **URL:** `/delivery-status/invoice/:invoice`
- **Method:** `GET`
- **Auth Required:** No (Public)

### URL Params
- `invoice`: Your order invoice number.

---

## 5. Get Delivery Status by Tracking Code
Check the current status of a delivery using the Tracking Code.

- **URL:** `/delivery-status/tracking/:trackingCode`
- **Method:** `GET`
- **Auth Required:** No (Public)

### URL Params
- `trackingCode`: The Steadfast tracking code.

---

## Possible Delivery Status Values
The `delivery_status` field can return one of the following strings:
- `pending`: Order placed, waiting for pickup.
- `delivered`: Order successfully delivered.
- `partial_delivered`: Order partially delivered.
- `cancelled`: Order cancelled.
- `hold`: Order is on hold.
- `in_review`: Order is under review.
- `delivered_approval_pending`: Delivered, but awaiting approval.
- `partial_delivered_approval_pending`: Partially delivered, awaiting approval.
- `cancelled_approval_pending`: Cancelled, awaiting approval.
- `unknown_approval_pending`: Unknown status, awaiting approval.
- `unknown`: Status could not be determined.
