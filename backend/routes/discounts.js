const express = require('express');
const { protect, admin } = require('../middleware/auth');
const Discount = require('../models/Discount');

const router = express.Router();

// @desc Validate a discount code
router.post('/validate', protect, async (req, res) => {
  try {
    const { code, amount } = req.body;
    const discount = await Discount.findOne({ code, isActive: true, expiryDate: { $gt: new Date() } });

    if (!discount) return res.status(404).json({ message: 'Invalid or expired discount code.' });
    if (amount < discount.minBookingValue) return res.status(400).json({ message: `Minimum booking value of ${discount.minBookingValue} required.` });

    res.json(discount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin CRUD for discounts...
router.get('/', protect, admin, async (req, res) => {
    try {
        const discounts = await Discount.find({});
        res.json(discounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', protect, admin, async (req, res) => {
    try {
        const discount = await Discount.create(req.body);
        res.status(201).json(discount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
