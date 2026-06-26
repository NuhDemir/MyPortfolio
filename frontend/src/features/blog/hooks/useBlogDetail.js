import { useEffect, useState } from "react";
import { fetchBlogBySlug } from "../services/blogService.js";

export const useBlogDetail = (slug) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("unknown");

  useEffect(() => {
    if (!slug) { setBlog(null); setLoading(false); return; }

    let isMounted = true;
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchBlogBySlug(slug, { signal: controller.signal });
        if (!isMounted) return;
        setBlog(data);
        setDataSource(data ? "live" : "error");
      } catch {
        if (!isMounted) return;
        setBlog(null);
        setDataSource("error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; controller.abort(); };
  }, [slug]);

  return { blog, loading, dataSource };
};

export default useBlogDetail;
