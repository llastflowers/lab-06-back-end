require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;
app.use(cors());

const geoData = require('./data/geo.json');
// const weatherData = require('.data/darksky.json');

// function toWeather(weather){
//     const weatherResult = weather[0].daily.data;

//     weatherResult.forEach(result => {
//         let end = [];
        
//         end.push({
//             forecast: result.summary,
//             time: Date(result.time)
//         });

//         return end;
//     });
// }

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

// function getWeatherLoc(location){
//     if (location === 'bad location'){
//         throw new Error();
//     }

//     return toWeather(weatherData);
// }

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

// app.get('/weather', (request, response) => {
//     try {
//         const location = request.query.location;
//         const result = getWeatherLoc(location);
//         response.status(200).json(result);  
//     }

//     catch (err){
//         response.status(500).send('Sorry, something went wrong, please try again!');
//     }
// });

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log('server running on PORT', PORT);
});