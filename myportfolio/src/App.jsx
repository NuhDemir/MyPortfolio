// frontend/src/App.jsx
import React, { useState, useRef } from "react"; // useRef ekledik
import { Navbar } from "./components/Navbar/Navbar.jsx";
import Main from "./components/Main/Main.jsx";
import About from "./components/About/About.jsx";
import ProjectList from "./components/Projects/ProjectList/ProjectList.jsx";
import Comments from "./components/Comments/Comments.jsx";
import MessageForm from "./components/Message/MessageForm.jsx";
import Footer from "./components/Footer/Footer.jsx";
import SocialLinks from "./components/SocialLinks/SocialLinks.jsx";
import Splash from "./components/Splash/Splash.jsx";
import "./style/global.css";

function App() {
  const [splashComplete, setSplashComplete] = useState(false);

  // Her bölüm için bir ref oluştur
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null); // MessageForm için

  const handleSplashComplete = () => {
    setSplashComplete(true);
  };

  // Kaydırma fonksiyonu
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {!splashComplete && <Splash onComplete={handleSplashComplete} />}

      <div className={`app-container ${splashComplete ? "show" : "hide"}`}>
        {/* Navbar'a kaydırma fonksiyonlarını prop olarak geçirelim */}
        <Navbar
          onScrollToAbout={() => scrollToSection(aboutRef)}
          onScrollToProjects={() => scrollToSection(projectsRef)}
          onScrollToContact={() => scrollToSection(contactRef)}
        />
        <div className="content-container">
          {/* Ana içerik aynı kalır */}
          <Main />
        </div>
        <SocialLinks />
      </div>

      {/* Bölümlere ref ve id ekleyelim */}
      {/* About Bölümü */}
      <section id="about-section" ref={aboutRef}>
        {" "}
        {/* ID ve Ref eklendi */}
        <About />
      </section>

      {/* Projects Bölümü */}
      <section id="projects-section" ref={projectsRef}>
        {" "}
        {/* ID ve Ref eklendi */}
        <ProjectList />
      </section>

      {/*Comments Bölümü (ID ve Ref eklenmedi, isteğe bağlı) */}
      <Comments />

      {/*Contact (Message) Bölümü */}
      <section id="contact-section" ref={contactRef}>
        {" "}
        {/* ID ve Ref eklendi */}
        <MessageForm />
      </section>

      {/* Footer Bölümü */}
      <Footer />
    </>
  );
}

export default App;
