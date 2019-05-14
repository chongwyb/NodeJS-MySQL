'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('students', [{
      id: 1,
      email: 'studentA@example.com'
    }, {
      id: 2,
      email: 'studentB@example.com'
    }, {
      id: 3,
      email: 'studentC@example.com'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkDelete('students', null, {});
  }
};
