import { Link } from "react-router-dom";
import { Github, Linkedin, Youtube, Instagram, MessageCircle } from "lucide-react";
import "./FooterV2.css";

const socialLinks = [
  { href: "https://github.com/NuhDemir", Icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/nuh-demir-69b737261/", Icon: Linkedin, label: "LinkedIn" },
  { href: "https://www.youtube.com/@Yaz%C4%B1l%C4%B1mK%C4%B1raathanesi", Icon: Youtube, label: "YouTube" },
  { href: "https://www.instagram.com/yazilimkiraathanesi/", Icon: Instagram, label: "Instagram" },
];

export const FooterV2 = () => (
  <footer className="ft2" role="contentinfo">
    <div className="ft2__inner">
      <Link to="/" className="ft2__brand" aria-label="Nuh Demir Ana Sayfa">
        <span className="ft2__brand-name">Nuh Demir</span>
      </Link>

      <p className="ft2__copy">
        &copy; {new Date().getFullYear()} Nuh Demir. Tüm hakları saklıdır.
      </p>

      <nav aria-label="Sosyal medya">
        <ul className="ft2__social">
          {socialLinks.map(({ href, Icon, label }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="ft2__social-link"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </footer>
);
