const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getCart, addToCart, removeFromCart, modifyCartItem } = require('../controllers/cartController');

router.get('/', protect, getCart); // Fetch the user's cart
router.post('/', protect, addToCart); // Add an item to the cart
router.delete('/:itemId', protect, removeFromCart); // Remove an item from the cart
router.put('/:itemId', protect, modifyCartItem); // Update the quantity of an item in the cart)

module.exports = router;