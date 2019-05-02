var options = (hostname, port, path, method, data) => {
    let options = {};
    options['hostname'] = hostname;
    options['port'] = port;
    options['path'] = path;
    options['method'] = method;
    if(data) {
        options['headers'] = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        };
    }
    return options;
}

module.exports = {
    options: options,
}