const express = require('express');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(
    protect,
    authorizeRoles('vendor', 'admin'),
    upload.array('images', 5), // max 5 images
    createProduct
  );

router.route('/:id')
  .put(
    protect,
    authorizeRoles('vendor', 'admin'),
    upload.array('images', 5),
    updateProduct
  )
  .delete(
    protect,
    authorizeRoles('vendor', 'admin'),
    deleteProduct
  );

module.exports = router;
