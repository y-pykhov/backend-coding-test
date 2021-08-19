'use strict';

const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');
const showdown  = require('showdown');
const converter = new showdown.Converter();

const logger = require('../../utils/logger');

router.get('/health', (req, res) => res.send('Healthy'));

router.get('/docs', (req, res) => {
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

module.exports = router;
