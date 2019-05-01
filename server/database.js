module.exports = async (con) => {
    await new Promise((resolve) => {
        con.query("CREATE DATABASE IF NOT EXISTS school", function (err, result) {
            if (err) throw err;
            console.log("CREATED DATABASE : school");
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
        con.query("CREATE TABLE IF NOT EXISTS teachers (\
            email VARCHAR(255) NOT NULL,\
            PRIMARY KEY (email)\
            )", function (err, result) {
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
        con.query("CREATE TABLE IF NOT EXISTS students (\
            email VARCHAR(255) NOT NULL,\
            suspended BOOLEAN NOT NULL,\
            PRIMARY KEY (email)\
            )", function (err, result) {
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
        con.query("CREATE TABLE IF NOT EXISTS relationship (\
            teacher_email VARCHAR(255) NOT NULL,\
            student_email VARCHAR(255) NOT NULL,\
            FOREIGN KEY (teacher_email) REFERENCES teachers(email),\
            FOREIGN KEY (student_email) REFERENCES students(email),\
            CONSTRAINT email_pair PRIMARY KEY(teacher_email, student_email)\
            )", function (err, result) {
                if (err) throw err;
                console.log("CREATED TABLE : relationship");
                resolve();
            });
    })

    await new Promise((resolve) => {
        con.query("SET FOREIGN_KEY_CHECKS = 0", function (err, result) {
            if (err) throw err;
            console.log("FOREIGN_KEY_CHECKS = 0");
            resolve();
        });
    })

    await new Promise((resolve) => {
        con.query("TRUNCATE TABLE teachers", function (err, result) {
            if (err) throw err;
            console.log("TRUNCATE TABLE : teachers");
            resolve();
        });
    })

    await new Promise((resolve) => {
        con.query("TRUNCATE TABLE students", function (err, result) {
            if (err) throw err;
            console.log("TRUNCATE TABLE : students");
            resolve();
        });
    })

    await new Promise((resolve) => {
        con.query("TRUNCATE TABLE relationship", function (err, result) {
            if (err) throw err;
            console.log("TRUNCATE TABLE : relationship");
            resolve();
        });
    })

    await new Promise((resolve) => {
        con.query("SET FOREIGN_KEY_CHECKS = 1", function (err, result) {
            if (err) throw err;
            console.log("FOREIGN_KEY_CHECKS = 1");
            resolve();
        });
    })

}