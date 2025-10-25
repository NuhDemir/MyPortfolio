import asyncHandler from "express-async-handler";

export const createAuthMiddleware = ({ tokenService, userRepository }) => {
  const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      res.status(401);
      throw new Error("Yetkisiz, token bulunamadı.");
    }

    try {
      const decoded = tokenService.verify(token);
      const user = await userRepository.findById(decoded.id, { includePassword: false });

      if (!user) {
        res.status(401);
        throw new Error("Kullanıcı bulunamadı.");
      }

      req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Yetkisiz, token geçersiz.");
    }
  });

  const authorize = (...roles) => (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }

    res.status(403);
    throw new Error("Bu işlemi yapmaya yetkiniz yok.");
  };

  const authorizeAdmin = authorize("admin");

  return {
    protect,
    authorize,
    authorizeAdmin,
  };
};

export default createAuthMiddleware;
