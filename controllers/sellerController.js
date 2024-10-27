const mongodb = require('../db/db');
const { validationResult } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

// Create a new seller profile
const createSeller = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id; // Get the user ID from the authenticated request
    const { phone, dob, gender } = req.body;

    // Check if the user already has a seller profile
    const existingSeller = await mongodb
      .getDb()
      .db()
      .collection('sellers')
      .findOne({ user: new ObjectId(userId) });

    if (existingSeller) {
      return res.status(400).json({ error: 'Seller profile already exists for this user.' });
    }

    // Create the new seller entry object
    const sellerEntry = {
      user: new ObjectId(userId),
      phone,
      dob,
      gender,
      createdAt: new Date(),
    };

    // Insert the new seller entry into the 'sellers' collection
    const response = await mongodb.getDb().db().collection('sellers').insertOne(sellerEntry);

    if (response.acknowledged) {
      res.status(201).json({ success: 'Seller created successfully', sellerId: response.insertedId });
    } else {
      res.status(500).json({ error: 'Error occurred while creating the seller.' });
    }
  } catch (error) {
    console.error('Error creating a seller:', error);
    res.status(500).json({ error: 'An error occurred while creating the seller.' });
  }
};

// Get all sellers
const getAllSellers = async (req, res) => {
  try {
    const result = await mongodb
      .getDb()
      .db()
      .collection('sellers')
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        {
          $unwind: '$userDetails'
        },
        {
          $project: {
            'userDetails.password': 0 // Exclude the password field from the user details
          }
        }
      ]);

    const sellerEntries = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(sellerEntries);
  } catch (error) {
    console.error('Error fetching all sellers:', error);
    res.status(500).json({ error: 'An error occurred while fetching all sellers.' });
  }
};

// Get a single seller entry by ID
const getSingleSeller = async (req, res) => {
  try {
    const sellerId = req.params.id;

    if (!ObjectId.isValid(sellerId)) {
      return res.status(400).json({ error: 'Invalid seller ID format.' });
    }

    const sellerEntry = await mongodb
      .getDb()
      .db()
      .collection('sellers')
      .aggregate([
        { $match: { _id: new ObjectId(sellerId) } },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        {
          $unwind: '$userDetails'
        },
        {
          $project: {
            'userDetails.password': 0 // Exclude the password field from the user details
          }
        }
      ])
      .toArray();

    if (sellerEntry.length === 0) {
      return res.status(404).json({ error: 'Seller entry not found.' });
    }

    res.status(200).json(sellerEntry[0]);
  } catch (error) {
    console.error('Error fetching a single seller by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the seller.' });
  }
};

// Update an existing seller entry by ID
const updateSeller = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const sellerId = new ObjectId(req.params.id);
    const { phone, dob, gender } = req.body;

    // Retrieve the existing seller data
    const existingSeller = await mongodb
      .getDb()
      .db()
      .collection('sellers')
      .findOne({ _id: sellerId });

    if (!existingSeller) {
      return res.status(404).json({ error: 'Seller entry not found.' });
    }

    // Update the seller entry
    const sellerEntry = {
      phone: phone !== undefined ? phone : existingSeller.phone,
      dob: dob !== undefined ? dob : existingSeller.dob,
      gender: gender !== undefined ? gender : existingSeller.gender,
      updatedAt: new Date()
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('sellers')
      .updateOne({ _id: sellerId }, { $set: sellerEntry });

    if (response.modifiedCount > 0) {
      res.status(200).json({ success: 'Seller entry successfully updated', sellerId });
    } else {
      res.status(500).json({ error: 'Error occurred while updating the seller.' });
    }
  } catch (error) {
    console.error('Error updating seller by ID:', error);
    res.status(500).json({ error: 'An error occurred while updating the seller.' });
  }
};

// Delete a seller entry by ID
const deleteSeller = async (req, res) => {
  try {
    const sellerId = new ObjectId(req.params.id);

    const sellerExists = await mongodb
      .getDb()
      .db()
      .collection('sellers')
      .findOne({ _id: sellerId });

    if (!sellerExists) {
      return res.status(404).json({ error: 'Seller entry not found.' });
    }

    const response = await mongodb.getDb().db().collection('sellers').deleteOne({ _id: sellerId });

    if (response.deletedCount > 0) {
      res.status(200).json({ success: 'Seller entry successfully deleted', sellerId });
    } else {
      res.status(500).json({ error: 'Error occurred while deleting the seller entry.' });
    }
  } catch (error) {
    console.error('Error deleting a seller by ID:', error);
    res.status(500).json({ error: 'An error occurred while deleting the seller entry.' });
  }
};

module.exports = {
  createSeller,
  getAllSellers,
  getSingleSeller,
  updateSeller,
  deleteSeller
};
