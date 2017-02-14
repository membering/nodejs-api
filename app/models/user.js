module.exports = function (db, callback) {
    'use strict';

    var handle = db.define('users', {
        id:         {type: 'serial', key: true},
        username:   {type: 'text'},
        password:   {type: 'text'},
        role:       {type: 'integer'},
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

    handle.getByUsername = function (username, callback) {
        this.one({username: username}, callback);
    };

    callback(handle);
};