#!/usr/bin/env node
import { Request, Response } from "express";
import app from "./app";
import http from "http";

/**
 * Module dependencies.
 */

// var app = require('./app');
// var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = 4000
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  console.log("Listening on the port", port);
});