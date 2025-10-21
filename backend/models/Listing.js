const mongoose = require('mongoose');

// Define the Listing Schema based on TSD requirements
const ListingSchema = new mongoose.Schema({
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['service', 'opportunity'],
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  priceRange: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'paused', 'completed'],
    default: 'active',
  },
  // GeoJSON Object for location
  location: {
    type: { // Definition of the GeoJSON 'type' sub-field
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: { // Definition of the GeoJSON 'coordinates' sub-field
      type: [Number], // [longitude, latitude]
      required: true,
    },
    // *** IMPORTANT: NO 'required: true' HERE ***
  }, 
  // Make sure there is a comma after the 'location' block if it's not the last field
  createdAt: { // The automatically added timestamp, or any other field that follows
    type: Date,
    default: Date.now,
  }, 
}, { timestamps: true });

// IMPORTANT: Create a 2dsphere index on the location field for geospatial queries
ListingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Listing', ListingSchema);