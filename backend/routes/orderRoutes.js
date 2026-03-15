const express = require('express');
const { createOrder, getOrderById, cancelOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const { trackOrder } = require('../controllers/orderController');

const router = express.Router();

router.get('/track/:id', trackOrder);

router.use(protect);

router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
