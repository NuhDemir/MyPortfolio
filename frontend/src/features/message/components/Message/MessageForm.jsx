import React, { useState } from "react";
import { IoClose, IoCheckmark, IoSend, IoPaperPlane } from "react-icons/io5";
import "./MessageForm.scss"; // Entegre edilmiş SCSS dosyasını import et

const MessageForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

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
      const response = await fetch("https://formspree.io/f/xblojjrn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setIsFormVisible(false);
        setFormData({ name: "", email: "", message: "" });
      } else {
        const data = await response.json();
        throw new Error(
          data.errors?.map((err) => err.message).join(", ") ||
            "Mesaj gönderimi başarısız oldu."
        );
      }
    } catch (err) {
      setError(err.message || "Ağ hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowForm = () => setIsFormVisible(true);
  const handleCloseForm = () => setIsFormVisible(false);
  const handleReset = () => {
    setIsSubmitted(false);
    setError(null);
  };

  return (
    <section className="message-container">
      {isSubmitted ? (
        <div className="success-message">
          <div className="success-icon">
            <IoCheckmark size={32} />
          </div>
          <h2>Teşekkürler!</h2>
          <p>
            Mesajınız başarıyla gönderildi. En kısa sürede size geri dönüş
            yapacağız.
          </p>
          <button onClick={handleReset} className="form-button">
            <IoPaperPlane />
            Yeni Mesaj Gönder
          </button>
        </div>
      ) : (
        <>
          <header className="message-header">
            <h1>Bana Mesaj Gönderin!</h1>
            <p>
              Fikirlerinizi, sorularınızı veya geri bildirimlerinizi
              gönderebilirsiniz.
            </p>
            {!isFormVisible && (
              <button onClick={handleShowForm} className="form-button centered">
                <IoSend />
                Mesaj Gönder
              </button>
            )}
          </header>

          {isFormVisible && (
            <div className="form-wrapper">
              <button
                onClick={handleCloseForm}
                className="close-button"
                aria-label="Formu kapat"
              >
                <IoClose size={56} /> Kapat
              </button>
              <form onSubmit={handleSubmit} className="message-form" noValidate>
                <div className="form-group">
                  <label htmlFor="name">İsim</label>
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
                  <label htmlFor="email">E-posta</label>
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
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="form-button"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loader"></div>
                        <span>Gönderiliyor...</span>
                      </>
                    ) : (
                      <>
                        <IoSend />
                        <span>Mesaj Gönder</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default MessageForm;
