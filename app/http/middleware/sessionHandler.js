// session handler
const sessionHandler = (req, res, next) => {
  res.locals.session = req.session;
  next();
};

// exports
module.exports = sessionHandler;
