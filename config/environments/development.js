var nconf = require('nconf');

nconf.set('mysql', {
    protocol: 'mysql',
    host: 'localhost',
    port: '3306',
    database: 'lotto',
    user: 'root',
    password: '',
    timezone: 'utc'
});

nconf.set('mongodb', {
    host: '178.238.239.120',
    port: '27017',
    database: 'fastcard',
    user: 'fcdev',
    password: 'fc123456'
});

nconf.set('jwt', {
    secret: '178.238.239.120',
    expiresIn: '24h'
});