import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createBlog, deleteBlog, getBlogs } from "../services/blogService";
import { resolveBlogId } from "../utils/blogManagement";
import { showAdminToast } from "../utils/adminToast";

const PAGE_SIZE = 12;

export const useAdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const allBlogsRef = useRef([]);

  const fetchBlogs = useCallback(async (reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBlogs();
      const list = Array.isArray(data) ? data : [];
      allBlogsRef.current = list;
      const newPage = reset ? 1 : Math.min(page, Math.max(1, Math.ceil(list.length / PAGE_SIZE)));
      const start = (newPage - 1) * PAGE_SIZE;
      setBlogs(list.slice(start, start + PAGE_SIZE));
      setPage(newPage);
      setHasMore(start + PAGE_SIZE < list.length);
    } catch (err) {
      setError(err.message || "Blog yazilari getirilirken hata olustu.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBlogs(true);
  }, [fetchBlogs]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const start = nextPage * PAGE_SIZE;
    const more = allBlogsRef.current.slice(0, start);
    setBlogs(more);
    setPage(nextPage);
    setHasMore(start < allBlogsRef.current.length);
  }, [page]);

  const handleDelete = useCallback(async (blog) => {
    const id = typeof blog === "string" ? blog : resolveBlogId(blog);
    if (!id) { setError("Blog kimligi bulunamadi."); return; }
    if (!window.confirm("Bu blog yazisini silmek istediginize emin misiniz?")) return;

    setLoading(true);
    try {
      await deleteBlog(id);
      allBlogsRef.current = allBlogsRef.current.filter((b) => {
        const bid = resolveBlogId(b);
        return bid !== id;
      });
      setBlogs((prev) => prev.filter((b) => resolveBlogId(b) !== id));
      showAdminToast("Blog yazisi silindi.", { type: "success" });
    } catch (err) {
      showAdminToast(err.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleStatus = useCallback(async (blog) => {
    const id = resolveBlogId(blog);
    if (!id) return;
    try {
      const updated = { isPublished: !blog.isPublished, status: blog.isPublished ? "draft" : "published" };
      const { updateBlog } = await import("../services/blogService");
      await updateBlog(id, updated);
      const updater = (b) => resolveBlogId(b) === id ? { ...b, ...updated } : b;
      allBlogsRef.current = allBlogsRef.current.map(updater);
      setBlogs((prev) => prev.map(updater));
      showAdminToast(updated.isPublished ? "Yayinlandi." : "Taslak yapildi.", { type: "success" });
    } catch (err) {
      showAdminToast(err.message, { type: "error" });
    }
  }, []);

  const handleToggleFeatured = useCallback(async (blog) => {
    const id = resolveBlogId(blog);
    if (!id) return;
    try {
      const updated = { featured: !(blog.featured || blog.isFeatured) };
      const { updateBlog } = await import("../services/blogService");
      await updateBlog(id, updated);
      const updater = (b) => resolveBlogId(b) === id ? { ...b, featured: updated.featured } : b;
      allBlogsRef.current = allBlogsRef.current.map(updater);
      setBlogs((prev) => prev.map(updater));
      showAdminToast(updated.featured ? "One cikarildi." : "One cikandan kaldirildi.", { type: "success" });
    } catch (err) {
      showAdminToast(err.message, { type: "error" });
    }
  }, []);

  const handleDuplicate = useCallback(async (blog) => {
    const id = resolveBlogId(blog);
    if (!id) return;
    try {
      setLoading(true);
      const payload = {
        title: `${blog.title || "Blog"} (Kopya)`,
        content: blog.content || "",
        category: blog.category || "",
        tags: blog.tags || [],
        isPublished: false,
      };
      await createBlog(payload);
      showAdminToast("Blog kopyalandi (taslak).", { type: "success" });
      await fetchBlogs(true);
    } catch (err) {
      showAdminToast(err.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  }, [fetchBlogs]);

  const handleCopySlug = useCallback((blog) => {
    const slug = blog?.slug;
    if (!slug) { showAdminToast("Slug bulunamadi.", { type: "error" }); return; }
    navigator.clipboard.writeText(slug).then(() => {
      showAdminToast("Slug kopyalandi.", { type: "success" });
    });
  }, []);

  const stats = useMemo(() => {
    const all = allBlogsRef.current;
    const published = all.filter((b) => b.isPublished).length;
    const drafts = all.length - published;
    const totalViews = all.reduce((sum, b) => sum + (b.views || 0), 0);
    const totalReading = all.reduce((sum, b) => sum + (b.readingTime || 0), 0);
    const avgReadingTime = all.length > 0 ? Math.round(totalReading / all.length) : 0;
    return { published, drafts, totalViews, avgReadingTime };
  }, []);

  const tags = useMemo(() => {
    const set = new Set();
    allBlogsRef.current.forEach((b) => {
      (Array.isArray(b.tags) ? b.tags : []).forEach((t) => set.add(t));
    });
    return Array.from(set).sort();
  }, []);

  return {
    blogs,
    loading,
    error,
    hasMore,
    stats,
    tags,
    setError,
    setLoading,
    fetchBlogs,
    loadMore,
    handleDelete,
    handleToggleStatus,
    handleToggleFeatured,
    handleDuplicate,
    handleCopySlug,
  };
};

export default useAdminBlogs;
