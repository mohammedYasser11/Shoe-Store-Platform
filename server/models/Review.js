// server/models/Review.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',        // assumes you have a User model
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
