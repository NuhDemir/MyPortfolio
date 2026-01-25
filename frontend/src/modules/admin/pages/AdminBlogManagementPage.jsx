import { useCallback, useState } from "react";
import ErrorMessage from "@shared/ui/ErrorMessage.jsx";
import BlogForm from "../components/blogManagement/BlogForm.jsx";
import BlogManagementActions from "../components/blogManagement/BlogManagementActions.jsx";
import BlogsTable from "../components/blogManagement/BlogsTable.jsx";
import JsonTemplateModal from "../components/common/JsonTemplateModal.jsx";
import JsonUploadModal from "../components/common/JsonUploadModal.jsx";
import { useAdminBlogs } from "../hooks/useAdminBlogs";
import { useBlogEditor } from "../hooks/useBlogEditor";
import { useBlogJsonImport } from "../hooks/useBlogJsonImport";
import { exportBlogsJson } from "../services/blogService";
import { downloadFromAxiosBlobResponse } from "../utils/download";
import { showAdminToast } from "../utils/adminToast";
import {
  blogJsonTemplate,
  blogJsonTemplateDescription,
  blogJsonTemplateInfoItems,
  blogJsonUploadPlaceholder,
  blogJsonUploadTitle,
} from "../utils/blogManagement";
import "../styles/management.css";

const AdminBlogManagementPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    blogs,
    loading,
    error,
    setError,
    fetchBlogs,
    handleDelete,
    setLoading,
  } = useAdminBlogs();

  const editor = useBlogEditor({ fetchBlogs, setError, setLoading });
  const jsonImport = useBlogJsonImport({ fetchBlogs, setError, setLoading });

  const handleExportJson = async () => {
    setLoading(true);
    try {
      const response = await exportBlogsJson();
      downloadFromAxiosBlobResponse(response, "blogs-export.json");
    } catch (err) {
      setError(
        err?.message || "Blog yazıları dışa aktarılırken bir hata oluştu.",
      );
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
      <h1>Blog Yönetimi</h1>
      {error && <ErrorMessage message={error} />}

      {!editor.isFormVisible ? (
        <BlogManagementActions
          onNew={editor.startNew}
          onOpenJson={jsonImport.openJsonModal}
          onExportJson={handleExportJson}
          loading={loading}
        />
      ) : null}

      {editor.isFormVisible ? (
        <BlogForm
          editingId={editor.editingId}
          loading={loading}
          formData={editor.formData}
          categories={editor.categories}
          thumbnailPreview={editor.thumbnailPreview}
          onInputChange={editor.handleInputChange}
          onThumbnailChange={editor.handleThumbnailChange}
          onSubmit={editor.handleSubmit}
          onCancel={editor.resetForm}
        />
      ) : null}

      <BlogsTable
        blogs={blogs}
        loading={loading}
        error={error}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        onEdit={editor.startEdit}
        onDelete={handleDelete}
        onNew={editor.startNew}
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
      />

      <JsonTemplateModal
        isOpen={jsonImport.isTemplateModalOpen}
        onClose={() => jsonImport.setIsTemplateModalOpen(false)}
        template={blogJsonTemplate}
        onCopy={handleCopyTemplate}
        description={blogJsonTemplateDescription}
        infoItems={blogJsonTemplateInfoItems}
      />
    </div>
  );
};

export default AdminBlogManagementPage;
