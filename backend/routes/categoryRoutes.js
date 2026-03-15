const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(getCategories);

module.exports = router;
