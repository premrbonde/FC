# FCmenswear - Full Stack Clothing E-commerce Website

A premium full-stack e-commerce website built for FCmenswear.

## Tech Stack

*   **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion, React Router, Axios
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB Atlas (Mongoose)
*   **Authentication:** JWT, Google OAuth
*   **Email:** Nodemailer
*   **Image Storage:** Cloudinary

## Features
- Complete user authentication (Email/Password, Google OAuth).
- Home page with dynamic Banners, Category blocks, and New Arrivals.
- Product browsing with filters (Color, Price, Category) and pagination.
- Shopping Cart and Wishlist functionality.
- Address management (Shipping and Delivery).
- Order processing and confirmation emails.
- Complete Admin Panel with role-based access control.
- Admin management for Users, Products, Orders, Banners, and Delivery Settings.

---

## Instructions to Run Project Locally

### 1. Install Dependencies

You need to install dependencies for both the frontend and backend.

```bash
# Install backend dependencies
cd backend
npm install

# Return to root and install frontend dependencies
cd ../frontend
npm install
cd ..
```

### 2. Configure Environment Variables

Create a `.env` file in the **backend** directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fcmenswear
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
EMAIL_FROM=noreply@fcmenswear.com
GOOGLE_CLIENT_ID=your_google_oauth_client_id
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create a `.env` file in the **frontend** directory:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Start Backend

```bash
cd backend
npm start &
# Server runs on http://localhost:5000
```

### 4. Start Frontend

Open a new terminal window:

```bash
cd frontend
npm run dev &
# Vite runs typically on http://localhost:5173
```

---

## Deployment Configuration

*   **Frontend (Vercel):** The frontend folder is ready to be deployed to Vercel. Select the `/frontend` directory as the Root Directory. The build command is `npm run build` and output directory is `dist`. Set the environment variables in the Vercel dashboard.
*   **Backend (Render):** The backend folder can be deployed as a Web Service on Render. Set the root directory to `/backend`, the build command to `npm install`, and the start command to `node server.js`. Add all backend environment variables into the Render dashboard.
*   **Database:** MongoDB Atlas is already configured to be used via the `MONGO_URI` environment variable.
