const { protect } = require('./auth');
const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    await protect(req, res, async () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ message: 'Admin verification failed' });
  }
};

module.exports = admin;
