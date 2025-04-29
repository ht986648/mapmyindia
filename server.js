const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/geocode', async (req, res) => {
    try {
        const { address } = req.query;
        if (!address) {
            return res.status(400).json({ error: 'Address parameter is required' });
        }

        const response = await axios.get(`https://atlas.mapmyindia.com/api/places/geocode`, {
            params: {
                address: address
            },
            headers: {
                'Authorization': 'Bearer 27c088fa-a43f-4d01-822c-54461b983416',
                'Accept': 'application/json'
            }
        });

        // Check if response is valid
        if (!response.data) {
            throw new Error('Invalid response from MapMyIndia API');
        }

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            return res.status(error.response.status).json({
                error: 'Error from MapMyIndia API',
                details: error.response.data
            });
        } else if (error.request) {
            // The request was made but no response was received
            return res.status(500).json({
                error: 'No response received from MapMyIndia API'
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            return res.status(500).json({
                error: 'Failed to fetch geocoding data',
                message: error.message
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 