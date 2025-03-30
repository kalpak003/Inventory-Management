const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Transaction Routes
router.get('/', transactionController.getTransactions); // Removed authMiddleware
router.post('/', transactionController.addTransaction); // Removed authMiddleware
router.delete('/:id', transactionController.deleteTransaction); // Removed authMiddleware

module.exports = router;