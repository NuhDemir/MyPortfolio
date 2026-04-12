import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ErrorMessage from "@shared/ui/ErrorMessage.jsx";
import { useAdminAbout } from "../hooks/useAdminAbout";
import "../styles/management.css";
import "../styles/about-management.css";

const AdminAboutManagementPage = () => {
  const {
    loading,
    saving,
    error,
    successMessage,
    formData,
    handleInputChange,
    handleSubmit,
    refresh,
  } = useAdminAbout();

  const statCount = (() => {
    try {
      const parsed = JSON.parse(formData.statsJson || "[]");
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  })();

  const serviceCount = (() => {
    try {
      const parsed = JSON.parse(formData.servicesJson || "[]");
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  })();

  return (
    <div className="admin-management-page">
      <h1>About Yonetimi</h1>

      {error ? <ErrorMessage message={error} /> : null}
      {successMessage ? <p className="about-admin-success">{successMessage}</p> : null}

      <div className="admin-action-buttons">
        <button
          type="button"
          className="admin-json-btn"
          onClick={refresh}
          disabled={loading || saving}
        >
          <RefreshRoundedIcon className="btn-icon" fontSize="inherit" />
          <span>{loading ? "Yenileniyor..." : "Veriyi Yenile"}</span>
        </button>
      </div>

      <div className="admin-list-container about-admin-summary">
        <h2>Model Ozet</h2>
        <div className="about-admin-summary__grid">
          <div>
            <strong>Stat karti adedi</strong>
            <span>{statCount}</span>
          </div>
          <div>
            <strong>Servis karti adedi</strong>
            <span>{serviceCount}</span>
          </div>
          <div>
            <strong>GitHub kullanici</strong>
            <span>{formData.githubUsername || "-"}</span>
          </div>
          <div>
            <strong>Durum</strong>
            <span>{formData.isActive ? "Aktif" : "Pasif"}</span>
          </div>
        </div>
      </div>

      <div className="admin-form-container">
        <h2>About Icerigini Duzenle</h2>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="badge">Badge</label>
              <input
                id="badge"
                name="badge"
                value={formData.badge}
                onChange={handleInputChange}
                placeholder="About"
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">Baslik</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subtitle">Alt Baslik</label>
            <textarea
              id="subtitle"
              name="subtitle"
              rows="3"
              value={formData.subtitle}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="githubUsername">GitHub Username</label>
              <input
                id="githubUsername"
                name="githubUsername"
                value={formData.githubUsername}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="githubProfileUrl">GitHub Profil URL</label>
              <input
                id="githubProfileUrl"
                name="githubProfileUrl"
                type="url"
                value={formData.githubProfileUrl}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group form-group--json">
            <label htmlFor="statsJson">Stats JSON</label>
            <textarea
              id="statsJson"
              name="statsJson"
              rows="10"
              value={formData.statsJson}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group form-group--json">
            <label htmlFor="servicesJson">Services JSON</label>
            <textarea
              id="servicesJson"
              name="servicesJson"
              rows="16"
              value={formData.servicesJson}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="seoTitle">SEO Baslik</label>
              <input
                id="seoTitle"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="seoKeywords">SEO Anahtar Kelimeler</label>
              <input
                id="seoKeywords"
                name="seoKeywords"
                value={formData.seoKeywords}
                onChange={handleInputChange}
                placeholder="about, portfolio, full stack"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="seoDescription">SEO Aciklama</label>
            <textarea
              id="seoDescription"
              name="seoDescription"
              rows="3"
              value={formData.seoDescription}
              onChange={handleInputChange}
            />
          </div>

          <label className="checkbox-group" htmlFor="isActive">
            <input
              id="isActive"
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <span>About Aktif</span>
            <span className="checkbox-group__state">
              {formData.isActive ? "Yayinda" : "Pasif"}
            </span>
          </label>

          <div className="form-actions">
            <button type="submit" disabled={saving || loading} className="submit-btn">
              <SaveRoundedIcon className="btn-icon" fontSize="inherit" />
              <span>{saving ? "Kaydediliyor..." : "Kaydet"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAboutManagementPage;
