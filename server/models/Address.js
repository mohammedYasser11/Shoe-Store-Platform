// models/Address.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: false,
    trim: true
  },
  city: {
    type: String,
    required: false,
    trim: true
  },
  zip: {
    type: String,
    required: false,
    match: /^\d{5}(-\d{4})?$/  // US ZIP format example
  },
  street: {
    type: String,
    required: false,
    trim: true
  }
}, { _id: false });  // prevents a separate _id for the subdoc

module.exports = addressSchema;
