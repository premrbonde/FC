const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
      default: 'FCmenswear',
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['T-Shirts', 'Shirts', 'Pants', 'Others'],
    },
    colors: {
      type: [String],
      required: [true, 'Please add at least one color variant'],
    },
    sizes: {
      type: [String],
      required: [true, 'Please add at least one size variant'],
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one image'],
    },
    stock: {
      type: Number,
      default: 0,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', ProductSchema);
