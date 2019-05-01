module.exports = async (con) => {
    await new Promise((resolve) => {
        con.query("CREATE DATABASE IF NOT EXISTS school", function (err, result) {
            if (err) throw err;
            console.log("CREATED DATABASE : school");
            resolve();
        });
    })

    await new Promise((resolve) => {
        con.query("DROP TABLE IF EXISTS teachers", function (err, result) {
            if (err) throw err;
            console.log("DROP TABLE : teachers");
            resolve();
        });
    })

    await new Promise((resolve) => {
        con.query("DROP TABLE IF EXISTS students", function (err, result) {
            if (err) throw err;
            console.log("DROP TABLE : students");
            resolve();
        });
    })

    await new Promise((resolve) => {
        con.query("DROP TABLE IF EXISTS relationship", function (err, result) {
            if (err) throw err;
            console.log("DROP TABLE : relationship");
            resolve();
        });
    })

    /**
     * TABLE :
     *  teachers
     * FIELDS :
     *  email | VARCHAR(255)
     */
    await new Promise((resolve) => {
        con.query("CREATE TABLE IF NOT EXISTS teachers (email VARCHAR(255))", function (err, result) {
            if (err) throw err;
            console.log("CREATED TABLE : teachers");
            resolve();
        });
    })

    /**
     * TABLE :
     *  students
     * FIELDS :
     *  email | VARCHAR(255)
     *  suspended | BOOLEAN
     */
    await new Promise((resolve) => {
        con.query("CREATE TABLE IF NOT EXISTS students (email VARCHAR(255), suspended BOOLEAN)", function (err, result) {
            if (err) throw err;
            console.log("CREATED TABLE : students");
            resolve();
        });
    })

    /**
     * TABLE :
     *  relationship
     * FIELDS :
     *  teacher_email | VARCHAR(255)
     *  student_email | VARCHAR(255)
     * CONSTRAINTS :
     *  composite key (teacher_email, student_email)
     */
    await new Promise((resolve) => {
        con.query("CREATE TABLE IF NOT EXISTS relationship (teacher_email VARCHAR(255) NOT NULL, student_email VARCHAR(255) NOT NULL, CONSTRAINT email_pair PRIMARY KEY(teacher_email, student_email))", function (err, result) {
            if (err) throw err;
            console.log("CREATED TABLE : relationship");
            resolve();
        });
    })

}