import { body, param, query, ValidationChain } from 'express-validator';

// User validation schemas
export const registerValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters'),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  
  body('role')
    .optional()
    .isIn(['customer', 'admin'])
    .withMessage('Role must be either "customer" or "admin"')
];

export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 128 })
    .withMessage('Password is too long')
];

// Sweet validation schemas
export const createSweetValidation: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Sweet name must be between 1 and 255 characters')
    .matches(/^[a-zA-Z0-9\s\-&'.,()]+$/)
    .withMessage('Sweet name contains invalid characters'),
  
  body('category')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-&'.,()]+$/)
    .withMessage('Category contains invalid characters'),
  
  body('price')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Price must be a positive number between 0.01 and 999999.99'),
  
  body('quantity')
    .isInt({ min: 0, max: 999999 })
    .withMessage('Quantity must be a non-negative integer up to 999999'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('image_url')
    .optional()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Image URL must be a valid HTTP/HTTPS URL')
    .isLength({ max: 500 })
    .withMessage('Image URL must be less than 500 characters')
];

export const updateSweetValidation: ValidationChain[] = [
  param('id')
    .isUUID()
    .withMessage('Sweet ID must be a valid UUID'),
  
  ...createSweetValidation
];

export const getSweetValidation: ValidationChain[] = [
  param('id')
    .isUUID()
    .withMessage('Sweet ID must be a valid UUID')
];

// Purchase validation schemas
export const purchaseValidation: ValidationChain[] = [
  param('id')
    .isUUID()
    .withMessage('Sweet ID must be a valid UUID'),
  
  body('quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be a positive integer between 1 and 100')
];

export const restockValidation: ValidationChain[] = [
  param('id')
    .isUUID()
    .withMessage('Sweet ID must be a valid UUID'),
  
  body('quantity')
    .isInt({ min: 1, max: 999999 })
    .withMessage('Quantity must be a positive integer up to 999999')
];

// Search validation schemas
export const searchValidation: ValidationChain[] = [
  query('name')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Search name must be less than 255 characters')
    .matches(/^[a-zA-Z0-9\s\-&'.,()]*$/)
    .withMessage('Search name contains invalid characters'),
  
  query('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search category must be less than 100 characters')
    .matches(/^[a-zA-Z0-9\s\-&'.,()]*$/)
    .withMessage('Search category contains invalid characters'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a non-negative number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a non-negative number'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer')
];

// Generic ID validation
export const idValidation: ValidationChain[] = [
  param('id')
    .isUUID()
    .withMessage('ID must be a valid UUID')
];
