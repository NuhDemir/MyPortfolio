// src/components/Comments/CommentsHeader.jsx (veya dosya yolu neyse)
import React from "react";
import useCommentHeaderAnimation from "../../hooks/useCommentHeaderAnimation"; // Yeni hook'u import et
import "./style/Comments.scss"; // Veya ilgili CSS dosyanız

const COMMENTS_HEADER_SVG_PATH = "https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947718/portfolio/public/assets/icons/comments/commentsHeader.svg";

const CommentsHeader = () => {
  // Animasyon hook'unu çağır ve ref'i al
  const { headerRef } = useCommentHeaderAnimation();

  return (
    // Ref'i ana div'e bağla
    <div className="comments-header" ref={headerRef}>
      {/* Resim elemanı */}
      <img src={COMMENTS_HEADER_SVG_PATH} alt="Yorumlar Başlığı" />{" "}
      {/* alt etiketi ekledim */}
    </div>
  );
};

export default CommentsHeader;
