import { useEffect, useState, useRef } from "react";
import { useTheme } from "@core";
import { Github, Youtube, Linkedin, Instagram, FileText } from "lucide-react";
import { useSound } from "@shared";
import MainV2 from "@features/main/v2/MainV2.jsx";
import "./HomePage.css";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/NuhDemir", Icon: Github },
  { name: "YouTube", href: "https://www.youtube.com/@Yaz%C4%B1l%C4%B1mK%C4%B1raathanesi", Icon: Youtube },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/nuh-demir-69b737261/", Icon: Linkedin },
  { name: "Instagram", href: "https://www.instagram.com/yazilimkiraathanesi/", Icon: Instagram },
];

const SocialLink = ({ href, Icon, label }) => {
  const playClickSound = useSound("/audio/action-click.mp3", 0.3);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="home__social-link"
      aria-label={label}
      onClick={() => playClickSound()}
    >
      <Icon size={22} />
    </a>
  );
};

const HomePage = () => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    document.title = "Nuh Demir | Portfolio";
  }, []);

  return (
    <div className={`home theme-${theme}`}>
      <MainV2 onIsPlayingChange={setIsPlaying} />

      <nav className="home__social" aria-label="Sosyal medya bağlantıları">
        {socialLinks.map((link) => (
          <SocialLink key={link.name} href={link.href} Icon={link.Icon} label={link.name} />
        ))}
        <a
          href="/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="home__social-link"
          aria-label="CV"
        >
          <FileText size={22} />
        </a>
      </nav>
    </div>
  );
};

export default HomePage;
