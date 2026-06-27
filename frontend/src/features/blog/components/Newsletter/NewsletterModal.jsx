import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";
import { subscribeToNewsletter } from "../../services/newsletterService";
import { Modal } from "@shared";
import "./NewsletterModal.css";

export const NewsletterModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

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

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={status === "success" ? "Teşekkürler!" : "Haftalık Bültene Katılın"}
    >
      <div className="newsletter-modal-body">
        <div className="newsletter-modal-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: status === 'success' ? '#10b981' : '#3b82f6' }}>
          {status === "success" ? <CheckCircle size={48} /> : <Mail size={48} />}
        </div>
        
        <p className="newsletter-modal-desc" style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
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
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(0, 0, 0, 0.2)',
                  color: '#fff',
                  marginBottom: '1rem',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            {status === "error" && <p className="newsletter-modal-error" style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{message}</p>}
            
            <button 
              type="submit" 
              className="newsletter-modal-btn"
              disabled={status === "loading" || !email}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--color-primary, #3b82f6)',
                color: '#fff',
                border: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                cursor: status === "loading" || !email ? 'not-allowed' : 'pointer',
                opacity: status === "loading" || !email ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {status === "loading" ? "Kaydediliyor..." : (
                <>
                  Abone Ol <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default NewsletterModal;
