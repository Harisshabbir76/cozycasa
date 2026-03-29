const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  whatsapp: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    match: [/^\+?\d{10,15}$/, 'Please enter a valid WhatsApp number (with or without +)']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);

