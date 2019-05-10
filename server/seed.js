const db = require('./database');
const Teachers = db.Teachers;
const Students = db.Students;
const Relationship = db.Relationship;

/**
 * Initial database seed
 * 
 * Table: teachers
 * id | email
 * 1  | teacherA@example.com
 * 2  | teacherB@example.com
 * 3  | teacherC@example.com
 * 
 * Table: students
 * id | email                | suspended
 * 1  | studentA@example.com | 0
 * 2  | studentB@example.com | 0
 * 3  | studentC@example.com | 0
 * 
 * Table: relationship
 * id | teacher_id | student_id
 * 1  | 1          | 1
 * 2  | 1          | 3
 * 3  | 2          | 2
 * 4  | 2          | 3
 */

module.exports = async () => {
    await Teachers.bulkCreate([
        { email: 'teacherA@example.com' },
        { email: 'teacherB@example.com' },
        { email: 'teacherC@example.com' },
    ]).catch(function(error){
        console.log(error);
    })

    await Students.bulkCreate([
        { email: 'studentA@example.com' },
        { email: 'studentB@example.com' },
        { email: 'studentC@example.com' },
    ]).catch(function(error){
        console.log(error);
    })

    await Relationship.bulkCreate([
        { teacher_id: 1, student_id: 1},
        { teacher_id: 1, student_id: 3},
        { teacher_id: 2, student_id: 2},
        { teacher_id: 2, student_id: 3},
    ]).catch(function(error){
        console.log(error);
    })

}