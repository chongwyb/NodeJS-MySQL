/**
 * Case 3
 * suspend studentA@example.com
 * 
 * Table: students
 * email                | suspended
 * studentA@example.com | 1
 */
module.exports = async (http, config, assert) => {
    const data = JSON.stringify({
        "student": "studentA@example.com"
    });

    const options = {
        hostname: config.HOSTNAME,
        port: config.PORT,
        path: '/api/suspend',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    await new Promise((resolve) => {
        const req = http.request(options, (res) => {
            // console.log(`STATUS: ${res.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                // console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                // console.log('No more data in response.');
                try {
                    assert.equals(res.statusCode, 204);
                    console.log('valid case 3 passed');
                } catch (error) {
                    console.log(error.message);
                    console.log('valid case 3 failed');
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });

        // Write data to request body
        req.write(data);
        req.end();
    });
}