const express = require('express');
const {
  getContentBlocks,
  getContentBlockByIdentifier,
  createContentBlock,
  updateContentBlock,
  deleteContentBlock,
} = require('../controllers/contentBlockController');

const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(getContentBlocks);
router.route('/:identifier').get(getContentBlockByIdentifier);

module.exports = router;
