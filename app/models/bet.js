var moment = require('moment');
var orm = require('orm');
var define = require('../libraries/define');

module.exports = function (db, callback) {
    'use strict';

    var handle = db.define('bets', {
        id:         {type: 'serial', key: true},
        cus_name:   {type: 'text'},
        bet_date:   {type: 'date'},
        bet_type:   {type: 'text'},
        bet_number: {type: 'text'},
        bet_amount: {type: 'number'},
        bet_balance:{type: 'number'},
        status:     {type: 'text'},
        created_by: {type: 'integer'},
        updated_by: {type: 'integer'},
        created_at: {type: 'date', time: true},
        updated_at: {type: 'date', time: true}
    },{
        hooks: {
            beforeCreate: function (next) {
                this.created_at = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                return next();
            },
            beforeSave: function (next) {
                this.updated_at = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                return next();
            }
        }
    });

    handle.getList = function (callback) {
        var from = moment.utc().subtract(1, 'day').hour(11).minute(15).second(0).format('YYYY-MM-DD HH:mm:ss');
        var to = moment.utc().format('YYYY-MM-DD HH:mm:ss');
        return this.find({created_at: orm.between(from, to)}, {order: ['id','Z']}, callback);
    };

    handle.getGroup = function (callback) {
        var columns = [
            'bet_number',
            'bet_date',
            'status',
            'bet_balance',
            'created_at'
        ];
        var from = moment.utc().subtract(1, 'day').hour(11).minute(15).second(0).format('YYYY-MM-DD HH:mm:ss');
        var to = moment.utc().format('YYYY-MM-DD HH:mm:ss');
        var where = {
            created_at: orm.between(from, to),
            status: define.BET_STATUS_APPROVED,
            bet_balance: null
        };
        return this.aggregate(columns, where)
            .sum('bet_amount')
            .groupBy('bet_number')
            .order('sum_bet_amount', 'Z')
            .get(callback);
    };
    
    handle.getRevenue = function (callback) {
        var from = moment.utc().subtract(1, 'day').hour(11).minute(15).second(0).format('YYYY-MM-DD HH:mm:ss');
        var to = moment.utc().format('YYYY-MM-DD HH:mm:ss');
        var where = {
            created_at: orm.between(from, to)
        };
        return this.aggregate(where)
            .sum('bet_balance')
            .get(callback);
    };

    callback(handle);
};