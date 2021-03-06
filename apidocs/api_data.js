define({ "api": [
  {
    "type": "post",
    "url": "/states/add",
    "title": "Add States",
    "name": "Add",
    "group": "States",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": " {\n\t\"name\": \"Mumbai\",\n  \"isForeign\": true\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 201 OK\n {\n    \"success\": true,\n    \"message\": \"State added successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response - 1:",
          "content": "HTTP/1.1 400 Already Exists\n{\n  \"success\": false,\n  \"message\": \"State already exists in the database.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response - 2:",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"success\": false,\n  \"message\": \"Internal Server error. Please try after sometime.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/v1.0/states/routes/states.route.js",
    "groupTitle": "States"
  },
  {
    "type": "get",
    "url": "/states/list",
    "title": "Get States",
    "name": "Get",
    "group": "States",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 201 OK\n {\n    \"success\": true,\n    \"message\": \"States loaded successfully\",\n    \"data\": {\n       \"foreign\": [{\n            \"_id\": \"5c081f890c1ad1102e3b2aac\",\n            \"name\": \"State 1\",\n            \"isForeign\": true\n        }],\n       \"local\": [{\n            \"_id\": \"5c081f890c1ad1102e3b2aac\",\n            \"name\": \"State 1\",\n            \"isForeign\": false\n        }]\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response - 1:",
          "content": "HTTP/1.1 400 Error Response\n{\n  \"success\": false,\n  \"message\": \"Error in loading states\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response - 2:",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"success\": false,\n  \"message\": \"Internal Server error. Please try after sometime.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/v1.0/states/routes/states.route.js",
    "groupTitle": "States"
  }
] });
