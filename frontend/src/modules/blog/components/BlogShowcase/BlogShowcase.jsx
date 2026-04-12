import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FALLBACK_BLOGS as fallbackBlogs,
  fetchBlogs,
} from "@modules/blog/services/blogService.js";
import {
  ArrowRight,
  BookOpenText,
  Clock,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import "./BlogShowcase.brutal.css";

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
      b?.publishedAt || b?.updatedAt || b?.createdAt || 0,
    );
    return second - first;
  });

/* Doodle: el çizimi yıldız SVG */
const DoodleStar = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M19 3 L22 14 L33 14 L24 21 L27 33 L19 26 L11 33 L14 21 L5 14 L16 14 Z"
      fill="var(--color-accent)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="33" cy="6" r="2.5" fill="var(--color-primary)" stroke="var(--color-border-strong)" strokeWidth="1.5" />
    <circle cx="5"  cy="31" r="2"   fill="var(--color-accent)"  stroke="var(--color-border-strong)" strokeWidth="1.5" />
  </svg>
);

/* Doodle: asimetrik nokta kümesi SVG */
const DoodleDots = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="5"   fill="var(--color-accent)"   stroke="var(--color-border-strong)" strokeWidth="2" />
    <circle cx="28" cy="7"  r="3.5" fill="var(--color-primary)"  stroke="var(--color-border-strong)" strokeWidth="2" />
    <circle cx="42" cy="18" r="4"   fill="var(--color-accent)"   stroke="var(--color-border-strong)" strokeWidth="2" />
    <circle cx="18" cy="30" r="3"   fill="var(--color-primary)"  stroke="var(--color-border-strong)" strokeWidth="1.5" />
    <circle cx="38" cy="38" r="5"   fill="var(--color-accent)"   stroke="var(--color-border-strong)" strokeWidth="2" />
  </svg>
);

const BlogShowcase = () => {
  const [blogs, setBlogs] = useState(fallbackBlogs);
  const [refreshing, setRefreshing] = useState(false);
  const [dataSource, setDataSource] = useState("fallback");

  const DataSourceIcon = dataSource === "live" ? Wifi : WifiOff;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadBlogs = async () => {
      setRefreshing(true);

      try {
        const data = await fetchBlogs({ signal: controller.signal });
        if (!isMounted) return;
        const nextBlogs =
          Array.isArray(data) && data.length > 0 ? data : fallbackBlogs;
        setBlogs(nextBlogs);
        setDataSource(
          Array.isArray(data) && data.length > 0 ? "live" : "fallback",
        );
      } catch {
        if (!isMounted) return;
        setBlogs(fallbackBlogs);
        setDataSource("fallback");
      } finally {
        if (isMounted) setRefreshing(false);
      }
    };

    loadBlogs();

    const intervalId = window.setInterval(
      () => {
        if (!isMounted) return;
        loadBlogs();
      },
      5 * 60 * 1000,
    );

    return () => {
      isMounted = false;
      controller.abort();
      window.clearInterval(intervalId);
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

  if (visibleBlogs.length === 0) {
    return null;
  }

  return (
    <section className="blog-showcase" id="blog-section">
      {/* Dekoratif doodle elementler */}
      <DoodleStar className="blog-showcase__doodle blog-showcase__doodle--star" />
      <DoodleDots className="blog-showcase__doodle blog-showcase__doodle--dots" />

      <div className="blog-showcase__header">
        <div className="blog-showcase__header-meta">
          <span className="blog-showcase__eyebrow">
            <BookOpenText
              className="blog-showcase__eyebrow-icon"
              aria-hidden="true"
            />
            Blog
          </span>
          <span
            className="blog-showcase__chip"
            data-state={dataSource}
            aria-live="polite"
          >
            <DataSourceIcon
              className="blog-showcase__chip-icon"
              aria-hidden="true"
            />
            {dataSource === "live" ? "Canlı veri" : "Yedek içerik"}
            {refreshing ? (
              <>
                <span aria-hidden="true"> • </span>
                Güncelleniyor
                <RefreshCw
                  className="blog-showcase__chip-spinner"
                  aria-hidden="true"
                />
              </>
            ) : null}
          </span>
        </div>
        <h2 className="blog-showcase__title">Blog Yazılarım</h2>
        <p className="blog-showcase__subtitle">
          Kod notları, deneyimler ve ilham verici kısa okumalar.
        </p>
        <Link className="blog-showcase__cta" to="/blog">
          Tüm yazıları gör
          <ArrowRight className="blog-showcase__cta-icon" aria-hidden="true" />
        </Link>
      </div>

      <div className="blog-showcase__grid" data-refreshing={refreshing}>
        {visibleBlogs.map((blog, index) => {
          const blogSlug = normalizeSlug(blog);
          const linkSlug = blogSlug || blog?.id || blog?._id;
          const cardKey =
            blogSlug || blog?.id || blog?._id || blog?.title || `blog-${index}`;
          const excerpt = buildExcerpt(blog) || "Devamı için tıklayın.";
          return (
            <article key={cardKey} className="blog-card">
              <div className="blog-card__tag">{blog.category || "Genel"}</div>
              <h3 className="blog-card__title">{blog.title}</h3>
              <p className="blog-card__excerpt">{excerpt}</p>
              <div className="blog-card__footer">
                <span className="blog-card__meta">
                  <Clock className="blog-card__meta-icon" aria-hidden="true" />
                  {blog.readingTime ? `${blog.readingTime} dk okuma` : "Keşfet"}
                </span>
                <Link className="blog-card__link" to={`/blog/${linkSlug}`}>
                  Yazıya git
                  <span className="visually-hidden">: {blog.title}</span>
                  <ArrowRight
                    className="blog-card__link-icon"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default BlogShowcase;
