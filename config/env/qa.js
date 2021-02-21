'use strict';

export default {
    app: {
        title: 'MilkCurd qa',
        description: 'MilkCurd Description'
    },
    db: {
        mongodb: {
            uri: 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/',
            options: {
                user: '',
                pass: ''
            },
            debug: process.env.MONGODB_DEBUG || false
        }
    },
    database: 'milkcurdqa',
    jwt: {
      secret: 'pP30IOgnryY5OzIzarp1eOB6bgZ21llmH',
      expiresIn: '365d'
    },
    sendgrid: {
        apiKey: '<key>',
        defaultEmailFromName: 'no reply bot - MilkCurd',
        defaultEmailFrom: 'no-reply@MilkCurd.com'
    },
    winston: {
        console: {
            colorize: true,
            timestamp: true,
            prettyPrint: true
        },
        file: {
            filename: 'logs/error.log',
            timestamp: true,
            maxsize: 2048,
            json: true,
            colorize: true,
            level: 'error'
        }
    },
    awsS3: {
      bucketName: 'retail-store-dev',
    },
    website: 'http://qa.milkcurd.com',
    version: 'v1.0',
    api: 'http://localhost:100',
    port: process.env.PORT || 110
};