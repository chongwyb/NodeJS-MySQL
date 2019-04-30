module.exports = (con) => {
    con.query("CREATE DATABASE IF NOT EXISTS school", function (err, result) {
        if (err) throw err;
        console.log("CREATED DATABASE : school");
    });

    /**
     * TABLE :
     *  teachers
     * FIELDS :
     *  email | VARCHAR(255)
     */
    con.query("CREATE TABLE IF NOT EXISTS teachers (email VARCHAR(255))", function (err, result) {
        if (err) throw err;
        console.log("CREATED TABLE : teachers");
    });

    /**
     * TABLE :
     *  students
     * FIELDS :
     *  email | VARCHAR(255)
     *  suspended | BOOLEAN
     */
    con.query("CREATE TABLE IF NOT EXISTS students (email VARCHAR(255), suspended BOOLEAN)", function (err, result) {
        if (err) throw err;
        console.log("CREATED TABLE : students");
    });

    /**
     * TABLE :
     *  relationship
     * FIELDS :
     *  teacher_email | VARCHAR(255)
     *  student_email | VARCHAR(255)
     * CONSTRAINTS :
     *  composite key (teacher_email, student_email)
     */
    con.query("CREATE TABLE IF NOT EXISTS relationship (teacher_email VARCHAR(255) NOT NULL, student_email VARCHAR(255) NOT NULL, CONSTRAINT email_pair PRIMARY KEY(teacher_email, student_email))", function (err, result) {
        if (err) throw err;
        console.log("CREATED TABLE : relationship");
    });

    con.query("DROP TABLE IF EXISTS teachers", function (err, result) {
        if (err) throw err;
        console.log("DROP TABLE : teachers");
    });

    con.query("DROP TABLE IF EXISTS students", function (err, result) {
        if (err) throw err;
        console.log("DROP TABLE : students");
    });

    con.query("DROP TABLE IF EXISTS relationship", function (err, result) {
        if (err) throw err;
        console.log("DROP TABLE : relationship");
    });
}