import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination, PageSkeleton, useScrollReveal } from "@shared";
import { motion } from "framer-motion";
import {
  fetchBlogs,
} from "@features/blog/services/blogService.js";
import { stripHtml, buildExcerpt, formatToLocaleDate } from "../utils/blogFormatters.js";
import { useLikeBlog } from "../hooks/useLikeBlog.js";
import { Heart } from "lucide-react";
import { NewsletterBanner } from "../components/Newsletter/NewsletterBanner.jsx";
import "./styles/blog-list.css";

const BlogCardItem = ({ blog, index }) => {
  const slug = blog?.slug || blog?.id || blog?._id;
  const publishedDate = formatToLocaleDate(blog?.publishedAt || blog?.updatedAt || blog?.createdAt) ?? "Yeni";
  const excerpt = buildExcerpt(blog) || "Devamı için tıklayın.";
  const coverUrl = blog?.thumbnail?.url || blog?.thumbnail || blog?.coverImage || null;
  const blogId = blog?._id || blog?.id;

  const { likes, isLiked, isLiking, handleLike } = useLikeBlog(blogId, blog?.likes || 0);

  const rev = useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: index * 0.05 });

  return (
    <motion.article key={slug || `blog-${index}`} {...rev}>
      <div className="blog-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Link to={`/blog/${slug}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
          <div className="blog-card__cover">
            {coverUrl ? (
              <img src={coverUrl} alt={blog.title} className="blog-card__cover-img" loading="lazy" />
            ) : (
              <div className="blog-card__cover-placeholder">
                <span>{blog.title?.[0] || "B"}</span>
              </div>
            )}
            <span className="blog-card__category-badge">
              {blog.category || "Genel"}
            </span>
          </div>

          <div className="blog-card__body" style={{ paddingBottom: '0.5rem' }}>
            <h3 className="blog-card__title">{blog.title}</h3>
            <div className="blog-card__meta">
              <span>{publishedDate}</span>
              {blog.readingTime ? <span>{` • ${blog.readingTime} dk okuma`}</span> : null}
            </div>
            <p className="blog-card__excerpt">{excerpt}</p>
          </div>
        </Link>
        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={handleLike}
            disabled={isLiked || isLiking}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: isLiked ? '#ef4444' : 'var(--text-tertiary)',
              cursor: isLiked ? 'default' : 'pointer',
              padding: 0,
              transition: 'all 0.2s',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}
            title={isLiked ? "Beğenildi" : "Beğen"}
          >
            <Heart size={16} fill={isLiked ? "#ef4444" : "none"} />
            {likes.toLocaleString('tr-TR')}
          </button>
        </div>
      </div>
    </motion.article>
  );
};

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [dataSource, setDataSource] = useState("unknown");
  const [selectedCategory, setSelectedCategory] = useState("tümü");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    let retryTimer;

    const loadBlogs = async () => {
      if (!isMounted) return;
      setRefreshing(true);
      try {
        const data = await fetchBlogs({ signal: controller.signal });
        if (!isMounted) return;
        const nextBlogs = Array.isArray(data) ? data : [];
        setBlogs(nextBlogs);
        setDataSource(Array.isArray(data) && data.length > 0 ? "live" : "error");
      } catch {
        if (!isMounted) return;
        setDataSource("error");
        // Retry until successful
        retryTimer = setTimeout(() => {
          if (isMounted) loadBlogs();
        }, 3000);
      } finally {
        if (isMounted) setRefreshing(false);
      }
    };

    loadBlogs();

    const intervalId = window.setInterval(() => {
      if (!isMounted) return;
      loadBlogs();
    }, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(retryTimer);
      window.clearInterval(intervalId);
    };
  }, []);

  const publishedBlogs = useMemo(() => {
    const base = blogs.filter((blog) => {
      // A blog is visible to public readers ONLY when explicitly published.
      // status takes precedence; isPublished is the fallback boolean.
      if (blog?.status) {
        return blog.status === "published";
      }
      return blog?.isPublished === true;
    });

    const term = searchTerm.trim().toLowerCase();
    const filteredBySearch = term
      ? base.filter((blog) => {
          const haystack = [
            blog.title,
            blog.category,
            ...(Array.isArray(blog.tags) ? blog.tags : []),
            stripHtml(blog?.content ?? ""),
          ].join(" ").toLowerCase();
          return haystack.includes(term);
        })
      : base;

    const filteredByCategory =
      selectedCategory === "tümü"
        ? filteredBySearch
        : filteredBySearch.filter((blog) => blog.category === selectedCategory);

    return filteredByCategory.sort((a, b) => {
      const first = new Date(a?.publishedAt || a?.updatedAt || a?.createdAt || 0);
      const second = new Date(b?.publishedAt || b?.updatedAt || b?.createdAt || 0);
      const featureWeight = (val) => (val ? 1 : 0);
      return featureWeight(b?.featured) - featureWeight(a?.featured) || second - first;
    });
  }, [blogs, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const unique = new Set();
    blogs.forEach((blog) => {
      if (blog?.category) unique.add(blog.category);
    });
    return ["tümü", ...Array.from(unique)];
  }, [blogs]);

  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return publishedBlogs.slice(startIndex, endIndex);
  }, [publishedBlogs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(publishedBlogs.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const revFilters = useScrollReveal({ variant: "fadeUp", threshold: 0.08 });
  const revPagination = useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.1 });

  if (refreshing && blogs.length === 0) {
    return <PageSkeleton />;
  }

  return (
    <main className="blog-page" id="blog">
      <div className="blog-page__container">
        <motion.div
          className="blog-page__filters"
          aria-live="polite"
          {...revFilters}
        >
          <div className="blog-page__chips">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className="blog-chip"
                data-selected={category === selectedCategory}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="blog-search">
            <input
              id="blog-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Makalelerde ara..."
            />
          </div>
        </motion.div>

        {publishedBlogs.length === 0 ? (
          <div className="blog-page__empty">
            <p>Henüz yayınlanmış blog yazısı bulunmuyor.</p>
          </div>
        ) : (
          <>
            <motion.div {...revPagination}>
              <NewsletterBanner />
            </motion.div>
            
            <div className="blog-list">
              {paginatedBlogs.map((blog, index) => (
                <BlogCardItem key={blog?.slug || blog?.id || blog?._id || `blog-${index}`} blog={blog} index={index} />
              ))}
            </div>
          </>
        )}

        {publishedBlogs.length > 0 && (
          <motion.div className="naive-pagination-wrapper" {...revPagination}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={publishedBlogs.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newItemsPerPage) => {
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1);
              }}
            />
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default BlogListPage;
