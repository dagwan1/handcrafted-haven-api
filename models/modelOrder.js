const mongoose = require('mongoose');

// Define a Mongoose schema for the 'Order' collection
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'pending',
  },
  shippingAddress: {
    type: String,
    required: true,
  },
});

// Create and export Mongoose model for the 'Order' collection
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
