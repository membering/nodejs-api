var moment = require('moment');
var HTTPStatus = require('http-status');
var merge = require('merge');
var request = require('request');
var cheerio = require('cheerio');
var common = require('../libraries/common');
var define = require('../libraries/define');
var bet = require('../models/bet');

module.exports = {
    create: function (req, res) {
        var body = req.body;
        if (moment().utcOffset('+07:00').isBefore(moment().utcOffset('+07:00').hour(18).minute(15).second(0))) {
            body.bet_date = moment().utcOffset('+07:00').format('YYYY-MM-DD');
        } else {
            body.bet_date = moment().utcOffset('+07:00').add(1, 'day').format('YYYY-MM-DD');
        }
        var bet_list = body.bet_list;
        var data = [];
        for (var i = 0; i < bet_list.length; i++) {
            data.push({
                cus_name: body.cus_name,
                bet_date: body.bet_date,
                bet_type: body.bet_type,
                bet_number: bet_list[i].bet_number,
                bet_amount: bet_list[i].bet_amount,
                status: define.BET_STATUS_APPROVED,
                created_by: req.decoded.id
            });
        }
        req.models.bet.create(data, function (err, results) {
            if (err) {
                return common.response(req, res, results, HTTPStatus.INTERNAL_SERVER_ERROR);
            }
            return common.response(req, res, results);
        });
    },

    updateById: function (req, res) {
        var body = req.body;
        body.updated_by = req.decoded.id;
        req.models.bet.get(req.params.id, function (err, item) {
            if (err) {
                return common.response(req, res, results, HTTPStatus.INTERNAL_SERVER_ERROR);
            }
            item.save(body, function (err) {
                if (err) {
                    return common.response(req, res, err, HTTPStatus.INTERNAL_SERVER_ERROR);
                }
                return common.response(req, res, item);
            });
        });
    },

    updateByNumber: function (req, res) {
        var body = req.body;
        body.updated_by = req.decoded.id;
        req.models.bet.find({bet_number: req.params.num}).each(function (item) {
            item.save(body, function (err) {
                if (err) {
                    return common.response(req, res, err, HTTPStatus.INTERNAL_SERVER_ERROR);
                }
            });
        });
        var data = {
            num: req.params.num
        };
        return common.response(req, res, merge(data, body));
    },

    list: function (req, res) {
        req.models.bet.getList(function (err, results) {
            if (err) {
                return common.response(req, res, results, HTTPStatus.INTERNAL_SERVER_ERROR);
            }
            return common.response(req, res, results);
        });
    },

    group: function (req, res) {
        req.models.bet.getGroup(function (err, results) {
            if (err) {
                return common.response(req, res, results, HTTPStatus.INTERNAL_SERVER_ERROR);
            }
            return common.response(req, res, results);
        });
    },

    revenue: function (req, res) {
        req.models.bet.getRevenue(function (err, results) {
            if (err) {
                return common.response(req, res, results, HTTPStatus.INTERNAL_SERVER_ERROR);
            }
            return common.response(req, res, results);
        });
    },

    result: function (req, res) {
        request('http://www.kqxs.vn/mien-bac', function(err, response, body){
            if (err) {
                return common.response(req, res, err, HTTPStatus.INTERNAL_SERVER_ERROR);
            }
            var $ = cheerio.load(body);
            var data = {};
            $('.tieude').each(function () {
                data.title = $(this).children().children().children().text().trim().split('\n')[0];
                return false;
            });
            $('.thutu').each(function(index) {
                var res = $(this).next().text().trim().split('-');
                var temp = {};
                for (var i = 0; i < res.length; i++) {
                    var attr = (res.length == 1)?'G'+index:'G'+index+'_'+(i+1);
                    temp[attr] = res[i];
                }
                merge(data, temp);
                if (index == 7) return false;
            });
            return common.response(req, res, data);
        });
    },

    calculate: function (req, res) {
        var temp = [];
        request('http://www.kqxs.vn/mien-bac', function(err, response, body) {
            if (err) {
                return common.response(req, res, err, HTTPStatus.INTERNAL_SERVER_ERROR);
            }
            var $ = cheerio.load(body);
            $('.thutu').each(function(index) {
                var res = $(this).next().text().trim().split('-');
                for (var i = 0; i < res.length; i++) {
                    temp.push(res[i]);
                }
                if (index == 7) return false;
            });
            // req.models.bet.getList(function (err, results) {
            //     if (err) throw err;
            //     results.map(function (item) {
            //         if (item.bet_type == define.BET_TYPE_DE2) {
            //             item.bet_balance = v.bet_amount;
            //             if (item.bet_number == temp[0].slice(-2)) {
            //                 item.bet_balance = -(v.bet_amount*70);
            //             }
            //             item.save();
            //         }
            //     })
            // });
        });
        request('http://localhost:8080/bet', function(err, response, body) {
            console.log(body);
        });
    }
};