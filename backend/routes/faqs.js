const express = require('express');
const { protect, admin } = require('../middleware/auth');
const FAQ = require('../models/FAQ');

const router = express.Router();

// @desc Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find({});
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin CRUD...
router.post('/', protect, admin, async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
