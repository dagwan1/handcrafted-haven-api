const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController')

// Validation and sanitization middleware for payments
const validateAndSanitizePayment = [
  body('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('paymentMethod').isString().trim().notEmpty().withMessage('Payment method is required'),
  body('paymentStatus')
    .optional()
    .isString()
    .isIn(['pending', 'complete', 'failed', 'refunded', 'cancelled']) // Validate against new statuses
    .withMessage('Payment status should be one of the following: pending, complete, failed, refunded, cancelled'),
  body('paymentDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Payment date must be a valid date'),
];

// Create a new payment
router.post('/', validateAndSanitizePayment, paymentController.createPayment);

// Get all payments for an order
router.get('/order/:orderId', paymentController.getPaymentsForOrder);

// Get a single payment by ID
router.get('/:id', paymentController.getSinglePayment);

// Update a payment by ID
router.put('/:id', validateAndSanitizePayment, paymentController.updatePayment);

// Delete a payment by ID
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
