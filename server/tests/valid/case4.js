/**
 * Case 4
 * teacherA@example.com retrieves studentB@example.com, studentC@example.com
 */
module.exports = async (http, config, assert) => {
    const data = JSON.stringify({
        "teacher": "teacherA@example.com",
        "notification": "Hello students! @studentA@example.com @studentB@example.com @studentC@example.com"
    });

    const options = {
        hostname: config.HOSTNAME,
        port: config.PORT,
        path: '/api/retrievefornotifications',
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

            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                // console.log(`BODY: ${chunk}`);
                body += chunk.toString(); // convert Buffer to string
            });
            res.on('end', () => {
                // console.log('No more data in response.');
                try {
                    let expected = {
                        "recipients": [
                            "studentB@example.com",
                            "studentC@example.com"
                        ]
                    }
                    assert.equals(body, JSON.stringify(expected));
                    console.log('valid case 4 passed');
                } catch (error) {
                    console.log(error.message);
                    console.log('valid case 4 failed');
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