const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Define a Mongoose schema for the 'User' collection
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    default: 'buyer',
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  profilePicture: {
    type: String,
  },
  bio: {
    type: String,
  },
  address: {
    type: String,
  },
  passwordResetToken: String,
  passwordResetExpires: Date
});

// Hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
  return resetToken;
};

// Create and export Mongoose model for the 'User' collection
const User = mongoose.model('User', userSchema);
module.exports = User;