import React, { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Ana Deneyim Bileşenleri (Mevcut Siteniz)
import { Navbar } from "./components/Navbar/Navbar.jsx";
import Main from "./components/Main/Main.jsx";
import About from "./components/About/About.jsx";
import ProjectList from "./components/Projects/ProjectList/ProjectList.jsx";
import Comments from "./components/Comments/Comments.jsx";
import MessageForm from "./components/Message/MessageForm.jsx";
import Footer from "./components/Footer/Footer.jsx";
import SocialLinks from "./components/SocialLinks/SocialLinks.jsx";
import Splash from "./components/Splash/Splash.jsx";
import ParticleSystem from "./components/common/ParticleSystem.jsx";

// Yeni Deneyim Sayfaları (İskelet olarak)
import DeveloperExperience from "./pages/DeveloperExperience";
import RecruiterExperience from "./pages/RecruiterExperience";

// Özel Hook'lar ve Context
import { useDynamicCursor } from "./hooks/useDynamicCursor.js";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useUserRole } from "./context/UserRoleContext.jsx"; // Rol Context'i

// Stil Dosyaları
import "./style/global.css";

// --- 1. VARSAYILAN DENEYİM (Mevcut Siteniz) ---
// Bu bileşen, henüz rol seçilmediğinde gösterilecek olan standart portfolyo sitenizdir.
const DefaultExperience = () => {
  const { theme } = useTheme();
  const [splashComplete, setSplashComplete] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [audioData, setAudioData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useDynamicCursor(); // Dinamik imleci etkinleştir

  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const handleSplashComplete = () => {
    setSplashComplete(true);
  };

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
    <>
      {!splashComplete && <Splash onComplete={handleSplashComplete} />}
      <ParticleSystem
        audioData={audioData}
        scrollY={scrollY}
        isDarkMode={theme === "dark"}
        isPlaying={isPlaying}
      />
      <div className={`app-container ${splashComplete ? "show" : ""}`}>
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
    </>
  );
};

// --- 2. ANA UYGULAMA BİLEŞENİ (Yönlendirici) ---
function App() {
  const { hasSelectedRole, role } = useUserRole();

  // Rol seçimine göre hangi arayüzün render edileceğini belirleyen fonksiyon
  const renderExperience = () => {
    // Eğer bir rol seçilmişse, ilgili deneyimi render et
    if (hasSelectedRole) {
      switch (role) {
        case "developer":
          return <DeveloperExperience />;
        case "recruiter":
          return <RecruiterExperience />;
        default:
          // Beklenmedik bir rol değeri varsa varsayılana dön
          return <DefaultExperience />;
      }
    }
    // Eğer henüz bir rol seçilmemişse, varsayılan siteyi göster
    return <DefaultExperience />;
  };

  return (
    <ThemeProvider>
      {/* UserRoleProvider zaten main.jsx'te olduğu için burada tekrar gerek yok */}
      <Router>
        {/*
          Routes ve Route kullanmak yerine, doğrudan renderExperience fonksiyonunu çağırıyoruz.
          Bu, tüm sayfanın "deneyim"e göre değiştiği durumlarda daha basit bir yaklaşımdır.
          Eğer /developer, /recruiter gibi URL'ler isterseniz, o zaman Routes/Route yapısı kullanılır.
        */}
        {renderExperience()}
      </Router>
    </ThemeProvider>
  );
}

export default App;
