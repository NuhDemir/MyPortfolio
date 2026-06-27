import { useCallback, useMemo, useState } from "react";
import { createBlog, updateBlog } from "../services/blogService";
import {
  blogCategories,
  initialBlogFormState,
  resolveBlogId,
  resolveThumbnailUrl,
  toTagsArray,
  toTagsText,
} from "../utils/blogManagement";

export const useBlogEditor = ({ fetchBlogs, setError, setLoading }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialBlogFormState);
  const [coverMode, setCoverMode] = useState("file");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const categories = useMemo(() => blogCategories, []);

  const cleanupPreview = useCallback(() => {
    if (coverPreview && coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }
  }, [coverPreview]);

  const resetForm = useCallback(() => {
    setIsFormVisible(false);
    setEditingId(null);
    setFormData(initialBlogFormState);
    setCoverMode("file");
    setCoverUrl("");
    setCoverFile(null);
    cleanupPreview();
    setCoverPreview(null);
    setError(null);
  }, [cleanupPreview, setError]);

  const handleInputChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleCoverFileChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file) {
        setCoverFile(file);
        cleanupPreview();
        setCoverPreview(URL.createObjectURL(file));
      }
    },
    [cleanupPreview],
  );

  const handleCoverUrlChange = useCallback((event) => {
    const url = event.target.value;
    setCoverUrl(url);
    if (url) setCoverPreview(url);
  }, []);

  const handleCoverModeChange = useCallback((mode) => {
    setCoverMode(mode);
    setCoverFile(null);
    if (mode === "url") {
      setCoverUrl("");
      setCoverPreview(null);
    }
  }, []);

  const handleClearCover = useCallback(() => {
    setCoverFile(null);
    setCoverUrl("");
    cleanupPreview();
    setCoverPreview(null);
  }, [cleanupPreview]);

  const startNew = useCallback(() => {
    resetForm();
    setIsFormVisible(true);
  }, [resetForm]);

  const startEdit = useCallback(
    (blog) => {
      const blogId = resolveBlogId(blog);
      if (!blogId) {
        setError("Seçili blog yazısının kimliği bulunamadı.");
        return;
      }

      resetForm();
      setEditingId(blogId);
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        category: blog.category || "",
        tags: toTagsText(blog.tags),
        isPublished: Boolean(blog.isPublished),
      });

      const existingUrl = resolveThumbnailUrl(blog);
      if (existingUrl) {
        setCoverMode("url");
        setCoverUrl(existingUrl);
        setCoverPreview(existingUrl);
      }

      setIsFormVisible(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [resetForm, setError],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!editingId && !coverFile && !coverUrl) {
        setError("Yeni blog oluşturmak için kapak görseli zorunludur (URL veya dosya).");
        return;
      }

      setLoading(true);
      setError(null);

      const submission = {
        title: String(formData.title ?? "").trim(),
        content: String(formData.content ?? "").trim(),
        category: String(formData.category ?? "").trim(),
        tags: toTagsArray(formData.tags),
        isPublished: Boolean(formData.isPublished),
      };

      if (!submission.category || !categories.includes(submission.category)) {
        delete submission.category;
      }

      if (!Array.isArray(submission.tags) || submission.tags.length === 0) {
        delete submission.tags;
      }

      if (coverMode === "file" && coverFile) {
        submission.thumbnail = coverFile;
      } else if (coverMode === "url" && coverUrl) {
        submission.thumbnailUrl = coverUrl;
      }

      try {
        if (editingId) {
          await updateBlog(editingId, submission);
        } else {
          await createBlog(submission);
        }

        resetForm();
        await fetchBlogs();
      } catch (err) {
        setError(err.message || "Blog yazısı kaydedilirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    },
    [categories, editingId, fetchBlogs, formData, resetForm, setError, setLoading, coverMode, coverFile, coverUrl],
  );

  return {
    categories,
    isFormVisible,
    editingId,
    formData,
    coverMode,
    coverUrl,
    coverFile,
    coverPreview,
    startNew,
    startEdit,
    handleInputChange,
    handleCoverFileChange,
    handleCoverUrlChange,
    handleCoverModeChange,
    handleClearCover,
    handleSubmit,
    resetForm,
    setFormData,
  };
};
