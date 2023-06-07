const errorHandler = (err, req, res, next) => {
  console.error(err);
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = "Internal Server Error";
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Bad Request: Invalid JSON payload";
  }
  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
  }
  // Check if the error has a custom message
  if (err.message) {
    message = err.message;
  }
  res.status(statusCode).json({
    message: message,
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
};

module.exports = errorHandler;
