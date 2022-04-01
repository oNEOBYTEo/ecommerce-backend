// Models
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { ProductInCart } = require('../models/productInCart');
const { Order } = require('../models/order.model');

// Util
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');

exports.getUserCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id },
    include: {
      model: Product,
      through: {
        where: { status: 'active' }
      }
    }
  });

  if (!cart) {
    return next(new AppError(404, 'This user does not have a cart yet'));
  }

  res.status(200).json({
    status: 'success',
    data: { cart }
  });
});

exports.addProduct = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId, quantity } = req.body;

  const product = await Product.findOne({
    where: { status: 'active', id: productId }
  });

  if (quantity > product.quantity) {
    return next(
      new AppError(400, `This product only has ${product.quantity} items.`)
    );
  }

  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id }
  });

  if (!cart) {
    const newCart = await Cart.create({ userId: currentUser.id });

    await ProductInCart.create({
      productId,
      cartId: newCart.id,
      quantity
    });
  } else {
    const productExists = await ProductInCart.findOne({
      where: { cartId: cart.id, productId }
    });

    if (productExists && productExists.status === 'active') {
      return next(new AppError(400, 'This product is already in the cart'));
    }

    if (productExists && productExists.status === 'removed') {
      await productExists.update({ status: 'active', quantity });
    }
    if (!productExists) {
      await ProductInCart.create({ cartId: cart.id, productId, quantity });
    }
  }

  res.status(201).json({ status: 'success' });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId, quantity } = req.body;

  const product = await Product.findOne({
    where: { status: 'active', id: productId }
  });

  if (quantity > product.quantity) {
    return next(
      new AppError(400, `This product only has ${product.quantity} items`)
    );
  }

  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id }
  });

  if (!cart) {
    return next(new AppError(400, 'This user does not have a cart yet'));
  }

  const productInCart = await ProductInCart.findOne({
    where: { status: 'active', cartId: cart.id, productId }
  });

  if (!productInCart) {
    return next(
      new AppError(404, `Can't update product, is not in the cart yet`)
    );
  }

  if (quantity === 0) {
    await productInCart.update({ quantity: 0, status: 'removed' });
  }

  if (quantity > 0) {
    await productInCart.update({ quantity });
  }

  res.status(204).json({ status: 'success' });
});

exports.deleteCartProductById = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId } = req.params;

  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id }
  });

  if (!cart) {
    return next(new AppError(404, 'This user does not have a cart yet'));
  }

  const productInCart = await ProductInCart.findOne({
    where: { status: 'active', cartId: cart.id, productId }
  });

  if (!productInCart) {
    return next(new AppError(404, 'This product does not exist in this cart'));
  }

  await productInCart.update({ status: 'removed', quantity: 0 });

  res.status(204).json({ status: 'success' });
});

exports.purchase = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id },
    include: { model: Product, through: { where: { status: 'active' } } }
  });

  if (!cart) {
    return next(new AppError(404, 'This user does not have a cart yet'));
  }

  let totalPrice = 0;

  const cartPromises = cart.products.map(async (product) => {
    await product.productInCart.update({ status: 'purchased' });

    const productPrice = product.price * product.productInCart.quantity;

    totalPrice += productPrice;

    const newQuantity = product.quantity - product.productInCart.quantity;

    return await product.update({ quantity: newQuantity });
  });

  await Promise.all(cartPromises);

  await cart.update({ status: 'purchased' });

  await Order.create({
    userId: currentUser.id,
    cartId: cart.id,
    issuedAt: Date.now().toLocaleString(),
    totalPrice
  });

  res.status(201).json({ status: 'success' });
});
