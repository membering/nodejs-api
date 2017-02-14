var nconf = require('nconf');
var HTTPStatus = require('http-status');
var jwt = require('jsonwebtoken');
var common = require('../libraries/common');
var define = require('../libraries/define');
var message = require('../libraries/message');

module.exports = {
    login: function (req, res) {
        var body = req.body;
        if (typeof body.username == 'undefined'|| typeof body.username == 'undefined') {
            return common.response(req, res, message.ERR_PARAMS_REQUIRED, HTTPStatus.BAD_REQUEST);
        }
        req.models.user.getByUsername(body.username, function (err, data) {
            if (err) {
                return common.response(req, res, message.ERR_USERNAME_INVALID, HTTPStatus.BAD_REQUEST);
            }
            if (data.password != body.password) {
                return common.response(req, res, message.ERR_PASSWORD_INVALID, HTTPStatus.BAD_REQUEST);
            }

            var token = jwt.sign(data, nconf.get('jwt').secret, {expiresIn: nconf.get('jwt').expiresIn});
            return common.response(req, res, data, HTTPStatus.OK, {token: token});
        });
    }
};