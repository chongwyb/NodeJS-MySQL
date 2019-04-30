const http = require('http');
const config = require('../config');
const assert = require('./utils');

const caseno1 = require('./case1');
const caseno2 = require('./case2');
const caseno3 = require('./case3');
const caseno4 = require('./case4');

/**
 * Initial database seed
 * 
 * Table: teachers
 * email
 * teacherA@example.com
 * teacherB@example.com
 * teacherC@example.com
 * 
 * Table: students
 * email                | suspended
 * studentA@example.com | 0
 * studentB@example.com | 0
 * studentC@example.com | 0
 * 
 * Table: relationship
 * teacher_email        | student_email
 * teacherA@example.com | studentA@example.com
 * teacherA@example.com | studentC@example.com
 * teacherB@example.com | studentB@example.com
 * teacherB@example.com | studentC@example.com
 */

module.exports = async () => {
    await caseno1(http, config, assert);
    await caseno2(http, config, assert);
    await caseno3(http, config, assert);
    await caseno4(http, config, assert);
}