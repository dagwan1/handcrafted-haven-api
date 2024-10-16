const mongodb = require('../db/db');
const { validationResult } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

// Create a new payment
const createPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, paymentMethod, paymentStatus, paymentDate } = req.body;

    // Create the new payment entry object
    const paymentEntry = {
      orderId: new ObjectId(orderId),
      paymentMethod,
      paymentStatus: paymentStatus || 'pending', // Default to 'pending' if not provided
      paymentDate: paymentDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new payment entry into the 'payments' collection
    const response = await mongodb.getDb().db().collection('payments').insertOne(paymentEntry);

    if (response.acknowledged) {
      res.status(201).json({ success: 'Payment created successfully', paymentId: response.insertedId });
    } else {
      res.status(500).json({ error: 'Error occurred while creating the payment.' });
    }
  } catch (error) {
    console.error('Error creating a payment:', error);
    res.status(500).json({ error: 'An error occurred while creating the payment.' });
  }
};

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('payments').find();
    const payments = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'An error occurred while fetching payments.' });
  }
};

// Get a single payment by ID
const getSinglePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;

    if (!ObjectId.isValid(paymentId)) {
      return res.status(400).json({ error: 'Invalid payment ID format.' });
    }

    const paymentEntry = await mongodb.getDb().db().collection('payments').findOne({ _id: new ObjectId(paymentId) });

    if (!paymentEntry) {
      return res.status(404).json({ error: 'Payment not found.' });
    }

    res.status(200).json(paymentEntry);
  } catch (error) {
    console.error('Error fetching a single payment by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the payment.' });
  }
};

// Update a payment by ID
const updatePayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const paymentId = req.params.id;
    const { orderId, paymentMethod, paymentStatus, paymentDate } = req.body;

    if (!ObjectId.isValid(paymentId)) {
      return res.status(400).json({ error: 'Invalid payment ID format.' });
    }

    // Update the payment entry in the database
    const result = await mongodb.getDb().db().collection('payments').updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          orderId: new ObjectId(orderId),
          paymentMethod,
          paymentStatus: paymentStatus || 'pending',
          paymentDate: paymentDate || new Date(),
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Payment entry not modified.' });
    }

    res.status(200).json({ success: 'Payment updated successfully.' });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'An error occurred while updating the payment.' });
  }
};

// Delete a payment by ID
const deletePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;

    if (!ObjectId.isValid(paymentId)) {
      return res.status(400).json({ error: 'Invalid payment ID format.' });
    }

    const result = await mongodb.getDb().db().collection('payments').deleteOne({ _id: new ObjectId(paymentId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Payment not found.' });
    }

    res.status(200).json({ success: 'Payment deleted successfully.' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'An error occurred while deleting the payment.' });
  }
};

// Get all payments for a specific order
const getPaymentsForOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    if (!ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID format.' });
    }

    const payments = await mongodb
      .getDb()
      .db()
      .collection('payments')
      .find({ orderId: new ObjectId(orderId) })
      .toArray();

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments for order:', error);
    res.status(500).json({ error: 'An error occurred while fetching payments.' });
  }
};


module.exports = {
  createPayment,
  getAllPayments,
  getSinglePayment,
  updatePayment,
  deletePayment,
  getPaymentsForOrder,
};
