const mongoose = require('mongoose');

// Define a Mongoose schema for the 'Order Item' collection
const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Create and export Mongoose model for the 'Order Item' collection
const OrderItem = mongoose.model('OrderItem', orderItemSchema);
module.exports = OrderItem;
