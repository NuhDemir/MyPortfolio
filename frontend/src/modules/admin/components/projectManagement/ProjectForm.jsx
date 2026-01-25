import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import TechStackEditor from "./TechStackEditor";
import CaseStudyEditor from "./CaseStudyEditor";

const ProjectForm = ({
  editingId,
  loading,
  formData,
  imagePreview,
  onInputChange,
  onFileChange,
  onSubmit,
  onCancel,
}) => {
  if (!formData) return null;

  return (
    <div className="admin-form-container">
      <h2>{editingId ? "Projeyi Düzenle" : "Yeni Proje Oluştur"}</h2>

      <form onSubmit={onSubmit} className="admin-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="metadataTitle">Başlık (metadata.title)</label>
            <input
              id="metadataTitle"
              type="text"
              name="metadataTitle"
              value={formData.metadataTitle}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="slug">Slug</label>
            <input
              id="slug"
              type="text"
              name="slug"
              value={formData.slug}
              onChange={onInputChange}
              placeholder="digital-obesity"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="metadataTagline">Tagline (metadata.tagline)</label>
            <input
              id="metadataTagline"
              type="text"
              name="metadataTagline"
              value={formData.metadataTagline}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Kategori (opsiyonel)</label>
            <input
              id="category"
              type="text"
              name="category"
              value={formData.category}
              onChange={onInputChange}
              placeholder="web / mobile / desktop ..."
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="metadataCreatedAt">
              Oluşturma tarihi (metadata.createdAt)
            </label>
            <input
              id="metadataCreatedAt"
              type="date"
              name="metadataCreatedAt"
              value={formData.metadataCreatedAt}
              onChange={onInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="metadataStatus">Durum (metadata.status)</label>
            <input
              id="metadataStatus"
              type="text"
              name="metadataStatus"
              value={formData.metadataStatus}
              onChange={onInputChange}
              placeholder="Live / Development / Beta / Legacy"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="metadataRole">Rol (metadata.role)</label>
            <input
              id="metadataRole"
              type="text"
              name="metadataRole"
              value={formData.metadataRole}
              onChange={onInputChange}
              placeholder="Frontend Developer & UI Designer"
            />
          </div>

          <div className="form-group">
            <label htmlFor="metadataPlatform">
              Platform (metadata.platform)
            </label>
            <input
              id="metadataPlatform"
              type="text"
              name="metadataPlatform"
              value={formData.metadataPlatform}
              onChange={onInputChange}
              placeholder="Web Application"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="id">ID (opsiyonel)</label>
            <input
              id="id"
              type="text"
              name="id"
              value={formData.id}
              onChange={onInputChange}
              placeholder="project-digital-obesity"
            />
          </div>

          <div
            className="form-group"
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <label
              className="projects-filter-toggle"
              style={{ marginTop: "1.6rem" }}
            >
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={onInputChange}
              />
              <span>Featured (isFeatured)</span>
            </label>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="tags">Etiketler (virgülle ayırın)</label>
            <input
              id="tags"
              type="text"
              name="tags"
              value={formData.tags}
              onChange={onInputChange}
              placeholder="ui, react, performans"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group form-group--file">
            <label htmlFor="image">
              Proje görseli dosyası (opsiyonel)
              {editingId ? " (değiştirmek için yeni dosya seçin)" : ""}
            </label>
            <div className="form-file-field">
              <ImageOutlinedIcon className="btn-icon" fontSize="inherit" />
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={onFileChange}
              />
            </div>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Önizleme"
                className="image-preview"
              />
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="visualsThumbnailUrl">
              Thumbnail URL (visuals.thumbnailUrl)
            </label>
            <div className="form-field-with-icon">
              <LinkRoundedIcon className="btn-icon" fontSize="inherit" />
              <input
                id="visualsThumbnailUrl"
                type="text"
                name="visualsThumbnailUrl"
                value={formData.visualsThumbnailUrl}
                onChange={onInputChange}
                placeholder="/assets/projects/... veya https://..."
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="visualsHeroVideoUrl">
              Hero Video URL (visuals.heroVideoUrl)
            </label>
            <div className="form-field-with-icon">
              <LinkRoundedIcon className="btn-icon" fontSize="inherit" />
              <input
                id="visualsHeroVideoUrl"
                type="text"
                name="visualsHeroVideoUrl"
                value={formData.visualsHeroVideoUrl}
                onChange={onInputChange}
                placeholder="/assets/projects/.../preview.mp4"
              />
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="visualsPrimaryColor">
              Primary Color (visuals.primaryColor)
            </label>
            <input
              id="visualsPrimaryColor"
              type="text"
              name="visualsPrimaryColor"
              value={formData.visualsPrimaryColor}
              onChange={onInputChange}
              placeholder="#0cb845"
            />
          </div>

          <div className="form-group">
            <label htmlFor="linksLiveDemo">Live Demo (links.liveDemo)</label>
            <div className="form-field-with-icon">
              <LinkRoundedIcon className="btn-icon" fontSize="inherit" />
              <input
                id="linksLiveDemo"
                type="url"
                name="linksLiveDemo"
                value={formData.linksLiveDemo}
                onChange={onInputChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="linksGithub">GitHub (links.github)</label>
            <div className="form-field-with-icon">
              <LinkRoundedIcon className="btn-icon" fontSize="inherit" />
              <input
                id="linksGithub"
                type="url"
                name="linksGithub"
                value={formData.linksGithub}
                onChange={onInputChange}
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="linksFigma">Figma (links.figma)</label>
            <div className="form-field-with-icon">
              <LinkRoundedIcon className="btn-icon" fontSize="inherit" />
              <input
                id="linksFigma"
                type="url"
                name="linksFigma"
                value={formData.linksFigma}
                onChange={onInputChange}
                placeholder="https://figma.com/..."
              />
            </div>
          </div>
        </div>

        <TechStackEditor
          jsonText={formData.techStackJson}
          onChangeJsonText={(value) =>
            onInputChange({
              target: { name: "techStackJson", value, type: "text" },
            })
          }
        />

        <CaseStudyEditor
          jsonText={formData.caseStudyJson}
          onChangeJsonText={(value) =>
            onInputChange({
              target: { name: "caseStudyJson", value, type: "text" },
            })
          }
        />

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            <SaveRoundedIcon className="btn-icon" fontSize="inherit" />
            <span>{loading ? "Kaydediliyor..." : "Kaydet"}</span>
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            <CloseRoundedIcon className="btn-icon" fontSize="inherit" />
            <span>İptal</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
