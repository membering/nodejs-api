'use strict';

var logger = require('winston');
var async = require('async');

require('dotenv').load();
var nconf = require('nconf');
nconf.use('memory');
nconf.argv();
nconf.env();
require('./config/environments/' + nconf.get('NODE_ENV'));

var express = require('express');
var orm = require('orm');
var app = express();

logger.info('[APP] Starting initialization');
async.series([
        function initializeDBConnection(callback) {
            setTimeout(function() {
                require('./config/initializers/database')(app, orm, callback);
            }, 100);
        },
        function startServer(callback) {
            setTimeout(function() {
                require('./config/initializers/server')(app, express, callback);
            }, 100);
        }
    ],
    function(err) {
        if (err) {
            logger.error('[APP] Initialization failed', err);
        } else {
            logger.info('[APP] Initialized SUCCESSFULLY');
        }
    }
);