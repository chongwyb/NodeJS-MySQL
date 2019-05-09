module.exports = [
    // Invalid case 3-1
    {
        data: {},
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 3-2
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