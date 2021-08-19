'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const express = require('express');
const router = express.Router();

const showdown  = require('showdown');
const converter = new showdown.Converter();

const logger = require('../../utils/logger');

fs.readFileAsync = util.promisify(fs.readFile);

router.get('/health', (req, res) => res.send('Healthy'));

router.get('/docs', async (req, res) => {
    try {
        const text = await fs.readFileAsync(path.resolve('docs', 'api.md'), 'utf8');

        const html = converter.makeHtml(text);
        res.send(html);
    } catch (err) {
        logger.error(err);
        res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
        });
    }
});

module.exports = router;
