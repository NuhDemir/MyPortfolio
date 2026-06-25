import "@shared/design-system/components/LoadingSpinner.css";

const LoadingSpinner = ({ message = "Yükleniyor...", size = "medium", overlay = false }) => {
  const Component = overlay ? "div" : "div";
  return (
    <Component
      className={overlay ? "ds-spinner--overlay" : "ds-spinner"}
      role="status"
      aria-live="polite"
    >
      <div
        className={`ds-spinner__ring ${size === "small" ? "ds-spinner__ring--sm" : size === "large" ? "ds-spinner__ring--lg" : ""}`}
        aria-hidden="true"
      />
      {message && <p className="ds-spinner__text">{message}</p>}
    </Component>
  );
};

export default LoadingSpinner;
