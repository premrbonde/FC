const mongoose = require('mongoose');

const ContentBlockSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    identifier: {
      type: String,
      required: [true, 'Please add a unique identifier (e.g. home-about-us)'],
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    location: {
      type: String,
      enum: ['homepage_top', 'homepage_middle', 'homepage_bottom', 'footer', 'about_page', 'custom'],
      default: 'homepage_top',
    },
    imageUrl: {
      type: String,
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

module.exports = mongoose.model('ContentBlock', ContentBlockSchema);
