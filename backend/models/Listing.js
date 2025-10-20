const mongoose = require('mongoose');

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
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    required: true,
  },
}, { timestamps: true });


ListingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Listing', ListingSchema);