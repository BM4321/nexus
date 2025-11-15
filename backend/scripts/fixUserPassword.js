require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const fixUserPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'shedrackmaeda@gmail.com';
    const newPassword = 'sharon2006';

    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('Found user:', user.email);
    console.log('Current password field:', user.password ? 'exists' : 'missing');

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user
    user.password = hashedPassword;
    await user.save();

    console.log('✅ Password updated successfully!');
    console.log('User can now login with:');
    console.log('Email:', email);
    console.log('Password:', newPassword);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixUserPassword();