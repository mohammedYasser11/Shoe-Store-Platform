const Order = require('../models/Order');
const User  = require('../models/User');

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
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Server error updating order' });
  }
};
