const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

const router = express.Router();

// Stripe webhook handler
// Note: This route needs the raw body to verify the signature
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test');
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata.bookingId;

    if (bookingId) {
      try {
        await Booking.findByIdAndUpdate(bookingId, {
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentId: paymentIntent.id
        });
        console.log(`Booking ${bookingId} confirmed via webhook.`);
      } catch (error) {
        console.error(`Error updating booking ${bookingId}:`, error.message);
      }
    }
  }

  res.json({ received: true });
});

module.exports = router;

