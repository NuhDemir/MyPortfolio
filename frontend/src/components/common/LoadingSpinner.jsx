// frontend/src/components/common/LoadingSpinner.jsx
import React from "react";
import "../../assets/css/components.css"; // Genel bileşen stillerini import et

/**
 * Basit bir yükleme animasyonu ve isteğe bağlı mesaj gösterir.
 * @param {object} props - Bileşen props'ları.
 * @param {string} [props.message="Yükleniyor..."] - Spinner altında gösterilecek mesaj.
 * @param {string} [props.size="medium"] - Spinner boyutu ('small', 'medium', 'large').
 * @param {boolean} [props.overlay=false] - Tam ekran overlay olarak gösterilip gösterilmeyeceği.
 */
const LoadingSpinner = ({
  message = "Yükleniyor...",
  size = "medium",
  overlay = false,
}) => {
  const spinnerSizeClass = `spinner-size-${size}`; // Boyut için CSS sınıfı
  const containerClass = overlay
    ? "loading-spinner-overlay"
    : "loading-spinner-inline"; // Konteyner sınıfı

  return (
    <div className={containerClass}>
      <div className={`loading-spinner ${spinnerSizeClass}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
