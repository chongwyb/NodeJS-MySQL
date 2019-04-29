const http = require('http');
const config = require('../config');

/**
 * TODO: Craft out a story of the use cases
 * TODO: State initial data from database
 */

/**
 * Case 1
 * TODO: State actions taken and end result
 * TODO: Add assertions
 */
var caseno1 = () => {
    const postData = JSON.stringify({
        "teacher": "teacherC@example.com",
        "students":
            [
                "studentC@example.com"
            ]
    });

    const options = {
        hostname: config.HOSTNAME,
        port: config.PORT,
        path: '/api/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // Write data to request body
    req.write(postData);
    req.end();
}

/**
 * Case 2
 * TODO: State actions taken and end result
 * TODO: Add assertions
 */
var caseno2 = () => {

}

/**
 * Case 3
 * TODO: State actions taken and end result
 * TODO: Add assertions
 */
var caseno3 = () => {

}

/**
 * Case 4
 * TODO: State actions taken and end result
 * TODO: Add assertions
 */
var caseno4 = () => {

}

module.exports = () => {
    caseno1();
    caseno2();
    caseno3();
    caseno4();
}