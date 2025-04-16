// server/routes/usersRoutes.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const { getAllUsers } = require('../controllers/userController');

// Apply auth to *all* routes in this router
router.use(auth);

// Now only one handler per route
//router.get('/', getAllUsers);

module.exports = router;
