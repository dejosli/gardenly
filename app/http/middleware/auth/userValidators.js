// external imports
const { check, validationResult } = require('express-validator');
const createError = require('http-errors');

// internal imports
const User = require('../../../models/People');

// if email exists
const checkEmailExists = async (value) => {
  try {
    const user = await User.findOne({ email: value });
    if (user) {
      throw createError('Email already is use!');
    }
  } catch (err) {
    throw createError(err.message);
  }
};

// add user
const addUserValidators = [
  check('username')
    .isLength({ min: 1 })
    .withMessage('Username is required')
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage('Name must not contain anything other than alphabet')
    .trim()
    .escape(),
  check('email')
    .isEmail()
    .withMessage('Invalid email address')
    .trim()
    .escape()
    .custom(checkEmailExists)
    .withMessage('Email already exists'),
  check('password')
    .isStrongPassword()
    .withMessage(
      'Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
    ),
];

const addUserValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  // if there is no errors
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // response the errors
    res.status(200).json({
      errors: mappedErrors,
    });
  }
};

// exports
module.exports = {
  addUserValidators,
  addUserValidationHandler,
};
