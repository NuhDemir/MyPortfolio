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
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const categories = useMemo(() => blogCategories, []);

  const cleanupThumbnailPreview = useCallback(() => {
    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
  }, [thumbnailPreview]);

  const resetForm = useCallback(() => {
    setIsFormVisible(false);
    setEditingId(null);
    setFormData(initialBlogFormState);
    setThumbnailFile(null);
    cleanupThumbnailPreview();
    setThumbnailPreview(null);
    setError(null);
  }, [cleanupThumbnailPreview, setError]);

  const handleInputChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleThumbnailChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file) {
        setThumbnailFile(file);
        cleanupThumbnailPreview();
        setThumbnailPreview(URL.createObjectURL(file));
      }
    },
    [cleanupThumbnailPreview],
  );

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

      const previewUrl = resolveThumbnailUrl(blog);
      setThumbnailPreview(previewUrl || null);
      setIsFormVisible(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [resetForm, setError],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!editingId && !thumbnailFile) {
        setError("Yeni blog oluşturmak için kapak görseli seçmek zorunludur.");
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

      if (thumbnailFile) {
        submission.thumbnail = thumbnailFile;
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
    [
      categories,
      editingId,
      fetchBlogs,
      formData,
      resetForm,
      setError,
      setLoading,
      thumbnailFile,
    ],
  );

  return {
    categories,
    isFormVisible,
    editingId,
    formData,
    thumbnailPreview,
    startNew,
    startEdit,
    handleInputChange,
    handleThumbnailChange,
    handleSubmit,
    resetForm,
  };
};
