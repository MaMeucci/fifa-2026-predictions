require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// User schema (simplified)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { username: 'testuser' },
        { email: 'test@example.com' }
      ]
    });

    if (existingUser) {
      console.log('User already exists, updating password...');
      
      // New password
      const newPassword = 'Test123!';
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      existingUser.password = hashedPassword;
      await existingUser.save();

      console.log('✅ Password updated successfully!');
    } else {
      console.log('Creating new test user...');
      
      // New password
      const newPassword = 'Test123!';
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Create user
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
      });

      await user.save();
      console.log('✅ Test user created successfully!');
    }

    console.log('');
    console.log('Test user credentials:');
    console.log('Username: testuser');
    console.log('Email: test@example.com');
    console.log('Password: Test123!');
    console.log('');

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createTestUser();

// Made with Bob
