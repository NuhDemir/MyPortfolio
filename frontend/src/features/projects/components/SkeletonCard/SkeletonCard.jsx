import "./SkeletonCard.css";

const SkeletonCard = () => (
  <div className="sk-card" aria-hidden="true">
    <div className="sk-card__media" />
    <div className="sk-card__body">
      <div className="sk-card__line sk-card__line--title" />
      <div className="sk-card__line sk-card__line--text" />
      <div className="sk-card__line sk-card__line--text sk-card__line--short" />
    </div>
  </div>
);

export default SkeletonCard;
