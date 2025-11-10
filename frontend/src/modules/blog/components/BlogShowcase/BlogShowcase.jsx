import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "@shared/ui/LoadingSpinner.jsx";
import { fetchBlogs } from "@modules/blog/services/blogService.js";
import "./BlogShowcase.css";

const BLOG_LIMIT = 3;

const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").trim();

const buildExcerpt = (blog) => {
  const baseContent =
    blog?.excerpt || blog?.summary || stripHtml(blog?.content ?? "");

  const trimmed = baseContent.replace(/\s+/g, " ").trim();
  if (trimmed.length <= 160) {
    return trimmed;
  }

  return `${trimmed.slice(0, 157).trimEnd()}...`;
};

const normalizeSlug = (blog) => blog?.slug || blog?.id || blog?._id;

const sortBlogsByDate = (entries) =>
  [...entries].sort((a, b) => {
    const first = new Date(a?.publishedAt || a?.updatedAt || a?.createdAt || 0);
    const second = new Date(
      b?.publishedAt || b?.updatedAt || b?.createdAt || 0
    );
    return second - first;
  });

const BlogShowcase = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadBlogs = async () => {
  setLoading(true);

      try {
        const data = await fetchBlogs();
        if (!isMounted) return;
        setBlogs(Array.isArray(data) ? data : []);
      } catch {
        if (!isMounted) return;
        // Sessiz fallback: blogService local fallback döndürebiliyor
        setBlogs([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleBlogs = useMemo(() => {
    const publishedOnly = blogs.filter((blog) => {
      const statusAllows = !blog?.status || blog.status === "published";
      const explicitFlag = blog?.isPublished !== false;
      return statusAllows && explicitFlag;
    });
    return sortBlogsByDate(publishedOnly).slice(0, BLOG_LIMIT);
  }, [blogs]);

  if (!loading && visibleBlogs.length === 0) {
    return null;
  }

  return (
    <section className="blog-showcase" id="blog-section">
      <div className="blog-showcase__header">
        <span className="blog-showcase__eyebrow">Blog</span>
        <h2 className="blog-showcase__title">Zihin Günlüğü</h2>
        <p className="blog-showcase__subtitle">
          Kod notları, deneyimler ve ilham verici kısa okumalar.
        </p>
        <Link className="blog-showcase__cta" to="/blog">
          Tüm yazıları gör
        </Link>
      </div>

      {loading ? (
        <div className="blog-showcase__state">
          <LoadingSpinner message="Blog yazıları yükleniyor..." />
        </div>
      ) : (
        <div className="blog-showcase__grid">
          {visibleBlogs.map((blog, index) => {
            const blogSlug = normalizeSlug(blog);
            const linkSlug = blogSlug || blog?.id || blog?._id;
            const cardKey =
              blogSlug ||
              blog?.id ||
              blog?._id ||
              blog?.title ||
              `blog-${index}`;
            const excerpt = buildExcerpt(blog) || "Devamı için tıklayın.";
            return (
              <article key={cardKey} className="blog-card">
                <div className="blog-card__tag">{blog.category || "Genel"}</div>
                <h3 className="blog-card__title">{blog.title}</h3>
                <p className="blog-card__excerpt">{excerpt}</p>
                <div className="blog-card__footer">
                  <span className="blog-card__meta">
                    {blog.readingTime
                      ? `${blog.readingTime} dk okuma`
                      : "Keşfet"}
                  </span>
                  <Link className="blog-card__link" to={`/blog/${linkSlug}`}>
                    Yazıya git
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default BlogShowcase;
