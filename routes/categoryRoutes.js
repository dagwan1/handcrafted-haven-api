const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');

// Validation and sanitization middleware for categories
const validateAndSanitizeCategory = [
  body('name')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Category name is required'),
  body('description')
    .optional()
    .isString()
    .trim()
    .withMessage('Description should be a string'),
];

// Create a new category
router.post('/', validateAndSanitizeCategory, categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get a single category by ID
router.get('/:id', categoryController.getSingleCategory);

// Update a category by ID
router.put('/:id', validateAndSanitizeCategory, categoryController.updateCategory);

// Delete a category by ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
