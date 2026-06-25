import { Save, X, Image, Upload, Link2, Link, ArrowLeft } from "lucide-react";
import TechStackEditor from "./TechStackEditor.jsx";
import CaseStudyEditor from "./CaseStudyEditor.jsx";

const ProjectForm = ({ editingId, loading, formData, coverPreview, coverMode, coverUrl, coverFile, onInputChange, onCoverFileChange, onCoverUrlChange, onCoverModeChange, onClearCover, onSubmit, onCancel }) => {
  if (!formData) return null;

  return (
    <div className="admin-form-container">
      <div className="admin-form-header">
        <button type="button" className="admin-btn-icon" onClick={onCancel} title="Geri don">
          <ArrowLeft size={18} />
        </button>
        <h2>{editingId ? "Projeyi Duzenle" : "Yeni Proje Olustur"}</h2>
      </div>

      <form onSubmit={onSubmit} className="admin-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="metadataTitle">Baslik</label>
            <input id="metadataTitle" type="text" name="metadataTitle" value={formData.metadataTitle} onChange={onInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="slug">Slug</label>
            <input id="slug" type="text" name="slug" value={formData.slug} onChange={onInputChange} placeholder="digital-obesity" />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="metadataTagline">Tagline</label>
            <input id="metadataTagline" type="text" name="metadataTagline" value={formData.metadataTagline} onChange={onInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="category">Kategori</label>
            <input id="category" type="text" name="category" value={formData.category} onChange={onInputChange} placeholder="web / mobile / desktop" />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="metadataCreatedAt">Olusturma Tarihi</label>
            <input id="metadataCreatedAt" type="date" name="metadataCreatedAt" value={formData.metadataCreatedAt} onChange={onInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="metadataStatus">Durum</label>
            <input id="metadataStatus" type="text" name="metadataStatus" value={formData.metadataStatus} onChange={onInputChange} placeholder="Live / Development / Beta" />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="metadataRole">Rol</label>
            <input id="metadataRole" type="text" name="metadataRole" value={formData.metadataRole} onChange={onInputChange} placeholder="Frontend Developer" />
          </div>
          <div className="form-group">
            <label htmlFor="metadataPlatform">Platform</label>
            <input id="metadataPlatform" type="text" name="metadataPlatform" value={formData.metadataPlatform} onChange={onInputChange} placeholder="Web Application" />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="id">ID</label>
            <input id="id" type="text" name="id" value={formData.id} onChange={onInputChange} placeholder="project-digital-obesity" />
          </div>
          <div className="form-group form-group--checkbox">
            <label>
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={onInputChange} />
              One Cikan (Featured)
            </label>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="tags">Etiketler (virgulle ayirin)</label>
            <input id="tags" type="text" name="tags" value={formData.tags} onChange={onInputChange} placeholder="ui, react, performans" />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>
              Proje Gorseli {editingId ? "(degistirmek icin yeni gorsel secin)" : ""}
            </label>

            {coverPreview && (
              <div className="res-cover-preview">
                <img src={coverPreview} alt="Onizleme" />
                <button type="button" className="res-cover-clear" onClick={onClearCover} aria-label="Gorseli kaldir">
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="res-cover-mode-tabs">
              <button type="button" className={`res-cover-mode-btn ${coverMode === "url" ? "res-cover-mode-btn--active" : ""}`} onClick={() => onCoverModeChange("url")}>
                <Link2 size={14} /> URL
              </button>
              <button type="button" className={`res-cover-mode-btn ${coverMode === "file" ? "res-cover-mode-btn--active" : ""}`} onClick={() => onCoverModeChange("file")}>
                <Upload size={14} /> Dosya Yukle
              </button>
            </div>

            {coverMode === "url" ? (
              <input type="url" value={coverUrl} onChange={onCoverUrlChange} placeholder="https://example.com/image.jpg" className="res-cover-url-input" />
            ) : (
              <div className="form-file-field">
                <Image size={16} />
                <input id="image" type="file" name="image" accept="image/*" onChange={onCoverFileChange} />
                {coverFile && <span className="res-cover-file-name">{coverFile.name}</span>}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="visualsThumbnailUrl">Thumbnail URL</label>
            <div className="form-field-with-icon">
              <Link size={14} />
              <input id="visualsThumbnailUrl" type="text" name="visualsThumbnailUrl" value={formData.visualsThumbnailUrl} onChange={onInputChange} placeholder="/assets/... veya https://..." />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="visualsHeroVideoUrl">Hero Video URL</label>
            <div className="form-field-with-icon">
              <Link size={14} />
              <input id="visualsHeroVideoUrl" type="text" name="visualsHeroVideoUrl" value={formData.visualsHeroVideoUrl} onChange={onInputChange} placeholder="/assets/.../preview.mp4" />
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="visualsPrimaryColor">Primary Color</label>
            <input id="visualsPrimaryColor" type="text" name="visualsPrimaryColor" value={formData.visualsPrimaryColor} onChange={onInputChange} placeholder="#0cb845" />
          </div>
          <div className="form-group">
            <label htmlFor="linksLiveDemo">Live Demo</label>
            <div className="form-field-with-icon">
              <Link size={14} />
              <input id="linksLiveDemo" type="url" name="linksLiveDemo" value={formData.linksLiveDemo} onChange={onInputChange} placeholder="https://..." />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="linksGithub">GitHub</label>
            <div className="form-field-with-icon">
              <Link size={14} />
              <input id="linksGithub" type="url" name="linksGithub" value={formData.linksGithub} onChange={onInputChange} placeholder="https://github.com/..." />
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="linksFigma">Figma</label>
            <div className="form-field-with-icon">
              <Link size={14} />
              <input id="linksFigma" type="url" name="linksFigma" value={formData.linksFigma} onChange={onInputChange} placeholder="https://figma.com/..." />
            </div>
          </div>
        </div>

        <TechStackEditor jsonText={formData.techStackJson} onChangeJsonText={(value) => onInputChange({ target: { name: "techStackJson", value, type: "text" } })} />
        <CaseStudyEditor jsonText={formData.caseStudyJson} onChangeJsonText={(value) => onInputChange({ target: { name: "caseStudyJson", value, type: "text" } })} />

        <div className="form-actions">
          <button type="submit" disabled={loading} className="admin-btn admin-btn--primary">
            <Save size={16} />
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button type="button" onClick={onCancel} className="admin-btn admin-btn--cancel">
            <X size={16} />
            Iptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
