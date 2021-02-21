'use strict';

/**
 * Module dependencies.
 */

import config from '../config';
import chalk from 'chalk';
import path from 'path';
import mongoose from 'mongoose';

//Object holding all your connection strings
var connections = {};

export function loadModels(callback) {
  // Globbing model files
  config.files.models.forEach(function(modelPath) {
    require(path.resolve(modelPath));
  });
};

export function connect(cb) {
  var _this = this;

  var db = mongoose.connect(config.default.db.mongodb.uri+config.default.database, config.default.db.mongodb.options, function(err) {
    // Log Error
    if (err) {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);
    } else {
      // Enabling mongoose debug mode if required
      mongoose.set('useCreateIndex', true);
      mongoose.set('debug', true);

      // Call callback FN
      if (cb) cb(db);
    }
  });


};

export function disconnect(cb) {
  mongoose.disconnect(function(err) {
    console.info(chalk.yellow('Disconnected from MongoDB.'));
    cb(err);
  });
};
