import React from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Send } from "lucide-react";
import "./style/RecruiterContact.css";

const RecruiterContact = () => {
  return (
    <motion.div
      className="recruiter-contact-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="contact-info">
        <h3>İletişime Geçin</h3>
        <p>
          Proje teklifleri, iş fırsatları veya diğer konular için bana aşağıdaki
          kanallardan ulaşabilir veya yandaki formu doldurabilirsiniz.
        </p>
        <div className="info-links">
          <a href="mailto:nuhdemir.dev@gmail.com">
            <Mail size={18} /> nuhdemir.dev@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/nuh-demir-69b737261/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={18} /> LinkedIn Profilim
          </a>
        </div>
      </div>
      <form
        action="https://formspree.io/f/xblojjrn" // Formspree endpoint'i
        method="POST"
        className="contact-form-recruiter"
      >
        <div className="form-group">
          <label htmlFor="rec-name">Adınız Soyadınız</label>
          <input type="text" id="rec-name" name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="rec-email">E-posta Adresiniz</label>
          <input type="email" id="rec-email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="rec-message">Mesajınız</label>
          <textarea
            id="rec-message"
            name="message"
            rows="5"
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">
          <Send size={16} /> Gönder
        </button>
      </form>
    </motion.div>
  );
};

export default RecruiterContact;
