const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Product Routes
router.get('/', ProductController.getProducts); // Accessible to all authenticated users
router.post('/', ProductController.addProduct); // Admin only
router.put('/:id', ProductController.updateProduct); // Admin only
router.delete('/:id', ProductController.deleteProduct); // Admin only
router.get("/:id", ProductController.getProductById); // Add the route to handle buyer fetching by ID

module.exports = router;
