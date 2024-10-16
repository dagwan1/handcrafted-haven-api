const mongoose = require('mongoose');

// Define a Mongoose schema for the 'Shopping Cart' collection
const shoppingCartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Create and export Mongoose model for the 'Shopping Cart' collection
const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);
module.exports = ShoppingCart;
