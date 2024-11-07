const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/cars', async (req, res) => {
    try {
        const { q, sortOrder } = req.query;
        const filters = req.query.filter;

        let url = 'https://api.blocket.se/motor-search-service/v4/search/car';
        const queryParams = [];

        if (q) queryParams.push(`q=${encodeURIComponent(q)}`);
        if (filters) {
            if (Array.isArray(filters)) {
                filters.forEach(filter => queryParams.push(`filter=${encodeURIComponent(filter)}`));
            } else {
                queryParams.push(`filter=${encodeURIComponent(filters)}`);
            }
        }

        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }
        if (sortOrder) {
            url += (queryParams.length > 0 ? '&' : '?') + `sortOrder=${encodeURIComponent(sortOrder)}`;
        }

        console.log('Constructed URL:', url);

        const response = await axios.get(url);
        const { cars = [], hits, pages, sortOrder: apiSortOrder, shareUrl } = response.data;

        const formattedCars = cars && cars.map(car => ({
            dealId: car.dealId,
            link: car.link,
            listTime: car.listTime,
            sellerType: car.seller.type,
            sellerName: car.seller.name,
            sellerId: car.seller.id,
            heading: car.heading,
            price: car.price.amount,
            billingPeriod: car.price.billingPeriod,
            thumbnail: car.thumbnail,
            location: car.car.location,
            fuel: car.car.fuel,
            gearbox: car.car.gearbox,
            regDate: car.car.regDate,
            mileage: car.car.mileage,
            images: (car.car.images || []).map(img => img.image),
            equipment: (car.car.equipment || []).map(equip => equip.label),
            description: car.description
        })) || [];

        res.json({
            cars: formattedCars,
            hits,
            pages,
            sortOrder: apiSortOrder,
            shareUrl
        });
    } catch (error) {
        console.error('Error fetching cars data:', error.message);
        res.status(500).json({ error: 'Failed to fetch car data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
