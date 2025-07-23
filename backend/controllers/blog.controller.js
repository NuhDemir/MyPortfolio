// backend/controllers/blog.controller.js
import asyncHandler from "express-async-handler"; // Async fonksiyonlar için hata yakalama
import {
  getAllBlogs,
  getBlogBySlug,
  createNewBlog,
  updateExistingBlog,
  deleteExistingBlog,
} from "../services/blog.service.js"; // Blog servisimizden gerekli fonksiyonları alıyoruz

// @desc    Tüm blog yazılarını getir (Yayınlanmış veya Admin ise hepsi)
// @route   GET /api/blog
// @access  Public (adminler taslakları da görebilir)
const getBlogs = asyncHandler(async (req, res) => {
  // `protect` middleware'i bu route'da kullanıldığı için req.user objesi dolu olabilir.
  // Eğer `protect` kullanılmasaydı, req.user'ın varlığını kontrol etmek gerekirdi.
  const isAdmin = req.user && req.user.role === "admin"; // İstek yapanın admin olup olmadığını kontrol et
  const blogs = await getAllBlogs(isAdmin); // Servis katmanındaki fonksiyonu çağır (admin durumunu pas geç)
  res.json(blogs); // Blogları JSON olarak gönder
});

// @desc    Belirli bir blog yazısını getir (Yayınlanmış veya Admin ise taslağı da)
// @route   GET /api/blog/:slug
// @access  Public (adminler taslakları da görebilir)
const getBlog = asyncHandler(async (req, res) => {
  const isAdmin = req.user && req.user.role === "admin";
  const blog = await getBlogBySlug(req.params.slug, isAdmin); // Servis katmanındaki fonksiyonu çağır
  res.json(blog); // Blogu JSON olarak gönder
});

// @desc    Yeni blog yazısı oluştur
// @route   POST /api/blog
// @access  Private/Admin
const createBlog = asyncHandler(async (req, res) => {
  const { title, content, tags, category, isPublished } = req.body; // Gelen verileri al

  const blogData = {
    // Servis katmanına göndereceğimiz veri objesi
    title,
    content,
    thumbnail: req.file ? req.file.path : "", // Eğer thumbnail yüklenmişse URL'sini kullan, yoksa boş
    tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    category: category || "",
    isPublished: isPublished === "true" || isPublished === true, // Frontend'den gelen stringi/booleanı gerçek boolean'a çevir
    author: req.user._id, // JWT token'ından gelen adminin ID'si (protect middleware'i doldurur)
  };

  const createdBlog = await createNewBlog(blogData); // Servis katmanındaki fonksiyonu çağır
  res.status(201).json(createdBlog); // 201 Created durum koduyla oluşturulan blogu gönder
});

// @desc    Blog yazısını güncelle
// @route   PUT /api/blog/:id
// @access  Private/Admin
const updateBlog = asyncHandler(async (req, res) => {
  const { title, content, tags, category, isPublished } = req.body;

  const updateData = {
    // Servis katmanına göndereceğimiz güncelleme verisi
    title: title !== undefined ? title : undefined,
    content: content !== undefined ? content : undefined,
    tags:
      tags !== undefined
        ? tags
          ? tags.split(",").map((tag) => tag.trim())
          : []
        : undefined,
    category: category !== undefined ? category : undefined,
    isPublished:
      isPublished !== undefined
        ? isPublished === "true" || isPublished === true
        : undefined,
  };

  if (req.file) {
    // Eğer yeni bir thumbnail yüklenmişse
    updateData.thumbnail = req.file.path;
  }

  const updatedBlog = await updateExistingBlog(req.params.id, updateData); // Servis katmanındaki fonksiyonu çağır
  res.json(updatedBlog); // Güncellenen blogu JSON olarak gönder
});

// @desc    Blog yazısını sil
// @route   DELETE /api/blog/:id
// @access  Private/Admin
const deleteBlog = asyncHandler(async (req, res) => {
  const result = await deleteExistingBlog(req.params.id); // Servis katmanındaki fonksiyonu çağır
  res.json(result); // Silme işleminin sonucunu gönder
});

export { getBlogs, getBlog, createBlog, updateBlog, deleteBlog };
