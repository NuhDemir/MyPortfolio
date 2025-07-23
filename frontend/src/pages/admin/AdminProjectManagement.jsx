import React, { useState, useEffect, useCallback } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../services/projectService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import "./AdminManagement.css";

const initialFormState = {
  title: "",
  description: "",
  githubUrl: "",
  liveUrl: "",
  tags: "",
};

const AdminProjectManagement = () => {
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

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setIsFormVisible(false);
    setEditingId(null);
    setFormData(initialFormState);
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
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
    window.scrollTo(0, 0);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Bu projeyi silmek istediğinizden emin misiniz?"))
      return;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId && !imageFile) {
      setError(
        "Yeni proje oluşturmak için bir resim dosyası seçmek zorunludur."
      );
      return;
    }

    setLoading(true);
    setError(null);
    const dataToSubmit = new FormData();
    Object.keys(formData).forEach((key) =>
      dataToSubmit.append(key, formData[key])
    );
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
          onClick={() => {
            resetForm();
            setIsFormVisible(true);
          }}
          className="admin-add-new-btn"
        >
          Yeni Proje Ekle
        </button>
      )}
      {isFormVisible && (
        <div className="admin-form-container">
          <h2>{editingId ? "Projeyi Düzenle" : "Yeni Proje Oluştur"}</h2>
          <form onSubmit={handleSubmit}>
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
            <div className="form-group">
              <label htmlFor="image">
                Proje Görseli{" "}
                {editingId ? "(Değiştirmek için yeni dosya seçin)" : ""}
              </label>
              <input
                id="image"
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
              />
              <br />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Önizleme"
                  className="image-preview"
                />
              )}
            </div>
            <div className="form-group">
              <label htmlFor="tags">Etiketler (virgülle ayırın)</label>
              <input
                id="tags"
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="githubUrl">GitHub URL</label>
              <input
                id="githubUrl"
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="liveUrl">Canlı URL</label>
              <input
                id="liveUrl"
                type="url"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                İptal
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
                          onClick={() => handleEditClick(project)}
                          className="edit-btn"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteClick(project._id)}
                          className="delete-btn"
                        >
                          Sil
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

export default AdminProjectManagement;
