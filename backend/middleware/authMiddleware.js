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
      req.user = User.findById(decoded.id).select("-password");

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

//Kullancının rolünü kontrol et
const authorizeAdmin = (req, res, next) => {
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
