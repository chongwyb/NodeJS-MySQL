module.exports = [
    // Invalid case 1-1
    // Empty body
    {
        data: {},
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 1-2
    // Empty teacher email
    {
        data: {
            "teacher": "",
            "students": ["studentC@example.com"]
        },
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 1-3
    // Empty student email
    {
        data: {
            "teacher": "teacherC@example.com",
            "students": []
        },
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 1-4
    // Invalid teacher email
    {
        data: {
            "teacher": "abcdefg",
            "students": ["studentC@example.com"]
        },
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 1-5
    // Invalid student email
    {
        data: {
            "teacher": "teacherC@example.com",
            "students": ["abcdefg"]
        },
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 1-6
    // No database record of teacher
    {
        data: {
            "teacher": "teacherD@example.com",
            "students": ["studentC@example.com"]
        },
        result: {
            statusCode: 500,
            body: { "message": "Teacher is not registered" }
        }
    },
    // Invalid case 1-7
    // No database record of student
    {
        data: {
            "teacher": "teacherC@example.com",
            "students": ["studentD@example.com"]
        },
        result: {
            statusCode: 500,
            body: { "message": "One or more of the students are not registered" }
        }
    },
]