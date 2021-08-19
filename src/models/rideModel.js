'use strict';

const db = require('../db');

const RideModel = {
    createRide: (rideData) => {
        return new Promise((resolve, reject) => {
            const values = [rideData.startLatitude, rideData.startLongitude, rideData.endLatitude, rideData.endLongitude, rideData.riderName, rideData.driverName, rideData.driverVehicle];

            db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
                if (err) {
                    return reject(err);
                }

                resolve(db.getAsync('SELECT * FROM Rides WHERE rideID = ?', this.lastID));
            });
        });
    },

    getRides: async (options) => {
        let paginationQuery = '';
        let values = [];

        if (options && options.limit) {
            paginationQuery += ' LIMIT ?';
            values.push(options.limit);
        }
        if (options && options.offset) {
            paginationQuery += ' OFFSET ?';
            values.push(options.offset);
        }

        const [{ count }, rows] = await Promise.all([
            db.getAsync('SELECT COUNT(*) as count FROM Rides'),
            db.allAsync(`SELECT * FROM Rides ${paginationQuery}`, values),
        ]);

        return { count, rows };
    },

    getRide: (id) => {
        return db.getAsync('SELECT * FROM Rides WHERE rideID = ?', [id]);
    },
};

module.exports = RideModel;
