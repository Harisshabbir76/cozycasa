const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  otpCode: { type: String },
  otpExpiry: { type: Date }
}, { timestamps: true });

// Hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateOTP = function() {
  this.otpCode = require('crypto').randomInt(100000, 999999).toString();
  this.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  return this.otpCode;
};

userSchema.methods.matchOTP = function(enteredOTP) {
  return this.otpCode === enteredOTP && this.otpExpiry > Date.now();
};

module.exports = mongoose.model('User', userSchema);
