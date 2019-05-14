'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('relationship', [{
      id: 1,
      teacher_id: 1,
      student_id: 1
    }, {
      id: 2,
      teacher_id: 1,
      student_id: 3
    }, {
      id: 3,
      teacher_id: 2,
      student_id: 2
    }, {
      id: 4,
      teacher_id: 2,
      student_id: 3
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkDelete('relationship', null, {});
  }
};
