// models/Order.js
const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  variantId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to the specific variant
  quantity: { type: Number, default: 1 }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  items: [
    {
      variant: variantSchema,
      priceAtPurchase: Number
    }
  ],

  shippingInfo: {
    address: String,
    city: String,
    zip: String,
    country: String
  },

  tax: Number,
  shippingCost: Number,
  totalPrice: Number,

  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },

  paymentMethod: { type: String, enum: ['credit_card', 'paypal', 'cash_on_delivery'], default: 'cash_on_delivery' },
  isPaid: { type: Boolean, default: false },

  orderedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
