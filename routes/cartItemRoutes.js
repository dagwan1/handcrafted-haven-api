const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cartItemController = require('../controllers/carttemController');

// Validation and sanitization middleware for cart items
const validateAndSanitizeCartItem = [
  body('cartId').isMongoId().withMessage('Valid cart ID is required'),
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive integer'),
];

// Create a new cart item
router.post('/', validateAndSanitizeCartItem, cartItemController.createCartItem);

// Get all cart items for a specific cart
router.get('/cart/:cartId', cartItemController.getCartItemsForCart);

// Get a single cart item by ID
router.get('/:id', cartItemController.getSingleCartItem);

// Update a cart item by ID
router.put('/:id', validateAndSanitizeCartItem, cartItemController.updateCartItem);

// Delete a cart item by ID
router.delete('/:id', cartItemController.deleteCartItem);

module.exports = router;
