const puppeteer = require('puppeteer');

async function searchWithQueryAndFilter() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Go to Blocket's main page to establish cookies and session
    await page.goto('https://www.blocket.se', { waitUntil: 'networkidle2' });

    // Navigate to the specific search URL with `q` and `filter`
    const searchUrl = 'https://www.blocket.se/bilar/sok?q=volvo&filter=%7B%22key%22%3A%22fuel%22%2C%22values%22%3A%5B%22Bensin%22%5D%7D';
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    // Wait for page content to load
    await page.waitForSelector('.search-result'); // Adjust selector based on site structure

    // Get the page content
    const content = await page.content();
    console.log(content); // Outputs the HTML content of the results page

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

// Run the function
searchWithQueryAndFilter();

