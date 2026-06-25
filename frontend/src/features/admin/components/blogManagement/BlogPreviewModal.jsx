import { X, Clock, Eye, ExternalLink } from "lucide-react";
import { toTagsArray } from "../../utils/blogManagement";
import "./BlogCard.css";

const BlogPreviewModal = ({ blog, isOpen, onClose }) => {
  if (!isOpen || !blog) return null;

  const tags = toTagsArray(blog.tags);
  const readingTime = blog.readingTime ?? 0;
  const views = blog.views ?? 0;

  return (
    <div className="blog-preview-overlay" onClick={onClose}>
      <div className="blog-preview" onClick={(e) => e.stopPropagation()}>
        <div className="blog-preview__header">
          <h2 className="blog-preview__title">{blog.title}</h2>
          <button type="button" className="admin-btn-icon" onClick={onClose} title="Kapat">
            <X size={18} />
          </button>
        </div>

        <div className="blog-preview__meta">
          {blog.category && <span className="blog-preview__category">{blog.category}</span>}
          <span className="blog-preview__stat"><Clock size={14} /> {readingTime} dk</span>
          <span className="blog-preview__stat"><Eye size={14} /> {views}</span>
          {blog.slug && (
            <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" className="blog-preview__live-link">
              <ExternalLink size={14} /> Canli
            </a>
          )}
        </div>

        {tags.length > 0 && (
          <div className="blog-preview__tags">
            {tags.map((t) => <span key={t} className="blog-card__tag">{t}</span>)}
          </div>
        )}

        <div
          className="blog-preview__content"
          dangerouslySetInnerHTML={{ __html: blog.contentHtml || blog.content || "" }}
        />

        {blog.excerpt && !blog.contentHtml && (
          <p className="blog-preview__excerpt">{blog.excerpt}</p>
        )}
      </div>
    </div>
  );
};

export default BlogPreviewModal;
