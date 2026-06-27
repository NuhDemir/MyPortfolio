import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "./BlogTOC.css";

export const BlogTOC = ({ headings, activeId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!headings || headings.length === 0) return null;

  const TocContent = () => (
    <ul className="blog-toc-list">
      {headings.map((heading) => (
        <li 
          key={heading.id} 
          className={`blog-toc-item level-${heading.level} ${activeId === heading.id ? "active" : ""}`}
        >
          <a 
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              if (isMobile) setIsOpen(false);
              document.getElementById(heading.id)?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (isMobile) {
    return (
      <div className="blog-toc-mobile">
        <button 
          className="blog-toc-mobile-header" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span>İçindekiler</span>
          <ChevronDown 
            size={18} 
            className={`blog-toc-mobile-icon ${isOpen ? "open" : ""}`} 
          />
        </button>
        <div className={`blog-toc-mobile-content ${isOpen ? "open" : ""}`}>
          <TocContent />
        </div>
      </div>
    );
  }

  return (
    <nav className="blog-toc" aria-label="İçindekiler">
      <h4 className="blog-toc-title">İçindekiler</h4>
      <TocContent />
    </nav>
  );
};

export default BlogTOC;
