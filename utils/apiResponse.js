module.exports = {
  success: (res, data, message = 'Success') => {
    res.status(200).json({
      status: 'success',
      message,
      data,
    });
  },

  error: (res, error, message = 'Error', statusCode = 500) => {
    res.status(statusCode).json({
      status: 'error',
      message,
      error,
    });
  },
};
