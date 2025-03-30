const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController'); // Ensure this path is correct

// Product Routes
router.get('/', ProductController.getProducts); // Correctly reference the method
router.post('/', ProductController.addProduct); // Correctly reference the method
router.put('/:id', ProductController.updateProduct); // Correctly reference the method
router.delete('/:id', ProductController.deleteProduct); // Correctly reference the method

module.exports = router;