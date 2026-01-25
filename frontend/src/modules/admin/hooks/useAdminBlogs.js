import { useCallback, useEffect, useState } from "react";
import { deleteBlog, getBlogs } from "../services/blogService";
import { resolveBlogId } from "../utils/blogManagement";

export const useAdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBlogs();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Blog yazıları getirilirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = useCallback(
    async (blog) => {
      const id = typeof blog === "string" ? blog : resolveBlogId(blog);
      if (!id) {
        setError("Silinecek blog yazısının kimliği bulunamadı.");
        return;
      }

      if (
        !window.confirm("Bu blog yazısını silmek istediğinizden emin misiniz?")
      ) {
        return;
      }

      setLoading(true);
      try {
        await deleteBlog(id);
        await fetchBlogs();
      } catch (err) {
        setError(err.message || "Blog yazısı silinirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    },
    [fetchBlogs],
  );

  return {
    blogs,
    loading,
    error,
    setError,
    fetchBlogs,
    handleDelete,
    setLoading,
  };
};
