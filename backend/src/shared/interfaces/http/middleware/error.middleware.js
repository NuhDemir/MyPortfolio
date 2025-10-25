import logger from "../../../infrastructure/logging/logger.js";

export const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  logger.warn("Route not found", { url: req.originalUrl });
  res.status(404);
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorMiddleware = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const response = {
    message: err.message,
  };

  if (process.env.NODE_ENV !== "production" && err.stack) {
    response.stack = err.stack;
  }

  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.originalUrl,
  });

  res.status(statusCode).json(response);
};

export default errorMiddleware;
