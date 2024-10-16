const mongodb = require('../db/db');
const { validationResult } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

// Create a new category
const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    // Create the new category entry object
    const categoryEntry = {
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new category entry into the 'categories' collection
    const response = await mongodb.getDb().db().collection('categories').insertOne(categoryEntry);

    if (response.acknowledged) {
      res.status(201).json({ success: 'Category created successfully', categoryId: response.insertedId });
    } else {
      res.status(500).json({ error: 'Error occurred while creating the category.' });
    }
  } catch (error) {
    console.error('Error creating a category:', error);
    res.status(500).json({ error: 'An error occurred while creating the category.' });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('categories').find();
    const categories = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'An error occurred while fetching categories.' });
  }
};

// Get a single category by ID
const getSingleCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID format.' });
    }

    const categoryEntry = await mongodb.getDb().db().collection('categories').findOne({ _id: new ObjectId(categoryId) });

    if (!categoryEntry) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.status(200).json(categoryEntry);
  } catch (error) {
    console.error('Error fetching a single category by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the category.' });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const categoryId = req.params.id;
    const { name, description } = req.body;

    if (!ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID format.' });
    }

    // Update the category entry in the database
    const result = await mongodb.getDb().db().collection('categories').updateOne(
      { _id: new ObjectId(categoryId) },
      {
        $set: {
          name,
          description,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Category not modified.' });
    }

    res.status(200).json({ success: 'Category updated successfully.' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'An error occurred while updating the category.' });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID format.' });
    }

    const result = await mongodb.getDb().db().collection('categories').deleteOne({ _id: new ObjectId(categoryId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.status(200).json({ success: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'An error occurred while deleting the category.' });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
