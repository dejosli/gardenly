// internal imports
const createError = require('http-errors');

// notfound handler - 404
const notFoundHandler = (req, res, next) => {
  next(createError(404, 'Sorry! Page Not Found'));
};

// default error handler
const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    return next(createError(500, err));
  }
  return res.status(err.status || 500).json({ error: 'Internal Server Error' });
};

// exports
module.exports = {
  notFoundHandler,
  errorHandler,
};
