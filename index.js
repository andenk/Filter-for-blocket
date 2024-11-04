const axios = require('axios');
const cheerio = require('cheerio');

async function fetchCarsData() {
    try {
        // Send a GET request to the Blocket URL
        const response = await axios.get('https://www.blocket.se/bilar/sok?filter=%7B%22key%22%3A%22gearbox%22%2C%22values%22%3A%5B%22Automat%22%5D%7D&filter=%7B%22key%22%3A%22milage%22%2C%22range%22%3A%7B%22start%22%3A%22%22%2C%22end%22%3A%2211000%22%7D%7D&filter=%7B%22key%22%3A%22price%22%2C%22range%22%3A%7B%22start%22%3A%2220000%22%2C%22end%22%3A%22%22%7D%7D&sortOrder=Billigast&filter=%7B%22key%22%3A%22modelYear%22%2C%22range%22%3A%7B%22start%22%3A%222015%22%2C%22end%22%3A%22%22%7D%7D');
        
        // Load the HTML into cheerio
        const $ = cheerio.load(response.data);

        // Find the __NEXT_DATA__ script tag and get its JSON content
        const nextDataScript = $('#__NEXT_DATA__').html();

        if (nextDataScript) {
            // Parse the JSON data from the script tag content
            const nextData = JSON.parse(nextDataScript);

            // Access the cars array in dehydratedState
            const cars = nextData.props?.pageProps?.dehydratedState?.queries?.[0]?.state?.data?.cars;
            if (cars) {
                console.log('Extracted cars data:', cars);
            } else {
                console.log('Cars data not found in dehydratedState.');
            }
        } else {
            console.log('No __NEXT_DATA__ script tag found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

fetchCarsData();
