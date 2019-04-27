var url = require('url');

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
        }

        con.query(query, function (err, result) {
            if (err) {
                // console.log(err);
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ "status": 400, "message": "error registering students" }));
            } else {
                // console.log(result);
                res.statusCode = 204;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ "status": 204, "message": "successfully registered students" }));
            };
        });

    });
}

var commonstudents = (req, res, con) => {
    console.log('GET/api/commonstudents');
    // TODO: Add Logic
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(req.url);
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