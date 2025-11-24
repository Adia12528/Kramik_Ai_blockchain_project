import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/kramik';
    
    // Serverless-friendly connection options
    const options = {
      maxPoolSize: 10, // Limit connection pool for serverless
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    };
    
    await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Don't exit process in serverless environment
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

export default connectDB;
