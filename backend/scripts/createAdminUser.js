require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Admin credentials
    const adminUsername = 'admin';
    const adminEmail = 'admin@fifa2026.com';
    const adminPassword = 'Admin2026!';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { username: adminUsername },
        { email: adminEmail }
      ]
    });

    if (existingAdmin) {
      console.log('Admin user already exists, updating to admin role...');
      
      // Update to admin role
      existingAdmin.role = 'admin';
      existingAdmin.passwordHash = adminPassword; // Will be hashed by pre-save hook
      existingAdmin.isActive = true;
      existingAdmin.emailVerified = true;
      await existingAdmin.save();

      console.log('✅ Admin user updated successfully!');
    } else {
      console.log('Creating new admin user...');
      
      // Create admin user
      const admin = new User({
        username: adminUsername,
        email: adminEmail,
        passwordHash: adminPassword, // Will be hashed by pre-save hook
        role: 'admin',
        authProvider: 'local',
        isActive: true,
        emailVerified: true,
      });

      await admin.save();
      console.log('✅ Admin user created successfully!');
    }

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('  ADMIN USER CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log('  Username: admin');
    console.log('  Email:    admin@fifa2026.com');
    console.log('  Password: Admin2026!');
    console.log('  Role:     admin');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('');

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdminUser();

// Made with Bob