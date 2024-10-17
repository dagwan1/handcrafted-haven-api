const express = require('express');
const multer = require('multer');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/productController');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename the file to avoid conflicts
  },
});

const upload = multer({ storage });

// Validation and sanitization middleware for products
const validateAndSanitizeProduct = [
  body('sellerId').isMongoId().withMessage('Valid seller ID is required'),
  body('title').isString().trim().notEmpty().withMessage('Product title is required'),
  body('description').optional().isString().trim().withMessage('Description should be a string'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
  body('categoryId').optional().isMongoId().withMessage('Valid category ID is required if provided'),
  body('status').optional().isString().trim().withMessage('Status should be a string'),
];

// Create a new product
router.post('/', upload.single('image'), validateAndSanitizeProduct, productController.createProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Get a single product by ID
router.get('/:id', productController.getSingleProduct);

// Update a product by ID
router.put('/:id', validateAndSanitizeProduct, productController.updateProduct);

// Delete a product by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
