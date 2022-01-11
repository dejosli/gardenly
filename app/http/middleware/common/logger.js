// external imports
const path = require('path');
const winston = require('winston');
const morgan = require('morgan');

// filter function,
// that will allow logging only the specified log level
const filter = (level) =>
  winston.format((info) => {
    if (info.level === level) {
      return info;
    }
  })();

// log levels system
const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  http: 5,
};

const transports = [
  // create a logging target for errors and fatals
  new winston.transports.File({
    filename: path.resolve('logs', 'error.log'),
    level: 'error',
    format: winston.format.combine(
      // add a timestamp
      winston.format.timestamp(),
      // use JSON form
      winston.format.json()
    ),
  }),

  // create a logging target for logs of different levels
  new winston.transports.File({
    filename: path.resolve('logs', 'combined.log'),
    level: 'info',
    // use simple form
    format: winston.format.simple(),
  }),

  // create a logging target for HTTP logs
  new winston.transports.File({
    filename: path.resolve('logs', 'http.log'),
    level: 'http',
    // process only HTTP logs
    format: filter('http'),
  }),

  // create a logging target for debug logs
  new winston.transports.Console({
    level: 'debug',
    // specify format for the target
    format: winston.format.combine(
      // process only debug logs
      filter('debug'),
      // colorize the output
      winston.format.colorize(),
      // add a timestamp
      winston.format.timestamp(),
      // use simple form
      winston.format.simple()
    ),
  }),
];

// create a Winston logger
const logger = winston.createLogger({
  // specify the own log levels system
  levels,
  // specify the logging targets
  transports,
});

// specify Morgan logging format
const morganFormat =
  process.env.NODE_ENV === 'development' ? 'dev' : 'combined';

// create a Morgan middleware instance
const morganMiddleware = morgan(morganFormat, {
  // specify a function for skipping requests without errors
  skip: (req, res) => res.statusCode < 400,
  // specify a stream for requests logging
  stream: {
    write: (msg) => logger.http(msg),
  },
});

// exports
module.exports = {
  logger,
  morganMiddleware,
};
