import { body, param, query } from 'express-validator'

export const createInstantOrderValidation = [
  body('business_id').isUUID().withMessage('Business ID must be a valid UUID'),
  body('user_id').optional().isUUID().withMessage('User ID must be a valid UUID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone('any')
    .withMessage('Invalid phone number format'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),
  body('delivery_charge')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Delivery charge must be a non-negative number'),
  body('cod_reference')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('COD reference must not exceed 100 characters'),
  body('order_items')
    .isArray({ min: 1 })
    .withMessage('Order items must be an array with at least one item'),
  body('order_items.*.title')
    .trim()
    .notEmpty()
    .withMessage('Order item title is required'),
  body('order_items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Order item price must be a non-negative number'),
  body('order_items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Order item quantity must be at least 1'),
  body('order_items.*.unit')
    .trim()
    .notEmpty()
    .withMessage('Order item unit is required')
]

export const updateInstantOrderValidation = [
  param('id').isNumeric().withMessage('Invalid instant order ID'),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'returned', 'on_the_way', 'delivered'])
    .withMessage('Invalid order status'),
  body('delivery_charge')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Delivery charge must be a non-negative number'),
  body('cod_reference')
    .optional()
    .trim(),
    // .isLength({ max: 100 })
    // .withMessage('COD reference must not exceed 100 characters'),
  body('order_items')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Order items must be an array with at least one item'),
  body('customer_info')
    .optional()
    .isObject()
    .withMessage('Customer info must be an object'),
  body('customer_info.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Customer name cannot be empty'),
  body('customer_info.phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Customer phone cannot be empty'),
  body('customer_info.address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Customer address cannot be empty')
]

export const listInstantOrdersValidation = [
  query('business_id').isUUID().withMessage('Business ID must be a valid UUID'),
  query('user_id').optional().isUUID().withMessage('User ID must be a valid UUID'),
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'returned', 'on_the_way', 'delivered'])
    .withMessage('Invalid order status'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Search query must be at least 2 characters'),
  query('from')
    .optional()
    .isISO8601()
    .withMessage('From date must be a valid ISO 8601 date'),
  query('to')
    .optional()
    .isISO8601()
    .withMessage('To date must be a valid ISO 8601 date'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
]
