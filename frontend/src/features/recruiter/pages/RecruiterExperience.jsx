import React, { useState } from "react";
import { useUserRole } from "@core";
import { AnimatePresence } from "framer-motion";
import { Briefcase, User, MessageSquare, ArrowLeft } from "lucide-react";
import { NavbarV2 } from "@features/navbar/v2/NavbarV2.jsx";
import { FooterV2 } from "@features/footer/v2/FooterV2.jsx";
import { RecruiterHero, RecruiterProjectGrid, RecruiterSkills, RecruiterContact } from "@features/recruiter";

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
      <NavbarV2 />

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

      <FooterV2 />
    </motion.div>
  );
};

export default RecruiterExperience;
