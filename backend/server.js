const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
// Allow the frontend (including Vercel deployments) to access the API.
// We reflect allowed origins back to the client so credentialed requests work.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://localhost:5173',
      ];

      // Allow all Vercel preview/production domains
      const isVercel = origin.endsWith('.vercel.app') || origin.endsWith('.vercel.sh');

      if (allowedOrigins.includes(origin) || isVercel) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());

// Connect to Database
connectDB();

// Route files
const auth = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const contentBlockRoutes = require('./routes/contentBlockRoutes');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/public', publicRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/content-blocks', contentBlockRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('FCmenswear API running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
