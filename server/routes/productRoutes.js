const router = require('express').Router();
const { protect, adminOnly }   = require('../middleware/auth');
const { getAll, getById, create, update, remove, getRelatedProducts, getLimitedProducts, getProductVariant, updateVariantStock, getProducts } = require('../controllers/productController');

const {
    getProductReviews,
    createProductReview
} = require('../controllers/reviewController');
// Public
router.get('/related', getRelatedProducts);
router.get('/limited', getLimitedProducts); 
router.get('/',    getAll);
router.get('/:id', getById);
router.get('/:productId/variants/:variantId', getProductVariant);
router.put('/:productId/variants/:variantId/stock', protect, updateVariantStock);
router.get('/', getProducts);

// Fetch reviews for a product
router.get('/:id/reviews',         getProductReviews);
// Add a new review (must be logged in)
router.post('/:id/reviews', protect, createProductReview);

// Protected (admin)
router.post('/',   protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

module.exports = router;
