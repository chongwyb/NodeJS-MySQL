var url = require('url');

/**
 * Description:
 * Set a unique composite key of (teacher_email, student_email)
 * Assumption:
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

        var query = "INSERT INTO relationship(teacher_email, student_email) VALUES ";

        for (var i = 0; i < students.length; i++) {
            query += "('" + teacher + "','" + students[i] + "')";
            if (i != students.length - 1) {
                query += ",";
            }
        };

        con.query(query, function (err, result) {
            if (err) {
                // console.log(err);
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ "message": "error registering students" }));
            } else {
                // console.log(result);
                res.statusCode = 204;
                res.end();
            };
        });
    });
}

/**
 * Description:
 * Given a set of teacher_email values of x, locate duplicates of student_email where count = x
 */
var commonstudents = (req, res, con) => {
    console.log('GET/api/commonstudents');

    var parts = url.parse(req.url, true);
    var teachers = parts.query.teacher;

    var query = "SELECT count(*) as c, student_email FROM relationship WHERE ";

    for (var i = 0; i < teachers.length; i++) {
        if (i > 0) {
            query += " OR teacher_email = '" + teachers[i] + "'";
        } else {
            query += "teacher_email = '" + teachers[i] + "'";
        }
    };

    query += 'GROUP BY student_email HAVING c = ' + teachers.length;

    con.query(query, function (err, result) {
        if (err) {
            // console.log(err);
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ "message": "error retrieving common students" }));
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

        var query = "UPDATE students SET suspended = 1 WHERE email = '" + student + "'";

        con.query(query, function (err, result) {
            if (err) {
                // console.log(err);
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ "message": "error suspending students" }));
            } else {
                // console.log(result);
                res.statusCode = 204;
                res.end();
            };
        });
    });
}

/**
 * Description:
 * Retrieve all student_email given a teacher_email
 * split notification delimiter ' ' get regex (^@ ... @ ... \. ... &)
 * merge both datasets' distinct student_email together
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

        var query = "SELECT student_email FROM relationship WHERE teacher_email = '" + teacher + "'";

        con.query(query, function (err, result) {
            if (err) {
                // console.log(err);
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ "message": "error retrieving students eligible for notifications" }));
            } else {
                var notification = body.notification;
                var parts = notification.split(' ');
                // var simpleEmailRegex = /^@.+@.+\..+/mi;
                var advanceEmailRegex = /^@(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/mi;
                var sievedEmails = [];
                for (var i = 0; i < parts.length; i++) {
                    if ((advanceEmailRegex).test(parts[i])) {
                        sievedEmails.push(parts[i].substring(1));
                    };
                };
                // console.log(sievedEmails);
                // console.log(result);
                var recipients = [];
                if (result.length == 0) {
                    recipients = sievedEmails;
                } else {                    
                    for (var i = 0; i < result.length; i++) {
                        recipients.push(result[i].student_email)
                    }
                    for (var i = 0; i < sievedEmails.length; i++) {
                        if (recipients.indexOf(sievedEmails[i]) == -1) {
                            recipients.push(sievedEmails[i]);
                        }
                    }                    
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ "recipients": recipients }));
            };
        });
    });
}

module.exports = {
    register: register,
    commonstudents: commonstudents,
    suspend: suspend,
    retrievefornotifications: retrievefornotifications,
}