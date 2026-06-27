import React, { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { subscribeToNewsletter } from "../../services/newsletterService";
import "./NewsletterBanner.css";

export const NewsletterBanner = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    const result = await subscribeToNewsletter(email);
    
    if (result.success) {
      setStatus("success");
      setMessage(result.message);
      setTimeout(() => {
        setStatus("idle");
        setEmail("");
      }, 5000);
    } else {
      setStatus("error");
      setMessage(result.message);
    }
  };

  return (
    <div className="newsletter-banner">
      <div className="newsletter-banner-bg" />
      <div className="newsletter-banner-content">
        <div className="newsletter-banner-text">
          <div className="newsletter-banner-icon">
            <Mail size={24} />
          </div>
          <div>
            <h3>Haftalık Bültene Abone Ol</h3>
            <p>Yazılım, teknoloji ve kariyer ipuçlarını kaçırmamak için hemen ücretsiz katılın.</p>
          </div>
        </div>
        
        <div className="newsletter-banner-form-wrapper">
          {status === "success" ? (
            <div className="newsletter-banner-success">
              <CheckCircle size={20} />
              <span>{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-banner-form">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                required
              />
              <button 
                type="submit" 
                disabled={status === "loading" || !email}
              >
                {status === "loading" ? "..." : <ArrowRight size={18} />}
              </button>
            </form>
          )}
          {status === "error" && <p className="newsletter-banner-error">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default NewsletterBanner;
