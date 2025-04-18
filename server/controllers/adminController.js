// server/controllers/adminController.js
const User  = require('../models/User');
const Order = require('../models/Order');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers      = await User.countDocuments();
    const totalOrders     = await Order.countDocuments();
    const pendingOrders   = await Order.countDocuments({ status: 'pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    res.json({ totalUsers, totalOrders, pendingOrders, deliveredOrders });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
