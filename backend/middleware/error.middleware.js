function errorMiddleware(err, req, res, next) {
  console.error('[KrishiDrishti Server Error]:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error. Please contact support.';
  
  res.status(status).json({
    success: false,
    message: message
  });
}

module.exports = errorMiddleware;
