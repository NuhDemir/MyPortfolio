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

      console.log("[Blog JSON Import] Parsed data:", parsedData);

      if (!parsedData?.title || !parsedData?.content) {
        setError("JSON'da en az 'title' ve 'content' alanlari gereklidir.");
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

      if (parsedData.status) {
        submission.status = parsedData.status;
      }

      if (parsedData.featured !== undefined) {
        submission.featured = Boolean(parsedData.featured);
      }

      console.log("[Blog JSON Import] Sending:", submission);

      const result = await createBlog(submission);

      console.log("[Blog JSON Import] Created:", result);

      closeJsonModal();
      await fetchBlogs();

      console.log("[Blog JSON Import] Blogs refreshed");
    } catch (err) {
      console.error("[Blog JSON Import] Error:", err);
      if (err instanceof SyntaxError) {
        setError("Gecersiz JSON formati. Lutfen formati kontrol edin.");
      } else {
        setError(err.message || "JSON yuklenirken bir hata olustu.");
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
