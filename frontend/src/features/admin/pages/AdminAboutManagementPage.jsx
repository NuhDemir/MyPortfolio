import { Save, RefreshCw } from "lucide-react";
import { ErrorMessage, Button } from "@shared";
import { useAdminAbout } from "../hooks/useAdminAbout";
import { AboutSummary } from "../components/about/AboutSummary";
import { AboutGeneralTab } from "../components/about/AboutGeneralTab";
import { AboutServicesTab } from "../components/about/AboutServicesTab";
import { AboutStatsTab } from "../components/about/AboutStatsTab";
import { AboutSEOTab } from "../components/about/AboutSEOTab";
import "../styles/admin-shared.css";
import "../styles/about-management.css";

const TABS = [
  { key: "general", label: "Genel" },
  { key: "services", label: "Servisler" },
  { key: "stats", label: "İstatistikler" },
  { key: "seo", label: "SEO" },
];

const AdminAboutManagementPage = () => {
  const {
    loading, saving, error, successMessage,
    formData, activeTab, setActiveTab,
    handleInputChange, handleSubmit, refresh,
    updateService, addService, removeService,
    addServiceTech, removeServiceTech,
    addServiceLink, removeServiceLink,
    updateStat, addStat, removeStat,
  } = useAdminAbout();

  return (
    <div className="admin-management-page">
      <div className="abt-page-header">
        <h1>About Yönetimi</h1>
        <div className="admin-actions-bar">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={refresh} disabled={loading || saving}>
            {loading ? "Yenileniyor..." : "Yenile"}
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      {successMessage && <div className="abt-success">{successMessage}</div>}

      <AboutSummary formData={formData} />

      <form onSubmit={handleSubmit} className="admin-form-container">
        <nav className="abt-tabs" role="tablist">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              className={`abt-tab-btn ${activeTab === key ? "abt-tab-btn--active" : ""}`}
              aria-selected={activeTab === key}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="abt-tab-content">
          {activeTab === "general" && <AboutGeneralTab formData={formData} onChange={handleInputChange} />}
          {activeTab === "services" && (
            <AboutServicesTab
              services={formData.services}
              onUpdate={updateService}
              onAdd={addService}
              onRemove={removeService}
              onAddTech={addServiceTech}
              onRemoveTech={removeServiceTech}
              onAddLink={addServiceLink}
              onRemoveLink={removeServiceLink}
            />
          )}
          {activeTab === "stats" && (
            <AboutStatsTab
              stats={formData.stats}
              onUpdate={updateStat}
              onAdd={addStat}
              onRemove={removeStat}
            />
          )}
          {activeTab === "seo" && <AboutSEOTab formData={formData} onChange={handleInputChange} />}
        </div>

        <div className="form-actions">
          <Button type="submit" variant="primary" icon={Save} disabled={saving || loading}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminAboutManagementPage;
