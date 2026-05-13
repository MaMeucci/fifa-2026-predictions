require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// User schema (simplified)
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

async function resetPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find user
    const user = await User.findOne({ 
      username: 'testuser',
      email: 'test@example.com'
    });

    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log(`Found user: ${user.username} (${user.email})`);

    // New password
    const newPassword = 'Test123!';
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    console.log('✅ Password reset successfully!');
    console.log('');
    console.log('New credentials:');
    console.log('Username: testuser');
    console.log('Email: test@example.com');
    console.log('Password: Test123!');
    console.log('');

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetPassword();

// Made with Bob
