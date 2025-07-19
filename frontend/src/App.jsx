// frontend/src/App.jsx
import React, { useState, useRef } from "react"; // useEffect eklendi
import { Navbar } from "./components/Navbar/Navbar.jsx";
import Main from "./components/Main/Main.jsx";
import About from "./components/About/About.jsx";
import ProjectList from "./components/Projects/ProjectList/ProjectList.jsx";
import Comments from "./components/Comments/Comments.jsx";
import MessageForm from "./components/Message/MessageForm.jsx";
import Footer from "./components/Footer/Footer.jsx";
import SocialLinks from "./components/SocialLinks/SocialLinks.jsx";
import Splash from "./components/Splash/Splash.jsx";
// global.css artık main.jsx üzerinden yüklenecek.
// import "./style/global.css";
import { useMouseLightEffect } from "./hooks/useMouseLightEffect";
import { useTheme } from "./context/ThemeContext"; // Temayı kullanmak için

function App() {
  const [splashComplete, setSplashComplete] = useState(false);
  const { theme } = useTheme(); // Mevcut temayı al (isteğe bağlı, doğrudan CSS yönetir)

  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const handleSplashComplete = () => {
    setSplashComplete(true);
  };

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useMouseLightEffect(true); // Bu hook kendi içinde bir overlay oluşturuyor

  return (
    <>
      {!splashComplete && <Splash onComplete={handleSplashComplete} />}

      {/* App container'ın görünürlüğü splashComplete state'ine bağlı */}
      <div className={`app-container ${splashComplete ? "show" : ""}`}>
        <Navbar
          onScrollToAbout={() => scrollToSection(aboutRef)}
          onScrollToProjects={() => scrollToSection(projectsRef)}
          onScrollToContact={() => scrollToSection(contactRef)}
        />
        {/* content-container ana sayfa içeriğini (Main) kapsayacaksa Main'i içine alabiliriz */}
        {/* Eğer Main bir section ise ve tam sayfa genişliğinde olacaksa bu div gerekmeyebilir */}
        <div className="content-container">
          <Main />
        </div>
        <SocialLinks />

        {/* Sections */}
        <section id="about-section" ref={aboutRef}>
          <About />
        </section>

        <section id="projects-section" ref={projectsRef}>
          <ProjectList />
        </section>

        {/* Comments section'ı normalde ProjectList'ten sonra veya Footer'dan önce gelir */}
        <section id="comments-section"> {/* ID eklendi isteğe bağlı */}
          <Comments />
        </section>

        <section id="contact-section" ref={contactRef}>
          <MessageForm />
        </section>

        <Footer />
      </div>
    </>
  );
}

export default App;