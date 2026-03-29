
const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Category = require('../models/Category');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Message = require('../models/Message');


const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.use(protect, isAdmin);

// GET /api/admin/properties
router.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find().populate('category');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/admin/properties
router.post('/properties', upload.array('images', 20), async (req, res) => {
  try {
    let propertyData = { ...req.body };
    
    // Handle category: normalize array → string, then find/create
    let categoryValue = propertyData.category;
    if (Array.isArray(categoryValue)) {
      categoryValue = categoryValue.find(val => val && val.trim()) || categoryValue[categoryValue.length - 1];
    }
    if (categoryValue && typeof categoryValue === 'string') {
      categoryValue = categoryValue.trim();
      let category = await Category.findOne({ name: categoryValue });
      if (!category) {
        category = new Category({ name: categoryValue });
        await category.save();
      }
      propertyData.category = category._id;
    }
    
    if (req.files && req.files.length > 0) {
      propertyData.images = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    const property = new Property(propertyData);
    await property.save();
    const populated = await Property.findById(property._id).populate('category');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Property creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/admin/properties/:id
router.put('/properties/:id', upload.array('images', 20), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Handle new uploads
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Combine with existing images sent from frontend
    // Frontend should send existingImages as a JSON string or array
    let existingImages = [];
    if (req.body.existingImages) {
      existingImages = typeof req.body.existingImages === 'string' 
        ? JSON.parse(req.body.existingImages) 
        : req.body.existingImages;
    }

    updateData.images = [...existingImages, ...newImages];

    const property = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('category');
    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/admin/properties/:id
router.delete('/properties/:id', async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('property', 'title location price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admin/bookings/:id
router.put('/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('user', 'name email phone')
      .populate('property', 'title location price');
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ── Messages Admin Routes ──

// GET /api/admin/messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admin/messages/:id - Update status
router.put('/messages/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const message = await Message.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/admin/messages/:id
router.delete('/messages/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
