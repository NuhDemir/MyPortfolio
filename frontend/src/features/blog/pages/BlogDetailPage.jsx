import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
      updatedAt: blog.updatedAt ? formatToLocaleDate(blog.updatedAt, true) : null,
      publisher: resolvePublisherName(blog.publisher || blog.authorDetails),
      subtitle: buildSubtitle(blog),
      tags: Array.isArray(blog.tags) ? blog.tags : [],
      thumbnail: resolveBlogThumbnail(blog),
    };
  }, [blog]);

  const glowColor = useDominantColor(metaData?.thumbnail);

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

        <section className="blog-detail__meta">
          <div className="blog-detail__card">
            <h2>Icerik Kunyesi</h2>
            <ul>
              {metaData.publisher && <li><span>Yazar</span><strong>{metaData.publisher}</strong></li>}
              {blog.readingTime && <li><span>Okuma Suresi</span><strong>{blog.readingTime} dk</strong></li>}
              {metaData.updatedAt && <li><span>Son Guncelleme</span><strong>{metaData.updatedAt}</strong></li>}
              <li><span>Veri Kaynagi</span><strong>{dataSource === "live" ? "Canli Sunucu" : "Lokal Onbellek"}</strong></li>
            </ul>
          </div>
        </section>

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
