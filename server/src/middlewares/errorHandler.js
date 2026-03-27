import { StatusCodes } from "http-status-codes";

const errorHandler = (err, req, res, next) => {
  let message = err.message || "INTERNAL_SERVER_ERROR";
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    message: message,
    statusCode: statusCode,
    // ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
