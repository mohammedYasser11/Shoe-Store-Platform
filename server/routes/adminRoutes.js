const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllUsers, getUserById, createUser, updateUser, deleteUser
} = require('../controllers/usersController');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { getDashboardData }    = require('../controllers/adminController');
const {
  updateVariantStock,
  updateProductDiscount
} = require('../controllers/productController');
const router = express.Router();

// All /api/* require an admin token
router.use(protect, adminOnly);

// Dashboard stats
router.get('/dashboard', getDashboardData);
// User management
router.get ('/users',       getAllUsers);
router.get ('/users/:id',   getUserById);
router.post('/users',       createUser);
router.put ('/users/:id',   updateUser);
router.delete('/users/:id', deleteUser);

// Order management
router.get ('/orders',         getAllOrders);
router.put ('/orders/:id',     updateOrderStatus);

// Inventory management
router.put('/products/:productId/variants/:variantId', updateVariantStock); // Add the route here
router.put('/products/:productId/discount',     updateProductDiscount);

module.exports = router;
