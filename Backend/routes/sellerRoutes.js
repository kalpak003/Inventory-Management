const express = require('express');
const router = express.Router();
const SellerController = require('../controllers/sellerController'); // Ensure this path is correct

// Seller Routes
router.get('/', SellerController.getSellers); // Correctly reference the method
router.post('/', SellerController.addSeller); // Correctly reference the method
router.put('/:id', SellerController.updateSeller); // Correctly reference the method
router.delete('/:id', SellerController.deleteSeller); // Correctly reference the method
router.get('/:id', SellerController.getSellerById);

module.exports = router;