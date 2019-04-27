var url = require('url');

var register = (req, res, con) => {
    console.log('POST/api/register');
    // TODO: Add Logic
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(req.url);
}

var commonstudents = (req, res, con) => {
    console.log('GET/api/commonstudents');
    // TODO: Add Logic
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(req.url);
}

var suspend = (req, res, con) => {
    console.log('POST/api/suspend');
    // TODO: Add Logic
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(req.url);
}

var retrievefornotifications = (req, res, con) => {
    console.log('POST/api/retrievefornotifications');
    // TODO: Add Logic
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(req.url);
}

module.exports = {
    register: register,
    commonstudents: commonstudents,
    suspend: suspend,
    retrievefornotifications: retrievefornotifications,
}