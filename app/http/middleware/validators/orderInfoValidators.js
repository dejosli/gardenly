const { check, validationResult } = require('express-validator');

const doOrderInfoValidators = [
  check('mobile')
    .isMobilePhone('bn-BD', {
      strictMode: true,
    })
    .withMessage('Must be a valid Bangladeshi mobile number'),
  check('address')
    .isLength({ min: 1 })
    .withMessage('Shipping address is required')
    .trim()
    .escape(),
];

const doOrderInfoValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
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
  doOrderInfoValidators,
  doOrderInfoValidationHandler,
};
