const ut01 = require('./unit-test-01/ut01');
const ut02 = require('./unit-test-02/ut02');

module.exports = async () => {
    await ut01();
    await ut02();
}