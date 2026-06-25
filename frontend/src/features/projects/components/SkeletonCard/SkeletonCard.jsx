import "./SkeletonCard.css";

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-card__image" />
    <div className="skeleton-card__content">
      <div className="skeleton-card__line skeleton-card__line--title" />
      <div className="skeleton-card__line skeleton-card__line--body" />
      <div className="skeleton-card__line skeleton-card__line--body skeleton-card__line--short" />
    </div>
  </div>
);

export default SkeletonCard;
