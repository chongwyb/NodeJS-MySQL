module.exports = function (sequelize, DataTypes) {
    return sequelize.define("relationship", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'relation',
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'relation',
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
};
