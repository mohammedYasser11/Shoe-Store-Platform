const jwt = require('jsonwebtoken');
const User = require('../models/User'); // needed to fetch full user info

// Auth middleware: verifies JWT and attaches user object
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found.' });

    req.user = user; // Attach full user info to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Authorization middleware: checks if user is admin
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access only.' });
  }
  next();
};

// Export both middlewares
module.exports = { protect, adminOnly };
