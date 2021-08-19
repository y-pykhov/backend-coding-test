'use strict';

const db = require('../db');

const rideModel = {
    createRide(rideData, cb) {
        const values = [rideData.startLatitude, rideData.startLongitude, rideData.endLatitude, rideData.endLongitude, rideData.riderName, rideData.driverName, rideData.driverVehicle];

        db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
            if (err) {
                return cb(err);
            }

            db.get('SELECT * FROM Rides WHERE rideID = ?', this.lastID, cb);
        });
    },

    getRides(options, cb) {
        db.get('SELECT COUNT(*) as count FROM Rides', function (err, { count }) {
            if (err) {
                return cb(err);
            }

            if (count === 0) {
                return cb({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides',
                });
            }

            let limitClause = '';
            if (options && options.limit) {
                limitClause = `LIMIT ${options.limit}`;
            }

            let offsetClause = '';
            if (options && options.offset) {
                offsetClause = `OFFSET ${options.offset}`;
            }

            db.all(`SELECT * FROM Rides ${limitClause} ${offsetClause}`, function (err, rows) {
                if (err) {
                    return cb(err);
                }

                if (rows.length === 0) {
                    return cb({
                        error_code: 'RIDES_NOT_FOUND_ERROR',
                        message: 'Could not find any rides for specified page and limit',
                    });
                }

                cb(null, { count, rows });
            });
        });
    },

    getRide(id, cb) {
        db.get('SELECT * FROM Rides WHERE rideID = ?', [id], function (err, ride) {
            if (err) {
                return cb(err);
            }

            if (!ride) {
                return cb({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find ride with specified id',
                });
            }

            cb(null, ride);
        });
    },
};

module.exports = rideModel;
