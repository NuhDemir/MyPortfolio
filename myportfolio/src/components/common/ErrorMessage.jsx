// frontend/src/components/common/ErrorMessage.jsx
import React from "react";
import "../../assets/css/components.css"; // Genel bileşen stillerini import et

/**
 * Standart bir hata mesajı kutusu gösterir.
 * @param {object} props - Bileşen props'ları.
 * @param {string} [props.message="Bir hata oluştu."] - Gösterilecek hata mesajı.
 * @param {string} [props.title="Hata"] - (İsteğe bağlı) Hata kutusu başlığı.
 */
const ErrorMessage = ({ message = "Bir hata oluştu.", title }) => {
  // Mesajın boş olup olmadığını kontrol et, boşsa hiçbir şey gösterme
  if (!message) {
    return null;
  }

  return (
    <div className="error-message-container" role="alert">
      {title && <h4 className="error-title">{title}</h4>}
      <p className="error-text">
        <span className="error-icon" aria-hidden="true">
          ⚠️
        </span>{" "}
        {/* Uyarı ikonu */}
        {message}
      </p>
    </div>
  );
};

export default ErrorMessage;
