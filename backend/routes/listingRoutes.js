const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Listing = require('../models/Listing');

// Get all listings
router.get('/listings', authenticateToken, async (req, res) => {
  try {
    console.log('✅ Get listings route hit!');
    
    const listings = await Listing.find({ status: 'active' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${listings.length} listings`);
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Error fetching listings', error: error.message });
  }
});

// Get user's own listings
router.get('/listings/user/me', authenticateToken, async (req, res) => {
  try {
    console.log('✅ Get user listings route hit!');
    
    const userListings = await Listing.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${userListings.length} user listings`);
    res.json(userListings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ message: 'Error fetching listings', error: error.message });
  }
});

// Get single listing by ID
router.get('/listings/:id', authenticateToken, async (req, res) => {
  try {
    console.log('✅ Get listing by ID route hit!');
    
    const listing = await Listing.findById(req.params.id)
      .populate('userId', 'name email phone bio');
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ message: 'Error fetching listing', error: error.message });
  }
});

// Create new listing
router.post('/listings', authenticateToken, async (req, res) => {
  try {
    console.log('✅ Create listing route hit!');
    console.log('Listing data:', req.body);
    
    const newListing = new Listing({
      userId: req.user.id,
      ...req.body
    });
    
    await newListing.save();
    
    console.log('✅ Listing saved to database!');
    res.json({ 
      message: 'Listing created successfully',
      listing: newListing
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Error creating listing', error: error.message });
  }
});

// Update listing
router.put('/listings/:id', authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check if user owns the listing
    if (listing.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json({ message: 'Listing updated', listing: updatedListing });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ message: 'Error updating listing', error: error.message });
  }
});

// Delete listing
router.delete('/listings/:id', authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    if (listing.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Listing.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Error deleting listing', error: error.message });
  }
});

module.exports = router;