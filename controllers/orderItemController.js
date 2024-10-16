const mongodb = require('../db/db');
const { validationResult } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

// Create a new order item
const createOrderItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, productId, quantity, price } = req.body;

    // Create the new order item entry object
    const orderItemEntry = {
      orderId: new ObjectId(orderId),
      productId: new ObjectId(productId),
      quantity,
      price,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new order item entry into the 'orderitems' collection
    const response = await mongodb.getDb().db().collection('orderitems').insertOne(orderItemEntry);

    if (response.acknowledged) {
      res.status(201).json({ success: 'Order item created successfully', orderItemId: response.insertedId });
    } else {
      res.status(500).json({ error: 'Error occurred while creating the order item.' });
    }
  } catch (error) {
    console.error('Error creating an order item:', error);
    res.status(500).json({ error: 'An error occurred while creating the order item.' });
  }
};

// Get all order items for an order
const getOrderItemsForOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    if (!ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID format.' });
    }

    const result = await mongodb.getDb().db().collection('orderitems').find({ orderId: new ObjectId(orderId) });
    const orderItems = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(orderItems);
  } catch (error) {
    console.error('Error fetching order items for order:', error);
    res.status(500).json({ error: 'An error occurred while fetching order items.' });
  }
};

// Get a single order item by ID
const getSingleOrderItem = async (req, res) => {
  try {
    const orderItemId = req.params.id;

    if (!ObjectId.isValid(orderItemId)) {
      return res.status(400).json({ error: 'Invalid order item ID format.' });
    }

    const orderItemEntry = await mongodb.getDb().db().collection('orderitems').findOne({ _id: new ObjectId(orderItemId) });

    if (!orderItemEntry) {
      return res.status(404).json({ error: 'Order item not found.' });
    }

    res.status(200).json(orderItemEntry);
  } catch (error) {
    console.error('Error fetching a single order item by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the order item.' });
  }
};

// Update an order item by ID
const updateOrderItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const orderItemId = req.params.id;
    const { orderId, productId, quantity, price } = req.body;

    if (!ObjectId.isValid(orderItemId)) {
      return res.status(400).json({ error: 'Invalid order item ID format.' });
    }

    // Update the order item entry in the database
    const result = await mongodb.getDb().db().collection('orderitems').updateOne(
      { _id: new ObjectId(orderItemId) },
      {
        $set: {
          orderId: new ObjectId(orderId),
          productId: new ObjectId(productId),
          quantity,
          price,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Order item entry not modified.' });
    }

    res.status(200).json({ success: 'Order item updated successfully.' });
  } catch (error) {
    console.error('Error updating order item:', error);
    res.status(500).json({ error: 'An error occurred while updating the order item.' });
  }
};

// Delete an order item by ID
const deleteOrderItem = async (req, res) => {
  try {
    const orderItemId = req.params.id;

    if (!ObjectId.isValid(orderItemId)) {
      return res.status(400).json({ error: 'Invalid order item ID format.' });
    }

    const result = await mongodb.getDb().db().collection('orderitems').deleteOne({ _id: new ObjectId(orderItemId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Order item not found.' });
    }

    res.status(200).json({ success: 'Order item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting order item:', error);
    res.status(500).json({ error: 'An error occurred while deleting the order item.' });
  }
};

module.exports = {
  createOrderItem,
  getOrderItemsForOrder,
  getSingleOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
