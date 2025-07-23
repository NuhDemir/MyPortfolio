import express from "express";
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

import validate from "../middleware/validation.middleware.js";
import { createBlogSchema, updateBlogSchema } from "../dtos/blog.dto.js";
import { protect, authorizeAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// @desc    Tüm blog yazılarını getir
// @route   GET /api/blog
// @access  Public (adminler taslakları da görebilir)
router.get("/", protect, getBlogs);

//@desc   Belirli bir blog yazısını getir
// @route   GET /api/blog/:slug
// @access  Public (adminler taslakları da görebilir)
router.get("/:slug", protect, getBlog);

// @desc    Yeni blog yazısı oluştur
// @route   POST /api/blog
// @access  Private/Admin
router.post(
  "/",
  protect,
  authorizeAdmin,
  upload.single("thumbnail"), // 'thumbnail' adında tek bir dosya yüklemesini bekle
  validate(createBlogSchema),
  createBlog
);

// @desc    Blog yazısını güncelle
// @route   PUT /api/blog/:id
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorizeAdmin,
  upload.single("thumbnail"), // Güncelleme sırasında yeni bir thumbnail yüklenebilir (isteğe bağlı)
  validate(updateBlogSchema),
  updateBlog
);

// @desc    Blog yazısını sil
// @route   DELETE /api/blog/:id
// @access  Private/Admin
router.delete("/:id", protect, authorizeAdmin, deleteBlog);

export default router;
