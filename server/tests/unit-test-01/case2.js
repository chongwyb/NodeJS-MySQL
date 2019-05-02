/**
 * Case 2
 * get common students from teacher A, B, C
 */
module.exports = async (http, config, assert) => {
    const options = {
        hostname: config.HOSTNAME,
        port: config.PORT,
        path: '/api/commonstudents?teacher=teacherA%40example.com&teacher=teacherB%40example.com&teacher=teacherC%40example.com',
        method: 'GET',
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
                        "students": [
                            "studentC@example.com",
                        ]
                    }
                    assert.equals(body, JSON.stringify(expected));
                    console.log('valid case 2 passed');
                } catch (error) {
                    console.log(error.message);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });

        req.end();
    });
}