// Models
const { Product } = require('../models/product.model');

// Utils
const { AppError } = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

exports.productExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({ where: { id, status: 'active' } });

  if (!product) {
    return next(new AppError(404, 'No product found with that ID'));
  }

  req.product = product;
  next();
});

exports.protectProductsOwner = async (req, res, next) => {
  const { id } = req.params;
  const { product } = req;

  if (product.id !== +id) {
    return next(
      new AppError(
        403,
        `You can't update others producst of other users accounts`
      )
    );
  }

  next();
};
