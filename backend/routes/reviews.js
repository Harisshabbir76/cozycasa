const express = require('express');
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');

const router = express.Router();

// @desc Get all reviews for a property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Create a review
router.post('/', protect, async (req, res) => {
  try {
    const { property, rating, comment } = req.body;
    const review = await Review.create({
      user: req.user._id,
      property,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
