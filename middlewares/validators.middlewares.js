const { body, validationResult } = require('express-validator');
const { catchAsync } = require('../util/catchAsync');

exports.createUserValidators = [
  body('username')
    .isString()
    .withMessage('User Name must be a string')
    .notEmpty()
    .withMessage('Must Provide a valid User Name'),
  body('email')
    .isString()
    .withMessage('Email must be a string')
    .notEmpty()
    .withMessage('Must Provide a valid Email'),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .notEmpty()
    .withMessage('Must Provide a valid Password')
];

exports.validateResult = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors
      .array()
      .map(({ msg }) => msg)
      .join('. ');
    return next(new AppError(400, errorMsg));
  }

  next();
});
