const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
  getDashboardStats,
  getUsers,
  promoteUser,
  deleteUser,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  confirmOrder,
  updateOrderStatus,
  getAdminBanners,
  uploadBanner,
  deleteBanner,
  getDeliverySettings,
  updateDeliverySettings
} = require('../controllers/adminController');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getUsers);
router.put('/users/:id/promote', promoteUser);
router.delete('/users/:id', deleteUser);

// Products
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Orders
router.get('/orders', getOrders);
router.put('/orders/:id/confirm', confirmOrder);
router.put('/orders/:id/status', updateOrderStatus);

// Banners
router.get('/banners', getAdminBanners);
router.post('/banners', uploadBanner);
router.delete('/banners/:id', deleteBanner);

// Delivery Settings
router.get('/delivery-settings', getDeliverySettings);
router.put('/delivery-settings', updateDeliverySettings);

// Categories
const { createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Content Blocks
const { createContentBlock, updateContentBlock, deleteContentBlock } = require('../controllers/contentBlockController');
router.post('/content-blocks', createContentBlock);
router.put('/content-blocks/:id', updateContentBlock);
router.delete('/content-blocks/:id', deleteContentBlock);

module.exports = router;
