const express = require('express');
const { protect, admin } = require('../middleware/auth');
const Setting = require('../models/Setting');
const upload = require('../middleware/upload');

const router = express.Router();

// @desc Get site settings
router.get('/', async (req, res) => {
  try {
    let setting = await Setting.findOne({});
    if (!setting) {
      setting = await Setting.create({});
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings
router.put('/', protect, admin, upload.array('heroImages', 5), async (req, res) => {
  try {
    let setting = await Setting.findOne({});
    if (!setting) setting = new Setting({});

    const updateData = { ...req.body };
    
    // Handle hero slider images if needed
    // Simplified for MVP: just update text fields
    
    Object.assign(setting, updateData);
    await setting.save();
    res.json(setting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
