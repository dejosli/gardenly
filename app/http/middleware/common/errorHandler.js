// internal imports
const createError = require('http-errors');

// notfound handler - 404
const notFoundHandler = (req, res, next) => {
  next(createError(404, 'Sorry! Page Not Found'));
};

// default error handler
const errorHandler = (err, req, res, next) => {
  res.locals.error =
    process.env.NODE_ENV === 'development' ? err : { message: err.message };
  res.status(err.status || 500).send(res.locals.error);
};

// exports
module.exports = {
  notFoundHandler,
  errorHandler,
};
