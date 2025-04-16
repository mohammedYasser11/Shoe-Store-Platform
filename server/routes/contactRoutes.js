const router = require('express').Router();
const { submitMessage } = require('../controllers/contactController');
const { protect } = require('../middleware/auth'); // <- already used for user routes?

router.post('/', protect, submitMessage); // only logged-in users can access

module.exports = router;
