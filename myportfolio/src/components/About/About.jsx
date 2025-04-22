import React, { useEffect, useState } from "react";
import Header from "./Header.jsx";
import ProgrammingLangSvg from "../../assets/icons/about/programmingLanguage.svg";
import DevToolsTechSvg from "../../assets/icons/about/DevToolsTech.svg";
import PodcastTalksSvg from "../../assets/icons/about/PodcastTalks.svg";
import ProjectsWorkSvg from "../../assets/icons/about/ProjectsWork.svg";
import "./style/About.css";
import StatCard from "./StatCard.jsx";
import ServiceCard from "./ServiceCard/ServiceCard.jsx";
import useGsapAnimations from "../../hooks/useAboutGsapAnimation.js";

const GITHUB_USERNAME = "NuhDemir";

const About = () => {
  const { statsContainerRef, servicesContainerRef } = useGsapAnimations();

  const [repoCount, setRepoCount] = useState(null);
  const [followers, setFollowers] = useState(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then((res) => res.json())
      .then((data) => {
        setRepoCount(data.public_repos);
        setFollowers(data.followers);
      })
      .catch((err) => console.error("GitHub verisi çekilemedi", err));
  }, []);

  return (
    <div className="about-container">
      <div>
        <Header />
      </div>

      <div className="about-grid">
        {/* Stats displayed vertically in left column */}
        <div className="stats-container" ref={statsContainerRef}>
          <div className="stat-section">
            <StatCard value={repoCount ?? "Loading..."} label="Repositories" />
          </div>
          <div className="stat-section">
            <StatCard value={followers ?? "Loading..."} label="Followers" />
          </div>
        </div>

        {/* Service cards in 2x2 grid in right column */}
        <div className="services-section" ref={servicesContainerRef}>
          <ServiceCard
            icon={ProgrammingLangSvg}
            iconBgColor="#ffdc58"
            textColor="#26261B"
            title="Programming Lang"
            description="Creating scalable, maintainable code using modern languages."
          />
          <ServiceCard
            icon={DevToolsTechSvg}
            iconBgColor="#9c27b0"
            textColor="#26261B"
            title="Dev Tools & Tech"
            description="Leveraging cutting-edge tools for maximum productivity."
          />
          <ServiceCard
            icon={PodcastTalksSvg}
            iconBgColor="#f44336"
            textColor="#26261B"
            title="Podcast & Talks"
            description="Insightful podcasts sharing knowledge and tech trends."
          />
          <ServiceCard
            icon={ProjectsWorkSvg}
            iconBgColor="#2196f3"
            textColor="#26261B"
            title="Projects & Work"
            description="Insightful podcasts sharing knowledge and tech trends."
          />
        </div>
      </div>
    </div>
  );
};

export default About;
