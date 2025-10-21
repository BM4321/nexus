const Listing = require('../models/Listing');

/**
 * @desc Create a new Service Offer or Opportunity Post
 * @route POST /api/listings
 * @access Private (Requires JWT)
 */
exports.createListing = async (req, res) => {
  try {
    // req.user is populated by the 'protect' middleware
    const userRef = req.user.id;
    const { title, description, category, priceRange, type, location } = req.body;

    // Basic validation
    if (!title || !description || !category || !priceRange || !type || !location) {
      return res.status(400).json({ message: 'Please include all required fields for the listing.' });
    }
    
    // Ensure the location is sent in GeoJSON 'Point' format: { type: "Point", coordinates: [longitude, latitude] }
    if (location.type !== 'Point' || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
        return res.status(400).json({ message: 'Location must be in valid GeoJSON Point format: { type: "Point", coordinates: [longitude, latitude] }' });
    }

    const newListing = new Listing({
      userRef,
      title,
      description,
      category,
      priceRange,
      type,
      location,
      status: 'active', // Default status as per TSD
    });

    const listing = await newListing.save();
    res.status(201).json(listing);
  } catch (error) {
    console.error('Create Listing Error:', error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error during listing creation.' });
  }
};

/**
 * @desc Search and filter all listings, supporting GeoLocation proximity search
 * @route GET /api/listings
 * @access Public
 */
exports.getListings = async (req, res) => {
  try {
    const { lat, lng, radius, category, search } = req.query;
    let query = {};

    // 1. Geospatial Query Implementation (TSD Requirement)
    if (lat && lng && radius) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      // Convert radius from kilometers (or miles) to meters for MongoDB
      const radiusMeters = parseFloat(radius) * 1000; // Assuming radius is sent in kilometers (km)

      // MongoDB Geospatial Query using $nearSphere and $geometry
      query.location = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude], // MongoDB expects [longitude, latitude]
          },
          $maxDistance: radiusMeters,
        },
      };
    }
    
    // 2. Category Filter
    if (category) {
      query.category = category; // Simple exact match filter
    }

    // 3. Keyword Search (Title and Description)
    if (search) {
        // Use a case-insensitive regular expression for searching across title or description
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
            { title: searchRegex },
            { description: searchRegex }
        ];
    }
    
    // Add default filters (e.g., only active listings)
    query.status = 'active';

    // Execute the query, sort by newest first, and populate the creator's name/photo
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 }) // Sort by creation date descending
      .populate('userRef', 'name profilePhotoUrl role'); // Populate creator details

    res.status(200).json(listings);
  } catch (error) {
    console.error('Get Listings Error:', error);
    res.status(500).json({ message: 'Server error fetching listings.' });
  }
};

/**
 * @desc Fetch single listing details
 * @route GET /api/listings/:id
 * @access Public
 */
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('userRef', 'name profilePhotoUrl avgRating email phone'); // Populate creator details

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    res.status(200).json(listing);
  } catch (error) {
    // Handle invalid ObjectId format from the parameter
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid listing ID format.' });
    }
    console.error('Get Listing By ID Error:', error);
    res.status(500).json({ message: 'Server error fetching listing details.' });
  }
};