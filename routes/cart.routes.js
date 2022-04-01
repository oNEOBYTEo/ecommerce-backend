const express = require('express');
const { route } = require('express/lib/router');

// Controllers
const {
  addProduct,
  updateCart,
  deleteCartProductById,
  purchase,
  getUserCart
} = require('../controllers/cart.controller');

// Middlewares
const { validateSession } = require('../middlewares/auth.middlewares');

const {
  addProductToCartValidation,
  validateResult
} = require('../middlewares/validators.middlewares');

const router = express.Router();

router.use(validateSession);

router.get('/', getUserCart);

router.post(
  '/add-product',
  addProductToCartValidation,
  validateResult,
  addProduct
);

router.patch('/update-cart', updateCart);

router.delete('/:productId', deleteCartProductById);

router.post('/purchase', purchase);

module.exports = { cartRouter: router };
