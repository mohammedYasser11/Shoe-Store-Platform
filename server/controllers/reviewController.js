// server/controllers/reviewController.js
const Review  = require('../models/Review');
const Product = require('../models/Product');
const mongoose = require('mongoose');
exports.getProductReviews = async (req, res) => {
    try {
        //Trim whitespace and validate
        const rawId = req.params.id;
        const productId = rawId.trim();
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID.' });
    }
        // ensure product exists (optional)
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // fetch & populate user name
        const reviews = await Review.find({ productId })
        .sort({ createdAt: -1 })
        .populate('userId', 'name')
        .lean();

        // shape to { rating, comment, userName, createdAt }
        const out = reviews.map(r => ({
        rating:    r.rating,
        comment:   r.comment,
        userName:  r.userId.name,
        createdAt: r.createdAt
        }));
        res.json(out);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ message: 'Server error fetching reviews.' });
    }
};

exports.createProductReview = async (req, res) => {
    try {
        const userId    = req.user._id;      // from your auth middleware
        //Trim whitespace and validate
            const rawId = req.params.id;
            const productId = rawId.trim();
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ message: 'Invalid product ID.' });
            }
        const { rating, comment } = req.body;

        // basic validation
        if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be 1–5.' });
        }

        // ensure product exists
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found.' });

        // create and return
        const review = await Review.create({
        productId,
        userId,
        rating,
        comment
        });
        res.status(201).json({
        rating:    review.rating,
        comment:   review.comment,
        userName:  (req.user.name || 'Anonymous'),
        createdAt: review.createdAt
        });
    } catch (err) {
        console.error('Error creating review:', err);
        res.status(500).json({ message: 'Server error creating review.' });
    }
};
