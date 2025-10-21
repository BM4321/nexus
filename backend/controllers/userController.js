const User = require('../models/User');

/**
 * @desc Update the logged-in user's profile information
 * @route PUT /api/users/profile
 * @access Private (Requires JWT)
 */
exports.updateUserProfile = async (req, res) => {
  try {
    // req.user is populated by the 'protect' middleware
    const userId = req.user.id;
    const updateData = req.body;

    // Prevent direct update of sensitive fields via this endpoint
    delete updateData.email;
    delete updateData.passwordHash;
    delete updateData.role;
    delete updateData.isVerified;
    
    // Use findByIdAndUpdate and set the 'new' option to true to return the updated document
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true } // runValidators ensures Mongoose validation runs on updates
    ).select('-passwordHash'); // Exclude the password hash from the response

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ 
        message: 'Profile updated successfully', 
        user: user 
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ message: 'Server error during profile update.' });
  }
};

/**
 * @desc Fetch public user profile
 * @route GET /api/users/:id
 * @access Public
 */
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user but explicitly exclude sensitive data like passwordHash and email for public viewing
    const user = await User.findById(userId).select('-passwordHash -email'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get User Profile Error:', error);
    res.status(500).json({ message: 'Server error fetching user profile.' });
  }
};