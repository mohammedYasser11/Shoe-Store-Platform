const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/usersController');

router.get('/admin/dashboard', protect, adminOnly, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.name}` });
});

// Protect all routes in this router: must be logged in and an admin
router.use(protect, adminOnly);

// List users
router.get('/admin/users', getAllUsers);

// (Optional) Edit user
router.put('/admin/users/:id', updateUser);

// (Optional) Delete user
router.delete('/admin/users/:id', deleteUser);

module.exports = router;
