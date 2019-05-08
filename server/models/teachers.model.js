module.exports = function (sequelize, DataTypes) {
    return sequelize.define("teachers", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        timestamps: false,
        freezeTableName: true
    });
};
