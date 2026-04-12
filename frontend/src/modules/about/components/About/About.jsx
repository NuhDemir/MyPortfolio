import React, { useEffect, useState } from "react";
import Header from "./Header.jsx";
import StatCard from "./StatCard.jsx";
import ServiceCard from "./ServiceCard/ServiceCard.jsx";
import Modal from "@shared/ui/Modal.jsx";
import useAboutGsapAnimations from "../../hooks/useAboutGsapAnimation.js";

const PROGRAMMING_LANG_SVG_PATH = "https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947706/portfolio/public/assets/icons/about/programmingLanguage.svg";
const DEVTOOLS_TECH_SVG_PATH = "https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947703/portfolio/public/assets/icons/about/DevToolsTech.svg";
const PODCAST_TALKS_SVG_PATH = "https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947705/portfolio/public/assets/icons/about/PodcastTalks.svg";
const PROJECTS_WORK_SVG_PATH = "https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947709/portfolio/public/assets/icons/about/ProjectsWork.svg";

import ProgrammingLangContent from "./ServiceCard/ModalContents/ProgrammingLangContent.jsx";
import DevToolsTechContent from "./ServiceCard/ModalContents/DevToolsTechContent.jsx";
import PodcastTalksContent from "./ServiceCard/ModalContents/PodcastTalksContent.jsx";
import ProjectsWorkContent from "./ServiceCard/ModalContents/ProjectsWorkContent.jsx";
import "./style/About.css";

const GITHUB_USERNAME = "NuhDemir";

const services = [
  {
    id: "programming",
    icon: PROGRAMMING_LANG_SVG_PATH,
    iconBgColor: "var(--color-accent)",
    title: "Programming Lang",
    description: "Modern dillerle ölçeklenebilir kod yazma.",
    modalContent: <ProgrammingLangContent />,
  },
  {
    id: "devtools",
    icon: DEVTOOLS_TECH_SVG_PATH,
    iconBgColor: "var(--color-primary)",
    title: "Dev Tools & Tech",
    description: "Verimlilik için en yeni araçları kullanma.",
    modalContent: <DevToolsTechContent />,
  },
  {
    id: "podcast",
    icon: PODCAST_TALKS_SVG_PATH,
    iconBgColor: "var(--color-secondary)",
    title: "Podcast & Talks",
    description: "Bilgi ve teknoloji trendlerini paylaşma.",
    modalContent: <PodcastTalksContent />,
  },
  {
    id: "projects",
    icon: PROJECTS_WORK_SVG_PATH,
    iconBgColor: "var(--color-accent)",
    title: "Projects & Work",
    description: "Kalite odaklı etkili projeler sunma.",
    modalContent: <ProjectsWorkContent />,
  },
];

const AboutStarDoodle = () => (
  <svg
    className="about-doodle about-doodle--star"
    viewBox="0 0 44 44"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M22 5 L26 17 L39 17 L29 24 L33 37 L22 30 L11 37 L15 24 L5 17 L18 17 Z"
      fill="var(--color-accent)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const AboutDotsDoodle = () => (
  <svg
    className="about-doodle about-doodle--dots"
    viewBox="0 0 62 34"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="8"
      cy="10"
      r="5.5"
      fill="var(--color-primary)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
    />
    <circle
      cx="30"
      cy="22"
      r="4"
      fill="var(--color-accent)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
    />
    <circle
      cx="52"
      cy="12"
      r="6"
      fill="var(--color-secondary)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
    />
  </svg>
);

const About = () => {
  const { headerRef, statsContainerRef, servicesContainerRef, animateModalContentLoad } =
    useAboutGsapAnimations();

  const [repoCount, setRepoCount] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [activeModalId, setActiveModalId] = useState(null);
  const [currentModalData, setCurrentModalData] = useState({
    title: "",
    content: null,
  });

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then((res) => res.json())
      .then((data) => {
        setRepoCount(data.public_repos);
        setFollowers(data.followers);
      });
  }, []);

  useEffect(() => {
    if (activeModalId === null) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      const modalContentRoot = document.querySelector(".modal-content");
      animateModalContentLoad(modalContentRoot ?? document);
    }, 120);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [activeModalId, animateModalContentLoad]);

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
      <div className="about-shell scribble-card-wrap">
        <div className="about-shell__fill scribble-card-wrap__fill" aria-hidden="true" />

        <div className="about-shell__body naive-shadow">
          <div ref={headerRef} className="about-shell__header">
            <Header />
       
          </div>

          <AboutStarDoodle />
          <AboutDotsDoodle />

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
