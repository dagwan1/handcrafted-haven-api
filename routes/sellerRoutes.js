const express = require('express');
const { body } = require('express-validator');
const sellerController = require('../controllers/sellerController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation and sanitization middleware for seller profiles
const validateAndSanitizeSeller = [
  body('phone')
    .optional()
    .isString()
    .trim()
    .withMessage('Valid phone number is required'),
  body('dob')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid date of birth is required'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Valid gender is required'),
];

// Create a new seller profile
router.post('/', authMiddleware, validateAndSanitizeSeller, sellerController.createSeller);

// Get all sellers
router.get('/', authMiddleware, sellerController.getAllSellers);

// Get a single seller by ID
router.get('/:id', authMiddleware, sellerController.getSingleSeller);

// Update a seller profile by ID
router.put('/:id', authMiddleware, validateAndSanitizeSeller, sellerController.updateSeller);

// Delete a seller profile by ID
router.delete('/:id', authMiddleware, sellerController.deleteSeller);

module.exports = router;
