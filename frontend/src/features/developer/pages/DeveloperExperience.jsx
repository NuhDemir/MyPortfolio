import React, { useState, useRef, useEffect } from "react";
import { useUserRole } from "@core";
import { AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, Bot, ArrowRight } from "lucide-react";
import { NavbarV2 } from "@features/navbar/v2/NavbarV2.jsx";
import { FooterV2 } from "@features/footer/v2/FooterV2.jsx";
import { Terminal as TerminalComponent, ProjectPanel, CodeViewer, ContactPanel } from "@features/developer";

// Veri ve Stil
import projectsData from "@features/projects/data/developerProjects.json";
import "../styles/DeveloperExperience.css";

// Başlangıçta gösterilecek karşılama bileşeni
const WelcomeView = () => (
  <motion.div
    className="info-window" // Daha genel bir sınıf adı kullanalım
    key="welcome"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
  >
    <div className="info-window-header">
      <Bot size={16} />
      <span>BİLGİ</span>
    </div>
    <div className="info-window-content">
      <h2>Terminal Aktif</h2>
      <p>
        Portfolyoyu interaktif olarak keşfetmek için sağdaki terminali kullanın
        veya üst menüdeki linklere tıklayın. Başlamak için <strong>help</strong>{" "}
        yazın.
      </p>
      <div className="arrow-indicator">
        <p>Komutları buraya girin</p>
        <ArrowRight />
      </div>
    </div>
  </motion.div>
);

const DeveloperExperience = () => {
  const { resetRole } = useUserRole();
  const [activeView, setActiveView] = useState("welcome");
  const [selectedProject, setSelectedProject] = useState(null);
  const terminalRef = useRef(null); // Terminal bileşenine erişmek için ref

  // Terminale programatik olarak komut göndermek için bir state
  const [commandToRun, setCommandToRun] = useState("");

  // Navbar'dan gelen tıklamaları terminal komutlarına çevir
  const handleNavCommand = (command) => {
    // Terminalde komutu çalıştır ve arayüzü güncelle
    switch (command) {
      case "about":
        setCommandToRun("whoami");
        break;
      case "projects":
        setCommandToRun("projects");
        setActiveView("projects");
        setSelectedProject(null);
        break;
      case "contact":
        setCommandToRun("contact");
        setActiveView("contact");
        break;
    }
  };

  // Terminal'den gelen komutları işle
  const handleTerminalCommand = (command, args) => {
    switch (command) {
      case "showProjects":
        setActiveView("projects");
        setSelectedProject(null);
        break;
      case "showContact":
        setActiveView("contact");
        break;
      case "selectProject":
        const project = projectsData.find(
          (p) => p.id.toLowerCase() === args.toLowerCase()
        );
        if (project) {
          setActiveView("projects");
          setSelectedProject(project);
        }
        break;
      default:
        break;
    }
  };

  // commandToRun state'i değiştiğinde, eğer doluysa, komutu çalıştır ve sonra temizle
  useEffect(() => {
    if (commandToRun && terminalRef.current) {
      terminalRef.current.pushCommand(commandToRun);
      setCommandToRun(""); // Komut çalıştıktan sonra state'i temizle
    }
  }, [commandToRun]);

  const renderActiveView = () => {
    // ... renderActiveView fonksiyonu aynı kalıyor ...
    switch (activeView) {
      case "projects":
        return (
          <motion.div
            key="projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="projects-view-wrapper"
          >
            <ProjectPanel
              projects={projectsData}
              selectedProjectId={selectedProject?.id}
              onSelectProject={setSelectedProject}
            />
            <AnimatePresence>
              {selectedProject && (
                <CodeViewer
                  key={selectedProject.id}
                  project={selectedProject}
                />
              )}
            </AnimatePresence>
          </motion.div>
        );
      case "contact":
        return <ContactPanel key="contact" />;
      default:
        return <WelcomeView />;
    }
  };

  return (
    <motion.div
      className="dev-experience-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Navbar'ı entegre et ve komut fonksiyonlarını prop olarak geç */}
      <NavbarV2 />

      <div className="dev-experience-background"></div>

      {/* Ana içerik alanı */}
      <main className="dev-experience-grid">
        <div className="left-panel">
          <AnimatePresence mode="wait">{renderActiveView()}</AnimatePresence>
        </div>
        <div className="right-panel">
          {/* Terminal'e ref ekle */}
          <TerminalComponent
            ref={terminalRef}
            onCommand={handleTerminalCommand}
          />
        </div>
      </main>

      {/* Footer'ı entegre et */}
      <FooterV2 />

      {/* Moddan çıkış butonu Footer'ın üzerinde kalacak şekilde ayarlanabilir */}
      <button onClick={resetRole} className="exit-button">
        <TerminalIcon size={16} />
        <span>Normal Moda Dön</span>
      </button>
    </motion.div>
  );
};

export default DeveloperExperience;
