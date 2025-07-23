// backend/routes/auth.routes.js
import express from "express";
import { authAdmin, registerUser } from "../controllers/auth.controller.js";
import validate from "../middleware/validation.middleware.js";
import { loginSchema } from "../dtos/auth.dto.js";
import { protect, authorizeAdmin } from "../middleware/auth.middleware.js"; // Bu satır durabilir, diğer rotalarda kullanılabilir

const router = express.Router();

// @desc    Admin girişi
// @route   POST /api/auth/login
// @access  Public
router.post("/login", validate(loginSchema), authAdmin);

// @desc    Yeni admin kullanıcısı oluştur
// @route   POST /api/auth/register
// @access  Public (Yeni kullanıcı oluşturulduğu için token veya admin yetkisi gerekmez)
router.post(
  "/register",
  validate(loginSchema), // Sadece veri doğrulama yeterli
  registerUser
);

// Örnek: Admin yetkisi gerektiren başka bir rota
// router.get('/admin/profile', protect, authorizeAdmin, getAdminProfile);

export default router;
