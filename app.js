const express = require('express');

const { globalErrorHandler } = require('./controllers/error.controller');

const app = express();

app.use(express.json());

app.use('/api/v1/users');
app.use('/api/v1/products');
app.use('/api/v1/cart');

app.use(globalErrorHandler);

module.exports = { app };
