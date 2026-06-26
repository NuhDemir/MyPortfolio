import { Trash2, X } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, authorName, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="comment-delete-overlay" onClick={onCancel}>
      <div className="comment-delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comment-delete-modal__header">
          <h2 className="comment-delete-modal__title">
            <Trash2 size={18} />
            <span>Yorumu Sil</span>
          </h2>
          <button onClick={onCancel} className="admin-btn-icon" title="Kapat">
            <X size={18} />
          </button>
        </div>
        <div className="comment-delete-modal__body">
          <p>
            <strong>{authorName}</strong> kullanıcısının yorumunu silmek istediğinizden emin misiniz?
          </p>
          <p className="comment-delete-modal__warning">
            Bu işlem geri alınamaz ve yanıt yorumları da silinecektir.
          </p>
        </div>
        <div className="comment-delete-modal__footer">
          <button onClick={onCancel} className="admin-btn admin-btn--secondary">
            İptal
          </button>
          <button onClick={onConfirm} className="admin-btn admin-btn--danger">
            <Trash2 size={16} />
            <span>Sil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
