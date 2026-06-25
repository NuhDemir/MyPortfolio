import { Suspense, lazy, useEffect } from "react";
import { MapPin, Mail, Phone, Linkedin, Github } from "lucide-react";
import { MessageForm } from "@features/message";
import "./ContactPage.css";

const Comments = lazy(() =>
  import("@features/comments").then((m) => ({ default: m.Comments }))
);

const contactInfo = {
  email: import.meta.env.VITE_CONTACT_EMAIL || "info@nuhdemir.com",
  phone: import.meta.env.VITE_CONTACT_PHONE || "",
  location: import.meta.env.VITE_CONTACT_LOCATION || "Türkiye",
  googleMapsEmbed:
    import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d385397.6150498494!2d28.68252859765625!3d41.00527000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa57b7b7b7b7b%3A0x7b7b7b7b7b7b7b7b!2zVHVya2V5!5e0!3m2!1sen!2str!4v1625000000000!5m2!1sen!2str",
  linkedin: import.meta.env.VITE_LINKEDIN_URL || "#",
  github: import.meta.env.VITE_GITHUB_URL || "#",
};

const ContactPage = () => {
  useEffect(() => {
    document.title = "İletişim | Nuh Demir";
  }, []);

  return (
    <div className="contact">
      <section className="contact__hero">
        <h1 className="contact__title">İletişim</h1>
        <p className="contact__subtitle">
          Projeleriniz veya iş birliği fırsatları için benimle iletişime geçin.
        </p>
      </section>

      <div className="contact__grid">
        <div className="contact__form-card">
          <h2>Mesaj Gönder</h2>
          <MessageForm />
        </div>

        <div className="contact__info-stack">
          <div className="contact__info-card">
            <h2>İletişim Bilgileri</h2>

            <ul className="contact__info-list">
              <li className="contact__info-item">
                <Mail size={18} />
                <span>
                  <strong>E-posta</strong>
                  <a href={`mailto:${contactInfo.email}`}>
                    {contactInfo.email}
                  </a>
                </span>
              </li>

              {contactInfo.phone && (
                <li className="contact__info-item">
                  <Phone size={18} />
                  <span>
                    <strong>Telefon</strong>
                    <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                  </span>
                </li>
              )}

              <li className="contact__info-item">
                <MapPin size={18} />
                <span>
                  <strong>Konum</strong>
                  <span>{contactInfo.location}</span>
                </span>
              </li>
            </ul>

            <div className="contact__social">
              <a
                href={contactInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__social-link"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href={contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__social-link"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div className="contact__map">
            <iframe
              title="Konum Haritası"
              src={contactInfo.googleMapsEmbed}
              width="100%"
              height="260"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="contact__comments">
            <h2>Yorumlar</h2>
            <Suspense
              fallback={<div className="component-loader">Yükleniyor...</div>}
            >
              <Comments />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
