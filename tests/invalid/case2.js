module.exports = [
    // Invalid case 2-1
    {
        query: "",
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 2-2
    {
        query: "?teacher=",
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 2-3
    {
        query: "?teacher=abcdefg",
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 2-4
    {
        query: "?teacher=teacherD%40example.com",
        result: {
            statusCode: 500,
            body: { "message": "One or more of the teachers are not registered" }
        }
    },
]
