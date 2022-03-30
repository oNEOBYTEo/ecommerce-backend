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

const router = express.Router();

router.use(validateSession);

router.post('/', createProductValidators, validateResult, createProduct);
