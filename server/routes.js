// Handle API routes
module.exports = (app, database) => {

    // Import API methods
    const Admin = require('./api/admin.api')(database);

    // Define API routes
    app.post('/api/register', Admin.register);
    app.get('/api/commonstudents', Admin.commonstudents);
    app.post('/api/suspend', Admin.suspend);
    app.post('/api/retrievefornotifications', Admin.retrievefornotifications);
    
}