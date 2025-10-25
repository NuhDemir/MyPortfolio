import { useCallback, useEffect, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import ErrorMessage from "@shared/ui/ErrorMessage.jsx";
import LoadingSpinner from "@shared/ui/LoadingSpinner.jsx";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../services/projectService";
import "../styles/management.css";

const initialFormState = {
  title: "",
  description: "",
  githubUrl: "",
  liveUrl: "",
  tags: "",
};

const AdminProjectManagementPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setIsFormVisible(false);
    setEditingId(null);
    setFormData(initialFormState);
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setError(null);
  };

  const handleEditClick = (project) => {
    resetForm();
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      tags: project.tags.join(", "),
    });
    setImagePreview(project.imageUrl);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
      return;
    }
    setLoading(true);
    try {
      await deleteProject(id);
      await fetchProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editingId && !imageFile) {
      setError(
        "Yeni proje oluşturmak için bir resim dosyası seçmek zorunludur."
      );
      return;
    }

    setLoading(true);
    setError(null);
    const dataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      dataToSubmit.append(key, value);
    });

    if (imageFile) {
      dataToSubmit.append("image", imageFile);
    }

    try {
      if (editingId) {
        await updateProject(editingId, dataToSubmit);
      } else {
        await createProject(dataToSubmit);
      }
      resetForm();
      await fetchProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-management-page">
      <h1>Proje Yönetimi</h1>
      {error && <ErrorMessage message={error} />}
      {!isFormVisible && (
        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsFormVisible(true);
          }}
          className="admin-add-new-btn"
        >
          <AddRoundedIcon className="btn-icon" fontSize="inherit" />
          <span>Yeni Proje</span>
        </button>
      )}
      {isFormVisible && (
        <div className="admin-form-container">
          <h2>{editingId ? "Projeyi Düzenle" : "Yeni Proje Oluştur"}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Başlık</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="tags">Etiketler (virgülle ayırın)</label>
                <input
                  id="tags"
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="ui, react, performans"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Açıklama</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-grid">
              <div className="form-group form-group--file">
                <label htmlFor="image">
                  Proje Görseli{" "}
                  {editingId ? "(değiştirmek için yeni dosya seçin)" : ""}
                </label>
                <div className="form-file-field">
                  <ImageOutlinedIcon className="btn-icon" fontSize="inherit" />
                  <input
                    id="image"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Önizleme"
                    className="image-preview"
                  />
                )}
              </div>
              <div className="form-group">
                <label htmlFor="githubUrl">GitHub URL</label>
                <div className="form-field-with-icon">
                  <LinkRoundedIcon className="btn-icon" fontSize="inherit" />
                  <input
                    id="githubUrl"
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/kullanici/proje"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="liveUrl">Canlı URL</label>
                <div className="form-field-with-icon">
                  <LinkRoundedIcon className="btn-icon" fontSize="inherit" />
                  <input
                    id="liveUrl"
                    type="url"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleInputChange}
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading} className="submit-btn">
                <SaveRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>{loading ? "Kaydediliyor..." : "Kaydet"}</span>
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                <CloseRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>İptal</span>
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="admin-list-container">
        <h2>Mevcut Projeler</h2>
        {loading && projects.length === 0 ? (
          <LoadingSpinner message="Projeler yükleniyor..." />
        ) : null}
        {!loading && !error && (
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
                  projects.map((project) => (
                    <tr key={project._id}>
                      <td>
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="list-thumbnail"
                        />
                      </td>
                      <td>{project.title}</td>
                      <td className="action-buttons">
                        <button
                          type="button"
                          onClick={() => handleEditClick(project)}
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
                          onClick={() => handleDeleteClick(project._id)}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">Gösterilecek proje bulunamadı.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjectManagementPage;
