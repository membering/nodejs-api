var HTTPStatus = require('http-status');
var merge = require('merge');

var handle = module.exports = {
    response: function (req, res, data, status, more) {
        if (typeof status === 'undefined') {
            status = HTTPStatus.OK;
        }
        var objRes = {};
        objRes.status = status;
        if (status == HTTPStatus.OK) {
            objRes.data = data;
        } else {
            objRes.message = data;
        }
        if (typeof more === 'undefined') {
            more = {};
        }
        merge(objRes, more);
        return res.status(status).json(objRes);
    }
};