const mongodb = require('../db/db');
const { validationResult } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

// Create a new review
const createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, productId, rating, comment } = req.body;

    // Create the new review entry object
    const reviewEntry = {
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
      rating,
      comment,
      createdAt: new Date(),
    };

    // Insert the new review entry into the 'reviews' collection
    const response = await mongodb.getDb().db().collection('reviews').insertOne(reviewEntry);

    if (response.acknowledged) {
      res.status(201).json({ success: 'Review created successfully', reviewId: response.insertedId });
    } else {
      res.status(500).json({ error: 'Error occurred while creating the review.' });
    }
  } catch (error) {
    console.error('Error creating a review:', error);
    res.status(500).json({ error: 'An error occurred while creating the review.' });
  }
};

// Get all reviews for a product
const getReviewsForProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const result = await mongodb.getDb().db().collection('reviews').find({ productId: new ObjectId(productId) });
    const reviews = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews for product:', error);
    res.status(500).json({ error: 'An error occurred while fetching reviews.' });
  }
};

// Get a single review by ID
const getSingleReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    if (!ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: 'Invalid review ID format.' });
    }

    const reviewEntry = await mongodb.getDb().db().collection('reviews').findOne({ _id: new ObjectId(reviewId) });

    if (!reviewEntry) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    res.status(200).json(reviewEntry);
  } catch (error) {
    console.error('Error fetching a single review by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the review.' });
  }
};

// Update a review by ID
const updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reviewId = req.params.id;
    const { userId, productId, rating, comment } = req.body;

    if (!ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: 'Invalid review ID format.' });
    }

    // Update the review entry in the database
    const result = await mongodb.getDb().db().collection('reviews').updateOne(
      { _id: new ObjectId(reviewId) },
      { $set: { userId: new ObjectId(userId), productId: new ObjectId(productId), rating, comment } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Review entry not modified.' });
    }

    res.status(200).json({ success: 'Review updated successfully.' });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'An error occurred while updating the review.' });
  }
};

// Delete a review by ID
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    if (!ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: 'Invalid review ID format.' });
    }

    const result = await mongodb.getDb().db().collection('reviews').deleteOne({ _id: new ObjectId(reviewId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    res.status(200).json({ success: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'An error occurred while deleting the review.' });
  }
};

module.exports = {
  createReview,
  getReviewsForProduct,
  getSingleReview,
  updateReview,
  deleteReview,
};
