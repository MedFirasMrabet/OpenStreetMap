const express = require('express');
const router = express.Router();
const GeoJSONFeature = require('../models/geoJSONFeature');
const { calculateRoadLengthsBySpeed } = require('../utils/turfUtils');
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 1000, checkperiod: 120 });

//returns all the roads  by view on map 
router.get('/all_roads', async (req, res) => {
    if (!req.query.bbox || !req.query.zoom) {
        return res.status(400).send('Missing bbox or zoom parameters');
    }

    const coords = req.query.bbox.split(',').map(Number);
    const bbox = [
        [coords[0], coords[1]], // First point [longitude, latitude]
        [coords[2], coords[3]]  // Second point [longitude, latitude]
    ];
    const zoom = Number(req.query.zoom);

    try {
        // Query the database for features within the bounding box
        const features = await GeoJSONFeature.find({
            'properties.highway': { $exists: true },
            'geometry.type': 'LineString',
            'geometry.coordinates': {
                $geoWithin: {
                    $box: bbox
                }
            }
        });
        res.json({
            type: 'FeatureCollection',
            features: features
        });
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).send('Error querying the database');
    }
});

// returns road total lenghts by maxspeed
router.get('/road_lengths_data', async (req, res) => {

    const cacheKey = 'roadLengthsBySpeed';
    try {
        const cachedData = myCache.get(cacheKey);
        if (cachedData) {
            console.log('Returning cached data');
            return res.json(cachedData);
        }
        const roadSegments = await GeoJSONFeature.find({ 'geometry.type': 'LineString', 'properties.maxspeed': { $exists: true } }).exec();
        const roadLengthsBySpeed = calculateRoadLengthsBySpeed(roadSegments)
        myCache.set(cacheKey, roadLengthsBySpeed, 10000);
        res.json(roadLengthsBySpeed);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send('Error processing data');
    }
});

// return the number of roads by maxspeed
router.get('/road_counts_by_maxspeed', async (req, res) => {
    const cacheKey = 'roadCountsBySpeed';
    try {
        const cachedData = myCache.get(cacheKey);
        if (cachedData) {
            console.log('Returning cached data');
            return res.json(cachedData);
        }

        const roadCountsBySpeed = await GeoJSONFeature.aggregate([
            { $match: { 'geometry.type': 'LineString', 'properties.maxspeed': { $exists: true } } },
            { $group: { _id: "$properties.maxspeed", count: { $sum: 1 } } },
            { $project: { maxspeed: "$_id", count: 1, _id: 0 } }
        ]).exec();
        const formattedData = {};

        roadCountsBySpeed.forEach(item => {
            formattedData[item.maxspeed] = item.count;
        });
        myCache.set(cacheKey, formattedData, 10000);
        res.json(formattedData);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send('Error processing data');
    }
});



//return the traffic points on a LineString coord
async function findTrafficSignalsNearRoad(coordinates) {
    let trafficSignals = [];

    for (const coord of coordinates) {
        const nearbySignals = await GeoJSONFeature.find({
            'geometry.type': 'Point',
            'properties.highway': 'traffic_signals',
            'properties.maxspeed': { $exists: true },
            'geometry.coordinates': {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: coord
                    },
                    $maxDistance: 1
                }
            }
        });

        // Add the results to trafficSignals, avoiding duplicates
        trafficSignals = [...trafficSignals, ...nearbySignals.filter(signal => !trafficSignals.includes(signal))];
    }

    return trafficSignals;
}
router.get('/getTrafficSignsByCoordRoad', async (req, res) => {
    try {
        const coords = JSON.parse(req.query.bbox)
        const traffic_signals = await findTrafficSignalsNearRoad(coords)
        res.json({
            type: 'FeatureCollection',
            features: traffic_signals
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send('Error processing data');
    }
});

//returns all the roads  by maxspeed 
router.get('/roads_by_maxspeed', async (req, res) => {
    if (!req.query.bbox || !req.query.zoom || !req.query.maxspeed) {
        return res.status(400).send('Missing bbox, zoom, or maxspeed parameters');
    }

    const coords = req.query.bbox.split(',').map(Number);
    const bbox = [
        [coords[0], coords[1]], // lower left corner [longitude, latitude]
        [coords[2], coords[3]]  // upper right corner [longitude, latitude]
    ];
    const zoom = Number(req.query.zoom);
    const maxspeed = req.query.maxspeed;

    try {
        // Query the database for features within the bounding box and specific maxspeed
        const features = await GeoJSONFeature.find({
            'properties.highway': { $exists: true },
            'properties.maxspeed': { $exists: true },
            'properties.maxspeed': maxspeed,
            'geometry.type': 'LineString',
            'geometry.coordinates': {
                $geoWithin: {
                    $box: bbox
                }
            }
        });
        res.json({
            type: 'FeatureCollection',
            features: features
        });
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).send('Error querying the database');
    }
});

// return the roads of bicycle
router.get('/bicycle_roads', async (req, res) => {
    if (!req.query.bbox) {
        return res.status(400).send('Missing bbox, zoom, or maxspeed parameters');
    }

    const coords = req.query.bbox.split(',').map(Number);
    const bbox = [
        [coords[0], coords[1]], // lower left corner [longitude, latitude]
        [coords[2], coords[3]]  // upper right corner [longitude, latitude]
    ];

    try {
        // Query the database for features within the bounding box and specific maxspeed
        const features = await GeoJSONFeature.find({
            'properties.bicycle': 'yes',
            'geometry.type': 'LineString',
            'geometry.coordinates': {
                $geoWithin: {
                    $box: bbox
                }
            }
        });
        res.json({
            type: 'FeatureCollection',
            features: features
        });
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).send('Error querying the database');
    }
});

module.exports = router;
