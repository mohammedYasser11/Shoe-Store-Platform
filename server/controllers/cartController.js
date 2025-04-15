const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        res.json(cart || { items: [] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addToCart = async (req, res) => {
    const { productId, quantity, selectedColor, selectedSize } = req.body;
    try {
        // Check if the product exists and has sufficient stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock available' });
        }
        
        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [] });
        }

        // Check if the item already exists in the cart
        const existingItem = cart.items.find(item =>
            item.productId.toString() === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
        );

        if (existingItem) {
            // Update the quantity if the item already exists
            existingItem.quantity += quantity;

            // Ensure the updated quantity does not exceed stock
            if (existingItem.quantity > product.stock) {
                return res.status(400).json({ message: 'Insufficient stock available' });
            }
        } else {
            // Add a new item to the cart
            cart.items.push({ productId, quantity, selectedColor, selectedSize });
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};