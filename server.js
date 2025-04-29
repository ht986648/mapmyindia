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
        const response = await axios.get(`https://atlas.mapmyindia.com/api/places/geocode`, {
            params: {
                address: address
            },
            headers: {
                'Authorization': 'Bearer 27c088fa-a43f-4d01-822c-54461b983416'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch geocoding data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 