module.exports = async (http, config, assert, utils) => {
    const hostname = config.HOSTNAME;
    const port = config.PORT;
    const path = '/api/commonstudents';
    const method = 'GET';

    let cases = [
        // invalid case 2-1
        {
            query: "",
            result: {
                statusCode: 400,
                body: JSON.stringify({ "message": "Invalid parameters" })
            }
        },
        // invalid case 2-2
        {
            query: "?teacher=",
            result: {
                statusCode: 400,
                body: JSON.stringify({ "message": "Invalid parameters" })
            }
        },
        // invalid case 2-3
        {
            query: "?teacher=abcdefg",
            result: {
                statusCode: 400,
                body: JSON.stringify({ "message": "Invalid parameters" })
            }
        },
        // invalid case 2-4
        {
            query: "?teacher=teacherD%40example.com",
            result: {
                statusCode: 500,
                body: JSON.stringify({ "message": "One or more of the teachers are not registered" })
            }
        },
    ]

    for (var i = 0; i < cases.length; i++) {
        await new Promise((resolve) => {
            const req = http.request(utils.options(hostname, port, path + cases[i].query, method, null), (res) => {
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
                        console.log('invalid case 2-' + (i + 1) + ' passed');
                    } catch (error) {
                        console.log(error.message);
                        console.log('invalid case 2-' + (i + 1) + ' failed');
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
}