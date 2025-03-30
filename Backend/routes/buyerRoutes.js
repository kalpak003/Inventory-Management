const express = require('express');
const router = express.Router();
const BuyerController = require('../controllers/buyerController'); // Ensure this path is correct

// Buyer Routes
router.get('/', BuyerController.getBuyers); // Correctly reference the method
router.post('/', BuyerController.addBuyer); // Correctly reference the method
router.put('/:id', BuyerController.updateBuyer); // Correctly reference the method
router.delete('/:id', BuyerController.deleteBuyer); // Correctly reference the method

module.exports = router;