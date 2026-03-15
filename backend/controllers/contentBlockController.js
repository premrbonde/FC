const ContentBlock = require('../models/ContentBlock');

// @desc    Get all content blocks
// @route   GET /api/v1/content-blocks
// @access  Public
exports.getContentBlocks = async (req, res) => {
  try {
    const blocks = await ContentBlock.find();

    // Ensure older blocks without a location still render (default to homepage top)
    const normalized = blocks.map((block) => {
      const obj = block.toObject();
      if (!obj.location) obj.location = 'homepage_top';
      return obj;
    });

    res.status(200).json({ success: true, count: normalized.length, data: normalized });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get a single content block by identifier
// @route   GET /api/v1/content-blocks/:identifier
// @access  Public
exports.getContentBlockByIdentifier = async (req, res) => {
  try {
    const block = await ContentBlock.findOne({ identifier: req.params.identifier });
    if (!block) {
      return res.status(404).json({ success: false, error: 'Content block not found' });
    }
    res.status(200).json({ success: true, data: block });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a content block
// @route   POST /api/v1/admin/content-blocks
// @access  Private/Admin
exports.createContentBlock = async (req, res) => {
  try {
    const block = await ContentBlock.create(req.body);
    res.status(201).json({ success: true, data: block });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update a content block
// @route   PUT /api/v1/admin/content-blocks/:id
// @access  Private/Admin
exports.updateContentBlock = async (req, res) => {
  try {
    let block = await ContentBlock.findById(req.params.id);
    if (!block) {
      return res.status(404).json({ success: false, error: 'Content block not found' });
    }
    block = await ContentBlock.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: block });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete a content block
// @route   DELETE /api/v1/admin/content-blocks/:id
// @access  Private/Admin
exports.deleteContentBlock = async (req, res) => {
  try {
    const block = await ContentBlock.findById(req.params.id);
    if (!block) {
      return res.status(404).json({ success: false, error: 'Content block not found' });
    }
    await block.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
