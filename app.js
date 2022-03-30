const express = require('express');

// Routes
const { usersRouter } = require('./routes/users.routes');

// Util
const { globalErrorHandler } = require('./controllers/error.controller');

const app = express();

app.use(express.json());

app.use('/api/v1/users', usersRouter);
// app.use('/api/v1/products');
// app.use('/api/v1/cart');

app.use(globalErrorHandler);

module.exports = { app };
