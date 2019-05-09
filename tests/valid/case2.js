module.exports = [
    // Valid case 2-1
    {
        query: "?teacher=teacherA%40example.com",
        result: {
            statusCode: 200,
            body: {
                "students": [
                    "studentA@example.com",
                    "studentC@example.com",
                ]
            }
        }
    },
    // Valid case 2-2
    {
        query: "?teacher=teacherA%40example.com&teacher=teacherB%40example.com",
        result: {
            statusCode: 200,
            body: {
                "students": [
                    "studentC@example.com",
                ]
            }
        }
    },
    // Valid case 2-3
    {
        query: "?teacher=teacherA%40example.com&teacher=teacherB%40example.com&teacher=teacherC%40example.com",
        result: {
            statusCode: 200,
            body: {
                "students": [
                    "studentC@example.com",
                ]
            }
        }
    }
]