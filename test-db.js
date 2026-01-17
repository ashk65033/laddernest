const mongoose = require('mongoose');

async function testConnection() {
  try {
    const MONGODB_URI = 'mongodb+srv://ayush:ayush123@cluster0.9h4qgcg.mongodb.net/newjobportal';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test if we can query the database
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('Connection closed.');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
