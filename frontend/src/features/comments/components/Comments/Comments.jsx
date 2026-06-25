import { useState } from "react";
import { Reveal, LoadingSpinner } from "@shared";
import { useComments } from "../../hooks/useComments.js";
import "./Comments.css";

const Comments = () => {
  const { comments, loading } = useComments();
  const [activeCard, setActiveCard] = useState(null);

  if (loading) {
    return (
      <section className="cs">
        <h2 className="cs__heading">Yorumlar</h2>
        <LoadingSpinner />
      </section>
    );
  }

  if (!comments.length) return null;

  return (
    <section className="cs">
      <h2 className="cs__heading">Yorumlar</h2>

      <ul className="cs__list">
        {comments.map((comment, i) => (
          <Reveal key={comment.id} as="li" threshold={0.12}>
            <div
              className={`cs__card${activeCard === i ? " cs__card--active" : ""}`}
              onClick={() => setActiveCard(i === activeCard ? null : i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") setActiveCard(i === activeCard ? null : i);
              }}
              aria-expanded={activeCard === i}
            >
              <span className="cs__quote" aria-hidden="true">&ldquo;</span>
              <p className="cs__text">{comment.text}</p>
              <footer className="cs__footer">
                <strong className="cs__name">{comment.username}</strong>
                <span className="cs__role">{comment.jobTitle}</span>
              </footer>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
};

export default Comments;
