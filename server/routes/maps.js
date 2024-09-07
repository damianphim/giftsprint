const express = require('express');
const { Client } = require('@googlemaps/google-maps-services-js');
const router = express.Router();

const client = new Client({});
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

router.post('/nearby-stores', async (req, res) => {
    const { location } = req.body; // Get location data from request body

    try {
        const response = await client.placesNearby({
            params: {
                location: location,
                radius: 5000, // Search within a 5 km radius
                type: 'store',
                key: API_KEY
            }
        });

        const stores = response.data.results.map(store => store.name); // Extract store names
        res.json({ stores }); // Send store names back to the client
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle any errors
    }
});

module.exports = router;