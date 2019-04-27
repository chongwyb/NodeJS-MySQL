module.exports = (con) => {
    con.query("CREATE DATABASE IF NOT EXISTS school", function (err, result) {
        if (err) throw err;
        console.log("CREATED DATABASE : school");
    });

    con.query("USE school", function (err, result) {
        if (err) throw err;
        console.log("USE DATABASE : school");
    });

    con.query("DROP TABLE IF EXISTS teachers", function (err, result) {
        if (err) throw err;
        console.log("DELETED TABLE : teachers");
    });

    con.query("DROP TABLE IF EXISTS students", function (err, result) {
        if (err) throw err;
        console.log("DELETED TABLE : students");
    });

    con.query("DROP TABLE IF EXISTS relationship", function (err, result) {
        if (err) throw err;
        console.log("DELETED TABLE : relationship");
    });

    con.query("CREATE TABLE IF NOT EXISTS teachers (email VARCHAR(255))", function (err, result) {
        if (err) throw err;
        console.log("CREATED TABLE : teachers");
    });

    con.query("CREATE TABLE IF NOT EXISTS students (email VARCHAR(255), suspended BOOLEAN)", function (err, result) {
        if (err) throw err;
        console.log("CREATED TABLE : students");
    });

    con.query("CREATE TABLE IF NOT EXISTS relationship (teacher_email VARCHAR(255) NOT NULL, student_email VARCHAR(255) NOT NULL, CONSTRAINT email_pair PRIMARY KEY(teacher_email, student_email))", function (err, result) {
        if (err) throw err;
        console.log("CREATED TABLE : relationship");
    });

    con.query("INSERT INTO teachers (email) VALUES ('teacherA@example.com'),('teacherB@example.com'),('teacherC@example.com')", function (err, result) {
        if (err) throw err;
        console.log(`INSERTED ${result.affectedRows} RECORDS : teacher`);
    });

    con.query("INSERT INTO students (email, suspended) VALUES ('studentA@example.com', false),('studentB@example.com', false),('studentC@example.com', false)", function (err, result) {
        if (err) throw err;
        console.log(`INSERTED ${result.affectedRows} RECORDS : students`);
    });

    con.query("INSERT INTO relationship (teacher_email, student_email) VALUES ('teacherA@example.com','studentA@example.com'),('teacherB@example.com','studentB@example.com'),('teacherA@example.com','studentC@example.com'),('teacherB@example.com','studentC@example.com')", function (err, result) {
        if (err) throw err;
        console.log(`INSERTED ${result.affectedRows} RECORDS : relationship`);
    });

}