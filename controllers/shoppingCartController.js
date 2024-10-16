const mongodb = require('../db/db');
const { validationResult } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

// Create a new shopping cart
const createShoppingCart = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customerId, products } = req.body;

    // Create the new shopping cart entry object
    const shoppingCartEntry = {
      customerId: new ObjectId(customerId),
      products: products || [],
      createdAt: new Date(),
    };

    // Insert the new shopping cart entry into the 'shoppingCarts' collection
    const response = await mongodb.getDb().db().collection('shoppingCarts').insertOne(shoppingCartEntry);

    if (response.acknowledged) {
      res.status(201).json({ success: 'Shopping cart created successfully', cartId: response.insertedId });
    } else {
      res.status(500).json({ error: 'Error occurred while creating the shopping cart.' });
    }
  } catch (error) {
    console.error('Error creating a shopping cart:', error);
    res.status(500).json({ error: 'An error occurred while creating the shopping cart.' });
  }
};

// Get all shopping carts for a customer
const getCartsForCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const result = await mongodb.getDb().db().collection('shoppingCarts').find({ customerId: new ObjectId(customerId) });
    const carts = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(carts);
  } catch (error) {
    console.error('Error fetching shopping carts for customer:', error);
    res.status(500).json({ error: 'An error occurred while fetching shopping carts.' });
  }
};

// Get a single shopping cart by ID
const getSingleCart = async (req, res) => {
  try {
    const cartId = req.params.id;

    if (!ObjectId.isValid(cartId)) {
      return res.status(400).json({ error: 'Invalid shopping cart ID format.' });
    }

    const cartEntry = await mongodb.getDb().db().collection('shoppingCarts').findOne({ _id: new ObjectId(cartId) });

    if (!cartEntry) {
      return res.status(404).json({ error: 'Shopping cart not found.' });
    }

    res.status(200).json(cartEntry);
  } catch (error) {
    console.error('Error fetching a single shopping cart by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the shopping cart.' });
  }
};

// Update a shopping cart by ID
const updateCart = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const cartId = req.params.id;
    const { products } = req.body;

    if (!ObjectId.isValid(cartId)) {
      return res.status(400).json({ error: 'Invalid shopping cart ID format.' });
    }

    // Update the shopping cart entry in the database
    const result = await mongodb.getDb().db().collection('shoppingCarts').updateOne(
      { _id: new ObjectId(cartId) },
      { $set: { products: products || [] } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Shopping cart entry not modified.' });
    }

    res.status(200).json({ success: 'Shopping cart updated successfully.' });
  } catch (error) {
    console.error('Error updating shopping cart:', error);
    res.status(500).json({ error: 'An error occurred while updating the shopping cart.' });
  }
};

// Delete a shopping cart by ID
const deleteCart = async (req, res) => {
  try {
    const cartId = req.params.id;

    if (!ObjectId.isValid(cartId)) {
      return res.status(400).json({ error: 'Invalid shopping cart ID format.' });
    }

    const result = await mongodb.getDb().db().collection('shoppingCarts').deleteOne({ _id: new ObjectId(cartId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Shopping cart not found.' });
    }

    res.status(200).json({ success: 'Shopping cart deleted successfully.' });
  } catch (error) {
    console.error('Error deleting shopping cart:', error);
    res.status(500).json({ error: 'An error occurred while deleting the shopping cart.' });
  }
};

module.exports = {
  createShoppingCart,
  getCartsForCustomer,
  getSingleCart,
  updateCart,
  deleteCart,
};
