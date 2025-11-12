import { useCallback, useEffect, useMemo, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import ErrorMessage from "@shared/ui/ErrorMessage.jsx";
import LoadingSpinner from "@shared/ui/LoadingSpinner.jsx";
import Pagination from "@shared/ui/Pagination.jsx";
import {
  createBlog,
  deleteBlog,
  getBlogs,
  updateBlog,
} from "../services/blogService";
import "../styles/management.css";

const initialFormState = {
  title: "",
  content: "",
  category: "",
  tags: "",
  isPublished: false,
};

const toTagsText = (tags) => {
  if (!Array.isArray(tags)) {
    return "";
  }
  return tags.join(", ");
};

const toTagsArray = (value) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const resolveThumbnailUrl = (blog) =>
  blog?.thumbnail?.url || blog?.thumbnailUrl || blog?.coverImage || "";

const AdminBlogManagementPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const cleanupThumbnailPreview = useCallback(() => {
    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
  }, [thumbnailPreview]);

  useEffect(() => cleanupThumbnailPreview, [cleanupThumbnailPreview]);

  const categories = useMemo(
    () => ["geliştirme", "kişisel", "teknoloji", "tasarım", "eğitim", "diğer"],
    []
  );

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBlogs();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Blog yazıları getirilirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleInputChange = ({ target: { name, value, type, checked } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleThumbnailChange = ({ target: { files } }) => {
    const file = files?.[0];
    if (file) {
      setThumbnailFile(file);
      cleanupThumbnailPreview();
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setIsFormVisible(false);
    setEditingId(null);
    setFormData(initialFormState);
    setThumbnailFile(null);
    cleanupThumbnailPreview();
    setThumbnailPreview(null);
    setError(null);
  };

  const resolveBlogId = (blog) => blog?.id ?? blog?._id ?? "";

  const handleEditClick = (blog) => {
    const blogId = resolveBlogId(blog);
    if (!blogId) {
      setError("Seçili blog yazısının kimliği bulunamadı.");
      return;
    }

    resetForm();
    setEditingId(blogId);
    setFormData({
      title: blog.title || "",
      content: blog.content || "",
      category: blog.category || "",
      tags: toTagsText(blog.tags),
      isPublished: Boolean(blog.isPublished),
    });
    const previewUrl = resolveThumbnailUrl(blog);
    setThumbnailPreview(previewUrl || null);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = async (id) => {
    if (
      !window.confirm("Bu blog yazısını silmek istediğinizden emin misiniz?")
    ) {
      return;
    }
    if (!id) {
      setError("Silinecek blog yazısının kimliği bulunamadı.");
      return;
    }
    setLoading(true);
    try {
      await deleteBlog(id);
      await fetchBlogs();
    } catch (err) {
      setError(err.message || "Blog yazısı silinirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editingId && !thumbnailFile) {
      setError("Yeni blog oluşturmak için kapak görseli seçmek zorunludur.");
      return;
    }

    setLoading(true);
    setError(null);

    const submission = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category.trim(),
      tags: toTagsArray(formData.tags),
      isPublished: formData.isPublished,
    };

    if (!submission.category || !categories.includes(submission.category)) {
      delete submission.category;
    }

    if (!Array.isArray(submission.tags) || submission.tags.length === 0) {
      delete submission.tags;
    }

    if (thumbnailFile) {
      submission.thumbnail = thumbnailFile;
    }

    try {
      if (editingId) {
        await updateBlog(editingId, submission);
      } else {
        await createBlog(submission);
      }
      resetForm();
      await fetchBlogs();
    } catch (err) {
      setError(err.message || "Blog yazısı kaydedilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleJsonSubmit = async () => {
    try {
      setError(null);
      const parsedData = JSON.parse(jsonInput);

      // Validate JSON structure
      if (!parsedData.title || !parsedData.content) {
        setError("JSON'da en az 'title' ve 'content' alanları gereklidir.");
        return;
      }

      setLoading(true);

      const submission = {
        title: parsedData.title,
        content: parsedData.content,
        category: parsedData.category || "",
        tags: Array.isArray(parsedData.tags) ? parsedData.tags : [],
        isPublished: Boolean(parsedData.isPublished),
      };

      // Handle thumbnail URL if provided
      if (parsedData.thumbnailUrl) {
        submission.thumbnailUrl = parsedData.thumbnailUrl;
      }

      await createBlog(submission);
      setIsJsonModalOpen(false);
      setJsonInput("");
      await fetchBlogs();
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Geçersiz JSON formatı. Lütfen formatı kontrol edin.");
      } else {
        setError(err.message || "JSON yüklenirken bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  const jsonTemplate = {
    title: "Blog Başlığı",
    content:
      "# Markdown formatında blog içeriği\\n\\nBuraya içeriğinizi yazın...",
    category: "teknoloji",
    tags: ["javascript", "react", "web"],
    thumbnailUrl: "https://example.com/image.jpg",
    isPublished: false,
  };

  return (
    <div className="admin-management-page">
      <h1>Blog Yönetimi</h1>
      {error && <ErrorMessage message={error} />}
      {!isFormVisible && (
        <div className="admin-action-buttons">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsFormVisible(true);
            }}
            className="admin-add-new-btn"
          >
            <AddRoundedIcon className="btn-icon" fontSize="inherit" />
            <span>Yeni Blog Yazısı</span>
          </button>
          <button
            type="button"
            onClick={() => setIsJsonModalOpen(true)}
            className="admin-json-btn"
          >
            <UploadFileRoundedIcon className="btn-icon" fontSize="inherit" />
            <span>JSON ile Yükle</span>
          </button>
        </div>
      )}

      {isFormVisible && (
        <div className="admin-form-container">
          <h2>
            {editingId ? "Blog Yazısını Düzenle" : "Yeni Blog Yazısı Oluştur"}
          </h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Başlık</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Kategori</label>
                <input
                  id="category"
                  name="category"
                  list="blog-categories"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Örn: geliştirme"
                />
                <datalist id="blog-categories">
                  {categories.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="content">İçerik</label>
              <textarea
                id="content"
                name="content"
                rows="8"
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="tags">Etiketler (virgülle ayırın)</label>
                <input
                  id="tags"
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="tasarım, deneyim"
                />
              </div>
              <div className="form-group form-group--file">
                <label htmlFor="thumbnail">
                  Kapak Görseli{" "}
                  {editingId ? "(değiştirmek için yeni dosya seçin)" : ""}
                </label>
                <div className="form-file-field">
                  <ImageOutlinedIcon className="btn-icon" fontSize="inherit" />
                  <input
                    id="thumbnail"
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                </div>
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Blog kapak önizlemesi"
                    className="image-preview"
                  />
                )}
              </div>
            </div>

            <label className="checkbox-group" htmlFor="isPublished">
              <input
                id="isPublished"
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
              />
              <span>Yayınla</span>
              <span className="checkbox-group__state">
                {formData.isPublished ? "Yayında" : "Taslak"}
              </span>
            </label>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="submit-btn">
                <SaveRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>
                  {loading
                    ? "Kaydediliyor..."
                    : editingId
                    ? "Güncelle"
                    : "Kaydet"}
                </span>
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                <CloseRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>İptal</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-list-container">
        <h2>Mevcut Blog Yazıları</h2>
        {loading && blogs.length === 0 ? (
          <LoadingSpinner message="Blog yazıları yükleniyor..." />
        ) : null}
        {!loading && !error && (
          <>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Kapak</th>
                    <th>Başlık</th>
                    <th>Kategori</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.length > 0 ? (
                    blogs
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((blog, index) => {
                        const blogId = resolveBlogId(blog);
                        return (
                          <tr key={blogId || `blog-${index}`}>
                            <td>
                              {resolveThumbnailUrl(blog) ? (
                                <img
                                  src={resolveThumbnailUrl(blog)}
                                  alt={blog.title}
                                  className="list-thumbnail"
                                />
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>{blog.title}</td>
                            <td>{blog.category || "-"}</td>
                            <td>{blog.isPublished ? "Yayında" : "Taslak"}</td>
                            <td className="action-buttons">
                              <button
                                type="button"
                                onClick={() => handleEditClick(blog)}
                                className="edit-btn"
                              >
                                <EditRoundedIcon
                                  className="btn-icon"
                                  fontSize="inherit"
                                />
                                <span>Düzenle</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(blogId)}
                                className="delete-btn"
                              >
                                <DeleteRoundedIcon
                                  className="btn-icon"
                                  fontSize="inherit"
                                />
                                <span>Sil</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan="5">Gösterilecek blog yazısı bulunamadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {blogs.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(blogs.length / itemsPerPage)}
                itemsPerPage={itemsPerPage}
                totalItems={blogs.length}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(newItemsPerPage) => {
                  setItemsPerPage(newItemsPerPage);
                  setCurrentPage(1);
                }}
              />
            )}
          </>
        )}
      </div>

      {/* JSON Upload Modal */}
      {isJsonModalOpen && (
        <div
          className="json-modal-overlay"
          onClick={() => setIsJsonModalOpen(false)}
        >
          <div className="json-modal" onClick={(e) => e.stopPropagation()}>
            <div className="json-modal-header">
              <h2>JSON ile Blog Yükle</h2>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(true)}
                className="template-btn"
              >
                <CodeRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>JSON Şablonunu Gör</span>
              </button>
              <button
                type="button"
                onClick={() => setIsJsonModalOpen(false)}
                className="modal-close-btn"
              >
                <CloseRoundedIcon fontSize="inherit" />
              </button>
            </div>
            <div className="json-modal-body">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="JSON verilerini buraya yapıştırın..."
                rows={15}
                className="json-textarea"
              />
            </div>
            <div className="json-modal-footer">
              <button
                type="button"
                onClick={handleJsonSubmit}
                disabled={loading || !jsonInput.trim()}
                className="submit-btn"
              >
                <UploadFileRoundedIcon
                  className="btn-icon"
                  fontSize="inherit"
                />
                <span>{loading ? "Yükleniyor..." : "JSON'u Yükle"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsJsonModalOpen(false);
                  setJsonInput("");
                }}
                className="cancel-btn"
              >
                <CloseRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>İptal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Template Modal */}
      {isTemplateModalOpen && (
        <div
          className="json-modal-overlay"
          onClick={() => setIsTemplateModalOpen(false)}
        >
          <div
            className="json-modal template-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="json-modal-header">
              <h2>JSON Şablonu</h2>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="modal-close-btn"
              >
                <CloseRoundedIcon fontSize="inherit" />
              </button>
            </div>
            <div className="json-modal-body">
              <p className="template-description">
                Blog yazısı eklemek için aşağıdaki JSON formatını kullanın:
              </p>
              <pre className="json-template-code">
                <code>{JSON.stringify(jsonTemplate, null, 2)}</code>
              </pre>
              <div className="template-info">
                <h3>Alan Açıklamaları:</h3>
                <ul>
                  <li>
                    <strong>title</strong>: Blog başlığı (zorunlu)
                  </li>
                  <li>
                    <strong>content</strong>: Blog içeriği - Markdown formatında
                    (zorunlu)
                  </li>
                  <li>
                    <strong>category</strong>: Kategori (opsiyonel) - örn:
                    geliştirme, teknoloji, tasarım
                  </li>
                  <li>
                    <strong>tags</strong>: Etiketler dizisi (opsiyonel)
                  </li>
                  <li>
                    <strong>thumbnailUrl</strong>: Kapak görseli URL'i
                    (opsiyonel)
                  </li>
                  <li>
                    <strong>isPublished</strong>: Yayın durumu - true veya false
                    (opsiyonel, varsayılan: false)
                  </li>
                </ul>
              </div>
            </div>
            <div className="json-modal-footer">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(jsonTemplate, null, 2)
                  );
                  alert("Şablon panoya kopyalandı!");
                }}
                className="submit-btn"
              >
                Şablonu Kopyala
              </button>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="cancel-btn"
              >
                <CloseRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>Kapat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogManagementPage;
