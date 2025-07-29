import React from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Send } from "lucide-react";
import "./style/ContactPanel.css";

const ContactPanel = () => {
  return (
    <motion.div
      className="contact-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>İletişim & Sosyal Medya</h3>
      <p className="contact-intro">
        Bir proje hakkında konuşmak, bir soru sormak veya sadece merhaba demek
        için aşağıdaki kanallardan bana ulaşabilirsiniz.
      </p>

      <div className="contact-links">
        <a href="mailto:nuhdemir.dev@gmail.com" className="contact-link-item">
          <Mail size={20} />
          <span>nuhdemir.dev@gmail.com</span>
        </a>
        <a
          href="https://www.linkedin.com/in/nuh-demir-69b737261/"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link-item"
        >
          <Linkedin size={20} />
          <span>/nuh-demir</span>
        </a>
        <a
          href="https://github.com/NuhDemir"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link-item"
        >
          <Github size={20} />
          <span>/NuhDemir</span>
        </a>
      </div>

      <div className="contact-form-section">
        <h4>Hızlı Mesaj</h4>
        <form
          action="https://formspree.io/f/xblojjrn" // Formspree endpoint'inizi buraya koyun
          method="POST"
          className="contact-form"
        >
          <div className="form-group">
            <label htmlFor="dev-email">E-posta Adresiniz</label>
            <input
              type="email"
              id="dev-email"
              name="email"
              required
              placeholder="ornek@mail.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dev-message">Mesajınız</label>
            <textarea
              id="dev-message"
              name="message"
              required
              rows="4"
              placeholder="Proje fikrinizi veya sorunuzu buraya yazın..."
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">
            <span>Gönder</span>
            <Send size={16} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactPanel;
