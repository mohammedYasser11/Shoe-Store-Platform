const Order = require('../models/Order');

/**
 * GET /api/orders
 * Return all orders for the currently authenticated user.
 */
exports.getUserOrders = async (req, res) => {
    try {
        // req.user should contain the user ID from your auth middleware
        const userId = req.user.id || req.user._id;

        // Fetch orders, newest first, and populate each item's product name
        const orders = await Order.find({ userId })
        .sort({ orderedAt: -1 })
        .populate('items.productId', 'name')
        .lean();

        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Server error fetching orders.' });
    }
};
