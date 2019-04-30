module.exports = async (con) => {

    await new Promise((resolve) => {
        con.query("INSERT INTO teachers (email) VALUES ('teacherA@example.com'),('teacherB@example.com'),('teacherC@example.com')", function (err, result) {
            if (err) throw err;
            console.log(`INSERTED ${result.affectedRows} RECORDS : teacher`);
            resolve();
        });
    });

    await new Promise((resolve) => {
        con.query("INSERT INTO students (email, suspended) VALUES ('studentA@example.com', false),('studentB@example.com', false),('studentC@example.com', false)", function (err, result) {
            if (err) throw err;
            console.log(`INSERTED ${result.affectedRows} RECORDS : students`);
            resolve();
        });
    });

    await new Promise((resolve) => {
        con.query("INSERT INTO relationship (teacher_email, student_email) VALUES ('teacherA@example.com','studentA@example.com'),('teacherB@example.com','studentB@example.com'),('teacherA@example.com','studentC@example.com'),('teacherB@example.com','studentC@example.com')", function (err, result) {
            if (err) throw err;
            console.log(`INSERTED ${result.affectedRows} RECORDS : relationship`);
            resolve();
        });
    });

}