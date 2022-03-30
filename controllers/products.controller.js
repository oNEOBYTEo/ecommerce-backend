// Models
const { Product } = require('../models/product.model');

// Util
const { catchAsync } = require('../util/catchAsync');

exports.createProduct = catchAsync(async (req, res, next) => {
  const { currentuser } = req;

  const { title, description, price, quantity } = req.body;

  const newProduct = Product.create({
    title,
    description,
    price,
    quantity,
    userId: currentuser.id
  });

  res.status(200).json({
    status: 'success',
    data: { newProduct }
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = Product.findAll({ where: { status: 'active' } });

  res.status(200).json({
    status: 'success',
    data: { products }
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const { product } = req;

  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  const data = filterObj(req.body, 'title', 'description', 'price', 'quantity');

  await product.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: 'removed' });

  res.status(204).json({ status: 'success' });
});
