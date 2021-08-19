'use strict';

const rideModel = require('../models/rideModel');

const rideService = {
    createRide(rideData, cb) {
        if (rideData.startLatitude < -90 || rideData.startLatitude > 90 || rideData.startLongitude < -180 || rideData.startLongitude > 180) {
            return cb({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            });
        }

        if (rideData.endLatitude < -90 || rideData.endLatitude > 90 || rideData.endLongitude < -180 || rideData.endLongitude > 180) {
            return cb({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            });
        }

        if (typeof rideData.riderName !== 'string' || rideData.riderName.length < 1) {
            return cb({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string',
            });
        }

        if (typeof rideData.driverName !== 'string' || rideData.driverName.length < 1) {
            return cb({
                error_code: 'VALIDATION_ERROR',
                message: 'Driver name must be a non empty string',
            });
        }

        if (typeof rideData.driverVehicle !== 'string' || rideData.driverVehicle.length < 1) {
            return cb({
                error_code: 'VALIDATION_ERROR',
                message: 'Driver vehicle must be a non empty string',
            });
        }

        rideModel.createRide(rideData, cb);
    },

    getRides(options, cb) {
        let paginationOptions = {};

        if (options && options.limit >= 0) {
            paginationOptions.limit = options.limit;

            if (options.page >= 1) {
                paginationOptions.offset = (options.page - 1) * options.limit;
            }
        }

        rideModel.getRides(paginationOptions, cb);
    },

    getRide(id, cb) {
        rideModel.getRide(id, cb);
    },
};

module.exports = rideService;
