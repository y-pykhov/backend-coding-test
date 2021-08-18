'use strict';

const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const showdown  = require('showdown');
const converter = new showdown.Converter();

const logger = require('../utils/logger');

module.exports = (db) => {
    app.get('/health', (req, res) => res.send('Healthy'));

    app.post('/rides', jsonParser, (req, res) => {
        const startLatitude = Number(req.body.start_lat);
        const startLongitude = Number(req.body.start_long);
        const endLatitude = Number(req.body.end_lat);
        const endLongitude = Number(req.body.end_long);
        const riderName = req.body.rider_name;
        const driverName = req.body.driver_name;
        const driverVehicle = req.body.driver_vehicle;

        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            });
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            });
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string',
            });
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string',
            });
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string',
            });
        }

        const values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];

        db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
            if (err) {
                logger.error(err);
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error',
                });
            }

            db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
                if (err) {
                    logger.error(err);
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error',
                    });
                }

                res.send(rows);
            });
        });
    });

    app.get('/rides', (req, res) => {
        const page = Math.floor(req.query.page);
        const limit = Math.floor(req.query.limit);

        db.all('SELECT COUNT(*) as count FROM Rides', function (err, rows) {
            if (err) {
                logger.error(err);
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error',
                });
            }

            const [{ count }] = rows;

            if (count === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides',
                });
            }

            let limitClause = '';

            if (limit >= 0) {
                limitClause = `LIMIT ${limit}`;

                if (page >= 1) {
                    limitClause += ` OFFSET ${(page - 1) * limit}`;
                }
            }

            db.all(`SELECT * FROM Rides ${limitClause}`, function (err, rows) {
                if (err) {
                    logger.error(err);
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error',
                    });
                }

                if (rows.length === 0) {
                    return res.send({
                        error_code: 'RIDES_NOT_FOUND_ERROR',
                        message: 'Could not find any rides for specified page and limit',
                    });
                }

                res.send({
                    count,
                    rows,
                });
            });
        });
    });

    app.get('/rides/:id', (req, res) => {
        db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, function (err, rows) {
            if (err) {
                logger.error(err);
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error',
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides',
                });
            }

            res.send(rows);
        });
    });

    app.get('/docs', (req, res) => {
        fs.readFile(path.resolve('docs', 'api.md'), 'utf8', function (err, text) {
            if (err) {
                logger.error(err);
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error',
                });
            }

            const html = converter.makeHtml(text);
            res.send(html);
        });
    });

    return app;
};
