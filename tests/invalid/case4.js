module.exports = [
    // Invalid case 4-1
    // Empty body
    {
        data: {},
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 4-2
    // Empty teacher email
    {
        data: {
            "teacher": "",
            "notification": "Hello students! @studentA@example.com @studentB@example.com @studentC@example.com"
        },
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 4-3
    // Empty notification
    {
        data: {
            "teacher": "teacherA@example.com",
            "notification": ""
        },
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 4-4
    // Invalid teacher email
    {
        data: {
            "teacher": "abcdefg",
            "notification": "Hello students! @studentA@example.com @studentB@example.com @studentC@example.com"
        },
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 4-5
    // No database record of teacher
    {
        data: {
            "teacher": "teacherD@example.com",
            "notification": "Hello students! @studentA@example.com @studentB@example.com @studentC@example.com"
        },
        result: {
            statusCode: 500,
            body: { "message": "Teacher is not registered" }
        }
    },
    // Invalid case 4-6
    // No database record of student
    {
        data: {
            "teacher": "teacherA@example.com",
            "notification": "Hello students! @studentA@example.com @studentB@example.com @studentZ@example.com"
        },
        result: {
            statusCode: 500,
            body: { "message": "One or more students are not registered" }
        }
    },
]
