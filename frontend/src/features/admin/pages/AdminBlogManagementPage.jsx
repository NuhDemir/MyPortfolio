import { useState, useCallback } from "react";
import { ErrorMessage } from "@shared";
import BlogStatsBar from "../components/blogManagement/BlogStatsBar.jsx";
import BlogFilters from "../components/blogManagement/BlogFilters.jsx";
import BlogManagementActions from "../components/blogManagement/BlogManagementActions.jsx";
import BlogForm from "../components/blogManagement/BlogForm.jsx";
import BlogCardGrid from "../components/blogManagement/BlogCardGrid.jsx";
import BlogPreviewModal from "../components/blogManagement/BlogPreviewModal.jsx";
import JsonTemplateModal from "../components/common/JsonTemplateModal.jsx";
import JsonUploadModal from "../components/common/JsonUploadModal.jsx";
import BlogStatisticsPanel from "../components/blogManagement/BlogStatisticsPanel.jsx";
import { useAdminBlogs } from "../hooks/useAdminBlogs";
import { useBlogEditor } from "../hooks/useBlogEditor";
import { useBlogJsonImport } from "../hooks/useBlogJsonImport";
import { exportBlogsJson } from "../services/blogService";
import { downloadFromAxiosBlobResponse } from "../utils/download";
import { showAdminToast } from "../utils/adminToast";
import {
  BLOG_JSON_TEMPLATE as blogJsonTemplate,
  BLOG_JSON_TEMPLATE_INFO as blogJsonTemplateInfoItems,
  validateBlogJson,
} from "../utils/blogJsonValidator.js";

const blogJsonUploadTitle = "JSON ile Blog Yükle";
const blogJsonUploadPlaceholder = "JSON verilerini buraya yapıştırın...";
const blogJsonTemplateDescription = "Blog yazısı eklemek için aşağıdaki JSON formatını kullanın:";
import "../styles/admin-shared.css";

const INITIAL_FILTERS = { query: "", tag: "", status: "", isPublished: "", dateFrom: "", dateTo: "", sort: "newest" };

const AdminBlogManagementPage = () => {
  const {
    blogs,
    allBlogs,
    loading,
    error,
    hasMore,
    stats,
    tags,
    setError,
    fetchBlogs,
    loadMore,
    handleDelete,
    handleToggleStatus,
    handleToggleFeatured,
    handleDuplicate,
    handleCopySlug,
    setLoading,
  } = useAdminBlogs();

  const editor = useBlogEditor({ fetchBlogs, setError, setLoading });
  const jsonImport = useBlogJsonImport({ fetchBlogs, setError, setLoading });
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [activeTab, setActiveTab] = useState("management"); // "management" | "statistics"

  const filteredBlogs = blogs
    .filter((b) => {
      if (filters.query && !(b.title || "").toLowerCase().includes(filters.query.toLowerCase())) return false;
      if (filters.tag && !(Array.isArray(b.tags) ? b.tags : []).includes(filters.tag)) return false;
      if (filters.status && b.status !== filters.status) return false;
      if (filters.isPublished === "true" && !b.isPublished) return false;
      if (filters.isPublished === "false" && b.isPublished) return false;
      if (filters.dateFrom && new Date(b.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(b.createdAt) > new Date(filters.dateTo)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case "oldest": return new Date(a.createdAt) - new Date(b.createdAt);
        case "views": return (b.views || 0) - (a.views || 0);
        case "readingTime": return (b.readingTime || 0) - (a.readingTime || 0);
        default: return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleExportJson = async () => {
    setLoading(true);
    try {
      const response = await exportBlogsJson();
      downloadFromAxiosBlobResponse(response, "blogs-export.json");
    } catch (err) {
      setError(err?.message || "Blog yazıları dışa aktarılırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTemplate = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(blogJsonTemplate, null, 2));
    showAdminToast("Şablon panoya kopyalandı!", { type: "success" });
  }, []);

  return (
    <div className="admin-management-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ margin: 0 }}>Blog Yönetimi</h1>
        
        <div className="res-cover-mode-tabs" style={{ margin: 0, padding: "4px", background: "var(--bg-secondary)", borderRadius: "12px" }}>
          <button
            type="button"
            className={`res-cover-mode-btn ${activeTab === "management" ? "res-cover-mode-btn--active" : ""}`}
            onClick={() => setActiveTab("management")}
            style={{ border: "none", borderRadius: "8px", padding: "8px 20px", fontWeight: "500" }}
          >
            İçerik Yönetimi
          </button>
          <button
            type="button"
            className={`res-cover-mode-btn ${activeTab === "statistics" ? "res-cover-mode-btn--active" : ""}`}
            onClick={() => setActiveTab("statistics")}
            style={{ border: "none", borderRadius: "8px", padding: "8px 20px", fontWeight: "500" }}
          >
            İstatistikler & Analiz
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {activeTab === "management" ? (
        <>
          <BlogStatsBar stats={stats} />

          {!editor.isFormVisible && (
            <>
              <BlogManagementActions
                onNew={editor.startNew}
                onOpenJson={jsonImport.openJsonModal}
                onExportJson={handleExportJson}
                loading={loading}
              />
              <BlogFilters filters={filters} onChange={setFilters} tags={tags} />
            </>
          )}

          {editor.isFormVisible && (
            <BlogForm
              editingId={editor.editingId}
              loading={loading}
              formData={editor.formData}
              categories={editor.categories}
              coverPreview={editor.coverPreview}
              coverMode={editor.coverMode}
              coverUrl={editor.coverUrl}
              coverFile={editor.coverFile}
              onInputChange={editor.handleInputChange}
              onCoverFileChange={editor.handleCoverFileChange}
              onCoverUrlChange={editor.handleCoverUrlChange}
              onCoverModeChange={editor.handleCoverModeChange}
              onClearCover={editor.handleClearCover}
              onSubmit={editor.handleSubmit}
              onCancel={editor.resetForm}
              setFormData={editor.setFormData}
            />
          )}

          <BlogCardGrid
            blogs={filteredBlogs}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onEdit={editor.startEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onToggleFeatured={handleToggleFeatured}
            onPreview={setPreviewBlog}
            onDuplicate={handleDuplicate}
            onCopySlug={handleCopySlug}
          />

          <BlogPreviewModal
            blog={previewBlog}
            isOpen={!!previewBlog}
            onClose={() => setPreviewBlog(null)}
          />

          <JsonUploadModal
            isOpen={jsonImport.isJsonModalOpen}
            loading={loading}
            title={blogJsonUploadTitle}
            jsonInput={jsonImport.jsonInput}
            onChangeJsonInput={jsonImport.setJsonInput}
            onClose={jsonImport.closeJsonModal}
            onSubmit={jsonImport.handleJsonSubmit}
            onOpenTemplate={() => jsonImport.setIsTemplateModalOpen(true)}
            placeholder={blogJsonUploadPlaceholder}
            validator={validateBlogJson}
          />

          <JsonTemplateModal
            isOpen={jsonImport.isTemplateModalOpen}
            onClose={() => jsonImport.setIsTemplateModalOpen(false)}
            template={blogJsonTemplate}
            onCopy={handleCopyTemplate}
            description={blogJsonTemplateDescription}
            infoItems={blogJsonTemplateInfoItems}
          />
        </>
      ) : (
        <BlogStatisticsPanel 
          blogs={allBlogs || []} 
          onRefresh={() => fetchBlogs(true)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default AdminBlogManagementPage;
