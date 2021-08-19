'use strict';

const request = require('supertest');
const assert = require('assert');

const app = require('../src/app');
const db = require('../src/db');

describe('API tests', () => {
    after(() => {
        db.run('DELETE FROM Rides');
    });

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });

    describe('GET /docs', () => {
        it('should return documentation', (done) => {
            request(app)
                .get('/docs')
                .expect('Content-Type', /html/)
                .expect(200, done);
        });
    });

    describe('/rides', () => {
        const rideData = {
            start_lat: 30,
            start_long: 30,
            end_lat: 35,
            end_long: 35,
            rider_name: 'test Rider',
            driver_name: 'test Driver',
            driver_vehicle: 'test Vehicle',
        };
        let ride;

        describe('POST /rides', () => {
            function isValidationError(res) {
                assert.strictEqual(res.body.error_code, 'VALIDATION_ERROR');
            }

            it('should reject invalid start coordinates', (done) => {
                const invalidRideData = {
                    ...rideData,
                    start_lat: 91,
                };

                request(app)
                    .post('/rides')
                    .send(invalidRideData)
                    .expect(isValidationError)
                    .expect(200, done);
            });

            it('should reject invalid end coordinates', (done) => {
                const invalidRideData = {
                    ...rideData,
                    end_long: 181,
                };

                request(app)
                    .post('/rides')
                    .send(invalidRideData)
                    .expect(isValidationError)
                    .expect(200, done);
            });

            it('should reject empty rider name', (done) => {
                const invalidRideData = {
                    ...rideData,
                    rider_name: '',
                };

                request(app)
                    .post('/rides')
                    .send(invalidRideData)
                    .expect(isValidationError)
                    .expect(200, done);
            });

            it('should reject empty driver name', (done) => {
                const invalidRideData = {
                    ...rideData,
                    driver_name: '',
                };

                request(app)
                    .post('/rides')
                    .send(invalidRideData)
                    .expect(isValidationError)
                    .expect(200, done);
            });

            it('should reject empty vehicle name', (done) => {
                const invalidRideData = {
                    ...rideData,
                    driver_vehicle: '',
                };

                request(app)
                    .post('/rides')
                    .send(invalidRideData)
                    .expect(isValidationError)
                    .expect(200, done);
            });

            it('should create ride', (done) => {
                function isRideCreated(res) {
                    ride = res.body;

                    assert.strictEqual(typeof ride.rideID, 'number');
                    assert.strictEqual(ride.startLat, rideData.start_lat);
                    assert.strictEqual(ride.startLong, rideData.start_long);
                    assert.strictEqual(ride.endLat, rideData.end_lat);
                    assert.strictEqual(ride.endLong, rideData.end_long);
                    assert.strictEqual(ride.riderName, rideData.rider_name);
                    assert.strictEqual(ride.driverName, rideData.driver_name);
                    assert.strictEqual(ride.driverVehicle, rideData.driver_vehicle);
                    assert.strictEqual(typeof ride.created, 'string');
                }

                request(app)
                    .post('/rides')
                    .send(rideData)
                    .expect(isRideCreated)
                    .expect(200, done);
            });
        });

        describe('GET /rides', () => {
            it('should return all rides', (done) => {
                request(app)
                    .get('/rides')
                    .expect({ count: 1, rows: [ride] })
                    .expect(200, done);
            });

            it('should return rides for pagination', (done) => {
                request(app)
                    .get('/rides?page=1&limit=1')
                    .expect({ count: 1, rows: [ride] })
                    .expect(200, done);
            });

            it('should reject empty pagination page', (done) => {
                function isEmptyPage(res) {
                    assert.strictEqual(res.body.error_code, 'RIDES_NOT_FOUND_ERROR');
                }

                request(app)
                    .get('/rides?page=2&limit=1')
                    .expect(isEmptyPage)
                    .expect(200, done);
            });
        });

        describe('GET /rides/:id', () => {
            it('should reject invalid ride id', (done) => {
                function isInvalidRideId(res) {
                    assert.strictEqual(res.body.error_code, 'RIDES_NOT_FOUND_ERROR');
                }

                request(app)
                    .get('/rides/&')
                    .expect(isInvalidRideId)
                    .expect(200, done);
            });

            it('should return ride by id', (done) => {
                request(app)
                    .get(`/rides/${ride.rideID}`)
                    .expect(ride)
                    .expect(200, done);
            });
        });
    });
});
