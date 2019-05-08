const db = require('./database');
const Teachers = db.Teachers;
const Students = db.Students;
const Relationship = db.Relationship;

/**
 * Initial database seed
 * 
 * Table: teachers
 * email
 * teacherA@example.com
 * teacherB@example.com
 * teacherC@example.com
 * 
 * Table: students
 * email                | suspended
 * studentA@example.com | 0
 * studentB@example.com | 0
 * studentC@example.com | 0
 * 
 * Table: relationship
 * teacher_email        | student_email
 * teacherA@example.com | studentA@example.com
 * teacherA@example.com | studentC@example.com
 * teacherB@example.com | studentB@example.com
 * teacherB@example.com | studentC@example.com
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