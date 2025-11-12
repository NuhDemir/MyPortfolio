import { useState, useEffect } from "react";
import { commentService } from "../services/commentService";
import Pagination from "@shared/ui/Pagination";
import "../styles/management.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleIcon from "@mui/icons-material/Article";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import CloseIcon from "@mui/icons-material/Close";
import CommentIcon from "@mui/icons-material/Comment";
import PendingIcon from "@mui/icons-material/Pending";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReportIcon from "@mui/icons-material/Report";

const STATUS_LABELS = {
  pending: "Beklemede",
  approved: "Onaylandı",
  rejected: "Reddedildi",
  spam: "Spam",
};

const STATUS_COLORS = {
  pending: "#ffa500",
  approved: "#4caf50",
  rejected: "#f44336",
  spam: "#9e9e9e",
};

function AdminCommentManagementPage() {
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    id: null,
    authorName: "",
  });

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sort: "-createdAt",
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await commentService.getAllComments(params);

      setComments(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalComments(response.total || 0);
    } catch (err) {
      console.error("Yorumlar yüklenirken hata:", err);
      setError("Yorumlar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await commentService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error("İstatistikler yüklenirken hata:", err);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, statusFilter]);

  const handleStatusChange = async (id, action) => {
    try {
      setError("");

      switch (action) {
        case "approve":
          await commentService.approveComment(id);
          break;
        case "reject":
          await commentService.rejectComment(id);
          break;
        case "spam":
          await commentService.markAsSpam(id);
          break;
      }

      await fetchComments();
      await fetchStats();
    } catch (err) {
      console.error("Durum güncellenirken hata:", err);
      setError("Durum güncellenirken bir hata oluştu");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    try {
      setError("");
      await commentService.deleteComment(deleteModal.id);
      setDeleteModal({ show: false, id: null, authorName: "" });

      // If current page becomes empty, go to previous page
      if (comments.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await fetchComments();
      }

      await fetchStats();
    } catch (err) {
      console.error("Yorum silinirken hata:", err);
      setError("Yorum silinirken bir hata oluştu");
      setDeleteModal({ show: false, id: null, authorName: "" });
    }
  };

  const openDeleteModal = (id, authorName) => {
    setDeleteModal({ show: true, id, authorName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, id: null, authorName: "" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="admin-management">
      <div className="admin-management__header">
        <h1>
          <CommentIcon
            style={{ marginRight: "12px", verticalAlign: "middle" }}
          />
          Yorum Yönetimi
        </h1>

        {stats && (
          <div className="admin-stats">
            <div className="admin-stats__item">
              <CommentIcon style={{ marginRight: "8px", opacity: 0.7 }} />
              <span className="admin-stats__label">Toplam</span>
              <span className="admin-stats__value">{stats.total || 0}</span>
            </div>
            <div className="admin-stats__item">
              <PendingIcon style={{ marginRight: "8px", opacity: 0.7 }} />
              <span className="admin-stats__label">Beklemede</span>
              <span className="admin-stats__value admin-stats__value--pending">
                {stats.pending || 0}
              </span>
            </div>
            <div className="admin-stats__item">
              <ThumbUpIcon style={{ marginRight: "8px", opacity: 0.7 }} />
              <span className="admin-stats__label">Onaylı</span>
              <span className="admin-stats__value admin-stats__value--approved">
                {stats.approved || 0}
              </span>
            </div>
            <div className="admin-stats__item">
              <ThumbDownIcon style={{ marginRight: "8px", opacity: 0.7 }} />
              <span className="admin-stats__label">Reddedildi</span>
              <span className="admin-stats__value admin-stats__value--rejected">
                {stats.rejected || 0}
              </span>
            </div>
            <div className="admin-stats__item">
              <ReportIcon style={{ marginRight: "8px", opacity: 0.7 }} />
              <span className="admin-stats__label">Spam</span>
              <span className="admin-stats__value admin-stats__value--spam">
                {stats.spam || 0}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="admin-management__controls">
        <div className="admin-filter">
          <label htmlFor="status-filter">Durum:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="admin-filter__select"
          >
            <option value="all">Tümü</option>
            <option value="pending">Beklemede</option>
            <option value="approved">Onaylandı</option>
            <option value="rejected">Reddedildi</option>
            <option value="spam">Spam</option>
          </select>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Yükleniyor...</div>
      ) : comments.length === 0 ? (
        <div className="admin-empty">Henüz yorum bulunmuyor</div>
      ) : (
        <>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Yazar</th>
                  <th className="admin-table__hide-mobile">E-posta</th>
                  <th>İçerik</th>
                  <th className="admin-table__hide-mobile">Blog</th>
                  <th>Durum</th>
                  <th className="admin-table__hide-mobile">Tarih</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment._id}>
                    <td>
                      <div className="admin-table__author">
                        <div className="admin-table__author-name">
                          {comment.author?.name || "Anonim"}
                        </div>
                        {comment.author?.website && (
                          <a
                            href={comment.author.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-table__author-website"
                          >
                            <LanguageIcon
                              style={{
                                fontSize: "14px",
                                marginRight: "4px",
                                verticalAlign: "middle",
                              }}
                            />
                            {new URL(comment.author.website).hostname}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="admin-table__hide-mobile">
                      <a
                        href={`mailto:${comment.author?.email}`}
                        className="admin-table__email"
                      >
                        <EmailIcon
                          style={{
                            fontSize: "16px",
                            marginRight: "6px",
                            verticalAlign: "middle",
                          }}
                        />
                        {comment.author?.email || "-"}
                      </a>
                    </td>
                    <td>
                      <div className="admin-table__content">
                        {truncateText(comment.content)}
                        {comment.isEdited && (
                          <span
                            className="admin-table__edited-badge"
                            title={`Düzenlendi: ${formatDate(
                              comment.editedAt
                            )}`}
                          >
                            <EditIcon
                              style={{
                                fontSize: "12px",
                                marginRight: "4px",
                                verticalAlign: "middle",
                              }}
                            />
                            (düzenlendi)
                          </span>
                        )}
                        {comment.parentId && (
                          <span className="admin-table__reply-badge">
                            <ReplyIcon
                              style={{
                                fontSize: "12px",
                                marginRight: "4px",
                                verticalAlign: "middle",
                              }}
                            />
                            Yanıt
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="admin-table__hide-mobile">
                      {comment.resourceId ? (
                        <div className="admin-table__resource">
                          <span className="admin-table__resource-type">
                            {comment.resourceType === "Blog" ? (
                              <ArticleIcon
                                style={{
                                  fontSize: "16px",
                                  marginRight: "6px",
                                  verticalAlign: "middle",
                                }}
                              />
                            ) : (
                              <WorkIcon
                                style={{
                                  fontSize: "16px",
                                  marginRight: "6px",
                                  verticalAlign: "middle",
                                }}
                              />
                            )}
                            {comment.resourceType}
                          </span>
                          <div className="admin-table__resource-title">
                            {comment.resourceId?.title ||
                              comment.blogId?.title ||
                              "Başlıksız"}
                          </div>
                        </div>
                      ) : comment.blogId ? (
                        <div className="admin-table__blog">
                          <ArticleIcon
                            style={{
                              fontSize: "16px",
                              marginRight: "6px",
                              verticalAlign: "middle",
                            }}
                          />
                          {comment.blogId.title || "Başlıksız"}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <span
                        className="admin-status-badge"
                        style={{
                          backgroundColor: STATUS_COLORS[comment.status],
                        }}
                      >
                        {STATUS_LABELS[comment.status]}
                      </span>
                    </td>
                    <td className="admin-table__hide-mobile">
                      {formatDate(comment.createdAt)}
                    </td>
                    <td>
                      <div className="admin-actions">
                        {comment.status !== "approved" && (
                          <button
                            onClick={() =>
                              handleStatusChange(comment._id, "approve")
                            }
                            className="admin-btn admin-btn--approve"
                            title="Onayla"
                          >
                            <CheckCircleIcon style={{ fontSize: "18px" }} />
                          </button>
                        )}
                        {comment.status !== "rejected" && (
                          <button
                            onClick={() =>
                              handleStatusChange(comment._id, "reject")
                            }
                            className="admin-btn admin-btn--reject"
                            title="Reddet"
                          >
                            <CancelIcon style={{ fontSize: "18px" }} />
                          </button>
                        )}
                        {comment.status !== "spam" && (
                          <button
                            onClick={() =>
                              handleStatusChange(comment._id, "spam")
                            }
                            className="admin-btn admin-btn--spam"
                            title="Spam olarak işaretle"
                          >
                            <BlockIcon style={{ fontSize: "18px" }} />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            openDeleteModal(
                              comment._id,
                              comment.author?.name || "Anonim"
                            )
                          }
                          className="admin-btn admin-btn--delete"
                          title="Sil"
                        >
                          <DeleteIcon style={{ fontSize: "18px" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalComments}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newItemsPerPage) => {
              setItemsPerPage(newItemsPerPage);
              setCurrentPage(1);
            }}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="admin-modal-overlay" onClick={closeDeleteModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>
                <DeleteIcon
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Yorumu Sil
              </h2>
              <button onClick={closeDeleteModal} className="admin-modal__close">
                <CloseIcon />
              </button>
            </div>
            <div className="admin-modal__body">
              <p>
                <strong>{deleteModal.authorName}</strong> kullanıcısının
                yorumunu silmek istediğinizden emin misiniz?
              </p>
              <p className="admin-modal__warning">
                Bu işlem geri alınamaz ve yanıt yorumları da silinecektir.
              </p>
            </div>
            <div className="admin-modal__footer">
              <button
                onClick={closeDeleteModal}
                className="admin-btn admin-btn--cancel"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="admin-btn admin-btn--delete"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCommentManagementPage;
