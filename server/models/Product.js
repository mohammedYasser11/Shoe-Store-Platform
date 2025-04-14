// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  category: String,
  brand: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [String],        // URLs
  colors: [String],        // e.g. ["red","black"]
  sizes: [String],         // e.g. ["42","43"]
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
