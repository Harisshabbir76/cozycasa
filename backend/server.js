const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: './.env' });

// Prevent crashes from unhandled errors - keeps server alive and logs the cause
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message, err.stack);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// Routes
const authModule = require('./routes/auth');
const authRoutes = authModule.router;
const { generateToken } = authModule;
const propertyRoutes = require('./routes/properties');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const webhookRoutes = require('./routes/webhook');
const reviewRoutes = require('./routes/reviews');
const discountRoutes = require('./routes/discounts');
const faqRoutes = require('./routes/faqs');
const settingRoutes = require('./routes/settings');
const categoryRoutes = require('./routes/categories');
const messageRoutes = require('./routes/messages');



// Connect DB
const connectDB = require('./config/db');

// Init app
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "https://cozycasa-ruddy.vercel.app" 
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Handle OPTIONS preflight for all routes
app.options('*', cors());

// Webhook route must come BEFORE express.json() if it needs raw body
app.use('/api/webhook/stripe', webhookRoutes);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint for Railway
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);

global.generateToken = generateToken;
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/messages', messageRoutes);



// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'CozyCasa Backend Running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
