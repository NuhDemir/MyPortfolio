// frontend/src/components/common/ErrorMessage.jsx
import React from "react";
import "@shared/styles/base/components.css"; // Genel bileşen stillerini import et

const DEFAULT_MESSAGE = "Bir hata oluştu.";

const resolveMessage = ({ message, error }) => {
  if (message) {
    return message;
  }

  if (!error) {
    return DEFAULT_MESSAGE;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  return DEFAULT_MESSAGE;
};

/**
 * Standart bir hata mesajı kutusu gösterir.
 * @param {object} props - Bileşen props'ları.
 * @param {string} [props.message] - Gösterilecek hata mesajı.
 * @param {Error|object|string} [props.error] - Backend veya JS hata nesnesi.
 * @param {string} [props.title="Hata"] - (İsteğe bağlı) Hata kutusu başlığı.
 */
const ErrorMessage = ({ message, error, title }) => {
  const resolvedMessage = resolveMessage({ message, error });

  if (!resolvedMessage) {
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
        {resolvedMessage}
      </p>
    </div>
  );
};

export default ErrorMessage;
