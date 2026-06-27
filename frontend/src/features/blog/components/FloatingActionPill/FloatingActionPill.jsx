import React, { useState, useEffect } from "react";
import { Heart, MessageSquare, Share2, ArrowUp } from "lucide-react";
import "./FloatingActionPill.css";

export const FloatingActionPill = ({ 
  likes, 
  isLiked, 
  isLiking, 
  onLike, 
  onCommentClick 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show pill after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link kopyalandı!");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`floating-action-pill-wrapper ${isVisible ? "visible" : ""}`}>
      <div className="floating-action-pill">
        <button 
          className={`pill-btn like-btn ${isLiked ? "liked" : ""}`}
          onClick={onLike}
          disabled={isLiked || isLiking}
          aria-label="Beğen"
        >
          <Heart size={20} fill={isLiked ? "#ef4444" : "none"} />
          <span className="pill-count">{likes}</span>
        </button>

        <div className="pill-divider" />

        <button 
          className="pill-btn"
          onClick={onCommentClick}
          aria-label="Yorumlara git"
        >
          <MessageSquare size={20} />
        </button>

        <div className="pill-divider" />

        <button 
          className="pill-btn"
          onClick={handleShare}
          aria-label="Paylaş"
        >
          <Share2 size={20} />
        </button>

        <div className="pill-divider" />

        <button 
          className="pill-btn top-btn"
          onClick={scrollToTop}
          aria-label="Yukarı çık"
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </div>
  );
};

export default FloatingActionPill;
