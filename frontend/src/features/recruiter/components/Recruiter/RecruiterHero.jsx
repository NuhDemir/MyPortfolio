import React from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";
import "./style/RecruiterHero.css";

const RecruiterHero = () => {
  return (
    <motion.div
      className="recruiter-hero"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="hero-avatar">
        <img src="https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947776/portfolio/public/assets/icons/main/main.png" alt="Nuh Demir" />
      </div>
      <div className="hero-content">
        <h1>Nuh Demir</h1>
        <h2>Full Stack Developer</h2>
        <p>
          Merhaba! Modern web ve mobil teknolojileriyle kullanıcı odaklı, yüksek
          performanslı ve estetik açıdan zengin dijital deneyimler
          oluşturuyorum. Problem çözme ve yeni teknolojiler öğrenme tutkusuyla
          projelerinize değer katmaya hazırım.
        </p>
        <div className="hero-actions">
          <a href="mailto:nuhdemir.dev@gmail.com" className="hero-btn primary">
            <Mail size={16} /> E-posta Gönder
          </a>
          <a
            href="https://www.linkedin.com/in/nuh-demir-69b737261/"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn secondary"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default RecruiterHero;
