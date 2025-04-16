// routes/userRoutes.js
const router = require('express').Router();
const { updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.put('/me', protect, updateProfile);

module.exports = router;
