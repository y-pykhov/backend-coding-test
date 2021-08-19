'use strict';

const express = require('express');
const app = express();

const commonRouter = require('./routers/commonRouter');
app.use(commonRouter);

const ridesRouter = require('./routers/rideRouter');
app.use('/rides', ridesRouter);

module.exports = app;
