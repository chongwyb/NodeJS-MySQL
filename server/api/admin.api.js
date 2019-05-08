const url = require('url');
const utils = require('./utils.api');

// const simpleEmailRegex = /^@.+@.+\..+/mi;
const defaultEmailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/mi;
const specialEmailRegex = /^@(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/mi;

/**
 * USAGE:
 * Register a unique composite key of (teacher_id, student_id)
 * 
 * CONDITION:
 * teacher and students email must exist in the database
 */
const register = (db) => {
    console.log('POST/api/register');
    return (req, res) => {

        // Check for invalid parameters
        const body = req.body;

        const teacher_email = body.teacher;
        const student_emails = body.students;

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
            return utils.response(res, 400, 'Invalid parameters');
        }

        // Validation SQL queries
        const validate_teacher = db.Teachers.findOne({
            where: {
                email: teacher_email
            }
        });

        const validate_students = db.Students.findAll({
            where: {
                email: student_emails
            }
        });

        // Actual SQL query
        Promise
            .all([validate_teacher, validate_students])
            .then((response) => {
                if (response[0] == null) {
                    return utils.response(res, 500, 'Teacher is not registered');
                }
                if (response[1].length != student_emails.length) {
                    return utils.response(res, 500, 'One or more of the students are not registered');
                }

                let new_data = [];
                for (let i = 0; i < response[1].length; i++) {
                    new_data.push({
                        teacher_id: response[0].dataValues.id,
                        student_id: response[1][i].dataValues.id,
                    })
                }

                db.Relationship.bulkCreate(new_data)
                    .then(response => {
                        return utils.response(res, 204, "");
                    })
                    .catch(error => {
                        return utils.response(res, 502, "database query error");
                    })
            })
            .catch((error) => {
                return utils.response(res, 502, "database query error");
            })

    }
}

/**
 * Description:
 * Given a set of teacher_email values of x, locate duplicates of student_email where count = x
 * Condition:
 * teacher_emails are distinct
 */
const commonstudents = (db) => {
    console.log('GET/api/commonstudents');
    return (req, res) => {

        var parts = url.parse(req.url, true);
        var teachers = parts.query.teacher;
        var distinct = [];
        if (typeof teachers == "string") {
            distinct.push(teachers);
        } else {
            distinct = [...new Set(teachers)];
        }

        // Check for invalid parameters
        var check = true;
        if (!teachers || !teachers.length) {
            check = false;
        } else {
            for (var i = 0; i < distinct.length; i++) {
                check = check && defaultEmailRegex.test(distinct[i]);
            }
        }

        if (!check) {
            utils.resError(res, 400, 'Invalid parameters');
        } else {
            // Define SQL queries
            let validateQuery1 = "SELECT * FROM teachers WHERE email IN(";
            for (var i = 0; i < distinct.length; i++) {
                validateQuery1 += "'" + distinct[i] + "',";
            }
            validateQuery1 = validateQuery1.substring(0, validateQuery1.length - 1) + ")";

            let actualQuery = "SELECT count(*) as c, student_email FROM relationship WHERE ";
            for (var i = 0; i < distinct.length; i++) {
                if (i > 0) {
                    actualQuery += " OR teacher_email = '" + distinct[i] + "'";
                } else {
                    actualQuery += "teacher_email = '" + distinct[i] + "'";
                }
            };
            actualQuery += 'GROUP BY student_email HAVING c = ' + distinct.length;

            // Validate data in database before executing actual query
            con.query(validateQuery1, function (err, result) {
                if (err) {
                    utils.resError(res, 502, "database query error");
                } else {
                    if (result.length == distinct.length) {
                        con.query(actualQuery, function (err, result) {
                            if (err) {
                                // console.log(err);
                                utils.resError(res, 412, "error retrieving common students");
                            } else {
                                // console.log(result);
                                var students = [];
                                if (result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        students.push(result[i].student_email)
                                    }
                                }
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ "students": students }));
                            };
                        });
                    } else {
                        utils.resError(res, 412, "error retrieving common students");
                    }
                }
            });
        }
    }
}

/**
 * Description:
 * Set a specified student's suspended = TRUE
 */
var suspend = (db) => {
    console.log('POST/api/suspend');
    return (req, res) => {

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            body = JSON.parse(body);

            var student = body.student;

            // Check for invalid parameters
            var check = true;
            if (!student) {
                check = false;
            } else {
                check = check && defaultEmailRegex.test(student);
            }

            if (!check) {
                utils.resError(res, 400, 'Invalid parameters');
            } else {
                // Define SQL queries
                let validateQuery1 = "SELECT * FROM students WHERE email = '" + student + "'";

                var actualQuery = "UPDATE students SET suspended = 1 WHERE email = '" + student + "'";

                // Validate data in database before executing actual query
                con.query(validateQuery1, function (err, result) {
                    if (err) {
                        utils.resError(res, 502, "database query error");
                    } else {
                        if (result.length == 1) {
                            con.query(actualQuery, function (err, result) {
                                if (err) {
                                    // console.log(err);
                                    utils.resError(res, 502, "database query error");
                                } else {
                                    // console.log(result);
                                    res.statusCode = 204;
                                    res.end();
                                };
                            });
                        } else {
                            utils.resError(res, 412, "error suspending students");
                        }
                    }
                });
            }
        });
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
    console.log('POST/api/retrievefornotifications');
    return (req, res) => {

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            body = JSON.parse(body);

            var teacher = body.teacher;
            var notification = body.notification;

            // Check for invalid parameters
            var check = true;
            if (!teacher || !notification) {
                check = false;
            } else {
                check = check && defaultEmailRegex.test(teacher);
            }

            if (!check) {
                utils.resError(res, 400, 'Invalid parameters');
            } else {
                // Define SQL queries
                let validateQuery1 = "SELECT * FROM teachers WHERE email = '" + teacher + "'";

                var parts = notification.split(' ');
                var sievedEmails = [];
                for (var i = 0; i < parts.length; i++) {
                    if ((specialEmailRegex).test(parts[i])) {
                        sievedEmails.push(parts[i].substring(1));
                    };
                };

                var actualQuery = "SELECT DISTINCT s.email AS 'student_email' FROM teachers t, relationship r , students s\
            WHERE (r.teacher_email = t.email AND r.student_email = s.email AND s.suspended = 0 AND r.teacher_email = '"+ teacher + "')";
                if (sievedEmails.length > 0) {
                    actualQuery += "OR (r.student_email IN(";
                    for (var i = 0; i < sievedEmails.length; i++) {
                        actualQuery += "'" + sievedEmails[i] + "',";
                    }
                    actualQuery = actualQuery.substring(0, actualQuery.length - 1) + ") AND s.suspended = 0)";
                };

                // Validate data in database before executing actual query
                con.query(validateQuery1, function (err, result) {
                    if (err) {
                        utils.resError(res, 502, "database query error");
                    } else {
                        if (result.length == 1) {
                            con.query(actualQuery, function (err, result) {
                                if (err) {
                                    // console.log(err);
                                    utils.resError(res, 502, "database query error");
                                } else {
                                    // console.log(result);
                                    var recipients = [];
                                    for (var i = 0; i < result.length; i++) {
                                        recipients.push(result[i].student_email);
                                    }
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.end(JSON.stringify({ "recipients": recipients }));
                                };
                            });
                        } else {
                            utils.resError(res, 412, "error retrieving students eligible for notifications");
                        };
                    };
                });
            }
        });
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