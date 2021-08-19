'use strict';

const express = require('express');
const app = express();

const CommonRouter = require('./routers/commonRouter');
app.use(CommonRouter);

const RideRouter = require('./routers/rideRouter');
app.use('/rides', RideRouter);

module.exports = app;
