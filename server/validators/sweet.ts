import { body } from 'express-validator';

export const validateCreateSweet = [
  body('name')
    .notEmpty()
    .trim()
    .withMessage('Sweet name is required'),
  body('category')
    .notEmpty()
    .trim()
    .withMessage('Category is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('description')
    .optional()
    .trim(),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
];

export const validateUpdateSweet = [
  body('name')
    .optional()
    .notEmpty()
    .trim()
    .withMessage('Sweet name cannot be empty'),
  body('category')
    .optional()
    .notEmpty()
    .trim()
    .withMessage('Category cannot be empty'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('description')
    .optional()
    .trim(),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
];

export const validatePurchase = [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Purchase quantity must be at least 1'),
];

export const validateRestock = [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Restock quantity must be at least 1'),
];