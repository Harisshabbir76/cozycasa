const express = require('express');
const { protect, admin } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const mongoose = require('mongoose');

const router = express.Router();

// @desc Check availability
// @route POST /api/bookings/check-availability
router.post('/check-availability', async (req, res) => {
  const { propertyId, checkInDate, checkOutDate } = req.body;

  try {
    const conflicts = await Booking.find({
      property: propertyId,
      status: { $nin: ['cancelled', 'expired'] },
      $or: [
        { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }
      ]
    });

    if (conflicts.length > 0) {
      return res.json({ available: false, conflicts });
    }

    res.json({ available: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Create a booking (guest allowed)
router.post('/', async (req, res) => {
  console.log('POST /bookings - req.body:', JSON.stringify(req.body, null, 2));
  console.log('req.user:', req.user?._id || 'guest');
  const { propertyId, checkIn, checkOut, totalPrice, guests, userId, paymentId, guestInfo } = req.body;

  // Validate propertyId
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    console.log('Invalid propertyId format:', propertyId);
    return res.status(400).json({ message: 'Invalid property ID format' });
  }

  const property = await Property.findById(propertyId).select('title price');
  if (!property) {
    console.log('Property not found:', propertyId);
    return res.status(400).json({ message: 'Property not found' });
  }
  console.log('Property validated:', property.title);

  try {
    const checkInDate = checkIn;
    const checkOutDate = checkOut;

    // Re-check availability at the last second
    const conflicts = await Booking.find({
      property: propertyId,
      status: { $nin: ['cancelled', 'expired'] },
      $or: [
        { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }
      ]
    });

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'Selected dates are no longer available.' });
    }

    const diffTime = Math.abs(new Date(checkOutDate) - new Date(checkInDate));
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let paymentStatus = 'pending';
    let status = 'pending';

    // Verify Stripe payment intent on server side
    if (paymentId) {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const pi = await stripe.paymentIntents.retrieve(paymentId);
        if (pi && pi.status === 'succeeded') {
          paymentStatus = 'paid';
          status = 'confirmed';
        }
      } catch (err) {
        console.error('Error verifying stripe paymentId:', err.message);
      }
    }

    const bookingData = {
      property: propertyId,
      checkInDate,
      checkOutDate,
      totalPrice,
      nights,
      guests: guests || 1,
      paymentStatus,
      status,
      paymentId: paymentStatus === 'paid' ? paymentId : undefined,
      guestInfo: guestInfo || {}
    };

    if (req.user) {
      bookingData.user = req.user._id;
    } // else guest booking, user: null

    const booking = await Booking.create(bookingData);

    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking create ERROR:', error);
    res.status(400).json({ message: error.message });
  }
});

// @desc Get user bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('property', 'title location images price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get single booking
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('property');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Auth check
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

