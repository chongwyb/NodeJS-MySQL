const config = require('./config');
const Sequelize = require('sequelize');

// Create database connection
const sequelize = new Sequelize(
    config.MYSQL_DATABASE,
    config.MYSQL_USERNAME,
    config.MYSQL_PASSWORD,
    {
        host: config.MYSQL_HOSTNAME,
        port: config.MYSQL_PORT,
        logging: config.MYSQL_LOGGING,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
        }
    }
);

// Import database models
const Teachers = sequelize.import('./models/teachers.model');
const Students = sequelize.import('./models/students.model');
const Relationship = sequelize.import('./models/relationship.model');

// Define model relations
Teachers.hasMany(Relationship, {foreignKey: 'teacher_id'});
Relationship.belongsTo(Teachers, {foreignKey: 'teacher_id'});
Students.hasMany(Relationship, {foreignKey: 'student_id'});
Relationship.belongsTo(Students, {foreignKey: 'student_id'});

// Synchronize all models
/**
 * force = false
 *   CREATE TABLE IF NOT EXISTS <table name>
 * force = true
 *   DROP TABLE IF EXISTS <table name>
 *   CREATE TABLE IF NOT EXISTS <table name>
 */
sequelize
    .sync({ force: config.INIT })
    .then(async () => {
        console.log('Database synced');
        // Initialise seed
        if(config.SEED){
            await require('./seed')();
        }
        // Initialise test
        if(config.TEST){
            await require('./tests/main')();
        }
    });

module.exports = {
    Teachers: Teachers,
    Students: Students,
    Relationship: Relationship,
    sequelize: sequelize,
    Op: Sequelize.Op,
}