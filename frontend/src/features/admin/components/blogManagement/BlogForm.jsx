import { useState, useEffect } from "react";
import { Save, X, Image, ArrowLeft, Upload, Link2, Code, LayoutTemplate } from "lucide-react";

const BlogForm = ({ 
  editingId, 
  loading, 
  formData, 
  categories, 
  coverPreview, 
  coverMode, 
  coverUrl, 
  coverFile, 
  onInputChange, 
  onCoverFileChange, 
  onCoverUrlChange, 
  onCoverModeChange, 
  onClearCover, 
  onSubmit, 
  onCancel,
  setFormData
}) => {
  const [viewMode, setViewMode] = useState("form");
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");

  useEffect(() => {
    if (viewMode === "json") {
      setJsonInput(JSON.stringify(formData, null, 2));
      setJsonError("");
    }
  }, [viewMode, formData]);

  const handleJsonChange = (e) => {
    const val = e.target.value;
    setJsonInput(val);
    try {
      const parsed = JSON.parse(val);
      setJsonError("");
      if (setFormData) {
        setFormData(parsed);
      }
    } catch (err) {
      setJsonError("Geçersiz JSON formatı");
    }
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button type="button" className="admin-btn-icon" onClick={onCancel} title="Geri dön">
            <ArrowLeft size={18} />
          </button>
          <h2 style={{ margin: 0 }}>{editingId ? "Blog Yazısını Düzenle" : "Yeni Blog Yazısı Oluştur"}</h2>
        </div>
        
        <div className="res-cover-mode-tabs" style={{ margin: 0, padding: "4px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
          <button
            type="button"
            className={`res-cover-mode-btn ${viewMode === "form" ? "res-cover-mode-btn--active" : ""}`}
            onClick={() => setViewMode("form")}
            style={{ border: "none" }}
          >
            <LayoutTemplate size={14} /> Form
          </button>
          <button
            type="button"
            className={`res-cover-mode-btn ${viewMode === "json" ? "res-cover-mode-btn--active" : ""}`}
            onClick={() => setViewMode("json")}
            style={{ border: "none" }}
          >
            <Code size={14} /> JSON
          </button>
        </div>
      </div>

      {viewMode === "form" ? (
        <form onSubmit={onSubmit} className="admin-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Başlık</label>
              <input id="title" type="text" name="title" value={formData.title || ""} onChange={onInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="category">Kategori</label>
              <input id="category" name="category" list="blog-categories" value={formData.category || ""} onChange={onInputChange} placeholder="Örn: geliştirme" />
              <datalist id="blog-categories">
                {categories.map((option) => <option key={option} value={option} />)}
              </datalist>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">İçerik</label>
            <textarea id="content" name="content" rows="8" value={formData.content || ""} onChange={onInputChange} required />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="tags">Etiketler (virgülle ayırın)</label>
              <input id="tags" type="text" name="tags" value={formData.tags || ""} onChange={onInputChange} placeholder="tasarım, deneyim" />
            </div>
            <div className="form-group">
              <label>
                Kapak Görseli {editingId ? "(değiştirmek için yeni görsel seçin)" : ""}
              </label>

              {coverPreview && (
                <div className="res-cover-preview">
                  <img src={coverPreview} alt="Önizleme" />
                  <button type="button" className="res-cover-clear" onClick={onClearCover} aria-label="Görseli kaldır">
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="res-cover-mode-tabs">
                <button
                  type="button"
                  className={`res-cover-mode-btn ${coverMode === "url" ? "res-cover-mode-btn--active" : ""}`}
                  onClick={() => onCoverModeChange("url")}
                >
                  <Link2 size={14} /> URL
                </button>
                <button
                  type="button"
                  className={`res-cover-mode-btn ${coverMode === "file" ? "res-cover-mode-btn--active" : ""}`}
                  onClick={() => onCoverModeChange("file")}
                >
                  <Upload size={14} /> Dosya Yükle
                </button>
              </div>

              {coverMode === "url" ? (
                <input
                  type="url"
                  value={coverUrl}
                  onChange={onCoverUrlChange}
                  placeholder="https://example.com/image.jpg"
                  className="res-cover-url-input"
                />
              ) : (
                <div className="form-file-field">
                  <Image size={16} />
                  <input id="thumbnail" type="file" name="thumbnail" accept="image/*" onChange={onCoverFileChange} />
                  {coverFile && <span className="res-cover-file-name">{coverFile.name}</span>}
                </div>
              )}
            </div>
          </div>

          <label className="checkbox-group" htmlFor="isPublished">
            <input id="isPublished" type="checkbox" name="isPublished" checked={!!formData.isPublished} onChange={onInputChange} />
            <span>Yayınla</span>
            <span className="checkbox-group__state">
              {formData.isPublished ? "Yayında" : "Taslak"}
            </span>
          </label>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="admin-btn admin-btn--primary">
              <Save size={16} />
              {loading ? "Kaydediliyor..." : editingId ? "Güncelle" : "Kaydet"}
            </button>
            <button type="button" onClick={onCancel} className="admin-btn admin-btn--cancel">
              <X size={16} />
              İptal
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={onSubmit} className="admin-form" style={{ marginTop: "1rem" }}>
          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label htmlFor="json-editor" style={{ margin: 0 }}>
                JSON Düzenleyici
              </label>
              {jsonError && (
                <span style={{ color: "#ef4444", fontSize: "0.85rem", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>
                  <X size={14} /> {jsonError}
                </span>
              )}
            </div>
            <textarea
              id="json-editor"
              rows="16"
              value={jsonInput}
              onChange={handleJsonChange}
              spellCheck={false}
              style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                border: `1px solid ${jsonError ? "#ef4444" : "var(--border-color)"}`,
                color: "var(--text-primary)",
                borderRadius: "12px",
                padding: "1rem",
                fontSize: "0.9rem",
                lineHeight: "1.5",
                resize: "vertical",
                boxShadow: jsonError ? "0 0 0 1px #ef4444" : "inset 0 2px 4px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease"
              }}
            />
            <p style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", marginTop: "0.5rem" }}>
              * Burada yapılan değişiklikler form verisini anında günceller.
            </p>
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading || !!jsonError} className="admin-btn admin-btn--primary">
              <Save size={16} />
              {loading ? "Kaydediliyor..." : editingId ? "Güncelle" : "Kaydet"}
            </button>
            <button type="button" onClick={onCancel} className="admin-btn admin-btn--cancel">
              <X size={16} />
              İptal
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BlogForm;
