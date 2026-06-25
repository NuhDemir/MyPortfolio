import { Plus, Upload, Download } from "lucide-react";

const ProjectManagementActions = ({ onNewProject, onOpenJson, onExportJson }) => {
  return (
    <div className="admin-actions-bar">
      <button type="button" onClick={onNewProject} className="admin-btn admin-btn--primary">
        <Plus size={16} />
        Yeni Proje
      </button>
      <button type="button" onClick={onOpenJson} className="admin-btn admin-btn--secondary">
        <Upload size={16} />
        JSON ile Yukle
      </button>
      <button type="button" onClick={onExportJson} className="admin-btn admin-btn--secondary">
        <Download size={16} />
        JSON Disa Aktar
      </button>
    </div>
  );
};

export default ProjectManagementActions;
