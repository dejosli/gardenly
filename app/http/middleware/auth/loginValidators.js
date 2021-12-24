const { check, validationResult } = require('express-validator');

const doLoginValidators = [
  check('email')
    .isLength({
      min: 1,
    })
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .trim()
    .escape(),
  check('password').isLength({ min: 1 }).withMessage('Password is required'),
];

const doLoginValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // response the errors
    res.status(200).json({
      data: {
        email: req.body.email,
      },
      errors: mappedErrors,
    });
  }
};

// exports
module.exports = {
  doLoginValidators,
  doLoginValidationHandler,
};
