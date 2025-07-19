//DTO doğrulama
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      message: "Geçersiz veri gönderildi.",
      error: error.errors,
    });
  }
};

export default validate;
