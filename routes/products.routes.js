const express = require('express');

//Controllers
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/products.controller');

// Middlewares
const { validateSession } = require('../middlewares/auth.middlewares');

const {
  createProductValidators,
  validateResult
} = require('../middlewares/validators.middlewares');

const {
  productExists,
  protectProductsOwner
} = require('../middlewares/products.middlewares');

const router = express.Router();

router.use(validateSession);

router
  .route('/')
  .post(createProductValidators, validateResult, createProduct)
  .get(getAllProducts);

router
  .use('/:id', productExists)
  .route('/:id')
  .get(getProductById)
  .patch(protectProductsOwner, updateProduct)
  .delete(protectProductsOwner, deleteProduct);

module.exports = { productsRouter: router };
