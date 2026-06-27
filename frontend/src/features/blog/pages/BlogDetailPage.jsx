import React, { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, User, Calendar, RefreshCw, Eye, Database, Heart, Mail } from "lucide-react";
import { LoadingSpinner, useDominantColor } from "@shared";
import { CommentSection } from "@features/blog";
import { useBlogDetail } from "../hooks/useBlogDetail.js";
import { useLikeBlog } from "../hooks/useLikeBlog.js";
import { NewsletterModal } from "../components/Newsletter/NewsletterModal.jsx";
import {
  buildSubtitle,
  formatToLocaleDate,
  resolvePublisherName,
  resolveBlogThumbnail,
} from "../utils/blogFormatters.js";
import "./styles/blog-detail.css";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { blog, loading, dataSource } = useBlogDetail(slug);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [hasScrolledPast, setHasScrolledPast] = useState(false);
  const blogId = blog?._id || blog?.id;
  const { likes, isLiked, isLiking, handleLike } = useLikeBlog(blogId, blog?.likes || 0);

  const metaData = useMemo(() => {
    if (!blog) return null;
    return {
      publishedAt: formatToLocaleDate(blog.publishedAt || blog.updatedAt || blog.createdAt) || "Yeni",
      updatedAt: blog.updatedAt ? formatToLocaleDate(blog.updatedAt) : null,
      publisher: resolvePublisherName(blog.publisher || blog.authorDetails),
      subtitle: buildSubtitle(blog),
      tags: Array.isArray(blog.tags) ? blog.tags : [],
      thumbnail: resolveBlogThumbnail(blog),
    };
  }, [blog]);

  const glowColor = useDominantColor(metaData?.thumbnail);

  const showMetaBar = metaData && (metaData.publisher || blog.readingTime || metaData.publishedAt);

  // Auto-open newsletter modal when scrolling past 80%
  useEffect(() => {
    const handleScroll = () => {
      if (hasScrolledPast) return;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollY / (docHeight - winHeight);
      
      if (scrollPercent > 0.8) {
        setIsNewsletterOpen(true);
        setHasScrolledPast(true);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolledPast]);

  if (loading && !blog) {
    return (
      <main className="blog-page">
        <div className="blog-page__container blog-page__centered">
          <LoadingSpinner message="Icerik yukleniyor..." />
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="blog-page">
        <div className="blog-page__container blog-page__centered">
          <h1 className="blog-hero__title">Yazi Bulunamadi</h1>
          <p className="blog-hero__subtitle">Aradiginiz icerik silinmis veya yayindan kaldirilmis olabilir.</p>
          <Link className="premium-btn" style={{ marginTop: "var(--ds-space-6)" }} to="/blog">Blog Sayfasina Don</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="blog-page">
      <div className="blog-page__glow" style={{ "--glow-color": glowColor }} />
      <div className="blog-page__container">
        <Link to="/blog" className="blog-detail__back">
          <ArrowLeft size={16} />
          Blog'a don
        </Link>

        <header className={`blog-hero ${metaData.thumbnail ? "blog-hero--has-image" : ""}`}>
          {metaData.thumbnail && (
            <div className="blog-hero__bg">
              <img src={metaData.thumbnail} alt={blog.title} className="blog-hero__img" crossOrigin="anonymous" />
              <div className="blog-hero__overlay" />
            </div>
          )}

          <div className="blog-hero__content">
            <div className="blog-hero__meta">
              <span className="blog-hero__category">{blog.category || "Genel"}</span>
              {blog.readingTime && <span className="blog-hero__reading">{blog.readingTime} dk okuma</span>}
              <span className="blog-hero__date">{metaData.publishedAt}</span>
            </div>

            <h1 className="blog-hero__title">{blog.title}</h1>
            <p className="blog-hero__subtitle">{metaData.subtitle}</p>

            {metaData.tags.length > 0 && (
              <div className="blog-hero__tags">
                {metaData.tags.map((tag) => (
                  <span key={tag} className="blog-hero__tag">{tag}</span>
                ))}
              </div>
            )}

            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <button
                onClick={handleLike}
                disabled={isLiked || isLiking}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "24px",
                  border: `1px solid ${isLiked ? "#ef4444" : "rgba(255,255,255,0.2)"}`,
                  backgroundColor: isLiked ? "rgba(239, 68, 68, 0.15)" : "rgba(255,255,255,0.1)",
                  color: isLiked ? "#ef4444" : "#ffffff",
                  cursor: isLiked ? "default" : "pointer",
                  transition: "all 0.2s ease",
                  backdropFilter: "blur(10px)",
                }}
                className={!isLiked ? "like-btn-hover" : ""}
                title={isLiked ? "Bu yazıyı zaten beğendiniz" : "Yazıyı beğen"}
              >
                <Heart size={18} fill={isLiked ? "#ef4444" : "none"} />
                <span style={{ fontWeight: "600" }}>{likes.toLocaleString("tr-TR")}</span>
              </button>

              <button
                onClick={() => setIsNewsletterOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "24px",
                  border: "1px solid rgba(59, 130, 246, 0.5)",
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  color: "#3b82f6",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backdropFilter: "blur(10px)",
                  fontWeight: "600",
                }}
                className="newsletter-btn-hover"
              >
                <Mail size={18} />
                Bültene Abone Ol
              </button>

              <style>{`
                .like-btn-hover:hover, .newsletter-btn-hover:hover {
                  background-color: rgba(255,255,255,0.2) !important;
                  transform: scale(1.05);
                }
                .like-btn-hover:active, .newsletter-btn-hover:active {
                  transform: scale(0.95);
                }
                .newsletter-btn-hover:hover {
                  background-color: rgba(59, 130, 246, 0.3) !important;
                  color: #fff !important;
                  border-color: #3b82f6 !important;
                }
              `}</style>
            </div>
          </div>
        </header>

        <section className="blog-detail__layout">
          <article className="blog-detail__content"
            dangerouslySetInnerHTML={{ __html: blog.content || "<p>Icerik hazirlik asamasinda.</p>" }} />
        </section>

        {showMetaBar && (
          <section className="blog-detail__credits" aria-label="Icerik Kunyesi">
            <div className="blog-credits">
              <div className="blog-credits__row">
                {metaData.publisher && (
                  <span className="blog-credits__item">
                    <User size={14} className="blog-credits__icon" />
                    <span className="blog-credits__label">Yazan</span>
                    <span className="blog-credits__value">{metaData.publisher}</span>
                  </span>
                )}
                {blog.readingTime && (
                  <span className="blog-credits__item">
                    <Clock size={14} className="blog-credits__icon" />
                    <span className="blog-credits__value">{blog.readingTime} dk okuma</span>
                  </span>
                )}
                {blog.views != null && blog.views > 0 && (
                  <span className="blog-credits__item">
                    <Eye size={14} className="blog-credits__icon" />
                    <span className="blog-credits__value">{blog.views.toLocaleString("tr-TR")} okunma</span>
                  </span>
                )}
              </div>

              <div className="blog-credits__row">
                <span className="blog-credits__item">
                  <Calendar size={14} className="blog-credits__icon" />
                  <span className="blog-credits__label">Yayin</span>
                  <span className="blog-credits__value">{metaData.publishedAt}</span>
                </span>
                {metaData.updatedAt && metaData.updatedAt !== metaData.publishedAt && (
                  <span className="blog-credits__item">
                    <RefreshCw size={14} className="blog-credits__icon" />
                    <span className="blog-credits__label">Guncelleme</span>
                    <span className="blog-credits__value">{metaData.updatedAt}</span>
                  </span>
                )}
              </div>

              <span className="blog-credits__source">
                <Database size={12} />
                {dataSource === "live" ? "Canli" : "Onbellek"}
              </span>
            </div>
          </section>
        )}

        {(blog._id || blog.id) && (
          <div className="blog-detail__layout">
            <CommentSection blogId={blog._id || blog.id} />
          </div>
        )}
      </div>

      <NewsletterModal 
        isOpen={isNewsletterOpen} 
        onClose={() => setIsNewsletterOpen(false)} 
      />
    </main>
  );
};

export default BlogDetailPage;
