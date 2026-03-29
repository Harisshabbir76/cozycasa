const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'harisshabbir17@gmail.com';
    if (req.user.email !== adminEmail) {
      return res.status(403).json({ message: 'Admin access denied' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = isAdmin;
