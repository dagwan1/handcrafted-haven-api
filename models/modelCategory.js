const mongoose = require('mongoose');

// Define a Mongoose schema for the 'Category' collection
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

// Create and export Mongoose model for the 'Category' collection
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
