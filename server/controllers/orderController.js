const Order = require('../models/Order');
const User  = require('../models/User');
const Product = require('../models/Product');

// GET /api/admin/orders
// Admin‑only: list all orders with user info
exports.getAllOrders = async (req, res) => {
  try {
    // populate userId to get customer name & email
    const orders = await Order
      .find()
      .populate('userId', 'name email')
      .sort({ orderedAt: -1 })
      .lean();
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// PUT /api/admin/orders/:id
// Admin‑only: update just the status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    // only allow valid statuses
    if (!['pending','processing','shipped','delivered','cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Get the current order to check its status
    const currentOrder = await Order.findById(req.params.id);
    if (!currentOrder) return res.status(404).json({ message: 'Order not found' });

    // Handle stock changes based on status transition
    if (currentOrder.status === 'cancelled' && status !== 'cancelled') {
      // If changing from cancelled to any other status, subtract stock
      for (const item of currentOrder.items) {
        const product = await Product.findById(item.variant.productId);
        if (!product) continue;

        const variant = product.variants.find(v => v._id.toString() === item.variant.variantId.toString());
        if (variant) {
          // Check if there's enough stock
          if (variant.stock < item.variant.quantity) {
            return res.status(400).json({ 
              message: `Not enough stock for ${product.name} (${variant.color}, ${variant.size})` 
            });
          }
          variant.stock -= item.variant.quantity;
          await product.save();
        }
      }
    } else if (status === 'cancelled' && currentOrder.status !== 'cancelled') {
      // If changing to cancelled and wasn't already cancelled, restore stock
      for (const item of currentOrder.items) {
        const product = await Product.findById(item.variant.productId);
        if (!product) continue;

        const variant = product.variants.find(v => v._id.toString() === item.variant.variantId.toString());
        if (variant) {
          variant.stock += item.variant.quantity;
          await product.save();
        }
      }
    }

    // Update the order status
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Server error updating order' });
  }
};
