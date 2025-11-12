import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "@shared/ui/LoadingSpinner.jsx";
import Pagination from "@shared/ui/Pagination.jsx";
import ScrollToTop from "@shared/ui/ScrollToTop.jsx";
import { Navbar } from "@modules/navbar/components/Navbar/Navbar.jsx";
import Footer from "@modules/footer/components/Footer/Footer.jsx";
import { fetchBlogs } from "@modules/blog/services/blogService.js";
import "./styles/blog-pages.css";

const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").trim();

const buildExcerpt = (blog) => {
  const baseContent =
    blog?.excerpt || blog?.summary || stripHtml(blog?.content ?? "");
  const normalized = baseContent.replace(/\s+/g, " ").trim();

  if (normalized.length <= 220) {
    return normalized;
  }

  return `${normalized.slice(0, 217).trimEnd()}...`;
};

const formatDate = (value) => {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return null;
  }
};

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("tümü");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    let isMounted = true;

    const loadBlogs = async () => {
      setLoading(true);

      try {
        const data = await fetchBlogs();
        if (!isMounted) return;
        setBlogs(Array.isArray(data) ? data : []);
      } catch {
        // Sessiz fallback: blogService zaten fallback döndürüyor; ekstra işlem yok
        if (isMounted) setBlogs([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBlogs();

    return () => {
      isMounted = false;
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
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(term);
        })
      : base;

    const filteredByCategory =
      selectedCategory === "tümü"
        ? filteredBySearch
        : filteredBySearch.filter((blog) => blog.category === selectedCategory);

    return filteredByCategory.sort((a, b) => {
      const first = new Date(
        a?.publishedAt || a?.updatedAt || a?.createdAt || 0
      );
      const second = new Date(
        b?.publishedAt || b?.updatedAt || b?.createdAt || 0
      );
      const featureWeight = (val) => (val ? 1 : 0);
      return (
        featureWeight(b?.featured) - featureWeight(a?.featured) ||
        second - first
      );
    });
  }, [blogs, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const unique = new Set();
    blogs.forEach((blog) => {
      if (blog?.category) {
        unique.add(blog.category);
      }
    });
    return ["tümü", ...Array.from(unique)];
  }, [blogs]);

  const featuredBlog = useMemo(() => {
    if (publishedBlogs.length === 0) {
      return null;
    }
    return publishedBlogs.find((blog) => blog.featured) ?? publishedBlogs[0];
  }, [publishedBlogs]);

  const remainingBlogs = useMemo(() => {
    if (!featuredBlog) {
      return publishedBlogs;
    }
    return publishedBlogs.filter((blog) => blog !== featuredBlog);
  }, [publishedBlogs, featuredBlog]);

  // Pagination: Calculate paginated blogs
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return remainingBlogs.slice(startIndex, endIndex);
  }, [remainingBlogs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(remainingBlogs.length / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  return (
    <>
      <style>{`
        body:has(.blog-page) .navbar-background-container {
          background-color: var(--color-secondary) !important;
        }
      `}</style>
      <Navbar />
      <ScrollToTop />
      <main className="blog-page" id="blog">
        <div className="blog-page__container">
          <header className="blog-page__hero">
            <span className="blog-page__hero-eyebrow">Blog</span>
            <h1 className="blog-page__hero-title">Zihin Günlüğü</h1>
            <p className="blog-page__hero-subtitle">
              Teknik keşifler, üretim süreçleri ve ilham veren deneyimler. Kodun
              arka planında neler olup bittiğini bu alan üzerinden paylaşıyorum.
            </p>
          </header>

          <div className="blog-page__filters" aria-live="polite">
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
            <label className="blog-search" htmlFor="blog-search">
              <span className="blog-search__label">Ara</span>
              <input
                id="blog-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Başlık, etiket veya kelime ara"
              />
            </label>
          </div>

          {loading ? (
            <LoadingSpinner message="Blog yazıları yükleniyor..." />
          ) : publishedBlogs.length === 0 ? (
            <p className="blog-page__empty">
              Henüz yayınlanmış blog yazısı bulunmuyor. Çok yakında yeni
              içerikler ekleyeceğim.
            </p>
          ) : (
            <>
              {featuredBlog ? (
                <article className="blog-featured" aria-label="Öne çıkan blog">
                  <div className="blog-featured__content">
                    <span className="blog-list__category">
                      {featuredBlog.category || "Genel"}
                    </span>
                    <h2 className="blog-featured__title">
                      {featuredBlog.title}
                    </h2>
                    <p className="blog-featured__excerpt">
                      {buildExcerpt(featuredBlog)}
                    </p>
                    <div className="blog-list__meta">
                      <span>
                        {formatDate(
                          featuredBlog?.publishedAt ||
                            featuredBlog?.updatedAt ||
                            featuredBlog?.createdAt
                        ) ?? "Yeni"}
                      </span>
                      {featuredBlog.readingTime ? (
                        <span>{`${featuredBlog.readingTime} dk okuma`}</span>
                      ) : null}
                      {featuredBlog.views ? (
                        <span>{`${featuredBlog.views} görüntülenme`}</span>
                      ) : null}
                    </div>
                    <Link
                      className="blog-featured__link"
                      to={`/blog/${
                        featuredBlog.slug || featuredBlog.id || featuredBlog._id
                      }`}
                    >
                      Yazıya dal →
                    </Link>
                  </div>
                  {featuredBlog.thumbnail?.url ||
                  featuredBlog.thumbnailUrl ||
                  featuredBlog.coverImage ? (
                    <div className="blog-featured__media">
                      <img
                        src={
                          featuredBlog.thumbnail?.url ||
                          featuredBlog.thumbnailUrl ||
                          featuredBlog.coverImage
                        }
                        alt={featuredBlog.title}
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                </article>
              ) : null}

              <div className="blog-list">
                {paginatedBlogs.map((blog, index) => {
                  const slug = blog?.slug || blog?.id || blog?._id;
                  const cardKey = slug || blog?.title || `blog-${index}`;
                  const publishedDate =
                    formatDate(
                      blog?.publishedAt || blog?.updatedAt || blog?.createdAt
                    ) ?? "Yeni";
                  const excerpt = buildExcerpt(blog) || "Devamı için tıklayın.";
                  const tags = Array.isArray(blog?.tags) ? blog.tags : [];

                  return (
                    <article key={cardKey} className="blog-list__item">
                      <div className="blog-list__item-header">
                        <span className="blog-list__category">
                          {blog.category || "Genel"}
                        </span>
                        {blog.featured ? (
                          <span className="blog-list__badge">Öne çıkan</span>
                        ) : null}
                      </div>
                      <h3 className="blog-list__title">{blog.title}</h3>
                      <div className="blog-list__meta">
                        <span>{publishedDate}</span>
                        {blog.readingTime ? (
                          <span>{`${blog.readingTime} dk okuma`}</span>
                        ) : null}
                      </div>
                      <p className="blog-list__excerpt">{excerpt}</p>
                      {tags.length > 0 ? (
                        <ul className="blog-list__tags">
                          {tags.slice(0, 4).map((tag) => (
                            <li key={`${cardKey}-${tag}`}>#{tag}</li>
                          ))}
                        </ul>
                      ) : null}
                      <Link className="blog-list__link" to={`/blog/${slug}`}>
                        Yazıyı oku
                      </Link>
                    </article>
                  );
                })}
              </div>

              {remainingBlogs.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={remainingBlogs.length}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(newItemsPerPage) => {
                    setItemsPerPage(newItemsPerPage);
                    setCurrentPage(1);
                  }}
                />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogListPage;