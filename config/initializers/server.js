var logger = require('winston');
var nconf = require('nconf');
var cors = require('cors');
var betController = require('../../app/controllers/bet');

module.exports = function (app, express, callback) {
    'use strict';

    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.use(cors());

    logger.info('[SERVER] Initializing routes');
    require('../../app/routes/index')(app, express);

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
        next(err);
    });

    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    io.on('connection', function (socket){
        logger.info('[SOCKET] A user connected');

        socket.on('bet', function() {
            io.emit('bet');
        });

        var CronJob = require('cron').CronJob;
        new CronJob('* 15-33 18 * * *', function () {
            io.emit('closed');
        }, null, true, 'Asia/Ho_Chi_Minh');
        new CronJob('00 15-33 18 * * *', function () {
            io.emit('crawl');
        }, null, true, 'Asia/Ho_Chi_Minh');
        new CronJob({
            cronTime: '* * * * * *',
            onTick: function () {
                    betController.calculate();
                // betController.getKqxs(function (data) {
                //     betController.getBets(function (list) {
                //         list.map(function (v, i) {
                //             var params;
                //             if (v.bet_type == define.BET_TYPE_DE2) {
                //                 if (v.bet_number == data[0].slice(-2)) {
                //                     params = {
                //                         id: v.id,
                //                         bet_balance: -(v.bet_amount*70)
                //                     };
                //                 } else {
                //                     params = {
                //                         id: v.id,
                //                         bet_balance: v.bet_amount
                //                     };
                //                 }
                //             }
                //             betModel.update(params, function (status, results) {
                //                 if (status != HTTPStatus.OK) {
                //                     logger.error(results);
                //                 }
                //                 if (i == (list.length - 1)) {
                //                     io.emit('bet');
                //                     io.emit('opened');
                //                     io.emit('result');
                //                 }
                //             })
                //         });
                //     })
                // });
            },
            start: true,
            timeZone: 'Asia/Ho_Chi_Minh'
        });

        socket.on('disconnect', function () {
            logger.info('[SOCKET] Client Disconnected. Id:' + socket.id + ' - Address:' + socket.handshake.address);
        });
    });

    http.listen(nconf.get('NODE_PORT'), function(){
        logger.info('[SERVER] Listening on port '+nconf.get('NODE_PORT'));
    });

    if (callback) {
        return callback();
    }
};