import React, { useRef } from "react";
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

// Admin Paneli Bileşenleri ve Sayfaları
import ProtectedRoute from "./components/common/ProtectedRoute.jsx"; // Giriş kontrolü için
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProjectManagement from "./pages/admin/AdminProjectManagement.jsx";
// import AdminBlogManagement from './pages/admin/AdminBlogManagement.jsx'; // Bu sayfayı oluşturunca import edilecek

// Özel Hook'lar ve Context
import { useMouseLightEffect } from "./hooks/useMouseLightEffect";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// Stil Dosyaları
import "./style/global.css";

// --- Ana Sayfa İçeriğini Barındıran Yardımcı Bileşen ---
// Bu bileşen, sadece ana sayfa düzenini ve mantığını içerir.
// Böylece App bileşeni sadece yönlendirme (routing) üzerine odaklanabilir.
const AppContent = () => {
  const { theme } = useTheme(); // Tema context'ini kullan

  // Navbar'dan yumuşak kaydırma (smooth scroll) için ref'ler
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  // Belirtilen bölüme kaydıran yardımcı fonksiyon
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Mouse takip eden ışık efektini etkinleştir
  useMouseLightEffect(true);

  return (
    // Tema değişikliğinde arka plan renginin güncellenmesi için
    <div style={{ backgroundColor: theme.background }}>
      <Navbar
        onScrollToAbout={() => scrollToSection(aboutRef)}
        onScrollToProjects={() => scrollToSection(projectsRef)}
        onScrollToContact={() => scrollToSection(contactRef)}
      />
      <div className="content-container">
        <Main />
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

// --- Ana Uygulama Bileşeni ---
// Bu bileşen, uygulamanın genel yönlendirme mantığını yönetir.
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="mouse-light-overlay"></div> {/* Efektin kapsayıcısı */}
        <Routes>
          {/* 1. Genel Ziyaretçi Rotası */}
          <Route path="/" element={<AppContent />} />

          {/* 2. Admin Giriş Sayfası Rotası (Korumasız) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* 3. Korunmuş Admin Rotaları */}
          {/* Bu sarmalayıcı, içindeki tüm rotalara erişimden önce kullanıcı girişi kontrolü yapar. */}
          <Route element={<ProtectedRoute />}>
            {/* AdminLayout, tüm admin sayfaları için ortak sidebar ve navbar'ı sağlar. */}
            <Route path="/admin" element={<AdminLayout />}>
              {/* /admin adresine gidildiğinde varsayılan olarak Dashboard'u göster */}
              <Route index element={<AdminDashboard />} />
              {/* Diğer admin sayfaları */}
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjectManagement />} />
              {/* 
                Blog yönetim sayfasını oluşturduktan sonra bu satırı aktif hale getirebilirsin:
                <Route path="blog" element={<AdminBlogManagement />} /> 
              */}
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
