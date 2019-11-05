require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;
app.use(cors());

const geoData = require('./data/geo.json');

function toLocation(geo){
    const firstResult = geo.results[0];
    const geometry = firstResult.geometry;

    return {
        formatted_query: firstResult.formatted_address,
        latitude: geometry.location.lat,
        longitude: geometry.location.lng
    };
}

function getLatLng(location) {
    if (location === 'bad location'){
        throw new Error();
    }

    return toLocation(geoData);
}

app.get('/location', (request, response) => {
    try {
        const location = request.query.location;
        const result = getLatLng(location);
        response.status(200).json(result);
    }

    catch (err){
        response.status(500).send('Sorry, something went wrong, please try again!');
    }
});

app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});