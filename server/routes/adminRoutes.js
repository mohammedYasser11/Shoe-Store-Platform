const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/usersController');
const {
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

// Protect all admin endpoints
router.use(protect, adminOnly);

// User management (you already have these)
router.get ('/admin/users',      getAllUsers);
router.get ('/admin/users/:id',  getUserById);
router.post('/admin/users',      createUser);
router.put ('/admin/users/:id',  updateUser);
router.delete('/admin/users/:id', deleteUser);

// 👇 Order management
router.get('/admin/orders',       getAllOrders);
router.put('/admin/orders/:id',   updateOrderStatus);

module.exports = router;
