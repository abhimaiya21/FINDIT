import express from 'express';
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo
} from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updatePasswordValidator
} from '../validators/authValidators.js';

const router = express.Router();

// Public routes
router.post('/signup', 
  validate(signupValidator),
  signup
);

router.post('/login', 
  validate(loginValidator),
  login
);

router.get('/logout', 
  logout
);

router.post('/forgotPassword', 
  validate(forgotPasswordValidator),
  forgotPassword
);

router.patch('/resetPassword/:token', 
  validate(resetPasswordValidator),
  resetPassword
);

// Protected routes (require authentication)
router.use(protect);

router.patch('/updateMyPassword', 
  validate(updatePasswordValidator),
  updatePassword
);

// Admin-only routes
router.use(restrictTo('admin'));

// Admin-specific routes can be added here
// Example:
// router.get('/admin/stats', getAdminStats);

export default router;