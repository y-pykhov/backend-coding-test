'use strict';

const assert = require('assert');

const rideService = require('../src/services/rideService');
const db = require('../src/db');

describe('Services tests', () => {
    after(() => {
        db.run('DELETE FROM Rides');
    });

    describe('Ride service', () => {
        const rideData = {
            startLatitude: 40,
            startLongitude: 40,
            endLatitude: 45,
            endLongitude: 45,
            riderName: 'test Rider1',
            driverName: 'test Driver1',
            driverVehicle: 'test Vehicle1',
        };
        let ride;

        describe('createRide()', () => {
            function isValidationError(err) {
                assert.strictEqual(err.error_code, 'VALIDATION_ERROR');
            }

            it('should reject invalid start coordinates', (done) => {
                const invalidRideData = {
                    ...rideData,
                    startLatitude: 91,
                };

                rideService.createRide(invalidRideData, function (err) {
                    isValidationError(err);
                    done();
                });
            });

            it('should reject invalid end coordinates', (done) => {
                const invalidRideData = {
                    ...rideData,
                    endLongitude: 181,
                };

                rideService.createRide(invalidRideData, function (err) {
                    isValidationError(err);
                    done();
                });
            });

            it('should reject empty rider name', (done) => {
                const invalidRideData = {
                    ...rideData,
                    riderName: '',
                };

                rideService.createRide(invalidRideData, function (err) {
                    isValidationError(err);
                    done();
                });
            });

            it('should reject empty driver name', (done) => {
                const invalidRideData = {
                    ...rideData,
                    driverName: '',
                };

                rideService.createRide(invalidRideData, function (err) {
                    isValidationError(err);
                    done();
                });
            });

            it('should reject empty vehicle name', (done) => {
                const invalidRideData = {
                    ...rideData,
                    driverVehicle: '',
                };

                rideService.createRide(invalidRideData, function (err) {
                    isValidationError(err);
                    done();
                });
            });

            it('should create ride', (done) => {
                rideService.createRide(rideData, function (err, result) {
                    assert(!err);

                    ride = result;

                    assert.strictEqual(typeof ride.rideID, 'number');
                    assert.strictEqual(ride.startLat, rideData.startLatitude);
                    assert.strictEqual(ride.startLong, rideData.startLongitude);
                    assert.strictEqual(ride.endLat, rideData.endLatitude);
                    assert.strictEqual(ride.endLong, rideData.endLongitude);
                    assert.strictEqual(ride.riderName, rideData.riderName);
                    assert.strictEqual(ride.driverName, rideData.driverName);
                    assert.strictEqual(ride.driverVehicle, rideData.driverVehicle);
                    assert.strictEqual(typeof ride.created, 'string');
                    done();
                });
            });
        });

        describe('getRides()', () => {
            it('should return all rides', (done) => {
                rideService.getRides(null, function (err, result) {
                    assert(!err);
                    assert.deepStrictEqual(result, { count: 1, rows: [ride] });
                    done();
                });
            });

            it('should return rides for pagination', (done) => {
                rideService.getRides({ page: 1, limit: 1 }, function (err, result) {
                    assert(!err);
                    assert.deepStrictEqual(result, { count: 1, rows: [ride] });
                    done();
                });
            });

            it('should reject empty pagination page', (done) => {
                rideService.getRides({ page: 2, limit: 1 }, function (err) {
                    assert.strictEqual(err.error_code, 'RIDES_NOT_FOUND_ERROR');
                    done();
                });
            });
        });

        describe('getRide()', () => {
            it('should reject invalid ride id', (done) => {
                rideService.getRide('&', function (err) {
                    assert.strictEqual(err.error_code, 'RIDES_NOT_FOUND_ERROR');
                    done();
                });
            });

            it('should return ride by id', (done) => {
                rideService.getRide(ride.rideID, function (err, result) {
                    assert(!err);
                    assert.deepStrictEqual(result, ride);
                    done();
                });
            });
        });
    });
});
