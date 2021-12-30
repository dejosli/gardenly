// internal imports
const SessionCart = require('../../../models/SessionCart');

// exports
module.exports = (req, res, next) => {
  res.locals.session = req.session; // initialize session
  res.locals.user = req.user; // authenticated user
  next();
};
