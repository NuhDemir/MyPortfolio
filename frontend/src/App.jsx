import React, { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout ve Ana Sayfa Bileşenleri
import { Navbar } from "./components/Navbar/Navbar.jsx";
import Main from "./components/Main/Main.jsx";
import About from "./components/About/About.jsx";
import ProjectList from "./components/Projects/ProjectList/ProjectList.jsx";
import Comments from "./components/Comments/Comments.jsx";
import MessageForm from "./components/Message/MessageForm.jsx";
import Footer from "./components/Footer/Footer.jsx";
import SocialLinks from "./components/SocialLinks/SocialLinks.jsx";
import Splash from "./components/Splash/Splash.jsx";
import ParticleSystem from "./components/common/ParticleSystem.jsx"; // Yeni parçacık sistemi

// Admin Paneli Bileşenleri (Eğer varsa)
// import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
// import AdminLayout from "./components/Admin/AdminLayout.jsx";
// ... diğer admin importları

// Özel Hook'lar ve Context
import { useMouseLightEffect } from "./hooks/useMouseLightEffect";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// Stil Dosyaları
import "./style/global.css";

// --- Ana Sayfa İçeriğini Barındıran ve State'leri Yöneten Yardımcı Bileşen ---
const AppContent = () => {
  const { theme } = useTheme();

  // Parçacık sistemi ve ses kontrolcüsü için merkezi state'ler
  const [splashComplete, setSplashComplete] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [audioData, setAudioData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Navbar'dan yumuşak kaydırma için ref'ler
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

  // Scroll pozisyonunu dinleyen useEffect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse efektini sadece splash bittikten sonra başlat
  useMouseLightEffect(splashComplete);

  return (
    <>
      {/* Splash ekranı tamamlanana kadar gösterilir */}
      {!splashComplete && <Splash onComplete={handleSplashComplete} />}

      {/* Parçacık sistemi arka planda her zaman render edilir ve state'leri prop olarak alır */}
      <ParticleSystem
        audioData={audioData}
        scrollY={scrollY}
        isDarkMode={theme === "dark"}
        isPlaying={isPlaying}
      />

      {/* Ana uygulama içeriği, splash bittikten sonra görünür hale gelir */}
      <div className={`app-container ${splashComplete ? "show" : ""}`}>
        <Navbar
          onScrollToAbout={() => scrollToSection(aboutRef)}
          onScrollToProjects={() => scrollToSection(projectsRef)}
          onScrollToContact={() => scrollToSection(contactRef)}
        />
        <div className="content-container">
          {/* Main bileşenine state'leri güncelleyecek fonksiyonları prop olarak iletiyoruz */}
          <Main
            onIsPlayingChange={setIsPlaying}
            onAudioDataChange={setAudioData}
          />
        </div>
        <SocialLinks />

        {/* Sayfanın diğer bölümleri */}
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

// --- Ana Uygulama Bileşeni (Sadece Yönlendirme ve Tema Sağlayıcı) ---
function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Ana sayfa ve admin dışı tüm yolları AppContent'e yönlendir */}
          <Route path="/*" element={<AppContent />} />

          {/* Admin paneli rotalarınız varsa buraya ekleyebilirsiniz: */}
          {/* 
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjectManagement />} />
            </Route>
          </Route> 
          */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
