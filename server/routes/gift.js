const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/gift', async (req, res) => {
    const { budget, recipient } = req.body; // Get data from request body

    const prompt = `Generate a fun, last-minute gift for a ${recipient} with a budget of $${budget}`;

    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 50
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        const giftIdea = response.data.choices[0].text.trim(); // Extract the generated gift idea
        res.json({ giftIdea }); // Send the gift idea back to the client
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle any errors
    }
});

module.exports = router;