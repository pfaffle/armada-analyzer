#!/usr/bin/env node

import { app } from "../app";
import debug from "debug";
import http from "http";
const log = debug("app:server");

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

function isSystemError(
  error: Error | NodeJS.ErrnoException,
): error is NodeJS.ErrnoException {
  return !!(
    (error as NodeJS.ErrnoException).code &&
    (error as NodeJS.ErrnoException).syscall
  );
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: Error) {
  if (isSystemError(error)) {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
    }
  }
  throw error;
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  if (!addr) {
    throw new Error("Server not bound to address");
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  log("Listening on " + bind);
}

/**
 * Listen on provided port, on all network interfaces.
 */
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
