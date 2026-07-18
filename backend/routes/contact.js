const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/contact
// @desc    Get all contact inquiries
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { read } = req.query;
    const filter = {};
    if (read !== undefined) {
      filter.read = read === 'true';
    }
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    const unreadCount = await Contact.countDocuments({ read: false });
    res.json({ success: true, count: contacts.length, unreadCount, data: contacts });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/contact
// @desc    Submit contact form (public)
// @access  Public
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const contact = await Contact.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully!',
        data: { id: contact._id },
      });
    } catch (error) {
      console.error('Contact submit error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   PUT /api/contact/:id/read
// @desc    Mark contact as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/contact/:id/replied
// @desc    Mark contact as replied
// @access  Private
router.put('/:id/replied', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { replied: true, read: true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
