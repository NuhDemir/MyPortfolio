import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import LoadingSpinner from "@shared/ui/LoadingSpinner.jsx";
import {
  getDisplayThumbnail,
  getDisplayTitle,
  resolveProjectId,
} from "../../utils/projectManagement";

const ProjectsTable = ({ projects, loading, error, onEdit, onDelete }) => {
  return (
    <div className="admin-list-container">
      <h2>Mevcut Projeler</h2>

      {loading && projects.length === 0 ? (
        <LoadingSpinner message="Projeler yükleniyor..." />
      ) : null}

      {!loading && !error ? (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Görsel</th>
                <th>Başlık</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map((project, index) => {
                  const projectId = resolveProjectId(project);
                  const displayTitle = getDisplayTitle(project);
                  const displayThumb = getDisplayThumbnail(project);

                  return (
                    <tr key={projectId || `project-${index}`}>
                      <td>
                        <img
                          src={displayThumb || ""}
                          alt={displayTitle}
                          className="list-thumbnail"
                        />
                      </td>
                      <td>{displayTitle}</td>
                      <td className="action-buttons">
                        <button
                          type="button"
                          onClick={() => onEdit(project)}
                          className="edit-btn"
                        >
                          <EditRoundedIcon
                            className="btn-icon"
                            fontSize="inherit"
                          />
                          <span>Düzenle</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(projectId)}
                          className="delete-btn"
                        >
                          <DeleteRoundedIcon
                            className="btn-icon"
                            fontSize="inherit"
                          />
                          <span>Sil</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3">Gösterilecek proje bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default ProjectsTable;
