// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  description: String,
  category: { type: String, required: true }, // e.g., men's, women's
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // percent off
  images: [String],
  colors: [String],
  sizes: [String],

  stock: { type: Number, required: true },
  tags: [String],

  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
