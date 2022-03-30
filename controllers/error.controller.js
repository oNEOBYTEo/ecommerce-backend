const { AggregateError } = require('sequelize/types');

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  AggregateError.status = err.status || 'fail';

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    statck: err.stack
  });
};

module.exports = { globalErrorHandler };
