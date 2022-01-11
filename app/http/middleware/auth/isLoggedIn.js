// send back a loggedIn user to homepage
const isLoggedIn = (req, res, next) => {
  // check if user is already logged in or not
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return next();
};

module.exports = isLoggedIn;
