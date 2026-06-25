import { Mail, MapPin, Github, Linkedin } from "lucide-react";
import contactInfo from "../../data/contactInfo.json";
import "./ContactInfo.css";

const infoItems = [
  {
    Icon: Mail,
    label: "E-posta",
    value: import.meta.env.VITE_CONTACT_EMAIL || contactInfo.email,
    href: `mailto:${import.meta.env.VITE_CONTACT_EMAIL || contactInfo.email}`,
  },
  {
    Icon: MapPin,
    label: "Konum",
    value: import.meta.env.VITE_CONTACT_LOCATION || contactInfo.location,
  },
];

const socialLinks = [
  {
    Icon: Github,
    label: "GitHub",
    href: import.meta.env.VITE_GITHUB_URL || contactInfo.github,
  },
  {
    Icon: Linkedin,
    label: "LinkedIn",
    href: import.meta.env.VITE_LINKEDIN_URL || contactInfo.linkedin,
  },
];

export const ContactInfo = () => (
  <div className="ci">
    <h2 className="ci__heading">İletişim Bilgileri</h2>

    <ul className="ci__list">
      {infoItems.map(({ Icon: InfoIcon, label, value, href }) => (
        <li key={label} className="ci__item">
          <InfoIcon size={22} className="ci__icon" />
          <div className="ci__detail">
            <span className="ci__label">{label}</span>
            {href ? (
              <a href={href} className="ci__value ci__value--link">
                {value}
              </a>
            ) : (
              <span className="ci__value">{value}</span>
            )}
          </div>
        </li>
      ))}
    </ul>

    <div className="ci__social">
      {socialLinks.map(({ Icon: SocialIcon, label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="ci__social-link"
          aria-label={label}
        >
          <SocialIcon size={18} />
        </a>
      ))}
    </div>
  </div>
);
