const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get all bookings (with optional filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, month, year, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: startDate, $lte: endDate };
    } else if (year) {
      filter.date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      };
    }

    if (search) {
      filter.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { programName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { eventType: { $regex: search, $options: 'i' } },
      ];
    }

    const bookings = await Booking.find(filter).sort({ date: 1 }).lean({ virtuals: true });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
});

// @route   GET /api/bookings/calendar
// @desc    Get bookings for calendar view (public, only dates & basic info)
// @access  Public
router.get('/calendar', async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { status: { $ne: 'cancelled' } };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const bookings = await Booking.find(filter)
      .select('date eventType status programName')
      .sort({ date: 1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).lean({ virtuals: true });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post(
  '/',
  protect,
  [
    body('clientName').trim().notEmpty().withMessage('Client name is required'),
    body('programName').trim().notEmpty().withMessage('Program name is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('totalAmount').optional().isNumeric().withMessage('Total amount must be a number'),
    body('receivedAmount').optional().isNumeric().withMessage('Received amount must be a number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const booking = await Booking.create(req.body);
      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({ error: 'Server error creating booking' });
    }
  }
);

// @route   PUT /api/bookings/:id
// @desc    Update booking
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).lean({ virtuals: true });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Server error updating booking' });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting booking' });
  }
});

module.exports = router;
