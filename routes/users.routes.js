const express = require('express');

// Controllers
const {
  createUser,
  loginUser,
  getUserProducts,
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

const {
  protectAccountOwner,
  userExists
} = require('../middlewares/users.middleware');

const { validateSession } = require('../middlewares/auth.middlewares');

const router = express.Router();

router.post('/', createUserValidators, validateResult, createUser);

router.post('/login', loginUser);

router.use(validateSession);

router.get('/me', getUserProducts);

router
  .use('/:id', userExists, protectAccountOwner)
  .route('/:id')
  .patch(updateUser)
  .delete(deleteUser);

router.get('/orders', getOrders);

router.get('/orders/:id', getOrderById);

module.exports = { usersRouter: router };
