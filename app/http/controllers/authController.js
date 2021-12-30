// external imports
const bcrypt = require('bcrypt');
const passport = require('passport');

// internal imports
const User = require('../../models/People');
const { mergeCart } = require('../controllers/customers/cartController');

const isLoggedIn = (req, res, next) => {
  // check if user is already logged in or not
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return next();
};

// GET - login form
const getLoginController = (req, res, next) => {
  res.status(200).render('auth/login');
};

// POST - do login
const loginController = (req, res, next) => {
  // process login request
  passport.authenticate('local', (err, user, info) => {
    // if errors
    if (err) {
      return next(err);
    }
    // if find no user or incorrect password
    if (!user) {
      return res.status(200).json({
        failure: {
          msg: info.message,
          redirectUrl: '/login',
        },
      });
    }
    // logged in user
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      // merge session cart data and mongo cart data
      mergeCart(req, res)
        .then((cart) => {
          req.session.cart = cart;
          return res.status(200).json({
            success: {
              msg: info.message,
              redirectUrl: '/',
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  })(req, res, next);
};

// POST - logged out user
const logoutController = (req, res, next) => {
  req.logout(); // logout user
  req.session.destroy(); // TODO: delete previous session
  res.status(200).json({
    success: {
      msg: 'You have been logged out',
      redirectUrl: '/',
    },
  });
};

// GET - register form
const getRegisterController = (req, res, next) => {
  res.status(200).render('auth/register');
};

// POST - do register
const registerController = async (req, res, next) => {
  try {
    let newUser;
    const hashedPassword = await bcrypt.hash(
      req.body.password,
      parseInt(process.env.SALT_ROUNDS)
    );
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    const result = await newUser.save(); // save new user
    res.status(200).json({
      success: {
        msg: 'You have registered successfully!',
        redirectUrl: '/login',
      },
    });
  } catch (err) {
    console.log(err);
  }
};

// exports
module.exports = {
  getLoginController,
  getRegisterController,
  registerController,
  loginController,
  logoutController,
  isLoggedIn,
};
