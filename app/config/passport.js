// external imports
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

// internal imports
const User = require('../models/People');

// init local strategy
const initLocalStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      // find user in database
      const user = await User.findOne({ email: email });
      // if user not found
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      // if password not match
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // if user exists and password match
        return done(null, user, { message: 'You logged in successfully!' });
      }
      return done(null, false, { message: 'Wrong email or password' });
    } catch (err) {
      return done(err);
    }
  }
);

// init serialize user
const initSerializeUser = (user, done) => {
  done(null, user._id);
};

// init deserialize user
const initDeserializeUser = (id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
};

// exports
module.exports = {
  initLocalStrategy,
  initSerializeUser,
  initDeserializeUser,
};
