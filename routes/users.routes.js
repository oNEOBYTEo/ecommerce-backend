const express = require('express');

// Controllers
const {
  createUser,
  loginUser,
  getUserProducts,
  updateUser,
  deleteUser,
  getOrders,
  getOrderById,
  getAllUsers,
  getUserById
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

router.get('/', getAllUsers);

router.get('/me', getUserProducts);

router.get('/orders', getOrders);

router.get('/orders/:id', getOrderById);

router
  .use('/:id', userExists)
  .route('/:id')
  .get(getUserById)
  .patch(protectAccountOwner, updateUser)
  .delete(protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
