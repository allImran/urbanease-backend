import { body } from 'express-validator'

// Base validation rules for business fields (all optional)
export const businessValidationRules = [
  body('logo').optional().isString(),
  body('slogan').optional().isString(),
  body('primary_color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Primary color must be a valid hex color (e.g., #FFFFFF)'),
  body('email').optional().isEmail().withMessage('Email must be valid'),
  body('social').optional().isObject().withMessage('Social must be an object'),
  body('address').optional().isString(),
]

// Validation rules for creating a business (includes required fields)
export const createBusinessValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  ...businessValidationRules,
]

// Validation rules for updating a business (all fields optional)
export const updateBusinessValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('slug').optional().notEmpty().withMessage('Slug cannot be empty'),
  ...businessValidationRules,
]
