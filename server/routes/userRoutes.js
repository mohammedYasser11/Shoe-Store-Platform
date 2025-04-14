// routes/user.routes.js
const router = require('express').Router();
const { updateProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.put('/me', auth, updateProfile);

module.exports = router;
