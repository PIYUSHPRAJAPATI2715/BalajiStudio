const mongoose = require('mongoose');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

let rawUri = process.env.MONGODB_URI || 'mongodb+srv://Admin:KVDkPaXDO2SLqL3U@cluster0.rgkjhjo.mongodb.net/SidhiVinayak?retryWrites=true&w=majority';
const MONGODB_URI = rawUri.replace(/\/sidhivinayak(\?|$)/i, '/SidhiVinayak$1');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

module.exports = connectDB;
