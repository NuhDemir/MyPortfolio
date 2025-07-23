// backend/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // --- DÜZELTME BURADA ---
      // Veritabanından kullanıcıyı bulma işlemi asenkron olduğu için 'await' kullanmalıyız.
      req.user = await User.findById(decoded.id).select("-password");
      // --- DÜZELTME SONU ---

      if (!req.user) {
        res.status(401);
        throw new Error("Kullanıcı bulunamadı.");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Yetkisiz, token geçersiz.");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Yetkisiz, token bulunamadı.");
  }
});

// authorizeAdmin fonksiyonunda bir değişiklik yok, olduğu gibi kalabilir.
const authorizeAdmin = (req, res, next) => {
  // protect middleware'i 'await' sayesinde artık doğru req.user objesini sağlayacak.
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error(
      "Bu işlemi yapmaya yetkiniz yok, sadece adminler erişebilir."
    );
  }
};

export { protect, authorizeAdmin };
