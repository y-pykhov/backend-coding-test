'use strict';

const RideModel = require('../models/rideModel');

const RideService = {
    createRide: (rideData) => {
        if (rideData.startLatitude < -90 || rideData.startLatitude > 90 || rideData.startLongitude < -180 || rideData.startLongitude > 180) {
            throw {
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            };
        }

        if (rideData.endLatitude < -90 || rideData.endLatitude > 90 || rideData.endLongitude < -180 || rideData.endLongitude > 180) {
            throw {
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            };
        }

        if (typeof rideData.riderName !== 'string' || rideData.riderName.length < 1) {
            throw {
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string',
            };
        }

        if (typeof rideData.driverName !== 'string' || rideData.driverName.length < 1) {
            throw {
                error_code: 'VALIDATION_ERROR',
                message: 'Driver name must be a non empty string',
            };
        }

        if (typeof rideData.driverVehicle !== 'string' || rideData.driverVehicle.length < 1) {
            throw {
                error_code: 'VALIDATION_ERROR',
                message: 'Driver vehicle must be a non empty string',
            };
        }

        return RideModel.createRide(rideData);
    },

    getRides: async (options) => {
        let paginationOptions = {};

        if (options && options.limit >= 0) {
            paginationOptions.limit = options.limit;

            if (options.page >= 1) {
                paginationOptions.offset = (options.page - 1) * options.limit;
            }
        }

        const pagination = await RideModel.getRides(paginationOptions);

        if (pagination.count === 0) {
            throw {
                error_code: 'RIDES_NOT_FOUND_ERROR',
                message: 'Could not find any rides',
            };
        }

        if (pagination.rows.length === 0) {
            throw {
                error_code: 'RIDES_NOT_FOUND_ERROR',
                message: 'Could not find any rides for specified page and limit',
            };
        }

        return pagination;
    },

    getRide: async (id) => {
        const ride = await RideModel.getRide(id);

        if (!ride) {
            throw {
                error_code: 'RIDES_NOT_FOUND_ERROR',
                message: 'Could not find ride with specified id',
            };
        }

        return ride;
    },
};

module.exports = RideService;
