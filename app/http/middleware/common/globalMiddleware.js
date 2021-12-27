// exports
module.exports = (req, res, next) => {
  res.locals.session = req.session; // session
  res.locals.user = req.user; // authenticated user
  res.locals.cartId = req.isAuthenticated() ? req.user.id : 'guest';
  next();
};
