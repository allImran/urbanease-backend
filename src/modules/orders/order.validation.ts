import { body } from 'express-validator'

export const createOrderValidation = [
  body('business_id').isUUID().withMessage('Business ID must be a valid UUID'),
  body('shipping_address').notEmpty().withMessage('Shipping address is required'),
  body('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
  body('items').isArray({ min: 1 }).withMessage('Items must be an array with at least one item'),
  body('items.*.product_id').isUUID().withMessage('Product ID must be a valid UUID'),
  body('items.*.variant_id').isUUID().withMessage('Variant ID must be a valid UUID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
]

export const updateOrderStatusValidation = [
  body('status').isIn([
    'pending', 'conducted', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled', 'returned', 'partially_returned'
  ]).withMessage('Invalid order status'),
  body('comment').optional().isString().withMessage('Comment must be a string')
]

export const updateOrderAdminValidation = [
  // Status is managed via history, not directly on order
  body('total_amount').optional().isNumeric().withMessage('Total amount must be a number'),
  body('shipping_address').optional().notEmpty().withMessage('Shipping address cannot be empty'),
  body('payment_intent_id').optional().isString().withMessage('Payment intent ID must be a string'),
  body('cod_reference').optional().trim().isString().withMessage('COD reference must be a string')
]

export const pickupRequestValidation = [
  // All fields optional — defaults are derived from the order itself
  body('recipient_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Recipient name must be between 1 and 100 characters'),
  body('recipient_phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Recipient phone cannot be empty'),
  body('recipient_address')
    .optional()
    .trim()
    .isLength({ min: 1, max: 250 })
    .withMessage('Recipient address must be between 1 and 250 characters'),
  body('cod_amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('COD amount must be a non-negative number'),
  body('note').optional().trim().isString().withMessage('Note must be a string'),
  body('item_description').optional().trim().isString().withMessage('Item description must be a string'),
  body('delivery_type')
    .optional()
    .isIn([0, 1])
    .withMessage('Delivery type must be 0 (home) or 1 (point)')
]
