const mongoose = require('mongoose');

// Define a Mongoose schema for the 'Payment' collection
const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'complete', 'failed', 'refunded', 'cancelled'], 
    default: 'pending',
  },
});

// Create and export Mongoose model for the 'Payment' collection
const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
