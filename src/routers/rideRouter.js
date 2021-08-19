'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const rideService = require('../services/rideService');
const logger = require('../../utils/logger');

router.post('/', jsonParser, (req, res) => {
    const rideData = {
        startLatitude: Number(req.body.start_lat),
        startLongitude: Number(req.body.start_long),
        endLatitude: Number(req.body.end_lat),
        endLongitude: Number(req.body.end_long),
        riderName: req.body.rider_name,
        driverName: req.body.driver_name,
        driverVehicle: req.body.driver_vehicle,
    };

    rideService.createRide(rideData, function (err, ride) {
        if (err) {
            if (err.error_code) {
                return res.send(err);
            }

            logger.error(err);
            return res.send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error',
            });
        }

        res.send(ride);
    });
});

router.get('/', (req, res) => {
    const page = Math.floor(req.query.page);
    const limit = Math.floor(req.query.limit);

    rideService.getRides({ page, limit }, function (err, rides) {
        if (err) {
            if (err.error_code) {
                return res.send(err);
            }

            logger.error(err);
            return res.send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error',
            });
        }

        res.send(rides);
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;

    rideService.getRide(id, function (err, ride) {
        if (err) {
            if (err.error_code) {
                return res.send(err);
            }

            logger.error(err);
            return res.send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error',
            });
        }

        res.send(ride);
    });
});

module.exports = router;
