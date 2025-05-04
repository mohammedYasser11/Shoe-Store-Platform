// server/models/Product.js
const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  size: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 }, // Newly added discount field per variant
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    category: String,
    brand: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [String], // URLs
    variants: [variantSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
