'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import winston from 'winston';
import logger from 'logops';
import expressLogging from 'express-logging';
import _ from "lodash";

import config from '../config';
import routesV1_0 from '../routes/routes.v1.0';

function initMiddleware(app) {
  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');

  // Should be placed before express.static
  app.use(compress({
    filter: function(req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
      extended: true
  }));
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({
      limit: '100mb',
      parameterLimit: 100000000,
      extended: true //extended: true
  }));
  app.use(methodOverride());

  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use('/apidocs', express.static('apidocs'));
  app.use(cors());
}

function initSession(app, db) {
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure && config.secure.ssl
    },
    key: config.sessionKey,
    store: new MongoStore({
      mongooseConnection: db.connection,
      collection: config.sessionCollection
    })
  }));
}

function initModulesPolicies(app) {
  // Globbing policy files
  config.files.policies.forEach(function(policyPath) {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
}

function initAutherize(app){

  app.use(function (req, res, next) {
    let licenseKey = req.headers['x-license-key'];
    let requestFrom = req.headers['x-request-from'];
    let env = process.env.NODE_ENV;
    let URL = req.protocol + '://' + req.get('host') + req.originalUrl;
    let method = req.method;
    console.log(req.body)
    if(true) { //authorize the license key
      next();
    } else {
      res.status(400).json({error: "1", "message": "You are not allowed"});
    }
  });
}

function initModulesRoutes(app) {

  app.use("/v1.0", routesV1_0);

}

function initHelmetHeaders(app) {
  // Use helmet to secure Express headers
  let SIX_MONTHS = 15778476000;
  app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
}

function handleCors(app) {
  let whitelist = ['http://localhost:4200'];

  let corsOptions = {
    origin: function(origin, callback) {
      let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
    }
  };

  app.use(cors(corsOptions));
}

export default function init(db) {
  let app = express();

  app.use(expressLogging(logger));
  app.enable('trust proxy');

  initAutherize(app);

  initMiddleware(app);

  initModulesRoutes(app);

  winston.loggers.add('platform-core', {
    console: config.default.winston.console,
    file: config.default.winston.file
  });

  winston.loggers.get('platform-core');

  return app;
}
