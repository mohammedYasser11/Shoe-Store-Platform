const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/admin/dashboard', protect, adminOnly, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.name}` });
});

module.exports = router;
