var nconf = require('nconf');
var changeCase = require('change-case');
var dir = require('require-dir')();
var jwt = require('jsonwebtoken');

module.exports = function(app, express) {
    'use strict';

    var router = express.Router();
    router.get('', function(req, res) {
        res.json({message: 'Welcome to our api!'});
    });
    app.use(router);

    Object.keys(dir).map(function(name) {
        var router = express.Router();
        if (name != 'auth') {
            router.use(function (req, res, next) {
                var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
                if (token) {
                    var strToken = token.split(' ');
                    token = (strToken.length == 2) ? token = strToken[1] : token = strToken[0];
                    jwt.verify(token, nconf.get('jwt').secret, function (err, decoded) {
                        if (err) {
                            return common.response(req, res, define.MESS_ERR_TOKEN_INVALID, HTTPStatus.UNAUTHORIZED);
                        } else {
                            req.decoded = decoded;
                            next();
                        }
                    });
                } else {
                    return common.response(req, res, define.MESS_ERR_TOKEN_REQUIRED, HTTPStatus.UNAUTHORIZED);
                }
            });
        }
        require('./'+name)(router);
        app.use('/'+changeCase.paramCase(name), router);
    });
};