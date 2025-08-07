import React, { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";

// Ana Deneyim Bileşenleri
import { Navbar } from "./components/Navbar/Navbar.jsx";
import Main from "./components/Main/Main.jsx";
import About from "./components/About/About.jsx";
import ProjectList from "./components/Projects/ProjectList/ProjectList.jsx";
import Comments from "./components/Comments/Comments.jsx";
import MessageForm from "./components/Message/MessageForm.jsx";
import Footer from "./components/Footer/Footer.jsx";
import SocialLinks from "./components/SocialLinks/SocialLinks.jsx";

// Yeni Deneyim Sayfaları
import DeveloperExperience from "./pages/DeveloperExperience";
import RecruiterExperience from "./pages/RecruiterExperience";

// Özel Hook'lar ve Context
import { useDynamicCursor } from "./hooks/useDynamicCursor.js";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useUserRole } from "./context/UserRoleContext.jsx";

// Stil Dosyası
import "./style/global.css";

// --- 1. VARSAYILAN DENEYİM (Mevcut Siteniz) ---
const DefaultExperience = () => {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [audioData, setAudioData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useDynamicCursor();

  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app-container show">
      <Navbar
        onScrollToAbout={() => scrollToSection(aboutRef)}
        onScrollToProjects={() => scrollToSection(projectsRef)}
        onScrollToContact={() => scrollToSection(contactRef)}
      />
      <div className="content-container">
        <Main
          onIsPlayingChange={setIsPlaying}
          onAudioDataChange={setAudioData}
        />
      </div>
      <SocialLinks />
      <section id="about-section" ref={aboutRef}>
        <About />
      </section>
      <section id="projects-section" ref={projectsRef}>
        <ProjectList />
      </section>
      <section id="comments-section">
        <Comments />
      </section>
      <section id="contact-section" ref={contactRef}>
        <MessageForm />
      </section>
      <Footer />
    </div>
  );
};

// --- 2. ANA UYGULAMA BİLEŞENİ ---
function App() {
  const { hasSelectedRole, role } = useUserRole();

  const renderExperience = () => {
    if (hasSelectedRole) {
      switch (role) {
        case "developer":
          return <DeveloperExperience />;
        case "recruiter":
          return <RecruiterExperience />;
        default:
          return <DefaultExperience />;
      }
    }
    return <DefaultExperience />;
  };

  return (
    <ThemeProvider>
      <Router>{renderExperience()}</Router>
    </ThemeProvider>
  );
}

export default App;
