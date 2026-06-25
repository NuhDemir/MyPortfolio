import { useState, useCallback } from "react";
import { useAdminResources } from "../hooks/useAdminResources.js";
import { useResourceJsonImport } from "../hooks/useResourceJsonImport.js";
import ResourceForm from "../components/resourceManagement/ResourceForm.jsx";
import ResourceManagementActions from "../components/resourceManagement/ResourceManagementActions.jsx";
import ResourcesTable from "../components/resourceManagement/ResourcesTable.jsx";
import JsonUploadModal from "../components/common/JsonUploadModal.jsx";
import JsonTemplateModal from "../components/common/JsonTemplateModal.jsx";
import {
  RESOURCE_JSON_TEMPLATE,
  RESOURCE_JSON_TEMPLATE_INFO,
  validateResourceJson,
} from "../utils/resourceJsonValidator.js";
import { showAdminToast } from "../utils/adminToast.js";
import "../styles/admin-shared.css";

const AdminResourceManagementPage = () => {
  const { resources, loading, fetchResources, handleDelete } = useAdminResources();
  const jsonImport = useResourceJsonImport({ fetchResources });
  const [editData, setEditData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleNew = () => { setEditData(null); setShowForm(true); };
  const handleEdit = (resource) => { setEditData(resource); setShowForm(true); };
  const handleDeleteConfirm = (resource) => {
    if (window.confirm(`"${resource.title}" kaynagini silmek istediginize emin misiniz?`)) {
      handleDelete(resource._id || resource.id);
    }
  };
  const handleSuccess = () => { setShowForm(false); setEditData(null); fetchResources(); };
  const handleCancel = () => { setShowForm(false); setEditData(null); };

  const handleCopyTemplate = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(RESOURCE_JSON_TEMPLATE, null, 2));
    showAdminToast("Sablon panoya kopyalandi!", { type: "success" });
  }, []);

  return (
    <div className="admin-management-page">
      <h1>Kaynak Yonetimi</h1>

      {!showForm && (
        <ResourceManagementActions onNew={handleNew} onJsonImport={jsonImport.openJsonModal} />
      )}

      {showForm && (
        <ResourceForm editData={editData} onSuccess={handleSuccess} onCancel={handleCancel} />
      )}

      <ResourcesTable resources={resources} loading={loading} onEdit={handleEdit} onDelete={handleDeleteConfirm} />

      <JsonUploadModal
        isOpen={jsonImport.isJsonModalOpen}
        loading={loading}
        title="JSON ile Kaynak Ekle"
        jsonInput={jsonImport.jsonInput}
        onChangeJsonInput={jsonImport.setJsonInput}
        onClose={jsonImport.closeJsonModal}
        onSubmit={jsonImport.handleJsonSubmit}
        onOpenTemplate={() => jsonImport.setIsTemplateModalOpen(true)}
        placeholder="Kaynak JSON verilerini buraya yapistirin..."
        validator={validateResourceJson}
      />

      <JsonTemplateModal
        isOpen={jsonImport.isTemplateModalOpen}
        onClose={() => jsonImport.setIsTemplateModalOpen(false)}
        template={RESOURCE_JSON_TEMPLATE}
        onCopy={handleCopyTemplate}
        description="Kaynak eklemek icin asagidaki JSON formatini kullanin:"
        infoItems={RESOURCE_JSON_TEMPLATE_INFO}
      />
    </div>
  );
};

export default AdminResourceManagementPage;
