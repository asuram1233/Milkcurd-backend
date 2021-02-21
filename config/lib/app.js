'use strict';
/**
 * Module dependencies.
 */
import chalk from 'chalk';
import config from '../config';
import express from './express';
import events from "events";
import { connect, loadModels } from './mongoose';
import socket from "./socket-listener.js";

events.EventEmitter.prototype._maxListeners = 100;

var http = require('http').Server(express());
// var io = require('socket.io')(http);

const app = connect(function () {
    const server = express();

    var io = require('socket.io').listen(http);

    require("./socket-listener.js")(io)

    http.listen(config.default.port, function () {
        console.log(chalk.green(config.default.app.title + ' is running on port ' + config.default.port));
    });
    return server;
});
  
export default app;