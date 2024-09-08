const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();
const { Client } = require('@googlemaps/google-maps-services-js');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const client = new Client({});
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Fetch nearby stores
const fetchNearbyStores = async (latitude, longitude) => {
    try {
        const response = await client.placesNearby({
            params: {
                location: `${latitude},${longitude}`,
                radius: 5000, // 5 km radius
                type: 'store',
                key: GOOGLE_MAPS_API_KEY
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching stores:', error);
        throw error;
    }
};

// Generate gift idea based on nearby stores
router.post('/gift', async (req, res) => {
    const { budget, recipient, location, ideas } = req.body; // Added location and ideas

    try {
        // Fetch nearby stores if location is provided
        let storeNames = [];
        if (location) {
            const { latitude, longitude } = location;
            const stores = await fetchNearbyStores(latitude, longitude);
            storeNames = stores.map(store => store.name).join(', ');
        }

        const prompt = ideas 
            ? `Generate a fun, last-minute gift for a ${recipient} with a budget of $${budget}. The nearby stores include: ${storeNames}. Here are some ideas: ${ideas}.`
            : `Generate a fun, last-minute gift for a ${recipient} with a budget of $${budget}. The nearby stores include: ${storeNames}.`;

        

        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo', // Updated model
            prompt: prompt,
            max_tokens: 100
        });

        const giftIdea = response.data.choices[0].text.trim();
        res.json({ giftIdea });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
