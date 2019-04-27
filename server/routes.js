const AdminApi = require('./api/admin.api');

const map = {
    'POST/api/register': AdminApi.register,
    'GET/api/commonstudents': AdminApi.commonstudents,
    'POST/api/suspend': AdminApi.suspend,
    'POST/api/retrievefornotifications': AdminApi.retrievefornotifications,
}

module.exports = (req, res, con) => {

    // Parse the api routes here
    const request = req.method + req.url;
    // Pass the req, res, mysql to the selected route
    map[request](req, res, con);

}