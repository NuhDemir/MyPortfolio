import React from "react";
import CommentsHeaderSvg from "../../assets/icons/comments/commentsHeader.svg";

const CommentsHeader = () => {
  return (
    <div className="comments-header">
      <img src={CommentsHeaderSvg} />
    </div>
  );
};

export default CommentsHeader;
