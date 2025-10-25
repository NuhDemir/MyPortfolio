import { useCallback, useEffect, useMemo, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ErrorMessage from "@shared/ui/ErrorMessage.jsx";
import LoadingSpinner from "@shared/ui/LoadingSpinner.jsx";
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

  const handleEditClick = (blog) => {
    resetForm();
    setEditingId(blog._id);
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

  return (
    <div className="admin-management-page">
      <h1>Blog Yönetimi</h1>
      {error && <ErrorMessage message={error} />}
      {!isFormVisible && (
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
                  blogs.map((blog) => (
                    <tr key={blog._id}>
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
                          onClick={() => handleDeleteClick(blog._id)}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">Gösterilecek blog yazısı bulunamadı.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogManagementPage;
