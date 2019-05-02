module.exports = async (http, config, assert, utils) => {
    const hostname = config.HOSTNAME;
    const port = config.PORT;
    const path = '/api/suspend';
    const method = 'POST';

    let cases = [
        {
            data: JSON.stringify({}),
            result: {
                statusCode: 400,
                body: JSON.stringify({ "message": "Invalid parameters" })
            }
        },
        {
            data: JSON.stringify({
                "student": ""
            }),
            result: {
                statusCode: 400,
                body: JSON.stringify({ "message": "Invalid parameters" })
            }
        },
        {
            data: JSON.stringify({
                "student": "abcdefg"
            }),
            result: {
                statusCode: 400,
                body: JSON.stringify({ "message": "Invalid parameters" })
            }
        },
        {
            data: JSON.stringify({
                "student": "studentD@example.com"
            }),
            result: {
                statusCode: 412,
                body: JSON.stringify({ "message": "error suspending students" })
            }
        },
    ]

    for (var i = 0; i < cases.length; i++) {
        await new Promise((resolve) => {
            const req = http.request(utils.options(hostname, port, path, method, cases[i].data), (res) => {
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
                        assert.equals(res.statusCode, cases[i].result.statusCode);
                        assert.equals(body, cases[i].result.body);
                        console.log('invalid case 3-' + (i + 1) + ' passed');
                    } catch (error) {
                        console.log(error.message);
                        console.log('invalid case 3-' + (i + 1) + ' failed');
                    }
                    resolve();
                });
            });

            req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
            });

            // Write data to request body
            req.write(cases[i].data);
            req.end();
        });
    }
}