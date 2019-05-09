const utils = require('../utils.api');

/**
* USAGE:
* Register a unique composite key of (teacher_id, student_id)
* 
* CONDITION:
* teacher email must exist in the database
* student emails must exist in the database
* student emails must be distinct
*/
module.exports = (db) => {
   return async (req, res) => {
       console.log('POST/api/register');

       // Check for invalid parameters
       const body = req.body;

       const teacher_email = body.teacher;
       const student_emails = [...new Set(body.students)];

       let check = true;
       if (!teacher_email || !student_emails || !student_emails.length) {
           check = false;
       } else {
           check = check && (utils.regex.default_email).test(teacher_email);
           for (let i = 0; i < student_emails.length; i++) {
               check = check && (utils.regex.default_email).test(student_emails[i]);
           }
       }

       if (!check) {
           return utils.resError(res, 400, 'Invalid parameters');
       }

       // Validation SQL queries
       const validate_teacher = db.Teachers.findOne({
           attributes: [
               'id'
           ],
           where: {
               email: teacher_email
           },
           raw: true,
       });

       const validate_students = db.Students.findAll({
           attributes: [
               'id'
           ],
           where: {
               email: student_emails
           },
           raw: true,
       });

       let dataset1 = "", dataset2 = "";
       let p_value = await Promise
           .all([validate_teacher, validate_students])
           .then((response) => {
               if (response[0] == null) {
                   utils.resError(res, 500, 'Teacher is not registered');
                   return false;
               };
               if (response[1].length != student_emails.length) {
                   utils.resError(res, 500, 'One or more of the students are not registered');
                   return false;
               };
               dataset1 = response[0];
               dataset2 = response[1];
               return true;
           })
           .catch((error) => {
               utils.resError(res, 502, "validation logic error");
               return false;
           })

       if (!p_value) { return; };

       // Actual SQL query
       let new_data = [];
       for (let i = 0; i < dataset2.length; i++) {
           new_data.push({
               teacher_id: dataset1.id,
               student_id: dataset2[i].id,
           });
       };

       db.Relationship.bulkCreate(new_data)
           .then(response => {
               return utils.resValid(res, 204, null);
           })
           .catch(error => {
               if (error.original && error.original.errno == 1062) {
                   return utils.resError(res, 500, "A teacher student pair is already registered");
               }
               return utils.resError(res, 502, "error registering students");
           })
   }
}