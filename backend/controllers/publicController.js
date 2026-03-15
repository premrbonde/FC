const Product = require('../models/Product');
const Banner = require('../models/Banner');

// @desc    Get all active banners
// @route   GET /api/v1/public/banners
// @access  Public
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true });
    res.status(200).json({ success: true, count: banners.length, data: banners });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get delivery settings (public view for cart/checkout)
// @route   GET /api/v1/public/delivery-settings
// @access  Public
exports.getPublicDeliverySettings = async (req, res) => {
  try {
    const DeliverySettings = require('../models/DeliverySettings');
    let settings = await DeliverySettings.findOne();
    if (!settings) {
      settings = await DeliverySettings.create({ baseCharge: 50, freeDeliveryThreshold: 500, chargePerKm: 5 });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get new arrival products
// @route   GET /api/v1/public/new-arrivals
// @access  Public
exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true }).limit(8);
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all products
// @route   GET /api/v1/public/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
