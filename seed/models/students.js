'use strict';
module.exports = (sequelize, DataTypes) => {
  const students = sequelize.define('students', {
    email: DataTypes.STRING,
    suspended: DataTypes.BOOLEAN
  }, {});
  students.associate = function(models) {
    // associations can be defined here
  };
  return students;
};