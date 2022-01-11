// protect routes from unknown user
const authGuard = (req, res, next) => {
  // check if user is already logged in or not
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
};

module.exports = authGuard;
