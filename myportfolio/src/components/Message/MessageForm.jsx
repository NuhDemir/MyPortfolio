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
  const [isFormVisible, setIsFormVisible] = useState(false); // <-- New state

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setIsFormVisible(false); // Hide form after successful submission
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        const data = await response.json();
        if (data.errors) {
          setError(data.errors.map((err) => err.message).join(", "));
        } else {
          throw new Error("Mesaj gönderilirken bir hata oluştu.");
        }
      }
    } catch (err) {
      setError(err.message || "Bir ağ hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowForm = () => {
    setIsFormVisible(true); // Show the form when header button is clicked
  };

  const handleReset = () => {
    setIsSubmitted(false); // Hide success message
    setIsFormVisible(false); // Hide form, show initial header button again
    setError(null); // Clear any previous errors
  };

  return (
    <div className="message-container">
      {/* === Success Message Section === */}
      {isSubmitted ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Thank You!</h2>
          <p>
            Your message has been sent successfully. We will get back to you as
            soon as possible.
          </p>
          {/* This button now resets to the initial state */}
          <button className="send-button" onClick={handleReset}>
            Send new message
          </button>
        </div>
      ) : (
        <>
          {" "}
          {/* === Header Section === */}
          <div className="message-header">
            <h1>Send me message!</h1>
            <p>You can send me your ideas, question or feedback.</p>
            {/* Show this button only if the form is NOT visible */}
            {!isFormVisible && (
              <button
                type="button" // <-- Changed type to "button"
                className="form-button"
                onClick={handleShowForm} // <-- Added onClick handler
              >
                Send message
              </button>
            )}
          </div>
          {/* === Form Section (conditionally rendered) === */}
          {isFormVisible && ( // <-- Render form only if isFormVisible is true
            <form className="message-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">Name</label>
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
                <label htmlFor="email">E-mail</label>
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
                <label htmlFor="message">Your message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                ></textarea>
              </div>

              {/* Display error message inside the form area */}
              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="send-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Gönderiliyor..." : "Mesaj Gönder"}
                {isSubmitting ? (
                  <div className="loader"></div>
                ) : (
                  <span className="arrow">→</span>
                )}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default MessageForm;
