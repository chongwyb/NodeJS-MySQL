'use strict';

var ENV = process.env.NODE_ENV || 'development';

module.exports = require('./' + ENV + '.js') || {};