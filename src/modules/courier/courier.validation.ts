import { body, param, query } from 'express-validator'

export const createOrderValidation = [
  body('invoice')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Invoice cannot exceed 100 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Invoice can only contain alphanumeric characters, hyphens, and underscores'),
  body('recipient_name')
    .trim()
    .notEmpty()
    .withMessage('Recipient name is required')
    .isLength({ max: 100 })
    .withMessage('Recipient name cannot exceed 100 characters'),
  body('recipient_phone')
    .trim()
    .notEmpty()
    .withMessage('Recipient phone is required')
    .isNumeric()
    .withMessage('Recipient phone must be numeric')
    .isLength({ min: 11, max: 11 })
    .withMessage('Recipient phone must be 11 digits'),
  body('recipient_address')
    .trim()
    .notEmpty()
    .withMessage('Recipient address is required')
    .isLength({ max: 250 })
    .withMessage('Recipient address cannot exceed 250 characters'),
  body('cod_amount')
    .isNumeric()
    .withMessage('COD amount must be a number')
    .isFloat({ min: 0 })
    .withMessage('COD amount cannot be less than 0'),
  body('alternative_phone')
    .optional()
    .trim()
    .isNumeric()
    .withMessage('Alternative phone must be numeric')
    .isLength({ min: 11, max: 11 })
    .withMessage('Alternative phone must be 11 digits'),
  body('recipient_email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Recipient email must be a valid email address'),
  body('note')
    .optional()
    .trim()
    .isString()
    .withMessage('Note must be a string'),
  body('item_description')
    .optional()
    .trim()
    .isString()
    .withMessage('Item description must be a string'),
  body('total_lot')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total lot must be a non-negative integer'),
  body('delivery_type')
    .optional()
    .isIn([0, 1])
    .withMessage('Delivery type must be 0 (home delivery) or 1 (point delivery)')
]

export const bulkOrderValidation = [
  body('data')
    .isArray({ min: 1, max: 500 })
    .withMessage('Data must be an array with 1-500 items'),
  body('data.*.invoice')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Invoice cannot exceed 100 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Invoice can only contain alphanumeric characters, hyphens, and underscores'),
  body('data.*.recipient_name')
    .trim()
    .notEmpty()
    .withMessage('Recipient name is required for each order')
    .isLength({ max: 100 })
    .withMessage('Recipient name cannot exceed 100 characters'),
  body('data.*.recipient_phone')
    .trim()
    .notEmpty()
    .withMessage('Recipient phone is required for each order')
    .isNumeric()
    .withMessage('Recipient phone must be numeric')
    .isLength({ min: 11, max: 11 })
    .withMessage('Recipient phone must be 11 digits'),
  body('data.*.recipient_address')
    .trim()
    .notEmpty()
    .withMessage('Recipient address is required for each order')
    .isLength({ max: 250 })
    .withMessage('Recipient address cannot exceed 250 characters'),
  body('data.*.cod_amount')
    .isNumeric()
    .withMessage('COD amount must be a number')
    .isFloat({ min: 0 })
    .withMessage('COD amount cannot be less than 0'),
  body('data.*.alternative_phone')
    .optional()
    .trim()
    .isNumeric()
    .withMessage('Alternative phone must be numeric')
    .isLength({ min: 11, max: 11 })
    .withMessage('Alternative phone must be 11 digits'),
  body('data.*.recipient_email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Recipient email must be a valid email address'),
  body('data.*.note')
    .optional()
    .trim()
    .isString()
    .withMessage('Note must be a string'),
  body('data.*.item_description')
    .optional()
    .trim()
    .isString()
    .withMessage('Item description must be a string'),
  body('data.*.total_lot')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total lot must be a non-negative integer'),
  body('data.*.delivery_type')
    .optional()
    .isIn([0, 1])
    .withMessage('Delivery type must be 0 (home delivery) or 1 (point delivery)')
]

export const deliveryStatusByCidValidation = [
  param('cid')
    .trim()
    .notEmpty()
    .withMessage('Consignment ID is required')
]

export const deliveryStatusByInvoiceValidation = [
  param('invoice')
    .trim()
    .notEmpty()
    .withMessage('Invoice is required')
]

export const deliveryStatusByTrackingCodeValidation = [
  param('trackingCode')
    .trim()
    .notEmpty()
    .withMessage('Tracking code is required')
]
