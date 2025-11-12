import { Suspense, lazy, useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Navbar } from "@modules/navbar/components/Navbar/Navbar.jsx";
import Main from "@modules/main/components/Main/Main.jsx";
import About from "@modules/about/components/About/About.jsx";
import ProjectList from "@modules/projects/components/Projects/ProjectList/ProjectList.jsx";
import BlogShowcase from "@modules/blog/components/BlogShowcase/BlogShowcase.jsx";
import MessageForm from "@modules/message/components/Message/MessageForm.jsx";
import Footer from "@modules/footer/components/Footer/Footer.jsx";
import SocialLinks from "@modules/social/components/SocialLinks/SocialLinks.jsx";
import DeveloperExperience from "@modules/developer/pages/DeveloperExperience.jsx";
import RecruiterExperience from "@modules/recruiter/pages/RecruiterExperience.jsx";
import { useTheme } from "@core/context/ThemeContext.jsx";
import { useUserRole } from "@core/context/UserRoleContext.jsx";
import { useBackendKeepAlive } from "@shared/hooks/useBackendKeepAlive.js";
import "@shared/styles/base/global.css";

const Comments = lazy(() =>
  import("@modules/comments/components/Comments/Comments.jsx")
);
const AdminRoutes = lazy(() => import("@modules/admin/routes/AdminRoutes.jsx"));
const BlogListPage = lazy(() => import("@modules/blog/pages/BlogListPage.jsx"));
const BlogDetailPage = lazy(() =>
  import("@modules/blog/pages/BlogDetailPage.jsx")
);

const DefaultExperience = () => {
  const { theme } = useTheme();
  const [, setScrollY] = useState(0);
  const [, setAudioData] = useState(null);
  const [, setIsPlaying] = useState(false);

  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const blogRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`app-container show theme-${theme}`}>
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
      <section id="blog-section" ref={blogRef}>
        <BlogShowcase />
      </section>
      <section id="comments-section">
        <Suspense
          fallback={<div className="component-loader">Yükleniyor...</div>}
        >
          <Comments />
        </Suspense>
      </section>
      <section id="contact-section" ref={contactRef}>
        <MessageForm />
      </section>
      <Footer />
    </div>
  );
};

const AppContent = () => {
  const { hasSelectedRole, role } = useUserRole();

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

const App = () => {
  // Backend Keep-Alive: Render.com ücretsiz planında 15 dakikada bir uyuma durumunu engelle
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5000/api";
  
  useBackendKeepAlive({
    apiUrl: API_BASE_URL,
    intervalMinutes: 10, // Her 10 dakikada bir ping at
    enabled: true, // Production'da aktif, gerekirse import.meta.env.PROD ile kontrol edilebilir
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={<div className="component-loader">Yükleniyor...</div>}
            >
              <AdminRoutes />
            </Suspense>
          }
        />
        <Route path="/" element={<AppContent />} />
        <Route
          path="/blog"
          element={
            <Suspense
              fallback={<div className="component-loader">Yükleniyor...</div>}
            >
              <BlogListPage />
            </Suspense>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <Suspense
              fallback={<div className="component-loader">Yükleniyor...</div>}
            >
              <BlogDetailPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
