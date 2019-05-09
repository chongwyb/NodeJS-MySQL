module.exports = [
    // Valid case 4-1
    {
        data: {
            "teacher": "teacherA@example.com",
            "notification": "Hello students! @studentA@example.com @studentB@example.com @studentC@example.com"
        },
        result: {
            statusCode: 200,
            body: {
                "recipients": [
                    "studentB@example.com",
                    "studentC@example.com"
                ]
            }
        },
    },
    // Valid case 4-2
    {
        data: {
            "teacher": "teacherA@example.com",
            "notification": "Hello students!"
        },
        result: {
            statusCode: 200,
            body: {
                "recipients": [
                    "studentC@example.com"
                ]
            }
        },
    },
    // Valid case 4-3
    {
        data: {
            "teacher": "teacherB@example.com",
            "notification": "Hello students!"
        },
        result: {
            statusCode: 200,
            body: {
                "recipients": [
                    "studentB@example.com",
                    "studentC@example.com"
                ]
            }
        }
    }
]