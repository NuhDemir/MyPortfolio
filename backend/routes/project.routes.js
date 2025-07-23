import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

import validate from "../middleware/validation.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../dtos/project.dto.js";
import { protect, authorizeAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// @desc    Tüm projeleri getir
// @route   GET /api/projects
// @access  Public
router.get("/", getProjects);

// @desc    Belirli bir projeyi getir
// @route   GET /api/projects/:id
// @access  Public
router.get("/:id", getProject);

// @desc    Yeni proje oluştur
// @route   POST /api/projects
// @access  Private/Admin
router.post(
  "/",
  protect,
  authorizeAdmin,
  upload.single("image"), // Tek dosya yükleme middleware'i
  validate(createProjectSchema), // DTO doğrulama
  createProject
);

// @desc    Proje güncelle
// @route   PUT /api/projects/:id
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorizeAdmin,
  upload.single("image"), // Tek dosya yükleme middleware'i
  validate(updateProjectSchema), // DTO doğrulama
  updateProject
);

// @desc    Proje sil
// @route   DELETE /api/projects/:id
// @access  Private/Admin
router.delete("/:id", protect, authorizeAdmin, deleteProject);

export default router;
