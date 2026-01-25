import { useCallback, useState } from "react";
import { createBlog } from "../services/blogService";

export const useBlogJsonImport = ({ fetchBlogs, setError, setLoading }) => {
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

  const handleJsonSubmit = useCallback(async () => {
    try {
      setError(null);
      const parsedData = JSON.parse(jsonInput);

      if (!parsedData?.title || !parsedData?.content) {
        setError("JSON'da en az 'title' ve 'content' alanları gereklidir.");
        return;
      }

      setLoading(true);

      const submission = {
        title: parsedData.title,
        content: parsedData.content,
        category: parsedData.category || "",
        tags: Array.isArray(parsedData.tags) ? parsedData.tags : [],
        isPublished: Boolean(parsedData.isPublished),
      };

      if (parsedData.thumbnailUrl) {
        submission.thumbnailUrl = parsedData.thumbnailUrl;
      }

      await createBlog(submission);
      closeJsonModal();
      await fetchBlogs();
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Geçersiz JSON formatı. Lütfen formatı kontrol edin.");
      } else {
        setError(err.message || "JSON yüklenirken bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  }, [closeJsonModal, fetchBlogs, jsonInput, setError, setLoading]);

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
