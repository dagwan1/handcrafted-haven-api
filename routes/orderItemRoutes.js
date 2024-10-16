const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderItemController = require('../controllers/orderItemController');

// Validation and sanitization middleware for order items
const validateAndSanitizeOrderItem = [
  body('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive integer'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),
];

// Create a new order item
router.post('/', validateAndSanitizeOrderItem, orderItemController.createOrderItem);

// Get all order items for an order
router.get('/order/:orderId', orderItemController.getOrderItemsForOrder);

// Get a single order item by ID
router.get('/:id', orderItemController.getSingleOrderItem);

// Update an order item by ID
router.put('/:id', validateAndSanitizeOrderItem, orderItemController.updateOrderItem);

// Delete an order item by ID
router.delete('/:id', orderItemController.deleteOrderItem);

module.exports = router;
