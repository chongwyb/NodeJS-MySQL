module.exports = [
    // Invalid case 1-1
    {
        data: {},
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 1-2
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
    {
        data: {
            "teacher": "teacherD@example.com",
            "students": ["abcdefg"]
        },
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 1-5
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
    // Invalid case 1-6
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