const url = require('url');
const AdminApi = require('./api/admin.api');

const map = {
    'POST/api/register': AdminApi.register,
    'GET/api/commonstudents': AdminApi.commonstudents,
    'POST/api/suspend': AdminApi.suspend,
    'POST/api/retrievefornotifications': AdminApi.retrievefornotifications,
}

module.exports = (req, res, con) => {

    // Parse the api routes here
    const request = req.method + url.parse(req.url).pathname;
    // Pass the req, res, mysql to the selected route
    const route = map[request];
    if(route){
        route(req, res, con);
    }else{
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({"message": "api method not found"}))
    }

}