module.exports = [
    // Invalid case 3-1
    // Empty body
    {
        data: {},
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 3-2
    // Empty student email
    {
        data: {
            "student": ""
        },
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 3-3
    // Invalid student email
    {
        data: {
            "student": "abcdefg"
        },
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 3-4
    // No database record of student
    {
        data: {
            "student": "studentD@example.com"
        },
        result: {
            statusCode: 500,
            body: { "message": "Student is not registered" }
        }
    },
]