const Product = require('../models/Product');

// @desc    Create a product (Vendor only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const images = req.files ? req.files.map(file => file.path) : [];

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      images,
      vendor: req.user._id
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all products (with pagination, search, filter)
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category } = req.query;

    let query = {
      name: { $regex: search, $options: 'i' }
    };

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('vendor', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a product (Vendor/Admin only)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Only vendor who created or admin can update
    if (req.user.role !== 'admin' && product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = req.body;

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => file.path);
    }

    product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a product (Vendor/Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.user.role !== 'admin' && product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await product.deleteOne();

    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
