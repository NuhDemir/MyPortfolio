import React, { useEffect, useState, useRef } from "react"; // useRef'i import et
import Header from "./Header.jsx";
import StatCard from "./StatCard.jsx";
import ServiceCard from "./ServiceCard/ServiceCard.jsx";
import Modal from "@shared/ui/Modal.jsx";
import useAboutGsapAnimations from "../../hooks/useAboutGsapAnimation.js";

// SVG'leri URL olarak import et
import ProgrammingLangSvg from "/assets/icons/about/programmingLanguage.svg";
import DevToolsTechSvg from "/assets/icons/about/DevToolsTech.svg";
import PodcastTalksSvg from "/assets/icons/about/PodcastTalks.svg";
import ProjectsWorkSvg from "/assets/icons/about/ProjectsWork.svg";

import ProgrammingLangContent from "./ServiceCard/ModalContents/ProgrammingLangContent.jsx";
import DevToolsTechContent from "./ServiceCard/ModalContents/DevToolsTechContent.jsx";
import PodcastTalksContent from "./ServiceCard/ModalContents/PodcastTalksContent.jsx";
import ProjectsWorkContent from "./ServiceCard/ModalContents/ProjectsWorkContent.jsx";
import "./style/About.css";

const GITHUB_USERNAME = "NuhDemir";

const services = [
  {
    id: "programming",
    icon: ProgrammingLangSvg,
    iconBgColor: "#ffdc58",
    title: "Programming Lang",
    description: "Modern dillerle ölçeklenebilir kod yazma.",
    modalContent: <ProgrammingLangContent />,
  },
  {
    id: "devtools",
    icon: DevToolsTechSvg,
    iconBgColor: "#9c27b0",
    title: "Dev Tools & Tech",
    description: "Verimlilik için en yeni araçları kullanma.",
    modalContent: <DevToolsTechContent />,
  },
  {
    id: "podcast",
    icon: PodcastTalksSvg,
    iconBgColor: "#f44336",
    title: "Podcast & Talks",
    description: "Bilgi ve teknoloji trendlerini paylaşma.",
    modalContent: <PodcastTalksContent />,
  },
  {
    id: "projects",
    icon: ProjectsWorkSvg,
    iconBgColor: "#2196f3",
    title: "Projects & Work",
    description: "Kalite odaklı etkili projeler sunma.",
    modalContent: <ProjectsWorkContent />,
  },
];

const About = () => {
  // Referansları burada, ana bileşende oluştur
  const headerRef = useRef(null);
  const statsContainerRef = useRef(null);
  const servicesContainerRef = useRef(null);

  // Hook'u çağır ve oluşturduğun referansları ona gönder
  useAboutGsapAnimations(headerRef, statsContainerRef, servicesContainerRef);

  const [repoCount, setRepoCount] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [activeModalId, setActiveModalId] = useState(null);
  const [currentModalData, setCurrentModalData] = useState({
    title: "",
    content: null,
  });

  useEffect(() => {
    // GitHub verisi çekme (değişiklik yok)
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then((res) => res.json())
      .then((data) => {
        setRepoCount(data.public_repos);
        setFollowers(data.followers);
      });
  }, []);

  const openModal = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      setCurrentModalData({
        title: service.title,
        content: service.modalContent,
      });
      setActiveModalId(serviceId);
    }
  };

  const closeModal = () => setActiveModalId(null);

  return (
    <div className="about-container">
      {/* Referansları ilgili DOM elementlerine bağla */}
      <div ref={headerRef}>
        <Header />
      </div>
      <div className="about-grid">
        <div className="stats-container" ref={statsContainerRef}>
          <StatCard value={repoCount ?? "..."} label="Repositories" />
          <StatCard value={followers ?? "..."} label="Followers" />
        </div>
        <div className="services-section" ref={servicesContainerRef}>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              iconBgColor={service.iconBgColor}
              title={service.title}
              description={service.description}
              onLearnMoreClick={() => openModal(service.id)}
            />
          ))}
        </div>
      </div>
      <Modal
        isOpen={activeModalId !== null}
        onClose={closeModal}
        title={currentModalData.title}
      >
        {currentModalData.content}
      </Modal>
    </div>
  );
};

export default About;
