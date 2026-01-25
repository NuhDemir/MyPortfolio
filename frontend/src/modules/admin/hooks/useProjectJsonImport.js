import { useCallback, useState } from "react";
import { createProject } from "../services/projectService";
import { normalizeProjectJson } from "../utils/projectManagement";
import { showAdminToast } from "../utils/adminToast";

export const useProjectJsonImport = ({
  fetchProjects,
  setError,
  setLoading,
}) => {
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const openJsonModal = useCallback(() => {
    setIsJsonModalOpen(true);
  }, []);

  const closeJsonModal = useCallback(() => {
    setIsJsonModalOpen(false);
    setJsonInput("");
  }, []);

  const handleJsonFilePick = useCallback(
    async (event) => {
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
    },
    [setError],
  );

  const handleJsonSubmit = useCallback(async () => {
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

        const resolvedTitle =
          submission?.metadata?.title ?? submission?.title ?? "";
        const resolvedDescription =
          submission?.metadata?.tagline ?? submission?.description ?? "";
        const resolvedImageUrl =
          submission?.visuals?.thumbnailUrl ?? submission?.imageUrl ?? "";

        if (!resolvedTitle || !resolvedDescription) {
          setError(
            `JSON'daki proje #${index + 1} için en az 'title' ve 'description' (veya V2 için 'metadata.title' + 'metadata.tagline') alanları gereklidir.`,
          );
          return;
        }

        if (!resolvedImageUrl) {
          setError(
            `JSON'daki proje #${index + 1} için görsel URL zorunludur: 'imageUrl' (legacy) veya 'visuals.thumbnailUrl' (V2).`,
          );
          return;
        }

        await createProject(submission);
        createdCount += 1;
      }

      setIsJsonModalOpen(false);
      setJsonInput("");
      await fetchProjects();

      showAdminToast(`${createdCount} proje JSON ile eklendi!`, {
        type: "success",
      });
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Geçersiz JSON formatı. Lütfen formatı kontrol edin.");
      } else {
        setError(err.message || "JSON yüklenirken bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  }, [fetchProjects, jsonInput, setError, setLoading]);
  return {
    isJsonModalOpen,
    setIsJsonModalOpen,
    jsonInput,
    setJsonInput,
    isTemplateModalOpen,
    setIsTemplateModalOpen,
    openJsonModal,
    closeJsonModal,
    handleJsonFilePick,
    handleJsonSubmit,
  };
};
