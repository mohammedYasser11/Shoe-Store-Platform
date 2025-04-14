const Product = require('../models/Product');

// GET /api/products
// Get all products with optional filters
exports.getAll = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    const filter = {};

    // 1. Text search on name (case‑insensitive)
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // 2. Optional: filter by category
    if (category) {
      filter.category = category;
    }

    // 3. Optional: price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error('GetAll products error:', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id
exports.getById = async (req, res) => {
  const prod = await Product.findById(req.params.id);
  if (!prod) return res.status(404).json({ message: 'Not found' });
  res.json(prod);
};

// POST /api/products      (protected, admin only)
exports.create = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// PUT /api/products/:id   (protected)
exports.update = async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(prod);
};

// DELETE /api/products/:id (protected)
exports.remove = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
