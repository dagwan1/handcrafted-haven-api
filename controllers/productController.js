const mongodb = require('../db/db');
const { validationResult } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

// Create a new product
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sellerId, title, description, price, stockQuantity, categoryId, imageUrl, status } = req.body;

    // Create the new product entry object
    const productEntry = {
      sellerId: new ObjectId(sellerId),
      title,
      description,
      price,
      stockQuantity: stockQuantity || 0,
      categoryId: categoryId ? new ObjectId(categoryId) : null,
      imageUrl,
      status: status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new product entry into the 'products' collection
    const response = await mongodb.getDb().db().collection('products').insertOne(productEntry);

    if (response.acknowledged) {
      res.status(201).json({ success: 'Product created successfully', productId: response.insertedId });
    } else {
      res.status(500).json({ error: 'Error occurred while creating the product.' });
    }
  } catch (error) {
    console.error('Error creating a product:', error);
    res.status(500).json({ error: 'An error occurred while creating the product.' });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('products').find();
    const products = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
};

// Get a single product by ID
const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID format.' });
    }

    const productEntry = await mongodb.getDb().db().collection('products').findOne({ _id: new ObjectId(productId) });

    if (!productEntry) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.status(200).json(productEntry);
  } catch (error) {
    console.error('Error fetching a single product by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the product.' });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productId = req.params.id;
    const { sellerId, title, description, price, stockQuantity, categoryId, imageUrl, status } = req.body;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID format.' });
    }

    // Update the product entry in the database
    const result = await mongodb.getDb().db().collection('products').updateOne(
      { _id: new ObjectId(productId) },
      { 
        $set: { 
          sellerId: new ObjectId(sellerId),
          title,
          description,
          price,
          stockQuantity: stockQuantity || 0,
          categoryId: categoryId ? new ObjectId(categoryId) : null,
          imageUrl,
          status: status || 'active',
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Product entry not modified.' });
    }

    res.status(200).json({ success: 'Product updated successfully.' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'An error occurred while updating the product.' });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID format.' });
    }

    const result = await mongodb.getDb().db().collection('products').deleteOne({ _id: new ObjectId(productId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.status(200).json({ success: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'An error occurred while deleting the product.' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
