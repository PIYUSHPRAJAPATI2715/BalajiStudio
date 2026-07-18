require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Admin = require('./models/Admin');

// Existing JSON data
const existingBookings = [
  {
    date: '2026-02-12',
    programName: 'Pre-wedding',
    location: 'jaipur',
    clientName: 'Unknown Client',
    eventType: 'Pre wedding',
    totalAmount: 0,
    receivedAmount: 0,
    status: 'completed',
  },
  {
    date: '2026-02-02',
    programName: 'wedding',
    location: 'jaipur',
    clientName: 'Unknown Client',
    eventType: 'Full wedding photography',
    totalAmount: 0,
    receivedAmount: 0,
    status: 'completed',
  },
  {
    date: '2026-03-03',
    programName: 'Bride entry',
    location: 'Benad Road, Jaipur',
    clientName: 'Raju',
    eventType: 'Bride entry',
    totalAmount: 10000,
    receivedAmount: 2000,
    status: 'completed',
  },
];

const existingReviews = [
  {
    name: 'Rahul & Priya',
    event: 'Wedding',
    rating: 5,
    text: 'Sidhi Vinayak events made our wedding absolutely magical. The decoration, the flow of events, everything was perfect. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1663185566085-f5b248a8c430?q=80&w=200&h=200&auto=format&fit=crop',
    approved: true,
  },
  {
    name: 'Amit Sharma',
    event: 'Corporate Event',
    rating: 5,
    text: 'Professionalism at its best. They handled our corporate gala with such ease. The team is very cooperative and creative.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&auto=format&fit=crop',
    approved: true,
  },
  {
    name: 'Sneha Gupta',
    event: 'Birthday Party',
    rating: 4,
    text: 'Great management! The theme was exactly what we wanted for our daughter\'s birthday. Thank you for making it special.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop',
    approved: true,
  },
  {
    name: 'Piyush Prajapati',
    event: 'Birthday',
    rating: 3,
    text: 'Nice service.',
    image: 'https://ui-avatars.com/api/?name=Piyush%20Prajapati&background=random',
    approved: true,
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('\n🌱 Starting database seed...\n');

    // Clear existing data
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Admin.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed bookings
    const bookings = await Booking.insertMany(existingBookings);
    console.log(`✅ Seeded ${bookings.length} bookings`);

    // Seed reviews
    const reviews = await Review.insertMany(existingReviews);
    console.log(`✅ Seeded ${reviews.length} reviews`);

    // Create admin account
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const admin = new Admin({
      username: adminUsername,
      passwordHash: adminPassword, // Will be hashed by pre-save hook
      displayName: 'Sidhi Vinayak Admin',
    });
    await admin.save();
    console.log(`✅ Created admin account: ${adminUsername}`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('Admin credentials:');
    console.log(`  Username: ${adminUsername}`);
    console.log(`  Password: ${adminPassword}`);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
