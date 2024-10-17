const mongodb = require('../db/db');
const { validationResult } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

// Create a new cart item
const createCartItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cartId, productId, quantity } = req.body;

    // Create the new cart item entry object
    const cartItemEntry = {
      cartId: new ObjectId(cartId),
      productId: new ObjectId(productId),
      quantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new cart item entry into the 'cartitems' collection
    const response = await mongodb.getDb().db().collection('cartitems').insertOne(cartItemEntry);

    if (response.acknowledged) {
      res.status(201).json({ success: 'Cart item created successfully', cartItemId: response.insertedId });
    } else {
      res.status(500).json({ error: 'Error occurred while creating the cart item.' });
    }
  } catch (error) {
    console.error('Error creating a cart item:', error);
    res.status(500).json({ error: 'An error occurred while creating the cart item.' });
  }
};

// Get all cart items for a specific cart
const getCartItemsForCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;

    if (!ObjectId.isValid(cartId)) {
      return res.status(400).json({ error: 'Invalid cart ID format.' });
    }

    const result = await mongodb.getDb().db().collection('cartitems').find({ cartId: new ObjectId(cartId) });
    const cartItems = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items for cart:', error);
    res.status(500).json({ error: 'An error occurred while fetching cart items.' });
  }
};

// Get a single cart item by ID
const getSingleCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;

    if (!ObjectId.isValid(cartItemId)) {
      return res.status(400).json({ error: 'Invalid cart item ID format.' });
    }

    const cartItemEntry = await mongodb.getDb().db().collection('cartitems').findOne({ _id: new ObjectId(cartItemId) });

    if (!cartItemEntry) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    res.status(200).json(cartItemEntry);
  } catch (error) {
    console.error('Error fetching a single cart item by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the cart item.' });
  }
};

// Update a cart item by ID
const updateCartItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const cartItemId = req.params.id;
    const { cartId, productId, quantity } = req.body;

    if (!ObjectId.isValid(cartItemId)) {
      return res.status(400).json({ error: 'Invalid cart item ID format.' });
    }

    // Update the cart item entry in the database
    const result = await mongodb.getDb().db().collection('cartitems').updateOne(
      { _id: new ObjectId(cartItemId) },
      {
        $set: {
          cartId: new ObjectId(cartId),
          productId: new ObjectId(productId),
          quantity,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Cart item not modified.' });
    }

    res.status(200).json({ success: 'Cart item updated successfully.' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'An error occurred while updating the cart item.' });
  }
};

// Delete a cart item by ID
const deleteCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;

    if (!ObjectId.isValid(cartItemId)) {
      return res.status(400).json({ error: 'Invalid cart item ID format.' });
    }

    const result = await mongodb.getDb().db().collection('cartitems').deleteOne({ _id: new ObjectId(cartItemId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    res.status(200).json({ success: 'Cart item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'An error occurred while deleting the cart item.' });
  }
};

module.exports = {
  createCartItem,
  getCartItemsForCart,
  getSingleCartItem,
  updateCartItem,
  deleteCartItem,
};
