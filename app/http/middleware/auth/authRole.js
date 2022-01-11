module.exports = function (...roles) {
  return (req, res, next) => {
    if (req.isAuthenticated() && roles.indexOf(req.user.role) > -1) {
      return next();
    }
    return res.redirect('/');
  };
};
