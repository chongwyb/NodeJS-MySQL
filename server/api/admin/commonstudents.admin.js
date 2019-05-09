const utils = require('../utils.api');

/**
 * USAGE:
 * Given a set of teacher emails values of x,
 * locate duplicates of student email where count = x
 * 
 * CONDITION:
 * teacher emails are distinct
 * teacher emails must exist in database
 */
module.exports = (db) => {
    return async (req, res) => {
        console.log('GET/api/commonstudents');

        // Check for invalid parameters
        const teacher_emails = req.query.teacher;
        let distinct_emails = [];
        if (typeof teacher_emails == "string") {
            distinct_emails.push(teacher_emails);
        } else {
            distinct_emails = [...new Set(teacher_emails)];
        }

        let check = true;
        if (!teacher_emails || !teacher_emails.length) {
            check = false;
        } else {
            for (let i = 0; i < distinct_emails.length; i++) {
                check = check && (utils.regex.default_email).test(distinct_emails[i]);
            }
        }

        if (!check) {
            return utils.resError(res, 400, 'Invalid parameters');
        }

        // Validation SQL queries
        const validate_teachers = db.Teachers.findAll({
            attributes: [
                'id'
            ],
            where: {
                email: distinct_emails
            },
            raw: true,
        })

        let dataset1 = "";
        let p_value = await Promise
            .all([validate_teachers])
            .then((response) => {
                if (response[0].length != distinct_emails.length) {
                    utils.resError(res, 500, 'One or more of the teachers are not registered');
                    return false;
                };
                dataset1 = response[0];
                return true;
            })
            .catch((error) => {
                // console.log(error)
                utils.resError(res, 502, "validation logic error");
                return false;
            })

        if (!p_value) { return; };

        // Actual SQL query
        let teacher_indexes = [];
        for (let i = 0; i < dataset1.length; i++) {
            teacher_indexes.push(dataset1[i].id);
        };

        db.Relationship
            .findAll({
                attributes: [
                    'student.email',
                ],
                include: [{
                    model: db.Teachers,
                    required: true,
                    attributes: [],
                }, {
                    model: db.Students,
                    required: true,
                    attributes: [],
                }],
                where: {
                    'teacher_id': teacher_indexes
                },
                group: ['student.email'],
                having: [
                    {},
                    db.sequelize.where(db.sequelize.fn('count', db.sequelize.col('student_id')), {
                        [db.Op.eq]: teacher_indexes.length,
                    })
                ],
                raw: true,
            })
            .then(response => {
                let student_emails = [];
                for (let i = 0; i < response.length; i++) {
                    student_emails.push(response[i].email);
                };
                return utils.resValid(res, 200, { students: student_emails });
            })
            .catch(error => {
                // console.log(error)
                return utils.resError(res, 502, "error retrieving common students");
            })
    }
}