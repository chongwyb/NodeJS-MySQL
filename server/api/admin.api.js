const utils = require('./utils.api');

// const simpleEmailRegex = /^@.+@.+\..+/mi;
const defaultEmailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/mi;
const specialEmailRegex = /^@(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/mi;

/**
 * USAGE:
 * Register a unique composite key of (teacher_id, student_id)
 * 
 * CONDITION:
 * teacher email must exist in the database
 * student emails must exist in the database
 * student emails must be distinct
 */
const register = (db) => {
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
            check = check && defaultEmailRegex.test(teacher_email);
            for (let i = 0; i < student_emails.length; i++) {
                check = check && defaultEmailRegex.test(student_emails[i]);
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

/**
 * USAGE:
 * Given a set of teacher emails values of x,
 * locate duplicates of student email where count = x
 * 
 * CONDITION:
 * teacher emails are distinct
 * teacher emails must exist in database
 */
const commonstudents = (db) => {
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
                check = check && defaultEmailRegex.test(distinct_emails[i]);
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

/**
 * USAGE:
 * Set a specified student's suspended = TRUE
 * 
 * CONDITION:
 * student email must exist in database
 */
var suspend = (db) => {
    return async (req, res) => {
        console.log('POST/api/suspend');

        // Check for invalid parameters
        const body = req.body;

        const student_email = body.student;

        let check = true;
        if (!student_email) {
            check = false;
        } else {
            check = check && defaultEmailRegex.test(student_email);
        }

        if (!check) {
            return utils.resError(res, 400, 'Invalid parameters');
        }

        // Validation SQL queries
        const validate_student = db.Students.findOne({
            where: {
                email: student_email
            },
            raw: true,
        });

        let dataset1 = "";
        let p_value = await Promise
            .all([validate_student])
            .then((response) => {
                if (response[0] == null) {
                    utils.resError(res, 500, 'Student is not registered');
                    return false;
                }
                dataset1 = response[0];
                return true;
            })
            .catch((error) => {
                // console.log(error);
                utils.resError(res, 502, "validation logic error");
                return false;
            });

        if (!p_value) { return; };

        // Actual SQL query
        db.Students
            .update({
                suspended: true,
            }, {
                    where: {
                        email: student_email,
                    }
                })
            .then((response) => {
                if (response[0] == 0) {
                    return utils.resError(res, 500, "Student is already suspended");
                }
                return utils.resValid(res, 204, null);
            })
            .catch((error) => {
                // console.log(error);
                return utils.resError(res, 502, "error suspending student");
            })
    }
}

/**
 * Description:
 * Retrieve all student_email given a teacher_email
 * split notification delimiter ' ' get regex (^@ ... @ ... \. ... &)
 * merge both datasets' distinct student_email together
 * Condition:
 * Teacher / Student exists in the respective database table
 */
var retrievefornotifications = (db) => {
    return async (req, res) => {
        console.log('POST/api/retrievefornotifications');

        // Check for invalid parameters
        const body = req.body;

        const teacher_email = body.teacher;
        const notification = body.notification;

        // TODO sanitise notification

        var check = true;
        if (!teacher_email || !notification) {
            check = false;
        } else {
            check = check && defaultEmailRegex.test(teacher_email);
        }

        if (!check) {
            return utils.resError(res, 400, 'Invalid parameters');
        }

        // Validation SQL queries
        let parts = notification.split(' ');
        let sieved_emails = [];
        for (var i = 0; i < parts.length; i++) {
            if ((specialEmailRegex).test(parts[i])) {
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

module.exports = (db) => {
    return {
        register: register(db),
        commonstudents: commonstudents(db),
        suspend: suspend(db),
        retrievefornotifications: retrievefornotifications(db),
    }
}