'use strict';
module.exports = (sequelize, DataTypes) => {
  const relationship = sequelize.define('relationship', {
    teacher_id: DataTypes.INTEGER
  }, {});
  relationship.associate = function(models) {
    // associations can be defined here
  };
  return relationship;
};