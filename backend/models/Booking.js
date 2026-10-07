const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientPhone: {
      type: String,
      trim: true,
      default: '',
    },
    programName: {
      type: String,
      required: [true, 'Program name is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    venue: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    branch: {
      type: String,
      enum: ['Jaipur', 'Shahpura', 'Neem Ka Thana'],
      default: 'Jaipur',
    },
    assignedTo: {
      type: String,
      enum: ['Piyush', 'Vishnu', 'Manoj'],
      default: 'Piyush',
    },
    eventType: {
      type: String,
      enum: [
        'Pre wedding',
        'Drone shoot',
        'Cinematic films',
        'Bride entry',
        'Baby shower',
        'House opening',
        'Birthday party',
        'Full wedding photography',
        'Vermala',
        'Corporate events',
        'Other',
      ],
      default: 'Other',
    },
    paymentMode: {
      type: String,
      trim: true,
      default: 'Cash/UPI',
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    receivedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    items: [
      {
        description: { type: String, default: '' },
        qty: { type: Number, default: 1 },
        rate: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual: balance due
bookingSchema.virtual('balanceDue').get(function () {
  return this.totalAmount - this.receivedAmount;
});

// Virtual: payment percentage
bookingSchema.virtual('paymentPercent').get(function () {
  if (this.totalAmount === 0) return 0;
  return Math.round((this.receivedAmount / this.totalAmount) * 100);
});

bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Booking', bookingSchema);
