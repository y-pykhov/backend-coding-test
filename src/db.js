'use strict';

const util = require('util');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.runAsync = util.promisify(db.run);
db.getAsync = util.promisify(db.get);
db.allAsync = util.promisify(db.all);

db.serialize();

db.createTables = async function () {
    const createRideTableSchema = `
        CREATE TABLE IF NOT EXISTS Rides
        (
        rideID INTEGER PRIMARY KEY AUTOINCREMENT,
        startLat DECIMAL NOT NULL,
        startLong DECIMAL NOT NULL,
        endLat DECIMAL NOT NULL,
        endLong DECIMAL NOT NULL,
        riderName TEXT NOT NULL,
        driverName TEXT NOT NULL,
        driverVehicle TEXT NOT NULL,
        created DATETIME default CURRENT_TIMESTAMP
        )
    `;

    await db.run(createRideTableSchema);
};

module.exports = db;
