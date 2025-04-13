// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const addressSchema = require('./Address');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  profilePic: {
    type: String,
    default: ''
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  address: {
    type: addressSchema,
    default: {}
  },

  phone: {
    type: String
  },

  createdAt: { type: Date, default: Date.now }
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
