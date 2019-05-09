const utils = require('../utils.api');

/**
 * USAGE:
 * Set a specified student's suspended = TRUE
 * 
 * CONDITION:
 * student email must exist in database
 */
module.exports = (db) => {
    return async (req, res) => {
        console.log('POST/api/suspend');

        // Check for invalid parameters
        const body = req.body;

        const student_email = body.student;

        let check = true;
        if (!student_email) {
            check = false;
        } else {
            check = check && (utils.regex.default_email).test(student_email);
        }

        if (!check) {
            return utils.resError(res, 400, 'Invalid parameters');
        }

        // Validation SQL queries
        const validate_student = db.Students.findOne({
            where: {
                email: student_email
            },
            raw: true,
        });

        let dataset1 = "";
        let p_value = await Promise
            .all([validate_student])
            .then((response) => {
                if (response[0] == null) {
                    utils.resError(res, 500, 'Student is not registered');
                    return false;
                }
                dataset1 = response[0];
                return true;
            })
            .catch((error) => {
                // console.log(error);
                utils.resError(res, 502, "validation logic error");
                return false;
            });

        if (!p_value) { return; };

        // Actual SQL query
        db.Students
            .update({
                suspended: true,
            }, {
                    where: {
                        email: student_email,
                    }
                })
            .then((response) => {
                if (response[0] == 0) {
                    return utils.resError(res, 500, "Student is already suspended");
                }
                return utils.resValid(res, 204, null);
            })
            .catch((error) => {
                // console.log(error);
                return utils.resError(res, 502, "error suspending student");
            })
    }
}