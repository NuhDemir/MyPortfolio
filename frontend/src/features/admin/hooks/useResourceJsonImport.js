import { useCallback, useState } from "react";
import { createResource } from "../services/resourceService";
import { showAdminToast } from "../utils/adminToast";

export const useResourceJsonImport = ({ fetchResources }) => {
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const openJsonModal = useCallback(() => setIsJsonModalOpen(true), []);
  const closeJsonModal = useCallback(() => { setIsJsonModalOpen(false); setJsonInput(""); }, []);

  const handleJsonSubmit = useCallback(async () => {
    try {
      const parsedData = JSON.parse(jsonInput);

      if (!parsedData?.title || !parsedData?.url) {
        showAdminToast("title ve url alanlari zorunludur.", { type: "error" });
        return;
      }

      console.log("[Resource JSON Import] Parsed:", parsedData);

      const submission = {
        title: parsedData.title,
        url: parsedData.url,
        type: parsedData.type || "diger",
        description: parsedData.description || "",
        tags: Array.isArray(parsedData.tags) ? parsedData.tags.join(", ") : (parsedData.tags || ""),
        author: parsedData.author || "",
        rating: String(parsedData.rating ?? 0),
        language: parsedData.language || "tr",
        difficulty: parsedData.difficulty || "",
        notes: parsedData.notes || "",
        coverImage: parsedData.coverImage || "",
        isActive: String(parsedData.isActive !== false),
        isFeatured: String(parsedData.isFeatured === true),
      };

      console.log("[Resource JSON Import] Sending:", submission);

      const result = await createResource(submission);

      console.log("[Resource JSON Import] Created:", result);

      showAdminToast("Kaynak basariyla eklendi.", { type: "success" });
      closeJsonModal();
      await fetchResources();
    } catch (err) {
      console.error("[Resource JSON Import] Error:", err);
      if (err instanceof SyntaxError) {
        showAdminToast("Gecersiz JSON formati.", { type: "error" });
      } else {
        showAdminToast(err.message || "Kaynak eklenirken hata olustu.", { type: "error" });
      }
    }
  }, [closeJsonModal, fetchResources, jsonInput]);

  return {
    isJsonModalOpen,
    jsonInput,
    setJsonInput,
    isTemplateModalOpen,
    setIsTemplateModalOpen,
    openJsonModal,
    closeJsonModal,
    handleJsonSubmit,
  };
};

export default useResourceJsonImport;
