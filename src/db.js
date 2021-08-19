'use strict';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize();

const createRideTableSchema = `
    CREATE TABLE Rides
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

db.run(createRideTableSchema);

module.exports = db;
