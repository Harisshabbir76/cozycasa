const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  nights: { type: Number, required: true },
  guests: { type: Number, default: 1 },
  paymentStatus: { type: String, default: 'pending' },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  paymentId: String,
  coupon: String,
  guestInfo: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    cnic: { type: String }
  }
}, { timestamps: true });

// Index for availability queries
bookingSchema.index({ property: 1, checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ property: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
