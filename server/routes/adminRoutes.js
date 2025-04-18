const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllUsers, getUserById, createUser, updateUser, deleteUser
} = require('../controllers/usersController');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { getDashboardStats } = require('../controllers/adminController');

const router = express.Router();

// All /api/admin/* require an admin token
router.use(protect, adminOnly);

// Dashboard stats
router.get('/admin/dashboard', getDashboardStats);

// User management
router.get ('/admin/users',       getAllUsers);
router.get ('/admin/users/:id',   getUserById);
router.post('/admin/users',       createUser);
router.put ('/admin/users/:id',   updateUser);
router.delete('/admin/users/:id', deleteUser);

// Order management
router.get ('/admin/orders',         getAllOrders);
router.put ('/admin/orders/:id',     updateOrderStatus);

module.exports = router;
