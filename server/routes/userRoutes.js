// routes/userRoutes.js
const router = require('express').Router();
const { updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/multer');

router.put('/me', protect, upload.single('profilePicture'), updateProfile);

module.exports = router;
