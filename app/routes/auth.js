var controller = require('../controllers/auth');

module.exports = function(router) {
    'use strict';

    router.route('/login')
        .post(controller.login);
};