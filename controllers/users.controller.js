const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');

dotenv.config({ path: './config.env' });

exports.createUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword
  });

  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    data: { newUser }
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email, status: 'active' }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(400, 'Credentials are invalid'));
  }

  const token = await jwt.sign(
    { id: user.id }, // Token payload
    process.env.JWT_SECRET, // Secret key
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  res.status(200).json({
    status: 'success',
    data: { token }
  });
});

exports.getUserProducts = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  const userProducts = await Product.findAll({
    where: { userId: currentUser.id }
  });

  res.status(200).json({
    status: 'success',
    data: { userProducts }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const data = filterObj(req.body, 'username', 'email');

  await user.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  const userOrders = await Order.findAll({
    where: { userId: currentUser.id },
    include: {
      model: Cart,
      where: { userId: currentUser.id },
      include: { model: Product, where: { status: 'purchased' } }
    }
  });

  res.status(200).json({
    status: 'success',
    data: { userOrders }
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const { currentUser, id } = req;

  const userOrder = await Order.findAll({
    where: { id, userId: currentUser.id },
    include: {
      model: Cart,
      where: { userId: currentUser.id },
      include: { model: Product, where: { status: 'purchased' } }
    }
  });

  res.status(200).json({
    status: 'success',
    data: { userOrder }
  });
});
