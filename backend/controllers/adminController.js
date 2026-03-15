const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Banner = require('../models/Banner');
const DeliverySettings = require('../models/DeliverySettings');
const sendEmail = require('../config/mailer');

// --- DASHBOARD ANALYTICS ---

// @desc    Get dashboard stats
// @route   GET /api/v1/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();

    const sales = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
    ]);

    const totalSales = sales.length > 0 ? sales[0].totalSales : 0;

    res.json({
      success: true,
      data: {
        users: usersCount,
        products: productsCount,
        orders: ordersCount,
        sales: totalSales
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- USER MANAGEMENT ---

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Promote user to admin
// @route   PUT /api/v1/admin/users/:id/promote
// @access  Private/Admin
const promoteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: 'admin' }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// --- PRODUCT MANAGEMENT ---

// @desc    Create product
// @route   POST /api/v1/admin/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/v1/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- ORDER MANAGEMENT ---

// @desc    Get all orders
// @route   GET /api/v1/admin/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images stock');

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper: decrement product stock for an order (only once per order)
const decrementOrderStock = async (order) => {
  // Ensure we only decrement once (using shippedAt as marker)
  if (order.shippedAt) return;

  for (const item of order.orderItems) {
    if (!item.product) continue;

    const product = await Product.findById(item.product._id || item.product);
    if (!product) continue;

    product.stock = Math.max(0, (product.stock || 0) - (item.quantity || 0));
    await product.save();
  }
};

// @desc    Confirm order
// @route   PUT /api/v1/admin/orders/:id/confirm
// @access  Private/Admin
const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = 'Shipped';
    order.shippedAt = new Date();

    await decrementOrderStock(order);
    await order.save();

    // Send confirmation email
    const emailMessage = `
      Your order has been confirmed by FCmenswear.

      Order ID: ${order._id}
      Status: Shipped
      We are processing your delivery!
    `;

    try {
      await sendEmail({
        email: order.user.email,
        subject: 'Order Confirmed - FCmenswear',
        message: emailMessage
      });
    } catch (emailError) {
      console.error('Email sending failed in confirm order:', emailError);
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/v1/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Accepted', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update status
    order.status = status;

    // Update timestamps based on status
    const now = new Date();
    if (status === 'Accepted') order.confirmedAt = now;
    if (status === 'Shipped') order.shippedAt = now;
    if (status === 'Out For Delivery') order.outForDeliveryAt = now;
    if (status === 'Delivered') order.deliveredAt = now;
    if (status === 'Cancelled') order.cancelledAt = now;

    await order.save();

    // Send email notification for specific statuses
    if (['Shipped', 'Out For Delivery', 'Delivered'].includes(status)) {
      const emailSubject = `Order ${status} - FCmenswear`;
      const emailMessage = `
        Hello ${order.user.name},

        Your order (ID: ${order._id}) status has been updated to: ${status}.

        ${status === 'Shipped' ? 'Your package is on its way!' : ''}
        ${status === 'Out For Delivery' ? 'Your package is now out for delivery. It will reach you soon!' : ''}
        ${status === 'Delivered' ? 'Your package has been delivered. Thank you for shopping with us!' : ''}

        Regards,
        FCmenswear Team
      `;

      try {
        await sendEmail({
          email: order.user.email,
          subject: emailSubject,
          message: emailMessage
        });
      } catch (emailError) {
        console.error(`Email sending failed for order status ${status}:`, emailError);
      }
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- BANNER MANAGEMENT ---

// @desc    Get all banners
// @route   GET /api/v1/admin/banners
// @access  Private/Admin
const getAdminBanners = async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload banner
// @route   POST /api/v1/admin/banners
// @access  Private/Admin
const uploadBanner = async (req, res) => {
  try {
    // Check limit
    const count = await Banner.countDocuments();
    if (count >= 4) {
      return res.status(400).json({ success: false, message: 'Maximum 4 banners allowed. Delete one first.' });
    }

    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete banner
// @route   DELETE /api/v1/admin/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- DELIVERY SETTINGS ---

// @desc    Get delivery settings
// @route   GET /api/v1/admin/delivery-settings
// @access  Private/Admin
const getDeliverySettings = async (req, res) => {
  try {
    let settings = await DeliverySettings.findOne();
    if (!settings) {
       settings = await DeliverySettings.create({ chargePerKm: 5, baseCharge: 50, freeDeliveryThreshold: 500 });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update delivery settings
// @route   PUT /api/v1/admin/delivery-settings
// @access  Private/Admin
const updateDeliverySettings = async (req, res) => {
  try {
    let settings = await DeliverySettings.findOne();
    if (!settings) {
       settings = await DeliverySettings.create(req.body);
    } else {
       settings = await DeliverySettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
