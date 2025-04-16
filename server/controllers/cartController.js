const Cart = require('../models/Cart');
const Product = require('../models/Product'); 

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
        // Step 1: Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Step 2: Check if the requested quantity is available in stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock available' });
        }

        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [] });
        }

        // Step 4: Check if the item already exists in the cart
        const existingItem = cart.items.find(item =>
            item.productId.toString() === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
        );

        if (existingItem) {
            // Step 5: Update the quantity if the item already exists
            const newQuantity = existingItem.quantity + quantity;

            // Ensure the updated quantity does not exceed stock
            if (newQuantity > product.stock) {
                return res.status(400).json({ message: 'Insufficient stock available for the requested quantity' });
            }

            existingItem.quantity = newQuantity;
        } else {
            // Step 6: Add a new item to the cart
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

