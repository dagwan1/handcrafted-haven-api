const mongoose = require('mongoose');

// Define a Mongoose schema for the 'Cart Item' collection
const cartItemSchema = new mongoose.Schema({
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShoppingCart',
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
    min: 1,
  },
});

// Create and export Mongoose model for the 'Cart Item' collection
const CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = CartItem;
