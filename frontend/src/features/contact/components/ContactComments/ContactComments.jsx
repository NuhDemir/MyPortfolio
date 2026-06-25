import { Reveal } from "@shared";
import comments from "@features/comments/data/comments.json";
import "./ContactComments.css";

export const ContactComments = () => (
  <div className="cc">
    <h2 className="cc__heading">Yorumlar</h2>

    <ul className="cc__list">
      {comments.map((comment) => (
        <Reveal key={comment.id} as="li" threshold={0.15}>
          <div className="cc__card">
            <span className="cc__quote" aria-hidden="true">&ldquo;</span>
            <p className="cc__text">{comment.text}</p>
            <footer className="cc__footer">
              <strong className="cc__name">{comment.username}</strong>
              <span className="cc__role">{comment.jobTitle}</span>
            </footer>
          </div>
        </Reveal>
      ))}
    </ul>
  </div>
);
