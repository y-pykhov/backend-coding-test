'use strict';

const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:MM:SS' }),
    ),
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}${info.stack ? `\n${info.stack}` : ''}`),
            ),
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'logs/errors.log',
            format: winston.format.printf((info) => `[${info.timestamp}] ${info.message}\n${info.stack}`),
        }),
    ],
});

module.exports = logger;
