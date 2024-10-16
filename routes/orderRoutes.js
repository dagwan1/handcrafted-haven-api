const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');

// Validation and sanitization middleware for orders
const validateAndSanitizeOrder = [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('totalPrice')
    .isFloat({ gt: 0 })
    .withMessage('Total price must be a positive number'),
  body('shippingAddress').isString().trim().notEmpty().withMessage('Shipping address is required'),
  body('status')
    .optional()
    .isString()
    .trim()
    .withMessage('Order status should be a string'),
  body('orderDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Order date must be a valid date'),
];

// Create a new order
router.post('/', validateAndSanitizeOrder, orderController.createOrder);

// Get all orders for a user
router.get('/user/:userId', orderController.getOrdersForUser);

// Get a single order by ID
router.get('/:id', orderController.getSingleOrder);

// Update an order by ID
router.put('/:id', validateAndSanitizeOrder, orderController.updateOrder);

// Delete an order by ID
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
