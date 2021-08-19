'use strict';

const assert = require('assert');

const rideService = require('../src/services/rideService');

const db = require('../src/db');

describe('Services tests', () => {
    before(() => {
        return db.createTables();
    });

    after(() => {
        return db.runAsync('DELETE FROM Rides');
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
            it('should reject invalid start coordinates', async () => {
                const invalidRideData = {
                    ...rideData,
                    startLatitude: 91,
                };

                try {
                    await rideService.createRide(invalidRideData);
                    assert(false, 'Should have thrown');
                } catch (err) {
                    assert.strictEqual(err.error_code, 'VALIDATION_ERROR');
                }
            });

            it('should reject invalid end coordinates', async () => {
                const invalidRideData = {
                    ...rideData,
                    endLongitude: 181,
                };

                try {
                    await rideService.createRide(invalidRideData);
                    assert(false, 'Should have thrown');
                } catch (err) {
                    assert.strictEqual(err.error_code, 'VALIDATION_ERROR');
                }
            });

            it('should reject empty rider name', async () => {
                const invalidRideData = {
                    ...rideData,
                    riderName: '',
                };

                try {
                    await rideService.createRide(invalidRideData);
                    assert(false, 'Should have thrown');
                } catch (err) {
                    assert.strictEqual(err.error_code, 'VALIDATION_ERROR');
                }
            });

            it('should reject empty driver name', async () => {
                const invalidRideData = {
                    ...rideData,
                    driverName: '',
                };

                try {
                    await rideService.createRide(invalidRideData);
                    assert(false, 'Should have thrown');
                } catch (err) {
                    assert.strictEqual(err.error_code, 'VALIDATION_ERROR');
                }
            });

            it('should reject empty vehicle name', async () => {
                const invalidRideData = {
                    ...rideData,
                    driverVehicle: '',
                };

                try {
                    await rideService.createRide(invalidRideData);
                    assert(false, 'Should have thrown');
                } catch (err) {
                    assert.strictEqual(err.error_code, 'VALIDATION_ERROR');
                }
            });

            it('should create ride', async () => {
                ride = await rideService.createRide(rideData);

                assert.strictEqual(typeof ride.rideID, 'number');
                assert.strictEqual(ride.startLat, rideData.startLatitude);
                assert.strictEqual(ride.startLong, rideData.startLongitude);
                assert.strictEqual(ride.endLat, rideData.endLatitude);
                assert.strictEqual(ride.endLong, rideData.endLongitude);
                assert.strictEqual(ride.riderName, rideData.riderName);
                assert.strictEqual(ride.driverName, rideData.driverName);
                assert.strictEqual(ride.driverVehicle, rideData.driverVehicle);
                assert.strictEqual(typeof ride.created, 'string');
            });
        });

        describe('getRides()', () => {
            it('should return all rides', async () => {
                const result = await rideService.getRides();

                assert.deepStrictEqual(result, { count: 1, rows: [ride] });
            });

            it('should return rides for pagination', async () => {
                const result = await rideService.getRides({ page: 1, limit: 1 });

                assert.deepStrictEqual(result, { count: 1, rows: [ride] });
            });

            it('should reject empty pagination page', async () => {
                try {
                    await rideService.getRides({ page: 2, limit: 1 });
                    assert(false, 'Should have thrown');
                } catch (err) {
                    assert.strictEqual(err.error_code, 'RIDES_NOT_FOUND_ERROR');
                }
            });
        });

        describe('getRide()', () => {
            it('should reject invalid ride id', async () => {
                try {
                    await rideService.getRide('&');
                    assert(false, 'Should have thrown');
                } catch (err) {
                    assert.strictEqual(err.error_code, 'RIDES_NOT_FOUND_ERROR');
                }
            });

            it('should return ride by id', async () => {
                const result = await rideService.getRide(ride.rideID);

                assert.deepStrictEqual(result, ride);
            });
        });
    });
});
