const router = require('express').Router();
const auth = require('../middleware/auth');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.get('/', auth, getCart); // Fetch the user's cart
router.post('/', auth, addToCart); // Add an item to the cart
router.delete('/:itemId', auth, removeFromCart); // Remove an item from the cart

module.exports = router;