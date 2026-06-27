import React from "react";
import "./BlogTOC.css";

export const BlogTOC = ({ headings, activeId }) => {
  if (!headings || headings.length === 0) return null;

  return (
    <nav className="blog-toc" aria-label="İçindekiler">
      <h4 className="blog-toc-title">İçindekiler</h4>
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
    </nav>
  );
};

export default BlogTOC;
