module.exports = [
    // Invalid case 2-1
    // Empty query
    {
        query: "",
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 2-2
    // Empty teacher email
    {
        query: "?teacher=",
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 2-3
    // Invalid teacher email
    {
        query: "?teacher=abcdefg",
        result: {
            statusCode: 400,
            body: { "message": "Invalid parameters" }
        }
    },
    // Invalid case 2-4
    // No database record of teacher
    {
        query: "?teacher=teacherD%40example.com",
        result: {
            statusCode: 500,
            body: { "message": "One or more of the teachers are not registered" }
        }
    },
]
