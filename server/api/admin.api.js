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
                res.end(JSON.stringify({ "status": 400, "message": "error registering students" }));
            } else {
                // console.log(result);
                res.statusCode = 204;
                // res.setHeader('Content-Type', 'application/json');
                // res.end(JSON.stringify({ "status": 204, "message": "successfully registered students" }));
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
            res.end(JSON.stringify({ "status": 400, "message": "error retrieving common students" }));
        } else {
            // console.log(result);
            var students = [];
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            // res.end(JSON.stringify({ "status": 204, "message": "successfully retrieved common students" }));
            if (result.length == 0) {
                res.end(JSON.stringify({ "students": students }));
            } else {
                for (var i = 0; i < result.length; i++) {
                    students.push(result[i].student_email)
                }
                res.end(JSON.stringify({ "students": students }));
            }
        };
    });

}

var suspend = (req, res, con) => {
    console.log('POST/api/suspend');
    // TODO: Add Logic
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(req.url);
}

var retrievefornotifications = (req, res, con) => {
    console.log('POST/api/retrievefornotifications');
    // TODO: Add Logic
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(req.url);
}

module.exports = {
    register: register,
    commonstudents: commonstudents,
    suspend: suspend,
    retrievefornotifications: retrievefornotifications,
}