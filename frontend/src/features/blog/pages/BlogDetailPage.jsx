import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, User, Calendar, RefreshCw, Eye, Database } from "lucide-react";
import { LoadingSpinner, useDominantColor } from "@shared";
import { CommentSection } from "@features/blog";
import { useBlogDetail } from "../hooks/useBlogDetail.js";
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
    </main>
  );
};

export default BlogDetailPage;
