const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a banner title'],
    },
    subtitle: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    linkUrl: {
      type: String,
      default: '/products',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Banner', BannerSchema);
