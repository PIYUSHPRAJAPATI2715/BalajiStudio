const mongoose = require('mongoose');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

function sanitizeMongoUri(uri) {
  const defaultUri = 'mongodb+srv://Admin:KVDkPaXDO2SLqL3U@cluster0.rgkjhjo.mongodb.net/SidhiVinayak?retryWrites=true&w=majority';
  const targetUri = uri && uri.trim() ? uri.trim() : defaultUri;
  return targetUri.replace(/(mongodb(?:\+srv)?:\/\/[^\/]+)(?:\/([^?]*))?(\?.*)?$/i, (match, host, db, query) => {
    return `${host}/SidhiVinayak${query || ''}`;
  });
}

const MONGODB_URI = sanitizeMongoUri(process.env.MONGODB_URI);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: 'SidhiVinayak',
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
