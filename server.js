const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = 3000;

// Serve static files for the frontend
app.use(express.static('public'));

app.get('/api/cars', async (req, res) => {
    try {
        // Fetch and parse the Blocket data
        const response = await axios.get('https://www.blocket.se/bilar/sok?filter=%7B%22key%22%3A%22gearbox%22%2C%22values%22%3A%5B%22Automat%22%5D%7D&filter=%7B%22key%22%3A%22milage%22%2C%22range%22%3A%7B%22start%22%3A%22%22%2C%22end%22%3A%2211000%22%7D%7D&filter=%7B%22key%22%3A%22price%22%2C%22range%22%3A%7B%22start%22%3A%2220000%22%2C%22end%22%3A%22%22%7D%7D&sortOrder=Billigast&filter=%7B%22key%22%3A%22modelYear%22%2C%22range%22%3A%7B%22start%22%3A%222015%22%2C%22end%22%3A%22%22%7D%7D');
        
        // Load HTML and parse the __NEXT_DATA__ JSON
        const $ = cheerio.load(response.data);
        const nextDataScript = $('#__NEXT_DATA__').html();
        const nextData = JSON.parse(nextDataScript);

        // Extract the cars data
        const cars = nextData.props?.pageProps?.dehydratedState?.queries?.[0]?.state?.data?.cars;
        res.json(cars || []);
    } catch (error) {
        console.error('Error fetching cars data:', error.message);
        res.status(500).json({ error: 'Failed to fetch car data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
