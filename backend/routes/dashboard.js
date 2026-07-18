const express = require('express');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Contact = require('../models/Contact');
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard
// @desc    Get all dashboard stats
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);

    const [
      totalBookings,
      upcomingBookings,
      completedBookings,
      thisMonthBookings,
      nextMonthBookings,
      pendingReviews,
      approvedReviews,
      unreadContacts,
      totalContacts,
      totalGallery,
      revenueAgg,
      thisMonthRevenueAgg,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'upcoming' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ date: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
      Booking.countDocuments({ date: { $gte: nextMonthStart, $lte: nextMonthEnd } }),
      Review.countDocuments({ approved: false }),
      Review.countDocuments({ approved: true }),
      Contact.countDocuments({ read: false }),
      Contact.countDocuments(),
      Gallery.countDocuments(),
      Booking.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAmount' }, received: { $sum: '$receivedAmount' } } },
      ]),
      Booking.aggregate([
        { $match: { date: { $gte: thisMonthStart, $lte: thisMonthEnd } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, received: { $sum: '$receivedAmount' } } },
      ]),
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean({ virtuals: true });

    // Upcoming events (next 30 days)
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upcomingEvents = await Booking.find({
      status: 'upcoming',
      date: { $gte: now, $lte: thirtyDaysFromNow },
    })
      .sort({ date: 1 })
      .limit(5)
      .lean({ virtuals: true });

    const totalRevenue = revenueAgg[0] || { total: 0, received: 0 };
    const thisMonthRevenue = thisMonthRevenueAgg[0] || { total: 0, received: 0 };

    res.json({
      success: true,
      data: {
        bookings: {
          total: totalBookings,
          upcoming: upcomingBookings,
          completed: completedBookings,
          thisMonth: thisMonthBookings,
          nextMonth: nextMonthBookings,
        },
        revenue: {
          total: totalRevenue.total,
          received: totalRevenue.received,
          pending: totalRevenue.total - totalRevenue.received,
          thisMonth: thisMonthRevenue.received,
        },
        reviews: {
          pending: pendingReviews,
          approved: approvedReviews,
        },
        contacts: {
          unread: unreadContacts,
          total: totalContacts,
        },
        gallery: {
          total: totalGallery,
        },
        recentBookings,
        upcomingEvents,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
});

module.exports = router;
