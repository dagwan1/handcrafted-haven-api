const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const shoppingCartController = require('../controllers/shoppingCartController');

// Validation and sanitization middleware for the shopping cart
const validateAndSanitizeShoppingCart = [
  body('customerId').isMongoId().withMessage('Valid customer ID is required'),
  body('products').optional().isArray().withMessage('Products should be an array if provided'),
  body('products.*.product')
    .optional()
    .isMongoId()
    .withMessage('Valid product ID is required for each product'),
  body('products.*.quantity')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive number'),
];

// Create a new shopping cart
router.post('/', validateAndSanitizeShoppingCart, shoppingCartController.createShoppingCart);

// Get all shopping carts for a customer
router.get('/customer/:customerId', shoppingCartController.getCartsForCustomer);

// Get a single shopping cart by ID
router.get('/:id', shoppingCartController.getSingleCart);

// Update a shopping cart by ID
router.put('/:id', validateAndSanitizeShoppingCart, shoppingCartController.updateCart);

// Delete a shopping cart by ID
router.delete('/:id', shoppingCartController.deleteCart);

module.exports = router;
