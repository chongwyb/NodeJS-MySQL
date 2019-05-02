const url = require('url');
const utils = require('./utils.api');

// const simpleEmailRegex = /^@.+@.+\..+/mi;
const defaultEmailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/mi;
const specialEmailRegex = /^@(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/mi;

/**
 * Description:
 * Set a unique composite key of (teacher_email, student_email)
 * Condition:
 * Teacher / Student exists in the respective database table
 * @param {*} req - request (http.IncomingMessage)
 * @param {*} res - response (http.ServerResponse)
 * @param {*} con - MySQL DB connection
 */
var register = (req, res, con) => {
    console.log('POST/api/register');

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        body = JSON.parse(body);

        var teacher = body.teacher;
        var students = body.students;

        // Check for invalid parameters
        var check = true;
        if (!teacher || !students || !students.length) {
            check = false;
        } else {
            check = check && defaultEmailRegex.test(teacher);
            for (var i = 0; i < students.length; i++) {
                check = check && defaultEmailRegex.test(students[i]);
            }
        }

        if (!check) {
            utils.resError(res, 400, 'Invalid parameters');
        } else {
            // Define SQL queries
            let validateQuery1 = "SELECT * FROM teachers WHERE email = '" + teacher + "'";

            let validateQuery2 = "SELECT * FROM students WHERE email IN(";
            for (var i = 0; i < students.length; i++) {
                validateQuery2 += "'" + students[i] + "',";
            }
            validateQuery2 = validateQuery2.substring(0, validateQuery2.length - 1) + ")";

            let actualQuery = "INSERT INTO relationship(teacher_email, student_email) VALUES ";
            for (var i = 0; i < students.length; i++) {
                actualQuery += "('" + teacher + "','" + students[i] + "'),";
            };
            actualQuery = actualQuery.substring(0, actualQuery.length - 1);

            // Validate data in database before executing actual query
            con.query(validateQuery1, function (err, result) {
                if (err) {
                    utils.resError(res, 502, "database query error");
                } else {
                    if (result.length == 1) {
                        con.query(validateQuery2, function (err, result) {
                            if (err) {
                                utils.resError(res, 502, "database query error");
                            } else {
                                if (result.length == students.length) {
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
                                    utils.resError(res, 412, "error registering students");
                                }
                            }
                        })
                    } else {
                        utils.resError(res, 412, "error registering students");
                    }
                };
            });
        }

    });
}

/**
 * Description:
 * Given a set of teacher_email values of x, locate duplicates of student_email where count = x
 * Condition:
 * teacher_emails are distinct
 */
var commonstudents = (req, res, con) => {
    console.log('GET/api/commonstudents');

    var parts = url.parse(req.url, true);
    var teachers = parts.query.teacher;
    var distinct = [];
    if(typeof teachers == "string"){
        distinct.push(teachers);
    }else{
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

/**
 * Description:
 * Set a specified student's suspended = TRUE
 */
var suspend = (req, res, con) => {
    console.log('POST/api/suspend');

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

/**
 * Description:
 * Retrieve all student_email given a teacher_email
 * split notification delimiter ' ' get regex (^@ ... @ ... \. ... &)
 * merge both datasets' distinct student_email together
 * Condition:
 * Teacher / Student exists in the respective database table
 */
var retrievefornotifications = (req, res, con) => {
    console.log('POST/api/retrievefornotifications');

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

module.exports = {
    register: register,
    commonstudents: commonstudents,
    suspend: suspend,
    retrievefornotifications: retrievefornotifications,
}