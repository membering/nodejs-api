var controller = require('../controllers/bet');

module.exports = function(router) {
    'use strict';

    router.route('')
        .get(controller.list)
        .post(controller.create);

    router.route('/:id')
        .put(controller.updateById);

    router.route('/number/:num')
        .put(controller.updateByNumber);

    router.route('/group')
        .get(controller.group);

    router.route('/revenue')
        .get(controller.revenue);

    router.route('/kqxs')
        .get(controller.result);
    //
    // router.route('/group')
    //     .get(controller.group);
    //
};