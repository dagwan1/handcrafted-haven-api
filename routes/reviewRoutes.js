const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');

// Validation and sanitization middleware for reviews
const validateAndSanitizeReview = [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('comment').optional().isString().trim().withMessage('Comment should be a string'),
];

// Create a new review
router.post('/', validateAndSanitizeReview, reviewController.createReview);

// Get all reviews for a product
router.get('/product/:productId', reviewController.getReviewsForProduct);

// Get a single review by ID
router.get('/:id', reviewController.getSingleReview);

// Update a review by ID
router.put('/:id', validateAndSanitizeReview, reviewController.updateReview);

// Delete a review by ID
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
