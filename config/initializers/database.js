var logger = require('winston');
var nconf = require('nconf');

module.exports = function(app, orm, callback) {
    'use strict';

    app.use(orm.express(nconf.get('mysql'), {
        define: function (db, models, next) {
            logger.info('[MYSQLDB] Initializing models');
            require('../../app/models/index')(db, models);
            next();
        }
    }));

    if (callback) {
        return callback();
    }
};