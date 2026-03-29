const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  serviceFee: { type: Number, default: 0 },
  bookingDeposit: { type: Number, default: 100 }, // percentage or fixed? Let's say percentage for MVP
  contactEmail: String,
  contactPhone: String,
  whatsappNumber: String,
  heroSlider: [{
    image: String,
    title: String,
    subtitle: String,
    link: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
