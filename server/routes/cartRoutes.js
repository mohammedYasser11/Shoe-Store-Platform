const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.get('/', protect, getCart); // Fetch the user's cart
router.post('/', protect, addToCart); // Add an item to the cart
router.delete('/:itemId', protect, removeFromCart); // Remove an item from the cart

module.exports = router;