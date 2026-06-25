import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "@shared";
import { CommentSection } from "@features/blog";
import { useBlogDetail } from "../hooks/useBlogDetail.js";
import {
  buildSubtitle,
  formatToLocaleDate,
  resolvePublisherName,
  resolveBlogThumbnail,
} from "../utils/blogFormatters.js";
import "./styles/blog-detail.css";

const motionConfig = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  },
  fadeUp: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0, 0, 1] } }
  }
};

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
      <motion.div
        className="blog-page__container"
        variants={motionConfig.container}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={motionConfig.fadeUp}>
          <Link to="/blog" className="blog-detail__back">
            <ArrowLeft size={16} />
            Blog'a don
          </Link>
        </motion.div>

        <motion.header className={`blog-hero ${metaData.thumbnail ? "blog-hero--has-image" : ""}`} variants={motionConfig.fadeUp}>
          {metaData.thumbnail && (
            <div className="blog-hero__bg">
              <img src={metaData.thumbnail} alt={blog.title} className="blog-hero__img" />
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
        </motion.header>

        <motion.section className="blog-detail__layout" variants={motionConfig.fadeUp}>
          <article className="blog-detail__content"
            dangerouslySetInnerHTML={{ __html: blog.content || "<p>Icerik hazirlik asamasinda.</p>" }} />
        </motion.section>

        <motion.section className="blog-detail__meta" variants={motionConfig.fadeUp}>
          <div className="blog-detail__card">
            <h2>Icerik Kunyesi</h2>
            <ul>
              {metaData.publisher && <li><span>Yazar</span><strong>{metaData.publisher}</strong></li>}
              {blog.readingTime && <li><span>Okuma Suresi</span><strong>{blog.readingTime} dk</strong></li>}
              {metaData.updatedAt && <li><span>Son Guncelleme</span><strong>{metaData.updatedAt}</strong></li>}
              <li><span>Veri Kaynagi</span><strong>{dataSource === "live" ? "Canli Sunucu" : "Lokal Onbellek"}</strong></li>
            </ul>
          </div>
        </motion.section>

        {(blog._id || blog.id) && (
          <motion.div className="blog-detail__layout" variants={motionConfig.fadeUp}>
            <CommentSection blogId={blog._id || blog.id} />
          </motion.div>
        )}
      </motion.div>
    </main>
  );
};

export default BlogDetailPage;
