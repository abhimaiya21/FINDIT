import { body, validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

// Item validation middleware
export const validateItem = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
    
  body('location.coordinates')
    .isArray({ min: 2, max: 2 }).withMessage('Invalid coordinates format')
    .custom(([lng, lat]) => {
      if (typeof lng !== 'number' || typeof lat !== 'number') {
        throw new Error('Coordinates must be numbers');
      }
      if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
        throw new Error('Invalid coordinate values');
      }
      return true;
    }),
    
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 500 }).withMessage('Description must be 10-500 characters'),

  body('category')
    .isIn(['electronics', 'clothing', 'books', 'furniture', 'other'])
    .withMessage('Invalid category'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg).join(', ');
      return next(new AppError(errorMessages, 400));
    }
    next();
  }
];

// File upload validation middleware
export const validateFile = (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an image file', 400));
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return next(new AppError('Only JPEG, PNG, or GIF images are allowed', 400));
  }
  
  next();
};

// Error handling middleware (should be last middleware)
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      status: 'error',
      message: messages.join(', ')
    });
  }

  // Handle Multer file errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'error',
      message: 'File too large (max 5MB)'
    });
  }

  // Generic server error
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  });
};

// Combined validation for routes
export const validate = (validations) => {
  return [
    ...validations,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return next(new AppError(errorMessages.join(', '), 400));
      }
      next();
    }
  ];
};