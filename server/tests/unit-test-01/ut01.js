const http = require('http');
const config = require('../../config');
const assert = require('../assert');

const caseno1 = require('./case1');
const caseno2 = require('./case2');
const caseno3 = require('./case3');
const caseno4 = require('./case4');

/**
 * Unit Test 01 consist of valid input
 */

module.exports = async () => {
    await caseno1(http, config, assert);
    await caseno2(http, config, assert);
    await caseno3(http, config, assert);
    await caseno4(http, config, assert);
}