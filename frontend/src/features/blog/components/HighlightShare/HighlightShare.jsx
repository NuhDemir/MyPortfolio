import React from "react";
import { Twitter, Linkedin } from "lucide-react";
import "./HighlightShare.css";

export const HighlightShare = ({ selection }) => {
  if (!selection.show) return null;

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`"${selection.text}"`);

    let shareUrl = "";
    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div 
      className="highlight-share-tooltip"
      style={{ top: `${selection.y}px`, left: `${selection.x}px` }}
    >
      <button onClick={() => handleShare("twitter")} aria-label="X'te Paylaş">
        <Twitter size={16} />
      </button>
      <div className="highlight-divider" />
      <button onClick={() => handleShare("linkedin")} aria-label="LinkedIn'de Paylaş">
        <Linkedin size={16} />
      </button>
    </div>
  );
};

export default HighlightShare;
