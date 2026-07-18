const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'sve_secret_f29cda1098bfe190382cb20027f91766a2f1';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;
      const lowerUsername = (username || '').toLowerCase();
      let admin = await Admin.findOne({ username: lowerUsername });

      // Auto-create default admin account if database has no admin users yet
      const count = await Admin.countDocuments();
      if (count === 0) {
        admin = new Admin({
          username: lowerUsername || 'admin',
          passwordHash: password || 'admin123',
          displayName: 'Sidhi Vinayak Admin',
        });
        await admin.save();
        console.log(`✅ On-demand created admin account: ${admin.username}`);
      }

      if (!admin || !(await admin.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      const token = generateToken(admin._id);

      res.json({
        success: true,
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          displayName: admin.displayName,
          lastLogin: admin.lastLogin,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: error.message || 'Server error during login' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current admin profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    id: req.admin._id,
    username: req.admin.username,
    displayName: req.admin.displayName,
    lastLogin: req.admin.lastLogin,
  });
});

// @route   PUT /api/auth/change-password
// @desc    Change admin password
// @access  Private
router.put(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { currentPassword, newPassword } = req.body;
      const admin = await Admin.findById(req.admin._id);

      if (!(await admin.comparePassword(currentPassword))) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      admin.passwordHash = newPassword; // Will be hashed by pre-save hook
      await admin.save();

      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
