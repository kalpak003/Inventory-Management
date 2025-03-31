const express = require('express');
const router = express.Router();
const BuyerController = require('../controllers/BuyerController');
const authorize = require('../middlewares/authMiddleware');

// Only Admin can add, update, or delete buyers
router.post('/', authorize(['admin']), BuyerController.addBuyer);
router.put('/:id', authorize(['admin']), BuyerController.updateBuyer);
router.delete('/:id', authorize(['admin']), BuyerController.deleteBuyer);

// Users & Admins can view buyers
router.get('/', authorize(['admin', 'user']), BuyerController.getBuyers);

module.exports = router;
