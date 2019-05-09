// Import methods
const register = require('./register.admin');
const commonstudents = require('./commonstudents.admin');
const suspend = require('./suspend.admin');
const retrievefornotifications = require('./retrievefornotifications.admin');

module.exports = (db) => {
    return {
        register: register(db),
        commonstudents: commonstudents(db),
        suspend: suspend(db),
        retrievefornotifications: retrievefornotifications(db),
    }
}