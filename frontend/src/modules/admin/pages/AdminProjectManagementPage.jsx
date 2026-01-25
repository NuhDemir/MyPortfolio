import { useCallback, useEffect, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
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
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

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

  const resolveProjectId = (project) => project?.id ?? project?._id ?? "";

  const handleEditClick = (project) => {
    const projectId = resolveProjectId(project);
    if (!projectId) {
      setError("Seçili proje kimliği alınamadı.");
      return;
    }

    resetForm();
    setEditingId(projectId);
    setFormData({
      title: project.title ?? "",
      description: project.description ?? "",
      githubUrl: project.githubUrl ?? "",
      liveUrl: project.liveUrl ?? "",
      tags: Array.isArray(project.tags)
        ? project.tags.join(", ")
        : (project.tags ?? ""),
    });
    setImagePreview(project.imageUrl ?? null);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
      return;
    }
    if (!id) {
      setError("Silinecek projenin kimliği bulunamadı.");
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
        "Yeni proje oluşturmak için bir resim dosyası seçmek zorunludur.",
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

  const normalizeTags = (value) => {
    if (Array.isArray(value)) {
      return value.map((tag) => String(tag).trim()).filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    return [];
  };

  const normalizeTechnologies = (value) => {
    if (!value) return undefined;

    if (typeof value === "string") {
      return value;
    }

    if (Array.isArray(value)) {
      if (value.every((entry) => typeof entry === "string")) {
        return value.map((name) => ({ name }));
      }
      return value;
    }

    return value;
  };

  const normalizeProjectJson = (input) => {
    const project = input && typeof input === "object" ? input : {};

    const submission = {
      title: project.title ?? project.name ?? "",
      description: project.description ?? project.summary ?? "",
      githubUrl: project.githubUrl ?? project.github ?? "",
      liveUrl: project.liveUrl ?? project.url ?? "",
      imageUrl: project.imageUrl ?? project.image ?? project.thumbnailUrl ?? "",
      tags: normalizeTags(project.tags),
      category: project.category,
      featured: project.featured,
      status: project.status,
      priority: project.priority,
      difficulty: project.difficulty,
      duration: project.duration,
      startDate: project.startDate,
      endDate: project.endDate,
      technologies: normalizeTechnologies(project.technologies),
      metrics: project.metrics,
      client: project.client,
      seo: project.seo,
    };

    Object.keys(submission).forEach((key) => {
      if (submission[key] === undefined) {
        delete submission[key];
      }
    });

    if (!Array.isArray(submission.tags) || submission.tags.length === 0) {
      delete submission.tags;
    }

    if (!submission.githubUrl) {
      delete submission.githubUrl;
    }

    if (!submission.liveUrl) {
      delete submission.liveUrl;
    }

    return submission;
  };

  const handleJsonFilePick = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setJsonInput(text);
    } catch {
      setError("JSON dosyası okunamadı.");
    } finally {
      event.target.value = "";
    }
  };

  const handleJsonSubmit = async () => {
    try {
      setError(null);
      const parsedData = JSON.parse(jsonInput);
      const items = Array.isArray(parsedData) ? parsedData : [parsedData];

      if (items.length === 0) {
        setError("JSON içinde en az 1 proje olmalıdır.");
        return;
      }

      setLoading(true);

      let createdCount = 0;
      for (let index = 0; index < items.length; index += 1) {
        const submission = normalizeProjectJson(items[index]);

        if (!submission.title || !submission.description) {
          setError(
            `JSON'daki proje #${index + 1} için en az 'title' ve 'description' alanları gereklidir.`,
          );
          return;
        }

        if (!submission.imageUrl) {
          setError(
            `JSON'daki proje #${index + 1} için 'imageUrl' alanı zorunludur.`,
          );
          return;
        }

        await createProject(submission);
        createdCount += 1;
      }

      setIsJsonModalOpen(false);
      setJsonInput("");
      await fetchProjects();

      alert(`${createdCount} proje JSON ile eklendi!`);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Geçersiz JSON formatı. Lütfen formatı kontrol edin.");
      } else {
        setError(err.message || "JSON yüklenirken bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  const jsonTemplate = [
    {
      title: "Proje Başlığı",
      description: "Projeyi 2-3 cümle ile özetleyin...",
      imageUrl: "https://example.com/project-cover.jpg",
      githubUrl: "https://github.com/kullanici/proje",
      liveUrl: "https://example.com",
      tags: ["react", "api", "ui"],
      category: "web",
      featured: false,
      status: "active",
    },
  ];

  return (
    <div className="admin-management-page">
      <h1>Proje Yönetimi</h1>
      {error && <ErrorMessage message={error} />}
      {!isFormVisible && (
        <div className="admin-action-buttons">
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
          <button
            type="button"
            onClick={() => setIsJsonModalOpen(true)}
            className="admin-json-btn"
          >
            <UploadFileRoundedIcon className="btn-icon" fontSize="inherit" />
            <span>JSON ile Yükle</span>
          </button>
        </div>
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
                  projects.map((project, index) => {
                    const projectId = resolveProjectId(project);
                    return (
                      <tr key={projectId || `project-${index}`}>
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
                            onClick={() => handleDeleteClick(projectId)}
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
        )}
      </div>

      {/* JSON Upload Modal */}
      {isJsonModalOpen && (
        <div
          className="json-modal-overlay"
          onClick={() => setIsJsonModalOpen(false)}
        >
          <div className="json-modal" onClick={(e) => e.stopPropagation()}>
            <div className="json-modal-header">
              <h2>JSON ile Proje Yükle</h2>
              <label className="template-btn" style={{ cursor: "pointer" }}>
                <UploadFileRoundedIcon
                  className="btn-icon"
                  fontSize="inherit"
                />
                <span>Dosya Seç</span>
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={handleJsonFilePick}
                  style={{ display: "none" }}
                />
              </label>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(true)}
                className="template-btn"
              >
                <CodeRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>JSON Şablonunu Gör</span>
              </button>
              <button
                type="button"
                onClick={() => setIsJsonModalOpen(false)}
                className="modal-close-btn"
              >
                <CloseRoundedIcon fontSize="inherit" />
              </button>
            </div>
            <div className="json-modal-body">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="JSON verilerini buraya yapıştırın (tek proje objesi veya proje dizisi)..."
                rows={15}
                className="json-textarea"
              />
            </div>
            <div className="json-modal-footer">
              <button
                type="button"
                onClick={handleJsonSubmit}
                disabled={loading || !jsonInput.trim()}
                className="submit-btn"
              >
                <UploadFileRoundedIcon
                  className="btn-icon"
                  fontSize="inherit"
                />
                <span>{loading ? "Yükleniyor..." : "JSON'u Yükle"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsJsonModalOpen(false);
                  setJsonInput("");
                }}
                className="cancel-btn"
              >
                <CloseRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>İptal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Template Modal */}
      {isTemplateModalOpen && (
        <div
          className="json-modal-overlay"
          onClick={() => setIsTemplateModalOpen(false)}
        >
          <div
            className="json-modal template-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="json-modal-header">
              <h2>JSON Şablonu</h2>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="modal-close-btn"
              >
                <CloseRoundedIcon fontSize="inherit" />
              </button>
            </div>
            <div className="json-modal-body">
              <p className="template-description">
                Proje eklemek için aşağıdaki JSON formatını kullanın. Tek obje
                veya dizi gönderebilirsiniz.
              </p>
              <pre className="json-template-code">
                <code>{JSON.stringify(jsonTemplate, null, 2)}</code>
              </pre>
              <div className="template-info">
                <h3>Alan Açıklamaları:</h3>
                <ul>
                  <li>
                    <strong>title</strong>: Proje başlığı (zorunlu)
                  </li>
                  <li>
                    <strong>description</strong>: Proje açıklaması (zorunlu)
                  </li>
                  <li>
                    <strong>imageUrl</strong>: Proje görseli URL'i (zorunlu)
                  </li>
                  <li>
                    <strong>githubUrl</strong>: GitHub URL (opsiyonel)
                  </li>
                  <li>
                    <strong>liveUrl</strong>: Canlı URL (opsiyonel)
                  </li>
                  <li>
                    <strong>tags</strong>: Etiket dizisi veya virgüllü string
                    (opsiyonel)
                  </li>
                  <li>
                    <strong>category</strong>:
                    web/mobile/desktop/api/library/other (opsiyonel)
                  </li>
                  <li>
                    <strong>featured</strong>: true/false (opsiyonel)
                  </li>
                  <li>
                    <strong>status</strong>: active/archived/draft/maintenance
                    (opsiyonel)
                  </li>
                </ul>
              </div>
            </div>
            <div className="json-modal-footer">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(jsonTemplate, null, 2),
                  );
                  alert("Şablon panoya kopyalandı!");
                }}
                className="submit-btn"
              >
                Şablonu Kopyala
              </button>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="cancel-btn"
              >
                <CloseRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>Kapat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectManagementPage;
