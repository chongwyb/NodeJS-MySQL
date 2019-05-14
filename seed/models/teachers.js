'use strict';
module.exports = (sequelize, DataTypes) => {
  const teachers = sequelize.define('teachers', {
    email: DataTypes.STRING
  }, {});
  teachers.associate = function(models) {
    // associations can be defined here
  };
  return teachers;
};