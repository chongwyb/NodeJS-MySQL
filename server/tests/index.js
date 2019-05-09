const valid_tests = require('./valid');
const invalid_tests = require('./invalid');

module.exports = async () => {
    await valid_tests();
    await invalid_tests();
}