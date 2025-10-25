import { Suspense, lazy, useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar.jsx";
import Main from "../components/Main/Main.jsx";
import About from "../components/About/About.jsx";
import ProjectList from "../components/Projects/ProjectList/ProjectList.jsx";
import MessageForm from "../components/Message/MessageForm.jsx";
import Footer from "../components/Footer/Footer.jsx";
import SocialLinks from "../components/SocialLinks/SocialLinks.jsx";
import DeveloperExperience from "../pages/DeveloperExperience.jsx";
import RecruiterExperience from "../pages/RecruiterExperience.jsx";
import { useTheme } from "../core/context/ThemeContext.jsx";
import { useUserRole } from "../core/context/UserRoleContext.jsx";
import "../style/global.css";

const Comments = lazy(() => import("../components/Comments/Comments.jsx"));
const AdminRoutes = lazy(() =>
  import("../modules/admin/routes/AdminRoutes.jsx")
);

const DefaultExperience = () => {
  const { theme } = useTheme();
  const [, setScrollY] = useState(0);
  const [, setAudioData] = useState(null);
  const [, setIsPlaying] = useState(false);

  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
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

const App = () => (
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default App;
