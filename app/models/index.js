var dir = require('require-dir')();

module.exports = function(db, models) {
    'use strict';

    Object.keys(dir).map(function (name) {
        require('./'+name)(db, function (model) {
            models[name] = model;
        });
    });
};