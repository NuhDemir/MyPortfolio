import React, { useState } from "react";
import { useUserRole } from "@core/context/UserRoleContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, User, MessageSquare, ArrowLeft } from "lucide-react";

// Layout Bileşenlerini import et
import { Navbar } from "@modules/navbar/components/Navbar/Navbar.jsx"; // Navbar eklendi
import Footer from "@modules/footer/components/Footer/Footer.jsx";

// Recruiter Deneyimi için özel bileşenler
import RecruiterHero from "../components/Recruiter/RecruiterHero";
import RecruiterProjectGrid from "../components/Recruiter/RecruiterProjectGrid";
import RecruiterSkills from "../components/Recruiter/RecruiterSkills";
import RecruiterContact from "../components/Recruiter/RecruiterContact";

// Stil dosyası
import "../styles/RecruiterExperience.css";

// Sekme verileri
const tabs = [
  { id: "projects", label: "Projeler", icon: <Briefcase size={18} /> },
  { id: "skills", label: "Yetenekler", icon: <User size={18} /> },
  { id: "contact", label: "İletişim", icon: <MessageSquare size={18} /> },
];

const RecruiterExperience = () => {
  const { resetRole } = useUserRole();
  const [activeTab, setActiveTab] = useState("projects"); // Varsayılan sekme

  // Navbar'dan gelen tıklamaları sekme değişimine yönlendiren fonksiyon
  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
  };

  const renderActiveTabView = () => {
    switch (activeTab) {
      case "skills":
        return <RecruiterSkills key="skills" />;
      case "contact":
        return <RecruiterContact key="contact" />;
      case "projects":
      default:
        return <RecruiterProjectGrid key="projects" />;
    }
  };

  return (
    <motion.div
      className="recruiter-experience-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Navbar'ı entegre et, onScroll prop'larını sekme değiştirme fonksiyonlarına bağla */}
      {/* "Hakkımda" linki, hero bölümünü gösteren "Projeler" sekmesine yönlendirir */}
      <Navbar
        onScrollToAbout={() => handleNavClick("projects")}
        onScrollToProjects={() => handleNavClick("projects")}
        onScrollToContact={() => handleNavClick("contact")}
      />

      {/* "Geri Dön" butonu artık Navbar'ın solunda olacak */}
      <button onClick={resetRole} className="recruiter-exit-btn">
        <ArrowLeft size={18} />
        <span>Geri Dön</span>
      </button>

      <main className="recruiter-main-content">
        <RecruiterHero />

        <div className="recruiter-tabs-container">
          <nav className="recruiter-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className={`recruiter-tab-btn ${
                  activeTab === tab.id ? "active" : ""
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    className="active-tab-underline"
                    layoutId="recruiterTabUnderline"
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="recruiter-tab-content">
            <AnimatePresence mode="wait">
              {renderActiveTabView()}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default RecruiterExperience;
