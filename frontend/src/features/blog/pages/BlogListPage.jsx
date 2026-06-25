import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "@shared";
import { motion } from "framer-motion";
import {
  FALLBACK_BLOGS as fallbackBlogs,
  fetchBlogs,
} from "@features/blog/services/blogService.js";
import { stripHtml, buildExcerpt, formatToLocaleDate } from "../utils/blogFormatters.js";
import "./styles/blog-list.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  },
};

const BlogListPage = () => {
  const [blogs, setBlogs] = useState(fallbackBlogs);
  const [refreshing, setRefreshing] = useState(false);
  const [dataSource, setDataSource] = useState("fallback");
  const [selectedCategory, setSelectedCategory] = useState("tümü");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // Modern grid için 6 daha ideal

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadBlogs = async () => {
      setRefreshing(true);
      try {
        const data = await fetchBlogs({ signal: controller.signal });
        if (!isMounted) return;
        const nextBlogs = Array.isArray(data) && data.length > 0 ? data : fallbackBlogs;
        setBlogs(nextBlogs);
        setDataSource(Array.isArray(data) && data.length > 0 ? "live" : "fallback");
      } catch {
        if (!isMounted) return;
        setBlogs(fallbackBlogs);
        setDataSource("fallback");
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
      window.clearInterval(intervalId);
    };
  }, []);

  const publishedBlogs = useMemo(() => {
    const base = blogs.filter((blog) => {
      const statusAllows = !blog?.status || blog.status === "published";
      const explicitFlag = blog?.isPublished !== false;
      return statusAllows && explicitFlag;
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

  return (
    <main className="blog-page" id="blog">
      <div className="blog-page__container">
        
        {/* Filtreleme ve Arama (Glassmorphism Sticky Bar) */}
        <motion.div 
          className="blog-page__filters" 
          aria-live="polite"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
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
          <motion.div 
            className="blog-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {paginatedBlogs.map((blog, index) => {
              const slug = blog?.slug || blog?.id || blog?._id;
              const cardKey = slug || `blog-${index}`;
              const publishedDate = formatToLocaleDate(blog?.publishedAt || blog?.updatedAt || blog?.createdAt) ?? "Yeni";
              const excerpt = buildExcerpt(blog) || "Devamı için tıklayın.";

              return (
                <motion.article key={cardKey} variants={itemVariants}>
                  <Link to={`/blog/${slug}`} className="blog-card">
                    <div className="blog-card__header">
                      <span className="blog-card__category">
                        {blog.category || "Genel"}
                      </span>
                    </div>
                    <h3 className="blog-card__title">{blog.title}</h3>
                    <div className="blog-card__meta">
                      <span>{publishedDate}</span>
                      {blog.readingTime ? <span>{` • ${blog.readingTime} dk okuma`}</span> : null}
                    </div>
                    <p className="blog-card__excerpt">{excerpt}</p>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {publishedBlogs.length > 0 && (
          <div className="naive-pagination-wrapper">
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
          </div>
        )}
      </div>
    </main>
  );
};

export default BlogListPage;