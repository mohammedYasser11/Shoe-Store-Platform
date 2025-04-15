const router = require('express').Router();
const { submitMessage } = require('../controllers/contactController');
const auth = require('../middleware/auth'); // <- already used for user routes?

router.post('/', auth, submitMessage); // only logged-in users can access

module.exports = router;
