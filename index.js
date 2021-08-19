'use strict';

const util = require('util');
const port = 8010;

const app = require('./src/app');
const db = require('./src/db');
const logger = require('./src/logger');

app.listenAsync = util.promisify(app.listen);

(async () => {
    try {
        await db.createTables();

        await app.listenAsync(port);

        logger.info(`App started and listening on port ${port}`);
    } catch (err) {
        logger.error(err);
    }
})();
