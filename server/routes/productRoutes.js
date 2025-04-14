const router = require('express').Router();
const auth   = require('../middleware/auth');
const { getAll, getById, create, update, remove } = require('../controllers/productController');

// Public
router.get('/',    getAll);
router.get('/:id', getById);

// Protected (admin)
router.post('/',   auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);

module.exports = router;
