const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * GET /api/order
 * Return all orders for the currently authenticated user.
 */
exports.getUserOrders = async (req, res) => {
    try {
        // req.user should contain the user ID from your auth middleware
        const userId = req.user.id || req.user._id;
        // Fetch orders, newest first, and populate each item's product name
        const orders = await Order.find({ userId })
        .sort({ orderedAt: -1 })
        .populate({
            path: 'items.variant.productId',
            select: 'name variants',
        })
        .lean();

        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Server error fetching orders.' });
    }
};

exports.createOrder = async (req, res) => {
    const userId = req.user._id; // Assuming user ID is available in req.user
    const { items, shippingInfo, totalPrice } = req.body;
  
    try {
      // First, check stock availability for all items
      for (const item of items) {
        const product = await Product.findById(item.productId._id);
        if (!product) {
          return res.status(404).json({ message: `Product ${item.productId._id} not found` });
        }

        const variant = product.variants.find(v => v._id.toString() === item.variantId);
        if (!variant) {
          return res.status(404).json({ message: `Variant ${item.variantId} not found` });
        }

        if (variant.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Insufficient stock for ${product.name} (${variant.color}, ${variant.size})`,
            availableStock: variant.stock,
            requestedQuantity: item.quantity
          });
        }
      }

      // If all items have sufficient stock, proceed with order creation
      const order = new Order({
        userId,
        items: items.map(item => ({
          variant: {
            productId: item.productId._id,
            variantId: item.variantId,
            quantity: item.quantity
          },
          priceAtPurchase: item.productId.price
        })),
        shippingInfo,
        totalPrice,
        status: 'pending',
        paymentMethod: 'cash_on_delivery' // Default payment method
      });

      await order.save();

      // Update stock for each item
      for (const item of items) {
        const product = await Product.findById(item.productId._id);
        const variant = product.variants.find(v => v._id.toString() === item.variantId);
        variant.stock -= item.quantity;
        await product.save();
      }

      // Clear the user's cart
      await Cart.findOneAndUpdate({ userId }, { items: [] });
  
      res.status(201).json({ message: 'Order created successfully', order });
    } catch (err) {
      console.error('Error creating order:', err);
      res.status(500).json({ message: 'Failed to create order' });
    }
};
