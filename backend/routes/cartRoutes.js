const express = require('express');
const { getCart, addToCart, removeFromCart, updateCartItemQuantity } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // All cart routes require auth

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateCartItemQuantity);
router.delete('/:itemId', removeFromCart);

module.exports = router;
