const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongodb = require('../db/db');
const { validationResult } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create a new account entry
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      username,
      email,
      password,
      userType, // Include userType as needed
      profilePicture,
      bio,
      address,
    } = req.body;

    // Check if email already exists
    const existingUser = await mongodb
      .getDb()
      .db()
      .collection('users')
      .findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new account entry object with hashed password
    const userEntry = {
      name,
      username,
      email,
      password: hashedPassword,
      userType, // Include userType in the user entry
      profilePicture,
      bio,
      address,
      createdAt: new Date(),
    };

    // Insert the new account entry into the 'users' collection
    const response = await mongodb.getDb().db().collection('users').insertOne(userEntry);

    if (response.acknowledged) {
      // Generate JWT token
      const tokenPayload = { userId: response.insertedId, email: userEntry.email };
      const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Respond with the token along with the account creation success message
      res.status(201).json({ success: 'Account created successfully', accessToken });
    } else {
      res.status(500).json({ error: 'Error occurred while creating the account.' });
    }
  } catch (error) {
    console.error('Error creating an account:', error);
    res.status(500).json({ error: 'An error occurred while creating the account.' });
  }
};

// // Create a new account entry
// const createUser = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, username, email, password, userType, profilePicture, bio, address } = req.body;

//     // Check if email already exists
//     const existingUser = await mongodb
//       .getDb()
//       .db()
//       .collection('users')
//       .findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already exists.' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the new account entry object with hashed password
//     const userEntry = {
//       name,
//       username,
//       email,
//       password: hashedPassword,
//       userType,
//       profilePicture,
//       bio,
//       address,
//       createdAt: new Date()
//     };

//     // Insert the new account entry into the 'users' collection
//     const response = await mongodb.getDb().db().collection('users').insertOne(userEntry);

//     if (response.acknowledged) {
//       // Generate JWT token
//       const tokenPayload = { userId: response.insertedId, email: userEntry.email };
//       const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

//       // Respond with the token along with the account creation success message
//       res.status(201).json({ success: 'Account created successfully', accessToken });
//     } else {
//       res.status(500).json({ error: 'Error occurred while creating the account.' });
//     }
//   } catch (error) {
//     console.error('Error creating an account:', error);
//     res.status(500).json({ error: 'An error occurred while creating the account.' });
//   }
// };

// User login
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find user by username
    const user = await mongodb.getDb().db().collection('users').findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const tokenPayload = {
      userId: user._id,
      username: user.username
    };

    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: 'Login successful', accessToken });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};

// Request password reset
const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Find user by email
    const user = await mongodb.getDb().db().collection('users').findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No user found with this email address' });
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    await mongodb
      .getDb()
      .db()
      .collection('users')
      .updateOne({ _id: user._id }, { $set: { resetToken, resetTokenExpiry } });

    // Send reset token via email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: `Please use the following token to reset your password: ${resetToken}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: 'Password reset token sent to email' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ error: 'An error occurred while requesting password reset' });
  }
};

// Reset password using token
const resetPassword = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure password and confirmPassword from the request body
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    // Find user by reset token
    const user = await mongodb
      .getDb()
      .db()
      .collection('users') 
      .findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
      });

    // Check if the user was found
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if passwords match (this is already validated above, so this check is redundant)
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear the reset token
    await mongodb
      .getDb()
      .db()
      .collection('users') 
      .updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword }, $unset: { resetToken: '', resetTokenExpiry: '' } }
      );

    // Send a success response
    res.status(200).json({ success: 'Password has been reset successfully' });
  } catch (error) {
    // Log and return an error response
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'An error occurred while resetting the password' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('users').find();
    const accountEntries = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(accountEntries);
  } catch (error) {
    console.error('Error fetching all accounts:', error);
    res.status(500).json({ error: 'An error occurred while fetching all accounts.' });
  }
};

// Get a single user entry by ID
const getSingleUser = async (req, res) => {
  try {
    const accountId = req.params.id;

    if (!ObjectId.isValid(accountId)) {
      return res.status(400).json({ error: 'Invalid account ID format.' });
    }

    const userEntry = await mongodb
      .getDb()
      .db()
      .collection('users')
      .findOne({ _id: new ObjectId(accountId) });

    if (!userEntry) {
      return res.status(404).json({ error: 'Account entry not found.' });
    }

    res.status(200).json(userEntry);
  } catch (error) {
    console.error('Error fetching a single account by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the account.' });
  }
};

// Update an existing user entry by ID
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = new ObjectId(req.params.id);
    const { name, username, email, password, confirmPassword, userType, profilePicture, bio, address } = req.body;

    // Retrieve the existing account data
    const existingUser = await mongodb.getDb().db().collection('users').findOne({ _id: userId });

    if (!existingUser) {
      return res.status(404).json({ error: 'Account entry not found.' });
    }

    // Prepare updated fields
    const updatedFields = {
      name: name || existingUser.name,
      username: username || existingUser.username,
      email: email || existingUser.email,
      userType: userType || existingUser.userType,
      profilePicture: profilePicture || existingUser.profilePicture,
      bio: bio || existingUser.bio,
      address: address || existingUser.address,
      updatedAt: new Date()
    };

    // Only update password if provided
    if (password && password === confirmPassword) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    // Update the user entry in the 'users' collection
    const response = await mongodb.getDb().db().collection('users').updateOne({ _id: userId }, { $set: updatedFields });

    if (response.modifiedCount === 0) {
      return res.status(400).json({ error: 'No changes made to the account.' });
    }

    res.status(200).json({ success: 'Account updated successfully.' });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ error: 'An error occurred while updating the account.' });
  }
};

// Delete a user entry
const deleteUser = async (req, res) => {
  try {
    const accountId = req.params.id;

    if (!ObjectId.isValid(accountId)) {
      return res.status(400).json({ error: 'Invalid account ID format.' });
    }

    const response = await mongodb.getDb().db().collection('users').deleteOne({ _id: new ObjectId(accountId) });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Account entry not found.' });
    }

    res.status(200).json({ success: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'An error occurred while deleting the account.' });
  }
};

module.exports = {
  createUser,
  login,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};
