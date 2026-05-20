const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Temporary endpoint to create admin user - REMOVE AFTER USE
router.post('/create-first-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@fifa2026.com' });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists',
        user: {
          username: existingAdmin.username,
          email: existingAdmin.email,
          role: existingAdmin.role,
          createdAt: existingAdmin.createdAt
        }
      });
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@fifa2026.com',
      password: 'Admin2026!', // Will be hashed by pre-save hook
      role: 'admin',
      provider: 'local'
    });

    await adminUser.save();

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
        createdAt: adminUser.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin user',
      error: error.message
    });
  }
});

module.exports = router;

// Made with Bob