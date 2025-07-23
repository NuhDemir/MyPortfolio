// backend/controllers/auth.controller.js
import asyncHandler from "express-async-handler"; // Async fonksiyonlar için hata yakalama
import { loginAdmin, registerAdmin } from "../services/auth.service.js"; // Auth servisimizden gerekli fonksiyonları alıyoruz

// @desc    Admin girişi
// @route   POST /api/auth/login
// @access  Public
const authAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body; // İstek gövdesinden kullanıcı adı ve şifreyi al

  try {
    const userData = await loginAdmin(username, password); // Servis katmanındaki loginAdmin fonksiyonunu çağır
    res.json(userData); // Başarılıysa kullanıcı verilerini JSON olarak gönder
  } catch (error) {
    res.status(401); // Kimlik doğrulama hatası (Unauthorized)
    throw new Error(error.message); // Hata mesajını fırlat (errorHandler yakalayacak)
  }
});

// @desc    Yeni admin kullanıcısı oluştur
// @route   POST /api/auth/register
// @access  Private/Admin
const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  try {
    const newAdmin = await registerAdmin(username, password); // Servis katmanındaki registerAdmin fonksiyonunu çağır
    res.status(201).json(newAdmin); // Başarılıysa 201 Created durum koduyla yeni adminin verilerini gönder
  } catch (error) {
    res.status(400); // Kötü istek (Bad Request) hata kodu
    throw new Error(error.message);
  }
});

export { authAdmin, registerUser };
