import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchBlogs } from "../../services/blogService";
import { resolveBlogThumbnail, buildExcerpt } from "../../utils/blogFormatters";
import "./NextPostTeaser.css";

export const NextPostTeaser = ({ currentBlogId }) => {
  const [nextBlog, setNextBlog] = useState(null);

  useEffect(() => {
    const loadNextBlog = async () => {
      const blogs = await fetchBlogs();
      // Filter out the current blog and published only
      const published = blogs.filter(b => b.status === "published" && (b._id !== currentBlogId && b.id !== currentBlogId));
      
      if (published.length > 0) {
        // Pick random or just the first one
        const randomIndex = Math.floor(Math.random() * published.length);
        setNextBlog(published[randomIndex]);
      }
    };
    
    loadNextBlog();
  }, [currentBlogId]);

  if (!nextBlog) return null;

  const thumbnail = resolveBlogThumbnail(nextBlog);
  const slug = nextBlog.slug || nextBlog._id;

  return (
    <div className="next-post-teaser-wrapper">
      <h3 className="next-post-teaser-label">Sıradaki Yazı</h3>
      <Link to={`/blog/${slug}`} className="next-post-teaser">
        {thumbnail && (
          <div className="next-post-bg">
            <img src={thumbnail} alt={nextBlog.title} crossOrigin="anonymous" />
            <div className="next-post-overlay" />
          </div>
        )}
        <div className="next-post-content">
          <span className="next-post-category">{nextBlog.category || "Genel"}</span>
          <h2>{nextBlog.title}</h2>
          <p>{buildExcerpt(nextBlog.content, 120)}</p>
          <span className="next-post-read-btn">
            Okumaya Devam Et <ArrowRight size={18} />
          </span>
        </div>
      </Link>
    </div>
  );
};

export default NextPostTeaser;
