import "@shared/styles/base/components.css";

const LoadingSpinner = ({
  message = "Yükleniyor...",
  size = "medium",
  overlay = false,
}) => {
  const spinnerSizeClass = `spinner-size-${size}`;
  const containerClass = overlay
    ? "loading-spinner-overlay"
    : "loading-spinner-inline";

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div className={`loading-spinner ${spinnerSizeClass}`} aria-hidden="true" />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
