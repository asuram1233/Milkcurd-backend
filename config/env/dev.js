'use strict';

export default {
  app: {
    title: "MilkCurd local",
    description: "MilkCurd Description",
  },
  db: {
    mongodb: {
      uri:
        "mongodb+srv://milkcurd-user:o7usiUXZC0QsCnYS@cluster0.wac6o.mongodb.net/",
      options: {
        user: "",
        pass: "",
      },
      debug: process.env.MONGODB_DEBUG || false,
    },
  },
  database: "milkcurdmaster",
  jwt: {
    secret: "pP30IOgnryY5OzIzarp1eOB6bgZ21llmH",
    expiresIn: "365d",
  },
  sendgrid: {
    apiKey: "<key>",
    defaultEmailFromName: "no reply bot - MilkCurd",
    defaultEmailFrom: "no-reply@MilkCurd.com",
  },
  winston: {
    console: {
      colorize: true,
      timestamp: true,
      prettyPrint: true,
    },
    file: {
      filename: "logs/error.log",
      timestamp: true,
      maxsize: 2048,
      json: true,
      colorize: true,
      level: "error",
    },
  },
  razorPay: {
    key_id: "rzp_test_Up9AiaR4rswPs6",
    key_secret: "ngjds8Zf6MwG008l5EOoHE4z",
  },
  awsS3: {
    bucketName: "retail-store-dev",
  },
  website: "http://local.milkcurd.com",
  version: "v1.0",
  api: "http://localhost:90",
  port: process.env.PORT || 110,
};
