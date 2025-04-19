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

    // 2. Optional: filter by category (using case-insensitive exact match)
    if (category) {
      filter.category = { $regex: `^${category}$`, $options: 'i' };
    }

    // 3. Optional: price range filtering
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

// GET /api/products/limited
exports.getLimitedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8; // Default to 8 products if no limit is provided
    const products = await Product.find().limit(limit); // Fetch limited products
    res.json(products);
  } catch (err) {
    console.error('Error fetching limited products:', err);
    res.status(500).json({ message: 'Error fetching limited products' });
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

// GET /api/products/related
exports.getRelatedProducts = async (req, res) => {
  const { category, brand, exclude } = req.query;
  console.log('Query Parameters:', { category, brand, exclude });
  try {
    const filter = {
      category,
      _id: { $ne: exclude } // Exclude the current product
    };
    // Limit to 4 products for related products
    const relatedProducts = await Product.find(filter).limit(4);
    res.json(relatedProducts);
  } catch (err) {
    console.error('Error fetching related products:', err);
    res.status(500).json({ message: 'Error fetching related products', error: err.message });
  }
};

// GET /api/products/:productId/variants/:variantId
// Controller to get a specific product variant
exports.getProductVariant = async (req, res) => {
  const { productId, variantId } = req.params;

  try {
    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the specific variant by its ID
    const variant = product.variants.find(v => v._id.toString() === variantId);
    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    // Return the product and the specific variant
    res.json({ product, variant });
  } catch (err) {
    console.error('Error fetching product variant:', err);
    res.status(500).json({ message: 'Failed to fetch product variant' });
  }
};

// Controller to update stock for a specific product variant
exports.updateVariantStock = async (req, res) => {
  const { productId, variantId } = req.params; // Extract productId and variantId from the route parameters
  const { stock } = req.body; // Extract the new stock value from the request body

  // Validate the stock value
  if (!stock || isNaN(stock)) {
    return res.status(400).json({ message: 'Invalid stock value' });
  }

  try {
    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the specific variant by its ID
    const variant = product.variants.find(v => v._id.toString() === variantId);
    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    // Update the stock for the variant
    variant.stock += parseInt(stock, 10);

    // Save the updated product
    await product.save();

    res.status(200).json({ message: 'Stock updated successfully', product });
  } catch (err) {
    console.error('Error updating variant stock:', err);
    res.status(500).json({ message: 'Failed to update stock' });
  }
};
