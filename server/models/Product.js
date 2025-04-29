// server/models/Product.js
const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  size: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 } // Stock for this specific variant
});

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
  variants: [variantSchema],
  isFeatured: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    default: 0,      // percentage off, e.g. 20 → 20% discount
    min: 0,
    max: 100
  }

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
