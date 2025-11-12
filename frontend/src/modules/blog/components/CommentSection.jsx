import { useState, useEffect } from "react";
import { commentService } from "../services/commentService";
import "./CommentSection.css";

function CommentSection({ resourceType = "Blog", resourceId, blogId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    content: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Use resourceId or fall back to blogId for backward compatibility
  const actualResourceId = resourceId || blogId;
  const actualResourceType = resourceId ? resourceType : "Blog";

  const fetchComments = async () => {
    if (!actualResourceId) return;

    try {
      setLoading(true);
      setBackendAvailable(true);
      const response = await commentService.getCommentsByResource(
        actualResourceType,
        actualResourceId
      );
      setComments(response.data || []);
    } catch (err) {
      console.error("Yorumlar yüklenirken hata:", err);
      // Check if it's a network error (backend not available)
      if (err.code === "ERR_NETWORK" || err.message.includes("Network Error")) {
        setBackendAvailable(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (actualResourceId) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualResourceId, actualResourceType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError("Lütfen adınızı girin");
      return false;
    }
    if (!formData.email.trim()) {
      setFormError("Lütfen e-posta adresinizi girin");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError("Geçerli bir e-posta adresi girin");
      return false;
    }
    if (!formData.content.trim()) {
      setFormError("Lütfen yorum yazın");
      return false;
    }
    if (formData.content.length > 2000) {
      setFormError("Yorum 2000 karakterden uzun olamaz");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const commentData = {
        resourceType: actualResourceType,
        resourceId: actualResourceId,
        // Backward compatibility
        ...(actualResourceType === "Blog" && { blogId: actualResourceId }),
        author: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          website: formData.website.trim() || undefined,
        },
        content: formData.content.trim(),
      };

      await commentService.createComment(commentData);

      setFormSuccess(
        "Yorumunuz başarıyla gönderildi! Onaylandıktan sonra görünecektir."
      );
      setFormData({ name: "", email: "", website: "", content: "" });
      setShowForm(false);

      // Refresh comments after 2 seconds
      setTimeout(() => {
        fetchComments();
        setFormSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Yorum gönderilirken hata:", err);
      setFormError(
        err.response?.data?.message || "Yorum gönderilirken bir hata oluştu"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderComments = (parentComments) => {
    return parentComments.map((comment) => (
      <div key={comment._id} className="comment-item">
        <div className="comment-item__header">
          <div className="comment-item__author">
            <strong>{comment.author?.name || "Anonim"}</strong>
            {comment.author?.website && (
              <a
                href={comment.author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="comment-item__website"
              >
                🔗 Website
              </a>
            )}
          </div>
          <time className="comment-item__date">
            {formatDate(comment.createdAt)}
          </time>
        </div>
        <div className="comment-item__content">
          {comment.content}
          {comment.isEdited && (
            <span
              className="comment-item__edited"
              title={`Düzenlendi: ${formatDate(comment.editedAt)}`}
            >
              (düzenlendi)
            </span>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            {renderComments(comment.replies)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <section className="comment-section">
      <div className="comment-section__header">
        <h2>Yorumlar</h2>
        <span className="comment-section__count">
          {comments.length} {comments.length === 1 ? "Yorum" : "Yorum"}
        </span>
      </div>

      {/* Backend offline message */}
      {!backendAvailable && (
        <div
          style={{
            padding: "1.5rem",
            background: "var(--color-surface, #f5f5f5)",
            border: "2px solid var(--color-line, #e0e0e0)",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", opacity: 0.8 }}>
            🔌 Backend sunucusuna bağlanılamıyor
          </p>
          <small style={{ opacity: 0.6, fontSize: "0.875rem" }}>
            Yorum sistemi şu anda kullanılamıyor. Lütfen daha sonra tekrar
            deneyin.
          </small>
        </div>
      )}

      {formSuccess && (
        <div className="comment-form__success">{formSuccess}</div>
      )}

      {!showForm ? (
        <button
          className="comment-section__add-btn"
          onClick={() => setShowForm(true)}
          disabled={!backendAvailable}
          style={
            !backendAvailable ? { opacity: 0.5, cursor: "not-allowed" } : {}
          }
        >
          <span className="comment-section__add-icon">-</span>
          Hadi sen de bir yorum bırak!
        </button>
      ) : (
        <div className="comment-form-container">
          <h3>Yorum Yaz</h3>
          <form onSubmit={handleSubmit} className="comment-form">
            {formError && (
              <div className="comment-form__error">{formError}</div>
            )}

            <div className="comment-form__grid">
              <div className="comment-form__group">
                <label htmlFor="name">
                  Adınız <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ad Soyad"
                  maxLength={100}
                  required
                />
              </div>

              <div className="comment-form__group">
                <label htmlFor="email">
                  E-posta <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  maxLength={100}
                  required
                />
              </div>

              <div className="comment-form__group comment-form__group--full">
                <label htmlFor="website">Website (Opsiyonel)</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  maxLength={200}
                />
              </div>
            </div>

            <div className="comment-form__group">
              <label htmlFor="content">
                Yorumunuz <span className="required">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Düşüncelerinizi paylaşın..."
                rows={6}
                maxLength={2000}
                required
              />
              <small className="comment-form__char-count">
                {formData.content.length} / 2000 karakter
              </small>
            </div>

            <div className="comment-form__actions">
              <button
                type="button"
                className="comment-form__cancel"
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                  setFormData({
                    name: "",
                    email: "",
                    website: "",
                    content: "",
                  });
                }}
              >
                İptal
              </button>
              <button
                type="submit"
                className="comment-form__submit"
                disabled={submitting}
              >
                {submitting ? "Gönderiliyor..." : "Yorumu Gönder"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="comment-list">
        {loading ? (
          <div className="comment-list__loading">Yorumlar yükleniyor...</div>
        ) : comments.length === 0 ? (
          <div className="comment-list__empty">
            Henüz yorum yapılmamış. İlk yorumu sen yap!
          </div>
        ) : (
          renderComments(comments)
        )}
      </div>
    </section>
  );
}

export default CommentSection;
