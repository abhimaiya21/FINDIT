import express from 'express';
import {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  searchItems,
  getItemsWithinRadius,
  getItemStats,
  getMyItems
} from '../controllers/itemController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import upload from '../utils/upload.js';
import { validate, validateItem, validateFile } from '../middleware/validate.js';
import {
  createItemValidator,
  updateItemValidator
} from '../validators/itemValidators.js';

const router = express.Router();

// Public routes
router.get('/', getAllItems);
router.get('/stats', getItemStats);
router.get('/search', searchItems);
router.get('/:id', getItem);
router.get(
  '/items-within/:distance/center/:latlng/unit/:unit',
  getItemsWithinRadius
);

// Protected routes (require authentication)
router.use(protect);

// User's items routes
router.get('/me/items', getMyItems);

router.post(
  '/',
  upload.array('images', 5),
  validateFile,
  validate(createItemValidator),
  validateItem,
  createItem
);

router.patch(
  '/:id',
  upload.array('images', 5),
  validateFile,
  validate(updateItemValidator),
  validateItem,
  updateItem
);

router.delete('/:id', deleteItem);

// Admin-only routes
router.use(restrictTo('admin'));

// Admin specific routes
// Example:
// router.get('/admin/flagged', getFlaggedItems);

export default router;