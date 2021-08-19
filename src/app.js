'use strict';

const express = require('express');
const app = express();

const helmet = require('helmet');
app.use(helmet());

const CommonRouter = require('./routers/commonRouter');
app.use(CommonRouter);

const RideRouter = require('./routers/rideRouter');
app.use('/rides', RideRouter);

module.exports = app;
