const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // per night
  city: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  address: String,
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  area: String, // sq ft
  images: [{ type: String }],
amenities: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

// Text index for search
propertySchema.index({ title: 'text', city: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Property', propertySchema);
