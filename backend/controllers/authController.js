const User = require('../models/User');
const Address = require('../models/Address');
const jwt = require('jsonwebtoken');
const sendEmail = require('../config/mailer');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      shippingAddress,
      deliveryAddress,
      pincode,
      district,
      taluka,
      town,
      country,
    } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const address = {
      shippingAddress,
      deliveryAddress,
      pincode,
      district,
      taluka,
      town,
      country,
    };

    // Create user
    user = await User.create({
      name,
      email,
      password,
      phone,
      addresses: [address],
    });

    // Create entry in Address collection
    await Address.create({
      user: user._id,
      fullName: name,
      phone,
      shippingAddress,
      deliveryAddress,
      pincode,
      district,
      taluka,
      town,
      country,
      isDefault: true,
    });

    // Send confirmation email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to FCmenswear!',
        message: `Hello ${user.name},\n\nThank you for registering at FCmenswear. We are glad to have you on board!`,
      });
    } catch (err) {
      console.error('Error sending confirmation email:', err);
      // We still want to return success even if email fails, or handle it differently based on requirements
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res) => {
  // Only update provided fields (avoid setting undefined values)
  const fieldsToUpdate = {};
  if (typeof req.body.name === 'string') fieldsToUpdate.name = req.body.name;
  if (typeof req.body.email === 'string') fieldsToUpdate.email = req.body.email;
  if (typeof req.body.phone === 'string') fieldsToUpdate.phone = req.body.phone;

  try {
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update details error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Google OAuth login
// @route   POST /api/v1/auth/google-login
// @access  Public
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, sub } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user with random password since they use Google
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      user = await User.create({
        name,
        email,
        password: randomPassword,
        phone: 'Not provided', // Google doesn't always return phone
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Google Login Failed' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
