const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllUsers, getUserById, createUser, updateUser, deleteUser
} = require('../controllers/usersController');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { getDashboardStats } = require('../controllers/adminController');

const router = express.Router();

// All /api/* require an admin token
router.use(protect, adminOnly);

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// User management
router.get ('/users',       getAllUsers);
router.get ('/users/:id',   getUserById);
router.post('/users',       createUser);
router.put ('/users/:id',   updateUser);
router.delete('/users/:id', deleteUser);

// Order management
router.get ('/orders',         getAllOrders);
router.put ('/orders/:id',     updateOrderStatus);

module.exports = router;
