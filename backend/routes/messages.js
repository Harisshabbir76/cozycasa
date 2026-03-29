const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// @desc    Submit contact form (guest allowed)
router.post('/', async (req, res) => {
  try {
    const { name, email, whatsapp, message } = req.body;

    if (!name || !email || !whatsapp || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newMessage = new Message({
      name,
      email,
      whatsapp,
      message
    });

    await newMessage.save();

    res.status(201).json({
      message: 'Thank you! Your message has been sent. We will contact you soon.',
      data: {
        id: newMessage._id,
        status: newMessage.status
      }
    });
  } catch (error) {
    console.error('Message creation error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }

    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;

