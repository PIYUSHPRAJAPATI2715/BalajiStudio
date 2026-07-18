const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews
// @desc    Get approved reviews (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/reviews/all
// @desc    Get all reviews including unapproved (admin)
// @access  Private
router.get('/all', protect, async (req, res) => {
  try {
    const { approved } = req.query;
    const filter = {};
    if (approved !== undefined) {
      filter.approved = approved === 'true';
    }
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/reviews
// @desc    Submit a review (public)
// @access  Public
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('event').trim().notEmpty().withMessage('Event type is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('text').trim().isLength({ min: 10 }).withMessage('Review must be at least 10 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Auto-generate avatar if no image
      const imageUrl =
        req.body.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(req.body.name)}&background=random`;

      const review = await Review.create({
        ...req.body,
        image: imageUrl,
        approved: false, // Needs admin approval
      });

      res.status(201).json({
        success: true,
        message: 'Thank you! Your review has been submitted and is pending approval.',
        data: { id: review._id },
      });
    } catch (error) {
      console.error('Submit review error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   PUT /api/reviews/:id
// @desc    Update review (approve/reject/feature)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
