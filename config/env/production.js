'use strict';

export default {
    app: {
        title: 'MilkCurd production',
        description: 'MilkCurd Description'
    },
    db: {
        mongodb: {
            uri: 'mongodb+srv://milkcurd_user:tIFzbXqsSXqGNQWK@productioncluster-wvoik.mongodb.net/',
            options: {
                user: '',
                pass: ''
            },
            debug: process.env.MONGODB_DEBUG || false
        }
    },
    database: 'milkcurdlocal',
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
    website: 'http://local.milkcurd.com',
    version: 'v1.0',
    api: 'http://localhost:100',
    port: process.env.PORT || 110
};