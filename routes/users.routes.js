const express = require('express');

// Controllers
const {
  createUser,
  loginUser,
  getProductsUser,
  updateUser,
  deleteUser,
  getOrders,
  getOrderById
} = require('../controllers/users.controller');

// Middlewares
const {
  createUserValidators,
  validateResult
} = require('../middlewares/validators.middlewares');

const { validateSession } = require('../middlewares/auth.middlewares');

const router = express.Router();

router.post('/', createUserValidators, validateResult, createUser);

router.post('/login', loginUser);

router.use(validateSession);

router.get('/me', getProductsUser);

router.route('/:id').patch(updateUser).delete(deleteUser);

router.get('/orders', getOrders);

router.get('/orders/:id', getOrderById);

module.exports = { usersRouter: router };
