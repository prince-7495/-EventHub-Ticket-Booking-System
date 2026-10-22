import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('⚠ MongoDB connection error:', error.message);
    console.log('⚠ Running in demo mode without persistent database');
    console.log('⚠ To fix: Install and start MongoDB');
    console.log('   - Windows: mongod.exe (from MongoDB installation)');
    console.log('   - macOS: brew services start mongodb-community');
    console.log('   - Linux: sudo systemctl start mongod');
    // Don't exit - allow app to run in demo mode
  }
};

export default connectDB;
