const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Existing routes
router.get('/', transactionController.getTransactions);
router.post('/', transactionController.addTransaction);
router.post('/user/search', transactionController.getTransactionsByUsername);

module.exports = router;
