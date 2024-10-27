// Import Mongoose library
const mongoose = require('mongoose');

// Define a Mongoose schema for the 'Seller' collection
const sellerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Ensures one-to-one relationship with the User
  },
  phone: {
    type: String,
    required: false
  },
  dob: {
    type: Date,
    required: false
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: false
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ], // Relation with products the seller has added
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export Mongoose model for the 'Seller' collection
module.exports = mongoose.model('Seller', sellerSchema);
