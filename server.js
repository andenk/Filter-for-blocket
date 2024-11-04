const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/cars', async (req, res) => {
    try {
        const { q, sortOrder } = req.query;
        const filters = req.query.filter; // Accept multiple 'filter' query parameters

        // Base URL for Blocket
        let url = 'https://www.blocket.se/bilar/sok';

        // Initialize an array to collect query parameters
        const queryParams = [];

        // Handle 'q' (search term) if it exists
        if (q) queryParams.push(`q=${encodeURIComponent(q)}`);

        // Handle 'filter' (allows multiple filters) if they exist
        if (filters) {
            // If `filters` is an array (when multiple filters are sent), map and encode each filter
            if (Array.isArray(filters)) {
                filters.forEach(filter => queryParams.push(`filter=${encodeURIComponent(filter)}`));
            } else {
                // If only a single filter is sent, encode it directly
                queryParams.push(`filter=${encodeURIComponent(filters)}`);
            }
        }

        // Construct the URL with all query parameters except sortOrder
        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }

        // Append sortOrder at the end if it exists
        if (sortOrder) {
            url += (queryParams.length > 0 ? '&' : '?') + `sortOrder=${encodeURIComponent(sortOrder)}`;
        }

        console.log('Constructed URL:', url);   

        // Fetch and parse the Blocket data
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const nextDataScript = $('#__NEXT_DATA__').html();
        const nextData = JSON.parse(nextDataScript);

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
