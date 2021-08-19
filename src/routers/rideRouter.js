'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const RideService = require('../services/rideService');

const logger = require('../logger');

router.post('/', jsonParser, async (req, res) => {
    const rideData = {
        startLatitude: Number(req.body.start_lat),
        startLongitude: Number(req.body.start_long),
        endLatitude: Number(req.body.end_lat),
        endLongitude: Number(req.body.end_long),
        riderName: req.body.rider_name,
        driverName: req.body.driver_name,
        driverVehicle: req.body.driver_vehicle,
    };

    try {
        const ride = await RideService.createRide(rideData);

        res.send(ride);
    } catch (err) {
        if (err.error_code) {
            return res.send(err);
        }

        logger.error(err);
        res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
        });
    }
});

router.get('/', async (req, res) => {
    const page = Math.floor(req.query.page);
    const limit = Math.floor(req.query.limit);

    try {
        const rides = await RideService.getRides({ page, limit });

        res.send(rides);
    } catch (err) {
        if (err.error_code) {
            return res.send(err);
        }

        logger.error(err);
        res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
        });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const ride = await RideService.getRide(id);

        res.send(ride);
    } catch (err) {
        if (err.error_code) {
            return res.send(err);
        }

        logger.error(err);
        res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
        });
    }
});

module.exports = router;
