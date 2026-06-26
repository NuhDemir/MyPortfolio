import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare, Send, X, User, Mail, Globe, Pencil,
  CornerDownRight, CloudOff, CircleCheck, ChevronDown,
} from "lucide-react";
import { commentService } from "../services/commentService";
import "./CommentSection.css";

const INITIAL_FORM = { name: "", email: "", website: "", content: "" };

const CommentSection = ({ resourceType = "Blog", resourceId, blogId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const actualResourceId = resourceId || blogId;
  const actualResourceType = resourceId ? resourceType : "Blog";

  const fetchComments = useCallback(async () => {
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
      if (err.code === "ERR_NETWORK" || String(err.message).includes("Network")) {
        setBackendAvailable(false);
      }
    } finally {
      setLoading(false);
    }
  }, [actualResourceId, actualResourceType]);

  useEffect(() => {
    if (actualResourceId) fetchComments();
  }, [fetchComments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) { setFormError("Adınızı girin"); return false; }
    if (!formData.email.trim()) { setFormError("E-posta adresinizi girin"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setFormError("Geçerli bir e-posta girin"); return false; }
    if (!formData.content.trim()) { setFormError("Yorumunuzu yazın"); return false; }
    if (formData.content.length > 2000) { setFormError("Yorum 2000 karakterden uzun olamaz"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await commentService.createComment({
        resourceType: actualResourceType,
        resourceId: actualResourceId,
        ...(actualResourceType === "Blog" && { blogId: actualResourceId }),
        author: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          website: formData.website.trim() || undefined,
        },
        content: formData.content.trim(),
      });
      setFormSuccess("Yorumunuz gönderildi. Onaylandıktan sonra görünecektir.");
      setFormData(INITIAL_FORM);
      setShowForm(false);
      setTimeout(() => {
        fetchComments();
        setFormSuccess("");
      }, 2000);
    } catch (err) {
      setFormError(err.response?.data?.message || "Yorum gönderilirken bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setFormError("");
    setFormData(INITIAL_FORM);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const renderComments = (items, depth = 0) =>
    items.map((comment) => (
      <div key={comment._id} className={`comment-thread ${depth > 0 ? "comment-thread--nested" : ""}`}>
        <article className="comment-entry">
          <div className="comment-entry__header">
            <div className="comment-entry__author">
              <span className="comment-entry__avatar">
                {(comment.author?.name || "A").charAt(0).toUpperCase()}
              </span>
              <div className="comment-entry__author-info">
                <strong>{comment.author?.name || "Anonim"}</strong>
                <time className="comment-entry__date">{formatDate(comment.createdAt)}</time>
              </div>
            </div>
            {comment.author?.website && (
              <a
                href={comment.author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="comment-entry__website"
                title={comment.author.website}
              >
                <Globe size={13} />
              </a>
            )}
          </div>

          <div className="comment-entry__body">
            <p>{comment.content}</p>
            {comment.isEdited && (
              <span className="comment-entry__edited" title={`Düzenlendi: ${formatDate(comment.editedAt)}`}>
                <Pencil size={10} />
                <span>düzenlendi</span>
              </span>
            )}
          </div>
        </article>

        {comment.replies?.length > 0 && (
          <div className="comment-thread__replies">
            {renderComments(comment.replies, depth + 1)}
          </div>
        )}
      </div>
    ));

  const commentCount = comments.length;

  return (
    <section className="comment-section">
      <div className="comment-section__header">
        <h2 className="comment-section__title">
          <MessageSquare size={20} className="comment-section__title-icon" />
          Yorumlar
        </h2>
        <span className="comment-section__badge">
          {commentCount} {commentCount === 1 ? "Yorum" : "Yorum"}
        </span>
      </div>

      {!backendAvailable && (
        <div className="comment-offline">
          <CloudOff size={18} />
          <span>Yorum sistemi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.</span>
        </div>
      )}

      {formSuccess && (
        <div className="comment-toast comment-toast--success">
          <CircleCheck size={16} />
          <span>{formSuccess}</span>
        </div>
      )}

      {backendAvailable && (
        <div className={`comment-form-area ${showForm ? "comment-form-area--open" : ""}`}>
          {!showForm ? (
            <button
              className="comment-trigger"
              onClick={() => setShowForm(true)}
            >
              <MessageSquare size={18} />
              <span>Hadi sen de bir yorum bırak!</span>
              <ChevronDown size={16} className="comment-trigger__chevron" />
            </button>
          ) : (
            <div className="comment-form">
              <div className="comment-form__top">
                <h3 className="comment-form__heading">Yorum Yaz</h3>
                <button type="button" className="comment-form__close" onClick={closeForm} aria-label="Kapat">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {formError && <div className="comment-form__error">{formError}</div>}

                <div className="comment-form__grid">
                  <div className="comment-form__field">
                    <label htmlFor="cmt-name">
                      <User size={14} />
                      Adınız <span className="comment-form__required">*</span>
                    </label>
                    <input
                      id="cmt-name" name="name" type="text"
                      value={formData.name} onChange={handleInputChange}
                      placeholder="Ad Soyad" maxLength={100} required
                    />
                  </div>

                  <div className="comment-form__field">
                    <label htmlFor="cmt-email">
                      <Mail size={14} />
                      E-posta <span className="comment-form__required">*</span>
                    </label>
                    <input
                      id="cmt-email" name="email" type="email"
                      value={formData.email} onChange={handleInputChange}
                      placeholder="email@example.com" maxLength={100} required
                    />
                  </div>

                  <div className="comment-form__field comment-form__field--full">
                    <label htmlFor="cmt-website">
                      <Globe size={14} />
                      Website <span className="comment-form__optional">(opsiyonel)</span>
                    </label>
                    <input
                      id="cmt-website" name="website" type="url"
                      value={formData.website} onChange={handleInputChange}
                      placeholder="https://example.com" maxLength={200}
                    />
                  </div>
                </div>

                <div className="comment-form__field">
                  <label htmlFor="cmt-content">
                    <Pencil size={14} />
                    Yorumunuz <span className="comment-form__required">*</span>
                  </label>
                  <textarea
                    id="cmt-content" name="content"
                    value={formData.content} onChange={handleInputChange}
                    placeholder="Düşüncelerinizi paylaşın..."
                    rows={5} maxLength={2000} required
                  />
                  <span className="comment-form__count">
                    {formData.content.length}/2000
                  </span>
                </div>

                <div className="comment-form__actions">
                  <button type="button" className="comment-btn comment-btn--ghost" onClick={closeForm}>
                    İptal
                  </button>
                  <button type="submit" className="comment-btn comment-btn--primary" disabled={submitting}>
                    <Send size={15} />
                    <span>{submitting ? "Gönderiliyor..." : "Gönder"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      <div className="comment-list">
        {loading ? (
          <p className="comment-list__state">Yorumlar yükleniyor...</p>
        ) : comments.length === 0 ? (
          <p className="comment-list__state comment-list__state--empty">
            Henüz yorum yapılmamış. İlk yorumu sen yap!
          </p>
        ) : (
          renderComments(comments)
        )}
      </div>
    </section>
  );
};

export default CommentSection;
