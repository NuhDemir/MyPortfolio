import { useEffect, useMemo, useState } from "react";
import { FALLBACK_BLOGS, fetchBlogBySlug } from "../services/blogService.js";

export const useBlogDetail = (slug) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("unknown");

  const fallbackBlog = useMemo(() => {
    if (!slug) return null;
    const list = Array.isArray(FALLBACK_BLOGS) ? FALLBACK_BLOGS : [];
    return list.find((item) => item.slug === slug || item.id === slug) || null;
  }, [slug]);

  useEffect(() => {
    if (!slug) { setBlog(null); setLoading(false); return; }

    let isMounted = true;
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchBlogBySlug(slug, { signal: controller.signal });
        if (!isMounted) return;
        setBlog(data || fallbackBlog);
        setDataSource(data ? "live" : (fallbackBlog ? "fallback" : "unknown"));
      } catch {
        if (!isMounted) return;
        setBlog(fallbackBlog);
        setDataSource(fallbackBlog ? "fallback" : "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; controller.abort(); };
  }, [slug, fallbackBlog]);

  return { blog, loading, dataSource };
};

export default useBlogDetail;
