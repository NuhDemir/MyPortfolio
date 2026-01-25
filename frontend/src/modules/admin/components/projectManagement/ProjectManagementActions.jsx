import AddRoundedIcon from "@mui/icons-material/AddRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

const ProjectManagementActions = ({
  onNewProject,
  onOpenJson,
  onExportJson,
}) => {
  return (
    <div className="admin-action-buttons">
      <button
        type="button"
        onClick={onNewProject}
        className="admin-add-new-btn"
      >
        <AddRoundedIcon className="btn-icon" fontSize="inherit" />
        <span>Yeni Proje</span>
      </button>
      <button type="button" onClick={onOpenJson} className="admin-json-btn">
        <UploadFileRoundedIcon className="btn-icon" fontSize="inherit" />
        <span>JSON ile Yükle</span>
      </button>
      <button type="button" onClick={onExportJson} className="admin-export-btn">
        <DownloadRoundedIcon className="btn-icon" fontSize="inherit" />
        <span>JSON Dışa Aktar</span>
      </button>
    </div>
  );
};

export default ProjectManagementActions;
