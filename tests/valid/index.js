const request = require('request');
const config = require('../../server/config');

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();

const caseset1 = require('./case1');
const caseset2 = require('./case2');
const caseset3 = require('./case3');
const caseset4 = require('./case4');

describe('POST /api/register - Valid Test Cases', function () {
    for (let i = 0; i < caseset1.length; i++) {
        it('Test Case 1-' + (i + 1), function (done) {
            request({
                method: 'POST',
                uri: config.domain_name + '/api/register',
                body: caseset1[i].data,
                json: true,
            }, function (err, res, body) {
                assert.equal(res.statusCode, caseset1[i].result.statusCode);
                expect(res.body).to.deep.equal(caseset1[i].result.body);
                done();
            })
        })
    }
})

describe('GET /api/commonstudents - Valid Test Cases', function () {
    for (let i = 0; i < caseset2.length; i++) {
        it('Test Case 2-' + (i + 1), function (done) {
            request({
                method: 'GET',
                uri: config.domain_name + '/api/commonstudents' + caseset2[i].query,
                json: true,
            }, function (err, res, body) {
                assert.equal(res.statusCode, caseset2[i].result.statusCode);
                expect(res.body).to.deep.equal(caseset2[i].result.body);
                done();
            })
        })
    }
})

describe('POST /api/suspend - Valid Test Cases', function () {
    for (let i = 0; i < caseset3.length; i++) {
        it('Test Case 1-' + (i + 1), function (done) {
            request({
                method: 'POST',
                uri: config.domain_name + '/api/suspend',
                body: caseset3[i].data,
                json: true,
            }, function (err, res, body) {
                assert.equal(res.statusCode, caseset3[i].result.statusCode);
                expect(res.body).to.deep.equal(caseset3[i].result.body);
                done();
            })
        })
    }
})

describe('POST /api/retrievefornotifications - Valid Test Cases', function () {
    for (let i = 0; i < caseset4.length; i++) {
        it('Test Case 1-' + (i + 1), function (done) {
            request({
                method: 'POST',
                uri: config.domain_name + '/api/retrievefornotifications',
                body: caseset4[i].data,
                json: true,
            }, function (err, res, body) {
                assert.equal(res.statusCode, caseset4[i].result.statusCode);
                expect(res.body).to.deep.equal(caseset4[i].result.body);
                done();
            })
        })
    }
})