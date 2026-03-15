const express = require('express');
const { getBanners, getNewArrivals, getProducts, getPublicDeliverySettings } = require('../controllers/publicController');

const router = express.Router();

router.get('/banners', getBanners);
router.get('/new-arrivals', getNewArrivals);
router.get('/products', getProducts);
router.get('/delivery-settings', getPublicDeliverySettings);

module.exports = router;
