import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "@shared/ui/LoadingSpinner.jsx";
import { fetchBlogBySlug } from "@modules/blog/services/blogService.js";
import { Navbar } from "@modules/navbar/components/Navbar/Navbar.jsx";
import Footer from "@modules/footer/components/Footer/Footer.jsx";
import "./styles/blog-pages.css";

const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").trim();

const buildSubtitle = (blog) => {
  if (!blog) return "";
  const baseContent =
    blog.subtitle ||
    blog.excerpt ||
    blog.summary ||
    stripHtml(blog.content ?? "");

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

const formatDateTime = (value) => {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return null;
  }
};

const formatNumber = (value) => {
  if (value === undefined || value === null) {
    return null;
  }
  return new Intl.NumberFormat("tr-TR").format(value);
};

const resolvePublisherName = (publisher) => {
  if (!publisher) return null;
  if (typeof publisher === "string") {
    return publisher;
  }

  if (typeof publisher === "object") {
    const profile = publisher.profile || {};
    const explicitName =
      publisher.fullName ||
      profile.fullName ||
      [profile.firstName, profile.lastName].filter(Boolean).join(" ");

    return (
      explicitName ||
      publisher.username ||
      publisher.email ||
      publisher.id ||
      null
    );
  }

  return null;
};

const resolveAnchor = (value) => {
  if (!value) return null;
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ğüşöçı\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) {
      // Geçersiz slug geldiğinde sessizce null bırak
      setBlog(null);
      return;
    }

    let isMounted = true;

    const loadBlog = async () => {
  setLoading(true);

      try {
        const data = await fetchBlogBySlug(slug);
        if (!isMounted) return;
        setBlog(data);
      } catch {
        if (!isMounted) return;
        // Sessiz fallback: service local blog döndürebilir veya null gelir
        setBlog(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBlog();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const tags = useMemo(
    () => (Array.isArray(blog?.tags) ? blog.tags : []),
    [blog]
  );

  const galleryImages = useMemo(() => {
    if (!Array.isArray(blog?.galleryImages)) {
      return [];
    }
    return blog.galleryImages
      .map((item, index) => ({
        key: item?.mediaId || item?._id || `gallery-${index}`,
        url: item?.url || item?.secure_url || item?.path,
        alt: item?.alt || item?.caption || blog?.title || "Blog görseli",
        caption: item?.caption || null,
        order: typeof item?.order === "number" ? item.order : index,
      }))
      .filter((image) => Boolean(image.url))
      .sort((a, b) => a.order - b.order);
  }, [blog]);

  const publishedStamp = useMemo(() => {
    if (!blog) {
      return "Yeni";
    }
    return (
      formatDate(blog?.publishedAt || blog?.updatedAt || blog?.createdAt) ||
      "Yeni"
    );
  }, [blog]);

  const updatedDate = useMemo(() => {
    if (!blog?.updatedAt) return null;
    return formatDateTime(blog.updatedAt);
  }, [blog?.updatedAt]);

  const scheduledDate = useMemo(() => {
    if (!blog?.scheduledFor) return null;
    return formatDateTime(blog.scheduledFor);
  }, [blog?.scheduledFor]);

  const publisherName = useMemo(() => {
    if (!blog) return null;
    return resolvePublisherName(
      blog.publisher || blog.publishedBy || blog.authorDetails || blog.author
    );
  }, [blog]);

  const quickFacts = useMemo(() => {
    if (!blog) return [];
    const items = [];

    if (blog.readingTime) {
      items.push({ label: "Tahmini okuma", value: `${blog.readingTime} dk` });
    }

    if (publisherName) {
      items.push({ label: "Yayıncı", value: publisherName });
    }

    if (publishedStamp) {
      items.push({ label: "Yayınlandı", value: publishedStamp });
    }
    if (updatedDate) {
      items.push({ label: "Güncellendi", value: updatedDate });
    }
    if (scheduledDate && blog.status === "scheduled") {
      items.push({ label: "Planlanan yayın", value: scheduledDate });
    }
    if (blog.category) {
      items.push({ label: "Kategori", value: blog.category });
    }

    return items;
  }, [blog, publisherName, publishedStamp, scheduledDate, updatedDate]);

  const metaStats = useMemo(() => {
    if (!blog) return [];
    const stats = [];
    if (blog.views !== undefined && blog.views !== null) {
      stats.push({ label: "Görüntülenme", value: formatNumber(blog.views) });
    }
    if (blog.likes !== undefined && blog.likes !== null) {
      stats.push({ label: "Beğeni", value: formatNumber(blog.likes) });
    }
    if (blog.shares !== undefined && blog.shares !== null) {
      stats.push({ label: "Paylaşım", value: formatNumber(blog.shares) });
    }
    return stats;
  }, [blog]);

  const tableOfContents = useMemo(() => {
    if (!Array.isArray(blog?.tableOfContents)) {
      return [];
    }
    return blog.tableOfContents
      .map((item, index) => ({
        key: item?.anchor || item?.title || `toc-${index}`,
        ...item,
        anchor: resolveAnchor(item?.anchor || item?.title || `toc-${index}`),
        level: Math.min(Math.max(item?.level ?? 1, 1), 6),
      }))
      .filter((item) => item.title);
  }, [blog]);

  const revisions = useMemo(() => {
    if (!Array.isArray(blog?.revisions)) {
      return [];
    }
    return [...blog.revisions]
      .map((revision, index) => ({
        key: revision?._id || `revision-${index}`,
        ...revision,
        modifiedAtFormatted: formatDateTime(revision?.modifiedAt),
      }))
      .sort((a, b) => (b?.modifiedAt ?? 0) - (a?.modifiedAt ?? 0));
  }, [blog]);

  const heroSubtitle = useMemo(() => buildSubtitle(blog), [blog]);
  const contentHtml = useMemo(
    () =>
      blog?.content ||
      "<p>Bu içerik henüz hazır değil, lütfen daha sonra tekrar kontrol edin.</p>",
    [blog?.content]
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="blog-page blog-page--detail">
          <div className="blog-page__container">
            <LoadingSpinner message="Blog yazısı yükleniyor..." />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <main className="blog-page blog-page--detail">
          <div className="blog-page__container">
            <p className="blog-page__empty">
              Bu yazı bulunamadı veya henüz yayınlanmadı. Ana sayfaya
              dönmek için aşağıya tıklayın.
            </p>
            <Link className="blog-back-link" to="/blog">
              ← Blog ana sayfasına dön
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="blog-page blog-page--detail">
        <div className="blog-page__container">
          <header className="blog-page__hero blog-page__hero--detail">
            <div className="blog-page__hero-meta">
              <span className="blog-page__hero-eyebrow">
                {blog.category || "Genel"}
              </span>
              <span className="blog-page__hero-date">{publishedStamp}</span>
            </div>
            <h1 className="blog-page__hero-title">{blog.title}</h1>
            <p className="blog-page__hero-subtitle">{heroSubtitle}</p>
            {tags.length > 0 ? (
              <ul className="blog-tag-cloud">
                {tags.map((tag) => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
            ) : null}
          </header>

          {metaStats.length > 0 ? (
            <section
              className="blog-detail__stats"
              aria-label="Etkileşim istatistikleri"
            >
              {metaStats.map((item) => (
                <div key={item.label} className="blog-detail__stats-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </section>
          ) : null}

          <section className="blog-detail__layout">
            <article
              className="blog-detail__content"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </section>

          <section
            className="blog-detail__meta"
            aria-label="Blog özet bilgileri"
          >
            <div className="blog-detail__card">
              <h2>Yer imi notları</h2>
              <ul>
                {quickFacts.map((fact) => (
                  <li key={fact.label}>
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </li>
                ))}
              </ul>
            </div>

            {tableOfContents.length > 0 ? (
              <nav className="blog-detail__card" aria-label="İçindekiler">
                <h2>İçindekiler</h2>
                <ol className="blog-toc">
                  {tableOfContents.map((item) => (
                    <li key={item.key} data-level={item.level}>
                      {item.title}
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}

            {revisions.length > 0 ? (
              <div
                className="blog-detail__card blog-revisions"
                aria-label="Revizyon geçmişi"
              >
                <h2>Revizyonlar</h2>
                <ul>
                  {revisions.map((revision) => (
                    <li key={revision.key}>
                      <strong>
                        {revision.modifiedAtFormatted || "Bilinmiyor"}
                      </strong>
                      <p>
                        {revision.changeNote || "Güncelleme"} ·{" "}
                        {revision.modifiedBy?.username || "Anonim"}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          {galleryImages.length > 0 ? (
            <section className="blog-gallery" aria-label="Galeri">
              <h2>Galeri</h2>
              <div className="blog-gallery__grid">
                {galleryImages.map((image) => (
                  <figure key={image.key} className="blog-gallery__item">
                    <img src={image.url} alt={image.alt} loading="lazy" />
                    {image.caption ? (
                      <figcaption>{image.caption}</figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          <footer className="blog-detail__footer">
            <div className="blog-detail__cta">
              <span>Yeni bir keşif için hazır mısın?</span>
              <Link className="blog-detail__cta-link" to="/blog">
                Tüm yazılara dön →
              </Link>
            </div>
            <Link className="blog-back-link" to="/blog">
              ← Blog ana sayfasına dön
            </Link>
          </footer>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogDetailPage;
