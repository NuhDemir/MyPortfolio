import { Plus, Upload, Download } from "lucide-react";

const BlogManagementActions = ({ onNew, onOpenJson, onExportJson, loading }) => {
  return (
    <div className="admin-actions-bar">
      <button type="button" onClick={onNew} className="admin-btn admin-btn--primary">
        <Plus size={16} />
        Yeni Blog Yazisi
      </button>
      <button type="button" onClick={onOpenJson} className="admin-btn admin-btn--secondary">
        <Upload size={16} />
        JSON ile Yukle
      </button>
      <button type="button" onClick={onExportJson} className="admin-btn admin-btn--secondary" disabled={loading}>
        <Download size={16} />
        JSON Disa Aktar
      </button>
    </div>
  );
};

export default BlogManagementActions;
