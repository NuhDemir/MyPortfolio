import { useRef, useEffect, useCallback } from "react";
import { Pencil, Trash2, Eye, ExternalLink, Star, Copy, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import { PatternBackground } from "@shared";
import { resolveBlogId, resolveThumbnailUrl, toTagsArray } from "../../utils/blogManagement";
import "./BlogCard.css";

const BlogCardGrid = ({ blogs, loading, hasMore, onLoadMore, onEdit, onDelete, onToggleStatus, onToggleFeatured, onPreview, onDuplicate, onCopySlug }) => {
  const sentinelRef = useRef(null);

  const handleIntersect = useCallback((entries) => {
    if (entries[0]?.isIntersecting && hasMore && !loading) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <div className="blog-cards">
      {blogs.map((blog) => {
        const blogId = resolveBlogId(blog);
        const thumb = resolveThumbnailUrl(blog);
        const isPublished = Boolean(blog.isPublished);
        const isFeatured = Boolean(blog.featured || blog.isFeatured);
        const tags = toTagsArray(blog.tags).slice(0, 3);
        const views = blog.views ?? 0;
        const readingTime = blog.readingTime ?? 0;
        const commentCount = blog.commentCount ?? 0;

        return (
          <div key={blogId || blog._id} className={`blog-card ${!isPublished ? "blog-card--draft" : ""}`}>
            <div className="blog-card__cover" onClick={() => onPreview(blog)}>
              {thumb ? (
                <img src={thumb} alt={blog.title} className="blog-card__img" loading="lazy" />
              ) : (
                <PatternBackground seed={blogId || blog.title} opacity={0.18} />
              )}

              <div className="blog-card__overlay">
                <Eye size={18} />
              </div>

              {isFeatured && (
                <span className="blog-card__featured-badge"><Star size={10} /></span>
              )}
            </div>

            <div className="blog-card__body">
              <div className="blog-card__header">
                <h3 className="blog-card__title">{blog.title}</h3>
                <div className="blog-card__quick-actions">
                  <button type="button" className="admin-btn-icon" title={isPublished ? "Taslak yap" : "Yayinla"} onClick={() => onToggleStatus(blog)}>
                    {isPublished ? <XCircle size={14} /> : <CheckCircle size={14} />}
                  </button>
                  <button type="button" className={`admin-btn-icon ${isFeatured ? "admin-btn-icon--active" : ""}`} title={isFeatured ? "One cikandan kaldir" : "One cikar"} onClick={() => onToggleFeatured(blog)}>
                    <Star size={14} />
                  </button>
                  <button type="button" className="admin-btn-icon" title="Blog'u kopyala" onClick={() => onDuplicate(blog)}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              <div className="blog-card__meta">
                {blog.category && <span className="blog-card__category">{blog.category}</span>}
                <span className="blog-card__reading">{readingTime}d okuma</span>
                {commentCount > 0 && <span className="blog-card__comments">{commentCount} yorum</span>}
                <span className="blog-card__views">{views} goruntuleme</span>
              </div>

              {tags.length > 0 && (
                <div className="blog-card__tags">
                  {tags.map((tag) => <span key={tag} className="blog-card__tag">{tag}</span>)}
                </div>
              )}

              <div className="blog-card__actions">
                <button type="button" className="admin-btn-icon" title="Duzenle" onClick={() => onEdit(blog)}>
                  <Pencil size={14} />
                </button>
                <button type="button" className="admin-btn-icon" title="Slug kopyala" onClick={() => onCopySlug(blog)}>
                  <MoreHorizontal size={14} />
                </button>
                {blog.slug && (
                  <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" className="admin-btn-icon" title="Canli goruntule">
                    <ExternalLink size={14} />
                  </a>
                )}
                <button type="button" className="admin-btn-icon admin-btn-icon--danger" title="Sil" onClick={() => onDelete(blog)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div ref={sentinelRef} className="blog-cards__sentinel">
        {loading && <span className="blog-cards__loading">Yukleniyor...</span>}
      </div>

      {blogs.length === 0 && !loading && (
        <div className="admin-empty-state">Gosterilecek blog yazisi bulunamadi.</div>
      )}
    </div>
  );
};

export default BlogCardGrid;
