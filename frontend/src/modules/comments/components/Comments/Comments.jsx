import React, { useState } from "react";
import "./style/Comments.scss";
import CommentsHeader from "./CommentsHeader";
import comments from "@modules/comments/data/comments.json";

const Comments = () => {
  const [activeComment, setActiveComment] = useState(null);

  const handleCommentClick = (index) => {
    setActiveComment(index === activeComment ? null : index);
  };

  return (
    <div className="comments-container">
      <CommentsHeader />
      <div className="comments">
        {comments.map((comment, index) => (
          <div
            className={`comment-item ${
              activeComment === index ? "active" : ""
            }`}
            key={index}
            onClick={() => handleCommentClick(index)}
          >
            <div className="comment-content">
              <div className="text">{comment.text}</div>
              <div className="username">{comment.username}</div>
              <div className="job-title">{comment.jobTitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
