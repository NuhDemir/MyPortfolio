import AddRoundedIcon from "@mui/icons-material/AddRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

const BlogManagementActions = ({
  onNew,
  onOpenJson,
  onExportJson,
  loading,
}) => {
  return (
    <div className="admin-action-buttons">
      <button type="button" onClick={onNew} className="admin-add-new-btn">
        <AddRoundedIcon className="btn-icon" fontSize="inherit" />
        <span>Yeni Blog Yazısı</span>
      </button>
      <button type="button" onClick={onOpenJson} className="admin-json-btn">
        <UploadFileRoundedIcon className="btn-icon" fontSize="inherit" />
        <span>JSON ile Yükle</span>
      </button>
      <button
        type="button"
        onClick={onExportJson}
        className="admin-export-btn"
        disabled={loading}
      >
        <DownloadRoundedIcon className="btn-icon" fontSize="inherit" />
        <span>JSON Dışa Aktar</span>
      </button>
    </div>
  );
};

export default BlogManagementActions;
