import React, { useState } from "react";
import "./MessageForm.scss";

const MessageForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Formspree kullanarak e-posta gönderme
      // Buraya kendi formspree form ID'nizi ekleyin
      const response = await fetch("https://formspree.io/f/xblojjrn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        throw new Error("Mesaj gönderilirken bir hata oluştu.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="message-container">
      <div className="message-header">
        <h1>Bize mesaj gönderin!</h1>
        <p>
          Fikirlerinizi, sorularınızı veya geri bildirimlerinizi bize
          iletebilirsiniz.
        </p>
      </div>

      {isSubmitted ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Teşekkürler!</h2>
          <p>
            Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
          </p>
          <button className="send-button" onClick={() => setIsSubmitted(false)}>
            Yeni mesaj gönder
          </button>
        </div>
      ) : (
        <form className="message-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Adınız</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-posta Adresiniz</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Mesajınız</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="send-button" disabled={isSubmitting}>
            {isSubmitting ? "Gönderiliyor..." : "Mesaj Gönder"}
            {isSubmitting ? (
              <div className="loader"></div>
            ) : (
              <span className="arrow">→</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default MessageForm;
