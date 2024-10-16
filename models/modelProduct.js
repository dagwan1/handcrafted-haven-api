const mongoose = require('mongoose');

// Define a Mongoose schema for the 'Product' collection
const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  stockQuantity: {
    type: Number,
    default: 0,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  imageUrl: {
    type: String,
  },
  status: {
    type: String,
    default: 'active',
  },
});

// Create and export Mongoose model for the 'Product' collection
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
