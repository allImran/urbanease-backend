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
  ]).withMessage('Invalid order status')
]

export const updateOrderAdminValidation = [
  body('status').optional().isIn([
    'pending', 'conducted', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled', 'returned', 'partially_returned'
  ]).withMessage('Invalid order status'),
  body('total_amount').optional().isNumeric().withMessage('Total amount must be a number'),
  body('shipping_address').optional().notEmpty().withMessage('Shipping address cannot be empty'),
  body('payment_intent_id').optional().isString().withMessage('Payment intent ID must be a string')
]
