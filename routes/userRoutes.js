const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Validation and sanitization middleware for the create User account form
const validateAndSanitizeUser = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('username').isString().trim().notEmpty().withMessage('Username is required'), 
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('userType').optional().isIn(['buyer', 'seller']).withMessage('User type must be either "buyer" or "seller"'),
  body('profilePicture').optional().isString().withMessage('Profile picture must be a valid URL'),
  body('bio').optional().isString().withMessage('Bio must be a string'),
  body('address').optional().isString().withMessage('Address must be a string'),
];

// Validation for login
const validateLogin = [
  body('username').isString().trim().notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 8 }).withMessage('Password is required')
];


// Validation for forgot password
const validateForgotPassword = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
];

// Validation for reset password
const validateResetPassword = [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
];

// Create a new User account (public, no authentication needed)
router.post('/', validateAndSanitizeUser, userController.createUser);

// User login (public, no authentication needed)
router.post('/login', validateLogin, userController.login);

// Request password reset (public, no authentication needed)
router.post('/forgot-password', validateForgotPassword, userController.forgotPassword);

// Reset password using token (public, no authentication needed)
router.post('/reset-password/:token', validateResetPassword, userController.resetPassword);

// Get all account entries (authenticated)
router.get('/', authMiddleware, userController.getAllUsers);

// Get a single account entry by ID (authenticated)
router.get('/:id', authMiddleware, userController.getSingleUser);

// Update account entry by ID (authenticated)
router.put('/:id', authMiddleware, validateAndSanitizeUser, userController.updateUser);

// Delete account entry by ID (authenticated)
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;
