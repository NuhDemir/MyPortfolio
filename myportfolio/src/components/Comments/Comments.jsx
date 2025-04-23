import React, { useState } from "react";
import "./style/Comments.scss";
import CommentsHeader from "./CommentsHeader";

const Comments = () => {
  const [activeComment, setActiveComment] = useState(null);

  const comments = [
    {
      text: "Kardeşim önce backend başlanır",
      username: "İbrahim Erbilen",
      jobTitle: "Backend Developer",
    },
    {
      text: "Soft bir tasarım olacak",
      username: "Hamza Doğan",
      jobTitle: "Frontend Developer",
    },
    {
      text: "Biz bir aileyiz",
      username: "Nazmi Koçak",
      jobTitle: "Backend Developer",
    },
    {
      text: "Patronumuz ne derse o olacak",
      username: "Ferhan Hacısalihoğlu",
      jobTitle: "Game Developer",
    },
  ];

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
