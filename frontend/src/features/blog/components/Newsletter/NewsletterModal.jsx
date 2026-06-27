import React, { useState, useEffect } from "react";
import { X, Mail, CheckCircle, ArrowRight } from "lucide-react";
import { subscribeToNewsletter } from "../../services/newsletterService";
import "./NewsletterModal.css";

export const NewsletterModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    const result = await subscribeToNewsletter(email);
    
    if (result.success) {
      setStatus("success");
      setMessage(result.message);
      // Automatically close after 3 seconds on success
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setEmail("");
      }, 3000);
    } else {
      setStatus("error");
      setMessage(result.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="newsletter-modal-overlay" onClick={onClose}>
      <div className="newsletter-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="newsletter-modal-close" onClick={onClose} aria-label="Kapat">
          <X size={20} />
        </button>

        <div className="newsletter-modal-body">
          <div className="newsletter-modal-icon">
            {status === "success" ? <CheckCircle size={32} /> : <Mail size={32} />}
          </div>
          
          <h2 className="newsletter-modal-title">
            {status === "success" ? "Teşekkürler!" : "Haftalık Bültene Katılın"}
          </h2>
          
          <p className="newsletter-modal-desc">
            {status === "success" 
              ? message 
              : "Yazılım, teknoloji ve kariyer üzerine yazdığım haftalık yazılarımı ve seçtiğim özel içerikleri e-postanıza gönderiyorum. Spam yok, istediğiniz zaman çıkabilirsiniz."}
          </p>

          {status !== "success" && (
            <form onSubmit={handleSubmit} className="newsletter-modal-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="E-posta adresiniz..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  required
                />
              </div>
              
              {status === "error" && <p className="newsletter-modal-error">{message}</p>}
              
              <button 
                type="submit" 
                className="newsletter-modal-btn"
                disabled={status === "loading" || !email}
              >
                {status === "loading" ? "Kaydediliyor..." : (
                  <>
                    Abone Ol <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterModal;
