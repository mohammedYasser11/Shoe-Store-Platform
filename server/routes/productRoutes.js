const router = require('express').Router();
const auth   = require('../middleware/auth');
const { getAll, getById, create, update, remove, getRelatedProducts, getLimitedProducts } = require('../controllers/productController');

// Public
router.get('/related', getRelatedProducts);
router.get('/limited', getLimitedProducts); 
router.get('/',    getAll);
router.get('/:id', getById);

// Protected (admin)
router.post('/',   auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);

module.exports = router;
