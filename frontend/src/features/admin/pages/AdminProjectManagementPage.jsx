import { ErrorMessage } from "@shared";
import JsonTemplateModal from "../components/common/JsonTemplateModal.jsx";
import JsonUploadModal from "../components/common/JsonUploadModal.jsx";
import ProjectForm from "../components/projectManagement/ProjectForm.jsx";
import ProjectManagementActions from "../components/projectManagement/ProjectManagementActions.jsx";
import ProjectsTable from "../components/projectManagement/ProjectsTable.jsx";
import { useAdminProjects } from "../hooks/useAdminProjects";
import { useProjectEditor } from "../hooks/useProjectEditor";
import { useProjectJsonImport } from "../hooks/useProjectJsonImport";
import { exportProjectsJson } from "../services/projectService";
import { downloadFromAxiosBlobResponse } from "../utils/download";
import { showAdminToast } from "../utils/adminToast";
import {
  projectJsonTemplateDescription,
  projectJsonUploadPlaceholder,
  projectJsonUploadTitle,
  projectV2JsonTemplate,
  projectV2JsonTemplateInfoItems,
} from "../utils/projectTemplates";
import "../styles/admin-shared.css";

const AdminProjectManagementPage = () => {
  const {
    projects,
    loading,
    error,
    setError,
    fetchProjects,
    handleDelete,
    setLoading,
  } = useAdminProjects();

  const editor = useProjectEditor({ fetchProjects, setError, setLoading });
  const jsonImport = useProjectJsonImport({
    fetchProjects,
    setError,
    setLoading,
  });

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(
      JSON.stringify(projectV2JsonTemplate, null, 2),
    );
    showAdminToast("Şablon panoya kopyalandı!", { type: "success" });
  };

  const handleExportJson = async () => {
    setLoading(true);
    try {
      const response = await exportProjectsJson();
      downloadFromAxiosBlobResponse(response, "projects-export.json");
    } catch (err) {
      setError(err?.message || "Projeler dışa aktarılırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-management-page">
      <h1>Proje Yönetimi</h1>
      {error ? <ErrorMessage message={error} /> : null}

      {!editor.isFormVisible ? (
        <ProjectManagementActions
          onNewProject={editor.startNew}
          onOpenJson={jsonImport.openJsonModal}
          onExportJson={handleExportJson}
        />
      ) : null}

      {editor.isFormVisible ? (
        <ProjectForm
          editingId={editor.editingId}
          loading={loading}
          formData={editor.formData}
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
        />
      ) : null}

      <ProjectsTable
        projects={projects}
        loading={loading}
        error={error}
        onEdit={editor.startEdit}
        onDelete={handleDelete}
      />

      <JsonUploadModal
        isOpen={jsonImport.isJsonModalOpen}
        loading={loading}
        title={projectJsonUploadTitle}
        jsonInput={jsonImport.jsonInput}
        onChangeJsonInput={jsonImport.setJsonInput}
        onClose={jsonImport.closeJsonModal}
        onFilePick={jsonImport.handleJsonFilePick}
        onSubmit={jsonImport.handleJsonSubmit}
        onOpenTemplate={() => jsonImport.setIsTemplateModalOpen(true)}
        placeholder={projectJsonUploadPlaceholder}
        filePickLabel="Dosya Seç"
      />

      <JsonTemplateModal
        isOpen={jsonImport.isTemplateModalOpen}
        onClose={() => jsonImport.setIsTemplateModalOpen(false)}
        template={projectV2JsonTemplate}
        onCopy={handleCopyTemplate}
        description={projectJsonTemplateDescription}
        infoItems={projectV2JsonTemplateInfoItems}
      />
    </div>
  );
};

export default AdminProjectManagementPage;
