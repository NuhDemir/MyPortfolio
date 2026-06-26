import { useState, useMemo } from "react";
import {
  CheckCircle2, XCircle, ShieldAlert, Trash2, FileText, Briefcase,
  Mail, Globe, Pencil, CornerDownRight, Loader2, MessageSquareOff,
} from "lucide-react";
import { ErrorMessage } from "@shared";
import DeleteConfirmModal from "./DeleteConfirmModal.jsx";
import { formatCommentDate } from "../../utils/commentUtils";
import "./CommentTable.css";

const STATUS_STYLES = {
  pending: { bg: "var(--ds-warning, #f59e0b)", color: "#fff" },
  approved: { bg: "var(--ds-success, #10b981)", color: "#fff" },
  rejected: { bg: "var(--ds-danger, #ef4444)", color: "#fff" },
  spam: { bg: "var(--ds-muted)", color: "#fff" },
};

const STATUS_LABELS = {
  pending: "Beklemede",
  approved: "Onaylandı",
  rejected: "Reddedildi",
  spam: "Spam",
};

const ResourceIcon = ({ type }) => {
  if (type === "Blog") return <FileText size={14} />;
  if (type === "Project") return <Briefcase size={14} />;
  return <FileText size={14} />;
};

const CommentRow = ({ comment, onStatusChange, onDelete }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const authorName = comment.author?.name || "Anonim";
  const authorEmail = comment.author?.email;
  const authorWebsite = comment.author?.website;
  const resourceType = comment.resourceType || "Blog";
  const resourceTitle = comment.resourceId?.title || comment.blogId?.title || "Başlıksız";
  const status = comment.status || "pending";

  const truncatedContent = comment.content?.length > 120
    ? comment.content.slice(0, 120) + "..."
    : comment.content;

  return (
    <tr className="comment-row">
      <td className="comment-row__author">
        <div className="comment-author">
          <span className="comment-author__name">{authorName}</span>
          {authorEmail && (
            <a href={`mailto:${authorEmail}`} className="comment-author__email" title={authorEmail}>
              <Mail size={13} />
            </a>
          )}
          {authorWebsite && (
            <a
              href={authorWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="comment-author__website"
              title={authorWebsite}
            >
              <Globe size={13} />
            </a>
          )}
        </div>
      </td>
      <td className="comment-row__content">
        <div className="comment-content">
          <p className="comment-content__text">
            {showFullContent ? comment.content : truncatedContent}
            {comment.content?.length > 120 && (
              <button
                className="comment-content__toggle"
                onClick={() => setShowFullContent((v) => !v)}
              >
                {showFullContent ? "Daralt" : "Devamı"}
              </button>
            )}
          </p>
          <div className="comment-content__meta">
            {comment.isEdited && (
              <span className="comment-meta-badge" title={`Düzenlendi: ${formatCommentDate(comment.editedAt)}`}>
                <Pencil size={10} />
                <span>düzenlendi</span>
              </span>
            )}
            {comment.parentId && (
              <span className="comment-meta-badge comment-meta-badge--reply">
                <CornerDownRight size={10} />
                <span>Yanıt</span>
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="comment-row__resource">
        {comment.resourceId || comment.blogId ? (
          <div className="comment-resource">
            <span className="comment-resource__type">
              <ResourceIcon type={resourceType} />
              <span>{resourceType}</span>
            </span>
            <span className="comment-resource__title">{resourceTitle}</span>
          </div>
        ) : (
          <span className="comment-resource__empty">—</span>
        )}
      </td>
      <td className="comment-row__status">
        <span
          className="admin-badge"
          style={{
            backgroundColor: STATUS_STYLES[status]?.bg,
            color: STATUS_STYLES[status]?.color,
            borderColor: "transparent",
          }}
        >
          {STATUS_LABELS[status] || status}
        </span>
      </td>
      <td className="comment-row__date">
        {formatCommentDate(comment.createdAt)}
      </td>
      <td className="comment-row__actions">
        <div className="admin-table-actions">
          {status !== "approved" && (
            <button
              onClick={() => onStatusChange(comment._id, "approve")}
              className="admin-btn-icon"
              title="Onayla"
            >
              <CheckCircle2 size={16} />
            </button>
          )}
          {status !== "rejected" && (
            <button
              onClick={() => onStatusChange(comment._id, "reject")}
              className="admin-btn-icon admin-btn-icon--danger"
              title="Reddet"
            >
              <XCircle size={16} />
            </button>
          )}
          {status !== "spam" && (
            <button
              onClick={() => onStatusChange(comment._id, "spam")}
              className="admin-btn-icon"
              title="Spam olarak işaretle"
            >
              <ShieldAlert size={16} />
            </button>
          )}
          <button
            onClick={() => onDelete(comment._id, authorName)}
            className="admin-btn-icon admin-btn-icon--danger"
            title="Sil"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const CommentTable = ({ comments, loading, error, onStatusChange, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const rows = useMemo(
    () =>
      comments.map((comment) => (
        <CommentRow
          key={comment._id}
          comment={comment}
          onStatusChange={onStatusChange}
          onDelete={(id, name) => setDeleteTarget({ id, name })}
        />
      )),
    [comments, onStatusChange]
  );

  if (loading) {
    return (
      <div className="admin-empty-state">
        <Loader2 size={20} className="comment-table__spinner" />
        <span>Yorumlar yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (comments.length === 0) {
    return (
      <div className="admin-empty-state">
        <MessageSquareOff size={24} style={{ opacity: 0.4 }} />
        <span>Henüz yorum bulunmuyor</span>
      </div>
    );
  }

  return (
    <>
      <div className="admin-table-wrapper">
        <table className="admin-table comment-table">
          <thead>
            <tr>
              <th>Yazar</th>
              <th>İçerik</th>
              <th>Kaynak</th>
              <th>Durum</th>
              <th>Tarih</th>
              <th style={{ width: 140 }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        authorName={deleteTarget?.name || ""}
        onConfirm={() => {
          if (deleteTarget) onDelete(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
};

export default CommentTable;
