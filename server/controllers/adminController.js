// controllers/adminController.js
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

exports.getDashboardData = async (req, res) => {
  try {
    // counts as before
    const [userCount, orderCount, productCount] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(), // Consider filtering this count if needed
      Product.countDocuments(),
    ]);

    // total revenue: include only orders with status not cancelled
    const [agg] = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);
    const totalSales = agg?.totalSales || 0;

    // daily totals for the last 7 days: only include orders not cancelled
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // include today

    const salesAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: { $ne: "cancelled" }, // only non-cancelled orders
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          dayTotal: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // map to { day:'Mon', amount: 1234 }
    const sales = salesAgg.map((item) => ({
      day: new Date(item._id).toLocaleDateString("en-US", { weekday: "short" }),
      amount: item.dayTotal,
    }));

    return res.json({ userCount, orderCount, productCount, totalSales, sales });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ message: "Could not fetch dashboard data." });
  }
};
