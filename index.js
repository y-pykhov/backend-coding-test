'use strict';

const port = 8010;

const app = require('./src/app');
const logger = require('./utils/logger');

app.listen(port, () => logger.info(`App started and listening on port ${port}`));
