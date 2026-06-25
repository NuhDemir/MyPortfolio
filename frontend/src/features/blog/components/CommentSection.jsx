import { useState, useEffect } from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AddCommentIcon from "@mui/icons-material/AddComment";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ReplyIcon from "@mui/icons-material/Reply";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
            <PersonIcon className="comment-item__author-icon" />
            <strong>{comment.author?.name || "Anonim"}</strong>
            {comment.author?.website && (
              <a
                href={comment.author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="comment-item__website"
              >
                <LanguageIcon className="comment-item__website-icon" />
                Website
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
              <EditNoteIcon className="comment-item__edited-icon" />
              (düzenlendi)
            </span>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            <ReplyIcon className="comment-replies__icon" />
            {renderComments(comment.replies)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <section className="comment-section">
      <div className="comment-section__header">
        <h2>
          <ChatBubbleOutlineIcon className="comment-section__header-icon" />
          Yorumlar
        </h2>
        <span className="comment-section__count">
          {comments.length} {comments.length === 1 ? "Yorum" : "Yorum"}
        </span>
      </div>

      {/* Backend offline message */}
      {!backendAvailable && (
        <div className="comment-section__offline">
          <CloudOffIcon className="comment-section__offline-icon" />
          <div>
            <p className="comment-section__offline-title">
              Backend sunucusuna bağlanılamıyor
            </p>
            <small className="comment-section__offline-text">
              Yorum sistemi şu anda kullanılamıyor. Lütfen daha sonra tekrar
              deneyin.
            </small>
          </div>
        </div>
      )}

      {formSuccess && (
        <div className="comment-form__success">
          <CheckCircleIcon className="comment-form__success-icon" />
          {formSuccess}
        </div>
      )}

      {!showForm ? (
        <button
          className="btn btn--primary btn--lg comment-section__add-btn"
          onClick={() => setShowForm(true)}
          disabled={!backendAvailable}
        >
          <AddCommentIcon className="btn__icon comment-section__add-icon" />
          Hadi sen de bir yorum bırak!
        </button>
      ) : (
        <div className="comment-form-container">
          <div className="comment-form__header">
            <h3>Yorum Yaz</h3>
            <button
              type="button"
              className="comment-form__close"
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
              aria-label="Formu kapat"
            >
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="comment-form">
            {formError && (
              <div className="comment-form__error">{formError}</div>
            )}

            <div className="comment-form__grid">
              <div className="comment-form__group">
                <label htmlFor="name">
                  <PersonIcon className="comment-form__label-icon" />
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
                  <EmailIcon className="comment-form__label-icon" />
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
                <label htmlFor="website">
                  <LanguageIcon className="comment-form__label-icon" />
                  Website (Opsiyonel)
                </label>
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
                <EditNoteIcon className="comment-form__label-icon" />
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
                className="btn btn--secondary btn--mobile-full"
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
                <CloseIcon className="btn__icon comment-form__btn-icon" />
                İptal
              </button>
              <button
                type="submit"
                className="btn btn--primary btn--mobile-full"
                disabled={submitting}
              >
                <SendIcon className="btn__icon comment-form__btn-icon" />
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
