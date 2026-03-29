const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: './.env' });

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
app.use(cors());

// Webhook route must come BEFORE express.json() if it needs raw body
app.use('/api/webhook/stripe', webhookRoutes);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
