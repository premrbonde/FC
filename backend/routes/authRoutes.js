const express = require('express');
const {
  register,
  login,
  googleLogin,
  getMe,
  updateDetails,
} = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

module.exports = router;
