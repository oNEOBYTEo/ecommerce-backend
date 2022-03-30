const { body, validationResult } = require('express-validator');
const { catchAsync } = require('../util/catchAsync');

// User Validators
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

// END; User Validators

// Products Validators
exports.createProductValidators = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .notEmpty()
    .withMessage('Must provide a valid title'),
  body('description')
    .isString()
    .withMessage('Description must be a string')
    .notEmpty()
    .withMessage('Must provide a valid description'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom((value) => value > 0)
    .withMessage('Price must be greater than 0'),
  body('quantity')
    .isNumeric()
    .withMessage('Quantiity must be a number')
    .custom((value) => value > 0)
    .withMessage('Quantity must be greater than 0')
];

// END; Producsts Validators

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
