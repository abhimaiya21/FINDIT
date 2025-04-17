import { body, param } from 'express-validator';

export const createItemValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['electronics', 'clothing', 'books', 'furniture', 'jewelry', 'other'])
    .withMessage('Invalid category'),

  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of 2 numbers [longitude, latitude]'),

  body('location.coordinates.*')
    .isFloat()
    .withMessage('Coordinates must be numbers'),

  body('lostDate')
    .notEmpty()
    .withMessage('Lost date is required')
    .isISO8601()
    .withMessage('Invalid date format (use YYYY-MM-DD)'),

  body('status')
    .optional()
    .isIn(['lost', 'found', 'returned'])
    .withMessage('Invalid status'),

  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),

  body('contactPhone')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number')
];

export const updateItemValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid item ID format'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),

  body('category')
    .optional()
    .isIn(['electronics', 'clothing', 'books', 'furniture', 'jewelry', 'other'])
    .withMessage('Invalid category'),

  body('location.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of 2 numbers'),

  body('location.coordinates.*')
    .optional()
    .isFloat()
    .withMessage('Coordinates must be numbers'),

  body('lostDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format (use YYYY-MM-DD)'),

  body('status')
    .optional()
    .isIn(['lost', 'found', 'returned'])
    .withMessage('Invalid status')
];