import { Plus, Upload } from "lucide-react";

const ResourceManagementActions = ({ onNew, onJsonImport }) => {
  return (
    <div className="admin-actions-bar">
      <button type="button" className="admin-btn admin-btn--primary" onClick={onNew}>
        <Plus size={16} />
        Yeni Kaynak
      </button>
      <button type="button" className="admin-btn admin-btn--secondary" onClick={onJsonImport}>
        <Upload size={16} />
        JSON ile Ekle
      </button>
    </div>
  );
};

export default ResourceManagementActions;
