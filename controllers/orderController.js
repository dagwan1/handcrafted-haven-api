const mongodb = require('../db/db');
const { validationResult } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

// Create a new order
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, totalPrice, shippingAddress, status, orderDate } = req.body;

    // Create the new order entry object
    const orderEntry = {
      userId: new ObjectId(userId),
      totalPrice,
      shippingAddress,
      status: status || 'pending', // Default to 'pending' if not provided
      orderDate: orderDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new order entry into the 'orders' collection
    const response = await mongodb.getDb().db().collection('orders').insertOne(orderEntry);

    if (response.acknowledged) {
      res.status(201).json({ success: 'Order created successfully', orderId: response.insertedId });
    } else {
      res.status(500).json({ error: 'Error occurred while creating the order.' });
    }
  } catch (error) {
    console.error('Error creating an order:', error);
    res.status(500).json({ error: 'An error occurred while creating the order.' });
  }
};

// Get all orders for a user
const getOrdersForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    const result = await mongodb.getDb().db().collection('orders').find({ userId: new ObjectId(userId) });
    const orders = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders for user:', error);
    res.status(500).json({ error: 'An error occurred while fetching orders.' });
  }
};

// Get a single order by ID
const getSingleOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID format.' });
    }

    const orderEntry = await mongodb.getDb().db().collection('orders').findOne({ _id: new ObjectId(orderId) });

    if (!orderEntry) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    res.status(200).json(orderEntry);
  } catch (error) {
    console.error('Error fetching a single order by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the order.' });
  }
};

// Update an order by ID
const updateOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const orderId = req.params.id;
    const { userId, totalPrice, shippingAddress, status, orderDate } = req.body;

    if (!ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID format.' });
    }

    // Update the order entry in the database
    const result = await mongodb.getDb().db().collection('orders').updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          userId: new ObjectId(userId),
          totalPrice,
          shippingAddress,
          status: status || 'pending',
          orderDate: orderDate || new Date(),
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Order entry not modified.' });
    }

    res.status(200).json({ success: 'Order updated successfully.' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'An error occurred while updating the order.' });
  }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID format.' });
    }

    const result = await mongodb.getDb().db().collection('orders').deleteOne({ _id: new ObjectId(orderId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    res.status(200).json({ success: 'Order deleted successfully.' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'An error occurred while deleting the order.' });
  }
};

module.exports = {
  createOrder,
  getOrdersForUser,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
