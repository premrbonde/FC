const express = require('express');
const { getProducts, getProductById, getRecommendedProducts } = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/recommended/:category', getRecommendedProducts);
router.get('/:id', getProductById);

module.exports = router;
