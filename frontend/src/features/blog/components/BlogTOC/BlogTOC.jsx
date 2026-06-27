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

  const tocContentJsx = (
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
              // Fallback to searching by text if ID is wiped out by React dangerouslySetInnerHTML
              let target = document.getElementById(heading.id);
              if (!target) {
                target = Array.from(document.querySelectorAll("h2, h3")).find(
                  (el) => el.innerText === heading.text
                );
              }
              
              if (target) {
                // Delay scroll to prevent React state updates from cancelling the scroll
                // Calculate position inside timeout so it accounts for layout shifts after menu closes
                setTimeout(() => {
                  const navbarHeight = 80;
                  const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 32;
                  
                  window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                  });
                }, 50);
                
                window.history.pushState(null, "", `#${heading.id}`);
              } else {
                console.error("TOC scroll failed: Element not found", heading);
              }
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
          {tocContentJsx}
        </div>
      </div>
    );
  }

  return (
    <nav className="blog-toc" aria-label="İçindekiler">
      <h4 className="blog-toc-title">İçindekiler</h4>
      {tocContentJsx}
    </nav>
  );
};

export default BlogTOC;
