const utils = require('../utils.api');

/**
 * USAGE:
 * Given teacher email and notification message
 * Retrieve student emails that are non-suspended, registered under teacher, stated in notification
 * Extract student emails from notification by delimiter ' ' and regex (^@ ... @ ... \. ... &)
 * 
 * CONDITION:
 * Teacher email exists in the database
 * Student emails exists in the database
 */
module.exports = (db) => {
    return async (req, res) => {
        console.log('POST/api/retrievefornotifications');

        // Check for invalid parameters
        const body = req.body;

        const teacher_email = body.teacher;
        const notification = body.notification;

        var check = true;
        if (!teacher_email || !notification) {
            check = false;
        } else {
            check = check && (utils.regex.default_email).test(teacher_email);
        }

        if (!check) {
            return utils.resError(res, 400, 'Invalid parameters');
        }

        // Validation SQL queries
        let parts = notification.split(' ');
        let sieved_emails = [];
        for (var i = 0; i < parts.length; i++) {
            if ((utils.regex.special_email).test(parts[i])) {
                sieved_emails.push(parts[i].substring(1));
            };
        };
        sieved_emails = [...new Set(sieved_emails)];

        const validate_teacher = db.Teachers.findOne({
            attributes: [
                'id'
            ],
            where: {
                email: teacher_email,
            },
            raw: true,
        });

        const validate_students = db.Students.findAll({
            attributes: [
                'id'
            ],
            where: {
                email: sieved_emails
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
                }
                if (response[1].length != sieved_emails.length) {
                    utils.resError(res, 500, 'One or more students are not registered');
                    return false;
                }
                dataset1 = response[0];
                dataset2 = response[1];
                return true;
            })
            .catch((error) => {
                // console.log(error);
                utils.resError(res, 502, "validation logic error");
                return false;
            })

        if (!p_value) { return; };

        // Actual SQL query
        let teacher_index = dataset1.id;
        let student_indexes = [];
        for (let i = 0; i < dataset2.length; i++) {
            student_indexes.push(dataset2[i].id);
        };

        db.Relationship
            .findAll({
                attributes: [
                    [db.sequelize.fn('DISTINCT', db.sequelize.col('student.email')), 'student_email']
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
                    [db.Op.and]: [
                        { '$student.suspended$': false },
                        {
                            [db.Op.or]: [
                                { 'teacher_id': teacher_index },
                                { 'student_id': student_indexes }
                            ]
                        }
                    ]
                },
                order: [
                    [db.sequelize.col('student.email'),'ASC']
                ],
                raw: true,
            })
            .then((response) => {
                let recipients = [];
                for (let i = 0; i < response.length; i++) {
                    recipients.push(response[i].student_email);
                }
                return utils.resValid(res, 200, { recipients: recipients });
            })
            .catch((error) => {
                console.log(error);
                return utils.resError(res, 502, "error retrieving students eligible for notifications");
            })
    }
}