export const validateRequest = (schema, property = "body") => (req, res, next) => {
  const data = req[property];

  try {
    const parsed = schema.parse(data);
    req[property] = parsed;
    next();
  } catch (error) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.errors ?? error.issues ?? [],
    });
  }
};

export default validateRequest;
