// backend/services/blog.service.js
import {
  findAllBlogs,
  findBlogBySlug,
  saveBlog,
  updateBlogById,
  deleteBlogById,
} from "../repositories/blog.repository.js"; // Blog repository'sinden gerekli fonksiyonları alıyoruz
import { marked } from "marked"; // Markdown'ı HTML'e çevirmek için
import sanitizeHtml from "sanitize-html"; // HTML'i temizlemek için (güvenlik)

// Markdown'ı HTML'e çevirip güvenli hale getiren yardımcı fonksiyon
// Bu fonksiyon, gelen Markdown içeriğini alır, onu HTML'e dönüştürür
// ve sonra bu HTML'i güvenlik risklerinden (XSS saldırıları gibi) temizler.
const convertAndSanitizeHtml = (markdownContent) => {
  if (!markdownContent) return ""; // İçerik yoksa boş string dön

  const html = marked(markdownContent); // Markdown'ı HTML'e çevir
  const cleanHtml = sanitizeHtml(html, {
    // HTML'i temizle
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "pre",
      "code",
      "blockquote",
      "a",
      "p",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "br",
      "hr",
      "table",
      "thead",
      "tbody",
      "tr",
      "td",
      "th",
    ]),
    allowedAttributes: sanitizeHtml.defaults.allowedAttributes.concat([
      { tagName: "a", attributes: ["href", "title", "target"] },
      {
        tagName: "img",
        attributes: ["src", "alt", "title", "width", "height"],
      },
      { tagName: "pre", attributes: ["class"] },
      { tagName: "code", attributes: ["class"] },
    ]),
    allowedSchemes: ["http", "https", "mailto"],
    allowVulnerableTags: false, // Potansiyel güvenlik açığı olan etiketlere izin verme
  });
  return cleanHtml;
};

// Tüm blog yazılarını getirme iş mantığı (admin rolüne göre filtreler)
const getAllBlogs = async (isAdmin = false) => {
  const filter = isAdmin ? {} : { isPublished: true }; // Adminse hepsi, değilse sadece yayınlanmışlar
  const blogs = await findAllBlogs(filter); // Repository'den blogları bulmasını iste

  // Blog içeriklerini frontend'e göndermeden önce HTML'e çevir ve temizle
  return blogs.map((blog) => ({
    ...blog.toObject(), // Mongoose dokümanını düz JavaScript objesine çevir
    content: convertAndSanitizeHtml(blog.content), // Markdown'ı güvenli HTML'e çevir
  }));
};

// Slug'a göre blog yazısı getirme iş mantığı (admin rolüne göre filtreler ve görüntülenme sayısını artırır)
const getBlogBySlug = async (slug, isAdmin = false) => {
  const filter = isAdmin ? {} : { isPublished: true };
  const blog = await findBlogBySlug(slug, filter); // Repository'den blogu slug'a göre bulmasını iste

  if (blog) {
    // Blog görüntülendiğinde 'views' sayacını artır (iş mantığı olduğu için servis katmanında)
    blog.views += 1;
    await blog.save(); // Güncelleme işlemini kaydet

    return {
      ...blog.toObject(),
      content: convertAndSanitizeHtml(blog.content),
    };
  } else {
    throw new Error("Blog yazısı bulunamadı veya yayınlanmadı.");
  }
};

// Yeni blog yazısı oluşturma iş mantığı
const createNewBlog = async (blogData) => {
  return await saveBlog(blogData); // Repository'den blogu kaydetmesini iste
};

// Mevcut blog yazısını güncelleme iş mantığı
const updateExistingBlog = async (id, updateData) => {
  const updatedBlog = await updateBlogById(id, updateData); // Repository'den blogu güncellemesini iste
  if (!updatedBlog) {
    throw new Error("Blog yazısı bulunamadı.");
  }
  return updatedBlog;
};

// Mevcut blog yazısını silme iş mantığı
const deleteExistingBlog = async (id) => {
  const result = await deleteBlogById(id); // Repository'den blogu silmesini iste
  if (!result) {
    throw new Error("Blog yazısı bulunamadı.");
  }
  return result;
};

export {
  getAllBlogs,
  getBlogBySlug,
  createNewBlog,
  updateExistingBlog,
  deleteExistingBlog,
};
