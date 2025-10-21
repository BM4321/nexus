const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { protect } = require('../middleware/auth'); // For the creation route

// TSD Endpoint: /api/listings (POST) - Create a new listing. AUTH access
router.post('/', protect, listingController.createListing);

// TSD Endpoint: /api/listings (GET) - Search, filter, and geo-locate listings. PUBLIC access
router.get('/', listingController.getListings);

// TSD Endpoint: /api/listings/:id (GET) - Fetch single listing details. PUBLIC access
router.get('/:id', listingController.getListingById);

module.exports = router;