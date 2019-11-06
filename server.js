require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT;
app.use(cors());

const weatherData = require('./data/darksky.json');

function toWeather(weather) {
    let weatherResult = weather.daily.data;

    return weatherResult.map(result => {
        return {
            forecast: result.summary,
            time: new Date(result.time * 1000).toDateString(),
        };
    });
}

function toLocation(geo) {
    const firstResult = geo.results[0];
    const geometry = firstResult.geometry;

    return {
        formatted_query: firstResult.formatted_address,
        latitude: geometry.location.lat,
        longitude: geometry.location.lng
    };
}

// function getLatLng(location) {
//     if (location === 'bad location') {
//         throw new Error();
//     }

//     return toLocation(geoData);
// }

function getWeatherLoc(location) {
    if (location === 'bad location') {
        throw new Error();
    }

    return toWeather(weatherData);
}

app.get('/location', async(request, response) => {
    try {
        const location = request.query.search;
        const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
        const mapsLocation = await superagent.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GEOCODE_API_KEY}`);
        const parsedMapLocation = JSON.parse(mapsLocation.text);
        console.log(parsedMapLocation);
        const result = toLocation(parsedMapLocation);
        response.status(200).json(result);
    } catch (err) {
        response.status(500).send('Sorry, something went wrong, please try again!');
    }
});

app.get('/weather', (request, response) => {
    try {
        const location = request.query.location;
        const result = getWeatherLoc(location);
        response.status(200).json(result);
    } catch (err) {
        response.status(500).send('Sorry, something went wrong, please try again!');
    }
});

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log('server running on PORT', PORT);
});
